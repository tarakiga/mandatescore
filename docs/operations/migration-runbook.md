# Migration Runbook

This runbook executes and verifies the full ingestion/NLP migration chain (`001`-`012`) with rollback checks.

Related docs:

- [migration-checklist.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/operations/migration-checklist.md)
- [ingestion-nlp-blueprint.md](file:///d:/work/Tar/PROJECTS/MandateScore/docs/operations/ingestion-nlp-blueprint.md)
- [db-migration-smoke.ps1](file:///d:/work/Tar/PROJECTS/MandateScore/scripts/db-migration-smoke.ps1)

## 1. Preconditions

- PostgreSQL 16+ is reachable.
- `psql` client is installed and available in PATH.
- `DATABASE_URL` points to a disposable DB for smoke tests.

## 2. Local Smoke Test (PowerShell)

```powershell
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/mandatescore_ci"
.\scripts\db-migration-smoke.ps1 -MigrationPath db/migrations
```

Expected outcome:

- applies all forward migrations,
- validates table + constraint presence,
- applies full rollback chain,
- verifies baseline table removal after rollback,
- re-applies full forward chain successfully.

## 3. CI Smoke Gate

Workflow:

- [migration-smoke.yml](file:///d:/work/Tar/PROJECTS/MandateScore/.github/workflows/migration-smoke.yml)

Trigger conditions:

- pull requests touching:
  - `db/migrations/**`
  - `scripts/db-migration-smoke.ps1`
  - workflow file itself

## 4. Pre-Production Checklist

- Confirm migration order in checklist matches committed filenames.
- Run smoke script on staging snapshot.
- Capture evidence:
  - command output
  - constraint/table validation output
  - migration timing
- Confirm rollback checkpoints:
  - after `006` (core domain + projection safety point)
  - after `009` (outbox introduction)
  - full rollback to pre-`001` baseline

## 5. Production Execution Pattern

1. Announce maintenance window (if required).
2. Run DB backup/snapshot.
3. Apply migrations in order (`001` -> `012`) using migration tool.
4. Run post-migration validation SQL:
   - table presence (`official_profile_view`, `event_outbox`, etc.)
   - key constraint presence (`chk_review_queue_state`, `chk_source_document_parse_status`)
5. Verify app repository read/write smoke calls.
6. If validation fails, execute rollback plan from latest safe checkpoint.

## 6. Incident Rollback Playbook

- Partial failure after migration `N`:
  - stop writers,
  - apply rollback scripts from `N.down` down to chosen checkpoint,
  - re-run validation queries,
  - restore snapshot if data integrity is uncertain.

- Outbox-related failure:
  - disable outbox publisher consumer,
  - keep transactional writes active if core schema is healthy,
  - resume consumer after fix + backfill.
