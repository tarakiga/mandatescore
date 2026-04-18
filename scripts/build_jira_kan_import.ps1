param(
    [string]$InputPath = "jira/mandatescore-master-import.csv",
    [string]$EpicsOutputPath = "jira/mandatescore-kan-epics-import.csv",
    [string]$TasksOutputPath = "jira/mandatescore-kan-tasks-import.csv"
)

<#
.SYNOPSIS
Build Jira team-managed (KAN) import CSVs from master roadmap CSV.

.DESCRIPTION
Outputs two files:
1) Epics import CSV
2) Tasks import CSV (Story converted to Task), with parent linkage via ParentExternalId.

Why ParentExternalId?
- Team-managed Jira uses Parent relationship instead of Epic Link.
- After importing epics, map ParentExternalId values to real Jira Epic keys
  and set the Parent field in a second import/update pass.
#>

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Input file not found: $InputPath"
}

$rows = Import-Csv -LiteralPath $InputPath
if (-not $rows) {
    throw "No rows found in input CSV: $InputPath"
}

# Build unique epic list from Epic column values in story rows.
$epicSet = @{}
foreach ($row in $rows) {
    $epicRef = ($row.Epic | ForEach-Object { $_.Trim() })
    if (-not [string]::IsNullOrWhiteSpace($epicRef)) {
        $epicSet[$epicRef] = $true
    }
}

$epics = $epicSet.Keys |
    Sort-Object |
    ForEach-Object {
        [PSCustomObject]@{
            ExternalId = $_
            Summary    = "$_ roadmap bucket"
            IssueType  = "Epic"
        }
    }

$tasks = foreach ($row in $rows) {
    $issueKey = ($row.IssueKey | ForEach-Object { $_.Trim() })
    $title = ($row.Title | ForEach-Object { $_.Trim() })
    if ([string]::IsNullOrWhiteSpace($issueKey) -or [string]::IsNullOrWhiteSpace($title)) {
        continue
    }

    [PSCustomObject]@{
        ExternalId       = $issueKey
        Summary          = $title
        IssueType        = "Task"
        Priority         = ($row.Priority | ForEach-Object { $_.Trim() })
        OwnerRole        = ($row.OwnerRole | ForEach-Object { $_.Trim() })
        SprintCode       = ($row.Sprint | ForEach-Object { $_.Trim() })
        DependsOnRaw     = ($row.DependsOn | ForEach-Object { $_.Trim() })
        ParentExternalId = ($row.Epic | ForEach-Object { $_.Trim() })
        OriginalType     = ($row.Type | ForEach-Object { $_.Trim() })
        OriginalSP       = ($row.SP | ForEach-Object { $_.Trim() })
    }
}

$epics | Export-Csv -LiteralPath $EpicsOutputPath -NoTypeInformation -Encoding UTF8
$tasks | Export-Csv -LiteralPath $TasksOutputPath -NoTypeInformation -Encoding UTF8

Write-Host ("Generated {0} epics at: {1}" -f $epics.Count, $EpicsOutputPath)
Write-Host ("Generated {0} tasks at: {1}" -f ($tasks | Measure-Object | Select-Object -ExpandProperty Count), $TasksOutputPath)
