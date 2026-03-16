## Screen: SMSK08 — Safety Warning
**Tier:** 1
**Route:** /onboarding/safety-warning (modal overlay — không phải full page)

---

### Components
- BottomSheet modal (full-width, bottom anchor)
- C5_Notif (warning level) — safety warning content block
- ButtonPrimary (46px) — "Đã hiểu — tiếp tục"

### Data Variables
| Variable | Source | Real or Placeholder |
|---|---|---|
| condition.display_name_vi | conditions.display_name_vi | Real |
| safety_warning_vi | msk_conditions.safety_warning_vi | Real — non-null only for: achilles, plantar_fasciitis, rotator_cuff |
| condition.name_en | msk_conditions.name_en | Real — sub-label |

### Interaction States
- **Default** — Modal hiện với safety warning content. 1 CTA duy nhất.
- **Loading** — Không áp dụng — content đã có từ session.
- **Error** — Không áp dụng.
- **Empty** — Screen này không render nếu safety_warning_vi là NULL — không có empty state.

### Copy Slots
| Slot | Context | Notes |
|---|---|---|
| Modal title | dry | "{condition.display_name_vi} — Lưu ý trước khi bắt đầu" |
| Warning body | honest | msk_conditions.safety_warning_vi — seed data, không override |
| CTA | action | "Đã hiểu — tiếp tục" |

### Navigation
- **Enters from:** S04C Condition Confirm — auto-trigger sau khi session tạo xong nếu condition có safety_warning_vi
- **Exits to:** S07 First Insight via tap "Đã hiểu — tiếp tục"
- **Back behavior:** Backdrop tap → KHÔNG dismiss. User phải tap CTA để acknowledge. Modal là mandatory.

### Edge Cases & Constraints
- Screen này là **unconditional** — hiện bất kể user đã biết warning hay chưa, không skip được
- Nếu user có nhiều conditions với safety_warning_vi → hiện từng modal một, theo thứ tự conditions list
- User không thể bỏ qua — không có ghost button, không có swipe-to-dismiss
- Safety warning text là seed data trong msk_conditions.safety_warning_vi — không được override bằng AI-generated content
- Trigger conditions: achilles (viêm gân Achilles), plantar_fasciitis (viêm cân gan chân), rotator_cuff (rotator cuff)
