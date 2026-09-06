/**
 * GREY CORNER — Import Ventes (Excel/PDF) & Module Audit Flash / Mensuel
 * Module: conso-audit.js
 */

/* ========================================================
   10. LECTURE EXCEL (SHEETJS), PARSER DE FICHIER & AUTO-SYNC /VENTES
======================================================== */
function extractDateFromFilename(rawFilename) {
  if (!rawFilename) return null;
  let filename = rawFilename;
  try { filename = decodeURIComponent(rawFilename); } catch (e) {}

  filename = filename.trim();

  // 1. Format ISO avec séparateurs : YYYY-MM-DD ou YYYY_MM_DD ou YYYY.MM.DD
  const mIso = filename.match(/\b(20\d{2})[-_.](0[1-9]|1[0-2])[-_.](0[1-9]|[12]\d|3[01])\b/);
  if (mIso) return `${mIso[1]}-${mIso[2]}-${mIso[3]}`;

  // 2. Format compact YYYYMMDD (ex: 20260829)
  const mCompact = filename.match(/\b(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\b/);
  if (mCompact) return `${mCompact[1]}-${mCompact[2]}-${mCompact[3]}`;

  // 3. Format FR avec séparateurs : DD-MM-YYYY ou DD_MM_YYYY (ex: 29-08-2026)
  const mFr = filename.match(/\b(0[1-9]|[12]\d|3[01])[-_.](0[1-9]|1[0-2])[-_.](20\d{2})\b/);
  if (mFr) return `${mFr[3]}-${mFr[2]}-${mFr[1]}`;

  // 4. Format FR compact DDMMYYYY (ex: 29082026)
  const mFrCompact = filename.match(/\b(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(20\d{2})\b/);
  if (mFrCompact) return `${mFrCompact[3]}-${mFrCompact[2]}-${mFrCompact[1]}`;

  // Fallback 8 chiffres
  const mFallback = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (mFallback) return `${mFallback[1]}-${mFallback[2]}-${mFallback[3]}`;

  return null;
}

function parseWorkbookToRows(workbook) {
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (json.length < 2) return [];

  let headerRowIndex = 0;
  let colFamille = -1, colProduit = -1, colPrix = -1, colQte = -1, colTotal = -1;

  for (let i = 0; i < Math.min(10, json.length); i++) {
    const row = json[i].map(x => cleanText(x));
    for (let j = 0; j < row.length; j++) {
      const val = row[j];
      if (val.includes('famille')) colFamille = j;
      if (val.includes('produit') || val.includes('article') || val.includes('designation') || val.includes('libelle')) colProduit = j;
      if (val === 'prix' || val.includes('pu') || val.includes('prix unitaire')) colPrix = j;
      if (val.includes('qte') || val.includes('quantite') || val === 'qty') colQte = j;
      if (val.includes('total') || val.includes('montant')) colTotal = j;
    }
    if (colProduit !== -1 && colQte !== -1) {
      headerRowIndex = i;
      break;
    }
  }

  if (colProduit === -1) { colProduit = 1; colFamille = 0; colPrix = 2; colQte = 3; colTotal = 4; headerRowIndex = -1; }

  const rawRows = [];
  for (let i = headerRowIndex + 1; i < json.length; i++) {
    const row = json[i];
    if (!row || row.length === 0) continue;

    const prod = (row[colProduit] || '').toString().trim();
    if (!prod || cleanText(prod) === 'total' || cleanText(prod) === 'somme') continue;

    const parseNum = (v) => {
      if (typeof v === 'number') return v;
      if (!v) return 0;
      return parseFloat(v.toString().replace(/\s/g, '').replace(',', '.')) || 0;
    };

    const fam = colFamille >= 0 ? (row[colFamille] || '').toString().trim() : '';
    const price = colPrix >= 0 ? parseNum(row[colPrix]) : 0;
    const qty = colQte >= 0 ? parseNum(row[colQte]) : 1;
    const total = colTotal >= 0 ? parseNum(row[colTotal]) : (qty * price);

    const finalPrice = price > 0 ? price : (total > 0 && qty > 0 ? total / qty : 0);
    const finalTotal = total > 0 ? total : (qty * finalPrice);

    // Exclure les lignes à 0 DH (boissons chaudes, thés, cafés et options déjà inclus dans les formules de petit-déjeuner / menus) pour éviter les doublons de déstockage matière première
    if (qty > 0 && (finalPrice > 0 || finalTotal > 0)) {
      rawRows.push({ family: fam, product: prod, price: finalPrice, qty, total: finalTotal });
    }
  }

  return rawRows;
}

// Gestion de fichiers importés par l'utilisateur (unitaire ou multiple)
async function handleUploadedFiles(fileList) {
  if (!fileList || fileList.length === 0) return;

  let loadedFilesCount = 0;
  let lastLoadedDate = selectedDate;

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const extractedDate = extractDateFromFilename(file.name) || selectedDate;

    try {
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const rows = parseWorkbookToRows(workbook);

      if (rows.length > 0) {
        monthlySalesDB[extractedDate] = rows;
        loadedFilesCount++;
        lastLoadedDate = extractedDate;
      }
    } catch (err) {
      console.warn("Erreur lors de la lecture du fichier : " + file.name, err);
    }
  }

  if (loadedFilesCount > 0) {
    saveMonthlySalesDB();
    selectedDate = lastLoadedDate;
    selectedYearMonth = selectedDate.slice(0, 7);
    renderCalendar();
    recalculateCurrentView();

    const banner = document.getElementById('sync-status-banner');
    if (banner) {
      banner.style.display = 'block';
      banner.textContent = `✅ ${loadedFilesCount} fichier(s) de ventes chargé(s) avec succès !`;
      setTimeout(() => { banner.style.display = 'none'; }, 6000);
    }
  } else {
    alert("Aucune ligne de vente exploitable n'a été trouvée dans les fichiers sélectionnés.");
  }
}

// Détection et synchronisation automatique avec le dossier racine /ventes
async function autoScanVentesFolder(showUserAlert = false) {
  const banner = document.getElementById('sync-status-banner');
  if (banner) {
    banner.style.display = 'block';
    banner.textContent = "🔄 Analyse et synchronisation du dossier /ventes en cours...";
    banner.style.color = "var(--accent)";
  }

  let foundCount = 0;
  let loadedDates = [];

  // Helper pour tenter plusieurs chemins relatifs avec cache-busting
  async function fetchFile(path, fallbackUrl = null) {
    const candidatePaths = [path, './' + path, '/' + path];
    if (fallbackUrl) candidatePaths.push(fallbackUrl);
    for (const p of candidatePaths) {
      try {
        const sep = p.includes('?') ? '&' : '?';
        const resp = await fetch(p + sep + 't=' + Date.now(), { cache: 'no-store' });
        if (resp.ok) return resp;
      } catch (e) { console.warn('[Auto-sync fetch]', e); }
    }
    return null;
  }

  // Map unifiée pour collecter les fichiers : Map<relPath, downloadUrl|null>
  const filesToProcess = new Map();

  // 1. SOURCE DYNAMIQUE EN TEMPS RÉEL : API GitHub (avec scan récursif des sous-dossiers par mois)
  try {
    const ghResp = await fetch('https://api.github.com/repos/hichamatlas75-del/Fiche-technique/contents/ventes?t=' + Date.now(), {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      cache: 'no-store'
    });
    if (ghResp.ok) {
      const ghItems = await ghResp.json();
      if (Array.isArray(ghItems)) {
        for (const item of ghItems) {
          if (!item) continue;
          if (item.type === 'file' && item.name) {
            const low = item.name.toLowerCase();
            if (low.endsWith('.xls') || low.endsWith('.xlsx')) {
              filesToProcess.set(item.name, item.download_url || null);
            }
          } else if (item.type === 'dir' && item.url) {
            // Sous-dossier mensuel (ex: 2026-08)
            try {
              const subResp = await fetch(item.url + (item.url.includes('?') ? '&' : '?') + 't=' + Date.now(), {
                headers: { 'Accept': 'application/vnd.github.v3+json' },
                cache: 'no-store'
              });
              if (subResp.ok) {
                const subItems = await subResp.json();
                if (Array.isArray(subItems)) {
                  subItems.forEach(subItem => {
                    if (subItem && subItem.name) {
                      const low = subItem.name.toLowerCase();
                      if (low.endsWith('.xls') || low.endsWith('.xlsx')) {
                        const rel = item.name + '/' + subItem.name;
                        filesToProcess.set(rel, subItem.download_url || null);
                      }
                    }
                  });
                }
              }
            } catch (errSub) {
              console.warn('[Auto-sync GitHub subfolder]', errSub);
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('[Auto-sync GitHub API]', e);
  }

  // 2. SOURCE STATIQUE : manifest.json (fonctionne en local ou si API GitHub indisponible)
  try {
    const manifestResp = await fetchFile('ventes/manifest.json');
    if (manifestResp) {
      const manifest = await manifestResp.json();
      const rawFiles = manifest ? manifest.files : [];
      const filesList = Array.isArray(rawFiles) ? rawFiles : (rawFiles ? [rawFiles] : []);
      filesList.forEach(fname => {
        if (fname && !filesToProcess.has(fname)) {
          filesToProcess.set(fname, null);
        }
      });
    }
  } catch (e) {
    console.warn('[Auto-sync manifest.json]', e);
  }

  // 3. SCANNER DE CANDIDATS (ACTIF UNIQUEMENT EN SECOURS si aucun fichier détecté par GitHub API / manifest.json)
  if (filesToProcess.size === 0) {
    const monthsToScan = new Set([
      selectedYearMonth,
      new Date().toLocaleDateString('en-CA').slice(0, 7)
    ]);

    monthsToScan.forEach(ym => {
      const [yearStr, monthStr] = ym.split('-');
      const totalDays = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();

      for (let day = 1; day <= totalDays; day++) {
        const dayStr = String(day).padStart(2, '0');
        const compactDate = `${yearStr}${monthStr}${dayStr}`;

        const candidateNames = [
          `${ym}/Fin_Journée_${compactDate}.xls`,
          `${ym}/Fin_Journee_${compactDate}.xls`,
          `${ym}/Fin_Journée_${compactDate}.xlsx`,
          `${ym}/Fin_Journee_${compactDate}.xlsx`,
          `Fin_Journée_${compactDate}.xls`,
          `Fin_Journee_${compactDate}.xls`
        ];

        candidateNames.forEach(cName => {
          if (!filesToProcess.has(cName)) {
            filesToProcess.set(cName, null);
          }
        });
      }
    });
  }

  // 4. CHARGEMENT ET TRAITEMENT DES FICHIERS
  for (const [fname, downloadUrl] of filesToProcess.entries()) {
    const dKey = extractDateFromFilename(fname);
    if (!dKey) continue;

    try {
      const pathSegments = fname.split('/').map(seg => encodeURIComponent(seg)).join('/');
      const resp = await fetchFile('ventes/' + pathSegments, downloadUrl);
      if (resp) {
        const buf = await resp.arrayBuffer();
        const wb = XLSX.read(new Uint8Array(buf), { type: 'array' });
        const rows = parseWorkbookToRows(wb);
        if (rows.length > 0) {
          monthlySalesDB[dKey] = rows;
          foundCount++;
          if (!loadedDates.includes(dKey)) {
            loadedDates.push(dKey);
          }
        }
      }
    } catch (e) {
      console.warn('[Auto-sync file error]', fname, e);
    }
  }

  // 5. SAUVEGARDE & ACTUALISATION DE L'INTERFACE
  if (foundCount > 0) {
    saveMonthlySalesDB();

    // AUTO-SÉLECTION : Basculer automatiquement sur la journée la plus récente avec des données
    const availableDates = Object.keys(monthlySalesDB).filter(d => monthlySalesDB[d] && monthlySalesDB[d].length > 0).sort();
    if (availableDates.length > 0) {
      selectedDate = availableDates[availableDates.length - 1];
      selectedYearMonth = selectedDate.slice(0, 7);
    }

    renderCalendar();
    recalculateCurrentView();

    loadedDates.sort();
    const lastDateFR = formatDateFR(selectedDate);
    const msg = `✅ ${foundCount} journée(s) synchronisée(s) ! Dernière date active : ${lastDateFR}.`;

    if (banner) {
      banner.style.color = "var(--ok)";
      banner.textContent = msg;
    }
    if (showUserAlert) {
      const recentList = loadedDates.slice(-6).map(d => '• ' + formatDateFR(d)).join('\n');
      alert(`✅ Synchronisation réussie !\n${foundCount} fichier(s) traités.\n\nJournées récentes chargées :\n${recentList}\n\nAffichage automatique des ventes du ${lastDateFR}.`);
    }
  } else {
    if (banner) {
      banner.style.color = "var(--muted)";
      banner.textContent = "📁 Dossier /ventes prêt. Déposez vos fichiers 'Fin_Journée_YYYYMMDD.xls' pour auto-chargement.";
    }
    if (showUserAlert) {
      alert("Aucun nouveau fichier de vente n'a été trouvé dans le dossier /ventes pour cette période.");
    }
  }
}

/* ========================================================
   11. EXPORT EXCEL MENSUEL & COMPARATIF COMMANDES
======================================================== */
function exportToExcel() {
  if (aggregatedIngredients.length === 0) {
    alert("Aucune donnée à exporter pour cette période.");
    return;
  }

  const isYearly = currentViewMode === 'year';
  const isMonthly = currentViewMode === 'month';
  const selectedYear = selectedYearMonth.slice(0, 4);
  const periodLabel = isYearly
    ? `Cumul Annuel — Année ${selectedYear}`
    : (isMonthly ? `Cumul Mensuel — ${formatMonthFR(selectedYearMonth)}` : `Journée du ${formatDateFR(selectedDate)}`);

  // Feuille 1: Synthèse des Matières Premières Consommées
  const wsIngData = [
    ["GREY CORNER — DÉSTOCKAGE MATIÈRES PREMIÈRES"],
    [`Période : ${periodLabel}`],
    ["Date d'export : " + new Date().toLocaleString('fr-FR')],
    [],
    ["Ingrédient / Matière Première", "Catégorie", "Quantité Totale Consommée", "Unité", "Nombre de Plats", "Détail Plats Consommateurs"]
  ];

  aggregatedIngredients.forEach(ing => {
    let qVal = ing.totalQty;
    let uStr = ing.unit;
    if (ing.unit === 'g' && ing.totalQty >= 1000) {
      qVal = (ing.totalQty / 1000);
      uStr = 'Kg';
    } else if (ing.unit === 'ml' && ing.totalQty >= 1000) {
      qVal = (ing.totalQty / 1000);
      uStr = 'Litres';
    }
    const dishesDetail = ing.dishes.map(d => `${d.dish} (${d.portions}p × ${d.unitQty}${d.unit})`).join(' ; ');
    wsIngData.push([ing.name, ing.category.toUpperCase(), qVal, uStr, ing.dishes.length, dishesDetail]);
  });

  // Feuille 2: Détail des Ventes
  const wsSalesData = [
    [`GREY CORNER — RELEVÉ DES VENTES (${periodLabel})`],
    [],
    ["Famille Caisse", "Article Vendu", "Quantité Vendue", "Prix Unitaire (DH)", "Total Vente (DH)", "Fiche Technique Associée", "Ingrédients Recette"]
  ];

  currentSalesData.forEach(s => {
    const ftName = s.matchedRecipe ? s.matchedRecipe.name : "NON CONFIGURÉ / BOISSON";
    const ings = s.matchedRecipe ? s.matchedRecipe.ingredients.join(' | ') : "";
    wsSalesData.push([s.family, s.product, s.qty, s.price, s.total, ftName, ings]);
  });

  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet(wsIngData);
  const ws2 = XLSX.utils.aoa_to_sheet(wsSalesData);

  const sheet1Name = isYearly ? "Synthèse Annuelle" : (isMonthly ? "Synthèse Mensuelle" : "Matières Premières");
  const sheet2Name = isYearly ? "Ventes de l'Année" : (isMonthly ? "Ventes du Mois" : "Ventes Journalières");

  XLSX.utils.book_append_sheet(wb, ws1, sheet1Name);
  XLSX.utils.book_append_sheet(wb, ws2, sheet2Name);

  // Si Annuel: on ajoute une Feuille 3 de Matrice Déstockage par Mois
  if (isYearly) {
    const monthShortNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const activeMonths = [];
    for (let m = 1; m <= 12; m++) {
      const mStr = String(m).padStart(2, '0');
      const mKey = `${selectedYear}-${mStr}`;
      const hasMData = Object.keys(monthlySalesDB).some(d => d.startsWith(mKey) && monthlySalesDB[d] && monthlySalesDB[d].length > 0);
      if (hasMData) {
        activeMonths.push({ mKey, label: `${monthShortNames[m - 1]} ${selectedYear}` });
      }
    }

    if (activeMonths.length > 0) {
      const matrixHeaders = ["Ingrédient / Matière Première", "Catégorie", "Unité", `TOTAL ANNÉE ${selectedYear}`, ...activeMonths.map(am => am.label)];
      const wsMatrixData = [
        [`GREY CORNER — MATRICE MENSUELLE DU CUMUL ANNUEL (${selectedYear})`],
        [],
        matrixHeaders
      ];

      const monthlyIngMaps = {};
      activeMonths.forEach(({ mKey }) => {
        const mMap = {};
        Object.keys(monthlySalesDB).forEach(dKey => {
          if (dKey.startsWith(mKey)) {
            const dRows = monthlySalesDB[dKey] || [];
            dRows.forEach(row => {
              const recipe = findRecipeForProduct(row.product, row.family);
              if (recipe) {
                (recipe.ingredients || []).forEach(ingLine => {
                  const parsed = parseIngredientLine(ingLine);
                  const totalQ = parsed.qty * (parseFloat(row.qty) || 0);
                  const k = cleanText(parsed.name) + '_' + parsed.unit;
                  mMap[k] = (mMap[k] || 0) + totalQ;
                });
              }
            });
          }
        });
        monthlyIngMaps[mKey] = mMap;
      });

      aggregatedIngredients.forEach(ing => {
        const k = cleanText(ing.name) + '_' + ing.unit;
        let totQ = ing.totalQty;
        let uStr = ing.unit;
        if (ing.unit === 'g' && ing.totalQty >= 1000) { totQ /= 1000; uStr = 'Kg'; }
        else if (ing.unit === 'ml' && ing.totalQty >= 1000) { totQ /= 1000; uStr = 'Litres'; }

        const rowCells = [ing.name, ing.category.toUpperCase(), uStr, totQ];
        activeMonths.forEach(({ mKey }) => {
          let mVal = monthlyIngMaps[mKey][k] || 0;
          if (ing.unit === 'g' && ing.totalQty >= 1000) mVal /= 1000;
          else if (ing.unit === 'ml' && ing.totalQty >= 1000) mVal /= 1000;
          rowCells.push(mVal > 0 ? mVal : '');
        });
        wsMatrixData.push(rowCells);
      });

      const ws3 = XLSX.utils.aoa_to_sheet(wsMatrixData);
      XLSX.utils.book_append_sheet(wb, ws3, "Matrice par Mois");
    }
  } else if (isMonthly) {
    // Si Mensuel: on ajoute une Feuille 3 de Matrice Déstockage par Jour
    const activeDates = Object.keys(monthlySalesDB).filter(d => d.startsWith(selectedYearMonth) && monthlySalesDB[d].length > 0).sort();
    if (activeDates.length > 0) {
      const matrixHeaders = ["Ingrédient / Matière Première", "Catégorie", "Unité", "TOTAL MOIS", ...activeDates.map(d => d.slice(8, 10) + '/' + d.slice(5, 7))];
      const wsMatrixData = [
        [`GREY CORNER — MATRICE JOURNALIÈRE DU MOIS (${formatMonthFR(selectedYearMonth)})`],
        [],
        matrixHeaders
      ];

      // Calcul par jour pour chaque ingrédient
      const dailyIngMaps = {};
      activeDates.forEach(dKey => {
        const dMap = {};
        const dRows = monthlySalesDB[dKey] || [];
        dRows.forEach(row => {
          const recipe = findRecipeForProduct(row.product, row.family);
          if (recipe) {
            (recipe.ingredients || []).forEach(ingLine => {
              const parsed = parseIngredientLine(ingLine);
              const totalQ = parsed.qty * (parseFloat(row.qty) || 0);
              const k = cleanText(parsed.name) + '_' + parsed.unit;
              dMap[k] = (dMap[k] || 0) + totalQ;
            });
          }
        });
        dailyIngMaps[dKey] = dMap;
      });

      aggregatedIngredients.forEach(ing => {
        const k = cleanText(ing.name) + '_' + ing.unit;
        let totQ = ing.totalQty;
        let uStr = ing.unit;
        if (ing.unit === 'g' && ing.totalQty >= 1000) { totQ /= 1000; uStr = 'Kg'; }
        else if (ing.unit === 'ml' && ing.totalQty >= 1000) { totQ /= 1000; uStr = 'Litres'; }

        const rowCells = [ing.name, ing.category.toUpperCase(), uStr, totQ];
        activeDates.forEach(dKey => {
          let dayVal = dailyIngMaps[dKey][k] || 0;
          if (ing.unit === 'g' && ing.totalQty >= 1000) dayVal /= 1000;
          else if (ing.unit === 'ml' && ing.totalQty >= 1000) dayVal /= 1000;
          rowCells.push(dayVal > 0 ? dayVal : '');
        });
        wsMatrixData.push(rowCells);
      });

      const ws3 = XLSX.utils.aoa_to_sheet(wsMatrixData);
      XLSX.utils.book_append_sheet(wb, ws3, "Matrice par Jour");
    }
  }

  const fileName = isYearly
    ? `GreyCorner_Destockage_Annuel_${selectedYear}.xlsx`
    : (isMonthly ? `GreyCorner_Destockage_Mensuel_${selectedYearMonth}.xlsx` : `GreyCorner_Destockage_${selectedDate}.xlsx`);
  XLSX.writeFile(wb, fileName);
}

/* ========================================================
   13. MODULE D'AUDIT DE STOCK FLASH & FIN DE MOIS (PDF & MULTI-ARTICLES)
======================================================== */
var auditMonthlyArticles = [];
var currentAuditCatFilter = 'all';
var currentAuditStatusFilter = 'all';
// Unité pratique de pesée pour l'Audit Flash (g→Kg, ml→L)
var auditFlashFactor = 1;       // diviseur : 1000 pour g→Kg ou ml→L, 1 sinon
var auditFlashDisplayUnit = 'unité'; // unité affichée à l'utilisateur (Kg, L, p…)


function switchAuditSubTab(mode) {
  const btnFlash = document.getElementById('btn-subtab-flash');
  const btnMonth = document.getElementById('btn-subtab-month');
  const viewFlash = document.getElementById('audit-view-flash');
  const viewMonth = document.getElementById('audit-view-month');

  if (mode === 'flash') {
    btnFlash.classList.add('active');
    btnMonth.classList.remove('active');
    viewFlash.style.display = 'block';
    viewMonth.style.display = 'none';
    initAuditFlashDropdown();
  } else {
    btnMonth.classList.add('active');
    btnFlash.classList.remove('active');
    viewMonth.style.display = 'block';
    viewFlash.style.display = 'none';
    if (auditMonthlyArticles.length === 0) {
      syncAuditWithMonthlySales();
    }
  }
}

// 13.1 AUDIT FLASH
function initAuditFlashDropdown() {
  const select = document.getElementById('flash-ing-select');
  if (!select) return;

  const currentVal = select.value;
  const recipesList = (activeRecipes && activeRecipes.length > 0) ? activeRecipes : (window.BASE_RECIPES || []);

  const uniqueIngs = new Map();
  recipesList.forEach(r => {
    (r.ingredients || []).forEach(line => {
      const parsed = parseIngredientLine(line);
      const clean = cleanText(parsed.name);
      if (!uniqueIngs.has(clean) && clean.length > 1) {
        uniqueIngs.set(clean, { name: parsed.name, unit: parsed.unit });
      }
    });
  });

  const sorted = [...uniqueIngs.values()].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  // Fonction pour convertir l'unité brute en unité pratique de pesée
  function toDisplayUnit(u) {
    if (u === 'g') return 'Kg';
    if (u === 'ml') return 'L';
    return u;
  }

  select.innerHTML = '<option value="">-- Choisir un ingrédient (' + sorted.length + ' disponibles) --</option>' +
    sorted.map(ing => `<option value="${ing.name}" data-unit="${ing.unit}">${ing.name} (${toDisplayUnit(ing.unit)})</option>`).join('');

  if (currentVal) {
    select.value = currentVal;
  }
}

function onFlashIngredientChange() {
  const select = document.getElementById('flash-ing-select');
  if (!select) return;
  const opt = select.options[select.selectedIndex];
  if (!opt || !select.value) return;

  const baseUnit = opt.dataset.unit || 'g';

  // Conversion vers l'unité pratique de pesée (g→Kg, ml→L)
  if (baseUnit === 'g') {
    auditFlashDisplayUnit = 'Kg';
    auditFlashFactor = 1000;
  } else if (baseUnit === 'ml') {
    auditFlashDisplayUnit = 'L';
    auditFlashFactor = 1000;
  } else {
    auditFlashDisplayUnit = baseUnit;
    auditFlashFactor = 1;
  }

  // Mettre à jour tous les libellés d'unité dans le formulaire
  document.querySelectorAll('.flash-unit-lbl').forEach(el => el.textContent = auditFlashDisplayUnit);

  // Pré-remplir le théorique en unité pratique (Kg ou L, pas g ni ml)
  const cTarget = cleanText(select.value);
  const found = aggregatedIngredients.find(item => cleanText(item.name) === cTarget || cleanText(item.name).includes(cTarget));
  if (found) {
    document.getElementById('flash-theorique').value = (found.totalQty / auditFlashFactor).toFixed(3);
  } else {
    document.getElementById('flash-theorique').value = '0';
  }

  // Prix unitaire par défaut en DH / unité pratique (DH/Kg, DH/L, DH/p)
  const cat = categorizeIngredient(select.value);
  let defaultPrice = 50;
  if (cat === 'viandes') defaultPrice = 85;
  else if (cat === 'poissons') defaultPrice = 110;
  else if (cat === 'fromages') defaultPrice = 65;
  else if (cat === 'boissons') defaultPrice = 15;
  else if (cat === 'legumes') defaultPrice = 12;
  else if (cat === 'epicerie') defaultPrice = 18;
  document.getElementById('flash-prix').value = defaultPrice;

  calculateAuditFlash();
}


function calculateAuditFlash() {
  const sInit = parseFloat(document.getElementById('flash-s-init').value) || 0;
  const achats = parseFloat(document.getElementById('flash-achats').value) || 0;
  const sFinal = parseFloat(document.getElementById('flash-s-final').value) || 0;
  const theo = parseFloat(document.getElementById('flash-theorique').value) || 0;
  const casse = parseFloat(document.getElementById('flash-casse').value) || 0;
  const prix = parseFloat(document.getElementById('flash-prix').value) || 0;
  const select = document.getElementById('flash-ing-select');
  // Utiliser l'unité pratique de pesée (Kg, L, p…) définie à la sélection de l'ingrédient
  const unit = auditFlashDisplayUnit || (select && select.options[select.selectedIndex] ? select.options[select.selectedIndex].dataset.unit || 'unité' : 'unité');

  const consReelle = (sInit + achats) - sFinal;
  const consAttendue = theo + casse;
  const ecart = consReelle - consAttendue;
  const ecartPct = consAttendue > 0 ? (ecart / consAttendue) * 100 : (ecart !== 0 ? Infinity : 0);
  const impactDH = ecart * prix;

  const resBox = document.getElementById('flash-result-box');
  const badge = document.getElementById('flash-status-badge');
  const diagBox = document.getElementById('flash-diagnostic-box');

  resBox.style.display = 'block';
  document.getElementById('flash-kpi-reel').textContent = consReelle.toFixed(2) + ' ' + unit;
  document.getElementById('flash-kpi-attendu').textContent = consAttendue.toFixed(2) + ' ' + unit;
  
  const sign = ecart > 0 ? '+' : '';
  document.getElementById('flash-kpi-ecart').textContent = sign + ecart.toFixed(2) + ' ' + unit;
  document.getElementById('flash-kpi-ecart-pct').textContent = sign + ecartPct.toFixed(1) + '%';
  document.getElementById('flash-kpi-impact').textContent = sign + impactDH.toFixed(2) + ' DH';

  if (Math.abs(ecartPct) <= 3 || (Math.abs(ecart) < 0.05 && consAttendue > 0)) {
    badge.className = 'status-badge ok';
    badge.textContent = 'CONFORME (Tolérance ±3%)';
    diagBox.innerHTML = `<strong>✅ Situation Conforme :</strong> Le dosage en cuisine et les fiches techniques sont scrupuleusement respectés. L'écart (${sign}${ecart.toFixed(2)} ${unit}) est dans la marge normale de manipulation.`;
  } else if (ecartPct > 3 && ecartPct <= 8) {
    badge.className = 'status-badge warn';
    badge.textContent = 'SURDOSAGE LÉGER';
    diagBox.innerHTML = `<strong>⚠️ Dérive Modérée (+ ${ecartPct.toFixed(1)}%) :</strong> Légère surconsommation constatée (${impactDH.toFixed(2)} DH de surcoût). Recommandation : vérifier le portionnage en cuisine, le calibrage des cuillères/balances et la tare au dressage.`;
  } else if (ecartPct > 8) {
    badge.className = 'status-badge danger';
    badge.textContent = 'SURCONSOMMATION CRITIQUE';
    diagBox.innerHTML = `<strong>🚨 Surconsommation Critique (+ ${ecartPct.toFixed(1)}%) :</strong> Dérive financière de ${impactDH.toFixed(2)} DH. Causes fréquentes : surdosage systématique des portions, casse importante non enregistrée, coulage ou vol. Réaliser un recomptage physique immédiat.`;
  } else {
    badge.className = 'status-badge under';
    badge.textContent = 'SOUS-DOSAGE';
    diagBox.innerHTML = `<strong>📉 Consommation Inférieure aux Recettes (${ecartPct.toFixed(1)}%) :</strong> Moins de matière consommée que prévu. Vérifier la conformité de la fiche technique (grammage surévalué) ou contrôler que les portions servies aux clients ne sont pas sous-dosées.`;
  }
}

// 13.2 LECTURE INTELLIGENTE DES FICHIERS PDF & EXCEL (ACHATS, INVENTAIRES CUISINE, BAR, PT DEJEUNER, CASSE)
async function handleAuditFileUpload(event, targetType) {
  const fileList = event.target.files;
  if (!fileList || fileList.length === 0) return;

  const cardId = targetType === 'm1' ? 'dz-m1' : (targetType === 'achats' ? 'dz-achats' : (targetType === 'm' ? 'dz-m' : 'dz-casse'));
  const statusId = targetType === 'm1' ? 'status-m1' : (targetType === 'achats' ? 'status-achats' : (targetType === 'm' ? 'status-m' : 'status-casse'));
  const card = document.getElementById(cardId);
  const status = document.getElementById(statusId);

  let totalExtractedCount = 0;

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];

    if (file.name.endsWith('.pdf')) {
      try {
        if (status) {
          status.textContent = `⏳ Analyse du fichier ${i + 1}/${fileList.length} (${file.name})...`;
          status.style.display = 'block';
        }
        const extractedRows = await extractDataFromPDF(file, (msg) => {
          if (status) status.textContent = `⏳ ${file.name} : ${msg}`;
        });
        applyExtractedDataToAudit(extractedRows, targetType, i === 0);
        totalExtractedCount += extractedRows.length;
      } catch (err) {
        console.error('Erreur lecture PDF:', err);
      }
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      try {
        if (status) {
          status.textContent = `⏳ Analyse du fichier Excel ${i + 1}/${fileList.length}...`;
          status.style.display = 'block';
        }
        const buffer = await file.arrayBuffer();
        const data = new Uint8Array(buffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const extracted = parseExcelRowsToAuditData(rows);
        applyExtractedDataToAudit(extracted, targetType, i === 0);
        totalExtractedCount += extracted.length;
      } catch (err) {
        console.error('Erreur lecture Excel:', err);
      }
    }
  }

  if (card && status) {
    card.classList.add('loaded');
    status.textContent = `✅ ${fileList.length} fichier(s) analysé(s) (${totalExtractedCount} lignes importées)`;
    status.style.display = 'block';
  }
}

async function extractDataFromPDF(file, onProgress) {
  if (typeof pdfjsLib === 'undefined') {
    throw new Error('PDF.js non chargé');
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullTextLines = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Regrouper les éléments par ligne approximative (Y)
    const items = textContent.items;
    let linesMap = new Map();
    items.forEach(it => {
      const y = Math.round(it.transform[5]);
      if (!linesMap.has(y)) linesMap.set(y, []);
      linesMap.get(y).push(it.str);
    });

    // Trier les lignes du haut vers le bas
    const sortedY = [...linesMap.keys()].sort((a, b) => b - a);
    sortedY.forEach(y => {
      const lineStr = linesMap.get(y).join(' ').trim();
      if (lineStr.length > 2) fullTextLines.push(lineStr);
    });
  }

  // Si le PDF est une image scannée sans flux texte (0 caractère extrait), utiliser l'OCR Tesseract.js
  if (fullTextLines.length === 0 && typeof Tesseract !== 'undefined') {
    try {
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        if (onProgress) onProgress(`Numérisation OCR Page ${pageNum}/${pdf.numPages}...`);
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        const worker = await Tesseract.createWorker('fra');
        const ret = await worker.recognize(canvas);
        await worker.terminate();

        if (ret && ret.data && ret.data.text) {
          const ocrLines = ret.data.text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
          fullTextLines.push(...ocrLines);
        }
      }
    } catch (ocrErr) {
      console.warn('OCR non exécuté ou erreur:', ocrErr);
    }
  }

  return parseTextLinesToAudit(fullTextLines);
}

function parseTextLinesToAudit(lines) {
  const result = [];
  const validUnits = 'kg|g|gr|l|litre|litres|cl|ml|p|pcs|pc|piece|pieces|paquet|paquets|boite|boites|boîte|boîtes|carton|cartons|btl|bouteille|bouteilles|unite|unites';
  const categoryWords = ['barman', 'personnel', 'petit-dejeuner', 'petit-déjeuner', 'cuisine', 'economat', 'épicerie', 'epicerie', 'boissons'];

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    if (line.startsWith('Position') || line.startsWith('Rapport') || line.startsWith('Période') || line.startsWith('Consommation') || line.startsWith('Détails') || line.startsWith('DÉSIGNATION') || line.startsWith('DESIGNATION') || line.startsWith('BILAN') || line.startsWith('Total') || line.startsWith('Articles') || line.startsWith('Grey Corner') || line.startsWith('#') || line.startsWith('Coût Total') || line.startsWith('SOMME TOTALE')) return;
    if (line.includes('Casse physique:') || line.includes('Cuisine:') || line.includes('Barman:') || line.includes('Péremption:') || line.includes('Autre:')) return;

    let cleanLine = line.replace(/^\d+\s+/, '').trim();

    // FORMAT 1: [DÉSIGNATION] [CATÉGORIE] [QTÉ] [UNITÉ] [TOTAL DH] (Rapport Achats / Conso Exhaustive)
    const catRegex = new RegExp('\\s+(' + categoryWords.join('|') + ')\\s+([0-9]+[.,]?[0-9]*)\\s*(' + validUnits + ')?(?:\\s+([0-9]+[.,]?[0-9]*))?$', 'i');
    let m = cleanLine.match(catRegex);
    if (m) {
      const rawName = cleanLine.substring(0, cleanLine.indexOf(m[0])).trim();
      const qty = parseFloat(m[2].replace(',', '.'));
      const unit = (m[3] || 'g').toLowerCase().trim();
      const valTotal = m[4] ? parseFloat(m[4].replace(',', '.')) : 0;
      const unitPrice = (qty > 0 && valTotal > 0) ? (valTotal / qty) : 0;
      if (rawName.length >= 2 && !isNaN(qty)) {
        result.push({ name: rawName, qty, unit, price: unitPrice });
        return;
      }
    }

    // FORMAT 2: [DÉSIGNATION] [QTÉ] [UNITÉ] [P.U DH] [TOTAL DH] [FICHES] (Rapport Casse)
    const casseRegex = new RegExp('^(.+?)\\s+([0-9]+[.,]?[0-9]*)\\s*(' + validUnits + ')?\\s+([0-9]+[.,]?[0-9]*)\\s*(?:dh)?\\s+([0-9]+[.,]?[0-9]*)\\s*(?:dh)?', 'i');
    m = cleanLine.match(casseRegex);
    if (m) {
      const rawName = m[1].trim();
      const qty = parseFloat(m[2].replace(',', '.'));
      const unit = (m[3] || 'g').toLowerCase().trim();
      const price = parseFloat(m[4].replace(',', '.'));
      if (rawName.length >= 2 && !isNaN(qty)) {
        result.push({ name: rawName, qty, unit, price });
        return;
      }
    }

    // FORMAT 3: [DÉSIGNATION] [UNITÉ] [QTÉ] (Rapport Inventaire Physique Grey Corner)
    // Ex: "Amande Kg 0.1", "COCA 33CL Paquet 0.5", "BLANC POULET KG Kg 16.063", "CREM FRAICHE 1 L L 4"
    const unitFirstRegex = new RegExp('^(.+?)\\s+(' + validUnits + ')\\s+([0-9]+[.,]?[0-9]*)$', 'i');
    m = cleanLine.match(unitFirstRegex);
    if (m) {
      const rawName = m[1].trim();
      const unit = m[2].toLowerCase().trim();
      const qty = parseFloat(m[3].replace(',', '.'));
      if (rawName.length >= 2 && !isNaN(qty)) {
        result.push({ name: rawName, qty, unit, price: 0 });
        return;
      }
    }

    // FORMAT 4: Standard [DÉSIGNATION] [QTÉ] [UNITÉ] [PRIX?]
    const stdRegex = new RegExp('^(.+?)\\s+([0-9]+[.,]?[0-9]*)\\s*(' + validUnits + ')?(?:\\s+([0-9]+[.,]?[0-9]*))?$', 'i');
    m = cleanLine.match(stdRegex);
    if (m) {
      const rawName = m[1].replace(/^[0-9\-_.]+\s*/, '').trim();
      const qty = parseFloat(m[2].replace(',', '.'));
      const unit = (m[3] || 'g').toLowerCase().trim();
      const price = m[4] ? parseFloat(m[4].replace(',', '.')) : 0;
      if (rawName.length >= 2 && !isNaN(qty)) {
        result.push({ name: rawName, qty, unit, price });
      }
    }
  });

  return result;
}

function parseExcelRowsToAuditData(rows) {
  const result = [];
  if (!rows || rows.length === 0) return result;

  let headerIndex = -1;
  let nameCol = -1, qtyCol = -1, unitCol = -1, priceCol = -1, totalCol = -1;

  // 1. Chercher la ligne d'en-tête sur les 30 premières lignes
  for (let i = 0; i < Math.min(rows.length, 30); i++) {
    if (!Array.isArray(rows[i])) continue;
    const rowCells = rows[i].map(x => String(x || '').toLowerCase().trim());
    const rowStr = rowCells.join(' ');

    const hasName = rowCells.some(c => c.includes('désignation') || c.includes('designation') || c.includes('produit') || c.includes('article') || c.includes('nom') || c.includes('libelle') || c.includes('libellé') || c.includes('matiere') || c.includes('matière'));
    const hasQty = rowCells.some(c => c.includes('quantité') || c.includes('quantite') || c.includes('qte') || c.includes('qté') || c.includes('réel') || c.includes('reel') || c.includes('stock') || c.includes('compté') || c.includes('compte') || c.includes('somme') || c.includes('conso'));

    if (hasName && (hasQty || rowStr.includes('unité') || rowStr.includes('unite') || rowStr.includes('prix') || rowStr.includes('valeur'))) {
      headerIndex = i;
      rows[i].forEach((cell, colIdx) => {
        const c = String(cell || '').toLowerCase().trim();
        if (nameCol === -1 && (c.includes('désignation') || c.includes('designation') || c.includes('produit') || c.includes('article') || c.includes('nom') || c.includes('libelle') || c.includes('libellé') || c.includes('matiere') || c.includes('matière'))) {
          nameCol = colIdx;
        } else if (qtyCol === -1 && (c.includes('quantité') || c.includes('quantite') || c.includes('qte') || c.includes('qté') || c.includes('réel') || c.includes('reel') || c.includes('stock') || c.includes('compté') || c.includes('compte') || c.includes('somme') || c.includes('conso'))) {
          qtyCol = colIdx;
        } else if (unitCol === -1 && (c.includes('unité') || c.includes('unite') || c === 'u' || c === 'un')) {
          unitCol = colIdx;
        } else if (priceCol === -1 && (c.includes('p.u') || c.includes('pu') || c.includes('prix') || c.includes('cout') || c.includes('coût'))) {
          priceCol = colIdx;
        } else if (totalCol === -1 && (c.includes('total') || c.includes('valeur') || c.includes('montant'))) {
          totalCol = colIdx;
        }
      });
      break;
    }
  }

  // 2. Si aucun en-tête explicite trouvé, heuristique par structure de données
  if (headerIndex === -1) {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!Array.isArray(r) || r.length < 2) continue;
      const c0 = String(r[0] || '').trim();
      const c1 = String(r[1] || '').trim();
      const c2 = String(r[2] || '').trim();
      if (c0.length > 1 && !isNaN(parseFloat(c1.replace(',', '.')))) {
        headerIndex = i - 1;
        nameCol = 0; qtyCol = 1; unitCol = 2;
        break;
      } else if (c0.length > 1 && (c1.toLowerCase() === 'kg' || c1.toLowerCase() === 'g' || c1.toLowerCase() === 'l' || c1.toLowerCase() === 'pcs' || c1.toLowerCase() === 'paquet') && !isNaN(parseFloat(c2.replace(',', '.')))) {
        headerIndex = i - 1;
        nameCol = 0; unitCol = 1; qtyCol = 2;
        break;
      }
    }
  }

  if (nameCol === -1) nameCol = 0;
  if (qtyCol === -1) qtyCol = 1;
  if (unitCol === -1) unitCol = 2;

  const startRow = headerIndex >= 0 ? headerIndex + 1 : 0;

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row) || row.length === 0) continue;

    let rawName = String(row[nameCol] || '').trim();
    if (!rawName || rawName.length < 2) continue;
    const lowerName = rawName.toLowerCase();
    if (lowerName.includes('total') || lowerName.includes('synthèse') || lowerName.includes('synthese') || lowerName.includes('rapport') || lowerName.includes('grey corner') || lowerName.includes('détails') || lowerName.includes('details') || lowerName.includes('articles comptés')) continue;

    rawName = rawName.replace(/^\d+\s+/, '').trim();

    let rawQtyStr = String(row[qtyCol] !== undefined && row[qtyCol] !== null ? row[qtyCol] : '').trim();
    let qty = parseFloat(rawQtyStr.replace(',', '.'));

    let rawUnit = unitCol >= 0 && row[unitCol] !== undefined && row[unitCol] !== null ? String(row[unitCol]).trim().toLowerCase() : 'g';

    // Si qty n'est pas un nombre mais unitCol contient un nombre (colonnes inversées)
    if (isNaN(qty) && unitCol >= 0) {
      const altQty = parseFloat(String(row[unitCol]).replace(',', '.'));
      if (!isNaN(altQty)) {
        qty = altQty;
        rawUnit = String(row[qtyCol]).trim().toLowerCase();
      }
    }

    if (isNaN(qty)) continue;

    let price = priceCol >= 0 && row[priceCol] !== undefined ? parseFloat(String(row[priceCol]).replace(',', '.')) : 0;
    if (isNaN(price) || price === 0) {
      if (totalCol >= 0 && row[totalCol] !== undefined) {
        const valTotal = parseFloat(String(row[totalCol]).replace(',', '.'));
        if (qty > 0 && !isNaN(valTotal) && valTotal > 0) {
          price = valTotal / qty;
        }
      }
    }

    result.push({
      name: rawName,
      qty: qty,
      unit: rawUnit || 'g',
      price: !isNaN(price) ? price : 0
    });
  }

  return result;
}

