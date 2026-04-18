# MandateScore Phase 1 Execution Board (Ingestion + NLP Foundation)

This board is mapped to the existing sprint format used in:

- [implementation-execution-board.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/planning/implementation-execution-board.md)
- [sprint-6-delivery-board.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/planning/sprints/sprint-6-delivery-board.md)
- [ingestion-nlp-blueprint.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/operations/ingestion-nlp-blueprint.md)

## Sprint Metadata

- Sprint Name: `Phase 1 - Ingestion Backbone + Promise Extraction`
- Sprint Length: `2 weeks`
- Sprint Goal: `Stand up ingestion/parsing/extraction/review foundations with auditable contracts and migration safety.`
- In Scope Stories: `MS-IN-101` to `MS-IN-108`
- Out of Scope: full status classification automation, trend scoring productionization, multilingual expansion

## Capacity Assumptions

- Backend Engineer: 10 SP
- Data/NLP Engineer: 10 SP
- DevOps/SRE: 5 SP
- QA/Automation: 6 SP
- Tech Lead/PM: unpointed governance
- Total planned: 31 SP

## Epic Mapping

- `EPIC-IN-10` Ingestion Platform: `MS-IN-101`, `MS-IN-102`, `MS-IN-103`
- `EPIC-IN-11` Parsing + Extraction: `MS-IN-104`, `MS-IN-105`, `MS-IN-106`
- `EPIC-IN-12` Review + Publish Foundation: `MS-IN-107`, `MS-IN-108`

## Story Backlog (Jira/Linear Ready)

### Story: MS-IN-101

