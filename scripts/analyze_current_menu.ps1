# GREY CORNER — AUDIT DU MENU ACTUEL (POST-MARS 2026)
$ErrorActionPreference = "Stop"
$rootDir = (Get-Location).Path
$ventesDir = Join-Path $rootDir "ventes"
$menuDataPath = Join-Path $rootDir "menu-data.js"
$foodCostJsonPath = Join-Path $rootDir "scripts\food_cost_summary.json"
$outputJson = Join-Path $rootDir "scripts\current_menu_audit.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 GREY CORNER — AUDIT STRATÉGIQUE DU MENU ACTUEL (POST-MARS 2026)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

function Clean-Text([string]$str) {
    if ([string]::IsNullOrWhiteSpace($str)) { return "" }
    $s = $str.ToLower()
    $s = [System.Text.RegularExpressions.Regex]::Replace($s, '[éèêë]', 'e')
    $s = [System.Text.RegularExpressions.Regex]::Replace($s, '[àâä]', 'a')
    $s = [System.Text.RegularExpressions.Regex]::Replace($s, '[îï]', 'i')
    $s = [System.Text.RegularExpressions.Regex]::Replace($s, '[ôö]', 'o')
    $s = [System.Text.RegularExpressions.Regex]::Replace($s, '[ûùü]', 'u')
    $s = [System.Text.RegularExpressions.Regex]::Replace($s, '[ç]', 'c')
    $s = [System.Text.RegularExpressions.Regex]::Replace($s, '[^a-z0-9]', '')
    return $s.Trim()
}

# 1. Extraire les items du menu actuel depuis menu-data.js
$content = Get-Content -Path $menuDataPath -Raw -Encoding UTF8

