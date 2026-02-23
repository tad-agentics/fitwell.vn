# FitWell — Development To-Do

Derived from `docs/FitWell_Production_Plan.md`. Tracks the gap between the current UI prototype and a production-ready app.

**Current state:** 53 screen components, zero backend, all data hardcoded, 19/50 screens refactored to utility classes.

---

## Phase 0 — Foundation (Week 1–2)

### 0.1 Project Infrastructure

- [ ] Add `tsconfig.json` with strict mode, path alias `@/` → `src/`
- [ ] Move `react` and `react-dom` from `peerDependencies` to `dependencies`
- [ ] Install core deps: `@supabase/supabase-js`, `zustand`, `@tanstack/react-query`, `i18next`, `react-i18next`, `react-hook-form`, `zod`, `@hookform/resolvers`, `vite-plugin-pwa`
- [ ] Remove MUI deps: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- [ ] Migrate all MUI icon imports to `lucide-react` equivalents
- [ ] Remove unused deps: `react-dnd`, `react-dnd-html5-backend`, `react-popper`, `@popperjs/core`, `react-slick`, `react-responsive-masonry`
- [ ] Grep for and remove any `DM Mono` font references (replaced by IBM Plex Mono)
- [ ] Set up `.env` / `.env.local` with Supabase URL, anon key, VAPID keys, PayOS keys
- [ ] Reconcile shadcn/ui setup — verify existing `src/app/components/ui/` against shadcn primitives

### 0.2 Performance Architecture

- [ ] Delete barrel file `src/app/components/index.ts` — import screens directly in router
- [ ] Route-based code splitting with `React.lazy()` + `Suspense` for all screen components
- [ ] Dynamic import heavy libs: `recharts` (~200KB), heavy Radix components, `motion`
- [ ] Self-host fonts via `@fontsource/be-vietnam-pro`, `@fontsource/ibm-plex-mono`, `@fontsource/dm-serif-display`
- [ ] Conditionally load DM Serif Display (only used on 2 screens)
- [ ] Configure TanStack Query defaults:
  - Static content (`scenarios`, `micro_actions`): `staleTime: Infinity`
  - User data (`checkins`, `action_sessions`): `staleTime: 0` with background refetch
  - Profile data: `staleTime: 5 * 60 * 1000`
- [ ] Enforce Zustand selector discipline — never destructure entire store
- [ ] Remove unversioned `localStorage` keys; migrate to Zustand `persist` middleware

### 0.3 Design System Enforcement

- [ ] Reconcile Tailwind config with Design System Section 09 tokens (colors, fonts, spacing, radius)
- [ ] Verify `theme.css` CSS custom properties match Tailwind config
- [ ] Audit motion rules: CSS-only transitions, no spring/bounce/scale — see Section 08 table
- [ ] Configure `motion` (framer-motion) to use only `tween` type with exact durations from DS, or replace with CSS transitions entirely
- [ ] Create `.cursor/rules/design-system.mdc` documenting button types, card specs, nav specs, margins, radius rules

### 0.4 Supabase Setup

- [ ] Create Supabase project (Singapore region)
- [ ] Write migration SQL for 13 tables:
  - `profiles` (with `primary_conditions[]`, notification prefs, free-tier counters)
  - `households`
  - `biomarkers` (9 marker types)
  - `scenarios` (with v2.0 renames: `biomarker_tags` → `condition_tags`, `alcohol_strategy` → `meal_strategy`, add `desk_breaks` jsonb, `read_time_minutes`)
  - `scenario_sessions`
  - `checkins` (4 trigger types, v2.0: `back_pain_score`, `event_type` enum, `afternoon_state` add `back_tight`)
  - `micro_actions` (rename `biomarker_tags` → `condition_tags`)
  - `action_sessions`
  - `recovery_protocols` (add `event_type` enum)
  - `push_subscriptions`
  - `notification_governor`
  - `subscriptions`
  - `weekly_briefs`
