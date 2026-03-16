## Screen: S09 — Exercise Player (Timer)
**Tier:** 1
**Route:** /exercise/{session_id}

---

### Components
- VideoPlayer (Cloudflare Stream embed — 38% screen height, client:load)
- Timer display — monospace, 26px bold
- ProgressBar (exercise steps — 400ms delay, 700ms fill animation)
- StepLabel — current step name + instruction
- StepCounter — "Bước {current} / {total}"
- ButtonSecondary (46px) — "← Bước trước" (disabled trên step 1)
- ButtonPrimary (46px) — "Bước tiếp →" (hoặc "Hoàn thành" trên bước cuối)
- ExitModal (lazy — chỉ mount khi user tap X)

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| session.id | sessions.id | Real |
| protocol.exercises | protocols.exercises JSONB — array of {exercise_id, order, duration_sec, reps, notes} | Real |
| exercise.name_vi | exercises.name_vi | Real |
| exercise.video_url | exercises.video_url — Cloudflare Stream | Real — có thể null nếu video chưa upload |
| exercise.steps | exercises.steps JSONB — [{order, instruction_vi, duration_sec}] | Real — offline fallback khi video null |
| current_step | Local state — integer | Real |
| timer_remaining | Local state — countdown từ step.duration_sec | Real |
| session.current_step | sessions.current_step — synced on step complete | Real |

### Interaction States
- **Default** — Video plays (nếu có). Timer đang đếm. Bước trước disabled (step 1). Bước tiếp enabled.
- **Video loading** — Video iframe loading → hiện bg-2 placeholder với centered play icon. Video tự play khi loaded.
- **Video null** — exercises.video_url null → hiện step-by-step text instructions từ exercises.steps. Không hiện video placeholder.
- **Timer at zero** — Timer hiện "0:00". Bước tiếp pulse animation để draw attention. Không auto-advance.
- **Last step** — "Bước tiếp →" thay bằng "Hoàn thành ✓" (Primary, same size).
- **Exit intent** — User tap X (top-right) → ExitModal hiện. Không navigate away cho đến khi user confirm.
- **Error** — Video load fail → fallback to text steps silently. PATCH /sessions/{id} fail → retry silently, không block UI.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Exercise name | protocol | exercises.name_vi — bold 12px |
| Step instruction | action | exercises.steps[n].instruction_vi — 11px |
| Step counter | dry | "Bước {current} / {total}" |
| Timer | dry | "0:42" format MM:SS — monospace 26px bold |
| Timer label | dry | "còn lại" — 7px mono, muted |
| Progress bar annotation | dry | "400ms delay · 700ms fill · earned" — không hiện cho user, spec only |
| CTA last step | action | "Hoàn thành ✓" |
| Exit modal CTA | zero-guilt | "Thoát — tiếp sau" |
| Exit modal stay | action | "Tiếp tục bài" |

### Navigation
- **Enters from:** S08 AI First Response via tap CTA / exercise card — hoặc S14 Home via tap "Làm bài ▶"
- **Exits to:** S10 Post-Exercise via tap "Hoàn thành ✓" (last step)
- **Exits to:** S14 Home via ExitModal confirm "Thoát — tiếp sau" (session status = 'exited')
- **Back behavior:** Hardware back → trigger ExitModal (không navigate away directly)

### Edge Cases & Constraints
- PATCH /api/v1/sessions/{id} gọi mỗi khi user advance step (update sessions.current_step) — fire-and-forget, không block UI
- Session completion: PATCH /api/v1/sessions/{id}/complete khi user tap "Hoàn thành ✓"
- **Exit tracking:** Khi user confirm exit qua ExitModal → PATCH /api/v1/sessions/{id} với `{ status: 'exited', completion_pct: Math.round((current_step / total_steps) * 100) }`. Cả hai fields phải được ghi — completion_pct dùng cho analytics và adaptive protocol logic.
- Offline: exercises.steps JSONB là offline fallback — ServiceWorker cache exercises data
- Timer: không auto-advance. Timer là guidance, không phải enforcement.
- Progress bar: 400ms delay sau khi step advance, sau đó 700ms fill animation → "earned" feel
- Video autoplay requires muted attribute (browser policy) — video muted by default, user có thể unmute

