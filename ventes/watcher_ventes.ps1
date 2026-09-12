# ================================================================
# GREY CORNER — Watcher Automatique des Ventes Journalières
# ================================================================
# Ce script surveille le dossier "ventes\" en temps réel.
# Quand un nouveau fichier XLSX est déposé par le logiciel de caisse
# après la fermeture, il est automatiquement converti en JSON
# compatible avec SYNTHESE_DECISIONNELLE_MENU.html
#
# RÈGLE D'EXCLUSION STRICTE :
#   Toutes les données de l'ANCIEN MENU (Janvier, Février, Mars 2026 < 01/04/2026)
#   sont STRICTEMENT EXCLUES et ignorées.
#   Seules les ventes du menu actuel (POST-MARS 2026) sont traitées.
#
# USAGE : Lancer une fois, laisser tourner en arrière-plan
#   powershell -ExecutionPolicy Bypass -File watcher_ventes.ps1
#
# PRÉREQUIS : Module ImportExcel (install automatique si absent)
# ================================================================

param (
    [switch]$ScanPostMarsArchive  # Option pour réagréger tous les dossiers post-mars (2026-04 à 2026-09)
)

$watchDir   = Join-Path $PSScriptRoot ""
$outputFile = Join-Path $PSScriptRoot "ventes_du_jour.json"
$logDir     = Join-Path $PSScriptRoot "logs"
$logFile    = Join-Path $logDir ("watcher_" + (Get-Date -Format "yyyy-MM") + ".log")

# Ensure log directory exists
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

function Write-Log($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] $msg"
    Write-Host $line
    Add-Content -Path $logFile -Value $line -Encoding UTF8
}

# Install ImportExcel module if not present
if (-not (Get-Module -ListAvailable -Name ImportExcel)) {
    Write-Log "Installation du module ImportExcel..."
    try {
        Install-Module -Name ImportExcel -Force -Scope CurrentUser -AllowClobber
        Write-Log "Module ImportExcel installé."
    } catch {
        Write-Log "ERREUR installation ImportExcel : $_"
        Write-Log "Tentative via pip xlrd (fallback)..."
    }
}

# ---------------------------------------------------------------
# RÈGLE ANCIEN MENU : Exclusion stricte Janvier, Février, Mars 2026
# Le menu actuel officiel est entré en vigueur le 01 Avril 2026.
# Tout fichier, dossier ou transaction antérieur au 01/04/2026 est exclu.
# ---------------------------------------------------------------
function Test-IsOldMenuFile([string]$path, [string]$name) {
    $p = "$path".ToLower()
    $n = "$name".ToLower()

    # 1. Dossiers de l'ancien menu (2026-01, 2026-02, 2026-03)
    if ($p -match '(\\|/)2026-0?([1-3])(\\|/)' -or $p -like "*\2026-01\*" -or $p -like "*\2026-02\*" -or $p -like "*\2026-03\*") {
        return @{ IsOld = $true; Reason = "Dossier Ancien Menu (2026-01, 2026-02 ou 2026-03)" }
    }

    # 2. Nom de fichier horodaté en Janvier, Février ou Mars (ex: 20260101, 20260215, 20260331)
    if ($n -match '20260?([1-3])\d{2}') {
        $m = [int]$matches[1]
        if ($m -in 1..3) {
            return @{ IsOld = $true; Reason = "Date dans le nom de fichier ($($matches[0])) antérieure au 01 Avril 2026" }
        }
    }

    # 3. Format 2026-01, 2026-02, 2026-03 dans le nom
    if ($n -match '2026-0?([1-3])[-_]') {
        return @{ IsOld = $true; Reason = "Mois de l'ancien menu ($($matches[0])) dans le nom de fichier" }
    }

    # 4. Mots-clés explicites de mois de l'ancien menu
    if ($n -match '\b(janvier|fevrier|février|mars|january|february|march)\b') {
        return @{ IsOld = $true; Reason = "Mois de l'ancien menu détecté dans le libellé" }
    }

    return @{ IsOld = $false; Reason = "" }
}

