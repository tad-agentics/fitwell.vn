## Screen: S30 — Notification Permission (Web Push)
**Tier:** 1
**Route:** /notifications/setup (modal overlay — không phải full page)

---

### Components
- BottomSheet modal
- Icon (36×36, bg-2, bell icon placeholder)
- CP block (action) — headline
- CP block (honest) — rationale borderLeft
- BenefitList — 2 bullet items
- ButtonPrimary (46px) — "Đồng ý — bật thông báo"
- Ghost link — "Để sau — tôi tự nhớ mở app"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| platform | navigator.userAgent detection (client-side) | Real — 'android_chrome' | 'ios_safari' | 'other' |

### Interaction States
- **Default** — Modal hiện với explanation + CTA.
- **Tap CTA — Android/Chrome** — Browser native permission dialog xuất hiện. Outcome A: Granted → hiện confirmation "Đã bật — FitWell sẽ nhắc vào 7 giờ sáng." → dismiss modal → navigate S14 Home. Outcome B: Denied → hiện fallback message (xem Edge Cases) → dismiss modal → navigate S14 Home.
- **Tap CTA — iOS Safari** — Không hiện browser dialog (iOS không support web push permission flow như Chrome). Thay vào đó: hiện message "Trên iPhone: mở FitWell mỗi ngày — thông báo sẽ xuất hiện khi app đang mở." → dismiss.
- **Tap "Để sau"** — Set `fw_notif_asked = 'skipped'` trong localStorage. Navigate S14 Home. Không hỏi lại.
- **Loading** — Không áp dụng.
- **Error** — Không áp dụng.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Headline | action | "FitWell nhắc đúng lúc — bài buổi sáng hiệu quả hơn nhiều." — 14px bold |
| Rationale | honest | "Nhắc nhở đúng thời điểm là lý do app này work. Không phải để bán thêm thứ gì." — borderLeft |
| Benefit 1 | dry | "Sáng — trước khi đặt chân xuống sàn" |
| Benefit 2 | dry | "Chiều — sau cuộc họp dài" |
| Benefit footer | dry | "Tối đa 2 thông báo / ngày" |
| CTA | action | "Đồng ý — bật thông báo" |
| Skip | dry | "Để sau — tôi tự nhớ mở app" |
| Denied fallback | honest | "Bạn có thể bật lại thông báo trong Settings trình duyệt." — hiện 1 lần, sau đó ẩn |

### Navigation
- **Enters from:** S10 Post-Exercise via tap "Bật nhắc sáng — 7am"
- **Exits to:** S14 Home (tất cả outcomes — granted, denied, skipped)
- **Back behavior:** Backdrop tap → không dismiss. User phải tap 1 trong 2 CTAs.

### Edge Cases & Constraints
- Set `fw_notif_asked = 'true'` trong localStorage sau bất kỳ outcome nào — không hỏi lại
- Nếu Notification API không available (old browser) → ẩn CTA, hiện: "Trình duyệt của bạn chưa hỗ trợ thông báo. Mở FitWell mỗi sáng để không bỏ bài." → skip path
- iOS Safari: không có web push permission dialog → xuống in-app banner path (GET /notifications/pending polling từ InAppBanner.tsx)
- VAPID subscription lưu vào push_subscriptions table sau khi permission granted
- Một lần hỏi duy nhất (OI-3 confirmed) — nếu denied thì không bao giờ hỏi lại trong cùng browser

---

## Screen: S12 — Check-in Pain 1–3
**Tier:** 1
**Route:** /checkin/{condition_id}

---

### Components
- CheckinHeader — condition name + date + day number
- PainScoreSelector — 5 buttons (1–5), single-select
- PainScaleLabel — color semantic guide (Ổn / Vừa / Nặng)
- AIResponseCard — typing indicator → response block
- CP block (dry/honest/peer-nod) — AI response text
- ExerciseCard — thumbnail + name + meta + play icon
- ButtonPrimary (46px) — "Làm bài →"
- FreeTextToggle — "Thêm ghi chú" (expand textarea, optional, S12b variant)

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| condition.display_name_vi | conditions.display_name_vi | Real |
| checkin.day_number | CURRENT_DATE - user_profiles.onboarding_completed_at | Real |
| checkin.pain_score | User input — local state | Real |
| ai_response.message | POST /api/v1/checkin — Claude Haiku response | Real |
| ai_response.exercise_name | exercises.name_vi | Real |
| ai_response.exercise_duration | exercises.duration_sec → "X phút" | Real |
| ai_response.exercise_location | exercises.location | Real |
| ai_response.response_type | 'standard'\|'skeptical'\|'positive_trajectory'\|'plateau'\|'worsening' | Real — determines tone variant |
| recent_pain_scores | checkins.pain_score ORDER BY created_at DESC LIMIT 5 | Real — context for AI |

