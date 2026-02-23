import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { RecoveryProtocol, MicroAction } from '@/types';

// ---------------------------------------------------------------------------
// State slice
// ---------------------------------------------------------------------------

interface ProtocolState {
  activeProtocol: RecoveryProtocol | null;
  protocolActions: MicroAction[];
}

// ---------------------------------------------------------------------------
// Action slice
// ---------------------------------------------------------------------------

interface ProtocolActions {
  setProtocol: (protocol: RecoveryProtocol, actions: MicroAction[]) => void;
  clearProtocol: () => void;
  advanceDay: () => Promise<void>;
  skipDay: () => Promise<void>;
  completeProtocol: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Store — no persist (fetched from server on each session)
// ---------------------------------------------------------------------------

export const useProtocolStore = create<ProtocolState & ProtocolActions>()(
  (set, get) => ({
    // --- state ---
    activeProtocol: null,
    protocolActions: [],

    // --- actions ---
    setProtocol: (protocol, actions) =>
      set({ activeProtocol: protocol, protocolActions: actions }),

    clearProtocol: () =>
      set({ activeProtocol: null, protocolActions: [] }),

    advanceDay: async () => {
      const { activeProtocol } = get();
      if (!activeProtocol) return;

      const nextDay = activeProtocol.current_day + 1;
      const isComplete = nextDay > activeProtocol.total_days;

      const updates = isComplete
        ? { current_day: nextDay, status: 'completed' as const, completed_at: new Date().toISOString() }
        : { current_day: nextDay };

      const { error } = await supabase
        .from('recovery_protocols')
        .update(updates)
        .eq('id', activeProtocol.id);

      if (error) throw error;

      if (isComplete) {
        set({ activeProtocol: null, protocolActions: [] });
      } else {
        set({
          activeProtocol: { ...activeProtocol, current_day: nextDay },
        });
      }
    },

    skipDay: async () => {
      const { activeProtocol } = get();
      if (!activeProtocol) return;

      const nextDay = activeProtocol.current_day + 1;
      const isComplete = nextDay > activeProtocol.total_days;

      const updates = isComplete
        ? { current_day: nextDay, status: 'skipped' as const, completed_at: new Date().toISOString() }
        : { current_day: nextDay };

      const { error } = await supabase
        .from('recovery_protocols')
        .update(updates)
        .eq('id', activeProtocol.id);

      if (error) throw error;

      if (isComplete) {
        set({ activeProtocol: null, protocolActions: [] });
      } else {
        set({
          activeProtocol: { ...activeProtocol, current_day: nextDay },
        });
      }
    },

    completeProtocol: async () => {
      const { activeProtocol } = get();
      if (!activeProtocol) return;

      const { error } = await supabase
        .from('recovery_protocols')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', activeProtocol.id);

      if (error) throw error;

      set({ activeProtocol: null, protocolActions: [] });
    },
  }),
);
