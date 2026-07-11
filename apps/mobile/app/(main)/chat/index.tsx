import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ChatListScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('chat.modes.listen')}</Text>
      </View>

      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>{t('chat.empty.title')}</Text>
        <Text style={styles.emptyDesc}>{t('chat.empty.description')}</Text>
        <TouchableOpacity
          style={styles.newChat}
          onPress={() => router.push('/(main)/chat/[id]')}
        >
          <Text style={styles.newChatText}>{t('common.next')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F7FA',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F4F7FA',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#AAB6C6',
    textAlign: 'center',
    marginBottom: 24,
  },
  newChat: {
    backgroundColor: '#79C7C3',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  newChatText: {
    color: '#0B1020',
    fontSize: 15,
    fontWeight: '600',
  },
});
