# Tasks -- mobile-app (sp-003)

> Sub-project: **mobile-app** | Stack: React Native + Expo + TypeScript
>
> Port: 8081 | Auth: JWT | Backend: `http://localhost:8000/api/v1`
>
> Total: 28 active tasks (B1-B5) + 17 deferred tasks

---

## B1 -- Foundation (Types, Navigation, Services, Permissions)

### TASK-B1-001: Initialize Expo project structure and dependencies

**Files**:
- `apps/mobile-app/package.json`
- `apps/mobile-app/app.json`
- `apps/mobile-app/tsconfig.json`
- `apps/mobile-app/babel.config.js`
- `apps/mobile-app/.env.example`
- `apps/mobile-app/src/app/App.tsx`

**Implementation**:
- Initialize Expo project with TypeScript template (`expo init --template expo-template-blank-typescript`)
- Install core dependencies: `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `axios`, `expo-secure-store`, `expo-av`, `expo-notifications`, `@react-native-async-storage/async-storage`, `@react-native-community/netinfo`, `event-source-polyfill`, `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler`, `react-native-reanimated`
- Configure `app.json` with app name "RealTalk English", scheme "realtalk", permissions (RECORD_AUDIO, NOTIFICATIONS)
- Configure `tsconfig.json` with path aliases (`@/` -> `src/`)
- Configure `babel.config.js` with `module-resolver` plugin for path aliases
- Create `.env.example` with `API_BASE_URL`, `EXPO_PROJECT_ID`
- Create minimal `App.tsx` with `NavigationContainer` and placeholder screens

_Requirements_: Foundation for all subsequent tasks
_Guardrails_: Pin major dependency versions. Use Expo SDK 52+. Ensure `expo-dev-client` is included for native module support.
_Risk_: Low

---

### TASK-B1-002: Define TypeScript types for backend DTOs

**Files**:
- `apps/mobile-app/src/types/api.ts`
- `apps/mobile-app/src/types/common.ts`
- `apps/mobile-app/src/types/navigation.ts`

**Implementation**:
- `api.ts`: Define all TypeScript interfaces mirroring backend response DTOs:
  - `TokenResponse` (access_token, refresh_token, expires_in, token_type)
  - `ApiResponse<T>` (code, message, data)
  - `PaginatedResponse<T>` (items, total, page, size)
  - `ScenarioListItem` (id, title, difficulty, tags, progress, cover_image_url, avg_score)
  - `ScenarioDetail` (id, title, description, difficulty, target_roles, dialogue_nodes, tags, status)
  - `ConversationMessage` (id, conversation_id, role, content, audio_url, sequence, created_at)
  - `ConversationReport` (overall_score, grammar_errors, expression_suggestions, pronunciation_summary, duration_seconds, message_count, word_count)
  - `PronunciationResult` (accuracy_score, fluency_score, completeness_score, prosody_score, phoneme_details)
  - `ReviewCardDTO` (id, vocabulary: {word, definition, example}, due, state)
  - `ReviewSummary` (total_due, reviewed, retention_rate, next_due_at)
  - `StreakDTO` (current_streak, longest_streak, last_active_date, can_restore)
  - `AchievementDTO` (id, code, name, description, icon_url, earned_at)
  - `RecommendationDTO` (scenario, reason, score)
  - `NotificationDTO` (id, type, title, body, is_read, data, created_at)
  - `SSEEvent` (event: 'token'|'pronunciation'|'vocabulary'|'done', data)
  - `ScenarioFilter` (difficulty, tag_id, page, size)
  - `GrammarError` (text, correction, explanation)
  - `ExpressionSuggestion` (original, suggested, reason)
  - `PhonemeDetail` (phoneme, score, is_correct)
  - `VocabularyWord` (word, definition)
- `common.ts`: Shared utility types (LoadingState, ErrorState, AsyncStatus)
- `navigation.ts`: Navigation param list types per design.md Section 3.2

_Requirements_: All screen tasks depend on types
_Guardrails_: Types must exactly match backend DTOs from api-backend design.md Section 4. Use strict TypeScript (`strict: true`).
_Risk_: Low

---

### TASK-B1-003: Create API client with Axios and JWT interceptors

**Files**:
- `apps/mobile-app/src/services/apiClient.ts`

**Implementation**:
- Create Axios instance with `baseURL` from env, 30s timeout, JSON content-type
- Request interceptor: attach `Authorization: Bearer <accessToken>` from in-memory variable
- Response interceptor: on 401, read refresh token from `expo-secure-store`, call `POST /auth/refresh`, update tokens, retry original request. On refresh failure, clear tokens and emit `auth:logout` event.
- Export `setAccessToken(token)` and `getAccessToken()` for auth flow
- Export `apiClient` instance
- Implement per design.md Section 5.1

_Requirements_: REQ-M008 (login, token management), NFR-M003 (secure storage)
_Guardrails_: Access token in memory only, never persisted. Refresh token in `expo-secure-store`. Retry queue must prevent multiple simultaneous refresh calls (use a promise lock).
_Risk_: Medium -- token refresh race condition; use mutex pattern

---

### TASK-B1-004: Create SSE client service

**Files**:
- `apps/mobile-app/src/services/sseClient.ts`

**Implementation**:
- Wrapper around `event-source-polyfill` (standard EventSource does not support custom headers in React Native)
- `createSSEConnection(url, token, callbacks)`: create EventSource with Authorization header; register listeners for `token`, `pronunciation`, `vocabulary`, `done` events; handle `onerror` with retry logic (3 retries, exponential backoff: 1s, 2s, 4s)
- Implement per design.md Section 5.2
- Export factory function; consumers responsible for calling `.close()` on cleanup

_Requirements_: REQ-M002 (conversation SSE streaming)
_Guardrails_: Must close EventSource on screen unmount to prevent memory leaks. Parse `e.data` with try/catch (malformed JSON -> skip event, log warning).
_Risk_: Medium -- EventSource polyfill behavior may differ from browser; test on both iOS and Android

---

### TASK-B1-005: Create audio recording service

**Files**:
- `apps/mobile-app/src/services/audioService.ts`

**Implementation**:
- Wrapper around `expo-av` Audio module
- Methods: `requestPermission()`, `startRecording()`, `stopRecording() -> audioUri`, `uploadAudio(conversationId, audioUri) -> void`
- Upload uses `multipart/form-data` via `apiClient`
- Audio mode configuration: `allowsRecordingIOS: true`, `playsInSilentModeIOS: true`
- Recording preset: `Audio.RecordingOptionsPresets.HIGH_QUALITY`
- Implement per design.md Section 8.1

_Requirements_: REQ-M002 (voice input), REQ-M004 (pronunciation feedback)
_Guardrails_: Always reset audio mode after recording stops (`allowsRecordingIOS: false`). Handle permission denial gracefully (return null, never throw). Clean up recording resources on error.
_Risk_: Low

---

### TASK-B1-006: Create push notification service

**Files**:
- `apps/mobile-app/src/services/pushService.ts`

**Implementation**:
- Wrapper around `expo-notifications`
- `registerForPushNotifications()`: check/request permission, get Expo push token, send to backend via `PUT /api/v1/notifications/settings`
- `setNotificationHandler()`: configure foreground behavior (show alert, play sound, set badge)
- `addNotificationReceivedListener()`: handle foreground notifications (in-app banner)
- `addNotificationResponseReceivedListener()`: handle tap on notification (extract deep-link data, navigate)
- `getInitialNotification()`: handle app launch from killed state via notification tap
- Implement per design.md Section 7.2

_Requirements_: REQ-M009 (notifications), NFR-M002 (permissions)
_Guardrails_: Request push permission after first conversation completion, not at app launch (better conversion). Handle token refresh on app resume. Platform.OS check for Android channel configuration.
_Risk_: Low

---

### TASK-B1-007: Create offline storage and queue service

**Files**:
- `apps/mobile-app/src/services/storageService.ts`
- `apps/mobile-app/src/services/offlineQueue.ts`

**Implementation**:
- `storageService.ts`: AsyncStorage helpers with TTL support
  - `setWithTTL(key, value, ttlMs)` -- store value with expiry timestamp
  - `getWithTTL(key)` -- return value if not expired, null otherwise
  - `remove(key)`, `clear()`
  - Key constants matching design.md Section 6.1 (e.g., `@scenarios_cache`, `@recommendations_cache`, `@report_{id}`, `@pending_actions`)
- `offlineQueue.ts`: Pending action queue per design.md Section 6.2
  - `enqueue(action: PendingAction)` -- add to queue in AsyncStorage
  - `drain()` -- execute all pending actions, remove successes, retry failures (max 3)
  - `getQueueSize()` -- return count of pending actions
  - NetInfo listener integration: call `drain()` on connectivity restore

_Requirements_: NFR-M001 (offline capability)
_Guardrails_: AsyncStorage has a 2MB limit per key on Android; keep cache sizes bounded. Queue drain must be idempotent (use action IDs). Log failed syncs for debugging.
_Risk_: Low

---

### TASK-B1-008: Create theme, constants, and utility modules

**Files**:
- `apps/mobile-app/src/theme/colors.ts`
- `apps/mobile-app/src/theme/typography.ts`
- `apps/mobile-app/src/theme/spacing.ts`
- `apps/mobile-app/src/theme/index.ts`
- `apps/mobile-app/src/utils/format.ts`
- `apps/mobile-app/src/utils/validators.ts`
- `apps/mobile-app/src/utils/constants.ts`

**Implementation**:
- `colors.ts`: Primary (brand blue), secondary, success (green for good scores), warning (yellow for medium scores), error (red for low scores), background, surface, text colors. Score color thresholds: green >= 0.8, yellow >= 0.6, red < 0.6.
- `typography.ts`: Font sizes (h1-h6, body, caption), font families (system default), line heights
- `spacing.ts`: Spacing scale (xs: 4, sm: 8, md: 16, lg: 24, xl: 32)
- `format.ts`: `formatDate()`, `formatDuration(seconds)`, `formatScore(score: number) -> string`, `formatStreak(days)`, `getScoreColor(score: number) -> string`
- `validators.ts`: `isValidEmail(email)`, `isValidPassword(password)` (min 8 chars)
- `constants.ts`: `SCORE_THRESHOLDS`, `MAX_DAILY_CONVERSATIONS`, `SSE_RETRY_COUNT`, `SSE_RETRY_DELAYS`, `CACHE_TTL` values, AsyncStorage key constants

_Requirements_: All screen tasks
_Guardrails_: Score color logic must match REQ-M004 thresholds. Constants file is the single source of truth for magic numbers.
_Risk_: Low

---

## B3 -- Screen Components (Navigation + All CORE Screens)

### TASK-B3-001: Implement navigation structure (Root, Auth, Main Tabs)

**Files**:
- `apps/mobile-app/src/navigation/RootNavigator.tsx`
- `apps/mobile-app/src/navigation/MainTabNavigator.tsx`
- `apps/mobile-app/src/navigation/HomeStack.tsx`
- `apps/mobile-app/src/navigation/LearnStack.tsx`
- `apps/mobile-app/src/navigation/ReviewStack.tsx`
- `apps/mobile-app/src/navigation/ProfileStack.tsx`
- `apps/mobile-app/src/navigation/linking.ts`
- `apps/mobile-app/src/app/App.tsx` (update)
- `apps/mobile-app/src/app/providers.tsx`

**Implementation**:
- `RootNavigator`: Conditional rendering -- if authenticated show `MainTabs`, else show `AuthStack`. Auth state from `useAuth` hook (checks for valid refresh token on mount).
- `MainTabNavigator`: Bottom tabs with 4 tabs: Home (house icon), Learn (book icon), Review (cards icon), Profile (user icon). Active tab highlight. Badge on Review tab showing due card count.
- Each tab stack: define screen options (header title, back button behavior, header right actions)
- `linking.ts`: Deep link configuration per design.md Section 3.3
- `providers.tsx`: Wrap app in `SafeAreaProvider`, `NavigationContainer` (with linking config), `AuthProvider`, `NetworkProvider`
- `App.tsx`: Render `<Providers><RootNavigator /></Providers>`

_Requirements_: All screen navigation, NFR-M006 (deep linking)
_Guardrails_: Use `@react-navigation/native-stack` (not JS stack) for native performance. Tab icons must be from a consistent icon library (e.g., `@expo/vector-icons`). Deep link testing required on both platforms.
_Risk_: Low

---

### TASK-B3-002: Implement LoginScreen (S037)

**Files**:
- `apps/mobile-app/src/features/auth/screens/LoginScreen.tsx`
- `apps/mobile-app/src/features/auth/hooks/useAuth.ts`
- `apps/mobile-app/src/features/auth/services/authService.ts`

**Implementation**:
- `LoginScreen`: KeyboardAvoidingView with logo, email TextInput (keyboardType: email-address, autoCapitalize: none), password TextInput (secureTextEntry with show/hide toggle), Login button (disabled during submit), inline error message
- `authService.ts`:
  - `login(email, password)` -> `POST /api/v1/auth/login` -> `TokenResponse`
  - `refresh(refreshToken)` -> `POST /api/v1/auth/refresh` -> `TokenResponse`
  - `logout()` -> `POST /api/v1/auth/logout`
- `useAuth.ts` (context hook):
  - `login(email, password)`: call authService.login(); store refresh token in SecureStore; set access token in memory via `setAccessToken()`; register push token; navigate to Main
  - `logout()`: clear tokens; navigate to Auth
  - `isAuthenticated: boolean`: derived from access token presence
  - `checkAuth()`: on app launch, check SecureStore for refresh token; if exists, attempt silent refresh
- Error handling: 401 -> "Invalid email or password"; 403 (AUTH_003) -> ban reason modal; network error -> "No internet connection"
- Implement component tree per design.md Section 4.8

_Requirements_: REQ-M008
_Guardrails_: Password field must not autocomplete or be saved by OS. Email validation before submit (instant feedback). Login button shows ActivityIndicator during submit.
_Risk_: Low

---

### TASK-B3-003: Implement HomeScreen with recommendation carousel

**Files**:
- `apps/mobile-app/src/features/home/screens/HomeScreen.tsx`
- `apps/mobile-app/src/features/home/components/RecommendationCarousel.tsx`
- `apps/mobile-app/src/features/home/components/QuickActions.tsx`
- `apps/mobile-app/src/features/home/components/DailyProgress.tsx`

**Implementation**:
- `HomeScreen`: ScrollView with RefreshControl (pull-to-refresh); render HomeHeader (user avatar, streak fire icon + count, notification bell with unread badge), RecommendationCarousel, QuickActions, DailyProgress
- `RecommendationCarousel`: horizontal FlatList with ScenarioCard items; each card shows title, difficulty badge, recommendation reason text, progress indicator. Max 10 items. On tap -> navigate to ScenarioDetail.
- `QuickActions`: 3 buttons -- "Continue Learning" (navigate to last active conversation), "Start New" (navigate to ScenarioList), "Review Due" (navigate to Review tab with due count badge)
- `DailyProgress`: Conversations today (count / 3 for free tier), review cards done, current streak days
- Data: recommendations from `GET /api/v1/recommendations`, streak from `GET /api/v1/streaks/me`, review summary from `GET /api/v1/reviews/summary`
- Loading state: skeleton placeholders for all sections
- Offline: use cached data from storageService; show offline banner

_Requirements_: REQ-M007, REQ-M006 (streak display), REQ-M005 (review count)
_Guardrails_: FlatList must use `keyExtractor`. Skeleton loading must match final layout to prevent layout shift. Cache recommendations for 1 hour.
_Risk_: Low

---

### TASK-B3-004: Implement ScenarioListScreen (S001) and ScenarioDetailScreen (S002)

**Files**:
- `apps/mobile-app/src/features/scenarios/screens/ScenarioListScreen.tsx`
- `apps/mobile-app/src/features/scenarios/screens/ScenarioDetailScreen.tsx`
- `apps/mobile-app/src/features/scenarios/components/ScenarioCard.tsx`
- `apps/mobile-app/src/features/scenarios/components/ScenarioListItem.tsx`
- `apps/mobile-app/src/features/scenarios/components/FilterBar.tsx`
- `apps/mobile-app/src/features/scenarios/components/DialoguePreview.tsx`
- `apps/mobile-app/src/features/scenarios/hooks/useScenarios.ts`
- `apps/mobile-app/src/features/scenarios/services/scenarioService.ts`

**Implementation**:
- `scenarioService.ts`:
  - `listScenarios(filters: ScenarioFilter)` -> `GET /api/v1/scenarios` -> `PaginatedResponse<ScenarioListItem>`
  - `getScenario(id: string)` -> `GET /api/v1/scenarios/{id}` -> `ScenarioDetail`
- `useScenarios.ts`: Custom hook managing scenario list state, pagination (infinite scroll), filter changes, loading/error states. Caches first page in storageService.
- `ScenarioListScreen`: SafeAreaView with FilterBar (difficulty chips: All/Beginner/Intermediate/Advanced, tag dropdown) and FlatList (virtualized, `onEndReached` for pagination, RefreshControl for pull-to-refresh). Each item rendered as ScenarioListItem.
- `ScenarioListItem`: Card layout with scenario title, difficulty badge (color-coded), tags (chips), progress indicator (not started / in progress / completed with score).
- `ScenarioDetailScreen`: ScrollView with ScenarioHeader (title, difficulty, cover image placeholder), ScenarioMeta (target roles, tags, estimated duration), DialoguePreview (first 3 dialogue nodes in chat bubble style, expandable), UserProgress (if previously attempted), "Start Practice" CTA button (full width, primary color).
  - On "Start Practice" tap: call `POST /api/v1/conversations` with `{scenario_id}`. On success, navigate to ConversationScreen with `{conversationId, scenarioId}`. On 429, show Paywall modal.
- `FilterBar`: Horizontally scrollable difficulty chips + optional tag filter
- `DialoguePreview`: Shows first 3 `dialogue_nodes` from scenario as preview chat bubbles

_Requirements_: REQ-M001, REQ-M002 (start conversation)
_Guardrails_: FlatList must use `getItemLayout` for consistent row heights. Empty state must be visually distinct (illustration + text). Filter changes must reset pagination to page 1.
_Risk_: Low

---

### TASK-B3-005: Implement ConversationScreen (S003) with SSE and audio

**Files**:
- `apps/mobile-app/src/features/conversation/screens/ConversationScreen.tsx`
- `apps/mobile-app/src/features/conversation/components/MessageBubble.tsx`
- `apps/mobile-app/src/features/conversation/components/PronunciationCard.tsx`
- `apps/mobile-app/src/features/conversation/components/ScoreBar.tsx`
- `apps/mobile-app/src/features/conversation/components/PhonemeDetail.tsx`
- `apps/mobile-app/src/features/conversation/components/TypingIndicator.tsx`
- `apps/mobile-app/src/features/conversation/components/InputBar.tsx`
- `apps/mobile-app/src/features/conversation/components/MicrophoneButton.tsx`
- `apps/mobile-app/src/features/conversation/hooks/useSSEStream.ts`
- `apps/mobile-app/src/features/conversation/hooks/useAudioRecorder.ts`
- `apps/mobile-app/src/features/conversation/hooks/useConversation.ts`
- `apps/mobile-app/src/features/conversation/services/conversationService.ts`

**Implementation**:
- `conversationService.ts`:
  - `getConversation(id)` -> `GET /api/v1/conversations/{id}`
  - `sendMessage(conversationId, content)` -> `POST /api/v1/conversations/{id}/messages` (triggers SSE)
  - `sendAudio(conversationId, audioUri)` -> `POST /api/v1/conversations/{id}/messages/audio` (multipart, triggers SSE)
  - `completeConversation(id)` -> `POST /api/v1/conversations/{id}/complete`
- `useSSEStream.ts`: Hook managing SSE connection lifecycle per design.md Section 9.1. Handles token events (append to streaming text), pronunciation events (set pronunciation state), vocabulary events (mark highlighted words), done events (finalize message). Auto-close on unmount.
- `useAudioRecorder.ts`: Hook wrapping audioService per design.md Section 8.2. Permission check, start/stop recording, upload trigger. Fallback flag on permission denial.
- `useConversation.ts`: Orchestrator hook combining SSE + audio + message state. Manages `messages[]` array, adds user messages optimistically, appends AI messages from stream, handles errors.
- `ConversationScreen`: SafeAreaView with ConversationHeader (scenario title, remaining conversations count for free tier, "End" button), inverted FlatList of MessageBubble components, InputBar at bottom.
- `MessageBubble`: Different styles for user (right-aligned, blue) and AI (left-aligned, gray). User audio messages show PronunciationCard below. AI messages show vocabulary highlights (tappable words).
- `PronunciationCard`: Collapsible card showing ScoreBar (4 horizontal bars for accuracy, fluency, completeness, prosody with color coding) and PhonemeDetail (expandable list of phonemes with individual scores).
- `ScoreBar`: Horizontal bar with label, score value, and color fill (green/yellow/red per thresholds).
- `PhonemeDetail`: FlatList of phoneme items; problematic phonemes highlighted in red.
- `TypingIndicator`: Animated dots shown during AI streaming.
- `InputBar`: TextInput (flex, auto-grow height), MicrophoneButton (press-and-hold), SendButton (disabled when empty or streaming).
- `MicrophoneButton`: Animated scale on press. While held: show recording waveform/timer. On release: stop and upload. Disabled + grayed when `isFallbackToText`.
- "End Conversation" button in header: confirmation alert -> call `completeConversation()` -> navigate to ConversationReportScreen.
- Free tier display: show "(X/3 remaining)" in header. Derived from conversations count today.

_Requirements_: REQ-M002, REQ-M004, NFR-M004 (battery), NFR-M005 (free tier display)
_Guardrails_: SSE EventSource must be closed on screen unmount (useEffect cleanup). Audio recording must stop on unmount or background. FlatList inverted for chat UX (newest at bottom). Never block UI thread with audio processing. Pronunciation fallback: if speech fails, show toast "Voice unavailable", enable text-only.
_Risk_: High -- integrates SSE + audio + real-time UI; most complex screen. Decompose into focused hooks.

---

### TASK-B3-006: Implement ConversationReportScreen (S004)

**Files**:
- `apps/mobile-app/src/features/conversation/screens/ConversationReportScreen.tsx`
- `apps/mobile-app/src/features/conversation/components/OverallScore.tsx`
- `apps/mobile-app/src/features/conversation/components/GrammarErrorList.tsx`
- `apps/mobile-app/src/features/conversation/components/ExpressionSuggestionList.tsx`

**Implementation**:
- Fetch report from `GET /api/v1/conversations/{id}/report`. Cache in AsyncStorage for offline access.
- `OverallScore`: Circular progress indicator (animated fill) with large score number in center. Color based on score thresholds.
- `GrammarErrorList`: Expandable list items. Each item shows original text (strikethrough) and correction. Tap to expand shows explanation.
- `ExpressionSuggestionList`: Similar expandable list. Original vs suggested expression with reason.
- `BasicStats`: Row of stat cards -- duration (formatted mm:ss), message count, word count.
- Action buttons: "Practice Again" (creates new conversation for same scenario), "Share" (generates shareable card), "Back to Home".
- Fallback: if `overall_score` is null, show "Score processing..." with a polling retry (every 2s, max 30s). If still unavailable after timeout, show basic stats with "AI scoring unavailable" notice.
- Loading: skeleton layout matching final structure.

_Requirements_: REQ-M003
_Guardrails_: Cache report locally (permanent TTL) so user can review offline. "Practice Again" must handle 429 (free tier limit). Share functionality can use `expo-sharing` or RN Share API.
_Risk_: Low

---

### TASK-B3-007: Implement ReviewScreen (S007)

**Files**:
- `apps/mobile-app/src/features/review/screens/ReviewScreen.tsx`
- `apps/mobile-app/src/features/review/components/ReviewCard.tsx`
- `apps/mobile-app/src/features/review/components/CardStack.tsx`
- `apps/mobile-app/src/features/review/components/RatingButtons.tsx`
- `apps/mobile-app/src/features/review/components/CompletionSummary.tsx`
- `apps/mobile-app/src/features/review/hooks/useReview.ts`
- `apps/mobile-app/src/features/review/services/reviewService.ts`

**Implementation**:
- `reviewService.ts`:
  - `getTodayCards()` -> `GET /api/v1/reviews/today` -> `ReviewCardDTO[]`
  - `rateCard(cardId, rating)` -> `POST /api/v1/reviews/{card_id}/rate` -> updated card
  - `getSummary()` -> `GET /api/v1/reviews/summary` -> `ReviewSummary`
- `useReview.ts`: Hook managing card queue, current card index, flip state, completion state. Supports offline rating queue (enqueue if no network, drain on restore).
- `ReviewScreen`: SafeAreaView with ReviewHeader (due count, progress bar showing reviewed/total), CardStack (animated card area), RatingButtons (4 buttons below card).
- `CardStack`: Animated card component. Tap to flip (front: word, back: definition + example + source). Optional: swipe gesture (left = Again, right = Good).
- `ReviewCard`: Two-sided card using `Animated.View` with rotation transform. Front shows word (large, centered). Back shows definition, example sentence, source conversation link.
- `RatingButtons`: 4 buttons in a row -- Again (red), Hard (orange), Good (green), Easy (blue). Each button shows label + next review interval estimate. Disabled during API call.
- `CompletionSummary`: Shown when `currentIndex >= cards.length`. Displays reviewed count, retention rate percentage, next review date. Confetti animation (Lottie or react-native-reanimated).
- Empty state: "All caught up!" with illustration and next review date.

_Requirements_: REQ-M005
_Guardrails_: Card flip animation must be smooth (use `useNativeDriver: true`). Rating API calls should be fire-and-forget with offline queue fallback. Progress bar must update immediately on rate (optimistic UI).
_Risk_: Medium -- animation performance on low-end devices; test with reanimated

---

### TASK-B3-008: Implement StreaksAchievementsScreen (S012)

**Files**:
- `apps/mobile-app/src/features/gamification/screens/StreaksAchievementsScreen.tsx`
- `apps/mobile-app/src/features/gamification/components/StreakCounter.tsx`
- `apps/mobile-app/src/features/gamification/components/CalendarHeatmap.tsx`
- `apps/mobile-app/src/features/gamification/components/AchievementGrid.tsx`
- `apps/mobile-app/src/features/gamification/components/AchievementBadge.tsx`
- `apps/mobile-app/src/features/gamification/components/RestoreStreakButton.tsx`
- `apps/mobile-app/src/features/gamification/hooks/useStreak.ts`
- `apps/mobile-app/src/features/gamification/hooks/useAchievements.ts`
- `apps/mobile-app/src/features/gamification/services/streakService.ts`
- `apps/mobile-app/src/features/gamification/services/achievementService.ts`

**Implementation**:
- `streakService.ts`:
  - `getStreak()` -> `GET /api/v1/streaks/me` -> `StreakDTO`
  - `restoreStreak()` -> `POST /api/v1/streaks/restore`
- `achievementService.ts`:
  - `listAchievements()` -> `GET /api/v1/achievements` -> `AchievementDTO[]`
- `StreaksAchievementsScreen`: ScrollView with StreakSection and AchievementSection.
- `StreakCounter`: Large animated number (current streak days) with fire emoji/icon. Animated count-up on mount.
- `CalendarHeatmap`: Last 30 days grid. Each day cell colored by activity (empty = gray, active = green intensity based on conversation count). Today highlighted.
- `RestoreStreakButton`: "Restore Streak" button. Disabled and shows tooltip ("1 restore per month") if `can_restore === false`. On tap: call restoreStreak(); on success: animate streak counter back up; on STREAK_001 error: show alert with month reset date; on STREAK_002: show "Your streak is active!".
- `AchievementGrid`: FlatList with numColumns=3. Each item is AchievementBadge.
- `AchievementBadge`: Icon image, name below. Earned: full color + earned_at date. Locked: grayscale + lock overlay.

_Requirements_: REQ-M006
_Guardrails_: CalendarHeatmap should compute from local streak data (no extra API call). Achievement icons should use cached images. Restore button must show loading state during API call.
_Risk_: Low

---

### TASK-B3-009: Implement NotificationCenterScreen (S041)

**Files**:
- `apps/mobile-app/src/features/notifications/screens/NotificationCenterScreen.tsx`
- `apps/mobile-app/src/features/notifications/components/NotificationItem.tsx`
- `apps/mobile-app/src/features/notifications/hooks/useNotifications.ts`
- `apps/mobile-app/src/features/notifications/services/notificationService.ts`

**Implementation**:
- `notificationService.ts`:
  - `listNotifications(page, size)` -> `GET /api/v1/notifications` -> `PaginatedResponse<NotificationDTO>`
  - `markRead(id)` -> `PATCH /api/v1/notifications/{id}/read`
  - `updateSettings(preferences)` -> `PUT /api/v1/notifications/settings`
- `useNotifications.ts`: Hook managing notification list, unread count, pagination, mark-read.
- `NotificationCenterScreen`: Modal presentation (slide from bottom). Header with title, close button, unread count badge. FlatList of NotificationItem with infinite scroll pagination.
- `NotificationItem`: Icon (varies by type: bell for system, flame for achievement, book for review_reminder), title, body (truncated to 2 lines), relative time ("2h ago"), read/unread visual indicator (bold title + blue dot for unread). On tap: call `markRead()`; if notification has `data.deep_link`, navigate using linking configuration; if no deep link, just mark as read.
- Empty state: "No notifications yet" with bell illustration.
- Pull-to-refresh for new notifications.

_Requirements_: REQ-M009
_Guardrails_: Mark-read should be optimistic (update UI immediately, API call in background). Deep-link navigation must handle unknown routes gracefully (fallback to Home). Notification list should cache last 20 items for offline viewing.
_Risk_: Low

---

### TASK-B3-010: Implement PaywallModal (CN001 free-tier limit)

**Files**:
- `apps/mobile-app/src/features/paywall/screens/PaywallModal.tsx`

**Implementation**:
- Modal screen triggered when user hits the free-tier conversation limit (HTTP 429 from `POST /api/v1/conversations`).
- Content: "You've reached your daily limit" message, benefits of upgrading (unlimited conversations, detailed reports, priority AI), pricing (placeholder, actual prices from RevenueCat in DEFER phase), "Upgrade Now" CTA (disabled with "Coming Soon" for now, as TS003/RevenueCat is DEFERRED), "Maybe Later" dismiss button.
- Accessible from: ScenarioDetailScreen (on 429), ConversationReportScreen ("Practice Again" on 429).
- Navigation param: `source` to track where the paywall was triggered from (for analytics).

_Requirements_: NFR-M005, CN001
_Guardrails_: Paywall must not block app usage -- "Maybe Later" always available. "Upgrade Now" is non-functional until TS003 (RevenueCat) is implemented in DEFER phase. Track paywall impression for future analytics.
_Risk_: Low

---

## B4 -- API Integration, Offline Sync, Push Notifications, Deep Linking

### TASK-B4-001: Integrate all screen services with real API client (switch from mock data)

**Files**:
- `apps/mobile-app/src/features/auth/services/authService.ts` (update)
- `apps/mobile-app/src/features/scenarios/services/scenarioService.ts` (update)
- `apps/mobile-app/src/features/conversation/services/conversationService.ts` (update)
- `apps/mobile-app/src/features/review/services/reviewService.ts` (update)
- `apps/mobile-app/src/features/gamification/services/streakService.ts` (update)
- `apps/mobile-app/src/features/gamification/services/achievementService.ts` (update)
- `apps/mobile-app/src/features/notifications/services/notificationService.ts` (update)

**Implementation**:
- Ensure all service files import and use `apiClient` from `services/apiClient.ts`
- Verify all endpoint paths match backend design.md Section 4:
  - Auth: `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
  - Scenarios: `GET /scenarios`, `GET /scenarios/{id}`
  - Conversations: `POST /conversations`, `GET /conversations/{id}`, `POST /conversations/{id}/messages`, `POST /conversations/{id}/messages/audio`, `POST /conversations/{id}/complete`, `GET /conversations/{id}/report`
  - Reviews: `GET /reviews/today`, `POST /reviews/{card_id}/rate`, `GET /reviews/summary`
  - Streaks: `GET /streaks/me`, `POST /streaks/restore`
  - Achievements: `GET /achievements`
  - Recommendations: `GET /recommendations`
  - Notifications: `GET /notifications`, `PATCH /notifications/{id}/read`, `PUT /notifications/settings`
