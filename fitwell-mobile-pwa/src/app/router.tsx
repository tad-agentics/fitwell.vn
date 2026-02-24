import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from './layouts/AppLayout';
import { AuthGuard, OnboardingGuard, GuestOnly } from './layouts/AuthGuard';

// ============================================
// Lazy-loaded route components (code splitting)
// ============================================

// Auth
const AuthRegisterRoute = lazy(() => import('./routes/auth/RegisterRoute'));
const AuthLoginRoute = lazy(() => import('./routes/auth/LoginRoute'));
const AuthMagicLinkSentRoute = lazy(() => import('./routes/auth/MagicLinkSentRoute'));
const AuthLoginMagicLinkRoute = lazy(() => import('./routes/auth/LoginPasswordRoute'));

// Onboarding
const OnboardingRoute = lazy(() => import('./routes/onboarding/OnboardingRoute'));

// A2HS
const A2HSPromptRoute = lazy(() => import('./routes/a2hs/A2HSPromptRoute'));
const A2HSInstructionRoute = lazy(() => import('./routes/a2hs/A2HSInstructionRoute'));

// Home
const HomeRoute = lazy(() => import('./routes/home/HomeRoute'));

// Check-in
const CheckInRoute = lazy(() => import('./routes/checkin/CheckInRoute'));
const MorningCheckInRoute = lazy(() => import('./routes/checkin/MorningCheckInRoute'));
const PostEventCheckInRoute = lazy(() => import('./routes/checkin/PostEventCheckInRoute'));
const ContextSelectorRoute = lazy(() => import('./routes/checkin/ContextSelectorRoute'));
const PreSleepRoute = lazy(() => import('./routes/checkin/PreSleepRoute'));

// Scenarios
const ScenarioSearchRoute = lazy(() => import('./routes/scenarios/ScenarioSearchRoute'));
const ScenarioPlaybookRoute = lazy(() => import('./routes/scenarios/ScenarioPlaybookRoute'));

// Actions
const ActionLibraryRoute = lazy(() => import('./routes/actions/ActionLibraryRoute'));
const ActionCategoryRoute = lazy(() => import('./routes/actions/ActionCategoryRoute'));
const MicroActionFlowRoute = lazy(() => import('./routes/actions/MicroActionFlowRoute'));

// Recovery
const RecoveryActiveRoute = lazy(() => import('./routes/recovery/RecoveryActiveRoute'));
const RecoveryPaywallRoute = lazy(() => import('./routes/recovery/RecoveryPaywallRoute'));

// Brief
const WeeklyBriefRoute = lazy(() => import('./routes/brief/WeeklyBriefRoute'));
const MondayInterceptRoute = lazy(() => import('./routes/brief/MondayInterceptRoute'));

// Household
const HouseholdHomeRoute = lazy(() => import('./routes/household/HouseholdHomeRoute'));
const HouseholdInviteRoute = lazy(() => import('./routes/household/HouseholdInviteRoute'));

// Profile
const ProfileRoute = lazy(() => import('./routes/profile/ProfileRoute'));
const ProfileSettingsRoute = lazy(() => import('./routes/profile/ProfileSettingsRoute'));

// Payment
const PricingRoute = lazy(() => import('./routes/payment/PricingRoute'));
const PaymentSuccessRoute = lazy(() => import('./routes/payment/PaymentSuccessRoute'));
const PaymentCancelRoute = lazy(() => import('./routes/payment/PaymentCancelRoute'));

// ============================================
// Router configuration
// ============================================

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Redirect root to home or auth
      { index: true, element: <Navigate to="/home" replace /> },

      // Guest-only routes (auth)
      {
        element: <GuestOnly />,
        children: [
          { path: 'auth/register', element: <AuthRegisterRoute /> },
          { path: 'auth/login', element: <AuthLoginRoute /> },
          { path: 'auth/login/magic-link', element: <AuthLoginMagicLinkRoute /> },
          { path: 'auth/magic-link-sent', element: <AuthMagicLinkSentRoute /> },
        ],
      },

      // Protected routes (require auth)
      {
        element: <AuthGuard />,
        children: [
          // Onboarding (auth required, but not onboarding-complete)
          { path: 'onboarding', element: <OnboardingRoute /> },
          { path: 'a2hs', element: <A2HSPromptRoute /> },
          { path: 'a2hs/instructions', element: <A2HSInstructionRoute /> },

          // Main app routes (require onboarding complete)
          {
            element: <OnboardingGuard />,
            children: [
              // Home
              { path: 'home', element: <HomeRoute /> },

              // Check-in flows
              { path: 'checkin', element: <CheckInRoute /> },
              { path: 'checkin/morning', element: <MorningCheckInRoute /> },
              { path: 'checkin/post-event', element: <PostEventCheckInRoute /> },
              { path: 'checkin/context', element: <ContextSelectorRoute /> },
              { path: 'checkin/pre-sleep', element: <PreSleepRoute /> },

              // Scenarios
              { path: 'scenarios', element: <ScenarioSearchRoute /> },
              { path: 'scenarios/:id', element: <ScenarioPlaybookRoute /> },

              // Actions
              { path: 'actions', element: <ActionLibraryRoute /> },
              { path: 'actions/category/:categoryId', element: <ActionCategoryRoute /> },
              { path: 'actions/flow', element: <MicroActionFlowRoute /> },

              // Recovery
              { path: 'recovery', element: <RecoveryActiveRoute /> },
              { path: 'recovery/paywall', element: <RecoveryPaywallRoute /> },

              // Weekly Brief
              { path: 'brief', element: <WeeklyBriefRoute /> },
              { path: 'brief/intercept', element: <MondayInterceptRoute /> },

              // Household
              { path: 'household', element: <HouseholdHomeRoute /> },
              { path: 'household/invite', element: <HouseholdInviteRoute /> },

              // Profile
              { path: 'profile', element: <ProfileRoute /> },
              { path: 'profile/settings', element: <ProfileSettingsRoute /> },

              // Payment
              { path: 'payment/pricing', element: <PricingRoute /> },
              { path: 'payment/success', element: <PaymentSuccessRoute /> },
              { path: 'payment/cancel', element: <PaymentCancelRoute /> },
            ],
          },
        ],
      },

      // Catch-all
      { path: '*', element: <Navigate to="/home" replace /> },
    ],
  },
]);
