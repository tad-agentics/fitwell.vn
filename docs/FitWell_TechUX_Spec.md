# FitWell — Tech & UX Specification
**Version 2.0 — MVP Scope**
*North Star Reference for Solo Dev Build*

### Changelog
| Version | Change |
|---|---|
| 2.0 | Repositioned product scope: alcohol no longer required entry point. Three primary conditions tracked — gout/uric acid, high cholesterol/lipids, back pain/posture — plus stress/cortisol/sleep as upstream variable for all three. Schema changes: `profiles.primary_conditions[]`, `checkins.body_feeling` adds 'sore', `checkins.afternoon_state` adds 'back_tight', `checkins` post_event adds `event_type` column, `micro_actions.category` expands to 8 categories (adds uric_acid_management, metabolic_reset, spinal_decompression, desk_break; renames heavy_night_recovery → post_event_recovery, post_meal → metabolic_reset). Scenario library expands: new categories 'desk_marathon', 'stress_week'; `content_vi/en` schema renames `alcohol_strategy` → `meal_strategy`. Onboarding life-pattern questions rewritten for non-drinker path. Protocol weighting engine updated for 4-condition stack. Action library: 8 categories, 24 actions. Brief intelligence queries extended to cover desk patterns and back pain indicators. Video count: 24 videos, ~7 environments. |
| 1.3 | Video-driven micro-actions (Wakeout-style short exercise videos replace text-only timer); IBM Plex Mono replaces DM Mono globally (Vietnamese diacritic clipping fix); Colour system aligned to Design System v1.0 — navy `#041E3A` primary, teal removed; `micro_actions` schema extended with video columns; Action Library Browse + Category View screens added; Home screen state machine routing spec; Recovery protocol cards updated with video thumbnails; Offline video fallback to text-only timer; Video CDN + Supabase Storage for media delivery |
| 1.2 | Weekly Brief elevated to required weekly ritual with Monday gate (week 4+); Free tier restructured to 2×Day 1 cycles before paywall at Day 2 |
| 1.1 | Added Notification Governor Layer; Onboarding Aha Moment intercept; Micro-action context tags + social survivability; Tiered Weekly Brief intelligence engine |
| 1.0 | Initial spec |

---

## 0. Document Scope

This spec covers everything needed to build and ship the FitWell MVP as a React PWA. It is opinionated where opinions prevent rework later. Where trade-offs exist, the rationale is stated. Phase 2 items are flagged clearly and not specced — they exist only as design constraints on MVP decisions.

---

## 1. Tech Stack

### Frontend
| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 18 + Vite | Fast HMR, excellent PWA plugin support, solo-dev friendly |
| Language | TypeScript | Catches schema mismatches early — critical with Supabase |
| Styling | Tailwind CSS | Utility-first, no CSS file sprawl for a solo dev |
| Component library | shadcn/ui | Unstyled, composable, works with Tailwind, no vendor lock-in |
| State management | Zustand | Lightweight, no boilerplate, sufficient for this complexity level |
| Data fetching | TanStack Query (React Query) | Caching, background refetch, optimistic updates for check-ins |
| Routing | React Router v6 | Standard, well-documented |
| Forms | React Hook Form + Zod | Validation matches Supabase schema types cleanly |
| i18n | i18next + react-i18next | Industry standard, supports Vietnamese, lazy-loads language files |
| Fonts | Be Vietnam Pro + IBM Plex Mono + DM Serif Display | Be Vietnam Pro for all UI/body (Vietnamese diacritics); IBM Plex Mono for CTAs, badges, labels; DM Serif Display for timer countdown + biomarker display only |
| PWA | vite-plugin-pwa (Workbox) | Service worker, offline support, Add to Home Screen prompt management |
| Video | HTML5 `<video>` (native) | Looping exercise demonstration videos — no third-party player library needed |

### §1a — Font: IBM Plex Mono *(retained from v1.3)*

DM Mono clips stacked Vietnamese diacritics (ớ, ế, ứ, ở) in uppercase rendering. IBM Plex Mono renders all Vietnamese uppercase diacritics correctly on both iOS Safari 16.4+ and Android Chrome 80+.

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Be+Vietnam+Pro:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Backend
| Layer | Choice | Rationale |
|---|---|---|
| Platform | Supabase | Auth, Postgres, real-time, storage, edge functions — sufficient for MVP without managing infra |
| Database | PostgreSQL (via Supabase) | Structured biomarker and check-in data needs relational integrity |
| Auth | Supabase Auth | Email/password + magic link; household plan needs linked accounts |
| Edge Functions | Supabase Edge Functions (Deno) | Scheduled triggers for notifications, pattern analysis, governor logic |
| Storage | Supabase Storage | Exercise demonstration videos + thumbnails |
| Push Notifications | Web Push API + VAPID keys | Stored subscription objects in Supabase; delivery via Edge Function |

### §1b — Video Delivery *(retained from v1.3)*

| Layer | Choice | Rationale |
|---|---|---|
| Storage | Supabase Storage (MVP) → Cloudflare R2 (scale) | Supabase Storage is sufficient at MVP traffic. Migrate to R2 when bandwidth cost matters (>500 active users). |
| Format | MP4 (H.264) primary, WebM fallback | H.264 has universal iOS/Android support. |
| Thumbnails | Static JPEG, ~15KB each | First frame of each video, served from same storage bucket. |
| CDN | Supabase CDN (MVP) → Cloudflare CDN (scale) | Edge caching for video delivery. |
| Offline | Service worker caches thumbnails only | Full videos NOT cached offline — too large. Text-only timer fallback (see §4c). |

### Payment
| Layer | Choice |
|---|---|
| Gateway | PayOS |
| Integration | PayOS SDK + webhook endpoint via Supabase Edge Function |
| Subscription management | Manual in Supabase (no Stripe-style subscription engine at MVP scale) |

### Hosting
| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Vercel | Zero-config React/Vite deploy, edge CDN, free tier sufficient for MVP |
| Backend | Supabase Cloud | Managed, free tier covers MVP traffic |
| Domain | Custom domain on Vercel | Required for PWA Add to Home Screen and web push |

---

## 2. Database Schema

### Design Principles
- All tables use UUID primary keys
- `created_at` and `updated_at` on every table (Supabase trigger handles `updated_at`)
- Row Level Security (RLS) enabled on all tables — users can only read/write their own data
- Household plan uses a `household_id` foreign key to link two user profiles

---

### Tables

#### `profiles`
Extends Supabase `auth.users`. One row per user.

