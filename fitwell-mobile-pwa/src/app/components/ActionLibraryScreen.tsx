import React, { useState, useMemo } from 'react';
import { Play } from 'lucide-react';
import { vibrate } from '../../utils/pwa';
import { useMicroActions } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

interface ActionLibraryScreenProps {
  onNavigate: (screen: string, actionId?: string) => void;
  onSelectCategory?: (categoryId: string) => void;
}

// Map DB category to display label
const CATEGORY_LABEL: Record<string, string> = {
  morning_activation: 'SÁNG',
  gentle_stretch: 'PHỤC HỒI',
  spinal_mobility: 'LƯNG',
  desk_reset: 'VĂN PHÒNG',
  energy_boost: 'VĂN PHÒNG',
  breathing: 'CĂNG THẲNG',
  hydration_recovery: 'PHỤC HỒI',
  metabolic_support: 'MỠ MÁU',
};

// UI categories for filter chips
const CATEGORIES = ['TẤT CẢ', 'SÁNG', 'VĂN PHÒNG', 'CĂNG THẲNG', 'LƯNG', 'MỠ MÁU', 'NGỦ', 'PHỤC HỒI'];

// Map chip label → DB category values that match
const CHIP_TO_DB_CATEGORIES: Record<string, string[]> = {
  'SÁNG': ['morning_activation'],
  'VĂN PHÒNG': ['desk_reset', 'energy_boost'],
  'CĂNG THẲNG': ['breathing'],
  'LƯNG': ['spinal_mobility'],
  'MỠ MÁU': ['metabolic_support'],
  'NGỦ': ['gentle_stretch'],
  'PHỤC HỒI': ['hydration_recovery', 'gentle_stretch'],
};

// Map category label to slug for navigation
const CATEGORY_TO_ID: Record<string, string> = {
  'SÁNG': 'sang',
  'VĂN PHÒNG': 'van-phong',
  'CĂNG THẲNG': 'cang-thang',
  'LƯNG': 'lung',
  'MỠ MÁU': 'mo-mau',
  'NGỦ': 'ngu',
  'PHỤC HỒI': 'phuc-hoi',
};

const CONTEXT_FILTERS = [
  { id: 'office', label: 'Văn phòng' },
  { id: 'private', label: 'Riêng tư' },
  { id: 'transit', label: 'Di chuyển' },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ActionLibraryScreen({ onNavigate, onSelectCategory }: ActionLibraryScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('TẤT CẢ');
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const { data: actions, isLoading } = useMicroActions();
  const profile = useAuthStore((s) => s.profile);
  const language = profile?.language ?? 'vi';

  const filteredActions = useMemo(() => {
    if (!actions) return [];
    return actions.filter((action) => {
      const dbCategories = CHIP_TO_DB_CATEGORIES[selectedCategory];
      const categoryMatch = selectedCategory === 'TẤT CẢ' || dbCategories?.includes(action.category);
      const contextMatch =
        selectedContexts.length === 0 ||
        selectedContexts.some((ctx) => (action.context_tags ?? []).includes(ctx));
      return categoryMatch && contextMatch;
    });
  }, [actions, selectedCategory, selectedContexts]);

  const toggleContext = (contextId: string) => {
    setSelectedContexts((prev) =>
      prev.includes(contextId) ? prev.filter((c) => c !== contextId) : [...prev, contextId],
    );
  };

  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', paddingBottom: '72px' }}>
      <div className="fw-container" style={{ padding: '40px 20px 24px' }}>
        {/* Screen title */}
        <h1 className="fw-heading-1" style={{ margin: '0 0 16px 0' }}>
          Hành động
        </h1>

        {/* Category filter strip - horizontal scroll */}
        <div
          style={{
            marginBottom: '8px',
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              paddingBottom: '4px',
            }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              const handleCategoryClick = () => {
                if (category !== 'TẤT CẢ' && onSelectCategory) {
                  onSelectCategory(CATEGORY_TO_ID[category]);
                } else {
                  setSelectedCategory(category);
                }
              };

              return (
                <button
                  key={category}
                  onClick={handleCategoryClick}
                  className={isSelected ? 'fw-badge fw-badge-navy' : 'fw-badge fw-badge-outline'}
                  style={{
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 120ms ease-out',
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Context filter */}
        <div style={{ marginBottom: '16px' }}>
          <div className="fw-body-s fw-text-grey" style={{ marginBottom: '8px' }}>
            Bạn đang ở đâu?
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CONTEXT_FILTERS.map((context) => {
              const isSelected = selectedContexts.includes(context.id);
              return (
                <button
                  key={context.id}
                  onClick={() => toggleContext(context.id)}
                  className={isSelected ? 'fw-badge fw-badge-navy' : 'fw-badge fw-badge-outline'}
                  style={{
                    fontSize: '9px',
                    padding: '5px 8px',
                    cursor: 'pointer',
                    transition: 'all 120ms ease-out',
                  }}
                >
                  {context.label}
                </button>
              );
            })}
          </div>
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

        {/* Video grid - 2 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          {filteredActions.map((action) => {
            const name = language === 'vi' ? action.title_vi : action.title_en;
            const desc = language === 'vi' ? action.description_vi : action.description_en;
            const categoryLabel = CATEGORY_LABEL[action.category] ?? action.category.toUpperCase();
            const thumbUrl =
              action.video_thumb_url ??
              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=173&h=230&fit=crop';

            return (
              <button
                key={action.id}
                onClick={() => {
                  vibrate(50);
                  onNavigate('microAction', action.id);
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EBEBF0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: '0',
                  textAlign: 'left',
                  transition: 'transform 120ms ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* Video thumbnail */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '133%',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={thumbUrl}
                    alt={name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Light navy overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(4, 30, 58, 0.25)',
                    }}
                  />

                  {/* Play icon + duration - bottom-left */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Play
                      size={10}
                      style={{
                        color: '#FFFFFF',
                        fill: '#FFFFFF',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 400,
                        color: '#FFFFFF',
                        lineHeight: '1.0',
                      }}
                    >
                      {formatDuration(action.duration_seconds)}
                    </span>
                  </div>
                </div>

                {/* Text content */}
                <div style={{ padding: '12px' }}>
                  {/* Category eyebrow */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 400,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: '#9D9FA3',
                      marginBottom: '4px',
                      lineHeight: '1.0',
                    }}
                  >
                    {categoryLabel}
                  </div>

                  {/* Action name */}
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#041E3A',
                      lineHeight: 1.3,
                      marginBottom: '4px',
                    }}
                  >
                    {name}
                  </div>

                  {/* Rationale - 1 line truncated */}
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Total count */}
        {!isLoading && (
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 400,
              color: '#9D9FA3',
              textAlign: 'center',
              padding: '24px 0',
              lineHeight: 1.5,
            }}
          >
            {filteredActions.length} hành động
          </div>
        )}
      </div>
    </div>
  );
}
