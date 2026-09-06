import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { DATA } = require('../recipes-data.js');

const menuDataModule = await import('../menu-data.js');
const menuData = menuDataModule.menuData;

if (!DATA || !Array.isArray(DATA)) {
  console.error("DATA not found in recipes-data.js");
  process.exit(1);
}

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Category mapping from recipes-data categories to menu-data categories
const catMap = {
  "CAFÉS & BOISSONS CHAUDES": ["BOISSONS CHAUDES"],
  "CAFÉS GLACÉS & FRAPPÉS": ["ICE COFFEE", "BOISSONS CHAUDES"],
  "ICE TEA MAISON": ["BOISSONS FRAÎCHES (JUS)", "ICE TEA", "BOISSONS CHAUDES"],
  "JUS FRAIS PRESSÉS & ROYAUX": ["BOISSONS FRAÎCHES (JUS)"],
  "COCKTAILS & MOCKTAILS": ["COCKTAILS", "MOJITO", "BOISSONS FRAÎCHES (JUS)"],
  "SMOOTHIES & BOWLS": ["SMOOTHIES", "SMOOTHIE – BOWL"],
  "SODAS & BOISSONS FRAÎCHES": ["SODA"],
  "EAUX MINÉRALES & GAZEUSES": ["EAU MINÉRALE"],
  "PETIT DÉJEUNER": ["PETIT DÉJEUNER"],
  "ENTRÉES FROIDES": ["ENTRÉES FROIDES"],
  "ENTRÉES CHAUDES": ["ENTRÉES CHAUDES"],
  "PLATS": ["PLATS"],
  "BURGERS": ["BURGERS"],
  "PANINIS": ["PANINI", "PANINIS", "WRAPS"],
  "SANDWICHS": ["SANDWICHS", "SANDWICHS CIABATTA"],
  "PIZZA": ["PIZZA"],
  "PÂTES": ["Pasta (Spaghettis, Tagliatelles, Linguines)", "PÂTES"],
  "DESSERTS & PÂTISSERIES": ["GÂTEAUX", "COUPE DE GLACE", "DESSERTS"],
  "CRÊPES": ["CRÊPES et GAUFRES", "CRÊPES SALÉES", "GAUFRES", "CRÊPES"],
  "SUPPLÉMENTS & EXTRAS": ["SUPPLÉMENTS & EXTRAS", "MILKSHAKES", "ORANGESHAKE", "COUSCOUS VENDREDI"],
  "A LA CARTE & BOULANGERIE": ["A LA CARTE & BOULANGERIE", "PETIT DÉJEUNER"]
};

