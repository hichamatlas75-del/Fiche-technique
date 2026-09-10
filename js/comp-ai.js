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

  window.askAIFBAssistant = function(query) {
    if (!query || !query.trim()) return;
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const cleanQ = cleanFn(query);
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    aiChatHistory.push({ sender: 'user', time: now, text: (window.escapeHtml || (s => s))(query) });

    let responseText = '';
    const recipes = window.allRecipes || [];
    const salesCtx = getDailySalesContext();
    const menuEng = analyzeMenuEngineering(salesCtx.salesRows);
    const analysis = analyzeDatasetForOptimizations();

    // 1. TOP RENTABLES / CASH MARGIN / STARS
    if (cleanQ.includes('rentab') || cleanQ.includes('marge') || cleanQ.includes('top 5') || cleanQ.includes('star') || cleanQ.includes('meilleur')) {
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
    // 2. PIRE FOOD COST / ALERTES / CRITIQUES
    else if (cleanQ.includes('pire') || cleanQ.includes('critique') || cleanQ.includes('danger') || cleanQ.includes('alerte') || cleanQ.includes('corriger') || cleanQ.includes('élevé')) {
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
    // 3. INGRÉDIENTS LES PLUS CHERS / POIDS MATIÈRE
    else if (cleanQ.includes('ingr') || cleanQ.includes('mati') || cleanQ.includes('cher') || cleanQ.includes('poids') || cleanQ.includes('depens')) {
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
    // 4. BRIEFING SERVEURS / CE SOIR EN SALLE
    else if (cleanQ.includes('serveur') || cleanQ.includes('salle') || cleanQ.includes('brief') || cleanQ.includes('soir') || cleanQ.includes('pousser') || cleanQ.includes('sugg')) {
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
    // 5. STRATÉGIE -2% FOOD COST
    else if (cleanQ.includes('-2%') || cleanQ.includes('reduire') || cleanQ.includes('baisser') || cleanQ.includes('strateg') || cleanQ.includes('plan')) {
      const quickWinsCount = (analysis.quickWins || []).length;
      const totalSavings = Math.round((analysis.stats || {}).totalMonthlySavings || 12500);
      responseText = `📉 <strong>Plan Stratégique en 4 Étapes pour Gagner -2 Points de Food Cost :</strong><br><br>
1️⃣ <strong>Standardiser les 5 protéines pivots</strong> : Calibrer strictement le poulet (140g), le steak haché (110-120g) et la mozzarella râpée (90-100g).<br>
2️⃣ <strong>Appliquer les ${quickWinsCount} Quick Wins identifiés</strong> : Gisement direct de <strong>+${totalSavings.toLocaleString('fr-FR')} DH / mois</strong> sans altérer la carte.<br>
3️⃣ <strong>Hausse douce de +2 à +3 DH sur les Chevaux de Trait</strong> : Vos plats à fort volume absorbent cette hausse sans perte de fréquentation.<br>
4️⃣ <strong>Péréquation par les Boissons & Cocktails</strong> : Les boissons affichent un Food Cost moyen de 15-20% et compensent naturellement les plats nobles.<br><br>
<button class="btn btn-primary" style="font-size:12px; padding:6px 14px; font-weight:800;" onclick="window.applyAllQuickWinsBatch()">⚡ Appliquer Tous les Quick Wins Automatiquement</button>`;
    }
    // 6. QUESTION CIBLÉE SUR UN PLAT SPÉCIFIQUE
    else {
      let matchedDish = recipes.find(r => cleanQ.includes(cleanFn(r.name)) || cleanFn(r.name).includes(cleanQ));
      if (matchedDish) {
        const diff = matchedDish.standard.diffDH;
        responseText = `🍽️ <strong>Analyse de la Fiche Technique : « ${matchedDish.name} »</strong> (${matchedDish.category}) :<br><br>
• <strong>Prix de vente :</strong> ${matchedDish.sellPrice} DH<br>
• <strong>Coût de revient :</strong> ${matchedDish.greyCorner.cost.toFixed(2)} DH (Food Cost : <strong>${matchedDish.greyCorner.foodCost.toFixed(1)}%</strong>)<br>
• <strong>Marge Brute :</strong> +${matchedDish.greyCorner.grossMarginDH.toFixed(2)} DH (${matchedDish.greyCorner.margin.toFixed(1)}%)<br>
• <strong>Standard International :</strong> Coût ${matchedDish.standard.cost.toFixed(2)} DH (Food Cost : ${matchedDish.standard.foodCost.toFixed(1)}%)<br>
${diff > 0.5 ? `⚠️ <strong>Écart de surdosage :</strong> +${diff.toFixed(2)} DH par portion par rapport à la référence métier.` : `✅ <strong>Portion conforme :</strong> Grammages alignés sur les ratios d'excellence.`}<br><br>
<div style="display:flex; gap:8px; flex-wrap:wrap;">
  ${diff > 0.5 ? `<button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${encodeURIComponent(matchedDish.name)}', 'apply_standard')">🟢 Aligner Standard</button>` : ''}
  <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${encodeURIComponent(matchedDish.name)}', 'inspect')">🔍 Examiner Ingrédients</button>
</div>`;
      } else {
        // RÉPONSE SYNTHÉTIQUE INTELLIGENTE
        responseText = `🤖 <strong>Synthèse d'Analyse Globale du Menu Grey Corner :</strong><br><br>
• <strong>Catalogue :</strong> ${recipes.length} fiches techniques actives.<br>
• <strong>Gisement de Marge Récupérable :</strong> <strong>+${(analysis.stats || {}).totalMonthlySavings || 0} DH / mois</strong> sur les surdosages de portions.<br>
• <strong>Recommandation :</strong> Concentrez les contrôles de pesées en cuisine sur le fromage à pizza et la viande de bœuf, et activez les 3 suggestions serveurs du soir.<br><br>
<em>💡 Astuce : Tapez le nom d'un plat spécifique (ex: "Pizza 4 Saisons", "Burger Classic") pour une analyse détaillée en 1 seconde !</em>`;
      }
    }

    aiChatHistory.push({ sender: 'ai', time: now, text: responseText });
    if (typeof window.renderAIChatMessages === 'function') window.renderAIChatMessages();
  };

  /* ========================================================
     2. SIMULATEUR MACRO "WHAT-IF" & CHOC MATIÈRES PREMIÈRES
  ======================================================== */
  window.simSelectedIngredient = 'Mozzarella';
  window.simVariationPct = 15;

  window.setSimVariation = function(pct) {
    window.simVariationPct = pct;
    const disp = document.getElementById('sim-variation-display');
    if (disp) {
      disp.textContent = (pct > 0 ? '+' : '') + pct + '%';
      disp.style.color = pct > 0 ? '#ef4444' : '#10b981';
    }
    if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
  };

  window.runMacroInflationSimulation = function(ingName, pct) {
    const ingredient = ingName || window.simSelectedIngredient || 'Mozzarella';
    const variationPct = typeof pct === 'number' ? pct : (window.simVariationPct || 15);
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const recipes = window.allRecipes || [];
    const targetClean = cleanFn(ingredient);
    const affectedDishes = [];
    let totalMonthlySurcost = 0;

    recipes.forEach(r => {
      const matchLine = (r.greyCorner.breakdown || []).find(b => cleanFn(b.ingredient).includes(targetClean));
      if (matchLine) {
        const oldIngCost = matchLine.cost;
        const newIngCost = oldIngCost * (1 + variationPct / 100);
        const costDiff = newIngCost - oldIngCost;
        const newRecipeCost = r.greyCorner.cost + costDiff;
        const newFC = r.sellPrice > 0 ? (newRecipeCost / r.sellPrice * 100) : 0;
        const monthlyImpact = costDiff * 50; // base conservative 50 portions/mois

        totalMonthlySurcost += monthlyImpact;
        affectedDishes.push({
          name: r.name,
          category: r.category,
          sellPrice: r.sellPrice,
          oldCost: r.greyCorner.cost,
          newCost: newRecipeCost,
          oldFC: r.greyCorner.foodCost,
          newFC: Math.round(newFC * 10) / 10,
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
      count: affectedDishes.length,
      totalMonthlySurcost: Math.round(totalMonthlySurcost),
      affectedDishes
    };
  };

  window.updateSimulationView = function() {
    const sel = document.getElementById('sim-ingredient-select');
    if (sel) window.simSelectedIngredient = sel.value;
    const resPanel = document.getElementById('sim-results-panel');
    if (!resPanel) return;

    const sim = window.runMacroInflationSimulation(window.simSelectedIngredient, window.simVariationPct);
    const varText = sim.variationPct > 0 ? `+${sim.variationPct}%` : `${sim.variationPct}%`;
    const varClass = sim.variationPct > 0 ? 'text-danger' : 'text-success';

    resPanel.innerHTML = `
      <div class="ai-sim-kpis">
        <div class="ai-stat-card" style="border-left:4px solid #0284c7;">
          <div class="ai-stat-label">Ingrédient Testé</div>
          <div class="ai-stat-value text-accent">${(window.escapeHtml || (s => s))(sim.ingredient)}</div>
          <div class="ai-stat-sub">Variation simulée : <strong class="${varClass}">${varText}</strong></div>
        </div>
        <div class="ai-stat-card" style="border-left:4px solid ${sim.totalMonthlySurcost > 0 ? '#ef4444' : '#10b981'};">
          <div class="ai-stat-label">Impact Trésorerie / Mois</div>
          <div class="ai-stat-value" style="color:${sim.totalMonthlySurcost > 0 ? '#ef4444' : '#10b981'};">
            ${sim.totalMonthlySurcost > 0 ? '+' : ''}${sim.totalMonthlySurcost.toLocaleString('fr-FR')} DH
          </div>
          <div class="ai-stat-sub">${sim.totalMonthlySurcost > 0 ? 'Surcoût mensuel estimé' : 'Économie mensuelle estimée'}</div>
        </div>
        <div class="ai-stat-card" style="border-left:4px solid #f59e0b;">
          <div class="ai-stat-label">Plats Vulnérables</div>
          <div class="ai-stat-value" style="color:#f59e0b;">${sim.count} fiches</div>
          <div class="ai-stat-sub">Recettes contenant cette matière</div>
        </div>
      </div>

      ${sim.count === 0 ? `
        <div style="padding:15px; text-align:center; color:var(--text-muted); font-size:12px;">
          Aucune recette active n'utilise l'ingrédient « ${(window.escapeHtml || (s => s))(sim.ingredient)} ».
        </div>
      ` : `
        <div style="margin-top:12px; font-size:12px; font-weight:800; color:var(--text); margin-bottom:6px;">
          📋 Plats les plus impactés &amp; Prix Compensatoires Suggérés (Modèle Café-Resto Fès) :
        </div>
        <div class="ai-sim-table-wrap">
          <table class="ai-sim-table">
            <thead>
              <tr>
                <th>Plat</th>
                <th>Prix Actuel</th>
                <th>Coût Actuel ➔ Nouveau</th>
                <th>Food Cost ➔ Nouveau</th>
                <th>Impact / Port.</th>
                <th>Prix Conseillé</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${sim.affectedDishes.map(d => `
                <tr>
                  <td><strong>${d.name}</strong></td>
                  <td>${d.sellPrice} DH</td>
                  <td>${d.oldCost.toFixed(2)} DH ➔ <strong style="color:${d.costDiff > 0 ? '#ef4444' : '#10b981'};">${d.newCost.toFixed(2)} DH</strong></td>
                  <td>${d.oldFC.toFixed(1)}% ➔ <strong style="color:${d.newFC > 35 ? '#ef4444' : 'var(--text)'};">${d.newFC}%</strong></td>
                  <td style="font-weight:800; color:${d.costDiff > 0 ? '#ef4444' : '#10b981'};">${d.costDiff > 0 ? '+' : ''}${d.costDiff.toFixed(2)} DH</td>
                  <td><strong style="color:#0284c7;">${d.suggestedCompPrice} DH</strong></td>
                  <td>
                    <button class="ai-btn-action" style="font-size:11px; padding:3px 8px;" onclick="window.applyAIOptimization('${encodeURIComponent(d.name)}', 'apply_price', ${d.suggestedCompPrice})">
                      Fixer ${d.suggestedCompPrice} DH
                    </button>
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
            🎛️ Simulateur Inflation <span class="ai-pill-count">What-If</span>
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
          <!-- ONGLET 2: SIMULATEUR MACRO WHAT-IF -->
          <div class="ai-simulator-container">
            <div class="ai-sim-box">
              <div class="ai-sim-controls">
                <div class="ai-sim-control-col">
                  <label class="ai-sim-label">1. Matière première ou ingrédient clé à tester :</label>
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
                  </select>
                </div>

                <div class="ai-sim-control-col">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <label class="ai-sim-label" style="margin-bottom:0;">2. Variation du coût d'achat fournisseur :</label>
                    <span id="sim-variation-display" style="font-size:16px; font-weight:900; color:${window.simVariationPct > 0 ? '#ef4444' : '#10b981'};">
                      ${window.simVariationPct > 0 ? '+' : ''}${window.simVariationPct}%
                    </span>
                  </div>
                  <div class="ai-sim-slider-wrap">
                    <input type="range" min="-30" max="50" step="5" value="${window.simVariationPct}" class="ai-sim-slider" oninput="window.setSimVariation(parseInt(this.value, 10))" />
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:2px;">
                      <span>-30% (Baisse / Négociation)</span>
                      <span>0%</span>
                      <span>+50% (Forte Inflation)</span>
                    </div>
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

