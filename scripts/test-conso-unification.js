const assert = require('assert');

// Mock browser environment
const mockWindow = {
  BASE_RECIPES: [],
  ALIAS_MAP: {},
  DATA: [],
  INGREDIENT_UNIT_COSTS: {},
  recipeNameIndex: new Map(),
  cleanText: s => String(s || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim()
};
global.window = mockWindow;
global.cleanText = mockWindow.cleanText;

const rData = require('../recipes-data.js');
global.activeRecipes = rData.BASE_RECIPES || [];
global.ALIAS_MAP = rData.ALIAS_MAP || {};
mockWindow.activeRecipes = global.activeRecipes;
mockWindow.ALIAS_MAP = global.ALIAS_MAP;
mockWindow.DATA = rData.DATA || [];

global.activeRecipes.forEach(r => {
  if (r && r.name) mockWindow.recipeNameIndex.set(mockWindow.cleanText(r.name), r);
});

// UI mocks for processSalesAndCalculateStock
global.renderDashboard = () => {};
global.renderSummaryTable = () => {};
global.renderSalesTable = () => {};
global.renderMenuEngineeringMatrix = () => {};
global.renderComparatorTab = () => {};
global.selectedYearMonth = '2026-10';
global.selectedDate = '2026-10-23';

const consoProc = require('../js/conso-processing.js');

console.log('Testing Canonical Product Name Resolver...');

// Test 1: Emincé de poulet variations
const emince1 = consoProc.getCanonicalProductName('ÉMINCÉ DE POULET À LA CRÈME DE CHAMPIGNONS', 'PLATS');
const emince2 = consoProc.getCanonicalProductName('Plat Emince De Poulet', 'PLATS');
const emince3 = consoProc.getCanonicalProductName('EMINCE DE POULET A LA CREME', 'PLATS');
assert.strictEqual(emince1, 'ÉMINCÉ DE POULET');
assert.strictEqual(emince2, 'ÉMINCÉ DE POULET');
assert.strictEqual(emince3, 'ÉMINCÉ DE POULET');
console.log('  ✅ Emincé de poulet variations all resolve to ÉMINCÉ DE POULET');

// Test 2: Pavé de saumon variations
const saumon1 = consoProc.getCanonicalProductName('PLAT PAVE DE SAUMON', 'PLATS');
const saumon2 = consoProc.getCanonicalProductName('PAVE DE SAUMON A LA PLANCHA', 'PLATS');
const saumon3 = consoProc.getCanonicalProductName('Plat Pave De Saumon', 'PLATS');
assert.strictEqual(saumon1, 'PAVÉ DE SAUMON');
assert.strictEqual(saumon2, 'PAVÉ DE SAUMON');
assert.strictEqual(saumon3, 'PAVÉ DE SAUMON');
console.log('  ✅ Pavé de saumon variations all resolve to PAVÉ DE SAUMON');

// Test 3: Roulade variations
const roulade1 = consoProc.getCanonicalProductName('ROULADE DE VIANDE HACHEE', 'PLATS');
const roulade2 = consoProc.getCanonicalProductName('ROULADE DE BOEUF VH', 'PLATS');
assert.strictEqual(roulade1, 'ROULADE DE BŒUF VH');
assert.strictEqual(roulade2, 'ROULADE DE BŒUF VH');
console.log('  ✅ Roulade variations all resolve to ROULADE DE BŒUF VH');

// Test 4: Lasagne variations
const lasagne1 = consoProc.getCanonicalProductName('LASAGNE BOLONAISE', 'PASTA');
const lasagne2 = consoProc.getCanonicalProductName('LASAGNE BOLOGNAISE', 'PASTA');
assert.strictEqual(lasagne1, 'LASAGNE BOLOGNAISE');
assert.strictEqual(lasagne2, 'LASAGNE BOLOGNAISE');
console.log('  ✅ Lasagne variations all resolve to LASAGNE BOLOGNAISE');

// Test 5: processSalesAndCalculateStock aggregation test
const rawRows = [
  { product: 'ÉMINCÉ DE POULET À LA CRÈME DE CHAMPIGNONS', family: 'PLATS', qty: 377, total: 33176 },
  { product: 'Plat Emince De Poulet', family: 'PLATS', qty: 256, total: 21384 },
  { product: 'PLAT PAVE DE SAUMON', family: 'PLATS', qty: 100, total: 14500 },
  { product: 'PAVE DE SAUMON A LA PLANCHA', family: 'PLATS', qty: 50, total: 7250 },
  { product: 'LASAGNE BOLONAISE', family: 'PASTA', qty: 13, total: 936 },
  { product: 'LASAGNE BOLOGNAISE', family: 'PASTA', qty: 166, total: 11952 }
];

consoProc.processSalesAndCalculateStock(rawRows);

assert.strictEqual(global.currentSalesData.length, 3, 'Should aggregate 6 duplicate rows into exactly 3 unified dishes');

const eminceEntry = global.currentSalesData.find(s => s.product === 'ÉMINCÉ DE POULET');
assert(eminceEntry, 'ÉMINCÉ DE POULET entry must exist');
assert.strictEqual(eminceEntry.qty, 377 + 256, 'Quantities must be summed (633)');
assert.strictEqual(eminceEntry.total, 33176 + 21384, 'Totals must be summed (54560)');
assert(eminceEntry.matchedRecipe, 'Must match recipe');
assert.strictEqual(eminceEntry.matchedRecipe.id, 'pl_emince_de_poulet');
assert.strictEqual(eminceEntry.rawVariants.size, 2, 'Should track 2 raw variants');
console.log('  ✅ Aggregation test passed: ÉMINCÉ DE POULET unified correctly (Qty: 633, CA: 54,560 DH, 2 variants)');

const saumonEntry = global.currentSalesData.find(s => s.product === 'PAVÉ DE SAUMON');
assert(saumonEntry, 'PAVÉ DE SAUMON entry must exist');
assert.strictEqual(saumonEntry.qty, 150);
assert.strictEqual(saumonEntry.total, 21750);
assert.strictEqual(saumonEntry.matchedRecipe.id, 'pl_pave_de_saumon');
console.log('  ✅ Aggregation test passed: PAVÉ DE SAUMON unified correctly (Qty: 150, CA: 21,750 DH)');

const lasagneEntry = global.currentSalesData.find(s => s.product === 'LASAGNE BOLOGNAISE');
assert(lasagneEntry, 'LASAGNE BOLOGNAISE entry must exist');
assert.strictEqual(lasagneEntry.qty, 179);
assert.strictEqual(lasagneEntry.total, 12888);
assert.strictEqual(lasagneEntry.matchedRecipe.id, 'pae_lasagne_bolognaise');
console.log('  ✅ Aggregation test passed: LASAGNE BOLOGNAISE unified correctly (Qty: 179, CA: 12,888 DH)');

console.log('\n🎉 ALL UNIFICATION TESTS PASSED SUCCESSFULLY!');
