/**
 * GET /api/v1/conditions — list user conditions; GET/PATCH /api/v1/conditions/:id; GET /api/v1/protocols/current.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';
import { AppError } from '../../shared/errors.js';
import { getSubscriptionStatus, requireActiveSubscription } from '../billing/subscription.service.js';

export async function conditionsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/conditions', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const res = await pool.query(
      `SELECT c.id, c.display_name_vi, c.primary_region, c.pain_track,
              m.assessment_required, m.assessment_test_slug, c.assessment_completed,
              c.msk_condition_id, c.show_safety_warning, m.slug AS msk_slug, m.safety_warning_vi
       FROM conditions c LEFT JOIN msk_conditions m ON m.id = c.msk_condition_id
       WHERE c.user_id = $1 AND c.is_active = TRUE`,
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

  app.get<{ Params: { id: string } }>('/api/v1/conditions/:id', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const res = await pool.query(
      `SELECT c.id, c.display_name_vi, c.primary_region, c.pain_track, c.is_active,
              m.assessment_required, m.assessment_test_slug, c.assessment_completed,
              c.msk_condition_id, c.show_safety_warning, m.slug AS msk_slug, m.safety_warning_vi
       FROM conditions c LEFT JOIN msk_conditions m ON m.id = c.msk_condition_id
       WHERE c.id = $1 AND c.user_id = $2`,
      [request.params.id, userId]
    );
    if (res.rows.length === 0) throw new AppError('NOT_FOUND', 404);
    const r = res.rows[0] as { safety_warning_vi: string | null };
    return reply.status(200).send({
      success: true,
      data: { ...r, safety_warning: r.safety_warning_vi ? { content_vi: r.safety_warning_vi, show_once: true } : null },
    });
  });

  app.patch<{ Params: { id: string }; Body: { is_active?: boolean; safety_warning_acknowledged?: boolean } }>('/api/v1/conditions/:id', {
    preHandler: [authGuard],
    schema: {
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
      body: {
        type: 'object',
        properties: {
          is_active: { type: 'boolean' },
          safety_warning_acknowledged: { type: 'boolean' },
        },
      },
    },
  }, async (request, reply) => {
    const userId = request.user!.id;
    const body = request.body ?? {};
    const { is_active, safety_warning_acknowledged } = body;
    if (is_active === undefined && safety_warning_acknowledged === undefined) {
      throw new AppError('VALIDATION_ERROR', 400, { details: { body: 'require at least one of is_active, safety_warning_acknowledged' } });
    }
    const updates: string[] = ['updated_at = NOW()'];
    const values: unknown[] = [];
    let idx = 1;
    if (is_active !== undefined) {
      updates.push(`is_active = $${idx}`);
      values.push(is_active);
      idx += 1;
    }
    if (safety_warning_acknowledged === true) {
      updates.push('show_safety_warning = FALSE');
    }
    values.push(request.params.id, userId);
    const res = await pool.query(
      `UPDATE conditions SET ${updates.join(', ')} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING id`,
      values
    );
    if (res.rowCount === 0) throw new AppError('NOT_FOUND', 404);
    return reply.status(200).send({ success: true, data: { id: request.params.id, ...(is_active !== undefined && { is_active }), ...(safety_warning_acknowledged === true && { safety_warning_acknowledged: true }) } });
  });

  app.get<{ Querystring: { condition_id: string } }>('/api/v1/protocols/current', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const sub = await getSubscriptionStatus(userId);
    requireActiveSubscription(sub);

    const conditionId = request.query.condition_id;
    if (!conditionId || typeof conditionId !== 'string') return reply.status(400).send({ success: false, code: 'VALIDATION_ERROR', message: 'condition_id required' });
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
