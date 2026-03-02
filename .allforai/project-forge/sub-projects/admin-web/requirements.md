# Requirements -- admin-web (sp-002)

> Sub-project: **admin-web** | Stack: Next.js 14 App Router + Tailwind CSS + Zustand + TanStack Query
>
> Port: 3000 | Auth: JWT | Backend API base: `http://localhost:8000/api/v1`

---

## 1. Roles & Permission Matrix

| Page / Feature | R004 Content Operator | R005 AI Trainer | R006 Data Operator | R007 System Admin |
|---|:---:|:---:|:---:|:---:|
| S037 Login | Y | Y | Y | Y |
| S009 Scenario Script Editor | **RW** | -- | -- | -- |
| S010 Review Queue | **RW** | -- | -- | -- |
| S023 Key Metrics Dashboard | -- | -- | **R** | -- |
| S027 AI Quality Scores | -- | **R** | -- | -- |
| S031 User Management | -- | -- | -- | **RW** |

R = read-only, RW = read-write, -- = no access.

> Note: All roles require JWT authentication. Route guards must redirect unauthorized roles to `/admin/unauthorized` (403 page).

---

## 2. Requirements by Role

### 2.1 R004 -- Content Operator (Internal Content Team)

#### REQ-001: Create Scenario Script

| Field | Value |
|---|---|
| **Priority** | P0 (CORE) |
| **Source** | T009, S009 |
| **User Story** | As a Content Operator, I want to create scenario dialogue scripts with structured nodes so that learners can practice English in realistic situations. |
| **Acceptance Criteria** | 1. Operator can create a new scenario with title, description, difficulty (beginner/intermediate/advanced), target roles, and dialogue nodes. |
| | 2. Each dialogue node has: sequence, role (user/ai), content text, and optional hints. |
| | 3. Scenario is saved as `status=draft` by default. |
| | 4. Operator can add/remove/reorder dialogue nodes via drag-and-drop or up/down buttons. |
| | 5. Operator can preview the dialogue flow before saving. |
| | 6. Operator can optionally link a Prompt template to the scenario. |
| | 7. Operator can save as draft at any point (auto-save every 30s). |
| **Rules** | - Title must not be empty (SCEN_003). |
| | - At least 3 dialogue nodes required (SCEN_002). |
| | - Difficulty level must be selected (SCEN_004). |
| | - Dialogue nodes must alternate between user and ai roles. |
| **Error Scenarios** | - Save fails due to network -> show toast "Save failed, will retry", auto-retry 3x. |
| | - Validation error (< 3 nodes) -> highlight node count with inline error. |
| | - Title empty on submit -> focus title field, show "Scenario title is required". |
| **Backend API** | `POST /api/v1/scenarios` (create), `PUT /api/v1/scenarios/{id}` (update) |

#### REQ-002: Submit Scenario for Review

| Field | Value |
|---|---|
| **Priority** | P0 (CORE) |
| **Source** | T009, CN006 |
| **User Story** | As a Content Operator, I want to submit a completed draft scenario for review so that it goes through the approval workflow before being visible to learners. |
| **Acceptance Criteria** | 1. Only scenarios in `draft` or `rejected` status show a "Submit for Review" button. |
| | 2. On submit, status transitions to `review` and `submitted_at` is set. |
| | 3. Confirmation dialog: "Are you sure you want to submit this scenario for review?" |
| | 4. After submission, the scenario becomes read-only for the author until reviewed. |
| **Rules** | - [CN006] Scenario content must pass through approval workflow before publishing. |
| | - State machine: draft -> review -> published OR rejected. rejected -> draft (re-edit). |
| **Error Scenarios** | - Invalid status transition (e.g., already in review) -> toast "Scenario is already under review" (SCEN_006). |
| | - Validation fails -> block submission, show inline errors. |
| **Backend API** | `POST /api/v1/scenarios/{id}/submit-review` |

#### REQ-003: Review Scenario Content

