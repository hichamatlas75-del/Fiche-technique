@echo off
chcp 65001 >nul
title Synchronisation Ventes Mensuelles Grey Corner -> GitHub
color 0B

echo ================================================================
echo   GREY CORNER - CLASSEMENT PAR MOIS ^& SYNCHRONISATION GITHUB
echo ================================================================
echo.

cd /d "%~dp0"

:: 1. Si des fichiers ont ete glisses-deposes directement sur le .bat
:PROCESS_ARGS
if "%~1"=="" goto ORGANIZE_FILES
echo [*] Fichier depose detecte : %~nx1
copy /y "%~1" "%~dp0ventes\%~nx1" >nul
shift
goto PROCESS_ARGS

:ORGANIZE_FILES
:: 2. Classement automatique des fichiers dans ventes/YYYY-MM/ et generation de manifest.json
echo [*] Classement des fichiers par mois dans ventes/YYYY-MM/...
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    node "%~dp0scripts\organize_and_update_manifest.js"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\organize_and_update_manifest.ps1"
)

:: 3. Ajout des fichiers a Git
echo [*] Preparation des commits Git dans ventes/...
git add ventes/

:: 4. Commit s'il y a des nouveaux fichiers ou modifications
git diff --staged --quiet
if %ERRORLEVEL% NEQ 0 (
    echo [*] Nouveaux fichiers detectes, creation du commit...
    git commit -m "Auto: synchronisation ventes mensuelles classees par sous-dossiers"
) else (
    echo [i] Aucun nouveau fichier a commiter.
)

:: 5. Verification de la connexion et synchronisation distante
echo.
echo [*] Envoi vers GitHub (git pull --rebase ^& git push)...
git pull --rebase origin main >nul 2>&1
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo   [SUCCES] Vos ventes sont classees par mois et sur GitHub !
    echo   L'application Fiche-Technique et Cloudflare sont a jour.
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo   [!] Erreur lors de l'envoi vers GitHub.
    echo   Verifiez votre connexion Internet et vos droits d'acces.
    echo ================================================================
)

echo.
echo Fermeture dans 4 secondes...
ping 127.0.0.1 -n 5 >nul

