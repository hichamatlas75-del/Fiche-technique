@echo off
chcp 65001 >nul
title Synchronisation Ventes Grey Corner -> GitHub
color 0B

echo =====================================================
echo   GREY CORNER - SYNCHRONISATION AUTOMATIQUE GITHUB
echo =====================================================
echo.

cd /d "%~dp0"

:: Si un fichier a ete glisse-depose directement sur ce script
if not "%~1"=="" (
    echo [*] Fichier depose detecte : %~nx1
    copy /y "%~1" "%~dp0ventes\%~nx1" >nul
    echo [OK] Copie dans le dossier ventes/ effectuee avec succes.
    echo.
)

echo [*] Verification des nouveaux fichiers dans ventes/...
git add ventes/
git diff --staged --quiet
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [i] Aucun nouveau fichier a synchroniser. Le dossier est deja a jour !
    echo.
    echo Fermeture dans 3 secondes...
    ping 127.0.0.1 -n 4 >nul
    exit /b 0
)

echo [*] Nouveau fichier detecte, preparation du commit...
git commit -m "Auto: ajout ventes du jour via synchroniseur"

echo [*] Synchronisation avec le depot distant...
git pull --rebase origin main

echo [*] Envoi en cours vers GitHub (git push)...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================
    echo   SUCCES : Le fichier est en ligne sur GitHub !
    echo   L'application Fiche-Technique est a jour.
    echo =====================================================
) else (
    echo.
    echo [!] Erreur lors du push vers GitHub. Verifiez votre connexion Internet.
)

echo.
echo Fermeture dans 4 secondes...
ping 127.0.0.1 -n 5 >nul
