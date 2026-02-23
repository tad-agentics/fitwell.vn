import React from 'react';

interface RecoveryProtocolPaywallScreenProps {
  onNavigate: (screen: string) => void;
  onViewPlans: () => void; // Should navigate to pricing with 'individual-quarterly' highlighted
  onSkip: () => void;
}

export function RecoveryProtocolPaywallScreen({
  onNavigate,
  onViewPlans,
  onSkip,
}: RecoveryProtocolPaywallScreenProps) {
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
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 400,
            color: '#041E3A',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px',
            lineHeight: '1.0',
          }}
        >
          RECOVERY DAY 2
        </div>

        {/* Headline */}
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
          Ngày 2 phục hồi — tiếp tục đà hôm qua.
        </h1>

        {/* Body text */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: '#9D9FA3',
            lineHeight: '1.5',
            margin: '0 0 32px 0',
          }}
        >
          Bạn đã hoàn thành 1 trong 3 ngày. Mở khóa để tiếp tục.
        </p>

        {/* Progress indicator - showing day 2 locked */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          {/* Progress text */}
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 400,
              color: '#9D9FA3',
              lineHeight: '1.5',
            }}
          >
            Ngày 2 / 3
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#059669', // Day 1 completed - green
              }}
            />
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#D97706', // Day 2 locked - amber
                border: '2px solid #D97706',
              }}
            />
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EBEBF0',
              }}
            />
          </div>
        </div>

        {/* Lock visual/message card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            padding: '32px 24px',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          {/* Lock icon */}
          <div style={{ marginBottom: '20px' }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{ margin: '0 auto' }}
            >
              <rect
                x="10"
                y="22"
                width="28"
                height="20"
                rx="2"
                stroke="#9D9FA3"
                strokeWidth="2"
              />
              <path
                d="M16 22V16C16 11.5817 19.5817 8 24 8C28.4183 8 32 11.5817 32 16V22"
                stroke="#9D9FA3"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="24" cy="32" r="2" fill="#9D9FA3" />
            </svg>
          </div>

          {/* Lock message */}
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '17px',
              fontWeight: 600,
              color: '#041E3A',
              lineHeight: '1.4',
              marginBottom: '8px',
            }}
          >
            Nội dung premium
          </div>

          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#9D9FA3',
              lineHeight: '1.5',
            }}
          >
            Nâng cấp để mở khóa ngày 2 và 3 của giao thức phục hồi.
          </div>
        </div>

        {/* Primary CTA - deep-link to pricing with individual-quarterly highlighted */}
        <button
          onClick={onViewPlans}
          style={{
            width: '100%',
            height: '56px',
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
            marginBottom: '16px',
            transition: 'background-color 150ms ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            lineHeight: '1.0',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0A3055';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#041E3A';
          }}
        >
          XEM GÓI →
        </button>

        {/* Ghost button - Skip */}
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            width: '100%',
            padding: '12px',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#9D9FA3',
            cursor: 'pointer',
            textAlign: 'center',
            lineHeight: '1.5',
          }}
        >
          Để sau
        </button>
      </div>
    </div>
  );
}
