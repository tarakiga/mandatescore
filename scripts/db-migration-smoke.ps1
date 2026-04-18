param(
    [string]$ConnectionString = $env:DATABASE_URL,
    [string]$MigrationPath = "db/migrations"
)

$ErrorActionPreference = "Stop"

function Invoke-SqlFile {
    param(
        [string]$Conn,
        [string]$FilePath
    )

    Write-Host "Applying: $FilePath"
    & psql $Conn -v ON_ERROR_STOP=1 -f $FilePath | Out-Host
}

function Invoke-SqlScalar {
    param(
        [string]$Conn,
        [string]$Sql
    )

    $result = & psql $Conn -v ON_ERROR_STOP=1 -t -A -c $Sql
    return ($result | Out-String).Trim()
}

if ([string]::IsNullOrWhiteSpace($ConnectionString)) {
    throw "DATABASE_URL (or -ConnectionString) is required."
}

$resolvedMigrationPath = Resolve-Path $MigrationPath

$upFiles = Get-ChildItem -Path $resolvedMigrationPath -Filter "*.sql" |
    Where-Object { $_.Name -notlike "*.down.sql" } |
    Sort-Object Name

$downFiles = Get-ChildItem -Path $resolvedMigrationPath -Filter "*.down.sql" |
    Sort-Object Name -Descending

if ($upFiles.Count -eq 0) {
    throw "No forward migration SQL files found in $resolvedMigrationPath"
}

Write-Host "== Migration smoke: UP =="
foreach ($file in $upFiles) {
    Invoke-SqlFile -Conn $ConnectionString -FilePath $file.FullName
}

Write-Host "== Structural checks after UP =="
$tableChecks = @(
    "source_registry",
    "source_document",
    "parsed_document_block",
    "official",
    "promise",
    "evidence_item",
    "promise_evidence_link",
    "promise_status_history",
    "review_queue",
    "official_score_projection",
    "official_trend_signal",
    "home_trending_view",
    "home_updates_view",
    "official_profile_view",
    "event_outbox"
)

foreach ($tableName in $tableChecks) {
    $exists = Invoke-SqlScalar -Conn $ConnectionString -Sql "SELECT to_regclass('public.$tableName') IS NOT NULL;"
    if ($exists -ne "t") {
        throw "Expected table missing after UP: $tableName"
    }
}

$constraintChecks = @(
    "chk_source_document_parse_status",
    "chk_review_queue_entity_type",
    "chk_review_queue_priority",
    "chk_review_queue_state",
    "chk_promise_status_history_status",
    "chk_official_profile_view_source_mode",
    "chk_promise_status_history_decided_by"
)

foreach ($constraint in $constraintChecks) {
    $exists = Invoke-SqlScalar -Conn $ConnectionString -Sql "SELECT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '$constraint');"
    if ($exists -ne "t") {
        throw "Expected constraint missing after UP: $constraint"
    }
}

Write-Host "== Migration smoke: DOWN =="
foreach ($file in $downFiles) {
    Invoke-SqlFile -Conn $ConnectionString -FilePath $file.FullName
}

Write-Host "== Structural checks after DOWN =="
$postDownExists = Invoke-SqlScalar -Conn $ConnectionString -Sql "SELECT to_regclass('public.source_registry') IS NOT NULL;"
if ($postDownExists -ne "f") {
    throw "Down migration check failed: source_registry still exists."
}

Write-Host "== Migration smoke: RE-UP =="
foreach ($file in $upFiles) {
    Invoke-SqlFile -Conn $ConnectionString -FilePath $file.FullName
}

Write-Host "Migration smoke test completed successfully."
