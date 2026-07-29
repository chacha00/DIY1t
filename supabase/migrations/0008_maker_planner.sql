-- Maker's Planner: fabric stash, generic shopping list, and project-planning to-do log.
-- Bonus perk for DIY+ and Maker Pro subscribers (gated in the app, not here).

create table public.fabric_stash (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  fabric_name text not null,
  fiber_content text,
  color text,
  yardage numeric(6,2),
  width_in numeric(5,2),
  cost_cents integer,
  shop text,
  notes text,
  created_at timestamptz not null default now()
);
create index idx_fabric_stash_user on public.fabric_stash(user_id);

create table public.maker_shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  item_name text not null,
  shop text,
  budget_cents integer,
  price_cents integer,
  is_bought boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);
create index idx_maker_shopping_list_items_user on public.maker_shopping_list_items(user_id);

create table public.planner_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  entry_date date not null default current_date,
  title text not null,
  notes text,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_planner_entries_user on public.planner_entries(user_id);

alter table public.fabric_stash enable row level security;
alter table public.maker_shopping_list_items enable row level security;
alter table public.planner_entries enable row level security;

create policy "fabric_stash_owner_all" on public.fabric_stash
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "maker_shopping_list_items_owner_all" on public.maker_shopping_list_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "planner_entries_owner_all" on public.planner_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
