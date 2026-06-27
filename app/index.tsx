import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/colors';
import { isConfigured } from '../utils/firebase';

export default function Index() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const hasSetupAccount = useAppStore((s) => s.hasSetupAccount);
  const userId = useAppStore((s) => s.userId);
  const authLoading = useAppStore((s) => s.authLoading);

  // If Firebase is configured and loading session, show loading spinner
  if (isConfigured && authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accentStart} />
      </View>
    );
  }

  // 1. Splash screen onboarding
  if (!hasOnboarded) {
    return <Redirect href="/(onboarding)/splash" />;
  }

  // 2. Authentication check (if Firebase is active)
  if (isConfigured && !userId) {
    return <Redirect href="/(onboarding)/auth" />;
  }

  // 3. User details onboarding setup check
  if (!hasSetupAccount) {
    return <Redirect href="/(onboarding)/balance" />;
  }

  // 4. Main App Dashboard
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.darkBg || '#0A0E1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
