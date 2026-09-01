/**
 * GREY CORNER — Comparateur de Fiches Techniques & Benchmark International
 * Comparaison directe côte-à-côte :
 * 1. Fiche Technique Grey Corner (Opérationnelle, Modifiable & Enregistrable dans recipes-data.js)
 * 2. Norme Internationale & Standard Métier (À titre indicatif et comparatif)
 */

(function() {
  'use strict';

  // État local de l'application
  let allRecipes = [];
  let editedRecipes = {}; // Clé: nomRecette -> { tech: [...] }
  let currentCategory = 'ALL';
  let searchQuery = '';
  let onlyGainsFilter = false;

  const STORAGE_KEY = 'grey_corner_custom_recipes_v5';

  // Chargement des modifications enregistrées localement
  function loadSavedEdits() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        editedRecipes = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Impossible de charger les fiches sauvegardées", e);
    }
  }

  // Sauvegarde des modifications
  function saveEdits() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editedRecipes));
      showToast("💾 Fiches techniques Grey Corner enregistrées avec succès !");
    } catch (e) {
      console.error("Erreur lors de la sauvegarde", e);
      showToast("❌ Erreur lors de la sauvegarde locale");
    }
  }

  // Initialisation des données
  function initData() {
    loadSavedEdits();
    allRecipes = [];

    const data = window.CATEGORIES_DATA || window.DATA || [];
    data.forEach(cat => {
      const catName = cat.category || 'AUTRE';
      (cat.items || []).forEach(item => {
        const initialTech = item.tech || [];
        const sellPrice = parseFloat(String(item.price || item.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
        
        // 1. Fiche Grey Corner (Modifiable ou initiale)
        const currentTech = (editedRecipes[item.name] && editedRecipes[item.name].tech) 
          ? editedRecipes[item.name].tech 
          : JSON.parse(JSON.stringify(initialTech));

        const gcCostObj = window.calculateRecipeFoodCost(currentTech, sellPrice);

        // 2. Norme Internationale & Standard Métier (À titre comparatif)
        const standardObj = window.getProposedStandard(item.name, { category: catName, tech: initialTech });
        const standardTech = standardObj ? standardObj.tech : initialTech;
        const standardCostObj = window.calculateRecipeFoodCost(standardTech, sellPrice);
        const rationale = standardObj ? standardObj.rationale : "Portion standardisée selon les ratios F&B internationaux.";

        const diffDH = Math.round((gcCostObj.cost - standardCostObj.cost) * 100) / 100;

        allRecipes.push({
          category: catName,
          name: item.name,
          image: item.image || (item.images ? item.images.split(',')[0] : null),
          sellPrice: sellPrice,
          initialTech: initialTech,
          greyCorner: {
            tech: currentTech,
            cost: gcCostObj.cost,
            foodCost: gcCostObj.foodCost,
            margin: gcCostObj.margin,
            grossMarginDH: gcCostObj.grossMarginDH,
            breakdown: gcCostObj.breakdown
          },
          standard: {
            tech: standardTech,
            rationale: rationale,
            cost: standardCostObj.cost,
            foodCost: standardCostObj.foodCost,
            margin: standardCostObj.margin,
            grossMarginDH: standardCostObj.grossMarginDH,
            breakdown: standardCostObj.breakdown,
            diffDH: diffDH
          }
        });
      });
    });

    renderCategoriesBar();
    renderSummaryKPIs();
    renderRecipeCards();
  }

  // Rendu de la barre des catégories
  function renderCategoriesBar() {
    const bar = document.getElementById('category-filter-bar');
    if (!bar) return;

    const categories = ['ALL', ...new Set(allRecipes.map(r => r.category))];
    const categoryIcons = {
      'ALL': '🌟 Tous les plats',
      'PIZZA': '🍕 Pizzas',
      'PLATS': '🥩 Plats',
      'PÂTES': '🍝 Pâtes',
      'CRÊPES': '🥞 Crêpes',
      'BURGERS': '🍔 Burgers',
      'WRAPS': '🌯 Wraps',
      'PANINIS': '🥪 Paninis',
      'SANDWICHS': '🥪 Sandwichs',
      'PETIT DÉJEUNER': '🍳 Petit Déjeuner',
      'ENTRÉES FROIDES': '🥗 Entrées Froides',
      'ENTRÉES CHAUDES': '🥘 Entrées Chaudes',
      'JUS FRAIS PRESSÉS & ROYAUX': '🍹 Jus Frais',
      'CAFÉS & BOISSONS CHAUDES': '☕ Cafés & Thés',
      'DESSERTS & PÂTISSERIES': '🍰 Desserts'
    };

    bar.innerHTML = categories.map(cat => {
      const label = categoryIcons[cat] || cat;
      const count = cat === 'ALL' ? allRecipes.length : allRecipes.filter(r => r.category === cat).length;
      const isActive = currentCategory === cat ? 'active' : '';
      return `<button class="cat-pill ${isActive}" onclick="window.setComparatorCategory('${cat}')">
        ${label} <span class="pill-count">(${count})</span>
      </button>`;
    }).join('');
  }

  // Rendu du bandeau KPI global
  function renderSummaryKPIs() {
    const totalItems = allRecipes.length;
    let sumGcCost = 0;
    let sumStdCost = 0;
    let sumPrice = 0;

    allRecipes.forEach(r => {
      sumGcCost += r.greyCorner.cost;
      sumStdCost += r.standard.cost;
      sumPrice += r.sellPrice;
    });

    const avgGcFC = sumPrice > 0 ? (sumGcCost / sumPrice * 100).toFixed(1) : 0;
    const avgStdFC = sumPrice > 0 ? (sumStdCost / sumPrice * 100).toFixed(1) : 0;
    const totalDiffDH = totalItems > 0 ? ((sumGcCost - sumStdCost) / totalItems).toFixed(2) : 0;

    const kpiEl = document.getElementById('summary-kpis');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-card">
          <div class="kpi-label">Plats au Menu</div>
          <div class="kpi-value text-accent">${totalItems}</div>
          <div class="kpi-sub">Fiches techniques actives</div>
        </div>
        <div class="kpi-card initial-theme">
          <div class="kpi-label">Food Cost Moyen Grey Corner</div>
          <div class="kpi-value text-accent" style="color:#0284c7;">${avgGcFC} %</div>
          <div class="kpi-sub">Fiches opérationnelles actuelles</div>
        </div>
        <div class="kpi-card standard-theme">
          <div class="kpi-label">Food Cost Standard Int.</div>
          <div class="kpi-value text-success">${avgStdFC} %</div>
          <div class="kpi-sub">Référence métier hôtelière</div>
        </div>
        <div class="kpi-card gain-theme">
          <div class="kpi-label">Écart Moyen vs Standard</div>
          <div class="kpi-value ${totalDiffDH > 0 ? 'text-gold' : 'text-success'}">${totalDiffDH > 0 ? '+' + totalDiffDH : totalDiffDH} DH</div>
          <div class="kpi-sub">Différentiel de matière / portion</div>
        </div>
      `;
    }
  }

  // Filtrage et Rendu des cartes de recettes
  function renderRecipeCards() {
    const container = document.getElementById('recipes-comparator-container');
    if (!container) return;

    let filtered = allRecipes.filter(r => {
      const matchCat = currentCategory === 'ALL' || r.category === currentCategory;
      const matchSearch = !searchQuery || 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.greyCorner.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchGains = !onlyGainsFilter || r.standard.diffDH >= 3.0;
      return matchCat && matchSearch && matchGains;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div style="font-size:48px; margin-bottom:12px;">🔍</div>
          <h3>Aucun plat trouvé</h3>
          <p>Essayez de modifier votre recherche ou sélectionnez une autre catégorie.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((recipe, idx) => {
      return createRecipeComparativeCardHTML(recipe, idx);
    }).join('');
  }

  // Génération du code HTML d'une carte comparative 2-colonnes
  function createRecipeComparativeCardHTML(recipe, idx) {
    const gcFCClass = recipe.greyCorner.foodCost <= 28 ? 'badge-ok' : (recipe.greyCorner.foodCost <= 38 ? 'badge-warn' : 'badge-danger');
    const stdFCClass = recipe.standard.foodCost <= 28 ? 'badge-ok' : (recipe.standard.foodCost <= 38 ? 'badge-warn' : 'badge-danger');

    const diffBadge = recipe.standard.diffDH > 0 
      ? `<span class="badge-gain" style="background:rgba(2, 132, 199, 0.1); color:#0284c7; border-color:rgba(2, 132, 199, 0.3);">Écart vs Standard : +${recipe.standard.diffDH.toFixed(2)} DH</span>`
      : `<span class="badge-neutral">Marge conforme au standard</span>`;

    return `
      <div class="comparative-card" id="card-${idx}" data-recipe-name="${escapeHtml(recipe.name)}">
        <!-- HEADER DU PLAT -->
        <div class="card-top-bar">
          <div class="card-title-group">
            <span class="cat-tag">${recipe.category}</span>
            <h3 class="dish-title">${recipe.name}</h3>
          </div>
          <div class="card-price-group">
            <span class="sell-price-tag">Prix Vente : ${recipe.sellPrice} DH</span>
            ${diffBadge}
          </div>
        </div>

        <!-- GRILLE COMPARATIVE 2 COLONNES -->
        <div class="comparison-dual-grid">
          
          <!-- COLONNE 1 : FICHE GREY CORNER (OPÉRATIONNELLE & MODIFIABLE) -->
          <div class="col-box col-greycorner">
            <div class="col-header">
              <span class="col-dot dot-blue"></span>
              <h4>1. Fiche Technique Grey Corner (Modifiable)</h4>
            </div>

            <!-- ÉDITEUR D'INGRÉDIENTS EN DIRECT -->
            <div class="custom-ingredients-editor" id="editor-${idx}">
              ${renderIngredientsEditorHTML(recipe.greyCorner.tech, recipe.name, idx)}
            </div>

            <!-- BOUTONS D'ACTION SUR LA RECETTE -->
            <div class="quick-preset-actions" style="margin-top:12px;">
              <button class="btn-preset" title="Ajouter un ingrédient à la fiche" onclick="window.addIngredientToRecipe('${escapeHtml(recipe.name)}', ${idx})">➕ Ajouter ingrédient</button>
              <button class="btn-preset text-success" title="Appliquer le standard international sur la fiche Grey Corner" onclick="window.copyStandardToRecipe('${escapeHtml(recipe.name)}', ${idx})">🟢 Copier Standard Int.</button>
              <button class="btn-preset text-danger" title="Rétablir la fiche d'origine" onclick="window.resetRecipeToInitial('${escapeHtml(recipe.name)}', ${idx})">🔄 Rétablir d'origine</button>
            </div>

            <!-- RÉSULTAT FINANCIER DE LA FICHE GREY CORNER -->
            <div class="col-finances fin-custom" style="margin-top:14px;">
              <div class="fin-row">
                <span>Coût Portion Réel :</span>
                <strong id="gc-cost-${idx}" class="text-accent" style="color:#0284c7; font-size:16px;">${recipe.greyCorner.cost.toFixed(2)} DH</strong>
              </div>
              <div class="fin-row">
                <span>Food Cost :</span>
                <span id="gc-fc-${idx}" class="badge ${gcFCClass}">${recipe.greyCorner.foodCost.toFixed(1)} %</span>
              </div>
              <div class="fin-row">
                <span>Marge Brute :</span>
                <strong id="gc-margin-${idx}" class="text-success" style="font-size:16px;">+${recipe.greyCorner.grossMarginDH.toFixed(2)} DH</strong>
              </div>
            </div>
          </div>

          <!-- COLONNE 2 : NORME INTERNATIONALE (À TITRE COMPARATIF) -->
          <div class="col-box col-standard">
            <div class="col-header">
              <span class="col-dot dot-green"></span>
              <h4>2. Norme Internationale & Standard F&B <span style="font-size:11px; font-weight:600; color:var(--text-muted);">(À titre comparatif)</span></h4>
            </div>

            <ul class="tech-list" style="margin-bottom:12px;">
              ${recipe.standard.tech.map(line => `<li>${escapeHtml(line)}</li>`).join('')}
            </ul>

            <div class="rationale-box">
              💡 <strong>Standard Métier :</strong> <em>${escapeHtml(recipe.standard.rationale)}</em>
            </div>

            <div class="col-finances" style="margin-top:auto;">
              <div class="fin-row">
                <span>Coût Portion Standard :</span>
                <strong class="text-success">${recipe.standard.cost.toFixed(2)} DH</strong>
              </div>
              <div class="fin-row">
                <span>Food Cost Standard :</span>
                <span class="badge ${stdFCClass}">${recipe.standard.foodCost.toFixed(1)} %</span>
              </div>
              <div class="fin-row">
                <span>Écart vs Grey Corner :</span>
                <strong class="${recipe.standard.diffDH > 0 ? 'text-gold' : 'text-success'}">${recipe.standard.diffDH > 0 ? '+' + recipe.standard.diffDH.toFixed(2) : recipe.standard.diffDH.toFixed(2)} DH</strong>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // Génération des champs de saisie pour chaque ingrédient
  function renderIngredientsEditorHTML(techArray, recipeName, idx) {
    return techArray.map((line, ingIdx) => {
      const parts = line.split(':');
      const ing = parts[0].trim();
      const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';

      const gMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
      const mlMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);
      const clMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*cl\b/i);
      const pMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*(?:p|piece|tranche|part|boule|sachet|portion|tr)\b/i);

      let numVal = 1;
      let unit = 'g';

      if (gMatch) {
        numVal = parseFloat(gMatch[1].replace(',', '.'));
        unit = 'g';
      } else if (mlMatch) {
        numVal = parseFloat(mlMatch[1].replace(',', '.'));
        unit = 'ml';
      } else if (clMatch) {
        numVal = parseFloat(clMatch[1].replace(',', '.'));
        unit = 'cl';
      } else if (pMatch) {
        numVal = parseFloat(pMatch[1].replace(',', '.'));
        unit = 'p';
      } else {
        numVal = parseFloat(qtyStr.replace(/[^0-9.]/g, '')) || 1;
      }

      const step = unit === 'p' ? 0.5 : 5;

      return `
        <div class="ing-edit-row">
          <input type="text" class="ing-name-input" value="${escapeHtml(ing)}" data-recipe="${escapeHtml(recipeName)}" data-idx="${idx}" data-ing-idx="${ingIdx}" onchange="window.updateIngredientName('${escapeHtml(recipeName)}', ${idx}, ${ingIdx}, this.value)" />
          <div class="ing-input-wrap">
            <button type="button" class="btn-step" onclick="window.stepIngredientVal('${escapeHtml(recipeName)}', ${idx}, ${ingIdx}, -${step})">-</button>
            <input type="number" 
                   class="ing-num-input" 
                   value="${numVal}" 
                   step="${step}" 
                   min="0"
                   data-recipe="${escapeHtml(recipeName)}"
                   data-idx="${idx}"
                   data-ing-idx="${ingIdx}"
                   data-unit="${unit}"
                   oninput="window.onIngredientInputChange('${escapeHtml(recipeName)}', ${idx}, ${ingIdx}, this.value, '${unit}')" />
            <button type="button" class="btn-step" onclick="window.stepIngredientVal('${escapeHtml(recipeName)}', ${idx}, ${ingIdx}, +${step})">+</button>
            <span class="ing-unit-tag">${unit}</span>
            <button type="button" class="btn-del-ing" title="Supprimer cet ingrédient" onclick="window.removeIngredientFromRecipe('${escapeHtml(recipeName)}', ${idx}, ${ingIdx})">✕</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Mise à jour de la valeur d'un ingrédient
  window.onIngredientInputChange = function(recipeName, cardIdx, ingIdx, newVal, unit) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;

    const val = parseFloat(newVal) || 0;
    const oldLine = recipe.greyCorner.tech[ingIdx];
    if (!oldLine) return;

    const parts = oldLine.split(':');
    const ingName = parts[0].trim();
    recipe.greyCorner.tech[ingIdx] = `${ingName} : ${val} ${unit}`;

    // Enregistrer dans editedRecipes
    editedRecipes[recipeName] = {
      tech: recipe.greyCorner.tech
    };

    // Recalculer le coût
    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.greyCorner.breakdown = costObj.breakdown;

    // Recalculer l'écart vs standard
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    // Mettre à jour l'affichage de la carte
    updateCardMetrics(cardIdx, recipe);
    renderSummaryKPIs();
  };

  // Mise à jour du nom d'un ingrédient
  window.updateIngredientName = function(recipeName, cardIdx, ingIdx, newName) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;

    const oldLine = recipe.greyCorner.tech[ingIdx];
    if (!oldLine) return;

    const parts = oldLine.split(':');
    const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';
    recipe.greyCorner.tech[ingIdx] = `${newName.trim()} : ${qtyStr}`;

    editedRecipes[recipeName] = {
      tech: recipe.greyCorner.tech
    };

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;

    updateCardMetrics(cardIdx, recipe);
    renderSummaryKPIs();
  };

  // Pas d'incrément (+ / -)
  window.stepIngredientVal = function(recipeName, cardIdx, ingIdx, delta) {
    const editor = document.getElementById(`editor-${cardIdx}`);
    if (!editor) return;

    const input = editor.querySelectorAll('.ing-num-input')[ingIdx];
    if (!input) return;

    let current = parseFloat(input.value) || 0;
    let next = Math.max(0, Math.round((current + delta) * 10) / 10);
    input.value = next;
    const unit = input.getAttribute('data-unit') || 'g';
    window.onIngredientInputChange(recipeName, cardIdx, ingIdx, next, unit);
  };

  // Ajouter un ingrédient
  window.addIngredientToRecipe = function(recipeName, cardIdx) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;

    const ingName = prompt("Nom du nouvel ingrédient :", "Nouvel Ingrédient");
    if (!ingName || !ingName.trim()) return;

    const qty = prompt("Quantité (ex: 50 g, 100 ml, 1 p) :", "50 g");
    if (!qty || !qty.trim()) return;

    recipe.greyCorner.tech.push(`${ingName.trim()} : ${qty.trim()}`);
    editedRecipes[recipeName] = {
      tech: recipe.greyCorner.tech
    };

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    renderRecipeCards();
    renderSummaryKPIs();
    showToast(`➕ Ingrédient ajouté à ${recipeName}`);
  };

  // Supprimer un ingrédient
  window.removeIngredientFromRecipe = function(recipeName, cardIdx, ingIdx) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;

    if (recipe.greyCorner.tech.length <= 1) {
      alert("Une recette doit contenir au moins un ingrédient.");
      return;
    }

    recipe.greyCorner.tech.splice(ingIdx, 1);
    editedRecipes[recipeName] = {
      tech: recipe.greyCorner.tech
    };

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    renderRecipeCards();
    renderSummaryKPIs();
    showToast(`🗑️ Ingrédient supprimé de ${recipeName}`);
  };

  // Copier le standard international
  window.copyStandardToRecipe = function(recipeName, cardIdx) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;

    recipe.greyCorner.tech = JSON.parse(JSON.stringify(recipe.standard.tech));
    editedRecipes[recipeName] = {
      tech: recipe.greyCorner.tech
    };

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = 0;

    renderRecipeCards();
    renderSummaryKPIs();
    showToast(`🟢 Standard international copié sur ${recipeName}`);
  };

  // Rétablir la fiche d'origine
  window.resetRecipeToInitial = function(recipeName, cardIdx) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;

    delete editedRecipes[recipeName];
    recipe.greyCorner.tech = JSON.parse(JSON.stringify(recipe.initialTech));

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    renderRecipeCards();
    renderSummaryKPIs();
    showToast(`🔄 Fiche d'origine rétablie pour ${recipeName}`);
  };

  // Mise à jour ciblée des chiffres d'une carte
  function updateCardMetrics(cardIdx, recipe) {
    const costEl = document.getElementById(`gc-cost-${cardIdx}`);
    const fcEl = document.getElementById(`gc-fc-${cardIdx}`);
    const marginEl = document.getElementById(`gc-margin-${cardIdx}`);

    if (costEl) costEl.textContent = `${recipe.greyCorner.cost.toFixed(2)} DH`;
    if (fcEl) {
      fcEl.textContent = `${recipe.greyCorner.foodCost.toFixed(1)} %`;
      fcEl.className = `badge ${recipe.greyCorner.foodCost <= 28 ? 'badge-ok' : (recipe.greyCorner.foodCost <= 38 ? 'badge-warn' : 'badge-danger')}`;
    }
    if (marginEl) marginEl.textContent = `+${recipe.greyCorner.grossMarginDH.toFixed(2)} DH`;
  }

  // Filtrage par catégorie
  window.setComparatorCategory = function(cat) {
    currentCategory = cat;
    renderCategoriesBar();
    renderRecipeCards();
  };

  // Toast Notification
  function showToast(msg) {
    let toast = document.getElementById('comp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'comp-toast';
      toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:#0f172a; color:#fff; padding:14px 22px; border-radius:12px; font-weight:700; font-size:14px; box-shadow:0 8px 24px rgba(0,0,0,0.3); z-index:9999; display:flex; align-items:center; gap:10px; transition:all 0.3s ease; border:1px solid #334155;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 3200);
  }

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
    showToast("📥 Export Excel généré avec succès !");
  };

  // Exporter la configuration mise à jour pour recipes-data.js
  window.exportUpdatedRecipesDataJS = function() {
    const rawData = window.CATEGORIES_DATA || window.DATA || [];
    const cloned = JSON.parse(JSON.stringify(rawData));

    cloned.forEach(cat => {
      (cat.items || []).forEach(item => {
        if (editedRecipes[item.name] && editedRecipes[item.name].tech) {
          item.tech = editedRecipes[item.name].tech;
          const sellPrice = parseFloat(String(item.price || item.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
          const costObj = window.calculateRecipeFoodCost(item.tech, sellPrice);
          item.cost = costObj.cost;
          item.foodCost = costObj.foodCost;
          item.margin = costObj.margin;
          item.grossMarginDH = costObj.grossMarginDH;
        }
      });
    });

    // Sauvegarder aussi en local
    saveEdits();

    const jsContent = `// ========================================================\n// GREY CORNER — FICHES TECHNIQUES CENTRALISÉES (DATA)\n// Mis à jour le ${new Date().toLocaleString('fr-FR')}\n// ========================================================\n\nconst DATA = ${JSON.stringify(cloned, null, 2)};\n\nif (typeof window !== 'undefined') {\n  window.DATA = DATA;\n  window.CATEGORIES_DATA = DATA;\n}\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = { DATA };\n}\n`;

    const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipes-data-updated-${new Date().toISOString().slice(0,10)}.js`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📁 Fichier JavaScript prêt pour recipes-data.js téléchargé !");
  };

  // Initialisation au chargement
  document.addEventListener('DOMContentLoaded', () => {
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
      saveAllBtn.addEventListener('click', saveEdits);
    }
  });

  // Export pour scripts

})();
