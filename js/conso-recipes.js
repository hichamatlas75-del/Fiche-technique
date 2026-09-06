/**
 * GREY CORNER — Gestionnaire de Fiches Techniques & Modale Recettes
 * Module: conso-recipes.js
 */

function findSellingPriceForRecipe(recipeName) {
  if (!recipeName) return 0;
  const cleanN = cleanText(recipeName);
  if (typeof DATA !== 'undefined' && Array.isArray(DATA)) {
    for (const cat of DATA) {
      for (const item of (cat.items || [])) {
        if (cleanText(item.name) === cleanN) {
          return item.sellPrice || parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0;
        }
      }
    }
  }
  return 0;
}

function renderRecipeList() {
  const container = document.getElementById('recipes-grid-container');
  const search = cleanText(document.getElementById('search-recipe-list').value);

  const filtered = activeRecipes.filter(r => {
    if (search && !cleanText(r.name).includes(search) && !cleanText(r.category).includes(search)) return false;
    return true;
  });

  document.getElementById('count-recipes').textContent = activeRecipes.length;
  const drawerCountRecipes = document.getElementById('drawer-count-recipes');
  if (drawerCountRecipes) drawerCountRecipes.textContent = activeRecipes.length;

  container.innerHTML = filtered.map(r => {
    const sellPrice = r.sellPrice || findSellingPriceForRecipe(r.name) || 0;
    const fcCalc = typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost(r.ingredients, sellPrice) : { cost: 0, foodCost: 0, margin: 0 };
    
    const fcColor = fcCalc.foodCost <= 32 ? '#10b981' : fcCalc.foodCost <= 42 ? '#f59e0b' : '#ef4444';

    const ingLines = (r.ingredients || []).map(i => {
      const parts = i.split(':');
      if (parts.length > 1) {
        return `<li><span>${escapeHtml(parts[0].trim())}</span> <strong style="color:var(--accent);">${escapeHtml(parts.slice(1).join(':').trim())}</strong></li>`;
      }
      return `<li><span>${escapeHtml(i)}</span></li>`;
    }).join('');

    return `
      <div class="recipe-card">
        <div class="recipe-card-title">
          <span>${escapeHtml(r.name)}</span>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn" style="padding: 3px 8px; font-size:11px;" onclick="editRecipe('${r.id}')">✏️ Modifier</button>
            <button class="btn" style="padding: 3px 8px; font-size:11px; color:#ef4444; border-color:rgba(239,68,68,0.35);" onclick="deleteRecipe('${r.id}')" title="Supprimer définitivement cette fiche technique">🗑️</button>
          </div>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:var(--muted); margin-bottom:8px;">
          <span>Catégorie : <strong>${escapeHtml(r.category)}</strong></span>
          ${sellPrice > 0 ? `<span style="font-weight:800; color:var(--accent); font-size:12.5px;">${sellPrice} DH</span>` : ''}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:6px; padding:6px 10px; margin-bottom:10px; font-size:11.5px;">
          <span title="Coût matière estimé">💰 Coût : <strong style="color:#38bdf8;">${fcCalc.cost.toFixed(2)} DH</strong></span>
          <span title="Food Cost" style="font-weight:800; color:${fcColor};">📊 ${fcCalc.foodCost > 0 ? fcCalc.foodCost + '%' : '-'}</span>
          <span title="Marge brute" style="color:#a78bfa; font-weight:800;">📈 ${fcCalc.margin > 0 ? fcCalc.margin + '%' : '-'}</span>
        </div>

        <ul class="recipe-ing-list">${ingLines}</ul>
      </div>
    `;
  }).join('');
}

