import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HomeState, Language } from '@/types';

// ---------------------------------------------------------------------------
// State slice
// ---------------------------------------------------------------------------

interface UIState {
  bottomNavVisible: boolean;
  currentHomeState: HomeState;
  language: Language;
}

// ---------------------------------------------------------------------------
// Action slice
// ---------------------------------------------------------------------------

interface UIActions {
  setBottomNavVisible: (visible: boolean) => void;
  setHomeState: (state: HomeState) => void;
  setLanguage: (language: Language) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      // --- state ---
      bottomNavVisible: true,
      currentHomeState: 'clean_day',
      language: 'vi',

      // --- actions ---
      setBottomNavVisible: (visible) => set({ bottomNavVisible: visible }),

      setHomeState: (state) => set({ currentHomeState: state }),

      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'fitwell-ui',
      // Only persist language preference; layout state is transient
      partialize: (state) => ({ language: state.language }),
    },
  ),
);
