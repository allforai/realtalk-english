// Source: design.md Section 4.5 -- API calls for streak endpoints
import { apiClient } from '../../../services/apiClient';
import { StreakDTO } from '../../../types/api';

export const streakService = {
  /**
   * GET /api/v1/streaks/me
   */
  async getCurrentStreak(): Promise<StreakDTO> {
    // TODO: Implement API call
    const { data } = await apiClient.get('/streaks/me');
    return data.data;
  },

  /**
   * POST /api/v1/streaks/restore
   * Restore a broken streak (CN004 business rule).
   */
  async restoreStreak(): Promise<void> {
    // TODO: Implement API call
    await apiClient.post('/streaks/restore');
  },
};
