import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthRegisterScreenProps {
  onNavigate: (screen: string) => void;
  onRegisterSuccess: () => void;
}

export function AuthRegisterScreen({
  onNavigate,
  onRegisterSuccess,
}: AuthRegisterScreenProps) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration success
    onRegisterSuccess();
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
        Tạo tài khoản
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
        Miễn phí · Không cần thẻ
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
        {/* Field 1 - Display name */}
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
            Tên hiển thị
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ví dụ: Minh"
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

        {/* Field 2 - Email */}
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

        {/* Field 3 - Password */}
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
              placeholder="Tối thiểu 8 ký tự"
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
          Tạo tài khoản
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

      {/* Login redirect */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-ui)',
          fontSize: '13px',
          fontWeight: 400,
        }}
      >
        <span style={{ color: '#9D9FA3' }}>Đã có tài khoản? </span>
        <button
          onClick={() => onNavigate('authLogin')}
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
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
