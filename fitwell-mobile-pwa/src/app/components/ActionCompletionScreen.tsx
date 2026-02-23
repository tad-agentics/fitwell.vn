import React, { useEffect } from 'react';

interface ActionCompletionScreenProps {
  onAutoAdvance: () => void;
}

export function ActionCompletionScreen({ onAutoAdvance }: ActionCompletionScreenProps) {
  useEffect(() => {
    // Auto-advance after 2 seconds
    const timer = setTimeout(() => {
      onAutoAdvance();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAutoAdvance]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#041E3A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        textAlign: 'center',
      }}
    >
      {/* Checkmark Circle */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          animation: 'scale-in 150ms ease-out'
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Message */}
      <h1
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '28px',
          fontWeight: 600,
          color: '#FFFFFF',
          lineHeight: '1.3',
          margin: '0 0 12px 0',
        }}
      >
        Xong. Tốt lắm.
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '17px',
          fontWeight: 400,
          color: '#9D9FA3',
          lineHeight: '1.6',
          margin: 0,
        }}
      >
        Tiếp tục hành động tiếp theo...
      </p>

      {/* Animation */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
