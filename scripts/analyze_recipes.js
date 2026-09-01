import fs from 'fs';
import path from 'path';

const recipesCode = fs.readFileSync('recipes-data.js', 'utf8');
eval(recipesCode);
const DATA = globalThis.DATA;

const stats = [];
DATA.forEach(cat => {
  cat.items.forEach(item => {
    stats.push({
      category: cat.category,
      name: item.name,
      sellPrice: item.sellPrice,
      cost: item.cost,
      foodCost: item.foodCost,
      margin: item.margin,
      grossMarginDH: item.grossMarginDH,
      tech: item.tech
    });
  });
});

console.log('=== TOTAL ITEMS ===', stats.length);

// Top 20 Highest Food Cost %
const topFC = [...stats].sort((a,b) => b.foodCost - a.foodCost).slice(0, 25);
console.log('\n=== TOP 25 PLATS AVEC LE PLUS FORT FOOD COST % (PERTE DE RENTABILITÉ) ===');
topFC.forEach(i => console.log(`${i.foodCost}% (Coût: ${i.cost} DH / PV: ${i.sellPrice} DH / Marge: ${i.grossMarginDH} DH) -> [${i.category}] ${i.name}`));

// Categories summary
const catSummary = {};
stats.forEach(i => {
  if (!catSummary[i.category]) catSummary[i.category] = { count: 0, sumCost: 0, sumPrice: 0, sumMargin: 0 };
  catSummary[i.category].count++;
  catSummary[i.category].sumCost += i.cost;
  catSummary[i.category].sumPrice += i.sellPrice;
  catSummary[i.category].sumMargin += i.grossMarginDH;
});

console.log('\n=== SYNTHÈSE GLOBALE PAR CATÉGORIE (DU PLUS CHER AU MOINS CHER EN FC %) ===');
Object.entries(catSummary)
  .map(([k, v]) => ({
    category: k,
    count: v.count,
    avgFC: parseFloat((v.sumCost / v.sumPrice * 100).toFixed(1)),
    avgMargin: parseFloat((v.sumMargin / v.count).toFixed(1)),
    avgCost: parseFloat((v.sumCost / v.count).toFixed(1)),
    avgPrice: parseFloat((v.sumPrice / v.count).toFixed(1))
  }))
  .sort((a, b) => b.avgFC - a.avgFC)
  .forEach(c => {
    console.log(`[${c.category.padEnd(28)}] (${String(c.count).padStart(2)} articles) | FC Moyen: ${String(c.avgFC).padStart(4)}% | Coût Moyen: ${String(c.avgCost).padStart(5)} DH | PV Moyen: ${String(c.avgPrice).padStart(5)} DH | Marge Moyenne: ${String(c.avgMargin).padStart(5)} DH`);
  });

// Analyse des ingrédients sur-consommés
const ingredientCounts = {};
stats.forEach(item => {
  (item.tech || []).forEach(line => {
    const parts = line.split(':');
    const ing = parts[0].trim().toLowerCase();
    const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';
    if (!ingredientCounts[ing]) ingredientCounts[ing] = { count: 0, examples: [] };
    ingredientCounts[ing].count++;
    if (ingredientCounts[ing].examples.length < 3) {
      ingredientCounts[ing].examples.push(`${item.name} (${qtyStr})`);
    }
  });
});

console.log('\n=== INGRÉDIENTS LES PLUS UTILISÉS DANS LES FICHES ===');
Object.entries(ingredientCounts)
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 20)
  .forEach(([k, v]) => {
    console.log(`${k.padEnd(25)} : présent dans ${v.count} recettes | Exemples: ${v.examples.join(', ')}`);
  });
