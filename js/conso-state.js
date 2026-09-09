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

const cleanText = (typeof window !== 'undefined' && typeof window.cleanText === 'function')
  ? window.cleanText
  : ((typeof global !== 'undefined' && typeof global.cleanText === 'function')
      ? global.cleanText
      : function(s) { return String(s || '').toLowerCase().trim(); });

const getStorageKey = (keyName, fallback) => {
  if (typeof GC_STORAGE_KEYS !== 'undefined' && GC_STORAGE_KEYS && GC_STORAGE_KEYS[keyName]) {
    return GC_STORAGE_KEYS[keyName];
  }
  if (typeof window !== 'undefined' && window.GC_STORAGE_KEYS && window.GC_STORAGE_KEYS[keyName]) {
    return window.GC_STORAGE_KEYS[keyName];
  }
  return fallback;
};

function loadRecipes() {
  const kRecipes = getStorageKey('RECIPES', 'gc_recipes_db_v5');
  const kDeleted = getStorageKey('DELETED', 'gc_deleted_recipes_v1');
  const kComp = getStorageKey('COMP_EDITS', 'grey_corner_custom_recipes_v5');

  try {
    const savedVersion = localStorage.getItem('gc_recipes_db_version');
    const saved = localStorage.getItem(kRecipes);
    if (saved && (savedVersion === RECIPES_DB_VERSION || !savedVersion)) {
      activeRecipes = JSON.parse(saved);
    } else if (saved && savedVersion) {
      activeRecipes = JSON.parse(saved);
      localStorage.setItem('gc_recipes_db_version', RECIPES_DB_VERSION);
    } else {
      activeRecipes = JSON.parse(JSON.stringify(BASE_RECIPES));
      try {
        localStorage.removeItem('gc_recipes_db_v4');
        localStorage.setItem('gc_recipes_db_version', RECIPES_DB_VERSION);
        localStorage.setItem(kRecipes, JSON.stringify(activeRecipes));
      } catch (err) {}
    }
  } catch (e) {
    activeRecipes = JSON.parse(JSON.stringify(BASE_RECIPES));
  }

  // Filtrer les recettes supprimées
  let deletedSet = new Set();
  try {
    const deletedList = JSON.parse(localStorage.getItem(kDeleted) || '[]');
    deletedSet = new Set(deletedList.map(x => String(x).toLowerCase().trim()));
  } catch(e) {}

  if (deletedSet.size > 0) {
    activeRecipes = activeRecipes.filter(r => {
      if (!r) return false;
      const cN = cleanText(r.name);
      const idStr = r.id ? String(r.id).toLowerCase().trim() : '';
      return !deletedSet.has(cN) && !deletedSet.has(idStr);
    });
  }

  // Synchronisation avec les modifications de fiches du comparateur
  const _dataList = (typeof window !== 'undefined' && Array.isArray(window.DATA))
    ? window.DATA
    : (typeof DATA !== 'undefined' && Array.isArray(DATA) ? DATA : []);

  try {
    const savedComp = localStorage.getItem(kComp);
    if (savedComp) {
      const compEdits = JSON.parse(savedComp);
      const tempIndex = new Map();
      activeRecipes.forEach(r => tempIndex.set(cleanText(r.name), r));

      Object.keys(compEdits).forEach(name => {
        const cName = cleanText(name);
        if (deletedSet.has(cName)) return;

        let r = tempIndex.get(cName) || tempIndex.get(cName.replace(/^(?:pizza|pasta|plat|sandwich|panini)\s+/, ''));
        const editData = compEdits[name];
        if (!editData) return;

        if (!r && Array.isArray(editData.tech) && editData.tech.length > 0) {
          let foundInCat = null;
          for (const cat of _dataList) {
            const it = (cat.items || []).find(i => cleanText(i.name) === cName);
            if (it) { foundInCat = { cat: cat.category, item: it }; break; }
          }
          const sPrice = editData.sellPrice || (foundInCat ? (foundInCat.item.sellPrice || parseFloat(String(foundInCat.item.price || '0').replace(/[^0-9.]/g, ''))) : 0) || 0;
          const fc = calculateRecipeFoodCost(editData.tech, sPrice);
          r = {
            id: 'rec_comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: name,
            category: foundInCat ? foundInCat.cat : 'AUTRE',
            ingredients: editData.tech.slice(),
            sellPrice: sPrice,
            cost: fc.cost,
            foodCost: fc.foodCost,
            margin: fc.margin,
            grossMarginDH: fc.grossMarginDH
          };
          activeRecipes.push(r);
          tempIndex.set(cName, r);
        } else if (r) {
          if (Array.isArray(editData.tech) && editData.tech.length > 0) {
            r.ingredients = editData.tech.slice();
            r.tech = editData.tech.slice();
          }
          if (typeof editData.sellPrice === 'number' && editData.sellPrice > 0) {
            r.sellPrice = editData.sellPrice;
          }
        }
      });
    }
  } catch (err) {
    console.warn("Erreur synchronisation recettes comparateur:", err);
  }

  // S'assurer que chaque recette dispose de son prix de vente (depuis DATA si manquant) et recalculer Food Cost
  activeRecipes.forEach(r => {
    if (!r.sellPrice && _dataList.length > 0) {
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
    if (typeof calculateRecipeFoodCost === 'function' && (r.ingredients || r.tech)) {
      const fc = calculateRecipeFoodCost(r.ingredients || r.tech || [], r.sellPrice || 0);
      r.cost = fc.cost;
      r.foodCost = fc.foodCost;
      r.margin = fc.margin;
      r.grossMarginDH = fc.grossMarginDH;
    }
  });

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
  const kRecipes = getStorageKey('RECIPES', 'gc_recipes_db_v5');
  try {
    localStorage.setItem('gc_recipes_db_version', RECIPES_DB_VERSION);
    localStorage.setItem(kRecipes, JSON.stringify(activeRecipes));
  } catch (e) {
    console.warn('[LocalStorage] Erreur sauvegarde recettes:', e);
  }
}

/* ========================================================
   3.B MOTEUR DE STOCKAGE PERSISTANT INDEXEDDB (Sans Quota 5 Mo)
======================================================== */
const GC_SalesIDB = {
  dbName: 'GreyCornerSalesDB',
  storeName: 'sales',
  version: 1,
  _dbPromise: null,

  getDB() {
    if (this._dbPromise) return this._dbPromise;
    if (typeof indexedDB === 'undefined') {
      return Promise.resolve(null);
    }
    this._dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(this.dbName, this.version);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'date' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => {
          console.warn('[SalesIDB] Erreur ouverture IndexedDB:', req.error);
          resolve(null);
        };
      } catch (err) {
        console.warn('[SalesIDB] Exception ouverture IndexedDB:', err);
        resolve(null);
      }
    });
    return this._dbPromise;
  },

  async loadAll() {
    try {
      const db = await this.getDB();
      if (!db) return null;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(this.storeName, 'readonly');
          const store = tx.objectStore(this.storeName);
          const req = store.getAll();
          req.onsuccess = () => {
            const map = {};
            (req.result || []).forEach(item => {
              if (item && item.date && Array.isArray(item.rows)) {
                map[item.date] = item.rows;
              }
            });
            resolve(map);
          };
          req.onerror = () => {
            console.warn('[SalesIDB] Erreur chargement getAll:', req.error);
            resolve(null);
          };
        } catch (txErr) {
          console.warn('[SalesIDB] Erreur transaction lecture:', txErr);
          resolve(null);
        }
      });
    } catch (e) {
      console.warn('[SalesIDB] Exception loadAll:', e);
      return null;
    }
  },

  async saveDate(dateKey, rows) {
    if (!dateKey || !Array.isArray(rows)) return false;
    try {
      const db = await this.getDB();
      if (!db) return false;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(this.storeName, 'readwrite');
          const store = tx.objectStore(this.storeName);
          store.put({ date: dateKey, rows: rows, updatedAt: Date.now() });
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    } catch (e) {
      return false;
    }
  },

  async saveAll(dbObj) {
    if (!dbObj || typeof dbObj !== 'object') return false;
    try {
      const db = await this.getDB();
      if (!db) return false;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(this.storeName, 'readwrite');
          const store = tx.objectStore(this.storeName);
          for (const [dateKey, rows] of Object.entries(dbObj)) {
            if (Array.isArray(rows) && rows.length > 0) {
              store.put({ date: dateKey, rows: rows, updatedAt: Date.now() });
            }
          }
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => {
            console.warn('[SalesIDB] Erreur transaction saveAll:', tx.error);
            resolve(false);
          };
        } catch (e) {
          resolve(false);
        }
      });
    } catch (e) {
      return false;
    }
  },

  async deleteDate(dateKey) {
    if (!dateKey) return false;
    try {
      const db = await this.getDB();
      if (!db) return false;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(this.storeName, 'readwrite');
          const store = tx.objectStore(this.storeName);
          store.delete(dateKey);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    } catch (e) {
      return false;
    }
  },

  async clearAll() {
    try {
      const db = await this.getDB();
      if (!db) return false;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(this.storeName, 'readwrite');
          const store = tx.objectStore(this.storeName);
          store.clear();
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    } catch (e) {
      return false;
    }
  }
};

