-- 008_read_model_schema rollback
-- Reverse migration
-- Drops denormalized read-model projection tables.

BEGIN;

DROP TABLE IF EXISTS official_profile_view;
DROP TABLE IF EXISTS home_updates_view;
DROP TABLE IF EXISTS home_trending_view;

COMMIT;
