import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const QUICK_ACTIONS = [
  { key: 'anxious', color: '#AAA7E8' },
  { key: 'stressed', color: '#E2B66F' },
  { key: 'low', color: '#79C7C3' },
  { key: 'talk', color: '#79C69A' },
  { key: 'sort', color: '#AAA7E8' },
  { key: 'practice', color: '#79C7C3' },
];

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{t('home.greeting')}</Text>

      <View style={styles.quickGrid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={[styles.quickCard, { borderColor: action.color + '40' }]}
            onPress={() => router.push('/(main)/chat')}
          >
            <Text style={styles.quickText}>
              {t(`home.quickActions.${action.key}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.calmRoomCard}
        onPress={() => router.push('/(main)/calm-room')}
      >
        <Text style={styles.calmRoomTitle}>{t('home.calmRoom')}</Text>
        <Text style={styles.calmRoomSubtitle}>{t('calmRoom.subtitle')}</Text>
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
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F4F7FA',
    marginBottom: 24,
  },
  quickGrid: {
    gap: 10,
  },
  quickCard: {
    backgroundColor: '#172237',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickText: {
    color: '#F4F7FA',
    fontSize: 15,
    fontWeight: '500',
  },
  calmRoomCard: {
    backgroundColor: '#1E2B43',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#79C7C340',
  },
  calmRoomTitle: {
    color: '#79C7C3',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  calmRoomSubtitle: {
    color: '#AAB6C6',
    fontSize: 13,
  },
});
