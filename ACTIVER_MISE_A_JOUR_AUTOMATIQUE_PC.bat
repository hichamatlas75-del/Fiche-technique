@echo off
chcp 65001 >nul
title Activer la Mise a Jour Automatique du PC (Grey Corner)
color 0A

echo ======================================================================
echo    GREY CORNER - ACTIVATION DU TELECHARGEMENT AUTOMATIQUE SILENCIEUX
echo ======================================================================
echo.
echo Ce script configure Windows pour que votre dossier "ventes" se mette
echo a jour tout seul depuis GitHub :
echo  - A chaque demarrage / ouverture de votre session PC
echo  - Tous les jours a 08:15 (apres la synchronisation de 08:00)
echo.
echo Configuration en cours...

set "SCRIPT_VBS=%~dp0scripts\lancer_auto_pull_silencieux.vbs"

:: Creation de la tache planifiee Windows
schtasks /create /tn "GreyCorner_AutoPull_PC" /tr "wscript.exe \"%SCRIPT_VBS%\"" /sc onlogon /f >nul 2>&1
schtasks /create /tn "GreyCorner_AutoPull_Daily" /tr "wscript.exe \"%SCRIPT_VBS%\"" /sc daily /st 08:15 /f >nul 2>&1

:: Test immediat
wscript.exe "%SCRIPT_VBS%"

echo.
echo ======================================================================
echo   [SUCCES] L'automatisation PC est activee !
echo   Votre PC se mettra a jour automatiquement en arriere-plan.
echo   Vous n'avez plus besoin de cliquer sur METTRE_A_JOUR_PC.bat.
echo ======================================================================
echo.
pause
