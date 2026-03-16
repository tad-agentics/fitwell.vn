# FitWell — Amendments Log
**Bắt đầu:** March 2026
**Mục đích:** Log mọi deviation từ spec trong quá trình build. KHÔNG fix mid-build. Reconcile tại tier boundary (Phase 7d).

---

## Quy trình

1. **Phát hiện deviation** → Log ngay vào file này, không sửa spec
2. **Classify severity:**
   - `BLOCKING` — ảnh hưởng build screen tiếp theo, resolve cuối ngày
   - `NON-BLOCKING` — log và park, reconcile tại Phase 7d
3. **Phase 7d** — Trước khi bắt đầu Tier 2: reconcile tất cả amendments, update tất cả artifacts liên quan

---

## Format

```
### AMD-[số] — [mô tả ngắn]
**Date:** YYYY-MM-DD
**Severity:** BLOCKING | NON-BLOCKING
**Screen(s):** [screen IDs]
**Spec section:** [section reference]
**Deviation:** [mô tả deviation]
**Impact:** [ảnh hưởng downstream]
**Status:** OPEN | RESOLVED
**Resolution:** [nếu resolved — mô tả fix + date]
```

---

## Open Amendments

*(Chưa có — log tại đây khi build bắt đầu)*

---

## Resolved Amendments

*(Chưa có)*

---

## Pre-Build Open Items (từ Tech Spec)

Những items này đã được ghi nhận trong TechSpec v1.5 trước khi build bắt đầu. Không phải amendments — là known gaps cần resolve tại phase gate tương ứng.

| # | Item | Resolve before |
|---|---|---|
| OI-1 | Multi-condition assessment UX: 2 assessment forks cùng lúc | P1 gate |
| OI-2 | PayOS expired link (>15min): frontend retry flow | P5 gate |
| OI-3 | Web push deny = 1 attempt, no retry — document rõ in S30 component | P3 gate |
| OI-4 | exercises.clinical_tags: audit tất cả seed entries — ≥1 movement type tag | P6 gate |
