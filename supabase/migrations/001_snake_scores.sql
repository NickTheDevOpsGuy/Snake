-- Snake game leaderboard (anonymous, no auth required)
CREATE TABLE IF NOT EXISTS snake_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  player_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_snake_scores_difficulty_score
  ON snake_scores(difficulty, score DESC);

CREATE INDEX IF NOT EXISTS idx_snake_scores_created
  ON snake_scores(created_at DESC);

-- Allow anonymous inserts and reads (no RLS for simplicity, or enable RLS with permissive policies)
ALTER TABLE snake_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert scores" ON snake_scores
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read scores" ON snake_scores
  FOR SELECT USING (true);
