# MandateScore Sprint 3 Delivery Board

This sprint board follows Sprint 2 and is formatted for Jira/Linear execution with a day-by-day critical path.

## Sprint Metadata

- Sprint Name: `Sprint 3 - Data Completion + Scoring + First Public APIs`
- Sprint Length: `2 weeks`
- Sprint Goal: `Complete seed and status-history mechanics, implement scoring services, and ship first read APIs for search and official profile.`
- In Scope Stories: `MS-202`, `MS-203`, `MS-211`, `MS-212`, `MS-301`, `MS-302`
- Stretch (only if capacity remains): `MS-303` API skeleton (endpoint + contract only)
- Out of Scope: `Public page implementation`, `admin UI`, `promise detail API`, `score history API`

## Capacity Assumptions

- Frontend Engineer: 6 SP (API contract integration support + docs)
- Backend Engineer: 14 SP
- Design System Engineer: 4 SP (contract review and endpoint consumer readiness)
- QA/Automation (shared): 4 SP
- Tech Lead/PM (shared): unpointed reviews, risk management
- Total planned: 36 SP

## Epic Mapping

- `EPIC-20` Schema and Data Operations: `MS-202`, `MS-203`
- `EPIC-21` Scoring Engine: `MS-211`, `MS-212`
- `EPIC-30` Public Read APIs: `MS-301`, `MS-302`

## Story Backlog (Jira/Linear Ready)

### Story: MS-202

- Title: `Seed curated initial data set for 3-5 officials`
- Estimate: `3 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-201`
- Description:
  - Build deterministic seed scripts for officials, terms, promises, sources, and initial statuses.
  - Support easy reset/reload for local and staging validation.
- Acceptance Criteria:
  - Seed script populates complete records for at least 3 officials across different jurisdictions.
  - Seeds are repeatable and idempotent.
  - Seed documentation includes source provenance mapping notes.
- Subtasks:
  - Implement seed fixtures and loader.
  - Add environment-safe seed command (`dev`, `staging`).
  - Add data validation checks post-seed.

### Story: MS-203

- Title: `Enforce append-only status history and audit trail integrity`
- Estimate: `5 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-201`
- Description:
  - Guarantee that status transitions create new records and preserve immutable history.
  - Ensure audit log entries are generated for status and evidence changes.
- Acceptance Criteria:
  - Any status update inserts a new `promise_status_updates` row.
  - Previous status records remain unchanged.
  - Audit entries include actor, timestamp, reason, and entity diff.
- Subtasks:
  - Add service-layer guardrails for immutable transitions.
  - Add DB constraints and write-path tests.
  - Add audit hooks for status and source linkage events.

### Story: MS-211

- Title: `Implement scoring service and snapshot writer`
- Estimate: `5 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-202`, `MS-203`
- Description:
  - Build deterministic weighted scoring calculation and persist snapshots.
  - Use MVP status mapping and denominator semantics.
- Acceptance Criteria:
  - Status score mapping:
    - `kept=1.0`, `compromise=0.7`, `in_progress=0.5`, `stalled=0.2`, `broken=0.0`.
  - `not_started` and `not_yet_rated` excluded from denominator.
  - Snapshot writes include counts and computed score per official term.
  - Unit tests cover edge cases (no rated promises, mixed weights, sparse data).
- Subtasks:
  - Implement scoring calculator module.
  - Implement snapshot persistence service.
  - Add deterministic fixtures and test matrix.

### Story: MS-212

- Title: `Add time-aware trend indicator (on_track/watch/behind)`
- Estimate: `3 SP`
- Owner Role: `Backend Engineer`
- Priority: `P1`
- Dependencies: `MS-211`
- Description:
  - Compute time-normalized trend label based on term elapsed vs weighted progress.
- Acceptance Criteria:
  - Trend logic documented and test-covered.
  - Endpoint consumers can retrieve trend label and supporting metrics.
  - Thresholds configurable via environment/config file.
- Subtasks:
  - Implement trend rule engine.
  - Add config contract for thresholds.
  - Add tests for early/mid/late-term scenarios.

### Story: MS-301

- Title: `Deliver search API with filters and pagination`
- Estimate: `5 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-202`
- Description:
  - Implement `GET /api/search?q=&country=&level=&office=&page=` with ranking and filters.
  - Include stable pagination and typed response contract.
- Acceptance Criteria:
  - Supports text query + filter combinations.
  - Returns predictable paging metadata.
  - Meets baseline response targets for seeded data.
  - Contract test validates response schema.
- Subtasks:
  - Implement query builder and indexing strategy.
  - Add pagination contract and validation.
  - Add endpoint contract tests.

### Story: MS-302

