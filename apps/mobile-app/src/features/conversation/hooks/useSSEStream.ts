// Source: design.md Section 9.1 -- SSE consumption hook
import { useState, useCallback, useEffect, useRef } from 'react';
import { createSSEConnection } from '../../../services/sseClient';
import { PronunciationResult, VocabularyWord } from '../../../types/api';
import { API_URLS } from '../../../utils/constants';

interface UseSSEStreamReturn {
  isStreaming: boolean;
  streamingText: string;
  pronunciationResult: PronunciationResult | null;
  vocabularyWords: VocabularyWord[];
  sendTextMessage: (content: string) => void;
}

export function useSSEStream(conversationId: string): UseSSEStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [pronunciationResult, setPronunciationResult] =
    useState<PronunciationResult | null>(null);
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  const sendTextMessage = useCallback(
    (content: string) => {
      if (!conversationId) return;

      setIsStreaming(true);
      setStreamingText('');
      setPronunciationResult(null);
      setVocabularyWords([]);

      const url = `${API_URLS.BASE}/conversations/${conversationId}/messages`;

      // TODO: POST the message body first, then connect SSE for response
      // The backend returns SSE stream directly from the POST endpoint
      eventSourceRef.current = createSSEConnection(url, '', {
        onToken: (text) => setStreamingText((prev) => prev + text),
        onPronunciation: (result) => setPronunciationResult(result),
        onVocabulary: (words) => setVocabularyWords(words),
        onDone: (_messageId) => {
          setIsStreaming(false);
          // TODO: Finalize message in local state
        },
        onError: (_error) => {
          setIsStreaming(false);
          // TODO: Show error toast
        },
      });
    },
    [conversationId],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return {
    isStreaming,
    streamingText,
    pronunciationResult,
    vocabularyWords,
    sendTextMessage,
  };
}
