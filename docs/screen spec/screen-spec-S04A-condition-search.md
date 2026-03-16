## Screen: S04A — Condition Search / Mô tả triệu chứng (Tab Toggle)
**Tier:** 1
**Route:** /onboarding/condition
**Progress:** 1/4

---

### Components
- ProgressBar (total=4, current=1)
- TabToggle × 2 — "Tên bệnh" (default) / "Mô tả triệu chứng"
- InputField (search) — Tab A: tìm kiếm tên bệnh
- CheckRow — list condition items (multi-select)
- InputField (textarea) — Tab B: free-text symptom description
- C5_Notif (info level) — Tab B: AI confidence feedback
- C6_Empty — khi Tab A search không có kết quả
- ButtonPrimary (46px) — "Xác nhận ({n} bệnh) →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| condition_list | msk_conditions WHERE is_active = TRUE ORDER BY body_region, name_vi | Real — grouped by body_region |
| search_query | Local state (client-side filter) | Real |
| selected_count | Local state — count of checked conditions | Real |
| ai_suggestions | POST /api/v1/symptom-map response (Tab B only) | Real — Claude Haiku, latency target < 400ms |
| ai_confidence | symptom-map response.confidence (0–1) | Real — show suggestion only if confidence ≥ 0.25 |
| pre_fill_query | URL query string `?q=` từ S02 | Real — pre-populate search field nếu có |

### Interaction States
**Tab A — Tên bệnh:**
- **Default** — Search field trống, full condition list grouped by region. CTA disabled.
- **Typing** — List filters client-side theo search query. Không có server call.
- **Selected** — CheckRow highlighted. Count trên CTA cập nhật. CTA enabled khi ≥ 1 selected.
- **Empty** — Không tìm thấy condition khớp → hiện C6_Empty: "Không tìm thấy. Thử Tab [Mô tả triệu chứng] hoặc mô tả bằng tiếng Việt thông thường."

**Tab B — Mô tả triệu chứng:**
- **Default** — Textarea trống. CTA disabled.
- **Typing** — Không auto-submit. Chờ user xong.
- **Loading** — Sau khi user tap "Tìm bệnh phù hợp →": hiện typing indicator 800ms → AI response.
- **AI returned (confidence ≥ 0.25)** — Hiện C5_Notif với top 1–2 suggestions + match reason. User confirm hoặc điều chỉnh.
- **AI returned (confidence < 0.25)** — Hiện C6_Empty: "Không tìm thấy tình trạng phù hợp. Thử Tab [Tên bệnh] để duyệt danh sách."
- **Error** — API timeout hoặc lỗi → "Không kết nối được — thử lại hoặc dùng Tab [Tên bệnh]." Retry button.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Tab A search placeholder | dry | "Tìm: 'thoát vị', 'gân', 'đầu gối'..." |
| Region group header | dry | Tên vùng cơ thể từ msk_conditions.body_region, viết hoa |
| CTA — no selection | action | "Chọn ít nhất 1 tình trạng" — disabled state |
| CTA — with selection | action | "Xác nhận ({selected_count} bệnh) →" |
| Tab B textarea placeholder | dry | "Ví dụ: lưng đau khi thức dậy, cứng hơn sau ngồi lâu..." |
| Tab B submit button | action | "Tìm bệnh phù hợp →" |
| AI suggestion match reason | insight | Pattern từ AI response — ví dụ: "Khớp với mô tả đau buổi sáng + sau ngồi lâu" |
| Empty state Tab A | zero-guilt | "Không tìm thấy. Thử Tab [Mô tả triệu chứng] hoặc mô tả bằng tiếng Việt thông thường." |
| Empty state Tab B | zero-guilt | "Không tìm thấy tình trạng phù hợp. Thử Tab [Tên bệnh] để duyệt danh sách." |

### Navigation
- **Enters from:** S03b Path Chooser (Option A) via tap CTA
- **Exits to:** S04C Condition Confirm via tap "Xác nhận" (khi ≥ 1 condition selected hoặc AI suggestions confirmed)
- **Exits to (fallback):** S04 Onboard Q1 via tap "Không tìm thấy ở cả 2 tab" link — chỉ hiện khi cả 2 tab empty state triggered
- **Back behavior:** Tap back → S03b Path Chooser

### Edge Cases & Constraints
- Tab A filtering là client-side hoàn toàn — không gọi API
- Tab B gọi POST /api/v1/symptom-map — endpoint này không yêu cầu auth (anonymous session OK)
- Multi-select allowed — user có thể chọn tối đa 5 conditions (quá 5 → hiện warning: "FitWell recommend bắt đầu với 1–2 tình trạng để tập trung")
- selected_conditions được pass sang S04C qua session storage (không URL) — list có thể dài
- Nếu có pre_fill_query từ S02 → auto-populate Tab A search field và filter ngay khi mount
- Tab B typing indicator: hiện spinner 800ms minimum trước khi show AI response dù response đến sớm hơn
- Conditions có `assessment_required = TRUE` (lumbar_disc, rotator_cuff, sciatica) → flag trong session, trigger SMSK07 sau S08
