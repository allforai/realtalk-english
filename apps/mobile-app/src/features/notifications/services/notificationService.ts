// Source: design.md Section 4.10 -- API calls for notification endpoints
import { apiClient } from '../../../services/apiClient';
import { NotificationDTO } from '../../../types/api';

interface ListParams {
  page?: number;
  size?: number;
}

export const notificationService = {
  /**
   * GET /api/v1/notifications?page={}&size=20
   */
  async listNotifications(params: ListParams): Promise<NotificationDTO[]> {
    // TODO: Implement API call
    const { data } = await apiClient.get('/notifications', { params });
    return data.data;
  },

  /**
   * PATCH /api/v1/notifications/{id}/read
   */
  async markAsRead(id: string): Promise<void> {
    // TODO: Implement API call
    await apiClient.patch(`/notifications/${id}/read`);
  },

  /**
   * PUT /api/v1/notifications/settings
   */
  async updateSettings(settings: {
    expo_push_token: string;
    platform: string;
  }): Promise<void> {
    // TODO: Implement API call
    await apiClient.put('/notifications/settings', settings);
  },
};
