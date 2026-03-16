-- FitWell — Users & Auth
-- P0 Foundation: users, user_profiles, password_reset_tokens

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id    UUID UNIQUE,
  is_anonymous    BOOLEAN DEFAULT TRUE,
  phone           VARCHAR(15) UNIQUE,
  email           VARCHAR(255) UNIQUE,
  password_hash   VARCHAR(72),
  apple_sub       VARCHAR(255) UNIQUE,
  google_sub      VARCHAR(255) UNIQUE,
  claimed_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
COMMENT ON COLUMN users.apple_sub IS 'Reserved for native app. NULL in Web MVP.';

CREATE TABLE user_profiles (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES users(id),
  age_range                VARCHAR(10),
  occupation               VARCHAR(50),
  onboarding_completed_at  TIMESTAMPTZ,
  ergonomics_setup_done    BOOLEAN DEFAULT FALSE,
  ergonomics_setup_at       TIMESTAMPTZ,
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  token       VARCHAR(64) UNIQUE NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_pwd_reset_token ON password_reset_tokens (token) WHERE used_at IS NULL;
CREATE INDEX idx_users_anonymous ON users (anonymous_id) WHERE anonymous_id IS NOT NULL;
