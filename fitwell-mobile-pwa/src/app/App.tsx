import React from 'react';

// v2.0.3 - Redesigned Post-Event Recovery Check-In (Screen 9 → 9a + 9b)

// Onboarding & Auth
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthRegisterScreen } from './components/AuthRegisterScreen';
import { AuthLoginMagicLinkScreen } from './components/AuthLoginMagicLinkScreen';
import { AuthMagicLinkSentScreen } from './components/AuthMagicLinkSentScreen';
import { A2HSPromptScreen } from './components/A2HSPromptScreen';
import { A2HSInstructionScreen } from './components/A2HSInstructionScreen';

// Home States
import { HomeScreen } from './components/HomeScreen';
import { HomeCleanDayScreen } from './components/HomeCleanDayScreen';
import { HomeMiddayScreen } from './components/HomeMiddayScreen';
import { HomeActiveRecoveryScreen } from './components/HomeActiveRecoveryScreen';
import { HomePreDinnerCountdownScreen } from './components/HomePreDinnerCountdownScreen';
import { HomePreSleepScreen } from './components/HomePreSleepScreen';
import { HomeMondayBriefInterceptScreen } from './components/HomeMondayBriefInterceptScreen';

// Check-in Flows
import { CheckInFlow } from './components/CheckInFlow';
import { MorningCheckInFlow } from './components/MorningCheckInFlow';
import { PostEventCheckInFlow } from './components/PostEventCheckInFlow';
import { ContextSelectorScreen } from './components/ContextSelectorScreen';

// Actions & Recovery
import { ActionLibraryScreen } from './components/ActionLibraryScreen';
import { ActionLibraryCategoryScreen } from './components/ActionLibraryCategoryScreen';
import { MicroActionFlow } from './components/MicroActionFlow';
import { RecoveryProtocolActiveScreen } from './components/RecoveryProtocolActiveScreen';
import { RecoveryProtocolPaywallScreen } from './components/RecoveryProtocolPaywallScreen';
import { RecoveryPlanScreen } from './components/RecoveryPlanScreen';

// Scenarios
import { ScenarioSearchScreen } from './components/ScenarioSearchScreen';
import { ScenarioPlaybookScreen } from './components/ScenarioPlaybookScreen';

// Weekly Brief
import { WeeklyBriefScreen } from './components/WeeklyBriefScreen';
import { MondayBriefInterceptScreen } from './components/MondayBriefInterceptScreen';

// Household
import { HouseholdPartnerHomeScreen } from './components/HouseholdPartnerHomeScreen';
import { HouseholdInviteScreen } from './components/HouseholdInviteScreen';
import { HouseholdInviteStateScreen } from './components/HouseholdInviteStateScreen';

// Profile & Settings
import { ProfileScreen } from './components/ProfileScreen';
import { ProfileSettingsScreen } from './components/ProfileSettingsScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { BloodTestScreen } from './components/BloodTestScreen';
import { DashboardScreen } from './components/DashboardScreen';

// Payment & Pricing
import { PricingScreen } from './components/PricingScreen';
import { PaymentSuccessScreen } from './components/PaymentSuccessScreen';
import { PaymentCancelScreen } from './components/PaymentCancelScreen';

// Other
import { PreSleepWindDownScreen } from './components/PreSleepWindDownScreen';

