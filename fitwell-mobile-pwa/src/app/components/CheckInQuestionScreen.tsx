import React, { useState } from 'react';
import { getCheckInIcon } from './icons/CheckInStateIcons';
import { vibrate } from '../../utils/pwa';

interface CheckInQuestionScreenProps {
  eyebrow: string;
  question: string;
  subtitle?: string; // Optional subtitle shown next to eyebrow (e.g., "1 của 2")
  options: string[];
  onAnswer: (answer: string) => void;
  currentStep?: number;
  totalSteps?: number;
}

export function CheckInQuestionScreen({
  eyebrow,
  question,
  subtitle,
  options,
  onAnswer,
  currentStep,
  totalSteps,
}: CheckInQuestionScreenProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    // Light haptic feedback on selection
    vibrate(50);
    // Auto-advance after selection
    setTimeout(() => {
      onAnswer(option);
    }, 150);
  };

  return (
    <div className="fw-screen fw-bg-surface" style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* Header */}
      <div className="fw-container" style={{ padding: '40px 20px 32px' }}>
        {/* Progress indicator - if multi-step */}
        {currentStep && totalSteps && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className="fw-progress-bar"
                style={{
                  backgroundColor: index < currentStep ? '#041E3A' : '#EBEBF0',
                }}
              />
            ))}
          </div>
        )}

        {/* Eyebrow label with optional subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div className="fw-eyebrow">
            {eyebrow}
          </div>
          {subtitle && (
            <div
              className="fw-eyebrow"
              style={{
                color: '#9D9FA3', // Grey text for step indicator
              }}
            >
              · {subtitle}
            </div>
          )}
        </div>

        {/* Question */}
        <h1 className="fw-heading-1" style={{ margin: 0 }}>
          {question}
        </h1>
      </div>

      {/* Option cards */}
      <div className="fw-container" style={{ flex: 1, padding: '0 20px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
        {options.map((option) => {
          const isSelected = selectedOption === option;

          const icon = getCheckInIcon(option);
          
          // Determine accent class based on option text
          const getAccentClass = (opt: string) => {
            const text = opt.toLowerCase().trim();
            // Morning baseline options
            if (text === 'ổn') return 'fw-check-in-option-accent-green';
            if (text === 'đau / khó chịu') return 'fw-check-in-option-accent-amber';
            // Midday desk options
            if (text === 'tập trung') return 'fw-check-in-option-accent-green';
            if (text === 'lưng tức') return 'fw-check-in-option-accent-amber';
            return '';
          };

          const accentClass = getAccentClass(option);
          const baseClass = isSelected ? 'fw-check-in-option fw-check-in-option-selected' : 'fw-check-in-option';
          const className = accentClass ? `${baseClass} ${accentClass}` : baseClass;

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={className}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#F5F5F5';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }
              }}
            >
              {/* Icon - above label */}
              {icon && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {icon}
                </div>
              )}

              {/* Label text */}
              <span className="fw-heading-2" style={{ textAlign: 'center' }}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