// Precise item mapping overrides: recipes-data name -> menu-data item name (within mapped categories)
const itemOverrides = {
  // Petit Déjeuner
  "COMPAGNARD": "COMPAGNAD",
  "PETIT DÉJEUNER AMÉRICAIN": "AMERICAIN",
  "CROQUE": "CROQUE MAISON",
  "MENU ENFANT (PDJ)": "MENU ENFANT",
  "MQUILA-MERGUEZ": "MQUILA MERGUEZ",
  "OMELETTE VÉGÉTARIENNE": "OMELETTE VEGETARIENNE",

  // Entrées & Plats
  "Salade Veggie": "CERCLE VEGGI",
  "Salade Russe": "RUSSE",
  "Salade César": "CESAR",
  "Salade Quinoa": "QUINOA",
  "Salade Burrata": "BURRATTA",
  "BOULETTE DE POULET AU FROMAGE": "BOULETTES DE POULET FROMAGE",
  "FILET DE BŒUF": "FILET DE BŒUF AUX HERBES DE L'ATLAS ",
  "PAVÉ DE SAUMON": "PAVÉ DE SAUMON À LA PLANCHA ",
  "ROULADE DE BŒUF VH": "ROULADE DE BŒUF AUX SAVEURS DE L'ATLAS ",
  "MENU ENFANT (PLAT)": "MENU ENFANT",

  // Sandwichs & Paninis
  "POULET CIABATTA": "POULARD",
  "CHEESE STEAK": "SANDWICH CHEESE STEAK",
  "GOURMAND": "WRAP GOURMAND ",
  
  // Pizzas
  "VEGETARIENNE": "VEGETARIENNE",

  // Pâtes
  "PÂTES:5 FROMAGES": "5 FROMAGE",
  "RIGATONI RICOTTA": "REGATONI RICOTTA",
  "POULET CHAMPIGNON / ÉPINARD": "POULET CHAMPIGNON / EPINARD",
  "LASAGNE POULET": "LASAGNE POULET CHAMPIGNON ",
  "LASAGNE BOLOGNAISE": "LASAGNE BOLOGNAISE ",
  "LASAGNE FRUITS DE MER": "LASAGNE FRUIT DE MER ",
  "SPAGHETTIS NOIRS (suppl.)": "SPAGHETTIS NOIRS",

  // Crêpes
  "CRÊPE NUTELLA": "NUTELLA",
  "CRÊPE KUNAFA PISTACHE": "KUNAFA PISTACHE",
  "CRÊPE NORVÉGIENNE": "Crêpe NORVÉGIENNE",
  "CRÊPE POULET CHAMPIGNON": "Crêpe POULET-CHAMPIGNON",
  "CRÊPE CHARCUTERIE": "Crêpe CHARCUTERIE",
  "CRÊPE FROMAGE": "Crêpe FROMAGE",

  // Desserts
  "SAN SEBASTIEN CHEESECAKE": "SAN SEBASTIEN",
  "CHEESECAKE CHOCOLAT": "CHEESECAKE (Chocolat, Pistache, Framboise)",
  "BOULE DE GLACE": "1 Boule de glace",
  "2 BOULES DE GLACE": "2 Boules de glace",

  // Boissons Chaudes
  "CAFÉ NOIR / ESPRESSO": "CAFÉ NOIR",
  "CAFÉ AMÉRICAIN": "CAFÉ AMERICAIN",
  "CAPPUCCINO ITALIEN": "CAPPUCHINO ITALIEN",
  "CAPPUCCINO CHANTILLY": "CAPPUCHINO AVEC CHANTILLY",
  "CHOCOLAT CHAUD": "CHOCOLAT AU LAIT",
  "CHOCOLAT CHAUD CHANTILLY": "CHOCOLAT AVEC CHANTILLY",
  "CHOCOLAT FONDU GOURMAND": "CHOCOLAT FONDUE",
  "THÉ MAROCAIN À LA MENTHE": "THÉ À LA MENTHE",
  "INFUSION BIEN-ÊTRE": "THÉ INFUSION",
  "VERRE DE LAIT": "LAIT FROID / CHAUD",

  // Sodas & Eaux
  "COCA-COLA 33CL": "COCA",
  "COCA-COLA ZÉRO 33CL": "COCA ZERO",
  "SPRITE 33CL": "SPRITE",
  "HAWAÏ 33CL": "HAWAI",
  "POMS 33CL": "POMS",
  "SCHWEPPES CITRON / TONIC 33CL": "SCHWEPPES CITRON/TONIC",
  "ORANGINA 33CL": "ORANGINA",
  "RED BULL 250ML": "REDBULL",
  "EAU MINÉRALE 50CL": "0.5 l",
  "EAU MINÉRALE 75CL": "0.75 l",
  "OULMÈS EAU GAZEUSE 33CL / 50CL": "OULMES",
  "OULMÈS EAU GAZEUSE 75CL": "OULMES 0.75 l",

  // Jus
  "JUS D'ORANGE PRESSÉ": "JUS D'ORANGE",
  "JUS DE CITRON / CITRONNADE": "JUS DE CITRON",
  "JUS POMME & BANANE": "JUS DE POMME / BANANE",
  "JUS D'AVOCAT AU LAIT": "JUS D'AVOCAT",
  "JUS D'AVOCAT ROYAL FRUITS SECS": "JUS DE FRUITS SECS AVOCAT",
  "JUS PANACHÉ FRUITS FRAIS": "PANACHÉ AU LAIT",
  "COCKTAIL À BASE D'ORANGE": "COCKTAIL ORANGE",
  "ZA3ZA3 ROYAL GREY CORNER": "ZA3ZA3",

  // Cafés Glacés & Ice Tea
  "ICE COFFEE CLASSIQUE": "CAFÉ GLACÉ CLASSIQUE",
  "ICE COFFEE AROMATISÉ": "CAFÉ GLACÉ AROMATISÉ",
  "ICE TEA CITRON MAISON": "ICE TEA CITRON",
  "ICE TEA PÊCHE MAISON": "ICE TEA PÊCHE",

  // Cocktails & Mocktails
  "SIGNATURE GREY CORNER": "COCKTAIL GREY CORNER",
  "VIRGIN PIÑA COLADA": "PINA COLADA",
  "COCKTAIL TROPICAL": "TROPICAL",
  "MOJITO VIRGIN / FRAÎCHEUR": "FRAÎCHEUR",
  "DÉTOX GINGEMBRE CITRON": "COCKTAIL GINGEMBRE",
  "COCKTAIL SANS ALCOOL SPÉCIAL": "SAN FRANCISCO",
  "MOJITO RED BULL": "MOJITO REDBULL",

  // Smoothies & Bowls
  "SMOOTHIE PINK BERRY": "PINK SMOOTHIE",
  "SMOOTHIE ÉNERGÉTIQUE": "ÉNERGÉTIQUE",
  "SMOOTHIE HAWAÏ": "HAWAIEN",
  "SMOOTHIE MULTIVITAMINÉ": "MULTI-VITAMINE",
  "SMOOTHIE JELLY FRUIT": "JELLY ALMOND",
  "SMOOTHIE TRIPLE FRUITS": "TRIPLE BERRY",
  "SMOOTHIE BOWL EXOTIQUE": "EXOTIQUE",
  "SMOOTHIE BOWL ULTRA BOOST": "ULTRA – VITAMINES"
};

