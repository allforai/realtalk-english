# Tasks -- api-backend (sp-001)

> Sub-project: **api-backend** | Stack: FastAPI + SQLAlchemy + PostgreSQL
>
> Architecture: three-layer | Auth: JWT | Port: 8000
>
> Total: 34 active tasks (B0-B5) + 29 deferred tasks

---

## B0 -- Project Bootstrap

### TASK-B0-001: Initialize FastAPI project structure

**Files**:
- `apps/api-backend/pyproject.toml`
- `apps/api-backend/app/__init__.py`
- `apps/api-backend/app/main.py`
- `apps/api-backend/Dockerfile`
- `apps/api-backend/.env.example`

**Implementation**:
- Create `pyproject.toml` with dependencies: fastapi, uvicorn, sqlalchemy[asyncio], asyncpg, pydantic, pydantic-settings, python-jose[cryptography], passlib[bcrypt], python-multipart, openai, langchain, azure-cognitiveservices-speech-sdk, py-fsrs, tenacity, httpx, alembic, pytest, pytest-asyncio
- Create `main.py` with FastAPI app, lifespan handler for DB pool, CORS config
- Create `Dockerfile` with multi-stage build (python:3.12-slim)
- Create `.env.example` with all required env vars (DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, AZURE_SPEECH_KEY, REVENUECAT_WEBHOOK_SECRET, EXPO_PUSH_URL)

_Requirements_: Foundation for all subsequent tasks
_Guardrails_: Pin major dependency versions in pyproject.toml; use `[project.optional-dependencies]` for dev/test
_Risk_: Low

---

### TASK-B0-002: Configure database connection and Alembic

**Files**:
- `apps/api-backend/app/core/database.py`
- `apps/api-backend/app/core/config.py`
- `apps/api-backend/alembic.ini`
- `apps/api-backend/app/migrations/env.py`

**Implementation**:
- Create async SQLAlchemy engine + session factory using `create_async_engine`
- Create `get_db` async dependency for FastAPI dependency injection
- Create `Settings` class via pydantic-settings loading from `.env`
- Initialize Alembic with async support; `env.py` imports all models for auto-generation

_Requirements_: REQ-* (all entities require DB)
_Guardrails_: Connection pool max_size configurable via env; use `pool_pre_ping=True`
_Risk_: Low

---

### TASK-B0-003: Create shared core utilities

**Files**:
- `apps/api-backend/app/core/errors.py`
- `apps/api-backend/app/core/response.py`
- `apps/api-backend/app/core/security.py`
- `apps/api-backend/app/core/deps.py`

**Implementation**:
- `errors.py`: Define `AppError(Exception)` with code/message/http_status; define error codes enum matching design.md Section 8
- `response.py`: Unified `ApiResponse[T]` envelope `{code, message, data}`; helper `success()`, `error()`
- `security.py`: JWT encode/decode (python-jose), password hash/verify (passlib bcrypt), token expiry configurable
- `deps.py`: `get_current_user` dependency (extracts user from JWT), `require_roles(*roles)` permission checker

_Requirements_: NFR-008, NFR-009
_Guardrails_: JWT secret minimum 32 chars; access token expiry default 30min, refresh 7d
_Risk_: Low. Security module is critical -- ensure constant-time password comparison.

---

## B1 -- Foundation (Entities, Migrations, Common)

### TASK-B1-001: Create base model mixins

**Files**:
- `apps/api-backend/app/models/base.py`

**Implementation**:
- `UUIDMixin`: `id = Column(UUID, primary_key=True, default=uuid4)`
- `TimestampMixin`: `created_at`, `updated_at` with server-side defaults
- `DeclarativeBase` using SQLAlchemy 2.0 mapped_column style

_Requirements_: All entities
_Guardrails_: Use `server_default=func.now()` for timestamps; `updated_at` uses `onupdate=func.now()`
_Risk_: Low

---

### TASK-B1-002: Create User and Role models

**Files**:
- `apps/api-backend/app/models/user.py`
- `apps/api-backend/app/models/role.py`

**Implementation**:
- User model per design.md Section 3.2 (User entity). Include all fields: email, phone, password_hash, display_name, is_active, is_banned, ban_reason, deactivated_at, subscription_tier, expo_push_token
- Role model with permissions. UserRole association table
- Permission model with (role_id, resource, action)
- Add all indexes per design spec

_Requirements_: REQ-008, REQ-014, NFR-003, NFR-008
_Guardrails_: `email` and `phone` UNIQUE constraints; `deactivated_at` populated on soft-delete (CN003)
_Risk_: Low

_Source: T039, T033, CN003, CN008_

---

### TASK-B1-003: Create Scenario, ScenarioPack, ScenarioTag models

**Files**:
- `apps/api-backend/app/models/scenario.py`
- `apps/api-backend/app/models/scenario_pack.py`
- `apps/api-backend/app/models/scenario_tag.py`

**Implementation**:
- Scenario with status enum (draft/review/published/rejected/archived), dialogue_nodes JSONB, target_roles JSONB
- ScenarioPack with price_cents, is_published
- ScenarioTag with category
- ScenarioTagMap association table
- All indexes and FK relationships per design spec

