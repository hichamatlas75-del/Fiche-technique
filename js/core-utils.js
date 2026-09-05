/**
 * GREY CORNER — Fonctions Utilitaires Partagées (Core Utils)
 */

(function(global) {
  const APP_DATA_VERSION = 'v7.7_merguez_compagnard_20260904';

  // ─────────────────────────────────────────────────────────────
  // CLÉS LOCALSTORAGE CENTRALISÉES (Single Source of Truth)
  // ─────────────────────────────────────────────────────────────
  const GC_STORAGE_KEYS = {
    RECIPES:     'gc_recipes_db_v5',
    RECIPES_OLD: 'gc_recipes_db_v4',
    RECIPES_VER: 'gc_recipes_db_version',
    PRICES:      'gc_ingredient_prices_v1',
    SALES:       'gc_monthly_sales_db_v3',
    COMP_EDITS:  'grey_corner_custom_recipes_v5',
    DELETED:     'gc_deleted_recipes_v1',
    THEME:       'gc_theme',
    APP_VER:     'gc_app_data_version',
    KITCHEN:     'gc_kitchen_state',
    AUDIT:       'gc_audit_sessions_v1',
  };

  // ─────────────────────────────────────────────────────────────
  // CLÉS D'INGRÉDIENTS OBSOLÈTES (centralisées ici, utilisées partout)
  // ─────────────────────────────────────────────────────────────
  const OBSOLETE_INGREDIENT_KEYS = new Set([
    'calamar', 'calamars', 'calamar congele', 'calamars congeles', 'calamars brut',
    'calamars net', 'calamar egoutte', 'calamars egouttes', 'calamar chair', 'calamars chair',
    'crevette', 'crevettes', 'crevette avec coquille', 'crevettes avec coquille', 'crevette brut',
    'crevette chair', 'crevettes chair', 'crevette chair pure', 'crevettes chair pure',
    'crevette chair pur', 'crevettes chair pur',
    'gambas', 'gambas avec coquille', 'gambas chair', 'gambas chair pure', 'gambas chair pur',
    'gambas panees', 'gambas poche', 'gambas pochee', 'gambas decortiquees',
    'saumon', 'saumon frais', 'saumon sans carcasse', 'saumon avec carcasse', 'saumon fumee'
  ]);

  // Invalidation automatique et forcée du cache local lors d'un déploiement
  try {
    const currentVer = typeof localStorage !== 'undefined' ? localStorage.getItem(GC_STORAGE_KEYS.APP_VER) : null;
    if (currentVer !== APP_DATA_VERSION && typeof localStorage !== 'undefined') {
      console.log('[Cache-Buster] Nouvelle version ' + APP_DATA_VERSION + ' détectée : purge du cache obsolète...');
      localStorage.removeItem(GC_STORAGE_KEYS.RECIPES_OLD);
      localStorage.removeItem(GC_STORAGE_KEYS.RECIPES);
      localStorage.removeItem(GC_STORAGE_KEYS.RECIPES_VER);
      localStorage.removeItem(GC_STORAGE_KEYS.COMP_EDITS);
      localStorage.removeItem(GC_STORAGE_KEYS.PRICES);
      localStorage.removeItem(GC_STORAGE_KEYS.DELETED);
      localStorage.setItem(GC_STORAGE_KEYS.APP_VER, APP_DATA_VERSION);
    }
  } catch(e) {
    console.warn('[Cache-Buster] Erreur nettoyage cache local:', e);
  }

  function forceCacheRefresh() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(GC_STORAGE_KEYS.RECIPES_OLD);
        localStorage.removeItem(GC_STORAGE_KEYS.RECIPES);
        localStorage.removeItem(GC_STORAGE_KEYS.RECIPES_VER);
        localStorage.removeItem(GC_STORAGE_KEYS.COMP_EDITS);
        localStorage.removeItem(GC_STORAGE_KEYS.PRICES);
        localStorage.removeItem(GC_STORAGE_KEYS.DELETED);
        localStorage.setItem(GC_STORAGE_KEYS.APP_VER, APP_DATA_VERSION);
      }
      if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => {
          for (let name of names) caches.delete(name);
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          for (const reg of regs) reg.unregister();
        });
      }
    } catch(e) {}
    window.location.href = window.location.pathname + '?reload=' + Date.now();
  }

  /**
   * Normalisation de texte (sans accents, minuscules, espaces superflus)
   * PARTAGÉE — exposée via window.cleanText
   */
  function cleanText(str) {
    return (str || '')
      .toString()
      .toLowerCase()
      .replace(/œ/g, 'oe')
      .replace(/Œ/g, 'oe')
      .replace(/æ/g, 'ae')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Protection contre les injections XSS
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Formatage monétaire en Dirhams
   */
  function formatMoney(amount, decimals = 2) {
    const val = typeof amount === 'number' ? amount : (parseFloat(amount) || 0);
    return val.toLocaleString('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + ' DH';
  }

  /**
   * Formatage numérique générique
   */
  function formatNumber(val, decimals = 2) {
    const num = typeof val === 'number' ? val : (parseFloat(val) || 0);
    return num.toLocaleString('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Formatage de date FR
   */
  function formatDateFR(isoDateStr) {
    if (!isoDateStr) return '';
    const parts = isoDateStr.split('-');
    if (parts.length !== 3) return isoDateStr;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  /**
   * Formatage de mois FR
   */
  function formatMonthFR(yearMonthStr) {
    if (!yearMonthStr) return '';
    const parts = yearMonthStr.split('-');
    if (parts.length !== 2) return yearMonthStr;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
    return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  /**
   * Gestionnaire de thème Clair / Sombre (centralisé)
   */
  function initThemeManager(toggleBtnId = 'theme-toggle', storageKey = GC_STORAGE_KEYS.THEME) {
    const themeToggleBtn = document.getElementById(toggleBtnId);
    const savedTheme = localStorage.getItem(storageKey) || 'light';
    applyTheme(savedTheme, themeToggleBtn, storageKey);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, themeToggleBtn, storageKey);
      });
    }
  }

  function applyTheme(t, btn, storageKey) {
    const key = storageKey || GC_STORAGE_KEYS.THEME;
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (btn) {
        btn.textContent = '☀️ Mode Clair';
        btn.title = 'Passer au mode clair';
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (btn) {
        btn.textContent = '🌙 Mode Sombre';
        btn.title = 'Passer au mode sombre';
      }
    }
    localStorage.setItem(key, t);
  }

  /**
   * COMPOSANT TOAST PARTAGÉ — remplace les alert() bloquants
   */
  const GC_Toast = (function() {
    let toastEl = null;
    let hideTimer = null;

    function ensureEl() {
      if (toastEl && document.body.contains(toastEl)) return toastEl;
      toastEl = document.createElement('div');
      toastEl.id = 'gc-shared-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.style.cssText = [
        'position:fixed', 'bottom:24px', 'right:24px',
        'padding:14px 20px', 'border-radius:12px',
        'font-weight:700', 'font-size:14px',
        'box-shadow:0 8px 24px rgba(0,0,0,0.25)',
        'z-index:99999', 'max-width:420px',
        'display:flex', 'align-items:center', 'gap:10px',
        'transition:opacity 0.3s ease, transform 0.3s ease',
        'opacity:0', 'transform:translateY(12px)',
        'pointer-events:none', 'border:1px solid rgba(255,255,255,0.12)'
      ].join(';');
      document.body.appendChild(toastEl);
      return toastEl;
    }

    function show(msg, type) {
      const el = ensureEl();
      const colors = {
        success: { bg: '#0f172a', border: '#22c55e', icon: '✅' },
        error:   { bg: '#450a0a', border: '#ef4444', icon: '❌' },
        warning: { bg: '#431407', border: '#f97316', icon: '⚠️' },
        info:    { bg: '#0c1a2e', border: '#38bdf8', icon: 'ℹ️' },
      };
      const c = colors[type] || colors.success;

      el.style.background = c.bg;
      el.style.borderColor = c.border;
      el.style.color = '#f8fafc';
      el.textContent = c.icon + ' ' + msg;

      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.pointerEvents = 'auto';

      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(12px)';
        el.style.pointerEvents = 'none';
      }, 3500);
    }

    return { show };
  })();

  /**
   * GREY CORNER — Gestionnaire de données unifié (Single Source of Truth)
   */
  const GC_Store = {
    // Thème
    getTheme: () => localStorage.getItem(GC_STORAGE_KEYS.THEME) || 'light',
    setTheme: (t) => {
      if (t === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem(GC_STORAGE_KEYS.THEME, t);
    },

    // Recettes personnalisées
    getCustomRecipes: () => {
      try {
        const raw = localStorage.getItem(GC_STORAGE_KEYS.RECIPES) || localStorage.getItem(GC_STORAGE_KEYS.RECIPES_OLD);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.warn('[GC_Store] Erreur lecture recettes:', e);
        return [];
      }
    },
    saveCustomRecipes: (recipes) => {
      try {
        localStorage.setItem(GC_STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
        localStorage.removeItem(GC_STORAGE_KEYS.RECIPES_OLD);
      } catch (e) {
        console.error('[GC_Store] Erreur sauvegarde recettes:', e);
      }
    },

    // Prix d'achat personnalisés
    getCustomPrices: () => {
      try {
        const raw = localStorage.getItem(GC_STORAGE_KEYS.PRICES);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.warn('[GC_Store] Erreur lecture prix:', e);
        return {};
      }
    },
    saveCustomPrices: (prices) => {
      try {
        localStorage.setItem(GC_STORAGE_KEYS.PRICES, JSON.stringify(prices));
        if (typeof window !== 'undefined' && window.INGREDIENT_UNIT_COSTS) {
          Object.assign(window.INGREDIENT_UNIT_COSTS, prices);
        }
      } catch (e) {
        console.error('[GC_Store] Erreur sauvegarde prix:', e);
      }
    },

    // Ventes mensuelles
    getMonthlySales: () => {
      try {
        const raw = localStorage.getItem(GC_STORAGE_KEYS.SALES);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.warn('[GC_Store] Erreur lecture ventes:', e);
        return {};
      }
    },
    saveMonthlySales: (salesDB) => {
      try {
        localStorage.setItem(GC_STORAGE_KEYS.SALES, JSON.stringify(salesDB));
      } catch (e) {
        console.error('[GC_Store] Erreur sauvegarde ventes:', e);
      }
    }
  };

  /**
   * GREY CORNER — Gestionnaire de mise en veille (Screen Wake Lock API)
   */
  let wakeLockSentinel = null;
  const GC_WakeLock = {
    isSupported: () => 'wakeLock' in navigator,
    isActive: () => !!wakeLockSentinel,
    request: async (onStatusChange) => {
      if (!('wakeLock' in navigator)) return false;
      try {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => {
          wakeLockSentinel = null;
          if (typeof onStatusChange === 'function') onStatusChange(false);
        });
        if (typeof onStatusChange === 'function') onStatusChange(true);
        return true;
      } catch (err) {
        console.warn('[WakeLock] Impossible d\'activer le wake lock:', err);
        if (typeof onStatusChange === 'function') onStatusChange(false);
        return false;
      }
    },
    release: async (onStatusChange) => {
      if (wakeLockSentinel) {
        try {
          await wakeLockSentinel.release();
        } catch (e) {}
        wakeLockSentinel = null;
      }
      if (typeof onStatusChange === 'function') onStatusChange(false);
    },
    toggle: async (onStatusChange) => {
      if (wakeLockSentinel) {
        await GC_WakeLock.release(onStatusChange);
        return false;
      } else {
        return await GC_WakeLock.request(onStatusChange);
      }
    }
  };

  /**
   * Détermine si un article doit être exclu de l'analyse Menu Engineering (Kasavana & Smith)
   * Règle d'exclusion métier :
   * 1. Sodas (boîtes/canettes de revente préemballées : Coca, Sprite, Fanta, Hawaï, Poms, Schweppes, etc.)
   * 2. Eaux minérales & gazeuses (Sidi Ali, Aïn Saïss, Oulmès, etc.)
   * 3. Suppléments & Extras cuisine (Supp frites, supp fromage, supp sauce, extra steak, etc.)
   * 4. Consommations personnel & Articles internes ("A la carte")
   */
  function isExcludedFromMenuEngineering(name, category, family, recipeKey) {
    const p = cleanText(name || '');
    const c = cleanText(category || '');
    const f = cleanText(family || '');
    const k = (recipeKey || '').toString().toLowerCase();

    // Raccourci par clé de catégorie SSOT (recipes-data.js)
    if (k === 'sd' || k === 'ea' || k === 'sup') {
      return true;
    }

    // Protection des boissons artisanales préparées (Cocktails, Mocktails, Smoothies, Jus frais)
    const isCraftBeverage = (
      c.includes('cocktail') || c.includes('mocktail') ||
      c.includes('smoothie') || c.includes('jus frais') ||
      p.includes('mojito') || p.includes('smoothie')
    );

    // 1. EXCLUSION DES SODAS
    if (!isCraftBeverage) {
      if (
        c.includes('soda') || c.includes('boissons fraiches') ||
        f === 'soda' || f === 'sodas' || f.includes('soda')
      ) {
        return true;
      }
      const isSodaName = (
        p.includes('coca') || p.includes('sprite') || p.includes('fanta') ||
        p.includes('hawai') || p.includes('poms') || p.includes('schweppes') ||
        p.includes('schwep') || p.includes('orangina') || p.includes('pepsi') ||
        p.includes('7up') || p.includes('seven up') || p.includes('mirinda') ||
        p.includes('canette') || p.startsWith('soda') || p === 'soda' ||
        p.includes('red bull') || p.includes('redbull')
      );
      if (isSodaName) return true;
    }

    // 2. EXCLUSION DES EAUX MINÉRALES & GAZEUSES
    if (
      c.includes('eau minerale') || c.includes('eaux minerales') ||
      c.includes('eau gazeuse') || c.includes('eaux gazeuses') ||
      c === 'eaux' || c === 'eau' || c.startsWith('eaux ') || c.startsWith('eau ') ||
      f === 'eau' || f === 'eaux' || f.includes('eau minerale') || f.includes('eau gazeuse')
    ) {
      return true;
    }
    const isWaterName = (
      p.includes('sidi ali') || p.includes('ain saiss') || p.includes('oulmes') ||
      p.includes('san pellegrino') || p.includes('pellegrino') || p.includes('evian') ||
      p.includes('eau minerale') || p.includes('eau gazeuse') || p.includes('eau plate') ||
      p.includes('bouteille d eau') || p.includes('bouteille eau') ||
      p === 'eau' || p === 'eaux' || p.startsWith('eau ') || p.startsWith('eaux ') ||
      p.includes('eau 33') || p.includes('eau 50') || p.includes('eau 75') || p.includes('eau 1l') || p.includes('eau 1 5')
    );
    if (isWaterName) return true;

    // 3. EXCLUSION DES SUPPLÉMENTS & EXTRAS CUISINE
    if (
      c.includes('supplement') || c.includes('extra') ||
      f.includes('supplement') || f.includes('extra') || f.startsWith('supp')
    ) {
      return true;
    }
    const isExtraName = (
      p.startsWith('supp ') || p.startsWith('supplement ') ||
      p.startsWith('extra ') || p.startsWith('extra-') ||
      p.includes('supp cuisine') || p.includes('extra cuisine') ||
      p.includes('supplement cuisine') ||
      p.includes('supp frite') || p.includes('supp puree') || p.includes('supp potatos') ||
      p.includes('supp fromage') || p.includes('supp cheese') || p.includes('supp cheddar') ||
      p.includes('supp mozza') || p.includes('supp sauce') || p.includes('supp viande') ||
      p.includes('supp steak') || p.includes('supp poulet') || p.includes('supp oeuf') ||
      p.includes('supp pain') || p.includes('supp champignon') ||
      p.includes('extra fromage') || p.includes('extra cheese') || p.includes('extra sauce') ||
      p.includes('extra frite') || p.includes('extra viande') || p.includes('extra steak') ||
      p.includes('extra poulet') || p.includes('extra oeuf')
    );
    if (isExtraName) return true;

    // 4. EXCLUSION DES CONSOMMATIONS INTERNES / PERSONNEL / A LA CARTE
    if (
      c.includes('a la carte') || f.includes('a la carte') ||
      c.includes('personnel') || f.includes('personnel') || p.includes('personnel')
    ) {
      return true;
    }

    return false;
  }

  global.cleanText = cleanText;
  global.escapeHtml = escapeHtml;
  global.applyTheme = applyTheme;
  global.formatMoney = formatMoney;
  global.formatNumber = formatNumber;
  global.formatDateFR = formatDateFR;
  global.formatMonthFR = formatMonthFR;
  global.initThemeManager = initThemeManager;
  global.GC_Store = GC_Store;
  global.GC_WakeLock = GC_WakeLock;
  global.GC_Toast = GC_Toast;
  global.GC_STORAGE_KEYS = GC_STORAGE_KEYS;
  global.OBSOLETE_INGREDIENT_KEYS = OBSOLETE_INGREDIENT_KEYS;
  global.forceCacheRefresh = forceCacheRefresh;
  global.APP_DATA_VERSION = APP_DATA_VERSION;
  global.isExcludedFromMenuEngineering = isExcludedFromMenuEngineering;
})(typeof window !== 'undefined' ? window : globalThis);
