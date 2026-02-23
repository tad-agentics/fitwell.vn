import type { NavigateFunction } from 'react-router';

const routeMap: Record<string, string> = {
  home: '/home',
  scenarioSearch: '/scenarios',
  checkIn: '/checkin',
  checkInMorning: '/checkin/morning',
  checkInPostEvent: '/checkin/post-event',
  actionLibrary: '/actions',
  weeklyBrief: '/brief',
  profile: '/profile',
  profileSettings: '/profile/settings',
  pricing: '/payment/pricing',
  recovery: '/recovery',
  recoveryActive: '/recovery',
  recoveryPaywall: '/recovery/paywall',
  householdHome: '/household',
  householdInvite: '/household/invite',
  preSleep: '/checkin/pre-sleep',
  contextSelector: '/checkin/context',
  microAction: '/actions/flow',
  mondayBriefIntercept: '/brief/intercept',
  a2hsPrompt: '/a2hs',
  a2hsInstruction: '/a2hs/instructions',
  authRegister: '/auth/register',
  authLogin: '/auth/login',
  dashboard: '/home',
  progress: '/profile',
  bloodTest: '/profile',
  paymentSuccess: '/payment/success',
  paymentCancel: '/payment/cancel',
};

export function createNavigateHandler(navigate: NavigateFunction) {
  return (screen: string) => {
    navigate(routeMap[screen] || '/home');
  };
}
