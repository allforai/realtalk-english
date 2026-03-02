// Source: design.md entity definitions
import {
  EnglishLevel, SubscriptionTier, ScenarioStatus, Difficulty,
  ConversationStatus, MessageRole, SourceType, MasteryLevel,
  CardState, SubscriptionPlan, SubscriptionStatus,
  NotificationType, FeedbackType, FeedbackStatus, ValueType,
} from './enums';

export interface User {
  id: string;
  email: string;
  phone: string | null;
  displayName: string;
  avatarUrl: string | null;
  nativeLanguage: string;
  englishLevel: EnglishLevel;
  learningGoal: string | null;
  isActive: boolean;
  isBanned: boolean;
  banReason: string | null;
  deactivatedAt: string | null;
  subscriptionTier: SubscriptionTier;
  expoPushToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface Permission {
  id: string;
  roleId: string;
  resource: string;
  action: string;
}

export interface DialogueNode {
  sequence: number;
  role: 'user' | 'ai';
  content: string;
  hints?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  targetRoles: string[];
  dialogueNodes: DialogueNode[];
  status: ScenarioStatus;
  rejectionReason: string | null;
  promptTemplateId: string | null;
  packId: string | null;
  authorId: string;
  reviewerId: string | null;
  reviewedAt: string | null;
  submittedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioPack {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  priceCents: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioTag {
  id: string;
  name: string;
  category: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  scenarioId: string | null;
  status: ConversationStatus;
  overallScore: number | null;
  grammarErrors: { text: string; correction: string; explanation: string }[] | null;
  expressionSuggestions: { original: string; suggested: string; reason: string }[] | null;
  durationSeconds: number | null;
  messageCount: number;
  wordCount: number;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  audioUrl: string | null;
  tokenCount: number | null;
  sequence: number;
  createdAt: string;
}

export interface PronunciationScore {
  id: string;
  messageId: string;
  userId: string;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number | null;
  phonemeDetails: { phoneme: string; score: number; isCorrect: boolean }[] | null;
  referenceText: string | null;
  createdAt: string;
}

export interface VocabularyItem {
  id: string;
  userId: string;
  word: string;
  definition: string | null;
  exampleSentence: string | null;
  sourceConversationId: string | null;
  sourceType: SourceType;
  masteryLevel: MasteryLevel;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCard {
  id: string;
  userId: string;
  vocabularyId: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: CardState;
  due: string;
  lastReview: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  restorationsThisMonth: number;
  restorationMonth: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  criteria: Record<string, unknown>;
}

export interface Subscription {
  id: string;
  userId: string;
  revenuecatId: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startedAt: string | null;
  expiresAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  operatorId: string | null;
  action: string;
  targetEntity: string;
  targetId: string;
  payload: Record<string, unknown> | null;
  idempotencyKey: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  data: Record<string, unknown> | null;
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  type: FeedbackType;
  content: string;
  screenshotUrls: string[];
  status: FeedbackStatus;
  adminReply: string | null;
  resolvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string | null;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
  version: number;
  isActive: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  valueType: ValueType;
  description: string | null;
  updatedBy: string | null;
  updatedAt: string;
}

export interface DailyConversationCount {
  id: string;
  userId: string;
  date: string;
  count: number;
}