- [ ] Add audit columns (`day_of_week`, `hour_of_day`) on `checkins`, `scenario_sessions`, `action_sessions`
- [ ] Add CHECK constraints: `scenarios.risk_level` 1–5, `recovery_protocols.day` 1–3, `weekly_briefs.insight_tier` 1–4
- [ ] Enable RLS on all tables; write user-scoped policies
- [ ] Create `updated_at` trigger function
- [ ] Seed `scenarios` with 20 playbooks (vi + en) — per manifest in production plan
- [ ] Seed `micro_actions` with 24 actions (vi + en, condition_tags, context_tags) — per manifest
- [ ] Create Supabase Storage buckets: `exercise-videos` (public read), `video-thumbnails` (public read)

### 0.5 Frontend Foundation

- [ ] Create `src/lib/supabase.ts` — Supabase client singleton
- [ ] Create `src/lib/i18n.ts` — i18next config with `vi`/`en`, namespace-based lazy loading
- [ ] Create locale files: `src/locales/{vi,en}/{common,auth,onboarding,checkin,scenario,action,brief,profile,payment,household}.json`
- [ ] Create Zustand stores in `src/store/`:
  - `authStore.ts` (session, profile)
  - `checkinStore.ts` (current check-in state)
  - `protocolStore.ts` (active recovery)
  - `uiStore.ts` (navigation, bottom nav state)
- [ ] Create TypeScript types in `src/types/` matching DB schema
- [ ] Create `src/hooks/useSupabaseQuery.ts` — TanStack Query + Supabase wrapper
- [ ] Replace custom `useState` router with React Router v7 (21 routes per plan)
- [ ] Implement bottom nav visibility rules (hide on auth, onboarding, timer, check-in, A2HS, payment)
- [ ] Implement "Check-in" bottom nav tab with context-aware routing (time-of-day + trigger logic)
- [ ] Add auth guard (protected routes)
- [ ] Add onboarding guard (redirect if `onboarding_complete === false`)

### 0.6 PWA & Deploy

- [ ] Configure `vite-plugin-pwa` with Workbox (replace manual `sw.js`)
  - Precache static assets; runtime cache for thumbnails; skip full videos
  - `skipWaiting` + `clientsClaim` for beta
- [ ] Verify `manifest.json` fields (theme_color `#041E3A`, start_url `/home`, orientation portrait)
- [ ] Generate PWA icons from `public/icon-source.svg` (192×192, 512×512, maskable)
- [ ] Set up Vercel project with custom domain
- [ ] Configure Vercel environment variables
- [ ] CI pipeline: `pnpm build` on push to main

---

## Phase 1 — i18n + Auth + Onboarding (Week 3–5)

### 1.1 i18n Extraction

- [ ] Extract all hardcoded Vietnamese strings from 50+ screens into namespaced i18n JSON files
- [ ] Create English translations for all screens
- [ ] Wire i18n namespace lazy loading per route group
- [ ] Test language switch end-to-end
- [ ] Establish rule: no new hardcoded strings from this point forward

### 1.2 Authentication

- [ ] Implement Supabase Auth: email/password registration (`AuthRegisterScreen`)
- [ ] Implement magic link login (`AuthLoginMagicLinkScreen`)
- [ ] Magic link sent confirmation (`AuthMagicLinkSentScreen`)
- [ ] Create `profiles` row on registration (trigger or client-side)
- [ ] Wire auth state to Zustand `authStore`
- [ ] Implement session persistence and auto-refresh

### 1.3 Onboarding Flow (4 Steps + Aha Intercept)

- [ ] **Step 1 — Language Selection** (`OnboardingLanguageScreen`): write `profiles.language`, switch i18next locale
- [ ] **Step 2a — Condition Declaration** (`OnboardingConditionScreen`) — **NEW v2.0**: multi-select gout/cholesterol/back pain/unsure → `profiles.primary_conditions[]`
- [ ] **Step 2b — Biomarker Input** (`OnboardingBiomarkerScreen`): insert rows to `biomarkers`, marker dropdown sorted by conditions, skip option
- [ ] **Aha Intercept** (`OnboardingAhaScreen`): 4 variants by condition
- [ ] **Step 3 — Life Pattern** (`OnboardingLifePatternScreen`) — **REDESIGNED**: 5 sub-screens (desk hours, eating out, back/neck pain freq [NEW], highest-risk env [NEW], account usage). If partner → branch to /household/invite
- [ ] **Step 4 — Activation Event** (`OnboardingActivationScreen`) — **REDESIGNED**: 4 options (was 3, add "Ngày làm việc dày"). Schedule pre-game push. Set `onboarding_complete = true`

