import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function DataScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('settings.sections.data')}</Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>{t('settings.exportData')}</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.option, styles.dangerOption]}>
        <Text style={styles.dangerText}>{t('settings.deleteAccount')}</Text>
      </TouchableOpacity>
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
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#172237',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: '#F4F7FA',
    fontSize: 16,
  },
  arrow: {
    color: '#AAB6C6',
    fontSize: 22,
  },
  dangerOption: {
    backgroundColor: '#E27C8810',
    borderWidth: 1,
    borderColor: '#E27C8840',
  },
  dangerText: {
    color: '#E27C88',
    fontSize: 16,
  },
});
