/**
 * GREY CORNER — Agent IA Optimiseur & Analyse Menu Engineering
 * Module: comp-ai.js
 */

  /* ========================================================
     AGENT INTELLIGENT D'OPTIMISATION DES REVENUS (AI REVENUE ADVISOR)
     Analyse en temps réel le tableau de synthèse & les ventes journalières
  ======================================================== */
var currentAITab = 'menu_engineering'; // 'menu_engineering', 'daily_sales', 'quick_wins', 'pricing', 'standards', 'critical'
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
    const recipe = allRecipes.find(r => r.name === recipeName);
    if (!recipe) return;

    if (actionType === 'apply_standard') {
      window.copyStandardToRecipe(recipeName);
      if (typeof window.GC_Toast !== 'undefined') {
        window.GC_Toast.show(`🤖 Agent IA : Standard appliqué avec succès sur "${recipeName}" !`, 'info');
      }
    } else if (actionType === 'apply_price') {
      const newPrice = parseFloat(paramVal) || 0;
      if (newPrice > 0) {
        window.updateRecipeSellPrice(recipeName, newPrice);
        if (typeof window.GC_Toast !== 'undefined') {
          window.GC_Toast.show(`🤖 Agent IA : Prix ajusté à ${newPrice} DH sur "${recipeName}" !`, 'info');
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

