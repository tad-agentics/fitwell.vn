# FitWell - Quick Reference Card

**Updated:** February 22, 2026

---

## 🎨 CSS Utility Classes

### Buttons

```tsx
<button className="fw-btn-primary">BẮT ĐẦU</button>           // Primary CTA
<button className="fw-btn-secondary">Xem thêm</button>        // Link button
<button className="fw-btn-ghost">Bỏ qua</button>             // Ghost/skip
<button className="fw-btn-nav">...</button>                  // Bottom nav tab
<button className="fw-btn-reset">...</button>                // Unstyled base
```

### Cards

```tsx
<div className="fw-card">...</div>                                          // Standard
<div className="fw-card-compact">...</div>                                  // Smaller padding
<div className="fw-card-selectable">...</div>                               // Hoverable
<div className={`fw-card-selectable ${sel ? 'fw-card-selected' : ''}`}>    // With state
```

### Typography

```tsx
<div className="fw-display-xl">02:00</div>        // 48px timer
<div className="fw-display-l">150</div>           // 36px biomarker
<h1 className="fw-heading-1">Title</h1>           // 28px screen title
<h2 className="fw-heading-2">Section</h2>         // 22px section
<p className="fw-body-l">Rationale</p>            // 17px large body
<p className="fw-body-m">Standard</p>             // 15px standard
<p className="fw-body-s">Detail</p>               // 13px small
<div className="fw-eyebrow">CATEGORY</div>        // 10px uppercase label
<div className="fw-label">BADGE</div>             // 11px mono badge
<div className="fw-micro">Note</div>              // 11px micro text
```

### Layout

```tsx
<div className="fw-screen">...</div>                      // Full screen
<div className="fw-container">...</div>                   // 20px h-padding
<div className="fw-safe-top">...</div>                    // 56px + safe area
<div className="fw-safe-bottom">...</div>                 // 48px + safe area
<div className="fw-flex">...</div>                        // Flex row
<div className="fw-flex-col">...</div>                    // Flex column
<div className="fw-flex-center">...</div>                 // Center both axes
<div className="fw-flex-between">...</div>                // Space between
<div className="fw-flex-start">...</div>                  // Align start
```

### Spacing

```tsx
// Gap
className="fw-gap-1"    // 4px
className="fw-gap-2"    // 8px
className="fw-gap-3"    // 12px
className="fw-gap-4"    // 16px
className="fw-gap-5"    // 20px
className="fw-gap-6"    // 24px
className="fw-gap-8"    // 32px

// Padding
className="fw-p-4"      // 16px all
className="fw-p-5"      // 20px all
className="fw-px-5"     // 20px horizontal
className="fw-py-6"     // 24px vertical

// Margin
className="fw-mt-8"     // 32px top
className="fw-mb-12"    // 48px bottom
```

### Colors

```tsx
className="fw-text-navy"        // #041E3A primary
className="fw-text-white"       // #FFFFFF
className="fw-text-muted"       // #9D9FA3 secondary
className="fw-text-gold"        // #8C693B sparse accent
className="fw-text-amber"       // #D97706 warning
className="fw-text-risk"        // #DC2626 danger
className="fw-text-success"     // #059669 success

className="fw-bg-navy"          // Navy background
className="fw-bg-white"         // White background
className="fw-bg-surface"       // #F5F5F5 grey surface
```

### Badges

```tsx
<span className="fw-badge fw-badge-navy">GOLD</span>
<span className="fw-badge fw-badge-gold">HOUSEHOLD</span>
<span className="fw-badge fw-badge-outline">LABEL</span>
```

### Bottom Navigation

```tsx
<div className="fw-bottom-nav">
  <button className="fw-btn-nav">
    <Icon />
    <span className={active ? 'fw-bottom-nav-label-active' : 'fw-bottom-nav-label-inactive'}>
      Label
    </span>
  </button>
</div>
```

### Overlays

```tsx
className="fw-overlay-navy"         // 0.82 opacity (pre-start)
className="fw-overlay-navy-light"   // 0.40 opacity (pause)
className="fw-overlay-dark"         // 0.72 opacity (modal)
```

### Borders

```tsx
className="fw-border"               // 1px grey-warm
className="fw-border-navy"          // 1px navy
className="fw-border-top"           // Top only
className="fw-border-bottom"        // Bottom only
<hr className="fw-divider" />       // Full width divider
```

### Transitions

```tsx
className="fw-transition-fast"      // 120ms ease-out
className="fw-transition-standard"  // 150ms ease-out
className="fw-transition-medium"    // 200ms ease-out
className="fw-transition-slow"      // 300ms ease-out
className="fw-transition-overlay"   // 400ms ease-out (video overlay)
```

### Progress & Risk

