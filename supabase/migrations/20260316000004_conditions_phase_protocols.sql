-- FitWell — User conditions, phase gate, protocols

CREATE TABLE conditions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id),
  msk_condition_id     UUID REFERENCES msk_conditions(id),
  body_regions         TEXT[],
  trigger_pattern      VARCHAR(30),
  current_treatments   TEXT[],
  primary_region       VARCHAR(20),
  pain_track           VARCHAR(10),
  display_name_vi      VARCHAR(100),
  phase_current        SMALLINT DEFAULT 1,
  assessment_result    VARCHAR(20),
  assessment_completed BOOLEAN DEFAULT FALSE,
  assessment_done_at   TIMESTAMPTZ,
  is_active            BOOLEAN DEFAULT TRUE,
  adaptation_signal    VARCHAR(30) DEFAULT 'none',
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE phase_progress (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id),
  condition_id        UUID NOT NULL REFERENCES conditions(id),
  phase_number        SMALLINT NOT NULL,
  status              VARCHAR(15) DEFAULT 'active',
  unlock_criteria     JSONB,
  phase_started_at    TIMESTAMPTZ DEFAULT NOW(),
  phase_completed_at  TIMESTAMPTZ,
  unlock_blocked_reason TEXT,
  UNIQUE (user_id, condition_id, phase_number)
);
CREATE INDEX idx_phase_progress_user ON phase_progress (user_id, condition_id, phase_number);

CREATE TABLE protocols (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id    UUID NOT NULL REFERENCES conditions(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  exercises       JSONB NOT NULL,
  ai_reasoning    TEXT,
  ai_model        VARCHAR(30),
  generation_type VARCHAR(20),
  total_duration  INTEGER,
  difficulty      VARCHAR(10),
  version         INTEGER DEFAULT 1,
  is_current      BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_protocols_condition ON protocols (condition_id, is_current);
