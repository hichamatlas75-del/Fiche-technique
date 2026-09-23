/**
 * GREY CORNER — Agent IA : Moteur d'Analyse & Menu Engineering
 * Module: comp-ai-engine.js
 * Contient : état global, getDailySalesContext, analyzeDailySales,
 *            analyzeMenuEngineering, FES_CAFE_RESTAURANT_MARKET,
 *            analyzeDatasetForOptimizations, applyAIOptimization.
 * Dépendances : core-utils.js (cleanText, GC_STORAGE_KEYS), comp-core.js (allRecipes)
 */
/**
 * GREY CORNER — Agent IA Optimiseur & Analyse Menu Engineering
 * Module: comp-ai.js
 */

  /* ========================================================
     AGENT INTELLIGENT D'OPTIMISATION DES REVENUS (AI REVENUE ADVISOR)
     Analyse en temps réel le tableau de synthèse & les ventes journalières
  ======================================================== */
var currentAITab = 'menu_engineering'; // 'assistant', 'simulator', 'generator', 'menu_engineering', 'daily_sales', 'quick_wins', 'pricing', 'standards', 'critical'
var currentMenuEngFilter = 'all'; // 'all', 'star', 'plowhorse', 'puzzle', 'dog'
var selectedAIDailyDate = (function() {
    try { return localStorage.getItem('gc_ai_daily_date') || '__auto__'; } catch(e) { return '__auto__'; }
  })();
