import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

const TECHNIQUES: Record<string, { title: string; titleRu: string; steps: string[]; stepsRu: string[]; duration: string }> = {
  grounding: {
    title: '5-4-3-2-1 Grounding',
    titleRu: 'Grounding 5-4-3-2-1',
    steps: [
      'Name 5 things you can see',
      'Name 4 things you can hear',
      'Name 3 things you can touch',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
    ],
    stepsRu: [
      'Назовите 5 вещей, которые видите',
      'Назовите 4 вещи, которые слышите',
      'Назовите 3 вещи, которые трогаете',
      'Назовите 2 вещи, которые чувствуете по запаху',
      'Назовите 1 вещь, которую чувствуете на вкус',
    ],
    duration: '3 min',
  },
  breathing: {
    title: 'Gentle Breathing',
    titleRu: 'Мягкое дыхание',
    steps: [
      'Breathe naturally through your nose',
      'Notice the rhythm of your breath',
      'You don\'t need to change anything',
      'Just observe for 2 minutes',
    ],
    stepsRu: [
      'Дышите естественно через нос',
      'Заметьте ритм вашего дыхания',
      'Ничего не нужно менять',
      'Просто наблюдайте 2 минуты',
    ],
    duration: '2 min',
  },
  'cognitive-default': {
    title: 'Facts vs Assumptions',
    titleRu: 'Факты и предположения',
    steps: [
      'Write down what happened',
      'Mark each statement as fact or assumption',
      'What evidence supports each assumption?',
      'What else could be true?',
    ],
    stepsRu: [
      'Запишите, что произошло',
      'Отметьте каждое утверждение как факт или предположение',
      'Какие доказательства подтверждают каждое предположение?',
      'Что ещё может быть правдой?',
    ],
    duration: '5 min',
  },
};

export default function TechniqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isRu = i18n.language === 'ru';

  const technique = TECHNIQUES[id ?? ''] ?? TECHNIQUES['grounding'];
  const title = isRu ? technique.titleRu : technique.title;
  const steps = isRu ? technique.stepsRu : technique.steps;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.duration}>{technique.duration}</Text>

      <View style={styles.steps}>
        {steps.map((step, i) => (
          <View key={i} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>{t('techniques.practice.start')}</Text>
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
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: '#AAB6C6',
    marginBottom: 32,
  },
  steps: {
    gap: 16,
    marginBottom: 32,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#79C7C320',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#79C7C3',
    fontSize: 13,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    color: '#F4F7FA',
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 3,
  },
  startButton: {
    backgroundColor: '#79C7C3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#0B1020',
    fontSize: 16,
    fontWeight: '600',
  },
});
