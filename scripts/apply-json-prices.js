import fs from 'fs';
import path from 'path';

const recipesDataPath = path.resolve('./recipes-data.js');
let recipesCode = fs.readFileSync(recipesDataPath, 'utf-8');

const categoryItemPriceMap = {
  "CAFÉS & BOISSONS CHAUDES": {
    "CAFÉ NOIR / ESPRESSO": "16 DH",
    "CAFÉ AMÉRICAIN": "17 DH",
    "CAFÉ AU LAIT": "19 DH",
    "CAFÉ LATTE": "19 DH",
    "CAPPUCCINO ITALIEN": "19 DH",
    "CAPPUCCINO CHANTILLY": "22 DH",
    "CAFÉ NESPRESSO": "22 DH",
    "CAFÉ NESPRESSO AU LAIT": "22 DH",
    "CAFÉ NESPRESSO CARAMEL": "25 DH",
    "CAFÉ NESPRESSO NOISETTE": "28 DH",
    "CHOCOLAT CHAUD": "18 DH",
    "CHOCOLAT CHAUD CHANTILLY": "22 DH",
    "CHOCOLAT FONDU GOURMAND": "26 DH",
    "THÉ MAROCAIN À LA MENTHE": "16 DH",
    "THÉ NOIR": "15 DH",
    "THÉ NOIR AU LAIT": "18 DH",
    "VERVEINE NATURE": "15 DH",
    "INFUSION BIEN-ÊTRE": "18 DH",
    "VERVEINE AROMATISÉE": "18 DH",
    "VERRE DE LAIT": "12 DH",
    "LAIT CASSÉ": "19 DH",
    "CAFÉ SÉPARÉ": "24 DH",
    "CAFÉ MOITIÉ": "19 DH"
  },
  "CAFÉS GLACÉS & FRAPPÉS": {
    "ICE COFFEE CLASSIQUE": "20 DH",
    "ICE COFFEE AROMATISÉ": "23 DH",
    "FRAPPUCCINO CLASSIQUE": "25 DH",
    "FRAPPUCCINO AROMATISÉ": "28 DH"
  },
  "ICE TEA MAISON": {
    "ICE TEA PÊCHE MAISON": "28 DH",
    "ICE TEA CITRON MAISON": "28 DH",
    "ICE TEA FRAMBOISE MAISON": "28 DH"
  },
  "JUS FRAIS PRESSÉS & ROYAUX": {
    "JUS D'ORANGE PRESSÉ": "22 DH",
    "JUS DE CITRON / CITRONNADE": "25 DH",
    "JUS POMME & BANANE": "28 DH",
    "JUS DE FRAISE": "30 DH",
    "JUS DE FRAMBOISE": "35 DH",
    "JUS D'ANANAS": "32 DH",
    "JUS DE PÊCHE": "30 DH",
    "JUS DE CAROTTE": "25 DH",
    "JUS D'AVOCAT AU LAIT": "32 DH",
    "JUS D'AVOCAT ROYAL FRUITS SECS": "38 DH",
    "JUS PANACHÉ FRUITS FRAIS": "38 DH",
    "COCKTAIL À BASE D'ORANGE": "42 DH",
    "ZA3ZA3 ROYAL GREY CORNER": "46 DH"
  },
  "COCKTAILS & MOCKTAILS": {
    "SIGNATURE GREY CORNER": "48 DH",
    "VIRGIN PIÑA COLADA": "42 DH",
    "COCKTAIL TROPICAL": "42 DH",
    "MOJITO VIRGIN / FRAÎCHEUR": "42 DH",
    "DÉTOX GINGEMBRE CITRON": "32 DH",
    "COCKTAIL SANS ALCOOL SPÉCIAL": "34 DH",
    "MOJITO RED BULL": "44 DH",
    "MOJITO TROPICAL": "38 DH",
    "MOJITO CITRON": "34 DH"
  },
  "SMOOTHIES & BOWLS": {
    "SMOOTHIE PINK BERRY": "48 DH",
    "SMOOTHIE ÉNERGÉTIQUE": "42 DH",
    "SMOOTHIE HAWAÏ": "42 DH",
    "SMOOTHIE MULTIVITAMINÉ": "42 DH",
    "SMOOTHIE JELLY FRUIT": "48 DH",
    "SMOOTHIE TRIPLE FRUITS": "48 DH",
    "SMOOTHIE BOWL EXOTIQUE": "48 DH",
    "SMOOTHIE BOWL ULTRA BOOST": "48 DH"
  },
  "SODAS & BOISSONS FRAÎCHES": {
    "COCA-COLA 33CL": "17 DH",
    "COCA-COLA ZÉRO 33CL": "17 DH",
    "SPRITE 33CL": "17 DH",
    "HAWAÏ 33CL": "17 DH",
    "POMS 33CL": "17 DH",
    "SCHWEPPES CITRON / TONIC 33CL": "17 DH",
    "ORANGINA 33CL": "17 DH",
    "RED BULL 250ML": "28 DH"
  },
  "EAUX MINÉRALES & GAZEUSES": {
    "EAU MINÉRALE 33CL": "10 DH",
    "EAU MINÉRALE 50CL": "12 DH",
    "EAU MINÉRALE 75CL": "22 DH",
    "OULMÈS EAU GAZEUSE 33CL / 50CL": "16 DH",
    "OULMÈS EAU GAZEUSE 75CL": "26 DH"
  },
  "PETIT DÉJEUNER": {
    "BRUNCH DUO": "144 DH",
    "BRUNCH GREYCORNER": "85 DH",
    "PETIT DÉJEUNER AMÉRICAIN": "68 DH",
    "NORVÉGIEN": "68 DH",
    "ESPAGNOL": "64 DH",
    "MQUILA-MERGUEZ": "64 DH",
    "MQUILA-FRUITS DE MER": "78 DH",
    "OMELETTE DU CHEF": "58 DH",
    "HOLLANDAIS": "52 DH",
    "OMELETTE VÉGÉTARIENNE": "52 DH",
    "BERBÈRE": "54 DH",
    "COMPAGNARD": "52 DH",
    "FASSI": "55 DH",
    "OMELETTE CONTINENTAL": "52 DH",
    "OMELETTE FROMAGE": "52 DH",
    "BELDI": "45 DH",
    "OMELETTE NATURE": "42 DH",
    "LIGHT": "42 DH",
    "EXPRESS": "44 DH",
    "CROQUE": "50 DH",
    "MENU ENFANT (PDJ)": "40 DH"
  },
  "ENTRÉES FROIDES": {
    "Salade Veggie": "48 DH",
    "Salade Russe": "54 DH",
    "Salade César": "65 DH",
    "Salade Quinoa": "68 DH",
    "Salade Terre & Mer": "78 DH",
    "Salade Burrata": "98 DH"
  },
  "ENTRÉES CHAUDES": {
    "BOULETTE DE POULET AU FROMAGE": "52 DH",
    "CROUSTILLON GAMBAS": "68 DH",
    "PIL PIL ESPAGNOL": "68 DH"
  },
  "PLATS": {
    "BROCHETTES DE POULET": "84 DH",
    "EMINCE DE POULET": "88 DH",
    "BALLOTINE DE POULET": "94 DH",
    "SUPRÊME DE POULET": "98 DH",
    "EMINCE DE BŒUF": "103 DH",
    "FILET DE BŒUF": "135 DH",
    "PAVÉ DE SAUMON": "145 DH",
    "MENU ENFANT (PLAT)": "58 DH",
    "ROULADE DE BŒUF VH": "120 DH"
  },
  "BURGERS": {
    "CHICKEN BURGER": "50 DH",
    "CHEESEBURGER": "52 DH",
    "EGG ET CHEESEBURGER": "56 DH",
    "BURGER ROYAL": "70 DH"
  },
  "PANINIS": {
    "CHARCUTERIE": "40 DH",
    "POULET": "44 DH",
    "VIANDE HACHÉE": "54 DH",
    "GOURMAND": "64 DH",
    "FRUITS DE MER": "64 DH",
    "SAUMON": "64 DH"
  },
  "SANDWICHS": {
    "FRUITS DE MER": "65 DH",
    "THON": "48 DH",
    "POULET": "48 DH",
    "POULET CRUNCHY": "58 DH",
    "CHEESE STEAK": "65 DH",
    "VIANDE HACHÉE": "54 DH",
    "POULET CIABATTA": "54 DH"
  },
  "PIZZA": {
    "MARGARITA": "52 DH",
    "THON": "65 DH",
    "VÉGÉTARIENNE": "62 DH",
    "REGINA": "68 DH",
    "5 FROMAGES": "78 DH",
    "VIANDE HACHÉE": "78 DH",
    "PEPPERONI": "74 DH",
    "POULET SAUCE BLANCHE": "78 DH",
    "4 SAISONS": "88 DH",
    "MOITIÉ MOITIÉ": "88 DH",
    "BURRATA": "110 DH",
    "FRUITS DE MER": "88 DH",
    "SAUMON": "94 DH"
  },
  "PÂTES": {
    "LASAGNE POULET": "60 DH",
    "LASAGNE BOLOGNAISE": "72 DH",
    "LASAGNE FRUITS DE MER": "78 DH",
    "VÉGÉTARIEN": "60 DH",
    "CARBONARA": "65 DH",
    "5 FROMAGES": "70 DH",
    "RIGATONI RICOTTA": "68 DH",
    "BOLOGNAISE": "75 DH",
    "POULET CHAMPIGNON / ÉPINARD": "75 DH",
    "FRUITS DE MER": "88 DH",
    "SAUMON": "98 DH",
    "SPAGHETTIS NOIRS (suppl.)": "5 DH"
  },
  "DESSERTS & PÂTISSERIES": {
    "SAN SEBASTIEN CHEESECAKE": "45 DH",
    "FONDANT AU CHOCOLAT": "40 DH",
    "CHEESECAKE CHOCOLAT": "45 DH",
    "BOULE DE GLACE": "16 DH",
    "2 BOULES DE GLACE": "30 DH",
    "3 BOULES DE GLACE": "35 DH"
  },
  "CRÊPES": {
    "CRÊPE NUTELLA": "38 DH",
    "CRÊPE KUNAFA PISTACHE": "48 DH",
    "CRÊPE FROMAGE": "45 DH",
    "CRÊPE POULET CHAMPIGNON": "48 DH",
    "CRÊPE CHARCUTERIE": "45 DH",
    "CRÊPE NORVÉGIENNE": "58 DH"
  }
};