type Screen = 
  // Auth & Onboarding
  | 'authRegister' | 'authLogin' | 'authMagicLinkSent' | 'onboarding' | 'a2hsPrompt' | 'a2hsInstruction'
  // Home States
  | 'home' | 'homeCleanDay' | 'homeMidday' | 'homeActiveRecovery' | 'homePreDinner' | 'homePreSleep' | 'homeMondayIntercept'
  // Check-in
  | 'checkIn' | 'checkInMorning' | 'checkInMidday' | 'checkInPostEvent' | 'contextSelector'
  // Actions & Recovery
  | 'microAction' | 'actionLibrary' | 'actionLibraryCategory' | 'recovery' | 'recoveryActive' | 'recoveryPaywall'
  // Scenarios
  | 'scenarioSearch' | 'scenarioPlaybook'
  // Brief
  | 'weeklyBrief' | 'mondayBriefIntercept'
  // Household
  | 'householdHome' | 'householdInvite' | 'householdInviteState'
  // Profile
  | 'profile' | 'profileSettings' | 'progress' | 'bloodTest' | 'dashboard'
  // Payment
  | 'pricing' | 'paymentSuccess' | 'paymentCancel'
  // Other
  | 'preSleep';

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('authRegister');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = React.useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);
  const [highlightedPlanId, setHighlightedPlanId] = React.useState<string | null>(null);
  const [recoveryEventType, setRecoveryEventType] = React.useState<'heavy_night' | 'rich_meal' | 'long_desk' | 'stress_day'>('long_desk'); // Default to long_desk for demo
  
  // Home state machine
  const [homeState, setHomeState] = React.useState<'clean' | 'midday' | 'activeRecovery' | 'preDinner' | 'preSleep' | 'mondayIntercept'>('clean');

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setCurrentScreen('a2hsPrompt');
  };
  
  const handleA2HSComplete = () => {
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setCurrentScreen('scenarioPlaybook');
  };

  const handleBack = () => {
    // Smart back navigation
    if (currentScreen === 'scenarioPlaybook') {
      setCurrentScreen('scenarioSearch');
    } else if (currentScreen.startsWith('household')) {
      setCurrentScreen('profile');
    } else if (currentScreen === 'a2hsInstruction') {
      setCurrentScreen('a2hsPrompt');
    } else {
      setCurrentScreen('home');
    }
  };

  // Determine which home screen to show based on state
  const renderHomeScreen = () => {
    switch (homeState) {
      case 'clean':
        return <HomeCleanDayScreen onNavigate={handleNavigate} />;
      case 'midday':
        return <HomeMiddayScreen onNavigate={handleNavigate} />;
      case 'activeRecovery':
        return <HomeActiveRecoveryScreen onNavigate={handleNavigate} eventType={recoveryEventType} />;
      case 'preDinner':
        return <HomePreDinnerCountdownScreen onNavigate={handleNavigate} onViewScenario={() => setCurrentScreen('scenarioSearch')} />;
      case 'preSleep':
        return <HomePreSleepScreen onNavigate={handleNavigate} />;
      case 'mondayIntercept':
        return <HomeMondayBriefInterceptScreen onNavigate={handleNavigate} onViewBrief={() => setCurrentScreen('weeklyBrief')} onDismiss={() => setHomeState('clean')} />;
      default:
        return <HomeCleanDayScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div 
      className="fitwell-app"
      style={{
        width: '393px',
        height: '852px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#F5F5F5'
      }}
    >
      {/* Screen Container */}
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {/* Auth Flow */}
        {currentScreen === 'authRegister' && (
          <AuthRegisterScreen 
            onNavigate={handleNavigate}
            onRegisterSuccess={() => setCurrentScreen('onboarding')}
          />
        )}
        
        {currentScreen === 'authLogin' && (
          <AuthLoginMagicLinkScreen 
            onNavigate={handleNavigate}
            onSubmit={() => setCurrentScreen('authMagicLinkSent')}
          />
        )}
        
        {currentScreen === 'authMagicLinkSent' && (
          <AuthMagicLinkSentScreen 
            onNavigate={handleNavigate}
            onResend={() => setCurrentScreen('authLogin')}
          />
        )}
        
        {/* Onboarding */}
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}
        
        {/* A2HS Flow */}
        {currentScreen === 'a2hsPrompt' && (
          <A2HSPromptScreen 
            onNavigate={handleNavigate}
            onComplete={handleA2HSComplete}
            onShowGuide={() => setCurrentScreen('a2hsInstruction')}
          />
        )}
        
        {currentScreen === 'a2hsInstruction' && (
          <A2HSInstructionScreen 
            onBack={() => setCurrentScreen('a2hsPrompt')}
            onComplete={handleA2HSComplete}
          />
        )}
        
        {/* Home - State Machine */}
        {currentScreen === 'home' && renderHomeScreen()}
        
        {/* Direct Home State Access (for testing/navigation) */}
        {currentScreen === 'homeCleanDay' && (
          <HomeCleanDayScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'homeMidday' && (
          <HomeMiddayScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'homeActiveRecovery' && (
          <HomeActiveRecoveryScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'homePreDinner' && (
          <HomePreDinnerCountdownScreen 
            onNavigate={handleNavigate}
            onViewScenario={() => setCurrentScreen('scenarioSearch')}
          />
        )}
        
        {currentScreen === 'homePreSleep' && (
          <HomePreSleepScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'homeMondayIntercept' && (
          <HomeMondayBriefInterceptScreen 
            onNavigate={handleNavigate}
            onViewBrief={() => setCurrentScreen('weeklyBrief')}
            onDismiss={() => setCurrentScreen('home')}
          />
        )}
        
        {/* Check-in Flows */}
        {currentScreen === 'checkIn' && (
          <CheckInFlow onComplete={() => setCurrentScreen('home')} />
        )}
        
        {currentScreen === 'checkInMorning' && (
          <MorningCheckInFlow onComplete={() => setCurrentScreen('home')} />
        )}
        
        {currentScreen === 'checkInMidday' && (
          <CheckInFlow onComplete={() => setCurrentScreen('home')} />
        )}
        
        {currentScreen === 'checkInPostEvent' && (
          <PostEventCheckInFlow 
            onComplete={() => {
              setHomeState('activeRecovery');
              setCurrentScreen('home');
            }}
          />
        )}
        
        {currentScreen === 'contextSelector' && (
          <ContextSelectorScreen 
            onSelect={() => setCurrentScreen('microAction')}
            onBack={handleBack}
          />
        )}
        
        {/* Action Library */}
        {currentScreen === 'actionLibrary' && (
          <ActionLibraryScreen 
            onNavigate={handleNavigate}
            onSelectCategory={(categoryId) => {
              setSelectedCategoryId(categoryId);
              setCurrentScreen('actionLibraryCategory');
            }}
          />
        )}
        
        {currentScreen === 'actionLibraryCategory' && selectedCategoryId && (
          <ActionLibraryCategoryScreen
            categoryId={selectedCategoryId}
            onBack={() => setCurrentScreen('actionLibrary')}
            onNavigate={handleNavigate}
            onRunSequence={(categoryId) => {
              // FUTURE: Sequential action flow (multi-action sequence player)
              // For v2.1: Play all category actions back-to-back with progress tracking
              console.log('Run all actions in category:', categoryId);
              setCurrentScreen('microAction');
            }}
          />
        )}
        
        {/* Micro Actions */}
        {currentScreen === 'microAction' && (
          <MicroActionFlow onComplete={() => setCurrentScreen('home')} />
        )}
        
        {/* Scenarios */}
        {currentScreen === 'scenarioSearch' && (
          <ScenarioSearchScreen onSelectScenario={handleScenarioSelect} />
        )}
        
        {currentScreen === 'scenarioPlaybook' && selectedScenarioId && (
          <ScenarioPlaybookScreen
            scenarioId={selectedScenarioId}
            onConfirm={() => setCurrentScreen('home')}
            onBack={() => setCurrentScreen('scenarioSearch')}
          />
        )}
        
        {/* Recovery */}
        {currentScreen === 'recovery' && (
          <RecoveryPlanScreen onBack={handleBack} onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'recoveryActive' && (
          <RecoveryProtocolActiveScreen
            onNavigate={handleNavigate}
            onStartAction={(actionId) => setCurrentScreen('microAction')}
            eventType={recoveryEventType}
          />
        )}
        
        {currentScreen === 'recoveryPaywall' && (
          <RecoveryProtocolPaywallScreen
            onNavigate={handleNavigate}
            onViewPlans={() => {
              setHighlightedPlanId('individual-quarterly');
              setCurrentScreen('pricing');
            }}
            onSkip={() => setCurrentScreen('home')}
          />
        )}
        
        {/* Weekly Brief */}
        {currentScreen === 'weeklyBrief' && (
          <WeeklyBriefScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'mondayBriefIntercept' && (
          <MondayBriefInterceptScreen 
            onNavigate={handleNavigate}
            onViewBrief={() => setCurrentScreen('weeklyBrief')}
            onSkip={() => setCurrentScreen('checkInMorning')}
          />
        )}
        
        {/* Household */}
        {currentScreen === 'householdHome' && (
          <HouseholdPartnerHomeScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'householdInvite' && (
          <HouseholdInviteScreen 
            onNavigate={handleNavigate}
            onContinue={() => setCurrentScreen('onboarding')}
            onViewStatus={() => setCurrentScreen('householdInviteState')}
          />
        )}
        
        {currentScreen === 'householdInviteState' && (
          <HouseholdInviteStateScreen 
            onBack={() => setCurrentScreen('householdInvite')}
            onNavigate={handleNavigate}
          />
        )}
        
        {/* Profile & Settings */}
        {currentScreen === 'profile' && (
          <ProfileScreen onBack={handleBack} onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'profileSettings' && (
          <ProfileSettingsScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'progress' && (
          <ProgressScreen onBack={handleBack} />
        )}
        
        {currentScreen === 'bloodTest' && (
          <BloodTestScreen onBack={handleBack} />
        )}
        
        {currentScreen === 'dashboard' && (
          <DashboardScreen onNavigate={handleNavigate} />
        )}
        
        {/* Pricing & Payment */}
        {currentScreen === 'pricing' && (
          <PricingScreen
            onNavigate={handleNavigate}
            onSelectPlan={(planId) => {
              setCurrentScreen('paymentSuccess');
              setHighlightedPlanId(null);
            }}
            highlightedPlanId={highlightedPlanId || undefined}
            currentPlan="free"
          />
        )}
        
        {currentScreen === 'paymentSuccess' && (
          <PaymentSuccessScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'paymentCancel' && (
          <PaymentCancelScreen onNavigate={handleNavigate} />
        )}
        
        {/* Other */}
        {currentScreen === 'preSleep' && (
          <PreSleepWindDownScreen
            onReady={() => setCurrentScreen('home')}
            onDelay={() => setCurrentScreen('home')}
          />
        )}
      </div>

      {/* Bottom Navigation - Only shown after onboarding and NOT during flows */}
      {hasCompletedOnboarding && 
       currentScreen !== 'checkIn' && 
       currentScreen !== 'checkInMorning' &&
       currentScreen !== 'checkInMidday' &&
       currentScreen !== 'checkInPostEvent' &&
       currentScreen !== 'microAction' && 
       currentScreen !== 'actionLibraryCategory' &&
       currentScreen !== 'scenarioPlaybook' &&
       currentScreen !== 'a2hsPrompt' &&
       currentScreen !== 'a2hsInstruction' &&
       !currentScreen.startsWith('auth') && (
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '56px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #EBEBF0',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Tối nay → Scenario Search per spec */}
          <button
            onClick={() => setCurrentScreen('scenarioSearch')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minWidth: '48px',
              height: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke={currentScreen === 'scenarioSearch' ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke={currentScreen === 'scenarioSearch' ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                fontWeight: currentScreen === 'scenarioSearch' ? 600 : 400,
                color: currentScreen === 'scenarioSearch' ? '#041E3A' : '#9D9FA3',
              }}
            >
              Tối nay
            </span>
          </button>

          {/* Check-in → Manual trigger selector */}
          <button
            onClick={() => setCurrentScreen('checkIn')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minWidth: '48px',
              height: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11L12 14L22 4"
                stroke={currentScreen === 'checkIn' ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                stroke={currentScreen === 'checkIn' ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                fontWeight: currentScreen === 'checkIn' ? 600 : 400,
                color: currentScreen === 'checkIn' ? '#041E3A' : '#9D9FA3',
              }}
            >
              Check-in
            </span>
          </button>

          {/* Hành động → Action Library */}
          <button
            onClick={() => setCurrentScreen('actionLibrary')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minWidth: '48px',
              height: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="8"
                height="8"
                stroke={(currentScreen === 'actionLibrary' || currentScreen === 'actionLibraryCategory') ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="3"
                y="13"
                width="8"
                height="8"
                stroke={(currentScreen === 'actionLibrary' || currentScreen === 'actionLibraryCategory') ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="13"
                y="3"
                width="8"
                height="8"
                stroke={(currentScreen === 'actionLibrary' || currentScreen === 'actionLibraryCategory') ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="13"
                y="13"
                width="8"
                height="8"
                stroke={(currentScreen === 'actionLibrary' || currentScreen === 'actionLibraryCategory') ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                fontWeight: (currentScreen === 'actionLibrary' || currentScreen === 'actionLibraryCategory') ? 600 : 400,
                color: (currentScreen === 'actionLibrary' || currentScreen === 'actionLibraryCategory') ? '#041E3A' : '#9D9FA3',
              }}
            >
              Hành động
            </span>
          </button>

          {/* Tuần này → Weekly Brief */}
          <button
            onClick={() => setCurrentScreen('weeklyBrief')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minWidth: '48px',
              height: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              position: 'relative',
            }}
          >
            {/* Unread indicator - amber dot */}
            <div
              style={{
                position: 'absolute',
                top: '6px',
                right: '8px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#D97706',
                display: 'none', // Would be conditional based on unread state
              }}
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke={currentScreen === 'weeklyBrief' ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke={currentScreen === 'weeklyBrief' ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                fontWeight: currentScreen === 'weeklyBrief' ? 600 : 400,
                color: currentScreen === 'weeklyBrief' ? '#041E3A' : '#9D9FA3',
              }}
            >
              Tuần này
            </span>
          </button>

          {/* Tôi → Profile */}
          <button
            onClick={() => setCurrentScreen('profile')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minWidth: '48px',
              height: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke={currentScreen === 'profile' ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke={currentScreen === 'profile' ? '#041E3A' : '#9D9FA3'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                fontWeight: currentScreen === 'profile' ? 600 : 400,
                color: currentScreen === 'profile' ? '#041E3A' : '#9D9FA3',
              }}
            >
              Tôi
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
