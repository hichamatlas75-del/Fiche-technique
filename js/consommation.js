/* ========================================================
   1. BASE DE DONNÉES & ALIAS CENTRALISÉS (recipes-data.js)
======================================================== */
const BASE_RECIPES = window.BASE_RECIPES || [];
const ALIAS_MAP = window.ALIAS_MAP || {};
const DATA = window.DATA || window.CATEGORIES_DATA || [];
const INGREDIENT_UNIT_COSTS = window.INGREDIENT_UNIT_COSTS || {};

function calculateRecipeFoodCost(ingredients, sellPrice) {
  if (typeof window.calculateRecipeFoodCost === 'function' && window.calculateRecipeFoodCost !== calculateRecipeFoodCost) {
    return window.calculateRecipeFoodCost(ingredients, sellPrice);
  }
  let totalCost = 0;
  const breakdown = [];
  const validSellPrice = typeof sellPrice === 'number' && sellPrice > 0 ? sellPrice : parseFloat(String(sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
  const costMap = window.INGREDIENT_UNIT_COSTS || INGREDIENT_UNIT_COSTS;

  (ingredients || []).forEach(line => {
    if (!line || typeof line !== 'string') return;
    const parts = line.split(':');
    const ingName = parts[0].trim();
    const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';

    const normIng = (ingName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    let ingDef = costMap[normIng];

    if (!ingDef) {
      const sortedKeys = Object.keys(costMap).sort((a, b) => b.length - a.length);
      for (const k of sortedKeys) {
        if (normIng.includes(k) || k.includes(normIng)) {
          ingDef = costMap[k];
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
    } else {
      if (normIng.includes('canette') || normIng.includes('coca') || normIng.includes('sprite') || normIng.includes('hawai') || normIng.includes('poms') || normIng.includes('orangina') || normIng.includes('schweppes') || normIng.includes('red bull') || normIng.includes('bouteille')) {
        qty = 1;
      } else if (pMatch) {
        qty = parseFloat(pMatch[1].replace(',', '.'));
      } else {
        qty = parseFloat(qtyStr.replace(',', '.')) || 1;
      }
    }

    const lineCost = qty * ingDef.cost;
    totalCost += lineCost;

    breakdown.push({
      ingredient: ingName,
      quantity: qtyStr,
      qtyNumber: qty,
      unit: ingDef.unit,
      unitPrice: ingDef.cost,
      cost: Math.round(lineCost * 100) / 100
    });
  });

  const finalCost = Math.round(totalCost * 100) / 100;
  const foodCostPct = validSellPrice > 0 ? Math.round((finalCost / validSellPrice) * 1000) / 10 : 0;
  const marginPct = validSellPrice > 0 ? Math.round(((validSellPrice - finalCost) / validSellPrice) * 1000) / 10 : 0;
  const grossMarginDH = validSellPrice > 0 ? Math.round((validSellPrice - finalCost) * 100) / 100 : 0;

  return {
    cost: finalCost,
    sellPrice: validSellPrice,
    foodCost: foodCostPct,
    margin: marginPct,
    grossMarginDH: grossMarginDH,
    breakdown: breakdown
  };
}
window.calculateRecipeFoodCost = calculateRecipeFoodCost;

/* ========================================================
   3. GESTION DU STOCKAGE DES RECETTES & BASE DE VENTES MENSUELLE
======================================================== */
let activeRecipes = [];
let monthlySalesDB = {}; // Format: { "YYYY-MM-DD": [ { family, product, price, qty, total }, ... ] }
let currentViewMode = 'day'; // 'day' ou 'month'
let selectedDate = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' (local timezone)
let selectedYearMonth = selectedDate.slice(0, 7); // 'YYYY-MM'

let currentSalesData = [];
let currentSalesFilter = 'all'; // 'all', 'matched', 'unmatched'
let aggregatedIngredients = [];

function loadRecipes() {
  try {
    const saved = localStorage.getItem('gc_recipes_db_v4');
    if (saved) {
      activeRecipes = JSON.parse(saved);
    } else {
      activeRecipes = JSON.parse(JSON.stringify(BASE_RECIPES));
    }
  } catch (e) {
    activeRecipes = JSON.parse(JSON.stringify(BASE_RECIPES));
  }
  // Build recipe index for O(1) lookups
  window.recipeNameIndex = new Map();
  activeRecipes.forEach(r => {
    window.recipeNameIndex.set(cleanText(r.name), r);
  });

  // Normalize ALIAS_MAP keys with cleanText
  window.cleanAliasMap = {};
  for (const [key, val] of Object.entries(ALIAS_MAP)) {
    window.cleanAliasMap[cleanText(key)] = val;
  }

  // Initialiser la liste déroulante des ingrédients de l'Audit Flash
  if (typeof initAuditFlashDropdown === 'function') {
    initAuditFlashDropdown();
  }
}

function saveRecipes() {
  try {
    localStorage.setItem('gc_recipes_db_v4', JSON.stringify(activeRecipes));
  } catch (e) {
    console.warn('[LocalStorage] Erreur sauvegarde recettes:', e);
  }
}

function loadMonthlySalesDB() {
  try {
    const saved = localStorage.getItem('gc_monthly_sales_db_v3');
    if (saved) {
      monthlySalesDB = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('[LocalStorage] Erreur chargement ventes:', e);
    monthlySalesDB = {};
  }
}

function saveMonthlySalesDB() {
  try {
    localStorage.setItem('gc_monthly_sales_db_v3', JSON.stringify(monthlySalesDB));
  } catch (e) {
    console.warn('[LocalStorage] Erreur sauvegarde ventes:', e);
  }
}

/* ========================================================
   4. NORMALISATION & MATCHING INTELLIGENT
======================================================== */
function cleanText(str) {
  if (!str) return '';
  return str.toString()
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'oe')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findRecipeForProduct(rawName, rawFamille = '') {
  const cName = cleanText(rawName);
  const cFam = cleanText(rawFamille);

  // 1. Détection prioritaire des produits spécifiques (Brochettes, Couscous, Salades, Suppléments, Paninis, Œufs, Croquettes...)
  if (cName.includes('brochette')) {
    return activeRecipes.find(x => x.id === 'plat_brochette_poulet');
  }
  if (cName.includes('couscous')) {
    return activeRecipes.find(x => x.id === 'plat_couscous_poulet');
  }
  if (cName.includes('boulette')) {
    return activeRecipes.find(x => x.id === 'ec_boulettes_poulet');
  }
  if (cName.includes('croquette')) {
    return activeRecipes.find(x => x.id === 'ec_croquettes_fromage') || activeRecipes.find(x => x.id === 'ec_boulettes_de_poulet_au_fromage');
  }
  if (cName.includes('emince') && cName.includes('boeuf')) {
    return activeRecipes.find(x => x.id === 'pl_emince_de_boeuf');
  }
  if (cName.includes('filet') && cName.includes('boeuf')) {
    return activeRecipes.find(x => x.id === 'pl_filet_de_boeuf');
  }
  if (cName.includes('roulade')) {
    return activeRecipes.find(x => x.id === 'pl_roulade_de_boeuf_vh');
  }
  if (/\boeufs?\b/i.test(cName) && !cName.includes('boeuf')) {
    if (cName.includes('beldi')) return activeRecipes.find(x => x.id === 'alc_oeufs_beldi');
    if (cName.includes('fromage')) return activeRecipes.find(x => x.id === 'alc_omlette_fromage');
    if (cName.includes('nature') || cName.includes('omlette') || cName.includes('omelette')) return activeRecipes.find(x => x.id === 'alc_omlette_nature');
    if (cName.includes('chef')) return activeRecipes.find(x => x.id === 'alc_omlette_chef');
    return activeRecipes.find(x => x.id === 'sup_supplement_oeufs');
  }
  if (cName.startsWith('sup ') || cName.startsWith('supplement')) {
    if (cName.includes('charcuterie')) return activeRecipes.find(x => x.id === 'sup_supplement_charcuterie');
    if (cName.includes('fromage')) return activeRecipes.find(x => x.id === 'sup_supplement_fromage');
    if (cName.includes('poulet')) return activeRecipes.find(x => x.id === 'sup_supplement_poulet');
    if (cName.includes('viande')) return activeRecipes.find(x => x.id === 'sup_supplement_viande');
    if (cName.includes('oeuf')) return activeRecipes.find(x => x.id === 'sup_supplement_oeufs');
  }
  if (cName.includes('compose')) {
    if (cName.includes('pizza') || cFam.includes('pizza')) return activeRecipes.find(x => x.id === 'sup_pizza_composee_au_choix');
    return activeRecipes.find(x => x.id === 'sal_composee_au_choix');
  }
  if (cName.includes('panini')) {
    if (cName.includes('poulet')) return activeRecipes.find(x => x.id === 'pa_poulet');
    if (cName.includes('charcuterie')) return activeRecipes.find(x => x.id === 'pa_charcuterie');
    if (cName.includes('viande') || cName.includes('hache')) return activeRecipes.find(x => x.id === 'pa_viande_hachee');
    if (cName.includes('mix') || cName.includes('gourmand')) return activeRecipes.find(x => x.id === 'pa_gourmand');
    if (cName.includes('saumon')) return activeRecipes.find(x => x.id === 'pa_saumon');
    if (cName.includes('mer') || cName.includes('fruit')) return activeRecipes.find(x => x.id === 'pa_fruits_de_mer');
  }

  // Traitement spécifique des produits "A LA CARTE" (Boulangerie, Viennoiseries, Omelettes seules sans formule pdj)
  if (cFam === 'a la carte' || cFam.includes('carte') || cFam.includes('boulangerie')) {
    if (cName.includes('baghrir')) return activeRecipes.find(x => x.id === 'alc_baghrir');
    if (cName.includes('msemen') || cName.includes('mlaoui')) return activeRecipes.find(x => x.id === 'alc_msemen');
    if (cName.includes('viennoiserie') || cName.includes('croissant')) return activeRecipes.find(x => x.id === 'alc_viennoiserie');
    if (cName.includes('harcha')) return activeRecipes.find(x => x.id === 'alc_harcha');
    if (cName.includes('fromage')) return activeRecipes.find(x => x.id === 'alc_omlette_fromage');
    if (cName.includes('chef')) return activeRecipes.find(x => x.id === 'alc_omlette_chef');
    if (cName.includes('nature') || cName.includes('omlette') || cName.includes('omelette')) return activeRecipes.find(x => x.id === 'alc_omlette_nature');
  }

  // 2. Alias direct
  const aliasMap = window.cleanAliasMap || ALIAS_MAP;
  if (aliasMap[cName]) {
    const r = activeRecipes.find(x => x.id === aliasMap[cName]);
    if (r) return r;
  }

  // 3. Nettoyage de préfixes habituels de caisse
  let simplified = cName
    .replace(/^pet dej\s+/, '')
    .replace(/^plat\s+/, '')
    .replace(/^pizza\s+/, '')
    .replace(/^pasta\s+/, '')
    .replace(/^sandwichs ciabatta\s+/, '')
    .replace(/^sandwichs\s+/, '')
    .replace(/^sandwich\s+/, '')
    .replace(/^crepes salees\s+/, '')
    .replace(/^crepes sucree\s+/, '')
    .replace(/^crepes\s+/, '')
    .replace(/^crepe\s+/, '')
    .replace(/^gauffres\s+/, '')
    .replace(/^gauffre\s+/, '')
    .replace(/^gaufres\s+/, '')
    .replace(/^gaufre\s+/, '')
    .replace(/^milkshakes\s+/, '')
    .replace(/^milkshake\s+/, '')
    .replace(/^pain cake\s+/, '')
    .replace(/^pancake\s+/, '')
    .replace(/^supplement cuisine\s+/, '')
    .replace(/^supplement ptdej\s+/, '')
    .replace(/^supplement\s+/, '')
    .trim();

  if (aliasMap[simplified]) {
    const r = activeRecipes.find(x => x.id === aliasMap[simplified]);
    if (r) return r;
  }

  // 4. Fast O(1) exact match via index
  if (window.recipeNameIndex && window.recipeNameIndex.has(cName)) return window.recipeNameIndex.get(cName);
  if (window.recipeNameIndex && window.recipeNameIndex.has(simplified)) return window.recipeNameIndex.get(simplified);

  // 5. Recherche par mot entier (Regex word boundary)
  for (const r of activeRecipes) {
    const rClean = cleanText(r.name);
    if (rClean.length > 2) {
      const reg = new RegExp('\\b' + rClean + '\\b', 'i');
      if (reg.test(cName) || (rClean.length > 4 && reg.test(simplified))) {
        return r;
      }
    }
  }

  return null;
}

/* ========================================================
   5. PARSER D'INGRÉDIENTS & SYNCHRONISATION DES CATÉGORIES
======================================================== */
// Dictionnaire configurable pour la catégorisation des ingrédients
const INGREDIENT_CATEGORIES = window.INGREDIENT_CATEGORIES || {
  viandes: ['viande', 'boeuf', 'bœuf', 'filet', 'steak', 'poulet', 'merguez', 'saucisse', 'dinde', 'charcuterie', 'khli', 'bacon', 'pepperoni', 'nugget'],
  poissons: ['saumon', 'crevette', 'gambas', 'calamar', 'moule', 'thon', 'mer', 'poisson'],
  fromages: ['oeuf', 'œuf', 'omelette', 'fromage', 'mozzarella', 'parmesan', 'cheddar', 'edam', 'gouda', 'jben', 'beurre', 'creme', 'crème', 'lait', 'yaourt', 'ricotta', 'burrata', 'brie', 'bleu'],
  boissons: ['eau', 'oulmes', 'coca', 'sprite', 'hawai', 'poms', 'schweppes', 'orangina', 'red bull', 'nespresso', 'pastille', 'cafe', 'café', 'the', 'thé', 'verveine', 'infusion', 'chocolat', 'sirop', 'glacon', 'glaçon', 'glace', 'boba', 'boisson chaude'],
  legumes: ['tomate', 'oignon', 'champignon', 'pomme de terre', 'frite', 'puree', 'potatos', 'avocat', 'salade', 'mesclun', 'laitue', 'roquette', 'epinard', 'épinard', 'poivron', 'radis', 'carotte', 'concombre', 'betterave', 'olive', 'orange', 'citron', 'fraise', 'framboise', 'mangue', 'banane', 'pomme', 'ananas', 'peche', 'pêche', 'kiwi', 'fruits', 'fruit', 'menthe', 'agrumes', 'acai', 'haricot', 'courgette', 'brocoli', 'persil']
};

function categorizeIngredient(name) {
  const n = cleanText(name);
  for (const [category, keywords] of Object.entries(INGREDIENT_CATEGORIES)) {
    if (keywords.some(kw => n.includes(kw))) return category;
  }
  return 'epicerie'; // Catégorie par défaut : Pains, Pâtes & Épicerie
}

function parseIngredientLine(lineStr) {
  let name = lineStr;
  let qty = 1;
  let unit = 'p';

  const parts = lineStr.split(':');
  if (parts.length > 1) {
    name = parts[0].trim();
    const qtyPart = parts.slice(1).join(':').trim();

    const multMatch = qtyPart.match(/(\d+(?:[.,]\d+)?)\s*[xX×*]\s*(\d+(?:[.,]\d+)?)\s*([a-zA-ZœŒéÉ]+.*)?/);
    if (multMatch) {
      const q1 = parseFloat(multMatch[1].replace(',', '.'));
      const q2 = parseFloat(multMatch[2].replace(',', '.'));
      qty = q1 * q2;
      unit = multMatch[3] ? multMatch[3].trim() : 'p';
    } else {
      const singleMatch = qtyPart.match(/^([\d.,]+)\s*([a-zA-ZœŒéÉ]+.*)?$/);
      if (singleMatch) {
        qty = parseFloat(singleMatch[1].replace(',', '.'));
        unit = singleMatch[2] ? singleMatch[2].trim() : 'p';
      }
    }
  }

  // Normalisation des unités
  unit = unit.toLowerCase();
  if (unit === 'g' || unit === 'gr' || unit === 'grammes') unit = 'g';
  else if (unit === 'kg' || unit === 'kilo' || unit === 'kilogrammes') { qty *= 1000; unit = 'g'; }
  else if (unit === 'ml' || unit === 'millilitres') unit = 'ml';
  else if (unit === 'cl') { qty *= 10; unit = 'ml'; }
  else if (unit === 'l' || unit === 'litre' || unit === 'litres') { qty *= 1000; unit = 'ml'; }
  else if (unit.includes('œuf') || unit.includes('oeuf')) unit = 'p';
  else if (unit.includes('tr') || unit.includes('tranche')) unit = 'tr';
  else if (unit.includes('p') || unit.includes('piece') || unit.includes('pièce') || unit.includes('bouteille') || unit.includes('canette') || unit.includes('capsule')) unit = 'p';

  const n = cleanText(name);

  // ========================================================
  // FUSIONS INTELLIGENTES DES MATIÈRES PREMIÈRES SIMILAIRES
  // ========================================================

  // 1. VIANDES & VOLAILLES
  if (n.includes('viande hache') || n.includes('viande hachee') || (n.startsWith('viande') && !n.includes('sechee') && !n.includes('khli'))) {
    name = 'Viande Hachée';
    unit = 'g';
  }
  else if (n.includes('saucisse') || n.includes('merguez')) {
    name = 'Merguez & Saucisses';
    if (unit === 'p') { qty *= 60; unit = 'g'; }
    else unit = 'g';
  }
  else if (n.includes('boeuf') || n.includes('bœuf') || n === 'filet' || n.startsWith('filet') || n.includes('filet de boeuf') || n.includes('steak')) {
    name = 'Bœuf (Filet / Émincé)';
    unit = 'g';
  }
  else if (n.includes('poulet') || n.includes('escalope a la milanaise') || n.includes('nugget')) {
    name = 'Poulet (Blanc / Pané / Émincé)';
    unit = 'g';
  }
  else if (n.includes('dinde') || n.includes('jambon de dinde') || n.includes('charcuterie')) {
    name = 'Charcuterie & Dinde Fumée';
    unit = 'g';
  }
  else if (n.includes('bacon')) {
    name = 'Bacon de Bœuf';
    if (unit === 'p') { qty *= 20; unit = 'g'; }
    else unit = 'g';
  }
  else if (n.includes('khli')) {
    name = 'Khlii (Viande Séchée Traditionnelle)';
    unit = 'g';
  }

  // 2. POISSONS & FRUITS DE MER
  else if (n.includes('crevette') || n.includes('gambas')) {
    name = 'Crevettes & Gambas';
    unit = 'g';
  }
  else if (n.includes('saumon fume') || n.includes('saumon fumee')) {
    name = 'Saumon Fumé';
    unit = 'g';
  }
  else if (n.includes('saumon') || n.includes('pave de saumon')) {
    name = 'Saumon Frais (Pavé)';
    unit = 'g';
  }
  else if (n.includes('calamar')) {
    name = 'Calamars';
    unit = 'g';
  }
  else if (n.includes('moule')) {
    name = 'Moules';
    unit = 'g';
  }
  else if (n.includes('thon')) {
    name = 'Thon Émietté';
    unit = 'g';
  }

  // 3. CRÉMERIE, FROMAGES & ŒUFS
  else if (!n.includes('caille') && !n.includes('boeuf') && (n.includes('oeuf') || n.includes('œuf') || n.includes('omelette') || n.includes('omlette'))) {
    name = 'Œufs (Pièces)';
    unit = 'p';
  }
  else if (n === 'oeufs de caille' || n.includes('caille')) {
    name = 'Œufs de Caille';
    unit = 'p';
  }
  else if (n.includes('fromage bleu') || n.includes('fr bleu') || n === 'bleu') {
    name = 'Fromage Bleu';
    unit = 'g';
  }
  else if (n.includes('fromage rouge') || n.includes('fr rouge')) {
    name = 'Fromage Rouge';
    unit = 'g';
  }
  else if (n === 'fromage' || n === 'fromages' || n.includes('fromage edam') || n.includes('fromage rape') || n.includes('edam') || n.includes('gouda') || n.includes('fromage variete')) {
    name = 'Fromage (Gouda / Edam / Râpé)';
    unit = 'g';
  }
  else if (n.includes('mozzarella')) {
    name = 'Mozzarella';
    unit = 'g';
  }
  else if (n.includes('parmesan')) {
    name = 'Parmesan Reggiano';
    unit = 'g';
  }
  else if (n.includes('cheddar')) {
    name = 'Cheddar';
    unit = 'g';
  }
  else if (n.includes('jben')) {
    name = 'Jben Frais Marocain';
    unit = 'g';
  }
  else if (n.includes('lait chaud') || n.includes('lait froid') || n.includes('lait entier') || n === 'lait') {
    name = 'Lait Entier';
    unit = 'ml';
  }
  else if (n.includes('creme fraiche') || n.includes('creme liquide') || n === 'creme') {
    name = 'Crème Fraîche';
    unit = unit === 'ml' ? 'ml' : 'g';
  }

  // 4. LÉGUMES & FRUITS
  else if (n.includes('tomate cerise')) {
    name = 'Tomates Cerises';
    unit = 'g';
  }
  else if (n.includes('tomate') && !n.includes('sauce') && !n.includes('pesto')) {
    name = 'Tomates Fraîches';
    unit = 'g';
  }
  else if (n.includes('oignon') && !n.includes('sauce')) {
    name = 'Oignons Frais';
    unit = 'g';
  }
  else if (n.includes('champignon')) {
    name = 'Champignons Frais';
    unit = 'g';
  }
  else if (n.includes('pomme de terre') || n.includes('puree') || n.includes('potatos') || n.includes('frite')) {
    name = 'Pommes de Terre (Frites / Purée)';
    unit = 'g';
  }
  else if (n.includes('salade') || n.includes('mesclun') || n.includes('laitue') || n.includes('roquette')) {
    name = 'Salade & Mesclun Frais';
    unit = 'g';
  }
  else if (n.includes('avocat')) {
    name = 'Avocat';
    unit = 'g';
  }
  else if (n.includes('epinard')) {
    name = 'Épinards Frais';
    unit = 'g';
  }
  else if (n.includes('haricot')) {
    name = 'Haricots Verts';
    unit = 'g';
  }
  else if (n.includes('courgette')) {
    name = 'Courgettes Fraîches';
    unit = 'g';
  }
  else if (n.includes('brocoli')) {
    name = 'Brocolis Frais';
    unit = 'g';
  }
  else if (n.includes('carotte')) {
    name = 'Carottes Fraîches';
    unit = 'g';
  }
  else if (n.includes('olive')) {
    name = 'Olives Noires';
    unit = 'g';
  }
  else if (n.includes('persil')) {
    name = 'Persil Frais';
    unit = 'g';
  }
  else if (n.includes('poivron')) {
    name = 'Poivrons Frais';
    unit = 'g';
  }
  else if (n.includes('orange') && !n.includes('tranche') && !n.includes('sirop') && !n.includes('fleur')) {
    name = 'Oranges à Jus';
    unit = unit === 'ml' ? 'ml' : 'g';
  }
  else if (n.includes('citron vert')) {
    name = 'Citron Vert';
    unit = unit === 'ml' ? 'ml' : 'g';
  }
  else if (n.includes('citron') && !n.includes('tranche') && !n.includes('zeste') && !n.includes('sirop') && !n.includes('icetea') && !n.includes('schwepp')) {
    name = 'Citrons Jaunes';
    unit = unit === 'ml' ? 'ml' : 'g';
  }
  else if (n.includes('fraise') && !n.includes('sirop')) {
    name = 'Fraises Fraîches';
    unit = unit === 'ml' ? 'ml' : 'g';
  }
  else if (n.includes('framboise') && !n.includes('sirop') && !n.includes('icetea')) {
    name = 'Framboises Fraîches';
    unit = unit === 'ml' ? 'ml' : 'g';
  }
  else if (n.includes('mangue') && !n.includes('sirop')) {
    name = 'Mangues Fraîches';
    unit = unit === 'ml' ? 'ml' : 'g';
  }
  else if (n.includes('banane')) {
    name = 'Bananes Fraîches';
    if (unit === 'p') { qty *= 120; unit = 'g'; }
    else unit = 'g';
  }
  else if (n.includes('pomme') && !n.includes('terre') && !n.includes('poms')) {
    name = 'Pommes Fraîches';
    unit = 'g';
  }
  else if (n.includes('ananas') && !n.includes('tranche')) {
    name = 'Ananas Frais';
    unit = unit === 'ml' ? 'ml' : 'g';
  }
  else if (n.includes('peche') && !n.includes('sirop') && !n.includes('icetea')) {
    name = 'Pêches Fraîches';
    unit = 'g';
  }
  else if (n.includes('kiwi')) {
    name = 'Kiwis Frais';
    unit = 'g';
  }
  else if (n.includes('menthe')) {
    name = 'Menthe Fraîche';
    unit = 'g';
  }

  // 5. BAR, SODAS, EAUX & BOISSONS CHAUDES
  else if (n.includes('nespresso') || n.includes('pastille')) {
    name = 'Pastille Nespresso';
    unit = 'p';
  }
  else if (n.includes('coca cola zero') || n.includes('coca zero')) {
    name = 'Coca-Cola Zéro (Canette 33cl)';
    unit = 'p';
  }
  else if (n.includes('coca cola') || n.includes('coca')) {
    name = 'Coca-Cola (Canette 33cl)';
    unit = 'p';
  }
  else if (n.includes('sprite')) {
    name = 'Sprite (Canette 33cl)';
    unit = 'p';
  }
  else if (n.includes('poms')) {
    name = 'Poms (Canette 33cl)';
    unit = 'p';
  }
  else if (n.includes('schweppes') || n.includes('schwepps')) {
    name = 'Schweppes (Canette 33cl)';
    unit = 'p';
  }
  else if (n.includes('orangina')) {
    name = 'Orangina (Canette 33cl)';
    unit = 'p';
  }
  else if (n.includes('red bull')) {
    name = 'Red Bull (Canette 250ml)';
    unit = 'p';
  }
  else if (n.includes('oulmes') && (n.includes('75') || n.includes('grand'))) {
    name = 'Bouteille Oulmès 75cl';
    unit = 'p';
  }
  else if (n.includes('oulmes')) {
    name = 'Bouteille Oulmès 33/50cl';
    unit = 'p';
  }
  else if (n.includes('eau') && (n.includes('75') || n.includes('grand'))) {
    name = 'Bouteille Eau Minérale 75cl';
    unit = 'p';
  }
  else if (n.includes('eau') && (n.includes('50') || n.includes('0 5') || n.includes('moyen'))) {
    name = 'Bouteille Eau Minérale 50cl';
    unit = 'p';
  }
  else if (n.includes('eau') && (n.includes('33') || n.includes('minerale') || n.includes('plate') || n.includes('bouteille'))) {
    name = 'Bouteille Eau Minérale 33cl';
    unit = 'p';
  }
  else if (n.includes('boisson chaude') || n.includes('boissons chaudes')) {
    name = 'Café en Grains';
    if (unit === 'p') { qty *= 10; unit = 'g'; }
    else unit = 'g';
  }
  else if ((n.startsWith('cafe') || n.includes('cafe en grain') || n.includes('espresso')) && !n.includes('nespresso') && !n.includes('latte') && !n.includes('lait') && !n.includes('gla') && !n.includes('frap')) {
    name = 'Café en Grains';
    unit = 'g';
  }
  else if (n.includes('the noir')) {
    name = 'Thé Noir';
    unit = 'g';
  }
  else if (n.includes('the vert') || n.includes('gunpowder') || n === 'the') {
    name = 'Thé Vert Gunpowder';
    unit = 'g';
  }
  else if (n.includes('verveine')) {
    name = 'Verveine Séchée';
    unit = 'g';
  }
  else if (n.includes('chocolat en poudre') || n.includes('chocolat chaud') || n.includes('chocolat noir fondu')) {
    name = 'Chocolat en Poudre & Fondu';
    unit = 'g';
  }
  else if (n.includes('huile d olive') || n.includes('huile dolive')) {
    name = "Huile d'Olive";
    unit = 'ml';
  }
  else if (n === 'huile' || n.includes('huile de tournesol') || n.includes('huile de table')) {
    name = 'Huile de Cuisson';
    unit = 'ml';
  }
  else if (n.includes('sauce tomate')) {
    name = 'Sauce Tomate Pizza / Pasta';
    unit = 'g';
  }
  else if (n.includes('pesto')) {
    name = 'Sauce Pesto Basilic';
    unit = 'g';
  }
  else if (n.includes('sauce biggy') || n.includes('sauce bigy')) {
    name = 'Sauce Biggy';
    unit = 'g';
  }
  else if (n.includes('sauce tartare')) {
    name = 'Sauce Tartare';
    unit = 'g';
  }
  else if (n.includes('sauce cesar')) {
    name = 'Sauce César';
    unit = 'g';
  }
  else if (n.includes('sauce blanche')) {
    name = 'Sauce Blanche';
    unit = 'g';
  }
  else if (n.includes('sauce burger')) {
    name = 'Sauce Burger';
    unit = unit === 'ml' ? 'ml' : 'g';
  }
  else if (n.includes('viennoiserie')) {
    name = 'Viennoiseries';
    unit = 'p';
  }
  else if (n.includes('tranche de citron') || n.includes('tranches de citron')) {
    name = 'Tranches de Citron';
    unit = 'tr';
  }
  else if (n.includes('tranche d orange') || n.includes('tranches d orange')) {
    name = "Tranches d'Orange";
    unit = 'tr';
  }
  else if (n.includes('sucre de canne') || n.includes('sirop de canne') || n.includes('sirop de sucre')) {
    name = 'Sirop de Sucre de Canne';
    unit = 'ml';
  }
  else if (n === 'sucre') {
    name = 'Sucre en Morceaux / Sachets';
    unit = unit === 'g' ? 'g' : 'p';
  }
  else if (n.includes('miel')) {
    name = 'Miel Pur';
    unit = 'g';
  }
  else if (n.includes('fokacha') || n.includes('focaccia')) {
    name = 'Pain Focaccia';
    unit = 'g';
  }

  return { name, qty, unit, raw: lineStr };
}

/* ========================================================
   6. CALCUL DU DÉSTOCKAGE & AGRÉGATION JOURNALIÈRE / MENSUELLE
======================================================== */
function processSalesAndCalculateStock(rawRows, periodTitle = '', isMonthly = false, activeDaysList = []) {
  const salesMap = new Map();
  let totalCA = 0;
  let totalQty = 0;

  (rawRows || []).forEach(row => {
    if (!row.product) return;
    const key = row.product.trim();
    const qty = parseFloat(row.qty) || 0;
    const price = parseFloat(row.price) || 0;
    const total = parseFloat(row.total) || (qty * price);

    totalCA += total;
    totalQty += qty;

    if (!salesMap.has(key)) {
      salesMap.set(key, {
        family: row.family || 'DIVERS',
        product: key,
        price: price,
        qty: 0,
        total: 0
      });
    }
    const item = salesMap.get(key);
    item.qty += qty;
    item.total += total;
    if (price > 0 && item.price === 0) item.price = price;
  });

  const aggregatedSales = Array.from(salesMap.values());
  const ingMap = new Map();
  let matchedCount = 0;

  aggregatedSales.forEach(sale => {
    const recipe = findRecipeForProduct(sale.product, sale.family);
    sale.matchedRecipe = recipe;

    if (recipe) {
      matchedCount++;
      (recipe.ingredients || []).forEach(ingLine => {
        const parsed = parseIngredientLine(ingLine);
        const totalIngQty = parsed.qty * sale.qty;
        const ingKey = cleanText(parsed.name) + '_' + parsed.unit;

        if (!ingMap.has(ingKey)) {
          ingMap.set(ingKey, {
            name: parsed.name,
            unit: parsed.unit,
            category: categorizeIngredient(parsed.name),
            totalQty: 0,
            dishes: []
          });
        }

        const ingObj = ingMap.get(ingKey);
        ingObj.totalQty += totalIngQty;
        ingObj.dishes.push({
          dish: sale.product,
          recipeName: recipe.name,
          portions: sale.qty,
          unitQty: parsed.qty,
          lineTotal: totalIngQty,
          unit: parsed.unit
        });
      });
    }
  });

  aggregatedIngredients = Array.from(ingMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  currentSalesData = aggregatedSales.sort((a, b) => b.qty - a.qty);

  // Mise à jour de l'UI
  renderDashboard({
    totalCA,
    totalQty,
    salesLines: (rawRows || []).length,
    distinctProducts: aggregatedSales.length,
    matchedCount,
    ingredientsCount: aggregatedIngredients.length,
    periodTitle: periodTitle || (isMonthly ? `Mois ${selectedYearMonth}` : `Jour ${selectedDate}`),
    isMonthly,
    activeDaysCount: activeDaysList.length
  });

  renderSummaryTable();
  renderSalesTable();
  renderMenuEngineeringMatrix();
  const expBtn = document.getElementById('btn-export-excel');
  if (expBtn) expBtn.style.display = 'inline-flex';
}

/* ========================================================
   7. CALENDRIER & GESTION MULTI-JOURS
======================================================== */
function renderCalendar() {
  const container = document.getElementById('cal-grid-container');
  if (!container) return;

  const [yearStr, monthStr] = selectedYearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-11

  // Entêtes des jours (Lun..Dim)
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  let html = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');

  // Premier jour du mois & nombre de jours
  const firstDay = new Date(year, month, 1);
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // En JS, getDay(): 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi. On convertit pour Lun=0 .. Dim=6
  let startingCol = (firstDay.getDay() + 6) % 7;

  // Cases vides avant le premier jour
  for (let i = 0; i < startingCol; i++) {
    html += `<div class="cal-day-cell empty"></div>`;
  }

  let monthTotalCA = 0;
  let monthTotalQty = 0;
  let recordedDaysCount = 0;

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${selectedYearMonth}-${dayStr}`;
    const dayData = monthlySalesDB[dateKey];
    const hasData = dayData && dayData.length > 0;
    const isSelected = (currentViewMode === 'day' && selectedDate === dateKey);

    let dayCA = 0;
    let dayQty = 0;
    if (hasData) {
      recordedDaysCount++;
      dayData.forEach(r => {
        const q = parseFloat(r.qty) || 0;
        const p = parseFloat(r.price) || 0;
        const t = parseFloat(r.total) || (q * p);
        dayCA += t;
        dayQty += q;
      });
      monthTotalCA += dayCA;
      monthTotalQty += dayQty;
    }

    const caFormatted = dayCA >= 1000 ? (dayCA / 1000).toFixed(1) + 'k DH' : Math.round(dayCA) + ' DH';

    html += `
      <div class="cal-day-cell ${hasData ? 'has-data' : ''} ${isSelected ? 'active' : ''}" onclick="selectDate('${dateKey}')">
        <div class="cal-day-top">
          <span class="cal-day-num">${day}</span>
          ${hasData ? `<span class="cal-day-badge">✓ ${dayData.length}</span>` : ''}
        </div>
        ${hasData ? `<div class="cal-day-ca" title="${dayCA.toLocaleString('fr-FR')} DH (${dayQty} articles)">${caFormatted}</div>` : `<div class="cal-day-empty-text">—</div>`}
      </div>
    `;
  }

  container.innerHTML = html;

  // Mettre à jour les statistiques globales du calendrier
  document.getElementById('stat-cal-days-count').textContent = `${recordedDaysCount} / ${totalDaysInMonth} j.`;
  document.getElementById('stat-cal-total-ca').textContent = `${monthTotalCA.toLocaleString('fr-FR')} DH`;
  document.getElementById('stat-cal-total-qty').textContent = `${monthTotalQty.toLocaleString('fr-FR')}`;

  const mInput = document.getElementById('cal-month-input');
  if (mInput) mInput.value = selectedYearMonth;

  // Libellés UI
  const dFormatted = formatDateFR(selectedDate);
  const targetLabel = document.getElementById('label-upload-target-date');
  if (targetLabel) targetLabel.textContent = dFormatted;

  const dayShortLabel = document.getElementById('label-selected-day-short');
  if (dayShortLabel) dayShortLabel.textContent = selectedDate.slice(8, 10) + '/' + selectedDate.slice(5, 7);

  const monthShortLabel = document.getElementById('label-selected-month-short');
  if (monthShortLabel) monthShortLabel.textContent = formatMonthFR(selectedYearMonth);
}

function formatDateFR(isoDateStr) {
  if (!isoDateStr) return '';
  const [y, m, d] = isoDateStr.split('-');
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function formatMonthFR(yearMonthStr) {
  if (!yearMonthStr) return '';
  const [y, m] = yearMonthStr.split('-');
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function selectDate(dateKey) {
  selectedDate = dateKey;
  selectedYearMonth = dateKey.slice(0, 7);
  setViewMode('day');
}

function setViewMode(mode) {
  currentViewMode = mode;
  const btnDay = document.getElementById('btn-mode-day');
  const btnMonth = document.getElementById('btn-mode-month');

  if (mode === 'day') {
    if (btnDay) btnDay.classList.add('active');
    if (btnMonth) btnMonth.classList.remove('active');
  } else {
    if (btnDay) btnDay.classList.remove('active');
    if (btnMonth) btnMonth.classList.add('active');
  }

  renderCalendar();
  recalculateCurrentView();
}

function prevMonth() {
  const [y, m] = selectedYearMonth.split('-').map(Number);
  let newY = y;
  let newM = m - 1;
  if (newM < 1) { newM = 12; newY--; }
  selectedYearMonth = `${newY}-${String(newM).padStart(2, '0')}`;
  selectedDate = `${selectedYearMonth}-01`;
  renderCalendar();
  recalculateCurrentView();
}

function nextMonth() {
  const [y, m] = selectedYearMonth.split('-').map(Number);
  let newY = y;
  let newM = m + 1;
  if (newM > 12) { newM = 1; newY++; }
  selectedYearMonth = `${newY}-${String(newM).padStart(2, '0')}`;
  selectedDate = `${selectedYearMonth}-01`;
  renderCalendar();
  recalculateCurrentView();
}

function onMonthInputChange(val) {
  if (!val) return;
  selectedYearMonth = val;
  selectedDate = `${selectedYearMonth}-01`;
  renderCalendar();
  recalculateCurrentView();
}

function recalculateCurrentView() {
  if (currentViewMode === 'day') {
    let rows = monthlySalesDB[selectedDate] || [];
    
    // Si la date actuelle n'a pas de données mais que d'autres dates en ont dans le mois
    if (rows.length === 0) {
      const monthDates = Object.keys(monthlySalesDB).filter(d => d.startsWith(selectedYearMonth) && monthlySalesDB[d] && monthlySalesDB[d].length > 0).sort();
      if (monthDates.length > 0) {
        selectedDate = monthDates[monthDates.length - 1];
        rows = monthlySalesDB[selectedDate] || [];
      }
    }

    processSalesAndCalculateStock(rows, `Ventes du ${formatDateFR(selectedDate)}`, false, [selectedDate]);
  } else {
    // Mode Cumul Mensuel : fusion de tous les jours du mois
    const allRows = [];
    const activeDays = [];

    Object.keys(monthlySalesDB).sort().forEach(dKey => {
      if (dKey.startsWith(selectedYearMonth)) {
        const dRows = monthlySalesDB[dKey] || [];
        if (dRows.length > 0) {
          activeDays.push(dKey);
          dRows.forEach(r => allRows.push(r));
        }
      }
    });

    processSalesAndCalculateStock(allRows, `Cumul Mensuel — ${formatMonthFR(selectedYearMonth)}`, true, activeDays);
  }
}

function clearCurrentDayData() {
  if (!monthlySalesDB[selectedDate] || monthlySalesDB[selectedDate].length === 0) {
    alert("Aucune vente enregistrée pour le " + formatDateFR(selectedDate));
    return;
  }
  if (confirm(`Voulez-vous supprimer les données de vente du ${formatDateFR(selectedDate)} ?`)) {
    delete monthlySalesDB[selectedDate];
    saveMonthlySalesDB();
    renderCalendar();
    recalculateCurrentView();
  }
}

function exportFullMonthlyBackupJSON() {
  const payload = {
    exportDate: new Date().toISOString(),
    monthlySalesDB: monthlySalesDB,
    recipes: activeRecipes
  };
  const str = JSON.stringify(payload, null, 2);
  const blob = new Blob([str], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GreyCorner_Sauvegarde_Mensuelle_${selectedYearMonth}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFullMonthlyBackupJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.monthlySalesDB) {
        monthlySalesDB = data.monthlySalesDB;
        saveMonthlySalesDB();
      }
      if (data.recipes) {
        activeRecipes = data.recipes;
        saveRecipes();
        renderRecipeList();
      }
      alert("Sauvegarde restaurée avec succès !");
      renderCalendar();
      recalculateCurrentView();
    } catch (err) {
      alert("Erreur lors de la lecture du fichier JSON : " + err.message);
    }
  };
  reader.onerror = () => alert("Erreur de lecture du fichier. Veuillez réessayer.");
  reader.readAsText(file);
}

/* ========================================================
   8. RENDU DES STATS DU DASHBOARD & TABLEAUX
======================================================== */
function renderDashboard({ totalCA, totalQty, salesLines, distinctProducts, matchedCount, ingredientsCount, periodTitle, isMonthly, activeDaysCount }) {
  document.getElementById('stats-section').style.display = 'grid';
  document.getElementById('stat-ca').textContent = `${totalCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`;
  document.getElementById('stat-qty').textContent = totalQty.toLocaleString('fr-FR');
  
  const subCA = document.getElementById('stat-lines-count');
  if (subCA) {
    subCA.textContent = isMonthly ? `${activeDaysCount} jours actifs (${salesLines} lignes)` : `${salesLines} lignes de vente (${periodTitle})`;
  }

  document.getElementById('stat-products-count').textContent = `${distinctProducts} articles différents`;

  const rate = distinctProducts > 0 ? (matchedCount / distinctProducts * 100).toFixed(1) : 0;
  document.getElementById('stat-match-rate').textContent = `${rate}%`;
  document.getElementById('stat-matched-count').textContent = `${matchedCount} / ${distinctProducts} articles avec FT`;

  document.getElementById('stat-ing-count').textContent = ingredientsCount;
  document.getElementById('count-ingredients').textContent = ingredientsCount;
  document.getElementById('count-sales').textContent = distinctProducts;
}

function formatIngQuantity(qty, unit, name = '') {
  if (unit === 'g') {
    if (qty >= 1000) {
      const kg = (qty / 1000).toFixed(2).replace(/\.?0+$/, '');
      return `<span class="qty-highlight">${kg}</span> <span class="qty-unit">Kg</span> <span style="font-size:11px;color:var(--muted)">(${qty.toLocaleString('fr-FR')} g)</span>`;
    }
    return `<span class="qty-highlight">${qty.toLocaleString('fr-FR')}</span> <span class="qty-unit">g</span>`;
  }
  if (unit === 'ml') {
    if (qty >= 1000) {
      const l = (qty / 1000).toFixed(2).replace(/\.?0+$/, '');
      return `<span class="qty-highlight">${l}</span> <span class="qty-unit">Litres</span> <span style="font-size:11px;color:var(--muted)">(${qty.toLocaleString('fr-FR')} ml)</span>`;
    }
    return `<span class="qty-highlight">${qty.toLocaleString('fr-FR')}</span> <span class="qty-unit">ml</span>`;
  }
  if (unit === 'œufs' || (name && (name.toLowerCase().includes('œuf') || name.toLowerCase().includes('oeuf')))) {
    return `<span class="qty-highlight">${Math.round(qty)}</span> <span class="qty-unit">œufs</span>`;
  }
  if (unit === 'tr') {
    return `<span class="qty-highlight">${Math.round(qty)}</span> <span class="qty-unit">tranches</span>`;
  }
  return `<span class="qty-highlight">${Math.round(qty * 10) / 10}</span> <span class="qty-unit">pièces</span>`;
}

function getCategoryBadge(cat) {
  const map = {
    boissons: '<span class="badge-tag" style="background:rgba(180,83,9,0.12);color:#b45309;border:1px solid rgba(180,83,9,0.25);">☕ Bar & Boissons</span>',
    viandes: '<span class="badge-tag badge-danger">🍗 Viande / Volaille</span>',
    poissons: '<span class="badge-tag badge-info">🦐 Poisson / Mer</span>',
    fromages: '<span class="badge-tag badge-warn">🧀 Fromage / Laitage</span>',
    legumes: '<span class="badge-tag badge-ok">🥗 Légume / Fruit</span>',
    epicerie: '<span class="badge-tag" style="background:#1e293b;color:#cbd5e1;border:1px solid #334155;">🍞 Épicerie / Autre</span>'
  };
  return map[cat] || map.epicerie;
}

function renderSummaryTable() {
  renderSummaryTopIngredientsPodium();
  const tbody = document.getElementById('tbody-ingredients');
  const search = cleanText(document.getElementById('search-ing').value);
  const activeCat = document.querySelector('.filter-btn.active') ? document.querySelector('.filter-btn.active').dataset.cat : 'all';

  const filtered = aggregatedIngredients.filter(ing => {
    if (activeCat && activeCat !== 'all' && ing.category !== activeCat) return false;
    if (search && !cleanText(ing.name).includes(search) && !cleanText(ing.category).includes(search)) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding: 36px; color: var(--muted);">
          ${currentSalesData.length === 0 ? 'Aucune vente enregistrée pour cette période.' : 'Aucun ingrédient ne correspond à vos filtres de recherche.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(ing => {
    const dishesHtml = ing.dishes.map(d => {
      let unitStr = d.unit;
      return `<span class="dish-pill" title="${d.portions} portions × ${d.unitQty} ${unitStr}">
        ${d.dish} : <span>${d.lineTotal} ${unitStr}</span>
      </span>`;
    }).join(' ');

    return `
      <tr>
        <td><strong>${ing.name}</strong></td>
        <td>${getCategoryBadge(ing.category)}</td>
        <td>${formatIngQuantity(ing.totalQty, ing.unit, ing.name)}</td>
        <td><div class="dishes-pill-list">${dishesHtml}</div></td>
      </tr>
    `;
  }).join('');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

let salesSortColumn = 'qty';
let salesSortDirection = -1; // -1 = desc, 1 = asc
let salesFamilyFilter = 'all';
let chartMetric = 'qty'; // 'qty' ou 'ca'

function populateSalesFamilyDropdown() {
  const select = document.getElementById('filter-sales-family');
  if (!select) return;
  const currentVal = select.value || 'all';

  const families = new Set();
  (currentSalesData || []).forEach(s => {
    if (s.family && s.family.trim()) families.add(s.family.trim());
  });

  const sortedFamilies = Array.from(families).sort((a, b) => a.localeCompare(b, 'fr'));
  
  let optionsHtml = '<option value="all">📁 Toutes les Catégories</option>';
  sortedFamilies.forEach(f => {
    const isSelected = f === currentVal ? 'selected' : '';
    optionsHtml += `<option value="${escapeHtml(f)}" ${isSelected}>${escapeHtml(f)}</option>`;
  });

  select.innerHTML = optionsHtml;
}

function onSalesFamilyFilterChange(val) {
  salesFamilyFilter = val;
  renderSalesTable();
}

function onSalesSortDropdownChange(val) {
  if (val === 'qty-desc') { salesSortColumn = 'qty'; salesSortDirection = -1; }
  else if (val === 'qty-asc') { salesSortColumn = 'qty'; salesSortDirection = 1; }
  else if (val === 'total-desc') { salesSortColumn = 'total'; salesSortDirection = -1; }
  else if (val === 'family-asc') { salesSortColumn = 'family'; salesSortDirection = 1; }
  else if (val === 'product-asc') { salesSortColumn = 'product'; salesSortDirection = 1; }
  
  updateSalesSortHeaderIcons();
  renderSalesTable();
}

function toggleSalesSort(col) {
  if (salesSortColumn === col) {
    salesSortDirection *= -1;
  } else {
    salesSortColumn = col;
    salesSortDirection = (col === 'qty' || col === 'total') ? -1 : 1;
  }

  const sel = document.getElementById('sort-sales-select');
  if (sel) {
    if (col === 'qty') sel.value = salesSortDirection === -1 ? 'qty-desc' : 'qty-asc';
    else if (col === 'total') sel.value = 'total-desc';
    else if (col === 'family') sel.value = 'family-asc';
    else if (col === 'product') sel.value = 'product-asc';
  }

  updateSalesSortHeaderIcons();
  renderSalesTable();
}

function updateSalesSortHeaderIcons() {
  const iconMap = { family: 'sort-icon-family', product: 'sort-icon-product', qty: 'sort-icon-qty', total: 'sort-icon-total' };
  Object.entries(iconMap).forEach(([k, id]) => {
    const el = document.getElementById(id);
    if (el) {
      if (salesSortColumn === k) {
        el.textContent = salesSortDirection === -1 ? ' ▼' : ' ▲';
        el.style.color = 'var(--accent)';
      } else {
        el.textContent = '';
      }
    }
  });
}

function setSalesFilter(filterVal) {
  currentSalesFilter = filterVal;
  document.querySelectorAll('#tab-sales .filter-btn[data-filter]').forEach(btn => {
    if (btn.dataset.filter === filterVal) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  renderSalesTable();
}

function setChartMetric(metric) {
  chartMetric = metric;
  const btnQty = document.getElementById('btn-chart-mode-qty');
  const btnCA = document.getElementById('btn-chart-mode-ca');
  if (btnQty && btnCA) {
    if (metric === 'qty') {
      btnQty.classList.add('active');
      btnCA.classList.remove('active');
    } else {
      btnCA.classList.add('active');
      btnQty.classList.remove('active');
    }
  }
  renderSalesBarChart();
}

function renderSalesTable() {
  const tbody = document.getElementById('tbody-sales');
  const search = cleanText(document.getElementById('search-sales').value);

  populateSalesFamilyDropdown();

  let filtered = currentSalesData.filter(s => {
    if (currentSalesFilter === 'matched' && !s.matchedRecipe) return false;
    if (currentSalesFilter === 'unmatched' && s.matchedRecipe) return false;
    if (salesFamilyFilter !== 'all' && s.family !== salesFamilyFilter) return false;
    if (search && !cleanText(s.product).includes(search) && !cleanText(s.family).includes(search)) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (salesSortColumn === 'qty') return salesSortDirection * (a.qty - b.qty);
    if (salesSortColumn === 'total') return salesSortDirection * (a.total - b.total);
    if (salesSortColumn === 'family') return salesSortDirection * (a.family || '').localeCompare(b.family || '', 'fr');
    if (salesSortColumn === 'product') return salesSortDirection * (a.product || '').localeCompare(b.product || '', 'fr');
    return 0;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 36px; color: var(--muted);">
          ${currentSalesData.length === 0 ? 'Aucune donnée de vente chargée.' : 'Aucune vente ne correspond à vos critères de recherche et filtres.'}
        </td>
      </tr>
    `;
    renderSalesBarChart();
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const hasRecipe = !!s.matchedRecipe;
    const statusBadge = hasRecipe
      ? `<span class="badge-tag badge-ok">✅ ${escapeHtml(s.matchedRecipe.name)}</span>`
      : `<span class="badge-tag badge-warn">⚠️ Non configuré / Boisson</span>`;

    const ingsList = hasRecipe
      ? s.matchedRecipe.ingredients.map(i => `<span class="dish-pill">${escapeHtml(i)}</span>`).join(' ')
      : '<span style="color:var(--muted); font-size:12px;">Article sans fiche technique</span>';

    return `
      <tr>
        <td><span class="chip-pill" style="font-size:11px;">${escapeHtml(s.family)}</span></td>
        <td><strong style="color:var(--text); font-size:13.5px;">${escapeHtml(s.product)}</strong></td>
        <td style="text-align:right;"><span class="qty-highlight" style="font-size:14px; font-weight:900;">${s.qty.toLocaleString('fr-FR')}</span></td>
        <td style="text-align:right;"><strong style="color:var(--accent); font-size:13.5px;">${s.total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</strong></td>
        <td>${statusBadge}</td>
        <td><div class="dishes-pill-list">${ingsList}</div></td>
        <td>
          <button class="btn" style="padding: 4px 8px; font-size:11.5px;" onclick="openRecipeEditor('${escapeHtml(s.product).replace(/'/g, "\\'")}')">
            ${hasRecipe ? '✏️ Éditer' : '➕ Créer Recette'}
          </button>
        </td>
      </tr>
    `;
  }).join('');

  renderSalesBarChart();
  renderLowSalesTable();
}

function renderSalesBarChart() {
  const container = document.getElementById('sales-barchart-container');
  const kpiGrid = document.getElementById('chart-kpis-grid');
  if (!container || !kpiGrid) return;

  if (!currentSalesData || currentSalesData.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--muted);">Aucune donnée de vente pour générer le diagramme.</div>`;
    kpiGrid.innerHTML = '';
    return;
  }

  let items = currentSalesData.filter(s => {
    if (salesFamilyFilter !== 'all' && s.family !== salesFamilyFilter) return false;
    return true;
  });

  if (items.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--muted);">Aucun produit pour la catégorie sélectionnée.</div>`;
    kpiGrid.innerHTML = '';
    return;
  }

  const totalVolume = items.reduce((acc, x) => acc + (x.qty || 0), 0);
  const totalRevenue = items.reduce((acc, x) => acc + (x.total || 0), 0);

  const sorted = [...items].sort((a, b) => {
    if (chartMetric === 'ca') return b.total - a.total;
    return b.qty - a.qty;
  });

  const limitVal = document.getElementById('chart-limit-select') ? document.getElementById('chart-limit-select').value : '15';
  const limitCount = limitVal === 'all' ? sorted.length : parseInt(limitVal, 10);
  const topList = sorted.slice(0, limitCount);

  const topByQty = [...items].sort((a, b) => b.qty - a.qty)[0];
  const topByCA = [...items].sort((a, b) => b.total - a.total)[0];
  const top5Items = sorted.slice(0, 5);
  const top5Volume = top5Items.reduce((acc, x) => acc + x.qty, 0);
  const top5VolumePct = totalVolume > 0 ? Math.round((top5Volume / totalVolume) * 100) : 0;
  const top5Revenue = top5Items.reduce((acc, x) => acc + x.total, 0);
  const top5RevenuePct = totalRevenue > 0 ? Math.round((top5Revenue / totalRevenue) * 100) : 0;

  kpiGrid.innerHTML = `
    <div style="background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:12px; border-left:4px solid #10b981;">
      <div style="font-size:11px; font-weight:800; color:var(--muted); text-transform:uppercase;">🥇 #1 en Volume Vendu</div>
      <div style="font-size:14.5px; font-weight:800; color:var(--text); margin:3px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(topByQty.product)}">
        ${escapeHtml(topByQty.product)}
      </div>
      <div style="font-size:12px; font-weight:800; color:#10b981;">
        ${topByQty.qty.toLocaleString('fr-FR')} unités <span style="font-weight:normal; color:var(--muted);">(${totalVolume > 0 ? ((topByQty.qty / totalVolume) * 100).toFixed(1) : 0}% du volume)</span>
      </div>
    </div>

    <div style="background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:12px; border-left:4px solid var(--accent);">
      <div style="font-size:11px; font-weight:800; color:var(--muted); text-transform:uppercase;">💰 #1 en Chiffre d'Affaires</div>
      <div style="font-size:14.5px; font-weight:800; color:var(--text); margin:3px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(topByCA.product)}">
        ${escapeHtml(topByCA.product)}
      </div>
      <div style="font-size:12px; font-weight:800; color:var(--accent);">
        ${topByCA.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH <span style="font-weight:normal; color:var(--muted);">(${totalRevenue > 0 ? ((topByCA.total / totalRevenue) * 100).toFixed(1) : 0}% du CA)</span>
      </div>
    </div>

    <div style="background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:12px; border-left:4px solid #a78bfa;">
      <div style="font-size:11px; font-weight:800; color:var(--muted); text-transform:uppercase;">⭐ Concentration Top 5</div>
      <div style="font-size:15px; font-weight:900; color:#a78bfa; margin:3px 0;">
        ${chartMetric === 'ca' ? `${top5RevenuePct}% du Chiffre d'Affaires` : `${top5VolumePct}% du Volume Total`}
      </div>
      <div style="font-size:11.5px; color:var(--muted);">
        Les 5 articles leaders de la carte
      </div>
    </div>
  `;

  const maxValue = chartMetric === 'ca' ? (sorted[0].total || 1) : (sorted[0].qty || 1);

  container.innerHTML = topList.map((item, idx) => {
    const rank = idx + 1;
    const valNumber = chartMetric === 'ca' ? item.total : item.qty;
    const barWidthPct = maxValue > 0 ? Math.max(4, Math.round((valNumber / maxValue) * 100)) : 0;

    const sharePct = chartMetric === 'ca'
      ? (totalRevenue > 0 ? ((item.total / totalRevenue) * 100).toFixed(1) : 0)
      : (totalVolume > 0 ? ((item.qty / totalVolume) * 100).toFixed(1) : 0);

    const valDisplay = chartMetric === 'ca'
      ? `${item.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH`
      : `${item.qty.toLocaleString('fr-FR')} vendus`;

    let barGradient = 'linear-gradient(90deg, #0284c7, #38bdf8)';
    let rankBadge = `<span style="font-size:12px; font-weight:800; color:var(--muted);">#${rank}</span>`;
    
    if (rank === 1) {
      barGradient = 'linear-gradient(90deg, #eab308, #fef08a)';
      rankBadge = `<span style="font-size:15px;" title="1ère place">🥇</span>`;
    } else if (rank === 2) {
      barGradient = 'linear-gradient(90deg, #94a3b8, #e2e8f0)';
      rankBadge = `<span style="font-size:15px;" title="2ème place">🥈</span>`;
    } else if (rank === 3) {
      barGradient = 'linear-gradient(90deg, #b45309, #fed7aa)';
      rankBadge = `<span style="font-size:15px;" title="3ème place">🥉</span>`;
    } else if (rank <= 5) {
      barGradient = 'linear-gradient(90deg, #10b981, #6ee7b7)';
    }

    return `
      <div style="display:grid; grid-template-columns: 36px minmax(170px, 240px) 1fr 140px; align-items:center; gap:12px; padding:7px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--border); transition:all 0.15s ease;">
        <div style="text-align:center;">${rankBadge}</div>
        
        <div style="min-width:0;">
          <div style="font-weight:800; font-size:13px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(item.product)}">
            ${escapeHtml(item.product)}
          </div>
          <div style="font-size:11px; color:var(--muted);">${escapeHtml(item.family || 'AUTRE')}</div>
        </div>

        <div style="position:relative; width:100%; height:20px; background:rgba(0,0,0,0.12); border-radius:6px; overflow:hidden; border:1px solid var(--border);">
          <div style="height:100%; width:${barWidthPct}%; background:${barGradient}; border-radius:5px; transition:width 0.4s ease;"></div>
        </div>

        <div style="text-align:right; font-variant-numeric:tabular-nums;">
          <strong style="font-size:13px; color:var(--text);">${valDisplay}</strong>
          <span style="font-size:10.5px; color:var(--muted); display:block;">${sharePct}% du total</span>
        </div>
      </div>
    `;
  }).join('');
}

let lowSalesFilter = 'all'; // 'all', 'zero', 'low'

function setLowSalesFilter(val) {
  lowSalesFilter = val;
  const btnAll = document.getElementById('btn-low-filter-all');
  const btnZero = document.getElementById('btn-low-filter-zero');
  const btnLow = document.getElementById('btn-low-filter-low');
  if (btnAll) btnAll.classList.toggle('active', val === 'all');
  if (btnZero) btnZero.classList.toggle('active', val === 'zero');
  if (btnLow) btnLow.classList.toggle('active', val === 'low');
  renderLowSalesTable();
}

function renderLowSalesTable() {
  const tbody = document.getElementById('tbody-low-sales');
  const searchInput = document.getElementById('search-low-sales');
  if (!tbody) return;

  const search = cleanText(searchInput ? searchInput.value : '');

  // 1. Construire une map des ventes par produit (nom normalisé)
  const salesMap = new Map();
  (currentSalesData || []).forEach(s => {
    const key = cleanText(s.product);
    salesMap.set(key, (salesMap.get(key) || 0) + (s.qty || 0));
    if (s.matchedRecipe && s.matchedRecipe.name) {
      const rKey = cleanText(s.matchedRecipe.name);
      if (rKey && rKey !== key) {
        salesMap.set(rKey, (salesMap.get(rKey) || 0) + (s.qty || 0));
      }
    }
  });

  // 2. Récupérer toutes les fiches de la carte (activeRecipes)
  const allMenuItems = [];
  const seenNames = new Set();

  if (Array.isArray(activeRecipes)) {
    activeRecipes.forEach(r => {
      const norm = cleanText(r.name);
      if (!seenNames.has(norm)) {
        seenNames.add(norm);
        const qtySold = salesMap.get(norm) || 0;
        const sellPrice = r.sellPrice || findSellingPriceForRecipe(r.name) || 0;
        const fc = typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost(r.ingredients, sellPrice) : { cost: 0 };
        allMenuItems.push({
          id: r.id,
          name: r.name,
          category: r.category || 'AUTRE',
          sellPrice: sellPrice,
          cost: fc.cost || 0,
          qtySold: qtySold,
          totalCA: qtySold * sellPrice,
          isRecipe: true
        });
      }
    });
  }

  // Ajouter aussi les articles de vente qui ont <= 2 ventes
  (currentSalesData || []).forEach(s => {
    const norm = cleanText(s.product);
    if (!seenNames.has(norm)) {
      seenNames.add(norm);
      if ((s.qty || 0) <= 2) {
        allMenuItems.push({
          id: s.product,
          name: s.product,
          category: s.family || 'AUTRE',
          sellPrice: s.price || (s.qty > 0 ? (s.total / s.qty) : 0),
          cost: 0,
          qtySold: s.qty || 0,
          totalCA: s.total || 0,
          isRecipe: false
        });
      }
    }
  });

  // 3. Filtrer uniquement les articles à 0 vente ou faible rendement (<= 2 ventes)
  const zeroSalesList = allMenuItems.filter(item => item.qtySold === 0);
  const lowSalesList = allMenuItems.filter(item => item.qtySold > 0 && item.qtySold <= 2);
  const allProblemItems = allMenuItems.filter(item => item.qtySold <= 2);

  // Mettre à jour les compteurs
  const elCountBadge = document.getElementById('low-sales-count-badge');
  const elCountAll = document.getElementById('count-low-all');
  const elCountZero = document.getElementById('count-low-zero');
  const elCountLow = document.getElementById('count-low-low');

  if (elCountBadge) elCountBadge.textContent = `${allProblemItems.length} articles`;
  if (elCountAll) elCountAll.textContent = allProblemItems.length;
  if (elCountZero) elCountZero.textContent = zeroSalesList.length;
  if (elCountLow) elCountLow.textContent = lowSalesList.length;

  // Filtrer selon l'onglet actif
  let displayed = allProblemItems;
  if (lowSalesFilter === 'zero') displayed = zeroSalesList;
  else if (lowSalesFilter === 'low') displayed = lowSalesList;

  // Filtrer par recherche
  if (search) {
    displayed = displayed.filter(item => cleanText(item.name).includes(search) || cleanText(item.category).includes(search));
  }

  // Trier par quantité vendue croissant (0 en premier, puis 1, puis 2)
  displayed.sort((a, b) => {
    if (a.qtySold !== b.qtySold) return a.qtySold - b.qtySold;
    return a.name.localeCompare(b.name, 'fr');
  });

  if (displayed.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:30px; color:var(--muted);">
          ${allProblemItems.length === 0 ? '🎉 Excellent ! Tous les articles de la carte ont un bon niveau de vente.' : 'Aucun article ne correspond à votre filtre.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = displayed.map(item => {
    let statusBadge = '';
    let recoText = '';

    if (item.qtySold === 0) {
      statusBadge = '<span class="status-badge danger" style="padding:3px 8px; font-size:11px;">💤 0 Vente (Produit Dormant)</span>';
      recoText = '<span style="color:#ef4444; font-size:11.5px; font-weight:700;">Risque de perte / À promouvoir ou réviser</span>';
    } else if (item.qtySold === 1) {
      statusBadge = '<span class="status-badge warn" style="padding:3px 8px; font-size:11px;">⚠️ 1 seule vente</span>';
      recoText = '<span style="color:#f59e0b; font-size:11.5px; font-weight:700;">Faible rotation / Évaluer popularité</span>';
    } else {
      statusBadge = '<span class="status-badge warn" style="padding:3px 8px; font-size:11px; background:rgba(234,179,8,0.15); color:#ca8a04;">📉 2 ventes</span>';
      recoText = '<span style="color:var(--muted); font-size:11.5px;">Volume modeste</span>';
    }

    return `
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:10px 12px;">
          <strong style="color:var(--text); font-size:13px;">${escapeHtml(item.name)}</strong>
          <div style="font-size:11px; color:var(--muted); margin-top:2px;">${recoText}</div>
        </td>
        <td style="padding:10px;"><span class="chip-pill" style="font-size:10.5px;">${escapeHtml(item.category)}</span></td>
        <td style="padding:10px; text-align:right; font-weight:800; color:var(--text);">${item.sellPrice > 0 ? `${item.sellPrice.toFixed(2)} DH` : '-'}</td>
        <td style="padding:10px; text-align:right; font-weight:700; color:#38bdf8;">${item.cost > 0 ? `${item.cost.toFixed(2)} DH` : '-'}</td>
        <td style="padding:10px; text-align:center;">
          <span class="qty-highlight" style="font-size:13px; font-weight:900; background:${item.qtySold === 0 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}; color:${item.qtySold === 0 ? '#ef4444' : '#d97706'}; padding:2px 8px; border-radius:6px;">
            ${item.qtySold}
          </span>
        </td>
        <td style="padding:10px; text-align:right; font-weight:800; color:var(--muted);">${item.totalCA.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</td>
        <td style="padding:10px; text-align:center;">${statusBadge}</td>
        <td style="padding:10px; text-align:center;">
          <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="openRecipeEditor('${escapeHtml(item.name).replace(/'/g, "\\'")}')">
            ✏️ Fiche Tech.
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function findSellingPriceForRecipe(recipeName) {
  if (!recipeName) return 0;
  const cleanN = cleanText(recipeName);
  if (typeof DATA !== 'undefined' && Array.isArray(DATA)) {
    for (const cat of DATA) {
      for (const item of (cat.items || [])) {
        if (cleanText(item.name) === cleanN) {
          return item.sellPrice || parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0;
        }
      }
    }
  }
  return 0;
}

function renderRecipeList() {
  const container = document.getElementById('recipes-grid-container');
  const search = cleanText(document.getElementById('search-recipe-list').value);

  const filtered = activeRecipes.filter(r => {
    if (search && !cleanText(r.name).includes(search) && !cleanText(r.category).includes(search)) return false;
    return true;
  });

  document.getElementById('count-recipes').textContent = activeRecipes.length;

  container.innerHTML = filtered.map(r => {
    const sellPrice = r.sellPrice || findSellingPriceForRecipe(r.name) || 0;
    const fcCalc = typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost(r.ingredients, sellPrice) : { cost: 0, foodCost: 0, margin: 0 };
    
    const fcColor = fcCalc.foodCost <= 32 ? '#10b981' : fcCalc.foodCost <= 42 ? '#f59e0b' : '#ef4444';

    const ingLines = (r.ingredients || []).map(i => {
      const parts = i.split(':');
      if (parts.length > 1) {
        return `<li><span>${escapeHtml(parts[0].trim())}</span> <strong style="color:var(--accent);">${escapeHtml(parts.slice(1).join(':').trim())}</strong></li>`;
      }
      return `<li><span>${escapeHtml(i)}</span></li>`;
    }).join('');

    return `
      <div class="recipe-card">
        <div class="recipe-card-title">
          <span>${escapeHtml(r.name)}</span>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn" style="padding: 3px 8px; font-size:11px;" onclick="editRecipe('${r.id}')">✏️ Modifier</button>
            <button class="btn" style="padding: 3px 8px; font-size:11px; color:#ef4444; border-color:rgba(239,68,68,0.35);" onclick="deleteRecipe('${r.id}')" title="Supprimer définitivement cette fiche technique">🗑️</button>
          </div>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:var(--muted); margin-bottom:8px;">
          <span>Catégorie : <strong>${escapeHtml(r.category)}</strong></span>
          ${sellPrice > 0 ? `<span style="font-weight:800; color:var(--accent); font-size:12.5px;">${sellPrice} DH</span>` : ''}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:6px; padding:6px 10px; margin-bottom:10px; font-size:11.5px;">
          <span title="Coût matière estimé">💰 Coût : <strong style="color:#38bdf8;">${fcCalc.cost.toFixed(2)} DH</strong></span>
          <span title="Food Cost" style="font-weight:800; color:${fcColor};">📊 ${fcCalc.foodCost > 0 ? fcCalc.foodCost + '%' : '-'}</span>
          <span title="Marge brute" style="color:#a78bfa; font-weight:800;">📈 ${fcCalc.margin > 0 ? fcCalc.margin + '%' : '-'}</span>
        </div>

        <ul class="recipe-ing-list">${ingLines}</ul>
      </div>
    `;
  }).join('');
}

/* ========================================================
   9. MODALE & ÉDITION DYNAMIQUE DE FICHES TECHNIQUES (LIVE FOOD COST)
======================================================== */
function updateModalFoodCostPreview() {
  const rawIngs = document.getElementById('edit-recipe-ingredients').value;
  const priceVal = parseFloat(document.getElementById('edit-recipe-price').value) || 0;
  const ingredients = rawIngs.split('\n').map(s => s.trim()).filter(Boolean);

  if (typeof calculateRecipeFoodCost !== 'function') return;

  const fc = calculateRecipeFoodCost(ingredients, priceVal);

  const elCost = document.getElementById('modal-fc-cost');
  const elPct = document.getElementById('modal-fc-pct');
  const elMargin = document.getElementById('modal-fc-margin');
  const elBadge = document.getElementById('modal-fc-badge');
  const elBreakdown = document.getElementById('modal-fc-breakdown');

  if (elCost) elCost.textContent = `${fc.cost.toFixed(2)} DH`;
  if (elPct) {
    elPct.textContent = priceVal > 0 ? `${fc.foodCost}%` : 'Saisir Prix';
    elPct.style.color = fc.foodCost <= 32 ? '#10b981' : fc.foodCost <= 42 ? '#f59e0b' : '#ef4444';
  }
  if (elMargin) {
    elMargin.textContent = priceVal > 0 ? `${fc.margin}% (${fc.grossMarginDH.toFixed(2)} DH)` : '-';
  }
  if (elBadge) {
    if (priceVal <= 0) {
      elBadge.textContent = 'Prix manquant';
      elBadge.style.background = '#64748b';
    } else if (fc.foodCost <= 32) {
      elBadge.textContent = 'Food Cost Optimal (≤32%)';
      elBadge.style.background = '#10b981';
    } else if (fc.foodCost <= 42) {
      elBadge.textContent = 'Food Cost Modéré (33-42%)';
      elBadge.style.background = '#f59e0b';
    } else {
      elBadge.textContent = 'Food Cost Élevé (>42%)';
      elBadge.style.background = '#ef4444';
    }
  }

  if (elBreakdown) {
    if (fc.breakdown && fc.breakdown.length > 0) {
      elBreakdown.innerHTML = fc.breakdown.map(b => {
        const pctOfTotal = fc.cost > 0 ? Math.round((b.cost / fc.cost) * 100) : 0;
        return `<div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px dashed rgba(255,255,255,0.06);">
          <span>${escapeHtml(b.ingredient)} <strong style="color:var(--text);">${escapeHtml(b.quantity)}</strong></span>
          <span><strong style="color:#38bdf8;">${b.cost.toFixed(2)} DH</strong> <small style="color:var(--muted); font-size:10px;">(${pctOfTotal}%)</small></span>
        </div>`;
      }).join('');
    } else {
      elBreakdown.innerHTML = '<span style="color:var(--muted);">Saisissez des ingrédients pour afficher la valorisation unitaire.</span>';
    }
  }
}

function openRecipeEditor(productName) {
  const recipe = findRecipeForProduct(productName);
  if (recipe) {
    editRecipe(recipe.id);
  } else {
    document.getElementById('edit-recipe-id').value = 'rec_' + Date.now();
    document.getElementById('edit-recipe-name').value = productName.toUpperCase();
    document.getElementById('edit-recipe-cat').value = 'AUTRE';
    document.getElementById('edit-recipe-ingredients').value = '';
    document.getElementById('edit-recipe-price').value = findSellingPriceForRecipe(productName) || '';
    document.getElementById('modal-recipe-title').textContent = `Créer Fiche Technique : ${productName}`;
    
    const btnDelete = document.getElementById('btn-delete-recipe-modal');
    if (btnDelete) btnDelete.style.display = 'none';

    document.getElementById('recipe-modal').classList.add('visible');
    updateModalFoodCostPreview();
  }
}

function editRecipe(id) {
  const r = activeRecipes.find(x => x.id === id);
  if (!r) return;
  document.getElementById('edit-recipe-id').value = r.id;
  document.getElementById('edit-recipe-name').value = r.name;
  document.getElementById('edit-recipe-cat').value = r.category || 'AUTRE';
  document.getElementById('edit-recipe-ingredients').value = (r.ingredients || []).join('\n');
  document.getElementById('edit-recipe-price').value = r.sellPrice || findSellingPriceForRecipe(r.name) || '';
  document.getElementById('modal-recipe-title').textContent = `Modifier : ${r.name}`;
  
  const btnDelete = document.getElementById('btn-delete-recipe-modal');
  if (btnDelete) btnDelete.style.display = 'inline-flex';

  document.getElementById('recipe-modal').classList.add('visible');
  updateModalFoodCostPreview();
}

function closeModal() {
  document.getElementById('recipe-modal').classList.remove('visible');
}

function deleteRecipe(id) {
  const r = activeRecipes.find(x => x.id === id);
  const name = r ? r.name : 'cette fiche technique';

  if (!confirm(`⚠️ Êtes-vous sûr de vouloir supprimer définitivement la fiche technique "${name}" ?\n\nCette action retirera la fiche de la base et recalculera le déstockage et le Food Cost.`)) {
    return;
  }

  // 1. Filtrer et supprimer de activeRecipes
  activeRecipes = activeRecipes.filter(x => x.id !== id);

  // 2. Sauvegarder dans localStorage
  saveRecipes();

  // 3. Mettre à jour l'index en mémoire
  if (window.recipeNameIndex && r) {
    window.recipeNameIndex.delete(cleanText(r.name));
  }

  // 4. Supprimer de DATA si présent
  if (typeof DATA !== 'undefined' && Array.isArray(DATA) && r) {
    DATA.forEach(cat => {
      if (Array.isArray(cat.items)) {
        cat.items = cat.items.filter(it => cleanText(it.name) !== cleanText(r.name));
      }
    });
  }

  // 5. Enregistrer l'exclusion pour index.html
  try {
    const deletedList = JSON.parse(localStorage.getItem('gc_deleted_recipes_v1') || '[]');
    if (r && !deletedList.includes(r.id)) deletedList.push(r.id);
    if (r && !deletedList.includes(cleanText(r.name))) deletedList.push(cleanText(r.name));
    localStorage.setItem('gc_deleted_recipes_v1', JSON.stringify(deletedList));
  } catch (e) {}

  closeModal();
  renderRecipeList();
  recalculateCurrentView();
  console.log(`[Fiche Technique] Supprimée avec succès : "${name}"`);
}

function deleteRecipeFromModal() {
  const id = document.getElementById('edit-recipe-id').value;
  if (id) {
    deleteRecipe(id);
  }
}

function saveRecipeFromModal() {
  const id = document.getElementById('edit-recipe-id').value;
  const name = document.getElementById('edit-recipe-name').value.trim();
  const category = document.getElementById('edit-recipe-cat').value;
  const rawIngs = document.getElementById('edit-recipe-ingredients').value;
  const sellPrice = parseFloat(document.getElementById('edit-recipe-price').value) || 0;

  if (!name) {
    alert('Veuillez spécifier le nom du plat.');
    return;
  }

  const ingredients = rawIngs.split('\n').map(s => s.trim()).filter(Boolean);
  const fcCalc = typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost(ingredients, sellPrice) : { cost: 0, foodCost: 0, margin: 0, grossMarginDH: 0 };

  const recipeObj = {
    id: id || ('rec_' + Date.now()),
    name: name,
    category: category,
    ingredients: ingredients,
    sellPrice: sellPrice,
    cost: fcCalc.cost,
    foodCost: fcCalc.foodCost,
    margin: fcCalc.margin,
    grossMarginDH: fcCalc.grossMarginDH
  };

  const idx = activeRecipes.findIndex(x => x.id === id);
  if (idx >= 0) {
    activeRecipes[idx] = recipeObj;
  } else {
    activeRecipes.push(recipeObj);
  }

  // 1. Sauvegarde dans localStorage (persistant)
  saveRecipes();

  // 2. Mettre à jour l'index en mémoire
  if (window.recipeNameIndex) {
    window.recipeNameIndex.set(cleanText(name), recipeObj);
  }

  // 3. Mettre à jour DATA (pour index.html et cohérence globale)
  if (typeof DATA !== 'undefined' && Array.isArray(DATA)) {
    DATA.forEach(cat => {
      (cat.items || []).forEach(it => {
        if (cleanText(it.name) === cleanText(name)) {
          it.tech = ingredients;
          it.sellPrice = sellPrice;
          it.cost = fcCalc.cost;
          it.foodCost = fcCalc.foodCost;
          it.margin = fcCalc.margin;
          it.grossMarginDH = fcCalc.grossMarginDH;
        }
      });
    });
  }

  closeModal();
  renderRecipeList();
  recalculateCurrentView();

  console.log(`[Fiche Technique] Enregistrée avec succès : "${name}" | Coût=${fcCalc.cost} DH | Food Cost=${fcCalc.foodCost}%`);
}

function downloadUpdatedRecipesDataJs() {
  try {
    // 1. Construire les données DATA et BASE_RECIPES mises à jour
    const updatedBaseRecipes = activeRecipes.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category || 'AUTRE',
      ingredients: r.ingredients || []
    }));

    // 2. Créer le script exportable complet
    const fnStr = (typeof window.calculateRecipeFoodCost === 'function' ? window.calculateRecipeFoodCost : calculateRecipeFoodCost).toString();
    const dataObj = typeof window.DATA !== 'undefined' ? window.DATA : (typeof DATA !== 'undefined' ? DATA : []);
    const aliasObj = typeof window.ALIAS_MAP !== 'undefined' ? window.ALIAS_MAP : (typeof ALIAS_MAP !== 'undefined' ? ALIAS_MAP : {});
    const catObj = typeof window.INGREDIENT_CATEGORIES !== 'undefined' ? window.INGREDIENT_CATEGORIES : (typeof INGREDIENT_CATEGORIES !== 'undefined' ? INGREDIENT_CATEGORIES : {});
    const unitCostsObj = typeof window.INGREDIENT_UNIT_COSTS !== 'undefined' ? window.INGREDIENT_UNIT_COSTS : (typeof INGREDIENT_UNIT_COSTS !== 'undefined' ? INGREDIENT_UNIT_COSTS : {});

    let content = `/**\n * GREY CORNER — Base de données centralisée des Fiches Techniques et Recettes\n * Source Unique de Vérité (SSOT) mise à jour automatiquement le ${new Date().toISOString()}\n */\n\n(function(global) {\n`;
    content += `const DATA = ${JSON.stringify(dataObj, null, 2)};\n\n`;
    content += `const BASE_RECIPES = ${JSON.stringify(updatedBaseRecipes, null, 2)};\n\n`;
    content += `const ALIAS_MAP = ${JSON.stringify(aliasObj, null, 2)};\n\n`;
    content += `const INGREDIENT_CATEGORIES = ${JSON.stringify(catObj, null, 2)};\n\n`;
    content += `const INGREDIENT_UNIT_COSTS = ${JSON.stringify(unitCostsObj, null, 2)};\n\n`;
    content += `${fnStr}\n\n`;
    content += `global.CATEGORIES_DATA = DATA;\nglobal.DATA = DATA;\nglobal.BASE_RECIPES = BASE_RECIPES;\nglobal.ALIAS_MAP = ALIAS_MAP;\nglobal.INGREDIENT_CATEGORIES = INGREDIENT_CATEGORIES;\nglobal.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\nglobal.calculateRecipeFoodCost = calculateRecipeFoodCost;\nif (typeof window !== 'undefined') {\n  window.calculateRecipeFoodCost = calculateRecipeFoodCost;\n  window.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;\n}\n})(typeof window !== 'undefined' ? window : globalThis);\n`;

    const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "recipes-data.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("✅ Le fichier 'recipes-data.js' mis à jour a été généré et téléchargé avec succès !");
  } catch (err) {
    alert("Erreur lors de la génération de recipes-data.js : " + err.message);
  }
}

function exportRecipesJSON() {
  const str = JSON.stringify(activeRecipes, null, 2);
  const blob = new Blob([str], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GreyCorner_Fiches_Techniques_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importRecipesJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data) && data.length > 0) {
        activeRecipes = data;
        saveRecipes();
        renderRecipeList();
        recalculateCurrentView();
        alert(`✅ ${data.length} fiches techniques importées et enregistrées avec succès !`);
      } else {
        alert("Le fichier JSON ne contient pas de liste de fiches techniques valide.");
      }
    } catch (err) {
      alert("Erreur lors de la lecture du fichier JSON : " + err.message);
    }
  };
  reader.onerror = () => alert("Erreur de lecture du fichier. Veuillez réessayer.");
  reader.readAsText(file);
}

/* ========================================================
   9b. MERCURIALE & PRIX D'ACHAT DES MATIÈRES PREMIÈRES
======================================================== */
function loadCustomIngredientPrices() {
  try {
    const saved = localStorage.getItem('gc_ingredient_prices_v1');
    if (saved) {
      const customPrices = JSON.parse(saved);
      if (typeof window.INGREDIENT_UNIT_COSTS !== 'undefined') {
        Object.assign(window.INGREDIENT_UNIT_COSTS, customPrices);
      }
    }
  } catch (e) {
    console.warn('[Mercuriale] Erreur lecture localStorage:', e);
  }
}

function openPricesModal() {
  loadCustomIngredientPrices();
  document.getElementById('prices-modal').classList.add('visible');
  renderPricesTable();
}

function closePricesModal() {
  document.getElementById('prices-modal').classList.remove('visible');
}

function renderPricesTable() {
  const container = document.getElementById('prices-table-body');
  const search = cleanText(document.getElementById('search-prices-input').value);
  const costMap = window.INGREDIENT_UNIT_COSTS || {};

  const entries = Object.entries(costMap);
  const filtered = entries.filter(([k, v]) => {
    if (!search) return true;
    const label = v.label || k;
    return cleanText(label).includes(search) || cleanText(k).includes(search);
  });

  document.getElementById('prices-count-badge').textContent = `${entries.length} matières (${filtered.length} affichées)`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding:30px; color:var(--muted);">
          Aucune matière première trouvée pour "${escapeHtml(search)}".
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = filtered.map(([key, item]) => {
    const label = item.label || (key.charAt(0).toUpperCase() + key.slice(1));
    const unit = item.unit || 'g';

    let displayUnit = 'kg';
    let purchasePrice = (item.cost || 0) * 1000;
    let unitDesc = `${(item.cost || 0).toFixed(4)} DH/g`;

    if (unit === 'ml') {
      displayUnit = 'L';
      purchasePrice = (item.cost || 0) * 1000;
      unitDesc = `${(item.cost || 0).toFixed(4)} DH/ml`;
    } else if (unit === 'piece' || unit === 'p') {
      displayUnit = 'Pièce / Unité';
      purchasePrice = item.cost || 0;
      unitDesc = `${(item.cost || 0).toFixed(2)} DH/p`;
    }

    purchasePrice = Math.round(purchasePrice * 100) / 100;

    return `
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:10px 12px; font-weight:700; color:var(--text);">
          ${escapeHtml(label)}
          <span style="font-size:10px; color:var(--muted); display:block; font-weight:normal;">Réf: ${escapeHtml(key)}</span>
        </td>
        <td style="padding:10px; text-align:center;">
          <span style="background:var(--chip); color:var(--text); border:1px solid var(--border); padding:3px 8px; border-radius:6px; font-size:11px; font-weight:800;">
            ${displayUnit}
          </span>
        </td>
        <td style="padding:8px 12px; text-align:right;">
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px;">
            <input type="number" step="0.1" min="0" 
              class="price-edit-input" 
              data-key="${escapeHtml(key)}" 
              data-unit="${unit}" 
              value="${purchasePrice}" 
              style="width:95px; padding:6px 8px; text-align:right; font-weight:800; font-size:13px; border-radius:6px; border:1.5px solid var(--border); background:var(--bg); color:var(--accent);"
            />
            <span style="font-size:12px; font-weight:700; color:var(--muted);">DH</span>
          </div>
        </td>
        <td style="padding:10px 12px; text-align:right; font-weight:700; color:var(--muted); font-size:12px;">
          ${unitDesc}
        </td>
      </tr>
    `;
  }).join('');
}

function showAddNewPriceForm() {
  document.getElementById('add-price-form-box').style.display = 'block';
  document.getElementById('new-price-name').focus();
}

function hideAddNewPriceForm() {
  document.getElementById('add-price-form-box').style.display = 'none';
}

function confirmAddIngredientPrice() {
  const name = document.getElementById('new-price-name').value.trim();
  const unit = document.getElementById('new-price-unit').value;
  const priceVal = parseFloat(document.getElementById('new-price-val').value) || 0;

  if (!name) {
    alert("Veuillez saisir le nom de la matière première.");
    return;
  }
  if (priceVal <= 0) {
    alert("Veuillez spécifier un prix d'achat valide supérieur à 0.");
    return;
  }

  const key = cleanText(name);
  let baseUnit = 'g';
  let unitCost = priceVal / 1000;

  if (unit === 'l') {
    baseUnit = 'ml';
    unitCost = priceVal / 1000;
  } else if (unit === 'p') {
    baseUnit = 'piece';
    unitCost = priceVal;
  }

  if (!window.INGREDIENT_UNIT_COSTS) window.INGREDIENT_UNIT_COSTS = {};
  window.INGREDIENT_UNIT_COSTS[key] = {
    cost: unitCost,
    unit: baseUnit,
    label: name
  };

  saveAllIngredientPricesFromModal();

  document.getElementById('new-price-name').value = '';
  document.getElementById('new-price-val').value = '';
  hideAddNewPriceForm();
  renderPricesTable();
}

function saveAllIngredientPricesFromModal() {
  const inputs = document.querySelectorAll('.price-edit-input');
  if (!window.INGREDIENT_UNIT_COSTS) window.INGREDIENT_UNIT_COSTS = {};

  inputs.forEach(inp => {
    const key = inp.dataset.key;
    const unit = inp.dataset.unit;
    const val = parseFloat(inp.value) || 0;

    let unitCost = val / 1000;
    if (unit === 'piece' || unit === 'p') {
      unitCost = val;
    }

    if (window.INGREDIENT_UNIT_COSTS[key]) {
      window.INGREDIENT_UNIT_COSTS[key].cost = unitCost;
    } else {
      window.INGREDIENT_UNIT_COSTS[key] = {
        cost: unitCost,
        unit: unit,
        label: key
      };
    }
  });

  // Sauvegarde persistante dans localStorage
  try {
    localStorage.setItem('gc_ingredient_prices_v1', JSON.stringify(window.INGREDIENT_UNIT_COSTS));
  } catch (e) {
    console.error('Erreur sauvegarde localStorage prix:', e);
  }

  // Recalculer les coûts de toutes les fiches techniques actives
  if (Array.isArray(activeRecipes)) {
    activeRecipes.forEach(r => {
      const sellPrice = r.sellPrice || findSellingPriceForRecipe(r.name) || 0;
      if (typeof calculateRecipeFoodCost === 'function') {
        const fc = calculateRecipeFoodCost(r.ingredients, sellPrice);
        r.cost = fc.cost;
        r.foodCost = fc.foodCost;
        r.margin = fc.margin;
        r.grossMarginDH = fc.grossMarginDH;
      }
    });
    saveRecipes();
  }

  // Mettre à jour DATA si présent
  if (typeof DATA !== 'undefined' && Array.isArray(DATA)) {
    DATA.forEach(cat => {
      (cat.items || []).forEach(it => {
        if (typeof calculateRecipeFoodCost === 'function') {
          const sellPrice = it.sellPrice || parseFloat(String(it.price || 0).replace(/[^0-9.]/g, '')) || 0;
          const fc = calculateRecipeFoodCost(it.tech, sellPrice);
          it.cost = fc.cost;
          it.foodCost = fc.foodCost;
          it.margin = fc.margin;
          it.grossMarginDH = fc.grossMarginDH;
        }
      });
    });
  }

  renderRecipeList();
  recalculateCurrentView();
  alert("✅ Prix des matières premières enregistrés ! Tous les Food Costs et Marges ont été recalculés avec succès.");
}

/* ========================================================
   10. LECTURE EXCEL (SHEETJS), PARSER DE FICHIER & AUTO-SYNC /VENTES
======================================================== */
function extractDateFromFilename(rawFilename) {
  if (!rawFilename) return null;
  let filename = rawFilename;
  try { filename = decodeURIComponent(rawFilename); } catch (e) {}

  filename = filename.trim();

  // 1. Format ISO avec séparateurs : YYYY-MM-DD ou YYYY_MM_DD ou YYYY.MM.DD
  const mIso = filename.match(/\b(20\d{2})[-_.](0[1-9]|1[0-2])[-_.](0[1-9]|[12]\d|3[01])\b/);
  if (mIso) return `${mIso[1]}-${mIso[2]}-${mIso[3]}`;

  // 2. Format compact YYYYMMDD (ex: 20260829)
  const mCompact = filename.match(/\b(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\b/);
  if (mCompact) return `${mCompact[1]}-${mCompact[2]}-${mCompact[3]}`;

  // 3. Format FR avec séparateurs : DD-MM-YYYY ou DD_MM_YYYY (ex: 29-08-2026)
  const mFr = filename.match(/\b(0[1-9]|[12]\d|3[01])[-_.](0[1-9]|1[0-2])[-_.](20\d{2})\b/);
  if (mFr) return `${mFr[3]}-${mFr[2]}-${mFr[1]}`;

  // 4. Format FR compact DDMMYYYY (ex: 29082026)
  const mFrCompact = filename.match(/\b(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(20\d{2})\b/);
  if (mFrCompact) return `${mFrCompact[3]}-${mFrCompact[2]}-${mFrCompact[1]}`;

  // Fallback 8 chiffres
  const mFallback = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (mFallback) return `${mFallback[1]}-${mFallback[2]}-${mFallback[3]}`;

  return null;
}

function parseWorkbookToRows(workbook) {
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (json.length < 2) return [];

  let headerRowIndex = 0;
  let colFamille = -1, colProduit = -1, colPrix = -1, colQte = -1, colTotal = -1;

  for (let i = 0; i < Math.min(10, json.length); i++) {
    const row = json[i].map(x => cleanText(x));
    for (let j = 0; j < row.length; j++) {
      const val = row[j];
      if (val.includes('famille')) colFamille = j;
      if (val.includes('produit') || val.includes('article') || val.includes('designation') || val.includes('libelle')) colProduit = j;
      if (val === 'prix' || val.includes('pu') || val.includes('prix unitaire')) colPrix = j;
      if (val.includes('qte') || val.includes('quantite') || val === 'qty') colQte = j;
      if (val.includes('total') || val.includes('montant')) colTotal = j;
    }
    if (colProduit !== -1 && colQte !== -1) {
      headerRowIndex = i;
      break;
    }
  }

  if (colProduit === -1) { colProduit = 1; colFamille = 0; colPrix = 2; colQte = 3; colTotal = 4; headerRowIndex = -1; }

  const rawRows = [];
  for (let i = headerRowIndex + 1; i < json.length; i++) {
    const row = json[i];
    if (!row || row.length === 0) continue;

    const prod = (row[colProduit] || '').toString().trim();
    if (!prod || cleanText(prod) === 'total' || cleanText(prod) === 'somme') continue;

    const parseNum = (v) => {
      if (typeof v === 'number') return v;
      if (!v) return 0;
      return parseFloat(v.toString().replace(/\s/g, '').replace(',', '.')) || 0;
    };

    const fam = colFamille >= 0 ? (row[colFamille] || '').toString().trim() : '';
    const price = colPrix >= 0 ? parseNum(row[colPrix]) : 0;
    const qty = colQte >= 0 ? parseNum(row[colQte]) : 1;
    const total = colTotal >= 0 ? parseNum(row[colTotal]) : (qty * price);

    const finalPrice = price > 0 ? price : (total > 0 && qty > 0 ? total / qty : 0);
    const finalTotal = total > 0 ? total : (qty * finalPrice);

    // Exclure les lignes à 0 DH (boissons chaudes, thés, cafés et options déjà inclus dans les formules de petit-déjeuner / menus) pour éviter les doublons de déstockage matière première
    if (qty > 0 && (finalPrice > 0 || finalTotal > 0)) {
      rawRows.push({ family: fam, product: prod, price: finalPrice, qty, total: finalTotal });
    }
  }

  return rawRows;
}

// Gestion de fichiers importés par l'utilisateur (unitaire ou multiple)
async function handleUploadedFiles(fileList) {
  if (!fileList || fileList.length === 0) return;

  let loadedFilesCount = 0;
  let lastLoadedDate = selectedDate;

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const extractedDate = extractDateFromFilename(file.name) || selectedDate;

    try {
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const rows = parseWorkbookToRows(workbook);

      if (rows.length > 0) {
        monthlySalesDB[extractedDate] = rows;
        loadedFilesCount++;
        lastLoadedDate = extractedDate;
      }
    } catch (err) {
      console.warn("Erreur lors de la lecture du fichier : " + file.name, err);
    }
  }

  if (loadedFilesCount > 0) {
    saveMonthlySalesDB();
    selectedDate = lastLoadedDate;
    selectedYearMonth = selectedDate.slice(0, 7);
    renderCalendar();
    recalculateCurrentView();

    const banner = document.getElementById('sync-status-banner');
    if (banner) {
      banner.style.display = 'block';
      banner.textContent = `✅ ${loadedFilesCount} fichier(s) de ventes chargé(s) avec succès !`;
      setTimeout(() => { banner.style.display = 'none'; }, 6000);
    }
  } else {
    alert("Aucune ligne de vente exploitable n'a été trouvée dans les fichiers sélectionnés.");
  }
}

// Détection et synchronisation automatique avec le dossier racine /ventes
async function autoScanVentesFolder(showUserAlert = false) {
  const banner = document.getElementById('sync-status-banner');
  if (banner) {
    banner.style.display = 'block';
    banner.textContent = "🔄 Analyse et synchronisation du dossier /ventes en cours...";
    banner.style.color = "var(--accent)";
  }

  let foundCount = 0;
  let loadedDates = [];

  // Helper pour tenter plusieurs chemins relatifs avec cache-busting
  async function fetchFile(path, fallbackUrl = null) {
    const candidatePaths = [path, './' + path, '/' + path];
    if (fallbackUrl) candidatePaths.push(fallbackUrl);
    for (const p of candidatePaths) {
      try {
        const sep = p.includes('?') ? '&' : '?';
        const resp = await fetch(p + sep + 't=' + Date.now(), { cache: 'no-store' });
        if (resp.ok) return resp;
      } catch (e) { console.warn('[Auto-sync fetch]', e); }
    }
    return null;
  }

  // Map unifiée pour collecter les fichiers : Map<filename, downloadUrl|null>
  const filesToProcess = new Map();

  // 1. SOURCE DYNAMIQUE EN TEMPS RÉEL : API GitHub
  // Détecte instantanément TOUT fichier poussé sur le dépôt, même sans manifest.json !
  try {
    const ghResp = await fetch('https://api.github.com/repos/hichamatlas75-del/Fiche-technique/contents/ventes?t=' + Date.now(), {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      cache: 'no-store'
    });
    if (ghResp.ok) {
      const ghItems = await ghResp.json();
      if (Array.isArray(ghItems)) {
        ghItems.forEach(item => {
          if (item && item.name) {
            const low = item.name.toLowerCase();
            if (low.endsWith('.xls') || low.endsWith('.xlsx')) {
              filesToProcess.set(item.name, item.download_url || null);
            }
          }
        });
      }
    }
  } catch (e) {
    console.warn('[Auto-sync GitHub API]', e);
  }

  // 2. SOURCE STATIQUE : manifest.json (fonctionne en local ou si API GitHub indisponible)
  try {
    const manifestResp = await fetchFile('ventes/manifest.json');
    if (manifestResp) {
      const manifest = await manifestResp.json();
      const rawFiles = manifest ? manifest.files : [];
      const filesList = Array.isArray(rawFiles) ? rawFiles : (rawFiles ? [rawFiles] : []);
      filesList.forEach(fname => {
        if (fname && !filesToProcess.has(fname)) {
          filesToProcess.set(fname, null);
        }
      });
    }
  } catch (e) {
    console.warn('[Auto-sync manifest.json]', e);
  }

  // 3. SCANNER DE CANDIDATS (ACTIF UNIQUEMENT EN SECOURS si aucun fichier détecté par GitHub API / manifest.json)
  if (filesToProcess.size === 0) {
    const monthsToScan = new Set([
      selectedYearMonth,
      new Date().toLocaleDateString('en-CA').slice(0, 7)
    ]);

    monthsToScan.forEach(ym => {
      const [yearStr, monthStr] = ym.split('-');
      const totalDays = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();

      for (let day = 1; day <= totalDays; day++) {
        const dayStr = String(day).padStart(2, '0');
        const compactDate = `${yearStr}${monthStr}${dayStr}`;

        const candidateNames = [
          `Fin_Journée_${compactDate}.xls`,
          `Fin_Journee_${compactDate}.xls`,
          `Fin_Journée_${compactDate}.xlsx`,
          `Fin_Journee_${compactDate}.xlsx`
        ];

        candidateNames.forEach(cName => {
          if (!filesToProcess.has(cName)) {
            filesToProcess.set(cName, null);
          }
        });
      }
    });
  }

  // 4. CHARGEMENT ET TRAITEMENT DES FICHIERS
  for (const [fname, downloadUrl] of filesToProcess.entries()) {
    const dKey = extractDateFromFilename(fname);
    if (!dKey) continue;

    try {
      const resp = await fetchFile('ventes/' + encodeURIComponent(fname), downloadUrl);
      if (resp) {
        const buf = await resp.arrayBuffer();
        const wb = XLSX.read(new Uint8Array(buf), { type: 'array' });
        const rows = parseWorkbookToRows(wb);
        if (rows.length > 0) {
          monthlySalesDB[dKey] = rows;
          foundCount++;
          if (!loadedDates.includes(dKey)) {
            loadedDates.push(dKey);
          }
        }
      }
    } catch (e) {
      console.warn('[Auto-sync file error]', fname, e);
    }
  }

  // 5. SAUVEGARDE & ACTUALISATION DE L'INTERFACE
  if (foundCount > 0) {
    saveMonthlySalesDB();

    // AUTO-SÉLECTION : Basculer automatiquement sur la journée la plus récente avec des données
    const availableDates = Object.keys(monthlySalesDB).filter(d => monthlySalesDB[d] && monthlySalesDB[d].length > 0).sort();
    if (availableDates.length > 0) {
      selectedDate = availableDates[availableDates.length - 1];
      selectedYearMonth = selectedDate.slice(0, 7);
    }

    renderCalendar();
    recalculateCurrentView();

    loadedDates.sort();
    const lastDateFR = formatDateFR(selectedDate);
    const msg = `✅ ${foundCount} journée(s) synchronisée(s) ! Dernière date active : ${lastDateFR}.`;

    if (banner) {
      banner.style.color = "var(--ok)";
      banner.textContent = msg;
    }
    if (showUserAlert) {
      const recentList = loadedDates.slice(-6).map(d => '• ' + formatDateFR(d)).join('\n');
      alert(`✅ Synchronisation réussie !\n${foundCount} fichier(s) traités.\n\nJournées récentes chargées :\n${recentList}\n\nAffichage automatique des ventes du ${lastDateFR}.`);
    }
  } else {
    if (banner) {
      banner.style.color = "var(--muted)";
      banner.textContent = "📁 Dossier /ventes prêt. Déposez vos fichiers 'Fin_Journée_YYYYMMDD.xls' pour auto-chargement.";
    }
    if (showUserAlert) {
      alert("Aucun nouveau fichier de vente n'a été trouvé dans le dossier /ventes pour cette période.");
    }
  }
}

/* ========================================================
   11. EXPORT EXCEL MENSUEL & COMPARATIF COMMANDES
======================================================== */
function exportToExcel() {
  if (aggregatedIngredients.length === 0) {
    alert("Aucune donnée à exporter pour cette période.");
    return;
  }

  const isMonthly = currentViewMode === 'month';
  const periodLabel = isMonthly ? `Cumul Mensuel — ${formatMonthFR(selectedYearMonth)}` : `Journée du ${formatDateFR(selectedDate)}`;

  // Feuille 1: Synthèse des Matières Premières Consommées
  const wsIngData = [
    ["GREY CORNER — DÉSTOCKAGE MATIÈRES PREMIÈRES"],
    [`Période : ${periodLabel}`],
    ["Date d'export : " + new Date().toLocaleString('fr-FR')],
    [],
    ["Ingrédient / Matière Première", "Catégorie", "Quantité Totale Consommée", "Unité", "Nombre de Plats", "Détail Plats Consommateurs"]
  ];

  aggregatedIngredients.forEach(ing => {
    let qVal = ing.totalQty;
    let uStr = ing.unit;
    if (ing.unit === 'g' && ing.totalQty >= 1000) {
      qVal = (ing.totalQty / 1000);
      uStr = 'Kg';
    } else if (ing.unit === 'ml' && ing.totalQty >= 1000) {
      qVal = (ing.totalQty / 1000);
      uStr = 'Litres';
    }
    const dishesDetail = ing.dishes.map(d => `${d.dish} (${d.portions}p × ${d.unitQty}${d.unit})`).join(' ; ');
    wsIngData.push([ing.name, ing.category.toUpperCase(), qVal, uStr, ing.dishes.length, dishesDetail]);
  });

  // Feuille 2: Détail des Ventes
  const wsSalesData = [
    [`GREY CORNER — RELEVÉ DES VENTES (${periodLabel})`],
    [],
    ["Famille Caisse", "Article Vendu", "Quantité Vendue", "Prix Unitaire (DH)", "Total Vente (DH)", "Fiche Technique Associée", "Ingrédients Recette"]
  ];

  currentSalesData.forEach(s => {
    const ftName = s.matchedRecipe ? s.matchedRecipe.name : "NON CONFIGURÉ / BOISSON";
    const ings = s.matchedRecipe ? s.matchedRecipe.ingredients.join(' | ') : "";
    wsSalesData.push([s.family, s.product, s.qty, s.price, s.total, ftName, ings]);
  });

  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet(wsIngData);
  const ws2 = XLSX.utils.aoa_to_sheet(wsSalesData);

  XLSX.utils.book_append_sheet(wb, ws1, isMonthly ? "Synthèse Mensuelle" : "Matières Premières");
  XLSX.utils.book_append_sheet(wb, ws2, isMonthly ? "Ventes du Mois" : "Ventes Journalières");

  // Si Mensuel: on ajoute une Feuille 3 de Matrice Déstockage par Jour
  if (isMonthly) {
    const activeDates = Object.keys(monthlySalesDB).filter(d => d.startsWith(selectedYearMonth) && monthlySalesDB[d].length > 0).sort();
    if (activeDates.length > 0) {
      const matrixHeaders = ["Ingrédient / Matière Première", "Catégorie", "Unité", "TOTAL MOIS", ...activeDates.map(d => d.slice(8, 10) + '/' + d.slice(5, 7))];
      const wsMatrixData = [
        [`GREY CORNER — MATRICE JOURNALIÈRE DU MOIS (${formatMonthFR(selectedYearMonth)})`],
        [],
        matrixHeaders
      ];

      // Calcul par jour pour chaque ingrédient
      const dailyIngMaps = {};
      activeDates.forEach(dKey => {
        const dMap = {};
        const dRows = monthlySalesDB[dKey] || [];
        dRows.forEach(row => {
          const recipe = findRecipeForProduct(row.product, row.family);
          if (recipe) {
            (recipe.ingredients || []).forEach(ingLine => {
              const parsed = parseIngredientLine(ingLine);
              const totalQ = parsed.qty * (parseFloat(row.qty) || 0);
              const k = cleanText(parsed.name) + '_' + parsed.unit;
              dMap[k] = (dMap[k] || 0) + totalQ;
            });
          }
        });
        dailyIngMaps[dKey] = dMap;
      });

      aggregatedIngredients.forEach(ing => {
        const k = cleanText(ing.name) + '_' + ing.unit;
        let totQ = ing.totalQty;
        let uStr = ing.unit;
        if (ing.unit === 'g' && ing.totalQty >= 1000) { totQ /= 1000; uStr = 'Kg'; }
        else if (ing.unit === 'ml' && ing.totalQty >= 1000) { totQ /= 1000; uStr = 'Litres'; }

        const rowCells = [ing.name, ing.category.toUpperCase(), uStr, totQ];
        activeDates.forEach(dKey => {
          let dayVal = dailyIngMaps[dKey][k] || 0;
          if (ing.unit === 'g' && ing.totalQty >= 1000) dayVal /= 1000;
          else if (ing.unit === 'ml' && ing.totalQty >= 1000) dayVal /= 1000;
          rowCells.push(dayVal > 0 ? dayVal : '');
        });
        wsMatrixData.push(rowCells);
      });

      const ws3 = XLSX.utils.aoa_to_sheet(wsMatrixData);
      XLSX.utils.book_append_sheet(wb, ws3, "Matrice par Jour");
    }
  }

  const fileName = isMonthly ? `GreyCorner_Destockage_Mensuel_${selectedYearMonth}.xlsx` : `GreyCorner_Destockage_${selectedDate}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/* ========================================================
   13. MODULE D'AUDIT DE STOCK FLASH & FIN DE MOIS (PDF & MULTI-ARTICLES)
======================================================== */
let auditMonthlyArticles = [];
let currentAuditCatFilter = 'all';
let currentAuditStatusFilter = 'all';
// Unité pratique de pesée pour l'Audit Flash (g→Kg, ml→L)
let auditFlashFactor = 1;       // diviseur : 1000 pour g→Kg ou ml→L, 1 sinon
let auditFlashDisplayUnit = 'unité'; // unité affichée à l'utilisateur (Kg, L, p…)


function switchAuditSubTab(mode) {
  const btnFlash = document.getElementById('btn-subtab-flash');
  const btnMonth = document.getElementById('btn-subtab-month');
  const viewFlash = document.getElementById('audit-view-flash');
  const viewMonth = document.getElementById('audit-view-month');

  if (mode === 'flash') {
    btnFlash.classList.add('active');
    btnMonth.classList.remove('active');
    viewFlash.style.display = 'block';
    viewMonth.style.display = 'none';
    initAuditFlashDropdown();
  } else {
    btnMonth.classList.add('active');
    btnFlash.classList.remove('active');
    viewMonth.style.display = 'block';
    viewFlash.style.display = 'none';
    if (auditMonthlyArticles.length === 0) {
      syncAuditWithMonthlySales();
    }
  }
}

// 13.1 AUDIT FLASH
function initAuditFlashDropdown() {
  const select = document.getElementById('flash-ing-select');
  if (!select) return;

  const currentVal = select.value;
  const recipesList = (activeRecipes && activeRecipes.length > 0) ? activeRecipes : (window.BASE_RECIPES || []);

  const uniqueIngs = new Map();
  recipesList.forEach(r => {
    (r.ingredients || []).forEach(line => {
      const parsed = parseIngredientLine(line);
      const clean = cleanText(parsed.name);
      if (!uniqueIngs.has(clean) && clean.length > 1) {
        uniqueIngs.set(clean, { name: parsed.name, unit: parsed.unit });
      }
    });
  });

  const sorted = [...uniqueIngs.values()].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  // Fonction pour convertir l'unité brute en unité pratique de pesée
  function toDisplayUnit(u) {
    if (u === 'g') return 'Kg';
    if (u === 'ml') return 'L';
    return u;
  }

  select.innerHTML = '<option value="">-- Choisir un ingrédient (' + sorted.length + ' disponibles) --</option>' +
    sorted.map(ing => `<option value="${ing.name}" data-unit="${ing.unit}">${ing.name} (${toDisplayUnit(ing.unit)})</option>`).join('');

  if (currentVal) {
    select.value = currentVal;
  }
}

function onFlashIngredientChange() {
  const select = document.getElementById('flash-ing-select');
  if (!select) return;
  const opt = select.options[select.selectedIndex];
  if (!opt || !select.value) return;

  const baseUnit = opt.dataset.unit || 'g';

  // Conversion vers l'unité pratique de pesée (g→Kg, ml→L)
  if (baseUnit === 'g') {
    auditFlashDisplayUnit = 'Kg';
    auditFlashFactor = 1000;
  } else if (baseUnit === 'ml') {
    auditFlashDisplayUnit = 'L';
    auditFlashFactor = 1000;
  } else {
    auditFlashDisplayUnit = baseUnit;
    auditFlashFactor = 1;
  }

  // Mettre à jour tous les libellés d'unité dans le formulaire
  document.querySelectorAll('.flash-unit-lbl').forEach(el => el.textContent = auditFlashDisplayUnit);

  // Pré-remplir le théorique en unité pratique (Kg ou L, pas g ni ml)
  const cTarget = cleanText(select.value);
  const found = aggregatedIngredients.find(item => cleanText(item.name) === cTarget || cleanText(item.name).includes(cTarget));
  if (found) {
    document.getElementById('flash-theorique').value = (found.totalQty / auditFlashFactor).toFixed(3);
  } else {
    document.getElementById('flash-theorique').value = '0';
  }

  // Prix unitaire par défaut en DH / unité pratique (DH/Kg, DH/L, DH/p)
  const cat = categorizeIngredient(select.value);
  let defaultPrice = 50;
  if (cat === 'viandes') defaultPrice = 85;
  else if (cat === 'poissons') defaultPrice = 110;
  else if (cat === 'fromages') defaultPrice = 65;
  else if (cat === 'boissons') defaultPrice = 15;
  else if (cat === 'legumes') defaultPrice = 12;
  else if (cat === 'epicerie') defaultPrice = 18;
  document.getElementById('flash-prix').value = defaultPrice;

  calculateAuditFlash();
}


function calculateAuditFlash() {
  const sInit = parseFloat(document.getElementById('flash-s-init').value) || 0;
  const achats = parseFloat(document.getElementById('flash-achats').value) || 0;
  const sFinal = parseFloat(document.getElementById('flash-s-final').value) || 0;
  const theo = parseFloat(document.getElementById('flash-theorique').value) || 0;
  const casse = parseFloat(document.getElementById('flash-casse').value) || 0;
  const prix = parseFloat(document.getElementById('flash-prix').value) || 0;
  const select = document.getElementById('flash-ing-select');
  // Utiliser l'unité pratique de pesée (Kg, L, p…) définie à la sélection de l'ingrédient
  const unit = auditFlashDisplayUnit || (select && select.options[select.selectedIndex] ? select.options[select.selectedIndex].dataset.unit || 'unité' : 'unité');

  const consReelle = (sInit + achats) - sFinal;
  const consAttendue = theo + casse;
  const ecart = consReelle - consAttendue;
  const ecartPct = consAttendue > 0 ? (ecart / consAttendue) * 100 : (ecart !== 0 ? Infinity : 0);
  const impactDH = ecart * prix;

  const resBox = document.getElementById('flash-result-box');
  const badge = document.getElementById('flash-status-badge');
  const diagBox = document.getElementById('flash-diagnostic-box');

  resBox.style.display = 'block';
  document.getElementById('flash-kpi-reel').textContent = consReelle.toFixed(2) + ' ' + unit;
  document.getElementById('flash-kpi-attendu').textContent = consAttendue.toFixed(2) + ' ' + unit;
  
  const sign = ecart > 0 ? '+' : '';
  document.getElementById('flash-kpi-ecart').textContent = sign + ecart.toFixed(2) + ' ' + unit;
  document.getElementById('flash-kpi-ecart-pct').textContent = sign + ecartPct.toFixed(1) + '%';
  document.getElementById('flash-kpi-impact').textContent = sign + impactDH.toFixed(2) + ' DH';

  if (Math.abs(ecartPct) <= 3 || (Math.abs(ecart) < 0.05 && consAttendue > 0)) {
    badge.className = 'status-badge ok';
    badge.textContent = 'CONFORME (Tolérance ±3%)';
    diagBox.innerHTML = `<strong>✅ Situation Conforme :</strong> Le dosage en cuisine et les fiches techniques sont scrupuleusement respectés. L'écart (${sign}${ecart.toFixed(2)} ${unit}) est dans la marge normale de manipulation.`;
  } else if (ecartPct > 3 && ecartPct <= 8) {
    badge.className = 'status-badge warn';
    badge.textContent = 'SURDOSAGE LÉGER';
    diagBox.innerHTML = `<strong>⚠️ Dérive Modérée (+ ${ecartPct.toFixed(1)}%) :</strong> Légère surconsommation constatée (${impactDH.toFixed(2)} DH de surcoût). Recommandation : vérifier le portionnage en cuisine, le calibrage des cuillères/balances et la tare au dressage.`;
  } else if (ecartPct > 8) {
    badge.className = 'status-badge danger';
    badge.textContent = 'SURCONSOMMATION CRITIQUE';
    diagBox.innerHTML = `<strong>🚨 Surconsommation Critique (+ ${ecartPct.toFixed(1)}%) :</strong> Dérive financière de ${impactDH.toFixed(2)} DH. Causes fréquentes : surdosage systématique des portions, casse importante non enregistrée, coulage ou vol. Réaliser un recomptage physique immédiat.`;
  } else {
    badge.className = 'status-badge under';
    badge.textContent = 'SOUS-DOSAGE';
    diagBox.innerHTML = `<strong>📉 Consommation Inférieure aux Recettes (${ecartPct.toFixed(1)}%) :</strong> Moins de matière consommée que prévu. Vérifier la conformité de la fiche technique (grammage surévalué) ou contrôler que les portions servies aux clients ne sont pas sous-dosées.`;
  }
}

// 13.2 LECTURE INTELLIGENTE DES FICHIERS PDF & EXCEL (ACHATS, INVENTAIRES CUISINE, BAR, PT DEJEUNER, CASSE)
async function handleAuditFileUpload(event, targetType) {
  const fileList = event.target.files;
  if (!fileList || fileList.length === 0) return;

  const cardId = targetType === 'm1' ? 'dz-m1' : (targetType === 'achats' ? 'dz-achats' : (targetType === 'm' ? 'dz-m' : 'dz-casse'));
  const statusId = targetType === 'm1' ? 'status-m1' : (targetType === 'achats' ? 'status-achats' : (targetType === 'm' ? 'status-m' : 'status-casse'));
  const card = document.getElementById(cardId);
  const status = document.getElementById(statusId);

  let totalExtractedCount = 0;

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];

    if (file.name.endsWith('.pdf')) {
      try {
        if (status) {
          status.textContent = `⏳ Analyse du fichier ${i + 1}/${fileList.length} (${file.name})...`;
          status.style.display = 'block';
        }
        const extractedRows = await extractDataFromPDF(file, (msg) => {
          if (status) status.textContent = `⏳ ${file.name} : ${msg}`;
        });
        applyExtractedDataToAudit(extractedRows, targetType, i === 0);
        totalExtractedCount += extractedRows.length;
      } catch (err) {
        console.error('Erreur lecture PDF:', err);
      }
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      try {
        if (status) {
          status.textContent = `⏳ Analyse du fichier Excel ${i + 1}/${fileList.length}...`;
          status.style.display = 'block';
        }
        const buffer = await file.arrayBuffer();
        const data = new Uint8Array(buffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const extracted = parseExcelRowsToAuditData(rows);
        applyExtractedDataToAudit(extracted, targetType, i === 0);
        totalExtractedCount += extracted.length;
      } catch (err) {
        console.error('Erreur lecture Excel:', err);
      }
    }
  }

  if (card && status) {
    card.classList.add('loaded');
    status.textContent = `✅ ${fileList.length} fichier(s) analysé(s) (${totalExtractedCount} lignes importées)`;
    status.style.display = 'block';
  }
}

async function extractDataFromPDF(file, onProgress) {
  if (typeof pdfjsLib === 'undefined') {
    throw new Error('PDF.js non chargé');
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullTextLines = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Regrouper les éléments par ligne approximative (Y)
    const items = textContent.items;
    let linesMap = new Map();
    items.forEach(it => {
      const y = Math.round(it.transform[5]);
      if (!linesMap.has(y)) linesMap.set(y, []);
      linesMap.get(y).push(it.str);
    });

    // Trier les lignes du haut vers le bas
    const sortedY = [...linesMap.keys()].sort((a, b) => b - a);
    sortedY.forEach(y => {
      const lineStr = linesMap.get(y).join(' ').trim();
      if (lineStr.length > 2) fullTextLines.push(lineStr);
    });
  }

  // Si le PDF est une image scannée sans flux texte (0 caractère extrait), utiliser l'OCR Tesseract.js
  if (fullTextLines.length === 0 && typeof Tesseract !== 'undefined') {
    try {
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        if (onProgress) onProgress(`Numérisation OCR Page ${pageNum}/${pdf.numPages}...`);
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        const worker = await Tesseract.createWorker('fra');
        const ret = await worker.recognize(canvas);
        await worker.terminate();

        if (ret && ret.data && ret.data.text) {
          const ocrLines = ret.data.text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
          fullTextLines.push(...ocrLines);
        }
      }
    } catch (ocrErr) {
      console.warn('OCR non exécuté ou erreur:', ocrErr);
    }
  }

  return parseTextLinesToAudit(fullTextLines);
}

function parseTextLinesToAudit(lines) {
  const result = [];
  const validUnits = 'kg|g|gr|l|litre|litres|cl|ml|p|pcs|pc|piece|pieces|paquet|paquets|boite|boites|boîte|boîtes|carton|cartons|btl|bouteille|bouteilles|unite|unites';
  const categoryWords = ['barman', 'personnel', 'petit-dejeuner', 'petit-déjeuner', 'cuisine', 'economat', 'épicerie', 'epicerie', 'boissons'];

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    if (line.startsWith('Position') || line.startsWith('Rapport') || line.startsWith('Période') || line.startsWith('Consommation') || line.startsWith('Détails') || line.startsWith('DÉSIGNATION') || line.startsWith('DESIGNATION') || line.startsWith('BILAN') || line.startsWith('Total') || line.startsWith('Articles') || line.startsWith('Grey Corner') || line.startsWith('#') || line.startsWith('Coût Total') || line.startsWith('SOMME TOTALE')) return;
    if (line.includes('Casse physique:') || line.includes('Cuisine:') || line.includes('Barman:') || line.includes('Péremption:') || line.includes('Autre:')) return;

    let cleanLine = line.replace(/^\d+\s+/, '').trim();

    // FORMAT 1: [DÉSIGNATION] [CATÉGORIE] [QTÉ] [UNITÉ] [TOTAL DH] (Rapport Achats / Conso Exhaustive)
    const catRegex = new RegExp('\\s+(' + categoryWords.join('|') + ')\\s+([0-9]+[.,]?[0-9]*)\\s*(' + validUnits + ')?(?:\\s+([0-9]+[.,]?[0-9]*))?$', 'i');
    let m = cleanLine.match(catRegex);
    if (m) {
      const rawName = cleanLine.substring(0, cleanLine.indexOf(m[0])).trim();
      const qty = parseFloat(m[2].replace(',', '.'));
      const unit = (m[3] || 'g').toLowerCase().trim();
      const valTotal = m[4] ? parseFloat(m[4].replace(',', '.')) : 0;
      const unitPrice = (qty > 0 && valTotal > 0) ? (valTotal / qty) : 0;
      if (rawName.length >= 2 && !isNaN(qty)) {
        result.push({ name: rawName, qty, unit, price: unitPrice });
        return;
      }
    }

    // FORMAT 2: [DÉSIGNATION] [QTÉ] [UNITÉ] [P.U DH] [TOTAL DH] [FICHES] (Rapport Casse)
    const casseRegex = new RegExp('^(.+?)\\s+([0-9]+[.,]?[0-9]*)\\s*(' + validUnits + ')?\\s+([0-9]+[.,]?[0-9]*)\\s*(?:dh)?\\s+([0-9]+[.,]?[0-9]*)\\s*(?:dh)?', 'i');
    m = cleanLine.match(casseRegex);
    if (m) {
      const rawName = m[1].trim();
      const qty = parseFloat(m[2].replace(',', '.'));
      const unit = (m[3] || 'g').toLowerCase().trim();
      const price = parseFloat(m[4].replace(',', '.'));
      if (rawName.length >= 2 && !isNaN(qty)) {
        result.push({ name: rawName, qty, unit, price });
        return;
      }
    }

    // FORMAT 3: [DÉSIGNATION] [UNITÉ] [QTÉ] (Rapport Inventaire Physique Grey Corner)
    // Ex: "Amande Kg 0.1", "COCA 33CL Paquet 0.5", "BLANC POULET KG Kg 16.063", "CREM FRAICHE 1 L L 4"
    const unitFirstRegex = new RegExp('^(.+?)\\s+(' + validUnits + ')\\s+([0-9]+[.,]?[0-9]*)$', 'i');
    m = cleanLine.match(unitFirstRegex);
    if (m) {
      const rawName = m[1].trim();
      const unit = m[2].toLowerCase().trim();
      const qty = parseFloat(m[3].replace(',', '.'));
      if (rawName.length >= 2 && !isNaN(qty)) {
        result.push({ name: rawName, qty, unit, price: 0 });
        return;
      }
    }

    // FORMAT 4: Standard [DÉSIGNATION] [QTÉ] [UNITÉ] [PRIX?]
    const stdRegex = new RegExp('^(.+?)\\s+([0-9]+[.,]?[0-9]*)\\s*(' + validUnits + ')?(?:\\s+([0-9]+[.,]?[0-9]*))?$', 'i');
    m = cleanLine.match(stdRegex);
    if (m) {
      const rawName = m[1].replace(/^[0-9\-_.]+\s*/, '').trim();
      const qty = parseFloat(m[2].replace(',', '.'));
      const unit = (m[3] || 'g').toLowerCase().trim();
      const price = m[4] ? parseFloat(m[4].replace(',', '.')) : 0;
      if (rawName.length >= 2 && !isNaN(qty)) {
        result.push({ name: rawName, qty, unit, price });
      }
    }
  });

  return result;
}

function parseExcelRowsToAuditData(rows) {
  const result = [];
  if (!rows || rows.length === 0) return result;

  let headerIndex = -1;
  let nameCol = -1, qtyCol = -1, unitCol = -1, priceCol = -1, totalCol = -1;

  // 1. Chercher la ligne d'en-tête sur les 30 premières lignes
  for (let i = 0; i < Math.min(rows.length, 30); i++) {
    if (!Array.isArray(rows[i])) continue;
    const rowCells = rows[i].map(x => String(x || '').toLowerCase().trim());
    const rowStr = rowCells.join(' ');

    const hasName = rowCells.some(c => c.includes('désignation') || c.includes('designation') || c.includes('produit') || c.includes('article') || c.includes('nom') || c.includes('libelle') || c.includes('libellé') || c.includes('matiere') || c.includes('matière'));
    const hasQty = rowCells.some(c => c.includes('quantité') || c.includes('quantite') || c.includes('qte') || c.includes('qté') || c.includes('réel') || c.includes('reel') || c.includes('stock') || c.includes('compté') || c.includes('compte') || c.includes('somme') || c.includes('conso'));

    if (hasName && (hasQty || rowStr.includes('unité') || rowStr.includes('unite') || rowStr.includes('prix') || rowStr.includes('valeur'))) {
      headerIndex = i;
      rows[i].forEach((cell, colIdx) => {
        const c = String(cell || '').toLowerCase().trim();
        if (nameCol === -1 && (c.includes('désignation') || c.includes('designation') || c.includes('produit') || c.includes('article') || c.includes('nom') || c.includes('libelle') || c.includes('libellé') || c.includes('matiere') || c.includes('matière'))) {
          nameCol = colIdx;
        } else if (qtyCol === -1 && (c.includes('quantité') || c.includes('quantite') || c.includes('qte') || c.includes('qté') || c.includes('réel') || c.includes('reel') || c.includes('stock') || c.includes('compté') || c.includes('compte') || c.includes('somme') || c.includes('conso'))) {
          qtyCol = colIdx;
        } else if (unitCol === -1 && (c.includes('unité') || c.includes('unite') || c === 'u' || c === 'un')) {
          unitCol = colIdx;
        } else if (priceCol === -1 && (c.includes('p.u') || c.includes('pu') || c.includes('prix') || c.includes('cout') || c.includes('coût'))) {
          priceCol = colIdx;
        } else if (totalCol === -1 && (c.includes('total') || c.includes('valeur') || c.includes('montant'))) {
          totalCol = colIdx;
        }
      });
      break;
    }
  }

  // 2. Si aucun en-tête explicite trouvé, heuristique par structure de données
  if (headerIndex === -1) {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!Array.isArray(r) || r.length < 2) continue;
      const c0 = String(r[0] || '').trim();
      const c1 = String(r[1] || '').trim();
      const c2 = String(r[2] || '').trim();
      if (c0.length > 1 && !isNaN(parseFloat(c1.replace(',', '.')))) {
        headerIndex = i - 1;
        nameCol = 0; qtyCol = 1; unitCol = 2;
        break;
      } else if (c0.length > 1 && (c1.toLowerCase() === 'kg' || c1.toLowerCase() === 'g' || c1.toLowerCase() === 'l' || c1.toLowerCase() === 'pcs' || c1.toLowerCase() === 'paquet') && !isNaN(parseFloat(c2.replace(',', '.')))) {
        headerIndex = i - 1;
        nameCol = 0; unitCol = 1; qtyCol = 2;
        break;
      }
    }
  }

  if (nameCol === -1) nameCol = 0;
  if (qtyCol === -1) qtyCol = 1;
  if (unitCol === -1) unitCol = 2;

  const startRow = headerIndex >= 0 ? headerIndex + 1 : 0;

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row) || row.length === 0) continue;

    let rawName = String(row[nameCol] || '').trim();
    if (!rawName || rawName.length < 2) continue;
    const lowerName = rawName.toLowerCase();
    if (lowerName.includes('total') || lowerName.includes('synthèse') || lowerName.includes('synthese') || lowerName.includes('rapport') || lowerName.includes('grey corner') || lowerName.includes('détails') || lowerName.includes('details') || lowerName.includes('articles comptés')) continue;

    rawName = rawName.replace(/^\d+\s+/, '').trim();

    let rawQtyStr = String(row[qtyCol] !== undefined && row[qtyCol] !== null ? row[qtyCol] : '').trim();
    let qty = parseFloat(rawQtyStr.replace(',', '.'));

    let rawUnit = unitCol >= 0 && row[unitCol] !== undefined && row[unitCol] !== null ? String(row[unitCol]).trim().toLowerCase() : 'g';

    // Si qty n'est pas un nombre mais unitCol contient un nombre (colonnes inversées)
    if (isNaN(qty) && unitCol >= 0) {
      const altQty = parseFloat(String(row[unitCol]).replace(',', '.'));
      if (!isNaN(altQty)) {
        qty = altQty;
        rawUnit = String(row[qtyCol]).trim().toLowerCase();
      }
    }

    if (isNaN(qty)) continue;

    let price = priceCol >= 0 && row[priceCol] !== undefined ? parseFloat(String(row[priceCol]).replace(',', '.')) : 0;
    if (isNaN(price) || price === 0) {
      if (totalCol >= 0 && row[totalCol] !== undefined) {
        const valTotal = parseFloat(String(row[totalCol]).replace(',', '.'));
        if (qty > 0 && !isNaN(valTotal) && valTotal > 0) {
          price = valTotal / qty;
        }
      }
    }

    result.push({
      name: rawName,
      qty: qty,
      unit: rawUnit || 'g',
      price: !isNaN(price) ? price : 0
    });
  }

  return result;
}

