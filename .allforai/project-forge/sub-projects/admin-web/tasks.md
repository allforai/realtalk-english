# Tasks -- admin-web (sp-002)

> Sub-project: **admin-web** | Stack: Next.js 14 App Router + Tailwind CSS + Zustand + TanStack Query
>
> Port: 3000 | Auth: JWT | Backend API base: `http://localhost:8000/api/v1`

---

## B0 -- Project Scaffolding

> Prerequisite: project-scaffold phase must be completed before B1. B0 is handled by the scaffolding tool and includes Next.js project init, Tailwind config, ESLint/Prettier, tsconfig, package.json, and Dockerfile.

---

## B1 -- Foundation (Types, API Client, Layout, Auth)

### Task 1.1: Define TypeScript types for all API contracts

| Field | Value |
|---|---|
| **Files** | `src/types/api.ts` |
| **Implementation** | 1. Define all interfaces from design.md Section 7: `TokenResponse`, `LoginRequest`, `PaginatedResponse<T>`, `ApiErrorResponse`, `ScenarioListItem`, `ScenarioDetail`, `ScenarioCreateReq`, `DialogueNode`, `ReviewRequest`, `QualityOverview`, `LowScoreItem`, `MetricsDashboard`, `MetricValue`, `AlertRequest`, `UserListItem`, `UserDetail`, `BanUserReq`. |
| | 2. Define enums/union types: `ScenarioStatus`, `Difficulty`, `SubscriptionTier`. |
| | 3. Define query parameter types: `ScenarioListQuery`, `LowScoreQuery`, `UserSearchQuery`, `DateRange`. |
| **Requirements** | REQ-001 through REQ-009 (all types used across features). |
| **Guardrails** | - No `any` types. All fields must have explicit types. |
| | - Export all types. No default exports. |
| **Risk** | Low. Types are additive and do not affect runtime. |

### Task 1.2: Implement API client with auth interceptors

| Field | Value |
|---|---|
| **Files** | `src/lib/api-client.ts`, `src/lib/api-errors.ts` |
| **Implementation** | 1. Create `ApiClient` class with `request<T>(path, options)` private method. |
| | 2. Attach `Authorization: Bearer <token>` from authStore on every request. |
| | 3. On 401: attempt token refresh via `POST /api/v1/auth/refresh`. If refresh fails, call `authStore.logout()` and `router.push('/admin/login')`. |
| | 4. On 403: redirect to `/admin/unauthorized`. |
| | 5. Map backend error codes to user-friendly messages via `ERROR_MESSAGES` in `api-errors.ts`. |
| | 6. Export singleton `apiClient` instance. |
| | 7. Implement all methods listed in design.md Section 5.1 (login, refresh, logout, scenarios CRUD, review queue, AI quality, metrics, users). |
| **Requirements** | XR-001, XR-002 (auth handling), PS5 (centralized error handling). |
| **Guardrails** | - Never expose raw `fetch` calls. All API calls go through `apiClient`. |
| | - Token refresh must be mutex-guarded (no parallel refresh requests). |
| | - All network errors wrapped in consistent error shape. |
| **Risk** | Medium. Token refresh race condition must be handled correctly. Use a promise-based mutex. |

### Task 1.3: Implement Zustand stores (auth + UI)

| Field | Value |
|---|---|
| **Files** | `src/stores/authStore.ts`, `src/stores/uiStore.ts` |
| **Implementation** | 1. **authStore**: `accessToken`, `refreshToken`, `user`, `isAuthenticated`, `login()`, `logout()`, `setTokens()`, `hasRole()`, `getDefaultPage()`. Persist to localStorage via `zustand/middleware`. |
| | 2. **uiStore**: `sidebarCollapsed`, `theme`, `toggleSidebar()`, `setTheme()`. Persist to localStorage. |
| | 3. `hasRole(role)` checks `user.roles.includes(role)`. |
| | 4. `getDefaultPage()` returns the role-appropriate default page using `ROLE_DEFAULT_PAGE` mapping. |
| **Requirements** | REQ-009 (auth state), design.md Section 4.1. |
| **Guardrails** | - No server state in Zustand stores (PS3). |
| | - Token must be cleared on logout (no stale tokens). |
| **Risk** | Low. Well-defined state shape. |

### Task 1.4: Create TanStack Query client and Providers wrapper

| Field | Value |
|---|---|
| **Files** | `src/lib/query-client.ts`, `src/components/layout/Providers.tsx` |
| **Implementation** | 1. Configure `QueryClient` with defaults: staleTime 2min, gcTime 10min, retry 2, refetchOnWindowFocus true. |
| | 2. `Providers.tsx`: wrap children with `<QueryClientProvider>`. Include `<Toaster>` for toast notifications. |
| | 3. Register Providers in `src/app/layout.tsx` (root layout). |
| **Requirements** | PS3 (TanStack Query for server state). |
| **Guardrails** | - Providers must be a client component (`'use client'`). |
| **Risk** | Low. Standard TanStack Query setup. |

