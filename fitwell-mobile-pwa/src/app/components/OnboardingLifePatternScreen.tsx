import React, { useState } from 'react';

interface OnboardingLifePatternScreenProps {
  onComplete: (answers: LifePatternAnswers) => void;
  onShowHouseholdInvite?: () => void; // Triggered when Q5 = "Tôi + vợ/người thân"
}

interface LifePatternAnswers {
  deskHours: string; // Q1: "Dưới 6 tiếng" | "6–8 tiếng" | "Hơn 8 tiếng"
  eatingOutFrequency: string; // Q2: "1–2" | "3–4" | "5+"
  backPainFrequency: string; // Q3: "Hiếm khi" | "Đôi khi" | "Thường xuyên"
  highestRiskEnvironments: string[]; // Q4: Multi-select, max 2
  accountUsage: string; // Q5: "Chỉ mình tôi" | "Tôi + vợ/người thân"
}

const QUESTIONS = [
  {
    id: 'deskHours' as const,
    eyebrow: 'LIFE PATTERN',
    question: 'Bạn thường ngồi làm việc bao nhiêu tiếng mỗi ngày?',
    multiSelect: false,
    options: [
      { value: 'Dưới 6 tiếng', label: 'Dưới 6 tiếng' },
      { value: '6–8 tiếng', label: '6–8 tiếng' },
      { value: 'Hơn 8 tiếng', label: 'Hơn 8 tiếng' },
    ],
    step: 1,
  },
  {
    id: 'eatingOutFrequency' as const,
    eyebrow: 'LIFE PATTERN',
    question: 'Bạn ăn tối ngoài nhà mấy lần mỗi tuần?',
    multiSelect: false,
    options: [
      { value: '1–2', label: '1–2' },
      { value: '3–4', label: '3–4' },
      { value: '5+', label: '5+' },
    ],
    step: 2,
  },
  {
    id: 'backPainFrequency' as const,
    eyebrow: 'LIFE PATTERN',
    question: 'Lưng hoặc cổ có bị cứng hoặc đau thường xuyên không?',
    multiSelect: false,
    options: [
      { value: 'Hiếm khi', label: 'Hiếm khi' },
      { value: 'Đôi khi', label: 'Đôi khi' },
      { value: 'Thường xuyên', label: 'Thường xuyên' },
    ],
    step: 3,
  },
  {
    id: 'highestRiskEnvironments' as const,
    eyebrow: 'LIFE PATTERN',
    question: 'Môi trường nào là rủi ro cao nhất với sức khỏe của bạn?',
    badge: 'Chọn tối đa 2',
    multiSelect: true,
    maxSelections: 2,
    options: [
      { value: 'Bữa hải sản', label: 'Bữa hải sản' },
      { value: 'Bữa BBQ', label: 'Bữa BBQ' },
      { value: 'Bàn làm việc', label: 'Bàn làm việc' },
      { value: 'Căng thẳng công việc', label: 'Căng thẳng công việc' },
      { value: 'Công tác', label: 'Công tác' },
    ],
    step: 4,
  },
  {
    id: 'accountUsage' as const,
    eyebrow: 'LIFE PATTERN',
    question: 'Ai cùng sử dụng tài khoản này?',
    multiSelect: false,
    options: [
      { value: 'Chỉ mình tôi', label: 'Chỉ mình tôi', isHousehold: false },
      { value: 'Tôi + vợ/người thân', label: 'Tôi + vợ/người thân', isHousehold: true },
    ],
    step: 5,
  },
];

