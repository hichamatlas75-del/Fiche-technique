/**
 * GREY CORNER — Coûts Ingrédients et Calculateur de Food Cost
 * Extrait de recipes-data.js pour modularité
 * Ce fichier contient : INGREDIENT_CATEGORIES, INGREDIENT_UNIT_COSTS, calculateRecipeFoodCost()
 */

(function(global) {
const INGREDIENT_CATEGORIES = {
  "viandes": [
    "viande",
    "boeuf",
    "bœuf",
    "filet",
    "steak",
    "poulet",
    "merguez",
    "saucisse",
    "dinde",
    "charcuterie",
    "khli",
    "bacon",
    "pepperoni",
    "nugget"
  ],
  "poissons": [
    "saumon",
    "crevette",
    "gambas",
    "calamar",
    "moule",
    "thon",
    "mer",
    "poisson"
  ],
  "fromages": [
    "oeuf",
    "œuf",
    "omelette",
    "fromage",
    "mozzarella",
    "parmesan",
    "cheddar",
    "edam",
    "gouda",
    "jben",
    "beurre",
    "creme",
    "crème",
    "lait",
    "yaourt",
    "ricotta",
    "burrata",
    "brie",
    "bleu"
  ],
  "boissons": [
    "eau",
    "oulmes",
    "coca",
    "sprite",
    "hawai",
    "poms",
    "schweppes",
    "orangina",
    "red bull",
    "nespresso",
    "pastille",
    "cafe",
    "café",
    "the",
    "thé",
    "verveine",
    "infusion",
    "chocolat",
    "sirop",
    "glacon",
    "glaçon",
    "glace",
    "boba",
    "boisson chaude"
  ],
  "legumes": [
    "tomate",
    "oignon",
    "champignon",
    "pomme de terre",
    "frite",
    "puree",
    "potatos",
    "avocat",
    "salade",
    "mesclun",
    "laitue",
    "roquette",
    "epinard",
    "épinard",
    "poivron",
    "radis",
    "carotte",
    "concombre",
    "betterave",
    "olive",
    "orange",
    "citron",
    "fraise",
    "framboise",
    "mangue",
    "banane",
    "pomme",
    "ananas",
    "peche",
    "pêche",
    "kiwi",
    "fruits",
    "fruit",
    "menthe",
    "agrumes",
    "acai",
    "haricot",
    "courgette",
    "brocoli",
    "persil"
  ]
};

const INGREDIENT_UNIT_COSTS = {
  "eau": {
    "cost": 0,
    "unit": "ml"
  },
  "eau chaude": {
    "cost": 0,
    "unit": "ml"
  },
  "eau bouillante": {
    "cost": 0,
    "unit": "ml"
  },
  "glace pilee": {
    "cost": 0,
    "unit": "g"
  },
  "glacons": {
    "cost": 0,
    "unit": "g"
  },
  "glaçon": {
    "cost": 0,
    "unit": "g"
  },
  "glaçons": {
    "cost": 0,
    "unit": "g"
  },
  "eau gazeuse": {
    "cost": 0.008,
    "unit": "ml"
  },
  "eau gazeuse oulmes": {
    "cost": 0.008,
    "unit": "ml"
  },
  "eau minerale": {
    "cost": 0.003,
    "unit": "ml"
  },
  "bouteille eau minerale 33cl": {
    "cost": 1.8,
    "unit": "piece"
  },
  "eau minerale 33cl": {
    "cost": 1.8,
    "unit": "piece"
  },
  "bouteille eau minerale 50cl": {
    "cost": 2.73,
    "unit": "piece"
  },
  "bouteille eau minerale 75cl": {
    "cost": 10.4,
    "unit": "piece"
  },
  "bouteille oulmes 33/50cl": {
    "cost": 4,
    "unit": "piece"
  },
  "bouteille oulmes 75cl": {
    "cost": 12.3,
    "unit": "piece"
  },
  "sauce vinaigrette": {
    "cost": 0.025,
    "unit": "g"
  },
  "vinaigrette": {
    "cost": 0.025,
    "unit": "g"
  },
  "vinaigre balsamique": {
    "cost": 0.015,
    "unit": "ml"
  },
  "sauce tomate": {
    "cost": 0.00875,
    "unit": "g"
  },
  "sauce blanche": {
    "cost": 0.025,
    "unit": "ml"
  },
  "sauce pesto": {
    "cost": 0.045,
    "unit": "g"
  },
  "pesto": {
    "cost": 0.045,
    "unit": "g"
  },
  "sauce burger": {
    "cost": 0.028,
    "unit": "g"
  },
  "sauce": {
    "cost": 0.028,
    "unit": "g"
  },
  "sauce exclusive": {
    "cost": 0.035,
    "unit": "g"
  },
  "sauce exclusive du chef": {
    "cost": 0.035,
    "unit": "g"
  },
  "sauce cocktail": {
    "cost": 0.03,
    "unit": "g"
  },
  "mayonnaise": {
    "cost": 0.018,
    "unit": "g"
  },
  "ketchup": {
    "cost": 0.33,
    "unit": "piece"
  },
  "moutarde": {
    "cost": 0.0215,
    "unit": "g"
  },
  "demi-glace": {
    "cost": 0.045,
    "unit": "ml"
  },
  "demi glace": {
    "cost": 0.045,
    "unit": "ml"
  },
  "huile d'olive": {
    "cost": 0.04,
    "unit": "ml"
  },
  "huile": {
    "cost": 0.0156,
    "unit": "ml"
  },
  "coca-cola": {
    "cost": 7.55,
    "unit": "piece"
  },
  "coca-cola (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece"
  },
  "coca-cola zero (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece"
  },
  "sprite (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece"
  },
  "hawai canette": {
    "cost": 7.55,
    "unit": "piece"
  },
  "hawai": {
    "cost": 7.55,
    "unit": "piece"
  },
  "poms (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece"
  },
  "poms": {
    "cost": 7.55,
    "unit": "piece"
  },
  "schweppes (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece"
  },
  "schweppes": {
    "cost": 7.55,
    "unit": "piece"
  },
  "orangina (canette 33cl)": {
    "cost": 6.35,
    "unit": "piece"
  },
  "orangina": {
    "cost": 6.35,
    "unit": "piece"
  },
  "red bull (canette 250ml)": {
    "cost": 13.96,
    "unit": "piece"
  },
  "red bull": {
    "cost": 13.96,
    "unit": "piece"
  },
  "jus d'orange": {
    "cost": 0.01,
    "unit": "ml"
  },
  "jus d'orange presse": {
    "cost": 0.01,
    "unit": "ml"
  },
  "jus de citron": {
    "cost": 0.01,
    "unit": "ml"
  },
  "jus de citron presse": {
    "cost": 0.01,
    "unit": "ml"
  },
  "jus de citron vert": {
    "cost": 0.015,
    "unit": "ml"
  },
  "jus d'ananas": {
    "cost": 0.015,
    "unit": "ml"
  },
  "jus de pomme": {
    "cost": 0.012,
    "unit": "ml"
  },
  "jus de cranberry": {
    "cost": 0.018,
    "unit": "ml"
  },
  "jus de mangue": {
    "cost": 0.018,
    "unit": "ml"
  },
  "lait de coco": {
    "cost": 0.03,
    "unit": "ml"
  },
  "eau de coco": {
    "cost": 0.02,
    "unit": "ml"
  },
  "lait": {
    "cost": 0.00917,
    "unit": "ml"
  },
  "lait chaud": {
    "cost": 0.00917,
    "unit": "ml"
  },
  "lait uht": {
    "cost": 0.00917,
    "unit": "ml"
  },
  "mousse de lait": {
    "cost": 0.00917,
    "unit": "ml"
  },
  "creme": {
    "cost": 0.025,
    "unit": "ml"
  },
  "creme fraiche": {
    "cost": 0.025,
    "unit": "ml"
  },
  "creme chantilly": {
    "cost": 0.03,
    "unit": "g"
  },
  "chantilly": {
    "cost": 0.03,
    "unit": "g"
  },
  "leben": {
    "cost": 0.009,
    "unit": "ml"
  },
  "petit lait": {
    "cost": 0.009,
    "unit": "ml"
  },
  "infusion the noir": {
    "cost": 0.0021000000000000003,
    "unit": "ml"
  },
  "infusion the vert": {
    "cost": 0.0021000000000000003,
    "unit": "ml"
  },
  "infusion the fruits rouges": {
    "cost": 0.0025,
    "unit": "ml"
  },
  "infusion": {
    "cost": 1.1,
    "unit": "piece"
  },
  "sirop": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop de canne": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop de sucre de canne": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop sucre de canne": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sucre de canne": {
    "cost": 0.035,
    "unit": "g"
  },
  "sirop caramel": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop noisette": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop vanille": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop fraise": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop framboise": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop peche": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop de peche": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop de citron": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop passion": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop de passion": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop mojito": {
    "cost": 0.035,
    "unit": "ml"
  },
  "sirop menthe": {
    "cost": 0.024,
    "unit": "ml"
  },
  "sirop grenadine": {
    "cost": 0.023,
    "unit": "ml"
  },
  "sirop de grenadine": {
    "cost": 0.023,
    "unit": "ml"
  },
  "sirop curaçao bleu": {
    "cost": 0.035,
    "unit": "ml"
  },
  "curacao bleu": {
    "cost": 0.035,
    "unit": "ml"
  },
  "coulis chocolat": {
    "cost": 0.034,
    "unit": "g"
  },
  "coulis chocolat chaud": {
    "cost": 0.034,
    "unit": "g"
  },
  "coulis caramel": {
    "cost": 0.032,
    "unit": "g"
  },
  "coulis fruits rouges": {
    "cost": 0.035,
    "unit": "g"
  },
  "blanc de poulet": {
    "cost": 0.05,
    "unit": "g"
  },
  "poulet": {
    "cost": 0.05,
    "unit": "g"
  },
  "poulet hache": {
    "cost": 0.05,
    "unit": "g"
  },
  "poulet pane": {
    "cost": 0.053,
    "unit": "g"
  },
  "poulet emince": {
    "cost": 0.05,
    "unit": "g"
  },
  "poulet grille": {
    "cost": 0.05,
    "unit": "g"
  },
  "volaille": {
    "cost": 0.065,
    "unit": "g"
  },
  "volaille hachee": {
    "cost": 0.065,
    "unit": "g"
  },
  "viande hachee": {
    "cost": 0.1,
    "unit": "g"
  },
  "viande": {
    "cost": 0.1,
    "unit": "g"
  },
  "steak de boeuf": {
    "cost": 0.1,
    "unit": "g"
  },
  "emince de boeuf": {
    "cost": 0.11,
    "unit": "g"
  },
  "filet de boeuf": {
    "cost": 0.19,
    "unit": "g"
  },
  "filet": {
    "cost": 0.19,
    "unit": "g"
  },
  "viande tajine": {
    "cost": 0.09,
    "unit": "g"
  },
  "merguez": {
    "cost": 0.095,
    "unit": "g"
  },
  "saucisse": {
    "cost": 0.105,
    "unit": "g"
  },
  "saucisses": {
    "cost": 0.105,
    "unit": "g"
  },
  "khli3": {
    "cost": 0.11,
    "unit": "g"
  },
  "charcuterie": {
    "cost": 0.06,
    "unit": "g"
  },
  "charcuteries": {
    "cost": 0.06,
    "unit": "g"
  },
  "charcuterie de dinde": {
    "cost": 0.065,
    "unit": "g"
  },
  "jambon de dinde": {
    "cost": 0.085,
    "unit": "g"
  },
  "salami": {
    "cost": 0.085,
    "unit": "g"
  },
  "bacon": {
    "cost": 0.1,
    "unit": "g"
  },
  "bacon de boeuf": {
    "cost": 0.1,
    "unit": "g"
  },
  "pepperoni": {
    "cost": 0.12,
    "unit": "g"
  },
  "peperoni": {
    "cost": 0.12,
    "unit": "g"
  },
  "nuggets": {
    "cost": 0.053,
    "unit": "g"
  },
  "saumon brut": {
    "cost": 0.13,
    "unit": "g",
    "label": "Saumon Brut (Avec carcasse)"
  },
  "saumon frais net": {
    "cost": 0.18,
    "unit": "g",
    "label": "Saumon Frais Net (Pavé / Filet)"
  },
  "saumon fume": {
    "cost": 0.28,
    "unit": "g"
  },
  "crevettes brut": {
    "cost": 0.055,
    "unit": "g",
    "label": "Crevettes Brut (Avec coquille / Réception)"
  },
  "crevettes net": {
    "cost": 0.21,
    "unit": "g",
    "label": "Crevettes Net (Chair décortiquée)"
  },
  "gambas brut": {
    "cost": 0.055,
    "unit": "g",
    "label": "Gambas Brut (Avec coquille)"
  },
  "gambas net": {
    "cost": 0.21,
    "unit": "g",
    "label": "Gambas Net (Chair décortiquée / Pochée)"
  },
  "gambas pane": {
    "cost": 0.18,
    "unit": "g",
    "label": "Gambas Pané"
  },
  "calamar brut": {
    "cost": 0.052,
    "unit": "g",
    "label": "Calamar Brut (Congelé / Réception)"
  },
  "calamar net": {
    "cost": 0.156,
    "unit": "g",
    "label": "Calamar Net (Chair / Égoutté)"
  },
  "moules": {
    "cost": 0.055,
    "unit": "g"
  },
  "palourde": {
    "cost": 0.075,
    "unit": "g"
  },
  "thon": {
    "cost": 0.05825,
    "unit": "g"
  },
  "anchois": {
    "cost": 0.109,
    "unit": "g"
  },
  "mozzarella": {
    "cost": 0.055,
    "unit": "g"
  },
  "parmesan": {
    "cost": 0.15,
    "unit": "g"
  },
  "fromage rouge": {
    "cost": 0.095,
    "unit": "g"
  },
  "fromage": {
    "cost": 0.095,
    "unit": "g"
  },
  "fromage blanc": {
    "cost": 0.035,
    "unit": "g"
  },
  "fromage variete": {
    "cost": 0.09,
    "unit": "g"
  },
  "fromages": {
    "cost": 0.09,
    "unit": "g"
  },
  "edam": {
    "cost": 0.09,
    "unit": "g"
  },
  "gouda": {
    "cost": 0.09,
    "unit": "g"
  },
  "cheddar": {
    "cost": 0.085,
    "unit": "g"
  },
  "bleu": {
    "cost": 0.12,
    "unit": "g"
  },
  "brie": {
    "cost": 0.11,
    "unit": "g"
  },
  "camembert": {
    "cost": 0.11,
    "unit": "g"
  },
  "burrata": {
    "cost": 25,
    "unit": "piece",
    "label": "BURRATA"
  },
  "jben": {
    "cost": 0.04,
    "unit": "g"
  },
  "ricotta": {
    "cost": 0.04,
    "unit": "g"
  },
  "mascarpone": {
    "cost": 0.13,
    "unit": "g"
  },
  "yaourt grec nature": {
    "cost": 0.03,
    "unit": "g"
  },
  "yaourt": {
    "cost": 0.03,
    "unit": "g"
  },
  "beurre": {
    "cost": 0.08,
    "unit": "g"
  },
  "oeuf": {
    "cost": 1.27,
    "unit": "piece"
  },
  "oeufs": {
    "cost": 1.27,
    "unit": "piece"
  },
  "œuf": {
    "cost": 1.27,
    "unit": "piece"
  },
  "œufs": {
    "cost": 1.27,
    "unit": "piece"
  },
  "oeufs frais": {
    "cost": 1.27,
    "unit": "piece"
  },
  "oeufs au plat": {
    "cost": 1.27,
    "unit": "piece"
  },
  "oeuf brouille": {
    "cost": 1.27,
    "unit": "piece"
  },
  "oeuf baldi": {
    "cost": 2.7,
    "unit": "piece"
  },
  "oeufs de caille": {
    "cost": 0.69,
    "unit": "piece"
  },
  "pain burger": {
    "cost": 2.5,
    "unit": "piece"
  },
  "pain de mie complet": {
    "cost": 0.78,
    "unit": "piece"
  },
  "pain de mie": {
    "cost": 0.78,
    "unit": "piece"
  },
  "pain complet": {
    "cost": 0.78,
    "unit": "piece"
  },
  "pain seigle": {
    "cost": 0.94,
    "unit": "piece"
  },
  "pain cereales": {
    "cost": 0.94,
    "unit": "piece"
  },
  "pain cereal": {
    "cost": 0.94,
    "unit": "piece"
  },
  "pain ciabatta": {
    "cost": 2.2,
    "unit": "piece"
  },
  "pain panini": {
    "cost": 2,
    "unit": "piece"
  },
  "pain": {
    "cost": 2,
    "unit": "piece"
  },
  "tortilla": {
    "cost": 1.8,
    "unit": "piece"
  },
  "pate a pizza": {
    "cost": 0.004,
    "unit": "g"
  },
  "pate": {
    "cost": 0.032,
    "unit": "g"
  },
  "spaghetti": {
    "cost": 0.018,
    "unit": "g"
  },
  "spaghettis": {
    "cost": 0.018,
    "unit": "g"
  },
  "pates": {
    "cost": 0.032,
    "unit": "g"
  },
  "pasta": {
    "cost": 0.032,
    "unit": "g",
    "label": "Pâtes / Pasta (Sèche)"
  },
  "pates lasagne": {
    "cost": 0.03,
    "unit": "g"
  },
  "tagliatelle": {
    "cost": 0.044,
    "unit": "g"
  },
  "tagliatelles": {
    "cost": 0.044,
    "unit": "g"
  },
  "linguine": {
    "cost": 0.036,
    "unit": "g"
  },
  "linguines": {
    "cost": 0.036,
    "unit": "g"
  },
  "rigatoni": {
    "cost": 0.036,
    "unit": "g"
  },
  "spaghettis noirs": {
    "cost": 0.07,
    "unit": "g"
  },
  "frites": {
    "cost": 0.0175,
    "unit": "g"
  },
  "potatos": {
    "cost": 0.027,
    "unit": "g"
  },
  "puree de pomme de terre": {
    "cost": 0.0175,
    "unit": "g"
  },
  "puree": {
    "cost": 0.0175,
    "unit": "g"
  },
  "pomme de terre": {
    "cost": 0.007,
    "unit": "g"
  },
  "riz basmati": {
    "cost": 0.027,
    "unit": "g"
  },
  "riz": {
    "cost": 0.027,
    "unit": "g"
  },
  "quinoa": {
    "cost": 0.055,
    "unit": "g"
  },
  "quinoa blanc": {
    "cost": 0.055,
    "unit": "g"
  },
  "quinoa noir": {
    "cost": 0.055,
    "unit": "g"
  },
  "semoule": {
    "cost": 0.0078,
    "unit": "g"
  },
  "semoule couscous": {
    "cost": 0.0078,
    "unit": "g"
  },
  "croissant": {
    "cost": 2,
    "unit": "piece"
  },
  "pain au chocolat": {
    "cost": 2,
    "unit": "piece"
  },
  "viennoiserie": {
    "cost": 2,
    "unit": "piece"
  },
  "muffin": {
    "cost": 3.5,
    "unit": "piece"
  },
  "gaufre": {
    "cost": 3,
    "unit": "piece"
  },
  "pancake": {
    "cost": 2,
    "unit": "piece"
  },
  "pate a crepe": {
    "cost": 1.8,
    "unit": "piece"
  },
  "baghrir": {
    "cost": 1.2,
    "unit": "piece"
  },
  "harcha": {
    "cost": 1.2,
    "unit": "piece"
  },
  "mlaoui": {
    "cost": 1.5,
    "unit": "piece"
  },
  "msemen": {
    "cost": 1.5,
    "unit": "piece"
  },
  "pain cake": {
    "cost": 2.5,
    "unit": "piece"
  },
  "toast hollandais": {
    "cost": 2.5,
    "unit": "piece"
  },
  "croquettes fromage": {
    "cost": 3,
    "unit": "piece"
  },
  "croquettes": {
    "cost": 3,
    "unit": "piece"
  },
  "croque maison": {
    "cost": 6.5,
    "unit": "piece"
  },
  "salade": {
    "cost": 0.008,
    "unit": "g"
  },
  "salade rouge": {
    "cost": 0.01,
    "unit": "g"
  },
  "salade mesclun": {
    "cost": 0.012,
    "unit": "g"
  },
  "laitue": {
    "cost": 0.008,
    "unit": "g"
  },
  "mesclun": {
    "cost": 0.012,
    "unit": "g"
  },
  "mesclun salade": {
    "cost": 0.012,
    "unit": "g"
  },
  "roquette": {
    "cost": 0.015,
    "unit": "g"
  },
  "epinard": {
    "cost": 0.015,
    "unit": "g"
  },
  "epinards": {
    "cost": 0.015,
    "unit": "g"
  },
  "tomate": {
    "cost": 0.006,
    "unit": "g"
  },
  "tomates": {
    "cost": 0.006,
    "unit": "g"
  },
  "tomate cerise": {
    "cost": 0.015,
    "unit": "g"
  },
  "tomates cerises": {
    "cost": 0.015,
    "unit": "g"
  },
  "champignon": {
    "cost": 0.035,
    "unit": "g"
  },
  "champignons": {
    "cost": 0.035,
    "unit": "g"
  },
  "courgette": {
    "cost": 0.008,
    "unit": "g"
  },
  "poivron": {
    "cost": 0.01,
    "unit": "g"
  },
  "poivrons": {
    "cost": 0.01,
    "unit": "g"
  },
  "oignon": {
    "cost": 0.006,
    "unit": "g"
  },
  "oignons": {
    "cost": 0.006,
    "unit": "g"
  },
  "oignon/ail": {
    "cost": 0.008,
    "unit": "g"
  },
  "ail": {
    "cost": 0.025,
    "unit": "g"
  },
  "carotte": {
    "cost": 0.006,
    "unit": "g"
  },
  "carottes fraiches": {
    "cost": 0.006,
    "unit": "g"
  },
  "concombre": {
    "cost": 0.006,
    "unit": "g"
  },
  "haricot vert": {
    "cost": 0.018,
    "unit": "g"
  },
  "betterave": {
    "cost": 0.008,
    "unit": "g"
  },
  "brocoli": {
    "cost": 0.02,
    "unit": "g"
  },
  "radis": {
    "cost": 0.01,
    "unit": "g"
  },
  "petit pois": {
    "cost": 0.018,
    "unit": "g"
  },
  "cornichon": {
    "cost": 0.02,
    "unit": "g"
  },
  "mais": {
    "cost": 0.032350000000000004,
    "unit": "g"
  },
  "maïs": {
    "cost": 0.032350000000000004,
    "unit": "g"
  },
  "olives noires": {
    "cost": 0.04,
    "unit": "g"
  },
  "olives": {
    "cost": 0.04,
    "unit": "g"
  },
  "olives vertes": {
    "cost": 0.026,
    "unit": "g"
  },
  "olive verte": {
    "cost": 0.026,
    "unit": "g"
  },
  "capres": {
    "cost": 0.03,
    "unit": "g"
  },
  "gingembre": {
    "cost": 0.03,
    "unit": "g"
  },
  "gingembre frais": {
    "cost": 0.03,
    "unit": "g"
  },
  "gingembre frais rape": {
    "cost": 0.03,
    "unit": "g"
  },
  "legumes": {
    "cost": 0.01,
    "unit": "g"
  },
  "legumes couscous": {
    "cost": 0.01,
    "unit": "g"
  },
  "legumes varies": {
    "cost": 0.01,
    "unit": "g"
  },
  "garnitures composees": {
    "cost": 0.015,
    "unit": "g"
  },
  "garniture composee": {
    "cost": 0.015,
    "unit": "g"
  },
  "avocat": {
    "cost": 0.024,
    "unit": "g"
  },
  "avocat hass": {
    "cost": 0.024,
    "unit": "g"
  },
  "banane": {
    "cost": 0.014,
    "unit": "g"
  },
  "orange": {
    "cost": 0.005,
    "unit": "g"
  },
  "citron": {
    "cost": 0.01,
    "unit": "g"
  },
  "citron vert": {
    "cost": 0.015,
    "unit": "g"
  },
  "citron vert frais": {
    "cost": 0.015,
    "unit": "g"
  },
  "rondelles de citron": {
    "cost": 0.5,
    "unit": "piece"
  },
  "tranche de citron": {
    "cost": 0.5,
    "unit": "piece"
  },
  "tranches de citron": {
    "cost": 0.5,
    "unit": "piece"
  },
  "pomme": {
    "cost": 0.014,
    "unit": "g"
  },
  "pomme fraiche": {
    "cost": 0.014,
    "unit": "g"
  },
  "pomme verte": {
    "cost": 0.014,
    "unit": "g"
  },
  "fraise": {
    "cost": 0.017,
    "unit": "g"
  },
  "fraises fraiches": {
    "cost": 0.017,
    "unit": "g"
  },
  "fraise fraiche": {
    "cost": 0.017,
    "unit": "g"
  },
  "framboise": {
    "cost": 0.035,
    "unit": "g"
  },
  "framboises fraiches": {
    "cost": 0.035,
    "unit": "g"
  },
  "framboises": {
    "cost": 0.035,
    "unit": "g"
  },
  "puree de framboise": {
    "cost": 0.035,
    "unit": "g"
  },
  "puree de fraise": {
    "cost": 0.017,
    "unit": "g"
  },
  "myrtille": {
    "cost": 0.037,
    "unit": "g"
  },
  "myrtilles": {
    "cost": 0.037,
    "unit": "g"
  },
  "fruits rouges": {
    "cost": 0.043,
    "unit": "g"
  },
  "ananas": {
    "cost": 0.018,
    "unit": "g"
  },
  "peche": {
    "cost": 0.03,
    "unit": "g"
  },
  "peches": {
    "cost": 0.03,
    "unit": "g"
  },
  "peche fraiche": {
    "cost": 0.03,
    "unit": "g"
  },
  "mangue": {
    "cost": 0.031,
    "unit": "g"
  },
  "kiwi": {
    "cost": 0.018,
    "unit": "g"
  },
  "raisin": {
    "cost": 0.045,
    "unit": "g"
  },
  "dattes medjool": {
    "cost": 0.06,
    "unit": "g"
  },
  "dattes": {
    "cost": 0.06,
    "unit": "g"
  },
  "fruit de la passion": {
    "cost": 0.045,
    "unit": "g"
  },
  "fruits frais decor": {
    "cost": 0.025,
    "unit": "g"
  },
  "cafe": {
    "cost": 0.14,
    "unit": "g"
  },
  "cafe espresso": {
    "cost": 0.14,
    "unit": "g"
  },
  "pastille nespresso": {
    "cost": 4.5,
    "unit": "piece"
  },
  "the vert": {
    "cost": 0.092,
    "unit": "g"
  },
  "the vert gunpowder": {
    "cost": 0.092,
    "unit": "g"
  },
  "the noir": {
    "cost": 0.21,
    "unit": "g"
  },
  "menthe": {
    "cost": 0.04,
    "unit": "g"
  },
  "menthe fraiche": {
    "cost": 0.04,
    "unit": "g"
  },
  "verveine": {
    "cost": 0.118,
    "unit": "g"
  },
  "verveine nature": {
    "cost": 0.118,
    "unit": "g"
  },
  "melange plantes infusion": {
    "cost": 0.55,
    "unit": "g"
  },
  "cacao en poudre": {
    "cost": 0.07,
    "unit": "g"
  },
  "cacao": {
    "cost": 0.07,
    "unit": "g"
  },
  "chocolat en poudre": {
    "cost": 0.07,
    "unit": "g"
  },
  "chocolat": {
    "cost": 0.065,
    "unit": "g"
  },
  "chocolat noir": {
    "cost": 0.065,
    "unit": "g"
  },
  "chocolat noir fondu": {
    "cost": 0.065,
    "unit": "g"
  },
  "chocolat au lait": {
    "cost": 0.065,
    "unit": "g"
  },
  "chocolat au lait fondu": {
    "cost": 0.065,
    "unit": "g"
  },
  "fondant chocolat": {
    "cost": 12,
    "unit": "piece"
  },
  "fondant chocolat coeur coulant": {
    "cost": 12,
    "unit": "piece"
  },
  "cheesecake": {
    "cost": 14,
    "unit": "piece"
  },
  "cheesecake san sebastian": {
    "cost": 14,
    "unit": "piece"
  },
  "cheesecake chocolat": {
    "cost": 14,
    "unit": "piece"
  },
  "base frappe vanille": {
    "cost": 0.045,
    "unit": "g"
  },
  "base mixee acai/fruits rouges": {
    "cost": 0.045,
    "unit": "g"
  },
  "boule de glace": {
    "cost": 3.2,
    "unit": "piece"
  },
  "boule de glace vanille": {
    "cost": 3.2,
    "unit": "piece"
  },
  "glace artisanale": {
    "cost": 0.064,
    "unit": "g"
  },
  "glace vanille": {
    "cost": 0.064,
    "unit": "g"
  },
  "glace": {
    "cost": 0.064,
    "unit": "g"
  },
  "glace artisanale au choix": {
    "cost": 0.064,
    "unit": "g"
  },
  "glace vanille artisanale": {
    "cost": 0.064,
    "unit": "g"
  },
  "sucre": {
    "cost": 0.0058,
    "unit": "g"
  },
  "sucre glace": {
    "cost": 0.009,
    "unit": "g"
  },
  "miel": {
    "cost": 0.016,
    "unit": "g"
  },
  "miel pur d'abeille": {
    "cost": 0.016,
    "unit": "g"
  },
  "amlou": {
    "cost": 0.075,
    "unit": "g"
  },
  "nutella": {
    "cost": 0.079,
    "unit": "g"
  },
  "pate de pistache": {
    "cost": 0.14,
    "unit": "g"
  },
  "kunafa": {
    "cost": 0.025,
    "unit": "g"
  },
  "kunafa croustillante": {
    "cost": 0.025,
    "unit": "g"
  },
  "noix": {
    "cost": 0.075,
    "unit": "g"
  },
  "amandes": {
    "cost": 0.08,
    "unit": "g"
  },
  "amandes effilees": {
    "cost": 0.08,
    "unit": "g"
  },
  "noisettes": {
    "cost": 0.16,
    "unit": "g"
  },
  "pistache": {
    "cost": 0.28,
    "unit": "g"
  },
  "pistaches": {
    "cost": 0.28,
    "unit": "g"
  },
  "pistaches concassees": {
    "cost": 0.28,
    "unit": "g"
  },
  "fruits secs": {
    "cost": 0.085,
    "unit": "g"
  },
  "fruits secs varies": {
    "cost": 0.085,
    "unit": "g"
  },
  "graines de chia": {
    "cost": 0.05,
    "unit": "g"
  },
  "granola": {
    "cost": 0.035,
    "unit": "g"
  },
  "granola croustillant": {
    "cost": 0.035,
    "unit": "g"
  },
  "flocons d'avoine": {
    "cost": 0.02,
    "unit": "g"
  },
  "beurre de cacahuete": {
    "cost": 0.04,
    "unit": "g"
  },
  "biscuit speculoos": {
    "cost": 1.5,
    "unit": "piece"
  },
  "biscuit oreo": {
    "cost": 1.4,
    "unit": "piece"
  },
  "chocolat kitkat / snickers": {
    "cost": 4.5,
    "unit": "piece"
  },
  "guimauves": {
    "cost": 0.075,
    "unit": "g"
  },
  "perles de fruits popping boba": {
    "cost": 0.06,
    "unit": "g"
  },
  "sel": {
    "cost": 0.005,
    "unit": "g"
  },
  "poivre": {
    "cost": 0.09,
    "unit": "g"
  },
  "paprika": {
    "cost": 0.038,
    "unit": "g"
  },
  "origan": {
    "cost": 0.078,
    "unit": "g"
  },
  "caramel": {
    "cost": 0.045,
    "unit": "g",
    "label": "Caramel"
  },
  "chou rouge": {
    "cost": 0.008,
    "unit": "g",
    "label": "Chou Rouge"
  },
  "legumes grilles": {
    "cost": 0.018,
    "unit": "g",
    "label": "Légumes Grillés"
  },
  "tapenade": {
    "cost": 0.065,
    "unit": "g",
    "label": "Tapenade"
  },
  "corn flakes": {
    "cost": 0.04,
    "unit": "g",
    "label": "Corn Flakes"
  },
  "feta": {
    "cost": 0.09,
    "unit": "g",
    "label": "Feta"
  },
  "agrumes": {
    "cost": 0.015,
    "unit": "g",
    "label": "Agrumes"
  },
  "farine": {
    "cost": 0.006,
    "unit": "g",
    "label": "Farine"
  },
  "chapelure": {
    "cost": 0.018,
    "unit": "g",
    "label": "Chapelure"
  },
  "persil": {
    "cost": 0.01,
    "unit": "g",
    "label": "Persil"
  },
  "fokacha": {
    "cost": 0.012,
    "unit": "g",
    "label": "Fokacha"
  },
  "dinde fumee": {
    "cost": 0.085,
    "unit": "g",
    "label": "Dinde Fumée"
  },
  "pate a gaufre": {
    "cost": 1.8,
    "unit": "piece",
    "label": "Pâte à Gaufre"
  },
  "pancakes": {
    "cost": 1.2,
    "unit": "piece",
    "label": "Pancake"
  },
  "boules de glace": {
    "cost": 3,
    "unit": "piece",
    "label": "Boule Glace"
  },
  "boule glace": {
    "cost": 3,
    "unit": "piece",
    "label": "Boule Glace"
  },
  "cookies": {
    "cost": 0.05,
    "unit": "g",
    "label": "Cookies"
  },
  "kitkat": {
    "cost": 6,
    "unit": "piece",
    "label": "KitKat"
  },
  "lben": {
    "cost": 0.012,
    "unit": "ml",
    "label": "Lait Fermenté Lben"
  },
  "smarties": {
    "cost": 0.05,
    "unit": "g",
    "label": "Smarties"
  },
  "noisette": {
    "cost": 0.15,
    "unit": "g",
    "label": "Noisette"
  },
  "grenadine": {
    "cost": 0.035,
    "unit": "ml",
    "label": "Sirop Grenadine"
  },
  "muesli": {
    "cost": 0.05,
    "unit": "g",
    "label": "Muesli"
  },
  "acai": {
    "cost": 0.12,
    "unit": "g",
    "label": "Açaï"
  },
  "khlii": {
    "cost": 0.18,
    "unit": "g",
    "label": "Khlii"
  },
  "griche": {
    "cost": 0.12,
    "unit": "g",
    "label": "Griche"
  },
  "confiture": {
    "cost": 0.03,
    "unit": "g",
    "label": "Confiture"
  },
  "pain toast": {
    "cost": 0.8,
    "unit": "piece",
    "label": "Pain Toast"
  },
  "fromage portion": {
    "cost": 1.2,
    "unit": "piece",
    "label": "Fromage Portion"
  },
  "aubergine": {
    "cost": 0.005,
    "unit": "g",
    "label": "Aubergine"
  },
  "cream cheese": {
    "cost": 0.0456,
    "unit": "g",
    "label": "Cream Cheese"
  },
  "fromage burrata": {
    "cost": 35,
    "unit": "piece",
    "label": "Fromage Burrata"
  },
  "croutons": {
    "cost": 0.035,
    "unit": "g",
    "label": "Croûtons"
  },
  "crouton": {
    "cost": 0.035,
    "unit": "g",
    "label": "Croûtons"
  },
  "olive noire": {
    "cost": 0.045,
    "unit": "g",
    "label": "Olives Noires"
  },
  "omelette": {
    "cost": 4.5,
    "unit": "piece",
    "label": "Omelette (Formule)"
  },
  "boisson chaude": {
    "cost": 3.5,
    "unit": "piece",
    "label": "Boisson Chaude (Formule)"
  },
  "dessert": {
    "cost": 1,
    "unit": "piece",
    "label": "Dessert (Formule)"
  },
  "beldi": {
    "cost": 5,
    "unit": "piece",
    "label": "Assortiment Beldi (Brunch)"
  },
  "accompagnements": {
    "cost": 5,
    "unit": "piece",
    "label": "Accompagnements (Formule)"
  },
  "pasta nature ou mini pizza + boisson": {
    "cost": 12,
    "unit": "piece",
    "label": "Plat + Boisson Enfant"
  },
  "ingredients cuisine divers": {
    "cost": 10,
    "unit": "piece",
    "label": "Ingrédients Cuisine Divers"
  },
  "ingredients bar divers": {
    "cost": 5,
    "unit": "piece",
    "label": "Ingrédients Bar Divers"
  },
  "penne": {
    "cost": 0.032,
    "unit": "g",
    "label": "penne"
  }
};

