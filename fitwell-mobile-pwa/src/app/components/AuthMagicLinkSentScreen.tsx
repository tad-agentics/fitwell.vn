import React, { useState, useEffect, useCallback } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthMagicLinkSentScreenProps {
  email: string;
  onNavigate: (screen: string) => void;
}

export function AuthMagicLinkSentScreen({
  email,
  onNavigate,
}: AuthMagicLinkSentScreenProps) {
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
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

  const handleResend = useCallback(async () => {
    if (!canResend || resending) return;

    setResending(true);
    setResendError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/home` },
      });

      if (error) {
        setResendError(error.message);
        return;
      }

      // Reset countdown
      setCanResend(false);
      setCountdown(60);
    } catch {
      setResendError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setResending(false);
    }
  }, [canResend, resending, email]);

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

        {/* Resend error */}
        {resendError && (
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '4px',
              marginBottom: '16px',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              color: '#DC2626',
              lineHeight: '1.5',
              textAlign: 'center',
            }}
          >
            {resendError}
          </div>
        )}

        {/* Secondary action - Resend link */}
        <button
          onClick={handleResend}
          disabled={!canResend || resending}
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
          {resending
            ? 'Đang gửi...'
            : canResend
              ? 'Gửi lại link'
              : `Gửi lại link (${countdown}s)`}
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
