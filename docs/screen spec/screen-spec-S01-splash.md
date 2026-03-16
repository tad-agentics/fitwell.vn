## Screen: S01 — Splash / Entry
**Tier:** 1
**Route:** /

---

### Components
- ButtonPrimary LG (52px) — CTA "Bắt đầu ngay"
- ButtonGhost — "Đăng nhập" (returning user path)

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| — | — | No dynamic data — static screen |

### Interaction States
- **Default** — Logo + tagline + Primary CTA + Ghost login link. Xuất hiện sau 800ms splash animation.
- **Loading** — Không có loading state — screen hoàn toàn static.
- **Error** — Không áp dụng.
- **Empty** — Không áp dụng.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Tagline | fear-reduction | "Đúng bài. Mỗi ngày. Tốt hơn dần." — dry, no exclamation |
| CTA Primary | action | "Bắt đầu ngay" — verb-first, không cần giải thích |
| Ghost link | low-emphasis | "Đã có tài khoản — đăng nhập" |

### Navigation
- **Enters from:** App open (direct URL / PWA launch)
- **Exits to:** S02 Pain Entry via tap "Bắt đầu ngay" → S23 Login via tap "Đăng nhập"
- **Back behavior:** Không có back — đây là root screen

### Edge Cases & Constraints
- Nếu user đã có anonymous session hợp lệ (JWT in-memory còn hiệu lực) → redirect thẳng đến S15 Home, không hiện S01
- Nếu user đã là paid subscriber và JWT còn hiệu lực → redirect thẳng đến S15 Home
- Không có splash screen delay — render ngay lập tức, không block route transition bằng animation
- Screen này là static Astro page (zero JS hydration) — không cần React island
