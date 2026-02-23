import React from 'react';

interface MondayBriefInterceptScreenProps {
  onNavigate: (screen: string) => void;
  onViewBrief: () => void;
  onSkip: () => void;
}

export function MondayBriefInterceptScreen({ onNavigate, onViewBrief, onSkip }: MondayBriefInterceptScreenProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 20px',
      }}
    >
      {/* Content - centered */}
      <div className="text-center mb-12">
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 400,
            color: '#9D9FA3',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
          }}
        >
          TRƯỚC KHI BẮT ĐẦU TUẦN MỚI
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '28px',
            fontWeight: 600,
            color: '#041E3A',
            lineHeight: '1.3',
            letterSpacing: '-0.019em',
            marginBottom: '16px',
          }}
        >
          Xem lại tuần trước
        </h1>

        {/* Body */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '17px',
            fontWeight: 400,
            color: '#9D9FA3',
            lineHeight: '1.6',
            maxWidth: '320px',
            margin: '0 auto',
          }}
        >
          Mất 60 giây để hiểu rõ hơn các mẫu hình tuần trước và chuẩn bị cho tuần này.
        </p>
      </div>

      {/* CTAs */}
      <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
        {/* Primary CTA */}
        <button
          onClick={onViewBrief}
          style={{
            width: '100%',
            backgroundColor: '#041E3A',
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '18px 24px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            height: '56px',
            marginBottom: '16px',
          }}
        >
          Xem tóm tắt tuần trước
        </button>

        {/* Skip link */}
        <button
          onClick={onSkip}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#9D9FA3',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            cursor: 'pointer',
            padding: '12px',
          }}
        >
          Bỏ qua
        </button>
      </div>
    </div>
  );
}
