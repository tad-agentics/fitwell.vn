import React from 'react';
import { Check } from 'lucide-react';

interface PaymentSuccessScreenProps {
  onNavigate: (screen: string) => void;
}

export function PaymentSuccessScreen({
  onNavigate,
}: PaymentSuccessScreenProps) {
  // Mock data
  const plan = {
    name: 'GÓI CÁ NHÂN — NĂM',
    price: '1,490,000₫/năm',
    validUntil: '22/02/2027',
    features: ['Kế hoạch phục hồi 12 tuần', 'Kịch bản không giới hạn', 'Theo dõi tiến độ']
  };
  const onContinue = () => onNavigate('home');
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
        {/* Success icon - circle with checkmark */}
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
          <Check
            size={32}
            style={{
              color: '#FFFFFF',
              strokeWidth: 2,
            }}
          />
        </div>

        {/* Headline */}
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
          {/* Plan name */}
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
            {plan.name}
          </div>

          {/* Price */}
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
            {plan.price}
          </div>

          {/* Validity */}
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
            Có hiệu lực đến {plan.validUntil}
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: '#EBEBF0',
              marginBottom: '16px',
            }}
          />

          {/* Unlocked features list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {plan.features.map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {/* Checkmark */}
                <Check
                  size={16}
                  style={{
                    color: '#059669',
                    strokeWidth: 2,
                    flexShrink: 0,
                  }}
                />

                {/* Feature text */}
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#041E3A',
                    lineHeight: '1.5',
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
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
            marginBottom: '16px',
          }}
        >
          Bắt đầu sử dụng
        </button>

        {/* Receipt note */}
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
