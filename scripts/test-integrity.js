/**
 * GREY CORNER — Script de Test d'Intégrité Automatisé (CI / Diagnostic)
 * Exécutable via : node scripts/test-integrity.js
 */

const fs = require('fs');
const path = require('path');

console.log('======================================================');
console.log('🧪 GREY CORNER — DIAGNOSTIC ET VALIDATION DU CODEBASE');
console.log('======================================================\n');

let hasErrors = false;

// 1. Chargement des modules SSOT
let DATA, BASE_RECIPES, ALIAS_MAP, INGREDIENT_UNIT_COSTS, calculateRecipeFoodCost;

try {
  const recipesModule = require('../recipes-data.js');
  DATA = recipesModule.DATA;
  BASE_RECIPES = recipesModule.BASE_RECIPES;
  ALIAS_MAP = recipesModule.ALIAS_MAP;
  INGREDIENT_UNIT_COSTS = recipesModule.INGREDIENT_UNIT_COSTS;
  calculateRecipeFoodCost = recipesModule.calculateRecipeFoodCost;

  if (!DATA || !Array.isArray(DATA)) throw new Error('DATA is not an array in recipes-data.js');
  if (!BASE_RECIPES || !Array.isArray(BASE_RECIPES)) throw new Error('BASE_RECIPES is not an array');
  if (!ALIAS_MAP || typeof ALIAS_MAP !== 'object') throw new Error('ALIAS_MAP is missing');
  if (!INGREDIENT_UNIT_COSTS || typeof INGREDIENT_UNIT_COSTS !== 'object') throw new Error('INGREDIENT_UNIT_COSTS is missing');
  if (typeof calculateRecipeFoodCost !== 'function') throw new Error('calculateRecipeFoodCost is missing');

  console.log('✅ [1/5] Importation CommonJS de recipes-data.js : SUCCÈS');
} catch (err) {
  console.error('❌ [1/5] Échec critique du chargement de recipes-data.js :', err.message);
  process.exit(1);
}

// 2. Audit des Fiches Techniques et Calculs de Coûts
let totalRecipes = 0;
let nanCostCount = 0;
let zeroPriceCount = 0;
const recipeIds = new Set();
const recipeNames = new Set();

DATA.forEach(cat => {
  (cat.items || []).forEach(item => {
    totalRecipes++;
    if (item.id) recipeIds.add(item.id);
    if (item.name) recipeNames.add(item.name.toLowerCase().trim());

    if (isNaN(item.cost) || item.cost === null || typeof item.cost !== 'number') {
      console.error(`❌ Coût invalide (NaN/null) sur la fiche: [${cat.category}] "${item.name}"`);
      nanCostCount++;
      hasErrors = true;
    }

    if (!item.sellPrice || item.sellPrice <= 0) {
      zeroPriceCount++;
    }
  });
});

BASE_RECIPES.forEach(r => {
  if (r.id) recipeIds.add(r.id);
  if (r.name) recipeNames.add(r.name.toLowerCase().trim());
});

if (nanCostCount === 0) {
  console.log(`✅ [2/5] Calculs de Food Cost : ${totalRecipes} recettes vérifiées (0 coût NaN)`);
} else {
  console.error(`❌ [2/5] ${nanCostCount} recette(s) ont un coût invalide`);
}

// 3. Audit des Alias de Caisse POS (ALIAS_MAP)
let totalAliases = Object.keys(ALIAS_MAP).length;
let brokenAliases = [];

for (const [alias, targetId] of Object.entries(ALIAS_MAP)) {
  if (!recipeIds.has(targetId)) {
    brokenAliases.push({ alias, targetId });
    hasErrors = true;
  }
}

if (brokenAliases.length === 0) {
  console.log(`✅ [3/5] Table des Alias POS : ${totalAliases} alias vérifiés (100% de matching valide)`);
} else {
  console.error(`❌ [3/5] ${brokenAliases.length} alias orphelins détectés :`);
  brokenAliases.forEach(b => console.error(`   - "${b.alias}" -> "${b.targetId}" (recette introuvable)`));
}

// 4. Audit de la Mercuriale des Prix Matières
let totalIngredients = Object.keys(INGREDIENT_UNIT_COSTS).length;
let invalidCosts = 0;

for (const [key, val] of Object.entries(INGREDIENT_UNIT_COSTS)) {
  if (!val || typeof val.cost !== 'number' || isNaN(val.cost) || val.cost < 0) {
    console.error(`❌ Prix d'achat invalide pour la matière: "${key}"`);
    invalidCosts++;
    hasErrors = true;
  }
}

if (invalidCosts === 0) {
  console.log(`✅ [4/5] Mercuriale Matières : ${totalIngredients} matières premières valides`);
} else {
  console.error(`❌ [4/5] ${invalidCosts} matière(s) première(s) ont un coût unitaire erroné`);
}

// 5. Test Benchmark de Calcul Dynamique
const testBenchmark = calculateRecipeFoodCost([
  "Pâte : 230 g",
  "Mozzarella : 110 g",
  "Sauce tomate : 85 g"
], 60);

if (testBenchmark && typeof testBenchmark.cost === 'number' && testBenchmark.cost > 0 && testBenchmark.foodCost > 0) {
  console.log(`✅ [5/5] Moteur Dynamique calculateRecipeFoodCost : Fonctionnel (Coût test: ${testBenchmark.cost} DH, FC: ${testBenchmark.foodCost}%)`);
} else {
  console.error('❌ [5/5] Échec du test unitaire calculateRecipeFoodCost');
  hasErrors = true;
}

console.log('\n------------------------------------------------------');
if (!hasErrors) {
  console.log(`🎉 SUCCÈS TOTAL : LE CODEBASE EST 100% INTÈGRE ET CONFORME !`);
  console.log(`- Total Catégories : ${DATA.length}`);
  console.log(`- Total Fiches Techniques : ${totalRecipes}`);
  console.log(`- Total Alias POS : ${totalAliases}`);
  console.log(`- Total Matières Premières : ${totalIngredients}`);
  console.log('------------------------------------------------------\n');
  process.exit(0);
} else {
  console.error(`⚠️ ÉCHEC DU CONTRÔLE D'INTÉGRITÉ. Veuillez corriger les erreurs ci-dessus.`);
  console.log('------------------------------------------------------\n');
  process.exit(1);
}
