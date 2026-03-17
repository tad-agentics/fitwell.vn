# FitWell — Full-Stack Review & To-Do Plan

**Date:** March 2026  
**Scope:** `api/`, `web/`, `supabase/migrations/`  
**Method:** Static audit + runtime-path tracing

---

## CRITICAL (app is broken in production with these in place)

### C1 — API: `GET /api/v1/conditions` crashes on every call
**File:** `api/src/modules/conditions/conditions.routes.ts` line 13  
**Bug:** SELECT includes `c.assessment_required`, which does not exist on the `conditions` table (only on `msk_conditions`). Every screen that calls this endpoint (Home, Check-in, Progress, History, Exercise Player) receives a Postgres 500.  
**Fix:** Change `c.assessment_required` → `m.assessment_required` in the JOIN query.

---

### C2 — Frontend: `d?.success?.data` is always `undefined`
**Files:** `S14Home.tsx`, `CheckInForm.tsx`, `S10PostExercise.tsx`, `ProgressView.tsx`, `HistoryView.tsx`  
**Bug:** The API returns `{ success: true, data: {...} }`. `d?.success` evaluates to the boolean `true`; `true?.data` is `undefined`. All data-fetching branches silently produce nothing. Home is permanently a loading skeleton.  
**Fix:** Replace all instances of `d?.success?.data` → `d?.success && d?.data`.  
**Affected lines:**
- `S14Home.tsx`: 59, 77, 85, 86, 98, 107, 166
- `CheckInForm.tsx`: 74
- `S10PostExercise.tsx`: 32–33
- `ProgressView.tsx`: 45
- `HistoryView.tsx`: 37

---

## HIGH (major feature broken or clinically incorrect)

### H1 — Auth: No JWT refresh route
**File:** `api/src/modules/auth/auth.routes.ts`  
**Bug:** Access token TTL is 15 minutes; no `POST /api/v1/auth/refresh` endpoint exists. After 15 min, JWT users are silently de-authenticated with no recovery path.  
**Fix:** Add `POST /api/v1/auth/refresh` that reads the refresh cookie and issues a new access token.

### H2 — Auth: Zustand store disconnected from `window.__fw_access_token`
**File:** `web/src/lib/store.ts`, `web/src/lib/auth.ts`  
**Bug:** `getAuthHeader()` reads `window.__fw_access_token`. The Zustand `setAccessToken` writes to store state only — never sets `window.__fw_access_token`. A freshly issued JWT is never used by `getAuthHeader()`.  
**Fix:** In `setAccessToken`, also set `(window as any).__fw_access_token = token`.

### H3 — Auth: No login / register routes
**File:** `api/src/modules/auth/auth.routes.ts`  
**Bug:** `POST /auth/anonymous/init` is the only auth entry point. No email/password login, registration, or OAuth route. `users.email`, `password_hash`, `google_sub` are wired in schema but unreachable via any API.  
**Fix:** Add `POST /api/v1/auth/register` and `POST /api/v1/auth/login` (email+password). OAuth can follow.

### H4 — Auth: Anonymous → JWT upgrade path missing
**Files:** `api/`, `web/src/lib/auth.ts`  
**Bug:** `users.claimed_at` exists for this purpose but is never written. No route promotes an anonymous user to an identified account. Users who onboard anonymously can never log in from another device.  
**Fix:** Add `POST /api/v1/auth/claim` that accepts email+password, links the anonymous user, and returns a JWT pair.

### H5 — API: Symptom-map ignores user input
**File:** `api/src/modules/onboarding/onboarding.routes.ts` lines 46–57  
**Bug:** `POST /api/v1/onboarding/symptom-map` ignores the `symptom_text` body. Returns hardcoded top-5 MSK conditions from the DB with `confidence: 0.7`. No NLP, no keyword matching, no Claude call.  
**Fix:** Implement at minimum a keyword→slug mapping; ideally call Claude Haiku with the user's symptom text to return ranked conditions with match reasons.

### H6 — API: Check-in AI responses are hardcoded templates
**Files:** `api/src/modules/checkin/checkin.routes.ts` lines 78–101; `api/src/modules/protocol-engine/prompts/`  
**Bug:** `context-builder.ts` and `system-prompt.ts` exist but are never imported or called. All check-in responses are hardcoded JSON; no Claude Haiku call is made.  
**Fix:** Import the context builder and system prompt; call the Anthropic API from the checkin route and return the real AI response.

### H7 — Frontend: `CheckInForm.startExercise()` hardcodes `Anonymous` auth
**File:** `web/src/components/checkin/CheckInForm.tsx` line 132  
**Bug:** After check-in the exercise start POST uses `Authorization: Anonymous ${anonId}` directly, bypassing `getAuthHeader()`. JWT users get an anonymous-scoped session; if `anonId` is null the function silently returns.  
**Fix:** Use `getAuthHeader()` for the session POST; guard with `if (!auth) return`.

