alter table public.projects
  add column if not exists assembly_overview text,
  add column if not exists size_chart jsonb not null default '[]'::jsonb;
