import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../../store/useAppStore';
import GradientButton from '../../components/ui/GradientButton';
import { Colors } from '../../constants/colors';
import { FontSize, Spacing, Radius } from '../../constants/theme';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

export default function BalanceScreen() {
  const [amount, setAmount] = useState('0');
  const setAccountSetup = useAppStore((s) => s.setAccountSetup);
  const user = useAppStore((s) => s.user);

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setAmount(amount.slice(0, -1) || '0');
      return;
    }
    if (key === '.' && amount.includes('.')) return;
    if (amount === '0' && key !== '.') setAmount(key);
    else if (amount.length < 10) setAmount(amount + key);
  };

  const handleContinue = () => {
    const balance = parseFloat(amount) || 0;
    setAccountSetup(user, balance);
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    setAccountSetup(user, 0);
    router.replace('/(tabs)');
  };

  const displayFormatted = () => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-IN');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimaryDark} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Balance Icon */}
        <LinearGradient colors={['#2ED9A0', '#17C3A0']} style={styles.balanceIcon}>
          <Ionicons name="cash-outline" size={32} color="#fff" />
        </LinearGradient>

        <Text style={styles.title}>Set Your Starting Balance</Text>
        <Text style={styles.subtitle}>
          Enter your current cash or wallet balance. This is your baseline — expenses and income will be tracked from here.
        </Text>

        {/* Amount Display */}
        <View style={styles.amountDisplay}>
          <Text style={styles.currencySymbol}>₹</Text>
          <Text style={styles.amountText} numberOfLines={1} adjustsFontSizeToFit>
            {amount === '0' ? '0' : amount}
          </Text>
        </View>

        <Text style={styles.hint}>You can update this anytime in Settings</Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {KEYS.map((row, ri) => (
          <View key={ri} style={styles.keyRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.key, key === '⌫' && styles.backspaceKey]}
                onPress={() => handleKey(key)}
                activeOpacity={0.6}
              >
                <Text style={[styles.keyText, key === '⌫' && styles.backspaceText]}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <GradientButton
          title="Continue"
          onPress={handleContinue}
          style={styles.ctaBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkBg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: 56,
    paddingBottom: Spacing.base,
  },
  backBtn: { padding: 8 },
  skipBtn: { padding: 8 },
  skipText: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.base, color: Colors.textSecondary },
  content: { alignItems: 'center', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.xl },
  balanceIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  title: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xxl, color: Colors.textPrimaryDark, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.xxl },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  currencySymbol: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xxxl, color: Colors.accentStart, marginBottom: 6, marginRight: 4 },
  amountText: { fontFamily: 'Poppins_700Bold', fontSize: 52, color: Colors.textPrimaryDark, flexShrink: 1 },
  hint: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.xs, color: Colors.textSecondary },
  keypad: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, marginTop: Spacing.xl },
  keyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  key: {
    flex: 1,
    height: 60,
    backgroundColor: Colors.darkCardAlt,
    borderRadius: Radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.xs,
  },
  backspaceKey: { backgroundColor: 'rgba(255,107,107,0.12)' },
  keyText: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.xl, color: Colors.textPrimaryDark },
  backspaceText: { color: Colors.expense },
  ctaContainer: { paddingHorizontal: Spacing.xxl, paddingBottom: 40, paddingTop: Spacing.lg },
  ctaBtn: { width: '100%' },
});
