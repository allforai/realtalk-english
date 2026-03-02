# RealTalk English -- Product Verify Static Report

**Generated:** 2026-02-28
**Scan Type:** Structural coverage (scaffold stubs only)
**Project:** RealTalk English (monorepo: api-backend + admin-web + mobile-app)

---

## Executive Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 45 |
| API Covered | 18 (40%) |
| API Missing | 8 (18%) |
| API Deferred | 19 (42%) |
| Screen Covered | 19 (42%) |
| Screen Missing | 7 (16%) |
| Screen Deferred | 19 (42%) |
| Constraints Covered | 6 / 8 |
| Constraints Partial | 2 / 8 |
| Extra Endpoints | 4 |

**Verdict:** All high-priority tasks have API and screen coverage. Gaps are concentrated in low-priority profile/settings tasks (T017, T019, T040-T043, T045) and one moderate-priority task (T008 vocabulary management). 19 tasks were explicitly deferred in the product design and have appropriate ComingSoonPage placeholders in admin-web.

---

## S1: Task to API Coverage

### Covered (18 tasks -- routes exist as stubs)

| Task | Title | Priority | Routes |
|------|-------|----------|--------|
| T001 | 浏览并选择场景 | 高 | `GET /scenarios`, `GET /scenarios/{id}` |
| T002 | 进行场景对话 | 高 | `POST /conversations`, `GET /conversations`, `GET /conversations/{id}`, `POST /{id}/messages`, `POST /{id}/messages/audio`, `POST /{id}/complete` |
| T003 | 查看对话报告 | 高 | `GET /conversations/{id}/report` |
| T004 | 进行自由对话 | 中 | Same as T002 (mode param) |
| T005 | 查看实时发音纠正 | 高 | `POST /{id}/messages/audio` (SSE stream) |
| T006 | 查看发音详细报告 | 中 | Part of `GET /{id}/report` |
| T007 | 完成记忆曲线复习 | 高 | `GET /reviews/today`, `POST /reviews/{id}/rate`, `GET /reviews/summary` |
| T009 | 创建场景对话脚本 | 高 | `POST /scenarios`, `PUT /scenarios/{id}`, `POST /{id}/submit-review` |
| T010 | 审核场景内容 | 高 | `GET /scenarios/review-queue`, `POST /scenarios/{id}/review` |
| T013 | 查看学习连胜与成就 | 高 | `GET /streaks/me`, `POST /streaks/restore`, `GET /achievements` |
| T018 | 查看学习统计报告 | 中 | Part of report + review summary |
| T020 | 查看个性化推荐 | 高 | `GET /recommendations` |
| T021 | 使用紧急场景速学 | 中 | Filtered `GET /scenarios` |
| T025 | 查看关键指标看板 | 高 | `GET /admin/metrics/dashboard`, `POST /admin/metrics/alerts` |
| T029 | 查看AI对话质量评分 | 高 | `GET /admin/ai-quality/overview`, `GET /admin/ai-quality/low-score` |
| T033 | 管理用户账户 | 高 | `GET /admin/users`, `GET /admin/users/{id}`, `POST /{id}/ban`, `POST /{id}/unban` |
| T038 | 注册账户 | 低 | `POST /auth/register` |
| T039 | 登录账户 | 高 | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` |
| T044 | 管理通知中心 | 中 | `GET /notifications`, `PATCH /{id}/read`, `PUT /notifications/settings` |

### Missing API (8 tasks -- no route found)

| Task | Title | Priority | Gap |
|------|-------|----------|-----|
| **T008** | **管理词汇本** | **中** | VocabularyItem model exists but no handler. Needs GET/POST/DELETE /vocabulary |
| **T017** | **查看个人学习档案** | **中** | No profile endpoint. Needs GET /profile/me |
| T019 | 设置角色偏好 | 低 | No profile settings update route |
| T040 | 管理个人设置 | 低 | No PATCH /profile/settings |
| T041 | 重置密码 | 低 | No forgot-password / reset-password flow |
| T042 | 注销账户 | 低 | No DELETE /profile/me. CN003 unenforceable |
| T043 | 完成新手引导 | 低 | No onboarding endpoint |
| T045 | 提交意见反馈 | 低 | Feedback model exists but no submission endpoint |

### Deferred (19 tasks -- explicitly deferred in design)

T011, T012, T014, T015, T016, T022, T023, T024, T026, T027, T028, T030, T031, T032, T034, T035, T036, T037

All deferred tasks with admin-web pages have `ComingSoonPage` placeholders. Good.

---

## S2: Screen / Component Coverage

### Mobile App (apps/mobile-app)

| Feature | Screens | Components | Status |
|---------|---------|------------|--------|
| Auth | LoginScreen | -- | Covered (T039). No RegisterScreen (T038 gap). |
| Scenarios | ScenarioListScreen, ScenarioDetailScreen | ScenarioCard, FilterBar, DialoguePreview, ScenarioListItem | Covered (T001, T021) |
| Conversation | ConversationScreen, ConversationReportScreen | InputBar, MessageBubble, MicrophoneButton, PronunciationCard, PhonemeDetail, ScoreBar, TypingIndicator | Covered (T002-T006) |
| Review | ReviewScreen | CardStack, ReviewCard, RatingButtons, CompletionSummary | Covered (T007) |
| Gamification | StreaksAchievementsScreen | StreakCounter, CalendarHeatmap, AchievementGrid, AchievementBadge, RestoreStreakButton | Covered (T013) |
| Home | HomeScreen | DailyProgress, QuickActions, RecommendationCarousel | Covered (T020) |
| Notifications | NotificationCenterScreen | NotificationItem | Covered (T044) |
| Profile | -- (ProfileStack routes to StreaksAchievements) | -- | **Missing** (T017, T019, T040) |

**Missing mobile screens:** ProfileScreen, RegisterScreen, OnboardingScreen, VocabularyScreen, PasswordResetScreen, AccountDeletionScreen

### Admin Web (apps/admin-web)

| Page | Status | Task |
|------|--------|------|
| /admin/login | Active | T039 |
| /admin/dashboard | Active | T025 |
| /admin/scenarios | Active | T009 |
| /admin/scenarios/new | Active | T009 |
| /admin/scenarios/[id] | Active | T009 |
| /admin/scenarios/review | Active | T010 |
| /admin/scenarios/review/[id] | Active | T010 |
| /admin/ai-quality | Active | T029 |
| /admin/users | Active | T033 |
| /admin/users/[id] | Active | T033 |
| /admin/scenario-packs | ComingSoon | T011 |
| /admin/scenario-tags | ComingSoon | T012 |
| /admin/behavior | ComingSoon | T026 |
| /admin/ab-tests | ComingSoon | T027 |
| /admin/reports | ComingSoon | T028 |
| /admin/anomalies | ComingSoon | T030 |
| /admin/prompts | ComingSoon | T031 |
| /admin/pronunciation | ComingSoon | T032 |
| /admin/subscriptions | ComingSoon | T034 |
| /admin/settings | ComingSoon | T035 |
| /admin/roles | ComingSoon | T036 |
| /admin/complaints | ComingSoon | T037 |
| /admin/feedback | ComingSoon | T045 |

---

## S3: Constraint Coverage

| ID | Constraint | Status | Evidence |
|----|-----------|--------|----------|
| CN001 | 免费版每天3轮对话限制 | **Covered** | RateLimitMiddleware + DailyConversationCount model + CONV_001 error code |
| CN002 | 退款金额不可超过原订单金额 | Deferred | T034 entirely deferred |
| CN003 | 用户注销后数据保留30天 | **Partial** | User.deactivated_at field exists, but no deactivation endpoint and no retention scheduler |
| CN004 | 连胜中断恢复限每月1次 | **Covered** | UserStreak.restorations_this_month + restoration_month + STREAK_001 error code |
| CN005 | 支付操作必须留存审计日志 | **Covered** | AuditLogMiddleware + AuditLog model + patterns for /webhooks/revenuecat |
| CN006 | 场景审核通过后方可上架 | **Covered** | ScenarioStatus FSM (draft/review/published/rejected) + SCEN_006 error code |
| CN007 | 发音评估阈值范围0.0-1.0 | **Covered** | DB CHECK constraints on PronunciationScore + CONFIG_001 error code |
| CN008 | 用户封禁操作需二次确认+日志 | **Covered** | BanUserReq.confirm flag + USER_001 error + AuditLogMiddleware ban/unban patterns + BanUserDialog UI |

---

## S4: Extra Endpoints (not mapped to any task)

| Route | Handler | Purpose |
|-------|---------|---------|
| `POST /auth/refresh` | auth.py:refresh | Token refresh -- auth lifecycle (part of T039) |
| `POST /auth/logout` | auth.py:logout | Logout -- auth lifecycle (part of T039) |
| `POST /webhooks/revenuecat` | webhook.py:revenuecat_webhook | Server-to-server webhook for subscriptions |
| `GET /health` | system.py:health_check | Infrastructure health check |

All extra endpoints are legitimate infrastructure/lifecycle endpoints. No orphan business routes found.

---

## Recommendations

### Moderate Priority (should be addressed before beta)

1. **T008 - Vocabulary management:** Add `GET/POST/DELETE /api/v1/vocabulary` endpoints and a `VocabularyScreen` in mobile-app. The VocabularyItem model and ReviewCard integration already exist.

2. **T017 - Personal learning profile:** Add `GET /api/v1/profile/me` and create a proper `ProfileScreen` in mobile-app (currently ProfileStack just shows StreaksAchievementsScreen).

### Low Priority (can wait for later iterations)

3. **T041 - Password reset:** Add `POST /auth/forgot-password` and `POST /auth/reset-password` endpoints.
4. **T042 - Account deletion:** Add `DELETE /profile/me` endpoint and a data retention scheduler (CN003).
5. **T045 - Feedback submission:** Add `POST /api/v1/feedback` endpoint (Feedback model already exists).
6. **T038 - Register screen:** Verify if registration is inline within LoginScreen or needs a separate RegisterScreen.
7. **T040 - Profile settings:** Add `PATCH /api/v1/profile/settings` when ProfileScreen is built.
8. **T043 - Onboarding:** Add OnboardingScreen in mobile-app.

### Scaffold Quality Notes

- All handler files follow consistent patterns: router + TODO comments + correct dependency injection.
- Middleware chain is properly ordered (CORS > RequestId > ErrorHandler > Auth > RateLimit > AuditLog).
- Error code registry is comprehensive with all constraint error codes pre-registered.
- Mock server routes align 1:1 with api-backend handler routes.
- Admin-web deferred features consistently use ComingSoonPage placeholder pattern.
- All models have proper indexes and constraints for the constraint requirements.
