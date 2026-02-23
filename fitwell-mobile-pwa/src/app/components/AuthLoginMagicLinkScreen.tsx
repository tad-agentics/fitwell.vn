import React, { useState } from 'react';

interface AuthLoginMagicLinkScreenProps {
  onNavigate: (screen: string) => void;
  onSubmit: () => void;
}

export function AuthLoginMagicLinkScreen({
  onNavigate,
  onSubmit,
}: AuthLoginMagicLinkScreenProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
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
        Nhập email để nhận link đăng nhập
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
        <div style={{ marginBottom: '24px' }}>
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

        {/* Primary CTA */}
        <button
          type="submit"
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
          }}
        >
          Gửi link đăng nhập
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

      {/* Password login option */}
      <button
        onClick={() => onNavigate('authRegister')}
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
        Đăng nhập bằng mật khẩu
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
