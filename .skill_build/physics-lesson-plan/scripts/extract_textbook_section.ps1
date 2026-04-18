param(
    [Parameter(Mandatory = $true)]
    [string]$LessonKey,

    [string]$OutputText
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillRoot = [System.IO.Path]::GetFullPath((Join-Path $scriptRoot ".."))
$textbookAssetsRoot = Join-Path $skillRoot "assets\textbooks"
$markdownFile = Get-ChildItem -LiteralPath $textbookAssetsRoot -Recurse -File -Filter "MinerU_markdown_*.md" | Select-Object -First 1
if (-not $markdownFile) {
    throw "Bundled textbook Markdown not found under: $textbookAssetsRoot"
}
$markdownPath = $markdownFile.FullName

if (-not (Test-Path -LiteralPath $markdownPath)) {
    throw "Bundled textbook Markdown not found: $markdownPath"
}

$map = @{
    "force-elastic-force" = @{ Start = 1039; End = 1248; Title = "chapter-7-lesson-1-force-elastic-force" }
    "gravity-force-diagram" = @{ Start = 1249; End = 1444; Title = "chapter-7-lesson-2-gravity-force-diagram" }
    "friction" = @{ Start = 1490; End = 1671; Title = "chapter-7-lesson-3-friction" }
    "interaction-of-forces" = @{ Start = 1672; End = 1745; Title = "chapter-7-lesson-4-interaction-of-forces" }
    "pressure" = @{ Start = 2472; End = 2670; Title = "chapter-9-lesson-1-pressure" }
    "liquid-pressure" = @{ Start = 2671; End = 2800; Title = "chapter-9-lesson-2-liquid-pressure" }
}

if (-not $map.ContainsKey($LessonKey)) {
    $valid = ($map.Keys | Sort-Object) -join ", "
    throw "Unknown LessonKey '$LessonKey'. Valid keys: $valid"
}

if (-not $OutputText -or $OutputText.Trim().Length -eq 0) {
    $OutputText = Join-Path (Join-Path (Get-Location).Path "textbook_extract") ($LessonKey + ".txt")
}
$OutputText = [System.IO.Path]::GetFullPath($OutputText)
$outputDir = Split-Path -Parent $OutputText
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$item = $map[$LessonKey]
$lines = Get-Content -LiteralPath $markdownPath -Encoding UTF8
$startIndex = [Math]::Max(0, [int]$item.Start - 1)
$endIndex = [Math]::Min($lines.Count - 1, [int]$item.End - 1)
if ($startIndex -gt $endIndex) {
    throw "Invalid line range for ${LessonKey}: $($item.Start)-$($item.End)"
}

$output = New-Object System.Collections.Generic.List[string]
[void]$output.Add("SOURCE_TEXTBOOK: $markdownPath")
[void]$output.Add("LESSON_KEY: $LessonKey")
[void]$output.Add("LESSON_TITLE: $($item.Title)")
[void]$output.Add("LINE_RANGE: $($item.Start)-$($item.End)")
[void]$output.Add("")
for ($i = $startIndex; $i -le $endIndex; $i++) {
    [void]$output.Add(("{0}: {1}" -f ($i + 1), $lines[$i]))
}

Set-Content -LiteralPath $OutputText -Value $output -Encoding UTF8
Write-Output "Textbook section extracted: $OutputText"
Write-Output "Validated: lesson key = $LessonKey; line range = $($item.Start)-$($item.End); source lines = $($endIndex - $startIndex + 1)."
