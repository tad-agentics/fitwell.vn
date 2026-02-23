import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all locale files statically for now (can be lazy-loaded per route later)
import viCommon from '@/locales/vi/common.json';
import enCommon from '@/locales/en/common.json';
import viAuth from '@/locales/vi/auth.json';
import enAuth from '@/locales/en/auth.json';
import viOnboarding from '@/locales/vi/onboarding.json';
import enOnboarding from '@/locales/en/onboarding.json';
import viCheckin from '@/locales/vi/checkin.json';
import enCheckin from '@/locales/en/checkin.json';
import viScenario from '@/locales/vi/scenario.json';
import enScenario from '@/locales/en/scenario.json';
import viAction from '@/locales/vi/action.json';
import enAction from '@/locales/en/action.json';
import viBrief from '@/locales/vi/brief.json';
import enBrief from '@/locales/en/brief.json';
import viProfile from '@/locales/vi/profile.json';
import enProfile from '@/locales/en/profile.json';
import viPayment from '@/locales/vi/payment.json';
import enPayment from '@/locales/en/payment.json';
import viHousehold from '@/locales/vi/household.json';
import enHousehold from '@/locales/en/household.json';
import viHome from '@/locales/vi/home.json';
import enHome from '@/locales/en/home.json';
import viNav from '@/locales/vi/nav.json';
import enNav from '@/locales/en/nav.json';

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      common: viCommon,
      auth: viAuth,
      onboarding: viOnboarding,
      checkin: viCheckin,
      scenario: viScenario,
      action: viAction,
      brief: viBrief,
      profile: viProfile,
      payment: viPayment,
      household: viHousehold,
      home: viHome,
      nav: viNav,
    },
    en: {
      common: enCommon,
      auth: enAuth,
      onboarding: enOnboarding,
      checkin: enCheckin,
      scenario: enScenario,
      action: enAction,
      brief: enBrief,
      profile: enProfile,
      payment: enPayment,
      household: enHousehold,
      home: enHome,
      nav: enNav,
    },
  },
  lng: 'vi',
  fallbackLng: 'vi',
  defaultNS: 'common',
  ns: [
    'common',
    'auth',
    'onboarding',
    'checkin',
    'scenario',
    'action',
    'brief',
    'profile',
    'payment',
    'household',
    'home',
    'nav',
  ],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
