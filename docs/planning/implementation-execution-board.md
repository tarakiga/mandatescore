# MandateScore Implementation Execution Board

This board translates the PRD and design-system-first constraints into delivery-ready work.

## 1) Delivery Model

- Method: 2-week sprints, milestone-gated.
- Team baseline: 1 Product Engineer (Frontend), 1 Product Engineer (Backend), 1 Design System Engineer, 1 QA/Automation (shared), 1 PM/Tech Lead (shared).
- Estimation scale: Story points (SP) using 1, 2, 3, 5, 8.
- Definition of Done (global):
  - Feature behind typed API contract.
  - Unit tests for core logic and component behavior.
  - Accessibility checks for interactive UI (keyboard + ARIA).
  - Storybook docs for reusable UI components.
  - Auditability and provenance requirements met where relevant.

## 2) Architecture Decisions (Locked For MVP)

- Frontend: Next.js (App Router) + TypeScript.
- Design system: token-driven CSS variables + component library + Storybook.
- Backend API: REST (GraphQL optional post-MVP).
- Primary DB: PostgreSQL for transactional and historical data.
- Graph layer: start with relational edge table (`kg_edges`); move to dedicated graph DB in Phase 2 if needed.
- Caching: Redis + CDN for read-heavy public endpoints.
- Auth: role-based access (`viewer`, `curator`, `admin`) with session/JWT.

## 3) Epic Roadmap (Phases)

## Phase 0: Project Foundation

### EPIC-00: Repo, CI/CD, Quality Gates (Target: Week 1)

- Story `MS-001` (3 SP): Initialize Next.js + TypeScript monorepo structure (`app`, `components`, `lib`, `api`, `docs`).
  - Acceptance Criteria:
    - Build, typecheck, lint, and test scripts available.
    - CI pipeline runs on pull request.
- Story `MS-002` (2 SP): Add coding conventions and architectural decision record (ADR) template.
  - Acceptance Criteria:
    - `docs/engineering-standards.md` and `docs/adr/README.md` exist.
- Story `MS-003` (3 SP): Add observability baseline (request ID logging, structured logs, error boundary).
  - Acceptance Criteria:
    - Correlatable request logs across API calls.
- Story `MS-004` (2 SP): Define performance and accessibility budgets.
  - Acceptance Criteria:
    - Budgets documented and enforced in CI (basic thresholds).

## Phase 1: Design System First

### EPIC-10: Tokens and Foundations (Target: Week 1-2)

- Story `MS-101` (5 SP): Implement semantic token architecture.
  - Scope:
    - Colors (`bg-*`, `text-*`, `border-*`, status tokens).
    - Typography scale, spacing scale, radii, elevation, motion, z-index.
  - Acceptance Criteria:
    - No hardcoded design values in shared components.
- Story `MS-102` (3 SP): Build theme primitives (light theme for MVP, dark-ready contract).
  - Acceptance Criteria:
    - Token contract supports future theme extension without refactor.
- Story `MS-103` (3 SP): Create design-system governance docs.
  - Acceptance Criteria:
    - Contribution rules define "add to library before page usage".

### EPIC-11: Atomic Component Inventory and Build (Target: Week 2-4)

- Story `MS-111` (3 SP): Complete component inventory audit from PRD.
  - Acceptance Criteria:
    - Inventory includes Atoms, Molecules, Organisms, Templates.
