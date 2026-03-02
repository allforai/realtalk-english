# Design -- admin-web (sp-002)

> Sub-project: **admin-web** | Stack: Next.js 14 App Router + Tailwind CSS + Zustand + TanStack Query
>
> Port: 3000 | Auth: JWT | Backend API base: `http://localhost:8000/api/v1`

---

## 1. Coding Principles

### 1.1 Universal Principles

| # | Principle | Enforcement |
|---|-----------|-------------|
| U1 | Same scenario, same pattern -- all DataTable pages share `<DataTable>`, all forms share `<FormField>` | Code review |
| U2 | One shared utility layer -- API client, error handler, date formatter, permission checker | Single `lib/` package |
| U3 | Prefer mature third-party libraries (TanStack Query, Zustand, zod, recharts, dnd-kit) | Dependency review |
| U4 | Every backend call goes through `lib/api-client.ts`; page components never call `fetch` directly | Architecture lint |

### 1.2 Project-Specific Principles

| # | Source | Principle |
|---|--------|-----------|
| PS1 | CN006 | Scenario content must pass through the approval workflow (draft -> review -> published). UI must enforce state machine transitions -- no shortcut buttons that skip review. |
| PS2 | CN008 | Ban operation requires a confirmation dialog with mandatory reason + checkbox confirmation. The "Ban" button must be disabled until the checkbox is checked. |
| PS3 | -- | All list/table pages use TanStack Query for server state. No Zustand stores for server-fetched data. Zustand is reserved for client-only state (auth, UI preferences). |
| PS4 | -- | Form validation uses zod schemas; schemas are co-located with the form component in a `schema.ts` file. |
| PS5 | -- | All API error responses are handled by a centralized `handleApiError()` in `lib/api-client.ts` that maps error codes to user-friendly toast messages. |

---

## 2. Page Routes (Next.js App Router)

### 2.1 Route Table

```
apps/admin-web/
  src/
    app/
      layout.tsx                          -- Root layout (html, body, Providers)
      admin/
        layout.tsx                        -- Admin shell (AuthGuard + Sidebar + Topbar + Content)
        page.tsx                          -- /admin -> redirect to role-default page
        login/
          page.tsx                        -- /admin/login (S037) -- public, no sidebar
        unauthorized/
          page.tsx                        -- /admin/unauthorized (403)

        scenarios/
          page.tsx                        -- /admin/scenarios -> scenario list (author's own drafts + all)
          new/
            page.tsx                      -- /admin/scenarios/new (S009 create mode)
          [id]/
            page.tsx                      -- /admin/scenarios/[id] (S009 edit mode)
          review/
            page.tsx                      -- /admin/scenarios/review (S010 review queue)
            [id]/
              page.tsx                    -- /admin/scenarios/review/[id] (review detail)

        dashboard/
          page.tsx                        -- /admin/dashboard (S023 key metrics)

        ai-quality/
          page.tsx                        -- /admin/ai-quality (S027 quality scores)

        users/
          page.tsx                        -- /admin/users (S031 user list)
          [id]/
            page.tsx                      -- /admin/users/[id] (user detail)

        -- DEFERRED pages (empty shells with "Coming Soon") --
        scenario-packs/
          page.tsx                        -- /admin/scenario-packs (S011) [DEFERRED]
        scenario-tags/
          page.tsx                        -- /admin/scenario-tags (S011) [DEFERRED]
        behavior/
          page.tsx                        -- /admin/behavior (S024) [DEFERRED]
        ab-tests/
          page.tsx                        -- /admin/ab-tests (S025) [DEFERRED]
        reports/
          page.tsx                        -- /admin/reports (S026) [DEFERRED]
        anomalies/
          page.tsx                        -- /admin/anomalies (S028) [DEFERRED]
        prompts/
          page.tsx                        -- /admin/prompts (S029) [DEFERRED]
        pronunciation/
          page.tsx                        -- /admin/pronunciation (S030) [DEFERRED]
        subscriptions/
          page.tsx                        -- /admin/subscriptions (S032) [DEFERRED]
        settings/
          page.tsx                        -- /admin/settings (S033) [DEFERRED]
        roles/
          page.tsx                        -- /admin/roles (S034) [DEFERRED]
        complaints/
          page.tsx                        -- /admin/complaints (S035) [DEFERRED]
        feedback/
          page.tsx                        -- /admin/feedback (S042) [DEFERRED]
```

