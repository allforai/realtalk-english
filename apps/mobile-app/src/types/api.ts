// Source: design.md Sections 4.1-4.10 -- All DTO types mirroring backend schemas

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'bearer';
}

export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── Scenarios ───────────────────────────────────────────────────────────────

export interface ScenarioListItemDTO {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
  progress?: string;
  cover_image_url?: string;
  avg_score?: number;
}

export interface ScenarioDetail {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  target_roles: string[];
  dialogue_nodes: DialogueNode[];
  tags: string[];
  status: string;
}

export interface DialogueNode {
  role: string;
  content: string;
}

export interface ScenarioFilter {
  difficulty?: string;
  tag_id?: string;
  page?: number;
  size?: number;
}

// ─── Conversations ───────────────────────────────────────────────────────────

export interface ConversationDTO {
  id: string;
  scenario_id: string;
  status: string;
  messages: ConversationMessage[];
  created_at: string;
}

export interface ConversationMessage {
  id?: string;
  role: 'user' | 'ai';
  content: string;
  pronunciation?: PronunciationResult;
  vocabulary_highlights?: VocabularyWord[];
  created_at?: string;
}

export interface CreateConversationRequest {
  scenario_id: string;
}

export interface SendMessageRequest {
  content: string;
}

// ─── SSE Events ──────────────────────────────────────────────────────────────

export interface SSEEvent {
  event: 'token' | 'pronunciation' | 'vocabulary' | 'done';
  data: unknown;
}

export interface PronunciationResult {
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody?: number;
  phonemes: Phoneme[];
}

export interface Phoneme {
  phoneme: string;
  score: number;
}

export interface VocabularyWord {
  word: string;
  definition: string;
}

// ─── Conversation Report ─────────────────────────────────────────────────────

export interface ConversationReport {
  overall_score: number;
  grammar_errors: GrammarError[];
  expression_suggestions: ExpressionSuggestion[];
  pronunciation_summary: PronunciationResult | null;
  duration_seconds: number;
  message_count: number;
  word_count: number;
}

export interface GrammarError {
  original: string;
  correction: string;
  explanation: string;
}

export interface ExpressionSuggestion {
  original: string;
  suggested: string;
  reason: string;
}

// ─── Review (Spaced Repetition) ──────────────────────────────────────────────

export interface ReviewCardDTO {
  id: string;
  vocabulary: {
    word: string;
    definition: string;
    example: string;
  };
  due: string;
  state: string;
}

export interface RateCardRequest {
  rating: 1 | 2 | 3 | 4; // 1=again, 2=hard, 3=good, 4=easy
}

export interface ReviewSummary {
  total_due: number;
  reviewed: number;
  retention_rate: number;
  next_due_at: string | null;
}

// ─── Streaks & Achievements ──────────────────────────────────────────────────

export interface StreakDTO {
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  can_restore: boolean;
}

export interface AchievementDTO {
  id: string;
  code: string;
  name: string;
  description: string;
  icon_url: string;
  earned_at?: string;
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export interface RecommendationDTO {
  scenario: ScenarioListItemDTO;
  reason: string;
  score: number;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export interface NotificationDTO {
  id: string;
  type: 'review_reminder' | 'achievement' | 'system' | 'conversation_report';
  title: string;
  body: string;
  deep_link?: string;
  read_at: string | null;
  created_at: string;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  subscription_status: string;
  created_at: string;
}

// ─── API Response Wrapper ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: {
    items: T[];
    total: number;
    page: number;
    size: number;
  };
}
