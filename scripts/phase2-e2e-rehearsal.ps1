param(
    [string]$ConnectionString = $env:DATABASE_URL
)

$ErrorActionPreference = "Stop"

function Invoke-Step {
    param(
        [string]$Name,
        [scriptblock]$Command
    )

    Write-Host "== $Name =="
    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw "$Name failed with exit code $LASTEXITCODE"
    }
}

if ([string]::IsNullOrWhiteSpace($ConnectionString)) {
    throw "DATABASE_URL (or -ConnectionString) is required."
}

$env:DATABASE_URL = $ConnectionString
$env:INGESTION_DATA_STORE = "postgres"
$env:INGESTION_EVENT_STORE = "postgres"

Invoke-Step -Name "Phase 2 E2E Rehearsal: Migration Smoke" -Command {
    .\scripts\db-migration-smoke.ps1 -ConnectionString $ConnectionString -MigrationPath db/migrations
}

Invoke-Step -Name "Phase 2 E2E Rehearsal: Typecheck" -Command {
    npm run typecheck
}

Invoke-Step -Name "Phase 2 E2E Rehearsal: Focused E2E Test" -Command {
    npm run test:phase2-e2e
}

Write-Host "Phase 2 E2E rehearsal completed successfully."
