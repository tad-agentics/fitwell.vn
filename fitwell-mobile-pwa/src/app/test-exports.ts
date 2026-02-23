/**
 * Test file to verify all exports are working
 * This file should compile without errors
 */

// Test new exports
export { PostEventTypeSelector } from './components/PostEventTypeSelector';
export { PostEventCheckInFlow } from './components/PostEventCheckInFlow';
export { DeskStressPlaybookScreen } from './components/DeskStressPlaybookScreen';

// Test Auth exports
export { AuthRegisterScreen } from './components/AuthRegisterScreen';
export { AuthLoginMagicLinkScreen } from './components/AuthLoginMagicLinkScreen';
export { AuthMagicLinkSentScreen } from './components/AuthMagicLinkSentScreen';

// Test Action Library exports
export { ActionLibraryScreen } from './components/ActionLibraryScreen';
export { ActionLibraryCategoryScreen } from './components/ActionLibraryCategoryScreen';

console.log('✅ All exports verified');