var isAIAgentCollapsed = (function() {
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
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const decodedName = (typeof recipeName === 'string' && recipeName.includes('%')) ? decodeURIComponent(recipeName) : recipeName;
    const target = cleanFn(decodedName);
    const recipesList = window.allRecipes || (typeof allRecipes !== 'undefined' ? allRecipes : []);
    const recipe = recipesList.find(r => cleanFn(r.name) === target) || recipesList.find(r => r.name === decodedName);
    if (!recipe) return;

    if (actionType === 'apply_standard') {
      if (typeof window.copyStandardToRecipe === 'function') {
        window.copyStandardToRecipe(recipe.name);
      }
      if (typeof window.GC_Toast !== 'undefined') {
        window.GC_Toast.show(`🤖 Agent IA : Standard appliqué avec succès sur "${recipe.name}" !`, 'info');
      }
    } else if (actionType === 'apply_price') {
      const newPrice = parseFloat(paramVal) || 0;
      if (newPrice > 0) {
        if (typeof window.updateRecipeSellPrice === 'function') {
          window.updateRecipeSellPrice(recipe.name, newPrice);
        }
        if (typeof window.GC_Toast !== 'undefined') {
          window.GC_Toast.show(`🤖 Agent IA : Prix ajusté à ${newPrice} DH sur "${recipe.name}" !`, 'info');
        }
      }
    } else if (actionType === 'apply_grammage') {
      if (typeof window.applyGrammageToRecipe === 'function' && paramVal) {
        window.applyGrammageToRecipe(recipe.name, paramVal.ingredient, paramVal.newQty, paramVal.unit);
      }
    } else if (actionType === 'inspect') {
      // Basculer vers la vue des fiches ou tableau pour afficher le plat ciblé
      if (typeof window.setComparatorMainView === 'function') {
        window.setComparatorMainView(typeof isComparatorTableView !== 'undefined' && isComparatorTableView ? 'table' : 'recipes');
      }
      if (typeof window.searchQuery !== 'undefined') window.searchQuery = recipe.name;
      if (typeof searchQuery !== 'undefined') searchQuery = recipe.name;
      const searchInput = document.getElementById('search-comparator');
      if (searchInput) searchInput.value = recipe.name;
      if (typeof isComparatorTableView !== 'undefined' && isComparatorTableView) {
        if (typeof renderComparatorTable === 'function') renderComparatorTable();
      } else {
        if (typeof renderRecipeCards === 'function') renderRecipeCards();
      }
      setTimeout(() => {
        const el = document.querySelector(`[data-recipe-name="${recipe.name}"]`) || document.getElementById('search-comparator');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ai-highlight-card');
          setTimeout(() => el.classList.remove('ai-highlight-card'), 2500);
        }
      }, 200);
    }
  };

  // Récupération des données de ventes journalières
  function getDailySalesContext() {
var rawDB = null;
    try {
      const saved = localStorage.getItem(window.GC_STORAGE_KEYS.SALES);
      if (saved) rawDB = JSON.parse(saved);
    } catch(e) {}

    const availableDates = rawDB ? Object.keys(rawDB).filter(d => Array.isArray(rawDB[d]) && rawDB[d].length > 0).sort().reverse() : [];
    const availableYears = rawDB ? Array.from(new Set(availableDates.map(d => d.slice(0, 4)))).sort().reverse() : [];
    const todayISO = new Date().toLocaleDateString('en-CA');
var effectiveDate = selectedAIDailyDate;
var isBenchmark = false;
var salesRows = [];

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
    } else if (effectiveDate.startsWith('__year_')) {
      const yTarget = effectiveDate.replace('__year_', '');
      const yRows = [];
      availableDates.filter(d => d.startsWith(yTarget)).forEach(dKey => {
        (rawDB[dKey] || []).forEach(r => yRows.push(r));
      });
      if (yRows.length > 0) {
        salesRows = yRows;
      } else {
        effectiveDate = '__benchmark__';
        salesRows = BENCHMARK_DAILY_SALES;
        isBenchmark = true;
      }
    } else {
      if (rawDB && rawDB[effectiveDate] && rawDB[effectiveDate].length > 0) {
        salesRows = rawDB[effectiveDate];
      } else {
        effectiveDate = '__benchmark__';
        salesRows = BENCHMARK_DAILY_SALES;
        isBenchmark = true;
      }
    }

    return {
      effectiveDate,
      isBenchmark,
      availableDates,
      availableYears,
      salesRows
    };
  }

  // Analyse des ventes de la journée sélectionnée
  function analyzeDailySales(salesRows) {
var totalItemsSold = 0;
var totalDailyRevenue = 0;
var totalDailyGcCost = 0;
var totalDailyStdCost = 0;
var totalDailyLostMargin = 0;

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
var matched = allRecipes.find(r => cleanText(r.name) === cAlias || cleanText(r.name) === cRaw);
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
var excludedDishesCount = 0;
var excludedDishesQty = 0;

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
var matched = allRecipes.find(r => cleanText(r.name) === cAlias || cleanText(r.name) === cRaw);
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
var quadrant = '';
var quadrantLabel = '';
var quadrantDesc = '';
var actionLabel = '';
var actionType = '';
var actionParam = null;

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
var totalMonthlySavings = 0;
var totalPotentialPricingRev = 0;
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
var theoreticalPrice = Math.ceil(rawTargetPrice32 / step) * step;

        // Souplesse : Limitation de la hausse pour éviter la fuite de la clientèle
        // Hausse max par palier : +18% max ou +20 DH max
        const maxAllowedBump = Math.max(step, Math.min(FES_CAFE_RESTAURANT_MARKET.MAX_BUMP_DH, Math.ceil((price * FES_CAFE_RESTAURANT_MARKET.MAX_BUMP_PCT) / step) * step));
        const maxSoftPrice = price + maxAllowedBump;

        // Respect des seuils de marché fassi :
        // Si le plat est sous le softCeiling, on ne dépasse pas le softCeiling en une seule fois
var recommendedPrice = theoreticalPrice;
        if (price < market.softCeiling) {
          recommendedPrice = Math.min(recommendedPrice, market.softCeiling);
        } else {
          recommendedPrice = Math.min(recommendedPrice, market.hardCeiling);
        }
var isCappedByFlexibility = false;
var isCappedByMarket = false;

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
var marketWarningText = '';
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
  window.analyzeDatasetForOptimizations = analyzeDatasetForOptimizations;
  window.analyzeDailySales = analyzeDailySales;
  window.analyzeMenuEngineering = analyzeMenuEngineering;
  window.getDailySalesContext = getDailySalesContext;


