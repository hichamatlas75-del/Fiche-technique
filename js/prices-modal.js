/**
 * GREY CORNER — Composant Partagé de Gestion des Prix d'Achat (Mercuriale)
 * Utilisable universellement dans consommation.html, comparateur.html, audit.html et index.html
 */

(function(global) {
  'use strict';

  let modalEl = null;
  let onUpdateCallbacks = [];

  function registerPricesUpdateCallback(cb) {
    if (typeof cb === 'function' && !onUpdateCallbacks.includes(cb)) {
      onUpdateCallbacks.push(cb);
    }
  }

  function ensureModalDOM() {
    if (document.getElementById('gc-prices-modal-root')) return;

    const modalHTML = `
    <div id="gc-prices-modal-root" class="modal-overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:9999; justify-content:center; align-items:center; backdrop-filter:blur(4px); padding:10px;">
      <div class="modal-box gc-prices-modal-box" style="max-width:900px; width:100%; max-height:92vh; display:flex; flex-direction:column; background:var(--paper, #fff); color:var(--text, #0f172a); border-radius:16px; border:1px solid var(--border, #e2e8f0); box-shadow:0 20px 25px -5px rgba(0,0,0,0.3); overflow:hidden;">
        
        <!-- EN-TÊTE DE LA MODALE -->
        <div style="padding:14px 18px; border-bottom:1px solid var(--border, #e2e8f0); display:flex; justify-content:space-between; align-items:center; background:var(--thead-bg, #f8fafc);">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:20px;">💲</span>
            <div>
              <h3 style="margin:0; font-size:15px; font-weight:800; color:var(--text, #0f172a);">Mercuriale & Prix d'Achat Matières</h3>
              <span id="gc-prices-count-badge" style="font-size:11px; color:var(--muted, #64748b); font-weight:600;">Chargement des matières...</span>
            </div>
          </div>
          <button type="button" style="background:none; border:none; font-size:22px; color:var(--muted, #64748b); cursor:pointer; padding:4px 8px; min-height:40px; min-width:40px; display:flex; align-items:center; justify-content:center;" onclick="window.GC_PricesModal.close()">✕</button>
        </div>

        <!-- CORPS DE LA MODALE -->
        <div style="padding:14px 16px; overflow-y:auto; flex:1; -webkit-overflow-scrolling:touch;">
          
          <!-- TOOLBAR : RECHERCHE & AJOUT -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px; flex-wrap:wrap;">
            <div style="flex:1; min-width:200px; position:relative;">
              <input type="search" id="gc-prices-search" placeholder="🔍 Rechercher (poulet, huile, avocat...)" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid var(--border, #e2e8f0); background:var(--bg, #f8fafc); color:var(--text, #0f172a); font-size:16px;" oninput="window.GC_PricesModal.filterTable()" />
            </div>
            <button type="button" class="btn btn-primary" style="padding:8px 14px; font-size:13px; font-weight:700; background:#0284c7; color:#fff; border:none; border-radius:8px; cursor:pointer; min-height:40px;" onclick="window.GC_PricesModal.toggleAddForm()">
              ➕ Ajouter une Matière
            </button>
          </div>

          <!-- FORMULAIRE NOUVELLE MATIÈRE -->
          <div id="gc-prices-add-form" style="display:none; background:rgba(2, 132, 199, 0.05); border:1px solid rgba(2, 132, 199, 0.25); border-radius:10px; padding:14px; margin-bottom:14px;">
            <h4 style="margin:0 0 10px 0; font-size:13px; font-weight:800; color:#0284c7;">Ajouter un nouvel ingrédient à la mercuriale</h4>
            <div class="gc-prices-add-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:10px; align-items:end;">
              <div style="grid-column: span 1;">
                <label style="font-size:11px; font-weight:700; color:var(--muted, #64748b); display:block; margin-bottom:3px;">Nom Ingrédient</label>
                <input type="text" id="gc-new-price-name" placeholder="Ex: Avocat Hass..." style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid var(--border, #e2e8f0); background:var(--paper, #fff); color:var(--text, #0f172a); font-size:16px;" />
              </div>
              <div>
                <label style="font-size:11px; font-weight:700; color:var(--muted, #64748b); display:block; margin-bottom:3px;">Unité d'achat</label>
                <select id="gc-new-price-unit" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid var(--border, #e2e8f0); background:var(--paper, #fff); color:var(--text, #0f172a); font-size:16px;">
                  <option value="kg">kg (Kilo)</option>
                  <option value="l">L (Litre)</option>
                  <option value="p">p (Pièce / Btl)</option>
                </select>
              </div>
              <div>
                <label style="font-size:11px; font-weight:700; color:var(--muted, #64748b); display:block; margin-bottom:3px;">Prix Achat HT (DH)</label>
                <input type="number" step="0.1" id="gc-new-price-val" placeholder="Ex: 55.00" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid var(--border, #e2e8f0); background:var(--paper, #fff); color:var(--text, #0f172a); font-weight:800; font-size:16px;" />
              </div>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn btn-success" style="padding:8px 14px; background:#16a34a; color:#fff; border:none; border-radius:6px; font-weight:800; cursor:pointer; min-height:40px; flex:1;" onclick="window.GC_PricesModal.confirmAdd()">Valider</button>
                <button type="button" class="btn" style="padding:8px 12px; border-radius:6px; cursor:pointer; min-height:40px;" onclick="window.GC_PricesModal.toggleAddForm()">✕</button>
              </div>
            </div>
          </div>

          <!-- TABLEAU DÉFILABLE DES PRIX -->
          <div style="max-height:450px; overflow:auto; -webkit-overflow-scrolling:touch; border:1px solid var(--border, #e2e8f0); border-radius:10px;">
            <table style="width:100%; border-collapse:collapse; font-size:12.5px; min-width:480px;">
              <thead>
                <tr style="background:var(--thead-bg, #f8fafc); position:sticky; top:0; z-index:2; border-bottom:1.5px solid var(--border, #e2e8f0);">
                  <th style="padding:10px 12px; text-align:left; color:var(--muted, #64748b); font-weight:800; font-size:11px; text-transform:uppercase;">Matière Première</th>
                  <th style="padding:10px 10px; text-align:center; color:var(--muted, #64748b); font-weight:800; font-size:11px; text-transform:uppercase; width:100px;">Unité</th>
                  <th style="padding:10px 12px; text-align:right; color:var(--muted, #64748b); font-weight:800; font-size:11px; text-transform:uppercase; width:130px;">Prix Achat HT</th>
                  <th style="padding:10px 12px; text-align:right; color:var(--muted, #64748b); font-weight:800; font-size:11px; text-transform:uppercase; width:120px;">Coût Unitaire</th>
                </tr>
              </thead>
              <tbody id="gc-prices-table-tbody">
                <!-- Lignes injectées dynamiquement -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- PIED DE LA MODALE -->
        <div style="padding:12px 16px; border-top:1px solid var(--border, #e2e8f0); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:8px; background:var(--thead-bg, #f8fafc);">
          <button type="button" class="btn btn-secondary" style="padding:8px 14px; border-radius:8px; cursor:pointer; min-height:40px;" onclick="window.GC_PricesModal.close()">Fermer</button>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn" style="background:#0284c7; color:#fff; border:none; padding:8px 14px; border-radius:8px; font-weight:700; cursor:pointer; min-height:40px;" onclick="window.GC_PricesModal.downloadRecipesDataJS()" title="Télécharger le fichier recipes-data.js mis à jour pour le commit Git">
              📁 Télécharger .js
            </button>
            <button type="button" class="btn btn-primary" style="background:#16a34a; color:#fff; border:none; padding:8px 18px; border-radius:8px; font-weight:800; cursor:pointer; min-height:40px;" onclick="window.GC_PricesModal.saveAll()">
              💾 Enregistrer les Prix
            </button>
          </div>
        </div>

      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalEl = document.getElementById('gc-prices-modal-root');
  }

  function renderTable(filterQuery = '') {
    const tbody = document.getElementById('gc-prices-table-tbody');
    const countBadge = document.getElementById('gc-prices-count-badge');
    if (!tbody) return;

    const costs = window.INGREDIENT_UNIT_COSTS || {};
    // Assainissement systématique des doublons obsolètes (centralisé dans core-utils)
    const obsoleteKeys = window.OBSOLETE_INGREDIENT_KEYS || new Set();
    obsoleteKeys.forEach(k => { delete costs[k]; });

    const keys = Object.keys(costs).filter(k => !obsoleteKeys.has(k)).sort((a, b) => a.localeCompare(b, 'fr'));
    const q = (filterQuery || '').toLowerCase().trim();

    let matched = 0;
    const rowsHTML = keys.map(k => {
      const def = costs[k];
      if (!def || typeof def.cost !== 'number') return '';
      const label = def.label || (k.charAt(0).toUpperCase() + k.slice(1));
      if (q && !k.toLowerCase().includes(q) && !label.toLowerCase().includes(q)) {
        return '';
      }
      matched++;

      let buyUnit = 'kg';
      let buyPrice = (def.cost * 1000).toFixed(2);
      let unitCostStr = `${def.cost.toFixed(4)} DH/g`;

      if (def.unit === 'ml') {
        buyUnit = 'Litre (L)';
        buyPrice = (def.cost * 1000).toFixed(2);
        unitCostStr = `${def.cost.toFixed(4)} DH/ml`;
      } else if (def.unit === 'piece') {
        buyUnit = 'Pièce (p)';
        buyPrice = def.cost.toFixed(2);
        unitCostStr = `${def.cost.toFixed(2)} DH/u`;
      }

      return `
        <tr style="border-bottom:1px solid var(--border, #e2e8f0);">
          <td style="padding:8px 14px; font-weight:700;">${label} <span style="font-size:10.5px; color:var(--muted, #64748b); font-weight:normal;">(${k})</span></td>
          <td style="padding:8px 14px; text-align:center;"><span style="display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; background:rgba(2, 132, 199, 0.08); color:#0284c7; font-weight:700;">${buyUnit}</span></td>
          <td style="padding:8px 14px; text-align:right;">
            <input type="number" step="0.1" value="${buyPrice}" data-ing-key="${k}" data-unit="${def.unit}" style="width:110px; padding:5px 8px; text-align:right; font-weight:800; border:1px solid var(--border, #e2e8f0); border-radius:6px; background:var(--bg, #f8fafc); color:var(--text, #0f172a);" oninput="window.GC_PricesModal.onPriceInput(this)" />
            <span style="font-size:11px; font-weight:700; color:var(--muted, #64748b); margin-left:4px;">DH</span>
          </td>
          <td style="padding:8px 14px; text-align:right; font-weight:700; color:var(--muted, #64748b);" class="unit-cost-preview">${unitCostStr}</td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHTML || '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--muted, #64748b);">Aucune matière première trouvée.</td></tr>';
    if (countBadge) {
      countBadge.textContent = `${matched} matière(s) affichée(s) sur ${keys.length}`;
    }
  }

  function onPriceInput(input) {
    const row = input.closest('tr');
    const preview = row ? row.querySelector('.unit-cost-preview') : null;
    const unit = input.getAttribute('data-unit');
    const val = parseFloat(input.value) || 0;

    if (preview) {
      if (unit === 'g') {
        preview.textContent = `${(val / 1000).toFixed(4)} DH/g`;
      } else if (unit === 'ml') {
        preview.textContent = `${(val / 1000).toFixed(4)} DH/ml`;
      } else {
        preview.textContent = `${val.toFixed(2)} DH/u`;
      }
    }
  }

  function toggleAddForm() {
    const form = document.getElementById('gc-prices-add-form');
    if (form) {
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
      if (form.style.display === 'block') {
        document.getElementById('gc-new-price-name')?.focus();
      }
    }
  }

  function confirmAdd() {
    const nameInput = document.getElementById('gc-new-price-name');
    const unitInput = document.getElementById('gc-new-price-unit');
    const valInput = document.getElementById('gc-new-price-val');

    const name = (nameInput?.value || '').trim();
    const buyUnit = unitInput?.value || 'kg';
    const buyPrice = parseFloat(valInput?.value) || 0;

    if (!name) {
      // Validation : garder alert() car requiert interaction utilisateur
      alert("Veuillez saisir le nom de l'ingrédient.");
      return;
    }
    if (buyPrice <= 0) {
      alert("Veuillez saisir un prix d'achat valide supérieur à 0.");
      return;
    }

    const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!window.INGREDIENT_UNIT_COSTS) window.INGREDIENT_UNIT_COSTS = {};

    let internalUnit = 'g';
    let unitCost = buyPrice / 1000;
    if (buyUnit === 'l') {
      internalUnit = 'ml';
      unitCost = buyPrice / 1000;
    } else if (buyUnit === 'p') {
      internalUnit = 'piece';
      unitCost = buyPrice;
    }

    window.INGREDIENT_UNIT_COSTS[key] = {
      cost: unitCost,
      unit: internalUnit,
      label: name
    };

    // Sauvegarde immédiate dans GC_Store
    if (global.GC_Store) {
      global.GC_Store.saveCustomPrices(window.INGREDIENT_UNIT_COSTS);
    } else {
      localStorage.setItem('gc_ingredient_prices_v1', JSON.stringify(window.INGREDIENT_UNIT_COSTS));
    }

    nameInput.value = '';
    valInput.value = '';
    toggleAddForm();
    renderTable();
    notifyCallbacks();
    // AM-02 FIX : Toast non bloquant au lieu de alert()
    if (window.GC_Toast) {
      window.GC_Toast.show(`Ingrédient "${name}" ajouté à la mercuriale !`, 'success');
    } else {
      alert(`✅ Ingrédient "${name}" ajouté à la mercuriale avec succès !`);
    }
  }

  function saveAll() {
    const inputs = document.querySelectorAll('#gc-prices-table-tbody input[data-ing-key]');
    if (!window.INGREDIENT_UNIT_COSTS) window.INGREDIENT_UNIT_COSTS = {};

    inputs.forEach(inp => {
      const k = inp.getAttribute('data-ing-key');
      const unit = inp.getAttribute('data-unit');
      const buyPrice = parseFloat(inp.value) || 0;

      if (window.INGREDIENT_UNIT_COSTS[k]) {
        if (unit === 'g' || unit === 'ml') {
          window.INGREDIENT_UNIT_COSTS[k].cost = buyPrice / 1000;
        } else {
          window.INGREDIENT_UNIT_COSTS[k].cost = buyPrice;
        }
      }
    });

    // Élimination définitive de tous les doublons obsolètes (BUG-04 FIX : liste centralisée)
    const obsoleteKeys = window.OBSOLETE_INGREDIENT_KEYS || new Set();
    obsoleteKeys.forEach(k => {
      delete window.INGREDIENT_UNIT_COSTS[k];
    });

    if (global.GC_Store) {
      global.GC_Store.saveCustomPrices(window.INGREDIENT_UNIT_COSTS);
    } else {
      localStorage.setItem('gc_ingredient_prices_v1', JSON.stringify(window.INGREDIENT_UNIT_COSTS));
    }

    notifyCallbacks();
    // AM-02 FIX : Toast non bloquant
    if (window.GC_Toast) {
      window.GC_Toast.show('Prix des matières enregistrés ! Food Costs recalculés.', 'success');
    } else {
      alert("💾 Prix des matières premières enregistrés ! Les Food Costs et marges ont été recalculés en direct.");
    }
    // BUG-03 FIX : close() résolvait vers window.close() natif dans l'IIFE — fermeture explicite
    if (modalEl) modalEl.style.display = 'none';
  }


  function notifyCallbacks() {
    onUpdateCallbacks.forEach(cb => {
      try { cb(); } catch(e) { console.warn('[PricesModal Callback]', e); }
    });
  }

  function downloadRecipesDataJS() {
    try {
      const data = window.CATEGORIES_DATA || window.DATA || [];
      const base = window.BASE_RECIPES || [];
      const alias = window.ALIAS_MAP || {};
      const cat = window.INGREDIENT_CATEGORIES || {};
      const costs = window.INGREDIENT_UNIT_COSTS || {};
      const fnStr = (window.calculateRecipeFoodCost || function(){}).toString();

      let content = `/**\n * GREY CORNER — Base de données centralisée des Fiches Techniques et Recettes\n * Mise à jour le ${new Date().toISOString()}\n */\n\n(function(global) {\n`;
      content += `const DATA = ${JSON.stringify(data, null, 2)};\n\n`;
      content += `const BASE_RECIPES = ${JSON.stringify(base, null, 2)};\n\n`;
      content += `const ALIAS_MAP = ${JSON.stringify(alias, null, 2)};\n\n`;
      content += `const INGREDIENT_CATEGORIES = ${JSON.stringify(cat, null, 2)};\n\n`;
      content += `const INGREDIENT_UNIT_COSTS = ${JSON.stringify(costs, null, 2)};\n\n`;
      content += `${fnStr}\n\n`;
      content += `global.CATEGORIES_DATA = DATA;\nglobal.DATA = DATA;\nglobal.BASE_RECIPES = BASE_RECIPES;\nglobal.ALIAS_MAP = ALIAS_MAP;\nglobal.INGREDIENT_CATEGORIES = INGREDIENT_CATEGORIES;\nglobal.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\nglobal.calculateRecipeFoodCost = calculateRecipeFoodCost;\nif (typeof window !== 'undefined') {\n  window.calculateRecipeFoodCost = calculateRecipeFoodCost;\n  window.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\n  window.DATA = DATA;\n  window.CATEGORIES_DATA = DATA;\n  window.BASE_RECIPES = BASE_RECIPES;\n}\n})(typeof window !== 'undefined' ? window : globalThis);\n`;

      const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "recipes-data.js";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erreur export recipes-data.js : " + err.message);
    }
  }

  function open() {
    ensureModalDOM();
    modalEl = document.getElementById('gc-prices-modal-root');
    if (modalEl) {
      modalEl.style.display = 'flex';
      renderTable();
      document.getElementById('gc-prices-search')?.focus();
    }
  }

  function close() {
    if (modalEl) modalEl.style.display = 'none';
  }

  function filterTable() {
    const q = document.getElementById('gc-prices-search')?.value || '';
    renderTable(q);
  }

  const GC_PricesModal = {
    open: open,
    close: close,
    filterTable: filterTable,
    toggleAddForm: toggleAddForm,
    confirmAdd: confirmAdd,
    saveAll: saveAll,
    onPriceInput: onPriceInput,
    downloadRecipesDataJS: downloadRecipesDataJS,
    onUpdate: registerPricesUpdateCallback
  };

  global.GC_PricesModal = GC_PricesModal;
  global.openPricesModal = open;
  global.closePricesModal = close;

  // Auto-init custom prices on load
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('gc_ingredient_prices_v1');
      if (saved && window.INGREDIENT_UNIT_COSTS) {
        Object.assign(window.INGREDIENT_UNIT_COSTS, JSON.parse(saved));
      }
    } catch(e){}
  }
})(typeof window !== 'undefined' ? window : globalThis);