```sql
create table profiles (
  id uuid references auth.users(id) primary key,
  display_name text,
  role text check (role in ('primary', 'partner')) default 'primary',
  household_id uuid references households(id),
  language text check (language in ('vi', 'en')) default 'vi',
  -- *** v2.0: primary conditions declared at onboarding ***
  primary_conditions text[] default '{}',
  -- e.g. ['uric_acid', 'cholesterol', 'back_pain']
  -- Used by protocol engine to weight action categories
  notification_morning_time time default '07:00',
  notification_midday_enabled boolean default true,
  notification_presleep_enabled boolean default true,
  onboarding_complete boolean default false,
  free_post_event_checkins_used int default 0,
  brief_weeks_completed int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `households`

```sql
create table households (
  id uuid primary key default gen_random_uuid(),
  primary_user_id uuid references profiles(id),
  partner_user_id uuid references profiles(id),
  created_at timestamptz default now()
);
```

#### `biomarkers`
One row per biomarker entry per user. Historical records preserved.

```sql
create table biomarkers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  marker_type text check (marker_type in (
    'uric_acid', 'triglycerides', 'ast', 'alt', 'hba1c',
    'hdl', 'ldl', 'fasting_glucose', 'total_cholesterol'
  )) not null,
  value numeric not null,
  unit text not null, -- 'mg/dL', 'mmol/L', '%', 'U/L'
  tested_at date not null,
  notes text,
  created_at timestamptz default now()
);
```

> **v2.0 note:** Back pain is a subjective, daily-variable symptom — not a single lab value. It is tracked via `checkins.body_feeling = 'sore'` and a daily pain score field added to morning check-ins (see `checkins` below), not as a `biomarkers` row. This keeps biomarkers table for objective lab-measured values only.

#### `scenarios`
Scenario playbook content library. Seeded by admin. *(v2.0: expanded categories; `content_vi/en` schema updated)*

```sql
create table scenarios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  -- Examples: 'nhau-seafood', 'korean-bbq-late', 'tet-family',
  --           'desk-marathon', 'stress-deadline', 'travel-business', 'wedding-dinner'
  name_vi text not null,
  name_en text not null,
  -- *** v2.0: expanded category enum ***
  category text check (category in (
    'social',         -- nhậu, KTV, wedding, Tết — social eating/drinking
    'work_meal',      -- business lunch/dinner (may or may not involve alcohol)
    'home_meal',      -- family dinner, rich home meal, holiday feast
    'desk_marathon',  -- *** v2.0: 10-hour desk day, back-to-back meeting day ***
    'stress_week',    -- *** v2.0: deadline crunch, performance period, high-pressure week ***
    'travel',         -- business trip, airport, hotel
    'late_night'      -- late finish, post-midnight work
  )),
  risk_level int check (risk_level between 1 and 5),
  -- *** v2.0: content schema — 'alcohol_strategy' renamed to 'meal_strategy' ***
  -- content_vi / content_en jsonb structure:
  -- {
  --   preload: string[],        -- what to do/eat before
  --   rules: string[],          -- 3 non-negotiable rules
  --   avoid: string,            -- single highest-damage item
  --   meal_strategy: string,    -- food/drink sequencing advice (replaces alcohol_strategy)
  --   fallback: string[],       -- if arrived without reading first
  --   desk_breaks: string[],    -- desk/stress scenarios only: break protocol timing
  --   recovery_morning: string  -- what to do the morning after
  -- }
  content_vi jsonb not null,
  content_en jsonb not null,
  -- *** v2.0: condition_tags replaces biomarker_tags for cleaner protocol routing ***
  condition_tags text[],
  -- e.g. ['uric_acid', 'cholesterol'] for seafood dinner
  -- e.g. ['back_pain', 'stress'] for desk marathon
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Scenario seed library — MVP minimum (20 scenarios):**

| Slug | Name (VI) | Category | Condition Tags | Risk |
|---|---|---|---|---|
| nhau-seafood | Nhậu Hải Sản | social | uric_acid, cholesterol | 5 |
| korean-bbq-late | BBQ Hàn Quốc Khuya | social | uric_acid, cholesterol | 5 |
| tet-family | Tiệc Tết Gia Đình | home_meal | uric_acid, cholesterol | 4 |
| wedding-dinner | Tiệc Cưới | social | uric_acid, cholesterol | 4 |
| business-lunch | Bữa Trưa Công Việc | work_meal | cholesterol, uric_acid | 3 |
| business-dinner | Bữa Tối Công Việc | work_meal | cholesterol, uric_acid | 4 |
| seafood-family | Tiệc Hải Sản Gia Đình | home_meal | uric_acid, cholesterol | 4 |
| pho-morning | Phở Bữa Sáng Thường Xuyên | home_meal | uric_acid | 2 |
| airport-lounge | Phòng Chờ Sân Bay | travel | cholesterol, stress | 3 |
| hotel-business | Công Tác Khách Sạn | travel | cholesterol, back_pain, stress | 3 |
| desk-marathon | Ngày Làm Việc 10 Tiếng | desk_marathon | back_pain, stress | 3 |
| back-to-back-meetings | Ngày Họp Liên Tục | desk_marathon | back_pain, stress | 3 |
| conference-day | Ngày Hội Thảo / Đào Tạo | desk_marathon | back_pain, stress | 2 |
| deadline-week | Tuần Deadline | stress_week | stress, cholesterol, back_pain | 4 |
| performance-review | Tuần Đánh Giá / Báo Cáo | stress_week | stress, cholesterol | 3 |
| team-conflict-week | Tuần Xử Lý Xung Đột | stress_week | stress, back_pain | 3 |
| late-night-work | Làm Việc Khuya Liên Tục | late_night | stress, cholesterol | 3 |
| ktv-night | Tối KTV | social | uric_acid, cholesterol | 4 |
| long-flight | Chuyến Bay Dài | travel | back_pain, cholesterol | 3 |
| home-rich-meal | Bữa Cơm Nhà Nhiều Món | home_meal | uric_acid, cholesterol | 2 |

#### `scenario_sessions`

```sql
create table scenario_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  scenario_id uuid references scenarios(id) not null,
  accessed_at timestamptz default now(),
  day_of_week int,
  hour_of_day int
);
```

#### `checkins`
Stores all four trigger types in one table with a `trigger_type` discriminator. *(v2.0: expanded enums)*

```sql
create table checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  trigger_type text check (trigger_type in (
    'morning_baseline', 'post_event', 'midday_desk', 'presleep'
  )) not null,

  -- morning_baseline fields
  sleep_quality text check (sleep_quality in ('well', 'broken', 'badly')),
  -- *** v2.0: 'sore' added — signals gout flare risk or acute back pain ***
  body_feeling text check (body_feeling in ('good', 'stiff', 'sore', 'drained')),
  -- *** v2.0: daily back pain score (0 = none, 10 = severe) — morning only ***
  back_pain_score int check (back_pain_score between 0 and 10),
  -- Only collected if user has 'back_pain' in primary_conditions
  -- Shown as a single tap-scale: 0 | 1–3 | 4–6 | 7–10

  -- post_event fields
  event_intensity text check (event_intensity in ('heavy', 'medium', 'light')),
  -- *** v2.0: event_type classifies what kind of situation just occurred ***
  event_type text check (event_type in (
    'rich_meal',   -- high-purine/high-fat meal (most common non-alcohol trigger)
    'heavy_night', -- alcohol-involved, late night
    'long_desk',   -- 8+ hour desk day
    'stress_day',  -- high-pressure day, cortisol-heavy
    'travel',      -- flight, time zone, hotel
    'poor_sleep'   -- bad night unrelated to an event
  )),
  linked_scenario_id uuid references scenarios(id),

  -- midday_desk fields
  -- *** v2.0: 'back_tight' added as fourth option ***
  afternoon_state text check (afternoon_state in (
    'focused', 'flat', 'fried', 'back_tight'
  )),

  -- presleep fields
  wind_down_ready boolean,

  -- shared
  checked_in_at timestamptz default now(),
  day_of_week int,
  hour_of_day int
);
```

**Check-in routing map — v2.0:**

