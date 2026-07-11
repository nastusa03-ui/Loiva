import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const SECTIONS = [
  { key: 'general', route: 'general' },
  { key: 'ai', route: 'api-keys' },
  { key: 'notifications', route: 'notifications' },
  { key: 'appearance', route: 'appearance' },
  { key: 'data', route: 'data' },
  { key: 'safety', route: 'safety' },
  { key: 'about', route: 'about' },
];

export default function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      {SECTIONS.map((section) => (
        <TouchableOpacity
          key={section.key}
          style={styles.sectionCard}
          onPress={() => router.push(`/(main)/settings/${section.route}`)}
        >
          <Text style={styles.sectionText}>
            {t(`settings.sections.${section.key}`)}
          </Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F7FA',
    marginBottom: 24,
  },
  sectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#172237',
    padding: 18,
    borderRadius: 12,
    marginBottom: 8,
  },
  sectionText: {
    color: '#F4F7FA',
    fontSize: 16,
  },
  arrow: {
    color: '#AAB6C6',
    fontSize: 22,
  },
});
