import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/colors';
import { Radius, Shadows, FontSize, Spacing } from '../../constants/theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline';
}

export default function GradientButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  size = 'lg',
  variant = 'solid',
}: GradientButtonProps) {
  const heights = { sm: 44, md: 52, lg: 60 };
  const fontSizes = { sm: FontSize.sm, md: FontSize.base, lg: FontSize.md };

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.outlineBtn,
          { height: heights[size] },
          disabled && styles.disabled,
          style,
        ]}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.outlineText,
            { fontSize: fontSizes[size] },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.wrapper, disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={Gradients.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { height: heights[size] }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={[
              styles.text,
              { fontSize: fontSizes[size] },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.pill,
    overflow: 'hidden',
    ...Shadows.button,
  },
  gradient: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  text: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  outlineBtn: {
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.accentStart,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  outlineText: {
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.accentStart,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