_Requirements_: REQ-001, REQ-010, REQ-011, NFR-005
_Guardrails_: Status transitions enforced at service layer (state machine). dialogue_nodes minimum 3 validated at service layer, not DB constraint.
_Risk_: Low

_Source: T001, T009, T010, CN006_

---

### TASK-B1-004: Create Conversation and ConversationMessage models

**Files**:
- `apps/api-backend/app/models/conversation.py`
- `apps/api-backend/app/models/conversation_message.py`

**Implementation**:
- Conversation with status enum (active/completed/abandoned), report fields (overall_score, grammar_errors JSONB, expression_suggestions JSONB), duration_seconds, message_count, word_count
- ConversationMessage with role enum (user/ai/system), content, audio_url, token_count, sequence
- All indexes per design spec

_Requirements_: REQ-002, REQ-003
_Guardrails_: Composite index on (user_id, created_at) for efficient user conversation listing
_Risk_: Low

_Source: T002, T003_

---

### TASK-B1-005: Create PronunciationScore model

**Files**:
- `apps/api-backend/app/models/pronunciation_score.py`

**Implementation**:
- All score fields with CHECK constraints: `accuracy_score BETWEEN 0.0 AND 1.0` (same for fluency, completeness, prosody)
- phoneme_details JSONB
- Indexes on user_id and message_id

_Requirements_: REQ-004, NFR-004
_Guardrails_: CHECK constraints at DB level enforce CN007 range. prosody_score is NULLABLE (en-US only).
_Risk_: Low

_Source: T005, CN007, TS002_

---

### TASK-B1-006: Create VocabularyItem and ReviewCard models

**Files**:
- `apps/api-backend/app/models/vocabulary_item.py`
- `apps/api-backend/app/models/review_card.py`

**Implementation**:
- VocabularyItem with source_type enum, mastery_level enum, UNIQUE(user_id, word)
- ReviewCard with FSRS fields: stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state enum, due timestamp
- FK from ReviewCard to VocabularyItem

_Requirements_: REQ-005
_Guardrails_: FSRS parameter fields (stability, difficulty) are floats managed exclusively by srs_service -- never set directly by handlers
_Risk_: Low

_Source: T007, TS004_

---

### TASK-B1-007: Create UserStreak and Achievement models

**Files**:
- `apps/api-backend/app/models/user_streak.py`
- `apps/api-backend/app/models/achievement.py`

**Implementation**:
- UserStreak with UNIQUE(user_id), restorations_this_month, restoration_month
- Achievement with code UNIQUE, criteria JSONB
- UserAchievement association table with earned_at

_Requirements_: REQ-006, NFR-006
_Guardrails_: restoration_month resets when calendar month changes; compare before decrement
_Risk_: Low

_Source: T013, CN004_

---

### TASK-B1-008: Create Subscription, AuditLog, Notification, Feedback, PromptTemplate, SystemConfig, DailyConversationCount models

**Files**:
- `apps/api-backend/app/models/subscription.py`
- `apps/api-backend/app/models/audit_log.py`
- `apps/api-backend/app/models/notification.py`
- `apps/api-backend/app/models/feedback.py`
- `apps/api-backend/app/models/prompt_template.py`
- `apps/api-backend/app/models/system_config.py`
- `apps/api-backend/app/models/daily_conversation_count.py`

**Implementation**:
- Subscription: revenuecat_id UNIQUE, plan enum, status enum
- AuditLog: append-only (no UPDATE/DELETE at ORM level); idempotency_key, ip_address
- Notification: type enum, is_read, data JSONB
- Feedback: type enum, status enum, admin_reply
- PromptTemplate: system_prompt, user_prompt_template, variables JSONB, is_active, version
- SystemConfig: key UNIQUE, value TEXT, value_type enum
- DailyConversationCount: UNIQUE(user_id, date)

_Requirements_: REQ-002 (CN001), REQ-009, NFR-001, NFR-002
_Guardrails_: AuditLog must have no `__mapper_args__` enabling update. DailyConversationCount date defaults to UTC today.
_Risk_: Low

_Source: CN001, CN005, CN008, T044, TS003, TS006_

---

### TASK-B1-009: Generate initial Alembic migration

**Files**:
- `apps/api-backend/app/migrations/versions/001_initial.py`
- `apps/api-backend/app/models/__init__.py` (barrel export)

**Implementation**:
- Create `__init__.py` that imports all models so Alembic auto-detects them
- Run `alembic revision --autogenerate -m "001_initial"` to generate migration
- Verify all tables, indexes, constraints, and enum types are present
- Add seed data for: default roles (consumer, operator, admin), default system configs (free_daily_limit=3, round_timeout_sec=300)

_Requirements_: All entity tasks (B1-001 through B1-008)
_Guardrails_: Review auto-generated migration before committing; verify CHECK constraints on pronunciation scores
_Risk_: Medium -- migration must be reviewed manually for correctness

---

### TASK-B1-010: Create GenericRepository base

**Files**:
- `apps/api-backend/app/repositories/base.py`

**Implementation**:
- `GenericRepository[T]` with: `get_by_id(id)`, `list(filters, page, size)`, `create(data)`, `update(id, data)`, `soft_delete(id)`
- All methods are async, accept `AsyncSession`
- Pagination returns `{items: T[], total: int, page: int, size: int}`
- Filtering via dict of field->value with optional operators (eq, in, gte, lte, like)

