
global.document = {
  addEventListener: () => {},
  getElementById: (id) => ({
    id,
    addEventListener: () => {},
    classList: { add: () => {}, remove: () => {} },
    style: {},
    innerHTML: '',
    value: ''
  }),
  querySelector: () => ({ dataset: { cat: 'all' }, classList: { add: () => {}, remove: () => {} } }),
  querySelectorAll: () => []
};
global.localStorage = { getItem: () => null, setItem: () => {} };
global.window = {};
global.fetch = async () => ({ ok: false });
global.XLSX = { utils: { book_new: () => {}, json_to_sheet: () => {}, book_append_sheet: () => {}, aoa_to_sheet: () => {} }, writeFile: () => {} };

/* ========================================================
   1. BASE DE DONNÉES COMPLÈTE DES FICHES TECHNIQUES
======================================================== */
const BASE_RECIPES = [
  {
    "id": "bc_cafe_noir_espresso",
    "name": "CAFÉ NOIR / ESPRESSO",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 8 g",
      "Eau chaude : 60 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_cafe_americain",
    "name": "CAFÉ AMÉRICAIN",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 8 g",
      "Eau chaude : 150 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_cafe_au_lait",
    "name": "CAFÉ AU LAIT",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 8 g",
      "Lait chaud : 120 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_cafe_latte",
    "name": "CAFÉ LATTE",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 8 g",
      "Lait chaud : 180 ml",
      "Mousse de lait : 30 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_cappuccino_italien",
    "name": "CAPPUCCINO ITALIEN",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 8 g",
      "Lait chaud : 100 ml",
      "Mousse de lait : 50 ml",
      "Cacao en poudre : 3 g",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_cappuccino_chantilly",
    "name": "CAPPUCCINO CHANTILLY",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 8 g",
      "Lait chaud : 100 ml",
      "Crème chantilly : 30 g",
      "Cacao : 3 g",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_cafe_nespresso",
    "name": "CAFÉ NESPRESSO",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Pastille Nespresso : 1 p",
      "Eau chaude : 50 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_chocolat_chaud",
    "name": "CHOCOLAT CHAUD",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Chocolat en poudre : 30 g",
      "Lait chaud : 200 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_chocolat_chaud_chantilly",
    "name": "CHOCOLAT CHAUD CHANTILLY",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Chocolat en poudre : 30 g",
      "Lait chaud : 180 ml",
      "Crème chantilly : 35 g",
      "Coulis chocolat : 10 ml",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_chocolat_fondu_gourmand",
    "name": "CHOCOLAT FONDU GOURMAND",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Chocolat noir fondu : 45 g",
      "Lait chaud : 180 ml",
      "Guimauves : 15 g",
      "Chantilly : 30 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_the_marocain_a_la_menthe",
    "name": "THÉ MAROCAIN À LA MENTHE",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Thé vert Gunpowder : 10 g",
      "Menthe fraîche : 20 g",
      "Sucre : 25 g",
      "Eau bouillante : 300 ml",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_the_noir",
    "name": "THÉ NOIR",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Thé noir : 8 g",
      "Eau bouillante : 250 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_the_noir_au_lait",
    "name": "THÉ NOIR AU LAIT",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Thé noir : 8 g",
      "Lait chaud : 120 ml",
      "Eau : 130 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_verveine_nature",
    "name": "VERVEINE NATURE",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Verveine séchée : 10 g",
      "Eau chaude : 250 ml",
      "Miel / Sucre : 20 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_verveine_aromatisee",
    "name": "VERVEINE AROMATISÉE",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Verveine séchée : 10 g",
      "Fleur d'oranger : 5 ml",
      "Zeste de citron : 5 g",
      "Eau chaude : 250 ml",
      "Miel : 20 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_infusion_bien_etre",
    "name": "INFUSION BIEN-ÊTRE",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Mélange plantes infusion : 10 g",
      "Eau chaude : 250 ml",
      "Miel : 20 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_verre_de_lait",
    "name": "VERRE DE LAIT",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Lait entier frais : 250 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_lait_casse",
    "name": "LAIT CASSÉ",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 8 g",
      "Lait chaud : 150 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_cafe_separe",
    "name": "CAFÉ SÉPARÉ",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 8 g",
      "Lait chaud : 100 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_cafe_moitie",
    "name": "CAFÉ MOITIÉ",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 8 g",
      "Lait chaud : 80 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "fg_ice_coffee_classique",
    "name": "ICE COFFEE CLASSIQUE",
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "ingredients": [
      "Café espresso : 8 g",
      "Lait froid : 100 ml",
      "Sirop de canne : 20 ml",
      "Glaçons : 120 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "fg_ice_coffee_aromatise",
    "name": "ICE COFFEE AROMATISÉ",
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "ingredients": [
      "Café espresso : 8 g",
      "Sirop Caramel / Vanille : 25 ml",
      "Lait froid : 120 ml",
      "Glaçons : 120 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "fg_frappuccino_classique",
    "name": "FRAPPUCCINO CLASSIQUE",
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "ingredients": [
      "Café espresso : 8 g",
      "Lait : 120 ml",
      "Base frappé vanille : 25 g",
      "Glace pilée : 150 g",
      "Crème chantilly : 30 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "fg_frappuccino_aromatise",
    "name": "FRAPPUCCINO AROMATISÉ",
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "ingredients": [
      "Café espresso : 8 g",
      "Lait : 120 ml",
      "Sirop Noisette / Caramel : 30 ml",
      "Glace pilée : 150 g",
      "Chantilly & Nappage : 35 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "it_ice_tea_peche_maison",
    "name": "ICE TEA PÊCHE MAISON",
    "category": "ICE TEA MAISON",
    "ingredients": [
      "Infusion thé noir : 200 ml",
      "Sirop de pêche : 30 ml",
      "Jus de citron : 15 ml",
      "Pêche fraîche : 30 g",
      "Glaçons : 100 g"
    ]
  },
  {
    "id": "it_ice_tea_citron_maison",
    "name": "ICE TEA CITRON MAISON",
    "category": "ICE TEA MAISON",
    "ingredients": [
      "Infusion thé vert : 200 ml",
      "Jus de citron pressé : 30 ml",
      "Sirop de canne : 25 ml",
      "Rondelles de citron : 2 tr",
      "Glaçons : 100 g"
    ]
  },
  {
    "id": "it_ice_tea_framboise_maison",
    "name": "ICE TEA FRAMBOISE MAISON",
    "category": "ICE TEA MAISON",
    "ingredients": [
      "Infusion thé fruits rouges : 200 ml",
      "Purée de framboise : 35 g",
      "Jus de citron : 15 ml",
      "Framboises fraîches : 20 g",
      "Glaçons : 100 g"
    ]
  },
  {
    "id": "jf_jus_d_orange_presse",
    "name": "JUS D'ORANGE PRESSÉ",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Oranges fraîches à jus : 380 g"
    ]
  },
  {
    "id": "jf_jus_de_citron_citronnade",
    "name": "JUS DE CITRON / CITRONNADE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Citron pressé : 120 g",
      "Sirop de canne : 30 ml",
      "Eau filtrée & Glaçons : 150 ml",
      "Menthe fraîche : 5 g"
    ]
  },
  {
    "id": "jf_jus_de_fraise",
    "name": "JUS DE FRAISE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Fraises fraîches : 220 g",
      "Jus d'orange frais : 80 ml",
      "Sirop de sucre : 15 ml"
    ]
  },
  {
    "id": "jf_jus_de_framboise",
    "name": "JUS DE FRAMBOISE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Framboises fraîches : 200 g",
      "Jus d'orange : 80 ml",
      "Sirop de sucre : 20 ml"
    ]
  },
  {
    "id": "jf_jus_de_mangue",
    "name": "JUS DE MANGUE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Mangue fraîche : 220 g",
      "Jus d'orange frais : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  {
    "id": "jf_jus_d_ananas",
    "name": "JUS D'ANANAS",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Ananas frais : 250 g",
      "Glaçons : 50 g"
    ]
  },
  {
    "id": "jf_jus_de_peche",
    "name": "JUS DE PÊCHE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Pêche fraîche : 220 g",
      "Jus d'orange frais : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  {
    "id": "jf_jus_de_carotte",
    "name": "JUS DE CAROTTE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Carottes fraîches : 350 g",
      "Jus d'orange frais : 50 ml"
    ]
  },
  {
    "id": "jf_jus_pomme_banane",
    "name": "JUS POMME & BANANE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Pomme fraîche : 150 g",
      "Banane : 120 g",
      "Lait ou Jus d'orange : 100 ml"
    ]
  },
  {
    "id": "jf_jus_d_avocat_au_lait",
    "name": "JUS D'AVOCAT AU LAIT",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Avocat Hass : 160 g",
      "Lait entier frais : 200 ml",
      "Sucre : 20 g"
    ]
  },
  {
    "id": "jf_jus_d_avocat_royal_fruits_secs",
    "name": "JUS D'AVOCAT ROYAL FRUITS SECS",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Avocat Hass : 160 g",
      "Lait entier : 200 ml",
      "Miel pur : 25 g",
      "Amandes, Noix, Raisins secs : 40 g"
    ]
  },
  {
    "id": "jf_jus_panache_fruits_frais",
    "name": "JUS PANACHÉ FRUITS FRAIS",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Jus d'orange : 100 ml",
      "Banane : 80 g",
      "Fraise : 60 g",
      "Pomme : 60 g",
      "Avocat : 40 g"
    ]
  },
  {
    "id": "jf_cocktail_a_base_d_orange",
    "name": "COCKTAIL À BASE D'ORANGE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Jus d'orange frais : 180 ml",
      "Sirop de grenadine : 20 ml",
      "Fraise fraîche : 50 g",
      "Ananas frais : 50 g"
    ]
  },
  {
    "id": "jf_za3za3_royal_grey_corner",
    "name": "ZA3ZA3 ROYAL GREY CORNER",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Avocat : 150 g",
      "Lait : 180 ml",
      "Chocolat KitKat / Snickers : 1 p",
      "Fruits secs variés : 50 g",
      "Biscuits Oreo : 2 p",
      "Crème chantilly : 35 g",
      "Coulis caramel : 15 ml"
    ]
  },
  {
    "id": "ck_signature_grey_corner",
    "name": "SIGNATURE GREY CORNER",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Jus d'ananas : 100 ml",
      "Jus de mangue : 80 ml",
      "Purée de fraise : 40 ml",
      "Jus de citron vert : 20 ml",
      "Sirop de passion : 20 ml",
      "Fruits frais décor : 30 g"
    ]
  },
  {
    "id": "ck_virgin_pi_a_colada",
    "name": "VIRGIN PIÑA COLADA",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Jus d'ananas frais : 180 ml",
      "Crème de coco : 60 ml",
      "Lait de coco : 40 ml",
      "Glaçons : 100 g",
      "Tranche d'ananas : 1 tr"
    ]
  },
  {
    "id": "ck_cocktail_tropical",
    "name": "COCKTAIL TROPICAL",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Jus de mangue : 80 ml",
      "Jus d'ananas : 80 ml",
      "Jus d'orange : 60 ml",
      "Sirop de grenadine : 15 ml",
      "Glaçons : 80 g"
    ]
  },
  {
    "id": "ck_mojito_virgin_fraicheur",
    "name": "MOJITO VIRGIN / FRAÎCHEUR",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Citron vert frais : 1 p (40 g)",
      "Menthe fraîche : 15 g",
      "Sucre de canne : 20 g",
      "Eau gazeuse Oulmès : 150 ml",
      "Glace pilée : 120 g"
    ]
  },
  {
    "id": "ck_detox_gingembre_citron",
    "name": "DÉTOX GINGEMBRE CITRON",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Gingembre frais râpé : 15 g",
      "Jus de citron pressé : 60 ml",
      "Miel pur d'abeille : 25 g",
      "Pomme verte : 100 g",
      "Eau minérale : 100 ml"
    ]
  },
  {
    "id": "ck_cocktail_sans_alcool_special",
    "name": "COCKTAIL SANS ALCOOL SPÉCIAL",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Jus d'orange : 100 ml",
      "Jus de pêche : 80 ml",
      "Purée de framboise : 30 ml",
      "Sprite : 60 ml",
      "Glaçons : 80 g"
    ]
  },
  {
    "id": "ck_mojito_tropical",
    "name": "MOJITO TROPICAL",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Citron vert : 30 g",
      "Menthe fraîche : 15 g",
      "Mangue / Passion : 60 ml",
      "Eau gazeuse Oulmès : 150 ml",
      "Glace pilée : 120 g"
    ]
  },
  {
    "id": "ck_mojito_red_bull",
    "name": "MOJITO RED BULL",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Citron vert : 30 g",
      "Menthe fraîche : 15 g",
      "Red Bull (Canette 250ml) : 1 p",
      "Glace pilée : 120 g"
    ]
  },
  {
    "id": "ck_mojito_citron",
    "name": "MOJITO CITRON",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Citron vert : 40 g",
      "Menthe fraîche : 15 g",
      "Sucre de canne : 20 g",
      "Eau gazeuse Oulmès : 150 ml",
      "Glace pilée : 120 g"
    ]
  },
  {
    "id": "sm_smoothie_pink_berry",
    "name": "SMOOTHIE PINK BERRY",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Fraises fraîches : 100 g",
      "Framboises : 60 g",
      "Yaourt grec nature : 100 g",
      "Jus de pomme : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  {
    "id": "sm_smoothie_energetique",
    "name": "SMOOTHIE ÉNERGÉTIQUE",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Banane : 120 g",
      "Dattes Medjool : 40 g",
      "Flocons d'avoine : 30 g",
      "Lait d'amande : 180 ml",
      "Beurre de cacahuète : 20 g"
    ]
  },
  {
    "id": "sm_smoothie_hawai",
    "name": "SMOOTHIE HAWAÏ",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Mangue fraîche : 100 g",
      "Ananas frais : 100 g",
      "Fruit de la passion : 30 g",
      "Jus d'orange : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  {
    "id": "sm_smoothie_multivitamine",
    "name": "SMOOTHIE MULTIVITAMINÉ",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Jus d'orange frais : 100 ml",
      "Carotte : 80 g",
      "Pomme : 80 g",
      "Gingembre frais : 5 g",
      "Glaçons : 50 g"
    ]
  },
  {
    "id": "sm_smoothie_jelly_fruit",
    "name": "SMOOTHIE JELLY FRUIT",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Fruits rouges : 120 g",
      "Banane : 80 g",
      "Jus de cranberry : 80 ml",
      "Perles de fruits Popping Boba : 30 g"
    ]
  },
  {
    "id": "sm_smoothie_triple_fruits",
    "name": "SMOOTHIE TRIPLE FRUITS",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Fraise : 70 g",
      "Mangue : 70 g",
      "Kiwi frais : 70 g",
      "Jus d'orange : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  {
    "id": "sm_smoothie_bowl_exotique",
    "name": "SMOOTHIE BOWL EXOTIQUE",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Base mixée Mangue/Banane/Passion : 250 g",
      "Granola croustillant : 40 g",
      "Kiwi frais : 30 g",
      "Graines de chia : 10 g",
      "Noix de coco râpée : 10 g"
    ]
  },
  {
    "id": "sm_smoothie_bowl_ultra_boost",
    "name": "SMOOTHIE BOWL ULTRA BOOST",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Base mixée Açaï/Fruits rouges : 250 g",
      "Banane : 50 g",
      "Granola croustillant : 40 g",
      "Myrtilles & Framboises : 30 g",
      "Graines de chia : 10 g",
      "Amandes effilées : 15 g"
    ]
  },
  {
    "id": "sd_coca_cola_33cl",
    "name": "COCA-COLA 33CL",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Coca-Cola (Canette 33cl) : 1 p",
      "Tranche de citron : 1 tr",
      "Glaçons"
    ]
  },
  {
    "id": "sd_coca_cola_zero_33cl",
    "name": "COCA-COLA ZÉRO 33CL",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Coca-Cola Zéro (Canette 33cl) : 1 p",
      "Tranche de citron : 1 tr",
      "Glaçons"
    ]
  },
  {
    "id": "sd_sprite_33cl",
    "name": "SPRITE 33CL",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Sprite (Canette 33cl) : 1 p",
      "Tranche de citron : 1 tr",
      "Glaçons"
    ]
  },
  {
    "id": "sd_hawai_33cl",
    "name": "HAWAÏ 33CL",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Hawaï Canette : 33 cl",
      "Glaçons"
    ]
  },
  {
    "id": "sd_poms_33cl",
    "name": "POMS 33CL",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Poms (Canette 33cl) : 1 p",
      "Glaçons"
    ]
  },
  {
    "id": "sd_schweppes_citron_tonic_33cl",
    "name": "SCHWEPPES CITRON / TONIC 33CL",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Schweppes (Canette 33cl) : 1 p",
      "Tranche de citron : 1 tr",
      "Glaçons"
    ]
  },
  {
    "id": "sd_orangina_33cl",
    "name": "ORANGINA 33CL",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Orangina (Canette 33cl) : 1 p",
      "Tranche d'orange : 1 tr",
      "Glaçons"
    ]
  },
  {
    "id": "sd_red_bull_250ml",
    "name": "RED BULL 250ML",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Red Bull (Canette 250ml) : 1 p",
      "Glaçons"
    ]
  },
  {
    "id": "ea_eau_minerale_33cl",
    "name": "EAU MINÉRALE 33CL",
    "category": "EAUX MINÉRALES & GAZEUSES",
    "ingredients": [
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "ea_eau_minerale_50cl",
    "name": "EAU MINÉRALE 50CL",
    "category": "EAUX MINÉRALES & GAZEUSES",
    "ingredients": [
      "Bouteille Eau Minérale 50cl : 1 p"
    ]
  },
  {
    "id": "ea_eau_minerale_75cl",
    "name": "EAU MINÉRALE 75CL",
    "category": "EAUX MINÉRALES & GAZEUSES",
    "ingredients": [
      "Bouteille Eau Minérale 75cl : 1 p"
    ]
  },
  {
    "id": "ea_oulmes_eau_gazeuse_33cl_50cl",
    "name": "OULMÈS EAU GAZEUSE 33CL / 50CL",
    "category": "EAUX MINÉRALES & GAZEUSES",
    "ingredients": [
      "Bouteille Oulmès 33/50cl : 1 p",
      "Tranche de citron : 1 tr"
    ]
  },
  {
    "id": "ea_oulmes_eau_gazeuse_75cl",
    "name": "OULMÈS EAU GAZEUSE 75CL",
    "category": "EAUX MINÉRALES & GAZEUSES",
    "ingredients": [
      "Bouteille Oulmès 75cl : 1 p",
      "Tranches de citron : 2 tr"
    ]
  },
  {
    "id": "pdj_compagnard",
    "name": "COMPAGNARD",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "pain cake : 2 p",
      "Omelette : 3 œufs",
      "Fromage : 30 g",
      "Charcuteries : 60 g",
      "Pain seigle : 2 tr",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_petit_dejeuner_americain",
    "name": "PETIT DÉJEUNER AMÉRICAIN",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Bacon : 2 p",
      "Omelette : 2 œufs",
      "Fromage : 30 g",
      "avocat : 60 g",
      "Pain seigle : 2 tr",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_brunch_greycorner",
    "name": "BRUNCH GREYCORNER",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Saucisses : 2 p",
      "Omelette : 3 œufs",
      "Fromage : 30 g",
      "Toast hollandais : 2 p",
      "Croquettes fromage : 2 p",
      "Charcuteries : 60 g",
      "Pain seigle : 2 tr",
      "Mesclun : 40 g",
      "Gaufre : 1 p",
      "Pancake : 1 p",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_brunch_duo",
    "name": "BRUNCH DUO",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Poulet pané : 120 g",
      "Croquettes : 2 p",
      "Croque maison : 1 p",
      "Omelette fromage : 2 œufs",
      "Charcuterie : 80 g",
      "Fromage : 60 g",
      "Pain seigle : 2 tr",
      "Beldi : 2 mlaoui + 2 harcha",
      "Mesclun : 40 g",
      "Muffin : 1 p",
      "Gaufre : 1 p",
      "Jus d'orange : 2×200 ml",
      "Boissons chaudes : 2 p",
      "Desserts : 2 p",
      "Bouteille Eau Minérale 33cl : 2 p"
    ]
  },
  {
    "id": "pdj_beldi",
    "name": "BELDI",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Mlaoui : 2 p",
      "Harcha : 2 p",
      "Baghrir : 1 p",
      "Jben : 40 g",
      "Huile d’olive : 20 ml",
      "Miel : 20 g",
      "Olives : 20 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_hollandais",
    "name": "HOLLANDAIS",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Pain mie complet : 2 tr",
      "Œufs au plat : 2 p",
      "Fromage : 40 g",
      "Dinde fumée : 40 g",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_omelette_vegetarienne",
    "name": "OMELETTE VÉGÉTARIENNE",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Œufs : 3 p",
      "Légumes : 120 g",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_berbere",
    "name": "BERBÈRE",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Baghrir : 1 p",
      "Amlou : 30 g",
      "Fruits secs : 30 g",
      "Jben : 40 g",
      "Miel : 20 g",
      "Banane : 1 p",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_croque",
    "name": "CROQUE",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Croque maison : 1 p",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_fassi",
    "name": "FASSI",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Khli3 : 80 g",
      "Œufs au plat : 3 p",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_omelette_continental",
    "name": "OMELETTE CONTINENTAL",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Œufs : 3 p",
      "Charcuterie : 60 g",
      "Fromage : 40 g",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_omelette_fromage",
    "name": "OMELETTE FROMAGE",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Œufs : 3 p",
      "Fromage : 40 g",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_omelette_nature",
    "name": "OMELETTE NATURE",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Œufs : 3 p",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_omelette_du_chef",
    "name": "OMELETTE DU CHEF",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Œufs : 3 p",
      "Champignons : 40 g",
      "Épinards : 30 g",
      "Fromage : 30 g",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_espagnol",
    "name": "ESPAGNOL",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Tortilla : 1 p",
      "Croquettes : 2 p",
      "Tapenade : 20 g",
      "Thon : 40 g",
      "Tomates : 60 g",
      "Fromage : 40 g",
      "Pain seigle : 2 tr",
      "Mesclun : 40 g",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_mquila_merguez",
    "name": "MQUILA-MERGUEZ",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Merguez : 120 g",
      "Poivrons/oignons : 120 g",
      "Œufs : 2 p",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_mquila_fruits_de_mer",
    "name": "MQUILA-FRUITS DE MER",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "crevettes : 100 g",
      "calamars : 100 g",
      "moules : 100 g",
      "Œufs : 2 p",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_norvegien",
    "name": "NORVÉGIEN",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Saumon : 60 g",
      "Avocat : 50 g",
      "Fromage : 30 g",
      "Pain céréales : 2 tr",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_light",
    "name": "LIGHT",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Pain complet : 2 tr",
      "Jben : 40 g",
      "Huile d’olive : 20 ml",
      "Amlou : 20 g",
      "Olives : 20 g",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_express",
    "name": "EXPRESS",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Viennoiseries : 4 p",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pdj_menu_enfant_pdj",
    "name": "MENU ENFANT (PDJ)",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Crêpe/Gaufre/Pancake : 1 p",
      "Corn flakes : 1 bol",
      "Lait chocolat : 200 ml"
    ]
  },
  {
    "id": "ef_salade_veggie",
    "name": "Salade Veggie",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "Salade Rouge : 100 g",
      "Concombre : 80 g",
      "Tomate Cerise : 70 g",
      "Œufs de Caille : 1 p",
      "Haricot Vert : 60 g",
      "Betterave : 120 g",
      "Carotte : 40 g",
      "Brocoli : 50 g",
      "Radis : 60 g",
      "Thon : 50 g",
      "Sauce Vinaigrette : 200 g",
      "Maïs : 30 g",
      "Poivron : 50 g"
    ]
  },
  {
    "id": "ef_salade_russe",
    "name": "Salade Russe",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "Pomme de Terre : 200 g",
      "Carotte : 100 g",
      "Poulet : 25 g",
      "Petit Pois : 50 g",
      "Olive Verte : 15 g",
      "Cornichon : 24 g",
      "Œufs de Caille : 1 p",
      "Mayonnaise : 30 g",
      "Thon : 50 g",
      "Maïs : 15 g",
      "Radis : 14 g",
      "Poivron : 10 g",
      "Concombre : 10 g"
    ]
  },
  {
    "id": "ef_salade_cesar",
    "name": "Salade César",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "Salade Romaine : 180 g",
      "Laitue : 100 g",
      "Poulet : 130 g",
      "Croûtons : 30 g",
      "Tomate Cerise : 60 g",
      "Sauce César : 70 g",
      "Parmesan : 30 g"
    ]
  },
  {
    "id": "ef_salade_quinoa",
    "name": "Salade Quinoa",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "Quinoa : 140 g",
      "Gambas Pané : 60 g",
      "Gambas Poché : 80 g",
      "Fruits : 70 g",
      "Feta : 20 g",
      "Kiwi : 120 g",
      "Vinaigrette : 20 g",
      "Miel : 30 g",
      "Framboise : 17 g"
    ]
  },
  {
    "id": "ef_salade_terre_mer",
    "name": "Salade Terre & Mer",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "Poulet Pané : 50 g",
      "Tomate Cerise : 25 g",
      "Salade Rouge : 25 g",
      "Maïs : 30 g",
      "Gambas Poché : 73 g",
      "Gambas Pané : 30 g",
      "Avocat : 150 g",
      "Sauce Tartare : 30 g",
      "Pomme : 24 g",
      "Moules : 16 g",
      "Agrumes : 15 g"
    ]
  },
  {
    "id": "ef_tartare_saumon",
    "name": "TARTARE SAUMON",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "saumon frais : 90 g",
      "SAUMON FUMEE : 25 g",
      "Avocat : 300 g",
      "SAUCE TARTARE : 24 g"
    ]
  },
  {
    "id": "ef_salade_burrata",
    "name": "Salade Burrata",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "Burrata : 184 g",
      "Noix : 30 g",
      "Roquette : 30 g",
      "Pesto : 15 g",
      "Balsamique : 10 g",
      "Fruits Rouges : 40 g",
      "Radis : 10 g",
      "Tomate Cerise : 25 g"
    ]
  },
  {
    "id": "ec_croquettes_5_fromages",
    "name": "CROQUETTES 5 FROMAGES",
    "category": "ENTRÉES CHAUDES",
    "ingredients": [
      "Mozzarella : 50 g",
      "Edam : 25 g",
      "Brie : 15 g",
      "Parmesan : 15 g",
      "Bleu : 16 g",
      "Lait : 250 ml",
      "Farine : 100 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "ec_croustillon_gambas",
    "name": "CROUSTILLON GAMBAS",
    "category": "ENTRÉES CHAUDES",
    "ingredients": [
      "Gambas panées : 260 g",
      "Purée : 400 g",
      "Radis : 15 g",
      "Parmesan : 14 g",
      "Crème fraîche : 50 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "ec_pil_pil_espagnol",
    "name": "PIL PIL ESPAGNOL",
    "category": "ENTRÉES CHAUDES",
    "ingredients": [
      "Gambas : 260 g",
      "Tomate cerise : 60 g",
      "Pesto : 22 g",
      "Huile d’olive : 30 g",
      "Oignon : 60 g",
      "Ail : 10 g",
      "Sauce tomate : 120 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "pl_brochettes_de_poulet",
    "name": "BROCHETTES DE POULET",
    "category": "PLATS",
    "ingredients": [
      "Blanc de poulet : 200 g",
      "Sauce barbecue : 30 g",
      "Salade rouge : 50 g",
      "Accompagnements — 2 au choix",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "pl_emince_de_poulet",
    "name": "EMINCE DE POULET",
    "category": "PLATS",
    "ingredients": [
      "Poulet : 160 g",
      "Champignons : 90 g",
      "Crème fraîche : 100 ml",
      "Demi-glace : 100 ml",
      "Légumes variés : 220 g",
      "Fokacha : 150 g",
      "Frites : 200 g",
      "Pain : 1 p",
      "Huile : 50 ml"
    ]
  },
  {
    "id": "pl_ballotine_de_poulet",
    "name": "BALLOTINE DE POULET",
    "category": "PLATS",
    "ingredients": [
      "Poulet : 250 g",
      "Épinard : 40 g",
      "Crème fraîche : 70 ml",
      "Parmesan : 20 g",
      "Cheddar : 60 g",
      "Beurre : 30 g",
      "Légumes : 220 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "pl_escalope_a_la_parmigiana",
    "name": "ESCALOPE A LA PARMIGIANA",
    "category": "PLATS",
    "ingredients": [
      "Poulet : 180 g",
      "Parmesan : 30 g",
      "Olive noire : 15 g",
      "Crème fraîche : 100 ml",
      "Moutarde : 10 g",
      "Légumes : 220 g",
      "Frites : 200 g",
      "Pain : 1 p",
      "Beurre : 40 g"
    ]
  },
  {
    "id": "pl_escalope_a_la_milanaise",
    "name": "ESCALOPE A LA MILANAISE",
    "category": "PLATS",
    "ingredients": [
      "Poulet : 120 g",
      "Chapelure : 50 g",
      "Crème fraîche : 70 ml",
      "Moutarde : 10 g",
      "Parmesan : 30 g",
      "Légumes : 220 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "pl_emince_de_boeuf",
    "name": "EMINCE DE BŒUF",
    "category": "PLATS",
    "ingredients": [
      "Bœuf : 150 g",
      "Champignons : 80 g",
      "Crème fraîche : 70 ml",
      "Demi-glace : 60 ml",
      "Légumes : 220 g",
      "Fokacha : 150 g",
      "Frites : 200 g",
      "Pain : 1 p",
      "Huile : 60 ml"
    ]
  },
  {
    "id": "pl_filet_de_boeuf",
    "name": "FILET DE BŒUF",
    "category": "PLATS",
    "ingredients": [
      "Filet : 180 g",
      "Beurre : 40 g",
      "Poivre vert : 20 g",
      "Demi-glace : 70 ml",
      "Légumes : 220 g",
      "Fokacha : 150 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "pl_pave_de_saumon",
    "name": "PAVÉ DE SAUMON",
    "category": "PLATS",
    "ingredients": [
      "Saumon : 180 g",
      "Crevette : 80 g",
      "Crème fraîche : 70 ml",
      "Parmesan : 20 g",
      "Beurre : 40 g",
      "Légumes : 220 g",
      "Fokacha : 150 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "pl_menu_enfant_plat",
    "name": "MENU ENFANT (PLAT)",
    "category": "PLATS",
    "ingredients": [
      "Pasta nature ou Mini pizza + boisson",
      "OU Burger / nuggets + frites + boisson"
    ]
  },
  {
    "id": "pl_roulade_de_boeuf_vh",
    "name": "ROULADE DE BŒUF VH",
    "category": "PLATS",
    "ingredients": [
      "Bœuf : 180 g",
      "Viande hachée : 60 g",
      "Fromage : 40 g",
      "Demi-glace : 70 ml",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "bg_chicken_burger",
    "name": "CHICKEN BURGER",
    "category": "BURGERS",
    "ingredients": [
      "poulet : 150 g",
      "Sauce blanche : 40 g",
      "Sauce pesto : 20 g",
      "Cheddar : 20 g",
      "Tomate/Laitue : 30 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "bg_cheese_burger",
    "name": "CHEESE BURGER",
    "category": "BURGERS",
    "ingredients": [
      "Viande Hachée : 100 g",
      "Cheddar : 20 g",
      "Tomate : 30 g",
      "Laitue : 20 g",
      "Oignon+Cornichon : 45 ml",
      "Sauce Bigy : 30 g",
      "Frites + Sauce : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "bg_avocado_forestier",
    "name": "AVOCADO FORESTIER",
    "category": "BURGERS",
    "ingredients": [
      "Poulet : 120 g",
      "Avocat : 50 g",
      "Tomate/Laitue : 30 g",
      "Œuf : 1 p",
      "Chapelure : 50 g",
      "Cheddar : 20 g",
      "Sauce Bigy : 30 g",
      "Frites+Sauce : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "bg_egg_et_cheeseburger",
    "name": "EGG ET CHEESEBURGER",
    "category": "BURGERS",
    "ingredients": [
      "Viande : 100 g",
      "Œuf : 1 p",
      "Champignon : 30 g",
      "Cheddar : 20 g",
      "Tomate/Laitue : 30 g",
      "Sauce Bigy : 30 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "bg_big_burger",
    "name": "BIG BURGER",
    "category": "BURGERS",
    "ingredients": [
      "Viande : 2×100 g",
      "Cheddar : 20 g",
      "Tomate/Laitue : 30 g",
      "Sauce du chef : 30 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "bg_burger_royal",
    "name": "BURGER ROYAL",
    "category": "BURGERS",
    "ingredients": [
      "Viande : 100 g",
      "Poulet pané : 120 g",
      "Œuf : 1 p",
      "Cheddar : 20 g",
      "Oignons caramélisés : 25 g",
      "Laitue/Tomate : 30 g",
      "Sauce spéciale : 30 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "wr_wrap_poulet",
    "name": "WRAP POULET",
    "category": "WRAPS",
    "ingredients": [
      "Poulet : 120 g",
      "Œuf : 1 p",
      "Frites + sauce : 200 g",
      "Chapelure : 50 g",
      "Cheddar : 25 g",
      "Pain : 1 p",
      "Tomate fraîche : 30 g",
      "Sauce burger : 60 ml"
    ]
  },
  {
    "id": "wr_wrap_viande_hachee",
    "name": "WRAP VIANDE HACHÉE",
    "category": "WRAPS",
    "ingredients": [
      "Viande hachée : 100 g",
      "Œuf : 1 p",
      "Frites + sauce : 200 g",
      "Cheddar : 25 g",
      "Pain : 1 p",
      "Tomate fraîche : 30 g",
      "Sauce burger : 60 ml"
    ]
  },
  {
    "id": "wr_wrap_gourmand",
    "name": "WRAP GOURMAND",
    "category": "WRAPS",
    "ingredients": [
      "Poulet : 120 g",
      "Charcuterie : 40 g",
      "Œuf : 1 p",
      "Chapelure : 50 g",
      "Cheddar : 25 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Tomate fraîche : 30 g",
      "Sauce burger : 60 ml"
    ]
  },
  {
    "id": "pa_charcuterie",
    "name": "CHARCUTERIE",
    "category": "PANINIS",
    "ingredients": [
      "Charcuterie : 120 g",
      "Mozzarella : 60 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  {
    "id": "pa_poulet",
    "name": "POULET",
    "category": "PANINIS",
    "ingredients": [
      "Poulet : 70 g",
      "Mozzarella : 60 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  {
    "id": "pa_viande_hachee",
    "name": "VIANDE HACHÉE",
    "category": "PANINIS",
    "ingredients": [
      "Viande : 100 g",
      "Mozzarella : 60 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  {
    "id": "pa_gourmand",
    "name": "GOURMAND",
    "category": "PANINIS",
    "ingredients": [
      "Viande : 50 g",
      "Poulet : 50 g",
      "Charcuterie : 50 g",
      "Mozzarella : 60 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  {
    "id": "pa_fruits_de_mer",
    "name": "FRUITS DE MER",
    "category": "PANINIS",
    "ingredients": [
      "Crevettes : 100 g",
      "Calamar : 50 g",
      "Pesto : 20 g",
      "Mozzarella : 60 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  {
    "id": "pa_saumon",
    "name": "SAUMON",
    "category": "PANINIS",
    "ingredients": [
      "Saumon : 90 g",
      "Pesto : 20 g",
      "Mozzarella : 60 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  {
    "id": "sw_fruits_de_mer",
    "name": "FRUITS DE MER",
    "category": "SANDWICHS",
    "ingredients": [
      "Crevette : 125 g",
      "Calamar : 70 g",
      "Sauce Biggy : 40 g",
      "Cheddar : 20 g",
      "Crème fraîche : 60 ml",
      "Sauce fromagère : 20 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "sw_thon",
    "name": "THON",
    "category": "SANDWICHS",
    "ingredients": [
      "Thon : 120 g",
      "Tomate : 30 g",
      "Sauce burger : 40 ml",
      "Cheddar : 20 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "sw_poulet",
    "name": "POULET",
    "category": "SANDWICHS",
    "ingredients": [
      "Poulet : 120 g",
      "Tomate : 30 g",
      "Sauce burger : 40 ml",
      "Cheddar : 20 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "sw_poulet_crunchy",
    "name": "POULET CRUNCHY",
    "category": "SANDWICHS",
    "ingredients": [
      "Poulet : 120 g",
      "Œuf : 1 p",
      "Chapelure : 50 g",
      "Tomate : 30 g",
      "Cheddar : 20 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "sw_cheese_steak",
    "name": "CHEESE STEAK",
    "category": "SANDWICHS",
    "ingredients": [
      "Filet : 70 g",
      "Demi-glace : 40 ml",
      "Champignon : 50 g",
      "Cheddar : 20 g",
      "Crème fraîche : 40 ml",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "sw_viande_hachee",
    "name": "VIANDE HACHÉE",
    "category": "SANDWICHS",
    "ingredients": [
      "Viande : 100 g",
      "Tomate : 30 g",
      "Sauce spéciale : 30 g",
      "Cheddar : 20 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "pz_margarita",
    "name": "MARGARITA",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Sauce tomate : 100 g",
      "Olives noires : 13 g"
    ]
  },
  {
    "id": "pz_thon",
    "name": "THON",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Sauce tomate : 100 g",
      "Thon : 100 g",
      "Oignons : 40 g",
      "Olives"
    ]
  },
  {
    "id": "pz_vegetarienne",
    "name": "VÉGÉTARIENNE",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Sauce tomate : 100 g",
      "Champignons : 60 g",
      "Légumes : 220 g"
    ]
  },
  {
    "id": "pz_regina",
    "name": "REGINA",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Dinde fumée : 100 g",
      "Champignons : 60 g",
      "Sauce blanche : 100 g"
    ]
  },
  {
    "id": "pz_5_fromages",
    "name": "5 FROMAGES",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 50 g",
      "Brie : 50 g",
      "Bleu : 40 g",
      "Sauce blanche : 100 g",
      "Parmesan : 20 g",
      "Fromage rouge : 40 g"
    ]
  },
  {
    "id": "pz_viande_hachee",
    "name": "VIANDE HACHÉE",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Sauce tomate : 100 g",
      "Viande : 100 g",
      "Tomate cerise : 40 g"
    ]
  },
  {
    "id": "pz_pepperoni",
    "name": "PEPPERONI",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Sauce tomate : 100 g",
      "Pepperoni : 40 g"
    ]
  },
  {
    "id": "pz_poulet_sauce_blanche",
    "name": "POULET SAUCE BLANCHE",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Poulet : 150 g",
      "Champignon : 60 g",
      "Sauce blanche : 100 g"
    ]
  },
  {
    "id": "pz_4_saisons",
    "name": "4 SAISONS",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Calamar : 40 g",
      "Crevette : 40 g",
      "Viande : 40 g",
      "Poulet : 40 g",
      "Légumes : 60 g",
      "Champignon : 60 g"
    ]
  },
  {
    "id": "pz_moitie_moitie",
    "name": "MOITIÉ MOITIÉ",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Garnitures 2 moitiés (hors fruits de mer/saumon)"
    ]
  },
  {
    "id": "pz_burrata",
    "name": "BURRATA",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Sauce tomate : 100 g",
      "Burrata : 35 g",
      "Noix : 30 g",
      "Tomate cerise : 20 g"
    ]
  },
  {
    "id": "pz_fruits_de_mer",
    "name": "FRUITS DE MER",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Crevette : 110 g",
      "Calamar : 70 g",
      "Moules : 40 g",
      "Champignon : 60 g",
      "Sauce blanche : 100 g"
    ]
  },
  {
    "id": "pz_saumon",
    "name": "SAUMON",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 330 g",
      "Mozzarella : 200 g",
      "Saumon : 90 g",
      "Sauce blanche : 100 g",
      "Câpres : 15 g"
    ]
  },
  {
    "id": "pae_lasagne_poulet",
    "name": "LASAGNE POULET",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 60 g",
      "poulet : 80 g",
      "Parmesan : 15 g",
      "Huile : 60 g",
      "champignon : 50 g",
      "Pesto : 70 g",
      "Sauce blanche : 100 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_lasagne_bolognaise",
    "name": "LASAGNE BOLOGNAISE",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 60 g",
      "Viande : 100 g",
      "Parmesan : 15 g",
      "Huile : 60 g",
      "Tomate cerise : 50 g",
      "Pesto : 70 g",
      "Sauce tomate : 80 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_lasagne_fruits_de_mer",
    "name": "LASAGNE FRUITS DE MER",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 60 g",
      "crevette : 140 g",
      "Parmesan : 15 g",
      "Huile : 60 g",
      "CALAMAR : 100 g",
      "Pesto : 70 g",
      "Sauce blanche : 100 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_vegetarien",
    "name": "VÉGÉTARIEN",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "Sauce pesto : 70 g",
      "Parmesan : 60 g",
      "Huile d'olive : 60 g",
      "Crème : 100 g",
      "Oignon : 60 g",
      "Tomate cerise : 50 g",
      "Légumes : 150 g"
    ]
  },
  {
    "id": "pae_carbonara",
    "name": "CARBONARA",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "Jambon de dinde : 80 g",
      "Parmesan : 60 g",
      "Huile : 60 g",
      "Crème : 100 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_5_fromages",
    "name": "5 FROMAGES",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "Brie : 25 g",
      "Parmesan : 25 g",
      "Bleu : 20 g",
      "Mozzarella : 30 g",
      "Edam : 20 g",
      "Huile : 60 g",
      "Crème : 100 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_rigatoni_ricotta",
    "name": "RIGATONI RICOTTA",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "Ricotta : 40 g",
      "Parmesan : 60 g",
      "Huile : 60 g",
      "Crème : 100 g",
      "Pesto : 70 g",
      "Courgette : 100 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_bolognaise",
    "name": "BOLOGNAISE",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "Viande : 100 g",
      "Parmesan : 60 g",
      "Huile : 60 g",
      "Tomate cerise : 50 g",
      "Pesto : 70 g",
      "Sauce tomate : 80 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_poulet_champignon_epinard",
    "name": "POULET CHAMPIGNON / ÉPINARD",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "Poulet : 80 g",
      "Parmesan : 60 g",
      "Huile : 60 g",
      "Crème : 100 g",
      "Pesto : 70 g",
      "Épinard : 30 g",
      "Champignon : 70 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_fruits_de_mer",
    "name": "FRUITS DE MER",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "Crevettes : 105 g",
      "Calamar : 60 g",
      "Moules : 15 g",
      "Parmesan : 60 g",
      "Huile : 60 g",
      "Crème : 100 g",
      "Pesto : 70 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_saumon",
    "name": "SAUMON",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "Saumon : 90 g",
      "Parmesan : 60 g",
      "Huile : 60 g",
      "Crème : 100 g",
      "Pesto : 70 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "pae_spaghettis_noirs_suppl",
    "name": "SPAGHETTIS NOIRS (suppl.)",
    "category": "PÂTES",
    "ingredients": [
      "Supplément pâtes noires à l'encre de seiche"
    ]
  },
  {
    "id": "dp_san_sebastien_cheesecake",
    "name": "SAN SEBASTIEN CHEESECAKE",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Cheesecake San Sebastian : 1 part (160 g)",
      "Coulis chocolat chaud : 30 g"
    ]
  },
  {
    "id": "dp_fondant_au_chocolat",
    "name": "FONDANT AU CHOCOLAT",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Fondant chocolat cœur coulant : 1 p (120 g)",
      "Glace vanille artisanale : 1 boule (50 g)",
      "Sucre glace : 5 g"
    ]
  },
  {
    "id": "dp_cheesecake_chocolat",
    "name": "CHEESECAKE CHOCOLAT",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Cheesecake chocolat : 1 part (150 g)",
      "Chantilly : 20 g"
    ]
  },
  {
    "id": "dp_boule_de_glace",
    "name": "BOULE DE GLACE",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Glace artisanale au choix : 1 boule (50 g)"
    ]
  },
  {
    "id": "dp_2_boules_de_glace",
    "name": "2 BOULES DE GLACE",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Glace artisanale au choix : 2 boules (100 g)",
      "Coulis & Chantilly : 20 g"
    ]
  },
  {
    "id": "dp_3_boules_de_glace",
    "name": "3 BOULES DE GLACE",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Glace artisanale au choix : 3 boules (150 g)",
      "Coulis, Chantilly & Gaufrette : 30 g"
    ]
  },
  {
    "id": "cr_crepe_nutella",
    "name": "CRÊPE NUTELLA",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Nutella : 60 g",
      "Banane ou Amandes : 20 g"
    ]
  },
  {
    "id": "cr_crepe_kunafa_pistache",
    "name": "CRÊPE KUNAFA PISTACHE",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Pâte de pistache : 40 g",
      "Kunafa croustillante : 30 g",
      "Pistaches concassées : 15 g"
    ]
  },
  {
    "id": "cr_crepe_fromage",
    "name": "CRÊPE FROMAGE",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Mozzarella : 50 g",
      "Fromage rouge : 30 g",
      "Fromage blanc : 20 g"
    ]
  },
  {
    "id": "cr_crepe_poulet_champignon",
    "name": "CRÊPE POULET CHAMPIGNON",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Blanc de poulet : 70 g",
      "Champignons : 40 g",
      "Mozzarella : 40 g",
      "Crème fraîche : 40 ml"
    ]
  },
  {
    "id": "cr_crepe_charcuterie",
    "name": "CRÊPE CHARCUTERIE",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Charcuterie de dinde : 60 g",
      "Mozzarella : 40 g",
      "Fromage : 20 g"
    ]
  },
  {
    "id": "cr_crepe_norvegienne",
    "name": "CRÊPE NORVÉGIENNE",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Saumon fumé : 60 g",
      "Crème fraîche : 40 ml",
      "Fromage : 30 g"
    ]
  },
  {
    "id": "sup_supplement_frites",
    "name": "SUPPLÉMENT FRITES",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Frites : 200 g",
      "Sauce : 30 g"
    ]
  },
  {
    "id": "sup_supplement_puree",
    "name": "SUPPLÉMENT PURÉE",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Pomme de terre purée : 250 g",
      "Beurre : 15 g"
    ]
  },
  {
    "id": "sup_supplement_potatos",
    "name": "SUPPLÉMENT POTATOS",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Pomme de terre potatos : 200 g",
      "Sauce : 30 g"
    ]
  },
  {
    "id": "sup_supplement_miel",
    "name": "SUPPLÉMENT MIEL",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Miel pur : 30 g"
    ]
  },
  {
    "id": "sup_supplement_jben",
    "name": "SUPPLÉMENT JBEN",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Jben frais : 50 g"
    ]
  },
  {
    "id": "sup_supplement_oeufs",
    "name": "SUPPLÉMENT ŒUFS",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Œufs frais : 2 p"
    ]
  },
  {
    "id": "sup_supplement_fromage",
    "name": "SUPPLÉMENT FROMAGE",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Fromage variété : 50 g"
    ]
  },
  {
    "id": "sup_pizza_composee_au_choix",
    "name": "PIZZA COMPOSÉE AU CHOIX",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Pâte à pizza : 330 g",
      "Mozzarella : 200 g",
      "Sauce tomate : 100 g",
      "Garniture composée : 150 g"
    ]
  },
  {
    "id": "sup_divers_cuisine_food",
    "name": "DIVERS CUISINE / FOOD",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Ingrédients cuisine divers : 1 portion"
    ]
  },
  {
    "id": "sup_divers_bar_boissons",
    "name": "DIVERS BAR / BOISSONS",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Ingrédients bar divers : 1 portion"
    ]
  },
  {
    "id": "alc_baghrir",
    "name": "PETIT BAGHRIR (A LA CARTE)",
    "category": "A LA CARTE",
    "ingredients": [
      "Baghrir : 1 p"
    ]
  },
  {
    "id": "alc_msemen",
    "name": "MSEMEN NATURE (A LA CARTE)",
    "category": "A LA CARTE",
    "ingredients": [
      "Msemen : 1 p"
    ]
  },
  {
    "id": "alc_viennoiserie",
    "name": "VIENNOISERIE (A LA CARTE)",
    "category": "A LA CARTE",
    "ingredients": [
      "Viennoiserie : 1 p"
    ]
  },
  {
    "id": "alc_harcha",
    "name": "HARCHA (A LA CARTE)",
    "category": "A LA CARTE",
    "ingredients": [
      "Harcha : 1 p"
    ]
  },
  {
    "id": "alc_omlette_fromage",
    "name": "OMLETTE FROMAGE (A LA CARTE)",
    "category": "A LA CARTE",
    "ingredients": [
      "Œufs : 3 p",
      "Fromage : 40 g",
      "Mesclun : 30 g"
    ]
  },
  {
    "id": "alc_omlette_nature",
    "name": "OMLETTE NATURE (A LA CARTE)",
    "category": "A LA CARTE",
    "ingredients": [
      "Œufs : 3 p",
      "Mesclun : 30 g"
    ]
  },
  {
    "id": "alc_omlette_chef",
    "name": "OMLETTE DU CHEF (A LA CARTE)",
    "category": "A LA CARTE",
    "ingredients": [
      "Œufs : 3 p",
      "Champignons : 40 g",
      "Épinards : 30 g",
      "Fromage : 30 g"
    ]
  }
];

