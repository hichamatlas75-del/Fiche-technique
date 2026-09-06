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

// BUG FIX: Déléguer au calculateur canonique centralisé (recipes-data.js) qui intègre
// le routage intelligent des fruits de mer (calamar congelé/décongelé, crevettes, saumon)
function calculateRecipeFoodCost(ingredients, sellPrice) {
  if (typeof window !== 'undefined' && typeof window.calculateRecipeFoodCost === 'function' && window.calculateRecipeFoodCost !== calculateRecipeFoodCost) {
    return window.calculateRecipeFoodCost(ingredients, sellPrice);
  }
  return { cost: 0, sellPrice: 0, foodCost: 0, margin: 0, grossMarginDH: 0, breakdown: [] };
}

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

const RECIPES_DB_VERSION = 'v7.7_merguez_compagnard_20260904';

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

function saveMonthlySalesDB() {
  try {
    localStorage.setItem(GC_STORAGE_KEYS.SALES, JSON.stringify(monthlySalesDB));
  } catch (e) {
    console.warn('[LocalStorage] Erreur sauvegarde ventes:', e);
  }
}

