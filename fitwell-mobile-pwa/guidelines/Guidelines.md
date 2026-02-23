# FITWELL — Design System
**Version 1.0 · For Solo Dev Build · February 2026**
*Design reference: ralphlauren.com · Fonts: Google Fonts (DM Serif Display, Be Vietnam Pro, IBM Plex Mono)*

---

## 01 — Reference Rationale

Ralph Lauren's design language is built on a specific principle: restraint as authority. The brand communicates quality not through decoration but through what it removes — no gradients, no shadows, no borders that are not doing work. Typography and whitespace carry the entire aesthetic load.

FitWell serves a 40-year-old white-collar professional in Hanoi or HCMC who received elevated blood test results. This person is accustomed to premium environments — business hotels, corporate offices, upscale restaurants. The app must feel like it belongs in that world, not like a generic wellness product designed for mass-market appeal.

### What Transfers Directly

| RL Pattern | FitWell Adaptation |
|---|---|
| Monospaced font for CTA text — "SHOP NOW" in Founders Grotesk Mono, 11px, ls 0.6875px | IBM Plex Mono for "BẮT ĐẦU", "VÀO RỒI", category badges, timer labels |
| Eyebrow label above headline — "POLO RALPH LAUREN" above "Sophisticated Sportswear" | Trigger type above action name — "POST-EVENT RECOVERY" above "Wall Sit" |
| Zero border radius sitewide — sharp corners signal authority | 4px maximum on mobile touch targets; 0px on full-screen surfaces |
| Full-bleed dark surface for hero moments — deep navy `rgb(4, 30, 58)` | Timer screen and scenario risk header: `#1A1A2E` full-screen, no chrome |
| Underline-only CTA treatment — `::after` border-bottom, no filled button | Inline brief links and secondary actions: border-bottom 1px, no fill |
| Zero box-shadows sitewide — depth via colour contrast only | No shadows anywhere; surface separation via 1px `#EBEBF0` borders |
| Near-monochrome palette — deep navy `#041E3A` + white + grey scale, warm gold `#8C693B` as sole chromatic accent used sparingly | FitWell adopts this discipline exactly: navy + white + grey as the full primary palette; functional colours (amber, risk, success) exist only for health-specific semantic signals |
| Generous whitespace — horizontal margins create the premium signal | 20px screen edge margins, non-negotiable minimum |
| Muted secondary text — `rgb(157, 159, 163)` | `#9D9FA3` (RL extracted value) for rationale copy, timestamps, disabled states |
| All-caps + letter-spacing for labels — 0.5–1px tracking | IBM Plex Mono uppercase with 0.5px minimum letter-spacing on all badges |

### What Does Not Transfer

| RL Element | Reason Not Adopted | FitWell Alternative |
|---|---|---|
| LeJeuneDeck (serif) + Founders Grotesk (UI) + Founders Grotesk Mono (data) | Proprietary, licensed fonts | DM Serif Display + Be Vietnam Pro + IBM Plex Mono (Google Fonts, free) |
| 80px hero typography | Desktop scale — unusable on mobile | 36–48px maximum display size |
| Warm gold `#8C693B` as primary accent | RL uses it extremely sparingly — FitWell adopts the same restraint; gold appears only on the Household Plan badge and brief tier indicator | Used once or twice at most, never as a primary action colour |
| Lifestyle/fashion photography | Wrong framing for health recovery product | Environment-only imagery in scenario headers; UI is text-only |

---

## 02 — Color System

Five functional groups. Every colour in the app belongs to one of these groups. The primary palette is derived directly from Ralph Lauren — no teal, no invented brand colour. Navy, white, and grey carry the full visual weight.

### Primary Palette — RL Derived

| Token | Hex | Source | Usage |
|---|---|---|---|
| `navy` | `#041E3A` | RL extracted — primary text + surfaces | Primary text, dark surfaces, CTA fill, active nav, selected state borders, timer screen background, eyebrow label colour |
| `navy-hover` | `#0A3055` | RL-adjacent — 15% lighter | Hover/pressed state on navy elements |
| `white` | `#FFFFFF` | RL extracted | Page background, on-dark text, elevated card surface |
| `grey-surface` | `#F5F5F5` | RL extracted — alternate surface | App background, default screen, card alternates |
| `grey-warm` | `#EBEBF0` | RL extracted — divider colour | Component borders, row separators, input borders |
| `grey-text` | `#9D9FA3` | RL extracted — secondary text | Rationale copy, muted labels, disabled states, timestamps |

