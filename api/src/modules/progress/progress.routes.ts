/**
 * GET /api/v1/progress/pain-trend, calendar, stats — P4, S16, S17.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';

export async function progressRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: { days?: string; condition_id?: string } }>('/api/v1/progress/pain-trend', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const conditionId = request.query.condition_id;
    const days = Math.min(Number(request.query.days) || 14, 30);
    const interval = `${days} days`;
    const res = conditionId
      ? await pool.query(
          `SELECT pain_score, created_at FROM checkins WHERE user_id = $1 AND condition_id = $2 AND created_at > NOW() - $3::INTERVAL ORDER BY created_at ASC`,
          [userId, conditionId, interval]
        )
      : await pool.query(
          `SELECT pain_score, created_at FROM checkins WHERE user_id = $1 AND created_at > NOW() - $2::INTERVAL ORDER BY created_at ASC`,
          [userId, interval]
        );
    return reply.status(200).send({ success: true, data: { points: res.rows } });
  });

  app.get<{ Querystring: { condition_id?: string } }>('/api/v1/progress/calendar', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const conditionId = request.query.condition_id;
    const tz = 'Asia/Ho_Chi_Minh';
    const checkinsRes = conditionId
      ? await pool.query(
          `SELECT DATE(created_at AT TIME ZONE $3) AS d, pain_score
           FROM checkins WHERE user_id = $1 AND condition_id = $2 AND created_at >= (CURRENT_DATE AT TIME ZONE $3) - INTERVAL '29 days'
           ORDER BY d ASC`,
          [userId, conditionId, tz]
        )
      : await pool.query(
          `SELECT DATE(created_at AT TIME ZONE $2) AS d, pain_score
           FROM checkins WHERE user_id = $1 AND created_at >= (CURRENT_DATE AT TIME ZONE $2) - INTERVAL '29 days'
           ORDER BY d ASC`,
          [userId, tz]
        );
    const sessionsRes = await pool.query(
      `SELECT DATE(started_at AT TIME ZONE $2) AS d FROM sessions WHERE user_id = $1 AND status = 'completed' AND started_at >= (CURRENT_DATE AT TIME ZONE $2) - INTERVAL '29 days'`,
      [userId, tz]
    );
    const painByDate: Record<string, number> = {};
    (checkinsRes.rows as Array<{ d: string; pain_score: number }>).forEach((r) => {
      const key = r.d;
      if (!painByDate[key] || r.pain_score > painByDate[key]) painByDate[key] = r.pain_score;
    });
    const sessionDates = new Set((sessionsRes.rows as Array<{ d: string }>).map((r) => r.d));
    const days: Array<{ date: string; pain_score: number | null; session_completed: boolean }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        pain_score: painByDate[dateStr] ?? null,
        session_completed: sessionDates.has(dateStr),
      });
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    const statsRes = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM sessions WHERE user_id = $1 AND status = 'completed' AND started_at >= $2) AS sessions_completed,
        (SELECT COUNT(*) FROM checkins WHERE user_id = $1 AND created_at >= $2) AS checkins_total,
        (SELECT COUNT(DISTINCT DATE(created_at AT TIME ZONE $3)) FROM checkins WHERE user_id = $1 AND created_at >= $2 AND pain_score <= 2) AS days_low_pain,
        (SELECT ROUND(AVG(pain_score)::numeric, 1) FROM checkins WHERE user_id = $1 AND created_at >= $2) AS avg_pain`,
      [userId, thirtyDaysAgo, tz]
    );
    const st = statsRes.rows[0] as { sessions_completed: string; checkins_total: string; days_low_pain: string; avg_pain: string | null };
    const stats = {
      sessions_completed: Number(st.sessions_completed),
      checkins_total: Number(st.checkins_total),
      days_low_pain: Number(st.days_low_pain),
      avg_pain: st.avg_pain != null ? Number(st.avg_pain) : null,
    };
    return reply.status(200).send({
      success: true,
      data: {
        days,
        stats: {
          ...stats,
          consistency_pct: Math.min(100, Math.round((stats.sessions_completed / 30) * 100)),
        },
      },
    });
  });

  app.get<{ Querystring: { condition_id?: string } }>('/api/v1/progress/pattern', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const conditionId = request.query.condition_id ?? null;
    const patternRes = conditionId
      ? await pool.query(
          `SELECT id, description_vi, created_at FROM pattern_observations
           WHERE user_id = $1 AND condition_id = $2 AND confidence >= 60 AND is_dismissed = FALSE
           ORDER BY created_at DESC LIMIT 1`,
          [userId, conditionId]
        )
      : await pool.query(
          `SELECT id, description_vi, created_at FROM pattern_observations
           WHERE user_id = $1 AND confidence >= 60 AND is_dismissed = FALSE
           ORDER BY created_at DESC LIMIT 1`,
          [userId]
        );
    const row = patternRes.rows[0] as { description_vi: string } | undefined;
    if (!row) {
      return reply.status(200).send({ success: true, data: { observation: null, is_first_pattern: false } });
    }
    const countRes = conditionId
      ? await pool.query(
          `SELECT COUNT(*) AS n FROM pattern_observations WHERE user_id = $1 AND condition_id = $2 AND confidence >= 60 AND is_dismissed = FALSE`,
          [userId, conditionId]
        )
      : await pool.query(
          `SELECT COUNT(*) AS n FROM pattern_observations WHERE user_id = $1 AND confidence >= 60 AND is_dismissed = FALSE`,
          [userId]
        );
    const isFirst = Number((countRes.rows[0] as { n: string }).n) === 1;
    return reply.status(200).send({
      success: true,
      data: { observation: row.description_vi, is_first_pattern: isFirst },
    });
  });
}