| Trigger | Response | Routes to Category | Action Priority |
|---|---|---|---|
| Morning — body_feeling | good | morning_activation | Standard weight |
| Morning — body_feeling | stiff | spinal_decompression → morning_activation | Back pain weight |
| Morning — body_feeling | sore | uric_acid_management → spinal_decompression | Gout weight |
| Morning — body_feeling | drained | stress_mental → morning_activation | Stress weight |
| Morning — back_pain_score | 7–10 | spinal_decompression (priority override) | Back pain acute |
| Post-event — event_type | rich_meal | uric_acid_management → metabolic_reset | Gout + cholesterol |
| Post-event — event_type | heavy_night | post_event_recovery → uric_acid_management | Recovery + gout |
| Post-event — event_type | long_desk | spinal_decompression → desk_break | Back pain |
| Post-event — event_type | stress_day | stress_mental → sleep_priming | Cortisol |
| Post-event — event_type | travel | post_event_recovery → spinal_decompression | Recovery + back |
| Post-event — event_type | poor_sleep | sleep_priming → morning_activation | Sleep debt |
| Midday — afternoon_state | flat | desk_break → metabolic_reset | Sedentary |
| Midday — afternoon_state | fried | stress_mental → desk_break | Cortisol |
| Midday — afternoon_state | back_tight | spinal_decompression | Back pain acute |
| Pre-sleep | ready | sleep_priming | All conditions |

#### `micro_actions`
*(v2.0: 8 categories, 24 actions. Category enum expanded.)*

```sql
create table micro_actions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  -- *** v2.0: 8 category enum ***
  category text check (category in (
    'morning_activation',   -- A: daily startup
    'uric_acid_management', -- B: gout / uric acid — *** new v2.0 ***
    'metabolic_reset',      -- C: cholesterol / lipids — *** new v2.0 ***
    'spinal_decompression', -- D: back pain / posture — *** new v2.0 ***
    'stress_mental',        -- E: cortisol regulation (was 'stress_mental')
    'sleep_priming',        -- F: sleep quality (was 'sleep_priming')
    'post_event_recovery',  -- G: post-event / heavy night (was 'heavy_night_recovery')
    'desk_break'            -- H: desk sedentary breaks (was 'desk_sedentary')
  )) not null,
  name_vi text not null,
  name_en text not null,
  duration_seconds int not null,
  instruction_vi text not null,
  rationale_vi text not null,
  instruction_en text not null,
  rationale_en text not null,
  trigger_conditions jsonb,
  -- {checkin_trigger, intensity, condition_tags[]}
  -- *** v2.0: condition_tags replaces biomarker_tags ***
  condition_tags text[],
  -- ['uric_acid'] | ['cholesterol'] | ['back_pain'] | ['stress'] | ['any']
  context_tags text[] not null,
  -- ['office_visible','seated'] | ['private'] | ['any']
  -- Video fields (from v1.3)
  video_url text,
  video_thumb_url text,
  video_duration_ms int,
  rep_markers jsonb,
  created_at timestamptz default now()
);
```

**Action library seed — 24 actions across 8 categories:**

| Slug | Name (VI) | Category | Duration | Context | Condition Tags |
|---|---|---|---|---|---|
| wall-sit | Wall Sit | morning_activation | 120s | private | any |
| standing-hip-hinge | Standing Hip Hinges | morning_activation | 180s | private | any |
| cold-water-face | Cold Water Face Reset | morning_activation | 60s | private | any |
| uric-acid-flush | Uống Nước Buổi Sáng | uric_acid_management | 180s | any | uric_acid |
| ankle-big-toe-mobility | Cử Động Mắt Cá & Ngón Cái | uric_acid_management | 240s | private | uric_acid |
| post-meal-walk | Đi Bộ Sau Ăn | uric_acid_management | 300s | any | uric_acid, cholesterol |
| postprandial-squat | Squat Sau Bữa Ăn | metabolic_reset | 180s | private | cholesterol |
| desk-calf-raises | Kiễng Gót Chân Tại Bàn | metabolic_reset | 120s | office_visible | cholesterol |
| breathing-lipid-reset | Thở Sâu Phục Hồi Lipid | metabolic_reset | 240s | any | cholesterol, stress |
| lumbar-floor-release | Nằm Thư Giãn Thắt Lưng | spinal_decompression | 180s | private | back_pain |
| doorframe-chest-opener | Mở Ngực Khung Cửa | spinal_decompression | 120s | office_visible | back_pain |
| thoracic-rotation-standing | Xoay Lưng Ngực Đứng | spinal_decompression | 180s | office_visible | back_pain |
| breathing-4-7-8 | Thở 4-7-8 | stress_mental | 240s | any | stress |
| jaw-release | Thư Giãn Hàm | stress_mental | 120s | any | stress |
| standing-tension-sweep | Quét Căng Thẳng Đứng | stress_mental | 180s | private | stress |
| supine-spinal-twist | Xoay Cột Sống Nằm | sleep_priming | 180s | private | back_pain, stress |
| progressive-muscle-relax | Thư Giãn Cơ Tiến Tiến | sleep_priming | 300s | private | stress, back_pain |
| blue-light-wind-down | Tắt Màn Hình & Hạ Nhiệt | sleep_priming | 120s | private | any |
| supine-knee-hugs | Ôm Gối Nằm Ngửa | post_event_recovery | 180s | private | any |
| post-night-hydration | Bù Nước Sau Đêm Nặng | post_event_recovery | 180s | any | uric_acid |
| hotel-floor-circuit | Bài Tập Sàn Khách Sạn | post_event_recovery | 300s | private | any |
| desk-blood-flow-circuit | Bài Tập Lưu Thông Bàn Làm | desk_break | 180s | office_visible | any |
| eye-neck-reset | Mắt & Cổ Reset | desk_break | 120s | office_visible | stress, back_pain |
| standing-spinal-extension | Duỗi Lưng Đứng | desk_break | 120s | office_visible | back_pain |

**Context tag reference (updated v2.0):**

| Action | context_tags |
|---|---|
| Desk Calf Raises | `['office_visible', 'seated', 'any']` |
| Eye & Neck Reset | `['office_visible', 'seated', 'any']` |
| 4-7-8 Breathing | `['office_visible', 'seated', 'any']` |
| Jaw Release | `['office_visible', 'seated', 'any']` |
| Doorframe Chest Opener | `['office_visible', 'standing']` |
| Thoracic Rotation Standing | `['office_visible', 'standing']` |
| Desk Blood Flow Circuit | `['office_visible', 'standing']` |
| Standing Spinal Extension | `['office_visible', 'standing']` |
| Breathing Reset | `['office_visible', 'seated', 'any']` |
| Post-Meal Walk | `['any']` |
| Post-Night Hydration | `['any']` |
| Uric Acid Morning Flush | `['any']` |
| Blue Light Wind-Down | `['private']` |
| Wall Sit | `['private', 'standing']` |
| Standing Hip Hinges | `['private', 'standing']` |
| Ankle & Toe Mobility | `['private', 'seated']` |
| Postprandial Squat | `['private', 'standing']` |
| Lumbar Floor Release | `['private']` |
| Supine Knee Hugs | `['private']` |
| Supine Spinal Twist | `['private']` |
| Progressive Muscle Relaxation | `['private']` |
| Standing Tension Sweep | `['private']` |
| Cold Water Face Reset | `['private']` |
| Hotel Floor Circuit | `['private']` |

**Video production reference — 7 shoot environments (v2.0 additions bold):**

