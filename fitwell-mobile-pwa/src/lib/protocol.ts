/**
 * Condition Weighting Engine
 * Derives action categories from check-in data + user conditions
 */

import type { ConditionType, CheckinTrigger, AfternoonState, ActionCategory, ContextTag } from '@/types';

interface ProtocolInput {
  trigger: CheckinTrigger;
  conditions: ConditionType[];
  afternoonState?: AfternoonState;
  eventType?: string;
  backPainScore?: number;
}

interface ProtocolOutput {
  categories: ActionCategory[];
  maxActions: number;
}

/**
 * Derive base action categories from check-in trigger + state
 */
function deriveBaseCategories(input: ProtocolInput): ActionCategory[] {
  const { trigger, afternoonState, backPainScore } = input;

  switch (trigger) {
    case 'morning':
      if (backPainScore && backPainScore >= 3) {
        return ['spinal_mobility', 'gentle_stretch'];
      }
      return ['morning_activation', 'gentle_stretch'];

    case 'post_event':
      return ['hydration_recovery', 'metabolic_support'];

    case 'midday':
      if (afternoonState === 'back_tight') {
        return ['spinal_mobility', 'desk_reset'];
      }
      if (afternoonState === 'sluggish') {
        return ['energy_boost', 'desk_reset'];
      }
      if (afternoonState === 'stressed') {
        return ['breathing', 'desk_reset'];
      }
      return ['desk_reset', 'gentle_stretch'];

    case 'pre_sleep':
      return ['breathing', 'gentle_stretch'];

    default:
      return ['gentle_stretch'];
  }
}

/**
 * Apply condition-based weighting to boost relevant categories
 */
function applyConditionWeight(
  categories: ActionCategory[],
  conditions: ConditionType[]
): ActionCategory[] {
  const boosted = new Set(categories);

  for (const condition of conditions) {
    switch (condition) {
      case 'gout':
        boosted.add('hydration_recovery');
        boosted.add('metabolic_support');
        break;
      case 'cholesterol':
        boosted.add('metabolic_support');
        boosted.add('energy_boost');
        break;
      case 'back_pain':
        boosted.add('spinal_mobility');
        boosted.add('desk_reset');
        break;
    }
  }

  return Array.from(boosted);
}

/**
 * Select action categories for a check-in session
 * Returns max 2 categories, 3 actions per session
 */
export function selectActionCategories(input: ProtocolInput): ProtocolOutput {
  const base = deriveBaseCategories(input);
  const weighted = applyConditionWeight(base, input.conditions);

  // Cap at 2 categories
  const categories = weighted.slice(0, 2);

  return {
    categories,
    maxActions: 3,
  };
}

/**
 * Recovery protocol duration matrix
 * Returns number of recovery days based on event type and intensity
 */
export function getRecoveryDuration(
  eventType: string,
  intensity: 'light' | 'medium' | 'heavy'
): number {
  const matrix: Record<string, Record<string, number>> = {
    heavy_night: { light: 1, medium: 2, heavy: 3 },
    rich_meal: { light: 1, medium: 2, heavy: 3 },
    long_desk: { light: 1, medium: 2, heavy: 2 },
    stress_day: { light: 1, medium: 2, heavy: 3 },
  };

  return matrix[eventType]?.[intensity] ?? 1;
}

/**
 * Get recovery protocol eyebrow text based on event type
 */
export function getRecoveryEyebrow(eventType: string): string {
  const eyebrows: Record<string, string> = {
    heavy_night: 'POST-EVENT RECOVERY',
    rich_meal: 'METABOLIC RECOVERY',
    long_desk: 'SPINAL RECOVERY',
    stress_day: 'CORTISOL RECOVERY',
  };

  return eyebrows[eventType] ?? 'RECOVERY PROTOCOL';
}

/**
 * Filter actions by context
 */
export function filterByContext(
  actions: { context_tags: ContextTag[] }[],
  context: ContextTag
): typeof actions {
  return actions.filter((a) => a.context_tags.includes(context));
}
