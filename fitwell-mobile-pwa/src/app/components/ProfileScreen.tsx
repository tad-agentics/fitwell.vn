import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface ProfileScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

export function ProfileScreen({ onBack, onNavigate }: ProfileScreenProps) {
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);

  const displayName = profile?.email?.split('@')[0] ?? 'User';

  const profileSections = [
    {
      title: 'Thông tin cá nhân',
      items: [
        { label: 'Email', value: profile?.email ?? '—' },
        { label: 'Ngôn ngữ', value: profile?.language === 'en' ? 'English' : 'Tiếng Việt' },
      ],
    },
    {
      title: 'Cài đặt chương trình',
      items: [
        {
          label: 'Tình trạng',
          value:
            profile?.primary_conditions?.length
              ? profile.primary_conditions.join(', ')
              : 'Chưa khai báo',
        },
        {
          label: 'Ngày bắt đầu',
          value: profile?.created_at
            ? new Date(profile.created_at).toLocaleDateString('vi-VN')
            : '—',
        },
      ],
    },
  ];

  const menuItems = [
    'Tùy chọn thông báo',
    'Quyền riêng tư & Dữ liệu',
    'Trợ giúp & Hỗ trợ',
    'Điều khoản dịch vụ',
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div
        className="pt-16 pb-6 px-6 flex items-center gap-4"
        style={{ borderBottom: '1px solid #e8e8eb' }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowLeft size={24} style={{ color: '#041E3A' }} />
        </button>
        <h1
          style={{
            color: '#041E3A',
            fontSize: '28px',
            fontWeight: '400',
            letterSpacing: '-0.019em',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {displayName}
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
                style={{
                  color: '#6b6d7a',
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {section.title}
              </span>
            </div>

            <div className="px-6 py-4 space-y-5">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div
                    style={{
                      color: '#9a9ba5',
                      fontSize: '13px',
                      fontWeight: '400',
                      fontFamily: 'var(--font-ui)',
                      marginBottom: '4px',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      color: '#041E3A',
                      fontSize: '15px',
                      fontWeight: '400',
                      fontFamily: 'var(--font-ui)',
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
              style={{
                color: '#6b6d7a',
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Cài đặt
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
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    color: '#041E3A',
                    fontSize: '15px',
                    fontWeight: '400',
                    fontFamily: 'var(--font-ui)',
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
            onClick={signOut}
            className="w-full p-4"
            style={{
              background: 'none',
              border: '1px solid #041E3A',
              color: '#041E3A',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '400',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Đăng xuất
          </button>
        </div>

        {/* App Info */}
        <div className="px-6 pb-8 text-center">
          <div
            style={{
              color: '#9a9ba5',
              fontSize: '13px',
              fontWeight: '400',
              fontFamily: 'var(--font-ui)',
              marginBottom: '4px',
            }}
          >
            FitWell Health Recovery
          </div>
          <div
            style={{
              color: '#9a9ba5',
              fontSize: '13px',
              fontWeight: '400',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Version 2.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
