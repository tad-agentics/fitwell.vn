import React, { useState } from 'react';
import { OnboardingLanguageScreen } from './OnboardingLanguageScreen';
import { OnboardingConditionScreen } from './OnboardingConditionScreen';
import { OnboardingBiomarkerScreen } from './OnboardingBiomarkerScreen';
import { OnboardingAhaScreen } from './OnboardingAhaScreen';
import { OnboardingLifePatternScreen } from './OnboardingLifePatternScreen';
import { OnboardingActivationScreen } from './OnboardingActivationScreen';
import { OnboardingProgressBar } from './OnboardingProgressBar';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import type { ConditionType, Language } from '@/types';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type OnboardingStep = 'language' | 'condition' | 'biomarker' | 'aha' | 'lifePattern' | 'activation';

// Map UI condition IDs to DB ConditionType values
const CONDITION_MAP: Record<string, ConditionType> = {
  'uric-acid': 'gout',
  'cholesterol': 'cholesterol',
  'back-pain': 'back_pain',
  'not-sure': 'unsure',
};

// Map UI condition IDs to Aha variant keys
const CONDITION_TO_AHA: Record<string, string> = {
  'uric-acid': 'uric_acid',
  'cholesterol': 'cholesterol',
  'back-pain': 'back_pain',
  'not-sure': 'uric_acid',
};

// Map for biomarker units
const BIOMARKER_UNITS: Record<string, string> = {
  'uric-acid': 'mg/dL',
  'triglycerides': 'mg/dL',
  'ast': 'U/L',
  'alt': 'U/L',
  'hba1c': '%',
  'hdl': 'mg/dL',
  'ldl': 'mg/dL',
  'fasting-glucose': 'mg/dL',
};

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('language');
  const [declaredConditions, setDeclaredConditions] = useState<string[]>([]);
  const session = useAuthStore((s) => s.session);
  const setProfile = useAuthStore((s) => s.setProfile);

  const userId = session?.user?.id;

  const handleLanguageSelect = async (selectedLanguage: Language) => {
    if (userId) {
      await supabase
        .from('profiles')
        .update({ language: selectedLanguage })
        .eq('id', userId);
    }

    setCurrentStep('condition');
  };

  const handleConditionContinue = async (selectedConditions: string[]) => {
    setDeclaredConditions(selectedConditions);

    if (userId) {
      // Map UI condition IDs to DB types
      const dbConditions = selectedConditions.map(
        (c) => CONDITION_MAP[c] ?? 'unsure'
      );

      await supabase
        .from('profiles')
        .update({ primary_conditions: dbConditions })
        .eq('id', userId);
    }

    setCurrentStep('biomarker');
  };

  const handleBiomarkerContinue = async (
    data: { id: string; type: string; value: string; date: string }[]
  ) => {
    if (userId) {
      const inserts = data
        .filter((e) => e.type && e.value && e.date)
        .map((e) => ({
          user_id: userId,
          marker_type: e.type,
          value: parseFloat(e.value),
          unit: BIOMARKER_UNITS[e.type] ?? '',
          recorded_at: e.date,
        }));

      if (inserts.length > 0) {
        await supabase.from('biomarkers').insert(inserts);
      }
    }

    setCurrentStep('aha');
  };

  const handleBiomarkerSkip = () => {
    setCurrentStep('aha');
  };

  const handleAhaContinue = () => {
    setCurrentStep('lifePattern');
  };

  const handleViewFullScenario = () => {
    // No-op during onboarding
  };

  const handleLifePatternComplete = async (answers: {
    deskHours: string;
    eatingOutFrequency: string;
    backPainFrequency: string;
    highestRiskEnvironments: string[];
    accountUsage: string;
  }) => {
    if (userId) {
      let deskHoursNum: number | null = null;
      if (answers.deskHours === 'Dưới 6 tiếng') deskHoursNum = 5;
      else if (answers.deskHours === '6–8 tiếng') deskHoursNum = 7;
      else if (answers.deskHours === 'Hơn 8 tiếng') deskHoursNum = 9;

      await supabase
        .from('profiles')
        .update({
          desk_hours: deskHoursNum,
          eating_out_freq: answers.eatingOutFrequency,
          back_pain_freq: answers.backPainFrequency,
          highest_risk_env: answers.highestRiskEnvironments.join(','),
          account_usage: answers.accountUsage,
        })
        .eq('id', userId);
    }

    setCurrentStep('activation');
  };

  const handleActivationConfirm = async (
    eventData: { type: string; datetime: string } | null
  ) => {
    if (userId) {
      if (eventData) {
        const scenarioCategory =
          eventData.type === 'big-meal'
            ? 'heavy_meal'
            : eventData.type === 'drinking-social'
              ? 'drinking'
              : eventData.type === 'heavy-work'
                ? 'long_desk'
                : null;

        if (scenarioCategory) {
          const { data: scenario } = await supabase
            .from('scenarios')
            .select('id')
            .eq('category', scenarioCategory)
            .limit(1)
            .maybeSingle();

          if (scenario) {
            await supabase.from('scenario_sessions').insert({
              user_id: userId,
              scenario_id: scenario.id,
            });
          }
        }
      }

      const { data: updatedProfile } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', userId)
        .select()
        .single();

      if (updatedProfile) {
        setProfile(updatedProfile as any);
      }
    }

    onComplete();
  };

  const handleActivationSkip = async () => {
    if (userId) {
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', userId)
        .select()
        .single();

      if (updatedProfile) {
        setProfile(updatedProfile as any);
      }
    }

    onComplete();
  };

  // Map declared condition IDs to Aha variant keys
  const ahaConditions = declaredConditions.map(
    (c) => CONDITION_TO_AHA[c] ?? 'uric_acid'
  );

  return (
    <>
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
          declaredConditions={ahaConditions}
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