_Requirements_: All repository tasks
_Guardrails_: Never expose raw SQL; use SQLAlchemy select() builder
_Risk_: Low

---

## B2 -- Handlers + Services + DTOs + Middleware (CORE tasks only)

### TASK-B2-001: Implement middleware chain

**Files**:
- `apps/api-backend/app/middleware/auth.py`
- `apps/api-backend/app/middleware/rate_limit.py`
- `apps/api-backend/app/middleware/audit_log.py`
- `apps/api-backend/app/middleware/error_handler.py`
- `apps/api-backend/app/middleware/request_id.py`

**Implementation**:
- **AuthMiddleware**: Decode JWT from `Authorization: Bearer <token>`, set `request.state.user_id` and `request.state.roles`. Skip paths: `/api/v1/auth/*`, `/health`, `/docs`, `/openapi.json`, `/api/v1/webhooks/*`. Return 401 for invalid/expired tokens.
- **RateLimitMiddleware**: On `POST /api/v1/conversations` only: query DailyConversationCount; if count >= config limit AND user is free tier, return 429 with error code CONV_001. _Source: CN001_
- **AuditLogMiddleware**: For configured paths (ban/unban, webhook), capture operator_id, request body, response status, write AuditLog after handler. _Source: CN005, CN008_
- **ErrorHandlerMiddleware**: Catch `AppError` -> return ApiResponse with correct HTTP status and error code. Catch unhandled -> 500 GENERAL_001. Log stack trace.
- **RequestIdMiddleware**: Generate UUID, set `X-Request-ID` header on response.
- Register all in `main.py` in correct order per design.md Section 5.

_Requirements_: NFR-001, NFR-002, NFR-008, NFR-009
_Guardrails_: Rate limit must query DB, not in-memory counter (multi-instance safe). Audit log writes must not block the response (use background task or after-response hook).
_Risk_: Medium -- middleware ordering is critical; test with integration tests

_Source: CN001, CN005, CN008_

---

### TASK-B2-002: Implement Auth handler + service + schemas

**Files**:
- `apps/api-backend/app/handlers/auth.py`
- `apps/api-backend/app/services/auth_service.py`
- `apps/api-backend/app/schemas/auth.py`
- `apps/api-backend/app/repositories/user_repo.py`

**Implementation**:
- **Schemas**: RegisterRequest, LoginRequest, TokenResponse per design.md Section 4.1
- **auth_service**: `register(data)` -- validate unique email/phone, hash password, create User + assign 'consumer' role, return tokens. `login(email, password)` -- verify credentials, check is_banned (403 AUTH_003), check is_active, return JWT pair. `refresh(refresh_token)` -- validate, return new access token. `logout(refresh_token)` -- invalidate.
- **Handler**: FastAPI router `/auth/*` with 4 endpoints. All public (no auth required).
- **user_repo**: `get_by_email()`, `get_by_phone()`, `create_user()`, `check_credentials()`

_Requirements_: REQ-008
_Guardrails_: Password hashing uses bcrypt with work factor 12. JWT claims: {sub: user_id, roles: [...], exp, iat}. Refresh tokens stored hashed in DB or Redis.
_Risk_: Medium -- security-sensitive; ensure constant-time comparison

_Source: T039_

---

### TASK-B2-003: Implement Scenario handler + service + schemas (browse + CRUD + review)

**Files**:
- `apps/api-backend/app/handlers/scenario.py`
- `apps/api-backend/app/services/scenario_service.py`
- `apps/api-backend/app/schemas/scenario.py`
- `apps/api-backend/app/repositories/scenario_repo.py`

**Implementation**:
- **Schemas**: ScenarioListQuery, ScenarioListItem, ScenarioDetail, ScenarioCreateReq, ReviewRequest per design.md Section 4.2
- **scenario_repo**: List published scenarios with filters (difficulty, tag, role), join tags, join user progress. Review queue query (status=review, ordered by submitted_at).
- **scenario_service**:
  - `list_scenarios(filters, user_id)` -- only status=published for consumers; add user progress (not started/in progress/completed). _Source: T001_
  - `create_scenario(data, author_id)` -- create with status=draft. _Source: T009_
  - `update_scenario(id, data)` -- only if status=draft. _Source: T009_
  - `submit_for_review(id)` -- validate: title non-empty, nodes >= 3, difficulty set; transition draft -> review. _Source: T009, CN006_
  - `review_scenario(id, action, reason, reviewer_id)` -- approve: review -> published (set published_at); reject: review -> rejected (require reason). _Source: T010, CN006_
  - State machine enforcement: only valid transitions allowed (SCEN_006 on violation).
- **Handler**: FastAPI router with all 7 endpoints per design spec. Consumer endpoints require `consumer` role; operator endpoints require `operator` role.

_Requirements_: REQ-001, REQ-010, REQ-011, NFR-005
_Guardrails_: Status transitions must be atomic (SELECT FOR UPDATE or optimistic locking). Rejection without reason -> 400 SCEN_005. Never return unpublished scenarios to consumers.
_Risk_: Medium -- state machine logic must be thoroughly tested

_Source: T001, T009, T010, F001, F003, CN006_

---

### TASK-B2-004: Implement ai_client service wrapper

**Files**:
- `apps/api-backend/app/services/ai_client.py`