export function OnboardingLifePatternScreen({
  onComplete,
  onShowHouseholdInvite,
}: OnboardingLifePatternScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<LifePatternAnswers>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;

  const handleSingleAnswer = (answerValue: string, isHousehold: boolean = false) => {
    setSelectedOption(answerValue);

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answerValue,
    };
    setAnswers(newAnswers);

    // For Q5, if household option selected, show visual indication before advancing
    if (isHousehold && onShowHouseholdInvite) {
      // Show visual indication for 300ms, then trigger household flow
      setTimeout(() => {
        onComplete(newAnswers as LifePatternAnswers);
        // Parent component should handle routing to household invite screen
        onShowHouseholdInvite();
      }, 300);
    } else {
      // Move to next question or complete
      setTimeout(() => {
        setSelectedOption(null);
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          onComplete(newAnswers as LifePatternAnswers);
        }
      }, 150);
    }
  };

  const handleMultiSelect = (value: string) => {
    const isAlreadySelected = selectedMulti.includes(value);
    let newSelected: string[];

    if (isAlreadySelected) {
      // Deselect
      newSelected = selectedMulti.filter((v) => v !== value);
    } else {
      // Check if max selections reached
      if (currentQuestion.maxSelections && selectedMulti.length >= currentQuestion.maxSelections) {
        // Replace last selection
        newSelected = [...selectedMulti.slice(0, currentQuestion.maxSelections - 1), value];
      } else {
        // Add to selection
        newSelected = [...selectedMulti, value];
      }
    }

    setSelectedMulti(newSelected);

    // Update answers
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: newSelected,
    };
    setAnswers(newAnswers);
  };

  const handleMultiContinue = () => {
    if (selectedMulti.length === 0) return;

    // Move to next question
    setTimeout(() => {
      setSelectedMulti([]);
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onComplete(answers as LifePatternAnswers);
      }
    }, 150);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '40px 20px 32px',
        }}
      >
        {/* Progress indicator - shows step 3 of 5 throughout */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          {/* Steps 1-2 (completed) */}
          <div style={{ flex: 1, height: '2px', backgroundColor: '#041E3A' }} />
          <div style={{ flex: 1, height: '2px', backgroundColor: '#041E3A' }} />
          
          {/* Step 3 (current - all life pattern questions) */}
          <div style={{ flex: 1, height: '2px', backgroundColor: '#041E3A' }} />
          
          {/* Steps 4-5 (not yet) */}
          <div style={{ flex: 1, height: '2px', backgroundColor: '#EBEBF0' }} />
          <div style={{ flex: 1, height: '2px', backgroundColor: '#EBEBF0' }} />
        </div>

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 400,
            color: '#9D9FA3',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
            lineHeight: '1.0',
          }}
        >
          {currentQuestion.eyebrow}
        </div>

        {/* Question */}
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            lineHeight: '1.3',
            margin: '0 0 8px 0',
          }}
        >
          {currentQuestion.question}
        </h1>

        {/* Badge for multi-select */}
        {currentQuestion.badge && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 400,
              color: '#9D9FA3',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '8px',
            }}
          >
            {currentQuestion.badge}
          </div>
        )}
      </div>

      {/* Options */}
      <div
        style={{
          padding: '0 20px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
        }}
      >
        {currentQuestion.options.map((option) => {
          const isSelected = currentQuestion.multiSelect
            ? selectedMulti.includes(option.value)
            : selectedOption === option.value;
          const isHouseholdOption = 'isHousehold' in option && option.isHousehold;

          return (
            <button
              key={option.value}
              onClick={() => {
                if (currentQuestion.multiSelect) {
                  handleMultiSelect(option.value);
                } else {
                  handleSingleAnswer(option.value, isHouseholdOption);
                }
              }}
              style={{
                width: '100%',
                minHeight: '80px',
                backgroundColor: isSelected ? '#F0F4F8' : '#FFFFFF',
                border: `${isSelected ? '2px' : '1px'} solid ${isSelected ? '#041E3A' : '#EBEBF0'}`,
                borderRadius: '4px',
                borderLeft: isSelected ? '4px solid #041E3A' : undefined,
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'all 120ms ease-out',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#F0F4F8';
                  e.currentTarget.style.borderColor = '#041E3A';
                  e.currentTarget.style.borderWidth = '2px';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#EBEBF0';
                  e.currentTarget.style.borderWidth = '1px';
                }
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#041E3A',
                  lineHeight: '1.3',
                }}
              >
                {option.label}
              </div>

              {/* Household indicator - shown only for Q5 household option */}
              {isHouseholdOption && (
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                    marginTop: '4px',
                    lineHeight: '1.5',
                  }}
                >
                  → Sẽ tạo link mời sau
                </div>
              )}
            </button>
          );
        })}

        {/* Continue button for multi-select */}
        {currentQuestion.multiSelect && selectedMulti.length > 0 && (
          <button
            onClick={handleMultiContinue}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: '#041E3A',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              marginTop: '20px',
              transition: 'background-color 120ms ease-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0A3055';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#041E3A';
            }}
          >
            TIẾP TỤC ({selectedMulti.length} đã chọn)
          </button>
        )}
      </div>
    </div>
  );
}
