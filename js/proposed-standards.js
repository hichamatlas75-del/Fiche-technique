/**
 * GREY CORNER — Base des Fiches Techniques & Normes de Référence
 * Fiches calibrées et dupliquées strictement depuis la référence d'exploitation Déstockage (SSOT)
 * Utilisé conjointement avec recipes-data.js pour le Comparateur et la gestion F&B.
 */

(function(global) {
  'use strict';

  // Bibliothèque des Normes de Référence Grey Corner (Dupliquée de Déstockage)
  const PROPOSED_STANDARDS = {
  "BROCHETTE DE POULET": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet : 200 g",
      "Frites : 200 g",
      "Sauce : 30 g",
      "légumes : 400 g"
    ]
  },
  "COUSCOUS POULET AVEC PETIT LAIT": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Semoule couscous : 200 g",
      "Poulet : 200 g",
      "Légumes couscous : 250 g",
      "Petit lait (Lben) : 200 ml"
    ]
  },
  "COUSCOUS VIANDE AVEC PETIT LAIT": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Semoule couscous : 200 g",
      "Viande hachée : 200 g",
      "Légumes couscous : 250 g",
      "Petit lait (Lben) : 200 ml"
    ]
  },
  "SUPPLÉMENT CHARCUTERIE": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Charcuterie : 50 g"
    ]
  },
  "SALADE COMPOSÉE AU CHOIX": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Salade mesclun : 100 g",
      "Garnitures composées : 150 g",
      "Sauce vinaigrette : 30 ml"
    ]
  },
  "BOULETTES DE POULET FR": {
    "category": "ENTRÉES CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet haché : 200 g",
      "Sauce : 30 g",
      "FR EDAM: 40 g",
      "CHAPLURE: 50 g"
    ]
  },
  "OEUFS BELDI": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Œufs Beldi : 2 p",
      "Huile d’olive : 10 ml",
      "Sel & Poivre : 1 g"
    ]
  },
  "6 CROQUETTES FROMAGE": {
    "category": "ENTRÉES CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Croquettes de fromage : 6 p",
      "Sauce : 30 g",
      "Mesclun : 30 g"
    ]
  },
  "CAFÉ NOIR / ESPRESSO": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Eau chaude : 60 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CAFÉ AMÉRICAIN": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Eau chaude : 150 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CAFÉ AU LAIT": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Lait chaud : 120 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CAFÉ LATTE": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Lait chaud : 180 ml",
      "Mousse de lait : 30 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CAPPUCCINO ITALIEN": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Lait chaud : 100 ml",
      "Mousse de lait : 50 ml",
      "Cacao en poudre : 3 g",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CAPPUCCINO AVEC CHANTILLY": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Lait : 100 ml",
      "Chantilly : 30 g"
    ]
  },
  "CAFÉ NESPRESSO": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pastille Nespresso : 1 p",
      "Eau chaude : 50 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CHOCOLAT CHAUD": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Chocolat en poudre : 30 g",
      "Lait chaud : 200 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CHOCOLAT CHAUD CHANTILLY": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Chocolat en poudre : 30 g",
      "Lait chaud : 180 ml",
      "Crème chantilly : 35 g",
      "Coulis chocolat : 10 ml",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CHOCOLAT FONDU GOURMAND": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Chocolat noir fondu : 45 g",
      "Lait chaud : 180 ml",
      "Guimauves : 15 g",
      "Chantilly : 30 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "THÉ MAROCAIN À LA MENTHE": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Thé vert Gunpowder : 10 g",
      "Menthe fraîche : 20 g",
      "Sucre : 25 g",
      "Eau bouillante : 300 ml",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "THÉ NOIR": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Thé noir : 8 g",
      "Eau bouillante : 250 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "THÉ NOIR AU LAIT": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Thé noir : 8 g",
      "Lait chaud : 120 ml",
      "Eau : 130 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "VERVEINE NATURE": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Verveine séchée : 10 g",
      "Eau chaude : 250 ml",
      "Miel / Sucre : 20 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "VERVEINE AROMATISÉE": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Verveine séchée : 10 g",
      "Fleur d'oranger : 5 ml",
      "Zeste de citron : 5 g",
      "Eau chaude : 250 ml",
      "Miel : 20 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "INFUSION BIEN-ÊTRE": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Mélange plantes infusion : 10 g",
      "Eau chaude : 250 ml",
      "Miel : 20 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "VERRE DE LAIT": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait entier frais : 250 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "LAIT CASSÉ": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Lait chaud : 150 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CAFÉ SÉPARÉ": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Lait chaud : 100 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "CAFÉ MOITIÉ": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Lait chaud : 80 ml",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "ICE COFFEE CLASSIQUE": {
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café espresso : 10 g",
      "Lait froid : 100 ml",
      "Sirop de canne : 20 ml",
      "Glaçons : 120 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "ICE COFFEE AROMATISÉ": {
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café espresso : 10 g",
      "Sirop Caramel / Vanille : 25 ml",
      "Lait froid : 120 ml",
      "Glaçons : 120 g",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "FRAPPUCCINO CLASSIQUE": {
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café espresso : 10 g",
      "Lait : 120 ml",
      "Base frappé vanille : 25 g",
      "Glace pilée : 150 g",
      "Crème chantilly : 30 g"
    ]
  },
  "FRAPPUCCINO AROMATISÉ": {
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café espresso : 10 g",
      "Lait : 120 ml",
      "Sirop Noisette / Caramel : 30 ml",
      "Glace pilée : 150 g",
      "Chantilly & Nappage : 35 g"
    ]
  },
  "ICE TEA PÊCHE MAISON": {
    "category": "ICE TEA MAISON",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Eau : 200 ml",
      "Sirop de pêche : 30 ml",
      "Jus de citron : 15 ml",
      "Pêche fraîche : 30 g",
      "Glaçons : 100 g"
    ]
  },
  "ICE TEA CITRON MAISON": {
    "category": "ICE TEA MAISON",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Infusion thé vert : 200 ml",
      "Jus de citron pressé : 30 ml",
      "Sirop de canne : 25 ml",
      "Rondelles de citron : 2 tr",
      "Glaçons : 100 g"
    ]
  },
  "ICE TEA FRAMBOISE MAISON": {
    "category": "ICE TEA MAISON",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Infusion thé fruits rouges : 200 ml",
      "Purée de framboise : 35 g",
      "Jus de citron : 15 ml",
      "Framboises fraîches : 20 g",
      "Glaçons : 100 g"
    ]
  },
  "JUS D'ORANGE PRESSÉ": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Oranges fraîches à jus : 500 g"
    ]
  },
  "JUS DE CITRON / CITRONNADE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Citron pressé : 200 g",
      "Sirop de canne : 30 ml",
      "Eau filtrée & Glaçons : 150 ml",
      "Menthe fraîche : 5 g"
    ]
  },
  "JUS DE FRAISE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fraises fraîches : 220 g",
      "Jus d'orange frais : 80 ml",
      "Sirop de sucre : 15 ml"
    ]
  },
  "JUS DE FRAMBOISE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Framboises fraîches : 200 g",
      "Jus d'orange : 80 ml",
      "Sirop de sucre : 20 ml"
    ]
  },
  "JUS DE MANGUE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Mangue fraîche : 220 g",
      "Jus d'orange frais : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  "JUS D'ANANAS": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Ananas frais : 250 g",
      "Glaçons : 50 g"
    ]
  },
  "JUS DE PÊCHE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pêche fraîche : 220 g",
      "Jus d'orange frais : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  "JUS DE CAROTTE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Carottes fraîches : 350 g",
      "Jus d'orange frais : 50 ml"
    ]
  },
  "JUS POMME & BANANE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pomme fraîche : 150 g",
      "Banane : 120 g",
      "Lait ou Jus d'orange : 100 ml"
    ]
  },
  "JUS D'AVOCAT AU LAIT": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Avocat Hass : 160 g",
      "Lait entier frais : 200 ml",
      "Sucre : 20 g"
    ]
  },
  "JUS D'AVOCAT ROYAL FRUITS SECS": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Avocat Hass : 160 g",
      "Lait entier : 200 ml",
      "Miel pur : 25 g",
      "Amandes, Noix, Raisins secs : 40 g"
    ]
  },
  "JUS PANACHÉ FRUITS FRAIS": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus d'orange : 100 ml",
      "Banane : 80 g",
      "Fraise : 60 g",
      "Pomme : 60 g",
      "Avocat : 40 g"
    ]
  },
  "COCKTAIL À BASE D'ORANGE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus d'orange frais : 180 ml",
      "Sirop de grenadine : 20 ml",
      "Fraise fraîche : 50 g",
      "Ananas frais : 50 g"
    ]
  },
  "ZA3ZA3 ROYAL GREY CORNER": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Avocat : 150 g",
      "Lait : 180 ml",
      "Chocolat KitKat / Snickers : 1 p",
      "Fruits secs variés : 50 g",
      "Biscuits Oreo : 2 p",
      "Crème chantilly : 35 g",
      "Coulis caramel : 15 ml"
    ]
  },
  "SIGNATURE GREY CORNER": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus d'ananas : 100 ml",
      "Jus de mangue : 80 ml",
      "Purée de fraise : 40 ml",
      "Jus de citron vert : 20 ml",
      "Sirop de passion : 20 ml",
      "Fruits frais décor : 30 g"
    ]
  },
  "VIRGIN PIÑA COLADA": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus d'ananas frais : 180 ml",
      "Crème de coco : 60 ml",
      "Lait de coco : 40 ml",
      "Glaçons : 100 g",
      "Tranche d'ananas : 1 tr"
    ]
  },
  "COCKTAIL TROPICAL": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus de mangue : 80 ml",
      "Jus d'ananas : 80 ml",
      "Jus d'orange : 60 ml",
      "Sirop de grenadine : 15 ml",
      "Glaçons : 80 g"
    ]
  },
  "MOJITO VIRGIN / FRAÎCHEUR": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Citron vert frais : 1 p (40 g)",
      "Menthe fraîche : 15 g",
      "Sucre de canne : 20 g",
      "Eau gazeuse Oulmès : 150 ml",
      "Glace pilée : 120 g"
    ]
  },
  "DÉTOX GINGEMBRE CITRON": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Gingembre frais râpé : 15 g",
      "Jus de citron pressé : 60 ml",
      "Miel pur d'abeille : 25 g",
      "Pomme verte : 100 g",
      "Eau minérale : 100 ml"
    ]
  },
  "COCKTAIL SANS ALCOOL SPÉCIAL": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus d'orange : 100 ml",
      "Jus de pêche : 80 ml",
      "Purée de framboise : 30 ml",
      "Sprite : 60 ml",
      "Glaçons : 80 g"
    ]
  },
  "MOJITO TROPICAL": {
    "category": "Général",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Citron vert : 30 g",
      "sirop framboise : 15 ml",
      "Oulmès tropical  : 1 p",
      "Glace pilée : 120 g"
    ]
  },
  "MOJITO RED BULL": {
    "category": "AUTRE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Citron vert : 30 g",
      "Menthe fraîche : 15 g",
      "Red Bull (Canette 250ml) : 1 p",
      "Glace pilée : 120 g",
      "sirop bleu : 15 ml"
    ]
  },
  "MOJITO CITRON": {
    "category": "Général",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Citron vert : 40 g",
      "Menthe fraîche : 15 g",
      "OULMES MOJITO:  1 p",
      "Glace pilée : 120 g",
      "sirop mojito : 15 ml"
    ]
  },
  "SMOOTHIE PINK BERRY": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fraises fraîches : 100 g",
      "Framboises : 60 g",
      "Yaourt grec nature : 100 g",
      "Jus de pomme : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  "SMOOTHIE ÉNERGÉTIQUE": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Banane : 120 g",
      "Dattes Medjool : 40 g",
      "Flocons d'avoine : 30 g",
      "Lait d'amande : 180 ml",
      "Beurre de cacahuète : 20 g"
    ]
  },
  "SMOOTHIE HAWAÏ": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Mangue fraîche : 100 g",
      "Ananas frais : 100 g",
      "Fruit de la passion : 30 g",
      "Jus d'orange : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  "SMOOTHIE MULTIVITAMINÉ": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus d'orange frais : 100 ml",
      "Carotte : 80 g",
      "Pomme : 80 g",
      "Gingembre frais : 5 g",
      "Glaçons : 50 g"
    ]
  },
  "SMOOTHIE JELLY FRUIT": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fruits rouges : 120 g",
      "Banane : 80 g",
      "Jus de cranberry : 80 ml",
      "Perles de fruits Popping Boba : 30 g"
    ]
  },
  "SMOOTHIE TRIPLE FRUITS": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fraise : 70 g",
      "Mangue : 70 g",
      "Kiwi frais : 70 g",
      "Jus d'orange : 80 ml",
      "Glaçons : 50 g"
    ]
  },
  "SMOOTHIE BOWL EXOTIQUE": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Base mixée Mangue/Banane/Passion : 250 g",
      "Granola croustillant : 40 g",
      "Kiwi frais : 30 g",
      "Graines de chia : 10 g",
      "Noix de coco râpée : 10 g"
    ]
  },
  "SMOOTHIE BOWL ULTRA BOOST": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Base mixée Açaï/Fruits rouges : 250 g",
      "Banane : 50 g",
      "Granola croustillant : 40 g",
      "Myrtilles & Framboises : 30 g",
      "Graines de chia : 10 g",
      "Amandes effilées : 15 g"
    ]
  },
  "COCA-COLA 33CL": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Coca-Cola (Canette 33cl) : 1 p",
      "Tranche de citron : 1 tr",
      "Glaçons"
    ]
  },
  "COCA-COLA ZÉRO 33CL": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Coca-Cola Zéro (Canette 33cl) : 1 p",
      "Tranche de citron : 1 tr",
      "Glaçons"
    ]
  },
  "SPRITE 33CL": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Sprite (Canette 33cl) : 1 p",
      "Tranche de citron : 1 tr",
      "Glaçons"
    ]
  },
  "HAWAÏ 33CL": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Hawaï Canette : 33 cl",
      "Glaçons"
    ]
  },
  "POMS 33CL": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poms (Canette 33cl) : 1 p",
      "Glaçons"
    ]
  },
  "SCHWEPPES CITRON / TONIC 33CL": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Schweppes (Canette 33cl) : 1 p",
      "Tranche de citron : 1 tr",
      "Glaçons"
    ]
  },
  "ORANGINA 33CL": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Orangina (Canette 33cl) : 1 p",
      "Tranche d'orange : 1 tr",
      "Glaçons"
    ]
  },
  "RED BULL 250ML": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Red Bull (Canette 250ml) : 1 p",
      "Glaçons"
    ]
  },
  "EAU MINÉRALE 33CL": {
    "category": "EAUX MINÉRALES & GAZEUSES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "EAU MINÉRALE 50CL": {
    "category": "EAUX MINÉRALES & GAZEUSES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Bouteille Eau Minérale 50cl : 1 p"
    ]
  },
  "EAU MINÉRALE 75CL": {
    "category": "EAUX MINÉRALES & GAZEUSES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Bouteille Eau Minérale 75cl : 1 p"
    ]
  },
  "OULMÈS EAU GAZEUSE 33CL / 50CL": {
    "category": "EAUX MINÉRALES & GAZEUSES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Bouteille Oulmès 33/50cl : 1 p",
      "Tranche de citron : 1 tr"
    ]
  },
  "OULMÈS EAU GAZEUSE 75CL": {
    "category": "EAUX MINÉRALES & GAZEUSES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Bouteille Oulmès 75cl : 1 p",
      "Tranches de citron : 2 tr"
    ]
  },
  "COMPAGNARD": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "pain cake : 2 p",
      "Omelette : 3 œufs",
      "Fromage : 10 g",
      "Charcuteries : 50 g",
      "Pain seigle : 2 tr",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "PETIT DÉJEUNER AMÉRICAIN": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Bacon : 25 g",
      "Omelette : 2 œufs",
      "avocat : 60 g",
      "Pain seigle : 2 tr",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p",
      "JBEN : 50 g"
    ]
  },
  "BRUNCH GREYCORNER": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Merguez : 80 g",
      "OEUFS : 3 P",
      "Fromage : 30 g",
      "Toast hollandais : 1 p",
      "Croquettes fromage : 1 p",
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
  "BRUNCH DUO": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet pané : 60 g",
      "Croquettes : 2 p",
      "Croque maison : 1 p",
      "œufs         : 2 p",
      "Charcuterie : 80 g",
      "Fromage : 60 g",
      "Pain seigle : 2 tr",
      "Beldi : 2 mlaoui + 2 harcha",
      "Mesclun : 40 g",
      "Muffin : 1 p",
      "Gaufre : 1 p",
      "Jus d'orange : 2×200 ml",
      "THE A LA MENTHE : 2 p",
      "Desserts : 2 p",
      "Bouteille Eau Minérale 33cl : 2 p"
    ]
  },
  "BELDI": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "HOLLANDAIS": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "OMELETTE VÉGÉTARIENNE": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Œufs : 3 p",
      "Légumes : 120 g",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "BERBÈRE": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "CROQUE": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Croque maison : 1 p",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "FASSI": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Khli3 : 100 g",
      "Œufs au plat : 3 p",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "OMELETTE CONTINENTAL": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "OMELETTE FROMAGE": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Œufs : 3 p",
      "Fromage : 40 g",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "OMELETTE NATURE": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Œufs : 3 p",
      "Mesclun : 40 g",
      "Jus d'orange : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "OMELETTE DU CHEF": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "ESPAGNOL": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Tortilla : 1 p",
      "Croquettes : 2 p",
      "Tapenade : 20 g",
      "Thon : 20 g",
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
  "MQUILA-MERGUEZ": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Merguez : 80 g",
      "Poivrons/oignons : 120 g",
      "Œufs : 2 p",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "MQUILA-FRUITS DE MER": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "crevettes CHAIR : 50 g",
      "calamars : 120 g",
      "moules : 80 g",
      "Œufs : 2 p",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "NORVÉGIEN": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Avocat : 80 g",
      "Pain céréales : 2 tr",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p",
      "saumon fumee : 60 g",
      "jben : 30 g"
    ]
  },
  "LIGHT": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "EXPRESS": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viennoiseries : 4 p",
      "Jus : 200 ml",
      "Boisson chaude : 1 p",
      "Dessert : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "MENU ENFANT (PDJ)": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Crêpe/Gaufre/Pancake : 1 p",
      "Corn flakes : 1 bol",
      "Lait chocolat : 200 ml"
    ]
  },
  "SALADE VEGGIE": {
    "category": "ENTRÉES FROIDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Salade Rouge : 100 g",
      "Concombre : 80 g",
      "Tomate Cerise : 70 g",
      "Œufs de Caille : 1 p",
      "Haricot Vert : 60 g",
      "Betterave : 120 g",
      "Carotte : 40 g",
      "Brocoli : 50 g",
      "Radis : 60 g",
      "Thon : 40 g",
      "Sauce Vinaigrette : 200 g",
      "Maïs : 30 g",
      "Poivron : 50 g"
    ]
  },
  "SALADE RUSSE": {
    "category": "ENTRÉES FROIDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pomme de Terre : 400 g",
      "Carotte : 200 g",
      "Poulet : 50 g",
      "Petit Pois : 150 g",
      "Olive Verte : 15 g",
      "Cornichon : 24 g",
      "Œufs de Caille : 1 p",
      "Mayonnaise : 30 g",
      "Thon : 30 g",
      "Maïs : 50 g",
      "Radis : 14 g",
      "Poivron : 10 g",
      "Concombre : 10 g"
    ]
  },
  "SALADE CÉSAR": {
    "category": "ENTRÉES FROIDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Salade Romaine : 180 g",
      "Laitue : 100 g",
      "Poulet : 130 g",
      "Croûtons : 30 g",
      "Tomate Cerise : 60 g",
      "Sauce César : 70 g",
      "Parmesan : 30 g"
    ]
  },
  "SALADE QUINOA": {
    "category": "ENTRÉES FROIDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Quinoa : 140 g",
      "Gambas Pané : 20 g",
      "Gambas Poché : 30 g",
      "Fruits : 70 g",
      "Feta : 20 g",
      "Kiwi : 140 g",
      "Vinaigrette : 20 g",
      "Miel : 30 g",
      "Framboise : 17 g"
    ]
  },
  "SALADE TERRE & MER": {
    "category": "ENTRÉES FROIDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "TARTARE SAUMON": {
    "category": "ENTRÉES FROIDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "saumon frais : 90 g",
      "SAUMON FUMEE : 25 g",
      "Avocat : 300 g",
      "SAUCE TARTARE : 24 g"
    ]
  },
  "BOULETTE DE POULET AU FROMAGE": {
    "category": "ENTRÉES CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet : 200 g",
      "Farine : 100 g",
      "Chapelure : 50 g",
      "Edam : 25 g"
    ]
  },
  "CROUSTILLON GAMBAS": {
    "category": "ENTRÉES CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "crevettes CHAIR : 122 g",
      "Chapelure : 30 g",
      "Purée : 200 g",
      "Radis : 15 g",
      "Parmesan : 14 g",
      "Crème fraîche : 50 g"
    ]
  },
  "PIL PIL ESPAGNOL": {
    "category": "ENTRÉES CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "crevettes CHAIR : 122 g",
      "Tomate cerise : 60 g",
      "Pesto : 22 g",
      "Huile d’olive : 30 g",
      "Oignon : 60 g",
      "Ail : 10 g",
      "Sauce tomate : 120 g"
    ]
  },
  "BROCHETTES DE POULET": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Blanc de poulet : 200 g",
      "Sauce barbecue : 30 g",
      "Salade rouge : 50 g",
      "Accompagnements — 2 au choix",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  "EMINCE DE POULET": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet : 160 g",
      "Champignons : 60 g",
      "Crème fraîche : 100 ml",
      "Demi-glace : 100 ml",
      "Légumes variés : 220 g",
      "Fokacha : 150 g",
      "Frites : 200 g",
      "Huile : 50 ml"
    ]
  },
  "BALLOTINE DE POULET": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet : 200 g",
      "Épinard : 40 g",
      "Crème fraîche : 70 ml",
      "Parmesan : 20 g",
      "Cheddar : 60 g",
      "Beurre : 30 g",
      "Légumes : 220 g",
      "Frites : 200 g"
    ]
  },
  "SUPRÊME DE POULET": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Blanc de poulet : 180 g",
      "Champignon : 120 g",
      "Crème fraîche : 70 ml",
      "Persil : 20 g",
      "Haricot vert : 55 g",
      "Courgette : 55 g",
      "Carotte : 57 g",
      "Brocoli : 77 g",
      "Persil : 30 g",
      "Œuf : 1 p",
      "Frites : 200 g",
      "Pain : 1 p",
      "Beurre : 40 g"
    ]
  },
  "ESCALOPE A LA MILANAISE": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "EMINCE DE BŒUF": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "FILET DE Bœuf : 125 g",
      "Champignons : 80 g",
      "Crème fraîche : 70 ml",
      "Demi-glace : 60 ml",
      "Légumes : 220 g",
      "Fokacha : 150 g",
      "Frites : 200 g",
      "Huile : 60 ml"
    ]
  },
  "FILET DE BŒUF": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Filet : 180 g",
      "Beurre : 40 g",
      "Poivre vert : 20 g",
      "Demi-glace : 70 ml",
      "Légumes : 220 g",
      "Fokacha : 150 g",
      "Frites : 200 g"
    ]
  },
  "PAVÉ DE SAUMON": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Saumon : 180 g",
      "Crème fraîche : 70 ml",
      "Parmesan : 20 g",
      "Beurre : 40 g",
      "Légumes : 220 g",
      "Fokacha : 150 g",
      "Frites : 200 g"
    ]
  },
  "MENU ENFANT (PLAT)": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pasta nature ou Mini pizza + boisson",
      "OU Burger / nuggets + frites + boisson"
    ]
  },
  "ROULADE DE BŒUF VH": {
    "category": "PLATS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viande hachée : 200 g",
      "Épinard : 30 g",
      "Champignon : 30 g",
      "Fromage rouge : 20 g",
      "Fromage bleu : 20 g",
      "Crème fraîche : 70 ml",
      "Haricot vert : 55 g",
      "Courgette : 55 g",
      "Carotte : 57 g",
      "Brocoli : 77 g",
      "Olive noire : 60 g",
      "Fokacha : 150 g",
      "Frites : 200 g",
      "Pain : 1 p",
      "Huile de table : 30 ml"
    ]
  },
  "CHICKEN BURGER": {
    "category": "BURGERS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "poulet : 120 g",
      "Sauce blanche : 40 g",
      "Sauce pesto : 20 g",
      "Cheddar : 25 g",
      "Tomate/Laitue : 30 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  "CHEESE BURGER": {
    "category": "BURGERS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "AVOCADO FORESTIER": {
    "category": "BURGERS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet : 120 g",
      "Avocat : 50 g",
      "Tomate/Laitue : 30 g",
      "Chapelure : 50 g",
      "Cheddar : 20 g",
      "Sauce Bigy : 30 g",
      "Frites+Sauce : 200 g",
      "Pain : 1 p"
    ]
  },
  "EGG AND CHEESEBURGER": {
    "category": "BURGERS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viande : 100 g",
      "Œuf : 1 p",
      "Cheddar : 25 g",
      "Tomate/Laitue : 30 g",
      "Sauce Bigy : 30 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  "BIG BURGER": {
    "category": "BURGERS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viande : 200 g",
      "Cheddar : 20 g",
      "Tomate/Laitue : 30 g",
      "Sauce du chef : 30 g",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  "BURGER ROYAL": {
    "category": "BURGERS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "WRAP POULET": {
    "category": "WRAPS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
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
  "WRAP VIANDE HACHÉE": {
    "category": "WRAPS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viande hachée : 100 g",
      "Œuf : 1 p",
      "Frites + sauce : 200 g",
      "Cheddar : 25 g",
      "Pain : 1 p",
      "Tomate fraîche : 30 g",
      "Sauce burger : 60 ml"
    ]
  },
  "WRAP GOURMAND": {
    "category": "WRAPS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet : 120 g",
      "Charcuterie : 40 g",
      "Œuf : 1 p",
      "Chapelure : 50 g",
      "Cheddar : 25 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Tomate fraîche : 35 g",
      "Sauce burger : 60 ml"
    ]
  },
  "PANINI CHARCUTERIE": {
    "category": "PANINIS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Charcuterie : 100 g",
      "Mozzarella : 40 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  "PANINI POULET": {
    "category": "PANINIS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet : 70 g",
      "Mozzarella : 40 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  "PANINI VIANDE HACHÉE": {
    "category": "PANINIS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viande : 100 g",
      "Mozzarella : 40 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  "PANINI MIX": {
    "category": "PANINIS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viande : 50 g",
      "Poulet : 50 g",
      "Charcuterie : 50 g",
      "Mozzarella : 40 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  "PANINI FRUITS DE MER": {
    "category": "PANINIS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "crevettes CHAIR  : 50 g",
      "Calamar congelé : 120 g",
      "Pesto : 20 g",
      "Mozzarella : 40 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  "PANINI SAUMON": {
    "category": "PANINIS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Saumon : 90 g",
      "Pesto : 20 g",
      "Mozzarella : 40 g",
      "Frites + sauce : 200 g",
      "Pain : 1 p",
      "Sauce biggy : 30 g"
    ]
  },
  "SANDWICH FRUITS DE MER": {
    "category": "SANDWICHS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain : 1 p",
      "crevettes CHAIR  : 50 g",
      "calamar  : 120 g",
      "Sauce cocktail : 50 g",
      "Salade : 20 g",
      "Tomate : 20 g",
      "FRITTES : 200 g"
    ]
  },
  "SANDWICH THON": {
    "category": "SANDWICHS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain : 1 p",
      "Thon : 60 g",
      "Mayonnaise : 25 g",
      "Tomate : 30 g",
      "Salade : 20 g",
      "FRITTES : 200 g"
    ]
  },
  "SANDWICH POULET": {
    "category": "SANDWICHS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain : 1 p",
      "Poulet : 100 g",
      "Tomate : 30 g",
      "Sauce spéciale : 30 g",
      "Salade : 20 g",
      "FRITTES : 200 g"
    ]
  },
  "SANDWICH POULET CRUNCHY": {
    "category": "SANDWICHS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain : 1 p",
      "Poulet crunchy : 120 g",
      "Cheddar : 25 g",
      "Sauce spéciale : 30 g",
      "Salade : 20 g",
      "FRITTES : 200 g"
    ]
  },
  "SANDWICH CHEESE STEAK": {
    "category": "SANDWICHS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain : 1 p",
      "Cheddar : 30 g",
      "Sauce spéciale : 30 g",
      "CHAMPIGNONS : 50 g",
      "FILET : 62 g",
      "FRITTES : 200 g"
    ]
  },
  "SANDWICH VIANDE HACHÉE": {
    "category": "SANDWICHS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain : 1 p",
      "Viande : 100 g",
      "Tomate : 30 g",
      "Cheddar : 25 g",
      "FRITTES : 200 g",
      "SALADE : 50 g",
      "SAUCE TOMATE : 50 g"
    ]
  },
  "PIZZA MARGARITA": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 330 g",
      "Mozzarella : 150 g",
      "Sauce tomate : 100 g",
      "Olives noires : 15 g",
      "Basilic : 5 g"
    ]
  },
  "PIZZA THON": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Thon : 60 g",
      "Tomate : 30 g",
      "pate : 330 g",
      "MOZARELLA : 150 g",
      "SAUCE TOMATE : 50 g"
    ]
  },
  "PIZZA VÉGÉTARIENNE": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à pizza : 330 g",
      "Mozzarella : 150 g",
      "Sauce tomate : 100 g",
      "Olives noires : 15 g",
      "Légumes grillés : 200 g"
    ]
  },
  "PIZZA DINDE FUMÉE (REGINA)": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 330 g",
      "Mozzarella : 150 g",
      "Dinde fumée : 100 g",
      "Champignons : 60 g",
      "Sauce blanche : 40 g"
    ]
  },
  "PIZZA 5 FROMAGES": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 330 g",
      "Mozzarella : 150 g",
      "Brie : 50 g",
      "Bleu : 40 g",
      "Sauce blanche : 40 g",
      "Parmesan : 20 g",
      "Fromage rouge : 40 g"
    ]
  },
  "PIZZA VIANDE HACHÉE": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 330 g",
      "Mozzarella : 150 g",
      "Sauce tomate : 100 g",
      "Viande hachée : 100 g",
      "Tomate cerise : 30 g"
    ]
  },
  "PIZZA PEPPERONI": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 330 g",
      "Mozzarella : 150 g",
      "Sauce tomate : 100 g",
      "Pepperoni : 80 g"
    ]
  },
  "PIZZA POULET (SAUCE BLANCHE)": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 330 g",
      "Mozzarella : 150 g",
      "Poulet : 120 g",
      "Champignon : 60 g",
      "Sauce blanche : 40 g"
    ]
  },
  "PIZZA 4 SAISONS": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 330 g",
      "Mozzarella : 150 g",
      "Calamar congelé : 70 g",
      "Crevettes avec coquille : 70 g",
      "Viande : 40 g",
      "Poulet : 40 g",
      "Légumes : 60 g",
      "Champignon : 60 g"
    ]
  },
  "PIZZA MOITIÉ MOITIÉ": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 330 g",
      "VIANDE HACHEE : 50 g",
      "POULET : 50 g",
      "MOZZARELLA : 150 g",
      "CREME FRAICHE : 40 g"
    ]
  },
  "PIZZA BURRATA": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 330 g",
      "Mozzarella : 150 g",
      "Sauce tomate : 100 g",
      "Burrata : 1 p",
      "Tomate cerise : 50 g",
      "Roquette : 30 g",
      "Vinaigre balsamique : 10 ml",
      "Noix : 15 g"
    ]
  },
  "PIZZA FRUITS DE MER": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Crème fraîche : 40 ml",
      "Crevette CHAIR  : 50 g",
      "calamar : 120 g",
      "PATE : 330 g",
      "PESTO : 50 g",
      "MOZZARELLA : 150 g"
    ]
  },
  "PIZZA SAUMON": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Saumon : 90 g",
      "Sauce blanche : 40 g",
      "PATE : 330 g",
      "MOZZARELLA : 150 g"
    ]
  },
  "LASAGNE POULET": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 60 g",
      "poulet : 80 g",
      "Parmesan : 15 g",
      "Huile : 60 g",
      "champignon : 50 g",
      "Pesto : 70 g",
      "Sauce blanche : 50 g",
      "Oignon/Ail : 70 g",
      "fromage rouge : 15 g",
      "mozzarella : 40 g"
    ]
  },
  "LASAGNE BOLOGNAISE": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 60 g",
      "Viande : 80 g",
      "Parmesan : 15 g",
      "Huile : 60 g",
      "Tomate cerise : 50 g",
      "Pesto : 70 g",
      "Sauce tomate : 80 g",
      "Oignon/Ail : 70 g",
      "fromage rouge : 15 g",
      "mozzarella : 40 g"
    ]
  },
  "LASAGNE FRUITS DE MER": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 60 g",
      "crevettes CHAIR : 50 g",
      "Calamar congelé : 120 g",
      "Parmesan : 15 g",
      "Huile : 30 g",
      "Pesto : 40 g",
      "Sauce blanche : 50 g",
      "Oignon/Ail : 50 g",
      "fromage rouge : 15 g",
      "mozzarella : 40 g"
    ]
  },
  "PASTA VÉGÉTARIENNE": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 125 g",
      "Sauce pesto : 70 g",
      "Parmesan : 30 g",
      "Huile d'olive : 60 g",
      "Oignon : 60 g",
      "Tomate cerise : 50 g",
      "Légumes : 150 g"
    ]
  },
  "PASTA CARBONARA": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 125 g",
      "Crème fraîche : 200 ml",
      "Parmesan : 30 g",
      "Dinde fumée : 80 g",
      "Jaune d'œuf : 1 p"
    ]
  },
  "PASTA 5 FROMAGES": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 125 g",
      "Crème fraîche : 200 ml",
      "Mozzarella : 40 g",
      "Fromage bleu : 30 g",
      "Gouda : 30 g",
      "Chèvre : 25 g",
      "Parmesan : 25 g"
    ]
  },
  "RIGATONI RICOTTA": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 125 g",
      "Ricotta : 40 g",
      "Parmesan : 30 g",
      "Huile : 60 g",
      "Crème : 200 g",
      "Pesto : 70 g",
      "Courgette : 100 g",
      "Oignon/Ail : 70 g"
    ]
  },
  "PASTA BOLOGNAISE": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 125 g",
      "Viande hachée : 80 g",
      "Sauce tomate : 100 g",
      "Parmesan : 30 g",
      "Oignon : 30 g"
    ]
  },
  "PASTA POULET CHAMPIGNON / ÉPINARD": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 125 g",
      "Poulet : 120 g",
      "Champignons : 60 g",
      "Épinards : 50 g",
      "Crème fraîche : 200 ml",
      "Parmesan : 30 g"
    ]
  },
  "PASTA FRUITS DE MER": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 125 g",
      "Crème fraîche : 200 ml",
      "Parmesan : 30 g",
      "Crevette CHAIR : 50 g",
      "calamar  : 120 g",
      "PESTO : 50 g"
    ]
  },
  "PASTA SAUMON": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 125 g",
      "Saumon : 90 g",
      "Sauce blanche : 200 g",
      "parmesan : 30 g"
    ]
  },
  "SPAGHETTIS NOIRS (SUPPL.)": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Supplément pâtes noires à l'encre de seiche"
    ]
  },
  "SAN SEBASTIEN CHEESECAKE": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Cheesecake San Sebastian : 1 part (160 g)",
      "Coulis chocolat chaud : 30 g"
    ]
  },
  "FONDANT AU CHOCOLAT": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fondant chocolat cœur coulant : 1 g",
      "Glace vanille artisanale : 65 g",
      "Sucre glace : 5 g"
    ]
  },
  "CHEESECAKE CHOCOLAT": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Cheesecake chocolat : 1 part (150 g)",
      "Chantilly : 20 g"
    ]
  },
  "BOULE DE GLACE": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Glace artisanale au choix : 65 g"
    ]
  },
  "2 BOULES DE GLACE": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Glace artisanale au choix : 130 g",
      "Coulis & Chantilly : 0 g"
    ]
  },
  "3 BOULES DE GLACE": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Glace artisanale au choix : 195 g",
      "Coulis, Chantilly & Gaufrette : 0 g"
    ]
  },
  "CRÊPE NUTELLA": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Nutella : 120 g"
    ]
  },
  "CRÊPE KUNAFA PISTACHE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Pâte de pistache :  150 g",
      "Kunafa croustillante : 30 g",
      "Pistaches concassées : 0 g"
    ]
  },
  "CRÊPE FROMAGE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Mozzarella : 50 g",
      "Fromage rouge : 30 g",
      "Fromage blanc : 20 g"
    ]
  },
  "CRÊPE POULET CHAMPIGNON": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Blanc de poulet : 70 g",
      "Champignons : 40 g",
      "Mozzarella : 40 g",
      "Crème fraîche : 40 ml"
    ]
  },
  "CRÊPE CHARCUTERIE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Charcuterie de dinde : 60 g",
      "Mozzarella : 40 g",
      "Fromage : 20 g"
    ]
  },
  "CRÊPE NORVÉGIENNE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Saumon frais : 90 g",
      "Crème fraîche : 40 ml",
      "Fromage : 20 g",
      "Mozzarella : 40 g"
    ]
  },
  "SUPPLÉMENT FRITES": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Frites : 200 g",
      "Sauce : 30 g"
    ]
  },
  "SUPPLÉMENT PURÉE": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pomme de terre purée : 250 g",
      "Beurre : 15 g"
    ]
  },
  "SUPPLÉMENT POTATOS": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pomme de terre potatos : 200 g",
      "Sauce : 30 g"
    ]
  },
  "SUPPLÉMENT MIEL": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Miel pur : 30 g"
    ]
  },
  "SUPPLÉMENT JBEN": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jben frais : 50 g"
    ]
  },
  "SUPPLÉMENT ŒUFS": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Œufs frais : 2 p"
    ]
  },
  "SUPPLÉMENT FROMAGE": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fromage variété : 50 g"
    ]
  },
  "SUPPLÉMENT CHANTILLY": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Chantilly : 30 g"
    ]
  },
  "SUPPLÉMENT POULET": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Poulet émincé : 80 g"
    ]
  },
  "SUPPLÉMENT VIANDE HACHÉE": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viande hachée : 80 g"
    ]
  },
  "PIZZA COMPOSÉE AU CHOIX": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à pizza : 330 g",
      "Mozzarella : 150 g",
      "Sauce tomate : 100 g",
      "saumon : 50 g",
      "calamar net : 40 g",
      "crevette net : 40 g"
    ]
  },
  "DIVERS CUISINE / FOOD": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Ingrédients cuisine divers : 1 portion"
    ]
  },
  "DIVERS BAR / BOISSONS": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Ingrédients bar divers : 1 portion"
    ]
  },
  "PETIT BAGHRIR (A LA CARTE)": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Baghrir : 1 p"
    ]
  },
  "MSEMEN NATURE (A LA CARTE)": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Msemen : 1 p"
    ]
  },
  "VIENNOISERIE (A LA CARTE)": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viennoiserie : 1 p"
    ]
  },
  "HARCHA (A LA CARTE)": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Harcha : 1 p"
    ]
  },
  "OMLETTE FROMAGE (A LA CARTE)": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Œufs : 3 p",
      "Fromage : 40 g",
      "Mesclun : 30 g"
    ]
  },
  "OMLETTE NATURE (A LA CARTE)": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Œufs : 3 p",
      "Mesclun : 30 g"
    ]
  },
  "OMLETTE DU CHEF (A LA CARTE)": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Œufs : 3 p",
      "Champignons : 40 g",
      "Épinards : 30 g",
      "Fromage : 30 g"
    ]
  },
  "CREPE PECHEUR": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "crevettes CHAIR : 50 g",
      "Calamar congelé : 120 g",
      "Mozzarella : 40 g",
      "creme fraiche : 30 g"
    ]
  },
  "CREPE BOLONAISE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "VIANDE HACHEE :100 g",
      "Mozzarella : 60 g",
      "SAUCE TOMATE : 50 g"
    ]
  },
  "CREPE GREY CORNER SALEE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "VIANDE HACHEE : 50 g",
      "CHARCUTERIE : 50 g",
      "poulet : 50 g",
      "Mozzarella : 60 g",
      "Fromage : 20 g"
    ]
  },
  "CREPE BANANE NUTELLA": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Nutella : 120 g",
      "BANANE : 100 g"
    ]
  },
  "CREPE NATURE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 2 p"
    ]
  },
  "CREPE CHOCO-NOISETTE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Nutella : 60 g",
      "Noisette : 30 g"
    ]
  },
  "CREPE EXOTIQUE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Nutella : 60 g",
      "Fruits de saison : 80 g"
    ]
  },
  "CREPE GREY CORNER SUCREE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Nutella : 60 g",
      "Chocolat varié : 50 g"
    ]
  },
  "CREPE PM-CARAMELISEE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à crêpe : 1 p",
      "Caramel : 40 g"
    ]
  },
  "NUTELLA": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "NUTELLA : 20 g"
    ]
  },
  "MQILA MERGUEZ": {
    "category": "PETIT DÉJEUNER",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Merguez : 80 g",
      "Poivrons/oignons : 120 g",
      "Œufs : 2 p"
    ]
  },
  "SANDWICH POULARD": {
    "category": "SANDWICHS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain : 1 p",
      "Poulet : 80 g",
      "Fromage : 30 g",
      "Sauce : 40 g",
      "CHAMPIGNONS : 50 g",
      "FRITTES : 200 g"
    ]
  },
  "PASTA NATURE": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 125 g",
      "Parmesan : 30 g",
      "Huile : 60 g",
      "Tomate cerise : 50 g",
      "Pesto : 70 g",
      "Sauce tomate : 80 g",
      "Oignon/Ail : 70 g"
    ]
  },
  "MENU ENFANT PIZZA": {
    "category": "PIZZA",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte : 220 g",
      "Mozzarella : 100 g",
      "Sauce tomate : 100 g",
      "Olives noires : 13 g",
      "COCA : 1 p"
    ]
  },
  "MENU ENFANT BURGER": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viande Hachée : 70 g",
      "Cheddar : 20 g",
      "Sauce Bigy : 30 g",
      "Frites + Sauce : 200 g",
      "Pain : 1 p",
      "coca : 1 p"
    ]
  },
  "SALADE CERCLE VEGGL": {
    "category": "ENTRÉES FROIDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Chou rouge : 100 g",
      "Concombre : 80 g",
      "Tomate cerise : 70 g",
      "Œufs de caille : 1 p",
      "Haricot vert : 60 g",
      "Betterave : 120 g",
      "Carotte : 40 g",
      "Brocoli : 50 g",
      "Radis : 60 g",
      "Thon : 40 g",
      "Vinaigrette : 40 ml",
      "Maïs : 30 g",
      "Poivron : 50 g"
    ]
  },
  "SALADE BURRATTA": {
    "category": "ENTRÉES FROIDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "BURRATA : 1 p",
      "NOIX : 30 G",
      "tomate:30 G",
      "roquette :25 G",
      "vinaigre balsamique :10 G"
    ]
  },
  "RUSSE": {
    "category": "ENTRÉES FROIDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pomme de terre : 150 g",
      "Carotte : 80 g",
      "Petit Pois : 50 g",
      "Œufs de caille : 1 p",
      "Poulet : 50 g",
      "Mayonnaise : 30 g"
    ]
  },
  "SCHWEPPES CITRON": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Canette Schweppes Citron : 1 p"
    ]
  },
  "OULMES MOJITO": {
    "category": "Général",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Canette Oulmès Mojito : 1 p"
    ]
  },
  "OULMES TROPICAL": {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Canette Oulmès Tropical : 1 p"
    ]
  },
  "GINGEMBRE": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus de gingembre : 150 ml",
      "Citron : 30 ml",
      "Miel : 20 g"
    ]
  },
  "COCKTAIL FRAÎCHEUR": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus de pomme : 150 ml",
      "Menthe : 10 g",
      "Citron : 30 ml",
      "Glaçons : 1 p"
    ]
  },
  "SAN FRANCISCO": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus d'orange : 100 ml",
      "Jus d'ananas : 100 ml",
      "Sirop grenadine : 20 ml"
    ]
  },
  "COCKTAIL GREY CORNER": {
    "category": "COCKTAILS & MOCKTAILS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fruits variés : 150 g",
      "Jus d'orange : 100 ml",
      "Sirop : 20 ml"
    ]
  },
  "TRIPLE BERRY": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fruits rouges : 120 g",
      "Lait : 100 ml",
      "Yaourt : 50 g"
    ]
  },
  "ÉNERGÉTIQUE": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Banane : 100 g",
      "Dattes : 40 g",
      "Lait : 150 ml",
      "Miel : 15 g"
    ]
  },
  "PINK SMOOTHIE": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fraise : 100 g",
      "Framboise : 50 g",
      "Yaourt : 80 g",
      "Lait : 100 ml"
    ]
  },
  "MULTI-VITAMINE": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus d'orange : 100 ml",
      "Carotte : 60 g",
      "Pomme : 80 g"
    ]
  },
  "HAWAÏEN": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Ananas : 100 g",
      "Mangue : 80 g",
      "Jus d'orange : 100 ml"
    ]
  },
  "EXOTIQUE BOWL": {
    "category": "SMOOTHIES & BOWLS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fruits exotiques : 150 g",
      "Açaï : 50 g",
      "Muesli : 40 g",
      "Graines de chia : 10 g"
    ]
  },
  "FRUITS SECS": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fruits secs / Amandes : 50 g",
      "Lait : 150 ml",
      "Miel : 15 g"
    ]
  },
  "JUS D'AVOCAT ORANGE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Avocat : 100 g",
      "Jus d'orange : 150 ml"
    ]
  },
  "JUS DE POMME": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pomme : 250 g"
    ]
  },
  "BANANE ORANGE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Banane : 100 g",
      "Jus d'orange : 150 ml"
    ]
  },
  "PANACHÉ AU LAIT": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fruits de saison : 120 g",
      "Lait : 150 ml"
    ]
  },
  "MINI ORANGE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Orange : 150 g"
    ]
  },
  "JUS DE BETTRAVE": {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Betterave : 150 g",
      "Jus d'orange : 100 ml"
    ]
  },
  "GAUFFRE NUTELLA": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à gaufre : 1 p",
      "Nutella : 120 g"
    ]
  },
  "GAUFFRE NUTELA BANANE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à gaufre : 1 p",
      "Nutella : 100 g",
      "Banane : 80 g"
    ]
  },
  "GAUFFRE KUNAFA PISTACHE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à gaufre : 1 p",
      "Kunafa : 40 g",
      "Pate de Pistache : 130 g",
      "Sirop : 20 ml"
    ]
  },
  "GAUFFRE EXOTIQUE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à gaufre : 1 p",
      "Fruits de saison : 80 g",
      "Nutella : 40 g"
    ]
  },
  "GAUFFRE CHOCO-NOISETTE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à gaufre : 1 p",
      "Nutella : 60 g",
      "Noisette : 30 g"
    ]
  },
  "GAUFFRE PM-CARAMELISEE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à gaufre : 1 p",
      "Pomme : 60 g",
      "Caramel : 40 g"
    ]
  },
  "GAUFFRE NATURE": {
    "category": "CRÊPES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâte à gaufre : 1 p",
      "Sucre : 15 g"
    ]
  },
  "COUPE GREY CORNER": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Boules de glace : 3 p",
      "Chantilly : 40 g",
      "Coulis : 20 ml",
      "Amandes : 15 g",
      "BISCUIT : 1 g"
    ]
  },
  "BANANA SPLIT": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Banane : 1 p",
      "Boules de glace : 3 p",
      "Chantilly : 40 g",
      "Chocolat : 20 ml",
      "BISCUIT : 1 g"
    ]
  },
  "COUPE ENFANT": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Boules de glace : 2 p",
      "Chantilly : 20 g",
      "Smarties : 15 g"
    ]
  },
  "COUPE AMOR": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Boules de glace : 3 p",
      "Fruits rouges : 40 g",
      "Chantilly : 30 g"
    ]
  },
  "MILKSHAKE NUTELLA": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait : 180 ml",
      "Boules de glace : 1 p",
      "Nutella : 50 g",
      "Chantilly : 20 g"
    ]
  },
  "MILKSHAKE VANILLE": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Chantilly : 20 g"
    ]
  },
  "MILKSHAKE COOKIES": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Cookies : 40 g",
      "Chantilly : 20 g"
    ]
  },
  "MILKSHAKE FRAISE": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Fraise : 50 g",
      "Chantilly : 20 g"
    ]
  },
  "MILKSHAKE CHOCOLAT": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Chocolat : 30 ml",
      "Chantilly : 20 g"
    ]
  },
  "MILKSHAKE KITKAT": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "KitKat : 1 p",
      "Chantilly : 20 g"
    ]
  },
  "MILKSHAKE CARAMEL": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Caramel : 40 g",
      "Chantilly : 20 g"
    ]
  },
  "ORANGESHAKE AU CHOIX": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Jus d'orange : 180 ml",
      "Boules de glace : 2 p"
    ]
  },
  "PAIN CAKE NUTELLA": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pancakes : 3 p",
      "Nutella : 120 g"
    ]
  },
  "PAIN CAKE FRUITS DE SAISON": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pancakes : 3 p",
      "Fruits de saison : 80 g",
      "Miel : 30 g"
    ]
  },
  "PAIN CAKE ENFANT": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pancakes : 2 p",
      "Nutella : 80 g",
      "Smarties : 10 g"
    ]
  },
  "PAIN CAKE GREY CORNER": {
    "category": "DESSERTS & PÂTISSERIES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pancakes : 3 p",
      "Nutella : 50 g",
      "Fruits de saison : 60 g",
      "Boules de glace : 1 p"
    ]
  },
  "LAIT CHAUD": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait : 200 ml",
      "Sucre : 1 p"
    ]
  },
  "LAIT FROID": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lait : 200 ml",
      "Sucre : 1 p"
    ]
  },
  "CAFE AROMATISE": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Eau chaude : 60 ml",
      "Sirop : 15 ml"
    ]
  },
  "CAFE DOUBLE": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 18 g",
      "Eau chaude : 100 ml",
      "Sucre : 2 p"
    ]
  },
  "THE M3ACHAB": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Thé vert : 8 g",
      "Menthe : 15 g",
      "Sucre : 2 p"
    ]
  },
  "THE AMERICAIN": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Sachet thé : 1 p",
      "Eau chaude : 200 ml"
    ]
  },
  "AMLOU": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Amlou : 40 g"
    ]
  },
  "BEURRE": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Beurre : 30 g"
    ]
  },
  "CORNFLEX": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Corn flakes : 40 g",
      "Lait : 100 ml"
    ]
  },
  "HUILE OLIVE": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Huile d'olive : 40 ml"
    ]
  },
  "LA VACHE QUI RIT": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fromage portion : 2 p"
    ]
  },
  "3 MERGUEZ": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Merguez : 80 g"
    ]
  },
  "CHAMPIGNON": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Champignon : 60 g"
    ]
  },
  "FROMAGE ROUGE TAJ": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fromage : 40 g"
    ]
  },
  "PARMESAN FROMAGE": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Parmesan : 30 g"
    ]
  },
  "AMUSE BOUCHE": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Fokacha : 300 g"
    ]
  },
  "RIZ": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Riz : 150 g"
    ]
  },
  "LEGUMES SAUTEES": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Légumes variés : 150 g",
      "Huile : 10 ml"
    ]
  },
  "MSSEMEN AGRICH": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Msemen : 1 p",
      "Griche : 40 g"
    ]
  },
  "PAIN CEREAL": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain céréales : 1 p"
    ]
  },
  "PAIN GRILLE": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain toast : 2 p"
    ]
  },
  "BERBER": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Œufs : 2 p",
      "Khlii : 50 g",
      "Tomate : 40 g"
    ]
  },
  "TOAST NUTELLA": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pain toast : 2 p",
      "Nutella : 100 g"
    ]
  },
  "CONFITURE": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Confiture : 40 g"
    ]
  },
  "LBEN": {
    "category": "SUPPLÉMENTS & EXTRAS",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Lben : 250 ml"
    ]
  },
  "MENU ENFANT PASTA NATURE": {
    "category": "PÂTES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Pâtes : 100 g",
      "Sauce tomate : 60 g",
      "Parmesan : 30 g",
      "Canette Soda : 3.5 p"
    ]
  },
  "CAPPUCCINO CHANTILLY": {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Café : 10 g",
      "Lait chaud : 100 ml",
      "Crème chantilly : 30 g",
      "Cacao : 3 g",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  "PETIT BAGHRIR": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Baghrir : 1 p"
    ]
  },
  "MSEMEN NATURE": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Msemen : 1 p"
    ]
  },
  "VIENNOISERIE": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Viennoiserie : 1 p"
    ]
  },
  "HARCHA NATURE": {
    "category": "A LA CARTE & BOULANGERIE",
    "standardPortionWeight": "Portion standardisée Déstockage",
    "rationale": "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
    "tech": [
      "Harcha : 1 p"
    ]
  }
};

  // Recherche d'une fiche technique de référence standard
  function getProposedStandard(recipeName, currentItem) {
    if (!recipeName) return null;

    const raw = String(recipeName).toUpperCase().trim();
    const clean = (typeof global.cleanText === 'function') 
      ? global.cleanText(raw).toUpperCase() 
      : raw.toLowerCase().trim().toUpperCase();

    // 1. Correspondance exacte par clé
    if (PROPOSED_STANDARDS[raw]) {
      return PROPOSED_STANDARDS[raw];
    }
    if (PROPOSED_STANDARDS[clean]) {
      return PROPOSED_STANDARDS[clean];
    }

    // 2. Recherche par alias ou correspondance souple (sans préfixe PIZZA, PASTA, PLAT...)
    const stripped = clean.replace(/^(?:PIZZA|PASTA|PLAT|SANDWICH|PANINI|CREPE|SALADE|BURGER)\s+/, '').trim();
    for (const [k, v] of Object.entries(PROPOSED_STANDARDS)) {
      const kClean = (typeof global.cleanText === 'function') ? global.cleanText(k).toUpperCase() : k;
      const kStripped = kClean.replace(/^(?:PIZZA|PASTA|PLAT|SANDWICH|PANINI|CREPE|SALADE|BURGER)\s+/, '').trim();
      if (kClean === clean || kStripped === stripped) {
        return v;
      }
    }

    // 3. Fallback direct sur la fiche d'exploitation Déstockage transmise
    if (currentItem && currentItem.tech && currentItem.tech.length > 0) {
      return {
        category: currentItem.category || "AUTRE",
        standardPortionWeight: "Portion standardisée Déstockage",
        rationale: "Fiche technique standard de référence (Déstockage & Exploitation Grey Corner)",
        tech: currentItem.tech.slice()
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

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PROPOSED_STANDARDS, getProposedStandard };
  }

})(typeof window !== 'undefined' ? window : globalThis);
