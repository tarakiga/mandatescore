# MandateScore Sprint 1 Delivery Board

This sprint board is derived from `docs/planning/implementation-execution-board.md` and is formatted for easy import into Jira or Linear.

## Sprint Metadata

- Sprint Name: `Sprint 1 - Foundation + Design System Contract`
- Sprint Length: `2 weeks`
- Sprint Goal: `Establish engineering foundation, enforce quality gates, and lock the design-system token contract plus component inventory before page development.`
- In Scope Stories: `MS-001`, `MS-002`, `MS-003`, `MS-004`, `MS-101`, `MS-103`, `MS-111`
- Out of Scope: `Feature pages`, `admin screens`, `data APIs beyond foundation stubs`

## Capacity Assumptions

- Frontend Engineer: 8 SP
- Backend Engineer: 6 SP
- Design System Engineer: 8 SP
- QA/Automation (shared): 3 SP
- Tech Lead/PM (shared): unpointed governance and reviews
- Total planned: 24 SP

## Epic Mapping

- `EPIC-00` Project Foundation: `MS-001`, `MS-002`, `MS-003`, `MS-004`
- `EPIC-10` Design Tokens and Foundations: `MS-101`, `MS-103`
- `EPIC-11` Inventory Audit: `MS-111`

## Story Backlog (Jira/Linear Ready)

### Story: MS-001

- Title: `Initialize Next.js + TypeScript repo structure and CI hooks`
- Estimate: `3 SP`
- Owner Role: `Frontend Engineer`
- Priority: `P0`
- Dependencies: `None`
- Description:
  - Create project structure for `app`, `components`, `lib`, `api`, `docs`.
  - Configure scripts for build, lint, typecheck, test.
  - Ensure CI runs these checks on pull requests.
- Acceptance Criteria:
  - `npm run build`, `npm run lint`, `npm run typecheck`, `npm run test` exist and pass.
  - PR pipeline fails on any quality gate failure.
  - Repository has a clear README bootstrap path.
- Subtasks:
  - Create folder scaffolding and base TypeScript config.
  - Configure ESLint + Prettier + strict TS.
  - Configure test runner and baseline test.
  - Configure CI workflow for PR checks.
  - Write developer onboarding section in `README`.

### Story: MS-002

- Title: `Publish engineering standards and ADR workflow`
- Estimate: `2 SP`
- Owner Role: `Tech Lead / Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-001`
- Description:
  - Add coding standards and architecture decision record templates.
  - Define review expectations and design-system-first governance rule.
- Acceptance Criteria:
  - `docs/engineering-standards.md` exists.
  - `docs/adr/README.md` and ADR template exist.
  - PR template includes “new UI must be added to shared library first” check.
- Subtasks:
  - Draft coding conventions (naming, modules, testing).
  - Draft ADR template and usage examples.
  - Add PR checklist entries for accessibility and component reuse.

### Story: MS-003

- Title: `Add observability baseline and error handling shell`
- Estimate: `3 SP`
- Owner Role: `Backend Engineer`
- Priority: `P1`
- Dependencies: `MS-001`
- Description:
  - Add request ID propagation, structured logging, and app error boundary baseline.
- Acceptance Criteria:
  - API logs include request correlation ID.
  - Log events are structured and parseable (JSON format).
  - UI has a fallback error boundary screen.
- Subtasks:
  - Implement request ID middleware.
  - Implement logger utility with levels and context.
  - Add frontend error boundary component.
  - Add smoke tests for error/logging paths.

### Story: MS-004

- Title: `Define and enforce performance + accessibility budgets`
- Estimate: `2 SP`
- Owner Role: `QA/Automation + Design System Engineer`
- Priority: `P1`
- Dependencies: `MS-001`
- Description:
  - Define baseline budgets and automate checks in CI.
- Acceptance Criteria:
  - Budget thresholds documented in `docs/non-functional-budgets.md`.
  - CI includes at least one automated a11y and one perf gate.
  - Failures block merge.
- Subtasks:
  - Define thresholds (bundle size, Lighthouse/axe minimums).
  - Add script and CI step for checks.
  - Add remediation guide for failed budgets.

### Story: MS-101

- Title: `Implement semantic design token system`
- Estimate: `5 SP`
- Owner Role: `Design System Engineer`
- Priority: `P0`
- Dependencies: `MS-001`
- Description:
  - Create token architecture for color, typography, spacing, radius, elevation, motion, z-index.
  - Expose via CSS variables with semantic naming.
