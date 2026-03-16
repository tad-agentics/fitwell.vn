/**
 * S05 Onboard Q2 — Trigger. Progress 2/4. Single-select RadioRow × 5. Spec: screen-spec-S04-S05-S06.
 */

import { useState, useEffect } from 'react';
import { StepProgressBar, RadioRow, PrimaryButton } from '@/design-system';

type Trigger = 'morning' | 'after_sitting' | 'movement' | 'end_of_day' | 'constant' | null;

const OPTIONS: { value: Trigger; label: string }[] = [
  { value: 'morning', label: 'Buổi sáng — khi mới thức hoặc mới đứng dậy' },
  { value: 'after_sitting', label: 'Sau khi ngồi lâu — họp, làm việc' },
  { value: 'movement', label: 'Khi vận động — leo cầu thang, đi bộ' },
  { value: 'end_of_day', label: 'Cuối ngày — sau khi đứng hoặc làm việc nhiều' },
  { value: 'constant', label: 'Liên tục — lúc nào cũng thấy' },
];

const STORAGE_KEY = 'fw_onboard_trigger';

export default function S05Trigger() {
  const [selected, setSelected] = useState<Trigger>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw && OPTIONS.some((o) => o.value === raw)) setSelected(raw as Trigger);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (selected) sessionStorage.setItem(STORAGE_KEY, selected);
  }, [selected]);

  const handleNext = () => {
    window.location.href = '/onboarding/current-treatment';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <StepProgressBar total={4} current={2} />
      <h1 className="font-display text-lg font-semibold text-t0">Thường đau nhất lúc nào?</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPTIONS.map((o) => (
          <RadioRow
            key={o.value ?? ''}
            label={o.label}
            selected={selected === o.value}
            onClick={() => setSelected(o.value)}
          />
        ))}
      </div>
      <PrimaryButton label="Tiếp theo →" onClick={handleNext} disabled={selected == null} />
    </div>
  );
}
