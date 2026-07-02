import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState, Transaction, Budget, UserProfile, Currency } from './types';
import type { Category } from '../constants/categories';

// ─── Seed Data ────────────────────────────────────────────────────────────────
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

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──
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

      setAccountSetup: (user, balance) =>
        set({ user, startingBalance: balance, hasSetupAccount: true }),

      addTransaction: (t) =>
        set((s) => ({
          transactions: [{ ...t, id: genId() }, ...s.transactions],
        })),

      editTransaction: (id, t) =>
        set((s) => ({
          transactions: s.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...t } : tx
          ),
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((tx) => tx.id !== id),
        })),

      addBudget: (b) =>
        set((s) => ({
          budgets: [
            ...s.budgets,
            { ...b, id: genId(), createdAt: new Date().toISOString() },
          ],
        })),

      deleteBudget: (id) =>
        set((s) => ({
          budgets: s.budgets.filter((b) => b.id !== id),
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      clearAllNotifications: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      setCurrency: (c) => set({ currency: c }),
      setDarkMode: (v) => set({ isDarkMode: v }),
      setDailyReminder: (v) => set({ dailyReminder: v }),
      setBiometric: (v) => set({ biometricEnabled: v }),

      updateProfile: (p) =>
        set((s) => ({ user: { ...s.user, ...p } })),

      updateStartingBalance: (b) => set({ startingBalance: b }),

      addCustomCategory: (cat) =>
        set((s) => ({
          customCategories: [...s.customCategories, { ...cat, isCustom: true }],
        })),

      deleteCustomCategory: (id) =>
        set((s) => ({
          customCategories: s.customCategories.filter((c) => c.id !== id),
        })),

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
