# MandateScore Sprint 4 Delivery Board

This sprint board follows Sprint 3 and is formatted for Jira/Linear execution with a day-by-day critical path.

## Sprint Metadata

- Sprint Name: `Sprint 4 - Remaining Read APIs + Public UI Assembly`
- Sprint Length: `2 weeks`
- Sprint Goal: `Ship remaining public read APIs and assemble first end-user pages (search + official profile) strictly from the shared design system.`
- In Scope Stories: `MS-303`, `MS-304`, `MS-305`, `MS-401`, `MS-402`
- Stretch (only if capacity remains): `MS-404` (score explainability panel)
- Out of Scope: `Promise detail page UI`, `admin APIs`, `admin UI`, `hardening tasks`

## Capacity Assumptions

- Frontend Engineer: 12 SP
- Backend Engineer: 10 SP
- Design System Engineer: 6 SP
- QA/Automation (shared): 4 SP
- Tech Lead/PM (shared): unpointed reviews and release readiness checks
- Total planned: 42 SP

## Epic Mapping

- `EPIC-30` Public Read APIs: `MS-303`, `MS-304`, `MS-305`
- `EPIC-40` Public MVP UI: `MS-401`, `MS-402`

## Story Backlog (Jira/Linear Ready)

### Story: MS-303

- Title: `Deliver official promises list API with filters and sort`
- Estimate: `5 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-202`, `MS-203`, `MS-301`
- Description:
  - Implement `GET /api/officials/:id/promises?status=&category=&sort=&page=`.
  - Support status/category filters and stable sort semantics.
- Acceptance Criteria:
  - Returns paginated promise list with latest status and key metadata.
  - Supports filtering by status and policy category.
  - Sorting supports at least relevance, recency, and status priority.
  - Endpoint contract tests pass.
- Subtasks:
  - Build query service and response mapper.
  - Add filter/sort validation.
  - Add integration tests with seeded data distributions.

### Story: MS-304

- Title: `Deliver promise detail API with timeline and provenance`
- Estimate: `5 SP`
- Owner Role: `Backend Engineer`
- Priority: `P0`
- Dependencies: `MS-203`, `MS-301`
- Description:
  - Implement `GET /api/promises/:id` with full detail, event timeline, status history, rationale, and source links.
- Acceptance Criteria:
  - Includes canonical promise fields, status history, evidence events, and linked sources.
  - Returns typed not-found and validation errors.
  - Contract and integration tests pass for at least 3 scenarios.
- Subtasks:
  - Build aggregate read model for promise detail.
  - Add history ordering and provenance linking.
  - Add contract tests and edge-case fixtures.

### Story: MS-305

- Title: `Deliver score history API for chart consumption`
- Estimate: `3 SP`
- Owner Role: `Backend Engineer`
- Priority: `P1`
- Dependencies: `MS-211`, `MS-212`
- Description:
  - Implement `GET /api/officials/:id/scores/history` for trend charting.
- Acceptance Criteria:
  - Returns ordered time-series data with score and status count snapshots.
  - Supports configurable interval granularity (at minimum: default snapshot cadence).
  - Endpoint contract tests pass.
- Subtasks:
  - Implement score history query and DTO mapper.
  - Add not-found and empty-series behavior.
  - Add integration tests.

### Story: MS-401

- Title: `Build public search and browse page from shared components`
- Estimate: `5 SP`
- Owner Role: `Frontend Engineer`
- Priority: `P0`
- Dependencies: `MS-114`, `MS-115`, `MS-301`, `MS-303`
- Description:
  - Build search/browse page using only shared molecules/organisms/templates.
  - Integrate API filters and pagination.
- Acceptance Criteria:
  - Page composes `SearchBar`, `FilterPanel`, and list/table organisms from library only.
  - Supports query/filter interactions with loading, empty, and error states.
  - No page-level one-off UI implementation.
  - Accessibility checks pass for search/filter interactions.
- Subtasks:
  - Wire search/filter state to API client.
  - Implement results rendering and pagination.
  - Add UI tests for loading, empty, and error states.
  - Add analytics hooks for search actions (if available in foundation).

### Story: MS-402

- Title: `Build official profile page from shared templates and organisms`
- Estimate: `5 SP`
- Owner Role: `Frontend Engineer`
- Priority: `P0`
- Dependencies: `MS-115`, `MS-302`, `MS-303`
- Description:
  - Build official profile page displaying score summary, term progress, status counts, and top promises.
  - Use template + organisms without introducing ad hoc UI primitives.
