import React, { useState } from 'react';
import { MicroActionTimerScreen } from './MicroActionTimerScreen';
import { TimerCompleteScreen } from './TimerCompleteScreen';

interface MicroActionFlowProps {
  onComplete: () => void;
}

interface MicroAction {
  category: string;
  context: string;
  actionName: string;
  rationale: string;
  durationSeconds: number;
  videoUrl: string; // Full 9:16 video URL
  videoThumbnailUrl: string; // First frame (starting position)
  videoEndFrameUrl: string; // Last frame (end position - matches starting)
}

// Mock data - In production, these would be actual video URLs
const MICRO_ACTIONS: MicroAction[] = [
  {
    category: 'SPINAL DECOMPRESSION',
    context: 'RIÊNG TƯ',
    actionName: 'Nằm Thư Giãn Thắt Lưng',
    rationale: '8 tiếng ngồi nén đĩa L4-L5 thêm ~30%. Bài này giải nén. 3 phút, nằm sàn, gối lên ngực.',
    durationSeconds: 180, // 3:00
    videoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=900&fit=crop', // PLACEHOLDER: Demo video, replace with production content
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=900&fit=crop',
    videoEndFrameUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=900&fit=crop',
  },
  {
    category: 'HEAVY NIGHT RECOVERY',
    context: 'RIÊNG TƯ',
    actionName: 'Nước ấm',
    rationale: 'Hỗ trợ gan sau khi nhậu nặng. Uống từ từ trong 3 phút.',
    durationSeconds: 180, // 3:00
    videoUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=900&fit=crop', // PLACEHOLDER: Demo video, replace with production content
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=900&fit=crop',
    videoEndFrameUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=900&fit=crop',
  },
  {
    category: 'HEAVY NIGHT RECOVERY',
    context: 'RIÊNG TƯ',
    actionName: 'Thở sâu',
    rationale: 'Giảm stress từ độc tố còn lại trong cơ thể. Mỗi hơi thở giúp oxy hóa máu tốt hơn.',
    durationSeconds: 60, // 1:00
    videoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=900&fit=crop', // PLACEHOLDER: Demo video, replace with production content
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=900&fit=crop',
    videoEndFrameUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=900&fit=crop',
  },
];

type ActionState = 'preStart' | 'complete';

export function MicroActionFlow({ onComplete }: MicroActionFlowProps) {
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [actionState, setActionState] = useState<ActionState>('preStart');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentAction = MICRO_ACTIONS[currentActionIndex];
  const nextAction = currentActionIndex < MICRO_ACTIONS.length - 1
    ? MICRO_ACTIONS[currentActionIndex + 1]
    : undefined;

  const handleActionComplete = () => {
    // When timer finishes, show complete screen
    setActionState('complete');
  };

  const handleAdvanceToNext = () => {
    if (currentActionIndex < MICRO_ACTIONS.length - 1) {
      // Complete → Next Pre-start crossfade transition (300ms)
      setIsTransitioning(true);
      
      setTimeout(() => {
        // Move to next action
        setCurrentActionIndex(currentActionIndex + 1);
        setActionState('preStart');
        setIsTransitioning(false);
      }, 300); // Match crossfade duration
    } else {
      // All actions complete - exit flow
      onComplete();
    }
  };

  const handleSkip = () => {
    // Skip directly to next action without showing complete screen
    if (currentActionIndex < MICRO_ACTIONS.length - 1) {
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

  // Wrapper with crossfade transition
  return (
    <div className="fw-full" style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 300ms ease-out' }}>
      {/* Render based on current state */}
      {actionState === 'complete' ? (
        <TimerCompleteScreen
          category={currentAction.category}
          context={currentAction.context}
          completedActionName={currentAction.actionName}
          videoEndFrameUrl={currentAction.videoEndFrameUrl}
          currentStep={currentActionIndex + 1}
          totalSteps={MICRO_ACTIONS.length}
          nextAction={nextAction ? {
            actionName: nextAction.actionName,
            durationSeconds: nextAction.durationSeconds,
            videoThumbnailUrl: nextAction.videoThumbnailUrl,
          } : undefined}
          onAdvance={handleAdvanceToNext}
        />
      ) : (
        <MicroActionTimerScreen
          category={currentAction.category}
          context={currentAction.context}
          actionName={currentAction.actionName}
          rationale={currentAction.rationale}
          durationSeconds={currentAction.durationSeconds}
          videoUrl={currentAction.videoUrl}
          videoThumbnailUrl={currentAction.videoThumbnailUrl}
          currentStep={currentActionIndex + 1}
          totalSteps={MICRO_ACTIONS.length}
          onComplete={handleActionComplete}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
}
