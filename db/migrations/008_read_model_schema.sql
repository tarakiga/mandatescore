-- 008_read_model_schema
-- Forward migration
-- Creates denormalized read-model projection tables.

BEGIN;

CREATE TABLE IF NOT EXISTS home_trending_view (
  official_id UUID PRIMARY KEY REFERENCES official(id),
  official_slug TEXT NOT NULL,
  official_name TEXT NOT NULL,
  office TEXT NOT NULL,
  country_code TEXT,
  mandate_score NUMERIC(5,2) NOT NULL,
  trend_score NUMERIC(6,2) NOT NULL,
  kept_count INT NOT NULL,
  in_progress_count INT NOT NULL,
  broken_count INT NOT NULL,
  data_last_updated_label TEXT NOT NULL,
  projection_version TEXT NOT NULL,
  refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS home_updates_view (
  id UUID PRIMARY KEY,
  official_id UUID NOT NULL REFERENCES official(id),
  official_name TEXT NOT NULL,
  promise_id UUID REFERENCES promise(id),
  promise_title TEXT NOT NULL,
  status_label TEXT NOT NULL, -- Kept|In Progress|Broken
  updated_at_label TEXT NOT NULL,
  projection_version TEXT NOT NULL,
  refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS official_profile_view (
  official_id UUID PRIMARY KEY REFERENCES official(id),
  official_slug TEXT NOT NULL,
  official_name TEXT NOT NULL,
  office TEXT NOT NULL,
  country_code TEXT,
  jurisdiction TEXT NOT NULL,
  mandate_score NUMERIC(5,2) NOT NULL,
  kept_count INT NOT NULL,
  in_progress_count INT NOT NULL,
  broken_count INT NOT NULL,
  last_evidence_sync_label TEXT NOT NULL,
  data_last_updated_label TEXT NOT NULL,
  source_mode TEXT NOT NULL, -- live|fallback
  projection_version TEXT NOT NULL,
  refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_home_trending_view_trend_score
  ON home_trending_view (trend_score DESC);

CREATE INDEX IF NOT EXISTS idx_home_updates_view_refreshed
  ON home_updates_view (refreshed_at DESC);

CREATE INDEX IF NOT EXISTS idx_home_updates_view_official
  ON home_updates_view (official_id, refreshed_at DESC);

COMMIT;