### 1.4 Profile & Settings

- [ ] Wire `ProfileScreen` to Supabase: view/edit biomarkers, conditions, language toggle
- [ ] Wire `ProfileSettingsScreen`: notification preferences → `profiles.notification_*` columns
- [ ] A2HS prompt flow (`A2HSPromptScreen`, `A2HSInstructionScreen`)

### 1.5 Home Screen State Machine

- [ ] Implement 7 priority states (evaluated in order):
  1. Sunday Brief Takeover
  2. Monday Brief Intercept (week 4+)
  3. Active Recovery Protocol
  4. Pre-Situation Countdown (< 5hr before event)
  5. Pre-Sleep Wind-Down (>= 21:00)
  6. Midday Desk (13:00–16:00 weekday)
  7. Clean Day (default)
- [ ] Parallel data fetching via `Promise.all()` (profile, active protocol, scheduled event, latest brief)
- [ ] Wire 7 home variant components to real data

### 1.6 Activation Tracking

- [ ] Create `analytics_events` table (user_id, event_name, timestamp)
- [ ] Track 5 funnel events: `onboarding_completed`, `first_checkin_completed`, `first_action_completed`, `first_scenario_opened`, `first_recovery_started`

---

## Phase 2 — Scenario Playbooks (Week 6–7)

### 2.1 Scenario Search

- [ ] Wire `ScenarioSearchScreen` to Supabase with TanStack Query (`staleTime: Infinity`)
- [ ] Implement text search via `.ilike()` or full-text search
- [ ] 7 category filter chips
- [ ] Results ranked by `condition_tags` match to user's `primary_conditions`
- [ ] Show risk level, condition tags, estimated read time per result
- [ ] 4 entry points: home search bar, bottom nav tab, scheduled push deep link, aha intercept link

### 2.2 Scenario Playbook

- [ ] Wire `ScenarioPlaybookScreen` to Supabase (fetch vi/en based on locale)
- [ ] **Food/Drink variant** (S16 — redesigned): full-bleed header image, dark overlay, "Tránh" section with red-tinted background, "Vào rồi" CTA → log `scenario_sessions` → arm recovery
- [ ] **Desk/Stress variant** (N4 — new): navy solid header, break protocol timeline from `scenarios.desk_breaks` JSON. Wire existing `DeskStressPlaybookScreen.tsx`
- [ ] Arm recovery protocol for next morning where applicable

### 2.3 Event Scheduling

- [ ] Store event time + scenario_id on schedule
- [ ] Pre-game push notification scheduled 2hr before

---

## Phase 3 — Check-Ins + Protocol Engine + Micro-Actions (Week 8–12)

### 3.1 Check-In Flows (Optimistic Mutations)

- [ ] **Morning Baseline** (`MorningCheckInFlow`): Q1 sleep quality, Q2 body feeling (4 options, updated), Q3 back pain score (conditional, **NEW** — wire existing `BackPainScoreScreen.tsx`). Optimistic write to `checkins`
- [ ] **Post-Event** (`PostEventCheckInFlow`): Q1 intensity (redesigned), Q2 event type (6 options, **NEW** — wire existing `PostEventTypeSelector.tsx`). Write `checkins.event_type`, trigger recovery protocol
- [ ] **Mid-Day Desk** (`CheckInFlow`): 4 afternoon states including "Lưng tức" priority override
- [ ] **Pre-Sleep** (`PreSleepWindDownScreen`): ready / +20 min, max 2 attempts

### 3.2 Condition Weighting Engine

- [ ] Implement `src/lib/protocol.ts`:
  - `selectActionCategories(input)` — derives categories from check-in + conditions
  - `deriveBaseCategories()` — check-in → action categories
  - `applyConditionWeight()` — boost categories matching user's conditions
  - Cap at 2 categories, 3 actions per session