function applyExtractedDataToAudit(extractedItems, targetType, isFirstFile = false) {
  if (auditMonthlyArticles.length === 0) {
    syncAuditWithMonthlySales();
  }

  extractedItems.forEach(ext => {
    // 1. Recherche par Smart Fuzzy Matching (Tolérance orthographe, synonymes, déclinaisons)
    const matchResult = findBestIngredientMatch(ext.name, auditMonthlyArticles);
    let target = matchResult ? matchResult.article : null;

    if (!target) {
      // Nouvel article non présent dans les fiches
      target = {
        name: ext.name,
        category: categorizeIngredient(ext.name),
        unit: ext.unit || 'g',
        sInit: 0,
        achats: 0,
        sFinal: 0,
        theorique: 0,
        casse: 0,
        prix: ext.price || 50
      };
      auditMonthlyArticles.push(target);
    }

    // 2. Conversion automatique des conditionnements groupés (Boîtes 24 Sodas, 12 Eaux/Oulmès, 8 Orangina, 88 Fromage, etc.)
    const packConv = convertBeveragePackaging(ext.name, ext.qty, ext.unit);
    let convertedQty = packConv.qty;
    const impUnit = (packConv.unit || '').toLowerCase().trim();
    const targetUnit = (target.unit || 'g').toLowerCase().trim();

    // 3. Conversion d'unité intelligente métrique (ex: kg -> g, L -> ml, cl -> ml)
    if (targetUnit === 'g') {
      if (impUnit === 'kg' || impUnit === 'kilo') convertedQty = convertedQty * 1000;
    } else if (targetUnit === 'kg') {
      if (impUnit === 'g' || impUnit === 'gr') convertedQty = convertedQty / 1000;
    } else if (targetUnit === 'ml') {
      if (impUnit === 'l' || impUnit === 'litre') convertedQty = convertedQty * 1000;
      else if (impUnit === 'cl') convertedQty = convertedQty * 10;
    } else if (targetUnit === 'l' || targetUnit === 'litre') {
      if (impUnit === 'ml') convertedQty = convertedQty / 1000;
      else if (impUnit === 'cl') convertedQty = convertedQty / 100;
    }

    // 4. Application ou cumul des quantités
    if (targetType === 'm1') {
      if (isFirstFile) target.sInit = convertedQty;
      else target.sInit = (target.sInit || 0) + convertedQty;
    } else if (targetType === 'achats') {
      if (isFirstFile) target.achats = convertedQty;
      else target.achats = (target.achats || 0) + convertedQty;
    } else if (targetType === 'm') {
      if (isFirstFile) target.sFinal = convertedQty;
      else target.sFinal = (target.sFinal || 0) + convertedQty;
    } else if (targetType === 'casse') {
      if (isFirstFile) target.casse = convertedQty;
      else target.casse = (target.casse || 0) + convertedQty;
    }
    if (ext.price && ext.price > 0) {
      if (packConv.multiplier > 1) target.prix = ext.price / packConv.multiplier;
      else target.prix = ext.price;
    }
  });

  recalculateMonthlyAudit();
}


