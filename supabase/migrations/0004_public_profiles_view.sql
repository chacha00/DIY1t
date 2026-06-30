-- profiles RLS only allows reading your own row (or admin). The community
-- marketplace needs to show *other* users' display names publicly, without
-- exposing email, credits, Stripe IDs, or any other sensitive profile data.
create view public.public_profiles
  with (security_invoker = false)
  as
  select id, full_name, avatar_url, username
  from public.profiles;

grant select on public.public_profiles to anon, authenticated;