- Acceptance Criteria:
  - Displays profile identity, office context, term timeline, score, trend, and promise list preview.
  - Uses tokenized, reusable components only.
  - Includes clear fallback states (no data, partial data, API error).
  - Accessibility checks pass for page navigation and interactive controls.
- Subtasks:
  - Implement profile page data loader and mapper.
  - Compose score/trend/stat blocks from existing library.
  - Add promise preview list integration.
  - Add tests for data states and route param changes.

## Day-by-Day Critical Path (10 Working Days)

### Week 1

- Day 1:
  - Sprint kickoff and dependency confirmation.
  - Start `MS-303` and `MS-304` in parallel.
  - Frontend prepares page route scaffolds for `MS-401` and `MS-402`.
- Day 2:
  - Continue `MS-303` filter/sort service.
  - Continue `MS-304` aggregate detail model.
  - Frontend integrates current `MS-301` contract into search page shell.
- Day 3:
  - Complete `MS-303`.
  - Continue `MS-304` with tests.
  - Start `MS-401` full search/filter integration.
- Day 4:
  - Complete `MS-304`.
  - Start `MS-305`.
  - Continue `MS-401` with pagination and state handling.
- Day 5:
  - Complete `MS-305`.
  - Start `MS-402` profile page assembly and API integration.

### Week 2

- Day 6:
  - Continue `MS-402` score/trend/stats composition.
  - QA contract + integration regression pass on `MS-303`/`MS-304`/`MS-305`.
- Day 7:
  - Complete `MS-401` acceptance and accessibility fixes.
  - Continue `MS-402` promise preview and state handling.
- Day 8:
  - Complete `MS-402`.
  - Cross-page polish for consistency with template and token usage.
- Day 9:
  - Bugfix buffer and non-functional checks.
  - Optional stretch start: `MS-404` if all in-scope stories are accepted.
- Day 10:
  - Sprint hardening, QA signoff, demo prep, and Sprint 5 planning.

## Dependency Graph (Execution Order)

1. `MS-303` and `MS-304` start first and run in parallel.
2. `MS-305` starts after scoring services (`MS-211`, `MS-212`) are available.
3. `MS-401` starts after `MS-301` and consumes `MS-303` once available.
4. `MS-402` starts after `MS-302` and consumes `MS-303` for promise previews.
5. `MS-404` (stretch) starts only if all in-scope stories are complete.

## Suggested Assignment Plan

- Backend Engineer:
  - lead `MS-303`, `MS-304`, `MS-305`
- Frontend Engineer:
  - lead `MS-401`, `MS-402`
- Design System Engineer:
  - enforce component reuse compliance and resolve any library gaps before page integration
- QA/Automation:
  - own API contract/integration tests and end-to-end smoke for search/profile flows
- Tech Lead/PM:
  - scope control, dependency unblocking, acceptance governance

## Sprint Risks and Mitigation

- Risk: UI implementation drifts into one-off components.
  - Mitigation: block merges unless UI is composed from library primitives/templates.
- Risk: promise list API payload shape causes repeated frontend transformations.
  - Mitigation: freeze DTO contract by Day 3 with frontend/design-system review.
- Risk: profile page delays due to dependent endpoint changes.
  - Mitigation: use adapter layer in API client and contract tests in CI.

## Sprint Exit Criteria

- `MS-303`, `MS-304`, `MS-305`, `MS-401`, `MS-402` closed and accepted.
- Search and profile pages are functional on seeded data and pass accessibility checks.
- All public read APIs required for those pages have stable contracts and integration coverage.
- No native browser widget or one-off component-policy violations.

## Jira/Linear Import Table (CSV-Friendly)

Use this section to copy into CSV tooling.

```csv
IssueKey,Title,Type,Epic,SP,Priority,OwnerRole,DependsOn
MS-303,Deliver official promises list API with filters and sort,Story,EPIC-30,5,P0,Backend Engineer,MS-202|MS-203|MS-301
MS-304,Deliver promise detail API with timeline and provenance,Story,EPIC-30,5,P0,Backend Engineer,MS-203|MS-301
MS-305,Deliver score history API for chart consumption,Story,EPIC-30,3,P1,Backend Engineer,MS-211|MS-212
MS-401,Build public search and browse page from shared components,Story,EPIC-40,5,P0,Frontend Engineer,MS-114|MS-115|MS-301|MS-303
MS-402,Build official profile page from shared templates and organisms,Story,EPIC-40,5,P0,Frontend Engineer,MS-115|MS-302|MS-303
```
