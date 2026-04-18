# Jira/Linear Import Mapping Guide

This guide maps `jira/mandatescore-master-import.csv` into Jira or Linear with minimal cleanup.

## 1) Source File

- File: `jira/mandatescore-master-import.csv`
- Columns:
  - `IssueKey`
  - `Title`
  - `Type`
  - `Epic`
  - `SP`
  - `Priority`
  - `OwnerRole`
  - `DependsOn`
  - `Sprint`

## 2) Recommended Pre-Import Setup

- Create project/initiative:
  - Jira project or Linear project: `MandateScore MVP Release`
- Create epics first:
  - `EPIC-00`, `EPIC-10`, `EPIC-11`, `EPIC-20`, `EPIC-21`, `EPIC-30`, `EPIC-31`, `EPIC-40`, `EPIC-41`, `EPIC-50`, `EPIC-51`
- Create custom fields (if missing):
  - `OwnerRole` (text/select)
  - `DependsOnRaw` (text, temporary)
  - `SprintCode` (text/select: `S1`..`S6`)
- Ensure `Story points` field is enabled in the target project/team.

## 3) Jira Field Mapping

During Jira CSV import, map columns as follows:

| CSV Column | Jira Field | Notes |
|---|---|---|
| `IssueKey` | External ID (or issue key surrogate) | Use as stable import reference; Jira may assign its own keys |
| `Title` | Summary | Required |
| `Type` | Issue Type | Values already set to `Story` |
| `Epic` | Epic Link (or Parent) | Must match existing epic keys/names in Jira |
| `SP` | Story Points | Numeric |
| `Priority` | Priority | Map `P0`/`P1` to your Jira priority scheme |
| `OwnerRole` | Custom Field: OwnerRole | Team-assignment hint, not assignee |
| `DependsOn` | Custom Field: DependsOnRaw | Later convert to issue links |
| `Sprint` | Custom Field: SprintCode | Optional; map to board sprints post-import |

Priority mapping recommendation:
- `P0` -> `Highest` (or `High`)
- `P1` -> `Medium`

## 4) Linear Field Mapping

If your Linear workspace supports CSV import, map as follows:

| CSV Column | Linear Field | Notes |
|---|---|---|
| `Title` | Title | Required |
| `Type` | Issue Type | `Story` can map to default issue type |
| `Priority` | Priority | Map `P0`/`P1` to Linear scale |
| `SP` | Estimate | Numeric |
| `Epic` | Project/Milestone label | Use labels or projects if epic field is unavailable |
| `OwnerRole` | Label or custom text | Use for routing ownership |
| `DependsOn` | Temp label/text | Convert manually to dependencies after import |
| `Sprint` | Cycle | Map `S1`..`S6` to cycles |

If CSV import is limited in your Linear plan:
- Import minimum fields first (`Title`, `Priority`, `Estimate`, `Cycle`).
- Bulk-apply labels for `Epic` and `OwnerRole`.
- Add dependencies in a second pass.

## 5) Dependency Linking (Post-Import)

`DependsOn` uses `|` as a delimiter (example: `MS-202|MS-203`).

Post-import process:
1. Export imported issues with generated system IDs.
2. Build lookup table: `IssueKey -> System ID`.
3. Parse `DependsOnRaw` and create dependency links:
   - Jira: `is blocked by` / `blocks`
   - Linear: `blocked by`
4. Remove or hide `DependsOnRaw` once links are created.

## 6) Import Order (Avoid Mapping Errors)

1. Import epics.
2. Import all stories from `jira/mandatescore-master-import.csv`.
3. Validate points/priority mapping.
4. Apply sprint/cycle assignment from `Sprint`.
5. Create dependency links from `DependsOn`.

## 7) Validation Checklist

- [ ] Total imported stories = 42 (`MS-001`..`MS-513` scoped set)
- [ ] No rows failed due to unknown epic
- [ ] Story points populated on all stories
- [ ] Priority mapped for all rows
- [ ] Sprint/cycle set for `S1`..`S6`
- [ ] Dependency links created and verified
- [ ] No orphan stories without epic assignment

## 8) Fast Troubleshooting

- Epic mapping fails:
  - Ensure epic names/keys exactly match `EPIC-*` references.
- Story points not imported:
  - Verify team-managed/company-managed field context in Jira.
- Dependencies missing:
  - Expected; create via second pass from `DependsOnRaw`.
- Priority mismatch:
  - Add explicit import-time value mapping for `P0` and `P1`.

## 9) Recommended First-Day Workflow

- Import all stories into backlog.
- Create six cycles/sprints (`S1`..`S6`).
- Move `S1` stories into active sprint.
- Assign actual people from `OwnerRole`.
- Run first dependency-risk review using `docs/planning/master-release-board.md`.
