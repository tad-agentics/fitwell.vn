import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface HouseholdInviteStateScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export function HouseholdInviteStateScreen({
  onBack,
  onNavigate,
}: HouseholdInviteStateScreenProps) {
  const [copied, setCopied] = useState(false);
  
  // Mock data
  const inviteLink = 'https://fitwell.vn/invite/a3x7k';
  const partnerName = undefined;
  const inviteStatus = 'pending' as 'pending' | 'accepted';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ padding: '40px 20px 32px' }}>
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
          HOUSEHOLD PLAN
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '28px',
            fontWeight: 600,
            color: '#041E3A',
            lineHeight: '1.3',
            letterSpacing: '-0.019em',
            marginBottom: '12px',
          }}
        >
          {inviteStatus === 'pending' ? 'Mời người đồng hành' : 'Người đồng hành'}
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '17px',
            fontWeight: 400,
            color: '#9D9FA3',
            lineHeight: '1.6',
            margin: 0,
          }}
        >
          {inviteStatus === 'pending'
            ? 'Chia sẻ link này với người thân để họ xem lịch rủi ro và gợi ý chuẩn bị.'
            : `${partnerName} đã tham gia và có thể xem lịch rủi ro tuần này.`}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px 40px' }}>
        {inviteStatus === 'pending' ? (
          <>
            {/* Invite link card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 400,
                  color: '#9D9FA3',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                INVITE LINK
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#041E3A',
                  lineHeight: '1.5',
                  wordBreak: 'break-all',
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '4px',
                }}
              >
                {inviteLink}
              </div>

              <button
                onClick={handleCopyLink}
                style={{
                  width: '100%',
                  backgroundColor: copied ? '#059669' : '#041E3A',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '14px 20px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 120ms ease-out',
                }}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Sao chép link
                  </>
                )}
              </button>
            </div>

            {/* Status indicator */}
            <div
              style={{
                backgroundColor: 'rgba(217, 119, 6, 0.08)',
                border: '1px solid rgba(217, 119, 6, 0.2)',
                borderRadius: '4px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#D97706',
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#92400E',
                  lineHeight: '1.5',
                }}
              >
                Đang chờ người đồng hành tham gia
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Partner joined card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                padding: '24px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#041E3A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '20px',
                    fontWeight: 600,
                  }}
                >
                  {partnerName?.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#041E3A',
                      marginBottom: '4px',
                    }}
                  >
                    {partnerName}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    HOUSEHOLD PARTNER
                  </div>
                </div>

                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={14} style={{ color: '#FFFFFF' }} />
                </div>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#9D9FA3',
                  lineHeight: '1.5',
                }}
              >
                Có thể xem lịch rủi ro tuần này và nhận gợi ý chuẩn bị.
              </div>
            </div>

            {/* Success indicator */}
            <div
              style={{
                backgroundColor: 'rgba(5, 150, 105, 0.08)',
                border: '1px solid rgba(5, 150, 105, 0.2)',
                borderRadius: '4px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#065F46',
                  lineHeight: '1.5',
                }}
              >
                Đã kết nối — Household Plan đang hoạt động
              </div>
            </div>
          </>
        )}
      </div>

      {/* Back button */}
      <div style={{ padding: '0 20px 40px' }}>
        <button
          onClick={onBack}
          style={{
            width: '100%',
            background: 'none',
            border: '1px solid #EBEBF0',
            color: '#041E3A',
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            padding: '16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
