CREATE TABLE IF NOT EXISTS craft_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'fabric',  -- fabric | hardware | notions | tools | other
  color text,
  quantity_estimate text,   -- e.g. "about 1 yard", "several pieces"
  confidence integer CHECK (confidence BETWEEN 0 AND 100),
  photo_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE craft_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own inventory"
  ON craft_inventory FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