- [ ] Implement `src/hooks/useConditionWeight.ts`

### 3.3 Context Selector

- [ ] Wire `ContextSelectorScreen`: office / private / transit → filter by `context_tags`

### 3.4 Micro-Action Timer

- [ ] Connect `MicroActionTimerScreen` to real action data from Supabase
- [ ] Video playback from Supabase Storage URLs
- [ ] Offline fallback: text-only timer (partially done)
- [ ] Timer optimization: `useRef` for countdown tick, `setState` only at 1s intervals
- [ ] On complete: write `action_sessions` record
- [ ] Wire `MicroActionFlow`: sequential flow through selected actions

### 3.5 Recovery Protocol

- [ ] Wire `RecoveryProtocolActiveScreen` to Supabase
- [ ] Create `recovery_protocols` row on heavy/medium post-event
- [ ] Variable duration per event_type × intensity matrix
- [ ] 4 variant eyebrows: POST-EVENT RECOVERY, SPINAL RECOVERY, CORTISOL RECOVERY, METABOLIC RECOVERY
- [ ] Day-by-day action cards with video thumbnails + states (current/upcoming/completed/skipped)
- [ ] Paywall at Day 2 for free users (`RecoveryProtocolPaywallScreen`)

### 3.6 Action Library

- [ ] Wire `ActionLibraryScreen` to Supabase (`staleTime: Infinity`)
- [ ] 8 category filter chips + context filter (office/private/transit)
- [ ] 2-column video thumbnail grid with `content-visibility: auto` on off-screen cards
- [ ] Wire `ActionLibraryCategoryScreen`: category detail view

### 3.7 Video Content

- [ ] Produce and upload 24 exercise videos to Supabase Storage (MP4 H.264, < 3MB each, 720×1280, silent, no faces, warm neutral)
- [ ] Upload 24 thumbnail JPEGs (~15KB each)
- [ ] Populate `micro_actions.video_url`, `.video_url_webm`, `.video_thumb_url`
- [ ] Implement `src/hooks/useVideoPlayer.ts`: play/pause/loop, offline detection, rep marker sync

---

## Phase 4 — Notifications + Governor (Week 13–14)

### 4.1 Web Push Setup

- [ ] Generate VAPID key pair
- [ ] Client-side push subscription flow (prompt permission, store subscription)
- [ ] Write `push_subscriptions` row to Supabase
- [ ] Service worker `notificationclick` handler → deep link to correct screen

### 4.2 Governor System

- [ ] Create `notification_governor` row per user
- [ ] Implement `src/lib/governor.ts`: `checkGovernor()`, `recordPushSent()`, `recordPushOpened()`
- [ ] Governor rules: max 3/day, auto-reduce after 3 consecutive ignored, weekly_only after 5
- [ ] Edge Function `dailyGovernorReset()` cron

### 4.3 Edge Functions (7 Notification Functions)

- [ ] `notify-morning-baseline` — per user time (default 07:00) → /checkin/morning
- [ ] `notify-midday-desk` — weekdays 14:00 → /checkin/midday
- [ ] `notify-pre-sleep` — per user pref (default 21:30) → /checkin/presleep
- [ ] `notify-pre-game` — 2hr before event (exempt from governor) → /scenario/:id
- [ ] `notify-recovery-day2` — 07:00 day after event → /home
- [ ] `notify-recovery-day3` — 07:00 two days after → /home
- [ ] `notify-weekly-brief` — Sunday 20:00 (exempt from governor) → /brief

---

## Phase 5 — Weekly Intelligence Brief (Week 15–17)

### 5.1 Brief Generation

- [ ] Edge Function cron (Sunday 20:00): 4-tier insight engine
  - Tier 1 (weeks 1–4): pattern detection (high-risk events, back pain, desk patterns)
  - Tier 2 (weeks 5–8): cause correlation (desk→pain, stress→condition)
  - Tier 3 (weeks 9–12): intervention efficacy (action→next-morning improvement)
  - Tier 4 (weeks 13+): predictive weekly risk scoring
