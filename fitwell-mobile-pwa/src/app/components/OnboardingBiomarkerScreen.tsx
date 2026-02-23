import React, { useState } from 'react';

interface BiomarkerEntry {
  id: string;
  type: string;
  value: string;
  date: string;
}

interface OnboardingBiomarkerScreenProps {
  onContinue: (data: BiomarkerEntry[]) => void;
  onSkip: () => void;
  declaredConditions?: string[]; // From Screen 2a (Condition Declaration)
}

const BIOMARKER_TYPES = [
  { value: 'uric-acid', label: 'Uric acid', unit: 'mg/dL' },
  { value: 'triglycerides', label: 'Triglycerides', unit: 'mg/dL' },
  { value: 'ast', label: 'AST', unit: 'U/L' },
  { value: 'alt', label: 'ALT', unit: 'U/L' },
  { value: 'hba1c', label: 'HbA1c', unit: '%' },
  { value: 'hdl', label: 'HDL', unit: 'mg/dL' },
  { value: 'ldl', label: 'LDL', unit: 'mg/dL' },
  { value: 'fasting-glucose', label: 'Fasting glucose', unit: 'mg/dL' },
];

export function OnboardingBiomarkerScreen({ onContinue, onSkip, declaredConditions = [] }: OnboardingBiomarkerScreenProps) {
  const [entries, setEntries] = useState<BiomarkerEntry[]>([
    { id: '1', type: '', value: '', date: '' }
  ]);

  // Sort biomarker types based on declared conditions
  // If user declared uric_acid → show Uric acid first
  // If user declared cholesterol → show LDL first
  // NOTE: Dropdown order varies by declared conditions — show Uric acid first in this example
  const getSortedBiomarkerTypes = () => {
    const sorted = [...BIOMARKER_TYPES];
    
    // Define condition-to-biomarker priority mapping
    const conditionPriorityMap: Record<string, string[]> = {
      'uric_acid': ['uric-acid'],
      'lipids': ['triglycerides', 'hdl', 'ldl'],
      'cholesterol': ['ldl', 'hdl'],
      'liver': ['alt', 'ast'],
      'glucose': ['fasting-glucose', 'hba1c'],
    };

    // Build priority list based on declared conditions
    const priorityBiomarkers: string[] = [];
    declaredConditions.forEach(condition => {
      const biomarkers = conditionPriorityMap[condition];
      if (biomarkers) {
        biomarkers.forEach(b => {
          if (!priorityBiomarkers.includes(b)) {
            priorityBiomarkers.push(b);
          }
        });
      }
    });

    // Sort: priority biomarkers first, then rest in original order
    return sorted.sort((a, b) => {
      const aPriority = priorityBiomarkers.indexOf(a.value);
      const bPriority = priorityBiomarkers.indexOf(b.value);
      
      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority; // Both are priority, sort by priority order
      } else if (aPriority !== -1) {
        return -1; // a is priority, b is not
      } else if (bPriority !== -1) {
        return 1; // b is priority, a is not
      } else {
        return 0; // Neither is priority, keep original order
      }
    });
  };

  const sortedBiomarkerTypes = getSortedBiomarkerTypes();

  const addNewEntry = () => {
    setEntries([...entries, { id: Date.now().toString(), type: '', value: '', date: '' }]);
  };

  const updateEntry = (id: string, field: keyof BiomarkerEntry, value: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const getUnitForType = (type: string) => {
    const biomarker = BIOMARKER_TYPES.find(b => b.value === type);
    return biomarker?.unit || '';
  };

  const hasValidEntries = entries.some(e => e.type && e.value && e.date);

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
      {/* Progress indicator */}
      <div
        style={{
          padding: '20px 20px 16px',
          backgroundColor: '#F5F5F5',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              style={{
                width: '40px',
                height: '4px',
                backgroundColor: step === 2 ? '#041E3A' : '#EBEBF0',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#041E3A',
            lineHeight: '1.3',
            margin: 0,
          }}
        >
          Nhập kết quả xét nghiệm gần nhất
        </h1>
      </div>

      {/* Form card */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '24px',
              marginBottom: index < entries.length - 1 ? '12px' : '16px',
            }}
          >
            {/* Dropdown: Loại xét nghiệm */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#041E3A',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Loại xét nghiệm
              </label>
              <select
                value={entry.type}
                onChange={(e) => updateEntry(entry.id, 'type', e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #EBEBF0',
                  borderRadius: '4px',
                  padding: '0 12px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#041E3A',
                }}
              >
                <option value="">Chọn loại xét nghiệm</option>
                {sortedBiomarkerTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Numeric input: Giá trị */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#041E3A',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Giá trị
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={entry.value}
                  onChange={(e) => updateEntry(entry.id, 'value', e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%',
                    height: '44px',
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #EBEBF0',
                    borderRadius: '4px',
                    padding: '0 80px 0 12px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#041E3A',
                  }}
                />
                {entry.type && (
                  <span
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                    }}
                  >
                    {getUnitForType(entry.type)}
                  </span>
                )}
              </div>
            </div>

            {/* Date picker: Ngày xét nghiệm */}
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#041E3A',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Ngày xét nghiệm
              </label>
              <input
                type="date"
                value={entry.date}
                onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #EBEBF0',
                  borderRadius: '4px',
                  padding: '0 12px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#041E3A',
                }}
              />
            </div>
          </div>
        ))}

        {/* Add another result link */}
        <button
          onClick={addNewEntry}
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
            marginBottom: '32px',
          }}
        >
          + Thêm kết quả khác
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Primary CTA */}
        <button
          onClick={() => onContinue(entries.filter(e => e.type && e.value && e.date))}
          disabled={!hasValidEntries}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: hasValidEntries ? '#041E3A' : '#F5F5F5',
            color: hasValidEntries ? '#FFFFFF' : '#9D9FA3',
            border: hasValidEntries ? 'none' : '1px solid #EBEBF0',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: hasValidEntries ? 'pointer' : 'not-allowed',
            marginBottom: '12px',
          }}
        >
          TIẾP TỤC
        </button>

        {/* Ghost skip button */}
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            padding: '12px',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#9D9FA3',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          Chưa có kết quả — bỏ qua
        </button>

        {/* Bottom safe area */}
        <div style={{ height: '24px' }} />
      </div>
    </div>
  );
}