### Interaction States
- **Default** — Pain score selector không có selection. Không có AI response yet.
- **Score selected (1–3)** — Score button highlighted. POST /api/v1/checkin fires. Typing indicator 800ms. Then AI response + exercise card render.
- **Loading (AI)** — Typing indicator (3-dot animation, 800ms minimum). Skeleton: 2 lines bg-2, borderRadius r4, animate-pulse.
- **Error** — AI timeout (> 3s) → fallback: rule-based response từ template theo pain_score + condition. Hiện bình thường, không hiện error.
- **Free text expanded** — FreeTextToggle tap → textarea xuất hiện dưới pain selector. Input gửi async (non-blocking) sau khi user tap "Làm bài →".
- **Already checked in today** — Hiện today's check-in data, read-only. UNIQUE constraint on (user_id, condition_id, DATE(created_at)).

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Header condition | dry | conditions.display_name_vi |
| Header date/day | dry | "Check-in · {time} · Ngày {n}" |
| Pain prompt | action | "{condition.display_name_vi} sáng nay thế nào?" — thay "lưng" / "cổ" theo condition |
| Pain scale labels | dry | "Ổn · teal" / "Vừa · amber" / "Nặng · risk" |
| AI response — standard | dry | "Mức {n} — ổn để làm bài. Hôm nay: {exercise.name_vi} · {duration} · {location}." |
| AI response — skeptical (day 3–5) | honest | "3 ngày chưa đủ — cơ thể cần 7–10 ngày consistent. Bài đang đúng hướng." |
| AI response — positive_trajectory | peer-nod | "Từ {prev} xuống {curr} trong 5 ngày — đang đúng hướng. Tuần này thêm {progression} cuối bài." |
| AI response — worsening (3+ ngày không giảm) | honest | "Hôm nay: {exercise.name_vi}. Lưu ý — 3 ngày không giảm, thử giảm biên độ động tác xem có khác không." — dùng "thử xem" không "bạn cần". Trigger: recent_pain_scores 3 ngày liên tiếp không giảm hoặc tăng. |
| Exercise card name | protocol | exercises.name_vi |
| Exercise card meta | dry | "{duration} · {location}" |
| CTA | action | "Làm bài →" |

### Navigation
- **Enters from:** S14 Home via tap check-in prompt — hoặc notification tap → deep link `/checkin/{condition_id}`
- **Exits to:** S09 Exercise Player via tap "Làm bài →"
- **Exits to:** SMSK03 Check-in Bifurcation nếu pain_score = 4 VÀ condition.pain_track = 'tendon'
- **Back behavior:** Tap back → S14 Home

### Edge Cases & Constraints
- Pain score 5 → route đến S13 (không hiện exercise card, không có "Làm bài →")
- Pain score 4, joint track → route bình thường nhưng AI response switch sang isometric exercise variant
- Pain score 4, tendon track → route đến SMSK03 Bifurcation screen
- UNIQUE constraint: chỉ 1 check-in per condition per day (timezone: Asia/Ho_Chi_Minh)
- Free text (S12b): POST gửi async sau tap CTA — không block navigation. Server xử lý freetext_parser non-blocking.
- AI phải không dùng "Tuyệt vời", "Xuất sắc", "!" — copy-rules.mdc enforcement
- **Worsening variant trigger:** `recent_pain_scores` 3 ngày liên tiếp không giảm hoặc tăng → `response_type = 'worsening'`. Copy: suggest form check, không blame user, không thay bài ngay. "Thử giảm biên độ động tác" không "bạn cần đổi bài".
- **EDS response length (per EDS copy rules):** Standard response: 3–5 câu. Skeptical (day 3–5): 2–3 câu. Positive trajectory: 2–3 câu. Pattern insight: 2–3 câu.
- **EDS opening rule:** KHÔNG bắt đầu bằng "Tôi hiểu rằng...", "Chào bạn", "Cảm ơn đã chia sẻ". Vào thẳng nội dung.
- **EDS closing rule:** KHÔNG kết bằng "Chúc bạn mau khỏe!", "Cố lên nhé!". Kết bằng protocol (tên bài) hoặc forward-looking action.
- **Sarcastic tone (S11 notifications):** Sarcastic tone ("Cổ đang kêu cứu rồi đấy") chỉ áp dụng khi user's recent pain_score ≤ 2. Nếu pain_score ≥ 3 → switch sang neutral/direct tone. Enforce trong notification dispatch logic.

