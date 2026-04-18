-- 005_review_schema rollback
-- Reverse migration
-- Drops review queue table.

BEGIN;

DROP TABLE IF EXISTS review_queue;

COMMIT;
