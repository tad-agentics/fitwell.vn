/**
 * Subscription status — paywall gate (5.1). One row per user after migration subscriptions_user_unique.
 */

import { pool } from '../../shared/db.js';
import { AppError } from '../../shared/errors.js';

export interface SubscriptionStatus {
  plan_type: string;
  status: string;
  expires_at: string;
  is_active: boolean;
}

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus | null> {
  const res = await pool.query(
    `SELECT plan_type, status, expires_at FROM subscriptions WHERE user_id = $1 ORDER BY expires_at DESC LIMIT 1`,
    [userId]
  );
  const row = res.rows[0] as { plan_type: string; status: string; expires_at: string } | undefined;
  if (!row) return null;
  const now = new Date().toISOString();
  const isActive =
    (row.status === 'trial' && row.expires_at > now) ||
    (row.status === 'active' && row.expires_at > now) ||
    row.status === 'lifetime';
  return {
    plan_type: row.plan_type,
    status: row.status,
    expires_at: row.expires_at,
    is_active: isActive,
  };
}

export function requireActiveSubscription(status: SubscriptionStatus | null): void {
  if (!status || !status.is_active) {
    throw new AppError('SUBSCRIPTION_REQUIRED', 402, {
      message: 'Trial hết hạn. Vui lòng nâng cấp để tiếp tục.',
    });
  }
}
