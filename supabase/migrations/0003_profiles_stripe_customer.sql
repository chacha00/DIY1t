-- Canonical Stripe customer mapping, independent of subscription state
-- (credit-pack-only buyers never get a subscriptions row).
alter table public.profiles
  add column if not exists stripe_customer_id text unique;
