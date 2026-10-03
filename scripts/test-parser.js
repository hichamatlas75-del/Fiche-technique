"use strict";
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

// Globaux nécessaires
global.window = global;
global.window.recipeNameIndex = new Map();
global.window.cleanAliasMap = {};
global.window.INGREDIENT_CATEGORIES = {};

// Charger core-utils
try { require(path.join(ROOT, "js", "core-utils.js")); } catch(e) {
  global.cleanText = (s) => String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g," ").replace(/\s+/g," ").trim();
}

// Charger recipes-data
try {
  const rData = require(path.join(ROOT, "recipes-data.js"));
  global.activeRecipes = rData.BASE_RECIPES || [];
  global.ALIAS_MAP = rData.ALIAS_MAP || {};
  activeRecipes.forEach(r => global.window.recipeNameIndex.set(cleanText(r.name), r));
  for (const [k, v] of Object.entries(global.ALIAS_MAP)) {
    global.window.cleanAliasMap[cleanText(k)] = v;
  }
} catch(e) {
  global.ALIAS_MAP = {};
  global.activeRecipes = [];
}

// Charger conso-processing
const proc = require(path.join(ROOT, "js", "conso-processing.js"));
const parseIngredientLine = proc.parseIngredientLine;
const escapeRegex = proc.escapeRegex;
const findRecipeForProduct = proc.findRecipeForProduct;

// Framework
let passed = 0, failed = 0;
const errors = [];
function assert(label, condition, detail) {
  if (condition) { process.stdout.write("  OK   " + label + "\n"); passed++; }
  else { process.stdout.write("  FAIL " + label + (detail ? " -- " + detail : "") + "\n"); failed++; errors.push(label); }
}
function assertEqual(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  assert(label, ok, ok ? "" : "recu=" + JSON.stringify(actual) + " attendu=" + JSON.stringify(expected));
}
function describe(suite, fn) { console.log("\n=== " + suite + " ==="); fn(); }

// Tests
describe("Parsing de base", function() {
  var r1 = parseIngredientLine("Cafe en grains : 10 g");
  assertEqual("Quantite 10", r1.qty, 10);
  assertEqual("Unite g", r1.unit, "g");
  var r2 = parseIngredientLine("Eau chaude : 60 ml");
  assertEqual("Unite ml", r2.unit, "ml");
});

describe("Conversions kg/cl/l", function() {
  var r1 = parseIngredientLine("Farine : 0.5 kg");
  assertEqual("0.5 kg -> 500 g", r1.qty, 500);
  assertEqual("kg -> g", r1.unit, "g");
  var r2 = parseIngredientLine("Creme : 20 cl");
  assertEqual("20 cl -> 200 ml", r2.qty, 200);
  assertEqual("cl -> ml", r2.unit, "ml");
  var r3 = parseIngredientLine("Eau : 1 litre");
  assertEqual("1 litre -> 1000 ml", r3.qty, 1000);
});

describe("Multiplicatif 2 x 15 g", function() {
  var r1 = parseIngredientLine("Beurre : 2 x 15 g");
  assertEqual("2x15=30", r1.qty, 30);
  assertEqual("unite g", r1.unit, "g");
});

describe("Virgule decimale FR", function() {
  var r1 = parseIngredientLine("Lait : 0,5 l");
  assertEqual("0,5 l -> 500 ml", r1.qty, 500);
  assertEqual("ml", r1.unit, "ml");
});

describe("Fusions ingredients", function() {
  var v = parseIngredientLine("Viande hachee : 200 g");
  assert("Viande hachee -> qty 200", v.qty === 200);
  assert("Viande hachee -> unite g", v.unit === "g");
  var p = parseIngredientLine("Blanc de poulet : 150 g");
  assert("Poulet qty 150", p.qty === 150);
});

