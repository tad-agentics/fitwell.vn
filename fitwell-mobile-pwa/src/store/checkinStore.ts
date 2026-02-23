import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { CheckinTrigger } from '@/types';

// ---------------------------------------------------------------------------
// State slice
// ---------------------------------------------------------------------------

interface CheckinState {
  currentTrigger: CheckinTrigger | null;
  currentStep: number;
  answers: Record<string, unknown>;
  isSubmitting: boolean;
}

// ---------------------------------------------------------------------------
// Action slice
// ---------------------------------------------------------------------------

interface CheckinActions {
  startCheckin: (trigger: CheckinTrigger) => void;
  setAnswer: (key: string, value: unknown) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  submitCheckin: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Initial state (extracted for clean resets)
// ---------------------------------------------------------------------------

const initialState: CheckinState = {
  currentTrigger: null,
  currentStep: 0,
  answers: {},
  isSubmitting: false,
};

// ---------------------------------------------------------------------------
// Store — no persist (transient flow state)
// ---------------------------------------------------------------------------

export const useCheckinStore = create<CheckinState & CheckinActions>()(
  (set, get) => ({
    ...initialState,

    startCheckin: (trigger) =>
      set({ ...initialState, currentTrigger: trigger }),

    setAnswer: (key, value) =>
      set((state) => ({
        answers: { ...state.answers, [key]: value },
      })),

    nextStep: () =>
      set((state) => ({ currentStep: state.currentStep + 1 })),

    prevStep: () =>
      set((state) => ({
        currentStep: Math.max(0, state.currentStep - 1),
      })),

    reset: () => set(initialState),

    submitCheckin: async () => {
      const { currentTrigger, answers } = get();
      if (!currentTrigger) return;

      set({ isSubmitting: true });

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) throw new Error('Not authenticated');

        const now = new Date();

        const { error } = await supabase.from('checkins').insert({
          user_id: session.user.id,
          trigger: currentTrigger,
          sleep_quality: (answers.sleep_quality as string) ?? null,
          body_feeling: (answers.body_feeling as string) ?? null,
          back_pain_score: (answers.back_pain_score as number) ?? null,
          event_type: (answers.event_type as string) ?? null,
          event_intensity: (answers.event_intensity as string) ?? null,
          afternoon_state: (answers.afternoon_state as string) ?? null,
        });

        if (error) throw error;

        // Reset on successful submission
        set(initialState);
      } catch (error) {
        // Re-throw so callers can handle UI feedback
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },
  }),
);
