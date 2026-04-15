param(
    [Parameter(Mandatory = $true)]
    [string]$InputJson,

    [Parameter(Mandatory = $true)]
    [string]$OutputDocx,

    [string]$TemplatePath
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $TemplatePath -or $TemplatePath.Trim().Length -eq 0) {
    $TemplatePath = Join-Path $scriptRoot "..\assets\templates\lesson-template.docx"
}

$TemplatePath = [System.IO.Path]::GetFullPath($TemplatePath)
$InputJson = [System.IO.Path]::GetFullPath($InputJson)
$OutputDocx = [System.IO.Path]::GetFullPath($OutputDocx)

if (-not (Test-Path -LiteralPath $TemplatePath)) {
    throw "Template not found: $TemplatePath"
}
if (-not (Test-Path -LiteralPath $InputJson)) {
    throw "Input JSON not found: $InputJson"
}

$outputDir = Split-Path -Parent $OutputDocx
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$data = Get-Content -LiteralPath $InputJson -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not $data.course) { throw "Input JSON must contain 'course'." }
if (-not $data.processRows -or @($data.processRows).Count -eq 0) {
    throw "Input JSON must contain at least one processRows item."
}
if ([string]::IsNullOrWhiteSpace([string]$data.course.objectives)) { throw "Input JSON must contain nonblank course.objectives." }
if ([string]::IsNullOrWhiteSpace([string]$data.board)) { throw "Input JSON must contain nonblank board." }
if ([string]::IsNullOrWhiteSpace([string]$data.homework)) { throw "Input JSON must contain nonblank homework." }
if ([string]::IsNullOrWhiteSpace([string]$data.reflection)) { throw "Input JSON must contain nonblank reflection." }

Copy-Item -LiteralPath $TemplatePath -Destination $OutputDocx -Force
Set-ItemProperty -LiteralPath $OutputDocx -Name IsReadOnly -Value $false

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$wordNs = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
$xmlNs = "http://www.w3.org/XML/1998/namespace"

function Add-NamespaceManager {
    param([xml]$Xml)
    $manager = New-Object System.Xml.XmlNamespaceManager($Xml.NameTable)
    $manager.AddNamespace("w", $wordNs) | Out-Null
    return $manager
}

function New-WElement {
    param(
        [xml]$Xml,
        [string]$Name
    )
    return $Xml.CreateElement("w", $Name, $wordNs)
}

function Set-CellText {
    param(
        [xml]$Xml,
        [System.Xml.XmlElement]$Cell,
        [AllowNull()][object]$Value
    )

    $text = ""
    if ($null -ne $Value) { $text = [string]$Value }

    $tcPr = $null
    foreach ($child in @($Cell.ChildNodes)) {
        if ($child.LocalName -eq "tcPr") {
            $tcPr = $child.CloneNode($true)
            break
        }
    }

    $Cell.RemoveAll()
    if ($tcPr) {
        [void]$Cell.AppendChild($Xml.ImportNode($tcPr, $true))
    }

    $paragraphs = $text -split "(`r`n|`n|`r)"
    if ($paragraphs.Count -eq 0) { $paragraphs = @("") }

    foreach ($line in $paragraphs) {
        if ($line -match "^(`r`n|`n|`r)$") { continue }
        $p = New-WElement $Xml "p"
        $r = New-WElement $Xml "r"
        $t = New-WElement $Xml "t"
        $space = $Xml.CreateAttribute("xml", "space", $xmlNs)
        $space.Value = "preserve"
        [void]$t.Attributes.Append($space)
        $t.InnerText = [string]$line
        [void]$r.AppendChild($t)
        [void]$p.AppendChild($r)
        [void]$Cell.AppendChild($p)
    }
}

function Get-RowCells {
    param(
        [System.Xml.XmlElement]$Row
    )
    return @(Get-ChildElements $Row "tc")
}

function Get-ChildElements {
    param(
        [System.Xml.XmlNode]$Node,
        [string]$LocalName
    )
    $items = @()
    foreach ($child in $Node.ChildNodes) {
        if ($child.NodeType -eq [System.Xml.XmlNodeType]::Element -and $child.LocalName -eq $LocalName) {
            $items += $child
        }
    }
    return $items
}

function Get-DescendantElements {
    param(
        [System.Xml.XmlNode]$Node,
        [string]$LocalName
    )
    $items = @()
    foreach ($child in $Node.ChildNodes) {
        if ($child.NodeType -eq [System.Xml.XmlNodeType]::Element) {
            if ($child.LocalName -eq $LocalName) {
                $items += $child
            }
            $items += @(Get-DescendantElements $child $LocalName)
        }
    }
    return $items
}

function Set-RowValues {
    param(
        [xml]$Xml,
        [System.Xml.XmlElement]$Row,
        [object[]]$Values
    )
    $cells = Get-RowCells $Row
    for ($i = 0; $i -lt $cells.Count -and $i -lt $Values.Count; $i++) {
        Set-CellText $Xml $cells[$i] $Values[$i]
    }
}

function Mark-Option {
    param(
        [object[]]$Selected,
        [string]$Name
    )
    if ($Selected -contains $Name) { return [string]([char]0x221A) }
    return ""
}

function Normalize-List {
    param([AllowNull()][object]$Value)
    if ($null -eq $Value) { return @() }
    if ($Value -is [System.Array]) { return @($Value) }
    return @($Value)
}

