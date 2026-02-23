import React from 'react';

interface PaymentCancelScreenProps {
  onNavigate: (screen: string) => void;
}

export function PaymentCancelScreen({
  onNavigate,
}: PaymentCancelScreenProps) {
  const onRetry = () => onNavigate('pricing');
  const onGoHome = () => onNavigate('home');
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '340px',
        }}
      >
        {/* Icon - circle with × */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '1px solid #EBEBF0',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '28px',
              fontWeight: 600,
              color: '#9D9FA3',
              lineHeight: '1.0',
            }}
          >
            ×
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            textAlign: 'center',
            marginBottom: '8px',
            lineHeight: '1.3',
          }}
        >
          Thanh toán chưa hoàn tất
        </h1>

        {/* Body text */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: '#9D9FA3',
            textAlign: 'center',
            marginBottom: '40px',
            lineHeight: '1.5',
          }}
        >
          Bạn có thể thử lại bất cứ lúc nào.
        </p>

        {/* Primary CTA - Retry */}
        <button
          onClick={onRetry}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: '#041E3A',
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          Thử lại
        </button>

        {/* Ghost link - Go home */}
        <button
          onClick={onGoHome}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#9D9FA3',
            textAlign: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            lineHeight: '1.5',
          }}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
