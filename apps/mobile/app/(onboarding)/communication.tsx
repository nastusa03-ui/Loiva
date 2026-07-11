import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function CommunicationScreen() {
  const { t } = useTranslation();
  const [length, setLength] = useState<'short' | 'long'>('short');
  const [tone, setTone] = useState<'gentle' | 'structured'>('gentle');
  const [questionsFirst, setQuestionsFirst] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('onboarding.communication.title')}</Text>

      <Text style={styles.label}>{t('onboarding.communication.length')}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.chip, length === 'short' && styles.chipActive]}
          onPress={() => setLength('short')}
        >
          <Text style={[styles.chipText, length === 'short' && styles.chipTextActive]}>
            {t('onboarding.communication.lengthShort')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, length === 'long' && styles.chipActive]}
          onPress={() => setLength('long')}
        >
          <Text style={[styles.chipText, length === 'long' && styles.chipTextActive]}>
            {t('onboarding.communication.lengthLong')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>{t('onboarding.communication.tone')}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.chip, tone === 'gentle' && styles.chipActive]}
          onPress={() => setTone('gentle')}
        >
          <Text style={[styles.chipText, tone === 'gentle' && styles.chipTextActive]}>
            {t('onboarding.communication.toneGentle')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, tone === 'structured' && styles.chipActive]}
          onPress={() => setTone('structured')}
        >
          <Text style={[styles.chipText, tone === 'structured' && styles.chipTextActive]}>
            {t('onboarding.communication.toneStructured')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>{t('onboarding.communication.questions')}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.chip, questionsFirst && styles.chipActive]}
          onPress={() => setQuestionsFirst(true)}
        >
          <Text style={[styles.chipText, questionsFirst && styles.chipTextActive]}>
            {t('onboarding.communication.questionsFirst')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, !questionsFirst && styles.chipActive]}
          onPress={() => setQuestionsFirst(false)}
        >
          <Text style={[styles.chipText, !questionsFirst && styles.chipTextActive]}>
            {t('onboarding.communication.optionsFirst')}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(onboarding)/safety-notice')}
      >
        <Text style={styles.buttonText}>{t('common.next')}</Text>
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
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  chip: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#172237',
    borderWidth: 1,
    borderColor: '#2A3850',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#1E2B43',
    borderColor: '#79C7C3',
  },
  chipText: {
    color: '#AAB6C6',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#79C7C3',
  },
  button: {
    backgroundColor: '#79C7C3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#0B1020',
    fontSize: 16,
    fontWeight: '600',
  },
});
