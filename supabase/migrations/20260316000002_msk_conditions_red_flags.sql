-- FitWell — MSK catalog & red flags (seed reference data)

CREATE TABLE msk_conditions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  VARCHAR(50) UNIQUE NOT NULL,
  name_vi               VARCHAR(100) NOT NULL,
  name_en               VARCHAR(100),
  body_region           VARCHAR(20) NOT NULL,
  pain_track            VARCHAR(10) NOT NULL,
  phase_count           SMALLINT DEFAULT 2,
  timing_critical       BOOLEAN DEFAULT FALSE,
  timing_slot           VARCHAR(10),
  assessment_required   BOOLEAN DEFAULT FALSE,
  assessment_test_slug  VARCHAR(50),
  safety_warning_vi     TEXT,
  red_flag_ids          TEXT[],
  insight_hook_vi       TEXT,
  contraindication_notes TEXT,
  is_active             BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE red_flag_patterns (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(50) UNIQUE NOT NULL,
  name_vi          VARCHAR(100) NOT NULL,
  trigger_symptoms TEXT[] NOT NULL,
  associated_msk   TEXT[],
  urgency          VARCHAR(15) NOT NULL,
  action_vi        TEXT NOT NULL,
  is_active        BOOLEAN DEFAULT TRUE
);
