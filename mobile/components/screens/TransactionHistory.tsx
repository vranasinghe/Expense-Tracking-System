import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import TransactionRow from '../ui/TransactionRow';
import { Colors } from '../../constants/colors';
import { FontSize, Spacing, Radius, Shadows } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatCurrency';
import { groupTransactionsByDate } from '../../utils/dateHelpers';
import type { Transaction } from '../../store/types';

interface TransactionHistoryProps {
  visible: boolean;
  onClose: () => void;
}

type Filter = 'all' | 'expense' | 'income';

export default function TransactionHistory({ visible, onClose }: TransactionHistoryProps) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const transactions = useAppStore((s) => s.transactions);
  const currency = useAppStore((s) => s.currency);
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !search ||
        t.note.toLowerCase().includes(search.toLowerCase()) ||
        t.categoryId.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || t.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const grouped = useMemo(() => groupTransactionsByDate(filtered), [filtered]);

  const totalFiltered = filtered.reduce((s, t) => {
    return t.type === 'expense' ? s - t.amount : s + t.amount;
  }, 0);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={Colors.textPrimaryLight} />
          </TouchableOpacity>
          <Text style={styles.title}>All Transactions</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryCount}>{filtered.length} transactions</Text>
          <Text style={[
            styles.summaryTotal,
            { color: totalFiltered >= 0 ? Colors.income : Colors.expense },
          ]}>
            {totalFiltered >= 0 ? '+' : ''}{formatCurrency(totalFiltered, currency)}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              placeholderTextColor={Colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {(['all', 'expense', 'income'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        {grouped.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          <SectionList
            sections={grouped}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionDate}>{section.title}</Text>
                <Text style={styles.sectionTotal}>
                  {formatCurrency(
                    section.data.reduce((s, t) => t.type === 'expense' ? s + t.amount : s, 0),
                    currency
                  )}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View>
                <TransactionRow
                  transaction={item}
                  currency={currency}
                  onDelete={() => handleDelete(item.id)}
                />
              </View>
            )}
            ListFooterComponent={<View style={{ height: 100 }} />}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightBg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.lightCard, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  title: { flex: 1, fontFamily: 'Poppins_700Bold', fontSize: FontSize.xl, color: Colors.textPrimaryLight },
  placeholder: { width: 36 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, marginBottom: Spacing.sm },
  summaryCount: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryTotal: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.lg },
  searchRow: { paddingHorizontal: Spacing.base, marginBottom: Spacing.sm },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.lightCard, borderRadius: Radius.input, paddingHorizontal: Spacing.base, height: 48, gap: Spacing.sm, ...Shadows.card },
  searchInput: { flex: 1, fontFamily: 'Poppins_400Regular', fontSize: FontSize.base, color: Colors.textPrimaryLight },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.base },
  filterChip: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.xs, borderRadius: Radius.pill, backgroundColor: Colors.lightCard, borderWidth: 1, borderColor: Colors.borderLight },
  filterChipActive: { backgroundColor: Colors.accentStart, borderColor: Colors.accentStart },
  filterText: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.sm, color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.xs, backgroundColor: Colors.lightBg },
  sectionDate: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.sm, color: Colors.textPrimaryLight },
  sectionTotal: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.sm, color: Colors.expense },
  listContent: { paddingBottom: Spacing.xxl },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: Spacing.md },
  emptyTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.lg, color: Colors.textPrimaryLight },
  emptySubtext: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
});
