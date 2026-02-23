import React from 'react';
import { useHousehold, useCheckins } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

interface HouseholdPartnerHomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HouseholdPartnerHomeScreen({ onNavigate }: HouseholdPartnerHomeScreenProps) {
  const session = useAuthStore((s) => s.session);
  const userId = session?.user?.id;
  const { data: household } = useHousehold(userId);
  const { data: recentCheckins } = useCheckins(household?.owner_id, 30);

  // Derive metrics from check-in data
  const checkinCount = recentCheckins?.length ?? 0;
  const heavyEvents = recentCheckins?.filter((c) => c.event_intensity === 'heavy').length ?? 0;

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

          <div className="fw-card">
            <div className="fw-body-m fw-text-grey">
              Thông tin lịch rủi ro sẽ được cập nhật khi người thân hoàn thành check-in.
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
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 600, color: '#041E3A', lineHeight: '1.4', marginBottom: '6px' }}>
                  Trữ: nước khoáng, rau xanh, đậu hũ
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 400, color: '#9D9FA3', lineHeight: '1.5' }}>
                  Hỗ trợ phục hồi sau sự kiện
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 600, color: '#DC2626', lineHeight: '1.4', marginBottom: '6px' }}>
                  Tránh mua: nội tạng, đồ ăn chế biến
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 400, color: '#9D9FA3', lineHeight: '1.5' }}>
                  Gây tổn thương gan khi kết hợp với rượu
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 600, color: '#041E3A', lineHeight: '1.4', marginBottom: '6px' }}>
                  Sáng hôm sau: cháo hoặc súp nhẹ nếu cần
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 400, color: '#9D9FA3', lineHeight: '1.5' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '28px', fontWeight: 600, color: '#041E3A', lineHeight: '1.2', marginBottom: '4px' }}>
                  {checkinCount}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 400, color: '#9D9FA3' }}>
                  Check-ins
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '28px', fontWeight: 600, color: '#041E3A', lineHeight: '1.2', marginBottom: '4px' }}>
                  {heavyEvents}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 400, color: '#9D9FA3' }}>
                  Sự kiện cao
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
