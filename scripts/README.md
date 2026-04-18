# Scripts Quick Reference

This folder contains helper scripts for converting roadmap CSV data into dependency/link import files.

## Prerequisites

- Windows PowerShell (recommended in this repo)
- Source file: `jira/mandatescore-master-import.csv`

## 1) Build Dependency Edges

Input:
- `jira/mandatescore-master-import.csv`

Output:
- `jira/mandatescore-dependency-edges.csv`

PowerShell:

```powershell
.\scripts\build_dependency_edges.ps1 `
  -InputPath jira/mandatescore-master-import.csv `
  -OutputPath jira/mandatescore-dependency-edges.csv
```

Output columns:
- `issue_key`
- `depends_on_key`
- `link_type`

## 2) Build Jira Link Import CSV

Input:
- `jira/mandatescore-dependency-edges.csv`

Output:
- `jira/mandatescore-jira-link-import.csv`

PowerShell:

```powershell
.\scripts\build_jira_link_import.ps1 `
  -InputPath jira/mandatescore-dependency-edges.csv `
  -OutputPath jira/mandatescore-jira-link-import.csv `
  -JiraLinkType Blocks `
  -Direction dependency_to_issue
```

Key options:
- `-JiraLinkType`: Jira link type text (default: `Blocks`)
- `-Direction`:
  - `dependency_to_issue` (default, recommended)
  - `issue_to_dependency`

Output columns:
- `outwardIssue`
- `inwardIssue`
- `linkType`

## 3) Optional Python Version

Python script equivalent for edge generation:
- `scripts/build_dependency_edges.py`

Example:

```bash
python scripts/build_dependency_edges.py --input jira/mandatescore-master-import.csv --output jira/mandatescore-dependency-edges.csv
```

Use this only if Python is available in your environment.

## 4) Typical End-to-End Flow

1. Generate dependency edges:
   - `build_dependency_edges.ps1`
2. Generate Jira link import:
   - `build_jira_link_import.ps1`
3. Import stories via:
   - `jira/mandatescore-master-import.csv`
4. Import links via:
   - `jira/mandatescore-jira-link-import.csv`

## 5) Troubleshooting

- `Input file not found`:
  - Run command from repo root or pass full path to `-InputPath`.
- Empty output file:
  - Confirm `DependsOn` values exist in `jira/mandatescore-master-import.csv`.
- Incorrect link direction in Jira:
  - Re-run with opposite `-Direction` value.

## 6) DB Migration Smoke

Use this to validate full `db/migrations` lifecycle:

1. Apply all forward migrations
2. Validate key tables/constraints
3. Apply all rollback migrations
4. Re-apply forward migrations

Prerequisites:
- `psql` available in PATH
- `DATABASE_URL` environment variable set

Example:

```powershell
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/mandatescore_ci"
.\scripts\db-migration-smoke.ps1 -MigrationPath db/migrations
```

Reference runbook:
- `docs/operations/migration-runbook.md`
