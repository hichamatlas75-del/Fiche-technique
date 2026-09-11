# SCRIPT DE RECHERCHE CONSULTANT F&B - INGRÉDIENTS ORPHELINS & CLASSIFICATION RATIONNELLE
$ErrorActionPreference = "Stop"
$rootDir = (Get-Location).Path
$salesAnalysisPath = Join-Path $rootDir "scripts\ventes_analysis_full.json"
$foodCostJsonPath = Join-Path $rootDir "scripts\food_cost_summary.json"

$salesData = Get-Content -Path $salesAnalysisPath -Raw -Encoding UTF8 | ConvertFrom-Json
$foodCostData = Get-Content -Path $foodCostJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

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

# 1. Map des ventes de produits
$prodSalesMap = @{}
foreach ($p in $salesData.AllProducts) {
    $c = Clean-Text $p.Name
    $prodSalesMap[$c] = $p
}

# 2. Cartographie Ingrédients -> Recettes & Ventes
$ingredientMap = @{} # Nom Ingrédient -> @{ Recipes = @(); TotalSalesQty = 0; TotalSalesCA = 0; Categories = @() }

foreach ($recipe in $foodCostData) {
    $cName = Clean-Text $recipe.name
    $salesInfo = if ($prodSalesMap.ContainsKey($cName)) { $prodSalesMap[$cName] } else { $null }
    if ($salesInfo -eq $null) {
        # Recherche par inclusion
        foreach ($k in $prodSalesMap.Keys) {
            if ($k.Contains($cName) -or $cName.Contains($k)) {
                $salesInfo = $prodSalesMap[$k]
                break
            }
        }
    }

    $soldQty = if ($salesInfo) { [double]$salesInfo.Qty } else { 0.0 }
    $soldCA = if ($salesInfo) { [double]$salesInfo.CA } else { 0.0 }

    if ($recipe.details) {
        foreach ($d in $recipe.details) {
            $ing = $d.ingredient.Trim()
            if ([string]::IsNullOrWhiteSpace($ing)) { continue }
            if (-not $ingredientMap.ContainsKey($ing)) {
                $ingredientMap[$ing] = @{
                    Ingredient = $ing
                    Recipes = @()
                    TotalSalesQty = 0
                    TotalSalesCA = 0
                    UnitCost = $d.cost
                }
            }
            $ingredientMap[$ing].Recipes += @{
                RecipeName = $recipe.name
                Category = $recipe.category
                SoldQty = $soldQty
                SoldCA = $soldCA
            }
            $ingredientMap[$ing].TotalSalesQty += $soldQty
            $ingredientMap[$ing].TotalSalesCA += $soldCA
        }
    }
}

# Ingrédients orphelins (utilisés dans 1 seule recette) avec très peu de ventes totales
$orphanIngredients = @()
foreach ($ing in $ingredientMap.Values) {
    if ($ing.Recipes.Count -eq 1 -and $ing.TotalSalesQty -le 60) {
        $r = $ing.Recipes[0]
        $orphanIngredients += [PSCustomObject]@{
            Ingredient = $ing.Ingredient
            Recipe = $r.RecipeName
            Category = $r.Category
            TotalSold9Months = $r.SoldQty
            CA_Genere = $r.SoldCA
            AvgSalesPerMonth = [Math]::Round($r.SoldQty / 9, 1)
        }
    }
}

Write-Host "=== INGRÉDIENTS ORPHELINS (1 SEULE RECETTE ET FAIBLES VENTES) ===" -ForegroundColor Yellow
$orphanIngredients | Sort-Object TotalSold9Months | Select-Object -First 25 | Format-Table -AutoSize

# Export JSON
$orphanOut = Join-Path $rootDir "scripts\orphan_ingredients.json"
$orphanIngredients | ConvertTo-Json -Depth 4 | Set-Content -Path $orphanOut -Encoding UTF8
Write-Host "Sauvegarde dans $orphanOut" -ForegroundColor Green
