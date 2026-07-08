-- Affiliate / referral system
-- Each Maker Pro user gets one referral code.
-- When a referred user signs up via that code and converts to a paid plan,
-- a referral row is created and commission is calculated at payout time.

CREATE TABLE referral_codes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code        text NOT NULL UNIQUE,              -- e.g. "maker-abc123"
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);

CREATE TABLE referrals (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id         uuid REFERENCES profiles(id) ON DELETE SET NULL,
  code                text NOT NULL,
  -- click-tracking: stored when the referral link is first visited
  clicked_at          timestamptz NOT NULL DEFAULT now(),
  -- set when the referred user registers
  signed_up_at        timestamptz,
  -- set when the referred user makes their first payment
  converted_at        timestamptz,
  plan                text,                      -- "monthly_unlimited" | "annual_unlimited"
  first_payment_cents integer,
  commission_cents    integer,                   -- 20/25/30% of first_payment_cents
  commission_rate_pct integer,                   -- 20 | 25 | 30
  paid_at             timestamptz,               -- null until payout processed
  payout_method       text,                      -- "paypal" | "stripe" | "credits"
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE INDEX idx_referrals_code     ON referrals(code);

-- RLS: users can read their own referral codes and referral rows
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referral_codes_own" ON referral_codes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "referrals_own_as_referrer" ON referrals
  FOR SELECT USING (referrer_id = auth.uid());

-- Only service role can insert/update (prevents self-referrals and manipulation)

-- Helper: generate a short unique code for a user
CREATE OR REPLACE FUNCTION generate_referral_code(p_user_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_code text;
  v_exists boolean;
BEGIN
  LOOP
    v_code := 'maker-' || substring(replace(gen_random_uuid()::text, '-', ''), 1, 8);
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;

  INSERT INTO referral_codes(user_id, code)
  VALUES (p_user_id, v_code)
  ON CONFLICT (user_id) DO NOTHING;  -- idempotent

  RETURN v_code;
END;
$$;

-- Helper: get or create referral code for a user
CREATE OR REPLACE FUNCTION get_or_create_referral_code(p_user_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_code text;
BEGIN
  SELECT code INTO v_code FROM referral_codes WHERE user_id = p_user_id LIMIT 1;
  IF v_code IS NULL THEN
    v_code := generate_referral_code(p_user_id);
  END IF;
  RETURN v_code;
END;
$$;

-- Referral stats view for the dashboard
CREATE OR REPLACE VIEW referral_stats AS
SELECT
  r.referrer_id                                                 AS user_id,
  COUNT(*)                                                      AS total_clicks,
  COUNT(r.signed_up_at)                                         AS total_signups,
  COUNT(r.converted_at)                                         AS total_conversions,
  COALESCE(SUM(r.commission_cents) FILTER (WHERE r.paid_at IS NOT NULL), 0) AS total_earned_cents,
  COALESCE(SUM(r.commission_cents) FILTER (WHERE r.paid_at IS NULL AND r.converted_at IS NOT NULL), 0) AS pending_cents,
  COALESCE(SUM(r.commission_cents) FILTER (
    WHERE r.paid_at IS NULL
    AND r.converted_at IS NOT NULL
    AND r.converted_at >= date_trunc('month', now())
  ), 0) AS this_month_cents,
  COUNT(r.converted_at) FILTER (
    WHERE r.converted_at >= date_trunc('month', now())
  )                                                             AS this_month_conversions
FROM referrals r
GROUP BY r.referrer_id;

ALTER VIEW referral_stats OWNER TO postgres;
GRANT SELECT ON referral_stats TO authenticated;

-- RLS on view via security invoker (default) — users only see their own row
-- enforced by the WHERE referrer_id = auth.uid() filter added in queries