### Task 1.5: Build layout components (AdminShell, Sidebar, Topbar)

| Field | Value |
|---|---|
| **Files** | `src/components/layout/AdminShell.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/Topbar.tsx`, `src/lib/navigation.ts`, `src/types/navigation.ts` |
| **Implementation** | 1. **AdminShell**: Flex container with Sidebar (fixed left) + Topbar (fixed top) + scrollable content area. |
| | 2. **Sidebar**: Render nav sections from `navigation.ts`, filtered by current user's roles. Collapsible to 64px icons-only. "Coming Soon" badge for deferred items. Active state highlighting. |
| | 3. **Topbar**: Breadcrumb (derived from URL), user avatar + display name, role badge, logout button. |
| | 4. **navigation.ts**: Define `NAV_SECTIONS` array with all nav items and role requirements (design.md Section 9). |
| | 5. Use `uiStore.sidebarCollapsed` for sidebar state. |
| **Requirements** | Design.md Section 3.1, Section 9. |
| **Guardrails** | - Sidebar must hide items the user has no role for (not just disable). |
| | - Min width 1024px; sidebar collapses at < 1280px. |
| **Risk** | Low. Presentational components with well-defined layout. |

### Task 1.6: Implement AuthGuard and route configuration

| Field | Value |
|---|---|
| **Files** | `src/components/layout/AuthGuard.tsx`, `src/lib/permissions.ts`, `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/app/admin/unauthorized/page.tsx` |
| **Implementation** | 1. **AuthGuard**: Client component. On mount, check `authStore.isAuthenticated`. If not authenticated, redirect to `/admin/login`. Check current route's required roles against `authStore.user.roles`; if no match, redirect to `/admin/unauthorized`. |
| | 2. **permissions.ts**: `ROUTE_ROLE_MAP` mapping route patterns to required roles. `checkRouteAccess(pathname, userRoles): boolean`. |
| | 3. **admin/layout.tsx**: Wrap children with `<AuthGuard>` + `<AdminShell>`. Login page is excluded (it has its own layout). |
| | 4. **admin/page.tsx**: Redirect to `authStore.getDefaultPage()`. |
| | 5. **admin/unauthorized/page.tsx**: 403 page with "You don't have permission" message and link to home. |
| **Requirements** | XR-001, XR-003 (route guards), REQ-009. |
| **Guardrails** | - AuthGuard must handle SSR/hydration: show nothing during SSR, check auth on client. |
| | - No flicker: show loading skeleton until auth state is resolved. |
| **Risk** | Medium. SSR/CSR hydration mismatch is a common Next.js pitfall. Use `useEffect` + loading state. |

### Task 1.7: Build shared UI components

| Field | Value |
|---|---|
| **Files** | `src/components/ui/DataTable.tsx`, `src/components/ui/DataTablePagination.tsx`, `src/components/ui/DataTableSearch.tsx`, `src/components/ui/FormField.tsx`, `src/components/ui/FormSelect.tsx`, `src/components/ui/FormTextarea.tsx`, `src/components/ui/ConfirmDialog.tsx`, `src/components/ui/DestructiveConfirmDialog.tsx`, `src/components/ui/Badge.tsx`, `src/components/ui/StatusBadge.tsx`, `src/components/ui/KpiCard.tsx`, `src/components/ui/EmptyState.tsx`, `src/components/ui/LoadingSkeleton.tsx`, `src/components/ui/ErrorBanner.tsx`, `src/components/ui/Toast.tsx`, `src/components/ui/PageHeader.tsx`, `src/components/ui/ComingSoonPage.tsx`, `src/lib/cn.ts` |
| **Implementation** | 1. **DataTable**: Generic `<DataTable<T>>` with columns config, data, sorting, loading state (skeleton rows), empty state. Uses `@tanstack/react-table` internally if desired, or custom implementation. |
| | 2. **DataTablePagination**: Prev/Next buttons, page indicator, page size selector (10/20/50). |
| | 3. **DataTableSearch**: Input with 300ms debounce. Calls `onSearch(value)` callback. |
| | 4. **FormField/FormSelect/FormTextarea**: Label + input + error message. Accept `register` props from react-hook-form or controlled value/onChange. |
| | 5. **ConfirmDialog**: Modal overlay with title, message, confirm (primary) + cancel buttons. |
| | 6. **DestructiveConfirmDialog**: Extends ConfirmDialog with red confirm button, reason textarea, and mandatory checkbox. Confirm button disabled until checkbox is checked. (For ban flow, REQ-008/CN008). |
| | 7. **Badge/StatusBadge**: Colored pills. StatusBadge maps scenario status to colors (draft=gray, review=yellow, published=green, rejected=red). |
| | 8. **KpiCard**: Card with metric label, current value, delta (green if positive, red if negative), sparkline area. |
| | 9. **EmptyState**: Centered illustration + heading + description + optional CTA button. |
| | 10. **LoadingSkeleton**: Animated shimmer blocks. Variants: text, card, table-row. |
| | 11. **ErrorBanner**: Yellow/red banner with error message + "Retry" button. |
| | 12. **Toast**: Toast notification system. Types: success (green), error (red), warning (yellow), info (blue). Auto-dismiss after 5s. |
| | 13. **PageHeader**: Title + optional description + right-aligned action buttons. |
| | 14. **ComingSoonPage**: Full-page placeholder with "Coming Soon" heading, description, and decorative illustration. |
| | 15. **cn.ts**: `cn(...inputs)` utility combining `clsx` + `tailwind-merge`. |
| **Requirements** | All CORE page requirements depend on these components. Design.md Section 3.2. |
| **Guardrails** | - All components must accept `className` prop for composition. |
| | - DataTable must handle 0 rows (empty state) and loading (skeleton) without conditional wrapper. |
| | - DestructiveConfirmDialog must enforce checkbox before enabling confirm button (CN008). |
| **Risk** | Medium. Large number of components but each is straightforward. Risk is in consistency. Build one, establish pattern, then replicate. |

