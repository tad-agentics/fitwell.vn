import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Clock, CheckSquare, Grid2x2, FileText, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLatestBrief } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { path: '/scenarios', icon: Clock, labelKey: 'nav:tonight' },
  { path: '/checkin', icon: CheckSquare, labelKey: 'nav:checkin' },
  { path: '/actions', icon: Grid2x2, labelKey: 'nav:actions' },
  { path: '/brief', icon: FileText, labelKey: 'nav:thisWeek' },
  { path: '/profile', icon: User, labelKey: 'nav:me' },
] as const;

// Routes where bottom nav should be hidden
const HIDDEN_ROUTES = [
  '/auth',
  '/onboarding',
  '/a2hs',
  '/checkin/morning',
  '/checkin/post-event',
  '/checkin/midday',
  '/checkin/pre-sleep',
  '/actions/timer',
  '/actions/flow',
  '/scenarios/',
  '/payment',
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session);
  const userId = session?.user?.id;
  const { data: brief } = useLatestBrief(userId);

  // Hide on certain routes
  const shouldHide = HIDDEN_ROUTES.some((route) => location.pathname.startsWith(route));
  if (shouldHide) return null;

  const hasUnreadBrief = brief && !brief.is_read;

  return (
    <nav className="fw-bottom-nav" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map(({ path, icon: Icon, labelKey }) => {
        const isActive = location.pathname.startsWith(path);
        const isBrief = path === '/brief';

        return (
          <button
            key={path}
            className="fw-btn-nav"
            onClick={() => navigate(path)}
            aria-current={isActive ? 'page' : undefined}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={24}
                strokeWidth={1.5}
                color={isActive ? 'var(--navy)' : 'var(--grey-text)'}
              />
              {isBrief && hasUnreadBrief && (
                <div
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -4,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'var(--amber)',
                  }}
                />
              )}
            </div>
            <span
              className={`fw-bottom-nav-label ${isActive ? 'fw-bottom-nav-label-active' : 'fw-bottom-nav-label-inactive'}`}
            >
              {t(labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
