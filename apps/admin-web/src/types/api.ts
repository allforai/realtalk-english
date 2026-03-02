/**
 * All TypeScript interfaces for API request/response types.
 * Provenance: design.md Section 7
 *
 * No `any` types. All fields have explicit types. Export all types (no default exports).
 */

// ───── Common ─────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ───── Auth ─────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'bearer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ───── Scenario ─────

export type ScenarioStatus = 'draft' | 'review' | 'published' | 'rejected' | 'archived';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface DialogueNode {
  sequence: number;
  role: 'user' | 'ai';
  content: string;
  hints?: string;
}

export interface ScenarioListItem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: { id: string; name: string }[];
  status: ScenarioStatus;
  author: { id: string; display_name: string };
  submitted_at: string | null;
  created_at: string;
}

export interface ScenarioDetail {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  target_roles: string[];
  dialogue_nodes: DialogueNode[];
  tags: { id: string; name: string }[];
  status: ScenarioStatus;
  rejection_reason: string | null;
  prompt_template_id: string | null;
  pack_id: string | null;
  author: { id: string; display_name: string };
  reviewer: { id: string; display_name: string } | null;
  reviewed_at: string | null;
  submitted_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScenarioCreateReq {
  title: string;
  description?: string;
  difficulty: Difficulty;
  target_roles: string[];
  dialogue_nodes: DialogueNode[];
  tag_ids?: string[];
  prompt_template_id?: string | null;
}

export interface ReviewRequest {
  action: 'approve' | 'reject';
  reason?: string;
}

// ───── AI Quality ─────

export interface QualityOverview {
  avg_score: number;
  score_distribution: Record<string, number>;
  trend: { date: string; avg_score: number }[];
}

export interface LowScoreItem {
  conversation_id: string;
  user_display_name: string;
  scenario_title: string;
  score: number;
  date: string;
}

// ───── Metrics ─────

export interface MetricsDashboard {
  dau: MetricValue;
  mau: MetricValue;
  retention_7d: MetricValue;
  revenue: MetricValue;
  dau_trend: { date: string; value: number }[];
  retention_cohort: { cohort: string; day: number; rate: number }[];
  revenue_trend: { date: string; value: number }[];
}

export interface MetricValue {
  current: number;
  previous: number;
  delta_percent: number;
}

export interface AlertRequest {
  metric: string;
  operator: '<' | '>' | '<=' | '>=';
  threshold: number;
  channel: 'email';
}

// ───── Users ─────

export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface UserListItem {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  is_banned: boolean;
  created_at: string;
}

export interface UserDetail extends UserListItem {
  phone: string | null;
  native_language: string;
  english_level: Difficulty;
  learning_goal: string | null;
  ban_reason: string | null;
  learning_summary: {
    total_conversations: number;
    avg_score: number | null;
    current_streak: number;
    total_vocabulary: number;
  };
  subscription: {
    plan: string;
    status: string;
    started_at: string | null;
    expires_at: string | null;
  } | null;
}

export interface BanUserReq {
  reason: string;
  confirm: boolean;
}

// ───── Query Params ─────

export interface ScenarioListQuery {
  page?: number;
  size?: number;
  status?: string;
  difficulty?: string;
  search?: string;
}

export interface LowScoreQuery {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface UserSearchQuery {
  search?: string;
  subscription_tier?: string;
  is_banned?: boolean;
  page?: number;
  size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface DateRange {
  from: string;
  to: string;
}