- Title: `Deliver official profile aggregate API`
- Estimate: `5 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-211`, `MS-212`, `MS-202`
- Description:
  - Implement `GET /api/officials/:id` returning profile metadata, term details, score summary, status counts, and trend.
- Acceptance Criteria:
  - Response includes:
    - official identity and office context
    - active term start/end and elapsed metrics
    - score snapshot and status breakdown
    - trend label (`on_track`, `watch`, `behind`)
  - Handles missing/unknown official IDs with typed errors.
  - Endpoint contract and integration tests pass.
- Subtasks:
  - Build profile aggregate query and response mapper.
  - Add not-found and validation error contracts.
  - Add integration tests against seeded data.

## Day-by-Day Critical Path (10 Working Days)

### Week 1

- Day 1:
  - Sprint kickoff and dependency lock.
  - Start `MS-202` and `MS-203` in parallel.
- Day 2:
  - Continue seed fixtures (`MS-202`) and immutable status guardrails (`MS-203`).
  - Draft API response schemas for `MS-301` and `MS-302`.
- Day 3:
  - Complete `MS-202`.
  - Continue `MS-203` tests and audit hooks.
  - Start `MS-301` query layer.
- Day 4:
  - Complete `MS-203`.
  - Continue `MS-301` filter + pagination.
  - Start `MS-211` scoring module.
- Day 5:
  - Complete `MS-301` with contract tests.
  - Continue `MS-211` and snapshot persistence.

### Week 2

- Day 6:
  - Complete `MS-211`.
  - Start `MS-212` trend logic.
  - Start `MS-302` aggregate endpoint scaffold.
- Day 7:
  - Complete `MS-212` with threshold config tests.
  - Continue `MS-302` score/status/trend mapping.
- Day 8:
  - Complete `MS-302` integration tests.
  - Frontend/design-system review of API contracts for upcoming page work.
- Day 9:
  - Buffer for performance tuning and defect fixes.
  - Optional stretch start: `MS-303` endpoint skeleton if all in-scope stories are green.
- Day 10:
  - Sprint hardening, QA signoff, demo prep, and backlog refinement for Sprint 4.

## Dependency Graph (Execution Order)

1. `MS-202` and `MS-203` start first.
2. `MS-301` starts after `MS-202`.
3. `MS-211` starts after `MS-202` and `MS-203`.
4. `MS-212` starts after `MS-211`.
5. `MS-302` starts after `MS-211`, `MS-212`, and `MS-202`.
6. `MS-303` (stretch) starts only if all in-scope stories are complete.

## Suggested Assignment Plan

- Backend Engineer:
  - lead all in-scope stories (`MS-202`, `MS-203`, `MS-211`, `MS-212`, `MS-301`, `MS-302`)
- Frontend Engineer:
  - define and validate response contracts for future UI consumption
  - implement API client typing package for upcoming page stories
- Design System Engineer:
  - ensure API fields support profile and score organisms without one-off data transformations
- QA/Automation:
  - own contract/integration test coverage and regression checks
- Tech Lead/PM:
  - scope control, dependency unblocking, acceptance governance

## Sprint Risks and Mitigation

- Risk: scoring ambiguity due to unresolved policy on unrated promises.
  - Mitigation: lock denominator rule in ADR and tests before coding `MS-211`.
- Risk: seeded data not representative enough for API behavior.
  - Mitigation: include diverse jurisdictions and mixed status distributions in fixtures.
- Risk: aggregate endpoint complexity causes late rework.
  - Mitigation: freeze response contract by Day 3 and review with frontend/design-system.

## Sprint Exit Criteria

- `MS-202`, `MS-203`, `MS-211`, `MS-212`, `MS-301`, `MS-302` closed and accepted.
- Seeded data supports search and profile endpoint validation scenarios.
- Score and trend outputs are deterministic and test-covered.
- Public APIs have stable contracts and integration tests in CI.

## Jira/Linear Import Table (CSV-Friendly)

Use this section to copy into CSV tooling.

```csv
IssueKey,Title,Type,Epic,SP,Priority,OwnerRole,DependsOn
MS-202,Seed curated initial data set for 3-5 officials,Story,EPIC-20,3,P0,Backend Engineer,MS-201
MS-203,Enforce append-only status history and audit trail integrity,Story,EPIC-20,5,P0,Backend Engineer,MS-201
MS-211,Implement scoring service and snapshot writer,Story,EPIC-21,5,P0,Backend Engineer,MS-202|MS-203
MS-212,Add time-aware trend indicator (on_track/watch/behind),Story,EPIC-21,3,P1,Backend Engineer,MS-211
MS-301,Deliver search API with filters and pagination,Story,EPIC-30,5,P0,Backend Engineer,MS-202
MS-302,Deliver official profile aggregate API,Story,EPIC-30,5,P0,Backend Engineer,MS-202|MS-211|MS-212
```