/* ========================================================
   9. MODALE & ÉDITION DYNAMIQUE DE FICHES TECHNIQUES (LIVE FOOD COST)
======================================================== */
function updateModalFoodCostPreview() {
  const rawIngs = document.getElementById('edit-recipe-ingredients').value;
  const priceVal = parseFloat(document.getElementById('edit-recipe-price').value) || 0;
  const ingredients = rawIngs.split('\n').map(s => s.trim()).filter(Boolean);

  if (typeof calculateRecipeFoodCost !== 'function') return;

  const fc = calculateRecipeFoodCost(ingredients, priceVal);

  const elCost = document.getElementById('modal-fc-cost');
  const elPct = document.getElementById('modal-fc-pct');
  const elMargin = document.getElementById('modal-fc-margin');
  const elBadge = document.getElementById('modal-fc-badge');
  const elBreakdown = document.getElementById('modal-fc-breakdown');

  if (elCost) elCost.textContent = `${fc.cost.toFixed(2)} DH`;
  if (elPct) {
    elPct.textContent = priceVal > 0 ? `${fc.foodCost}%` : 'Saisir Prix';
    elPct.style.color = fc.foodCost <= 32 ? '#10b981' : fc.foodCost <= 42 ? '#f59e0b' : '#ef4444';
  }
  if (elMargin) {
    elMargin.textContent = priceVal > 0 ? `${fc.margin}% (${fc.grossMarginDH.toFixed(2)} DH)` : '-';
  }
  if (elBadge) {
    if (priceVal <= 0) {
      elBadge.textContent = 'Prix manquant';
      elBadge.style.background = '#64748b';
    } else if (fc.foodCost <= 32) {
      elBadge.textContent = 'Food Cost Optimal (≤32%)';
      elBadge.style.background = '#10b981';
    } else if (fc.foodCost <= 42) {
      elBadge.textContent = 'Food Cost Modéré (33-42%)';
      elBadge.style.background = '#f59e0b';
    } else {
      elBadge.textContent = 'Food Cost Élevé (>42%)';
      elBadge.style.background = '#ef4444';
    }
  }

  if (elBreakdown) {
    if (fc.breakdown && fc.breakdown.length > 0) {
      elBreakdown.innerHTML = fc.breakdown.map(b => {
        const pctOfTotal = fc.cost > 0 ? Math.round((b.cost / fc.cost) * 100) : 0;
        return `<div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px dashed rgba(255,255,255,0.06);">
          <span>${escapeHtml(b.ingredient)} <strong style="color:var(--text);">${escapeHtml(b.quantity)}</strong></span>
          <span><strong style="color:#38bdf8;">${b.cost.toFixed(2)} DH</strong> <small style="color:var(--muted); font-size:10px;">(${pctOfTotal}%)</small></span>
        </div>`;
      }).join('');
    } else {
      elBreakdown.innerHTML = '<span style="color:var(--muted);">Saisissez des ingrédients pour afficher la valorisation unitaire.</span>';
    }
  }
}

function openRecipeEditor(productName) {
  const recipe = findRecipeForProduct(productName);
  if (recipe) {
    editRecipe(recipe.id);
  } else {
    document.getElementById('edit-recipe-id').value = 'rec_' + Date.now();
    document.getElementById('edit-recipe-name').value = productName.toUpperCase();
    document.getElementById('edit-recipe-cat').value = 'AUTRE';
    document.getElementById('edit-recipe-ingredients').value = '';
    document.getElementById('edit-recipe-price').value = findSellingPriceForRecipe(productName) || '';
    document.getElementById('modal-recipe-title').textContent = `Créer Fiche Technique : ${productName}`;
    
    const btnDelete = document.getElementById('btn-delete-recipe-modal');
    if (btnDelete) btnDelete.style.display = 'none';

    document.getElementById('recipe-modal').classList.add('visible');
    updateModalFoodCostPreview();
  }
}

function editRecipe(id) {
  const r = activeRecipes.find(x => x.id === id);
  if (!r) return;
  document.getElementById('edit-recipe-id').value = r.id;
  document.getElementById('edit-recipe-name').value = r.name;
  document.getElementById('edit-recipe-cat').value = r.category || 'AUTRE';
  document.getElementById('edit-recipe-ingredients').value = (r.ingredients || []).join('\n');
  document.getElementById('edit-recipe-price').value = r.sellPrice || findSellingPriceForRecipe(r.name) || '';
  document.getElementById('modal-recipe-title').textContent = `Modifier : ${r.name}`;
  
  const btnDelete = document.getElementById('btn-delete-recipe-modal');
  if (btnDelete) btnDelete.style.display = 'inline-flex';

  document.getElementById('recipe-modal').classList.add('visible');
  updateModalFoodCostPreview();
}

function closeModal() {
  document.getElementById('recipe-modal').classList.remove('visible');
}

