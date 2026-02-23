import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useBiomarkers, useUpdateProfile } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import type { Language, ConditionType } from '@/types';

interface ProfileSettingsScreenProps {
  onNavigate: (screen: string) => void;
}

const CONDITION_LABELS: Record<ConditionType, string> = {
  gout: 'Axit uric',
  cholesterol: 'Mỡ máu',
  back_pain: 'Đau lưng',
  unsure: 'Chưa chắc',
};

const MARKER_LABELS: Record<string, string> = {
  'uric-acid': 'Axit uric',
  triglycerides: 'Mỡ máu (Triglyceride)',
  ast: 'Men gan (AST)',
  alt: 'Men gan (ALT)',
  hba1c: 'HbA1c',
  hdl: 'HDL',
  ldl: 'LDL Cholesterol',
  'fasting-glucose': 'Đường huyết (Glucose)',
};

export function ProfileSettingsScreen({ onNavigate }: ProfileSettingsScreenProps) {
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const setProfile = useAuthStore((s) => s.setProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const userId = session?.user?.id;
  const { data: biomarkers } = useBiomarkers(userId);
  const updateProfile = useUpdateProfile();

  const displayName = profile?.email?.split('@')[0] ?? 'User';

  const handleLanguageChange = async (lang: Language) => {
    if (!userId) return;
    updateProfile.mutate(
      { userId, updates: { language: lang } },
      { onSuccess: (data) => setProfile(data as any) },
    );
  };

  const handleToggle = async (field: string, value: boolean) => {
    if (!userId) return;
    updateProfile.mutate(
      { userId, updates: { [field]: value } },
      { onSuccess: (data) => setProfile(data as any) },
    );
  };

  const handleMorningTimeChange = async (time: string) => {
    if (!userId) return;
    updateProfile.mutate(
      { userId, updates: { morning_time: time } },
      { onSuccess: (data) => setProfile(data as any) },
    );
  };

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
        {/* User display name */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '28px',
              fontWeight: 600,
              color: '#041E3A',
              lineHeight: '1.3',
              margin: 0,
            }}
          >
            {displayName}
          </h1>
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#9D9FA3',
              marginTop: '4px',
            }}
          >
            {profile?.email ?? ''}
          </div>
        </div>

        {/* Section: Tình trạng sức khỏe */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
            }}
          >
            TÌNH TRẠNG
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {(profile?.primary_conditions ?? []).map((condition) => (
                <div
                  key={condition}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 400,
                    color: '#041E3A',
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #EBEBF0',
                    borderRadius: '2px',
                    padding: '6px 8px',
                  }}
                >
                  {CONDITION_LABELS[condition as ConditionType] ?? condition}
                </div>
              ))}
              {(!profile?.primary_conditions || profile.primary_conditions.length === 0) && (
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    color: '#9D9FA3',
                  }}
                >
                  Chưa khai báo
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('onboarding')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#041E3A',
                borderBottom: '1px solid #041E3A',
                lineHeight: '1.0',
              }}
            >
              Thay đổi
            </button>
          </div>
        </div>

        {/* Section: Kết quả xét nghiệm */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
            }}
          >
            KẾT QUẢ XÉT NGHIỆM
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '20px',
            }}
          >
            {biomarkers && biomarkers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {biomarkers.map((bm, i) => (
                  <div
                    key={bm.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      paddingBottom: i < biomarkers.length - 1 ? '16px' : undefined,
                      borderBottom: i < biomarkers.length - 1 ? '1px solid #EBEBF0' : undefined,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#041E3A',
                          marginBottom: '4px',
                        }}
                      >
                        {MARKER_LABELS[bm.marker_type] ?? bm.marker_type}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 400,
                          color: '#9D9FA3',
                        }}
                      >
                        {new Date(bm.recorded_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '17px',
                        fontWeight: 600,
                        color: '#041E3A',
                      }}
                    >
                      {bm.value} {bm.unit}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  color: '#9D9FA3',
                  lineHeight: '1.5',
                }}
              >
                Chưa có kết quả xét nghiệm nào.
              </div>
            )}
          </div>
        </div>

        {/* Section: Gói đăng ký */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
            }}
          >
            GÓI ĐĂNG KÝ
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#041E3A',
                    marginBottom: '4px',
                  }}
                >
                  Cá nhân — Miễn phí
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                  }}
                >
                  Hết hạn: Không giới hạn
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('pricing')}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#F5F5F5',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#041E3A',
                cursor: 'pointer',
              }}
            >
              Nâng cấp gói Household
            </button>
          </div>
        </div>

        {/* Section: Gia đình */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
            }}
          >
            GIA ĐÌNH
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
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                fontWeight: 400,
                color: '#9D9FA3',
                lineHeight: '1.5',
                marginBottom: '16px',
              }}
            >
              Mời người thân hỗ trợ bạn trong quá trình phục hồi.
            </div>

            <button
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#F5F5F5',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#041E3A',
                cursor: 'pointer',
              }}
            >
              Gửi lời mời
            </button>
          </div>
        </div>

        {/* Section: Ngôn ngữ */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
            }}
          >
            NGÔN NGỮ
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleLanguageChange('vi')}
                style={{
                  flex: 1,
                  height: '44px',
                  backgroundColor: profile?.language === 'vi' ? '#041E3A' : '#F5F5F5',
                  border: profile?.language === 'vi' ? 'none' : '1px solid #EBEBF0',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: profile?.language === 'vi' ? '#FFFFFF' : '#041E3A',
                  cursor: 'pointer',
                }}
              >
                Tiếng Việt
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                style={{
                  flex: 1,
                  height: '44px',
                  backgroundColor: profile?.language === 'en' ? '#041E3A' : '#F5F5F5',
                  border: profile?.language === 'en' ? 'none' : '1px solid #EBEBF0',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: profile?.language === 'en' ? '#FFFFFF' : '#041E3A',
                  cursor: 'pointer',
                }}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Section: Thông báo */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#041E3A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
            }}
          >
            THÔNG BÁO
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Morning time */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#041E3A',
                    }}
                  >
                    Check-in sáng
                  </div>
                  <input
                    type="time"
                    value={profile?.morning_time ?? '07:00'}
                    onChange={(e) => handleMorningTimeChange(e.target.value)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#041E3A',
                      border: '1px solid #EBEBF0',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      backgroundColor: '#F5F5F5',
                    }}
                  />
                </div>
              </div>

              {/* Midday toggle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #EBEBF0',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#041E3A',
                  }}
                >
                  Nhắc giữa ngày
                </div>
                <button
                  onClick={() =>
                    handleToggle('notification_midday', !profile?.notification_midday)
                  }
                  style={{
                    width: '48px',
                    height: '28px',
                    backgroundColor: profile?.notification_midday ? '#041E3A' : '#EBEBF0',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 150ms ease-out',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '3px',
                      left: profile?.notification_midday ? '23px' : '3px',
                      transition: 'left 150ms ease-out',
                    }}
                  />
                </button>
              </div>

              {/* Pre-sleep toggle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#041E3A',
                  }}
                >
                  Nhắc trước khi ngủ
                </div>
                <button
                  onClick={() =>
                    handleToggle('notification_pre_sleep', !profile?.notification_pre_sleep)
                  }
                  style={{
                    width: '48px',
                    height: '28px',
                    backgroundColor: profile?.notification_pre_sleep ? '#041E3A' : '#EBEBF0',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 150ms ease-out',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '3px',
                      left: profile?.notification_pre_sleep ? '23px' : '3px',
                      transition: 'left 150ms ease-out',
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out button */}
        <button
          onClick={signOut}
          style={{
            width: '100%',
            height: '44px',
            backgroundColor: 'transparent',
            border: 'none',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#DC2626',
            cursor: 'pointer',
            marginTop: '24px',
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
