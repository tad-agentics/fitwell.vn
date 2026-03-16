/**
 * S06 Onboard Q3 — Đang xử lý. Progress 3/4. CheckRow × 5 multi-select. CTA "Xem bài của bạn →" → S04C.
 */

import { useState, useEffect } from 'react';
import { StepProgressBar, CheckRow, PrimaryButton } from '@/design-system';

const TREATMENTS = [
  { id: 'endure', label: 'Chịu đựng — chưa làm gì cụ thể' },
  { id: 'massage', label: 'Massage / dầu nóng / chườm' },
  { id: 'medication', label: 'Uống thuốc giảm đau' },
  { id: 'gym', label: 'Tập gym hoặc tự tập' },
  { id: 'physio', label: 'Vật lý trị liệu / bác sĩ' },
] as const;

const STORAGE_KEY = 'fw_onboard_treatments';

export default function S06CurrentTreatment() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setSelected(new Set(arr));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
  }, [selected]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNext = () => {
    window.location.href = '/onboarding/confirm';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <StepProgressBar total={4} current={3} />
      <h1 className="font-display text-lg font-semibold text-t0">Đang làm gì để xử lý?</h1>
      <p className="text-t2 text-sm">Chọn tất cả cách bạn đang dùng — không có đáp án đúng sai</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TREATMENTS.map((t) => (
          <CheckRow
            key={t.id}
            label={t.label}
            checked={selected.has(t.id)}
            onChange={() => toggle(t.id)}
          />
        ))}
      </div>
      <PrimaryButton label="Xem bài của bạn →" onClick={handleNext} />
    </div>
  );
}