### 2.2 Route Guards & Role Mapping

| Route Pattern | Required Roles | Default for Role |
|---|---|---|
| `/admin/login` | Public (unauthenticated) | -- |
| `/admin/unauthorized` | Any authenticated | -- |
| `/admin/scenarios/**` | R004 | R004 default |
| `/admin/dashboard` | R006 | R006 default |
| `/admin/ai-quality` | R005 | R005 default |
| `/admin/users/**` | R007 | R007 default |
| `/admin/scenario-packs` | R004 | -- |
| `/admin/scenario-tags` | R004 | -- |
| `/admin/behavior` | R006 | -- |
| `/admin/ab-tests` | R006 | -- |
| `/admin/reports` | R006 | -- |
| `/admin/anomalies` | R005 | -- |
| `/admin/prompts` | R005 | -- |
| `/admin/pronunciation` | R005 | -- |
| `/admin/subscriptions` | R007 | -- |
| `/admin/settings` | R007 | -- |
| `/admin/roles` | R007 | -- |
| `/admin/complaints` | R007 | -- |
| `/admin/feedback` | R007 | -- |

**Role-to-default-page mapping** (used after login redirect):

```typescript
const ROLE_DEFAULT_PAGE: Record<string, string> = {
  R004: '/admin/scenarios',
  R005: '/admin/ai-quality',
  R006: '/admin/dashboard',
  R007: '/admin/users',
};
```

---

## 3. Component Architecture

### 3.1 Layout Components

```
components/
  layout/
    AdminShell.tsx          -- Wraps Sidebar + Topbar + main content area
    Sidebar.tsx             -- Collapsible sidebar with nav links (filtered by role)
    Topbar.tsx              -- Logo, breadcrumb, user menu (role badge, logout)
    AuthGuard.tsx           -- Client component: checks authStore, redirects if no token or wrong role
    Providers.tsx           -- QueryClientProvider + ZustandProvider wrapper
```

**AdminShell layout:**

```
+-------+-------------------------------------------+
| Sidebar| Topbar (breadcrumb, user avatar, logout) |
|  (nav) |------------------------------------------|
|        | Content Area (children)                   |
|  240px |                                           |
|  fixed |                                           |
+-------+-------------------------------------------+
```

- Sidebar width: 240px expanded, 64px collapsed (icons only).
- Topbar height: 64px fixed.
- Content area: scrollable, padded 24px.

### 3.2 Shared UI Components

```
components/
  ui/
    DataTable.tsx           -- Generic sortable, paginated table
    DataTablePagination.tsx -- Page controls (prev/next, page size selector)
    DataTableSearch.tsx     -- Debounced search input for tables
    FormField.tsx           -- Label + Input + error message wrapper
    FormSelect.tsx          -- Label + Select dropdown + error
    FormTextarea.tsx        -- Label + Textarea + error + char count
    ConfirmDialog.tsx       -- Modal with title, message, confirm/cancel buttons
    DestructiveConfirmDialog.tsx -- ConfirmDialog variant with checkbox + reason textarea (for ban)
    Badge.tsx               -- Status badge (draft/review/published/rejected/banned/active)
    StatusBadge.tsx         -- Colored badge mapping: draft=gray, review=yellow, published=green, rejected=red
    KpiCard.tsx             -- Metric card with value, delta, sparkline
    EmptyState.tsx          -- Illustration + text + optional CTA
    LoadingSkeleton.tsx     -- Shimmer placeholder
    ErrorBanner.tsx         -- Inline error with retry button
    Toast.tsx               -- Toast notification system (success/error/warning/info)
    PageHeader.tsx          -- Page title + description + action buttons
    ComingSoonPage.tsx      -- Full-page "Coming Soon" placeholder for deferred features
```

### 3.3 Feature Components