function deleteRecipe(id) {
  const r = activeRecipes.find(x => x.id === id);
  const name = r ? r.name : 'cette fiche technique';

  if (!confirm(`⚠️ Êtes-vous sûr de vouloir supprimer définitivement la fiche technique "${name}" ?\n\nCette action retirera la fiche de la base et recalculera le déstockage et le Food Cost.`)) {
    return;
  }

  // 1. Filtrer et supprimer de activeRecipes
  activeRecipes = activeRecipes.filter(x => x.id !== id);

  // 2. Sauvegarder dans localStorage
  saveRecipes();

  // 3. Mettre à jour l'index en mémoire
  if (window.recipeNameIndex && r) {
    window.recipeNameIndex.delete(cleanText(r.name));
  }

  // 4. Supprimer de DATA si présent
  if (typeof DATA !== 'undefined' && Array.isArray(DATA) && r) {
    DATA.forEach(cat => {
      if (Array.isArray(cat.items)) {
        cat.items = cat.items.filter(it => cleanText(it.name) !== cleanText(r.name));
      }
    });
  }

  // 5. Enregistrer l'exclusion pour index.html
  try {
    const deletedList = JSON.parse(localStorage.getItem(GC_STORAGE_KEYS.DELETED) || '[]');
    if (r && !deletedList.includes(r.id)) deletedList.push(r.id);
    if (r && !deletedList.includes(cleanText(r.name))) deletedList.push(cleanText(r.name));
    localStorage.setItem(GC_STORAGE_KEYS.DELETED, JSON.stringify(deletedList));
  } catch (e) {}

  closeModal();
  renderRecipeList();
  recalculateCurrentView();
  console.log(`[Fiche Technique] Supprimée avec succès : "${name}"`);
}

function deleteRecipeFromModal() {
  const id = document.getElementById('edit-recipe-id').value;
  if (id) {
    deleteRecipe(id);
  }
}

function saveRecipeFromModal() {
  const id = document.getElementById('edit-recipe-id').value;
  const name = document.getElementById('edit-recipe-name').value.trim();
  const category = document.getElementById('edit-recipe-cat').value;
  const rawIngs = document.getElementById('edit-recipe-ingredients').value;
  const sellPrice = parseFloat(document.getElementById('edit-recipe-price').value) || 0;

  if (!name) {
    alert('Veuillez spécifier le nom du plat.');
    return;
  }

  const ingredients = rawIngs.split('\n').map(s => s.trim()).filter(Boolean);
  const fcCalc = typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost(ingredients, sellPrice) : { cost: 0, foodCost: 0, margin: 0, grossMarginDH: 0 };

  const recipeObj = {
    id: id || ('rec_' + Date.now()),
    name: name,
    category: category,
    ingredients: ingredients,
    sellPrice: sellPrice,
    cost: fcCalc.cost,
    foodCost: fcCalc.foodCost,
    margin: fcCalc.margin,
    grossMarginDH: fcCalc.grossMarginDH
  };

  const idx = activeRecipes.findIndex(x => x.id === id);
  if (idx >= 0) {
    activeRecipes[idx] = recipeObj;
  } else {
    activeRecipes.push(recipeObj);
  }

  // 1. Sauvegarde dans localStorage (persistant gc_recipes_db_v5)
  saveRecipes();

  // 2. Synchronisation avec le comparateur (grey_corner_custom_recipes_v5)
  try {
    const savedComp = localStorage.getItem(GC_STORAGE_KEYS.COMP_EDITS);
    const compEdits = savedComp ? JSON.parse(savedComp) : {};
    compEdits[name] = { tech: ingredients.slice(), updatedAt: Date.now() };
    localStorage.setItem(GC_STORAGE_KEYS.COMP_EDITS, JSON.stringify(compEdits));
  } catch (e) {
    console.warn("Erreur sauvegarde grey_corner_custom_recipes_v5", e);
  }

  // 3. Mettre à jour l'index en mémoire
  if (window.recipeNameIndex) {
    window.recipeNameIndex.set(cleanText(name), recipeObj);
  }

  // 4. Mettre à jour DATA (pour index.html et cohérence globale)
  if (typeof DATA !== 'undefined' && Array.isArray(DATA)) {
    DATA.forEach(cat => {
      (cat.items || []).forEach(it => {
        if (cleanText(it.name) === cleanText(name)) {
          it.tech = ingredients.slice();
          it.sellPrice = sellPrice;
          it.cost = fcCalc.cost;
          it.foodCost = fcCalc.foodCost;
          it.margin = fcCalc.margin;
          it.grossMarginDH = fcCalc.grossMarginDH;
        }
      });
    });
  }

  closeModal();
  renderRecipeList();
  recalculateCurrentView();

  alert(`✅ Fiche technique "${name}" enregistrée avec succès !\n\nCoût Matière : ${fcCalc.cost.toFixed(2)} DH | Food Cost : ${fcCalc.foodCost.toFixed(1)}% | Marge : ${fcCalc.margin.toFixed(1)}%`);
}

