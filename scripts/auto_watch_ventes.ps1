# Script de surveillance automatique du dossier ventes/
# Dès qu'un fichier Excel y est déposé ou modifié, le script effectue automatiquement le commit et le git push.

$repoDir = Split-Path -Parent $PSScriptRoot
$ventesDir = Join-Path $repoDir "ventes"

if (-not (Test-Path $ventesDir)) {
    Write-Error "Le dossier $ventesDir n'existe pas."
    exit 1
}

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  GREY CORNER - SURVEILLANCE AUTOMATIQUE DU DOSSIER" -ForegroundColor Cyan
Write-Host "  Dossier surveille : $ventesDir" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Cyan

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $ventesDir
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$syncAction = {
    param($source, $eventArgs)
    $fileName = $eventArgs.Name
    $changeType = $eventArgs.ChangeType
    
    # Ne traiter que les fichiers Excel
    if ($fileName -match '\.(xlsx?|XLSX?)$' -and $fileName -notmatch 'manifest\.json') {
        Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Nouveau fichier detecte : $fileName ($changeType)" -ForegroundColor Green
        
        # Pause de 2 secondes pour s'assurer que l'enregistrement du fichier est complet
        Start-Sleep -Seconds 2
        
        Set-Location $repoDir
        
        # 1. Classement par mois et mise à jour complète et récursive de manifest.json
        $orgScript = Join-Path $PSScriptRoot "organize_and_update_manifest.ps1"
        if (Test-Path $orgScript) {
            & $orgScript
        }
        
        # 2. Ajout des fichiers et commit
        git add ventes/
        $staged = git diff --staged --name-only
        if ($staged) {
            git commit -m "Auto: ajout $fileName via surveillance automatique"
        }
        
        # 3. Synchronisation GitHub
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Envoi vers GitHub en cours..." -ForegroundColor Yellow
        git pull --rebase origin main 2>$null
        git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] SUCCES : $fileName est synchronise sur GitHub !" -ForegroundColor Green
        } else {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ERREUR lors du git push. Verifiez la connexion." -ForegroundColor Red
        }
    }
}

Register-ObjectEvent $watcher 'Created' -Action $syncAction | Out-Null
Register-ObjectEvent $watcher 'Changed' -Action $syncAction | Out-Null

Write-Host "`nPret ! Deposez simplement votre fichier Excel dans 'ventes', le push se fera tout seul." -ForegroundColor White
Write-Host "Laissez cette fenetre ouverte (ou utilisez le lanceur silencieux en arriere-plan)." -ForegroundColor Gray

try {
    while ($true) {
        Start-Sleep -Seconds 10
    }
} finally {
    Unregister-Event -SourceIdentifier * -ErrorAction SilentlyContinue
    $watcher.Dispose()
}
