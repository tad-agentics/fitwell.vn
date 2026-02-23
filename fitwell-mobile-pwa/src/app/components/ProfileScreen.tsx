import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface ProfileScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

export function ProfileScreen({ onBack, onNavigate }: ProfileScreenProps) {
  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Full Name', value: 'Minh Nguyen' },
        { label: 'Date of Birth', value: '15 March 1985' },
        { label: 'Email', value: 'minh.nguyen@email.com' },
        { label: 'Phone', value: '+84 90 123 4567' }
      ]
    },
    {
      title: 'Medical Information',
      items: [
        { label: 'Primary Physician', value: 'Dr. Tran Van Anh' },
        { label: 'Hospital', value: 'Cho Ray Hospital' },
        { label: 'Blood Type', value: 'O+' },
        { label: 'Allergies', value: 'None reported' }
      ]
    },
    {
      title: 'Cài đặt chương trình',
      items: [
        { label: 'Ngày bắt đầu', value: '21 tháng 1, 2026' },
        { label: 'Thời lượng', value: '12 tuần' },
        { label: 'Tần suất check-in', value: 'Hàng tuần' },
        { label: 'Xét nghiệm máu tiếp theo', value: '18 tháng 3, 2026' }
      ]
    }
  ];

  const menuItems = [
    'Tùy chọn thông báo',
    'Quyền riêng tư & Dữ liệu',
    'Trợ giúp & Hỗ trợ',
    'Điều khoản dịch vụ'
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="pt-16 pb-6 px-6 flex items-center gap-4" style={{ borderBottom: '1px solid #e8e8eb' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ArrowLeft size={24} style={{ color: '#041E3A' }} />
        </button>
        <h1 
          className="fitwell-heading-secondary" 
          style={{ 
            color: '#041E3A',
            fontSize: '28px',
            fontWeight: '400',
            letterSpacing: '-0.019em'
          }}
        >
          Profile & Settings
        </h1>
      </div>

      {/* Quick navigation buttons */}
      <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => onNavigate?.('profileSettings')}
          style={{
            flex: 1,
            padding: '14px 16px',
            backgroundColor: '#041E3A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Chi tiết cài đặt
        </button>
        <button
          onClick={() => onNavigate?.('householdHome')}
          style={{
            flex: 1,
            padding: '14px 16px',
            backgroundColor: '#F5F5F5',
            color: '#041E3A',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Xem chế độ Household
        </button>
      </div>

      {/* Profile Sections */}
      <div className="flex-1 overflow-y-auto">
        {profileSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="px-6 py-4" style={{ backgroundColor: '#f8f8f9' }}>
              <span 
                className="fitwell-label" 
                style={{ 
                  color: '#6b6d7a',
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                {section.title}
              </span>
            </div>
            
            <div className="px-6 py-4 space-y-5">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div 
                    className="fitwell-body-small mb-1" 
                    style={{ 
                      color: '#9a9ba5',
                      fontSize: '13px',
                      fontWeight: '400'
                    }}
                  >
                    {item.label}
                  </div>
                  <div 
                    className="fitwell-body" 
                    style={{ 
                      color: '#041E3A',
                      fontSize: '15px',
                      fontWeight: '400'
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Menu Items */}
        <div className="px-6 pt-6 pb-4">
          <div className="mb-4">
            <span 
              className="fitwell-label" 
              style={{ 
                color: '#6b6d7a',
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              Settings
            </span>
          </div>
          
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full p-4 flex items-center justify-between"
                style={{
                  background: 'none',
                  border: '1px solid #e8e8eb',
                  cursor: 'pointer'
                }}
              >
                <span 
                  className="fitwell-body" 
                  style={{ 
                    color: '#041E3A',
                    fontSize: '15px',
                    fontWeight: '400'
                  }}
                >
                  {item}
                </span>
                <ChevronRight size={20} style={{ color: '#9a9ba5' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="px-6 py-8">
          <button
            className="w-full p-4"
            style={{
              background: 'none',
              border: '1px solid #041E3A',
              color: '#041E3A',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '400'
            }}
          >
            <span className="fitwell-body">Sign Out</span>
          </button>
        </div>

        {/* App Info */}
        <div className="px-6 pb-8 text-center">
          <div 
            className="fitwell-body-small mb-1" 
            style={{ 
              color: '#9a9ba5',
              fontSize: '13px',
              fontWeight: '400'
            }}
          >
            FitWell Health Recovery
          </div>
          <div 
            className="fitwell-body-small" 
            style={{ 
              color: '#9a9ba5',
              fontSize: '13px',
              fontWeight: '400'
            }}
          >
            Version 1.0.2
          </div>
        </div>
      </div>
    </div>
  );
}
