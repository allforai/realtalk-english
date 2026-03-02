# Requirements -- mobile-app (sp-003)

> Sub-project: **mobile-app** | Stack: React Native + Expo + TypeScript | Auth: JWT
>
> Generated from: product-map v2.5.0, feature-prune decisions, forge-decisions.json
>
> Scope: 9 CORE tasks + non-functional requirements. DEFER tasks excluded from active implementation.

---

## 1. Consumer -- R001 Working Professional / R002 Hobbyist / R003 Immigrant

### REQ-M001 Browse and Select Scenarios (P0)

**User Story**: As a consumer (R001/R002/R003), I want to browse and filter scenarios by difficulty, topic, and role on my mobile device so that I can quickly find a relevant practice scenario.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | App is loaded and user is authenticated | I navigate to the scenario list screen (S001) | I see a scrollable list of published scenarios with title, difficulty badge, tags, and personal progress indicator |
| AC-2 | I apply filters (difficulty, tag) | I interact with the filter bar | The list updates to show only matching scenarios; empty state shown if no results |
| AC-3 | I tap a scenario card | I navigate to the scenario detail screen (S002) | I see full description, dialogue preview, difficulty, estimated duration, and a "Start Practice" CTA |
| AC-4 | I have completed a scenario previously | I view the scenario list | The scenario card shows a completion badge with my last score |
| AC-5 | Network connection is lost | I open the scenario list | I see cached scenarios from the last successful fetch; a banner indicates offline mode |

**Business Rules**:
- Scenarios sorted by personalized recommendation score from `GET /api/v1/scenarios`. _Source: T001.rules_
- Pull-to-refresh triggers a fresh API call. Stale data allowed up to 5 minutes.
- Scenario progress badge: "Not Started" / "In Progress" / "Completed (score)". _Source: T001.rules_

**Error Scenarios**:
- Network error on initial load -> show cached data if available, otherwise show full-screen error with retry button. _Source: T001.exceptions_
- API returns empty list -> show illustrated empty state with "Explore other filters" prompt.

_Source: T001, S001, S002, F001, F004_

---

### REQ-M002 Conduct Scenario Conversation (P0)

**User Story**: As a consumer, I want to practice English conversation with an AI within a scenario using voice or text input on my mobile device so that I can improve my spoken English in a realistic context.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I tap "Start Practice" on a scenario | A conversation starts | The AI conversation screen (S003) opens; the AI sends an opening message via SSE streaming with animated text rendering |
| AC-2 | I type a message and send it | The message is submitted | My message appears in the chat; AI response streams in token-by-token via SSE (`POST /api/v1/conversations/{id}/messages`) |
| AC-3 | I tap the microphone button and speak | Audio is recorded and sent | Audio is uploaded via `POST /api/v1/conversations/{id}/messages/audio`; real-time pronunciation scores appear inline below my message bubble |
| AC-4 | I am a free-tier user with 3 conversations used today | I try to start a new conversation | A paywall modal appears showing the upgrade prompt (HTTP 429 from backend) |
| AC-5 | AI finishes a response | The SSE stream emits "done" event | A typing indicator disappears; auto-detected vocabulary items are highlighted in the AI response |
| AC-6 | I tap "End Conversation" | The conversation is completed | `POST /api/v1/conversations/{id}/complete` is called; I am navigated to the report screen (S004) |
| AC-7 | Speech recognition fails | The audio endpoint returns fallback flag | A toast message says "Voice unavailable, switched to text"; the text input is auto-focused |

**Business Rules**:
- Free tier: 3 conversations/day. Remaining count shown in the conversation screen header. _Source: CN001_
- Audio recording requires microphone permission; prompt on first use, explain purpose.
- SSE streaming via `EventSource` through the API client service. _Source: TS001, TS005_
- Audio recording: capture PCM/WAV, send as multipart to backend speech proxy. _Source: TS002_
- Speech failure -> automatic fallback to text input. Never block user. _Source: TS002, PS4_