# ---------------------------------------------------------------
# Liste Noire des Articles Spécifiques à l'Ancien Menu
# Ces articles de l'ancien menu (T1 2026) n'existent plus dans
# la carte post-mars et ne doivent jamais être intégrés.
# ---------------------------------------------------------------
$OLD_MENU_ARTICLES = @(
    "MIEL", "2 OEUFS", "OMLETTE NATURE", "OMLETTE FR CHARCUTERIE", "6 CROQUETTES FROMAGE",
    "AMLOU", "AMUSE BOUCHE", "BANANE ORANGE", "CAFE PERSONNEL", "CAFE AU LAIT PERSONNEL",
    "CAFE DOUBLE", "CAFE MOITIE", "CAFE SEPARE", "2 BOULE DE GLACE", "3 BOULES DE GLACE",
    "BOULE DE GLACE", "SUPPLEMENT OEUF BELDI", "SUPPLEMENT CHARCUTERIE", "SUPPLEMENT FROMAGE",
    "THE PERSONNEL", "JUS PERSONNEL", "MENU PERSONNEL"
)

# ---------------------------------------------------------------
# Mapping ID → Nom pour reconnaissance automatique des 193 plats
# de la carte ACTUELLE (POST-MARS 2026)
# ---------------------------------------------------------------
$MENU_NAME_TO_ID = @{
    "BRUNCH DUO"                                    = "f606ba70"
    "BRUNCH GREYCORNER"                             = "52e4ef86"
    "AMERICAIN"                                     = "b35d099b"
    "NORVEGIEN"                                     = "16cebd6f"
    "NORVÉGIEN"                                     = "16cebd6f"
    "ESPAGNOL"                                      = "bfe13ada"
    "MQUILA MERGUEZ"                                = "45be5a1f"
    "MQUILA-FRUITS DE MER"                         = "200a05ed"
    "OMELETTE DU CHEF"                              = "3c1696d2"
    "HOLLANDAIS"                                    = "67861d9d"
    "OMELETTE VEGETARIENNE"                         = "630fad4f"
    "BERBERE"                                       = "d838bed8"
    "COMPAGNARD"                                    = "pet_compagnard_12"
    "FASSI"                                         = "bc60875d"
    "OMELETTE CONTINENTAL"                          = "23a0f3a2"
    "OMELETTE FROMAGE"                              = "8947e8bb"
    "BELDI"                                         = "c4189160"
    "OMELETTE NATURE"                               = "7636c161"
    "LIGHT"                                         = "79007bd5"
    "EXPRESS"                                       = "c83522e3"
    "MENU ENFANT PD"                                = "pet_menuenfant_20"
    "BURRATTA"                                      = "931795f2"
    "BURRATA ENTREE"                                = "931795f2"
    "TERRE MER"                                     = "6c616326"
    "TARTARE SAUMON"                                = "6c9f2afd"
    "QUINOA"                                        = "2413d39b"
    "CESAR"                                         = "72ee54b5"
    "RUSSE"                                         = "b966de76"
    "CERCLE VEGGI"                                  = "d3ae6551"
    "CROUSTILLON GAMBAS"                            = "951d6f6f"
    "PIL PIL ESPAGNOL"                              = "74eeb191"
    "BOULETTES DE POULET FROMAGE"                   = "3dda61a1"
    "PAVE DE SAUMON"                                = "1d205276"
    "PAVÉ DE SAUMON"                                = "1d205276"
    "FILET DE BOEUF ATLAS"                          = "8199932a"
    "ROULADE BOEUF"                                 = "51d94c5a"
    "FILET DE BOEUF EMINCE"                         = "e336c172"
    "SUPREME DE POULET"                             = "48c27427"
    "ESCALOPE MILANAISE"                            = "4c4c53d3"
    "BROCHETTES DE POULET"                          = "59d7c3ba"
    "EMINCE DE POULET CHAMPIGNONS"                  = "15ab9bd7"
    "BALLOTINE DE POULET"                           = "a3457e60"
    "MENU ENFANT PLAT"                              = "109e0422"
    "COUSCOUS VIANDE"                               = "f5568705"
    "COUSCOUS POULET"                               = "2d4954ac"
    "SANDWICH CHEESE STEAK"                         = "bbbfbf94"
    "FRUITS DE MER SANDWICH"                        = "san_fruitsdeme_45"
    "POULARD"                                       = "029899a7"
    "POULET CRUNCHY"                                = "3266f865"
    "VIANDE HACHEE SANDWICH"                        = "san_viandehach_48"
    "POULET SANDWICH"                               = "san_poulet_49"
    "THON SANDWICH"                                 = "san_thon_50"
    "CHICKEN BURGER"                                = "c02cdaa8"
    "BURGER ROYAL"                                  = "c93641d1"
    "BIG BURGER"                                    = "50c31f33"
    "EGG CHEESEBURGER"                              = "7833bd8a"
    "CHEESE BURGER"                                 = "1131e545"
    "AVOCADO FORESTIER"                             = "2fc98edf"
    "FRUIT DE MER PANINI"                           = "a963b039"
    "SAUMON PANINI"                                 = "pan_saumon_58"
    "MIXTE PANINI"                                  = "a2351075"
    "VIANDE HACHEE PANINI"                          = "pan_viandehach_60"
    "CHARCUTERIE PANINI"                            = "667b376b"
    "POULET PANINI"                                 = "63489054"
    "WRAP POULET"                                   = "48fb1cf5"
    "WRAP VIANDE HACHEE"                            = "d4dca0fd"
    "WRAP GOURMAND"                                 = "9a2a15fd"
    "PIZZA SAUMON"                                  = "piz_saumon_66"
    "PIZZA FRUITS DE MER"                           = "piz_fruitsdeme_67"
    "PIZZA 4 SAISONS"                               = "2c0ab4a2"
    "PIZZA MOITIE MOITIE"                           = "52617320"
    "PIZZA BURRATA"                                 = "92568030"
    "PIZZA POULET"                                  = "9fb4f4ef"
    "PIZZA 5 FROMAGES"                              = "aae90257"
    "PIZZA VIANDE HACHEE"                           = "f59f863c"
    "PIZZA PEPPERONI"                               = "c0861588"
    "PIZZA REGINA"                                  = "c4ac65c9"
    "PIZZA THON"                                    = "eda1b1db"
    "PIZZA VEGETARIENNE"                            = "a7c2005f"
    "PIZZA MARGARITA"                               = "b3a02657"
    "PASTA SAUMON"                                  = "a67ad52b"
    "PASTA FRUITS DE MER"                           = "72e8b0e0"
    "PASTA POULET CHAMPIGNON"                       = "a4197610"
    "REGATONI RICOTTA"                              = "1c0a9132"
    "PASTA BOLOGNAISE"                              = "5c8a7b01"
    "PASTA CARBONARA"                               = "7d1cd22f"
    "PASTA 5 FROMAGES"                              = "163fbfa8"
    "PASTA VEGETARIEN"                              = "35ebd854"
    "LASAGNE POULET"                                = "f1fa7f97"
    "LASAGNE BOLOGNAISE"                            = "3a87eb07"
    "LASAGNE FRUITS DE MER"                         = "4f2ec5bc"
    "CREPE GREY CORNER"                             = "36fc4525"
    "CREPE EXOTIQUE"                                = "7818c11e"
    "CREPE KUNAFA PISTACHE"                         = "b4f0b866"
    "KUNAFA PISTACHE"                               = "b4f0b866"
    "CREPE BANANE NUTELLA"                          = "3a61c45c"
    "BANANE NUTELLA"                                = "3a61c45c"
    "CREPE POMME CARAMELISEE"                       = "cfea4f31"
    "CREPE CHOCOLAT NOISETTE"                       = "5dddf03e"
    "CREPE NUTELLA"                                 = "d07f4608"
    "NUTELLA"                                       = "d07f4608"
    "CREPE PECHEUR"                                 = "d8f0a2f6"
    "CREPE NORVEGIENNE"                             = "8f68fc90"
    "CREPE MIXTE"                                   = "9829f0a2"
    "CREPE BOLOGNAISE"                              = "b7a4a25b"
    "CREPE POULET CHAMPIGNON"                       = "9b075b42"
    "CREPE CHARCUTERIE"                             = "f2037453"
    "CREPE FROMAGE"                                 = "cd0c25fe"
    "SAN SEBASTIEN"                                 = "8e4b5b45"
    "CHEESECAKE CHOCOLAT"                           = "d12cbfc0"
    "FONDANT CHOCOLAT"                              = "50ad385d"
    "SAN SEBASTIEN NUTELLA"                         = "184bcbd7"
    "CHEESECAKE LOTUS"                              = "584328d9"
    "TIRAMISU"                                      = "8494037b"
    "CHOCOLAT FONDUE"                               = "fbb2f308"
    "CAFE NESPRESSO"                                = "c03ef312"
    "CAPPUCCINO CHANTILLY"                          = "boi_cappuccino_113"
    "CHOCOLAT CHANTILLY"                            = "51d7fb79"
    "CAFE AU LAIT"                                  = "c8cb62c4"
    "CAPPUCCINO ITALIEN"                            = "boi_cappuccino_116"
    "CHOCOLAT AU LAIT"                              = "deb8fba9"
    "CAFE LATTE"                                    = "c38a0e95"
    "THE NOIR AU LAIT"                              = "20ea5606"
    "THE INFUSION"                                  = "558549bd"
    "VERVEINE AROMATISEE"                           = "b09952c5"
    "CAFE AMERICAIN"                                = "0f2b73d2"
    "CAFE NOIR"                                     = "2870e2fd"
    "THE A LA MENTHE"                               = "218eeccc"
    "THE MENTHE"                                    = "218eeccc"
    "THE NOIR"                                      = "3d5c4709"
    "VERVEINE"                                      = "7ff4d8d0"
    "LAIT FROID CHAUD"                              = "30d472ba"
    "REDBULL"                                       = "652c18e1"
    "COCA"                                          = "c637898f"
    "COCA ZERO"                                     = "43c999d5"
    "SPRITE"                                        = "91438660"
    "HAWAI"                                         = "a23d8e89"
    "POMS"                                          = "b415c9dd"
    "ORANGINA"                                      = "21529e11"
    "SCHWEPPES"                                     = "813e058c"
    "OULMES 0.75"                                   = "bf39e64c"
    "EAU 0.75"                                      = "fde15742"
    "OULMES"                                        = "c8619369"
    "EAU 0.5"                                       = "c6e82ded"
    "ZA3ZA3"                                        = "7882e9fe"
    "COCKTAIL ORANGE"                               = "f6db7713"
    "JUS AVOCAT FRUITS SECS"                        = "bb34a61c"
    "PANACHE LAIT"                                  = "28d170f9"
    "JUS FRAMBOISE"                                 = "fcb2f80e"
    "JUS AVOCAT"                                    = "88785d37"
    "JUS ANANAS"                                    = "3aa22a4f"
    "JUS MANGUE"                                    = "8f08d89a"
    "JUS PECHE"                                     = "7dac90f1"
    "JUS FRAISE"                                    = "328adad9"
    "JUS POMME BANANE"                              = "14705d0e"
    "JUS CITRON"                                    = "65a2ed5a"
    "JUS CAROTTE"                                   = "e6091ac5"
    "JUS ORANGE"                                    = "88f83b09"
    "ICE TEA CITRON"                                = "9ac8dcb0"
    "ICE TEA PECHE"                                 = "8240295e"
    "ICE TEA FRAMBOISE"                             = "af8ccaaa"
    "CAFE GLACE AROMATISE"                          = "a4dbd839"
    "CAFE GLACE CLASSIQUE"                          = "972b68fa"
    "FRAPPUCCINO AROMATISE"                         = "6e4ac56f"
    "FRAPPUCCINO CLASSIQUE"                         = "dacd6b5e"
    "COCKTAIL GREY CORNER"                          = "80cf66ad"
    "FRAICHEUR"                                     = "674eabac"
    "TROPICAL"                                      = "15a95226"
    "PINA COLADA"                                   = "5213017a"
    "COCKTAIL GINGEMBRE"                            = "4100c11f"
    "SAN FRANCISCO"                                 = "93788121"
    "MOJITO REDBULL"                                = "6dc0a0c4"
    "MOJITO TROPICAL"                               = "25cc85dc"
    "MOJITO CITRON"                                 = "fe54d0a2"
}

