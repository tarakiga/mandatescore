-- 002_ingestion_indexes rollback
-- Reverse migration
-- Drops ingestion hot-path indexes.

BEGIN;

DROP INDEX IF EXISTS idx_parsed_document_block_doc_block;
DROP INDEX IF EXISTS idx_source_document_content_hash;
DROP INDEX IF EXISTS idx_source_document_registry_fetched;

COMMIT;