---

## B3 -- Page Components (CORE Pages)

### Task 3.1: Build Login page

| Field | Value |
|---|---|
| **Files** | `src/app/admin/login/page.tsx`, `src/app/admin/login/layout.tsx`, `src/components/auth/LoginForm.tsx`, `src/components/auth/schema.ts` |
| **Implementation** | 1. Login page with its own layout (no sidebar/topbar). Centered card with logo, email input, password input, submit button. |
| | 2. Form validation with zod `loginSchema`. |
| | 3. On submit: call `apiClient.login()`. On success, decode JWT to extract user info and roles. Call `authStore.login()`. Redirect to `authStore.getDefaultPage()`. |
| | 4. On error: show inline error for AUTH_001. Show banner for AUTH_003 (banned). |
| | 5. If already authenticated (authStore), redirect to default page immediately. |
| **Requirements** | REQ-009. |
| **Guardrails** | - Password field: type="password", no autocomplete for admin. |
| | - Do not store raw password anywhere. |
| | - Disable submit button while request is in-flight. |
| **Risk** | Low. Standard login form. |

### Task 3.2: Build Scenario List page

| Field | Value |
|---|---|
| **Files** | `src/app/admin/scenarios/page.tsx`, `src/hooks/scenarios/useScenarios.ts` |
| **Implementation** | 1. Page shows DataTable of scenarios created by the current user (author_id = me) + all scenarios (tab switch). |
| | 2. Columns: title, difficulty (badge), status (StatusBadge), tags, created_at, actions (edit/view). |
| | 3. "New Scenario" button in PageHeader links to `/admin/scenarios/new`. |
| | 4. Filter by status (all/draft/review/published/rejected). |
| | 5. TanStack Query hook `useScenarios(filters)` calls `apiClient.getScenarios()`. |
| | 6. Handle loading (skeleton), empty ("No scenarios yet. Create your first one!"), error states. |
| **Requirements** | REQ-001 (scenario CRUD context). |
| **Guardrails** | - Only show edit action for draft/rejected scenarios (not published/review). |
| **Risk** | Low. Standard CRUD list page. |

### Task 3.3: Build Scenario Editor page (create + edit)

| Field | Value |
|---|---|
| **Files** | `src/app/admin/scenarios/new/page.tsx`, `src/app/admin/scenarios/[id]/page.tsx`, `src/components/scenarios/ScenarioForm.tsx`, `src/components/scenarios/DialogueNodeEditor.tsx`, `src/components/scenarios/DialogueNodeItem.tsx`, `src/components/scenarios/ScenarioPreview.tsx`, `src/components/scenarios/schema.ts` |
| **Implementation** | 1. **ScenarioForm**: Form with fields: title (text), description (textarea), difficulty (select: beginner/intermediate/advanced), target_roles (multi-select checkboxes), tag_ids (multi-select, optional). Validated with `scenarioSchema`. |
| | 2. **DialogueNodeEditor**: Sortable list of DialogueNodeItem components. Add/remove node buttons. Drag-and-drop reorder via `@dnd-kit/sortable`. Min 3 nodes enforced (validation error below list). |
| | 3. **DialogueNodeItem**: Row with sequence number, role toggle (user/ai), content textarea, optional hints textarea, delete button. |
| | 4. **ScenarioPreview**: Toggle button opens a side panel or modal showing dialogue as chat bubbles (user = right, ai = left). Read-only. |
| | 5. **Create mode** (`/admin/scenarios/new`): Empty form. On save, call `apiClient.createScenario()`. Redirect to edit page on success. |
| | 6. **Edit mode** (`/admin/scenarios/[id]`): Load scenario via `apiClient.getScenario(id)`. Pre-fill form. On save, call `apiClient.updateScenario()`. |
| | 7. "Submit for Review" button visible only when status is `draft` or `rejected`. Calls `apiClient.submitForReview(id)` with confirmation dialog. |
| | 8. Auto-save draft every 30 seconds (debounced PUT). |
| **Requirements** | REQ-001 (create), REQ-002 (submit for review), CN006 (approval workflow). |
| **Guardrails** | - Validate on save AND on submit-for-review (submit-for-review = save + transition). |
| | - [CN006] "Submit for Review" is the only path to publication. No "Publish" shortcut. |
| | - If scenario is in `review` or `published` status, form is read-only. |
| | - Dialogue nodes must have at least 3 entries (SCEN_002). |
| **Risk** | High. Dialogue node editor with drag-and-drop is the most complex UI in this sub-project. Focus on stable DnD first, then polish. |

