import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth';

export default function Index() {
  const { isAuthenticated, onboardingCompleted } = useAuthStore();

  if (!onboardingCompleted) {
    return <Redirect href="/(onboarding)/age-gate" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(main)" />;
}
