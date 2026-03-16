/**
 * Create anonymous user — POST /api/v1/auth/anonymous/init
 * TechSpec 2.1: first visit → create user (is_anonymous=TRUE), return anonymous_id.
 */

import { randomUUID } from 'crypto';
import { pool } from '../../shared/db.js';

export async function anonymousInit(): Promise<{ anonymous_id: string }> {
  const anonymousId = randomUUID();
  await pool.query(
    `INSERT INTO users (anonymous_id, is_anonymous) VALUES ($1, TRUE)`,
    [anonymousId]
  );
  return { anonymous_id: anonymousId };
}
