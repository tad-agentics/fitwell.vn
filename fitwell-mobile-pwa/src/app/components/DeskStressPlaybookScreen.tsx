import React from 'react';

interface DeskBreak {
  time: string;
  action: string;
}

interface DeskStressPlaybookScreenProps {
  category: 'VĂN PHÒNG' | 'CĂNG THẲNG';
  scenarioName: string;
  riskLevel: string; // e.g., "3/5"
  riskConditions: string; // e.g., "Nguy cơ lưng + căng thẳng"
  preStartSteps: string[]; // "TRƯỚC KHI BẮT ĐẦU" items
  rules: string[]; // "3 QUY TẮC HÔM NAY" - max 3
  deskBreaks: DeskBreak[]; // "LỊCH NGHỈ NGƠI" timeline
  avoidItems: string[]; // "TRÁNH" section
  fallbackAction: string; // "NẾU ĐÃ QUÁ MỆT"
  onStart: () => void;
}

/**
 * Desk/Stress Scenario Playbook Screen
 * 
 * Layout variant of food/drink scenario playbook (Screen 16).
 * Used for desk_marathon and stress_week scenario categories.
 * 
 * Key differences from food/drink playbook:
 * - Navy header instead of food image
 * - "TRƯỚC KHI BẮT ĐẦU" instead of "TRƯỚC KHI ĐẾN"
 * - "LỊCH NGHỈ NGƠI" (Desk Breaks) instead of "CHIẾN LƯỢC BỮA ĂN"
 * - Timeline layout with time markers for breaks
 * 
 * Sticky CTA at bottom: "VÀO RỒI" logs to scenario_sessions
 */
export function DeskStressPlaybookScreen({
  category,
  scenarioName,
  riskLevel,
  riskConditions,
  preStartSteps,
  rules,
  deskBreaks,
  avoidItems,
  fallbackAction,
  onStart,
}: DeskStressPlaybookScreenProps) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Scrollable content area */}
      <div
        style={{
          paddingBottom: '88px', // Clearance for sticky CTA
          background: '#FFFFFF',
        }}
      >
        {/* Header - Navy background (no image like food scenarios) */}
        <div
          style={{
            background: '#041E3A',
            minHeight: '160px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          {/* Category eyebrow */}
          <div
            className="fw-eyebrow"
            style={{
              color: '#9D9FA3',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {category}
          </div>

          {/* Scenario name */}
          <h1
            className="fw-heading-1"
            style={{
              color: '#FFFFFF',
              marginBottom: '8px',
            }}
          >
            {scenarioName}
          </h1>

          {/* Risk level + conditions */}
          <div
            className="fw-body-s"
            style={{
              color: '#9D9FA3',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Rủi ro {riskLevel}</span>
            <span>·</span>
            <span>{riskConditions}</span>
          </div>
        </div>

        {/* Content sections */}
        <div style={{ padding: '24px 20px' }}>
          {/* Section: TRƯỚC KHI BẮT ĐẦU (instead of "TRƯỚC KHI ĐẾN") */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              className="fw-eyebrow"
              style={{
                color: '#041E3A',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              TRƯỚC KHI BẮT ĐẦU
            </h2>

            {/* Pre-start steps - numbered cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {preStartSteps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    background: '#F5F5F5',
                    border: '1px solid #EBEBF0',
                    borderRadius: '4px',
                    padding: '16px',
                  }}
                >
                  <div
                    className="fw-body-m"
                    style={{
                      color: '#041E3A',
                      display: 'flex',
                      gap: '12px',
                    }}
                  >
                    <span
                      className="fw-mono"
                      style={{
                        color: '#9D9FA3',
                        fontSize: '11px',
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: 3 QUY TẮC HÔM NAY */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              className="fw-eyebrow"
              style={{
                color: '#041E3A',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              3 QUY TẮC HÔM NAY
            </h2>

            {/* Rules - numbered, large text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {rules.map((rule, index) => (
                <div
                  key={index}
                  className="fw-body-l"
                  style={{
                    color: '#041E3A',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  <span
                    className="fw-mono"
                    style={{
                      color: '#9D9FA3',
                      fontSize: '11px',
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: LỊCH NGHỈ NGƠI (instead of "CHIẾN LƯỢC BỮA ĂN") */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              className="fw-eyebrow"
              style={{
                color: '#041E3A',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              LỊCH NGHỈ NGƠI
            </h2>

            {/* Timeline-style layout with left-aligned dots */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingLeft: '16px',
                position: 'relative',
              }}
            >
              {/* Vertical line connecting dots */}
              <div
                style={{
                  position: 'absolute',
                  left: '3px',
                  top: '8px',
                  bottom: '8px',
                  width: '1px',
                  background: '#EBEBF0',
                }}
              />

              {deskBreaks.map((breakItem, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-16px',
                      top: '6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#041E3A',
                    }}
                  />

                  {/* Time */}
                  <div
                    className="fw-mono"
                    style={{
                      fontSize: '10px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {breakItem.time}
                  </div>

                  {/* Action */}
                  <div
                    className="fw-body-m"
                    style={{
                      color: '#041E3A',
                    }}
                  >
                    {breakItem.action}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: TRÁNH - red-tinted background */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              className="fw-eyebrow"
              style={{
                color: '#DC2626',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              TRÁNH
            </h2>

            {avoidItems.map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(220, 38, 38, 0.05)', // Light red tint
                  border: '1px solid rgba(220, 38, 38, 0.15)',
                  borderRadius: '4px',
                  padding: '16px',
                  marginBottom: index < avoidItems.length - 1 ? '12px' : 0,
                }}
              >
                <div
                  className="fw-body-m"
                  style={{
                    color: '#041E3A',
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </section>

          {/* Section: NẾU ĐÃ QUÁ MỆT - fallback */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              className="fw-eyebrow"
              style={{
                color: '#041E3A',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              NẾU ĐÃ QUÁ MỆT
            </h2>

            <div
              style={{
                background: '#F5F5F5',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                padding: '16px',
              }}
            >
              <div
                className="fw-body-m"
                style={{
                  color: '#041E3A',
                  lineHeight: 1.6,
                }}
              >
                {fallbackAction}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky bottom CTA bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderTop: '1px solid #EBEBF0',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={onStart}
          className="fw-button-primary"
          style={{
            width: '100%',
            height: '56px',
            background: '#041E3A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'background 120ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0A3055';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#041E3A';
          }}
        >
          VÀO RỒI
        </button>
      </div>
    </div>
  );
}
