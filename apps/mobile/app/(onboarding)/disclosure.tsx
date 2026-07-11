import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function DisclosureScreen() {
  const { t } = useTranslation();
  const items = t('onboarding.disclosure.items', { returnObjects: true }) as string[];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('onboarding.disclosure.title')}</Text>

      <View style={styles.items}>
        {items.map((item: string, index: number) => (
          <View key={index} style={styles.item}>
            <View style={styles.bullet} />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(onboarding)/privacy')}
      >
        <Text style={styles.buttonText}>{t('onboarding.disclosure.understood')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F7FA',
    marginBottom: 32,
  },
  items: {
    width: '100%',
    marginBottom: 40,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#79C7C3',
    marginTop: 6,
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#AAB6C6',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#79C7C3',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#0B1020',
    fontSize: 16,
    fontWeight: '600',
  },
});
