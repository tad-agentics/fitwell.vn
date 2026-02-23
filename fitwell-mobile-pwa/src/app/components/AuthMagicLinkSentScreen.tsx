import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

interface AuthMagicLinkSentScreenProps {
  onNavigate: (screen: string) => void;
  onResend: () => void;
}

export function AuthMagicLinkSentScreen({
  onNavigate,
  onResend,
}: AuthMagicLinkSentScreenProps) {
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const email = 'user@example.com'; // Mock email

  useEffect(() => {
    // Start 60-second countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResend = () => {
    if (canResend) {
      onResend();
      setCanResend(false);
      setCountdown(60);
    }
  };

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
          maxWidth: '320px',
        }}
      >
        {/* Icon - Envelope with checkmark overlay */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Mail
            size={48}
            style={{
              color: '#041E3A',
              strokeWidth: 1.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              backgroundColor: '#F5F5F5',
              borderRadius: '50%',
              padding: '2px',
            }}
          >
            <CheckCircle
              size={16}
              style={{
                color: '#059669',
                fill: '#059669',
              }}
            />
          </div>
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
          Kiểm tra email của bạn
        </h1>

        {/* Body */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '40px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#9D9FA3',
              textAlign: 'center',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            Chúng tôi đã gửi link đăng nhập đến
          </p>

          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 600,
              color: '#041E3A',
              textAlign: 'center',
              lineHeight: '1.5',
              margin: '4px 0',
            }}
          >
            {email}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 400,
              color: '#9D9FA3',
              textAlign: 'center',
              lineHeight: '1.5',
              margin: '4px 0 0 0',
            }}
          >
            Link có hiệu lực trong 10 phút.
          </p>
        </div>

        {/* Secondary action - Resend link */}
        <button
          onClick={handleResend}
          disabled={!canResend}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: canResend ? '1px solid #041E3A' : 'none',
            color: canResend ? '#041E3A' : '#9D9FA3',
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            cursor: canResend ? 'pointer' : 'not-allowed',
            padding: 0,
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {canResend ? 'Gửi lại link' : `Gửi lại link (${countdown}s)`}
        </button>

        {/* Ghost - Alternative password login */}
        <button
          onClick={() => onNavigate('authLogin')}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: '#9D9FA3',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            cursor: 'pointer',
            padding: 0,
            textAlign: 'center',
          }}
        >
          Dùng mật khẩu thay thế
        </button>
      </div>
    </div>
  );
}
