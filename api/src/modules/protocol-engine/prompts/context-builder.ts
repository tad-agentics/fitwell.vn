/**
 * buildAIContext — TechSpec 3.2. Used by check-in AI and protocol engine.
 * P2: wired; checkin uses OpenRouter (OPENROUTER_API_KEY) for standard-branch AI.
 */

import { pool } from '../../../shared/db.js';

export interface AICheckinContext {
  pain_score: number;
  body_region: string;
  trigger_pattern: string;
  condition_track: 'joint' | 'tendon';
  day_number: number;
  days_since_last_checkin: number;
  recent_pain_scores: number[];
  phase_current: number;
  phase_gate_blocked: boolean;
  phase_gate_reason_vi?: string;
  adaptation_signal: string;
  lifestyle_trigger?: unknown;
}

export async function buildAIContext(
  userId: string,
  conditionId: string,
  painScore: number
): Promise<AICheckinContext> {
  const condRes = await pool.query(
    `SELECT c.primary_region, c.trigger_pattern, c.phase_current, c.adaptation_signal, m.pain_track
     FROM conditions c JOIN msk_conditions m ON m.id = c.msk_condition_id
     WHERE c.id = $1 AND c.user_id = $2`,
    [conditionId, userId]
  );
  const condition = condRes.rows[0] || {};
  const checkinsRes = await pool.query(
    `SELECT pain_score, created_at FROM checkins WHERE user_id = $1 AND condition_id = $2 ORDER BY created_at DESC LIMIT 10`,
    [userId, conditionId]
  );
  const recentScores = (checkinsRes.rows as { pain_score: number }[]).map((r) => r.pain_score);
  const lastCheckin = checkinsRes.rows[0] as { created_at: string } | undefined;
  const now = new Date();
  const lastDate = lastCheckin ? new Date(lastCheckin.created_at) : null;
  const daysSince = lastDate ? Math.floor((now.getTime() - lastDate.getTime()) / 86400000) : 0;
  const profileRes = await pool.query(`SELECT onboarding_completed_at FROM user_profiles WHERE user_id = $1`, [userId]);
  const completedAt = profileRes.rows[0]?.onboarding_completed_at;
  const dayNumber = completedAt ? Math.floor((now.getTime() - new Date(completedAt).getTime()) / 86400000) + 1 : 1;

  return {
    pain_score: painScore,
    body_region: (condition.primary_region as string) || 'back',
    trigger_pattern: (condition.trigger_pattern as string) || 'constant',
    condition_track: ((condition.pain_track as string) || 'joint') as 'joint' | 'tendon',
    day_number: dayNumber,
    days_since_last_checkin: daysSince,
    recent_pain_scores: recentScores,
    phase_current: Number(condition.phase_current) || 1,
    phase_gate_blocked: false,
    adaptation_signal: (condition.adaptation_signal as string) || 'none',
    lifestyle_trigger: null,
  };
}
