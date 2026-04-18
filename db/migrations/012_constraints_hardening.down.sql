-- 012_constraints_hardening rollback
-- Reverse migration
-- Removes hardening constraints and restores default FK delete behavior.

BEGIN;

ALTER TABLE promise_evidence_link
  DROP CONSTRAINT IF EXISTS promise_evidence_link_evidence_item_id_fkey;

ALTER TABLE promise_evidence_link
  ADD CONSTRAINT promise_evidence_link_evidence_item_id_fkey
  FOREIGN KEY (evidence_item_id) REFERENCES evidence_item(id);

ALTER TABLE promise_evidence_link
  DROP CONSTRAINT IF EXISTS promise_evidence_link_promise_id_fkey;

ALTER TABLE promise_evidence_link
  ADD CONSTRAINT promise_evidence_link_promise_id_fkey
  FOREIGN KEY (promise_id) REFERENCES promise(id);

ALTER TABLE promise
  DROP CONSTRAINT IF EXISTS promise_official_id_fkey;

ALTER TABLE promise
  ADD CONSTRAINT promise_official_id_fkey
  FOREIGN KEY (official_id) REFERENCES official(id);

ALTER TABLE source_document
  DROP CONSTRAINT IF EXISTS source_document_source_registry_id_fkey;

ALTER TABLE source_document
  ADD CONSTRAINT source_document_source_registry_id_fkey
  FOREIGN KEY (source_registry_id) REFERENCES source_registry(id);

ALTER TABLE official_profile_view
  DROP CONSTRAINT IF EXISTS chk_official_profile_view_source_mode;

ALTER TABLE promise_status_history
  DROP CONSTRAINT IF EXISTS chk_promise_status_history_status;

ALTER TABLE review_queue
  DROP CONSTRAINT IF EXISTS chk_review_queue_state;

ALTER TABLE review_queue
  DROP CONSTRAINT IF EXISTS chk_review_queue_priority;

ALTER TABLE review_queue
  DROP CONSTRAINT IF EXISTS chk_review_queue_entity_type;

ALTER TABLE source_document
  DROP CONSTRAINT IF EXISTS chk_source_document_parse_status;

COMMIT;
