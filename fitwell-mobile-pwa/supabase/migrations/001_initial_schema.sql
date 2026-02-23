-- ============================================================
-- FitWell Mobile PWA - Initial Schema Migration
-- Health/wellness app for Vietnamese users managing
-- gout, cholesterol, and back pain.
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. HELPER FUNCTIONS
-- ============================================================

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit columns trigger: auto-compute day_of_week and hour_of_day
CREATE OR REPLACE FUNCTION public.handle_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
  NEW.day_of_week = EXTRACT(DOW FROM now());
  NEW.hour_of_day = EXTRACT(HOUR FROM now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- -----------------------------------------------------------
-- 2.1 profiles
-- -----------------------------------------------------------
CREATE TABLE public.profiles (
  id                          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                       TEXT,
  language                    TEXT DEFAULT 'vi',
  primary_conditions          TEXT[] DEFAULT '{}',
  onboarding_complete         BOOLEAN DEFAULT FALSE,

  -- lifestyle fields
  desk_hours                  INT,
  eating_out_freq             TEXT,
  back_pain_freq              TEXT,
  highest_risk_env            TEXT,
  account_usage               TEXT,

  -- notification preferences
  notification_morning        BOOLEAN DEFAULT TRUE,
  notification_midday         BOOLEAN DEFAULT TRUE,
  notification_pre_sleep      BOOLEAN DEFAULT TRUE,
  notification_brief          BOOLEAN DEFAULT TRUE,
  morning_time                TEXT DEFAULT '07:00',
  pre_sleep_time              TEXT DEFAULT '21:30',

  -- free-tier counters
  free_scenario_uses          INT DEFAULT 0,
  free_post_event_checkins_used INT DEFAULT 0,
  free_brief_reads            INT DEFAULT 0,
  brief_weeks_completed       INT DEFAULT 0,

  created_at                  TIMESTAMPTZ DEFAULT now(),
  updated_at                  TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.2 households
-- -----------------------------------------------------------
CREATE TABLE public.households (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_id        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invite_token      TEXT UNIQUE,
  invite_expires_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.3 biomarkers
-- -----------------------------------------------------------
CREATE TABLE public.biomarkers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  marker_type  TEXT NOT NULL CHECK (marker_type IN (
    'uric_acid','cholesterol_total','ldl','hdl',
    'triglycerides','crp','hba1c',
    'blood_pressure_sys','blood_pressure_dia'
  )),
  value        NUMERIC NOT NULL,
  unit         TEXT NOT NULL,
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.4 scenarios
-- -----------------------------------------------------------
CREATE TABLE public.scenarios (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_vi         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  description_vi   TEXT NOT NULL,
  description_en   TEXT NOT NULL,
  category         TEXT NOT NULL,
  risk_level       INT NOT NULL CHECK (risk_level BETWEEN 1 AND 5),
  condition_tags   TEXT[] DEFAULT '{}',
  meal_strategy    JSONB,
  desk_breaks      JSONB,
  avoid_items_vi   TEXT[] DEFAULT '{}',
  avoid_items_en   TEXT[] DEFAULT '{}',
  safe_items_vi    TEXT[] DEFAULT '{}',
  safe_items_en    TEXT[] DEFAULT '{}',
  image_url        TEXT,
  read_time_minutes INT DEFAULT 5,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.5 scenario_sessions
-- -----------------------------------------------------------
CREATE TABLE public.scenario_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scenario_id   UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  completed_at  TIMESTAMPTZ DEFAULT now(),
  day_of_week   INT,
  hour_of_day   INT
);

-- -----------------------------------------------------------
-- 2.6 checkins
-- -----------------------------------------------------------
CREATE TABLE public.checkins (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trigger          TEXT NOT NULL CHECK (trigger IN ('morning','post_event','midday','pre_sleep')),
  sleep_quality    TEXT,
  body_feeling     TEXT,
  back_pain_score  INT,
  event_type       TEXT CHECK (event_type IN (
    'heavy_night','rich_meal','long_desk','stress_day','travel','celebration'
  )),
  event_intensity  TEXT,
  afternoon_state  TEXT,
  day_of_week      INT,
  hour_of_day      INT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.7 micro_actions
-- -----------------------------------------------------------
CREATE TABLE public.micro_actions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_vi         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  description_vi   TEXT NOT NULL,
  description_en   TEXT NOT NULL,
  category         TEXT NOT NULL,
  condition_tags   TEXT[] DEFAULT '{}',
  context_tags     TEXT[] DEFAULT '{}',
  duration_seconds INT,
  reps             INT,
  video_url        TEXT,
  video_url_webm   TEXT,
  video_thumb_url  TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.8 action_sessions
-- -----------------------------------------------------------
CREATE TABLE public.action_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_id        UUID NOT NULL REFERENCES public.micro_actions(id) ON DELETE CASCADE,
  checkin_id       UUID REFERENCES public.checkins(id) ON DELETE SET NULL,
  completed_at     TIMESTAMPTZ DEFAULT now(),
  duration_seconds INT,
  day_of_week      INT,
  hour_of_day      INT
);

-- -----------------------------------------------------------
-- 2.9 recovery_protocols
-- -----------------------------------------------------------
CREATE TABLE public.recovery_protocols (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  checkin_id   UUID NOT NULL REFERENCES public.checkins(id) ON DELETE CASCADE,
  event_type   TEXT NOT NULL,
  intensity    TEXT NOT NULL,
  total_days   INT NOT NULL CHECK (total_days BETWEEN 1 AND 3),
  current_day  INT DEFAULT 1,
  status       TEXT DEFAULT 'active' CHECK (status IN ('active','completed','skipped')),
  started_at   TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- -----------------------------------------------------------
-- 2.10 push_subscriptions
-- -----------------------------------------------------------
CREATE TABLE public.push_subscriptions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint   TEXT NOT NULL,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.11 notification_governor
-- -----------------------------------------------------------
CREATE TABLE public.notification_governor (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  daily_count          INT DEFAULT 0,
  consecutive_ignored  INT DEFAULT 0,
  mode                 TEXT DEFAULT 'normal' CHECK (mode IN ('normal','reduced','weekly_only')),
  last_reset_at        TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.12 subscriptions
-- -----------------------------------------------------------
CREATE TABLE public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan            TEXT NOT NULL,
  status          TEXT DEFAULT 'free' CHECK (status IN ('free','active','expired','cancelled')),
  payos_order_id  TEXT,
  amount          NUMERIC,
  currency        TEXT DEFAULT 'VND',
  started_at      TIMESTAMPTZ DEFAULT now(),
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.13 weekly_briefs
-- -----------------------------------------------------------
CREATE TABLE public.weekly_briefs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start    DATE NOT NULL,
  insight_tier  INT NOT NULL CHECK (insight_tier BETWEEN 1 AND 4),
  headline_vi   TEXT NOT NULL,
  headline_en   TEXT NOT NULL,
  content       JSONB NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- 2.14 analytics_events
-- -----------------------------------------------------------
CREATE TABLE public.analytics_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_name  TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biomarkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_governor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- ----- profiles -----
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ----- households -----
CREATE POLICY "households_select_own" ON public.households
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = partner_id);
CREATE POLICY "households_insert_own" ON public.households
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "households_update_own" ON public.households
  FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "households_delete_own" ON public.households
  FOR DELETE USING (auth.uid() = owner_id);

-- ----- biomarkers -----
CREATE POLICY "biomarkers_select_own" ON public.biomarkers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "biomarkers_insert_own" ON public.biomarkers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "biomarkers_update_own" ON public.biomarkers
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "biomarkers_delete_own" ON public.biomarkers
  FOR DELETE USING (auth.uid() = user_id);

-- ----- scenarios (readable by all authenticated) -----
CREATE POLICY "scenarios_select_authenticated" ON public.scenarios
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "scenarios_insert_service" ON public.scenarios
  FOR INSERT WITH CHECK (FALSE);  -- only via service role / migrations
CREATE POLICY "scenarios_update_service" ON public.scenarios
  FOR UPDATE USING (FALSE);
CREATE POLICY "scenarios_delete_service" ON public.scenarios
  FOR DELETE USING (FALSE);

-- ----- scenario_sessions -----
CREATE POLICY "scenario_sessions_select_own" ON public.scenario_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scenario_sessions_insert_own" ON public.scenario_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ----- checkins -----
CREATE POLICY "checkins_select_own" ON public.checkins
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "checkins_insert_own" ON public.checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "checkins_update_own" ON public.checkins
  FOR UPDATE USING (auth.uid() = user_id);

-- ----- micro_actions (readable by all authenticated) -----
CREATE POLICY "micro_actions_select_authenticated" ON public.micro_actions
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "micro_actions_insert_service" ON public.micro_actions
  FOR INSERT WITH CHECK (FALSE);
CREATE POLICY "micro_actions_update_service" ON public.micro_actions
  FOR UPDATE USING (FALSE);
CREATE POLICY "micro_actions_delete_service" ON public.micro_actions
  FOR DELETE USING (FALSE);

-- ----- action_sessions -----
CREATE POLICY "action_sessions_select_own" ON public.action_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "action_sessions_insert_own" ON public.action_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ----- recovery_protocols -----
CREATE POLICY "recovery_protocols_select_own" ON public.recovery_protocols
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recovery_protocols_insert_own" ON public.recovery_protocols
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recovery_protocols_update_own" ON public.recovery_protocols
  FOR UPDATE USING (auth.uid() = user_id);

-- ----- push_subscriptions -----
CREATE POLICY "push_subscriptions_select_own" ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "push_subscriptions_insert_own" ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "push_subscriptions_delete_own" ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- ----- notification_governor -----
CREATE POLICY "notification_governor_select_own" ON public.notification_governor
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notification_governor_insert_own" ON public.notification_governor
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notification_governor_update_own" ON public.notification_governor
  FOR UPDATE USING (auth.uid() = user_id);

-- ----- subscriptions -----
CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert_own" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- ----- weekly_briefs -----
CREATE POLICY "weekly_briefs_select_own" ON public.weekly_briefs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "weekly_briefs_update_own" ON public.weekly_briefs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "weekly_briefs_insert_own" ON public.weekly_briefs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ----- analytics_events -----
CREATE POLICY "analytics_events_insert_own" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analytics_events_select_own" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id);


-- ============================================================
-- 4. TRIGGERS
-- ============================================================

-- updated_at on profiles
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- updated_at on scenarios
CREATE TRIGGER set_scenarios_updated_at
  BEFORE UPDATE ON public.scenarios
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Audit columns on checkins
CREATE TRIGGER set_checkins_audit
  BEFORE INSERT ON public.checkins
  FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();

-- Audit columns on scenario_sessions
CREATE TRIGGER set_scenario_sessions_audit
  BEFORE INSERT ON public.scenario_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();

-- Audit columns on action_sessions
CREATE TRIGGER set_action_sessions_audit
  BEFORE INSERT ON public.action_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();

-- Auto-create profile on sign-up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 5. INDEXES
-- ============================================================

CREATE INDEX idx_biomarkers_user_id ON public.biomarkers(user_id);
CREATE INDEX idx_biomarkers_marker_type ON public.biomarkers(user_id, marker_type, recorded_at DESC);
CREATE INDEX idx_scenario_sessions_user_id ON public.scenario_sessions(user_id);
CREATE INDEX idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX idx_checkins_user_trigger ON public.checkins(user_id, trigger, created_at DESC);
CREATE INDEX idx_action_sessions_user_id ON public.action_sessions(user_id);
CREATE INDEX idx_recovery_protocols_user_id ON public.recovery_protocols(user_id, status);
CREATE INDEX idx_weekly_briefs_user_id ON public.weekly_briefs(user_id, week_start DESC);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id, created_at DESC);
CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name, created_at DESC);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id, status);
CREATE INDEX idx_scenarios_category ON public.scenarios(category);
CREATE INDEX idx_micro_actions_category ON public.micro_actions(category);


-- ============================================================
-- 6. SEED DATA - SCENARIOS (20)
-- ============================================================

INSERT INTO public.scenarios (
  title_vi, title_en, description_vi, description_en,
  category, risk_level, condition_tags,
  meal_strategy, desk_breaks,
  avoid_items_vi, avoid_items_en,
  safe_items_vi, safe_items_en,
  read_time_minutes
) VALUES

-- 1. dining_out / gout
(
  'Nhậu hải sản với đồng nghiệp',
  'Seafood dinner with colleagues',
  'Bạn được mời đi ăn hải sản tối nay. Đây là hướng dẫn chọn món an toàn cho người bị gout, giúp bạn vẫn tham gia vui vẻ mà không lo cơn đau bùng phát.',
  'You are invited to a seafood dinner tonight. This guide helps gout patients choose safe dishes so you can enjoy the meal without triggering a flare-up.',
  'dining_out', 4, ARRAY['gout'],
  '{"pre_meal": "Uống 500ml nước trước 30 phút", "during": "Ưu tiên cá sông, rau xanh, tránh tôm hùm và mực", "post_meal": "Uống thêm 300ml nước lọc trước khi ngủ"}'::jsonb,
  NULL,
  ARRAY['Tôm hùm', 'Mực', 'Sò huyết', 'Cua ghẹ', 'Bia'],
  ARRAY['Lobster', 'Squid', 'Blood cockle', 'Crab', 'Beer'],
  ARRAY['Cá basa hấp', 'Rau muống luộc', 'Canh chua cá lóc', 'Đậu bắp luộc'],
  ARRAY['Steamed basa fish', 'Boiled morning glory', 'Sour fish soup', 'Boiled okra'],
  4
),

-- 2. drinking / gout + cholesterol
(
  'Buổi tiệc cuối tuần có rượu bia',
  'Weekend party with alcohol',
  'Tiệc cuối tuần luôn có rượu bia. Hướng dẫn này giúp bạn kiểm soát lượng cồn nạp vào, bảo vệ mức acid uric và cholesterol.',
  'Weekend parties always involve alcohol. This guide helps you control alcohol intake to protect your uric acid and cholesterol levels.',
  'drinking', 5, ARRAY['gout', 'cholesterol'],
  '{"pre_meal": "Ăn nhẹ trước khi uống: bánh mì, chuối", "during": "Xen kẽ 1 ly rượu với 1 ly nước lọc", "post_meal": "Uống 1 lít nước trước khi ngủ, bổ sung vitamin C"}'::jsonb,
  NULL,
  ARRAY['Bia', 'Rượu vang đỏ', 'Cocktail đường cao', 'Nội tạng nướng', 'Khô mực'],
  ARRAY['Beer', 'Red wine', 'High-sugar cocktails', 'Grilled organ meats', 'Dried squid'],
  ARRAY['Rượu vang trắng (1 ly)', 'Nước chanh tươi', 'Hạt điều rang nhạt', 'Trái cây tươi'],
  ARRAY['White wine (1 glass)', 'Fresh lemon water', 'Lightly roasted cashews', 'Fresh fruit'],
  5
),

-- 3. office / back_pain
(
  'Ngồi họp marathon 4 tiếng liền',
  'Back-to-back meetings for 4 hours',
  'Bạn có lịch họp kín cả buổi sáng. Hướng dẫn giúp bảo vệ cột sống và giảm áp lực lên lưng dưới khi ngồi lâu.',
  'You have wall-to-wall meetings all morning. This guide protects your spine and reduces lower back pressure during prolonged sitting.',
  'office', 3, ARRAY['back_pain'],
  NULL,
  '{"every_45_min": "Đứng dậy, nghiêng người sang hai bên 5 lần", "micro_break": "Xoay vai 10 vòng, duỗi tay lên trần", "lunch": "Đi bộ 10 phút sau ăn trưa"}'::jsonb,
  ARRAY[]::text[], ARRAY[]::text[],
  ARRAY[]::text[], ARRAY[]::text[],
  3
),

-- 4. dining_out / cholesterol
(
  'Ăn buffet với gia đình',
  'Family buffet dinner',
  'Buffet là thử thách lớn cho người quản lý cholesterol. Hướng dẫn chọn món thông minh giúp bạn vừa thưởng thức vừa kiểm soát lipid máu.',
  'Buffets are a big challenge for cholesterol management. Smart dish selection helps you enjoy the meal while keeping lipids in check.',
  'dining_out', 4, ARRAY['cholesterol'],
  '{"pre_meal": "Ăn 1 quả táo trước 20 phút", "during": "Lấy rau trước, protein nạc sau, tránh chiên", "post_meal": "Đi bộ nhẹ 15 phút sau ăn"}'::jsonb,
  NULL,
  ARRAY['Đồ chiên giòn', 'Thịt mỡ', 'Phô mai béo', 'Kem', 'Sốt mayonnaise'],
  ARRAY['Deep-fried items', 'Fatty meats', 'Full-fat cheese', 'Ice cream', 'Mayonnaise'],
  ARRAY['Cá hồi nướng', 'Salad rau xanh', 'Gà nướng bỏ da', 'Rau hấp', 'Trái cây tươi'],
  ARRAY['Grilled salmon', 'Green salad', 'Skinless grilled chicken', 'Steamed vegetables', 'Fresh fruit'],
  5
),

-- 5. celebration / gout
(
  'Tiệc cưới - ăn gì cho an toàn?',
  'Wedding banquet - what is safe to eat?',
  'Tiệc cưới Việt Nam thường có nhiều hải sản và rượu. Hướng dẫn giúp bạn chọn đúng món để tránh cơn gout bùng phát sau tiệc.',
  'Vietnamese wedding banquets are heavy on seafood and alcohol. This guide helps you pick safe dishes to avoid a gout flare after the party.',
  'celebration', 4, ARRAY['gout'],
  '{"pre_meal": "Uống 500ml nước, ăn nhẹ trước", "during": "Chọn gà, rau, tránh tôm và nội tạng", "post_meal": "Uống cherry concentrate pha loãng trước ngủ"}'::jsonb,
  NULL,
  ARRAY['Tôm hấp', 'Chả mực', 'Nội tạng', 'Bia rượu', 'Cháo lòng'],
  ARRAY['Steamed shrimp', 'Squid cake', 'Organ meats', 'Beer and liquor', 'Offal porridge'],
  ARRAY['Gà luộc', 'Rau xào thập cẩm', 'Canh rau củ', 'Chè đậu xanh', 'Nước lọc'],
  ARRAY['Boiled chicken', 'Mixed stir-fried vegetables', 'Vegetable soup', 'Mung bean dessert', 'Water'],
  4
),

-- 6. stress / back_pain + gout
(
  'Deadline dồn dập, lưng đau và stress',
  'Deadline crunch with back pain and stress',
  'Khi stress cao, cơ thể tăng tiết cortisol - làm tăng acid uric và căng cơ lưng. Hướng dẫn giúp bạn qua giai đoạn áp lực mà không bùng phát triệu chứng.',
  'High stress raises cortisol, which increases uric acid and tightens back muscles. This guide helps you survive crunch time without symptom flare-ups.',
  'stress', 3, ARRAY['back_pain', 'gout'],
  '{"pre_meal": "Chuẩn bị snack lành mạnh sẵn", "during": "Ăn đúng giờ, không bỏ bữa", "post_meal": "Nghỉ 10 phút sau ăn, đi bộ nhẹ"}'::jsonb,
  '{"every_30_min": "Duỗi vai và cổ", "every_60_min": "Đứng dậy đi lại 2 phút", "end_of_day": "Giãn cơ lưng 5 phút"}'::jsonb,
  ARRAY['Cà phê quá 3 ly', 'Mì gói', 'Đồ ăn nhanh', 'Nước ngọt'],
  ARRAY['More than 3 coffees', 'Instant noodles', 'Fast food', 'Soft drinks'],
  ARRAY['Trà xanh', 'Hạt óc chó', 'Chuối', 'Yến mạch', 'Nước ép cherry'],
  ARRAY['Green tea', 'Walnuts', 'Banana', 'Oatmeal', 'Cherry juice'],
  5
),

-- 7. travel / gout + cholesterol
(
  'Đi công tác 3 ngày - ăn uống ngoài',
  'Three-day business trip - eating out',
  'Khi đi công tác, bạn phải ăn ngoài liên tục. Lên kế hoạch ăn uống 3 ngày giúp kiểm soát purine và cholesterol hiệu quả.',
  'During business trips you eat out constantly. A 3-day eating plan helps you effectively manage purine and cholesterol intake.',
  'travel', 3, ARRAY['gout', 'cholesterol'],
  '{"day_1": "Chọn nhà hàng có salad bar", "day_2": "Mang theo hạt và trái cây", "day_3": "Ưu tiên phở gà, bún riêu cua đồng"}'::jsonb,
  NULL,
  ARRAY['Buffet hải sản', 'Lẩu nội tạng', 'Thịt nướng BBQ', 'Rượu bia tiếp khách'],
  ARRAY['Seafood buffet', 'Offal hotpot', 'BBQ meats', 'Client entertainment drinks'],
  ARRAY['Phở gà', 'Bún chả cá', 'Cơm gà xối mỡ (bỏ da)', 'Rau luộc các loại'],
  ARRAY['Chicken pho', 'Fish cake noodle soup', 'Chicken rice (skinless)', 'Boiled vegetables'],
  5
),

-- 8. meal_prep / gout
(
  'Meal prep Chủ nhật cho tuần mới (Gout)',
  'Sunday meal prep for the week (Gout)',
  'Chuẩn bị thức ăn cho cả tuần giúp bạn chủ động kiểm soát purine trong khẩu phần. Danh sách công thức và mẹo bảo quản.',
  'Preparing meals for the whole week helps you proactively control purine in your diet. Recipes and storage tips included.',
  'meal_prep', 1, ARRAY['gout'],
  '{"breakfast": "Yến mạch + chuối + hạt chia", "lunch": "Cơm gạo lứt + ức gà + rau", "dinner": "Canh rau củ + đậu hũ + cá basa", "snack": "Cherry, táo, sữa chua không đường"}'::jsonb,
  NULL,
  ARRAY['Nội tạng', 'Cá cơm', 'Cá mòi', 'Thịt đỏ nhiều', 'Nấm hương'],
  ARRAY['Organ meats', 'Anchovies', 'Sardines', 'Excess red meat', 'Shiitake mushrooms'],
  ARRAY['Ức gà', 'Cá basa', 'Đậu hũ', 'Trứng (2/ngày)', 'Rau xanh các loại', 'Cherry'],
  ARRAY['Chicken breast', 'Basa fish', 'Tofu', 'Eggs (2/day)', 'Green vegetables', 'Cherries'],
  6
),

-- 9. meal_prep / cholesterol
(
  'Meal prep Chủ nhật cho tuần mới (Cholesterol)',
  'Sunday meal prep for the week (Cholesterol)',
  'Kế hoạch nấu ăn cả tuần tập trung vào tăng HDL, giảm LDL. Công thức giàu omega-3 và chất xơ hòa tan.',
  'Weekly cooking plan focused on raising HDL and lowering LDL. Recipes rich in omega-3 and soluble fiber.',
  'meal_prep', 1, ARRAY['cholesterol'],
  '{"breakfast": "Yến mạch + hạt lanh + blueberry", "lunch": "Cá hồi nướng + quinoa + bông cải", "dinner": "Gà nướng bỏ da + khoai lang + rau xanh", "snack": "Hạt óc chó, bơ, táo"}'::jsonb,
  NULL,
  ARRAY['Mỡ lợn', 'Da gà', 'Lòng đỏ trứng quá 4/tuần', 'Đồ chiên', 'Bơ thực vật hydro hóa'],
  ARRAY['Lard', 'Chicken skin', 'Egg yolks over 4/week', 'Fried food', 'Hydrogenated margarine'],
  ARRAY['Cá hồi', 'Cá thu', 'Hạt óc chó', 'Bơ (avocado)', 'Yến mạch', 'Đậu lăng'],
  ARRAY['Salmon', 'Mackerel', 'Walnuts', 'Avocado', 'Oatmeal', 'Lentils'],
  6
),

-- 10. office / back_pain + cholesterol
(
  'Ngày làm việc 10 tiếng tại văn phòng',
  'Ten-hour office workday',
  'Ngồi liên tục 10 tiếng gây áp lực lớn lên cột sống và làm chậm chuyển hóa mỡ. Kế hoạch chi tiết từng giờ giúp bạn bảo vệ lưng và lipid máu.',
  'Sitting for 10 straight hours puts enormous pressure on your spine and slows fat metabolism. An hourly plan protects your back and blood lipids.',
  'office', 3, ARRAY['back_pain', 'cholesterol'],
  '{"morning_snack": "Hạt óc chó + trà xanh", "lunch": "Cơm gạo lứt + cá + rau", "afternoon_snack": "Táo + sữa chua"}'::jsonb,
  '{"every_30_min": "Xoay cổ và vai", "every_60_min": "Đứng dậy, cat-cow stretch 5 lần", "every_120_min": "Đi bộ 5 phút, cầu thang nếu có"}'::jsonb,
  ARRAY['Ngồi khom lưng', 'Bỏ bữa trưa', 'Uống nước ngọt', 'Ăn vặt chiên'],
  ARRAY['Slouching', 'Skipping lunch', 'Drinking soda', 'Fried snacks'],
  ARRAY['Ghế có tựa lưng tốt', 'Màn hình ngang tầm mắt', 'Bàn đứng nếu có', 'Nước lọc 2L/ngày'],
  ARRAY['Chair with good lumbar support', 'Monitor at eye level', 'Standing desk if available', 'Water 2L/day'],
  5
),

-- 11. dining_out / gout + cholesterol
(
  'Ăn lẩu với bạn bè',
  'Hotpot night with friends',
  'Lẩu là món ăn phổ biến nhưng nước dùng đậm đặc chứa rất nhiều purine và chất béo. Hướng dẫn chọn nguyên liệu và cách ăn lẩu thông minh.',
  'Hotpot is popular but the concentrated broth is loaded with purines and fat. Learn how to choose ingredients and eat hotpot smartly.',
  'dining_out', 5, ARRAY['gout', 'cholesterol'],
  '{"pre_meal": "Ăn salad nhỏ trước", "during": "Chọn nước lẩu rau, nhúng rau trước thịt", "post_meal": "Không uống nước lẩu, uống 500ml nước lọc"}'::jsonb,
  NULL,
  ARRAY['Nước lẩu xương hầm', 'Nội tạng', 'Tôm', 'Mực', 'Bò viên mỡ', 'Mì tôm'],
  ARRAY['Bone broth base', 'Organ meats', 'Shrimp', 'Squid', 'Fatty meatballs', 'Instant noodles'],
  ARRAY['Nước lẩu rau củ', 'Rau xanh', 'Nấm đông cô', 'Đậu hũ', 'Cá lát', 'Bún tươi'],
  ARRAY['Vegetable broth base', 'Green vegetables', 'Shiitake mushroom', 'Tofu', 'Fish slices', 'Fresh rice noodles'],
  5
),

-- 12. celebration / cholesterol
(
  'Tiệc sinh nhật - bánh kem và đồ ngọt',
  'Birthday party - cake and sweets',
  'Tiệc sinh nhật đầy bánh kem và đồ ngọt. Cách tham gia vui vẻ mà vẫn giữ cholesterol ổn định.',
  'Birthday parties are full of cake and sweets. How to have fun while keeping cholesterol stable.',
  'celebration', 3, ARRAY['cholesterol'],
  '{"pre_meal": "Ăn chính no trước khi đến", "during": "1 miếng bánh nhỏ, ưu tiên trái cây", "post_meal": "Đi bộ 20 phút sau tiệc"}'::jsonb,
  NULL,
  ARRAY['Bánh kem bơ nhiều lớp', 'Chocolate fondue', 'Kẹo ngọt', 'Nước ngọt có ga'],
  ARRAY['Multi-layer butter cake', 'Chocolate fondue', 'Candy', 'Carbonated soft drinks'],
  ARRAY['Trái cây tươi', 'Dark chocolate 70%+', 'Nước ép không đường', 'Bánh dựa trên hạt'],
  ARRAY['Fresh fruit', 'Dark chocolate 70%+', 'Unsweetened juice', 'Nut-based desserts'],
  3
),

-- 13. travel / back_pain
(
  'Bay 5 tiếng - bảo vệ lưng trên máy bay',
  'Five-hour flight - protecting your back',
  'Ngồi trên máy bay ghế hẹp suốt 5 tiếng sẽ gây tê mỏi lưng dưới. Hướng dẫn bài tập tại chỗ và cách chọn ghế tốt nhất.',
  'Sitting in a cramped airplane seat for 5 hours causes lower back stiffness and numbness. In-seat exercises and seat selection tips.',
  'travel', 3, ARRAY['back_pain'],
  NULL,
  '{"every_30_min": "Co duỗi chân, xoay mắt cá", "every_60_min": "Nghiêng người sang hai bên, xoay thân", "every_120_min": "Đứng dậy đi lại trong cabin"}'::jsonb,
  ARRAY[]::text[], ARRAY[]::text[],
  ARRAY['Gối tựa lưng', 'Ghế lối đi', 'Giày thoải mái', 'Nước uống đủ'],
  ARRAY['Lumbar pillow', 'Aisle seat', 'Comfortable shoes', 'Stay hydrated'],
  4
),

-- 14. stress / gout
(
  'Stress kéo dài - nguy cơ bùng phát gout',
  'Prolonged stress - gout flare risk',
  'Stress mãn tính làm tăng acid uric qua cơ chế cortisol. Chiến lược quản lý stress để phòng ngừa cơn gout.',
  'Chronic stress raises uric acid through cortisol pathways. Stress management strategies to prevent gout attacks.',
  'stress', 4, ARRAY['gout'],
  '{"hydration": "Uống 2.5L nước/ngày", "anti_inflammatory": "Bổ sung cherry, vitamin C, omega-3"}'::jsonb,
  NULL,
  ARRAY['Rượu bia', 'Cà phê quá nhiều', 'Đồ ăn nhanh', 'Thức khuya'],
  ARRAY['Alcohol', 'Excess coffee', 'Fast food', 'Staying up late'],
  ARRAY['Thiền 10 phút/ngày', 'Ngủ đủ 7-8 tiếng', 'Đi bộ nhẹ', 'Nước ép cherry'],
  ARRAY['Meditate 10 min/day', 'Sleep 7-8 hours', 'Light walking', 'Cherry juice'],
  5
),

-- 15. dining_out / gout
(
  'Ăn phở bò hay phở gà?',
  'Beef pho or chicken pho?',
  'Phở là món quốc hồn quốc túy, nhưng nước dùng xương hầm lâu chứa nhiều purine. So sánh chi tiết giúp bạn chọn đúng.',
  'Pho is Vietnam''s national dish, but long-simmered bone broth is high in purines. A detailed comparison helps you choose wisely.',
  'dining_out', 2, ARRAY['gout'],
  '{"recommendation": "Phở gà, nước dùng nhạt, thêm rau, bỏ da gà"}'::jsonb,
  NULL,
  ARRAY['Phở bò tái', 'Nước dùng đậm', 'Gầu bò', 'Tương ớt nhiều'],
  ARRAY['Rare beef pho', 'Rich broth', 'Beef brisket', 'Excess chili sauce'],
  ARRAY['Phở gà bỏ da', 'Nước dùng nhạt', 'Thêm giá và rau', 'Chanh tươi'],
  ARRAY['Skinless chicken pho', 'Light broth', 'Extra bean sprouts and herbs', 'Fresh lime'],
  3
),

-- 16. office / back_pain
(
  'Setup bàn làm việc chuẩn ergonomic',
  'Proper ergonomic desk setup',
  'Hướng dẫn chi tiết cách điều chỉnh bàn ghế, màn hình, bàn phím để giảm 60% áp lực lên cột sống khi làm việc.',
  'Detailed guide on adjusting desk, chair, monitor, and keyboard to reduce 60% of spinal pressure while working.',
  'office', 2, ARRAY['back_pain'],
  NULL,
  '{"setup_checklist": "Ghế cao ngang đầu gối, màn hình ngang tầm mắt, khuỷu tay 90 độ, chân chạm sàn"}'::jsonb,
  ARRAY[]::text[], ARRAY[]::text[],
  ARRAY['Ghế có tựa lưng cong', 'Bàn phím tách rời', 'Giá đỡ laptop', 'Kê chân nếu cần'],
  ARRAY['Chair with lumbar curve', 'Separate keyboard', 'Laptop stand', 'Footrest if needed'],
  4
),

-- 17. drinking / gout
(
  'Uống gì thay bia khi đi nhậu?',
  'What to drink instead of beer when socializing?',
  'Bia là kẻ thù số 1 của gout. Danh sách đồ uống thay thế giúp bạn vẫn hòa đồng mà an toàn cho acid uric.',
  'Beer is gout enemy number one. Alternative drinks that keep you social while protecting your uric acid levels.',
  'drinking', 3, ARRAY['gout'],
  '{"alternatives": "Kombucha, nước chanh soda, trà đá, nước dừa, mocktail"}'::jsonb,
  NULL,
  ARRAY['Bia các loại', 'Rượu mạnh', 'Cocktail đường cao', 'Nước ngọt có ga'],
  ARRAY['All types of beer', 'Hard liquor', 'High-sugar cocktails', 'Carbonated soft drinks'],
  ARRAY['Kombucha', 'Soda chanh tươi', 'Trà đá', 'Nước dừa tươi', 'Mocktail trái cây'],
  ARRAY['Kombucha', 'Fresh lime soda', 'Iced tea', 'Fresh coconut water', 'Fruit mocktail'],
  3
),

-- 18. meal_prep / back_pain
(
  'Thực phẩm chống viêm cho lưng đau',
  'Anti-inflammatory foods for back pain',
  'Chế độ ăn giàu chất chống viêm giúp giảm đau lưng mãn tính. Danh sách thực phẩm nên ăn mỗi ngày và công thức dễ nấu.',
  'An anti-inflammatory diet helps reduce chronic back pain. Daily food list and easy recipes.',
  'meal_prep', 1, ARRAY['back_pain'],
  '{"daily_must_haves": "Nghệ, gừng, omega-3, rau lá xanh đậm", "weekly": "Cá hồi 2 lần, bơ 3 lần, hạt óc chó mỗi ngày"}'::jsonb,
  NULL,
  ARRAY['Đường tinh luyện', 'Dầu thực vật omega-6', 'Thịt chế biến sẵn', 'Bột mì trắng'],
  ARRAY['Refined sugar', 'Omega-6 vegetable oils', 'Processed meats', 'White flour'],
  ARRAY['Cá hồi', 'Nghệ tươi', 'Gừng', 'Bơ (avocado)', 'Rau cải xoăn', 'Hạt óc chó'],
  ARRAY['Salmon', 'Fresh turmeric', 'Ginger', 'Avocado', 'Kale', 'Walnuts'],
  5
),

-- 19. celebration / gout + back_pain
(
  'Tết Nguyên Đán - 7 ngày sinh tồn',
  'Lunar New Year - 7-day survival guide',
  'Tết là thử thách lớn nhất: ăn nhiều, ngồi nhiều, uống nhiều. Kế hoạch 7 ngày giúp bạn vui Tết mà không bùng phát gout hay đau lưng.',
  'Tet is the ultimate challenge: overeating, oversitting, overdrinking. A 7-day plan to enjoy Tet without triggering gout or back pain.',
  'celebration', 5, ARRAY['gout', 'back_pain'],
  '{"tet_rules": "Mỗi bữa: 1 phần protein nạc, 2 phần rau, uống nước trước khi ăn, tránh rượu bia sau 8 giờ tối"}'::jsonb,
  '{"daily": "Đi bộ 30 phút buổi sáng, giãn cơ 10 phút buổi tối"}'::jsonb,
  ARRAY['Giò lụa nhiều', 'Nem rán', 'Rượu ngâm', 'Thịt đông', 'Ngồi đánh bài cả ngày'],
  ARRAY['Excess sausage', 'Fried spring rolls', 'Rice wine', 'Meat aspic', 'Sitting all day playing cards'],
  ARRAY['Bánh chưng vừa phải', 'Dưa hành', 'Canh khổ qua', 'Gà luộc', 'Đi bộ đầu năm'],
  ARRAY['Moderate banh chung', 'Pickled onions', 'Bitter melon soup', 'Boiled chicken', 'New Year walks'],
  7
),

-- 20. stress / cholesterol + back_pain
(
  'Burn-out và sức khỏe tim mạch',
  'Burnout and cardiovascular health',
  'Burn-out không chỉ ảnh hưởng tinh thần mà còn làm tăng LDL cholesterol và gây co cứng cơ lưng. Chiến lược phục hồi toàn diện.',
  'Burnout doesn''t just affect mental health - it raises LDL cholesterol and causes back muscle tension. A comprehensive recovery strategy.',
  'stress', 4, ARRAY['cholesterol', 'back_pain'],
  '{"recovery_diet": "Tăng omega-3, giảm caffeine, bổ sung magnesium, ăn đúng giờ"}'::jsonb,
  '{"daily": "Yoga nhẹ 15 phút, đi bộ 20 phút, giãn cơ trước ngủ"}'::jsonb,
  ARRAY['Cà phê sau 2pm', 'Đồ ăn nhanh', 'Thức khuya', 'Ngồi liên tục trên 2 tiếng'],
  ARRAY['Coffee after 2pm', 'Fast food', 'Staying up late', 'Sitting over 2 hours continuously'],
  ARRAY['Cá hồi/cá thu', 'Trà hoa cúc', 'Ngủ 8 tiếng', 'Yoga', 'Thiền'],
  ARRAY['Salmon/mackerel', 'Chamomile tea', 'Sleep 8 hours', 'Yoga', 'Meditation'],
  6
);


-- ============================================================
-- 7. SEED DATA - MICRO ACTIONS (24)
-- ============================================================

INSERT INTO public.micro_actions (
  title_vi, title_en, description_vi, description_en,
  category, condition_tags, context_tags,
  duration_seconds, reps
) VALUES

-- === morning_activation (3) ===
(
  'Kích hoạt buổi sáng toàn thân',
  'Full-body morning activation',
  'Chuỗi 5 động tác đánh thức cơ thể: vươn vai, xoay hông, gập gối, xoay cổ chân, hít thở sâu. Tăng tuần hoàn máu và giảm cứng khớp buổi sáng.',
  'A 5-move sequence to wake up your body: shoulder stretch, hip rotation, knee bends, ankle circles, deep breathing. Boosts circulation and reduces morning stiffness.',
  'morning_activation', ARRAY['gout', 'back_pain'], ARRAY['morning', 'at_home'],
  180, 5
),
(
  'Kéo giãn cột sống trên giường',
  'Bed spinal stretch',
  'Nằm ngửa, kéo hai đầu gối về ngực, giữ 15 giây, thả ra. Lặp lại. Giải phóng áp lực đĩa đệm tích tụ qua đêm.',
  'Lie on your back, pull both knees to your chest, hold 15 seconds, release. Repeat. Releases disc pressure accumulated overnight.',
  'morning_activation', ARRAY['back_pain'], ARRAY['morning', 'at_home', 'bed'],
  120, 8
),
(
  'Khởi động khớp buổi sáng cho gout',
  'Morning joint warm-up for gout',
  'Xoay nhẹ các khớp: cổ tay, khuỷu tay, vai, mắt cá chân. Giúp lưu thông dịch khớp, giảm nguy cơ kết tinh urat buổi sáng.',
  'Gently rotate joints: wrists, elbows, shoulders, ankles. Promotes synovial fluid circulation, reducing morning urate crystal risk.',
  'morning_activation', ARRAY['gout'], ARRAY['morning', 'at_home'],
  150, 10
),

-- === gentle_stretch (3) ===
(
  'Giãn cơ hamstring nhẹ nhàng',
  'Gentle hamstring stretch',
  'Ngồi trên ghế, duỗi thẳng một chân, gập người về trước từ hông. Giữ 20 giây mỗi bên. Giảm căng cơ đùi sau - nguyên nhân phổ biến của đau lưng dưới.',
  'Sit on a chair, extend one leg straight, fold forward from hips. Hold 20 seconds per side. Relieves tight hamstrings - a common cause of lower back pain.',
  'gentle_stretch', ARRAY['back_pain'], ARRAY['office', 'at_home'],
  120, 4
),
(
  'Giãn cơ hông và đùi',
  'Hip flexor and quad stretch',
  'Đứng, kéo một chân về phía mông, giữ 20 giây. Đổi bên. Mở rộng cơ hông bị co rút do ngồi lâu.',
  'Stand, pull one foot toward your buttock, hold 20 seconds. Switch. Opens hip flexors shortened by prolonged sitting.',
  'gentle_stretch', ARRAY['back_pain'], ARRAY['office', 'at_home', 'break'],
  90, 4
),
(
  'Giãn cơ cổ và vai 360 độ',
  'Full neck and shoulder stretch',
  'Nghiêng đầu sang phải, giữ 15 giây. Sang trái. Cúi trước. Ngả sau. Xoay vai 10 vòng. Giải phóng căng thẳng vùng cổ vai gáy.',
  'Tilt head right, hold 15 seconds. Left. Forward. Back. Roll shoulders 10 circles. Releases tension in the neck-shoulder area.',
  'gentle_stretch', ARRAY['back_pain'], ARRAY['office', 'at_home', 'break'],
  90, 6
),

-- === spinal_mobility (3) ===
(
  'Cat-Cow trên ghế văn phòng',
  'Seated cat-cow on office chair',
  'Ngồi thẳng, hít vào ưỡn ngực (cow), thở ra cong lưng (cat). Lặp lại 10 lần. Tăng độ linh hoạt cột sống và giảm cứng lưng giữa ngày.',
  'Sit tall, inhale and arch back (cow), exhale and round spine (cat). Repeat 10 times. Increases spinal mobility and reduces midday stiffness.',
  'spinal_mobility', ARRAY['back_pain'], ARRAY['office', 'desk'],
  90, 10
),
(
  'Xoay cột sống ngồi',
  'Seated spinal twist',
  'Ngồi thẳng, đặt tay phải lên đầu gối trái, xoay thân sang trái. Giữ 15 giây. Đổi bên. Giải phóng căng thẳng cột sống ngực.',
  'Sit tall, place right hand on left knee, twist torso left. Hold 15 seconds. Switch. Releases thoracic spine tension.',
  'spinal_mobility', ARRAY['back_pain'], ARRAY['office', 'at_home'],
  90, 6
),
(
  'Child''s pose phục hồi lưng',
  'Restorative child''s pose',
  'Quỳ gối, ngồi lên gót chân, gập người về trước, tay duỗi thẳng phía trước. Giữ 30 giây. Kéo giãn toàn bộ chuỗi cơ lưng.',
  'Kneel, sit on heels, fold forward, arms extended ahead. Hold 30 seconds. Stretches the entire posterior chain.',
  'spinal_mobility', ARRAY['back_pain'], ARRAY['at_home', 'evening'],
  120, 3
),

-- === desk_reset (3) ===
(
  'Reset tư thế 2 phút',
  'Two-minute posture reset',
  'Đứng dậy, tay chống hông, nghiêng về phía sau 5 lần. Xoay vai 10 vòng. Đi bộ tại chỗ 30 giây. Reset hoàn toàn sau 1 giờ ngồi.',
  'Stand, hands on hips, lean back 5 times. Roll shoulders 10 circles. March in place 30 seconds. Complete reset after 1 hour of sitting.',
  'desk_reset', ARRAY['back_pain'], ARRAY['office', 'desk', 'break'],
  120, 5
),
(
  'Bài tập tay và cổ tay tại bàn',
  'Desk hand and wrist exercise',
  'Nắm chặt tay 5 giây, xòe ra. Xoay cổ tay 10 vòng. Kéo giãn ngón tay. Phòng ngừa hội chứng ống cổ tay.',
  'Clench fists for 5 seconds, spread fingers. Rotate wrists 10 circles. Stretch fingers. Prevents carpal tunnel syndrome.',
  'desk_reset', ARRAY['back_pain'], ARRAY['office', 'desk'],
  60, 10
),
(
  'Nâng chân dưới bàn làm việc',
  'Under-desk leg raises',
  'Ngồi thẳng, nâng một chân song song sàn, giữ 10 giây, hạ xuống. Đổi bên. Kích hoạt cơ lõi và cải thiện tuần hoàn chân.',
  'Sit tall, raise one leg parallel to the floor, hold 10 seconds, lower. Switch. Activates core muscles and improves leg circulation.',
  'desk_reset', ARRAY['back_pain', 'cholesterol'], ARRAY['office', 'desk'],
  90, 8
),

-- === energy_boost (3) ===
(
  'Đi bộ nhanh 5 phút',
  'Five-minute brisk walk',
  'Đi bộ nhanh quanh văn phòng hoặc cầu thang. Tăng nhịp tim nhẹ, đốt cháy triglycerides, và giảm buồn ngủ sau ăn trưa.',
  'Brisk walk around the office or take the stairs. Lightly elevates heart rate, burns triglycerides, and reduces post-lunch drowsiness.',
  'energy_boost', ARRAY['cholesterol', 'back_pain'], ARRAY['office', 'afternoon', 'break'],
  300, NULL
),
(
  'Squat nhẹ 10 lần',
  'Light squats 10 reps',
  'Đứng rộng bằng vai, ngồi xuống như ngồi ghế, đứng lên. 10 lần. Kích hoạt nhóm cơ lớn nhất cơ thể, tăng chuyển hóa và lưu thông máu.',
  'Stand shoulder-width, sit back as if on a chair, stand up. 10 reps. Activates the body''s largest muscle group, boosting metabolism and circulation.',
  'energy_boost', ARRAY['cholesterol', 'back_pain'], ARRAY['office', 'at_home', 'break'],
  90, 10
),
(
  'Nhảy tại chỗ nhẹ nhàng',
  'Gentle jumping jacks',
  'Nhảy tại chỗ, tay vung lên đầu, chân mở rộng. Phiên bản nhẹ: bước sang phải-trái thay vì nhảy. 30 giây nghỉ 10 giây, lặp 3 lần.',
  'Jump in place, arms overhead, legs apart. Gentle version: step side-to-side instead of jumping. 30 sec on, 10 sec rest, repeat 3 times.',
  'energy_boost', ARRAY['cholesterol'], ARRAY['at_home', 'morning', 'break'],
  120, 3
),

-- === breathing (3) ===
(
  'Hít thở 4-7-8 giảm stress',
  'Four-seven-eight stress-reducing breath',
  'Hít vào 4 giây, giữ 7 giây, thở ra 8 giây. 4 chu kỳ. Kích hoạt hệ thần kinh phó giao cảm, giảm cortisol - yếu tố tăng acid uric.',
  'Inhale 4 seconds, hold 7 seconds, exhale 8 seconds. 4 cycles. Activates parasympathetic nervous system, reduces cortisol - a uric acid trigger.',
  'breathing', ARRAY['gout', 'back_pain'], ARRAY['office', 'at_home', 'evening', 'stress'],
  120, 4
),
(
  'Thở bụng sâu 3 phút',
  'Three-minute deep belly breathing',
  'Đặt tay lên bụng, hít sâu bằng mũi cho bụng phồng, thở ra chậm bằng miệng. Giảm căng cơ lưng và hạ huyết áp nhẹ.',
  'Place hand on belly, inhale deeply through nose expanding belly, exhale slowly through mouth. Reduces back muscle tension and mildly lowers blood pressure.',
  'breathing', ARRAY['back_pain', 'cholesterol'], ARRAY['office', 'at_home', 'morning', 'evening'],
  180, 10
),
(
  'Box breathing trước khi ngủ',
  'Bedtime box breathing',
  'Hít 4 giây, giữ 4 giây, thở ra 4 giây, giữ 4 giây. 6 chu kỳ. Chuẩn bị cơ thể cho giấc ngủ sâu - yếu tố quan trọng phục hồi khớp và cơ.',
  'Inhale 4 sec, hold 4 sec, exhale 4 sec, hold 4 sec. 6 cycles. Prepares body for deep sleep - crucial for joint and muscle recovery.',
  'breathing', ARRAY['gout', 'back_pain'], ARRAY['evening', 'at_home', 'bed'],
  120, 6
),

-- === hydration_recovery (3) ===
(
  'Nhắc uống nước mỗi giờ',
  'Hourly hydration reminder routine',
  'Đặt nhắc uống 250ml nước mỗi giờ. Mục tiêu 2-2.5L/ngày. Nước giúp thận đào thải acid uric hiệu quả và giảm kết tinh urat.',
  'Set a reminder to drink 250ml water every hour. Target 2-2.5L/day. Water helps kidneys flush uric acid effectively and reduces urate crystallization.',
  'hydration_recovery', ARRAY['gout'], ARRAY['office', 'at_home', 'all_day'],
  30, NULL
),
(
  'Nước chanh ấm buổi sáng',
  'Morning warm lemon water',
  'Pha 1/2 quả chanh với 300ml nước ấm. Uống khi bụng đói. Vitamin C giúp giảm acid uric, nước ấm kích thích tiêu hóa.',
  'Squeeze half a lemon into 300ml warm water. Drink on empty stomach. Vitamin C helps reduce uric acid, warm water stimulates digestion.',
  'hydration_recovery', ARRAY['gout', 'cholesterol'], ARRAY['morning', 'at_home'],
  60, NULL
),
(
  'Protocol phục hồi sau nhậu',
  'Post-drinking recovery protocol',
  'Uống 500ml nước ngay sau nhậu. Trước ngủ: 500ml nước + 1000mg vitamin C. Sáng hôm sau: nước chanh ấm + bữa sáng nhẹ giàu kali.',
  'Drink 500ml water right after drinking. Before bed: 500ml water + 1000mg vitamin C. Next morning: warm lemon water + light potassium-rich breakfast.',
  'hydration_recovery', ARRAY['gout'], ARRAY['evening', 'at_home', 'post_event'],
  60, NULL
),

-- === metabolic_support (3) ===
(
  'Đi bộ 10 phút sau ăn tối',
  'Ten-minute post-dinner walk',
  'Đi bộ nhẹ 10 phút sau ăn tối giúp giảm đường huyết sau ăn 30%, hỗ trợ chuyển hóa lipid, và giảm nguy cơ tăng acid uric ban đêm.',
  'A light 10-minute walk after dinner reduces post-meal blood sugar by 30%, supports lipid metabolism, and reduces nighttime uric acid spikes.',
  'metabolic_support', ARRAY['gout', 'cholesterol'], ARRAY['evening', 'post_meal'],
  600, NULL
),
(
  'Bài tập kháng lực nhẹ với chai nước',
  'Light resistance exercise with water bottle',
  'Dùng chai nước 500ml làm tạ. Nâng tay ngang vai 15 lần, cuốn tay 15 lần, đẩy tay lên trần 15 lần. Tăng cơ nạc, cải thiện chuyển hóa mỡ.',
  'Use a 500ml water bottle as a weight. Lateral raises 15 reps, bicep curls 15 reps, overhead press 15 reps. Builds lean muscle, improves fat metabolism.',
  'metabolic_support', ARRAY['cholesterol'], ARRAY['office', 'at_home', 'break'],
  180, 15
),
(
  'Nghệ + tiêu đen sau bữa ăn',
  'Turmeric and black pepper after meals',
  'Pha 1/2 thìa bột nghệ + 1 nhúm tiêu đen + nước ấm. Curcumin chống viêm mạnh, piperine tăng hấp thu 2000%. Hỗ trợ giảm viêm khớp và mỡ máu.',
  'Mix 1/2 tsp turmeric powder + a pinch of black pepper + warm water. Curcumin is a powerful anti-inflammatory, piperine increases absorption 2000%. Supports joint and lipid health.',
  'metabolic_support', ARRAY['gout', 'cholesterol', 'back_pain'], ARRAY['post_meal', 'at_home'],
  60, NULL
);


-- ============================================================
-- 8. COMPLETE
-- ============================================================
-- Migration complete. All 14 tables created with:
--   - UUID primary keys
--   - Row Level Security enabled on all tables
--   - RLS policies for user-owned data isolation
--   - Scenarios and micro_actions readable by all authenticated users
--   - updated_at triggers on profiles and scenarios
--   - Audit column triggers on checkins, scenario_sessions, action_sessions
--   - Auto-create profile trigger on auth.users insert
--   - Performance indexes on key lookup patterns
--   - 20 seed scenarios covering gout, cholesterol, and back pain
--   - 24 seed micro actions across 8 categories
