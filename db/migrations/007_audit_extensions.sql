-- 007_audit_extensions
-- Forward migration
-- Adds immutable audit guardrails and decided_by validation.

BEGIN;

ALTER TABLE promise_status_history
  ADD CONSTRAINT chk_promise_status_history_decided_by
  CHECK (
    decided_by = 'system'
    OR decided_by LIKE 'reviewer:%'
  );

CREATE OR REPLACE FUNCTION forbid_promise_status_history_update_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'promise_status_history is append-only';
END;
$$;

DROP TRIGGER IF EXISTS trg_forbid_promise_status_history_update
  ON promise_status_history;

CREATE TRIGGER trg_forbid_promise_status_history_update
BEFORE UPDATE ON promise_status_history
FOR EACH ROW
EXECUTE FUNCTION forbid_promise_status_history_update_delete();

DROP TRIGGER IF EXISTS trg_forbid_promise_status_history_delete
  ON promise_status_history;

CREATE TRIGGER trg_forbid_promise_status_history_delete
BEFORE DELETE ON promise_status_history
FOR EACH ROW
EXECUTE FUNCTION forbid_promise_status_history_update_delete();

COMMIT;
