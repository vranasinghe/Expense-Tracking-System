import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import AmountKeypad from '../ui/AmountKeypad';
import CategoryChip from '../ui/CategoryChip';
import GradientButton from '../ui/GradientButton';
import { Colors, Gradients } from '../../constants/colors';
import { FontSize, Spacing, Radius } from '../../constants/theme';
import { DEFAULT_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';
import type { TransactionType } from '../../store/types';

interface AddExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
  editTransaction?: { id: string; amount: number; type: TransactionType; categoryId: string; note: string };
}

export default function AddExpenseSheet({ visible, onClose, editTransaction }: AddExpenseSheetProps) {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState<TransactionType>(editTransaction?.type ?? 'expense');
  const [amount, setAmount] = useState(editTransaction?.amount?.toString() ?? '0');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(editTransaction?.categoryId ?? null);
  const [saving, setSaving] = useState(false);

  const currency = useAppStore((s) => s.currency);
  const addTransaction = useAppStore((s) => s.addTransaction);
  const editTxn = useAppStore((s) => s.editTransaction);

  const categories = type === 'expense' ? DEFAULT_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('No Category', 'Please select a category.');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      if (editTransaction) {
        editTxn(editTransaction.id, { amount: parsedAmount, type, categoryId: selectedCategory });
      } else {
        addTransaction({
          type,
          amount: parsedAmount,
          categoryId: selectedCategory,
          note: categories.find((c) => c.id === selectedCategory)?.name ?? 'Transaction',
          date: new Date().toISOString(),
        });
      }
      setSaving(false);
      setAmount('0');
      setSelectedCategory(null);
      setType('expense');
      onClose();
    }, 400);
  };

  const handleClose = () => {
    setAmount('0');
    setSelectedCategory(null);
    setType('expense');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Handle + Close */}
          <View style={styles.headerRow}>
            <View style={styles.handle} />
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Type Toggle */}
          <View style={styles.typeToggle}>
            {(['expense', 'income'] as TransactionType[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeBtn,
                  type === t && styles.typeBtnActive,
                  type === t && { backgroundColor: t === 'expense' ? Colors.expense : Colors.income },
                ]}
                onPress={() => {
                  setType(t);
                  setSelectedCategory(null);
                }}
              >
                <Ionicons
                  name={t === 'expense' ? 'trending-down' : 'trending-up'}
                  size={16}
                  color={type === t ? '#fff' : Colors.textSecondary}
                />
                <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amount Keypad */}
          <AmountKeypad value={amount} onChange={setAmount} currency={currency} />

          {/* Category Chips */}
          <Text style={styles.categoryLabel}>Category</Text>
          <CategoryChip
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* Save Button */}
          <View style={styles.saveContainer}>
            <GradientButton
              title={saving ? 'Saving...' : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
              onPress={handleSave}
              loading={saving}
              style={styles.saveBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: Colors.darkBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: Spacing.sm,
  },
  headerRow: {
    alignItems: 'center',
    position: 'relative',
    paddingBottom: Spacing.sm,
  },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderDark, borderRadius: 2 },
  closeBtn: {
    position: 'absolute',
    right: Spacing.base,
    top: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkCardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeToggle: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.darkCardAlt,
    borderRadius: Radius.pill,
    padding: 4,
    gap: 4,
    marginBottom: Spacing.sm,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  typeBtnActive: {},
  typeBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  typeBtnTextActive: { color: '#fff' },
  categoryLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.base,
    marginBottom: 0,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  saveContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  saveBtn: { width: '100%' },
});