**Implementation**:
- Wrapper around OpenAI SDK (`openai.AsyncOpenAI`)
- Methods:
  - `stream_conversation(messages, prompt_template) -> AsyncGenerator[str, None]` -- SSE token streaming. _Source: TS001_
  - `generate_report(messages) -> ConversationReportData` -- Non-streaming call for report generation. _Source: T003_
  - `extract_vocabulary(messages) -> list[VocabItem]` -- Extract new vocabulary from conversation. _Source: T002_
  - `generate_recommendations(user_profile, history) -> list[RecommendationItem]` -- Personalized recommendations. _Source: T020_
  - `score_quality(conversation) -> float` -- AI quality scoring. _Source: T029_
- Conversation history compression: if messages > N (configurable, default 20), auto-summarize older messages. _Source: PS2_
- Content filter: check both input and output for inappropriate content. _Source: PS1_
- Retry with tenacity (3 retries, exponential backoff). Timeout configurable.

_Requirements_: REQ-002, REQ-003, REQ-007, REQ-012
_Guardrails_: Business layer must never import `openai` directly (Principle U4). All calls log token usage for cost tracking. Catch `openai.APIError` and map to AppError.
_Risk_: High -- core dependency; must handle rate limits, timeouts, content filtering

_Source: TS001, TS005_

---

### TASK-B2-005: Implement speech_service wrapper

**Files**:
- `apps/api-backend/app/services/speech_service.py`

**Implementation**:
- Wrapper around Azure Speech SDK
- Methods:
  - `speech_to_text(audio_bytes) -> str` -- Convert audio to text. _Source: TS002_
  - `assess_pronunciation(audio_bytes, reference_text) -> PronunciationResult` -- Phoneme-level assessment (accuracy, fluency, completeness, prosody, phoneme_details). _Source: T005, TS002_
  - `text_to_speech(text) -> bytes` -- Generate reference audio. _Source: T005_
- Fallback behavior: on any Azure SDK exception, return `SpeechFallback` result with `fallback=True` flag. Business layer switches to text mode. _Source: PS4_
- Retry with tenacity (2 retries, 1s backoff).

_Requirements_: REQ-004
_Guardrails_: Never raise to caller; always return result or fallback. Log all failures for monitoring. Audio processing is CPU-bound; consider running in thread executor.
_Risk_: High -- external service; must be resilient to outages

_Source: TS002_

---

### TASK-B2-006: Implement srs_service wrapper

**Files**:
- `apps/api-backend/app/services/srs_service.py`

**Implementation**:
- Wrapper around `py-fsrs` library
- Methods:
  - `schedule_card(card: ReviewCard, rating: int) -> ReviewCard` -- Apply FSRS algorithm, return updated card with new due date, stability, difficulty. _Source: TS004_
  - `create_new_card(vocabulary_id) -> ReviewCard` -- Initialize FSRS card for new vocabulary item. _Source: T007_
  - `get_retention_rate(user_id) -> float` -- Calculate user's retention rate from review history.
- Business layer only passes `(card_id, rating)` -- all FSRS internals encapsulated. _Source: PS7_

_Requirements_: REQ-005
_Guardrails_: FSRS state (stability, difficulty, elapsed_days, etc.) must round-trip correctly between DB and FSRS lib. Unit test with known card sequences.
_Risk_: Low -- well-tested library; risk is in state mapping

_Source: TS004_

---

### TASK-B2-007: Implement push_service wrapper

**Files**:
- `apps/api-backend/app/services/push_service.py`

**Implementation**:
- HTTP client wrapper for Expo Push API
- Methods:
  - `send_notification(push_token, title, body, data) -> bool` -- Send single push notification. _Source: TS006_
  - `send_bulk(notifications: list) -> list[SendResult]` -- Batch send (Expo supports up to 100 per request).
  - `schedule_review_reminder(user_id)` -- Check due cards, send reminder if any due today. _Source: T007_
- Use `httpx.AsyncClient` with retry (tenacity, 2 retries).

_Requirements_: REQ-005, REQ-009
_Guardrails_: Handle expired push tokens gracefully (remove from User record). Rate limit: max 600 requests/min to Expo.
_Risk_: Low

_Source: TS006_

---

### TASK-B2-008: Implement Conversation handler + service + schemas (create, messages, audio, complete, report)

**Files**:
- `apps/api-backend/app/handlers/conversation.py`
- `apps/api-backend/app/services/conversation_service.py`
- `apps/api-backend/app/services/report_service.py`
- `apps/api-backend/app/schemas/conversation.py`
- `apps/api-backend/app/repositories/conversation_repo.py`
- `apps/api-backend/app/repositories/daily_count_repo.py`

**Implementation**:
- **Schemas**: CreateConversationReq, SendMessageReq, SendAudioReq, ConversationReport, SSE event types per design.md Section 4.3
- **conversation_service**:
  - `create(user_id, scenario_id)` -- check scenario exists and is published; increment DailyConversationCount; create Conversation(status=active). _Source: T002_
  - `send_message(conv_id, content, user_id) -> AsyncGenerator[SSEEvent]` -- persist user message; call ai_client.stream_conversation(); yield SSE tokens; persist AI message; extract vocabulary; yield vocabulary event; yield done event. _Source: T002, TS001, TS005_
  - `send_audio(conv_id, audio, user_id) -> AsyncGenerator[SSEEvent]` -- call speech_service.speech_to_text(); call speech_service.assess_pronunciation(); yield pronunciation event; then same as send_message. On speech failure, return fallback flag. _Source: T002, T005, TS002_
  - `complete(conv_id) -> ConversationReport` -- set status=completed, call report_service. _Source: T003_
  - `list_conversations(user_id, page, size)` -- paginated list. _Source: T002_
