import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../../store/useAppStore';
import GradientButton from '../../components/ui/GradientButton';
import { Colors } from '../../constants/colors';
import { FontSize, Spacing, Radius } from '../../constants/theme';
import { isConfigured } from '../../utils/firebase';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const storeLogin = useAppStore((s) => s.login);
  const storeSignUp = useAppStore((s) => s.signUp);

  const handleContinue = async () => {
    if (mode === 'signup' && !name.trim()) {
      Alert.alert('Name required', 'Please enter your name to continue.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    if (!isConfigured) {
      // Fallback/Mock Mode if Firebase credentials are not set
      setTimeout(() => {
        setLoading(false);
        useAppStore.setState({
          user: { name: mode === 'signup' ? name : 'Arjun Sharma', email, avatarColor: '#2ED9A0' }
        });
        router.replace('/(onboarding)/balance');
      }, 800);
      return;
    }

    try {
      if (mode === 'signup') {
        await storeSignUp(email, password, name);
        router.replace('/(onboarding)/balance');
      } else {
        await storeLogin(email, password);
        router.replace('/');
      }
    } catch (err: any) {
      Alert.alert('Authentication Error', err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo Area */}
        <View style={styles.logoArea}>
          <LinearGradient
            colors={['#2ED9A0', '#17C3A0']}
            style={styles.logoIcon}
          >
            <Ionicons name="wallet" size={28} color="#fff" />
          </LinearGradient>
          <Text style={styles.logoText}>ExpenseTracker</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'signup'
            ? 'Start tracking your finances today'
            : 'Sign in to continue'}
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Arjun Sharma"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="••••••••"
                placeholderTextColor={Colors.textPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <GradientButton
            title={mode === 'signup' ? 'Create Account' : 'Sign In'}
            onPress={handleContinue}
            loading={loading}
            style={styles.ctaBtn}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-google" size={20} color={Colors.textPrimaryDark} />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={20} color={Colors.textPrimaryDark} />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle */}
          <TouchableOpacity
            onPress={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            style={styles.toggleBtn}
          >
            <Text style={styles.toggleText}>
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.toggleLink}>
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkBg },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xxl, paddingTop: 60, paddingBottom: 40 },
  logoArea: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xxxl },
  logoIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.lg, color: Colors.textPrimaryDark },
  title: { fontFamily: 'Poppins_700Bold', fontSize: FontSize.xxxl, color: Colors.textPrimaryDark, marginBottom: Spacing.xs },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.base, color: Colors.textSecondary, marginBottom: Spacing.xxl },
  form: { gap: Spacing.base },
  inputGroup: { gap: Spacing.xs },
  label: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.sm, color: Colors.textSecondary, marginLeft: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkCardAlt,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    paddingHorizontal: Spacing.base,
    height: 56,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSize.base,
    color: Colors.textPrimaryDark,
  },
  inputFlex: { flex: 1 },
  eyeBtn: { padding: Spacing.xs },
  ctaBtn: { marginTop: Spacing.sm },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginVertical: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.borderDark },
  dividerText: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.xs, color: Colors.textSecondary },
  socialRow: { flexDirection: 'row', gap: Spacing.md },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.darkCardAlt,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    height: 52,
  },
  socialText: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.base, color: Colors.textPrimaryDark },
  toggleBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  toggleText: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.base, color: Colors.textSecondary },
  toggleLink: { fontFamily: 'Poppins_600SemiBold', color: Colors.accentStart },
});
