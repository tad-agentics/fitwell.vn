import React from 'react';
import { Check } from 'lucide-react';
import { useActiveRecovery } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

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
  actions: RecoveryAction[];
}

// Content templates for each recovery type
const RECOVERY_CONFIGS: Record<string, RecoveryConfig> = {
  heavy_night: {
    eyebrow: 'HEAVY NIGHT RECOVERY',
    headline: 'Phục hồi sau nhậu nặng',
    actions: [
      { id: 'hydration', name: 'Uống 500ml nước ấm', duration: '5 phút', status: 'current' },
      { id: 'breathing', name: 'Thở sâu 3 phút', duration: '3 phút', status: 'upcoming' },
      { id: 'walk', name: 'Đi bộ nhẹ 15 phút', duration: '15 phút', status: 'upcoming' },
    ],
  },
  long_desk: {
    eyebrow: 'SPINAL RECOVERY',
    headline: 'Phục hồi sau ngày làm việc dài',
    actions: [
      { id: 'lying-decompression', name: 'Nằm Thư Giãn Thắt Lưng', duration: '3 phút', status: 'current' },
      { id: 'doorway-chest-opener', name: 'Mở Ngực Khung Cửa', duration: '2 phút', status: 'upcoming' },
      { id: 'standing-thoracic-rotation', name: 'Xoay Lưng Ngực Đứng', duration: '3 phút', status: 'upcoming' },
    ],
  },
  rich_meal: {
    eyebrow: 'METABOLIC RECOVERY',
    headline: 'Phục hồi sau bữa ăn giàu',
    actions: [
      { id: 'morning-walk', name: 'Đi bộ sáng 20 phút', duration: '20 phút', status: 'current' },
      { id: 'light-breakfast', name: 'Ăn sáng nhẹ', duration: '15 phút', status: 'upcoming' },
      { id: 'hydration', name: 'Uống nước đều', duration: '5 phút', status: 'upcoming' },
    ],
  },
  stress_day: {
    eyebrow: 'CORTISOL RECOVERY',
    headline: 'Phục hồi sau ngày căng thẳng',
    actions: [
      { id: 'breathing', name: 'Thở sâu 5 phút', duration: '5 phút', status: 'current' },
      { id: 'walk', name: 'Đi bộ thư giãn', duration: '15 phút', status: 'upcoming' },
      { id: 'meditation', name: 'Thiền ngắn', duration: '10 phút', status: 'upcoming' },
    ],
  },
};

export function HomeActiveRecoveryScreen({
  onNavigate,
  eventType = 'heavy_night',
}: HomeActiveRecoveryScreenProps) {
  const session = useAuthStore((s) => s.session);
  const { data: recovery } = useActiveRecovery(session?.user?.id);

  // Use real protocol data if available
  const effectiveEventType = (recovery?.event_type as keyof typeof RECOVERY_CONFIGS) || eventType;
  const currentDay = recovery?.current_day ?? 1;
  const totalDays = recovery?.total_days ?? (effectiveEventType === 'heavy_night' ? 3 : 2);
  const config = RECOVERY_CONFIGS[effectiveEventType] ?? RECOVERY_CONFIGS.heavy_night;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
        paddingBottom: '72px',
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

        {/* Day badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
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
            NGÀY {currentDay} / {totalDays}
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
                  {isCompleted && <Check size={8} color="#FFFFFF" strokeWidth={3} />}
                </div>

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
                  {isCompleted && (
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 400, color: '#059669', marginTop: '8px' }}>
                      Hoàn thành
                    </div>
                  )}
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
