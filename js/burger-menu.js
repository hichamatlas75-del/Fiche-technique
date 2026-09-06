/**
 * GREY CORNER — GESTIONNAIRE UNIVERSEL DU MENU BURGER & DU TIROIR LATÉRAL (DRAWER)
 * Permet d'ouvrir, fermer et naviguer fluidement entre les fonctions du système.
 */
(function() {
  'use strict';

  const GC_BurgerMenu = {
    currentDrawerId: null,

    /**
     * Ouvre un tiroir latéral par son ID
     * @param {string} drawerId 
     */
    open: function(drawerId) {
      const drawer = document.getElementById(drawerId);
      const backdrop = document.getElementById('gc-burger-backdrop');
      if (!drawer) return;

      this.currentDrawerId = drawerId;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');

      if (backdrop) {
        backdrop.classList.add('is-open');
      }

      // Marquer le bouton déclencheur comme actif
      document.querySelectorAll(`[data-drawer-target="${drawerId}"], .gc-burger-trigger`).forEach(btn => {
        btn.classList.add('is-active');
        btn.setAttribute('aria-expanded', 'true');
      });

      // Empêcher le défilement du corps en arrière-plan
      if (document.body && document.body.style) {
        document.body.style.overflow = 'hidden';
      }
    },

    /**
     * Ferme le tiroir latéral actuellement ouvert ou spécifié
     * @param {string} [drawerId] 
     */
    close: function(drawerId) {
      const targetId = drawerId || this.currentDrawerId;
      if (targetId) {
        const drawer = document.getElementById(targetId);
        if (drawer) {
          drawer.classList.remove('is-open');
          drawer.setAttribute('aria-hidden', 'true');
        }
      } else {
        document.querySelectorAll('.gc-burger-drawer').forEach(d => {
          d.classList.remove('is-open');
          d.setAttribute('aria-hidden', 'true');
        });
      }

      const backdrop = document.getElementById('gc-burger-backdrop');
      if (backdrop) {
        backdrop.classList.remove('is-open');
      }

      document.querySelectorAll('.gc-burger-trigger').forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-expanded', 'false');
      });

      if (document.body && document.body.style) {
        document.body.style.overflow = '';
      }
      this.currentDrawerId = null;
    },

    /**
     * Bascule l'ouverture/fermeture du tiroir
     * @param {string} drawerId 
     */
    toggle: function(drawerId) {
      const drawer = document.getElementById(drawerId);
      if (drawer && drawer.classList.contains('is-open')) {
        this.close(drawerId);
      } else {
        this.open(drawerId);
      }
    },

    /**
     * Met en surbrillance l'item de navigation actif
     * @param {string} itemId 
     */
    setActiveItem: function(itemId) {
      document.querySelectorAll('.gc-drawer-nav-item').forEach(el => {
        if (el.getAttribute('data-nav-id') === itemId) {
          el.classList.add('is-active');
        } else {
          el.classList.remove('is-active');
        }
      });
    },

    /**
     * Initialisation automatique au chargement
     */
    init: function() {
      // 1. Fermeture via clic sur le backdrop
      const backdrop = document.getElementById('gc-burger-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => GC_BurgerMenu.close());
      }

      // 2. Fermeture via la touche Échap
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          GC_BurgerMenu.close();
        }
      });

      // 3. Déclencheurs de burger
      document.querySelectorAll('[data-drawer-trigger]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const target = btn.getAttribute('data-drawer-trigger');
          GC_BurgerMenu.toggle(target);
        });
      });

      // 4. Boutons de fermeture
      document.querySelectorAll('.gc-drawer-close-btn').forEach(btn => {
        btn.addEventListener('click', () => GC_BurgerMenu.close());
      });
    }
  };

  window.GC_BurgerMenu = GC_BurgerMenu;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GC_BurgerMenu.init());
  } else {
    GC_BurgerMenu.init();
  }
})();
