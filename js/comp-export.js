/**
 * GREY CORNER — Exports Excel, Mercuriale & Synchronisation GitHub
 * Module: comp-export.js
 */

  // Exporter le tableau comparatif en Excel (.xlsx)
  window.exportComparisonToExcel = function() {
    if (typeof XLSX === 'undefined') {
      alert("La librairie Excel est en cours de chargement. Veuillez réessayer.");
      return;
    }

    const rows = [
      ["GREY CORNER — COMPARATIF FICHES TECHNIQUES vs STANDARDS INTERNATIONAUX"],
      ["Date d'export : " + new Date().toLocaleDateString('fr-FR')],
      [],
      [
        "Catégorie",
        "Nom du Plat",
        "Prix Vente (DH)",
        "Fiche Grey Corner (Ingrédients)",
        "Coût Grey Corner (DH)",
        "Food Cost Grey Corner (%)",
        "Marge Brute (DH)",
        "Standard International (Ingrédients)",
        "Coût Standard (DH)",
        "Food Cost Standard (%)",
        "Écart vs Standard (DH)",
        "Justification Métier / Rationale"
      ]
    ];

    allRecipes.forEach(r => {
      rows.push([
        r.category,
        r.name,
        r.sellPrice,
        r.greyCorner.tech.join(' | '),
        r.greyCorner.cost,
        r.greyCorner.foodCost,
        r.greyCorner.grossMarginDH,
        r.standard.tech.join(' | '),
        r.standard.cost,
        r.standard.foodCost,
        r.standard.diffDH,
        r.standard.rationale
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Comparatif Fiches Techniques");
    XLSX.writeFile(wb, `GreyCorner_Comparatif_Fiches_Standards_${new Date().toISOString().slice(0,10)}.xlsx`);
    window.GC_Toast.show("📥 Export Excel généré avec succès !", 'success');
  };

  // ========================================================
  // GESTION MERCURIALE & PRIX D'ACHAT DES MATIÈRES PREMIÈRES
  // (Délégation universelle vers GC_PricesModal / prices-modal.js)
  // ========================================================

  function openPricesModal() {
    if (window.GC_PricesModal) {
      window.GC_PricesModal.open();
    }
  }

  function closePricesModal() {
    if (window.GC_PricesModal) {
      window.GC_PricesModal.close();
    }
  }

  // Générer la chaîne complète du fichier recipes-data.js à jour
  function buildUpdatedRecipesDataJsString() {
    const rawData = window.CATEGORIES_DATA || window.DATA || [];
    const clonedData = JSON.parse(JSON.stringify(rawData));

    clonedData.forEach(cat => {
      (cat.items || []).forEach(item => {
        const edit = editedRecipes[item.name] || editedRecipes[cleanText(item.name)];
        if (edit) {
          if (edit.tech) item.tech = edit.tech;
          if (typeof edit.sellPrice === 'number' && edit.sellPrice > 0) {
            item.sellPrice = edit.sellPrice;
            item.price = edit.sellPrice + ' DH';
          }
        }
        const sellPrice = parseFloat(String(item.price || item.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
        const costObj = window.calculateRecipeFoodCost(item.tech, sellPrice);
        item.cost = costObj.cost;
        item.foodCost = costObj.foodCost;
        item.margin = costObj.margin;
        item.grossMarginDH = costObj.grossMarginDH;
      });
    });

    // 2. Base recipes
    const rawBase = window.BASE_RECIPES || [];
    const clonedBase = JSON.parse(JSON.stringify(rawBase));
    clonedBase.forEach(r => {
      const edit = editedRecipes[r.name] || editedRecipes[cleanText(r.name)];
      if (edit) {
        if (edit.tech) r.ingredients = edit.tech;
        if (typeof edit.sellPrice === 'number' && edit.sellPrice > 0) {
          r.sellPrice = edit.sellPrice;
          r.price = edit.sellPrice + ' DH';
        }
      }
    });

    // 3. Objets complémentaires
    const aliasObj = window.ALIAS_MAP || {};
    const catObj = window.INGREDIENT_CATEGORIES || {};
    const unitCostsObj = window.INGREDIENT_UNIT_COSTS || {};
    const fnStr = (window.calculateRecipeFoodCost || function(){}).toString();

    let content = `/**\n * GREY CORNER — Base de données centralisée des Fiches Techniques et Recettes\n * Source Unique de Vérité (SSOT) mise à jour automatiquement le ${new Date().toISOString()}\n */\n\n(function(global) {\n`;
    content += `const DATA = ${JSON.stringify(clonedData, null, 2)};\n\n`;
    content += `const BASE_RECIPES = ${JSON.stringify(clonedBase, null, 2)};\n\n`;
    content += `const ALIAS_MAP = ${JSON.stringify(aliasObj, null, 2)};\n\n`;
    content += `const INGREDIENT_CATEGORIES = ${JSON.stringify(catObj, null, 2)};\n\n`;
    content += `const INGREDIENT_UNIT_COSTS = ${JSON.stringify(unitCostsObj, null, 2)};\n\n`;
    content += `${fnStr}\n\n`;
    content += `global.CATEGORIES_DATA = DATA;\nglobal.DATA = DATA;\nglobal.BASE_RECIPES = BASE_RECIPES;\nglobal.ALIAS_MAP = ALIAS_MAP;\nglobal.INGREDIENT_CATEGORIES = INGREDIENT_CATEGORIES;\nglobal.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\nglobal.calculateRecipeFoodCost = calculateRecipeFoodCost;\nif (typeof window !== 'undefined') {\n  window.calculateRecipeFoodCost = calculateRecipeFoodCost;\n  window.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\n  window.DATA = DATA;\n  window.CATEGORIES_DATA = DATA;\n  window.BASE_RECIPES = BASE_RECIPES;\n}\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = { DATA, CATEGORIES_DATA: DATA, BASE_RECIPES, ALIAS_MAP, INGREDIENT_CATEGORIES, INGREDIENT_UNIT_COSTS, calculateRecipeFoodCost };\n}\n})(typeof window !== 'undefined' ? window : globalThis);\n`;

    return content;
  }

  // Exporter le fichier complet recipes-data.js (Téléchargement local)
  function downloadUpdatedRecipesDataJs() {
    try {
      const content = buildUpdatedRecipesDataJsString();
      const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "recipes-data.js";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      window.GC_Toast.show("📁 Fichier recipes-data.js complet mis à jour et téléchargé !", 'success');
    } catch (err) {
      alert("Erreur lors de l'exportation de recipes-data.js : " + err.message);
    }
  }

  // Synchronisation directe vers le Codebase GitHub via l'API REST
  window.syncDirectToGitHub = async function() {
    let token = localStorage.getItem('gc_github_token');
    if (!token) {
      token = prompt("🔑 Synchronisation directe avec GitHub (Codebase) :\nVeuillez entrer votre GitHub Personal Access Token (PAT) avec accès 'repo' :\n(Ce jeton restera mémorisé dans votre navigateur en toute sécurité)");
      if (!token) return;
      token = token.trim();
      localStorage.setItem('gc_github_token', token);
    }

    const btn = document.getElementById('btn-github-sync');
    const origHTML = btn ? btn.innerHTML : '';
    if (btn) {
      btn.innerHTML = "⏳ Envoi vers GitHub...";
      btn.disabled = true;
    }

    try {
      const fileContent = buildUpdatedRecipesDataJsString();
      const owner = 'hichamatlas75-del';
      const repo = 'Fiche-technique';
      const path = 'recipes-data.js';
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

      // 1. Récupérer le SHA actuel du fichier
      const getRes = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!getRes.ok) {
        if (getRes.status === 401 || getRes.status === 403) {
          localStorage.removeItem('gc_github_token');
          throw new Error("Token GitHub invalide ou permissions insuffisantes. Veuillez cliquer à nouveau et entrer un token valide avec la permission 'repo'.");
        }
        throw new Error(`Erreur GitHub API (${getRes.status}): ${getRes.statusText}`);
      }

      const fileData = await getRes.json();
      const currentSha = fileData.sha;

      // 2. Encodage UTF-8 en Base64
      const utf8Bytes = new TextEncoder().encode(fileContent);
      let binaryStr = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binaryStr += String.fromCharCode(utf8Bytes[i]);
      }
      const base64Content = btoa(binaryStr);

      // 3. Envoyer le commit directement sur origin/main
      const nowStr = new Date().toLocaleString('fr-FR');
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Mise à jour des fiches techniques depuis l'interface web [${nowStr}]`,
          content: base64Content,
          sha: currentSha,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.message || `Erreur HTTP ${putRes.status}`);
      }

      window.GC_Toast.show("🚀 Fiches techniques enregistrées DIRECTEMENT sur le Codebase GitHub !", 'success');
      if (btn) {
        btn.innerHTML = "✅ Enregistré sur GitHub !";
        btn.style.background = "#059669";
        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.style.background = "";
          btn.disabled = false;
        }, 4000);
      }
    } catch (err) {
      alert("⚠️ Erreur lors de la synchronisation avec GitHub :\n" + err.message);
      if (btn) {
        btn.innerHTML = origHTML;
        btn.disabled = false;
      }
    }
  };

  // Rétrocompatibilité & Délégation vers GC_PricesModal
  window.exportUpdatedRecipesDataJS = downloadUpdatedRecipesDataJs;
  window.downloadUpdatedRecipesDataJs = downloadUpdatedRecipesDataJs;
  window.openPricesModal = () => window.GC_PricesModal ? window.GC_PricesModal.open() : openPricesModal();
  window.closePricesModal = () => window.GC_PricesModal ? window.GC_PricesModal.close() : closePricesModal();

  // Initialisation au chargement
  function initComparatorApp() {
    initData();

    // Recherche
    const searchInput = document.getElementById('search-comparator');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderRecipeCards();
      });
    }

    // Filtre gains
    const filterGainBtn = document.getElementById('btn-filter-gains');
    if (filterGainBtn) {
      filterGainBtn.addEventListener('click', () => {
        onlyGainsFilter = !onlyGainsFilter;
        filterGainBtn.classList.toggle('active', onlyGainsFilter);
        renderRecipeCards();
      });
    }

    // Bouton de sauvegarde globale
    const saveAllBtn = document.getElementById('btn-save-all');
    if (saveAllBtn) {
      saveAllBtn.addEventListener('click', () => saveEdits(true));
    }

    // Écoute de mise à jour des prix d'achat
    if (window.GC_PricesModal) {
      window.GC_PricesModal.onUpdate(() => {
        initData();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComparatorApp);
  } else {
    initComparatorApp();
  }

