# Ingestion/NLP Migration Checklist

This checklist maps directly to the schema plan in [ingestion-nlp-blueprint.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/operations/ingestion-nlp-blueprint.md).

## Ordering Rules

- Apply in numeric order (`001` -> `012`).
- Each migration must be:
  - idempotent in CI/staging replay scenarios,
  - reversible (paired rollback SQL),
  - recorded with checksum in migration tooling.

## Migration Files

### 001_ingestion_schema.sql
- Create:
  - `source_registry`
  - `source_document`
  - `parsed_document_block`
- Add baseline FK constraints and uniqueness guards.

### 002_ingestion_indexes.sql
- Add indexes:
  - `source_document(source_registry_id, fetched_at desc)`
  - `source_document(content_hash)`
  - `parsed_document_block(source_document_id, block_index)`

### 003_domain_official_promise_schema.sql
- Create:
  - `official`
  - `promise`
- Add unique keys:
  - `official.slug`
  - `(promise.official_id, promise.promise_key)`

### 004_domain_evidence_status_schema.sql
- Create:
  - `evidence_item`
  - `promise_evidence_link`
  - `promise_status_history`

### 005_review_schema.sql
- Create:
  - `review_queue`

### 006_projection_score_trend_schema.sql
- Create:
  - `official_score_projection`
  - `official_trend_signal`

### 007_audit_extensions.sql
- Add immutable audit helpers:
  - append-only constraints/triggers for status history
  - `decided_by` validation policy

### 008_read_model_schema.sql
- Create denormalized read-model tables:
  - `home_trending_view`
  - `home_updates_view`
  - `official_profile_view`

### 009_outbox_events_schema.sql
- Create:
  - `event_outbox`
- Required fields:
  - `event_id`, `topic`, `payload_json`, `trace_id`, `published_at`

### 010_seed_priority_jurisdictions.sql
- Seed:
  - core `official` rows for pilot jurisdictions
  - starter `source_registry` rows

### 011_backfill_trend_signals.sql
- Backfill trend signals for seeded officials using `trend-v1`.

### 012_constraints_hardening.sql
- Final hardening:
  - not-null tightening where safe
  - check constraints for status/value enums
  - defensive FK `on delete` policies

## Rollback Pairing

- Each forward migration must include companion rollback SQL:
  - `001_ingestion_schema.down.sql`
  - ...
  - `012_constraints_hardening.down.sql`

## Pre-Deploy Verification (Per Migration)

- `EXPLAIN ANALYZE` on affected hot queries captured in PR notes.
- Backward compatibility check for current app repository interfaces.
- Staging replay on production-like snapshot before production apply.
