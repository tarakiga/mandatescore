-- 005_review_schema
-- Forward migration
-- Creates human-in-the-loop review queue table and indexes.

BEGIN;

CREATE TABLE IF NOT EXISTS review_queue (
  id UUID PRIMARY KEY,
  entity_type TEXT NOT NULL, -- promise|link|status
  entity_id UUID NOT NULL,
  reason TEXT NOT NULL, -- low_confidence|conflict|policy_guardrail
  priority TEXT NOT NULL DEFAULT 'normal', -- low|normal|high
  state TEXT NOT NULL DEFAULT 'open', -- open|in_review|resolved
  assigned_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_review_queue_state_priority_created
  ON review_queue (state, priority, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_review_queue_entity
  ON review_queue (entity_type, entity_id);

COMMIT;
