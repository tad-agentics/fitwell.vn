import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface RecoveryPlanScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

export function RecoveryPlanScreen({ onBack, onNavigate }: RecoveryPlanScreenProps) {
  const weeklyGuidance = [
    {
      category: 'DINH DƯỠNG',
      recommendations: [
        'Giảm khẩu phần cơm trắng đi một phần ba',
        'Thêm rau luộc vào bữa trưa và tối',
        'Thay đồ uống có đường bằng trà không đường',
        'Chỉ uống rượu vào cuối tuần'
      ]
    },
    {
      category: 'VAN ĐỘNG',
      recommendations: [
        'Đi bộ 20 phút sau bữa tối, 5 ngày/tuần',
        'Đi cầu thang thay vì thang máy khi có thể',
        'Đứng dậy và duỗi người mỗi 90 phút khi làm việc'
      ]
    },
    {
      category: 'NGHỈ NGƠI',
      recommendations: [
        'Giữ giờ ngủ đều đặn (23:00 - 06:00)',
        'Không dùng màn hình 30 phút trước khi ngủ',
        'Giữ phòng ngủ mát mẻ'
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#FFFFFF', paddingBottom: '72px' }}>
      {/* Header */}
      <div className="pt-16 pb-6 px-6" style={{ borderBottom: '1px solid #EBEBF0' }}>
        <h1 
          className="fitwell-heading-secondary" 
          style={{ 
            color: '#041E3A',
            fontSize: '28px',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            lineHeight: '1.3',
            letterSpacing: '0',
            margin: 0
          }}
        >
          Kế Hoạch Phục Hồi
        </h1>
      </div>

      {/* Week Info */}
      <div className="px-6 py-6" style={{ borderBottom: '1px solid #EBEBF0' }}>
        <div className="mb-1">
          <span 
            className="fitwell-label" 
            style={{ 
              color: '#9D9FA3',
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              lineHeight: '1.0'
            }}
          >
            TUẦN HIỆN TẠI
          </span>
        </div>
        <div 
          className="fitwell-heading-tertiary mb-2" 
          style={{ 
            color: '#041E3A',
            fontSize: '22px',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            lineHeight: '1.3',
            letterSpacing: '0'
          }}
        >
          Tuần 4 / 12
        </div>
        <div 
          className="fitwell-body" 
          style={{ 
            color: '#9D9FA3',
            fontSize: '15px',
            fontWeight: 400,
            fontFamily: 'var(--font-ui)',
            lineHeight: '1.5'
          }}
        >
          Xây dựng tính nhất quán với thói quen nền tảng
        </div>
        
        {/* Quick action buttons */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onNavigate?.('recoveryActive')}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: '#041E3A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Ngày Phục Hồi 1
          </button>
          <button
            onClick={() => onNavigate?.('recoveryPaywall')}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: '#F5F5F5',
              color: '#041E3A',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Ngày 2 (Khoá)
          </button>
        </div>
      </div>

      {/* Guidance Sections */}
      <div className="flex-1 overflow-y-auto pb-6">
        {weeklyGuidance.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="px-6 py-5" style={{ backgroundColor: '#F5F5F5' }}>
              <span 
                className="fitwell-label" 
                style={{ 
                  color: '#9D9FA3',
                  fontSize: '10px',
                  fontWeight: 400,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: '1.0'
                }}
              >
                {section.category}
              </span>
            </div>
            
            <div className="px-6 py-6 space-y-5">
              {section.recommendations.map((rec, recIndex) => (
                <div key={recIndex} className="flex gap-4">
                  <div 
                    className="flex-shrink-0 mt-1.5"
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#041E3A'
                    }}
                  />
                  <div 
                    className="flex-1 fitwell-body" 
                    style={{ 
                      color: '#041E3A',
                      fontSize: '15px',
                      fontWeight: 400,
                      lineHeight: '1.5',
                      fontFamily: 'var(--font-ui)'
                    }}
                  >
                    {rec}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Principle */}
        <div className="px-6 py-8 mt-4" style={{ borderTop: '1px solid #EBEBF0' }}>
          <div className="mb-3">
            <span 
              className="fitwell-label" 
              style={{ 
                color: '#9D9FA3',
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                lineHeight: '1.0'
              }}
            >
              NGUYÊN TẮC PHỤC HỒI
            </span>
          </div>
          <div 
            className="fitwell-body-large" 
            style={{ 
              color: '#041E3A', 
              lineHeight: '1.6',
              fontSize: '17px',
              fontWeight: 400,
              fontFamily: 'var(--font-ui)'
            }}
          >
            "Những thay đổi nhỏ, nhất quán sẽ tích lũy theo thời gian. Tập trung vào những gì bạn có thể duy trì, không phải những gì nghe có vẻ ấn tượng."
          </div>
        </div>

        {/* Professional Note */}
        <div 
          className="mx-6 p-5 mb-6"
          style={{ 
            backgroundColor: '#F5F5F5',
            border: '1px solid #EBEBF0',
            borderRadius: '4px'
          }}
        >
          <div className="mb-2">
            <span 
              className="fitwell-label" 
              style={{ 
                color: '#9D9FA3',
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                lineHeight: '1.0'
              }}
            >
              HƯỚNG DẪN Y KHOA
            </span>
          </div>
          <div 
            className="fitwell-body-small" 
            style={{ 
              color: '#9D9FA3', 
              lineHeight: '1.5',
              fontSize: '13px',
              fontWeight: 400,
              fontFamily: 'var(--font-ui)'
            }}
          >
            Kế hoạch này được thiết kế để bổ trợ cho điều trị y tế. Tiếp tục dùng tất cả thuốc được kê đơn và tham khảo bác sĩ trước khi thay đổi lối sống đáng kể.
          </div>
        </div>
      </div>
    </div>
  );
}
