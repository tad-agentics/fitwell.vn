import React, { useState } from 'react';
import { CheckInQuestionScreen } from './CheckInQuestionScreen';
import { PostEventTypeSelector } from './PostEventTypeSelector';

interface PostEventCheckInFlowProps {
  onComplete: () => void;
}

type PostEventStep = 
  | 'intensity'    // "Tối/Ngày qua thế nào?" (Nặng/Vừa/Nhẹ)
  | 'eventType'    // "Đó là buổi gì?" (conditional - only if Nặng or Vừa)
  | 'complete';

/**
 * Post-Event Check-In Flow (Screen 9 - Redesigned v2.0)
 * 
 * Multi-step flow for post-event recovery assessment:
 * 
 * Screen 9, Part 1 of 2: Intensity Question
 *   "Tối/Ngày qua thế nào?" → Nặng / Vừa / Nhẹ
 *   Updated from "Tối qua" to "Tối/Ngày qua" to cover non-evening events
 *   (e.g., "Ngày làm việc dày" happens during day, not evening)
 * 
 * Screen 9, Part 2 of 2 (Conditional): Event Type Selector (Screen N3)
 *   Only shown when intensity is "Nặng" or "Vừa"
 *   "Đó là buổi gì?" → 6 event types
 * 
 * This is v2.0's key differentiator: The product can now distinguish
 * "heavy night out" from "10-hour desk day" and route to entirely
 * different recovery protocols.
 * 
 * Flow paths:
 * - Intensity = "Nhẹ" → Complete (skip event type, assign light recovery protocol)
 * - Intensity = "Vừa" or "Nặng" → Event Type → Complete (protocol varies by event type)
 */
export function PostEventCheckInFlow({ onComplete }: PostEventCheckInFlowProps) {
  const [currentStep, setCurrentStep] = useState<PostEventStep>('intensity');
  const [intensityAnswer, setIntensityAnswer] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);

  const handleIntensityAnswer = (answer: string) => {
    setIntensityAnswer(answer);
    
    // Conditional logic: Show event type selector ONLY if intensity is "Nặng" or "Vừa"
    const shouldShowEventType = answer === 'Nặng' || answer === 'Vừa';
    
    if (shouldShowEventType) {
      setCurrentStep('eventType');
    } else {
      // Light intensity - skip event type and complete
      handleComplete();
    }
  };

  const handleEventTypeSelect = (selectedEventType: string) => {
    setEventType(selectedEventType);
    // Auto-advance to complete
    handleComplete();
  };

  const handleComplete = () => {
    // Save all check-in data (would normally POST to backend)
    const checkInData = {
      timestamp: new Date().toISOString(),
      type: 'post-event',
      intensity: intensityAnswer,
      eventType: eventType, // null if intensity was "Nhẹ"
    };
    console.log('Post-event check-in completed:', checkInData);
    
    onComplete();
  };

  // Screen 9, Part 1 of 2: Intensity Question
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

  // Step 2 (Conditional): Event Type Selector
  // Only shown when intensity is "Nặng" or "Vừa"
  if (currentStep === 'eventType') {
    return (
      <PostEventTypeSelector onTypeSelect={handleEventTypeSelect} />
    );
  }

  // Fallback (should not reach here)
  return null;
}
