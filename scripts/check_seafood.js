import fs from 'fs';

const recipesCode = fs.readFileSync('recipes-data.js', 'utf8');
eval(recipesCode);
const DATA = globalThis.DATA;

const list = [
  { cat: 'PANINIS', name: 'FRUITS DE MER' },
  { cat: 'SANDWICHS', name: 'FRUITS DE MER' },
  { cat: 'PIZZA', name: 'FRUITS DE MER' },
  { cat: 'PÂTES', name: 'LASAGNE FRUITS DE MER' },
  { cat: 'PÂTES', name: 'FRUITS DE MER' },
  { cat: 'CRÊPES', name: 'CRÊPE PÊCHEUR' }
];

console.log('=== SEAFOOD PRODUCTS METRICS (40g Crevette + 40g Calamar) ===');
list.forEach(l => {
  const cat = DATA.find(c => c.category === l.cat);
  const it = cat ? cat.items.find(i => i.name === l.name) : null;
  if (it) {
    console.log(`${it.name.padEnd(22)} (${l.cat.padEnd(10)}) -> PV: ${it.sellPrice} DH | Coût: ${it.cost.toFixed(2)} DH | FC: ${it.foodCost.toFixed(1)}% | Marge: +${it.grossMarginDH.toFixed(2)} DH`);
  }
});
