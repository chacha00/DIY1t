/**
 * Hand-written types mirroring supabase/migrations/0001_init.sql.
 * Once the project is linked to Supabase, regenerate with:
 *   supabase gen types typescript --linked > src/types/database.ts
 */

export type SubscriptionPlan = "free" | "monthly_unlimited" | "annual_unlimited";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing" | "incomplete";
export type PaymentStatus = "succeeded" | "pending" | "failed" | "refunded";
export type PaymentKind = "subscription" | "credit_pack" | "marketplace" | "gift";
export type CreditReason =
  | "signup_bonus"
  | "purchase"
  | "subscription_grant"
  | "project_generation"
  | "refund"
  | "admin_adjustment"
  | "referral_bonus"
  | "gift";
export type ProjectStatus = "processing" | "complete" | "failed" | "archived";
export type DifficultyLevel = "beginner" | "easy" | "medium" | "advanced" | "expert";
export type PetSpecies = "dog" | "cat" | "horse" | "small_animal" | "bird" | "other";
export type AppRole = "user" | "admin" | "moderator";

export interface MaterialLineItem {
  name: string;
  quantity: string;
  unit?: string;
  cost_cents: number;
  alt_options?: { label: string; cost_cents: number }[];
}

export interface ToolItem {
  name: string;
  required: boolean;
}

export interface ProjectStep {
  order: number;
  title: string;
  description: string;
  image_url?: string;
}

export interface PatternPieceNotch {
  edge: "top" | "right" | "bottom" | "left";
  position_pct: number; // 0–100 percent along that edge
}

export interface PatternPiece {
  name: string;
  width_in: number;
  height_in: number;
  quantity: number;
  notes?: string;
  shape?: "rectangle" | "square" | "circle" | "triangle" | "trapezoid" | "curved" | "custom";
  seam_allowance_in?: number;
  grain_direction?: string;
  fold_edge?: "none" | "top" | "left" | "bottom" | "right";
  notches?: PatternPieceNotch[];
  cut_instruction?: string; // e.g. "Cut 2 on fold", "Cut 1", "Cut 4"
  shape_description?: string; // extra curve/shape detail
}

export interface PatternAbbreviation {
  term: string;
  definition: string;
}

export interface FabricRequirement {
  component: string;
  yards: string; // e.g. "¼ yd" or a per-size range
  notes?: string;
}

export interface ProjectMeasurement {
  label: string;
  value: string;
  category?: "fitting" | "finished" | "pattern" | "hardware" | "seam" | "adjustment";
}

export interface DiyScore {
  difficulty: number; // 1-10
  estimated_time_minutes: number;
  estimated_cost_cents: number;
  safety_rating: number; // 1-10
  skill_level_required: DifficultyLevel;
  tool_complexity: number; // 1-10
  overall_score: number; // 1-100
  success_probability_beginner: number; // 0-1
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  is_suspended: boolean;
  bio: string | null;
  username: string | null;
  stripe_customer_id: string | null;
  credits_balance: number;
  total_projects: number;
  total_money_saved_cents: number;
  diy_streak_days: number;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Public-safe slice of profiles, served via the public_profiles view. */
export interface PublicProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
}

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  weight_lbs: number | null;
  age_years: number | null;
  gender: string | null;
  neck_measurement_in: number | null;
  chest_measurement_in: number | null;
  back_length_in: number | null;
  leg_length_in: number | null;
  special_needs: string | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SavedImage {
  id: string;
  user_id: string;
  cloudinary_public_id: string;
  url: string;
  kind: "upload" | "ai_preview" | "community_photo";
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  pet_id: string | null;
  category_id: string | null;
  parent_project_id: string | null;
  title: string;
  build_type: string | null;
  status: ProjectStatus;
  difficulty: DifficultyLevel;
  source_image_id: string | null;
  preview_image_id: string | null;
  budget_cents: number | null;
  skill_level: string | null;
  preferred_materials: string | null;
  time_available: string | null;
  estimated_cost_cents: number | null;
  estimated_time_minutes: number | null;
  retail_price_cents: number | null;
  money_saved_cents: number | null;
  materials: MaterialLineItem[];
  tools: ToolItem[];
  steps: ProjectStep[];
  safety_warnings: string[];
  pattern_pieces: PatternPiece[];
  measurements: ProjectMeasurement[];
  diy_score: Partial<DiyScore>;
  is_favorite: boolean;
  is_archived: boolean;
  is_public: boolean;
  tags: string[];
  ai_model: string | null;
  ai_generation_meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface GeneratedPdf {
  id: string;
  project_id: string;
  user_id: string;
  url: string;
  cloudinary_public_id: string | null;
  kind: "instructions" | "shopping_list" | "pattern" | "measurement_guide";
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  kind: PaymentKind;
  status: PaymentStatus;
  amount_cents: number;
  currency: string;
  credits_granted: number;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: CreditReason;
  related_project_id: string | null;
  related_payment_id: string | null;
  created_at: string;
}

// Minimal Supabase Database generic — extend per-table as query needs grow.
type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<Profile>;
      pets: Table<Pet>;
      categories: Table<Category>;
      saved_images: Table<SavedImage>;
      projects: Table<Project>;
      generated_pdfs: Table<GeneratedPdf>;
      subscriptions: Table<Subscription>;
      payments: Table<Payment>;
      credit_transactions: Table<CreditTransaction>;
      public_profiles: Table<PublicProfile>;
      email_leads: Table<{ id: string; email: string; source: string; created_at: string }>;
    };
    Views: Record<string, never>;
    Functions: {
      increment_profile_stats: {
        Args: { p_user_id: string; p_money_saved_cents: number };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
