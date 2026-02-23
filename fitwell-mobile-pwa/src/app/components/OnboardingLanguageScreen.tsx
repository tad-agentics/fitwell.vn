import React from 'react';

interface OnboardingLanguageScreenProps {
  onLanguageSelect: (language: 'vi' | 'en') => void;
}

export function OnboardingLanguageScreen({ onLanguageSelect }: OnboardingLanguageScreenProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#041E3A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
      }}
    >
      {/* Top eyebrow */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 400,
          color: '#9D9FA3',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '64px',
        }}
      >
        FITWELL
      </div>

      {/* Button container */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '353px', // 393 - 40px margins
        }}
      >
        {/* Vietnamese button - filled */}
        <button
          onClick={() => onLanguageSelect('vi')}
          style={{
            width: '100%',
            height: '80px',
            backgroundColor: '#FFFFFF',
            color: '#041E3A',
            border: 'none',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'opacity 150ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Tiếng Việt
        </button>

        {/* English button - outline */}
        <button
          onClick={() => onLanguageSelect('en')}
          style={{
            width: '100%',
            height: '80px',
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            border: '1px solid #FFFFFF',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'opacity 150ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          English
        </button>
      </div>
    </div>
  );
}
