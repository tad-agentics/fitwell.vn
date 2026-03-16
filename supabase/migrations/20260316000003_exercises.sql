-- FitWell — Exercise library

CREATE TABLE exercises (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(50) UNIQUE NOT NULL,
  name_vi          VARCHAR(100) NOT NULL,
  body_region      VARCHAR(20) NOT NULL,
  trigger_patterns TEXT[],
  duration_sec     INTEGER NOT NULL,
  video_url        TEXT,
  thumbnail_url    TEXT,
  steps            JSONB NOT NULL,
  location         VARCHAR(30),
  contraindications TEXT[],
  clinical_tags    TEXT[],
  is_published     BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
