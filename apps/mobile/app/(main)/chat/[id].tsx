import { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MODES = ['listen', 'calm', 'sort', 'next_step'] as const;

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<string>('listen');
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    // Placeholder: will connect to AI proxy
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a placeholder response. Connect your API key in Settings to enable AI.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsStreaming(false);
    }, 1000);
  }, [input, isStreaming]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Loiva</Text>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.modeBar}>
        {MODES.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.modeChip, mode === m && styles.modeChipActive]}
            onPress={() => setMode(m)}
          >
            <Text style={[styles.modeChipText, mode === m && styles.modeChipTextActive]}>
              {t(`chat.modes.${m === 'next_step' ? 'nextStep' : m}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text style={[styles.bubbleText, item.role === 'user' ? styles.userBubbleText : styles.assistantBubbleText]}>
              {item.content}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder={t('chat.input.placeholder')}
          placeholderTextColor="#5F6E80"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={2000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || isStreaming}
        >
          <Text style={styles.sendButtonText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  back: {
    fontSize: 24,
    color: '#79C7C3',
    width: 32,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F4F7FA',
  },
  aiBadge: {
    backgroundColor: '#79C7C320',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiBadgeText: {
    color: '#79C7C3',
    fontSize: 11,
    fontWeight: '700',
  },
  modeBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
  },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#172237',
  },
  modeChipActive: {
    backgroundColor: '#79C7C320',
  },
  modeChipText: {
    color: '#AAB6C6',
    fontSize: 13,
    fontWeight: '500',
  },
  modeChipTextActive: {
    color: '#79C7C3',
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  bubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#79C7C3',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#172237',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userBubbleText: {
    color: '#0B1020',
  },
  assistantBubbleText: {
    color: '#F4F7FA',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#172237',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#F4F7FA',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#79C7C3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    color: '#0B1020',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
