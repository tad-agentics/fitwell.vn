/**
 * S04 Onboard Q1 — Vị trí (Path B). Progress 1/4. Multi-select body region chips. Spec: screen-spec-S04-S05-S06.
 */

import { useState, useEffect } from 'react';
import { StepProgressBar, PillButton, PrimaryButton } from '@/design-system';

const REGIONS = [
  'Lưng dưới',
  'Cổ vai gáy',
  'Đầu gối',
  'Bàn chân',
  'Vai',
  'Khuỷu tay',
  'Cổ tay',
  'Hông',
];

const STORAGE_KEY = 'fw_onboard_regions';

export default function S04Location() {
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
    if (selected.size > 0) sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
  }, [selected]);

  const toggle = (r: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const handleNext = () => {
    window.location.href = '/onboarding/trigger';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <StepProgressBar total={4} current={1} />
      <h1 className="font-display text-lg font-semibold text-t0">Đang khó chịu ở vùng nào?</h1>
      <p className="text-t2 text-sm">Chọn tất cả vùng đang có vấn đề</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {REGIONS.map((r) => (
          <PillButton
            key={r}
            label={r}
            selected={selected.has(r)}
            onClick={() => toggle(r)}
          />
        ))}
      </div>
      <PrimaryButton label="Tiếp theo →" onClick={handleNext} disabled={selected.size === 0} />
    </div>
  );
}
