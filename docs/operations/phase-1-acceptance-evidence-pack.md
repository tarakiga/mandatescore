# Phase 1 Acceptance Evidence Pack

## Scope

This evidence pack validates completion of `MS-IN-101` through `MS-IN-108` for Phase 1.

References:

- [phase-1-ingestion-nlp-execution-board.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/planning/sprints/phase-1-ingestion-nlp-execution-board.md)
- [ingestion-nlp-blueprint.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/operations/ingestion-nlp-blueprint.md)
- [migration-runbook.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/operations/migration-runbook.md)

## Criteria To Evidence Matrix

| Gate | Requirement | Evidence |
|---|---|---|
| Gate 1 | migrations + rollback validated | `db/migrations/001..012` implemented + smoke script + CI workflow |
| Gate 2 | queue contracts enforced | `queue-topic-contracts.json` + runtime validator in `lib/ingestion/events/contract-validator.ts` |
| Gate 3 | parser pipeline baseline | parser service + tests in `lib/ingestion/services/parser-service.ts` and `parser-service.test.ts` |
| Gate 4 | extraction includes confidence/model provenance | extraction service and route + tests (`extract-v1`, confidence fields) |
| Gate 5 | low-confidence routes to review | `extract-promises` route and review APIs + behavior tests |
| Gate 6 | evidence pack + go/no-go | this document + recommendation section below |

## Test Evidence Snapshot

- Type safety: `npm run typecheck` passes
- Unit tests: `npm run test:unit` passes
- Lint: `npm run lint` passes

## Delivered Artifacts

- Ingestion services + API skeletons:
  - `source-discovery`, `fetcher`, `parser`, `promise-extraction`, `evidence-linker`
- Event envelope and topic validation:
  - envelope, topics, contract validator, publisher, DLQ path
- Review workflow:
  - task listing and decision endpoints
- Migration and operational tooling:
  - SQL migrations `001`-`012`
  - migration smoke script + CI workflow

## Go/No-Go Recommendation

- Recommendation: `GO` for Phase 2
- Conditions:
  - keep `INGESTION_DATA_STORE=postgres` in staging and validate end-to-end write paths
  - monitor dead-letter rate from ingestion event publisher
  - complete Phase 2 status classifier integration before production exposure
