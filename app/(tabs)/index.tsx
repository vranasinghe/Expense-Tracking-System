import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import TransactionRow from '../../components/ui/TransactionRow';
import { Colors, Gradients } from '../../constants/colors';
import { FontSize, Spacing, Radius, Shadows } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatCurrency';
import { getGreeting } from '../../utils/dateHelpers';
import NotificationsScreen from '../../components/screens/NotificationsScreen';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [showNotifs, setShowNotifs] = useState(false);

  const user = useAppStore((s) => s.user);
  const currency = useAppStore((s) => s.currency);
  const transactions = useAppStore((s) => s.transactions);
  const getTotalSpentThisMonth = useAppStore((s) => s.getTotalSpentThisMonth);
  const getTotalIncomeThisMonth = useAppStore((s) => s.getTotalIncomeThisMonth);
  const getCurrentBalance = useAppStore((s) => s.getCurrentBalance);
  const getUnreadNotificationCount = useAppStore((s) => s.getUnreadNotificationCount);

  const totalSpent = getTotalSpentThisMonth();
  const totalIncome = getTotalIncomeThisMonth();
  const currentBalance = getCurrentBalance();
  const unreadCount = getUnreadNotificationCount();

  const recentTxns = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkBg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ─── Dark Hero Section ─── */}
        <LinearGradient
          colors={['#121212', '#1A1A2E', '#121212']}
          style={styles.heroSection}
        >
          {/* Top Row */}
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>{getGreeting()} 👋</Text>
              <Text style={styles.userName}>{user.name.split(' ')[0]}</Text>
            </View>
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.notifBtn}
                onPress={() => setShowNotifs(true)}
              >
                <Ionicons name="notifications-outline" size={22} color={Colors.textPrimaryDark} />
                {unreadCount > 0 && (
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>
          </View>

          {/* Hero Card */}
          <LinearGradient
            colors={['#1E3D30', '#1A2E28', '#162420']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            {/* Accent blob */}
            <View style={styles.accentBlob} />

            <Text style={styles.heroLabel}>Total Spent This Month</Text>
            <Text style={styles.heroAmount}>{formatCurrency(totalSpent, currency)}</Text>

            <View style={styles.heroDivider} />

            <View style={styles.heroBalanceRow}>
              <Ionicons name="wallet-outline" size={14} color={Colors.accentStart} />
              <Text style={styles.heroBalanceLabel}>Current Balance</Text>
              <Text style={styles.heroBalance}>{formatCurrency(currentBalance, currency)}</Text>
            </View>

            {/* Mini bar */}
            <View style={styles.spendBar}>
              <LinearGradient
                colors={Gradients.accent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.spendBarFill,
                  {
                    width: `${Math.min((totalSpent / (totalIncome || 1)) * 100, 100)}%` as any,
                  },
                ]}
              />
            </View>
            <Text style={styles.spendBarLabel}>
              {((totalSpent / (totalIncome || 1)) * 100).toFixed(0)}% of income spent
            </Text>
          </LinearGradient>

          {/* Quick Stats Row */}
          <View style={styles.statsRow}>
            {/* Income */}
            <View style={[styles.statCard, styles.incomeCard]}>
              <View style={styles.statIconRow}>
                <View style={styles.incomeIconBg}>
                  <Ionicons name="trending-up" size={16} color={Colors.income} />
                </View>
                <Text style={styles.statLabel}>Income</Text>
              </View>
              <Text style={[styles.statAmount, { color: Colors.income }]}>
                {formatCurrency(totalIncome, currency)}
              </Text>
              <Text style={styles.statPeriod}>This month</Text>
            </View>

            {/* Expense */}
            <View style={[styles.statCard, styles.expenseCard]}>
              <View style={styles.statIconRow}>
                <View style={styles.expenseIconBg}>
                  <Ionicons name="trending-down" size={16} color={Colors.expense} />
                </View>
                <Text style={styles.statLabel}>Expenses</Text>
              </View>
              <Text style={[styles.statAmount, { color: Colors.expense }]}>
                {formatCurrency(totalSpent, currency)}
              </Text>
              <Text style={styles.statPeriod}>This month</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ─── Light Body Section ─── */}
        <View style={styles.bodySection}>
          {/* Recent Transactions Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/analytics')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentTxns.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>Tap + to add your first expense</Text>
            </View>
          ) : (
            recentTxns.map((txn) => (
              <TransactionRow
                key={txn.id}
                transaction={txn}
                currency={currency}
              />
            ))
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <NotificationsScreen visible={showNotifs} onClose={() => setShowNotifs(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightBg },
  heroSection: { paddingBottom: 24 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
  },
  greeting: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
  userName: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xxl, color: Colors.textPrimaryDark },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accentStart,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: { fontFamily: 'Poppins_700Bold', fontSize: 8, color: '#fff' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.sm, color: '#fff' },

  heroCard: {
    marginHorizontal: Spacing.base,
    borderRadius: Radius.hero,
    padding: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(46,217,160,0.15)',
    marginBottom: Spacing.md,
  },
  accentBlob: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(46,217,160,0.06)',
    top: -30,
    right: -30,
  },
  heroLabel: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  heroAmount: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.mega, color: Colors.textPrimaryDark, marginBottom: Spacing.md },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: Spacing.md },
  heroBalanceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.md },
  heroBalanceLabel: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  heroBalance: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.base, color: Colors.textPrimaryDark },
  spendBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: Spacing.xs },
  spendBarFill: { height: '100%', borderRadius: 3 },
  spendBarLabel: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.xs, color: Colors.textSecondary },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.card,
    padding: Spacing.base,
    borderWidth: 1,
  },
  incomeCard: { backgroundColor: 'rgba(46,217,160,0.08)', borderColor: 'rgba(46,217,160,0.2)' },
  expenseCard: { backgroundColor: 'rgba(255,107,107,0.08)', borderColor: 'rgba(255,107,107,0.2)' },
  statIconRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  incomeIconBg: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(46,217,160,0.2)', alignItems: 'center', justifyContent: 'center' },
  expenseIconBg: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,107,107,0.2)', alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.xs, color: Colors.textSecondary },
  statAmount: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.md, marginBottom: 2 },
  statPeriod: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.xs, color: Colors.textSecondary },

  bodySection: { backgroundColor: Colors.lightBg, paddingTop: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.lg, color: Colors.textPrimaryLight },
  seeAll: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.sm, color: Colors.accentStart },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxxl, gap: Spacing.md },
  emptyTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.md, color: Colors.textPrimaryLight },
  emptySubtext: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
});
