import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Platform } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before fonts are ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen regardless of whether fonts loaded or errored
      SplashScreen.hideAsync().catch(() => {});
      setReady(true);
    }
  }, [fontsLoaded, fontError]);

  // On web, always show the app (don't block on fonts)
  const shouldRender = ready || Platform.OS === 'web';

  if (!shouldRender) {
    // Return a dark background view so there's no white flash
    return <View style={styles.loadingBg} />;
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0A0E1A' },
  loadingBg: { flex: 1, backgroundColor: '#0A0E1A' },
});
