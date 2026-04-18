-- 003_domain_official_promise_schema rollback
-- Reverse migration
-- Drops canonical official and promise domain tables.

BEGIN;

DROP TABLE IF EXISTS promise;
DROP TABLE IF EXISTS official;

COMMIT;