// Flatten menuData with category metadata
let allMenuItems = [];
menuData.forEach(cat => {
  const catName = typeof cat.category === 'object' ? cat.category.fr : cat.category;
  cat.items.forEach(item => {
    const itemName = typeof item.name === 'object' ? item.name.fr : item.name;
    const priceStr = String(item.price).trim();
    allMenuItems.push({
      category: catName,
      name: itemName,
      price: priceStr,
      raw: item
    });
  });
});

let matchedResults = [];
let diffResults = [];

DATA.forEach(cat => {
  const rCatName = cat.category;
  const targetMenuCats = catMap[rCatName] || [];

  cat.items.forEach(item => {
    const rName = item.name;
    const normR = normalize(rName);

    // Candidates in mapped menu categories first
    const candidateMenuItems = allMenuItems.filter(m => 
      targetMenuCats.some(t => normalize(t) === normalize(m.category))
    );

    let match = null;

    // 1. Explicit override
    const overrideVal = itemOverrides[`${rCatName}:${rName}`] || itemOverrides[rName];
    if (overrideVal) {
      const overrideTarget = normalize(overrideVal);
      match = candidateMenuItems.find(m => normalize(m.name) === overrideTarget);
      if (!match) {
        match = allMenuItems.find(m => normalize(m.name) === overrideTarget);
      }
    }

    // 2. Exact name in candidate categories
    if (!match) {
      match = candidateMenuItems.find(m => normalize(m.name) === normR);
    }

    // 3. Normalized inclusion in candidate categories
    if (!match) {
      match = candidateMenuItems.find(m => {
        const normM = normalize(m.name);
        return normM === normR || (normM.length >= 4 && normR.length >= 4 && (normM.includes(normR) || normR.includes(normM)));
      });
    }

    if (match) {
      const oldPrice = item.price;
      const newPrice = match.price.includes('DH') ? match.price : match.price + ' DH';
      const isDiff = String(oldPrice).trim() !== newPrice.trim();

      matchedResults.push({
        cat: rCatName,
        rName: rName,
        mName: match.name,
        mCat: match.category,
        oldPrice: oldPrice,
        newPrice: newPrice,
        isDiff: isDiff
      });

      if (isDiff) {
        diffResults.push({
          cat: rCatName,
          rName: rName,
          mName: match.name,
          mCat: match.category,
          oldPrice: oldPrice,
          newPrice: newPrice
        });
      }
    } else {
      matchedResults.push({
        cat: rCatName,
        rName: rName,
        mName: null,
        mCat: null,
        oldPrice: item.price,
        newPrice: item.price,
        isDiff: false
      });
    }
  });
});

console.log(`\n======================================================`);
console.log(`TOTAL RECETTES: ${matchedResults.length}`);
console.log(`CORRESPONDANCES EXACTES TROUVÉES: ${matchedResults.filter(m => m.mName).length}`);
console.log(`PRIX À METTRE À JOUR: ${diffResults.length}`);
console.log(`======================================================\n`);

diffResults.forEach(d => {
  console.log(`• [${d.cat}] "${d.rName}": "${d.oldPrice}" -> "${d.newPrice}" (Source Menu [${d.mCat}]: "${d.mName}")`);
});
