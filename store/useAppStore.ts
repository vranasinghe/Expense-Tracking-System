import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState, Transaction, Budget, UserProfile, Currency, AppNotification } from './types';
import type { Category } from '../constants/categories';
import { auth, db, isConfigured } from '../utils/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch
} from 'firebase/firestore';

// ─── Seed Data (Used as local fallback when not authenticated) ─────────────────
const now = new Date();
const thisYear = now.getFullYear();
const thisMonth = now.getMonth();

function makeDate(daysAgo: number, hour = 12, minute = 0) {
  const d = new Date(thisYear, thisMonth, now.getDate() - daysAgo, hour, minute);
  return d.toISOString();
}

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 's1', type: 'income', amount: 55000, categoryId: 'salary', note: 'July Salary', date: makeDate(25, 9, 0) },
  { id: 's2', type: 'income', amount: 8500, categoryId: 'freelance', note: 'Design Project', date: makeDate(18, 14, 30) },
  { id: 's3', type: 'expense', amount: 1250, categoryId: 'food', note: 'Zomato - Dinner', date: makeDate(0, 19, 45) },
  { id: 's4', type: 'expense', amount: 499, categoryId: 'transport', note: 'Ola Cab - Office', date: makeDate(0, 8, 15) },
  { id: 's5', type: 'expense', amount: 3200, categoryId: 'shopping', note: 'Myntra - Shirts', date: makeDate(1, 17, 30) },
  { id: 's6', type: 'expense', amount: 2499, categoryId: 'bills', note: 'Electricity Bill', date: makeDate(2, 11, 0) },
  { id: 's7', type: 'expense', amount: 899, categoryId: 'entertainment', note: 'Netflix + Spotify', date: makeDate(3, 21, 0) },
  { id: 's8', type: 'expense', amount: 650, categoryId: 'food', note: 'Swiggy - Lunch', date: makeDate(1, 13, 30) },
  { id: 's9', type: 'expense', amount: 450, categoryId: 'health', note: 'Pharmacy', date: makeDate(4, 10, 0) },
  { id: 's10', type: 'expense', amount: 5500, categoryId: 'groceries', note: 'Big Basket Order', date: makeDate(5, 16, 0) },
  { id: 's11', type: 'expense', amount: 299, categoryId: 'transport', note: 'Metro Card Recharge', date: makeDate(5, 8, 0) },
  { id: 's12', type: 'expense', amount: 1800, categoryId: 'food', note: 'Family Dinner - Dinner', date: makeDate(6, 20, 0) },
  { id: 's13', type: 'expense', amount: 1200, categoryId: 'entertainment', note: 'Movie Tickets', date: makeDate(7, 18, 30) },
  { id: 's14', type: 'expense', amount: 750, categoryId: 'health', note: 'Doctor Consultation', date: makeDate(8, 11, 0) },
  { id: 's15', type: 'income', amount: 3000, categoryId: 'gift', note: 'Birthday Gift Money', date: makeDate(10, 12, 0) },
  { id: 's16', type: 'expense', amount: 15000, categoryId: 'shopping', note: 'Electronics - TWS Earbuds', date: makeDate(12, 15, 0) },
  { id: 's17', type: 'expense', amount: 600, categoryId: 'bills', note: 'Internet Bill', date: makeDate(14, 10, 0) },
  { id: 's18', type: 'expense', amount: 320, categoryId: 'food', note: 'Café Coffee Day', date: makeDate(2, 16, 0) },
  { id: 's19', type: 'expense', amount: 2000, categoryId: 'education', note: 'Udemy Course', date: makeDate(15, 14, 0) },
  { id: 's20', type: 'expense', amount: 4500, categoryId: 'bills', note: 'House Rent portion', date: makeDate(20, 10, 0) },
];

