const fs = require('fs');
const path = require('path');

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripPlural(s) {
  return s.split(' ').map(w => (w.length > 3 && w.endsWith('s')) ? w.slice(0, -1) : w).join(' ');
}

const { INGREDIENT_UNIT_COSTS } = require('../js/ingredient-costs.js');
const { DATA } = require('../recipes-data.js');

const recipesDataPath = path.resolve('./recipes-data.js');
let recipesCode = fs.readFileSync(recipesDataPath, 'utf-8');

if (!DATA || !Array.isArray(DATA)) {
  console.error("DATA not found in recipes-data.js");
  process.exit(1);
}

let allStats = [];

DATA.forEach(cat => {
  cat.items.forEach(item => {
    let totalCost = 0;
    let details = [];

    (item.tech || []).forEach(line => {
      const parts = line.split(':');
      let ingName = parts[0].trim();
      let qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';

      const normIng = normalize(ingName);
      const normIngNoPlural = stripPlural(normIng);

      // Résolution intelligente Brut vs Net
      let lookupKey = normIngNoPlural;
      if (normIng.includes('calamar')) {
        lookupKey = (normIng.includes('net') || normIng.includes('chair') || normIng.includes('egoutt')) ? 'calamar net' : 'calamar brut';
      } else if (normIng.includes('crevette')) {
        lookupKey = (normIng.includes('chair') || normIng.includes('decortiqu') || normIng.includes('net') || normIng.includes('pur')) ? 'crevettes net' : 'crevettes brut';
      } else if (normIng.includes('gamba')) {
        if (normIng.includes('pane')) lookupKey = 'gambas pane';
        else if (normIng.includes('chair') || normIng.includes('poche') || normIng.includes('decortiqu') || normIng.includes('net')) lookupKey = 'gambas net';
        else lookupKey = 'gambas brut';
      } else if (normIng.includes('saumon')) {
        if (normIng.includes('fume')) lookupKey = 'saumon fume';
        else if (normIng.includes('carcasse') && !normIng.includes('sans')) lookupKey = 'saumon brut';
        else lookupKey = 'saumon frais net';
      } else if (normIng.includes('pizza') || normIng === 'pate' || normIng === 'pate pizza' || normIng === 'pate a pizza') {
        lookupKey = 'pate a pizza';
      } else if (normIng.includes('pate') || normIng.includes('pasta') || normIng.includes('spaghetti') || normIng.includes('tagliatelle') || normIng.includes('linguine') || normIng.includes('penne') || normIng.includes('rigatoni')) {
        if (!normIng.includes('crepe') && !normIng.includes('gaufre') && !normIng.includes('pistache')) {
          lookupKey = 'pates';
        }
      }

      let ingDef = INGREDIENT_UNIT_COSTS[lookupKey] || INGREDIENT_UNIT_COSTS[normIng] || INGREDIENT_UNIT_COSTS[normIngNoPlural];

      if (!ingDef) {
        const sortedKeys = Object.keys(INGREDIENT_UNIT_COSTS).sort((a, b) => b.length - a.length);
        for (const k of sortedKeys) {
          const normK = normalize(k);
          const normKNoPlural = stripPlural(normK);
          if (normIng === normK || normIngNoPlural === normKNoPlural || normIng.includes(normK) || normK.includes(normIng) || normIngNoPlural.includes(normKNoPlural) || normKNoPlural.includes(normIngNoPlural)) {
            ingDef = INGREDIENT_UNIT_COSTS[k];
            break;
          }
        }
      }

      if (!ingDef) {
        ingDef = { cost: 0.02, unit: "g" };
      }

      let qty = 1;
      const gMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
      const kgMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i);
      const mlMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);
      const clMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*cl\b/i);
      const lMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*l\b/i);
      const pMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*(?:p|piece|tranche|part|boule|sachet|portion|tr)\b/i);

      if (ingDef.unit === 'g') {
        if (gMatch) qty = parseFloat(gMatch[1].replace(',', '.'));
        else if (kgMatch) qty = parseFloat(kgMatch[1].replace(',', '.')) * 1000;
        else if (pMatch) qty = parseFloat(pMatch[1].replace(',', '.')) * 50;
        else qty = parseFloat(qtyStr.replace(',', '.')) || 1;
      } else if (ingDef.unit === 'ml') {
        if (mlMatch) qty = parseFloat(mlMatch[1].replace(',', '.'));
        else if (clMatch) qty = parseFloat(clMatch[1].replace(',', '.')) * 10;
        else if (lMatch) qty = parseFloat(lMatch[1].replace(',', '.')) * 1000;
        else qty = parseFloat(qtyStr.replace(',', '.')) || 100;
      } else { // 'piece'
        if (normIng.includes('canette') || normIng.includes('coca') || normIng.includes('sprite') || normIng.includes('hawai') || normIng.includes('poms') || normIng.includes('orangina') || normIng.includes('schweppes') || normIng.includes('red bull') || normIng.includes('bouteille')) {
          qty = 1;
        } else if (pMatch) {
          qty = parseFloat(pMatch[1].replace(',', '.'));
        } else {
          qty = parseFloat(qtyStr.replace(',', '.')) || 1;
        }
      }

      let lineCost = qty * ingDef.cost;
      totalCost += lineCost;

      details.push({
        ingredient: ingName,
        quantity: qtyStr,
        cost: Math.round(lineCost * 100) / 100
      });
    });

    const sellPrice = parseFloat(String(item.price || item.sellPrice || '0').replace(/[^0-9.]/g, ''));
    const finalCost = Math.round(totalCost * 100) / 100;
    const foodCostPct = sellPrice > 0 ? Math.round((finalCost / sellPrice) * 1000) / 10 : 0;
    const marginPct = sellPrice > 0 ? Math.round(((sellPrice - finalCost) / sellPrice) * 1000) / 10 : 0;
    const grossMarginDH = sellPrice > 0 ? Math.round((sellPrice - finalCost) * 100) / 100 : 0;

    item.cost = finalCost;
    item.sellPrice = sellPrice;
    item.foodCost = foodCostPct;
    item.margin = marginPct;
    item.grossMarginDH = grossMarginDH;

    allStats.push({
      category: cat.category,
      name: item.name,
      sellPrice: sellPrice,
      cost: finalCost,
      foodCostPct: foodCostPct,
      marginPct: marginPct,
      grossMarginDH: grossMarginDH,
      details: details
    });
  });
});

console.log(`\n======================================================`);
console.log(`SYNTHÈSE DU CALCUL DU FOOD COST PARFAITEMENT ÉTALONNÉ (${allStats.length} ARTICLES)`);
console.log(`======================================================\n`);

const formattedDATA = JSON.stringify(DATA, null, 2);
const section2Marker = "const BASE_RECIPES = ";
const dataStartIndex = recipesCode.indexOf("const DATA = ");
const dataEndIndex = recipesCode.indexOf(section2Marker);

if (dataStartIndex !== -1 && dataEndIndex !== -1) {
  const newFullCode = recipesCode.slice(0, dataStartIndex + "const DATA = ".length) + formattedDATA + ";\n\n" + recipesCode.slice(dataEndIndex);
  fs.writeFileSync(recipesDataPath, newFullCode, 'utf-8');
  console.log("\nFichier recipes-data.js mis à jour avec les coûts matières et marges !");
} else {
  console.error("Erreur: Impossible de localiser DATA ou BASE_RECIPES dans recipes-data.js");
  process.exit(1);
}
fs.writeFileSync('scripts/food_cost_summary.json', JSON.stringify(allStats, null, 2), 'utf-8');