- Add proper error handling for each service: parse `ApiResponse` envelope, extract error codes, map to user-friendly messages
- Add request/response logging in `__DEV__` mode

_Requirements_: All REQ-M* requirements
_Guardrails_: Every API call must handle network errors, timeout errors, and business errors (from error code registry). Response data must be validated against TypeScript types at runtime (optional: use zod or io-ts for runtime validation).
_Risk_: Medium -- API contract mismatches between frontend and backend; coordinate with backend team

---

### TASK-B4-002: Implement offline caching for all screens

**Files**:
- `apps/mobile-app/src/features/scenarios/hooks/useScenarios.ts` (update)
- `apps/mobile-app/src/features/home/screens/HomeScreen.tsx` (update)
- `apps/mobile-app/src/features/review/hooks/useReview.ts` (update)
- `apps/mobile-app/src/features/gamification/hooks/useStreak.ts` (update)
- `apps/mobile-app/src/features/notifications/hooks/useNotifications.ts` (update)
- `apps/mobile-app/src/features/conversation/screens/ConversationReportScreen.tsx` (update)

**Implementation**:
- Apply cache-then-network pattern to all data-fetching hooks:
  1. On mount: check storageService for cached data; if valid (within TTL), render immediately
  2. Fetch fresh data from API in background
  3. On success: update UI + update cache
  4. On failure: keep cached data, show offline banner
