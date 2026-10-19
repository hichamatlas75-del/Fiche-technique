// scripts/sync-destockage-reference.js
// Synchronise la référence Déstockage de Supabase vers recipes-data.js et proposed-standards.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'bxgguavmuiefthqmzygy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Z2d1YXZtdWllZnRocW16eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNzIsImV4cCI6MjEwNDk1MjI3Mn0.7aGDBXzzMApGkxXuDDcwMJXxPlPsG8LEYb5WIcA--00';

function fetchSupabaseRecipes() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL,
      path: '/rest/v1/recipes?is_active=eq.true&select=*&order=updated_at.asc',
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log("1. Récupération des fiches Déstockage depuis Supabase Cloud...");
  const cloudRecipes = await fetchSupabaseRecipes();
  console.log(`   -> ${cloudRecipes.length} fiches récupérées.`);

  // Dédupliquer par nom normalisé (le plus récent gagne)
  const cleanMap = new Map();
  cloudRecipes.forEach(r => {
    if (!r || !r.name) return;
    const cleanN = r.name.toLowerCase().trim();
    cleanMap.set(cleanN, r);
  });
  console.log(`   -> ${cleanMap.size} fiches uniques après déduplication.`);

  // Charger local recipes-data.js et ingredient-costs.js
  const recipesDataPath = path.join(__dirname, '..', 'recipes-data.js');
  const local = require(recipesDataPath);

  // Charger calculateRecipeFoodCost
  const calcFn = local.calculateRecipeFoodCost;

  let updatedBaseCount = 0;
  local.BASE_RECIPES.forEach(r => {
    const cleanN = r.name.toLowerCase().trim();
    const cr = cleanMap.get(cleanN);
    if (cr && Array.isArray(cr.ingredients) && cr.ingredients.length > 0) {
      r.ingredients = cr.ingredients.slice();
      r.tech = cr.ingredients.slice();
      if (typeof cr.sell_price === 'number' && cr.sell_price > 0) {
        r.sellPrice = cr.sell_price;
      }
      updatedBaseCount++;
    }
  });
  console.log(`   -> ${updatedBaseCount} fiches BASE_RECIPES mises à jour.`);

  // Mettre à jour DATA (les 22 catégories)
  let updatedDataCount = 0;
  local.DATA.forEach(cat => {
    (cat.items || []).forEach(it => {
      const cleanN = it.name.toLowerCase().trim();
      const cr = cleanMap.get(cleanN);
      if (cr && Array.isArray(cr.ingredients) && cr.ingredients.length > 0) {
        it.tech = cr.ingredients.slice();
        it.ingredients = cr.ingredients.slice();
        if (typeof cr.sell_price === 'number' && cr.sell_price > 0) {
          it.sellPrice = cr.sell_price;
          it.price = cr.sell_price + ' DH';
        }
      }
      // Recalculer le food cost précis
      const priceVal = it.sellPrice || parseFloat(String(it.price || '0').replace(/[^0-9.]/g, '')) || 0;
      const calc = calcFn(it.tech || it.ingredients || [], priceVal);
      it.cost = calc.cost;
      it.foodCost = calc.foodCost;
      it.margin = calc.margin;
      it.grossMarginDH = calc.grossMarginDH;
      updatedDataCount++;
    });
  });
  console.log(`   -> ${updatedDataCount} fiches DATA recalculées avec précision.`);

  // Sauvegarder dans recipes-data.js en préservant le format canonique
  console.log("2. Réécriture de recipes-data.js...");
  const rawJs = fs.readFileSync(recipesDataPath, 'utf8');

  // Remplacer BASE_RECIPES
  const baseRecipesJson = JSON.stringify(local.BASE_RECIPES, null, 2);
  const dataJson = JSON.stringify(local.DATA, null, 2);

  let newJs = rawJs.replace(
    /const BASE_RECIPES = \[[\s\S]*?\];\n\nconst ALIAS_MAP/,
    `const BASE_RECIPES = ${baseRecipesJson};\n\nconst ALIAS_MAP`
  );

  newJs = newJs.replace(
    /const DATA = \[[\s\S]*?\];\n\n\/\* ========================================================/,
    `const DATA = ${dataJson};\n\n/* ========================================================`
  );

  fs.writeFileSync(recipesDataPath, newJs, 'utf8');
  console.log("   -> recipes-data.js sauvegardé avec succès.");

  // 3. Génération de proposed-standards.js dupliqué de la référence Déstockage
  console.log("3. Génération de proposed-standards.js à partir de la référence Déstockage...");
  const proposedStandards = {};

  local.BASE_RECIPES.forEach(r => {
    const key = r.name.toUpperCase().trim();
    proposedStandards[key] = {
      category: r.category || "AUTRE",
      standardPortionWeight: "Portion standardisée Déstockage",
      rationale: "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
      tech: (r.ingredients || r.tech || []).slice()
    };
  });

  const proposedStandardsCode = `/**
 * GREY CORNER — Base des Fiches Techniques & Normes de Référence
 * Fiches calibrées et dupliquées strictement depuis la référence d'exploitation Déstockage (SSOT)
 * Utilisé conjointement avec recipes-data.js pour le Comparateur et la gestion F&B.
 */

(function(global) {
  'use strict';

  // Bibliothèque des Normes de Référence Grey Corner (Dupliquée de Déstockage)
  const PROPOSED_STANDARDS = ${JSON.stringify(proposedStandards, null, 2)};

  // Recherche d'une fiche technique de référence standard
  function getProposedStandard(recipeName, currentItem) {
    if (!recipeName) return null;

    const raw = String(recipeName).toUpperCase().trim();
    const clean = (typeof global.cleanText === 'function') 
      ? global.cleanText(raw).toUpperCase() 
      : raw.toLowerCase().trim().toUpperCase();

    // 1. Correspondance exacte par clé
    if (PROPOSED_STANDARDS[raw]) {
      return PROPOSED_STANDARDS[raw];
    }
    if (PROPOSED_STANDARDS[clean]) {
      return PROPOSED_STANDARDS[clean];
    }

    // 2. Recherche par alias ou correspondance souple (sans préfixe PIZZA, PASTA, PLAT...)
    const stripped = clean.replace(/^(?:PIZZA|PASTA|PLAT|SANDWICH|PANINI|CREPE|SALADE|BURGER)\\s+/, '').trim();
    for (const [k, v] of Object.entries(PROPOSED_STANDARDS)) {
      const kClean = (typeof global.cleanText === 'function') ? global.cleanText(k).toUpperCase() : k;
      const kStripped = kClean.replace(/^(?:PIZZA|PASTA|PLAT|SANDWICH|PANINI|CREPE|SALADE|BURGER)\\s+/, '').trim();
      if (kClean === clean || kStripped === stripped) {
        return v;
      }
    }

    // 3. Fallback direct sur la fiche d'exploitation Déstockage transmise
    if (currentItem && currentItem.tech && currentItem.tech.length > 0) {
      return {
        category: currentItem.category || "AUTRE",
        standardPortionWeight: "Portion standardisée Déstockage",
        rationale: "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
        tech: currentItem.tech.slice()
      };
    }

    return null;
  }

  // Export global
  global.PROPOSED_STANDARDS = PROPOSED_STANDARDS;
  global.getProposedStandard = getProposedStandard;

  if (typeof window !== 'undefined') {
    window.PROPOSED_STANDARDS = PROPOSED_STANDARDS;
    window.getProposedStandard = getProposedStandard;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PROPOSED_STANDARDS, getProposedStandard };
  }

})(typeof window !== 'undefined' ? window : globalThis);
`;

  const proposedStandardsPath = path.join(__dirname, '..', 'js', 'proposed-standards.js');
  fs.writeFileSync(proposedStandardsPath, proposedStandardsCode, 'utf8');
  console.log("   -> js/proposed-standards.js réécrit avec la référence Déstockage.");
}

main().catch(err => {
  console.error("Erreur:", err);
  process.exit(1);
});
