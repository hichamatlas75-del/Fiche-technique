/* ========================================================
   GREY CORNER — AUDIT FLASH MANUEL & CONTRÔLE PRÉCIS DES STOCKS
   Page Spéciale Dédiée (audit.html)
======================================================== */

let auditFlashHistory = [];
let allIngredientsCatalog = [];

function toggleAppTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  loadIngredientsCatalog();
  populateIngredientSelect();
  loadAuditHistoryFromStorage();
});

function loadIngredientsCatalog() {
  const setMap = new Map();

  if (typeof RECIPES_DATA !== 'undefined' && Array.isArray(RECIPES_DATA)) {
    RECIPES_DATA.forEach(recipe => {
      if (Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(line => {
          const parsed = parseIngredientLine(line);
          if (parsed && parsed.name && parsed.name.length >= 2) {
            const key = cleanText(parsed.name);
            if (!setMap.has(key)) {
              setMap.set(key, {
                name: parsed.name,
                unit: parsed.unit || 'g',
                category: categorizeIngredient(parsed.name),
                theorique: 0
              });
            }
          }
        });
      }
    });
  }

  // Ajouter les prix unitaires depuis INGREDIENT_PRICES_DH
  if (typeof INGREDIENT_PRICES_DH !== 'undefined') {
    Object.keys(INGREDIENT_PRICES_DH).forEach(k => {
      const key = cleanText(k);
      if (setMap.has(key)) {
        setMap.get(key).prix = INGREDIENT_PRICES_DH[k];
      }
    });
  }

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
      optGroup.label = catLabel;
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

  const ing = allIngredientsCatalog.find(x => cleanText(x.name) === cleanText(name));
  const unit = ing ? ing.unit : 'g';
  const displayUnit = unit === 'g' ? 'kg' : (unit === 'ml' ? 'L' : 'p');

  document.querySelectorAll('.flash-unit-lbl').forEach(el => el.textContent = unit);

  // Prix unitaire par défaut
  let defaultPrice = 50;
  if (typeof INGREDIENT_PRICES_DH !== 'undefined') {
    const k = Object.keys(INGREDIENT_PRICES_DH).find(x => cleanText(x) === cleanText(name));
    if (k) defaultPrice = INGREDIENT_PRICES_DH[k];
  }
  document.getElementById('flash-prix').value = defaultPrice;

  // Calcul automatique de la théorie de vente si des ventes mensuelles sont stockées
  syncTheoriqueFromSales();
  calculateLiveAuditFlash();
}

function syncTheoriqueFromSales() {
  const select = document.getElementById('flash-ing-select');
  const name = select ? select.value : '';
  if (!name) return;

  let theoQty = 0;
  const rawSales = localStorage.getItem('monthlySalesData') || localStorage.getItem('salesData');
  
  if (rawSales && typeof RECIPES_DATA !== 'undefined') {
    try {
      const sales = JSON.parse(rawSales);
      const searchNorm = cleanText(name);

      RECIPES_DATA.forEach(recipe => {
        const soldCount = parseFloat(sales[recipe.name] || sales[recipe.id] || 0);
        if (soldCount > 0 && Array.isArray(recipe.ingredients)) {
          recipe.ingredients.forEach(line => {
            const parsed = parseIngredientLine(line);
            if (parsed && cleanText(parsed.name) === searchNorm) {
              theoQty += parsed.qty * soldCount;
            }
          });
        }
      });
    } catch (e) {
      console.warn('Erreur lecture ventes locales:', e);
    }
  }

  document.getElementById('flash-theorique').value = theoQty.toFixed(2);
  calculateLiveAuditFlash();
}

function calculateLiveAuditFlash() {
  const name = document.getElementById('flash-ing-select').value || 'Matière Première';
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
  
  // Si unité est g ou ml, le prix est par kg ou L
  let multiplier = 1;
  if (unit === 'g' || unit === 'ml') multiplier = 0.001;
  const impactDH = ecart * prix * multiplier;

  const sign = ecart > 0 ? '+' : '';

  document.getElementById('flash-res-title').textContent = `📊 Diagnostic : ${name}`;
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

  if (Math.abs(ecartPct) <= 3 || (consAttendue === 0 && consReelle === 0)) {
    badge.className = 'status-badge ok';
    badge.textContent = '✅ CONFORME';
    diagBox.innerHTML = `<strong>✅ Gestion Optimale (Écart de ${ecartPct.toFixed(1)}%) :</strong> La consommation réelle de <strong>${name}</strong> correspond parfaitement aux ventes des fiches techniques. Aucun coulage ni surdosage détecté.`;
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
  if (!current || !current.name || current.name === '-- Choisir une matière première --' || current.name === 'Matière Première') {
    alert('Veuillez d\'abord sélectionner une matière première.');
    return;
  }

  const existingIdx = auditFlashHistory.findIndex(x => cleanText(x.name) === cleanText(current.name));
  if (existingIdx >= 0) {
    auditFlashHistory[existingIdx] = current;
  } else {
    auditFlashHistory.unshift(current);
  }

  saveAuditHistoryToStorage();
  renderAuditHistoryTable();
  alert(`✅ L'audit de "${current.name}" a été enregistré avec succès !`);
}

function removeAuditFromHistory(idx) {
  if (confirm('Supprimer cet ingrédient du rapport d\'audit ?')) {
    auditFlashHistory.splice(idx, 1);
    saveAuditHistoryToStorage();
    renderAuditHistoryTable();
  }
}

function clearAuditHistory() {
  if (confirm('Voulez-vous réinitialiser tous les audits enregistrés dans le tableau ?')) {
    auditFlashHistory = [];
    saveAuditHistoryToStorage();
    renderAuditHistoryTable();
  }
}

function resetFlashInputs() {
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
      Aucun audit enregistré pour le moment. Remplissez le formulaire ci-dessus et cliquez sur <strong>"Enregistrer cet Ingrédient"</strong>.
    </td></tr>`;
    if (totalDhEl) totalDhEl.textContent = 'Écart Total : 0.00 DH';
    return;
  }

  tbody.innerHTML = auditFlashHistory.map((item, idx) => {
    totalEcartDH += item.impactDH || 0;
    const sign = item.ecart > 0 ? '+' : '';
    const cat = categorizeIngredient(item.name);

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
    'Catégorie': categorizeIngredient(item.name).toUpperCase(),
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

