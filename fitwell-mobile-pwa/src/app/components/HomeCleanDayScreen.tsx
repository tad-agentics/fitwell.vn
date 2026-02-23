import React from 'react';
import { Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLatestBrief } from '@/hooks/useSupabaseQuery';
import type { RiskCalendarDay } from '@/types/models';

const RISK_COLORS: Record<string, string> = {
  low: '#059669',
  medium: '#D97706',
  high: '#DC2626',
};

const RISK_LABELS: Record<string, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'CAO',
};

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

interface HomeCleanDayScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeCleanDayScreen({ onNavigate }: HomeCleanDayScreenProps) {
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const userName = profile?.email?.split('@')[0] ?? 'bạn';
  const { data: brief } = useLatestBrief(session?.user?.id);

  const riskCalendar = (brief?.content as { risk_calendar?: RiskCalendarDay[] } | null)?.risk_calendar ?? [];

  // Show up to 3 upcoming risk days from brief, or fallback
  const riskDays = riskCalendar.length > 0
    ? riskCalendar.slice(0, 3).map((day) => {
        const d = new Date(day.date);
        const isToday = d.toDateString() === new Date().toDateString();
        return {
          label: isToday ? 'Hôm nay' : DAY_LABELS[d.getDay()] ?? day.date,
          risk: RISK_LABELS[day.risk_level] ?? day.risk_level,
          color: RISK_COLORS[day.risk_level] ?? '#9D9FA3',
        };
      })
    : [{ label: 'Hôm nay', risk: 'Thấp', color: '#059669' }];

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
