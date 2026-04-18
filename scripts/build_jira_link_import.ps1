param(
    [string]$InputPath = "jira/mandatescore-dependency-edges.csv",
    [string]$OutputPath = "jira/mandatescore-jira-link-import.csv",
    [string]$JiraLinkType = "Blocks",
    [string]$Direction = "dependency_to_issue"
)

<#
.SYNOPSIS
Builds a Jira-friendly issue link CSV from dependency edges.

.DESCRIPTION
Input edge row semantics:
- issue_key depends_on_key (link_type usually "is blocked by")

Direction options:
- dependency_to_issue (default):
  - outwardIssue = depends_on_key
  - inwardIssue  = issue_key
  Meaning: dependency "Blocks" issue.

- issue_to_dependency:
  - outwardIssue = issue_key
  - inwardIssue  = depends_on_key
  Meaning: issue "Blocks" dependency (usually not desired for dependency modeling).
#>

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Input file not found: $InputPath"
}

$rows = Import-Csv -LiteralPath $InputPath
$out = New-Object System.Collections.Generic.List[Object]

foreach ($row in $rows) {
    $issueKey = ($row.issue_key | ForEach-Object { $_.Trim() })
    $depKey = ($row.depends_on_key | ForEach-Object { $_.Trim() })

    if ([string]::IsNullOrWhiteSpace($issueKey) -or [string]::IsNullOrWhiteSpace($depKey)) {
        continue
    }

    if ($Direction -eq "dependency_to_issue") {
        $outward = $depKey
        $inward = $issueKey
    }
    elseif ($Direction -eq "issue_to_dependency") {
        $outward = $issueKey
        $inward = $depKey
    }
    else {
        throw "Invalid Direction '$Direction'. Use 'dependency_to_issue' or 'issue_to_dependency'."
    }

    $out.Add([PSCustomObject]@{
        outwardIssue = $outward
        inwardIssue  = $inward
        linkType     = $JiraLinkType
    })
}

$out |
    Sort-Object outwardIssue, inwardIssue, linkType |
    Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8

Write-Host ("Generated {0} Jira link rows at: {1}" -f $out.Count, $OutputPath)
