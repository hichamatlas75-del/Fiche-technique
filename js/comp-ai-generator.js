/**
 * GREY CORNER — Agent IA : Quick Wins Batch & Générateur de Recettes
 * Module: comp-ai-generator.js
 * Contient : applyAllQuickWinsBatch, aiFormulatorState, generateAIRecipeDraft,
 *            triggerAIRecipeGeneration, renderAIGeneratedPreview, saveAIGeneratedRecipeToDB.
 * Dépendances : comp-ai-engine.js (analyzeDatasetForOptimizations, FES_CAFE_RESTAURANT_MARKET),
 *               core-utils.js (GC_STORAGE_KEYS)
 */

  window.applyAllQuickWinsBatch = function() {
    const analysis = analyzeDatasetForOptimizations();
    const qWins = analysis.quickWins || [];
    if (qWins.length === 0) {
      if (window.GC_Toast) window.GC_Toast.show("Tous vos plats sont déjà parfaitement alignés sur les standards !", "info");
      return;
    }

    const totalSavings = qWins.reduce((sum, q) => sum + (q.monthlyGain || 0), 0);
    const confirmed = confirm(`⚡ OPTIMISATION GROUPÉE PAR L'AGENT IA\n\nSouhaitez-vous appliquer automatiquement les portions standards sur les ${qWins.length} plats identifiés ?\n\n💰 Gain estimé : +${totalSavings.toLocaleString('fr-FR')} DH / mois de trésorerie nette.\n\nCette action recalcule instantanément le Food Cost et synchronise Déstockage et Cuisine.`);
    if (!confirmed) return;

    qWins.forEach(q => {
      if (typeof window.copyStandardToRecipe === 'function') {
        window.copyStandardToRecipe(q.recipeName);
      }
    });

    if (window.GC_Toast) {
      window.GC_Toast.show(`🎉 Succès : ${qWins.length} fiches optimisées ! Gain estimé : +${totalSavings.toLocaleString('fr-FR')} DH/mois`, "success");
    }
    renderAIOptimizerAgent();
  };

  /* ========================================================
     3. GÉNÉRATEUR & CONCEPTEUR DE FICHE TECHNIQUE PAR IA
  ======================================================== */
  window.aiFormulatorState = {
    dishName: 'Pizza Saumon & Burrata',
    category: 'PIZZA',
    targetPrice: 110,
    generatedRecipe: null
  };

  window.generateAIRecipeDraft = function(name, cat, price) {
    const dishName = name || window.aiFormulatorState.dishName || 'Nouvelle Fiche';
    const category = (cat || window.aiFormulatorState.category || 'PIZZA').toUpperCase();
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const cleanN = cleanFn(dishName);

    let baseTech = [];
    if (category.includes('PIZZA')) {
      baseTech = [
        "Pâte à pizza : 220 g",
        "Sauce Tomate Pizza : 90 g",
        "Mozzarella râpée : 100 g"
      ];
      if (cleanN.includes('saumon')) baseTech.push("Saumon fumé : 60 g");
      else if (cleanN.includes('fruit') || cleanN.includes('mer')) baseTech.push("Fruits de Mer : 80 g");
      else if (cleanN.includes('poulet')) baseTech.push("Poulet émincé : 80 g");
      else if (cleanN.includes('viande') || cleanN.includes('hach')) baseTech.push("Viande hachée pur bœuf : 80 g");
      else baseTech.push("Fromage rouge râpé : 40 g");
      if (cleanN.includes('burrata')) {
        baseTech[2] = "Mozzarella râpée : 60 g";
        baseTech.push("Burrata : 1 p");
      }
      baseTech.push("Origan séché : 2 g");
    } else if (category.includes('BURGER')) {
      baseTech = [
        "Pain burger brioché : 1 p",
        "Viande hachée pur bœuf : 120 g",
        "Cheddar fondu : 1 p",
        "Sauce Maison Burger : 30 g",
        "Salade Iceberg : 25 g",
        "Tomate fraîche : 30 g"
      ];
      if (cleanN.includes('truffe')) baseTech.push("Sauce Truffe : 20 g");
      if (cleanN.includes('double') || cleanN.includes('royal')) baseTech[1] = "Viande hachée pur bœuf : 160 g";
    } else if (category.includes('PÂTE') || category.includes('PAST')) {
      baseTech = [
        "Pâtes Penne / Tagliatelles : 110 g",
        "Crème fraîche épaisse : 80 ml",
        "Parmesan râpé : 15 g"
      ];
      if (cleanN.includes('saumon')) baseTech.push("Saumon frais : 70 g");
      else if (cleanN.includes('crevette') || cleanN.includes('mer')) baseTech.push("Crevettes décortiquées : 70 g");
      else if (cleanN.includes('poulet')) baseTech.push("Poulet émincé : 80 g");
      else baseTech.push("Champignons de Paris : 50 g");
    } else if (category.includes('SALAD')) {
      baseTech = [
        "Salade Iceberg : 130 g",
        "Tomates cerises : 40 g",
        "Sauce Vinaigrette Maison : 30 g",
        "Croûtons dorés : 20 g"
      ];
      if (cleanN.includes('cesar') || cleanN.includes('césar') || cleanN.includes('poulet')) baseTech.push("Blanc de Poulet mariné : 80 g", "Parmesan râpé : 15 g");
      else if (cleanN.includes('thon')) baseTech.push("Thon égoutté : 70 g", "Œuf dur : 1 p");
      else baseTech.push("Fromage Feta : 50 g");
    } else {
      baseTech = [
        "Escalope de Poulet : 150 g",
        "Frites dorées : 150 g",
        "Sauce Champignons : 60 g",
        "Légumes sautés : 60 g"
      ];
    }

    const market = FES_CAFE_RESTAURANT_MARKET.getLimits(category, dishName);
    let sellPrice = parseFloat(price) || window.aiFormulatorState.targetPrice || 0;
    
    // Calculer le coût de revient
    const calcFn = window.calculateRecipeFoodCost || calculateRecipeFoodCost;
    let fcCalc = calcFn(baseTech, sellPrice || 60);
    if (!sellPrice || sellPrice <= 0) {
      sellPrice = Math.max(30, Math.min(market.softCeiling, Math.ceil((fcCalc.cost / 0.30) / 5) * 5));
      fcCalc = calcFn(baseTech, sellPrice);
    }

    const generated = {
      name: dishName.toUpperCase(),
      category: category,
      ingredients: baseTech,
      sellPrice: sellPrice,
      cost: fcCalc.cost,
      foodCost: fcCalc.foodCost,
      margin: fcCalc.margin,
      grossMarginDH: fcCalc.grossMarginDH,
      market
    };

    window.aiFormulatorState.generatedRecipe = generated;
    return generated;
  };

  window.triggerAIRecipeGeneration = function(name, cat, price) {
    if (name) window.aiFormulatorState.dishName = name;
    if (cat) window.aiFormulatorState.category = cat;
    if (price) window.aiFormulatorState.targetPrice = parseFloat(price) || 0;
    const gen = window.generateAIRecipeDraft(window.aiFormulatorState.dishName, window.aiFormulatorState.category, window.aiFormulatorState.targetPrice);
    if (typeof window.renderAIGeneratedPreview === 'function') window.renderAIGeneratedPreview(gen);
  };

  window.renderAIGeneratedPreview = function(gen) {
    const container = document.getElementById('ai-gen-preview-container');
    if (!container || !gen) return;

    const fcColor = gen.foodCost <= 32 ? '#10b981' : (gen.foodCost <= 38 ? '#f59e0b' : '#ef4444');

    container.innerHTML = `
      <div class="ai-gen-preview-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
          <div>
            <span style="font-size:11px; font-weight:800; color:#0284c7; background:rgba(2,132,199,0.1); padding:2px 8px; border-radius:4px;">
              ${gen.category} &bull; MODÈLE FÈS OPTIMISÉ
            </span>
            <h3 style="margin:6px 0 2px 0; font-size:16px; font-weight:900; color:var(--text);">${gen.name}</h3>
            <small style="color:var(--text-muted);">Plafond marché conseillé : <strong>${gen.market.marketRange}</strong></small>
          </div>
          <div style="text-align:right;">
            <div style="font-size:18px; font-weight:900; color:#0284c7;">${gen.sellPrice} DH</div>
            <span style="font-weight:800; color:${fcColor}; font-size:12px;">Food Cost : ${gen.foodCost}%</span>
          </div>
        </div>

        <div style="margin: 12px 0 8px 0; font-size:12px; font-weight:800; color:var(--text);">
          🥩 Ingrédients &amp; Grammages Calibrés par l'IA :
        </div>
        <div class="ai-gen-ing-tags">
          ${gen.ingredients.map(ing => `<span class="ai-gen-tag">✅ ${ing}</span>`).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--paper); border:1px solid var(--border); border-radius:8px; padding:10px 14px; margin-top:12px; font-size:12.5px;">
          <div>Coût Portion : <strong style="color:#0284c7;">${gen.cost.toFixed(2)} DH</strong></div>
          <div>Marge Brute : <strong style="color:#10b981;">+${gen.grossMarginDH.toFixed(2)} DH (${gen.margin}%)</strong></div>
        </div>

        <div style="margin-top:14px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-primary" style="padding:10px 20px; font-weight:800; font-size:13px; background:#10b981; border-color:#059669;" onclick="window.saveAIGeneratedRecipeToDB()">
            💾 Enregistrer dans le Menu &amp; Synchroniser
          </button>
        </div>
      </div>
    `;
  };

  window.saveAIGeneratedRecipeToDB = function() {
    const gen = window.aiFormulatorState.generatedRecipe;
    if (!gen) return;

    const confirmed = confirm(`Créer la nouvelle fiche technique « ${gen.name} » ?\n\nPrix : ${gen.sellPrice} DH\nCoût : ${gen.cost.toFixed(2)} DH (Food Cost : ${gen.foodCost}%)\n\nElle sera immédiatement visible dans Cuisine, Déstockage et Comparateur.`);
    if (!confirmed) return;

    const newId = 'rec_ai_' + Date.now();
    const recipeObj = {
      id: newId,
      name: gen.name,
      category: gen.category,
      ingredients: gen.ingredients.slice(),
      tech: gen.ingredients.slice(),
      sellPrice: gen.sellPrice,
      price: gen.sellPrice + ' DH',
      cost: gen.cost,
      foodCost: gen.foodCost,
      margin: gen.margin,
      grossMarginDH: gen.grossMarginDH
    };

    try {
      const rawV5 = localStorage.getItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.RECIPES : 'gc_recipes_db_v5');
      const list = rawV5 ? JSON.parse(rawV5) : JSON.parse(JSON.stringify(window.BASE_RECIPES || []));
      list.push(recipeObj);
      localStorage.setItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.RECIPES : 'gc_recipes_db_v5', JSON.stringify(list));
      localStorage.setItem('gc_recipes_db_version', (typeof RECIPES_DB_VERSION !== 'undefined' ? RECIPES_DB_VERSION : 'v8.3_20260916'));
    } catch(e) {}

    try {
      const savedComp = localStorage.getItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.COMP_EDITS : 'grey_corner_custom_recipes_v5');
      const compEdits = savedComp ? JSON.parse(savedComp) : {};
      compEdits[gen.name] = { tech: gen.ingredients.slice(), sellPrice: gen.sellPrice, updatedAt: Date.now() };
      localStorage.setItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.COMP_EDITS : 'grey_corner_custom_recipes_v5', JSON.stringify(compEdits));
    } catch(e) {}

    try {
      localStorage.setItem(window.GC_STORAGE_KEYS ? window.GC_STORAGE_KEYS.SYNC_PING : 'gc_sync_ping', Date.now().toString());
      window.dispatchEvent(new CustomEvent('gc:recipe-updated', { detail: { recipeName: gen.name, action: 'save' } }));
    } catch(e) {}

    if (window.GC_Toast) {
      window.GC_Toast.show(`✨ Nouvelle fiche « ${gen.name} » créée avec succès !`, 'success');
    }

    if (typeof window.initData === 'function') window.initData();
    if (typeof window.setComparatorMainView === 'function') {
      window.setComparatorMainView('recipes');
    }
    setTimeout(() => {
      window.applyAIOptimization(gen.name, 'inspect');
    }, 250);
  };


