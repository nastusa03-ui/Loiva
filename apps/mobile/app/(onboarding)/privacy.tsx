import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const [saveHistory, setSaveHistory] = useState(false);
  const [memory, setMemory] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [notifications, setNotifications] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('onboarding.privacy.title')}</Text>

      <View style={styles.option}>
        <View style={styles.optionInfo}>
          <Text style={styles.optionLabel}>{t('onboarding.privacy.saveHistory')}</Text>
          <Text style={styles.optionDesc}>{t('onboarding.privacy.saveHistoryDesc')}</Text>
        </View>
        <Switch
          value={saveHistory}
          onValueChange={setSaveHistory}
          trackColor={{ false: '#2A3850', true: '#79C7C3' }}
          thumbColor={saveHistory ? '#0B1020' : '#AAB6C6'}
        />
      </View>

      <View style={styles.option}>
        <View style={styles.optionInfo}>
          <Text style={styles.optionLabel}>{t('onboarding.privacy.memory')}</Text>
          <Text style={styles.optionDesc}>{t('onboarding.privacy.memoryDesc')}</Text>
        </View>
        <Switch
          value={memory}
          onValueChange={setMemory}
          trackColor={{ false: '#2A3850', true: '#79C7C3' }}
          thumbColor={memory ? '#0B1020' : '#AAB6C6'}
        />
      </View>

      <View style={styles.option}>
        <View style={styles.optionInfo}>
          <Text style={styles.optionLabel}>{t('onboarding.privacy.analytics')}</Text>
          <Text style={styles.optionDesc}>{t('onboarding.privacy.analyticsDesc')}</Text>
        </View>
        <Switch
          value={analytics}
          onValueChange={setAnalytics}
          trackColor={{ false: '#2A3850', true: '#79C7C3' }}
          thumbColor={analytics ? '#0B1020' : '#AAB6C6'}
        />
      </View>

      <View style={styles.option}>
        <View style={styles.optionInfo}>
          <Text style={styles.optionLabel}>{t('onboarding.privacy.notifications')}</Text>
        </View>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#2A3850', true: '#79C7C3' }}
          thumbColor={notifications ? '#0B1020' : '#AAB6C6'}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(onboarding)/communication')}
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
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#172237',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionInfo: {
    flex: 1,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F4F7FA',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: '#AAB6C6',
    lineHeight: 18,
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
