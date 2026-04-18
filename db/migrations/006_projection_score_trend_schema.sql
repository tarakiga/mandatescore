-- 006_projection_score_trend_schema
-- Forward migration
-- Creates score and trend projection tables.

BEGIN;

CREATE TABLE IF NOT EXISTS official_score_projection (
  id UUID PRIMARY KEY,
  official_id UUID NOT NULL REFERENCES official(id),
  kept_count INT NOT NULL,
  in_progress_count INT NOT NULL,
  broken_count INT NOT NULL,
  mandate_score NUMERIC(5,2) NOT NULL,
  score_delta_30d NUMERIC(5,2) NOT NULL DEFAULT 0,
  recomputed_at TIMESTAMPTZ NOT NULL,
  UNIQUE (official_id)
);

CREATE TABLE IF NOT EXISTS official_trend_signal (
  id UUID PRIMARY KEY,
  official_id UUID NOT NULL REFERENCES official(id),
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  search_volume_index NUMERIC(6,2) NOT NULL, -- 0..100
  recency_index NUMERIC(6,2) NOT NULL, -- 0..100
  evidence_velocity_index NUMERIC(6,2) NOT NULL, -- 0..100
  score_movement_index NUMERIC(6,2) NOT NULL, -- 0..100
  trend_score NUMERIC(6,2) NOT NULL, -- weighted
  formula_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_official_trend_signal_official_window
  ON official_trend_signal (official_id, window_end DESC);

CREATE INDEX IF NOT EXISTS idx_official_trend_signal_formula
  ON official_trend_signal (formula_version);

COMMIT;
