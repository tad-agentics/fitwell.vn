/**
 * Describe flow — ensure anonymous, POST symptom-map with ?q=, show suggestions, on select call intake → exercise.
 */

import { useState, useEffect } from 'react';
import { PrimaryButton } from '@/design-system';
import { getApiBase, getAnonymousId, setAnonymousId } from '@/lib/auth';

const API_BASE = getApiBase();

async function ensureAnonymous(): Promise<string> {
  let anonId = getAnonymousId();
  if (anonId) return anonId;
  const res = await fetch(`${API_BASE}/api/v1/auth/anonymous/init`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  if (!data.success || !data.data?.anonymous_id) throw new Error('Không tạo được phiên');
  anonId = data.data.anonymous_id;
  setAnonymousId(anonId);
  return anonId;
}

interface Suggestion {
  msk_condition_id: string;
  slug: string;
  name_vi: string;
  body_region: string;
  confidence: number;
}

export default function OnboardingDescribe() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const q = params.get('q') || '';
    setQuery(q);
    if (!q.trim()) {
      setLoading(false);
      return;
    }
    ensureAnonymous()
      .then((anonId) =>
        fetch(`${API_BASE}/api/v1/onboarding/symptom-map`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Anonymous ${anonId}` },
          body: JSON.stringify({ symptom_text: q.slice(0, 500) }),
        })
      )
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.suggestions) setSuggestions(d.data.suggestions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = async (slug: string) => {
    const anonId = getAnonymousId();
    if (!anonId) return;
    const res = await fetch(`${API_BASE}/api/v1/onboarding/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Anonymous ${anonId}` },
      body: JSON.stringify({ msk_condition_slug: slug }),
    });
    const data = await res.json();
    if (data.success && data.data?.condition_id) {
      window.location.href = `/exercise?condition_id=${data.data.condition_id}`;
    }
  };

  if (loading) return <p className="mt-4 text-t2 text-sm">Đang tải...</p>;
  if (suggestions.length === 0 && query) return <p className="mt-4 text-t2 text-sm">Mô tả tiếp tục — FitWell sẽ hiểu. Chọn vùng cơ thể bên dưới.</p>;
  return (
    <ul className="mt-4 space-y-2">
      {suggestions.map((s) => (
        <li key={s.slug}>
          <button type="button" onClick={() => handleSelect(s.slug)} className="w-full text-left rounded-xl bg-bg1 border border-border p-4 text-t0 text-sm">
            {s.name_vi}
          </button>
        </li>
      ))}
    </ul>
  );
}
