@echo off
chcp 65001 >nul
title Synchronisation Ventes Grey Corner -> GitHub
color 0B

echo =====================================================
echo   GREY CORNER - SYNCHRONISATION AUTOMATIQUE GITHUB
echo =====================================================
echo.

cd /d "%~dp0"

:: 1. Si un fichier a ete glisse-depose directement sur ce script
if not "%~1"=="" (
    echo [*] Fichier depose detecte : %~nx1
    copy /y "%~1" "%~dp0ventes\%~nx1" >nul
    echo [OK] Copie dans le dossier ventes/ effectuee avec succes.
    echo.
)

:: 2. Mise a jour automatique du manifest.json
echo [*] Mise a jour de la liste des fichiers de ventes (manifest.json)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$dir = Join-Path (Get-Location) 'ventes'; if (Test-Path $dir) { $files = @(Get-ChildItem -Path $dir -File | Where-Object { ($_.Extension -eq '.xls' -or $_.Extension -eq '.xlsx') -and $_.Name -ne 'manifest.json' } | Select-Object -ExpandProperty Name | Sort-Object); $manifest = @{ files = $files; lastUpdated = (Get-Date -Format 'yyyy-MM-dd') }; ($manifest | ConvertTo-Json -Depth 4) | Set-Content -Path (Join-Path $dir 'manifest.json') -Encoding UTF8 }" >nul 2>&1

:: 3. Ajout des fichiers a Git
echo [*] Verification des fichiers et commits dans ventes/...
git add ventes/

:: 4. Commit s'il y a des nouveaux fichiers ou modifications
git diff --staged --quiet
if %ERRORLEVEL% NEQ 0 (
    echo [*] Nouveaux fichiers detectes, preparation du commit...
    git commit -m "Auto: ajout ventes du jour via synchroniseur"
)

:: 5. Verification de la connexion et synchronisation distante
echo [*] Synchronisation avec GitHub (git pull --rebase ^& git push)...
git pull --rebase origin main >nul 2>&1
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================
    echo   [SUCCES] Vos ventes sont synchronisees sur GitHub !
    echo   L'application Fiche-Technique est a jour.
    echo =====================================================
) else (
    echo.
    echo =====================================================
    echo   [!] Erreur lors de l'envoi vers GitHub.
    echo   Verifiez votre connexion Internet et reessayez.
    echo =====================================================
)

echo.
echo Fermeture dans 4 secondes...
ping 127.0.0.1 -n 5 >nul
