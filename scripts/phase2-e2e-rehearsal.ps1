param(
    [string]$ConnectionString = $env:DATABASE_URL
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($ConnectionString)) {
    throw "DATABASE_URL (or -ConnectionString) is required."
}

$env:DATABASE_URL = $ConnectionString
$env:INGESTION_DATA_STORE = "postgres"
$env:INGESTION_EVENT_STORE = "postgres"

Write-Host "== Phase 2 E2E Rehearsal: Migration Smoke =="
& .\scripts\db-migration-smoke.ps1 -ConnectionString $ConnectionString -MigrationPath db/migrations

Write-Host "== Phase 2 E2E Rehearsal: Typecheck =="
& npm run typecheck

Write-Host "== Phase 2 E2E Rehearsal: Focused E2E Test =="
& npm run test:phase2-e2e

Write-Host "Phase 2 E2E rehearsal completed successfully."
