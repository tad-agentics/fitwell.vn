/**
 * Auth helpers — anonymous id, API base URL.
 * JWT in-memory only (store); never persist access token.
 */

const API_BASE = typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { PUBLIC_API_URL?: string } }).env?.PUBLIC_API_URL || 'http://localhost:3001';

export function getApiBase(): string {
  return API_BASE;
}

export function getAnonymousId(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('fw_anonymous_id');
}

export function setAnonymousId(id: string | null): void {
  if (typeof localStorage === 'undefined') return;
  if (id) localStorage.setItem('fw_anonymous_id', id);
  else localStorage.removeItem('fw_anonymous_id');
}

/** Authorization header value for API: Anonymous <id> or Bearer <token> */
export function getAuthHeader(): string | null {
  if (typeof window === 'undefined') return null;
  const token = (window as unknown as { __fw_access_token?: string }).__fw_access_token;
  if (token) return `Bearer ${token}`;
  const anon = getAnonymousId();
  if (anon) return `Anonymous ${anon}`;
  return null;
}
