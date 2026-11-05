/**
 * ============================================================================
 * GREY CORNER — COMPAGNON MOBILE PRO (NAVIGATION BASSE & ERGONOMIE TACTILE)
 * Version 10.2 — PWA & Responsive Native-Like Experience (Zero Scroll Lock)
 * ============================================================================
 */

(function () {
  'use strict';

  /**
   * Déverrouillage systématique et inconditionnel du défilement
   * Garantit qu'aucun script ou événement résiduel ne bloque le scroll utilisateur
   */
  function unlockScroll() {
    try {
      if (document.documentElement && document.documentElement.style) {
        document.documentElement.style.overflow = '';
        document.documentElement.style.overflowY = 'auto';
      }
      if (document.body && document.body.style) {
        document.body.style.overflow = '';
        document.body.style.overflowY = 'auto';
      }
    } catch (e) {
      console.warn('[MobilePro] unlockScroll error:', e);
    }
  }

  // Déblocage immédiat dès l'évaluation du script
  unlockScroll();

  function initMobilePro() {
    unlockScroll();

    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);
    if (!isMobile) return;

    setupMobileBottomNav();
    setupScrollTopAdjustment();
    observeActiveTabs();
  }

  /**
   * 1. Installation de la Barre de Navigation Basse Tactile (Thumb Zone)
   */
  function setupMobileBottomNav() {
    if (document.getElementById('gc-mobile-nav')) return;

    const path = window.location.pathname.toLowerCase();
    const isConsommation = path.includes('consommation') || path.endsWith('/') || path.endsWith('/index.html') || (!path.includes('comparateur') && !path.includes('audit') && !path.includes('synthese'));
    const isComparateur = path.includes('comparateur');
    const isAudit = path.includes('audit');
    const isCockpit = path.includes('synthese');

    const nav = document.createElement('nav');
    nav.id = 'gc-mobile-nav';
    nav.className = 'gc-mobile-nav';
    nav.setAttribute('aria-label', 'Navigation principale mobile');

    let navHtml = '';

    if (isConsommation) {
      navHtml = `
        <button type="button" class="gc-mobile-nav-item is-active" data-dest="tab-summary" title="Matières Premières & Déstockage">
          <span class="nav-icon">🥩</span>
          <span>Stock</span>
        </button>
        <button type="button" class="gc-mobile-nav-item" data-dest="tab-sales" title="Articles Vendus">
          <span class="nav-icon">🧾</span>
          <span>Ventes</span>
        </button>
        <button type="button" class="gc-mobile-nav-item" data-dest="tab-menu-engineering" title="Menu Engineering">
          <span class="nav-icon">🎯</span>
          <span>Menu Eng.</span>
        </button>
        <button type="button" class="gc-mobile-nav-item" data-dest="tab-comparator" title="Comparateur Ventes & Normes">
          <span class="nav-icon">📊</span>
          <span>Comparateur</span>
        </button>
        <button type="button" class="gc-mobile-nav-item" data-action="drawer" title="Ouvrir le menu complet des fonctions">
          <span class="nav-icon">☰</span>
          <span>Menu</span>
        </button>
      `;
    } else if (isComparateur) {
      navHtml = `
        <a href="consommation.html" class="gc-mobile-nav-item" title="Déstockage & Consommation">
          <span class="nav-icon">🥩</span>
          <span>Déstockage</span>
        </a>
        <button type="button" class="gc-mobile-nav-item is-active" title="Normes & Comparateur">
          <span class="nav-icon">⚖️</span>
          <span>Normes</span>
        </button>
        <a href="audit.html" class="gc-mobile-nav-item" title="Audit Flash Manuel">
          <span class="nav-icon">⚡</span>
          <span>Audit</span>
        </a>
        <a href="SYNTHESE_DECISIONNELLE_MENU.html" class="gc-mobile-nav-item" title="Cockpit Menu">
          <span class="nav-icon">👑</span>
          <span>Cockpit</span>
        </a>
        <button type="button" class="gc-mobile-nav-item" data-action="drawer" title="Menu Fonctions">
          <span class="nav-icon">☰</span>
          <span>Menu</span>
        </button>
      `;
    } else {
      navHtml = `
        <a href="consommation.html" class="gc-mobile-nav-item" title="Déstockage">
          <span class="nav-icon">🥩</span>
          <span>Déstockage</span>
        </a>
        <a href="comparateur.html" class="gc-mobile-nav-item" title="Normes">
          <span class="nav-icon">⚖️</span>
          <span>Normes</span>
        </a>
        <a href="audit.html" class="gc-mobile-nav-item ${isAudit ? 'is-active' : ''}" title="Audit Flash">
          <span class="nav-icon">⚡</span>
          <span>Audit</span>
        </a>
        <a href="SYNTHESE_DECISIONNELLE_MENU.html" class="gc-mobile-nav-item ${isCockpit ? 'is-active' : ''}" title="Cockpit Menu">
          <span class="nav-icon">👑</span>
          <span>Cockpit</span>
        </a>
        <button type="button" class="gc-mobile-nav-item" data-action="drawer" title="Menu Fonctions">
          <span class="nav-icon">☰</span>
          <span>Menu</span>
        </button>
      `;
    }

    nav.innerHTML = navHtml;
    document.body.appendChild(nav);

    // Écoute des clics sur la barre mobile
    nav.addEventListener('click', function (e) {
      const btn = e.target.closest('.gc-mobile-nav-item');
      if (!btn) return;

      const dest = btn.getAttribute('data-dest');
      const action = btn.getAttribute('data-action');

      if (action === 'drawer') {
        e.preventDefault();
        const trigger = document.querySelector('[data-drawer-trigger]');
        if (trigger) {
          trigger.click();
        } else if (window.GC_BurgerMenu && typeof window.GC_BurgerMenu.open === 'function') {
          window.GC_BurgerMenu.open('drawer-destockage');
        }
        return;
      }

      if (dest) {
        e.preventDefault();
        const tabBtn = document.querySelector(`.v-tab[data-tab="${dest}"]`);
        if (tabBtn) {
          tabBtn.click();
          window.scrollTo({ top: 100, behavior: 'smooth' });
        }
        updateActiveMobileNav(dest);
      }
    });
  }

  /**
   * 2. Synchronisation de l'indicateur actif avec les onglets de la page
   */
  function updateActiveMobileNav(tabId) {
    const items = document.querySelectorAll('.gc-mobile-nav-item[data-dest]');
    items.forEach(it => {
      if (it.getAttribute('data-dest') === tabId) {
        it.classList.add('is-active');
      } else {
        it.classList.remove('is-active');
      }
    });
  }

  function observeActiveTabs() {
    const viewTabs = document.querySelectorAll('.v-tab');
    viewTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const tId = this.getAttribute('data-tab');
        if (tId) updateActiveMobileNav(tId);
      });
    });
  }

  /**
   * 3. Ajustement du bouton retour en haut pour ne jamais chevaucher la nav mobile
   */
  function setupScrollTopAdjustment() {
    const btn = document.querySelector('.btn-scroll-top');
    if (!btn) return;
    if (window.innerWidth <= 768) {
      btn.style.bottom = 'calc(var(--mobile-nav-height, 62px) + env(safe-area-inset-bottom, 0px) + 14px)';
    }
  }

  // Démarrage automatique au chargement et au redimensionnement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobilePro);
  } else {
    initMobilePro();
  }

  window.addEventListener('resize', function () {
    unlockScroll();
    if (window.innerWidth <= 768) {
      setupMobileBottomNav();
      setupScrollTopAdjustment();
    } else {
      const nav = document.getElementById('gc-mobile-nav');
      if (nav) nav.remove();
    }
  });

  window.GC_MobilePro = {
    init: initMobilePro,
    unlockScroll: unlockScroll,
    setActiveTab: updateActiveMobileNav
  };
})();
