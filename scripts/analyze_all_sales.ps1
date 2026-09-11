# GREY CORNER — ANALYSE CONSOLIDÉE GLOBALE DES VENTES (241 JOURNÉES)
$ErrorActionPreference = "Stop"
$rootDir = (Get-Location).Path
$ventesDir = Join-Path $rootDir "ventes"
$outputJson = Join-Path $rootDir "scripts\ventes_analysis_full.json"
$foodCostJsonPath = Join-Path $rootDir "scripts\food_cost_summary.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 GREY CORNER — AUDIT GLOBAL DE TOUTES LES VENTES 2026" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Charger la base des fiches techniques et coûts
$recipeMap = @{}
$recipeList = @()
if (Test-Path $foodCostJsonPath) {
    Write-Host "[1/4] Chargement de food_cost_summary.json..." -ForegroundColor Yellow
    $rawFc = Get-Content -Path $foodCostJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($r in $rawFc) {
        $clean = ($r.name -replace '[^a-zA-Z0-9]', '').ToLower()
        $recipeMap[$clean] = $r
        $recipeList += @{
            Clean = $clean
            Obj = $r
        }
    }
    Write-Host "  -> $($recipeMap.Count) recettes chargees." -ForegroundColor Green
}

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

function Find-Recipe([string]$prodName) {
    $c = Clean-Text $prodName
    if ([string]::IsNullOrEmpty($c)) { return $null }
    if ($recipeMap.ContainsKey($c)) { return $recipeMap[$c] }

    if ($c.Length -ge 5) {
        foreach ($r in $recipeList) {
            if ($r.Clean.Contains($c) -or $c.Contains($r.Clean)) {
                return $r.Obj
            }
        }
    }
    return $null
}

# 2. Collecter les fichiers de ventes
Write-Host "[2/4] Collecte des 241 fichiers de ventes..." -ForegroundColor Yellow
$salesFiles = Get-ChildItem -Path $ventesDir -Recurse -Filter "*.xls*" | Where-Object { $_.Name -ne "manifest.json" } | Sort-Object Name
Write-Host "  -> $($salesFiles.Count) fichiers trouves." -ForegroundColor Green

# 3. Structures d'agregation
$globalCA = 0.0
$globalQty = 0.0
$globalCost = 0.0

$dailySales = @{}
$monthlySales = @{}
$dowSales = @{}
$familySales = @{}
$productSales = @{}

for ($i = 0; $i -le 6; $i++) {
    $dowSales[$i] = @{ CA = 0.0; Qty = 0.0; DaysCount = 0 }
}

$processedFiles = 0
$totalFiles = $salesFiles.Count
$sw = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host "[3/4] Lecture et parsing en cours..." -ForegroundColor Yellow

