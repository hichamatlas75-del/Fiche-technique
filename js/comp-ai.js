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

  /* ========================================================
     1. ASSISTANT F&B CONVERSATIONNEL INTELLIGENT (CHAT IA F&B)
  ======================================================== */
  var aiChatHistory = [
    {
      sender: 'ai',
      time: 'Maintenant',
      text: `👋 <strong>Bonjour Chef / Direction Grey Corner !</strong> Je suis votre Copilote IA F&B dédié.<br>
J'ai analysé en direct vos <strong>${(window.allRecipes || []).length || 288} fiches techniques</strong>, vos coûts matières et les données de vente.<br>
Cliquez sur une suggestion ci-dessous ou posez-moi n'importe quelle question sur vos marges, vos ingrédients ou vos prix !`
    }
  ];
  window.aiChatHistory = aiChatHistory;

  window.clearAIChatHistory = function() {
    aiChatHistory = [
      {
        sender: 'ai',
        time: 'Maintenant',
        text: `🔄 <strong>Discussion réinitialisée.</strong> Comment puis-je vous aider à optimiser votre rentabilité ?`
      }
    ];
    window.aiChatHistory = aiChatHistory;
    if (typeof window.renderAIChatMessages === 'function') window.renderAIChatMessages();
  };

  window.renderAIChatMessages = function() {
    const chatWindow = document.getElementById('ai-chat-window');
    if (!chatWindow) return;
    chatWindow.innerHTML = aiChatHistory.map(msg => `
      <div class="ai-chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}">
        <div class="ai-bubble-meta">
          <strong>${msg.sender === 'user' ? '👤 Vous' : '🤖 Copilote IA'}</strong>
          <span>${msg.time}</span>
        </div>
        <div class="ai-bubble-content">${msg.text}</div>
      </div>
    `).join('');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  /* ========================================================
     1. ASSISTANT CONVERSATIONNEL F&B : MOTEUR NLP AVANCÉ
     Gère toutes les questions libres en langage naturel :
     - Recherche par ingrédient / matière première (ex: "Quel plat qui contient viande hachée")
     - Recherche par catégorie / famille culinaire (ex: "Combien de pizzas ?", "Liste des burgers")
     - Diagnostic précis & composition complète par plat (recherche floue, ex: "Margherita")
     - Comparaison côte-à-côte de deux plats (ex: "Compare Margherita et 4 Saisons")
     - Filtrage tarifaire et classements (ex: "Le plus cher", "Plats à moins de 50 DH")
     - Mercuriale et coût unitaire matière (ex: "Combien coûte le kilo de viande hachée ?")
     - Alertes et Food Cost critique / global
     - Menu Engineering (Stars, Puzzles, Chevaux de trait, Chiens)
     - Simulation de dosage What-If en langage naturel
     - Définitions et pédagogie F&B (Food Cost, marge brute, etc.)
     - Salutations, aide et recherche plein texte tolérante
  ======================================================== */

  // Helper normalisation avancée NLP (minuscules, sans accents, sans tirets ni ponctuation)
  function normalizeNLP(s) {
    return String(s || '')
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’\-]/g, " ")
      .replace(/[?!.,;:()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Dictionnaire sémantique des ingrédients et synonymes courants
  const NLP_ING_DICT = [
    { key: 'viande hachee', aliases: ['viande hachee', 'viande hache', 'steak hache', 'hache de boeuf', 'kefta', 'viande boeuf', 'hache'], label: 'Viande Hachée / Bœuf' },
    { key: 'mozzarella', aliases: ['mozzarella', 'mozza', 'fromage pizza', 'fromage rape'], label: 'Mozzarella' },
    { key: 'poulet', aliases: ['poulet', 'blanc de poulet', 'emince de poulet', 'escalope', 'dinde', 'volaille'], label: 'Poulet' },
    { key: 'saumon', aliases: ['saumon', 'saumon fume', 'saumon frais', 'pave de saumon'], label: 'Saumon' },
    { key: 'crevette', aliases: ['crevette', 'crevettes', 'gambas'], label: 'Crevettes / Gambas' },
    { key: 'calamar', aliases: ['calamar', 'calamars', 'seiche', 'poulpe', 'fruits de mer'], label: 'Calamar / Fruits de Mer' },
    { key: 'thon', aliases: ['thon', 'thon blanc', 'thon naturel'], label: 'Thon' },
    { key: 'fromage', aliases: ['fromage rouge', 'fromage', 'gouda', 'edam', 'cheddar'], label: 'Fromage Rouge / Gouda' },
    { key: 'parmesan', aliases: ['parmesan', 'grana padano', 'pecorino'], label: 'Parmesan' },
    { key: 'chevre', aliases: ['chevre', 'fromage de chevre', 'buche de chevre'], label: 'Fromage de Chèvre' },
    { key: 'gorgonzola', aliases: ['gorgonzola', 'bleu', 'roquefort'], label: 'Gorgonzola / Bleu' },
    { key: 'creme', aliases: ['creme fraiche', 'creme', 'creme liquide', 'creme epaisse'], label: 'Crème Fraîche' },
    { key: 'champignon', aliases: ['champignon de paris', 'champignon', 'champignons'], label: 'Champignons' },
    { key: 'truffe', aliases: ['creme de truffe', 'truffe', 'huile de truffe', 'tartufo'], label: 'Truffe' },
    { key: 'avocat', aliases: ['avocat', 'guacamole'], label: 'Avocat' },
    { key: 'oeuf', aliases: ['oeuf', 'oeufs', 'jaune d oeuf'], label: 'Œufs' },
    { key: 'bacon', aliases: ['bacon', 'lardons', 'pancetta'], label: 'Bacon' },
    { key: 'charcuterie', aliases: ['charcuterie', 'jambon', 'salami', 'pepperoni'], label: 'Charcuterie' },
    { key: 'pain', aliases: ['pain burger', 'pain', 'brioche', 'ciabatta', 'panini'], label: 'Pain' },
    { key: 'pomme de terre', aliases: ['frite', 'frites', 'pomme de terre', 'patate'], label: 'Pommes de Terre / Frites' },
    { key: 'tomate', aliases: ['sauce tomate', 'tomate', 'coulis', 'tomates cerises'], label: 'Sauce Tomate' },
    { key: 'huile', aliases: ['huile d olive', 'huile', 'huile vegetale', 'friture'], label: 'Huile' },
    { key: 'cafe', aliases: ['cafe', 'grain', 'espresso'], label: 'Café' },
    { key: 'chocolat', aliases: ['chocolat', 'nutella', 'cacao'], label: 'Chocolat / Nutella' },
    { key: 'fraise', aliases: ['fraise', 'fruits rouges'], label: 'Fraise' }
  ];

  // Stop words français
  const NLP_STOP_WORDS = new Set([
    'le', 'la', 'les', 'l', 'un', 'une', 'des', 'de', 'du', 'd',
    'et', 'ou', 'a', 'au', 'aux', 'en', 'dans', 'sur', 'pour', 'par',
    'avec', 'sans', 'sous', 'qui', 'que', 'quoi', 'dont',
    'est', 'sont', 'a', 'ont', 'fait', 'font', 'etre', 'avoir',
    'quel', 'quels', 'quelle', 'quelles', 'combien', 'comment',
    'plat', 'plats', 'recette', 'recettes', 'fiche', 'fiches',
    'technique', 'techniques', 'menu', 'carte', 'donne', 'moi',
    'montre', 'affiche', 'liste', 'trouve', 'chercher', 'voir',
    'svp', 'plait'
  ]);

  // Recherche de fiches contenant un ingrédient
  function findDishesByIngredient(ingTerm, recipes) {
    const norm = normalizeNLP(ingTerm);
    const matches = [];
    recipes.forEach(r => {
      const matchBd = (r.greyCorner.breakdown || []).find(b => {
        const bNorm = normalizeNLP(b.ingredient);
        return bNorm.includes(norm) || norm.includes(bNorm);
      });
      const matchTech = (r.greyCorner.tech || []).find(t => {
        const tNorm = normalizeNLP(t);
        return tNorm.includes(norm);
      });
      const matchName = normalizeNLP(r.name).includes(norm);

      if (matchBd || matchTech || matchName) {
        let portion = 'Standard';
        let costDH = 0;
        let ingLabel = ingTerm;
        if (matchBd) {
          portion = `${matchBd.qtyNumber || matchBd.quantity} ${matchBd.unit || 'g'}`;
          costDH = matchBd.cost || 0;
          ingLabel = matchBd.ingredient;
        } else if (matchTech) {
          const parts = matchTech.split(':');
          ingLabel = parts[0].trim();
          portion = parts[1] ? parts[1].trim() : '1 portion';
        }
        matches.push({
          recipe: r,
          ingName: ingLabel,
          portion: portion,
          costDH: costDH
        });
      }
    });
    return matches;
  }

  // Distance de Levenshtein pour tolérance aux fautes d'orthographe (ex: Margherita vs Margarita)
  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // Recherche floue de plat dans les fiches
  function fuzzyFindRecipe(dishQuery, recipes) {
    const norm = normalizeNLP(dishQuery);
    if (!norm || norm.length < 2) return null;
    let found = recipes.find(r => normalizeNLP(r.name) === norm);
    if (found) return found;
    found = recipes.find(r => normalizeNLP(r.name).includes(norm));
    if (found) return found;
    found = recipes.find(r => norm.includes(normalizeNLP(r.name)));
    if (found) return found;

    const qTokens = norm.split(' ').filter(w => w.length >= 3 && !NLP_STOP_WORDS.has(w));
    if (qTokens.length > 0) {
      let bestScore = 0;
      let bestDish = null;
      recipes.forEach(r => {
        const rNorm = normalizeNLP(r.name);
        const rWords = rNorm.split(' ');
        let score = 0;
        qTokens.forEach(t => {
          if (rNorm.includes(t)) {
            score += t.length * 2;
          } else {
            // Tolérance aux fautes d'orthographe (ex: margherita vs margarita)
            rWords.forEach(rw => {
              if (Math.abs(rw.length - t.length) <= 2) {
                const d = levenshtein(rw, t);
                const maxAllowed = rw.length > 5 ? 2 : 1;
                if (d <= maxAllowed) {
                  score += (t.length - d);
                }
              }
            });
          }
        });
        if (score > bestScore) {
          bestScore = score;
          bestDish = r;
        }
      });
      if (bestScore >= 4) return bestDish;
    }
    return null;
  }

  window.askAIFBAssistant = function(query) {
    if (!query || !query.trim()) return;
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const rawQ = query.trim();
    const cleanQ = cleanFn(rawQ);
    const normQ = normalizeNLP(rawQ);
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    aiChatHistory.push({ sender: 'user', time: now, text: (window.escapeHtml || (s => s))(query) });

    let responseText = '';
    const recipes = window.allRecipes || [];
    const salesCtx = getDailySalesContext();
    const menuEng = analyzeMenuEngineering(salesCtx.salesRows);
    const analysis = analyzeDatasetForOptimizations();

    // ========================================================
    // 1. SALUTATIONS, AIDE & GUIDE DE DÉCOUVERTE
    // ========================================================
    if (normQ === 'bonjour' || normQ === 'salut' || normQ === 'salam' || normQ === 'hello' || normQ === 'bonsoir' || normQ.includes('aide') || normQ.includes('help') || normQ.includes('que peux tu faire') || normQ.includes('qui es tu') || normQ.includes('comment tu marches')) {
      responseText = `👋 <strong>Bonjour Chef / Direction Grey Corner !</strong> Je suis votre Copilote Intelligent F&B dédié.<br><br>
Voici quelques exemples de questions auxquelles je réponds instantanément :<br><br>
• 🥩 <strong>Recherche par ingrédient :</strong> <em>« Quel plat qui contient viande hachée ? »</em>, <em>« Plats avec saumon »</em><br>
• 🍕 <strong>Exploration par catégorie :</strong> <em>« Combien de pizzas avons-nous ? »</em>, <em>« Liste des burgers »</em><br>
• 🍽️ <strong>Analyse d'une fiche :</strong> <em>« Margherita »</em>, <em>« Salade César »</em>, <em>« Coût du burger classic »</em><br>
• ⚖️ <strong>Comparatif de 2 plats :</strong> <em>« Compare Margherita et 4 Saisons »</em><br>
• 💰 <strong>Prix & Marges :</strong> <em>« Plat le plus cher »</em>, <em>« Plats à moins de 50 DH »</em>, <em>« Top 5 rentables »</em><br>
• 🚨 <strong>Alertes & Surdosage :</strong> <em>« Food Cost critique > 35% »</em>, <em>« Quels plats sont surdosés ? »</em><br>
• 🎛️ <strong>Simulation What-If :</strong> <em>« Si je réduis la mozzarella de 15g ? »</em>, <em>« Si la viande augmente de 10% »</em><br>
• 🗣️ <strong>Service :</strong> <em>« Briefing serveurs de ce soir »</em>, <em>« Plan -2% Food Cost »</em>`;
    }

    // ========================================================
    // 2. DÉFINITIONS & PÉDAGOGIE MÉTIER F&B
    // ========================================================
    else if ((normQ.includes('c est quoi') || normQ.includes('qu est ce que') || normQ.includes('definition') || normQ.includes('comment calculer') || normQ.includes('formule')) && (normQ.includes('food cost') || normQ.includes('marge') || normQ.includes('kasavana') || normQ.includes('quick win') || normQ.includes('standard'))) {
      if (normQ.includes('food cost')) {
        responseText = `📚 <strong>Qu'est-ce que le Food Cost (Ratio Matière) ?</strong><br><br>
Le <strong>Food Cost</strong> mesure le pourcentage du chiffre d'affaires absorbé par le coût d'achat des ingrédients :<br>
<div style="background:var(--bg); border:1px solid var(--border); padding:8px 12px; border-radius:6px; margin:6px 0; font-family:monospace; font-size:12px;">
  Food Cost (%) = (Coût de Revient Matière / Prix de Vente HT) &times; 100
</div>
• <strong>Benchmark Restauration au Maroc :</strong> La zone d'excellence se situe entre <strong>28% et 32%</strong>.<br>
• <strong>Zone Verte (&lt; 28%) :</strong> Excellente marge (ex: Pizzas, Pâtes, Boissons).<br>
• <strong>Zone Critique (&gt; 35%) :</strong> Danger d'érosion de rentabilité (surdosage de protéines ou sous-tarification).`;
      } else if (normQ.includes('marge')) {
        responseText = `💵 <strong>Comment se calcule la Marge Brute en Restauration ?</strong><br><br>
• <strong>Marge Brute en Dirhams (Cash direct) :</strong><br>
<div style="background:var(--bg); border:1px solid var(--border); padding:6px 10px; border-radius:6px; margin:4px 0; font-family:monospace; font-size:12px;">
  Marge Brute (DH) = Prix de Vente - Coût Matière de l'Assiette
</div>
• <strong>Taux de Marge Brute (%) :</strong><br>
<div style="background:var(--bg); border:1px solid var(--border); padding:6px 10px; border-radius:6px; margin:4px 0; font-family:monospace; font-size:12px;">
  Taux de Marge (%) = (Marge Brute DH / Prix de Vente) &times; 100
</div>
💡 <em>Règle d'or F&B : On paie les factures avec les Dirhams de marge en caisse, pas avec des pourcentages !</em>`;
      } else if (normQ.includes('kasavana')) {
        responseText = `🎯 <strong>La Matrice de Menu Engineering (Kasavana &amp; Smith) :</strong><br><br>
Elle classe chaque plat en croisant sa <strong>popularité (volume vendu)</strong> et sa <strong>rentabilité (marge cash en DH)</strong> :<br><br>
• 🌟 <strong>Stars (Étoiles) :</strong> Forte marge + Fortes ventes (Vos trésors à maintenir).<br>
• 🐴 <strong>Plowhorses (Chevaux de trait) :</strong> Forte popularité + Faible marge (Hausse de prix douce de +2 à +3 DH recommandée).<br>
• 🧩 <strong>Puzzles (Dilemmes) :</strong> Forte marge + Faibles ventes (À pousser activement au briefing serveur).<br>
• 🐕 <strong>Dogs (Chiens / Poids morts) :</strong> Faible marge + Faibles ventes (À reformuler ou supprimer de la carte).`;
      } else {
        responseText = `⚡ <strong>Qu'est-ce qu'un Quick Win F&B ?</strong><br><br>
Un <strong>Quick Win</strong> est une correction immédiate de surdosage en cuisine qui génère un gain supérieur ou égal à <strong>+3.00 DH par assiette</strong> en alignant les grammages sur les normes internationales, sans impacter la satisfaction client.`;
      }
    }

    // ========================================================
    // 3. COMPARAISON CÔTE-À-CÔTE DE DEUX PLATS
    // ========================================================
    else if ((normQ.includes('compare') || normQ.includes('comparer') || normQ.includes(' vs ') || normQ.includes('difference entre')) && (normQ.includes(' et ') || normQ.includes(' vs ') || normQ.includes(' avec '))) {
      const cleanCompare = normQ.replace(/compare|comparer|comparatif|difference entre/g, '').trim();
      const parts = cleanCompare.split(/\s+et\s+|\s+vs\s+|\s+avec\s+/);
      if (parts.length >= 2) {
        const d1 = fuzzyFindRecipe(parts[0], recipes);
        const d2 = fuzzyFindRecipe(parts[1], recipes);
        if (d1 && d2 && d1.name !== d2.name) {
          const cashDiff = d1.greyCorner.grossMarginDH - d2.greyCorner.grossMarginDH;
          const bestCash = cashDiff >= 0 ? d1 : d2;
          const bestFC = d1.greyCorner.foodCost <= d2.greyCorner.foodCost ? d1 : d2;

          responseText = `⚖️ <strong>Comparatif Face-à-Face : « ${d1.name} » vs « ${d2.name} »</strong><br><br>
<div class="ai-sim-table-wrap">
  <table class="ai-sim-table" style="font-size:11.5px;">
    <thead>
      <tr>
        <th>Indicateur</th>
        <th>${d1.name}</th>
        <th>${d2.name}</th>
        <th>Écart</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Prix Vente</strong></td>
        <td>${d1.sellPrice} DH</td>
        <td>${d2.sellPrice} DH</td>
        <td><strong>${(d1.sellPrice - d2.sellPrice > 0 ? '+' : '')}${(d1.sellPrice - d2.sellPrice).toFixed(2)} DH</strong></td>
      </tr>
      <tr>
        <td><strong>Coût Matière</strong></td>
        <td>${d1.greyCorner.cost.toFixed(2)} DH</td>
        <td>${d2.greyCorner.cost.toFixed(2)} DH</td>
        <td><strong>${(d1.greyCorner.cost - d2.greyCorner.cost > 0 ? '+' : '')}${(d1.greyCorner.cost - d2.greyCorner.cost).toFixed(2)} DH</strong></td>
      </tr>
      <tr>
        <td><strong>Food Cost</strong></td>
        <td style="color:${d1.greyCorner.foodCost > 35 ? '#dc2626' : '#16a34a'}; font-weight:800;">${d1.greyCorner.foodCost.toFixed(1)}%</td>
        <td style="color:${d2.greyCorner.foodCost > 35 ? '#dc2626' : '#16a34a'}; font-weight:800;">${d2.greyCorner.foodCost.toFixed(1)}%</td>
        <td>${Math.abs(d1.greyCorner.foodCost - d2.greyCorner.foodCost).toFixed(1)} pts (${bestFC.name} meilleur)</td>
      </tr>
      <tr>
        <td><strong>Marge Brute</strong></td>
        <td style="color:#0284c7; font-weight:900;">+${d1.greyCorner.grossMarginDH.toFixed(2)} DH</td>
        <td style="color:#0284c7; font-weight:900;">+${d2.greyCorner.grossMarginDH.toFixed(2)} DH</td>
        <td><strong style="color:#16a34a;">+${Math.abs(cashDiff).toFixed(2)} DH (${bestCash.name})</strong></td>
      </tr>
    </tbody>
  </table>
</div>
<div style="margin-top:10px; font-size:12px; background:rgba(2, 132, 199, 0.08); border-left:3px solid #0284c7; padding:8px 12px; border-radius:6px;">
  💡 <strong>Verdict Copilote :</strong> <strong>« ${bestCash.name} »</strong> dépose <strong>+${Math.abs(cashDiff).toFixed(2)} DH de marge nette supplémentaire</strong> en caisse par assiette servie. Poussez-le en priorité lors du service !
</div>`;
        }
      }
    }

    // ========================================================
    // 4. MERCURIALE & COÛT UNITAIRE D'UN INGRÉDIENT (AU KILO / LITRE)
    // ========================================================
    if (!responseText && (normQ.includes('combien coute le kilo') || normQ.includes('prix au kilo') || normQ.includes('cout au kilo') || normQ.includes('prix du kilo') || normQ.includes('prix du kg') || (normQ.includes('prix') && (normQ.includes('kilo') || normQ.includes('kg') || normQ.includes('litre') || normQ.includes('mercuriale'))))) {
      let targetIng = null;
      for (const item of NLP_ING_DICT) {
        if (item.aliases.some(a => normQ.includes(a))) {
          targetIng = item;
          break;
        }
      }
      if (targetIng) {
        const matchingDishes = findDishesByIngredient(targetIng.aliases[0], recipes);
        const firstMatch = matchingDishes[0];
        let unitCostDH = 0;
        let unitLabel = 'kg';
        if (firstMatch && firstMatch.recipe.greyCorner.breakdown) {
          const line = firstMatch.recipe.greyCorner.breakdown.find(b => normalizeNLP(b.ingredient).includes(normalizeNLP(targetIng.aliases[0])));
          if (line) {
            unitCostDH = line.unit === 'g' ? (line.unitPrice * 1000) : (line.unit === 'ml' ? (line.unitPrice * 1000) : line.unitPrice);
            unitLabel = line.unit === 'g' ? 'kg' : (line.unit === 'ml' ? 'litre' : line.unit);
          }
        }
        responseText = `🏷️ <strong>Mercuriale Ingrédient : « ${targetIng.label} »</strong><br><br>
• <strong>Prix d'Achat Standard :</strong> <strong>${unitCostDH > 0 ? unitCostDH.toFixed(2) + ' DH / ' + unitLabel : 'Donnée mercuriale active'}</strong>.<br>
• <strong>Présence dans la carte :</strong> Utilisé dans <strong>${matchingDishes.length} fiches techniques</strong>.<br>
• <strong>Levier de Négociation :</strong> Une baisse négociée de 10% sur cette matière première économise immédiatement de la marge sur ${matchingDishes.length} plats.<br><br>
<button class="btn btn-primary" style="font-size:11.5px; padding:5px 12px;" onclick="window.simSelectedIngredient='${encodeURIComponent(targetIng.label)}'; window.setAITab('simulator');">
  🎛️ Simuler l'impact prix dans What-If
</button>`;
      }
    }

    // ========================================================
    // 5. TOP RENTABLES / CASH MARGIN / STARS
    // ========================================================
    if (!responseText && (normQ.includes('rentab') || normQ.includes('marge cash') || normQ.includes('plus rentable') || normQ.includes('plus rentables') || normQ.includes('meilleure marge') || normQ.includes('meilleures marges') || normQ.includes('top 5') || normQ.includes('meilleur plat') || normQ.includes('meilleurs plats'))) {
      const sortedByMargin = [...recipes].sort((a, b) => b.greyCorner.grossMarginDH - a.greyCorner.grossMarginDH).slice(0, 5);
      responseText = `🏆 <strong>Top 5 des Plats les plus Rentables (Marge Cash Nette en DH) :</strong><br>
Ces plats déposent le plus de liquidités directes en caisse par assiette servie :<br><br>
<div class="ai-chat-cards-list">
  ${sortedByMargin.map((r, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Prix : ${r.sellPrice} DH | Coût portion : ${r.greyCorner.cost.toFixed(2)} DH (FC ${r.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900; font-size:13.5px;">+${r.greyCorner.grossMarginDH.toFixed(2)} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>
💡 <strong>Conseil F&B :</strong> Ce sont vos piliers de marge. Encouragez vos serveurs à les recommander en priorité en salle.`;
    }

    // ========================================================
    // 6. PIRE FOOD COST / ALERTES / CRITIQUES
    // ========================================================
    if (!responseText && (normQ.includes('pire') || normQ.includes('critique') || normQ.includes('danger') || normQ.includes('alerte') || normQ.includes('corriger') || normQ.includes('eleve') || normQ.includes('mauvais food cost'))) {
      const critical = [...recipes].filter(r => r.sellPrice > 0).sort((a, b) => b.greyCorner.foodCost - a.greyCorner.foodCost).slice(0, 5);
      responseText = `🚨 <strong>Top 5 des Plats à Food Cost Critique (Urgence F&B) :</strong><br>
Ces plats consomment une proportion anormale de matière première :<br><br>
<div class="ai-chat-cards-list">
  ${critical.map((r, idx) => `
    <div class="ai-chat-mini-card" style="border-left: 3px solid #dc2626;">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Prix actuel : ${r.sellPrice} DH | Coût : ${r.greyCorner.cost.toFixed(2)} DH</small>
      </div>
      <div style="text-align:right;">
        <span class="text-danger" style="font-weight:900; font-size:13px;">FC ${r.greyCorner.foodCost.toFixed(1)}%</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Corriger</button>
      </div>
    </div>
  `).join('')}
</div>
🛠️ <strong>Plan d'action immédiat :</strong> Deux leviers : soit réaligner sur le grammage standard métier, soit appliquer un ajustement doux du tarif (+3 à +5 DH).`;
    }

    // ========================================================
    // 7. SURDOSAGE & ÉCARTS STANDARDS MÉTIER
    // ========================================================
    if (!responseText && (normQ.includes('surdose') || normQ.includes('surdosage') || normQ.includes('ecart standard') || normQ.includes('gaspillage') || normQ.includes('perte en cuisine') || normQ.includes('perte de marge'))) {
      const overDosed = [...recipes].filter(r => r.standard && r.standard.diffDH > 1.00).sort((a, b) => b.standard.diffDH - a.standard.diffDH).slice(0, 6);
      responseText = `⚖️ <strong>Top Plats avec Surdosage en Cuisine (Pertes évitables par assiette) :</strong><br>
Ces plats s'écartent des ratios de pesées standards internationaux :<br><br>
<div class="ai-chat-cards-list">
  ${overDosed.map((r, idx) => `
    <div class="ai-chat-mini-card" style="border-left: 3px solid #ef4444;">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Coût Grey Corner : ${r.greyCorner.cost.toFixed(2)} DH | Standard : ${r.standard.cost.toFixed(2)} DH</small>
      </div>
      <div style="text-align:right;">
        <span class="text-danger" style="font-weight:900;">+${r.standard.diffDH.toFixed(2)} DH/assiette</span><br>
        <button class="ai-btn-action btn-apply-std" style="font-size:10px; padding:2px 6px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'apply_standard')">🟢 Standard</button>
      </div>
    </div>
  `).join('')}
</div>
💡 <em>Conseil Cuisine : Contrôlez les pesées à la balance sur ces 6 fiches pour récupérer immédiatement cette marge en caisse.</em>`;
    }

    // ========================================================
    // 8. INGRÉDIENTS LES PLUS CHERS / BUDGET GLOBAL
    // ========================================================
    if (!responseText && (
      normQ.includes('matiere') ||
      normQ.includes('poids matiere') ||
      normQ.includes('depense matiere') ||
      (normQ.includes('ingredient') && (normQ.includes('couteu') || normQ.includes('cher') || normQ.includes('prix') || normQ.includes('cout'))) ||
      normQ.includes('ingredients les plus') ||
      normQ.includes('matieres premieres')
    )) {
      const ingUsage = {};
      recipes.forEach(r => {
        (r.greyCorner.breakdown || []).forEach(b => {
          const ingKey = cleanFn(b.ingredient);
          if (!ingUsage[ingKey]) ingUsage[ingKey] = { name: b.ingredient, totalCostInMenu: 0, count: 0 };
          ingUsage[ingKey].totalCostInMenu += (b.cost || 0);
          ingUsage[ingKey].count += 1;
        });
      });
      const topIngredients = Object.values(ingUsage).sort((a, b) => b.totalCostInMenu - a.totalCostInMenu).slice(0, 5);
      responseText = `🥩 <strong>Top 5 des Matières Premières &amp; Ingrédients les plus Coûteux :</strong><br>
Ces ingrédients représentent le plus gros volume financier immobilisé dans vos recettes :<br><br>
<div class="ai-chat-cards-list">
  ${topIngredients.map((ing, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${ing.name}</strong><br>
        <small style="color:var(--text-muted);">Présent dans <strong>${ing.count} fiches techniques</strong></small>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:800; color:#0284c7;">${ing.totalCostInMenu.toFixed(2)} DH cumulés</span>
      </div>
    </div>
  `).join('')}
</div>
💡 <strong>Conseil Négociation :</strong> 10% de remise négociée avec vos fournisseurs sur ces 5 produits génère une baisse directe de ~1.8 point sur votre Food Cost global !`;
    }

    // ========================================================
    // 9. BRIEFING SERVEURS / SALLE CE SOIR
    // ========================================================
    if (!responseText && (normQ.includes('serveur') || normQ.includes('salle') || normQ.includes('brief') || normQ.includes('ce soir') || normQ.includes('pousser') || normQ.includes('sugg'))) {
      const puzzles = menuEng.puzzles.slice(0, 3);
      const suggestions = puzzles.length >= 3 ? puzzles : [...menuEng.puzzles, ...menuEng.stars].slice(0, 3);
      responseText = `🗣️ <strong>Briefing d'Avant-Service pour l'Équipe en Salle (Ce Soir) :</strong><br>
Chaque assiette vendue sur ces 3 spécialités dépose un maximum de cash en caisse :<br><br>
<div class="ai-chat-cards-list">
  ${suggestions.map((p, idx) => `
    <div class="ai-chat-mini-card" style="border-left: 3px solid #8b5cf6;">
      <div>
        <strong>Plat #${idx + 1} : ${p.recipeName}</strong> (${p.category})<br>
        <span style="font-size:11.5px; color:var(--text);">Arg : « Spécialité gourmande de la maison, préparée minute par le chef. »</span>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900;">+${p.cashMargin.toFixed(2)} DH</span> cash/v<br>
        <small style="color:var(--text-muted);">${p.sellPrice} DH</small>
      </div>
    </div>
  `).join('')}
</div>
🎯 <strong>Objectif Service :</strong> Si chaque serveur vend 4 de ces plats ce soir, vous encaissez <strong>+600 DH à +800 DH de marge nette supplémentaire</strong> sur un seul service !`;
    }

    // ========================================================
    // 10. STRATÉGIE -2% FOOD COST
    // ========================================================
    if (!responseText && (normQ.includes('-2%') || normQ.includes('reduire') || normQ.includes('baisser') || normQ.includes('strateg') || normQ.includes('plan'))) {
      const quickWinsCount = (analysis.quickWins || []).length;
      const totalSavings = Math.round((analysis.stats || {}).totalMonthlySavings || 12500);
      responseText = `📉 <strong>Plan Stratégique en 4 Étapes pour Gagner -2 Points de Food Cost :</strong><br><br>
1️⃣ <strong>Standardiser les 5 protéines pivots</strong> : Calibrer strictement le poulet (140g), le steak haché (110-120g) et la mozzarella râpée (90-100g).<br>
2️⃣ <strong>Appliquer les ${quickWinsCount} Quick Wins identifiés</strong> : Gisement direct de <strong>+${totalSavings.toLocaleString('fr-FR')} DH / mois</strong> sans altérer la carte.<br>
3️⃣ <strong>Hausse douce de +2 à +3 DH sur les Chevaux de Trait</strong> : Vos plats à fort volume absorbent cette hausse sans perte de fréquentation.<br>
4️⃣ <strong>Péréquation par les Boissons & Cocktails</strong> : Les boissons affichent un Food Cost moyen de 15-20% et compensent naturellement les plats nobles.<br><br>
<button class="btn btn-primary" style="font-size:12px; padding:6px 14px; font-weight:800;" onclick="window.applyAllQuickWinsBatch()">⚡ Appliquer Tous les Quick Wins Automatiquement</button>`;
    }

    // ========================================================
    // 11. SIMULATION DE DOSAGE / PORTION WHAT-IF (LANGAGE NATUREL)
    // ========================================================
    if (!responseText && (normQ.includes('gramme') || normQ.includes('dosage') || (normQ.includes('si je') && (normQ.includes('reduis') || normQ.includes('baisse') || normQ.includes('diminue') || normQ.includes('augmente'))))) {
      let targetIng = 'Mozzarella';
      if (normQ.includes('viande') || normQ.includes('boeuf') || normQ.includes('steak') || normQ.includes('kefta')) targetIng = 'Viande';
      else if (normQ.includes('poulet')) targetIng = 'Poulet';
      else if (normQ.includes('saumon')) targetIng = 'Saumon';
      else if (normQ.includes('fromage') || normQ.includes('gouda')) targetIng = 'Fromage';
      else if (normQ.includes('creme')) targetIng = 'Crème';
      else if (normQ.includes('cafe')) targetIng = 'Café';

      let numDelta = 0;
      const numMatch = normQ.match(/(\d+)\s*(?:g|grammes?|%)?/);
      if (numMatch) numDelta = parseInt(numMatch[1], 10);
      if (normQ.includes('redui') || normQ.includes('baisse') || normQ.includes('diminue') || normQ.includes('moin')) {
        numDelta = -Math.abs(numDelta || 15);
      } else {
        numDelta = Math.abs(numDelta || 20);
      }

      const simRes = window.runMacroInflationSimulation(targetIng, 0, numDelta, 'grams');
      const isSaving = simRes.totalMonthlySurcost < 0;
      responseText = `⚖️ <strong>Simulation "What-If" Dosage : ${numDelta > 0 ? '+' : ''}${numDelta}g de ${simRes.ingredient} par portion :</strong><br><br>
• <strong>Fiches concernées :</strong> <strong>${simRes.count} recettes</strong> utilisent cette matière première.<br>
• <strong>Impact moyen par assiette :</strong> <strong style="color:${isSaving ? '#10b981' : '#ef4444'};">${(simRes.affectedDishes[0] || {}).costDiff > 0 ? '+' : ''}${(simRes.affectedDishes[0] || {}).costDiff || 0} DH / portion</strong>.<br>
• <strong>Impact Trésorerie Mensuelle :</strong> <strong style="font-size:14px; color:${isSaving ? '#10b981' : '#ef4444'};">${isSaving ? '+' + Math.abs(simRes.totalMonthlySurcost).toLocaleString('fr-FR') + ' DH (Économie nette)' : '-' + simRes.totalMonthlySurcost.toLocaleString('fr-FR') + ' DH (Surcoût)'}</strong>.<br><br>
<div style="display:flex; gap:8px; flex-wrap:wrap;">
  <button class="btn btn-primary" style="font-size:11.5px; padding:5px 12px;" onclick="window.simSelectedIngredient='${simRes.ingredient}'; window.simGrammageDelta=${numDelta}; window.setAITab('simulator');">
    🎛️ Voir le détail dans le Simulateur What-If
  </button>
  ${isSaving && simRes.count > 0 ? `
    <button class="ai-btn-action" style="background:#10b981; color:#fff; font-size:11.5px; padding:5px 12px;" onclick="window.simSelectedIngredient='${simRes.ingredient}'; window.simGrammageDelta=${numDelta}; window.applyBatchSimulatedGrammage();">
      ⚡ Appliquer ce réglage (${numDelta}g) sur les ${simRes.count} fiches
    </button>
  ` : ''}
</div>`;
    }

    // ========================================================
    // 12. RECHERCHE PAR INGRÉDIENT / COMPOSITION (ex: "Quel plat qui contient viande hachée")
    // ========================================================
    if (!responseText) {
      let isIngQuery = normQ.includes('contient') || normQ.includes('contiennent') || normQ.includes('compose') || normQ.includes('a base de') || normQ.includes('recette avec') || normQ.includes('recettes avec') || normQ.includes('plat avec') || normQ.includes('plats avec') || normQ.includes('qui a du') || normQ.includes('qui a de la') || normQ.includes('qui utilise') || normQ.includes('ou y a t il') || normQ.includes('ingredient');

      let targetIngTerm = '';
      let targetIngLabel = '';

      // Chercher d'abord dans le dictionnaire
      for (const item of NLP_ING_DICT) {
        if (item.aliases.some(a => normQ.includes(a))) {
          targetIngTerm = item.aliases[0];
          targetIngLabel = item.label;
          isIngQuery = true;
          break;
        }
      }

      // Si motif "contient X" ou "avec X" sans match dictionnaire direct
      if (isIngQuery && !targetIngTerm) {
        const regexPat = /(?:contient|contiennent|compose\s+de|a\s+base\s+de|avec\s+du|avec\s+de\s+la|avec\s+des|avec|utilise)\s+(.+)/;
        const m = normQ.match(regexPat);
        if (m && m[1]) {
          targetIngTerm = m[1].replace(/dans\s+la\s+carte|dans\s+le\s+menu|chez\s+nous|svp|s\s+il\s+vous\s+plait/g, '').trim();
          targetIngLabel = targetIngTerm.toUpperCase();
        }
      }

      if (isIngQuery && targetIngTerm) {
        const matchedDishes = findDishesByIngredient(targetIngTerm, recipes);
        if (matchedDishes.length > 0) {
          const totalCost = matchedDishes.reduce((sum, m) => sum + m.costDH, 0);
          const avgCost = totalCost / matchedDishes.length;

          responseText = `🥩 <strong>${matchedDishes.length} Fiches Techniques contenant « ${targetIngLabel} » :</strong><br>
<span style="font-size:12px; color:var(--text-muted);">Coût moyen de cet ingrédient par assiette : <strong>${avgCost.toFixed(2)} DH</strong></span><br><br>
<div class="ai-chat-cards-list">
  ${matchedDishes.slice(0, 8).map((m, idx) => `
    <div class="ai-chat-mini-card" style="border-left: 3px solid #0284c7;">
      <div>
        <strong>#${idx + 1} ${m.recipe.name}</strong> (${m.recipe.category})<br>
        <span style="font-size:11.5px; color:var(--text);">
          Dosage : <strong style="color:#0284c7;">${m.portion}</strong>
          ${m.costDH > 0 ? ` &bull; Coût ingrédient : <strong>${m.costDH.toFixed(2)} DH</strong>` : ''}
        </span><br>
        <small style="color:var(--text-muted);">Prix : ${m.recipe.sellPrice} DH | Coût total : ${m.recipe.greyCorner.cost.toFixed(2)} DH (FC ${m.recipe.greyCorner.foodCost.toFixed(1)}%) &bull; Marge : +${m.recipe.greyCorner.grossMarginDH.toFixed(2)} DH</small>
      </div>
      <div style="text-align:right; display:flex; flex-direction:column; gap:4px; align-items:flex-end;">
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px;" onclick="window.applyAIOptimization('${encodeURIComponent(m.recipe.name)}', 'inspect')">🔍 Examiner</button>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; background:#0284c7; color:#fff;" onclick="window.simSelectedIngredient='${encodeURIComponent(targetIngLabel)}'; window.setAITab('simulator');">🎛️ What-If</button>
      </div>
    </div>
  `).join('')}
</div>
${matchedDishes.length > 8 ? `<div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">... et <strong>${matchedDishes.length - 8} autres fiches techniques</strong> actives dans le catalogue.</div>` : ''}
<div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
  <button class="btn btn-primary" style="font-size:11.5px; padding:5px 12px;" onclick="window.simSelectedIngredient='${encodeURIComponent(targetIngLabel)}'; window.setAITab('simulator');">
    🎛️ Simuler l'impact prix/dosage sur « ${targetIngLabel} »
  </button>
</div>`;
        } else {
          responseText = `🔍 Aucune fiche technique active ne semble utiliser l'ingrédient « <strong>${targetIngLabel}</strong> » dans ses pesées actuelles.<br><br>
<em>💡 Essayez avec des matières clés : « viande hachée », « poulet », « mozzarella », « saumon », « crème », « crevettes »...</em>`;
        }
      }
    }

    // ========================================================
    // 13. EXPLORATION PAR CATÉGORIE (ex: "Combien de pizzas ?", "Liste des burgers")
    // ========================================================
    if (!responseText) {
      const isCatQuery = normQ.includes('combien de') || normQ.includes('liste des') || normQ.includes('liste de') || normQ.includes('donne moi les') || normQ.includes('montre moi les') || normQ.includes('toutes les') || normQ.includes('tous les') || normQ.includes('quelles sont les') || normQ.includes('quels sont les') || normQ.includes('carte des') || normQ.includes('carte de') || normQ.includes('nos pizzas') || normQ.includes('nos burgers') || normQ.includes('nos salades') || normQ.includes('nos pates');

      const catKeywords = {
        'pizza': 'PIZZA', 'pizzas': 'PIZZA',
        'burger': 'BURGER', 'burgers': 'BURGER',
        'pasta': 'PASTA', 'pates': 'PASTA', 'spaghetti': 'PASTA', 'tagliatelle': 'PASTA', 'penne': 'PASTA',
        'salade': 'SALADES', 'salades': 'SALADES',
        'sandwich': 'SANDWICH', 'sandwichs': 'SANDWICH',
        'panini': 'PANINI', 'paninis': 'PANINI',
        'wrap': 'WRAP', 'wraps': 'WRAP',
        'dessert': 'DESSERTS', 'desserts': 'DESSERTS',
        'boisson': 'BOISSONS', 'boissons': 'BOISSONS',
        'jus': 'JUS',
        'cafe': 'CAFES', 'cafes': 'CAFES',
        'petit dej': 'PETIT DEJEUNER', 'petit dejeuner': 'PETIT DEJEUNER',
        'plats chauds': 'PLATS', 'plats principaux': 'PLATS', 'plat principal': 'PLATS'
      };

      for (const [kw, catTarget] of Object.entries(catKeywords)) {
        if (normQ.includes(kw) && (isCatQuery || normQ === kw || normQ === 'les ' + kw || normQ === 'des ' + kw)) {
          const catDishes = recipes.filter(r => normalizeNLP(r.category) === normalizeNLP(catTarget) || normalizeNLP(r.category).includes(normalizeNLP(catTarget)));
          if (catDishes.length > 0) {
            const avgPrice = catDishes.reduce((sum, r) => sum + r.sellPrice, 0) / catDishes.length;
            const avgFC = catDishes.reduce((sum, r) => sum + r.greyCorner.foodCost, 0) / catDishes.length;
            const avgMargin = catDishes.reduce((sum, r) => sum + r.greyCorner.grossMarginDH, 0) / catDishes.length;

            responseText = `🍽️ <strong>Famille Culinaire : « ${catTarget} » (${catDishes.length} fiches techniques actives) :</strong><br><br>
• <strong>Prix de vente moyen :</strong> <strong>${avgPrice.toFixed(2)} DH</strong><br>
• <strong>Food Cost moyen :</strong> <strong style="color:${avgFC > 32 ? '#d97706' : '#16a34a'};">${avgFC.toFixed(1)}%</strong><br>
• <strong>Marge brute moyenne :</strong> <strong style="color:#0284c7;">+${avgMargin.toFixed(2)} DH / assiette</strong><br><br>
<div class="ai-chat-cards-list">
  ${catDishes.slice(0, 6).map((r, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${r.name}</strong><br>
        <small style="color:var(--text-muted);">Prix : ${r.sellPrice} DH | Coût : ${r.greyCorner.cost.toFixed(2)} DH | FC : ${r.greyCorner.foodCost.toFixed(1)}%</small>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900;">+${r.greyCorner.grossMarginDH.toFixed(2)} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>
${catDishes.length > 6 ? `<div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">... et ${catDishes.length - 6} autres plats de cette famille.</div>` : ''}`;
            break;
          }
        }
      }
    }

    // ========================================================
    // 14. FILTRAGE PAR SEUILS DE PRIX & CLASSEMENTS
    // ========================================================
    if (!responseText) {
      if (normQ.includes('le plus cher') || normQ.includes('les plus chers') || normQ.includes('prix maximum') || normQ.includes('record de prix')) {
        const sortedDesc = [...recipes].sort((a, b) => b.sellPrice - a.sellPrice).slice(0, 5);
        responseText = `💎 <strong>Top 5 des Plats les plus Chers de la Carte :</strong><br><br>
<div class="ai-chat-cards-list">
  ${sortedDesc.map((r, idx) => `
    <div class="ai-chat-mini-card" style="border-left:3px solid #d97706;">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Coût : ${r.greyCorner.cost.toFixed(2)} DH (FC ${r.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:900; font-size:13.5px; color:#d97706;">${r.sellPrice} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>`;
      } else if (normQ.includes('le moins cher') || normQ.includes('les moins chers') || normQ.includes('prix minimum') || normQ.includes('plus accessible') || normQ.includes('plus economique')) {
        const sortedAsc = [...recipes].filter(r => r.sellPrice > 0).sort((a, b) => a.sellPrice - b.sellPrice).slice(0, 5);
        responseText = `🏷️ <strong>Top 5 des Plats les plus Accessibles (Entrée de Gamme) :</strong><br><br>
<div class="ai-chat-cards-list">
  ${sortedAsc.map((r, idx) => `
    <div class="ai-chat-mini-card" style="border-left:3px solid #16a34a;">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Coût : ${r.greyCorner.cost.toFixed(2)} DH (FC ${r.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:900; font-size:13.5px; color:#16a34a;">${r.sellPrice} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>`;
      } else {
        const underMatch = normQ.match(/(?:moins\s+de|inferieur\s+a|<)\s*(\d+)/);
        const overMatch = normQ.match(/(?:plus\s+de|superieur\s+a|>)\s*(\d+)/);
        if (underMatch) {
          const limit = parseInt(underMatch[1], 10);
          const underDishes = recipes.filter(r => r.sellPrice > 0 && r.sellPrice <= limit).sort((a, b) => b.greyCorner.grossMarginDH - a.greyCorner.grossMarginDH);
          responseText = `💰 <strong>${underDishes.length} Plats à moins de ${limit} DH (Triés par rentabilité cash) :</strong><br><br>
<div class="ai-chat-cards-list">
  ${underDishes.slice(0, 6).map((r, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Prix : ${r.sellPrice} DH | Coût : ${r.greyCorner.cost.toFixed(2)} DH</small>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900;">+${r.greyCorner.grossMarginDH.toFixed(2)} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>`;
        } else if (overMatch) {
          const limit = parseInt(overMatch[1], 10);
          const overDishes = recipes.filter(r => r.sellPrice >= limit).sort((a, b) => b.sellPrice - a.sellPrice);
          responseText = `💎 <strong>${overDishes.length} Plats à ${limit} DH et plus :</strong><br><br>
<div class="ai-chat-cards-list">
  ${overDishes.slice(0, 6).map((r, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Coût : ${r.greyCorner.cost.toFixed(2)} DH (FC ${r.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:900; color:#d97706;">${r.sellPrice} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>`;
        }
      }
    }

    // ========================================================
    // 15. QUESTION CIBLÉE SUR UN PLAT SPÉCIFIQUE (FUZZY MATCH & COMPOSITION DÉTAILLÉE)
    // ========================================================
    if (!responseText) {
      let matchedDish = fuzzyFindRecipe(rawQ, recipes);
      if (matchedDish) {
        const diff = matchedDish.standard ? matchedDish.standard.diffDH : 0;
        const bdList = matchedDish.greyCorner.breakdown || [];
        responseText = `🍽️ <strong>Analyse Détaillée : « ${matchedDish.name} »</strong> (${matchedDish.category}) :<br><br>
• <strong>Prix de vente :</strong> <strong>${matchedDish.sellPrice} DH</strong><br>
• <strong>Coût de revient matière :</strong> <strong>${matchedDish.greyCorner.cost.toFixed(2)} DH</strong> (Food Cost : <strong style="color:${matchedDish.greyCorner.foodCost > 35 ? '#dc2626' : '#16a34a'};">${matchedDish.greyCorner.foodCost.toFixed(1)}%</strong>)<br>
• <strong>Marge Brute Cash :</strong> <strong style="color:#0284c7;">+${matchedDish.greyCorner.grossMarginDH.toFixed(2)} DH</strong> (${matchedDish.greyCorner.margin.toFixed(1)}%)<br>
• <strong>Standard International :</strong> Coût ${matchedDish.standard ? matchedDish.standard.cost.toFixed(2) : 'N/A'} DH (Food Cost : ${matchedDish.standard ? matchedDish.standard.foodCost.toFixed(1) : 'N/A'}%)<br>
${diff > 0.5 ? `⚠️ <strong>Écart de surdosage :</strong> +${diff.toFixed(2)} DH par portion par rapport à la référence métier.` : `✅ <strong>Portion conforme :</strong> Grammages alignés sur les standards de rentabilité.`}<br><br>

${bdList.length > 0 ? `
<div style="margin-bottom:12px;">
  <strong style="font-size:12px;">📋 Composition &amp; Grammages exacts de la Fiche Technique :</strong>
  <div class="ai-sim-table-wrap" style="max-height:180px; margin-top:6px;">
    <table class="ai-sim-table" style="font-size:11px;">
      <thead>
        <tr>
          <th>Ingrédient</th>
          <th>Dosage</th>
          <th>Coût / Port.</th>
        </tr>
      </thead>
      <tbody>
        ${bdList.map(b => `
          <tr>
            <td><strong>${b.ingredient}</strong></td>
            <td>${b.quantity || (b.qtyNumber + ' ' + (b.unit || 'g'))}</td>
            <td><strong style="color:#0284c7;">${(b.cost || 0).toFixed(2)} DH</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</div>
` : ''}

<div style="display:flex; gap:8px; flex-wrap:wrap;">
  ${diff > 0.5 ? `<button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${encodeURIComponent(matchedDish.name)}', 'apply_standard')">🟢 Aligner Standard</button>` : ''}
  <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${encodeURIComponent(matchedDish.name)}', 'inspect')">🔍 Examiner dans le Comparateur</button>
</div>`;
      }
    }

    // ========================================================
    // 16. FALLBACK INTELLIGENT : RECHERCHE PLEIN TEXTE TOLÉRANTE
    // ========================================================
    if (!responseText) {
      const qTokens = normQ.split(' ').filter(w => w.length >= 3 && !NLP_STOP_WORDS.has(w));
      const fallbackMatches = [];

      if (qTokens.length > 0) {
        recipes.forEach(r => {
          const rName = normalizeNLP(r.name);
          const rCat = normalizeNLP(r.category);
          const rIngs = (r.greyCorner.tech || []).map(t => normalizeNLP(t)).join(' ');
          const allContent = `${rName} ${rCat} ${rIngs}`;

          let score = 0;
          qTokens.forEach(t => {
            if (allContent.includes(t)) score += t.length;
          });
          if (score > 0) {
            fallbackMatches.push({ recipe: r, score });
          }
        });
      }

      fallbackMatches.sort((a, b) => b.score - a.score);

      if (fallbackMatches.length > 0) {
        const topMatches = fallbackMatches.slice(0, 6);
        responseText = `🔍 <strong>Résultats pertinents pour votre recherche « ${rawQ} » (${fallbackMatches.length} fiches trouvées) :</strong><br><br>
<div class="ai-chat-cards-list">
  ${topMatches.map((m, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${m.recipe.name}</strong> (${m.recipe.category})<br>
        <small style="color:var(--text-muted);">Prix : ${m.recipe.sellPrice} DH | Coût : ${m.recipe.greyCorner.cost.toFixed(2)} DH (FC ${m.recipe.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900;">+${m.recipe.greyCorner.grossMarginDH.toFixed(2)} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(m.recipe.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>
${fallbackMatches.length > 6 ? `<div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">... et ${fallbackMatches.length - 6} autres plats correspondants.</div>` : ''}`;
      } else {
        responseText = `🤖 Je n'ai trouvé aucune fiche technique ni ingrédient correspondant exactement à « <strong>${rawQ}</strong> » dans le catalogue.<br><br>
Voici quelques suggestions que vous pouvez me poser :<br>
• 🥩 <em>« Quel plat qui contient viande hachée ? »</em><br>
• 🍕 <em>« Combien avons-nous de pizzas ? »</em><br>
• 🏆 <em>« Quels sont les 5 plats les plus rentables ? »</em><br>
• 💎 <em>« Quel est le plat le plus cher de la carte ? »</em><br>
• ⚖️ <em>« Compare Pizza Margherita et Pizza 4 Saisons »</em>`;
      }
    }

    aiChatHistory.push({ sender: 'ai', time: now, text: responseText });
    if (typeof window.renderAIChatMessages === 'function') window.renderAIChatMessages();
  };

  /* ========================================================
     2. SIMULATEUR MACRO "WHAT-IF" : DUAL LEVIER PRIX & GRAMMAGE
     Permet de simuler conjointement :
     - Levier A (Fournisseur) : variation du prix d'achat (+% / -%)
     - Levier B (Cuisine/Portion) : surdosage ou réduction de grammage (±g ou ±%)
     - Mesure l'impact direct sur la trésorerie mensuelle et le Food Cost
     - Permet d'appliquer le nouveau grammage sur une recette ou en masse (SSOT)
  ======================================================== */
  window.simSelectedIngredient = window.simSelectedIngredient || 'Mozzarella';
  window.simVariationPct = typeof window.simVariationPct === 'number' ? window.simVariationPct : 15;
  window.simGrammageDelta = typeof window.simGrammageDelta === 'number' ? window.simGrammageDelta : 0;
  window.simGrammageMode = window.simGrammageMode || 'grams'; // 'grams' ou 'pct'

  window.setSimVariation = function(pct) {
    window.simVariationPct = pct;
    const disp = document.getElementById('sim-variation-display');
    if (disp) {
      disp.textContent = (pct > 0 ? '+' : '') + pct + '%';
      disp.style.color = pct > 0 ? '#ef4444' : (pct < 0 ? '#10b981' : 'var(--text-muted)');
    }
    const slider = document.getElementById('sim-price-slider');
    if (slider && parseInt(slider.value, 10) !== pct) slider.value = pct;
    if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
  };

  window.setSimGrammageDelta = function(val) {
    window.simGrammageDelta = val;
    const isPct = window.simGrammageMode === 'pct';
    const unitLabel = isPct ? '%' : 'g';
    const disp = document.getElementById('sim-grammage-display');
    if (disp) {
      disp.textContent = (val > 0 ? '+' : '') + val + unitLabel;
      disp.style.color = val < 0 ? '#10b981' : (val > 0 ? '#ef4444' : 'var(--text-muted)');
    }
    const slider = document.getElementById('sim-grammage-slider');
    if (slider && parseFloat(slider.value) !== val) slider.value = val;
    if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
  };

  window.setSimGrammageMode = function(mode) {
    window.simGrammageMode = mode;
    const slider = document.getElementById('sim-grammage-slider');
    if (slider) {
      if (mode === 'pct') {
        slider.min = "-50";
        slider.max = "50";
        slider.step = "5";
      } else {
        slider.min = "-60";
        slider.max = "60";
        slider.step = "5";
      }
    }
    const btnG = document.getElementById('sim-mode-btn-grams');
    const btnP = document.getElementById('sim-mode-btn-pct');
    if (btnG) btnG.className = mode === 'grams' ? 'ai-tab-btn active' : 'ai-tab-btn';
    if (btnP) btnP.className = mode === 'pct' ? 'ai-tab-btn active' : 'ai-tab-btn';
    window.setSimGrammageDelta(window.simGrammageDelta || 0);
  };

  window.runMacroInflationSimulation = function(ingName, pct, gramDelta, gramMode) {
    const ingredient = ingName || window.simSelectedIngredient || 'Mozzarella';
    const variationPct = typeof pct === 'number' ? pct : (window.simVariationPct !== undefined ? window.simVariationPct : 15);
    const gramVal = typeof gramDelta === 'number' ? gramDelta : (window.simGrammageDelta !== undefined ? window.simGrammageDelta : 0);
    const mode = gramMode || window.simGrammageMode || 'grams';
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const recipes = window.allRecipes || [];
    const targetClean = cleanFn(ingredient);
    const affectedDishes = [];
    let totalMonthlySurcost = 0;

    recipes.forEach(r => {
      const matchLine = (r.greyCorner.breakdown || []).find(b => cleanFn(b.ingredient).includes(targetClean));
      if (matchLine) {
        const oldQty = (matchLine.qtyNumber !== undefined && matchLine.qtyNumber !== null) ? matchLine.qtyNumber : (parseFloat(matchLine.quantity) || 0);
        const unit = matchLine.unit || 'g';
        const oldUnitCost = (matchLine.unitPrice !== undefined && matchLine.unitPrice !== null) ? matchLine.unitPrice : (oldQty > 0 ? matchLine.cost / oldQty : 0);
        const oldLineCost = matchLine.cost;

        // Calcul de la nouvelle quantité par portion
        let newQty = oldQty;
        if (mode === 'pct' || unit === 'piece') {
          newQty = oldQty * (1 + gramVal / 100);
        } else {
          newQty = oldQty + gramVal;
        }
        newQty = Math.max(0, Math.round(newQty * 10) / 10);

        // Nouveau coût d'achat unitaire avec levier fournisseur
        const newUnitCost = oldUnitCost * (1 + variationPct / 100);
        // Nouveau coût matière pour cette ligne d'ingrédient
        const newLineCost = newQty * newUnitCost;
        // Impact financier net par assiette
        const costDiff = newLineCost - oldLineCost;
        const newRecipeCost = Math.max(0, r.greyCorner.cost + costDiff);
        const newFC = r.sellPrice > 0 ? (newRecipeCost / r.sellPrice * 100) : 0;
        const monthlyImpact = costDiff * 50; // base conservative 50 portions/mois

        totalMonthlySurcost += monthlyImpact;
        affectedDishes.push({
          name: r.name,
          category: r.category,
          sellPrice: r.sellPrice,
          oldCost: r.greyCorner.cost,
          newCost: Math.round(newRecipeCost * 100) / 100,
          oldFC: r.greyCorner.foodCost,
          newFC: Math.round(newFC * 10) / 10,
          oldQty: Math.round(oldQty * 10) / 10,
          newQty: newQty,
          unit: unit,
          costDiff: Math.round(costDiff * 100) / 100,
          monthlyImpact: Math.round(monthlyImpact),
          suggestedCompPrice: Math.ceil((newRecipeCost / 0.32) / 2) * 2
        });
      }
    });

    affectedDishes.sort((a, b) => b.costDiff - a.costDiff);
    return {
      ingredient,
      variationPct,
      gramDelta: gramVal,
      gramMode: mode,
      count: affectedDishes.length,
      totalMonthlySurcost: Math.round(totalMonthlySurcost),
      affectedDishes
    };
  };

  window.applyGrammageToRecipe = function(recipeName, ingTarget, newQty, unit, silent) {
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const decodedName = (typeof recipeName === 'string' && recipeName.includes('%')) ? decodeURIComponent(recipeName) : recipeName;
    const decodedIng = (typeof ingTarget === 'string' && ingTarget.includes('%')) ? decodeURIComponent(ingTarget) : ingTarget;
    const targetNameClean = cleanFn(decodedName);
    const targetIngClean = cleanFn(decodedIng);
    const recipesList = window.allRecipes || [];
    const recipe = recipesList.find(r => cleanFn(r.name) === targetNameClean) || recipesList.find(r => r.name === decodedName);
    if (!recipe || !recipe.greyCorner || !Array.isArray(recipe.greyCorner.tech)) return;

    // Trouver la ligne de l'ingrédient
    const ingIdx = recipe.greyCorner.tech.findIndex(line => {
      const parts = line.split(':');
      return cleanFn(parts[0]).includes(targetIngClean) || targetIngClean.includes(cleanFn(parts[0]));
    });
    if (ingIdx === -1) return;

    const oldLine = recipe.greyCorner.tech[ingIdx];
    const parts = oldLine.split(':');
    const ingLabel = parts[0].trim();
    const finalUnit = unit || (parts[1] ? parts[1].replace(/[\d.,\s]/g, '') : 'g') || 'g';
    recipe.greyCorner.tech[ingIdx] = `${ingLabel} : ${newQty} ${finalUnit}`;

    // Enregistrer dans editedRecipes
    const edits = window.editedRecipes || {};
    edits[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      sellPrice: recipe.sellPrice,
      updatedAt: Date.now()
    };
    window.editedRecipes = edits;
    if (typeof window.saveEdits === 'function') window.saveEdits(true);

    // Recalculer le food cost & standard diff
    if (typeof window.calculateRecipeFoodCost === 'function') {
      const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
      recipe.greyCorner.cost = costObj.cost;
      recipe.greyCorner.foodCost = costObj.foodCost;
      recipe.greyCorner.margin = costObj.margin;
      recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
      recipe.greyCorner.breakdown = costObj.breakdown;
      if (recipe.standard) {
        recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;
      }
    }

    if (!silent && typeof window.GC_Toast !== 'undefined') {
      window.GC_Toast.show(`⚖️ Portion ajustée : ${ingLabel} réglé à ${newQty}${finalUnit} sur "${recipe.name}" !`, 'success');
    }

    if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
    if (typeof window.renderRecipeCards === 'function') window.renderRecipeCards();
    if (typeof window.renderComparatorTable === 'function') window.renderComparatorTable();
  };

  window.applyBatchSimulatedGrammage = function() {
    const ingName = window.simSelectedIngredient || 'Mozzarella';
    const delta = typeof window.simGrammageDelta === 'number' ? window.simGrammageDelta : 0;
    const mode = window.simGrammageMode || 'grams';
    if (delta === 0) {
      if (typeof window.GC_Toast !== 'undefined') window.GC_Toast.show("Le grammage n'a pas été modifié (variation 0).", "info");
      return;
    }
    const sim = window.runMacroInflationSimulation(ingName, window.simVariationPct, delta, mode);
    if (!sim.affectedDishes || sim.affectedDishes.length === 0) {
      if (typeof window.GC_Toast !== 'undefined') window.GC_Toast.show("Aucun plat concerné à mettre à jour.", "info");
      return;
    }
    const unitLabel = mode === 'pct' ? '%' : 'g';
    const impactTxt = sim.totalMonthlySurcost < 0 ? `+${Math.abs(sim.totalMonthlySurcost).toLocaleString('fr-FR')} DH / mois d'économie` : (sim.totalMonthlySurcost > 0 ? `-${sim.totalMonthlySurcost.toLocaleString('fr-FR')} DH / mois de surcoût` : 'neutre');
    const confirmed = confirm(`⚡ APPLICATION DU NOUVEAU DOSAGE PAR L'AGENT IA\n\n` +
      `Matière première : ${sim.ingredient}\n` +
      `Ajustement : ${delta > 0 ? '+' : ''}${delta}${unitLabel} par portion\n` +
      `Plats impactés : ${sim.count} fiches techniques\n` +
      `Impact Trésorerie : ${impactTxt}\n\n` +
      `Souhaitez-vous appliquer ces nouveaux grammages et recalculer instantanément le Food Cost et le Déstockage ?`);
    if (!confirmed) return;

    sim.affectedDishes.forEach(d => {
      window.applyGrammageToRecipe(d.name, sim.ingredient, d.newQty, d.unit, true);
    });

    if (typeof window.GC_Toast !== 'undefined') {
      window.GC_Toast.show(`⚡ Ajustement groupé réussi : ${sim.count} fiches mises à jour avec le nouveau grammage de ${sim.ingredient} !`, 'success');
    }
    if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
    if (typeof window.renderRecipeCards === 'function') window.renderRecipeCards();
    if (typeof window.renderComparatorTable === 'function') window.renderComparatorTable();
  };

  window.updateSimulationView = function() {
    const sel = document.getElementById('sim-ingredient-select');
    if (sel) window.simSelectedIngredient = sel.value;
    const resPanel = document.getElementById('sim-results-panel');
    if (!resPanel) return;

    const sim = window.runMacroInflationSimulation(window.simSelectedIngredient, window.simVariationPct, window.simGrammageDelta, window.simGrammageMode);
    const varPriceText = sim.variationPct > 0 ? `+${sim.variationPct}%` : `${sim.variationPct}%`;
    const varPriceClass = sim.variationPct > 0 ? 'text-danger' : (sim.variationPct < 0 ? 'text-success' : 'text-muted');
    const unitLabel = sim.gramMode === 'pct' ? '%' : 'g';
    const varGramText = sim.gramDelta > 0 ? `+${sim.gramDelta}${unitLabel}` : `${sim.gramDelta}${unitLabel}`;
    const varGramClass = sim.gramDelta < 0 ? 'text-success' : (sim.gramDelta > 0 ? 'text-danger' : 'text-muted');

    const isSaving = sim.totalMonthlySurcost < 0;
    const isSurcost = sim.totalMonthlySurcost > 0;
    const impactColor = isSaving ? '#10b981' : (isSurcost ? '#ef4444' : 'var(--text)');

    resPanel.innerHTML = `
      <div class="ai-sim-kpis">
        <div class="ai-stat-card" style="border-left:4px solid #0284c7;">
          <div class="ai-stat-label">Ingrédient &amp; Leviers</div>
          <div class="ai-stat-value text-accent">${(window.escapeHtml || (s => s))(sim.ingredient)}</div>
          <div class="ai-stat-sub">Prix : <strong class="${varPriceClass}">${varPriceText}</strong> | Dosage : <strong class="${varGramClass}">${varGramText}</strong></div>
        </div>
        <div class="ai-stat-card" style="border-left:4px solid ${impactColor};">
          <div class="ai-stat-label">Impact Trésorerie / Mois</div>
          <div class="ai-stat-value" style="color:${impactColor};">
            ${isSaving ? '+' : (isSurcost ? '-' : '')}${Math.abs(sim.totalMonthlySurcost).toLocaleString('fr-FR')} DH
          </div>
          <div class="ai-stat-sub">${isSaving ? 'Économie mensuelle estimée' : (isSurcost ? 'Surcoût mensuel estimé' : 'Impact neutre sur la marge')}</div>
        </div>
        <div class="ai-stat-card" style="border-left:4px solid #f59e0b;">
          <div class="ai-stat-label">Plats Concernés</div>
          <div class="ai-stat-value" style="color:#f59e0b;">${sim.count} fiches</div>
          <div class="ai-stat-sub">Recettes utilisant cette matière</div>
        </div>
      </div>

      ${sim.count === 0 ? `
        <div style="padding:15px; text-align:center; color:var(--text-muted); font-size:12px;">
          Aucune recette active n'utilise l'ingrédient « ${(window.escapeHtml || (s => s))(sim.ingredient)} ».
        </div>
      ` : `
        ${sim.gramDelta !== 0 ? `
          <div class="ai-sim-batch-banner" style="background:var(--card-bg); border:1px solid var(--border); border-left:4px solid ${sim.gramDelta < 0 ? '#10b981' : '#f59e0b'}; padding:10px 14px; border-radius:8px; margin-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <strong style="color:var(--text); font-size:12.5px;">⚡ Action Cuisine Rapide : Calibrage de Portion (${sim.gramDelta > 0 ? '+' : ''}${sim.gramDelta}${unitLabel})</strong>
              <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
                Appliquer ce nouveau grammage de <strong>${sim.ingredient}</strong> sur l'ensemble des <strong>${sim.count} fiches</strong> en un clic (synchronise Déstockage et Cuisine).
              </div>
            </div>
            <button class="ai-btn-action" style="background:${sim.gramDelta < 0 ? '#10b981' : '#0284c7'}; color:#fff; font-weight:800; padding:6px 14px; font-size:12px; border:none; border-radius:6px; cursor:pointer;" onclick="window.applyBatchSimulatedGrammage()">
              🚀 Appliquer aux ${sim.count} plats (${isSaving ? '+' + Math.abs(sim.totalMonthlySurcost).toLocaleString('fr-FR') + ' DH/m' : (isSurcost ? '-' + sim.totalMonthlySurcost.toLocaleString('fr-FR') + ' DH/m' : '0 DH')})
            </button>
          </div>
        ` : ''}

        <div style="margin-top:12px; font-size:12px; font-weight:800; color:var(--text); margin-bottom:6px;">
          📋 Plats impactés, Nouveaux Dosages &amp; Prix Conseillés :
        </div>
        <div class="ai-sim-table-wrap">
          <table class="ai-sim-table">
            <thead>
              <tr>
                <th>Plat</th>
                <th>Prix Vente</th>
                <th>Dosage Portion</th>
                <th>Coût Portion ➔ Nouveau</th>
                <th>Food Cost ➔ Nouveau</th>
                <th>Impact / Port.</th>
                <th>Prix Conseillé</th>
                <th>Actions IA</th>
              </tr>
            </thead>
            <tbody>
              ${sim.affectedDishes.map(d => `
                <tr>
                  <td><strong>${d.name}</strong></td>
                  <td>${d.sellPrice} DH</td>
                  <td>
                    ${d.oldQty} ${d.unit}
                    ${d.newQty !== d.oldQty ? `➔ <strong style="color:${d.newQty < d.oldQty ? '#10b981' : '#ef4444'};">${d.newQty} ${d.unit}</strong>` : ''}
                  </td>
                  <td>${d.oldCost.toFixed(2)} DH ➔ <strong style="color:${d.costDiff > 0 ? '#ef4444' : (d.costDiff < 0 ? '#10b981' : 'var(--text)')};">${d.newCost.toFixed(2)} DH</strong></td>
                  <td>${d.oldFC.toFixed(1)}% ➔ <strong style="color:${d.newFC > 35 ? '#ef4444' : 'var(--text)'};">${d.newFC}%</strong></td>
                  <td style="font-weight:800; color:${d.costDiff > 0 ? '#ef4444' : (d.costDiff < 0 ? '#10b981' : 'var(--text)')};">${d.costDiff > 0 ? '+' : ''}${d.costDiff.toFixed(2)} DH</td>
                  <td><strong style="color:#0284c7;">${d.suggestedCompPrice} DH</strong></td>
                  <td>
                    <div style="display:flex; gap:4px; flex-wrap:wrap;">
                      ${d.newQty !== d.oldQty ? `
                        <button class="ai-btn-action" style="background:#10b981; color:#fff; font-size:11px; padding:3px 7px;" title="Appliquer ce grammage sur ce plat" onclick="window.applyGrammageToRecipe('${encodeURIComponent(d.name)}', '${encodeURIComponent(sim.ingredient)}', ${d.newQty}, '${d.unit}')">
                          ⚖️ Régler ${d.newQty}${d.unit}
                        </button>
                      ` : ''}
                      <button class="ai-btn-action" style="font-size:11px; padding:3px 7px;" onclick="window.applyAIOptimization('${encodeURIComponent(d.name)}', 'apply_price', ${d.suggestedCompPrice})">
                        Fixer ${d.suggestedCompPrice} DH
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  };

  window.applyAllQuickWinsBatch = function() {
    const analysis = analyzeDatasetForOptimizations();
    const qWins = analysis.quickWins || [];
    if (qWins.length === 0) {
      if (window.GC_Toast) window.GC_Toast.show("Tous vos plats sont déjà parfaitement alignés sur les standards !", "info");
      return;
    }

    const totalSavings = qWins.reduce((sum, q) => sum + (q.monthlyGain || 0), 0);
    const confirmed = confirm(`⚡ OPTIMISATION GROUPÉE PAR L'AGENT IA\n\nSouhaitez-vous appliquer automatiquement les portions standards sur les ${qWins.length} plats identifiés ?\n\n💰 Gain estimé : +${totalSavings.toLocaleString('fr-FR')} DH / mois de trésorerie nette.\n\nCette action recalcule instantanément le Food Cost et synchronise Déstockage et Cuisine.`);
    if (!confirmed) return;

    qWins.forEach(q => {
      if (typeof window.copyStandardToRecipe === 'function') {
        window.copyStandardToRecipe(q.recipeName);
      }
    });

    if (window.GC_Toast) {
      window.GC_Toast.show(`🎉 Succès : ${qWins.length} fiches optimisées ! Gain estimé : +${totalSavings.toLocaleString('fr-FR')} DH/mois`, "success");
    }
    renderAIOptimizerAgent();
  };

  /* ========================================================
     3. GÉNÉRATEUR & CONCEPTEUR DE FICHE TECHNIQUE PAR IA
  ======================================================== */
  window.aiFormulatorState = {
    dishName: 'Pizza Saumon & Burrata',
    category: 'PIZZA',
    targetPrice: 110,
    generatedRecipe: null
  };

  window.generateAIRecipeDraft = function(name, cat, price) {
    const dishName = name || window.aiFormulatorState.dishName || 'Nouvelle Fiche';
    const category = (cat || window.aiFormulatorState.category || 'PIZZA').toUpperCase();
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const cleanN = cleanFn(dishName);

    let baseTech = [];
    if (category.includes('PIZZA')) {
      baseTech = [
        "Pâte à pizza : 220 g",
        "Sauce Tomate Pizza : 90 g",
        "Mozzarella râpée : 100 g"
      ];
      if (cleanN.includes('saumon')) baseTech.push("Saumon fumé : 60 g");
      else if (cleanN.includes('fruit') || cleanN.includes('mer')) baseTech.push("Fruits de Mer : 80 g");
      else if (cleanN.includes('poulet')) baseTech.push("Poulet émincé : 80 g");
      else if (cleanN.includes('viande') || cleanN.includes('hach')) baseTech.push("Viande hachée pur bœuf : 80 g");
      else baseTech.push("Fromage rouge râpé : 40 g");
      if (cleanN.includes('burrata')) {
        baseTech[2] = "Mozzarella râpée : 60 g";
        baseTech.push("Burrata : 1 p");
      }
      baseTech.push("Origan séché : 2 g");
    } else if (category.includes('BURGER')) {
      baseTech = [
        "Pain burger brioché : 1 p",
        "Viande hachée pur bœuf : 120 g",
        "Cheddar fondu : 1 p",
        "Sauce Maison Burger : 30 g",
        "Salade Iceberg : 25 g",
        "Tomate fraîche : 30 g"
      ];
      if (cleanN.includes('truffe')) baseTech.push("Sauce Truffe : 20 g");
      if (cleanN.includes('double') || cleanN.includes('royal')) baseTech[1] = "Viande hachée pur bœuf : 160 g";
    } else if (category.includes('PÂTE') || category.includes('PAST')) {
      baseTech = [
        "Pâtes Penne / Tagliatelles : 110 g",
        "Crème fraîche épaisse : 80 ml",
        "Parmesan râpé : 15 g"
      ];
      if (cleanN.includes('saumon')) baseTech.push("Saumon frais : 70 g");
      else if (cleanN.includes('crevette') || cleanN.includes('mer')) baseTech.push("Crevettes décortiquées : 70 g");
      else if (cleanN.includes('poulet')) baseTech.push("Poulet émincé : 80 g");
      else baseTech.push("Champignons de Paris : 50 g");
    } else if (category.includes('SALAD')) {
      baseTech = [
        "Salade Iceberg : 130 g",
        "Tomates cerises : 40 g",
        "Sauce Vinaigrette Maison : 30 g",
        "Croûtons dorés : 20 g"
      ];
      if (cleanN.includes('cesar') || cleanN.includes('césar') || cleanN.includes('poulet')) baseTech.push("Blanc de Poulet mariné : 80 g", "Parmesan râpé : 15 g");
      else if (cleanN.includes('thon')) baseTech.push("Thon égoutté : 70 g", "Œuf dur : 1 p");
      else baseTech.push("Fromage Feta : 50 g");
    } else {
      baseTech = [
        "Escalope de Poulet : 150 g",
        "Frites dorées : 150 g",
        "Sauce Champignons : 60 g",
        "Légumes sautés : 60 g"
      ];
    }

    const market = FES_CAFE_RESTAURANT_MARKET.getLimits(category, dishName);
    let sellPrice = parseFloat(price) || window.aiFormulatorState.targetPrice || 0;
    
    // Calculer le coût de revient
    const calcFn = window.calculateRecipeFoodCost || calculateRecipeFoodCost;
    let fcCalc = calcFn(baseTech, sellPrice || 60);
    if (!sellPrice || sellPrice <= 0) {
      sellPrice = Math.max(30, Math.min(market.softCeiling, Math.ceil((fcCalc.cost / 0.30) / 5) * 5));
      fcCalc = calcFn(baseTech, sellPrice);
    }

    const generated = {
      name: dishName.toUpperCase(),
      category: category,
      ingredients: baseTech,
      sellPrice: sellPrice,
      cost: fcCalc.cost,
      foodCost: fcCalc.foodCost,
      margin: fcCalc.margin,
      grossMarginDH: fcCalc.grossMarginDH,
      market
    };

    window.aiFormulatorState.generatedRecipe = generated;
    return generated;
  };

  window.triggerAIRecipeGeneration = function(name, cat, price) {
    if (name) window.aiFormulatorState.dishName = name;
    if (cat) window.aiFormulatorState.category = cat;
    if (price) window.aiFormulatorState.targetPrice = parseFloat(price) || 0;
    const gen = window.generateAIRecipeDraft(window.aiFormulatorState.dishName, window.aiFormulatorState.category, window.aiFormulatorState.targetPrice);
    if (typeof window.renderAIGeneratedPreview === 'function') window.renderAIGeneratedPreview(gen);
  };

  window.renderAIGeneratedPreview = function(gen) {
    const container = document.getElementById('ai-gen-preview-container');
    if (!container || !gen) return;

    const fcColor = gen.foodCost <= 32 ? '#10b981' : (gen.foodCost <= 38 ? '#f59e0b' : '#ef4444');

    container.innerHTML = `
      <div class="ai-gen-preview-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
          <div>
            <span style="font-size:11px; font-weight:800; color:#0284c7; background:rgba(2,132,199,0.1); padding:2px 8px; border-radius:4px;">
              ${gen.category} &bull; MODÈLE FÈS OPTIMISÉ
            </span>
            <h3 style="margin:6px 0 2px 0; font-size:16px; font-weight:900; color:var(--text);">${gen.name}</h3>
            <small style="color:var(--text-muted);">Plafond marché conseillé : <strong>${gen.market.marketRange}</strong></small>
          </div>
          <div style="text-align:right;">
            <div style="font-size:18px; font-weight:900; color:#0284c7;">${gen.sellPrice} DH</div>
            <span style="font-weight:800; color:${fcColor}; font-size:12px;">Food Cost : ${gen.foodCost}%</span>
          </div>
        </div>

        <div style="margin: 12px 0 8px 0; font-size:12px; font-weight:800; color:var(--text);">
          🥩 Ingrédients &amp; Grammages Calibrés par l'IA :
        </div>
        <div class="ai-gen-ing-tags">
          ${gen.ingredients.map(ing => `<span class="ai-gen-tag">✅ ${ing}</span>`).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--paper); border:1px solid var(--border); border-radius:8px; padding:10px 14px; margin-top:12px; font-size:12.5px;">
          <div>Coût Portion : <strong style="color:#0284c7;">${gen.cost.toFixed(2)} DH</strong></div>
          <div>Marge Brute : <strong style="color:#10b981;">+${gen.grossMarginDH.toFixed(2)} DH (${gen.margin}%)</strong></div>
        </div>

        <div style="margin-top:14px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-primary" style="padding:10px 20px; font-weight:800; font-size:13px; background:#10b981; border-color:#059669;" onclick="window.saveAIGeneratedRecipeToDB()">
            💾 Enregistrer dans le Menu &amp; Synchroniser
          </button>
        </div>
      </div>
    `;
  };

  window.saveAIGeneratedRecipeToDB = function() {
    const gen = window.aiFormulatorState.generatedRecipe;
    if (!gen) return;

    const confirmed = confirm(`Créer la nouvelle fiche technique « ${gen.name} » ?\n\nPrix : ${gen.sellPrice} DH\nCoût : ${gen.cost.toFixed(2)} DH (Food Cost : ${gen.foodCost}%)\n\nElle sera immédiatement visible dans Cuisine, Déstockage et Comparateur.`);
    if (!confirmed) return;

    const newId = 'rec_ai_' + Date.now();
    const recipeObj = {
      id: newId,
      name: gen.name,
      category: gen.category,
      ingredients: gen.ingredients.slice(),
      tech: gen.ingredients.slice(),
      sellPrice: gen.sellPrice,
      price: gen.sellPrice + ' DH',
      cost: gen.cost,
      foodCost: gen.foodCost,
      margin: gen.margin,
      grossMarginDH: gen.grossMarginDH
    };

    try {
      const rawV5 = localStorage.getItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.RECIPES : 'gc_recipes_db_v5');
      const list = rawV5 ? JSON.parse(rawV5) : JSON.parse(JSON.stringify(window.BASE_RECIPES || []));
      list.push(recipeObj);
      localStorage.setItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.RECIPES : 'gc_recipes_db_v5', JSON.stringify(list));
      localStorage.setItem('gc_recipes_db_version', (typeof RECIPES_DB_VERSION !== 'undefined' ? RECIPES_DB_VERSION : 'v8.2_20260907'));
    } catch(e) {}

    try {
      const savedComp = localStorage.getItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.COMP_EDITS : 'grey_corner_custom_recipes_v5');
      const compEdits = savedComp ? JSON.parse(savedComp) : {};
      compEdits[gen.name] = { tech: gen.ingredients.slice(), sellPrice: gen.sellPrice, updatedAt: Date.now() };
      localStorage.setItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.COMP_EDITS : 'grey_corner_custom_recipes_v5', JSON.stringify(compEdits));
    } catch(e) {}

    try {
      localStorage.setItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.SYNC_PING : 'gc_sync_ping', Date.now().toString());
      window.dispatchEvent(new CustomEvent('gc:recipe-updated', { detail: { recipeName: gen.name, action: 'save' } }));
    } catch(e) {}

    if (window.GC_Toast) {
      window.GC_Toast.show(`✨ Nouvelle fiche « ${gen.name} » créée avec succès !`, 'success');
    }

    if (typeof window.initData === 'function') window.initData();
    if (typeof window.setComparatorMainView === 'function') {
      window.setComparatorMainView('recipes');
    }
    setTimeout(() => {
      window.applyAIOptimization(gen.name, 'inspect');
    }, 250);
  };

  function renderAIOptimizerAgent() {
    const container = document.getElementById('ai-agent-wrapper');
    if (!container) return;

    const analysis = analyzeDatasetForOptimizations();
    const stats = analysis.stats;

    // Contexte des ventes journalières et Menu Engineering
    const salesCtx = getDailySalesContext();
    const dailySales = analyzeDailySales(salesCtx.salesRows);
    const menuEng = analyzeMenuEngineering(salesCtx.salesRows);
var activeList = [];
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

    // Options du sélecteur de dates journalières & cumul annuel
    const dateOptionsHTML = `
      <option value="__auto__" ${salesCtx.effectiveDate === '__auto__' ? 'selected' : ''}>📅 Dernier Jour Disponible</option>
      ${(salesCtx.availableYears || []).map(y => `<option value="__year_${y}" ${salesCtx.effectiveDate === '__year_' + y ? 'selected' : ''}>📈 Cumul Année ${y} (YTD)</option>`).join('')}
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
        
        <!-- ONGLETS PRINCIPAUX DE L'AGENT IA -->
        <div class="ai-nav-pills">
          <button class="ai-pill ${currentAITab === 'assistant' ? 'active' : ''}" onclick="window.setAITab('assistant')">
            💬 Assistant F&amp;B <span class="ai-pill-count">Copilote</span>
          </button>
          <button class="ai-pill ${currentAITab === 'simulator' ? 'active' : ''}" onclick="window.setAITab('simulator')">
            🎛️ Simulateur What-If <span class="ai-pill-count">Prix &amp; Dosage</span>
          </button>
          <button class="ai-pill ${currentAITab === 'generator' ? 'active' : ''}" onclick="window.setAITab('generator')">
            ✨ Concepteur Fiche IA <span class="ai-pill-count">Nouveau</span>
          </button>
          <button class="ai-pill ${currentAITab === 'menu_engineering' ? 'active' : ''}" onclick="window.setAITab('menu_engineering')">
            🎯 Menu Engineering <span class="ai-pill-count">${menuEng.items.length}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'daily_sales' ? 'active' : ''}" onclick="window.setAITab('daily_sales')">
            📅 Ventes du Jour <span class="ai-pill-count">${dailySales.matchedSales.length}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'quick_wins' ? 'active' : ''}" onclick="window.setAITab('quick_wins')">
            🔥 Quick Wins <span class="ai-pill-count">${stats.quickWinsCount}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'pricing' ? 'active' : ''}" onclick="window.setAITab('pricing')">
            💡 Optimisation Prix (Fès) <span class="ai-pill-count">${stats.pricingCount}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'standards' ? 'active' : ''}" onclick="window.setAITab('standards')">
            ⚖️ Réalignement Standards <span class="ai-pill-count">${stats.standardsCount}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'critical' ? 'active' : ''}" onclick="window.setAITab('critical')">
            🚨 Alertes Rentabilité <span class="ai-pill-count">${stats.criticalCount}</span>
          </button>
        </div>

        ${currentAITab === 'assistant' ? `
          <!-- ONGLET 1: ASSISTANT CONVERSATIONNEL EXPERT F&B -->
          <div class="ai-assistant-container">
            <div class="ai-assistant-header-bar">
              <div>
                <div style="font-weight:800; font-size:14px; color:var(--text); display:flex; align-items:center; gap:8px;">
                  <span>💬 Copilote &amp; Conseiller Trésorerie F&amp;B</span>
                  <span class="ai-pill-count" style="background:rgba(99,102,241,0.15); color:#6366f1;">100% Hors-Ligne &bull; Données Réelles</span>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:3px;">
                  Audit instantané de vos recettes, simulations financières et briefings d'équipe basés sur vos ventes réelles.
                </div>
              </div>
              <button class="btn btn-secondary" style="font-size:11px; padding:4px 9px;" onclick="window.clearAIChatHistory ? window.clearAIChatHistory() : null">
                🗑️ Réinitialiser
              </button>
            </div>

            <div class="ai-prompt-chips">
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Quels sont les 3 plats les plus rentables ?') : null">
                🏆 Top 3 plats rentables
              </div>
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Quels plats ont un Food Cost critique > 35% ?') : null">
                🚨 Alertes Food Cost (>35%)
              </div>
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Quels sont les ingrédients les plus coûteux ?') : null">
                🥩 Ingrédients les plus coûteux
              </div>
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Donne-moi le briefing pour les serveurs aujourd\\\'hui') : null">
                📋 Briefing serveurs de ce soir
              </div>
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Comment baisser mon food cost de 2% ?') : null">
                📉 Plan -2% Food Cost
              </div>
            </div>

            <div class="ai-chat-window" id="ai-chat-window">
              <!-- Rendu par renderAIChatMessages() -->
            </div>

            <form class="ai-chat-input-bar" onsubmit="event.preventDefault(); const inp = document.getElementById('ai-chat-user-input'); if(inp && inp.value.trim()){ window.askAIFBAssistant(inp.value.trim()); inp.value = ''; }">
              <input type="text" id="ai-chat-user-input" class="ai-chat-input" placeholder="Posez une question (ex: Quel plat dégage le plus de cash ? Comment optimiser la Mozzarella ?)..." autocomplete="off" />
              <button type="submit" class="ai-chat-send-btn">
                <span>Envoyer</span> 🚀
              </button>
            </form>
          </div>
        ` : currentAITab === 'simulator' ? `
          <!-- ONGLET 2: SIMULATEUR MACRO WHAT-IF (DOUBLE LEVIER PRIX & GRAMMAGE) -->
          <div class="ai-simulator-container">
            <div class="ai-sim-box">
              <div class="ai-sim-controls" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:16px;">
                <!-- 1. SÉLECTEUR MATIÈRE PREMIÈRE -->
                <div class="ai-sim-control-col">
                  <label class="ai-sim-label">1. Matière première clé à tester :</label>
                  <select id="sim-ingredient-select" class="ai-sim-select" onchange="window.simSelectedIngredient = this.value; window.updateSimulationView();">
                    <option value="Mozzarella" ${window.simSelectedIngredient === 'Mozzarella' ? 'selected' : ''}>🧀 Mozzarella râpée</option>
                    <option value="Viande" ${window.simSelectedIngredient === 'Viande' ? 'selected' : ''}>🥩 Viande de bœuf / Steak</option>
                    <option value="Poulet" ${window.simSelectedIngredient === 'Poulet' ? 'selected' : ''}>🍗 Poulet (Émincé / Blanc)</option>
                    <option value="Saumon" ${window.simSelectedIngredient === 'Saumon' ? 'selected' : ''}>🐟 Saumon (Frais / Fumé)</option>
                    <option value="Fromage" ${window.simSelectedIngredient === 'Fromage' ? 'selected' : ''}>🧀 Fromage Rouge / Gouda</option>
                    <option value="Crème" ${window.simSelectedIngredient === 'Crème' ? 'selected' : ''}>🥛 Crème fraîche épaisse</option>
                    <option value="Pain" ${window.simSelectedIngredient === 'Pain' ? 'selected' : ''}>🍞 Pain Burger / Panini</option>
                    <option value="Huile" ${window.simSelectedIngredient === 'Huile' ? 'selected' : ''}>🫒 Huile végétale / Friture</option>
                    <option value="Café" ${window.simSelectedIngredient === 'Café' ? 'selected' : ''}>☕ Café en grains</option>
                    <option value="Sauce Tomate" ${window.simSelectedIngredient === 'Sauce Tomate' ? 'selected' : ''}>🥫 Sauce Tomate Pizza</option>
                  </select>
                  <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                    💡 Sélectionnez l'ingrédient pour simuler l'impact combiné coût fournisseur et portion en cuisine.
                  </div>
                </div>

                <!-- 2. LEVIER FOURNISSEUR : PRIX D'ACHAT -->
                <div class="ai-sim-control-col">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <label class="ai-sim-label" style="margin-bottom:0;">2. Levier Fournisseur (Prix) :</label>
                    <span id="sim-variation-display" style="font-size:15px; font-weight:900; color:${window.simVariationPct > 0 ? '#ef4444' : (window.simVariationPct < 0 ? '#10b981' : 'var(--text-muted)')};">
                      ${window.simVariationPct > 0 ? '+' : ''}${window.simVariationPct}%
                    </span>
                  </div>
                  <div class="ai-sim-slider-wrap" style="margin-top:4px;">
                    <input type="range" id="sim-price-slider" min="-30" max="50" step="5" value="${window.simVariationPct}" class="ai-sim-slider" oninput="window.setSimVariation(parseInt(this.value, 10))" />
                    <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--text-muted); margin-top:2px;">
                      <span>-30%</span>
                      <span>0%</span>
                      <span>+50%</span>
                    </div>
                  </div>
                  <div class="ai-sim-chips">
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(-10)">-10%</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(0)">0%</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(10)">+10%</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(15)">+15%</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(25)">+25%</button>
                  </div>
                </div>

                <!-- 3. LEVIER CUISINE : GRAMMAGE / PORTIONNEMENT -->
                <div class="ai-sim-control-col">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <label class="ai-sim-label" style="margin-bottom:0;">3. Levier Portion (Grammage) :</label>
                    <span id="sim-grammage-display" style="font-size:15px; font-weight:900; color:${(window.simGrammageDelta || 0) < 0 ? '#10b981' : ((window.simGrammageDelta || 0) > 0 ? '#ef4444' : 'var(--text-muted)')};">
                      ${(window.simGrammageDelta || 0) > 0 ? '+' : ''}${window.simGrammageDelta || 0}${window.simGrammageMode === 'pct' ? '%' : 'g'}
                    </span>
                  </div>
                  <div style="display:flex; gap:6px; margin:4px 0;">
                    <button type="button" id="sim-mode-btn-grams" class="ai-tab-btn ${window.simGrammageMode !== 'pct' ? 'active' : ''}" style="padding:2px 8px; font-size:10.5px;" onclick="window.setSimGrammageMode('grams')">Grammes (±g)</button>
                    <button type="button" id="sim-mode-btn-pct" class="ai-tab-btn ${window.simGrammageMode === 'pct' ? 'active' : ''}" style="padding:2px 8px; font-size:10.5px;" onclick="window.setSimGrammageMode('pct')">Pourcentage (±%)</button>
                  </div>
                  <div class="ai-sim-slider-wrap">
                    <input type="range" id="sim-grammage-slider" min="${window.simGrammageMode === 'pct' ? -50 : -60}" max="${window.simGrammageMode === 'pct' ? 50 : 60}" step="5" value="${window.simGrammageDelta || 0}" class="ai-sim-slider" oninput="window.setSimGrammageDelta(parseFloat(this.value))" />
                    <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--text-muted); margin-top:2px;">
                      <span>${window.simGrammageMode === 'pct' ? '-50%' : '-60g'} (Réduction)</span>
                      <span>0</span>
                      <span>${window.simGrammageMode === 'pct' ? '+50%' : '+60g'} (Surdosage)</span>
                    </div>
                  </div>
                  <div class="ai-sim-chips">
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(-25)">-25g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(-15)">-15g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(-10)">-10g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(0)">0g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(10)">+10g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(20)">+20g</button>
                  </div>
                </div>
              </div>

              <div id="sim-results-panel">
                <!-- Rendu dynamiquement par updateSimulationView() -->
              </div>
            </div>
          </div>
        ` : currentAITab === 'generator' ? `
          <!-- ONGLET 3: CONCEPTEUR DE FICHE TECHNIQUE IA -->
          <div class="ai-generator-container">
            <div class="ai-gen-card">
              <div style="margin-bottom:14px;">
                <h4 style="margin:0 0 4px 0; font-size:16px; font-weight:900; color:var(--text);">
                  ✨ Concepteur Intelligent de Fiche Technique (Normes Fès)
                </h4>
                <p style="margin:0; font-size:12px; color:var(--text-muted);">
                  Indiquez le nom de votre plat. L'IA calibre automatiquement les grammages standards, calcule le coût matière exact, vérifie les plafonds tarifaires à Fès et prépare la fiche prête à enregistrer.
                </p>
              </div>

              <div class="ai-gen-form-grid">
                <div class="ai-gen-input-group">
                  <label>Nom du Plat ou Création :</label>
                  <input type="text" id="ai-gen-dish-name" value="${(window.escapeHtml || (s => s))(window.aiFormulatorState.dishName || 'Pizza Saumon & Burrata')}" placeholder="ex: Pizza Tartufo, Burger Double Smash..." onchange="window.aiFormulatorState.dishName = this.value;" />
                </div>

                <div class="ai-gen-input-group">
                  <label>Catégorie :</label>
                  <select id="ai-gen-cat" onchange="window.aiFormulatorState.category = this.value;">
                    <option value="PIZZA" ${window.aiFormulatorState.category === 'PIZZA' ? 'selected' : ''}>🍕 PIZZA</option>
                    <option value="BURGER" ${window.aiFormulatorState.category === 'BURGER' ? 'selected' : ''}>🍔 BURGER</option>
                    <option value="PASTA" ${window.aiFormulatorState.category === 'PASTA' ? 'selected' : ''}>🍝 PÂTES</option>
                    <option value="SALADES" ${window.aiFormulatorState.category === 'SALADES' ? 'selected' : ''}>🥗 SALADES</option>
                    <option value="PLATS" ${window.aiFormulatorState.category === 'PLATS' ? 'selected' : ''}>🥩 PLATS &amp; VIANDES</option>
                  </select>
                </div>

                <div class="ai-gen-input-group">
                  <label>Prix de Vente Cible (DH) [Optionnel] :</label>
                  <input type="number" id="ai-gen-price" value="${window.aiFormulatorState.targetPrice || ''}" placeholder="ex: 85 (Laisser vide pour auto-calibrage)" onchange="window.aiFormulatorState.targetPrice = parseFloat(this.value) || 0;" />
                </div>
              </div>

              <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div style="font-size:12px; color:var(--text-muted);">
                  💡 Cible ratio Food Cost : <strong>28% - 32%</strong> &bull; Référentiel mercuriale Fès intégré.
                </div>
                <button type="button" class="btn btn-primary" style="padding:8px 18px; font-weight:800; font-size:13px;" onclick="const name = document.getElementById('ai-gen-dish-name').value; const cat = document.getElementById('ai-gen-cat').value; const price = document.getElementById('ai-gen-price').value; window.triggerAIRecipeGeneration(name, cat, price);">
                  ⚡ Générer &amp; Équilibrer la Fiche
                </button>
              </div>
            </div>

            <div id="ai-gen-preview-container" style="margin-top:14px;">
              <!-- Rendu dynamiquement par renderAIGeneratedPreview() -->
            </div>
          </div>
        ` : `
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

          ${currentAITab === 'quick_wins' && stats.quickWinsCount > 0 ? `
            <!-- BANDEAU D'APPLICATION GROUPÉE DES QUICK WINS -->
            <div style="margin-bottom:14px; padding:12px 16px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); border-radius:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <strong style="color:#059669; font-size:13px;">⚡ ${stats.quickWinsCount} Quick Wins Immédiats Détectés</strong>
                <div style="font-size:12px; color:var(--text-muted);">Gain direct estimé : <strong>+${stats.totalMonthlySavings.toLocaleString('fr-FR')} DH / mois</strong> en calibrant les portions sur les standards.</div>
              </div>
              <button class="btn btn-primary" style="background:#059669; border-color:#047857; font-weight:800; font-size:12px; padding:7px 16px;" onclick="window.applyAllQuickWinsBatch()">
                ⚡ Appliquer Tous les Quick Wins en 1 Clic
              </button>
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
                        <button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_standard')">
                          ${item.actionLabel}
                        </button>
                      ` : ''}
                      ${item.actionType === 'apply_price' ? `
                        <button class="ai-btn-action btn-apply-price" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_price', ${item.actionParam})">
                          ${item.actionLabel}
                        </button>
                      ` : ''}
                      <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'inspect')">
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
                        <button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_standard')">
                          🟢 Appliquer Standard (+${item.unitDiffDH.toFixed(2)} DH/v)
                        </button>
                      ` : ''}
                      <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'inspect')">
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
                      <button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_standard')">
                        ${item.actionLabel}
                      </button>
                    ` : ''}
                    ${item.actionType === 'apply_price' ? `
                      <button class="ai-btn-action btn-apply-price" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_price', ${item.actionParam})">
                        ${item.actionLabel}
                      </button>
                    ` : ''}
                    <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'inspect')">
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
        `}

      </div>
    `;

    // Post-render hooks pour les onglets interactifs
    if (currentAITab === 'assistant') {
      setTimeout(() => {
        if (typeof window.renderAIChatMessages === 'function') window.renderAIChatMessages();
      }, 30);
    } else if (currentAITab === 'simulator') {
      setTimeout(() => {
        if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
      }, 30);
    } else if (currentAITab === 'generator') {
      setTimeout(() => {
        if (typeof window.triggerAIRecipeGeneration === 'function') {
          window.triggerAIRecipeGeneration(window.aiFormulatorState.dishName, window.aiFormulatorState.category, window.aiFormulatorState.targetPrice);
        }
      }, 30);
    }
  }
  window.renderAIOptimizerAgent = renderAIOptimizerAgent;

