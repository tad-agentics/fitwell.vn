-- FitWell — Web push subscriptions (VAPID)

CREATE TABLE push_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id),
  endpoint     TEXT NOT NULL,
  auth_key     TEXT NOT NULL,
  p256dh_key   TEXT NOT NULL,
  platform     VARCHAR(20) NOT NULL,
  user_agent   TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, endpoint)
);
CREATE INDEX idx_push_subs_user ON push_subscriptions (user_id, is_active);