### Accent — Sparse Use Only

| Token | Hex | Source | Usage |
|---|---|---|---|
| `gold` | `#8C693B` | RL extracted — sole chromatic accent | Household Plan badge · weekly brief tier indicator · maximum 2 instances in the entire app |

> **RL discipline on gold:** Ralph Lauren uses warm gold extremely sparingly — a badge here, a heritage detail there. It signals premium without competing with the navy. FitWell adopts the same rule: gold appears in exactly two places. If you find yourself reaching for it anywhere else, use navy instead.

### Functional / Semantic — Health Context Only

These colours do not appear in RL's palette. They exist because FitWell is a health product and these signals are non-negotiable. They are never used decoratively.

| Token | Hex | Usage |
|---|---|---|
| `amber` | `#D97706` | Warning, unread dot indicator, medium risk level |
| `risk` | `#DC2626` | High-risk day, avoid item, critical alert text |
| `success` | `#059669` | Action complete, recovery on-track, low risk |

### Surface System

> **RL principle applied:** Flat surfaces only. No gradients. No drop shadows. Depth is created through colour contrast — not elevation effects.

| Surface | Hex | Usage |
|---|---|---|
| Base | `#F5F5F5` | App background, default screen |
| Card Default | `#FFFFFF` | Check-in cards, action cards, brief sections |
| Card Selected | `#F0F4F8` | Selected state — very light navy tint |
| Surface Dark | `#041E3A` | Timer full-screen, scenario risk header, onboarding hero |
| Overlay | `rgba(4,30,58,0.72)` | Full-screen modal overlay, image overlay on scenario header |

---

## 03 — Typography

Three fonts. Each has a specific job. They do not cross-pollinate.

### Font Stack

| Role | Font | Source | Used For |
|---|---|---|---|
| **Display** | DM Serif Display | Google Fonts | Timer countdown number, biomarker value on Aha intercept, risk level headline |
| **UI / Body** | Be Vietnam Pro | Google Fonts | All body copy, check-in labels, rationale text, navigation, forms, all Vietnamese-language content |
| **Data / Label** | IBM Plex Mono | Google Fonts | Timer labels, category badges, CTA text ("BẮT ĐẦU"), biomarker units, eyebrow labels |

> **Be Vietnam Pro is mandatory.** It is the only widely-available Google Font designed specifically for Vietnamese diacritics with consistent rendering across iOS Safari and Android Chrome. No substitution.

> **IBM Plex Mono for CTAs** mirrors RL's use of Founders Grotesk Mono for "SHOP NOW" — the mono-font-for-CTA principle. Precision-cut letterforms signal authority without decoration.

### Type Scale

| Name | Font | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| Display XL | DM Serif Display | 48px | 400 | 1.0 | Timer countdown number only |
| Display L | DM Serif Display | 36px | 400 | 1.1 | Aha intercept biomarker value, risk level headline |
| Heading 1 | Be Vietnam Pro | 28px | 600 | 1.3 | Screen title (scenario name, brief heading) |
| Heading 2 | Be Vietnam Pro | 22px | 600 | 1.3 | Section heading within a screen |
| Body L | Be Vietnam Pro | 17px | 400 | 1.6 | Rationale text on timer screen |
| Body M | Be Vietnam Pro | 15px | 400 | 1.5 | Check-in answer labels, card body text |
| Body S | Be Vietnam Pro | 13px | 400 | 1.5 | Supporting copy, brief detail text |
| Label / CTA | IBM Plex Mono | 11px | 500 | 1.0 | "BẮT ĐẦU", "VÀO RỒI", category badge text |
| Eyebrow | IBM Plex Mono | 10px | 400 | 1.0 | Trigger type above action name — "POST-EVENT RECOVERY" |
| Micro | Be Vietnam Pro | 11px | 400 | 1.4 | Timer "Bỏ qua", legal copy, timestamps |

