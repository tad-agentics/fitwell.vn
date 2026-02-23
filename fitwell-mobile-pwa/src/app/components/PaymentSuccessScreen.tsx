import React from 'react';
import { Check } from 'lucide-react';
import { useSubscription } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

interface PaymentSuccessScreenProps {
  onNavigate: (screen: string) => void;
}

const PLAN_NAMES: Record<string, string> = {
  individual_monthly: 'GÓI CÁ NHÂN — THÁNG',
  individual_quarterly: 'GÓI CÁ NHÂN — QUÝ',
  household_annual: 'GÓI GIA ĐÌNH — NĂM',
};

const PLAN_FEATURES: Record<string, string[]> = {
  individual_monthly: ['Kế hoạch phục hồi 12 tuần', 'Kịch bản không giới hạn', 'Theo dõi tiến độ'],
  individual_quarterly: ['Kế hoạch phục hồi 12 tuần', 'Kịch bản không giới hạn', 'Theo dõi tiến độ', 'Báo cáo tuần nâng cao'],
  household_annual: ['Tất cả tính năng cá nhân', 'Household Partner view', 'Chuẩn bị tại nhà cho người thân'],
};

function formatPrice(amount: number, currency: string): string {
  if (currency === 'VND') {
    return `${amount.toLocaleString('vi-VN')}₫`;
  }
  return `${amount} ${currency}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

export function PaymentSuccessScreen({ onNavigate }: PaymentSuccessScreenProps) {
  const session = useAuthStore((s) => s.session);
  const { data: subscription } = useSubscription(session?.user?.id);

  const planName = subscription
    ? (PLAN_NAMES[subscription.plan] ?? subscription.plan.toUpperCase())
    : 'GÓI CÁ NHÂN';
  const price = subscription
    ? formatPrice(subscription.amount, subscription.currency)
    : '';
  const validUntil = subscription?.expires_at
    ? formatDate(subscription.expires_at)
    : '';
  const features = subscription
    ? (PLAN_FEATURES[subscription.plan] ?? PLAN_FEATURES.individual_monthly)
    : PLAN_FEATURES.individual_monthly;

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
        {/* Success icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <Check size={32} style={{ color: '#FFFFFF', strokeWidth: 2 }} />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '28px',
            fontWeight: 600,
            color: '#041E3A',
            textAlign: 'center',
            marginBottom: '16px',
            lineHeight: '1.3',
          }}
        >
          Thanh toán thành công
        </h1>

        {/* Plan confirmation card */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: '#041E3A',
              letterSpacing: '0.08em',
              marginBottom: '8px',
              lineHeight: '1.0',
            }}
          >
            {planName}
          </div>

          {price && (
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '22px',
                fontWeight: 600,
                color: '#041E3A',
                marginBottom: '4px',
                lineHeight: '1.3',
              }}
            >
              {price}
            </div>
          )}

          {validUntil && (
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#9D9FA3',
                marginBottom: '16px',
                lineHeight: '1.5',
              }}
            >
              Có hiệu lực đến {validUntil}
            </div>
          )}

          <div style={{ height: '1px', backgroundColor: '#EBEBF0', marginBottom: '16px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} style={{ color: '#059669', strokeWidth: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 400, color: '#041E3A', lineHeight: '1.5' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
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
          Bắt đầu sử dụng
        </button>

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
          Biên lai đã gửi qua email.
        </p>
      </div>
    </div>
  );
}