// 1. Locate DATA in recipes-data.js
const prefix = "const DATA = ";
const dataStartIndex = recipesCode.indexOf(prefix);
if (dataStartIndex === -1) {
  console.error("DATA start not found");
  process.exit(1);
}

const section2Marker = "const BASE_RECIPES = ";
const dataEndIndex = recipesCode.indexOf(section2Marker);
if (dataEndIndex === -1) {
  console.error("Section 2 marker not found");
  process.exit(1);
}

eval(recipesCode);
const DATA = globalThis.DATA;

let updateCount = 0;

DATA.forEach(cat => {
  const itemMap = categoryItemPriceMap[cat.category];
  if (itemMap) {
    cat.items.forEach(item => {
      if (itemMap[item.name] !== undefined) {
        if (item.price !== itemMap[item.name]) {
          console.log(`[${cat.category}] "${item.name}": "${item.price}" -> "${itemMap[item.name]}"`);
          item.price = itemMap[item.name];
          updateCount++;
        }
      }
    });
  }
});

console.log(`\nTotal updated items: ${updateCount}`);

const formattedDATA = JSON.stringify(DATA, null, 2);

const newFullCode = recipesCode.slice(0, dataStartIndex + prefix.length) + formattedDATA + ";\n\n" + recipesCode.slice(dataEndIndex);

fs.writeFileSync(recipesDataPath, newFullCode, 'utf-8');
console.log("Updated recipes-data.js successfully!");