foreach ($file in $salesFiles) {
    $dateKey = ""
    if ($file.Name -match '(202[0-9])([0-1][0-9])([0-3][0-9])') {
        $dateKey = "$($Matches[1])-$($Matches[2])-$($Matches[3])"
    } else {
        continue
    }

    $monthKey = $dateKey.Substring(0, 7)
    $dateObj = [DateTime]::ParseExact($dateKey, "yyyy-MM-dd", [System.Globalization.CultureInfo]::InvariantCulture)
    $dow = [int]$dateObj.DayOfWeek

    if (-not $monthlySales.ContainsKey($monthKey)) {
        $monthlySales[$monthKey] = @{
            Month = $monthKey
            CA = 0.0
            Qty = 0.0
            Cost = 0.0
            DaysCount = 0
            Families = @{}
            Products = @{}
        }
    }

    $dayCA = 0.0
    $dayQty = 0.0
    $dayCost = 0.0
    $dayRowsCount = 0

    $cs = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=$($file.FullName);Extended Properties='Excel 8.0;HDR=YES;IMEX=1;'"
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

                $fam = "$($row['Famille'])".Trim()
                if ([string]::IsNullOrWhiteSpace($fam)) { $fam = "DIVERS" }

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

                $matchedRecipe = Find-Recipe $prod
                $unitCost = 0.0
                if ($matchedRecipe -ne $null -and $matchedRecipe.cost -gt 0) {
                    $unitCost = [double]$matchedRecipe.cost
                }
                $lineCost = $unitCost * $qty

                $dayCA += $tot
                $dayQty += $qty
                $dayCost += $lineCost
                $dayRowsCount++

                if (-not $productSales.ContainsKey($prod)) {
                    $productSales[$prod] = @{
                        Name = $prod
                        Famille = $fam
                        CA = 0.0
                        Qty = 0.0
                        Cost = 0.0
                        UnitCost = $unitCost
                        MatchedName = if ($matchedRecipe) { $matchedRecipe.name } else { $null }
                        MatchedCategory = if ($matchedRecipe) { $matchedRecipe.category } else { $null }
                    }
                }
                $productSales[$prod].CA += $tot
                $productSales[$prod].Qty += $qty
                $productSales[$prod].Cost += $lineCost

                if (-not $familySales.ContainsKey($fam)) {
                    $familySales[$fam] = @{
                        Famille = $fam
                        CA = 0.0
                        Qty = 0.0
                        Cost = 0.0
                    }
                }
                $familySales[$fam].CA += $tot
                $familySales[$fam].Qty += $qty
                $familySales[$fam].Cost += $lineCost

                if (-not $monthlySales[$monthKey].Families.ContainsKey($fam)) {
                    $monthlySales[$monthKey].Families[$fam] = @{ CA = 0.0; Qty = 0.0 }
                }
                $monthlySales[$monthKey].Families[$fam].CA += $tot
                $monthlySales[$monthKey].Families[$fam].Qty += $qty

                if (-not $monthlySales[$monthKey].Products.ContainsKey($prod)) {
                    $monthlySales[$monthKey].Products[$prod] = @{ CA = 0.0; Qty = 0.0 }
                }
                $monthlySales[$monthKey].Products[$prod].CA += $tot
                $monthlySales[$monthKey].Products[$prod].Qty += $qty
            }
        }
    } catch {
        Write-Host "Erreur sur $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        $conn.Close()
    }

    $dailySales[$dateKey] = @{
        Date = $dateKey
        Month = $monthKey
        DayOfWeek = $dow
        CA = [Math]::Round($dayCA, 2)
        Qty = [Math]::Round($dayQty, 0)
        Cost = [Math]::Round($dayCost, 2)
        Margin = [Math]::Round($dayCA - $dayCost, 2)
        Rows = $dayRowsCount
    }

    $globalCA += $dayCA
    $globalQty += $dayQty
    $globalCost += $dayCost

    $monthlySales[$monthKey].CA += $dayCA
    $monthlySales[$monthKey].Qty += $dayQty
    $monthlySales[$monthKey].Cost += $dayCost
    $monthlySales[$monthKey].DaysCount++

    $dowSales[$dow].CA += $dayCA
    $dowSales[$dow].Qty += $dayQty
    $dowSales[$dow].DaysCount++

    $processedFiles++
    if ($processedFiles % 40 -eq 0 -or $processedFiles -eq $totalFiles) {
        Write-Host "  -> $processedFiles / $totalFiles jours traites ($([Math]::Round($processedFiles / $totalFiles * 100, 0))%)" -ForegroundColor Gray
    }
}

$sw.Stop()
Write-Host "Extraction terminee en $($sw.Elapsed.TotalSeconds.ToString('F1')) secondes !" -ForegroundColor Green

# 4. Synthese et Menu Engineering
Write-Host "[4/4] Finalisation des KPIs et Menu Engineering..." -ForegroundColor Yellow

$globalMargin = $globalCA - $globalCost
$globalFoodCostPct = if ($globalCA -gt 0) { [Math]::Round(($globalCost / $globalCA) * 100, 2) } else { 0.0 }
$avgCADaily = if ($processedFiles -gt 0) { [Math]::Round($globalCA / $processedFiles, 2) } else { 0.0 }
$avgQtyDaily = if ($processedFiles -gt 0) { [Math]::Round($globalQty / $processedFiles, 0) } else { 0.0 }

$totalProds = $productSales.Count
$avgQtyPerProd = if ($totalProds -gt 0) { $globalQty / $totalProds } else { 0.0 }

$allUnitMargins = @()
foreach ($p in $productSales.Values) {
    $avgSellPrice = if ($p.Qty -gt 0) { $p.CA / $p.Qty } else { 0.0 }
    $cashMargin = $avgSellPrice - $p.UnitCost
    $allUnitMargins += $cashMargin
}
$avgUnitMargin = if ($allUnitMargins.Count -gt 0) { ($allUnitMargins | Measure-Object -Average).Average } else { 0.0 }

