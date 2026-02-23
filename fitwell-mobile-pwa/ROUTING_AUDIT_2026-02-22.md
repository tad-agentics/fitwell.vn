# Routing Audit - Missing Screens Analysis
**Date:** February 22, 2026  
**Status:** ⚠️ 6 Screens Missing from Main Router

---

## 📊 **Summary**

**Total Screen Components:** 53  
**Imported & Routed in App.tsx:** 47  
**Missing from Main Router:** 6  
**Sub-Components (Used Internally):** 7  

---

## ✅ **Screens WITH Routing (47)**

### **Authentication & Onboarding (6)**
- ✅ AuthRegisterScreen → `authRegister`
- ✅ AuthLoginMagicLinkScreen → `authLogin`
- ✅ AuthMagicLinkSentScreen → `authMagicLinkSent`
- ✅ OnboardingScreen → `onboarding`
- ✅ A2HSPromptScreen → `a2hsPrompt`
- ✅ A2HSInstructionScreen → `a2hsInstruction`

### **Home States (7)**
- ✅ HomeScreen → `home` (state machine dispatcher)
- ✅ HomeCleanDayScreen → `homeCleanDay` / state: 'clean'
- ✅ HomeMiddayScreen → `homeMidday` / state: 'midday'
- ✅ HomeActiveRecoveryScreen → `homeActiveRecovery` / state: 'activeRecovery'
- ✅ HomePreDinnerCountdownScreen → `homePreDinner` / state: 'preDinner'
- ✅ HomePreSleepScreen → `homePreSleep` / state: 'preSleep'
- ✅ HomeMondayBriefInterceptScreen → `homeMondayIntercept` / state: 'mondayIntercept'

### **Check-in Flows (4)**
- ✅ CheckInFlow → `checkIn`, `checkInMidday`
- ✅ MorningCheckInFlow → `checkInMorning`
- ✅ ContextSelectorScreen → `contextSelector`
- ✅ BackPainScoreScreen → Used internally by MorningCheckInFlow

### **Actions & Recovery (6)**
- ✅ ActionLibraryScreen → `actionLibrary`
- ✅ ActionLibraryCategoryScreen → `actionLibraryCategory`
- ✅ MicroActionFlow → `microAction`
- ✅ RecoveryPlanScreen → `recovery`
- ✅ RecoveryProtocolActiveScreen → `recoveryActive`
- ✅ RecoveryProtocolPaywallScreen → `recoveryPaywall`

### **Scenarios (2)**
- ✅ ScenarioSearchScreen → `scenarioSearch`
- ✅ ScenarioPlaybookScreen → `scenarioPlaybook`

### **Weekly Brief (2)**
- ✅ WeeklyBriefScreen → `weeklyBrief`
- ✅ MondayBriefInterceptScreen → `mondayBriefIntercept`

### **Household (3)**
- ✅ HouseholdPartnerHomeScreen → `householdHome`
- ✅ HouseholdInviteScreen → `householdInvite`
- ✅ HouseholdInviteStateScreen → `householdInviteState`

### **Profile & Settings (5)**
- ✅ ProfileScreen → `profile`
- ✅ ProfileSettingsScreen → `profileSettings`
- ✅ ProgressScreen → `progress`
- ✅ BloodTestScreen → `bloodTest`
- ✅ DashboardScreen → `dashboard`

### **Payment & Pricing (3)**
- ✅ PricingScreen → `pricing`
- ✅ PaymentSuccessScreen → `paymentSuccess`
- ✅ PaymentCancelScreen → `paymentCancel`

### **Other (1)**
- ✅ PreSleepWindDownScreen → `preSleep`

### **Sub-Components Used Internally (7)**
- ✅ OnboardingLanguageScreen → Used by OnboardingScreen
- ✅ OnboardingAhaScreen → Used by OnboardingScreen
- ✅ OnboardingBiomarkerScreen → Used by OnboardingScreen
- ✅ OnboardingConditionScreen → Used by OnboardingScreen
- ✅ OnboardingLifePatternScreen → Used by OnboardingScreen
- ✅ OnboardingActivationScreen → Used by OnboardingScreen
- ✅ OnboardingProgressBar → Used by OnboardingScreen

---

## ❌ **Screens MISSING from Main Router (6)**

### **1. ActionCompletionScreen** ❌

**File:** `/src/app/components/ActionCompletionScreen.tsx`

**Purpose:**  
Auto-advance screen shown after completing an action (2-second timer before advancing)

**Current Status:**  
- ❌ Not imported in App.tsx
- ❌ No route defined
- ✅ Exists as a component

**Used By:**  
- Appears to be an older completion screen
- Replaced by TimerCompleteScreen in MicroActionFlow