/* ========================================================
   2. DICTIONNAIRE D'ALIAS & CORRESPONDANCE CAISSE -> FT
======================================================== */
const ALIAS_MAP = {
  "cafe noir espresso": "bc_cafe_noir_espresso",
  "café noir / espresso": "bc_cafe_noir_espresso",
  "cafe americain": "bc_cafe_americain",
  "café américain": "bc_cafe_americain",
  "cafe au lait": "bc_cafe_au_lait",
  "café au lait": "bc_cafe_au_lait",
  "cafe latte": "bc_cafe_latte",
  "café latte": "bc_cafe_latte",
  "cappuccino italien": "bc_cappuccino_italien",
  "cappuccino chantilly": "bc_cappuccino_chantilly",
  "cafe nespresso": "bc_cafe_nespresso",
  "café nespresso": "bc_cafe_nespresso",
  "chocolat chaud": "bc_chocolat_chaud",
  "chocolat chaud chantilly": "bc_chocolat_chaud_chantilly",
  "chocolat fondu gourmand": "bc_chocolat_fondu_gourmand",
  "the marocain a la menthe": "bc_the_marocain_a_la_menthe",
  "thé marocain à la menthe": "bc_the_marocain_a_la_menthe",
  "the noir": "bc_the_noir",
  "thé noir": "bc_the_noir",
  "the noir au lait": "bc_the_noir_au_lait",
  "thé noir au lait": "bc_the_noir_au_lait",
  "verveine nature": "bc_verveine_nature",
  "verveine aromatisee": "bc_verveine_aromatisee",
  "verveine aromatisée": "bc_verveine_aromatisee",
  "infusion bien etre": "bc_infusion_bien_etre",
  "infusion bien-être": "bc_infusion_bien_etre",
  "verre de lait": "bc_verre_de_lait",
  "lait casse": "bc_lait_casse",
  "lait cassé": "bc_lait_casse",
  "cafe separe": "bc_cafe_separe",
  "café séparé": "bc_cafe_separe",
  "cafe moitie": "bc_cafe_moitie",
  "café moitié": "bc_cafe_moitie",
  "ice coffee classique": "fg_ice_coffee_classique",
  "ice coffee aromatise": "fg_ice_coffee_aromatise",
  "ice coffee aromatisé": "fg_ice_coffee_aromatise",
  "frappuccino classique": "fg_frappuccino_classique",
  "frappuccino aromatise": "fg_frappuccino_aromatise",
  "frappuccino aromatisé": "fg_frappuccino_aromatise",
  "ice tea peche maison": "it_ice_tea_peche_maison",
  "ice tea pêche maison": "it_ice_tea_peche_maison",
  "ice tea citron maison": "it_ice_tea_citron_maison",
  "ice tea framboise maison": "it_ice_tea_framboise_maison",
  "jus d orange presse": "jf_jus_d_orange_presse",
  "jus d'orange pressé": "jf_jus_d_orange_presse",
  "jus de citron citronnade": "jf_jus_de_citron_citronnade",
  "jus de citron / citronnade": "jf_jus_de_citron_citronnade",
  "jus de fraise": "jf_jus_de_fraise",
  "jus de framboise": "jf_jus_de_framboise",
  "jus de mangue": "jf_jus_de_mangue",
  "jus d ananas": "jf_jus_d_ananas",
  "jus d'ananas": "jf_jus_d_ananas",
  "jus de peche": "jf_jus_de_peche",
  "jus de pêche": "jf_jus_de_peche",
  "jus de carotte": "jf_jus_de_carotte",
  "jus pomme banane": "jf_jus_pomme_banane",
  "jus pomme & banane": "jf_jus_pomme_banane",
  "jus d avocat au lait": "jf_jus_d_avocat_au_lait",
  "jus d'avocat au lait": "jf_jus_d_avocat_au_lait",
  "jus d avocat royal fruits secs": "jf_jus_d_avocat_royal_fruits_secs",
  "jus d'avocat royal fruits secs": "jf_jus_d_avocat_royal_fruits_secs",
  "jus panache fruits frais": "jf_jus_panache_fruits_frais",
  "jus panaché fruits frais": "jf_jus_panache_fruits_frais",
  "cocktail a base d orange": "jf_cocktail_a_base_d_orange",
  "cocktail à base d'orange": "jf_cocktail_a_base_d_orange",
  "za3za3 royal grey corner": "jf_za3za3_royal_grey_corner",
  "signature grey corner": "ck_signature_grey_corner",
  "virgin pina colada": "ck_virgin_pina_colada",
  "virgin piña colada": "ck_virgin_pi_a_colada",
  "cocktail tropical": "ck_cocktail_tropical",
  "mojito virgin fraicheur": "ck_mojito_virgin_fraicheur",
  "mojito virgin / fraîcheur": "ck_mojito_virgin_fraicheur",
  "detox gingembre citron": "ck_detox_gingembre_citron",
  "détox gingembre citron": "ck_detox_gingembre_citron",
  "cocktail sans alcool special": "ck_cocktail_sans_alcool_special",
  "cocktail sans alcool spécial": "ck_cocktail_sans_alcool_special",
  "mojito tropical": "ck_mojito_tropical",
  "mojito red bull": "ck_mojito_red_bull",
  "mojito citron": "ck_mojito_citron",
  "smoothie pink berry": "sm_smoothie_pink_berry",
  "smoothie energetique": "sm_smoothie_energetique",
  "smoothie énergétique": "sm_smoothie_energetique",
  "smoothie hawai": "sm_smoothie_hawai",
  "smoothie hawaï": "sm_smoothie_hawai",
  "smoothie multivitamine": "sm_smoothie_multivitamine",
  "smoothie multivitaminé": "sm_smoothie_multivitamine",
  "smoothie jelly fruit": "sm_smoothie_jelly_fruit",
  "smoothie triple fruits": "sm_smoothie_triple_fruits",
  "smoothie bowl exotique": "sm_smoothie_bowl_exotique",
  "smoothie bowl ultra boost": "sm_smoothie_bowl_ultra_boost",
  "coca cola 33cl": "sd_coca_cola_33cl",
  "coca-cola 33cl": "sd_coca_cola_33cl",
  "coca cola zero 33cl": "sd_coca_cola_zero_33cl",
  "coca-cola zéro 33cl": "sd_coca_cola_zero_33cl",
  "sprite 33cl": "sd_sprite_33cl",
  "hawai 33cl": "sd_hawai_33cl",
  "hawaï 33cl": "sd_hawai_33cl",
  "poms 33cl": "sd_poms_33cl",
  "schweppes citron tonic 33cl": "sd_schweppes_citron_tonic_33cl",
  "schweppes citron / tonic 33cl": "sd_schweppes_citron_tonic_33cl",
  "orangina 33cl": "sd_orangina_33cl",
  "red bull 250ml": "sd_red_bull_250ml",
  "eau minerale 33cl": "ea_eau_minerale_33cl",
  "eau minérale 33cl": "ea_eau_minerale_33cl",
  "eau minerale 50cl": "ea_eau_minerale_50cl",
  "eau minérale 50cl": "ea_eau_minerale_50cl",
  "eau minerale 75cl": "ea_eau_minerale_75cl",
  "eau minérale 75cl": "ea_eau_minerale_75cl",
  "oulmes eau gazeuse 33cl 50cl": "ea_oulmes_eau_gazeuse_33cl_50cl",
  "oulmès eau gazeuse 33cl / 50cl": "ea_oulmes_eau_gazeuse_33cl_50cl",
  "oulmes eau gazeuse 75cl": "ea_oulmes_eau_gazeuse_75cl",
  "oulmès eau gazeuse 75cl": "ea_oulmes_eau_gazeuse_75cl",
  "compagnard": "pdj_compagnard",
  "petit dejeuner americain": "pdj_petit_dejeuner_americain",
  "petit déjeuner américain": "pdj_petit_dejeuner_americain",
  "brunch greycorner": "pdj_brunch_greycorner",
  "brunch duo": "pdj_brunch_duo",
  "beldi": "pdj_beldi",
  "hollandais": "pdj_hollandais",
  "omelette vegetarienne": "pdj_omelette_vegetarienne",
  "omelette végétarienne": "pdj_omelette_vegetarienne",
  "berbere": "pdj_berbere",
  "berbère": "pdj_berbere",
  "croque": "pdj_croque",
  "fassi": "pdj_fassi",
  "omelette continental": "pdj_omelette_continental",
  "omelette fromage": "pdj_omelette_fromage",
  "omelette nature": "pdj_omelette_nature",
  "omelette du chef": "pdj_omelette_du_chef",
  "espagnol": "pdj_espagnol",
  "mquila merguez": "pdj_mquila_merguez",
  "mquila-merguez": "pdj_mquila_merguez",
  "mquila fruits de mer": "pdj_mquila_fruits_de_mer",
  "mquila-fruits de mer": "pdj_mquila_fruits_de_mer",
  "norvegien": "pdj_norvegien",
  "norvégien": "pdj_norvegien",
  "light": "pdj_light",
  "express": "pdj_express",
  "menu enfant pdj": "pdj_menu_enfant_pdj",
  "menu enfant (pdj)": "pdj_menu_enfant_pdj",
  "salade veggie": "ef_salade_veggie",
  "salade russe": "ef_salade_russe",
  "salade cesar": "ef_salade_cesar",
  "salade césar": "ef_salade_cesar",
  "salade quinoa": "ef_salade_quinoa",
  "salade terre mer": "ef_salade_terre_mer",
  "salade terre & mer": "ef_salade_terre_mer",
  "tartare saumon": "ef_tartare_saumon",
  "salade burrata": "ef_salade_burrata",
  "croquettes 5 fromages": "ec_croquettes_5_fromages",
  "croustillon gambas": "ec_croustillon_gambas",
  "pil pil espagnol": "ec_pil_pil_espagnol",
  "brochettes de poulet": "pl_brochettes_de_poulet",
  "emince de poulet": "pl_emince_de_poulet",
  "ballotine de poulet": "pl_ballotine_de_poulet",
  "escalope a la parmigiana": "pl_escalope_a_la_parmigiana",
  "escalope a la milanaise": "pl_escalope_a_la_milanaise",
  "emince de boeuf": "pl_emince_de_boeuf",
  "emince de bœuf": "pl_emince_de_boeuf",
  "filet de boeuf": "pl_filet_de_boeuf",
  "filet de bœuf": "pl_filet_de_boeuf",
  "pave de saumon": "pl_pave_de_saumon",
  "pavé de saumon": "pl_pave_de_saumon",
  "menu enfant plat": "pl_menu_enfant_plat",
  "menu enfant (plat)": "pl_menu_enfant_plat",
  "roulade de boeuf vh": "pl_roulade_de_boeuf_vh",
  "roulade de bœuf vh": "pl_roulade_de_boeuf_vh",
  "chicken burger": "bg_chicken_burger",
  "cheese burger": "bg_cheese_burger",
  "avocado forestier": "bg_avocado_forestier",
  "egg et cheeseburger": "bg_egg_et_cheeseburger",
  "big burger": "bg_big_burger",
  "burger royal": "bg_burger_royal",
  "wrap poulet": "wr_wrap_poulet",
  "wrap viande hachee": "wr_wrap_viande_hachee",
  "wrap viande hachée": "wr_wrap_viande_hachee",
  "wrap gourmand": "wr_wrap_gourmand",
  "charcuterie": "pa_charcuterie",
  "poulet": "sw_poulet",
  "viande hachee": "pz_viande_hachee",
  "viande hachée": "pz_viande_hachee",
  "gourmand": "pa_gourmand",
  "fruits de mer": "pae_fruits_de_mer",
  "saumon": "pae_saumon",
  "thon": "pz_thon",
  "poulet crunchy": "sw_poulet_crunchy",
  "cheese steak": "sw_cheese_steak",
  "margarita": "pz_margarita",
  "vegetarienne": "pz_vegetarienne",
  "végétarienne": "pz_vegetarienne",
  "regina": "pz_regina",
  "5 fromages": "pae_5_fromages",
  "pepperoni": "pz_pepperoni",
  "poulet sauce blanche": "pz_poulet_sauce_blanche",
  "4 saisons": "pz_4_saisons",
  "moitie moitie": "pz_moitie_moitie",
  "moitié moitié": "pz_moitie_moitie",
  "burrata": "pz_burrata",
  "lasagne poulet": "pae_lasagne_poulet",
  "lasagne bolognaise": "pae_lasagne_bolognaise",
  "lasagne fruits de mer": "pae_lasagne_fruits_de_mer",
  "vegetarien": "pae_vegetarien",
  "végétarien": "pae_vegetarien",
  "carbonara": "pae_carbonara",
  "rigatoni ricotta": "pae_rigatoni_ricotta",
  "bolognaise": "pae_bolognaise",
  "poulet champignon epinard": "pae_poulet_champignon_epinard",
  "poulet champignon / épinard": "pae_poulet_champignon_epinard",
  "spaghettis noirs suppl": "pae_spaghettis_noirs_suppl",
  "spaghettis noirs (suppl.)": "pae_spaghettis_noirs_suppl",
  "san sebastien cheesecake": "dp_san_sebastien_cheesecake",
  "fondant au chocolat": "dp_fondant_au_chocolat",
  "cheesecake chocolat": "dp_cheesecake_chocolat",
  "boule de glace": "dp_boule_de_glace",
  "2 boules de glace": "dp_2_boules_de_glace",
  "3 boules de glace": "dp_3_boules_de_glace",
  "crepe nutella": "cr_crepe_nutella",
  "crêpe nutella": "cr_crepe_nutella",
  "crepe kunafa pistache": "cr_crepe_kunafa_pistache",
  "crêpe kunafa pistache": "cr_crepe_kunafa_pistache",
  "crepe fromage": "cr_crepe_fromage",
  "crêpe fromage": "cr_crepe_fromage",
  "crepe poulet champignon": "cr_crepe_poulet_champignon",
  "crêpe poulet champignon": "cr_crepe_poulet_champignon",
  "crepe charcuterie": "cr_crepe_charcuterie",
  "crêpe charcuterie": "cr_crepe_charcuterie",
  "crepe norvegienne": "cr_crepe_norvegienne",
  "crêpe norvégienne": "cr_crepe_norvegienne",
  "supplement frites": "sup_supplement_frites",
  "supplément frites": "sup_supplement_frites",
  "supplement puree": "sup_supplement_puree",
  "supplément purée": "sup_supplement_puree",
  "supplement potatos": "sup_supplement_potatos",
  "supplément potatos": "sup_supplement_potatos",
  "supplement miel": "sup_supplement_miel",
  "supplément miel": "sup_supplement_miel",
  "supplement jben": "sup_supplement_jben",
  "supplément jben": "sup_supplement_jben",
  "supplement oeufs": "sup_supplement_oeufs",
  "supplément œufs": "sup_supplement_oeufs",
  "supplement fromage": "sup_supplement_fromage",
  "supplément fromage": "sup_supplement_fromage",
  "pizza composee au choix": "sup_pizza_composee_au_choix",
  "pizza composée au choix": "sup_pizza_composee_au_choix",
  "divers cuisine food": "sup_divers_cuisine_food",
  "divers cuisine / food": "sup_divers_cuisine_food",
  "divers bar boissons": "sup_divers_bar_boissons",
  "divers bar / boissons": "sup_divers_bar_boissons",
  "cafe": "bc_cafe_noir_espresso",
  "cafe noir": "bc_cafe_noir_espresso",
  "espresso": "bc_cafe_noir_espresso",
  "expresso": "bc_cafe_noir_espresso",
  "americano": "bc_cafe_americain",
  "cafe lait": "bc_cafe_au_lait",
  "latte": "bc_cafe_latte",
  "cappuccino": "bc_cappuccino_italien",
  "nespresso": "bc_cafe_nespresso",
  "cafe séparé": "bc_cafe_separe",
  "cafe moitié": "bc_cafe_moitie",
  "chocolat au lait": "bc_chocolat_chaud",
  "chocolat chantilly": "bc_chocolat_chaud_chantilly",
  "chocolat fondu": "bc_chocolat_fondu_gourmand",
  "the a la menthe": "bc_the_marocain_a_la_menthe",
  "the menthe": "bc_the_marocain_a_la_menthe",
  "the vert": "bc_the_marocain_a_la_menthe",
  "verveine": "bc_verveine_nature",
  "verveine au lait": "bc_verveine_aromatisee",
  "the infusion": "bc_infusion_bien_etre",
  "infusion": "bc_infusion_bien_etre",
  "ice coffee": "fg_ice_coffee_classique",
  "frappuccino": "fg_frappuccino_classique",
  "frappuccino caramel": "fg_frappuccino_aromatise",
  "ice tea peche": "it_ice_tea_peche_maison",
  "ice tea citron": "it_ice_tea_citron_maison",
  "ice tea framboise": "it_ice_tea_framboise_maison",
  "jus d orange": "jf_jus_d_orange_presse",
  "jus orange": "jf_jus_d_orange_presse",
  "orange presse": "jf_jus_d_orange_presse",
  "jus de citron": "jf_jus_de_citron_citronnade",
  "citronnade": "jf_jus_de_citron_citronnade",
  "jus fraise": "jf_jus_de_fraise",
  "jus framboise": "jf_jus_de_framboise",
  "jus mangue": "jf_jus_de_mangue",
  "jus ananas": "jf_jus_d_ananas",
  "jus peche": "jf_jus_de_peche",
  "jus carotte": "jf_jus_de_carotte",
  "jus de banane": "jf_jus_pomme_banane",
  "jus banane": "jf_jus_pomme_banane",
  "jus d avocat": "jf_jus_d_avocat_au_lait",
  "jus avocat": "jf_jus_d_avocat_au_lait",
  "jus d avocat royal": "jf_jus_d_avocat_royal_fruits_secs",
  "jus avocat royal": "jf_jus_d_avocat_royal_fruits_secs",
  "avocat fruits secs": "jf_jus_d_avocat_royal_fruits_secs",
  "jus panache": "jf_jus_panache_fruits_frais",
  "panache": "jf_jus_panache_fruits_frais",
  "cocktail orange": "jf_cocktail_a_base_d_orange",
  "za3za3": "jf_za3za3_royal_grey_corner",
  "zaazaa": "jf_za3za3_royal_grey_corner",
  "za3za3 royal": "jf_za3za3_royal_grey_corner",
  "cocktail gc": "ck_signature_grey_corner",
  "pina colada": "ck_virgin_pina_colada",
  "tropical": "ck_cocktail_tropical",
  "mojito": "ck_mojito_virgin_fraicheur",
  "mojito virgin": "ck_mojito_virgin_fraicheur",
  "cocktail fraicheur": "ck_mojito_virgin_fraicheur",
  "detox gingembre": "ck_detox_gingembre_citron",
  "gingembre citron": "ck_detox_gingembre_citron",
  "cocktail special": "ck_cocktail_sans_alcool_special",
  "smoothie pink": "sm_smoothie_pink_berry",
  "smoothie jelly": "sm_smoothie_jelly_fruit",
  "ultra vitamines bowl": "sm_smoothie_bowl_ultra_boost",
  "ultra vitamines": "sm_smoothie_bowl_ultra_boost",
  "san sebastien": "dp_san_sebastien_cheesecake",
  "san sebastien grey corner": "dp_san_sebastien_cheesecake",
  "cheesecake san sebastian": "dp_san_sebastien_cheesecake",
  "fondant chocolat": "dp_fondant_au_chocolat",
  "cheese cake chocolat": "dp_cheesecake_chocolat",
  "2 boule de glace": "dp_2_boules_de_glace",
  "coca": "sd_coca_cola_33cl",
  "coca cola": "sd_coca_cola_33cl",
  "coca zero": "sd_coca_cola_zero_33cl",
  "coca cola zero": "sd_coca_cola_zero_33cl",
  "sprite": "sd_sprite_33cl",
  "hawai": "sd_hawai_33cl",
  "poms": "sd_poms_33cl",
  "schweppes": "sd_schweppes_citron_tonic_33cl",
  "schweppes citron": "sd_schweppes_citron_tonic_33cl",
  "schweppes tonic": "sd_schweppes_citron_tonic_33cl",
  "schwepps tonic": "sd_schweppes_citron_tonic_33cl",
  "orangina": "sd_orangina_33cl",
  "red bull": "sd_red_bull_250ml",
  "eau 33cl": "ea_eau_minerale_33cl",
  "eau 33 cl": "ea_eau_minerale_33cl",
  "eau 33": "ea_eau_minerale_33cl",
  "eau 50cl": "ea_eau_minerale_50cl",
  "eau 50 cl": "ea_eau_minerale_50cl",
  "eau 50": "ea_eau_minerale_50cl",
  "eau minerale 0 5l": "ea_eau_minerale_50cl",
  "eau minerale 0.5l": "ea_eau_minerale_50cl",
  "eau 75cl": "ea_eau_minerale_75cl",
  "eau 75 cl": "ea_eau_minerale_75cl",
  "eau mineral 75 cl": "ea_eau_minerale_75cl",
  "eau 75": "ea_eau_minerale_75cl",
  "oulmes 33cl": "ea_oulmes_eau_gazeuse_33cl_50cl",
  "oulmes 50cl": "ea_oulmes_eau_gazeuse_33cl_50cl",
  "oulmes": "ea_oulmes_eau_gazeuse_33cl_50cl",
  "oulmes 75cl": "ea_oulmes_eau_gazeuse_75cl",
  "eau gazeuse 75 cl": "ea_oulmes_eau_gazeuse_75cl",
  "pet-dej beldi": "pdj_beldi",
  "petit baghrir": "alc_baghrir",
  "msemen nature": "alc_msemen",
  "pet-dej express": "pdj_express",
  "viennoiserie": "alc_viennoiserie",
  "pet-dej norvegien": "pdj_norvegien",
  "pet-dej continental": "pdj_omelette_continental",
  "continental": "pdj_omelette_continental",
  "pet-dej light": "pdj_light",
  "pet-dej fassi": "pdj_fassi",
  "pet-dej berbere": "pdj_berbere",
  "pet-dej hollandais": "pdj_hollandais",
  "pet-dej espagnol": "pdj_espagnol",
  "pet-dej mquila merguez": "pdj_mquila_merguez",
  "pet-dej mquila fruits de mer": "pdj_mquila_fruits_de_mer",
  "pet-dej americain": "pdj_petit_dejeuner_americain",
  "americain": "pdj_petit_dejeuner_americain",
  "brunch grey corner": "pdj_brunch_greycorner",
  "omlette fromage": "pdj_omelette_fromage",
  "omlette nature": "pdj_omelette_nature",
  "omlette du chef": "pdj_omelette_du_chef",
  "omlette vegetarienne": "pdj_omelette_vegetarienne",
  "menu enfant": "pdj_menu_enfant_pdj",
  "burger avocado forestier": "bg_avocado_forestier",
  "plat emince de poulet": "pl_emince_de_poulet",
  "plat emincedepoulet": "pl_emince_de_poulet",
  "plat emince de boeuf": "pl_emince_de_boeuf",
  "plat emincedeboeuf": "pl_emince_de_boeuf",
  "plat emincede boeuf": "pl_emince_de_boeuf",
  "emincedeboeuf": "pl_emince_de_boeuf",
  "emincede boeuf": "pl_emince_de_boeuf",
  "plat escalope a la milanaise": "pl_escalope_a_la_milanaise",
  "plat escalope a la parmigiana": "pl_escalope_a_la_parmigiana",
  "plat filet de boeuf": "pl_filet_de_boeuf",
  "plat pave de saumon": "pl_pave_de_saumon",
  "menu enfant nugette": "pl_menu_enfant_plat",
  "roulade de boeuf": "pl_roulade_de_boeuf_vh",
  "panini mix": "pa_gourmand",
  "panini mixte": "pa_gourmand",
  "panini gourmand": "pa_gourmand",
  "panini charcuterie": "pa_charcuterie",
  "panini poulet": "pa_poulet",
  "panini viande hachee": "pa_viande_hachee",
  "panini fruits de mer": "pa_fruits_de_mer",
  "panini saumon": "pa_saumon",
  "sandwich fruit de mer": "sw_fruits_de_mer",
  "ciabatta sandwich fruit de mer": "sw_fruits_de_mer",
  "sandwich cheese steak": "sw_cheese_steak",
  "ciabatta sandwich cheese steak": "sw_cheese_steak",
  "sandwich viande hache": "sw_viande_hachee",
  "ciabatta sandwich viande hache": "sw_viande_hachee",
  "sandwich poulet": "sw_poulet",
  "ciabatta sandwich poulet": "sw_poulet",
  "sandwich poulet crunchy": "sw_poulet_crunchy",
  "sandwich thon": "sw_thon",
  "pizza fruits de mer": "pz_fruits_de_mer",
  "pizza 4 saisons": "pz_4_saisons",
  "pizza thon": "pz_thon",
  "pizza viande hachee": "pz_viande_hachee",
  "pizza poulet": "pz_poulet_sauce_blanche",
  "pizza pepperoni": "pz_pepperoni",
  "pizza burrata": "pz_burrata",
  "pizza margarita": "pz_margarita",
  "pizza 5 fromages": "pz_5_fromages",
  "pizza vegetarienne": "pz_vegetarienne",
  "pizza saumon": "pz_saumon",
  "pizza regina": "pz_regina",
  "compose au choix": "sup_pizza_composee_au_choix",
  "pasta 5 fromages": "pae_5_fromages",
  "pasta carbonara": "pae_carbonara",
  "pasta vegetarien": "pae_vegetarien",
  "pasta bolognaise": "pae_bolognaise",
  "pasta poulet champignon": "pae_poulet_champignon_epinard",
  "pasta fruits de mer": "pae_fruits_de_mer",
  "pasta saumon": "pae_saumon",
  "puree pomme de terre": "sup_supplement_puree",
  "puree": "sup_supplement_puree",
  "potatos": "sup_supplement_potatos",
  "frites": "sup_supplement_frites",
  "miel": "sup_supplement_miel",
  "jben": "sup_supplement_jben",
  "sup fromage": "sup_supplement_fromage",
  "divers food": "sup_divers_cuisine_food",
  "divers bar": "sup_divers_bar_boissons",
  "baghrir": "alc_baghrir",
  "msemen": "alc_msemen",
  "mlaoui": "alc_msemen",
  "croissant": "alc_viennoiserie",
  "pain au chocolat": "alc_viennoiserie",
  "harcha": "alc_harcha"
};

