import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface PricingScreenProps {
  onNavigate: (screen: string) => void;
  onSelectPlan: (planId: string) => void;
  highlightedPlanId?: string; // For deep-linking from paywall
  currentPlan?: 'free' | 'individual-quarterly' | 'individual-annual' | 'household-annual'; // User's current plan
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: {
    text: string;
    color: string;
    bgColor: string;
  };
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'individual-quarterly',
    name: 'Cá nhân',
    price: '490,000',
    period: 'quý',
    features: [
      'Check-in sáng + tối hàng ngày',
      'Kho hành động 60+ micro-actions',
      'Kịch bản xã hội (nhậu, tiệc, du lịch)',
      'Tuần này — tổng quan tuần',
    ],
  },
  {
    id: 'individual-annual',
    name: 'Cá nhân (năm)',
    price: '1,490,000',
    period: 'năm',
    badge: {
      text: 'TIẾT KIỆM NHẤT',
      color: '#059669',
      bgColor: '#F0FDF4',
    },
    features: [
      'Tất cả tính năng gói quý',
      'Tiết kiệm 33% so với thanh toán theo quý',
      'Theo dõi xu hướng 12 tháng',
      'Ưu tiên hỗ trợ',
    ],
  },
  {
    id: 'household-annual',
    name: 'Household (năm)',
    price: '2,490,000',
    period: 'năm',
    badge: {
      text: 'GIA ĐÌNH',
      color: '#FFFFFF',
      bgColor: '#8C693B',
    },
    features: [
      'Tất cả tính năng gói cá nhân',
      '1 tài khoản chính + 1 tài khoản hỗ trợ',
      'Chế độ xem Household Partner',
      'Gợi ý chuẩn bị tại nhà',
      'Chia sẻ lịch sự kiện rủi ro',
    ],
  },
];

// Free vs Paid feature comparison data
const FEATURE_COMPARISON = [
  { feature: 'Check-in sáng + tối', free: true, paid: true },
  { feature: 'Kho hành động micro-actions', free: false, paid: true },
  { feature: 'Kịch bản xã hội (nhậu, tiệc, du lịch)', free: false, paid: true },
  { feature: 'Tuần này — tổng quan tuần', free: false, paid: true },
  { feature: 'Giao thức phục hồi 3 ngày', free: '1 ngày', paid: '3 ngày đầy đủ' },
  { feature: 'Tìm kiếm kịch bản', free: false, paid: true },
];