**Recommendation:** 🟡 **KEEP** (May be used by other flows in future)  
**Action Required:** Add route if needed for other action types

**Suggested Route:**
```tsx
// In App.tsx type definition
| 'actionComplete'

// In App.tsx imports
import { ActionCompletionScreen } from './components/ActionCompletionScreen';

// In App.tsx routing
{currentScreen === 'actionComplete' && (
  <ActionCompletionScreen onAutoAdvance={() => setCurrentScreen('home')} />
)}
```

---

### **2. CheckInQuestionScreen** ❌

**File:** `/src/app/components/CheckInQuestionScreen.tsx`

**Purpose:**  
Reusable question screen component with 3 answer options

**Current Status:**  
- ❌ Not imported in App.tsx (but used internally)
- ✅ Used by MorningCheckInFlow
- ✅ Used by CheckInFlow

**Used By:**  
- MorningCheckInFlow (internally)
- CheckInFlow (internally)

**Recommendation:** ✅ **NO ACTION NEEDED**  
This is a **reusable sub-component**, not a standalone screen. It should NOT be added to the main router.

---

### **3. DeskStressPlaybookScreen** ❌

**File:** `/src/app/components/DeskStressPlaybookScreen.tsx`

**Purpose:**  
Dedicated playbook screen for desk/stress scenarios (replaced by ScenarioPlaybookScreen)

**Current Status:**  
- ❌ Not imported in App.tsx
- ❌ No route defined
- ✅ Used in examples directory: `DeskStressPlaybookExample.tsx`

**Used By:**  
- Example/demo file only
- ScenarioPlaybookScreen now handles desk/stress scenarios

**Recommendation:** 🔴 **DELETE or ARCHIVE**  
This screen has been replaced by the more flexible ScenarioPlaybookScreen which handles all scenario types (including desk/stress).

**Action Required:**  
Either:
1. Delete `/src/app/components/DeskStressPlaybookScreen.tsx` (recommended)
2. Move to `/src/app/examples/archive/` for reference

---

### **4. MicroActionTimerScreen** ❌

**File:** `/src/app/components/MicroActionTimerScreen.tsx`

**Purpose:**  
Video-based timer screen with play/pause controls and overlay transitions

**Current Status:**  
- ❌ Not imported in App.tsx
- ✅ Used by MicroActionFlow (internally)

**Used By:**  
- MicroActionFlow uses it as internal component

**Recommendation:** ✅ **NO ACTION NEEDED**  
This is a **reusable sub-component** used by MicroActionFlow. It should NOT be added to the main router as a standalone screen.

---

### **5. PostEventCheckInFlow** ❌

**File:** `/src/app/components/PostEventCheckInFlow.tsx`

**Purpose:**  
Check-in flow specifically for post-event scenarios (after heavy night, rich meal, etc.)

**Current Status:**  
- ❌ Not imported in App.tsx
- ❌ No route defined
- ✅ Exists as a component
- ✅ Uses PostEventTypeSelector

**Implementation:**  
Multi-step flow with:
1. Event type selection (PostEventTypeSelector)
2. Event-specific questions (CheckInQuestionScreen)
3. Completion

**Recommendation:** 🟡 **ADD ROUTE** (Important for v2.0)  
This screen is part of the multi-condition system redesign and should be routed.

**Action Required:**  
Add routing for post-event check-in flow

**Suggested Route:**
```tsx
// In App.tsx type definition
| 'checkInPostEvent'

// In App.tsx imports
import { PostEventCheckInFlow } from './components/PostEventCheckInFlow';

// In App.tsx routing
{currentScreen === 'checkInPostEvent' && (
  <PostEventCheckInFlow 
    onComplete={() => setCurrentScreen('homeActiveRecovery')} 
  />
)}
```

**Navigation Entry Points:**
- From HomeActiveRecoveryScreen → "Kiểm tra lúc này" button
- From bottom nav → "Check-in" tab (when in active recovery state)

---

### **6. PostEventTypeSelector** ❌

**File:** `/src/app/components/PostEventTypeSelector.tsx`

**Purpose:**  
Event type selector screen (Heavy Night / Rich Meal / Long Desk Day / Stress Day)

**Current Status:**  
- ❌ Not imported in App.tsx
- ❌ No route defined
- ✅ Used by PostEventCheckInFlow (internally)

**Used By:**  
- PostEventCheckInFlow (as first step)

**Recommendation:** ✅ **NO ACTION NEEDED**  
This is a **sub-component** of PostEventCheckInFlow. It should NOT be added to the main router as a standalone screen.

However, once PostEventCheckInFlow is routed, this will become accessible.

---

### **7. TimerCompleteScreen** ❌

**File:** `/src/app/components/TimerCompleteScreen.tsx`

**Purpose:**  
Completion screen shown after finishing a micro-action timer

