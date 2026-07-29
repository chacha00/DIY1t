CREATE TABLE IF NOT EXISTS step_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_order integer NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  photo_url text,
  ai_feedback text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, project_id, step_order)
);

ALTER TABLE step_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own step progress"
  ON step_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
