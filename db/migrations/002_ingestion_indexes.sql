-- 002_ingestion_indexes
-- Forward migration
-- Adds hot-path indexes for ingestion lookups.

BEGIN;

CREATE INDEX IF NOT EXISTS idx_source_document_registry_fetched
  ON source_document (source_registry_id, fetched_at DESC);

CREATE INDEX IF NOT EXISTS idx_source_document_content_hash
  ON source_document (content_hash);

CREATE INDEX IF NOT EXISTS idx_parsed_document_block_doc_block
  ON parsed_document_block (source_document_id, block_index);

COMMIT;
