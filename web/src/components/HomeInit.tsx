/**
 * Ensure anonymous session exists (localStorage fw_anonymous_id), then show CTA to onboarding.
 */

import { useState, useEffect } from 'react';

const API_URL = (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { PUBLIC_API_URL?: string } }).env?.PUBLIC_API_URL) || 'http://localhost:3001';

export default function HomeInit() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    let anonId = localStorage.getItem('fw_anonymous_id');
    if (!anonId) {
      fetch(`${API_URL}/api/v1/auth/anonymous/init`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.data?.anonymous_id) {
            localStorage.setItem('fw_anonymous_id', d.data.anonymous_id);
            setReady(true);
          }
        })
        .catch(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return <p className="mt-4 text-t2 text-sm">Đang chuẩn bị...</p>;
  return (
    <a href="/onboarding" className="mt-6 rounded-xl bg-teal text-bg0 px-6 py-3 text-sm font-medium">
      Bắt đầu
    </a>
  );
}
