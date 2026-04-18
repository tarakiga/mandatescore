-- 004_domain_evidence_status_schema rollback
-- Reverse migration
-- Drops evidence, promise-evidence links, and promise status history.

BEGIN;

DROP TABLE IF EXISTS promise_status_history;
DROP TABLE IF EXISTS promise_evidence_link;
DROP TABLE IF EXISTS evidence_item;

COMMIT;
