# Mandate Score Ingestion + NLP Technical Blueprint

## 1. Scope And Goals

This blueprint defines the production pipeline for:

- ingesting promises/evidence documents from heterogeneous sources,
- extracting and normalizing political promises,
- linking evidence to promises,
- computing statuses and trend signals,
- publishing auditable records for UI/API consumption.

Primary non-functional goals:

- traceability: every status must be evidence-backed and reproducible,
- freshness: high-priority jurisdictions updated within SLA,
- safety: low-confidence model outputs require human review,
- portability: service boundaries allow independent scaling.

---

## 2. Architecture Overview

### 2.1 Services

1. `source-discovery-service`
- discovers new source URLs and feed entries.
- writes `source_document` candidates.

2. `fetcher-service`
- fetches raw artifacts (HTML/PDF/DOC/JSON).
- stores immutable blobs + checksums.

3. `parser-service`
- converts artifacts into normalized text blocks and metadata.
- emits structural sections and tables.

4. `promise-extraction-service`
- extracts canonical promises.
- emits confidence + rationale.

5. `evidence-linker-service`
- retrieves and ranks candidate promise links for new evidence.
- emits match set + confidence.

6. `status-classifier-service`
- classifies `Kept/In Progress/Broken`.
- emits confidence + explanation + required citation set.

7. `scoring-trending-service`
- computes mandate score deltas and trend features.
- publishes updated profile/trending projections.

8. `review-service`
- human-in-the-loop queue, adjudication workflow.
- applies approvals/overrides with audit trail.

9. `publisher-service`
- writes production read models consumed by frontend/API.

### 2.2 Data Stores

- `object_store` (immutable raw artifacts, OCR output, snapshots).
- `postgres_primary` (normalized entities + audit tables).
- `vector_store` (embedding retrieval for evidence linking).
- `redis` (short-lived dedup keys, rate-limiting, job idempotency locks).

---

## 3. Canonical Schema Definitions (PostgreSQL)

### 3.1 Source And Document Layer

```sql
create table source_registry (
  id uuid primary key,
  source_name text not null,
  source_type text not null, -- manifesto|gazette|news|factcheck|budget|speech
  jurisdiction_code text not null, -- ISO-like region code
  base_url text not null,
  credibility_tier smallint not null check (credibility_tier between 1 and 5),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table source_document (
  id uuid primary key,
  source_registry_id uuid not null references source_registry(id),
  source_url text not null,
  source_published_at timestamptz,
  fetched_at timestamptz not null,
  content_hash text not null, -- sha256
  mime_type text not null,
  language_code text,
  country_code text,
  blob_path text not null, -- object store path
  parse_status text not null default 'pending', -- pending|parsed|failed
  unique (source_url, content_hash)
);

create table parsed_document_block (
  id uuid primary key,
  source_document_id uuid not null references source_document(id),
  block_index int not null,
  block_type text not null, -- heading|paragraph|table|bullet|quote
  text_content text not null,
  section_path text, -- e.g. "chapter 2 > housing"
  page_number int,
  created_at timestamptz not null default now(),
  unique (source_document_id, block_index)
);
```

### 3.2 Political Entity Layer

```sql
create table official (
  id uuid primary key,
  slug text not null unique,
  display_name text not null,
  office text not null,
  country_code text not null,
  jurisdiction text not null,
  term_start date,
  term_end date,
  created_at timestamptz not null default now()
);

create table promise (
  id uuid primary key,
  official_id uuid not null references official(id),
  promise_key text not null, -- stable canonical key
  statement_text text not null,
  policy_category text,
  announced_at date,
  source_document_id uuid references source_document(id),
  extraction_confidence numeric(5,4) not null,
  extraction_model_version text not null,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (official_id, promise_key)
);
```

### 3.3 Evidence, Status, And Audit Layer

