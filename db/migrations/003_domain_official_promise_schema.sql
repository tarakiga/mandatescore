-- 003_domain_official_promise_schema
-- Forward migration
-- Creates canonical official and promise domain tables.

BEGIN;

CREATE TABLE IF NOT EXISTS official (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  office TEXT NOT NULL,
  country_code TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  term_start DATE,
  term_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promise (
  id UUID PRIMARY KEY,
  official_id UUID NOT NULL REFERENCES official(id),
  promise_key TEXT NOT NULL,
  statement_text TEXT NOT NULL,
  policy_category TEXT,
  announced_at DATE,
  source_document_id UUID REFERENCES source_document(id),
  extraction_confidence NUMERIC(5,4) NOT NULL,
  extraction_model_version TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (official_id, promise_key)
);

CREATE INDEX IF NOT EXISTS idx_promise_official_id
  ON promise (official_id);

CREATE INDEX IF NOT EXISTS idx_promise_policy_category
  ON promise (policy_category);

COMMIT;
