/**
 * Zustand store — accessToken in-memory only (never persist).
 * TechSpec: JWT in-memory, no localStorage for tokens.
 */

import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  anonymousId: string | null;
  setAccessToken: (token: string | null) => void;
  setAnonymousId: (id: string | null) => void;
}

export const useStore = create<AuthState>((set) => ({
  accessToken: null,
  anonymousId: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setAnonymousId: (anonymousId) => set({ anonymousId }),
}));
