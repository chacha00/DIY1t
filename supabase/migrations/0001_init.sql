-- =========================================================================
-- DIY1T.com — Initial schema
-- Run via: supabase db push  (or paste into the Supabase SQL editor)
-- =========================================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- ENUMS
-- -------------------------------------------------------------------------
create type subscription_plan as enum ('free', 'monthly_unlimited', 'annual_unlimited');
create type subscription_status as enum ('active', 'past_due', 'canceled', 'trialing', 'incomplete');
create type payment_status as enum ('succeeded', 'pending', 'failed', 'refunded');
create type payment_kind as enum ('subscription', 'credit_pack', 'marketplace', 'gift');
create type credit_reason as enum ('signup_bonus', 'purchase', 'subscription_grant', 'project_generation', 'refund', 'admin_adjustment', 'referral_bonus', 'gift');
create type project_status as enum ('processing', 'complete', 'failed', 'archived');
create type difficulty_level as enum ('beginner', 'easy', 'medium', 'advanced', 'expert');
create type pet_species as enum ('dog', 'cat', 'horse', 'small_animal', 'bird', 'other');
create type app_role as enum ('user', 'admin', 'moderator');

-- -------------------------------------------------------------------------
-- PROFILES (extends auth.users)
-- -------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role app_role not null default 'user',
  is_suspended boolean not null default false,
  bio text,
  username text unique,
  -- denormalized rollups, kept in sync by triggers/jobs
  credits_balance integer not null default 3,
  total_projects integer not null default 0,
  total_money_saved_cents integer not null default 0,
  diy_streak_days integer not null default 0,
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_username_idx on public.profiles (username);

-- -------------------------------------------------------------------------
-- PETS
-- -------------------------------------------------------------------------
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  species pet_species not null default 'dog',
  breed text,
  weight_lbs numeric(6, 2),
  age_years numeric(4, 1),
  gender text,
  neck_measurement_in numeric(5, 2),
  chest_measurement_in numeric(5, 2),
  back_length_in numeric(5, 2),
  leg_length_in numeric(5, 2),
  special_needs text,
  notes text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pets_user_id_idx on public.pets (user_id);

-- -------------------------------------------------------------------------
-- CATEGORIES
-- -------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  emoji text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.categories (slug, name, emoji, sort_order) values
  ('pet-apparel', 'Pet Apparel', '🐶', 1),
  ('pet-toys', 'Pet Toys', '🦴', 2),
  ('home-decor', 'Home Decor', '🏠', 3),
  ('furniture', 'Furniture', '🪑', 4),
  ('clothing', 'Clothing', '👕', 5),
  ('kids-crafts', 'Kids Crafts', '🧸', 6),
  ('holiday-projects', 'Holiday Projects', '🎄', 7),
  ('crafts', 'Crafts', '🎨', 8),
  ('sewing', 'Sewing', '🧵', 9),
  ('woodworking', 'Woodworking', '🪚', 10),
  ('cat-accessories', 'Cat Accessories', '🐱', 11),
  ('horse-accessories', 'Horse Accessories', '🐴', 12);

-- -------------------------------------------------------------------------
-- SAVED IMAGES (source uploads + AI-generated previews)
-- -------------------------------------------------------------------------
create table public.saved_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  cloudinary_public_id text not null,
  url text not null,
  kind text not null check (kind in ('upload', 'ai_preview', 'community_photo')),
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create index saved_images_user_id_idx on public.saved_images (user_id);

-- -------------------------------------------------------------------------
-- PROJECTS
-- -------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  pet_id uuid references public.pets (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  parent_project_id uuid references public.projects (id) on delete set null, -- for "generate another version" / remixes

  title text not null,
  build_type text, -- "Pet Outfit", "Harness", "Dog Bed", etc.
  status project_status not null default 'processing',
  difficulty difficulty_level not null default 'easy',

  source_image_id uuid references public.saved_images (id) on delete set null,
  preview_image_id uuid references public.saved_images (id) on delete set null,

  budget_cents integer,
  skill_level text,
  preferred_materials text,
  time_available text,

  estimated_cost_cents integer,
  estimated_time_minutes integer,
  retail_price_cents integer,
  money_saved_cents integer,

  materials jsonb not null default '[]'::jsonb,       -- [{name, qty, unit, cost_cents, alt_options:[...]}]
  tools jsonb not null default '[]'::jsonb,            -- [{name, required:boolean}]
  steps jsonb not null default '[]'::jsonb,            -- [{order, title, description, image_url}]
  safety_warnings jsonb not null default '[]'::jsonb,
  diy_score jsonb not null default '{}'::jsonb,        -- {difficulty, safety_rating, tool_complexity, overall, success_probability}

  is_favorite boolean not null default false,
  is_archived boolean not null default false,
  is_public boolean not null default false,            -- published to community marketplace
  tags text[] not null default '{}',

  ai_model text,
  ai_generation_meta jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_id_idx on public.projects (user_id);
create index projects_category_id_idx on public.projects (category_id);
create index projects_public_idx on public.projects (is_public) where is_public = true;
create index projects_tags_idx on public.projects using gin (tags);

-- -------------------------------------------------------------------------
-- GENERATED PDFS
-- -------------------------------------------------------------------------
create table public.generated_pdfs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  url text not null,
  cloudinary_public_id text,
  kind text not null default 'instructions' check (kind in ('instructions', 'shopping_list', 'pattern', 'measurement_guide')),
  created_at timestamptz not null default now()
);

