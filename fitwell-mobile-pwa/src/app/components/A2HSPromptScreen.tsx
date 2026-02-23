import React from 'react';

interface A2HSPromptScreenProps {
  onNavigate: (screen: string) => void;
  onComplete: () => void;
  onShowGuide: () => void;
}

export function A2HSPromptScreen({ onNavigate, onComplete, onShowGuide }: A2HSPromptScreenProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 20px 32px',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 400,
          textTransform: 'uppercase',
          color: '#041E3A',
          letterSpacing: '0.05em',
          marginBottom: '4px',
          lineHeight: '1.0',
        }}
      >
        TRẢI NGHIỆM ỨNG DỤNG
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '28px',
          fontWeight: 600,
          color: '#041E3A',
          lineHeight: '1.3',
          marginBottom: '16px',
        }}
      >
        Thêm vào màn hình chính
      </h1>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '17px',
          fontWeight: 400,
          color: '#9D9FA3',
          lineHeight: '1.6',
          marginBottom: '40px',
        }}
      >
        Sử dụng FitWell như một ứng dụng — không cần cửa hàng, không cần tải xuống.
      </p>

      {/* Visual demo card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '40px',
          padding: '32px 20px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #EBEBF0',
          borderRadius: '4px',
        }}
      >
        {/* Safari Share Icon (mock) */}
        <div
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="21" y="8" width="6" height="24" rx="1" fill="#041E3A" />
            <path
              d="M24 8L18 14L21 14L21 17L27 17L27 14L30 14L24 8Z"
              fill="#041E3A"
            />
            <path
              d="M12 32L12 36C12 37.1046 12.8954 38 14 38L34 38C35.1046 38 36 37.1046 36 36L36 32"
              stroke="#041E3A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Mock "Thêm vào màn hình chính" menu */}
        <div
          style={{
            width: '240px',
            height: '64px',
            backgroundColor: '#F5F5F5',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #EBEBF0',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#041E3A',
              textAlign: 'center',
              lineHeight: '1.5',
            }}
          >
            Thêm vào màn hình chính
          </div>
        </div>

        {/* Mock "Thêm" button */}
        <div
          style={{
            width: '140px',
            height: '44px',
            backgroundColor: '#F5F5F5',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid #041E3A',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 600,
              color: '#041E3A',
              lineHeight: '1.5',
            }}
          >
            Thêm
          </div>
        </div>
      </div>

      {/* Step-by-step instructions */}
      <div
        style={{
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: '#041E3A',
            lineHeight: '1.6',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontWeight: 600 }}>1.</span> Nhấn nút Chia sẻ ↑ ở thanh trình duyệt
        </div>

        <div
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: '#041E3A',
            lineHeight: '1.6',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontWeight: 600 }}>2.</span> Chọn &quot;Thêm vào màn hình chính&quot;
        </div>

        <div
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: '#041E3A',
            lineHeight: '1.6',
          }}
        >
          <span style={{ fontWeight: 600 }}>3.</span> Nhấn &quot;Thêm&quot;
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onShowGuide}
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
          lineHeight: '1.0',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0A3055';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#041E3A';
        }}
      >
        HIỂU RỒI
      </button>

      {/* Ghost dismiss */}
      <button
        onClick={onComplete}
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
  );
}
