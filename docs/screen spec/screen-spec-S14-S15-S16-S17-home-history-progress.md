## Screen: S14 — Home / Hôm nay Tab
**Tier:** 1
**Route:** /home

---

### Components
- BottomNav (active=0 — "Hôm nay")
- DateHeader — weekday + day number
- ConsistencyGrid (DotGrid) — 30-day dot grid, pct từ sessions completed / days elapsed
- TodayExerciseCard — protocol name + meta + "Làm bài ▶" CTA
- SparklineCard — 5-day pain trend mini chart
- PatternInsightCard (conditional) — chỉ hiện khi pattern_observations tồn tại, confidence ≥ 60
- ReengagementCard (conditional) — chỉ hiện khi last_checkin > 2 ngày trước
- C6_Empty — khi chưa có protocol assigned (không nên xảy ra sau onboarding nhưng phải handle)

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| user_profiles.onboarding_completed_at | user_profiles | Real — base date cho day_number |
| day_number | CURRENT_DATE - user_profiles.onboarding_completed_at | Real |
| consistency_pct | sessions completed / days elapsed × 100 | Real |
| today_protocol.exercise_name | protocols.exercises[0].exercise_id → exercises.name_vi | Real |
| today_protocol.duration | exercises.duration_sec → "X phút" | Real |
| today_protocol.location | exercises.location | Real |
| recent_pain_scores | checkins.pain_score ORDER BY created_at DESC LIMIT 5 | Real |
| pain_trend_delta | recent_pain_scores[0] - recent_pain_scores[4] | Real — tính client-side |
| pattern_observation.description_vi | pattern_observations WHERE confidence ≥ 60, NOT dismissed | Real |
| session_done_today | sessions WHERE DATE(started_at) = TODAY AND status = 'completed' | Real |

### Interaction States
- **Default (session not done today)** — TodayExerciseCard với CTA "Làm bài ▶" full-color primary.
- **Session done today** — TodayExerciseCard hiện "Đã xong hôm nay ✓". CTA dimmed. Không disable hoàn toàn (user có thể repeat).
- **No check-in today** — Subtle prompt xuất hiện trên TodayExerciseCard: "Chưa check-in hôm nay" → tap opens S12.
- **Loading** — Skeleton: ConsistencyGrid (bg-2 rect, 100% width, 40px height), TodayExerciseCard (bg-2 rect, 80px), SparklineCard (bg-2 rect, 60px). Animate-pulse.
- **Error** — API fail → hiện cached data từ Zustand nếu có. Nếu không có cache → C6_Empty với "Không tải được dữ liệu. Kéo để thử lại."
- **Empty (no protocol)** — C6_Empty: "Bài của bạn đang được chuẩn bị — quay lại sau 1 phút." (không nên xảy ra trong normal flow)
- **Re-engagement (2+ ngày skip)** — ReengagementCard xuất hiện thay TodayExerciseCard standard. Xem S15 spec.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Date header | dry | "Thứ Ba · Ngày {n}" |
| Consistency label | dry | "Consistency · 30 ngày" |
| Today exercise label | dry | "Bài hôm nay" |
| Exercise name | protocol | "{today_protocol.exercise_name}" — bold |
| Exercise meta | dry | "{duration} · {location}" — muted |
| CTA | action | "Làm bài ▶" |
| Sparkline label | dry | "5 ngày · điểm đau" |
| Pain trend | pattern | "{score1} → {score2} → ... → {score5} · {trend_label}" — trend_label: "↓ đang cải thiện" khi delta < 0 |
| Pattern insight — standard | pattern | pattern_observations.description_vi — neutral observer. Kết thúc bằng: "Bạn quyết định làm gì với thông tin đó." Dùng khi `is_first_pattern = false`. |
| Pattern insight — first (M8) | warmth → pattern | Khi `is_first_pattern = true`: thêm 1 câu warm trước: "Đủ data rồi — bắt đầu thấy pattern của bạn." Sau đó observation trung tính bình thường. Chỉ dùng 1 lần duy nhất. |
| Re-anchor card — day 28 | peer-nod + pattern + honest | Khi `day_number 26–30 AND pain_trend stable AND sessions_last_7d ≥ 5`: hiện C9_Reanchor card (amber top border) thay vì standard pattern card. Copy: "Tháng đầu xong rồi — ổn đấy. [Data]. Giảm xuống 3 ngày/tuần thay vì dừng — giữ được lâu hơn nhiều." |

### Navigation
- **Enters from:** Any screen via BottomNav tap "Hôm nay" — hoặc post-auth redirect — hoặc notification deep link
- **Exits to:** S12 Check-in via tap check-in prompt
- **Exits to:** S09 Exercise Player via tap "Làm bài ▶"
- **Exits to:** S16 Lịch sử via BottomNav tap
- **Exits to:** S17 Tiến triển via BottomNav tap
- **Back behavior:** Hardware back → không làm gì (Home là root)

