-- 001_ingestion_schema rollback
-- Reverse migration
-- Drops ingestion source and parsed-document foundation tables.

BEGIN;

DROP TABLE IF EXISTS parsed_document_block;
DROP TABLE IF EXISTS source_document;
DROP TABLE IF EXISTS source_registry;

COMMIT;
