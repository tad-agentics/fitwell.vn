# FitWell Mobile PWA — Setup Guide

## Prerequisites

- Node.js 18+
- pnpm 9+
- Supabase project (already provisioned)

## 1. Install dependencies

```bash
cd fitwell-mobile-pwa
pnpm install
```

## 2. Environment variables

The `.env` file is already configured with:

```
VITE_SUPABASE_URL=https://jihexglgsdwdxqcorqon.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## 3. Run the database migration

The migration creates all 14 tables, RLS policies, triggers, indexes, and seed data (20 scenarios + 24 micro actions).

### Option A: Supabase Dashboard (recommended)

1. Go to https://supabase.com/dashboard and open the **FitWell** project
2. Navigate to **SQL Editor**
3. Copy the full contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor and click **Run**
5. Verify: run `SELECT count(*) FROM scenarios;` — should return **20**
6. Verify: run `SELECT count(*) FROM micro_actions;` — should return **24**

### Option B: Supabase CLI

```bash
# If you have the Supabase CLI linked to this project:
supabase db push
```

### Option C: psql

```bash
psql "postgresql://postgres:<password>@db.jihexglgsdwdxqcorqon.supabase.co:5432/postgres" \
  -f supabase/migrations/001_initial_schema.sql
```

## 4. Run the dev server

```bash
pnpm dev
```

The app runs at http://localhost:5173

## 5. Build for production

```bash
pnpm build
```

Output is in `dist/` — a static PWA that can be deployed to any CDN/static host.

## Architecture

- **React Router v7** with lazy-loaded route modules
- **Supabase** for auth (magic link OTP), database, and RLS
- **Zustand v5** for client-side auth state (`useAuthStore`)
- **TanStack React Query v5** for server state (`useSupabaseQuery.ts`)
- **Vite PWA** with service worker for offline support
- **i18n** via `react-i18next` with Vietnamese (`vi`) and English (`en`)

## Database Tables

| Table | Purpose |
|-------|---------|
| profiles | User profile, conditions, notification prefs |
| households | Family plan with partner invite |
| biomarkers | Blood test results (uric acid, cholesterol, etc.) |
| scenarios | 20 pre-built situation guides |
| scenario_sessions | User's completed scenario reads |
| checkins | Morning, midday, post-event, pre-sleep check-ins |
| micro_actions | 24 exercise/recovery actions |
| action_sessions | Completed action logs |
| recovery_protocols | Multi-day post-event recovery tracking |
| subscriptions | Payment/plan status |
| weekly_briefs | AI-generated weekly reports |
| push_subscriptions | Web push endpoints |
| notification_governor | Rate limiting for notifications |
| analytics_events | Event tracking |

## Key Screens

The home screen uses a **state machine** (`deriveHomeState`) that evaluates:
1. Sunday → Weekly brief takeover
2. Monday → Brief intercept
3. Active recovery protocol → Recovery timeline
4. Scheduled event → Pre-dinner countdown
5. After 9pm → Pre-sleep check-in
6. Weekday 1-4pm → Midday desk break
7. Default → Clean day
