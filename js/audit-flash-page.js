/* ========================================================
   GREY CORNER — AUDIT FLASH MANUEL & CONTRÔLE PRÉCIS DES STOCKS
   Page Spéciale Dédiée (audit.html)
======================================================== */

let auditFlashHistory = [];
let allIngredientsCatalog = [];

const INGREDIENT_CATEGORIES_LOCAL = {
  viandes: ['poulet', 'boeuf', 'bœuf', 'steak', 'kefta', 'viande', 'dinde', 'canard', 'veau', 'viande hachee', 'viande hachée', 'merguez', 'saucisse', 'charcuterie', 'bacon', 'jambon', 'khlii', 'nuggets', 'cordon bleu', 'salami', 'pepperoni', 'viande'],
  poissons: ['saumon', 'crevette', 'crevettes', 'calamar', 'calamars', 'poisson', 'fruits de mer', 'gambas', 'thon', 'moules', 'palourde', 'dorade', 'loup', 'anchois', 'surimi'],
  fromages: ['fromage', 'mozzarella', 'cheddar', 'parmesan', 'gouda', 'edam', 'burrata', 'feta', 'bleu', 'gorgonzola', 'brie', 'camembert', 'ricotta', 'mascarpone', 'cream cheese', 'jeban', 'vache qui rit', 'kiri', 'lait', 'creme', 'crème', 'beurre', 'yaourt', 'leben', 'lait concentre', 'creme liquide'],
  boissons: ['eau', 'oulmes', 'oulmès', 'coca', 'sprite', 'hawai', 'poms', 'schweppes', 'orangina', 'red bull', 'nespresso', 'pastille', 'cafe', 'café', 'the', 'thé', 'verveine', 'infusion', 'chocolat', 'sirop', 'glacon', 'glaçon', 'glace', 'boba', 'boisson', 'jus', 'smoothie', 'sidi ali'],
  legumes: ['tomate', 'oignon', 'champignon', 'pomme de terre', 'frite', 'frites', 'puree', 'potatos', 'avocat', 'salade', 'mesclun', 'laitue', 'roquette', 'epinard', 'épinard', 'poivron', 'radis', 'carotte', 'concombre', 'betterave', 'olive', 'olives', 'orange', 'citron', 'fraise', 'framboise', 'mangue', 'banane', 'pomme', 'ananas', 'peche', 'pêche', 'kiwi', 'fruits', 'fruit', 'menthe', 'agrumes', 'acai', 'haricot', 'courgette', 'brocoli', 'persil', 'coriandre', 'ail']
};

