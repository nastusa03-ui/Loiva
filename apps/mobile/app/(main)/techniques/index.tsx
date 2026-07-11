import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const CATEGORIES = [
  { key: 'anxiety', color: '#AAA7E8' },
  { key: 'stress', color: '#E2B66F' },
  { key: 'lowMood', color: '#79C7C3' },
  { key: 'grounding', color: '#79C69A' },
  { key: 'compassion', color: '#E27C88' },
  { key: 'actions', color: '#AAA7E8' },
];

export default function TechniquesScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('techniques.title')}</Text>

      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={[styles.categoryCard, { borderLeftColor: cat.color }]}
          onPress={() => router.push(`/(main)/techniques/${cat.key}`)}
        >
          <Text style={styles.categoryName}>
            {t(`techniques.categories.${cat.key}`)}
          </Text>
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
  categoryCard: {
    backgroundColor: '#172237',
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  categoryName: {
    color: '#F4F7FA',
    fontSize: 16,
    fontWeight: '500',
  },
});
