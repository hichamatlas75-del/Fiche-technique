/**
 * GREY CORNER — Client Supabase pour la Direction & Contrôle de Gestion
 * Connecteur temps réel et persistance Cloud pour les matières premières, fiches et ventes.
 */
(function(global) {
  'use strict';

  const SUPABASE_CONFIG = {
    url: 'https://bxgguavmuiefthqmzygy.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Z2d1YXZtdWllZnRocW16eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNzIsImV4cCI6MjEwNDk1MjI3Mn0.7aGDBXzzMApGkxXuDDcwMJXxPlPsG8LEYb5WIcA--00'
  };

  const GC_Supabase = {
    isOnline: false,
    config: SUPABASE_CONFIG,

    // Headers standards pour les requêtes Supabase REST
    getHeaders: function(extra) {
      return Object.assign({
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey,
        'Content-Type': 'application/json'
      }, extra || {});
    },

    /**
     * Initialisation et synchronisation au démarrage
     */
    init: async function() {
      try {
        await this.syncIngredientsFromCloud();
        this.isOnline = true;
        this.updateUiBadge(true);
        this.setupRealtime();
      } catch (err) {
        console.warn('[GC_Supabase] Connexion cloud indisponible (mode hors-ligne):', err);
        this.isOnline = false;
        this.updateUiBadge(false);
      }
    },

    /**
     * Charge les prix et ingrédients depuis Supabase et met à jour INGREDIENT_UNIT_COSTS
     */
    syncIngredientsFromCloud: async function() {
      const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs?select=*', {
        headers: this.getHeaders()
      });
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (!global.INGREDIENT_UNIT_COSTS) global.INGREDIENT_UNIT_COSTS = {};
        data.forEach(item => {
          global.INGREDIENT_UNIT_COSTS[item.id] = {
            cost: Number(item.cost),
            unit: item.unit,
            label: item.label
          };
        });
        // Cache local de secours
        if (global.GC_Store) {
          global.GC_Store.saveCustomPrices(global.INGREDIENT_UNIT_COSTS);
        }
        console.log('[GC_Supabase] ' + data.length + ' matières synchronisées depuis le Cloud.');
      }
    },

    /**
     * Sauvegarde un ingrédient vers Supabase
     */
    saveIngredientToCloud: async function(id, cost, unit, label, category) {
      try {
        const payload = [{
          id: id,
          cost: cost,
          unit: unit,
          label: label,
          category: category || 'Général',
          updated_at: new Date().toISOString()
        }];
        const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs', {
          method: 'POST',
          headers: this.getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
          body: JSON.stringify(payload)
        });
        return res.ok;
      } catch (err) {
        console.error('[GC_Supabase] Erreur sauvegarde ingrédient:', err);
        return false;
      }
    },

    /**
     * Sauvegarde toute la mercuriale vers Supabase (ex: bouton Enregistrer de la modale)
     */
    saveAllIngredientsToCloud: async function(costsObj) {
      try {
        const rows = [];
        for (const [id, def] of Object.entries(costsObj)) {
          rows.push({
            id: id,
            cost: typeof def.cost === 'number' ? def.cost : 0,
            unit: def.unit || 'kg',
            label: def.label || id,
            updated_at: new Date().toISOString()
          });
        }
        // Envoi par paquets de 100
        for (let i = 0; i < rows.length; i += 100) {
          const chunk = rows.slice(i, i + 100);
          await fetch(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs', {
            method: 'POST',
            headers: this.getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
            body: JSON.stringify(chunk)
          });
        }
        if (global.GC_Toast) {
          global.GC_Toast.show('☁️ Mercuriale synchronisée avec Supabase !', 'success');
        }
        return true;
      } catch (err) {
        console.error('[GC_Supabase] Erreur synchronisation mercuriale:', err);
        return false;
      }
    },

    /**
     * Écoute en temps réel les changements (Realtime)
     */
    setupRealtime: function() {
      if (global.supabase && typeof global.supabase.createClient === 'function') {
        const client = global.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        client
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'ingredient_costs' }, payload => {
            console.log('[GC_Supabase Realtime] Mise à jour prix détectée:', payload);
            if (payload.new && payload.new.id) {
              if (!global.INGREDIENT_UNIT_COSTS) global.INGREDIENT_UNIT_COSTS = {};
              global.INGREDIENT_UNIT_COSTS[payload.new.id] = {
                cost: Number(payload.new.cost),
                unit: payload.new.unit,
                label: payload.new.label
              };
              if (global.GC_PricesModal && typeof global.GC_PricesModal.renderTable === 'function') {
                global.GC_PricesModal.renderTable();
              }
              if (global.GC_Toast) {
                global.GC_Toast.show('⚡ Prix mis à jour en direct : ' + payload.new.label, 'info');
              }
            }
          })
          .subscribe();
      }
    },

    /**
     * Met à jour le badge de statut dans l'en-tête
     */
    updateUiBadge: function(isOnline) {
      const badge = document.getElementById('sync-status-badge');
      if (badge) {
        if (isOnline) {
          badge.innerHTML = '☁️ Supabase Connecté';
          badge.style.background = 'rgba(2, 132, 199, 0.12)';
          badge.style.color = '#0284c7';
          badge.style.border = '1px solid rgba(2, 132, 199, 0.3)';
          badge.title = 'Base de données Supabase connectée en temps réel (Direction)';
        }
      }
    }
  };

  global.GC_Supabase = GC_Supabase;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GC_Supabase.init());
  } else {
    GC_Supabase.init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
