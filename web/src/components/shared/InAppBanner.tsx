/**
 * InAppBanner — client:load, every page. GET /notifications/pending, dismiss.
 * P3 Daily Loop.
 */

import { useState, useEffect } from 'react';

const API_URL = (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { PUBLIC_API_URL?: string } }).env?.PUBLIC_API_URL) || 'http://localhost:3001';

export default function InAppBanner() {
  const [item, setItem] = useState<{ id: string; body: string } | null>(null);

  useEffect(() => {
    const anonId = typeof localStorage !== 'undefined' ? localStorage.getItem('fw_anonymous_id') : null;
    const token = (typeof window !== 'undefined' && (window as unknown as { __fw_access_token?: string }).__fw_access_token) || null;
    const auth = token ? `Bearer ${token}` : anonId ? `Anonymous ${anonId}` : null;
    if (!auth) return;
    fetch(`${API_URL}/api/v1/notifications/pending`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.length > 0) setItem(d.data[0]);
      })
      .catch(() => {});
  }, []);

  const dismiss = async () => {
    if (!item) return;
    const anonId = typeof localStorage !== 'undefined' ? localStorage.getItem('fw_anonymous_id') : null;
    const token = (typeof window !== 'undefined' && (window as unknown as { __fw_access_token?: string }).__fw_access_token) || null;
    const auth = token ? `Bearer ${token}` : anonId ? `Anonymous ${anonId}` : null;
    if (!auth) return;
    await fetch(`${API_URL}/api/v1/notifications/${item.id}/dismiss`, { method: 'POST', headers: { Authorization: auth } });
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
