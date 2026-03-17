/**
 * POST /api/v1/sessions, PATCH /:id, POST /:id/complete — exercise session tracking.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';
import { AppError } from '../../shared/errors.js';
import { evaluateAndAdvancePhase } from '../protocol-engine/phase-gate-evaluator.js';
import { getSubscriptionStatus, requireActiveSubscription } from '../billing/subscription.service.js';

export async function sessionsRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { id: string } }>('/api/v1/sessions/:id', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const { id } = request.params;
    const sessionRes = await pool.query(
      `SELECT s.id, s.protocol_id, s.status, s.current_step FROM sessions s WHERE s.id = $1 AND s.user_id = $2`,
      [id, userId]
    );
    if (sessionRes.rows.length === 0) throw new AppError('NOT_FOUND', 404);
    const row = sessionRes.rows[0];
    const protocolRes = await pool.query(
      `SELECT p.exercises, p.total_duration FROM protocols p WHERE p.id = $1`,
      [row.protocol_id]
    );
    const protocol = protocolRes.rows[0];
    const exercises = (protocol?.exercises as Array<{ exercise_id: string; order: number; duration_sec: number }>) || [];
    const exIds = exercises.map((e: { exercise_id: string }) => e.exercise_id);
    const exRes = exIds.length ? await pool.query(`SELECT id, name_vi, duration_sec, steps, video_url FROM exercises WHERE id = ANY($1)`, [exIds]) : { rows: [] };
    const exMap = Object.fromEntries((exRes.rows as Array<{ id: string; name_vi: string; duration_sec: number; steps: unknown; video_url: string | null }>).map((e) => [e.id, e]));
    const list = exercises.map((e: { exercise_id: string; order: number; duration_sec: number }) => ({
      ...e,
      name_vi: exMap[e.exercise_id]?.name_vi,
      steps: exMap[e.exercise_id]?.steps,
      video_url: exMap[e.exercise_id]?.video_url,
    }));
    return reply.status(200).send({
      success: true,
      data: {
        session_id: row.id,
        protocol_id: row.protocol_id,
        status: row.status,
        current_step: row.current_step,
        exercises: list,
        total_duration: protocol?.total_duration ?? 0,
      },
    });
  });

  app.patch<{
    Params: { id: string };
    Body: { current_step?: number; status?: string; completion_pct?: number };
  }>('/api/v1/sessions/:id', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const { id } = request.params;
    const body = request.body || {};
    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;
    if (body.current_step != null) {
      updates.push(`current_step = $${idx}`);
      values.push(body.current_step);
      idx++;
    }
    if (body.status != null) {
      updates.push(`status = $${idx}`);
      values.push(body.status);
      idx++;
    }
    if (body.completion_pct != null) {
      updates.push(`completion_pct = $${idx}`);
      values.push(body.completion_pct);
      idx++;
    }
    if (body.status === 'exited' && body.completion_pct == null) {
      updates.push(`completion_pct = 0`);
    }
    if (updates.length === 0) return reply.status(200).send({ success: true, data: { session_id: id } });
    values.push(id, userId);
    const res = await pool.query(
      `UPDATE sessions SET ${updates.join(', ')} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING id`,
      values
    );
    if (res.rowCount === 0) throw new AppError('NOT_FOUND', 404);
    return reply.status(200).send({ success: true, data: { session_id: id } });
  });

  app.post<{ Body: { protocol_id: string; source?: string } }>('/api/v1/sessions', {
    preHandler: [authGuard],
    schema: {
      body: {
        type: 'object',
        required: ['protocol_id'],
        properties: {
          protocol_id: { type: 'string' },
          source: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const userId = request.user!.id;
    const sub = await getSubscriptionStatus(userId);
    requireActiveSubscription(sub);

    const { protocol_id, source = 'manual' } = request.body || {};
    if (!protocol_id) throw new AppError('VALIDATION_ERROR', 400);

    const res = await pool.query(
      `INSERT INTO sessions (user_id, protocol_id, source) VALUES ($1, $2, $3) RETURNING id`,
      [userId, protocol_id, source]
    );
    return reply.status(201).send({ success: true, data: { session_id: res.rows[0].id } });
  });

  app.post<{ Params: { id: string }; Body: { completion_pct?: number; feedback?: string } }>(
    '/api/v1/sessions/:id/complete',
    { preHandler: [authGuard] },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params;
      const { completion_pct = 100, feedback } = request.body || {};

      const res = await pool.query(
        `UPDATE sessions SET status = 'completed', completed_at = NOW(), completion_pct = $1, feedback = $2 WHERE id = $3 AND user_id = $4 RETURNING id, protocol_id`,
        [completion_pct, feedback ?? null, id, userId]
      );
      if (res.rowCount === 0) throw new AppError('NOT_FOUND', 404);
      const protocolId = (res.rows[0] as { protocol_id: string }).protocol_id;
      if (protocolId) {
        const condRes = await pool.query(`SELECT condition_id FROM protocols WHERE id = $1`, [protocolId]);
        const conditionId = (condRes.rows[0] as { condition_id: string } | undefined)?.condition_id;
        if (conditionId) evaluateAndAdvancePhase(userId, conditionId).catch(() => {});
      }
      return reply.status(200).send({ success: true, data: { session_id: id } });
    }
  );
}
