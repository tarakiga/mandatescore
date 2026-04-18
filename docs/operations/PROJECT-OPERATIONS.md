# MandateScore Project Operations Index

This index provides one place to find all planning, execution, and import automation artifacts.

## Core Product Docs

- PRD: `docs/product/mandatescore-prd.md`
- Agent profile and implementation constraints: `docs/product/code-agent.md`

## Planning and Roadmap Docs

- Implementation board (full roadmap): `docs/planning/implementation-execution-board.md`
- Master release tracker: `docs/planning/master-release-board.md`

## Sprint Boards

- Sprint 1: `jira/sprint-1-delivery-board.md`
- Sprint 2: `docs/planning/sprints/sprint-2-delivery-board.md`
- Sprint 3: `docs/planning/sprints/sprint-3-delivery-board.md`
- Sprint 4: `docs/planning/sprints/sprint-4-delivery-board.md`
- Sprint 5: `docs/planning/sprints/sprint-5-delivery-board.md`
- Sprint 6: `docs/planning/sprints/sprint-6-delivery-board.md`

## Import and Mapping Files

- Master story import CSV: `jira/mandatescore-master-import.csv`
- Dependency edge CSV: `jira/mandatescore-dependency-edges.csv`
- Jira link import CSV: `jira/mandatescore-jira-link-import.csv`
- Jira/Linear mapping guide: `jira/jira-linear-import-mapping-guide.md`
- Jira KAN import playbook: `jira/jira-kan-import-playbook.md`
- Jira KAN epics import CSV: `jira/mandatescore-kan-epics-import.csv`
- Jira KAN tasks import CSV: `jira/mandatescore-kan-tasks-import.csv`

## Automation Scripts

- Scripts usage guide: `scripts/README.md`
- Build dependency edges (PowerShell): `scripts/build_dependency_edges.ps1`
- Build dependency edges (Python): `scripts/build_dependency_edges.py`
- Build Jira link import CSV (PowerShell): `scripts/build_jira_link_import.ps1`

## Standard Execution Sequence

1. Import stories:
   - Use `jira/mandatescore-master-import.csv`.
2. Generate dependency edges:
   - Run `scripts/build_dependency_edges.ps1`.
3. Generate Jira link CSV:
   - Run `scripts/build_jira_link_import.ps1`.
4. Import links:
   - Use `jira/mandatescore-jira-link-import.csv`.
5. Start Sprint 1:
   - Follow `jira/sprint-1-delivery-board.md`.

## Quick Commands (PowerShell)

From repo root:

```powershell
.\scripts\build_dependency_edges.ps1 `
  -InputPath jira/mandatescore-master-import.csv `
  -OutputPath jira/mandatescore-dependency-edges.csv

.\scripts\build_jira_link_import.ps1 `
  -InputPath jira/mandatescore-dependency-edges.csv `
  -OutputPath jira/mandatescore-jira-link-import.csv `
  -JiraLinkType Blocks `
  -Direction dependency_to_issue
```

## Operational Ownership (Suggested)

- Product and roadmap governance:
  - PM + Tech Lead
- Design system governance:
  - Design System Engineer
- Data/API delivery:
  - Backend Engineer
- UI delivery:
  - Frontend Engineer
- Release and runbooks:
  - DevOps/SRE + QA
