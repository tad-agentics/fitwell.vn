import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ScenarioPlaybookScreenProps {
  scenarioId: string;
  onConfirm: () => void;
  onBack: () => void;
}

interface DeskBreak {
  time: string;
  action: string;
}

/**
 * Scenario Playbook Screen (Screen 16 - Redesigned v2.0)
 * 
 * Full-view scenario playbook with 5 sections:
 * 1. TRƯỚC KHI ĐẾN (or TRƯỚC KHI BẮT ĐẦU for desk/stress)
 * 2. 3 QUY TẮC TỐI NAY (or HÔM NAY for desk/stress)
 * 3. CHIẾN LƯỢC BỮA ĂN (for food/drink) or LỊCH NGHỈ NGƠI (for desk/stress)
 * 4. MÓN NÊN CHỌN / MÓN TRÁNH (for food/drink) or TRÁNH (for desk/stress)
 * 5. NẾU BẠN ĐÃ Ở ĐÓ RỒI (updated from "ĐÃ ĐẾN RỒI")
 * 
 * Redesign v2.0 changes:
 * - Added condition context line below risk dots (Section 1)
 * - Renamed "CHIẾN LƯỢC UỐNG" → "CHIẾN LƯỢC BỮA ĂN"
 * - For desk/stress: Section 3 becomes "LỊCH NGHỈ NGƠI"
 * - Renamed "NẾU BẠN ĐÃ ĐẾN RỒI" → "NẾU BẠN ĐÃ Ở ĐÓ RỒI"
 */
