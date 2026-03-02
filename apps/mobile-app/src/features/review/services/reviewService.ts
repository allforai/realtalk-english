// Source: design.md Section 4.4 -- API calls for review endpoints
import { apiClient } from '../../../services/apiClient';
import { ReviewCardDTO, ReviewSummary } from '../../../types/api';

export const reviewService = {
  /**
   * GET /api/v1/reviews/today
   * Fetch today's due review cards.
   */
  async getTodayCards(): Promise<ReviewCardDTO[]> {
    // TODO: Implement API call
    const { data } = await apiClient.get('/reviews/today');
    return data.data;
  },

  /**
   * POST /api/v1/reviews/{card_id}/rate
   * Submit rating (1=again, 2=hard, 3=good, 4=easy).
   * FSRS algorithm recalculates next review date on backend.
   */
  async rateCard(cardId: string, rating: 1 | 2 | 3 | 4): Promise<void> {
    // TODO: Implement API call
    await apiClient.post(`/reviews/${cardId}/rate`, { rating });
  },

  /**
   * GET /api/v1/reviews/summary
   * Fetch review session summary.
   */
  async getSummary(): Promise<ReviewSummary> {
    // TODO: Implement API call
    const { data } = await apiClient.get('/reviews/summary');
    return data.data;
  },
};