| Field | Value |
|---|---|
| **Priority** | P0 (CORE) |
| **Source** | T010, S010, CN006 |
| **User Story** | As a Content Operator, I want to review submitted scenarios and approve or reject them so that only quality content reaches learners. |
| **Acceptance Criteria** | 1. Review Queue page shows all scenarios with `status=review`, sorted by `submitted_at` ascending. |
| | 2. Each queue item shows: title, author, difficulty, submitted_at, node count. |
| | 3. Clicking an item opens a read-only preview of the full scenario dialogue. |
| | 4. Reviewer can click "Approve" (status -> published) or "Reject" (status -> rejected). |
| | 5. Rejection requires a reason (textarea, min 10 chars). |
| | 6. After approval, `published_at` and `reviewed_at` are set; scenario becomes visible to learners. |
| | 7. Queue supports pagination (20 items/page). |
| **Rules** | - Rejection reason is required; empty reason returns SCEN_005. |
| | - [CN006] Only reviewed + approved scenarios are published. |
| | - Reviewer must be a different user from the author. |
| **Error Scenarios** | - Empty rejection reason -> inline error "Please provide a reason for rejection". |
| | - Scenario was already reviewed (race condition) -> toast "This scenario has already been reviewed" (SCEN_006). |
| **Backend API** | `GET /api/v1/scenarios/review-queue`, `POST /api/v1/scenarios/{id}/review` |

---

### 2.2 R005 -- AI Trainer

#### REQ-004: View AI Quality Scores

| Field | Value |
|---|---|
| **Priority** | P0 (CORE) |
| **Source** | T029, S027 |
| **User Story** | As an AI Trainer, I want to view AI dialogue quality scores and trends so that I can identify when AI output quality drops. |
| **Acceptance Criteria** | 1. Dashboard shows: average quality score (gauge chart), score distribution (histogram), and daily trend (line chart, last 30 days). |
| | 2. Low-score conversation list shows conversations below threshold (configurable, default < 3.0). |
| | 3. Each low-score item shows: conversation ID, user display name, scenario title, score, date. |
| | 4. Clicking a low-score item opens a conversation detail view with full message history. |
| | 5. Supports date range filter (from/to). |
| | 6. Supports sorting by score ascending or date. |
| | 7. Pagination (20 items/page). |
| **Rules** | - Score range: 0.0 - 5.0. |
| | - Trend chart shows data points per day. |
| **Error Scenarios** | - No data for selected range -> show empty state: "No quality data available for this period". |
| | - API timeout -> show cached data with "Data may be stale" banner. |
| **Backend API** | `GET /api/v1/admin/ai-quality/overview`, `GET /api/v1/admin/ai-quality/low-score` |

---

### 2.3 R006 -- Data Operator

#### REQ-005: View Key Metrics Dashboard

| Field | Value |
|---|---|
| **Priority** | P0 (CORE) |
| **Source** | T025, S023 |
| **User Story** | As a Data Operator, I want to view key product metrics (DAU, MAU, retention, revenue) on a single dashboard so that I can monitor product health at a glance. |
| **Acceptance Criteria** | 1. Dashboard shows four KPI cards: DAU, MAU, 7-day retention rate, total revenue. |
| | 2. Each KPI card shows current value, delta vs. previous period, and a sparkline. |
| | 3. Below KPI cards: line charts for DAU trend (30 days), retention cohort chart, revenue trend. |
| | 4. Date range selector: last 7d / 30d / 90d / custom. |
| | 5. Auto-refresh every 5 minutes (configurable). |
| | 6. Dashboard loads within 3 seconds. |
| **Rules** | - Metrics pulled from backend aggregation endpoint, not computed client-side. |
| | - Revenue displayed in user's configured currency. |
| **Error Scenarios** | - API error -> show last successful snapshot with "Unable to refresh. Showing data from {time}" banner. |
| | - Partial data failure -> show available KPIs, dim unavailable ones. |
| **Backend API** | `GET /api/v1/admin/metrics/dashboard` |

#### REQ-006: Set Metric Alert Threshold

