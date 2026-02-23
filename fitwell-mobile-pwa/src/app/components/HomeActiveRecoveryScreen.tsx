import React from 'react';
import { Check } from 'lucide-react';

interface HomeActiveRecoveryScreenProps {
  onNavigate: (screen: string) => void;
  eventType?: 'heavy_night' | 'rich_meal' | 'long_desk' | 'stress_day';
}

interface RecoveryAction {
  id: string;
  name: string;
  duration: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface RecoveryConfig {
  eyebrow: string;
  headline: string;
  dayBadge: string;
  lastNightSummary: string;
  lastNightIntensity: string; // "Nặng" or "Vừa" or "Nhẹ"
  actions: RecoveryAction[];
}

const RECOVERY_CONFIGS: Record<string, RecoveryConfig> = {
  heavy_night: {
    eyebrow: 'HEAVY NIGHT RECOVERY',
    headline: 'Phục hồi sau nhậu nặng',
    dayBadge: 'NGÀY 1 / 3',
    lastNightSummary: 'Hôm qua: Nhậu Nặng',
    lastNightIntensity: 'Nặng',
    actions: [
      { id: 'hydration', name: 'Uống 500ml nước ấm', duration: '5 phút', status: 'completed' },
      { id: 'breathing', name: 'Thở sâu 3 phút', duration: '3 phút', status: 'completed' },
      { id: 'walk', name: 'Đi bộ nhẹ 15 phút', duration: '15 phút', status: 'current' },
    ],
  },
  long_desk: {
    eyebrow: 'SPINAL RECOVERY',
    headline: 'Phục hồi sau ngày làm việc dài',
    dayBadge: 'NGÀY 1 / 2',
    lastNightSummary: 'Hôm qua: Ngày Làm Việc 10 Tiếng',
    lastNightIntensity: 'Nặng',
    actions: [
      { id: 'lying-decompression', name: 'Nằm Thư Giãn Thắt Lưng', duration: '3 phút', status: 'completed' },
      { id: 'doorway-chest-opener', name: 'Mở Ngực Khung Cửa', duration: '2 phút', status: 'current' },
      { id: 'standing-thoracic-rotation', name: 'Xoay Lưng Ngực Đứng', duration: '3 phút', status: 'upcoming' },
    ],
  },
  rich_meal: {
    eyebrow: 'METABOLIC RECOVERY',
    headline: 'Phục hồi sau bữa ăn giàu',
    dayBadge: 'NGÀY 1 / 2',
    lastNightSummary: 'Hôm qua: Buffet Lớn',
    lastNightIntensity: 'Nặng',
    actions: [
      { id: 'morning-walk', name: 'Đi bộ sáng 20 phút', duration: '20 phút', status: 'completed' },
      { id: 'light-breakfast', name: 'Ăn sáng nhẹ', duration: '15 phút', status: 'current' },
      { id: 'hydration', name: 'Uống nước đều', duration: '5 phút', status: 'upcoming' },
    ],
  },
  stress_day: {
    eyebrow: 'CORTISOL RECOVERY',
    headline: 'Phục hồi sau ngày căng thẳng',
    dayBadge: 'NGÀY 1 / 2',
    lastNightSummary: 'Hôm qua: Deadline Cực Căng',
    lastNightIntensity: 'Nặng',
    actions: [
      { id: 'breathing', name: 'Thở sâu 5 phút', duration: '5 phút', status: 'completed' },
      { id: 'walk', name: 'Đi bộ thư giãn', duration: '15 phút', status: 'current' },
      { id: 'meditation', name: 'Thiền ngắn', duration: '10 phút', status: 'upcoming' },
    ],
  },
};

export function HomeActiveRecoveryScreen({ 
  onNavigate,
  eventType = 'long_desk' // Default to long_desk for demo
}: HomeActiveRecoveryScreenProps) {
  const config = RECOVERY_CONFIGS[eventType];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
        paddingBottom: '72px', // Bottom nav clearance
      }}
    >
      <div style={{ padding: '40px 20px 32px' }}>
        {/* Header */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 400,
            color: '#041E3A',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
            lineHeight: '1.0',
          }}
        >
          {config.eyebrow}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            lineHeight: '1.3',
            margin: '0 0 16px 0',
          }}
        >
          {config.headline}
        </h1>

        {/* Day badge and last night summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          {/* Day badge */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 400,
              color: '#041E3A',
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '2px',
              padding: '4px 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {config.dayBadge}
          </div>

          {/* Last night summary */}
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 400,
              color: '#9D9FA3',
              lineHeight: '1.0',
            }}
          >
            {config.lastNightSummary} —{' '}
            <span
              style={{
                color: config.lastNightIntensity === 'Nặng' ? '#DC2626' : '#D97706',
                fontWeight: 600,
              }}
            >
              {config.lastNightIntensity}
            </span>
          </div>
        </div>

        {/* Recovery timeline */}
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          {config.actions.map((action, index) => {
            const isCompleted = action.status === 'completed';
            const isCurrent = action.status === 'current';
            const isUpcoming = action.status === 'upcoming';
            const isLastItem = index === config.actions.length - 1;

            return (
              <div
                key={action.id}
                style={{
                  position: 'relative',
                  paddingBottom: isLastItem ? '0' : '24px',
                }}
              >
                {/* Vertical timeline line - only show if not last item */}
                {!isLastItem && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '-26px',
                      top: '10px',
                      bottom: '-14px',
                      width: '1px',
                      backgroundColor: '#EBEBF0',
                    }}
                  />
                )}

                {/* Timeline node circle */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#059669' : isCurrent ? '#041E3A' : 'transparent',
                    border: isCurrent ? '2px solid #041E3A' : '1px solid #EBEBF0',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isCompleted && (
                    <Check size={8} color="#FFFFFF" strokeWidth={3} />
                  )}
                </div>

                {/* Action card */}
                <button
                  onClick={() => isCurrent ? onNavigate('microAction') : null}
                  style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${isCurrent ? '#041E3A' : '#EBEBF0'}`,
                    borderRadius: '4px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: isCurrent ? 'pointer' : 'default',
                    opacity: isUpcoming ? 0.6 : 1,
                    transition: 'all 120ms ease-out',
                  }}
                  disabled={!isCurrent}
                >
                  {/* Action name */}
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: isCompleted || isUpcoming ? '#9D9FA3' : '#041E3A',
                      lineHeight: '1.3',
                      marginBottom: '4px',
                    }}
                  >
                    {action.name}
                  </div>

                  {/* Duration */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                      lineHeight: '1.0',
                    }}
                  >
                    {action.duration}
                  </div>

                  {/* Status text for completed */}
                  {isCompleted && (
                    <div
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '11px',
                        fontWeight: 400,
                        color: '#059669',
                        marginTop: '8px',
                      }}
                    >
                      Hoàn thành
                    </div>
                  )}

                  {/* CTA for current action */}
                  {isCurrent && (
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#041E3A',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginTop: '12px',
                        borderTop: '1px solid #EBEBF0',
                        paddingTop: '12px',
                      }}
                    >
                      BẮT ĐẦU →
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* View full protocol link */}
        <button
          onClick={() => onNavigate('recoveryActive')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#041E3A',
            borderBottom: '1px solid #041E3A',
            lineHeight: '1.0',
            marginTop: '24px',
          }}
        >
          Xem protocol đầy đủ →
        </button>
      </div>
    </div>
  );
}
