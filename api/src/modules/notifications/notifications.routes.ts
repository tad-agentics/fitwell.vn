/**
 * GET /api/v1/notifications/pending, POST /:id/dismiss — P3.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';

export async function notificationsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/notifications/pending', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const res = await pool.query(
      `SELECT id, body, deep_link FROM notification_logs WHERE user_id = $1 AND is_dismissed = FALSE AND sent_at > NOW() - INTERVAL '24 hours' ORDER BY sent_at DESC LIMIT 5`,
      [userId]
    );
    return reply.status(200).send({ success: true, data: res.rows });
  });

  app.post<{ Params: { id: string } }>('/api/v1/notifications/:id/dismiss', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const { id } = request.params;
    await pool.query(`UPDATE notification_logs SET is_dismissed = TRUE, dismissed_at = NOW() WHERE id = $1 AND user_id = $2`, [id, userId]);
    return reply.status(200).send({ success: true });
  });
}
