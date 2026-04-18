-- 009_outbox_events_schema rollback
-- Reverse migration
-- Drops transactional outbox table.

BEGIN;

DROP TABLE IF EXISTS event_outbox;

COMMIT;
