// ============================================
// Domain Types
// ============================================

export type ConditionType = 'gout' | 'cholesterol' | 'back_pain' | 'unsure';

export type CheckinTrigger = 'morning' | 'post_event' | 'midday' | 'pre_sleep';

export type AfternoonState = 'clear' | 'sluggish' | 'stressed' | 'back_tight';

export type BodyFeeling = 'fresh' | 'stiff' | 'heavy' | 'sore';

export type SleepQuality = 'good' | 'fair' | 'poor' | 'terrible';

export type EventType = 'heavy_night' | 'rich_meal' | 'long_desk' | 'stress_day' | 'travel' | 'celebration';

export type EventIntensity = 'light' | 'medium' | 'heavy';

export type ContextTag = 'office' | 'private' | 'transit';

export type ActionCategory =
  | 'morning_activation'
  | 'gentle_stretch'
  | 'spinal_mobility'
  | 'desk_reset'
  | 'energy_boost'
  | 'breathing'
  | 'hydration_recovery'
  | 'metabolic_support';

export type SubscriptionStatus = 'free' | 'active' | 'expired' | 'cancelled';

export type SubscriptionPlan = 'individual_monthly' | 'individual_quarterly' | 'household_annual';

export type RecoveryProtocolStatus = 'active' | 'completed' | 'skipped';

export type RecoveryVariant = 'post_event' | 'spinal' | 'cortisol' | 'metabolic';

export type NotificationChannel = 'morning' | 'midday' | 'pre_sleep' | 'pre_game' | 'recovery' | 'brief';

export type BriefInsightTier = 1 | 2 | 3 | 4;

export type Language = 'vi' | 'en';

export type HomeState =
  | 'sunday_brief'
  | 'monday_intercept'
  | 'active_recovery'
  | 'pre_situation'
  | 'pre_sleep'
  | 'midday_desk'
  | 'clean_day';

// ============================================
// Model interfaces (matching DB schema)
// ============================================

export interface Profile {
  id: string;
  email: string;
  language: Language;
  primary_conditions: ConditionType[];
  onboarding_complete: boolean;
  desk_hours: number | null;
  eating_out_freq: string | null;
  back_pain_freq: string | null;
  highest_risk_env: string | null;
  account_usage: string | null;
  notification_morning: boolean;
  notification_midday: boolean;
  notification_pre_sleep: boolean;
  notification_brief: boolean;
  morning_time: string;
  pre_sleep_time: string;
  free_scenario_uses: number;
  free_post_event_checkins_used: number;
  free_brief_reads: number;
  brief_weeks_completed: number;
  created_at: string;
  updated_at: string;
}

export interface Household {
  id: string;
  owner_id: string;
  partner_id: string | null;
  invite_token: string | null;
  invite_expires_at: string | null;
  created_at: string;
}

export interface Biomarker {
  id: string;
  user_id: string;
  marker_type: string;
  value: number;
  unit: string;
  recorded_at: string;
  created_at: string;
}

export interface Scenario {
  id: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  category: string;
  risk_level: number;
  condition_tags: ConditionType[];
  meal_strategy: Record<string, unknown> | null;
  desk_breaks: Record<string, unknown> | null;
  avoid_items_vi: string[];
  avoid_items_en: string[];
  safe_items_vi: string[];
  safe_items_en: string[];
  image_url: string | null;
  read_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface ScenarioSession {
  id: string;
  user_id: string;
  scenario_id: string;
  completed_at: string;
  day_of_week: number;
  hour_of_day: number;
}

export interface Checkin {
  id: string;
  user_id: string;
  trigger: CheckinTrigger;
  sleep_quality: SleepQuality | null;
  body_feeling: BodyFeeling | null;
  back_pain_score: number | null;
  event_type: EventType | null;
  event_intensity: EventIntensity | null;
  afternoon_state: AfternoonState | null;
  day_of_week: number;
  hour_of_day: number;
  created_at: string;
}

export interface MicroAction {
  id: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  category: ActionCategory;
  condition_tags: ConditionType[];
  context_tags: ContextTag[];
  duration_seconds: number;
  reps: number | null;
  video_url: string | null;
  video_url_webm: string | null;
  video_thumb_url: string | null;
  created_at: string;
}

export interface ActionSession {
  id: string;
  user_id: string;
  action_id: string;
  checkin_id: string | null;
  completed_at: string;
  duration_seconds: number;
  day_of_week: number;
  hour_of_day: number;
}

export interface RecoveryProtocol {
  id: string;
  user_id: string;
  checkin_id: string;
  event_type: EventType;
  intensity: EventIntensity;
  total_days: number;
  current_day: number;
  status: RecoveryProtocolStatus;
  started_at: string;
  completed_at: string | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  payos_order_id: string | null;
  amount: number;
  currency: string;
  started_at: string;
  expires_at: string;
  created_at: string;
}

export interface WeeklyBrief {
  id: string;
  user_id: string;
  week_start: string;
  insight_tier: BriefInsightTier;
  headline_vi: string;
  headline_en: string;
  content: BriefContent;
  is_read: boolean;
  created_at: string;
}

export interface BriefContent {
  risk_calendar: RiskCalendarDay[];
  patterns: BriefPattern[];
  comparison: BriefComparison | null;
  ctas: BriefCTA[];
}

export interface RiskCalendarDay {
  date: string;
  risk_level: 'low' | 'medium' | 'high';
  events: string[];
  explanation_vi?: string;
  explanation_en?: string;
}

export interface BriefPattern {
  type: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  metric?: number;
}

export interface BriefComparison {
  metric: string;
  current_week: number;
  previous_week: number;
  trend: 'up' | 'down' | 'stable';
}

export interface BriefCTA {
  action: string;
  label_vi: string;
  label_en: string;
  route: string;
}

export interface PushSubscriptionRecord {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export interface NotificationGovernor {
  id: string;
  user_id: string;
  daily_count: number;
  consecutive_ignored: number;
  mode: 'normal' | 'reduced' | 'weekly_only';
  last_reset_at: string;
}

// ============================================
// Locale-aware content helper
// ============================================

export function getLocaleContent<T extends Record<string, unknown>>(
  row: T,
  field: string,
  locale: Language
): string {
  const key = `${field}_${locale}` as keyof T;
  return (row[key] as string) ?? (row[`${field}_vi` as keyof T] as string) ?? '';
}
