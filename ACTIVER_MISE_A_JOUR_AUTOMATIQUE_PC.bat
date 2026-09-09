@echo off
chcp 65001 >nul
title Activer la Mise a Jour Automatique du PC (Grey Corner)
color 0A

echo ======================================================================
echo    GREY CORNER - ACTIVATION DU TELECHARGEMENT AUTOMATIQUE SILENCIEUX
echo ======================================================================
echo.
echo Configuration en cours...
echo  - Verification toutes les 30 minutes (08:00 a 22:00)
echo  - Rattrapage immediat des que le PC s'allume ou sort de veille
echo  - 100%% silencieux en arriere-plan
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "& schtasks.exe /create /tn 'GreyCorner_AutoPull_Daily' /tr 'wscript.exe \"\"%~dp0scripts\lancer_auto_pull_silencieux.vbs\"\"' /sc daily /st 08:00 /ri 30 /du 14:00 /f; ^
   $service = New-Object -ComObject('Schedule.Service'); ^
   $service.Connect(); ^
   $root = $service.GetFolder('\'); ^
   $task = $root.GetTask('GreyCorner_AutoPull_Daily'); ^
   $def = $task.Definition; ^
   $def.Settings.StartWhenAvailable = $true; ^
   $def.Settings.DisallowStartIfOnBatteries = $false; ^
   $def.Settings.StopIfGoingOnBatteries = $false; ^
   $def.Settings.ExecutionTimeLimit = 'PT10M'; ^
   $root.RegisterTaskDefinition('GreyCorner_AutoPull_Daily', $def, 6, $null, $null, 3) | Out-Null; ^
   $wsh = New-Object -ComObject WScript.Shell; ^
   $startup = [System.Environment]::GetFolderPath('Startup'); ^
   $lnk = $wsh.CreateShortcut((Join-Path $startup 'GreyCorner_AutoUpdate.lnk')); ^
   $lnk.TargetPath = 'wscript.exe'; ^
   $lnk.Arguments = '\"\"%~dp0scripts\lancer_auto_pull_silencieux.vbs\"\"'; ^
   $lnk.WorkingDirectory = '%~dp0'; ^
   $lnk.Save();"

:: Test immediat
wscript.exe "%~dp0scripts\lancer_auto_pull_silencieux.vbs"

echo.
echo ======================================================================
echo   [SUCCES] L'automatisation PC est activee et optimisee !
echo   Votre PC se synchronise toutes les 30 min et a chaque reveil.
echo ======================================================================
echo.
pause