- Use TTL values from design.md Section 6.1:
  - Scenarios: 5 min
  - Recommendations: 1 hour
  - Reports: permanent
  - Review cards: until next day
  - Streak: 30 min
  - Achievements: 1 hour
  - Notifications: 15 min
- Add `isOffline` state to all screens; show a persistent yellow banner: "You're offline. Showing cached data."
- Implement NetworkProvider context using `@react-native-community/netinfo` to share connectivity state across app

_Requirements_: NFR-M001
_Guardrails_: Cache must not serve stale data for review cards (rating changes the card). Scenario list cache should only store first page (20 items). Reports are immutable -- permanent cache is safe.
_Risk_: Medium -- cache invalidation logic must be correct; stale data can confuse users

---

### TASK-B4-003: Implement offline action queue sync

**Files**:
- `apps/mobile-app/src/services/offlineQueue.ts` (update)
- `apps/mobile-app/src/features/review/hooks/useReview.ts` (update)
- `apps/mobile-app/src/features/notifications/hooks/useNotifications.ts` (update)
- `apps/mobile-app/src/app/providers.tsx` (update)

**Implementation**:
- Wire offlineQueue into review and notification hooks:
  - `useReview.rateCard()`: if offline, enqueue `{type: 'rate_card', endpoint: '/reviews/{id}/rate', method: 'POST', body: {rating}}`, update local card state optimistically
  - `useNotifications.markRead()`: if offline, enqueue `{type: 'mark_notification_read', endpoint: '/notifications/{id}/read', method: 'PATCH', body: {}}`
