import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TimerCompleteScreenProps {
  category: string;
  context: string;
  completedActionName: string;
  videoEndFrameUrl: string;
  currentStep: number;
  totalSteps: number;
  nextAction?: {
    actionName: string;
    durationSeconds: number;
    videoThumbnailUrl: string;
  };
  onAdvance: () => void;
}

export function TimerCompleteScreen({
  category,
  context,
  completedActionName,
  videoEndFrameUrl,
  currentStep,
  totalSteps,
  nextAction,
  onAdvance,
}: TimerCompleteScreenProps) {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes}:${secs.toString().padStart(2, '0')}` : `${minutes}:00`;
  };

  return (
    <div className="fw-screen fw-bg-navy">
      {/* Background: Video end frame (9:16) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <ImageWithFallback
          src={videoEndFrameUrl}
          alt="Exercise complete"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Dark overlay */}
        <div className="fw-overlay-navy" />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '0 20px',
          textAlign: 'center',
        }}
      >
        {/* Top badges */}
        <div style={{ position: 'absolute', top: '56px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <div className="fw-badge fw-badge-outline" style={{ backgroundColor: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
            {category}
          </div>
          <div className="fw-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {currentStep}/{totalSteps}
          </div>
        </div>

        {/* Checkmark */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '40px', color: '#FFFFFF' }}>✓</span>
        </div>

        {/* Complete message */}
        <div className="fw-eyebrow" style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
          HOÀN THÀNH
        </div>

        <h1 className="fw-heading-1 fw-text-white" style={{ marginBottom: '40px' }}>
          {completedActionName}
        </h1>

        {/* Next action preview */}
        {nextAction ? (
          <>
            <div className="fw-body-s" style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
              Tiếp theo:
            </div>
            <div className="fw-body-l fw-text-white" style={{ fontWeight: 600, marginBottom: '8px' }}>
              {nextAction.actionName}
            </div>
            <div className="fw-body-s" style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '40px' }}>
              {formatDuration(nextAction.durationSeconds)}
            </div>

            <button
              onClick={onAdvance}
              className="fw-btn-reset"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#FFFFFF',
                borderBottom: '1px solid #FFFFFF',
                paddingBottom: '2px',
              }}
            >
              TIẾP TỤC →
            </button>
          </>
        ) : (
          <button
            onClick={onAdvance}
            className="fw-btn-reset"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#FFFFFF',
              borderBottom: '1px solid #FFFFFF',
              paddingBottom: '2px',
            }}
          >
            HOÀN TẤT →
          </button>
        )}
      </div>
    </div>
  );
}
