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

  global.cleanText = cleanText;
  global.escapeHtml = escapeHtml;
  global.formatMoney = formatMoney;
  global.formatNumber = formatNumber;
  global.formatDateFR = formatDateFR;
  global.formatMonthFR = formatMonthFR;
  global.initThemeManager = initThemeManager;
})(typeof window !== 'undefined' ? window : globalThis);
