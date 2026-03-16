## Screen: SMSK03 — Check-in Bifurcation (Joint vs Tendon)
**Tier:** 1
**Route:** /checkin/{condition_id} (same route as S12/S13 — conditional render, không phải separate page)

---

### Overview

Screen này không phải một page riêng — là một **conditional response state** của check-in route, triggered khi `pain_score = 4` VÀ `condition.pain_track = 'tendon'`. Tendon track pain 4 có logic ngược hoàn toàn với joint track pain 4: joint track → giảm load (isometric), tendon track → pain 3–4 là "working signal" và tiếp tục bài. Sai path = treatment không hiệu quả.

---

### Components
- CheckinHeader — condition name + date + day number
- PainScoreSelector — 5 buttons, pain 4 selected (read-only sau khi selected)
- AIResponseCard — response block (không có typing indicator riêng — reuse S12 typing indicator)
- CP block (insight) — "working signal" explanation, borderLeft
- ExerciseCard — thumbnail + tên bài + meta (bài giữ nguyên, không thay đổi)
- ButtonPrimary (46px) — "Tiếp tục bài →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| condition.display_name_vi | conditions.display_name_vi | Real |
| condition.pain_track | conditions.pain_track — phải = 'tendon' để trigger screen này | Real |
| checkin.pain_score | User input — = 4 | Real |
| ai_response.working_signal_explanation | POST /api/v1/checkin — tendon track pain 4 branch | Real |
| current_exercise.name_vi | exercises.name_vi — bài hiện tại trong protocol (KHÔNG thay đổi) | Real |
| current_exercise.duration_sec | exercises.duration_sec → "X phút" | Real |
| current_exercise.location | exercises.location | Real |
| current_exercise.thumbnail_url | exercises.thumbnail_url | Real |

### Interaction States
- **Default** — Pain 4 selected. Typing indicator 800ms → AI response render với insight block + exercise card. CTA "Tiếp tục bài →" enabled.
- **Loading** — Typing indicator (same as S12) — 800ms minimum.
- **Error** — AI timeout → fallback rule-based: "Mức 4 với [condition] — đây là working signal bình thường. Tiếp tục bài." + exercise card.
- **Empty** — Không áp dụng.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Header condition | dry | conditions.display_name_vi |
| Header date/day | dry | "Check-in · {time} · Ngày {n}" |
| Insight block — working signal | insight | "Đau 3–4 khi làm bài gân = working signal. Gân đang được kích thích đúng cách — đây là mục tiêu, không phải cảnh báo." — borderLeft, không thêm warning tone |
| Insight sub-note | dry | "Chỉ giảm range nếu đau lên 5. Dừng hẳn là sai với tendon track." — 10px, muted |
| Exercise card name | protocol | exercises.name_vi — bài giữ nguyên, không swap |
| Exercise card meta | dry | "{duration} · {location}" |
| Exercise card badge | dry | "Bài giữ nguyên" — small badge trên card để signal không có change |
| CTA | action | "Tiếp tục bài →" |

### Navigation
- **Enters from:** S12 Check-in (pain_score = 4 selected, condition.pain_track = 'tendon')
- **Enters from:** S13 Check-in Pain 4–5 (pain 4, tendon track — S13 redirects here)
- **Exits to:** S09 Exercise Player via tap "Tiếp tục bài →"
- **Back behavior:** Tap back → S14 Home (không back về check-in selector)

### Edge Cases & Constraints
- **Trigger logic (server-side):** POST /api/v1/checkin nhận `pain_score=4`. Server check `conditions.pain_track`:
  - `pain_track = 'joint'` → standard isometric swap response (S12/S13 joint path)
  - `pain_track = 'tendon'` → working signal response (SMSK03 path)
  - Response type stored: `checkins.response_type = 'tendon_working_signal'`
- **Bài không thay đổi:** Tendon track pain 4 → `show_exercise_card = TRUE`, protocol KHÔNG swap sang isometric. Exercise card hiện bài hiện tại, không phải bài thay thế. "Bài giữ nguyên" badge signal này cho user.
- **Pain 5, tendon track:** Nếu user select pain 5 (không phải 4) với tendon condition → route về S13 pain 5 standard (4-part mandatory, nghỉ hoàn toàn). SMSK03 chỉ trigger với pain = 4.
- **EDS tone:** Insight block dùng tone "honest + insight" — không alarming, không minimize. Nói thẳng cơ chế. Ví dụ đúng: "Đây là mục tiêu, không phải cảnh báo." Ví dụ sai: "Không sao đâu, bình thường thôi!" (minimize) hoặc "Cẩn thận nhé!" (alarming).
- **EDS masculine trust:** Không dùng "bạn đang làm rất tốt!" hay "cố lên!". Explain cơ chế → user tự rút ra kết luận.
- **Conditions áp dụng:** Achilles (viêm gân Achilles), plantar_fasciitis (viêm cân gan chân), tennis_elbow — tất cả có `pain_track = 'tendon'` trong msk_conditions.
- **Component note:** Tất cả component names trong spec cần match exported names trong `design-system.tsx` khi file đó được viết trước sprint. Cursor không được tự tạo component mới nếu design system đã có component phù hợp.

- **Component registry note:** All component names in this spec are descriptive intent — not import paths. Before sprint begins, each name must be mapped to an exported component in `design-system.tsx`. If the component does not exist, it must be created in DS first. Cursor must never create one-off components inline.