### Edge Cases & Constraints
- PatternInsightCard: chỉ hiện khi pattern_observations.confidence ≥ 60 VÀ chưa dismissed. Tone: neutral observer — "Nhận ra: X. Bạn quyết định làm gì với thông tin đó." Không dùng "bạn nên" hay "bạn cần"
- **First pattern (M8):** `is_first_pattern` = TRUE khi đây là lần đầu tiên pattern_observations được surface cho user. Thêm 1 câu warm trước observation: "Đủ data rồi — bắt đầu thấy pattern của bạn." Sau lần đầu, flag này set FALSE — các pattern tiếp theo dùng tone neutral hoàn toàn.
- **Day 28 re-anchor:** Trigger khi `day_number BETWEEN 26 AND 30 AND consistency_pct ≥ 70 AND avg_pain_7d ≤ 2.5`. Hiện C9_Reanchor card (amber top border) THAY THẾ standard PatternInsightCard. Không hiện cả 2 cùng lúc. Chỉ trigger 1 lần.
- Nếu user có multiple active conditions → TodayExerciseCard hiện 1 primary condition. Selector for switching conditions: post-MVP scope
- ConsistencyGrid: % tính từ onboarding_completed_at, không phải streak — không phạt ngày skip
- Pull-to-refresh cho manual data refresh

---

## Screen: S15 — Re-engagement (2+ ngày skip)
**Tier:** 1
**Route:** /home (same — conditional state của S14)

---

### Components
- BottomNav (active=0)
- DateHeader
- ReengagementCard — FitWell avatar + CP block (zero-guilt)
- PainScoreSelector — inline trong ReengagementCard
- ConsistencyGrid — 30-day, hiện bình thường (không phạt gap)
- C6_Empty — không áp dụng

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| days_since_last_checkin | CURRENT_DATE - MAX(checkins.created_at) | Real |
| consistency_pct | Tính bình thường — ngày skip không trừ điểm | Real |
| condition.display_name_vi | conditions.display_name_vi | Real |

### Interaction States
- **Default** — ReengagementCard ở đầu trang. PainScoreSelector inline.
- **Score selected** — Behaves identically to S12/S13 depending on score.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Re-engagement message — 2-day | zero-guilt | `days_since_last_checkin < 7`: "{n} ngày không thấy — không sao, không hỏi lý do. Cơ thể vẫn nhớ. Làm bài hôm nay bình thường, như chưa có gì." |
| Re-engagement message — 7-day+ | zero-guilt | `days_since_last_checkin ≥ 7`: "1 tuần không thấy — không sao, không hỏi lý do. Cơ thể vẫn nhớ — tiếp tục bài cũ, không cần restart." — "không cần restart" bắt buộc để counter perceived momentum loss sau skip dài. |
| Pain prompt | action | "{condition.display_name_vi} hôm nay thế nào?" |

### Navigation
- **Trigger condition:** last check-in > 2 ngày trước — S14 renders ReengagementCard thay vì standard TodayExerciseCard
- Sau khi pain score selected → flow identical to S12/S13

### Edge Cases & Constraints
- Không mention số ngày đã skip trong copy user-facing — chỉ "không thấy" generic
- Không mention streak bị break
- 7-day+ variant: thêm "không cần restart" — quan trọng vì user với skip dài perceived như phải bắt đầu lại từ đầu. Copy clear điều này.
- ConsistencyGrid hiện % thực (tính bình thường, không phạt) — user thấy pattern, không thấy punishment

---

## Screen: S16 — Lịch sử Tab
**Tier:** 1
**Route:** /history

---

### Components
- BottomNav (active=1 — "Lịch sử")
- MonthHeader — tháng hiện tại
- CalendarGrid — 30-day calendar, shade = pain score intensity
- PainLegend — pain score 1–5 color scale
- StatsRow — 3 stats: Bài hoàn thành / Check-in / Ngày điểm 1–2

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| calendar_data | checkins GROUP BY DATE ORDER BY date — last 30 days | Real |
| calendar_day.pain_score | checkins.pain_score | Real |
| calendar_day.session_completed | sessions.status = 'completed' for that date | Real |
| stats.sessions_completed | COUNT sessions WHERE status='completed', last 30 days | Real |
| stats.checkins_total | COUNT checkins, last 30 days | Real |
| stats.days_low_pain | COUNT days WHERE pain_score <= 2, last 30 days | Real |

