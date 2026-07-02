import { Redirect } from 'expo-router';
import { useAppStore } from '../store/useAppStore';

export default function Index() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const hasSetupAccount = useAppStore((s) => s.hasSetupAccount);

  if (!hasOnboarded) return <Redirect href="/(onboarding)/splash" />;
  if (!hasSetupAccount) return <Redirect href="/(onboarding)/auth" />;
  return <Redirect href="/(tabs)" />;
}