/* ========================================================
   3. GESTION DU STOCKAGE DES RECETTES & BASE DE VENTES MENSUELLE
======================================================== */
let activeRecipes = [];
let monthlySalesDB = {}; // Format: { "YYYY-MM-DD": [ { family, product, price, qty, total }, ... ] }
let currentViewMode = 'day'; // 'day' ou 'month'
let selectedDate = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
let selectedYearMonth = selectedDate.slice(0, 7); // 'YYYY-MM'

let currentSalesData = [];
let aggregatedIngredients = [];

function loadRecipes() {
  try {
    const saved = localStorage.getItem('gc_recipes_db');
    if (saved) {
      activeRecipes = JSON.parse(saved);
      return;
    }
  } catch (e) {}
  activeRecipes = JSON.parse(JSON.stringify(BASE_RECIPES));
}

function saveRecipes() {
  try {
    localStorage.setItem('gc_recipes_db', JSON.stringify(activeRecipes));
  } catch (e) {}
}

function loadMonthlySalesDB() {
  try {
    const saved = localStorage.getItem('gc_monthly_sales_db_v2');
    if (saved) {
      monthlySalesDB = JSON.parse(saved);
    }
  } catch (e) {
    monthlySalesDB = {};
  }
}

function saveMonthlySalesDB() {
  try {
    localStorage.setItem('gc_monthly_sales_db_v2', JSON.stringify(monthlySalesDB));
  } catch (e) {}
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

  // 1. Alias direct
  if (ALIAS_MAP[cName]) {
    const r = activeRecipes.find(x => x.id === ALIAS_MAP[cName]);
    if (r) return r;
  }

  // 2. Nettoyage de préfixes habituels de caisse
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
    .replace(/^crepe\s+/, '')
    .replace(/^supplement cuisine\s+/, '')
    .replace(/^supplement ptdej\s+/, '')
    .replace(/^supplement\s+/, '')
    .trim();

  if (ALIAS_MAP[simplified]) {
    const r = activeRecipes.find(x => x.id === ALIAS_MAP[simplified]);
    if (r) return r;
  }

  // 3. Recherche exacte par nom de recette nettoyé
  for (const r of activeRecipes) {
    const rClean = cleanText(r.name);
    if (rClean === cName || rClean === simplified) return r;
  }

  // 4. Recherche par inclusion
  for (const r of activeRecipes) {
    const rClean = cleanText(r.name);
    if (cName.includes(rClean) || (rClean.length > 4 && simplified.includes(rClean))) {
      return r;
    }
  }

  return null;
}

