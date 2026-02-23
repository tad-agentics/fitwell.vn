import React, { useState } from 'react';
import { OnboardingLanguageScreen } from './OnboardingLanguageScreen';
import { OnboardingConditionScreen } from './OnboardingConditionScreen';
import { OnboardingBiomarkerScreen } from './OnboardingBiomarkerScreen';
import { OnboardingAhaScreen } from './OnboardingAhaScreen';
import { OnboardingLifePatternScreen } from './OnboardingLifePatternScreen';
import { OnboardingActivationScreen } from './OnboardingActivationScreen';
import { OnboardingProgressBar } from './OnboardingProgressBar';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type Language = 'vi' | 'en';
type OnboardingStep = 'language' | 'condition' | 'biomarker' | 'aha' | 'lifePattern' | 'activation';

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('language');
  const [language, setLanguage] = useState<Language | null>(null);
  const [declaredConditions, setDeclaredConditions] = useState<string[]>([]);

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setCurrentStep('condition');
  };

  const handleConditionContinue = (selectedConditions: string[]) => {
    // Save selected conditions for biomarker dropdown sorting
    setDeclaredConditions(selectedConditions);
    setCurrentStep('biomarker');
  };

  const handleBiomarkerContinue = (data: any) => {
    // Save biomarker data if needed
    setCurrentStep('aha');
  };

  const handleBiomarkerSkip = () => {
    setCurrentStep('aha');
  };

  const handleAhaContinue = () => {
    setCurrentStep('lifePattern');
  };

  const handleViewFullScenario = () => {
    // Would open full scenario view
  };

  const handleLifePatternComplete = (answers: any) => {
    // Save life pattern answers
    setCurrentStep('activation');
  };

  const handleActivationConfirm = (eventData: { type: string; datetime: string } | null) => {
    // Save activation event data
    onComplete();
  };

  const handleActivationSkip = () => {
    onComplete();
  };

  return (
    <>
      {/* Continuous progress bar - pulses on Aha Intercept */}
      <OnboardingProgressBar currentStep={currentStep} />

      {currentStep === 'language' && (
        <OnboardingLanguageScreen onLanguageSelect={handleLanguageSelect} />
      )}
      {currentStep === 'condition' && (
        <OnboardingConditionScreen onContinue={handleConditionContinue} />
      )}
      {currentStep === 'biomarker' && (
        <OnboardingBiomarkerScreen 
          onContinue={handleBiomarkerContinue}
          onSkip={handleBiomarkerSkip}
          declaredConditions={declaredConditions}
        />
      )}
      {currentStep === 'aha' && (
        <OnboardingAhaScreen 
          onContinue={handleAhaContinue}
          onViewFullScenario={handleViewFullScenario}
          declaredConditions={declaredConditions}
        />
      )}
      {currentStep === 'lifePattern' && (
        <OnboardingLifePatternScreen onComplete={handleLifePatternComplete} />
      )}
      {currentStep === 'activation' && (
        <OnboardingActivationScreen 
          onConfirm={handleActivationConfirm}
          onSkip={handleActivationSkip}
        />
      )}
    </>
  );
}
