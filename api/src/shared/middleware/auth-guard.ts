/**
 * Auth guard — Bearer JWT or Anonymous <anonymous_id>
 * TechSpec 2.4
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { AppError } from '../errors.js';
import type { UserRow } from '../types.js';
import { JWT_CONFIG } from '../auth.config.js';

export async function authGuard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, JWT_CONFIG.secret, {
        algorithms: [JWT_CONFIG.algorithm],
      }) as { sub: string };
      const res = await pool.query<UserRow>(
        'SELECT id, anonymous_id, is_anonymous, email, claimed_at, created_at, deleted_at FROM users WHERE id = $1 AND deleted_at IS NULL',
        [payload.sub]
      );
      if (res.rows.length === 0) throw new AppError('AUTH_EXPIRED', 401);
      request.user = res.rows[0];
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('AUTH_EXPIRED', 401);
    }
    return;
  }

  if (authHeader?.startsWith('Anonymous ')) {
    const anonymousId = authHeader.slice(10).trim();
    const res = await pool.query<UserRow>(
      'SELECT id, anonymous_id, is_anonymous, email, claimed_at, created_at, deleted_at FROM users WHERE anonymous_id = $1 AND is_anonymous = TRUE AND deleted_at IS NULL',
      [anonymousId]
    );
    if (res.rows.length === 0) throw new AppError('ANONYMOUS_SESSION_EXPIRED', 401);
    request.user = res.rows[0];
    return;
  }

  throw new AppError('AUTH_REQUIRED', 401);
}

export function requireIdentified(request: FastifyRequest): void {
  if (!request.user) throw new AppError('AUTH_REQUIRED', 401);
  if (request.user.is_anonymous) throw new AppError('AUTH_REQUIRED', 401);
}
