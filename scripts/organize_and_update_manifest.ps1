# ========================================================
# GREY CORNER — CLASSEMENT DES VENTES PAR MOIS (POWERSHELL)
# ========================================================

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ventesDir = Join-Path (Split-Path -Parent $scriptDir) 'ventes'

if (-not (Test-Path $ventesDir)) {
    New-Item -ItemType Directory -Path $ventesDir | Out-Null
}

# 1. Rangement des fichiers à la racine
$rootFiles = Get-ChildItem -Path $ventesDir -File | Where-Object { ($_.Extension -eq '.xls' -or $_.Extension -eq '.xlsx') -and $_.Name -ne 'manifest.json' }
$moved = 0

foreach ($f in $rootFiles) {
    $monthFolder = (Get-Date -Format 'yyyy-MM')
    if ($f.Name -match '(\d{4})(\d{2})\d{2}') {
        $monthFolder = "$($Matches[1])-$($Matches[2])"
    }

    $destFolder = Join-Path $ventesDir $monthFolder
    if (-not (Test-Path $destFolder)) {
        New-Item -ItemType Directory -Path $destFolder | Out-Null
    }

    Move-Item -Path $f.FullName -Destination (Join-Path $destFolder $f.Name) -Force
    Write-Host "[+] Fichier classé dans ventes/$monthFolder/ : $($f.Name)" -ForegroundColor Cyan
    $moved++
}

# 2. Collecte récursive de tous les fichiers
$allFiles = @()
Get-ChildItem -Path $ventesDir -Recurse -File | Where-Object { ($_.Extension -eq '.xls' -or $_.Extension -eq '.xlsx') -and $_.Name -ne 'manifest.json' } | ForEach-Object {
    $rel = $_.FullName.Substring($ventesDir.Length + 1).Replace('\', '/')
    $allFiles += $rel
}

$allFiles = $allFiles | Sort-Object

$manifestObj = @{
    totalFiles = $allFiles.Count
    lastUpdated = (Get-Date -Format 'yyyy-MM-dd')
    files = $allFiles
}

$json = ($manifestObj | ConvertTo-Json -Depth 4)
[System.IO.File]::WriteAllText((Join-Path $ventesDir 'manifest.json'), $json, [System.Text.Encoding]::UTF8)

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host " [OK] SYNCHRONISATION TERMINEE ($($allFiles.Count) fichiers trouves)" -ForegroundColor Green
Write-Host "======================================================`n" -ForegroundColor Green