| Environment | Actions (videos) | Setup |
|---|---|---|
| Bedroom / beside bed | Supine Knee Hugs, Lumbar Floor Release, Supine Spinal Twist, Progressive Muscle Relaxation, Pre-Sleep Forward Fold | Floor + bed edge. Morning light, warm neutral tone. |
| Standing / doorframe | Wall Sit, Standing Hip Hinges, Doorframe Chest Opener, Thoracic Rotation Standing, **Standing Tension Sweep**, **Standing Spinal Extension** | Clean wall/doorframe. Minimal background. |
| Desk / seated | Desk Calf Raises, Eye & Neck Reset, 4-7-8 Breathing, Jaw Release, **Desk Blood Flow Circuit** | Simple desk + chair. Laptop screen off or blurred. |
| Bathroom | Cold Water Face Reset | Sink/mirror. Waist-up only. |
| Outdoor / corridor | Post-Meal Walk, **Ankle & Toe Mobility** | Hallway or quiet street. Movement from behind — no face. |
| Hotel room | Hotel Floor Circuit | Hotel room floor. No branded hotel items. |
| **Kitchen / standing (new)** | **Post-Night Hydration**, **Uric Acid Morning Flush** | Counter-height. Person drinking 500ml water, glass in frame. 180s ambient — no dramatic movement. |

**Video format spec:** *(unchanged from v1.3)*
- 9:16 vertical, 1080×1920 recorded, served at 720×1280
- Duration matches action exactly — seamless loop (start position = end position)
- MP4 (H.264), target < 3MB per video at 720p. 24 videos, ~72MB total.
- Silent — no audio track. 30fps. Static camera. Single continuous shot.
- No faces in frame — body/hands/feet only
- Warm neutral colour grade, soft natural light, no gym environments

#### `action_sessions` *(unchanged)*

```sql
create table action_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  action_id uuid references micro_actions(id) not null,
  checkin_id uuid references checkins(id),
  status text check (status in ('completed', 'skipped')) not null,
  context_selected text,
  duration_actual_seconds int,
  completed_at timestamptz default now(),
  day_of_week int,
  hour_of_day int
);
```

#### `recovery_protocols` *(unchanged)*

```sql
create table recovery_protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  checkin_id uuid references checkins(id) not null,
  day int check (day between 1 and 3) not null,
  action_sequence uuid[],
  status text check (status in ('active', 'complete', 'abandoned')) default 'active',
  started_at timestamptz default now(),
  completed_at timestamptz
);
```

#### `push_subscriptions` *(unchanged)*

```sql
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  subscription jsonb not null,
  device_hint text,
  created_at timestamptz default now(),
  last_used_at timestamptz
);
```

#### `notification_governor` *(unchanged from v1.1)*

```sql
create table notification_governor (
  user_id uuid references profiles(id) primary key,
  pushes_sent_today int default 0,
  last_push_sent_at timestamptz,
  last_push_opened_at timestamptz,
  consecutive_ignored int default 0,
  mode text check (mode in ('full', 'reduced', 'weekly_only')) default 'full',
  mode_changed_at timestamptz,
  updated_at timestamptz default now()
);
```

**Governor rules** *(unchanged — see §5 for full governor logic)*

#### `subscriptions` *(unchanged)*

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  plan text check (plan in (
    'individual_quarterly', 'individual_annual', 'household_annual'
  )) not null,
  status text check (status in ('active', 'expired', 'cancelled')) default 'active',
  payos_order_id text,
  started_at timestamptz not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
```

#### `weekly_briefs` *(unchanged)*

```sql
create table weekly_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  week_start date not null,
  insight_tier int check (insight_tier between 1 and 4) not null,
  content_vi jsonb not null,
  content_en jsonb not null,
  generated_at timestamptz default now(),
  delivered_at timestamptz
);
```

---

## 3. Application Architecture

### Folder Structure
```
src/
  app/
    (auth)/
    (onboarding)/
    (main)/
      home/
      scenario/
      checkin/
      action/
      actions/
      recovery/
      brief/
      profile/
      household/
      payment/
  components/
    ui/
    checkin/
    action/
    scenario/
    brief/
    video/
  lib/
    supabase.ts
    push.ts
    i18n.ts
    payos.ts
    governor.ts
    insights.ts
    video.ts
    protocol.ts  -- *** v2.0: condition weighting + action selection engine ***
  hooks/
    useVideoPlayer.ts
    useConditionWeight.ts  -- *** v2.0: reads primary_conditions, returns category weights ***
  store/
  types/
  locales/
    vi/
    en/
  assets/
    videos/
```

### Auth Flow *(unchanged)*
- Email + password registration
- Magic link login
- Supabase session persisted via Supabase client
- RLS enforces data isolation

### Household Link Flow *(unchanged)*
1. Primary user completes onboarding
2. Generates signed invite link (expires 72 hours)
3. Partner clicks link, registers or logs in
4. Edge Function links both profiles to a `households` row
5. Partner sees Home Environment view

---

## 4. UX Flows

### Design Principles *(unchanged)*
- Vietnamese-first: all default copy in Vietnamese, English toggle available
- Fonts: Be Vietnam Pro (UI/body), IBM Plex Mono (labels/CTAs/badges), DM Serif Display (timer number, biomarker display only)
- Colour: Navy `#041E3A`, grey surface `#F5F5F5`, white cards `#FFFFFF`, grey text `#9D9FA3`, grey dividers `#EBEBF0`, gold accent `#8C693B` (max 2 instances), amber `#D97706`, risk `#DC2626`, success `#059669`
- No gamification. No streaks. No progress rings.
- Every screen operable with one thumb, in low light, half-awake
- Maximum 2 taps to reach any core action from home screen

---

### Onboarding Flow (4 Steps + Aha Intercept) *(v2.0 updates)*

**Step 1 — Language Selection** *(unchanged)*

**Step 2 — Condition & Biomarker Input** *(v2.0: condition declaration added before biomarkers)*

Screen 2a — Condition Declaration:
Headline: *"Bạn đang quản lý vấn đề sức khỏe nào?"*
Multi-select cards (select all that apply):
- Axit uric cao / Gout
- Mỡ máu cao / Cholesterol
- Đau lưng mãn tính
- Tôi chưa chắc — chỉ có kết quả xét nghiệm

Selection writes to `profiles.primary_conditions[]`. This drives action category weighting throughout the product.

Screen 2b — Biomarker Input:
Headline: *"Nhập kết quả xét nghiệm gần nhất"*
- Marker dropdown pre-sorted by declared conditions (uric acid first if gout selected, LDL first if cholesterol selected)
- Numeric input, unit auto-selected, date of test
- Skip option available — completable later in Profile

**→ Aha Intercept** *(v2.0: personalised to declared conditions)*
Content pulled by `condition_tags` match. A gout user sees a uric acid insight. A cholesterol user sees a lipid insight. A back pain user sees a posture pattern. If all three declared: shows the upstream connection between them.

**Step 3 — Life Pattern** *(v2.0: rewritten for non-drinker path)*
One question per screen, large tap targets:

1. *Bạn thường ngồi làm việc bao nhiêu tiếng mỗi ngày?* — Dưới 6 / 6–8 / Hơn 8 tiếng
2. *Bạn ăn tối ngoài nhà mấy lần mỗi tuần?* — 1–2 / 3–4 / 5+
3. *Lưng hoặc cổ có bị cứng hoặc đau thường xuyên không?* — Hiếm khi / Đôi khi / Thường xuyên
4. *Môi trường nào là rủi ro cao nhất với sức khỏe của bạn?* — Bữa hải sản / Bữa BBQ / Bàn làm việc / Căng thẳng công việc / Công tác
   *(multi-select, up to 2)*
