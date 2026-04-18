-- 012_constraints_hardening
-- Forward migration
-- Adds final check constraints and defensive FK policies.

BEGIN;

ALTER TABLE source_document
  ADD CONSTRAINT chk_source_document_parse_status
  CHECK (parse_status IN ('pending', 'parsed', 'failed'));

ALTER TABLE review_queue
  ADD CONSTRAINT chk_review_queue_entity_type
  CHECK (entity_type IN ('promise', 'link', 'status'));

ALTER TABLE review_queue
  ADD CONSTRAINT chk_review_queue_priority
  CHECK (priority IN ('low', 'normal', 'high'));

ALTER TABLE review_queue
  ADD CONSTRAINT chk_review_queue_state
  CHECK (state IN ('open', 'in_review', 'resolved'));

ALTER TABLE promise_status_history
  ADD CONSTRAINT chk_promise_status_history_status
  CHECK (status IN ('kept', 'in_progress', 'broken'));

ALTER TABLE official_profile_view
  ADD CONSTRAINT chk_official_profile_view_source_mode
  CHECK (source_mode IN ('live', 'fallback'));

ALTER TABLE source_document
  DROP CONSTRAINT IF EXISTS source_document_source_registry_id_fkey;

ALTER TABLE source_document
  ADD CONSTRAINT source_document_source_registry_id_fkey
  FOREIGN KEY (source_registry_id) REFERENCES source_registry(id) ON DELETE RESTRICT;

ALTER TABLE promise
  DROP CONSTRAINT IF EXISTS promise_official_id_fkey;

ALTER TABLE promise
  ADD CONSTRAINT promise_official_id_fkey
  FOREIGN KEY (official_id) REFERENCES official(id) ON DELETE RESTRICT;

ALTER TABLE promise_evidence_link
  DROP CONSTRAINT IF EXISTS promise_evidence_link_promise_id_fkey;

ALTER TABLE promise_evidence_link
  ADD CONSTRAINT promise_evidence_link_promise_id_fkey
  FOREIGN KEY (promise_id) REFERENCES promise(id) ON DELETE CASCADE;

ALTER TABLE promise_evidence_link
  DROP CONSTRAINT IF EXISTS promise_evidence_link_evidence_item_id_fkey;

ALTER TABLE promise_evidence_link
  ADD CONSTRAINT promise_evidence_link_evidence_item_id_fkey
  FOREIGN KEY (evidence_item_id) REFERENCES evidence_item(id) ON DELETE CASCADE;

COMMIT;
