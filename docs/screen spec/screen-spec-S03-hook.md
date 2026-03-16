## Screen: S03 — Hook (Onboard 0/4)
**Tier:** 1
**Route:** /onboarding

---

### Components
- ButtonPrimary (46px) — "Kể cho FitWell nghe →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| — | — | Không có dynamic data — static screen |

### Interaction States
- **Default** — 2 copy blocks + CTA. Không có loading, không có form.
- **Loading** — Không áp dụng.
- **Error** — Không áp dụng.
- **Empty** — Không áp dụng.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Headline block | honest | "Đang ở đây vì đau — không phải vì muốn healthy lifestyle." — bold, 14px |
| Sub-copy | action | "FitWell không bán lời khuyên chung. Hỏi 3 câu, đưa bài cụ thể cho đúng pattern của bạn — làm được ngay hôm nay." |
| CTA | action | "Kể cho FitWell nghe →" |

### Navigation
- **Enters from:** S02 Pain Entry via tap "Tiếp tục" (free-text path, không phải chip path)
- **Exits to:** S03b Path Chooser via tap CTA
- **Back behavior:** Tap back → S02 Pain Entry

### Edge Cases & Constraints
- Screen này chỉ hiện trên free-text path. Nếu user chọn suggestion chip tại S02 → bỏ qua S03, đi thẳng S03b
- Không có skip — CTA là duy nhất
- Anonymous session chưa tạo ở bước này
- Screen là static Astro page — không cần React island
