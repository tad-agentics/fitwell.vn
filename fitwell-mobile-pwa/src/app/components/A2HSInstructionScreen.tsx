import React from 'react';
import { Share } from 'lucide-react';

interface A2HSInstructionScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

export function A2HSInstructionScreen({ onBack, onComplete }: A2HSInstructionScreenProps) {
  return (
    <div 
      className="h-full flex flex-col"
      style={{ 
        backgroundColor: '#041E3A',
        padding: '0 20px'
      }}
    >
      {/* Content - centered vertically */}
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        {/* Animated Share Icon */}
        <div 
          className="mb-8"
          style={{
            animation: 'pulse-subtle 2s ease-in-out infinite'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Share 
              size={40} 
              style={{ 
                color: '#FFFFFF',
                transform: 'translateY(-2px)'
              }} 
            />
          </div>
        </div>

        {/* Heading */}
        <h1 
          className="fitwell-heading-primary mb-4"
          style={{
            color: '#FFFFFF',
            fontSize: '28px',
            fontWeight: '600',
            lineHeight: '1.3',
            letterSpacing: '-0.019em',
            maxWidth: '320px'
          }}
        >
          Thêm vào màn hình chính
        </h1>

        {/* Instructions */}
        <div 
          className="fitwell-body mb-8"
          style={{
            color: '#9D9FA3',
            fontSize: '17px',
            fontWeight: '400',
            lineHeight: '1.6',
            maxWidth: '340px'
          }}
        >
          Để truy cập nhanh FitWell, nhấn nút <span style={{ color: '#FFFFFF' }}>Chia sẻ</span> ở thanh dưới Safari, sau đó chọn <span style={{ color: '#FFFFFF' }}>"Thêm vào Màn hình chính"</span>.
        </div>

        {/* Step-by-step */}
        <div 
          className="space-y-4 mb-12"
          style={{
            maxWidth: '340px',
            textAlign: 'left'
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="fitwell-label"
              style={{
                color: '#9D9FA3',
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                minWidth: '60px'
              }}
            >
              BƯỚC 1
            </div>
            <div
              className="fitwell-body"
              style={{
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '400',
                lineHeight: '1.5'
              }}
            >
              Nhấn nút <Share size={16} style={{ display: 'inline', marginBottom: '-2px' }} /> ở thanh dưới Safari
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="fitwell-label"
              style={{
                color: '#9D9FA3',
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                minWidth: '60px'
              }}
            >
              BƯỚC 2
            </div>
            <div
              className="fitwell-body"
              style={{
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '400',
                lineHeight: '1.5'
              }}
            >
              Chọn "Thêm vào Màn hình chính"
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="fitwell-label"
              style={{
                color: '#9D9FA3',
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                minWidth: '60px'
              }}
            >
              BƯỚC 3
            </div>
            <div
              className="fitwell-body"
              style={{
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '400',
                lineHeight: '1.5'
              }}
            >
              Nhấn "Thêm" ở góc trên bên phải
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div 
        className="pb-12"
        style={{
          paddingBottom: '48px'
        }}
      >
        <button
          onClick={onComplete}
          className="w-full"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#041E3A',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '18px 24px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            height: '56px'
          }}
        >
          Hiểu rồi
        </button>

        <button
          onClick={onComplete}
          className="w-full mt-4"
          style={{
            background: 'none',
            border: 'none',
            color: '#9D9FA3',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: '400',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          Để sau
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