**Error Scenarios**:
- SSE stream interrupted -> show reconnecting indicator; auto-retry 3 times with exponential backoff. _Source: T002.exceptions_
- AI response timeout (no tokens for 30s) -> show "AI is taking longer than expected" with retry option.
- Microphone permission denied -> disable voice button, show text-only mode with a settings link.
- Network loss mid-conversation -> queue unsent messages locally; show "Will send when online" indicator.

_Source: T002, T005, S003, F001, F004, F005, CN001, TS001, TS002, TS005_

---

### REQ-M003 View Conversation Report (P0)

**User Story**: As a consumer, I want to see a detailed performance report after completing a conversation so that I understand my strengths and areas for improvement.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | A conversation has been completed | I land on the report screen (S004) | I see overall score (circular progress), grammar error list, expression suggestions, and pronunciation summary |
| AC-2 | I tap a grammar error | The error detail expands | I see the original text, correction, and explanation |
| AC-3 | I tap "Practice Again" | A new conversation starts for the same scenario | The AI conversation screen (S003) opens with a fresh conversation |
| AC-4 | AI scoring fails | The report loads | I see basic statistics (message count, duration, word count) with a "Score unavailable" notice |
| AC-5 | I share my report | I tap the share button | A shareable image/card is generated for social sharing |

**Business Rules**:
- Report data fetched from `GET /api/v1/conversations/{id}/report`. _Source: T003_
- Report is cached locally for offline review (AsyncStorage). _Source: T003_

**Error Scenarios**:
- Report generation still in progress -> show loading skeleton; poll every 2 seconds up to 30 seconds.
- Network error -> show cached report if available. _Source: T003.exceptions_

_Source: T003, S004, F001, TS001_

---

### REQ-M004 Real-time Pronunciation Feedback (P0)

**User Story**: As a consumer, I want to see phoneme-level pronunciation feedback immediately after speaking during a conversation so that I can self-correct without breaking the conversation flow.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I send an audio message in conversation | The SSE stream emits a "pronunciation" event | A pronunciation score card appears below my message bubble showing accuracy, fluency, completeness, and optionally prosody |
| AC-2 | A phoneme scores below threshold | The score card renders | The problematic phoneme is highlighted in red with a tap-to-hear reference pronunciation |
| AC-3 | Azure Speech service is down | The pronunciation assessment is attempted | No pronunciation card is shown; conversation continues with text-only mode; a subtle toast notifies the user |

**Business Rules**:
- Pronunciation data is embedded in the SSE stream from `POST /api/v1/conversations/{id}/messages/audio`. _Source: TS002_
- Score display: color-coded (green >= 0.8, yellow >= 0.6, red < 0.6).
- Phoneme detail expandable on tap.

**Error Scenarios**:
- Partial pronunciation data -> render available scores, omit missing fields gracefully.

_Source: T005, S003 (embedded), F001, TS002_

---

### REQ-M005 Complete Spaced Repetition Review (P0)

**User Story**: As a consumer, I want to review vocabulary using spaced repetition cards on my mobile device so that I retain words long-term following the memory curve.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have review cards due today | I navigate to the Review tab | I see the review screen (S007) with a card stack showing due count |
| AC-2 | I view a review card | The card is presented | I see the word, definition, example sentence, and source conversation reference |
| AC-3 | I rate a card (Again/Hard/Good/Easy) | I tap a rating button | `POST /api/v1/reviews/{card_id}/rate` is called; the next card is shown; progress bar updates |
| AC-4 | I complete all due reviews | The last card is rated | A completion summary shows (reviewed count, retention rate) from `GET /api/v1/reviews/summary`; a confetti animation plays |
| AC-5 | No cards are due today | I navigate to the Review tab | An empty state shows "All caught up!" with next review date |

**Business Rules**:
- Cards fetched from `GET /api/v1/reviews/today`. _Source: T007, TS004_
- Rating values: 1=Again, 2=Hard, 3=Good, 4=Easy. _Source: TS004_
- Daily review reminder via push notification. _Source: T007.rules, TS006_
- Card swipe gesture: left=Again, right=Good (optional shortcut).