### Interaction States
- **Default** — Calendar rendered với shading. Stats row below.
- **Loading** — Calendar skeleton: 5 rows × 7 cells bg-2, animate-pulse. Stats row skeleton: 3 rects.
- **Error** — "Không tải được lịch sử. Kéo để thử lại."
- **Empty (new user < 7 days)** — Calendar hiện partial (chỉ ngày đã có data). Ngày chưa có data hiện bg-1 (không shade).
- **Day tap** — Tap vào ngày bất kỳ → expandable tooltip: pain score + session status ngày đó. (Tier 1 — simple tooltip, không navigate)

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Tab label | dry | "Lịch sử" |
| Month header | dry | "Tháng {M}" — không interpret, không comment |
| Stat 1 label | dry | "Bài hoàn thành" |
| Stat 2 label | dry | "Check-in" |
| Stat 3 label | dry | "Điểm 1–2" |

### Navigation
- **Enters from:** BottomNav tap "Lịch sử"
- **Exits to:** Any tab via BottomNav
- **Back behavior:** Hardware back → S14 Home

### Edge Cases & Constraints
- Calendar shading: pain_score 1→5 maps to opacity 0.17 → 0.77 (rgba dark). Ngày không có check-in: bg-1 (no shade)
- Ngày có session completed nhưng không có check-in → không shade (không đủ data)
- **Calendar data range:** Rolling 30 ngày từ TODAY-29 đến TODAY — không phải calendar month. Header "Tháng {M}" là display label cho tháng hiện tại, không phải định nghĩa data range. Nếu rolling 30 ngày span 2 tháng → header hiện tháng hiện tại, calendar cells hiện cả 2 tháng.

---

## Screen: S17 — Tiến triển Tab
**Tier:** 1
**Route:** /progress

---

### Components
- BottomNav (active=2 — "Tiến triển")
- SectionHeader — "Tiến triển" + "Điểm đau"
- PainChart — 14-day bar chart (PainChart.tsx, client:visible)
- DeltaLabel — pain delta last 14 days (↓ −X.X điểm)
- StatsGrid — 2×2 grid: Bài hoàn thành / Consistency / Ngày điểm 1–2 / Avg pain
- PatternInsightCard (14d+ only) — borderLeft risk tint hoặc neutral

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| chart_data | checkins.pain_score ORDER BY created_at DESC LIMIT 14 | Real — sorted ascending for chart |
| pain_delta | chart_data[0].pain_score - chart_data[13].pain_score (hoặc available range) | Real |
| stats.sessions_completed | COUNT sessions WHERE status='completed', last 30 days | Real |
| stats.consistency_pct | sessions_completed / days_elapsed × 100 | Real |
| stats.days_low_pain | COUNT days WHERE avg pain_score <= 2 | Real |
| stats.avg_pain | AVG checkins.pain_score, last 30 days | Real |
| pattern_observation | pattern_observations WHERE confidence ≥ 60 AND NOT dismissed | Real — Tier 2 generation, Tier 1 display only |

### Interaction States
- **Default** — Chart + stats + pattern card (nếu có).
- **Loading** — PainChart skeleton (bg-2 bar chart shape, animate-pulse). Stats skeleton: 4 rects 2×2.
- **Error** — "Không tải được dữ liệu tiến triển. Kéo để thử lại."
- **Empty (< 3 check-ins)** — Chart không hiện. Hiện C6_Empty: "Cần thêm check-in để thấy tiến triển — tiếp tục làm bài hàng ngày."
- **No pattern (< 14 days)** — PatternInsightCard ẩn hoàn toàn.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Chart label | dry | "14 ngày gần nhất" |
| Delta label | pattern | "↓ −{X.X} điểm" khi cải thiện / "↑ +{X.X} điểm" khi tệ hơn / "Không đổi" |
| Week labels | dry | "Tuần 1" / "Tuần 2" |
| Pattern card — standard | pattern | `is_first_pattern = false`: pattern_observations.description_vi — neutral observer, không prescribe. Kết thúc bằng: "Bạn quyết định làm gì với thông tin đó." |
| Pattern card — first (M8) | warmth → pattern | `is_first_pattern = true`: thêm 1 câu warm trước: "Đủ data rồi — bắt đầu thấy pattern của bạn." Sau đó observation trung tính như standard. Chỉ trigger 1 lần duy nhất. |
| Empty state | zero-guilt | "Cần thêm check-in để thấy tiến triển — tiếp tục làm bài hàng ngày." |

### Navigation
- **Enters from:** BottomNav tap "Tiến triển"
- **Exits to:** Any tab via BottomNav
- **Back behavior:** Hardware back → S14 Home