5. *Ai cùng sử dụng tài khoản này?* — Chỉ mình tôi / Tôi + vợ/người thân

> **Design note:** Question 3 (alcohol frequency from v1.3) is removed as the primary life pattern signal. It is captured only as part of the scenario search/filter interaction and is not required to use the product.

**Step 4 — Activation Event** *(v2.0: expanded event types)*
Headline: *"Tuần này bạn có buổi nào cần chuẩn bị không?"*

Four option cards:
- Bữa ăn nhiều (hải sản / BBQ / tiệc)
- Nhậu / sự kiện xã giao
- Ngày làm việc dày
- Chưa có — bắt đầu với sáng mai

Date/time picker for the first three. On confirm: schedules pre-game push 2 hours before. Fourth option: schedules Morning Baseline for 7 AM tomorrow.

---

### §4a — Home Screen State Machine *(unchanged from v1.3)*

| Priority | State | Trigger Condition | What Renders |
|---|---|---|---|
| 1 | Sunday Brief Takeover | `day === Sunday` AND `brief_unread` | Weekly Brief replaces entire home screen |
| 2 | Monday Brief Intercept | `day === Monday` AND `brief_unread` AND `brief_weeks_completed >= 4` | Intercept card before morning check-in |
| 3 | Active Recovery | `active_recovery_protocol !== null` AND `status === 'active'` | Recovery Day card + today's actions |
| 4 | Pre-Situation Countdown | `scheduled_event` AND `event_time - now() < 5 hours` | Navy hero card with countdown + scenario name |
| 5 | Pre-Sleep Wind-Down | `time >= 21:00` AND `presleep_enabled` AND no active recovery | Pre-sleep check-in prompt |
| 6 | Midday Desk | `13:00 ≤ time ≤ 16:00` AND weekday AND no active recovery | Midday check-in if not done today |
| 7 | Clean Day (default) | None of the above | Brief summary card + scenario search + pattern insight (week 4+) |

**Bottom navigation (5 tabs):**
- Tối nay — scenario search → `/scenario/search`
- Check-in — manual trigger → `/checkin`
- Hành động — action library → `/actions`
- Tuần này — weekly brief → `/brief` (amber dot Sunday + Monday)
- Tôi — profile, biomarkers, settings → `/profile`

---

### Scenario Playbook Flow *(v2.0: expanded entry points and categories)*

**Entry points:**
- Home screen search bar (*"Bạn sắp gặp tình huống gì?"*)
- Tonight tab
- Scheduled push notification (2 hours before event)
- Aha Intercept link during onboarding

**Search screen:**
- Text search + category filter chips:
  `TẤT CẢ / HẢI SẢN & NHẬU / BỮA ĂN / VĂN PHÒNG / CĂNG THẲNG / CÔNG TÁC`
  *(v2.0: "Nhậu" replaced as first chip; VĂN PHÒNG and CĂNG THẲNG added)*
- Results ranked by `condition_tags` match to `profiles.primary_conditions`
- Each result shows: scenario name, risk level (1–5 dots), condition tags, estimated read time

**Playbook screen:**
Full-screen, single scroll. Sections in order:
1. **[Scenario Name]** — risk level, condition context line (e.g. "Rủi ro cao cho axit uric + mỡ máu")
2. **Trước khi đến / Trước khi bắt đầu** — pre-load or pre-desk strategy (2–3 items)
3. **3 quy tắc** — numbered, large text, above the fold
4. **Chiến lược bữa ăn / Chiến lược nghỉ ngơi** — meal sequencing for food scenarios, break timing for desk scenarios (`meal_strategy`)
5. **Tránh** — the single highest-damage item or behaviour, bold, red-tinted background
6. **Nếu bạn đã ở đó rồi** — fallback tactics

Bottom sticky bar: *"Vào rồi"* — logs to `scenario_sessions`, starts recovery timer.

---

### Check-In Flow (All 4 Triggers) *(v2.0: updated response options)*

**Design rule (unchanged):** One question per screen. Cards fill 60%+ of viewport. No keyboard input. Maximum 2 screens per check-in.

**Morning Baseline** *(v2.0: 'sore' added + optional back pain score)*

Screen 1: *"Bạn ngủ thế nào?"* — Ngon / Chập chờn / Kém

Screen 2: *"Cơ thể buổi sáng?"*
- Ổn (good)
- Cứng (stiff) — routes to spinal_decompression
- Đau / Khó chịu (sore) — routes to uric_acid_management; flags potential gout morning
- Mệt (drained) — routes to stress_mental

Screen 3 *(conditional — only if user has 'back_pain' in primary_conditions AND body_feeling is 'stiff' or 'sore')*:
*"Lưng đau bao nhiêu?"*
Four tap options rendered as a horizontal scale: Không đau / Nhẹ / Vừa / Nhiều
Writes `checkins.back_pain_score` (0 / 3 / 6 / 9). Adds 10 seconds to check-in. Feeds weekly back pain trend in brief.

→ Writes to `checkins`, triggers `useConditionWeight()`, selects morning protocol

**Post-Event Recovery** *(v2.0: event_type added as second question)*

Screen 1: *"Tối/Ngày qua thế nào?"* — Nặng / Vừa / Nhẹ

Screen 2 *(only if Heavy or Medium)*: *"Đó là buổi gì?"*
- Bữa ăn nhiều (rich_meal)
- Đêm nhậu (heavy_night)
- Ngày làm việc dài (long_desk)
- Ngày căng thẳng (stress_day)
- Công tác / Di chuyển (travel)
- Ngủ kém (poor_sleep)

→ `event_type` + `event_intensity` together drive protocol selection. Heavy + heavy_night = full 3-day protocol. Heavy + long_desk = 2-day spinal + morning sequence.

**Mid-Day Desk** *(v2.0: 'back_tight' added)*

Screen 1: *"Buổi chiều đang thế nào?"*
- Tập trung (focused) — silent dismiss
- Uể oải (flat) — desk_break → metabolic_reset
- Căng thẳng (fried) — stress_mental → desk_break
- Lưng tức (back_tight) — spinal_decompression (priority, immediate)

**Pre-Sleep Wind-Down** *(unchanged)*

Screen 1: *"Sẵn sàng nghỉ chưa?"* — Sẵn rồi / Thêm 20 phút

---

### §4b — Condition Weighting Engine *(new — v2.0)*

**`lib/protocol.ts`**

The protocol engine selects which micro-action categories to surface and in what order, based on:
1. Check-in responses (primary signal)
2. `profiles.primary_conditions[]` (declared weight)
3. Most recent biomarker values (secondary signal)