- Story `MS-112` (8 SP): Build atomic components set.
  - Components:
    - `Button`, `Input`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Chip`, `Badge`, `Avatar`, `ProgressBar`, `Tooltip`, `Skeleton`.
  - Acceptance Criteria:
    - All have typed props, states, and stories.
- Story `MS-113` (8 SP): Build complex interaction primitives (no native widgets).
  - Components:
    - Custom `Select`, `DatePicker`, `Popover`, `Modal`, `Drawer`, `Toast`, `ConfirmDialog`.
  - Acceptance Criteria:
    - Keyboard navigation + focus trap + ARIA semantics implemented.
- Story `MS-114` (5 SP): Build molecules and organisms.
  - Components:
    - `SearchBar`, `LabeledField`, `Tabs`, `Pagination`, `FilterPanel`, `DataTable`.
  - Acceptance Criteria:
    - Zero page-level one-off UI for covered patterns.
- Story `MS-115` (3 SP): Build templates for public/admin shells.
  - Acceptance Criteria:
    - `PublicShell`, `AdminShell`, `ProfileTemplate`, `DetailTemplate`.

## Phase 2: Data Layer and Domain Modeling

### EPIC-20: Schema, Migrations, Seed Data (Target: Week 3-4)

- Story `MS-201` (8 SP): Implement relational schema and migrations.
  - Tables:
    - `officials`, `offices`, `terms`, `promises`, `promise_sources`,
    - `evidence_events`, `promise_status_updates`, `promise_status_sources`,
    - `score_snapshots`, `users`, `audit_logs`, `kg_edges`.
  - Acceptance Criteria:
    - Migrations reversible and idempotent.
- Story `MS-202` (3 SP): Seed curated initial data set (3-5 officials).
  - Acceptance Criteria:
    - Seed script loads complete profile + promises + sources + status history.
- Story `MS-203` (5 SP): Enforce append-only status history and audit trails.
  - Acceptance Criteria:
    - Status updates create new records; immutable history preserved.

### EPIC-21: Scoring Engine (Target: Week 4)

- Story `MS-211` (5 SP): Implement scoring service and snapshot writer.
  - Logic:
    - `kept=1.0`, `compromise=0.7`, `in_progress=0.5`, `stalled=0.2`, `broken=0.0`.
    - Exclude `not_started` and `not_yet_rated` from denominator (MVP rule).
  - Acceptance Criteria:
    - Deterministic score output with unit tests.
- Story `MS-212` (3 SP): Add time-aware trend indicator (`on_track`, `watch`, `behind`).
  - Acceptance Criteria:
    - Trend derived from term elapsed vs weighted progress.

## Phase 3: API Delivery

### EPIC-30: Public Read APIs (Target: Week 4-5)

- Story `MS-301` (5 SP): `GET /api/search` with filters and ranking.
  - Acceptance Criteria:
    - Supports name, office, country, level filters with pagination.
- Story `MS-302` (5 SP): `GET /api/officials/:id` profile aggregate endpoint.
  - Acceptance Criteria:
    - Includes term metadata, score, status counts, time elapsed.
- Story `MS-303` (5 SP): `GET /api/officials/:id/promises`.
  - Acceptance Criteria:
    - Supports status/category/sort filters.
- Story `MS-304` (3 SP): `GET /api/promises/:id` detail + timeline + provenance.
  - Acceptance Criteria:
    - Returns latest status, status history, rationale, linked sources.
- Story `MS-305` (3 SP): `GET /api/officials/:id/scores/history`.
  - Acceptance Criteria:
    - Consumable by chart components with clear intervals.

### EPIC-31: Admin/Curation APIs (Target: Week 5-6)

- Story `MS-311` (5 SP): RBAC middleware + auth session integration.
  - Acceptance Criteria:
    - Write routes restricted to curator/admin roles.
- Story `MS-312` (5 SP): CRUD endpoints for officials/promises/evidence.
  - Acceptance Criteria:
    - Validation errors typed and user-safe.
- Story `MS-313` (3 SP): Status update endpoint with rationale + source linkage.
  - Acceptance Criteria:
    - Requires evidence references on update.
- Story `MS-314` (2 SP): Audit log query endpoint.
  - Acceptance Criteria:
    - Filter by entity type and ID.

## Phase 4: UI Feature Assembly (Library-Only Composition)

### EPIC-40: Public MVP UI (Target: Week 5-6)

- Story `MS-401` (5 SP): Search and browse page.
  - Acceptance Criteria:
    - Uses `SearchBar`, `FilterPanel`, `DataTable/CardList` organisms only.
- Story `MS-402` (5 SP): Official profile page.
  - Acceptance Criteria:
    - Displays score, term progress, status counts, top promises, source summary.
- Story `MS-403` (5 SP): Promise detail page.
  - Acceptance Criteria:
    - Timeline, rationale, and evidence links visible and readable.
- Story `MS-404` (3 SP): Score explainability panel ("How this score is calculated").
  - Acceptance Criteria:
    - Formula and status weights rendered from config.

### EPIC-41: Admin MVP UI (Target: Week 6-7)

- Story `MS-411` (5 SP): Admin dashboard shell + navigation.
  - Acceptance Criteria:
    - Access-controlled routes and role-aware nav items.
- Story `MS-412` (5 SP): Official/promise editor forms using custom field components.
  - Acceptance Criteria:
    - No native date picker/select widgets used.
- Story `MS-413` (5 SP): Status update workflow with evidence attachment.
  - Acceptance Criteria:
    - Mandatory rationale and source references.
- Story `MS-414` (3 SP): Audit log viewer.
  - Acceptance Criteria:
    - Human-readable diff summaries.

## Phase 5: Hardening and Launch

### EPIC-50: Reliability, Performance, Accessibility (Target: Week 7-8)

- Story `MS-501` (3 SP): CDN + API cache strategy for public reads.
  - Acceptance Criteria:
    - Cache headers and invalidation triggers documented.
- Story `MS-502` (3 SP): Database indexes and query tuning for profile/search paths.
  - Acceptance Criteria:
    - p95 target met for cached and uncached key paths.
- Story `MS-503` (5 SP): Accessibility audit and remediations (WCAG 2.1 AA).
  - Acceptance Criteria:
    - Keyboard and screen reader tests pass for all interactive components.
- Story `MS-504` (3 SP): Backup/restore and disaster recovery rehearsal.
  - Acceptance Criteria:
    - Recovery objective documented and test-verified.

### EPIC-51: Release Readiness (Target: Week 8)

- Story `MS-511` (2 SP): Production config and secrets policy.
  - Acceptance Criteria:
    - Environment matrix complete for dev/staging/prod.
- Story `MS-512` (2 SP): Launch checklist and runbook.
  - Acceptance Criteria:
    - Operational playbook includes incidents, rollback, and escalation.
- Story `MS-513` (2 SP): Stakeholder UAT signoff package.
  - Acceptance Criteria:
    - Feature acceptance mapped to PRD requirements.

## 4) API Contract Draft (MVP)

- `GET /api/search?q=&country=&level=&office=&page=`
- `GET /api/officials/:id`
- `GET /api/officials/:id/promises?status=&category=&sort=&page=`
- `GET /api/promises/:id`
- `GET /api/officials/:id/scores/history`
- `POST /api/admin/officials`
- `PATCH /api/admin/officials/:id`
- `POST /api/admin/promises`
- `PATCH /api/admin/promises/:id`
- `POST /api/admin/promises/:id/status`
- `POST /api/admin/evidence-events`
- `GET /api/admin/audit?entity_type=&entity_id=`
- `POST /api/internal/scores/recompute`

## 5) Milestone Checklist

## Milestone M1: Foundation Complete

- [ ] CI, lint, typecheck, tests all green.
- [ ] Engineering standards + ADR process in place.
- [ ] Perf/accessibility budgets documented.

## Milestone M2: Design System Ready

- [ ] Tokens implemented and consumed by components.
- [ ] Atomic inventory complete and approved.
- [ ] Storybook coverage for all base components.
- [ ] No native widget violations in implemented UI.

## Milestone M3: Data + Scoring Core Ready

- [ ] Schema migrated in staging.
- [ ] Seed data loaded for initial officials.
- [ ] Score engine deterministic with test coverage.
- [ ] Append-only status history and audit logs verified.

## Milestone M4: Public MVP Ready

- [ ] Search, profile, and promise detail pages complete.
- [ ] All UI composed from shared component library.
- [ ] Provenance and "why status" visible to end users.

## Milestone M5: Admin MVP Ready

- [ ] Curator/admin workflows for CRUD and status updates.
- [ ] Mandatory rationale + source attachment on status changes.
- [ ] Audit viewer operational.

## Milestone M6: Launch Ready

- [ ] Accessibility signoff complete.
- [ ] Performance targets met.
- [ ] Backup/recovery rehearsal complete.
- [ ] Release runbook and rollback plan approved.

## 6) Risks and Mitigations

- Risk: subjective status assignment inconsistencies.
  - Mitigation: editorial rubric, mandatory rationale, multi-source requirement.
- Risk: component sprawl and one-off page UI.
  - Mitigation: library-first governance gate in PR template and review checklist.
- Risk: data quality gaps for less structured jurisdictions.
  - Mitigation: curated source tiers + confidence scoring + explicit "not yet rated".
- Risk: scope expansion beyond MVP.
  - Mitigation: strict milestone exit criteria and deferred backlog labeling.

## 7) Immediate Next Sprint Plan (Sprint 1)

- In sprint scope:
  - `MS-001`, `MS-002`, `MS-003`, `MS-004`, `MS-101`, `MS-103`, `MS-111`.
- Sprint goal:
  - Foundation and design-system contract established with an approved component inventory.
- Out of sprint:
  - Feature pages and admin screens (deferred until library baseline is done).