function applyExtractedDataToAudit(extractedItems, targetType, isFirstFile = false) {
  if (auditMonthlyArticles.length === 0) {
    syncAuditWithMonthlySales();
  }

  extractedItems.forEach(ext => {
    // 1. Recherche par Smart Fuzzy Matching (Tolérance orthographe, synonymes, déclinaisons)
    const matchResult = findBestIngredientMatch(ext.name, auditMonthlyArticles);
    let target = matchResult ? matchResult.article : null;

    if (!target) {
      // Nouvel article non présent dans les fiches
      target = {
        name: ext.name,
        category: categorizeIngredient(ext.name),
        unit: ext.unit || 'g',
        sInit: 0,
        achats: 0,
        sFinal: 0,
        theorique: 0,
        casse: 0,
        prix: ext.price || 50
      };
      auditMonthlyArticles.push(target);
    }

    // 2. Conversion automatique des conditionnements groupés (Boîtes 24 Sodas, 12 Eaux/Oulmès, 8 Orangina, 88 Fromage, etc.)
    const packConv = convertBeveragePackaging(ext.name, ext.qty, ext.unit);
    let convertedQty = packConv.qty;
    const impUnit = (packConv.unit || '').toLowerCase().trim();
    const targetUnit = (target.unit || 'g').toLowerCase().trim();

    // 3. Conversion d'unité intelligente métrique (ex: kg -> g, L -> ml, cl -> ml)
    if (targetUnit === 'g') {
      if (impUnit === 'kg' || impUnit === 'kilo') convertedQty = convertedQty * 1000;
    } else if (targetUnit === 'kg') {
      if (impUnit === 'g' || impUnit === 'gr') convertedQty = convertedQty / 1000;
    } else if (targetUnit === 'ml') {
      if (impUnit === 'l' || impUnit === 'litre') convertedQty = convertedQty * 1000;
      else if (impUnit === 'cl') convertedQty = convertedQty * 10;
    } else if (targetUnit === 'l' || targetUnit === 'litre') {
      if (impUnit === 'ml') convertedQty = convertedQty / 1000;
      else if (impUnit === 'cl') convertedQty = convertedQty / 100;
    }

    // 4. Application ou cumul des quantités
    if (targetType === 'm1') {
      if (isFirstFile) target.sInit = convertedQty;
      else target.sInit = (target.sInit || 0) + convertedQty;
    } else if (targetType === 'achats') {
      if (isFirstFile) target.achats = convertedQty;
      else target.achats = (target.achats || 0) + convertedQty;
    } else if (targetType === 'm') {
      if (isFirstFile) target.sFinal = convertedQty;
      else target.sFinal = (target.sFinal || 0) + convertedQty;
    } else if (targetType === 'casse') {
      if (isFirstFile) target.casse = convertedQty;
      else target.casse = (target.casse || 0) + convertedQty;
    }
    if (ext.price && ext.price > 0) {
      if (packConv.multiplier > 1) target.prix = ext.price / packConv.multiplier;
      else target.prix = ext.price;
    }
  });

  recalculateMonthlyAudit();
}


