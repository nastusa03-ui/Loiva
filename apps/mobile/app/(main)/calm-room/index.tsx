import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const EXERCISES = [
  { key: 'breathing', icon: '🌬️' },
  { key: 'grounding', icon: '🌍' },
  { key: 'timer', icon: '⏱️' },
];

const TIMER_OPTIONS = ['1', '3', '5', '10'];

export default function CalmRoomScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('calmRoom.title')}</Text>
      <Text style={styles.subtitle}>{t('calmRoom.subtitle')}</Text>

      <View style={styles.exercises}>
        {EXERCISES.map((ex) => (
          <TouchableOpacity key={ex.key} style={styles.exerciseCard}>
            <Text style={styles.exerciseIcon}>{ex.icon}</Text>
            <Text style={styles.exerciseName}>
              {t(`calmRoom.exercises.${ex.key}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.timerLabel}>{t('chat.modes.calm')}</Text>
      <View style={styles.timerRow}>
        {TIMER_OPTIONS.map((min) => (
          <TouchableOpacity key={min} style={styles.timerChip}>
            <Text style={styles.timerChipText}>{min} min</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#AAB6C6',
    marginBottom: 32,
  },
  exercises: {
    gap: 12,
    marginBottom: 32,
  },
  exerciseCard: {
    backgroundColor: '#172237',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  exerciseIcon: {
    fontSize: 28,
  },
  exerciseName: {
    color: '#F4F7FA',
    fontSize: 16,
    fontWeight: '500',
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#AAB6C6',
    marginBottom: 12,
  },
  timerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timerChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#172237',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3850',
  },
  timerChipText: {
    color: '#F4F7FA',
    fontSize: 14,
    fontWeight: '500',
  },
});