- **report_service**:
  - `generate_report(conversation) -> ConversationReport` -- call ai_client.generate_report(); extract grammar errors and suggestions; calculate stats (duration, word count); create ReviewCards for new vocabulary via srs_service. _Source: T003, TS001_
  - Fallback: if AI fails, return basic stats only (message_count, duration, word_count). _Source: T003.exceptions_
- **Handler**: SSE streaming endpoints use `EventSourceResponse`. Audio endpoint accepts multipart upload.
- **daily_count_repo**: `increment(user_id, date)` with upsert (INSERT ON CONFLICT UPDATE count=count+1).

_Requirements_: REQ-002, REQ-003, REQ-004
_Guardrails_: SSE must flush each event immediately. Audio upload size limit configurable (default 10MB). Conversation must belong to requesting user (ownership check). DailyConversationCount increment must be atomic (upsert).
_Risk_: High -- integrates AI + Speech + FSRS; most complex handler. Decompose into service methods.

_Source: T002, T003, T005, F001, CN001, TS001, TS002, TS004, TS005_

---

### TASK-B2-009: Implement Review (Spaced Repetition) handler + service + schemas

**Files**:
- `apps/api-backend/app/handlers/review.py`
- `apps/api-backend/app/services/review_service.py`
- `apps/api-backend/app/schemas/review.py`
- `apps/api-backend/app/repositories/review_card_repo.py`

**Implementation**:
- **Schemas**: ReviewCardDTO, RateCardReq, ReviewSummary per design.md Section 4.4
- **review_card_repo**: `get_due_cards(user_id, date)` -- WHERE due <= today AND state != 'mastered', ordered by due ASC. `update_card(card)` -- persist FSRS-updated fields.
- **review_service**:
  - `get_today_cards(user_id)` -- return due cards with vocabulary details. _Source: T007_
  - `rate_card(card_id, rating, user_id)` -- validate ownership; call srs_service.schedule_card(); persist; update VocabularyItem mastery_level if graduated. _Source: T007, TS004_
  - `get_summary(user_id)` -- count total due, reviewed today, calculate retention rate. _Source: T007_
- **Handler**: 3 endpoints per design spec.

_Requirements_: REQ-005
_Guardrails_: Rating must be 1-4 (REVIEW_002 on violation). Card must belong to requesting user. FSRS fields updated atomically.
_Risk_: Low

_Source: T007, F001, F002, TS004_

---

### TASK-B2-010: Implement Streak + Achievement handler + service + schemas

**Files**:
- `apps/api-backend/app/handlers/streak.py`
- `apps/api-backend/app/handlers/achievement.py`
- `apps/api-backend/app/services/streak_service.py`
- `apps/api-backend/app/services/achievement_service.py`
- `apps/api-backend/app/schemas/streak.py`
- `apps/api-backend/app/repositories/streak_repo.py`
- `apps/api-backend/app/repositories/achievement_repo.py`

**Implementation**:
- **streak_service**:
  - `get_streak(user_id)` -- return current streak, longest streak, can_restore flag. _Source: T013_
  - `update_streak(user_id)` -- called after conversation completion; if last_active_date == yesterday, increment; if == today, no-op; else streak broken. Update longest_streak if needed.
  - `restore_streak(user_id)` -- check restorations_this_month < 1 (reset if month changed); restore streak; increment counter. Return STREAK_001 if limit reached. _Source: CN004_
- **achievement_service**:
  - `list_achievements(user_id)` -- all achievements with earned_at (null if not earned). _Source: T013_
  - `check_and_award(user_id)` -- evaluate criteria for unearned achievements; award matching ones; send push notification for new awards.
- **Handler**: 3 endpoints (get streak, restore, list achievements).

_Requirements_: REQ-006, NFR-006
_Guardrails_: Streak restoration month comparison must use UTC. Concurrent restoration requests must be idempotent (SELECT FOR UPDATE or atomic increment with condition).
_Risk_: Medium -- date boundary logic is error-prone; needs thorough unit tests

_Source: T013, CN004_

---

### TASK-B2-011: Implement Recommendation handler + service + schemas

**Files**:
- `apps/api-backend/app/handlers/recommendation.py`
- `apps/api-backend/app/services/recommendation_service.py`
- `apps/api-backend/app/schemas/recommendation.py`

**Implementation**:
- **recommendation_service**:
  - `get_recommendations(user_id)` -- gather user profile (level, goals, history); call ai_client.generate_recommendations(); return ranked list with reasons. _Source: T020_
  - Fallback for new users: return popular/trending scenarios (by conversation count, last 7 days). _Source: REQ-007 AC-2_
  - Cache recommendations for 1 hour (per user) to reduce AI calls.
- **Handler**: 1 GET endpoint.