| Field | Value |
|---|---|
| **Priority** | P0 (CORE) |
| **Source** | T025, S023 |
| **User Story** | As a Data Operator, I want to set alert thresholds for key metrics so that I am notified when metrics fall below acceptable levels. |
| **Acceptance Criteria** | 1. Each KPI card has a "Set Alert" icon button. |
| | 2. Clicking opens a dialog with: metric name, operator (<, >, <=, >=), threshold value, notification channel (email). |
| | 3. Alert is saved and shown as a badge on the KPI card. |
| | 4. Success toast: "Alert saved successfully". |
| **Rules** | - Threshold value must be a positive number. |
| **Error Scenarios** | - Invalid threshold -> inline validation error. |
| **Backend API** | `POST /api/v1/admin/metrics/alerts` |

---

### 2.4 R007 -- System Admin

#### REQ-007: Search and View Users

| Field | Value |
|---|---|
| **Priority** | P0 (CORE) |
| **Source** | T033, S031 |
| **User Story** | As a System Admin, I want to search users by email, display name, or phone and view their account details so that I can manage user accounts. |
| **Acceptance Criteria** | 1. Search bar with debounced input (300ms). Search by email, display_name, or phone. |
| | 2. Results table shows: avatar, display_name, email, subscription_tier, is_banned, created_at. |
| | 3. Clicking a row opens user detail panel/page showing: full profile, learning summary (conversations count, avg score, streak), subscription history, recent conversations list. |
| | 4. Table supports pagination (20/page), sorting by created_at or display_name. |
| | 5. Filter chips: subscription_tier (all/free/premium/pro), banned status (all/active/banned). |
| **Rules** | - Only R007 can access user management pages. |
| **Error Scenarios** | - No results -> show "No users matching your search". |
| | - User not found (direct URL) -> 404 page (USER_002). |
| **Backend API** | `GET /api/v1/admin/users`, `GET /api/v1/admin/users/{id}` |

#### REQ-008: Ban / Unban User

| Field | Value |
|---|---|
| **Priority** | P0 (CORE) |
| **Source** | T033, CN008 |
| **User Story** | As a System Admin, I want to ban or unban a user with mandatory confirmation and audit trail so that abusive users are removed while maintaining accountability. |
| **Acceptance Criteria** | 1. User detail page shows a "Ban User" button (red) if user is active, or "Unban User" (green) if banned. |
| | 2. Clicking "Ban User" opens a confirmation dialog with: |
| |    a. Warning text: "This will immediately block the user from accessing the app." |
| |    b. Reason textarea (required, min 5 chars). |
| |    c. Checkbox: "I confirm this action" (must be checked). |
| |    d. "Ban User" (destructive) and "Cancel" buttons. |
| | 3. API sends `{ reason, confirm: true }` only when checkbox is checked. |
| | 4. On success: badge updates to "Banned", toast "User has been banned". |
| | 5. Unban: simpler dialog with confirm button, no reason required. |
| | 6. All ban/unban operations are recorded in audit log (server-side). |
| **Rules** | - [CN008] Ban operation requires double confirmation + audit log. |
| | - `confirm: true` must be sent in the request; backend returns 400 (USER_001) otherwise. |
| | - Ban reason is required for ban; omitting returns 400. |
| **Error Scenarios** | - Confirm checkbox unchecked -> "Ban User" button stays disabled. |
| | - User already banned -> show "User is already banned" (disable ban button). |
| | - Network error -> toast "Failed to ban user, please try again". |
| **Backend API** | `POST /api/v1/admin/users/{id}/ban`, `POST /api/v1/admin/users/{id}/unban` |

#### REQ-009: Admin Login

| Field | Value |
|---|---|
| **Priority** | P0 (CORE) |
| **Source** | T039, S037 |
| **User Story** | As any admin role, I want to log into the admin dashboard with my credentials so that I can access authorized features. |
| **Acceptance Criteria** | 1. Login page with email and password fields. |
| | 2. On success: store JWT pair (access_token, refresh_token) in httpOnly-compatible storage (Zustand authStore + cookie). |
| | 3. Redirect to role-appropriate default page after login. |
| | 4. Auto-refresh access token before expiry using refresh_token. |
| | 5. On token refresh failure -> redirect to login page. |
| | 6. Logout button in topbar clears tokens and redirects to login. |
| **Rules** | - Only users with admin roles (R004/R005/R006/R007) can access admin dashboard. |
| | - Consumer-only users see "Access Denied" error. |
| **Error Scenarios** | - Invalid credentials -> "Invalid email or password" (AUTH_001). |
| | - Account banned -> "Your account has been suspended" (AUTH_003). |
| | - Network error -> "Unable to connect. Please check your network." |
| **Backend API** | `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout` |

