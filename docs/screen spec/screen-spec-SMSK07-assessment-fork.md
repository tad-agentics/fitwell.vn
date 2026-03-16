## Screen: SMSK07 — Assessment Fork (Protocol Assignment)
**Tier:** 1
**Route:** /onboarding/assessment

---

### Components
- FitWell avatar mark
- TabToggle × n — 1 tab per condition requiring assessment (hiện khi > 1 condition cần assess)
- C1_CheckIn style card — test instruction block
- RadioRow × 2 — test result options
- ButtonPrimary (46px) — "Xác nhận → bài của bạn →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| assessment_conditions | conditions WHERE assessment_required = TRUE AND assessment_completed = FALSE | Real |
| condition.display_name_vi | conditions.display_name_vi | Real |
| condition.assessment_test_slug | msk_conditions.assessment_test_slug | Real — 'prone_press_up' | 'thomas_test' | 'slump_test' |
| test_instruction_vi | Hard-coded per assessment_test_slug (xem Edge Cases) | Real |
| selected_result | Local state — 'protocol_a' | 'protocol_b' | Real |

### Interaction States
- **Default** — Tab đầu tiên active. Test instruction hiện. 2 radio options. CTA disabled.
- **Selected** — 1 radio selected. CTA enabled.
- **Multi-condition** — Nếu > 1 condition cần assess: tab toggle hiện. User phải hoàn thành từng tab. CTA chỉ enable khi tất cả tabs đã có kết quả.
- **Loading** — Không áp dụng — không có server call khi chọn.
- **Error** — POST /api/v1/conditions/{id}/assessment thất bại → retry 1 lần. Nếu vẫn lỗi → hiện: "Không lưu được kết quả. Thử lại." Không skip được.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Screen label | dry | "Trước khi bắt đầu · Một bài test nhỏ" |
| Screen sub-label | action | "30 giây — để giao đúng bài cho bạn" |
| Test instruction (prone_press_up) | action | "Thử nằm sấp, thư giãn 2 phút. Lưng cảm thấy thế nào sau đó?" |
| Test instruction (thomas_test) | action | "Nằm ngửa, kéo đầu gối về ngực. Chân còn lại có tự nổi lên không?" |
| Test instruction (slump_test) | action | "Ngồi thẳng, cúi đầu, duỗi chân từ từ. Có tê hoặc lan xuống không?" |
| Radio A — prone_press_up | action | "Nhẹ hơn hoặc không đổi" — sub: "→ McKenzie protocol" |
| Radio B — prone_press_up | action | "Nặng hơn" — sub: "→ Lateral shift protocol" |
| Radio A — thomas_test | action | "Chân tự nổi lên — không chạm giường" — sub: "→ Stretch protocol" |
| Radio B — thomas_test | action | "Chân chạm hoặc gần chạm giường" — sub: "→ Strengthen protocol" |
| CTA | action | "Xác nhận → bài của bạn →" |

### Navigation
- **Enters from:** S07 First Insight khi condition.assessment_required = TRUE
- **Exits to:** S08 AI First Response via tap CTA (sau khi tất cả assessments hoàn thành)
- **Back behavior:** Disabled — không có back. Assessment là mandatory, không skip được.

### Edge Cases & Constraints
- **Trigger**: chỉ hiện khi `conditions.assessment_required = TRUE` VÀ `conditions.assessment_completed = FALSE`. Sau khi completed → không bao giờ hỏi lại
- Assessment results lưu vào `conditions.assessment_result` ('protocol_a' | 'protocol_b') và `conditions.assessment_completed = TRUE`
- Sai protocol = treatment làm nặng hơn — không được skip, không được bypass
- Khi > 1 condition cần assess: OI-1 (open item) — UX cho 2 assessment forks đồng thời cần confirm trước P1 gate
- Sub-label trên radio options (protocol route) chỉ hiện dưới dạng annotation muted (font 9px, color t3) — không phải bold guidance. User không cần biết tên protocol.
- Conditions cần assessment: lumbar_disc (prone_press_up), rotator_cuff (scapular_rhythm — tbd), sciatica (slump_test)
- **Multi-condition assessment sequencing (OI-1 resolved):** Nếu user có ≥ 2 conditions đều có `assessment_required = TRUE` → hiện tab toggle, mỗi tab = 1 condition. Tab phải hoàn thành theo thứ tự: tab 1 phải có radio selection trước khi tab 2 unlock. Tab 2 hiện ở trạng thái muted + lock icon cho đến khi tab 1 complete. CTA "Xác nhận → bài của bạn →" chỉ enable khi tất cả tabs đã có kết quả. Không được skip hoặc submit partial. Thứ tự tabs = thứ tự conditions trong `conditions` table theo `created_at ASC`.

- **Component registry note:** All component names in this spec are descriptive intent — not import paths. Before sprint begins, each name must be mapped to an exported component in `design-system.tsx`. If the component does not exist, it must be created in DS first. Cursor must never create one-off components inline.
