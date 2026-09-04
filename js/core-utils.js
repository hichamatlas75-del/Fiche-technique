/**
 * GREY CORNER — Fonctions Utilitaires Partagées (Core Utils)
 */

(function(global) {
  /**
   * Normalisation de texte (sans accents, minuscules, espaces superflus)
   */
  function cleanText(str) {
    return (str || '')
      .toLowerCase()
      .replace(/œ/g, 'oe')
      .replace(/æ/g, 'ae')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
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
   * Gestionnaire de thème Clair / Sombre
   */
  function initThemeManager(toggleBtnId = 'theme-toggle', storageKey = 'gc_theme') {
    const themeToggleBtn = document.getElementById(toggleBtnId);
    const savedTheme = localStorage.getItem(storageKey) || 'light';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }

    function applyTheme(t) {
      if (t === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggleBtn) {
          themeToggleBtn.textContent = '☀️ Mode Clair';
          themeToggleBtn.title = 'Passer au mode clair';
        }
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggleBtn) {
          themeToggleBtn.textContent = '🌙 Mode Sombre';
          themeToggleBtn.title = 'Passer au mode sombre';
        }
      }
      localStorage.setItem(storageKey, t);
    }
  }

  /**
   * GREY CORNER — Gestionnaire de données unifié (Single Source of Truth)
   */
  const GC_Store = {
    // Thème
    getTheme: () => localStorage.getItem('gc_theme') || 'light',
    setTheme: (t) => {
      if (t === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('gc_theme', t);
    },

    // Recettes personnalisées
    getCustomRecipes: () => {
      try {
        const raw = localStorage.getItem('gc_recipes_db_v5') || localStorage.getItem('gc_recipes_db_v4');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.warn('[GC_Store] Erreur lecture recettes:', e);
        return [];
      }
    },
    saveCustomRecipes: (recipes) => {
      try {
        localStorage.setItem('gc_recipes_db_v5', JSON.stringify(recipes));
        localStorage.removeItem('gc_recipes_db_v4');
      } catch (e) {
        console.error('[GC_Store] Erreur sauvegarde recettes:', e);
      }
    },

    // Prix d'achat personnalisés
    getCustomPrices: () => {
      try {
        const raw = localStorage.getItem('gc_ingredient_prices_v1');
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.warn('[GC_Store] Erreur lecture prix:', e);
        return {};
      }
    },
    saveCustomPrices: (prices) => {
      try {
        localStorage.setItem('gc_ingredient_prices_v1', JSON.stringify(prices));
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
        const raw = localStorage.getItem('gc_monthly_sales_db_v3');
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.warn('[GC_Store] Erreur lecture ventes:', e);
        return {};
      }
    },
    saveMonthlySales: (salesDB) => {
      try {
        localStorage.setItem('gc_monthly_sales_db_v3', JSON.stringify(salesDB));
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

  global.cleanText = cleanText;
  global.escapeHtml = escapeHtml;
  global.formatMoney = formatMoney;
  global.formatNumber = formatNumber;
  global.formatDateFR = formatDateFR;
  global.formatMonthFR = formatMonthFR;
  global.initThemeManager = initThemeManager;
  global.GC_Store = GC_Store;
  global.GC_WakeLock = GC_WakeLock;
})(typeof window !== 'undefined' ? window : globalThis);
