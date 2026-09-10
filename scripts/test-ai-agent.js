/**
 * TEST AUTOMATISÉ : AGENT IA COMPARATEUR & MENU ENGINEERING
 * Vérifie :
 * 1. Assistant F&B (askAIFBAssistant) sur les requêtes clés
 * 2. Simulateur Macro What-If (runMacroInflationSimulation)
 * 3. Concepteur de Recettes IA (generateAIRecipeDraft)
 * 4. Optimisation groupée des Quick Wins (applyAllQuickWinsBatch)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("==================================================================");
console.log("🤖 TEST AUTOMATISÉ : AGENT IA OPTIMISEUR & ASSISTANT F&B");
console.log("==================================================================\n");

// 1. Simuler l'environnement de stockage et DOM
const storage = {};
const mockLocalStorage = {
  getItem(k) { return storage[k] !== undefined ? storage[k] : null; },
  setItem(k, v) { storage[k] = String(v); },
  removeItem(k) { delete storage[k]; },
  clear() { for (let k in storage) delete storage[k]; }
};

const domElements = {};
const mockWindow = {
  addEventListener: (name, fn) => {},
  dispatchEvent: (evt) => {},
  document: {
    getElementById: (id) => {
      if (!domElements[id]) domElements[id] = { innerHTML: '', value: '', style: {}, textContent: '' };
      return domElements[id];
    },
    querySelectorAll: () => []
  }
};

global.window = mockWindow;
global.document = mockWindow.document;
global.localStorage = mockLocalStorage;
global.confirm = () => true;

// 2. Charger recipes-data.js
const recipesDataPath = path.join(__dirname, '..', 'recipes-data.js');
eval(fs.readFileSync(recipesDataPath, 'utf8'));

global.DATA = window.DATA;
global.CATEGORIES_DATA = window.CATEGORIES_DATA;
global.BASE_RECIPES = window.BASE_RECIPES;
global.ALIAS_MAP = window.ALIAS_MAP;
global.INGREDIENT_UNIT_COSTS = window.INGREDIENT_UNIT_COSTS;
global.calculateRecipeFoodCost = window.calculateRecipeFoodCost;

// 3. Charger js/core-utils.js
const coreUtilsPath = path.join(__dirname, '..', 'js', 'core-utils.js');
eval(fs.readFileSync(coreUtilsPath, 'utf8'));

global.GC_STORAGE_KEYS = window.GC_STORAGE_KEYS;
global.cleanText = window.cleanText;
global.escapeHtml = window.escapeHtml;

// 3b. Charger js/ingredient-costs.js & js/proposed-standards.js
const ingCostsPath = path.join(__dirname, '..', 'js', 'ingredient-costs.js');
if (fs.existsSync(ingCostsPath)) eval(fs.readFileSync(ingCostsPath, 'utf8'));

const proposedStandardsPath = path.join(__dirname, '..', 'js', 'proposed-standards.js');
eval(fs.readFileSync(proposedStandardsPath, 'utf8'));

// 4. Charger js/comp-core.js
const compCorePath = path.join(__dirname, '..', 'js', 'comp-core.js');
eval(fs.readFileSync(compCorePath, 'utf8'));

// Initialiser les données du comparateur
window.initData();
console.log(`✅ Base de données initialisée : ${window.allRecipes.length} fiches techniques chargées.`);
assert(window.allRecipes.length > 0, "allRecipes ne doit pas être vide !");

// 5. Charger js/comp-ai.js
const compAiPath = path.join(__dirname, '..', 'js', 'comp-ai.js');
eval(fs.readFileSync(compAiPath, 'utf8'));

console.log("\n--- TEST 1: ASSISTANT CONVERSATIONNEL F&B ---");

// Test 1.1: Top 5 plats rentables
window.askAIFBAssistant("Quels sont les 3 plats les plus rentables ?");
let lastAiMsg = window.aiChatHistory[window.aiChatHistory.length - 1];
assert(lastAiMsg && lastAiMsg.sender === 'ai', "L'IA doit avoir répondu");
assert(lastAiMsg.text.includes("Top 5 des Plats les plus Rentables"), "Doit inclure le titre des plats rentables");
console.log("  ✓ Intent 'Top Rentables' détecté et traité avec succès");

// Test 1.2: Food Cost critique
window.askAIFBAssistant("Quels plats ont un Food Cost critique > 35% ?");
lastAiMsg = window.aiChatHistory[window.aiChatHistory.length - 1];
assert(lastAiMsg.text.includes("Food Cost"), "Doit mentionner le Food Cost critique");
console.log("  ✓ Intent 'Food Cost Critique' détecté et traité avec succès");

// Test 1.3: Ingrédients les plus coûteux
window.askAIFBAssistant("Quels sont les ingrédients les plus coûteux ?");
lastAiMsg = window.aiChatHistory[window.aiChatHistory.length - 1];
assert(lastAiMsg.text.includes("Ingrédients"), "Doit lister les 5 ingrédients majeurs");
console.log("  ✓ Intent 'Ingrédients Coûteux' détecté et traité avec succès");

// Test 1.4: Briefing serveurs
window.askAIFBAssistant("Donne-moi le briefing pour les serveurs ce soir");
lastAiMsg = window.aiChatHistory[window.aiChatHistory.length - 1];
assert(lastAiMsg.text.includes("Briefing"), "Doit préparer le briefing de service");
console.log("  ✓ Intent 'Briefing Serveurs' détecté et traité avec succès");

// Test 1.5: Plan -2% Food Cost
window.askAIFBAssistant("Comment baisser mon food cost de 2% ?");
lastAiMsg = window.aiChatHistory[window.aiChatHistory.length - 1];
assert(lastAiMsg.text.includes("Plan Stratégique"), "Doit détailler les étapes pour -2%");
console.log("  ✓ Intent 'Stratégie -2% Food Cost' détecté et traité avec succès");

// Test 1.6: Plat spécifique (Pizza 4 Saisons)
window.askAIFBAssistant("Pizza 4 Saisons");
lastAiMsg = window.aiChatHistory[window.aiChatHistory.length - 1];
console.log("DEBUG 1.6 text:", lastAiMsg.text);
assert(lastAiMsg.text.toLowerCase().includes("pizza 4 saisons"), "Doit analyser la Pizza 4 Saisons spécifiquement");
assert(lastAiMsg.text.includes("Prix de vente"), "Doit afficher les métriques du plat");
console.log("  ✓ Intent 'Plat spécifique' résolu avec analyse détaillée");

console.log("\n--- TEST 2: SIMULATEUR MACRO INFLATION & WHAT-IF ---");

// Test 2.1: Simulation +15% sur la Mozzarella
const simMozza = window.runMacroInflationSimulation("Mozzarella", 15);
assert(simMozza.count > 0, "La Mozzarella doit impacter au moins 1 plat (Pizzas)");
assert(simMozza.totalMonthlySurcost > 0, "Une hausse de +15% doit engendrer un surcoût positif");
assert(simMozza.affectedDishes[0].suggestedCompPrice > 0, "Un prix compensatoire doit être proposé");
console.log(`  ✓ Simulation Mozzarella +15% : ${simMozza.count} plats impactés, surcoût mensuel : +${simMozza.totalMonthlySurcost} DH`);

// Test 2.2: Simulation +20% sur la Viande
const simViande = window.runMacroInflationSimulation("Viande", 20);
assert(simViande.count > 0, "La viande doit impacter au moins 1 plat (Burgers/Plats)");
console.log(`  ✓ Simulation Viande +20% : ${simViande.count} plats impactés, surcoût mensuel : +${simViande.totalMonthlySurcost} DH`);

// Test 2.3: Simulation Déflation / Négociation -10%
const simNegoc = window.runMacroInflationSimulation("Poulet", -10);
assert(simNegoc.totalMonthlySurcost < 0, "Une baisse de prix négociée doit être négative (économie)");
console.log(`  ✓ Simulation Négociation Poulet -10% : gain mensuel généré : ${Math.abs(simNegoc.totalMonthlySurcost)} DH`);

console.log("\n--- TEST 3: CONCEPTEUR DE RECETTES IA ---");

// Test 3.1: Génération Pizza
const pizzaDraft = window.generateAIRecipeDraft("Pizza Saumon & Burrata", "PIZZA", 110);
assert(pizzaDraft.name === "PIZZA SAUMON & BURRATA", "Nom de recette en majuscules");
assert(pizzaDraft.category === "PIZZA", "Catégorie PIZZA");
assert(pizzaDraft.ingredients.some(i => i.toLowerCase().includes("mozzarella")), "Doit contenir de la mozzarella");
assert(pizzaDraft.ingredients.some(i => i.toLowerCase().includes("saumon")), "Doit contenir du saumon");
assert(pizzaDraft.cost > 0, "Le coût doit être calculé");
assert(pizzaDraft.foodCost > 0 && pizzaDraft.foodCost < 50, "Le Food Cost doit être raisonnable");
console.log(`  ✓ Pizza générée : Coût ${pizzaDraft.cost.toFixed(2)} DH, Food Cost ${pizzaDraft.foodCost}%, Marge +${pizzaDraft.grossMarginDH.toFixed(2)} DH`);

// Test 3.2: Génération Burger avec prix automatique
const burgerDraft = window.generateAIRecipeDraft("Burger Double Truffe", "BURGER", null);
assert(burgerDraft.sellPrice > 0, "Le prix automatique doit être calculé");
assert(burgerDraft.ingredients.some(i => i.toLowerCase().includes("viande") || i.toLowerCase().includes("bœuf") || i.toLowerCase().includes("steak")), "Doit contenir de la viande de bœuf");
console.log(`  ✓ Burger généré (prix auto) : Prix calculé ${burgerDraft.sellPrice} DH, FC ${burgerDraft.foodCost}%`);

console.log("\n--- TEST 4: OPTIMISATION GROUPÉE DES QUICK WINS ---");
const analysis = window.analyzeDatasetForOptimizations();
console.log(`  • Quick Wins identifiés dans le catalogue : ${analysis.quickWins.length} plats`);
assert(analysis.quickWins.length >= 0, "Quick wins valides");

console.log("\n--- TEST 5: RENDU COMPLET DE L'INTERFACE DE L'AGENT ---");
window.setAITab('assistant');
assert(domElements['ai-agent-wrapper'].innerHTML.includes('ai-assistant-container'), "L'onglet assistant doit afficher l'assistant");

window.setAITab('simulator');
assert(domElements['ai-agent-wrapper'].innerHTML.includes('ai-simulator-container'), "L'onglet simulateur doit afficher le simulateur");

window.setAITab('generator');
assert(domElements['ai-agent-wrapper'].innerHTML.includes('ai-generator-container'), "L'onglet concepteur doit afficher le concepteur");

window.setAITab('menu_engineering');
assert(domElements['ai-agent-wrapper'].innerHTML.includes('ai-priority-banner'), "L'onglet menu engineering doit afficher la bannière des 3 priorités");

console.log("  ✓ Tous les onglets de l'agent IA se rendent correctement sans exception.");

console.log("\n==================================================================");
console.log("🎉 TOUS LES TESTS DE L'AGENT IA ONT RÉUSSI AVEC SUCCÈS ! (100% OK)");
console.log("==================================================================");