$prodAnalysisList = @()
foreach ($p in $productSales.Values) {
    $avgPrice = if ($p.Qty -gt 0) { [Math]::Round($p.CA / $p.Qty, 2) } else { 0.0 }
    $marginDH = [Math]::Round($p.CA - $p.Cost, 2)
    $unitCashMargin = [Math]::Round($avgPrice - $p.UnitCost, 2)
    $fcPct = if ($p.CA -gt 0) { [Math]::Round(($p.Cost / $p.CA) * 100, 2) } else { 0.0 }

    $quadrant = "NON_ASSIGNE"
    if ($p.UnitCost -gt 0) {
        $highPopularity = $p.Qty -ge ($avgQtyPerProd * 0.7)
        $highMargin = $unitCashMargin -ge $avgUnitMargin

        if ($highPopularity -and $highMargin) {
            $quadrant = "STAR"
        } elseif ($highPopularity -and -not $highMargin) {
            $quadrant = "PLOWHORSE"
        } elseif (-not $highPopularity -and $highMargin) {
            $quadrant = "PUZZLE"
        } else {
            $quadrant = "DOG"
        }
    }

    $prodAnalysisList += @{
        Name = $p.Name
        Famille = $p.Famille
        CA = [Math]::Round([double]$p.CA, 2)
        Qty = [Math]::Round([double]$p.Qty, 0)
        AvgPrice = $avgPrice
        UnitCost = [Math]::Round([double]$p.UnitCost, 2)
        TotalCost = [Math]::Round([double]$p.Cost, 2)
        MarginDH = $marginDH
        MarginPct = if ($p.CA -gt 0) { [Math]::Round(($marginDH / $p.CA) * 100, 2) } else { 0.0 }
        FoodCostPct = $fcPct
        UnitCashMargin = $unitCashMargin
        MatchedRecipe = $p.MatchedName
        Quadrant = $quadrant
    }
}

$dowNames = @{
    0 = "Dimanche"
    1 = "Lundi"
    2 = "Mardi"
    3 = "Mercredi"
    4 = "Jeudi"
    5 = "Vendredi"
    6 = "Samedi"
}

$dowReport = @()
foreach ($k in (1,2,3,4,5,6,0)) {
    $d = $dowSales[$k]
    $dowReport += @{
        DayNumber = $k
        DayName = $dowNames[$k]
        TotalCA = [Math]::Round([double]$d.CA, 2)
        TotalQty = [Math]::Round([double]$d.Qty, 0)
        DaysCount = $d.DaysCount
        AvgCA = if ($d.DaysCount -gt 0) { [Math]::Round($d.CA / $d.DaysCount, 2) } else { 0.0 }
        AvgQty = if ($d.DaysCount -gt 0) { [Math]::Round($d.Qty / $d.DaysCount, 0) } else { 0.0 }
        ShareCA = if ($globalCA -gt 0) { [Math]::Round(($d.CA / $globalCA) * 100, 2) } else { 0.0 }
    }
}

$monthlyReport = @()
foreach ($mKey in ($monthlySales.Keys | Sort-Object)) {
    $m = $monthlySales[$mKey]
    $mCA = [Math]::Round([double]$m.CA, 2)
    $mCost = [Math]::Round([double]$m.Cost, 2)
    $mMargin = [Math]::Round($mCA - $mCost, 2)
    $mFcPct = if ($mCA -gt 0) { [Math]::Round(($mCost / $mCA) * 100, 2) } else { 0.0 }
    $mAvgCA = if ($m.DaysCount -gt 0) { [Math]::Round($mCA / $m.DaysCount, 2) } else { 0.0 }

    $topFam = $m.Families.GetEnumerator() | Sort-Object { [double]$_.Value.CA } -Descending | Select-Object -First 3 | ForEach-Object {
        @{ Famille = $_.Key; CA = [Math]::Round([double]$_.Value.CA, 2); Qty = $_.Value.Qty }
    }

    $topProds = $m.Products.GetEnumerator() | Sort-Object { [double]$_.Value.CA } -Descending | Select-Object -First 5 | ForEach-Object {
        @{ Produit = $_.Key; CA = [Math]::Round([double]$_.Value.CA, 2); Qty = $_.Value.Qty }
    }

    $monthlyReport += @{
        Month = $mKey
        DaysCount = $m.DaysCount
        TotalCA = $mCA
        TotalQty = [Math]::Round([double]$m.Qty, 0)
        AvgCADaily = $mAvgCA
        TotalCost = $mCost
        TotalMargin = $mMargin
        FoodCostPct = $mFcPct
        TopFamilies = $topFam
        TopProducts = $topProds
    }
}

$familyReport = $familySales.Values | Sort-Object { [double]$_.CA } -Descending | ForEach-Object {
    $fCA = [Math]::Round([double]$_.CA, 2)
    $fCost = [Math]::Round([double]$_.Cost, 2)
    $fMargin = [Math]::Round($fCA - $fCost, 2)
    @{
        Famille = $_.Famille
        TotalCA = $fCA
        TotalQty = [Math]::Round([double]$_.Qty, 0)
        ShareCA = if ($globalCA -gt 0) { [Math]::Round(($fCA / $globalCA) * 100, 2) } else { 0.0 }
        AvgItemPrice = if ($_.Qty -gt 0) { [Math]::Round($fCA / $_.Qty, 2) } else { 0.0 }
        TotalCost = $fCost
        MarginDH = $fMargin
        FoodCostPct = if ($fCA -gt 0) { [Math]::Round(($fCost / $fCA) * 100, 2) } else { 0.0 }
    }
}

