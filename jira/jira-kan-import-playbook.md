# Jira KAN Import Playbook

This playbook is tailored to your Jira project:

- Base URL: `https://mandatescrore.atlassian.net`
- Project Key: `KAN`
- Project ID: `10001`
- Board ID: `2`
- Project style: team-managed (`next-gen`)
- Parent model: use `Parent` (not `Epic Link`)

## Generated KAN-Ready Files

- Epics import: `jira/mandatescore-kan-epics-import.csv`
- Tasks import: `jira/mandatescore-kan-tasks-import.csv`
- Dependencies link import: `jira/mandatescore-jira-link-import.csv`

## Step 1) Import Epics

1. Jira -> Settings -> System -> External System Import -> CSV.
2. Select `jira/mandatescore-kan-epics-import.csv`.
3. Map:
   - `Summary` -> `Summary`
   - `IssueType` -> `Issue Type` (value should be `Epic`)
   - `ExternalId` -> external id/custom reference field
4. Run import into project `KAN`.

## Step 2) Capture Epic Key Mapping

After epic import, export/query epics to build mapping:

- `ExternalId` (example: `EPIC-20`) -> Jira issue key (example: `KAN-12`)

Create mapping CSV:

```csv
ParentExternalId,ParentIssueKey
EPIC-00,KAN-1
EPIC-10,KAN-2
...
```

## Step 3) Import Tasks

1. Import `jira/mandatescore-kan-tasks-import.csv`.
2. Map:
   - `Summary` -> `Summary`
   - `IssueType` -> `Issue Type` (all `Task`)
   - `Priority` -> `Priority` (map `P0`/`P1` as desired)
   - `OwnerRole` -> custom field (or label)
   - `SprintCode` -> custom field (temporary)
   - `DependsOnRaw` -> custom field (temporary)
   - `ExternalId` -> external id/custom reference field
3. Do not map `ParentExternalId` yet unless you have direct automation to convert it to real Jira keys.

## Step 4) Set Parent for Tasks

Use your mapping from Step 2 to convert each task’s `ParentExternalId` into actual parent key.

Then bulk update tasks (CSV or API):
- `Task ExternalId` -> `Parent` = `ParentIssueKey`

## Step 5) Import Dependency Links

Import `jira/mandatescore-jira-link-import.csv`:
- `outwardIssue`
- `inwardIssue`
- `linkType` (`Blocks`)

This sets dependency issue -> blocks -> dependent issue.

## Step 6) Create and Assign Sprints

On board `KAN board` (`id=2`):

1. Create sprints/cycles: `S1`, `S2`, `S3`, `S4`, `S5`, `S6`.
2. Bulk move tasks by `SprintCode` custom field.
3. Clear `SprintCode` field later if not needed.

## Optional: Rebuild KAN Files

From repo root:

```powershell
.\scripts\build_jira_kan_import.ps1 `
  -InputPath jira/mandatescore-master-import.csv `
  -EpicsOutputPath jira/mandatescore-kan-epics-import.csv `
  -TasksOutputPath jira/mandatescore-kan-tasks-import.csv
```
