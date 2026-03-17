-- Phase 1 R2-Audit: conditions unique + show_safety_warning
-- R-M3: Prevent duplicate condition rows on double-tap/retry in S04C
-- R-M6: Persist safety warning flag server-side

ALTER TABLE conditions
  ADD CONSTRAINT conditions_user_msk_unique UNIQUE (user_id, msk_condition_id);

ALTER TABLE conditions
  ADD COLUMN IF NOT EXISTS show_safety_warning BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN conditions.show_safety_warning IS 'Set true at intake when msk has safety_warning_vi; cleared when user acknowledges in SMSK08';
