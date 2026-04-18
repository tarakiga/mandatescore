# MandateScore Sprint 5 Delivery Board

This sprint board follows Sprint 4 and is formatted for Jira/Linear execution with a day-by-day critical path.

## Sprint Metadata

- Sprint Name: `Sprint 5 - Admin Workflows + Launch Hardening Prep`
- Sprint Length: `2 weeks`
- Sprint Goal: `Deliver admin/curation APIs and UI workflows with auditability, while completing pre-launch readiness work for reliability and accessibility.`
- In Scope Stories: `MS-311`, `MS-312`, `MS-313`, `MS-314`, `MS-411`, `MS-412`, `MS-413`, `MS-414`
- Stretch (only if capacity remains): `MS-501` cache strategy implementation kickoff
- Out of Scope: `Full reliability hardening bundle`, `final production launch checklist`, `UAT signoff package`

## Capacity Assumptions

- Frontend Engineer: 12 SP
- Backend Engineer: 12 SP
- Design System Engineer: 5 SP
- QA/Automation (shared): 5 SP
- Tech Lead/PM (shared): unpointed reviews, governance, and risk handling
- Total planned: 52 SP

## Epic Mapping

- `EPIC-31` Admin/Curation APIs: `MS-311`, `MS-312`, `MS-313`, `MS-314`
- `EPIC-41` Admin MVP UI: `MS-411`, `MS-412`, `MS-413`, `MS-414`

## Story Backlog (Jira/Linear Ready)

### Story: MS-311

- Title: `Implement RBAC middleware and admin auth session integration`
- Estimate: `5 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-001`, `MS-201`
- Description:
  - Add role-based access controls for curator/admin write routes.
  - Integrate session/JWT auth context into API middleware.
- Acceptance Criteria:
  - All `/api/admin/*` write routes deny unauthenticated and unauthorized requests.
  - Role matrix supports `viewer`, `curator`, `admin`.
  - Authorization failures return typed, consistent errors.
- Subtasks:
  - Implement auth middleware pipeline.
  - Define RBAC policy map by route/action.
  - Add middleware tests for role permutations.

### Story: MS-312

- Title: `Deliver admin CRUD APIs for officials, promises, and evidence events`
- Estimate: `5 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-311`, `MS-201`
- Description:
  - Implement admin write endpoints for core curation entities.
  - Add strong validation and safe error messaging.
- Acceptance Criteria:
  - Endpoints support create/update for officials and promises.
  - Evidence events can be created and linked to promises.
  - Validation and domain constraint failures are typed and user-safe.
- Subtasks:
  - Implement request DTO validation.
  - Implement service-layer writes and transaction boundaries.
  - Add integration tests with seeded data.

### Story: MS-313

- Title: `Deliver status update API with mandatory rationale and source linkage`
- Estimate: `3 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-311`, `MS-203`
- Description:
  - Implement `POST /api/admin/promises/:id/status` with governance constraints.
- Acceptance Criteria:
  - Status update requires rationale text and at least one evidence/source reference.
  - Updates preserve append-only history semantics.
  - Audit log is created for each status change.
- Subtasks:
  - Add status update command handler.
  - Add validation for rationale + source requirements.
  - Add integration tests and audit assertions.

### Story: MS-314

- Title: `Deliver admin audit query API`
- Estimate: `2 SP`
- Owner Role: `Backend Engineer`
- Priority: `P1`
- Dependencies: `MS-311`, `MS-203`
- Description:
  - Implement `GET /api/admin/audit?entity_type=&entity_id=` with pagination.
- Acceptance Criteria:
  - Audit entries can be filtered by entity type and entity ID.
  - Response includes actor, timestamp, action, and change summary.
  - Contract tests pass.
- Subtasks:
  - Build audit query and pagination model.
  - Add contract and integration tests.
  - Document audit response schema.

### Story: MS-411

- Title: `Build admin dashboard shell and protected navigation`
- Estimate: `5 SP`
- Owner Role: `Frontend Engineer`
- Priority: `P0`
- Dependencies: `MS-115`, `MS-311`
- Description:
  - Build role-aware admin shell and route guards.
  - Compose from shared templates and organisms only.
- Acceptance Criteria:
  - Unauthorized users cannot access admin routes.
  - Navigation adapts by role capability.
  - Page shell uses shared `AdminShell` and no one-off primitives.
- Subtasks:
  - Implement protected route wrapper.
  - Add role-aware nav rendering.
  - Add auth-state loading/error states.

### Story: MS-412

- Title: `Build official and promise editor forms using custom field components`
- Estimate: `5 SP`
- Owner Role: `Frontend Engineer`
- Priority: `P0`
- Dependencies: `MS-312`, `MS-113`, `MS-114`, `MS-411`
- Description:
  - Build create/edit forms for officials and promises using design-system inputs.
  - Enforce no native browser widget usage for core controls.
- Acceptance Criteria:
  - Editor forms support create/update and field-level validation states.
  - Uses custom `Select`, custom `DatePicker`, and shared form molecules.
  - No native widget policy violations.
- Subtasks:
  - Build form state model and API adapters.
  - Implement validation and error mapping.
  - Add UI tests for invalid, valid, and submit-failure states.

### Story: MS-413

- Title: `Build status update workflow with evidence attachment`
- Estimate: `5 SP`
- Owner Role: `Frontend Engineer`
- Priority: `P0`
- Dependencies: `MS-313`, `MS-412`
- Description:
  - Build admin flow to change promise status with mandatory rationale and source linking.
