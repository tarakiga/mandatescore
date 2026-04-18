-- 004_domain_evidence_status_schema
-- Forward migration
-- Creates evidence, promise-evidence link, and promise status history.

BEGIN;

CREATE TABLE IF NOT EXISTS evidence_item (
  id UUID PRIMARY KEY,
  source_document_id UUID NOT NULL REFERENCES source_document(id),
  evidence_type TEXT NOT NULL, -- law|budget|report|speech|oversight|factcheck
  summary TEXT NOT NULL,
  effective_date DATE,
  credibility_tier SMALLINT NOT NULL CHECK (credibility_tier BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promise_evidence_link (
  id UUID PRIMARY KEY,
  promise_id UUID NOT NULL REFERENCES promise(id),
  evidence_item_id UUID NOT NULL REFERENCES evidence_item(id),
  link_confidence NUMERIC(5,4) NOT NULL,
  linker_model_version TEXT NOT NULL,
  is_human_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (promise_id, evidence_item_id)
);

CREATE TABLE IF NOT EXISTS promise_status_history (
  id UUID PRIMARY KEY,
  promise_id UUID NOT NULL REFERENCES promise(id),
  status TEXT NOT NULL, -- kept|in_progress|broken
  confidence NUMERIC(5,4) NOT NULL,
  explanation TEXT NOT NULL,
  classifier_model_version TEXT NOT NULL,
  effective_at TIMESTAMPTZ NOT NULL,
  decided_by TEXT NOT NULL, -- system|reviewer:<id>
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_item_source_document
  ON evidence_item (source_document_id);

CREATE INDEX IF NOT EXISTS idx_promise_evidence_link_promise
  ON promise_evidence_link (promise_id);

CREATE INDEX IF NOT EXISTS idx_promise_evidence_link_evidence
  ON promise_evidence_link (evidence_item_id);

CREATE INDEX IF NOT EXISTS idx_promise_status_history_promise_effective
  ON promise_status_history (promise_id, effective_at DESC);

COMMIT;
