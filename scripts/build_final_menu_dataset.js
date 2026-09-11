const fs = require('fs');

// 1. Load catalog from menu-data.js
const menuContent = fs.readFileSync('menu-data.js', 'utf8');
const sections = menuContent.split(/category:\s*\{\s*fr:\s*"/);
const catalog = [];

for (let i = 1; i < sections.length; i++) {
  const sec = sections[i];
  const catName = sec.substring(0, sec.indexOf('"'));
  const itemBlocks = sec.split(/\{\s*name:\s*\{\s*fr:\s*"/);
  for (let j = 1; j < itemBlocks.length; j++) {
    const b = itemBlocks[j];
    const name = b.substring(0, b.indexOf('"')).trim();
    const priceM = b.match(/price:\s*"([^"]+)"/);
    const descM = b.match(/description:\s*\{\s*fr:\s*"([^"]*)"/);
    const isNewM = b.match(/isNew:\s*(true|false)/);
    const isSpecialM = b.match(/isSpecial:\s*(true|false)/);
    
    catalog.push({
      category: catName,
      name: name,
      price: priceM ? parseFloat(priceM[1].replace(/[^0-9.]/g, '')) || 0 : 0,
      description: descM ? descM[1] : '',
      isNew: isNewM ? isNewM[1] === 'true' : false,
      isSpecial: isSpecialM ? isSpecialM[1] === 'true' : false,
    });
  }
}

// 2. Load POS products (post-mars 2026)
const pos = JSON.parse(fs.readFileSync('scripts/pos_products_post_mars.json', 'utf8').replace(/^\uFEFF/, ''));

// 3. Load Cost Lookups
const menu184 = JSON.parse(fs.readFileSync('scripts/menu_184_complete.json', 'utf8').replace(/^\uFEFF/, ''));
const costLookup = {};
const idLookup = {};
menu184.forEach(i => {
  const key = (i.cat + '___' + i.name).toLowerCase();
  costLookup[key] = i.cost;
  idLookup[key] = i.id;
  if (!costLookup[i.name.toLowerCase()]) costLookup[i.name.toLowerCase()] = i.cost;
  if (!idLookup[i.name.toLowerCase()]) idLookup[i.name.toLowerCase()] = i.id;
});

const foodCostSummary = JSON.parse(fs.readFileSync('scripts/food_cost_summary.json', 'utf8').replace(/^\uFEFF/, ''));
foodCostSummary.forEach(f => {
  const k = f.name.toLowerCase();
  if (!costLookup[k]) costLookup[k] = f.cost;
});

function clean(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function getPosSales(matcher) {
  let qty = 0;
  let ca = 0;
  pos.forEach((p) => {
    if (matcher(p)) {
      qty += p.Qty;
      ca += p.CA;
    }
  });
  return { qty: Math.round(qty), ca: Math.round(ca * 100) / 100 };
}

// Generate unique ID
function makeId(cat, name, idx) {
  const catPrefix = cat.substring(0, 3).toLowerCase().replace(/[^a-z]/g, 'x');
  const nameClean = clean(name).substring(0, 10);
  return `${catPrefix}_${nameClean}_${idx}`;
}

const finalItems = catalog.map((item, index) => {
  const cat = item.category;
  let name = item.name;
  
  // Clean minor typos in display names
  if (name === 'COMPAGNAD') name = 'COMPAGNARD';
  if (name === 'CAPPUCHINO ITALIEN') name = 'CAPPUCCINO ITALIEN';
  if (name === 'CAPPUCHINO AVEC CHANTILLY') name = 'CAPPUCCINO AVEC CHANTILLY';

  const cName = clean(name);
  let sales = { qty: 0, ca: 0 };
  
  // Specific mappings by Category & Name:
  if (cat === 'PETIT DÉJEUNER') {
    if (name === 'COMPAGNARD' || name === 'COMPAGNAD') sales = getPosSales(p => p.RawName === 'COMPAGNARD');
    else if (name === 'OMELETTE DU CHEF') sales = getPosSales(p => p.RawName === 'Omlette Du Chef');
    else if (name === 'OMELETTE NATURE') sales = getPosSales(p => p.RawName === 'OMLETTE NATURE');
    else if (name === 'OMELETTE FROMAGE') sales = getPosSales(p => p.RawName === 'OMLETTE FROMAGE');
    else if (name === 'OMELETTE CONTINENTAL') sales = getPosSales(p => p.RawName === 'Pet-Dej Continental');
    else if (name === 'OMELETTE VEGETARIENNE') sales = getPosSales(p => p.RawName === 'OMLETTE VEGETARIENNE');
    else if (name === 'MENU ENFANT') sales = getPosSales(p => p.RawName === 'Menu Enfant' && p.Famille === 'PETIT DEJEUNER');
    else if (name === 'BRUNCH DUO') sales = getPosSales(p => p.RawName === 'Brunch Duo');
    else if (name === 'BRUNCH GREYCORNER') sales = getPosSales(p => p.RawName === 'Brunch GREY CORNER');
    else if (name === 'AMERICAIN') sales = getPosSales(p => p.RawName === 'AMERICAIN');
    else if (name === 'NORVÉGIEN') sales = getPosSales(p => p.RawName === 'Pet-Dej Norvegien');
    else if (name === 'ESPAGNOL') sales = getPosSales(p => p.RawName === 'Pet-Dej Espagnol');
    else if (name === 'MQUILA MERGUEZ') sales = getPosSales(p => p.RawName === 'Pet-Dej Mquila MERGUEZ');
    else if (name === 'MQUILA-fruits de mer') sales = getPosSales(p => p.RawName === 'MQUILA FRUITS DE MER');
    else if (name === 'HOLLANDAIS') sales = getPosSales(p => p.RawName === 'Pet-Dej Hollandais');
    else if (name === 'BERBÈRE') sales = getPosSales(p => p.RawName === 'Pet-Dej Berbere');
    else if (name === 'FASSI') sales = getPosSales(p => p.RawName === 'Pet-Dej Fassi');
    else if (name === 'BELDI') sales = getPosSales(p => p.RawName === 'Pet-Dej Beldi');
    else if (name === 'LIGHT') sales = getPosSales(p => p.RawName === 'Pet-Dej Light');
    else if (name === 'EXPRESS') sales = getPosSales(p => p.RawName === 'Pet-Dej Express');
  }
  else if (cat === 'PLATS') {
    if (name === 'PAVÉ DE SAUMON À LA PLANCHA') sales = getPosSales(p => p.RawName === 'Plat Pave De Saumon');
    else if (name === "FILET DE BŒUF AUX HERBES DE L'ATLAS") sales = getPosSales(p => p.RawName === 'Filet De Boeuf');
    else if (name === "ROULADE DE BŒUF AUX SAVEURS DE L'ATLAS") sales = getPosSales(p => p.RawName === 'ROULADE DE BOEUF VH');
    else if (name === 'LE FILET DE BŒUF ÉMINCÉ') sales = getPosSales(p => p.RawName === 'Plat EminceDe Boeuf');
    else if (name === 'SUPRÊME DE POULET AUX CHAMPIGNONS ET PERSILLADE') sales = getPosSales(p => p.RawName === 'SUPREME DE POULET');
    else if (name === 'ESCALOPE A LA MILANAISE') sales = getPosSales(p => p.RawName === 'Plat Escalope A La Milanaise');
    else if (name === 'BROCHETTES DE POULET MARINÉES') sales = getPosSales(p => p.RawName === 'BROCHETTE DE POULET');
    else if (name === 'ÉMINCÉ DE POULET À LA CRÈME DE CHAMPIGNONS') sales = getPosSales(p => p.RawName === 'Plat Emince De Poulet');
    else if (name === "BALLOTINE DE POULET AU CŒUR D'ÉPINARDS ET FROMAGE") sales = getPosSales(p => p.RawName === 'BALLOTINE DE POULET');
    else if (name === 'MENU ENFANT') sales = getPosSales(p => (p.Famille === 'Menu Enfant' || p.RawName.includes('Menu Enfant')) && p.RawName !== 'Menu Enfant');
    else if (name === 'ACCOMPAGNEMENTS') sales = { qty: 0, ca: 0 };
  }
  else if (cat === 'BURGERS') {
    if (name === 'EGG ET CHEESEBURGER') sales = getPosSales(p => p.RawName === 'EGG BURGER');
    else if (name === 'CHEESE BURGER') sales = getPosSales(p => p.RawName === 'Cheese Burger');
    else if (name === 'CHICKEN BURGER') sales = getPosSales(p => p.RawName === 'CHICKEN BURGER');
    else if (name === 'BIG BURGER') sales = getPosSales(p => p.RawName === 'BIG BURGER');
    else if (name === 'BURGER ROYAL') sales = getPosSales(p => p.RawName === 'Burger ROYAL');
    else if (name === 'AVOCADO FORESTIER') sales = getPosSales(p => p.RawName === 'Burger Avocado Forestier');
  }
  else if (cat === 'SANDWICHS CIABATTA') {
    if (name === 'SANDWICH CHEESE STEAK') sales = getPosSales(p => p.RawName === 'SANDWICH CHEESE STEAK');
    else if (name === 'POULARD') sales = getPosSales(p => p.RawName === 'POULARD');
    else if (name === 'POULET CRUNCHY') sales = getPosSales(p => p.RawName === 'Sandwich Poulet Crunchy');
    else if (name === 'POULET') sales = getPosSales(p => p.RawName === 'Sandwich Poulet');
    else if (name === 'VIANDE HACHÉE') sales = getPosSales(p => p.RawName === 'Sandwich Viande Hache');
    else if (name === 'FRUITS DE MER') sales = getPosSales(p => p.RawName === 'SANDWICH  FRUIT DE MER');
    else if (name === 'THON') sales = getPosSales(p => p.RawName === 'Sandwich Thon');
  }
  else if (cat === 'PANINI') {
    if (name === 'POULET') sales = getPosSales(p => p.RawName === 'Panini Poulet');
    else if (name === 'VIANDE HACHÉE') sales = getPosSales(p => p.RawName === 'Panini Viande Hachee');
    else if (name === 'MIXTE') sales = getPosSales(p => p.RawName === 'PANINI MIX');
    else if (name === 'CHARCUTERIE') sales = getPosSales(p => p.RawName === 'Panini Charcuterie');
    else if (name === 'FRUIT DE MER') sales = getPosSales(p => p.RawName === 'Panini Fruit De Mer');
    else if (name === 'SAUMON') sales = getPosSales(p => p.RawName === 'Panini Saumon');
    else if (name === 'WRAP POULET') sales = getPosSales(p => p.RawName === 'WRAP POULET');
    else if (name === 'WRAP VIANDE HACHÉE') sales = getPosSales(p => p.RawName === 'WRAP VIANDE HACHEE');
    else if (name === 'WRAP GOURMAND') sales = getPosSales(p => p.RawName === 'WRAP GOURMAND');
  }
  else if (cat === 'PIZZA') {
    if (name === 'POULET SAUCE BLANCHE') sales = getPosSales(p => p.RawName === 'Pizza Poulet');
    else if (name === '5 FROMAGES') sales = getPosSales(p => p.RawName === 'Pizza 5 Fromages');
    else if (name === 'SAUMON') sales = getPosSales(p => p.RawName === 'Pizza Saumon');
    else if (name === 'FRUITS DE MER') sales = getPosSales(p => p.RawName === 'Pizza Fruits De Mer');
    else if (name === 'VIANDE HACHÉE') sales = getPosSales(p => p.RawName === 'Pizza VIANDE HACHEE');
    else if (name === 'THON') sales = getPosSales(p => p.RawName === 'Pizza Thon');
    else if (name === 'VEGETARIENNE') sales = getPosSales(p => p.RawName === 'Pizza Veget Arienne');
    else if (name === 'MARGARITA') sales = getPosSales(p => p.RawName === 'Pizza Margarita');
    else if (name === '4 SAISONS') sales = getPosSales(p => p.RawName === 'Pizza 4 Saisons');
    else if (name === 'PEPPERONI') sales = getPosSales(p => p.RawName === 'Pizza Pepperoni');
    else if (name === 'REGINA') sales = getPosSales(p => p.RawName === 'REGINA DINDE FUMEE');
    else if (name === 'MOITIÉ MOITIÉ') sales = getPosSales(p => p.RawName === 'PIZZA MOITIE MOITIE');
    else if (name === 'BURRATA') sales = getPosSales(p => p.RawName === 'Pizza Burrata');
  }
  else if (cat === 'Pasta (Spaghettis, Tagliatelles, Linguines)') {
    if (name === '5 FROMAGE') sales = getPosSales(p => p.RawName === 'Pasta 5 Fromage');
    else if (name === 'SAUMON') sales = getPosSales(p => p.RawName === 'Pasta Saumon');
    else if (name === 'FRUITS DE MER') sales = getPosSales(p => p.RawName === 'Pasta Fruits De Mer');
    else if (name === 'POULET CHAMPIGNON / EPINARD') sales = getPosSales(p => p.RawName === 'Pasta Poulet Champignon');
    else if (name === 'BOLOGNAISE') sales = getPosSales(p => p.RawName === 'Pasta Bolognaise');
    else if (name === 'CARBONARA') sales = getPosSales(p => p.RawName === 'Pasta Carbonara');
    else if (name === 'REGATONI RICOTTA') sales = getPosSales(p => p.RawName === 'Pasta Regatoni Ricotta');
    else if (name === 'VEGETARIEN') sales = getPosSales(p => p.RawName === 'Pasta Vegetarien');
    else if (name === 'SPAGHETTIS NOIRS') sales = getPosSales(p => p.RawName === 'Pasta Spaguettis Noirs');
    else if (name === 'LASAGNE POULET CHAMPIGNON') sales = getPosSales(p => p.RawName === 'LASAGNE POULET');
    else if (name === 'LASAGNE BOLOGNAISE') sales = getPosSales(p => p.RawName === 'LASAGNE BOLOGNAISE');
    else if (name === 'LASAGNE FRUIT DE MER') sales = getPosSales(p => p.RawName === 'LASAGNE FRUITS DE MER');
  }
  else if (cat === 'GÂTEAUX') {
    if (name === 'SAN SEBASTIEN (Nutella)') sales = getPosSales(p => p.RawName === 'San Sebastien');
    else if (name === 'SAN SEBASTIEN') sales = getPosSales(p => p.RawName === 'SAN SEBASTIEN GREY CORNER');
    else if (name === 'CHEESECAKE (Lotus, Citron)') sales = getPosSales(p => p.RawName === 'CHEESE CAKE CITRON');
    else if (name === 'CHEESECAKE (Chocolat, Pistache, Framboise)') sales = getPosSales(p => p.RawName === 'CHEESE CAKE CHOCOLAT' || p.RawName === 'CHEESE CAKE PISTACHE' || p.RawName === 'CHEESECAKE FRAMBOISE');
    else if (name === 'FONDANT AU CHOCOLAT') sales = getPosSales(p => p.RawName === 'Fondant Au Chocolat');
    else if (name === 'TIRAMISU') sales = getPosSales(p => p.RawName === 'TIRAMISU');
  }
  else if (cat === 'COUSCOUS VENDREDI') {
    if (name.includes('viande')) sales = getPosSales(p => p.RawName === 'Couscous Vainde Avec Petit Lait');
    else if (name.includes('poulet')) sales = getPosSales(p => p.RawName === 'Couscous Poulet Avec Petit Lait');
  }
  else if (cat === 'CRÊPES SALÉES') {
    if (name === 'Crêpe POULET-CHAMPIGNON') sales = getPosSales(p => p.RawName === 'Crepe Poulet CHAMPIGNON');
    else if (name === 'Crêpe CHARCUTERIE') sales = getPosSales(p => p.RawName === 'Crepe CHARCUTERIE');
    else if (name === 'Crêpe PÊCHEUR') sales = getPosSales(p => p.RawName === 'Crepe Pecheur');
    else if (name === 'Crêpe GREY CORNER (MIXTE)') sales = getPosSales(p => p.RawName === 'Crepe Grey Corner SALEE');
    else if (name === 'Crêpe NORVÉGIENNE') sales = getPosSales(p => p.RawName === 'Crepe Norvegienne');
    else if (name === 'Crêpe FROMAGE') sales = getPosSales(p => p.RawName === 'CREPE FROMAGE');
    else if (name === 'Crêpe BOLOGNAISE') sales = getPosSales(p => p.RawName === 'Crepe Bolonaise');
  }
  else if (cat === 'CRÊPES et GAUFRES') {
    if (name === 'NUTELLA') sales = getPosSales(p => p.RawName === 'Crepe Nutella' || p.RawName === 'Gauffre Nutella');
    else if (name === 'KUNAFA PISTACHE') sales = getPosSales(p => p.RawName === 'CREPE KUNAFA PISTACHE' || p.RawName === 'GAUFFRE KUNAFA PISTACHE');
    else if (name === 'BANANE-NUTELLA') sales = getPosSales(p => p.RawName === 'Crepe Banane Nutella' || p.RawName === 'Gauffre Nutela Banane');
    else if (name === 'EXOTIQUE (fruits saisons)') sales = getPosSales(p => p.RawName === 'Crepe Exotique' || p.RawName === 'Gauffre Exotique');
    else if (name === 'POMME CARAMELISÉE') sales = getPosSales(p => p.RawName === 'Crepe PM-Caramelisee' || p.RawName === 'Gauffre PM-Caramelisee');
    else if (name === 'CHOCOLAT NOISETTE') sales = getPosSales(p => p.RawName === 'Crepe Choco-Noisette' || p.RawName === 'Gauffre Choco-Noisette');
    else if (name === 'GREY CORNER (variétés gourmandises)') sales = getPosSales(p => p.RawName === 'Crepe Grey Corner SUCREE' || p.RawName === 'Gaufer Grey Corner');
  }
  else if (cat === 'ENTRÉES FROIDES') {
    if (name === 'CERCLE VEGGI') sales = getPosSales(p => p.RawName === 'Salade Cercle Veggl');
    else if (name === 'BURRATTA') sales = getPosSales(p => p.RawName === 'Salade Burratta');
    else if (name === 'TERRE MER') sales = getPosSales(p => p.RawName === 'Salade Terre Mer');
    else if (name === 'TARTARE SAUMON') sales = getPosSales(p => p.RawName === 'TARTARE SAUMON');
    else if (name === 'QUINOA') sales = getPosSales(p => p.RawName === 'Salade Quinoa');
    else if (name === 'CESAR') sales = getPosSales(p => p.RawName === 'Salade Cesar');
    else if (name === 'RUSSE') sales = getPosSales(p => p.RawName === 'RUSSE');
  }
  else if (cat === 'ENTRÉES CHAUDES') {
    if (name === 'CROUSTILLON GAMBAS') sales = getPosSales(p => p.RawName === 'Croustillon Gambas');
    else if (name === 'PIL PIL ESPAGNOL') sales = getPosSales(p => p.RawName === 'Pil Pil Espagnol');
    else if (name === 'BOULETTES DE POULET FROMAGE') sales = getPosSales(p => p.RawName === 'BOULETTES DE POULET FR');
  }
  else if (cat === 'BOISSONS CHAUDES') {
    if (name === 'CAPPUCCINO ITALIEN') sales = getPosSales(p => p.RawName === 'Cappuccino Italien');
    else if (name === 'CAPPUCCINO AVEC CHANTILLY') sales = getPosSales(p => p.RawName === 'Cappuccino Avec Chantilly');
    else if (name === 'VERVEINE AROMATISÉE') sales = getPosSales(p => p.RawName === 'Verveine au lait');
    else if (name === 'VERVEINE') sales = getPosSales(p => p.RawName === 'Verveine');
    else if (name === 'CAFÉ NOIR') sales = getPosSales(p => p.RawName === 'CAFE NOIR');
    else if (name === 'CAFÉ AU LAIT') sales = getPosSales(p => p.RawName === 'Cafe Au Lait');
    else if (name === 'CAFÉ AMERICAIN') sales = getPosSales(p => p.RawName === 'Cafe  Americain');
    else if (name === 'CAFÉ NESPRESSO') sales = getPosSales(p => p.RawName === 'Cafe Nespresso');
    else if (name === 'CAFÉ LATTE') sales = getPosSales(p => p.RawName === 'Cafe Latte');
    else if (name === 'CHOCOLAT FONDUE') sales = getPosSales(p => p.RawName === 'Chocolat Fondue');
    else if (name === 'CHOCOLAT AVEC CHANTILLY') sales = getPosSales(p => p.RawName === 'Chocolat Avec Chantilly');
    else if (name === 'CHOCOLAT AU LAIT') sales = getPosSales(p => p.RawName === 'Chocolat Au Lait');
    else if (name === 'THÉ À LA MENTHE') sales = getPosSales(p => p.RawName === 'The à La Menthe');
    else if (name === 'THÉ NOIR') sales = getPosSales(p => p.RawName === 'The Noir');
    else if (name === 'THÉ NOIR AU LAIT') sales = getPosSales(p => p.RawName === 'The Noir Au Lait');
    else if (name === 'THÉ INFUSION') sales = getPosSales(p => p.RawName === 'Infusion Bien-Etre' || p.RawName.includes('Infusion'));
    else if (name === 'LAIT FROID / CHAUD') sales = getPosSales(p => p.RawName === 'Lait Chaud' || p.RawName === 'Lait Froid');
  }
  else if (cat === 'SODA') {
    if (name === 'SCHWEPPES CITRON/TONIC') sales = getPosSales(p => p.RawName === 'SCHWEPPS CITRON' || p.RawName === 'SCHWEPPS TONIC');
    else if (name === 'COCA') sales = getPosSales(p => p.RawName === 'Coca Cola');
    else if (name === 'COCA ZERO') sales = getPosSales(p => p.RawName === 'Coca Zero');
    else if (name === 'SPRITE') sales = getPosSales(p => p.RawName === 'Sprite');
    else if (name === 'HAWAI') sales = getPosSales(p => p.RawName === 'Hawai');
    else if (name === 'POMS') sales = getPosSales(p => p.RawName === 'Poms');
    else if (name === 'ORANGINA') sales = getPosSales(p => p.RawName === 'Orangina');
    else if (name === 'REDBULL') sales = getPosSales(p => p.RawName === 'Red Bull');
  }
  else if (cat === 'EAU MINÉRALE') {
    if (name === '0.5 l') sales = getPosSales(p => p.RawName === 'Eau Minerale 0.5l');
    else if (name === '0.75 l') sales = getPosSales(p => p.RawName === 'EAU MINERAL 75 cl');
    else if (name === 'OULMES 0.75 l') sales = getPosSales(p => p.RawName === 'EAU GAZEUSE 75 CL');
    else if (name === 'OULMES') sales = getPosSales(p => p.RawName === 'oULMES');
  }
  else if (cat === 'BOISSONS FRAÎCHES (JUS)') {
    if (name === 'ZA3ZA3') sales = getPosSales(p => p.RawName === 'Zaazaa');
    else if (name === 'COCKTAIL ORANGE') sales = getPosSales(p => p.RawName === 'COCKTAIL ORANGE');
    else if (name === 'JUS DE FRUITS SECS AVOCAT') sales = getPosSales(p => p.RawName === 'FRUITS SEC' || p.RawName === 'JUS D AVOCAT ORANGE');
    else if (name === 'PANACHÉ AU LAIT') sales = getPosSales(p => p.RawName === 'Panache AU LAIT');
    else if (name === 'JUS DE FRAMBOISE') sales = getPosSales(p => p.RawName === 'Jus De Framboise');
    else if (name === "JUS D'AVOCAT") sales = getPosSales(p => p.RawName === "Jus D'Avocat AU LAIT");
    else if (name === "JUS D'ANANAS") sales = getPosSales(p => p.RawName === "Jus D'Ananas");
    else if (name === 'JUS DE MANGUE') sales = getPosSales(p => p.RawName === 'Jus De Mangue');
    else if (name === 'JUS DE PÊCHE') sales = getPosSales(p => p.RawName === 'Jus De Peche');
    else if (name === 'JUS DE FRAISE') sales = getPosSales(p => p.RawName === 'Jus De Fraise');
    else if (name === 'JUS DE POMME / BANANE') sales = getPosSales(p => p.RawName === 'Jus De Pomme' || p.RawName === 'Jus De Banane');
    else if (name === 'JUS DE CITRON') sales = getPosSales(p => p.RawName === 'Jus De Citron');
    else if (name === 'JUS DE CAROTTE') sales = getPosSales(p => p.RawName === 'Jus De Carotte');
    else if (name === "JUS D'ORANGE") sales = getPosSales(p => p.RawName === "Jus D' Orange");
  }
  else if (cat === 'ICE TEA') {
    if (name === 'ICE TEA CITRON') sales = getPosSales(p => p.RawName === 'Ice Tea Citron');
    else if (name === 'ICE TEA PÊCHE') sales = getPosSales(p => p.RawName === 'Ice Tea Pèche');
    else if (name === 'ICE TEA FRAMBOISE') sales = getPosSales(p => p.RawName === 'Ice Tea Framboise');
  }
  else if (cat === 'ICE COFFEE') {
    if (name === 'CAFÉ GLACÉ CLASSIQUE') sales = getPosSales(p => p.RawName === 'Ice Coffee Classique');
    else if (name === 'CAFÉ GLACÉ AROMATISÉ') sales = getPosSales(p => p.RawName === 'Ice Coffee Aromatise');
  }
  else if (cat === 'FRAPPUCCINO') {
    if (name === 'FRAPPUCCINO CLASSIQUE') sales = getPosSales(p => p.RawName === 'Frappuccino Classique');
    else if (name === 'FRAPPUCCINO AROMATISÉ') sales = getPosSales(p => p.RawName === 'Frappuccino Aromatise');
  }
  else if (cat === 'COCKTAILS') {
    if (name === 'COCKTAIL GREY CORNER') sales = getPosSales(p => p.RawName === 'Cocktail GREY CORNER');
    else if (name === 'FRAÎCHEUR') sales = getPosSales(p => p.RawName === 'Fraicheur');
    else if (name === 'TROPICAL') sales = getPosSales(p => p.RawName === 'Tropical');
    else if (name === 'PINA COLADA') sales = getPosSales(p => p.RawName === 'Pina Colada');
    else if (name === 'COCKTAIL GINGEMBRE') sales = getPosSales(p => p.RawName === 'Cocktail Gingembre');
    else if (name === 'SAN FRANCISCO') sales = getPosSales(p => p.RawName === 'San Francisco');
  }
  else if (cat === 'MOJITO') {
    if (name === 'MOJITO REDBULL') sales = getPosSales(p => p.RawName === 'Mojito Red Bull');
    else if (name === 'MOJITO TROPICAL') sales = getPosSales(p => p.RawName === 'Mojito Tropical');
    else if (name === 'MOJITO CITRON') sales = getPosSales(p => p.RawName === 'Mojito Citron');
  }
  else if (cat === 'SMOOTHIES') {
    if (name === 'JELLY ALMOND') sales = getPosSales(p => p.RawName === 'Jelly Almond');
    else if (name === 'PINK SMOOTHIE') sales = getPosSales(p => p.RawName === 'Pink Smoothie');
    else if (name === 'TRIPLE BERRY') sales = getPosSales(p => p.RawName === 'Triple Berry');
    else if (name === 'ÉNERGÉTIQUE') sales = getPosSales(p => p.RawName === 'Energitique');
    else if (name === 'MULTI-VITAMINE') sales = getPosSales(p => p.RawName === 'Multi-Vitamines');
    else if (name === 'HAWAIEN') sales = getPosSales(p => p.RawName === 'Hawaien');
  }
  else if (cat === 'SMOOTHIE – BOWL') {
    if (name === 'ULTRA – VITAMINES') sales = getPosSales(p => p.RawName === 'Ultra Vitamines');
    else if (name === 'EXOTIQUE') sales = getPosSales(p => p.RawName === 'Exotique Bowl' || p.RawName === 'Smoothie Bowl Exotique' || p.RawName === 'EXOTIQUE');
  }
  else if (cat === 'MILKSHAKES') {
    if (name === 'SUPPLÉMENT CHANTILLY') sales = getPosSales(p => p.RawName === 'Supp Chantilly');
    else sales = getPosSales(p => p.Famille === 'MILKSHAKES' && clean(p.RawName).includes(clean(name.replace('MILKSHAKE', ''))));
  }
  else if (cat === 'ORANGESHAKE') {
    sales = getPosSales(p => p.Famille === 'ORANGESHAKE' || p.RawName.toLowerCase().includes('orangeshake'));
  }
  else if (cat === 'COUPE DE GLACE') {
    if (name === '1 Boule de glace') sales = getPosSales(p => p.RawName === 'Boule De Glace');
    else if (name === '2 Boules de glace') sales = getPosSales(p => p.RawName === '2 BOULE DE GLACE');
    else if (name === 'COUPE GREY CORNER') sales = getPosSales(p => p.RawName === 'Coupe Grey Corner');
    else if (name === 'BANANA SPLIT') sales = getPosSales(p => p.RawName === 'Banana Split');
    else if (name === 'COUPE AMOR') sales = getPosSales(p => p.RawName === 'Coupe Amor');
    else if (name === 'COUPE ENFANT') sales = getPosSales(p => p.RawName === 'Coupe Enfant');
  }

  if (sales.qty === 0 && name !== 'ACCOMPAGNEMENTS') {
    sales = getPosSales(p => {
      const cP = clean(p.RawName);
      return cP === cName || (cP.length > 5 && (cP.includes(cName) || cName.includes(cP)));
    });
  }
  
  let cost = costLookup[(cat + '___' + name).toLowerCase()] || costLookup[name.toLowerCase()] || 0;
  if (!cost) {
    for (const [k, v] of Object.entries(costLookup)) {
      if (k.includes(cName) || cName.includes(k)) { cost = v; break; }
    }
  }
  if (!cost && item.price > 0) {
    cost = Math.round(item.price * 0.32 * 100) / 100;
  }
  
  const unitMargin = Math.round((item.price - cost) * 100) / 100;
  const id = idLookup[(cat + '___' + name).toLowerCase()] || makeId(cat, name, index + 1);
  
  return {
    id,
    name,
    cat,
    price: item.price,
    qty: sales.qty,
    ca: sales.ca,
    cost: Math.round(cost * 100) / 100,
    margin: unitMargin,
    quad: 'PENDING',
    monthlyQty: Math.round((sales.qty / 5.3) * 10) / 10,
    weeklyQty: Math.round((sales.qty / 23) * 10) / 10,
    desc: item.description,
    isNew: item.isNew,
    isSpecial: item.isSpecial
  };
});

// Calculate Menu Engineering Thresholds
const activeItems = finalItems.filter(i => i.qty > 0);
const avgQty = activeItems.reduce((acc, i) => acc + i.qty, 0) / activeItems.length;
const popularityThreshold = Math.round(avgQty * 0.7 * 10) / 10;
const activeCosts = finalItems.filter(i => i.cost > 0);
const avgMargin = Math.round((activeCosts.reduce((acc, i) => acc + i.margin, 0) / activeCosts.length) * 100) / 100;

finalItems.forEach(item => {
  if (item.qty === 0) {
    item.quad = 'DOG_ZERO_VENTE';
  } else {
    const highPop = item.qty >= popularityThreshold;
    const highMargin = item.margin >= avgMargin;
    
    if (highPop && highMargin) item.quad = 'STAR';
    else if (highPop && !highMargin) item.quad = 'PLOWHORSE';
    else if (!highPop && highMargin) item.quad = 'PUZZLE';
    else item.quad = 'DOG';
  }
});

// Save to scripts/menu_193_complete.json
fs.writeFileSync('scripts/menu_184_complete.json', JSON.stringify(finalItems, null, 2), 'utf8');
console.log('Saved scripts/menu_184_complete.json with', finalItems.length, 'items.');

// Summary stats
const quadCounts = {};
finalItems.forEach(i => quadCounts[i.quad] = (quadCounts[i.quad] || 0) + 1);
console.log('Quadrants:', quadCounts);
const totalCA = finalItems.reduce((s, i) => s + i.ca, 0);
const totalQty = finalItems.reduce((s, i) => s + i.qty, 0);
console.log(`Total Menu CA: ${totalCA.toLocaleString('fr-FR')} DH | Total Sales: ${totalQty.toLocaleString('fr-FR')} articles`);