### Task 3.4: Build Review Queue page

| Field | Value |
|---|---|
| **Files** | `src/app/admin/scenarios/review/page.tsx`, `src/app/admin/scenarios/review/[id]/page.tsx`, `src/components/scenarios/ReviewQueueTable.tsx`, `src/components/scenarios/ReviewActionPanel.tsx`, `src/components/scenarios/review-schema.ts`, `src/hooks/scenarios/useReviewQueue.ts` |
| **Implementation** | 1. **Review Queue** (`/admin/scenarios/review`): DataTable showing scenarios with status=review. Columns: title, author, difficulty, submitted_at, node count. Sorted by submitted_at ASC. Pagination 20/page. |
| | 2. TanStack Query hook `useReviewQueue(page)` calls `apiClient.getReviewQueue()`. |
| | 3. Click row -> navigate to `/admin/scenarios/review/[id]`. |
| | 4. **Review Detail** (`/admin/scenarios/review/[id]`): Load scenario detail. Show read-only ScenarioPreview (chat bubbles). Show metadata: title, description, difficulty, tags, author, submitted_at. |
| | 5. **ReviewActionPanel**: Two buttons: "Approve" (green) and "Reject" (red). |
| |    - Approve: confirmation dialog -> `apiClient.reviewScenario(id, { action: 'approve' })`. |
| |    - Reject: dialog with reason textarea (min 10 chars, validated with `reviewRejectSchema`). -> `apiClient.reviewScenario(id, { action: 'reject', reason })`. |
| | 6. After action: invalidate review-queue query, show toast, redirect to queue. |
| **Requirements** | REQ-003, CN006. |
| **Guardrails** | - Reviewer cannot approve their own scenarios (backend enforces, but UI should hide review link for own scenarios). |
| | - Rejection reason is mandatory and min 10 chars (SCEN_005). |
| | - Handle race condition: if scenario was already reviewed, show toast "Already reviewed" and redirect. |
| **Risk** | Medium. Main risk is the rejection reason validation and race condition handling. |

### Task 3.5: Build AI Quality Scores page

| Field | Value |
|---|---|
| **Files** | `src/app/admin/ai-quality/page.tsx`, `src/components/ai-quality/QualityOverviewCards.tsx`, `src/components/ai-quality/QualityTrendChart.tsx`, `src/components/ai-quality/LowScoreTable.tsx`, `src/components/ai-quality/ConversationDetail.tsx`, `src/hooks/ai-quality/useAiQuality.ts` |
| **Implementation** | 1. **Page layout**: Date range selector (from/to) at top. Below: overview cards row, then trend chart, then low-score table. |
| | 2. **QualityOverviewCards**: Average score displayed as a gauge/radial chart. Score distribution as a small histogram (5 bars for 1-5 range). |
| | 3. **QualityTrendChart**: Line chart (recharts) showing daily avg_score for last 30 days. X-axis: dates. Y-axis: 0-5 score. |
| | 4. **LowScoreTable**: DataTable of conversations with score < threshold. Columns: conversation ID, user name, scenario title, score, date. Sortable by score/date. Pagination 20/page. |
| | 5. Click a low-score row -> expand inline or open modal with **ConversationDetail**: full message history displayed as chat bubbles (user messages right, AI messages left). Read-only. |
| | 6. TanStack Query hooks: `useAiQualityOverview(dateRange)`, `useAiQualityLowScore(filters)`. |
| **Requirements** | REQ-004. |
| **Guardrails** | - Charts must handle empty data gracefully (show "No data" instead of broken chart). |
| | - Date range default: last 30 days. |
| **Risk** | Medium. Recharts integration and responsive chart sizing need attention. |

### Task 3.6: Build Metrics Dashboard page

