import React, { useState } from 'react';

interface ProfileSettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export function ProfileSettingsScreen({ onNavigate }: ProfileSettingsScreenProps) {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [notifications, setNotifications] = useState({
    morningTime: '07:00',
    middayEnabled: true,
    preSleepEnabled: true,
  });

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
            Nguyễn Văn Minh
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
            minh.nguyen@email.com
          </div>
        </div>

        {/* Section: Tình trạng sức khỏe - NEW */}
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
            {/* Condition chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <div
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
                Axit uric
              </div>
              <div
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
                Mỡ máu
              </div>
              <div
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
                Đau lưng
              </div>
            </div>

            {/* Change link */}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Biomarker 1 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #EBEBF0',
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
                    Men gan (ALT)
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                    }}
                  >
                    15/1/2026 · Bệnh viện Chợ Rẫy
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#DC2626',
                    }}
                  >
                    68 U/L
                  </div>
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FEE2E2',
                      borderRadius: '2px',
                      padding: '4px 8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 400,
                      color: '#DC2626',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    CAO
                  </div>
                </div>
              </div>

              {/* Biomarker 2 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #EBEBF0',
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
                    Mỡ máu (Triglyceride)
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                    }}
                  >
                    15/1/2026 · Bệnh viện Chợ Rẫy
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#D97706',
                    }}
                  >
                    245 mg/dL
                  </div>
                  <div
                    style={{
                      backgroundColor: '#FEF9F5',
                      border: '1px solid #FED7AA',
                      borderRadius: '2px',
                      padding: '4px 8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 400,
                      color: '#D97706',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    TRUNG
                  </div>
                </div>
              </div>

              {/* Biomarker 3 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
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
                    Đường huyết (Glucose)
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                    }}
                  >
                    15/1/2026 · Bệnh viện Chợ Rẫy
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#059669',
                    }}
                  >
                    98 mg/dL
                  </div>
                  <div
                    style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: '2px',
                      padding: '4px 8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 400,
                      color: '#059669',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    BT
                  </div>
                </div>
              </div>
            </div>

            {/* Note about sorting */}
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                fontWeight: 400,
                color: '#9D9FA3',
                marginTop: '12px',
                lineHeight: '1.4',
              }}
            >
              Sắp xếp theo tình trạng đã khai báo — axit uric đầu tiên nếu bạn chọn gout.
            </div>
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
                transition: 'background-color 120ms ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EBEBF0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F5';
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
                transition: 'background-color 120ms ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EBEBF0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F5';
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
                onClick={() => setLanguage('vi')}
                style={{
                  flex: 1,
                  height: '44px',
                  backgroundColor: language === 'vi' ? '#041E3A' : '#F5F5F5',
                  border: language === 'vi' ? 'none' : '1px solid #EBEBF0',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: language === 'vi' ? '#FFFFFF' : '#041E3A',
                  cursor: 'pointer',
                  transition: 'all 120ms ease-out',
                }}
              >
                Tiếng Việt
              </button>
              <button
                onClick={() => setLanguage('en')}
                style={{
                  flex: 1,
                  height: '44px',
                  backgroundColor: language === 'en' ? '#041E3A' : '#F5F5F5',
                  border: language === 'en' ? 'none' : '1px solid #EBEBF0',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: language === 'en' ? '#FFFFFF' : '#041E3A',
                  cursor: 'pointer',
                  transition: 'all 120ms ease-out',
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
                    value={notifications.morningTime}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        morningTime: e.target.value,
                      })
                    }
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
                    setNotifications({
                      ...notifications,
                      middayEnabled: !notifications.middayEnabled,
                    })
                  }
                  style={{
                    width: '48px',
                    height: '28px',
                    backgroundColor: notifications.middayEnabled
                      ? '#041E3A'
                      : '#EBEBF0',
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
                      left: notifications.middayEnabled ? '23px' : '3px',
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
                    setNotifications({
                      ...notifications,
                      preSleepEnabled: !notifications.preSleepEnabled,
                    })
                  }
                  style={{
                    width: '48px',
                    height: '28px',
                    backgroundColor: notifications.preSleepEnabled
                      ? '#041E3A'
                      : '#EBEBF0',
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
                      left: notifications.preSleepEnabled ? '23px' : '3px',
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
