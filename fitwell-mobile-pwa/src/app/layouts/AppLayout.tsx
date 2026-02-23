import React, { Suspense } from 'react';
import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';

function LoadingFallback() {
  return (
    <div className="fw-full fw-flex-center fw-bg-surface">
      <div className="fw-label fw-text-muted" style={{ letterSpacing: '0.1em' }}>
        LOADING...
      </div>
    </div>
  );
}

export function AppLayout() {
  return (
    <div
      className="fitwell-app"
      style={{
        width: '100%',
        maxWidth: '430px',
        height: '100dvh',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--grey-surface)',
      }}
    >
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
      <BottomNav />
    </div>
  );
}
