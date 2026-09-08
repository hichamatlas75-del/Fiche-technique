@echo off
chcp 65001 >nul
title Desactiver la Mise a Jour Automatique du PC (Grey Corner)
color 0C

echo ======================================================================
echo    GREY CORNER - DESACTIVATION DU TELECHARGEMENT AUTOMATIQUE
echo ======================================================================
echo.
schtasks /delete /tn "GreyCorner_AutoPull_PC" /f >nul 2>&1
schtasks /delete /tn "GreyCorner_AutoPull_Daily" /f >nul 2>&1

echo [INFO] Les taches automatiques ont ete retirees.
echo Vous pouvez toujours utiliser METTRE_A_JOUR_PC.bat manuellement.
echo.
pause
