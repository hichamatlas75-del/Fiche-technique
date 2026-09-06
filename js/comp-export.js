/**
 * GREY CORNER — Exports Excel, Mercuriale & Synchronisation GitHub
 * Module: comp-export.js
 */

  // Exporter le tableau comparatif en Excel (.xlsx)
  window.exportComparisonToExcel = function() {
    if (typeof XLSX === 'undefined') {
      alert("La librairie Excel est en cours de chargement. Veuillez réessayer.");
      return;
    }

    const rows = [
      ["GREY CORNER — COMPARATIF FICHES TECHNIQUES vs STANDARDS INTERNATIONAUX"],
      ["Date d'export : " + new Date().toLocaleDateString('fr-FR')],
      [],
      [
        "Catégorie",
        "Nom du Plat",
        "Prix Vente (DH)",
        "Fiche Grey Corner (Ingrédients)",
        "Coût Grey Corner (DH)",
        "Food Cost Grey Corner (%)",
        "Marge Brute (DH)",
        "Standard International (Ingrédients)",
        "Coût Standard (DH)",
        "Food Cost Standard (%)",
        "Écart vs Standard (DH)",
        "Justification Métier / Rationale"
      ]
    ];

    allRecipes.forEach(r => {
      rows.push([
        r.category,
        r.name,
        r.sellPrice,
        r.greyCorner.tech.join(' | '),
        r.greyCorner.cost,
        r.greyCorner.foodCost,
        r.greyCorner.grossMarginDH,
        r.standard.tech.join(' | '),
        r.standard.cost,
        r.standard.foodCost,
        r.standard.diffDH,
        r.standard.rationale
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Comparatif Fiches Techniques");
    XLSX.writeFile(wb, `GreyCorner_Comparatif_Fiches_Standards_${new Date().toISOString().slice(0,10)}.xlsx`);
    window.GC_Toast.show("📥 Export Excel généré avec succès !", 'success');
  };

  // ========================================================
  // GESTION MERCURIALE & PRIX D'ACHAT DES MATIÈRES PREMIÈRES
  // ========================================================

  function openPricesModal() {
    loadCustomIngredientPrices();
    const modal = document.getElementById('prices-modal');
    if (modal) modal.classList.add('visible');
    renderPricesTable();
  }

  function closePricesModal() {
    const modal = document.getElementById('prices-modal');
    if (modal) modal.classList.remove('visible');
  }

  function renderPricesTable() {
    const container = document.getElementById('prices-table-body');
    if (!container) return;

    const searchInput = document.getElementById('search-prices-input');
    const search = (searchInput ? searchInput.value : '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const costMap = window.INGREDIENT_UNIT_COSTS || {};

    const entries = Object.entries(costMap);
    const filtered = entries.filter(([k, v]) => {
      if (!search) return true;
      const label = v.label || k;
      const normLabel = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normKey = k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normLabel.includes(search) || normKey.includes(search);
    });

    const badge = document.getElementById('prices-count-badge');
    if (badge) badge.textContent = `${entries.length} matières (${filtered.length} affichées)`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">
            Aucune matière première trouvée pour votre recherche.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = filtered.map(([key, item]) => {
      const label = item.label || (key.charAt(0).toUpperCase() + key.slice(1));
      const unit = item.unit || 'g';

      let displayUnit = 'kg';
      let purchasePrice = (item.cost || 0) * 1000;
      let unitDesc = `${(item.cost || 0).toFixed(4)} DH/g`;

      if (unit === 'ml' || unit === 'l') {
        displayUnit = 'L';
        purchasePrice = (item.cost || 0) * 1000;
        unitDesc = `${(item.cost || 0).toFixed(4)} DH/ml`;
      } else if (unit === 'piece' || unit === 'p') {
        displayUnit = 'Pièce / Unité';
        purchasePrice = item.cost || 0;
        unitDesc = `${(item.cost || 0).toFixed(2)} DH/p`;
      }

      purchasePrice = Math.round(purchasePrice * 100) / 100;

      return `
        <tr>
          <td style="padding:10px 14px; font-weight:700; color:var(--text);">
            ${escapeHtml(label)}
            <span style="font-size:10px; color:var(--text-muted); display:block; font-weight:normal;">Réf: ${escapeHtml(key)}</span>
          </td>
          <td style="padding:10px; text-align:center;">
            <span class="unit-chip">
              ${displayUnit}
            </span>
          </td>
          <td style="padding:8px 14px; text-align:right;">
            <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px;">
              <input type="number" step="0.1" min="0" 
                class="price-edit-input" 
                data-key="${escapeHtml(key)}" 
                data-unit="${unit}" 
                value="${purchasePrice}" 
                style="width:95px; padding:6px 8px; text-align:right; font-weight:800; font-size:13px; border-radius:7px; border:1.5px solid var(--border); background:var(--bg); color:var(--accent);"
              />
              <span style="font-size:12px; font-weight:700; color:var(--text-muted);">DH</span>
            </div>
          </td>
          <td style="padding:10px 14px; text-align:right; font-weight:700; color:var(--text-muted); font-size:12px;">
            ${unitDesc}
          </td>
        </tr>
      `;
    }).join('');
  }

  function showAddNewPriceForm() {
    const box = document.getElementById('add-price-form-box');
    if (box) box.style.display = 'block';
    const nameInp = document.getElementById('new-price-name');
    if (nameInp) nameInp.focus();
  }

  function hideAddNewPriceForm() {
    const box = document.getElementById('add-price-form-box');
    if (box) box.style.display = 'none';
  }

  function confirmAddIngredientPrice() {
    const name = document.getElementById('new-price-name').value.trim();
    const unit = document.getElementById('new-price-unit').value;
    const priceVal = parseFloat(document.getElementById('new-price-val').value) || 0;

    if (!name) {
      alert("Veuillez saisir le nom de la matière première.");
      return;
    }
    if (priceVal <= 0) {
      alert("Veuillez spécifier un prix d'achat valide supérieur à 0.");
      return;
    }

    const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    let baseUnit = 'g';
    let unitCost = priceVal / 1000;

    if (unit === 'l') {
      baseUnit = 'ml';
      unitCost = priceVal / 1000;
    } else if (unit === 'p') {
      baseUnit = 'piece';
      unitCost = priceVal;
    }

    if (!window.INGREDIENT_UNIT_COSTS) window.INGREDIENT_UNIT_COSTS = {};
    window.INGREDIENT_UNIT_COSTS[key] = {
      cost: unitCost,
      unit: baseUnit,
      label: name
    };

    saveAllIngredientPricesFromModal();

    document.getElementById('new-price-name').value = '';
    document.getElementById('new-price-val').value = '';
    hideAddNewPriceForm();
    renderPricesTable();
  }

  function saveAllIngredientPricesFromModal() {
    const inputs = document.querySelectorAll('.price-edit-input');
    if (!window.INGREDIENT_UNIT_COSTS) window.INGREDIENT_UNIT_COSTS = {};

    inputs.forEach(inp => {
      const key = inp.dataset.key;
      const unit = inp.dataset.unit;
      const val = parseFloat(inp.value) || 0;

      let unitCost = val / 1000;
      if (unit === 'piece' || unit === 'p') {
        unitCost = val;
      }

      if (window.INGREDIENT_UNIT_COSTS[key]) {
        window.INGREDIENT_UNIT_COSTS[key].cost = unitCost;
      } else {
        window.INGREDIENT_UNIT_COSTS[key] = {
          cost: unitCost,
          unit: unit,
          label: key
        };
      }
    });

    try {
      localStorage.setItem(window.GC_STORAGE_KEYS.PRICES, JSON.stringify(window.INGREDIENT_UNIT_COSTS));
    } catch (e) {
      console.error('Erreur sauvegarde prix localStorage:', e);
    }

    // Recalculer toutes les recettes dans le comparateur
    initData();
    renderSummaryKpis();
    renderRecipeCards();

    window.GC_Toast.show("✅ Prix des matières enregistrés ! Food costs et marges recalculés en direct.", 'success');
  }

  // Générer la chaîne complète du fichier recipes-data.js à jour
  function buildUpdatedRecipesDataJsString() {
    const rawData = window.CATEGORIES_DATA || window.DATA || [];
    const clonedData = JSON.parse(JSON.stringify(rawData));

    clonedData.forEach(cat => {
      (cat.items || []).forEach(item => {
        const edit = editedRecipes[item.name] || editedRecipes[cleanText(item.name)];
        if (edit) {
          if (edit.tech) item.tech = edit.tech;
          if (typeof edit.sellPrice === 'number' && edit.sellPrice > 0) {
            item.sellPrice = edit.sellPrice;
            item.price = edit.sellPrice + ' DH';
          }
        }
        const sellPrice = parseFloat(String(item.price || item.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
        const costObj = window.calculateRecipeFoodCost(item.tech, sellPrice);
        item.cost = costObj.cost;
        item.foodCost = costObj.foodCost;
        item.margin = costObj.margin;
        item.grossMarginDH = costObj.grossMarginDH;
      });
    });

    // 2. Base recipes
    const rawBase = window.BASE_RECIPES || [];
    const clonedBase = JSON.parse(JSON.stringify(rawBase));
    clonedBase.forEach(r => {
      const edit = editedRecipes[r.name] || editedRecipes[cleanText(r.name)];
      if (edit) {
        if (edit.tech) r.ingredients = edit.tech;
        if (typeof edit.sellPrice === 'number' && edit.sellPrice > 0) {
          r.sellPrice = edit.sellPrice;
          r.price = edit.sellPrice + ' DH';
        }
      }
    });

    // 3. Objets complémentaires
    const aliasObj = window.ALIAS_MAP || {};
    const catObj = window.INGREDIENT_CATEGORIES || {};
    const unitCostsObj = window.INGREDIENT_UNIT_COSTS || {};
    const fnStr = (window.calculateRecipeFoodCost || calculateRecipeFoodCost).toString();

    let content = `/**\n * GREY CORNER — Base de données centralisée des Fiches Techniques et Recettes\n * Source Unique de Vérité (SSOT) mise à jour automatiquement le ${new Date().toISOString()}\n */\n\n(function(global) {\n`;
    content += `const DATA = ${JSON.stringify(clonedData, null, 2)};\n\n`;
    content += `const BASE_RECIPES = ${JSON.stringify(clonedBase, null, 2)};\n\n`;
    content += `const ALIAS_MAP = ${JSON.stringify(aliasObj, null, 2)};\n\n`;
    content += `const INGREDIENT_CATEGORIES = ${JSON.stringify(catObj, null, 2)};\n\n`;
    content += `const INGREDIENT_UNIT_COSTS = ${JSON.stringify(unitCostsObj, null, 2)};\n\n`;
    content += `${fnStr}\n\n`;
    content += `global.CATEGORIES_DATA = DATA;\nglobal.DATA = DATA;\nglobal.BASE_RECIPES = BASE_RECIPES;\nglobal.ALIAS_MAP = ALIAS_MAP;\nglobal.INGREDIENT_CATEGORIES = INGREDIENT_CATEGORIES;\nglobal.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\nglobal.calculateRecipeFoodCost = calculateRecipeFoodCost;\nif (typeof window !== 'undefined') {\n  window.calculateRecipeFoodCost = calculateRecipeFoodCost;\n  window.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\n  window.DATA = DATA;\n  window.CATEGORIES_DATA = DATA;\n  window.BASE_RECIPES = BASE_RECIPES;\n}\n})(typeof window !== 'undefined' ? window : globalThis);\n`;

    return content;
  }

  // Exporter le fichier complet recipes-data.js (Téléchargement local)
  function downloadUpdatedRecipesDataJs() {
    try {
      const content = buildUpdatedRecipesDataJsString();
      const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "recipes-data.js";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      window.GC_Toast.show("📁 Fichier recipes-data.js complet mis à jour et téléchargé !", 'success');
    } catch (err) {
      alert("Erreur lors de l'exportation de recipes-data.js : " + err.message);
    }
  }

  // Synchronisation directe vers le Codebase GitHub via l'API REST
  window.syncDirectToGitHub = async function() {
    let token = localStorage.getItem('gc_github_token');
    if (!token) {
      token = prompt("🔑 Synchronisation directe avec GitHub (Codebase) :\nVeuillez entrer votre GitHub Personal Access Token (PAT) avec accès 'repo' :\n(Ce jeton restera mémorisé dans votre navigateur en toute sécurité)");
      if (!token) return;
      token = token.trim();
      localStorage.setItem('gc_github_token', token);
    }

    const btn = document.getElementById('btn-github-sync');
    const origHTML = btn ? btn.innerHTML : '';
    if (btn) {
      btn.innerHTML = "⏳ Envoi vers GitHub...";
      btn.disabled = true;
    }

    try {
      const fileContent = buildUpdatedRecipesDataJsString();
      const owner = 'hichamatlas75-del';
      const repo = 'Fiche-technique';
      const path = 'recipes-data.js';
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

      // 1. Récupérer le SHA actuel du fichier
      const getRes = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!getRes.ok) {
        if (getRes.status === 401 || getRes.status === 403) {
          localStorage.removeItem('gc_github_token');
          throw new Error("Token GitHub invalide ou permissions insuffisantes. Veuillez cliquer à nouveau et entrer un token valide avec la permission 'repo'.");
        }
        throw new Error(`Erreur GitHub API (${getRes.status}): ${getRes.statusText}`);
      }

      const fileData = await getRes.json();
      const currentSha = fileData.sha;

      // 2. Encodage UTF-8 en Base64
      const utf8Bytes = new TextEncoder().encode(fileContent);
      let binaryStr = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binaryStr += String.fromCharCode(utf8Bytes[i]);
      }
      const base64Content = btoa(binaryStr);

      // 3. Envoyer le commit directement sur origin/main
      const nowStr = new Date().toLocaleString('fr-FR');
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Mise à jour des fiches techniques depuis l'interface web [${nowStr}]`,
          content: base64Content,
          sha: currentSha,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.message || `Erreur HTTP ${putRes.status}`);
      }

      window.GC_Toast.show("🚀 Fiches techniques enregistrées DIRECTEMENT sur le Codebase GitHub !", 'success');
      if (btn) {
        btn.innerHTML = "✅ Enregistré sur GitHub !";
        btn.style.background = "#059669";
        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.style.background = "";
          btn.disabled = false;
        }, 4000);
      }
    } catch (err) {
      alert("⚠️ Erreur lors de la synchronisation avec GitHub :\n" + err.message);
      if (btn) {
        btn.innerHTML = origHTML;
        btn.disabled = false;
      }
    }
  };

  // Rétrocompatibilité & Délégation vers GC_PricesModal
  window.exportUpdatedRecipesDataJS = downloadUpdatedRecipesDataJs;
  window.downloadUpdatedRecipesDataJs = downloadUpdatedRecipesDataJs;
  window.openPricesModal = () => window.GC_PricesModal ? window.GC_PricesModal.open() : openPricesModal();
  window.closePricesModal = () => window.GC_PricesModal ? window.GC_PricesModal.close() : closePricesModal();

  // Initialisation au chargement
  function initComparatorApp() {
    initData();

    // Recherche
    const searchInput = document.getElementById('search-comparator');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderRecipeCards();
      });
    }

    // Filtre gains
    const filterGainBtn = document.getElementById('btn-filter-gains');
    if (filterGainBtn) {
      filterGainBtn.addEventListener('click', () => {
        onlyGainsFilter = !onlyGainsFilter;
        filterGainBtn.classList.toggle('active', onlyGainsFilter);
        renderRecipeCards();
      });
    }

    // Bouton de sauvegarde globale
    const saveAllBtn = document.getElementById('btn-save-all');
    if (saveAllBtn) {
      saveAllBtn.addEventListener('click', () => saveEdits(true));
    }

    // Écoute de mise à jour des prix d'achat
    if (window.GC_PricesModal) {
      window.GC_PricesModal.onUpdate(() => {
        initData();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComparatorApp);
  } else {
    initComparatorApp();
  }

