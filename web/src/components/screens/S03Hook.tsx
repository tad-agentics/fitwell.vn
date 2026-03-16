/**
 * S03 Hook — free-text path only. Copy: honest + action. CTA "Kể cho FitWell nghe →" → S03b.
 * Back → S02. Spec: screen-spec-S03-hook.md
 */

import { PrimaryButton } from '@/design-system';

export default function S03Hook() {
  const handleNext = () => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const q = params.get('q');
    window.location.href = q ? `/onboarding?q=${encodeURIComponent(q)}` : '/onboarding';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <p className="font-display text-sm font-bold text-t0" style={{ fontSize: 14 }}>
        Đang ở đây vì đau — không phải vì muốn healthy lifestyle.
      </p>
      <p className="text-t1 text-sm">
        FitWell không bán lời khuyên chung. Hỏi 3 câu, đưa bài cụ thể cho đúng pattern của bạn — làm được ngay hôm nay.
      </p>
      <PrimaryButton label="Kể cho FitWell nghe →" onClick={handleNext} />
    </div>
  );
}
