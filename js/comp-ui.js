/**
 * GREY CORNER — Rendu des Cartes Comparatives & Tableau Synthétique
 * Module: comp-ui.js
 */

var isComparatorTableView = false;
var currentComparatorMainView = 'recipes'; // 'recipes', 'ai', 'table'

  window.setComparatorMainView = function(viewName) {
    currentComparatorMainView = viewName;
    const aiWrapper = document.getElementById('ai-agent-wrapper');
    const toolbar = document.getElementById('comp-toolbar-panel');
    const cardsContainer = document.getElementById('recipes-comparator-container');
    const tableContainer = document.getElementById('comparator-table-container');

    // Mettre à jour les boutons du sélecteur de vues
    document.querySelectorAll('.comp-view-tab').forEach(b => {
      if (b.id === `btn-view-${viewName}`) {
        b.classList.add('is-active');
      } else {
        b.classList.remove('is-active');
      }
    });

    // Mettre à jour les items du drawer
    document.querySelectorAll('.gc-drawer-nav-item[data-comp-view]').forEach(item => {
      if (item.getAttribute('data-comp-view') === viewName) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });

    if (viewName === 'ai') {
      if (aiWrapper) aiWrapper.style.display = 'block';
      if (toolbar) toolbar.style.display = 'none';
      if (cardsContainer) cardsContainer.style.display = 'none';
      if (tableContainer) tableContainer.style.display = 'none';
      renderAIOptimizerAgent();
      if (aiWrapper && typeof aiWrapper.scrollIntoView === 'function') {
        aiWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (viewName === 'table') {
      if (aiWrapper) aiWrapper.style.display = 'none';
      if (toolbar) toolbar.style.display = 'block';
      if (cardsContainer) cardsContainer.style.display = 'none';
      if (tableContainer) tableContainer.style.display = 'block';
      isComparatorTableView = true;
      const btn = document.getElementById('btn-toggle-comp-view');
      if (btn) btn.innerHTML = '📋 Vue : Cartes Comparatives';
      renderComparatorTable();
    } else { // 'recipes'
      if (aiWrapper) aiWrapper.style.display = 'none';
      if (toolbar) toolbar.style.display = 'block';
      if (cardsContainer) cardsContainer.style.display = 'grid';
      if (tableContainer) tableContainer.style.display = 'none';
      isComparatorTableView = false;
      const btn = document.getElementById('btn-toggle-comp-view');
      if (btn) btn.innerHTML = '📊 Vue : Tableau Synthétique';
      renderRecipeCards();
    }
  };

  window.setComparatorMainViewAndClose = function(viewName) {
    window.setComparatorMainView(viewName);
    if (window.GC_BurgerMenu) window.GC_BurgerMenu.close();
  };

  window.setCategoryFromDrawer = function(cat) {
    currentCategory = cat;
    window.setComparatorMainView('recipes');
    document.querySelectorAll('.cat-pill').forEach(pill => {
      if (pill.dataset.cat === cat) {
        pill.classList.add('active');
        if (typeof pill.scrollIntoView === 'function') {
          pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      } else {
        pill.classList.remove('active');
      }
    });
    renderRecipeCards();
    if (window.GC_BurgerMenu) window.GC_BurgerMenu.close();
  };

  window.toggleGainsFilterAndClose = function() {
    onlyGainsFilter = !onlyGainsFilter;
    const filterGainBtn = document.getElementById('btn-filter-gains');
    if (filterGainBtn) filterGainBtn.classList.toggle('active', onlyGainsFilter);
    window.setComparatorMainView('recipes');
    renderRecipeCards();
    if (window.GC_BurgerMenu) window.GC_BurgerMenu.close();
  };

  window.toggleCompKpis = function() {
    const kpiEl = document.getElementById('summary-kpis');
    if (kpiEl) {
      kpiEl.style.display = kpiEl.style.display === 'none' ? 'grid' : 'none';
    }
    if (window.GC_BurgerMenu) window.GC_BurgerMenu.close();
  };

  window.toggleComparatorViewMode = function() {
    if (currentComparatorMainView === 'table') {
      window.setComparatorMainView('recipes');
    } else {
      window.setComparatorMainView('table');
    }
  };

  function renderComparatorTable() {
    const container = document.getElementById('comparator-table-container');
    if (!container) return;
var filtered = allRecipes.filter(r => {
      const matchCat = currentCategory === 'ALL' || r.category === currentCategory;
      const matchSearch = !searchQuery || 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.greyCorner.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchGains = !onlyGainsFilter || r.standard.diffDH >= 3.0;
      return matchCat && matchSearch && matchGains;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-muted);">Aucun plat trouvé dans cette vue.</div>';
      return;
    }
var rowsHTML = filtered.map((recipe, idx) => {
      const gcFCColor = recipe.greyCorner.foodCost <= 32 ? '#16a34a' : (recipe.greyCorner.foodCost <= 38 ? '#d97706' : '#dc2626');
      const stdFCColor = recipe.standard.foodCost <= 32 ? '#16a34a' : (recipe.standard.foodCost <= 38 ? '#d97706' : '#dc2626');
      const diffColor = recipe.standard.diffDH > 0 ? '#0284c7' : '#64748b';

      return `
        <tr style="border-bottom:1px solid var(--border); transition:background 0.15s;">
          <td style="padding:12px 14px; font-weight:800; color:var(--text);">${escapeHtml(recipe.name)}</td>
          <td style="padding:12px 14px; color:var(--text-muted); font-size:12px;">${escapeHtml(recipe.category)}</td>
          <td style="padding:12px 14px; text-align:right; font-weight:700;">${recipe.sellPrice.toFixed(2)} DH</td>
          <td style="padding:12px 14px; text-align:right; font-weight:800;">
            ${recipe.greyCorner.cost.toFixed(2)} DH
            <span style="display:inline-block; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:4px; font-weight:800; background:rgba(${recipe.greyCorner.foodCost <= 32 ? '22,163,74,0.12' : (recipe.greyCorner.foodCost <= 38 ? '217,119,6,0.12' : '220,38,38,0.12')}); color:${gcFCColor};">
              ${recipe.greyCorner.foodCost}%
            </span>
          </td>
          <td style="padding:12px 14px; text-align:right; font-weight:700; color:var(--text-muted);">
            ${recipe.standard.cost.toFixed(2)} DH
            <span style="display:inline-block; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:4px; font-weight:700; color:${stdFCColor};">
              ${recipe.standard.foodCost}%
            </span>
          </td>
          <td style="padding:12px 14px; text-align:right; font-weight:800; color:${diffColor};">
            ${recipe.standard.diffDH > 0 ? '+' : ''}${recipe.standard.diffDH.toFixed(2)} DH
          </td>
          <td style="padding:12px 14px; text-align:center;">
            <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
              <button class="btn btn-secondary" id="btn-table-drawer-${idx}" style="padding:5px 8px; font-size:11.5px; font-weight:700; border-radius:6px; cursor:pointer;" onclick="window.toggleTableRowDrawer(${idx})">
                📂 Détails
              </button>
              <button class="btn btn-secondary" style="padding:5px 8px; font-size:11.5px; font-weight:700; border-radius:6px; cursor:pointer;" onclick="window.copyStandardToRecipe(${idx})">
                🟢 Standard
              </button>
            </div>
          </td>
        </tr>
        <tr id="table-row-drawer-${idx}" style="display:none; background:var(--bg-subtle, rgba(0,0,0,0.02)); border-bottom:2px solid var(--border);">
          <td colspan="7" style="padding:14px 18px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div style="background:var(--paper); padding:12px; border-radius:8px; border:1px solid var(--border);">
                <div style="font-weight:800; font-size:12.5px; color:#0284c7; margin-bottom:6px;">
                  🔵 Détail Coût Grey Corner (${recipe.greyCorner.cost.toFixed(2)} DH)
                </div>
                ${renderPortionCostBreakdownHTML(recipe.greyCorner.tech, recipe.sellPrice, 'gc', idx)}
              </div>
              <div style="background:var(--paper); padding:12px; border-radius:8px; border:1px solid var(--border);">
                <div style="font-weight:800; font-size:12.5px; color:#16a34a; margin-bottom:6px;">
                  🟢 Détail Coût Standard Int. (${recipe.standard.cost.toFixed(2)} DH)
                </div>
                ${renderPortionCostBreakdownHTML(recipe.standard.tech, recipe.sellPrice, 'std', idx)}
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:var(--thead-bg, #f8fafc); border-bottom:1.5px solid var(--border); text-transform:uppercase; font-size:11px; font-weight:800; color:var(--text-muted);">
            <th style="padding:12px 14px; text-align:left;">Plat / Recette</th>
            <th style="padding:12px 14px; text-align:left;">Catégorie</th>
            <th style="padding:12px 14px; text-align:right;">Prix Vente</th>
            <th style="padding:12px 14px; text-align:right;">Coût Grey Corner</th>
            <th style="padding:12px 14px; text-align:right;">Coût Standard Int.</th>
            <th style="padding:12px 14px; text-align:right;">Écart DH</th>
            <th style="padding:12px 14px; text-align:center;">Action Rapide</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    `;
  }

  // Filtrage et Rendu des cartes de recettes
  function renderRecipeCards() {
    if (isComparatorTableView) {
      renderComparatorTable();
      return;
    }

    const container = document.getElementById('recipes-comparator-container');
    if (!container) return;

    // AM-04: Mémoriser les tiroirs de portion ouverts par nom de recette
    const openGCDrawers = new Set();
    const openSTDDrawers = new Set();
    document.querySelectorAll('.comparative-card').forEach(card => {
      const rName = card.getAttribute('data-recipe-name');
      if (!rName) return;
      const gcPanel = card.querySelector('.col-greycorner .portion-drawer-panel');
      if (gcPanel && gcPanel.style.display !== 'none') openGCDrawers.add(rName);
      const stdPanel = card.querySelector('.col-standard .portion-drawer-panel');
      if (stdPanel && stdPanel.style.display !== 'none') openSTDDrawers.add(rName);
    });

    const recipesList = window.allRecipes || allRecipes || [];
    const cat = window.currentCategory || currentCategory || 'ALL';
    const query = (window.searchQuery || searchQuery || '').toLowerCase();
    const gainsOnly = window.onlyGainsFilter || onlyGainsFilter;

    var filtered = recipesList.filter(r => {
      const matchCat = cat === 'ALL' || r.category === cat;
      const matchSearch = !query || 
        r.name.toLowerCase().includes(query) || 
        r.category.toLowerCase().includes(query) ||
        r.greyCorner.tech.some(t => t.toLowerCase().includes(query));
      const matchGains = !gainsOnly || r.standard.diffDH >= 3.0;
      return matchCat && matchSearch && matchGains;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div style="font-size:48px; margin-bottom:12px;">🔍</div>
          <h3>Aucun plat trouvé</h3>
          <p>Essayez de modifier votre recherche ou sélectionnez une autre catégorie.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((recipe, idx) => {
      return createRecipeComparativeCardHTML(recipe, idx);
    }).join('');

    // AM-04: Restaurer l'ouverture des tiroirs pour les cartes mémorisées
    document.querySelectorAll('.comparative-card').forEach((card, idx) => {
      const rName = card.getAttribute('data-recipe-name');
      if (rName && openGCDrawers.has(rName)) {
        const panel = document.getElementById(`drawer-panel-gc-${idx}`);
        const btn = document.getElementById(`btn-drawer-gc-${idx}`);
        const icon = document.getElementById(`icon-drawer-gc-${idx}`);
        if (panel) panel.style.display = 'block';
        if (btn) btn.classList.add('drawer-open');
        if (icon) icon.textContent = '▲';
      }
      if (rName && openSTDDrawers.has(rName)) {
        const panel = document.getElementById(`drawer-panel-std-${idx}`);
        const btn = document.getElementById(`btn-drawer-std-${idx}`);
        const icon = document.getElementById(`icon-drawer-std-${idx}`);
        if (panel) panel.style.display = 'block';
        if (btn) btn.classList.add('drawer-open');
        if (icon) icon.textContent = '▲';
      }
    });
  }

  // Génération du code HTML d'une carte comparative 2-colonnes
  function createRecipeComparativeCardHTML(recipe, idx) {
    const gcFCClass = recipe.greyCorner.foodCost <= 32 ? 'badge-ok' : (recipe.greyCorner.foodCost <= 38 ? 'badge-warn' : 'badge-danger');
    const stdFCClass = recipe.standard.foodCost <= 32 ? 'badge-ok' : (recipe.standard.foodCost <= 38 ? 'badge-warn' : 'badge-danger');

    const diffBadge = recipe.standard.diffDH > 0 
      ? `<span id="badge-diff-${idx}" class="badge-gain" style="background:rgba(2, 132, 199, 0.1); color:#0284c7; border-color:rgba(2, 132, 199, 0.3);">Écart vs Standard : +${recipe.standard.diffDH.toFixed(2)} DH</span>`
      : `<span id="badge-diff-${idx}" class="badge-neutral">Marge conforme au standard</span>`;

    return `
      <div class="comparative-card" id="card-${idx}" data-recipe-name="${escapeHtml(recipe.name)}" data-category="${escapeHtml(recipe.category)}">
        <!-- HEADER DU PLAT -->
        <div class="card-top-bar">
          <div class="card-title-group">
            <span class="cat-tag">${recipe.category}</span>
            <h3 class="dish-title">${recipe.name}</h3>
          </div>
          <div class="card-price-group">
            <span class="sell-price-tag" style="display:inline-flex; align-items:center; gap:6px;">
              Prix Vente : 
              <input type="number" 
                     class="sell-price-input" 
                     value="${recipe.sellPrice}" 
                     step="0.5" 
                     min="0" 
                     placeholder="0" 
                     title="Saisir ou modifier le prix de vente du plat" 
                     oninput="window.updateRecipeSellPrice(${idx}, this.value)" 
                     style="width:70px; padding:2px 6px; font-weight:800; border:1.5px solid #0284c7; border-radius:6px; background:#fff; text-align:center; font-size:13px; color:#0f172a;" /> DH
            </span>
            ${diffBadge}
          </div>
        </div>

        <!-- GRILLE COMPARATIVE 2 COLONNES -->
        <div class="comparison-dual-grid">
          
          <!-- COLONNE 1 : FICHE GREY CORNER (OPÉRATIONNELLE & MODIFIABLE) -->
          <div class="col-box col-greycorner">
            <div class="col-header">
              <span class="col-dot dot-blue"></span>
              <h4>1. Fiche Technique Grey Corner (Modifiable)</h4>
            </div>

            <!-- ÉDITEUR D'INGRÉDIENTS EN DIRECT -->
            <div class="custom-ingredients-editor" id="editor-${idx}">
              ${(window.renderIngredientsEditorHTML || (typeof renderIngredientsEditorHTML === 'function' ? renderIngredientsEditorHTML : () => ''))(recipe.greyCorner.tech, recipe.name, idx)}
            </div>

            <!-- BOUTONS D'ACTION SUR LA RECETTE -->
            <div class="quick-preset-actions" style="margin-top:12px;">
              <button class="btn-preset" title="Ajouter un ingrédient à la fiche" onclick="window.addIngredientToRecipe(${idx})">➕ Ajouter ingrédient</button>
              <button class="btn-preset text-success" title="Appliquer le standard international sur la fiche Grey Corner" onclick="window.copyStandardToRecipe(${idx})">🟢 Copier Standard Int.</button>
              <button class="btn-preset text-danger" title="Rétablir la fiche d'origine" onclick="window.resetRecipeToInitial(${idx})">🔄 Rétablir d'origine</button>
            </div>

            <!-- RÉSULTAT FINANCIER DE LA FICHE GREY CORNER -->
            <div class="col-finances fin-custom" style="margin-top:14px;">
              <div class="fin-row">
                <span>Coût Portion Réel :</span>
                <strong id="gc-cost-${idx}" class="text-accent" style="color:#0284c7; font-size:16px;">${recipe.greyCorner.cost.toFixed(2)} DH</strong>
              </div>
              <div class="fin-row">
                <span>Food Cost :</span>
                <span id="gc-fc-${idx}" class="badge ${gcFCClass}">${recipe.greyCorner.foodCost.toFixed(1)} %</span>
              </div>
              <div class="fin-row">
                <span>Marge Brute :</span>
                <strong id="gc-margin-${idx}" class="text-success" style="font-size:16px;">+${recipe.greyCorner.grossMarginDH.toFixed(2)} DH</strong>
              </div>
            </div>

            <!-- TIROIR ACCORDÉON : DÉTAILS DU COÛT DE PORTION GREY CORNER -->
            <div class="portion-drawer-wrapper">
              <button type="button" class="btn-drawer-toggle gc-drawer-btn" id="btn-drawer-gc-${idx}" onclick="window.togglePortionCostDrawer(${idx}, 'gc')" title="Déplier / replier le détail du coût par ingrédient">
                <span class="drawer-title">📂 Détails Coût Portion (Tiroir)</span>
                <span class="drawer-icon" id="icon-drawer-gc-${idx}">▼</span>
              </button>
              <div class="portion-drawer-panel" id="drawer-panel-gc-${idx}" style="display:none;">
                ${renderPortionCostBreakdownHTML(recipe.greyCorner.tech, recipe.sellPrice, 'gc', idx)}
              </div>
            </div>
          </div>

          <!-- COLONNE 2 : NORME INTERNATIONALE (À TITRE COMPARATIF) -->
          <div class="col-box col-standard">
            <div class="col-header">
              <span class="col-dot dot-green"></span>
              <h4>2. Norme Internationale & Standard F&B <span style="font-size:11px; font-weight:600; color:var(--text-muted);">(À titre comparatif)</span></h4>
            </div>

            <ul class="tech-list" style="margin-bottom:12px;">
              ${recipe.standard.tech.map(line => `<li>${escapeHtml(line)}</li>`).join('')}
            </ul>

            <div class="rationale-box">
              💡 <strong>Standard Métier :</strong> <em>${escapeHtml(recipe.standard.rationale)}</em>
            </div>

            <div class="col-finances" style="margin-top:auto;">
              <div class="fin-row">
                <span>Coût Portion Standard :</span>
                <strong class="text-success">${recipe.standard.cost.toFixed(2)} DH</strong>
              </div>
              <div class="fin-row">
                <span>Food Cost Standard :</span>
                <span class="badge ${stdFCClass}">${recipe.standard.foodCost.toFixed(1)} %</span>
              </div>
              <div class="fin-row">
                <span>Écart vs Grey Corner :</span>
                <strong class="${recipe.standard.diffDH > 0 ? 'text-gold' : 'text-success'}">${recipe.standard.diffDH > 0 ? '+' + recipe.standard.diffDH.toFixed(2) : recipe.standard.diffDH.toFixed(2)} DH</strong>
              </div>
            </div>

            <!-- TIROIR ACCORDÉON : DÉTAILS DU COÛT DE PORTION STANDARD -->
            <div class="portion-drawer-wrapper">
              <button type="button" class="btn-drawer-toggle std-drawer-btn" id="btn-drawer-std-${idx}" onclick="window.togglePortionCostDrawer(${idx}, 'std')" title="Déplier / replier le détail du coût standard par ingrédient">
                <span class="drawer-title">📂 Détails Coût Standard (Tiroir)</span>
                <span class="drawer-icon" id="icon-drawer-std-${idx}">▼</span>
              </button>
              <div class="portion-drawer-panel" id="drawer-panel-std-${idx}" style="display:none;">
                ${renderPortionCostBreakdownHTML(recipe.standard.tech, recipe.sellPrice, 'std', idx)}
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // Rendu du tiroir détaillé de coût de portion (décomposition par ingrédient)
  function renderPortionCostBreakdownHTML(techArray, sellPrice, type, cardIdx) {
    const calcFn = (typeof window !== 'undefined' && window.calculateRecipeFoodCost) ? window.calculateRecipeFoodCost : (typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost : () => ({ cost: 0, breakdown: [] }));
    const costObj = calcFn(techArray, sellPrice || 0);
    const breakdown = costObj.breakdown || [];
    const totalCost = costObj.cost || 0;

    if (breakdown.length === 0) {
      return `<div style="padding:10px; font-size:12px; color:var(--text-muted); text-align:center;">Aucun détail d'ingrédient disponible.</div>`;
    }

    const rows = breakdown.map(item => {
var unitLbl = item.unit === 'g' ? 'DH/kg' : (item.unit === 'ml' ? 'DH/L' : 'DH/u');
var displayPrice = (item.unit === 'g' || item.unit === 'ml') ? (item.unitPrice * 1000) : item.unitPrice;
var pctOfPortion = totalCost > 0 ? Math.round((item.cost / totalCost) * 1000) / 10 : 0;
var barColor = type === 'gc' ? '#0284c7' : '#16a34a';

      return `
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:5px 7px; font-weight:700; color:var(--text); font-size:12px;">
            ${escapeHtml(item.ingredient)}
          </td>
          <td style="padding:5px 7px; text-align:center; color:var(--text-muted); font-size:11.5px; white-space:nowrap;">
            ${escapeHtml(item.quantity)}
          </td>
          <td style="padding:5px 7px; text-align:right; color:var(--text-muted); font-size:11px; white-space:nowrap;">
            ${displayPrice.toFixed(2)} <span style="font-size:9.5px;">${unitLbl}</span>
          </td>
          <td style="padding:5px 7px; text-align:right; font-weight:800; color:var(--text); font-size:12px; white-space:nowrap;">
            ${item.cost.toFixed(2)} DH
          </td>
          <td style="padding:5px 7px; text-align:right; width:75px;">
            <div style="display:flex; align-items:center; justify-content:flex-end; gap:5px;">
              <span style="font-size:11px; font-weight:700; color:${barColor}; min-width:32px;">${pctOfPortion}%</span>
              <div style="width:26px; height:5px; background:var(--border); border-radius:3px; overflow:hidden;">
                <div style="width:${Math.min(100, pctOfPortion)}%; height:100%; background:${barColor};"></div>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="drawer-inner-box">
        <table class="drawer-cost-table" style="width:100%; border-collapse:collapse; font-size:12px;">
          <thead>
            <tr style="border-bottom:1.5px solid var(--border); font-size:10.5px; text-transform:uppercase; color:var(--text-muted); background:var(--thead-bg, rgba(0,0,0,0.02));">
              <th style="padding:6px 7px; text-align:left;">Ingrédient</th>
              <th style="padding:6px 7px; text-align:center;">Dose</th>
              <th style="padding:6px 7px; text-align:right;">P.U. Achat</th>
              <th style="padding:6px 7px; text-align:right;">Coût</th>
              <th style="padding:6px 7px; text-align:right;">Part</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr style="border-top:1.5px solid var(--border); font-weight:900; background:rgba(0,0,0,0.03);">
              <td colspan="3" style="padding:7px; text-align:left; font-size:11.5px;">TOTAL COÛT DE PORTION</td>
              <td style="padding:7px; text-align:right; color:${type === 'gc' ? '#0284c7' : '#16a34a'}; font-size:12.5px; font-weight:900;">
                ${totalCost.toFixed(2)} DH
              </td>
              <td style="padding:7px; text-align:right; font-size:11px; color:var(--text-muted);">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }

  // Fonction de bascule (ouverture/fermeture) du tiroir
  window.togglePortionCostDrawer = function(idx, type) {
    const panel = document.getElementById(`drawer-panel-${type}-${idx}`);
    const btn = document.getElementById(`btn-drawer-${type}-${idx}`);
    const icon = document.getElementById(`icon-drawer-${type}-${idx}`);
    if (!panel) return;

    const isOpen = panel.style.display !== 'none';
    if (isOpen) {
      panel.style.display = 'none';
      if (icon) icon.textContent = '▼';
      if (btn) btn.classList.remove('drawer-open');
    } else {
      // Toujours rafraîchir avec les données les plus récentes lors de l'ouverture
      if (type === 'gc') {
        const res = (window.resolveRecipe || resolveRecipe)(idx);
        if (res && res.recipe) {
          panel.innerHTML = renderPortionCostBreakdownHTML(res.recipe.greyCorner.tech, res.recipe.sellPrice, 'gc', idx);
        }
      }
      panel.style.display = 'block';
      if (icon) icon.textContent = '▲';
      if (btn) btn.classList.add('drawer-open');
    }
  };

  // Bascule du tiroir dans le tableau synthétique
  window.toggleTableRowDrawer = function(idx) {
    const row = document.getElementById(`table-row-drawer-${idx}`);
    const btn = document.getElementById(`btn-table-drawer-${idx}`);
    if (!row) return;
    const isOpen = row.style.display !== 'none';
    if (!isOpen) {
      const resolveFn = window.resolveRecipe || (typeof resolveRecipe === 'function' ? resolveRecipe : null);
      const res = resolveFn ? resolveFn(idx) : null;
      if (res && res.recipe && typeof renderPortionCostBreakdownHTML === 'function') {
        const gcBox = row.querySelector('div > div:first-child');
        if (gcBox) {
          gcBox.innerHTML = `
            <div style="font-weight:800; font-size:12.5px; color:#0284c7; margin-bottom:6px;">
              🔵 Détail Coût Grey Corner (${res.recipe.greyCorner.cost.toFixed(2)} DH)
            </div>
            ${renderPortionCostBreakdownHTML(res.recipe.greyCorner.tech, res.recipe.sellPrice, 'gc', idx)}
          `;
        }
      }
    }
    row.style.display = isOpen ? 'none' : 'table-row';
    if (btn) btn.innerHTML = isOpen ? '📂 Détails' : '🔼 Masquer';
  };

  // Exports globaux pour la communication inter-modules
  window.renderRecipeCards = renderRecipeCards;
  window.renderComparatorTable = renderComparatorTable;
  window.createRecipeComparativeCardHTML = createRecipeComparativeCardHTML;
  window.renderPortionCostBreakdownHTML = renderPortionCostBreakdownHTML;
  window.isComparatorTableView = isComparatorTableView;
  window.currentComparatorMainView = currentComparatorMainView;

