# FitWell Tech Spec v1.5.2 — Consolidated
**Date:** March 2026 | **Status:** Single source of truth — supersedes v1.2, v1.3 patch, v1.4 patch, v1.4.1 patch, v1.5
**Philosophy:** Code đơn giản. Interface rõ ràng. Hệ thống dễ tiến hóa.
**Scope:** Web MVP — Astro + React + Tailwind CSS frontend, Node.js + Fastify backend — Vietnam-optimized, anonymous-first, MSK-aware, emotional-design-compliant.

---

## Version History (tóm tắt)

| Version | Scope |
|---|---|
| v1.2 | Base spec: auth, AI prompt, protocol engine, check-in, sessions, notifications, billing |
| v1.3 patch | MSK condition catalog, pain track bifurcation, phase gate, lifestyle trigger, critical timing |
| v1.4 patch | Magic link removal, web push infra, PayOS 2-path, symptom mapping, assessment fork, safety warnings, frozen shoulder |
| v1.4.1 patch | BUG-1 payment status, BUG-2 dismiss tracking, GAP-1–4, SEC-1–3, UTIL-1–2, MIN-1–2 |
| v1.5 | Consolidated — single source of truth across v1.2–v1.4.1 |
| **v1.5.2** | **G26: `tendon_working_signal` response_type + `adaptation_signal` column on conditions. G27: Adaptation Signal Engine (section 6.8) — `reduce_intensity`, `post_flare_recovery`, `positive_trajectory`. MSK-7 rule in system prompt. OI-1 + OI-3 resolved.** |

---

# PHẦN 1 — SYSTEM ARCHITECTURE

## 1.1 Tech Stack

**Nguyên tắc chọn stack:** (1) Team quen → (2) Cộng đồng lớn → (3) Managed service tránh DevOps → (4) Scale được khi cần → (5) User VN dùng tiền qua đó hàng ngày.

**Lý do chọn Web MVP trước Native App:** Funnel `Ad → App Store → Download → Open` có 2 drop-off lớn trước khi user thấy value. Web MVP validate CAC thực tế, onboarding conversion, và Day 7 paywall conversion trước khi đầu tư native app.

| Layer | Công nghệ | Lý do |
|---|---|---|
| **Frontend** | Astro 4.x + React 18 + TypeScript | Island architecture — React hydrate đúng chỗ. Bundle nhỏ, load nhanh 4G VN. |
| **Styling** | Tailwind CSS 3.x | Utility-first, không runtime CSS. Bundle CSS < 15KB. |
| **State** | Zustand 4.x | Cross-page state (Astro pages = separate HTML documents). accessToken in-memory, KHÔNG persist. |
| **Routing** | Astro file-based | `/onboarding`, `/home`, `/checkin`, `/progress`, `/paywall` |
| **Backend** | Node.js + Fastify | 3× nhanh hơn Express, TypeScript native, schema validation built-in. |
| **Database** | PostgreSQL via Supabase (SGP) | Managed Postgres. Region Singapore ~35ms. Free tier 500MB đủ v1. |
| **AI** | Claude Haiku (speed) + Sonnet (complexity) | Haiku ~250ms latency Singapore. Sonnet cho protocol adaptation. |
| **Auth** | Supabase Auth (Google OAuth redirect only) + custom JWT | Anonymous session + Google OAuth + Email/Password. |
| **Video** | Cloudflare Stream | PoP tại HN + HCM. $1/1000 views. Adaptive bitrate. |
| **Frontend hosting** | Vercel | Git push → deploy. Edge CDN. `astro build` → static output. |
| **Backend hosting** | DigitalOcean Singapore SGP1 | 28–40ms đến HN/HCM. $12/mo. |
| **Payment** | PayOS | VietQR — mọi banking app quét được. 0 setup fee. 1.5–2%/transaction. |
| **SMS** | ESMS.vn | Optional 2FA only. 98% delivery rate VN. |
| **Email** | Resend | Retention sequence + welcome + password reset. Free 3,000/mo. |
| **Analytics** | PostHog cloud | Funnel analysis, session replay. Free tier đủ MVP. |

### Astro Island Architecture

```
Astro Page (.astro)        → Zero JS, static HTML, server-rendered
  └── React Island         → client:load   (interactive ngay khi load)
  └── React Island         → client:visible (lazy hydrate khi scroll vào viewport)
  └── Static content       → Không hydrate, pure HTML

Phân loại:
  CheckinForm.tsx          → client:load
  ExercisePlayer.tsx       → client:load
  InAppBanner.tsx          → client:load  (mọi trang — notification fallback)
  PaywallCard.tsx          → client:load
  PainChart.tsx            → client:visible
  ConsistencyGrid.tsx      → client:visible
  NavBar.astro             → Static HTML, không hydrate
```

### Dependency Map

```
Browser (Astro + React)
    │
    ├──► Supabase Auth ──────────────── [Google OAuth redirect only — không dùng anon key]
    │
    ├──► API Server (Fastify / DO SGP1) [~35ms đến HN/HCM]
    │         ├──► Supabase PostgreSQL  [service_role key — toàn bộ DB access qua đây]
    │         ├──► Claude API           [Protocol Engine + Check-in AI]
    │         ├──► Cloudflare Stream    [Video URLs]
    │         ├──► PayOS               [Payment links + webhooks]
    │         ├──► ESMS.vn             [SMS — optional 2FA only]
    │         └──► Resend              [Email: welcome, retention, password reset]
    │
    ├──► Vercel Edge ────────────────── [Frontend hosting + CDN]
    │
    └──► PostHog ────────────────────── [Analytics + funnel]
```

**Quy tắc cứng:** Supabase chỉ làm Auth redirect + DB. Toàn bộ business logic trong API Server. Không để logic trong Supabase Edge Functions.

## 1.1.1 — Supabase Security Posture

**RLS (Row Level Security): DISABLED trên tất cả tables.**

Rationale:
- Mọi DB access đi qua Fastify API server dùng `service_role` key
- `service_role` key lưu trong server-side env variable — KHÔNG expose ra frontend
- `anon` key: KHÔNG DÙNG — không có trong frontend bundle
- `@supabase/supabase-js` trên frontend: chỉ dùng cho Google OAuth redirect, không access DB trực tiếp
- Row ownership enforced bởi Fastify `auth-guard` middleware + explicit `user_id` checks

Security boundary:
```
Browser → HTTPS → Fastify (auth-guard) → service_role → Supabase DB
Browser không có direct Supabase DB access path
```

Environment variables:
```
Server-side (DigitalOcean — KHÔNG trong Vercel):
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  JWT_SECRET                    (min 32 chars random)
  VAPID_PUBLIC_KEY
  VAPID_PRIVATE_KEY
  PAYOS_WEBHOOK_SECRET
  RESEND_API_KEY

Frontend (Vercel env — safe to expose):
  PUBLIC_API_URL                (https://api.fitwell.vn)
  PUBLIC_SUPABASE_URL           (cho Google OAuth redirect URI only)
```

Audit checklist trước production deploy:
```
□ Supabase dashboard: RLS disabled confirmed trên tất cả tables
□ SUPABASE_SERVICE_ROLE_KEY: không có trong Vercel env vars
□ grep codebase: 'supabase.from(' → 0 results ngoài auth module
□ VAPID keys generated: npx web-push generate-vapid-keys
□ PAYOS_WEBHOOK_SECRET: lấy từ PayOS dashboard
```

---

## 1.2 Core Data Schema

### Nguyên tắc thiết kế
- **Anonymous-first:** `users` có thể là anonymous (UUID only) trước khi claimed
- **Tách User khỏi Profile:** `users` = auth data, `user_profiles` = health context → PDPA compliant
- **Protocol immutable (append-only):** Không UPDATE, không DELETE protocol records — chỉ tạo mới
- **Soft delete everywhere:** `deleted_at` thay vì hard delete
- **Denormalize thông minh:** `checkins.pain_score` lưu integer thẳng

