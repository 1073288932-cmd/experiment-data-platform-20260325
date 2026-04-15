param(
    [Parameter(Mandatory = $true)]
    [string]$InputJson
)

$ErrorActionPreference = "Stop"

$InputJson = [System.IO.Path]::GetFullPath($InputJson)
if (-not (Test-Path -LiteralPath $InputJson)) {
    throw "Input JSON not found: $InputJson"
}

$raw = Get-Content -LiteralPath $InputJson -Raw -Encoding UTF8
if ([string]::IsNullOrWhiteSpace($raw)) {
    throw "Input JSON is blank: $InputJson"
}

try {
    $data = $raw | ConvertFrom-Json
} catch {
    throw "Invalid JSON file. Fix the JSON file instead of passing JSON inline through PowerShell. Details: $($_.Exception.Message)"
}

if (-not $data.course) { throw "Input JSON must contain 'course'." }
if (-not $data.processRows -or @($data.processRows).Count -eq 0) {
    throw "Input JSON must contain at least one processRows item."
}
if ([string]::IsNullOrWhiteSpace([string]$data.course.objectives)) { throw "Input JSON must contain nonblank course.objectives." }
if ([string]::IsNullOrWhiteSpace([string]$data.board)) { throw "Input JSON must contain nonblank board." }
if ([string]::IsNullOrWhiteSpace([string]$data.homework)) { throw "Input JSON must contain nonblank homework." }
if ([string]::IsNullOrWhiteSpace([string]$data.reflection)) { throw "Input JSON must contain nonblank reflection." }

$requiredCourse = @(
    "theme",
    "date",
    "lessonType",
    "description",
    "contentAnalysis",
    "objectives",
    "evaluation",
    "keyDifficult",
    "breakthrough",
    "seatForm",
    "meansChecks",
    "methodChecks",
    "flowSummary"
)

foreach ($name in $requiredCourse) {
    if (-not ($data.course.PSObject.Properties.Name -contains $name)) {
        throw "Input JSON course object is missing '$name'."
    }
}

$rowIndex = 0
foreach ($row in @($data.processRows)) {
    $rowIndex++
    foreach ($name in @("stage", "activity", "intention")) {
        if (-not ($row.PSObject.Properties.Name -contains $name)) {
            throw "processRows[$rowIndex] is missing '$name'."
        }
        if ([string]::IsNullOrWhiteSpace([string]$row.$name)) {
            throw "processRows[$rowIndex].$name must be nonblank."
        }
    }
}

Write-Output "JSON validated: $InputJson"
Write-Output "Validated: course fields present; processRows = $(@($data.processRows).Count); objectives, board, homework, reflection are nonblank."
