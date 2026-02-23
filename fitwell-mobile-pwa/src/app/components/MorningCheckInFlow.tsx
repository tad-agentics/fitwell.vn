import React, { useState } from 'react';
import { MondayBriefInterceptScreen } from './MondayBriefInterceptScreen';
import { WeeklyBriefScreen } from './WeeklyBriefScreen';
import { CheckInQuestionScreen } from './CheckInQuestionScreen';
import { BackPainScoreScreen } from './BackPainScoreScreen';
import { useAuthStore } from '@/store/authStore';
import { useInsertCheckin, useMarkBriefRead, useLatestBrief } from '@/hooks/useSupabaseQuery';

interface MorningCheckInFlowProps {
  onComplete: () => void;
}

type MorningCheckInStep =
  | 'intercept'
  | 'brief'
  | 'sleep'
  | 'bodyFeeling'
  | 'backPain'
  | 'complete';

const SLEEP_MAP: Record<string, string> = {
  'Ngon': 'good',
  'Chập chờn': 'fair',
  'Kém': 'poor',
};

const BODY_MAP: Record<string, string> = {
  'Ổn': 'fresh',
  'Cứng': 'stiff',
  'Đau / Khó chịu': 'sore',
  'Mệt': 'heavy',
};

export function MorningCheckInFlow({ onComplete }: MorningCheckInFlowProps) {
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const userId = session?.user?.id;
  const insertCheckin = useInsertCheckin();
  const markBriefRead = useMarkBriefRead();
  const { data: latestBrief } = useLatestBrief(userId);

  const hasBackPainCondition = profile?.primary_conditions?.includes('back_pain') ?? false;

  const [currentStep, setCurrentStep] = useState<MorningCheckInStep>(() => {
    const today = new Date();
    const isMonday = today.getDay() === 1;
    const briefUnread = latestBrief && !latestBrief.is_read;
    const weeksCompleted = profile?.brief_weeks_completed ?? 0;

    if (isMonday && weeksCompleted >= 4 && briefUnread) {
      return 'intercept';
    }
    return 'sleep';
  });

  const [sleepAnswer, setSleepAnswer] = useState<string | null>(null);
  const [bodyFeelingAnswer, setBodyFeelingAnswer] = useState<string | null>(null);

  const handleViewBrief = () => {
    setCurrentStep('brief');
  };

  const handleSkipIntercept = () => {
    setCurrentStep('sleep');
  };

  const handleBriefRead = () => {
    if (latestBrief && userId) {
      markBriefRead.mutate({ id: latestBrief.id, userId });
    }
    setCurrentStep('sleep');
  };

  const handleSleepAnswer = (answer: string) => {
    setSleepAnswer(answer);
    setCurrentStep('bodyFeeling');
  };

  const handleBodyFeelingAnswer = (answer: string) => {
    setBodyFeelingAnswer(answer);

    const shouldShowBackPain =
      hasBackPainCondition &&
      (answer === 'Cứng' || answer === 'Đau / Khó chịu');

    if (shouldShowBackPain) {
      setCurrentStep('backPain');
    } else {
      saveAndComplete(answer, null);
    }
  };

  const handleBackPainScoreSelect = (score: number) => {
    saveAndComplete(bodyFeelingAnswer, score);
  };

  const saveAndComplete = (bodyFeeling: string | null, bpScore: number | null) => {
    if (!userId) {
      onComplete();
      return;
    }

    insertCheckin.mutate(
      {
        user_id: userId,
        trigger: 'morning',
        sleep_quality: sleepAnswer ? (SLEEP_MAP[sleepAnswer] as any) : null,
        body_feeling: bodyFeeling ? (BODY_MAP[bodyFeeling] as any) : null,
        back_pain_score: bpScore,
      },
      { onSettled: () => onComplete() },
    );
  };

  if (currentStep === 'intercept') {
    return (
      <MondayBriefInterceptScreen
        onViewBrief={handleViewBrief}
        onSkip={handleSkipIntercept}
      />
    );
  }

  if (currentStep === 'brief') {
    return <WeeklyBriefScreen onMarkRead={handleBriefRead} />;
  }

  if (currentStep === 'sleep') {
    return (
      <CheckInQuestionScreen
        eyebrow="MORNING BASELINE"
        question="Bạn ngủ thế nào?"
        options={['Ngon', 'Chập chờn', 'Kém']}
        onAnswer={handleSleepAnswer}
      />
    );
  }

  if (currentStep === 'bodyFeeling') {
    return (
      <CheckInQuestionScreen
        eyebrow="MORNING BASELINE"
        question="Cơ thể cảm thấy sao?"
        options={['Ổn', 'Cứng', 'Đau / Khó chịu', 'Mệt']}
        onAnswer={handleBodyFeelingAnswer}
      />
    );
  }

  if (currentStep === 'backPain') {
    return <BackPainScoreScreen onScoreSelect={handleBackPainScoreSelect} />;
  }

  return null;
}