```sql
create table evidence_item (
  id uuid primary key,
  source_document_id uuid not null references source_document(id),
  evidence_type text not null, -- law|budget|report|speech|oversight|factcheck
  summary text not null,
  effective_date date,
  credibility_tier smallint not null check (credibility_tier between 1 and 5),
  created_at timestamptz not null default now()
);

create table promise_evidence_link (
  id uuid primary key,
  promise_id uuid not null references promise(id),
  evidence_item_id uuid not null references evidence_item(id),
  link_confidence numeric(5,4) not null,
  linker_model_version text not null,
  is_human_approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (promise_id, evidence_item_id)
);

create table promise_status_history (
  id uuid primary key,
  promise_id uuid not null references promise(id),
  status text not null, -- kept|in_progress|broken
  confidence numeric(5,4) not null,
  explanation text not null,
  classifier_model_version text not null,
  effective_at timestamptz not null,
  decided_by text not null, -- system|reviewer:<id>
  created_at timestamptz not null default now()
);

create table review_queue (
  id uuid primary key,
  entity_type text not null, -- promise|link|status
  entity_id uuid not null,
  reason text not null, -- low_confidence|conflict|policy_guardrail
  priority text not null default 'normal', -- low|normal|high
  state text not null default 'open', -- open|in_review|resolved
  assigned_to text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
```

### 3.4 Score/Trend Projection Layer

```sql
create table official_score_projection (
  id uuid primary key,
  official_id uuid not null references official(id),
  kept_count int not null,
  in_progress_count int not null,
  broken_count int not null,
  mandate_score numeric(5,2) not null,
  score_delta_30d numeric(5,2) not null default 0,
  recomputed_at timestamptz not null,
  unique (official_id)
);

create table official_trend_signal (
  id uuid primary key,
  official_id uuid not null references official(id),
  window_start timestamptz not null,
  window_end timestamptz not null,
  search_volume_index numeric(6,2) not null, -- 0..100
  recency_index numeric(6,2) not null, -- 0..100
  evidence_velocity_index numeric(6,2) not null, -- 0..100
  score_movement_index numeric(6,2) not null, -- 0..100
  trend_score numeric(6,2) not null, -- weighted
  formula_version text not null, -- e.g. trend-v1
  created_at timestamptz not null default now()
);
```

---

## 4. Queue Topics And Event Contracts

Broker choice: Kafka (or equivalent durable stream). All messages include:

- `event_id` (uuid),
- `trace_id`,
- `occurred_at` (ISO timestamp),
- `schema_version`.

### 4.1 Topic Map

1. `source.discovered.v1`
- payload: `source_registry_id`, `source_url`, `source_published_at`

2. `document.fetched.v1`
- payload: `source_document_id`, `content_hash`, `blob_path`, `mime_type`, `language_code`

3. `document.parsed.v1`
- payload: `source_document_id`, `block_count`, `parse_quality_score`

4. `promise.extracted.v1`
- payload: `promise_id`, `official_id`, `promise_key`, `confidence`

5. `evidence.created.v1`
- payload: `evidence_item_id`, `source_document_id`, `evidence_type`

6. `promise.evidence_linked.v1`
- payload: `promise_id`, `evidence_item_id`, `confidence`, `requires_review`

7. `promise.status_computed.v1`
- payload: `promise_id`, `status`, `confidence`, `explanation`, `requires_review`

8. `review.decision.v1`
- payload: `entity_type`, `entity_id`, `decision`, `reviewer_id`, `notes`

9. `score.recomputed.v1`
- payload: `official_id`, `mandate_score`, `kept_count`, `in_progress_count`, `broken_count`

10. `trend.recomputed.v1`
- payload: `official_id`, `trend_score`, `formula_version`, `signals`

11. `publish.refresh_requested.v1`
- payload: `official_id`, `reason`

12. `publish.completed.v1`
- payload: `official_id`, `published_at`, `read_model_version`

### 4.2 Reliability Rules

- at-least-once delivery + idempotent consumers.
- consumer idempotency key: `event_id`.
- poison events -> dead-letter topic with error metadata.

---

## 5. Service Boundaries (Clear Ownership)

