/**
 * Schedule builder — 4.5 / SMSK05. Ensure users with timing_critical conditions have morning_critical_655 schedule.
 * Run via POST /api/v1/cron/schedule-builder or call after onboarding/condition add.
 */

import { pool } from '../../shared/db.js';

export async function buildMorningSchedulesForTimingCritical(): Promise<{ created: number }> {
  const res = await pool.query(
    `INSERT INTO notification_schedules (user_id, type, scheduled_time, is_active, channel, timezone)
     SELECT DISTINCT c.user_id, 'morning_critical_655', '06:55:00', TRUE, 'web_push', 'Asia/Ho_Chi_Minh'
     FROM conditions c
     JOIN msk_conditions m ON m.id = c.msk_condition_id
     WHERE c.is_active = TRUE AND m.timing_critical = TRUE
       AND NOT EXISTS (
         SELECT 1 FROM notification_schedules n
         WHERE n.user_id = c.user_id AND n.type = 'morning_critical_655'
       )`
  );
  return { created: res.rowCount ?? 0 };
}
