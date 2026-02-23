import React, { useState } from 'react';

type ConditionId = 'uric-acid' | 'cholesterol' | 'back-pain' | 'not-sure';

interface Condition {
  id: ConditionId;
  label: string;
  subtitle: string;
  icon?: React.ReactNode;
  exclusive?: boolean; // "Not sure" is exclusive
}

interface OnboardingConditionScreenProps {
  onContinue: (selectedConditions: string[]) => void;
}

const conditions: Condition[] = [
  {
    id: 'uric-acid',
    label: 'Axit uric cao / Gout',
    subtitle: 'Đau khớp, ngón chân, kết quả xét nghiệm vượt ngưỡng',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L12 8M12 16L12 22M4.93 4.93L9.17 9.17M14.83 14.83L19.07 19.07M2 12L8 12M16 12L22 12M4.93 19.07L9.17 14.83M14.83 9.17L19.07 4.93" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'cholesterol',
    label: 'Mỡ máu cao / Cholesterol',
    subtitle: 'LDL, Triglycerides, mỡ máu trong kết quả xét nghiệm',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'back-pain',
    label: 'Đau lưng mãn tính',
    subtitle: 'Lưng cứng, đau thắt lưng, ngồi nhiều',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M6 8c0-3.31 2.69-6 6-6M18 8c0-3.31-2.69-6-6-6M12 22c-3.31 0-6-2.69-6-6M12 22c3.31 0 6-2.69 6-6" />
      </svg>
    ),
  },
  {
    id: 'not-sure',
    label: 'Tôi chưa chắc — chỉ có kết quả xét nghiệm',
    subtitle: 'FitWell sẽ phát hiện qua dữ liệu hàng ngày',
    exclusive: true,
  },
];

export function OnboardingConditionScreen({ onContinue }: OnboardingConditionScreenProps) {
  const [selectedConditions, setSelectedConditions] = useState<Set<ConditionId>>(new Set());

  const handleConditionToggle = (conditionId: ConditionId) => {
    setSelectedConditions((prev) => {
      const newSet = new Set(prev);
      const condition = conditions.find((c) => c.id === conditionId);

      if (condition?.exclusive) {
        // "Not sure" is exclusive - clear all others
        return new Set([conditionId]);
      } else {
        // Regular condition - toggle it and remove "not sure" if present
        if (newSet.has(conditionId)) {
          newSet.delete(conditionId);
        } else {
          newSet.add(conditionId);
          // Remove "not sure" when selecting specific condition
          newSet.delete('not-sure');
        }
      }

      return newSet;
    });
  };

  const handleContinue = () => {
    const conditionsArray = Array.from(selectedConditions);
    onContinue(conditionsArray);
  };

  const isButtonEnabled = selectedConditions.size > 0;

  return (
    <div className="fw-screen fw-bg-surface" style={{ paddingBottom: '40px' }}>
      {/* Content container */}
      <div style={{ padding: '40px 20px 0' }}>
        {/* Headline */}
        <h1 className="fw-heading-2" style={{ marginBottom: '8px' }}>
          Bạn đang quản lý vấn đề sức khỏe nào?
        </h1>

        {/* Subtitle */}
        <p className="fw-body-m fw-text-grey" style={{ marginBottom: '24px' }}>
          Chọn tất cả những gì phù hợp. FitWell sẽ cá nhân hóa theo tình trạng của bạn.
        </p>

        {/* Condition cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {conditions.map((condition) => {
            const isSelected = selectedConditions.has(condition.id);

            return (
              <button
                key={condition.id}
                onClick={() => handleConditionToggle(condition.id)}
                style={{
                  height: '80px',
                  padding: '16px 20px',
                  background: isSelected ? '#F0F4F8' : '#FFFFFF',
                  border: isSelected ? '1px solid #041E3A' : '1px solid #EBEBF0',
                  borderLeft: isSelected ? '2px solid #041E3A' : '1px solid #EBEBF0',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 120ms ease-out',
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                {/* Icon (if present) */}
                {condition.icon && (
                  <div
                    style={{
                      flexShrink: 0,
                      width: '24px',
                      height: '24px',
                      color: '#041E3A',
                    }}
                  >
                    {condition.icon}
                  </div>
                )}

                {/* Text content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="fw-body-l"
                    style={{
                      fontWeight: 600,
                      color: '#041E3A',
                      marginBottom: '2px',
                    }}
                  >
                    {condition.label}
                  </div>
                  <div className="fw-body-s fw-text-grey">{condition.subtitle}</div>
                </div>

                {/* Checkmark (when selected) */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '16px',
                      height: '16px',
                      color: '#041E3A',
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 8L6.5 11.5L13 4.5" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleContinue}
          disabled={!isButtonEnabled}
          className="fw-btn-primary"
          style={{
            marginTop: '40px',
            width: '100%',
          }}
        >
          TIẾP TỤC
        </button>
      </div>
    </div>
  );
}