### 5.1 Ingestion Domain

- owns: `source_registry`, `source_document`, `parsed_document_block`
- APIs:
  - `POST /sources/sync`
  - `GET /documents/:id`
  - `POST /documents/:id/reparse`

### 5.2 NLP Domain

- owns: `promise`, `evidence_item`, `promise_evidence_link`, `promise_status_history`
- APIs:
  - `POST /nlp/extract/:sourceDocumentId`
  - `POST /nlp/link/:evidenceItemId`
  - `POST /nlp/classify/:promiseId`

### 5.3 Review Domain

- owns: `review_queue`
- APIs:
  - `GET /review/tasks?state=open`
  - `POST /review/tasks/:id/decision`

### 5.4 Score/Trend Domain

- owns: `official_score_projection`, `official_trend_signal`
- APIs:
  - `POST /score/recompute/:officialId`
  - `POST /trend/recompute/:officialId`

### 5.5 Publish Domain

- owns denormalized read models for frontend:
  - `home_trending_view`
  - `home_updates_view`
  - `official_profile_view`

---

## 6. Trend Formula (Transparent)

`trend_score = 0.40*search_volume + 0.25*recency + 0.20*evidence_velocity + 0.15*score_movement`

Normalization:

- all factors clamped to `0..100`.
- `recency` decays over rolling 7-day window.
- `score_movement` uses signed delta mapped to `0..100` with midpoint at no-change.
- persist `formula_version` for historical comparability.

---

## 7. Acceptance Criteria By Phase

## Phase 1: Ingestion Backbone + Promise Extraction

### Must Have

- source connectors process at least 3 source types (HTML, PDF, RSS/API).
- immutable raw artifacts stored with checksum and metadata.
- parser outputs structured blocks with >95% job success rate.
- promise extraction writes canonical `promise` rows with confidence/model version.
- low-confidence extractions (`<0.75`) create `review_queue` tasks.

### Acceptance Tests

- replay same source URL with unchanged hash creates no duplicate `source_document`.
- extraction job creates deterministic `promise_key` for same text + official.
- failed parse retries up to configured threshold and then dead-letters.

## Phase 2: Evidence Linking + Status Classification

### Must Have

- evidence items generated from newly ingested sources.
- top-N promise linking with confidence + reviewer override flow.
- status classification emitted with explanation and citations.
- policy guardrails enforced:
  - `Kept` requires minimum evidence threshold and tier constraints,
  - conflicting evidence triggers review queue.

### Acceptance Tests

- status cannot transition to `kept` without required citation count.
- reviewer override records audit actor + timestamp.
- `promise_status_history` preserves full state timeline.

## Phase 3: Score + Trending + Publish

### Must Have

- official score projection recomputes on status changes.
- trend signal recomputes daily and on significant events.
- home/profile read models refresh within SLA after recompute events.
- UI receives “last updated” and data source mode indicators.

### Acceptance Tests

- trend score includes all four factors and `formula_version`.
- publish pipeline updates home trending within 15 minutes of recompute.
- rollback path: previous read model version can be restored in <10 minutes.

---

## 8. Operational SLOs

- ingestion freshness (priority jurisdictions): `<= 6h`.
- parse + NLP pipeline completion after fetch: `<= 2h p95`.
- publish latency after recompute event: `<= 15m p95`.
- review queue SLA:
  - high priority resolved `<= 24h`,
  - normal priority resolved `<= 72h`.

---

## 9. Security, Audit, And Compliance

- append-only audit for reviewer decisions and status overrides.
- source license metadata retained per document.
- PII minimization in logs; redact sensitive payload fields.
- signed model/version manifest for each NLP decision path.

---

## 10. Immediate Engineering Tasks

1. create DB migrations for schema sections 3.1-3.4.
2. create topic registry and schema definitions for section 4.
3. scaffold services with health/readiness endpoints.
4. implement mock trend feature calculators with formula versioning.
5. wire read model publisher to existing frontend repository interfaces.