function calculateRecipeFoodCost(ingredients, sellPrice) {
  if (typeof window !== 'undefined' && typeof window.calculateRecipeFoodCost === 'function' && window.calculateRecipeFoodCost !== calculateRecipeFoodCost) {
    return window.calculateRecipeFoodCost(ingredients, sellPrice);
  }
  let totalCost = 0;
  const breakdown = [];
  const validSellPrice = typeof sellPrice === 'number' && sellPrice > 0 ? sellPrice : parseFloat(String(sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
  const costMap = (typeof window !== 'undefined' && window.INGREDIENT_UNIT_COSTS) || INGREDIENT_UNIT_COSTS;

  const cleanStr = (s) => (s || '').toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const stripPlural = (s) => s.split(' ').map(w => w.endsWith('s') && w.length > 3 ? w.slice(0, -1) : w).join(' ');

  (ingredients || []).forEach(line => {
    if (!line || typeof line !== 'string') return;
    const parts = line.split(':');
    const ingName = parts[0].trim();
    const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';

    const normIng = cleanStr(ingName);
    const normIngSingular = stripPlural(normIng);

    // Résolution ciblée des produits à double statut (Brut vs Net)
    let lookupKey = normIngSingular;
    if (normIng.includes('calamar')) {
      lookupKey = (normIng.includes('net') || normIng.includes('chair') || normIng.includes('egoutt') || normIng.includes('frais') || normIng.includes('decongel')) ? 'calamar net' : 'calamar brut';
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
    } else if (normIng === 'oeufs' || normIng === 'oeuf' || (normIng === 'omelette' && (qtyStr.includes('œuf') || qtyStr.includes('oeuf')))) {
      lookupKey = 'oeufs';
    }

    let ingDef = costMap[lookupKey] || costMap[normIng] || costMap[normIngSingular];

    if (!ingDef) {
      const sortedKeys = Object.keys(costMap).sort((a, b) => b.length - a.length);
      for (const k of sortedKeys) {
        const normK = cleanStr(k);
        const normKSingular = stripPlural(normK);
        if (normIng === normK || normIngSingular === normKSingular || normIng.includes(normK) || normK.includes(normIng) || normIngSingular.includes(normKSingular) || normKSingular.includes(normIngSingular)) {
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
    const pMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*(?:p|piece|tranche|part|boule|sachet|portion|tr|œufs|oeufs)\b/i);

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

// ─── Exports Globaux ───
global.INGREDIENT_CATEGORIES = INGREDIENT_CATEGORIES;
global.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;
global.calculateRecipeFoodCost = calculateRecipeFoodCost;

// Support Node.js (require)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INGREDIENT_CATEGORIES, INGREDIENT_UNIT_COSTS, calculateRecipeFoodCost };
}
})(typeof window !== 'undefined' ? window : globalThis);