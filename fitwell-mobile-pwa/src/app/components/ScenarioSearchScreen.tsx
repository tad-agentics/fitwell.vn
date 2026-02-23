import React, { useState, useMemo } from 'react';
import { useScenarios } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

interface ScenarioSearchScreenProps {
  onSelectScenario: (scenarioId: string) => void;
}

const FILTER_CHIPS = ['TẤT CẢ', 'HẢI SẢN & NHẬU', 'BỮA ĂN', 'VĂN PHÒNG', 'CĂNG THẲNG', 'CÔNG TÁC'];

const CATEGORY_MAP: Record<string, string[]> = {
  'HẢI SẢN & NHẬU': ['seafood', 'drinking', 'heavy_meal'],
  'BỮA ĂN': ['heavy_meal', 'celebration', 'buffet'],
  'VĂN PHÒNG': ['long_desk', 'desk'],
  'CĂNG THẲNG': ['stress', 'stress_day'],
  'CÔNG TÁC': ['travel', 'business_dinner'],
};

export function ScenarioSearchScreen({ onSelectScenario }: ScenarioSearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { data: scenarios, isLoading } = useScenarios();
  const profile = useAuthStore((s) => s.profile);
  const language = profile?.language ?? 'vi';

  const filteredScenarios = useMemo(() => {
    if (!scenarios) return [];
    return scenarios.filter((scenario) => {
      const name = language === 'vi' ? scenario.title_vi : scenario.title_en;
      const matchesSearch =
        searchQuery === '' ||
        name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        selectedFilter === null ||
        selectedFilter === 'TẤT CẢ' ||
        CATEGORY_MAP[selectedFilter]?.includes(scenario.category);
      return matchesSearch && matchesFilter;
    });
  }, [scenarios, searchQuery, selectedFilter, language]);

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

        {/* Loading */}
        {isLoading && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 0',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              color: '#9D9FA3',
            }}
          >
            Đang tải...
          </div>
        )}

        {/* Result cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredScenarios.map((scenario) => {
            const name = language === 'vi' ? scenario.title_vi : scenario.title_en;
            const conditionTags = scenario.condition_tags ?? [];

            return (
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
                <div className="fw-body-l" style={{ fontWeight: 600 }}>
                  {name}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="fw-badge fw-badge-outline">
                    {scenario.category.toUpperCase()}
                  </span>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: i < scenario.risk_level ? '#DC2626' : '#EBEBF0',
                        }}
                      />
                    ))}
                  </div>

                  <span className="fw-micro fw-text-grey">
                    {scenario.read_time_minutes} phút
                  </span>
                </div>

                {conditionTags.length > 0 && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                    }}
                  >
                    {conditionTags.join(' · ')}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!isLoading && filteredScenarios.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 0',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              color: '#9D9FA3',
            }}
          >
            Không tìm thấy kịch bản phù hợp
          </div>
        )}
      </div>
    </div>
  );
}
