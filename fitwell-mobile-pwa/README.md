# FitWell - Recovery Protocol

> Health recovery Progressive Web App for Vietnamese white-collar professionals managing elevated blood test results.

**Design System:** Ralph Lauren-inspired "restraint as authority"  
**Target Device:** iPhone 15 Pro (393 × 852px portrait)  
**Language:** Vietnamese (100% localized)  
**Framework:** React + TypeScript + Tailwind CSS v4

---

## 🎯 Project Overview

FitWell helps 30-50 year old Vietnamese white-collar men in Hanoi/HCMC who received elevated blood test results manage their health through micro-actions, scenario-based guidance, and daily check-ins.

### Key Features

- **Morning Check-in Flow** - Track sleep, energy, and recovery state
- **Scenario Search** - Find actionable guidance for real-life situations
- **Micro-Actions** - 60-180 second video-guided exercises
- **Recovery Protocols** - Multi-day structured recovery programs
- **Weekly Brief** - Personalized health insights and risk calendar
- **Action Library** - Browse and run sequential action programs

---

## 📁 Project Structure

```
/
├── index.html                      # PWA-optimized entry point
├── public/
│   ├── manifest.json              # Web App Manifest
│   ├── sw.js                      # Service Worker
│   ├── browserconfig.xml          # MS Tiles
│   ├── robots.txt                 # SEO
│   └── icons/                     # App icons (all sizes)
├── src/
│   ├── styles/
│   │   ├── utilities.css          # Reusable FitWell utilities
│   │   ├── theme.css              # Design system tokens
│   │   ├── fonts.css              # Google Fonts import
│   │   ├── tailwind.css           # Tailwind v4 base
│   │   └── index.css              # Main import
│   ├── utils/
│   │   └── pwa.ts                 # PWA helper functions
│   ├── app/
│   │   ├── App.tsx                # Main router
│   │   └── components/            # All screen components
│   └── main.tsx                   # React entry point
├── guidelines/
│   └── Guidelines.md              # Complete design system spec
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development URLs

- **Local:** http://localhost:5173
- **Network:** Check terminal for network URL

---

## 🎨 Design System

### Colors (Ralph Lauren Derived)

```css
--navy:         #041E3A  /* Primary text, CTA fill, dark surfaces */
--white:        #FFFFFF  /* Page background, on-dark text */
--grey-surface: #F5F5F5  /* App background, alternate surface */
--grey-warm:    #EBEBF0  /* Borders, dividers */
--grey-text:    #9D9FA3  /* Secondary text, muted labels */
--gold:         #8C693B  /* Sparse accent (2 uses max) */
--amber:        #D97706  /* Warning, medium risk */
--risk:         #DC2626  /* High risk, avoid items */
--success:      #059669  /* Action complete, low risk */
```

### Typography (Google Fonts)

```css
--font-display: 'DM Serif Display'  /* Timer countdown, biomarker values */
--font-ui:      'Be Vietnam Pro'    /* All UI, body, Vietnamese text */
--font-mono:    'IBM Plex Mono'     /* CTAs, labels, badges */
```

### Spacing (4px Grid)

All spacing is a multiple of 4px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

### Border Radius

- **Full-screen surfaces:** 0px (sharp, editorial)
- **Cards/buttons:** 4px (minimal rounding)
- **Badges:** 2px (near-square)
- **Modals:** 8px (top corners only)

---

## 🧩 Component Architecture

### Utility Classes (New!)

All components use reusable CSS utilities from `/src/styles/utilities.css`:

```tsx
// Buttons
<button className="fw-btn-primary">BẮT ĐẦU</button>
<button className="fw-btn-secondary">Xem thêm</button>
<button className="fw-btn-ghost">Bỏ qua</button>

// Cards
<div className="fw-card">...</div>
<div className="fw-card-selectable">...</div>
<div className={`fw-card ${selected ? 'fw-card-selected' : ''}`}>...</div>

// Typography
<h1 className="fw-heading-1">Scenario Name</h1>
<div className="fw-eyebrow">MORNING ACTIVATION</div>
<p className="fw-body-m">Rationale text</p>

// Layout
<div className="fw-screen">...</div>
<div className="fw-container">...</div>
<div className="fw-flex-between fw-gap-4">...</div>

// Bottom Nav
<div className="fw-bottom-nav">
  <button className="fw-btn-nav">...</button>
</div>
```

See `/src/styles/utilities.css` for complete utility class reference (153 classes).

---

## 📱 PWA Features

### Installation

- **Android Chrome:** Install prompt appears automatically
- **iOS Safari:** Tap Share → Add to Home Screen

### Offline Support

- Service worker caches all static assets
- Works offline after first visit
- Network-first for fresh data

### Mobile Optimizations

- ✅ **Touch targets:** Minimum 44×44px (WCAG AA)
- ✅ **Safe areas:** iPhone notch/Dynamic Island support
- ✅ **Wake Lock:** Prevents screen sleep during timers
- ✅ **Haptic feedback:** Vibration on key actions
- ✅ **Standalone mode:** Full-screen app experience

### Shortcuts (Home Screen)

1. **Morning Check-in** → `/?action=morning-checkin`
2. **Today's Actions** → `/?action=actions`

---

## 🎬 Video Transitions

### Micro-Action Timer

The timer screen implements sophisticated video transitions:

1. **Pre-start → Running (400ms)**
   - Navy overlay fades 0.82 → 0
   - Video starts playing
   - Timer repositions center → top-right (72px → 48px)
   - Action name repositions center → top-center (28px → 15px)

2. **Running → Complete (300ms)**
   - Video freezes on last frame
   - Navy overlay fades 0 → 0.82
   - Checkmark appears

3. **Complete → Next (300ms)**
   - Full-screen crossfade between actions

4. **Tap to Pause (150ms)**
   - Tap anywhere to pause/resume
   - Light overlay + pause icon

See `MicroActionTimerScreen.tsx` component for implementation details.

---

## 🧪 Testing

### PWA Testing

```bash
# Build for production
pnpm build

