-- Atomically bump profile rollups after a project is generated.
create or replace function public.increment_profile_stats(
  p_user_id uuid,
  p_money_saved_cents integer
)
returns void as $$
begin
  update public.profiles
  set
    total_projects = total_projects + 1,
    total_money_saved_cents = total_money_saved_cents + greatest(p_money_saved_cents, 0),
    last_active_at = now()
  where id = p_user_id;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.increment_profile_stats(uuid, integer) to authenticated;
