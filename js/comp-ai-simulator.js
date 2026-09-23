/**
 * GREY CORNER — Agent IA : Simulateur de Marges & Grammages (What-If)
 * Module: comp-ai-simulator.js
 * Contient : setSimVariation, setSimGrammageDelta, setSimGrammageMode,
 *            runMacroInflationSimulation, applyGrammageToRecipe,
 *            applyBatchSimulatedGrammage, updateSimulationView.
 * Dépendances : comp-ai-engine.js, core-utils.js (cleanText)
 */
  window.setSimVariation = function(pct) {
    window.simVariationPct = pct;
    const disp = document.getElementById('sim-variation-display');
    if (disp) {
      disp.textContent = (pct > 0 ? '+' : '') + pct + '%';
      disp.style.color = pct > 0 ? '#ef4444' : (pct < 0 ? '#10b981' : 'var(--text-muted)');
    }
    const slider = document.getElementById('sim-price-slider');
    if (slider && parseInt(slider.value, 10) !== pct) slider.value = pct;
    if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
  };

  window.setSimGrammageDelta = function(val) {
    window.simGrammageDelta = val;
    const isPct = window.simGrammageMode === 'pct';
    const unitLabel = isPct ? '%' : 'g';
    const disp = document.getElementById('sim-grammage-display');
    if (disp) {
      disp.textContent = (val > 0 ? '+' : '') + val + unitLabel;
      disp.style.color = val < 0 ? '#10b981' : (val > 0 ? '#ef4444' : 'var(--text-muted)');
    }
    const slider = document.getElementById('sim-grammage-slider');
    if (slider && parseFloat(slider.value) !== val) slider.value = val;
    if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
  };

  window.setSimGrammageMode = function(mode) {
    window.simGrammageMode = mode;
    const slider = document.getElementById('sim-grammage-slider');
    if (slider) {
      if (mode === 'pct') {
        slider.min = "-50";
        slider.max = "50";
        slider.step = "5";
      } else {
        slider.min = "-60";
        slider.max = "60";
        slider.step = "5";
      }
    }
    const btnG = document.getElementById('sim-mode-btn-grams');
    const btnP = document.getElementById('sim-mode-btn-pct');
    if (btnG) btnG.className = mode === 'grams' ? 'ai-tab-btn active' : 'ai-tab-btn';
    if (btnP) btnP.className = mode === 'pct' ? 'ai-tab-btn active' : 'ai-tab-btn';
    window.setSimGrammageDelta(window.simGrammageDelta || 0);
  };

  window.runMacroInflationSimulation = function(ingName, pct, gramDelta, gramMode) {
    const ingredient = ingName || window.simSelectedIngredient || 'Mozzarella';
    const variationPct = typeof pct === 'number' ? pct : (window.simVariationPct !== undefined ? window.simVariationPct : 15);
    const gramVal = typeof gramDelta === 'number' ? gramDelta : (window.simGrammageDelta !== undefined ? window.simGrammageDelta : 0);
    const mode = gramMode || window.simGrammageMode || 'grams';
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const recipes = window.allRecipes || [];
    const targetClean = cleanFn(ingredient);
    const affectedDishes = [];
    let totalMonthlySurcost = 0;

    recipes.forEach(r => {
      const matchLine = (r.greyCorner.breakdown || []).find(b => cleanFn(b.ingredient).includes(targetClean));
      if (matchLine) {
        const oldQty = (matchLine.qtyNumber !== undefined && matchLine.qtyNumber !== null) ? matchLine.qtyNumber : (parseFloat(matchLine.quantity) || 0);
        const unit = matchLine.unit || 'g';
        const oldUnitCost = (matchLine.unitPrice !== undefined && matchLine.unitPrice !== null) ? matchLine.unitPrice : (oldQty > 0 ? matchLine.cost / oldQty : 0);
        const oldLineCost = matchLine.cost;

        // Calcul de la nouvelle quantité par portion
        let newQty = oldQty;
        if (mode === 'pct' || unit === 'piece') {
          newQty = oldQty * (1 + gramVal / 100);
        } else {
          newQty = oldQty + gramVal;
        }
        newQty = Math.max(0, Math.round(newQty * 10) / 10);

        // Nouveau coût d'achat unitaire avec levier fournisseur
        const newUnitCost = oldUnitCost * (1 + variationPct / 100);
        // Nouveau coût matière pour cette ligne d'ingrédient
        const newLineCost = newQty * newUnitCost;
        // Impact financier net par assiette
        const costDiff = newLineCost - oldLineCost;
        const newRecipeCost = Math.max(0, r.greyCorner.cost + costDiff);
        const newFC = r.sellPrice > 0 ? (newRecipeCost / r.sellPrice * 100) : 0;
        const monthlyImpact = costDiff * 50; // base conservative 50 portions/mois

        totalMonthlySurcost += monthlyImpact;
        affectedDishes.push({
          name: r.name,
          category: r.category,
          sellPrice: r.sellPrice,
          oldCost: r.greyCorner.cost,
          newCost: Math.round(newRecipeCost * 100) / 100,
          oldFC: r.greyCorner.foodCost,
          newFC: Math.round(newFC * 10) / 10,
          oldQty: Math.round(oldQty * 10) / 10,
          newQty: newQty,
          unit: unit,
          costDiff: Math.round(costDiff * 100) / 100,
          monthlyImpact: Math.round(monthlyImpact),
          suggestedCompPrice: Math.ceil((newRecipeCost / 0.32) / 2) * 2
        });
      }
    });

    affectedDishes.sort((a, b) => b.costDiff - a.costDiff);
    return {
      ingredient,
      variationPct,
      gramDelta: gramVal,
      gramMode: mode,
      count: affectedDishes.length,
      totalMonthlySurcost: Math.round(totalMonthlySurcost),
      affectedDishes
    };
  };

  window.applyGrammageToRecipe = function(recipeName, ingTarget, newQty, unit, silent) {
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const decodedName = (typeof recipeName === 'string' && recipeName.includes('%')) ? decodeURIComponent(recipeName) : recipeName;
    const decodedIng = (typeof ingTarget === 'string' && ingTarget.includes('%')) ? decodeURIComponent(ingTarget) : ingTarget;
    const targetNameClean = cleanFn(decodedName);
    const targetIngClean = cleanFn(decodedIng);
    const recipesList = window.allRecipes || [];
    const recipe = recipesList.find(r => cleanFn(r.name) === targetNameClean) || recipesList.find(r => r.name === decodedName);
    if (!recipe || !recipe.greyCorner || !Array.isArray(recipe.greyCorner.tech)) return;

    // Trouver la ligne de l'ingrédient
    const ingIdx = recipe.greyCorner.tech.findIndex(line => {
      const parts = line.split(':');
      return cleanFn(parts[0]).includes(targetIngClean) || targetIngClean.includes(cleanFn(parts[0]));
    });
    if (ingIdx === -1) return;

    const oldLine = recipe.greyCorner.tech[ingIdx];
    const parts = oldLine.split(':');
    const ingLabel = parts[0].trim();
    const finalUnit = unit || (parts[1] ? parts[1].replace(/[\d.,\s]/g, '') : 'g') || 'g';
    recipe.greyCorner.tech[ingIdx] = `${ingLabel} : ${newQty} ${finalUnit}`;

    // Enregistrer dans editedRecipes
    const edits = window.editedRecipes || {};
    edits[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      sellPrice: recipe.sellPrice,
      updatedAt: Date.now()
    };
    window.editedRecipes = edits;
    if (typeof window.saveEdits === 'function') window.saveEdits(true);

    // Recalculer le food cost & standard diff
    if (typeof window.calculateRecipeFoodCost === 'function') {
      const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
      recipe.greyCorner.cost = costObj.cost;
      recipe.greyCorner.foodCost = costObj.foodCost;
      recipe.greyCorner.margin = costObj.margin;
      recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
      recipe.greyCorner.breakdown = costObj.breakdown;
      if (recipe.standard) {
        recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;
      }
    }

    if (!silent && typeof window.GC_Toast !== 'undefined') {
      window.GC_Toast.show(`⚖️ Portion ajustée : ${ingLabel} réglé à ${newQty}${finalUnit} sur "${recipe.name}" !`, 'success');
    }

    if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
    if (typeof window.renderRecipeCards === 'function') window.renderRecipeCards();
    if (typeof window.renderComparatorTable === 'function') window.renderComparatorTable();
  };

  window.applyBatchSimulatedGrammage = function() {
    const ingName = window.simSelectedIngredient || 'Mozzarella';
    const delta = typeof window.simGrammageDelta === 'number' ? window.simGrammageDelta : 0;
    const mode = window.simGrammageMode || 'grams';
    if (delta === 0) {
      if (typeof window.GC_Toast !== 'undefined') window.GC_Toast.show("Le grammage n'a pas été modifié (variation 0).", "info");
      return;
    }
    const sim = window.runMacroInflationSimulation(ingName, window.simVariationPct, delta, mode);
    if (!sim.affectedDishes || sim.affectedDishes.length === 0) {
      if (typeof window.GC_Toast !== 'undefined') window.GC_Toast.show("Aucun plat concerné à mettre à jour.", "info");
      return;
    }
    const unitLabel = mode === 'pct' ? '%' : 'g';
    const impactTxt = sim.totalMonthlySurcost < 0 ? `+${Math.abs(sim.totalMonthlySurcost).toLocaleString('fr-FR')} DH / mois d'économie` : (sim.totalMonthlySurcost > 0 ? `-${sim.totalMonthlySurcost.toLocaleString('fr-FR')} DH / mois de surcoût` : 'neutre');
    const confirmed = confirm(`⚡ APPLICATION DU NOUVEAU DOSAGE PAR L'AGENT IA\n\n` +
      `Matière première : ${sim.ingredient}\n` +
      `Ajustement : ${delta > 0 ? '+' : ''}${delta}${unitLabel} par portion\n` +
      `Plats impactés : ${sim.count} fiches techniques\n` +
      `Impact Trésorerie : ${impactTxt}\n\n` +
      `Souhaitez-vous appliquer ces nouveaux grammages et recalculer instantanément le Food Cost et le Déstockage ?`);
    if (!confirmed) return;

    sim.affectedDishes.forEach(d => {
      window.applyGrammageToRecipe(d.name, sim.ingredient, d.newQty, d.unit, true);
    });

    if (typeof window.GC_Toast !== 'undefined') {
      window.GC_Toast.show(`⚡ Ajustement groupé réussi : ${sim.count} fiches mises à jour avec le nouveau grammage de ${sim.ingredient} !`, 'success');
    }
    if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
    if (typeof window.renderRecipeCards === 'function') window.renderRecipeCards();
    if (typeof window.renderComparatorTable === 'function') window.renderComparatorTable();
  };

  window.updateSimulationView = function() {
    const sel = document.getElementById('sim-ingredient-select');
    if (sel) window.simSelectedIngredient = sel.value;
    const resPanel = document.getElementById('sim-results-panel');
    if (!resPanel) return;

    const sim = window.runMacroInflationSimulation(window.simSelectedIngredient, window.simVariationPct, window.simGrammageDelta, window.simGrammageMode);
    const varPriceText = sim.variationPct > 0 ? `+${sim.variationPct}%` : `${sim.variationPct}%`;
    const varPriceClass = sim.variationPct > 0 ? 'text-danger' : (sim.variationPct < 0 ? 'text-success' : 'text-muted');
    const unitLabel = sim.gramMode === 'pct' ? '%' : 'g';
    const varGramText = sim.gramDelta > 0 ? `+${sim.gramDelta}${unitLabel}` : `${sim.gramDelta}${unitLabel}`;
    const varGramClass = sim.gramDelta < 0 ? 'text-success' : (sim.gramDelta > 0 ? 'text-danger' : 'text-muted');

    const isSaving = sim.totalMonthlySurcost < 0;
    const isSurcost = sim.totalMonthlySurcost > 0;
    const impactColor = isSaving ? '#10b981' : (isSurcost ? '#ef4444' : 'var(--text)');

    resPanel.innerHTML = `
      <div class="ai-sim-kpis">
        <div class="ai-stat-card" style="border-left:4px solid #0284c7;">
          <div class="ai-stat-label">Ingrédient &amp; Leviers</div>
          <div class="ai-stat-value text-accent">${(window.escapeHtml || (s => s))(sim.ingredient)}</div>
          <div class="ai-stat-sub">Prix : <strong class="${varPriceClass}">${varPriceText}</strong> | Dosage : <strong class="${varGramClass}">${varGramText}</strong></div>
        </div>
        <div class="ai-stat-card" style="border-left:4px solid ${impactColor};">
          <div class="ai-stat-label">Impact Trésorerie / Mois</div>
          <div class="ai-stat-value" style="color:${impactColor};">
            ${isSaving ? '+' : (isSurcost ? '-' : '')}${Math.abs(sim.totalMonthlySurcost).toLocaleString('fr-FR')} DH
          </div>
          <div class="ai-stat-sub">${isSaving ? 'Économie mensuelle estimée' : (isSurcost ? 'Surcoût mensuel estimé' : 'Impact neutre sur la marge')}</div>
        </div>
        <div class="ai-stat-card" style="border-left:4px solid #f59e0b;">
          <div class="ai-stat-label">Plats Concernés</div>
          <div class="ai-stat-value" style="color:#f59e0b;">${sim.count} fiches</div>
          <div class="ai-stat-sub">Recettes utilisant cette matière</div>
        </div>
      </div>

      ${sim.count === 0 ? `
        <div style="padding:15px; text-align:center; color:var(--text-muted); font-size:12px;">
          Aucune recette active n'utilise l'ingrédient « ${(window.escapeHtml || (s => s))(sim.ingredient)} ».
        </div>
      ` : `
        ${sim.gramDelta !== 0 ? `
          <div class="ai-sim-batch-banner" style="background:var(--card-bg); border:1px solid var(--border); border-left:4px solid ${sim.gramDelta < 0 ? '#10b981' : '#f59e0b'}; padding:10px 14px; border-radius:8px; margin-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <strong style="color:var(--text); font-size:12.5px;">⚡ Action Cuisine Rapide : Calibrage de Portion (${sim.gramDelta > 0 ? '+' : ''}${sim.gramDelta}${unitLabel})</strong>
              <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
                Appliquer ce nouveau grammage de <strong>${sim.ingredient}</strong> sur l'ensemble des <strong>${sim.count} fiches</strong> en un clic (synchronise Déstockage et Cuisine).
              </div>
            </div>
            <button class="ai-btn-action" style="background:${sim.gramDelta < 0 ? '#10b981' : '#0284c7'}; color:#fff; font-weight:800; padding:6px 14px; font-size:12px; border:none; border-radius:6px; cursor:pointer;" onclick="window.applyBatchSimulatedGrammage()">
              🚀 Appliquer aux ${sim.count} plats (${isSaving ? '+' + Math.abs(sim.totalMonthlySurcost).toLocaleString('fr-FR') + ' DH/m' : (isSurcost ? '-' + sim.totalMonthlySurcost.toLocaleString('fr-FR') + ' DH/m' : '0 DH')})
            </button>
          </div>
        ` : ''}

        <div style="margin-top:12px; font-size:12px; font-weight:800; color:var(--text); margin-bottom:6px;">
          📋 Plats impactés, Nouveaux Dosages &amp; Prix Conseillés :
        </div>
        <div class="ai-sim-table-wrap">
          <table class="ai-sim-table">
            <thead>
              <tr>
                <th>Plat</th>
                <th>Prix Vente</th>
                <th>Dosage Portion</th>
                <th>Coût Portion ➔ Nouveau</th>
                <th>Food Cost ➔ Nouveau</th>
                <th>Impact / Port.</th>
                <th>Prix Conseillé</th>
                <th>Actions IA</th>
              </tr>
            </thead>
            <tbody>
              ${sim.affectedDishes.map(d => `
                <tr>
                  <td><strong>${d.name}</strong></td>
                  <td>${d.sellPrice} DH</td>
                  <td>
                    ${d.oldQty} ${d.unit}
                    ${d.newQty !== d.oldQty ? `➔ <strong style="color:${d.newQty < d.oldQty ? '#10b981' : '#ef4444'};">${d.newQty} ${d.unit}</strong>` : ''}
                  </td>
                  <td>${d.oldCost.toFixed(2)} DH ➔ <strong style="color:${d.costDiff > 0 ? '#ef4444' : (d.costDiff < 0 ? '#10b981' : 'var(--text)')};">${d.newCost.toFixed(2)} DH</strong></td>
                  <td>${d.oldFC.toFixed(1)}% ➔ <strong style="color:${d.newFC > 35 ? '#ef4444' : 'var(--text)'};">${d.newFC}%</strong></td>
                  <td style="font-weight:800; color:${d.costDiff > 0 ? '#ef4444' : (d.costDiff < 0 ? '#10b981' : 'var(--text)')};">${d.costDiff > 0 ? '+' : ''}${d.costDiff.toFixed(2)} DH</td>
                  <td><strong style="color:#0284c7;">${d.suggestedCompPrice} DH</strong></td>
                  <td>
                    <div style="display:flex; gap:4px; flex-wrap:wrap;">
                      ${d.newQty !== d.oldQty ? `
                        <button class="ai-btn-action" style="background:#10b981; color:#fff; font-size:11px; padding:3px 7px;" title="Appliquer ce grammage sur ce plat" onclick="window.applyGrammageToRecipe('${encodeURIComponent(d.name)}', '${encodeURIComponent(sim.ingredient)}', ${d.newQty}, '${d.unit}')">
                          ⚖️ Régler ${d.newQty}${d.unit}
                        </button>
                      ` : ''}
                      <button class="ai-btn-action" style="font-size:11px; padding:3px 7px;" onclick="window.applyAIOptimization('${encodeURIComponent(d.name)}', 'apply_price', ${d.suggestedCompPrice})">
                        Fixer ${d.suggestedCompPrice} DH
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  };


