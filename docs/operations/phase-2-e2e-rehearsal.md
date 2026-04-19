# Phase 2 E2E Rehearsal

This runbook validates the Phase 2 ingestion workflow in Postgres mode:

1. status classification
2. score/trend recompute publishing
3. read-model refresh worker
4. monitoring metrics availability

## Preconditions

- PostgreSQL is reachable.
- `DATABASE_URL` points to a disposable rehearsal database.
- `psql` exists in PATH.

## One-Command Rehearsal

```powershell
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/mandatescore_ci"
.\scripts\phase2-e2e-rehearsal.ps1
```

The script performs:

- migration smoke (`001`..`012`, rollback, replay),
- typecheck,
- focused rehearsal test:
  - [phase2-e2e-rehearsal.test.ts](file:///d:/work/Tar/PROJECTS/MandateScore/lib/ingestion/services/phase2-e2e-rehearsal.test.ts)

## CI Gate

Workflow:

- [phase2-e2e-rehearsal.yml](file:///d:/work/Tar/PROJECTS/MandateScore/.github/workflows/phase2-e2e-rehearsal.yml)

Trigger conditions:

- pull requests touching ingestion APIs/services/migrations/rehearsal script
- manual `workflow_dispatch`

## Verification Endpoints

- [status-classify](file:///d:/work/Tar/PROJECTS/MandateScore/app/api/ingestion/status-classify/route.ts)
- [publish-refresh](file:///d:/work/Tar/PROJECTS/MandateScore/app/api/ingestion/publish-refresh/route.ts)
- [read-models](file:///d:/work/Tar/PROJECTS/MandateScore/app/api/ingestion/read-models/route.ts)
- [metrics](file:///d:/work/Tar/PROJECTS/MandateScore/app/api/ingestion/metrics/route.ts)

## Success Criteria

- focused rehearsal test passes,
- read-model snapshot endpoint returns non-empty `homeTrending` and `officialProfiles`,
- metrics endpoint reports:
  - `publish.total > 0`
  - `classifier.total > 0`

## Release Gate

Before production rollout, complete:

- [phase-2-release-readiness-checklist.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/operations/phase-2-release-readiness-checklist.md)
