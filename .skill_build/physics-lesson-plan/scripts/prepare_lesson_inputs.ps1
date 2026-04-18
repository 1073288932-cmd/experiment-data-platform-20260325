param(
    [string]$InputDocx,
    [string]$LessonFileName,
    [string]$LessonKey,
    [string]$WorkDir
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillRoot = [System.IO.Path]::GetFullPath((Join-Path $scriptRoot ".."))

if (-not $WorkDir -or $WorkDir.Trim().Length -eq 0) {
    $WorkDir = (Get-Location).Path
}
$WorkDir = [System.IO.Path]::GetFullPath($WorkDir)
if (-not (Test-Path -LiteralPath $WorkDir)) {
    New-Item -ItemType Directory -Path $WorkDir | Out-Null
}

function Resolve-LessonDocx {
    param(
        [string]$InputDocx,
        [string]$LessonFileName
    )

    if ($InputDocx -and $InputDocx.Trim().Length -gt 0) {
        $candidate = [System.IO.Path]::GetFullPath($InputDocx)
        if (Test-Path -LiteralPath $candidate) { return $candidate }
        throw "InputDocx not found: $candidate"
    }

    if (-not $LessonFileName -or $LessonFileName.Trim().Length -eq 0) {
        throw "Provide InputDocx or LessonFileName. Do not use broad glob search."
    }

    $desktop = [Environment]::GetFolderPath("Desktop")
    $lessonFolderName = -join ([char]0x6559, [char]0x6848)
    $knownDirs = @(
        (Join-Path $desktop $lessonFolderName),
        $WorkDir,
        (Get-Location).Path
    )

    foreach ($dir in $knownDirs) {
        if (-not (Test-Path -LiteralPath $dir)) { continue }
        $candidate = Join-Path $dir $LessonFileName
        if (Test-Path -LiteralPath $candidate) {
            return [System.IO.Path]::GetFullPath($candidate)
        }
    }

    throw "Lesson file not found by exact lookup: $LessonFileName. Checked Desktop lesson folder and workspace only. Ask the user for the full path instead of using broad glob search."
}

function Guess-LessonKey {
    param([string]$Text)
    if ($Text -match "\u91CD\u529B|\u793A\u610F\u56FE") { return "gravity-force-diagram" }
    if ($Text -match "\u6DB2\u4F53.*\u538B\u5F3A|\u538B\u5F3A.*\u6DB2\u4F53") { return "liquid-pressure" }
    if ($Text -match "\u538B\u5F3A") { return "pressure" }
    if ($Text -match "\u6469\u64E6") { return "friction" }
    if ($Text -match "\u5F39\u529B|\u5F39\u7C27\u6D4B\u529B\u8BA1") { return "force-elastic-force" }
    if ($Text -match "\u76F8\u4E92") { return "interaction-of-forces" }
    return ""
}

$resolvedDocx = Resolve-LessonDocx -InputDocx $InputDocx -LessonFileName $LessonFileName
$docxExtract = Join-Path (Join-Path $WorkDir "docx_extract") "source-lesson.extracted.txt"

$docxScript = Join-Path $skillRoot "scripts\extract_docx_text.ps1"
& powershell -NoProfile -ExecutionPolicy Bypass -File $docxScript -InputDocx $resolvedDocx -OutputText $docxExtract | Out-Host

if (-not (Test-Path -LiteralPath $docxExtract)) {
    throw "DOCX extraction did not produce output: $docxExtract"
}

if (-not $LessonKey -or $LessonKey.Trim().Length -eq 0) {
    $fileNameText = [System.IO.Path]::GetFileNameWithoutExtension($resolvedDocx)
    $docxText = Get-Content -LiteralPath $docxExtract -Raw -Encoding UTF8
    $LessonKey = Guess-LessonKey ($fileNameText + "`n" + $docxText)
}

$textbookExtract = ""
if ($LessonKey -and $LessonKey.Trim().Length -gt 0) {
    $textbookExtract = Join-Path (Join-Path $WorkDir "textbook_extract") ($LessonKey + ".txt")
    $textbookScript = Join-Path $skillRoot "scripts\extract_textbook_section.ps1"
    & powershell -NoProfile -ExecutionPolicy Bypass -File $textbookScript -LessonKey $LessonKey -OutputText $textbookExtract | Out-Host
}

Write-Output "RESOLVED_INPUT_DOCX=$resolvedDocx"
Write-Output "DOCX_EXTRACT_OUTPUT=$docxExtract"
if ($LessonKey -and $LessonKey.Trim().Length -gt 0) {
    Write-Output "LESSON_KEY=$LessonKey"
    Write-Output "TEXTBOOK_EXTRACT_OUTPUT=$textbookExtract"
    Write-Output "STATUS=DOCX_AND_TEXTBOOK_EXTRACTED"
} else {
    Write-Output "LESSON_KEY="
    Write-Output "TEXTBOOK_EXTRACT_OUTPUT="
    Write-Output "STATUS=DOCX_EXTRACTED_TEXTBOOK_KEY_NOT_MATCHED"
}
