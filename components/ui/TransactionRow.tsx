import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radius, FontSize, Spacing } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatTime } from '../../utils/dateHelpers';
import { DEFAULT_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';
import type { Transaction } from '../../store/types';
import type { Currency } from '../../store/types';

interface TransactionRowProps {
  transaction: Transaction;
  currency: Currency;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function TransactionRow({
  transaction,
  currency,
  onPress,
  onDelete,
}: TransactionRowProps) {
  const allCategories = [...DEFAULT_CATEGORIES, ...INCOME_CATEGORIES];
  const category = allCategories.find((c) => c.id === transaction.categoryId);
  const isExpense = transaction.type === 'expense';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: category?.bgColor ?? Colors.iconBgMint }]}>
        <Ionicons
          name={(category?.icon ?? 'ellipsis-horizontal-outline') as any}
          size={22}
          color={category?.color ?? Colors.accentStart}
        />
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.note} numberOfLines={1}>
          {transaction.note || category?.name || 'Transaction'}
        </Text>
        <Text style={styles.meta}>
          {category?.name} · {formatTime(transaction.date)}
        </Text>
      </View>

      {/* Amount */}
      <Text
        style={[
          styles.amount,
          { color: isExpense ? Colors.expense : Colors.income },
        ]}
      >
        {isExpense ? '−' : '+'}{formatCurrency(transaction.amount, currency)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.lightCard,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.xs + 2,
    borderRadius: Radius.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  details: {
    flex: 1,
  },
  note: {
    fontFamily: 'Poppins_500Medium',
    fontSize: FontSize.base,
    color: Colors.textPrimaryLight,
    marginBottom: 2,
  },
  meta: {
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSize.xs + 1,
    color: Colors.textSecondary,
  },
  amount: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: FontSize.base,
    marginLeft: Spacing.sm,
  },
});
