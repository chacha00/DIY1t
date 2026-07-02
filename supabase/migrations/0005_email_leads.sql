create table if not exists email_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'landing_page',
  created_at timestamptz default now()
);

-- Only service role can read/write (no public access)
alter table email_leads enable row level security;
