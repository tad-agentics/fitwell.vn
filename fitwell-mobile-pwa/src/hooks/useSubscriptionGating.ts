import { useSubscription, useProfile } from './useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

interface GatingResult {
  isAllowed: boolean;
  reason?: 'free_limit' | 'paid_only' | 'household_only';
  remainingUses?: number;
}

export function useSubscriptionGating() {
  const session = useAuthStore((s) => s.session);
  const userId = session?.user?.id;
  const { data: subscription } = useSubscription(userId);
  const { data: profile } = useProfile(userId);

  const isPaid = subscription?.status === 'active';
  const isHousehold = subscription?.plan === 'household_annual';

  function canUseMorningCheckin(): GatingResult {
    return { isAllowed: true };
  }

  function canUseScenario(): GatingResult {
    if (isPaid) return { isAllowed: true };
    const used = profile?.free_scenario_uses ?? 0;
    if (used < 1) return { isAllowed: true, remainingUses: 1 - used };
    return { isAllowed: false, reason: 'free_limit', remainingUses: 0 };
  }

  function canUsePostEventCheckin(): GatingResult {
    if (isPaid) return { isAllowed: true };
    const used = profile?.free_post_event_checkins_used ?? 0;
    if (used < 2) return { isAllowed: true, remainingUses: 2 - used };
    return { isAllowed: false, reason: 'free_limit', remainingUses: 0 };
  }

  function canUseRecoveryDay2Plus(): GatingResult {
    if (isPaid) return { isAllowed: true };
    return { isAllowed: false, reason: 'paid_only' };
  }

  function canUseMiddayCheckin(): GatingResult {
    if (isPaid) return { isAllowed: true };
    return { isAllowed: false, reason: 'paid_only' };
  }

  function canUsePreSleepCheckin(): GatingResult {
    if (isPaid) return { isAllowed: true };
    return { isAllowed: false, reason: 'paid_only' };
  }

  function canPlayAction(): GatingResult {
    if (isPaid) return { isAllowed: true };
    return { isAllowed: false, reason: 'paid_only' };
  }

  function canReadBrief(): GatingResult {
    if (isPaid) return { isAllowed: true };
    const reads = profile?.free_brief_reads ?? 0;
    if (reads < 1) return { isAllowed: true, remainingUses: 1 - reads };
    return { isAllowed: false, reason: 'free_limit', remainingUses: 0 };
  }

  function canUseHouseholdModule(): GatingResult {
    if (isHousehold) return { isAllowed: true };
    return { isAllowed: false, reason: 'household_only' };
  }

  return {
    isPaid,
    isHousehold,
    canUseMorningCheckin,
    canUseScenario,
    canUsePostEventCheckin,
    canUseRecoveryDay2Plus,
    canUseMiddayCheckin,
    canUsePreSleepCheckin,
    canPlayAction,
    canReadBrief,
    canUseHouseholdModule,
  };
}