/* ========================================================
   13.B MOTEUR DE RAPPROCHEMENT INTELLIGENT & SYNONYMES (SMART MATCHING)
======================================================== */
const INVENTORY_NOISE_WORDS = new Set([
  'kg', 'g', 'gr', 'gramme', 'grammes', 'kilo', 'kilos', 'l', 'litre', 'litres', 'cl', 'ml',
  'colis', 'carton', 'pack', 'btl', 'bouteille', 'bouteilles', 'boite', 'boites', 'bt', 'sachet', 'sachets',
  'sac', 'sacs', 'barquette', 'barquettes', 'piece', 'pieces', 'pcs', 'pce', 'tranche', 'tranches', 'portion', 'portions',
  'frais', 'fraiche', 'fraiches', 'congele', 'congeles', 'surgele', 'surgeles', 'cuit', 'cuits', 'cuite', 'cuites',
  'cru', 'crus', 'crue', 'crues', 'marine', 'marines', 'marinee', 'marinees', 'rape', 'rapes', 'rapee', 'rapees',
  'tranche', 'tranches', 'tranchee', 'tranchees', 'bloc', 'blocs', 'moulu', 'moulus', 'grain', 'grains',
  'entier', 'entiers', 'entiere', 'entieres', 'uht', 'pur', 'pure', 'bio', 'nature',
  'de', 'du', 'des', 'la', 'le', 'les', 'l', 'd', 'en', 'au', 'aux', 'a', 'pour', 'avec', 'sans',
  'qualite', 'sup', 'superieure', 'extra', 'select', 'import', 'local', 'maison'
]);

