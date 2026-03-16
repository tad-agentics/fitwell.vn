/**
 * GET /api/v1/health — no auth. TechSpec P6 gate.
 */

import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/health', async (_request, reply) => {
    return reply.status(200).send({ success: true, data: { status: 'ok' } });
  });
}
