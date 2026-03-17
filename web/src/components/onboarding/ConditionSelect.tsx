/**
 * Condition select — call symptom-map with real ?q= param, then intake with msk_condition_slug.
 * If ?condition=slug in URL: init anonymous if needed, call intake with slug, route via assessment/insight.
 */

import { useState, useEffect } from 'react';
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

function routeAfterIntake(data: { condition_id?: string; assessment_required?: boolean; safety_warning?: { content_vi: string } | null }) {
  if (!data.condition_id) return;
  if (data.assessment_required) {
    window.location.href = '/onboarding/assessment';
    return;
  }
  if (data.safety_warning?.content_vi) {
    try { sessionStorage.setItem('fw_safety_warning', JSON.stringify(data.safety_warning)); } catch { /* ignore */ }
  }
  window.location.href = '/onboarding/insight';
}

export default function ConditionSelect() {
  const [list, setList] = useState<Array<{ slug: string; name_vi: string; body_region: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const preselect = params.get('condition');
    const q = params.get('q') ?? '';
    if (preselect) {
      ensureAnonymous()
        .then((anonId) =>
          fetch(`${API_BASE}/api/v1/onboarding/intake`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Anonymous ${anonId}` },
            body: JSON.stringify({ msk_condition_slug: preselect }),
          })
        )
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.data?.condition_id) routeAfterIntake(d.data);
          else setLoading(false);
        })
        .catch(() => setLoading(false));
      return;
    }
    const symptomText = q.trim() || 'đau lưng';
    ensureAnonymous()
      .then((anonId) =>
        fetch(`${API_BASE}/api/v1/onboarding/symptom-map`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Anonymous ${anonId}` },
          body: JSON.stringify({ symptom_text: symptomText }),
        })
      )
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.suggestions) setList(d.data.suggestions);
        setLoading(false);
      })
      .catch(() => {
        setError('Không tải được danh sách.');
        setLoading(false);
      });
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
      routeAfterIntake(data.data);
    }
  };

  if (loading) return <p className="text-t2 text-sm mt-4">Đang tải...</p>;
  if (error) return <p className="text-risk text-sm mt-4">{error}</p>;
  return (
    <ul className="mt-4 space-y-2">
      {list.map((item) => (
        <li key={item.slug}>
          <button
            type="button"
            onClick={() => handleSelect(item.slug)}
            className="w-full text-left rounded-xl bg-bg1 border border-border p-4 text-t0 text-sm"
          >
            {item.name_vi}
          </button>
        </li>
      ))}
    </ul>
  );
}
