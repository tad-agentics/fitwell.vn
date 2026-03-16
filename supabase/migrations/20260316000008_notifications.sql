-- FitWell — Notification schedules & logs (after push_subscriptions)

CREATE TABLE notification_schedules (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id),
  type             VARCHAR(30) NOT NULL,
  scheduled_time   TIME NOT NULL,
  is_active        BOOLEAN DEFAULT TRUE,
  last_sent_at     TIMESTAMPTZ,
  timezone         VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
  channel          VARCHAR(15) DEFAULT 'email',
  platform_targets TEXT[] DEFAULT ARRAY['all'],
  condition_slugs  TEXT[],
  is_critical      BOOLEAN DEFAULT FALSE,
  repeat_interval  INTEGER,
  work_hours_only  BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_notif_active ON notification_schedules (is_active, type);

CREATE TABLE notification_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  schedule_id     UUID REFERENCES notification_schedules(id),
  type            VARCHAR(20),
  body            TEXT,
  deep_link       TEXT,
  channel         VARCHAR(15),
  push_sub_id     UUID REFERENCES push_subscriptions(id),
  fcm_message_id  TEXT,
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  opened_at       TIMESTAMPTZ,
  is_dismissed    BOOLEAN NOT NULL DEFAULT FALSE,
  dismissed_at    TIMESTAMPTZ
);
CREATE INDEX idx_notif_pending ON notification_logs (user_id, sent_at DESC) WHERE is_dismissed = FALSE;