- [ ] Port 8 SQL queries from TechUX Spec Appendix A into the Edge Function
- [ ] Write generated brief to `weekly_briefs` table (JSONB with headline, risk_calendar, patterns, comparison, ctas)
- [ ] Define TypeScript types in `src/types/brief.ts`

### 5.2 Brief Display

- [ ] Wire `WeeklyBriefScreen` to Supabase via TanStack Query
- [ ] Dynamic import `recharts` only on this screen
- [ ] Tappable risk calendar rows with condition-specific explanations
- [ ] Pattern insight cards + 4-week comparison bars
- [ ] One-tap CTAs (e.g., "Set reminder for Thursday")

### 5.3 Brief Ritual

- [ ] Sunday takeover: home state 1 — full brief replaces home, must mark read to proceed
- [ ] Monday intercept (blocking gate, week 4+): `/brief/intercept` route with "XEM TÓM TẮT" / "Bỏ qua"
- [ ] Unread amber dot on "Tuần này" bottom nav tab (Sun + Mon)
- [ ] Increment `profiles.brief_weeks_completed` on read

---

## Phase 6 — Payment + Subscription Gating (Week 18–19)

### 6.1 PayOS Integration

- [ ] Implement `src/lib/payos.ts` — PayOS SDK client
- [ ] Edge Function `create-payment` — generate PayOS checkout URL
- [ ] Edge Function `payos-webhook` — handle payment confirmation, write `subscriptions` row

### 6.2 Feature Gating

- [ ] Implement `src/hooks/useSubscription.ts` checking `subscriptions.status`
- [ ] Gating rules:
  - Morning check-ins: always free
  - Scenario playbooks: 1 free use (`profiles.free_scenario_uses`)
  - Post-event check-ins: 2 free uses (`profiles.free_post_event_checkins_used`)
  - Day 2–3 recovery: gated
  - Midday + pre-sleep check-ins: gated
  - Action Library play: browse-only on free
  - Weekly brief: 1 free read
  - Pattern insights (90-day): paid only
  - Home Environment Module: household plan only
- [ ] Free-tier counter logic in `useSubscription.ts` with RLS backup
- [ ] Edge Function cron `check-subscription-expiry`: daily at 00:00 UTC

### 6.3 Language-Aware Content

- [ ] Implement `getLocaleContent(row, locale)` helper for all localized DB content

### 6.4 Payment Screens

- [ ] Wire `PricingScreen` to real PayOS checkout (490K / 1,490K / 2,490K VND)
- [ ] Wire `PaymentSuccessScreen` to verify subscription status
- [ ] Wire `PaymentCancelScreen` with retry flow

---

## Phase 7 — Household Plan (Week 20–21)

### 7.1 Household Invite Flow

- [ ] Edge Function: generate signed invite link (72hr expiry)
- [ ] Wire `HouseholdInviteScreen`: invite URL + QR code + copy link
- [ ] Partner registration flow: click link → register/login → link to `households` row

### 7.2 Partner View

- [ ] Wire `HouseholdPartnerHomeScreen`:
  - Condition-specific stocking guidance (gout: low-purine; cholesterol: omega-3; back pain: anti-inflammatory)
  - Shared risk calendar view
- [ ] RLS privacy boundary (partner cannot see check-in details)

---

## Phase 8 — Polish + Launch (Week 22–24)

### 8.1 Screen Refactoring

- [ ] 4 NEW screens (N1–N4): polish pass — utility classes, color vars, Frame ID comments
- [ ] 4 REDESIGNED screens (S4, S5, S9, S16): layout rework
- [ ] 12 UPDATED screens: content/option additions, migrate inline styles to `fw-*`, normalize colors
- [ ] 30 UNCHANGED screens: migrate remaining inline styles to utility classes (19/30 partially done)
- [ ] Color normalization pass: replace hardcoded hex across all screens (`#041E3A` → `var(--navy)`, etc.)

### 8.2 Design Compliance Audit