/* ========================================================
   13.B MOTEUR DE RAPPROCHEMENT INTELLIGENT & SYNONYMES (SMART MATCHING)
======================================================== */
const INVENTORY_NOISE_WORDS = new Set([
  'kg', 'g', 'gr', 'gramme', 'grammes', 'kilo', 'kilos', 'l', 'litre', 'litres', 'cl', 'ml',
  'colis', 'carton', 'pack', 'btl', 'bouteille', 'bouteilles', 'boite', 'boites', 'bt', 'sachet', 'sachets',
  'sac', 'sacs', 'barquette', 'barquettes', 'piece', 'pieces', 'pcs', 'pce', 'tranche', 'tranches', 'portion', 'portions',
  'frais', 'fraiche', 'fraiches', 'congele', 'congeles', 'surgele', 'surgeles', 'cuit', 'cuits', 'cuite', 'cuites',
  'cru', 'crus', 'crue', 'crues', 'marine', 'marines', 'marinee', 'marinees', 'rape', 'rapes', 'rapee', 'rapees',
  'tranche', 'tranches', 'tranchee', 'tranchees', 'bloc', 'blocs', 'moulu', 'moulus', 'grain', 'grains',
  'entier', 'entiers', 'entiere', 'entieres', 'uht', 'pur', 'pure', 'bio', 'nature',
  'de', 'du', 'des', 'la', 'le', 'les', 'l', 'd', 'en', 'au', 'aux', 'a', 'pour', 'avec', 'sans',
  'qualite', 'sup', 'superieure', 'extra', 'select', 'import', 'local', 'maison'
]);