```
components/
  scenarios/
    ScenarioForm.tsx        -- Create/edit scenario form (title, description, difficulty, target_roles, tags)
    DialogueNodeEditor.tsx  -- List of dialogue nodes with add/remove/reorder (dnd-kit)
    DialogueNodeItem.tsx    -- Single node: role selector, content textarea, hints
    ScenarioPreview.tsx     -- Read-only chat-bubble preview of dialogue flow
    ReviewQueueTable.tsx    -- DataTable configured for review queue
    ReviewActionPanel.tsx   -- Approve/Reject buttons + rejection reason textarea

  ai-quality/
    QualityOverviewCards.tsx -- Avg score gauge + score distribution histogram
    QualityTrendChart.tsx   -- 30-day line chart (recharts)
    LowScoreTable.tsx       -- DataTable for low-score conversations
    ConversationDetail.tsx  -- Message history viewer (chat bubbles, read-only)

  dashboard/
    MetricsDashboard.tsx    -- Grid of KpiCards + charts
    DauChart.tsx            -- DAU/MAU line chart (recharts)
    RetentionChart.tsx      -- Cohort retention heatmap or line chart
    RevenueChart.tsx        -- Revenue trend line chart
    AlertDialog.tsx         -- Set alert threshold dialog

  users/
    UserSearchTable.tsx     -- DataTable with search + filters (tier, ban status)
    UserDetailPanel.tsx     -- Full user profile + learning summary
    UserLearningStats.tsx   -- Conversations count, avg score, streak info
    BanUserDialog.tsx       -- DestructiveConfirmDialog configured for ban flow
    UnbanUserDialog.tsx     -- Simple ConfirmDialog for unban

  auth/
    LoginForm.tsx           -- Email + password form with zod validation
```

---

## 4. State Management

### 4.1 Zustand Stores (Client-Only State)

#### authStore

```typescript
// stores/authStore.ts
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    roles: string[];  // ['R004'], ['R005'], etc.
  } | null;
  isAuthenticated: boolean;

  // Actions
  login: (tokens: TokenResponse, user: UserInfo) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  hasRole: (role: string) => boolean;
  getDefaultPage: () => string;
}
```

Persistence: `zustand/middleware` persist to `localStorage` (access_token, refresh_token, user). On app load, validate token expiry; if expired, attempt refresh.

#### uiStore

```typescript
// stores/uiStore.ts
interface UiState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';

  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

Persistence: `localStorage`.

### 4.2 TanStack Query (Server State)

All server-fetched data uses TanStack Query. Key query patterns:

| Query Key | API Endpoint | Used By | Stale Time |
|---|---|---|---|
| `['scenarios', filters]` | `GET /scenarios` | ScenarioForm (tag picker) | 5 min |
| `['scenario', id]` | `GET /scenarios/{id}` | ScenarioForm (edit), ScenarioPreview | 1 min |
| `['review-queue', page]` | `GET /scenarios/review-queue` | ReviewQueueTable | 30 sec |
| `['ai-quality-overview', dateRange]` | `GET /admin/ai-quality/overview` | QualityOverviewCards, QualityTrendChart | 2 min |
| `['ai-quality-low-score', filters]` | `GET /admin/ai-quality/low-score` | LowScoreTable | 2 min |
| `['metrics-dashboard', dateRange]` | `GET /admin/metrics/dashboard` | MetricsDashboard | 5 min |
| `['users', search, filters, page]` | `GET /admin/users` | UserSearchTable | 1 min |
| `['user', id]` | `GET /admin/users/{id}` | UserDetailPanel | 1 min |

**Mutations:**

| Mutation | API Endpoint | Invalidates | Optimistic? |
|---|---|---|---|
| `createScenario` | `POST /scenarios` | `['scenarios']` | No |
| `updateScenario` | `PUT /scenarios/{id}` | `['scenario', id]` | No |
| `submitForReview` | `POST /scenarios/{id}/submit-review` | `['scenario', id], ['review-queue']` | No |
| `reviewScenario` | `POST /scenarios/{id}/review` | `['scenario', id], ['review-queue']` | No |
| `banUser` | `POST /admin/users/{id}/ban` | `['user', id], ['users']` | No |
| `unbanUser` | `POST /admin/users/{id}/unban` | `['user', id], ['users']` | No |
| `createAlert` | `POST /admin/metrics/alerts` | `['metrics-dashboard']` | No |

### 4.3 Query Client Configuration

```typescript
// lib/query-client.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,       // 2 min default
      gcTime: 10 * 60 * 1000,         // 10 min garbage collection
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});
```

---

## 5. API Client

### 5.1 Architecture

```typescript
// lib/api-client.ts
import { useAuthStore } from '@/stores/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1';

class ApiClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T>;
  private async refreshTokenIfNeeded(): Promise<void>;

  // Auth
  async login(email: string, password: string): Promise<TokenResponse>;
  async refresh(refreshToken: string): Promise<TokenResponse>;
  async logout(): Promise<void>;

  // Scenarios
  async getScenarios(params: ScenarioListQuery): Promise<PaginatedResponse<ScenarioListItem>>;
  async getScenario(id: string): Promise<ScenarioDetail>;
  async createScenario(data: ScenarioCreateReq): Promise<ScenarioDetail>;
  async updateScenario(id: string, data: ScenarioCreateReq): Promise<ScenarioDetail>;
  async submitForReview(id: string): Promise<void>;
  async reviewScenario(id: string, data: ReviewRequest): Promise<ScenarioDetail>;
  async getReviewQueue(page: number, size: number): Promise<PaginatedResponse<ScenarioListItem>>;

  // AI Quality
  async getAiQualityOverview(dateRange: DateRange): Promise<QualityOverview>;
  async getAiQualityLowScore(params: LowScoreQuery): Promise<PaginatedResponse<LowScoreItem>>;

  // Metrics
  async getMetricsDashboard(dateRange: DateRange): Promise<MetricsDashboard>;
  async createAlert(data: AlertRequest): Promise<void>;

  // Users
  async searchUsers(params: UserSearchQuery): Promise<PaginatedResponse<UserListItem>>;
  async getUserDetail(id: string): Promise<UserDetail>;
  async banUser(id: string, data: BanUserReq): Promise<void>;
  async unbanUser(id: string): Promise<void>;
}

export const apiClient = new ApiClient();
```

### 5.2 Error Handling

```typescript
// lib/api-errors.ts
const ERROR_MESSAGES: Record<string, string> = {
  AUTH_001: 'Invalid email or password.',
  AUTH_002: 'Your session has expired. Please log in again.',
  AUTH_003: 'Your account has been suspended.',
  AUTH_004: 'You do not have permission to perform this action.',
  SCEN_002: 'Scenario must have at least 3 dialogue nodes.',
  SCEN_003: 'Scenario title is required.',
  SCEN_004: 'Difficulty level is required.',
  SCEN_005: 'Please provide a reason for rejection.',
  SCEN_006: 'Invalid status transition. The scenario may have already been reviewed.',
  USER_001: 'Ban confirmation is required.',
  USER_002: 'User not found.',
  CONFIG_001: 'Threshold value must be between 0.0 and 1.0.',
  GENERAL_001: 'An unexpected error occurred. Please try again.',
  GENERAL_002: 'Please fix the highlighted fields.',
};
```

### 5.3 Request/Response Interceptors

1. **Request interceptor**: Attach `Authorization: Bearer <token>` header from authStore.
2. **401 response interceptor**: Attempt token refresh. If refresh fails, call `authStore.logout()` and redirect to `/admin/login`.
3. **403 response interceptor**: Redirect to `/admin/unauthorized`.
4. **Network error**: Show toast "Network error. Please check your connection."

---

## 6. Form Validation Schemas (zod)

### 6.1 Login Schema

```typescript
// app/admin/login/schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
```

### 6.2 Scenario Schema

```typescript
// components/scenarios/schema.ts
import { z } from 'zod';

const dialogueNodeSchema = z.object({
  sequence: z.number().int().min(1),
  role: z.enum(['user', 'ai']),
  content: z.string().min(1, 'Dialogue content is required'),
  hints: z.string().optional(),
});

export const scenarioSchema = z.object({
  title: z.string().min(1, 'Scenario title is required'),                  // SCEN_003
  description: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Difficulty level is required',                        // SCEN_004
  }),
  target_roles: z.array(z.string()).min(1, 'Select at least one target role'),
  dialogue_nodes: z.array(dialogueNodeSchema).min(3, 'At least 3 dialogue nodes are required'), // SCEN_002
  tag_ids: z.array(z.string().uuid()).optional(),
  prompt_template_id: z.string().uuid().optional().nullable(),
});
```

### 6.3 Ban User Schema

```typescript
// components/users/schema.ts
import { z } from 'zod';

export const banUserSchema = z.object({
  reason: z.string().min(5, 'Ban reason must be at least 5 characters'),   // CN008
  confirm: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm this action' }),
  }),
});
```

### 6.4 Review Schema

```typescript
// components/scenarios/review-schema.ts
import { z } from 'zod';

