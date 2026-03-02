# Requirements -- api-backend (sp-001)

> Sub-project: **api-backend** | Stack: FastAPI + SQLAlchemy + PostgreSQL | Architecture: three-layer | Auth: JWT
>
> Generated from: product-map v2.5.0, feature-prune decisions, forge-decisions.json
>
> Scope: 14 CORE tasks + non-functional requirements. DEFER/CUT tasks excluded from active implementation.

---

## 1. Consumer -- R001 Working Professional / R002 Hobbyist / R003 Immigrant

### REQ-001 Browse and Select Scenarios (P0)

**User Story**: As a consumer (R001/R002/R003), I want to browse scenarios filtered by role, difficulty, and topic so that I can quickly find a scenario matching my needs.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | Published scenarios exist in the system | I request the scenario list | I receive a paginated list sorted by personalized recommendation |
| AC-2 | I specify filters (role, difficulty, topic/tag) | I request the filtered list | Only matching published scenarios are returned |
| AC-3 | I have completed some scenarios | I view the scenario list | Each scenario shows my progress (not started / in progress / completed) |
| AC-4 | A scenario is unpublished or under review | I request the scenario list | That scenario is not visible to me |

**Business Rules**:
- Scenarios sorted by personalized recommendation score. _Source: T001.rules_
- Completed scenarios display progress badge. _Source: T001.rules_

**Error Scenarios**:
- Requested scenario unavailable (deleted/unpublished) -> return similar scenario recommendations. _Source: T001.exceptions_

_Source: T001, F001, F004_

---

### REQ-002 Conduct Scenario Conversation (P0)

**User Story**: As a consumer, I want to have an AI-powered conversation within a scenario using voice or text so that I can practice speaking English in context.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I select a published scenario | I start a conversation | A new Conversation record is created and the AI opens with the scenario prompt via SSE streaming |
| AC-2 | I send a text message | The message is processed | AI responds in streaming SSE; the message pair is persisted |
| AC-3 | I send an audio input | The audio is received | Speech-to-text converts it, pronunciation is assessed, AI responds via streaming |
| AC-4 | I am a free-tier user and have used 3 conversations today | I try to start a new conversation | I receive HTTP 429 with upgrade prompt |
| AC-5 | A conversation is in progress | 5 minutes elapse (configurable) | The round is auto-closed and a report is triggered |
| AC-6 | New vocabulary is detected in the conversation | The conversation round ends | Vocabulary items are auto-collected to my vocabulary book |

**Business Rules**:
- Free tier: max 3 conversations/day (CN001, middleware enforcement). _Source: T002.rules, CN001_
- Round timeout: 5 minutes (configurable via SystemConfig). _Source: T002.rules_
- New words auto-collected to VocabularyItem. _Source: T002.rules_
- All AI calls go through `ai_client.py`; streaming via async generator + SSE. _Source: TS001_
- Speech input proxied through `speech_service.py`. _Source: TS002_

**Error Scenarios**:
- Speech recognition failure -> fallback to text input mode, return `fallback: text` flag. _Source: T002.exceptions, TS002_
- AI response timeout -> return 504 with `retry_after` header. _Source: T002.exceptions_

_Source: T002, F001, F004, F005, CN001, TS001, TS002, TS005_

---

### REQ-003 View Conversation Report (P0)

**User Story**: As a consumer, I want to see a comprehensive report after completing a conversation so that I understand my performance and areas for improvement.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | A conversation has ended | I request the report | I receive overall score, grammar error list, expression suggestions, and pronunciation summary |
| AC-2 | AI scoring fails | I request the report | I receive basic statistics (message count, duration, word count) as fallback |
| AC-3 | I want to retry | I choose "restart" from the report | A new Conversation is created for the same scenario |

**Error Scenarios**:
- AI scoring generation failure -> return basic statistics only. _Source: T003.exceptions_

_Source: T003, F001, TS001_

---

### REQ-004 Real-time Pronunciation Correction (P0)

**User Story**: As a consumer, I want to see phoneme-level pronunciation feedback in real-time during a conversation so that I can improve without breaking the conversation flow.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I submit an audio message during conversation | The audio is processed | I receive phoneme-level scores (accuracy, fluency, completeness, prosody) inline with the AI response |
| AC-2 | A phoneme scores below threshold | The result is returned | That phoneme is flagged with correction suggestion and reference audio URL |
| AC-3 | Azure Speech SDK call fails | The pronunciation assessment is attempted | Fallback to text-only mode; conversation continues unblocked |

**Business Rules**:
- All speech assessment via `speech_service.py` (Azure SDK proxy). _Source: TS002_
- Fallback to text mode on failure -- never block the user. _Source: TS002_