---

## Screen: S13 — Check-in Pain 4–5
**Tier:** 1
**Route:** /checkin/{condition_id} (same route, different state)

---

### Components
- CheckinHeader — condition name + date + day number
- PainScoreSelector — 5 buttons, pain 4 hoặc 5 selected
- AIResponseCard (pain 5 only) — 4-part mandatory response
- CP block (warmth) — acknowledge
- CP block (honest) — rest permission
- CP block (honest) — red flag check
- NoProtocolNote — text note (không có exercise card)

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| checkin.pain_score | User input — 4 hoặc 5 | Real |
| ai_response | POST /api/v1/checkin — pain5 branch | Real |
| condition.pain_track | conditions.pain_track | Real — 'joint' | 'tendon' |

### Interaction States
- **Pain 4, joint track** — Typing indicator → AI response với isometric exercise alternative. ExerciseCard hiện với bài thay thế.
- **Pain 4, tendon track** — Redirect to SMSK03 Bifurcation. Screen S13 không render.
- **Pain 5** — Typing indicator → 4-part mandatory response. Không có ExerciseCard. Không có CTA exercise.
- **Loading** — Typing indicator 800ms minimum.
- **Error** — Fallback to rule-based response.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Pain 5: acknowledge | warmth | "Mức 5 — nghe rồi, hôm nay nặng thật." — borderLeft |
| Pain 5: rest permission | honest | "Nghỉ hoàn toàn đi — không cần cố." |
| Pain 5: red flag | honest | "Nếu tê chân hoặc đau lan xuống đùi — đừng chờ, gặp bác sĩ. Không phải lo xa, là nói thật." |
| Pain 5: no protocol note | dry | "Hôm nay không có bài — nghỉ là đúng." |
| Pain 4 joint: response | warmth | "Mức 4 — nặng đấy, okay không? Hôm nay: {isometric_exercise.name_vi} · {duration} · {location}." — "okay không?" bắt buộc per EDS warmth calibration |

### Navigation
- **Enters from:** S14 Home / notification — khi user select pain 4–5 trong check-in flow (same route as S12)
- **Exits to:** S14 Home via tap "Về trang chủ" (pain 5 — no exercise)
- **Exits to:** S09 Exercise Player via tap "Làm bài isometric →" (pain 4, joint track)
- **Exits to:** SMSK03 (pain 4, tendon track)
- **Back behavior:** Tap back → S14 Home

### Edge Cases & Constraints
- Pain 5: show_exercise_card = FALSE — lưu vào checkins.show_exercise_card
- Pain 5 response_type = 'pain5' — lưu vào checkins.response_type
- Red flag check text là fixed copy — không AI-generated, không override
- Nếu pain 5 xảy ra 3 ngày liên tiếp → trigger red flag detection logic (S22 Red Flag screen) — nhưng đây là Tier 2 scope
- **EDS response length (per EDS copy rules):** Pain 5 response: 4–6 câu. Pain 4 joint: 2–3 câu (acknowledge + protocol). Không được dài hơn.
- **EDS opening rule:** AI response KHÔNG bắt đầu bằng "Tôi hiểu rằng...", "Chào bạn", "Cảm ơn đã chia sẻ". Vào thẳng nội dung. Enforce trong FITWELL_SYSTEM_PROMPT.
- **EDS closing rule:** KHÔNG kết bằng "Chúc bạn mau khỏe!", "Cố lên nhé!". Kết bằng action (bài cụ thể) hoặc thông tin (red flag check).
- **Warmth calibration:** Pain 4 = vulnerable moment → phải thêm "okay không?" trước khi assign bài. Pain 5 = warmth + honest, không cheerful. Per EDS warmth calibration section.

- **Component registry note:** All component names in this spec are descriptive intent — not import paths. Before sprint begins, each name must be mapped to an exported component in `design-system.tsx`. If the component does not exist, it must be created in DS first. Cursor must never create one-off components inline.