```sql
-- ════════════════════════════════════════════════
-- USERS & AUTH
-- ════════════════════════════════════════════════
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id    UUID UNIQUE,
  is_anonymous    BOOLEAN DEFAULT TRUE,
  phone           VARCHAR(15) UNIQUE,           -- optional
  email           VARCHAR(255) UNIQUE,
  password_hash   VARCHAR(72),                  -- bcrypt output, null for SSO-only
  apple_sub       VARCHAR(255) UNIQUE,          -- NATIVE APP ONLY — null in Web MVP
  google_sub      VARCHAR(255) UNIQUE,
  claimed_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
COMMENT ON COLUMN users.apple_sub IS 'Reserved for native app (iOS App Store). NULL in Web MVP.';

CREATE TABLE user_profiles (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES users(id),
  age_range                VARCHAR(10),
  occupation               VARCHAR(50),          -- 'office'|'manual'|'mixed'
  onboarding_completed_at  TIMESTAMPTZ,          -- base date cho day_number
  ergonomics_setup_done    BOOLEAN DEFAULT FALSE,
  ergonomics_setup_at      TIMESTAMPTZ,
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  token       VARCHAR(64) UNIQUE NOT NULL,       -- UUID v4, stored hashed
  expires_at  TIMESTAMPTZ NOT NULL,              -- NOW() + INTERVAL '1 hour'
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_pwd_reset_token ON password_reset_tokens (token) WHERE used_at IS NULL;

-- ════════════════════════════════════════════════
-- MSK CONDITIONS CATALOG (seed data — read-only)
-- ════════════════════════════════════════════════
CREATE TABLE msk_conditions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  VARCHAR(50) UNIQUE NOT NULL,
  name_vi               VARCHAR(100) NOT NULL,
  name_en               VARCHAR(100),
  body_region           VARCHAR(20) NOT NULL,
  pain_track            VARCHAR(10) NOT NULL,      -- 'joint' | 'tendon'
  phase_count           SMALLINT DEFAULT 2,
  timing_critical       BOOLEAN DEFAULT FALSE,
  timing_slot           VARCHAR(10),               -- '0655'|'desk_45m'|null
  assessment_required   BOOLEAN DEFAULT FALSE,
  assessment_test_slug  VARCHAR(50),               -- 'prone_press_up'|'thomas_test'|'slump_test'
  safety_warning_vi     TEXT,                      -- non-null = show SMSK08 (unconditional)
  red_flag_ids          TEXT[],
  insight_hook_vi       TEXT,                      -- counterintuitive hook + key symptom signal
  contraindication_notes TEXT,
  is_active             BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════
-- USER CONDITIONS (per-user MSK tracking)
-- ════════════════════════════════════════════════
CREATE TABLE conditions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id),
  msk_condition_id     UUID REFERENCES msk_conditions(id),
  body_regions         TEXT[],
  trigger_pattern      VARCHAR(30),                -- 'morning'|'after_sitting'|'movement'|'end_of_day'|'constant'
  current_treatments   TEXT[],                     -- ['endure','massage','medication','gym','physio']
  primary_region       VARCHAR(20),
  pain_track           VARCHAR(10),                -- denorm from msk_conditions (hot path)
  display_name_vi      VARCHAR(100),
  phase_current        SMALLINT DEFAULT 1,
  assessment_result    VARCHAR(20),                -- null|'protocol_a'|'protocol_b'
  assessment_completed BOOLEAN DEFAULT FALSE,
  assessment_done_at   TIMESTAMPTZ,
  is_active            BOOLEAN DEFAULT TRUE,
  adaptation_signal    VARCHAR(30) DEFAULT 'none', -- 'none'|'reduce_intensity'|'post_flare_recovery'|'positive_trajectory'|'plateau'
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════
-- PHASE GATE
-- ════════════════════════════════════════════════
CREATE TABLE phase_progress (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id),
  condition_id        UUID NOT NULL REFERENCES conditions(id),
  phase_number        SMALLINT NOT NULL,
  status              VARCHAR(15) DEFAULT 'active',  -- 'active'|'completed'|'locked'
  unlock_criteria     JSONB,
  -- Standard: { pain_threshold: 2, sustained_days: 5 }
  -- Tendon:   { pain_threshold: 2, sustained_days: 7 }
  -- Frozen:   { pain_threshold: 3, sustained_days: 14,
  --             prohibit_movement_types: ['stretch','end_range_passive'],
  --             prohibit_reason_vi: '...' }
  phase_started_at    TIMESTAMPTZ DEFAULT NOW(),
  phase_completed_at  TIMESTAMPTZ,
  unlock_blocked_reason TEXT,
  UNIQUE (user_id, condition_id, phase_number)
);
CREATE INDEX idx_phase_progress_user ON phase_progress (user_id, condition_id, phase_number);

-- ════════════════════════════════════════════════
-- PROTOCOLS (immutable, append-only)
-- ════════════════════════════════════════════════
CREATE TABLE protocols (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id    UUID NOT NULL REFERENCES conditions(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  exercises       JSONB NOT NULL,     -- [{exercise_id, order, duration_sec, reps, notes}]
  ai_reasoning    TEXT,
  ai_model        VARCHAR(30),
  generation_type VARCHAR(20),        -- 'rule_based'|'ai_generated'|'ai_adapted'
  total_duration  INTEGER,            -- seconds
  difficulty      VARCHAR(10),
  version         INTEGER DEFAULT 1,
  is_current      BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════
-- EXERCISE LIBRARY
-- ════════════════════════════════════════════════
CREATE TABLE exercises (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(50) UNIQUE NOT NULL,
  name_vi          VARCHAR(100) NOT NULL,
  body_region      VARCHAR(20) NOT NULL,
  trigger_patterns TEXT[],
  duration_sec     INTEGER NOT NULL,
  video_url        TEXT,
  thumbnail_url    TEXT,
  steps            JSONB NOT NULL,    -- [{order, instruction_vi, duration_sec}] — offline fallback
  location         VARCHAR(30),       -- 'bed'|'desk'|'floor'|'chair'
  contraindications TEXT[],
  clinical_tags    TEXT[],
  -- REQUIRED tags: movement type: stretch|isometric|eccentric|pendulum|active_rom|passive_rom|end_range|strengthening
  -- REQUIRED tags: load: low_load|moderate_load|high_load
  -- Used by filterProhibitedExercises() — every exercise MUST have ≥1 movement type tag
  is_published     BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════
-- SESSIONS
-- ════════════════════════════════════════════════
CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  protocol_id     UUID NOT NULL REFERENCES protocols(id),
  status          VARCHAR(15) DEFAULT 'in_progress',  -- 'in_progress'|'completed'|'exited'
  current_step    INTEGER DEFAULT 0,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  completion_pct  INTEGER DEFAULT 0,
  skipped_steps   INTEGER[] DEFAULT '{}',
  feedback        VARCHAR(10),        -- 'better'|'same'|'worse'
  source          VARCHAR(20)         -- 'notification'|'manual'|'checkin'
);

-- ════════════════════════════════════════════════
-- CHECK-INS
-- ════════════════════════════════════════════════
CREATE TABLE checkins (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id),
  condition_id          UUID NOT NULL REFERENCES conditions(id),
  pain_score            SMALLINT NOT NULL CHECK (pain_score BETWEEN 1 AND 5),
  post_session_feedback VARCHAR(10),
  trigger_event         VARCHAR(30),
  free_text             TEXT,                    -- user's optional free-text input (S12b)
  ai_response           JSONB,                   -- full structured AI response
  protocol_id           UUID REFERENCES protocols(id),
  show_exercise_card    BOOLEAN DEFAULT TRUE,    -- false when pain_score = 5
  response_type         VARCHAR(30),             -- 'standard'|'pain5'|'re_engagement'|'skeptical'|'plateau'|'pattern'|'flare_up'|'tendon_working_signal'
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, condition_id, DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh'))
);

-- ════════════════════════════════════════════════
-- PATTERN OBSERVATIONS
-- ════════════════════════════════════════════════
CREATE TABLE pattern_observations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  condition_id    UUID REFERENCES conditions(id),
  pattern_type    VARCHAR(30) NOT NULL,
  description_vi  TEXT NOT NULL,
  trigger_label   VARCHAR(50),
  confidence      SMALLINT DEFAULT 0,            -- 0–100
  first_observed  TIMESTAMPTZ DEFAULT NOW(),
  last_confirmed  TIMESTAMPTZ DEFAULT NOW(),
  is_dismissed    BOOLEAN DEFAULT FALSE,
  action_taken    VARCHAR(20),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════
-- LIFESTYLE EVENTS
-- ════════════════════════════════════════════════
CREATE TABLE lifestyle_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  checkin_id      UUID REFERENCES checkins(id),
  event_type      VARCHAR(20) NOT NULL,          -- 'stress'|'sleep'|'alcohol'|'exercise_extra'
  value_numeric   NUMERIC(5,2),
  value_text      VARCHAR(50),
  source          VARCHAR(20) DEFAULT 'user_input', -- 'user_input'|'freetext_parser'
  recorded_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_lifestyle_user_type ON lifestyle_events (user_id, event_type, recorded_at DESC);

-- ════════════════════════════════════════════════
-- RED FLAG PATTERNS (seed data)
-- ════════════════════════════════════════════════
CREATE TABLE red_flag_patterns (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(50) UNIQUE NOT NULL,
  name_vi          VARCHAR(100) NOT NULL,
  trigger_symptoms TEXT[] NOT NULL,
  associated_msk   TEXT[],
  urgency          VARCHAR(15) NOT NULL,         -- 'emergency_today'|'urgent_this_week'|'see_doctor'
  action_vi        TEXT NOT NULL,
  is_active        BOOLEAN DEFAULT TRUE
);

-- ════════════════════════════════════════════════
-- NOTIFICATIONS
-- ════════════════════════════════════════════════
CREATE TABLE notification_schedules (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id),
  type             VARCHAR(30) NOT NULL,
  -- 'morning_checkin'|'post_work'|'evening'
  -- 'morning_critical_655'|'desk_timer_45m'|'evening_wind_down'|'sleep_position_quiet'
  -- 'weekly_pattern_sunday'|'pattern_insight_daily'
  scheduled_time   TIME NOT NULL,
  is_active        BOOLEAN DEFAULT TRUE,
  last_sent_at     TIMESTAMPTZ,
  timezone         VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
  channel          VARCHAR(15) DEFAULT 'email',  -- 'web_push'|'in_app_banner'|'email'|'all'
  platform_targets TEXT[] DEFAULT ARRAY['all'],
  condition_slugs  TEXT[],
  is_critical      BOOLEAN DEFAULT FALSE,         -- bypasses user mute, cannot be disabled
  repeat_interval  INTEGER,                       -- minutes (for desk_timer_45m)
  work_hours_only  BOOLEAN DEFAULT FALSE
);

CREATE TABLE notification_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  schedule_id     UUID REFERENCES notification_schedules(id),
  type            VARCHAR(20),
  body            TEXT,
  deep_link       TEXT,
  channel         VARCHAR(15),                   -- 'web_push'|'in_app_banner'|'email'
  push_sub_id     UUID REFERENCES push_subscriptions(id),
  fcm_message_id  TEXT,                          -- reserved for native app
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  opened_at       TIMESTAMPTZ,
  is_dismissed    BOOLEAN NOT NULL DEFAULT FALSE,
  dismissed_at    TIMESTAMPTZ
);
CREATE INDEX idx_notif_pending ON notification_logs (user_id, sent_at DESC)
  WHERE is_dismissed = FALSE;

CREATE TABLE push_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id),
  endpoint     TEXT NOT NULL,
  auth_key     TEXT NOT NULL,
  p256dh_key   TEXT NOT NULL,
  platform     VARCHAR(20) NOT NULL,             -- 'chrome_android'|'chrome_desktop'|'firefox'|'safari_pwa'
  user_agent   TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, endpoint)
);
CREATE INDEX idx_push_subs_user ON push_subscriptions (user_id, is_active);

-- ════════════════════════════════════════════════
-- PAYMENT
-- ════════════════════════════════════════════════
CREATE TABLE payos_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  payos_order_id  TEXT UNIQUE NOT NULL,
  plan_type       VARCHAR(10) NOT NULL,
  amount_vnd      INTEGER NOT NULL,
  platform        VARCHAR(10),                   -- 'desktop'|'mobile'
  status          VARCHAR(10) DEFAULT 'pending', -- 'pending'|'confirmed'|'failed'|'expired'
  qr_code_url     TEXT,
  checkout_url    TEXT NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL,          -- NOW() + INTERVAL '15 minutes'
  confirmed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payos_orders_user ON payos_orders (user_id, created_at DESC);
CREATE INDEX idx_payos_orders_id   ON payos_orders (payos_order_id);

CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  plan_type       VARCHAR(10) NOT NULL,           -- 'trial'|'6month'|'1year'
  status          VARCHAR(10) NOT NULL,           -- 'active'|'expired'|'cancelled'
  amount_vnd      INTEGER,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  payos_order_id  TEXT,
  store_receipt   TEXT                            -- reserved for native app
);
```

### Indexes

