import React, { useState } from 'react';
import { MondayBriefInterceptScreen } from './MondayBriefInterceptScreen';
import { WeeklyBriefScreen } from './WeeklyBriefScreen';
import { CheckInQuestionScreen } from './CheckInQuestionScreen';
import { BackPainScoreScreen } from './BackPainScoreScreen';

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

export function MorningCheckInFlow({ onComplete }: MorningCheckInFlowProps) {
  const [currentStep, setCurrentStep] = useState<MorningCheckInStep>(() => {
    // Check if it's Monday and week 4+
    const today = new Date();
    const isMonday = today.getDay() === 1;
    const weekNumber = parseInt(localStorage.getItem('currentWeek') || '1', 10);
    const briefUnread = localStorage.getItem('weeklyBriefRead') !== 'true';
    
    // Show Monday intercept if: Monday + Week 4+ + Brief unread
    if (isMonday && weekNumber >= 4 && briefUnread) {
      return 'intercept';
    }
    
    // Otherwise start with sleep question
    return 'sleep';
  });

  // Store check-in answers
  const [sleepAnswer, setSleepAnswer] = useState<string | null>(null);
  const [bodyFeelingAnswer, setBodyFeelingAnswer] = useState<string | null>(null);
  const [backPainScore, setBackPainScore] = useState<number | null>(null);

  // Check if user has back pain condition (would come from backend in production)
  const hasBackPainCondition = () => {
    const conditions = JSON.parse(localStorage.getItem('primaryConditions') || '[]');
    return conditions.includes('back-pain');
  };

  const handleViewBrief = () => {
    setCurrentStep('brief');
  };

  const handleSkipIntercept = () => {
    setCurrentStep('sleep');
  };

  const handleBriefRead = () => {
    localStorage.setItem('weeklyBriefRead', 'true');
    setCurrentStep('sleep');
  };

  const handleSleepAnswer = (answer: string) => {
    setSleepAnswer(answer);
    setCurrentStep('bodyFeeling');
  };

  const handleBodyFeelingAnswer = (answer: string) => {
    setBodyFeelingAnswer(answer);
    
    // Conditional logic: Show back pain screen ONLY if:
    // 1. User has back_pain in primary_conditions[]
    // 2. AND body_feeling is 'Cứng' or 'Đau / Khó chịu'
    const shouldShowBackPain = 
      hasBackPainCondition() && 
      (answer === 'Cứng' || answer === 'Đau / Khó chịu');
    
    if (shouldShowBackPain) {
      setCurrentStep('backPain');
    } else {
      // Skip back pain screen and complete
      handleComplete();
    }
  };

  const handleBackPainScoreSelect = (score: number) => {
    setBackPainScore(score);
    // Auto-advance to complete
    handleComplete();
  };

  const handleComplete = () => {
    // Save all check-in data (would normally POST to backend)
    const checkInData = {
      timestamp: new Date().toISOString(),
      sleep: sleepAnswer,
      bodyFeeling: bodyFeelingAnswer,
      backPainScore: backPainScore,
    };
    console.log('Morning check-in completed:', checkInData);
    
    onComplete();
  };

  // Monday Brief Intercept (conditional - Week 4+)
  if (currentStep === 'intercept') {
    return (
      <MondayBriefInterceptScreen
        onViewBrief={handleViewBrief}
        onSkip={handleSkipIntercept}
      />
    );
  }

  // Weekly Brief (from Monday intercept)
  if (currentStep === 'brief') {
    return (
      <WeeklyBriefScreen onMarkRead={handleBriefRead} />
    );
  }

  // Morning Baseline Screen 1: Sleep Quality
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

  // Morning Baseline Screen 2: Body Feeling
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

  // Morning Baseline Screen 2a: Back Pain Score (conditional)
  // Only shown when user has back_pain condition AND feeling is 'Cứng' or 'Đau'
  if (currentStep === 'backPain') {
    return (
      <BackPainScoreScreen onScoreSelect={handleBackPainScoreSelect} />
    );
  }

  // Fallback (should not reach here)
  return null;
}
