# MandateScore Sprint 2 Delivery Board

This sprint board follows Sprint 1 and is formatted for Jira/Linear execution with a day-by-day critical path.

## Sprint Metadata

- Sprint Name: `Sprint 2 - Component Library Build + Data Layer Kickoff`
- Sprint Length: `2 weeks`
- Sprint Goal: `Deliver reusable atomic/molecule/organism/template library needed for MVP pages and complete schema/migration foundation for domain data.`
- In Scope Stories: `MS-102`, `MS-112`, `MS-113`, `MS-114`, `MS-115`, `MS-201`
- Stretch (only if capacity remains): `MS-202` (seed script skeleton)
- Out of Scope: `Public feature pages`, `admin screens`, `scoring engine implementation`, `search/profile APIs`

## Capacity Assumptions

- Frontend Engineer: 10 SP
- Backend Engineer: 8 SP
- Design System Engineer: 10 SP
- QA/Automation (shared): 4 SP
- Tech Lead/PM (shared): unpointed reviews, risk management
- Total planned: 39 SP

## Epic Mapping

- `EPIC-10` Tokens and Foundations: `MS-102`
- `EPIC-11` Atomic Component Build: `MS-112`, `MS-113`, `MS-114`, `MS-115`
- `EPIC-20` Schema and Migrations: `MS-201`

## Story Backlog (Jira/Linear Ready)

### Story: MS-102

- Title: `Build theme primitives with dark-ready token contract`
- Estimate: `3 SP`
- Owner Role: `Design System Engineer`
- Priority: `P0`
- Dependencies: `MS-101` complete from Sprint 1
- Description:
  - Extend token system with theme abstraction for light mode and future dark mode.
  - Validate semantic token stability for component consumption.
- Acceptance Criteria:
  - Theme contract supports at least 2 themes without component refactors.
  - Documentation defines token fallback and override strategy.
  - Visual regression checks pass for baseline theme states.
- Subtasks:
  - Implement theme provider and token resolution layer.
  - Add baseline snapshots for theme validation.
  - Update token documentation with usage matrix.

### Story: MS-112

- Title: `Build atomic components set with typed APIs and stories`
- Estimate: `8 SP`
- Owner Role: `Design System Engineer + Frontend Engineer`
- Priority: `P0`
- Dependencies: `MS-102`
- Description:
  - Build and document core atoms from component inventory.
