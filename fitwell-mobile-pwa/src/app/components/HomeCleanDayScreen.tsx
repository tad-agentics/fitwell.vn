import React from 'react';
import { Search } from 'lucide-react';

interface HomeCleanDayScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeCleanDayScreen({ onNavigate }: HomeCleanDayScreenProps) {
  // Mock data
  const userName = 'Anh';
  const riskDays = [
    { label: 'Hôm nay', risk: 'Thấp', color: '#059669' },
    { label: 'Thứ Năm', risk: 'CAO', color: '#DC2626' },
    { label: 'Thứ Sáu', risk: 'Phục hồi', color: '#D97706' }
  ];
  const patternInsight = undefined;
  
  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', paddingBottom: '56px' }}>
      {/* Header */}
      <div className="fw-container" style={{ paddingTop: '48px', paddingBottom: '24px' }}>
        <h1 className="fw-heading-1" style={{ marginBottom: '8px' }}>
          Chào {userName}
        </h1>
        <p className="fw-body-m fw-text-grey">
          Hôm nay là ngày rủi ro thấp
        </p>
      </div>

      {/* Risk preview card */}
      <div className="fw-container" style={{ paddingBottom: '24px' }}>
        <div className="fw-card">
          <div className="fw-eyebrow" style={{ marginBottom: '12px' }}>
            TUẦN NÀY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {riskDays.map((day, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="fw-body-m fw-text-navy">{day.label}</span>
                <span className="fw-body-m" style={{ fontWeight: 600, color: day.color }}>{day.risk}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('weeklyBrief')}
            className="fw-btn-secondary"
            style={{ marginTop: '16px', width: '100%', textAlign: 'center' }}
          >
            Xem báo cáo tuần →
          </button>
        </div>
      </div>

      {/* No event tonight - clean day message */}
      <div className="fw-container" style={{ paddingBottom: '24px' }}>
        <div className="fw-card">
          <div className="fw-body-l fw-text-navy" style={{ fontWeight: 600, marginBottom: '8px' }}>
            Tối nay không có sự kiện
          </div>
          <p className="fw-body-m fw-text-grey" style={{ marginBottom: '20px' }}>
            Đây là cơ hội tốt để cơ thể phục hồi. Duy trì nhịp sinh hoạt nhẹ nhàng.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onNavigate('actionLibrary')}
              className="fw-btn-primary"
              style={{ flex: 1 }}
            >
              Xem hành động tối nay
            </button>
          </div>
        </div>
      </div>

      {/* Search scenario (optional) */}
      <div className="fw-container">
        <button
          onClick={() => onNavigate('scenarioSearch')}
          className="fw-btn-reset fw-card-hover"
          style={{ width: '100%', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <Search size={20} style={{ color: '#9D9FA3' }} />
          <span className="fw-body-m fw-text-grey">
            Hoặc chuẩn bị cho sự kiện sắp tới...
          </span>
        </button>
      </div>
    </div>
  );
}
