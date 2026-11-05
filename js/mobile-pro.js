/**
 * ============================================================================
 * GREY CORNER — COMPAGNON MOBILE PRO (NAVIGATION BASSE & ERGONOMIE TACTILE)
 * Version 10.1 — PWA & Responsive Native-Like Experience
 * ============================================================================
 */

(function () {
  'use strict';

  function initMobilePro() {
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);
    if (!isMobile) return;

    setupMobileBottomNav();
    setupBottomSheetTouchHandling();
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
        if (window.GC_BurgerMenu && typeof window.GC_BurgerMenu.open === 'function') {
          window.GC_BurgerMenu.open();
        } else {
          const trigger = document.querySelector('[data-drawer-trigger]');
          if (trigger) trigger.click();
        }
        return;
      }

      if (dest) {
        e.preventDefault();
        const tabBtn = document.querySelector(`.v-tab[data-tab="${dest}"]`);
        if (tabBtn) {
          tabBtn.click();
          // Défilement doux vers le contenu
          window.scrollTo({ top: 120, behavior: 'smooth' });
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
   * 3. Amélioration des Modales en "Bottom Sheets" tactiles
   * Verrouillage du scroll en arrière-plan lorsque la modale est ouverte
   */
  function setupBottomSheetTouchHandling() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mut => {
        if (mut.type === 'attributes' && (mut.attributeName === 'style' || mut.attributeName === 'class')) {
          const target = mut.target;
          if (target.classList.contains('modal-overlay')) {
            const isVisible = target.style.display !== 'none' && !target.classList.contains('hidden');
            if (isVisible && window.innerWidth <= 768) {
              document.body.style.overflow = 'hidden';
            } else {
              // Vérifie si une autre modale est encore visible
              const otherVisible = Array.from(document.querySelectorAll('.modal-overlay')).some(m => m !== target && m.style.display !== 'none');
              if (!otherVisible) {
                document.body.style.overflow = '';
              }
            }
          }
        }
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      observer.observe(modal, { attributes: true });
    });
  }

  /**
   * 4. Ajustement du bouton retour en haut pour ne jamais chevaucher la nav mobile
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
    if (window.innerWidth <= 768) {
      setupMobileBottomNav();
      setupScrollTopAdjustment();
    } else {
      const nav = document.getElementById('gc-mobile-nav');
      if (nav) nav.remove();
      document.body.style.overflow = '';
    }
  });

  window.GC_MobilePro = {
    init: initMobilePro,
    setActiveTab: updateActiveMobileNav
  };
})();
