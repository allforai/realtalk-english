// Source: design.md Section 4.5 -- API calls for achievement endpoints
import { apiClient } from '../../../services/apiClient';
import { AchievementDTO } from '../../../types/api';

export const achievementService = {
  /**
   * GET /api/v1/achievements
   * List all achievements with earned status.
   */
  async listAchievements(): Promise<AchievementDTO[]> {
    // TODO: Implement API call
    const { data } = await apiClient.get('/achievements');
    return data.data;
  },
};