export function ScenarioPlaybookScreen({
  scenarioId,
  onConfirm,
  onBack,
}: ScenarioPlaybookScreenProps) {
  // Mock data - would come from scenario database
  const scenario = {
    type: 'food_drink', // 'food_drink' | 'desk' | 'stress'
    name: 'Nhà hàng hải sản đối tác',
    category: 'HẢI SẢN',
    riskLevel: 5,
    riskConditions: ['axit uric', 'mỡ máu'], // User's declared conditions affected by this scenario
    imageUrl: 'https://images.unsplash.com/photo-1758580815151-254c8aa7ce75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZWFmb29kJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc3MTcxNjU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    biomarkerContext: 'Gan (ALT 68) · Mỡ máu (TG 245)',
  };

  const isFoodDrink = scenario.type === 'food_drink';
  const isDeskStress = scenario.type === 'desk' || scenario.type === 'stress';

  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', position: 'relative', paddingBottom: '88px' }}>
      {/* Header: Full-bleed image with overlay (food/drink) or Navy header (desk/stress) */}
      {isFoodDrink ? (
        <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
          {/* Background image */}
          <ImageWithFallback
            src={scenario.imageUrl}
            alt="Scenario header"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Dark overlay */}
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
              {scenario.name}
            </h1>
          </div>
        </div>
      ) : (
        // Desk/Stress: Navy header (no image)
        <div
          style={{
            background: '#041E3A',
            minHeight: '160px',
            padding: '20px 20px 24px',
            position: 'relative',
          }}
        >
          {/* Back button */}
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

          {/* Category eyebrow */}
          <div className="fw-eyebrow" style={{ color: '#9D9FA3', marginBottom: '4px' }}>
            {scenario.category}
          </div>

          {/* Scenario name */}
          <h1 className="fw-heading-1" style={{ color: '#FFFFFF', margin: 0 }}>
            {scenario.name}
          </h1>
        </div>
      )}

      {/* Risk level, biomarker context, and NEW: condition context line */}
      <div className="fw-bg-white fw-border-bottom" style={{ padding: '16px 20px' }}>
        {/* Risk dots row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          {/* Risk dots */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: index < scenario.riskLevel ? '#DC2626' : '#EBEBF0',
                }}
              />
            ))}
          </div>

          {/* Biomarker context */}
          <div className="fw-body-s fw-text-grey">
            {scenario.biomarkerContext}
          </div>
        </div>

        {/* NEW: Condition context line - shows which declared conditions this scenario affects */}
        <div
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: 1.5,
            color: '#9D9FA3',
          }}
        >
          Rủi ro cao cho {scenario.riskConditions.join(' + ')}
        </div>
      </div>

      {/* Content sections */}
      <div className="fw-container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        {/* Section 1: TRƯỚC KHI ĐẾN (food/drink) or TRƯỚC KHI BẮT ĐẦU (desk/stress) */}
        <div className="fw-card" style={{ marginBottom: '16px' }}>
          <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
            {isFoodDrink ? 'TRƯỚC KHI ĐẾN' : 'TRƯỚC KHI BẮT ĐẦU'}
          </div>

          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              Uống 500ml nước trước khi xuất phát
            </li>
            <li className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              Ăn nhẹ trước — tránh đói khi đến
            </li>
            <li className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              Đặt kế hoạch về nhà trước 11h
            </li>
          </ul>
        </div>

        {/* Section 2: 3 QUY TẮC TỐI NAY (food/drink) or HÔM NAY (desk/stress) */}
        <div className="fw-card" style={{ marginBottom: '16px' }}>
          <div className="fw-eyebrow" style={{ marginBottom: '20px' }}>
            {isFoodDrink ? '3 QUY TẮC TỐI NAY' : '3 QUY TẮC HÔM NAY'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div className="fw-body-l fw-text-navy" style={{ fontWeight: 600, marginBottom: '4px' }}>
                1. Không uống rượu trắng
              </div>
              <div className="fw-body-m fw-text-grey">
                Gan bạn đang quá tải. Rượu trắng gây tổn thương gấp đôi bia.
              </div>
            </div>

            <div>
              <div className="fw-body-l fw-text-navy" style={{ fontWeight: 600, marginBottom: '4px' }}>
                2. Tối đa 2 lon bia
              </div>
              <div className="fw-body-m fw-text-grey">
                Uống chậm, xen kẽ với nước lọc mỗi lon.
              </div>
            </div>

            <div>
              <div className="fw-body-l fw-text-navy" style={{ fontWeight: 600, marginBottom: '4px' }}>
                3. Từ chối hải sản chiên
              </div>
              <div className="fw-body-m fw-text-grey">
                Cholesterol + dầu chiên = nguy hiểm nhất cho mỡ máu của bạn tối nay.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: CHIẾN LƯỢC BỮA ĂN (food/drink) or LỊCH NGHỈ NGƠI (desk/stress) */}
        <div className="fw-card" style={{ marginBottom: '16px' }}>
          <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
            {isFoodDrink ? 'CHIẾN LƯỢC BỮA ĂN' : 'LỊCH NGHỈ NGƠI'}
          </div>

          {isFoodDrink ? (
            // Food/Drink: Drinking strategy items
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                1 ly nước lọc trước mỗi lon bia
              </li>
              <li className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Uống chậm — 1 lon trong 30 phút
              </li>
              <li className="fw-body-m fw-text-navy" style={{ paddingLeft: '20px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Từ chối rượu sau 10h tối
              </li>
            </ul>
          ) : (
            // Desk/Stress: Rest schedule timeline (from DeskStressPlaybookScreen)
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingLeft: '16px',
                position: 'relative',
              }}
            >
              {/* Vertical line connecting dots */}
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

              {/* Mock desk breaks data */}
              {[
                { time: '10:00', action: 'Cat-Cow Stretch (90s)' },
                { time: '12:00', action: 'Walk + hydrate (5 phút)' },
                { time: '15:00', action: 'Eye rest (3 phút)' },
                { time: '17:00', action: 'Shoulder rolls (60s)' },
              ].map((breakItem, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {/* Dot */}
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

                  {/* Time */}
                  <div className="fw-eyebrow" style={{ color: '#9D9FA3' }}>
                    {breakItem.time}
                  </div>

                  {/* Action */}
                  <div className="fw-body-m fw-text-navy">
                    {breakItem.action}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4a: MÓN NÊN CHỌN (food/drink only) */}
        {isFoodDrink && (
          <div className="fw-card" style={{ marginBottom: '16px' }}>
            <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
              MÓN NÊN CHỌN
            </div>

            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li className="fw-body-m" style={{ paddingLeft: '20px', position: 'relative', color: '#059669' }}>
                <span style={{ position: 'absolute', left: 0 }}>✓</span>
                Hải sản hấp hoặc nướng
              </li>
              <li className="fw-body-m" style={{ paddingLeft: '20px', position: 'relative', color: '#059669' }}>
                <span style={{ position: 'absolute', left: 0 }}>✓</span>
                Rau luộc hoặc salad
              </li>
              <li className="fw-body-m" style={{ paddingLeft: '20px', position: 'relative', color: '#059669' }}>
                <span style={{ position: 'absolute', left: 0 }}>✓</span>
                Canh chua hoặc canh rau
              </li>
            </ul>
          </div>
        )}

        {/* Section 4b: MÓN TRÁNH (food/drink) or TRÁNH (desk/stress) */}
        <div className="fw-card" style={{ marginBottom: '16px' }}>
          <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
            {isFoodDrink ? 'MÓN TRÁNH' : 'TRÁNH'}
          </div>

          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li className="fw-body-m" style={{ paddingLeft: '20px', position: 'relative', color: '#DC2626' }}>
              <span style={{ position: 'absolute', left: 0 }}>✗</span>
              {isFoodDrink ? 'Hải sản chiên — cholesterol + dầu' : 'Ngồi liên tục >2 tiếng'}
            </li>
            <li className="fw-body-m" style={{ paddingLeft: '20px', position: 'relative', color: '#DC2626' }}>
              <span style={{ position: 'absolute', left: 0 }}>✗</span>
              {isFoodDrink ? 'Nước sốt béo (bơ tỏi, sốt kem)' : 'Bỏ bữa trưa'}
            </li>
            <li className="fw-body-m" style={{ paddingLeft: '20px', position: 'relative', color: '#DC2626' }}>
              <span style={{ position: 'absolute', left: 0 }}>✗</span>
              {isFoodDrink ? 'Đồ nhậu nhiều dầu mỡ' : 'Caffeine sau 3h chiều'}
            </li>
          </ul>
        </div>

        {/* Section 5: NẾU BẠN ĐÃ Ở ĐÓ RỒI (updated from "ĐÃ ĐẾN RỒI") */}
        <div className="fw-card">
          <div className="fw-eyebrow" style={{ marginBottom: '16px' }}>
            NẾU BẠN ĐÃ Ở ĐÓ RỒI
          </div>

          <div className="fw-body-m fw-text-navy" style={{ marginBottom: '16px' }}>
            {isFoodDrink 
              ? 'Đã ngồi vào bàn rồi? Giữ vững 3 quy tắc. Mỗi quy tắc bạn giữ được = giảm 30% rủi ro cho gan và mỡ máu.'
              : 'Đã bắt đầu ngày làm việc rồi? Giữ vững lịch nghỉ ngơi. Mỗi lần nghỉ đúng giờ = giảm 25% căng thẳng lưng và mắt.'}
          </div>

          {/* Inline CTA - underline style */}
          <button
            className="fw-btn-reset"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#041E3A',
              borderBottom: '1px solid #041E3A',
              paddingBottom: '2px',
              cursor: 'pointer',
            }}
          >
            Đặt nhắc nhở →
          </button>
        </div>
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
