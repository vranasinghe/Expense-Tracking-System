import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Circle, Text as SvgText } from 'react-native-svg';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Gradients } from '../../constants/colors';
import { FontSize, Spacing, Radius, Shadows } from '../../constants/theme';
import { formatCurrency, formatCompact } from '../../utils/formatCurrency';
import { getDailySpending, formatMonthYear } from '../../utils/dateHelpers';
import { DEFAULT_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;
const CHART_HEIGHT = 160;

type Period = 'week' | 'month' | 'year';

function AreaChart({ data, currency }: { data: number[]; currency: string }) {
  if (!data.length || data.every((d) => d === 0)) {
    return (
      <View style={{ height: CHART_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.textSecondary, fontFamily: 'Poppins_400Regular' }}>No data for this period</Text>
      </View>
    );
  }

  const max = Math.max(...data, 1);
  const points = data.map((v, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * CHART_WIDTH,
    y: CHART_HEIGHT - (v / max) * CHART_HEIGHT * 0.85 - 10,
  }));

  // Find peak
  const peakIdx = data.indexOf(Math.max(...data));
  const peakPt = points[peakIdx];

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx} ${prev.y} ${cpx} ${pt.y} ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Defs>
        <SvgGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#2ED9A0" stopOpacity="0.35" />
          <Stop offset="100%" stopColor="#2ED9A0" stopOpacity="0.02" />
        </SvgGradient>
      </Defs>
      {/* Area fill */}
      <Path d={areaD} fill="url(#areaGrad)" />
      {/* Line */}
      <Path d={pathD} stroke="#2ED9A0" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Peak dot */}
      {peakPt && (
        <>
          <Circle cx={peakPt.x} cy={peakPt.y} r={5} fill="#2ED9A0" />
          <Circle cx={peakPt.x} cy={peakPt.y} r={10} fill="rgba(46,217,160,0.2)" />
        </>
      )}
    </Svg>
  );
}

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currency = useAppStore((s) => s.currency);
  const getTransactionsByMonth = useAppStore((s) => s.getTransactionsByMonth);
  const transactions = useAppStore((s) => s.transactions);
  const getTotalSpentThisMonth = useAppStore((s) => s.getTotalSpentThisMonth);
  const getTotalIncomeThisMonth = useAppStore((s) => s.getTotalIncomeThisMonth);

  const monthTxns = getTransactionsByMonth(selectedYear, selectedMonth);
  const totalSpent = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome = monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  // Daily spending data
  const dailyData = getDailySpending(monthTxns, selectedYear, selectedMonth).map((d) => d.amount);

  // Category breakdown
  const allCategories = [...DEFAULT_CATEGORIES, ...INCOME_CATEGORIES];
  const categorySpend: Record<string, number> = {};
  monthTxns.filter((t) => t.type === 'expense').forEach((t) => {
    categorySpend[t.categoryId] = (categorySpend[t.categoryId] || 0) + t.amount;
  });
  const sortedCategories = Object.entries(categorySpend)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const prevMonthDate = new Date(selectedYear, selectedMonth - 1, 1);
  const prevMonthTxns = getTransactionsByMonth(prevMonthDate.getFullYear(), prevMonthDate.getMonth());
  const prevSpent = prevMonthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const pctChange = prevSpent > 0 ? ((totalSpent - prevSpent) / prevSpent) * 100 : 0;

  const goToPrevMonth = () => {
    const d = new Date(selectedYear, selectedMonth - 1, 1);
    setSelectedYear(d.getFullYear());
    setSelectedMonth(d.getMonth());
  };

  const goToNextMonth = () => {
    const d = new Date(selectedYear, selectedMonth + 1, 1);
    if (d <= new Date()) {
      setSelectedYear(d.getFullYear());
      setSelectedMonth(d.getMonth());
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={goToPrevMonth} style={styles.monthArrow}>
            <Ionicons name="chevron-back" size={18} color={Colors.textPrimaryLight} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{formatMonthYear(selectedYear, selectedMonth)}</Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.monthArrow}>
            <Ionicons name="chevron-forward" size={18} color={Colors.textPrimaryLight} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(totalSpent, currency)}</Text>
          </View>
          <View style={[
            styles.pctBadge,
            { backgroundColor: pctChange > 0 ? Colors.expenseBg : Colors.incomeBg },
          ]}>
            <Ionicons
              name={pctChange > 0 ? 'trending-up' : 'trending-down'}
              size={14}
              color={pctChange > 0 ? Colors.expense : Colors.income}
            />
            <Text style={[styles.pctText, { color: pctChange > 0 ? Colors.expense : Colors.income }]}>
              {Math.abs(pctChange).toFixed(0)}% vs last month
            </Text>
          </View>
        </View>

        {/* Period Filter */}
        <View style={styles.filterRow}>
          {(['week', 'month', 'year'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.filterChip, period === p && styles.filterChipActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.filterText, period === p && styles.filterTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Daily Spending</Text>
          <AreaChart data={dailyData} currency={currency} />
          <View style={styles.chartXLabels}>
            {[1, 8, 15, 22, 28].map((d) => (
              <Text key={d} style={styles.xLabel}>{d}</Text>
            ))}
          </View>
        </View>

        {/* Income vs Expense Cards */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={['rgba(46,217,160,0.12)', 'rgba(46,217,160,0.06)']}
            style={styles.statCard}
          >
            <View style={styles.statIconBg}>
              <Ionicons name="trending-up" size={20} color={Colors.income} />
            </View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={[styles.statAmt, { color: Colors.income }]}>
              {formatCurrency(totalIncome, currency)}
            </Text>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(255,107,107,0.12)', 'rgba(255,107,107,0.06)']}
            style={styles.statCard}
          >
            <View style={[styles.statIconBg, { backgroundColor: Colors.expenseBg }]}>
              <Ionicons name="trending-down" size={20} color={Colors.expense} />
            </View>
            <Text style={styles.statLabel}>Expense</Text>
            <Text style={[styles.statAmt, { color: Colors.expense }]}>
              {formatCurrency(totalSpent, currency)}
            </Text>
          </LinearGradient>
        </View>

        {/* Category Breakdown */}
        <View style={styles.categoryCard}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {sortedCategories.length === 0 ? (
            <Text style={styles.emptyText}>No expenses this month</Text>
          ) : (
            sortedCategories.map(([catId, amount]) => {
              const cat = allCategories.find((c) => c.id === catId);
              const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
              return (
                <View key={catId} style={styles.catRow}>
                  <View style={[styles.catIcon, { backgroundColor: cat?.bgColor }]}>
                    <Ionicons name={(cat?.icon ?? 'ellipsis-horizontal-outline') as any} size={16} color={cat?.color} />
                  </View>
                  <View style={styles.catInfo}>
                    <View style={styles.catHeader}>
                      <Text style={styles.catName}>{cat?.name ?? catId}</Text>
                      <Text style={styles.catAmt}>{formatCurrency(amount, currency)}</Text>
                    </View>
                    <View style={styles.catBarBg}>
                      <View
                        style={[
                          styles.catBarFill,
                          { width: `${pct}%` as any, backgroundColor: cat?.color ?? Colors.accentStart },
                        ]}
                      />
                    </View>
                    <Text style={styles.catPct}>{pct.toFixed(0)}%</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightBg },
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xxl, color: Colors.textPrimaryLight, marginBottom: Spacing.sm },
  monthSelector: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  monthArrow: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.lightCard, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  monthLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.base, color: Colors.textPrimaryLight },
  summaryCard: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.lightCard,
    borderRadius: Radius.card,
    padding: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  summaryLabel: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryAmount: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xxl, color: Colors.textPrimaryLight },
  pctBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.pill },
  pctText: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.xs },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.base },
  filterChip: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.xs, borderRadius: Radius.pill, backgroundColor: Colors.lightCard, borderWidth: 1, borderColor: Colors.borderLight },
  filterChipActive: { backgroundColor: Colors.accentStart, borderColor: Colors.accentStart },
  filterText: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.sm, color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  chartCard: { marginHorizontal: Spacing.base, backgroundColor: Colors.lightCard, borderRadius: Radius.card, padding: Spacing.base, marginBottom: Spacing.base, ...Shadows.card },
  chartTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.base, color: Colors.textPrimaryLight, marginBottom: Spacing.md },
  chartXLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: Spacing.xs },
  xLabel: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.xs, color: Colors.textSecondary },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: Spacing.md, marginBottom: Spacing.base },
  statCard: { flex: 1, borderRadius: Radius.card, padding: Spacing.base, gap: Spacing.xs },
  statIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.incomeBg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  statLabel: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
  statAmt: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.lg },
  categoryCard: { marginHorizontal: Spacing.base, backgroundColor: Colors.lightCard, borderRadius: Radius.card, padding: Spacing.base, ...Shadows.card },
  sectionTitle: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.md, color: Colors.textPrimaryLight, marginBottom: Spacing.base },
  emptyText: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', paddingVertical: Spacing.xxl },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  catIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  catInfo: { flex: 1 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  catName: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.sm, color: Colors.textPrimaryLight },
  catAmt: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.sm, color: Colors.textPrimaryLight },
  catBarBg: { height: 6, backgroundColor: Colors.lightBg, borderRadius: 3, overflow: 'hidden', marginBottom: 2 },
  catBarFill: { height: '100%', borderRadius: 3 },
  catPct: { fontFamily: 'Poppins_400Regular', fontSize: 10, color: Colors.textSecondary },
});
