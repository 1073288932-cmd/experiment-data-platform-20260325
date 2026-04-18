param(
    [Parameter(Mandatory = $true)]
    [string]$InputDocx,

    [string]$OutputText
)

$ErrorActionPreference = "Stop"

$InputDocx = [System.IO.Path]::GetFullPath($InputDocx)
if (-not (Test-Path -LiteralPath $InputDocx)) {
    throw "Input DOCX not found: $InputDocx"
}

if (-not $OutputText -or $OutputText.Trim().Length -eq 0) {
    $OutputText = Join-Path (Join-Path (Get-Location).Path "docx_extract") "source-lesson.extracted.txt"
}
$OutputText = [System.IO.Path]::GetFullPath($OutputText)
$outputDir = Split-Path -Parent $OutputText
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

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

function Get-NodeText {
    param([System.Xml.XmlNode]$Node)
    $texts = @(Get-DescendantElements $Node "t" | ForEach-Object { $_.InnerText })
    return (($texts -join "") -replace "[`r`n`t]+", " ").Trim()
}

$zip = [System.IO.Compression.ZipFile]::OpenRead($InputDocx)
try {
    $entry = $zip.GetEntry("word/document.xml")
    if (-not $entry) {
        throw "DOCX package missing word/document.xml: $InputDocx"
    }

    $reader = New-Object System.IO.StreamReader($entry.Open(), [System.Text.Encoding]::UTF8)
    try {
        [xml]$xml = $reader.ReadToEnd()
    } finally {
        $reader.Dispose()
    }

    $lines = New-Object System.Collections.Generic.List[string]
    [void]$lines.Add("SOURCE_DOCX: $InputDocx")
    [void]$lines.Add("READ_METHOD: OOXML_ZIP_DOCUMENT_XML")
    [void]$lines.Add("")

    $body = Get-DescendantElements $xml.DocumentElement "body" | Select-Object -First 1
    if (-not $body) {
        throw "DOCX document body not found: $InputDocx"
    }

    $tableIndex = 0
    $paragraphIndex = 0
    foreach ($child in $body.ChildNodes) {
        if ($child.NodeType -ne [System.Xml.XmlNodeType]::Element) { continue }

        if ($child.LocalName -eq "p") {
            $text = Get-NodeText $child
            if ($text.Length -gt 0) {
                $paragraphIndex++
                [void]$lines.Add("P${paragraphIndex}: $text")
            }
        } elseif ($child.LocalName -eq "tbl") {
            [void]$lines.Add("")
            [void]$lines.Add("TABLE $tableIndex")
            $rows = @(Get-ChildElements $child "tr")
            for ($rowIndex = 0; $rowIndex -lt $rows.Count; $rowIndex++) {
                $cells = @(Get-ChildElements $rows[$rowIndex] "tc")
                $cellTexts = @()
                for ($cellIndex = 0; $cellIndex -lt $cells.Count; $cellIndex++) {
                    $cellText = Get-NodeText $cells[$cellIndex]
                    $cellTexts += $cellText
                }
                [void]$lines.Add(("ROW {0}: {1}" -f $rowIndex, ($cellTexts -join " | ")))
            }
            [void]$lines.Add("END_TABLE $tableIndex")
            [void]$lines.Add("")
            $tableIndex++
        }
    }

    Set-Content -LiteralPath $OutputText -Value $lines -Encoding UTF8
    Write-Output "DOCX extracted with OOXML ZIP method: $OutputText"
    Write-Output "Validated: word/document.xml read; tables = $tableIndex; paragraphs = $paragraphIndex."
} finally {
    $zip.Dispose()
}