```tsx
// Progress dots
<div className="fw-progress-dot fw-progress-dot-active" />      // Navy
<div className="fw-progress-dot fw-progress-dot-inactive" />    // Grey

// Progress dots (white on dark)
<div className="fw-progress-dot fw-progress-dot-white-active" />
<div className="fw-progress-dot fw-progress-dot-white-inactive" />

// Risk indicators
<span className="fw-risk-low">Low</span>                    // Green text
<span className="fw-risk-medium">Medium</span>              // Amber text
<span className="fw-risk-high">High</span>                  // Red text

<div className="fw-risk-dot fw-risk-dot-low" />            // Green dot
<div className="fw-risk-dot fw-risk-dot-medium" />         // Amber dot
<div className="fw-risk-dot fw-risk-dot-high" />           // Red dot
```

### Media

```tsx
<video className="fw-video-cover" />    // Full cover video
<img className="fw-img-cover" />        // Full cover image
```

### Accessibility

```tsx
className="fw-tap-target"       // 44×44px min (WCAG AA)
className="fw-sr-only"          // Screen reader only
```

---

## 🔧 PWA Utilities

### Import

```tsx
import {
  requestWakeLock,
  releaseWakeLock,
  vibrate,
  isStandalone,
  isIOSSafari,
  isOnline,
  onNetworkChange,
  shareContent,
} from '@/utils/pwa';
```

### Wake Lock (Timer)

```tsx
useEffect(() => {
  if (isRunning) {
    requestWakeLock();    // Prevent screen sleep
  }
  return () => releaseWakeLock();
}, [isRunning]);
```

### Haptic Feedback

```tsx
vibrate([100, 50, 100]);    // Success (triple buzz)
vibrate(200);               // Error (single buzz)
vibrate([50, 30, 50]);      // Subtle feedback
```

### Device Detection

```tsx
const isPWA = isStandalone();           // Running as installed app?
const needsInstructions = isIOSSafari(); // Show iOS A2HS instructions?
```

### Network Status

```tsx
const [online, setOnline] = useState(isOnline());

useEffect(() => {
  const cleanup = onNetworkChange(setOnline);
  return cleanup;
}, []);
```

### Share Content

```tsx
await shareContent({
  title: 'FitWell',
  text: 'Check out this recovery protocol',
  url: window.location.href,
});
```

---

## 🎨 Design Tokens

### Colors (CSS Variables)

```css
var(--navy)         /* #041E3A - Primary text, CTAs, dark surfaces */
var(--white)        /* #FFFFFF - Page background, on-dark text */
var(--grey-surface) /* #F5F5F5 - App background */
var(--grey-warm)    /* #EBEBF0 - Borders, dividers */
var(--grey-text)    /* #9D9FA3 - Secondary text */
var(--gold)         /* #8C693B - Sparse accent (2 uses max!) */
var(--amber)        /* #D97706 - Warning, medium risk */
var(--risk)         /* #DC2626 - High risk, danger */
var(--success)      /* #059669 - Success, low risk */
```

### Fonts

```css
var(--font-display) /* 'DM Serif Display' - Timer, biomarkers */
var(--font-ui)      /* 'Be Vietnam Pro' - All UI, Vietnamese */
var(--font-mono)    /* 'IBM Plex Mono' - CTAs, labels, badges */
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display XL | 48px | 400 | 1.0 | Timer countdown |
| Display L | 36px | 400 | 1.1 | Biomarker value |
| Heading 1 | 28px | 600 | 1.3 | Screen title |
| Heading 2 | 22px | 600 | 1.3 | Section heading |
| Body L | 17px | 400 | 1.6 | Rationale text |
| Body M | 15px | 400 | 1.5 | Standard text |
| Body S | 13px | 400 | 1.5 | Small detail |
| Label | 11px | 500 | 1.0 | CTA text (mono) |
| Eyebrow | 10px | 400 | 1.0 | Category label (mono) |
| Micro | 11px | 400 | 1.4 | Timestamps |

### Spacing (4px Grid)

```
4px   8px   12px   16px   20px   24px   32px   40px   48px   64px
```

### Border Radius

```
Full-screen: 0px
Cards: 4px
Badges: 2px
Modals: 8px (top corners)
Circles: 50%
```

---

## 📱 Common Patterns

### Full-Screen Timer Layout

```tsx
<div className="fw-timer-screen">
  {/* Video layer */}
  <video className="fw-video-cover" />
  
  {/* Navy overlay */}
  <div className="fw-overlay-navy" />
  
  {/* UI content */}
  <div className="fw-flex-col fw-full">
    <div className="fw-safe-top fw-px-5">
      <div className="fw-eyebrow">CATEGORY</div>
    </div>
    
    <div className="fw-flex-center" style={{ flex: 1 }}>
      <div className="fw-timer-number">02:00</div>
    </div>
    
    <div className="fw-safe-bottom fw-px-5">
      <button className="fw-btn-secondary">BẮT ĐẦU</button>
    </div>
  </div>
