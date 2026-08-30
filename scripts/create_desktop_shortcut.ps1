$w = New-Object -ComObject WScript.Shell
$desktopPath = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopPath "Synchroniser Ventes.lnk"
$batPath = "C:\Users\mplp000\OneDrive\Dokumente\GitHub\Fiche-technique\Synchroniser_Ventes.bat"

$s = $w.CreateShortcut($shortcutPath)
$s.TargetPath = $batPath
$s.WorkingDirectory = "C:\Users\mplp000\OneDrive\Dokumente\GitHub\Fiche-technique"
$s.IconLocation = "shell32.dll,238"
$s.Description = "Synchroniser les fichiers de vente Grey Corner avec GitHub"
$s.Save()

Write-Host "Raccourci cree avec succes sur le Bureau : $shortcutPath"
