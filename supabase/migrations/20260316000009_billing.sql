-- FitWell — PayOS orders & subscriptions

CREATE TABLE payos_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  payos_order_id  TEXT UNIQUE NOT NULL,
  plan_type       VARCHAR(10) NOT NULL,
  amount_vnd      INTEGER NOT NULL,
  platform        VARCHAR(10),
  status          VARCHAR(10) DEFAULT 'pending',
  qr_code_url     TEXT,
  checkout_url    TEXT NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL,
  confirmed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payos_orders_user ON payos_orders (user_id, created_at DESC);
CREATE INDEX idx_payos_orders_id ON payos_orders (payos_order_id);

CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  plan_type       VARCHAR(10) NOT NULL,
  status          VARCHAR(10) NOT NULL,
  amount_vnd      INTEGER,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  payos_order_id  TEXT,
  store_receipt   TEXT
);
