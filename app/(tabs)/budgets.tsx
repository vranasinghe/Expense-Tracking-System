import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import BudgetCard from '../../components/ui/BudgetCard';
import CategoryChip from '../../components/ui/CategoryChip';
import GradientButton from '../../components/ui/GradientButton';
import { Colors } from '../../constants/colors';
import { FontSize, Spacing, Radius, Shadows } from '../../constants/theme';
import { DEFAULT_CATEGORIES } from '../../constants/categories';

export default function BudgetsScreen() {
  const insets = useSafeAreaInsets();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [limitAmount, setLimitAmount] = useState('');

  const budgets = useAppStore((s) => s.budgets);
  const currency = useAppStore((s) => s.currency);
  const addBudget = useAppStore((s) => s.addBudget);
  const deleteBudget = useAppStore((s) => s.deleteBudget);
  const getBudgetSpent = useAppStore((s) => s.getBudgetSpent);

  const handleCreate = () => {
    if (!selectedCategory) {
      Alert.alert('Select a category', 'Please select a budget category.');
      return;
    }
    const limit = parseFloat(limitAmount);
    if (!limit || limit <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid budget amount.');
      return;
    }
    addBudget({ categoryId: selectedCategory, limit, period: 'monthly' });
    setShowCreate(false);
    setSelectedCategory(null);
    setLimitAmount('');
  };

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + getBudgetSpent(b.categoryId), 0);
  const overallPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budgets</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreate(true)}>
          <LinearGradient colors={['#2ED9A0', '#17C3A0']} style={styles.createBtnGrad}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createBtnText}>New Budget</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Overall Summary Card */}
        {budgets.length > 0 && (
          <View style={styles.overallCard}>
            <View style={styles.overallHeader}>
              <View>
                <Text style={styles.overallLabel}>Overall Budget</Text>
                <Text style={styles.overallAmount}>
                  {currency}{totalSpent.toLocaleString('en-IN')}
                  <Text style={styles.overallLimit}> / {currency}{totalBudget.toLocaleString('en-IN')}</Text>
                </Text>
              </View>
              <Text style={[
                styles.overallPct,
                { color: overallPct >= 85 ? Colors.expense : overallPct >= 60 ? Colors.budgetWarning : Colors.income }
              ]}>
                {overallPct.toFixed(0)}%
              </Text>
            </View>
            <View style={styles.overallBarBg}>
              <LinearGradient
                colors={overallPct >= 85 ? ['#FF6B6B', '#FF4444'] : ['#2ED9A0', '#17C3A0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.overallBarFill, { width: `${overallPct}%` as any }]}
              />
            </View>
          </View>
        )}

        {budgets.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="wallet-outline" size={40} color={Colors.accentStart} />
            </View>
            <Text style={styles.emptyTitle}>No Budgets Yet</Text>
            <Text style={styles.emptySubtext}>
              Create spending limits for categories to stay on track
            </Text>
            <TouchableOpacity style={styles.emptyCreateBtn} onPress={() => setShowCreate(true)}>
              <Text style={styles.emptyCreateText}>Create First Budget</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Your Budgets</Text>
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={getBudgetSpent(budget.categoryId)}
                currency={currency}
                onDelete={() => {
                  Alert.alert(
                    'Delete Budget',
                    'Are you sure you want to delete this budget?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteBudget(budget.id) },
                    ]
                  );
                }}
              />
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Create Budget Modal */}
      <Modal visible={showCreate} animationType="slide" transparent presentationStyle="overFullScreen">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Create Budget</Text>
            <Text style={styles.modalSubtitle}>Set a monthly spending limit for a category</Text>

            <Text style={styles.inputLabel}>Category</Text>
            <CategoryChip
              categories={DEFAULT_CATEGORIES.filter((c) => c.id !== 'other' && c.id !== 'income' && c.id !== 'savings')}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <Text style={[styles.inputLabel, { marginTop: Spacing.md, paddingHorizontal: Spacing.base }]}>Monthly Limit ({currency})</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencyLabel}>{currency}</Text>
              <TextInput
                style={styles.amountField}
                value={limitAmount}
                onChangeText={setLimitAmount}
                keyboardType="numeric"
                placeholder="5,000"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowCreate(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <GradientButton title="Create Budget" onPress={handleCreate} style={styles.modalCreateBtn} size="md" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightBg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xxl, color: Colors.textPrimaryLight },
  createBtn: { borderRadius: Radius.pill, overflow: 'hidden', ...Shadows.button },
  createBtnGrad: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: Spacing.xs },
  createBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.sm, color: '#fff' },
  overallCard: { marginHorizontal: Spacing.base, backgroundColor: Colors.lightCard, borderRadius: Radius.card, padding: Spacing.base, marginBottom: Spacing.lg, ...Shadows.card },
  overallHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  overallLabel: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
  overallAmount: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xl, color: Colors.textPrimaryLight },
  overallLimit: { fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  overallPct: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xxl },
  overallBarBg: { height: 10, backgroundColor: Colors.lightBg, borderRadius: 5, overflow: 'hidden' },
  overallBarFill: { height: '100%', borderRadius: 5 },
  sectionLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.sm, color: Colors.textSecondary, marginHorizontal: Spacing.base, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.8 },
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: Spacing.xxl, gap: Spacing.md },
  emptyIconBg: { width: 80, height: 80, borderRadius: 24, backgroundColor: Colors.incomeBg, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xl, color: Colors.textPrimaryLight },
  emptySubtext: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
  emptyCreateBtn: { backgroundColor: Colors.incomeBg, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, borderRadius: Radius.pill },
  emptyCreateText: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.base, color: Colors.accentStart },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.lightCard, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: Spacing.md, paddingBottom: 48 },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.base },
  modalTitle: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xl, color: Colors.textPrimaryLight, paddingHorizontal: Spacing.base, marginBottom: Spacing.xs },
  modalSubtitle: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary, paddingHorizontal: Spacing.base, marginBottom: Spacing.lg },
  inputLabel: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.lightBg, borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.borderLight, marginHorizontal: Spacing.base, marginTop: Spacing.xs, paddingHorizontal: Spacing.base, height: 56 },
  currencyLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.lg, color: Colors.accentStart, marginRight: Spacing.sm },
  amountField: { flex: 1, fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.lg, color: Colors.textPrimaryLight },
  modalBtns: { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: Spacing.md, marginTop: Spacing.xxl, alignItems: 'center' },
  cancelBtn: { flex: 1, height: 52, borderRadius: Radius.pill, backgroundColor: Colors.lightBg, borderWidth: 1, borderColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.base, color: Colors.textSecondary },
  modalCreateBtn: { flex: 2 },
});
