## Screen: S02 — Pain Entry Search
**Tier:** 1
**Route:** /start

---

### Components
- InputField (text) — symptom free-text search
- ButtonPrimary (46px) — "Tiếp tục"
- C6_Empty — zero-state khi search trả về không kết quả
- PillButton — suggestion chips bên dưới input (top 5 conditions)

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| suggestion_chips | msk_conditions.name_vi WHERE is_active = TRUE ORDER BY body_region | Real — top 5: Đau lưng dưới, Cổ vai gáy, Đầu gối, Cân gan bàn chân, Tê tay |
| search_query | User input (local state) | Real |

### Interaction States
- **Default** — Input field trống + 5 suggestion chips bên dưới. CTA "Tiếp tục" disabled.
- **Typing** — Chips ẩn. Input active. CTA enable khi input ≥ 2 ký tự.
- **Chip selected** — Chip highlight (bg-inverse fill). Input populate với tên condition. CTA enable.
- **Loading** — Không có server call ở bước này — matching hoàn toàn client-side từ suggestion list.
- **Error** — Không áp dụng ở bước này.
- **Empty** — Nếu input không match suggestion nào → hiện "Mô tả tiếp tục — FitWell sẽ hiểu" (không block flow).

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Screen headline | fear-reduction | "Đang khó chịu ở đâu?" — ngắn, trực tiếp |
| Input placeholder | dry | "Ví dụ: đau lưng buổi sáng, tê tay ban đêm..." |
| Suggestion chip label | protocol | Tên điều kiện ngắn gọn từ msk_conditions.name_vi |
| Empty hint | zero-guilt | "Mô tả tiếp tục — FitWell sẽ hiểu" |
| CTA | action | "Tiếp tục" |

### Navigation
- **Enters from:** S01 Splash via tap "Bắt đầu ngay"
- **Exits to:** S03 Hook via tap "Tiếp tục" (kèm query string `?q={search_query}`)
- **Back behavior:** Tap back → S01 Splash

### Edge Cases & Constraints
- Input value được pass sang S03 và S04A qua URL query string `?q=` — không lưu DB ở bước này
- Nếu user chọn suggestion chip → route đến S03b Path Chooser thay vì S03 Hook (condition đã biết)
- Free-text input (không match chip) → route đến S03 Hook → S04A Tab "Mô tả triệu chứng"
- Tối đa 100 ký tự trong input field
- Không anonymous session creation ở screen này — session chỉ tạo khi user qua S07 First Insight
