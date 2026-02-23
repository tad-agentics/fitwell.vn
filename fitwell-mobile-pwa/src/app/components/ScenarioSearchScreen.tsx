import React, { useState } from 'react';

interface ScenarioSearchScreenProps {
  onSelectScenario: (scenarioId: string) => void;
}

interface Scenario {
  id: string;
  name: string;
  category: string;
  riskLevel: number; // 1-5
  readTime: string;
  conditionTags: string[]; // NEW: Health condition tags
}

// v2.0 filter chips - multi-condition categories
const FILTER_CHIPS = ['TẤT CẢ', 'HẢI SẢN & NHẬU', 'BỮA ĂN', 'VĂN PHÒNG', 'CĂNG THẲNG', 'CÔNG TÁC'];

const SCENARIOS: Scenario[] = [
  { id: '1', name: 'Nhà hàng hải sản đối tác', category: 'HẢI SẢN & NHẬU', riskLevel: 5, readTime: '4 phút', conditionTags: ['uric acid', 'cholesterol'] },
  { id: '2', name: 'BBQ Hàn Quốc cuối tuần', category: 'BỮA ĂN', riskLevel: 4, readTime: '3 phút', conditionTags: ['cholesterol', 'blood sugar'] },
  { id: '3', name: 'Tiệc cưới khách sạn', category: 'BỮA ĂN', riskLevel: 3, readTime: '5 phút', conditionTags: ['blood sugar', 'cholesterol'] },
  { id: '4', name: 'Deadline sprint cuối tháng', category: 'CĂNG THẲNG', riskLevel: 4, readTime: '3 phút', conditionTags: ['stress', 'sleep'] },
  { id: '5', name: 'Ngồi văn phòng 10 tiếng', category: 'VĂN PHÒNG', riskLevel: 3, readTime: '2 phút', conditionTags: ['back pain', 'circulation'] },
  { id: '6', name: 'Lẩu công ty cuối năm', category: 'CÔNG TÁC', riskLevel: 4, readTime: '4 phút', conditionTags: ['uric acid', 'blood pressure'] },
];

export function ScenarioSearchScreen({ onSelectScenario }: ScenarioSearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredScenarios = SCENARIOS.filter((scenario) => {
    const matchesSearch =
      searchQuery === '' ||
      scenario.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === null || 
      selectedFilter === 'TẤT CẢ' || 
      scenario.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', paddingBottom: '72px' }}>
      <div className="fw-container" style={{ paddingTop: '20px', paddingBottom: 0 }}>
        {/* Search bar */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Bạn ăn ở đâu tối nay?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fw-body-m"
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '0 16px',
              color: '#041E3A',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#041E3A';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#EBEBF0';
            }}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {FILTER_CHIPS.map((chip) => {
            const isSelected = selectedFilter === chip;

            return (
              <button
                key={chip}
                onClick={() => setSelectedFilter(isSelected ? null : chip)}
                className={isSelected ? 'fw-badge fw-badge-navy' : 'fw-badge fw-badge-outline'}
                style={{ cursor: 'pointer', transition: 'all 120ms ease-out' }}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Result cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              className="fw-btn-reset fw-card-hover"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '12px',
                textAlign: 'left',
                transition: 'background-color 120ms ease-out',
              }}
            >
              {/* Scenario name */}
              <div className="fw-body-l" style={{ fontWeight: 600 }}>
                {scenario.name}
              </div>

              {/* Meta row 1: Category badge + risk dots + read time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="fw-badge fw-badge-outline">
                  {scenario.category}
                </span>

                {/* Risk dots */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: i < scenario.riskLevel ? '#DC2626' : '#EBEBF0',
                      }}
                    />
                  ))}
                </div>

                <span className="fw-micro fw-text-grey">
                  {scenario.readTime}
                </span>
              </div>

              {/* Meta row 2: Condition tags */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 400,
                  color: '#9D9FA3',
                  letterSpacing: '0',
                }}
              >
                {scenario.conditionTags.join(' · ')}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