---

## Screen: S10 — Post-Exercise (Quiet Acknowledgment)
**Tier:** 1
**Route:** /exercise/{session_id}/done

---

### Components
- CheckIcon (30×30 circle, border s400, "✓" monospace)
- CP block (dry) — acknowledgment headline
- FeedbackChips — 3 options: "Nhẹ hơn" / "Như cũ" / "Nặng hơn" (single-select)
- NextDayCard — tên bài ngày mai + meta
- ButtonPrimary (46px) — "Bật nhắc sáng — 7am"
- Ghost link — "Để sau" (nhỏ, center-align, color t3)

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| session.feedback | sessions.feedback — 'better'|'same'|'worse' | Real |
| next_exercise.name_vi | exercises.name_vi — next protocol step | Real |
| next_exercise.duration_sec | exercises.duration_sec → "X phút" | Real |
| next_exercise.location | exercises.location | Real |
| notification_permission_granted | localStorage flag 'fw_notif_asked' | Real — nếu đã granted, hide CTA |

### Interaction States
- **Default** — Check icon + acknowledgment text. Feedback chips unselected. NextDayCard visible. CTA visible.
- **Chip selected** — Chip highlighted. PATCH /sessions/{id} fires với feedback value. Không navigate — user ở lại screen.
- **Notification already granted** — ButtonPrimary "Bật nhắc sáng — 7am" ẩn. Thay bằng text confirmation: "Nhắc đã bật — FitWell sẽ nhắc vào 7 giờ sáng."
- **Loading** — Không áp dụng — data đã có.
- **Error** — Feedback PATCH fail → retry silently. Không block user.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Acknowledgment headline | dry | "Xong rồi — đúng hướng đấy." — max 1 câu cho ngày thường, 2 câu cho milestone (ngày 7, ngày 30). Ngày thường: max 6 từ, không dùng "Tuyệt vời", không dùng "!". Milestone: thêm peer-nod per EDS ("Được đấy — 7 ngày liên tiếp. Không phải ai cũng làm được.") |
| Feedback prompt | action | "Sau khi làm xong, lưng thấy thế nào?" — replace "lưng" với conditions.display_name_vi |
| Feedback chip 1 | dry | "Nhẹ hơn" |
| Feedback chip 2 | dry | "Như cũ" |
| Feedback chip 3 | dry | "Nặng hơn" |
| NextDay label | dry | "Ngày mai" |
| NextDay exercise | protocol | "{next_exercise.name_vi} · {duration} · {location}" |
| CTA notification | action | "Bật nhắc sáng — 7am" |
| Skip notification | dry | "Để sau — tôi tự nhớ mở app" |

### Navigation
- **Enters from:** S09 Exercise Player via tap "Hoàn thành ✓"
- **Exits to:** S30 Notification Permission via tap "Bật nhắc sáng — 7am" (nếu permission chưa requested)
- **Exits to:** S14 Home via tap "Để sau" hoặc sau 3s auto-navigate nếu notification đã granted
- **Back behavior:** Tap back → S14 Home (không trở lại exercise)

### Edge Cases & Constraints
- Nếu `fw_notif_asked` flag đã set (đã hỏi trước đó) → ẩn CTA, không hỏi lại
- 3 feedback chips: mỗi option dẫn đến AI response path khác nhau trong check-in ngày hôm sau (better / same / worse)
- NextDayCard: lấy từ protocol steps array — exercise tiếp theo theo thứ tự. Nếu đã xong protocol → hiện "Bài mới ngày mai — FitWell sẽ chuẩn bị"
- "Bật nhắc sáng — 7am" trigger S30 (D1): Android/Chrome → web push native dialog sau pre-prompt. iOS → in-app banner path

- **Component registry note:** All component names in this spec are descriptive intent — not import paths. Before sprint begins, each name must be mapped to an exported component in `design-system.tsx`. If the component does not exist, it must be created in DS first. Cursor must never create one-off components inline.
