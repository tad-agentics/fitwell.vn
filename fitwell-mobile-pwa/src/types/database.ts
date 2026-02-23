// Supabase Database type definitions
// Generated from the schema for type-safe queries

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          language: 'vi' | 'en';
          primary_conditions: string[];
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
        };
        Insert: {
          id: string;
          email: string;
          language?: 'vi' | 'en';
          primary_conditions?: string[];
          onboarding_complete?: boolean;
          desk_hours?: number | null;
          eating_out_freq?: string | null;
          back_pain_freq?: string | null;
          highest_risk_env?: string | null;
          account_usage?: string | null;
          notification_morning?: boolean;
          notification_midday?: boolean;
          notification_pre_sleep?: boolean;
          notification_brief?: boolean;
          morning_time?: string;
          pre_sleep_time?: string;
          free_scenario_uses?: number;
          free_post_event_checkins_used?: number;
          free_brief_reads?: number;
          brief_weeks_completed?: number;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      households: {
        Row: {
          id: string;
          owner_id: string;
          partner_id: string | null;
          invite_token: string | null;
          invite_expires_at: string | null;
          created_at: string;
        };
        Insert: {
          owner_id: string;
          partner_id?: string | null;
          invite_token?: string | null;
          invite_expires_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['households']['Insert']>;
      };
      biomarkers: {
        Row: {
          id: string;
          user_id: string;
          marker_type: string;
          value: number;
          unit: string;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          marker_type: string;
          value: number;
          unit: string;
          recorded_at?: string;
        };
        Update: Partial<Database['public']['Tables']['biomarkers']['Insert']>;
      };
      scenarios: {
        Row: {
          id: string;
          title_vi: string;
          title_en: string;
          description_vi: string;
          description_en: string;
          category: string;
          risk_level: number;
          condition_tags: string[];
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
        };
        Insert: {
          title_vi: string;
          title_en: string;
          description_vi: string;
          description_en: string;
          category: string;
          risk_level: number;
          condition_tags?: string[];
          meal_strategy?: Record<string, unknown> | null;
          desk_breaks?: Record<string, unknown> | null;
          avoid_items_vi?: string[];
          avoid_items_en?: string[];
          safe_items_vi?: string[];
          safe_items_en?: string[];
          image_url?: string | null;
          read_time_minutes?: number;
        };
        Update: Partial<Database['public']['Tables']['scenarios']['Insert']>;
      };
      scenario_sessions: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string;
          completed_at: string;
          day_of_week: number;
          hour_of_day: number;
        };
        Insert: {
          user_id: string;
          scenario_id: string;
          completed_at?: string;
        };
        Update: Partial<Database['public']['Tables']['scenario_sessions']['Insert']>;
      };
      checkins: {
        Row: {
          id: string;
          user_id: string;
          trigger: string;
          sleep_quality: string | null;
          body_feeling: string | null;
          back_pain_score: number | null;
          event_type: string | null;
          event_intensity: string | null;
          afternoon_state: string | null;
          day_of_week: number;
          hour_of_day: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          trigger: string;
          sleep_quality?: string | null;
          body_feeling?: string | null;
          back_pain_score?: number | null;
          event_type?: string | null;
          event_intensity?: string | null;
          afternoon_state?: string | null;
        };
        Update: Partial<Database['public']['Tables']['checkins']['Insert']>;
      };
      micro_actions: {
        Row: {
          id: string;
          title_vi: string;
          title_en: string;
          description_vi: string;
          description_en: string;
          category: string;
          condition_tags: string[];
          context_tags: string[];
          duration_seconds: number;
          reps: number | null;
          video_url: string | null;
          video_url_webm: string | null;
          video_thumb_url: string | null;
          created_at: string;
        };
        Insert: {
          title_vi: string;
          title_en: string;
          description_vi: string;
          description_en: string;
          category: string;
          condition_tags?: string[];
          context_tags?: string[];
          duration_seconds: number;
          reps?: number | null;
          video_url?: string | null;
          video_url_webm?: string | null;
          video_thumb_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['micro_actions']['Insert']>;
      };
      action_sessions: {
        Row: {
          id: string;
          user_id: string;
          action_id: string;
          checkin_id: string | null;
          completed_at: string;
          duration_seconds: number;
          day_of_week: number;
          hour_of_day: number;
        };
        Insert: {
          user_id: string;
          action_id: string;
          checkin_id?: string | null;
          duration_seconds: number;
        };
        Update: Partial<Database['public']['Tables']['action_sessions']['Insert']>;
      };
      recovery_protocols: {
        Row: {
          id: string;
          user_id: string;
          checkin_id: string;
          event_type: string;
          intensity: string;
          total_days: number;
          current_day: number;
          status: string;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          checkin_id: string;
          event_type: string;
          intensity: string;
          total_days: number;
          current_day?: number;
          status?: string;
        };
        Update: Partial<Database['public']['Tables']['recovery_protocols']['Insert']>;
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
        };
        Update: Partial<Database['public']['Tables']['push_subscriptions']['Insert']>;
      };
      notification_governor: {
        Row: {
          id: string;
          user_id: string;
          daily_count: number;
          consecutive_ignored: number;
          mode: string;
          last_reset_at: string;
        };
        Insert: {
          user_id: string;
          daily_count?: number;
          consecutive_ignored?: number;
          mode?: string;
        };
        Update: Partial<Database['public']['Tables']['notification_governor']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          status: string;
          payos_order_id: string | null;
          amount: number;
          currency: string;
          started_at: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          plan: string;
          status?: string;
          payos_order_id?: string | null;
          amount: number;
          currency?: string;
          started_at?: string;
          expires_at: string;
        };
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      weekly_briefs: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          insight_tier: number;
          headline_vi: string;
          headline_en: string;
          content: Record<string, unknown>;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          week_start: string;
          insight_tier: number;
          headline_vi: string;
          headline_en: string;
          content: Record<string, unknown>;
          is_read?: boolean;
        };
        Update: Partial<Database['public']['Tables']['weekly_briefs']['Insert']>;
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string;
          event_name: string;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          event_name: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: Partial<Database['public']['Tables']['analytics_events']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
