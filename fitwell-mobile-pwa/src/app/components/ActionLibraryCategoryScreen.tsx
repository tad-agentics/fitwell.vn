import React, { useMemo } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { useMicroActions } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

interface ActionLibraryCategoryScreenProps {
  categoryId: string;
  onBack: () => void;
  onNavigate: (screen: string, actionId?: string) => void;
  onRunSequence: (categoryId: string) => void;
}

// Map slug → DB category values
const SLUG_TO_DB_CATEGORIES: Record<string, string[]> = {
  'phuc-hoi': ['hydration_recovery', 'gentle_stretch'],
  'sang': ['morning_activation'],
  'van-phong': ['desk_reset', 'energy_boost'],
  'cang-thang': ['breathing'],
  'ngu': ['gentle_stretch'],
  'mo-mau': ['metabolic_support'],
  'lung': ['spinal_mobility'],
};

// Map slug → display name
const SLUG_TO_NAME: Record<string, string> = {
  'phuc-hoi': 'Recovery',
  'sang': 'Morning Activation',
  'van-phong': 'Office Movement',
  'cang-thang': 'Stress Reset',
  'ngu': 'Sleep Preparation',
  'mo-mau': 'Metabolic Support',
  'lung': 'Spinal Mobility',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ActionLibraryCategoryScreen({
  categoryId,
  onBack,
  onNavigate,
  onRunSequence,
}: ActionLibraryCategoryScreenProps) {
  const { data: allActions, isLoading } = useMicroActions();
  const profile = useAuthStore((s) => s.profile);
  const language = profile?.language ?? 'vi';

  const dbCategories = SLUG_TO_DB_CATEGORIES[categoryId];
  const categoryName = SLUG_TO_NAME[categoryId] ?? categoryId;

  const actions = useMemo(() => {
    if (!allActions || !dbCategories) return [];
    return allActions.filter((a) => dbCategories.includes(a.category));
  }, [allActions, dbCategories]);

  if (!dbCategories) {
    return (
      <div style={{ padding: '20px' }}>
        <button onClick={onBack}>← Back</button>
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
        paddingBottom: '72px',
      }}
    >
      {/* Back arrow - top-left */}
      <div style={{ padding: '16px 20px 0' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={24} color="#041E3A" strokeWidth={1.5} />
        </button>
      </div>

      {/* Category header card - Navy background */}
      <div
        style={{
          backgroundColor: '#041E3A',
          padding: '32px',
          borderRadius: '0',
          marginBottom: '16px',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.5px',
            color: '#9D9FA3',
            textTransform: 'uppercase',
            marginBottom: '4px',
            lineHeight: '1.0',
          }}
        >
          DANH MỤC
        </div>

        {/* Category name */}
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1.3,
            margin: '0 0 8px 0',
          }}
        >
          {categoryName}
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.70)',
            lineHeight: 1.5,
            margin: '0 0 16px 0',
          }}
        >
          {actions.length} hành động
        </p>

        {/* Run all CTA - only if 2+ actions */}
        {actions.length > 1 && (
          <button
            onClick={() => onRunSequence(categoryId)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.5px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '0 0 2px 0',
              lineHeight: '1.0',
            }}
          >
            CHẠY CẢ {actions.length}
          </button>
        )}
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

      {/* Action list - Vertical stack */}
      <div style={{ padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {actions.map((action) => {
            const name = language === 'vi' ? action.title_vi : action.title_en;
            const desc = language === 'vi' ? action.description_vi : action.description_en;
            const thumbUrl =
              action.video_thumb_url ??
              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=96&h=128&fit=crop';

            return (
              <div
                key={action.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EBEBF0',
                  borderRadius: '4px',
                  padding: '16px',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                {/* Video thumbnail - Left side (96×128px) */}
                <div
                  style={{
                    position: 'relative',
                    width: '96px',
                    height: '128px',
                    flexShrink: 0,
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={thumbUrl}
                    alt={name}
                    style={{
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
                      backgroundColor: 'rgba(4, 30, 58, 0.30)',
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

                {/* Text content - Right side */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Action name */}
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#041E3A',
                      lineHeight: 1.3,
                      marginBottom: '4px',
                    }}
                  >
                    {name}
                  </div>

                  {/* Duration */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                      marginBottom: '8px',
                      lineHeight: '1.0',
                    }}
                  >
                    {formatDuration(action.duration_seconds)}
                  </div>

                  {/* Full rationale - 2-3 lines */}
                  <div
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#9D9FA3',
                      lineHeight: 1.5,
                      marginBottom: '12px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {desc}
                  </div>

                  {/* CTA button */}
                  <button
                    onClick={() => onNavigate('microAction', action.id)}
                    style={{
                      width: '100%',
                      height: '40px',
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
                      transition: 'background-color 150ms ease-out',
                      lineHeight: '1.0',
                      marginTop: 'auto',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0A3055';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#041E3A';
                    }}
                  >
                    BẮT ĐẦU
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