const SEED_BUDGETS: Budget[] = [
  { id: 'b1', categoryId: 'food', limit: 8000, period: 'monthly', createdAt: makeDate(30) },
  { id: 'b2', categoryId: 'transport', limit: 3000, period: 'monthly', createdAt: makeDate(30) },
  { id: 'b3', categoryId: 'shopping', limit: 10000, period: 'monthly', createdAt: makeDate(30) },
  { id: 'b4', categoryId: 'entertainment', limit: 2000, period: 'monthly', createdAt: makeDate(30) },
  { id: 'b5', categoryId: 'health', limit: 3000, period: 'monthly', createdAt: makeDate(30) },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function isThisMonth(isoDate: string) {
  const d = new Date(isoDate);
  return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
}

// ─── Firebase Real-time listeners storage ──────────────────────────────────────
let unsubUserDoc: any = null;
let unsubTransactions: any = null;
let unsubBudgets: any = null;
let unsubNotifications: any = null;

function clearSync() {
  if (unsubUserDoc) unsubUserDoc();
  if (unsubTransactions) unsubTransactions();
  if (unsubBudgets) unsubBudgets();
  if (unsubNotifications) unsubNotifications();
  unsubUserDoc = null;
  unsubTransactions = null;
  unsubBudgets = null;
  unsubNotifications = null;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──
      userId: null,
      authLoading: isConfigured,
      authError: null,

      hasOnboarded: false,
      hasSetupAccount: false,
      user: { name: 'Arjun Sharma', email: 'arjun@example.com', avatarColor: '#2ED9A0' },
      startingBalance: 100000,
      currency: '₹',
      transactions: SEED_TRANSACTIONS,
      budgets: SEED_BUDGETS,
      notifications: [
        {
          id: 'n1',
          type: 'budget_alert',
          title: 'Food Budget Alert 🍕',
          message: "You've used 78% of your Food budget this month.",
          isRead: false,
          createdAt: makeDate(0, 10, 0),
        },
        {
          id: 'n2',
          type: 'budget_alert',
          title: 'Shopping Budget Alert 🛍️',
          message: "You've exceeded your Shopping budget by ₹8,200.",
          isRead: false,
          createdAt: makeDate(1, 9, 0),
        },
        {
          id: 'n3',
          type: 'weekly_summary',
          title: 'Weekly Summary 📊',
          message: 'You spent ₹7,719 this week — ₹1,200 more than last week.',
          isRead: true,
          createdAt: makeDate(3, 9, 0),
        },
        {
          id: 'n4',
          type: 'daily_reminder',
          title: 'Daily Log Reminder 📝',
          message: "Don't forget to log today's expenses!",
          isRead: true,
          createdAt: makeDate(1, 20, 0),
        },
      ],
      isDarkMode: false,
      dailyReminder: true,
      biometricEnabled: false,
      customCategories: [],

      // ── Actions ──
      setOnboarded: () => set({ hasOnboarded: true }),

      setAccountSetup: async (user, balance) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          try {
            await updateDoc(doc(db, 'users', uid), {
              hasSetupAccount: true,
              startingBalance: balance,
              name: user.name,
              email: user.email,
              avatarColor: user.avatarColor,
            });
          } catch (err) {
            console.error('Error updating account setup in Firestore:', err);
          }
        }
        set({ user, startingBalance: balance, hasSetupAccount: true });
      },

      // ── Auth Actions ──
      login: async (email, password) => {
        if (!isConfigured) {
          throw new Error('Firebase is not configured. Please fill in your .env file credentials.');
        }
        set({ authLoading: true, authError: null });
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          set({ authError: err.message || 'Failed to login' });
          throw err;
        } finally {
          set({ authLoading: false });
        }
      },

      signUp: async (email, password, name) => {
        if (!isConfigured) {
          throw new Error('Firebase is not configured. Please fill in your .env file credentials.');
        }
        set({ authLoading: true, authError: null });
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          await firebaseUpdateProfile(cred.user, { displayName: name });
          
          // Seed new profile
          const avatarColors = ['#2ED9A0', '#6366F1', '#F59E0B', '#EC4899', '#3B82F6'];
          const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

          await setDoc(doc(db, 'users', cred.user.uid), {
            name,
            email,
            avatarColor,
            startingBalance: 0,
            currency: '₹',
            isDarkMode: false,
            dailyReminder: true,
            biometricEnabled: false,
            customCategories: [],
            hasSetupAccount: false,
          });

          // Seed welcome notification
          const welcomeId = 'welcome-note';
          await setDoc(doc(db, 'users', cred.user.uid, 'notifications', welcomeId), {
            id: welcomeId,
            type: 'daily_reminder',
            title: 'Welcome to ExpenseTracker! 🎉',
            message: 'Your Cloud Firebase backend is active and syncs automatically.',
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        } catch (err: any) {
          set({ authError: err.message || 'Failed to sign up' });
          throw err;
        } finally {
          set({ authLoading: false });
        }
      },

      logout: async () => {
        clearSync();
        if (isConfigured) {
          await signOut(auth);
        }
        set({
          userId: null,
          hasSetupAccount: false,
          hasOnboarded: true,
          user: { name: '', email: '', avatarColor: '#2ED9A0' },
          startingBalance: 0,
          transactions: [],
          budgets: [],
          notifications: [],
          customCategories: [],
        });
      },

      syncWithFirebase: (uid) => {
        clearSync();

        // 1. Sync user document details
        unsubUserDoc = onSnapshot(doc(db, 'users', uid), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            set({
              user: {
                name: data.name || '',
                email: data.email || '',
                avatarColor: data.avatarColor || '#2ED9A0',
              },
              startingBalance: data.startingBalance ?? 0,
              currency: data.currency || '₹',
              isDarkMode: data.isDarkMode ?? false,
              dailyReminder: data.dailyReminder ?? true,
              biometricEnabled: data.biometricEnabled ?? false,
              customCategories: data.customCategories || [],
              hasSetupAccount: data.hasSetupAccount ?? false,
            });
          }
        }, (err) => {
          console.error('Error syncing user details:', err);
        });

        // 2. Sync transactions
        unsubTransactions = onSnapshot(
          query(collection(db, 'users', uid, 'transactions'), orderBy('date', 'desc')),
          (snapshot) => {
            const txs: Transaction[] = [];
            snapshot.forEach((docSnap) => {
              txs.push(docSnap.data() as Transaction);
            });
            set({ transactions: txs });
          },
          (err) => {
            console.error('Error syncing transactions:', err);
          }
        );

        // 3. Sync budgets
        unsubBudgets = onSnapshot(
          collection(db, 'users', uid, 'budgets'),
          (snapshot) => {
            const budgetsList: Budget[] = [];
            snapshot.forEach((docSnap) => {
              budgetsList.push(docSnap.data() as Budget);
            });
            set({ budgets: budgetsList });
          },
          (err) => {
            console.error('Error syncing budgets:', err);
          }
        );

        // 4. Sync notifications
        unsubNotifications = onSnapshot(
          query(collection(db, 'users', uid, 'notifications'), orderBy('createdAt', 'desc')),
          (snapshot) => {
            const notes: AppNotification[] = [];
            snapshot.forEach((docSnap) => {
              notes.push(docSnap.data() as AppNotification);
            });
            set({ notifications: notes });
          },
          (err) => {
            console.error('Error syncing notifications:', err);
          }
        );

        return () => {
          clearSync();
        };
      },

      addTransaction: async (t) => {
        const id = genId();
        const uid = get().userId;
        if (uid && isConfigured) {
          await setDoc(doc(db, 'users', uid, 'transactions', id), {
            ...t,
            id,
          });
        } else {
          set((s) => ({
            transactions: [{ ...t, id }, ...s.transactions],
          }));
        }
      },

      editTransaction: async (id, t) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid, 'transactions', id), t);
        } else {
          set((s) => ({
            transactions: s.transactions.map((tx) =>
              tx.id === id ? { ...tx, ...t } : tx
            ),
          }));
        }
      },

      deleteTransaction: async (id) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await deleteDoc(doc(db, 'users', uid, 'transactions', id));
        } else {
          set((s) => ({
            transactions: s.transactions.filter((tx) => tx.id !== id),
          }));
        }
      },

      addBudget: async (b) => {
        const id = genId();
        const createdAt = new Date().toISOString();
        const uid = get().userId;
        if (uid && isConfigured) {
          await setDoc(doc(db, 'users', uid, 'budgets', id), {
            ...b,
            id,
            createdAt,
          });
        } else {
          set((s) => ({
            budgets: [
              ...s.budgets,
              { ...b, id, createdAt },
            ],
          }));
        }
      },

      deleteBudget: async (id) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await deleteDoc(doc(db, 'users', uid, 'budgets', id));
        } else {
          set((s) => ({
            budgets: s.budgets.filter((b) => b.id !== id),
          }));
        }
      },

      markNotificationRead: async (id) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid, 'notifications', id), {
            isRead: true,
          });
        } else {
          set((s) => ({
            notifications: s.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            ),
          }));
        }
      },

      clearAllNotifications: async () => {
        const uid = get().userId;
        if (uid && isConfigured) {
          const batch = writeBatch(db);
          const notifications = get().notifications;
          notifications.forEach((n) => {
            if (!n.isRead) {
              batch.update(doc(db, 'users', uid, 'notifications', n.id), { isRead: true });
            }
          });
          await batch.commit();
        } else {
          set((s) => ({
            notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
          }));
        }
      },

      setCurrency: async (c) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid), { currency: c });
        }
        set({ currency: c });
      },

      setDarkMode: async (v) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid), { isDarkMode: v });
        }
        set({ isDarkMode: v });
      },

      setDailyReminder: async (v) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid), { dailyReminder: v });
        }
        set({ dailyReminder: v });
      },

      setBiometric: async (v) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid), { biometricEnabled: v });
        }
        set({ biometricEnabled: v });
      },

      updateProfile: async (p) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid), p);
        }
        set((s) => ({ user: { ...s.user, ...p } }));
      },

      updateStartingBalance: async (b) => {
        const uid = get().userId;
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid), { startingBalance: b });
        }
        set({ startingBalance: b });
      },

      addCustomCategory: async (cat) => {
        const uid = get().userId;
        const newCat = { ...cat, isCustom: true };
        const updated = [...get().customCategories, newCat];
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid), { customCategories: updated });
        }
        set({ customCategories: updated });
      },

      deleteCustomCategory: async (id) => {
        const uid = get().userId;
        const updated = get().customCategories.filter((c) => c.id !== id);
        if (uid && isConfigured) {
          await updateDoc(doc(db, 'users', uid), { customCategories: updated });
        }
        set({ customCategories: updated });
      },

      // ── Computed ──
      getTotalSpentThisMonth: () => {
        return get()
          .transactions.filter(
            (t) => t.type === 'expense' && isThisMonth(t.date)
          )
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalIncomeThisMonth: () => {
        return get()
          .transactions.filter(
            (t) => t.type === 'income' && isThisMonth(t.date)
          )
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getCurrentBalance: () => {
        const { startingBalance, transactions } = get();
        const totalIncome = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return startingBalance + totalIncome - totalExpense;
      },

      getTransactionsByMonth: (year, month) => {
        return get().transactions.filter((t) => {
          const d = new Date(t.date);
          return d.getFullYear() === year && d.getMonth() === month;
        });
      },

      getBudgetSpent: (categoryId) => {
        return get()
          .transactions.filter(
            (t) =>
              t.categoryId === categoryId &&
              t.type === 'expense' &&
              isThisMonth(t.date)
          )
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getUnreadNotificationCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },
    }),
    {
      name: 'expense-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ─── Setup Auth Listener on Boot ──────────────────────────────────────────────
if (isConfigured) {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      useAppStore.setState({ userId: firebaseUser.uid });
      useAppStore.getState().syncWithFirebase(firebaseUser.uid);
    } else {
      useAppStore.setState({ userId: null, authLoading: false });
      clearSync();
    }
  });
}

