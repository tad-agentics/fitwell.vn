# Icon Generation Guide

## Source Files Created

- `/public/icon-source.svg` - 512×512 standard icon
- `/public/icon-source-maskable.svg` - 640×640 maskable icon (with safe zone)

## Design

**Concept:** Minimalist "F" mark inspired by Ralph Lauren's restraint-as-authority principle
- Navy background (#041E3A)
- White geometric F shape
- Subtle gold accent line (#8C693B)
- No gradients, no shadows

## Method 1: Online Generator (Recommended - 5 minutes)

### Step 1: Use RealFaviconGenerator

1. Go to https://realfavicongenerator.net
2. Upload `/public/icon-source.svg`
3. Configure settings:
   - **iOS:** Use design as-is, no background
   - **Android:** Use maskable icon, select `/public/icon-source-maskable.svg`
   - **Windows:** Use design as-is
   - **macOS Safari:** Use design as-is
   - **Favicon:** Generate all sizes
4. Click "Generate your Favicons and HTML code"
5. Download the package

### Step 2: Extract to Project

```bash
# Unzip downloaded package
unzip favicons.zip -d /tmp/favicons

# Copy icons to /public/icons/
cp /tmp/favicons/android-chrome-*.png /public/icons/
cp /tmp/favicons/apple-touch-icon*.png /public/icons/
cp /tmp/favicons/favicon*.png /public/icons/
cp /tmp/favicons/mstile-*.png /public/icons/
cp /tmp/favicons/favicon.ico /public/

# Copy browserconfig and site.webmanifest if needed
cp /tmp/favicons/browserconfig.xml /public/
```

### Step 3: Verify Files

Expected files in `/public/icons/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- apple-touch-icon-57x57.png
- apple-touch-icon-60x60.png
- apple-touch-icon-72x72.png
- apple-touch-icon-76x76.png
- apple-touch-icon-114x114.png
- apple-touch-icon-120x120.png
- apple-touch-icon-144x144.png
- apple-touch-icon-152x152.png
- apple-touch-icon-180x180.png
- favicon-16x16.png
- favicon-32x32.png
- mstile-70x70.png
- mstile-144x144.png
- mstile-150x150.png
- mstile-310x310.png
- mstile-310x150.png (wide tile)

---

## Method 2: CLI Tool (15 minutes)

### Install PWA Asset Generator

```bash
npm install -g pwa-asset-generator sharp-cli
```

### Generate Icons

```bash
# Standard icons
pwa-asset-generator \
  public/icon-source.svg \
  public/icons \
  --icon-only \
  --favicon \
  --type png \
  --quality 100 \
  --padding "0" \
  --background "#041E3A"

# Maskable icons for Android
pwa-asset-generator \
  public/icon-source-maskable.svg \
  public/icons \
  --icon-only \
  --type png \
  --quality 100 \
  --padding "calc(50vw - 40vw)" \
  --background "#041E3A" \
  --path-override "icon-maskable-"
```

### Manual Sizes for Special Cases

```bash
# Badge icon
sharp-cli resize 72 72 \
  --input public/icon-source.svg \
  --output public/icons/badge-72x72.png

# Monochrome icon for Android (white on transparent)
# Edit SVG: Change background to transparent, keep white F
sharp-cli resize 192 192 \
  --input public/icon-monochrome.svg \
  --output public/icons/icon-monochrome-192x192.png
```

---

## Method 3: Manual with Design Tool (2 hours)

### Using Figma/Sketch/Illustrator

1. **Open source SVG** in design tool
2. **Create artboards** for each size:
   - 16×16, 32×32 (favicons)
   - 57, 60, 72, 76, 114, 120, 144, 152, 180 (iOS)
   - 72, 96, 128, 144, 152, 192, 384, 512 (Android/PWA)
   - 70, 144, 150, 310 (Windows)
3. **Export each size**:
   - Format: PNG
   - Color space: sRGB
   - Quality: 100%
   - No compression
4. **Optimize** with ImageOptim or TinyPNG

### Size Guide

| Size | Usage |
|------|-------|
| 16×16, 32×32 | Browser favicon |
| 57–180 | iOS home screen (various devices) |
| 72–512 | Android home screen + PWA install |
| 70–310 | Windows tiles |
| 192×192 | Android notification icon (maskable) |
| 512×512 | PWA install prompt, splash screen |

---

## Additional Assets

### Splash Screen (iPhone 15 Pro)

Create `/public/splash/iphone-15-pro-portrait.png`:
- Size: 393×852px
- Design: Navy background (#041E3A) with centered white F mark
- Export at 3x resolution: 1179×2556px

**Quick generation:**
```bash
# Scale icon to fit splash screen
sharp-cli resize 200 \
  --input public/icon-source.svg \
  --output /tmp/icon-200.png

# Create splash with ImageMagick
convert -size 1179x2556 xc:"#041E3A" \
  /tmp/icon-200.png -gravity center -composite \
  public/splash/iphone-15-pro-portrait.png
```

### OG Image (Social Sharing)

Create `/public/og-image.png`:
- Size: 1200×630px
- Design: Navy background with icon + "FitWell" wordmark
- Text: Be Vietnam Pro, 48px, white

**Template:**
```bash
convert -size 1200x630 xc:"#041E3A" \
  -gravity center \
  -fill white \
  -font "BeVietnamPro-SemiBold" \
  -pointsize 72 \
  -annotate +0+100 "FitWell" \
  -fill "#9D9FA3" \
  -pointsize 32 \
  -annotate +0+160 "Phục hồi sức khỏe thông minh" \
  public/og-image.png

# Add icon
composite -gravity center -geometry +0-120 \
  /tmp/icon-200.png \
  public/og-image.png \
  public/og-image.png
```

### Twitter Card Image

```bash
# Twitter: 1200×600 (same as OG but cropped)
convert public/og-image.png \
  -gravity center \
  -crop 1200x600+0+0 \
  public/twitter-image.png
```

---

## Verification Checklist

### After Generation

- [ ] All 30+ icon files exist
- [ ] Icons display correctly (open in browser)
- [ ] Maskable icons have proper safe zone
- [ ] No fuzzy edges (check small sizes: 16, 32, 72)
- [ ] Favicon appears in browser tab
- [ ] PWA install prompt shows correct icon
- [ ] iOS home screen icon looks sharp
- [ ] Android adaptive icon works

### Test Commands

```bash
# Count generated files
ls -1 public/icons/*.png | wc -l
# Should output: 25+

# Check file sizes (should be <50KB each)
du -h public/icons/*.png

# Verify PNG integrity
pngcheck public/icons/*.png
```

### Browser Tests

1. **Desktop:** Open app, check favicon in tab
2. **Chrome PWA:** Install app, check icon in taskbar/dock
3. **iOS:** "Add to Home Screen", check icon on springboard
4. **Android:** Install PWA, check icon in app drawer

---

## Current Status

**Created:**
- ✅ icon-source.svg (512×512)
- ✅ icon-source-maskable.svg (640×640)

**Need to Generate:**
- ❌ 25+ PNG icon files
- ❌ favicon.ico
- ❌ Splash screens
- ❌ OG images

**Recommended:** Use Method 1 (Online Generator) for quickest results.

**Estimated Time:**
- Method 1: 5-10 minutes
- Method 2: 15-30 minutes  
- Method 3: 2-4 hours

---

## Quick Start (Method 1)

```bash
# 1. Open browser
open https://realfavicongenerator.net

# 2. Upload file (will be shown in file picker)
# Select: /public/icon-source.svg

# 3. Download and extract
unzip ~/Downloads/favicons.zip -d /tmp/favicons

# 4. Copy to project
mkdir -p public/icons
cp /tmp/favicons/*.png public/icons/
cp /tmp/favicons/favicon.ico public/

# 5. Verify
ls -la public/icons/
```

**Done!** Icons ready for production.