- Acceptance Criteria:
  - Token files exist and are imported by base styles.
  - Semantic naming is used (`bg-surface`, `text-muted`, `accent-success`, etc.).
  - Shared components do not contain hardcoded visual values.
- Subtasks:
  - Define token taxonomy and naming convention.
  - Implement token files and theme root.
  - Create lint/check rule or review check for hardcoded values.
  - Document token usage examples.

### Story: MS-103

- Title: `Write design-system governance and contribution workflow`
- Estimate: `3 SP`
- Owner Role: `Design System Engineer + Tech Lead`
- Priority: `P0`
- Dependencies: `MS-101`
- Description:
  - Define how new components are proposed, reviewed, documented, versioned, and consumed.
- Acceptance Criteria:
  - `docs/design-system-governance.md` exists.
  - Workflow includes “inventory first -> component build -> docs -> page composition”.
  - Governance defines no-native-widget policy for core interactions.
- Subtasks:
  - Draft intake template for new component requests.
  - Define quality checklist (a11y, API design, tests, stories).
  - Add release/versioning policy for component changes.

### Story: MS-111

- Title: `Complete MVP component inventory audit from PRD`
- Estimate: `3 SP`
- Owner Role: `Design System Engineer + Frontend Engineer`
- Priority: `P0`
- Dependencies: `MS-101`, `MS-103`
- Description:
  - Produce complete Atoms/Molecules/Organisms/Templates inventory required by MVP features.
- Acceptance Criteria:
  - Inventory file lists all required components for search, profile, promise detail, and admin curation.
  - Each component has status (`new`, `existing`, `deferred`), owner, and planned sprint.
  - Stakeholder review signoff is recorded.
- Subtasks:
  - Parse PRD feature flows into UI capability map.
  - Map capability to atomic components.
  - Assign build order and ownership.
  - Conduct review and capture signoff notes.

## Dependency Graph (Execution Order)

1. `MS-001` must complete first.
2. `MS-002`, `MS-003`, and `MS-004` can run in parallel after `MS-001`.
3. `MS-101` starts after `MS-001`.
4. `MS-103` starts after `MS-101`.
5. `MS-111` starts after `MS-101` and `MS-103`.

## Suggested Assignment Plan

- Frontend Engineer:
  - `MS-001` (lead)
  - `MS-111` (co-owner)
- Backend Engineer:
  - `MS-003` (lead)
  - `MS-002` (support)
- Design System Engineer:
  - `MS-101` (lead)
  - `MS-103` (lead)
  - `MS-111` (co-owner)
- QA/Automation:
  - `MS-004` (lead)
  - test automation support across stories
- Tech Lead/PM:
  - standards review, acceptance validation, sprint risk tracking

## Sprint Risks and Mitigation

- Risk: foundation work slips and delays design system.
  - Mitigation: enforce `MS-001` completion by Day 2 and parallelize remaining tasks.
- Risk: token naming churn causes rework.
  - Mitigation: run architecture review before implementing all token categories.
- Risk: inventory misses admin-specific components.
  - Mitigation: include curation workflows in audit checklist, not only public pages.

## Sprint Exit Criteria

- All in-scope stories closed with acceptance criteria met.
- CI quality gates active and enforced.
- Design token contract approved and documented.
- Component inventory approved and used as source of truth for Sprint 2 build plan.

## Jira/Linear Import Table (CSV-Friendly)

Use this section to copy into CSV tooling.

```csv
IssueKey,Title,Type,Epic,SP,Priority,OwnerRole,DependsOn
MS-001,Initialize Next.js + TypeScript repo structure and CI hooks,Story,EPIC-00,3,P0,Frontend Engineer,
MS-002,Publish engineering standards and ADR workflow,Story,EPIC-00,2,P0,Tech Lead / Backend Engineer,MS-001
MS-003,Add observability baseline and error handling shell,Story,EPIC-00,3,P1,Backend Engineer,MS-001
MS-004,Define and enforce performance + accessibility budgets,Story,EPIC-00,2,P1,QA/Automation + Design System Engineer,MS-001
MS-101,Implement semantic design token system,Story,EPIC-10,5,P0,Design System Engineer,MS-001
MS-103,Write design-system governance and contribution workflow,Story,EPIC-10,3,P0,Design System Engineer + Tech Lead,MS-101
MS-111,Complete MVP component inventory audit from PRD,Story,EPIC-11,3,P0,Design System Engineer + Frontend Engineer,MS-101|MS-103
```
