-- R-C2: One subscription per user — enables ON CONFLICT (user_id) in condition-factory and billing webhook
ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_user_unique UNIQUE (user_id);
