@echo off
title Synchronisation Directe Fiches Techniques - Grey Corner
color 0A
cd /d "%~dp0"

echo ======================================================================
echo    GREY CORNER - ENREGISTREMENT DIRECT SUR LE CODEBASE GITHUB
echo ======================================================================
echo.
echo [1/3] Preparation des fichiers modifies...
git add .

echo.
echo [2/3] Creation du commit de mise a jour...
git commit -m "Mise a jour des fiches techniques et standards"

echo.
echo [3/3] Synchronisation et deploiement sur GitHub (origin/main)...
git pull --rebase origin main
git push origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================================
    echo   [SUCCES] Vos modifications sont enregistrees sur le Codebase !
    echo   Le site en ligne se met a jour automatiquement dans 30 secondes.
    echo ======================================================================
) else (
    echo ======================================================================
    echo   [ATTENTION] Une erreur est survenue lors de la synchronisation Git.
    echo ======================================================================
)
echo.
pause
