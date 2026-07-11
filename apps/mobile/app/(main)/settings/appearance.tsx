import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/provider';

export default function AppearanceScreen() {
  const { t } = useTranslation();
  const { mode, setMode, resolved } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('settings.appearance')}</Text>

      <Text style={styles.label}>{t('settings.theme')}</Text>
      {(['light', 'dark', 'system'] as const).map((m) => (
        <TouchableOpacity
          key={m}
          style={[styles.option, mode === m && styles.optionActive]}
          onPress={() => setMode(m)}
        >
          <Text style={[styles.optionText, mode === m && styles.optionTextActive]}>
            {t(`settings.theme${m.charAt(0).toUpperCase() + m.slice(1)}`)}
          </Text>
          {mode === m && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    padding: 24,
    paddingTop: 60,
  },
  back: {
    marginBottom: 16,
  },
  backText: {
    color: '#79C7C3',
    fontSize: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F7FA',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#AAB6C6',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#172237',
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: '#1E2B43',
    borderWidth: 1,
    borderColor: '#79C7C3',
  },
  optionText: {
    color: '#AAB6C6',
    fontSize: 16,
  },
  optionTextActive: {
    color: '#79C7C3',
  },
  check: {
    color: '#79C7C3',
    fontSize: 18,
  },
});
