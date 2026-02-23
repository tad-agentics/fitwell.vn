import React from 'react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  // Regular home screen content - "Tối nay" (Tonight) view
  return (
    <div className="fw-screen fw-bg-surface" style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', paddingBottom: '80px' }}>
      {/* Top greeting */}
      <div className="fw-container" style={{ padding: '40px 20px 24px' }}>
        <div className="fw-body-l fw-text-grey">
          Chào buổi sáng
        </div>
      </div>

      {/* Main content */}
      <div className="fw-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Morning check-in card */}
        <div
          onClick={() => onNavigate('checkIn')}
          className="fw-card"
          style={{ cursor: 'pointer', transition: 'background-color 120ms ease-out' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F5F5F5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          {/* Eyebrow label */}
          <div className="fw-eyebrow" style={{ marginBottom: '4px' }}>
            KIỂM TRA BUỔI SÁNG
          </div>

          {/* Headline */}
          <h2 className="fw-heading-2" style={{ margin: '0 0 8px 0' }}>
            Bạn ngủ thế nào?
          </h2>

          {/* Subtitle */}
          <div className="fw-body-s fw-text-grey" style={{ marginBottom: '16px' }}>
            2 câu hỏi · 10 giây
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              onClick={() => onNavigate('checkIn')}
              className="fw-btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              BẮT ĐẦU
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ marginTop: '1px' }}
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="#041E3A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <button
              onClick={() => onNavigate('preSleep')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#F5F5F5',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                fontWeight: 500,
                color: '#041E3A',
                cursor: 'pointer',
              }}
            >
              Chuẩn bị ngủ
            </button>
          </div>
        </div>

        {/* Scenario search bar */}
        <div
          onClick={() => onNavigate('scenarioSearch')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'background-color 120ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F5F5F5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle
              cx="9"
              cy="9"
              r="6"
              stroke="#9D9FA3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.5 13.5L17 17"
              stroke="#9D9FA3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Bạn ăn ở đâu tối nay?"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#041E3A',
            }}
          />
        </div>

        {/* Next event card */}
        <div
          onClick={() => onNavigate('microAction')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EBEBF0',
            borderRadius: '4px',
            padding: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            cursor: 'pointer',
            transition: 'background-color 120ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F5F5F5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          {/* Risk level dot */}
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#D97706',
              marginTop: '6px',
              flexShrink: 0,
            }}
          />

          {/* Event info */}
          <div style={{ flex: 1 }}>
            {/* Eyebrow */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 400,
                color: '#9D9FA3',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}
            >
              SỰ KIỆN SẮP TỚI
            </div>

            {/* Scenario name */}
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '17px',
                fontWeight: 600,
                color: '#041E3A',
                lineHeight: '1.5',
                marginBottom: '4px',
              }}
            >
              Nhậu hải sản
            </div>

            {/* Countdown */}
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#9D9FA3',
                lineHeight: '1.5',
              }}
            >
              Thứ Năm · 19:00 · còn 2 ngày
            </div>
          </div>

          {/* Arrow */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ marginTop: '6px', flexShrink: 0 }}
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="#9D9FA3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
