## Screen: S04C — Condition Confirm (Điểm hội tụ)
**Tier:** 1
**Route:** /onboarding/confirm
**Progress:** 4/4

---

### Components
- ProgressBar (total=4, current=4)
- FitWell avatar mark (22×22 box — icon placeholder)
- C1_CheckIn style card — condition recognition block
- ConditionRow × n — confirmed conditions (checkbox-style, pre-checked)
- ButtonSecondary (46px) — "Điều chỉnh"
- ButtonPrimary (46px) — "Đúng rồi, tiếp tục →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| confirmed_conditions | Session state từ S04A (Path A) hoặc server suggestion từ S04/S05/S06 (Path B) | Real |
| condition.display_name_vi | msk_conditions.name_vi | Real |
| condition.body_region | msk_conditions.body_region | Real |
| condition.name_en | msk_conditions.name_en | Real — hiện dưới dạng sub-label muted |
| path_variant | Session state — 'path_a' | 'path_b' | Real — ảnh hưởng copy của intro block |

### Interaction States
- **Default** — Tất cả conditions pre-checked. Cả hai CTAs enabled.
- **Deselected** — User có thể uncheck condition. Nếu uncheck hết → CTA Primary disabled + "Chọn ít nhất 1 tình trạng".
- **Loading** — Path B: hiện typing indicator 800ms khi load screen lần đầu (server cần suggest conditions từ onboard data). Path A: không có loading.
- **Error** — Path B server error → fallback text: "Không xác định được tình trạng — thử lại hoặc quay lại điều chỉnh." + retry.
- **Empty** — Không áp dụng (luôn có ≥1 condition từ upstream).

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Screen label | dry | "FitWell · nhận diện tình trạng" |
| Intro block — Path A | dry | "Tình trạng FitWell nhận ra:" |
| Intro block — Path B | insight | "Dựa trên vùng đau + pattern bạn mô tả, FitWell nhận ra [n] tình trạng. Đúng không?" |
| Condition row name | protocol | msk_conditions.name_vi — bold |
| Condition row sub | dry | "{body_region} · {name_en}" — muted |
| CTA Secondary | action | "Điều chỉnh" |
| CTA Primary | action | "Đúng rồi, tiếp tục →" |

### Navigation
- **Enters from:**
  - Path A: S04A Condition Search via tap "Xác nhận"
  - Path B: S06 Onboard Q3 via tap "Xem bài của bạn →"
- **Exits to:** S07 First Insight via tap "Đúng rồi, tiếp tục →"
- **Exits to:** S04A (Path A) hoặc S04 (Path B) via tap "Điều chỉnh"
- **Back behavior:** Tap back → tương đương tap "Điều chỉnh"

### Edge Cases & Constraints
- **Anonymous session tạo tại đây** — POST /api/v1/auth/anonymous được gọi ngay khi user tap "Đúng rồi, tiếp tục →", trước khi navigate sang S07. JWT lưu in-memory. Nếu API call thất bại → retry 1 lần, sau đó hiện error: "Không tạo được phiên làm việc. Kiểm tra kết nối và thử lại."
- Sau khi anonymous session tạo thành công → POST /api/v1/conditions với confirmed_conditions list
- Conditions có `assessment_required = TRUE` → flag vào session, SMSK07 sẽ trigger sau S09 (lần đầu vào protocol)
- Conditions có `safety_warning_vi NOT NULL` (achilles, plantar_fasciitis, rotator_cuff) → flag vào session, SMSK08 trigger trước S09
- Tối đa 5 conditions — nếu user đã select nhiều hơn 5 ở S04A → S04C chỉ show 5, hiện note: "FitWell bắt đầu với 5 tình trạng ưu tiên — có thể thêm sau từ Hồ sơ"
