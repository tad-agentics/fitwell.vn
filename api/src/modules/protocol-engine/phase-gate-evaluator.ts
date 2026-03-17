/**
 * Phase gate evaluator — M5. After session complete, check unlock_criteria and advance phase if met.
 */

import { pool } from '../../shared/db.js';

interface UnlockCriteria {
  pain_threshold?: number;
  sustained_days?: number;
}

export async function evaluateAndAdvancePhase(userId: string, conditionId: string): Promise<void> {
  const tz = 'Asia/Ho_Chi_Minh';
  const condRes = await pool.query(
    `SELECT phase_current FROM conditions WHERE id = $1 AND user_id = $2`,
    [conditionId, userId]
  );
  if (condRes.rows.length === 0) return;
  const phaseCurrent = Number((condRes.rows[0] as { phase_current: number }).phase_current) || 1;

  const ppRes = await pool.query(
    `SELECT unlock_criteria FROM phase_progress WHERE user_id = $1 AND condition_id = $2 AND phase_number = $3`,
    [userId, conditionId, phaseCurrent]
  );
  if (ppRes.rows.length === 0) return;
  const criteria = (ppRes.rows[0] as { unlock_criteria: unknown }).unlock_criteria as UnlockCriteria | null;
  if (!criteria) return;
  const threshold = typeof criteria.pain_threshold === 'number' ? criteria.pain_threshold : 2;
  const sustainedDays = typeof criteria.sustained_days === 'number' ? criteria.sustained_days : 5;

  const checkinsRes = await pool.query(
    `SELECT pain_score, DATE(created_at AT TIME ZONE $3) AS d
     FROM checkins WHERE user_id = $1 AND condition_id = $2
     AND created_at >= (CURRENT_DATE AT TIME ZONE $3) - INTERVAL '1 day' * $4`,
    [userId, conditionId, tz, sustainedDays]
  );
  const daysWithLowPain = new Set<string>();
  for (const row of checkinsRes.rows as Array<{ pain_score: number; d: string }>) {
    if (row.pain_score <= threshold && row.d) daysWithLowPain.add(row.d);
  }
  if (daysWithLowPain.size < sustainedDays) return;

  await pool.query(
    `UPDATE conditions SET phase_current = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3`,
    [phaseCurrent + 1, conditionId, userId]
  );
}
