/**
 * POST /api/v1/conditions/:conditionId/assessment — submit test result, get protocol.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';
import { AppError } from '../../shared/errors.js';

export async function assessmentRoutes(app: FastifyInstance): Promise<void> {
  app.post<{
    Params: { conditionId: string };
    Body: { test_slug: string; result: string };
  }>('/api/v1/conditions/:conditionId/assessment', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const { conditionId } = request.params;
    const { test_slug, result } = request.body || {};
    if (!test_slug || !['positive', 'negative', 'inconclusive'].includes(result)) {
      throw new AppError('VALIDATION_ERROR', 400);
    }

    const condRes = await pool.query(
      `SELECT c.id, c.assessment_required, c.msk_condition_id, m.body_region FROM conditions c
       JOIN msk_conditions m ON m.id = c.msk_condition_id
       WHERE c.id = $1 AND c.user_id = $2 AND c.is_active = TRUE`,
      [conditionId, userId]
    );
    if (condRes.rows.length === 0) throw new AppError('NOT_FOUND', 404);
    const cond = condRes.rows[0];
    if (!cond.assessment_required) throw new AppError('ASSESSMENT_NOT_REQUIRED', 400);

    const assessmentResult = result === 'positive' ? 'protocol_b' : 'protocol_a';
    await pool.query(
      `UPDATE conditions SET assessment_completed = TRUE, assessment_done_at = NOW(), assessment_result = $1 WHERE id = $2`,
      [assessmentResult, conditionId]
    );

    // R-H3: Prefer exercises tagged mcKenzie for protocol_a, lateral_shift for protocol_b; fallback to first by body_region
    const exRes = await pool.query<{ id: string; name_vi: string; duration_sec: number }>(
      `SELECT id, name_vi, duration_sec FROM exercises
       WHERE body_region = $1 AND is_published = TRUE
       ORDER BY CASE
         WHEN $2 = 'protocol_a' AND 'mcKenzie' = ANY(COALESCE(clinical_tags, ARRAY[]::TEXT[])) THEN 0
         WHEN $2 = 'protocol_b' AND 'lateral_shift' = ANY(COALESCE(clinical_tags, ARRAY[]::TEXT[])) THEN 0
         ELSE 1
       END
       LIMIT 1`,
      [cond.body_region, assessmentResult]
    );
    let protocol: { exercises: Array<{ exercise_id: string; order: number; duration_sec: number; name_vi: string }>; total_duration: number } | null = null;
    if (exRes.rows.length > 0) {
      const ex = exRes.rows[0];
      await pool.query(
        `INSERT INTO protocols (condition_id, user_id, exercises, generation_type, total_duration, is_current) VALUES ($1, $2, $3, 'rule_based', $4, TRUE)`,
        [conditionId, userId, JSON.stringify([{ exercise_id: ex.id, order: 1, duration_sec: ex.duration_sec, reps: null, notes: null }]), ex.duration_sec]
      );
      protocol = {
        exercises: [{ exercise_id: ex.id, order: 1, duration_sec: ex.duration_sec, name_vi: ex.name_vi }],
        total_duration: ex.duration_sec,
      };
    }

    return reply.status(200).send({
      success: true,
      data: { condition_id: conditionId, assessment_result: assessmentResult, protocol },
    });
  });
}
