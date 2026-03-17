/**
 * FitWell API — Fastify, CORS, normalized errors, v1 routes.
 * P0 Foundation.
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { AppError, errorResponse } from './shared/errors.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { configRoutes } from './modules/config/config.routes.js';
import { onboardingRoutes } from './modules/onboarding/onboarding.routes.js';
import { mskRoutes } from './modules/msk/msk.routes.js';
import { assessmentRoutes } from './modules/msk/assessment.routes.js';
import { sessionsRoutes } from './modules/sessions/sessions.routes.js';
import { conditionsRoutes } from './modules/conditions/conditions.routes.js';
import { checkinRoutes } from './modules/checkin/checkin.routes.js';
import { notificationsRoutes } from './modules/notifications/notifications.routes.js';
import { progressRoutes } from './modules/progress/progress.routes.js';
import { scheduleRoutes } from './modules/schedule/schedule.routes.js';
import { cronRoutes } from './modules/cron/cron.routes.js';
import { billingRoutes } from './modules/billing/billing.routes.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:4321',
  credentials: true,
});

app.setErrorHandler((err, request, reply) => {
  const requestId = request.id;
  if (err instanceof AppError) {
    return reply.status(err.statusCode).send(
      errorResponse(err.code, err.statusCode, err.code, err.details, requestId)
    );
  }
  request.log.error(err);
  return reply.status(500).send(
    errorResponse('INTERNAL_ERROR', 500, 'Internal server error', undefined, requestId)
  );
});

await app.register(healthRoutes);
await app.register(authRoutes);
await app.register(configRoutes);
await app.register(mskRoutes);
await app.register(onboardingRoutes);
await app.register(assessmentRoutes);
await app.register(sessionsRoutes);
await app.register(conditionsRoutes);
await app.register(checkinRoutes);
await app.register(notificationsRoutes);
await app.register(progressRoutes);
await app.register(scheduleRoutes);
await app.register(cronRoutes);
await app.register(billingRoutes);

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST ?? '0.0.0.0';

try {
  await app.listen({ port, host });
} catch (e) {
  app.log.error(e);
  process.exit(1);
}
