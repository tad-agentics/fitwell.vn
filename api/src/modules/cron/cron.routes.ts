/**
 * Cron endpoints — 4.3, 4.4, 4.5. Protected by CRON_SECRET (X-Cron-Secret header).
 * Call from system cron or scheduler (e.g. 03:00 VN pattern, 06:50 VN morning-critical, daily schedule-builder).
 */

import type { IncomingHttpHeaders } from 'http';
import type { FastifyInstance } from 'fastify';
import { runPatternDetection } from './pattern-detection.js';
import { runMorningCriticalSend } from './morning-critical.js';
import { buildMorningSchedulesForTimingCritical } from './schedule-builder.js';

function cronSecret(request: { headers: IncomingHttpHeaders }): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers['x-cron-secret'];
  return typeof header === 'string' && header === secret;
}

export async function cronRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/v1/cron/pattern-detection', async (request, reply) => {
    if (!cronSecret(request)) return reply.status(503).send({ success: false, code: 'CRON_UNAVAILABLE', message: 'Cron secret not configured or invalid' });
    try {
      const result = await runPatternDetection();
      return reply.status(200).send({ success: true, data: result });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ success: false, code: 'INTERNAL_ERROR', message: 'Pattern detection failed' });
    }
  });

  app.post('/api/v1/cron/morning-critical', async (request, reply) => {
    if (!cronSecret(request)) return reply.status(503).send({ success: false, code: 'CRON_UNAVAILABLE', message: 'Cron secret not configured or invalid' });
    try {
      const result = await runMorningCriticalSend();
      return reply.status(200).send({ success: true, data: result });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ success: false, code: 'INTERNAL_ERROR', message: 'Morning critical send failed' });
    }
  });

  app.post('/api/v1/cron/schedule-builder', async (request, reply) => {
    if (!cronSecret(request)) return reply.status(503).send({ success: false, code: 'CRON_UNAVAILABLE', message: 'Cron secret not configured or invalid' });
    try {
      const result = await buildMorningSchedulesForTimingCritical();
      return reply.status(200).send({ success: true, data: result });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ success: false, code: 'INTERNAL_ERROR', message: 'Schedule builder failed' });
    }
  });
}
