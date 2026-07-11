import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const COUNTRIES = [
  { code: 'RU', name: 'Россия' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Deutschland' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'España' },
  { code: 'IT', name: 'Italia' },
  { code: 'JP', name: '日本' },
  { code: 'AU', name: 'Australia' },
  { code: 'BR', name: 'Brasil' },
  { code: 'IN', name: 'India' },
  { code: 'KR', name: '대한민국' },
  { code: 'CN', name: '中国' },
  { code: 'CA', name: 'Canada' },
  { code: 'PL', name: 'Polska' },
  { code: 'UA', name: 'Україна' },
  { code: 'KZ', name: 'Қазақстан' },
  { code: 'TR', name: 'Türkiye' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
];

export default function CountryScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const selectCountry = (code: string) => {
    router.push('/(onboarding)/disclosure');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('onboarding.country.title')}</Text>
      <Text style={styles.description}>{t('onboarding.country.description')}</Text>

      <TextInput
        style={styles.search}
        placeholder={t('onboarding.country.search')}
        placeholderTextColor="#5F6E80"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.option}
            onPress={() => selectCountry(item.code)}
          >
            <Text style={styles.optionText}>{item.name}</Text>
            <Text style={styles.code}>{item.code}</Text>
          </TouchableOpacity>
        )}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F7FA',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#AAB6C6',
    marginBottom: 20,
    lineHeight: 20,
  },
  search: {
    backgroundColor: '#172237',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#F4F7FA',
    borderWidth: 1,
    borderColor: '#2A3850',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#172237',
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2A3850',
  },
  optionText: {
    color: '#F4F7FA',
    fontSize: 16,
  },
  code: {
    color: '#AAB6C6',
    fontSize: 14,
  },
});
