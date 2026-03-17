/**
 * S03b Path Chooser — design-system RadioRow × 2, PrimaryButton.
 * Option A → S04A (/onboarding/choose). Option B → S04 Q1 (/onboarding/describe).
 */

import { useState } from 'react';
import { RadioRow, PrimaryButton, colors } from '@/design-system';

type Path = 'know' | 'unsure' | null;

export default function S03bPathChooser() {
  const [path, setPath] = useState<Path>(null);
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const fromChip = params.get('condition');
  const fromQuery = params.get('q');
  const preselected: Path = fromChip ? 'know' : (fromQuery ? 'unsure' : null);
  const effective = path ?? preselected;

  const handleNext = () => {
    if (effective === 'know') window.location.href = fromQuery ? `/onboarding/condition?q=${encodeURIComponent(fromQuery)}` : '/onboarding/condition';
    else if (effective === 'unsure') window.location.href = fromQuery ? `/onboarding/describe?q=${encodeURIComponent(fromQuery)}` : '/onboarding/location';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <h1 style={{ fontFamily: 'var(--font-display, Figtree)', fontSize: 14, fontWeight: 700, color: colors.t0 }}>
        Bạn đã biết tên bệnh của mình chưa?
      </h1>
      <p style={{ fontSize: 10, color: colors.t2 }}>Từng đi khám, hoặc đã tự xác định được</p>
      <RadioRow
        label="Biết rồi — tôi đã từng đi khám hoặc tự xác định được"
        subLabel="Ví dụ: thoát vị đĩa đệm, viêm cân gan chân, đau cổ vai gáy..."
        selected={effective === 'know'}
        onClick={() => setPath('know')}
      />
      <RadioRow
        label="Chưa chắc — chỉ biết mình đang khó chịu"
        subLabel="Chỉ biết đang đau ở đâu, không chắc là bệnh gì"
        selected={effective === 'unsure'}
        onClick={() => setPath('unsure')}
      />
      <PrimaryButton label="Tiếp theo →" onClick={handleNext} disabled={effective == null} />
    </div>
  );
}
