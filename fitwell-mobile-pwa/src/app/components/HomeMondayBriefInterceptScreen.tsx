import React from 'react';

interface HomeMondayBriefInterceptScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeMondayBriefInterceptScreen({ onNavigate }: HomeMondayBriefInterceptScreenProps) {
  const weekScore = 72;
  const previousWeekScore = 68;
  const scoreDelta = weekScore - previousWeekScore;

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

      {/* Score card */}
      <div className="fw-card" style={{ marginBottom: '32px', textAlign: 'center', padding: '40px 24px' }}>
        <div className="fw-display-xl fw-text-navy" style={{ marginBottom: '8px' }}>
          {weekScore}/100
        </div>
        <div className="fw-body-s" style={{ color: scoreDelta > 0 ? '#059669' : '#DC2626' }}>
          {scoreDelta > 0 ? '+' : ''}{scoreDelta} so với tuần trước
        </div>
      </div>

      {/* Summary insight */}
      <div className="fw-card" style={{ marginBottom: '32px' }}>
        <div className="fw-body-l fw-text-navy" style={{ fontWeight: 600, marginBottom: '8px' }}>
          2 đêm nặng, phục hồi tốt
        </div>
        <p className="fw-body-m fw-text-grey">
          Bạn đã hoàn thành 85% các hành động recovery. Desk sedentary vẫn cao — cần cải thiện.
        </p>
      </div>

      {/* CTA */}
      <button onClick={() => onNavigate('weeklyBrief')} className="fw-btn-primary">
        XEM BÁO CÁO ĐẦY ĐỦ
      </button>

      {/* Skip option */}
      <button
        onClick={() => onNavigate('home')}
        className="fw-btn-ghost"
        style={{ marginTop: '12px' }}
      >
        Để sau
      </button>
    </div>
  );
}
