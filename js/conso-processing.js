/**
 * GREY CORNER — Parsing Ingrédients, Matching Ventes & Déstockage
 * Module: conso-processing.js
 */

/* ========================================================
   4. NORMALISATION & MATCHING INTELLIGENT
======================================================== */


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
  if (cName.includes('burger') || cFam.includes('burger')) {
    if (cName.includes('egg') || cName.includes('oeuf')) return activeRecipes.find(x => x.id === 'bg_egg_et_cheeseburger');
    if (cName.includes('chicken') || cName.includes('poulet')) return activeRecipes.find(x => x.id === 'bg_chicken_burger');
    if (cName.includes('royal')) return activeRecipes.find(x => x.id === 'bg_burger_royal');
    if (cName.includes('big')) return activeRecipes.find(x => x.id === 'bg_big_burger');
    if (cName.includes('avocado') || cName.includes('forestier')) return activeRecipes.find(x => x.id === 'bg_avocado_forestier');
    if (cName.includes('cheese')) return activeRecipes.find(x => x.id === 'bg_cheese_burger');
  }
  if (cName.includes('egg') && (cName.includes('cheese') || cName.includes('burger'))) {
    return activeRecipes.find(x => x.id === 'bg_egg_et_cheeseburger');
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
  // Détection contextuelle par mot-clé et famille de vente
  if (cName.includes('panini') || cFam.includes('panini')) {
    if (cName.includes('poulet')) return activeRecipes.find(x => x.id === 'pa_poulet');
    if (cName.includes('charcuterie')) return activeRecipes.find(x => x.id === 'pa_charcuterie');
    if (cName.includes('viande') || cName.includes('hache')) return activeRecipes.find(x => x.id === 'pa_viande_hachee');
    if (cName.includes('mix') || cName.includes('gourmand')) return activeRecipes.find(x => x.id === 'pa_gourmand');
    if (cName.includes('saumon')) return activeRecipes.find(x => x.id === 'pa_saumon');
    if (cName.includes('mer') || cName.includes('fruit')) return activeRecipes.find(x => x.id === 'pa_fruits_de_mer');
  }

  if (cFam.includes('pasta') || cFam.includes('pate') || cName.includes('pasta') || cName.includes('pate')) {
    if (cName.includes('fruit') || cName.includes('mer')) return activeRecipes.find(x => x.id === 'pae_fruits_de_mer');
    if (cName.includes('saumon')) return activeRecipes.find(x => x.id === 'pae_saumon');
    if (cName.includes('carbonara')) return activeRecipes.find(x => x.id === 'pae_carbonara');
    if (cName.includes('bolognaise')) return activeRecipes.find(x => x.id === 'pae_bolognaise');
    if (cName.includes('5 fromage') || cName.includes('fromages')) return activeRecipes.find(x => x.id === 'pae_5_fromages');
    if (cName.includes('vegetarien') || cName.includes('vegetarienne')) return activeRecipes.find(x => x.id === 'pae_vegetarien');
    if (cName.includes('poulet')) return activeRecipes.find(x => x.id === 'pae_poulet_champignon_epinard');
  }

  if (cFam.includes('sandwich') || cFam.includes('ciabatta') || cName.includes('sandwich') || cName.includes('ciabatta')) {
    if (cName.includes('fruit') || cName.includes('mer')) return activeRecipes.find(x => x.id === 'sw_fruits_de_mer');
    if (cName.includes('thon')) return activeRecipes.find(x => x.id === 'sw_thon');
    if (cName.includes('poulet') && cName.includes('crunchy')) return activeRecipes.find(x => x.id === 'sw_poulet_crunchy');
    if (cName.includes('poulet')) return activeRecipes.find(x => x.id === 'sw_poulet');
    if (cName.includes('cheese') || cName.includes('steak')) return activeRecipes.find(x => x.id === 'sw_cheese_steak');
    if (cName.includes('viande') || cName.includes('hache')) return activeRecipes.find(x => x.id === 'sw_viande_hachee');
  }

  if (cFam.includes('pizza') || cName.includes('pizza')) {
    if (cName.includes('fruit') || cName.includes('mer')) return activeRecipes.find(x => x.id === 'pz_fruits_de_mer');
    if (cName.includes('saumon')) return activeRecipes.find(x => x.id === 'pz_saumon');
    if (cName.includes('thon')) return activeRecipes.find(x => x.id === 'pz_thon');
    if (cName.includes('viande') || cName.includes('hache')) return activeRecipes.find(x => x.id === 'pz_viande_hachee');
    if (cName.includes('5 fromage') || cName.includes('fromages')) return activeRecipes.find(x => x.id === 'pz_5_fromages');
    if (cName.includes('vegetarien') || cName.includes('vegetarienne')) return activeRecipes.find(x => x.id === 'pz_vegetarienne');
    if (cName.includes('poulet')) return activeRecipes.find(x => x.id === 'pz_poulet_sauce_blanche');
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
  renderComparatorTab();
  const expBtn = document.getElementById('btn-export-excel');
  if (expBtn) expBtn.style.display = 'inline-flex';
}

