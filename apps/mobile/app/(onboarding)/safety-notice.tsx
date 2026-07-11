import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/auth';

export default function SafetyNoticeScreen() {
  const { t } = useTranslation();
  const { setOnboardingCompleted } = useAuthStore();

  const handleComplete = () => {
    setOnboardingCompleted(true);
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>!</Text>
      </View>

      <Text style={styles.title}>{t('onboarding.safetyNotice.title')}</Text>
      <Text style={styles.text}>{t('onboarding.safetyNotice.text')}</Text>

      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>{t('onboarding.safetyNotice.cta')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E2B43',
    borderWidth: 2,
    borderColor: '#E2B66F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E2B66F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F7FA',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#AAB6C6',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#79C7C3',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#0B1020',
    fontSize: 16,
    fontWeight: '600',
  },
});