### H8 — Frontend: SMSK07 overwrites `assessment_test_slug` for all conditions
**File:** `web/src/components/onboarding/SMSK07Assessment.tsx` line 37  
**Bug:** `assessment_test_slug` is hardcoded to `'prone_press_up'` for every condition. Rotator cuff (`scapular_rhythm`) and sciatica (`slump_test`) get the wrong assessment test, producing clinically incorrect exercise prescription.  
**Fix:** Remove the override; use the `assessment_test_slug` returned by the API or stored on the condition object.

### H9 — Frontend: Assessment/safety-warning flow bypassed
**Files:** `web/src/components/onboarding/OnboardingDescribe.tsx` line 69; `web/src/components/onboarding/ConditionSelect.tsx` line 41  
**Bug:** Both components navigate directly to `/exercise?condition_id=...` after intake, skipping SMSK07 and SMSK08 for conditions with `assessment_required = TRUE`. Users get an un-assessed protocol.  
**Fix:** After intake, check the condition's `assessment_required`; if true, redirect to `/onboarding/assessment`. Otherwise proceed to `/onboarding/insight`.

### H10 — Frontend: `ConditionSelect` always sends `'đau lưng'` as symptom text
**File:** `web/src/components/onboarding/ConditionSelect.tsx` line 53  
**Bug:** The `?q=` query param from S02 (user's typed symptom) is ignored. Symptom-map is always called with `'đau lưng'`, giving every user lumbar-biased results.  
**Fix:** Read `new URLSearchParams(window.location.search).get('q')` and pass that as `symptom_text`.

### H11 — Billing: All routes return 501; no trial record created
**Files:** `api/src/modules/billing/billing.routes.ts`; `api/src/modules/onboarding/condition-factory.service.ts`  
**Bug:** Three billing routes (`create-order`, `payment-status`, `payos-webhook`) are stubs returning HTTP 501. No `subscriptions` row is created during onboarding, so paywall enforcement cannot be added later without a migration.  
**Fix (short-term):** Create a trial subscription row (7-day trial, `status: 'trial'`) in `condition-factory.createConditionWithPhaseGate`. Implement PayOS `create-order` and `payos-webhook` to handle the payment flow.

---

## MEDIUM (degraded UX or important missing feature)

### M1 — DB: `user_profiles.user_id` missing UNIQUE constraint
**File:** `supabase/migrations/20260316000001_users_auth.sql`  
**Bug:** Concurrent onboarding requests can race and create duplicate `user_profiles` rows for the same `user_id`.  
**Fix:** Add `ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id);` in a new migration.

### M2 — DB: Missing indexes on high-traffic columns
**Fix:** Add a migration with:
```sql
CREATE INDEX IF NOT EXISTS idx_conditions_user_id ON conditions(user_id);
CREATE INDEX IF NOT EXISTS idx_conditions_msk ON conditions(msk_condition_id);
CREATE INDEX IF NOT EXISTS idx_protocols_user_id ON protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_protocol ON sessions(protocol_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pattern_obs_condition ON pattern_observations(condition_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id, status);
```

### M3 — Frontend: No video player
**File:** `web/src/components/exercise/ExercisePlayer.tsx`  
**Bug:** `video_url` is fetched and stored, but the render has no `<video>` tag or Cloudflare Stream embed. The video field is completely unused in the UI.  
**Fix:** When `exercise.video_url` is set, render a Cloudflare Stream embed (`<iframe src="https://iframe.cloudflarestream.com/{id}" ...>`) at 38% viewport height above the instruction text. Null → text-steps only (already implemented).

### M4 — Frontend: S07/S08 hardcoded copy is condition-agnostic
**Files:** `S07FirstInsight.tsx`, `S08FirstExercise.tsx`  
**Bug:** Copy is lumbar-specific ("ngồi 8 tiếng", "không phải nghỉ nhiều"). For frozen shoulder, plantar fasciitis, or tendinopathy it is clinically incorrect.  
**Fix:** Pass `condition.msk_condition_id` or a `condition_family` field and render condition-appropriate copy from a lookup map.

### M5 — API: Phase gate always `false`; no phase advancement
**Files:** `api/src/modules/protocol-engine/prompts/context-builder.ts`  
**Bug:** `phase_gate_blocked: false` is hardcoded. Phase advancement criteria in `phase_progress` are never evaluated. Conditions never move beyond Phase 0.  
**Fix:** Add a `POST /api/v1/conditions/:id/evaluate-phase` route (or evaluate on session complete) that reads `phase_progress.unlock_criteria`, checks actual session/checkin counts, and updates `conditions.phase_current` when criteria are met.

### M6 — Cross: Push subscription never registered
**Files:** `web/src/components/notifications/S30NotificationSetup.tsx`; `web/public/sw.js`  
**Bug:** Browser permission is requested but `pushManager.subscribe()` is never called. No push subscription object is ever sent to the backend. `sw.js` has no `push` event listener.  
**Fix:**
1. After `Notification.requestPermission()` → `'granted'`, call `pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey })`.
2. POST the resulting subscription JSON to a new `POST /api/v1/push-subscriptions` endpoint.
3. Add a `push` event listener in `sw.js` to show `self.registration.showNotification(...)`.

### M7 — API: Pattern detection engine missing
**Bug:** `pattern_observations` is read by the progress route but never written to from check-in data. Pattern cards are only populated from seed data.  
**Fix:** Add a background job or post-checkin hook that analyzes the last 14 days of check-ins per condition and inserts a `pattern_observations` row when a meaningful pattern is detected (e.g. consistent high-pain on Mon/Tue, consistent improvement after sessions).

### M8 — API: Missing `GET/PATCH /api/v1/conditions/:id`
**Bug:** No single-condition detail or update route. The multi-condition selector (S29) has no backend support.  
**Fix:** Add `GET /api/v1/conditions/:id` and `PATCH /api/v1/conditions/:id` (for condition-level settings like `is_active`).

### M9 — API: Request body schema validation missing on all routes
**Bug:** No Fastify `schema:` option on any route. Malformed payloads hit runtime code instead of being rejected at the boundary.  
**Fix:** Add `schema: { body: { type: 'object', properties: {...}, required: [...] } }` to all mutation routes.

### M10 — Frontend: "Làm bài" button clickable when session done today
**File:** `web/src/components/home/S14Home.tsx`  
**Bug:** When `sessionDoneToday === true`, the button has `opacity: 0.7` but no `disabled` prop and no click guard. Users can create duplicate sessions.  
**Fix:** Add a disabled state or confirm dialog: if `sessionDoneToday`, clicking shows "Đã xong hôm nay — làm lại?" confirmation.

### M11 — Frontend: Multi-condition users only see first condition in Home
**File:** `web/src/components/home/S14Home.tsx`  
**Bug:** `GET /api/v1/conditions` returns all conditions but data loading (protocol, trend, calendar) uses only `conditions[0].id`. The schedule endpoint (`/api/v1/schedule/daily`) is never called.  
**Fix:** Render a condition tab/selector at the top of S14; load data per selected condition.

---

## LOW (polish, compliance, minor issues)

### L1 — API: Rate-limit middleware is a no-op
**File:** `api/src/shared/middleware/rate-limit.ts` line 9  
**Bug:** `await reply;` awaits a non-Promise and does nothing.  
**Fix:** Implement actual rate limiting using an in-memory store or Redis; or remove the import and reference until implemented.

### L2 — API: Refresh token TTL is 30d (spec says 7d)
**File:** `api/src/shared/auth.config.ts`  
**Fix:** Change `refreshTokenTTL` from `'30d'` to `'7d'` and `maxAge` to `7 * 24 * 60 * 60`.

### L3 — API: `onboarding/intake` dead ternary
**File:** `api/src/modules/onboarding/onboarding.routes.ts` line 22  
**Bug:** `typeof slug === 'string' ? slug : slug` — both branches are identical.  
**Fix:** Remove the ternary; use `slug` directly.

### L4 — DB: Unused tables have no notes or deprecation plan
**Tables:** `red_flag_patterns`, `lifestyle_events`  
**Fix:** Either implement them (red-flag detection should run post check-in; lifestyle events from S05) or add SQL comments documenting they are reserved for a later phase.

### L5 — Frontend: `/login` and `/paywall` pages are static placeholders
**Files:** `web/src/pages/login.astro`, `web/src/pages/paywall.astro`  
**Fix:** Wire up the login React component (once H3/H4 auth routes exist); wire up the paywall component (once H11 billing is in place).

### L6 — Frontend: Missing deep-link pages
**Bug:** `notification_logs` records may include `deep_link: '/history/day/:date'` but no such page exists.  
**Fix:** Add `web/src/pages/history/[date].astro` that filters `HistoryView` to a specific date.

### L7 — API: `trigger_event` in check-in accepts any string
**File:** `api/src/modules/checkin/checkin.routes.ts`  
**Fix:** Validate against an enum: `['morning', 'midday', 'pre_sleep', 'post_exercise', 'manual']`.

---

## Recommended Build Order

| Sprint | Items | Outcome |
|--------|-------|---------|
| **Sprint 1 — Core Fixes** | C1, C2, H7 | Home, Check-in, Progress render real data |
| **Sprint 2 — Auth** | H1, H2, H3, H4 | Login, JWT refresh, anonymous upgrade |
| **Sprint 3 — AI Integration** | H5, H6 | Real symptom mapping; real check-in AI responses |
| **Sprint 4 — Onboarding Integrity** | H8, H9, H10, M4 | Correct assessment flow, condition-specific copy |
| **Sprint 5 — DB & Infra** | M1, M2, L1, L2, L7 | DB hardening, indexes, rate limiting |
| **Sprint 6 — Notifications** | M6 | End-to-end push notifications |
| **Sprint 7 — Billing** | H11, L5 | PayOS integration, 7-day trial |
| **Sprint 8 — Progress Engine** | M5, M7 | Phase advancement, pattern detection |
| **Sprint 9 — Polish** | M3, M9, M10, M11, L3–L6 | Video player, validation, multi-condition home |