```sql
CREATE INDEX idx_checkins_user_date  ON checkins (user_id, DATE(created_at) DESC);
CREATE INDEX idx_sessions_user       ON sessions (user_id, started_at DESC);
CREATE INDEX idx_protocols_condition ON protocols (condition_id, is_current);
CREATE INDEX idx_notif_active        ON notification_schedules (is_active, type);
CREATE INDEX idx_patterns_user       ON pattern_observations (user_id, is_dismissed);
CREATE INDEX idx_users_anonymous     ON users (anonymous_id) WHERE anonymous_id IS NOT NULL;
CREATE INDEX idx_phase_progress_user ON phase_progress (user_id, condition_id, phase_number);
CREATE INDEX idx_lifestyle_user_type ON lifestyle_events (user_id, event_type, recorded_at DESC);
CREATE INDEX idx_push_subs_user      ON push_subscriptions (user_id, is_active);
CREATE INDEX idx_payos_orders_id     ON payos_orders (payos_order_id);
CREATE INDEX idx_notif_pending       ON notification_logs (user_id, sent_at DESC) WHERE is_dismissed = FALSE;
CREATE INDEX idx_pwd_reset_token     ON password_reset_tokens (token) WHERE used_at IS NULL;
```

---

## 1.3 Folder Structure

```
fitwell-api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── anonymous.service.ts
│   │   │   ├── google-sso.service.ts
│   │   │   ├── email-password.service.ts       # bcrypt register/login/forgot/reset
│   │   │   └── apple-sso.service.ts            # NATIVE APP ONLY — returns 501
│   │   ├── onboarding/
│   │   │   ├── onboarding.routes.ts
│   │   │   ├── onboarding.service.ts
│   │   │   ├── condition-factory.service.ts    # createConditionWithPhaseGate() — shared
│   │   │   └── symptom-map.service.ts          # AI symptom → condition mapping
│   │   ├── protocol-engine/
│   │   │   ├── protocol.service.ts
│   │   │   ├── ai-provider.ts                  # interface — swap Claude anytime
│   │   │   ├── prompts/
│   │   │   │   ├── system-prompt.ts            # FITWELL_SYSTEM_PROMPT
│   │   │   │   └── context-builder.ts          # buildAIContext()
│   │   │   ├── protocol-cache.ts
│   │   │   ├── exercise-matcher.ts             # rule-based fast path
│   │   │   └── schedule-builder.ts             # multi-condition daily schedule
│   │   ├── msk/
│   │   │   ├── msk.routes.ts
│   │   │   ├── msk-condition.service.ts
│   │   │   ├── red-flag.service.ts
│   │   │   ├── assessment.service.ts           # assessment fork routing
│   │   │   └── phase-gate.service.ts           # phase unlock evaluation + buildUnlockCriteria()
│   │   ├── checkin/
│   │   │   ├── checkin.routes.ts
│   │   │   ├── checkin.service.ts
│   │   │   ├── freetext-parser.service.ts      # async S12b signal extraction
│   │   │   └── lifestyle-trigger.service.ts
│   │   ├── sessions/
│   │   ├── notifications/
│   │   │   ├── dispatch.service.ts             # platform-aware: web push → email → in-app
│   │   │   ├── pending.service.ts              # GET /notifications/pending
│   │   │   ├── critical-timing.service.ts      # 06:55 morning critical
│   │   │   └── vapid.config.ts
│   │   ├── lifestyle/
│   │   │   ├── lifestyle.routes.ts
│   │   │   └── lifestyle-event.service.ts
│   │   ├── schedule/
│   │   │   └── schedule.routes.ts
│   │   ├── progress/
│   │   ├── patterns/
│   │   ├── billing/
│   │   │   ├── billing.routes.ts
│   │   │   ├── billing.service.ts
│   │   │   ├── billing.utils.ts                # calculateExpiry(), formatExpiryVi()
│   │   │   ├── payment-status.service.ts
│   │   │   └── payos-webhook.service.ts
│   │   └── health/
│   │       └── health.routes.ts
│   ├── shared/
│   │   ├── db.ts
│   │   ├── errors.ts
│   │   ├── auth.config.ts                      # JWT_CONFIG, REFRESH_COOKIE_CONFIG
│   │   ├── middleware/
│   │   │   ├── auth-guard.ts
│   │   │   └── rate-limit.ts
│   │   └── types.ts
│   └── app.ts
├── crons/
│   ├── protocol-adapt.ts          # 2am VN time
│   ├── pattern-detect.ts          # 3am VN time
│   ├── email-sequence.ts          # mỗi giờ
│   ├── phase-gate-check.ts        # after each check-in, async
│   ├── lifestyle-detect.ts        # nightly
│   ├── morning-critical-send.ts   # 06:50 daily
│   └── red-flag-audit.ts          # weekly
├── tests/
└── migrations/
    └── [001–024 migration files]

fitwell-web/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── onboarding/
│   │   ├── home.astro
│   │   ├── checkin.astro
│   │   ├── exercise.astro
│   │   ├── progress.astro
│   │   └── paywall.astro
│   ├── components/
│   │   ├── onboarding/
│   │   ├── checkin/
│   │   ├── exercise/
│   │   ├── progress/
│   │   ├── paywall/
│   │   └── shared/
│   │       ├── InAppBanner.tsx    # client:load — mọi page
│   │       ├── NavBar.astro       # static
│   │       └── BottomNav.astro    # static
│   ├── lib/
│   │   ├── api.ts                 # Axios + interceptors
│   │   ├── auth.ts                # anonymous session + JWT helpers
│   │   ├── store.ts               # Zustand store
│   │   ├── push.ts                # urlBase64ToUint8Array, detectPushPlatform
│   │   ├── payment.ts             # detectPaymentPlatform
│   │   └── types.ts
│   └── styles/globals.css
└── public/
    └── sw.js                      # Service Worker: cache + push handler
```

### Scale-out triggers

```
protocol-engine → service riêng:  AI latency P95 > 2s
notifications   → worker riêng:   cron > 30s/run
read DB replica:                   progress queries > 200ms
```

---

## 1.4 API Conventions

```
Pattern: /api/v1/{resource}[/{id}][/{action}]

✅ /api/v1/onboarding/intake
✅ /api/v1/checkins
✅ /api/v1/sessions/:id/complete
✅ /api/v1/patterns/:id/dismiss
✅ /api/v1/users/me/dashboard

❌ /api/v1/generateProtocol
❌ /api/v1/getUserProgress
```

### Standard Response Envelope

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: { total?: number; page?: number; hasMore?: boolean };
}

interface ErrorResponse {
  success: false;
  code: string;       // SCREAMING_SNAKE_CASE
  message: string;    // English, debug only
  details?: object;
  requestId?: string;
}
```

### Consolidated Error Code Registry

```
── Auth ──────────────────────────────────────────
AUTH_REQUIRED               401
AUTH_EXPIRED                401
ANONYMOUS_SESSION_EXPIRED   401
FORBIDDEN                   403
INVALID_CREDENTIALS         401   -- wrong email or password (không expose which field)
EMAIL_ALREADY_EXISTS        409
TOKEN_EXPIRED               401   -- password reset link expired (> 1h)
TOKEN_ALREADY_USED          401   -- reset link already consumed
NOT_IMPLEMENTED             501   -- Apple SSO on web MVP

── Onboarding / Conditions ───────────────────────
NOT_FOUND                   404
VALIDATION_ERROR            400
ASSESSMENT_NOT_REQUIRED     400
CONDITION_ALREADY_EXISTS    409

── Payment ───────────────────────────────────────
PAYMENT_FAILED              402
RESTORE_NOT_FOUND           404
ORDER_EXPIRED               410

── AI ────────────────────────────────────────────
AI_UNAVAILABLE              503
AI_TIMEOUT                  503

── Notifications ─────────────────────────────────
PUSH_SUBSCRIPTION_INVALID   400

── General ───────────────────────────────────────
CHECKIN_ALREADY_EXISTS      409
SUBSCRIPTION_REQUIRED       402
TRIAL_EXPIRED               402
RATE_LIMIT_EXCEEDED         429
INTERNAL_ERROR              500
```

---

# PHẦN 2 — AUTH ARCHITECTURE

## 2.1 Auth Lifecycle — Web MVP

```
FIRST VISIT
  │
  ▼
Browser: getOrCreateAnonymousId() → localStorage 'fw_anonymous_id'
POST /api/v1/auth/anonymous/init → user record (is_anonymous=TRUE)
  │
  ▼ (mọi API call trong 7 ngày trial)
Authorization: Anonymous <anonymous_id>
  │
  ▼ (Day 7 — S19 → S19b → S26 sign-up)

Path A — Google OAuth:
  POST /api/v1/auth/google
  Body: { id_token, anonymous_id }
  → Verify Google id_token → upsert user → claim anonymous → return JWT

Path B — Email/Password:
  POST /api/v1/auth/email/register
  Body: { email, password, anonymous_id }
  → bcrypt hash (cost 12) → create user → claim anonymous → return JWT + set refresh cookie
  │
  ▼
Server: UPDATE users SET is_anonymous=FALSE, claimed_at=NOW()
        Tất cả conditions, checkins, sessions → real account
        Return { access_token } + Set-Cookie: fw_refresh (httpOnly)
  │
  ▼
Browser: store.setAccessToken(token)   -- IN MEMORY, không persist
         localStorage.removeItem('fw_anonymous_id')
```

## 2.2 Auth Endpoints

```http
POST /api/v1/auth/anonymous/init
  Body: {} → Create anonymous user → return { anonymous_id }

POST /api/v1/auth/google
  Rate limit: 20/5min per IP
  Body: { id_token: string, anonymous_id?: string }
  → Verify Google token → upsert → claim anonymous → JWT

POST /api/v1/auth/email/register
  Rate limit: 5/1h per IP
  Body: { email, password, anonymous_id? }
  → bcrypt cost 12 → create → claim → JWT + refresh cookie

POST /api/v1/auth/email/login
  Rate limit: 10/15min per IP
  Body: { email, password }
  → Verify bcrypt → JWT + refresh cookie

POST /api/v1/auth/email/forgot-password
  Rate limit: 3/1h per email
  Body: { email }
  → Generate reset token (UUID, 1h TTL) → Resend email
  → Return { success: true } (always — no email leak)

POST /api/v1/auth/email/reset-password
  Rate limit: 5/1h per IP
  Body: { token, new_password }
  → Verify token + expiry → bcrypt → JWT + refresh cookie

POST /api/v1/auth/refresh
  → Read fw_refresh httpOnly cookie
  → Issue new access token (15m)
  → Rotate refresh cookie (30d)

POST /api/v1/auth/claim-anonymous
  Body: { anonymous_id }
  → Merge all anonymous data into identified user

