import type { Category } from '../constants/categories';

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  note: string;
  date: string; // ISO string
  receiptUri?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  period: 'monthly' | 'weekly';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: 'budget_alert' | 'daily_reminder' | 'weekly_summary';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarColor: string;
}

export type Currency = '₹' | '$' | '€' | '£';

export interface AppState {
  // Auth state
  userId: string | null;
  authLoading: boolean;
  authError: string | null;

  // Setup
  hasOnboarded: boolean;
  hasSetupAccount: boolean;
  
  // User
  user: UserProfile;
  
  // Finance
  startingBalance: number;
  currency: Currency;
  
  // Data
  transactions: Transaction[];
  budgets: Budget[];
  notifications: AppNotification[];
  
  // Settings
  isDarkMode: boolean;
  dailyReminder: boolean;
  biometricEnabled: boolean;
  customCategories: Category[];
  
  // Actions
  setOnboarded: () => void;
  setAccountSetup: (user: UserProfile, balance: number) => Promise<void>;
  
  // Auth & Sync Actions
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  syncWithFirebase: (uid: string) => () => void;

  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  editTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (b: Omit<Budget, 'id' | 'createdAt'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  setCurrency: (c: Currency) => Promise<void>;
  setDarkMode: (v: boolean) => Promise<void>;
  setDailyReminder: (v: boolean) => Promise<void>;
  setBiometric: (v: boolean) => Promise<void>;
  updateProfile: (p: Partial<UserProfile>) => Promise<void>;
  updateStartingBalance: (b: number) => Promise<void>;
  addCustomCategory: (cat: Category) => Promise<void>;
  deleteCustomCategory: (id: string) => Promise<void>;
  
  // Computed helpers (called as methods)
  getTotalSpentThisMonth: () => number;
  getTotalIncomeThisMonth: () => number;
  getCurrentBalance: () => number;
  getTransactionsByMonth: (year: number, month: number) => Transaction[];
  getBudgetSpent: (categoryId: string) => number;
  getUnreadNotificationCount: () => number;
}
