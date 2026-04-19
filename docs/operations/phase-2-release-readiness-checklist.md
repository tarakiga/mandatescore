# Phase 2 Release Readiness Checklist

Use this checklist before promoting Phase 2 ingestion/classification flows to production.

## 1) Environment Readiness

- [ ] `DATABASE_URL` configured for target environment.
- [ ] `INGESTION_DATA_STORE=postgres` configured.
- [ ] `INGESTION_EVENT_STORE=postgres` configured.
- [ ] Postgres access validated from app runtime.
- [ ] Backup/snapshot policy confirmed.

## 2) Schema & Migration Safety

- [ ] Migration smoke passes locally and in CI.
- [ ] Staging migration rehearsal completed (`001`..`012`, rollback, replay).
- [ ] Constraint checks pass (`review_queue`, `status_history`, parse status checks).
- [ ] `event_outbox` table healthy and index checks verified.

## 3) Pipeline Functional Validation

- [ ] `status-classify` path returns decisions with confidence/explanation/citations/guardrail.
- [ ] Guardrail downgrades from `kept` to `in_progress` verified on low-quality evidence.
- [ ] Review queue receives `policy_guardrail` and `low_confidence` tasks as expected.
- [ ] Score/trend events publish after status computation.
- [ ] `publish.refresh_requested.v1` -> read-model refresh -> `publish.completed.v1` verified.

## 4) Read-Model Integrity

- [ ] `home_trending_view` has refreshed rows for target officials.
- [ ] `home_updates_view` has recent status updates.
- [ ] `official_profile_view` matches source profile totals and labels.
- [ ] Data projection version and refreshed timestamps are current.

## 5) Observability & SLO Baseline

- [ ] `/api/ingestion/metrics` reachable in staging.
- [ ] DLQ rate baseline captured and reviewed.
- [ ] Classifier confidence bucket distribution captured.
- [ ] Publish latency p95 baseline captured.
- [ ] Alert thresholds documented for DLQ spikes and latency regressions.

## 6) CI/CD Gates

- [ ] `migration-smoke.yml` passing.
- [ ] `phase2-e2e-rehearsal.yml` passing.
- [ ] `npm run typecheck`, `npm run test:unit`, and `npm run lint` passing.

## 7) Cutover Approval

- [ ] Product/Tech Lead sign-off received.
- [ ] On-call owner assigned for first release window.
- [ ] Rollback owner assigned and rollback plan rehearsed.
- [ ] Deployment communication plan posted.

## 8) Post-Deploy Verification

- [ ] First production classification cycle completes successfully.
- [ ] Read models refresh on schedule.
- [ ] No unexpected DLQ surge in first 30 minutes.
- [ ] Dashboard and API samples spot-checked.
- [ ] Retro notes captured for Phase 2 stabilization.

## 9) 10-Minute Staging Run

Use this command for a fast pre-release smoke:

```powershell
.\scripts\phase2-staging-quickcheck.ps1 -BaseUrl http://localhost:3000
```

Expected output:

- `Phase 2 staging quickcheck passed.`
- summary line with `publish.total`, `deadLetterRate`, and `classifier.total`