_Requirements_: REQ-007
_Guardrails_: AI recommendation call should be < 3s; use timeout. Cache invalidation on new conversation completion.
_Risk_: Medium -- AI latency; cache strategy important

_Source: T020, F004, TS001, TS004_

---

### TASK-B2-012: Implement AI Quality handler + service + schemas (operator)

**Files**:
- `apps/api-backend/app/handlers/ai_quality.py`
- `apps/api-backend/app/services/ai_quality_service.py`
- `apps/api-backend/app/schemas/ai_quality.py`

**Implementation**:
- **ai_quality_service**:
  - `get_overview(date_range)` -- aggregate avg_score, score distribution (0-1, 1-2, 2-3, 3-4, 4-5), daily trend. _Source: T029_
  - `get_low_score_conversations(filters)` -- conversations with overall_score below threshold, paginated, with filters (date, scenario, score). _Source: T029_
- **Handler**: 2 GET endpoints under `/admin/ai-quality/`. Require `operator` role.

_Requirements_: REQ-012
_Guardrails_: Aggregation queries should use DB indexes on (overall_score, created_at). Consider materialized view for trend data if performance is an issue.
_Risk_: Low

_Source: T029, F006_

---

### TASK-B2-013: Implement Metrics Dashboard handler + service + schemas (operator)

**Files**:
- `apps/api-backend/app/handlers/metrics.py`
- `apps/api-backend/app/services/metrics_service.py`
- `apps/api-backend/app/schemas/metrics.py`

**Implementation**:
- **metrics_service**:
  - `get_dashboard(date_range)` -- calculate DAU (distinct users with conversations today), MAU (30-day), retention rates (D1, D7, D30), avg speaking time, revenue summary. _Source: T025_
  - `create_alert(metric, operator, threshold)` -- persist alert config (use SystemConfig or dedicated table). _Source: T025_
- **Handler**: 1 GET + 1 POST under `/admin/metrics/`. Require `operator` role.

_Requirements_: REQ-013
_Guardrails_: DAU/MAU queries can be expensive; cache for 5 minutes. Retention calculation uses cohort analysis (registration date cohorts).
_Risk_: Medium -- complex aggregation queries; may need optimization

_Source: T025, F007_

---

### TASK-B2-014: Implement User Management handler + service + schemas (admin)

**Files**:
- `apps/api-backend/app/handlers/user_mgmt.py`
- `apps/api-backend/app/services/user_mgmt_service.py`
- `apps/api-backend/app/schemas/user_mgmt.py`

**Implementation**:
- **user_mgmt_service**:
  - `search_users(query, page, size)` -- search by name/email/phone using ILIKE. _Source: T033_
  - `get_user_detail(user_id)` -- profile + subscription status + learning summary (total conversations, streak, achievement count). _Source: T033_
  - `ban_user(user_id, reason, confirm, operator_id)` -- require confirm=True (USER_001 if false); set is_banned=True, ban_reason; invalidate sessions; write AuditLog. _Source: T033, CN008_
  - `unban_user(user_id, operator_id)` -- set is_banned=False, clear ban_reason; write AuditLog. _Source: T033, CN008_
- **Handler**: 4 endpoints under `/admin/users/`. Require `admin` role.

_Requirements_: REQ-014, NFR-002
_Guardrails_: Ban confirmation must be explicit boolean in request body (not query param). All ban/unban writes an AuditLog entry (CN008) -- this is in addition to middleware audit.
_Risk_: Medium -- security-sensitive; ban must invalidate all active tokens

_Source: T033, CN008_

---

### TASK-B2-015: Implement Notification handler + service + schemas

**Files**:
- `apps/api-backend/app/handlers/notification.py`
- `apps/api-backend/app/services/notification_service.py`
- `apps/api-backend/app/schemas/notification.py`
- `apps/api-backend/app/repositories/notification_repo.py`

**Implementation**:
- **notification_service**:
  - `list_notifications(user_id, page, size)` -- paginated, newest first, include unread count. _Source: T044_
  - `mark_read(notification_id, user_id)` -- ownership check, set is_read=True. _Source: T044_
  - `update_settings(user_id, preferences)` -- update User notification preferences (push enabled, email enabled, quiet hours). _Source: T044_
  - `create_notification(user_id, type, title, body, data)` -- internal method used by other services. Also trigger push via push_service if user has token. _Source: T044, TS006_
- **Handler**: 3 endpoints per design spec.

_Requirements_: REQ-009
_Guardrails_: Notification creation is a side effect of other operations (review reminder, achievement, escalation) -- must not block the main operation. Use FastAPI BackgroundTasks.
_Risk_: Low

_Source: T044, TS006_

---

### TASK-B2-016: Implement RevenueCat Webhook handler + subscription service

**Files**:
- `apps/api-backend/app/handlers/webhook.py`
- `apps/api-backend/app/services/subscription_service.py`
- `apps/api-backend/app/repositories/subscription_repo.py`

**Implementation**:
- **subscription_service**:
  - `process_webhook(event)` -- parse RevenueCat webhook event types (INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, etc.); upsert Subscription record; update User.subscription_tier cache. _Source: TS003_
  - Write AuditLog for every webhook event (CN005). _Source: CN005_
  - Idempotency: use event_id from RevenueCat as idempotency_key in AuditLog. _Source: CN005_
