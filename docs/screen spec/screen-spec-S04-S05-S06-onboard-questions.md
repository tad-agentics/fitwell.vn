## Screen: S04 — Onboard Q1 — Vị trí (Path B)
**Tier:** 1
**Route:** /onboarding/location
**Progress:** 1/4

---

### Components
- ProgressBar (total=4, current=1)
- Chip (multi-select) — body region chips
- ButtonPrimary (46px) — "Tiếp theo →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| selected_regions | Local state | Real |

### Interaction States
- **Default** — All chips unselected. CTA disabled.
- **Selected** — Chip(s) highlighted (bg-inverse fill). CTA enabled.
- **Loading** — Không áp dụng.
- **Error** — Không áp dụng.
- **Empty** — Không áp dụng.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Screen headline | action | "Đang khó chịu ở vùng nào?" |
| Sub-copy | dry | "Chọn tất cả vùng đang có vấn đề" |
| Chip labels | dry | Lưng dưới / Cổ vai gáy / Đầu gối / Bàn chân / Vai / Khuỷu tay / Cổ tay / Hông |
| CTA | action | "Tiếp theo →" |

### Navigation
- **Enters from:** S03b Path Chooser (Option B) via tap CTA
- **Exits to:** S05 Onboard Q2 via tap "Tiếp theo →"
- **Back behavior:** Tap back → S03b Path Chooser

### Edge Cases & Constraints
- Multi-select — không giới hạn số lượng
- selected_regions lưu vào session state, dùng cho S04C condition suggestion
- Screen chỉ xuất hiện trong Path B (chưa biết tên bệnh)

---

## Screen: S05 — Onboard Q2 — Trigger
**Tier:** 1
**Route:** /onboarding/trigger
**Progress:** 2/4

---

### Components
- ProgressBar (total=4, current=2)
- RadioRow × 5 — single-select trigger options
- ButtonPrimary (46px) — "Tiếp theo →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| selected_trigger | Local state | Real |

### Interaction States
- **Default** — Không có row selected. CTA disabled.
- **Selected** — 1 row highlighted. CTA enabled.
- **Loading** — Không áp dụng.
- **Error** — Không áp dụng.
- **Empty** — Không áp dụng.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Screen headline | action | "Thường đau nhất lúc nào?" |
| Radio: morning | action | "Buổi sáng — khi mới thức hoặc mới đứng dậy" |
| Radio: after_sitting | action | "Sau khi ngồi lâu — họp, làm việc" |
| Radio: movement | action | "Khi vận động — leo cầu thang, đi bộ" |
| Radio: end_of_day | action | "Cuối ngày — sau khi đứng hoặc làm việc nhiều" |
| Radio: constant | action | "Liên tục — lúc nào cũng thấy" |
| CTA | action | "Tiếp theo →" |

### Navigation
- **Enters from:** S04 Onboard Q1 via tap "Tiếp theo →"
- **Exits to:** S06 Onboard Q3 via tap "Tiếp theo →"
- **Back behavior:** Tap back → S04 Onboard Q1

### Edge Cases & Constraints
- selected_trigger maps to conditions.trigger_pattern: 'morning'|'after_sitting'|'movement'|'end_of_day'|'constant'
- Single-select only

---

## Screen: S06 — Onboard Q3 — Đang xử lý
**Tier:** 1
**Route:** /onboarding/current-treatment
**Progress:** 3/4

---

### Components
- ProgressBar (total=4, current=3)
- CheckRow × 5 — multi-select current treatments
- ButtonPrimary (46px) — "Xem bài của bạn →"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| selected_treatments | Local state | Real |

### Interaction States
- **Default** — Không có row selected. CTA enabled (bỏ qua được).
- **Selected** — Row(s) highlighted. Count không hiện trên CTA.
- **Loading** — Không áp dụng.
- **Error** — Không áp dụng.
- **Empty** — CTA vẫn enabled — câu hỏi này là optional signal, không block flow.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Screen headline | action | "Đang làm gì để xử lý?" |
| Sub-copy | zero-guilt | "Chọn tất cả cách bạn đang dùng — không có đáp án đúng sai" |
| Check: endure | honest | "Chịu đựng — chưa làm gì cụ thể" |
| Check: massage | action | "Massage / dầu nóng / chườm" |
| Check: medication | dry | "Uống thuốc giảm đau" |
| Check: gym | action | "Tập gym hoặc tự tập" |
| Check: physio | action | "Vật lý trị liệu / bác sĩ" |
| CTA | action | "Xem bài của bạn →" |

### Navigation
- **Enters from:** S05 Onboard Q2 via tap "Tiếp theo →"
- **Exits to:** S04C Condition Confirm via tap CTA (Path B converge)
- **Back behavior:** Tap back → S05 Onboard Q2

### Edge Cases & Constraints
- Multi-select — không bắt buộc chọn. CTA luôn enabled
- selected_treatments maps to conditions.current_treatments: ['endure','massage','medication','gym','physio']
- Sau S06, hệ thống đã có đủ dữ liệu để gợi ý condition tại S04C (Path B)
