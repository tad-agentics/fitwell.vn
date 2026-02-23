import React from 'react';

interface BackPainScoreScreenProps {
  onScoreSelect: (score: number) => void;
}

interface ScoreOption {
  label: string;
  score: number;
  color: string;
}

const scoreOptions: ScoreOption[] = [
  {
    label: 'Không đau',
    score: 0,
    color: '#059669', // success green
  },
  {
    label: 'Nhẹ',
    score: 3,
    color: '#041E3A', // navy
  },
  {
    label: 'Vừa',
    score: 6,
    color: '#D97706', // amber
  },
  {
    label: 'Nhiều',
    score: 9,
    color: '#DC2626', // risk red
  },
];

/**
 * Morning Back Pain Score Screen (Conditional)
 * 
 * Only shown when:
 * - User has 'back_pain' in primary_conditions[]
 * - AND body_feeling is 'stiff' or 'sore' on morning check-in
 * 
 * Appears after Morning Baseline Screen 2 (body feeling), before protocol selection.
 * One-tap auto-advance - no confirm button needed.
 * 
 * Writes to: checkins.back_pain_score (0, 3, 6, or 9)
 */
export function BackPainScoreScreen({ onScoreSelect }: BackPainScoreScreenProps) {
  const handleScoreSelect = (score: number) => {
    // Auto-advance on tap - writes value and transitions immediately
    console.log('Back pain score selected:', score);
    onScoreSelect(score);
  };

  return (
    <div className="fw-screen fw-bg-surface">
      {/* Content container */}
      <div style={{ padding: '40px 20px 0' }}>
        {/* Eyebrow label */}
        <div
          className="fw-eyebrow fw-text-navy"
          style={{
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          MORNING BASELINE
        </div>

        {/* Question */}
        <h1
          className="fw-heading-1"
          style={{
            marginBottom: '32px',
          }}
        >
          Lưng đau bao nhiêu?
        </h1>

        {/* Horizontal tap scale - 4 cards in a single row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
          }}
        >
          {scoreOptions.map((option) => (
            <button
              key={option.score}
              onClick={() => handleScoreSelect(option.score)}
              style={{
                height: '72px',
                background: '#FFFFFF',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 120ms ease-out',
                padding: '8px',
                position: 'relative',
              }}
              // Hover state
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F0F4F8';
                e.currentTarget.style.borderColor = '#041E3A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#EBEBF0';
              }}
            >
              {/* Label - centered, colored per severity */}
              <div
                className="fw-body-m"
                style={{
                  fontWeight: 600,
                  color: option.color,
                  textAlign: 'center',
                  lineHeight: '1.2',
                }}
              >
                {option.label}
              </div>
            </button>
          ))}
        </div>

        {/* Helper text - explains the one-tap behavior */}
        <div
          className="fw-body-s fw-text-grey"
          style={{
            marginTop: '16px',
            textAlign: 'center',
          }}
        >
          Chọn một để tiếp tục
        </div>
      </div>
    </div>
  );
}
