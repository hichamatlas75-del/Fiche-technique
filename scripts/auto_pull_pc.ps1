# GREY CORNER - TELECHARGEMENT AUTOMATIQUE SILENCIEUX DES VENTES DEPUIS GITHUB
$ErrorActionPreference = "SilentlyContinue"

$repoDir = Split-Path -Parent $PSScriptRoot
$logFile = Join-Path $PSScriptRoot "auto_pull.log"

function Add-LogEntry($message) {
    $now = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $entry = "[$now] $message"
    Add-Content -Path $logFile -Value $entry -Encoding UTF8 -ErrorAction SilentlyContinue
}

try {
    Set-Location $repoDir

    # Execution du git pull avec timeout rapide
    $pullOutput = git pull origin main 2>&1 | Out-String
    $clean = $pullOutput.Trim()

    if ($clean -match "Already up to date" -or $clean -match "jour") {
        Add-LogEntry "[OK] PC deja a jour avec GitHub."
    } elseif ($clean -match "Updating" -or $clean -match "Fast-forward") {
        Add-LogEntry "[MAJ] Nouvelles ventes telechargees avec succes !"
    } elseif ($clean -match "Could not resolve" -or $clean -match "Failed to connect") {
        Add-LogEntry "[WARN] Pas de connexion Internet. Prochain essai planifie."
    } else {
        Add-LogEntry "[INFO] $clean"
    }

    # Conserver uniquement les 60 dernieres lignes de logs
    if (Test-Path $logFile) {
        $lines = Get-Content -Path $logFile -ErrorAction SilentlyContinue
        if ($lines.Count -gt 60) {
            $lines | Select-Object -Last 60 | Set-Content -Path $logFile -Encoding UTF8 -ErrorAction SilentlyContinue
        }
    }
} catch {
    Add-LogEntry "[ERREUR] Exception : $($_.Exception.Message)"
}
