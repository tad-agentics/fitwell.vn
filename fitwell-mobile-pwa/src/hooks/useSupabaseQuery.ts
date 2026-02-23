import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

// ============================================
// Query key factory
// ============================================

export const queryKeys = {
  profile: (userId: string) => ['profile', userId] as const,
  biomarkers: (userId: string) => ['biomarkers', userId] as const,
  scenarios: () => ['scenarios'] as const,
  scenario: (id: string) => ['scenarios', id] as const,
  scenarioSessions: (userId: string) => ['scenario_sessions', userId] as const,
  checkins: (userId: string) => ['checkins', userId] as const,
  microActions: () => ['micro_actions'] as const,
  microAction: (id: string) => ['micro_actions', id] as const,
  actionSessions: (userId: string) => ['action_sessions', userId] as const,
  recoveryProtocol: (userId: string) => ['recovery_protocols', userId, 'active'] as const,
  subscription: (userId: string) => ['subscriptions', userId] as const,
  weeklyBrief: (userId: string) => ['weekly_briefs', userId, 'latest'] as const,
  weeklyBriefs: (userId: string) => ['weekly_briefs', userId] as const,
  household: (userId: string) => ['households', userId] as const,
  governor: (userId: string) => ['notification_governor', userId] as const,
};

// ============================================
// Profile hooks
// ============================================

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profile(userId ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Tables['profiles']['Update'];
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile(data.id), data);
    },
  });
}

// ============================================
// Biomarker hooks
// ============================================

export function useBiomarkers(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.biomarkers(userId ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('biomarkers')
        .select('*')
        .eq('user_id', userId!)
        .order('recorded_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInsertBiomarker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (biomarker: Tables['biomarkers']['Insert']) => {
      const { data, error } = await supabase
        .from('biomarkers')
        .insert(biomarker)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.biomarkers(data.user_id) });
    },
  });
}

// ============================================
// Scenario hooks
// ============================================

export function useScenarios() {
  return useQuery({
    queryKey: queryKeys.scenarios(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('risk_level', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });
}

export function useScenario(id: string | null) {
  return useQuery({
    queryKey: queryKeys.scenario(id ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: Infinity,
  });
}

export function useLogScenarioSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (session: Tables['scenario_sessions']['Insert']) => {
      const { data, error } = await supabase
        .from('scenario_sessions')
        .insert(session)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scenarioSessions(data.user_id) });
    },
  });
}

// ============================================
// Check-in hooks
// ============================================

export function useCheckins(userId: string | undefined, limit = 30) {
  return useQuery({
    queryKey: [...queryKeys.checkins(userId ?? ''), limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 0,
  });
}

export function useInsertCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (checkin: Tables['checkins']['Insert']) => {
      const { data, error } = await supabase
        .from('checkins')
        .insert(checkin)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins(data.user_id) });
    },
  });
}

// ============================================
// Micro-action hooks
// ============================================

export function useMicroActions() {
  return useQuery({
    queryKey: queryKeys.microActions(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('micro_actions')
        .select('*')
        .order('category');
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });
}

export function useLogActionSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (session: Tables['action_sessions']['Insert']) => {
      const { data, error } = await supabase
        .from('action_sessions')
        .insert(session)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actionSessions(data.user_id) });
    },
  });
}

// ============================================
// Recovery protocol hooks
// ============================================

export function useActiveRecovery(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.recoveryProtocol(userId ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recovery_protocols')
        .select('*')
        .eq('user_id', userId!)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 0,
  });
}

export function useCreateRecovery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (protocol: Tables['recovery_protocols']['Insert']) => {
      const { data, error } = await supabase
        .from('recovery_protocols')
        .insert(protocol)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recoveryProtocol(data.user_id) });
    },
  });
}

export function useUpdateRecovery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      userId,
      updates,
    }: {
      id: string;
      userId: string;
      updates: Tables['recovery_protocols']['Update'];
    }) => {
      const { data, error } = await supabase
        .from('recovery_protocols')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recoveryProtocol(variables.userId) });
    },
  });
}

// ============================================
// Subscription hooks
// ============================================

export function useSubscription(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subscription(userId ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId!)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// Weekly brief hooks
// ============================================

export function useLatestBrief(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.weeklyBrief(userId ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_briefs')
        .select('*')
        .eq('user_id', userId!)
        .order('week_start', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 0,
  });
}

export function useMarkBriefRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase
        .from('weekly_briefs')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.weeklyBrief(userId) });
    },
  });
}

// ============================================
// Household hooks
// ============================================

export function useHousehold(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.household(userId ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .or(`owner_id.eq.${userId},partner_id.eq.${userId}`)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// Analytics hooks
// ============================================

export function useTrackEvent() {
  return useMutation({
    mutationFn: async ({
      userId,
      eventName,
      metadata,
    }: {
      userId: string;
      eventName: string;
      metadata?: Record<string, unknown>;
    }) => {
      const { error } = await supabase
        .from('analytics_events')
        .insert({ user_id: userId, event_name: eventName, metadata });
      if (error) throw error;
    },
  });
}