const INVENTORY_SYNONYMS = {
  'mozza': 'mozzarella',
  'mozzarela': 'mozzarella',
  'mozarila': 'mozzarella',
  'mozzarella râpée': 'mozzarella',
  'mozzarella bloc': 'mozzarella',
  'saumon': 'saumon',
  'salmon': 'saumon',
  'saumon fumé': 'saumon',
  'pave saumon': 'saumon',
  'poulet': 'poulet',
  'chicken': 'poulet',
  'blanc poulet': 'poulet',
  'blanc de poulet': 'poulet',
  'filet poulet': 'poulet',
  'filet de poulet': 'poulet',
  'escalope poulet': 'poulet',
  'emince poulet': 'poulet',
  'kefta': 'viande hachee',
  'steak hache': 'viande hachee',
  'hache boeuf': 'viande hachee',
  'hache': 'viande hachee',
  'crevette': 'crevettes',
  'crevettes': 'crevettes',
  'shrimp': 'crevettes',
  'gambas': 'crevettes',
  'oeuf': 'oeufs',
  'oeufs': 'oeufs',
  'egg': 'oeufs',
  'eggs': 'oeufs',
  'coulis tomate': 'sauce tomate',
  'base tomate': 'sauce tomate',
  'sauce pizza': 'sauce tomate',
  'creme fraiche': 'creme liquide',
  'creme cuisson': 'creme liquide',
  'creme 30': 'creme liquide',
  'creme 35': 'creme liquide',
  'pain bun': 'pain burger',
  'buns': 'pain burger',
  'bun': 'pain burger',
  'toast': 'pain de mie',
  'wrap': 'tortilla wrap',
  'tortilla': 'tortilla wrap',
  'galette wrap': 'tortilla wrap',
  'monin': 'sirop',
  'espresso': 'cafe',
  'cafe grains': 'cafe',
  'cafe moulu': 'cafe',
  'lait centrale': 'lait',
  'lait uht': 'lait',
  'avocat hass': 'avocat',
  'pate tartiner': 'nutella',
  'pate a tartiner': 'nutella',
  'crem chese': 'cream cheese',
  'crem plus': 'creme liquide',
  'aubirgine': 'aubergine',
  'buratta': 'burrata',
  'fromage buratta': 'burrata',
  'fette': 'feta',
  'fr fette': 'feta',
  'sucre semoule': 'sucre',
  'vanille poudre': 'vanille',
  'lorange': 'orange',
  'brocolis': 'brocoli',
  'spagheti': 'spaghetti',
  'olive vert': 'olives'
};

