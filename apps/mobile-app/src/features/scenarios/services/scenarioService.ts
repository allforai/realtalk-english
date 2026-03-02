// Source: design.md Section 4.2 -- API calls for scenario endpoints
import { apiClient } from '../../../services/apiClient';
import { ScenarioListItemDTO, ScenarioDetail } from '../../../types/api';

interface ListParams {
  difficulty?: string;
  tag_id?: string;
  page?: number;
  size?: number;
}

interface ListResponse {
  items: ScenarioListItemDTO[];
  total: number;
}

export const scenarioService = {
  /**
   * GET /api/v1/scenarios?difficulty={}&tag_id={}&page={}&size=20
   */
  async listScenarios(params: ListParams): Promise<ListResponse> {
    // TODO: Implement API call
    const { data } = await apiClient.get('/scenarios', { params });
    return data.data;
  },

  /**
   * GET /api/v1/scenarios/{id}
   */
  async getScenarioDetail(id: string): Promise<ScenarioDetail> {
    // TODO: Implement API call
    const { data } = await apiClient.get(`/scenarios/${id}`);
    return data.data;
  },
};