- Add NetInfo listener in `providers.tsx`:
  - On connectivity restored: call `offlineQueue.drain()`
  - Show toast "Syncing X pending actions..." during drain
  - Show toast "All caught up!" on successful drain
- Handle drain failures: increment retry count; after 3 retries, mark action as failed and notify user

_Requirements_: NFR-M001 (offline queue)
_Guardrails_: Queue drain order must be FIFO (earliest actions first). Duplicate actions must be deduplicated by ID. Rate card actions for the same card should keep only the latest rating.
_Risk_: Medium -- conflict resolution for offline ratings; optimistic UI must match server state after sync

---

### TASK-B4-004: Implement push notification handling and deep link navigation

**Files**:
- `apps/mobile-app/src/services/pushService.ts` (update)
- `apps/mobile-app/src/navigation/RootNavigator.tsx` (update)
- `apps/mobile-app/src/app/providers.tsx` (update)

**Implementation**:
- Register push token after first successful login (in useAuth.login flow):
  1. Call `registerForPushNotifications()` from pushService
  2. On permission granted: token sent to backend via `PUT /api/v1/notifications/settings`
  3. On permission denied: set flag `pushDenied = true`; skip future prompts
- Set up notification listeners in providers.tsx (app-level):
  - `Notifications.addNotificationReceivedListener`: foreground notification -> show custom in-app banner component (auto-dismiss after 4s, tap to navigate)
  - `Notifications.addNotificationResponseReceivedListener`: user tapped notification -> extract `data.deep_link` from notification payload -> navigate via linking
  - On app launch: check `Notifications.getLastNotificationResponseAsync()` for killed-state tap
