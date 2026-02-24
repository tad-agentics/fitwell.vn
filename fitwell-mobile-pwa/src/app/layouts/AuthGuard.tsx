import React from 'react';
import { Outlet } from 'react-router';

// AUTH DISABLED FOR TESTING — all guards pass through
export function AuthGuard() {
  return <Outlet />;
}

export function OnboardingGuard() {
  return <Outlet />;
}

export function GuestOnly() {
  return <Outlet />;
}