export const reviewApproveSchema = z.object({
  action: z.literal('approve'),
});

export const reviewRejectSchema = z.object({
  action: z.literal('reject'),
  reason: z.string().min(10, 'Rejection reason must be at least 10 characters'), // SCEN_005
});

export const reviewSchema = z.discriminatedUnion('action', [
  reviewApproveSchema,
  reviewRejectSchema,
]);
```

### 6.5 Alert Schema

```typescript
// components/dashboard/schema.ts
import { z } from 'zod';

export const alertSchema = z.object({
  metric: z.string().min(1),
  operator: z.enum(['<', '>', '<=', '>=']),
  threshold: z.number().positive('Threshold must be a positive number'),
  channel: z.enum(['email']),
});
```

---

## 7. TypeScript Types

### 7.1 API Types

```typescript
// types/api.ts

// -- Common --
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// -- Auth --
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'bearer';
}

interface LoginRequest {
  email: string;
  password: string;
}

// -- Scenario --
type ScenarioStatus = 'draft' | 'review' | 'published' | 'rejected' | 'archived';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface DialogueNode {
  sequence: number;
  role: 'user' | 'ai';
  content: string;
  hints?: string;
}

interface ScenarioListItem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: { id: string; name: string }[];
  status: ScenarioStatus;
  author: { id: string; display_name: string };
  submitted_at: string | null;
  created_at: string;
}

