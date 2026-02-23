# FitWell

**Your body is running a professional-grade workload. It needs professional-grade maintenance.**

FitWell is a Progressive Web App for men 30–50 in Vietnam managing elevated biomarkers (uric acid, LDL, triglycerides) or chronic conditions (gout, high cholesterol, back pain) — built for the life a sedentary white-collar professional actually lives.

---

## The Problem

Gout, high cholesterol, and chronic back pain look like three separate problems. They are three outputs of the same broken system: modern sedentary professional life generating inflammation, metabolic slowdown, and postural damage faster than the body can repair it.

No wellness app has been built for the actual life a 40-year-old white-collar professional in Hanoi or HCMC is living. FitWell is that system.

## What FitWell Does

| Feature | Description |
|---|---|
| **Situation Playbooks** | 20 searchable playbooks for real situations — seafood feasts, Korean BBQ, deadline crunches, 10-hour desk sprints, business trips. Pre-load strategy + recovery protocol. |
| **4 Check-In Triggers** | Morning baseline, post-event recovery, mid-day body check, pre-sleep wind-down. 10 seconds, 4 taps. |
| **24 Micro-Actions** | Sub-5-minute interventions across 8 categories. Full-screen timer, one instruction, one mechanism explanation. Zero equipment. |
| **Condition Weighting** | Protocols calibrated to your biomarker profile — gout gets uric acid protocols, cholesterol gets lipid protocols, back pain gets spinal decompression. |
| **Weekly Intelligence Brief** | Sunday evening brief: risk windows for the next 7 days, pattern insights from check-in data, intervention efficacy over time. |
| **Recovery Protocol Engine** | Variable-duration recovery after high-load events. Day-by-day action cards with 4 recovery variants. |
| **Home Environment Module** | Household partner view: stocking guidance, meal planning, preparation prompts aligned to the user's biomarker profile. |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui |
| State | Zustand · TanStack Query |
| Routing | React Router v7 |
| i18n | i18next (Vietnamese + English) |
| Backend | Supabase (Auth · PostgreSQL · RLS · Storage · Edge Functions) |
| Payments | PayOS |
| PWA | vite-plugin-pwa · Workbox |
| Hosting | Vercel |

## Project Structure

```
fitwell.vn/
├── docs/                          # Product & technical specs
│   ├── FitWell_OnePager.md        # Product vision & feature spec
│   ├── FitWell_TechUX_Spec.md     # Technical spec (v2.0, 1228 lines)
│   ├── FitWell_DesignSystem.md    # Design system (Ralph Lauren-inspired)
│   ├── FitWell_Navigation_Map_v2.html  # 50 frames across 10 flows
│   └── FitWell_Production_Plan.md # 8-phase production plan (~23 weeks)
├── landing/                       # Marketing landing page (static HTML)
│   └── index.html                 # FitWell landing v5 — deploy to Vercel
├── fitwell-mobile-pwa/            # React PWA prototype
│   ├── src/app/components/        # 50+ screen components
│   ├── src/app/components/ui/     # shadcn/ui primitives
│   ├── src/styles/                # Theme tokens + utility classes
│   └── public/                    # PWA manifest, icons, service worker
```

## Current Status

**Phase: Pre-production (UI prototype complete)**

- 50 screens implemented as high-fidelity React components
- Design system tokens defined in CSS custom properties
- Zero backend integration — all data is hardcoded
- Production plan covers 8 phases to full launch

See [`docs/FitWell_Production_Plan.md`](docs/FitWell_Production_Plan.md) for the complete build roadmap.

## Development

**Landing page (static):** Serve `landing/index.html` locally or deploy the `landing/` folder to Vercel (set Root Directory to `landing`).

**PWA app:**

```bash
cd fitwell-mobile-pwa
pnpm install
pnpm dev
```

## Pricing

| Plan | Price |
|---|---|
| Individual Quarterly | 490,000 VND / quarter |
| Individual Annual | 1,490,000 VND / year |
| Household Annual | 2,490,000 VND / year |

## Clinical Basis

All micro-action protocols developed with a licensed physiotherapist. All scenario playbooks co-developed with registered dietitians. Calibrated to Vietnamese professional and dietary contexts.

**FitWell does not provide medical diagnosis or treatment.** Users are advised to continue working with their physician.

---

*FitWell is built for the body you actually have — running the life you actually live.*
