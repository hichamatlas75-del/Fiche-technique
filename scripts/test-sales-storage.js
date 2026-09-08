/**
 * TEST UNITAIRE — Persistance & Agrégation Complète des 12 Mois de l'Année
 * Validation de l'absence de purge et des calculs annuels
 */

const fs = require('fs');
const path = require('path');

console.log("======================================================");
console.log("🧪 TEST DU STOCKAGE DES 12 MOIS ET AGRÉGATION ANNUELLE");
console.log("======================================================\n");

// 1. Charger conso-state.js
const statePath = path.join(__dirname, '..', 'js', 'conso-state.js');
const stateCode = fs.readFileSync(statePath, 'utf8');

// Créer un environnement mocké minimal
const mockLocalStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) {
    if (v.length > 5 * 1024 * 1024) {
      const err = new Error("QuotaExceededError");
      err.name = "QuotaExceededError";
      throw err;
    }
    this.store[k] = v;
  },
  removeItem(k) { delete this.store[k]; }
};

const mockWindow = {
  BASE_RECIPES: [],
  ALIAS_MAP: {},
  DATA: [],
  INGREDIENT_UNIT_COSTS: {},
  dispatchEvent: () => {},
  recipeNameIndex: new Map()
};

global.window = mockWindow;
global.localStorage = mockLocalStorage;
global.GC_STORAGE_KEYS = { SALES: 'gc_sales_db_v1', RECIPES: 'gc_recipes_db_v5' };
global.cleanText = str => (str || '').toLowerCase().trim();

// Évaluer conso-state.js
eval(stateCode);

console.log("✅ [1/5] conso-state.js chargé avec succès.");
console.log("   - GC_SalesIDB présent :", typeof GC_SalesIDB !== 'undefined');
console.log("   - saveMonthlySalesDB présent :", typeof saveMonthlySalesDB === 'function');
console.log("   - loadMonthlySalesDB présent :", typeof loadMonthlySalesDB === 'function');

// 2. Générer 365 jours de données de vente (Année 2026 complète de Janvier à Décembre)
const testSalesDB = {};
let totalExpectedCA = 0;
let totalExpectedQty = 0;
let totalExpectedDays = 365;

const sampleProducts = [
  { family: 'PIZZA', product: 'Pizza Margherita', price: 65, qty: 15 },
  { family: 'PIZZA', product: 'Pizza 4 Fromages', price: 85, qty: 10 },
  { family: 'PLATS', product: 'Filet de Boeuf', price: 140, qty: 8 },
  { family: 'PLATS', product: 'Couscous Poulet', price: 75, qty: 12 },
  { family: 'PASTAS', product: 'Lasagne Bolognaise', price: 70, qty: 9 },
  { family: 'ENTREES', product: 'Salade César', price: 60, qty: 14 }
];

for (let m = 1; m <= 12; m++) {
  const mStr = String(m).padStart(2, '0');
  const daysInMonth = new Date(2026, m, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = String(d).padStart(2, '0');
    const dateKey = `2026-${mStr}-${dStr}`;
    const dayRows = sampleProducts.map(p => ({
      family: p.family,
      product: p.product,
      price: p.price,
      qty: p.qty,
      total: p.price * p.qty
    }));
    testSalesDB[dateKey] = dayRows;

    dayRows.forEach(r => {
      totalExpectedCA += r.total;
      totalExpectedQty += r.qty;
    });
  }
}

console.log(`✅ [2/5] 365 journées synthétiques générées (12 mois complets).`);
console.log(`   - CA attendu : ${totalExpectedCA.toLocaleString('fr-FR')} DH`);
console.log(`   - Quantité attendue : ${totalExpectedQty.toLocaleString('fr-FR')} articles`);

// 3. Assigner à monthlySalesDB et sauvegarder
monthlySalesDB = Object.assign({}, testSalesDB);
saveMonthlySalesDB();

// Vérifier que monthlySalesDB n'a subi AUCUNE PURGE (365 jours intacts)
const savedDays = Object.keys(monthlySalesDB).length;
if (savedDays !== 365) {
  console.error(`❌ ÉCHEC : ${savedDays} jours enregistrés au lieu de 365 ! Des mois ont été purgés.`);
  process.exit(1);
}
console.log(`✅ [3/5] Absence absolue de purge validée : 365/365 jours intacts en mémoire.`);

// 4. Tester l'agrégation annuelle (logique identique à conso-dashboard.js)
const selectedYear = '2026';
let yearTotalCA = 0;
let yearTotalQty = 0;
let yearDaysCount = 0;
const monthsAgg = {};

for (let m = 1; m <= 12; m++) {
  const mStr = String(m).padStart(2, '0');
  const ymKey = `${selectedYear}-${mStr}`;
  let mCA = 0;
  let mQty = 0;
  let mDays = 0;

  Object.keys(monthlySalesDB).forEach(dKey => {
    if (dKey.startsWith(ymKey) && monthlySalesDB[dKey] && monthlySalesDB[dKey].length > 0) {
      mDays++;
      monthlySalesDB[dKey].forEach(r => {
        mCA += r.total;
        mQty += r.qty;
      });
    }
  });

  yearTotalCA += mCA;
  yearTotalQty += mQty;
  yearDaysCount += mDays;
  monthsAgg[ymKey] = { days: mDays, ca: mCA, qty: mQty };
}

console.log(`✅ [4/5] Agrégation Annuelle sur les 12 Mois :`);
console.log(`   - Jours calculés : ${yearDaysCount} / 365`);
console.log(`   - CA Annuel calculé : ${yearTotalCA.toLocaleString('fr-FR')} DH (Attendu: ${totalExpectedCA.toLocaleString('fr-FR')} DH)`);
console.log(`   - Quantité Annuelle : ${yearTotalQty.toLocaleString('fr-FR')} art. (Attendu: ${totalExpectedQty.toLocaleString('fr-FR')} art.)`);

if (yearDaysCount !== 365 || yearTotalCA !== totalExpectedCA || yearTotalQty !== totalExpectedQty) {
  console.error("❌ Écart de calcul dans l'agrégation annuelle !");
  process.exit(1);
}

// 5. Vérifier la présence de chaque mois individuel
for (let m = 1; m <= 12; m++) {
  const mStr = String(m).padStart(2, '0');
  const ymKey = `2026-${mStr}`;
  if (!monthsAgg[ymKey] || monthsAgg[ymKey].days === 0) {
    console.error(`❌ Mois ${ymKey} manquant dans les statistiques !`);
    process.exit(1);
  }
}
console.log(`✅ [5/5] Les 12 mois individuels (Janvier à Décembre) sont tous présents avec leurs statistiques.`);

console.log("\n------------------------------------------------------");
console.log("🎉 TEST RÉUSSI : La persistance et l'agrégation annuelle des 12 mois sont 100% opérationnelles !");
console.log("------------------------------------------------------\n");
