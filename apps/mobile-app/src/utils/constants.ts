// API URLs, storage keys, and app-wide constants

export const API_URLS = {
  BASE: __DEV__
    ? 'http://localhost:8000/api/v1'
    : 'https://api.realtalk.app/api/v1',
} as const;

export const STORAGE_KEYS = {
  SCENARIOS_CACHE: '@scenarios_cache',
  SCENARIO_DETAIL: '@scenario_',           // append {id}
  RECOMMENDATIONS_CACHE: '@recommendations_cache',
  REPORT_CACHE: '@report_',                // append {conversationId}
  REVIEW_CARDS_TODAY: '@review_cards_today',
  STREAK_CACHE: '@streak_cache',
  ACHIEVEMENTS_CACHE: '@achievements_cache',
  NOTIFICATIONS_CACHE: '@notifications_cache',
  USER_PROFILE: '@user_profile',
  PENDING_ACTIONS: '@pending_actions',
} as const;

export const CACHE_TTL = {
  SCENARIOS: 5 * 60 * 1000,              // 5 minutes
  SCENARIO_DETAIL: 60 * 60 * 1000,       // 1 hour
  RECOMMENDATIONS: 60 * 60 * 1000,       // 1 hour
  STREAK: 30 * 60 * 1000,                // 30 minutes
  ACHIEVEMENTS: 60 * 60 * 1000,          // 1 hour
  NOTIFICATIONS: 15 * 60 * 1000,         // 15 minutes
  USER_PROFILE: 60 * 60 * 1000,          // 1 hour
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
} as const;

export const CONVERSATION = {
  FREE_TIER_DAILY_LIMIT: 3,
  SSE_RECONNECT_RETRIES: 3,
  AI_TIMEOUT_MS: 30000,                  // 30 seconds
} as const;

export const REVIEW = {
  RATINGS: {
    AGAIN: 1,
    HARD: 2,
    GOOD: 3,
    EASY: 4,
  },
} as const;

export const AUDIO = {
  MAX_RECORDING_DURATION_MS: 60000,       // 60 seconds
} as const;
