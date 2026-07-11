import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function HabitsScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('habits.title')}</Text>

      <View style={styles.empty}>
        <Text style={styles.emptyText}>{t('habits.noHabits')}</Text>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ {t('habits.add')}</Text>
      </TouchableOpacity>
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
    marginBottom: 32,
  },
  empty: {
    backgroundColor: '#172237',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    color: '#AAB6C6',
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#79C7C320',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#79C7C340',
  },
  addButtonText: {
    color: '#79C7C3',
    fontSize: 16,
    fontWeight: '500',
  },
});
