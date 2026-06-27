import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radius, FontSize, Spacing, Shadows } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatCurrency';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import type { Budget } from '../../store/types';
import type { Currency } from '../../store/types';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  currency: Currency;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function BudgetCard({
  budget,
  spent,
  currency,
  onPress,
  onDelete,
}: BudgetCardProps) {
  const category = DEFAULT_CATEGORIES.find((c) => c.id === budget.categoryId);
  const percentage = Math.min((spent / budget.limit) * 100, 100);
  const isOverBudget = spent > budget.limit;

  let progressColor = Colors.budgetGood;
  if (percentage >= 85) progressColor = Colors.budgetDanger;
  else if (percentage >= 60) progressColor = Colors.budgetWarning;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: category?.bgColor }]}>
          <Ionicons
            name={(category?.icon ?? 'receipt-outline') as any}
            size={20}
            color={category?.color ?? Colors.accentStart}
          />
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.categoryName}>{category?.name ?? 'Budget'}</Text>
          <Text style={styles.period}>{budget.period === 'monthly' ? 'This Month' : 'This Week'}</Text>
        </View>
        <View style={styles.amountsBlock}>
          <Text style={[styles.spent, { color: isOverBudget ? Colors.expense : Colors.textPrimaryLight }]}>
            {formatCurrency(spent, currency)}
          </Text>
          <Text style={styles.limit}>/ {formatCurrency(budget.limit, currency)}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%` as any,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.pct, { color: progressColor }]}>
          {percentage.toFixed(0)}% used
        </Text>
        {isOverBudget ? (
          <Text style={styles.overText}>
            Over by {formatCurrency(spent - budget.limit, currency)}
          </Text>
        ) : (
          <Text style={styles.remainText}>
            {formatCurrency(budget.limit - spent, currency)} left
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.lightCard,
    borderRadius: Radius.card,
    padding: Spacing.base,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  titleBlock: { flex: 1 },
  categoryName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: FontSize.base,
    color: Colors.textPrimaryLight,
  },
  period: {
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  amountsBlock: { alignItems: 'flex-end' },
  spent: {
    fontFamily: 'Poppins_700Bold',
    fontSize: FontSize.md,
  },
  limit: {
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  progressBg: {
    height: 8,
    backgroundColor: Colors.lightBg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pct: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: FontSize.xs,
  },
  overText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: FontSize.xs,
    color: Colors.expense,
  },
  remainText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
