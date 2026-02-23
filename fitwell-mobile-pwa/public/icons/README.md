# Icon Directory

## Status: PLACEHOLDER ICONS

The SVG source files have been created:
- `/public/icon-source.svg` - Standard 512×512 icon
- `/public/icon-source-maskable.svg` - Maskable 640×640 icon

## To Generate Production Icons

Follow instructions in `/scripts/generate-icons.md`

**Quickest method:** Use https://realfavicongenerator.net (5 minutes)

## Required Files (Not Yet Generated)

### Critical (Blocks PWA install)
- [ ] icon-192x192.png - Android install prompt
- [ ] icon-512x512.png - PWA splash screen  
- [ ] apple-touch-icon-180x180.png - iOS home screen
- [ ] favicon.ico - Browser tab

### High Priority
- [ ] icon-72x72.png through icon-384x384.png (6 files)
- [ ] apple-touch-icon sizes (9 files)
- [ ] favicon-16x16.png, favicon-32x32.png

### Medium Priority
- [ ] MS Tiles (5 files)
- [ ] badge-72x72.png
- [ ] Splash screens (1+ files)
- [ ] OG images (2 files)

**Total needed:** ~30 files

## Temporary Workaround

The app will function without icons but:
- PWA install prompt may fail
- No icon in browser tab
- iOS "Add to Home Screen" shows blank icon
- Social sharing shows no preview image

**Generate icons before deploying to production.**
