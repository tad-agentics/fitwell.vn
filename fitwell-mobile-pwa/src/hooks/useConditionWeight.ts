import { useMemo } from 'react';
import { selectActionCategories } from '@/lib/protocol';
import { useMicroActions } from './useSupabaseQuery';
import type { ConditionType, CheckinTrigger, AfternoonState, ActionCategory, ContextTag } from '@/types';

interface UseConditionWeightInput {
  trigger: CheckinTrigger;
  conditions: ConditionType[];
  afternoonState?: AfternoonState;
  eventType?: string;
  backPainScore?: number;
  context?: ContextTag;
}

export function useConditionWeight(input: UseConditionWeightInput) {
  const { data: allActions } = useMicroActions();

  const result = useMemo(() => {
    const { categories, maxActions } = selectActionCategories(input);

    if (!allActions) return { categories, actions: [], maxActions };

    // Filter actions by selected categories and context
    let filtered = allActions.filter((a) =>
      categories.includes(a.category as ActionCategory)
    );

    if (input.context) {
      filtered = filtered.filter((a) =>
        (a.context_tags as ContextTag[]).includes(input.context!)
      );
    }

    // Boost actions matching user conditions
    const scored = filtered.map((action) => {
      let score = 0;
      for (const condition of input.conditions) {
        if ((action.condition_tags as ConditionType[]).includes(condition)) {
          score += 1;
        }
      }
      return { ...action, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
      categories,
      actions: scored.slice(0, maxActions),
      maxActions,
    };
  }, [input, allActions]);

  return result;
}
