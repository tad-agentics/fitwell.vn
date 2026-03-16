/**
 * Rate limit — stub per plan 0.3. Apply to auth routes in P5 (login 10/15min, register 5/1h).
 */

import type { FastifyRequest, FastifyReply } from 'fastify';

export async function rateLimit(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
  // TODO P5: in-memory or Redis store per IP / email; return 429 when exceeded
  await reply;
}