interface ScenarioDetail {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  target_roles: string[];
  dialogue_nodes: DialogueNode[];
  tags: { id: string; name: string }[];
  status: ScenarioStatus;
  rejection_reason: string | null;
  prompt_template_id: string | null;
  pack_id: string | null;
  author: { id: string; display_name: string };
  reviewer: { id: string; display_name: string } | null;
  reviewed_at: string | null;
  submitted_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ScenarioCreateReq {
  title: string;
  description?: string;
  difficulty: Difficulty;
  target_roles: string[];
  dialogue_nodes: DialogueNode[];
  tag_ids?: string[];
  prompt_template_id?: string | null;
}

interface ReviewRequest {
  action: 'approve' | 'reject';
  reason?: string;
}

// -- AI Quality --
interface QualityOverview {
  avg_score: number;
  score_distribution: Record<string, number>;
  trend: { date: string; avg_score: number }[];
}

interface LowScoreItem {
  conversation_id: string;
  user_display_name: string;
  scenario_title: string;
  score: number;
  date: string;
}

// -- Metrics --
interface MetricsDashboard {
  dau: MetricValue;
  mau: MetricValue;
  retention_7d: MetricValue;
  revenue: MetricValue;
  dau_trend: { date: string; value: number }[];
  retention_cohort: { cohort: string; day: number; rate: number }[];
  revenue_trend: { date: string; value: number }[];
}

interface MetricValue {
  current: number;
  previous: number;
  delta_percent: number;
}

interface AlertRequest {
  metric: string;
  operator: '<' | '>' | '<=' | '>=';
  threshold: number;
  channel: 'email';
}

// -- Users --
type SubscriptionTier = 'free' | 'premium' | 'pro';

interface UserListItem {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  is_banned: boolean;
  created_at: string;
}

interface UserDetail extends UserListItem {
  phone: string | null;
  native_language: string;
  english_level: Difficulty;
  learning_goal: string | null;
  ban_reason: string | null;
  learning_summary: {
    total_conversations: number;
    avg_score: number | null;
    current_streak: number;
    total_vocabulary: number;
  };
  subscription: {
    plan: string;
    status: string;
    started_at: string | null;
    expires_at: string | null;
  } | null;
}

interface BanUserReq {
  reason: string;
  confirm: boolean;
}
```

---

## 8. UI States by Page

| Page | Loading | Empty | Error | Permission Denied |
|---|---|---|---|---|
| S037 Login | Submit button spinner | N/A | Inline field errors + toast | N/A (public) |
| S009 Scenario Editor (new) | N/A | Pre-filled empty form | Toast on save failure | Redirect if not R004 |
| S009 Scenario Editor (edit) | Skeleton for form fields | N/A (404 if not found) | Error banner + retry | Redirect if not R004 |
| S010 Review Queue | Table skeleton rows | "No scenarios pending review" illustration | Error banner + retry | Redirect if not R004 |
| S023 Metrics Dashboard | KPI skeleton cards + chart shimmer | "No metrics data yet" per chart | Stale data banner + auto-retry | Redirect if not R006 |
| S027 AI Quality | Gauge skeleton + table skeleton | "No quality data for this period" | Error banner + retry | Redirect if not R005 |
| S031 User List | Table skeleton rows | "No users found" for search | Error banner + retry | Redirect if not R007 |
| S031 User Detail | Profile skeleton | N/A (404 if not found) | Error banner + retry | Redirect if not R007 |
| DEFERRED pages | N/A | ComingSoonPage | N/A | Redirect if wrong role |

---

## 9. Sidebar Navigation Structure

```typescript
// lib/navigation.ts
interface NavItem {
  label: string;
  href: string;
  icon: string;        // Lucide icon name
  roles: string[];     // Required roles
  badge?: string;      // e.g., "Coming Soon"
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Content',
    items: [
      { label: 'Scenarios', href: '/admin/scenarios', icon: 'BookOpen', roles: ['R004'] },
      { label: 'Review Queue', href: '/admin/scenarios/review', icon: 'ClipboardCheck', roles: ['R004'] },
      { label: 'Scenario Packs', href: '/admin/scenario-packs', icon: 'Package', roles: ['R004'], badge: 'Soon' },
      { label: 'Tags', href: '/admin/scenario-tags', icon: 'Tag', roles: ['R004'], badge: 'Soon' },
    ],
  },
  {
    title: 'AI Quality',
    items: [
      { label: 'Quality Scores', href: '/admin/ai-quality', icon: 'Brain', roles: ['R005'] },
      { label: 'Anomalies', href: '/admin/anomalies', icon: 'AlertTriangle', roles: ['R005'], badge: 'Soon' },
      { label: 'Prompts', href: '/admin/prompts', icon: 'FileText', roles: ['R005'], badge: 'Soon' },
      { label: 'Pronunciation', href: '/admin/pronunciation', icon: 'Mic', roles: ['R005'], badge: 'Soon' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: 'BarChart3', roles: ['R006'] },
      { label: 'Behavior', href: '/admin/behavior', icon: 'TrendingUp', roles: ['R006'], badge: 'Soon' },
      { label: 'A/B Tests', href: '/admin/ab-tests', icon: 'Split', roles: ['R006'], badge: 'Soon' },
      { label: 'Reports', href: '/admin/reports', icon: 'FileBarChart', roles: ['R006'], badge: 'Soon' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Users', href: '/admin/users', icon: 'Users', roles: ['R007'] },
      { label: 'Subscriptions', href: '/admin/subscriptions', icon: 'CreditCard', roles: ['R007'], badge: 'Soon' },
      { label: 'Settings', href: '/admin/settings', icon: 'Settings', roles: ['R007'], badge: 'Soon' },
      { label: 'Roles', href: '/admin/roles', icon: 'Shield', roles: ['R007'], badge: 'Soon' },
      { label: 'Complaints', href: '/admin/complaints', icon: 'MessageSquareWarning', roles: ['R007'], badge: 'Soon' },
      { label: 'Feedback', href: '/admin/feedback', icon: 'MessageCircle', roles: ['R007'], badge: 'Soon' },
    ],
  },
];
```

Sidebar only renders items matching the current user's roles.

---

## 10. Project File Structure

```
apps/admin-web/
  src/
    app/
      layout.tsx                     -- Root: html, body, <Providers>
      globals.css                    -- Tailwind directives + custom vars
      admin/
        layout.tsx                   -- <AuthGuard> + <AdminShell>
        page.tsx                     -- Redirect to role default
        login/page.tsx               -- S037
        unauthorized/page.tsx        -- 403
        scenarios/
          page.tsx                   -- Scenario list (R004)
          new/page.tsx               -- Create scenario (R004)
          [id]/page.tsx              -- Edit scenario (R004)
          review/
            page.tsx                 -- Review queue (R004)
            [id]/page.tsx            -- Review detail (R004)
        dashboard/page.tsx           -- S023 metrics (R006)
        ai-quality/page.tsx          -- S027 quality (R005)
        users/
          page.tsx                   -- S031 user list (R007)
          [id]/page.tsx              -- User detail (R007)
        scenario-packs/page.tsx      -- [DEFERRED]
        scenario-tags/page.tsx       -- [DEFERRED]
        behavior/page.tsx            -- [DEFERRED]
        ab-tests/page.tsx            -- [DEFERRED]
        reports/page.tsx             -- [DEFERRED]
        anomalies/page.tsx           -- [DEFERRED]
        prompts/page.tsx             -- [DEFERRED]
        pronunciation/page.tsx       -- [DEFERRED]
        subscriptions/page.tsx       -- [DEFERRED]
        settings/page.tsx            -- [DEFERRED]
        roles/page.tsx               -- [DEFERRED]
        complaints/page.tsx          -- [DEFERRED]
        feedback/page.tsx            -- [DEFERRED]

