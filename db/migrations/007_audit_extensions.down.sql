-- 007_audit_extensions rollback
-- Reverse migration
-- Removes immutable audit guardrails and decided_by validation.

BEGIN;

DROP TRIGGER IF EXISTS trg_forbid_promise_status_history_delete
  ON promise_status_history;

DROP TRIGGER IF EXISTS trg_forbid_promise_status_history_update
  ON promise_status_history;

DROP FUNCTION IF EXISTS forbid_promise_status_history_update_delete();

ALTER TABLE promise_status_history
  DROP CONSTRAINT IF EXISTS chk_promise_status_history_decided_by;

COMMIT;