- [ ] Verify all Tailwind tokens match Section 09
- [ ] Verify 6 button patterns match Section 06
- [ ] Verify check-in option cards: 16px padding, 12px gap, 1px border, 120ms animation
- [ ] Bottom nav: 48px tap targets, 1px top border, unread dot (6px amber)
- [ ] Eyebrow hierarchy: IBM Plex Mono uppercase above Be Vietnam Pro headline everywhere
- [ ] Screen edge margins: 20px (grep for violations)
- [ ] Border radius: 0px/4px/2px/8px only (grep for `rounded-lg`/`rounded-xl`)
- [ ] No shadows anywhere (grep for `shadow`, `box-shadow`)
- [ ] Contrast audit: no `#9D9FA3` on `#F5F5F5` for body copy
- [ ] Motion audit: CSS-only, correct durations/easings per Section 08

### 8.3 Error States & Loading

- [ ] Loading skeletons for all data-fetching screens (as `<Suspense fallback>`)
- [ ] Error boundaries with retry
- [ ] Empty states for zero-data scenarios
- [ ] Offline indicators and graceful degradation

### 8.4 Orphan Screen Triage

- [ ] `ProgressScreen.tsx` — repurpose as /profile sub-tab or delete
- [ ] `BloodTestScreen.tsx` — embed under /profile or delete
- [ ] `DashboardScreen.tsx` — delete (superseded by HomeScreen state machine)
- [ ] `RecoveryPlanScreen.tsx` — merge into RecoveryProtocolActiveScreen or delete
- [ ] `CheckInQuestionScreen.tsx` — delete (superseded by specific check-in flows)
- [ ] `HomeMiddayScreen.tsx` — review for duplication
- [ ] `HouseholdInviteStateScreen.tsx` — merge into HouseholdInviteScreen or keep
- [ ] `ActionCompletionScreen.tsx` — review if embedded in MicroActionFlow
- [ ] `TimerCompleteScreen.tsx` — review for duplication with M9
- [ ] `MondayBriefInterceptScreen.tsx` — delete (use `HomeMondayBriefInterceptScreen.tsx`)

### 8.5 Quality Assurance

- [ ] E2E QA on iOS Safari 16.4+ and Android Chrome 80+
- [ ] Vietnamese copy review (native speaker)
- [ ] IBM Plex Mono diacritic verification (uppercase Vietnamese)
- [ ] Performance audit: Lighthouse PWA >= 90, FCP < 1.5s, TTI < 3s on 4G
- [ ] Bundle analysis: no single route chunk > 50KB gzipped
- [ ] All 24 videos < 3MB, load < 3s on 4G, silent, 30fps, no faces
- [ ] Governor simulation testing (all 7 notification functions)
- [ ] Brief ritual QA: Sunday takeover, Monday intercept, unread dot
- [ ] Free tier → paid conversion flow QA
- [ ] Non-drinker user path QA (back_pain only, no post-event triggers, morning+midday loop)

### 8.6 Beta Launch

- [ ] Deploy to Vercel with custom domain
- [ ] Soft launch to 50 beta users (include non-drinker cohort)
- [ ] Validate non-drinker path: onboarding → morning check-in → midday trigger = complete loop

---

## Deferred (Post-Launch)

Not in scope for MVP:

- Recovery Box Add-On (physical product)
- Wearable Data Translation (Apple Health / Google Fit)
- Corporate Plan (admin portal)
- Supabase → Cloudflare CDN migration (evaluate at >1000 MAU)
- 90-day Personal Insight standalone card
- Clinical credibility copy (advisor names)
- GTM landing page variants

---

## Non-Functional Targets

| Metric | Target |
|---|---|
| Lighthouse PWA | >= 90 |
| First Contentful Paint | < 1.5s on 4G |
| Time to Interactive | < 3s on 4G |
| iOS Safari | 16.4+ |
| Android Chrome | 80+ |
| WCAG | AA (contrast, 44px+ tap targets, 48px bottom nav) |
| Data residency | Supabase Singapore |
| Video file size | < 3MB each (~72MB total) |
| Notification delivery | >= 90% |
| Route chunk size | < 50KB gzipped |
| Font payload | < 130KB total (self-hosted) |
