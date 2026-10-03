/**
 * TEST UNITAIRE & INTÉGRATION : Mise à jour du Simulateur Décisionnel lors de l'import d'une vente journalière
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("==================================================================");
console.log("🧪 TEST SIMULATEUR DÉCISIONNEL : MISE À JOUR IMPORT VENTE JOURNÉE");
console.log("==================================================================\n");

// 1. Charger le fichier SYNTHESE_DECISIONNELLE_MENU.html et extraire les fonctions JS clés
const htmlPath = path.join(__dirname, '..', 'SYNTHESE_DECISIONNELLE_MENU.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Extraction du bloc script principal
const scriptMatch = htmlContent.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/i);
assert(scriptMatch, "Bloc script trouvé dans SYNTHESE_DECISIONNELLE_MENU.html");

// Simuler l'environnement DOM
const localStorageStore = {};
const mockLocalStorage = {
  getItem: (k) => localStorageStore[k] || null,
  setItem: (k, v) => { localStorageStore[k] = String(v); },
  removeItem: (k) => { delete localStorageStore[k]; },
  clear: () => { for (let k in localStorageStore) delete localStorageStore[k]; }
};

const domElements = {};
function getOrCreateElement(id) {
  if (!domElements[id]) {
    domElements[id] = {
      id,
      innerText: '',
      innerHTML: '',
      style: {},
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      parentNode: {
        insertBefore: (newNode, refNode) => {}
      }
    };
  }
  return domElements[id];
}

const mockDocument = {
  getElementById: (id) => getOrCreateElement(id),
  querySelectorAll: (selector) => [],
  createElement: (tag) => ({
    tagName: tag,
    style: {},
    classList: { add: () => {}, remove: () => {} },
    appendChild: () => {}
  }),
  body: {
    appendChild: () => {}
  },
  addEventListener: () => {}
};

const mockWindow = {
  localStorage: mockLocalStorage,
  document: mockDocument,
  addEventListener: () => {},
  dispatchEvent: () => {}
};

global.window = mockWindow;
global.document = mockDocument;
global.localStorage = mockLocalStorage;

// Charger recipes-data.js pour avoir ALIAS_MAP
const recipesData = require('../recipes-data.js');
global.ALIAS_MAP = recipesData.ALIAS_MAP;

// Exécuter le code du script HTML dans un contexte isolé en exposant les variables
eval(scriptMatch[1] + `
global.menuData = menuData;
global.INITIAL_MENU_DATA = INITIAL_MENU_DATA;
global.PERIOD_METADATA = PERIOD_METADATA;
global.applyDailySalesData = applyDailySalesData;
global.selectCalendarPeriod = selectCalendarPeriod;
global.extractDateFromFilename = extractDateFromFilename;
global.formatIsoDateToFrench = formatIsoDateToFrench;
`);

console.log("✅ [1/5] Script SYNTHESE_DECISIONNELLE_MENU.html initialisé avec succès.");
assert(typeof applyDailySalesData === 'function', "applyDailySalesData existe");
assert(typeof selectCalendarPeriod === 'function', "selectCalendarPeriod existe");
assert(typeof extractDateFromFilename === 'function', "extractDateFromFilename existe");
assert(typeof formatIsoDateToFrench === 'function', "formatIsoDateToFrench existe");

// 2. Tester extractDateFromFilename et formatIsoDateToFrench
console.log("\n--- TEST [2/5] Détection et formatage des dates de vente ---");
assert.strictEqual(extractDateFromFilename('Fin_Journée_20261002.xls'), '2026-10-02');
assert.strictEqual(extractDateFromFilename('Ventes_2026-10-03.xlsx'), '2026-10-03');
assert.strictEqual(extractDateFromFilename('02-10-2026_cloture.csv'), '2026-10-02');
assert.strictEqual(formatIsoDateToFrench('2026-10-02'), '2 octobre 2026');
console.log("✅ [2/5] Extraction et formatage des dates : 100% conformes.");

// 3. Tester applyDailySalesData avec un fichier de vente journalière
console.log("\n--- TEST [3/5] Application des ventes journalières dans le simulateur ---");
const sampleDailyPayload = {
  date: "2 Octobre 2026",
  fileName: "Fin_Journée_20261002.xls",
  totalCA: 9960,
  totalQty: 317,
  items: [
    { id: "2870e2fd", name: "CAFE NOIR", price: 16, qty: 74, ca: 1184 },
    { id: "a2351075", name: "PANINI MIX", price: 58, qty: 3, ca: 174 },
    { id: "2c0ab4a2", name: "Pizza 4 Saisons", price: 88, qty: 4, ca: 352 },
    { id: "b3a02657", name: "Pizza Margarita", price: 52, qty: 2, ca: 104 }
  ]
};

// Sauvegarder la base ALL d'un article pour vérification ultérieure
const cafeItem = menuData.find(m => m.id === "2870e2fd");
assert(cafeItem, "Café noir trouvé dans menuData");
const cafeBaseQty = cafeItem.baseQty;
const cafeBaseCA = cafeItem.baseCA;

applyDailySalesData(sampleDailyPayload, sampleDailyPayload.fileName, true);

// Vérifier que PERIOD_METADATA['LATEST_DAY'] a été enregistré
assert(PERIOD_METADATA['LATEST_DAY'], "Période LATEST_DAY enregistrée dans PERIOD_METADATA");
assert.strictEqual(PERIOD_METADATA['LATEST_DAY'].days, 1, "Nombre de jours = 1 pour LATEST_DAY");
assert(PERIOD_METADATA['LATEST_DAY'].badge.includes('2 OCTOBRE 2026'), "Badge contient la date");

// Vérifier que menuData a été mis à jour avec les ventes du jour
assert.strictEqual(cafeItem.qty, 74, "Quantité Café Noir mise à jour à 74 pour la journée");
assert.strictEqual(cafeItem.ca, 1184, "CA Café Noir mis à jour à 1184 DH");
assert.strictEqual(cafeItem.monthlyQty, 74 * 30, "Projection mensuelle extrapolée sur 30j");

const paniniMixItem = menuData.find(m => m.id === "a2351075");
assert(paniniMixItem, "Panini Mix trouvé dans menuData");
assert.strictEqual(paniniMixItem.qty, 3, "Quantité Panini Mix mise à jour à 3");

// Vérifier qu'un article non vendu ce jour a qty = 0
const unsoldItem = menuData.find(m => m.id !== "2870e2fd" && m.id !== "a2351075" && m.id !== "2c0ab4a2" && m.id !== "b3a02657");
assert(unsoldItem, "Article non vendu trouvé");
assert.strictEqual(unsoldItem.qty, 0, "Article non vendu a bien qty = 0 pour la journée");
assert.strictEqual(unsoldItem.ca, 0, "Article non vendu a bien ca = 0");

console.log("✅ [3/5] Simulateur et menuData mis à jour avec les données de la journée :");
console.log(`   - Café Noir : ${cafeItem.qty} ventes (${cafeItem.ca} DH)`);
console.log(`   - Panini Mix : ${paniniMixItem.qty} ventes (${paniniMixItem.ca} DH)`);
console.log(`   - Article non vendu : ${unsoldItem.name} -> ${unsoldItem.qty} vente`);

// 4. Tester la persistance dans localStorage
console.log("\n--- TEST [4/5] Persistance locale gc_latest_daily_sales ---");
const storedRaw = mockLocalStorage.getItem('gc_latest_daily_sales');
assert(storedRaw, "gc_latest_daily_sales présent dans localStorage");
const stored = JSON.parse(storedRaw);
assert.strictEqual(stored.date, "2 Octobre 2026");
assert.strictEqual(stored.totalCA, 9960);
assert.strictEqual(stored.totalQty, 317);
console.log("✅ [4/5] Données de la journée correctement enregistrées dans localStorage.");

// 5. Tester le retour à la vue 'ALL' (Cumul 166 jours) sans corruption des données
console.log("\n--- TEST [5/5] Rétablissement de la vue globale 'ALL' ---");
selectCalendarPeriod('ALL');

assert.strictEqual(cafeItem.qty, cafeBaseQty, "Café Noir a retrouvé sa baseQty originale");
assert.strictEqual(cafeItem.ca, cafeBaseCA, "Café Noir a retrouvé son baseCA original");
assert(unsoldItem.qty === unsoldItem.baseQty, "Article non vendu a retrouvé sa baseQty");

console.log("✅ [5/5] Basculement parfait entre Journée et Cumul Global 166 jours (aucune corruption).");

console.log("\n==================================================================");
console.log("🎉 TOUS LES TESTS DU SIMULATEUR DÉCISIONNEL SONT PASSÉS À 100% !");
console.log("==================================================================\n");