create index generated_pdfs_project_id_idx on public.generated_pdfs (project_id);

-- -------------------------------------------------------------------------
-- COMMUNITY: likes / comments (lightweight, future-ready)
-- -------------------------------------------------------------------------
create table public.project_likes (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index project_comments_project_id_idx on public.project_comments (project_id);

-- -------------------------------------------------------------------------
-- SUBSCRIPTIONS (mirrors Stripe subscription state)
-- -------------------------------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  plan subscription_plan not null default 'free',
  status subscription_status not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);
create unique index subscriptions_stripe_customer_id_idx on public.subscriptions (stripe_customer_id);

-- -------------------------------------------------------------------------
-- PAYMENTS (mirrors Stripe payment intents / invoices)
-- -------------------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_payment_intent_id text unique,
  stripe_invoice_id text,
  kind payment_kind not null,
  status payment_status not null default 'pending',
  amount_cents integer not null,
  currency text not null default 'usd',
  credits_granted integer not null default 0,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index payments_user_id_idx on public.payments (user_id);

-- -------------------------------------------------------------------------
-- CREDITS LEDGER (append-only; profiles.credits_balance is the rollup)
-- -------------------------------------------------------------------------
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount integer not null, -- positive = grant, negative = spend
  reason credit_reason not null,
  related_project_id uuid references public.projects (id) on delete set null,
  related_payment_id uuid references public.payments (id) on delete set null,
  created_at timestamptz not null default now()
);

create index credit_transactions_user_id_idx on public.credit_transactions (user_id);

-- -------------------------------------------------------------------------
-- updated_at trigger helper
-- -------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_pets_updated_at before update on public.pets
  for each row execute function public.set_updated_at();
create trigger trg_projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger trg_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Keep profiles.credits_balance in sync with the ledger
create or replace function public.apply_credit_transaction()
returns trigger as $$
begin
  update public.profiles
  set credits_balance = credits_balance + new.amount
  where id = new.user_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_credit_transactions_apply after insert on public.credit_transactions
  for each row execute function public.apply_credit_transaction();

-- Auto-create a profile row (with signup bonus credits) when a new auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, credits_balance)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    0
  );

  insert into public.credit_transactions (user_id, amount, reason)
  values (new.id, 3, 'signup_bonus');

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.categories enable row level security;
alter table public.saved_images enable row level security;
alter table public.projects enable row level security;
alter table public.generated_pdfs enable row level security;
alter table public.project_likes enable row level security;
alter table public.project_comments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.credit_transactions enable row level security;

-- helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'moderator')
  );
$$ language sql stable security definer set search_path = public;

-- profiles: users see/edit their own row; admins see all
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- pets: fully owned by the user
create policy "pets_owner_all" on public.pets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- categories: public read, admin write
create policy "categories_public_read" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for insert with check (public.is_admin());
create policy "categories_admin_update" on public.categories
  for update using (public.is_admin());

-- saved_images: owned by the user
create policy "saved_images_owner_all" on public.saved_images
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- projects: owner has full access; anyone can read public projects
create policy "projects_owner_all" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_public_read" on public.projects
  for select using (is_public = true);

-- generated_pdfs: owned by the user
create policy "generated_pdfs_owner_all" on public.generated_pdfs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- community likes/comments: readable by all, writable by the author
create policy "project_likes_public_read" on public.project_likes
  for select using (true);
create policy "project_likes_owner_write" on public.project_likes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "project_comments_public_read" on public.project_comments
  for select using (true);
create policy "project_comments_owner_write" on public.project_comments
  for insert with check (auth.uid() = user_id);
create policy "project_comments_owner_delete" on public.project_comments
  for delete using (auth.uid() = user_id);

-- subscriptions / payments / credits: read-only for the owner, writes via service role (webhooks)
create policy "subscriptions_owner_read" on public.subscriptions
  for select using (auth.uid() = user_id or public.is_admin());
create policy "payments_owner_read" on public.payments
  for select using (auth.uid() = user_id or public.is_admin());
create policy "credit_transactions_owner_read" on public.credit_transactions
  for select using (auth.uid() = user_id or public.is_admin());
