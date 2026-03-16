/**
 * GET /api/v1/msk-conditions — public catalog for S02 suggestion chips (no auth).
 */

import type { FastifyInstance } from 'fastify';
import { pool } from '../../shared/db.js';

export async function mskRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: { limit?: string } }>('/api/v1/msk-conditions', async (_request, reply) => {
    const limit = Math.min(Number((_request.query as { limit?: string }).limit) || 10, 100);
    const res = await pool.query(
      `SELECT slug, name_vi, body_region FROM msk_conditions WHERE is_active = TRUE ORDER BY body_region, name_vi LIMIT $1`,
      [limit]
    );
    return reply.status(200).send({ success: true, data: res.rows });
  });
}