```typescript
type Condition = 'uric_acid' | 'cholesterol' | 'back_pain' | 'stress';
type ActionCategory =
  | 'morning_activation' | 'uric_acid_management' | 'metabolic_reset'
  | 'spinal_decompression' | 'stress_mental' | 'sleep_priming'
  | 'post_event_recovery' | 'desk_break';

interface ProtocolInput {
  triggerType: 'morning_baseline' | 'post_event' | 'midday_desk' | 'presleep';
  bodyFeeling?: 'good' | 'stiff' | 'sore' | 'drained';
  backPainScore?: number;
  eventIntensity?: 'heavy' | 'medium' | 'light';
  eventType?: 'rich_meal' | 'heavy_night' | 'long_desk' | 'stress_day' | 'travel' | 'poor_sleep';
  afternoonState?: 'focused' | 'flat' | 'fried' | 'back_tight';
  primaryConditions: Condition[];
  latestBiomarkers?: Record<string, number>; // marker_type → value
}

function selectActionCategories(input: ProtocolInput): ActionCategory[] {
  // 1. Derive base categories from check-in response
  const base = deriveBaseCategories(input);

  // 2. Apply condition weight boost
  // If a category is in primary_conditions AND is in base → elevate to position 1
  // If a category is in primary_conditions but NOT in base → insert at position 2
  const weighted = applyConditionWeight(base, input.primaryConditions);

  // 3. Cap at 2 categories per session (3 actions max per check-in)
  return weighted.slice(0, 2);
}

function deriveBaseCategories(input: ProtocolInput): ActionCategory[] {
  if (input.triggerType === 'morning_baseline') {
    if (input.backPainScore && input.backPainScore >= 7) return ['spinal_decompression'];
    if (input.bodyFeeling === 'sore') return ['uric_acid_management', 'spinal_decompression'];
    if (input.bodyFeeling === 'stiff') return ['spinal_decompression', 'morning_activation'];
    if (input.bodyFeeling === 'drained') return ['stress_mental', 'morning_activation'];
    return ['morning_activation'];
  }
  if (input.triggerType === 'post_event') {
    const map: Record<string, ActionCategory[]> = {
      rich_meal:   ['uric_acid_management', 'metabolic_reset'],
      heavy_night: ['post_event_recovery', 'uric_acid_management'],
      long_desk:   ['spinal_decompression', 'desk_break'],
      stress_day:  ['stress_mental', 'sleep_priming'],
      travel:      ['post_event_recovery', 'spinal_decompression'],
      poor_sleep:  ['sleep_priming', 'morning_activation'],
    };
    return map[input.eventType ?? 'rich_meal'] ?? ['post_event_recovery'];
  }
  if (input.triggerType === 'midday_desk') {
    if (input.afternoonState === 'back_tight') return ['spinal_decompression'];
    if (input.afternoonState === 'flat') return ['desk_break', 'metabolic_reset'];
    if (input.afternoonState === 'fried') return ['stress_mental', 'desk_break'];
    return [];
  }
  if (input.triggerType === 'presleep') return ['sleep_priming'];
  return ['morning_activation'];
}

function applyConditionWeight(
  base: ActionCategory[],
  conditions: Condition[]
): ActionCategory[] {
  const conditionCategoryMap: Record<Condition, ActionCategory> = {
    uric_acid:   'uric_acid_management',
    cholesterol: 'metabolic_reset',
    back_pain:   'spinal_decompression',
    stress:      'stress_mental',
  };
  const result = [...base];
  for (const condition of conditions) {
    const cat = conditionCategoryMap[condition];
    if (!result.includes(cat)) {
      result.splice(1, 0, cat); // insert at position 2, after primary signal
    } else {
      // Elevate to position 1 if already present
      const idx = result.indexOf(cat);
      result.splice(idx, 1);
      result.unshift(cat);
    }
  }
  return result;
}
```

**Action selection within a category:**
- Filter by `condition_tags` matching user's `primary_conditions` first
- Then filter by `context_tags` matching `context_selected`
- Then order by: least recently completed first (avoids repetition)
- Cap at 3 actions per session

---

### Micro-Action — Context Selector + Video Timer *(unchanged from v1.3 — see original spec §4b)*

All video timer spec, transition choreography, offline fallback, and rep marker logic carried forward unchanged from v1.3.

---

### §4c — Action Library *(v2.0: updated category chips)*

**Route:** `/actions`

**Category filter chips (v2.0 — 8 categories):**
`TẤT CẢ / SÁNG / AXIT URIC / MỠ MÁU / LƯNG / CĂNG THẲNG / NGỦ / PHỤC HỒI / VĂN PHÒNG`

**Context filter** *(unchanged)*: Văn phòng / Riêng tư / Di chuyển

**Video grid** *(unchanged)*: 2-column, 4px radius thumbnails, eyebrow + name + 1-line rationale below each

Count display: "24 hành động · 8 danh mục"

---

### Recovery Protocol *(unchanged from v1.3)*
Video-enhanced cards, 3-day sequencing, action card states (current/upcoming/completed/skipped) — all unchanged. Protocol duration depends on `event_intensity` × `event_type`:

| Event Type | Heavy | Medium | Light |
|---|---|---|---|
| heavy_night | 3-day | 2-day | 1-day |
| rich_meal | 2-day | 1-day | — |
| long_desk | 2-day | 1-day | — |
| stress_day | 2-day | 1-day | — |
| travel | 2-day | 1-day | — |
| poor_sleep | 1-day | — | — |

---

### Weekly Intelligence Brief *(v2.0: insight engine extended)*

**Delivery and ritual mechanics** *(unchanged)*:
Generated Sunday 20:00, pushed governor-exempt, home screen takeover on Sunday, Monday intercept from week 4, `brief_weeks_completed` increments on read.

**Tiered insight engine — v2.0:**

| Tier | Weeks | Insight Types | Examples |
|---|---|---|---|
| 1 | 1–4 | Pattern detection across all conditions | "3 buổi sáng lưng cứng trong tuần này — cả 3 là sau ngày ngồi >8 tiếng" / "Thứ Năm là đêm rủi ro cao nhất — 4/6 tuần gần đây" |
| 2 | 5–8 | Cause correlation, condition cross-link | "Tuần lưng đau nhất là tuần căng thẳng nhất — 3/4 lần có mối liên hệ" / "Thứ Năm nặng hơn khi Thứ Ba bạn ngồi nhiều" |
| 3 | 9–12 | Intervention efficacy by condition | "Bài tập lưng sáng giúp điểm đau buổi chiều thấp hơn ~40% / Uống nước 500ml sáng sớm — tuần làm 4 lần, không ghi nhận đau khớp ngón cái" |
| 4 | 13+ | Predictive, personalised risk windows | "Tuần này giống mô hình tuần gout flare — đây là 3 thay đổi trước khi nó xảy ra" |

**Risk calendar rows — v2.0:** Now shows multi-condition risk per day, not only drink-night risk:

```
Thứ Hai   ● Thấp — ngày bình thường
Thứ Ba    ● Trung bình — lịch họp dày (nguy cơ lưng + căng thẳng)
Thứ Tư    ● Trung bình — bữa trưa công việc
Thứ Năm   ● Cao — tiệc hải sản tối + deadline
Thứ Sáu   ● Phục hồi nếu Thứ Năm nặng
```

Each row tap opens a 2-line explanation of which conditions are at risk and why.

---

### Household Partner View *(unchanged)*

Partner sees Home Environment Module, not check-in dashboard. Privacy boundary at RLS level.

Home Environment Module now includes condition-specific stocking guidance:
- Gout: low-purine pantry list, hydration reminders, trigger foods this week
- Cholesterol: omega-3 sources, saturated fat substitutions, meal timing guidance
- Back pain: ergonomics checklist, anti-inflammatory foods, morning floor space prep (for lumbar release protocol)

---

## 5. Notification System *(v2.0: updated payloads)*

### Architecture *(unchanged)*
Web Push API + VAPID keys. Subscription objects in `push_subscriptions`. Delivery via Supabase Edge Functions. Every send passes through Governor.

### Governor rules *(unchanged — see v1.1 spec)*

