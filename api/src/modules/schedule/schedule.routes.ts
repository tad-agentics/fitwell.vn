/**
 * GET /api/v1/schedule/daily — multi-condition schedule. P4 / SMSK05.
 * GET /api/v1/schedule/morning-critical — 06:55 protocol if user has timing_critical conditions (4.4).
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';

export async function scheduleRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/schedule/daily', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const res = await pool.query(
      `SELECT p.id, p.total_duration, c.id AS condition_id, c.display_name_vi, c.primary_region
       FROM protocols p
       JOIN conditions c ON c.id = p.condition_id AND c.user_id = $1 AND c.is_active = TRUE
       WHERE p.is_current = TRUE
       ORDER BY c.display_name_vi`,
      [userId]
    );
    return reply.status(200).send({ success: true, data: { items: res.rows } });
  });

  app.get('/api/v1/schedule/morning-critical', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const res = await pool.query(
      `SELECT p.id AS protocol_id, p.exercises, p.total_duration, c.display_name_vi
       FROM conditions c
       JOIN msk_conditions m ON m.id = c.msk_condition_id
       JOIN protocols p ON p.condition_id = c.id AND p.user_id = c.user_id AND p.is_current = TRUE
       WHERE c.user_id = $1 AND c.is_active = TRUE AND m.timing_critical = TRUE
       LIMIT 1`,
      [userId]
    );
    if (res.rows.length === 0) {
      return reply.status(200).send({ success: true, data: null });
    }
    return reply.status(200).send({ success: true, data: res.rows[0] });
  });
}
