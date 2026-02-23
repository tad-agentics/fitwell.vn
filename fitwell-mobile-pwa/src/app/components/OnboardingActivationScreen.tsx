import React, { useState } from 'react';

interface OnboardingActivationScreenProps {
  onConfirm: (eventData: { type: string; datetime: string } | null) => void;
  onSkip: () => void;
}

const EVENT_OPTIONS = [
  { 
    id: 'big-meal', 
    label: 'Bữa ăn nhiều',
    subtitle: 'Hải sản, BBQ, tiệc, cưới',
    requiresDateTime: true,
  },
  { 
    id: 'drinking-social', 
    label: 'Nhậu / sự kiện xã giao',
    subtitle: 'Bia, rượu, KTV',
    requiresDateTime: true,
  },
  { 
    id: 'heavy-work', 
    label: 'Ngày làm việc dày',
    subtitle: '10 tiếng, họp liên tục',
    requiresDateTime: true,
  },
  { 
    id: 'start-tomorrow', 
    label: 'Chưa có — bắt đầu với sáng mai',
    subtitle: 'FitWell sẽ nhắc lúc 7 giờ',
    requiresDateTime: false,
  },
];

export function OnboardingActivationScreen({ onConfirm, onSkip }: OnboardingActivationScreenProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const selectedOption = EVENT_OPTIONS.find(opt => opt.id === selectedEvent);
  const requiresDateTime = selectedOption?.requiresDateTime ?? false;

  const handleEventSelect = (eventId: string) => {
    setSelectedEvent(eventId);
    
    // If "start tomorrow" selected, auto-confirm immediately
    if (eventId === 'start-tomorrow') {
      setTimeout(() => {
        onConfirm(null);
      }, 300);
    } else {
      // Reset date/time when switching events
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  const handleConfirm = () => {
    if (selectedEvent === 'start-tomorrow') {
      onConfirm(null);
    } else if (selectedEvent && selectedDate && selectedTime) {
      onConfirm({
        type: selectedEvent,
        datetime: `${selectedDate} ${selectedTime}`,
      });
    }
  };

  const canConfirm = selectedEvent === 'start-tomorrow' || (selectedEvent && selectedDate && selectedTime);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '40px 20px 32px',
        }}
      >
        {/* Progress indicator - step 4 of 5 */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          {/* Steps 1-3 (completed) */}
          <div style={{ flex: 1, height: '2px', backgroundColor: '#041E3A' }} />
          <div style={{ flex: 1, height: '2px', backgroundColor: '#041E3A' }} />
          <div style={{ flex: 1, height: '2px', backgroundColor: '#041E3A' }} />
          
          {/* Step 4 (current) */}
          <div style={{ flex: 1, height: '2px', backgroundColor: '#041E3A' }} />
          
          {/* Step 5 (not yet) */}
          <div style={{ flex: 1, height: '2px', backgroundColor: '#EBEBF0' }} />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            lineHeight: '1.3',
            margin: 0,
          }}
        >
          Tuần này bạn có buổi nào cần chuẩn bị không?
        </h1>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Event option cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          {EVENT_OPTIONS.map((option) => {
            const isSelected = selectedEvent === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleEventSelect(option.id)}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  backgroundColor: isSelected ? '#F0F4F8' : '#FFFFFF',
                  border: `${isSelected ? '2px' : '1px'} solid ${isSelected ? '#041E3A' : '#EBEBF0'}`,
                  borderLeft: isSelected ? '4px solid #041E3A' : undefined,
                  borderRadius: '4px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  transition: 'all 120ms ease-out',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#F0F4F8';
                    e.currentTarget.style.borderColor = '#041E3A';
                    e.currentTarget.style.borderWidth = '2px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#EBEBF0';
                    e.currentTarget.style.borderWidth = '1px';
                  }
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: '1.3',
                  }}
                >
                  {option.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                    lineHeight: '1.5',
                  }}
                >
                  {option.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Date/time picker - shown when event requiring datetime is selected */}
        {selectedEvent && requiresDateTime && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#041E3A',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Ngày
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EBEBF0',
                  borderRadius: '4px',
                  padding: '0 12px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#041E3A',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#041E3A',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Giờ
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EBEBF0',
                  borderRadius: '4px',
                  padding: '0 12px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#041E3A',
                }}
              />
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Primary CTA - only shown if not "start tomorrow" (which auto-confirms) */}
        {selectedEvent !== 'start-tomorrow' && (
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: canConfirm ? '#041E3A' : '#F5F5F5',
              color: canConfirm ? '#FFFFFF' : '#9D9FA3',
              border: canConfirm ? 'none' : '1px solid #EBEBF0',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              marginBottom: '12px',
              transition: 'background-color 120ms ease-out',
            }}
            onMouseEnter={(e) => {
              if (canConfirm) {
                e.currentTarget.style.backgroundColor = '#0A3055';
              }
            }}
            onMouseLeave={(e) => {
              if (canConfirm) {
                e.currentTarget.style.backgroundColor = '#041E3A';
              }
            }}
          >
            XÁC NHẬN
          </button>
        )}

        {/* Ghost skip button */}
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            padding: '12px',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#9D9FA3',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          Bỏ qua
        </button>
      </div>
    </div>
  );
}
