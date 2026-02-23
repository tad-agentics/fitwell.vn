import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCheckins } from '@/hooks/useSupabaseQuery';

interface HomePreSleepScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomePreSleepScreen({ onNavigate }: HomePreSleepScreenProps) {
  const session = useAuthStore((s) => s.session);
  const userId = session?.user?.id;
  const { data: checkins } = useCheckins(userId, 5);

  // Derive today's event context from recent check-ins
  const todayCheckin = checkins?.find((c) => {
    const d = new Date(c.created_at);
    return d.toDateString() === new Date().toDateString() && c.trigger === 'post_event';
  });

  const EVENT_LABELS: Record<string, string> = {
    heavy_night: 'Nhậu nặng',
    rich_meal: 'Ăn tiệc giàu',
    long_desk: 'Ngồi làm việc dài',
    stress_day: 'Ngày căng thẳng',
    travel: 'Đi công tác',
    celebration: 'Tiệc / lễ hội',
  };

  const eventLabel = todayCheckin?.event_type
    ? EVENT_LABELS[todayCheckin.event_type] ?? todayCheckin.event_type
    : null;

  const INTENSITY_LABELS: Record<string, { label: string; dots: number }> = {
    light: { label: 'Nhẹ', dots: 2 },
    medium: { label: 'Vừa', dots: 3 },
    heavy: { label: 'Nặng', dots: 5 },
  };

  const intensity = todayCheckin?.event_intensity
    ? INTENSITY_LABELS[todayCheckin.event_intensity]
    : null;

  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', paddingBottom: '56px' }}>
      {/* Header */}
      <div className="fw-container" style={{ paddingTop: '48px', paddingBottom: '24px' }}>
        <div className="fw-eyebrow" style={{ marginBottom: '4px' }}>
          TRƯỚC KHI NGỦ
        </div>
        <h1 className="fw-heading-1" style={{ marginBottom: '8px' }}>
          Tối nay thế nào?
        </h1>
        <p className="fw-body-m fw-text-grey">
          Check-in cuối ngày giúp tracking chính xác
        </p>
      </div>

      {/* Tonight summary card */}
      {eventLabel && (
        <div className="fw-container" style={{ paddingBottom: '24px' }}>
          <div className="fw-card">
            <div className="fw-body-l fw-text-navy" style={{ fontWeight: 600, marginBottom: '8px' }}>
              Sự kiện hôm nay
            </div>
            <p className="fw-body-m fw-text-grey" style={{ marginBottom: '16px' }}>
              {eventLabel}
            </p>

            {intensity && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <span className="fw-badge fw-badge-outline">
                  {intensity.label}
                </span>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: i < intensity.dots ? '#DC2626' : '#EBEBF0',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="fw-body-s fw-text-grey">
              Check-in để xem tiến trình phục hồi
            </div>
          </div>
        </div>
      )}

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
