import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { requestWakeLock, releaseWakeLock, vibrate } from '../../utils/pwa';

interface MicroActionTimerScreenProps {
  category: string; // "SPINAL DECOMPRESSION"
  context: string; // "RIÊNG TƯ"
  actionName: string; // "Nằm Thư Giãn Thắt Lưng"
  rationale: string; // Why this works explanation
  durationSeconds: number; // 180 for 3 minutes
  videoUrl: string; // Full 9:16 video URL
  videoThumbnailUrl: string; // First frame of video (poster)
  currentStep?: number;
  totalSteps?: number;
  onComplete: () => void;
  onSkip: () => void;
}

type LayoutState = 'preStart' | 'running';

export function MicroActionTimerScreen({
  category,
  context,
  actionName,
  rationale,
  durationSeconds,
  videoUrl,
  videoThumbnailUrl,
  currentStep = 1,
  totalSteps = 3,
  onComplete,
  onSkip,
}: MicroActionTimerScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [layoutState, setLayoutState] = useState<LayoutState>('preStart');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [overlayOpacity, setOverlayOpacity] = useState(0.82);
  const [isRationaleExpanded, setIsRationaleExpanded] = useState(() => {
    // Check if this is first ever action
    const isFirstTime = localStorage.getItem('fitwellFirstMicroAction') !== 'true';
    if (isFirstTime) {
      localStorage.setItem('fitwellFirstMicroAction', 'true');
      return true; // Expanded on first action
    }
    return false; // Collapsed by default
  });

  // Cleanup wake lock on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || isPaused || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timer complete - trigger completion
          setIsRunning(false);
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isPaused, timeRemaining]);

  const handleTimerComplete = () => {
    // Running → Complete transition
    // Video freezes on last frame (already paused when timer hits 0)
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // Release wake lock
    releaseWakeLock();
    
    // Success haptic feedback - triple buzz pattern
    vibrate([100, 50, 100, 50, 100]);
    
    // Navy overlay fades from 0 → 0.82 over 300ms
    setOverlayOpacity(0.82);
    
    // Timer fades out, checkmark fades in handled by onComplete
    // (which triggers TimerCompleteScreen in parent)
    setTimeout(() => {
      onComplete();
    }, 300); // Wait for overlay transition to complete
  };

  const handleStart = () => {
    // Pre-start → Running transition (THE HERO MOMENT)
    setIsRunning(true);
    setLayoutState('running');
    
    // Request wake lock - prevent screen from sleeping
    requestWakeLock();
    
    // Light haptic feedback on start
    vibrate(50);
    
    // Navy overlay fades from 0.82 → 0 over 400ms
    setOverlayOpacity(0);
    
    // Video starts playing
    if (videoRef.current) {
      videoRef.current.play();
    }
    
    // Timer and action name reposition (300ms, handled by CSS transition)
  };

  const handleScreenTap = () => {
    // Tap to pause/resume (only during running state)
    if (layoutState === 'running' && isRunning) {
      // Light tap feedback
      vibrate(30);
      
      if (isPaused) {
        // Resume
        setIsPaused(false);
        requestWakeLock(); // Re-acquire wake lock
        if (videoRef.current) {
          videoRef.current.play();
        }
      } else {
        // Pause
        setIsPaused(true);
        releaseWakeLock(); // Release wake lock when paused
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    if (mins > 0) {
      return `${mins} PHÚT`;
    }
    return `${seconds} GIÂY`;
  };

  const toggleRationale = () => {
    setIsRationaleExpanded(!isRationaleExpanded);
  };

  // Layout-specific styles
  const getTimerStyle = () => {
    if (layoutState === 'preStart') {
      // Centered, large
      return {
        position: 'relative' as const,
        fontFamily: 'var(--font-display)',
        fontSize: '72px',
        fontWeight: 400,
        color: '#FFFFFF',
        lineHeight: '1.0',
        margin: '0',
        letterSpacing: '0',
        transition: 'all 300ms ease-out',
      };
    } else {
      // Top-right, small
      return {
        position: 'absolute' as const,
        top: '56px',
        right: '20px',
        fontFamily: 'var(--font-display)',
        fontSize: '48px',
        fontWeight: 400,
        color: '#FFFFFF',
        lineHeight: '1.0',
        margin: '0',
        letterSpacing: '0',
        transition: 'all 300ms ease-out',
        zIndex: 10,
      };
    }
  };

  const getActionNameStyle = () => {
    if (layoutState === 'preStart') {
      // Centered, large
      return {
        fontFamily: 'var(--font-ui)',
        fontSize: '28px',
        fontWeight: 600,
        color: '#FFFFFF',
        lineHeight: '1.3',
        margin: '0 0 8px 0',
        transition: 'all 300ms ease-out',
      };
    } else {
      // Top-center, small
      return {
        position: 'absolute' as const,
        top: '56px',
        left: '20px',
        right: '80px', // Leave room for timer on right
        fontFamily: 'var(--font-ui)',
        fontSize: '15px',
        fontWeight: 600,
        color: '#FFFFFF',
        lineHeight: '1.3',
        margin: '0',
        transition: 'all 300ms ease-out',
        zIndex: 10,
      };
    }
  };

  return (
    <div
      onClick={handleScreenTap}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: layoutState === 'running' ? 'pointer' : 'default',
      }}
    >
      {/* Video layer - full bleed */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={videoThumbnailUrl}
          playsInline
          muted
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

      {/* Navy overlay - animated opacity */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(4, 30, 58, ${overlayOpacity})`,
          transition: overlayOpacity === 0 
            ? 'background-color 400ms ease-out' 
            : 'background-color 300ms ease-out',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Pause overlay - only visible when paused */}
      {isPaused && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(4, 30, 58, 0.40)',
            zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 150ms ease-out',
            animation: 'fadeIn 150ms ease-out',
          }}
        >
          {/* Pause icon - two vertical bars */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              opacity: 0.7,
            }}
          >
            <div
              style={{
                width: '8px',
                height: '32px',
                backgroundColor: '#FFFFFF',
                borderRadius: '2px',
              }}
            />
            <div
              style={{
                width: '8px',
                height: '32px',
                backgroundColor: '#FFFFFF',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      )}

      {/* UI content layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none', // Allow clicks to pass through to screen tap handler
        }}
      >
        {/* Top zone - Badges */}
        <div
          style={{
            padding: '56px 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Category badge */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.70)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              lineHeight: '1.0',
              opacity: layoutState === 'running' ? 0 : 1,
              transition: 'opacity 300ms ease-out',
            }}
          >
            {category}
          </div>

          {/* Separator */}
          <div
            style={{
              width: '1px',
              height: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.30)',
              opacity: layoutState === 'running' ? 0 : 1,
              transition: 'opacity 300ms ease-out',
            }}
          />

          {/* Context badge */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.70)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              lineHeight: '1.0',
              opacity: layoutState === 'running' ? 0 : 1,
              transition: 'opacity 300ms ease-out',
            }}
          >
            {context}
          </div>
        </div>

        {/* Action name - positioned based on layout state */}
        <h1 style={getActionNameStyle()}>{actionName}</h1>

        {/* Timer - positioned based on layout state */}
        <div style={getTimerStyle()}>{formatTime(timeRemaining)}</div>

        {/* Pre-start center content */}
        {layoutState === 'preStart' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 20px',
            }}
          >
            {/* Centre-upper zone - Action identity */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              {/* Duration */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.70)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginTop: '8px',
                }}
              >
                {formatDuration(durationSeconds)}
              </div>
            </div>

            {/* Below dots - Progress dots */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px',
              }}
            >
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor:
                      index < currentStep
                        ? '#FFFFFF'
                        : 'rgba(255, 255, 255, 0.30)',
                  }}
                />
              ))}
            </div>

            {/* Below dots - "Why this works" collapsible */}
            <div
              style={{
                marginTop: '24px',
                width: '100%',
                maxWidth: '320px',
                pointerEvents: 'auto', // Enable clicks for this section
              }}
            >
              {/* Trigger line */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRationale();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  marginBottom: isRationaleExpanded ? '12px' : '0',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.60)',
                    textTransform: 'none',
                    letterSpacing: '0',
                  }}
                >
                  Tại sao?
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: 'rgba(255, 255, 255, 0.60)',
                    transform: isRationaleExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease-out',
                  }}
                />
              </button>

              {/* Expandable rationale text */}
              <div
                style={{
                  maxHeight: isRationaleExpanded ? '200px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 200ms ease-out',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.70)',
                    lineHeight: '1.6',
                    margin: '0',
                    textAlign: 'center',
                    opacity: isRationaleExpanded ? 1 : 0,
                    transition: 'opacity 200ms ease-out',
                  }}
                >
                  {rationale}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom zone - CTAs */}
        <div
          style={{
            padding: '0 20px',
            paddingBottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            pointerEvents: 'auto', // Enable clicks for buttons
            opacity: layoutState === 'running' ? 0 : 1,
            transition: 'opacity 300ms ease-out',
          }}
        >
          {/* Primary CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStart();
            }}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #FFFFFF',
              padding: '0 0 2px 0',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              lineHeight: '1.0',
            }}
          >
            BẮT ĐẦU
          </button>

          {/* Ghost skip */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              releaseWakeLock(); // Release wake lock on skip
              onSkip();
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.50)',
              cursor: 'pointer',
              lineHeight: '1.5',
            }}
          >
            Bỏ qua
          </button>
        </div>
      </div>

      {/* CSS animation for pause overlay fade-in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
