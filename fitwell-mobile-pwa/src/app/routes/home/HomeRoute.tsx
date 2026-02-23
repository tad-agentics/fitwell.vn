import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { useActiveRecovery, useLatestBrief } from '@/hooks/useSupabaseQuery';
import { HomeCleanDayScreen } from '@/app/components/HomeCleanDayScreen';
import { HomeMiddayScreen } from '@/app/components/HomeMiddayScreen';
import { HomeActiveRecoveryScreen } from '@/app/components/HomeActiveRecoveryScreen';
import { HomePreDinnerCountdownScreen } from '@/app/components/HomePreDinnerCountdownScreen';
import { HomePreSleepScreen } from '@/app/components/HomePreSleepScreen';
import { HomeMondayBriefInterceptScreen } from '@/app/components/HomeMondayBriefInterceptScreen';
import type { HomeState } from '@/types';

function deriveHomeState(params: {
  activeBrief: any;
  activeRecovery: any;
  scheduledEvent: any;
}): HomeState {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const hour = now.getHours();

  // 1. Sunday Brief Takeover
  if (day === 0 && params.activeBrief && !params.activeBrief.is_read) return 'sunday_brief';
  // 2. Monday Brief Intercept (week 4+)
  if (day === 1 && params.activeBrief && !params.activeBrief.is_read) return 'monday_intercept';
  // 3. Active Recovery
  if (params.activeRecovery) return 'active_recovery';
  // 4. Pre-Situation Countdown (placeholder - needs scheduled event)
  if (params.scheduledEvent) return 'pre_situation';
  // 5. Pre-Sleep Wind-Down (>= 21:00)
  if (hour >= 21) return 'pre_sleep';
  // 6. Midday Desk (13:00-16:00 weekday)
  if (hour >= 13 && hour < 16 && day >= 1 && day <= 5) return 'midday_desk';
  // 7. Clean Day (default)
  return 'clean_day';
}

export default function HomeRoute() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const userId = session?.user?.id;
  const { data: activeRecovery } = useActiveRecovery(userId);
  const { data: latestBrief } = useLatestBrief(userId);

  const homeState = deriveHomeState({
    activeBrief: latestBrief,
    activeRecovery: activeRecovery,
    scheduledEvent: null,
  });

  const handleNavigate = (screen: string) => {
    const routeMap: Record<string, string> = {
      scenarioSearch: '/scenarios',
      checkIn: '/checkin',
      checkInMorning: '/checkin/morning',
      checkInMidday: '/checkin',
      checkInPostEvent: '/checkin/post-event',
      actionLibrary: '/actions',
      weeklyBrief: '/brief',
      profile: '/profile',
      pricing: '/payment/pricing',
      recovery: '/recovery',
      recoveryActive: '/recovery',
      preSleep: '/checkin/pre-sleep',
      contextSelector: '/checkin/context',
      microAction: '/actions/flow',
    };
    navigate(routeMap[screen] || '/home');
  };

  switch (homeState) {
    case 'monday_intercept':
      return (
        <HomeMondayBriefInterceptScreen
          onNavigate={handleNavigate}
          onViewBrief={() => navigate('/brief')}
          onDismiss={() => {/* stays on home, state will re-derive */}}
        />
      );
    case 'active_recovery':
      return (
        <HomeActiveRecoveryScreen
          onNavigate={handleNavigate}
          eventType={(activeRecovery?.event_type as any) || 'long_desk'}
        />
      );
    case 'pre_sleep':
      return <HomePreSleepScreen onNavigate={handleNavigate} />;
    case 'midday_desk':
      return <HomeMiddayScreen onNavigate={handleNavigate} />;
    case 'pre_situation':
      return (
        <HomePreDinnerCountdownScreen
          onNavigate={handleNavigate}
          onViewScenario={() => navigate('/scenarios')}
        />
      );
    case 'sunday_brief':
      navigate('/brief');
      return null;
    case 'clean_day':
    default:
      return <HomeCleanDayScreen onNavigate={handleNavigate} />;
  }
}
