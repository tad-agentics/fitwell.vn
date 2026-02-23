import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useScenario } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

interface ScenarioPlaybookScreenProps {
  scenarioId: string;
  onConfirm: () => void;
  onBack: () => void;
}

// Scenario type based on category
const FOOD_DRINK_CATEGORIES = ['seafood', 'drinking', 'heavy_meal', 'celebration', 'buffet', 'business_dinner'];
const DESK_STRESS_CATEGORIES = ['long_desk', 'desk', 'stress', 'stress_day'];

export function ScenarioPlaybookScreen({
  scenarioId,
  onConfirm,
  onBack,
}: ScenarioPlaybookScreenProps) {
  const { data: scenario, isLoading } = useScenario(scenarioId);
  const profile = useAuthStore((s) => s.profile);
  const language = profile?.language ?? 'vi';

  if (isLoading || !scenario) {
    return (
      <div className="fw-screen fw-bg-surface" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="fw-body-m fw-text-grey">Đang tải...</div>
      </div>
    );
  }

  const name = language === 'vi' ? scenario.title_vi : scenario.title_en;
  const description = language === 'vi' ? scenario.description_vi : scenario.description_en;
  const avoidItems = language === 'vi' ? (scenario.avoid_items_vi ?? []) : (scenario.avoid_items_en ?? []);
  const safeItems = language === 'vi' ? (scenario.safe_items_vi ?? []) : (scenario.safe_items_en ?? []);
  const conditionTags = scenario.condition_tags ?? [];
  const isFoodDrink = FOOD_DRINK_CATEGORIES.includes(scenario.category);
  const isDeskStress = DESK_STRESS_CATEGORIES.includes(scenario.category);

  // Parse meal_strategy JSON if available
  const mealStrategy = scenario.meal_strategy as {
    before?: string[];
    rules?: { title: string; description: string }[];
    strategy?: string[];
  } | null;

  // Parse desk_breaks JSON if available
  const deskBreaks = scenario.desk_breaks as {
    schedule?: { time: string; action: string }[];
  } | null;

  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', position: 'relative', paddingBottom: '88px' }}>
      {/* Header: Full-bleed image with overlay (food/drink) or Navy header (desk/stress) */}
      {isFoodDrink && scenario.image_url ? (
        <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
          <ImageWithFallback
            src={scenario.image_url}
            alt="Scenario header"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="fw-overlay-dark" />

          {/* Back button */}
          <button
            onClick={onBack}
            className="fw-btn-reset"
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              color: '#FFFFFF',
              fontSize: '24px',
              padding: '8px',
              lineHeight: 1,
            }}
          >
            ←
          </button>

          {/* Scenario name over image */}
          <div style={{ position: 'absolute', bottom: '24px', left: '20px', right: '20px' }}>
            <h1 className="fw-heading-1 fw-text-white" style={{ margin: 0 }}>
              {name}
            </h1>
          </div>
        </div>
      ) : (
        // Desk/Stress or no image: Navy header
        <div
          style={{
            background: '#041E3A',
            minHeight: '160px',
            padding: '20px 20px 24px',
            position: 'relative',
          }}
        >
          <button
            onClick={onBack}
            className="fw-btn-reset"
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              padding: '8px',
              lineHeight: 1,
              marginBottom: '16px',
            }}
          >
            ←
          </button>

          <div className="fw-eyebrow" style={{ color: '#9D9FA3', marginBottom: '4px' }}>
            {scenario.category.toUpperCase()}
          </div>

          <h1 className="fw-heading-1" style={{ color: '#FFFFFF', margin: 0 }}>
            {name}
          </h1>
        </div>
      )}

      {/* Risk level and condition context */}
      <div className="fw-bg-white fw-border-bottom" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: conditionTags.length > 0 ? '8px' : '0' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: index < scenario.risk_level ? '#DC2626' : '#EBEBF0',
                }}
              />
            ))}
          </div>
          <div className="fw-body-s fw-text-grey">
            {scenario.read_time_minutes} phút đọc
          </div>
        </div>

        {conditionTags.length > 0 && (
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: 1.5,
              color: '#9D9FA3',
            }}
          >
            Rủi ro cao cho {conditionTags.join(' + ')}
          </div>
        )}
      </div>

      {/* Content sections */}
      <div className="fw-container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        {/* Description */}
        {description && (
          <div className="fw-card" style={{ marginBottom: '16px' }}>
            <div className="fw-body-m fw-text-navy">
              {description}
            </div>
          </div>
        )}

        {/* Section: Before items (from meal_strategy.before) */}
        {mealStrategy?.before && mealStrategy.before.length > 0 && (
          <div className="fw-card" style={{ marginBottom: '16px' }}>
            <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
              {isFoodDrink ? 'TRƯỚC KHI ĐẾN' : 'TRƯỚC KHI BẮT ĐẦU'}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mealStrategy.before.map((item, idx) => (
                <li key={idx} className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section: Rules (from meal_strategy.rules) */}
        {mealStrategy?.rules && mealStrategy.rules.length > 0 && (
          <div className="fw-card" style={{ marginBottom: '16px' }}>
            <div className="fw-eyebrow" style={{ marginBottom: '20px' }}>
              {isFoodDrink ? `${mealStrategy.rules.length} QUY TẮC TỐI NAY` : `${mealStrategy.rules.length} QUY TẮC HÔM NAY`}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {mealStrategy.rules.map((rule, idx) => (
                <div key={idx}>
                  <div className="fw-body-l fw-text-navy" style={{ fontWeight: 600, marginBottom: '4px' }}>
                    {idx + 1}. {rule.title}
                  </div>
                  <div className="fw-body-m fw-text-grey">
                    {rule.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Strategy items (from meal_strategy.strategy) */}
        {mealStrategy?.strategy && mealStrategy.strategy.length > 0 && (
          <div className="fw-card" style={{ marginBottom: '16px' }}>
            <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
              CHIẾN LƯỢC BỮA ĂN
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mealStrategy.strategy.map((item, idx) => (
                <li key={idx} className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section: Desk breaks schedule (for desk/stress) */}
        {isDeskStress && deskBreaks?.schedule && deskBreaks.schedule.length > 0 && (
          <div className="fw-card" style={{ marginBottom: '16px' }}>
            <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
              LỊCH NGHỈ NGƠI
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingLeft: '16px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '3px',
                  top: '8px',
                  bottom: '8px',
                  width: '1px',
                  background: '#EBEBF0',
                }}
              />
              {deskBreaks.schedule.map((breakItem, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '-16px',
                      top: '6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#041E3A',
                    }}
                  />
                  <div className="fw-eyebrow" style={{ color: '#9D9FA3' }}>
                    {breakItem.time}
                  </div>
                  <div className="fw-body-m fw-text-navy">
                    {breakItem.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Safe items */}
        {safeItems.length > 0 && (
          <div className="fw-card" style={{ marginBottom: '16px' }}>
            <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
              MÓN NÊN CHỌN
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {safeItems.map((item, idx) => (
                <li key={idx} className="fw-body-m" style={{ paddingLeft: '20px', position: 'relative', color: '#059669' }}>
                  <span style={{ position: 'absolute', left: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section: Avoid items */}
        {avoidItems.length > 0 && (
          <div className="fw-card" style={{ marginBottom: '16px' }}>
            <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
              {isFoodDrink ? 'MÓN TRÁNH' : 'TRÁNH'}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {avoidItems.map((item, idx) => (
                <li key={idx} className="fw-body-m" style={{ paddingLeft: '20px', position: 'relative', color: '#DC2626' }}>
                  <span style={{ position: 'absolute', left: 0 }}>✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sticky CTA at bottom */}
      <div
        className="fw-bg-white"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 24px',
          borderTop: '1px solid #EBEBF0',
        }}
      >
        <button onClick={onConfirm} className="fw-btn-primary">
          VÀO RỒI — TÔI ĐÃ HIỂU
        </button>
      </div>
    </div>
  );
}
