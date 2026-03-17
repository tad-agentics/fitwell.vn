/**
 * Billing — PayOS create-order, payment-status, webhook; subscription status. P5 / R-C1.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';
import { AppError } from '../../shared/errors.js';
import { getSubscriptionStatus } from './subscription.service.js';
import { createPaymentLink, getPaymentLinkInfo, verifyWebhookSignature } from './payos.service.js';

const PLAN_AMOUNTS: Record<string, number> = {
  '6month': 299_000,
  '1year': 499_000,
};

const BASE_URL = process.env.PUBLIC_WEB_URL || process.env.CORS_ORIGIN || 'http://localhost:4321';

export async function billingRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/billing/subscription', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const sub = await getSubscriptionStatus(userId);
    return reply.status(200).send({
      success: true,
      data: sub ?? { plan_type: 'trial', status: 'none', expires_at: new Date(0).toISOString(), is_active: false },
    });
  });

  app.post<{ Body: { plan_type?: string; platform?: string } }>(
    '/api/v1/billing/create-order',
    {
      preHandler: [authGuard],
      schema: {
        body: {
          type: 'object',
          properties: {
            plan_type: { type: 'string', enum: ['6month', '1year'] },
            platform: { type: 'string', enum: ['desktop', 'mobile'] },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.id;
      const planType = (request.body?.plan_type ?? '6month') as string;
      const amount = PLAN_AMOUNTS[planType] ?? PLAN_AMOUNTS['6month'];
      const orderCode = Math.floor(Date.now() / 1000) * 100 + Math.floor(Math.random() * 100);

      const returnUrl = `${BASE_URL}/paywall?success=1&order=${orderCode}`;
      const cancelUrl = `${BASE_URL}/paywall?cancel=1`;

      const result = await createPaymentLink({
        orderCode,
        amount,
        description: `FitWell ${planType}`.slice(0, 9),
        returnUrl,
        cancelUrl,
      });

      if (!result) {
        throw new AppError('BILLING_UNAVAILABLE', 503, { message: 'PayOS chưa cấu hình. Liên hệ hỗ trợ.' });
      }

      await pool.query(
        `INSERT INTO payos_orders (user_id, payos_order_id, plan_type, amount_vnd, platform, status, checkout_url, qr_code_url, expires_at)
         VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, to_timestamp($8))`,
        [userId, String(result.orderCode), planType, result.amount, request.body?.platform ?? 'desktop', result.checkoutUrl, result.qrCode ?? null, Math.floor(Date.now() / 1000) + 15 * 60]
      );

      return reply.status(201).send({
        success: true,
        data: {
          order_id: String(result.orderCode),
          checkout_url: result.checkoutUrl,
          qr_code_url: result.qrCode ?? null,
          amount_vnd: result.amount,
          expires_at: new Date((Math.floor(Date.now() / 1000) + 15 * 60) * 1000).toISOString(),
        },
      });
    }
  );

  app.get<{ Querystring: { order_id: string } }>(
    '/api/v1/billing/payment-status',
    { preHandler: [authGuard] },
    async (request, reply) => {
      const userId = request.user!.id;
      const orderId = request.query.order_id;
      if (!orderId) {
        throw new AppError('BAD_REQUEST', 400, { message: 'order_id required' });
      }
      const orderRes = await pool.query(
        `SELECT payos_order_id, status, confirmed_at FROM payos_orders WHERE (id::text = $1 OR payos_order_id = $1) AND user_id = $2`,
        [orderId, userId]
      );
      if (orderRes.rows.length === 0) {
        throw new AppError('NOT_FOUND', 404);
      }
      const row = orderRes.rows[0] as { payos_order_id: string; status: string; confirmed_at: string | null };
      if (row.status === 'confirmed') {
        return reply.status(200).send({
          success: true,
          data: { status: 'confirmed', order_id: row.payos_order_id, confirmed_at: row.confirmed_at },
        });
      }
      const info = await getPaymentLinkInfo(row.payos_order_id);
      if (info?.status === 'PAID' || info?.status === 'paid') {
        await pool.query(
          `UPDATE payos_orders SET status = 'confirmed', confirmed_at = NOW() WHERE payos_order_id = $1 AND user_id = $2`,
          [row.payos_order_id, userId]
        );
        return reply.status(200).send({
          success: true,
          data: { status: 'confirmed', order_id: row.payos_order_id, confirmed_at: new Date().toISOString() },
        });
      }
      if (info?.status === 'CANCELLED' || info?.status === 'cancelled') {
        return reply.status(200).send({ success: true, data: { status: 'cancelled', order_id: row.payos_order_id } });
      }
      return reply.status(200).send({ success: true, data: { status: 'pending', order_id: row.payos_order_id } });
    }
  );

  app.post('/api/v1/billing/payos-webhook', async (request, reply) => {
    const payload = request.body as { code?: string; success?: boolean; data?: Record<string, unknown>; signature?: string };
    if (!verifyWebhookSignature(payload)) {
      return reply.status(400).send({ success: false, code: 'INVALID_SIGNATURE' });
    }
    if (payload.code !== '00' || !payload.success || !payload.data) {
      return reply.status(200).send({ success: true });
    }
    const orderCode = payload.data.orderCode as number;
    const amount = payload.data.amount as number;
    const orderRes = await pool.query(
      `SELECT user_id, plan_type FROM payos_orders WHERE payos_order_id = $1 AND status = 'pending'`,
      [String(orderCode)]
    );
    if (orderRes.rows.length === 0) {
      return reply.status(200).send({ success: true });
    }
    const { user_id, plan_type } = orderRes.rows[0] as { user_id: string; plan_type: string };
    const expiresAt = new Date();
    if (plan_type === '1year') expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    else expiresAt.setMonth(expiresAt.getMonth() + 6);

    await pool.query(
      `UPDATE payos_orders SET status = 'confirmed', confirmed_at = NOW() WHERE payos_order_id = $1`,
      [String(orderCode)]
    );
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan_type, status, expires_at, amount_vnd, payos_order_id)
       VALUES ($1, $2, 'active', $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET plan_type = EXCLUDED.plan_type, status = EXCLUDED.status, expires_at = EXCLUDED.expires_at, amount_vnd = EXCLUDED.amount_vnd, payos_order_id = EXCLUDED.payos_order_id`,
      [user_id, plan_type, expiresAt.toISOString(), amount, String(orderCode)]
    );

    return reply.status(200).send({ success: true });
  });
}