const INVENTORY_SYNONYMS = {
  'mozza': 'mozzarella',
  'mozzarela': 'mozzarella',
  'mozarila': 'mozzarella',
  'mozzarella râpée': 'mozzarella',
  'mozzarella bloc': 'mozzarella',
  'saumon': 'saumon',
  'salmon': 'saumon',
  'saumon fumé': 'saumon',
  'pave saumon': 'saumon',
  'poulet': 'poulet',
  'chicken': 'poulet',
  'blanc poulet': 'poulet',
  'blanc de poulet': 'poulet',
  'filet poulet': 'poulet',
  'filet de poulet': 'poulet',
  'escalope poulet': 'poulet',
  'emince poulet': 'poulet',
  'kefta': 'viande hachee',
  'steak hache': 'viande hachee',
  'hache boeuf': 'viande hachee',
  'hache': 'viande hachee',
  'crevette': 'crevettes',
  'crevettes': 'crevettes',
  'shrimp': 'crevettes',
  'gambas': 'crevettes',
  'oeuf': 'oeufs',
  'oeufs': 'oeufs',
  'egg': 'oeufs',
  'eggs': 'oeufs',
  'coulis tomate': 'sauce tomate',
  'base tomate': 'sauce tomate',
  'sauce pizza': 'sauce tomate',
  'creme fraiche': 'creme liquide',
  'creme cuisson': 'creme liquide',
  'creme 30': 'creme liquide',
  'creme 35': 'creme liquide',
  'pain bun': 'pain burger',
  'buns': 'pain burger',
  'bun': 'pain burger',
  'toast': 'pain de mie',
  'wrap': 'tortilla wrap',
  'tortilla': 'tortilla wrap',
  'galette wrap': 'tortilla wrap',
  'monin': 'sirop',
  'espresso': 'cafe',
  'cafe grains': 'cafe',
  'cafe moulu': 'cafe',
  'lait centrale': 'lait',
  'lait uht': 'lait',
  'avocat hass': 'avocat',
  'pate tartiner': 'nutella',
  'pate a tartiner': 'nutella',
  'crem chese': 'cream cheese',
  'crem plus': 'creme liquide',
  'aubirgine': 'aubergine',
  'buratta': 'burrata',
  'fromage buratta': 'burrata',
  'fette': 'feta',
  'fr fette': 'feta',
  'sucre semoule': 'sucre',
  'vanille poudre': 'vanille',
  'lorange': 'orange',
  'brocolis': 'brocoli',
  'spagheti': 'spaghetti',
  'olive vert': 'olives'
};

