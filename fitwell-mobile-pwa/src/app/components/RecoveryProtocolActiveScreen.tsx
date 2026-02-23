import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Check } from 'lucide-react';

interface RecoveryProtocolActiveScreenProps {
  onNavigate: (screen: string) => void;
  onStartAction: (actionId: string) => void;
  eventType?: 'heavy_night' | 'rich_meal' | 'long_desk' | 'stress_day';
  currentDay?: number; // From active recovery protocol
  totalDays?: number; // From active recovery protocol
}

interface Action {
  id: string;
  category: string;
  name: string;
  duration: string;
  rationale: string;
  status: 'completed' | 'current' | 'upcoming' | 'skipped';
  videoThumbnailUrl: string; // First frame of exercise video
}

interface DayData {
  dayNumber: number;
  status: 'completed' | 'active' | 'locked';
  label: string;
  actions: Action[];
}

// Recovery type configurations
interface RecoveryConfig {
  eyebrow: (dayNum: number, totalDays: number) => string;
  headline: string;
  totalDays: number;
}

const RECOVERY_CONFIGS: Record<string, RecoveryConfig> = {
  heavy_night: {
    eyebrow: (dayNum, totalDays) => `POST-EVENT RECOVERY · NGÀY ${dayNum} / ${totalDays}`,
    headline: 'Phục hồi sau nhậu nặng',
    totalDays: 3,
  },
  rich_meal: {
    eyebrow: (dayNum, totalDays) => `METABOLIC RECOVERY · NGÀY ${dayNum} / ${totalDays}`,
    headline: 'Phục hồi sau bữa ăn giàu',
    totalDays: 2,
  },
  long_desk: {
    eyebrow: (dayNum, totalDays) => `SPINAL RECOVERY · NGÀY ${dayNum} / ${totalDays}`,
    headline: 'Phục hồi sau ngày làm việc dài',
    totalDays: 2,
  },
  stress_day: {
    eyebrow: (dayNum, totalDays) => `CORTISOL RECOVERY · NGÀY ${dayNum} / ${totalDays}`,
    headline: 'Phục hồi sau ngày căng thẳng',
    totalDays: 2,
  },
};

// Recovery days for heavy_night (3-day protocol)
const RECOVERY_DAYS_HEAVY_NIGHT: DayData[] = [
  {
    dayNumber: 1,
    status: 'active',
    label: 'Detox tích cực',
    actions: [
      {
        id: 'hydration',
        category: 'KÍCH HOẠT BUỔI SÁNG',
        name: 'Uống 500ml nước ấm',
        duration: '5 phút',
        rationale: 'Gan cần nước để xử lý độc tố sau rượu.',
        status: 'completed',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=96&h=128&fit=crop',
      },
      {
        id: 'breathing',
        category: 'TĂNG TỐC DETOX',
        name: 'Thở sâu 3 phút',
        duration: '3 phút',
        rationale: 'Oxy hoá giúp gan làm việc nhanh hơn 40%.',
        status: 'completed',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=96&h=128&fit=crop',
      },
      {
        id: 'walk',
        category: 'PHỤC HỒI SAU SỰ KIỆN',
        name: 'Đi bộ nhẹ 15 phút',
        duration: '15 phút',
        rationale: 'Tuần hoàn máu giúp đào thải mỡ nhanh hơn.',
        status: 'current',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=96&h=128&fit=crop',
      },
      {
        id: 'knee-hugs',
        category: 'HEAVY NIGHT RECOVERY',
        name: 'Supine Knee Hugs',
        duration: '3 phút',
        rationale: 'Kích thích tiêu hóa trước khi ra khỏi giường.',
        status: 'upcoming',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=96&h=128&fit=crop',
      },
    ],
  },
  {
    dayNumber: 2,
    status: 'locked',
    label: 'Phục hồi sâu',
    actions: [
      {
        id: 'morning-walk',
        category: 'KÍCH HOẠT BUỔI SÁNG',
        name: 'Đi bộ 20 phút',
        duration: '20 phút',
        rationale: 'Duy trì tuần hoàn tốt giúp gan tiếp tục detox.',
        status: 'upcoming',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=96&h=128&fit=crop',
      },
      {
        id: 'light-meal',
        category: 'DINH DƯỠNG',
        name: 'Ăn nhẹ, nhiều rau',
        duration: '30 phút',
        rationale: 'Vitamin và chất xơ hỗ trợ gan tái tạo.',
        status: 'upcoming',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=96&h=128&fit=crop',
      },
    ],
  },
  {
    dayNumber: 3,
    status: 'locked',
    label: 'Hoàn tất & đánh giá',
    actions: [
      {
        id: 'final-checkin',
        category: 'ĐÁNH GIÁ',
        name: 'Check-in sức khoẻ',
        duration: '2 phút',
        rationale: 'So sánh biomarker trước và sau để xác nhận phục hồi.',
        status: 'upcoming',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=96&h=128&fit=crop',
      },
    ],
  },
];