- Deep link navigation: use `NavigationContainer` `linking` prop with config from `linking.ts`. Unrecognized links fall back to Home tab.
- Update unread notification badge on tab bar when notification received

_Requirements_: REQ-M009, NFR-M002, NFR-M006
_Guardrails_: Push token must be re-registered if it changes (Expo push tokens can change). In-app banner must not overlap with status bar or notch. Deep-link navigation must wait for auth check to complete before navigating.
_Risk_: Medium -- notification behavior differs significantly between iOS and Android; test both platforms

---

### TASK-B4-005: Implement error handling and loading states across all screens

**Files**:
- `apps/mobile-app/src/components/shared/ErrorState.tsx`
- `apps/mobile-app/src/components/shared/EmptyState.tsx`
- `apps/mobile-app/src/components/shared/LoadingSkeleton.tsx`
- `apps/mobile-app/src/components/shared/OfflineBanner.tsx`
- `apps/mobile-app/src/components/shared/InAppNotificationBanner.tsx`
- `apps/mobile-app/src/components/shared/Toast.tsx`
- All screen files (update to use shared components)

**Implementation**:
- `ErrorState`: Full-screen error view with illustration, error message, "Try Again" button. Variants: network error, server error, not found.
- `EmptyState`: Full-screen empty view with illustration and contextual message. Variants per screen (no scenarios, no reviews, no notifications, no achievements).
- `LoadingSkeleton`: Animated placeholder components matching each screen's layout. Variants: list item skeleton, card skeleton, stat skeleton.
- `OfflineBanner`: Persistent yellow banner at top of screen. Text: "You're offline. Showing cached data." Dismiss button.
- `InAppNotificationBanner`: Animated slide-down banner for foreground push notifications. Shows notification title + body. Auto-dismiss after 4s. Tap to navigate.
- `Toast`: Lightweight toast messages for transient feedback (speech fallback, sync complete, etc.)
- Update all screens to use these shared components consistently:
  - Loading -> LoadingSkeleton
  - Error -> ErrorState with retry callback
  - Empty -> EmptyState with contextual illustration
  - Offline -> OfflineBanner + cached data

