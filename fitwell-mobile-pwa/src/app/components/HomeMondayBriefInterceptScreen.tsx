import React from 'react';
import { useLatestBrief } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

interface HomeMondayBriefInterceptScreenProps {
  onNavigate: (screen: string) => void;
  onViewBrief?: () => void;
  onDismiss?: () => void;
}

export function HomeMondayBriefInterceptScreen({ onNavigate, onViewBrief, onDismiss }: HomeMondayBriefInterceptScreenProps) {
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const userId = session?.user?.id;
  const language = profile?.language ?? 'vi';
  const { data: brief } = useLatestBrief(userId);

  const headline = brief
    ? (language === 'vi' ? brief.headline_vi : brief.headline_en)
    : 'Báo cáo tuần của bạn đã sẵn sàng';

  return (
    <div
      className="fw-screen fw-bg-surface"
      style={{
        overflow: 'auto',
        paddingBottom: '56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 20px',
      }}
    >
      {/* Eyebrow */}
      <div className="fw-eyebrow" style={{ marginBottom: '4px' }}>
        BÁO CÁO TUẦN QUA
      </div>

      {/* Headline */}
      <h1 className="fw-heading-1" style={{ marginBottom: '20px' }}>
        Tuần trước của bạn
      </h1>

      {/* Summary insight card */}
      <div className="fw-card" style={{ marginBottom: '32px' }}>
        <div className="fw-body-l fw-text-navy" style={{ fontWeight: 600, marginBottom: '8px' }}>
          {headline}
        </div>
        {brief && (
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 400,
              color: '#8C693B',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '4px 8px',
              backgroundColor: 'rgba(140, 105, 59, 0.08)',
              borderRadius: '2px',
              marginTop: '8px',
            }}
          >
            TUẦN {brief.insight_tier}
          </div>
        )}
      </div>

      {/* CTA */}
      <button onClick={onViewBrief ?? (() => onNavigate('weeklyBrief'))} className="fw-btn-primary">
        XEM BÁO CÁO ĐẦY ĐỦ
      </button>

      {/* Skip option */}
      <button
        onClick={onDismiss ?? (() => onNavigate('home'))}
        className="fw-btn-ghost"
        style={{ marginTop: '12px' }}
      >
        Để sau
      </button>
    </div>
  );
}