_Source: T005, F001, TS002_

---

### REQ-005 Complete Spaced Repetition Review (P0)

**User Story**: As a consumer, I want to review vocabulary using spaced repetition so that I retain words long-term following the memory curve.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have ReviewCards due today | I request today's review queue | I receive cards sorted by due date, limited to a configurable batch size |
| AC-2 | I rate a card (again / hard / good / easy) | The rating is submitted | FSRS recalculates the next review date and updates the card |
| AC-3 | I complete all due reviews | I request the review queue | I see a completion summary (reviewed count, retention rate) |

**Business Rules**:
- Review scheduling via `srs_service.py` wrapping FSRS. Business layer passes `(card_id, rating)` only. _Source: TS004_
- Daily review reminder via push notification. _Source: T007.rules, TS006_

_Source: T007, F001, F002, F009, TS004, TS006_

---

### REQ-006 View Streaks and Achievements (P0)

**User Story**: As a consumer, I want to see my learning streak and earned achievement badges so that I stay motivated.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have been learning daily | I view my streak | I see current streak days and best streak record |
| AC-2 | I have earned achievements | I view achievements | I see a list of badges with earned/locked status |
| AC-3 | My streak was broken and I haven't restored this month | I request streak restoration | The streak is restored; my monthly restoration count is incremented |
| AC-4 | My streak was broken and I already restored this month | I request streak restoration | Request is rejected with error message |

**Business Rules**:
- Streak = at least 1 completed conversation per day. _Source: T013.rules_
- Streak restoration: max 1 per calendar month (CN004). _Source: T013.rules, CN004_

_Source: T013, CN004_

---

### REQ-007 View Personalized Recommendations (P0)

**User Story**: As a consumer, I want to see personalized scenario recommendations on the home page so that I can discover relevant content quickly.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have learning history | I open the home endpoint | I receive a ranked list of recommended scenarios with recommendation reasons |
| AC-2 | I am a new user with no history | I open the home endpoint | I receive popular/trending scenarios as default recommendations |

_Source: T020, F004, TS004_

---

### REQ-008 Login (P0)

**User Story**: As a consumer, I want to log in via email/password or third-party OAuth so that I can access my account.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have a valid account | I submit correct credentials | I receive a JWT access token + refresh token |
| AC-2 | I submit wrong credentials | Login is attempted | I receive 401 with "invalid credentials" message and "forgot password" hint |
| AC-3 | My account is banned | I attempt login | I receive 403 with ban reason |

**Error Scenarios**:
- Wrong password -> 401 + forgot-password hint. _Source: T039.exceptions_

_Source: T039, F004_

---

### REQ-009 Manage Notification Center (P1)

**User Story**: As a consumer, I want to view and manage my notifications so that I stay informed about reviews, system updates, and learning reminders.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have unread notifications | I request the notification list | I receive notifications grouped by type, sorted newest-first, with unread count |
| AC-2 | I read a notification | I mark it as read | The notification status updates to read |
| AC-3 | I want to change preferences | I update notification settings | My push/email preferences are persisted |

_Source: T044, TS006_

---

## 2. Producer -- R004 Content Operations

### REQ-010 Create Scenario Script (P0)

**User Story**: As a content operator (R004), I want to create scenario conversation scripts with dialogue nodes, difficulty levels, and target roles so that learners get high-quality scenario content.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I create a new scenario | I submit the scenario data | A Scenario record is created in "draft" status |
| AC-2 | I provide fewer than 3 dialogue nodes | I try to submit for review | Validation rejects with "minimum 3 nodes" error |
| AC-3 | I omit the scenario name or difficulty | I try to save | Validation rejects with specific field errors |
| AC-4 | I save a draft | Save fails mid-operation | Auto-save draft is preserved (idempotent upsert) |

**Business Rules**:
- Scenario name required, minimum 3 dialogue nodes, difficulty level required. _Source: T009.rules_
- New scenarios start in "draft" status. _Source: T009, CN006_

**Error Scenarios**:
- Save failure -> auto-draft preservation. _Source: T009.exceptions_

_Source: T009, F003_

---

### REQ-011 Review Scenario Content (P0)

**User Story**: As a content operator (R004), I want to review pending scenarios for accuracy and cultural appropriateness so that only quality content goes live.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | Scenarios are in "review" status | I request the review queue | I see a list of pending scenarios sorted by submission date |
| AC-2 | I approve a scenario | The review is submitted | Scenario status changes to "published" and becomes visible to learners |
| AC-3 | I reject a scenario | I submit rejection with reason | Scenario status changes to "rejected"; author is notified; reason is stored |
| AC-4 | I try to reject without a reason | I submit rejection | Validation rejects: "rejection reason required" |
| AC-5 | A scenario has been pending review > 48h | System checks | An escalation notification is sent |

