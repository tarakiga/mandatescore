param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function Invoke-JsonPost {
    param(
        [string]$Uri,
        [hashtable]$Body
    )

    return Invoke-RestMethod -Method POST -Uri $Uri -ContentType "application/json" -Body ($Body | ConvertTo-Json -Depth 8)
}

Write-Host "== Phase 2 Staging Quickcheck =="
Write-Host "Target API: $BaseUrl"

Write-Host "1) Reset ingestion metrics"
Invoke-RestMethod -Method DELETE -Uri "$BaseUrl/api/ingestion/metrics" | Out-Null

Write-Host "2) Trigger status-classify"
$classify = Invoke-JsonPost -Uri "$BaseUrl/api/ingestion/status-classify" -Body @{
    officialId = "zohran-mamdani"
    sourceDocumentId = "doc-staging-quickcheck"
    sourceText = "Council approved the housing budget. We will build 1000 homes by 2027."
}
if (-not $classify.statusDecisions -or $classify.statusDecisions.Count -lt 1) {
    throw "status-classify returned no decisions."
}

Write-Host "3) Trigger publish-refresh"
$refresh = Invoke-JsonPost -Uri "$BaseUrl/api/ingestion/publish-refresh" -Body @{
    officialId = "zohran-mamdani"
}
if ($refresh.processedEvents -lt 1) {
    throw "publish-refresh did not process events."
}

Write-Host "4) Validate read-model snapshot"
$readModels = Invoke-RestMethod -Method GET -Uri "$BaseUrl/api/ingestion/read-models"
if (-not $readModels.homeTrending -or $readModels.homeTrending.Count -lt 1) {
    throw "homeTrending is empty."
}
if (-not $readModels.officialProfiles -or $readModels.officialProfiles.Count -lt 1) {
    throw "officialProfiles is empty."
}

Write-Host "5) Validate metrics snapshot"
$metrics = Invoke-RestMethod -Method GET -Uri "$BaseUrl/api/ingestion/metrics"
if ($metrics.publish.total -lt 1) {
    throw "publish.total is < 1."
}
if ($metrics.classifier.total -lt 1) {
    throw "classifier.total is < 1."
}

Write-Host "Phase 2 staging quickcheck passed."
Write-Host ("Summary: publish.total={0}, deadLetterRate={1}, classifier.total={2}" -f $metrics.publish.total, $metrics.publish.deadLetterRate, $metrics.classifier.total)