- Acceptance Criteria:
  - Status change cannot submit without rationale and source references.
  - Workflow surfaces history context and submission confirmations.
  - Accessibility checks pass for modal/drawer interactions if used.
- Subtasks:
  - Build status update form and source selector integration.
  - Add pre-submit validation + error messaging.
  - Add tests for mandatory field and API failure scenarios.

### Story: MS-414

- Title: `Build audit log viewer for admin users`
- Estimate: `3 SP`
- Owner Role: `Frontend Engineer`
- Priority: `P1`
- Dependencies: `MS-314`, `MS-411`
- Description:
  - Build audit viewer table/panel with filtering and change summaries.
- Acceptance Criteria:
  - Viewer displays timestamp, actor, action, and change summary.
  - Supports entity filters and pagination.
  - Uses shared table/filter components from the library.
- Subtasks:
  - Implement audit API client and data table wiring.
  - Add filters and pagination controls.
  - Add empty/loading/error states with tests.

## Day-by-Day Critical Path (10 Working Days)

### Week 1

- Day 1:
  - Sprint kickoff, dependency lock.
  - Start `MS-311` and `MS-411` in parallel.
- Day 2:
  - Continue RBAC/auth middleware (`MS-311`).
  - Continue admin route shell and protected nav (`MS-411`).
  - Backend scaffolds `MS-312` DTO contracts.
- Day 3:
  - Complete `MS-311`.
  - Start `MS-312` and `MS-313`.
  - Complete `MS-411`.
- Day 4:
  - Continue `MS-312` CRUD services and tests.
  - Continue `MS-313` status constraints and audit hooks.
  - Frontend starts `MS-412` editor forms.
- Day 5:
  - Complete `MS-313`.
  - Continue `MS-312`.
  - Continue `MS-412` with validation and API wiring.

### Week 2

- Day 6:
  - Complete `MS-312`.
  - Start `MS-314`.
  - Continue `MS-412` and begin `MS-413` scaffold.
- Day 7:
  - Complete `MS-314`.
  - Complete `MS-412`.
  - Continue `MS-413` status workflow.
- Day 8:
  - Complete `MS-413`.
  - Start `MS-414` audit viewer.
- Day 9:
  - Complete `MS-414`.
  - Cross-cutting QA pass (RBAC, audit trail visibility, validation states).
  - Optional stretch: begin `MS-501` cache strategy kickoff if all in-scope stories are accepted.
- Day 10:
  - Sprint hardening, defect closure, demo prep, and Sprint 6 planning.

## Dependency Graph (Execution Order)

1. `MS-311` starts first and gates all admin write APIs.
2. `MS-312` and `MS-313` start after `MS-311`.
3. `MS-314` starts after `MS-311` and audit pipeline readiness.
4. `MS-411` can run in parallel with `MS-311`.
5. `MS-412` starts after `MS-411` and `MS-312` contract availability.
6. `MS-413` starts after `MS-313` and `MS-412`.
7. `MS-414` starts after `MS-314` and `MS-411`.

## Suggested Assignment Plan

- Backend Engineer:
  - lead `MS-311`, `MS-312`, `MS-313`, `MS-314`
- Frontend Engineer:
  - lead `MS-411`, `MS-412`, `MS-413`, `MS-414`
- Design System Engineer:
  - ensure admin flows only use shared components; add missing reusable patterns to library before page integration
- QA/Automation:
  - own RBAC tests, API contract tests, admin-flow smoke tests, and accessibility checks
- Tech Lead/PM:
  - scope control, governance, and signoff readiness for launch hardening sprint

## Sprint Risks and Mitigation

- Risk: admin auth/RBAC complexity delays downstream UI.
  - Mitigation: prioritize `MS-311` to close by Day 3.
- Risk: curation workflows bypass provenance requirements.
  - Mitigation: enforce mandatory rationale/source checks in API and UI validation.
- Risk: UI introduces one-off admin components.
  - Mitigation: require design-system review gate before merging admin UI stories.

## Sprint Exit Criteria

- `MS-311`, `MS-312`, `MS-313`, `MS-314`, `MS-411`, `MS-412`, `MS-413`, `MS-414` closed and accepted.
- Admin CRUD and status workflows fully functional with RBAC enforcement.
- Audit trail is visible via API and admin UI.
- No violations of design-system-first and no-native-widget policies.

## Jira/Linear Import Table (CSV-Friendly)

Use this section to copy into CSV tooling.

```csv
IssueKey,Title,Type,Epic,SP,Priority,OwnerRole,DependsOn
MS-311,Implement RBAC middleware and admin auth session integration,Story,EPIC-31,5,P0,Backend Engineer,MS-001|MS-201
MS-312,Deliver admin CRUD APIs for officials/promises/evidence events,Story,EPIC-31,5,P0,Backend Engineer,MS-311|MS-201
MS-313,Deliver status update API with mandatory rationale and source linkage,Story,EPIC-31,3,P0,Backend Engineer,MS-311|MS-203
MS-314,Deliver admin audit query API,Story,EPIC-31,2,P1,Backend Engineer,MS-311|MS-203
MS-411,Build admin dashboard shell and protected navigation,Story,EPIC-41,5,P0,Frontend Engineer,MS-115|MS-311
MS-412,Build official and promise editor forms using custom field components,Story,EPIC-41,5,P0,Frontend Engineer,MS-312|MS-113|MS-114|MS-411
MS-413,Build status update workflow with evidence attachment,Story,EPIC-41,5,P0,Frontend Engineer,MS-313|MS-412
MS-414,Build audit log viewer for admin users,Story,EPIC-41,3,P1,Frontend Engineer,MS-314|MS-411
```