function downloadUpdatedRecipesDataJs() {
  try {
    // 1. Construire les données DATA et BASE_RECIPES mises à jour
    const updatedBaseRecipes = activeRecipes.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category || 'AUTRE',
      ingredients: r.ingredients || []
    }));

    // 2. Créer le script exportable complet
    const fnStr = (typeof window.calculateRecipeFoodCost === 'function' ? window.calculateRecipeFoodCost : calculateRecipeFoodCost).toString();
    const dataObj = typeof window.DATA !== 'undefined' ? window.DATA : (typeof DATA !== 'undefined' ? DATA : []);
    const aliasObj = typeof window.ALIAS_MAP !== 'undefined' ? window.ALIAS_MAP : (typeof ALIAS_MAP !== 'undefined' ? ALIAS_MAP : {});
    const catObj = typeof window.INGREDIENT_CATEGORIES !== 'undefined' ? window.INGREDIENT_CATEGORIES : (typeof INGREDIENT_CATEGORIES !== 'undefined' ? INGREDIENT_CATEGORIES : {});
    const unitCostsObj = typeof window.INGREDIENT_UNIT_COSTS !== 'undefined' ? window.INGREDIENT_UNIT_COSTS : (typeof INGREDIENT_UNIT_COSTS !== 'undefined' ? INGREDIENT_UNIT_COSTS : {});

    let content = `/**\n * GREY CORNER — Base de données centralisée des Fiches Techniques et Recettes\n * Source Unique de Vérité (SSOT) mise à jour automatiquement le ${new Date().toISOString()}\n */\n\n(function(global) {\n`;
    content += `const DATA = ${JSON.stringify(dataObj, null, 2)};\n\n`;
    content += `const BASE_RECIPES = ${JSON.stringify(updatedBaseRecipes, null, 2)};\n\n`;
    content += `const ALIAS_MAP = ${JSON.stringify(aliasObj, null, 2)};\n\n`;
    content += `const INGREDIENT_CATEGORIES = ${JSON.stringify(catObj, null, 2)};\n\n`;
    content += `const INGREDIENT_UNIT_COSTS = ${JSON.stringify(unitCostsObj, null, 2)};\n\n`;
    content += `${fnStr}\n\n`;
    content += `global.CATEGORIES_DATA = DATA;\nglobal.DATA = DATA;\nglobal.BASE_RECIPES = BASE_RECIPES;\nglobal.ALIAS_MAP = ALIAS_MAP;\nglobal.INGREDIENT_CATEGORIES = INGREDIENT_CATEGORIES;\nglobal.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\nglobal.calculateRecipeFoodCost = calculateRecipeFoodCost;\nif (typeof window !== 'undefined') {\n  window.calculateRecipeFoodCost = calculateRecipeFoodCost;\n  window.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\n  window.DATA = DATA;\n  window.CATEGORIES_DATA = DATA;\n  window.BASE_RECIPES = BASE_RECIPES;\n}\n})(typeof window !== 'undefined' ? window : globalThis);\n`;

    const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "recipes-data.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("✅ Le fichier 'recipes-data.js' mis à jour a été généré et téléchargé avec succès !");
  } catch (err) {
    alert("Erreur lors de la génération de recipes-data.js : " + err.message);
  }
}

function exportRecipesJSON() {
  const str = JSON.stringify(activeRecipes, null, 2);
  const blob = new Blob([str], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GreyCorner_Fiches_Techniques_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importRecipesJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data) && data.length > 0) {
        activeRecipes = data;
        saveRecipes();
        renderRecipeList();
        recalculateCurrentView();
        alert(`✅ ${data.length} fiches techniques importées et enregistrées avec succès !`);
      } else {
        alert("Le fichier JSON ne contient pas de liste de fiches techniques valide.");
      }
    } catch (err) {
      alert("Erreur lors de la lecture du fichier JSON : " + err.message);
    }
  };
  reader.onerror = () => alert("Erreur de lecture du fichier. Veuillez réessayer.");
  reader.readAsText(file);
}

/* ========================================================
   9b. MERCURIALE & PRIX D'ACHAT DES MATIÈRES PREMIÈRES
======================================================== */
function loadCustomIngredientPrices() {
  try {
    const saved = localStorage.getItem(GC_STORAGE_KEYS.PRICES);
    if (saved) {
      const customPrices = JSON.parse(saved);
      if (window.OBSOLETE_INGREDIENT_KEYS) {
        window.OBSOLETE_INGREDIENT_KEYS.forEach(k => {
          delete customPrices[k];
          if (typeof window.INGREDIENT_UNIT_COSTS !== 'undefined') delete window.INGREDIENT_UNIT_COSTS[k];
        });
      }
      if (typeof window.INGREDIENT_UNIT_COSTS !== 'undefined') {
        Object.assign(window.INGREDIENT_UNIT_COSTS, customPrices);
      }
    }
  } catch (e) {
    console.warn('[Mercuriale] Erreur lecture localStorage:', e);
  }
}