-- NATIVE APP ONLY — returns 501 in Web MVP:
POST /api/v1/auth/apple
```

## 2.3 JWT Config

```typescript
// src/shared/auth.config.ts

export const JWT_CONFIG = {
  accessTokenTTL:  '15m',
  refreshTokenTTL: '30d',
  algorithm:       'HS256' as const,
  secret:          process.env.JWT_SECRET!,   // min 32 chars random
};

export const REFRESH_COOKIE_CONFIG = {
  name:     'fw_refresh',
  httpOnly: true,
  secure:   true,
  sameSite: 'strict' as const,
  maxAge:   30 * 24 * 60 * 60,   // 30 days in seconds
  path:     '/api/v1/auth',       // scoped to auth endpoints
};
```

## 2.4 Auth Middleware

```typescript
// src/shared/middleware/auth-guard.ts

async function authGuard(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    request.user = await verifyJWT(token);  // throws AUTH_EXPIRED if expired

  } else if (authHeader?.startsWith('Anonymous ')) {
    const anonymousId = authHeader.slice(10);
    const user = await db.users.findOne({ anonymous_id: anonymousId, is_anonymous: true });
    if (!user) throw new AppError('ANONYMOUS_SESSION_EXPIRED', 401);
    request.user = user;

  } else {
    throw new AppError('AUTH_REQUIRED', 401);
  }
}

function requireIdentified(request: FastifyRequest) {
  if (request.user.is_anonymous) throw new AppError('AUTH_REQUIRED', 401);
}
```

---

# PHẦN 3 — AI SYSTEM PROMPT

## 3.1 FITWELL_SYSTEM_PROMPT

```typescript
// src/modules/protocol-engine/prompts/system-prompt.ts

export const FITWELL_SYSTEM_PROMPT = `
Bạn là FitWell — ứng dụng đồng hành MSK hàng ngày cho người Việt Nam.

═══ IDENTITY ═══
Register: Bác sĩ gia đình thân — professional knowledge, genuine care, nói thẳng.
KHÔNG phải: PT gym, health coach, motivational speaker.
Hình dung: Người bạn học y, đang nói chuyện thật về cái lưng đau của bạn.

═══ HARD RULES ═══
KHÔNG bao giờ bắt đầu bằng: "Tôi hiểu rằng" / "Cảm ơn bạn" / "Chào bạn" / "Tuyệt vời"
KHÔNG dùng dấu chấm than (!)
KHÔNG dùng emoji
KHÔNG câu励志: "Cố lên nhé" / "Chúc bạn mau khỏe" / "Hành trình sức khoẻ"
KHÔNG dùng: Tuyệt vời / Xuất sắc / Kiên trì / Streak / Healing / Yêu thương bản thân
Câu tối đa 20 từ. Hầu hết 8–14 từ.
Số cụ thể: "5 phút" KHÔNG "vài phút". "7–10 ngày" KHÔNG "một thời gian".
Protocol format bắt buộc: [Tên bài] · [Thời lượng] · [Địa điểm/tư thế]
Xưng hô: "Bạn" khi cần. Drop pronoun khi câu vẫn tự nhiên. KHÔNG "mình/tôi".

═══ TONE THEO PAIN LEVEL ═══
Pain 1–2: Casual, confident. Sarcastic nhẹ được phép.
Pain 3:   Direct, neutral.
Pain 4:   Grounded, honest. Acknowledge trước.
Pain 5:   BẮT BUỘC 4 phần đúng thứ tự:
  (1) Acknowledge: "Mức 5 — nghe rồi, hôm nay nặng thật."
  (2) Rest permission: "Nghỉ hoàn toàn đi — không cần cố."
  (3) Red flag check: "Nếu tê chân hoặc đau lan xuống đùi — đừng chờ, gặp bác sĩ."
  (4) NO protocol — không đưa bài tập

═══ CONTEXT-SPECIFIC RULES ═══
Day 3–5 (skeptical window):
  Pain chưa giảm → "3 ngày chưa đủ — cơ thể cần 7–10 ngày. Bài đang đúng hướng."

Re-engagement (days_since_last_checkin > 1):
  2 ngày: "2 ngày không thấy — không hỏi lý do. Tiếp bình thường."
  7+ ngày: "1 tuần không thấy. Cơ thể vẫn nhớ — tiếp tục bài cũ, không cần restart."
  KHÔNG mention skip count, KHÔNG guilt.

Week 2 plateau (ngày 8–14, pain flat):
  "Tuần 2 là tuần flat nhất — cơ thể đang consolidate. Tuần 3 thường rõ hơn."

After flare-up:
  "Đau như hôm qua vẫn quay lại — đó là thứ khó hơn mọi người nghĩ. Hôm nay nhẹ thôi."

Pattern insight (day 14+):
  "Nhận ra: [pattern]. Bạn quyết định làm gì với thông tin đó."
  KHÔNG prescription. KHÔNG "bạn nên / cần / phải".

Paywall period (day 6–7):
  "7 ngày vừa rồi — bạn tự biết nó có work không."

═══ RESPONSE STRUCTURE (pain 1–4) ═══
1. fear_reduction: Normalize. "Pattern này rất phổ biến với người ngồi 8 tiếng."
2. insight: Nguyên nhân thật. "Không phải lỗi của lưng — cơ hông yếu đang bù tải."
3. protocol: [Tên] · [Thời lượng] · [Địa điểm]

═══ MSK-SPECIFIC RESPONSE RULES ═══

Rule MSK-1: Fear Reduction Before Insight (Always)
Every symptom response MUST start with fear reduction.
BAD:  "Đây có thể là thoát vị đĩa đệm..."
GOOD: "Pattern này không phải dấu hiệu bệnh nặng — rất phổ biến với người ngồi nhiều."

Rule MSK-2: Pain Track Bifurcation
Context includes condition_track: 'joint' | 'tendon'.
- tendon AND pain_score 3–4:
  → "Đau 3–4 khi làm bài = working signal, không phải cảnh báo. Gân đang được kích thích đúng."
- tendon AND pain_score 5:
  → "Đau 5 — giảm biên độ chuyển động, không dừng bài hoàn toàn."
- joint AND pain_score ≥ 4:
  → Recommend isometric alternative. KHÔNG nói "nghỉ" trừ pain 5.

Rule MSK-3: Phase Gate Response
If phase_gate_blocked = true:
  → Explain clinical reason FIRST (from phase_gate_reason_vi).
  → Tone: matter-of-fact, not punishing.
  → NEVER "Bạn cần..." / "Bạn phải..." — state clinical fact neutrally.
  → "[Clinical reason]. Phase 1 thêm [X] ngày nữa. Bài hôm nay: [phase 1 exercise]."

Rule MSK-4: Lifestyle Insight Delivery
If lifestyle_trigger non-null:
  → Embed as separate card after primary response.
  → Lead with data observation, NOT instruction.
  → NEVER "bạn nên", "bạn cần", "hãy cố".
  → "[Pattern observed]. [Mechanism]. Làm gì với thông tin này là quyết định của bạn."

Rule MSK-5: Counterintuitive Insight
For IT band, tendon pain, centralization:
  → "[Correct understanding]. Không phải [wrong assumption]. [Implication]."

Rule MSK-6: Frozen Shoulder Phase 1 — ABSOLUTE RULE
If condition = frozen_shoulder AND phase_current = 1:
  → NEVER: "kéo giãn", "stretch", "tăng biên độ"
  → ONLY: pendulum hoặc pain-free active range
  → If user asks about stretch:
    "Phase 1 frozen shoulder: stretch gây phản ứng viêm cấp — phản tác dụng.
     Pendulum đúng — trọng lực kéo giãn nhẹ không trigger viêm.
     Phase 2 (sau [X] tuần) sẽ có bài kéo giãn có hướng dẫn."

Rule MSK-7: Adaptation Signal Response
Context includes adaptation_signal: 'none'|'reduce_intensity'|'post_flare_recovery'|'positive_trajectory'|'plateau'.

If adaptation_signal = 'reduce_intensity':
  → "5 ngày mức 4–5 — hôm nay chuyển sang isometric. Cơ khớp cần giảm load trước khi tiếp tục bài cũ."
  → Return isometric variant of current exercise. Set response_type = 'plateau'.
  → Return to main protocol when pain ≤ 3 × 3 days (evaluated by cron).

If adaptation_signal = 'post_flare_recovery':
  → "Hôm qua [prev_score], hôm nay [current_score] — flare qua rồi. Nhẹ thôi hôm nay."
  → Return 50% volume protocol variant. Set response_type = 'flare_up'.
  → Do NOT ask why the flare happened.

If adaptation_signal = 'positive_trajectory':
  → Embed peer-nod inline (not separate block): "Từ [prev] xuống [curr] trong 5 ngày — đang đúng hướng."
  → Add progression cue at end of protocol block: "Tuần này thêm [progression] cuối bài."
  → Set response_type = 'standard' (positive_trajectory is a tone modifier, not a response_type value).
  → KHÔNG "Tuyệt vời", KHÔNG "Xuất sắc", KHÔNG "!".

═══ OUTPUT FORMAT ═══
Luôn trả về JSON. Không thêm text bên ngoài JSON.
{
  "fear_reduction":  "string | null",
  "insight":         "string | null",
  "protocol":        "string | null",          // null nếu pain 5
  "acknowledge":     "string | null",          // pain 5 only
  "rest_permission": "string | null",          // pain 5 only
  "red_flag_check":  "string | null",          // pain 5 only
  "response_type":   "standard|pain5|re_engagement|skeptical|plateau|pattern|flare_up|tendon_working_signal"
}
`;
```

## 3.2 AI Context Object

```typescript
// src/modules/protocol-engine/prompts/context-builder.ts

interface AICheckinContext {
  pain_score:               number;         // 1–5
  body_region:              string;
  trigger_pattern:          string;
  condition_track:          'joint' | 'tendon';
  day_number:               number;
  days_since_last_checkin:  number;
  recent_pain_scores:       number[];       // 10 scores gần nhất
  post_session_feedback?:   string;
  adaptation_signal:        'none' | 'reduce_intensity' | 'post_flare_recovery' | 'positive_trajectory' | 'plateau';
  current_protocol_version?: number;
  phase_current:            number;
  phase_gate_blocked:       boolean;
  phase_gate_reason_vi?:    string;
  lifestyle_trigger?:       LifestyleTrigger | null;
}

