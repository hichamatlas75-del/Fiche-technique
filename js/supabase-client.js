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
    getHeaders: function(extra, forceAnon = false) {
      const token = (!forceAnon && global.GC_Auth && typeof global.GC_Auth.getAccessToken === 'function')
        ? global.GC_Auth.getAccessToken()
        : SUPABASE_CONFIG.anonKey;

      return Object.assign({
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }, extra || {});
    },

    /**
     * Exécute un fetch Supabase avec repli automatique (fallback) :
     * Si l'Authorization avec token utilisateur échoue (ex: token expiré 401, RLS 403),
     * on retente immédiatement et de façon transparente avec SUPABASE_CONFIG.anonKey.
     */
    fetchWithFallback: async function(url, options = {}) {
      const opt = Object.assign({}, options);
      const customHeaders = opt.headers || {};

      opt.headers = this.getHeaders(customHeaders, false);
      let res;
      try {
        res = await fetch(url, opt);
      } catch (networkErr) {
        throw networkErr;
      }

      if (res && (res.status === 401 || res.status === 403)) {
        console.warn(`[GC_Supabase] Rejet ${res.status} avec token auth. Repli immédiat sur clé anon publique...`);
        const fallbackOpt = Object.assign({}, options);
        fallbackOpt.headers = this.getHeaders(customHeaders, true);
        res = await fetch(url, fallbackOpt);
      }

      return res;
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
        const url = SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs?select=*&order=updated_at.asc&_ts=' + Date.now();
        const res = await this.fetchWithFallback(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          if (!global.INGREDIENT_UNIT_COSTS) global.INGREDIENT_UNIT_COSTS = {};
          data.forEach(item => {
            if (!item || !item.id) return;
            const costVal = Number(item.cost) || 0;
            const unitVal = item.unit || 'kg';
            const labelVal = item.label || item.id;

            global.INGREDIENT_UNIT_COSTS[item.id] = {
              cost: costVal,
              unit: unitVal,
              label: labelVal
            };

            if (typeof global.cleanText === 'function') {
              const cK = global.cleanText(item.id);
              if (cK && cK !== item.id) {
                global.INGREDIENT_UNIT_COSTS[cK] = {
                  cost: costVal,
                  unit: unitVal,
                  label: labelVal
                };
              }
            }
          });

          // Cache local de secours
          if (global.GC_Store && typeof global.GC_Store.saveCustomPrices === 'function') {
            global.GC_Store.saveCustomPrices(global.INGREDIENT_UNIT_COSTS);
          } else if (typeof localStorage !== 'undefined') {
            localStorage.setItem('gc_ingredient_prices_v1', JSON.stringify(global.INGREDIENT_UNIT_COSTS));
          }
          console.log('[GC_Supabase] ' + data.length + ' matières synchronisées depuis le Cloud.');

          // Recalculer le Food Cost de toutes les recettes actives en mémoire (Déstockage)
          try {
            if (typeof window !== 'undefined' && Array.isArray(window.activeRecipes) && typeof window.calculateRecipeFoodCost === 'function') {
              window.activeRecipes.forEach(r => {
                if (!r) return;
                const ings = r.ingredients || r.tech || [];
                if (ings.length > 0) {
                  const fc = window.calculateRecipeFoodCost(ings, r.sellPrice || 0);
                  r.cost = fc.cost;
                  r.foodCost = fc.foodCost;
                  r.margin = fc.margin;
                  r.grossMarginDH = fc.grossMarginDH;
                }
              });
              if (typeof window.saveRecipes === 'function') { try { window.saveRecipes(); } catch(e){} }
              if (typeof window.renderRecipeList === 'function') { try { window.renderRecipeList(); } catch(e){} }
              if (typeof window.renderSummaryTable === 'function') { try { window.renderSummaryTable(); } catch(e){} }
              if (typeof window.recalculateCurrentView === 'function') { try { window.recalculateCurrentView(); } catch(e){} }
            }
          } catch(eRecalc) {
            console.warn('[GC_Supabase] Recalcul recettes déstockage non bloquant:', eRecalc.message);
          }

          // Recalculer pour le comparateur si présent (Normes & Comparateur)
          try {
            if (typeof window !== 'undefined' && typeof window.initData === 'function') {
              window.initData();
              if (typeof window.renderRecipeCards === 'function') { try { window.renderRecipeCards(); } catch(e){} }
              if (typeof window.renderSummaryKPIs === 'function') { try { window.renderSummaryKPIs(); } catch(e){} }
              if (typeof window.updateSummaryTable === 'function') { try { window.updateSummaryTable(); } catch(e){} }
            } else if (typeof window !== 'undefined' && Array.isArray(window.allRecipes) && typeof window.calculateRecipeFoodCost === 'function') {
              window.allRecipes.forEach(r => {
                if (!r) return;
                const ings = (r.greyCorner && r.greyCorner.tech) || r.tech || r.ingredients || [];
                if (ings.length > 0) {
                  const fc = window.calculateRecipeFoodCost(ings, r.sellPrice || 0);
                  r.cost = fc.cost;
                  r.foodCost = fc.foodCost;
                  r.margin = fc.margin;
                  r.grossMarginDH = fc.grossMarginDH;
                  if (r.greyCorner) {
                    r.greyCorner.cost = fc.cost;
                    r.greyCorner.foodCost = fc.foodCost;
                    r.greyCorner.margin = fc.margin;
                    r.greyCorner.grossMarginDH = fc.grossMarginDH;
                  }
                }
              });
              if (typeof window.renderRecipeCards === 'function') { try { window.renderRecipeCards(); } catch(e){} }
              if (typeof window.renderSummaryKPIs === 'function') { try { window.renderSummaryKPIs(); } catch(e){} }
              if (typeof window.updateSummaryTable === 'function') { try { window.updateSummaryTable(); } catch(e){} }
            }
          } catch(eComp) {
            console.warn('[GC_Supabase] Recalcul comparateur non bloquant:', eComp.message);
          }

          // Notifier immédiatement les vues et fiches ouvertes (Mercuriale)
          try {
            if (global.GC_PricesModal) {
              if (typeof global.GC_PricesModal.isOpen === 'function' && global.GC_PricesModal.isOpen() && typeof global.GC_PricesModal.renderTable === 'function') {
                global.GC_PricesModal.renderTable();
              }
              if (typeof global.GC_PricesModal.notify === 'function') {
                global.GC_PricesModal.notify();
              }
            }
          } catch(eModal) {
            console.warn('[GC_PricesModal] Notification modale:', eModal.message);
          }
          return true;
        }
        return false;
      } catch (err) {
        console.warn('[GC_Supabase] Synchronisation matières cloud ignorée:', err.message);
        return false;
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
        const res = await this.fetchWithFallback(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates' },
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
        const res = await this.fetchWithFallback(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates' },
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
          const res = await this.fetchWithFallback(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates' },
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
        const url = SUPABASE_CONFIG.url + '/rest/v1/recipes?is_active=eq.true&select=*&order=updated_at.asc&_ts=' + Date.now();
        const res = await this.fetchWithFallback(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          console.log('[GC_Supabase] ' + data.length + ' fiches techniques récupérées depuis Supabase Cloud.');

          // Dédupliquer par nom normalisé : le plus récent l'emporte toujours
          const latestMap = new Map();
          data.forEach(cloudR => {
            if (!cloudR || !cloudR.name) return;
            const cleanName = (typeof global.cleanText === 'function') ? global.cleanText(cloudR.name) : cloudR.name.toLowerCase().trim();
            latestMap.set(cleanName, cloudR);
          });

          // 1. Mettre à jour activeRecipes (consommation.html)
          if (typeof window !== 'undefined') {
            if (!Array.isArray(window.activeRecipes)) window.activeRecipes = [];
            let updatedCount = 0;
            let addedCount = 0;

            latestMap.forEach((cloudR, cleanName) => {
              const idx = window.activeRecipes.findIndex(r => r && (r.id === cloudR.id || ((typeof global.cleanText === 'function') && global.cleanText(r.name) === cleanName)));
              const ingList = Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : [];
              const sPrice = Number(cloudR.sell_price) || 0;
              let cost = Number(cloudR.cost) || 0;
              let fc = Number(cloudR.food_cost) || 0;
              let gm = Number(cloudR.gross_margin) || 0;

              // Recalculer Food Cost précis si le moteur est prêt
              if (typeof global.calculateRecipeFoodCost === 'function' && ingList.length > 0) {
                const calc = global.calculateRecipeFoodCost(ingList, sPrice);
                cost = calc.cost;
                fc = calc.foodCost;
                gm = calc.grossMarginDH;
              }

              if (idx >= 0) {
                const target = window.activeRecipes[idx];
                target.id = cloudR.id || target.id;
                target.name = cloudR.name;
                target.category = cloudR.category || target.category || 'AUTRE';
                target.ingredients = ingList.slice();
                target.tech = ingList.slice();
                target.sellPrice = sPrice;
                target.cost = cost;
                target.foodCost = fc;
                target.grossMarginDH = gm;
                updatedCount++;
              } else {
                window.activeRecipes.push({
                  id: cloudR.id || ('rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)),
                  name: cloudR.name,
                  category: cloudR.category || 'AUTRE',
                  ingredients: ingList.slice(),
                  tech: ingList.slice(),
                  sellPrice: sPrice,
                  cost: cost,
                  foodCost: fc,
                  grossMarginDH: gm
                });
                addedCount++;
              }
            });

            // Reconstruire l'index de recherche par nom
            if (typeof global.cleanText === 'function') {
              window.recipeNameIndex = new Map();
              window.activeRecipes.forEach(r => {
                if (r && r.name) window.recipeNameIndex.set(global.cleanText(r.name), r);
              });
            }

            // Persistance locale immédiate (offline-first & anti-reload wipe)
            if (typeof window.saveRecipes === 'function') {
              window.saveRecipes();
            } else if (typeof localStorage !== 'undefined') {
              localStorage.setItem('gc_recipes_db_v5', JSON.stringify(window.activeRecipes));
            }

            // Mettre à jour window.DATA et window.CATEGORIES_DATA
            const allData = window.CATEGORIES_DATA || window.DATA || [];
            if (Array.isArray(allData)) {
              latestMap.forEach((cloudR, cleanName) => {
                let found = false;
                for (const cat of allData) {
                  const it = (cat.items || []).find(i => (typeof global.cleanText === 'function') && global.cleanText(i.name) === cleanName);
                  if (it) {
                    it.tech = Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : it.tech;
                    it.ingredients = it.tech.slice();
                    it.sellPrice = Number(cloudR.sell_price) || it.sellPrice || 0;
                    it.price = it.sellPrice + ' DH';
                    it.cost = Number(cloudR.cost) || it.cost || 0;
                    it.foodCost = Number(cloudR.food_cost) || it.foodCost || 0;
                    it.grossMarginDH = Number(cloudR.gross_margin) || it.grossMarginDH || 0;
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  let targetCat = allData.find(c => c.category === cloudR.category) || allData.find(c => c.category === 'AUTRE') || allData[0];
                  if (targetCat) {
                    if (!targetCat.items) targetCat.items = [];
                    targetCat.items.push({
                      name: cloudR.name,
                      image: 'images/placeholder.svg',
                      prepTime: 5,
                      tech: Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : [],
                      ingredients: Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : [],
                      price: (cloudR.sell_price || 0) + ' DH',
                      sellPrice: Number(cloudR.sell_price) || 0,
                      cost: Number(cloudR.cost) || 0,
                      foodCost: Number(cloudR.food_cost) || 0,
                      grossMarginDH: Number(cloudR.gross_margin) || 0
                    });
                  }
                }
              });
            }

            // Rafraîchir les vues du Cockpit
            try {
              if (typeof window.renderRecipeList === 'function') window.renderRecipeList();
              if (typeof window.recalculateCurrentView === 'function') window.recalculateCurrentView();
              if (typeof window.renderSummaryTable === 'function') window.renderSummaryTable();
            } catch(eViews) {
              console.warn('[GC_Supabase] Rendu vues déstockage non bloquant:', eViews.message);
            }
          }

          // 2. Mettre à jour le comparateur si présent (comparateur.html)
          if (typeof window !== 'undefined') {
            if (window.editedRecipes) {
              latestMap.forEach((cloudR, cleanName) => {
                window.editedRecipes[cloudR.name] = {
                  tech: (cloudR.ingredients || []).slice(),
                  sellPrice: Number(cloudR.sell_price) || 0,
                  updatedAt: Date.now()
                };
              });
              try {
                localStorage.setItem('grey_corner_custom_recipes_v5', JSON.stringify(window.editedRecipes));
              } catch(e) {}
            }
            try {
              if (typeof window.initData === 'function') window.initData();
              if (typeof window.renderRecipeCards === 'function') window.renderRecipeCards();
              if (typeof window.renderSummaryKPIs === 'function') window.renderSummaryKPIs();
              if (typeof window.updateSummaryTable === 'function') window.updateSummaryTable();
            } catch(eCompViews) {
              console.warn('[GC_Supabase] Rendu vues comparateur non bloquant:', eCompViews.message);
            }
          }
          return true;
        }
        return false;
      } catch (err) {
        console.warn('[GC_Supabase] Synchronisation fiches cloud ignorée:', err.message);
        return false;
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

        // Nettoyer d'éventuels doublons historiques avec le même nom
        try {
          const checkUrl = SUPABASE_CONFIG.url + '/rest/v1/recipes?name=eq.' + encodeURIComponent(recipeObj.name) + '&id=neq.' + encodeURIComponent(id);
          await this.fetchWithFallback(checkUrl, { method: 'DELETE' });
        } catch(delErr) {}

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

        const res = await this.fetchWithFallback(SUPABASE_CONFIG.url + '/rest/v1/recipes', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates' },
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
        const res = await this.fetchWithFallback(url, {
          method: 'DELETE'
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
          const res = await this.fetchWithFallback(SUPABASE_CONFIG.url + '/rest/v1/recipes', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates' },
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
          await this.fetchWithFallback(SUPABASE_CONFIG.url + '/rest/v1/recipes', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates' },
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
     * Sauvegarde une journée de ventes (clôture caisse) vers Supabase Cloud
     */
    saveDailySalesToCloud: async function(saleDate, totalRevenue, totalItems, items, totalTickets) {
      try {
        if (!saleDate) return false;
        const payload = [{
          sale_date: saleDate,
          total_revenue: typeof totalRevenue === 'number' ? totalRevenue : parseFloat(totalRevenue) || 0,
          total_tickets: totalTickets || 0,
          total_items: typeof totalItems === 'number' ? totalItems : parseInt(totalItems, 10) || 0,
          items: Array.isArray(items) ? items : [],
          created_at: new Date().toISOString()
        }];
        const res = await this.fetchWithFallback(SUPABASE_CONFIG.url + '/rest/v1/daily_sales', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          console.log(`[GC_Supabase] Ventes du ${saleDate} enregistrées dans Supabase Cloud (${payload[0].total_revenue} DH).`);
        }
        return res.ok;
      } catch (err) {
        console.error('[GC_Supabase] Erreur sauvegarde daily_sales:', err);
        return false;
      }
    },

    /**
     * Récupère l'historique des ventes journalières depuis Supabase Cloud
     */
    syncDailySalesFromCloud: async function(limit = 365) {
      try {
        const res = await this.fetchWithFallback(SUPABASE_CONFIG.url + `/rest/v1/daily_sales?select=*&order=sale_date.desc&limit=${limit}`);
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.warn('[GC_Supabase] Impossible de récupérer daily_sales:', err.message);
        return [];
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
          .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_sales' }, payload => {
            console.log('[GC_Supabase Realtime] Clôture de ventes reçue:', payload);
            if (payload.new && payload.new.sale_date) {
              const d = payload.new;
              if (typeof window !== 'undefined' && window.monthlySalesDB) {
                window.monthlySalesDB[d.sale_date] = (Array.isArray(d.items) ? d.items : []).map(it => ({
                  family: it.cat || it.family || 'Général',
                  product: it.name || it.product,
                  price: it.price || 0,
                  qty: it.qty || 1,
                  total: it.ca || it.total || ((it.qty || 1) * (it.price || 0))
                }));
                if (typeof window.saveMonthlySalesDB === 'function') window.saveMonthlySalesDB();
                if (typeof window.renderCalendar === 'function') window.renderCalendar();
                if (typeof window.recalculateCurrentView === 'function') window.recalculateCurrentView();
              }
              if (global.GC_Toast) {
                global.GC_Toast.show(`📅 Ventes du ${payload.new.sale_date} synchronisées (${payload.new.total_revenue} DH)`, 'info');
              }
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'ingredient_costs' }, payload => {
            console.log('[GC_Supabase Realtime] Mise à jour prix détectée:', payload);
            if (payload.new && payload.new.id) {
              if (!global.INGREDIENT_UNIT_COSTS) global.INGREDIENT_UNIT_COSTS = {};
              const costVal = Number(payload.new.cost) || 0;
              const unitVal = payload.new.unit || 'kg';
              const labelVal = payload.new.label || payload.new.id;

              global.INGREDIENT_UNIT_COSTS[payload.new.id] = {
                cost: costVal,
                unit: unitVal,
                label: labelVal
              };

              if (typeof global.cleanText === 'function') {
                const cK = global.cleanText(payload.new.id);
                if (cK && cK !== payload.new.id) {
                  global.INGREDIENT_UNIT_COSTS[cK] = {
                    cost: costVal,
                    unit: unitVal,
                    label: labelVal
                  };
                }
              }

              if (global.GC_Store && typeof global.GC_Store.saveCustomPrices === 'function') {
                global.GC_Store.saveCustomPrices(global.INGREDIENT_UNIT_COSTS);
              } else if (typeof localStorage !== 'undefined') {
                localStorage.setItem('gc_ingredient_prices_v1', JSON.stringify(global.INGREDIENT_UNIT_COSTS));
              }

              // Recalculer le Food Cost de toutes les recettes actives en mémoire (Déstockage)
              if (typeof window !== 'undefined' && Array.isArray(window.activeRecipes) && typeof window.calculateRecipeFoodCost === 'function') {
                window.activeRecipes.forEach(r => {
                  if (!r) return;
                  const ings = r.ingredients || r.tech || [];
                  if (ings.length > 0) {
                    const fc = window.calculateRecipeFoodCost(ings, r.sellPrice || 0);
                    r.cost = fc.cost;
                    r.foodCost = fc.foodCost;
                    r.margin = fc.margin;
                    r.grossMarginDH = fc.grossMarginDH;
                  }
                });
                if (typeof window.saveRecipes === 'function') window.saveRecipes();
                if (typeof window.renderRecipeList === 'function') window.renderRecipeList();
                if (typeof window.renderSummaryTable === 'function') window.renderSummaryTable();
                if (typeof window.recalculateCurrentView === 'function') window.recalculateCurrentView();
              }

              // Recalculer pour le comparateur si présent
              if (typeof window !== 'undefined') {
                if (typeof window.initData === 'function') window.initData();
                if (typeof window.renderRecipeCards === 'function') window.renderRecipeCards();
                if (typeof window.renderSummaryKPIs === 'function') window.renderSummaryKPIs();
                if (typeof window.updateSummaryTable === 'function') window.updateSummaryTable();
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
            if (payload.new && payload.new.name && typeof window !== 'undefined') {
              const r = payload.new;
              const ingList = Array.isArray(r.ingredients) ? r.ingredients.slice() : [];
              const sPrice = Number(r.sell_price) || 0;
              let cost = Number(r.cost) || 0;
              let fc = Number(r.food_cost) || 0;
              let gm = Number(r.gross_margin) || 0;

              if (typeof global.calculateRecipeFoodCost === 'function' && ingList.length > 0) {
                const calc = global.calculateRecipeFoodCost(ingList, sPrice);
                cost = calc.cost;
                fc = calc.foodCost;
                gm = calc.grossMarginDH;
              }

              const recipeObj = {
                id: r.id,
                name: r.name,
                category: r.category || 'AUTRE',
                ingredients: ingList.slice(),
                tech: ingList.slice(),
                sellPrice: sPrice,
                cost: cost,
                foodCost: fc,
                grossMarginDH: gm
              };

              // 1. Déstockage (activeRecipes)
              if (Array.isArray(window.activeRecipes)) {
                const idx = window.activeRecipes.findIndex(x => x && (x.id === r.id || ((typeof global.cleanText === 'function') && global.cleanText(x.name) === global.cleanText(r.name))));
                if (idx >= 0) {
                  window.activeRecipes[idx] = recipeObj;
                } else {
                  window.activeRecipes.push(recipeObj);
                }

                if (typeof global.cleanText === 'function') {
                  if (!window.recipeNameIndex) window.recipeNameIndex = new Map();
                  window.recipeNameIndex.set(global.cleanText(r.name), recipeObj);
                }

                if (typeof window.saveRecipes === 'function') window.saveRecipes();
                if (typeof window.renderRecipeList === 'function') window.renderRecipeList();
                if (typeof window.renderSummaryTable === 'function') window.renderSummaryTable();
                if (typeof window.recalculateCurrentView === 'function') window.recalculateCurrentView();
              }

              // 2. DATA & CATEGORIES_DATA
              const allData = window.CATEGORIES_DATA || window.DATA || [];
              if (Array.isArray(allData)) {
                const cleanRName = (typeof global.cleanText === 'function') ? global.cleanText(r.name) : r.name.toLowerCase().trim();
                let foundInCat = false;
                for (const cat of allData) {
                  const it = (cat.items || []).find(i => (typeof global.cleanText === 'function') && global.cleanText(i.name) === cleanRName);
                  if (it) {
                    it.tech = ingList.slice();
                    it.ingredients = ingList.slice();
                    it.sellPrice = sPrice;
                    it.price = sPrice + ' DH';
                    it.cost = cost;
                    it.foodCost = fc;
                    it.grossMarginDH = gm;
                    foundInCat = true;
                    break;
                  }
                }
                if (!foundInCat) {
                  const targetCat = allData.find(c => c.category === r.category) || allData[0];
                  if (targetCat) {
                    if (!targetCat.items) targetCat.items = [];
                    targetCat.items.push({
                      name: r.name,
                      image: 'images/placeholder.svg',
                      prepTime: 5,
                      tech: ingList.slice(),
                      ingredients: ingList.slice(),
                      price: sPrice + ' DH',
                      sellPrice: sPrice,
                      cost: cost,
                      foodCost: fc,
                      grossMarginDH: gm
                    });
                  }
                }
              }

              // 3. Comparateur
              if (typeof window.initData === 'function') window.initData();
              if (typeof window.renderRecipeCards === 'function') window.renderRecipeCards();
              if (typeof window.renderSummaryKPIs === 'function') window.renderSummaryKPIs();
              if (typeof window.updateSummaryTable === 'function') window.updateSummaryTable();

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