$itemRegex = [System.Text.RegularExpressions.Regex]::new('\{\s*name:\s*\{\s*fr:\s*"([^"]+)"[^\}]*\},\s*description:\s*\{\s*fr:\s*"([^"]*)"[^\}]*\},\s*price:\s*"([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$itemMatches = $itemRegex.Matches($content)

# On découpe aussi par catégorie pour associer la bonne catégorie à chaque item
$sections = $content -split 'category:\s*\{\s*fr:\s*"'
$currentMenuItems = @()
$menuItemLookup = @{}

for ($i = 1; $i -lt $sections.Count; $i++) {
    $sec = $sections[$i]
    $catName = $sec.Substring(0, $sec.IndexOf('"'))
    $secMatches = $itemRegex.Matches($sec)
    foreach ($m in $secMatches) {
        $pName = $m.Groups[1].Value.Trim()
        $desc = $m.Groups[2].Value.Trim()
        $price = $m.Groups[3].Value.Trim()
        $isNew = $m.Value.Contains('isNew:\s*true')
        
        $obj = [PSCustomObject]@{
            Name = $pName
            Category = $catName
            Price = $price
            Description = $desc
            IsNew = $isNew
            CleanName = (Clean-Text $pName)
        }
        $currentMenuItems += $obj
        $menuItemLookup[(Clean-Text $pName)] = $obj
    }
}

Write-Host "[1/4] $($currentMenuItems.Count) articles du menu actuel charges avec succes." -ForegroundColor Green

# 2. Charger la base de coûts food_cost_summary.json
$foodCostLookup = @{}
if (Test-Path $foodCostJsonPath) {
    $rawFc = Get-Content -Path $foodCostJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($r in $rawFc) {
        $clean = Clean-Text $r.name
        $foodCostLookup[$clean] = $r
    }
    Write-Host "[2/4] $($foodCostLookup.Count) fiches de couts chargees." -ForegroundColor Green
}

# 3. Collecter les ventes depuis le changement de carte (01 Avril 2026 jusqu'à Septembre 2026)
# Dossiers 2026-04, 2026-05, 2026-06, 2026-07, 2026-08, 2026-09
$months = @("2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09")
$salesFiles = @()
foreach ($m in $months) {
    $mPath = Join-Path $ventesDir $m
    if (Test-Path $mPath) {
        $salesFiles += Get-ChildItem -Path $mPath -Filter "*.xls*" | Where-Object { $_.Name -ne "manifest.json" }
    }
}
Write-Host "[3/4] Collecte de $($salesFiles.Count) journees de ventes post-changement de carte..." -ForegroundColor Yellow

# Dictionnaires d'agrégation pour chaque item du menu actuel
$itemStats = @{}
foreach ($item in $currentMenuItems) {
    $itemStats[$item.CleanName] = @{
        Item = $item
        TotalQty = 0.0
        TotalCA = 0.0
        UnitCost = 0.0
        TotalCost = 0.0
        MarginDH = 0.0
        FoodCostPct = 0.0
    }
    # Récupérer le coût unitaire s'il existe
    if ($foodCostLookup.ContainsKey($item.CleanName)) {
        $itemStats[$item.CleanName].UnitCost = [double]$foodCostLookup[$item.CleanName].cost
    } else {
        # Chercher par inclusion
        foreach ($k in $foodCostLookup.Keys) {
            if ($k.Contains($item.CleanName) -or $item.CleanName.Contains($k)) {
                $itemStats[$item.CleanName].UnitCost = [double]$foodCostLookup[$k].cost
                break
            }
        }
    }
}

# Fonction de matching vers un item du menu actuel
function Find-MenuItem([string]$prod) {
    $c = Clean-Text $prod
    if ($menuItemLookup.ContainsKey($c)) { return $menuItemLookup[$c] }
    
    # Heuristiques de correspondance
    foreach ($k in $menuItemLookup.Keys) {
        if ($k.Length -ge 4 -and ($k.Contains($c) -or $c.Contains($k))) {
            return $menuItemLookup[$k]
        }
    }
    return $null
}

$processedFiles = 0
$totalSalesCA = 0.0
$totalSalesQty = 0.0

foreach ($f in $salesFiles) {
    $cs = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=$($f.FullName);Extended Properties='Excel 8.0;HDR=YES;IMEX=1;'"
    $conn = New-Object System.Data.OleDb.OleDbConnection($cs)
    try {
        $conn.Open()
        $tables = $conn.GetOleDbSchemaTable([System.Data.OleDb.OleDbSchemaGuid]::Tables, $null)
        if ($tables.Rows.Count -gt 0) {
            $tableName = $tables.Rows[0]['TABLE_NAME']
            $cmd = $conn.CreateCommand()
            $cmd.CommandText = "SELECT * FROM [$tableName]"
            $da = New-Object System.Data.OleDb.OleDbDataAdapter($cmd)
            $dt = New-Object System.Data.DataTable
            $da.Fill($dt) | Out-Null
            
            foreach ($row in $dt.Rows) {
                $prod = "$($row['Produit'])".Trim()
                if ([string]::IsNullOrWhiteSpace($prod)) { continue }
                $cleanProd = Clean-Text $prod
                if ($cleanProd -eq "total" -or $cleanProd -eq "somme" -or $cleanProd -eq "montant") { continue }
                
                $price = 0.0
                $qty = 0.0
                $tot = 0.0
                [double]::TryParse("$($row['Prix'])".Replace(',', '.').Replace(' ', ''), [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$price) | Out-Null
                [double]::TryParse("$($row['QTE'])".Replace(',', '.').Replace(' ', ''), [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$qty) | Out-Null
                [double]::TryParse("$($row['Total'])".Replace(',', '.').Replace(' ', ''), [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$tot) | Out-Null
                
                if ($qty -le 0) { $qty = 1.0 }
                if ($tot -le 0 -and $price -gt 0) { $tot = $qty * $price }
                if ($price -le 0 -and $tot -gt 0) { $price = $tot / $qty }
                if ($tot -le 0 -and $price -le 0) { continue }
                
                $totalSalesCA += $tot
                $totalSalesQty += $qty
                
                # Match avec le menu actuel
                $matched = Find-MenuItem $prod
                if ($matched -ne $null) {
                    $itemStats[$matched.CleanName].TotalQty += $qty
                    $itemStats[$matched.CleanName].TotalCA += $tot
                }
            }
        }
    } catch {}
    finally { $conn.Close() }
    
    $processedFiles++
}

Write-Host "  -> $processedFiles journees analysees du nouveau menu !" -ForegroundColor Green
Write-Host "  -> CA total periode post-mars : $([Math]::Round($totalSalesCA, 2)) DH" -ForegroundColor Green

# 4. Calculs de rentabilité et Menu Engineering sur le menu actuel
Write-Host "[4/4] Classification Menu Engineering du menu actuel..." -ForegroundColor Yellow

$menuAuditList = @()
$allCurrentQty = 0.0
$allCurrentCA = 0.0
$allCurrentCost = 0.0

foreach ($stat in $itemStats.Values) {
    $qty = $stat.TotalQty
    $ca = $stat.TotalCA
    $uCost = $stat.UnitCost
    $tCost = $qty * $uCost
    $margin = $ca - $tCost
    $fcPct = if ($ca -gt 0) { [Math]::Round(($tCost / $ca) * 100, 2) } else { 0.0 }
    $avgPrice = if ($qty -gt 0) { [Math]::Round($ca / $qty, 2) } else { [double]($stat.Item.Price -replace '[^0-9.]', '') }
    $unitCashMargin = [Math]::Round($avgPrice - $uCost, 2)

    $allCurrentQty += $qty
    $allCurrentCA += $ca
    $allCurrentCost += $tCost

    $menuAuditList += [PSCustomObject]@{
        Name = $stat.Item.Name
        Category = $stat.Item.Category
        Price = $stat.Item.Price
        Description = $stat.Item.Description
        IsNew = $stat.Item.IsNew
        TotalQty = [Math]::Round($qty, 0)
        TotalCA = [Math]::Round($ca, 2)
        AvgPrice = $avgPrice
        UnitCost = [Math]::Round($uCost, 2)
        TotalCost = [Math]::Round($tCost, 2)
        MarginDH = [Math]::Round($margin, 2)
        FoodCostPct = $fcPct
        UnitCashMargin = $unitCashMargin
        MonthlyAvgQty = [Math]::Round($qty / 5.3, 1) # ~5.3 mois entre avril et début sept
        WeeklyAvgQty = [Math]::Round($qty / 23.0, 1)  # ~23 semaines
        Quadrant = "NON_ASSIGNE"
    }
}

# Seuils de popularité et de marge sur la carte actuelle
$activeItems = $menuAuditList | Where-Object { $_.TotalQty -gt 0 }
$avgQty = if ($activeItems.Count -gt 0) { ($activeItems | Measure-Object -Property TotalQty -Average).Average } else { 0 }
$popularityThreshold = $avgQty * 0.7

$activeMargins = $menuAuditList | Where-Object { $_.UnitCost -gt 0 }
$avgUnitCashMargin = if ($activeMargins.Count -gt 0) { ($activeMargins | Measure-Object -Property UnitCashMargin -Average).Average } else { 25.0 }

foreach ($item in $menuAuditList) {
    if ($item.TotalQty -gt 0) {
        $highPop = $item.TotalQty -ge $popularityThreshold
        $highMarg = $item.UnitCashMargin -ge $avgUnitCashMargin
        
        if ($highPop -and $highMarg) {
            $item.Quadrant = "STAR"
        } elseif ($highPop -and -not $highMarg) {
            $item.Quadrant = "PLOWHORSE"
        } elseif (-not $highPop -and $highMarg) {
            $item.Quadrant = "PUZZLE"
        } else {
            $item.Quadrant = "DOG"
        }
    } else {
        $item.Quadrant = "DOG_ZERO_VENTE"
    }
}

# Sauvegarder l'audit complet en JSON
$outObj = @{
    Period = "2026-04-01 to 2026-09-09 (160 jours post-changement de carte)"
    TotalCA_Periode = [Math]::Round($totalSalesCA, 2)
    TotalQty_Periode = [Math]::Round($totalSalesQty, 0)
    AvgPopularityThreshold = [Math]::Round($popularityThreshold, 1)
    AvgUnitMarginThreshold = [Math]::Round($avgUnitCashMargin, 2)
    ItemsCount = $menuAuditList.Count
    Items = $menuAuditList
}

$outObj | ConvertTo-Json -Depth 5 | Set-Content -Path $outputJson -Encoding UTF8
Write-Host "Audit du nouveau menu sauvegarde dans : $outputJson" -ForegroundColor Green