function normalizeSmartInventoryText(str) {
  if (!str) return '';
  let s = str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[0-9]+([.,][0-9]+)?\s*(kg|g|l|cl|ml|p|pcs|gr)?\b/gi, ' ')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const [k, v] of Object.entries(INVENTORY_SYNONYMS)) {
    const reg = new RegExp('\\b' + k + '\\b', 'g');
    s = s.replace(reg, v);
  }

  const tokens = s.split(' ')
    .map(w => w.replace(/s\b/, ''))
    .filter(w => w.length > 1 && !INVENTORY_NOISE_WORDS.has(w));

  return tokens.join(' ');
}

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function findBestIngredientMatch(importedName, candidateArticles) {
  const normImp = normalizeSmartInventoryText(importedName);
  if (!normImp || !candidateArticles || candidateArticles.length === 0) return null;

  let bestArticle = null;
  let bestScore = 0;

  const impTokens = new Set(normImp.split(' ').filter(x => x.length > 1));

  for (const article of candidateArticles) {
    const normArt = normalizeSmartInventoryText(article.name);
    if (!normArt) continue;

    let score = 0;

    if (normImp === normArt) {
      score = 1.0;
    } else if (normImp.includes(normArt) || normArt.includes(normImp)) {
      score = 0.95;
    } else {
      const artTokens = new Set(normArt.split(' ').filter(x => x.length > 1));
      let matchCount = 0;
      impTokens.forEach(t => {
        if (artTokens.has(t)) matchCount++;
        else {
          for (const at of artTokens) {
            if (levenshteinDistance(t, at) <= 1 && Math.min(t.length, at.length) >= 4) {
              matchCount += 0.85;
              break;
            }
          }
        }
      });

      const totalTokens = Math.max(impTokens.size, artTokens.size);
      if (totalTokens > 0) {
        score = Math.max(score, matchCount / totalTokens);
      }

      const dist = levenshteinDistance(normImp, normArt);
      const maxLen = Math.max(normImp.length, normArt.length);
      if (maxLen > 0) {
        const levScore = 1 - (dist / maxLen);
        if (levScore > score) score = levScore;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestArticle = article;
    }
  }

  if (bestScore >= 0.55) {
    return { article: bestArticle, score: bestScore };
  }
  return null;
}

/* ========================================================
   13.C CONVERSION AUTOMATIQUE DES CONDITIONNEMENTS (SODAS 24, EAUX/OULMÈS 12, ORANGINA 8, PACKS)
======================================================== */
function convertBeveragePackaging(rawName, qty, rawUnit) {
  if (!rawName || isNaN(qty)) return { qty: qty || 0, unit: rawUnit || 'piece', multiplier: 1 };
  
  const name = String(rawName).toLowerCase().trim();
  const unit = (rawUnit || '').toLowerCase().trim();

  // Détecter si l'unité est un conditionnement groupé
  const isPack = ['paquet', 'boite', 'boîte', 'carton', 'pack', 'colis', 'pq', 'bt'].includes(unit);

  // 1. Détection de multiplicateur explicite dans le libellé (ex: '88PC', '18 PC', '16 PC', '100PC', '12 PC', '8 PC')
  const explicitMatch = name.match(/(\d+)\s*(pc|pcs|u|canette|canettes|bouteille|bouteilles)/i);
  if (explicitMatch) {
    const multiplier = parseInt(explicitMatch[1], 10);
    if (multiplier > 1 && (isPack || unit === 'boite' || unit === 'paquet' || unit === 'carton' || unit === 'pq')) {
      return { qty: qty * multiplier, unit: 'piece', multiplier, reason: 'explicit ' + multiplier + 'pc' };
    }
  }

  // 2. Orangina (Boîte de 8 canettes/bouteilles)
  if (name.includes('orangina') && (isPack || unit === 'paquet' || unit === 'boite')) {
    return { qty: qty * 8, unit: 'piece', multiplier: 8, reason: 'Orangina pack 8' };
  }

  // 3. Eaux Minérales & Oulmès (Boîte de 12 pour Sidi Ali 33cl, 50cl, 75cl, Oulmès 25cl, 75cl, Mojito, Tropical)
  if ((name.includes('sidi ali') || name.includes('oulmes') || name.includes('oulmès') || name.includes('mojito') || name.includes('tropical') || name.includes('eau min') || name.includes('eau gazeuse')) && (isPack || unit === 'paquet' || unit === 'boite')) {
    return { qty: qty * 12, unit: 'piece', multiplier: 12, reason: 'Eau/Oulmès pack 12' };
  }

  // 4. Sodas (Boîte de 24 canettes pour Coca, Coca Zéro, Sprite, Fanta, Hawai, Poms, Schweppes, Redbull)
  const isSoda = name.includes('coca') || name.includes('fanta') || name.includes('sprite') || name.includes('hawai') || name.includes('poms') || name.includes('schwep') || name.includes('redbull') || name.includes('soda');
  if (isSoda && (isPack || unit === 'paquet' || unit === 'boite')) {
    return { qty: qty * 24, unit: 'piece', multiplier: 24, reason: 'Soda pack 24' };
  }

  return { qty: qty, unit: unit || 'piece', multiplier: 1, reason: 'standard' };
}

// 13.3 SYNCHRONISATION MULTI-ARTICLES AVEC LES VENTES DU MOIS
function syncAuditWithMonthlySales() {
  const existingMap = new Map(auditMonthlyArticles.map(a => [cleanText(a.name), a]));
  const list = [];

  // 1. Extraire les ingrédients consommés calculés
  aggregatedIngredients.forEach(ing => {
    const key = cleanText(ing.name);
    const prev = existingMap.get(key) || {};
    list.push({
      name: ing.name,
      category: ing.category || categorizeIngredient(ing.name),
      unit: ing.unit || 'g',
      sInit: prev.sInit || 0,
      achats: prev.achats || 0,
      sFinal: prev.sFinal || 0,
      theorique: ing.totalQty || 0,
      casse: prev.casse || 0,
      prix: prev.prix || getDefaultPriceForCategory(ing.category || categorizeIngredient(ing.name))
    });
  });

  // 2. Ajouter les articles uniques déjà présents
  existingMap.forEach((val, key) => {
    if (!list.some(x => cleanText(x.name) === key)) {
      list.push(val);
    }
  });

  auditMonthlyArticles = list;
  recalculateMonthlyAudit();
}

function getDefaultPriceForCategory(cat) {
  if (cat === 'viandes') return 85;
  if (cat === 'poissons') return 110;
  if (cat === 'fromages') return 65;
  if (cat === 'boissons') return 15;
  if (cat === 'legumes') return 12;
  return 18;
}

function addNewAuditArticlePrompt() {
  const name = prompt('Nom de la nouvelle matière première :');
  if (!name || !name.trim()) return;

  const unit = prompt('Unité de mesure (g, ml, p) :', 'g') || 'g';
  const cat = categorizeIngredient(name);
  const prix = parseFloat(prompt('Prix unitaire moyen estimé (DH) :', '50')) || 50;

  auditMonthlyArticles.unshift({
    name: name.trim(),
    category: cat,
    unit: unit,
    sInit: 0,
    achats: 0,
    sFinal: 0,
    theorique: 0,
    casse: 0,
    prix: prix
  });

  recalculateMonthlyAudit();
}

function resetMonthlyAuditData() {
  if (confirm("Voulez-vous vraiment réinitialiser toutes les données de l'audit de stock ?")) {
    auditMonthlyArticles = [];
    document.querySelectorAll('.dropzone-card').forEach(c => c.classList.remove('loaded'));
    document.querySelectorAll('.dropzone-status').forEach(s => s.style.display = 'none');
    syncAuditWithMonthlySales();
  }
}


function isHighImpactIngredient(item) {
  if (!item) return false;
  const cat = item.category || categorizeIngredient(item.name);
  
  // 1. Viandes, Poissons, Fromages (Pivots Coût Matière)
  if (cat === 'viandes' || cat === 'poissons' || cat === 'fromages') return true;
  
  // 2. Café & Boissons Majeures
  const n = cleanText(item.name);
  if (n.includes('cafe') || n.includes('café') || n.includes('espresso') || n.includes('cacao') || n.includes('the sbaa') || n.includes('lipton')) return true;
  
  // 3. Ingrédients nobles / coûteux
  if (n.includes('avocat') || n.includes('nutella') || n.includes('creme') || n.includes('beurre') || n.includes('pistache') || n.includes('amande') || n.includes('noix') || n.includes('huile olive') || n.includes('khlii') || n.includes('amlou') || n.includes('saumon')) return true;
  
  if (item.prix >= 40) return true;
  return false;
}

function setAuditCatFilter(cat, btn) {
  currentAuditCatFilter = cat;
  document.querySelectorAll('[data-audit-cat]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMonthlyAuditTable();
}

function setAuditStatusFilter(status, btn) {
  currentAuditStatusFilter = status;
  document.querySelectorAll('[data-audit-status]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMonthlyAuditTable();
}

function onAuditFieldChange(idx, field, value) {
  if (!auditMonthlyArticles[idx]) return;
  auditMonthlyArticles[idx][field] = parseFloat(value) || 0;
  recalculateMonthlyAudit();
}

function removeAuditArticle(idx) {
  if (confirm("Supprimer cet article de l'audit ?")) {
    auditMonthlyArticles.splice(idx, 1);
    recalculateMonthlyAudit();
  }
}

function recalculateMonthlyAudit() {
  let totTheoDH = 0;
  let totReelDH = 0;
  let totEcartDH = 0;
  let totCasseDH = 0;
  let alertCount = 0;

  auditMonthlyArticles.forEach(item => {
    const consReelle = (item.sInit + item.achats) - item.sFinal;
    const consAttendue = item.theorique + item.casse;
    const ecart = consReelle - consAttendue;
    const ecartPct = consAttendue > 0 ? (ecart / consAttendue) * 100 : (ecart !== 0 ? Infinity : 0);
    const unitMult = (item.unit === 'g' || item.unit === 'ml') ? 0.001 : 1;
    const impactDH = ecart * unitMult * item.prix;

    item.consReelle = consReelle;
    item.consAttendue = consAttendue;
    item.ecart = ecart;
    item.ecartPct = ecartPct;
    item.impactDH = impactDH;

    totTheoDH += item.theorique * unitMult * item.prix;
    totReelDH += consReelle * unitMult * item.prix;
    totEcartDH += impactDH;
    totCasseDH += item.casse * unitMult * item.prix;

    if (ecartPct > 8) alertCount++;
  });

  const totEcartPct = totTheoDH > 0 ? (totEcartDH / totTheoDH) * 100 : 0;

  document.getElementById('audit-kpi-tot-theo').textContent = totTheoDH.toFixed(2) + ' DH';
  document.getElementById('audit-kpi-tot-reel').textContent = totReelDH.toFixed(2) + ' DH';
  
  const sign = totEcartDH > 0 ? '+' : '';
  const ecartEl = document.getElementById('audit-kpi-tot-ecart');
  ecartEl.textContent = sign + totEcartDH.toFixed(2) + ' DH';
  ecartEl.className = 'audit-kpi-val ' + (totEcartDH > 0 ? 'danger' : 'ok');
  document.getElementById('audit-kpi-tot-ecart-pct').textContent = sign + totEcartPct.toFixed(1) + '% vs Théorique';
  
  document.getElementById('audit-kpi-tot-casse').textContent = totCasseDH.toFixed(2) + ' DH';
  document.getElementById('audit-kpi-tot-items').textContent = auditMonthlyArticles.length;
  document.getElementById('audit-kpi-tot-alerts').textContent = alertCount + ' alerte(s) critique(s)';
  const countAuditEl = document.getElementById('count-audit');
  if (countAuditEl) countAuditEl.textContent = auditMonthlyArticles.length;

  window.auditMonthlyArticles = auditMonthlyArticles;
  renderMonthlyAuditTable();
}

function renderMonthlyAuditTable() {
  const tbody = document.getElementById('tbody-audit-multi');
  if (!tbody) return;

  const q = cleanText(document.getElementById('search-audit-multi') ? document.getElementById('search-audit-multi').value : '');

  // Mettre à jour les compteurs de catégorie
  let countAll = 0, countStrategic = 0, countViandes = 0, countPoissons = 0, countFromages = 0, countBoissons = 0, countLegumes = 0, countEpicerie = 0;
  auditMonthlyArticles.forEach(item => {
    countAll++;
    if (isHighImpactIngredient(item)) countStrategic++;
    const c = item.category || categorizeIngredient(item.name);
    if (c === 'viandes') countViandes++;
    else if (c === 'poissons') countPoissons++;
    else if (c === 'fromages') countFromages++;
    else if (c === 'boissons') countBoissons++;
    else if (c === 'legumes') countLegumes++;
    else countEpicerie++;
  });

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('audit-count-all', countAll);
  setEl('audit-count-strategic', countStrategic);
  setEl('audit-count-viandes', countViandes);
  setEl('audit-count-poissons', countPoissons);
  setEl('audit-count-fromages', countFromages);
  setEl('audit-count-boissons', countBoissons);
  setEl('audit-count-legumes', countLegumes);
  setEl('audit-count-epicerie', countEpicerie);

  // Filtrage
  const filtered = auditMonthlyArticles.filter(item => {
    if (q && !cleanText(item.name).includes(q)) return false;
    if (currentAuditCatFilter === 'strategic' && !isHighImpactIngredient(item)) return false;
    else if (currentAuditCatFilter !== 'all' && currentAuditCatFilter !== 'strategic' && item.category !== currentAuditCatFilter) return false;
    
    if (currentAuditStatusFilter === 'danger' && item.ecartPct <= 8) return false;
    if (currentAuditStatusFilter === 'ok' && (Math.abs(item.ecartPct) > 3 || item.ecartPct > 8)) return false;
    if (currentAuditStatusFilter === 'under' && item.ecartPct >= -3) return false;
    return true;
  });

  // Calcul des KPIs sur la sélection active
  let fTotTheo = 0, fTotReel = 0, fTotEcart = 0, fTotCasse = 0, fAlertCount = 0;
  filtered.forEach(item => {
    fTotTheo += item.theorique * item.prix;
    fTotReel += (item.consReelle || 0) * item.prix;
    fTotEcart += (item.impactDH || 0);
    fTotCasse += (item.casse || 0) * item.prix;
    if ((item.ecartPct || 0) > 8) fAlertCount++;
  });

  const fSign = fTotEcart > 0 ? '+' : '';
  const fTotEcartPct = fTotTheo > 0 ? (fTotEcart / fTotTheo) * 100 : 0;

  setEl('audit-kpi-tot-theo', fTotTheo.toFixed(2) + ' DH');
  setEl('audit-kpi-tot-reel', fTotReel.toFixed(2) + ' DH');
  const ecartEl = document.getElementById('audit-kpi-tot-ecart');
  if (ecartEl) {
    ecartEl.textContent = fSign + fTotEcart.toFixed(2) + ' DH';
    ecartEl.className = 'audit-kpi-val ' + (fTotEcart > 0 ? 'danger' : 'ok');
  }
  setEl('audit-kpi-tot-ecart-pct', fSign + fTotEcartPct.toFixed(1) + '% vs Théorique');
  setEl('audit-kpi-tot-casse', fTotCasse.toFixed(2) + ' DH');
  setEl('audit-kpi-tot-items', filtered.length);
  setEl('audit-kpi-tot-alerts', fAlertCount + ' alerte(s) critique(s)');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="14" style="text-align:center; padding:30px; color:var(--muted);">Aucune matière première ne correspond aux filtres.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const idx = auditMonthlyArticles.indexOf(item);
    const sign = item.ecart > 0 ? '+' : '';
    let badgeHtml = '';
    if (Math.abs(item.ecartPct) <= 3) {
      badgeHtml = '<span class="status-badge ok">✅ CONFORME</span>';
    } else if (item.ecartPct > 3 && item.ecartPct <= 8) {
      badgeHtml = '<span class="status-badge warn">⚠️ SURDOSAGE</span>';
    } else if (item.ecartPct > 8) {
      badgeHtml = '<span class="status-badge danger">🚨 CRITIQUE</span>';
    } else {
      badgeHtml = '<span class="status-badge under">📉 SOUS-DOSAGE</span>';
    }

    const isStrategic = isHighImpactIngredient(item);
    const starIcon = isStrategic ? '<span title="Produit Stratégique à Fort Impact (80/20)" style="color:#d97706; margin-right:4px;">⭐</span>' : '';

    return `<tr>
      <td style="font-weight:800; min-width:180px;">
        ${starIcon}${item.name}
      </td>
      <td style="text-align:center;"><span class="cat-chip ${item.category}">${item.category.toUpperCase()}</span></td>
      <td style="text-align:center;"><span class="unit-chip">${item.unit}</span></td>
      <td><input type="number" step="0.01" value="${(item.sInit || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'sInit', this.value)" class="audit-input" /></td>
      <td><input type="number" step="0.01" value="${(item.achats || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'achats', this.value)" class="audit-input" /></td>
      <td><input type="number" step="0.01" value="${(item.sFinal || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'sFinal', this.value)" class="audit-input" /></td>
      <td style="font-weight:800; color:var(--text); text-align:right;">${(item.consReelle || 0).toFixed(2)}</td>
      <td style="font-weight:700; color:var(--muted); text-align:right;">${(item.theorique || 0).toFixed(2)}</td>
      <td><input type="number" step="0.01" value="${(item.casse || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'casse', this.value)" class="audit-input" /></td>
      <td style="font-weight:900; text-align:right; color:${item.ecart > 0 ? 'var(--danger)' : 'var(--success)'};">${sign}${(item.ecart || 0).toFixed(2)}</td>
      <td style="text-align:center;">${badgeHtml}</td>
      <td><input type="number" step="0.01" value="${(item.prix || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'prix', this.value)" class="audit-input price" /></td>
      <td style="font-weight:900; text-align:right; color:${item.impactDH > 0 ? 'var(--danger)' : 'var(--success)'};">${sign}${(item.impactDH || 0).toFixed(2)} DH</td>
      <td style="text-align:center;"><button class="btn-del-row" onclick="removeAuditArticle(${idx})" title="Supprimer">✕</button></td>
    </tr>`;
  }).join('');
}

function exportMonthlyAuditToExcel() {
  if (auditMonthlyArticles.length === 0) {
    alert("Aucune donnée d'audit à exporter.");
    return;
  }

  const exportData = auditMonthlyArticles.map(item => ({
    'Matière Première': item.name,
    'Catégorie': item.category,
    'Unité': item.unit,
    'Stock Initial M-1': item.sInit,
    'Achats Mois M': item.achats,
    'Stock Final M': item.sFinal,
    'Consommation Réelle': item.consReelle,
    'Théorie Ventes': item.theorique,
    'Casse Déclarée': item.casse,
    'Écart Matière (Qté)': item.ecart,
    'Écart Relatif (%)': item.ecartPct.toFixed(1) + '%',
    'Prix Unitaire (DH)': item.prix,
    'Écart Financier (DH)': item.impactDH,
    'Statut': item.ecartPct > 8 ? 'CRITIQUE' : (item.ecartPct > 3 ? 'SURDOSAGE' : (item.ecartPct < -3 ? 'SOUS-DOSÉ' : 'CONFORME'))
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.book_append_sheet(wb, ws, 'Audit_Stock_Fin_Mois');
  XLSX.writeFile(wb, `GreyCorner_Audit_Stock_${selectedYearMonth || 'Cloture'}.xlsx`);
}


// Expositions globales pour les gestionnaires onclick / onchange HTML
window.switchAuditSubTab = switchAuditSubTab;
window.initAuditFlashDropdown = initAuditFlashDropdown;
window.onFlashIngredientChange = onFlashIngredientChange;
window.calculateAuditFlash = calculateAuditFlash;
window.handleAuditFileUpload = handleAuditFileUpload;
window.extractDataFromPDF = extractDataFromPDF;
window.parseTextLinesToAudit = parseTextLinesToAudit;
window.parseExcelRowsToAuditData = parseExcelRowsToAuditData;
window.findBestIngredientMatch = findBestIngredientMatch;
window.convertBeveragePackaging = convertBeveragePackaging;
window.applyExtractedDataToAudit = applyExtractedDataToAudit;
window.syncAuditWithMonthlySales = syncAuditWithMonthlySales;
window.getDefaultPriceForCategory = getDefaultPriceForCategory;
window.addNewAuditArticlePrompt = addNewAuditArticlePrompt;
window.resetMonthlyAuditData = resetMonthlyAuditData;
window.setAuditCatFilter = setAuditCatFilter;
window.setAuditStatusFilter = setAuditStatusFilter;
window.onAuditFieldChange = onAuditFieldChange;
window.removeAuditArticle = removeAuditArticle;
window.recalculateMonthlyAudit = recalculateMonthlyAudit;
window.renderMonthlyAuditTable = renderMonthlyAuditTable;
window.exportMonthlyAuditToExcel = exportMonthlyAuditToExcel;


