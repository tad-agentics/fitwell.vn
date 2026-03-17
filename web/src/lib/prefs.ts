/**
 * Client-side preferences — SSR-safe localStorage helpers.
 * R-M1: avoid hydration mismatch when reading flags like fw_reanchor_shown.
 */

const REANCHOR_KEY = 'fw_reanchor_shown';

export function getReanchorShown(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(REANCHOR_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setReanchorShown(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (value) localStorage.setItem(REANCHOR_KEY, 'true');
    else localStorage.removeItem(REANCHOR_KEY);
  } catch {
    // ignore
  }
}
