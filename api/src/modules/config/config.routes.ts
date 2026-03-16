/**
 * GET /api/v1/config/push-key — VAPID public key, no auth.
 * TechSpec: accessible without auth for SW registration.
 */

import type { FastifyInstance } from 'fastify';

export async function configRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/config/push-key', async (_request, reply) => {
    const key = process.env.VAPID_PUBLIC_KEY;
    if (!key) return reply.status(503).send({ success: false, code: 'CONFIG_UNAVAILABLE', message: 'Push not configured' });
    return reply.status(200).send({ success: true, data: { vapid_public_key: key } });
  });
}