### Edge Cases & Constraints
- PainChart là client:visible — lazy hydrate khi scroll vào viewport
- Delta tính từ first available data point trong 14 ngày (không cần đủ 14 ngày)
- PatternInsightCard: chỉ hiện khi có data ≥ 14 ngày VÀ pattern_observations.confidence ≥ 60
- Tone: không interpret tốt xấu. Số liệu + delta = đủ. Không thêm "Đang tốt lên" hay "Cần cố gắng hơn"
- Consistency %: không phạt ngày skip — tính bài đã làm / tổng ngày kể từ onboarding

- **Component registry note:** All component names in this spec are descriptive intent — not import paths. Before sprint begins, each name must be mapped to an exported component in `design-system.tsx`. If the component does not exist, it must be created in DS first. Cursor must never create one-off components inline.

---

## Screen: S28 — Re-anchor (Day 28–30 Complacency)
**Tier:** 1
**Route:** /home (conditional state của S14 — renders ReanchorCard in place of standard PatternInsightCard)

---

### Overview

S28 không phải re-engagement (user vẫn đang dùng app). Là gentle re-anchor tại điểm nguy hiểm nhất: user đang ổn → complacency → tự exit. Trigger: day ≥ 28 + pain stable (avg ≤ 2.5 trong 14 ngày) + consistency ≥ 70%. Hiện 1 lần. Tone: amber — không teal (không celebrate), không risk (không alarm).

---

### Components
- BottomNav (active=0)
- DateHeader
- ReanchorCard — amber top border (2px), C9_Reanchor pattern từ design system
- StatTile (inline trong card) — pain delta 28 ngày
- GhostButton — "Điều chỉnh lịch"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| day_number | CURRENT_DATE - user_profiles.onboarding_completed_at | Real |
| pain_avg_28d | AVG checkins.pain_score last 28 days | Real |
| pain_start | checkins.pain_score ORDER BY created_at ASC LIMIT 1 | Real — first check-in score |
| pain_current_avg | AVG checkins.pain_score last 7 days | Real |
| consistency_pct | sessions completed / days_elapsed × 100 | Real |
| reanchor_shown | user_profiles or localStorage flag `fw_reanchor_shown` | Real — set TRUE after first display, never show again |

### Interaction States
- **Default** — ReanchorCard renders below TodayExerciseCard. 1 soft CTA "Điều chỉnh lịch".
- **Dismissed** — User tap outside card or scroll past → set `fw_reanchor_shown = true` → card disappears permanently. No explicit dismiss button needed.
- **CTA tap** — "Điều chỉnh lịch" navigates to notification/schedule settings (S23 Hồ sơ Tab → notification section). Not a blocking modal.
- **Loading** — SkeletonBlock same height as card.
- **Error** — If trigger data unavailable → do not show card. Silent fail.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Card label | dry | "Tháng đầu · Ngày {day_number}" |
| Headline | peer-nod | "Tháng đầu xong rồi." — 4 từ, không thêm |
| Acknowledgment | peer-nod | "Ổn đấy. Điểm đau trung bình từ {pain_start} xuống {pain_current_avg} trong 28 ngày. Tháng 2 sẽ dễ hơn — base đã có rồi." |
| Re-anchor suggestion label | dry | "Re-anchor" — muted label |
| Re-anchor body | pattern | "Pattern đang ổn định. Giảm xuống 3 buổi/tuần thay vì dừng — duy trì được lâu hơn nhiều." — neutral observation, không imperative |
| CTA | action | "Điều chỉnh lịch" — ghost button, low emphasis |

### Navigation
- **Enters from:** S14 Home (conditional render khi trigger conditions met)
- **Exits to:** S23 Hồ sơ → notification settings via "Điều chỉnh lịch"
- **Dismiss:** scroll past hoặc navigate away — set shown flag, không show lại
- **Back behavior:** Không áp dụng — đây là state của S14

### Edge Cases & Constraints
- Hiện **1 lần duy nhất** — sau khi trigger và hiện, set `fw_reanchor_shown = true`. Không repeat kể cả nếu user đạt điều kiện lại ở day 45, 60, v.v.
- **Không override** TodayExerciseCard — ReanchorCard hiện phía dưới exercise card, không thay thế
- Trigger checks: `day_number ≥ 28` AND `pain_avg_14d ≤ 2.5` AND `consistency_pct ≥ 70` AND `fw_reanchor_shown !== true`
- Nếu pain tăng lại sau ngày 28 → re-engagement flow bình thường (S15), không re-anchor
- **Tone:** amber border top (2px, `colors.amber`) — phân biệt với pattern card (border-left neutral). Không dùng teal (không phải milestone celebration). Không dùng risk (không phải cảnh báo).
- **Component registry note:** All component names in this spec are descriptive intent — not import paths. Before sprint begins, each name must be mapped to an exported component in `design-system.tsx`. If the component does not exist, it must be created in DS first. Cursor must never create one-off components inline.