### Notification Schedule

| Function | Schedule | Governor exempt? | Payload |
|---|---|---|---|
| `notify-morning-baseline` | Daily, per user time (default 07:00) | No | *"Buổi sáng thế nào? Tap để check in"* |
| `notify-midday-desk` | Weekdays 14:00 | No | *"Buổi chiều đang thế nào? Lưng có ổn không?"* *(v2.0: updated copy)* |
| `notify-pre-sleep` | Per user pref (default 21:30) | No | *"Sẵn sàng nghỉ chưa?"* |
| `notify-pre-game` | 2hr before logged event | **Yes** | *"Tối nay: [Scenario]. Xem kịch bản."* |
| `notify-recovery-day2` | 07:00 day after Heavy/Medium | No | *"Ngày 2 phục hồi. Bắt đầu thôi."* |
| `notify-recovery-day3` | 07:00 two days after event | No | *"Ngày 3. Gần xong rồi."* |
| `notify-weekly-brief` | Sunday 20:00 | **Yes** | *"Tuần tới có [N] cửa sổ rủi ro. Xem ngay."* |

---

## 6. Payment — PayOS Integration *(unchanged from v1.2)*

### Subscription Gating

| Feature | Free | Paid |
|---|---|---|
| Morning baseline check-ins | ✓ Unlimited | ✓ Unlimited |
| Scenario playbooks | 1 use, any scenario | ✓ Full library |
| Post-event check-ins | 2 uses | ✓ Unlimited |
| Day 1 recovery actions (incl. video) | ✓ Both free cycles | ✓ Unlimited |
| Day 2 + Day 3 recovery content | ✗ Gated | ✓ Unlocked |
| Midday + pre-sleep check-ins | ✗ Gated | ✓ Unlocked |
| Action Library browse (video grid) | ✓ Browse only — play gated at Day 2 | ✓ Full play access |
| Weekly brief | 1 read | ✓ Unlimited |
| Pattern insights (90-day) | ✗ | ✓ |
| Wearable translation | ✗ | ✓ Annual plans only |
| Home Environment Module | ✗ | ✓ Household plan only |

**Paywall trigger:** Day 2 gate. Morning baseline check-ins remain ungated permanently.

---

## 7. Localisation *(unchanged)*

Vietnamese-first. All content strings in database with `_vi` / `_en` columns. Language toggle in Profile tab.

---

## 8. MVP Scope — Build Order *(v2.0: updated counts)*

### Phase 0 — Foundation (Week 1–2)
- [ ] Supabase project setup, all schema migrations — v2.0 schema including `profiles.primary_conditions`, `checkins.event_type`, `checkins.back_pain_score`, `checkins.afternoon_state` with 'back_tight', expanded `micro_actions.category` enum, expanded `scenarios.category` enum
- [ ] RLS policies for all tables
- [ ] React + Vite + TypeScript scaffold
- [ ] Tailwind + Be Vietnam Pro + IBM Plex Mono + DM Serif Display + shadcn/ui
- [ ] i18next — Vietnamese + English base strings
- [ ] Supabase auth (email/password + magic link)
- [ ] PWA manifest + service worker
- [ ] Vercel deploy pipeline
- [ ] Supabase Storage bucket for 24 exercise videos + thumbnails

### Phase 1 — Onboarding + Profile (Week 3–4)
- [ ] **v2.0: Condition declaration screen (Step 2a) — multi-select, writes `primary_conditions[]`**
- [ ] Biomarker input + storage + risk profile computation (marker sort by declared conditions)
- [ ] Aha Intercept — condition-personalised content
- [ ] **v2.0: Life pattern questionnaire (updated questions — desk hours, back pain frequency)**
- [ ] **v2.0: Activation event (4 options — rich_meal, heavy_night, long_desk, start tomorrow)**
- [ ] Home screen state machine — all 7 priority states
- [ ] Profile tab (view/edit biomarkers + conditions, language toggle)
- [ ] A2HS prompt flow
- [ ] `profiles.free_post_event_checkins_used` and `profiles.brief_weeks_completed` initialised

### Phase 2 — Scenario Playbook (Week 5–6)
- [ ] **v2.0: Seed scenario library (20 scenarios — 7 categories including desk_marathon, stress_week)**
- [ ] **v2.0: Category filter chips updated (TẤT CẢ / HẢI SẢN & NHẬU / BỮA ĂN / VĂN PHÒNG / CĂNG THẲNG / CÔNG TÁC)**
- [ ] **v2.0: Playbook screen — `meal_strategy` field replaces `alcohol_strategy` in content render**
- [ ] "Vào rồi" session logging
- [ ] Scenario-linked activation event scheduling

### Phase 3 — Check-In + Video Micro-Actions (Week 7–11)
- [ ] **v2.0: Morning baseline — 'sore' response option + conditional back pain score screen**
- [ ] **v2.0: Post-event — event_type second screen (6 options)**
- [ ] **v2.0: Mid-day — 'back_tight' fourth response option**
- [ ] Pre-sleep check-in
- [ ] Context Selector screen
- [ ] **v2.0: `lib/protocol.ts` — condition weighting engine (`selectActionCategories`, `applyConditionWeight`)**
- [ ] **v2.0: `hooks/useConditionWeight.ts` — reads `primary_conditions`, returns category weights**
- [ ] Video timer screen — 3 states: pre-start / running / complete
- [ ] `useVideoPlayer` hook: play/pause/loop, rep marker sync, offline detection
- [ ] Transition choreography
- [ ] Offline fallback: text-only timer
- [ ] **v2.0: Seed micro-action library (24 actions, 8 categories) — video_url, condition_tags, context_tags populated**
- [ ] **v2.0: Upload 24 exercise videos + thumbnails to Supabase Storage (7 environments)**
- [ ] Recovery protocol logic (variable duration by event_type + intensity) with video thumbnail cards
- [ ] Action session logging
- [ ] **v2.0: Action Library — Browse screen (updated category chips: 8 categories, count "24 hành động · 8 danh mục")**
- [ ] Action Library — Category View

### Phase 4 — Notifications + Governor (Week 12–13)
- [ ] VAPID key setup
- [ ] Push subscription client flow
- [ ] Governor table + checkGovernor() + dailyGovernorReset()
- [ ] recordPushOpened() in service worker notificationclick handler
- [ ] All 7 notification Edge Functions with governor gate
- [ ] **v2.0: Updated midday notification copy — includes back pain prompt**
- [ ] Notification preference settings

### Phase 5 — Weekly Brief + Ritual (Week 14–16)
- [ ] Tier 1 brief generation Edge Function (Sunday 20:00 cron)
- [ ] **v2.0: Brief Edge Function — multi-condition insight queries (see Appendix A v2.0)**
- [ ] Brief display screen with tiered layout
- [ ] **v2.0: Risk calendar rows — multi-condition risk per day**
- [ ] Sunday home screen takeover + Monday intercept
- [ ] Unread dot on Tuần này tab
- [ ] `profiles.brief_weeks_completed` increment on read

### Phase 6 — Payment + Subscription Gating (Week 17–18) *(unchanged)*

### Phase 7 — Household Plan (Week 19–20)
- [ ] Household invite + partner registration + account linking
- [ ] **v2.0: Partner Home Environment Module — condition-specific stocking guidance (gout / cholesterol / back pain)**
- [ ] Privacy boundary enforcement in RLS

