// Source: design.md screen: S003 -- Conversation state hook
import { useState, useCallback, useEffect } from 'react';
import { conversationService } from '../services/conversationService';
import { ConversationMessage } from '../../../types/api';

interface UseConversationReturn {
  messages: ConversationMessage[];
  isLoading: boolean;
  addMessage: (message: ConversationMessage) => void;
  completeConversation: () => Promise<void>;
}

export function useConversation(conversationId: string): UseConversationReturn {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setIsLoading(false);
      return;
    }
    // TODO: Fetch existing messages for the conversation
    conversationService
      .getConversation(conversationId)
      .then((conv) => {
        setMessages(conv.messages ?? []);
      })
      .catch(() => {
        // TODO: Handle error
      })
      .finally(() => setIsLoading(false));
  }, [conversationId]);

  const addMessage = useCallback((message: ConversationMessage) => {
    setMessages((prev) => [message, ...prev]); // prepend for inverted FlatList
  }, []);

  const completeConversation = useCallback(async () => {
    // POST /api/v1/conversations/{id}/complete
    await conversationService.completeConversation(conversationId);
  }, [conversationId]);

  return { messages, isLoading, addMessage, completeConversation };
}
