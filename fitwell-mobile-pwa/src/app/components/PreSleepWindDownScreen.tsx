import React from 'react';

interface PreSleepWindDownScreenProps {
  onReady: () => void;
  onDelay: () => void;
}

export function PreSleepWindDownScreen({
  onReady,
  onDelay,
}: PreSleepWindDownScreenProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 400,
          color: '#041E3A',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '4px',
          textAlign: 'center',
        }}
      >
        PRE-SLEEP WIND-DOWN
      </div>

      {/* Question */}
      <h1
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '22px',
          fontWeight: 600,
          color: '#041E3A',
          lineHeight: '1.3',
          margin: '0 0 40px 0',
          textAlign: 'center',
        }}
      >
        Sẵn sàng nghỉ chưa?
      </h1>

      {/* Cards */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Card 1: Ready */}
        <button
          onClick={onReady}
          style={{
            width: '100%',
            minHeight: '80px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            padding: '24px',
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 120ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F0F4F8';
            e.currentTarget.style.borderWidth = '2px';
            e.currentTarget.style.borderColor = '#041E3A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderWidth = '1px';
            e.currentTarget.style.borderColor = '#EBEBF0';
          }}
        >
          Sẵn rồi
        </button>

        {/* Card 2: Delay */}
        <button
          onClick={onDelay}
          style={{
            width: '100%',
            minHeight: '80px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            padding: '24px',
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 120ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F0F4F8';
            e.currentTarget.style.borderWidth = '2px';
            e.currentTarget.style.borderColor = '#041E3A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderWidth = '1px';
            e.currentTarget.style.borderColor = '#EBEBF0';
          }}
        >
          Thêm 20 phút
        </button>
      </div>
    </div>
  );
}
