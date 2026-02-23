import React from 'react';

interface HouseholdPartnerHomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HouseholdPartnerHomeScreen({
  onNavigate,
}: HouseholdPartnerHomeScreenProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
        paddingBottom: '72px', // Bottom nav clearance
      }}
    >
      <div style={{ padding: '40px 20px 32px' }}>
        {/* User context indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#8C693B',
            padding: '6px 12px',
            borderRadius: '2px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 400,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            HOUSEHOLD PARTNER
          </div>
        </div>

        {/* Section: TUẦN NÀY */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '16px',
            }}
          >
            TUẦN NÀY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Risk item 1 - Medium */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: '1.3',
                  }}
                >
                  Thứ Tư: bữa tối công việc
                </div>
              </div>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#D97706',
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Risk item 2 - High */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: '1.3',
                  }}
                >
                  Thứ Năm: nhậu (rủi ro cao)
                </div>
              </div>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  flexShrink: 0,
                }}
              />
            </div>
          </div>
        </div>

        {/* Section: CHUẨN BỊ TẠI NHÀ */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '16px',
            }}
          >
            CHUẨN BỊ TẠI NHÀ
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '24px 20px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Trữ */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: '1.4',
                    marginBottom: '6px',
                  }}
                >
                  Trữ: nước khoáng, rau xanh, đậu hũ
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                    lineHeight: '1.5',
                  }}
                >
                  H��� trợ phục hồi sau sự kiện Thứ Năm
                </div>
              </div>

              {/* Tránh mua */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#DC2626',
                    lineHeight: '1.4',
                    marginBottom: '6px',
                  }}
                >
                  Tránh mua: nội tạng, đồ ăn chế biến
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                    lineHeight: '1.5',
                  }}
                >
                  Gây tổn thương gan khi kết hợp với rượu
                </div>
              </div>

              {/* Sáng Thứ Sáu */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: '1.4',
                    marginBottom: '6px',
                  }}
                >
                  Sáng Thứ Sáu: cháo hoặc súp nhẹ nếu cần
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                    lineHeight: '1.5',
                  }}
                >
                  Dễ tiêu hóa, giúp dạ dày phục hồi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: TUẦN TRƯỚC */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '16px',
            }}
          >
            TUẦN TRƯỚC
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
              }}
            >
              {/* Check-ins completed */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: '1.2',
                    marginBottom: '4px',
                  }}
                >
                  12/14
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                  }}
                >
                  Check-ins
                </div>
              </div>

              {/* Actions completed */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: '1.2',
                    marginBottom: '4px',
                  }}
                >
                  18
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                  }}
                >
                  Hành động
                </div>
              </div>

              {/* Risk events */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: '1.2',
                    marginBottom: '4px',
                  }}
                >
                  2
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                  }}
                >
                  Sự kiện cao
                </div>
              </div>

              {/* Recovery score */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#059669',
                    lineHeight: '1.2',
                    marginBottom: '4px',
                  }}
                >
                  85%
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                  }}
                >
                  Phục hồi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