$zip = [System.IO.Compression.ZipFile]::Open($OutputDocx, [System.IO.Compression.ZipArchiveMode]::Update)
try {
    $entry = $zip.GetEntry("word/document.xml")
    if (-not $entry) { throw "DOCX package missing word/document.xml." }

    $reader = New-Object System.IO.StreamReader($entry.Open(), [System.Text.Encoding]::UTF8)
    try { $documentXml = $reader.ReadToEnd() } finally { $reader.Dispose() }

    [xml]$xml = $documentXml
    $tables = @(Get-DescendantElements $xml.DocumentElement "tbl")
    if ($tables.Count -ne 3) {
        throw "Template validation failed: expected exactly 3 tables, found $($tables.Count)."
    }

    $table0 = $tables[0]
    $table1 = $tables[1]
    $table2 = $tables[2]
    $rows0 = @(Get-ChildElements $table0 "tr")
    $rows1 = @(Get-ChildElements $table1 "tr")
    $rows2 = @(Get-ChildElements $table2 "tr")

    if ($rows0.Count -ne 14) { throw "Template validation failed: table 0 expected 14 rows, found $($rows0.Count)." }
    if ($rows1.Count -lt 2) { throw "Template validation failed: table 1 must contain a header row and a blank process row." }
    if ($rows2.Count -ne 4) { throw "Template validation failed: table 2 expected 4 rows, found $($rows2.Count)." }

    $course = $data.course
    $means = Normalize-List $course.meansChecks
    $methods = Normalize-List $course.methodChecks

    Set-RowValues -Xml $xml -Row ($rows0[0]) -Values @("", "", $course.theme, "", $course.date)
    Set-RowValues -Xml $xml -Row ($rows0[1]) -Values @("", "", $course.lessonType)
    Set-RowValues -Xml $xml -Row ($rows0[2]) -Values @("", "", $course.description)
    Set-RowValues -Xml $xml -Row ($rows0[3]) -Values @("", "", $course.contentAnalysis)
    Set-RowValues -Xml $xml -Row ($rows0[4]) -Values @("", "", $course.objectives, "", $course.evaluation)
    Set-RowValues -Xml $xml -Row ($rows0[5]) -Values @("", "", $course.keyDifficult, "", $course.breakthrough)
    Set-RowValues -Xml $xml -Row ($rows0[6]) -Values @("", "", $course.seatForm)
    Set-RowValues -Xml $xml -Row ($rows0[8]) -Values @("", "", (Mark-Option $means "ppt"), (Mark-Option $means "worksheet"), (Mark-Option $means "micro-video"), (Mark-Option $means "image"), (Mark-Option $means "model"), (Mark-Option $means "object"), (Mark-Option $means "experiment"), (Mark-Option $means "it"))
    Set-RowValues -Xml $xml -Row ($rows0[10]) -Values @("", "", (Mark-Option $methods "lecture"), (Mark-Option $methods "dialogue"), (Mark-Option $methods "cooperation"), (Mark-Option $methods "practice"), (Mark-Option $methods "experiment"), (Mark-Option $methods "modeling"), (Mark-Option $methods "project"))
    if ($course.flowSummary) {
        Set-RowValues -Xml $xml -Row ($rows0[13]) -Values @($course.flowSummary)
    }

    $blankProcessRow = $rows1[1].CloneNode($true)
    [void]$table1.RemoveChild($rows1[1])
    foreach ($processRow in @($data.processRows)) {
        $newRow = $blankProcessRow.CloneNode($true)
        Set-RowValues -Xml $xml -Row $newRow -Values @($processRow.stage, $processRow.activity, $processRow.intention)
        [void]$table1.AppendChild($newRow)
    }

    $boardCells = @(Get-RowCells ($rows2[1]))
    if ($boardCells.Count -lt 1) { throw "Template validation failed: board row has no writable cell." }
    Set-CellText -Xml $xml -Cell ($boardCells[0]) -Value $data.board
    Set-RowValues -Xml $xml -Row ($rows2[2]) -Values @("", $data.homework)
    Set-RowValues -Xml $xml -Row ($rows2[3]) -Values @("", $data.reflection)

    $settings = New-Object System.Xml.XmlWriterSettings
    $settings.Encoding = New-Object System.Text.UTF8Encoding($false)
    $settings.Indent = $false
    $memory = New-Object System.IO.MemoryStream
    $writer = [System.Xml.XmlWriter]::Create($memory, $settings)
    try { $xml.Save($writer) } finally { $writer.Close() }

    $entry.Delete()
    $newEntry = $zip.CreateEntry("word/document.xml")
    $stream = $newEntry.Open()
    try {
        $bytes = $memory.ToArray()
        $stream.Write($bytes, 0, $bytes.Length)
    } finally {
        $stream.Dispose()
        $memory.Dispose()
    }
} finally {
    $zip.Dispose()
}

$checkZip = [System.IO.Compression.ZipFile]::OpenRead($OutputDocx)
try {
    if (-not $checkZip.GetEntry("word/document.xml")) {
        throw "Output validation failed: word/document.xml missing after write."
    }
    $entry = $checkZip.GetEntry("word/document.xml")
    $reader = New-Object System.IO.StreamReader($entry.Open(), [System.Text.Encoding]::UTF8)
    try { [xml]$checkXml = $reader.ReadToEnd() } finally { $reader.Dispose() }
    $checkTables = @(Get-DescendantElements $checkXml.DocumentElement "tbl")
    if ($checkTables.Count -ne 3) {
        throw "Output validation failed: expected 3 tables, found $($checkTables.Count)."
    }
    $processRows = @(Get-ChildElements $checkTables[1] "tr").Count
    $expectedRows = @($data.processRows).Count + 1
    if ($processRows -ne $expectedRows) {
        throw "Output validation failed: process table expected $expectedRows rows, found $processRows."
    }
} finally {
    $checkZip.Dispose()
}

Write-Output "Template copied and filled: $OutputDocx"
Write-Output "Validated: 3 tables; process table rows = $expectedRows; word/document.xml exists."