export function PricingScreen({
  onNavigate,
  onSelectPlan,
  highlightedPlanId,
  currentPlan = 'free',
}: PricingScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(highlightedPlanId || null);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
        paddingBottom: '72px',
      }}
    >
      <div style={{ padding: '40px 20px 32px' }}>
        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            lineHeight: '1.3',
            margin: '0 0 8px 0',
          }}
        >
          Chọn gói phù hợp
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: '#9D9FA3',
            lineHeight: '1.5',
            margin: '0 0 24px 0',
          }}
        >
          {currentPlan === 'free'
            ? 'Bạn đang dùng gói miễn phí'
            : 'So sánh tính năng và chọn gói phù hợp nhất'}
        </p>

        {/* Free vs Paid Comparison Table */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            marginBottom: '32px',
            overflow: 'hidden',
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 100px',
              padding: '16px 20px',
              borderBottom: '1px solid #EBEBF0',
              backgroundColor: '#F5F5F5',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 400,
                textTransform: 'uppercase',
                color: '#9D9FA3',
                letterSpacing: '0.05em',
                lineHeight: '1.0',
              }}
            >
              TÍNH NĂNG
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 400,
                textTransform: 'uppercase',
                color: '#9D9FA3',
                letterSpacing: '0.05em',
                textAlign: 'center',
                lineHeight: '1.0',
              }}
            >
              MIỄN PHÍ
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 400,
                textTransform: 'uppercase',
                color: '#041E3A',
                letterSpacing: '0.05em',
                textAlign: 'center',
                lineHeight: '1.0',
              }}
            >
              PREMIUM
            </div>
          </div>

          {/* Table rows */}
          {FEATURE_COMPARISON.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 100px',
                padding: '16px 20px',
                borderBottom: index < FEATURE_COMPARISON.length - 1 ? '1px solid #EBEBF0' : 'none',
                alignItems: 'center',
              }}
            >
              {/* Feature name */}
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#041E3A',
                  lineHeight: '1.5',
                }}
              >
                {item.feature}
              </div>

              {/* Free column */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {typeof item.free === 'boolean' ? (
                  item.free ? (
                    <Check size={16} style={{ color: '#059669', strokeWidth: 2 }} />
                  ) : (
                    <X size={16} style={{ color: '#EBEBF0', strokeWidth: 2 }} />
                  )
                ) : (
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                      textAlign: 'center',
                      lineHeight: '1.4',
                    }}
                  >
                    {item.free}
                  </div>
                )}
              </div>

              {/* Paid column */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {typeof item.paid === 'boolean' ? (
                  item.paid ? (
                    <Check size={16} style={{ color: '#059669', strokeWidth: 2 }} />
                  ) : (
                    <X size={16} style={{ color: '#EBEBF0', strokeWidth: 2 }} />
                  )
                ) : (
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#041E3A',
                      textAlign: 'center',
                      lineHeight: '1.4',
                    }}
                  >
                    {item.paid}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Plan selection eyebrow */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 400,
            textTransform: 'uppercase',
            color: '#9D9FA3',
            letterSpacing: '0.05em',
            marginBottom: '12px',
            lineHeight: '1.0',
          }}
        >
          GÓI PREMIUM
        </div>

        {/* Plan cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isCurrent = currentPlan === plan.id;
            const isHighlighted = highlightedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: isSelected
                    ? '2px solid #041E3A'
                    : isHighlighted
                    ? '2px solid #D97706'
                    : '1px solid #EBEBF0',
                  borderRadius: '4px',
                  padding: '24px',
                  position: 'relative',
                }}
              >
                {/* Current plan badge */}
                {isCurrent && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#F0F4F8',
                      padding: '4px 8px',
                      borderRadius: '2px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        fontWeight: 400,
                        color: '#041E3A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        lineHeight: '1.0',
                      }}
                    >
                      GÓI HIỆN TẠI
                    </div>
                  </div>
                )}

                {/* Badge */}
                {plan.badge && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: plan.badge.bgColor,
                      padding: '4px 8px',
                      borderRadius: '2px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        fontWeight: 400,
                        color: plan.badge.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        lineHeight: '1.0',
                      }}
                    >
                      {plan.badge.text}
                    </div>
                  </div>
                )}

                {/* Plan name */}
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#041E3A',
                    marginBottom: '8px',
                    lineHeight: '1.5',
                  }}
                >
                  {plan.name}
                </div>

                {/* Price */}
                <div style={{ marginBottom: '20px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '28px',
                      fontWeight: 600,
                      color: '#041E3A',
                      lineHeight: '1.2',
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '15px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                      marginLeft: '6px',
                      lineHeight: '1.5',
                    }}
                  >
                    VND/{plan.period}
                  </span>
                </div>

                {/* Features */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #EBEBF0',
                  }}
                >
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Checkmark */}
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" fill="#059669" />
                          <path
                            d="M5 8L7 10L11 6"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Feature text */}
                      <div
                        style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '13px',
                          fontWeight: 400,
                          color: '#041E3A',
                          lineHeight: '1.5',
                        }}
                      >
                        {feature}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Select button */}
                <button
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    onSelectPlan(plan.id);
                  }}
                  disabled={isCurrent}
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: isCurrent
                      ? '#F5F5F5'
                      : isSelected
                      ? '#041E3A'
                      : '#FFFFFF',
                    border: isCurrent
                      ? '1px solid #EBEBF0'
                      : isSelected
                      ? 'none'
                      : '1px solid #EBEBF0',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: isCurrent ? '#9D9FA3' : isSelected ? '#FFFFFF' : '#041E3A',
                    cursor: isCurrent ? 'not-allowed' : 'pointer',
                    transition: 'all 120ms ease-out',
                    lineHeight: '1.5',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !isCurrent) {
                      e.currentTarget.style.backgroundColor = '#F0F4F8';
                      e.currentTarget.style.borderColor = '#041E3A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !isCurrent) {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#EBEBF0';
                    }
                  }}
                >
                  {isCurrent ? 'Gói hiện tại' : isSelected ? 'Đã chọn' : 'Chọn gói này'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Recovery Box add-on section */}
        <div
          style={{
            marginTop: '40px',
          }}
        >
          {/* Section eyebrow */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: '#9D9FA3',
              letterSpacing: '0.05em',
              marginBottom: '12px',
              lineHeight: '1.0',
            }}
          >
            BỔ SUNG
          </div>

          {/* Recovery Box card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '24px',
            }}
          >
            {/* Recovery Box badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#F0F4F8',
                padding: '4px 8px',
                borderRadius: '2px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 400,
                  color: '#041E3A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '1.0',
                }}
              >
                RECOVERY BOX
              </div>
            </div>

            {/* Name */}
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '17px',
                fontWeight: 600,
                color: '#041E3A',
                marginBottom: '8px',
                lineHeight: '1.5',
              }}
            >
              Hộp phục hồi vật lý
            </div>

            {/* Description */}
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#9D9FA3',
                lineHeight: '1.5',
                marginBottom: '16px',
              }}
            >
              Gồm: thuốc bổ gan, viên uống điện giải, trà thảo mộc, hướng dẫn sử dụng. Giao hàng
              hàng tháng.
            </div>

            {/* Price */}
            <div
              style={{
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #EBEBF0',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#041E3A',
                  lineHeight: '1.3',
                }}
              >
                +350,000
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#9D9FA3',
                  marginLeft: '6px',
                  lineHeight: '1.5',
                }}
              >
                VND/tháng
              </span>
            </div>

            {/* What's included */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              {[
                'Viên bổ gan milk thistle (30 viên)',
                'Viên điện giải hydration (20 gói)',
                'Trà thảo mộc detox (15 túi lọc)',
                'Hướng dẫn sử dụng theo giao thức',
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Checkmark */}
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    <Check size={16} style={{ color: '#059669', strokeWidth: 2 }} />
                  </div>

                  {/* Item text */}
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#041E3A',
                      lineHeight: '1.5',
                    }}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>

            {/* Add-on button */}
            <button
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #041E3A',
                borderRadius: '4px',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#041E3A',
                cursor: 'pointer',
                transition: 'all 120ms ease-out',
                lineHeight: '1.5',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F4F8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              Thêm vào gói
            </button>
          </div>
        </div>

        {/* Continue button */}
        {selectedPlan && (
          <button
            onClick={() => onNavigate('home')}
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
              marginTop: '32px',
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
            TIẾP TỤC
          </button>
        )}
      </div>
    </div>
  );
}