</div>
```

### Check-In Option Card

```tsx
<div className={`fw-card-selectable ${selected ? 'fw-card-selected' : ''}`}>
  <h3 className="fw-heading-2" style={{ textAlign: 'center' }}>
    {answerText}
  </h3>
</div>
```

### Action Library Category Card

```tsx
<div className="fw-card fw-transition-fast" style={{ cursor: 'pointer' }}>
  <div className="fw-eyebrow fw-text-muted">{triggerType}</div>
  <h3 className="fw-heading-2" style={{ marginTop: '4px' }}>
    {categoryName}
  </h3>
  <p className="fw-body-s fw-text-muted" style={{ marginTop: '12px' }}>
    {description}
  </p>
</div>
```

### Bottom Nav Tab

```tsx
<button 
  onClick={() => navigate('screen')}
  className="fw-btn-nav"
>
  <svg width="24" height="24">
    <path stroke={active ? 'var(--navy)' : 'var(--grey-text)'} />
  </svg>
  <span className={active ? 'fw-bottom-nav-label-active' : 'fw-bottom-nav-label-inactive'}>
    Label
  </span>
</button>
```

### Risk Level Indicator

```tsx
<div className="fw-flex" style={{ alignItems: 'center', gap: '8px' }}>
  <div className={`fw-risk-dot fw-risk-dot-${level}`} />
  <span className={`fw-body-m fw-risk-${level}`}>
    {riskLabel}
  </span>
</div>
```

---

## ⚡ Performance Tips

### 1. Use Utility Classes

```tsx
// ❌ Avoid
<div style={{ padding: '20px', display: 'flex', gap: '16px' }}>

// ✅ Prefer
<div className="fw-p-5 fw-flex fw-gap-4">
```

### 2. Combine Wisely

```tsx
// Multiple utilities OK
<div className="fw-card fw-p-6 fw-flex-col fw-gap-4">

// With conditional
<div className={`fw-card ${active ? 'fw-card-selected' : ''}`}>
```

### 3. CSS Variables for Colors

```tsx
// ❌ Avoid
<span style={{ color: '#041E3A' }}>

// ✅ Prefer
<span className="fw-text-navy">
// or
<span style={{ color: 'var(--navy)' }}>
```

---

## 🧪 Testing Shortcuts

### Lighthouse Audit

```bash
pnpm build && pnpm preview
# Then in Chrome DevTools:
# Lighthouse → Performance + PWA
```

### PWA Install Test

**Android Chrome:**
1. Open app in Chrome
2. Wait for install prompt
3. Tap "Install"

**iOS Safari:**
1. Open app in Safari
2. Tap Share button
3. Tap "Add to Home Screen"

### Offline Test

```
Chrome DevTools → Application → Service Workers → Offline
```

---

## 📚 Documentation Quick Links

- **Complete Design System:** `/guidelines/Guidelines.md`
- **CSS Utilities Reference:** `/src/styles/utilities.css`
- **PWA Implementation:** `/CODEBASE_CLEANUP_PWA.md`
- **Video Transitions:** `/VIDEO_TRANSITIONS_IMPLEMENTATION.md`
- **Routing Map:** `/ROUTING_VERIFICATION.md`
- **Project README:** `/README.md`

---

## 🚨 Common Mistakes

### ❌ Don't Use Hardcoded Colors

```tsx
// ❌ Bad
<div style={{ color: '#041E3A' }}>

// ✅ Good
<div className="fw-text-navy">
<div style={{ color: 'var(--navy)' }}>
```

### ❌ Don't Ignore Safe Areas

```tsx
// ❌ Bad
<div style={{ paddingTop: '56px' }}>

// ✅ Good
<div className="fw-safe-top">
```

### ❌ Don't Forget Touch Targets

```tsx
// ❌ Bad
<button style={{ width: '30px', height: '30px' }}>

// ✅ Good
<button className="fw-tap-target">  // min 44×44px
```

### ❌ Don't Use Wrong Font

```tsx
// ❌ Bad - CTA in UI font
<button style={{ fontFamily: 'var(--font-ui)' }}>BẮT ĐẦU</button>

// ✅ Good - CTA in mono font
<button className="fw-btn-primary">BẮT ĐẦU</button>
```

---

## ✅ Best Practices Checklist

- [ ] Use utility classes instead of inline styles
- [ ] All colors from CSS variables
- [ ] Vietnamese text in Be Vietnam Pro font
- [ ] CTAs/labels in IBM Plex Mono (uppercase)
- [ ] Spacing follows 4px grid
- [ ] Touch targets ≥44×44px
- [ ] Safe areas for iPhone notch/island
- [ ] Wake lock for timers
- [ ] Haptic feedback on key actions
- [ ] Proper semantic HTML

---

**Print this page for quick reference!** 🎯
