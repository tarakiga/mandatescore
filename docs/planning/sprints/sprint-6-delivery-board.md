# MandateScore Sprint 6 Delivery Board

This sprint board follows Sprint 5 and is formatted for Jira/Linear execution with launch gates and a day-by-day critical path.

## Sprint Metadata

- Sprint Name: `Sprint 6 - Launch Hardening + Release Readiness`
- Sprint Length: `2 weeks`
- Sprint Goal: `Complete reliability, performance, accessibility, and operational readiness requirements to ship MVP safely.`
- In Scope Stories: `MS-501`, `MS-502`, `MS-503`, `MS-504`, `MS-511`, `MS-512`, `MS-513`
- Stretch (only if capacity remains): post-launch monitoring dashboards v1
- Out of Scope: net-new product features, major schema changes, new UI surfaces not tied to release blockers

## Capacity Assumptions

- Frontend Engineer: 8 SP
- Backend Engineer: 8 SP
- Design System Engineer: 4 SP
- QA/Automation (shared): 8 SP
- DevOps/SRE (shared): 6 SP
- Tech Lead/PM (shared): unpointed launch governance
- Total planned: 44 SP

## Epic Mapping

- `EPIC-50` Reliability, Performance, Accessibility: `MS-501`, `MS-502`, `MS-503`, `MS-504`
- `EPIC-51` Release Readiness: `MS-511`, `MS-512`, `MS-513`

## Story Backlog (Jira/Linear Ready)

### Story: MS-501

- Title: `Implement CDN + API cache strategy for public read paths`
- Estimate: `3 SP`
- Owner Role: `Backend Engineer + DevOps/SRE`
- Priority: `P0`
- Dependencies: `MS-301`, `MS-302`, `MS-303`, `MS-304`, `MS-305`
- Description:
  - Configure cache headers, CDN behavior, and invalidation triggers for high-read endpoints.
- Acceptance Criteria:
  - Public read endpoints return explicit cache-control policy.
  - Invalidation strategy exists for curation updates that affect public data.
  - Cache behavior documented and validated in staging.
- Subtasks:
  - Define cache TTL and stale-while-revalidate policy.
  - Implement invalidation on status/promise update events.
  - Add staging verification checklist.

### Story: MS-502

- Title: `Tune DB indexes and query plans for key search/profile paths`
- Estimate: `3 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-501`
- Description:
  - Add/adjust indexes and optimize hot queries for search, profile, and promise reads.
- Acceptance Criteria:
  - p95 latency target met for key endpoints in staging load profile.
  - Query plan review stored in docs with before/after comparison.
  - No regression in write-path behavior from index additions.
- Subtasks:
  - Profile query plans and identify hotspots.
  - Apply index and query optimization changes.
  - Run performance comparison and record outcomes.

### Story: MS-503

- Title: `Run WCAG 2.1 AA audit and remediate critical/high accessibility issues`
- Estimate: `5 SP`
- Owner Role: `Frontend Engineer + Design System Engineer + QA`
- Priority: `P0`
- Dependencies: `MS-401`, `MS-402`, `MS-412`, `MS-413`, `MS-414`
- Description:
  - Perform accessibility audit across public and admin critical flows.
  - Fix critical/high findings before launch.
- Acceptance Criteria:
  - Keyboard navigation passes for all critical flows.
  - Focus management and ARIA semantics pass for custom components.
  - Documented audit report with zero unresolved critical issues.
- Subtasks:
  - Run automated and manual a11y checks.
  - Fix focus order, labels, landmarks, and contrast issues.
  - Retest and publish final audit status.

### Story: MS-504

- Title: `Execute backup/restore and disaster recovery rehearsal`
- Estimate: `3 SP`
- Owner Role: `DevOps/SRE + Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-201`, deployment pipeline readiness
- Description:
  - Validate backup/restore process and recovery objectives in non-prod environment.
- Acceptance Criteria:
  - Successful restore test from backup snapshot.
  - RPO/RTO targets documented and tested.
  - Runbook contains step-by-step recovery workflow.
- Subtasks:
  - Configure backup schedules and retention policies.
  - Run restore drill and capture timings.
  - Publish DR runbook and lessons learned.

### Story: MS-511

- Title: `Finalize production environment configuration and secrets policy`
- Estimate: `2 SP`
- Owner Role: `DevOps/SRE`
- Priority: `P0`
- Dependencies: baseline infra and deployment pipeline
- Description:
  - Confirm environment matrix and secret handling across dev/staging/prod.
- Acceptance Criteria:
  - Environment variables and secret ownership documented.
  - No plaintext secrets in repo or CI logs.
  - Production config parity checks complete.
- Subtasks:
  - Review env contracts and secret stores.
  - Add config validation checks in CI/CD.
  - Document ownership and rotation policy.

### Story: MS-512

- Title: `Create launch checklist and operational runbook`
- Estimate: `2 SP`
- Owner Role: `Tech Lead/PM + DevOps/SRE`
- Priority: `P0`
- Dependencies: `MS-501`, `MS-502`, `MS-503`, `MS-504`, `MS-511`
- Description:
  - Build release-day checklist and operational procedures for incidents/rollback.
- Acceptance Criteria:
  - Checklist covers preflight, deployment, smoke test, rollback, and communications.
  - Runbook includes incident severity matrix and escalation contacts.
  - Dry run completed in staging.
- Subtasks:
  - Draft launch sequence and decision checkpoints.
  - Draft rollback and incident handling sections.
  - Run tabletop simulation and update docs.

### Story: MS-513