// Recovery days for long_desk (2-day protocol) - SPINAL RECOVERY
const RECOVERY_DAYS_LONG_DESK: DayData[] = [
  {
    dayNumber: 1,
    status: 'active',
    label: 'Giải nén cột sống',
    actions: [
      {
        id: 'lying-decompression',
        category: 'SPINAL DECOMPRESSION',
        name: 'Nằm Thư Giãn Thắt Lưng',
        duration: '3 phút',
        rationale: 'Giải nén đĩa đệm L4-L5 sau 10 tiếng ngồi.',
        status: 'completed',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=96&h=128&fit=crop',
      },
      {
        id: 'cat-cow',
        category: 'SPINAL DECOMPRESSION',
        name: 'Cat-Cow Stretch',
        duration: '2 phút',
        rationale: 'Khôi phục độ linh hoạt cột sống sau tư thế tĩnh kéo dài.',
        status: 'current',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=96&h=128&fit=crop',
      },
      {
        id: 'desk-posture-reset',
        category: 'DESK BREAK',
        name: 'Sitting Posture Reset',
        duration: '1 phút',
        rationale: 'Chỉnh lại tư thế ngồi, tránh lặp lại hôm nay.',
        status: 'upcoming',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=96&h=128&fit=crop',
      },
      {
        id: 'evening-walk',
        category: 'CIRCULATION',
        name: 'Đi bộ nhẹ 10 phút',
        duration: '10 phút',
        rationale: 'Tuần hoàn giúp giảm sưng viêm ở lưng dưới.',
        status: 'upcoming',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=96&h=128&fit=crop',
      },
    ],
  },
  {
    dayNumber: 2,
    status: 'locked',
    label: 'Phòng ngừa lặp lại',
    actions: [
      {
        id: 'morning-spinal-prep',
        category: 'MORNING ACTIVATION',
        name: 'Spinal Prep Before Work',
        duration: '3 phút',
        rationale: 'Chuẩn bị cột sống trước ngày làm việc mới.',
        status: 'upcoming',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=96&h=128&fit=crop',
      },
      {
        id: 'hourly-stand-reminder',
        category: 'DESK BREAK',
        name: 'Đứng lên mỗi 90 phút',
        duration: '1 phút',
        rationale: 'Ngắt chu kỳ nén đĩa đệm, phòng tái phát.',
        status: 'upcoming',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=96&h=128&fit=crop',
      },
    ],
  },
];