| Field | Value |
|---|---|
| **Files** | `src/app/admin/dashboard/page.tsx`, `src/components/dashboard/MetricsDashboard.tsx`, `src/components/dashboard/DauChart.tsx`, `src/components/dashboard/RetentionChart.tsx`, `src/components/dashboard/RevenueChart.tsx`, `src/components/dashboard/AlertDialog.tsx`, `src/components/dashboard/schema.ts`, `src/hooks/dashboard/useMetrics.ts` |
| **Implementation** | 1. **Page layout**: Date range selector (7d/30d/90d/custom) at top. Row of 4 KpiCards (DAU, MAU, 7d retention, revenue). Below: 2-column grid of charts. |
| | 2. **KpiCard**: For each metric, show current value, delta_percent (green arrow up or red arrow down), and sparkline. Each card has a small "bell" icon to set alert. |
| | 3. **DauChart**: Line chart, daily DAU over selected period. |
| | 4. **RetentionChart**: Cohort retention heatmap or multi-line chart. |
| | 5. **RevenueChart**: Line chart, daily revenue over selected period. |
| | 6. **AlertDialog**: Opened from KpiCard bell icon. Form: metric (pre-filled), operator select, threshold input, channel (email). Validated with `alertSchema`. On submit: `apiClient.createAlert()`. |
| | 7. TanStack Query hook: `useMetricsDashboard(dateRange)`. Auto-refetch every 5 minutes. |
| **Requirements** | REQ-005 (dashboard), REQ-006 (alerts). |
| **Guardrails** | - Dashboard must load within 3 seconds (use skeleton + parallel data fetch). |
| | - Charts must degrade gracefully if partial data is missing (show available, dim rest). |
| | - Auto-refresh interval: 5 min (via TanStack Query `refetchInterval`). |
| **Risk** | Medium. Multiple chart types on one page. Keep chart components isolated for bundle splitting. |

### Task 3.7: Build User Management page

| Field | Value |
|---|---|
| **Files** | `src/app/admin/users/page.tsx`, `src/app/admin/users/[id]/page.tsx`, `src/components/users/UserSearchTable.tsx`, `src/components/users/UserDetailPanel.tsx`, `src/components/users/UserLearningStats.tsx`, `src/components/users/BanUserDialog.tsx`, `src/components/users/UnbanUserDialog.tsx`, `src/components/users/schema.ts`, `src/hooks/users/useUsers.ts` |
| **Implementation** | 1. **User List** (`/admin/users`): PageHeader "User Management". Search bar (debounced 300ms) searching email/name/phone. Filter chips: subscription tier (all/free/premium/pro), ban status (all/active/banned). DataTable with columns: avatar, display_name, email, subscription_tier (badge), is_banned (badge), created_at. Click row -> navigate to `/admin/users/[id]`. |
| | 2. **User Detail** (`/admin/users/[id]`): Full profile card: avatar, name, email, phone, native_language, english_level, learning_goal, subscription info, created_at. |
| | 3. **UserLearningStats**: Card showing total_conversations, avg_score, current_streak, total_vocabulary. |
| | 4. **Ban/Unban buttons**: Show "Ban User" (red) if user is active. Show "Unban User" (green) if banned. |
| | 5. **BanUserDialog**: DestructiveConfirmDialog with warning text, reason textarea (required, min 5 chars), confirm checkbox. On confirm: `apiClient.banUser(id, { reason, confirm: true })`. On success: invalidate user query, toast "User has been banned". |
| | 6. **UnbanUserDialog**: Simple ConfirmDialog. On confirm: `apiClient.unbanUser(id)`. On success: invalidate user query, toast "User has been unbanned". |
| | 7. TanStack Query hooks: `useUserSearch(params)`, `useUserDetail(id)`, `useBanUser()`, `useUnbanUser()`. |
| **Requirements** | REQ-007 (search/view), REQ-008 (ban/unban), CN008 (double confirm + audit). |
| **Guardrails** | - [CN008] Ban button disabled until confirmation checkbox is checked AND reason is provided. |
| | - Already-banned user: ban button is hidden/disabled with tooltip "User is already banned". |
| | - All ban/unban actions create audit log entries (server-side; frontend just needs correct request). |
| **Risk** | Medium. BanUserDialog's multi-step validation (checkbox + reason + confirm) is the main complexity. |

### Task 3.8: Create deferred page shells

| Field | Value |
|---|---|
| **Files** | `src/app/admin/scenario-packs/page.tsx`, `src/app/admin/scenario-tags/page.tsx`, `src/app/admin/behavior/page.tsx`, `src/app/admin/ab-tests/page.tsx`, `src/app/admin/reports/page.tsx`, `src/app/admin/anomalies/page.tsx`, `src/app/admin/prompts/page.tsx`, `src/app/admin/pronunciation/page.tsx`, `src/app/admin/subscriptions/page.tsx`, `src/app/admin/settings/page.tsx`, `src/app/admin/roles/page.tsx`, `src/app/admin/complaints/page.tsx`, `src/app/admin/feedback/page.tsx` |
| **Implementation** | 1. Each file is a simple page component rendering `<ComingSoonPage title="Feature Name" description="This feature is coming soon." />`. |
| | 2. Each page uses the admin layout (sidebar + topbar visible). |
| | 3. AuthGuard still applies with correct role checks per route. |
| **Requirements** | Deferred tasks from requirements.md Section 3. |
| **Guardrails** | - Must still enforce role-based access (R004 for content pages, R005 for AI pages, etc.). |
| **Risk** | Low. Trivial placeholder pages. |