**Business Rules**:
- Rejection must include a reason. _Source: T010.rules_
- Approved scenarios auto-publish (status -> published). _Source: T010.rules, CN006_
- Only "published" scenarios visible to learners. _Source: CN006_

**Error Scenarios**:
- Review pending > 48h -> auto-escalation notification. _Source: T010.exceptions_

_Source: T010, F003, CN006_

---

## 3. Producer -- R005 AI Trainer

### REQ-012 View AI Conversation Quality Scores (P0)

**User Story**: As an AI trainer (R005), I want to see AI conversation quality scores, low-scoring conversations, and score trends so that I can monitor and improve AI output quality.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | Conversations have quality scores | I request the quality dashboard | I receive aggregate stats (avg score, distribution) and trend data |
| AC-2 | I want to investigate poor conversations | I request low-score conversations | I receive conversations sorted by score ascending with filters (date range, scenario, score threshold) |

_Source: T029, F006, TS001_

---

## 4. Producer -- R006 Data Operations

### REQ-013 View Key Metrics Dashboard (P0)

**User Story**: As a data operator (R006), I want to view DAU/MAU, retention, speaking-time, and revenue metrics so that I can monitor product health.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | Metric data is available | I request the dashboard | I receive DAU, MAU, retention rates, avg speaking time, and revenue figures |
| AC-2 | I set alert thresholds | A metric breaches the threshold | A notification is generated for the operator |

_Source: T025, F007_

---

## 5. Admin -- R007 System Administrator

### REQ-014 Manage User Accounts (P0)

**User Story**: As a system administrator (R007), I want to search, view, and ban/unban user accounts so that I can maintain a healthy platform.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | Users exist in the system | I search by name/email/phone | I receive a paginated list of matching users |
| AC-2 | I view a user | I request user details | I receive profile, subscription status, learning summary, and ban history |
| AC-3 | I ban a user with confirmation | The ban is submitted with reason | User status is set to "banned"; an AuditLog entry is created; the user's active sessions are invalidated |
| AC-4 | I try to ban without confirmation flag | The ban is submitted | Request is rejected: "ban requires explicit confirmation" |

**Business Rules**:
- Ban operation requires explicit confirmation flag + reason. _Source: T033.exceptions, CN008_
- All ban/unban operations logged to AuditLog. _Source: CN008_

_Source: T033, CN008_

---

## 6. Non-Functional Requirements

### NFR-001 Free Tier Rate Limiting

Free-tier users are limited to 3 conversation sessions per calendar day. Enforcement at middleware layer; not hardcoded in business logic. Counter resets at midnight UTC. Premium users bypass this limit.

_Source: CN001_

### NFR-002 Audit Logging for Sensitive Operations

All payment-related write operations (subscription create/cancel, refund, scene-pack purchase) and user ban/unban operations must produce an AuditLog record containing: operator_id, action, target_entity, target_id, payload snapshot, idempotency key, timestamp, IP address.

_Source: CN005, CN008_

### NFR-003 Data Retention on Account Deletion

When a user account is deactivated (soft-delete), all user data must be retained for 30 calendar days before permanent deletion. During this period the account can be reactivated.

_Source: CN003_

### NFR-004 Pronunciation Threshold Bounds

All pronunciation assessment threshold values must be within the range [0.0, 1.0]. The API must reject any configuration update outside this range.

_Source: CN007_

### NFR-005 Scenario Publish Gate

No scenario may transition to "published" status without passing through the "review" -> "approved" workflow. Direct draft-to-published transitions are forbidden.

_Source: CN006_

### NFR-006 Streak Restoration Limit

Streak restoration is limited to 1 time per user per calendar month. The system must track and enforce this limit.

_Source: CN004_

### NFR-007 External Service Isolation

Every external service (OpenAI, Azure Speech, RevenueCat, Expo Push, FSRS) must be wrapped in a dedicated service module under `services/`. Business logic must never import SDK packages directly.

_Source: forge-decisions.coding_principles.universal[3]_

### NFR-008 Authentication and Authorization

All API endpoints (except `/auth/login`, `/auth/register`, `/health`) require a valid JWT bearer token. Role-based access control (RBAC) enforces permission boundaries per role (R001-R007). Admin endpoints require `admin` or `operator` role.

_Source: project-manifest.auth_strategy_

### NFR-009 API Response Consistency

All API responses follow a unified envelope: `{ "code": int, "message": str, "data": T | null }`. Error responses include a machine-readable error code from a centralized error-code enum.

_Source: forge-decisions.coding_principles.universal[1]_