- Title: `Produce UAT signoff package mapped to PRD requirements`
- Estimate: `2 SP`
- Owner Role: `QA/Automation + PM`
- Priority: `P1`
- Dependencies: completion of in-scope sprint work
- Description:
  - Prepare stakeholder signoff package with requirement traceability.
- Acceptance Criteria:
  - Test evidence mapped to MVP requirements and milestones.
  - Open defects triaged with go/no-go recommendation.
  - Formal signoff record captured.
- Subtasks:
  - Build requirement-to-test matrix.
  - Compile evidence screenshots/logs/results.
  - Collect stakeholder signoffs.

## Day-by-Day Critical Path (10 Working Days)

### Week 1

- Day 1:
  - Sprint kickoff and launch-risk review.
  - Start `MS-501`, `MS-511`, and `MS-503` baseline audit.
- Day 2:
  - Continue cache strategy (`MS-501`) and secrets/config policy (`MS-511`).
  - Continue accessibility findings triage (`MS-503`).
  - Start query profiling for `MS-502`.
- Day 3:
  - Complete `MS-511`.
  - Continue `MS-501` and `MS-502`.
  - Begin accessibility remediations (`MS-503`).
- Day 4:
  - Complete `MS-501`.
  - Continue `MS-502` performance tuning.
  - Continue `MS-503` remediation and retest.
- Day 5:
  - Complete `MS-502`.
  - Start `MS-504` DR rehearsal prep.
  - Continue `MS-503`.

### Week 2

- Day 6:
  - Execute backup/restore drill for `MS-504`.
  - Continue/close accessibility remediations `MS-503`.
- Day 7:
  - Complete `MS-504`.
  - Start `MS-512` launch checklist and runbook draft.
- Day 8:
  - Complete `MS-503` audit signoff.
  - Continue `MS-512` with staging dry run.
  - Start `MS-513` signoff package assembly.
- Day 9:
  - Complete `MS-512`.
  - Complete `MS-513`.
  - Go/No-go pre-read prepared for stakeholders.
- Day 10:
  - Final defect triage, launch gate review, and release decision.

## Dependency Graph (Execution Order)

1. `MS-501`, `MS-511`, and `MS-503` start first.
2. `MS-502` starts as soon as baseline perf data is collected and can overlap with `MS-501`.
3. `MS-504` starts after environment and backup policies are confirmed.
4. `MS-512` starts after hardening stories are near completion.
5. `MS-513` starts once evidence is available from test/hardening outputs.

## Launch Gates (Must Pass)

- Gate 1: performance targets met for critical public endpoints.
- Gate 2: zero critical accessibility issues unresolved.
- Gate 3: backup/restore drill successful within RPO/RTO targets.
- Gate 4: secrets/config validation complete with no policy violations.
- Gate 5: rollback plan tested and documented.
- Gate 6: stakeholder UAT signoff captured.

## Suggested Assignment Plan

- Backend Engineer:
  - lead `MS-501`, `MS-502`, support `MS-504`
- Frontend Engineer:
  - lead remediation for `MS-503` on public/admin UI
- Design System Engineer:
  - support `MS-503` fixes in reusable components and prevent one-off patches
- QA/Automation:
  - lead `MS-503` audit execution and `MS-513` evidence pack
- DevOps/SRE:
  - lead `MS-504`, `MS-511`, co-own `MS-512`
- Tech Lead/PM:
  - lead `MS-512`, launch governance, go/no-go process

## Sprint Risks and Mitigation

- Risk: late accessibility findings force broad refactors.
  - Mitigation: prioritize critical flows first and fix at component-library level.
- Risk: performance tuning reveals schema/query debt.
  - Mitigation: reserve Day 9 buffer and predefine acceptable fallback strategies.
- Risk: operational docs lag behind technical completion.
  - Mitigation: start `MS-512` drafting mid-sprint, not end-of-sprint.

## Sprint Exit Criteria

- `MS-501`, `MS-502`, `MS-503`, `MS-504`, `MS-511`, `MS-512`, `MS-513` closed and accepted.
- All launch gates passed.
- Release checklist and rollback runbook approved.
- Formal go/no-go decision documented.

## Jira/Linear Import Table (CSV-Friendly)

Use this section to copy into CSV tooling.

```csv
IssueKey,Title,Type,Epic,SP,Priority,OwnerRole,DependsOn
MS-501,Implement CDN + API cache strategy for public read paths,Story,EPIC-50,3,P0,Backend Engineer + DevOps/SRE,MS-301|MS-302|MS-303|MS-304|MS-305
MS-502,Tune DB indexes and query plans for key search/profile paths,Story,EPIC-50,3,P0,Backend Engineer,MS-501
MS-503,Run WCAG 2.1 AA audit and remediate critical/high accessibility issues,Story,EPIC-50,5,P0,Frontend Engineer + Design System Engineer + QA,MS-401|MS-402|MS-412|MS-413|MS-414
MS-504,Execute backup/restore and disaster recovery rehearsal,Story,EPIC-50,3,P0,DevOps/SRE + Backend Engineer,MS-201
MS-511,Finalize production environment configuration and secrets policy,Story,EPIC-51,2,P0,DevOps/SRE,
MS-512,Create launch checklist and operational runbook,Story,EPIC-51,2,P0,Tech Lead/PM + DevOps/SRE,MS-501|MS-502|MS-503|MS-504|MS-511
MS-513,Produce UAT signoff package mapped to PRD requirements,Story,EPIC-51,2,P1,QA/Automation + PM,MS-501|MS-502|MS-503|MS-504|MS-512
```