async function buildAIContext(
  userId: string,
  conditionId: string,
  painScore: number
): Promise<AICheckinContext> {
  const [profile, condition, recentCheckins, lastSession, phaseProgress, lifestyleTrigger] =
    await Promise.all([
      db.userProfiles.findOne({ user_id: userId }),
      db.conditions.findWithMsk(conditionId),
      db.checkins.findMany({ user_id: userId, condition_id: conditionId, limit: 10 }),
      db.sessions.findOne({ user_id: userId, orderBy: 'started_at DESC' }),
      db.phase_progress.findCurrent(userId, conditionId),
      detectLifestyleTrigger(userId, { pain_score: painScore } as any),
    ]);

  const dayNumber = profile.onboarding_completed_at
    ? differenceInDays(new Date(), profile.onboarding_completed_at) + 1
    : 1;

  const lastCheckin = recentCheckins[0];
  const daysSinceLastCheckin = lastCheckin
    ? differenceInDays(startOfDay(new Date()), startOfDay(new Date(lastCheckin.created_at)))
    : 0;

  const phaseGateBlocked = await evaluatePhaseGateBlocked(userId, conditionId);

  return {
    pain_score:              painScore,
    body_region:             condition.primary_region,
    trigger_pattern:         condition.trigger_pattern,
    condition_track:         condition.pain_track,
    day_number:              dayNumber,
    days_since_last_checkin: daysSinceLastCheckin,
    recent_pain_scores:      recentCheckins.map(c => c.pain_score),
    post_session_feedback:   lastSession?.feedback ?? undefined,
    phase_current:           condition.phase_current,
    phase_gate_blocked:      phaseGateBlocked,
    lifestyle_trigger:       lifestyleTrigger,
  };
}
```

---

# PHẦN 4 — API DESIGN

## 4.1 Auth
*Xem Phần 2.2*

## 4.2 Onboarding

```http
POST /api/v1/onboarding/intake
Auth: Anonymous | Bearer
Body: { body_regions, trigger_pattern, current_treatments }
Response 201:
{
  condition_id:         string,
  protocol:             Protocol | null,          // null if assessment_required
  assessment_required:  boolean,
  assessment_test_slug: string | null,
  safety_warning:       { content_vi, show_once } | null,
  ai_message:           AICheckinResponse
}

POST /api/v1/onboarding/symptom-map
Auth: Anonymous | Bearer
Body: { symptom_text: string }  -- max 500 chars
Response 200:
{
  suggestions: [{ msk_condition_id, slug, name_vi, body_region, confidence, match_reason_vi }],
  below_threshold: boolean
}
-- below_threshold true → frontend fallback to Tab A list
-- Model: Claude Haiku, target < 400ms P95
```

## 4.3 Conditions

```http
POST /api/v1/conditions/add-region
Auth: Anonymous | Bearer
Body: { body_region, trigger_pattern }
Response 201: ConditionCreatedResponse  -- same shape as intake

POST /api/v1/conditions/add-from-suggestion
Auth: Anonymous | Bearer
Body: { pattern_id }
Response 201: ConditionCreatedResponse

POST /api/v1/conditions/:conditionId/assessment
Auth: Anonymous | Bearer
Body: { test_slug, result: 'positive'|'negative'|'inconclusive' }
Response 200: { condition_id, assessment_result, protocol: Protocol }

GET /api/v1/conditions/:id/phase-progress
Response: { phase_current, unlock_criteria, days_remaining, blocked_reason_vi }

-- ConditionCreatedResponse (shared type):
{
  condition_id:           string,
  protocol:               Protocol | null,
  assessment_required:    boolean,
  assessment_test_slug:   string | null,
  safety_warning:         { content_vi, show_once } | null,
  daily_schedule_updated: boolean
}
```

## 4.4 Check-in

```http
POST /api/v1/checkins
Auth: Anonymous | Bearer
Body: { condition_id, pain_score, trigger_event, free_text? }
Response 201 (pain 1–4):
{
  checkin_id:        string,
  protocol_id:       string,
  show_exercise_card: true,
  ai_response: {
    fear_reduction, insight, protocol,
    response_type,
    lifestyle_trigger: LifestyleTrigger | null,
    condition_track:   'joint'|'tendon',
    phase_gate_blocked: boolean,
    phase_gate_reason_vi: string | null
  },
  trend: { last_5_days, direction, message }
}

Response 201 (pain 5):
{
  checkin_id:        string,
  protocol_id:       null,
  show_exercise_card: false,
  ai_response: { acknowledge, rest_permission, red_flag_check, response_type: 'pain5' }
}

GET /api/v1/checkins/today?condition_id=   -- check if already checked in today
```

## 4.5 Sessions

```http
POST /api/v1/sessions
Body: { protocol_id, source: 'notification'|'manual'|'checkin' }

PATCH /api/v1/sessions/:id
Body: { current_step?, completion_pct?, status?: 'in_progress'|'exited' }

POST /api/v1/sessions/:id/complete
Body: { completion_pct: 100, feedback: 'better'|'same'|'worse' }
```

## 4.6 Dashboard

```http
GET /api/v1/users/me/dashboard
Response:
{
  today: { checkin_done, session_done, current_protocol },
  subscription: { status, days_remaining, show_paywall },
  progress: { consistency_30d, pain_trend_7d },
  suggestions: [{ type, body_region, description_vi, cta, pattern_id }]
}
```

## 4.7 Progress

```http
GET /api/v1/progress/pain-trend?days=14&condition_id=
GET /api/v1/progress/summary?days=7    -- Day 7 pre-paywall summary
```

## 4.8 Schedule (multi-condition)

```http
GET /api/v1/schedule/daily
-- Returns merged schedule for all active conditions
-- Cache: 1h, invalidated on condition add/remove or phase change

GET /api/v1/schedule/morning-critical
-- Returns 06:55 protocol if user has timing_critical conditions
```

## 4.9 Patterns

```http
GET /api/v1/patterns
POST /api/v1/patterns/:id/dismiss
POST /api/v1/patterns/:id/watch
```

## 4.10 Lifestyle

```http
POST /api/v1/checkins/:id/lifestyle
Body: { event_type, value_numeric, value_text? }
```

## 4.11 Notifications

```http
PATCH /api/v1/notifications/schedule
Body: { type, is_active, time }

GET /api/v1/notifications/pending
-- Returns undismissed in-app banners from last 24h (max 3)
-- Called on page focus (visibilitychange) — max poll interval 15 min

POST /api/v1/notifications/:id/dismiss
-- Sets is_dismissed=true, dismissed_at=now

POST /api/v1/notifications/web-push/subscribe
Auth: Anonymous | Bearer
Body: { endpoint, keys: { auth, p256dh }, platform }
→ Upsert push_subscriptions

DELETE /api/v1/notifications/web-push/unsubscribe
Body: { endpoint }

GET /api/v1/config/push-key
-- No auth — returns { publicKey } for VAPID subscription setup
```

## 4.12 Billing

```http
POST /api/v1/billing/create-payment
Auth: Bearer (identified only)
Body: { plan_type: '6month'|'1year', platform: 'desktop'|'mobile' }
Response 201:
{
  order_id:     string,
  checkout_url: string,
  qr_code_url:  string,     -- for desktop QR render
  amount_vnd:   number,
  expires_at:   string      -- 15 min PayOS TTL
}

GET /api/v1/billing/payment-status/:orderId
Auth: Bearer
Rate limit: 40 req/min per user
Response:
{ status: 'pending'|'confirmed'|'failed'|'expired', order_id, confirmed_at }

POST /api/v1/billing/payos-webhook  -- PayOS webhook receiver (no auth, signature verification)
POST /api/v1/billing/restore        -- Restore purchase (native app — receipt verification)
```

## 4.13 Red Flag

```http
POST /api/v1/checkins/:id/red-flag-check
Body: { symptoms: string[] }
Response: RedFlagResult | null
```

## 4.14 Profile

```http
POST /api/v1/profile/ergonomics-setup
Body: { items_checked: string[] }
→ Sets user_profiles.ergonomics_setup_done = TRUE
```

## 4.15 Health

```http
GET /api/v1/health
Response 200: { status: 'ok', version: '1.5', checks: { db, clock } }
Response 503: { status: 'degraded', ... }
```

---

# PHẦN 5 — FRONTEND IMPLEMENTATION

## 5.1 Package Dependencies

```json
{
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/react": "^3.x",
    "@astrojs/tailwind": "^5.x",
    "@astrojs/vercel": "^7.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@supabase/supabase-js": "^2.x",
    "zustand": "^4.x",
    "axios": "^1.x",
    "date-fns": "^3.x"
  }
}
```

## 5.2 Auth + JWT (src/lib/auth.ts)

```typescript
const ANON_KEY = 'fw_anonymous_id';

export function getOrCreateAnonymousId(): string {
  let id = localStorage.getItem(ANON_KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(ANON_KEY, id); }
  return id;
}

// JWT: stored in Zustand (in-memory, NOT persisted to localStorage)
// Refresh token: httpOnly cookie 'fw_refresh' — set by server, not readable by JS

export function getAuthHeader(): string {
  const token = useStore.getState().accessToken;
  if (token) return `Bearer ${token}`;

  const anonId = localStorage.getItem(ANON_KEY);
  if (anonId) return `Anonymous ${anonId}`;

  return '';
}

export function claimSession(accessToken: string): void {
  useStore.getState().setAccessToken(accessToken);
  localStorage.removeItem(ANON_KEY);
  // Refresh cookie set via Set-Cookie by server
}
```

## 5.3 Axios Client (src/lib/api.ts)

```typescript
import axios from 'axios';
import { getAuthHeader } from './auth';

export const api = axios.create({
  baseURL:         import.meta.env.PUBLIC_API_URL,
  withCredentials: true,    // send httpOnly refresh cookie
});