---

## B4 -- API Integration & State Management

### Task 4.1: Implement TanStack Query hooks for Scenarios

| Field | Value |
|---|---|
| **Files** | `src/hooks/scenarios/useScenarios.ts`, `src/hooks/scenarios/useReviewQueue.ts` |
| **Implementation** | 1. `useScenarios(filters)`: `useQuery` calling `apiClient.getScenarios()`. Key: `['scenarios', filters]`. StaleTime: 5 min. |
| | 2. `useScenario(id)`: `useQuery` calling `apiClient.getScenario(id)`. Key: `['scenario', id]`. StaleTime: 1 min. |
| | 3. `useCreateScenario()`: `useMutation` calling `apiClient.createScenario()`. OnSuccess: invalidate `['scenarios']`. |
| | 4. `useUpdateScenario()`: `useMutation` calling `apiClient.updateScenario()`. OnSuccess: invalidate `['scenario', id]`. |
| | 5. `useSubmitForReview()`: `useMutation` calling `apiClient.submitForReview()`. OnSuccess: invalidate `['scenario', id]`, `['review-queue']`. |
| | 6. `useReviewQueue(page, size)`: `useQuery` calling `apiClient.getReviewQueue()`. Key: `['review-queue', page]`. StaleTime: 30 sec. |
| | 7. `useReviewScenario()`: `useMutation` calling `apiClient.reviewScenario()`. OnSuccess: invalidate `['scenario', id]`, `['review-queue']`. Show toast. |
| **Requirements** | REQ-001, REQ-002, REQ-003. |
| **Guardrails** | - All mutations show toast on success/error. |
| | - Error handling: map API error codes to user-friendly messages. |
| **Risk** | Low. Standard TanStack Query patterns. |

### Task 4.2: Implement TanStack Query hooks for AI Quality

| Field | Value |
|---|---|
| **Files** | `src/hooks/ai-quality/useAiQuality.ts` |
| **Implementation** | 1. `useAiQualityOverview(dateRange)`: `useQuery` calling `apiClient.getAiQualityOverview()`. Key: `['ai-quality-overview', dateRange]`. StaleTime: 2 min. |
| | 2. `useAiQualityLowScore(params)`: `useQuery` calling `apiClient.getAiQualityLowScore()`. Key: `['ai-quality-low-score', params]`. StaleTime: 2 min. |
| **Requirements** | REQ-004. |
| **Guardrails** | - Handle empty response gracefully (return empty arrays, not undefined). |
| **Risk** | Low. |

### Task 4.3: Implement TanStack Query hooks for Metrics Dashboard

| Field | Value |
|---|---|
| **Files** | `src/hooks/dashboard/useMetrics.ts` |
| **Implementation** | 1. `useMetricsDashboard(dateRange)`: `useQuery` calling `apiClient.getMetricsDashboard()`. Key: `['metrics-dashboard', dateRange]`. StaleTime: 5 min. `refetchInterval`: 5 min. |
| | 2. `useCreateAlert()`: `useMutation` calling `apiClient.createAlert()`. OnSuccess: toast "Alert saved", invalidate `['metrics-dashboard']`. |
| **Requirements** | REQ-005, REQ-006. |
| **Guardrails** | - Auto-refetch interval must be configurable (env var or constant). |
| **Risk** | Low. |

### Task 4.4: Implement TanStack Query hooks for User Management

| Field | Value |
|---|---|
| **Files** | `src/hooks/users/useUsers.ts` |
| **Implementation** | 1. `useUserSearch(params)`: `useQuery` calling `apiClient.searchUsers()`. Key: `['users', search, filters, page]`. StaleTime: 1 min. |
| | 2. `useUserDetail(id)`: `useQuery` calling `apiClient.getUserDetail()`. Key: `['user', id]`. StaleTime: 1 min. |
| | 3. `useBanUser()`: `useMutation` calling `apiClient.banUser()`. OnSuccess: invalidate `['user', id]`, `['users']`. Toast "User has been banned". |
| | 4. `useUnbanUser()`: `useMutation` calling `apiClient.unbanUser()`. OnSuccess: invalidate `['user', id]`, `['users']`. Toast "User has been unbanned". |
| **Requirements** | REQ-007, REQ-008. |
| **Guardrails** | - Ban mutation must send `confirm: true` explicitly. |
| | - Handle USER_001 (missing confirm) and USER_002 (not found) errors. |
| **Risk** | Low. |

### Task 4.5: Implement useAuth and usePermission hooks

