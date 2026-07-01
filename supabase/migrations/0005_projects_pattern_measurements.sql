alter table public.projects
  add column if not exists pattern_pieces jsonb not null default '[]'::jsonb,
  add column if not exists measurements jsonb not null default '[]'::jsonb;
