/**
 * GET /api/v1/conditions — list user conditions; GET /api/v1/protocols/current for first exercise.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';

export async function conditionsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/conditions', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const res = await pool.query(
      `SELECT c.id, c.display_name_vi, c.primary_region, c.pain_track, c.assessment_required, c.assessment_completed, m.safety_warning_vi
       FROM conditions c LEFT JOIN msk_conditions m ON m.id = c.msk_condition_id WHERE c.user_id = $1 AND c.is_active = TRUE`,
      [userId]
    );
    return reply.status(200).send({
      success: true,
      data: res.rows.map((r: { safety_warning_vi: string | null }) => ({
        ...r,
        safety_warning: r.safety_warning_vi ? { content_vi: r.safety_warning_vi, show_once: true } : null,
      })),
    });
  });

  app.get<{ Querystring: { condition_id: string } }>('/api/v1/protocols/current', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const conditionId = request.query.condition_id;
    if (!conditionId) return reply.status(400).send({ success: false, code: 'VALIDATION_ERROR', message: 'condition_id required' });
    const res = await pool.query(
      `SELECT p.id, p.exercises, p.total_duration FROM protocols p
       JOIN conditions c ON c.id = p.condition_id AND c.user_id = $1
       WHERE p.condition_id = $2 AND p.is_current = TRUE LIMIT 1`,
      [userId, conditionId]
    );
    if (res.rows.length === 0) return reply.status(200).send({ success: true, data: null });
    const row = res.rows[0];
    const exercises = (row.exercises as Array<{ exercise_id: string; order: number; duration_sec: number }>) || [];
    const exIds = exercises.map((e: { exercise_id: string }) => e.exercise_id);
    const exRes = exIds.length ? await pool.query(`SELECT id, slug, name_vi, duration_sec, steps, video_url FROM exercises WHERE id = ANY($1)`, [exIds]) : { rows: [] };
    const exMap = Object.fromEntries((exRes.rows as Array<{ id: string; name_vi: string; duration_sec: number; steps: unknown; video_url: string | null }>).map((e) => [e.id, e]));
    const list = exercises.map((e: { exercise_id: string; order: number; duration_sec: number }) => ({
      ...e,
      name_vi: exMap[e.exercise_id]?.name_vi,
      steps: exMap[e.exercise_id]?.steps,
      video_url: exMap[e.exercise_id]?.video_url,
    }));
    return reply.status(200).send({ success: true, data: { protocol_id: row.id, exercises: list, total_duration: row.total_duration } });
  });
}
