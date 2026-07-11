import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function MemoryScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('memory.title')}</Text>
      <Text style={styles.description}>{t('memory.description')}</Text>

      <View style={styles.empty}>
        <Text style={styles.emptyText}>{t('memory.empty')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  content: {
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
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#AAB6C6',
    marginBottom: 32,
    lineHeight: 20,
  },
  empty: {
    backgroundColor: '#172237',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#AAB6C6',
    fontSize: 14,
    textAlign: 'center',
  },
});