### Phase 8 — Polish + Launch (Week 21–23)
- [ ] Offline handling — thumbnails cached, text fallback for all action screens
- [ ] Loading, error, and empty states
- [ ] Video loading states: 2-second fetch timeout → text fallback
- [ ] End-to-end QA on iOS Safari + Android Chrome
- [ ] Vietnamese copy review (native speaker)
- [ ] IBM Plex Mono diacritic verification
- [ ] Performance audit (Lighthouse PWA ≥ 90)
- [ ] **v2.0: Video performance audit: all 24 videos < 3MB, load < 3s on 4G**
- [ ] Governor simulation testing
- [ ] Brief ritual QA: Sunday takeover, Monday intercept, unread dot, gate
- [ ] Free tier conversion QA
- [ ] Soft launch to 50 beta users — **v2.0: ensure cohort includes non-drinker users with back pain or cholesterol as primary condition**

---

## 9. Phase 2 — Design Constraints Only *(unchanged)*

**Wearable Integration** — Apple Health + Garmin Connect APIs. Schema has nullable wearable columns reserved.

**Corporate Dashboard** — Deferred. The desk-worker / back-pain positioning makes the corporate pitch meaningfully stronger.

**Recovery Box** — Recurring order. Recommendation engine based on active condition profile. v2.0: box composition varies by primary condition (gout profile vs cholesterol profile vs back pain profile).

**Video CDN Migration** — Supabase Storage → Cloudflare R2 when bandwidth exceeds free tier.

---

## 10. Non-Functional Requirements *(v2.0: updated counts)*

| Requirement | Target |
|---|---|
| Lighthouse PWA score | ≥ 90 |
| First Contentful Paint | < 1.5s on 4G |
| Time to Interactive | < 3s on 4G |
| Offline capability | Core screens readable offline; video thumbnails cached; text-only timer fallback |
| iOS Safari support | iOS 16.4+ |
| Android Chrome support | Chrome 80+ |
| WCAG accessibility | AA — text contrast, tap targets ≥ 44×44px |
| Vietnamese font rendering | Be Vietnam Pro (body) + IBM Plex Mono (labels) — full diacritic support verified |
| Data residency | Supabase region: Singapore |
| Notification delivery rate | ≥ 90% |
| Governor coverage | 100% of push sends pass through checkGovernor() |
| Video file size | < 3MB per video at 720×1280 — 24 videos, ~72MB total storage |
| Video load time | < 3s to first frame on 4G; 2s thumbnail preload |
| Video fallback | Text-only timer renders within 2s if video fetch fails — no loading spinner |

---

## Appendix A — Weekly Brief Edge Function Queries *(v2.0: extended)*

**Tier 1a — High-risk event pattern (unchanged):**
```sql
select day_of_week, count(*) as high_risk_events
from checkins
where user_id = $1
  and trigger_type = 'post_event'
  and event_intensity in ('heavy', 'medium')
  and checked_in_at > now() - interval '8 weeks'
group by day_of_week
order by high_risk_events desc
limit 1;
```

**Tier 1b — Back pain pattern (new v2.0):**
```sql
select day_of_week, count(*) as stiff_mornings
from checkins
where user_id = $1
  and trigger_type = 'morning_baseline'
  and body_feeling in ('stiff', 'sore')
  and checked_in_at > now() - interval '4 weeks'
group by day_of_week
order by stiff_mornings desc
limit 1;
```

**Tier 1c — Desk sedentary pattern (new v2.0):**
```sql
select
  count(*) filter (where afternoon_state = 'back_tight') as back_tight_days,
  count(*) filter (where afternoon_state = 'flat') as flat_days,
  count(*) filter (where afternoon_state = 'fried') as fried_days,
  count(*) as total_midday_checkins
from checkins
where user_id = $1
  and trigger_type = 'midday_desk'
  and checked_in_at > now() - interval '4 weeks';
```

**Tier 2a — Event → heavy night cause correlation (unchanged):**
```sql
select
  count(*) filter (where tue.afternoon_state in ('flat', 'fried')) as sedentary_before,
  count(*) as total_heavy_events
from checkins thu
left join checkins tue
  on tue.user_id = thu.user_id
  and tue.day_of_week = 2
  and tue.checked_in_at between thu.checked_in_at - interval '2 days'
                            and thu.checked_in_at - interval '1 day'
where thu.user_id = $1
  and thu.day_of_week = 4
  and thu.event_intensity = 'heavy';
```

**Tier 2b — Desk day → back pain correlation (new v2.0):**
```sql
select
  count(*) filter (
    where next_morning.body_feeling in ('stiff', 'sore')
      or next_morning.back_pain_score >= 6
  ) as sore_mornings_after_long_desk,
  count(*) as total_long_desk_days
from checkins desk_day
left join checkins next_morning
  on next_morning.user_id = desk_day.user_id
  and next_morning.trigger_type = 'morning_baseline'
  and next_morning.checked_in_at between
    desk_day.checked_in_at + interval '6 hours'
    and desk_day.checked_in_at + interval '20 hours'
where desk_day.user_id = $1
  and desk_day.trigger_type = 'post_event'
  and desk_day.event_type = 'long_desk'
  and desk_day.checked_in_at > now() - interval '8 weeks';
```

**Tier 2c — Stress week → cholesterol / condition signal (new v2.0):**
```sql
select
  avg(case body_feeling when 'drained' then 3 when 'stiff' then 2 else 1 end) as avg_body_score,
  count(*) filter (where afternoon_state = 'fried') as fried_afternoons
from checkins
where user_id = $1
  and checked_in_at > now() - interval '2 weeks'
  and (
    trigger_type = 'morning_baseline'
    or trigger_type = 'midday_desk'
  );
```

**Tier 3 — Intervention efficacy by condition (new v2.0):**
```sql
select
  a.category,
  completed_action,
  avg(
    case next_morning.body_feeling
      when 'good' then 3
      when 'stiff' then 2
      when 'sore' then 1
      when 'drained' then 1
    end
  ) as avg_next_morning_score
from (
  select c2.body_feeling,
    exists(
      select 1 from action_sessions s
      join micro_actions a on a.id = s.action_id
      where s.user_id = c1.user_id
        and s.checkin_id = c1.id
        and s.status = 'completed'
    ) as completed_action
  from checkins c1
  join checkins c2
    on c2.user_id = c1.user_id
    and c2.trigger_type = 'morning_baseline'
    and c2.checked_in_at between c1.checked_in_at + interval '20 hours'
                             and c1.checked_in_at + interval '28 hours'
  where c1.user_id = $1
    and c1.trigger_type = 'post_event'
    and c1.event_intensity in ('heavy', 'medium')
) sub
left join action_sessions s2 on true
left join micro_actions a on a.id = s2.action_id
group by a.category, completed_action;
```

**Tier 4 — Predictive weekly risk score (unchanged from v1.3 — expanded to cover all conditions):**
Compute weekly risk score from: heavy/medium post-events + back_tight midday flags + sore/stiff mornings + fried afternoons. Compare to rolling 4-week average. Flag if early-week signals trend above average.

---

*This spec is a living document. Update version and date on each revision.*
*The one-pager takes precedence on product direction; this document takes precedence on implementation decisions.*
*v2.0 note: The non-drinker user path must be validated in beta. A user with only back pain and no rich-meal habits will experience a significantly different product arc — ensure the onboarding, morning check-in sequence, and mid-day trigger provide a complete loop for this user without requiring a post-event trigger.*
