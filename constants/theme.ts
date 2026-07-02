import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  input: 16,
  card: 20,
  cardLg: 24,
  hero: 28,
  pill: 50,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  hero: 36,
  mega: 48,
};

export const Shadows = {
  card: {
    shadowColor: '#2ED9A0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardDark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    shadowColor: '#2ED9A0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  fab: {
    shadowColor: '#2ED9A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const CommonStyles = StyleSheet.create({
  flex1: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  screenPadding: { paddingHorizontal: Spacing.base },
  
  // Dark screen
  darkScreen: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  
  // Light screen
  lightScreen: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  
  // Cards
  darkCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...Shadows.cardDark,
  },
  lightCard: {
    backgroundColor: Colors.lightCard,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  
  // Typography
  amountText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: FontSize.mega,
    color: Colors.textPrimaryDark,
  },
  headingDark: {
    fontFamily: 'Poppins_700Bold',
    fontSize: FontSize.xxl,
    color: Colors.textPrimaryDark,
  },
  headingLight: {
    fontFamily: 'Poppins_700Bold',
    fontSize: FontSize.xxl,
    color: Colors.textPrimaryLight,
  },
  subtext: {
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  
  // Input
  inputDark: {
    backgroundColor: Colors.darkCardAlt,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    color: Colors.textPrimaryDark,
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSize.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
});
