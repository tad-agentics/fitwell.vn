import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

// ---------------------------------------------------------------------------
// State slice
// ---------------------------------------------------------------------------

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
}

// ---------------------------------------------------------------------------
// Action slice
// ---------------------------------------------------------------------------

interface AuthActions {
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  signOut: () => Promise<void>;
  initialize: () => () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // --- state ---
      session: null,
      profile: null,
      isLoading: true,

      // --- actions ---
      setSession: (session) => set({ session }),

      setProfile: (profile) => set({ profile }),

      signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, profile: null });
      },

      initialize: () => {
        // Fetch the current session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
          set({ session, isLoading: false });

          if (session?.user) {
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
              .then(({ data }) => {
                if (data) set({ profile: data as Profile });
              });
          }
        });

        // Subscribe to auth state changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          set({ session, isLoading: false });

          if (session?.user) {
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
              .then(({ data }) => {
                if (data) set({ profile: data as Profile });
              });
          } else {
            set({ profile: null });
          }
        });

        // Return unsubscribe function for cleanup
        return () => {
          subscription.unsubscribe();
        };
      },
    }),
    {
      name: 'fitwell-auth',
      // Only persist profile; session is managed by Supabase's own persistence
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
);
