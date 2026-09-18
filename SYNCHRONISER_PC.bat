@echo off
title Synchronisation Bi-directionnelle - Grey Corner
color 0E
cd /d "%~dp0"

echo ======================================================================
echo    GREY CORNER - SYNCHRONISATION COMPLETE (SUPABASE <-> PC <-> GITHUB)
echo ======================================================================
echo.
echo [1/4] Synchronisation des donnees depuis Supabase Cloud...
node scripts/pull-supabase.js 2>nul

echo.
echo [2/4] Telechargement des modifications faites depuis le web/mobile...
git pull --rebase origin main

echo.
echo [3/4] Verification des modifications locales du PC...
git add .
git commit -m "Synchronisation Supabase + PC <-> GitHub" 2>nul

echo.
echo [4/4] Envoi des modifications vers GitHub...
git push origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================================
    echo   [SUCCES] PC et GitHub sont maintenant 100% identiques et a jour !
    echo ======================================================================
) else (
    echo ======================================================================
    echo   [ATTENTION] Verifiez votre connexion ou l'etat Git.
    echo ======================================================================
)
echo.
pause
