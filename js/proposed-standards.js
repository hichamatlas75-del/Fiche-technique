/**
 * GREY CORNER — Base des Fiches Techniques Proposées (Normes Internationales)
 * Fiches calibrées selon les standards hôteliers internationaux (Portioning, Yield & Cost Control)
 * Utilisé conjointement avec recipes-data.js pour la comparaison avec les normes internationales F&B
 */

(function(global) {

  // Bibliothèque des Fiches Standards Recommandées par Catégorie et Nom
  const PROPOSED_STANDARDS = {
    // ==========================================
    // 🍕 1. PIZZAS (Standard International 28-30cm)
    // ==========================================
    "MARGARITA": {
      category: "PIZZA",
      standardPortionWeight: "440 g",
      rationale: "Pâton calibré à 230g (au lieu de 330g) + Mozzarella à 110g (au lieu de 200g qui détrempait la pâte). Pâte croustillante et Food Cost maîtrisé à ~17%.",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 110 g",
        "Sauce tomate : 85 g",
        "Huile d'olive : 5 ml",
        "Origan : 1 g",
        "Olives noires : 15 g"
      ]
    },
    "THON": {
      category: "PIZZA",
      standardPortionWeight: "460 g",
      rationale: "Thon égoutté calibré à 75g (au lieu de 100g) + Mozzarella 105g. Équilibre parfait saveur/moelleux sans excès d'huile.",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 105 g",
        "Sauce tomate : 85 g",
        "Thon : 75 g",
        "Oignons : 30 g",
        "Olives noires : 15 g",
        "Origan : 1 g"
      ]
    },
    "VÉGÉTARIENNE": {
      category: "PIZZA",
      standardPortionWeight: "480 g",
      rationale: "Légumes frais pré-rôtis (poivrons, champignons, courgettes) 120g + Mozzarella 100g.",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 100 g",
        "Sauce tomate : 85 g",
        "Champignons : 40 g",
        "Poivrons : 40 g",
        "Courgettes : 30 g",
        "Olives noires : 15 g",
        "Origan : 1 g"
      ]
    },
    "VIANDE HACHÉE": {
      category: "PIZZA",
      standardPortionWeight: "470 g",
      rationale: "Viande hachée 100% bœuf assaisonnée 85g + Mozzarella 110g.",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 110 g",
        "Sauce tomate : 85 g",
        "Viande hachée : 85 g",
        "Oignons : 25 g",
        "Origan : 1 g"
      ]
    },
    "POULET": {
      category: "PIZZA",
      standardPortionWeight: "470 g",
      rationale: "Émincé de blanc de poulet mariné 85g + Mozzarella 110g + Sauce tomate 85g.",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 110 g",
        "Sauce tomate : 85 g",
        "Poulet : 85 g",
        "Poivrons : 30 g",
        "Origan : 1 g"
      ]
    },
    "5 FROMAGES": {
      category: "PIZZA",
      standardPortionWeight: "480 g",
      rationale: "Mélange harmonieux de 5 fromages totalisant 135g (Mozza 70g, Bleu 20g, Gouda 20g, Chèvre 15g, Parmesan 10g) au lieu de 220g.",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 70 g",
        "Fromage bleu : 20 g",
        "Gouda : 20 g",
        "Chèvre : 15 g",
        "Parmesan : 10 g",
        "Sauce tomate : 80 g",
        "Origan : 1 g"
      ]
    },
    "FRUITS DE MER": {
      category: "PIZZA",
      standardPortionWeight: "470 g",
      rationale: "Crevettes 50g + Calamars 50g égouttés + Ail persillé + Mozzarella 100g.",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 100 g",
        "Sauce tomate : 85 g",
        "Crevettes : 50 g",
        "Calamar : 50 g",
        "Ail & Persil : 5 g",
        "Origan : 1 g"
      ]
    },
    "REGINA": {
      category: "PIZZA",
      standardPortionWeight: "460 g",
      rationale: "Dinde fumée / Charcuterie 60g + Champignons de Paris frais 40g + Mozzarella 110g.",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 110 g",
        "Sauce tomate : 85 g",
        "Charcuterie : 60 g",
        "Champignons : 40 g",
        "Olives noires : 15 g",
        "Origan : 1 g"
      ]
    },
    "PEPPERONI": {
      category: "PIZZA",
      standardPortionWeight: "440 g",
      rationale: "Tranches fines de pepperoni/salami piquant 50g (10-12 tranches) + Mozzarella 115g.",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 115 g",
        "Sauce tomate : 85 g",
        "Charcuterie : 50 g",
        "Origan : 1 g"
      ]
    },
    "4 SAISONS": {
      category: "PIZZA",
      standardPortionWeight: "480 g",
      rationale: "4 cadrans équilibrés : Champignons (30g), Artichauts/Poivrons (30g), Charcuterie (30g), Olives (15g).",
      tech: [
        "Pâte : 230 g",
        "Mozzarella : 105 g",
        "Sauce tomate : 85 g",
        "Champignons : 30 g",
        "Poivrons : 30 g",
        "Charcuterie : 30 g",
        "Olives noires : 15 g",
        "Origan : 1 g"
      ]
    },

    // ==========================================
    // 🥩 2. PLATS (Standards Hôtellerie 450g-500g assiette)
    // ==========================================
    "FILET DE BŒUF": {
      category: "PLATS",
      standardPortionWeight: "480 g",
      rationale: "Pièce noble de bœuf calibrée à 200g brut (vs 250g) + Sauce poivre/champignon 50ml + Frites 160g + Légumes vapeur 70g.",
      tech: [
        "Filet de bœuf : 200 g",
        "Demi-glace : 50 ml",
        "Crème fraîche : 30 ml",
        "Frites : 160 g",
        "Légumes variés : 70 g",
        "Beurre : 10 g",
        "Huile : 15 ml"
      ]
    },
    "PAVÉ DE SAUMON": {
      category: "PLATS",
      standardPortionWeight: "450 g",
      rationale: "Pavé de saumon frais 180g (vs 220g) à la plancha + Riz pilaf 150g ou Légumes sautés 80g + Sauce citron aneth 40ml.",
      tech: [
        "Saumon : 180 g",
        "Riz : 150 g",
        "Légumes variés : 80 g",
        "Beurre : 10 g",
        "Citron : 20 g",
        "Crème fraîche : 30 ml",
        "Huile d'olive : 10 ml"
      ]
    },
    "BROCHETTES DE POULET": {
      category: "PLATS",
      standardPortionWeight: "460 g",
      rationale: "2 brochettes calibrées de 90g (180g total) + Frites 160g + Salade mesclun assaisonnée 40g + Sauce 30ml.",
      tech: [
        "Blanc de poulet : 180 g",
        "Sauce barbecue : 30 g",
        "Salade rouge : 40 g",
        "Vinaigrette : 15 ml",
        "Frites : 160 g",
        "Pain : 1 p"
      ]
    },
    "EMINCE DE POULET": {
      category: "PLATS",
      standardPortionWeight: "480 g",
      rationale: "Poulet 160g + Champignons de Paris 50g (au lieu de 90g) + Sauce crème champignon 80ml (au lieu de 200ml crème+demi-glace) + Huile 15ml (au lieu de 50ml).",
      tech: [
        "Poulet : 160 g",
        "Champignons : 50 g",
        "Crème fraîche : 60 ml",
        "Demi-glace : 40 ml",
        "Légumes variés : 80 g",
        "Frites : 160 g",
        "Huile : 15 ml"
      ]
    },
    "BALLOTINE DE POULET AU CŒUR D'ÉPINARDS ET FROMAGE": {
      category: "PLATS",
      standardPortionWeight: "480 g",
      rationale: "Volaille 170g garnie de 35g épinards et 25g fromage affiné + Sauce suprême 50ml + Écrasé de pomme de terre ou frites 160g.",
      tech: [
        "Poulet : 170 g",
        "Épinards : 35 g",
        "Fromage : 25 g",
        "Crème fraîche : 50 ml",
        "Frites : 160 g",
        "Légumes variés : 70 g",
        "Beurre : 10 g"
      ]
    },
    "CORDON BLEU MAISON": {
      category: "PLATS",
      standardPortionWeight: "460 g",
      rationale: "Escalope de poulet 150g garnie de charcuterie 30g et cheddar/fromage 30g panée à l'anglaise + Frites 160g + Salade 40g.",
      tech: [
        "Poulet : 150 g",
        "Charcuterie : 30 g",
        "Fromage : 30 g",
        "Chapelure : 30 g",
        "Œuf : 1 p",
        "Frites : 160 g",
        "Salade : 40 g"
      ]
    },
    "FAJITAS POULET": {
      category: "PLATS",
      standardPortionWeight: "490 g",
      rationale: "Poêlée poulet mariné 150g + Poivrons/oignons 90g + 3 tortillas de blé + Guacamole 30g + Sauce salsa 30g.",
      tech: [
        "Poulet : 150 g",
        "Poivrons : 50 g",
        "Oignons : 40 g",
        "Tortilla : 3 p",
        "Fromage : 30 g",
        "Sauce cocktail : 30 g"
      ]
    },

    // ==========================================
    // 🍝 3. PÂTES (Standards portion al dente 350-400g finie)
    // ==========================================
    "POULET CHAMPIGNON": {
      category: "PÂTES",
      standardPortionWeight: "380 g",
      rationale: "Pâtes sèches crues 110g (donne 230g cuit) + Poulet 90g + Champignons 40g + Sauce crème 120ml + Grana Padano 15g.",
      tech: [
        "Pâtes : 110 g",
        "Poulet : 90 g",
        "Champignons : 40 g",
        "Crème fraîche : 120 ml",
        "Parmesan : 15 g",
        "Beurre : 10 g"
      ]
    },
    "BOLOGNAISE": {
      category: "PÂTES",
      standardPortionWeight: "380 g",
      rationale: "Pâtes sèches crues 110g + Sauce bolognaise maison mijotée (100g bœuf haché + 80g coulis tomate aux herbes) + Parmesan 15g.",
      tech: [
        "Pâtes : 110 g",
        "Viande hachée : 100 g",
        "Sauce tomate : 80 g",
        "Parmesan : 15 g",
        "Huile d'olive : 10 ml"
      ]
    },
    "PÂTES 5 FROMAGES": {
      category: "PÂTES",
      standardPortionWeight: "370 g",
      rationale: "Pâtes 110g + Sauce onctueuse aux 5 fromages totalisant 75g (Gorgonzola, Mozza, Emmental, Chèvre, Parmesan) + 80ml crème.",
      tech: [
        "Pâtes : 110 g",
        "Mozzarella : 25 g",
        "Fromage bleu : 15 g",
        "Gouda : 15 g",
        "Chèvre : 10 g",
        "Parmesan : 15 g",
        "Crème fraîche : 80 ml"
      ]
    },
    "FRUITS DE MER (PÂTES)": {
      category: "PÂTES",
      standardPortionWeight: "390 g",
      rationale: "Pâtes 110g + Crevettes décortiquées 60g + Calamars 60g + Tomates cerises / Ail persillé + Huile d'olive 15ml.",
      tech: [
        "Pâtes : 110 g",
        "Crevettes : 60 g",
        "Calamar : 60 g",
        "Sauce tomate : 60 g",
        "Ail & Persil : 5 g",
        "Huile d'olive : 15 ml"
      ]
    },
    "LASAGNE BOLOGNAISE": {
      category: "PÂTES",
      standardPortionWeight: "360 g",
      rationale: "Portion individuelle rectangulaire 360g : Feuilles de lasagne, bœuf haché 100g, béchamel légère 80ml, sauce tomate 60g, mozzarella gratinée 35g.",
      tech: [
        "Pâtes lasagne : 80 g",
        "Viande hachée : 100 g",
        "Sauce tomate : 60 g",
        "Béchamel : 80 ml",
        "Mozzarella : 35 g"
      ]
    },
    "LASAGNE POULET": {
      category: "PÂTES",
      standardPortionWeight: "360 g",
      rationale: "Feuilles de lasagne, émincé de poulet 90g, champignons 40g, sauce blanche onctueuse 90ml, mozzarella gratinée 35g.",
      tech: [
        "Pâtes lasagne : 80 g",
        "Poulet : 90 g",
        "Champignons : 40 g",
        "Béchamel : 90 ml",
        "Mozzarella : 35 g"
      ]
    },
    "LASAGNE FRUITS DE MER": {
      category: "PÂTES",
      standardPortionWeight: "360 g",
      rationale: "Feuilles de lasagne, crevettes 50g, calamars 50g, sauce blanche aux herbes 90ml, mozzarella 35g.",
      tech: [
        "Pâtes lasagne : 80 g",
        "Crevettes : 50 g",
        "Calamar : 50 g",
        "Béchamel : 90 ml",
        "Mozzarella : 35 g"
      ]
    },
    "PASTA CARBONARA": {
      category: "PÂTES",
      standardPortionWeight: "370 g",
      rationale: "Pâtes 110g + Dinde fumée 60g + Crème fraîche 120ml + Parmesan 20g.",
      tech: [
        "Pâtes : 110 g",
        "Dinde fumée : 60 g",
        "Crème fraîche : 120 ml",
        "Parmesan : 20 g"
      ]
    },
    "PASTA VÉGÉTARIENNE": {
      category: "PÂTES",
      standardPortionWeight: "380 g",
      rationale: "Pâtes 110g + Légumes de saison 120g + Sauce tomate 80g + Huile d'olive 10ml + Parmesan 15g. Sans crème.",
      tech: [
        "Pâtes : 110 g",
        "Légumes : 120 g",
        "Sauce tomate : 80 g",
        "Huile d'olive : 10 ml",
        "Parmesan : 15 g"
      ]
    },
    "PASTA SAUMON": {
      category: "PÂTES",
      standardPortionWeight: "380 g",
      rationale: "Pâtes 110g + Saumon 80g + Sauce blanche 120ml + Parmesan 20g.",
      tech: [
        "Pâtes : 110 g",
        "Saumon : 80 g",
        "Sauce blanche : 120 ml",
        "Parmesan : 20 g"
      ]
    },
    "PASTA FRUITS DE MER": {
      category: "PÂTES",
      standardPortionWeight: "390 g",
      rationale: "Pâtes 110g + Crevettes décortiquées 60g + Calamars 60g + Tomates cerises / Ail persillé + Huile d'olive 15ml.",
      tech: [
        "Pâtes : 110 g",
        "Crevettes : 60 g",
        "Calamar : 60 g",
        "Sauce tomate : 60 g",
        "Ail & Persil : 5 g",
        "Huile d'olive : 15 ml"
      ]
    },
    "PASTA BOLOGNAISE": {
      category: "PÂTES",
      standardPortionWeight: "380 g",
      rationale: "Pâtes sèches crues 110g + Sauce bolognaise maison (100g bœuf haché + 80g sauce tomate) + Parmesan 15g.",
      tech: [
        "Pâtes : 110 g",
        "Viande hachée : 100 g",
        "Sauce tomate : 80 g",
        "Parmesan : 15 g",
        "Huile d'olive : 10 ml"
      ]
    },
    "PASTA 5 FROMAGES": {
      category: "PÂTES",
      standardPortionWeight: "370 g",
      rationale: "Pâtes 110g + Sauce onctueuse aux 5 fromages totalisant 75g + 80ml crème.",
      tech: [
        "Pâtes : 110 g",
        "Mozzarella : 25 g",
        "Fromage bleu : 15 g",
        "Gouda : 15 g",
        "Chèvre : 10 g",
        "Parmesan : 15 g",
        "Crème fraîche : 80 ml"
      ]
    },
    "PASTA POULET CHAMPIGNON / ÉPINARD": {
      category: "PÂTES",
      standardPortionWeight: "380 g",
      rationale: "Pâtes 110g + Poulet 90g + Champignons 40g + Crème 120ml + Parmesan 15g.",
      tech: [
        "Pâtes : 110 g",
        "Poulet : 90 g",
        "Champignons : 40 g",
        "Crème fraîche : 120 ml",
        "Parmesan : 15 g",
        "Beurre : 10 g"
      ]
    },

    // ==========================================
    // 🥪 3b. SANDWICHS & PANINIS
    // ==========================================
    "SANDWICH FRUITS DE MER": {
      category: "SANDWICHS",
      standardPortionWeight: "320 g",
      rationale: "Pain ciabatta 120g + Crevettes 50g + Calamar 50g + Sauce cocktail 30g + Salade 20g.",
      tech: [
        "Pain : 1 p",
        "Crevettes : 50 g",
        "Calamar : 50 g",
        "Sauce cocktail : 30 g",
        "Salade : 20 g"
      ]
    },
    "SANDWICH THON": {
      category: "SANDWICHS",
      standardPortionWeight: "300 g",
      rationale: "Pain ciabatta 120g + Thon égoutté 80g + Mayonnaise 25g + Tomate 30g + Salade 20g.",
      tech: [
        "Pain : 1 p",
        "Thon : 80 g",
        "Mayonnaise : 25 g",
        "Tomate : 30 g",
        "Salade : 20 g"
      ]
    },
    "SANDWICH POULET": {
      category: "SANDWICHS",
      standardPortionWeight: "310 g",
      rationale: "Pain 120g + Poulet mariné grillé 100g + Sauce 30g + Tomate 30g + Salade 20g.",
      tech: [
        "Pain : 1 p",
        "Poulet : 100 g",
        "Sauce spéciale : 30 g",
        "Tomate : 30 g",
        "Salade : 20 g"
      ]
    },
    "SANDWICH VIANDE HACHÉE": {
      category: "SANDWICHS",
      standardPortionWeight: "310 g",
      rationale: "Pain 120g + Bœuf haché assaisonné 100g + Fromage cheddar 25g + Oignons caramélisés 25g + Sauce 30g.",
      tech: [
        "Pain : 1 p",
        "Viande : 100 g",
        "Cheddar : 25 g",
        "Sauce spéciale : 30 g",
        "Tomate : 30 g"
      ]
    },
    "PANINI CHARCUTERIE": {
      category: "PANINIS",
      standardPortionWeight: "260 g",
      rationale: "Pain panini 110g + Charcuterie 70g + Mozzarella 50g + Sauce 20g.",
      tech: [
        "Pain : 1 p",
        "Charcuterie : 70 g",
        "Mozzarella : 50 g",
        "Sauce spéciale : 20 g"
      ]
    },
    "PANINI POULET": {
      category: "PANINIS",
      standardPortionWeight: "280 g",
      rationale: "Pain panini 110g + Poulet émincé 90g + Mozzarella 50g + Sauce 20g.",
      tech: [
        "Pain : 1 p",
        "Poulet : 90 g",
        "Mozzarella : 50 g",
        "Sauce spéciale : 20 g"
      ]
    },
    "PANINI VIANDE HACHÉE": {
      category: "PANINIS",
      standardPortionWeight: "280 g",
      rationale: "Pain panini 110g + Bœuf haché 90g + Mozzarella 50g + Sauce 20g.",
      tech: [
        "Pain : 1 p",
        "Viande : 90 g",
        "Mozzarella : 50 g",
        "Sauce spéciale : 20 g"
      ]
    },
    "PANINI GOURMAND": {
      category: "PANINIS",
      standardPortionWeight: "300 g",
      rationale: "Pain panini 110g + Poulet 50g + Viande 50g + Mozzarella 50g + Sauce 25g.",
      tech: [
        "Pain : 1 p",
        "Poulet : 50 g",
        "Viande : 50 g",
        "Mozzarella : 50 g",
        "Sauce spéciale : 25 g"
      ]
    },
    "PANINI FRUITS DE MER": {
      category: "PANINIS",
      standardPortionWeight: "280 g",
      rationale: "Pain panini 110g + Crevettes 45g + Calamar 45g + Mozzarella 50g + Sauce blanche 25g.",
      tech: [
        "Pain : 1 p",
        "Crevettes : 45 g",
        "Calamar : 45 g",
        "Mozzarella : 50 g",
        "Sauce blanche : 25 g"
      ]
    },
    "PANINI SAUMON": {
      category: "PANINIS",
      standardPortionWeight: "270 g",
      rationale: "Pain panini 110g + Saumon 70g + Mozzarella 50g + Sauce blanche 25g.",
      tech: [
        "Pain : 1 p",
        "Saumon : 70 g",
        "Mozzarella : 50 g",
        "Sauce blanche : 25 g"
      ]
    },


    // ==========================================
    // 🥞 4. CRÊPES (Standard Diamètre 35cm)
    // ==========================================
    "CRÊPE NUTELLA": {
      category: "CRÊPES",
      standardPortionWeight: "160 g",
      rationale: "Pâte à crêpe 85g + Nutella généreux 45g (2 grosses c.à.s au lieu de 60g) + Amandes grillées 15g ou 1/2 Banane 50g.",
      tech: [
        "Pâte à crêpe : 1 p",
        "Nutella : 45 g",
        "Banane ou Amandes : 20 g"
      ]
    },
    "CRÊPE KUNAFA PISTACHE": {
      category: "CRÊPES",
      standardPortionWeight: "170 g",
      rationale: "Pâte à crêpe 85g + Pâte de pistache pure 35g (au lieu de 40g) + Kunafa dorée au beurre 25g + Pistaches concassées 10g.",
      tech: [
        "Pâte à crêpe : 1 p",
        "Pâte de pistache : 35 g",
        "Kunafa croustillante : 25 g",
        "Pistaches concassées : 10 g"
      ]
    },
    "CRÊPE FROMAGE": {
      category: "CRÊPES",
      standardPortionWeight: "160 g",
      rationale: "Pâte à crêpe 85g + Mozzarella 40g + Fromage rouge 20g + Fromage blanc 15g (Total fromage = 75g fondant).",
      tech: [
        "Pâte à crêpe : 1 p",
        "Mozzarella : 40 g",
        "Fromage rouge : 20 g",
        "Fromage blanc : 15 g"
      ]
    },
    "CRÊPE POULET CHAMPIGNON": {
      category: "CRÊPES",
      standardPortionWeight: "210 g",
      rationale: "Pâte à crêpe 85g + Poulet émincé 60g + Champignons 30g + Sauce béchamel/fromage 35g.",
      tech: [
        "Pâte à crêpe : 1 p",
        "Poulet : 60 g",
        "Champignons : 30 g",
        "Crème fraîche : 30 ml",
        "Mozzarella : 20 g"
      ]
    },
    "CRÊPE NORVÉGIENNE": {
      category: "CRÊPES",
      standardPortionWeight: "180 g",
      rationale: "Pâte à crêpe 85g + Saumon fumé tranché 45g (au lieu de 60g) + Fromage frais fines herbes 30g + Câpres 5g + Citron.",
      tech: [
        "Pâte à crêpe : 1 p",
        "Saumon fumé : 45 g",
        "Fromage blanc : 30 g",
        "Câpres : 5 g"
      ]
    },

    // ==========================================
    // 🍔 5. BURGERS & SANDWICHS (Standard Gourmet)
    // ==========================================
    "CHEESE BURGER": {
      category: "BURGERS",
      standardPortionWeight: "420 g",
      rationale: "Bun brioché 75g + Steak haché pur bœuf 140g (au lieu de 180g) + Cheddar affiné 1 tranche 25g + Sauce burger 25g + Frites 150g.",
      tech: [
        "Pain burger : 1 p",
        "Viande hachée : 140 g",
        "Fromage cheddar : 1 tranche",
        "Sauce burger : 25 g",
        "Salade : 20 g",
        "Tomate : 25 g",
        "Oignons : 15 g",
        "Frites : 150 g"
      ]
    },
    "DOUBLE CHEESE": {
      category: "BURGERS",
      standardPortionWeight: "500 g",
      rationale: "Bun brioché + 2 steaks de 100g (200g total au lieu de 2x150g) + 2 tranches de cheddar + Frites 150g.",
      tech: [
        "Pain burger : 1 p",
        "Viande hachée : 200 g",
        "Fromage cheddar : 2 tranche",
        "Sauce burger : 30 g",
        "Salade : 20 g",
        "Tomate : 25 g",
        "Frites : 150 g"
      ]
    },
    "BURGER POULET CRISPY": {
      category: "BURGERS",
      standardPortionWeight: "430 g",
      rationale: "Filet de poulet pané croustillant 140g + Cheddar 25g + Sauce mayonnaise épicée 25g + Frites 150g.",
      tech: [
        "Pain burger : 1 p",
        "Poulet : 140 g",
        "Chapelure : 25 g",
        "Fromage cheddar : 1 tranche",
        "Sauce burger : 25 g",
        "Salade : 20 g",
        "Frites : 150 g"
      ]
    },

    // ==========================================
    // 🍳 6. PETIT DÉJEUNER (Standard Hôtelier)
    // ==========================================
    "AMERICAIN": {
      category: "PETIT DÉJEUNER",
      standardPortionWeight: "450 g",
      rationale: "2 œufs frais (110g) + Bacon de bœuf 40g + 1/2 Avocat tranché 60g + Pain céréales 80g + Fromage 30g + Jus d'orange 180ml + Boisson chaude.",
      tech: [
        "Œuf : 2 p",
        "Bacon : 40 g",
        "Avocat : 60 g",
        "Fromage : 30 g",
        "Pain : 1 p",
        "Orange : 250 g",
        "Café : 10 g",
        "Bouteille Eau Minérale 33cl : 1 p"
      ]
    },
    "NORVÉGIEN": {
      category: "PETIT DÉJEUNER",
      standardPortionWeight: "440 g",
      rationale: "Saumon fumé 50g + 1/2 Avocat 60g + Fromage frais 30g + Pain céréales + 2 œufs brouillés + Jus d'orange + Boisson chaude.",
      tech: [
        "Saumon fumé : 50 g",
        "Avocat : 60 g",
        "Fromage : 30 g",
        "Pain : 1 p",
        "Œuf : 2 p",
        "Orange : 250 g",
        "Café : 10 g",
        "Bouteille Eau Minérale 33cl : 1 p"
      ]
    },
    "OMELETTE FROMAGE": {
      category: "PETIT DÉJEUNER",
      standardPortionWeight: "220 g",
      rationale: "3 œufs entiers (150g) + Fromage râpé 35g (au lieu de 60g qui rendait l'omelette huileuse) + Beurre 10g + Salade mesclun 30g.",
      tech: [
        "Œuf : 3 p",
        "Fromage : 35 g",
        "Beurre : 10 g",
        "Salade : 30 g",
        "Pain : 1 p"
      ]
    }
  };

  /**
   * Retourne la fiche technique proposée pour un nom de recette donné.
   * Si pas de fiche explicite, génère automatiquement une version standard optimisée.
   */
    function getProposedStandard(recipeName, currentItem) {
    if (!recipeName) return null;
    const cleanName = recipeName.trim().toUpperCase();
    const itemCat = (currentItem && currentItem.category) ? currentItem.category.toUpperCase() : null;

    // 1. Recherche exacte dans la table des standards
    if (PROPOSED_STANDARDS[cleanName]) {
      return PROPOSED_STANDARDS[cleanName];
    }

    // 2. Recherche avec même catégorie en priorité absolue
    if (itemCat) {
      for (const [key, val] of Object.entries(PROPOSED_STANDARDS)) {
        if (val.category && val.category.toUpperCase() === itemCat) {
          if (cleanName === key || cleanName.includes(key) || key.includes(cleanName)) {
            return val;
          }
        }
      }
    }

    // 3. Recherche partielle globale (si pas de catégorie spécifiée)
    for (const [key, val] of Object.entries(PROPOSED_STANDARDS)) {
      if (cleanName.includes(key) || key.includes(cleanName)) {
        return val;
      }
    }

    // 4. Si non trouvé, générer une proposition intelligente basée sur la catégorie et les ingrédients actuels
    if (currentItem && currentItem.tech && currentItem.tech.length > 0) {
      const generatedTech = currentItem.tech.map(line => {
        const parts = line.split(':');
        const ing = parts[0].trim();
        const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';

        const gMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
        const mlMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);

        // Réduction intelligente des excès courants
        if (gMatch) {
          const val = parseFloat(gMatch[1].replace(',', '.'));
          const lowerIng = ing.toLowerCase();
          if (lowerIng.includes('pâte') && val > 260) {
            return `${ing} : 230 g`;
          } else if (lowerIng.includes('mozzarella') && val > 140) {
            return `${ing} : 110 g`;
          } else if (lowerIng.includes('viande') && val > 160) {
            return `${ing} : 140 g`;
          } else if (lowerIng.includes('poulet') && val > 180) {
            return `${ing} : 160 g`;
          } else if (lowerIng.includes('frites') && val > 180) {
            return `${ing} : 160 g`;
          } else if (lowerIng.includes('fromage') && val > 50) {
            return `${ing} : 35 g`;
          } else if (lowerIng.includes('nutella') && val > 50) {
            return `${ing} : 45 g`;
          }
          // Réduction standard de 15% pour les gros grammages
          if (val >= 100) {
            return `${ing} : ${Math.round(val * 0.85)} g`;
          }
        } else if (mlMatch) {
          const val = parseFloat(mlMatch[1].replace(',', '.'));
          const lowerIng = ing.toLowerCase();
          if (lowerIng.includes('huile') && val > 25) {
            return `${ing} : 15 ml`;
          } else if (lowerIng.includes('crème') && val > 120) {
            return `${ing} : 90 ml`;
          } else if (lowerIng.includes('demi-glace') && val > 60) {
            return `${ing} : 40 ml`;
          }
          if (val >= 100) {
            return `${ing} : ${Math.round(val * 0.85)} ml`;
          }
        }
        return line;
      });

      return {
        category: currentItem.category || "AUTRE",
        standardPortionWeight: "Portion calibrée",
        rationale: "Ajustement automatique standard (-15% sur les ingrédients surdosés, optimisation sauces et matières grasses).",
        tech: generatedTech
      };
    }

    return null;
  }

  // Export global
  global.PROPOSED_STANDARDS = PROPOSED_STANDARDS;
  global.getProposedStandard = getProposedStandard;

  if (typeof window !== 'undefined') {
    window.PROPOSED_STANDARDS = PROPOSED_STANDARDS;
    window.getProposedStandard = getProposedStandard;
  }

})(typeof window !== 'undefined' ? window : globalThis);
