import React from 'react';

interface OnboardingAhaScreenProps {
  onContinue: () => void;
  onViewFullScenario: () => void;
  declaredConditions?: string[]; // From Screen 2a (Condition Declaration)
}

/**
 * Onboarding Aha Intercept (Screen 3) - Condition Personalized
 * 
 * 4 Variants based on declared conditions:
 * - Variant A: Gout/uric acid user (single condition)
 * - Variant B: Cholesterol user (single condition)
 * - Variant C: Back pain user (single condition)
 * - Variant D: Multiple conditions (2+ conditions selected)
 * 
 * Content adapts to show user's specific biomarker value, risk level,
 * and scenario-specific guidance relevant to their declared condition(s).
 */
export function OnboardingAhaScreen({ 
  onContinue, 
  onViewFullScenario, 
  declaredConditions = [] 
}: OnboardingAhaScreenProps) {
  
  // Determine which variant to show based on declared conditions
  const getVariant = () => {
    if (declaredConditions.length === 0) {
      // Default to Variant A if no conditions declared
      return 'uric_acid';
    } else if (declaredConditions.length === 1) {
      // Single condition: show specific variant
      return declaredConditions[0];
    } else {
      // Multiple conditions: show Variant D
      return 'multiple';
    }
  };

  const variant = getVariant();

  // Variant content definitions
  const variantContent = {
    // Variant A: Gout/uric acid user
    uric_acid: {
      showBiomarkerValue: true,
      biomarkerValue: '7.2 mg/dL',
      useDMSerif: true,
      badge: 'CAO',
      badgeColor: '#D97706', // Amber
      bodyText: 'Uric acid của bạn đang ở vùng CAO',
      sectionHeading: 'Nếu tối nay đi nhậu hải sản:',
      items: [
        '→ Tránh tôm, cua, nghêu',
        '→ Chọn bia ít cồn, không trộn',
        '→ Ăn cơm trước khi đụng đồ biển',
      ],
    },

    // Variant B: Cholesterol user
    cholesterol: {
      showBiomarkerValue: true,
      biomarkerValue: '4.8 mmol/L',
      useDMSerif: true,
      badge: 'CAO',
      badgeColor: '#D97706', // Amber
      bodyText: 'LDL cholesterol của bạn đang ở vùng cần theo dõi',
      sectionHeading: 'Nếu tối nay đi nhậu hải sản:',
      items: [
        '→ Bữa ăn nhiều mỡ đẩy LDL lên nhanh hơn bạn nghĩ',
        '→ Đi bộ 5 phút sau ăn giảm đường huyết và lipid',
        '→ Cortisol khi căng thẳng oxy hóa LDL nhanh hơn',
      ],
    },

    // Variant B alternative: Lipids (use same as cholesterol)
    lipids: {
      showBiomarkerValue: true,
      biomarkerValue: '4.8 mmol/L',
      useDMSerif: true,
      badge: 'CAO',
      badgeColor: '#D97706', // Amber
      bodyText: 'LDL cholesterol của bạn đang ở vùng cần theo dõi',
      sectionHeading: 'Nếu tối nay đi nhậu hải sản:',
      items: [
        '→ Bữa ăn nhiều mỡ đẩy LDL lên nhanh hơn bạn nghĩ',
        '→ Đi bộ 5 phút sau ăn giảm đường huyết và lipid',
        '→ Cortisol khi căng thẳng oxy hóa LDL nhanh hơn',
      ],
    },

    // Variant C: Back pain user
    back_pain: {
      showBiomarkerValue: true,
      biomarkerValue: '3/5 sáng tuần trước',
      useDMSerif: false, // Use Be Vietnam Pro instead
      badge: null, // No badge for back pain
      badgeColor: null,
      bodyText: 'Lưng bạn cứng hoặc đau phần lớn buổi sáng',
      sectionHeading: 'Tại sao đau lưng văn phòng cứ quay lại:',
      items: [
        '→ 8 tiếng ngồi nén đĩa L4-L5 thêm ~30%',
        '→ 3 phút thư giãn thắt lưng mỗi sáng tạo sự khác biệt',
        '→ Stress văn phòng giữ cơ lưng trong trạng thái co rút',
      ],
    },

    // Variant D: Multiple conditions
    multiple: {
      showBiomarkerValue: false, // No specific biomarker value
      biomarkerValue: null,
      useDMSerif: false,
      badge: null,
      badgeColor: null,
      headline: '3 vấn đề — 1 nguyên nhân gốc',
      bodyText: 'Gout, mỡ máu, và đau lưng đều có chung gốc: ngồi nhiều, ăn uống ngoài, căng thẳng kéo dài.',
      sectionHeading: 'Tại sao chúng xuất hiện cùng lúc:',
      items: [
        '→ Ngồi nhiều → viêm mạn → axit uric, lipid, đau lưng',
        '→ Ăn ngoài nhiều → quá tải gan → tất cả chỉ số tăng',
        '→ Căng thẳng → cortisol → giữ cơ co rút + tăng lipid',
      ],
    },
  };

  // Get content for current variant (fallback to uric_acid if not found)
  const content = variantContent[variant as keyof typeof variantContent] || variantContent.uric_acid;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      {/* Main content card with left navy accent */}
      <div
        style={{
          flex: 1,
          padding: '40px 20px 20px',
          borderLeft: '2px solid #041E3A',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Variant D: Show headline instead of biomarker value */}
        {variant === 'multiple' && content.headline && (
          <h1
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '28px',
              fontWeight: 600,
              color: '#041E3A',
              lineHeight: '1.3',
              margin: '0 0 16px 0',
            }}
          >
            {content.headline}
          </h1>
        )}

        {/* Biomarker value (Variants A, B, C) */}
        {content.showBiomarkerValue && content.biomarkerValue && (
          <div
            style={{
              fontFamily: content.useDMSerif ? 'var(--font-display)' : 'var(--font-ui)',
              fontSize: '36px',
              fontWeight: content.useDMSerif ? 400 : 600,
              color: '#041E3A',
              lineHeight: '1.1',
              marginBottom: '12px',
            }}
          >
            {content.biomarkerValue}
          </div>
        )}

        {/* Badge (Variants A, B only) */}
        {content.badge && content.badgeColor && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 12px',
              border: `1px solid ${content.badgeColor}`,
              borderRadius: '2px',
              alignSelf: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 500,
                color: content.badgeColor,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {content.badge}
            </span>
          </div>
        )}

        {/* Body text */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: '#041E3A',
            lineHeight: '1.5',
            margin: '0 0 32px 0',
          }}
        >
          {content.bodyText}
        </p>

        {/* Section heading */}
        <h3
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 600,
            color: '#041E3A',
            lineHeight: '1.5',
            margin: '0 0 16px 0',
          }}
        >
          {content.sectionHeading}
        </h3>

        {/* Bullet list */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          {content.items.map((item, index) => (
            <div
              key={index}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                fontWeight: 400,
                color: '#041E3A',
                lineHeight: '1.5',
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Secondary link */}
        <button
          onClick={onViewFullScenario}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: '1px solid #041E3A',
            padding: '0 0 2px 0',
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: '#041E3A',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            marginBottom: '16px',
          }}
        >
          Xem kịch bản đầy đủ →
        </button>

        {/* Primary CTA */}
        <button
          onClick={onContinue}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: '#041E3A',
            color: '#FFFFFF',
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
          TIẾP TỤC
        </button>

        {/* Bottom safe area */}
        <div style={{ height: '24px' }} />
      </div>
    </div>
  );
}
