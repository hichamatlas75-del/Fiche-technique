@echo off
title Mettre a jour le PC depuis GitHub
color 0B
cd /d "%~dp0"

echo ======================================================================
echo    GREY CORNER - RECUPERATION DES MODIFICATIONS DEPUIS GITHUB
echo ======================================================================
echo.
echo Telechargement des dernieres fiches techniques faites depuis le web...
git pull origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================================
    echo   [SUCCES] Votre ordinateur est parfaitement a jour avec GitHub !
    echo ======================================================================
) else (
    echo ======================================================================
    echo   [ATTENTION] Une erreur est survenue lors du telechargement.
    echo ======================================================================
)
echo.
pause
