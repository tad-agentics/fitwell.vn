import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface WeeklyBriefScreenProps {
  onNavigate: (screen: string) => void;
}

interface RiskDay {
  day: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskLabel: string;
  conditionNote?: string; // Optional grey parenthetical callout
  isHighlighted?: boolean;
}

const RISK_DAYS: RiskDay[] = [
  { day: 'Thứ Hai', riskLevel: 'low', riskLabel: 'Thấp — ngày bình thường' },
  { day: 'Thứ Ba', riskLevel: 'medium', riskLabel: 'Trung bình', conditionNote: '(lưng + căng thẳng)', isHighlighted: false },
  { day: 'Thứ Tư', riskLevel: 'medium', riskLabel: 'Trung bình — bữa trưa công việc' },
  { day: 'Thứ Năm', riskLevel: 'high', riskLabel: 'CAO — tiệc hải sản tối + deadline', isHighlighted: true },
  { day: 'Thứ Sáu', riskLevel: 'medium', riskLabel: 'Phục hồi nếu Thứ Năm nặng' },
  { day: 'Thứ Bảy', riskLevel: 'low', riskLabel: 'Thấp' },
  { day: 'Chủ Nhật', riskLevel: 'low', riskLabel: 'Thấp' },
];

const RISK_COLORS = {
  low: '#059669',
  medium: '#D97706',
  high: '#DC2626',
};

export function WeeklyBriefScreen({ onNavigate }: WeeklyBriefScreenProps) {
  // Score calculation (composite of check-in quality + recovery completion + desk activity)
  const weekScore = 72;
  const previousWeekScore = 68;
  const scoreDelta = weekScore - previousWeekScore;
  const trend = scoreDelta > 0 ? 'up' : scoreDelta < 0 ? 'down' : 'neutral';
  const weekSummary = '2 đêm nặng, phục hồi tốt, desk sedentary cao';

  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', paddingBottom: '72px' }}>
      {/* Screen padding wrapper */}
      <div className="fw-container" style={{ padding: '40px 20px 32px' }}>
        {/* Section 0: Last Week Score Card */}
        <div style={{ marginBottom: '32px' }}>
          <div className="fw-card">
            {/* Eyebrow label */}
            <div className="fw-eyebrow fw-text-grey" style={{ marginBottom: '12px' }}>
              TUẦN TRƯỚC
            </div>

            {/* Score and trend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              {/* Large score number */}
              <div className="fw-display-xl fw-text-navy">
                {weekScore}/100
              </div>

              {/* Trend arrow */}
              {trend === 'up' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TrendingUp size={24} style={{ color: '#059669' }} />
                  <span className="fw-label" style={{ color: '#059669', marginTop: '2px' }}>
                    +{scoreDelta}
                  </span>
                </div>
              )}

              {trend === 'down' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TrendingDown size={24} style={{ color: '#DC2626' }} />
                  <span className="fw-label" style={{ color: '#DC2626', marginTop: '2px' }}>
                    {scoreDelta}
                  </span>
                </div>
              )}

              {trend === 'neutral' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ArrowRight size={24} style={{ color: '#9D9FA3' }} />
                  <span className="fw-label fw-text-grey" style={{ marginTop: '2px' }}>
                    0
                  </span>
                </div>
              )}
            </div>

            {/* One-sentence summary */}
            <p className="fw-body-m fw-text-grey" style={{ margin: 0 }}>
              {weekSummary}
            </p>
          </div>
        </div>

        {/* Section 1: Risk Calendar */}
        <div style={{ marginBottom: '32px' }}>
          {/* Header */}
          <div className="fw-eyebrow fw-text-grey" style={{ marginBottom: '12px' }}>
            TUẦN TỚI — CỬA SỔ RỦI RO
          </div>

          {/* White card with day rows */}
          <div className="fw-card" style={{ padding: 0, overflow: 'hidden' }}>
            {RISK_DAYS.map((dayInfo, index) => (
              <div key={dayInfo.day}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    minHeight: '44px',
                  }}
                >
                  {/* Day name */}
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '15px',
                      fontWeight: 400,
                      color: '#041E3A',
                    }}
                  >
                    {dayInfo.day}
                  </div>

                  {/* Risk indicator */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      justifyContent: 'flex-end',
                    }}
                  >
                    {/* Risk dot */}
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: RISK_COLORS[dayInfo.riskLevel],
                        flexShrink: 0,
                      }}
                    />

                    {/* Risk label and condition note */}
                    <div
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '15px',
                        fontWeight: 400,
                        color: RISK_COLORS[dayInfo.riskLevel],
                        textAlign: 'right',
                      }}
                    >
                      {dayInfo.riskLabel}
                      {dayInfo.conditionNote && (
                        <span
                          style={{
                            color: '#9D9FA3',
                            marginLeft: '4px',
                          }}
                        >
                          {dayInfo.conditionNote}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row separator - not on last item */}
                {index < RISK_DAYS.length - 1 && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: '#EBEBF0',
                      margin: '0 20px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Insight */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '24px 20px',
              position: 'relative',
            }}
          >
            {/* Tier badge - top right */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                right: '20px',
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
              TUẦN 1–4
            </div>

            {/* Heading */}
            <h2 className="fw-heading-2" style={{ margin: '0 0 12px 0', paddingRight: '100px' }}>
              3 buổi sáng lưng cứng trong tuần này — cả 3 là sau ngày ngồi &gt;8 tiếng.
            </h2>

            {/* Detail */}
            <p className="fw-body-m fw-text-grey" style={{ margin: 0 }}>
              Điểm đau lưng buổi chiều giảm ~40% vào những ngày bạn làm bài sáng.
            </p>
          </div>
        </div>

        {/* Section 3: Comparison bars */}
        <div style={{ marginBottom: '32px' }}>
          {/* Label */}
          <div className="fw-eyebrow fw-text-grey" style={{ marginBottom: '16px' }}>
            SO VỚI 4 TUẦN QUA
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Current week bar */}
            <div>
              {/* Label and value above */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span className="fw-body-m" style={{ fontWeight: 600, color: '#041E3A' }}>
                  Tuần này
                </span>
                <span className="fw-body-m" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: '#041E3A' }}>
                  72
                </span>
              </div>
              {/* Bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#EBEBF0', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '72%',
                    height: '100%',
                    backgroundColor: '#041E3A',
                  }}
                />
              </div>
            </div>

            {/* Average week bar */}
            <div>
              {/* Label and value above */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                  }}
                >
                  TB 4 tuần
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                  }}
                >
                  58
                </span>
              </div>
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#EBEBF0',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '58%',
                    height: '100%',
                    backgroundColor: '#EBEBF0',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #041E3A',
              padding: '0 0 2px 0',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
            }}
          >
            Đặt nhắc bài sáng cho Thứ Ba
          </button>
        </div>
      </div>
    </div>
  );
}