### Typography Rules

- All-caps text always uses IBM Plex Mono, never Be Vietnam Pro in uppercase. Grotesque fonts in all-caps reduce legibility in Vietnamese.
- Letter-spacing on all IBM Plex Mono uppercase: 0.5px minimum, 1px for badges and labels.
- Line-height is always generous: 1.5× for body copy, 1.2× for headings, 1.0× for display (timer only).
- DM Serif Display is used exactly twice in the app: the timer countdown and the biomarker value on the Aha intercept. No other usage.
- Never bold DM Serif Display — weight 400 only. Heaviness is achieved through size, not weight.
- Vietnamese diacritics must be tested on iOS Safari 16.4+ and Android Chrome 80+. Be Vietnam Pro passes; other fonts may not.

---

## 04 — Spacing System

Base unit: **4px**. All spacing is a multiple of 4.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon gap, tight label spacing |
| `space-2` | 8px | Within-component internal padding |
| `space-3` | 12px | Badge padding, small button padding |
| `space-4` | 16px | Card internal padding (min), list item gap |
| `space-5` | 20px | Standard button height padding, screen edge margin |
| `space-6` | 24px | Card padding (standard), section gap (tight) |
| `space-8` | 32px | Between sections within a screen |
| `space-10` | 40px | Screen top padding, major section gap |
| `space-12` | 48px | Bottom nav clearance, large section spacing |
| `space-16` | 64px | Timer screen vertical centering offset |

**Screen edge margins:** 20px (`space-5`) horizontal padding on all screens. Never reduce below 16px — the breathing room is the premium signal.

**Bottom safe area:** 48px clearance above bottom navigation on all screens with scrollable content.

---

## 05 — Border Radius & Elevation

### Border Radius

> RL uses 0px everywhere. For FitWell on mobile, pure 0px on touch targets is too harsh. Apply the minimum necessary.

| Component | Radius | Rationale |
|---|---|---|
| Full-screen surfaces | 0px | Timer, onboarding, scenario playbook — RL sharp editorial confidence |
| Check-in option cards | 4px | Minimum rounding for touch affordance |
| Action cards | 4px | Consistent with check-in cards |
| Category badges | 2px | Near-square, data tag — mono font + near-zero radius |
| Bottom navigation | 0px | Flat bar, no rounding |
| Input fields | 4px | Slight rounding for form usability |
| Risk level dots | 50% | Circle indicator only — not a card |
| Modal / bottom sheet | 8px | Top corners only |

### Elevation — No Shadows

RL has zero box-shadows sitewide. Depth is created through:

- Colour contrast between surface layers — a `#FFFFFF` card on `#F5F5F5` background uses a 1px `#EBEBF0` border, not a shadow
- Full-bleed backgrounds defining screen edges naturally
- Typography weight and size creating visual hierarchy

**One exception:** The Aha Intercept card on onboarding uses a 2px left `#041E3A` navy border as an accent — border, not shadow.

---

## 06 — Layout Rules

### Core Layout Principles

| Rule | Specification |
|---|---|
| Screen edge padding | 20px horizontal — never less |
| Base spacing unit | 4px. All spacing multiples of 4 |
| Surface separation | No drop shadows anywhere — use 1px #EBEBF0 borders for surface separation |
| Gradients | No gradients anywhere |
| Border radius | 4px max on cards/buttons, 0px on full-screen surfaces, 2px on badges |
| Minimum tap target | 44×44px (WCAG AA) |
| Bottom nav clearance | 48px above nav bar on all scrollable screens |

### Button Styles

| Type | Specification |
|---|---|
| Primary | Full-width, 56px height, #041E3A fill, white text, IBM Plex Mono 11px uppercase, 4px radius |
| Secondary/inline | No fill, no border, just text with 1px bottom border #041E3A |
| Ghost/skip | Be Vietnam Pro 13px, #9D9FA3, no decoration, always small, always at bottom |
| Disabled | #F5F5F5 bg, #9D9FA3 text, 1px #EBEBF0 border |

### Eyebrow + Headline Pattern

**Use on every categorised screen.** This pattern is borrowed directly from Ralph Lauren's editorial hierarchy.