function Convert-ExcelToJSON($filePath) {
    $fileName = [System.IO.Path]::GetFileName($filePath)

    # 1. Vérification stricte Ancien Menu sur le fichier
    $oldCheck = Test-IsOldMenuFile $filePath $fileName
    if ($oldCheck.IsOld) {
        Write-Log "⛔ FICHIER IGNORÉ : '$fileName' appartient à l'ANCIEN MENU. Raison : $($oldCheck.Reason)."
        Write-Log "   -> Seules les ventes post-mars (à partir du 01/04/2026) sont acceptées."
        return $null
    }

    Write-Log "Conversion XLSX → JSON : $filePath"
    try {
        Import-Module ImportExcel -ErrorAction Stop
        $data = Import-Excel -Path $filePath -ErrorAction Stop

        if (-not $data -or $data.Count -eq 0) {
            Write-Log "⚠ Fichier vide ou illisible : $filePath"
            return $null
        }

        # Auto-detect columns
        $cols = $data[0].PSObject.Properties.Name
        Write-Log "Colonnes détectées : $($cols -join ', ')"

        $nameCol = $cols | Where-Object { $_ -match "article|plat|designation|libelle|item|nom|produit" } | Select-Object -First 1
        $qtyCol  = $cols | Where-Object { $_ -match "quantite|qty|qte|vente|vendu|count|nb" } | Select-Object -First 1
        $idCol   = $cols | Where-Object { $_ -match "^id$" } | Select-Object -First 1
        $dateCol = $cols | Where-Object { $_ -match "date|jour|cloture|timestamp|periode" } | Select-Object -First 1

        if (-not $nameCol -and -not $idCol) {
            $nameCol = $cols[0]
            $qtyCol  = $cols[1]
            Write-Log "Colonnes devinées : Article='$nameCol', Qty='$qtyCol'"
        }

        $result = @()
        $skippedOldMenuRows = 0
        $skippedOldArticles = 0

        foreach ($row in $data) {
            # 2. Vérification de date par ligne si colonne Date présente
            if ($dateCol -and $row.$dateCol) {
                $rawDate = "$($row.$dateCol)"
                if ($rawDate -match '2026-0?([1-3])[-/]' -or $rawDate -match '20260?([1-3])\d{2}' -or $rawDate -match '0?([1-3])/2026') {
                    $skippedOldMenuRows++
                    continue
                }
            }

            $rawName = if ($idCol) { $row.$idCol } else { "$($row.$nameCol)" }
            $qty     = if ($qtyCol) { [int]($row.$qtyCol -replace '[^\d]', '') } else { 0 }
            if ($qty -le 0) { continue }

            # Direct ID match
            if ($idCol -and $row.$idCol) {
                $result += [PSCustomObject]@{ id = $row.$idCol; qty_journee = $qty }
                continue
            }

            # Normalisation nom
            $normalized = $rawName.ToUpper().Trim() `
                -replace '[ÉÈÊË]','E' `
                -replace '[ÀÂÄ]','A' `
                -replace '[ÙÛÜ]','U' `
                -replace '[ÎÏÌ]','I' `
                -replace '[ÔÖÒ]','O' `
                -replace '[Ç]','C' `
                -replace "['']", '' `
                -replace '\s+', ' '

            # 3. Vérification si article spécifique à l'ancien menu
            if ($OLD_MENU_ARTICLES -contains $normalized) {
                $skippedOldArticles++
                continue
            }

            $matchedId = $MENU_NAME_TO_ID[$normalized]
            if (-not $matchedId) {
                # Fuzzy match
                $matchedId = ($MENU_NAME_TO_ID.Keys | Where-Object { $normalized.Contains($_) -or $_.Contains($normalized) } | Select-Object -First 1)
                if ($matchedId) { $matchedId = $MENU_NAME_TO_ID[$matchedId] }
            }

            if ($matchedId) {
                $result += [PSCustomObject]@{ id = $matchedId; qty_journee = $qty }
            } else {
                # Non reconnu : possible article non mappé ou ancien menu
                Write-Log "  ⚠ Article non reconnu (ignoré) : '$rawName'"
            }
        }

        if ($skippedOldMenuRows -gt 0) {
            Write-Log "ℹ️ $skippedOldMenuRows ligne(s) exclue(s) car antérieures au 01/04/2026 (Ancien Menu Jan/Fév/Mars)."
        }
        if ($skippedOldArticles -gt 0) {
            Write-Log "ℹ️ $skippedOldArticles article(s) de l'ancien menu exclus de l'import."
        }

        Write-Log "Conversion réussie : $($result.Count) articles du menu actuel mappés."
        return $result

    } catch {
        Write-Log "ERREUR lors de la conversion : $_"
        return $null
    }
}

