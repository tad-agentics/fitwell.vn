-- FitWell — Sessions & check-ins

CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  protocol_id     UUID NOT NULL REFERENCES protocols(id),
  status          VARCHAR(15) DEFAULT 'in_progress',
  current_step    INTEGER DEFAULT 0,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  completion_pct  INTEGER DEFAULT 0,
  skipped_steps   INTEGER[] DEFAULT '{}',
  feedback        VARCHAR(10),
  source          VARCHAR(20)
);
CREATE INDEX idx_sessions_user ON sessions (user_id, started_at DESC);

CREATE TABLE checkins (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id),
  condition_id          UUID NOT NULL REFERENCES conditions(id),
  pain_score            SMALLINT NOT NULL CHECK (pain_score BETWEEN 1 AND 5),
  post_session_feedback VARCHAR(10),
  trigger_event         VARCHAR(30),
  free_text             TEXT,
  ai_response           JSONB,
  protocol_id           UUID REFERENCES protocols(id),
  show_exercise_card    BOOLEAN DEFAULT TRUE,
  response_type         VARCHAR(30),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, condition_id, DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh'))
);
CREATE INDEX idx_checkins_user_date ON checkins (user_id, DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') DESC);
