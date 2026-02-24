import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthLoginPasswordScreenProps {
  onNavigate: (screen: string) => void;
  onLoginSuccess: () => void;
}

export function AuthLoginPasswordScreen({
  onNavigate,
  onLoginSuccess,
}: AuthLoginPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      onLoginSuccess();
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
        padding: '48px 20px 40px',
      }}
    >
      {/* Brand mark */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#041E3A',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        FITWELL
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '28px',
          fontWeight: 600,
          color: '#041E3A',
          textAlign: 'center',
          marginBottom: '8px',
          lineHeight: '1.3',
        }}
      >
        Đăng nhập
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '15px',
          fontWeight: 400,
          color: '#9D9FA3',
          textAlign: 'center',
          marginBottom: '32px',
          lineHeight: '1.5',
        }}
      >
        Đăng nhập bằng email và mật khẩu
      </p>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #EBEBF0',
          borderRadius: '4px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        {/* Email field */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: '#9D9FA3',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            style={{
              width: '100%',
              height: '48px',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#041E3A',
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '0 16px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#041E3A';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#EBEBF0';
            }}
          />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: '32px' }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: '#9D9FA3',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            MẬT KHẨU
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              style={{
                width: '100%',
                height: '48px',
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                fontWeight: 400,
                color: '#041E3A',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                padding: '0 48px 0 16px',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#041E3A';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#EBEBF0';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showPassword ? (
                <EyeOff size={20} style={{ color: '#9D9FA3' }} />
              ) : (
                <Eye size={20} style={{ color: '#9D9FA3' }} />
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '4px',
              marginBottom: '16px',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              color: '#DC2626',
              lineHeight: '1.5',
            }}
          >
            {error}
          </div>
        )}

        {/* Primary CTA */}
        <button
          type="submit"
          disabled={isSubmitting || !email || !password}
          className="fw-btn-primary"
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      {/* Divider with "hoặc" */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: '#EBEBF0',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#9D9FA3',
          }}
        >
          hoặc
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: '#EBEBF0',
          }}
        />
      </div>

      {/* Magic link option */}
      <button
        onClick={() => onNavigate('authLogin')}
        type="button"
        style={{
          width: '100%',
          height: '56px',
          backgroundColor: '#FFFFFF',
          color: '#041E3A',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          border: '1px solid #041E3A',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '24px',
        }}
      >
        Đăng nhập bằng Magic Link
      </button>

      {/* Register redirect */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-ui)',
          fontSize: '13px',
          fontWeight: 400,
        }}
      >
        <span style={{ color: '#9D9FA3' }}>Chưa có tài khoản? </span>
        <button
          onClick={() => onNavigate('authRegister')}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: '1px solid #041E3A',
            color: '#041E3A',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
}
