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
  let hasUnsavedChanges = false; // AM-03: suivi des modifications non sauvegardées

  const STORAGE_KEY = 'grey_corner_custom_recipes_v5';

  // AM-03 FIX : Avertissement avant fermeture si modifications non sauvegardées
  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = 'Des modifications non sauvegardées seront perdues. Continuer ?';
    }
  });

  function cleanText(str) {
    if (!str) return '';
    return str.toString().toLowerCase().replace(/œ/g, 'oe').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

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
      let baseList = [];
      const rawV5 = localStorage.getItem('gc_recipes_db_v5');
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
        let r = cleanMap.get(cName);
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

      localStorage.setItem('gc_recipes_db_v5', JSON.stringify(baseList));

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
          showToast("💾 Fiches techniques enregistrées avec succès !");
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
          showToast("❌ Erreur de sauvegarde : " + e.message);
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
      const saved = localStorage.getItem('gc_ingredient_prices_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const obsolete = window.OBSOLETE_INGREDIENT_KEYS || new Set([
          'calamar', 'calamars', 'calamar congele', 'calamars congeles', 'calamars brut', 'calamars net', 'calamar egoutte', 'calamars egouttes', 'calamar chair', 'calamars chair',
          'crevette', 'crevettes', 'crevette avec coquille', 'crevettes avec coquille', 'crevette brut', 'crevette chair', 'crevettes chair', 'crevette chair pure', 'crevettes chair pure', 'crevette chair pur', 'crevettes chair pur',
          'gambas', 'gambas avec coquille', 'gambas chair', 'gambas chair pure', 'gambas chair pur', 'gambas panees', 'gambas poche', 'gambas pochee', 'gambas decortiquees',
          'saumon', 'saumon frais', 'saumon sans carcasse', 'saumon avec carcasse', 'saumon fumee'
        ]);
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
        let sellPrice = parseFloat(String(item.price || item.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
        
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

    // Déclencher l'analyse permanente de l'agent intelligent
    renderAIOptimizerAgent();
  }

  /* ========================================================
     AGENT INTELLIGENT D'OPTIMISATION DES REVENUS (AI REVENUE ADVISOR)
     Analyse en temps réel le tableau de synthèse & les ventes journalières
  ======================================================== */
  let currentAITab = 'menu_engineering'; // 'menu_engineering', 'daily_sales', 'quick_wins', 'pricing', 'standards', 'critical'
  let currentMenuEngFilter = 'all'; // 'all', 'star', 'plowhorse', 'puzzle', 'dog'
  let selectedAIDailyDate = (function() {
    try { return localStorage.getItem('gc_ai_daily_date') || '__auto__'; } catch(e) { return '__auto__'; }
  })();
  let isAIAgentCollapsed = (function() {
    try { return localStorage.getItem('gc_ai_agent_collapsed') === 'true'; } catch(e) { return false; }
  })();

  const BENCHMARK_DAILY_SALES = [
    { product: "Pizza Fruits de Mer", qty: 18, price: 88, family: "PIZZA" },
    { product: "Pizza 4 Saisons", qty: 22, price: 88, family: "PIZZA" },
    { product: "Burger Royal", qty: 16, price: 70, family: "BURGER" },
    { product: "Cheese Burger", qty: 24, price: 54, family: "BURGER" },
    { product: "Filet de Bœuf", qty: 6, price: 135, family: "PLATS" },
    { product: "Pasta Fruits de Mer", qty: 14, price: 88, family: "PASTA" },
    { product: "Mquila Crevettes", qty: 12, price: 70, family: "MQUILA" },
    { product: "Salade César", qty: 10, price: 65, family: "SALADES" },
    { product: "Panini Poulet", qty: 14, price: 44, family: "PANINI" },
    { product: "Mojito Red Bull", qty: 15, price: 44, family: "BOISSONS" },
    { product: "Chocolat Chaud", qty: 12, price: 18, family: "BOISSONS" },
    { product: "Smoothie Énergétique", qty: 4, price: 42, family: "JUS" },
    { product: "Coca-Cola 33cl", qty: 32, price: 17, family: "SODAS" },
    { product: "Eau Minérale 50cl", qty: 26, price: 12, family: "EAUX" },
    { product: "Supplément Frites", qty: 14, price: 15, family: "SUPPLÉMENTS" }
  ];

  window.setAITab = function(tab) {
    currentAITab = tab;
    renderAIOptimizerAgent();
  };

  window.setMenuEngFilter = function(filter) {
    currentMenuEngFilter = filter;
    renderAIOptimizerAgent();
  };

  window.setAIDailySalesDate = function(dateVal) {
    selectedAIDailyDate = dateVal;
    try { localStorage.setItem('gc_ai_daily_date', dateVal); } catch(e) {}
    renderAIOptimizerAgent();
  };

  window.toggleAIAgentCollapse = function() {
    isAIAgentCollapsed = !isAIAgentCollapsed;
    try {
      localStorage.setItem('gc_ai_agent_collapsed', isAIAgentCollapsed);
    } catch(e) {}
    renderAIOptimizerAgent();
  };

  window.applyAIOptimization = function(recipeName, actionType, paramVal) {
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;

    if (actionType === 'apply_standard') {
      window.copyStandardToRecipe(recipeName);
      if (typeof showToast === 'function') {
        showToast(`🤖 Agent IA : Standard appliqué avec succès sur "${recipeName}" !`);
      }
    } else if (actionType === 'apply_price') {
      const newPrice = parseFloat(paramVal) || 0;
      if (newPrice > 0) {
        window.updateRecipeSellPrice(recipeName, newPrice);
        if (typeof showToast === 'function') {
          showToast(`🤖 Agent IA : Prix ajusté à ${newPrice} DH sur "${recipeName}" !`);
        }
      }
    } else if (actionType === 'inspect') {
      searchQuery = recipeName;
      const searchInput = document.getElementById('search-comparator');
      if (searchInput) searchInput.value = recipeName;
      if (isComparatorTableView) {
        renderComparatorTable();
      } else {
        renderRecipeCards();
      }
      setTimeout(() => {
        const el = document.querySelector(`[data-recipe-name="${recipeName}"]`) || document.getElementById('search-comparator');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  };

  // Récupération des données de ventes journalières
  function getDailySalesContext() {
    let rawDB = null;
    try {
      const saved = localStorage.getItem('gc_monthly_sales_db_v3');
      if (saved) rawDB = JSON.parse(saved);
    } catch(e) {}

    const availableDates = rawDB ? Object.keys(rawDB).filter(d => Array.isArray(rawDB[d]) && rawDB[d].length > 0).sort().reverse() : [];
    const todayISO = new Date().toLocaleDateString('en-CA');

    let effectiveDate = selectedAIDailyDate;
    let isBenchmark = false;
    let salesRows = [];

    if (effectiveDate === '__auto__') {
      if (rawDB && rawDB[todayISO] && rawDB[todayISO].length > 0) {
        effectiveDate = todayISO;
        salesRows = rawDB[todayISO];
      } else if (availableDates.length > 0) {
        effectiveDate = availableDates[0];
        salesRows = rawDB[effectiveDate];
      } else {
        effectiveDate = '__benchmark__';
        salesRows = BENCHMARK_DAILY_SALES;
        isBenchmark = true;
      }
    } else if (effectiveDate === '__benchmark__') {
      isBenchmark = true;
      salesRows = BENCHMARK_DAILY_SALES;
    } else {
      if (rawDB && rawDB[effectiveDate] && rawDB[effectiveDate].length > 0) {
        salesRows = rawDB[effectiveDate];
      } else {
        isBenchmark = true;
        salesRows = BENCHMARK_DAILY_SALES;
      }
    }

    return {
      effectiveDate,
      isBenchmark,
      availableDates,
      salesRows
    };
  }

  // Analyse des ventes de la journée sélectionnée
  function analyzeDailySales(salesRows) {
    let totalItemsSold = 0;
    let totalDailyRevenue = 0;
    let totalDailyGcCost = 0;
    let totalDailyStdCost = 0;
    let totalDailyLostMargin = 0;

    const matchedSales = [];
    const aliasMap = window.ALIAS_MAP || {};

    salesRows.forEach(sale => {
      if (!sale || !sale.product) return;
      const rawName = sale.product;
      const aliasName = aliasMap[rawName] || rawName;
      const cRaw = cleanText(rawName);
      const cAlias = cleanText(aliasName);
      const qty = parseFloat(sale.qty) || 0;
      if (qty <= 0) return;

      let matched = allRecipes.find(r => cleanText(r.name) === cAlias || cleanText(r.name) === cRaw);
      if (!matched) {
        matched = allRecipes.find(r => {
          const cR = cleanText(r.name);
          return cR.includes(cAlias) || cAlias.includes(cR) || cR.includes(cRaw) || cRaw.includes(cR);
        });
      }

      if (!matched) return;

      const sellPrice = parseFloat(sale.price) || matched.sellPrice || 0;
      const lineRev = qty * sellPrice;
      const lineGcCost = qty * matched.greyCorner.cost;
      const lineStdCost = qty * matched.standard.cost;
      const unitDiff = matched.standard.diffDH; // surcoût Grey Corner vs Standard
      const lineLost = qty * Math.max(0, unitDiff);

      totalItemsSold += qty;
      totalDailyRevenue += lineRev;
      totalDailyGcCost += lineGcCost;
      totalDailyStdCost += lineStdCost;
      totalDailyLostMargin += lineLost;

      matchedSales.push({
        recipeName: matched.name,
        category: matched.category,
        qtySold: qty,
        sellPrice: sellPrice,
        totalRevenue: lineRev,
        gcCostUnit: matched.greyCorner.cost,
        gcFC: matched.greyCorner.foodCost,
        stdCostUnit: matched.standard.cost,
        stdFC: matched.standard.foodCost,
        unitDiffDH: unitDiff,
        dailyLostDH: Math.round(lineLost * 100) / 100,
        isLoss: unitDiff > 0.5,
        priority: lineLost >= 100 ? 'high' : (lineLost >= 30 ? 'medium' : 'standard')
      });
    });

    matchedSales.sort((a, b) => b.dailyLostDH - a.dailyLostDH);

    const weightedGcFC = totalDailyRevenue > 0 ? (totalDailyGcCost / totalDailyRevenue * 100).toFixed(1) : '0.0';
    const weightedStdFC = totalDailyRevenue > 0 ? (totalDailyStdCost / totalDailyRevenue * 100).toFixed(1) : '0.0';

    return {
      totalItemsSold,
      totalDailyRevenue: Math.round(totalDailyRevenue),
      totalDailyGcCost: Math.round(totalDailyGcCost * 100) / 100,
      totalDailyStdCost: Math.round(totalDailyStdCost * 100) / 100,
      totalDailyLostMargin: Math.round(totalDailyLostMargin * 100) / 100,
      weightedGcFC,
      weightedStdFC,
      matchedSales
    };
  }

  // =================================================================
  // ANALYSE MENU ENGINEERING & CASH MARGIN (KASAVANA & SMITH ADAPTÉE)
  // =================================================================
  // Arbitrage Marge Brute en Dirhams (Cash Margin) vs Food Cost %
  // 1. ⭐ ÉTOILES (Stars) : Forte Marge Cash >= seuil, Fort Volume >= seuil
  // 2. 🐎 CHEVAUX DE TRAIT (Plowhorses) : Faible Marge Cash < seuil, Fort Volume >= seuil
  // 3. 🧩 PUZZLES : Forte Marge Cash >= seuil, Faible Volume < seuil (Nourriciers de trésorerie !)
  // 4. 🐕 CHIENS (Dogs) : Faible Marge Cash < seuil, Faible Volume < seuil
  // =================================================================
  function analyzeMenuEngineering(salesRows) {
    const aliasMap = window.ALIAS_MAP || {};
    const itemsMap = {};
    let excludedDishesCount = 0;
    let excludedDishesQty = 0;

    const checkExcluded = typeof isExcludedFromMenuEngineering === 'function'
      ? isExcludedFromMenuEngineering
      : (typeof window !== 'undefined' && typeof window.isExcludedFromMenuEngineering === 'function' ? window.isExcludedFromMenuEngineering : null);

    salesRows.forEach(sale => {
      if (!sale || !sale.product) return;
      const rawName = sale.product;
      const aliasName = aliasMap[rawName] || rawName;
      const cRaw = cleanText(rawName);
      const cAlias = cleanText(aliasName);
      const qty = parseFloat(sale.qty) || 0;
      if (qty <= 0) return;

      // Exclusion Menu Engineering préalable (par libellé brut / famille POS)
      if (checkExcluded && checkExcluded(rawName, sale.category || '', sale.family || '', '')) {
        excludedDishesCount++;
        excludedDishesQty += qty;
        return;
      }

      let matched = allRecipes.find(r => cleanText(r.name) === cAlias || cleanText(r.name) === cRaw);
      if (!matched) {
        matched = allRecipes.find(r => {
          const cR = cleanText(r.name);
          return cR.includes(cAlias) || cAlias.includes(cR) || cR.includes(cRaw) || cRaw.includes(cR);
        });
      }
      if (!matched) return;

      // Exclusion Menu Engineering par catégorie / clé SSOT fiche technique (Sodas, Eaux, Suppléments)
      const recKey = matched.greyCorner ? (matched.greyCorner.__key || '') : (matched.__key || '');
      if (checkExcluded && checkExcluded(matched.name, matched.category, sale.family || '', recKey)) {
        excludedDishesCount++;
        excludedDishesQty += qty;
        return;
      }

      const sellPrice = parseFloat(sale.price) || matched.sellPrice || 0;
      const key = matched.name;

      if (!itemsMap[key]) {
        itemsMap[key] = {
          recipeName: matched.name,
          category: matched.category,
          recipeObj: matched,
          sellPrice: sellPrice,
          cost: matched.greyCorner.cost,
          foodCost: matched.greyCorner.foodCost,
          cashMargin: Math.round((sellPrice - matched.greyCorner.cost) * 100) / 100,
          qtySold: 0,
          totalRevenue: 0,
          totalCost: 0,
          totalCashMargin: 0
        };
      }

      itemsMap[key].qtySold += qty;
      itemsMap[key].totalRevenue += qty * sellPrice;
      itemsMap[key].totalCost += qty * matched.greyCorner.cost;
      itemsMap[key].totalCashMargin += qty * itemsMap[key].cashMargin;
    });

    const items = Object.values(itemsMap);
    if (items.length === 0) {
      return {
        items: [],
        stars: [],
        plowhorses: [],
        puzzles: [],
        dogs: [],
        stats: {
          totalQty: 0,
          totalRevenue: 0,
          totalCashMargin: 0,
          weightedFoodCost: '0.0',
          avgQtyPerItem: 0,
          avgCashMarginPerPortion: 0
        },
        priorityActions: []
      };
    }

    const totalQty = items.reduce((sum, i) => sum + i.qtySold, 0);
    const totalRevenue = items.reduce((sum, i) => sum + i.totalRevenue, 0);
    const totalCost = items.reduce((sum, i) => sum + i.totalCost, 0);
    const totalCashMargin = items.reduce((sum, i) => sum + i.totalCashMargin, 0);

    const avgQtyPerItem = totalQty / items.length;
    const avgCashMarginPerPortion = totalQty > 0 ? (totalCashMargin / totalQty) : 0;
    const weightedFoodCost = totalRevenue > 0 ? (totalCost / totalRevenue * 100).toFixed(1) : '0.0';

    const stars = [];
    const plowhorses = [];
    const puzzles = [];
    const dogs = [];

    items.forEach(item => {
      const isHighVolume = item.qtySold >= avgQtyPerItem * 0.85;
      const isHighMargin = item.cashMargin >= avgCashMarginPerPortion;

      const isBankFeeder = item.cashMargin >= 45 && item.foodCost >= 33;
      const isCompensator = item.foodCost <= 22;

      const market = FES_CAFE_RESTAURANT_MARKET.getLimits(item.category, item.recipeName);

      let quadrant = '';
      let quadrantLabel = '';
      let quadrantDesc = '';
      let actionLabel = '';
      let actionType = '';
      let actionParam = null;

      if (isHighVolume && isHighMargin) {
        quadrant = 'star';
        quadrantLabel = '⭐ ÉTOILE (Star)';
        quadrantDesc = `Moteur de cash net : Forte marge unitaire (<strong>+${item.cashMargin.toFixed(2)} DH</strong>) et fort volume (<strong>${item.qtySold} vendus</strong>). Action : Ne pas modifier le prix, verrouiller les pesées standards de matière noble.`;
        actionType = 'apply_standard';
        actionLabel = '🟢 Verrouiller Portion Standard';
        stars.push(item);
      } else if (isHighVolume && !isHighMargin) {
        quadrant = 'plowhorse';
        quadrantLabel = '🐎 CHEVAL DE TRAIT (Plowhorse)';
        const softBump = item.sellPrice < 30 ? 2 : (item.sellPrice <= 65 ? 3 : 5);
        const newSuggestedPrice = Math.min(market.hardCeiling, item.sellPrice + softBump);
        const extraGain = Math.round(softBump * item.qtySold);
        quadrantDesc = `Plat locomotive (<strong>${item.qtySold} vendus</strong>), mais marge cash serrée (<strong>+${item.cashMargin.toFixed(2)} DH</strong>). Une hausse douce de +${softBump} DH injecte <strong>+${extraGain.toLocaleString('fr-FR')} DH de cash net direct</strong> sans pénaliser la fréquentation.`;
        actionType = 'apply_price';
        actionParam = newSuggestedPrice;
        actionLabel = `💡 Hausse Douce (+${softBump} DH ➔ ${newSuggestedPrice} DH)`;
        plowhorses.push(item);
      } else if (!isHighVolume && isHighMargin) {
        quadrant = 'puzzle';
        quadrantLabel = '🧩 PUZZLE (Marge Élevée)';
        quadrantDesc = isBankFeeder 
          ? `💰 <strong>Plat Nourricier de Trésorerie :</strong> Malgré un Food Cost à <strong>${item.foodCost.toFixed(1)}%</strong>, chaque assiette dépose <strong>+${item.cashMargin.toFixed(2)} DH de cash net</strong> ! Ne pas surtaxer le prix pour ne pas faire fuir le client. Action : Briefing serveurs et mise en avant "Spécialité du Chef".`
          : `Forte rentabilité unitaire (<strong>+${item.cashMargin.toFixed(2)} DH de marge</strong>) mais volume timide (<strong>${item.qtySold} vendus</strong>). À promouvoir visuellement sur la carte et en suggestion du jour.`;
        actionType = 'inspect';
        actionLabel = '🌟 Mettre en Avant (Star Menu)';
        puzzles.push(item);
      } else {
        quadrant = 'dog';
        quadrantLabel = '🐕 CHIEN (Dog)';
        quadrantDesc = `Faible volume (<strong>${item.qtySold} vendus</strong>) et marge cash unitaire limitée (<strong>+${item.cashMargin.toFixed(2)} DH</strong>). Ne pas monter le prix violemment au risque d'anéantir les ventes. Solution recommandée : ${market.portionAdvice}`;
        actionType = 'apply_standard';
        actionLabel = '🛠️ Standardiser la Recette';
        dogs.push(item);
      }

      item.quadrant = quadrant;
      item.quadrantLabel = quadrantLabel;
      item.quadrantDesc = quadrantDesc;
      item.isBankFeeder = isBankFeeder;
      item.isCompensator = isCompensator;
      item.market = market;
      item.actionLabel = actionLabel;
      item.actionType = actionType;
      item.actionParam = actionParam;
    });

    stars.sort((a, b) => b.totalCashMargin - a.totalCashMargin);
    plowhorses.sort((a, b) => b.qtySold - a.qtySold);
    puzzles.sort((a, b) => b.cashMargin - a.cashMargin);
    dogs.sort((a, b) => a.cashMargin - b.cashMargin);
    items.sort((a, b) => b.totalCashMargin - a.totalCashMargin);

    const priorityActions = [];
    const topPuzzle = puzzles[0];
    if (topPuzzle) {
      const extraGain = Math.round(topPuzzle.cashMargin * 15);
      priorityActions.push({
        title: `Pousser "${topPuzzle.recipeName}" en Suggestion du Chef (Puzzle)`,
        desc: `Chaque vente génère <strong>+${topPuzzle.cashMargin.toFixed(2)} DH de cash net</strong>. Passer à +15 ventes apporte <strong>+${extraGain.toLocaleString('fr-FR')} DH de liquidités réelles</strong>.`,
        recipeName: topPuzzle.recipeName
      });
    }

    const topPlowhorse = plowhorses[0];
    if (topPlowhorse) {
      const bump = topPlowhorse.sellPrice < 30 ? 2 : 3;
      const extraGain = Math.round(bump * topPlowhorse.qtySold);
      priorityActions.push({
        title: `Hausse douce de +${bump} DH sur "${topPlowhorse.recipeName}" (Cheval de Trait)`,
        desc: `Avec <strong>${topPlowhorse.qtySold} ventes</strong>, ce plat populaire encaisse une hausse modérée sans friction. Trésorerie additionnelle : <strong>+${extraGain.toLocaleString('fr-FR')} DH</strong>.`,
        recipeName: topPlowhorse.recipeName,
        actionParam: topPlowhorse.sellPrice + bump
      });
    }

    const topStar = stars[0];
    if (topStar) {
      priorityActions.push({
        title: `Verrouiller les pesées sur "${topStar.recipeName}" (Étoile)`,
        desc: `Locomotive de marge (<strong>+${topStar.totalCashMargin.toFixed(0)} DH générés</strong>). Contrôler strictement les grammages pour neutraliser toute dérive de surdosage.`,
        recipeName: topStar.recipeName
      });
    }

    return {
      items,
      stars,
      plowhorses,
      puzzles,
      dogs,
      stats: {
        totalQty,
        totalRevenue: Math.round(totalRevenue),
        totalCashMargin: Math.round(totalCashMargin),
        weightedFoodCost,
        avgQtyPerItem: Math.round(avgQtyPerItem),
        avgCashMarginPerPortion: Math.round(avgCashMarginPerPortion * 100) / 100,
        excludedDishesCount,
        excludedDishesQty
      },
      priorityActions
    };
  }

  // =================================================================
  // ÉTUDE DE MARCHÉ FÈS — MODÈLE CAFÉ-RESTAURANT (BENCHMARK & PLAFONDS)
  // =================================================================
  // Positionnement : Café-Restaurant à Fès (ex: Champs de Course, Ville Nouvelle, Imouzzer, Narjiss)
  // Spécificités Café-Restaurant :
  //  1. Cible Food Cost Plats Salés = 32.0% (et non 27-28%) grâce à la péréquation des boissons (12-18%).
  //  2. Forte sensibilité au prix (élasticité forte) : éviter impérativement la fuite de la clientèle.
  //  3. Hausse progressive limitée à +18% max (ou +15 à +20 DH max par palier).
  //  4. Plafonds psychologiques stricts par famille de produits observés sur le marché fassi.
  // =================================================================
  const FES_CAFE_RESTAURANT_MARKET = {
    TARGET_FOOD_COST: 0.32, // 32.0%
    MAX_BUMP_PCT: 0.18,     // +18% max d'augmentation en une seule fois
    MAX_BUMP_DH: 20,        // +20 DH max d'augmentation par plat

    getLimits: function(category, recipeName) {
      const name = (recipeName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const cat = (category || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      // 1. PIÈCES NOBLES (Filet de bœuf, Faux-filet, Pavé de saumon, Entrecôte)
      if (name.includes('filet') || name.includes('boeuf') || name.includes('saumon') || name.includes('entrecote') || name.includes('faux filet')) {
        return {
          type: "Pièce noble (Bœuf / Saumon)",
          marketRange: "130 – 150 DH",
          softCeiling: 150,
          hardCeiling: 160,
          portionAdvice: "Privilégier le calibrage de la pièce à 160g-170g (au lieu de 180-200g) pour maintenir le tarif sous le seuil psychologique de 150 DH."
        };
      }

      // 2. PLATS CHAUDS / VIANDES & VOLAILLES
      if (cat.includes('PLAT')) {
        if (name.includes('poulet') || name.includes('escalope') || name.includes('cordon') || name.includes('supreme')) {
          return {
            type: "Plat Volaille / Escalope",
            marketRange: "65 – 85 DH",
            softCeiling: 80,
            hardCeiling: 90,
            portionAdvice: "Calibrer le suprême/escalope à 140g pour stabiliser le Food Cost sous 32%."
          };
        }
        return {
          type: "Plat Viande / Émincé",
          marketRange: "80 – 105 DH",
          softCeiling: 105,
          hardCeiling: 115,
          portionAdvice: "Ajuster la garniture féculents/légumes et le grammage de sauce."
        };
      }

      // 3. PIZZAS
      if (cat.includes('PIZZA')) {
        if (name.includes('fruit') || name.includes('mer') || name.includes('saumon') || name.includes('burrata') || name.includes('gambas')) {
          return {
            type: "Pizza Prestige (Fruits de mer / Burrata)",
            marketRange: "75 – 90 DH",
            softCeiling: 90,
            hardCeiling: 95,
            portionAdvice: "Doser les fruits de mer à 90g max (calamar/crevette) et mozzarella à 100g."
          };
        }
        return {
          type: "Pizza Classique",
          marketRange: "50 – 75 DH",
          softCeiling: 75,
          hardCeiling: 80,
          portionAdvice: "Contrôler le dosage de fromage (80-100g de mozzarella râpée)."
        };
      }

      // 4. PÂTES & RISOTTOS
      if (cat.includes('PATE') || cat.includes('PAST')) {
        if (name.includes('fruit') || name.includes('mer') || name.includes('saumon') || name.includes('gambas')) {
          return {
            type: "Pâtes Fruits de Mer / Saumon",
            marketRange: "75 – 85 DH",
            softCeiling: 85,
            hardCeiling: 95,
            portionAdvice: "Standardiser la dose de fruits de mer à 80g net et crème à 80ml."
          };
        }
        return {
          type: "Pâtes Traditionnelles",
          marketRange: "55 – 75 DH",
          softCeiling: 75,
          hardCeiling: 80,
          portionAdvice: "Grammage pâtes sèches 100-110g + sauce 100g."
        };
      }

      // 5. BURGERS
      if (cat.includes('BURGER')) {
        if (name.includes('double') || name.includes('royal') || name.includes('big') || name.includes('giant')) {
          return {
            type: "Burger Double / Gourmet",
            marketRange: "65 – 80 DH",
            softCeiling: 80,
            hardCeiling: 85,
            portionAdvice: "Calibrer les steaks à 2x80g ou 1x150g et frites à 150g."
          };
        }
        return {
          type: "Burger Standard",
          marketRange: "45 – 65 DH",
          softCeiling: 65,
          hardCeiling: 70,
          portionAdvice: "Steak calibré à 110g + cheddar 1 tranche (25g)."
        };
      }

      // 6. TACOS / PANINIS / SANDWICHES
      if (cat.includes('TACO') || cat.includes('PANINI') || cat.includes('SANDWICH')) {
        return {
          type: "Tacos / Sandwich / Panini",
          marketRange: "38 – 55 DH",
          softCeiling: 55,
          hardCeiling: 60,
          portionAdvice: "Doser la viande à 90g (sandwich simple) ou 130g (mixte)."
        };
      }

      // 7. SALADES
      if (cat.includes('SALAD')) {
        return {
          type: "Salade Repas",
          marketRange: "45 – 65 DH",
          softCeiling: 65,
          hardCeiling: 75,
          portionAdvice: "Équilibrer les protéines nobles (poulet/thon/crevette 60g) et les crudités de base."
        };
      }

      // 8. POISSONS / FRITURES
      if (cat.includes('POISSON')) {
        return {
          type: "Plat Poisson / Friture",
          marketRange: "85 – 120 DH",
          softCeiling: 120,
          hardCeiling: 135,
          portionAdvice: "Plafonner le mix friture à 220g brut nettoyé."
        };
      }

      // 9. DESSERTS
      if (cat.includes('DESSERT')) {
        return {
          type: "Dessert & Pâtisserie",
          marketRange: "28 – 40 DH",
          softCeiling: 40,
          hardCeiling: 48,
          portionAdvice: "Optimiser les toppings coulis et éclats de fruits secs."
        };
      }

      // 10. JUS FRAIS & SMOOTHIES
      if (cat.includes('JUS') || cat.includes('SMOOTHIE')) {
        return {
          type: "Jus Frais / Smoothie",
          marketRange: "28 – 42 DH",
          softCeiling: 42,
          hardCeiling: 48,
          portionAdvice: "Éviter le surdosage de fruits secs onéreux (amandes, pistaches, avocat)."
        };
      }

      // 11. CAFÉS & BOISSONS CHAUDES
      if (cat.includes('CAFE') || cat.includes('BOISSON')) {
        return {
          type: "Café / Boisson chaude",
          marketRange: "15 – 22 DH",
          softCeiling: 22,
          hardCeiling: 26,
          portionAdvice: "Standardiser la dose café à 7.5g et lait à 120ml."
        };
      }

      // 12. DÉFAUT CAFÉ-RESTAURANT
      return {
        type: "Café-Restaurant Standard",
        marketRange: "45 – 80 DH",
        softCeiling: 80,
        hardCeiling: 90,
        portionAdvice: "Standardiser les portions d'ingrédients principaux."
      };
    }
  };

  // Analyse structurelle globale du catalogue de fiches
  function analyzeDatasetForOptimizations() {
    const quickWins = [];
    const pricingOpportunities = [];
    const standardOpportunities = [];
    const criticalAlerts = [];

    let totalMonthlySavings = 0;
    let totalPotentialPricingRev = 0;
    const keyProteinsRegex = /(calamar|crevette|gambas|saumon|viande hach|steak|bavette|poulet|escalope|mozzarella|parmesan|fromage rouge)/i;

    allRecipes.forEach((recipe, idx) => {
      const gc = recipe.greyCorner;
      const std = recipe.standard;
      const price = recipe.sellPrice || 0;
      const diffDH = std.diffDH; // gc.cost - std.cost

      if (diffDH > 0) {
        totalMonthlySavings += diffDH * 50; // base conservative 50 portions/mois
      }

      // 1. QUICK WINS (Écart >= 3.00 DH / portion)
      if (diffDH >= 3.0) {
        const drivers = [];
        (gc.breakdown || []).forEach(b => {
          const matchStd = (std.breakdown || []).find(s => cleanText(s.ingredient) === cleanText(b.ingredient));
          if (matchStd && b.cost > matchStd.cost + 1.2) {
            drivers.push(`${b.ingredient} (${b.quantity} vs ${matchStd.quantity})`);
          }
        });

        const driverText = drivers.length > 0 
          ? `Surdosage identifié sur : <strong>${drivers.slice(0, 2).join(', ')}</strong>.` 
          : `Écart de coût cumulé de <strong>+${diffDH.toFixed(2)} DH</strong> par assiette.`;

        const monthlyGain = Math.round(diffDH * 60);

        quickWins.push({
          recipeName: recipe.name,
          category: recipe.category,
          recipeIndex: idx,
          priority: diffDH >= 6.0 ? 'high' : 'medium',
          currentCost: gc.cost,
          currentFC: gc.foodCost,
          stdCost: std.cost,
          stdFC: std.foodCost,
          diffDH: diffDH,
          monthlyGain: monthlyGain,
          title: `Gain direct : +${diffDH.toFixed(2)} DH / portion`,
          desc: `${driverText} L'alignement sur la norme hôtelière ramène le Food Cost de <strong>${gc.foodCost}%</strong> à <strong>${std.foodCost}%</strong> sans compromis sur la qualité.`,
          actionType: 'apply_standard',
          actionLabel: '🟢 Appliquer le Standard Métier',
          financialImpact: `+${monthlyGain.toLocaleString('fr-FR')} DH / mois (base 60 portions)`
        });
      }

      // 2. PRICING POWER SOUPLE — ÉTUDE DE MARCHÉ CAFÉ-RESTAURANT FÈS
      // Le Food Cost cible est ramené à 32% (et non 27-28%), avec protection anti-fuite client
      if (gc.foodCost > 33.5 && price > 0) {
        const market = FES_CAFE_RESTAURANT_MARKET.getLimits(recipe.category, recipe.name);
        const targetFoodCost = FES_CAFE_RESTAURANT_MARKET.TARGET_FOOD_COST; // 32%

        // Prix théorique brut pour atteindre exactement 32% de Food Cost
        const rawTargetPrice32 = gc.cost / targetFoodCost;
        const step = price < 30 ? 2 : 5; // Palier de 5 DH (ou 2 DH pour petites boissons)
        let theoreticalPrice = Math.ceil(rawTargetPrice32 / step) * step;

        // Souplesse : Limitation de la hausse pour éviter la fuite de la clientèle
        // Hausse max par palier : +18% max ou +20 DH max
        const maxAllowedBump = Math.max(step, Math.min(FES_CAFE_RESTAURANT_MARKET.MAX_BUMP_DH, Math.ceil((price * FES_CAFE_RESTAURANT_MARKET.MAX_BUMP_PCT) / step) * step));
        const maxSoftPrice = price + maxAllowedBump;

        // Respect des seuils de marché fassi :
        // Si le plat est sous le softCeiling, on ne dépasse pas le softCeiling en une seule fois
        let recommendedPrice = theoreticalPrice;
        if (price < market.softCeiling) {
          recommendedPrice = Math.min(recommendedPrice, market.softCeiling);
        } else {
          recommendedPrice = Math.min(recommendedPrice, market.hardCeiling);
        }

        let isCappedByFlexibility = false;
        let isCappedByMarket = false;

        if (theoreticalPrice > market.hardCeiling) {
          isCappedByMarket = true;
          recommendedPrice = Math.min(recommendedPrice, market.hardCeiling);
        }

        if (recommendedPrice > maxSoftPrice) {
          isCappedByFlexibility = true;
          recommendedPrice = maxSoftPrice;
        }

        const deltaPrice = recommendedPrice - price;

        if (deltaPrice >= 2) {
          const monthlyPricingBoost = Math.round(deltaPrice * 50);
          totalPotentialPricingRev += monthlyPricingBoost;
          const newFC = Math.round((gc.cost / recommendedPrice) * 1000) / 10;
          const cashMarginDH = Math.round((recommendedPrice - gc.cost) * 100) / 100;

          let marketWarningText = '';
          if (isCappedByMarket) {
            marketWarningText = `⚠️ <strong>Plafond Marché Fès atteint (${market.hardCeiling} DH) :</strong> Augmenter davantage ferait fuir la clientèle café-restaurant. Le levier prioritaire n'est pas le prix : ${market.portionAdvice}`;
          } else if (isCappedByFlexibility) {
            marketWarningText = `🛡️ <strong>Souplesse Anti-Fuite Client :</strong> Hausse progressive limitée à +${deltaPrice} DH (marché Fès : ${market.marketRange}). ${market.portionAdvice}`;
          } else {
            marketWarningText = `✅ Prix conforme au marché Café-Restaurant Fès (${market.marketRange}). Marge brute en espèces générée : <strong>+${cashMarginDH.toFixed(2)} DH / portion</strong>.`;
          }

          pricingOpportunities.push({
            recipeName: recipe.name,
            category: recipe.category,
            recipeIndex: idx,
            priority: gc.foodCost >= 40 ? 'high' : 'medium',
            currentCost: gc.cost,
            currentFC: gc.foodCost,
            currentPrice: price,
            targetPrice: recommendedPrice,
            newFC: newFC,
            deltaPrice: deltaPrice,
            monthlyGain: monthlyPricingBoost,
            cashMarginDH: cashMarginDH,
            marketInfo: market,
            isCappedByMarket: isCappedByMarket,
            isCappedByFlexibility: isCappedByFlexibility,
            title: `Ajustement Souple Fès : ${price} DH ➔ ${recommendedPrice} DH (+${deltaPrice} DH)`,
            desc: `Food Cost sous tension à <strong>${gc.foodCost}%</strong> (coût matière : ${gc.cost.toFixed(2)} DH). En modèle Café-Restaurant, la cible de Food Cost est ramenée à <strong>32%</strong>. Le tarif passe à <strong>${recommendedPrice} DH</strong> (Food Cost : <strong>${newFC}%</strong>, marge brute : <strong>+${cashMarginDH.toFixed(2)} DH</strong>).<br><span style="display:inline-block; margin-top:5px; font-size:11.5px; color:var(--text);">${marketWarningText}</span>`,
            actionType: 'apply_price',
            actionParam: recommendedPrice,
            actionLabel: `💡 Fixer le prix à ${recommendedPrice} DH`,
            financialImpact: `+${monthlyPricingBoost.toLocaleString('fr-FR')} DH / mois (base 50 ventes)`
          });
        }
      }

      // 3. STANDARDS DE GRAMMAGES & MATIÈRES NOBLES (Focus Protéines)
      if (diffDH > 1.5) {
        const nobleLines = (gc.breakdown || []).filter(b => keyProteinsRegex.test(b.ingredient));
        const topNoble = nobleLines.sort((a, b) => b.cost - a.cost)[0];

        standardOpportunities.push({
          recipeName: recipe.name,
          category: recipe.category,
          recipeIndex: idx,
          priority: 'standard',
          currentCost: gc.cost,
          currentFC: gc.foodCost,
          stdCost: std.cost,
          stdFC: std.foodCost,
          diffDH: diffDH,
          monthlyGain: Math.round(diffDH * 45),
          title: `Portion Standard : ${recipe.name}`,
          desc: topNoble 
            ? `Ingrédient pivot : <strong>${topNoble.ingredient}</strong> (${topNoble.cost.toFixed(2)} DH, soit ${Math.round(topNoble.cost / (gc.cost || 1) * 100)}% du coût). La fiche standard prévoit un dosage équilibré pour maximiser le rendement.`
            : `Fiche technique prête pour standardisation F&B. Économie de matière : <strong>${diffDH.toFixed(2)} DH</strong>.`,
          actionType: 'apply_standard',
          actionLabel: '🟢 Copier Standard',
          financialImpact: `+${Math.round(diffDH * 45).toLocaleString('fr-FR')} DH / mois`
        });
      }

      // 4. ALERTES CRITIQUES (Food Cost >= 38%)
      if (gc.foodCost >= 38 || (price > 35 && gc.grossMarginDH < 22)) {
        criticalAlerts.push({
          recipeName: recipe.name,
          category: recipe.category,
          recipeIndex: idx,
          priority: 'high',
          currentCost: gc.cost,
          currentFC: gc.foodCost,
          currentPrice: price,
          grossMarginDH: gc.grossMarginDH,
          title: `⚠️ Alerte Rentabilité : Food Cost Critique (${gc.foodCost}%)`,
          desc: `Marge nette fortement érodée (${gc.grossMarginDH.toFixed(2)} DH). Ce plat consomme trop de matière première par rapport à son tarif (${price} DH). Action corrective urgente recommandée sur le grammage ou le prix.`,
          actionType: 'inspect',
          actionLabel: '🔍 Examiner la Fiche',
          financialImpact: `Marge restante : seulement ${gc.grossMarginDH.toFixed(2)} DH / vente`
        });
      }
    });

    quickWins.sort((a, b) => b.diffDH - a.diffDH);
    pricingOpportunities.sort((a, b) => b.deltaPrice - a.deltaPrice);
    standardOpportunities.sort((a, b) => b.diffDH - a.diffDH);
    criticalAlerts.sort((a, b) => b.currentFC - a.currentFC);

    return {
      quickWins,
      pricingOpportunities,
      standardOpportunities,
      criticalAlerts,
      stats: {
        totalMonthlySavings: Math.round(totalMonthlySavings),
        totalPotentialPricingRev: Math.round(totalPotentialPricingRev),
        totalDishes: allRecipes.length,
        quickWinsCount: quickWins.length,
        pricingCount: pricingOpportunities.length,
        standardsCount: standardOpportunities.length,
        criticalCount: criticalAlerts.length
      }
    };
  }

  function renderAIOptimizerAgent() {
    const container = document.getElementById('ai-agent-wrapper');
    if (!container) return;

    const analysis = analyzeDatasetForOptimizations();
    const stats = analysis.stats;

    // Contexte des ventes journalières et Menu Engineering
    const salesCtx = getDailySalesContext();
    const dailySales = analyzeDailySales(salesCtx.salesRows);
    const menuEng = analyzeMenuEngineering(salesCtx.salesRows);

    let activeList = [];
    if (currentAITab === 'menu_engineering') {
      if (currentMenuEngFilter === 'star') activeList = menuEng.stars;
      else if (currentMenuEngFilter === 'plowhorse') activeList = menuEng.plowhorses;
      else if (currentMenuEngFilter === 'puzzle') activeList = menuEng.puzzles;
      else if (currentMenuEngFilter === 'dog') activeList = menuEng.dogs;
      else activeList = menuEng.items;
    }
    else if (currentAITab === 'daily_sales') activeList = dailySales.matchedSales;
    else if (currentAITab === 'quick_wins') activeList = analysis.quickWins;
    else if (currentAITab === 'pricing') activeList = analysis.pricingOpportunities;
    else if (currentAITab === 'standards') activeList = analysis.standardOpportunities;
    else if (currentAITab === 'critical') activeList = analysis.criticalAlerts;

    const displayedItems = activeList.slice(0, 16);
    const collapseIcon = isAIAgentCollapsed ? '▸ Déplier l\'analyse' : '▾ Réduire';

    // Options du sélecteur de dates journalières
    const dateOptionsHTML = `
      <option value="__auto__" ${salesCtx.effectiveDate === '__auto__' ? 'selected' : ''}>📅 Dernier Jour Disponible</option>
      ${salesCtx.availableDates.map(d => `<option value="${d}" ${salesCtx.effectiveDate === d ? 'selected' : ''}>📅 ${d}</option>`).join('')}
      <option value="__benchmark__" ${salesCtx.effectiveDate === '__benchmark__' ? 'selected' : ''}>⭐ Journée Type (Benchmark 125 couverts)</option>
    `;

    container.innerHTML = `
      <div class="ai-agent-header">
        <div class="ai-title-wrap">
          <div class="ai-pulse-indicator">
            <span class="ai-pulse-dot"></span>
          </div>
          <div>
            <h3 class="ai-agent-title">
              🤖 Agent Intelligent — Menu Engineering &amp; Cash Margin (Fès)
            </h3>
            <p class="ai-agent-subtitle">
              Audit permanent &bull; Matrice Kasavana &amp; Smith (Hors sodas, eaux &amp; suppléments) &bull; Cible Food Cost Café-Resto : <strong>32%</strong> &bull; Cash Net en Caisse : <span style="color:#059669; font-weight:900;">+${menuEng.stats.totalCashMargin.toLocaleString('fr-FR')} DH</span> (${menuEng.stats.totalQty} plats)
            </p>
          </div>
        </div>
        <div class="ai-agent-actions">
          <div class="ai-date-picker-wrap" title="Choisir la date des ventes journalières à analyser">
            <span style="font-size:12px;">📅 Jour :</span>
            <select class="ai-date-select" onchange="window.setAIDailySalesDate(this.value)">
              ${dateOptionsHTML}
            </select>
          </div>
          <button class="btn btn-secondary" style="font-size:12px; padding:5px 10px; font-weight:700;" onclick="window.renderAIOptimizerAgent ? window.renderAIOptimizerAgent() : null" title="Relancer l'analyse complète">
            🔄 Re-calculer
          </button>
          <button class="btn btn-secondary" style="font-size:12px; padding:5px 12px; font-weight:700;" onclick="window.toggleAIAgentCollapse()">
            ${collapseIcon}
          </button>
        </div>
      </div>

      <div class="ai-agent-body ${isAIAgentCollapsed ? 'collapsed' : ''}">
        
        <!-- BANDEAU DES 4 KPIS EN FONCTION DU CONTEXTE -->
        ${currentAITab === 'menu_engineering' ? `
          <div class="ai-stats-row">
            <div class="ai-stat-card" style="border-left: 4px solid #10b981;">
              <div class="ai-stat-label">💵 Cash Net Réel en Caisse</div>
              <div class="ai-stat-value text-success">+${menuEng.stats.totalCashMargin.toLocaleString('fr-FR')} DH</div>
              <div class="ai-stat-sub">CA Réalisé : <strong>${menuEng.stats.totalRevenue.toLocaleString('fr-FR')} DH</strong> (${menuEng.stats.totalQty} ventes)</div>
            </div>
            <div class="ai-stat-card" style="border-left: 4px solid #0284c7;">
              <div class="ai-stat-label">⚖️ Marge Cash Moyenne / Plat</div>
              <div class="ai-stat-value" style="color:#0284c7;">+${menuEng.stats.avgCashMarginPerPortion.toFixed(2)} DH</div>
              <div class="ai-stat-sub">Food Cost Réel Pondéré : <strong>${menuEng.stats.weightedFoodCost}%</strong></div>
            </div>
            <div class="ai-stat-card" style="border-left: 4px solid #8b5cf6;">
              <div class="ai-stat-label">⭐ Matrice Kasavana &amp; Smith</div>
              <div class="ai-stat-value" style="color:#8b5cf6;">${menuEng.stars.length} ⭐ | ${menuEng.puzzles.length} 🧩</div>
              <div class="ai-stat-sub">${menuEng.plowhorses.length} Chevaux (🐎) | ${menuEng.dogs.length} Chiens (🐕)</div>
            </div>
            <div class="ai-stat-card" style="border-left: 4px solid #f59e0b;">
              <div class="ai-stat-label">🚀 Potentiel Cash Additionnel</div>
              <div class="ai-stat-value" style="color:#f59e0b;">+${Math.round(menuEng.stats.totalCashMargin * 0.14).toLocaleString('fr-FR')} DH</div>
              <div class="ai-stat-sub">Gain net via 3 actions prioritaires</div>
            </div>
          </div>
        ` : (currentAITab === 'daily_sales' ? `
          <div class="ai-stats-row">
            <div class="ai-stat-card" style="border-left: 4px solid #0284c7;">
              <div class="ai-stat-label">📊 Ventes Réalisées ce Jour</div>
              <div class="ai-stat-value text-accent">${dailySales.totalItemsSold} plats</div>
              <div class="ai-stat-sub">CA Réalisé : <strong>${dailySales.totalDailyRevenue.toLocaleString('fr-FR')} DH</strong></div>
            </div>
            <div class="ai-stat-card" style="border-left: 4px solid #d97706;">
              <div class="ai-stat-label">🥩 Food Cost Réel Pondéré</div>
              <div class="ai-stat-value" style="color:#d97706;">${dailySales.weightedGcFC} %</div>
              <div class="ai-stat-sub">Cible Standard : <strong class="text-success">${dailySales.weightedStdFC} %</strong></div>
            </div>
            <div class="ai-stat-card" style="border-left: 4px solid #dc2626;">
              <div class="ai-stat-label">💸 Pertes Surdosage Aujourd'hui</div>
              <div class="ai-stat-value text-danger">-${dailySales.totalDailyLostMargin.toFixed(2)} DH</div>
              <div class="ai-stat-sub">Manque à gagner évitable sur le service</div>
            </div>
            <div class="ai-stat-card" style="border-left: 4px solid #16a34a;">
              <div class="ai-stat-label">🎯 Marge Récupérable Mensuelle</div>
              <div class="ai-stat-value text-success">+${Math.round(dailySales.totalDailyLostMargin * 30).toLocaleString('fr-FR')} DH</div>
              <div class="ai-stat-sub">Bénéfice net additionnel / mois</div>
            </div>
          </div>
        ` : `
          <div class="ai-stats-row">
            <div class="ai-stat-card">
              <div class="ai-stat-label">💰 Gisement Total Identifié</div>
              <div class="ai-stat-value text-success">+${stats.totalMonthlySavings.toLocaleString('fr-FR')} DH</div>
              <div class="ai-stat-sub">Économie mensuelle estimée / mois</div>
            </div>
            <div class="ai-stat-card">
              <div class="ai-stat-label">⚡ Top Quick Wins</div>
              <div class="ai-stat-value text-accent">${stats.quickWinsCount} plats</div>
              <div class="ai-stat-sub">Gains immédiats &ge; 3.00 DH / assiette</div>
            </div>
            <div class="ai-stat-card">
              <div class="ai-stat-label">💡 Leviers de Prix Souples (Fès)</div>
              <div class="ai-stat-value" style="color:#0284c7;">${stats.pricingCount} plats</div>
              <div class="ai-stat-sub">+${stats.totalPotentialPricingRev.toLocaleString('fr-FR')} DH de marge additionnelle</div>
            </div>
            <div class="ai-stat-card">
              <div class="ai-stat-label">🚨 Alertes Food Cost</div>
              <div class="ai-stat-value ${stats.criticalCount > 0 ? 'text-danger' : 'text-success'}">${stats.criticalCount} plats</div>
              <div class="ai-stat-sub">Food Cost critique &ge; 38%</div>
            </div>
          </div>
        `)}

        <!-- ONGLETS FILTRES DE L'AGENT -->
        <div class="ai-nav-pills">
          <button class="ai-pill ${currentAITab === 'menu_engineering' ? 'active' : ''}" onclick="window.setAITab('menu_engineering')">
            🎯 Menu Engineering (Cash Margin) <span class="ai-pill-count">${menuEng.items.length}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'daily_sales' ? 'active' : ''}" onclick="window.setAITab('daily_sales')">
            📅 Ventes du Jour <span class="ai-pill-count">${dailySales.matchedSales.length}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'quick_wins' ? 'active' : ''}" onclick="window.setAITab('quick_wins')">
            🔥 Quick Wins (Catalogue) <span class="ai-pill-count">${stats.quickWinsCount}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'pricing' ? 'active' : ''}" onclick="window.setAITab('pricing')">
            💡 Optimisation Prix (Marché Fès) <span class="ai-pill-count">${stats.pricingCount}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'standards' ? 'active' : ''}" onclick="window.setAITab('standards')">
            ⚖️ Réalignement Standards <span class="ai-pill-count">${stats.standardsCount}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'critical' ? 'active' : ''}" onclick="window.setAITab('critical')">
            🚨 Alertes Rentabilité <span class="ai-pill-count">${stats.criticalCount}</span>
          </button>
        </div>

        ${currentAITab === 'menu_engineering' ? `
          <!-- BANDEAU DES 3 ACTIONS PRIORITAIRES DE TRÉSORERIE -->
          <div class="ai-priority-banner">
            <div class="ai-priority-header">
              <span style="font-size:17px;">🚀</span>
              <span>3 Actions Prioritaires Menu Engineering (Maximiser le Cash en Caisse) :</span>
            </div>
            <div class="ai-priority-grid">
              ${menuEng.priorityActions.map((action, i) => `
                <div class="ai-priority-col">
                  <div class="ai-priority-badge">Action ${i + 1}</div>
                  <div class="ai-priority-title">${escapeHtml(action.title)}</div>
                  <div class="ai-priority-text">${action.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- BARRE DE SOUS-FILTRES DE LA MATRICE -->
          <div class="ai-quadrant-filter-bar">
            <span style="font-size:12px; font-weight:800; color:var(--text-muted); margin-right:4px;">
              📊 Filtrer la Matrice :
            </span>
            <button class="ai-sub-pill ${currentMenuEngFilter === 'all' ? 'active' : ''}" onclick="window.setMenuEngFilter('all')">
              Tous (${menuEng.items.length})
            </button>
            <button class="ai-sub-pill ${currentMenuEngFilter === 'star' ? 'active' : ''}" onclick="window.setMenuEngFilter('star')">
              ⭐ Étoiles (${menuEng.stars.length})
            </button>
            <button class="ai-sub-pill ${currentMenuEngFilter === 'plowhorse' ? 'active' : ''}" onclick="window.setMenuEngFilter('plowhorse')">
              🐎 Chevaux de Trait (${menuEng.plowhorses.length})
            </button>
            <button class="ai-sub-pill ${currentMenuEngFilter === 'puzzle' ? 'active' : ''}" onclick="window.setMenuEngFilter('puzzle')">
              🧩 Puzzles (${menuEng.puzzles.length})
            </button>
            <button class="ai-sub-pill ${currentMenuEngFilter === 'dog' ? 'active' : ''}" onclick="window.setMenuEngFilter('dog')">
              🐕 Chiens (${menuEng.dogs.length})
            </button>
            <div style="margin-left:auto; display:inline-flex; align-items:center; gap:5px; font-size:11.5px; color:var(--text-muted); background:var(--bg); padding:3px 9px; border-radius:7px; border:1px solid var(--border);" title="Les sodas, eaux minérales et suppléments/extras cuisine sont exclus de la matrice pour concentrer l'analyse sur vos véritables recettes et créations culinaires.">
              <span>🛡️</span>
              <span><strong>Sodas, Eaux &amp; Extras exclus</strong></span>
            </div>
          </div>
        ` : ''}

        ${salesCtx.isBenchmark && (currentAITab === 'daily_sales' || currentAITab === 'menu_engineering') ? `
          <div style="margin-bottom:14px; padding:10px 14px; background:rgba(2,132,199,0.08); border:1px solid rgba(2,132,199,0.25); border-radius:10px; font-size:12px; color:var(--text); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <span>💡 <strong>Service de Référence Actif :</strong> Analyse basée sur un service type étalonné. Pour analyser vos ventes réelles du jour, importez votre ticket caisse dans <a href="consommation.html" style="color:#0284c7; font-weight:800; text-decoration:none;">📊 Déstockage</a>.</span>
            <a href="consommation.html" class="btn btn-primary" style="font-size:11.5px; padding:4px 10px; text-decoration:none;">📥 Importer Ventes du Jour</a>
          </div>
        ` : ''}

        <!-- GRILLE DES IDÉES & ACTIONS QUOTIDIENNES -->
        <div class="ai-ideas-grid">
          ${displayedItems.length === 0 ? `
            <div style="grid-column: 1 / -1; padding:30px; text-align:center; color:var(--text-muted); background:var(--bg); border-radius:12px; border:1px dashed var(--border);">
              ✨ Aucun article ne correspond à ce filtre pour la période sélectionnée.
            </div>
          ` : displayedItems.map(item => {
            // Mode Menu Engineering & Cash Margin
            if (currentAITab === 'menu_engineering') {
              const qBadgeClass = item.quadrant === 'star' ? 'badge-star' : (item.quadrant === 'plowhorse' ? 'badge-plowhorse' : (item.quadrant === 'puzzle' ? 'badge-puzzle' : 'badge-dog'));
              const priorityBorderClass = item.quadrant === 'star' ? 'priority-star' : (item.quadrant === 'puzzle' ? 'priority-puzzle' : (item.quadrant === 'plowhorse' ? 'priority-medium' : 'priority-dog'));

              return `
                <div class="ai-idea-card ${priorityBorderClass}">
                  <div class="ai-idea-top">
                    <div>
                      <span class="ai-dish-cat">${escapeHtml(item.category)}</span>
                      <h4 class="ai-dish-name">${escapeHtml(item.recipeName)}</h4>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                      <span class="quadrant-badge ${qBadgeClass}">${item.quadrantLabel}</span>
                      ${item.isBankFeeder ? `<span class="badge-bank-feeder">💰 Nourricier Trésorerie</span>` : ''}
                      ${item.isCompensator ? `<span class="badge-compensator">🍹 Compensateur Marge</span>` : ''}
                    </div>
                  </div>

                  <div class="ai-metrics-compare">
                    <div class="ai-metric-col">
                      <span class="ai-metric-title">Vente &amp; Coût Matière</span>
                      <span class="ai-metric-val">
                        ${item.sellPrice} DH | Coût : ${item.cost.toFixed(2)} DH (FC ${item.foodCost.toFixed(1)}%)
                      </span>
                    </div>
                    <div class="ai-metric-col">
                      <span class="ai-metric-title">Marge Cash Unitaire &bull; Volume</span>
                      <span class="ai-cash-huge">
                        +${item.cashMargin.toFixed(2)} DH <span style="font-size:11.5px; font-weight:700; color:var(--text-muted);">(&times; ${item.qtySold} vendus)</span>
                      </span>
                    </div>
                  </div>

                  <div style="margin: 8px 0 6px 0; padding: 6px 10px; background: rgba(16, 185, 129, 0.08); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); display:flex; justify-content:space-between; align-items:center; font-size:12px;">
                    <span style="font-weight:700; color:var(--text);">💵 Liquidités nettes versées en caisse :</span>
                    <strong style="font-size:13.5px; color:#059669;">+${Math.round(item.totalCashMargin).toLocaleString('fr-FR')} DH</strong>
                  </div>

                  <div class="ai-idea-desc">
                    ${item.quadrantDesc}
                  </div>

                  <div class="ai-idea-actions">
                    ${item.actionType === 'apply_standard' ? `
                      <button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${escapeHtml(item.recipeName).replace(/'/g, "\\'")}', 'apply_standard')">
                        ${item.actionLabel}
                      </button>
                    ` : ''}
                    ${item.actionType === 'apply_price' ? `
                      <button class="ai-btn-action btn-apply-price" onclick="window.applyAIOptimization('${escapeHtml(item.recipeName).replace(/'/g, "\\'")}', 'apply_price', ${item.actionParam})">
                        ${item.actionLabel}
                      </button>
                    ` : ''}
                    <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${escapeHtml(item.recipeName).replace(/'/g, "\\'")}', 'inspect')">
                      🔍 Examiner la Fiche
                    </button>
                  </div>
                </div>
              `;
            }
            // Mode Ventes Journalières
            if (currentAITab === 'daily_sales') {
              const lossClass = item.dailyLostDH >= 100 ? 'priority-high' : (item.dailyLostDH >= 30 ? 'priority-medium' : 'priority-standard');
              return `
                <div class="ai-idea-card ${lossClass}">
                  <div class="ai-idea-top">
                    <div>
                      <span class="ai-dish-cat">${escapeHtml(item.category)}</span>
                      <h4 class="ai-dish-name">${escapeHtml(item.recipeName)}</h4>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:3px;">
                      <span class="ai-daily-qty-chip">📦 ${item.qtySold} vendus</span>
                      ${item.dailyLostDH > 0 
                        ? `<span class="ai-daily-loss-chip">Perte ce jour : -${item.dailyLostDH.toFixed(2)} DH</span>` 
                        : `<span class="ai-gain-chip" style="font-size:11px;">Marge Conforme ✅</span>`}
                    </div>
                  </div>

                  <div class="ai-metrics-compare">
                    <div class="ai-metric-col">
                      <span class="ai-metric-title">Vente &amp; Coût Grey Corner</span>
                      <span class="ai-metric-val" style="color:${item.gcFC > 35 ? '#dc2626' : 'var(--text)'};">
                        ${item.sellPrice} DH | Coût : ${item.gcCostUnit.toFixed(2)} DH (FC ${item.gcFC}%)
                      </span>
                    </div>
                    <div class="ai-metric-col">
                      <span class="ai-metric-title">Standard Métier Conseillé</span>
                      <span class="ai-metric-val text-success">
                        Coût : ${item.stdCostUnit.toFixed(2)} DH (FC ${item.stdFC}%)
                      </span>
                    </div>
                  </div>

                  <div class="ai-idea-desc">
                    ${item.unitDiffDH > 0 
                      ? `Surdosage unitaire de <strong>+${item.unitDiffDH.toFixed(2)} DH</strong> par assiette. Sur les <strong>${item.qtySold} ventes d'aujourd'hui</strong>, vous avez perdu <strong>${item.dailyLostDH.toFixed(2)} DH de marge nette</strong>.` 
                      : `Portion parfaitement alignée sur la norme internationale. Marge brute réalisée aujourd'hui : <strong>${((item.sellPrice - item.gcCostUnit) * item.qtySold).toFixed(2)} DH</strong>.`}
                  </div>

                  <div class="ai-idea-actions">
                    ${item.unitDiffDH > 0 ? `
                      <button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${escapeHtml(item.recipeName).replace(/'/g, "\\'")}', 'apply_standard')">
                        🟢 Appliquer Standard (+${item.unitDiffDH.toFixed(2)} DH/v)
                      </button>
                    ` : ''}
                    <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${escapeHtml(item.recipeName).replace(/'/g, "\\'")}', 'inspect')">
                      🔍 Voir la Fiche
                    </button>
                  </div>
                </div>
              `;
            }

            // Mode Recommandations Globales (Quick Wins, Pricing, Standards, Alertes)
            const priorityClass = item.priority === 'high' ? 'priority-high' : (item.priority === 'standard' ? 'priority-standard' : 'priority-medium');
            return `
              <div class="ai-idea-card ${priorityClass}">
                <div class="ai-idea-top">
                  <div>
                    <span class="ai-dish-cat">${escapeHtml(item.category)}</span>
                    <h4 class="ai-dish-name">${escapeHtml(item.recipeName)}</h4>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                    ${item.monthlyGain ? `<span class="ai-gain-chip">💰 +${item.monthlyGain.toLocaleString('fr-FR')} DH/m</span>` : ''}
                    ${item.marketInfo ? `<span class="ai-market-badge">📍 Fès : ${item.marketInfo.marketRange}</span>` : ''}
                    ${item.cashMarginDH ? `<span class="ai-cash-margin-chip">💵 Marge : +${item.cashMarginDH.toFixed(2)} DH</span>` : ''}
                  </div>
                </div>

                ${item.currentFC ? `
                  <div class="ai-metrics-compare">
                    <div class="ai-metric-col">
                      <span class="ai-metric-title">Situation Actuelle</span>
                      <span class="ai-metric-val" style="color:${item.currentFC > 35 ? '#dc2626' : 'var(--text)'};">
                        FC ${item.currentFC}% ${item.currentCost ? `(${item.currentCost.toFixed(2)} DH)` : ''}
                      </span>
                    </div>
                    <div class="ai-metric-col">
                      <span class="ai-metric-title">Objectif Café-Resto Fès</span>
                      <span class="ai-metric-val text-success">
                        ${item.stdFC ? `FC ${item.stdFC}% (${item.stdCost.toFixed(2)} DH)` : (item.targetPrice ? `${item.targetPrice} DH (FC ${item.newFC}%)` : `Marge saine`)}
                      </span>
                    </div>
                  </div>
                ` : ''}

                <div class="ai-idea-desc">
                  ${item.desc}
                </div>

                <div class="ai-idea-actions">
                  ${item.actionType === 'apply_standard' ? `
                    <button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${escapeHtml(item.recipeName).replace(/'/g, "\\'")}', 'apply_standard')">
                      ${item.actionLabel}
                    </button>
                  ` : ''}
                  ${item.actionType === 'apply_price' ? `
                    <button class="ai-btn-action btn-apply-price" onclick="window.applyAIOptimization('${escapeHtml(item.recipeName).replace(/'/g, "\\'")}', 'apply_price', ${item.actionParam})">
                      ${item.actionLabel}
                    </button>
                  ` : ''}
                  <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${escapeHtml(item.recipeName).replace(/'/g, "\\'")}', 'inspect')">
                    🔍 Voir la Fiche
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${activeList.length > 14 ? `
          <div style="margin-top:16px; text-align:center; font-size:12px; color:var(--text-muted);">
            Affichage des 14 éléments prioritaires sur un total de <strong>${activeList.length}</strong> identifiés dans cette vue.
          </div>
        ` : ''}

      </div>
    `;
  }
  window.renderAIOptimizerAgent = renderAIOptimizerAgent;

  let isComparatorTableView = false;

  window.toggleComparatorViewMode = function() {
    isComparatorTableView = !isComparatorTableView;
    const cardsContainer = document.getElementById('recipes-comparator-container');
    const tableContainer = document.getElementById('comparator-table-container');
    const btn = document.getElementById('btn-toggle-comp-view');

    if (btn) {
      btn.innerHTML = isComparatorTableView ? '📋 Vue : Cartes Comparatives' : '📊 Vue : Tableau Synthétique';
    }

    if (cardsContainer) cardsContainer.style.display = isComparatorTableView ? 'none' : 'grid';
    if (tableContainer) tableContainer.style.display = isComparatorTableView ? 'block' : 'none';

    if (isComparatorTableView) {
      renderComparatorTable();
    } else {
      renderRecipeCards();
    }
  };

  function renderComparatorTable() {
    const container = document.getElementById('comparator-table-container');
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
      container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-muted);">Aucun plat trouvé dans cette vue.</div>';
      return;
    }

    let rowsHTML = filtered.map((recipe, idx) => {
      const gcFCColor = recipe.greyCorner.foodCost <= 32 ? '#16a34a' : (recipe.greyCorner.foodCost <= 38 ? '#d97706' : '#dc2626');
      const stdFCColor = recipe.standard.foodCost <= 32 ? '#16a34a' : (recipe.standard.foodCost <= 38 ? '#d97706' : '#dc2626');
      const diffColor = recipe.standard.diffDH > 0 ? '#0284c7' : '#64748b';

      return `
        <tr style="border-bottom:1px solid var(--border); transition:background 0.15s;">
          <td style="padding:12px 14px; font-weight:800; color:var(--text);">${escapeHtml(recipe.name)}</td>
          <td style="padding:12px 14px; color:var(--text-muted); font-size:12px;">${escapeHtml(recipe.category)}</td>
          <td style="padding:12px 14px; text-align:right; font-weight:700;">${recipe.sellPrice.toFixed(2)} DH</td>
          <td style="padding:12px 14px; text-align:right; font-weight:800;">
            ${recipe.greyCorner.cost.toFixed(2)} DH
            <span style="display:inline-block; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:4px; font-weight:800; background:rgba(${recipe.greyCorner.foodCost <= 32 ? '22,163,74,0.12' : (recipe.greyCorner.foodCost <= 38 ? '217,119,6,0.12' : '220,38,38,0.12')}); color:${gcFCColor};">
              ${recipe.greyCorner.foodCost}%
            </span>
          </td>
          <td style="padding:12px 14px; text-align:right; font-weight:700; color:var(--text-muted);">
            ${recipe.standard.cost.toFixed(2)} DH
            <span style="display:inline-block; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:4px; font-weight:700; color:${stdFCColor};">
              ${recipe.standard.foodCost}%
            </span>
          </td>
          <td style="padding:12px 14px; text-align:right; font-weight:800; color:${diffColor};">
            ${recipe.standard.diffDH > 0 ? '+' : ''}${recipe.standard.diffDH.toFixed(2)} DH
          </td>
          <td style="padding:12px 14px; text-align:center;">
            <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
              <button class="btn btn-secondary" id="btn-table-drawer-${idx}" style="padding:5px 8px; font-size:11.5px; font-weight:700; border-radius:6px; cursor:pointer;" onclick="window.toggleTableRowDrawer(${idx})">
                📂 Détails
              </button>
              <button class="btn btn-secondary" style="padding:5px 8px; font-size:11.5px; font-weight:700; border-radius:6px; cursor:pointer;" onclick="window.copyStandardToRecipe(${idx})">
                🟢 Standard
              </button>
            </div>
          </td>
        </tr>
        <tr id="table-row-drawer-${idx}" style="display:none; background:var(--bg-subtle, rgba(0,0,0,0.02)); border-bottom:2px solid var(--border);">
          <td colspan="7" style="padding:14px 18px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div style="background:var(--paper); padding:12px; border-radius:8px; border:1px solid var(--border);">
                <div style="font-weight:800; font-size:12.5px; color:#0284c7; margin-bottom:6px;">
                  🔵 Détail Coût Grey Corner (${recipe.greyCorner.cost.toFixed(2)} DH)
                </div>
                ${renderPortionCostBreakdownHTML(recipe.greyCorner.tech, recipe.sellPrice, 'gc', idx)}
              </div>
              <div style="background:var(--paper); padding:12px; border-radius:8px; border:1px solid var(--border);">
                <div style="font-weight:800; font-size:12.5px; color:#16a34a; margin-bottom:6px;">
                  🟢 Détail Coût Standard Int. (${recipe.standard.cost.toFixed(2)} DH)
                </div>
                ${renderPortionCostBreakdownHTML(recipe.standard.tech, recipe.sellPrice, 'std', idx)}
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:var(--thead-bg, #f8fafc); border-bottom:1.5px solid var(--border); text-transform:uppercase; font-size:11px; font-weight:800; color:var(--text-muted);">
            <th style="padding:12px 14px; text-align:left;">Plat / Recette</th>
            <th style="padding:12px 14px; text-align:left;">Catégorie</th>
            <th style="padding:12px 14px; text-align:right;">Prix Vente</th>
            <th style="padding:12px 14px; text-align:right;">Coût Grey Corner</th>
            <th style="padding:12px 14px; text-align:right;">Coût Standard Int.</th>
            <th style="padding:12px 14px; text-align:right;">Écart DH</th>
            <th style="padding:12px 14px; text-align:center;">Action Rapide</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    `;
  }

  // Filtrage et Rendu des cartes de recettes
  function renderRecipeCards() {
    if (isComparatorTableView) {
      renderComparatorTable();
      return;
    }

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
    const gcFCClass = recipe.greyCorner.foodCost <= 32 ? 'badge-ok' : (recipe.greyCorner.foodCost <= 38 ? 'badge-warn' : 'badge-danger');
    const stdFCClass = recipe.standard.foodCost <= 32 ? 'badge-ok' : (recipe.standard.foodCost <= 38 ? 'badge-warn' : 'badge-danger');

    const diffBadge = recipe.standard.diffDH > 0 
      ? `<span id="badge-diff-${idx}" class="badge-gain" style="background:rgba(2, 132, 199, 0.1); color:#0284c7; border-color:rgba(2, 132, 199, 0.3);">Écart vs Standard : +${recipe.standard.diffDH.toFixed(2)} DH</span>`
      : `<span id="badge-diff-${idx}" class="badge-neutral">Marge conforme au standard</span>`;

    return `
      <div class="comparative-card" id="card-${idx}" data-recipe-name="${escapeHtml(recipe.name)}" data-category="${escapeHtml(recipe.category)}">
        <!-- HEADER DU PLAT -->
        <div class="card-top-bar">
          <div class="card-title-group">
            <span class="cat-tag">${recipe.category}</span>
            <h3 class="dish-title">${recipe.name}</h3>
          </div>
          <div class="card-price-group">
            <span class="sell-price-tag" style="display:inline-flex; align-items:center; gap:6px;">
              Prix Vente : 
              <input type="number" 
                     class="sell-price-input" 
                     value="${recipe.sellPrice}" 
                     step="0.5" 
                     min="0" 
                     placeholder="0" 
                     title="Saisir ou modifier le prix de vente du plat" 
                     oninput="window.updateRecipeSellPrice(${idx}, this.value)" 
                     style="width:70px; padding:2px 6px; font-weight:800; border:1.5px solid #0284c7; border-radius:6px; background:#fff; text-align:center; font-size:13px; color:#0f172a;" /> DH
            </span>
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
              <button class="btn-preset" title="Ajouter un ingrédient à la fiche" onclick="window.addIngredientToRecipe(${idx})">➕ Ajouter ingrédient</button>
              <button class="btn-preset text-success" title="Appliquer le standard international sur la fiche Grey Corner" onclick="window.copyStandardToRecipe(${idx})">🟢 Copier Standard Int.</button>
              <button class="btn-preset text-danger" title="Rétablir la fiche d'origine" onclick="window.resetRecipeToInitial(${idx})">🔄 Rétablir d'origine</button>
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

            <!-- TIROIR ACCORDÉON : DÉTAILS DU COÛT DE PORTION GREY CORNER -->
            <div class="portion-drawer-wrapper">
              <button type="button" class="btn-drawer-toggle gc-drawer-btn" id="btn-drawer-gc-${idx}" onclick="window.togglePortionCostDrawer(${idx}, 'gc')" title="Déplier / replier le détail du coût par ingrédient">
                <span class="drawer-title">📂 Détails Coût Portion (Tiroir)</span>
                <span class="drawer-icon" id="icon-drawer-gc-${idx}">▼</span>
              </button>
              <div class="portion-drawer-panel" id="drawer-panel-gc-${idx}" style="display:none;">
                ${renderPortionCostBreakdownHTML(recipe.greyCorner.tech, recipe.sellPrice, 'gc', idx)}
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

            <!-- TIROIR ACCORDÉON : DÉTAILS DU COÛT DE PORTION STANDARD -->
            <div class="portion-drawer-wrapper">
              <button type="button" class="btn-drawer-toggle std-drawer-btn" id="btn-drawer-std-${idx}" onclick="window.togglePortionCostDrawer(${idx}, 'std')" title="Déplier / replier le détail du coût standard par ingrédient">
                <span class="drawer-title">📂 Détails Coût Standard (Tiroir)</span>
                <span class="drawer-icon" id="icon-drawer-std-${idx}">▼</span>
              </button>
              <div class="portion-drawer-panel" id="drawer-panel-std-${idx}" style="display:none;">
                ${renderPortionCostBreakdownHTML(recipe.standard.tech, recipe.sellPrice, 'std', idx)}
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // Rendu du tiroir détaillé de coût de portion (décomposition par ingrédient)
  function renderPortionCostBreakdownHTML(techArray, sellPrice, type, cardIdx) {
    const calcFn = (typeof window !== 'undefined' && window.calculateRecipeFoodCost) ? window.calculateRecipeFoodCost : (typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost : () => ({ cost: 0, breakdown: [] }));
    const costObj = calcFn(techArray, sellPrice || 0);
    const breakdown = costObj.breakdown || [];
    const totalCost = costObj.cost || 0;

    if (breakdown.length === 0) {
      return `<div style="padding:10px; font-size:12px; color:var(--text-muted); text-align:center;">Aucun détail d'ingrédient disponible.</div>`;
    }

    const rows = breakdown.map(item => {
      let unitLbl = item.unit === 'g' ? 'DH/kg' : (item.unit === 'ml' ? 'DH/L' : 'DH/u');
      let displayPrice = (item.unit === 'g' || item.unit === 'ml') ? (item.unitPrice * 1000) : item.unitPrice;
      let pctOfPortion = totalCost > 0 ? Math.round((item.cost / totalCost) * 1000) / 10 : 0;
      let barColor = type === 'gc' ? '#0284c7' : '#16a34a';

      return `
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:5px 7px; font-weight:700; color:var(--text); font-size:12px;">
            ${escapeHtml(item.ingredient)}
          </td>
          <td style="padding:5px 7px; text-align:center; color:var(--text-muted); font-size:11.5px; white-space:nowrap;">
            ${escapeHtml(item.quantity)}
          </td>
          <td style="padding:5px 7px; text-align:right; color:var(--text-muted); font-size:11px; white-space:nowrap;">
            ${displayPrice.toFixed(2)} <span style="font-size:9.5px;">${unitLbl}</span>
          </td>
          <td style="padding:5px 7px; text-align:right; font-weight:800; color:var(--text); font-size:12px; white-space:nowrap;">
            ${item.cost.toFixed(2)} DH
          </td>
          <td style="padding:5px 7px; text-align:right; width:75px;">
            <div style="display:flex; align-items:center; justify-content:flex-end; gap:5px;">
              <span style="font-size:11px; font-weight:700; color:${barColor}; min-width:32px;">${pctOfPortion}%</span>
              <div style="width:26px; height:5px; background:var(--border); border-radius:3px; overflow:hidden;">
                <div style="width:${Math.min(100, pctOfPortion)}%; height:100%; background:${barColor};"></div>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="drawer-inner-box">
        <table class="drawer-cost-table" style="width:100%; border-collapse:collapse; font-size:12px;">
          <thead>
            <tr style="border-bottom:1.5px solid var(--border); font-size:10.5px; text-transform:uppercase; color:var(--text-muted); background:var(--thead-bg, rgba(0,0,0,0.02));">
              <th style="padding:6px 7px; text-align:left;">Ingrédient</th>
              <th style="padding:6px 7px; text-align:center;">Dose</th>
              <th style="padding:6px 7px; text-align:right;">P.U. Achat</th>
              <th style="padding:6px 7px; text-align:right;">Coût</th>
              <th style="padding:6px 7px; text-align:right;">Part</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr style="border-top:1.5px solid var(--border); font-weight:900; background:rgba(0,0,0,0.03);">
              <td colspan="3" style="padding:7px; text-align:left; font-size:11.5px;">TOTAL COÛT DE PORTION</td>
              <td style="padding:7px; text-align:right; color:${type === 'gc' ? '#0284c7' : '#16a34a'}; font-size:12.5px; font-weight:900;">
                ${totalCost.toFixed(2)} DH
              </td>
              <td style="padding:7px; text-align:right; font-size:11px; color:var(--text-muted);">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }

  // Fonction de bascule (ouverture/fermeture) du tiroir
  window.togglePortionCostDrawer = function(idx, type) {
    const panel = document.getElementById(`drawer-panel-${type}-${idx}`);
    const btn = document.getElementById(`btn-drawer-${type}-${idx}`);
    const icon = document.getElementById(`icon-drawer-${type}-${idx}`);
    if (!panel) return;

    const isOpen = panel.style.display !== 'none';
    if (isOpen) {
      panel.style.display = 'none';
      if (icon) icon.textContent = '▼';
      if (btn) btn.classList.remove('drawer-open');
    } else {
      panel.style.display = 'block';
      if (icon) icon.textContent = '▲';
      if (btn) btn.classList.add('drawer-open');
    }
  };

  // Bascule du tiroir dans le tableau synthétique
  window.toggleTableRowDrawer = function(idx) {
    const row = document.getElementById(`table-row-drawer-${idx}`);
    const btn = document.getElementById(`btn-table-drawer-${idx}`);
    if (!row) return;
    const isOpen = row.style.display !== 'none';
    row.style.display = isOpen ? 'none' : 'table-row';
    if (btn) btn.innerHTML = isOpen ? '📂 Détails' : '🔼 Masquer';
  };

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
          <input type="text" class="ing-name-input" value="${escapeHtml(ing)}" data-recipe="${escapeHtml(recipeName)}" data-idx="${idx}" data-ing-idx="${ingIdx}" oninput="window.updateIngredientName(${idx}, ${ingIdx}, this.value)" onchange="window.updateIngredientName(${idx}, ${ingIdx}, this.value)" />
          <div class="ing-input-wrap">
            <button type="button" class="btn-step" onclick="window.stepIngredientVal(${idx}, ${ingIdx}, -${step})">-</button>
            <input type="number" 
                   class="ing-num-input" 
                   value="${numVal}" 
                   step="${step}" 
                   min="0"
                   data-recipe="${escapeHtml(recipeName)}"
                   data-idx="${idx}"
                   data-ing-idx="${ingIdx}"
                   data-unit="${unit}"
                   oninput="window.onIngredientInputChange(${idx}, ${ingIdx}, this.value, '${unit}')" />
            <button type="button" class="btn-step" onclick="window.stepIngredientVal(${idx}, ${ingIdx}, +${step})">+</button>
            <span class="ing-unit-tag">${unit}</span>
            <button type="button" class="btn-del-ing" title="Supprimer cet ingrédient" onclick="window.removeIngredientFromRecipe(${idx}, ${ingIdx})">✕</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Résolution robuste de la recette (par index de carte ou par nom)
  function resolveRecipe(p1, p2) {
    let cardIdx = null;
    let recipeName = null;
    let cardCat = null;

    const isNum1 = (typeof p1 === 'number') || (typeof p1 === 'string' && /^\d+$/.test(String(p1).trim()));
    const isNum2 = (typeof p2 === 'number') || (typeof p2 === 'string' && /^\d+$/.test(String(p2).trim()));

    if (isNum1) {
      cardIdx = parseInt(p1, 10);
      const card = document.getElementById(`card-${cardIdx}`);
      recipeName = card ? card.getAttribute('data-recipe-name') : (allRecipes[cardIdx] ? allRecipes[cardIdx].name : null);
      if (card && card.getAttribute('data-category')) cardCat = card.getAttribute('data-category');
    } else if (typeof p1 === 'string') {
      recipeName = p1;
      if (isNum2) cardIdx = parseInt(p2, 10);
    }

    let recipe = null;
    if (recipeName) {
      const cTarget = cleanText(recipeName);
      // 1. Recherche exacte par nom
      recipe = allRecipes.find(r => r.name === recipeName);
      // 2. Recherche par nom normalisé
      if (!recipe) {
        recipe = allRecipes.find(r => cleanText(r.name) === cTarget);
      }
      // 3. Recherche contextuelle dans la même catégorie si disponible
      if (!recipe && cardCat) {
        recipe = allRecipes.find(r => r.category === cardCat && (cleanText(r.name).includes(cTarget) || cTarget.includes(cleanText(r.name))));
      }
    }

    if (!recipe && cardIdx !== null && allRecipes[cardIdx]) {
      recipe = allRecipes[cardIdx];
      recipeName = recipe.name;
    }

    return { recipe, cardIdx: (cardIdx !== null ? cardIdx : 0), recipeName: (recipe ? recipe.name : recipeName) };
  }

  // Mise à jour du prix de vente d'un plat
  window.updateRecipeSellPrice = function(p1, p2, p3) {
    let recipe, cardIdx, newSellPrice;
    if (arguments.length >= 3) {
      ({ recipe, cardIdx } = resolveRecipe(p1, p2));
      newSellPrice = parseFloat(p3) || 0;
    } else {
      ({ recipe, cardIdx } = resolveRecipe(p1));
      newSellPrice = parseFloat(p2) || 0;
    }
    if (!recipe) return;

    recipe.sellPrice = newSellPrice;

    // Enregistrer dans editedRecipes
    if (!editedRecipes[recipe.name]) {
      editedRecipes[recipe.name] = { tech: recipe.greyCorner.tech.slice(), updatedAt: Date.now() };
    }
    editedRecipes[recipe.name].sellPrice = newSellPrice;
    editedRecipes[recipe.name].updatedAt = Date.now();
    saveEdits(false);

    // Recalculer le coût et la marge Grey Corner
    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.greyCorner.breakdown = costObj.breakdown;

    // Recalculer le standard comparatif
    const standardCostObj = window.calculateRecipeFoodCost(recipe.standard.tech, recipe.sellPrice);
    recipe.standard.cost = standardCostObj.cost;
    recipe.standard.foodCost = standardCostObj.foodCost;
    recipe.standard.margin = standardCostObj.margin;
    recipe.standard.grossMarginDH = standardCostObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    // Mettre à jour l'affichage de la carte
    updateCardMetrics(cardIdx, recipe);
    renderSummaryKPIs();
  };

  // Mise à jour de la valeur d'un ingrédient
  window.onIngredientInputChange = function(p1, p2, p3, p4, p5) {
    let recipe, cardIdx, ingIdx, newVal, unit;
    if (arguments.length >= 5) {
      ({ recipe, cardIdx } = resolveRecipe(p1, p2));
      ingIdx = parseInt(p3, 10); newVal = p4; unit = p5;
    } else {
      ({ recipe, cardIdx } = resolveRecipe(p1));
      ingIdx = parseInt(p2, 10); newVal = p3; unit = p4;
    }
    if (!recipe || isNaN(ingIdx)) return;

    const val = parseFloat(newVal) || 0;
    const oldLine = recipe.greyCorner.tech[ingIdx];
    if (!oldLine) return;

    const parts = oldLine.split(':');
    const ingName = parts[0].trim();
    recipe.greyCorner.tech[ingIdx] = `${ingName} : ${val} ${unit || 'g'}`;

    // Enregistrer dans editedRecipes
    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

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
  window.updateIngredientName = function(p1, p2, p3, p4) {
    let recipe, cardIdx, ingIdx, newName;
    if (arguments.length >= 4) {
      ({ recipe, cardIdx } = resolveRecipe(p1, p2));
      ingIdx = parseInt(p3, 10); newName = p4;
    } else {
      ({ recipe, cardIdx } = resolveRecipe(p1));
      ingIdx = parseInt(p2, 10); newName = p3;
    }
    if (!recipe || isNaN(ingIdx)) return;

    const oldLine = recipe.greyCorner.tech[ingIdx];
    if (!oldLine) return;

    const parts = oldLine.split(':');
    const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';
    recipe.greyCorner.tech[ingIdx] = `${(newName || '').trim()} : ${qtyStr}`;

    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;

    updateCardMetrics(cardIdx, recipe);
    renderSummaryKPIs();
  };

  // Pas d'incrément (+ / -)
  window.stepIngredientVal = function(p1, p2, p3, p4) {
    let cardIdx, ingIdx, delta;
    if (arguments.length >= 4) {
      cardIdx = parseInt(p2, 10); ingIdx = parseInt(p3, 10); delta = parseFloat(p4) || 0;
    } else {
      cardIdx = parseInt(p1, 10); ingIdx = parseInt(p2, 10); delta = parseFloat(p3) || 0;
    }
    const editor = document.getElementById(`editor-${cardIdx}`);
    if (!editor) return;

    const inputs = editor.querySelectorAll('.ing-num-input');
    const input = inputs[ingIdx];
    if (!input) return;

    let current = parseFloat(input.value) || 0;
    let next = Math.max(0, Math.round((current + delta) * 10) / 10);
    input.value = next;
    const unit = input.getAttribute('data-unit') || 'g';
    window.onIngredientInputChange(cardIdx, ingIdx, next, unit);
  };

  // Ajouter un ingrédient
  window.addIngredientToRecipe = function(p1, p2) {
    const { recipe, cardIdx, recipeName } = resolveRecipe(p1, p2);
    if (!recipe) return;

    const ingName = prompt("Nom du nouvel ingrédient :", "Nouvel Ingrédient");
    if (!ingName || !ingName.trim()) return;

    const qty = prompt("Quantité (ex: 50 g, 100 ml, 1 p) :", "50 g");
    if (!qty || !qty.trim()) return;

    recipe.greyCorner.tech.push(`${ingName.trim()} : ${qty.trim()}`);
    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    renderRecipeCards();
    renderSummaryKPIs();
    showToast(`➕ Ingrédient ajouté à ${recipe.name}`);
  };

  // Supprimer un ingrédient
  window.removeIngredientFromRecipe = function(p1, p2, p3) {
    let recipe, cardIdx, ingIdx;
    if (arguments.length >= 3) {
      ({ recipe, cardIdx } = resolveRecipe(p1, p2));
      ingIdx = parseInt(p3, 10);
    } else {
      ({ recipe, cardIdx } = resolveRecipe(p1));
      ingIdx = parseInt(p2, 10);
    }
    if (!recipe || isNaN(ingIdx)) return;

    if (recipe.greyCorner.tech.length <= 1) {
      alert("Une recette doit contenir au moins un ingrédient.");
      return;
    }

    recipe.greyCorner.tech.splice(ingIdx, 1);
    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    renderRecipeCards();
    renderSummaryKPIs();
    showToast(`🗑️ Ingrédient supprimé de ${recipe.name}`);
  };

  // Copier le standard international
  window.copyStandardToRecipe = function(p1, p2) {
    const { recipe, cardIdx } = resolveRecipe(p1, p2);
    if (!recipe) return;

    recipe.greyCorner.tech = JSON.parse(JSON.stringify(recipe.standard.tech));
    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = 0;

    renderRecipeCards();
    renderSummaryKPIs();
    showToast(`🟢 Standard international copié sur ${recipe.name}`);
  };

  // Rétablir la fiche d'origine
  window.resetRecipeToInitial = function(p1, p2) {
    const { recipe, cardIdx } = resolveRecipe(p1, p2);
    if (!recipe) return;

    delete editedRecipes[recipe.name];
    saveEdits(false);
    recipe.greyCorner.tech = JSON.parse(JSON.stringify(recipe.initialTech));

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    renderRecipeCards();
    renderSummaryKPIs();
    showToast(`🔄 Fiche d'origine rétablie pour ${recipe.name}`);
  };

  // Mise à jour ciblée des chiffres d'une carte
  function updateCardMetrics(cardIdx, recipe) {
    const costEl = document.getElementById(`gc-cost-${cardIdx}`);
    const fcEl = document.getElementById(`gc-fc-${cardIdx}`);
    const marginEl = document.getElementById(`gc-margin-${cardIdx}`);
    const diffBadgeEl = document.getElementById(`badge-diff-${cardIdx}`);

    if (costEl) costEl.textContent = `${recipe.greyCorner.cost.toFixed(2)} DH`;
    if (fcEl) {
      fcEl.textContent = `${recipe.greyCorner.foodCost.toFixed(1)} %`;
      fcEl.className = `badge ${recipe.greyCorner.foodCost <= 32 ? 'badge-ok' : (recipe.greyCorner.foodCost <= 38 ? 'badge-warn' : 'badge-danger')}`;
    }
    if (marginEl) marginEl.textContent = `+${recipe.greyCorner.grossMarginDH.toFixed(2)} DH`;

    if (diffBadgeEl) {
      if (recipe.standard.diffDH > 0) {
        diffBadgeEl.className = 'badge-gain';
        diffBadgeEl.style.cssText = 'background:rgba(2, 132, 199, 0.1); color:#0284c7; border-color:rgba(2, 132, 199, 0.3);';
        diffBadgeEl.textContent = `Écart vs Standard : +${recipe.standard.diffDH.toFixed(2)} DH`;
      } else {
        diffBadgeEl.className = 'badge-neutral';
        diffBadgeEl.style.cssText = '';
        diffBadgeEl.textContent = `Marge conforme au standard`;
      }
    }

    const drawerPanel = document.getElementById(`drawer-panel-gc-${cardIdx}`);
    if (drawerPanel) {
      drawerPanel.innerHTML = renderPortionCostBreakdownHTML(recipe.greyCorner.tech, recipe.sellPrice, 'gc', cardIdx);
    }
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
      toast.style.cssText = 'position:fixed; top:18px; left:50%; transform:translateX(-50%); background:#0f172a; color:#fff; padding:12px 20px; border-radius:12px; font-weight:800; font-size:13.5px; box-shadow:0 10px 30px rgba(0,0,0,0.4); z-index:999999; display:flex; align-items:center; gap:8px; transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1); border:1.5px solid #0284c7; max-width:92vw; text-align:center; pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-12px)';
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
      localStorage.setItem('gc_ingredient_prices_v1', JSON.stringify(window.INGREDIENT_UNIT_COSTS));
    } catch (e) {
      console.error('Erreur sauvegarde prix localStorage:', e);
    }

    // Recalculer toutes les recettes dans le comparateur
    initData();
    renderSummaryKpis();
    renderRecipeCards();

    showToast("✅ Prix des matières enregistrés ! Food costs et marges recalculés en direct.");
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

      showToast("📁 Fichier recipes-data.js complet mis à jour et téléchargé !");
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

      showToast("🚀 Fiches techniques enregistrées DIRECTEMENT sur le Codebase GitHub !");
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

})();