| Element | Specification |
|---|---|
| Eyebrow font | IBM Plex Mono, 10px, weight 400, uppercase, 0.5px letter-spacing |
| Eyebrow colour (light bg) | #041E3A |
| Eyebrow colour (dark bg) | #9D9FA3 |
| Gap between eyebrow and headline | 4px — tight pairing signals they are one unit |
| Headline font | Be Vietnam Pro, 22–28px, weight 600 |
| Rule | Eyebrow never appears without headline. Headline in categorised context never appears without eyebrow. |

### Bottom Navigation

**Persistent on all main screens after onboarding.**

| Property | Specification |
|---|---|
| Tabs | 5 tabs: Tối nay \| Check-in \| Hành động \| Tuần này \| Tôi |
| Height | 56px + device safe area |
| Background | #FFFFFF (white) |
| Top border | 1px #EBEBF0, no shadow |
| Active tab | #041E3A icon + label (weight 600) |
| Inactive tab | #9D9FA3 icon + label (weight 400) |
| Label font | Be Vietnam Pro 10px |
| Icon style | 24×24px, stroke-based, 1.5px stroke weight, no fill |
| Unread indicator | 6px amber (#D97706) dot on "Tuần này" tab for unread brief state |
| Min tap target | 48px per tab (WCAG AA) |

---

## 07 — Component Patterns

### Check-In Option Card

*3 cards per check-in screen. Must be operable half-awake, one thumb.*

| Property | Spec |
|---|---|
| Width | 100% minus 2× 20px screen edge margin |
| Min height | 80px — 3 cards + gaps fill ≥60% of viewport |
| Gap between cards | 12px (`space-3`) |
| Background default | `#FFFFFF` |
| Background selected | `#F0F4F8` |
| Border default | 1px `#EBEBF0` |
| Border selected | 2px `#041E3A` |
| Border radius | 4px |
| Padding | 24px horizontal · 20px vertical |
| Answer text | Be Vietnam Pro · 22px · weight 600 · `#041E3A` · centered |
| Selected indicator | 4px left border bar in `#041E3A` — not a checkmark, not a filled background |
| Min tap target | 44×44px (WCAG AA) |
| Selection animation | 120ms ease-out background transition — no bounce |

---

### Micro-Action Timer Screen

*Full-screen, no navigation chrome. RL full-bleed hero panel pattern — dark surface, single focal point.*

| Property | Spec |
|---|---|
| Background | `#041E3A` — never gradient, never a lighter navy |
| Top bar | IBM Plex Mono eyebrow (category + context badge) · `#9D9FA3` · no back arrow visible |
| Action name | Be Vietnam Pro · 28px · weight 600 · `#FFFFFF` · centered |
| Rationale text | Be Vietnam Pro · 17px · weight 400 · `#9D9FA3` · 3–4 lines · centered |
| Timer number | DM Serif Display · 72px · weight 400 · `#FFFFFF` · centered |
| Primary CTA "BẮT ĐẦU" | IBM Plex Mono · 11px · weight 500 · `#FFFFFF` · uppercase · ls 1px · border-bottom 1px `#FFFFFF` |
| Skip link | Be Vietnam Pro · 13px · `#9D9FA3` · bottom of screen · ghost |
| Progress dots | 4px circles · `#FFFFFF` active / `#9D9FA3` inactive |
| WakeLock | Request on Start tap · release on complete / skip / background |

---

### Eyebrow Label Hierarchy

*Borrowed directly from RL: "POLO RALPH LAUREN" above "Sophisticated Sportswear". Trigger type above action name.*

| Property | Spec |
|---|---|
| Eyebrow font | IBM Plex Mono · 10px · weight 400 · uppercase · ls 0.5px |
| Eyebrow colour (light bg) | `#041E3A` navy |
| Eyebrow colour (dark bg) | `#9D9FA3` grey-text |
| Gap: eyebrow → headline | 4px — tight pairing signals they are one unit |
| Headline font | Be Vietnam Pro · 22–28px · weight 600 · `#041E3A` or `#FFFFFF` |
| Examples | `MORNING ACTIVATION` → "Wall Sit" · `POST-EVENT RECOVERY` → "Tối qua thế nào?" |
| Rule | Eyebrow never appears without a headline. Headline in a categorised context never appears without an eyebrow. |

---

### CTA / Button Treatment

| Type | Spec |
|---|---|
| Primary action | Full-width · `#041E3A` fill · `#FFFFFF` text · IBM Plex Mono 11px uppercase · ls 1px · height 56px · radius 4px |
| Secondary / inline | No fill · no border · border-bottom 1px `#041E3A` — "Xem kịch bản đầy đủ →" |
| Ghost / Skip | Be Vietnam Pro 13px · `#9D9FA3` · no decoration · always small · always bottom |
| Destructive | `#FFFFFF` fill · `#DC2626` text · 1px `#DC2626` border |
| Disabled | `#9D9FA3` text · `#F5F5F5` bg · 1px `#EBEBF0` border — never hide, only disable |
| Loading | 3-dot pulse animation replacing text — same dimensions as active state |

---

### Weekly Brief — Risk Calendar

| Property | Spec |
|---|---|
| Row height | 44px minimum (tappable for reminder set) |
| Day label | Be Vietnam Pro · 15px · weight 400 · `#041E3A` · left-aligned |
| Low risk | `#059669` text + 6px circle dot |
| Medium risk | `#D97706` text + 6px circle dot |
| High risk | `#DC2626` text + 6px circle dot |
| Row separator | 1px `#EBEBF0` hairline |
| Insight headline | Be Vietnam Pro · 22px · weight 600 · `#041E3A` |
| Insight detail | Be Vietnam Pro · 15px · weight 400 · `#9D9FA3` · 2–3 sentences max |
| Tier badge | IBM Plex Mono · 9px · uppercase · `#8C693B` gold · top-right of insight block — one of two permitted gold uses |
| Comparison bars | `#041E3A` fill current week / `#EBEBF0` fill 4-week avg · labels above bars |
| One-tap CTA | IBM Plex Mono underline style · border-bottom 1px `#041E3A` · "Đặt nhắc cho Thứ Năm" |

---

## 08 — Imagery Principles

FitWell's primary interface is text and interaction. Imagery appears only in onboarding and scenario playbook headers.

### Scenario Playbook Header
- Full-bleed image behind scenario name — dark overlay `rgba(4,30,58,0.60)` ensures white text legibility
- Image shows the environment type: seafood restaurant interior, Korean BBQ, hotel lobby — recognisable to the target user
- No faces — environment only, or hands/background details
- Minimum image quality: 1200×800px, compressed to <200kb for 4G load

### Onboarding Aha Intercept
- No image — text-only card on white background with a 2px left `#041E3A` navy accent border
- The absence of imagery is intentional: the biomarker data and scenario rules are the hero

### What to Avoid
- Illustrated characters — too playful for the demographic
- Before/after body imagery — sets a weight-loss framing the product explicitly rejects
- Generic wellness stock (green smoothies, yoga mats, running shoes)
- AI-generated faces — uncanny valley risk in a trust-sensitive health context

---

## 09 — Motion Principles

RL uses extremely minimal motion. A page that moves too much signals that motion is compensating for weak content.

| Interaction | Duration | Easing |
|---|---|---|
| Check-in card select | 120ms | ease-out — background colour change only |
| Screen transition | 200ms | ease-in-out slide left/right — never fade |
| Timer Start / complete | 150ms | ease-out — button label swap, no scale |
| Bottom sheet open | 250ms | cubic-bezier(0.4, 0, 0.2, 1) — slides up |
| Unread dot appear | 0ms | No animation — information, not alert |
| Risk calendar rows | 0ms | Static — loads fully, no stagger |
| A2HS illustration | 600ms loop | ease-in-out — subtle Safari share icon pulse only |

**No spring physics. No bounce easing. No scale transforms.** The target user is checking in at 7 AM managing a health condition. Every animation that draws attention to itself is a distraction.

---

## 10 — Tailwind CSS Tokens

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary — RL derived
        navy:    { DEFAULT: '#041E3A', hover: '#0A3055' },
        white:   '#FFFFFF',
        // Surfaces & neutrals — RL derived
        'grey-surface': '#F5F5F5',
        'grey-warm':    '#EBEBF0',
        'grey-text':    '#9D9FA3',
        // Accent — sparse use only (Household badge + brief tier indicator)
        gold:    '#8C693B',
        // Functional — health context only, never decorative
        amber:   '#D97706',
        risk:    '#DC2626',
        success: '#059669',
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        ui:      ['Be Vietnam Pro', 'Helvetica', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'display-xl': ['48px', { lineHeight: '1.0', letterSpacing: '0' }],
        'display-l':  ['36px', { lineHeight: '1.1', letterSpacing: '0' }],
        'h1':         ['28px', { lineHeight: '1.3', letterSpacing: '0' }],
        'h2':         ['22px', { lineHeight: '1.3', letterSpacing: '0' }],
        'body-l':     ['17px', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-m':     ['15px', { lineHeight: '1.5', letterSpacing: '0' }],
        'body-s':     ['13px', { lineHeight: '1.5', letterSpacing: '0' }],
        'label':      ['11px', { lineHeight: '1.0', letterSpacing: '0.05em' }],
        'eyebrow':    ['10px', { lineHeight: '1.0', letterSpacing: '0.05em' }],
        'micro':      ['11px', { lineHeight: '1.4', letterSpacing: '0' }],
      },
      borderRadius: {
        'none': '0px',
        'sm':   '2px',
        'md':   '4px',
        'lg':   '8px',
        'full': '9999px',
      },
      spacing: {
        '1':  '4px',  '2':  '8px',  '3':  '12px',
        '4':  '16px', '5':  '20px', '6':  '24px',
        '8':  '32px', '10': '40px', '12': '48px',
        '16': '64px',
      },
      transitionDuration: {
        '120': '120ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      },
    },
  },
};
```

---

## 11 — Google Fonts Import

```html
<!-- index.html <head> — load before any CSS -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Be+Vietnam+Pro:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
/* global.css */
:root {
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-ui:      'Be Vietnam Pro', Helvetica, sans-serif;
  --font-mono:    'IBM Plex Mono', 'Courier New', monospace;
}
```

**Font payload breakdown:**
- DM Serif Display · weight 400 only · ~18kb
- Be Vietnam Pro · weights 400, 500, 600, 700 · ~80kb (Latin + Vietnamese subsets)
- IBM Plex Mono · weights 400, 500 · ~28kb
- **Total: ~126kb** — acceptable on 4G; test on 3G to confirm <2s load

---

## 12 — Do / Don't

| ✓ DO | ✗ DON'T |
|---|---|
| Use IBM Plex Mono for all uppercase labels and CTA text | Use Be Vietnam Pro in all-caps — grotesque uppercase hurts Vietnamese readability |
| Use `#041E3A` navy as the primary CTA fill — dark button on white, white text on dark surface | Invent a brand colour (teal, blue, green) — navy + white is the entire palette |
| Use `#041E3A` dark surface for the timer screen | Use any colour other than the RL navy for full-screen dark surfaces |
| 4px border-radius maximum on cards | Round corners beyond 4px — it reads as a consumer wellness app |
| 1px `#EBEBF0` border to separate surfaces | Add drop-shadows to any component |
| 20px screen edge margins — non-negotiable | Reduce margins to fit more content per screen |
| Navy eyebrow (IBM Plex Mono uppercase) above every action name | Introduce a category without the eyebrow/headline pair |
| Flat colour backgrounds only | Use gradients anywhere in the interface |
| DM Serif Display for timer countdown only | Use the display serif for navigation, UI text, or body copy |
| Amber (`#D97706`) for informational signals only — unread dot, medium risk | Use amber for primary actions or branding — it is a warning colour, not a brand colour |
| Gold (`#8C693B`) in exactly two places: Household badge + brief tier indicator | Use gold anywhere else — three gold instances breaks the RL restraint principle |
| 150–250ms transitions, ease-out only | Use spring physics, bounce, or scale transforms on any UI element |
| White text on `#041E3A` surfaces — passes WCAG AAA | Pair `#9D9FA3` text on `#F5F5F5` for body copy — fails WCAG AA at small sizes |