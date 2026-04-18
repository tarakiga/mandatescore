param(
    [string]$InputPath = "jira/mandatescore-master-import.csv",
    [string]$OutputPath = "jira/mandatescore-dependency-edges.csv",
    [string]$Delimiter = "|",
    [string]$LinkType = "is blocked by"
)

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Input file not found: $InputPath"
}

$rows = Import-Csv -LiteralPath $InputPath
$edges = @{}

foreach ($row in $rows) {
    $issueKey = ($row.IssueKey | ForEach-Object { $_.Trim() })
    if ([string]::IsNullOrWhiteSpace($issueKey)) {
        continue
    }

    $dependsRaw = $row.DependsOn
    if ([string]::IsNullOrWhiteSpace($dependsRaw)) {
        continue
    }

    $depends = $dependsRaw.Split($Delimiter, [System.StringSplitOptions]::RemoveEmptyEntries)
    foreach ($dep in $depends) {
        $depKey = $dep.Trim()
        if ([string]::IsNullOrWhiteSpace($depKey)) {
            continue
        }

        $key = "$issueKey::$depKey::$LinkType"
        if (-not $edges.ContainsKey($key)) {
            $edges[$key] = [PSCustomObject]@{
                issue_key      = $issueKey
                depends_on_key = $depKey
                link_type      = $LinkType
            }
        }
    }
}

$result = $edges.Values | Sort-Object issue_key, depends_on_key, link_type
$result | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8

Write-Host ("Generated {0} dependency edges at: {1}" -f $result.Count, $OutputPath)
