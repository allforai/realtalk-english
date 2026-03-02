// Source: design.md Section 5.2 -- EventSource wrapper with typed callbacks
import EventSource from 'event-source-polyfill';
import { PronunciationResult, VocabularyWord } from '../types/api';

/**
 * SSE event callbacks matching backend SSE stream events.
 * Events: token, pronunciation, vocabulary, done
 */
export interface SSECallbacks {
  onToken: (text: string) => void;
  onPronunciation: (result: PronunciationResult) => void;
  onVocabulary: (words: VocabularyWord[]) => void;
  onDone: (messageId: string) => void;
  onError: (error: Error) => void;
}

/**
 * Create an SSE connection with auth headers.
 *
 * @param url    - SSE endpoint URL
 * @param token  - Bearer token for authentication
 * @param callbacks - Typed event handlers
 * @returns EventSource instance (caller may call .close() to disconnect)
 */
export function createSSEConnection(
  url: string,
  token: string,
  callbacks: SSECallbacks,
): EventSource {
  const eventSource = new EventSource(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  eventSource.addEventListener('token', (e: MessageEvent) => {
    try {
      callbacks.onToken(JSON.parse(e.data).text);
    } catch (err) {
      callbacks.onError(new Error('Failed to parse token event'));
    }
  });

  eventSource.addEventListener('pronunciation', (e: MessageEvent) => {
    try {
      callbacks.onPronunciation(JSON.parse(e.data));
    } catch (err) {
      callbacks.onError(new Error('Failed to parse pronunciation event'));
    }
  });

  eventSource.addEventListener('vocabulary', (e: MessageEvent) => {
    try {
      callbacks.onVocabulary(JSON.parse(e.data).words);
    } catch (err) {
      callbacks.onError(new Error('Failed to parse vocabulary event'));
    }
  });

  eventSource.addEventListener('done', (e: MessageEvent) => {
    try {
      callbacks.onDone(JSON.parse(e.data).message_id);
    } catch (err) {
      callbacks.onError(new Error('Failed to parse done event'));
    }
    eventSource.close();
  });

  eventSource.onerror = (_error: Event) => {
    callbacks.onError(new Error('SSE connection error'));
    eventSource.close();
  };

  return eventSource;
}
