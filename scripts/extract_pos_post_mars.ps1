# SCRIPT DE MAPPING EXACT ENTRE LE MENU ACTUEL ET LES VENTES POST-MARS 2026
$ErrorActionPreference = "Stop"
$rootDir = (Get-Location).Path
$ventesDir = Join-Path $rootDir "ventes"
$foodCostJsonPath = Join-Path $rootDir "scripts\food_cost_summary.json"

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

# 1. Charger toutes les ventes post-mars (2026-04 à 2026-09)
$months = @("2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09")
$salesFiles = @()
foreach ($m in $months) {
    $mPath = Join-Path $ventesDir $m
    if (Test-Path $mPath) {
        $salesFiles += Get-ChildItem -Path $mPath -Filter "*.xls*" | Where-Object { $_.Name -ne "manifest.json" }
    }
}

$posProducts = @{} # CleanPOSName -> @{ Name = raw; Famille = raw; TotalQty = 0; TotalCA = 0 }

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
                
                $price = 0.0; $qty = 0.0; $tot = 0.0
                [double]::TryParse("$($row['Prix'])".Replace(',', '.').Replace(' ', ''), [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$price) | Out-Null
                [double]::TryParse("$($row['QTE'])".Replace(',', '.').Replace(' ', ''), [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$qty) | Out-Null
                [double]::TryParse("$($row['Total'])".Replace(',', '.').Replace(' ', ''), [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$tot) | Out-Null
                
                if ($qty -le 0) { $qty = 1.0 }
                if ($tot -le 0 -and $price -gt 0) { $tot = $qty * $price }
                if ($price -le 0 -and $tot -gt 0) { $price = $tot / $qty }
                if ($tot -le 0 -and $price -le 0) { continue }
                
                if (-not $posProducts.ContainsKey($cleanProd)) {
                    $posProducts[$cleanProd] = @{
                        RawName = $prod
                        Famille = "$($row['Famille'])".Trim()
                        Qty = 0.0
                        CA = 0.0
                    }
                }
                $posProducts[$cleanProd].Qty += $qty
                $posProducts[$cleanProd].CA += $tot
            }
        }
    } catch {}
    finally { $conn.Close() }
}

Write-Host "Ventes post-mars chargees : $($posProducts.Count) produits distincts dans la caisse." -ForegroundColor Green

# Sauvegarde temporaire pour inspection
$posOut = Join-Path $rootDir "scripts\pos_products_post_mars.json"
$posProducts.Values | ConvertTo-Json -Depth 3 | Set-Content -Path $posOut -Encoding UTF8
Write-Host "Sauvegarde dans $posOut" -ForegroundColor Yellow
