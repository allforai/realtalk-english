// Source: design.md API endpoint DTOs
import { Difficulty, ScenarioStatus, SubscriptionTier } from './enums';
import type { DialogueNode } from './entities';

// --- Common ---
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// --- Auth ---
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'bearer';
}

// --- Scenarios ---
export interface ScenarioListQuery {
  difficulty?: Difficulty;
  tagId?: string;
  role?: string;
  page: number;
  size: number;
}

export interface ScenarioListItem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: { id: string; name: string }[];
  status: ScenarioStatus;
  coverImageUrl?: string;
  avgScore?: number;
  progress?: number;
  author?: { id: string; displayName: string };
  submittedAt: string | null;
  createdAt: string;
}

export interface ScenarioDetail {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  targetRoles: string[];
  dialogueNodes: DialogueNode[];
  tags: { id: string; name: string }[];
  status: ScenarioStatus;
  rejectionReason: string | null;
  promptTemplateId: string | null;
  packId: string | null;
  author: { id: string; displayName: string };
  reviewer: { id: string; displayName: string } | null;
  reviewedAt: string | null;
  submittedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioCreateReq {
  title: string;
  description?: string;
  difficulty: Difficulty;
  targetRoles: string[];
  dialogueNodes: DialogueNode[];
  tagIds?: string[];
  promptTemplateId?: string | null;
}

export interface ReviewRequest {
  action: 'approve' | 'reject';
  reason?: string;
}

// --- Conversations ---
export interface CreateConversationReq {
  scenarioId: string;
}

export interface SendMessageReq {
  content: string;
}

export interface SSEEvent {
  event: 'token' | 'pronunciation' | 'vocabulary' | 'done';
  data: Record<string, unknown>;
}

export interface ConversationReport {
  overallScore: number;
  grammarErrors: { text: string; correction: string; explanation: string }[];
  expressionSuggestions: { original: string; suggested: string; reason: string }[];
  pronunciationSummary: { avgAccuracy: number; avgFluency: number; avgCompleteness: number };
  durationSeconds: number;
  messageCount: number;
  wordCount: number;
}

// --- Review ---
export interface ReviewCardDTO {
  id: string;
  vocabulary: { word: string; definition: string; example: string };
  due: string;
  state: string;
}

export interface RateCardReq {
  rating: 1 | 2 | 3 | 4;
}

export interface ReviewSummary {
  totalDue: number;
  reviewed: number;
  retentionRate: number;
  nextDueAt: string | null;
}

// --- Streaks & Achievements ---
export interface StreakDTO {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  canRestore: boolean;
}

export interface AchievementDTO {
  id: string;
  code: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  earnedAt: string | null;
}

// --- Recommendations ---
export interface RecommendationDTO {
  scenario: ScenarioListItem;
  reason: string;
  score: number;
}

// --- AI Quality ---
export interface QualityOverview {
  avgScore: number;
  scoreDistribution: Record<string, number>;
  trend: { date: string; avgScore: number }[];
}

export interface LowScoreItem {
  conversationId: string;
  userDisplayName: string;
  scenarioTitle: string;
  score: number;
  date: string;
}

// --- Metrics ---
export interface MetricValue {
  current: number;
  previous: number;
  deltaPercent: number;
}

export interface MetricsDashboard {
  dau: MetricValue;
  mau: MetricValue;
  retention7d: MetricValue;
  revenue: MetricValue;
  dauTrend: { date: string; value: number }[];
  retentionCohort: { cohort: string; day: number; rate: number }[];
  revenueTrend: { date: string; value: number }[];
}

export interface AlertRequest {
  metric: string;
  operator: '<' | '>' | '<=' | '>=';
  threshold: number;
  channel: 'email';
}

// --- Users ---
export interface UserListItem {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  subscriptionTier: SubscriptionTier;
  isBanned: boolean;
  createdAt: string;
}

export interface UserDetail extends UserListItem {
  phone: string | null;
  nativeLanguage: string;
  englishLevel: Difficulty;
  learningGoal: string | null;
  banReason: string | null;
  learningSummary: {
    totalConversations: number;
    avgScore: number | null;
    currentStreak: number;
    totalVocabulary: number;
  };
  subscription: {
    plan: string;
    status: string;
    startedAt: string | null;
    expiresAt: string | null;
  } | null;
}

export interface BanUserReq {
  reason: string;
  confirm: boolean;
}

// --- Notifications ---
export interface NotificationDTO {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  data: Record<string, unknown> | null;
  createdAt: string;
}
