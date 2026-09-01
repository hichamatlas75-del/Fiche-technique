/**
 * GREY CORNER — Logique du Comparateur & Optimiseur "Juste Milieu"
 * Comparaison côte-à-côte : Fiche Initiale vs Standard International vs Réglage Juste Milieu
 */

(function() {
  'use strict';

  // État local de l'application
  let allRecipes = [];
  let customAdjustments = {}; // Clé: nomRecette -> { tech: [...], customCost: X, customFC: Y, customMargin: Z }
  let currentCategory = 'ALL';
  let searchQuery = '';
  let onlyGainsFilter = false;

  const STORAGE_KEY = 'grey_corner_juste_milieu_v1';

  // Chargement des ajustements sauvegardés
  function loadSavedAdjustments() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        customAdjustments = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Impossible de charger les ajustements sauvegardés", e);
    }
  }

  // Sauvegarde des ajustements
  function saveAdjustments() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customAdjustments));
      showToast("💾 Ajustements 'Juste Milieu' sauvegardés avec succès !");
    } catch (e) {
      console.error("Erreur lors de la sauvegarde", e);
    }
  }

  // Initialisation des données
  function initData() {
    loadSavedAdjustments();
    allRecipes = [];

    const data = window.CATEGORIES_DATA || window.DATA || [];
    data.forEach(cat => {
      const catName = cat.category || 'AUTRE';
      (cat.items || []).forEach(item => {
        const initialTech = item.tech || [];
        const sellPrice = parseFloat(String(item.price || item.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
        
        // 1. Calcul Fiche Initiale (Actuelle)
        const initialCostObj = window.calculateRecipeFoodCost(initialTech, sellPrice);

        // 2. Fiche Proposée (Standard International)
        const proposedObj = window.getProposedStandard(item.name, { category: catName, tech: initialTech });
        const proposedTech = proposedObj ? proposedObj.tech : initialTech;
        const proposedCostObj = window.calculateRecipeFoodCost(proposedTech, sellPrice);
        const rationale = proposedObj ? proposedObj.rationale : "Portion standardisée selon les ratios F&B internationaux.";

        // 3. Fiche "Juste Milieu" (Personnalisée ou 50/50 par défaut)
        let customTech;
        if (customAdjustments[item.name] && customAdjustments[item.name].tech) {
          customTech = customAdjustments[item.name].tech;
        } else {
          // Créer le 50/50 par défaut entre Initial et Proposé
          customTech = createMiddleGroundTech(initialTech, proposedTech);
          customAdjustments[item.name] = {
            tech: customTech
          };
        }
        const customCostObj = window.calculateRecipeFoodCost(customTech, sellPrice);

        allRecipes.push({
          category: catName,
          name: item.name,
          image: item.image || (item.images ? item.images.split(',')[0] : null),
          sellPrice: sellPrice,
          initial: {
            tech: initialTech,
            cost: initialCostObj.cost,
            foodCost: initialCostObj.foodCost,
            margin: initialCostObj.margin,
            grossMarginDH: initialCostObj.grossMarginDH,
            breakdown: initialCostObj.breakdown
          },
          proposed: {
            tech: proposedTech,
            rationale: rationale,
            cost: proposedCostObj.cost,
            foodCost: proposedCostObj.foodCost,
            margin: proposedCostObj.margin,
            grossMarginDH: proposedCostObj.grossMarginDH,
            breakdown: proposedCostObj.breakdown,
            savingsDH: Math.round((initialCostObj.cost - proposedCostObj.cost) * 100) / 100
          },
          custom: {
            tech: customTech,
            cost: customCostObj.cost,
            foodCost: customCostObj.foodCost,
            margin: customCostObj.margin,
            grossMarginDH: customCostObj.grossMarginDH,
            breakdown: customCostObj.breakdown,
            savingsDH: Math.round((initialCostObj.cost - customCostObj.cost) * 100) / 100
          }
        });
      });
    });

    renderCategoriesBar();
    renderSummaryKPIs();
    renderRecipeCards();
  }

  /**
   * Crée un compromis "Juste Milieu" à 50% entre la fiche initiale et la fiche proposée
   */
  function createMiddleGroundTech(initialTech, proposedTech) {
    const result = [];
    const propMap = {};

    proposedTech.forEach(line => {
      const parts = line.split(':');
      const ing = parts[0].trim();
      const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';
      propMap[ing.toLowerCase()] = { orig: line, ing: ing, qtyStr: qtyStr };
    });

    initialTech.forEach(line => {
      const parts = line.split(':');
      const ing = parts[0].trim();
      const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';
      const propMatch = propMap[ing.toLowerCase()];

      if (propMatch) {
        // Calculer la moyenne
        const gMatch1 = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
        const gMatch2 = propMatch.qtyStr.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);

        const mlMatch1 = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);
        const mlMatch2 = propMatch.qtyStr.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);

        if (gMatch1 && gMatch2) {
          const v1 = parseFloat(gMatch1[1].replace(',', '.'));
          const v2 = parseFloat(gMatch2[1].replace(',', '.'));
          const avg = Math.round((v1 + v2) / 2);
          result.push(`${ing} : ${avg} g`);
        } else if (mlMatch1 && mlMatch2) {
          const v1 = parseFloat(mlMatch1[1].replace(',', '.'));
          const v2 = parseFloat(mlMatch2[1].replace(',', '.'));
          const avg = Math.round((v1 + v2) / 2);
          result.push(`${ing} : ${avg} ml`);
        } else {
          result.push(line);
        }
      } else {
        result.push(line);
      }
    });

    return result;
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
    let sumInitialCost = 0;
    let sumProposedCost = 0;
    let sumCustomCost = 0;
    let sumPrice = 0;

    allRecipes.forEach(r => {
      sumInitialCost += r.initial.cost;
      sumProposedCost += r.proposed.cost;
      sumCustomCost += r.custom.cost;
      sumPrice += r.sellPrice;
    });

    const avgInitialFC = sumPrice > 0 ? (sumInitialCost / sumPrice * 100).toFixed(1) : 0;
    const avgProposedFC = sumPrice > 0 ? (sumProposedCost / sumPrice * 100).toFixed(1) : 0;
    const avgCustomFC = sumPrice > 0 ? (sumCustomCost / sumPrice * 100).toFixed(1) : 0;

    const avgProposedGain = totalItems > 0 ? ((sumInitialCost - sumProposedCost) / totalItems).toFixed(2) : 0;
    const avgCustomGain = totalItems > 0 ? ((sumInitialCost - sumCustomCost) / totalItems).toFixed(2) : 0;

    // Projection mensuelle estimée (sur base 3000 couverts/mois moyenne)
    const monthlyCustomEstimate = Math.round((sumInitialCost - sumCustomCost) / (totalItems || 1) * 3500);

    const kpiEl = document.getElementById('summary-kpis');
    if (kpiEl) {
      kpiEl.innerHTML = `
        <div class="kpi-card">
          <div class="kpi-label">Plats Analysés</div>
          <div class="kpi-value text-accent">${totalItems}</div>
          <div class="kpi-sub">Fiches techniques actives</div>
        </div>
        <div class="kpi-card initial-theme">
          <div class="kpi-label">Food Cost Moyen Actuel</div>
          <div class="kpi-value text-danger">${avgInitialFC} %</div>
          <div class="kpi-sub">Portions très généreuses</div>
        </div>
        <div class="kpi-card standard-theme">
          <div class="kpi-label">Food Cost Standard Int.</div>
          <div class="kpi-value text-success">${avgProposedFC} %</div>
          <div class="kpi-sub">Gain brut : +${avgProposedGain} DH / plat</div>
        </div>
        <div class="kpi-card custom-theme">
          <div class="kpi-label">Food Cost "Juste Milieu"</div>
          <div class="kpi-value text-purple">${avgCustomFC} %</div>
          <div class="kpi-sub">Gain brut : +${avgCustomGain} DH / plat</div>
        </div>
        <div class="kpi-card gain-theme">
          <div class="kpi-label">Économie Mensuelle Estimée</div>
          <div class="kpi-value text-gold">+${monthlyCustomEstimate.toLocaleString('fr-FR')} DH</div>
          <div class="kpi-sub">Sans impacter la satisfaction client</div>
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
        r.initial.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchGains = !onlyGainsFilter || r.proposed.savingsDH >= 3.0;
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

  // Génération du code HTML d'une carte comparative 3-colonnes
  function createRecipeComparativeCardHTML(recipe, idx) {
    const initFCClass = recipe.initial.foodCost <= 25 ? 'badge-ok' : (recipe.initial.foodCost <= 35 ? 'badge-warn' : 'badge-danger');
    const propFCClass = recipe.proposed.foodCost <= 25 ? 'badge-ok' : (recipe.proposed.foodCost <= 35 ? 'badge-warn' : 'badge-danger');
    const custFCClass = recipe.custom.foodCost <= 25 ? 'badge-ok' : (recipe.custom.foodCost <= 35 ? 'badge-warn' : 'badge-danger');

    const gainBadge = recipe.custom.savingsDH > 0 
      ? `<span class="badge-gain">+${recipe.custom.savingsDH.toFixed(2)} DH / portion d'économie</span>`
      : `<span class="badge-neutral">Marge équivalente</span>`;

    return `
      <div class="comparative-card" id="card-${idx}" data-recipe-name="${escapeHtml(recipe.name)}">
        <!-- HEADER DU PLAT -->
        <div class="card-top-bar">
          <div class="card-title-group">
            <span class="cat-tag">${recipe.category}</span>
            <h3 class="dish-title">${recipe.name}</h3>
          </div>
          <div class="card-price-group">
            <span class="sell-price-tag">${recipe.sellPrice} DH</span>
            ${gainBadge}
          </div>
        </div>

        <!-- GRILLE COMPARATIVE 3 COLONNES -->
        <div class="comparison-tri-grid">
          
          <!-- COLONNE 1 : INITIALE (ACTUELLE) -->
          <div class="col-box col-initial">
            <div class="col-header">
              <span class="col-dot dot-red"></span>
              <h4>1. Fiche Initiale (Généreuse)</h4>
            </div>
            
            <ul class="tech-list">
              ${recipe.initial.tech.map(line => `<li>${escapeHtml(line)}</li>`).join('')}
            </ul>

            <div class="col-finances">
              <div class="fin-row">
                <span>Coût Portion :</span>
                <strong>${recipe.initial.cost.toFixed(2)} DH</strong>
              </div>
              <div class="fin-row">
                <span>Food Cost :</span>
                <span class="badge ${initFCClass}">${recipe.initial.foodCost.toFixed(1)} %</span>
              </div>
              <div class="fin-row">
                <span>Marge Brute :</span>
                <strong>${recipe.initial.grossMarginDH.toFixed(2)} DH</strong>
              </div>
            </div>
          </div>

          <!-- COLONNE 2 : PROPOSÉE (STANDARD INT.) -->
          <div class="col-box col-proposed">
            <div class="col-header">
              <span class="col-dot dot-green"></span>
              <h4>2. Standard International</h4>
            </div>

            <ul class="tech-list">
              ${recipe.proposed.tech.map(line => `<li>${escapeHtml(line)}</li>`).join('')}
            </ul>

            <div class="rationale-box">
              💡 <em>${escapeHtml(recipe.proposed.rationale)}</em>
            </div>

            <div class="col-finances">
              <div class="fin-row">
                <span>Coût Portion :</span>
                <strong class="text-success">${recipe.proposed.cost.toFixed(2)} DH</strong>
              </div>
              <div class="fin-row">
                <span>Food Cost :</span>
                <span class="badge ${propFCClass}">${recipe.proposed.foodCost.toFixed(1)} %</span>
              </div>
              <div class="fin-row">
                <span>Gain / Plat :</span>
                <strong class="text-success">+${recipe.proposed.savingsDH.toFixed(2)} DH</strong>
              </div>
            </div>
          </div>

          <!-- COLONNE 3 : JUSTE MILIEU (INTERACTIF & MODIFIABLE) -->
          <div class="col-box col-custom">
            <div class="col-header">
              <span class="col-dot dot-purple"></span>
              <h4>3. ⚖️ Votre "Juste Milieu"</h4>
            </div>

            <!-- FORMULAIRE INTERACTIF DES INGRÉDIENTS -->
            <div class="custom-ingredients-editor" id="editor-${idx}">
              ${renderCustomInputsHTML(recipe.custom.tech, recipe.name, idx)}
            </div>

            <!-- BOUTONS D'ACTION RAPIDE -->
            <div class="quick-preset-actions">
              <button class="btn-preset" title="Mettre la moyenne exacte 50/50" onclick="window.applyMiddleGroundPreset('${escapeHtml(recipe.name)}', ${idx})">⚡ 50/50</button>
              <button class="btn-preset" title="Copier la fiche internationale" onclick="window.copyStandardPreset('${escapeHtml(recipe.name)}', ${idx})">🟢 Standard</button>
              <button class="btn-preset" title="Rétablir la fiche initiale" onclick="window.copyInitialPreset('${escapeHtml(recipe.name)}', ${idx})">🔴 Actuel</button>
            </div>

            <div class="col-finances fin-custom">
              <div class="fin-row">
                <span>Coût Portion :</span>
                <strong id="cust-cost-${idx}" class="text-purple">${recipe.custom.cost.toFixed(2)} DH</strong>
              </div>
              <div class="fin-row">
                <span>Food Cost :</span>
                <span id="cust-fc-${idx}" class="badge ${custFCClass}">${recipe.custom.foodCost.toFixed(1)} %</span>
              </div>
              <div class="fin-row">
                <span>Gain vs Actuel :</span>
                <strong id="cust-gain-${idx}" class="text-success">+${recipe.custom.savingsDH.toFixed(2)} DH</strong>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // Génération des champs de saisie pour chaque ingrédient
  function renderCustomInputsHTML(techArray, recipeName, idx) {
    return techArray.map((line, ingIdx) => {
      const parts = line.split(':');
      const ing = parts[0].trim();
      const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';

      const gMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
      const mlMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);
      const pMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*(?:p|piece|tranche|part|boule|sachet|portion|tr)\b/i);

      let numVal = 1;
      let unit = 'p';

      if (gMatch) {
        numVal = parseFloat(gMatch[1].replace(',', '.'));
        unit = 'g';
      } else if (mlMatch) {
        numVal = parseFloat(mlMatch[1].replace(',', '.'));
        unit = 'ml';
      } else if (pMatch) {
        numVal = parseFloat(pMatch[1].replace(',', '.'));
        unit = 'p';
      } else {
        numVal = parseFloat(qtyStr.replace(/[^0-9.]/g, '')) || 1;
      }

      const step = unit === 'p' ? 0.5 : 5;

      return `
        <div class="ing-edit-row">
          <label class="ing-label" title="${escapeHtml(ing)}">${escapeHtml(ing)}</label>
          <div class="ing-input-wrap">
            <button type="button" class="btn-step" onclick="window.stepIngredientVal('${escapeHtml(recipeName)}', ${idx}, ${ingIdx}, -${step})">-</button>
            <input type="number" 
                   class="ing-num-input" 
                   value="${numVal}" 
                   step="${step}" 
                   min="0"
                   data-ing-name="${escapeHtml(ing)}"
                   data-ing-unit="${unit}"
                   oninput="window.onCustomIngredientChange('${escapeHtml(recipeName)}', ${idx})" />
            <span class="unit-tag">${unit}</span>
            <button type="button" class="btn-step" onclick="window.stepIngredientVal('${escapeHtml(recipeName)}', ${idx}, ${ingIdx}, ${step})">+</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Échappement HTML sécurisé
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Mise à jour de la valeur d'un ingrédient (+ / -)
  window.stepIngredientVal = function(recipeName, cardIdx, ingIdx, delta) {
    const editor = document.getElementById(`editor-${cardIdx}`);
    if (!editor) return;
    const inputs = editor.querySelectorAll('.ing-num-input');
    if (inputs[ingIdx]) {
      let currentVal = parseFloat(inputs[ingIdx].value) || 0;
      currentVal = Math.max(0, currentVal + delta);
      inputs[ingIdx].value = currentVal;
      window.onCustomIngredientChange(recipeName, cardIdx);
    }
  };

  // Gestion du changement de valeur en direct
  window.onCustomIngredientChange = function(recipeName, cardIdx) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;

    const editor = document.getElementById(`editor-${cardIdx}`);
    if (!editor) return;

    const inputs = editor.querySelectorAll('.ing-num-input');
    const newTech = [];

    inputs.forEach(inp => {
      const ing = inp.getAttribute('data-ing-name');
      const unit = inp.getAttribute('data-ing-unit');
      const val = parseFloat(inp.value) || 0;
      newTech.push(`${ing} : ${val} ${unit}`);
    });

    // Recalculer le coût
    const customCostObj = window.calculateRecipeFoodCost(newTech, recipe.sellPrice);
    recipe.custom = {
      tech: newTech,
      cost: customCostObj.cost,
      foodCost: customCostObj.foodCost,
      margin: customCostObj.margin,
      grossMarginDH: customCostObj.grossMarginDH,
      breakdown: customCostObj.breakdown,
      savingsDH: Math.round((recipe.initial.cost - customCostObj.cost) * 100) / 100
    };

    // Mémoriser dans l'état
    customAdjustments[recipeName] = {
      tech: newTech
    };

    // Mettre à jour l'affichage financier de la carte
    const costEl = document.getElementById(`cust-cost-${cardIdx}`);
    const fcEl = document.getElementById(`cust-fc-${cardIdx}`);
    const gainEl = document.getElementById(`cust-gain-${cardIdx}`);

    if (costEl) costEl.textContent = `${recipe.custom.cost.toFixed(2)} DH`;
    if (fcEl) {
      fcEl.textContent = `${recipe.custom.foodCost.toFixed(1)} %`;
      const custFCClass = recipe.custom.foodCost <= 25 ? 'badge-ok' : (recipe.custom.foodCost <= 35 ? 'badge-warn' : 'badge-danger');
      fcEl.className = `badge ${custFCClass}`;
    }
    if (gainEl) {
      const isPositive = recipe.custom.savingsDH >= 0;
      gainEl.textContent = `${isPositive ? '+' : ''}${recipe.custom.savingsDH.toFixed(2)} DH`;
      gainEl.className = isPositive ? 'text-success' : 'text-danger';
    }

    renderSummaryKPIs();
  };

  // Presets
  window.applyMiddleGroundPreset = function(recipeName, cardIdx) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;
    const midTech = createMiddleGroundTech(recipe.initial.tech, recipe.proposed.tech);
    updateCardWithNewTech(recipe, cardIdx, midTech);
  };

  window.copyStandardPreset = function(recipeName, cardIdx) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;
    updateCardWithNewTech(recipe, cardIdx, [...recipe.proposed.tech]);
  };

  window.copyInitialPreset = function(recipeName, cardIdx) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;
    updateCardWithNewTech(recipe, cardIdx, [...recipe.initial.tech]);
  };

  function updateCardWithNewTech(recipe, cardIdx, newTech) {
    const editor = document.getElementById(`editor-${cardIdx}`);
    if (!editor) return;

    editor.innerHTML = renderCustomInputsHTML(newTech, recipe.name, cardIdx);
    window.onCustomIngredientChange(recipe.name, cardIdx);
  }

  // Filtrage par catégorie
  window.setComparatorCategory = function(cat) {
    currentCategory = cat;
    renderCategoriesBar();
    renderRecipeCards();
  };

  // Toast notification
  function showToast(msg) {
    let toast = document.getElementById('comp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'comp-toast';
      toast.className = 'comp-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // Export Excel / CSV de la comparaison
  window.exportComparisonToExcel = function() {
    if (typeof XLSX === 'undefined') {
      alert("La librairie SheetJS n'est pas encore chargée.");
      return;
    }

    const rows = [];
    rows.push([
      "Catégorie", "Nom du Plat", "Prix de Vente (DH)",
      "Coût Actuel (DH)", "Food Cost Actuel (%)", "Marge Actuelle (DH)", "Fiche Initiale (Ingrédients)",
      "Coût Standard (DH)", "Food Cost Standard (%)", "Gain Standard / Plat (DH)", "Fiche Standard (Ingrédients)",
      "Coût Juste Milieu (DH)", "Food Cost Juste Milieu (%)", "Gain Juste Milieu / Plat (DH)", "Fiche Juste Milieu (Ingrédients)"
    ]);

    allRecipes.forEach(r => {
      rows.push([
        r.category,
        r.name,
        r.sellPrice,
        r.initial.cost,
        r.initial.foodCost,
        r.initial.grossMarginDH,
        r.initial.tech.join(' | '),
        r.proposed.cost,
        r.proposed.foodCost,
        r.proposed.savingsDH,
        r.proposed.tech.join(' | '),
        r.custom.cost,
        r.custom.foodCost,
        r.custom.savingsDH,
        r.custom.tech.join(' | ')
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Comparatif Fiches Techniques");
    XLSX.writeFile(wb, `GreyCorner_Comparatif_Juste_Milieu_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast("📥 Export Excel généré avec succès !");
  };

  // Exporter la configuration mise à jour pour recipes-data.js
  window.exportUpdatedRecipesDataJS = function() {
    const rawData = window.CATEGORIES_DATA || window.DATA || [];
    const cloned = JSON.parse(JSON.stringify(rawData));

    cloned.forEach(cat => {
      (cat.items || []).forEach(item => {
        if (customAdjustments[item.name] && customAdjustments[item.name].tech) {
          item.tech = customAdjustments[item.name].tech;
          const sellPrice = parseFloat(String(item.price || item.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
          const costObj = window.calculateRecipeFoodCost(item.tech, sellPrice);
          item.cost = costObj.cost;
          item.foodCost = costObj.foodCost;
          item.margin = costObj.margin;
          item.grossMarginDH = costObj.grossMarginDH;
        }
      });
    });

    const blob = new Blob([
      "// Fichier exporté avec les fiches techniques ajustées 'Juste Milieu'\n",
      "const JUSTE_MILIEU_DATA = " + JSON.stringify(cloned, null, 2) + ";\n"
    ], { type: 'application/javascript;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipes-data-juste-milieu-${new Date().toISOString().slice(0,10)}.js`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📤 Fichier JavaScript 'Juste Milieu' exporté !");
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
      saveAllBtn.addEventListener('click', saveAdjustments);
    }
  });

  // Export pour scripts
  window.saveComparatorAdjustments = saveAdjustments;

})();
