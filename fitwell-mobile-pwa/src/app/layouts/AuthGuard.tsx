import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/store/authStore';

export function AuthGuard() {
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="fw-full fw-flex-center fw-bg-surface">
        <div className="fw-label fw-text-muted">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/register" replace />;
  }

  return <Outlet />;
}

export function OnboardingGuard() {
  const profile = useAuthStore((s) => s.profile);

  if (profile && !profile.onboarding_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

export function GuestOnly() {
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="fw-full fw-flex-center fw-bg-surface">
        <div className="fw-label fw-text-muted">Loading...</div>
      </div>
    );
  }

  if (session && profile?.onboarding_complete) {
    return <Navigate to="/home" replace />;
  }

  if (session && !profile?.onboarding_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
