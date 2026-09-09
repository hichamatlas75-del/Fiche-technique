/**
 * GREY CORNER — État Global, Chargement & Calculs Fondamentaux
 * Module: comp-core.js
 */


  // État local de l'application
var allRecipes = [];
var editedRecipes = {}; // Clé: nomRecette -> { tech: [...] }
var currentCategory = 'ALL';
var searchQuery = '';
var onlyGainsFilter = false;
var hasUnsavedChanges = false; // AM-03: suivi des modifications non sauvegardées

  const STORAGE_KEY = window.GC_STORAGE_KEYS.COMP_EDITS;

  // AM-03 FIX : Avertissement avant fermeture si modifications non sauvegardées
  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = 'Des modifications non sauvegardées seront perdues. Continuer ?';
    }
  });



  // Chargement des modifications enregistrées localement
  function loadSavedEdits() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        editedRecipes = JSON.parse(saved);
        window.editedRecipes = editedRecipes;
        hasUnsavedChanges = false; // données chargées = pas de modifications pendantes
      }
    } catch (e) {
      console.warn("Impossible de charger les fiches sauvegardées", e);
    }
  }

  // Sauvegarde globale & synchronisation universelle
  function saveEdits(isManualSave = true) {
    // AM-03: marquer comme modifié si auto-save (pas encore confirmé par l'utilisateur)
    if (!isManualSave) hasUnsavedChanges = true;
    try {
      if (window.editedRecipes) editedRecipes = window.editedRecipes;
      window.editedRecipes = editedRecipes;
      // 1. Sauvegarder dans STORAGE_KEY (mémoire locale du comparateur)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editedRecipes));

      // 2. Synchroniser dans gc_recipes_db_v5 (utilisé par Cuisine et Déstockage)
var baseList = [];
      const rawV5 = localStorage.getItem(window.GC_STORAGE_KEYS.RECIPES);
      if (rawV5) {
        try { baseList = JSON.parse(rawV5); } catch(e) {}
      }
      if (!baseList || baseList.length === 0) {
        baseList = JSON.parse(JSON.stringify(window.BASE_RECIPES || []));
      }

      const cleanMap = new Map();
      baseList.forEach(r => {
        if (r && r.name) cleanMap.set(cleanText(r.name), r);
      });

      Object.keys(editedRecipes).forEach(name => {
        const item = editedRecipes[name];
        if (!item || !Array.isArray(item.tech)) return;
        const cName = cleanText(name);
        var r = cleanMap.get(cName);
        if (!r) {
          const simp = cName.replace(/^(?:pizza|pasta|plat|sandwich|panini)\s+/, '').trim();
          r = cleanMap.get(simp);
        }
        if (r) {
          r.tech = item.tech.slice();
          r.ingredients = item.tech.slice();
          if (typeof item.sellPrice === 'number' && item.sellPrice > 0) {
            r.sellPrice = item.sellPrice;
            r.price = item.sellPrice + ' DH';
          }
          if (typeof window.calculateRecipeFoodCost === 'function') {
            const calc = window.calculateRecipeFoodCost(r.tech, r.sellPrice || 0);
            r.cost = calc.cost;
            r.foodCost = calc.foodCost;
            r.margin = calc.margin;
            r.grossMarginDH = calc.grossMarginDH;
          }
        }
      });

      localStorage.setItem(window.GC_STORAGE_KEYS.RECIPES, JSON.stringify(baseList));
      const dbVer = (typeof window.RECIPES_DB_VERSION !== 'undefined') ? window.RECIPES_DB_VERSION : 'v8.2_20260907';
      localStorage.setItem('gc_recipes_db_version', dbVer);

      // 3. Mettre à jour window.DATA et window.CATEGORIES_DATA en mémoire
      const allData = window.CATEGORIES_DATA || window.DATA || [];
      allData.forEach(cat => {
        (cat.items || []).forEach(it => {
          if (it && it.name) {
            const userEdit = editedRecipes[it.name] || editedRecipes[cleanText(it.name)];
            if (userEdit) {
              if (Array.isArray(userEdit.tech)) it.tech = userEdit.tech.slice();
              if (typeof userEdit.sellPrice === 'number' && userEdit.sellPrice > 0) {
                it.sellPrice = userEdit.sellPrice;
                it.price = userEdit.sellPrice + ' DH';
              }
              if (typeof window.calculateRecipeFoodCost === 'function') {
                const calc = window.calculateRecipeFoodCost(it.tech, it.sellPrice || 0);
                it.cost = calc.cost;
                it.foodCost = calc.foodCost;
                it.margin = calc.margin;
                it.grossMarginDH = calc.grossMarginDH;
              }
            }
          }
        });
      });

      // 4. Émettre les signaux de synchronisation temps réel inter-onglets
      try {
        localStorage.setItem('gc_sync_ping', Date.now().toString());
        window.dispatchEvent(new CustomEvent('gc:recipe-updated', { detail: { action: 'save' } }));
      } catch (e) {}

      // AM-03: marquer comme sauvegardé
      hasUnsavedChanges = false;

      if (isManualSave) {
        // AM-02 FIX : Toast non bloquant
        if (window.GC_Toast) {
          window.GC_Toast.show('Fiches techniques enregistrées avec succès !', 'success');
        } else {
          window.GC_Toast.show("💾 Fiches techniques enregistrées avec succès !", 'success');
        }
        const btn = document.getElementById('btn-save-all');
        if (btn) {
          const origHTML = btn.innerHTML;
          btn.innerHTML = "✅ Fiches Enregistrées !";
          btn.style.background = "#059669";
          setTimeout(() => {
            btn.innerHTML = origHTML;
            btn.style.background = "#16a34a";
          }, 3000);
        }
      }
    } catch (e) {
      console.error("Erreur lors de la sauvegarde locale", e);
      if (isManualSave) {
        if (window.GC_Toast) {
          window.GC_Toast.show("Erreur de sauvegarde : " + e.message, 'error');
        } else {
          window.GC_Toast.show("❌ Erreur de sauvegarde : " + e.message, 'error');
        }
      }
    }
  }

  // Exposer globalement pour exécution directe
  window.saveEdits = saveEdits;
  window.saveAllEdits = () => saveEdits(true);

  // Chargement des prix personnalisés des matières premières
  function loadCustomIngredientPrices() {
    try {
      const saved = localStorage.getItem(window.GC_STORAGE_KEYS.PRICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        const obsolete = window.OBSOLETE_INGREDIENT_KEYS;
        obsolete.forEach(k => { delete parsed[k]; if (window.INGREDIENT_UNIT_COSTS) delete window.INGREDIENT_UNIT_COSTS[k]; });
        if (!window.INGREDIENT_UNIT_COSTS) window.INGREDIENT_UNIT_COSTS = {};
        Object.assign(window.INGREDIENT_UNIT_COSTS, parsed);
      }
    } catch (e) {
      console.warn("Erreur chargement prix personnalisés", e);
    }
  }

  // Initialisation des données
  function initData() {
    loadCustomIngredientPrices();
    loadSavedEdits();
    allRecipes = [];

    // Nettoyage automatique des anciennes clés ambiguës non préfixées
    const legacyAmbiguousKeys = ['FRUITS DE MER', 'SAUMON', 'THON', 'POULET', 'VIANDE HACHÉE', '5 FROMAGES', 'CARBONARA', 'BOLOGNAISE', 'VÉGÉTARIEN', 'VÉGÉTARIENNE'];
    legacyAmbiguousKeys.forEach(k => {
      if (editedRecipes[k]) delete editedRecipes[k];
    });

    // Charger les exclusions de fiches supprimées
    let deletedSet = new Set();
    try {
      const deletedList = JSON.parse(localStorage.getItem(window.GC_STORAGE_KEYS.DELETED) || '[]');
      deletedSet = new Set(deletedList.map(x => String(x).toLowerCase().trim()));
    } catch(e) {}

    // Synchronisation avec gc_recipes_db_v5 (fiches modifiées ou créées dans Déstockage)
    let dbV5Recipes = [];
    try {
      const rawV5 = localStorage.getItem(window.GC_STORAGE_KEYS.RECIPES);
      if (rawV5) dbV5Recipes = JSON.parse(rawV5);
    } catch(e) {}

    const dbV5Map = new Map();
    dbV5Recipes.forEach(r => {
      if (r && r.name) dbV5Map.set(cleanText(r.name), r);
    });

    // Créer un index normalisé des modifications enregistrées
    const cleanEditsMap = new Map();
    Object.keys(editedRecipes).forEach(k => {
      cleanEditsMap.set(cleanText(k), editedRecipes[k]);
    });

    const data = window.CATEGORIES_DATA || window.DATA || [];
    const processedRecipeNames = new Set();

    data.forEach(cat => {
      const catName = cat.category || 'AUTRE';
      (cat.items || []).forEach(item => {
        const cTarget = cleanText(item.name);
        if (deletedSet.has(cTarget) || (item.id && deletedSet.has(String(item.id).toLowerCase()))) return;
        processedRecipeNames.add(cTarget);

        const initialTech = JSON.parse(JSON.stringify(item.tech || []));
        var sellPrice = parseFloat(String(item.price || item.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
        
        // Fiche Grey Corner (priorité aux edits locaux, puis base Déstockage)
        const userEdit = editedRecipes[item.name] || cleanEditsMap.get(cTarget);
        const destockRecipe = dbV5Map.get(cTarget);

        if (userEdit && typeof userEdit.sellPrice === 'number' && userEdit.sellPrice > 0) {
          sellPrice = userEdit.sellPrice;
        } else if (destockRecipe && typeof destockRecipe.sellPrice === 'number' && destockRecipe.sellPrice > 0) {
          sellPrice = destockRecipe.sellPrice;
        }

        let currentTech = initialTech;
        if (userEdit && Array.isArray(userEdit.tech) && userEdit.tech.length > 0) {
          currentTech = userEdit.tech.slice();
        } else if (destockRecipe && Array.isArray(destockRecipe.ingredients) && destockRecipe.ingredients.length > 0) {
          currentTech = destockRecipe.ingredients.slice();
        }

        const gcCostObj = window.calculateRecipeFoodCost(currentTech, sellPrice);

        // Norme Internationale & Standard Métier
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

    // Intégrer les fiches créées dans Déstockage (non présentes dans DATA)
    dbV5Recipes.forEach(r => {
      if (!r || !r.name) return;
      const cTarget = cleanText(r.name);
      if (processedRecipeNames.has(cTarget) || deletedSet.has(cTarget) || (r.id && deletedSet.has(String(r.id).toLowerCase()))) return;
      processedRecipeNames.add(cTarget);

      const rCat = r.category || 'AUTRE';
      const rSellPrice = r.sellPrice || parseFloat(String(r.price || '0').replace(/[^0-9.]/g, '')) || 0;
      const rTech = Array.isArray(r.ingredients) ? r.ingredients.slice() : (Array.isArray(r.tech) ? r.tech.slice() : []);
      const gcCost = window.calculateRecipeFoodCost(rTech, rSellPrice);
      const standardObj = window.getProposedStandard(r.name, { category: rCat, tech: rTech });
      const stdTech = standardObj ? standardObj.tech : rTech;
      const stdCost = window.calculateRecipeFoodCost(stdTech, rSellPrice);

      allRecipes.push({
        category: rCat,
        name: r.name,
        image: 'images/placeholder.svg',
        sellPrice: rSellPrice,
        initialTech: rTech,
        greyCorner: {
          tech: rTech,
          cost: gcCost.cost,
          foodCost: gcCost.foodCost,
          margin: gcCost.margin,
          grossMarginDH: gcCost.grossMarginDH,
          breakdown: gcCost.breakdown
        },
        standard: {
          tech: stdTech,
          rationale: standardObj ? standardObj.rationale : "Standard basé sur la fiche opérationnelle.",
          cost: stdCost.cost,
          foodCost: stdCost.foodCost,
          margin: stdCost.margin,
          grossMarginDH: stdCost.grossMarginDH,
          breakdown: stdCost.breakdown,
          diffDH: Math.round((gcCost.cost - stdCost.cost) * 100) / 100
        }
      });
    });

    window.allRecipes = allRecipes;
    window.editedRecipes = editedRecipes;

    if (typeof renderCategoriesBar === 'function') renderCategoriesBar();
    else if (window.renderCategoriesBar) window.renderCategoriesBar();

    if (typeof renderSummaryKPIs === 'function') renderSummaryKPIs();
    else if (window.renderSummaryKPIs) window.renderSummaryKPIs();

    if (typeof renderRecipeCards === 'function') renderRecipeCards();
    else if (window.renderRecipeCards) window.renderRecipeCards();
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
var sumGcCost = 0;
var sumStdCost = 0;
var sumPrice = 0;

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
      const drawerCount = document.getElementById('drawer-comp-count-recipes');
      if (drawerCount) drawerCount.textContent = totalItems;
    }

    // Déclencher l'analyse permanente de l'agent intelligent
    if (typeof window.renderAIOptimizerAgent === 'function') {
      window.renderAIOptimizerAgent();
    } else if (typeof renderAIOptimizerAgent === 'function') {
      renderAIOptimizerAgent();
    }
  }

  // Écoute des événements inter-onglets et inter-modules
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', function(e) {
      const keys = window.GC_STORAGE_KEYS || {
        RECIPES: 'gc_recipes_db_v5',
        COMP_EDITS: 'grey_corner_custom_recipes_v5',
        DELETED: 'gc_deleted_recipes_v1',
        PRICES: 'gc_ingredient_prices_v1',
        SYNC_PING: 'gc_sync_ping'
      };
      if (!e.key || 
          e.key === keys.RECIPES ||
          e.key === keys.COMP_EDITS ||
          e.key === keys.DELETED ||
          e.key === keys.PRICES ||
          e.key === keys.SYNC_PING) {
        initData();
      }
    });

    window.addEventListener('gc:recipe-updated', function() {
      initData();
    });
  }

  // Exports globaux pour la communication inter-modules
  window.allRecipes = allRecipes;
  window.editedRecipes = editedRecipes;
  window.currentCategory = currentCategory;
  window.searchQuery = searchQuery;
  window.onlyGainsFilter = onlyGainsFilter;
  window.hasUnsavedChanges = hasUnsavedChanges;
  window.STORAGE_KEY = STORAGE_KEY;
  window.loadSavedEdits = loadSavedEdits;
  window.saveEdits = saveEdits;
  window.loadCustomIngredientPrices = loadCustomIngredientPrices;
  window.initData = initData;
  window.renderCategoriesBar = renderCategoriesBar;
  window.renderSummaryKPIs = renderSummaryKPIs;