- **Handler**: 1 POST endpoint at `/webhooks/revenuecat`. Auth via signature verification (HMAC). Not behind JWT middleware.

_Requirements_: NFR-002 (audit logging)
_Guardrails_: Verify webhook signature using REVENUECAT_WEBHOOK_SECRET. Reject replayed events (check idempotency_key). Always return 200 to RevenueCat even on processing errors (log + alert internally).
_Risk_: Medium -- webhook processing must be idempotent and never lose events

_Source: TS003, CN005_

---

## B4 -- API Documentation, Health Check, Error Code Unification

### TASK-B4-001: Implement health check endpoint

**Files**:
- `apps/api-backend/app/handlers/system.py`

**Implementation**:
- `GET /health` -- return `{status: "ok", version: str, db: "connected"|"error"}`. Check DB connectivity with a simple `SELECT 1`.
- No authentication required.

_Requirements_: -- (operational)
_Guardrails_: DB check must have a 2s timeout; return "degraded" on timeout, not 500
_Risk_: Low

---

### TASK-B4-002: Configure OpenAPI/Swagger documentation

**Files**:
- `apps/api-backend/app/main.py` (update)

**Implementation**:
- Configure FastAPI OpenAPI metadata: title="RealTalk English API", version, description
- Group endpoints by tags matching modules (Auth, Scenarios, Conversations, Reviews, Streaks, Recommendations, AI Quality, Metrics, User Management, Notifications, Webhooks, System)
- Add security scheme (Bearer JWT) in OpenAPI spec
- Ensure all schemas have proper `json_schema_extra` examples

_Requirements_: -- (DX)
_Guardrails_: Swagger UI accessible at `/docs`; ReDoc at `/redoc`. Both public.
_Risk_: Low

---

### TASK-B4-003: Unify error codes and response format

**Files**:
- `apps/api-backend/app/core/errors.py` (update)
- `apps/api-backend/app/core/response.py` (update)

**Implementation**:
- Finalize all error codes from design.md Section 8 in the ErrorCode enum
- Ensure every handler returns `ApiResponse` envelope consistently
- Add Pydantic validation error handler that maps `RequestValidationError` to GENERAL_002 format
- Add 404 handler for unknown routes

_Requirements_: NFR-009
_Guardrails_: No handler may return a raw dict; all must use `ApiResponse`. Add a test that verifies all error codes are documented.
_Risk_: Low

---

## B5 -- Tests

### TASK-B5-001: Set up test infrastructure

**Files**:
- `apps/api-backend/tests/conftest.py`
- `apps/api-backend/tests/__init__.py`
- `apps/api-backend/pyproject.toml` (update test deps)

**Implementation**:
- Configure pytest with `pytest-asyncio`
- Create test database fixture (SQLite in-memory or Testcontainers PostgreSQL)
- Create `TestClient` fixture with FastAPI test client
- Create authenticated client fixtures (consumer, operator, admin) with pre-generated JWT tokens
- Create seed data fixtures: test user, test scenario (published), test conversation

_Requirements_: All tests
_Guardrails_: Each test must be isolated (transaction rollback). Test DB uses same Alembic migrations.
_Risk_: Low

---

### TASK-B5-002: Unit tests for services

**Files**:
- `apps/api-backend/tests/unit/test_auth_service.py`
- `apps/api-backend/tests/unit/test_scenario_service.py`
- `apps/api-backend/tests/unit/test_conversation_service.py`
- `apps/api-backend/tests/unit/test_review_service.py`
- `apps/api-backend/tests/unit/test_streak_service.py`
- `apps/api-backend/tests/unit/test_recommendation_service.py`
- `apps/api-backend/tests/unit/test_user_mgmt_service.py`
- `apps/api-backend/tests/unit/test_subscription_service.py`

**Implementation**:
- Mock repositories and external services (ai_client, speech_service, srs_service, push_service)
- **auth_service**: test register (duplicate email), login (wrong password, banned user), token refresh
- **scenario_service**: test state machine transitions (valid + invalid), validation (< 3 nodes, empty title), review (reject without reason)
- **conversation_service**: test creation, message flow, audio fallback
- **review_service**: test FSRS integration (mock srs_service), invalid rating
- **streak_service**: test streak update logic (consecutive days, gap, restoration, monthly limit)
- **user_mgmt_service**: test ban without confirmation, ban with audit log
- **subscription_service**: test webhook event processing, idempotency

_Requirements_: All REQ-* and NFR-*
_Guardrails_: Minimum 80% coverage on service layer. Every business rule from requirements.md must have a corresponding test case.
_Risk_: Medium -- test quality determines production reliability

---

### TASK-B5-003: API integration tests

**Files**:
- `apps/api-backend/tests/integration/test_auth_api.py`
- `apps/api-backend/tests/integration/test_scenario_api.py`
- `apps/api-backend/tests/integration/test_conversation_api.py`
- `apps/api-backend/tests/integration/test_review_api.py`
- `apps/api-backend/tests/integration/test_streak_api.py`
- `apps/api-backend/tests/integration/test_notification_api.py`
- `apps/api-backend/tests/integration/test_user_mgmt_api.py`
- `apps/api-backend/tests/integration/test_webhook_api.py`

