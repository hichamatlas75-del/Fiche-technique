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
        }
      });

      localStorage.setItem(window.GC_STORAGE_KEYS.RECIPES, JSON.stringify(baseList));

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
            }
          }
        });
      });

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
  window.saveEdits = () => saveEdits(true);
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

    // Créer un index normalisé des modifications enregistrées
    const cleanEditsMap = new Map();
    Object.keys(editedRecipes).forEach(k => {
      cleanEditsMap.set(cleanText(k), editedRecipes[k]);
    });

    const data = window.CATEGORIES_DATA || window.DATA || [];
    data.forEach(cat => {
      const catName = cat.category || 'AUTRE';
      (cat.items || []).forEach(item => {
        const initialTech = JSON.parse(JSON.stringify(item.tech || []));
var sellPrice = parseFloat(String(item.price || item.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
        
        // 1. Fiche Grey Corner (Modifiable ou initiale)
        const cTarget = cleanText(item.name);
        const userEdit = editedRecipes[item.name] || cleanEditsMap.get(cTarget);
        if (userEdit && typeof userEdit.sellPrice === 'number' && userEdit.sellPrice > 0) {
          sellPrice = userEdit.sellPrice;
        }
        const currentTech = (userEdit && Array.isArray(userEdit.tech)) 
          ? userEdit.tech.slice() 
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