| Field | Value |
|---|---|
| **Files** | `src/hooks/useAuth.ts`, `src/hooks/usePermission.ts` |
| **Implementation** | 1. **useAuth**: Convenience hook wrapping `authStore` selectors. Returns `{ user, isAuthenticated, login, logout, hasRole }`. Adds `useEffect` for token expiry check on mount. |
| | 2. **usePermission**: Takes `requiredRoles: string[]`, returns `{ hasAccess: boolean, isLoading: boolean }`. Used by page components for conditional rendering. |
| **Requirements** | XR-001 through XR-004. |
| **Guardrails** | - Must handle initial hydration state (isLoading = true until authStore is initialized from localStorage). |
| **Risk** | Low. |

### Task 4.6: Wire up all pages to real API hooks (replace any hardcoded data)

| Field | Value |
|---|---|
| **Files** | All page files in `src/app/admin/` and feature component files |
| **Implementation** | 1. Replace any mock/placeholder data in page components with TanStack Query hooks from Tasks 4.1-4.4. |
| | 2. Ensure all loading, error, and empty states use the shared UI components (LoadingSkeleton, ErrorBanner, EmptyState). |
| | 3. Ensure all mutations show toast feedback via `onSuccess`/`onError`. |
| | 4. Ensure all queries pass correct parameters (page, size, filters, date ranges). |
| | 5. Verify route guard integration: AuthGuard checks happen before data fetching. |
| **Requirements** | All CORE requirements (REQ-001 through REQ-009). |
| **Guardrails** | - No hardcoded data should remain in page components. |
| | - Every API call must go through `apiClient` (never raw `fetch`). |
| **Risk** | Medium. Integration phase; bugs from mismatched types or incorrect query keys are common. |

---

## B5 -- Testing

### Task 5.1: Component unit tests (Jest + RTL)

| Field | Value |
|---|---|
| **Files** | `src/__tests__/components/ui/DataTable.test.tsx`, `src/__tests__/components/ui/ConfirmDialog.test.tsx`, `src/__tests__/components/ui/DestructiveConfirmDialog.test.tsx`, `src/__tests__/components/scenarios/ScenarioForm.test.tsx`, `src/__tests__/components/scenarios/DialogueNodeEditor.test.tsx`, `src/__tests__/components/scenarios/ReviewActionPanel.test.tsx`, `src/__tests__/components/users/BanUserDialog.test.tsx`, `src/__tests__/components/auth/LoginForm.test.tsx` |
| **Implementation** | 1. **DataTable**: renders columns, handles empty state, shows skeleton on loading, triggers sort callback. |
| | 2. **ConfirmDialog**: opens/closes, calls onConfirm/onCancel callbacks. |
| | 3. **DestructiveConfirmDialog**: confirm button disabled by default, enabled only after checkbox is checked AND reason is entered (CN008). |
| | 4. **ScenarioForm**: validates title required (SCEN_003), difficulty required (SCEN_004), min 3 nodes (SCEN_002). |
| | 5. **DialogueNodeEditor**: add node, remove node, reorder nodes. |
| | 6. **ReviewActionPanel**: approve triggers mutation, reject requires reason min 10 chars (SCEN_005). |
| | 7. **BanUserDialog**: confirm disabled until checkbox + reason filled. Sends `confirm: true` in payload. |
| | 8. **LoginForm**: validates email format, password required. Shows error for invalid credentials. |
| **Requirements** | All CORE requirements (validation rules). |
| **Guardrails** | - Use `@testing-library/user-event` for user interactions (not `fireEvent`). |
| | - Mock `apiClient` calls; do not hit real API. |
| | - Test accessibility: check for ARIA labels, focus management in dialogs. |
| **Risk** | Low. Standard RTL patterns. |

### Task 5.2: Store unit tests

| Field | Value |
|---|---|
| **Files** | `src/__tests__/stores/authStore.test.ts`, `src/__tests__/stores/uiStore.test.ts` |
| **Implementation** | 1. **authStore**: login sets tokens + user, logout clears state, hasRole checks correctly, getDefaultPage returns correct page per role. |
| | 2. **uiStore**: toggleSidebar flips state, setTheme updates theme. |
| | 3. Test localStorage persistence: after login, reload store from localStorage, verify state preserved. |
| **Requirements** | Design.md Section 4.1. |
| **Guardrails** | - Clear localStorage between tests to prevent leaks. |
| **Risk** | Low. |

### Task 5.3: API client unit tests

| Field | Value |
|---|---|
| **Files** | `src/__tests__/lib/api-client.test.ts` |
| **Implementation** | 1. Test successful request adds Authorization header. |
| | 2. Test 401 response triggers token refresh. |
| | 3. Test 401 + failed refresh triggers logout + redirect. |
| | 4. Test 403 response redirects to unauthorized page. |
| | 5. Test network error throws consistent error shape. |
| | 6. Test error code mapping returns user-friendly messages. |
| **Requirements** | XR-001, XR-002. |
| **Guardrails** | - Use `msw` (Mock Service Worker) for API mocking. |
| **Risk** | Medium. Token refresh mutex logic needs careful testing. |

### Task 5.4: Playwright E2E tests for critical flows

