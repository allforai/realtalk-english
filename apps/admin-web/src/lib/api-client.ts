/**
 * ApiClient -- Centralized API client with auth interceptors and token refresh.
 * Provenance: design.md Section 5.1, 5.2, 5.3
 *
 * All API calls go through this class. Page components never call fetch directly (U4).
 */

import { useAuthStore } from '@/stores/authStore';
import { getErrorMessage } from './api-errors';
import type {
  TokenResponse,
  PaginatedResponse,
  ScenarioListItem,
  ScenarioDetail,
  ScenarioCreateReq,
  ReviewRequest,
  QualityOverview,
  LowScoreItem,
  MetricsDashboard,
  AlertRequest,
  UserListItem,
  UserDetail,
  BanUserReq,
  ApiErrorResponse,
} from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1';

// Query parameter types
interface ScenarioListQuery {
  page?: number;
  size?: number;
  status?: string;
  difficulty?: string;
  search?: string;
}

interface LowScoreQuery {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

interface UserSearchQuery {
  search?: string;
  subscription_tier?: string;
  is_banned?: boolean;
  page?: number;
  size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

interface DateRange {
  from: string;
  to: string;
}

class ApiClient {
  private refreshPromise: Promise<void> | null = null;

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const { accessToken } = useAuthStore.getState();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    // Handle 401 -- attempt token refresh
    if (response.status === 401) {
      await this.refreshTokenIfNeeded();
      // Retry the original request with new token
      const retryHeaders = { ...headers };
      const { accessToken: newToken } = useAuthStore.getState();
      if (newToken) {
        retryHeaders['Authorization'] = `Bearer ${newToken}`;
      }
      const retryResponse = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: retryHeaders,
      });
      if (!retryResponse.ok) {
        return this.handleErrorResponse(retryResponse);
      }
      return retryResponse.json() as Promise<T>;
    }

    // Handle 403
    if (response.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/unauthorized';
      }
      throw new Error('Forbidden');
    }

    if (!response.ok) {
      return this.handleErrorResponse(response);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      errorData = { code: 'GENERAL_001', message: 'An unexpected error occurred.' };
    }
    const message = getErrorMessage(errorData.code);
    throw new Error(message);
  }

  /**
   * Mutex-guarded token refresh. Only one refresh at a time.
   */
  private async refreshTokenIfNeeded(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const { refreshToken, logout, setTokens } = useAuthStore.getState();
      if (!refreshToken) {
        logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Refresh failed');
        }

        const tokens: TokenResponse = await response.json();
        setTokens(tokens.access_token, tokens.refresh_token);
      } catch {
        logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
    })();

    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  // ───── Auth ─────

  async login(email: string, password: string): Promise<TokenResponse> {
    return this.request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    return this.request<TokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', { method: 'POST' });
  }

  // ───── Scenarios ─────

  async getScenarios(params: ScenarioListQuery): Promise<PaginatedResponse<ScenarioListItem>> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.size) query.set('size', String(params.size));
    if (params.status) query.set('status', params.status);
    if (params.difficulty) query.set('difficulty', params.difficulty);
    if (params.search) query.set('search', params.search);
    return this.request(`/scenarios?${query.toString()}`);
  }

  async getScenario(id: string): Promise<ScenarioDetail> {
    return this.request(`/scenarios/${id}`);
  }

  async createScenario(data: ScenarioCreateReq): Promise<ScenarioDetail> {
    return this.request('/scenarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateScenario(id: string, data: ScenarioCreateReq): Promise<ScenarioDetail> {
    return this.request(`/scenarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async submitForReview(id: string): Promise<void> {
    return this.request(`/scenarios/${id}/submit-review`, { method: 'POST' });
  }

  async reviewScenario(id: string, data: ReviewRequest): Promise<ScenarioDetail> {
    return this.request(`/scenarios/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReviewQueue(page: number, size: number): Promise<PaginatedResponse<ScenarioListItem>> {
    return this.request(`/scenarios/review-queue?page=${page}&size=${size}`);
  }

  // ───── AI Quality ─────

  async getAiQualityOverview(dateRange: DateRange): Promise<QualityOverview> {
    return this.request(`/admin/ai-quality/overview?from=${dateRange.from}&to=${dateRange.to}`);
  }

  async getAiQualityLowScore(params: LowScoreQuery): Promise<PaginatedResponse<LowScoreItem>> {
    const query = new URLSearchParams();
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    if (params.page) query.set('page', String(params.page));
    if (params.size) query.set('size', String(params.size));
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.sort_order) query.set('sort_order', params.sort_order);
    return this.request(`/admin/ai-quality/low-score?${query.toString()}`);
  }

  // ───── Metrics ─────

  async getMetricsDashboard(dateRange: DateRange): Promise<MetricsDashboard> {
    return this.request(`/admin/metrics/dashboard?from=${dateRange.from}&to=${dateRange.to}`);
  }

  async createAlert(data: AlertRequest): Promise<void> {
    return this.request('/admin/metrics/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ───── Users ─────

  async searchUsers(params: UserSearchQuery): Promise<PaginatedResponse<UserListItem>> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.subscription_tier) query.set('subscription_tier', params.subscription_tier);
    if (params.is_banned !== undefined) query.set('is_banned', String(params.is_banned));
    if (params.page) query.set('page', String(params.page));
    if (params.size) query.set('size', String(params.size));
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.sort_order) query.set('sort_order', params.sort_order);
    return this.request(`/admin/users?${query.toString()}`);
  }

  async getUserDetail(id: string): Promise<UserDetail> {
    return this.request(`/admin/users/${id}`);
  }

  async banUser(id: string, data: BanUserReq): Promise<void> {
    return this.request(`/admin/users/${id}/ban`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async unbanUser(id: string): Promise<void> {
    return this.request(`/admin/users/${id}/unban`, { method: 'POST' });
  }
}

export const apiClient = new ApiClient();

export type { ScenarioListQuery, LowScoreQuery, UserSearchQuery, DateRange };