function cleanTextLocal(str) {
  if (!str) return '';
  return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

function categorizeIngredientLocal(name) {
  const n = cleanTextLocal(name);
  for (const [category, keywords] of Object.entries(INGREDIENT_CATEGORIES_LOCAL)) {
    if (keywords.some(kw => n.includes(kw))) return category;
  }
  return 'epicerie';
}

function toggleAppTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

function loadIngredientsCatalog() {
  const setMap = new Map();
  const cats = window.CATEGORIES_DATA || window.DATA || [];

  if (Array.isArray(cats)) {
    cats.forEach(cat => {
      if (Array.isArray(cat.items)) {
        cat.items.forEach(recipe => {
          const techList = recipe.tech || recipe.ingredients || [];
          techList.forEach(line => {
            if (!line || typeof line !== 'string') return;
            const parts = line.split(':');
            const ingName = parts[0].trim();
            const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';
            if (ingName && ingName.length >= 2) {
              const key = cleanTextLocal(ingName);
              if (!setMap.has(key)) {
                let unit = 'g';
                if (qtyStr.includes('ml') || qtyStr.includes('cl') || qtyStr.includes('l') || qtyStr.includes('L')) unit = 'ml';
                else if (qtyStr.includes('p') || qtyStr.includes('pcs') || qtyStr.includes('tr') || qtyStr.includes('canette') || qtyStr.includes('btl')) unit = 'p';

                setMap.set(key, {
                  name: ingName,
                  unit: unit,
                  category: categorizeIngredientLocal(ingName),
                  theorique: 0
                });
              }
            }
          });
        });
      }
    });
  }

  // Ajouter les ingrédients depuis INGREDIENT_UNIT_COSTS
  const costMap = window.INGREDIENT_UNIT_COSTS || {};
  Object.keys(costMap).forEach(k => {
    const key = cleanTextLocal(k);
    const def = costMap[k];
    if (!setMap.has(key)) {
      setMap.set(key, {
        name: k.charAt(0).toUpperCase() + k.slice(1),
        unit: def.unit || 'g',
        category: categorizeIngredientLocal(k),
        theorique: 0
      });
    }
  });

  allIngredientsCatalog = Array.from(setMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

function populateIngredientSelect() {
  const select = document.getElementById('flash-ing-select');
  if (!select) return;

  select.innerHTML = '<option value="">-- Choisir une matière première --</option>';

  const catGroups = {
    'viandes': '🥩 Viandes & Volailles',
    'poissons': '🐟 Poissons & Fruits de Mer',
    'fromages': '🧀 Fromages & Produits Laitiers',
    'boissons': '☕ Café & Boissons',
    'legumes': '🥗 Légumes & Fruits',
    'epicerie': '🥖 Épicerie & Pains'
  };

  const grouped = {};
  Object.keys(catGroups).forEach(k => grouped[k] = []);

  allIngredientsCatalog.forEach(ing => {
    const cat = ing.category || 'epicerie';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(ing);
  });

  Object.entries(catGroups).forEach(([catKey, catLabel]) => {
    const list = grouped[catKey] || [];
    if (list.length > 0) {
      const optGroup = document.createElement('optgroup');
      optGroup.label = `${catLabel} (${list.length})`;
      list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.name;
        opt.textContent = `${item.name} (${item.unit})`;
        optGroup.appendChild(opt);
      });
      select.appendChild(optGroup);
    }
  });
}

function onAuditIngredientChange(name) {
  if (!name) {
    resetFlashInputs();
    return;
  }

  const ing = allIngredientsCatalog.find(x => cleanTextLocal(x.name) === cleanTextLocal(name));
  const unit = ing ? ing.unit : 'g';
  const displayUnit = unit === 'g' ? 'kg' : (unit === 'ml' ? 'L' : 'p');

  document.querySelectorAll('.flash-unit-lbl').forEach(el => el.textContent = unit);

  // Prix unitaire par défaut
  let defaultPrice = 50;
  const costMap = window.INGREDIENT_UNIT_COSTS || {};
  const norm = cleanTextLocal(name);
  if (costMap[norm]) {
    const def = costMap[norm];
    if (def.unit === 'g' || def.unit === 'ml') defaultPrice = def.cost * 1000;
    else defaultPrice = def.cost;
  } else {
    for (const [k, v] of Object.entries(costMap)) {
      if (norm.includes(k) || k.includes(norm)) {
        if (v.unit === 'g' || v.unit === 'ml') defaultPrice = v.cost * 1000;
        else defaultPrice = v.cost;
        break;
      }
    }
  }

  const priceInput = document.getElementById('flash-prix');
  if (priceInput) priceInput.value = defaultPrice.toFixed(2);

  // Calcul automatique de la théorie de vente
  syncTheoriqueFromSales();
  calculateLiveAuditFlash();
}

function syncTheoriqueFromSales() {
  const select = document.getElementById('flash-ing-select');
  const name = select ? select.value : '';
  if (!name) return;

  let theoQty = 0;
  const rawSales = localStorage.getItem('monthlySalesData') || localStorage.getItem('salesData');
  const cats = window.CATEGORIES_DATA || window.DATA || [];

  if (rawSales && Array.isArray(cats)) {
    try {
      const sales = JSON.parse(rawSales);
      const searchNorm = cleanTextLocal(name);

      cats.forEach(cat => {
        if (Array.isArray(cat.items)) {
          cat.items.forEach(recipe => {
            const soldCount = parseFloat(sales[recipe.name] || sales[recipe.id] || 0);
            if (soldCount > 0) {
              const techList = recipe.tech || recipe.ingredients || [];
              techList.forEach(line => {
                const parts = line.split(':');
                const ingName = parts[0].trim();
                if (cleanTextLocal(ingName) === searchNorm) {
                  const qtyStr = parts.slice(1).join(':').trim();
                  let q = parseFloat(qtyStr.replace(',', '.')) || 1;
                  if (qtyStr.includes('kg') || qtyStr.includes('l') || qtyStr.includes('L')) q *= 1000;
                  else if (qtyStr.includes('cl')) q *= 10;
                  theoQty += q * soldCount;
                }
              });
            }
          });
        }
      });
    } catch (e) {
      console.warn('Erreur lecture ventes locales:', e);
    }
  }

  const theoInput = document.getElementById('flash-theorique');
  if (theoInput) theoInput.value = theoQty.toFixed(2);
  calculateLiveAuditFlash();
}

function calculateLiveAuditFlash() {
  const select = document.getElementById('flash-ing-select');
  const name = select ? select.value : '';
  const unit = document.querySelector('.flash-unit-lbl') ? document.querySelector('.flash-unit-lbl').textContent : 'g';

  const sInit = parseFloat(document.getElementById('flash-sinit').value) || 0;
  const achats = parseFloat(document.getElementById('flash-achats').value) || 0;
  const sFinal = parseFloat(document.getElementById('flash-sfinal').value) || 0;
  const theo = parseFloat(document.getElementById('flash-theorique').value) || 0;
  const casse = parseFloat(document.getElementById('flash-casse').value) || 0;
  const prix = parseFloat(document.getElementById('flash-prix').value) || 0;

  const consReelle = (sInit + achats) - sFinal;
  const consAttendue = theo + casse;
  const ecart = consReelle - consAttendue;
  const ecartPct = consAttendue > 0 ? (ecart / consAttendue) * 100 : (ecart !== 0 ? 100 : 0);

  let multiplier = 1;
  if (unit === 'g' || unit === 'ml') multiplier = 0.001;
  const impactDH = ecart * prix * multiplier;

  const sign = ecart > 0 ? '+' : '';

  if (name) {
    document.getElementById('flash-res-title').textContent = `📊 Diagnostic : ${name}`;
  }
  document.getElementById('flash-kpi-reel').textContent = `${consReelle.toFixed(2)} ${unit}`;
  document.getElementById('flash-kpi-attendu').textContent = `${consAttendue.toFixed(2)} ${unit}`;

  const ecartEl = document.getElementById('flash-kpi-ecart');
  ecartEl.textContent = `${sign}${ecart.toFixed(2)} ${unit}`;
  ecartEl.className = 'audit-kpi-val ' + (ecart > 0 ? 'danger' : 'ok');

  document.getElementById('flash-kpi-ecart-pct').textContent = `${sign}${ecartPct.toFixed(1)}% vs Attendu`;

  const impactEl = document.getElementById('flash-kpi-impact');
  impactEl.textContent = `${sign}${impactDH.toFixed(2)} DH`;
  impactEl.className = 'audit-kpi-val ' + (impactDH > 0 ? 'danger' : 'ok');

  const badge = document.getElementById('flash-status-badge');
  const diagBox = document.getElementById('flash-diagnostic-box');

  if (!name) {
    diagBox.innerHTML = "Sélectionnez une matière première pour afficher le diagnostic d'audit en direct.";
    badge.className = 'status-badge ok';
    badge.textContent = 'EN ATTENTE';
    return null;
  }

  if (Math.abs(ecartPct) <= 3 || (consAttendue === 0 && consReelle === 0)) {
    badge.className = 'status-badge ok';
    badge.textContent = '✅ CONFORME';
    diagBox.innerHTML = `<strong>✅ Gestion Optimale (Écart de ${ecartPct.toFixed(1)}%) :</strong> La consommation réelle de <strong>${name}</strong> correspond parfaitement aux ventes théoriques. Aucun coulage ni surdosage détecté.`;
  } else if (ecartPct > 3 && ecartPct <= 8) {
    badge.className = 'status-badge warn';
    badge.textContent = '⚠️ SURDOSAGE MODÉRÉ';
    diagBox.innerHTML = `<strong>⚠️ Surconsommation Modérée (+${ecartPct.toFixed(1)}%) :</strong> Dérive financière estimée à <strong>${impactDH.toFixed(2)} DH</strong>. Vérifier le respect des fiches techniques et le grammage des portions en cuisine.`;
  } else if (ecartPct > 8) {
    badge.className = 'status-badge danger';
    badge.textContent = '🚨 SURCONSOMMATION CRITIQUE';
    diagBox.innerHTML = `<strong>🚨 Surconsommation Critique (+${ecartPct.toFixed(1)}%) :</strong> Perte financière de <strong>${impactDH.toFixed(2)} DH</strong>. Causes immédiates : surdosage systématique des portions, casse non déclarée, coulage ou perte au déstockage. Contrôle physique recommandé.`;
  } else {
    badge.className = 'status-badge under';
    badge.textContent = '📉 SOUS-DOSAGE';
    diagBox.innerHTML = `<strong>📉 Consommation Inférieure aux Recettes (${ecartPct.toFixed(1)}%) :</strong> Moins de matière consommée que prévu dans les ventes. Vérifier si les portions servies aux clients ne sont pas sous-dosées ou si la recette surestime le grammage réel.`;
  }

  return { name, unit, sInit, achats, sFinal, consReelle, theo, casse, consAttendue, ecart, ecartPct, prix, impactDH };
}

function saveCurrentAuditToHistory() {
  const current = calculateLiveAuditFlash();
  if (!current || !current.name || current.name === '-- Choisir une matière première --') {
    alert("Veuillez d'abord sélectionner une matière première dans la liste.");
    return;
  }

  const existingIdx = auditFlashHistory.findIndex(x => cleanTextLocal(x.name) === cleanTextLocal(current.name));
  if (existingIdx >= 0) {
    auditFlashHistory[existingIdx] = current;
  } else {
    auditFlashHistory.unshift(current);
  }

  saveAuditHistoryToStorage();
  renderAuditHistoryTable();
  alert(`✅ L'audit de "${current.name}" a été enregistré avec succès dans le tableau !`);
}

function removeAuditFromHistory(idx) {
  if (confirm("Supprimer cet ingrédient du rapport d'audit ?")) {
    auditFlashHistory.splice(idx, 1);
    saveAuditHistoryToStorage();
    renderAuditHistoryTable();
  }
}

function clearAuditHistory() {
  if (confirm("Voulez-vous réinitialiser tous les audits enregistrés dans le tableau ?")) {
    auditFlashHistory = [];
    saveAuditHistoryToStorage();
    renderAuditHistoryTable();
  }
}

function resetFlashInputs() {
  const s = document.getElementById('flash-ing-select');
  if (s) s.value = '';
  document.getElementById('flash-sinit').value = '0';
  document.getElementById('flash-achats').value = '0';
  document.getElementById('flash-sfinal').value = '0';
  document.getElementById('flash-theorique').value = '0';
  document.getElementById('flash-casse').value = '0';
  calculateLiveAuditFlash();
}

function saveAuditHistoryToStorage() {
  localStorage.setItem('greyAuditFlashHistory', JSON.stringify(auditFlashHistory));
}

function loadAuditHistoryFromStorage() {
  const raw = localStorage.getItem('greyAuditFlashHistory');
  if (raw) {
    try {
      auditFlashHistory = JSON.parse(raw);
    } catch (e) {
      auditFlashHistory = [];
    }
  }
  renderAuditHistoryTable();
}

function renderAuditHistoryTable() {
  const tbody = document.getElementById('audit-history-tbody');
  const countEl = document.getElementById('audit-history-count');
  const totalDhEl = document.getElementById('audit-history-total-dh');
  if (!tbody) return;

  if (countEl) countEl.textContent = auditFlashHistory.length;

  let totalEcartDH = 0;

  if (auditFlashHistory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="14" style="text-align:center; padding:30px; color:var(--text-muted);">
      Aucun audit enregistré pour le moment. Remplissez le formulaire ci-dessus et cliquez sur <strong>"Enregistrer cet Ingrédient dans le Tableau"</strong>.
    </td></tr>`;
    if (totalDhEl) totalDhEl.textContent = 'Écart Total : 0.00 DH';
    return;
  }

  tbody.innerHTML = auditFlashHistory.map((item, idx) => {
    totalEcartDH += item.impactDH || 0;
    const sign = item.ecart > 0 ? '+' : '';
    const cat = categorizeIngredientLocal(item.name);

    let badgeHtml = '';
    if (Math.abs(item.ecartPct) <= 3) badgeHtml = '<span class="status-badge ok">✅ CONFORME</span>';
    else if (item.ecartPct > 3 && item.ecartPct <= 8) badgeHtml = '<span class="status-badge warn">⚠️ SURDOSAGE</span>';
    else if (item.ecartPct > 8) badgeHtml = '<span class="status-badge danger">🚨 CRITIQUE</span>';
    else badgeHtml = '<span class="status-badge under">📉 SOUS-DOSAGE</span>';

    return `<tr>
      <td style="font-weight:800; min-width:180px;">${item.name}</td>
      <td style="text-align:center;"><span class="cat-chip ${cat}">${cat.toUpperCase()}</span></td>
      <td style="text-align:center;"><span class="unit-chip">${item.unit}</span></td>
      <td style="text-align:right;">${item.sInit.toFixed(2)}</td>
      <td style="text-align:right;">${item.achats.toFixed(2)}</td>
      <td style="text-align:right;">${item.sFinal.toFixed(2)}</td>
      <td style="text-align:right; font-weight:800;">${item.consReelle.toFixed(2)}</td>
      <td style="text-align:right; color:var(--muted);">${item.theo.toFixed(2)}</td>
      <td style="text-align:right;">${item.casse.toFixed(2)}</td>
      <td style="text-align:right; font-weight:900; color:${item.ecart > 0 ? 'var(--danger)' : 'var(--success)'};">${sign}${item.ecart.toFixed(2)}</td>
      <td style="text-align:center;">${badgeHtml}</td>
      <td style="text-align:right;">${item.prix.toFixed(2)}</td>
      <td style="text-align:right; font-weight:900; color:${item.impactDH > 0 ? 'var(--danger)' : 'var(--success)'};">${sign}${item.impactDH.toFixed(2)} DH</td>
      <td style="text-align:center;">
        <button class="btn-del-row" onclick="removeAuditFromHistory(${idx})" title="Supprimer">✕</button>
      </td>
    </tr>`;
  }).join('');

  if (totalDhEl) {
    const s = totalEcartDH > 0 ? '+' : '';
    totalDhEl.textContent = `Écart Total : ${s}${totalEcartDH.toFixed(2)} DH`;
    totalDhEl.style.color = totalEcartDH > 0 ? 'var(--danger)' : 'var(--success)';
  }
}

function exportAuditHistoryToExcel() {
  if (auditFlashHistory.length === 0) {
    alert('Aucun audit enregistré à exporter.');
    return;
  }

  const exportData = auditFlashHistory.map(item => ({
    'Matière Première': item.name,
    'Catégorie': categorizeIngredientLocal(item.name).toUpperCase(),
    'Unité': item.unit,
    'Stock Initial M-1': item.sInit,
    'Achats & Livraisons M': item.achats,
    'Stock Final Réel M': item.sFinal,
    'Consommation Réelle': item.consReelle,
    'Théorie Ventes': item.theo,
    'Casse Déclarée': item.casse,
    'Écart Quantité': item.ecart,
    'Écart %': item.ecartPct.toFixed(1) + '%',
    'Prix Unitaire (DH)': item.prix,
    'Impact Financier (DH)': item.impactDH
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Audit Flash Stock');
  XLSX.writeFile(wb, `GreyCorner_Audit_Flash_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  loadIngredientsCatalog();
  populateIngredientSelect();
  loadAuditHistoryFromStorage();
});

// Exports globaux pour window
window.toggleAppTheme = toggleAppTheme;
window.onAuditIngredientChange = onAuditIngredientChange;
window.syncTheoriqueFromSales = syncTheoriqueFromSales;
window.calculateLiveAuditFlash = calculateLiveAuditFlash;
window.saveCurrentAuditToHistory = saveCurrentAuditToHistory;
window.removeAuditFromHistory = removeAuditFromHistory;
window.clearAuditHistory = clearAuditHistory;
window.resetFlashInputs = resetFlashInputs;
window.exportAuditHistoryToExcel = exportAuditHistoryToExcel;
window.auditFlashHistory = auditFlashHistory;
window.allIngredientsCatalog = allIngredientsCatalog;
window.loadIngredientsCatalog = loadIngredientsCatalog;
window.populateIngredientSelect = populateIngredientSelect;