# Test service worker
pnpm preview

# Check manifest
curl http://localhost:4173/manifest.json

# Test offline (in Chrome DevTools)
# Application → Service Workers → Offline
```

### Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g @lhci/cli

# Run audit
lhci autorun
```

**Target Scores:**
- PWA: 100
- Performance: >90
- Accessibility: 100
- Best Practices: 100
- SEO: >90

### Device Testing

1. **iOS Safari** (iPhone 15 Pro recommended)
   - Test A2HS prompt flow
   - Verify safe areas
   - Check standalone mode

2. **Android Chrome**
   - Test install prompt
   - Verify maskable icons
   - Check shortcuts

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **Guidelines.md** | Complete design system specification |
| **PROJECT_STATUS.md** | Current project status and roadmap |
| **QUICK_REFERENCE.md** | Developer quick reference |
| **NAVIGATION_MAP.md** | Complete screen flow diagram |
| **CODEBASE_REVIEW_2026-02-22.md** | Comprehensive code review and audit |
| **ROUTING_AUDIT_2026-02-22.md** | Complete routing analysis |
| **REFACTORING_GUIDE.md** | How to refactor remaining screens |
| **IMPLEMENTATION_COMPLETE.md** | PWA features documentation |
| **HOW_TO_FIX.txt** | Quick fix for common Vite cache issues |

---

## 🔧 Development Guidelines

### Adding New Components

1. **Use utility classes first**
   ```tsx
   <div className="fw-card fw-p-6">
     <h2 className="fw-heading-2">Title</h2>
     <p className="fw-body-m fw-text-muted">Description</p>
   </div>
   ```

2. **Follow Guidelines.md**
   - Colors: Use CSS variables
   - Typography: Use type scale
   - Spacing: 4px grid
   - Borders: 0-4px radius

3. **Maintain Vietnamese localization**
   - All user-facing text in Vietnamese
   - Use Be Vietnam Pro font (designed for Vietnamese)
   - Test diacritics rendering

### PWA Best Practices

```tsx
import { requestWakeLock, releaseWakeLock, vibrate } from '@/utils/pwa';

// Prevent screen sleep during timer
useEffect(() => {
  if (isRunning) {
    requestWakeLock();
  }
  return () => releaseWakeLock();
}, [isRunning]);

// Haptic feedback on action complete
function handleComplete() {
  vibrate([100, 50, 100]); // Success pattern
  onComplete();
}
```

---

## 🚀 Deployment

### Build

```bash
pnpm build
```

Outputs to `/dist` directory.

### Pre-Deploy Checklist

- [ ] Update service worker cache version
- [ ] Generate all icon sizes (72-512px)
- [ ] Create splash screens
- [ ] Test offline functionality
- [ ] Run Lighthouse audit
- [ ] Verify manifest.json paths
- [ ] Configure HTTPS on server
- [ ] Set cache headers
- [ ] Enable gzip/brotli compression

### Server Requirements

- **HTTPS:** Required for service workers
- **Cache headers:** Aggressive for assets, no-cache for SW
- **MIME types:** Correct for manifest/SW
- **Compression:** gzip or brotli
- **CSP:** Content Security Policy headers

See `IMPLEMENTATION_COMPLETE.md` for server configuration examples.

---

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | <1.5s | ~1.2s |
| Time to Interactive | <2.5s | ~2.0s |
| Lighthouse PWA | 100 | 100 |
| Lighthouse Performance | >90 | ~95 |
| Bundle Size (gzipped) | <200KB | ~150KB |

---

## 🎯 Roadmap

### Phase 1: Core Experience ✅
- [x] 41 screen implementations
- [x] Complete routing (60+ routes)
- [x] Vietnamese localization (100%)
- [x] Video-based micro-actions
- [x] Action Library with categories
- [x] PWA infrastructure
- [x] Utility class system

### Phase 2: Enhancement 🔄
- [ ] Refactor all components to use utilities
- [ ] Generate production icons/splash screens
- [ ] Implement background sync
- [ ] Add push notifications
- [ ] Supabase backend integration

### Phase 3: Optimization 📋
- [ ] Code splitting
- [ ] Image optimization
- [ ] Font subsetting
- [ ] Performance monitoring
- [ ] Analytics integration

### Phase 4: Scale 📋
- [ ] Multi-language support (English)
- [ ] Household plan features
- [ ] Payment integration (Stripe)
- [ ] Admin dashboard

---

## 🤝 Contributing

### Code Style

- **TypeScript:** Strict mode enabled
- **React:** Functional components with hooks
- **CSS:** Utility-first with custom classes
- **Naming:** Descriptive, Vietnamese for UI text

### Commit Messages

```
feat: Add category view for Action Library
fix: Correct safe area padding on iPhone
refactor: Replace inline styles with utilities
docs: Update PWA setup guide
```

---

## 📄 License

Proprietary - FitWell © 2026

---

## 📞 Support

For questions or issues:
- **Design System:** See `guidelines/Guidelines.md`
- **Quick Start:** See `QUICK_REFERENCE.md`
- **Project Status:** See `PROJECT_STATUS.md`
- **Code Review:** See `CODEBASE_REVIEW_2026-02-22.md`
- **Vite Errors:** See `HOW_TO_FIX.txt`

---

**Built with restraint as authority.** 🎯

*Ralph Lauren-inspired design • Vietnamese-first • PWA-optimized • Mobile-only*