- Component Scope:
  - `Button`, `Input`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Chip`, `Badge`, `Avatar`, `ProgressBar`, `Tooltip`, `Skeleton`
- Acceptance Criteria:
  - Every component has TypeScript props, usage stories, and interaction states.
  - Accessibility checks pass for keyboard/focus/label behavior.
  - No hardcoded design values in component styles.
- Subtasks:
  - Implement atoms by domain (forms, feedback, display).
  - Add Storybook docs and prop tables.
  - Add unit tests and a11y smoke tests for interactive atoms.

### Story: MS-113

- Title: `Build custom interaction primitives (no native browser widgets)`
- Estimate: `8 SP`
- Owner Role: `Design System Engineer + Frontend Engineer`
- Priority: `P0`
- Dependencies: `MS-112`
- Description:
  - Build complex custom primitives to replace native widgets.
- Component Scope:
  - `Select`, `DatePicker`, `Popover`, `Modal`, `Drawer`, `Toast`, `ConfirmDialog`
- Acceptance Criteria:
  - `Select` and `DatePicker` do not rely on default browser popup widgets.
  - Modal/drawer include focus trap and escape-key handling.
  - ARIA roles and keyboard interactions documented and tested.
- Subtasks:
  - Implement popover/focus-trap primitives.
  - Build listbox-style select with keyboard navigation.
  - Build custom date picker calendar grid with semantic navigation.
  - Add stories for edge states (disabled, invalid, async).

### Story: MS-114

- Title: `Build molecules and organisms required for MVP composition`
- Estimate: `5 SP`
- Owner Role: `Frontend Engineer`
- Priority: `P1`
- Dependencies: `MS-112`, `MS-113`
- Description:
  - Assemble higher-order components using shared atoms/primitives.
- Component Scope:
  - `SearchBar`, `LabeledField`, `Tabs`, `Pagination`, `FilterPanel`, `DataTable`
- Acceptance Criteria:
  - Components are composition-first and reusable across public/admin surfaces.
  - No page-specific styling embedded in organisms.
  - Docs include composition examples and anti-pattern notes.
- Subtasks:
  - Implement molecules first (`SearchBar`, `LabeledField`, `Tabs`, `Pagination`).
  - Implement organisms (`FilterPanel`, `DataTable`).
  - Add stories showing responsive behavior and empty/loading states.

### Story: MS-115

- Title: `Build reusable templates for public and admin shells`
- Estimate: `3 SP`
- Owner Role: `Frontend Engineer`
- Priority: `P1`
- Dependencies: `MS-114`
- Description:
  - Implement layout templates to enforce page-level consistency.
- Template Scope:
  - `PublicShell`, `AdminShell`, `ProfileTemplate`, `DetailTemplate`
- Acceptance Criteria:
  - Templates compose organisms; no one-off styles required for baseline pages.
  - Layout tokens control spacing and breakpoints.
  - Storybook displays template slots and usage guidance.
- Subtasks:
  - Create shell structures and slot APIs.
  - Add responsive breakpoints and layout tests.
  - Add template docs and composition examples.

### Story: MS-201

- Title: `Implement domain schema and reversible migrations`
- Estimate: `8 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-001` and standards from Sprint 1
- Description:
  - Implement MVP relational schema and migration workflow for domain core.
- Table Scope:
  - `officials`, `offices`, `terms`, `promises`, `promise_sources`,
  - `evidence_events`, `promise_status_updates`, `promise_status_sources`,
  - `score_snapshots`, `users`, `audit_logs`, `kg_edges`
- Acceptance Criteria:
  - Migrations are reversible and idempotent.
  - Constraints enforce referential integrity for promise/status/source links.
  - Schema docs include ERD and status-history append-only strategy.
- Subtasks:
  - Build initial migration set by domain area.
  - Add FK/index strategy for read/write paths.
  - Add migration rollback test in CI.
  - Publish ERD and migration conventions.

## Day-by-Day Critical Path (10 Working Days)

### Week 1

- Day 1:
  - Kickoff, scope lock, dependency review.
  - Start `MS-102` and `MS-201` in parallel.
- Day 2:
  - Finalize theme contract (`MS-102`) and migration skeleton (`MS-201`).
  - Begin atom implementation prep (`MS-112` scaffolding).
- Day 3:
  - Complete `MS-102`.
  - Execute `MS-112` form/display atoms.
  - Continue `MS-201` core tables (`officials`, `offices`, `terms`, `promises`).
- Day 4:
  - Continue `MS-112` feedback/accessibility states.
  - Continue `MS-201` provenance + status tables.
- Day 5:
  - Close `MS-112` with stories/tests.
  - Start `MS-113` primitives (`Popover`, `Modal`, focus trap).
  - Complete first migration pass in `MS-201`.

### Week 2

- Day 6:
  - Continue `MS-113` (`Select`, keyboard listbox semantics).
  - Start `MS-114` molecules (`SearchBar`, `LabeledField`, `Tabs`, `Pagination`).
  - Validate `MS-201` rollback/idempotency checks.
- Day 7:
  - Continue `MS-113` (`DatePicker`, `Drawer`, `Toast`, `ConfirmDialog`).
  - Continue `MS-114` organisms (`FilterPanel`, `DataTable`).
- Day 8:
  - Complete `MS-113` tests and docs.
  - Complete `MS-114` stories and responsive states.
  - Start `MS-115` templates.
- Day 9:
  - Complete `MS-115`.
  - Buffer for bugfixes and accessibility remediations across component stories.
- Day 10:
  - Sprint hardening, QA signoff, demo prep, and backlog hygiene.
  - Optional stretch: start `MS-202` seed script skeleton if all committed stories are green.

## Dependency Graph (Execution Order)

1. `MS-102` and `MS-201` start first and can run in parallel.
2. `MS-112` starts after `MS-102`.
3. `MS-113` starts after `MS-112`.
4. `MS-114` starts after `MS-112` and overlaps with `MS-113` tail.
5. `MS-115` starts after `MS-114`.
6. `MS-202` only starts if all in-scope stories are done.

## Suggested Assignment Plan

- Design System Engineer:
  - lead `MS-102`, co-lead `MS-112`, co-lead `MS-113`
- Frontend Engineer:
  - co-lead `MS-112`, co-lead `MS-113`, lead `MS-114`, lead `MS-115`
- Backend Engineer:
  - lead `MS-201`, support schema docs and migration CI
- QA/Automation:
  - accessibility/perf verification for components and migration validation checks
- Tech Lead/PM:
  - scope control, dependency unblocking, acceptance governance

## Sprint Risks and Mitigation

- Risk: complexity in custom `DatePicker`/`Select` slips timeline.
  - Mitigation: ship minimum-complete interaction set first, defer non-critical enhancements.
- Risk: component work overwhelms documentation/testing.
  - Mitigation: story cannot close without tests + Storybook docs.
- Risk: schema churn due to late domain clarifications.
  - Mitigation: review ERD with PM/curation stakeholders by Day 3.

## Sprint Exit Criteria

- `MS-102`, `MS-112`, `MS-113`, `MS-114`, `MS-115`, `MS-201` closed and accepted.
- All delivered components documented in Storybook with typed APIs.
- No native browser widget dependency for covered interactive components.
- Migration suite passes forward + rollback checks in CI.

## Jira/Linear Import Table (CSV-Friendly)

Use this section to copy into CSV tooling.

```csv
IssueKey,Title,Type,Epic,SP,Priority,OwnerRole,DependsOn
MS-102,Build theme primitives with dark-ready token contract,Story,EPIC-10,3,P0,Design System Engineer,MS-101
MS-112,Build atomic components set with typed APIs and stories,Story,EPIC-11,8,P0,Design System Engineer + Frontend Engineer,MS-102
MS-113,Build custom interaction primitives (no native browser widgets),Story,EPIC-11,8,P0,Design System Engineer + Frontend Engineer,MS-112
MS-114,Build molecules and organisms required for MVP composition,Story,EPIC-11,5,P1,Frontend Engineer,MS-112|MS-113
MS-115,Build reusable templates for public and admin shells,Story,EPIC-11,3,P1,Frontend Engineer,MS-114
MS-201,Implement domain schema and reversible migrations,Story,EPIC-20,8,P0,Backend Engineer,MS-001
```