function normalizeSmartInventoryText(str) {
  if (!str) return '';
  let s = str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[0-9]+([.,][0-9]+)?\s*(kg|g|l|cl|ml|p|pcs|gr)?\b/gi, ' ')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const [k, v] of Object.entries(INVENTORY_SYNONYMS)) {
    const reg = new RegExp('\\b' + k + '\\b', 'g');
    s = s.replace(reg, v);
  }

  const tokens = s.split(' ')
    .map(w => w.replace(/s\b/, ''))
    .filter(w => w.length > 1 && !INVENTORY_NOISE_WORDS.has(w));

  return tokens.join(' ');
}

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function findBestIngredientMatch(importedName, candidateArticles) {
  const normImp = normalizeSmartInventoryText(importedName);
  if (!normImp || !candidateArticles || candidateArticles.length === 0) return null;

  let bestArticle = null;
  let bestScore = 0;

  const impTokens = new Set(normImp.split(' ').filter(x => x.length > 1));

  for (const article of candidateArticles) {
    const normArt = normalizeSmartInventoryText(article.name);
    if (!normArt) continue;

    let score = 0;

    if (normImp === normArt) {
      score = 1.0;
    } else if (normImp.includes(normArt) || normArt.includes(normImp)) {
      score = 0.95;
    } else {
      const artTokens = new Set(normArt.split(' ').filter(x => x.length > 1));
      let matchCount = 0;
      impTokens.forEach(t => {
        if (artTokens.has(t)) matchCount++;
        else {
          for (const at of artTokens) {
            if (levenshteinDistance(t, at) <= 1 && Math.min(t.length, at.length) >= 4) {
              matchCount += 0.85;
              break;
            }
          }
        }
      });

      const totalTokens = Math.max(impTokens.size, artTokens.size);
      if (totalTokens > 0) {
        score = Math.max(score, matchCount / totalTokens);
      }

      const dist = levenshteinDistance(normImp, normArt);
      const maxLen = Math.max(normImp.length, normArt.length);
      if (maxLen > 0) {
        const levScore = 1 - (dist / maxLen);
        if (levScore > score) score = levScore;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestArticle = article;
    }
  }

  if (bestScore >= 0.55) {
    return { article: bestArticle, score: bestScore };
  }
  return null;
}

/* ========================================================
   13.C CONVERSION AUTOMATIQUE DES CONDITIONNEMENTS (SODAS 24, EAUX/OULMÈS 12, ORANGINA 8, PACKS)
======================================================== */
function convertBeveragePackaging(rawName, qty, rawUnit) {
  if (!rawName || isNaN(qty)) return { qty: qty || 0, unit: rawUnit || 'piece', multiplier: 1 };
  
  const name = String(rawName).toLowerCase().trim();
  const unit = (rawUnit || '').toLowerCase().trim();

  // Détecter si l'unité est un conditionnement groupé
  const isPack = ['paquet', 'boite', 'boîte', 'carton', 'pack', 'colis', 'pq', 'bt'].includes(unit);

  // 1. Détection de multiplicateur explicite dans le libellé (ex: '88PC', '18 PC', '16 PC', '100PC', '12 PC', '8 PC')
  const explicitMatch = name.match(/(\d+)\s*(pc|pcs|u|canette|canettes|bouteille|bouteilles)/i);
  if (explicitMatch) {
    const multiplier = parseInt(explicitMatch[1], 10);
    if (multiplier > 1 && (isPack || unit === 'boite' || unit === 'paquet' || unit === 'carton' || unit === 'pq')) {
      return { qty: qty * multiplier, unit: 'piece', multiplier, reason: 'explicit ' + multiplier + 'pc' };
    }
  }

  // 2. Orangina (Boîte de 8 canettes/bouteilles)
  if (name.includes('orangina') && (isPack || unit === 'paquet' || unit === 'boite')) {
    return { qty: qty * 8, unit: 'piece', multiplier: 8, reason: 'Orangina pack 8' };
  }

  // 3. Eaux Minérales & Oulmès (Boîte de 12 pour Sidi Ali 33cl, 50cl, 75cl, Oulmès 25cl, 75cl, Mojito, Tropical)
  if ((name.includes('sidi ali') || name.includes('oulmes') || name.includes('oulmès') || name.includes('mojito') || name.includes('tropical') || name.includes('eau min') || name.includes('eau gazeuse')) && (isPack || unit === 'paquet' || unit === 'boite')) {
    return { qty: qty * 12, unit: 'piece', multiplier: 12, reason: 'Eau/Oulmès pack 12' };
  }

  // 4. Sodas (Boîte de 24 canettes pour Coca, Coca Zéro, Sprite, Fanta, Hawai, Poms, Schweppes, Redbull)
  const isSoda = name.includes('coca') || name.includes('fanta') || name.includes('sprite') || name.includes('hawai') || name.includes('poms') || name.includes('schwep') || name.includes('redbull') || name.includes('soda');
  if (isSoda && (isPack || unit === 'paquet' || unit === 'boite')) {
    return { qty: qty * 24, unit: 'piece', multiplier: 24, reason: 'Soda pack 24' };
  }

  return { qty: qty, unit: unit || 'piece', multiplier: 1, reason: 'standard' };
}

// 13.3 SYNCHRONISATION MULTI-ARTICLES AVEC LES VENTES DU MOIS
function syncAuditWithMonthlySales() {
  const existingMap = new Map(auditMonthlyArticles.map(a => [cleanText(a.name), a]));
  const list = [];

  // 1. Extraire les ingrédients consommés calculés
  aggregatedIngredients.forEach(ing => {
    const key = cleanText(ing.name);
    const prev = existingMap.get(key) || {};
    list.push({
      name: ing.name,
      category: ing.category || categorizeIngredient(ing.name),
      unit: ing.unit || 'g',
      sInit: prev.sInit || 0,
      achats: prev.achats || 0,
      sFinal: prev.sFinal || 0,
      theorique: ing.totalQty || 0,
      casse: prev.casse || 0,
      prix: prev.prix || getDefaultPriceForCategory(ing.category || categorizeIngredient(ing.name))
    });
  });

  // 2. Ajouter les articles uniques déjà présents
  existingMap.forEach((val, key) => {
    if (!list.some(x => cleanText(x.name) === key)) {
      list.push(val);
    }
  });

  auditMonthlyArticles = list;
  recalculateMonthlyAudit();
}

function getDefaultPriceForCategory(cat) {
  if (cat === 'viandes') return 85;
  if (cat === 'poissons') return 110;
  if (cat === 'fromages') return 65;
  if (cat === 'boissons') return 15;
  if (cat === 'legumes') return 12;
  return 18;
}

function addNewAuditArticlePrompt() {
  const name = prompt('Nom de la nouvelle matière première :');
  if (!name || !name.trim()) return;

  const unit = prompt('Unité de mesure (g, ml, p) :', 'g') || 'g';
  const cat = categorizeIngredient(name);
  const prix = parseFloat(prompt('Prix unitaire moyen estimé (DH) :', '50')) || 50;

  auditMonthlyArticles.unshift({
    name: name.trim(),
    category: cat,
    unit: unit,
    sInit: 0,
    achats: 0,
    sFinal: 0,
    theorique: 0,
    casse: 0,
    prix: prix
  });

  recalculateMonthlyAudit();
}

function resetMonthlyAuditData() {
  if (confirm("Voulez-vous vraiment réinitialiser toutes les données de l'audit de stock ?")) {
    auditMonthlyArticles = [];
    document.querySelectorAll('.dropzone-card').forEach(c => c.classList.remove('loaded'));
    document.querySelectorAll('.dropzone-status').forEach(s => s.style.display = 'none');
    syncAuditWithMonthlySales();
  }
}


function isHighImpactIngredient(item) {
  if (!item) return false;
  const cat = item.category || categorizeIngredient(item.name);
  
  // 1. Viandes, Poissons, Fromages (Pivots Coût Matière)
  if (cat === 'viandes' || cat === 'poissons' || cat === 'fromages') return true;
  
  // 2. Café & Boissons Majeures
  const n = cleanText(item.name);
  if (n.includes('cafe') || n.includes('café') || n.includes('espresso') || n.includes('cacao') || n.includes('the sbaa') || n.includes('lipton')) return true;
  
  // 3. Ingrédients nobles / coûteux
  if (n.includes('avocat') || n.includes('nutella') || n.includes('creme') || n.includes('beurre') || n.includes('pistache') || n.includes('amande') || n.includes('noix') || n.includes('huile olive') || n.includes('khlii') || n.includes('amlou') || n.includes('saumon')) return true;
  
  if (item.prix >= 40) return true;
  return false;
}

function setAuditCatFilter(cat, btn) {
  currentAuditCatFilter = cat;
  document.querySelectorAll('[data-audit-cat]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMonthlyAuditTable();
}

function setAuditStatusFilter(status, btn) {
  currentAuditStatusFilter = status;
  document.querySelectorAll('[data-audit-status]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMonthlyAuditTable();
}

function onAuditFieldChange(idx, field, value) {
  if (!auditMonthlyArticles[idx]) return;
  auditMonthlyArticles[idx][field] = parseFloat(value) || 0;
  recalculateMonthlyAudit();
}

function removeAuditArticle(idx) {
  if (confirm("Supprimer cet article de l'audit ?")) {
    auditMonthlyArticles.splice(idx, 1);
    recalculateMonthlyAudit();
  }
}

function recalculateMonthlyAudit() {
  let totTheoDH = 0;
  let totReelDH = 0;
  let totEcartDH = 0;
  let totCasseDH = 0;
  let alertCount = 0;

  auditMonthlyArticles.forEach(item => {
    const consReelle = (item.sInit + item.achats) - item.sFinal;
    const consAttendue = item.theorique + item.casse;
    const ecart = consReelle - consAttendue;
    const ecartPct = consAttendue > 0 ? (ecart / consAttendue) * 100 : (ecart !== 0 ? Infinity : 0);
    const impactDH = ecart * item.prix;

    item.consReelle = consReelle;
    item.consAttendue = consAttendue;
    item.ecart = ecart;
    item.ecartPct = ecartPct;
    item.impactDH = impactDH;

    totTheoDH += item.theorique * item.prix;
    totReelDH += consReelle * item.prix;
    totEcartDH += impactDH;
    totCasseDH += item.casse * item.prix;

    if (ecartPct > 8) alertCount++;
  });

  const totEcartPct = totTheoDH > 0 ? (totEcartDH / totTheoDH) * 100 : 0;

  document.getElementById('audit-kpi-tot-theo').textContent = totTheoDH.toFixed(2) + ' DH';
  document.getElementById('audit-kpi-tot-reel').textContent = totReelDH.toFixed(2) + ' DH';
  
  const sign = totEcartDH > 0 ? '+' : '';
  const ecartEl = document.getElementById('audit-kpi-tot-ecart');
  ecartEl.textContent = sign + totEcartDH.toFixed(2) + ' DH';
  ecartEl.className = 'audit-kpi-val ' + (totEcartDH > 0 ? 'danger' : 'ok');
  document.getElementById('audit-kpi-tot-ecart-pct').textContent = sign + totEcartPct.toFixed(1) + '% vs Théorique';
  
  document.getElementById('audit-kpi-tot-casse').textContent = totCasseDH.toFixed(2) + ' DH';
  document.getElementById('audit-kpi-tot-items').textContent = auditMonthlyArticles.length;
  document.getElementById('audit-kpi-tot-alerts').textContent = alertCount + ' alerte(s) critique(s)';
  const countAuditEl = document.getElementById('count-audit');
  if (countAuditEl) countAuditEl.textContent = auditMonthlyArticles.length;

  window.auditMonthlyArticles = auditMonthlyArticles;
  renderMonthlyAuditTable();
}

function renderMonthlyAuditTable() {
  const tbody = document.getElementById('tbody-audit-multi');
  if (!tbody) return;

  const q = cleanText(document.getElementById('search-audit-multi') ? document.getElementById('search-audit-multi').value : '');

  // Mettre à jour les compteurs de catégorie
  let countAll = 0, countStrategic = 0, countViandes = 0, countPoissons = 0, countFromages = 0, countBoissons = 0, countLegumes = 0, countEpicerie = 0;
  auditMonthlyArticles.forEach(item => {
    countAll++;
    if (isHighImpactIngredient(item)) countStrategic++;
    const c = item.category || categorizeIngredient(item.name);
    if (c === 'viandes') countViandes++;
    else if (c === 'poissons') countPoissons++;
    else if (c === 'fromages') countFromages++;
    else if (c === 'boissons') countBoissons++;
    else if (c === 'legumes') countLegumes++;
    else countEpicerie++;
  });

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('audit-count-all', countAll);
  setEl('audit-count-strategic', countStrategic);
  setEl('audit-count-viandes', countViandes);
  setEl('audit-count-poissons', countPoissons);
  setEl('audit-count-fromages', countFromages);
  setEl('audit-count-boissons', countBoissons);
  setEl('audit-count-legumes', countLegumes);
  setEl('audit-count-epicerie', countEpicerie);

  // Filtrage
  const filtered = auditMonthlyArticles.filter(item => {
    if (q && !cleanText(item.name).includes(q)) return false;
    if (currentAuditCatFilter === 'strategic' && !isHighImpactIngredient(item)) return false;
    else if (currentAuditCatFilter !== 'all' && currentAuditCatFilter !== 'strategic' && item.category !== currentAuditCatFilter) return false;
    
    if (currentAuditStatusFilter === 'danger' && item.ecartPct <= 8) return false;
    if (currentAuditStatusFilter === 'ok' && (Math.abs(item.ecartPct) > 3 || item.ecartPct > 8)) return false;
    if (currentAuditStatusFilter === 'under' && item.ecartPct >= -3) return false;
    return true;
  });

  // Calcul des KPIs sur la sélection active
  let fTotTheo = 0, fTotReel = 0, fTotEcart = 0, fTotCasse = 0, fAlertCount = 0;
  filtered.forEach(item => {
    fTotTheo += item.theorique * item.prix;
    fTotReel += (item.consReelle || 0) * item.prix;
    fTotEcart += (item.impactDH || 0);
    fTotCasse += (item.casse || 0) * item.prix;
    if ((item.ecartPct || 0) > 8) fAlertCount++;
  });

  const fSign = fTotEcart > 0 ? '+' : '';
  const fTotEcartPct = fTotTheo > 0 ? (fTotEcart / fTotTheo) * 100 : 0;

  setEl('audit-kpi-tot-theo', fTotTheo.toFixed(2) + ' DH');
  setEl('audit-kpi-tot-reel', fTotReel.toFixed(2) + ' DH');
  const ecartEl = document.getElementById('audit-kpi-tot-ecart');
  if (ecartEl) {
    ecartEl.textContent = fSign + fTotEcart.toFixed(2) + ' DH';
    ecartEl.className = 'audit-kpi-val ' + (fTotEcart > 0 ? 'danger' : 'ok');
  }
  setEl('audit-kpi-tot-ecart-pct', fSign + fTotEcartPct.toFixed(1) + '% vs Théorique');
  setEl('audit-kpi-tot-casse', fTotCasse.toFixed(2) + ' DH');
  setEl('audit-kpi-tot-items', filtered.length);
  setEl('audit-kpi-tot-alerts', fAlertCount + ' alerte(s) critique(s)');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="14" style="text-align:center; padding:30px; color:var(--muted);">Aucune matière première ne correspond aux filtres.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const idx = auditMonthlyArticles.indexOf(item);
    const sign = item.ecart > 0 ? '+' : '';
    let badgeHtml = '';
    if (Math.abs(item.ecartPct) <= 3) {
      badgeHtml = '<span class="status-badge ok">✅ CONFORME</span>';
    } else if (item.ecartPct > 3 && item.ecartPct <= 8) {
      badgeHtml = '<span class="status-badge warn">⚠️ SURDOSAGE</span>';
    } else if (item.ecartPct > 8) {
      badgeHtml = '<span class="status-badge danger">🚨 CRITIQUE</span>';
    } else {
      badgeHtml = '<span class="status-badge under">📉 SOUS-DOSAGE</span>';
    }

    const isStrategic = isHighImpactIngredient(item);
    const starIcon = isStrategic ? '<span title="Produit Stratégique à Fort Impact (80/20)" style="color:#d97706; margin-right:4px;">⭐</span>' : '';

    return `<tr>
      <td style="font-weight:800; min-width:180px;">
        ${starIcon}${item.name}
      </td>
      <td style="text-align:center;"><span class="cat-chip ${item.category}">${item.category.toUpperCase()}</span></td>
      <td style="text-align:center;"><span class="unit-chip">${item.unit}</span></td>
      <td><input type="number" step="0.01" value="${(item.sInit || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'sInit', this.value)" class="audit-input" /></td>
      <td><input type="number" step="0.01" value="${(item.achats || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'achats', this.value)" class="audit-input" /></td>
      <td><input type="number" step="0.01" value="${(item.sFinal || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'sFinal', this.value)" class="audit-input" /></td>
      <td style="font-weight:800; color:var(--text); text-align:right;">${(item.consReelle || 0).toFixed(2)}</td>
      <td style="font-weight:700; color:var(--muted); text-align:right;">${(item.theorique || 0).toFixed(2)}</td>
      <td><input type="number" step="0.01" value="${(item.casse || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'casse', this.value)" class="audit-input" /></td>
      <td style="font-weight:900; text-align:right; color:${item.ecart > 0 ? 'var(--danger)' : 'var(--success)'};">${sign}${(item.ecart || 0).toFixed(2)}</td>
      <td style="text-align:center;">${badgeHtml}</td>
      <td><input type="number" step="0.01" value="${(item.prix || 0).toFixed(2)}" onchange="onAuditFieldChange(${idx}, 'prix', this.value)" class="audit-input price" /></td>
      <td style="font-weight:900; text-align:right; color:${item.impactDH > 0 ? 'var(--danger)' : 'var(--success)'};">${sign}${(item.impactDH || 0).toFixed(2)} DH</td>
      <td style="text-align:center;"><button class="btn-del-row" onclick="removeAuditArticle(${idx})" title="Supprimer">✕</button></td>
    </tr>`;
  }).join('');
}

function exportMonthlyAuditToExcel() {
  if (auditMonthlyArticles.length === 0) {
    alert("Aucune donnée d'audit à exporter.");
    return;
  }

  const exportData = auditMonthlyArticles.map(item => ({
    'Matière Première': item.name,
    'Catégorie': item.category,
    'Unité': item.unit,
    'Stock Initial M-1': item.sInit,
    'Achats Mois M': item.achats,
    'Stock Final M': item.sFinal,
    'Consommation Réelle': item.consReelle,
    'Théorie Ventes': item.theorique,
    'Casse Déclarée': item.casse,
    'Écart Matière (Qté)': item.ecart,
    'Écart Relatif (%)': item.ecartPct.toFixed(1) + '%',
    'Prix Unitaire (DH)': item.prix,
    'Écart Financier (DH)': item.impactDH,
    'Statut': item.ecartPct > 8 ? 'CRITIQUE' : (item.ecartPct > 3 ? 'SURDOSAGE' : (item.ecartPct < -3 ? 'SOUS-DOSÉ' : 'CONFORME'))
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.book_append_sheet(wb, ws, 'Audit_Stock_Fin_Mois');
  XLSX.writeFile(wb, `GreyCorner_Audit_Stock_${selectedYearMonth || 'Cloture'}.xlsx`);
}


// Expositions globales pour les gestionnaires onclick / onchange HTML
window.switchAuditSubTab = switchAuditSubTab;
window.initAuditFlashDropdown = initAuditFlashDropdown;
window.onFlashIngredientChange = onFlashIngredientChange;
window.calculateAuditFlash = calculateAuditFlash;
window.handleAuditFileUpload = handleAuditFileUpload;
window.extractDataFromPDF = extractDataFromPDF;
window.parseTextLinesToAudit = parseTextLinesToAudit;
window.parseExcelRowsToAuditData = parseExcelRowsToAuditData;
window.findBestIngredientMatch = findBestIngredientMatch;
window.convertBeveragePackaging = convertBeveragePackaging;
window.applyExtractedDataToAudit = applyExtractedDataToAudit;
window.syncAuditWithMonthlySales = syncAuditWithMonthlySales;
window.getDefaultPriceForCategory = getDefaultPriceForCategory;
window.addNewAuditArticlePrompt = addNewAuditArticlePrompt;
window.resetMonthlyAuditData = resetMonthlyAuditData;
window.setAuditCatFilter = setAuditCatFilter;
window.setAuditStatusFilter = setAuditStatusFilter;
window.onAuditFieldChange = onAuditFieldChange;
window.removeAuditArticle = removeAuditArticle;
window.recalculateMonthlyAudit = recalculateMonthlyAudit;
window.renderMonthlyAuditTable = renderMonthlyAuditTable;
window.exportMonthlyAuditToExcel = exportMonthlyAuditToExcel;


/* ========================================================
   11. MATRICE DE MENU ENGINEERING (KASAVANA & SMITH)
======================================================== */
let menuEngQuadrantFilter = 'all'; // 'all', 'star', 'plowhorse', 'puzzle', 'dog'
let menuEngFamilyFilter = 'all';
let menuEngSortMetric = 'profit'; // 'profit', 'margin', 'qty', 'ca', 'foodcost'
let menuEngData = [];

function setMenuEngQuadrantFilter(quad) {
  menuEngQuadrantFilter = quad;
  
  // Mettre à jour les boutons de filtre
  const btnAll = document.getElementById('btn-me-filter-all');
  const btnStar = document.getElementById('btn-me-filter-star');
  const btnPlowhorse = document.getElementById('btn-me-filter-plowhorse');
  const btnPuzzle = document.getElementById('btn-me-filter-puzzle');
  const btnDog = document.getElementById('btn-me-filter-dog');
  
  if (btnAll) btnAll.classList.toggle('active', quad === 'all');
  if (btnStar) btnStar.classList.toggle('active', quad === 'star');
  if (btnPlowhorse) btnPlowhorse.classList.toggle('active', quad === 'plowhorse');
  if (btnPuzzle) btnPuzzle.classList.toggle('active', quad === 'puzzle');
  if (btnDog) btnDog.classList.toggle('active', quad === 'dog');

  // Mettre en surbrillance la carte de quadrant correspondante
  document.querySelectorAll('.quad-card').forEach(c => c.classList.remove('active-filter'));
  if (quad !== 'all') {
    const activeCard = document.querySelector('.quad-' + quad);
    if (activeCard) activeCard.classList.add('active-filter');
  }

  renderMenuEngineeringTable();
  renderMenuEngineeringScatterPlot();
}

function onMenuEngFamilyFilterChange(val) {
  menuEngFamilyFilter = val;
  renderMenuEngineeringTable();
  renderMenuEngineeringScatterPlot();
}

function onMenuEngSortChange(val) {
  menuEngSortMetric = val;
  renderMenuEngineeringTable();
  renderMenuEngineeringScatterPlot();
}

function populateMenuEngFamilyDropdown(families) {
  const select = document.getElementById('filter-me-family');
  if (!select) return;
  const current = select.value || 'all';
  select.innerHTML = '<option value="all">📁 Toutes les Familles</option>';
  (families || []).forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    if (f === current) opt.selected = true;
    select.appendChild(opt);
  });
}

function renderMenuEngineeringMatrix() {
  const tbody = document.getElementById('tbody-menu-engineering');
  const countTabBadge = document.getElementById('count-menu-eng');
  if (!tbody) return;

  if (!currentSalesData || currentSalesData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--muted);">Aucune donnée de vente pour générer la matrice.</td></tr>';
    if (countTabBadge) countTabBadge.textContent = '0';
    return;
  }

  // 1. Calculer les métriques individuelles pour chaque article vendu
  let totalVolume = 0;
  let totalGrossProfit = 0;
  let totalRevenue = 0;
  const distinctFamilies = new Set();
  const classifiedItems = [];

  currentSalesData.forEach(sale => {
    const qty = sale.qty || 0;
    if (qty <= 0) return;

    const family = sale.family || 'DIVERS';
    const famClean = cleanText(family);
    const prodClean = cleanText(sale.product || '');

    // Exclusion explicite des catégories "A LA CARTE", "PERSONNEL" et consommations internes
    if (
      famClean === 'a la carte' ||
      famClean === 'a la carte boulangerie' ||
      famClean.includes('a la carte') ||
      famClean === 'personnel' ||
      famClean.includes('personnel') ||
      prodClean.includes('personnel')
    ) {
      return;
    }

    let recipe = sale.matchedRecipe;
    if (!recipe && typeof findRecipeForProduct === 'function') {
      recipe = findRecipeForProduct(sale.product, sale.family);
    }

    const recCatClean = recipe && recipe.category ? cleanText(recipe.category) : '';
    if (
      recCatClean === 'a la carte' ||
      recCatClean === 'a la carte boulangerie' ||
      recCatClean.includes('a la carte') ||
      recCatClean === 'personnel' ||
      recCatClean.includes('personnel')
    ) {
      return;
    }

    distinctFamilies.add(family);

    const totalCA = sale.total || 0;
    const price = sale.price > 0 ? sale.price : (qty > 0 ? (totalCA / qty) : 0);

    let cost = 0;

    if (recipe && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
      const fc = typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost(recipe.ingredients, price) : { cost: 0 };
      cost = fc.cost || 0;
    } else {
      // Estimation standard food cost 28% si non relié
      cost = Math.round(price * 0.28 * 100) / 100;
    }

    const gmDH = Math.max(0, Math.round((price - cost) * 100) / 100);
    const totalItemProfit = Math.round((qty * gmDH) * 100) / 100;
    const fcPct = price > 0 ? Math.round((cost / price) * 1000) / 10 : 0;

    totalVolume += qty;
    totalGrossProfit += totalItemProfit;
    totalRevenue += totalCA;

    classifiedItems.push({
      product: sale.product,
      family: family,
      recipeName: recipe ? recipe.name : '',
      hasRecipe: !!recipe,
      price: price,
      cost: cost,
      foodCostPct: fcPct,
      grossMarginDH: gmDH,
      qty: qty,
      totalCA: totalCA,
      totalProfitDH: totalItemProfit
    });
  });

  const N = classifiedItems.length;
  if (countTabBadge) countTabBadge.textContent = String(N);

  // 2. Calcul des seuils Kasavana & Smith
  // Seuil de profitabilité = Marge brute unitaire moyenne pondérée
  const avgGrossMargin = totalVolume > 0 ? (totalGrossProfit / totalVolume) : 0;
  // Seuil de popularité = 70% de la moyenne des ventes par article
  const popThreshold = N > 0 ? (totalVolume / N) * 0.70 : 0;

  // 3. Catégorisation des articles
  let countStars = 0, caStars = 0, profitStars = 0;
  let countPlowhorses = 0, caPlowhorses = 0, profitPlowhorses = 0;
  let countPuzzles = 0, caPuzzles = 0, profitPuzzles = 0;
  let countDogs = 0, caDogs = 0, profitDogs = 0;
  let plowhorseVolume = 0;

  classifiedItems.forEach(item => {
    const isHighPop = item.qty >= popThreshold;
    const isHighProfit = item.grossMarginDH >= avgGrossMargin;

    if (isHighPop && isHighProfit) {
      item.quadrant = 'star';
      item.quadrantLabel = '⭐ Étoile';
      item.actionAdvice = '🏆 Pilier clé : Maintenir la qualité et le grammage stricts. Positionner au centre de la carte.';
      countStars++;
      caStars += item.totalCA;
      profitStars += item.totalProfitDH;
    } else if (isHighPop && !isHighProfit) {
      item.quadrant = 'plowhorse';
      item.quadrantLabel = '🐎 Cheval de trait';
      item.actionAdvice = '⚠️ Optimiser la marge : Tester une hausse de +1 à +3 DH ou optimiser le coût portion (potentiel élevé).';
      countPlowhorses++;
      caPlowhorses += item.totalCA;
      profitPlowhorses += item.totalProfitDH;
      plowhorseVolume += item.qty;
    } else if (!isHighPop && isHighProfit) {
      item.quadrant = 'puzzle';
      item.quadrantLabel = '🧩 Dilemme';
      item.actionAdvice = '🎯 Booster la popularité : Inciter les serveurs à le recommander, ajouter une photo ou proposer en formule.';
      countPuzzles++;
      caPuzzles += item.totalCA;
      profitPuzzles += item.totalProfitDH;
    } else {
      item.quadrant = 'dog';
      item.quadrantLabel = '🐕 Poids mort';
      item.actionAdvice = '🛑 Faible rentabilité : Retravailler la recette, augmenter le prix ou envisager le retrait de la carte.';
      countDogs++;
      caDogs += item.totalCA;
      profitDogs += item.totalProfitDH;
    }
  });

  menuEngData = classifiedItems;

  // 4. Mettre à jour les KPIs d'en-tête
  const kpiMargin = document.getElementById('me-kpi-avg-margin');
  const kpiPop = document.getElementById('me-kpi-pop-thresh');
  const kpiProfit = document.getElementById('me-kpi-total-profit');
  
  if (kpiMargin) kpiMargin.textContent = avgGrossMargin.toFixed(2) + ' DH';
  if (kpiPop) kpiPop.textContent = Math.round(popThreshold) + ' unités';
  if (kpiProfit) kpiProfit.textContent = totalGrossProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH';

  // 5. Mettre à jour les compteurs des 4 quadrants
  const elStars = document.getElementById('badge-count-stars');
  const elPlowhorses = document.getElementById('badge-count-plowhorses');
  const elPuzzles = document.getElementById('badge-count-puzzles');
  const elDogs = document.getElementById('badge-count-dogs');

  if (elStars) elStars.textContent = String(countStars);
  if (elPlowhorses) elPlowhorses.textContent = String(countPlowhorses);
  if (elPuzzles) elPuzzles.textContent = String(countPuzzles);
  if (elDogs) elDogs.textContent = String(countDogs);

  // Parts du CA
  const pctStars = totalRevenue > 0 ? ((caStars / totalRevenue) * 100).toFixed(1) : 0;
  const pctPlowhorses = totalRevenue > 0 ? ((caPlowhorses / totalRevenue) * 100).toFixed(1) : 0;
  const pctPuzzles = totalRevenue > 0 ? ((caPuzzles / totalRevenue) * 100).toFixed(1) : 0;
  const pctDogs = totalRevenue > 0 ? ((caDogs / totalRevenue) * 100).toFixed(1) : 0;

  const elPctStars = document.getElementById('pct-ca-stars');
  const elPctPlowhorses = document.getElementById('pct-ca-plowhorses');
  const elPctPuzzles = document.getElementById('pct-ca-puzzles');
  const elPctDogs = document.getElementById('pct-ca-dogs');

  if (elPctStars) elPctStars.textContent = `${pctStars}% (${Math.round(caStars).toLocaleString('fr-FR')} DH)`;
  if (elPctPlowhorses) elPctPlowhorses.textContent = `${pctPlowhorses}% (${Math.round(caPlowhorses).toLocaleString('fr-FR')} DH)`;
  if (elPctPuzzles) elPctPuzzles.textContent = `${pctPuzzles}% (${Math.round(caPuzzles).toLocaleString('fr-FR')} DH)`;
  if (elPctDogs) elPctDogs.textContent = `${pctDogs}% (${Math.round(caDogs).toLocaleString('fr-FR')} DH)`;

  // Mettre à jour les boutons de filtre
  const bAll = document.getElementById('me-btn-count-all');
  const bStar = document.getElementById('me-btn-count-star');
  const bPlow = document.getElementById('me-btn-count-plowhorse');
  const bPuz = document.getElementById('me-btn-count-puzzle');
  const bDog = document.getElementById('me-btn-count-dog');

  if (bAll) bAll.textContent = String(N);
  if (bStar) bStar.textContent = String(countStars);
  if (bPlow) bPlow.textContent = String(countPlowhorses);
  if (bPuz) bPuz.textContent = String(countPuzzles);
  if (bDog) bDog.textContent = String(countDogs);

  // 6. Bannière d'opportunité d'optimisation
  const banner = document.getElementById('me-opportunity-banner');
  if (banner) {
    const extraGain2DH = plowhorseVolume * 2;
    if (countPlowhorses > 0 && extraGain2DH > 0) {
      banner.innerHTML = `
        <span style="font-size:22px;">💡</span>
        <div>
          <strong>Opportunité de Gain Majeur :</strong> En augmentant le prix des <strong>${countPlowhorses} Chevaux de trait</strong> de seulement <strong>+2,00 DH</strong>, vous dégageriez <strong>+${extraGain2DH.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</strong> de bénéfice brut supplémentaire sur cette période, sans impacter la fidélité client !
        </div>
      `;
      banner.style.display = 'flex';
    } else {
      banner.innerHTML = `
        <span style="font-size:22px;">✅</span>
        <div>
          <strong>Structure Tarifaire Équilibrée :</strong> La majorité de votre chiffre d'affaires est portée par vos articles Étoiles et rentables.
        </div>
      `;
      banner.style.display = 'flex';
    }
  }

  // 7. Remplir le menu déroulant des familles
  populateMenuEngFamilyDropdown(Array.from(distinctFamilies).sort());

  // 8. Rendu du tableau
  renderMenuEngineeringTable();
  renderMenuEngineeringScatterPlot();
}

function renderMenuEngineeringTable() {
  const tbody = document.getElementById('tbody-menu-engineering');
  const searchInput = document.getElementById('search-menu-eng');
  if (!tbody) return;

  const search = cleanText(searchInput ? searchInput.value : '');

  let list = menuEngData.filter(item => {
    if (menuEngQuadrantFilter !== 'all' && item.quadrant !== menuEngQuadrantFilter) return false;
    if (menuEngFamilyFilter !== 'all' && item.family !== menuEngFamilyFilter) return false;
    if (search) {
      const pClean = cleanText(item.product);
      const fClean = cleanText(item.family);
      if (!pClean.includes(search) && !fClean.includes(search)) return false;
    }
    return true;
  });

  // Tri
  list.sort((a, b) => {
    if (menuEngSortMetric === 'profit') return b.totalProfitDH - a.totalProfitDH;
    if (menuEngSortMetric === 'margin') return b.grossMarginDH - a.grossMarginDH;
    if (menuEngSortMetric === 'qty') return b.qty - a.qty;
    if (menuEngSortMetric === 'ca') return b.totalCA - a.totalCA;
    if (menuEngSortMetric === 'foodcost') return a.foodCostPct - b.foodCostPct;
    return b.totalProfitDH - a.totalProfitDH;
  });

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--muted);">Aucun article ne correspond aux critères de filtre sélectionnés.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(item => {
    let badgeClass = 'badge-me ' + item.quadrant;
    let fcColor = item.foodCostPct <= 28 ? '#10b981' : (item.foodCostPct <= 35 ? '#f59e0b' : '#ef4444');

    return `
      <tr style="border-bottom:1px solid var(--border); transition:background 0.15s ease;">
        <td style="padding:10px;">
          <strong style="color:var(--text); font-size:13.5px;">${escapeHtml(item.product)}</strong>
          <span style="display:block; font-size:11px; color:var(--muted);">${escapeHtml(item.family)}</span>
        </td>
        <td style="padding:10px; text-align:right; font-weight:800; color:var(--text); font-variant-numeric:tabular-nums;">
          ${item.price.toFixed(2)} DH
        </td>
        <td style="padding:10px; text-align:right; font-variant-numeric:tabular-nums;">
          <span style="font-weight:700; color:var(--text); font-size:12.5px;">${item.cost.toFixed(2)} DH</span>
          <div class="fc-gauge-wrap">
            <span style="font-weight:800; font-size:11px; color:${fcColor};">${item.foodCostPct}%</span>
            <div class="fc-gauge-bar">
              <div class="fc-gauge-fill ${item.foodCostPct <= 28 ? 'ok' : (item.foodCostPct <= 35 ? 'warn' : 'danger')}" style="width:${Math.min(100, Math.max(8, item.foodCostPct * 2))}%;"></div>
            </div>
          </div>
        </td>
        <td style="padding:10px; text-align:right; font-weight:900; color:var(--accent); font-variant-numeric:tabular-nums; font-size:13.5px;">
          ${item.grossMarginDH.toFixed(2)} DH
        </td>
        <td style="padding:10px; text-align:center; font-weight:800; color:var(--text);">
          ${item.qty.toLocaleString('fr-FR')}
        </td>
        <td style="padding:10px; text-align:right; font-weight:900; color:#10b981; font-variant-numeric:tabular-nums; font-size:13.5px;">
          ${item.totalProfitDH.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
        </td>
        <td style="padding:10px; text-align:center;">
          <span class="${badgeClass}">${item.quadrantLabel}</span>
        </td>
        <td style="padding:10px; font-size:12px; line-height:1.4; color:var(--text);">
          ${item.actionAdvice}
        </td>
      </tr>
    `;
  }).join('');
}


