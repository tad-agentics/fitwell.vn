/**
 * Billing stub — PayOS create order, webhook, payment status. P5.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';

export async function billingRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: { plan_type: string; platform?: string } }>('/api/v1/billing/create-order', { preHandler: [authGuard] }, async (request, reply) => {
    return reply.status(501).send({ success: false, code: 'NOT_IMPLEMENTED', message: 'PayOS integration in P5' });
  });

  app.get<{ Querystring: { order_id: string } }>('/api/v1/billing/payment-status', { preHandler: [authGuard] }, async (request, reply) => {
    return reply.status(501).send({ success: false, code: 'NOT_IMPLEMENTED', message: 'PayOS integration in P5' });
  });

  app.post('/api/v1/billing/payos-webhook', async (_request, reply) => {
    return reply.status(501).send({ success: false, code: 'NOT_IMPLEMENTED', message: 'PayOS webhook in P5' });
  });
}