_Requirements_: All REQ-M*, NFR-M001
_Guardrails_: Skeleton animations must be subtle (opacity pulse, not bouncing). Error retry must re-fetch from API. Toast messages must be accessible (announce to screen reader).
_Risk_: Low

---

## B5 -- End-to-End and Integration Tests

### TASK-B5-001: Set up test infrastructure (Detox or Maestro)

**Files**:
- `apps/mobile-app/e2e/setup.ts`
- `apps/mobile-app/e2e/utils/helpers.ts`
- `apps/mobile-app/e2e/utils/mockServer.ts`
- `apps/mobile-app/package.json` (update: test scripts)
- `apps/mobile-app/.detoxrc.js` OR `apps/mobile-app/.maestro/` config

**Implementation**:
- Choose test framework: Detox (recommended for React Native) or Maestro (simpler YAML-based)
- If Detox:
  - Configure `.detoxrc.js` with iOS simulator and Android emulator configs
  - Create `setup.ts` with `beforeAll` (launch app), `beforeEach` (reload app), `afterAll` (cleanup)
  - Create `helpers.ts` with common utilities: `login(email, password)`, `waitForElement(testID)`, `scrollToElement(testID)`, `typeText(testID, text)`, `tapElement(testID)`
- If Maestro:
  - Create `.maestro/` directory with flow YAML files
  - Create reusable sub-flows for login, navigation
