# FitWell — Gap Analysis (Spec vs Implementation)

**Date:** March 2026  
**Scope:** Screen specs in `docs/screen spec/` vs current `web/` and `api/` implementation.

---

## 1. S01 — Splash

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| Redirect when JWT valid | "Nếu user đã có anonymous session **hoặc JWT** hợp lệ → redirect S15 Home" | Only checks `fw_anonymous_id` (localStorage); no in-memory JWT check | P2 |
| Copy | Ghost: "Đã có tài khoản — đăng nhập" | Implemented | — |

---

## 2. S14 — Home / Hôm nay

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| Date header | "Thứ Ba **· Ngày {n}**" (day_number from onboarding_completed_at) | Only weekday; no "Ngày N" | P1 |
| Session done today | "Đã xong hôm nay ✓"; CTA dimmed (user can still repeat) | No check; CTA always "Làm bài ▶" | P1 |
| Loading | Skeleton: ConsistencyGrid 40px, TodayExerciseCard 80px, Sparkline 60px, animate-pulse | Plain "Đang tải..." text | P2 |
| Error | Cached data from Zustand or "Không tải được dữ liệu. Kéo để thử lại." | No error state / pull-to-refresh | P2 |
| Sparkline trend label | "{score1} → … → {score5} · **{trend_label}**" (e.g. "↓ đang cải thiện" when delta < 0) | No trend label under sparkline | P2 |
| Consistency label | "Consistency · 30 ngày" above grid | Missing label above ConsistencyDotGrid | P3 |
| Pull-to-refresh | Manual data refresh | Not implemented | P3 |

---

## 3. S15 — Re-engagement (2+ ngày skip)

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| Inline PainScoreSelector | ReengagementCard has **PainScoreSelector inline**; score selected → same flow as S12/S13 (POST checkin, then AI response) | Only ProtocolBlock message + standard TodayExerciseCard below; no inline pain selector or check-in submission from Home | P1 |
| Copy 2-day vs 7-day | 2-day: "…Làm bài hôm nay bình thường, như chưa có gì." 7-day: "…tiếp tục bài cũ, **không cần restart**." | Both variants in one block; 7-day copy present | — |

---

## 4. S16 — Lịch sử

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| Pain legend | "1 2 3 4 5 ← Điểm đau" (PainLegend) | Short legend present | — |
| Day tap tooltip | Expandable tooltip: pain + session status | Implemented | — |
| Consistency label | — | N/A | — |

---

## 5. S17 — Tiến triển

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| Delta format | "↓ **−X.X** điểm" / "↑ **+X.X** điểm" (one decimal) | Integer: "↓ −2 điểm" | P2 |
| PatternInsightCard | Show when **14d+ data** AND pattern_observations confidence ≥ 60; same copy rules as S14 | Not shown on Progress; only on Home | P1 |
| Error state | "Không tải được dữ liệu tiến triển. Kéo để thử lại." | No explicit error UI | P2 |
| Loading | PainChart skeleton + 4 stat rects 2×2 | No skeleton | P2 |

---

## 6. S28 — Re-anchor (Day 28–30)

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| ReanchorCard | Trigger: day_number 26–30, pain_avg_14d ≤ 2.5, consistency_pct ≥ 70, `fw_reanchor_shown` not set. Card: amber top border, copy "Tháng đầu xong rồi…", "Điều chỉnh lịch" → notification settings | Not implemented | P2 |
| One-time flag | Set `fw_reanchor_shown = true` after first show; never show again | — | P2 |

---

## 7. S09 — Exercise Player

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| VideoPlayer | Cloudflare Stream embed, 38% height; loading placeholder with play icon; null → text steps only | No video embed; text steps only | P2 |
| Timer at zero | "Bước tiếp" **pulse animation** when timer 0:00 | No pulse | P3 |
| Progress bar animation | 400ms delay, 700ms fill after step advance | StepProgressBar present; no 400/700ms animation | P3 |

---

## 8. S10 — Post-Exercise

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| Session complete | POST /sessions/:id/complete (not PATCH) | POST used | — |
| NextDayCard | Real next exercise or "Bài mới ngày mai — FitWell sẽ chuẩn bị" | Implemented | — |
| Notification granted | After grant: "Đã bật — FitWell sẽ nhắc vào 7 giờ sáng." then dismiss → Home | handleAllow redirects to /home; no in-screen confirmation message before redirect | P2 |
| Auto-navigate | "sau 3s auto-navigate nếu notification đã granted" | Not implemented | P3 |

---

## 9. S12 / S13 — Check-in

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| Pain prompt | "{condition.display_name_vi} **sáng nay** thế nào?" | PainScoreSelector uses condition name; spec says "sáng nay" for check-in | P2 |
| Free text | **FreeTextToggle** — "Thêm ghi chú" (expand textarea), not always visible | Textarea always visible | P2 |
| Pain 5 exit | "Về trang chủ" link/button (S13) | No "Về trang chủ" on pain 5 response | P1 |
| Already checked in today | Show today's check-in read-only; UNIQUE (user_id, condition_id, DATE) | No handling; can submit again | P2 |
| Typing indicator | 800ms minimum before showing AI response | No typing indicator | P2 |

