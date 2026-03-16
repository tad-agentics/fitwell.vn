/**
 * Auth routes — anonymous init (P0), GET /me for profile (day number), placeholder for Google/email (P5)
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';
import { anonymousInit } from './anonymous.service.js';

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: Record<string, never> }>('/api/v1/auth/anonymous/init', async (request, reply) => {
    const { anonymous_id } = await anonymousInit();
    return reply.status(200).send({ success: true, data: { anonymous_id } });
  });

  app.get('/api/v1/me', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const res = await pool.query(
      `SELECT onboarding_completed_at FROM user_profiles WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    const row = res.rows[0] as { onboarding_completed_at: string | null } | undefined;
    return reply.status(200).send({
      success: true,
      data: { onboarding_completed_at: row?.onboarding_completed_at ?? null },
    });
  });
}
