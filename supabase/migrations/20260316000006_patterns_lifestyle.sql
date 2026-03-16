-- FitWell — Pattern observations & lifestyle events

CREATE TABLE pattern_observations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  condition_id    UUID REFERENCES conditions(id),
  pattern_type    VARCHAR(30) NOT NULL,
  description_vi  TEXT NOT NULL,
  trigger_label   VARCHAR(50),
  confidence      SMALLINT DEFAULT 0,
  first_observed  TIMESTAMPTZ DEFAULT NOW(),
  last_confirmed  TIMESTAMPTZ DEFAULT NOW(),
  is_dismissed    BOOLEAN DEFAULT FALSE,
  action_taken    VARCHAR(20),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_patterns_user ON pattern_observations (user_id, is_dismissed);

CREATE TABLE lifestyle_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  checkin_id      UUID REFERENCES checkins(id),
  event_type      VARCHAR(20) NOT NULL,
  value_numeric   NUMERIC(5,2),
  value_text      VARCHAR(50),
  source          VARCHAR(20) DEFAULT 'user_input',
  recorded_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_lifestyle_user_type ON lifestyle_events (user_id, event_type, recorded_at DESC);