if (typeof window !== 'undefined') {
  window.GC_SalesIDB = GC_SalesIDB;
}
if (typeof global !== 'undefined') {
  global.GC_SalesIDB = GC_SalesIDB;
}

async function loadMonthlySalesDB(onLoadedCallback) {
  // 1. Étape synchrone : lecture immédiate du cache localStorage pour affichage instantané
  try {
    const saved = localStorage.getItem(GC_STORAGE_KEYS.SALES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        monthlySalesDB = Object.assign({}, parsed);
      }
    }
  } catch (e) {
    console.warn('[LocalStorage] Erreur chargement ventes:', e);
  }

  // 2. Étape asynchrone : hydratation intégrale depuis IndexedDB (tous les 12 mois sans aucune purge)
  try {
    const idbData = await GC_SalesIDB.loadAll();
    if (idbData && Object.keys(idbData).length > 0) {
      monthlySalesDB = Object.assign({}, monthlySalesDB, idbData);
    } else if (Object.keys(monthlySalesDB).length > 0) {
      // Première migration vers IndexedDB
      GC_SalesIDB.saveAll(monthlySalesDB);
    }
  } catch (e) {
    console.warn('[IndexedDB] Erreur hydratation ventes:', e);
  }

  if (typeof onLoadedCallback === 'function') {
    onLoadedCallback(monthlySalesDB);
  }

  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('gc-sales-loaded', { detail: { count: Object.keys(monthlySalesDB).length } }));
  }

  return monthlySalesDB;
}