api.interceptors.request.use(config => {
  const header = getAuthHeader();
  if (header) config.headers.Authorization = header;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      try {
        const refresh = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
        const newToken = refresh.data.data.access_token;
        useStore.getState().setAccessToken(newToken);
        err.config.headers.Authorization = `Bearer ${newToken}`;
        return api(err.config);
      } catch {
        useStore.getState().setAccessToken(null);
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);
```

## 5.4 Zustand Store (src/lib/store.ts)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FitWellStore {
  regions: string[]; trigger: string; treatments: string[];
  conditionId: string | null;
  dayNumber: number; checkinDone: boolean; sessionDone: boolean;
  accessToken: string | null;    // IN MEMORY — excluded from persist
  setConditionProfile: (p: Partial<FitWellStore>) => void;
  markCheckinDone: () => void; markSessionDone: () => void;
  setAccessToken: (t: string | null) => void;
  reset: () => void;
}

export const useStore = create<FitWellStore>()(
  persist(
    (set) => ({
      regions: [], trigger: '', treatments: [], conditionId: null,
      dayNumber: 1, checkinDone: false, sessionDone: false,
      accessToken: null,
      setConditionProfile: (p) => set(p),
      markCheckinDone:  () => set({ checkinDone: true }),
      markSessionDone:  () => set({ sessionDone: true }),
      setAccessToken:   (t) => set({ accessToken: t }),
      reset: () => set({ regions: [], trigger: '', treatments: [], conditionId: null }),
    }),
    {
      name:        'fw-store',
      partialize:  (s) => ({ ...s, accessToken: undefined }),  // NEVER persist JWT
    }
  )
);
```

## 5.5 Push Utilities (src/lib/push.ts)

```typescript
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const out     = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) out[i] = rawData.charCodeAt(i);
  return out;
}

export function detectPushPlatform(): string {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'safari_pwa';
  if (/Android/.test(ua) && /Chrome/.test(ua)) return 'chrome_android';
  if (/Firefox/.test(ua)) return 'firefox';
  return 'chrome_desktop';
}
```

## 5.6 Payment Utility (src/lib/payment.ts)

```typescript
export function detectPaymentPlatform(): 'desktop' | 'mobile' {
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? 'mobile' : 'desktop';
}
```

## 5.7 Service Worker (public/sw.js)

```javascript
const CACHE = 'fw-v1';

// ─── OFFLINE CACHE ──────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/v1/protocols') ||
      event.request.url.includes('/api/v1/exercises')) {
    event.respondWith(
      caches.open(CACHE).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());  // TTL via cache headers
        return response;
      })
    );
  }
});

// ─── WEB PUSH RECEIVE ───────────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'FitWell', {
      body:   data.body,
      icon:   '/icons/icon-192.png',
      badge:  '/icons/badge-72.png',
      data:   { deepLink: data.deepLink },
      silent: data.inApp === true,
    })
  );
});

// ─── NOTIFICATION CLICK ─────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const deepLink = event.notification.data?.deepLink;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes(self.location.origin));
      if (existing) return existing.focus().then(c => c.navigate(deepLink));
      return clients.openWindow(deepLink || '/home');
    })
  );
});
```

## 5.8 S30 — Notification Permission → Backend Contract

```typescript
// Frontend flow:
const { publicKey } = await api.get('/api/v1/config/push-key');
const reg = await navigator.serviceWorker.ready;
const sub = await reg.pushManager.subscribe({
  userVisibleOnly:      true,
  applicationServerKey: urlBase64ToUint8Array(publicKey),
});
await api.post('/api/v1/notifications/web-push/subscribe', {
  endpoint: sub.endpoint,
  keys: {
    auth:   btoa(String.fromCharCode(...new Uint8Array(sub.getKey('auth')))),
    p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey('p256dh')))),
  },
  platform: detectPushPlatform(),
});
// Denied → no POST, show 1 dismissable banner "Có thể bật lại trong Settings trình duyệt."
// No retry — browsers enforce their own deny handling
```

## 5.9 Typing Indicator — 800ms Rule

```typescript
async function submitCheckin(data: CheckinData) {
  const start = Date.now();
  setShowTyping(true);
  const response = await api.post('/api/v1/checkins', data);
  const elapsed = Date.now() - start;
  if (elapsed < 800) await new Promise(r => setTimeout(r, 800 - elapsed));
  setShowTyping(false);
  setResponse(response.data);
}
// Also apply to: onboarding first response, protocol adaptation message
```

## 5.10 Email Retention Sequence

```
Trigger        Day   Subject                                    CTA
─────────────────────────────────────────────────────────────────────
After signup   D+0   "Bài đầu tiên — làm được ngay hôm nay"   → /exercise
No login       D+2   "Lưng sáng nay thế nào?"                 → /checkin
No login       D+4   "3 ngày chưa đủ — cơ thể cần 7–10 ngày" → /home
Approaching    D+6   "Ngày mai là ngày cuối thử miễn phí"     → /progress
Paywall day    D+7   "7 ngày xong — xem kết quả của bạn"      → /paywall
```

Enforce: max 1 email/user/day, quiet period 22:00–07:00 VN time.

---

# PHẦN 6 — BACKEND: KEY SERVICE IMPLEMENTATIONS

## 6.1 Condition Factory (Shared Across 3 Endpoints)

```typescript
// onboarding/condition-factory.service.ts

export async function createConditionWithPhaseGate(
  userId:       string,
  mskCondition: MskCondition,
  intake:       ConditionIntakeData
): Promise<ConditionCreatedResponse> {
  const condition = await db.conditions.create({ user_id: userId, ...intake, ... });

  // Phase gate: ALWAYS initialized for every condition
  await db.phase_progress.create({
    user_id:         userId,
    condition_id:    condition.id,
    phase_number:    1,
    status:          'active',
    unlock_criteria: buildUnlockCriteria(mskCondition),
  });

  const safetyWarning = mskCondition.safety_warning_vi
    ? { content_vi: mskCondition.safety_warning_vi, show_once: true } : null;

  return { condition_id: condition.id, protocol: null, assessment_required: ..., safety_warning: safetyWarning, ... };
}

// Called from:
// 1. POST /api/v1/onboarding/intake
// 2. POST /api/v1/conditions/add-region
// 3. POST /api/v1/conditions/add-from-suggestion
```

## 6.2 Phase Gate — buildUnlockCriteria

```typescript
// msk/phase-gate.service.ts

export function buildUnlockCriteria(mskCondition: MskCondition): UnlockCriteria {
  const base = { pain_threshold: 2, sustained_days: 5 };

  if (mskCondition.slug === 'frozen_shoulder') {
    return {
      ...base, pain_threshold: 3, sustained_days: 14,
      prohibit_movement_types: ['stretch', 'end_range_passive'],
      prohibit_reason_vi:      'Frozen shoulder Phase 1: passive stretch gây viêm cấp tính.',
    };
  }
  if (mskCondition.pain_track === 'tendon') return { ...base, sustained_days: 7 };
  return base;
}
```

## 6.3 Protocol Engine — Prohibited Exercise Filter

```typescript
// protocol-engine/exercise-matcher.ts

export function filterProhibitedExercises(exercises: Exercise[], phaseProgress: PhaseProgress) {
  const prohibited = phaseProgress.unlock_criteria?.prohibit_movement_types ?? [];
  if (!prohibited.length) return exercises;
  return exercises.filter(ex => !ex.clinical_tags?.some(tag => prohibited.includes(tag)));
}
// Called after exercise selection, before returning protocol
// Frozen shoulder Phase 1: NEVER returns exercise with 'stretch' or 'end_range_passive' tag
```

## 6.4 Symptom Map (MSK Catalog Cache)

```typescript
// onboarding/symptom-map.service.ts

let _catalog: MskConditionSlim[] | null = null;

async function getMskCatalogSlim() {
  if (_catalog) return _catalog;
  _catalog = await db.msk_conditions.findMany({
    where: { is_active: true },
    select: ['slug', 'name_vi', 'body_region', 'insight_hook_vi'],
  });
  return _catalog;
}
// insight_hook_vi doubles as key symptom signal for the classifier
// Cache invalidates on server restart only (seed data is immutable)
```

## 6.5 Notification Dispatch (Platform-Aware)

```typescript
// notifications/dispatch.service.ts

export async function dispatchNotification(userId: string, payload: NotificationPayload) {
  // 1. Web push (all active subscriptions)
  const pushSubs = await db.push_subscriptions.findActive(userId);
  if (pushSubs.length > 0) {
    const results = await Promise.allSettled(pushSubs.map(s => sendWebPush(s, payload)));
    results.forEach((r, i) => {
      if (r.status === 'rejected' && r.reason?.statusCode === 410)
        db.push_subscriptions.deactivate(pushSubs[i].id);  // expired subscription
    });
    const sent = results.filter(r => r.status === 'fulfilled').length;
    if (sent > 0) { await db.notification_logs.insert({ userId, channel: 'web_push', ...payload }); return { sent: true, channel: 'web_push' }; }
  }

  // 2. Email fallback (identified users only)
  if (!payload.skipEmail) {
    const user = await db.users.findById(userId);
    if (user.email && !user.is_anonymous) {
      await sendRetentionEmail(user.email, payload);
      return { sent: true, channel: 'email' };
    }
  }

  // 3. In-app banner: queued in notification_logs, polled by frontend
  return { sent: false, reason: 'NO_CHANNEL_AVAILABLE' };
}
```

## 6.6 PayOS Payment Status (BUG-1 Fix)

```typescript
// billing/payment-status.service.ts

export async function getPaymentStatus(orderId: string, userId: string) {
  const order = await db.payos_orders.findByPayosOrderId(orderId);
  if (!order || order.user_id !== userId) throw new AppError('NOT_FOUND', 404);

  if (order.status === 'confirmed') return { status: 'confirmed', order_id: orderId, confirmed_at: order.confirmed_at };
  if (order.status === 'failed')    return { status: 'failed',    order_id: orderId, confirmed_at: null };
  if (new Date() > new Date(order.expires_at)) {
    await db.payos_orders.markExpired(order.id);
    return { status: 'expired', order_id: orderId, confirmed_at: null };
  }
  return { status: 'pending', order_id: orderId, confirmed_at: null };
}
```

## 6.7 Billing Utilities

```typescript
// billing/billing.utils.ts
import { addMonths } from 'date-fns';

export function calculateExpiry(planType: '6month' | '1year', from = new Date()): Date {
  if (planType === '6month') return addMonths(from, 6);
  if (planType === '1year')  return addMonths(from, 12);
  throw new Error(`Unknown plan_type: ${planType}`);
}
// Uses date-fns addMonths — handles month-end edge cases (Jan 31 + 6mo = Jul 31)

export function formatExpiryVi(d: Date): string {
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
}
```

## 6.8 Adaptation Signal Engine

```typescript
// crons/protocol-adapt.ts — runs 2am VN time
// Evaluates recent check-ins per condition and sets adaptation_signal on conditions table.

type AdaptationSignal =
  | 'none'                 // default — no adaptation needed
  | 'reduce_intensity'     // joint track, pain ≥ 4 for 5 consecutive days
  | 'post_flare_recovery'  // previous check-in pain ≥ 4, current pain ≤ 2 (bounce-back)
  | 'positive_trajectory'  // pain delta ≤ -2 over last 5 check-ins (steady improvement)
  | 'plateau'              // pain flat ±0.5 for 10+ days

export function evaluateAdaptationSignal(
  recentScores: number[],   // last 10 check-ins, newest first
  currentScore: number,
  previousScore: number,
  painTrack: 'joint' | 'tendon',
  dayNumber: number
): AdaptationSignal {

  // reduce_intensity: joint track only, last 5 scores all ≥ 4
  if (painTrack === 'joint' && recentScores.slice(0, 5).every(s => s >= 4)) {
    return 'reduce_intensity';
  }

  // post_flare_recovery: previous ≥ 4, current ≤ 2 (sudden improvement after flare)
  // Single-trigger — resets after 1 check-in
  if (previousScore >= 4 && currentScore <= 2) {
    return 'post_flare_recovery';
  }

  // positive_trajectory: delta ≤ -2 over last 5 check-ins (newest - oldest in window)
  if (recentScores.length >= 5) {
    const delta = recentScores[0] - recentScores[4];
    if (delta <= -2) return 'positive_trajectory';
  }

  // plateau: pain flat ±0.5 for 10+ days (range ≤ 1 across 10 check-ins)
  if (dayNumber >= 10 && recentScores.length >= 10) {
    const range = Math.max(...recentScores.slice(0, 10)) - Math.min(...recentScores.slice(0, 10));
    if (range <= 1) return 'plateau';
  }

  return 'none';
}
```

### Reset conditions

```
reduce_intensity     → reset when pain_score ≤ 3 for 3 consecutive days
post_flare_recovery  → reset after 1 day (single-trigger by design)
positive_trajectory  → reset when last 5 scores no longer show delta ≤ -2
plateau              → reset when pain changes by > 1 point over 3 days
```

### UI screen mapping

| adaptation_signal | Screen | Behaviour |
|---|---|---|
| `reduce_intensity` | S25b | Propose isometric swap, user can override |
| `post_flare_recovery` | S25d | 50% volume protocol, acknowledge bounce-back |
| `positive_trajectory` | S12 inline | Peer-nod inline within standard check-in response — not a separate screen |
| `plateau` | S25 (existing) | Already in v1.5 |

## 6.9 Backend Interface Wrappers

```typescript
interface AIProvider {
  generateCheckinResponse(ctx: AICheckinContext): Promise<AICheckinResponse>;
  selectExercises(condition: Condition, library: Exercise[]): Promise<AIProtocolResult>;
  adaptProtocol(history: CheckinHistory): Promise<AIProtocolResult | null>;
  detectPatterns(history: CheckinHistory): Promise<PatternObservation[]>;
  mapSymptoms(text: string): Promise<SymptomMapResult>;
}
class ClaudeProvider implements AIProvider { ... }
class RuleBasedProvider implements AIProvider { ... }  // fallback

interface PaymentProvider {
  createPaymentLink(amount: number, meta: PaymentMetadata): Promise<PaymentLinkResult>;
  verifyWebhook(payload: unknown, signature: string): Promise<PaymentEvent>;
}
class PayOSProvider implements PaymentProvider { ... }

interface NotificationProvider {
  sendWebPush(sub: PushSubscription, payload: NotificationPayload): Promise<void>;
  sendEmail(to: string, payload: EmailPayload): Promise<void>;
}

interface VideoProvider {
  getStreamUrl(videoId: string): Promise<string>;
}
class CloudflareStreamProvider implements VideoProvider { ... }
```

---

# PHẦN 7 — CRONS

```typescript
// crons/protocol-adapt.ts — 2am VN time
// Users với 10+ ngày pain không cải thiện → Claude suggest protocol mới
// SET is_current=FALSE trên bản cũ, INSERT bản mới
// Sáng hôm sau user nhận email "Bài mới được cập nhật"

// crons/pattern-detect.ts — 3am VN time
// Users với 14+ ngày checkins → Claude detect patterns
// UPSERT pattern_observations
// Dashboard sáng hôm sau show suggestions

// crons/email-sequence.ts — mỗi giờ
// Email retention theo day_number + days_since_checkin
// Max 1 email/user/ngày, quiet 22:00–07:00

// crons/phase-gate-check.ts — async after each check-in (< 500ms)
// Evaluate unlock criteria → nếu đủ điều kiện → unlock next phase
// Flag 'phase_unlock_pending' → checkin response variant sáng hôm sau

// crons/lifestyle-detect.ts — nightly
// Users với ≥3 checkins → process lifestyle signals → UPSERT pattern_observations

// crons/morning-critical-send.ts — 06:50 daily
// Users có conditions WHERE msk_conditions.timing_critical = TRUE
// + chưa done morning_critical today → send push at 06:55
// Quiet hours: 22:00–06:50 VN. morning_critical_655 BYPASSES quiet hours.

// crons/red-flag-audit.ts — weekly Sunday
// Review red_flag_logs volume → alert ops nếu spike
```

---

# PHẦN 8 — TECHNICAL DEBT REGISTER

| # | Debt | Lý do chấp nhận | Trigger để trả |
|---|---|---|---|
| TD-1 | Pattern detection nightly batch | Real-time overkill cho v1 | > 10K users |
| TD-2 | Protocol adaptation nightly | Không cần real-time | > 10K users |
| TD-3 | Admin panel = SQL thủ công | < 3K users không đáng build UI | Ops team cần tự vận hành |
| TD-4 | Cache bằng Postgres (không Redis) | Tránh thêm dependency | > 5K concurrent |
| TD-5 | Email thay push notification cho iOS | iOS Safari không support web push nếu không Add to Home Screen | Native app + FCM |
| TD-6 | Service Worker offline chỉ cache GET | Offline POST queue phức tạp | User research: offline is pain point |
| TD-7 | Zustand: accessToken không persist (mất khi tab đóng) | Daily users re-auth acceptable | User complaints về login UX |
| TD-8 | Email/password auth. Không có magic link, không Apple SSO. | Web MVP. Apple SSO = iOS App Store only. | Native app build |
| TD-9 | Rate limiting in-memory (không Redis) | Single node MVP | > 1 API server instance |
| TD-10 | Access token in-memory (Zustand) | Daily active — re-auth acceptable | User complaints |
| TD-11 | VAPID keys static (không rotate) | Acceptable cho MVP | Compliance requirement |
| TD-12 | MSK catalog cache invalidates on restart only | Seed data immutable | Admin panel chỉnh sửa msk_conditions |

---

# PHẦN 9 — TEST CASES

## Module: Protocol Engine

```typescript
it('back + morning → hip activation protocol')
it('neck + after_sitting → desk-only exercises')
it('Claude timeout → fallback rule-based, không empty protocol')
it('same condition_hash → cache hit, không call AI lần 2')
it('pain_score 5 → protocol_id null, show_exercise_card false, response_type pain5')
it('pain_score 5 → red_flag_check field present')
it('pain_score 4 → protocol_id present, show_exercise_card true')
it('frozen_shoulder phase 1 → zero exercises with clinical_tag "stretch"')
it('frozen_shoulder phase 1 → contains pendulum exercise')
it('other condition, no prohibit → all exercises pass filter')
it('tendon + pain 3 → response contains working signal language')
it('tendon + pain 5 → response says reduce range, NOT stop')
it('pain_score 4 + tendon track → response_type tendon_working_signal, show_exercise_card true, protocol unchanged (no isometric swap)')
it('pain_score 4 + joint track → response_type standard, isometric exercise in protocol')
```

## Module: Adaptation Signal Engine

```typescript
it('joint track, last 5 scores all ≥ 4 → adaptation_signal = reduce_intensity')
it('previous score 5, current score 2 → adaptation_signal = post_flare_recovery')
it('pain delta ≤ -2 over last 5 check-ins → adaptation_signal = positive_trajectory')
it('pain flat ±0.5 for 10+ days → adaptation_signal = plateau')
it('reduce_intensity → isometric exercise returned, not standard protocol')
it('post_flare_recovery → 50% volume protocol, response_type = flare_up')
it('positive_trajectory → response_type = standard, peer-nod inline, progression cue in protocol block')
it('reduce_intensity resets when pain ≤ 3 × 3 consecutive days → adaptation_signal = none')
```

## Module: Check-in + AI Context

```typescript
it('day_number = differenceInDays(now, onboarding_completed_at) + 1')
it('day 3–5 + pain unchanged → response_type skeptical')
it('days_since_last_checkin 3 → response_type re_engagement, no guilt')
it('days_since_last_checkin 7 → insight contains "cơ thể vẫn nhớ"')
it('ai response không chứa: !, Tuyệt vời, Cố lên nhé, Streak')
it('ai response không bắt đầu bằng: Tôi hiểu, Chào bạn, Cảm ơn')
it('protocol format = [Tên] · [Thời lượng] · [Địa điểm]')
it('second checkin same day → CHECKIN_ALREADY_EXISTS 409')
it('frozen_shoulder phase 1 AI response → không chứa "kéo giãn" hoặc "stretch"')
```

## Module: Sessions

```typescript
it('PATCH session status=exited → completion_pct saved, không throw')
it('POST complete + feedback=worse → flags condition for review')
```

## Module: Auth

```typescript
it('anonymous_id khởi tạo trong localStorage khi chưa có account')
it('claim-anonymous merges checkins + sessions sang real account')
it('anonymous user access billing endpoint → AUTH_REQUIRED 401')
it('Google OAuth token invalid → AUTH_EXPIRED 401')
it('register with existing email → EMAIL_ALREADY_EXISTS 409')
it('login with wrong password → INVALID_CREDENTIALS 401')
it('forgot-password unknown email → success: true (no email leak)')
it('reset token expired → TOKEN_EXPIRED 401')
it('reset token used twice → TOKEN_ALREADY_USED 401')
it('password < 8 chars → VALIDATION_ERROR 400')
it('apple auth endpoint → NOT_IMPLEMENTED 501')
it('11 login attempts / 15min → RATE_LIMIT_EXCEEDED 429')
it('6 register attempts / 1h → RATE_LIMIT_EXCEEDED 429')
it('4 forgot-password / 1h same email → RATE_LIMIT_EXCEEDED 429')
it('claimSession() → accessToken in store, anonymous_id removed from localStorage')
```

## Module: Billing

```typescript
it('trial user day 7 → show_paywall true')
it('trial user day 6 → show_paywall false')
it('subscription expires_at past → hasActiveAccess false dù status=active trong DB')
it('create-payment anonymous user → AUTH_REQUIRED 401')
it('create-payment → returns order_id + qr_code_url + checkout_url')
it('payment-status before webhook → { status: "pending" }')
it('payment-status after webhook confirm → { status: "confirmed", confirmed_at: non-null }')
it('payment-status after PayOS cancel → { status: "failed" }')
it('payment-status expired → { status: "expired" }')
it('payment-status wrong user → NOT_FOUND 404')
it('polling rate limit: 41 req/min → RATE_LIMIT_EXCEEDED 429')
it('webhook invalid signature → FORBIDDEN 403')
it('webhook duplicate retry → idempotent, no double-subscription')
it('webhook confirm → payos_orders.status = confirmed AND subscription activated (transaction)')
it('6month from 2026-01-31 → 2026-07-31 (không Jan 31 → Feb overflow)')
```

## Module: Notifications

```typescript
it('subscribe valid VAPID → push_subscription created')
it('subscribe same endpoint twice → upsert, not duplicate')
it('dispatch: push sub exists → sends web push, NOT email')
it('dispatch: push sub 410 gone → deactivate sub, fallback email')
it('dispatch: no push sub, email exists → sends email')
it('dispatch: anonymous user, no push sub → { sent: false }')
it('GET pending → only undismissed, max 24h old')
it('POST dismiss → is_dismissed=true, dismissed_at=now')
it('POST dismiss wrong user → NOT_FOUND 404')
it('quiet hours 22:00–06:50 → { sent: false, reason: QUIET_HOURS }')
it('morning_critical_655 → bypasses quiet hours')
it('max 2 notifications/user/day → 3rd: { sent: false, reason: DAILY_LIMIT }')
```

## Module: Assessment

```typescript
it('lumbar_disc intake → assessment_required: true, protocol: null')
it('POST assessment prone_press_up positive → protocol_b')
it('POST assessment inconclusive → protocol_a (safe default)')
it('condition without assessment_required → ASSESSMENT_NOT_REQUIRED 400')
it('POST add-region lumbar_disc → assessment_required: true')
it('POST add-from-suggestion lumbar_disc → assessment_required: true')
```

## Module: Safety Warning

```typescript
it('achilles intake → safety_warning.content_vi non-null')
it('cervical intake → safety_warning = null')
it('add-region achilles → safety_warning present')
it('add-from-suggestion plantar → safety_warning present')
```

## Module: Symptom Map

```typescript
it('"sáng dậy gót chân đau dữ, bước đầu tiên đau nhất" → plantar_fasciitis confidence ≥ 0.70')
it('"cổ cứng sau khi ngủ dậy, xoay đau" → cervical confidence ≥ 0.60')
it('"đau lung tung không rõ" → below_threshold: true')
it('empty string → VALIDATION_ERROR 400')
it('> 500 chars → VALIDATION_ERROR 400')
it('Claude timeout → AI_TIMEOUT 503')
it('AI returns unknown slug → enrichFromCatalog filters, no crash')
it('catalog: second call uses cache, no DB query')
it('P95 latency < 400ms from Singapore')
```

## Module: Freetext Parser

```typescript
it('"hôm nay stress quá, deadline nữa" → signal: stress, confidence ≥ 70')
it('"ngủ có 4 tiếng" → signal: sleep, value_numeric: 4')
it('"đi bộ bình thường" → empty signals')
it('checkin POST returns < 200ms regardless of parser duration (non-blocking)')
it('confidence 69 → NOT inserted to lifestyle_events')
it('confidence 70 → inserted')
```

---

# PHẦN 10 — COST ESTIMATE (1,000 users/tháng)

| Service | Plan | VND/tháng |
|---|---|---|
| DigitalOcean SGP1 | $12/mo Basic | ~300,000 |
| Supabase | Free tier 500MB | 0 |
| Cloudflare Stream | ~500 views/day × 30 × $0.001 | ~375,000 |
| Claude Haiku | ~500 calls/day × $0.0008 | ~320,000 |
| Vercel | Free → Pro $20/mo > 100GB | 0 → ~500,000 |
| PostHog | Free cloud (1M events/mo) | 0 |
| Resend email | Free 3,000/mo | 0 |
| **Total fixed** | | **~995,000–1,495,000đ (~$40–60/mo)** |

PayOS: 0 setup + 1.5–2% per transaction.
ESMS: ~800,000đ/mo nếu dùng optional 2FA (hiện chưa implement).

---

# PHẦN 11 — DEVELOPMENT PHASES

| Phase | Scope | Gate | Week |
|---|---|---|---|
| **P0: Foundation** | DB schema (tất cả tables v1.5), anonymous auth, Fastify skeleton, Astro + Tailwind + Zustand setup, VAPID key generation | `npm run dev` chạy. Anonymous session end-to-end. `push_subscriptions` table tồn tại. | 1–2 |
| **P1: Core Loop** | Onboarding: S03b path chooser + S04A tab toggle + symptom-map (B1). Rule-based protocol. Assessment fork (B2) cho lumbar_disc + rotator_cuff + sciatica. Safety warnings (B3). Exercise player + offline SW. `createConditionWithPhaseGate()`. | First user hoàn thành D1 exercise. Assessment fork routes đúng. Safety warning hiện với achilles. | 3–5 |
| **P2: AI Layer** | Claude integration + FITWELL_SYSTEM_PROMPT + MSK-1–6. Pain5 branch. Context builder. Typing indicator 800ms. Frozen shoulder Phase 1 filter (B4). Lifestyle trigger detection. | AI response < 1.5s P95. Pain5 verified. Frozen shoulder: không có exercise "stretch". | 5–6 |
| **P3: Daily Loop** | Check-in + freetext parser (async). Email retention sequence. `InAppBanner.tsx` + `GET /notifications/pending`. Web push SW handler + S30 permission screen. Progress tab. | Web push subscribe end-to-end Chrome Android. iOS in-app banner hiện khi focus. Email D+2 gửi đúng. | 7–8 |
| **P4: Progress + Pattern** | Pain chart, consistency score, Day 7 summary. Pattern detection cron. Phase gate evaluator. Schedule builder (multi-condition). Morning critical timing (06:55). | Phase unlock triggers đúng. Pattern suggestion hiện D14+. SMSK05 multi-condition hiện. | 9–10 |
| **P5: Conversion** | Paywall D7. Google OAuth + email/password sign-up (NO magic link). PayOS 2-path: desktop QR poll + mobile redirect. S19b. S29 add-condition modal. Subscription state. | Desktop QR polling confirm end-to-end. Mobile redirect return OK. Google OAuth claim anonymous data. | 10–12 |
| **P6: Launch Prep** | PostHog funnel events. Sentry. Vercel deploy + custom domain. VAPID production keys. exercises.clinical_tags audit (OI-4). Perf audit. Health endpoint. | P95 API < 500ms. Web push on production domain. PostHog funnel onboarding → paywall visible. `/api/v1/health` → 200. | 12–14 |

**Pre-phase gate open items:**

| # | Item | Resolve before | Status |
|---|---|---|---|
| OI-1 | Multi-condition assessment UX: 2 assessment forks cùng lúc | P1 gate | ✅ RESOLVED — Sequential tab unlock logic in SMSK07 screen spec. Frontend-only. Endpoint already sufficient. |
| OI-2 | PayOS expired link (>15min): frontend retry flow | P5 gate | 🔵 OPEN |
| OI-3 | Web push deny = 1 attempt, no retry — document rõ in S30 component | P3 gate | ✅ RESOLVED — Documented in S30 screen spec Edge Cases. Backend correct in section 5.8. |
| OI-4 | exercises.clinical_tags: audit tất cả seed entries — ≥1 movement type tag | P6 gate | 🔵 OPEN |

---

# PHẦN 12 — MIGRATION PATH → NATIVE APP

Sau khi Web MVP validate unit economics:

```
Backend API:      Giữ nguyên 100% — Fastify endpoints không thay đổi
DB schema:        Giữ nguyên 100%
AI system prompt: Giữ nguyên 100%
Frontend:         Rebuild Flutter — dùng toàn bộ API contracts đã validate
Auth:             Thêm Apple SSO (bắt buộc iOS App Store) + giữ Google + email/password
Push notif:       Thêm FCM — email sequence vẫn chạy song song
Analytics:        Thêm Firebase Analytics — PostHog giữ cho cross-platform funnel
```

---

# PHẦN 13 — PRODUCTION READINESS CHECKLIST

```
Schema & DB:
□ Tất cả 24 migrations reviewed và sequenced (001–024)
□ exercises.clinical_tags: mọi seed entry có ≥1 movement type tag (OI-4)
□ msk_conditions.insight_hook_vi: 20 entries populated
□ msk_conditions.safety_warning_vi: achilles + plantar_fasciitis + rotator_cuff seeded
□ msk_conditions.assessment_required: lumbar_disc, rotator_cuff, sciatica = TRUE

Auth & Security:
□ JWT_SECRET set (≥32 chars random) trong DigitalOcean env
□ Supabase RLS: DISABLED confirmed trên tất cả tables
□ SUPABASE_SERVICE_ROLE_KEY: KHÔNG trong Vercel env vars
□ grep codebase: 'supabase.from(' → 0 results ngoài auth module
□ Rate limits tested: login (10/15min), register (5/1h), forgot-pwd (3/1h)
□ httpOnly cookie: fw_refresh set correctly, not readable by JS

Web Push:
□ VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY generated + set trong DO env
□ GET /api/v1/config/push-key → accessible without auth
□ Web push end-to-end: Chrome Android subscribe → server send → notification appears
□ iOS in-app banner: GET /notifications/pending polling tested trên iPhone Safari
□ Quiet hours 22:00–06:50 enforced, morning_critical_655 bypasses

Payment:
□ PAYOS_WEBHOOK_SECRET từ PayOS dashboard → set trong DO env
□ PayOS webhook URL registered: https://api.fitwell.vn/api/v1/billing/payos-webhook
□ Desktop QR path end-to-end: create → poll → confirm
□ Mobile redirect path end-to-end: redirect → return → confirm
□ calculateExpiry month-end cases tested (Jan 31, Mar 31)

AI:
□ FITWELL_SYSTEM_PROMPT + MSK-1 đến MSK-6 in prompt
□ Pain 5 → no protocol verified in staging
□ Frozen shoulder Phase 1 → no stretch exercises verified
□ Symptom-map P95 < 400ms from Singapore
□ Freetext parser non-blocking: checkin POST < 200ms regardless

Monitoring:
□ Sentry connected (backend + frontend)
□ PostHog funnel: onboarding → check-in → exercise → paywall visible
□ GET /api/v1/health → 200 on production domain
□ DigitalOcean uptime monitor pointing to /api/v1/health
```

---

*FitWell Tech Spec v1.5.2 — March 2026*
*Single source of truth. Không cần đọc v1.2, v1.3, v1.4, v1.4.1, v1.5, v1.5.1 patch.*
*Nguyên tắc: Validate CAC và first value trên web trước. Build native app khi unit economics đã rõ.*
