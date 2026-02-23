import React from 'react';

interface PostEventTypeSelectorProps {
  onTypeSelect: (eventType: string) => void;
}

interface EventTypeOption {
  label: string;
  subtitle: string;
  value: string;
}

const eventTypeOptions: EventTypeOption[] = [
  {
    label: 'Bữa ăn nhiều',
    subtitle: 'Hải sản, BBQ, tiệc',
    value: 'rich_meal',
  },
  {
    label: 'Đêm nhậu',
    subtitle: 'Bia, rượu, sự kiện',
    value: 'heavy_night',
  },
  {
    label: 'Ngày làm việc dài',
    subtitle: '8+ tiếng, ngồi liên tục',
    value: 'long_desk',
  },
  {
    label: 'Ngày căng thẳng',
    subtitle: 'Deadline, áp lực, xung đột',
    value: 'stress_day',
  },
  {
    label: 'Công tác',
    subtitle: 'Bay, di chuyển, khách sạn',
    value: 'travel',
  },
  {
    label: 'Ngủ kém',
    subtitle: 'Đêm trằn trọc',
    value: 'poor_sleep',
  },
];

/**
 * Post-Event Type Selector Screen (Conditional)
 * 
 * Only shown when Post-Event Screen 1 (intensity) response is "Nặng" or "Vừa"
 * 
 * Classifies the event type to drive the correct recovery protocol.
 * This is v2.0's key addition — differentiates "heavy night out" from "10-hour desk day"
 * and routes to entirely different recovery categories.
 * 
 * Appears after Post-Event Screen 1 (intensity), before protocol assignment.
 * One-tap auto-advance - no confirm button needed.
 * 
 * Writes to: checkins.event_type (rich_meal, heavy_night, long_desk, stress_day, travel, poor_sleep)
 */
export function PostEventTypeSelector({ onTypeSelect }: PostEventTypeSelectorProps) {
  const handleTypeSelect = (eventType: string) => {
    // Auto-advance on tap - writes value and transitions immediately
    console.log('Event type selected:', eventType);
    onTypeSelect(eventType);
  };

  return (
    <div className="fw-screen fw-bg-surface">
      {/* Content container */}
      <div style={{ padding: '40px 20px 0' }}>
        {/* Eyebrow label with step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div
            className="fw-eyebrow fw-text-navy"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            POST-EVENT RECOVERY
          </div>
          <div
            className="fw-eyebrow"
            style={{
              color: '#9D9FA3', // Grey text for step indicator
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            · 2 của 2
          </div>
        </div>

        {/* Question */}
        <h1
          className="fw-heading-1"
          style={{
            marginBottom: '24px',
          }}
        >
          Đó là buổi gì?
        </h1>

        {/* 2×3 Grid - Six event type cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {eventTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTypeSelect(option.value)}
              style={{
                height: '88px',
                background: '#FFFFFF',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                cursor: 'pointer',
                transition: 'all 120ms ease-out',
                textAlign: 'left',
                position: 'relative',
              }}
              // Hover state
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F0F4F8';
                e.currentTarget.style.borderColor = '#041E3A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#EBEBF0';
              }}
            >
              {/* Label - primary text */}
              <div
                className="fw-body-m"
                style={{
                  fontWeight: 600,
                  color: '#041E3A',
                  marginBottom: '4px',
                  lineHeight: '1.2',
                }}
              >
                {option.label}
              </div>

              {/* Subtitle - secondary descriptive text */}
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 400,
                  color: '#9D9FA3',
                  lineHeight: '1.3',
                }}
              >
                {option.subtitle}
              </div>
            </button>
          ))}
        </div>

        {/* Helper text - explains the one-tap behavior */}
        <div
          className="fw-body-s fw-text-grey"
          style={{
            marginTop: '16px',
            textAlign: 'center',
          }}
        >
          Chọn một để tiếp tục
        </div>
      </div>
    </div>
  );
}