**Implementation**:
- Full request-response tests using FastAPI TestClient
- **Auth**: register -> login -> refresh -> authenticated request -> logout
- **Scenarios**: create draft -> update -> submit review -> approve -> visible in list. Reject flow. Consumer cannot see unpublished.
- **Conversations**: create (check rate limit for free tier) -> send message (mock AI) -> complete -> get report
- **Reviews**: get today cards -> rate card -> check updated due date
- **Streaks**: complete conversation -> check streak incremented -> break streak -> restore -> try second restore (fail)
- **Notifications**: list -> mark read -> check count decremented
- **User Mgmt**: search -> ban without confirm (400) -> ban with confirm (200) -> verify user cannot login
- **Webhook**: valid RevenueCat event -> subscription updated + audit log created. Invalid signature -> 401.
- **Middleware**: test 429 on free tier limit; test audit log creation on ban; test CORS headers

_Requirements_: All REQ-* and NFR-*
_Guardrails_: External services must be mocked (no real AI/Speech calls). Each test verifies both response body and side effects (DB state).
_Risk_: Medium -- integration test setup can be complex

---

## DEFERRED Tasks

> These tasks are out of scope for the current iteration. Listed here for future planning.
> They share DB entities already created in B1 and can be implemented by adding new handlers/services.

| ID | Task Name | Reason | Dependencies |
|----|-----------|--------|--------------|
| T004 | [DEFERRED] 进行自由对话 | Medium frequency; secondary scenario. Shares ai_client with T002. | ai_client.py, conversation models |
| T006 | [DEFERRED] 查看发音详细报告 | Medium frequency. Shares speech_service with T005. | speech_service.py, PronunciationScore model |
| T008 | [DEFERRED] 管理词汇本 | Medium frequency. VocabularyItem model already exists. | VocabularyItem model |
| T011 | [DEFERRED] 管理场景包 | Medium frequency. ScenarioPack model already exists. Requires CN006 (review gate). | ScenarioPack model, scenario_service |
| T012 | [DEFERRED] 管理场景标签 | Medium frequency. ScenarioTag model already exists. | ScenarioTag model |
| T014 | [DEFERRED] 查看排行榜 | Medium frequency. Needs new leaderboard queries. | User, Conversation models |
| T015 | [DEFERRED] 兑换积分商品 | Medium frequency. Needs new PointsShop + PointsTransaction entities. | New entities required |
| T017 | [DEFERRED] 查看个人学习档案 | Medium frequency. Aggregation from existing data. | Conversation, PronunciationScore, VocabularyItem |
| T018 | [DEFERRED] 查看学习统计报告 | Medium frequency. Aggregation queries on existing data. | Conversation, PronunciationScore |
| T021 | [DEFERRED] 使用紧急场景速学 | Medium frequency; R003 specific. Shares speech_service. | Scenario, speech_service |
| T022 | [DEFERRED] 订阅付费方案 | Low frequency; revenue-critical. Needs RevenueCat client-side integration. | Subscription model, subscription_service |
| T023 | [DEFERRED] 管理订阅 | Low frequency. Extends subscription_service. | Subscription model |
| T024 | [DEFERRED] 购买场景包 | Low frequency. Needs payment flow + CN005 audit. | ScenarioPack, Subscription, audit_log |
| T026 | [DEFERRED] 分析用户行为 | Medium frequency; operator feature. Complex analytics queries. | All user activity models |
| T027 | [DEFERRED] 管理A/B测试 | Medium frequency. Needs new ABTest + ABVariant entities. | New entities required |
| T028 | [DEFERRED] 生成运营报告 | Medium frequency. Template-based report generation. | metrics_service, All models |
| T030 | [DEFERRED] 标注异常对话 | Medium frequency. Needs new ConversationAnnotation entity. | Conversation model, new entity |
| T031 | [DEFERRED] 管理Prompt模板 | Medium frequency. PromptTemplate model already exists. | PromptTemplate model |
| T032 | [DEFERRED] 调整发音评估参数 | Low frequency. SystemConfig for thresholds. CN007 range validation. | SystemConfig model, CN007 |
| T034 | [DEFERRED] 处理订阅与退款 | Medium frequency; high risk. CN002 + CN005 enforcement. | Subscription model, audit_log, CN002 |
| T035 | [DEFERRED] 配置系统参数 | Low frequency; high risk. SystemConfig CRUD. | SystemConfig model |
| T036 | [DEFERRED] 管理权限角色 | Low frequency. Role + Permission CRUD. | Role, Permission models |
| T037 | [DEFERRED] 处理用户投诉 | Medium frequency. Feedback status workflow. | Feedback model |
| T038 | [DEFERRED] 注册账户 (extended) | Basic register in B2-002; extended = phone + OAuth + onboarding. | auth_service |
| T040 | [DEFERRED] 管理个人设置 | Low frequency. Profile update + notification preferences. | User model |
| T041 | [DEFERRED] 重置密码 | Low frequency. Email/SMS verification flow. | User model, email service |
| T042 | [DEFERRED] 注销账户 | Low frequency; high risk. CN003 30-day retention + soft-delete. | User model, CN003 |
| T043 | [DEFERRED] 完成新手引导 | Low frequency. Onboarding wizard state tracking. | User model (preferences) |
| T045 | [DEFERRED] 提交意见反馈 | Low frequency. Feedback model already exists. | Feedback model |
