export const Colors = {
  // Backgrounds
  darkBg: '#121212',
  darkBgSecondary: '#1A1A1A',
  darkCard: '#1E1E1E',
  darkCardAlt: '#252525',
  lightBg: '#F7F8FA',
  lightBgSecondary: '#FFFFFF',
  lightCard: '#FFFFFF',

  // Accent (Mint Gradient)
  accentStart: '#2ED9A0',
  accentEnd: '#17C3A0',
  accentMid: '#25D4A0',

  // Semantic
  expense: '#FF6B6B',
  expenseBg: 'rgba(255,107,107,0.12)',
  income: '#2ED9A0',
  incomeBg: 'rgba(46,217,160,0.12)',

  // Text
  textPrimaryDark: '#FFFFFF',
  textPrimaryLight: '#1A1A1A',
  textSecondary: '#9AA0A6',
  textMuted: '#6B7280',
  textPlaceholder: '#555A5F',

  // Border
  borderDark: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(0,0,0,0.08)',

  // Overlay
  overlayDark: 'rgba(0,0,0,0.6)',
  overlayLight: 'rgba(255,255,255,0.08)',

  // Budget progress
  budgetGood: '#2ED9A0',
  budgetWarning: '#F5A623',
  budgetDanger: '#FF6B6B',

  // Icon backgrounds (light screens)
  iconBgMint: 'rgba(46,217,160,0.15)',
  iconBgRed: 'rgba(255,107,107,0.15)',
  iconBgOrange: 'rgba(245,166,35,0.15)',
  iconBgBlue: 'rgba(99,102,241,0.15)',
  iconBgPurple: 'rgba(168,85,247,0.15)',
};

export const Gradients = {
  accent: ['#2ED9A0', '#17C3A0'] as const,
  accentH: ['#2ED9A0', '#17C3A0'] as const,
  darkHero: ['#1A1A2E', '#16213E', '#0F3460'] as const,
  darkCard: ['#1E1E2E', '#252540'] as const,
  expenseGrad: ['#FF6B6B', '#FF4444'] as const,
  incomeGrad: ['#2ED9A0', '#17C3A0'] as const,
};