- Title: `Create ingestion DB migrations 001-012 and rollback scripts`
- Estimate: `5 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: none
- Description:
  - Implement SQL migrations listed in [migration-checklist.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/operations/migration-checklist.md).
- Acceptance Criteria:
  - All up/down migrations execute in staging without manual patching.
  - Migration checksums are tracked in migration tool state.
  - Core tables from blueprint sections 3.1-3.4 are present.
- Subtasks:
  - Author `001`-`012` up/down scripts.
  - Run migration replay test on clean and partially-migrated DBs.
  - Publish migration runbook.

### Story: MS-IN-102

- Title: `Implement queue topic schemas and schema registry checks`
- Estimate: `3 SP`
- Owner Role: `Backend Engineer + DevOps/SRE`
- Priority: `P0`
- Dependencies: `MS-IN-101`
- Description:
  - Enforce message contracts using [queue-topic-contracts.json](file:///d:/work/Tar/PROJECTS/MandateScore/docs/operations/queue-topic-contracts.json).
- Acceptance Criteria:
  - Producer/consumer contract tests validate required fields for all topics.
  - Invalid payloads fail CI contract check.
- Subtasks:
  - Add schema validation utility.
  - Add per-topic fixture tests.
  - Wire CI step for schema validation.

### Story: MS-IN-103

- Title: `Scaffold ingestion services and event flow skeleton`
- Estimate: `3 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-IN-102`
- Description:
  - Create service skeletons (`source-discovery`, `fetcher`, `parser`) with health/readiness and queue wiring.
- Acceptance Criteria:
  - Services boot in staging and emit traceable event envelope metadata.
  - Dead-letter path configured for malformed events.
- Subtasks:
  - Scaffold services.
  - Add shared event envelope library.
  - Configure DLQ policy.

### Story: MS-IN-104

- Title: `Implement parser pipeline for HTML/PDF with normalized block output`
- Estimate: `5 SP`
- Owner Role: `Data/NLP Engineer`
- Priority: `P0`
- Dependencies: `MS-IN-103`
- Description:
  - Convert raw artifacts into `parsed_document_block`.
- Acceptance Criteria:
  - Parser success rate >= 95% on pilot corpus.
  - Block ordering and section paths are deterministic.
- Subtasks:
  - HTML extractor.
  - PDF text/OCR fallback parser.
  - Parser quality metrics instrumentation.

### Story: MS-IN-105

- Title: `Implement promise extraction v1 with confidence + rationale`
- Estimate: `5 SP`
- Owner Role: `Data/NLP Engineer`
- Priority: `P0`
- Dependencies: `MS-IN-104`
- Description:
  - Extract canonical promises and write to `promise`.
- Acceptance Criteria:
  - Every extracted promise includes `promise_key`, confidence, and model version.
  - Low-confidence records (`<0.75`) create review tasks.
- Subtasks:
  - Prompt/rule hybrid extraction pipeline.
  - Canonical key generation.
  - Confidence threshold routing.

### Story: MS-IN-106

- Title: `Implement evidence creation and provisional linking candidate generation`
- Estimate: `4 SP`
- Owner Role: `Data/NLP Engineer`
- Priority: `P1`
- Dependencies: `MS-IN-105`
- Description:
  - Create `evidence_item` rows and preliminary promise link candidates.
- Acceptance Criteria:
  - `evidence.created.v1` and `promise.evidence_linked.v1` events emitted.
  - Candidate links carry confidence and review flag.
- Subtasks:
  - Evidence type classifier.
  - Retrieval-based candidate matcher.
  - Link confidence scorer.

### Story: MS-IN-107

- Title: `Build review queue API + minimal adjudication workflow`
- Estimate: `4 SP`
- Owner Role: `Backend Engineer + QA`
- Priority: `P0`
- Dependencies: `MS-IN-105`
- Description:
  - Create review endpoints for open task fetch and decision writeback.
- Acceptance Criteria:
  - Reviewer decision appends audit trail and updates queue state.
  - Conflict/low-confidence entities are visible in queue.
- Subtasks:
  - GET/POST review endpoints.
  - Decision persistence and audit checks.
  - QA regression scenarios.

### Story: MS-IN-108

- Title: `Publish read-model bootstrap + Phase 1 acceptance evidence pack`
- Estimate: `2 SP`
- Owner Role: `QA/Automation + Tech Lead/PM`
- Priority: `P1`
- Dependencies: `MS-IN-101`..`MS-IN-107`
- Description:
  - Validate phase outcomes against blueprint acceptance criteria.
- Acceptance Criteria:
  - Evidence package maps each acceptance criterion to test output.
  - Go/No-go recommendation documented.
- Subtasks:
  - Build criteria-to-test matrix.
  - Capture logs/screenshots/query outputs.
  - Publish signoff note.

## Day-by-Day Critical Path (10 Working Days)

### Week 1

- Day 1:
  - Start `MS-IN-101`, `MS-IN-102`.
- Day 2:
  - Continue migrations/contracts.
  - Start `MS-IN-103` service scaffolding.
- Day 3:
  - Complete `MS-IN-101`.
  - Continue `MS-IN-103`.
  - Start parser implementation (`MS-IN-104`).
- Day 4:
  - Complete `MS-IN-102`.
  - Continue `MS-IN-104`.
- Day 5:
  - Continue `MS-IN-104`.
  - Start promise extraction (`MS-IN-105`) setup.

### Week 2

- Day 6:
  - Complete `MS-IN-104`.
  - Continue `MS-IN-105`.
- Day 7:
  - Continue `MS-IN-105`.
  - Start `MS-IN-107` review API.
- Day 8:
  - Start `MS-IN-106` evidence/link candidates.
  - Continue `MS-IN-107`.
- Day 9:
  - Complete `MS-IN-106` and `MS-IN-107`.
  - Start `MS-IN-108` evidence pack.
- Day 10:
  - Complete `MS-IN-108`.
  - Phase gate review and Go/No-go decision for Phase 2.

## Dependency Graph (Execution Order)

1. `MS-IN-101` -> `MS-IN-102` -> `MS-IN-103`
2. `MS-IN-103` -> `MS-IN-104` -> `MS-IN-105`
3. `MS-IN-105` enables `MS-IN-107`
4. `MS-IN-105` + `MS-IN-104` enable `MS-IN-106`
5. `MS-IN-108` depends on all prior stories

## Phase 1 Gates (Must Pass)

- Gate 1: all migrations and rollbacks validated in staging.
- Gate 2: queue contracts enforced in CI for all v1 topics.
- Gate 3: parser success >= 95% on pilot corpus.
- Gate 4: promise extraction writes confidence/model provenance.
- Gate 5: low-confidence tasks route to review queue.
- Gate 6: acceptance evidence pack completed and signed.

## Sprint Exit Criteria

- `MS-IN-101`..`MS-IN-108` closed and accepted.
- All Phase 1 gates passed.
- Hand-off checklist for Phase 2 (status classifier + scoring) approved.

## Jira/Linear Import Table (CSV-Friendly)

```csv
IssueKey,Title,Type,Epic,SP,Priority,OwnerRole,DependsOn
MS-IN-101,Create ingestion DB migrations 001-012 and rollback scripts,Story,EPIC-IN-10,5,P0,Backend Engineer,
MS-IN-102,Implement queue topic schemas and schema registry checks,Story,EPIC-IN-10,3,P0,Backend Engineer + DevOps/SRE,MS-IN-101
MS-IN-103,Scaffold ingestion services and event flow skeleton,Story,EPIC-IN-10,3,P0,Backend Engineer,MS-IN-102
MS-IN-104,Implement parser pipeline for HTML/PDF with normalized block output,Story,EPIC-IN-11,5,P0,Data/NLP Engineer,MS-IN-103
MS-IN-105,Implement promise extraction v1 with confidence + rationale,Story,EPIC-IN-11,5,P0,Data/NLP Engineer,MS-IN-104
MS-IN-106,Implement evidence creation and provisional linking candidate generation,Story,EPIC-IN-11,4,P1,Data/NLP Engineer,MS-IN-105
MS-IN-107,Build review queue API + minimal adjudication workflow,Story,EPIC-IN-12,4,P0,Backend Engineer + QA,MS-IN-105
MS-IN-108,Publish read-model bootstrap + Phase 1 acceptance evidence pack,Story,EPIC-IN-12,2,P1,QA/Automation + Tech Lead/PM,MS-IN-101|MS-IN-102|MS-IN-103|MS-IN-104|MS-IN-105|MS-IN-106|MS-IN-107
```