---

## 3. DEFERRED Requirements

The following tasks are assigned to admin-web but have been deferred from the current iteration. Placeholder routes and empty page shells should be created with a "Coming Soon" badge.

| ID | Task | Role | Screen | Defer Reason |
|---|---|---|---|---|
| T011 | Manage Scenario Packs | R004 | S011 | Freq=medium, secondary scenario (PRUNE-004) [DEFERRED] |
| T012 | Manage Scenario Tags | R004 | S011 | Freq=medium, secondary scenario (PRUNE-005) [DEFERRED] |
| T022 | Subscription Admin View | R007 | S032 | Freq=low, high risk, revenue-critical (PRUNE-013) [DEFERRED] |
| T026 | User Behavior Analysis | R006 | S024 | Freq=medium, secondary scenario (PRUNE-016) [DEFERRED] |
| T027 | A/B Test Management | R006 | S025 | Freq=medium, medium risk (PRUNE-017) [DEFERRED] |
| T028 | Generate Operations Report | R006 | S026 | Freq=medium, secondary scenario (PRUNE-018) [DEFERRED] |
| T030 | Annotate Anomalous Dialogues | R005 | S028 | Freq=medium, medium risk (PRUNE-019) [DEFERRED] |
| T031 | Manage Prompt Templates | R005 | S029 | Freq=medium, medium risk (PRUNE-020) [DEFERRED] |
| T032 | Adjust Pronunciation Parameters | R005 | S030 | Freq=low, medium risk (PRUNE-021) [DEFERRED] |
| T034 | Subscription & Refund Management | R007 | S032 | Freq=medium, high risk (PRUNE-022) [DEFERRED] |
| T035 | System Configuration | R007 | S033 | Freq=low, high risk (PRUNE-023) [DEFERRED] |
| T036 | Role & Permission Management | R007 | S034 | Freq=low, medium risk (PRUNE-024) [DEFERRED] |
| T037 | Handle User Complaints | R007 | S035 | Freq=medium, medium risk (PRUNE-025) [DEFERRED] |
| T045 | User Feedback (Admin View) | R007 | S042 | Freq=low, secondary (PRUNE-031) [DEFERRED] |

---

## 4. Cross-Cutting Requirements

### 4.1 Authentication & Authorization

| ID | Requirement |
|---|---|
| XR-001 | All pages except `/admin/login` require a valid JWT access token. |
| XR-002 | Token refresh happens automatically 60s before expiry via TanStack Query's `refetchInterval`. |
| XR-003 | Route middleware checks user's role against the page's required role(s); mismatch redirects to `/admin/unauthorized`. |
| XR-004 | Session timeout after 30 min of inactivity -> redirect to login. |

### 4.2 UI States

Every data-driven page must handle these five states:

| State | Behavior |
|---|---|
| **Loading** | Skeleton/shimmer placeholders matching the expected layout. |
| **Empty** | Illustration + descriptive text + CTA (if applicable). |
| **Error** | Error banner with retry button; toast for transient errors. |
| **Success** | Data rendered normally. |
| **Permission Denied** | Full-page 403 with "You don't have permission to access this page" + link to dashboard. |

### 4.3 Responsive Behavior

- Min supported width: 1024px (admin dashboards are not optimized for mobile).
- Sidebar collapses to icons-only at < 1280px.
- DataTables switch to horizontal scroll at tight widths.

### 4.4 Accessibility

- All interactive elements must be keyboard-navigable (tab order).
- ARIA labels on icon-only buttons.
- Color contrast ratio >= 4.5:1 (WCAG AA).
