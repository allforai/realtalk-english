// Source: design.md screen: S003 -- MessageList + InputBar + SSE
import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageBubble } from '../components/MessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { InputBar } from '../components/InputBar';
import { useConversation } from '../hooks/useConversation';
import { useSSEStream } from '../hooks/useSSEStream';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { ConversationMessage } from '../../../types/api';

interface Props {
  route?: { params?: { conversationId?: string; scenarioId?: string } };
}

export function ConversationScreen({ route }: Props) {
  const conversationId = route?.params?.conversationId ?? '';
  const { messages, addMessage } = useConversation(conversationId);
  const { isStreaming, streamingText, sendTextMessage } = useSSEStream(conversationId);
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const [isFallbackToText, setIsFallbackToText] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendText = (text: string) => {
    addMessage({ role: 'user', content: text } as ConversationMessage);
    sendTextMessage(text);
  };

  const handleMicPress = async () => {
    if (isRecording) {
      const audioUri = await stopRecording();
      // TODO: Upload audio via audioService.uploadAudio(conversationId, audioUri)
    } else {
      const started = await startRecording();
      if (!started) {
        setIsFallbackToText(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversation</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => <MessageBubble message={item} />}
        ListHeaderComponent={isStreaming ? <TypingIndicator /> : null}
        contentContainerStyle={styles.messageList}
      />
      <InputBar
        onSendText={handleSendText}
        onMicPress={handleMicPress}
        isRecording={isRecording}
        isFallbackToText={isFallbackToText}
        disabled={isStreaming}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  messageList: { paddingHorizontal: 16, paddingVertical: 8 },
});

export default ConversationScreen;
