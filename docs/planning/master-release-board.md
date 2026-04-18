# MandateScore Master Release Board

This is the single execution tracker that links all sprint boards and gives one place to manage status, risk, and go-live readiness.

## 1) Source Sprint Boards

- Sprint 1: `jira/sprint-1-delivery-board.md`
- Sprint 2: `docs/planning/sprints/sprint-2-delivery-board.md`
- Sprint 3: `docs/planning/sprints/sprint-3-delivery-board.md`
- Sprint 4: `docs/planning/sprints/sprint-4-delivery-board.md`
- Sprint 5: `docs/planning/sprints/sprint-5-delivery-board.md`
- Sprint 6: `docs/planning/sprints/sprint-6-delivery-board.md`

## 2) Milestone Rollup Tracker

Use this table as the top-level release dashboard.

| Milestone | Scope | Planned Sprint | Owner | Status | Target Date | Exit Criteria | Notes |
|---|---|---|---|---|---|---|---|
| M1 Foundation Complete | `MS-001`, `MS-002`, `MS-003`, `MS-004` | Sprint 1 | Tech Lead | Not Started | TBD | CI + standards + budgets active |  |
| M2 Design System Ready | `MS-101`, `MS-102`, `MS-103`, `MS-111`, `MS-112`, `MS-113`, `MS-114`, `MS-115` | Sprint 1-2 | Design System Lead | Not Started | TBD | Tokenized components + docs + no native widgets |  |
| M3 Data + Scoring Core | `MS-201`, `MS-202`, `MS-203`, `MS-211`, `MS-212` | Sprint 2-3 | Backend Lead | Not Started | TBD | Schema + seed + deterministic scoring/trend |  |
| M4 Public MVP Ready | `MS-301`, `MS-302`, `MS-303`, `MS-304`, `MS-305`, `MS-401`, `MS-402` | Sprint 3-4 | Frontend + Backend | Not Started | TBD | Search/profile functional with stable contracts |  |
| M5 Admin MVP Ready | `MS-311`, `MS-312`, `MS-313`, `MS-314`, `MS-411`, `MS-412`, `MS-413`, `MS-414` | Sprint 5 | Admin Track Leads | Not Started | TBD | RBAC, curation workflows, audit visibility |  |
| M6 Launch Ready | `MS-501`, `MS-502`, `MS-503`, `MS-504`, `MS-511`, `MS-512`, `MS-513` | Sprint 6 | Release Manager | Not Started | TBD | All launch gates passed |  |

## 3) Story Status Master Table

Track each story from all sprints in one place.

| Story | Sprint | Epic | Owner | Priority | Status | Start Date | End Date | Dependency Health | Risk | Blocked By | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MS-001 | S1 | EPIC-00 |  | P0 | Todo |  |  | Green | Low |  |  |
| MS-002 | S1 | EPIC-00 |  | P0 | Todo |  |  | Green | Low | MS-001 |  |
| MS-003 | S1 | EPIC-00 |  | P1 | Todo |  |  | Green | Low | MS-001 |  |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| MS-513 | S6 | EPIC-51 |  | P1 | Todo |  |  | Green | Medium | MS-512 |  |

Status values:
- `Todo`
- `In Progress`
- `Blocked`
- `In Review`
- `Done`

Dependency health values:
- `Green` (no active dependency risk)
- `Amber` (at least one dependency slipping)
- `Red` (blocked by unmet dependency)

## 4) Release KPI Panel

Use these KPIs for weekly steering.

| KPI | Definition | Target |
|---|---|---|
| Story Completion % | `Done Stories / Total Stories` | >= 90% by end of each sprint |
| Milestone Completion % | `Done Milestones / 6` | 100% before go-live |
| Blocked Story Ratio | `Blocked Stories / In Progress Stories` | < 15% |
| Escaped Critical Defects | Critical bugs found after sprint close | 0 |
| Accessibility Critical Findings | Open critical a11y findings | 0 before launch |
| Launch Gate Pass Count | Passed launch gates / 6 | 6/6 before go-live |

## 5) Spreadsheet Formula Pack

If you mirror this board into Excel/Google Sheets, these formulas can be used directly.

Assume:
- `Status` is column `F`
- `Risk` is column `J`
- data starts on row `2`

Completion rate:

```text
=COUNTIF(F:F,"Done")/COUNTA(A:A)
```

Blocked ratio:

```text
=COUNTIF(F:F,"Blocked")/MAX(1,COUNTIF(F:F,"In Progress"))
```

High-risk count:

```text
=COUNTIF(J:J,"High")
```

On-time delivery ratio (if End Date in `H`, Target Date in another table):
- Keep this metric per sprint/milestone sheet where target date exists.

## 6) Weekly Operating Cadence

- Monday: dependency/risk review, sprint commitment check.
- Wednesday: architecture + quality checkpoint (a11y/perf/contract tests).
- Friday: demo, blockers closeout, milestone status update.
- End of sprint: milestone gate decision and backlog carryover approval.

## 7) Launch Gate Checklist (Final Go/No-Go)

- [ ] Gate 1: Performance targets met for critical public endpoints.
- [ ] Gate 2: Zero unresolved critical accessibility issues.
- [ ] Gate 3: Backup/restore rehearsal passed within RPO/RTO.
- [ ] Gate 4: Secrets/config policy validated and compliant.
- [ ] Gate 5: Rollback and incident runbook tested.
- [ ] Gate 6: Stakeholder UAT signoff complete.

## 8) Immediate Next Actions

- Create a single Jira/Linear initiative: `MandateScore MVP Release`.
- Attach sprint boards `S1` to `S6` as child cycles.
- Import CSV tables from each sprint board and map to one workflow.
- Appoint milestone owners for `M1` to `M6`.
- Start Sprint 1 and update this file at end of Week 1 with first real status data.
