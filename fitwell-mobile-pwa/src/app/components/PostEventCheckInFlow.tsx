import React, { useState } from 'react';
import { CheckInQuestionScreen } from './CheckInQuestionScreen';
import { PostEventTypeSelector } from './PostEventTypeSelector';
import { useAuthStore } from '@/store/authStore';
import { useInsertCheckin, useCreateRecovery } from '@/hooks/useSupabaseQuery';

interface PostEventCheckInFlowProps {
  onComplete: () => void;
}

type PostEventStep =
  | 'intensity'
  | 'eventType'
  | 'complete';

// Map UI intensity to DB values
const INTENSITY_MAP: Record<string, string> = {
  'Nặng': 'heavy',
  'Vừa': 'medium',
  'Nhẹ': 'light',
};

// Map UI event type to DB values
const EVENT_TYPE_MAP: Record<string, string> = {
  'Nhậu nặng': 'heavy_night',
  'Bữa ăn lớn': 'rich_meal',
  'Ngày làm việc dài': 'long_desk',
  'Ngày căng thẳng': 'stress_day',
  'Công tác': 'travel',
  'Tiệc / Lễ': 'celebration',
};

// Map event type to recovery variant
const RECOVERY_VARIANT_MAP: Record<string, string> = {
  'heavy_night': 'post_event',
  'rich_meal': 'metabolic',
  'long_desk': 'spinal',
  'stress_day': 'cortisol',
  'travel': 'post_event',
  'celebration': 'post_event',
};

export function PostEventCheckInFlow({ onComplete }: PostEventCheckInFlowProps) {
  const session = useAuthStore((s) => s.session);
  const userId = session?.user?.id;
  const insertCheckin = useInsertCheckin();
  const createRecovery = useCreateRecovery();

  const [currentStep, setCurrentStep] = useState<PostEventStep>('intensity');
  const [intensityAnswer, setIntensityAnswer] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);

  const handleIntensityAnswer = (answer: string) => {
    setIntensityAnswer(answer);

    const shouldShowEventType = answer === 'Nặng' || answer === 'Vừa';

    if (shouldShowEventType) {
      setCurrentStep('eventType');
    } else {
      saveAndComplete(answer, null);
    }
  };

  const handleEventTypeSelect = (selectedEventType: string) => {
    setEventType(selectedEventType);
    saveAndComplete(intensityAnswer, selectedEventType);
  };

  const saveAndComplete = (intensity: string | null, evtType: string | null) => {
    if (!userId) {
      onComplete();
      return;
    }

    const dbIntensity = intensity ? INTENSITY_MAP[intensity] : null;
    const dbEventType = evtType ? EVENT_TYPE_MAP[evtType] ?? evtType : null;

    // Save check-in
    insertCheckin.mutate(
      {
        user_id: userId,
        trigger: 'post_event',
        event_intensity: dbIntensity as any,
        event_type: dbEventType as any,
      },
      {
        onSuccess: (checkin) => {
          // If heavy or medium, create recovery protocol
          if (dbIntensity === 'heavy' || dbIntensity === 'medium') {
            createRecovery.mutate(
              {
                user_id: userId,
                checkin_id: checkin.id,
                event_type: dbEventType ?? 'heavy_night',
                intensity: dbIntensity,
                total_days: dbIntensity === 'heavy' ? 3 : 2,
                current_day: 1,
                status: 'active',
              },
              { onSettled: () => onComplete() },
            );
          } else {
            onComplete();
          }
        },
        onError: () => onComplete(),
      },
    );
  };

  if (currentStep === 'intensity') {
    return (
      <CheckInQuestionScreen
        eyebrow="POST-EVENT RECOVERY"
        question="Tối/Ngày qua thế nào?"
        subtitle="1 của 2"
        options={['Nặng', 'Vừa', 'Nhẹ']}
        onAnswer={handleIntensityAnswer}
      />
    );
  }

  if (currentStep === 'eventType') {
    return <PostEventTypeSelector onTypeSelect={handleEventTypeSelect} />;
  }

  return null;
}
