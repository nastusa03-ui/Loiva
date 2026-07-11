import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '@loiva/i18n';

export default function LanguageScreen() {
  const { t } = useTranslation();

  const selectLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    router.push('/(onboarding)/country');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('onboarding.language.title')}</Text>
      <Text style={styles.description}>{t('onboarding.language.description')}</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => selectLanguage('en')}
      >
        <Text style={styles.optionText}>English</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => selectLanguage('ru')}
      >
        <Text style={styles.optionText}>Русский</Text>
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
  option: {
    backgroundColor: '#172237',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A3850',
  },
  optionText: {
    color: '#F4F7FA',
    fontSize: 18,
    fontWeight: '500',
  },
});