- `mockServer.ts`: Start a local mock server (e.g., MSW or json-server) that mimics backend API responses for isolated testing. Pre-configure mock data for: scenarios, conversations, review cards, streaks, achievements, notifications.
- Add test scripts to `package.json`: `test:e2e:ios`, `test:e2e:android`

_Requirements_: All E2E tests depend on this
_Guardrails_: Mock server must return realistic data matching backend DTOs. Test data must cover edge cases (empty states, error responses). Do not use production API for tests.
_Risk_: Medium -- Detox setup can be complex; Maestro is simpler but less powerful

---

### TASK-B5-002: E2E test -- Auth flow (login, token refresh, logout)

**Files**:
- `apps/mobile-app/e2e/tests/auth.test.ts` (Detox) OR `apps/mobile-app/.maestro/auth-flow.yaml` (Maestro)

**Implementation**:
- **Test: Successful login**
  1. App launches -> LoginScreen visible
  2. Enter valid email + password
  3. Tap "Login" button
  4. Verify: HomeScreen is visible, user avatar/name displayed
- **Test: Invalid credentials**
  1. Enter invalid email + password
  2. Tap "Login"
  3. Verify: error message "Invalid email or password" visible
  4. Verify: still on LoginScreen
- **Test: Token refresh (simulated)**
  1. Login successfully
  2. Mock server returns 401 on next API call
  3. Verify: app automatically refreshes token and retries (no user-visible error)
- **Test: Logout**
  1. Login successfully
  2. Navigate to Profile tab
  3. Tap "Logout"
  4. Verify: LoginScreen visible, HomeScreen not accessible

_Requirements_: REQ-M008
_Guardrails_: Tests must be independent (each test starts from a clean state). Mock server must be reset between tests.
_Risk_: Low

---

### TASK-B5-003: E2E test -- Scenario browsing and conversation start

**Files**:
- `apps/mobile-app/e2e/tests/scenarios.test.ts` OR `apps/mobile-app/.maestro/scenario-flow.yaml`

**Implementation**:
- **Test: Browse scenarios**
  1. Login -> Home screen
  2. Navigate to ScenarioListScreen
  3. Verify: scenario list visible with at least 1 item
  4. Apply difficulty filter "Intermediate"
  5. Verify: filtered results shown
- **Test: View scenario detail**
  1. Tap on a scenario card
  2. Verify: ScenarioDetailScreen visible with title, difficulty, description, "Start Practice" button
- **Test: Start conversation**
  1. On ScenarioDetailScreen, tap "Start Practice"
  2. Verify: ConversationScreen visible with AI opening message
- **Test: Free tier limit**
  1. Mock server returns 429 on `POST /conversations`
  2. Tap "Start Practice"
  3. Verify: PaywallModal visible with upgrade prompt

_Requirements_: REQ-M001, REQ-M002, NFR-M005
_Guardrails_: Mock AI response as static text (no real AI calls). 429 test must verify paywall is dismissible.
_Risk_: Low

---

### TASK-B5-004: E2E test -- Conversation with text input and report

**Files**:
- `apps/mobile-app/e2e/tests/conversation.test.ts` OR `apps/mobile-app/.maestro/conversation-flow.yaml`