---

## 10. SMSK03 — Check-in Bifurcation (tendon pain 4)

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| Flow | Pain 4 + tendon → working signal + "Tiếp tục bài →" | Implemented (response_type tendon_working_signal, ExerciseCard, CTA) | — |
| Badge | "Bài giữ nguyên" on card | Implemented | — |

---

## 11. S30 — Notification Setup

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| Presentation | **Modal overlay** (BottomSheet); not full page | Full page at /notifications/setup | P2 |
| Backdrop tap | "Backdrop tap → không dismiss. User phải tap 1 trong 2 CTAs." | N/A (full page) | P2 |
| iOS Safari | "Trên iPhone: mở FitWell mỗi ngày — thông báo sẽ xuất hiện khi app đang mở." (no web push) | No platform detection / message | P2 |
| Denied fallback | "Bạn có thể bật lại thông báo trong Settings trình duyệt." (show once) | No post-deny message | P3 |
| Notification API unavailable | Hide CTA; show "Trình duyệt của bạn chưa hỗ trợ thông báo…" | No check | P3 |
| VAPID subscription | Save to push_subscriptions after grant | Not verified in codebase | P2 |

---

## 12. API & Data

| Gap | Spec / TechSpec | Current | Priority |
|-----|-----------------|---------|----------|
| GET /api/v1/progress/pattern | Return pattern_observations (confidence ≥ 60, NOT dismissed) | Stub returns null; table exists | P1 |
| session_done_today | For S14: need "session completed today" for current user/condition | Not exposed to frontend (calendar has session_completed per day; Home doesn’t derive "session done today") | P1 |
| day_number in /me | GET /api/v1/me returns onboarding_completed_at; client can compute day_number | Implemented | — |
| consistency_pct | "sessions completed / **days_elapsed** × 100" (from onboarding) | Calendar stats use fixed 30 days | P2 (spec says days_elapsed from onboarding) |

---

## 13. Onboarding & Other Screens

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| S07 "Về trang chủ" | Should go to **/home** (S14) | S07FirstInsight links to "/" | P1 |
| S04–S06, S04A, S04C, S07, S08, SMSK07, SMSK08 | Routes and flows | Implemented per prior work | — |

---

## 14. Design System & Copy

| Gap | Spec | Current | Priority |
|-----|------|---------|----------|
| EDS copy rules | No "Tuyệt vời", "!", "Chúc bạn mau khỏe"; opening/closing rules | Enforced in prompts; UI copy aligned | — |
| Component registry | All spec components map to design-system.tsx | BottomNav, ProtocolBlock, etc. in DS | — |

---

## Summary — Recommended Build Order

**P1 (high impact, spec-critical)**  
1. **S14:** Date header "Ngày {n}" + session_done_today (fetch or derive from calendar) + "Đã xong hôm nay ✓" / dimmed CTA.  
2. **S15:** Inline PainScoreSelector in ReengagementCard; on submit, POST check-in and show same S12/S13 response flow (or redirect to check-in with pre-selected score).  
3. **S17:** PatternInsightCard when 14d+ and pattern API returns observation (wire real GET /progress/pattern from pattern_observations).  
4. **Check-in pain 5:** Add "Về trang chủ" button/link on S13 pain-5 response.  
5. **S07:** Change "Về trang chủ" target from "/" to "/home".  
6. **API:** Implement GET /api/v1/progress/pattern from `pattern_observations` (confidence ≥ 60, NOT is_dismissed).

**P2 (UX polish, spec alignment)**  
7. S14 loading skeletons; error state + pull-to-refresh.  
8. S14 sparkline trend label ("↓ đang cải thiện").  
9. S17 delta one decimal (X.X); error + loading skeletons.  
10. S30: Modal/BottomSheet instead of full page; iOS Safari message; denied fallback.  
11. Check-in: FreeTextToggle (expand "Thêm ghi chú"); typing indicator 800ms; "sáng nay" in prompt; already-checked-in handling.  
12. S10: Post-grant confirmation message before redirect; S01 JWT redirect if applicable.  
13. S28 ReanchorCard (trigger + one-time flag + copy).  
14. Consistency % from days_elapsed since onboarding (if product confirms).

**P3 (nice-to-have)**  
15. S09: Video embed when video_url present; timer pulse at 0; progress bar 400/700ms animation.  
16. S10: 3s auto-navigate when notification already granted.  
17. S30: Unsupported browser message; VAPID subscription persistence check.  
18. S14: "Consistency · 30 ngày" label above grid.

---

*Generated from screen specs in `docs/screen spec/` and current codebase.*
