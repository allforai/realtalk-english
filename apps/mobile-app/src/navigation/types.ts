// Source: design.md Section 3.2 -- Navigation Types

export type ScenarioFilter = {
  difficulty?: string;
  tag_id?: string;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  NotificationCenter: undefined;
  Paywall: { source: 'conversation_limit' | 'feature_gate' };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;          // [DEFERRED]
  ResetPassword: undefined;     // [DEFERRED]
  Onboarding: undefined;        // [DEFERRED]
};

export type HomeTabParamList = {
  Home: undefined;
  ScenarioList: { filter?: ScenarioFilter };
  ScenarioDetail: { scenarioId: string };
};

export type LearnTabParamList = {
  ConversationLanding: undefined;
  Conversation: { conversationId: string; scenarioId: string };
  ConversationReport: { conversationId: string };
};

export type ReviewTabParamList = {
  Review: undefined;
};

export type ProfileTabParamList = {
  Profile: undefined;
  StreaksAchievements: undefined;
};