function saveMonthlySalesDB() {
  // 1. Sauvegarde systématique et intégrale dans IndexedDB (100% des mois conservés sans aucune purge)
  GC_SalesIDB.saveAll(monthlySalesDB).catch(err => {
    console.warn('[IndexedDB] Erreur sauvegarde ventes:', err);
  });

  // 2. Miroir vers localStorage (sauvegarde sécurisée sans jamais altérer ni purger monthlySalesDB)
  try {
    localStorage.setItem(GC_STORAGE_KEYS.SALES, JSON.stringify(monthlySalesDB));
  } catch (e) {
    // Si localStorage atteint sa limite stricte de 5 Mo :
    // Les 12 mois complets restent 100% intacts dans monthlySalesDB et IndexedDB.
    try {
      const recentKeys = Object.keys(monthlySalesDB).sort().slice(-60);
      const recentCache = {};
      recentKeys.forEach(k => { recentCache[k] = monthlySalesDB[k]; });
      localStorage.setItem(GC_STORAGE_KEYS.SALES, JSON.stringify(recentCache));
      console.info('[SalesStorage] Quota localStorage (5 Mo) atteint. Les données intégrales des 12 mois sont pérennisées dans IndexedDB.');
    } catch (e2) {
      console.warn('[SalesStorage] Miroir localStorage ignoré, IndexedDB actif:', e2);
    }
  }
}

function deleteMonthlySalesDate(dateKey) {
  if (!dateKey) return;
  delete monthlySalesDB[dateKey];
  GC_SalesIDB.deleteDate(dateKey);
  saveMonthlySalesDB();
}

// Synchronisation réactive temps réel inter-onglets et inter-modules
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', function(e) {
    const kRecipes = getStorageKey('RECIPES', 'gc_recipes_db_v5');
    const kComp = getStorageKey('COMP_EDITS', 'grey_corner_custom_recipes_v5');
    const kDeleted = getStorageKey('DELETED', 'gc_deleted_recipes_v1');
    const kPrices = getStorageKey('PRICES', 'gc_ingredient_prices_v1');
    const kPing = getStorageKey('SYNC_PING', 'gc_sync_ping');

    if (!e.key ||
        e.key === kRecipes ||
        e.key === kComp ||
        e.key === kDeleted ||
        e.key === kPrices ||
        e.key === kPing) {
      loadRecipes();
      if (typeof renderRecipeList === 'function') renderRecipeList();
      if (typeof recalculateCurrentView === 'function') recalculateCurrentView();
    }
  });

  window.addEventListener('gc:recipe-updated', function() {
    loadRecipes();
    if (typeof renderRecipeList === 'function') renderRecipeList();
    if (typeof recalculateCurrentView === 'function') recalculateCurrentView();
  });

  window.loadRecipes = loadRecipes;
  window.saveRecipes = saveRecipes;
  window.activeRecipes = activeRecipes;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadRecipes,
    saveRecipes,
    loadMonthlySalesDB,
    saveMonthlySalesDB,
    deleteMonthlySalesDate,
    GC_SalesIDB,
    activeRecipes,
    monthlySalesDB,
    RECIPES_DB_VERSION
  };
}