function Save-JSON($data, $filename) {
    if (-not $data -or $data.Count -eq 0) {
        Write-Log "⚠ Aucun article à enregistrer pour $filename."
        return
    }

    $date = Get-Date -Format "yyyy-MM-dd"
    $json = [PSCustomObject]@{
        generated_at  = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        source_file   = $filename
        date          = $date
        menu_version  = "POST-MARS 2026 (Carte Actuelle)"
        items         = $data
    } | ConvertTo-Json -Depth 5

    # Save main file (overwrites for SYNTHESE_DECISIONNELLE_MENU.html)
    $json | Set-Content -Path $outputFile -Encoding UTF8
    Write-Log "✅ Fichier JSON généré : $outputFile"

    # Save dated archive
    $archiveDir = Join-Path $logDir "archives"
    if (-not (Test-Path $archiveDir)) { New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null }
    $archiveFile = Join-Path $archiveDir "ventes_$date.json"
    $json | Set-Content -Path $archiveFile -Encoding UTF8
    Write-Log "📁 Archive sauvegardée : $archiveFile"
}

# ---------------------------------------------------------------
# Option : Scan de l'archive post-mars (Avril à Septembre 2026)
# Exclut automatiquement Janvier (2026-01), Février (2026-02), Mars (2026-03)
# ---------------------------------------------------------------
if ($ScanPostMarsArchive) {
    Write-Log "🚀 Démarrage du scan global des dossiers POST-MARS 2026..."
    Write-Log "   -> Exclusion confirmée : 2026-01, 2026-02, 2026-03 (Ancien Menu)."
    $postMarsFolders = @("2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09")
    $totalFilesScanned = 0
    foreach ($m in $postMarsFolders) {
        $mDir = Join-Path $watchDir $m
        if (Test-Path $mDir) {
            $files = Get-ChildItem -Path $mDir -Filter "*.xls*"
            Write-Log "Dossier $m : $($files.Count) fichiers de ventes trouvés."
            $totalFilesScanned += $files.Count
        }
    }
    Write-Log "Total fichiers post-mars disponibles : $totalFilesScanned."
}

