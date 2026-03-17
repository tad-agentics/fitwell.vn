/**
 * InAppBanner — client:load, every page. GET /notifications/pending, dismiss.
 * P3 Daily Loop. R-H7: use getAuthHeader() and SSR-safe fetch.
 */

import { useState, useEffect } from 'react';
import { getApiBase, getAuthHeader } from '@/lib/auth';

export default function InAppBanner() {
  const [item, setItem] = useState<{ id: string; body: string } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const auth = getAuthHeader();
    if (!auth) return;
    fetch(`${getApiBase()}/api/v1/notifications/pending`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d?.data?.length > 0) setItem(d.data[0]);
      })
      .catch(() => {});
  }, []);

  const dismiss = async () => {
    if (!item || typeof window === 'undefined') return;
    const auth = getAuthHeader();
    if (!auth) return;
    await fetch(`${getApiBase()}/api/v1/notifications/${item.id}/dismiss`, { method: 'POST', headers: { Authorization: auth } });
    setItem(null);
  };

  if (!item) return null;
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 rounded-xl bg-bg2 border border-border p-4 text-t0 text-sm flex justify-between items-center">
      <span>{item.body}</span>
      <button type="button" onClick={dismiss} className="text-t2 text-xs" aria-label="Đóng">Đóng</button>
    </div>
  );
}
