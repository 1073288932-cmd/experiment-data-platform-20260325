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

$processText = (@($data.processRows) | ForEach-Object { [string]$_.activity }) -join "`n"
$activityPattern = "\u6D3B\u52A8[\u4E00\u4E8C\u4E09\u56DB\u4E941-5]"
$questionPattern = "(\u95EE\u9898\d+|\u6838\u5FC3\u95EE\u9898|\u9012\u8FDB\u578B\u95EE\u9898|\u63A2\u7A76\u578B\u95EE\u9898|\u8FC7\u6E21\u578B\u95EE\u9898|\u8FC1\u79FB\u578B\u95EE\u9898)"
$teacherPattern = "\u5E08\uFF1A"
$studentPattern = "\u751F\uFF1A"
$studentWordPattern = "\u5B66\u751F"
$circulationPattern = "(\u6559\u5E08\u5DE1\u89C6|\u5DE1\u89C6|\u6559\u5E08\u6307\u5BFC|\u5DE1\u56DE\u6307\u5BFC)"
$followupPattern = "(\u8FFD\u95EE|\u7EE7\u7EED\u8FFD\u95EE|\u53CD\u95EE)"
$feedbackPattern = "(\u53CD\u9988|\u8BC4\u4EF7|\u7EA0\u6B63|\u70B9\u62E8)"
$transitionPattern = "(\u8FC7\u6E21|\u5F15\u51FA|\u8F6C\u5165|\u81EA\u7136\u8FDB\u5165|\u94FA\u57AB)"
$actionPattern = "(\u5B66\u751F[^。；\n]*(\u89C2\u5BDF|\u8BA8\u8BBA|\u64CD\u4F5C|\u8BB0\u5F55|\u6C47\u62A5|\u7ED8\u5236|\u8BA1\u7B97|\u6BD4\u8F83|\u5206\u6790|\u4EA4\u6D41|\u4FEE\u6B63)|\u6559\u5E08[^。；\n]*(\u5DE1\u89C6|\u6307\u5BFC|\u70B9\u62E8|\u677F\u4E66|\u8FFD\u95EE|\u53CD\u9988|\u7EA0\u6B63|\u5F15\u5BFC))"

if ($processText -notmatch $activityPattern) {
    throw "Teaching process must keep activity anchors such as activity one."
}
if ($processText -notmatch $questionPattern) {
    throw "Teaching process must keep question anchors such as question one or typed question-chain labels."
}
if ($processText -notmatch $teacherPattern) {
    throw "Teaching process must contain teacher dialogue marked with teacher colon."
}
if ($processText -notmatch $studentPattern) {
    throw "Teaching process must contain student dialogue marked with student colon."
}
if ($processText -notmatch $studentWordPattern) {
    throw "Teaching process must describe concrete student actions, not only answers."
}
if ($processText -notmatch $circulationPattern) {
    throw "Teaching process must include teacher circulation or monitoring."
}
if ($processText -notmatch $followupPattern) {
    throw "Teaching process must include teacher follow-up questioning."
}
if ($processText -notmatch $feedbackPattern) {
    throw "Teaching process must include teacher feedback, evaluation, correction, or guidance."
}
if ($processText -notmatch $transitionPattern) {
    throw "Teaching process must include transition language between activities or concepts."
}

$teacherTurns = ([regex]::Matches($processText, $teacherPattern)).Count
$studentTurns = ([regex]::Matches($processText, $studentPattern)).Count
$actionSignals = ([regex]::Matches($processText, $actionPattern)).Count
if (($teacherTurns + $studentTurns) -ge 8 -and $actionSignals -lt 4) {
    throw "Teaching process looks like a rigid Q&A script. Add natural classroom implementation language: student operations, teacher circulation, follow-up, feedback, and transitions."
}

Write-Output "JSON validated: $InputJson"
Write-Output "Validated: course fields present; processRows = $(@($data.processRows).Count); objectives, board, homework, reflection are nonblank; teaching-process style anchors and classroom-action signals are present."