$topSellersCA = $prodAnalysisList | Sort-Object { [double]$_.CA } -Descending | Select-Object -First 30
$topSellersQty = $prodAnalysisList | Sort-Object { [double]$_.Qty } -Descending | Select-Object -First 30
$topMarginCash = $prodAnalysisList | Sort-Object { [double]$_.MarginDH } -Descending | Select-Object -First 30
$worstFoodCost = $prodAnalysisList | Where-Object { [double]$_.Qty -ge 50 -and [double]$_.FoodCostPct -gt 0 } | Sort-Object { [double]$_.FoodCostPct } -Descending | Select-Object -First 25
$flopSellers = $prodAnalysisList | Where-Object { [double]$_.Qty -le 10 -and [double]$_.CA -gt 0 } | Sort-Object { [double]$_.Qty }, { [double]$_.CA } | Select-Object -First 30

$stars = $prodAnalysisList | Where-Object { $_.Quadrant -eq "STAR" } | Sort-Object { [double]$_.MarginDH } -Descending
$plowhorses = $prodAnalysisList | Where-Object { $_.Quadrant -eq "PLOWHORSE" } | Sort-Object { [double]$_.Qty } -Descending
$puzzles = $prodAnalysisList | Where-Object { $_.Quadrant -eq "PUZZLE" } | Sort-Object { [double]$_.UnitCashMargin } -Descending
$dogs = $prodAnalysisList | Where-Object { $_.Quadrant -eq "DOG" } | Sort-Object { [double]$_.CA } -Descending

$bestDay = $dailySales.Values | Sort-Object { [double]$_.CA } -Descending | Select-Object -First 1
$worstDay = $dailySales.Values | Where-Object { [double]$_.CA -gt 0 } | Sort-Object { [double]$_.CA } | Select-Object -First 1

$resultObj = @{
    Metadata = @{
        GeneratedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        TotalDaysAnalyzed = $processedFiles
        DateRange = @{
            FirstDate = ($dailySales.Keys | Sort-Object | Select-Object -First 1)
            LastDate = ($dailySales.Keys | Sort-Object | Select-Object -Last 1)
        }
    }
    Global = @{
        TotalCA = [Math]::Round($globalCA, 2)
        TotalQty = [Math]::Round($globalQty, 0)
        AvgCADaily = $avgCADaily
        AvgQtyDaily = $avgQtyDaily
        TotalFoodCost = [Math]::Round($globalCost, 2)
        TotalGrossMargin = [Math]::Round($globalMargin, 2)
        FoodCostPct = $globalFoodCostPct
        GrossMarginPct = if ($globalCA -gt 0) { [Math]::Round(($globalMargin / $globalCA) * 100, 2) } else { 0.0 }
        TotalActiveProducts = $productSales.Count
        BestDay = $bestDay
        WorstDay = $worstDay
    }
    Monthly = $monthlyReport
    DayOfWeek = $dowReport
    Families = $familyReport
    TopSellersCA = $topSellersCA
    TopSellersQty = $topSellersQty
    TopMarginCash = $topMarginCash
    WorstFoodCost = $worstFoodCost
    FlopSellers = $flopSellers
    MenuEngineering = @{
        StarsCount = ($stars | Measure-Object).Count
        PlowhorsesCount = ($plowhorses | Measure-Object).Count
        PuzzlesCount = ($puzzles | Measure-Object).Count
        DogsCount = ($dogs | Measure-Object).Count
        Stars = ($stars | Select-Object -First 20)
        Plowhorses = ($plowhorses | Select-Object -First 20)
        Puzzles = ($puzzles | Select-Object -First 20)
        Dogs = ($dogs | Select-Object -First 20)
    }
    AllProducts = ($prodAnalysisList | Sort-Object { [double]$_.CA } -Descending)
}

$jsonOut = $resultObj | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($outputJson, $jsonOut, [System.Text.Encoding]::UTF8)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ✅ ANALYSE COMPLETE TERMINEE AVEC SUCCES !" -ForegroundColor Green
Write-Host " Fichier genere : $outputJson" -ForegroundColor White
Write-Host " CA Total : $([Math]::Round($globalCA, 2)) DH | Quantite : $([Math]::Round($globalQty, 0)) articles | Jours : $processedFiles" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