export function RecoveryProtocolActiveScreen({
  onNavigate,
  onStartAction,
  eventType = 'heavy_night',
  currentDay = 1,
  totalDays,
}: RecoveryProtocolActiveScreenProps) {
  const [expandedDay, setExpandedDay] = useState<number>(currentDay);

  // Get recovery configuration based on event type
  const config = RECOVERY_CONFIGS[eventType];
  const effectiveTotalDays = totalDays ?? config.totalDays;

  // Get recovery days data based on event type
  const templateDays = eventType === 'long_desk'
    ? RECOVERY_DAYS_LONG_DESK
    : RECOVERY_DAYS_HEAVY_NIGHT;

  // Update day statuses based on real current_day from DB
  const recoveryDays = templateDays.map((day) => ({
    ...day,
    status: day.dayNumber < currentDay ? 'completed' as const
      : day.dayNumber === currentDay ? 'active' as const
      : 'locked' as const,
  }));

  const toggleDay = (dayNumber: number) => {
    setExpandedDay(expandedDay === dayNumber ? 0 : dayNumber);
  };

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
          {config.eyebrow(currentDay, effectiveTotalDays)}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            lineHeight: '1.3',
            margin: '0 0 32px 0',
          }}
        >
          {config.headline}
        </h1>

        {/* Recovery Timeline */}
        <div style={{ position: 'relative' }}>
          {recoveryDays.map((day, dayIndex) => {
            const isExpanded = expandedDay === day.dayNumber;
            const isCompleted = day.status === 'completed';
            const isActive = day.status === 'active';
            const isLocked = day.status === 'locked';

            return (
              <div
                key={day.dayNumber}
                style={{
                  position: 'relative',
                  paddingLeft: '40px',
                  paddingBottom: dayIndex < recoveryDays.length - 1 ? '24px' : '0',
                }}
              >
                {/* Vertical timeline line - only show if not last item */}
                {dayIndex < recoveryDays.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '5px',
                      top: '12px',
                      bottom: '-12px',
                      width: '1px',
                      backgroundColor: '#EBEBF0',
                    }}
                  />
                )}

                {/* Day node circle */}
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '6px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#059669' : 'transparent',
                    border: isActive ? '2px solid #041E3A' : '1px solid #EBEBF0',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Day header - clickable to expand/collapse */}
                <button
                  onClick={() => toggleDay(day.dayNumber)}
                  disabled={isLocked}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    cursor: isLocked ? 'default' : 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: isExpanded ? '16px' : '0',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 400,
                        color: isLocked ? '#9D9FA3' : '#041E3A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '2px',
                        lineHeight: '1.0',
                      }}
                    >
                      NGÀY {day.dayNumber} / {effectiveTotalDays}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '17px',
                        fontWeight: 600,
                        color: isLocked ? '#9D9FA3' : '#041E3A',
                        lineHeight: '1.3',
                      }}
                    >
                      {day.label}
                    </div>
                  </div>

                  {!isLocked && (
                    <div style={{ color: '#9D9FA3' }}>
                      {isExpanded ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  )}

                  {isLocked && (
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 400,
                        color: '#9D9FA3',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        lineHeight: '1.0',
                      }}
                    >
                      KHOÁ
                    </div>
                  )}
                </button>

                {/* Action cards - only show if expanded */}
                {isExpanded && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {day.actions.map((action) => {
                      const isActionCompleted = action.status === 'completed';
                      const isCurrent = action.status === 'current';
                      const isUpcoming = action.status === 'upcoming';
                      const isSkipped = action.status === 'skipped';

                      return (
                        <div
                          key={action.id}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: `1px solid ${isCurrent ? '#041E3A' : '#EBEBF0'}`,
                            borderRadius: '4px',
                            padding: '16px',
                            minHeight: '140px',
                            display: 'flex',
                            gap: '16px',
                          }}
                        >
                          {/* Video thumbnail - Left side */}
                          <div
                            style={{
                              position: 'relative',
                              width: '96px',
                              height: '128px',
                              flexShrink: 0,
                              borderRadius: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            {/* Thumbnail image */}
                            <img
                              src={action.videoThumbnailUrl}
                              alt={action.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: (isActionCompleted || isSkipped) ? 'grayscale(0.6)' : 'none',
                              }}
                            />

                            {/* Light navy overlay */}
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(4, 30, 58, 0.30)',
                              }}
                            />

                            {/* Play icon - for current/upcoming */}
                            {!isActionCompleted && !isSkipped && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                }}
                              >
                                <Play
                                  size={12}
                                  style={{
                                    color: '#FFFFFF',
                                    fill: '#FFFFFF',
                                  }}
                                />
                              </div>
                            )}

                            {/* Green checkmark overlay - for completed only */}
                            {isActionCompleted && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: '#059669',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                              </div>
                            )}
                          </div>

                          {/* Text content - Right side */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {/* Eyebrow category */}
                            <div
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                fontWeight: 400,
                                color: (isActionCompleted || isSkipped) ? '#9D9FA3' : '#041E3A',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '4px',
                                lineHeight: '1.0',
                              }}
                            >
                              {action.category}
                            </div>

                            {/* Action name */}
                            <div
                              style={{
                                fontFamily: 'var(--font-ui)',
                                fontSize: '17px',
                                fontWeight: 600,
                                color: (isActionCompleted || isSkipped) ? '#9D9FA3' : '#041E3A',
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
                                marginBottom: '8px',
                                lineHeight: '1.0',
                              }}
                            >
                              {action.duration}
                            </div>

                            {/* Rationale - one line */}
                            <div
                              style={{
                                fontFamily: 'var(--font-ui)',
                                fontSize: '13px',
                                fontWeight: 400,
                                color: '#9D9FA3',
                                lineHeight: '1.5',
                                marginBottom: isCurrent ? '12px' : '0',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {action.rationale}
                            </div>

                            {/* CTA for current action */}
                            {isCurrent && (
                              <button
                                onClick={() => onStartAction(action.id)}
                                style={{
                                  width: '100%',
                                  height: '40px',
                                  backgroundColor: '#041E3A',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  color: '#FFFFFF',
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px',
                                  cursor: 'pointer',
                                  transition: 'background-color 150ms ease-out',
                                  lineHeight: '1.0',
                                  marginTop: 'auto',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#0A3055';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#041E3A';
                                }}
                              >
                                BẮT ĐẦU
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
