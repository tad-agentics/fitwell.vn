import React from 'react';

interface HomeMiddayScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeMiddayScreen({ onNavigate }: HomeMiddayScreenProps) {
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
        CHECK-IN BÂY GIỜ
      </div>

      {/* Headline */}
      <h1 className="fw-heading-1" style={{ marginBottom: '12px' }}>
        Bây giờ bạn cảm thấy thế nào?
      </h1>

      {/* Rationale */}
      <p className="fw-body-m fw-text-grey" style={{ marginBottom: '32px' }}>
        Đã gần trưa. Check-in nhanh giúp bạn theo dõi tiến trình phục hồi.
      </p>

      {/* CTA */}
      <button
        onClick={() => onNavigate('checkInMidday')}
        className="fw-btn-primary"
      >
        BẮT ĐẦU CHECK-IN
      </button>

      {/* Skip option */}
      <button
        onClick={() => onNavigate('home')}
        className="fw-btn-ghost"
        style={{ marginTop: '16px' }}
      >
        Để sau
      </button>
    </div>
  );
}
