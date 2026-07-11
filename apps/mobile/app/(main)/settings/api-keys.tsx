import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AIProvider, PROVIDERS } from '@loiva/ai-contracts';

const PROVIDER_LIST = Object.values(PROVIDERS);

export default function ApiKeysScreen() {
  const { t } = useTranslation();
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(AIProvider.OPENAI);
  const [apiKey, setApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (!apiKey.trim()) {
      Alert.alert(t('common.error'), 'API key is required');
      return;
    }
    // Will connect to Edge Function
    Alert.alert(t('common.done'), t('settings.apiKeys.description'));
    setApiKey('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('settings.apiKeys.title')}</Text>
      <Text style={styles.description}>{t('settings.apiKeys.description')}</Text>

      <Text style={styles.label}>{t('settings.apiKeys.provider')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.providerScroll}>
        {PROVIDER_LIST.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.providerChip, selectedProvider === p.id && styles.providerChipActive]}
            onPress={() => setSelectedProvider(p.id)}
          >
            <Text style={[styles.providerChipText, selectedProvider === p.id && styles.providerChipTextActive]}>
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedProvider === AIProvider.CUSTOM && (
        <>
          <Text style={styles.label}>Base URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://api.example.com/v1"
            placeholderTextColor="#5F6E80"
            value={customBaseUrl}
            onChangeText={setCustomBaseUrl}
            autoCapitalize="none"
          />
        </>
      )}

      <Text style={styles.label}>{t('settings.apiKeys.model')}</Text>
      <TextInput
        style={styles.input}
        placeholder={PROVIDERS[selectedProvider]?.defaultModel ?? 'model-name'}
        placeholderTextColor="#5F6E80"
        value={PROVIDERS[selectedProvider]?.defaultModel ?? ''}
        editable={false}
      />

      <Text style={styles.label}>{t('settings.apiKeys.key')}</Text>
      <TextInput
        style={styles.input}
        placeholder="sk-..."
        placeholderTextColor="#5F6E80"
        value={apiKey}
        onChangeText={setApiKey}
        secureTextEntry={!showKey}
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={() => setShowKey(!showKey)}>
        <Text style={styles.toggleKey}>{showKey ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t('settings.apiKeys.save')}</Text>
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
  description: {
    fontSize: 14,
    color: '#AAB6C6',
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#AAB6C6',
    marginBottom: 8,
    marginTop: 16,
  },
  providerScroll: {
    marginBottom: 8,
  },
  providerChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#172237',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2A3850',
  },
  providerChipActive: {
    backgroundColor: '#79C7C320',
    borderColor: '#79C7C3',
  },
  providerChipText: {
    color: '#AAB6C6',
    fontSize: 14,
    fontWeight: '500',
  },
  providerChipTextActive: {
    color: '#79C7C3',
  },
  input: {
    backgroundColor: '#172237',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#F4F7FA',
    borderWidth: 1,
    borderColor: '#2A3850',
  },
  toggleKey: {
    color: '#79C7C3',
    fontSize: 13,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#79C7C3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#0B1020',
    fontSize: 16,
    fontWeight: '600',
  },
});
