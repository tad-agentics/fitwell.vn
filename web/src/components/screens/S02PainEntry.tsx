/**
 * S02 Pain Entry — design-system TextInput, PillButton, PrimaryButton.
 * Suggestion chips from GET /api/v1/msk-conditions (public). CTA → S03 (?q=) or S03b (chip).
 */

import { useState, useEffect } from 'react';
import { TextInput, PrimaryButton, PillButton } from '@/design-system';
import { getApiBase } from '@/lib/auth';

interface MskItem {
  slug: string;
  name_vi: string;
  body_region: string;
}

export default function S02PainEntry() {
  const [query, setQuery] = useState('');
  const [chips, setChips] = useState<MskItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${getApiBase()}/api/v1/msk-conditions?limit=5`)
      .then((r) => r.json())
      .then((d) => d.success && d.data && setChips(d.data))
      .catch(() => {});
  }, []);

  const canSubmit = query.trim().length >= 2 || selectedSlug;
  const selectedName = selectedSlug ? chips.find((c) => c.slug === selectedSlug)?.name_vi : null;

  const handleSubmit = () => {
    if (selectedSlug) {
      window.location.href = `/onboarding/choose?condition=${selectedSlug}`;
      return;
    }
    const q = query.trim().slice(0, 100);
    if (q) window.location.href = `/onboarding/hook?q=${encodeURIComponent(q)}`;
    else window.location.href = '/onboarding';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400 }}>
      <h1 className="font-display text-lg font-semibold text-t0">Đang khó chịu ở đâu?</h1>
      <TextInput
        value={selectedName ?? query}
        onChange={(v) => {
          setQuery(v);
          setSelectedSlug(null);
        }}
        placeholder="Ví dụ: đau lưng buổi sáng, tê tay ban đêm..."
        maxLength={100}
      />
      {chips.length > 0 && !query && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chips.map((c) => (
            <PillButton
              key={c.slug}
              label={c.name_vi}
              selected={selectedSlug === c.slug}
              onClick={() => {
                setSelectedSlug(selectedSlug === c.slug ? null : c.slug);
                setQuery('');
              }}
            />
          ))}
        </div>
      )}
      {query.length >= 2 && !selectedSlug && (
        <p className="text-t2 text-sm">Mô tả tiếp tục — FitWell sẽ hiểu</p>
      )}
      <PrimaryButton label="Tiếp tục" onClick={handleSubmit} disabled={!canSubmit} />
    </div>
  );
}
