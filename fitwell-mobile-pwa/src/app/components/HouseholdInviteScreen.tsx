import React, { useState } from 'react';

interface HouseholdInviteScreenProps {
  onNavigate: (screen: string) => void;
  onContinue: () => void;
  onViewStatus: () => void;
}

export function HouseholdInviteScreen({
  onNavigate,
  onContinue,
  onViewStatus,
}: HouseholdInviteScreenProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  
  // Mock data
  const inviteUrl = 'https://fitwell.vn/invite/a3x7k';
  const qrCodeDataUrl = undefined;
  const context = 'profile';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopyStatus('copied');
      
      // Revert back to idle after 2 seconds
      setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShareZalo = () => {
    // Zalo sharing URL scheme
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent('Tham gia FitWell cùng tôi')}`;
    window.open(zaloUrl, '_blank');
  };

  const handleShareSMS = () => {
    // SMS sharing
    const smsBody = `Tham gia FitWell cùng tôi: ${inviteUrl}`;
    window.location.href = `sms:?body=${encodeURIComponent(smsBody)}`;
  };

  // Generate truncated URL for display
  const getTruncatedUrl = () => {
    const urlWithoutProtocol = inviteUrl.replace(/^https?:\/\//, '');
    if (urlWithoutProtocol.length > 30) {
      return urlWithoutProtocol.substring(0, 30) + '...';
    }
    return urlWithoutProtocol;
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#F5F5F5',
        padding: '40px 20px 80px',
      }}
    >
      <div
        style={{
          maxWidth: '393px',
          margin: '0 auto',
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
          GIA ĐÌNH
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            marginBottom: '8px',
            lineHeight: '1.3',
          }}
        >
          Mời người thân cùng tham gia
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: '#9D9FA3',
            lineHeight: '1.5',
            marginBottom: '24px',
          }}
        >
          Người thân sẽ thấy lịch rủi ro và hướng dẫn chuẩn bị tại nhà — không thấy dữ liệu check-in của bạn.
        </p>

        {/* QR Code Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          {/* QR Code */}
          <div
            style={{
              width: '180px',
              height: '180px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              // Placeholder QR code pattern
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                <rect width="180" height="180" fill="white"/>
                <rect x="20" y="20" width="40" height="40" fill="#041E3A"/>
                <rect x="70" y="20" width="10" height="10" fill="#041E3A"/>
                <rect x="90" y="20" width="10" height="10" fill="#041E3A"/>
                <rect x="120" y="20" width="40" height="40" fill="#041E3A"/>
                <rect x="30" y="30" width="20" height="20" fill="white"/>
                <rect x="130" y="30" width="20" height="20" fill="white"/>
                <rect x="20" y="70" width="10" height="10" fill="#041E3A"/>
                <rect x="40" y="70" width="10" height="10" fill="#041E3A"/>
                <rect x="60" y="70" width="10" height="10" fill="#041E3A"/>
                <rect x="80" y="70" width="30" height="30" fill="#041E3A"/>
                <rect x="120" y="70" width="10" height="10" fill="#041E3A"/>
                <rect x="140" y="70" width="10" height="10" fill="#041E3A"/>
                <rect x="160" y="70" width="10" height="10" fill="#041E3A"/>
                <rect x="20" y="90" width="10" height="10" fill="#041E3A"/>
                <rect x="120" y="90" width="10" height="10" fill="#041E3A"/>
                <rect x="20" y="120" width="40" height="40" fill="#041E3A"/>
                <rect x="70" y="120" width="10" height="10" fill="#041E3A"/>
                <rect x="90" y="120" width="10" height="10" fill="#041E3A"/>
                <rect x="110" y="120" width="10" height="10" fill="#041E3A"/>
                <rect x="130" y="120" width="10" height="10" fill="#041E3A"/>
                <rect x="150" y="120" width="10" height="10" fill="#041E3A"/>
                <rect x="30" y="130" width="20" height="20" fill="white"/>
                <rect x="70" y="140" width="10" height="10" fill="#041E3A"/>
                <rect x="110" y="140" width="10" height="10" fill="#041E3A"/>
                <rect x="130" y="140" width="10" height="10" fill="#041E3A"/>
                <rect x="150" y="140" width="10" height="10" fill="#041E3A"/>
              </svg>
            )}
          </div>

          {/* QR instruction */}
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 400,
              color: '#9D9FA3',
              textAlign: 'center',
              margin: 0,
              lineHeight: '1.5',
            }}
          >
            Quét mã hoặc gửi link bên dưới
          </p>
        </div>

        {/* Invite Link Row */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          {/* Truncated link */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#9D9FA3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              lineHeight: '1.0',
            }}
          >
            {getTruncatedUrl()}
          </span>

          {/* Copy button */}
          <button
            onClick={handleCopyLink}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: copyStatus === 'copied' ? '#059669' : '#041E3A',
              border: `1px solid ${copyStatus === 'copied' ? '#059669' : '#041E3A'}`,
              borderRadius: '2px',
              padding: '4px 8px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              lineHeight: '1.0',
              letterSpacing: '0.05em',
            }}
          >
            {copyStatus === 'copied' ? 'Đã sao chép ✓' : 'Sao chép'}
          </button>
        </div>

        {/* Expiry note */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            fontWeight: 400,
            color: '#9D9FA3',
            marginBottom: '24px',
            lineHeight: '1.4',
          }}
        >
          Link có hiệu lực trong 72 giờ.
        </p>

        {/* Share options */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {/* Zalo share */}
          <button
            onClick={handleShareZalo}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#041E3A',
              borderBottom: '1px solid #041E3A',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #041E3A',
              cursor: 'pointer',
              padding: 0,
              lineHeight: '1.5',
            }}
          >
            Gửi qua Zalo
          </button>

          {/* SMS share */}
          <button
            onClick={handleShareSMS}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#041E3A',
              borderBottom: '1px solid #041E3A',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #041E3A',
              cursor: 'pointer',
              padding: 0,
              lineHeight: '1.5',
            }}
          >
            Gửi qua tin nhắn
          </button>
        </div>

        {/* Continue/Done CTA */}
        {context === 'onboarding' && onContinue && (
          <button
            onClick={onContinue}
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
            Tiếp tục
          </button>
        )}

        {context === 'profile' && onDone && (
          <button
            onClick={onDone}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 400,
              color: '#9D9FA3',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              width: '100%',
              textAlign: 'center',
              lineHeight: '1.5',
            }}
          >
            Xong
          </button>
        )}
      </div>
    </div>
  );
}
