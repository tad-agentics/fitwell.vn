## Screen: S07 — First Insight (4/4)
**Tier:** 1
**Route:** /onboarding/insight
**Progress:** 4/4

---

### Components
- ProgressBar (total=4, current=4)
- FitWell avatar mark
- CP block (fear) — borderLeft 3px
- CP block (insight) — standard
- CP block (protocol) — bg-2 fill, borderLeft 3px
- ButtonPrimary (46px) — "Bài đầu tiên →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| insight_response | POST /api/v1/ai/first-insight — Claude Haiku, condition-aware | Real |
| insight_response.fear_block | AI response JSON: fear_acknowledgment | Real |
| insight_response.insight_block | AI response JSON: counterintuitive_insight | Real |
| insight_response.protocol_name | protocols table — first assigned exercise | Real |
| insight_response.protocol_duration | exercises.duration_sec → formatted "X phút" | Real |
| insight_response.protocol_location | exercises.location | Real |
| condition.display_name_vi | conditions.display_name_vi | Real |

### Interaction States
- **Default** — 3 CP blocks rendered. CTA enabled.
- **Loading** — Screen mount → gọi POST /api/v1/ai/first-insight → hiện typing indicator 800ms minimum. Skeleton: 3 block placeholders (height 60px, bg-2, borderRadius r8, animate-pulse).
- **Error** — AI call thất bại → fallback: hiện rule-based insight từ msk_conditions.insight_hook_vi thay vì AI. Không hiện error message — user không biết fallback xảy ra.
- **Empty** — Không áp dụng.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Fear block | fear | insight_response.fear_acknowledgment — "Pattern này rất phổ biến với người ngồi 8 tiếng — không phải dấu hiệu bệnh nặng." |
| Insight block | insight | insight_response.counterintuitive_insight — counterintuitive explanation về root cause |
| Protocol block label | protocol | "{protocol_name} · {duration} · {location}" — bold name, muted meta |
| CTA | action | "Bài đầu tiên →" |

### Navigation
- **Enters from:** S04C Condition Confirm (hoặc SMSK08 Safety Warning nếu triggered) via tap CTA
- **Exits to:** SMSK07 Assessment Fork nếu condition.assessment_required = TRUE và assessment_completed = FALSE
- **Exits to:** S08 AI First Response nếu không cần assessment
- **Back behavior:** Disabled — không có back từ screen này (session đã tạo)

### Edge Cases & Constraints
- Đây là màn hình đầu tiên **sau khi anonymous session đã được tạo** — protocols.createConditionWithPhaseGate() đã chạy
- Không có nút Skip — CTA là duy nhất
- AI response phải bao gồm đúng 3 phần: fear → insight → protocol. Nếu AI trả về thiếu phần nào → dùng fallback từ msk_conditions.insight_hook_vi
- Typing indicator: minimum 800ms display ngay cả khi response đến sớm hơn
- **EDS masculine trust signals (per EDS Masculine Encouragement section):** Fear block phải dùng "Shared struggle framing" — "Pattern này ai ngồi văn phòng lâu cũng gặp" thay vì "bạn bị". Insight block dùng understatement, không lecture. Không dùng "bạn cần", "bạn nên".
- **EDS opening rule:** AI response KHÔNG bắt đầu bằng "Tôi hiểu rằng...", "Chào bạn". Fear block vào thẳng nội dung.
- **EDS response length:** First insight = 3 blocks, mỗi block tối đa 2–3 câu. Không verbose.

---

## Screen: S08 — AI First Response
**Tier:** 1
**Route:** /first-exercise

---

### Components
- FitWell avatar mark
- CP block (fear) — borderLeft 3px
- CP block (insight)
- CP block (protocol) — bg-2 fill
- ExerciseCard — thumbnail (42×42) + tên bài + meta (duration, location) + play icon
- ButtonPrimary (46px) — "Làm ngay — {duration} →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| ai_response | Passed từ S07 (same API call, no re-fetch) | Real |
| exercise.name_vi | exercises.name_vi | Real |
| exercise.duration_sec | exercises.duration_sec → "X phút" | Real |
| exercise.location | exercises.location | Real |
| exercise.thumbnail_url | exercises.thumbnail_url | Real — Cloudflare Stream thumbnail |
| protocol.id | protocols.id | Real — dùng để navigate vào S09 |

### Interaction States
- **Default** — 3 CP blocks + exercise card rendered. CTA enabled.
- **Loading** — Không có loading — data đến từ S07 (no re-fetch).
- **Error** — exercise.thumbnail_url null → hiện play icon placeholder (44×44 bg-2, center play triangle). Không hiện error.
- **Empty** — Không áp dụng.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Fear block | fear | Reuse từ S07 — same content |
| Insight block | insight | Reuse từ S07 — same content |
| Protocol block | protocol | "{exercise.name_vi} · {duration} · {location}" |
| Exercise card name | protocol | exercises.name_vi — bold |
| Exercise card meta | dry | "{duration} · {location}" — muted |
| CTA | action | "Làm ngay — {duration} →" |

### Navigation
- **Enters from:** S07 First Insight via tap "Bài đầu tiên →"
- **Enters from:** SMSK07 Assessment Fork via tap "Xác nhận → bài của bạn →"
- **Exits to:** S09 Exercise Player via tap CTA hoặc tap exercise card
- **Back behavior:** Tap back → S07 First Insight

### Edge Cases & Constraints
- Không re-fetch AI — data đã có từ S07 call, pass qua navigation state hoặc cached in Zustand
- Tap exercise card = tap CTA — cả hai navigate đến S09 với cùng protocol_id
- Nếu exercise.video_url null (video chưa upload) → hiện step-by-step text từ exercises.steps JSON thay vì video player tại S09

- **Component registry note:** All component names in this spec are descriptive intent — not import paths. Before sprint begins, each name must be mapped to an exported component in `design-system.tsx`. If the component does not exist, it must be created in DS first. Cursor must never create one-off components inline.