function openPricesModal() {
  if (window.GC_PricesModal) {
    window.GC_PricesModal.open();
  } else {
    document.getElementById('prices-modal')?.classList.add('visible');
  }
}

function closePricesModal() {
  if (window.GC_PricesModal) {
    window.GC_PricesModal.close();
  } else {
    document.getElementById('prices-modal')?.classList.remove('visible');
  }
}

if (window.GC_PricesModal) {
  window.GC_PricesModal.onUpdate(() => {
    recalculateMonthlyAudit();
    renderSummaryTable();
    if (typeof renderMenuEngineering === 'function') renderMenuEngineering();
  });
}

function renderPricesTable() {
  const container = document.getElementById('prices-table-body');
  const search = cleanText(document.getElementById('search-prices-input').value);
  const costMap = window.INGREDIENT_UNIT_COSTS || {};

  const entries = Object.entries(costMap);
  const filtered = entries.filter(([k, v]) => {
    if (!search) return true;
    const label = v.label || k;
    return cleanText(label).includes(search) || cleanText(k).includes(search);
  });

  document.getElementById('prices-count-badge').textContent = `${entries.length} matières (${filtered.length} affichées)`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding:30px; color:var(--muted);">
          Aucune matière première trouvée pour "${escapeHtml(search)}".
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

    if (unit === 'ml') {
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
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:10px 12px; font-weight:700; color:var(--text);">
          ${escapeHtml(label)}
          <span style="font-size:10px; color:var(--muted); display:block; font-weight:normal;">Réf: ${escapeHtml(key)}</span>
        </td>
        <td style="padding:10px; text-align:center;">
          <span style="background:var(--chip); color:var(--text); border:1px solid var(--border); padding:3px 8px; border-radius:6px; font-size:11px; font-weight:800;">
            ${displayUnit}
          </span>
        </td>
        <td style="padding:8px 12px; text-align:right;">
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px;">
            <input type="number" step="0.1" min="0" 
              class="price-edit-input" 
              data-key="${escapeHtml(key)}" 
              data-unit="${unit}" 
              value="${purchasePrice}" 
              style="width:95px; padding:6px 8px; text-align:right; font-weight:800; font-size:13px; border-radius:6px; border:1.5px solid var(--border); background:var(--bg); color:var(--accent);"
            />
            <span style="font-size:12px; font-weight:700; color:var(--muted);">DH</span>
          </div>
        </td>
        <td style="padding:10px 12px; text-align:right; font-weight:700; color:var(--muted); font-size:12px;">
          ${unitDesc}
        </td>
      </tr>
    `;
  }).join('');
}

function showAddNewPriceForm() {
  document.getElementById('add-price-form-box').style.display = 'block';
  document.getElementById('new-price-name').focus();
}

function hideAddNewPriceForm() {
  document.getElementById('add-price-form-box').style.display = 'none';
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

  const key = cleanText(name);
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

  // Sauvegarde persistante dans localStorage
  try {
    localStorage.setItem(GC_STORAGE_KEYS.PRICES, JSON.stringify(window.INGREDIENT_UNIT_COSTS));
  } catch (e) {
    console.error('Erreur sauvegarde localStorage prix:', e);
  }

  // Recalculer les coûts de toutes les fiches techniques actives
  if (Array.isArray(activeRecipes)) {
    activeRecipes.forEach(r => {
      const sellPrice = r.sellPrice || findSellingPriceForRecipe(r.name) || 0;
      if (typeof calculateRecipeFoodCost === 'function') {
        const fc = calculateRecipeFoodCost(r.ingredients, sellPrice);
        r.cost = fc.cost;
        r.foodCost = fc.foodCost;
        r.margin = fc.margin;
        r.grossMarginDH = fc.grossMarginDH;
      }
    });
    saveRecipes();
  }

  // Mettre à jour DATA si présent
  if (typeof DATA !== 'undefined' && Array.isArray(DATA)) {
    DATA.forEach(cat => {
      (cat.items || []).forEach(it => {
        if (typeof calculateRecipeFoodCost === 'function') {
          const sellPrice = it.sellPrice || parseFloat(String(it.price || 0).replace(/[^0-9.]/g, '')) || 0;
          const fc = calculateRecipeFoodCost(it.tech, sellPrice);
          it.cost = fc.cost;
          it.foodCost = fc.foodCost;
          it.margin = fc.margin;
          it.grossMarginDH = fc.grossMarginDH;
        }
      });
    });
  }

  renderRecipeList();
  recalculateCurrentView();
  alert("✅ Prix des matières premières enregistrés ! Tous les Food Costs et Marges ont été recalculés avec succès.");
}

