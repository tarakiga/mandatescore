-- 001_ingestion_schema
-- Forward migration
-- Creates ingestion source and parsed-document foundation tables.

BEGIN;

CREATE TABLE IF NOT EXISTS source_registry (
  id UUID PRIMARY KEY,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL, -- manifesto|gazette|news|factcheck|budget|speech
  jurisdiction_code TEXT NOT NULL,
  base_url TEXT NOT NULL,
  credibility_tier SMALLINT NOT NULL CHECK (credibility_tier BETWEEN 1 AND 5),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS source_document (
  id UUID PRIMARY KEY,
  source_registry_id UUID NOT NULL REFERENCES source_registry(id),
  source_url TEXT NOT NULL,
  source_published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL,
  content_hash TEXT NOT NULL, -- sha256
  mime_type TEXT NOT NULL,
  language_code TEXT,
  country_code TEXT,
  blob_path TEXT NOT NULL, -- object store path
  parse_status TEXT NOT NULL DEFAULT 'pending', -- pending|parsed|failed
  UNIQUE (source_url, content_hash)
);

CREATE TABLE IF NOT EXISTS parsed_document_block (
  id UUID PRIMARY KEY,
  source_document_id UUID NOT NULL REFERENCES source_document(id),
  block_index INT NOT NULL,
  block_type TEXT NOT NULL, -- heading|paragraph|table|bullet|quote
  text_content TEXT NOT NULL,
  section_path TEXT,
  page_number INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_document_id, block_index)
);

COMMIT;
