export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  isCustom?: boolean;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', icon: 'restaurant-outline', color: '#FF6B6B', bgColor: 'rgba(255,107,107,0.15)' },
  { id: 'transport', name: 'Transport', icon: 'car-outline', color: '#6366F1', bgColor: 'rgba(99,102,241,0.15)' },
  { id: 'shopping', name: 'Shopping', icon: 'bag-outline', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.15)' },
  { id: 'bills', name: 'Bills', icon: 'receipt-outline', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.15)' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film-outline', color: '#EC4899', bgColor: 'rgba(236,72,153,0.15)' },
  { id: 'health', name: 'Health', icon: 'heart-outline', color: '#10B981', bgColor: 'rgba(16,185,129,0.15)' },
  { id: 'education', name: 'Education', icon: 'school-outline', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.15)' },
  { id: 'groceries', name: 'Groceries', icon: 'basket-outline', color: '#84CC16', bgColor: 'rgba(132,204,22,0.15)' },
  { id: 'income', name: 'Income', icon: 'trending-up-outline', color: '#2ED9A0', bgColor: 'rgba(46,217,160,0.15)' },
  { id: 'savings', name: 'Savings', icon: 'save-outline', color: '#14B8A6', bgColor: 'rgba(20,184,166,0.15)' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#9AA0A6', bgColor: 'rgba(154,160,166,0.15)' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'cash-outline', color: '#2ED9A0', bgColor: 'rgba(46,217,160,0.15)' },
  { id: 'freelance', name: 'Freelance', icon: 'laptop-outline', color: '#17C3A0', bgColor: 'rgba(23,195,160,0.15)' },
  { id: 'business', name: 'Business', icon: 'briefcase-outline', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.15)' },
  { id: 'investment', name: 'Investment', icon: 'trending-up-outline', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.15)' },
  { id: 'gift', name: 'Gift', icon: 'gift-outline', color: '#EC4899', bgColor: 'rgba(236,72,153,0.15)' },
  { id: 'other_income', name: 'Other', icon: 'add-circle-outline', color: '#9AA0A6', bgColor: 'rgba(154,160,166,0.15)' },
];