**Current Status:**  
- ❌ Not imported in App.tsx
- ✅ Used by MicroActionFlow (internally)

**Used By:**  
- MicroActionFlow uses it as internal component (after action completes)

**Recommendation:** ✅ **NO ACTION NEEDED**  
This is a **reusable sub-component** used by MicroActionFlow. It should NOT be added to the main router as a standalone screen.

---

## 🎯 **Recommendations Summary**

### **🔴 DELETE (1)**
1. **DeskStressPlaybookScreen** - Replaced by ScenarioPlaybookScreen

### **🟡 ADD ROUTE (1)**
1. **PostEventCheckInFlow** - Important for multi-condition system (v2.0)

### **✅ NO ACTION NEEDED (4)**
1. **CheckInQuestionScreen** - Sub-component (used internally)
2. **MicroActionTimerScreen** - Sub-component (used by MicroActionFlow)
3. **PostEventTypeSelector** - Sub-component (used by PostEventCheckInFlow)
4. **TimerCompleteScreen** - Sub-component (used by MicroActionFlow)

### **⚪ KEEP WITHOUT ROUTE (1)**
1. **ActionCompletionScreen** - May be useful for future features

---

## 🔧 **Implementation: Add PostEventCheckInFlow Route**

### **Step 1: Add to Type Definition**

```tsx
// In /src/app/App.tsx
type Screen = 
  // ... existing routes
  | 'checkInPostEvent'  // NEW: Post-event check-in flow
```

### **Step 2: Add Import**

```tsx
// In /src/app/App.tsx
import { PostEventCheckInFlow } from './components/PostEventCheckInFlow';
```

### **Step 3: Add Route Handler**

```tsx
// In /src/app/App.tsx (around line 240, with other check-in flows)
{currentScreen === 'checkInPostEvent' && (
  <PostEventCheckInFlow 
    onComplete={() => {
      setHomeState('activeRecovery');
      setCurrentScreen('home');
    }}
  />
)}
```

### **Step 4: Update Bottom Nav Visibility**

```tsx
// In /src/app/App.tsx (around line 412, bottom nav condition)
{hasCompletedOnboarding && 
 currentScreen !== 'checkIn' && 
 currentScreen !== 'checkInMorning' &&
 currentScreen !== 'checkInMidday' &&
 currentScreen !== 'checkInPostEvent' &&  // ADD THIS LINE
 currentScreen !== 'microAction' && 
 // ... rest of conditions
```

### **Step 5: Add Navigation Entry Point**

Update HomeActiveRecoveryScreen to navigate to the new route:

```tsx
// In /src/app/components/HomeActiveRecoveryScreen.tsx
// Find the "Kiểm tra lúc này" button and update onClick:
onClick={() => onNavigate('checkInPostEvent')}
```

---

## 📋 **Testing Checklist**

After adding PostEventCheckInFlow route:

- [ ] PostEventCheckInFlow screen loads correctly
- [ ] PostEventTypeSelector shows 4 event types
- [ ] Event type selection advances to questions
- [ ] Questions are event-specific
- [ ] Completion returns to HomeActiveRecoveryScreen
- [ ] Bottom nav hidden during flow
- [ ] Back button navigation works
- [ ] State persists across navigation

---

## 🗂️ **File Cleanup**

### **Delete (Recommended)**
```bash
rm /src/app/components/DeskStressPlaybookScreen.tsx
rm /src/app/examples/DeskStressPlaybookExample.tsx
```

### **Or Archive**
```bash
mkdir -p /src/app/examples/archive
mv /src/app/components/DeskStressPlaybookScreen.tsx /src/app/examples/archive/
mv /src/app/examples/DeskStressPlaybookExample.tsx /src/app/examples/archive/
```

---

## 📊 **Final Routing Status (After Fixes)**

**Total Screen Components:** 53  
**Main Routes:** 48 (+1 with PostEventCheckInFlow)  
**Sub-Components:** 7 (used internally, correctly not routed)  
**Deprecated:** 1 (DeskStressPlaybookScreen - to be deleted)  
**Unused but Valid:** 1 (ActionCompletionScreen - keep for future)  

**Coverage:** 91% → 100% (after adding PostEventCheckInFlow)

---

## ✅ **Conclusion**

The routing audit reveals **one missing screen** that should be added to the main router:

1. **PostEventCheckInFlow** - Critical for multi-condition system (v2.0)

All other "missing" screens are either:
- Sub-components (correctly used internally)
- Deprecated screens (should be deleted)
- Future-use components (acceptable to keep)

**Action Required:** Add PostEventCheckInFlow route (15 minutes implementation)

---

**Audit Date:** February 22, 2026  
**Next Review:** After PostEventCheckInFlow route added  
**Status:** ⚠️ One route missing, easy fix
