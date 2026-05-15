-- ============================================================
-- X-GROWTH INTELLIGENCE PLATFORM — SCHEMA
-- Run this in your Supabase SQL editor
-- ============================================================

-- Analyses table: stores all AI analysis results
CREATE TABLE IF NOT EXISTS analyses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL CHECK (type IN ('virality','slop','hook','compose','feed','dna','strategy')),
  input_text  TEXT NOT NULL,
  result      JSONB NOT NULL,
  overall_score INTEGER,
  verdict     TEXT,
  session_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick session history queries
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_type ON analyses (type);
CREATE INDEX IF NOT EXISTS idx_analyses_session ON analyses (session_id) WHERE session_id IS NOT NULL;

-- Drafts table: stores saved tweet drafts
CREATE TABLE IF NOT EXISTS drafts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content         TEXT NOT NULL,
  label           TEXT,
  virality_score  INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drafts_created_at ON drafts (created_at DESC);

-- Auto-update updated_at on drafts
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS drafts_updated_at ON drafts;
CREATE TRIGGER drafts_updated_at
  BEFORE UPDATE ON drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Creator profiles: DNA extraction results
CREATE TABLE IF NOT EXISTS creator_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  sample_posts  TEXT NOT NULL,
  dna           JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON creator_profiles (created_at DESC);

-- Strategies: saved content plans
CREATE TABLE IF NOT EXISTS strategies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context     TEXT NOT NULL,
  plan        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strategies_created_at ON strategies (created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (enable when adding auth)
-- ============================================================

-- Currently disabled — this is a private internal tool.
-- When you add auth, enable with:
--   ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
--   CREATE POLICY "analyses_own" ON analyses USING (auth.uid() = user_id);
-- And add user_id columns.
