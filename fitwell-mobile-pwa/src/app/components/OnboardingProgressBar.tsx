import React from 'react';

interface OnboardingProgressBarProps {
  currentStep: 'language' | 'condition' | 'biomarker' | 'aha' | 'lifePattern' | 'activation';
}

/**
 * Continuous horizontal progress bar for onboarding flow
 * 
 * Steps (5 total):
 * 1. Language
 * 2. Condition Declaration (NEW in v2.0)
 * 3. Biomarker
 * 4. Life Pattern
 * 5. Activation
 * 
 * Aha Intercept appears between Biomarker and Life Pattern but is NOT counted as a step.
 * When showing Aha, the progress bar pauses at 60% and pulses subtly.
 */
export function OnboardingProgressBar({ currentStep }: OnboardingProgressBarProps) {
  // Calculate progress percentage (5 steps total, Aha is bonus)
  const getProgressPercentage = (): number => {
    switch (currentStep) {
      case 'language':
        return 0; // Starting point
      case 'condition':
        return 20; // 1/5 through journey
      case 'biomarker':
        return 40; // 2/5 through journey
      case 'aha':
        return 60; // Paused at 3/5 (bonus screen - pulses)
      case 'lifePattern':
        return 60; // Same as after biomarker (Aha was bonus)
      case 'activation':
        return 80; // 4/5 through journey
      default:
        return 0;
    }
  };

  const progress = getProgressPercentage();
  const isAhaScreen = currentStep === 'aha';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: '#EBEBF0',
        zIndex: 1000,
      }}
    >
      {/* Progress fill with optional pulse animation on Aha screen */}
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#041E3A',
          transition: isAhaScreen ? 'none' : 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          animation: isAhaScreen ? 'progressPulse 2.4s ease-in-out infinite' : 'none',
        }}
      />

      {/* Keyframe animation for Aha pulse - subtle opacity + slight width oscillation */}
      <style>
        {`
          @keyframes progressPulse {
            0%, 100% {
              opacity: 1;
              transform: scaleX(1);
              transform-origin: left;
            }
            50% {
              opacity: 0.7;
              transform: scaleX(0.99);
              transform-origin: left;
            }
          }
        `}
      </style>
    </div>
  );
}
