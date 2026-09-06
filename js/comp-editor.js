/**
 * GREY CORNER — Éditeur Interactif des Grammages & Portions
 * Module: comp-editor.js
 */

  // Génération des champs de saisie pour chaque ingrédient
  function renderIngredientsEditorHTML(techArray, recipeName, idx) {
    return techArray.map((line, ingIdx) => {
      const parts = line.split(':');
      const ing = parts[0].trim();
      const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';

      const gMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
      const mlMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);
      const clMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*cl\b/i);
      const pMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*(?:p|piece|tranche|part|boule|sachet|portion|tr)\b/i);

      let numVal = 1;
      let unit = 'g';

      if (gMatch) {
        numVal = parseFloat(gMatch[1].replace(',', '.'));
        unit = 'g';
      } else if (mlMatch) {
        numVal = parseFloat(mlMatch[1].replace(',', '.'));
        unit = 'ml';
      } else if (clMatch) {
        numVal = parseFloat(clMatch[1].replace(',', '.'));
        unit = 'cl';
      } else if (pMatch) {
        numVal = parseFloat(pMatch[1].replace(',', '.'));
        unit = 'p';
      } else {
        numVal = parseFloat(qtyStr.replace(/[^0-9.]/g, '')) || 1;
      }

      const step = unit === 'p' ? 0.5 : 5;

      return `
        <div class="ing-edit-row">
          <input type="text" class="ing-name-input" value="${escapeHtml(ing)}" data-recipe="${escapeHtml(recipeName)}" data-idx="${idx}" data-ing-idx="${ingIdx}" oninput="window.updateIngredientName(${idx}, ${ingIdx}, this.value)" onchange="window.updateIngredientName(${idx}, ${ingIdx}, this.value)" />
          <div class="ing-input-wrap">
            <button type="button" class="btn-step" onclick="window.stepIngredientVal(${idx}, ${ingIdx}, -${step})">-</button>
            <input type="number" 
                   class="ing-num-input" 
                   value="${numVal}" 
                   step="${step}" 
                   min="0"
                   data-recipe="${escapeHtml(recipeName)}"
                   data-idx="${idx}"
                   data-ing-idx="${ingIdx}"
                   data-unit="${unit}"
                   oninput="window.onIngredientInputChange(${idx}, ${ingIdx}, this.value, '${unit}')" />
            <button type="button" class="btn-step" onclick="window.stepIngredientVal(${idx}, ${ingIdx}, +${step})">+</button>
            <span class="ing-unit-tag">${unit}</span>
            <button type="button" class="btn-del-ing" title="Supprimer cet ingrédient" onclick="window.removeIngredientFromRecipe(${idx}, ${ingIdx})">✕</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Résolution robuste de la recette (par index de carte ou par nom)
  function resolveRecipe(p1, p2) {
    let cardIdx = null;
    let recipeName = null;
    let cardCat = null;

    const isNum1 = (typeof p1 === 'number') || (typeof p1 === 'string' && /^\d+$/.test(String(p1).trim()));
    const isNum2 = (typeof p2 === 'number') || (typeof p2 === 'string' && /^\d+$/.test(String(p2).trim()));

    if (isNum1) {
      cardIdx = parseInt(p1, 10);
      const card = document.getElementById(`card-${cardIdx}`);
      recipeName = card ? card.getAttribute('data-recipe-name') : (allRecipes[cardIdx] ? allRecipes[cardIdx].name : null);
      if (card && card.getAttribute('data-category')) cardCat = card.getAttribute('data-category');
    } else if (typeof p1 === 'string') {
      recipeName = p1;
      if (isNum2) cardIdx = parseInt(p2, 10);
    }

    let recipe = null;
    if (recipeName) {
      const cTarget = cleanText(recipeName);
      // 1. Recherche exacte par nom
      recipe = allRecipes.find(r => r.name === recipeName);
      // 2. Recherche par nom normalisé
      if (!recipe) {
        recipe = allRecipes.find(r => cleanText(r.name) === cTarget);
      }
      // 3. Recherche contextuelle dans la même catégorie si disponible
      if (!recipe && cardCat) {
        recipe = allRecipes.find(r => r.category === cardCat && (cleanText(r.name).includes(cTarget) || cTarget.includes(cleanText(r.name))));
      }
    }

    if (!recipe && cardIdx !== null && allRecipes[cardIdx]) {
      recipe = allRecipes[cardIdx];
      recipeName = recipe.name;
    }

    return { recipe, cardIdx: (cardIdx !== null ? cardIdx : 0), recipeName: (recipe ? recipe.name : recipeName) };
  }

  // Mise à jour du prix de vente d'un plat
  window.updateRecipeSellPrice = function(p1, p2, p3) {
    let recipe, cardIdx, newSellPrice;
    if (arguments.length >= 3) {
      ({ recipe, cardIdx } = resolveRecipe(p1, p2));
      newSellPrice = parseFloat(p3) || 0;
    } else {
      ({ recipe, cardIdx } = resolveRecipe(p1));
      newSellPrice = parseFloat(p2) || 0;
    }
    if (!recipe) return;

    recipe.sellPrice = newSellPrice;

    // Enregistrer dans editedRecipes
    if (!editedRecipes[recipe.name]) {
      editedRecipes[recipe.name] = { tech: recipe.greyCorner.tech.slice(), updatedAt: Date.now() };
    }
    editedRecipes[recipe.name].sellPrice = newSellPrice;
    editedRecipes[recipe.name].updatedAt = Date.now();
    saveEdits(false);

    // Recalculer le coût et la marge Grey Corner
    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.greyCorner.breakdown = costObj.breakdown;

    // Recalculer le standard comparatif
    const standardCostObj = window.calculateRecipeFoodCost(recipe.standard.tech, recipe.sellPrice);
    recipe.standard.cost = standardCostObj.cost;
    recipe.standard.foodCost = standardCostObj.foodCost;
    recipe.standard.margin = standardCostObj.margin;
    recipe.standard.grossMarginDH = standardCostObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    // Mettre à jour l'affichage de la carte
    updateCardMetrics(cardIdx, recipe);
    renderSummaryKPIs();
  };

  // Mise à jour de la valeur d'un ingrédient
  window.onIngredientInputChange = function(p1, p2, p3, p4, p5) {
    let recipe, cardIdx, ingIdx, newVal, unit;
    if (arguments.length >= 5) {
      ({ recipe, cardIdx } = resolveRecipe(p1, p2));
      ingIdx = parseInt(p3, 10); newVal = p4; unit = p5;
    } else {
      ({ recipe, cardIdx } = resolveRecipe(p1));
      ingIdx = parseInt(p2, 10); newVal = p3; unit = p4;
    }
    if (!recipe || isNaN(ingIdx)) return;

    const val = parseFloat(newVal) || 0;
    const oldLine = recipe.greyCorner.tech[ingIdx];
    if (!oldLine) return;

    const parts = oldLine.split(':');
    const ingName = parts[0].trim();
    recipe.greyCorner.tech[ingIdx] = `${ingName} : ${val} ${unit || 'g'}`;

    // Enregistrer dans editedRecipes
    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

    // Recalculer le coût
    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.greyCorner.breakdown = costObj.breakdown;

    // Recalculer l'écart vs standard
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    // Mettre à jour l'affichage de la carte
    updateCardMetrics(cardIdx, recipe);
    renderSummaryKPIs();
  };

  // Mise à jour du nom d'un ingrédient
  window.updateIngredientName = function(p1, p2, p3, p4) {
    let recipe, cardIdx, ingIdx, newName;
    if (arguments.length >= 4) {
      ({ recipe, cardIdx } = resolveRecipe(p1, p2));
      ingIdx = parseInt(p3, 10); newName = p4;
    } else {
      ({ recipe, cardIdx } = resolveRecipe(p1));
      ingIdx = parseInt(p2, 10); newName = p3;
    }
    if (!recipe || isNaN(ingIdx)) return;

    const oldLine = recipe.greyCorner.tech[ingIdx];
    if (!oldLine) return;

    const parts = oldLine.split(':');
    const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';
    recipe.greyCorner.tech[ingIdx] = `${(newName || '').trim()} : ${qtyStr}`;

    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;

    updateCardMetrics(cardIdx, recipe);
    renderSummaryKPIs();
  };

  // Pas d'incrément (+ / -)
  window.stepIngredientVal = function(p1, p2, p3, p4) {
    let cardIdx, ingIdx, delta;
    if (arguments.length >= 4) {
      cardIdx = parseInt(p2, 10); ingIdx = parseInt(p3, 10); delta = parseFloat(p4) || 0;
    } else {
      cardIdx = parseInt(p1, 10); ingIdx = parseInt(p2, 10); delta = parseFloat(p3) || 0;
    }
    const editor = document.getElementById(`editor-${cardIdx}`);
    if (!editor) return;

    const inputs = editor.querySelectorAll('.ing-num-input');
    const input = inputs[ingIdx];
    if (!input) return;

    let current = parseFloat(input.value) || 0;
    let next = Math.max(0, Math.round((current + delta) * 10) / 10);
    input.value = next;
    const unit = input.getAttribute('data-unit') || 'g';
    window.onIngredientInputChange(cardIdx, ingIdx, next, unit);
  };

  // Ajouter un ingrédient
  window.addIngredientToRecipe = function(p1, p2) {
    const { recipe, cardIdx, recipeName } = resolveRecipe(p1, p2);
    if (!recipe) return;

    const ingName = prompt("Nom du nouvel ingrédient :", "Nouvel Ingrédient");
    if (!ingName || !ingName.trim()) return;

    const qty = prompt("Quantité (ex: 50 g, 100 ml, 1 p) :", "50 g");
    if (!qty || !qty.trim()) return;

    recipe.greyCorner.tech.push(`${ingName.trim()} : ${qty.trim()}`);
    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    renderRecipeCards();
    renderSummaryKPIs();
    window.GC_Toast.show(`➕ Ingrédient ajouté à ${recipe.name}`, 'info');
  };

  // Supprimer un ingrédient
  window.removeIngredientFromRecipe = function(p1, p2, p3) {
    let recipe, cardIdx, ingIdx;
    if (arguments.length >= 3) {
      ({ recipe, cardIdx } = resolveRecipe(p1, p2));
      ingIdx = parseInt(p3, 10);
    } else {
      ({ recipe, cardIdx } = resolveRecipe(p1));
      ingIdx = parseInt(p2, 10);
    }
    if (!recipe || isNaN(ingIdx)) return;

    if (recipe.greyCorner.tech.length <= 1) {
      alert("Une recette doit contenir au moins un ingrédient.");
      return;
    }

    recipe.greyCorner.tech.splice(ingIdx, 1);
    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    renderRecipeCards();
    renderSummaryKPIs();
    window.GC_Toast.show(`🗑️ Ingrédient supprimé de ${recipe.name}`, 'info');
  };

  // Copier le standard international
  window.copyStandardToRecipe = function(p1, p2) {
    const { recipe, cardIdx } = resolveRecipe(p1, p2);
    if (!recipe) return;

    recipe.greyCorner.tech = JSON.parse(JSON.stringify(recipe.standard.tech));
    editedRecipes[recipe.name] = {
      tech: recipe.greyCorner.tech.slice(),
      updatedAt: Date.now()
    };
    saveEdits(false);

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = 0;

    renderRecipeCards();
    renderSummaryKPIs();
    window.GC_Toast.show(`🟢 Standard international copié sur ${recipe.name}`, 'success');
  };

  // Rétablir la fiche d'origine
  window.resetRecipeToInitial = function(p1, p2) {
    const { recipe, cardIdx } = resolveRecipe(p1, p2);
    if (!recipe) return;

    delete editedRecipes[recipe.name];
    saveEdits(false);
    recipe.greyCorner.tech = JSON.parse(JSON.stringify(recipe.initialTech));

    const costObj = window.calculateRecipeFoodCost(recipe.greyCorner.tech, recipe.sellPrice);
    recipe.greyCorner.cost = costObj.cost;
    recipe.greyCorner.foodCost = costObj.foodCost;
    recipe.greyCorner.margin = costObj.margin;
    recipe.greyCorner.grossMarginDH = costObj.grossMarginDH;
    recipe.standard.diffDH = Math.round((recipe.greyCorner.cost - recipe.standard.cost) * 100) / 100;

    renderRecipeCards();
    renderSummaryKPIs();
    window.GC_Toast.show(`🔄 Fiche d'origine rétablie pour ${recipe.name}`, 'info');
  };

  // Mise à jour ciblée des chiffres d'une carte
  function updateCardMetrics(cardIdx, recipe) {
    const costEl = document.getElementById(`gc-cost-${cardIdx}`);
    const fcEl = document.getElementById(`gc-fc-${cardIdx}`);
    const marginEl = document.getElementById(`gc-margin-${cardIdx}`);
    const diffBadgeEl = document.getElementById(`badge-diff-${cardIdx}`);

    if (costEl) costEl.textContent = `${recipe.greyCorner.cost.toFixed(2)} DH`;
    if (fcEl) {
      fcEl.textContent = `${recipe.greyCorner.foodCost.toFixed(1)} %`;
      fcEl.className = `badge ${recipe.greyCorner.foodCost <= 32 ? 'badge-ok' : (recipe.greyCorner.foodCost <= 38 ? 'badge-warn' : 'badge-danger')}`;
    }
    if (marginEl) marginEl.textContent = `+${recipe.greyCorner.grossMarginDH.toFixed(2)} DH`;

    if (diffBadgeEl) {
      if (recipe.standard.diffDH > 0) {
        diffBadgeEl.className = 'badge-gain';
        diffBadgeEl.style.cssText = 'background:rgba(2, 132, 199, 0.1); color:#0284c7; border-color:rgba(2, 132, 199, 0.3);';
        diffBadgeEl.textContent = `Écart vs Standard : +${recipe.standard.diffDH.toFixed(2)} DH`;
      } else {
        diffBadgeEl.className = 'badge-neutral';
        diffBadgeEl.style.cssText = '';
        diffBadgeEl.textContent = `Marge conforme au standard`;
      }
    }

    const drawerPanel = document.getElementById(`drawer-panel-gc-${cardIdx}`);
    if (drawerPanel) {
      drawerPanel.innerHTML = renderPortionCostBreakdownHTML(recipe.greyCorner.tech, recipe.sellPrice, 'gc', cardIdx);
    }
  }

  // Filtrage par catégorie
  window.setComparatorCategory = function(cat) {
    currentCategory = cat;
    renderCategoriesBar();
    renderRecipeCards();
  };