| Field | Value |
|---|---|
| **Files** | `e2e/login.spec.ts`, `e2e/scenarios.spec.ts`, `e2e/review.spec.ts`, `e2e/users.spec.ts`, `playwright.config.ts` |
| **Implementation** | 1. **login.spec.ts**: Test successful login -> redirects to default page. Test invalid credentials -> shows error. Test unauthorized role -> shows access denied. |
| | 2. **scenarios.spec.ts**: Test create scenario with valid data -> saved as draft. Test validation: empty title, < 3 nodes. Test submit for review -> status changes. |
| | 3. **review.spec.ts**: Test review queue loads. Test approve scenario -> moves out of queue. Test reject without reason -> validation error. Test reject with reason -> scenario rejected. |
| | 4. **users.spec.ts**: Test search users. Test view user detail. Test ban user with confirm dialog (checkbox + reason). Test unban user. |
| **Requirements** | REQ-001 through REQ-009. |
| **Guardrails** | - Use Playwright's `page.route()` to mock API responses (no real backend needed). |
| | - Tests must be independent and idempotent. |
| | - Use `test.describe()` to group related tests. |
| | - Screenshots on failure. |
| **Risk** | Medium. E2E test stability depends on selector strategy. Use `data-testid` attributes on key elements. |

---

## DEFERRED Tasks

The following tasks are deferred from the current iteration. They are listed here for future reference and backlog planning.

| Task ID | Name | Role | Screen | Route | Status |
|---|---|---|---|---|---|
| T011 | Manage Scenario Packs | R004 | S011 | `/admin/scenario-packs` | [DEFERRED] |
| T012 | Manage Scenario Tags | R004 | S011 | `/admin/scenario-tags` | [DEFERRED] |
| T022 | Subscription Admin View | R007 | S032 | `/admin/subscriptions` | [DEFERRED] |
| T026 | User Behavior Analysis | R006 | S024 | `/admin/behavior` | [DEFERRED] |
| T027 | A/B Test Management | R006 | S025 | `/admin/ab-tests` | [DEFERRED] |
| T028 | Generate Operations Report | R006 | S026 | `/admin/reports` | [DEFERRED] |
| T030 | Annotate Anomalous Dialogues | R005 | S028 | `/admin/anomalies` | [DEFERRED] |
| T031 | Manage Prompt Templates | R005 | S029 | `/admin/prompts` | [DEFERRED] |
| T032 | Adjust Pronunciation Parameters | R005 | S030 | `/admin/pronunciation` | [DEFERRED] |
| T034 | Subscription & Refund Management | R007 | S032 | `/admin/subscriptions` | [DEFERRED] |
| T035 | System Configuration | R007 | S033 | `/admin/settings` | [DEFERRED] |
| T036 | Role & Permission Management | R007 | S034 | `/admin/roles` | [DEFERRED] |
| T037 | Handle User Complaints | R007 | S035 | `/admin/complaints` | [DEFERRED] |
| T045 | User Feedback (Admin View) | R007 | S042 | `/admin/feedback` | [DEFERRED] |

Each deferred task has a placeholder page (Task 3.8) with "Coming Soon" badge. Backend API endpoints for deferred features are not yet implemented.

---

## Task Dependency Graph

```
B0 (scaffold)
  |
  v
B1 Foundation
  1.1 Types ─────────────┐
  1.2 API Client ────────┤
  1.3 Zustand Stores ────┤
  1.4 Query Client ──────┤
  1.5 Layout ────────────┤
  1.6 AuthGuard ─────────┤  (1.3 depends on 1.1)
  1.7 Shared UI ─────────┘  (1.6 depends on 1.3)
         |
         v
B3 Page Components (all depend on B1)
  3.1 Login ─────────────────── depends on 1.2, 1.3, 1.6, 1.7
  3.2 Scenario List ─────────── depends on 1.7
  3.3 Scenario Editor ───────── depends on 1.7, 3.2
  3.4 Review Queue ──────────── depends on 1.7, 3.3
  3.5 AI Quality ────────────── depends on 1.7
  3.6 Metrics Dashboard ─────── depends on 1.7
  3.7 User Management ───────── depends on 1.7
  3.8 Deferred Shells ───────── depends on 1.5, 1.7
         |
         v
B4 API Integration (all depend on B3)
  4.1 Scenario hooks ────────── depends on 1.2, 3.2, 3.3, 3.4
  4.2 AI Quality hooks ──────── depends on 1.2, 3.5
  4.3 Metrics hooks ─────────── depends on 1.2, 3.6
  4.4 User hooks ────────────── depends on 1.2, 3.7
  4.5 Auth/Permission hooks ─── depends on 1.3
  4.6 Wire up all pages ─────── depends on 4.1-4.5
         |
         v
B5 Testing (all depend on B4)
  5.1 Component tests ───────── depends on B3 components
  5.2 Store tests ───────────── depends on 1.3
  5.3 API client tests ──────── depends on 1.2
  5.4 E2E tests ─────────────── depends on B4 full integration
```
