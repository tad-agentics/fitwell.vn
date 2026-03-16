/**
 * API client — fetch to PUBLIC_API_URL with auth header.
 */

import { getApiBase, getAuthHeader } from './auth';

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = getApiBase();
  const auth = typeof window !== 'undefined' ? getAuthHeader() : null;
  const headers = new Headers(init.headers);
  if (auth) headers.set('Authorization', auth);
  if (!headers.has('Content-Type') && init.body && typeof init.body === 'string') headers.set('Content-Type', 'application/json');
  return fetch(`${base}${path}`, { ...init, headers });
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<{ success: boolean; data?: T; code?: string }> {
  const res = await apiFetch(path, init);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { success: false, code: json.code };
  return json as { success: true; data: T };
}