    components/
      layout/
        AdminShell.tsx
        Sidebar.tsx
        Topbar.tsx
        AuthGuard.tsx
        Providers.tsx
      ui/
        DataTable.tsx
        DataTablePagination.tsx
        DataTableSearch.tsx
        FormField.tsx
        FormSelect.tsx
        FormTextarea.tsx
        ConfirmDialog.tsx
        DestructiveConfirmDialog.tsx
        Badge.tsx
        StatusBadge.tsx
        KpiCard.tsx
        EmptyState.tsx
        LoadingSkeleton.tsx
        ErrorBanner.tsx
        Toast.tsx
        PageHeader.tsx
        ComingSoonPage.tsx
      scenarios/
        ScenarioForm.tsx
        DialogueNodeEditor.tsx
        DialogueNodeItem.tsx
        ScenarioPreview.tsx
        ReviewQueueTable.tsx
        ReviewActionPanel.tsx
        schema.ts
        review-schema.ts
      ai-quality/
        QualityOverviewCards.tsx
        QualityTrendChart.tsx
        LowScoreTable.tsx
        ConversationDetail.tsx
      dashboard/
        MetricsDashboard.tsx
        DauChart.tsx
        RetentionChart.tsx
        RevenueChart.tsx
        AlertDialog.tsx
        schema.ts
      users/
        UserSearchTable.tsx
        UserDetailPanel.tsx
        UserLearningStats.tsx
        BanUserDialog.tsx
        UnbanUserDialog.tsx
        schema.ts
      auth/
        LoginForm.tsx
        schema.ts

    stores/
      authStore.ts
      uiStore.ts

    lib/
      api-client.ts
      api-errors.ts
      query-client.ts
      navigation.ts
      permissions.ts              -- Role check utilities
      date.ts                     -- Date formatting (dayjs)
      cn.ts                       -- Tailwind className merger (clsx + twMerge)

    types/
      api.ts                      -- All API request/response types
      navigation.ts               -- NavItem, NavSection types

    hooks/
      useAuth.ts                  -- Convenience hook wrapping authStore
      usePermission.ts            -- Role/permission check hook
      scenarios/
        useScenarios.ts           -- TanStack Query hooks for scenario CRUD
        useReviewQueue.ts         -- TanStack Query hook for review queue
      ai-quality/
        useAiQuality.ts           -- TanStack Query hooks for AI quality
      dashboard/
        useMetrics.ts             -- TanStack Query hooks for metrics
      users/
        useUsers.ts               -- TanStack Query hooks for user management

  public/
    images/
      empty-state.svg             -- Empty state illustration
      logo.svg                    -- Admin logo

  tailwind.config.ts
  tsconfig.json
  next.config.mjs
  package.json
  jest.config.ts
  playwright.config.ts
  .env.local.example
```

---

## 11. Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 14.x | Framework |
| `react` | 18.x | UI library |
| `typescript` | 5.x | Type safety |
| `tailwindcss` | 3.x | Styling |
| `zustand` | 4.x | Client state (auth, UI) |
| `@tanstack/react-query` | 5.x | Server state |
| `zod` | 3.x | Form validation |
| `recharts` | 2.x | Charts (dashboard, trends) |
| `@dnd-kit/core` + `@dnd-kit/sortable` | 6.x | Drag-and-drop for dialogue nodes |
| `lucide-react` | latest | Icons |
| `clsx` + `tailwind-merge` | latest | Class name utility |
| `dayjs` | 1.x | Date formatting |
| `jest` + `@testing-library/react` | latest | Unit/component tests |
| `@playwright/test` | latest | E2E tests |
