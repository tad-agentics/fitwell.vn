import React from 'react';

interface HomePreDinnerCountdownScreenProps {
  onNavigate: (screen: string) => void;
  onViewScenario?: () => void;
  eventTitle?: string;
  eventTime?: string;
}

export function HomePreDinnerCountdownScreen({
  onNavigate,
  onViewScenario,
  eventTitle,
  eventTime = '19:30',
}: HomePreDinnerCountdownScreenProps) {
  // Compute hours remaining until event
  const now = new Date();
  const [h, m] = eventTime.split(':').map(Number);
  const eventDate = new Date(now);
  eventDate.setHours(h, m, 0, 0);
  const diffMs = eventDate.getTime() - now.getTime();
  const hoursUntil = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));

  const displayTitle = eventTitle ?? `Sự kiện — ${eventTime}`;

  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', paddingBottom: '56px' }}>
      {/* Header */}
      <div className="fw-container" style={{ paddingTop: '48px', paddingBottom: '32px' }}>
        <div className="fw-eyebrow" style={{ marginBottom: '4px' }}>
          SỰ KIỆN HÔM NAY
        </div>
        <h1 className="fw-heading-1" style={{ marginBottom: '8px' }}>
          {displayTitle}
        </h1>
        <p className="fw-body-m fw-text-grey">
          Còn {hoursUntil} giờ nữa
        </p>
      </div>

      {/* Countdown card */}
      <div className="fw-container" style={{ paddingBottom: '24px' }}>
        <div className="fw-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div className="fw-display-l fw-text-navy" style={{ marginBottom: '8px' }}>
            {hoursUntil}h
          </div>
          <div className="fw-body-s fw-text-grey">
            Thời gian chuẩn bị
          </div>
        </div>
      </div>

      {/* Pre-event checklist */}
      <div className="fw-container" style={{ paddingBottom: '24px' }}>
        <div className="fw-card">
          <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
            TRƯỚC KHI ĐI
          </div>

          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>&#9633;</span>
              Uống 500ml nước
            </li>
            <li className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>&#9633;</span>
              Ăn nhẹ trước
            </li>
            <li className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>&#9633;</span>
              Xem lại kịch bản
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="fw-container">
        <button onClick={onViewScenario ?? (() => onNavigate('scenarioPlaybook'))} className="fw-btn-primary">
          Xem kịch bản đầy đủ
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="fw-btn-ghost"
          style={{ marginTop: '12px', width: '100%' }}
        >
          Đã chuẩn bị xong
        </button>
      </div>
    </div>
  );
}
