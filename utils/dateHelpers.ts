import type { Transaction } from '../store/types';

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateShort(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function groupTransactionsByDate(
  transactions: Transaction[]
): { title: string; data: Transaction[] }[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groups: Record<string, Transaction[]> = {};
  sorted.forEach((t) => {
    const key = new Date(t.date).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  return Object.entries(groups).map(([dateStr, txns]) => ({
    title: formatDateShort(txns[0].date),
    data: txns,
  }));
}

export function getDailySpending(
  transactions: Transaction[],
  year: number,
  month: number
): { day: number; amount: number }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: { day: number; amount: number }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayTotal = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return (
          t.type === 'expense' &&
          d.getFullYear() === year &&
          d.getMonth() === month &&
          d.getDate() === day
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
    result.push({ day, amount: dayTotal });
  }

  return result;
}

export function getMonthRange(monthsBack: number): { year: number; month: number }[] {
  const result = [];
  const now = new Date();
  for (let i = monthsBack; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return result;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
