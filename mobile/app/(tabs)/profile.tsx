import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import GradientButton from '../../components/ui/GradientButton';
import { Colors, Gradients } from '../../constants/colors';
import { FontSize, Spacing, Radius, Shadows } from '../../constants/theme';
import type { Currency } from '../../store/types';
import TransactionHistory from '../../components/screens/TransactionHistory';

const CURRENCIES: Currency[] = ['₹', '$', '€', '£'];

interface SettingRowProps {
  icon: string;
  iconColor?: string;
  iconBg?: string;
  label: string;
  sublabel?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}

function SettingRow({
  icon,
  iconColor = Colors.accentStart,
  iconBg = Colors.iconBgMint,
  label,
  sublabel,
  rightElement,
  onPress,
  showChevron = true,
}: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sublabel && <Text style={styles.settingSubLabel}>{sublabel}</Text>}
      </View>
      {rightElement ?? (showChevron && onPress && (
        <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
      ))}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [showHistory, setShowHistory] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [newBalance, setNewBalance] = useState('');

  const user = useAppStore((s) => s.user);
  const currency = useAppStore((s) => s.currency);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const dailyReminder = useAppStore((s) => s.dailyReminder);
  const biometricEnabled = useAppStore((s) => s.biometricEnabled);
  const startingBalance = useAppStore((s) => s.startingBalance);
  const setCurrency = useAppStore((s) => s.setCurrency);
  const setDarkMode = useAppStore((s) => s.setDarkMode);
  const setDailyReminder = useAppStore((s) => s.setDailyReminder);
  const setBiometric = useAppStore((s) => s.setBiometric);
  const updateStartingBalance = useAppStore((s) => s.updateStartingBalance);
  const logout = useAppStore((s) => s.logout);

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const handleLogOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            router.replace('/(onboarding)/auth');
          } catch (err) {
            console.error('Logout error:', err);
          }
        },
      },
    ]);
  };

  const handleUpdateBalance = () => {
    const b = parseFloat(newBalance);
    if (!isNaN(b) && b >= 0) {
      updateStartingBalance(b);
      setShowBalanceModal(false);
      setNewBalance('');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      {/* Dark Header */}
      <LinearGradient
        colors={['#121212', '#1A1A2E']}
        style={[styles.profileHeader, { paddingTop: insets.top + 16 }]}
      >
        <View style={[styles.avatarLarge, { backgroundColor: user.avatarColor }]}>
          <Text style={styles.avatarLargeText}>{initials}</Text>
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
        <TouchableOpacity style={styles.editProfileBtn}>
          <Ionicons name="pencil-outline" size={14} color={Colors.accentStart} />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* General */}
        <SectionHeader title="General" />
        <View style={styles.section}>
          <SettingRow
            icon="wallet-outline"
            label="Starting Balance"
            sublabel={`${currency}${startingBalance.toLocaleString('en-IN')}`}
            onPress={() => setShowBalanceModal(true)}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="list-outline"
            label="Transaction History"
            sublabel="View all transactions"
            onPress={() => setShowHistory(true)}
          />
          <View style={styles.separator} />
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.iconBgMint }]}>
              <Ionicons name="cash-outline" size={18} color={Colors.accentStart} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Currency</Text>
            </View>
            <View style={styles.currencySelector}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.currencyChip, currency === c && styles.currencyChipActive]}
                  onPress={() => setCurrency(c)}
                >
                  <Text style={[styles.currencyChipText, currency === c && styles.currencyChipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Preferences */}
        <SectionHeader title="Preferences" />
        <View style={styles.section}>
          <SettingRow
            icon="moon-outline"
            iconBg="rgba(139,92,246,0.15)"
            iconColor="#8B5CF6"
            label="Dark Mode"
            rightElement={
              <Switch
                value={isDarkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E7EB', true: Colors.accentStart }}
                thumbColor="#fff"
              />
            }
            showChevron={false}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="notifications-outline"
            iconBg="rgba(245,158,11,0.15)"
            iconColor="#F59E0B"
            label="Daily Reminder"
            sublabel="Log today's expenses"
            rightElement={
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                trackColor={{ false: '#E5E7EB', true: Colors.accentStart }}
                thumbColor="#fff"
              />
            }
            showChevron={false}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="download-outline"
            iconBg="rgba(59,130,246,0.15)"
            iconColor="#3B82F6"
            label="Export Data"
            sublabel="Download as CSV"
            onPress={() => Alert.alert('Export', 'CSV export feature coming soon!')}
          />
        </View>

        {/* Security */}
        <SectionHeader title="Security" />
        <View style={styles.section}>
          <SettingRow
            icon="finger-print-outline"
            iconBg="rgba(16,185,129,0.15)"
            iconColor="#10B981"
            label="Biometric Lock"
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometric}
                trackColor={{ false: '#E5E7EB', true: Colors.accentStart }}
                thumbColor="#fff"
              />
            }
            showChevron={false}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="shield-outline"
            iconBg="rgba(99,102,241,0.15)"
            iconColor="#6366F1"
            label="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Your data is stored locally on this device only.')}
          />
        </View>

        {/* Help */}
        <SectionHeader title="Help Center" />
        <View style={styles.section}>
          <SettingRow
            icon="help-circle-outline"
            iconBg="rgba(245,158,11,0.15)"
            iconColor="#F59E0B"
            label="FAQ"
            onPress={() => Alert.alert('FAQ', 'Frequently asked questions coming soon!')}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="mail-outline"
            iconBg="rgba(236,72,153,0.15)"
            iconColor="#EC4899"
            label="Contact Support"
            onPress={() => Alert.alert('Support', 'Contact us at support@expensetracker.app')}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="star-outline"
            iconBg="rgba(245,158,11,0.15)"
            iconColor="#F59E0B"
            label="Rate App"
            onPress={() => Alert.alert('Rate', 'Thank you! Rating will open the app store.')}
          />
        </View>

        {/* App Version */}
        <Text style={styles.version}>ExpenseTracker v1.0.0</Text>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogOut}>
          <Ionicons name="log-out-outline" size={18} color={Colors.expense} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Balance Modal */}
      <Modal visible={showBalanceModal} transparent animationType="slide" presentationStyle="overFullScreen">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Update Starting Balance</Text>
            <View style={styles.balanceInput}>
              <Text style={styles.balanceCurrency}>{currency}</Text>
              <TextInput
                style={styles.balanceField}
                value={newBalance}
                onChangeText={setNewBalance}
                keyboardType="numeric"
                placeholder={startingBalance.toString()}
                placeholderTextColor={Colors.textSecondary}
                autoFocus
              />
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowBalanceModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <GradientButton title="Update" onPress={handleUpdateBalance} style={{ flex: 2 }} size="md" />
            </View>
          </View>
        </View>
      </Modal>

      <TransactionHistory visible={showHistory} onClose={() => setShowHistory(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightBg },
  profileHeader: { alignItems: 'center', paddingBottom: Spacing.xxl, paddingHorizontal: Spacing.base },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, borderWidth: 3, borderColor: 'rgba(46,217,160,0.4)' },
  avatarLargeText: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xxl, color: '#fff' },
  profileName: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xl, color: Colors.textPrimaryDark, marginBottom: 2 },
  profileEmail: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: 'rgba(46,217,160,0.15)', paddingHorizontal: Spacing.base, paddingVertical: Spacing.xs, borderRadius: Radius.pill },
  editProfileText: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.xs, color: Colors.accentStart },
  scroll: { flex: 1 },
  sectionHeader: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.xs, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginHorizontal: Spacing.base, marginTop: Spacing.xl, marginBottom: Spacing.xs },
  section: { marginHorizontal: Spacing.base, backgroundColor: Colors.lightCard, borderRadius: Radius.card, overflow: 'hidden', ...Shadows.card },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.md },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingText: { flex: 1 },
  settingLabel: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.base, color: Colors.textPrimaryLight },
  settingSubLabel: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },
  separator: { height: 1, backgroundColor: Colors.borderLight, marginLeft: Spacing.base + 36 + Spacing.md },
  currencySelector: { flexDirection: 'row', gap: Spacing.xs },
  currencyChip: { width: 32, height: 28, borderRadius: 8, backgroundColor: Colors.lightBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  currencyChipActive: { backgroundColor: Colors.accentStart, borderColor: Colors.accentStart },
  currencyChipText: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.sm, color: Colors.textSecondary },
  currencyChipTextActive: { color: '#fff' },
  version: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xxl },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginHorizontal: Spacing.base, marginTop: Spacing.lg, backgroundColor: Colors.expenseBg, borderRadius: Radius.card, paddingVertical: Spacing.base, borderWidth: 1, borderColor: 'rgba(255,107,107,0.2)' },
  logoutText: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.base, color: Colors.expense },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.lightCard, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing.xl, paddingBottom: 48 },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.lg },
  modalTitle: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xl, color: Colors.textPrimaryLight, marginBottom: Spacing.lg },
  balanceInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.lightBg, borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.borderLight, paddingHorizontal: Spacing.base, height: 60, marginBottom: Spacing.xl },
  balanceCurrency: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xl, color: Colors.accentStart, marginRight: Spacing.sm },
  balanceField: { flex: 1, fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.xl, color: Colors.textPrimaryLight },
  modalBtns: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  cancelBtn: { flex: 1, height: 52, borderRadius: Radius.pill, backgroundColor: Colors.lightBg, borderWidth: 1, borderColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.base, color: Colors.textSecondary },
});
