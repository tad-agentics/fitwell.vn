import React, { useState } from 'react';
import { MicroActionTimerScreen } from './MicroActionTimerScreen';
import { TimerCompleteScreen } from './TimerCompleteScreen';
import { useMicroActions, useLogActionSession } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';

interface MicroActionFlowProps {
  onComplete: () => void;
  actionIds?: string[]; // Optional: specific action IDs to run. If not provided, loads all actions.
}

// Map DB category to display label
const CATEGORY_LABEL: Record<string, string> = {
  morning_activation: 'MORNING ACTIVATION',
  gentle_stretch: 'GENTLE STRETCH',
  spinal_mobility: 'SPINAL DECOMPRESSION',
  desk_reset: 'DESK RESET',
  energy_boost: 'ENERGY BOOST',
  breathing: 'BREATHING',
  hydration_recovery: 'HEAVY NIGHT RECOVERY',
  metabolic_support: 'METABOLIC SUPPORT',
};

const CONTEXT_LABEL: Record<string, string> = {
  office: 'VĂN PHÒNG',
  private: 'RIÊNG TƯ',
  transit: 'DI CHUYỂN',
};

type ActionState = 'preStart' | 'complete';

export function MicroActionFlow({ onComplete, actionIds }: MicroActionFlowProps) {
  const { data: allActions } = useMicroActions();
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const userId = session?.user?.id;
  const language = profile?.language ?? 'vi';
  const logActionSession = useLogActionSession();

  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [actionState, setActionState] = useState<ActionState>('preStart');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Filter actions based on provided IDs, or use first 3 as default
  const actions = React.useMemo(() => {
    if (!allActions) return [];
    if (actionIds && actionIds.length > 0) {
      return actionIds
        .map((id) => allActions.find((a) => a.id === id))
        .filter(Boolean) as typeof allActions;
    }
    // Default: return first 3 actions
    return allActions.slice(0, 3);
  }, [allActions, actionIds]);

  if (!allActions || actions.length === 0) {
    return null;
  }

  const currentAction = actions[currentActionIndex];
  const nextAction =
    currentActionIndex < actions.length - 1 ? actions[currentActionIndex + 1] : undefined;

  if (!currentAction) {
    onComplete();
    return null;
  }

  const getName = (a: (typeof actions)[0]) => (language === 'vi' ? a.title_vi : a.title_en);
  const getDesc = (a: (typeof actions)[0]) => (language === 'vi' ? a.description_vi : a.description_en);
  const getCategoryLabel = (a: (typeof actions)[0]) => CATEGORY_LABEL[a.category] ?? a.category.toUpperCase();
  const getContextLabel = (a: (typeof actions)[0]) =>
    CONTEXT_LABEL[(a.context_tags ?? [])[0] ?? 'private'] ?? 'RIÊNG TƯ';
  const getThumb = (a: (typeof actions)[0]) =>
    a.video_thumb_url ?? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=900&fit=crop';
  const getVideo = (a: (typeof actions)[0]) =>
    a.video_url ?? a.video_thumb_url ?? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=900&fit=crop';

  const handleActionComplete = () => {
    // Log the completed action session
    if (userId && currentAction) {
      logActionSession.mutate({
        user_id: userId,
        action_id: currentAction.id,
        duration_seconds: currentAction.duration_seconds,
      });
    }
    setActionState('complete');
  };

  const handleAdvanceToNext = () => {
    if (currentActionIndex < actions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentActionIndex(currentActionIndex + 1);
        setActionState('preStart');
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (currentActionIndex < actions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentActionIndex(currentActionIndex + 1);
        setActionState('preStart');
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  return (
    <div
      className="fw-full"
      style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 300ms ease-out' }}
    >
      {actionState === 'complete' ? (
        <TimerCompleteScreen
          category={getCategoryLabel(currentAction)}
          context={getContextLabel(currentAction)}
          completedActionName={getName(currentAction)}
          videoEndFrameUrl={getThumb(currentAction)}
          currentStep={currentActionIndex + 1}
          totalSteps={actions.length}
          nextAction={
            nextAction
              ? {
                  actionName: getName(nextAction),
                  durationSeconds: nextAction.duration_seconds,
                  videoThumbnailUrl: getThumb(nextAction),
                }
              : undefined
          }
          onAdvance={handleAdvanceToNext}
        />
      ) : (
        <MicroActionTimerScreen
          category={getCategoryLabel(currentAction)}
          context={getContextLabel(currentAction)}
          actionName={getName(currentAction)}
          rationale={getDesc(currentAction)}
          durationSeconds={currentAction.duration_seconds}
          videoUrl={getVideo(currentAction)}
          videoThumbnailUrl={getThumb(currentAction)}
          currentStep={currentActionIndex + 1}
          totalSteps={actions.length}
          onComplete={handleActionComplete}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
}
