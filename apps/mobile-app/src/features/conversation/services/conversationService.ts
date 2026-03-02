// Source: design.md Section 4.3 -- API calls for conversation endpoints
import { apiClient } from '../../../services/apiClient';
import { ConversationDTO, ConversationReport } from '../../../types/api';

export const conversationService = {
  /**
   * POST /api/v1/conversations
   * Create a new conversation for a scenario.
   * Returns 429 if free-tier limit reached.
   */
  async createConversation(scenarioId: string): Promise<ConversationDTO> {
    // TODO: Implement API call
    const { data } = await apiClient.post('/conversations', {
      scenario_id: scenarioId,
    });
    return data.data;
  },

  /**
   * GET /api/v1/conversations/{id}
   */
  async getConversation(id: string): Promise<ConversationDTO> {
    // TODO: Implement API call
    const { data } = await apiClient.get(`/conversations/${id}`);
    return data.data;
  },

  /**
   * POST /api/v1/conversations/{id}/messages
   * Send text message -- backend returns SSE stream (handled by sseClient).
   */
  async sendTextMessage(conversationId: string, content: string): Promise<void> {
    // TODO: Implement -- this triggers SSE, handled by useSSEStream
    await apiClient.post(`/conversations/${conversationId}/messages`, { content });
  },

  /**
   * POST /api/v1/conversations/{id}/messages/audio
   * Send audio -- backend returns SSE stream with pronunciation.
   */
  async sendAudioMessage(
    conversationId: string,
    audioUri: string,
  ): Promise<void> {
    // TODO: Implement multipart upload
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/wav',
      name: 'recording.wav',
    } as any);
    await apiClient.post(
      `/conversations/${conversationId}/messages/audio`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  /**
   * POST /api/v1/conversations/{id}/complete
   */
  async completeConversation(id: string): Promise<void> {
    // TODO: Implement API call
    await apiClient.post(`/conversations/${id}/complete`);
  },

  /**
   * GET /api/v1/conversations/{id}/report
   */
  async getReport(id: string): Promise<ConversationReport> {
    // TODO: Implement API call
    const { data } = await apiClient.get(`/conversations/${id}/report`);
    return data.data;
  },

  /**
   * GET /api/v1/conversations
   */
  async listConversations(): Promise<ConversationDTO[]> {
    // TODO: Implement API call
    const { data } = await apiClient.get('/conversations');
    return data.data;
  },
};
