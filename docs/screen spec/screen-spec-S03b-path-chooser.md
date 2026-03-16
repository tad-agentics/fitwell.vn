## Screen: S03b — Path Chooser (Biết bệnh chưa?)
**Tier:** 1
**Route:** /onboarding/path

---

### Components
- RadioRow × 2 — single-select options
- ButtonPrimary (46px) — "Tiếp theo →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| pre_selected_query | URL query string `?q=` từ S02 | Real — nếu có chip selection từ S02, pre-fill path A |

### Interaction States
- **Default** — 2 radio rows, không có row nào selected. CTA disabled.
- **Selected** — 1 row highlighted (bg-2 fill, border-inverse). CTA enabled.
- **Loading** — Không áp dụng — không có server call.
- **Error** — Không áp dụng.
- **Empty** — Không áp dụng.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Screen headline | action | "Bạn đã biết tên bệnh của mình chưa?" — 14px bold |
| Sub-copy | dry | "Từng đi khám, hoặc đã tự xác định được" — 10px, muted |
| Radio option A | action | "Biết rồi — tôi đã từng đi khám hoặc tự xác định được" |
| Radio sub A | dry | "Ví dụ: thoát vị đĩa đệm, viêm cân gan chân, đau cổ vai gáy..." |
| Radio option B | action | "Chưa chắc — chỉ biết mình đang khó chịu" |
| Radio sub B | dry | "Chỉ biết đang đau ở đâu, không chắc là bệnh gì" |
| CTA | action | "Tiếp theo →" |

### Navigation
- **Enters from:** S03 Hook via tap CTA — hoặc S02 Pain Entry via chip selection (direct)
- **Exits to:**
  - Option A selected → S04A Condition Search (Tab "Tên bệnh" default)
  - Option B selected → S04 Onboard Q1 — Vị trí (body map path)
- **Back behavior:** Tap back → S03 Hook (hoặc S02 nếu vào từ chip path)

### Edge Cases & Constraints
- Nếu user đến từ chip selection tại S02 (đã biết condition) → pre-select Option A, đừng yêu cầu chọn lại
- Không dùng từ "chẩn đoán" trong bất kỳ copy nào trên screen này — quá clinical
- CTA phải disabled cho đến khi 1 trong 2 option được chọn