describe("Cas limites", function() {
  var r1 = parseIngredientLine("Tomate cerise");
  assert("Sans ':' -> qty 1", r1.qty === 1);
  assert("Sans ':' -> unit g (default)", r1.unit === "g");
  var r3 = parseIngredientLine("Inconnue Bizarre : 999 g");
  assert("Inconnu -> pas crash", r3 !== null && r3 !== undefined);
  assert("Inconnu -> qty 999", r3.qty === 999);
});

describe("Boisson chaude mixte & Infusions", function() {
  var bc = parseIngredientLine("Boisson chaude : 1 p");
  assert("Boisson chaude a des composants", Array.isArray(bc.components) && bc.components.length === 2);
  assert("Composant Cafe 5g", bc.components[0].name === "Café en Grains" && bc.components[0].qty === 5);
  assert("Composant The 5g", bc.components[1].name === "Thé Vert Gunpowder" && bc.components[1].qty === 5);

  var infNoir = parseIngredientLine("Infusion thé noir : 200 ml");
  assert("Infusion thé noir -> ~2.5g sec", infNoir.name === "Thé Noir" && infNoir.qty === 2.5 && infNoir.unit === "g");

  var infVert = parseIngredientLine("Infusion thé vert : 200 ml");
  assert("Infusion thé vert -> ~2.5g sec", infVert.name === "Thé Vert Gunpowder" && infVert.qty === 2.5 && infVert.unit === "g");

  var eau = parseIngredientLine("Eau : 200 ml");
  assert("Eau -> Eau 200 ml", eau.name === "Eau" && eau.qty === 200 && eau.unit === "ml");
});

describe("escapeRegex securite", function() {
  assert("Eschappe +", escapeRegex("a+b") === "a\\+b");
  assert("Eschappe .", escapeRegex("a.b") === "a\\.b");
  assert("Eschappe ()", escapeRegex("a(b)") === "a\\(b\\)");
  assert("Chaine normale inchangee", escapeRegex("pizza") === "pizza");
});

describe("Matching contextuel POS & Parité PC/Mobile", function() {
  var p1 = findRecipeForProduct("FRUIT DE MER", "PANINI");
  assert("FRUIT DE MER (PANINI) -> Panini Fruit de Mer (non Pizza)", p1 && p1.id === "pa_fruits_de_mer");

  var p2 = findRecipeForProduct("POULET", "SANDWICHS CIABATTA");
  assert("POULET (SANDWICHS CIABATTA) -> Sandwich Ciabatta Poulet (non Pizza)", p2 && p2.id === "sw_poulet");

  var p3 = findRecipeForProduct("VIANDE HACHÉE", "SANDWICHS CIABATTA");
  assert("VIANDE HACHÉE (SANDWICHS CIABATTA) -> Sandwich Ciabatta VH (non Pizza)", p3 && p3.id === "sw_viande_hachee");

  var p4 = findRecipeForProduct("VIANDE HACHÉE", "PIZZA");
  assert("VIANDE HACHÉE (PIZZA) -> Pizza Viande Hachée", p4 && p4.id === "pz_viande_hachee");

  var p5 = findRecipeForProduct("POULET SAUCE BLANCHE", "PIZZA");
  assert("POULET SAUCE BLANCHE (PIZZA) -> Pizza Poulet", p5 && p5.id === "pz_poulet_sauce_blanche");

  var p6 = findRecipeForProduct("4 SAISONS", "PIZZA");
  assert("4 SAISONS (PIZZA) -> Pizza 4 Saisons", p6 && p6.id === "pz_4_saisons");

  var p7 = findRecipeForProduct("MIXTE", "PANINI");
  assert("MIXTE (PANINI) -> Panini Gourmand/Mix", p7 && p7.id === "pa_gourmand");
});

console.log("\n" + "=".repeat(60));
console.log("Resultats : " + passed + " passes  |  " + failed + " echoues  |  " + (passed+failed) + " total");
if (failed > 0) { errors.forEach(function(e){ console.log("  - " + e); }); process.exit(1); }
else { console.log("Tous les tests sont passes!"); }