**Implementation**:
- **Test: Send text message and receive AI response**
  1. Start a conversation (from scenario detail)
  2. Type a message in the input bar
  3. Tap send button
  4. Verify: user message appears in chat (right-aligned)
  5. Verify: AI response appears (left-aligned) -- mock SSE returns static tokens
- **Test: End conversation and view report**
  1. In active conversation, tap "End" button in header
  2. Confirm in the alert dialog
  3. Verify: ConversationReportScreen visible with overall score, grammar errors section, expression suggestions section, basic stats
- **Test: Practice again from report**
  1. On report screen, tap "Practice Again"
  2. Verify: new ConversationScreen opens

_Requirements_: REQ-M002, REQ-M003
_Guardrails_: SSE mock must emit events in correct order (token... token... done). Report mock must include all expected fields.
_Risk_: Medium -- SSE mocking for E2E tests requires careful setup

---

### TASK-B5-005: E2E test -- Review flow (card rating, completion)

**Files**:
- `apps/mobile-app/e2e/tests/review.test.ts` OR `apps/mobile-app/.maestro/review-flow.yaml`

**Implementation**:
- **Test: View and rate review cards**
  1. Login -> navigate to Review tab
  2. Verify: ReviewScreen visible with card showing word
  3. Tap card to flip
  4. Verify: definition and example visible
  5. Tap "Good" rating button
  6. Verify: next card appears, progress bar advances
- **Test: Complete all reviews**
  1. Rate all due cards (mock 3 cards)
  2. Verify: CompletionSummary visible with reviewed count and retention rate
- **Test: Empty review state**
  1. Mock server returns empty card list
  2. Navigate to Review tab
  3. Verify: "All caught up!" empty state visible

_Requirements_: REQ-M005
_Guardrails_: Card flip animation must complete before allowing rating tap. Test both tap-to-flip and swipe gestures (if implemented).
_Risk_: Low

---

### TASK-B5-006: E2E test -- Streaks, achievements, and notifications

**Files**:
- `apps/mobile-app/e2e/tests/gamification.test.ts` OR `apps/mobile-app/.maestro/gamification-flow.yaml`
- `apps/mobile-app/e2e/tests/notifications.test.ts` OR `apps/mobile-app/.maestro/notification-flow.yaml`

**Implementation**:
- **Test: View streaks and achievements**
  1. Login -> navigate to Profile tab -> StreaksAchievementsScreen
  2. Verify: current streak number visible
  3. Verify: achievement grid visible with at least 1 earned badge (full color) and 1 locked badge (grayed out)
- **Test: Restore streak**
  1. Mock streak as broken (current_streak=0, can_restore=true)
  2. Tap "Restore Streak"
  3. Verify: streak counter updates, success animation
- **Test: Restore streak limit**
  1. Mock streak as broken with can_restore=false
  2. Verify: "Restore Streak" button is disabled
- **Test: View notifications**
  1. Navigate to NotificationCenterScreen
  2. Verify: notification list visible with items
  3. Tap a notification
  4. Verify: notification marked as read (visual change)
- **Test: Empty notifications**
  1. Mock empty notification list
  2. Verify: "No notifications yet" empty state

_Requirements_: REQ-M006, REQ-M009
_Guardrails_: Streak restore test must verify button state changes after API response. Notification read status must update optimistically.
_Risk_: Low

---

## DEFERRED Tasks

> These tasks are out of scope for the current iteration. Listed here for future planning.
> They share navigation stacks and service infrastructure already created in B1/B3.

| ID | Task Name | Reason | Dependencies |
|----|-----------|--------|--------------|
| T004 | [DEFERRED] 进行自由对话 -- FreeConversationScreen (S005) | Medium frequency; shares ConversationScreen pattern with T002. | conversationService, SSE, audio hooks |
| T006 | [DEFERRED] 查看发音详细报告 -- PronunciationReportScreen (S006) | Medium frequency; extends PronunciationCard. | PronunciationCard component, conversationService |
| T008 | [DEFERRED] 管理词汇本 -- VocabularyScreen (S008) | Medium frequency; needs new vocabulary CRUD service. | VocabularyItem types, new vocabularyService |
| T014 | [DEFERRED] 查看排行榜 -- LeaderboardScreen (S013) | Medium frequency; needs new leaderboard API. | New leaderboardService |
| T015 | [DEFERRED] 兑换积分商品 -- PointsShopScreen (S014) | Medium frequency; needs points system backend. | New pointsService |
| T017 | [DEFERRED] 查看个人学习档案 -- LearningProfileScreen (S016) | Medium frequency; aggregation display. | Existing API data |
| T018 | [DEFERRED] 查看学习统计报告 -- LearningStatsScreen (S017) | Medium frequency; charts/graphs needed. | New statsService, charting library |
| T021 | [DEFERRED] 使用紧急场景速学 -- EmergencyScenarioScreen (S019) | Medium frequency; R003-specific. | scenarioService (filtered) |
| T022 | [DEFERRED] 订阅付费方案 -- SubscriptionScreen (S020) | Revenue-critical; needs RevenueCat integration. | purchaseService (react-native-purchases), TS003 |
| T023 | [DEFERRED] 管理订阅 -- SubscriptionManageScreen (S021) | Low frequency; extends purchaseService. | purchaseService |
| T024 | [DEFERRED] 购买场景包 -- ScenarioPackPurchaseScreen (S022) | Low frequency; needs payment flow. | purchaseService, ScenarioPack types |
| T038 | [DEFERRED] 注册账户 -- RegisterScreen (S036) | Low frequency; basic login sufficient for MVP. | authService (extended) |
| T040 | [DEFERRED] 管理个人设置 -- SettingsScreen (S038) | Low frequency; profile update + preferences. | New settingsService |
| T041 | [DEFERRED] 重置密码 -- ResetPasswordScreen (S039) | Low frequency; email/SMS verification needed. | authService (extended) |
| T042 | [DEFERRED] 注销账户 | Low frequency; CN003 data retention. | authService (extended) |
| T043 | [DEFERRED] 完成新手引导 -- OnboardingScreen (S040) | Low frequency; onboarding wizard. | New onboardingService |
| T045 | [DEFERRED] 提交意见反馈 -- FeedbackScreen (S042) | Low frequency; form submission. | New feedbackService |
