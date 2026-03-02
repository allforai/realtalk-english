// Source: design.md entity enums

export enum EnglishLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  PRO = 'pro',
}

export enum ScenarioStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum MessageRole {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export enum SourceType {
  AUTO_COLLECTED = 'auto_collected',
  MANUAL = 'manual',
}

export enum MasteryLevel {
  NEW = 'new',
  LEARNING = 'learning',
  MASTERED = 'mastered',
}

export enum CardState {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEW = 'review',
  RELEARNING = 'relearning',
}

export enum SubscriptionPlan {
  FREE = 'free',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TRIAL = 'trial',
}

export enum NotificationType {
  REVIEW_REMINDER = 'review_reminder',
  SYSTEM = 'system',
  ACHIEVEMENT = 'achievement',
  ESCALATION = 'escalation',
}

export enum FeedbackType {
  BUG = 'bug',
  FEATURE = 'feature',
  COMPLAINT = 'complaint',
  OTHER = 'other',
}

export enum FeedbackStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum ValueType {
  INT = 'int',
  FLOAT = 'float',
  STRING = 'string',
  BOOL = 'bool',
  JSON = 'json',
}
