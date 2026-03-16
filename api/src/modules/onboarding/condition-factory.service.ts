/**
 * createConditionWithPhaseGate — shared by intake, add-region, add-from-suggestion.
 * TechSpec 6.1, 6.2.
 */

import { pool } from '../../shared/db.js';

export interface MskConditionRow {
  id: string;
  slug: string;
  name_vi: string;
  body_region: string;
  pain_track: string;
  phase_count: number;
  assessment_required: boolean;
  assessment_test_slug: string | null;
  safety_warning_vi: string | null;
}

export interface ConditionIntakeData {
  body_regions: string[];
  trigger_pattern: string;
  current_treatments?: string[];
  primary_region?: string;
  msk_condition_id?: string;
  display_name_vi?: string;
}

export interface ConditionCreatedResponse {
  condition_id: string;
  protocol: { exercises: Array<{ exercise_id: string; order: number; duration_sec: number; name_vi: string }>; total_duration: number } | null;
  assessment_required: boolean;
  assessment_test_slug: string | null;
  safety_warning: { content_vi: string; show_once: boolean } | null;
  daily_schedule_updated: boolean;
}

function buildUnlockCriteria(msk: MskConditionRow): Record<string, unknown> {
  const base = { pain_threshold: 2, sustained_days: 5 };
  if (msk.slug === 'frozen_shoulder') {
    return { ...base, pain_threshold: 3, sustained_days: 14, prohibit_movement_types: ['stretch', 'end_range_passive'], prohibit_reason_vi: 'Frozen shoulder Phase 1: passive stretch gây viêm cấp tính.' };
  }
  if (msk.pain_track === 'tendon') return { ...base, sustained_days: 7 };
  return base;
}

export async function createConditionWithPhaseGate(
  userId: string,
  mskCondition: MskConditionRow,
  intake: ConditionIntakeData
): Promise<ConditionCreatedResponse> {
  const primaryRegion = intake.primary_region ?? intake.body_regions?.[0] ?? mskCondition.body_region;
  const res = await pool.query(
    `INSERT INTO conditions (user_id, msk_condition_id, body_regions, trigger_pattern, current_treatments, primary_region, pain_track, display_name_vi, phase_current, assessment_completed)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, FALSE)
     RETURNING id`,
    [
      userId,
      mskCondition.id,
      intake.body_regions ?? [],
      intake.trigger_pattern ?? 'constant',
      intake.current_treatments ?? [],
      primaryRegion,
      mskCondition.pain_track,
      intake.display_name_vi ?? mskCondition.name_vi,
    ]
  );
  const conditionId = res.rows[0].id;

  await pool.query(
    `INSERT INTO phase_progress (user_id, condition_id, phase_number, status, unlock_criteria)
     VALUES ($1, $2, 1, 'active', $3)`,
    [userId, conditionId, JSON.stringify(buildUnlockCriteria(mskCondition))]
  );

  await pool.query(
    `UPDATE user_profiles SET onboarding_completed_at = NOW(), updated_at = NOW() WHERE user_id = $1 AND onboarding_completed_at IS NULL`,
    [userId]
  );
  await pool.query(
    `INSERT INTO user_profiles (user_id, onboarding_completed_at) SELECT $1, NOW() WHERE NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = $1)`,
    [userId]
  );

  const safetyWarning = mskCondition.safety_warning_vi
    ? { content_vi: mskCondition.safety_warning_vi, show_once: true }
    : null;

  let protocol: ConditionCreatedResponse['protocol'] = null;
  if (!mskCondition.assessment_required) {
    const prohibited = (buildUnlockCriteria(mskCondition) as { prohibit_movement_types?: string[] }).prohibit_movement_types ?? [];
    let exRes = await pool.query<{ id: string; name_vi: string; duration_sec: number; clinical_tags: string[] | null }>(
      `SELECT id, name_vi, duration_sec, clinical_tags FROM exercises WHERE body_region = $1 AND is_published = TRUE`,
      [mskCondition.body_region]
    );
    if (prohibited.length > 0) {
      exRes = {
        ...exRes,
        rows: exRes.rows.filter((ex) => !ex.clinical_tags?.some((tag) => prohibited.includes(tag))),
      };
    }
    exRes.rows = exRes.rows.slice(0, 1);
    if (exRes.rows.length > 0) {
      const ex = exRes.rows[0];
      const protocolRes = await pool.query(
        `INSERT INTO protocols (condition_id, user_id, exercises, generation_type, total_duration, is_current)
         VALUES ($1, $2, $3, 'rule_based', $4, TRUE) RETURNING id`,
        [conditionId, userId, JSON.stringify([{ exercise_id: ex.id, order: 1, duration_sec: ex.duration_sec, reps: null, notes: null }]), ex.duration_sec]
      );
      protocol = {
        exercises: [{ exercise_id: ex.id, order: 1, duration_sec: ex.duration_sec, name_vi: ex.name_vi }],
        total_duration: ex.duration_sec,
      };
    }
  }

  return {
    condition_id: conditionId,
    protocol,
    assessment_required: mskCondition.assessment_required,
    assessment_test_slug: mskCondition.assessment_test_slug,
    safety_warning: safetyWarning,
    daily_schedule_updated: true,
  };
}