**Error Scenarios**:
- Network error during rating -> queue rating locally, sync when online.
- Card data stale -> show "Refreshing cards..." and re-fetch.

_Source: T007, S007, F001, F002, F009, TS004, TS006_

---

### REQ-M006 View Streaks and Achievements (P0)

**User Story**: As a consumer, I want to see my learning streak and earned achievement badges so that I stay motivated to practice daily.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have an active learning streak | I view the streaks screen (S012) | I see current streak days (large number), longest streak, and a calendar heatmap of recent activity |
| AC-2 | I have earned achievements | I scroll to achievements section | I see a grid of badge icons; earned badges are full-color, locked badges are grayed out |
| AC-3 | My streak was broken and I haven't restored this month | I tap "Restore Streak" | `POST /api/v1/streaks/restore` is called; streak is restored; a success animation plays |
| AC-4 | I already restored once this month | I tap "Restore Streak" | The button is disabled; a tooltip explains "1 restore per month (resets next month)" |
| AC-5 | I earn a new achievement | An achievement is awarded | A celebratory modal appears with the badge icon, name, and description |

**Business Rules**:
- Streak data from `GET /api/v1/streaks/me`. Achievement data from `GET /api/v1/achievements`. _Source: T013_
- Streak restoration: max 1 per calendar month. _Source: CN004_
- `can_restore` boolean from API controls button state.

**Error Scenarios**:
- Restore fails (STREAK_001) -> show error message with month reset date.
- Restore on non-broken streak (STREAK_002) -> show "Your streak is active!".

_Source: T013, S012, CN004_

---

### REQ-M007 View Personalized Recommendations (P0)

**User Story**: As a consumer, I want to see personalized scenario recommendations on my home screen so that I can discover relevant content quickly.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have learning history | I open the Home tab | A "Recommended for You" horizontal carousel shows scenario cards with recommendation reasons |
| AC-2 | I am a new user with no history | I open the Home tab | A "Popular Scenarios" carousel shows trending scenarios |
| AC-3 | I tap a recommended scenario | I navigate to S002 | The scenario detail screen opens |

**Business Rules**:
- Recommendations from `GET /api/v1/recommendations`. _Source: T020_
- Display up to 10 recommendations in a horizontal FlatList.
- Cache recommendations for 1 hour to reduce API calls.

**Error Scenarios**:
- Recommendations API slow/failed -> show skeleton cards, fall back to cached data.

_Source: T020, Home screen, F004, TS004_

---

### REQ-M008 Login (P0)

**User Story**: As a consumer, I want to log in to my account on my mobile device so that I can access my learning progress and continue practicing.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have a valid account | I enter correct email and password on S037 | `POST /api/v1/auth/login` succeeds; JWT tokens are stored securely (expo-secure-store); I am navigated to Home |
| AC-2 | I enter wrong credentials | I tap "Login" | An inline error message appears: "Invalid email or password" with a "Forgot password?" link |
| AC-3 | My account is banned | I attempt login | A modal shows the ban reason from the API response |
| AC-4 | My token expires during a session | I make an API request | The API client automatically refreshes via `POST /api/v1/auth/refresh`; the original request is retried transparently |
| AC-5 | I close and reopen the app | The app launches | If a valid refresh token exists, I am auto-logged in; otherwise I see the login screen |

**Business Rules**:
- Access token stored in memory (not persisted). Refresh token stored in `expo-secure-store`. _Source: T039_
- Token refresh handled by Axios interceptor. _Source: T039_
- Biometric login (FaceID/TouchID) can be added as DEFER enhancement.

**Error Scenarios**:
- Network error on login -> show "No internet connection" with retry.
- Both tokens expired -> navigate to login screen, clear stored credentials.

_Source: T039, S037, F004_

---

### REQ-M009 Manage Notification Center (P1)

