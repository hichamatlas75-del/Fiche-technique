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
      const token = (global.GC_Auth && typeof global.GC_Auth.getAccessToken === 'function')
        ? global.GC_Auth.getAccessToken()
        : SUPABASE_CONFIG.anonKey;

      return Object.assign({
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }, extra || {});
    },

    /**
     * Initialisation et synchronisation au démarrage
     */
    init: async function() {
      try {
        await this.syncIngredientsFromCloud();
        await this.syncRecipesFromCloud();
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
      try {
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
          } else if (typeof localStorage !== 'undefined') {
            localStorage.setItem('gc_ingredient_prices_v1', JSON.stringify(global.INGREDIENT_UNIT_COSTS));
          }
          console.log('[GC_Supabase] ' + data.length + ' matières synchronisées depuis le Cloud.');

          // Notifier immédiatement les vues et fiches ouvertes
          if (global.GC_PricesModal) {
            if (typeof global.GC_PricesModal.isOpen === 'function' && global.GC_PricesModal.isOpen() && typeof global.GC_PricesModal.renderTable === 'function') {
              global.GC_PricesModal.renderTable();
            }
            if (typeof global.GC_PricesModal.notify === 'function') {
              global.GC_PricesModal.notify();
            }
          }
        }
      } catch (err) {
        console.warn('[GC_Supabase] Synchronisation matières cloud ignorée:', err.message);
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
     * Sauvegarde rapide d'une sélection de matières modifiées vers Supabase Cloud
     */
    saveModifiedIngredientsToCloud: async function(keys, costsObj) {
      try {
        if (!keys || keys.length === 0) return true;
        const costs = costsObj || global.INGREDIENT_UNIT_COSTS || {};
        const rows = [];
        keys.forEach(k => {
          const def = costs[k];
          if (def) {
            rows.push({
              id: k,
              cost: typeof def.cost === 'number' ? def.cost : 0,
              unit: def.unit || 'kg',
              label: def.label || k,
              category: def.category || 'Général',
              updated_at: new Date().toISOString()
            });
          }
        });
        if (rows.length === 0) return true;
        const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs', {
          method: 'POST',
          headers: this.getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
          body: JSON.stringify(rows)
        });
        if (!res.ok) {
          console.error('[GC_Supabase] Erreur HTTP sauvegarde ciblée:', res.status, res.statusText);
          return false;
        }
        return true;
      } catch (err) {
        console.error('[GC_Supabase] Erreur sauvegarde ciblée:', err);
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
        // Envoi par paquets de 100 avec vérification de statut
        for (let i = 0; i < rows.length; i += 100) {
          const chunk = rows.slice(i, i + 100);
          const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs', {
            method: 'POST',
            headers: this.getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
            body: JSON.stringify(chunk)
          });
          if (!res.ok) {
            console.error('[GC_Supabase] Erreur HTTP chunk ' + i + ':', res.status, res.statusText);
            return false;
          }
        }
        return true;
      } catch (err) {
        console.error('[GC_Supabase] Erreur synchronisation mercuriale:', err);
        return false;
      }
    },

    /**
     * Charge les fiches techniques depuis Supabase et met à jour activeRecipes si des fiches modifiées existent
     */
    syncRecipesFromCloud: async function() {
      try {
        const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/recipes?is_active=eq.true&select=*', {
          headers: this.getHeaders()
        });
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          console.log('[GC_Supabase] ' + data.length + ' fiches techniques récupérées depuis Supabase Cloud.');
          if (typeof window !== 'undefined' && Array.isArray(window.activeRecipes)) {
            let updatedCount = 0;
            data.forEach(cloudR => {
              if (!cloudR || !cloudR.name) return;
              const idx = window.activeRecipes.findIndex(r => r && (r.id === cloudR.id || (window.cleanText && window.cleanText(r.name) === window.cleanText(cloudR.name))));
              if (idx >= 0 && Array.isArray(cloudR.ingredients) && cloudR.ingredients.length > 0) {
                window.activeRecipes[idx].ingredients = cloudR.ingredients;
                window.activeRecipes[idx].sellPrice = cloudR.sell_price;
                window.activeRecipes[idx].cost = cloudR.cost;
                window.activeRecipes[idx].foodCost = cloudR.food_cost;
                window.activeRecipes[idx].grossMarginDH = cloudR.gross_margin;
                updatedCount++;
              }
            });
            if (updatedCount > 0 && typeof window.renderRecipeList === 'function') {
              window.renderRecipeList();
            }
          }
        }
      } catch (err) {
        console.warn('[GC_Supabase] Synchronisation fiches cloud ignorée:', err.message);
      }
    },

    /**
     * Sauvegarde une fiche technique unitaire vers Supabase Cloud
     */
    saveRecipeToCloud: async function(recipeObj) {
      try {
        if (!recipeObj || !recipeObj.name) {
          console.warn('[GC_Supabase] Fiche invalide reçue pour sauvegarde Cloud');
          return false;
        }
        const cat = recipeObj.category || 'Général';
        const id = (recipeObj.id && !recipeObj.id.startsWith('rec_'))
          ? recipeObj.id
          : ((cat + '_' + recipeObj.name).toLowerCase().replace(/[^a-z0-9]/g, '_'));

        const payload = [{
          id: id,
          name: recipeObj.name,
          category: cat,
          sell_price: recipeObj.sell_price || recipeObj.sellPrice || 0,
          cost: typeof recipeObj.cost === 'number' ? recipeObj.cost : 0,
          food_cost: typeof recipeObj.food_cost === 'number' ? recipeObj.food_cost : (recipeObj.foodCost || 0),
          gross_margin: typeof recipeObj.gross_margin === 'number' ? recipeObj.gross_margin : (recipeObj.grossMarginDH || 0),
          ingredients: recipeObj.ingredients || recipeObj.tech || [],
          is_active: true,
          updated_at: new Date().toISOString()
        }];

        const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/recipes', {
          method: 'POST',
          headers: this.getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errTxt = await res.text();
          console.error('[GC_Supabase] Erreur HTTP sauvegarde recette:', res.status, errTxt);
          if (global.GC_Toast) {
            global.GC_Toast.show('⚠️ Erreur synchronisation Supabase (' + res.status + ')', 'error');
          }
          return false;
        }

        console.log('[GC_Supabase] Fiche synchronisée avec succès dans Supabase:', recipeObj.name);
        if (global.GC_Toast) {
          global.GC_Toast.show('☁️ Fiche "' + recipeObj.name + '" synchronisée dans Supabase Cloud !', 'success');
        }
        return true;
      } catch (err) {
        console.error('[GC_Supabase] Erreur sauvegarde recette:', err);
        if (global.GC_Toast) {
          global.GC_Toast.show('⚠️ Erreur réseau Supabase: ' + err.message, 'error');
        }
        return false;
      }
    },

    /**
     * Supprime ou désactive une fiche technique de Supabase Cloud
     */
    deleteRecipeFromCloud: async function(id, name) {
      try {
        const rowId = (id && !id.startsWith('rec_')) ? id : (name ? ('_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_')) : '');
        const url = SUPABASE_CONFIG.url + '/rest/v1/recipes?' + (rowId ? `id=eq.${encodeURIComponent(rowId)}` : `name=eq.${encodeURIComponent(name)}`);
        const res = await fetch(url, {
          method: 'DELETE',
          headers: this.getHeaders()
        });
        if (global.GC_Toast) {
          global.GC_Toast.show('🗑️ Fiche supprimée de Supabase Cloud', 'info');
        }
        return res.ok;
      } catch (err) {
        console.error('[GC_Supabase] Erreur suppression recette:', err);
        return false;
      }
    },

    /**
     * Sauvegarde l'ensemble des fiches techniques actives vers Supabase Cloud
     */
    saveAllActiveRecipesToCloud: async function(recipesList) {
      try {
        const list = recipesList || global.activeRecipes || [];
        if (!Array.isArray(list) || list.length === 0) return false;

        const rows = [];
        for (const r of list) {
          if (!r || !r.name) continue;
          const cat = r.category || 'Général';
          const id = (r.id && !r.id.startsWith('rec_')) ? r.id : ((cat + '_' + r.name).toLowerCase().replace(/[^a-z0-9]/g, '_'));
          rows.push({
            id: id,
            name: r.name,
            category: cat,
            sell_price: r.sellPrice || r.sell_price || 0,
            cost: typeof r.cost === 'number' ? r.cost : 0,
            food_cost: typeof r.foodCost === 'number' ? r.foodCost : 0,
            gross_margin: typeof r.grossMarginDH === 'number' ? r.grossMarginDH : 0,
            ingredients: r.ingredients || r.tech || [],
            is_active: true,
            updated_at: new Date().toISOString()
          });
        }

        if (rows.length === 0) return true;

        for (let i = 0; i < rows.length; i += 100) {
          const chunk = rows.slice(i, i + 100);
          const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/recipes', {
            method: 'POST',
            headers: this.getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
            body: JSON.stringify(chunk)
          });
          if (!res.ok) {
            console.error('[GC_Supabase] Erreur chunk ' + i + ':', await res.text());
          }
        }

        if (global.GC_Toast) {
          global.GC_Toast.show('☁️ ' + rows.length + ' fiches synchronisées dans Supabase Cloud !', 'success');
        }
        return true;
      } catch (err) {
        console.error('[GC_Supabase] Erreur synchronisation fiches globales:', err);
        return false;
      }
    },

    /**
     * Sauvegarde les fiches techniques modifiées (depuis le comparateur) vers Supabase Cloud
     */
    saveEditedRecipesToCloud: async function(editedMap) {
      try {
        const rows = [];
        const baseList = (global.BASE_RECIPES || []).concat(global.allRecipes || []);
        for (const [name, edit] of Object.entries(editedMap || {})) {
          if (!edit || !Array.isArray(edit.tech)) continue;
          const found = baseList.find(r => r && (r.name === name || (global.cleanText && global.cleanText(r.name) === global.cleanText(name))));
          const cat = found ? (found.category || 'Général') : 'Général';
          const id = (cat + '_' + name).toLowerCase().replace(/[^a-z0-9]/g, '_');
          const sellPrice = edit.sellPrice || (found ? found.sellPrice : 0) || 0;
          let cost = 0, foodCost = 0, grossMargin = 0;
          if (typeof global.calculateRecipeFoodCost === 'function') {
            const fc = global.calculateRecipeFoodCost(edit.tech, sellPrice);
            cost = fc.cost;
            foodCost = fc.foodCost;
            grossMargin = fc.grossMarginDH;
          }
          rows.push({
            id: id,
            name: name,
            category: cat,
            sell_price: sellPrice,
            cost: cost,
            food_cost: foodCost,
            gross_margin: grossMargin,
            ingredients: edit.tech,
            is_active: true,
            updated_at: new Date().toISOString()
          });
        }
        if (rows.length === 0) return true;

        for (let i = 0; i < rows.length; i += 100) {
          const chunk = rows.slice(i, i + 100);
          await fetch(SUPABASE_CONFIG.url + '/rest/v1/recipes', {
            method: 'POST',
            headers: this.getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
            body: JSON.stringify(chunk)
          });
        }
        if (global.GC_Toast) {
          global.GC_Toast.show('☁️ ' + rows.length + ' fiches synchronisées dans Supabase Cloud !', 'success');
        }
        return true;
      } catch (err) {
        console.error('[GC_Supabase] Erreur synchronisation fiches:', err);
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
              if (global.GC_Store) {
                global.GC_Store.saveCustomPrices(global.INGREDIENT_UNIT_COSTS);
              } else if (typeof localStorage !== 'undefined') {
                localStorage.setItem('gc_ingredient_prices_v1', JSON.stringify(global.INGREDIENT_UNIT_COSTS));
              }
              if (global.GC_PricesModal) {
                if (typeof global.GC_PricesModal.isOpen === 'function' && global.GC_PricesModal.isOpen() && typeof global.GC_PricesModal.renderTable === 'function') {
                  global.GC_PricesModal.renderTable();
                }
                if (typeof global.GC_PricesModal.notify === 'function') {
                  global.GC_PricesModal.notify();
                }
              }
              const unitLabel = payload.new.unit === 'g' ? 'kg' : (payload.new.unit === 'ml' ? 'L' : 'p');
              const displayPrice = (payload.new.unit === 'g' || payload.new.unit === 'ml')
                ? (Number(payload.new.cost) * 1000).toFixed(2)
                : Number(payload.new.cost).toFixed(2);
              if (global.GC_Toast) {
                global.GC_Toast.show(`⚡ Prix mis à jour en direct : ${payload.new.label || payload.new.id} (${displayPrice} DH/${unitLabel})`, 'info');
              }
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, payload => {
            console.log('[GC_Supabase Realtime] Mise à jour fiche recette détectée:', payload);
            if (payload.new && payload.new.name && Array.isArray(window.activeRecipes)) {
              const r = payload.new;
              const idx = window.activeRecipes.findIndex(x => x && (x.id === r.id || (window.cleanText && window.cleanText(x.name) === window.cleanText(r.name))));
              const recipeObj = {
                id: r.id,
                name: r.name,
                category: r.category,
                ingredients: r.ingredients || [],
                sellPrice: r.sell_price || 0,
                cost: r.cost || 0,
                foodCost: r.food_cost || 0,
                grossMarginDH: r.gross_margin || 0
              };
              if (idx >= 0) {
                window.activeRecipes[idx] = recipeObj;
              } else {
                window.activeRecipes.push(recipeObj);
              }
              if (typeof window.saveRecipes === 'function') window.saveRecipes();
              if (typeof window.renderRecipeList === 'function') window.renderRecipeList();
              if (global.GC_Toast) {
                global.GC_Toast.show('⚡ Fiche mise à jour en direct : ' + r.name, 'info');
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
