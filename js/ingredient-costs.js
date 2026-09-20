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
  "eau chaude": {
    "cost": 0,
    "unit": "ml",
    "label": "eau chaude"
  },
  "eau": {
    "cost": 0,
    "unit": "ml",
    "label": "eau"
  },
  "glacons": {
    "cost": 0,
    "unit": "g",
    "label": "glacons"
  },
  "glace pilee": {
    "cost": 0,
    "unit": "g",
    "label": "glace pilee"
  },
  "eau bouillante": {
    "cost": 0,
    "unit": "ml",
    "label": "eau bouillante"
  },
  "orangina (canette 33cl)": {
    "cost": 6.35,
    "unit": "piece",
    "label": "orangina (canette 33cl)"
  },
  "schweppes": {
    "cost": 7.55,
    "unit": "piece",
    "label": "schweppes"
  },
  "schweppes (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece",
    "label": "schweppes (canette 33cl)"
  },
  "poms": {
    "cost": 7.55,
    "unit": "piece",
    "label": "poms"
  },
  "poms (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece",
    "label": "poms (canette 33cl)"
  },
  "hawai": {
    "cost": 7.55,
    "unit": "piece",
    "label": "hawai"
  },
  "hawai canette": {
    "cost": 7.55,
    "unit": "piece",
    "label": "hawai canette"
  },
  "sprite (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece",
    "label": "sprite (canette 33cl)"
  },
  "coca-cola zero (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece",
    "label": "coca-cola zero (canette 33cl)"
  },
  "coca-cola (canette 33cl)": {
    "cost": 7.55,
    "unit": "piece",
    "label": "coca-cola (canette 33cl)"
  },
  "coca-cola": {
    "cost": 7.55,
    "unit": "piece",
    "label": "coca-cola"
  },
  "huile": {
    "cost": 0.02,
    "unit": "ml",
    "label": "huile"
  },
  "huile d'olive": {
    "cost": 0.04,
    "unit": "ml",
    "label": "huile d'olive"
  },
  "demi glace": {
    "cost": 0.05,
    "unit": "ml",
    "label": "demi glace"
  },
  "demi-glace": {
    "cost": 0.05,
    "unit": "ml",
    "label": "demi-glace"
  },
  "moutarde": {
    "cost": 0.02,
    "unit": "g",
    "label": "moutarde"
  },
  "ketchup": {
    "cost": 0.33,
    "unit": "piece",
    "label": "ketchup"
  },
  "sauce exclusive": {
    "cost": 0.04,
    "unit": "g",
    "label": "sauce exclusive"
  },
  "sauce": {
    "cost": 0.03,
    "unit": "g",
    "label": "sauce"
  },
  "sauce burger": {
    "cost": 0.03,
    "unit": "g",
    "label": "sauce burger"
  },
  "sauce pesto": {
    "cost": 0.05,
    "unit": "g",
    "label": "sauce pesto"
  },
  "coulis chocolat chaud": {
    "cost": 0.03,
    "unit": "g",
    "label": "coulis chocolat chaud"
  },
  "coulis fruits rouges": {
    "cost": 0.04,
    "unit": "g",
    "label": "coulis fruits rouges"
  },
  "sauce blanche": {
    "cost": 0.03,
    "unit": "ml",
    "label": "sauce blanche"
  },
  "sauce tomate": {
    "cost": 0.01,
    "unit": "g",
    "label": "sauce tomate"
  },
  "vinaigre balsamique": {
    "cost": 0.02,
    "unit": "ml",
    "label": "vinaigre balsamique"
  },
  "vinaigrette": {
    "cost": 0.03,
    "unit": "g",
    "label": "vinaigrette"
  },
  "sauce vinaigrette": {
    "cost": 0.03,
    "unit": "g",
    "label": "sauce vinaigrette"
  },
  "bouteille oulmes 75cl": {
    "cost": 12.3,
    "unit": "piece",
    "label": "bouteille oulmes 75cl"
  },
  "bouteille oulmes 33/50cl": {
    "cost": 4,
    "unit": "piece",
    "label": "bouteille oulmes 33/50cl"
  },
  "mayonnaise": {
    "cost": 0.02,
    "unit": "g",
    "label": "mayonnaise"
  },
  "sauce exclusive du chef": {
    "cost": 0.04,
    "unit": "g",
    "label": "sauce exclusive du chef"
  },
  "creme": {
    "cost": 0.03,
    "unit": "ml",
    "label": "creme"
  },
  "mousse de lait": {
    "cost": 0.01,
    "unit": "ml",
    "label": "mousse de lait"
  },
  "lait uht": {
    "cost": 0.01,
    "unit": "ml",
    "label": "lait uht"
  },
  "lait chaud": {
    "cost": 0.01,
    "unit": "ml",
    "label": "lait chaud"
  },
  "lait": {
    "cost": 0.01,
    "unit": "ml",
    "label": "lait"
  },
  "eau de coco": {
    "cost": 0.02,
    "unit": "ml",
    "label": "eau de coco"
  },
  "lait de coco": {
    "cost": 0.03,
    "unit": "ml",
    "label": "lait de coco"
  },
  "jus de mangue": {
    "cost": 0.02,
    "unit": "ml",
    "label": "jus de mangue"
  },
  "jus de cranberry": {
    "cost": 0.02,
    "unit": "ml",
    "label": "jus de cranberry"
  },
  "jus de pomme": {
    "cost": 0.01,
    "unit": "ml",
    "label": "jus de pomme"
  },
  "jus d'ananas": {
    "cost": 0.02,
    "unit": "ml",
    "label": "jus d'ananas"
  },
  "sauce cocktail": {
    "cost": 0.03,
    "unit": "g",
    "label": "sauce cocktail"
  },
  "jus de citron vert": {
    "cost": 0.02,
    "unit": "ml",
    "label": "jus de citron vert"
  },
  "jus de citron presse": {
    "cost": 0.01,
    "unit": "ml",
    "label": "jus de citron presse"
  },
  "jus de citron": {
    "cost": 0.01,
    "unit": "ml",
    "label": "jus de citron"
  },
  "bouteille eau minerale 75cl": {
    "cost": 10.4,
    "unit": "piece",
    "label": "bouteille eau minerale 75cl"
  },
  "bouteille eau minerale 50cl": {
    "cost": 2.73,
    "unit": "piece",
    "label": "bouteille eau minerale 50cl"
  },
  "eau minerale": {
    "cost": 0,
    "unit": "ml",
    "label": "eau minerale"
  },
  "eau gazeuse oulmes": {
    "cost": 0.01,
    "unit": "ml",
    "label": "eau gazeuse oulmes"
  },
  "eau gazeuse": {
    "cost": 0.01,
    "unit": "ml",
    "label": "eau gazeuse"
  },
  "glaçons": {
    "cost": 0,
    "unit": "g",
    "label": "glaçons"
  },
  "chantilly": {
    "cost": 0.03,
    "unit": "g",
    "label": "chantilly"
  },
  "creme chantilly": {
    "cost": 0.03,
    "unit": "g",
    "label": "creme chantilly"
  },
  "creme fraiche": {
    "cost": 0.03,
    "unit": "ml",
    "label": "creme fraiche"
  },
  "coulis chocolat": {
    "cost": 0.03,
    "unit": "g",
    "label": "coulis chocolat"
  },
  "sucre de canne": {
    "cost": 0.04,
    "unit": "g",
    "label": "sucre de canne"
  },
  "curacao bleu": {
    "cost": 0.04,
    "unit": "ml",
    "label": "curacao bleu"
  },
  "pesto": {
    "cost": 0.05,
    "unit": "g",
    "label": "pesto"
  },
  "glaçon": {
    "cost": 0,
    "unit": "g",
    "label": "glaçon"
  },
  "coulis caramel": {
    "cost": 0.03,
    "unit": "g",
    "label": "coulis caramel"
  },
  "jus d'orange": {
    "cost": 0.01,
    "unit": "ml",
    "label": "jus d'orange"
  },
  "red bull": {
    "cost": 13.96,
    "unit": "piece",
    "label": "red bull"
  },
  "red bull (canette 250ml)": {
    "cost": 13.96,
    "unit": "piece",
    "label": "red bull (canette 250ml)"
  },
  "orangina": {
    "cost": 6.35,
    "unit": "piece",
    "label": "orangina"
  },
  "pates lasagne": {
    "cost": 0.03,
    "unit": "g",
    "label": "pates lasagne"
  },
  "bacon": {
    "cost": 0.314,
    "unit": "g",
    "label": "bacon"
  },
  "fromage variete": {
    "cost": 0.09,
    "unit": "g",
    "label": "fromage variete"
  },
  "fromages": {
    "cost": 0.09,
    "unit": "g",
    "label": "fromages"
  },
  "edam": {
    "cost": 0.09,
    "unit": "g",
    "label": "edam"
  },
  "gouda": {
    "cost": 0.09,
    "unit": "g",
    "label": "gouda"
  },
  "cheddar": {
    "cost": 0.09,
    "unit": "g",
    "label": "cheddar"
  },
  "bleu": {
    "cost": 0.12,
    "unit": "g",
    "label": "bleu"
  },
  "brie": {
    "cost": 0.11,
    "unit": "g",
    "label": "brie"
  },
  "camembert": {
    "cost": 0.11,
    "unit": "g",
    "label": "camembert"
  },
  "burrata": {
    "cost": 25,
    "unit": "piece",
    "label": "BURRATA"
  },
  "jben": {
    "cost": 0.04,
    "unit": "g",
    "label": "jben"
  },
  "ricotta": {
    "cost": 0.04,
    "unit": "g",
    "label": "ricotta"
  },
  "mascarpone": {
    "cost": 0.13,
    "unit": "g",
    "label": "mascarpone"
  },
  "yaourt grec nature": {
    "cost": 0.03,
    "unit": "g",
    "label": "yaourt grec nature"
  },
  "yaourt": {
    "cost": 0.03,
    "unit": "g",
    "label": "yaourt"
  },
  "beurre": {
    "cost": 0.08,
    "unit": "g",
    "label": "beurre"
  },
  "oeuf": {
    "cost": 1.27,
    "unit": "piece",
    "label": "oeuf"
  },
  "œuf": {
    "cost": 1.27,
    "unit": "piece",
    "label": "œuf"
  },
  "œufs": {
    "cost": 1.27,
    "unit": "piece",
    "label": "œufs"
  },
  "oeuf brouille": {
    "cost": 1.27,
    "unit": "piece",
    "label": "oeuf brouille"
  },
  "oeuf baldi": {
    "cost": 2.7,
    "unit": "piece",
    "label": "oeuf baldi"
  },
  "oeufs de caille": {
    "cost": 0.69,
    "unit": "piece",
    "label": "oeufs de caille"
  },
  "boule de glace": {
    "cost": 3.2,
    "unit": "piece",
    "label": "boule de glace"
  },
  "pain cereal": {
    "cost": 0.94,
    "unit": "piece",
    "label": "pain cereal"
  },
  "poivrons": {
    "cost": 0.01,
    "unit": "g",
    "label": "poivrons"
  },
  "oignon": {
    "cost": 0.01,
    "unit": "g",
    "label": "oignon"
  },
  "oignons": {
    "cost": 0.01,
    "unit": "g",
    "label": "oignons"
  },
  "oignon/ail": {
    "cost": 0.01,
    "unit": "g",
    "label": "oignon/ail"
  },
  "boule de glace vanille": {
    "cost": 3.2,
    "unit": "piece",
    "label": "boule de glace vanille"
  },
  "glace artisanale": {
    "cost": 0.06,
    "unit": "g",
    "label": "glace artisanale"
  },
  "glace vanille": {
    "cost": 0.06,
    "unit": "g",
    "label": "glace vanille"
  },
  "glace": {
    "cost": 0.06,
    "unit": "g",
    "label": "glace"
  },
  "glace artisanale au choix": {
    "cost": 0.06,
    "unit": "g",
    "label": "glace artisanale au choix"
  },
  "glace vanille artisanale": {
    "cost": 0.06,
    "unit": "g",
    "label": "glace vanille artisanale"
  },
  "pomme verte": {
    "cost": 0.01,
    "unit": "g",
    "label": "pomme verte"
  },
  "fraise": {
    "cost": 0.02,
    "unit": "g",
    "label": "fraise"
  },
  "fraises fraiches": {
    "cost": 0.02,
    "unit": "g",
    "label": "fraises fraiches"
  },
  "fraise fraiche": {
    "cost": 0.02,
    "unit": "g",
    "label": "fraise fraiche"
  },
  "framboise": {
    "cost": 0.04,
    "unit": "g",
    "label": "framboise"
  },
  "framboises fraiches": {
    "cost": 0.04,
    "unit": "g",
    "label": "framboises fraiches"
  },
  "framboises": {
    "cost": 0.04,
    "unit": "g",
    "label": "framboises"
  },
  "puree de framboise": {
    "cost": 0.04,
    "unit": "g",
    "label": "puree de framboise"
  },
  "puree de fraise": {
    "cost": 0.02,
    "unit": "g",
    "label": "puree de fraise"
  },
  "myrtille": {
    "cost": 0.04,
    "unit": "g",
    "label": "myrtille"
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
  "leben": {
    "cost": 0.01,
    "unit": "ml",
    "label": "leben"
  },
  "petit lait": {
    "cost": 0.01,
    "unit": "ml",
    "label": "petit lait"
  },
  "infusion the noir": {
    "cost": 0,
    "unit": "ml",
    "label": "infusion the noir"
  },
  "infusion the vert": {
    "cost": 0,
    "unit": "ml",
    "label": "infusion the vert"
  },
  "infusion the fruits rouges": {
    "cost": 0,
    "unit": "ml",
    "label": "infusion the fruits rouges"
  },
  "infusion": {
    "cost": 1.1,
    "unit": "piece",
    "label": "infusion"
  },
  "agrumes": {
    "cost": 0.02,
    "unit": "g",
    "label": "Agrumes"
  },
  "jus d'orange presse": {
    "cost": 0.01,
    "unit": "ml",
    "label": "jus d'orange presse"
  },
  "fondant chocolat coeur coulant": {
    "cost": 12,
    "unit": "piece",
    "label": "fondant chocolat coeur coulant"
  },
  "bacon de boeuf": {
    "cost": 0.314,
    "unit": "g",
    "label": "bacon de boeuf"
  },
  "cheesecake": {
    "cost": 14,
    "unit": "piece",
    "label": "cheesecake"
  },
  "cheesecake san sebastian": {
    "cost": 14,
    "unit": "piece",
    "label": "cheesecake san sebastian"
  },
  "cheesecake chocolat": {
    "cost": 14,
    "unit": "piece",
    "label": "cheesecake chocolat"
  },
  "base frappe vanille": {
    "cost": 0.05,
    "unit": "g",
    "label": "base frappe vanille"
  },
  "volaille": {
    "cost": 0.07,
    "unit": "g",
    "label": "volaille"
  },
  "volaille hachee": {
    "cost": 0.07,
    "unit": "g",
    "label": "volaille hachee"
  },
  "viande hachee": {
    "cost": 0.1,
    "unit": "g",
    "label": "viande hachee"
  },
  "gambas pane": {
    "cost": 0.18,
    "unit": "g",
    "label": "Gambas Pané"
  },
  "calamar brut": {
    "cost": 0.05,
    "unit": "g",
    "label": "Calamar Brut (Congelé / Réception)"
  },
  "calamar net": {
    "cost": 0.16,
    "unit": "g",
    "label": "Calamar Net (Chair / Égoutté)"
  },
  "moules": {
    "cost": 0.06,
    "unit": "g",
    "label": "moules"
  },
  "palourde": {
    "cost": 0.08,
    "unit": "g",
    "label": "palourde"
  },
  "anchois": {
    "cost": 0.11,
    "unit": "g",
    "label": "anchois"
  },
  "mozzarella": {
    "cost": 0.06,
    "unit": "g",
    "label": "mozzarella"
  },
  "parmesan": {
    "cost": 0.15,
    "unit": "g",
    "label": "parmesan"
  },
  "fromage rouge": {
    "cost": 0.1,
    "unit": "g",
    "label": "fromage rouge"
  },
  "fromage": {
    "cost": 0.1,
    "unit": "g",
    "label": "fromage"
  },
  "fromage blanc": {
    "cost": 0.04,
    "unit": "g",
    "label": "fromage blanc"
  },
  "ail": {
    "cost": 0.03,
    "unit": "g",
    "label": "ail"
  },
  "carotte": {
    "cost": 0.01,
    "unit": "g",
    "label": "carotte"
  },
  "carottes fraiches": {
    "cost": 0.01,
    "unit": "g",
    "label": "carottes fraiches"
  },
  "concombre": {
    "cost": 0.01,
    "unit": "g",
    "label": "concombre"
  },
  "pain ciabatta": {
    "cost": 2.2,
    "unit": "piece",
    "label": "pain ciabatta"
  },
  "pain panini": {
    "cost": 2,
    "unit": "piece",
    "label": "pain panini"
  },
  "pain": {
    "cost": 2,
    "unit": "piece",
    "label": "pain"
  },
  "tortilla": {
    "cost": 1.8,
    "unit": "piece",
    "label": "tortilla"
  },
  "pate a pizza": {
    "cost": 0,
    "unit": "g",
    "label": "pate a pizza"
  },
  "pate": {
    "cost": 0.03,
    "unit": "g",
    "label": "pate"
  },
  "spaghetti": {
    "cost": 0.02,
    "unit": "g",
    "label": "spaghetti"
  },
  "spaghettis": {
    "cost": 0.02,
    "unit": "g",
    "label": "spaghettis"
  },
  "pates": {
    "cost": 0.03,
    "unit": "g",
    "label": "pates"
  },
  "pasta": {
    "cost": 0.03,
    "unit": "g",
    "label": "Pâtes / Pasta (Sèche)"
  },
  "tagliatelle": {
    "cost": 0.04,
    "unit": "g",
    "label": "tagliatelle"
  },
  "tagliatelles": {
    "cost": 0.04,
    "unit": "g",
    "label": "tagliatelles"
  },
  "linguine": {
    "cost": 0.04,
    "unit": "g",
    "label": "linguine"
  },
  "riz basmati": {
    "cost": 0.03,
    "unit": "g",
    "label": "riz basmati"
  },
  "riz": {
    "cost": 0.03,
    "unit": "g",
    "label": "riz"
  },
  "quinoa": {
    "cost": 0.06,
    "unit": "g",
    "label": "quinoa"
  },
  "quinoa blanc": {
    "cost": 0.06,
    "unit": "g",
    "label": "quinoa blanc"
  },
  "quinoa noir": {
    "cost": 0.06,
    "unit": "g",
    "label": "quinoa noir"
  },
  "semoule": {
    "cost": 0.01,
    "unit": "g",
    "label": "semoule"
  },
  "haricot vert": {
    "cost": 0.02,
    "unit": "g",
    "label": "haricot vert"
  },
  "betterave": {
    "cost": 0.01,
    "unit": "g",
    "label": "betterave"
  },
  "brocoli": {
    "cost": 0.02,
    "unit": "g",
    "label": "brocoli"
  },
  "radis": {
    "cost": 0.01,
    "unit": "g",
    "label": "radis"
  },
  "petit pois": {
    "cost": 0.02,
    "unit": "g",
    "label": "petit pois"
  },
  "cornichon": {
    "cost": 0.02,
    "unit": "g",
    "label": "cornichon"
  },
  "mais": {
    "cost": 0.03,
    "unit": "g",
    "label": "mais"
  },
  "semoule couscous": {
    "cost": 0.01,
    "unit": "g",
    "label": "semoule couscous"
  },
  "poivron": {
    "cost": 0.01,
    "unit": "g",
    "label": "poivron"
  },
  "viande": {
    "cost": 0.1,
    "unit": "g",
    "label": "viande"
  },
  "steak de boeuf": {
    "cost": 0.1,
    "unit": "g",
    "label": "steak de boeuf"
  },
  "emince de boeuf": {
    "cost": 0.11,
    "unit": "g",
    "label": "emince de boeuf"
  },
  "viande tajine": {
    "cost": 0.09,
    "unit": "g",
    "label": "viande tajine"
  },
  "merguez": {
    "cost": 0.1,
    "unit": "g",
    "label": "merguez"
  },
  "sucre": {
    "cost": 0.01,
    "unit": "g",
    "label": "sucre"
  },
  "sucre glace": {
    "cost": 0.01,
    "unit": "g",
    "label": "sucre glace"
  },
  "miel": {
    "cost": 0.02,
    "unit": "g",
    "label": "miel"
  },
  "miel pur d'abeille": {
    "cost": 0.02,
    "unit": "g",
    "label": "miel pur d'abeille"
  },
  "myrtilles": {
    "cost": 0.04,
    "unit": "g",
    "label": "myrtilles"
  },
  "fruits rouges": {
    "cost": 0.04,
    "unit": "g",
    "label": "fruits rouges"
  },
  "ananas": {
    "cost": 0.02,
    "unit": "g",
    "label": "ananas"
  },
  "peche": {
    "cost": 0.03,
    "unit": "g",
    "label": "peche"
  },
  "peches": {
    "cost": 0.03,
    "unit": "g",
    "label": "peches"
  },
  "peche fraiche": {
    "cost": 0.03,
    "unit": "g",
    "label": "peche fraiche"
  },
  "mangue": {
    "cost": 0.03,
    "unit": "g",
    "label": "mangue"
  },
  "kiwi": {
    "cost": 0.02,
    "unit": "g",
    "label": "kiwi"
  },
  "raisin": {
    "cost": 0.05,
    "unit": "g",
    "label": "raisin"
  },
  "dattes medjool": {
    "cost": 0.06,
    "unit": "g",
    "label": "dattes medjool"
  },
  "amlou": {
    "cost": 0.08,
    "unit": "g",
    "label": "amlou"
  },
  "pate de pistache": {
    "cost": 0.14,
    "unit": "g",
    "label": "pate de pistache"
  },
  "saucisse": {
    "cost": 0.11,
    "unit": "g",
    "label": "saucisse"
  },
  "saucisses": {
    "cost": 0.11,
    "unit": "g",
    "label": "saucisses"
  },
  "khli3": {
    "cost": 0.11,
    "unit": "g",
    "label": "khli3"
  },
  "charcuterie": {
    "cost": 0.06,
    "unit": "g",
    "label": "charcuterie"
  },
  "charcuteries": {
    "cost": 0.06,
    "unit": "g",
    "label": "charcuteries"
  },
  "charcuterie de dinde": {
    "cost": 0.07,
    "unit": "g",
    "label": "charcuterie de dinde"
  },
  "jambon de dinde": {
    "cost": 0.09,
    "unit": "g",
    "label": "jambon de dinde"
  },
  "salami": {
    "cost": 0.09,
    "unit": "g",
    "label": "salami"
  },
  "pepperoni": {
    "cost": 0.12,
    "unit": "g",
    "label": "pepperoni"
  },
  "peperoni": {
    "cost": 0.12,
    "unit": "g",
    "label": "peperoni"
  },
  "nuggets": {
    "cost": 0.05,
    "unit": "g",
    "label": "nuggets"
  },
  "saumon brut": {
    "cost": 0.13,
    "unit": "g",
    "label": "Saumon Brut (Avec carcasse)"
  },
  "dattes": {
    "cost": 0.06,
    "unit": "g",
    "label": "dattes"
  },
  "fruit de la passion": {
    "cost": 0.05,
    "unit": "g",
    "label": "fruit de la passion"
  },
  "base mixee acai/fruits rouges": {
    "cost": 0.05,
    "unit": "g",
    "label": "base mixee acai/fruits rouges"
  },
  "gambas brut": {
    "cost": 0.06,
    "unit": "g",
    "label": "Gambas Brut (Avec coquille)"
  },
  "crevettes brut": {
    "cost": 0.06,
    "unit": "g",
    "label": "Crevettes Brut (Avec coquille / Réception)"
  },
  "saumon fume": {
    "cost": 0.28,
    "unit": "g",
    "label": "saumon fume"
  },
  "saumon frais net": {
    "cost": 0.18,
    "unit": "g",
    "label": "Saumon Frais Net (Pavé / Filet)"
  },
  "champignons": {
    "cost": 0.06,
    "unit": "g",
    "label": "champignons"
  },
  "kunafa croustillante": {
    "cost": 0.03,
    "unit": "g",
    "label": "kunafa croustillante"
  },
  "noix": {
    "cost": 0.08,
    "unit": "g",
    "label": "noix"
  },
  "amandes": {
    "cost": 0.08,
    "unit": "g",
    "label": "amandes"
  },
  "amandes effilees": {
    "cost": 0.08,
    "unit": "g",
    "label": "amandes effilees"
  },
  "noisettes": {
    "cost": 0.16,
    "unit": "g",
    "label": "noisettes"
  },
  "pistache": {
    "cost": 0.28,
    "unit": "g",
    "label": "pistache"
  },
  "pistaches": {
    "cost": 0.28,
    "unit": "g",
    "label": "pistaches"
  },
  "guimauves": {
    "cost": 0.08,
    "unit": "g",
    "label": "guimauves"
  },
  "olive noire": {
    "cost": 0.05,
    "unit": "g",
    "label": "Olives Noires"
  },
  "omelette": {
    "cost": 4.5,
    "unit": "piece",
    "label": "Omelette (Formule)"
  },
  "farine": {
    "cost": 0.01,
    "unit": "g",
    "label": "Farine"
  },
  "orange": {
    "cost": 0.01,
    "unit": "g",
    "label": "orange"
  },
  "banane": {
    "cost": 0.01,
    "unit": "g",
    "label": "banane"
  },
  "garniture composee": {
    "cost": 0.02,
    "unit": "g",
    "label": "garniture composee"
  },
  "garnitures composees": {
    "cost": 0.02,
    "unit": "g",
    "label": "garnitures composees"
  },
  "legumes varies": {
    "cost": 0.01,
    "unit": "g",
    "label": "legumes varies"
  },
  "legumes couscous": {
    "cost": 0.01,
    "unit": "g",
    "label": "legumes couscous"
  },
  "legumes": {
    "cost": 0.01,
    "unit": "g",
    "label": "legumes"
  },
  "sel": {
    "cost": 0.01,
    "unit": "g",
    "label": "sel"
  },
  "poivre": {
    "cost": 0.09,
    "unit": "g",
    "label": "poivre"
  },
  "paprika": {
    "cost": 0.04,
    "unit": "g",
    "label": "paprika"
  },
  "origan": {
    "cost": 0.08,
    "unit": "g",
    "label": "origan"
  },
  "caramel": {
    "cost": 0.05,
    "unit": "g",
    "label": "Caramel"
  },
  "legumes grilles": {
    "cost": 0.02,
    "unit": "g",
    "label": "Légumes Grillés"
  },
  "tapenade": {
    "cost": 0.07,
    "unit": "g",
    "label": "Tapenade"
  },
  "pain burger": {
    "cost": 2.5,
    "unit": "piece",
    "label": "pain burger"
  },
  "pain de mie complet": {
    "cost": 0.78,
    "unit": "piece",
    "label": "pain de mie complet"
  },
  "pain de mie": {
    "cost": 0.78,
    "unit": "piece",
    "label": "pain de mie"
  },
  "pain complet": {
    "cost": 0.78,
    "unit": "piece",
    "label": "pain complet"
  },
  "pain seigle": {
    "cost": 0.94,
    "unit": "piece",
    "label": "pain seigle"
  },
  "pain cereales": {
    "cost": 0.94,
    "unit": "piece",
    "label": "pain cereales"
  },
  "linguines": {
    "cost": 0.04,
    "unit": "g",
    "label": "linguines"
  },
  "rigatoni": {
    "cost": 0.04,
    "unit": "g",
    "label": "rigatoni"
  },
  "spaghettis noirs": {
    "cost": 0.07,
    "unit": "g",
    "label": "spaghettis noirs"
  },
  "frites": {
    "cost": 0.02,
    "unit": "g",
    "label": "frites"
  },
  "potatos": {
    "cost": 0.03,
    "unit": "g",
    "label": "potatos"
  },
  "puree de pomme de terre": {
    "cost": 0.02,
    "unit": "g",
    "label": "puree de pomme de terre"
  },
  "puree": {
    "cost": 0.02,
    "unit": "g",
    "label": "puree"
  },
  "pomme de terre": {
    "cost": 0.01,
    "unit": "g",
    "label": "pomme de terre"
  },
  "croissant": {
    "cost": 2,
    "unit": "piece",
    "label": "croissant"
  },
  "pain au chocolat": {
    "cost": 2,
    "unit": "piece",
    "label": "pain au chocolat"
  },
  "perles de fruits popping boba": {
    "cost": 0.06,
    "unit": "g",
    "label": "perles de fruits popping boba"
  },
  "pistaches concassees": {
    "cost": 0.28,
    "unit": "g",
    "label": "pistaches concassees"
  },
  "fruits secs": {
    "cost": 0.09,
    "unit": "g",
    "label": "fruits secs"
  },
  "fruits secs varies": {
    "cost": 0.09,
    "unit": "g",
    "label": "fruits secs varies"
  },
  "graines de chia": {
    "cost": 0.05,
    "unit": "g",
    "label": "graines de chia"
  },
  "granola": {
    "cost": 0.04,
    "unit": "g",
    "label": "granola"
  },
  "granola croustillant": {
    "cost": 0.04,
    "unit": "g",
    "label": "granola croustillant"
  },
  "flocons d'avoine": {
    "cost": 0.02,
    "unit": "g",
    "label": "flocons d'avoine"
  },
  "beurre de cacahuete": {
    "cost": 0.04,
    "unit": "g",
    "label": "beurre de cacahuete"
  },
  "biscuit speculoos": {
    "cost": 1.5,
    "unit": "piece",
    "label": "biscuit speculoos"
  },
  "biscuit oreo": {
    "cost": 1.4,
    "unit": "piece",
    "label": "biscuit oreo"
  },
  "chocolat kitkat / snickers": {
    "cost": 4.5,
    "unit": "piece",
    "label": "chocolat kitkat / snickers"
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
    "cost": 0.03,
    "unit": "g",
    "label": "penne"
  },
  "gingembre frais rape": {
    "cost": 0.03,
    "unit": "g",
    "label": "gingembre frais rape"
  },
  "gingembre frais": {
    "cost": 0.03,
    "unit": "g",
    "label": "gingembre frais"
  },
  "gingembre": {
    "cost": 0.03,
    "unit": "g",
    "label": "gingembre"
  },
  "gambas net": {
    "cost": 0.21,
    "unit": "g",
    "label": "Gambas Net (Chair décortiquée / Pochée)"
  },
  "crevettes net": {
    "cost": 0.21,
    "unit": "g",
    "label": "Crevettes Net (Chair décortiquée)"
  },
  "citron": {
    "cost": 0.014,
    "unit": "g",
    "label": "citron"
  },
  "avocat hass": {
    "cost": 0.05,
    "unit": "g",
    "label": "avocat hass"
  },
  "avocat": {
    "cost": 0.05,
    "unit": "g",
    "label": "avocat"
  },
  "chocolat au lait": {
    "cost": 0.07,
    "unit": "g",
    "label": "chocolat au lait"
  },
  "chocolat noir fondu": {
    "cost": 0.07,
    "unit": "g",
    "label": "chocolat noir fondu"
  },
  "chocolat noir": {
    "cost": 0.07,
    "unit": "g",
    "label": "chocolat noir"
  },
  "chocolat": {
    "cost": 0.07,
    "unit": "g",
    "label": "chocolat"
  },
  "chocolat en poudre": {
    "cost": 0.07,
    "unit": "g",
    "label": "chocolat en poudre"
  },
  "cacao": {
    "cost": 0.07,
    "unit": "g",
    "label": "cacao"
  },
  "cacao en poudre": {
    "cost": 0.07,
    "unit": "g",
    "label": "cacao en poudre"
  },
  "melange plantes infusion": {
    "cost": 0.55,
    "unit": "g",
    "label": "melange plantes infusion"
  },
  "verveine nature": {
    "cost": 0.12,
    "unit": "g",
    "label": "verveine nature"
  },
  "verveine": {
    "cost": 0.12,
    "unit": "g",
    "label": "verveine"
  },
  "menthe fraiche": {
    "cost": 0.04,
    "unit": "g",
    "label": "menthe fraiche"
  },
  "menthe": {
    "cost": 0.04,
    "unit": "g",
    "label": "menthe"
  },
  "the noir": {
    "cost": 0.21,
    "unit": "g",
    "label": "the noir"
  },
  "the vert gunpowder": {
    "cost": 0.09,
    "unit": "g",
    "label": "the vert gunpowder"
  },
  "the vert": {
    "cost": 0.09,
    "unit": "g",
    "label": "the vert"
  },
  "pastille nespresso": {
    "cost": 4.5,
    "unit": "piece",
    "label": "pastille nespresso"
  },
  "cafe espresso": {
    "cost": 0.14,
    "unit": "g",
    "label": "cafe espresso"
  },
  "chou rouge": {
    "cost": 0.01,
    "unit": "g",
    "label": "Chou Rouge"
  },
  "citron vert": {
    "cost": 0.02,
    "unit": "g",
    "label": "citron vert"
  },
  "fondant chocolat": {
    "cost": 12,
    "unit": "piece",
    "label": "fondant chocolat"
  },
  "citron vert frais": {
    "cost": 0.02,
    "unit": "g",
    "label": "citron vert frais"
  },
  "rondelles de citron": {
    "cost": 0.5,
    "unit": "piece",
    "label": "rondelles de citron"
  },
  "tranche de citron": {
    "cost": 0.5,
    "unit": "piece",
    "label": "tranche de citron"
  },
  "tranches de citron": {
    "cost": 0.5,
    "unit": "piece",
    "label": "tranches de citron"
  },
  "pomme": {
    "cost": 0.01,
    "unit": "g",
    "label": "pomme"
  },
  "pomme fraiche": {
    "cost": 0.01,
    "unit": "g",
    "label": "pomme fraiche"
  },
  "lben": {
    "cost": 0.01,
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
  "chocolat au lait fondu": {
    "cost": 0.07,
    "unit": "g",
    "label": "chocolat au lait fondu"
  },
  "aubergine": {
    "cost": 0.01,
    "unit": "g",
    "label": "Aubergine"
  },
  "cream cheese": {
    "cost": 0.05,
    "unit": "g",
    "label": "Cream Cheese"
  },
  "pain cake": {
    "cost": 2,
    "unit": "piece",
    "label": "pain cake"
  },
  "toast hollandais": {
    "cost": 2.5,
    "unit": "piece",
    "label": "toast hollandais"
  },
  "croquettes fromage": {
    "cost": 3,
    "unit": "piece",
    "label": "croquettes fromage"
  },
  "croquettes": {
    "cost": 3,
    "unit": "piece",
    "label": "croquettes"
  },
  "croque maison": {
    "cost": 6.5,
    "unit": "piece",
    "label": "croque maison"
  },
  "salade": {
    "cost": 0.01,
    "unit": "g",
    "label": "salade"
  },
  "salade rouge": {
    "cost": 0.01,
    "unit": "g",
    "label": "salade rouge"
  },
  "salade mesclun": {
    "cost": 0.01,
    "unit": "g",
    "label": "salade mesclun"
  },
  "laitue": {
    "cost": 0.01,
    "unit": "g",
    "label": "laitue"
  },
  "mesclun": {
    "cost": 0.01,
    "unit": "g",
    "label": "mesclun"
  },
  "mesclun salade": {
    "cost": 0.01,
    "unit": "g",
    "label": "mesclun salade"
  },
  "roquette": {
    "cost": 0.02,
    "unit": "g",
    "label": "roquette"
  },
  "epinard": {
    "cost": 0.02,
    "unit": "g",
    "label": "epinard"
  },
  "epinards": {
    "cost": 0.02,
    "unit": "g",
    "label": "epinards"
  },
  "cafe": {
    "cost": 0.14,
    "unit": "g",
    "label": "cafe"
  },
  "tomate": {
    "cost": 0.01,
    "unit": "g",
    "label": "tomate"
  },
  "tomates": {
    "cost": 0.01,
    "unit": "g",
    "label": "tomates"
  },
  "tomate cerise": {
    "cost": 0.02,
    "unit": "g",
    "label": "tomate cerise"
  },
  "tomates cerises": {
    "cost": 0.02,
    "unit": "g",
    "label": "tomates cerises"
  },
  "champignon": {
    "cost": 0.04,
    "unit": "g",
    "label": "champignon"
  },
  "courgette": {
    "cost": 0.01,
    "unit": "g",
    "label": "courgette"
  },
  "olives vertes": {
    "cost": 0.03,
    "unit": "g",
    "label": "olives vertes"
  },
  "olive verte": {
    "cost": 0.03,
    "unit": "g",
    "label": "olive verte"
  },
  "capres": {
    "cost": 0.03,
    "unit": "g",
    "label": "capres"
  },
  "fruits frais decor": {
    "cost": 0.03,
    "unit": "g",
    "label": "fruits frais decor"
  },
  "kunafa": {
    "cost": 0.03,
    "unit": "g",
    "label": "kunafa"
  },
  "mlaoui": {
    "cost": 1.5,
    "unit": "piece",
    "label": "mlaoui"
  },
  "sirop fraise": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop fraise"
  },
  "sirop de sucre de canne": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop de sucre de canne"
  },
  "sirop de peche": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop de peche"
  },
  "sirop": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop"
  },
  "sirop grenadine": {
    "cost": 0.04,
    "unit": "ml",
    "label": "sirop grenadine"
  },
  "sirop menthe": {
    "cost": 0.04,
    "unit": "ml",
    "label": "sirop menthe"
  },
  "grenadine": {
    "cost": 0.156,
    "unit": "ml",
    "label": "Sirop Grenadine"
  },
  "sirop mojito": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop mojito"
  },
  "oulmes tropical": {
    "cost": 7,
    "unit": "piece",
    "label": "OULMES TROPICAL"
  },
  "oulmes mojito": {
    "cost": 7,
    "unit": "piece",
    "label": "OULMES MOJITO"
  },
  "blanc de poulet": {
    "cost": 0.055,
    "unit": "g",
    "label": "blanc de poulet"
  },
  "olives": {
    "cost": 0.04,
    "unit": "g",
    "label": "olives"
  },
  "olives noires": {
    "cost": 0.04,
    "unit": "g",
    "label": "olives noires"
  },
  "maïs": {
    "cost": 0.03,
    "unit": "g",
    "label": "maïs"
  },
  "msemen": {
    "cost": 1.5,
    "unit": "piece",
    "label": "msemen"
  },
  "sirop vanille": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop vanille"
  },
  "harcha": {
    "cost": 1.2,
    "unit": "piece",
    "label": "harcha"
  },
  "baghrir": {
    "cost": 1.2,
    "unit": "piece",
    "label": "baghrir"
  },
  "pate a crepe": {
    "cost": 1.8,
    "unit": "piece",
    "label": "pate a crepe"
  },
  "pancake": {
    "cost": 2,
    "unit": "piece",
    "label": "pancake"
  },
  "gaufre": {
    "cost": 3,
    "unit": "piece",
    "label": "gaufre"
  },
  "muffin": {
    "cost": 3.5,
    "unit": "piece",
    "label": "muffin"
  },
  "viennoiserie": {
    "cost": 2,
    "unit": "piece",
    "label": "viennoiserie"
  },
  "crouton": {
    "cost": 0.04,
    "unit": "g",
    "label": "Croûtons"
  },
  "fromage burrata": {
    "cost": 35,
    "unit": "piece",
    "label": "Fromage Burrata"
  },
  "sirop framboise": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop framboise"
  },
  "sirop caramel": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop caramel"
  },
  "sirop curaçao bleu": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop curaçao bleu"
  },
  "poulet": {
    "cost": 0.055,
    "unit": "g",
    "label": "poulet"
  },
  "poulet pane": {
    "cost": 0.053,
    "unit": "g",
    "label": "poulet pane"
  },
  "sirop de canne": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop de canne"
  },
  "sirop de citron": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop de citron"
  },
  "sirop de grenadine": {
    "cost": 0.04,
    "unit": "ml",
    "label": "sirop de grenadine"
  },
  "sirop de passion": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop de passion"
  },
  "croutons": {
    "cost": 0.04,
    "unit": "g",
    "label": "Croûtons"
  },
  "chapelure": {
    "cost": 0.02,
    "unit": "g",
    "label": "Chapelure"
  },
  "persil": {
    "cost": 0.01,
    "unit": "g",
    "label": "Persil"
  },
  "fokacha": {
    "cost": 0.01,
    "unit": "g",
    "label": "Fokacha"
  },
  "dinde fumee": {
    "cost": 0.09,
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
  "sirop peche": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop peche"
  },
  "sirop passion": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop passion"
  },
  "sirop noisette": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop noisette"
  },
  "filet": {
    "cost": 0.18,
    "unit": "g",
    "label": "filet"
  },
  "filet de boeuf": {
    "cost": 0.18,
    "unit": "g",
    "label": "filet de boeuf"
  },
  "poulet grille": {
    "cost": 0.055,
    "unit": "g",
    "label": "poulet grille"
  },
  "poulet hache": {
    "cost": 0.055,
    "unit": "g",
    "label": "poulet hache"
  },
  "poulet emince": {
    "cost": 0.055,
    "unit": "g",
    "label": "poulet emince"
  },
  "nutella": {
    "cost": 0.085,
    "unit": "g",
    "label": "nutella"
  },
  "sirop sucre de canne": {
    "cost": 0.156,
    "unit": "ml",
    "label": "sirop sucre de canne"
  },
  "oeufs": {
    "cost": 1.1,
    "unit": "piece",
    "label": "œufs"
  },
  "oeufs au plat": {
    "cost": 1.1,
    "unit": "piece",
    "label": "oeufs au plat"
  },
  "oeufs frais": {
    "cost": 1.1,
    "unit": "piece",
    "label": "oeufs frais"
  },
  "thon": {
    "cost": 0.124,
    "unit": "g",
    "label": "thon"
  },
  "boisson chaude": {
    "cost": 2,
    "unit": "piece",
    "label": "Boisson Chaude (Formule)"
  },
  "eau minerale 33cl": {
    "cost": 1.65,
    "unit": "piece",
    "label": "eau minerale 33cl"
  },
  "bouteille eau minerale 33cl": {
    "cost": 1.65,
    "unit": "piece",
    "label": "bouteille eau minerale 33cl"
  },
  "dessert": {
    "cost": 1.6,
    "unit": "piece",
    "label": "Dessert (Formule)"
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