import React, { useState } from 'react';
import { CheckInQuestionScreen } from './CheckInQuestionScreen';
import { ContextSelectorScreen } from './ContextSelectorScreen';

interface CheckInFlowProps {
  onComplete: () => void;
}

type CheckInType = 'morning' | 'postEvent' | 'midday';
type FlowStep = 'questions' | 'context';

interface CheckInQuestion {
  type: CheckInType;
  eyebrow: string;
  question: string;
  options: string[];
}

const CHECK_IN_QUESTIONS: CheckInQuestion[] = [
  {
    type: 'morning',
    eyebrow: 'MORNING BASELINE',
    question: 'Bạn ngủ thế nào?',
    options: ['Ngon', 'Chập chờn', 'Kém'],
  },
  {
    type: 'postEvent',
    eyebrow: 'POST-EVENT RECOVERY',
    question: 'Tối/Ngày qua thế nào?',
    options: ['Nặng', 'Vừa', 'Nhẹ'],
  },
  {
    type: 'midday',
    eyebrow: 'MIDDAY DESK',
    question: 'Buổi chiều đang thế nào?',
    options: ['Tập trung', 'Uể oải', 'Căng thẳng', 'Lưng tức'],
  },
];

export function CheckInFlow({ onComplete }: CheckInFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('questions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = CHECK_IN_QUESTIONS[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.type]: answer,
    };
    setAnswers(updatedAnswers);

    // Special routing: "Lưng tức" (back tight) → spinal decompression category immediately
    if (answer === 'Lưng tức') {
      // Store the answer
      localStorage.setItem('checkInAnswer', answer);
      localStorage.setItem('checkInType', currentQuestion.type);
      
      // Route directly to spinal_decompression category (priority, immediate)
      // In production, this would navigate to action library filtered by category
      // For now, complete the check-in and let the protocol selector handle it
      onComplete();
      return;
    }

    // Move to next question or show context selector
    if (currentQuestionIndex < CHECK_IN_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered - show context selector for midday/pre-game
      // For this demo, always show context selector after questions
      setCurrentStep('context');
    }
  };

  const handleContextSelect = (context: string) => {
    // Check-in complete with all answers
    onComplete();
  };

  if (currentStep === 'context') {
    return <ContextSelectorScreen onSelect={handleContextSelect} />;
  }

  return (
    <CheckInQuestionScreen
      eyebrow={currentQuestion.eyebrow}
      question={currentQuestion.question}
      options={currentQuestion.options}
      onAnswer={handleAnswer}
      currentStep={currentQuestionIndex + 1}
      totalSteps={CHECK_IN_QUESTIONS.length}
    />
  );
}
