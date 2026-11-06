$repoDir = Split-Path -Parent $PSScriptRoot
$w = New-Object -ComObject WScript.Shell
$desktopPath = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopPath "Synchroniser Ventes.lnk"
$batPath = Join-Path $repoDir "Synchroniser_Ventes.bat"

$s = $w.CreateShortcut($shortcutPath)
$s.TargetPath = $batPath
$s.WorkingDirectory = $repoDir
$s.IconLocation = "shell32.dll,238"
$s.Description = "Synchroniser les fichiers de vente Grey Corner avec GitHub"
$s.Save()

Write-Host "Raccourci cree avec succes sur le Bureau : $shortcutPath"
