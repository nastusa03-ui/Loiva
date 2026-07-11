import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ProgressScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('progress.title')}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>—</Text>
          <Text style={styles.statLabel}>{t('progress.avgMood')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>{t('progress.checkIns')}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>{t('progress.sessions')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>{t('progress.techniques')}</Text>
        </View>
      </View>

      <View style={styles.emptyChart}>
        <Text style={styles.emptyText}>{t('progress.noData')}</Text>
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F7FA',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#172237',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#79C7C3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#AAB6C6',
    textAlign: 'center',
  },
  emptyChart: {
    backgroundColor: '#172237',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  emptyText: {
    color: '#AAB6C6',
    fontSize: 14,
    textAlign: 'center',
  },
});
