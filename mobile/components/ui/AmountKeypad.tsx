import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Radius, FontSize, Spacing } from '../../constants/theme';

interface AmountKeypadProps {
  value: string;
  onChange: (val: string) => void;
  currency: string;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

export default function AmountKeypad({ value, onChange, currency }: AmountKeypadProps) {
  const handleKey = (key: string) => {
    Vibration.vibrate(10);
    if (key === '⌫') {
      onChange(value.slice(0, -1) || '0');
      return;
    }
    if (key === '.' && value.includes('.')) return;
    if (value === '0' && key !== '.') {
      onChange(key);
    } else if (value.length < 10) {
      onChange(value + key);
    }
  };

  const displayValue = value || '0';

  return (
    <View style={styles.container}>
      {/* Amount Display */}
      <View style={styles.displayRow}>
        <Text style={styles.currencySymbol}>{currency}</Text>
        <Text style={styles.amountText} numberOfLines={1} adjustsFontSizeToFit>
          {displayValue}
        </Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {KEYS.map((row, ri) => (
          <View key={ri} style={styles.keyRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  key === '⌫' && styles.backspaceKey,
                ]}
                onPress={() => handleKey(key)}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.keyText,
                    key === '⌫' && styles.backspaceText,
                  ]}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
  },
  currencySymbol: {
    fontFamily: 'Poppins_700Bold',
    fontSize: FontSize.xxxl,
    color: Colors.accentStart,
    marginRight: Spacing.xs,
    marginBottom: 4,
  },
  amountText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 48,
    color: Colors.textPrimaryDark,
    flexShrink: 1,
  },
  keypad: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  key: {
    flex: 1,
    height: 64,
    backgroundColor: Colors.darkCardAlt,
    borderRadius: Radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.xs,
  },
  backspaceKey: {
    backgroundColor: 'rgba(255,107,107,0.12)',
  },
  keyText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: FontSize.xl,
    color: Colors.textPrimaryDark,
  },
  backspaceText: {
    fontSize: FontSize.xl,
    color: Colors.expense,
  },
});