# ---------------------------------------------------------------
# FileSystemWatcher — Surveillance en temps réel
# ---------------------------------------------------------------
Write-Log "🟢 Watcher actif. Surveillance de : $watchDir"
Write-Log "   Filtre actif : Exclusion automatique de l'Ancien Menu (Janvier, Février, Mars 2026)"
Write-Log "   Formats acceptés : *.xlsx, *.xls, *.json, *.csv"
Write-Log "   Fichier de sortie : $outputFile"
Write-Log "   Appuyez sur Ctrl+C pour arrêter."

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchDir
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true  # Surveille aussi les sous-dossiers
$watcher.EnableRaisingEvents = $true

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $name = [System.IO.Path]::GetFileName($path)
    $ext  = [System.IO.Path]::GetExtension($name).ToLower()

    # Ignore logs, archives and generated output
    if ($name -match "ventes_du_jour|watcher_" -or $path -like "*\logs\*" -or $path -like "*\archives\*") { return }
    if ($ext -notin @('.xlsx', '.xls', '.json', '.csv')) { return }

    # 1. TEST STRICT D'EXCLUSION DE L'ANCIEN MENU (Janvier, Février, Mars 2026)
    $oldCheck = Test-IsOldMenuFile $path $name
    if ($oldCheck.IsOld) {
        Write-Log "⛔ REJET AUTOMATIQUE : '$name' appartient à l'ANCIEN MENU (Période Janvier-Mars 2026)."
        Write-Log "   -> Motif : $($oldCheck.Reason). Aucune mise à jour effectuée."
        return
    }

    Write-Log "📥 Nouveau fichier post-mars détecté : $name"
    Start-Sleep -Seconds 2  # Wait for file write to complete

    if ($ext -in @('.xlsx', '.xls')) {
        $converted = Convert-ExcelToJSON $path
        if ($converted -and $converted.Count -gt 0) {
            Save-JSON $converted $name
        }
    } elseif ($ext -eq '.json') {
        try {
            $content = Get-Content $path -Raw -Encoding UTF8
            $parsed = $content | ConvertFrom-Json
            if ($parsed -is [Array]) {
                Save-JSON $parsed $name
            } elseif ($parsed.items) {
                Copy-Item $path $outputFile -Force
                Write-Log "✅ JSON direct copié vers : $outputFile"
            }
        } catch {
            Write-Log "ERREUR lecture JSON : $_"
        }
    } elseif ($ext -eq '.csv') {
        try {
            $csvData = Import-Csv $path -Delimiter ';' -ErrorAction SilentlyContinue
            if (-not $csvData -or $csvData.Count -eq 0) {
                $csvData = Import-Csv $path -Delimiter ',' -ErrorAction SilentlyContinue
            }
            if ($csvData) {
                $cols = $csvData[0].PSObject.Properties.Name
                $nameCol = $cols | Where-Object { $_ -match "article|plat|designation|nom|produit" } | Select-Object -First 1
                $qtyCol  = $cols | Where-Object { $_ -match "quantite|qty|qte|vente|nb" } | Select-Object -First 1
                $dateCol = $cols | Where-Object { $_ -match "date|jour|cloture" } | Select-Object -First 1
                if (-not $nameCol) { $nameCol = $cols[0]; $qtyCol = $cols[1] }

                $result = @()
                foreach ($row in $csvData) {
                    if ($dateCol -and $row.$dateCol) {
                        $rawD = "$($row.$dateCol)"
                        if ($rawD -match '2026-0?([1-3])[-/]' -or $rawD -match '20260?([1-3])\d{2}') { continue }
                    }
                    $rawName = "$($row.$nameCol)".ToUpper().Trim() -replace '[ÉÈÊË]','E' -replace '[ÀÂÄ]','A' -replace '[ÙÛÜ]','U' -replace '[ÎÏÌ]','I' -replace '\s+', ' '
                    if ($OLD_MENU_ARTICLES -contains $rawName) { continue }

                    $qty = [int]($row.$qtyCol -replace '[^\d]','')
                    if ($qty -le 0) { continue }
                    $matchedId = $MENU_NAME_TO_ID[$rawName]
                    if ($matchedId) {
                        $result += [PSCustomObject]@{ id = $matchedId; qty_journee = $qty }
                    }
                }
                if ($result.Count -gt 0) { Save-JSON $result $name }
            }
        } catch {
            Write-Log "ERREUR lecture CSV : $_"
        }
    }
}

Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
Register-ObjectEvent $watcher "Renamed" -Action $action | Out-Null

# Keep running
Write-Log "Watcher prêt. Déposez un fichier de ventes POST-MARS après clôture."
while ($true) {
    Start-Sleep -Seconds 30
    Write-Log "💓 Watcher actif — Filtrage Ancien Menu actif — $(Get-Date -Format 'HH:mm:ss')"
}
