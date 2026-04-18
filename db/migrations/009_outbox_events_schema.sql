-- 009_outbox_events_schema
-- Forward migration
-- Creates transactional outbox table for reliable event publishing.

BEGIN;

CREATE TABLE IF NOT EXISTS event_outbox (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL UNIQUE,
  topic TEXT NOT NULL,
  payload_json JSONB NOT NULL,
  trace_id TEXT NOT NULL,
  schema_version TEXT NOT NULL DEFAULT 'v1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_event_outbox_unpublished_created
  ON event_outbox (created_at ASC)
  WHERE published_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_event_outbox_topic_created
  ON event_outbox (topic, created_at DESC);

COMMIT;