**User Story**: As a consumer, I want to view, manage, and respond to notifications on my mobile device so that I stay informed about reviews, achievements, and system updates.

**Acceptance Criteria**:

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | I have unread notifications | I navigate to the notification center (S041) | I see a list of notifications sorted newest-first; unread count badge shown on the tab/icon |
| AC-2 | I tap a notification | The notification is opened | `PATCH /api/v1/notifications/{id}/read` is called; the notification is marked as read; if it has a deep-link, I navigate to the target screen |
| AC-3 | I receive a push notification while the app is in foreground | A push arrives | An in-app banner appears at the top; tapping it navigates to the relevant screen |
| AC-4 | I receive a push notification while the app is in background | I tap the notification in the system tray | The app opens and navigates to the target screen via deep-link |
| AC-5 | I update notification preferences | I toggle review reminders on/off | `PUT /api/v1/notifications/settings` is called; the preference is persisted |

**Business Rules**:
- Push notifications via `expo-notifications`. Token registered on login via `User.expo_push_token`. _Source: TS006_
- Deep-link schema: `realtalk://reviews/today`, `realtalk://conversations/{id}`, `realtalk://achievements`. _Source: T044_
- Notification types: review_reminder, system, achievement, escalation.

**Error Scenarios**:
- Push permission denied -> show in-app notifications only; settings screen shows "Enable in device settings" link.
- Deep-link target screen not found -> navigate to Home.

_Source: T044, S041, TS006_

---

## 2. Non-Functional Requirements

### NFR-M001 Offline Capability

The mobile app must cache the following data locally using AsyncStorage for offline access:
- Scenario list (last fetched page, up to 50 items)
- Last 5 conversation reports
- Today's review cards (for offline review rating, synced later)
- User profile and streak data
- Notification list (last 20 items)

Offline-queued actions (review ratings, read receipts) must sync automatically when connectivity is restored. A visual indicator (banner) must show when the app is in offline mode.

_Source: Mobile UX best practice, T007 (offline review)_

### NFR-M002 Device Permissions

The app must request the following permissions with clear purpose explanations:
- **Microphone**: Required for voice input in conversations (T002, T005). Requested on first voice interaction, not at launch.
- **Push Notifications**: Requested after first successful conversation completion, not at launch. _Source: TS006_
- **Camera** (DEFER): For avatar upload. Not needed in CORE scope.

Permission denials must never block core functionality. Voice features degrade to text-only. Push denial means in-app notifications only.

_Source: TS002, TS006, Apple/Google guidelines_

### NFR-M003 Secure Token Storage

JWT access tokens must be stored in memory only (volatile). Refresh tokens must be stored using `expo-secure-store` (Keychain on iOS, Keystore on Android). No tokens in AsyncStorage or plain storage. Token refresh is handled transparently by the Axios request interceptor.

_Source: T039, OWASP Mobile Security_

### NFR-M004 Battery and Performance

- Audio recording must stop immediately when the user releases the record button or navigates away.
- SSE connections must be closed when the conversation screen unmounts.
- Background fetch for review reminders should use Expo's background task API with minimal frequency (once every 4 hours).
- FlatList virtualization required for all long lists (scenarios, notifications, conversation messages).
- Image assets must use progressive loading with placeholders.

_Source: Mobile UX best practice_

### NFR-M005 Free Tier Limit Display

The remaining daily conversation count (3 - used) must be visible in the conversation screen header. When the limit is reached, a paywall modal must appear with upgrade options. The count resets at midnight UTC. The app must handle the HTTP 429 response gracefully.

_Source: CN001_

### NFR-M006 Deep Linking

The app must support the following deep-link routes for push notification navigation:
- `realtalk://home` -> Home tab
- `realtalk://reviews/today` -> Review tab (S007)
- `realtalk://conversations/{id}/report` -> Report screen (S004)
- `realtalk://achievements` -> Streaks and Achievements screen (S012)
- `realtalk://notifications` -> Notification center (S041)

Unrecognized deep-links fall back to Home.

_Source: T044, TS006_
