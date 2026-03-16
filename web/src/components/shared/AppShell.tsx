/**
 * App shell with BottomNav for main tabs: Hôm nay, Lịch sử, Tiến triển.
 * Used on /home, /history, /progress. Navigates on tab change.
 */

import { BottomNav, Icons } from '@/design-system';
import S14Home from '../home/S14Home';
import HistoryView from '../history/HistoryView';
import ProgressView from '../progress/ProgressView';

const TABS = [
  { label: 'Hôm nay', path: '/home', icon: <Icons.Home /> },
  { label: 'Lịch sử', path: '/history', icon: <Icons.History /> },
  { label: 'Tiến triển', path: '/progress', icon: <Icons.Chart /> },
] as const;

interface AppShellProps {
  activeIndex: 0 | 1 | 2;
  children: React.ReactNode;
}

export function AppShell({ activeIndex, children }: AppShellProps) {
  const handleChange = (index: number) => {
    if (index === activeIndex) return;
    const path = TABS[index]?.path;
    if (path) window.location.href = path;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
      <BottomNav
        items={TABS.map((t) => ({ label: t.label, icon: t.icon }))}
        activeIndex={activeIndex}
        onChange={handleChange}
      />
    </div>
  );
}

export function HomeWithNav() {
  return (
    <AppShell activeIndex={0}>
      <div className="min-h-screen p-6 bg-bg0 text-t0">
        <S14Home />
      </div>
    </AppShell>
  );
}

export function HistoryWithNav() {
  return (
    <AppShell activeIndex={1}>
      <div className="min-h-screen p-6 bg-bg0 text-t0">
        <h1 className="font-display text-lg font-semibold text-t0">Lịch sử</h1>
        <HistoryView />
      </div>
    </AppShell>
  );
}

export function ProgressWithNav() {
  return (
    <AppShell activeIndex={2}>
      <div className="min-h-screen p-6 bg-bg0 text-t0">
        <h1 className="font-display text-lg font-semibold text-t0">Tiến độ</h1>
        <ProgressView />
      </div>
    </AppShell>
  );
}