/* ========================================================
   11.B DIAGRAMME 2D SCATTER PLOT (CANVAS MENU ENGINEERING)
======================================================== */
let scatterPlotPoints = [];
let hoveredScatterPoint = null;
let scatterCanvasBound = false;

function renderMenuEngineeringScatterPlot() {
  const canvas = document.getElementById('canvas-menu-eng-scatter');
  const container = document.getElementById('scatter-plot-wrapper');
  const tooltip = document.getElementById('scatter-tooltip');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  const rect = container.getBoundingClientRect();
  const width = rect.width || 800;
  const height = 420;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const axisColor = isDark ? '#475569' : '#cbd5e1';

  if (!menuEngData || menuEngData.length === 0) {
    ctx.fillStyle = textColor;
    ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Aucune donnée pour tracer la cartographie.', width / 2, height / 2);
    return;
  }

  const padding = { top: 30, right: 35, bottom: 45, left: 65 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Calcul des Max
  const maxQty = Math.max(10, Math.max(...menuEngData.map(i => i.qty))) * 1.12;
  const maxGM = Math.max(10, Math.max(...menuEngData.map(i => i.grossMarginDH))) * 1.15;
  const maxCA = Math.max(1, Math.max(...menuEngData.map(i => i.totalCA)));

  // Calcul des Seuils
  const totalVolume = menuEngData.reduce((acc, i) => acc + i.qty, 0);
  const totalProfit = menuEngData.reduce((acc, i) => acc + i.totalProfitDH, 0);
  const avgGrossMargin = totalVolume > 0 ? (totalProfit / totalVolume) : 0;
  const popThreshold = menuEngData.length > 0 ? (totalVolume / menuEngData.length) * 0.70 : 0;

  const thresholdX = padding.left + (popThreshold / maxQty) * plotW;
  const thresholdY = padding.top + plotH - (avgGrossMargin / maxGM) * plotH;

  // 1. Fond des 4 Quadrants
  // Top-Right: Star
  ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.06)';
  ctx.fillRect(thresholdX, padding.top, width - padding.right - thresholdX, thresholdY - padding.top);

  // Bottom-Right: Plowhorse
  ctx.fillStyle = isDark ? 'rgba(2, 132, 199, 0.08)' : 'rgba(2, 132, 199, 0.06)';
  ctx.fillRect(thresholdX, thresholdY, width - padding.right - thresholdX, height - padding.bottom - thresholdY);

  // Top-Left: Puzzle
  ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.06)';
  ctx.fillRect(padding.left, padding.top, thresholdX - padding.left, thresholdY - padding.top);

  // Bottom-Left: Dog
  ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.06)';
  ctx.fillRect(padding.left, thresholdY, thresholdX - padding.left, height - padding.bottom - thresholdY);

  // 2. Lignes de grille
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const yVal = (maxGM / yTicks) * i;
    const yPos = padding.top + plotH - (yVal / maxGM) * plotH;
    ctx.beginPath();
    ctx.moveTo(padding.left, yPos);
    ctx.lineTo(width - padding.right, yPos);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(yVal.toFixed(0) + ' DH', padding.left - 8, yPos + 3);
  }

  const xTicks = 5;
  for (let i = 0; i <= xTicks; i++) {
    const xVal = (maxQty / xTicks) * i;
    const xPos = padding.left + (xVal / maxQty) * plotW;
    ctx.beginPath();
    ctx.moveTo(xPos, padding.top);
    ctx.lineTo(xPos, height - padding.bottom);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(xVal).toString(), xPos, height - padding.bottom + 16);
  }

  // 3. Lignes de Seuils Pointillées
  ctx.save();
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 1.5;

  // Seuil X (Popularité)
  ctx.strokeStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(thresholdX, padding.top);
  ctx.lineTo(thresholdX, height - padding.bottom);
  ctx.stroke();

  // Seuil Y (Marge moyenne)
  ctx.strokeStyle = '#10b981';
  ctx.beginPath();
  ctx.moveTo(padding.left, thresholdY);
  ctx.lineTo(width - padding.right, thresholdY);
  ctx.stroke();
  ctx.restore();

  // Labels des Seuils
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Seuil Popularité : ' + Math.round(popThreshold) + ' u.', thresholdX + 6, padding.top + 14);

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Marge Moy. : ' + avgGrossMargin.toFixed(1) + ' DH', width - padding.right - 6, thresholdY - 6);

  // Labels des Axes
  ctx.fillStyle = textColor;
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Volume de Ventes (Unités Vendues) →', padding.left + plotW / 2, height - 10);

  ctx.save();
  ctx.translate(16, padding.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Marge Brute Unitaire (DH) →', 0, 0);
  ctx.restore();

  // 4. Tracé des Bulles / Points
  scatterPlotPoints = [];

  menuEngData.forEach(item => {
    const cx = padding.left + (item.qty / maxQty) * plotW;
    const cy = padding.top + plotH - (item.grossMarginDH / maxGM) * plotH;
    const r = Math.min(22, Math.max(5, 5 + Math.sqrt(item.totalCA / maxCA) * 16));

    scatterPlotPoints.push({ x: cx, y: cy, r: r, item: item });

    let color = '#10b981';
    if (item.quadrant === 'plowhorse') color = '#0284c7';
    if (item.quadrant === 'puzzle') color = '#8b5cf6';
    if (item.quadrant === 'dog') color = '#ef4444';

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color + (isDark ? 'cc' : 'b3');
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Si un point est survolé, dessiner son halo
  if (hoveredScatterPoint) {
    const p = hoveredScatterPoint;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // 5. Attacher les écouteurs de souris (une seule fois)
  if (!scatterCanvasBound) {
    scatterCanvasBound = true;

    canvas.addEventListener('mousemove', (e) => {
      const cRect = canvas.getBoundingClientRect();
      const mx = e.clientX - cRect.left;
      const my = e.clientY - cRect.top;

      let found = null;
      for (let i = scatterPlotPoints.length - 1; i >= 0; i--) {
        const pt = scatterPlotPoints[i];
        const dist = Math.hypot(mx - pt.x, my - pt.y);
        if (dist <= pt.r + 4) {
          found = pt;
          break;
        }
      }

      if (found) {
        hoveredScatterPoint = found;
        const it = found.item;
        tooltip.innerHTML = `
          <div class="tt-title">${escapeHtml(it.product)}</div>
          <div style="font-size:10.5px; color:#94a3b8; margin-bottom:6px;">${escapeHtml(it.family)} — ${it.quadrantLabel}</div>
          <div class="tt-row"><span>Prix de vente :</span><strong class="tt-val">${it.price.toFixed(2)} DH</strong></div>
          <div class="tt-row"><span>Coût Portion (FC%) :</span><strong class="tt-val">${it.cost.toFixed(2)} DH (${it.foodCostPct}%)</strong></div>
          <div class="tt-row"><span>Marge Brute / plat :</span><strong class="tt-val" style="color:#38bdf8;">${it.grossMarginDH.toFixed(2)} DH</strong></div>
          <div class="tt-row"><span>Quantité vendue :</span><strong class="tt-val">${it.qty.toLocaleString('fr-FR')} u.</strong></div>
          <div class="tt-row"><span>CA Total :</span><strong class="tt-val" style="color:#10b981;">${it.totalCA.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</strong></div>
          <div style="margin-top:6px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.15); font-size:11px; color:#fde047;">
            💡 ${escapeHtml(it.actionAdvice)}
          </div>
        `;
        tooltip.style.left = mx + 'px';
        tooltip.style.top = (my - 10) + 'px';
        tooltip.style.display = 'block';
        renderMenuEngineeringScatterPlot();
      } else {
        if (hoveredScatterPoint) {
          hoveredScatterPoint = null;
          tooltip.style.display = 'none';
          renderMenuEngineeringScatterPlot();
        }
      }
    });

    canvas.addEventListener('mouseleave', () => {
      hoveredScatterPoint = null;
      if (tooltip) tooltip.style.display = 'none';
      renderMenuEngineeringScatterPlot();
    });

    window.addEventListener('resize', () => {
      renderMenuEngineeringScatterPlot();
    });
  }
}

function renderSummaryTopIngredientsPodium() {
  const container = document.getElementById('summary-top-ingredients-podium');
  if (!container) return;

  if (!aggregatedIngredients || aggregatedIngredients.length === 0) {
    container.style.display = 'none';
    return;
  }

  const top4 = [...aggregatedIngredients]
    .filter(ing => ing.qty > 0)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4);

  if (top4.length === 0) {
    container.style.display = 'none';
    return;
  }

  const medals = ['🥇', '🥈', '🥉', '🏅'];
  const totalWeight = top4.reduce((acc, x) => acc + x.qty, 0);

  container.innerHTML = top4.map((ing, idx) => {
    return `
      <div class="podium-ing-card">
        <span class="pod-rank">${medals[idx]}</span>
        <div>
          <div class="pod-name">${escapeHtml(ing.name)}</div>
          <div class="pod-cat">${escapeHtml(ing.category || 'Épicerie')}</div>
        </div>
        <div>
          <div class="pod-qty">${ing.qty.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} <span style="font-size:13px; font-weight:700;">${ing.unit}</span></div>
          <div style="font-size:11px; color:var(--muted); margin-top:2px;">Consommé sur la période</div>
        </div>
      </div>
    `;
  }).join('');

  container.style.display = 'grid';
}


function switchToTab(tabId) {
  document.querySelectorAll('.v-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
  const btn = document.querySelector(`[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
  const tab = document.getElementById(tabId);
  if (tab) {
    tab.style.display = 'block';
    const rect = tab.getBoundingClientRect();
    if (rect.top < 0 || rect.top > window.innerHeight) {
      tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  if (window.location.hash !== '#' + tabId) {
    history.pushState(null, '', '#' + tabId);
  }
}

function switchToAuditTab() {
  switchToTab('tab-audit');
}

window.switchToTab = switchToTab;
window.switchToAuditTab = switchToAuditTab;

window.setMenuEngQuadrantFilter = setMenuEngQuadrantFilter;
window.onMenuEngFamilyFilterChange = onMenuEngFamilyFilterChange;
window.onMenuEngSortChange = onMenuEngSortChange;
window.renderMenuEngineeringMatrix = renderMenuEngineeringMatrix;
window.renderMenuEngineeringTable = renderMenuEngineeringTable;
window.renderMenuEngineeringScatterPlot = renderMenuEngineeringScatterPlot;
window.renderSummaryTopIngredientsPodium = renderSummaryTopIngredientsPodium;

/* ========================================================
   12. INITIALISATION & GESTIONNAIRES D'ÉVÉNEMENTS
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'tab-audit' || hash === 'audit') switchToTab('tab-audit');
    else if (hash === 'tab-menu-engineering' || hash === 'menu-engineering') switchToTab('tab-menu-engineering');
    else if (hash === 'tab-sales' || hash === 'sales') switchToTab('tab-sales');
    else if (hash === 'tab-recipes' || hash === 'recipes') switchToTab('tab-recipes');
    else if (hash === 'tab-summary' || hash === 'summary') switchToTab('tab-summary');
  });
  if (window.location.hash === '#tab-audit' || window.location.hash === '#audit') {
    setTimeout(() => {
      document.querySelectorAll('.v-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      const btn = document.querySelector('[data-tab="tab-audit"]');
      if (btn) btn.classList.add('active');
      const tab = document.getElementById('tab-audit');
      if (tab) tab.style.display = 'block';
    }, 100);
  }
  document.getElementById('print-date-val').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  loadRecipes();
  loadMonthlySalesDB();
  renderRecipeList();
  renderCalendar();
  recalculateCurrentView();
  autoScanVentesFolder(false);

  // Drag & Drop
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadedFiles(e.dataTransfer.files);
    }
  });
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadedFiles(e.target.files);
    }
  });



  // Bouton Export Excel
  const expBtn = document.getElementById('btn-export-excel');
  if (expBtn) expBtn.addEventListener('click', exportToExcel);

  // Tabs de vue
  document.querySelectorAll('.v-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.v-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      const targetId = tab.dataset.tab;
      const target = document.getElementById(targetId);
      if (target) target.style.display = 'block';
    });
  });

  // Recherche Ingrédients
  document.getElementById('search-ing').addEventListener('input', renderSummaryTable);
  document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSummaryTable();
    });
  });

  // Recherche Ventes
  document.getElementById('search-sales').addEventListener('input', renderSalesTable);
  
  // Wire up sales filter buttons (restreint à l'onglet Ventes)
  document.querySelectorAll('#tab-sales .filter-group .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tab-sales .filter-group .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSalesFilter = btn.dataset.filter;
      renderSalesTable();
    });
  });

  // Recherche Recettes
  document.getElementById('search-recipe-list').addEventListener('input', renderRecipeList);

  // Ajouter / Reset Recettes
  document.getElementById('btn-add-recipe').addEventListener('click', () => {
    document.getElementById('edit-recipe-id').value = 'rec_' + Date.now();
    document.getElementById('edit-recipe-name').value = '';
    document.getElementById('edit-recipe-cat').value = 'PLATS';
    document.getElementById('edit-recipe-ingredients').value = '';
    document.getElementById('modal-recipe-title').textContent = 'Nouvelle Fiche Technique';
    document.getElementById('recipe-modal').classList.add('visible');
  });

  document.getElementById('btn-reset-recipes').addEventListener('click', () => {
    if (confirm('Voulez-vous réinitialiser toutes les fiches techniques aux valeurs d\'origine ?')) {
      localStorage.removeItem('gc_recipes_db_v4');
      loadRecipes();
      renderRecipeList();
      recalculateCurrentView();
    }
  });

  // Gestion du Thème Clair / Sombre
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('gc_theme') || 'light';
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  function applyTheme(t) {
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggleBtn.textContent = '☀️ Mode Clair';
      themeToggleBtn.title = 'Passer au mode clair';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtn.textContent = '🌙 Mode Sombre';
      themeToggleBtn.title = 'Passer au mode sombre';
    }
    localStorage.setItem('gc_theme', t);
  }

  // Tri de tableau
  let sortDirection = 1;
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const type = th.dataset.sort;
      sortDirection *= -1;
      if (type === 'name') {
        aggregatedIngredients.sort((a, b) => sortDirection * a.name.localeCompare(b.name));
      } else if (type === 'cat') {
        aggregatedIngredients.sort((a, b) => sortDirection * a.category.localeCompare(b.category));
      } else if (type === 'qty') {
        aggregatedIngredients.sort((a, b) => sortDirection * (a.totalQty - b.totalQty));
      }
      renderSummaryTable();
    });
  });
});