/* ========================================================
   5. PARSER D'INGRÉDIENTS & CALCUL DE DÉSTOCKAGE
======================================================== */
function categorizeIngredient(name) {
  const n = cleanText(name);
  if (n.includes('cafe') || n.includes('nespresso') || n.includes('pastille') || n.includes('the ') || n.includes('the') || n.includes('verveine') || n.includes('infusion') || n.includes('sirop') || n.includes('coca') || n.includes('sprite') || n.includes('hawai') || n.includes('poms') || n.includes('schweppes') || n.includes('orangina') || n.includes('red bull') || n.includes('oulmes') || n.includes('eau') || n.includes('boba') || n.includes('menthe') || n.includes('glacon') || n.includes('glace')) {
    return 'boissons';
  }
  if (n.includes('poulet') || n.includes('boeuf') || n.includes('viande') || n.includes('merguez') || n.includes('khli') || n.includes('bacon') || n.includes('charcuterie') || n.includes('dinde') || n.includes('nugget') || n.includes('pepperoni') || n.includes('saucisse')) {
    return 'viandes';
  }
  if (n.includes('saumon') || n.includes('crevette') || n.includes('gambas') || n.includes('calamar') || n.includes('moule') || n.includes('thon') || n.includes('mer') || n.includes('poisson')) {
    return 'poissons';
  }
  if (n.includes('mozzarella') || n.includes('parmesan') || n.includes('cheddar') || n.includes('fromage') || n.includes('brie') || n.includes('bleu') || n.includes('edam') || n.includes('burrata') || n.includes('ricotta') || n.includes('feta') || n.includes('jben') || n.includes('creme') || n.includes('lait') || n.includes('beurre') || /\boeufs?\b/.test(n) || n.startsWith('omelette') || n.includes('yaourt')) {
    return 'fromages';
  }
  if (n.includes('tomate') || n.includes('salade') || n.includes('oignon') || n.includes('champignon') || n.includes('pomme de terre') || n.includes('frite') || n.includes('avocat') || n.includes('legume') || n.includes('epinard') || n.includes('carotte') || n.includes('concombre') || n.includes('brocoli') || n.includes('radis') || n.includes('betterave') || n.includes('orange') || n.includes('citron') || n.includes('fraise') || n.includes('mangue') || n.includes('banane') || n.includes('fruits') || n.includes('kiwi') || n.includes('framboise') || n.includes('ananas') || n.includes('peche') || n.includes('myrtille') || n.includes('pomme') || n.includes('datte') || n.includes('gingembre') || n.includes('roquette') || n.includes('olive')) {
    return 'legumes';
  }
  return 'epicerie';
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
  else if (n.includes('boeuf')) {
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
  else if (!n.includes('caille') && !n.includes('boeuf') && (/\\boeufs?\\b/.test(n) || n.startsWith('omelette'))) {
    name = 'Œufs (Pièces)';
    unit = 'p';
  }
  else if (n === 'oeufs de caille' || n.includes('caille')) {
    name = 'Œufs de Caille';
    unit = 'p';
  }
  else if (n === 'fromage' || n === 'fromages' || n.includes('fromage edam') || n.includes('fromage rape') || n.includes('edam') || n.includes('gouda')) {
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
  else if (n.startsWith('cafe') && !n.includes('nespresso') && !n.includes('latte') && !n.includes('lait') && !n.includes('gla') && !n.includes('frap')) {
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
  a.click();
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

function renderSalesTable() {
  const tbody = document.getElementById('tbody-sales');
  const search = cleanText(document.getElementById('search-sales').value);

  const filtered = currentSalesData.filter(s => {
    if (search && !cleanText(s.product).includes(search) && !cleanText(s.family).includes(search)) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 36px; color: var(--muted);">
          Aucune vente à afficher.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const hasRecipe = !!s.matchedRecipe;
    const statusBadge = hasRecipe
      ? `<span class="badge-tag badge-ok">✅ ${s.matchedRecipe.name}</span>`
      : `<span class="badge-tag badge-warn">⚠️ Non configuré / Boisson</span>`;

    const ingsList = hasRecipe
      ? s.matchedRecipe.ingredients.map(i => `<span class="dish-pill">${i}</span>`).join(' ')
      : '<span style="color:var(--muted); font-size:12px;">Article sans fiche technique</span>';

    return `
      <tr>
        <td><span style="color:var(--muted); font-size:12.5px;">${s.family}</span></td>
        <td><strong>${s.product}</strong></td>
        <td><span class="qty-highlight">${s.qty}</span></td>
        <td><strong>${s.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</strong></td>
        <td>${statusBadge}</td>
        <td><div class="dishes-pill-list">${ingsList}</div></td>
        <td>
          <button class="btn" style="padding: 4px 8px; font-size:11.5px;" onclick="openRecipeEditor('${s.product}')">
            ${hasRecipe ? '✏️ Éditer' : '➕ Créer Recette'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
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
    const ingLines = (r.ingredients || []).map(i => {
      const parts = i.split(':');
      if (parts.length > 1) {
        return `<li><span>${parts[0].trim()}</span> <strong style="color:var(--accent);">${parts.slice(1).join(':').trim()}</strong></li>`;
      }
      return `<li><span>${i}</span></li>`;
    }).join('');

    return `
      <div class="recipe-card">
        <div class="recipe-card-title">
          <span>${r.name}</span>
          <button class="btn" style="padding: 3px 8px; font-size:11px;" onclick="editRecipe('${r.id}')">✏️ Modifier</button>
        </div>
        <div style="font-size:11.5px; color:var(--muted); margin-bottom:8px;">Catégorie : <strong>${r.category}</strong></div>
        <ul class="recipe-ing-list">${ingLines}</ul>
      </div>
    `;
  }).join('');
}

/* ========================================================
   9. MODALE & ÉDITION DE FICHES TECHNIQUES
======================================================== */
function openRecipeEditor(productName) {
  const recipe = findRecipeForProduct(productName);
  if (recipe) {
    editRecipe(recipe.id);
  } else {
    document.getElementById('edit-recipe-id').value = 'rec_' + Date.now();
    document.getElementById('edit-recipe-name').value = productName.toUpperCase();
    document.getElementById('edit-recipe-cat').value = 'AUTRE';
    document.getElementById('edit-recipe-ingredients').value = '';
    document.getElementById('modal-recipe-title').textContent = `Créer Fiche Technique : ${productName}`;
    document.getElementById('recipe-modal').classList.add('visible');
  }
}

function editRecipe(id) {
  const r = activeRecipes.find(x => x.id === id);
  if (!r) return;
  document.getElementById('edit-recipe-id').value = r.id;
  document.getElementById('edit-recipe-name').value = r.name;
  document.getElementById('edit-recipe-cat').value = r.category || 'AUTRE';
  document.getElementById('edit-recipe-ingredients').value = (r.ingredients || []).join('\n');
  document.getElementById('modal-recipe-title').textContent = `Modifier : ${r.name}`;
  document.getElementById('recipe-modal').classList.add('visible');
}

function closeModal() {
  document.getElementById('recipe-modal').classList.remove('visible');
}

function saveRecipeFromModal() {
  const id = document.getElementById('edit-recipe-id').value;
  const name = document.getElementById('edit-recipe-name').value.trim();
  const category = document.getElementById('edit-recipe-cat').value;
  const rawIngs = document.getElementById('edit-recipe-ingredients').value;

  if (!name) {
    alert('Veuillez spécifier le nom du plat.');
    return;
  }

  const ingredients = rawIngs.split('\n').map(s => s.trim()).filter(Boolean);

  const idx = activeRecipes.findIndex(x => x.id === id);
  if (idx >= 0) {
    activeRecipes[idx] = { id, name, category, ingredients };
  } else {
    activeRecipes.push({ id, name, category, ingredients });
  }

  saveRecipes();
  closeModal();
  renderRecipeList();
  recalculateCurrentView();
}

/* ========================================================
   10. LECTURE EXCEL (SHEETJS), PARSER DE FICHIER & AUTO-SYNC /VENTES
======================================================== */
function extractDateFromFilename(filename) {
  if (!filename) return null;
  // Patterns: Fin_Journée_20260827.xls, Fin_Journee_20260827.xlsx, 20260827, 2026-08-27
  const m1 = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (m1) {
    const y = m1[1];
    const m = m1[2];
    const d = m1[3];
    return `${y}-${m}-${d}`;
  }
  const m2 = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m2) return m2[0];
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

  if (colProduit === -1) { colProduit = 1; colFamille = 0; colPrix = 2; colQte = 3; colTotal = 4; headerRowIndex = 0; }

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

    if (qty > 0) {
      rawRows.push({ family: fam, product: prod, price, qty, total });
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
    banner.textContent = "🔄 Analyse du dossier /ventes en cours...";
    banner.style.color = "var(--accent)";
  }

  let foundCount = 0;
  let loadedDates = [];

  // Helper pour tenter plusieurs chemins relatifs
  async function fetchFile(path) {
    const candidatePaths = [path, './' + path, '/' + path];
    for (const p of candidatePaths) {
      try {
        const resp = await fetch(p + '?t=' + Date.now());
        if (resp.ok) return resp;
      } catch (e) {}
    }
    return null;
  }

  // 1. Essayer de charger le manifest.json s'il existe
  try {
    const manifestResp = await fetchFile('ventes/manifest.json');
    if (manifestResp) {
      const manifest = await manifestResp.json();
      const filesList = manifest.files || [];

      for (const fname of filesList) {
        const dKey = extractDateFromFilename(fname);
        if (dKey) {
          try {
            const fResp = await fetchFile('ventes/' + fname);
            if (fResp) {
              const buf = await fResp.arrayBuffer();
              const wb = XLSX.read(new Uint8Array(buf), { type: 'array' });
              const rows = parseWorkbookToRows(wb);
              if (rows.length > 0) {
                monthlySalesDB[dKey] = rows;
                foundCount++;
                loadedDates.push(dKey);
              }
            }
          } catch (e) {}
        }
      }
    }
  } catch (e) {}

  // 2. Scan direct par conventions de noms standard pour le mois en cours (1 au 31)
  const [yearStr, monthStr] = selectedYearMonth.split('-');
  const totalDays = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();

  for (let day = 1; day <= totalDays; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dKey = `${selectedYearMonth}-${dayStr}`;
    const compactDate = `${yearStr}${monthStr}${dayStr}`;

    const candidateFilenames = [
      `Fin_Journée_${compactDate}.xlsx`,
      `Fin_Journée_${compactDate}.xls`,
      `Fin_Journee_${compactDate}.xlsx`,
      `Fin_Journee_${compactDate}.xls`,
      `ventes_${compactDate}.xlsx`,
      `ventes_${compactDate}.xls`
    ];

    for (const cName of candidateFilenames) {
      try {
        const resp = await fetchFile('ventes/' + encodeURIComponent(cName));
        if (resp) {
          const buf = await resp.arrayBuffer();
          const wb = XLSX.read(new Uint8Array(buf), { type: 'array' });
          const rows = parseWorkbookToRows(wb);
          if (rows.length > 0) {
            monthlySalesDB[dKey] = rows;
            foundCount++;
            loadedDates.push(dKey);
            break; // Fichier trouvé pour cette date
          }
        }
      } catch (err) {}
    }
  }

  if (foundCount > 0) {
    saveMonthlySalesDB();

    // AUTO-SÉLECTION : Si la date actuellement sélectionnée n'a pas de vente, basculer sur le jour le plus récent avec des ventes !
    const availableDates = Object.keys(monthlySalesDB).filter(d => monthlySalesDB[d] && monthlySalesDB[d].length > 0).sort();
    if (availableDates.length > 0) {
      if (!monthlySalesDB[selectedDate] || monthlySalesDB[selectedDate].length === 0) {
        selectedDate = availableDates[availableDates.length - 1];
        selectedYearMonth = selectedDate.slice(0, 7);
      }
    }

    renderCalendar();
    recalculateCurrentView();

    if (banner) {
      banner.style.color = "var(--ok)";
      banner.textContent = `✅ ${foundCount} journée(s) de vente synchronisée(s) ! Données chargées pour le ${formatDateFR(selectedDate)}.`;
    }
    if (showUserAlert) {
      alert(`✅ Synchronisation réussie ! ${foundCount} fichier(s) du dossier /ventes chargés.\nAffichage des ventes du ${formatDateFR(selectedDate)}.`);
    }
  } else {
    if (banner) {
      banner.style.color = "var(--muted)";
      banner.textContent = "📁 Dossier /ventes prêt. Déposez vos fichiers 'Fin_Journée_YYYYMMDD.xls' pour auto-chargement.";
    }
    if (showUserAlert) {
      alert("Aucun nouveau fichier trouvé dans le dossier /ventes pour ce mois.");
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
   12. INITIALISATION & GESTIONNAIRES D'ÉVÉNEMENTS
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
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
      localStorage.removeItem('gc_recipes_db');
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

activeRecipes = BASE_RECIPES;

const testItems = [
  // 1. Viande hachée
  'Viande : 100 g',
  'Viande hachée : 100 g',
  'Viande Hachée : 60 g',
  
  // 2. Merguez & Saucisses
  'Merguez : 120 g',
  'Saucisses : 2 p',
  
  // 3. Bœuf / Filet de Bœuf
  'Filet De Boeuf : 200 g',
  'Plat EminceDe Boeuf : 150 g',
  'ROULADE DE BOEUF VH : 180 g',
  
  // 4. Poulet / Poulet pané
  'Poulet : 150 g',
  'Poulet Pané : 120 g',
  'Poulet pané : 50 g',
  
  // 5. Crevettes / Gambas / Gambas panées / Gambas pochées
  'crevettes : 100 g',
  'Gambas : 260 g',
  'Gambas Pané : 60 g',
  'Gambas Poché : 80 g'
];

console.log('--- TEST SMART INGREDIENT FUSION ---');
testItems.forEach(line => {
  const parsed = parseIngredientLine(line);
  console.log(line + ' ---> [' + parsed.name + '] : ' + parsed.qty + ' ' + parsed.unit);
});
