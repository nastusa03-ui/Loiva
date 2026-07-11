import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AgeGateScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('onboarding.ageGate.title')}</Text>
      <Text style={styles.description}>{t('onboarding.ageGate.description')}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(onboarding)/language')}
      >
        <Text style={styles.buttonText}>{t('onboarding.ageGate.confirm')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton}>
        <Text style={styles.exitText}>{t('onboarding.ageGate.exit')}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F7FA',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#AAB6C6',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
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
  exitButton: {
    marginTop: 16,
    padding: 12,
  },
  exitText: {
    color: '#AAB6C6',
    fontSize: 14,
  },
});
