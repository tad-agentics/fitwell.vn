/**
 * Pattern detection job — M7 / 4.3. Analyze last 14 days check-ins per condition, insert pattern_observations.
 * Run via POST /api/v1/cron/pattern-detection (X-Cron-Secret).
 */

import { pool } from '../../shared/db.js';

const TZ = 'Asia/Ho_Chi_Minh';
const LOOKBACK_DAYS = 14;
const MIN_CHECKINS = 7;
const COOLDOWN_DAYS = 14;

export async function runPatternDetection(): Promise<{ processed: number; inserted: number }> {
  const res = await pool.query(
    `SELECT c.user_id, c.id AS condition_id, c.display_name_vi,
            COUNT(ch.id) AS checkin_count,
            ARRAY_AGG(ch.pain_score ORDER BY ch.created_at ASC) AS scores,
            ARRAY_AGG(ch.created_at ORDER BY ch.created_at ASC) AS dates
     FROM conditions c
     JOIN checkins ch ON ch.condition_id = c.id AND ch.user_id = c.user_id
     WHERE c.is_active = TRUE
       AND ch.created_at >= (CURRENT_DATE AT TIME ZONE $1) - INTERVAL '1 day' * $2
     GROUP BY c.user_id, c.id, c.display_name_vi
     HAVING COUNT(ch.id) >= $3`,
    [TZ, LOOKBACK_DAYS, MIN_CHECKINS]
  );

  let inserted = 0;
  for (const row of res.rows as Array<{
    user_id: string;
    condition_id: string;
    display_name_vi: string;
    checkin_count: number;
    scores: number[];
    dates: string[];
  }>) {
    const recent = await pool.query(
      `SELECT 1 FROM pattern_observations
       WHERE user_id = $1 AND condition_id = $2 AND created_at >= (CURRENT_DATE AT TIME ZONE $3) - INTERVAL '1 day' * $4`,
      [row.user_id, row.condition_id, TZ, COOLDOWN_DAYS]
    );
    if (recent.rows.length > 0) continue;

    const scores = row.scores ?? [];
    if (scores.length < 7) continue;

    const half = Math.floor(scores.length / 2);
    const firstAvg = scores.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const secondAvg = scores.slice(-half).reduce((a, b) => a + b, 0) / half;
    const improving = secondAvg <= firstAvg - 0.5;
    const worsening = secondAvg >= firstAvg + 0.5;

    let patternType = 'trend';
    let descriptionVi = 'Đủ data 2 tuần — bắt đầu thấy xu hướng. Tiếp tục check-in để nhận gợi ý chi tiết.';
    let confidence = 60;

    if (improving && firstAvg >= 3) {
      patternType = 'pain_improving';
      descriptionVi = `Nhận ra: điểm đau trung bình từ ${firstAvg.toFixed(1)} xuống ${secondAvg.toFixed(1)} trong 2 tuần. Bài tập đang đúng hướng. Bạn quyết định làm gì với thông tin đó.`;
      confidence = 72;
    } else if (worsening && secondAvg >= 3.5) {
      patternType = 'pain_flare';
      descriptionVi = `Nhận ra: đau có xu hướng tăng trong 2 tuần. Có thể do tải tập, tư thế, hoặc stress. Bạn quyết định làm gì với thông tin đó.`;
      confidence = 65;
    }

    await pool.query(
      `INSERT INTO pattern_observations (user_id, condition_id, pattern_type, description_vi, confidence)
       VALUES ($1, $2, $3, $4, $5)`,
      [row.user_id, row.condition_id, patternType, descriptionVi, confidence]
    );
    inserted += 1;
  }

  return { processed: res.rows.length, inserted };
}
