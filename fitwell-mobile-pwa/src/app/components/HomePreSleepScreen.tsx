import React from 'react';

interface HomePreSleepScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomePreSleepScreen({ onNavigate }: HomePreSleepScreenProps) {
  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', paddingBottom: '56px' }}>
      {/* Header */}
      <div className="fw-container" style={{ paddingTop: '48px', paddingBottom: '24px' }}>
        <div className="fw-eyebrow" style={{ marginBottom: '4px' }}>
          TRƯỚC KHI NGỦ
        </div>
        <h1 className="fw-heading-1" style={{ marginBottom: '8px' }}>
          Tối qua thế nào?
        </h1>
        <p className="fw-body-m fw-text-grey">
          Check-in cuối ngày giúp tracking chính xác
        </p>
      </div>

      {/* Tonight summary card */}
      <div className="fw-container" style={{ paddingBottom: '24px' }}>
        <div className="fw-card">
          <div className="fw-body-l fw-text-navy" style={{ fontWeight: 600, marginBottom: '8px' }}>
            Sự kiện hôm nay
          </div>
          <p className="fw-body-m fw-text-grey" style={{ marginBottom: '16px' }}>
            Nhà hàng hải sản đối tác — Kịch bản đã chuẩn bị
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <span className="fw-badge fw-badge-outline">
              CÔNG TÁC
            </span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: i < 5 ? '#DC2626' : '#EBEBF0',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="fw-body-s fw-text-grey">
            Check-in để xem bạn tuân thủ kịch bản như thế nào
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fw-container">
        <button onClick={() => onNavigate('checkInEvening')} className="fw-btn-primary">
          BẮT ĐẦU CHECK-IN
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="fw-btn-ghost"
          style={{ marginTop: '12px', width: '100%' }}
        >
          Để sáng mai
        </button>
      </div>

      {/* Wind-down option */}
      <div className="fw-container" style={{ paddingTop: '32px' }}>
        <button
          onClick={() => onNavigate('preSleepWindDown')}
          className="fw-btn-reset fw-card-hover"
          style={{ width: '100%', padding: '20px', textAlign: 'left' }}
        >
          <div className="fw-body-m fw-text-navy" style={{ fontWeight: 600, marginBottom: '4px' }}>
            Hoặc thư giãn trước khi ngủ
          </div>
          <div className="fw-body-s fw-text-grey">
            3 phút breathing exercise
          </div>
        </button>
      </div>
    </div>
  );
}
