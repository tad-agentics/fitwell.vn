/**
 * Morning critical 06:55 send — 4.4. Send push for users with morning_critical_655 schedule (not yet sent today).
 * Run via POST /api/v1/cron/morning-critical (X-Cron-Secret). Requires VAPID keys and web-push.
 */

import webPush from 'web-push';
import { pool } from '../../shared/db.js';

const TZ = 'Asia/Ho_Chi_Minh';

function getVapidKeys(): { publicKey: string; privateKey: string } | null {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return null;
  return { publicKey, privateKey };
}

export async function runMorningCriticalSend(): Promise<{ sent: number; skipped: number; errors: number }> {
  const keys = getVapidKeys();
  if (!keys) {
    return { sent: 0, skipped: 0, errors: 0 };
  }
  webPush.setVapidDetails('mailto:admin@fitwell.vn', keys.publicKey, keys.privateKey);

  const todayStart = await pool.query(
    `SELECT (CURRENT_DATE AT TIME ZONE $1)::TIMESTAMPTZ AS t`,
    [TZ]
  );
  const since = (todayStart.rows[0] as { t: string }).t;

  const schedules = await pool.query(
    `SELECT n.id, n.user_id, n.last_sent_at
     FROM notification_schedules n
     WHERE n.type = 'morning_critical_655' AND n.is_active = TRUE
       AND (n.last_sent_at IS NULL OR n.last_sent_at < $1)`,
    [since]
  );

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of schedules.rows as Array<{ id: string; user_id: string }>) {
    const subs = await pool.query(
      `SELECT id, endpoint, auth_key, p256dh_key FROM push_subscriptions
       WHERE user_id = $1 AND is_active = TRUE`,
      [row.user_id]
    );
    if (subs.rows.length === 0) {
      skipped += 1;
      continue;
    }

    const payload = JSON.stringify({
      title: 'FitWell',
      body: 'Bài buổi sáng — làm trước khi đặt chân xuống sàn hiệu quả hơn.',
      url: '/home',
    });

    let anySent = false;
    for (const sub of subs.rows as Array<{ id: string; endpoint: string; auth_key: string; p256dh_key: string }>) {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { auth: sub.auth_key, p256dh: sub.p256dh_key },
          },
          payload,
          { TTL: 86400 }
        );
        anySent = true;
        await pool.query(
          `UPDATE push_subscriptions SET last_used_at = NOW() WHERE id = $1`,
          [sub.id]
        );
      } catch {
        errors += 1;
      }
    }

    if (anySent) {
      sent += 1;
      await pool.query(
        `UPDATE notification_schedules SET last_sent_at = NOW() WHERE id = $1`,
        [row.id]
      );
      const firstSub = (subs.rows[0] as { id: string }).id;
      await pool.query(
        `INSERT INTO notification_logs (user_id, schedule_id, type, body, deep_link, channel, push_sub_id)
         VALUES ($1, $2, 'morning_critical_655', $3, $4, 'web_push', $5)`,
        [row.user_id, row.id, payload, '/home', firstSub]
      );
    }
  }

  return { sent, skipped, errors };
}
