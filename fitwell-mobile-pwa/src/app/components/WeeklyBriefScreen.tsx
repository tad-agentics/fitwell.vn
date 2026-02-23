import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useLatestBrief, useMarkBriefRead } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';
import type { RiskCalendarDay, BriefPattern, BriefComparison } from '@/types/models';

interface WeeklyBriefScreenProps {
  onNavigate?: (screen: string) => void;
  onMarkRead?: () => void;
}

const RISK_COLORS = {
  low: '#059669',
  medium: '#D97706',
  high: '#DC2626',
};

const RISK_LABELS: Record<string, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'CAO',
};

const DAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export function WeeklyBriefScreen({ onMarkRead }: WeeklyBriefScreenProps) {
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const userId = session?.user?.id;
  const language = profile?.language ?? 'vi';
  const { data: brief } = useLatestBrief(userId);
  const markBriefRead = useMarkBriefRead();

  const content = brief?.content as {
    risk_calendar?: RiskCalendarDay[];
    patterns?: BriefPattern[];
    comparison?: BriefComparison | null;
  } | null;

  const riskCalendar = content?.risk_calendar ?? [];
  const patterns = content?.patterns ?? [];
  const comparison = content?.comparison ?? null;

  const insightTier = brief?.insight_tier ?? 1;
  const headline = brief
    ? (language === 'vi' ? brief.headline_vi : brief.headline_en)
    : '';

  // Mark brief as read on view
  React.useEffect(() => {
    if (brief && !brief.is_read && userId) {
      markBriefRead.mutate({ id: brief.id, userId });
    }
  }, [brief?.id]);

  if (!brief) {
    return (
      <div className="fw-screen fw-bg-surface" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="fw-body-m fw-text-grey">Chưa có báo cáo tuần</div>
      </div>
    );
  }

  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', paddingBottom: '72px' }}>
      <div className="fw-container" style={{ padding: '40px 20px 32px' }}>
        {/* Headline Card */}
        <div style={{ marginBottom: '32px' }}>
          <div className="fw-card">
            <div className="fw-eyebrow fw-text-grey" style={{ marginBottom: '12px' }}>
              TUẦN TRƯỚC
            </div>
            <h2 className="fw-heading-2" style={{ margin: '0 0 12px 0' }}>
              {headline}
            </h2>
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
              }}
            >
              TUẦN {insightTier}
            </div>
          </div>
        </div>

        {/* Risk Calendar */}
        {riskCalendar.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div className="fw-eyebrow fw-text-grey" style={{ marginBottom: '12px' }}>
              TUẦN TỚI — CỬA SỔ RỦI RO
            </div>
            <div className="fw-card" style={{ padding: 0, overflow: 'hidden' }}>
              {riskCalendar.map((dayInfo, index) => {
                const dayDate = new Date(dayInfo.date);
                const dayName = DAY_NAMES[dayDate.getDay()] ?? dayInfo.date;
                const riskColor = RISK_COLORS[dayInfo.risk_level] ?? '#9D9FA3';
                const riskLabel = RISK_LABELS[dayInfo.risk_level] ?? dayInfo.risk_level;
                const explanation = language === 'vi' ? dayInfo.explanation_vi : dayInfo.explanation_en;

                return (
                  <div key={dayInfo.date}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        minHeight: '44px',
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 400, color: '#041E3A' }}>
                        {dayName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: riskColor, flexShrink: 0 }} />
                        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 400, color: riskColor, textAlign: 'right' }}>
                          {riskLabel}
                          {explanation && <span style={{ color: '#9D9FA3', marginLeft: '4px' }}>— {explanation}</span>}
                        </div>
                      </div>
                    </div>
                    {index < riskCalendar.length - 1 && (
                      <div style={{ height: '1px', backgroundColor: '#EBEBF0', margin: '0 20px' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Patterns / Insights */}
        {patterns.map((pattern, idx) => {
          const title = language === 'vi' ? pattern.title_vi : pattern.title_en;
          const desc = language === 'vi' ? pattern.description_vi : pattern.description_en;
          return (
            <div key={idx} style={{ marginBottom: '16px' }}>
              <div className="fw-card">
                <h2 className="fw-heading-2" style={{ margin: '0 0 12px 0' }}>{title}</h2>
                <p className="fw-body-m fw-text-grey" style={{ margin: 0 }}>{desc}</p>
              </div>
            </div>
          );
        })}

        {/* Comparison bars */}
        {comparison && (
          <div style={{ marginBottom: '32px', marginTop: '16px' }}>
            <div className="fw-eyebrow fw-text-grey" style={{ marginBottom: '16px' }}>
              SO VỚI TUẦN TRƯỚC
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span className="fw-body-m" style={{ fontWeight: 600, color: '#041E3A' }}>Tuần này</span>
                  <span className="fw-body-m" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: '#041E3A' }}>{comparison.current_week}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#EBEBF0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(comparison.current_week, 100)}%`, height: '100%', backgroundColor: '#041E3A' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 400, color: '#9D9FA3' }}>Tuần trước</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 400, color: '#9D9FA3' }}>{comparison.previous_week}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#EBEBF0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(comparison.previous_week, 100)}%`, height: '100%', backgroundColor: '#EBEBF0' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {comparison.trend === 'up' && <TrendingUp size={16} style={{ color: '#059669' }} />}
                {comparison.trend === 'down' && <TrendingDown size={16} style={{ color: '#DC2626' }} />}
                {comparison.trend === 'stable' && <ArrowRight size={16} style={{ color: '#9D9FA3' }} />}
                <span className="fw-body-s fw-text-grey">
                  {comparison.trend === 'up' ? 'Cải thiện' : comparison.trend === 'down' ? 'Giảm' : 'Ổn định'} so với tuần trước
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mark read CTA */}
        {onMarkRead && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={onMarkRead} className="fw-btn-primary">
              ĐÃ ĐỌC
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
