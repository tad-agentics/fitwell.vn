/**
 * GET /api/v1/schedule/daily — multi-condition schedule. P4.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';

export async function scheduleRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/schedule/daily', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const res = await pool.query(
      `SELECT p.id, p.total_duration, c.display_name_vi FROM protocols p JOIN conditions c ON c.id = p.condition_id AND c.user_id = $1 WHERE p.is_current = TRUE`,
      [userId]
    );
    return reply.status(200).send({ success: true, data: { items: res.rows } });
  });
}
