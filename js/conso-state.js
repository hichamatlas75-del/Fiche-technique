/**
 * GREY CORNER — État Global, Synchronisation & Stockage
 * Module: conso-state.js
 */

/* ========================================================
   1. BASE DE DONNÉES & ALIAS CENTRALISÉS (recipes-data.js)
======================================================== */
const BASE_RECIPES = window.BASE_RECIPES || [];
const ALIAS_MAP = window.ALIAS_MAP || {};
const DATA = window.DATA || window.CATEGORIES_DATA || [];
const INGREDIENT_UNIT_COSTS = window.INGREDIENT_UNIT_COSTS || {};

// Utiliser le calculateur de coût de portion canonique (ingredient-costs.js / recipes-data.js)
var calculateRecipeFoodCost = (typeof window !== 'undefined' && typeof window.calculateRecipeFoodCost === 'function')
  ? window.calculateRecipeFoodCost
  : ((typeof global !== 'undefined' && typeof global.calculateRecipeFoodCost === 'function')
      ? global.calculateRecipeFoodCost
      : function() { return { cost: 0, sellPrice: 0, foodCost: 0, margin: 0, grossMarginDH: 0, breakdown: [] }; });

/* ========================================================
   3. GESTION DU STOCKAGE DES RECETTES & BASE DE VENTES MENSUELLE
======================================================== */
var activeRecipes = [];
var monthlySalesDB = {}; // Format: { "YYYY-MM-DD": [ { family, product, price, qty, total }, ... ] }
var currentViewMode = 'day'; // 'day', 'month' ou 'year'
var selectedDate = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' (local timezone)
var selectedYearMonth = selectedDate.slice(0, 7); // 'YYYY-MM'

var currentSalesData = [];
var currentSalesFilter = 'all'; // 'all', 'matched', 'unmatched'
var aggregatedIngredients = [];

const RECIPES_DB_VERSION = 'v8.2_20260907';

function loadRecipes() {
  try {
    const savedVersion = localStorage.getItem('gc_recipes_db_version');
    const saved = localStorage.getItem(GC_STORAGE_KEYS.RECIPES);
    if (savedVersion === RECIPES_DB_VERSION && saved) {
      activeRecipes = JSON.parse(saved);
    } else {
      activeRecipes = JSON.parse(JSON.stringify(BASE_RECIPES));
      try {
        localStorage.removeItem('gc_recipes_db_v4');
        localStorage.setItem('gc_recipes_db_version', RECIPES_DB_VERSION);
        localStorage.setItem(GC_STORAGE_KEYS.RECIPES, JSON.stringify(activeRecipes));
      } catch (err) {}
    }
  } catch (e) {
    activeRecipes = JSON.parse(JSON.stringify(BASE_RECIPES));
  }

  // Synchronisation avec les modifications de fiches du comparateur
  try {
    const savedComp = localStorage.getItem(GC_STORAGE_KEYS.COMP_EDITS);
    if (savedComp) {
      const compEdits = JSON.parse(savedComp);
      const tempIndex = new Map();
      activeRecipes.forEach(r => tempIndex.set(cleanText(r.name), r));
      Object.keys(compEdits).forEach(name => {
        const cName = cleanText(name);
        const r = tempIndex.get(cName) || tempIndex.get(cName.replace(/^(?:pizza|pasta|plat|sandwich|panini)\s+/, ''));
        if (r && compEdits[name] && Array.isArray(compEdits[name].tech) && compEdits[name].tech.length > 0) {
          r.ingredients = compEdits[name].tech.slice();
          r.tech = compEdits[name].tech.slice();
        }
      });
    }
  } catch (err) {
    console.warn("Erreur synchronisation recettes comparateur:", err);
  }

  // S'assurer que chaque recette dispose de son prix de vente (depuis DATA si manquant)
  const _dataList = (typeof window !== 'undefined' && Array.isArray(window.DATA))
    ? window.DATA
    : (typeof DATA !== 'undefined' && Array.isArray(DATA) ? DATA : []);
  if (_dataList.length > 0) {
    activeRecipes.forEach(r => {
      if (!r.sellPrice) {
        const cN = cleanText(r.name);
        for (const cat of _dataList) {
          for (const item of (cat.items || [])) {
            if (cleanText(item.name) === cN) {
              r.sellPrice = item.sellPrice || parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0;
              break;
            }
          }
          if (r.sellPrice) break;
        }
      }
    });
  }

  // Build recipe index for O(1) lookups
  window.recipeNameIndex = new Map();
  activeRecipes.forEach(r => {
    window.recipeNameIndex.set(cleanText(r.name), r);
  });

  // Normalize ALIAS_MAP keys with cleanText
  window.cleanAliasMap = {};
  for (const [key, val] of Object.entries(ALIAS_MAP)) {
    window.cleanAliasMap[cleanText(key)] = val;
  }

  // Initialiser la liste déroulante des ingrédients de l'Audit Flash
  if (typeof initAuditFlashDropdown === 'function') {
    initAuditFlashDropdown();
  }
}

function saveRecipes() {
  try {
    localStorage.setItem('gc_recipes_db_version', RECIPES_DB_VERSION);
    localStorage.setItem(GC_STORAGE_KEYS.RECIPES, JSON.stringify(activeRecipes));
  } catch (e) {
    console.warn('[LocalStorage] Erreur sauvegarde recettes:', e);
  }
}

function loadMonthlySalesDB() {
  try {
    const saved = localStorage.getItem(GC_STORAGE_KEYS.SALES);
    if (saved) {
      monthlySalesDB = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('[LocalStorage] Erreur chargement ventes:', e);
    monthlySalesDB = {};
  }
}

function pruneOldestSales(db, maxMonthsToKeep = 6) {
  const dates = Object.keys(db).sort();
  if (dates.length <= 90) return false;
  const yearMonths = Array.from(new Set(dates.map(d => d.slice(0, 7)))).sort();
  if (yearMonths.length <= maxMonthsToKeep) return false;
  const dropSet = new Set(yearMonths.slice(0, yearMonths.length - maxMonthsToKeep));
  dates.forEach(d => {
    if (dropSet.has(d.slice(0, 7))) delete db[d];
  });
  return true;
}

function saveMonthlySalesDB() {
  try {
    localStorage.setItem(GC_STORAGE_KEYS.SALES, JSON.stringify(monthlySalesDB));
  } catch (e) {
    console.warn('[LocalStorage] Erreur sauvegarde ventes (quota potentiel):', e);
    if (e && (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014 || (e.message && e.message.includes('quota')))) {
      const cloned = Object.assign({}, monthlySalesDB);
      const pruned = pruneOldestSales(cloned, 6);
      if (pruned) {
        try {
          localStorage.setItem(GC_STORAGE_KEYS.SALES, JSON.stringify(cloned));
          monthlySalesDB = cloned;
          if (window.GC_Toast) {
            window.GC_Toast.show("⚠️ Quota mémoire atteint : les 6 derniers mois de ventes ont été conservés en local.", 'warning');
          }
          return;
        } catch (e2) {
          console.error('[LocalStorage] Échec sauvegarde même après purge:', e2);
        }
      }
      if (window.GC_Toast) {
        window.GC_Toast.show("❌ Espace mémoire saturé (limite 5 Mo du navigateur). Veuillez exporter vos ventes.", 'error');
      }
    }
  }
}

