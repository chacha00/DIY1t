-- Saved projects: users can bookmark any project
create table public.saved_projects (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, project_id)
);

create index saved_projects_user_id_idx on public.saved_projects (user_id);
create index saved_projects_project_id_idx on public.saved_projects (project_id);

alter table public.saved_projects enable row level security;

create policy "saved_projects_owner_all" on public.saved_projects
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Project makes: photos users upload of their completed builds
create table public.project_makes (
  id                   uuid primary key default gen_random_uuid(),
  project_id           uuid not null references public.projects (id) on delete cascade,
  user_id              uuid not null references public.profiles (id) on delete cascade,
  cloudinary_public_id text not null,
  url                  text not null,
  caption              text,
  created_at           timestamptz not null default now()
);

create index project_makes_project_id_idx on public.project_makes (project_id);
create index project_makes_user_id_idx    on public.project_makes (user_id);

alter table public.project_makes enable row level security;

-- Owner can do everything; anyone can read makes on public projects
create policy "project_makes_owner_all" on public.project_makes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "project_makes_public_read" on public.project_makes
  for select using (
    exists (
      select 1 from public.projects
      where id = project_id and is_public = true
    )
  );
