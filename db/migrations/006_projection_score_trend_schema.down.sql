-- 006_projection_score_trend_schema rollback
-- Reverse migration
-- Drops score and trend projection tables.

BEGIN;

DROP TABLE IF EXISTS official_trend_signal;
DROP TABLE IF EXISTS official_score_projection;

COMMIT;
