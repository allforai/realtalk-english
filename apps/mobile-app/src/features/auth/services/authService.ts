// Source: design.md Section 4.1 -- API calls stub for auth endpoints
import { apiClient } from '../../../services/apiClient';
import { TokenResponse } from '../../../types/api';

export const authService = {
  /**
   * POST /api/v1/auth/login
   * @returns JWT token pair
   */
  async login(email: string, password: string): Promise<TokenResponse> {
    // TODO: Implement API call
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data.data;
  },

  /**
   * POST /api/v1/auth/register
   * [DEFERRED]
   */
  async register(
    email: string,
    password: string,
    displayName: string,
  ): Promise<TokenResponse> {
    // TODO: Implement when registration flow is active
    const { data } = await apiClient.post('/auth/register', {
      email,
      password,
      display_name: displayName,
    });
    return data.data;
  },

  /**
   * POST /api/v1/auth/refresh
   */
  async refresh(refreshToken: string): Promise<TokenResponse> {
    // TODO: Implement token refresh
    const { data } = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return data.data;
  },

  /**
   * POST /api/v1/auth/logout
   */
  async logout(): Promise<void> {
    // TODO: Implement logout
    await apiClient.post('/auth/logout');
  },
};
