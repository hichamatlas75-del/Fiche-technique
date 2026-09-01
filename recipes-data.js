/**
 * GREY CORNER — Base de données centralisée des Fiches Techniques et Recettes
 * Source Unique de Vérité (SSOT) mise à jour automatiquement le 2026-08-31T19:49:25.002Z
 */

(function(global) {
const DATA = [
  {
    "category": "CAFÉS & BOISSONS CHAUDES",
    "key": "bc",
    "color": "#b45309",
    "items": [
      {
        "name": "CAFÉ NOIR / ESPRESSO",
        "image": "images/boisson-cafe.webp",
        "prepTime": 2,
        "tech": [
          "Café : 10 g",
          "Eau chaude : 60 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "16 DH",
        "cost": 3.24,
        "sellPrice": 16,
        "foodCost": 20.3,
        "margin": 79.8,
        "grossMarginDH": 12.76
      },
      {
        "name": "CAFÉ AMÉRICAIN",
        "image": "images/boisson-americano.webp",
        "prepTime": 2,
        "tech": [
          "Café : 10 g",
          "Eau chaude : 150 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "17 DH",
        "cost": 3.24,
        "sellPrice": 17,
        "foodCost": 19.1,
        "margin": 80.9,
        "grossMarginDH": 13.76
      },
      {
        "name": "CAFÉ AU LAIT",
        "image": "images/boisson-cafelait.webp",
        "prepTime": 3,
        "tech": [
          "Café : 10 g",
          "Lait chaud : 120 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "19 DH",
        "cost": 4.34,
        "sellPrice": 19,
        "foodCost": 22.8,
        "margin": 77.2,
        "grossMarginDH": 14.66
      },
      {
        "name": "CAFÉ LATTE",
        "image": "images/boisson-cafelatte.webp",
        "prepTime": 3,
        "tech": [
          "Café : 10 g",
          "Lait chaud : 180 ml",
          "Mousse de lait : 30 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "19 DH",
        "cost": 5.17,
        "sellPrice": 19,
        "foodCost": 27.2,
        "margin": 72.8,
        "grossMarginDH": 13.83
      },
      {
        "name": "CAPPUCCINO ITALIEN",
        "image": "images/boisson-cappu.webp",
        "prepTime": 3,
        "tech": [
          "Café : 10 g",
          "Lait chaud : 100 ml",
          "Mousse de lait : 50 ml",
          "Cacao en poudre : 3 g",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "19 DH",
        "cost": 4.83,
        "sellPrice": 19,
        "foodCost": 25.4,
        "margin": 74.6,
        "grossMarginDH": 14.17
      },
      {
        "name": "CAPPUCCINO CHANTILLY",
        "image": "images/boisson-cappu-chant.webp",
        "prepTime": 3,
        "tech": [
          "Café : 10 g",
          "Lait chaud : 100 ml",
          "Crème chantilly : 30 g",
          "Cacao : 3 g",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "22 DH",
        "cost": 5.27,
        "sellPrice": 22,
        "foodCost": 24,
        "margin": 76,
        "grossMarginDH": 16.73
      },
      {
        "name": "CAFÉ NESPRESSO",
        "image": "images/boisson-nespresso.webp",
        "prepTime": 2,
        "tech": [
          "Pastille Nespresso : 1 p",
          "Eau chaude : 50 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "22 DH",
        "cost": 6.59,
        "sellPrice": 22,
        "foodCost": 30,
        "margin": 70,
        "grossMarginDH": 15.41
      },
      {
        "name": "CHOCOLAT CHAUD",
        "image": "images/boisson-chocolat.webp",
        "prepTime": 3,
        "tech": [
          "Chocolat en poudre : 30 g",
          "Lait chaud : 200 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "18 DH",
        "cost": 6.02,
        "sellPrice": 18,
        "foodCost": 33.4,
        "margin": 66.6,
        "grossMarginDH": 11.98
      },
      {
        "name": "CHOCOLAT CHAUD CHANTILLY",
        "image": "images/boisson-choc-chant.webp",
        "prepTime": 3,
        "tech": [
          "Chocolat en poudre : 30 g",
          "Lait chaud : 180 ml",
          "Crème chantilly : 35 g",
          "Coulis chocolat : 10 ml",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "22 DH",
        "cost": 6.94,
        "sellPrice": 22,
        "foodCost": 31.5,
        "margin": 68.5,
        "grossMarginDH": 15.06
      },
      {
        "name": "CHOCOLAT FONDU GOURMAND",
        "image": "images/boisson-choc-fondue.webp",
        "prepTime": 4,
        "tech": [
          "Chocolat noir fondu : 45 g",
          "Lait chaud : 180 ml",
          "Guimauves : 15 g",
          "Chantilly : 30 g",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "26 DH",
        "cost": 8.4,
        "sellPrice": 26,
        "foodCost": 32.3,
        "margin": 67.7,
        "grossMarginDH": 17.6
      },
      {
        "name": "THÉ MAROCAIN À LA MENTHE",
        "image": "images/boisson-the.webp",
        "prepTime": 4,
        "tech": [
          "Thé vert Gunpowder : 10 g",
          "Menthe fraîche : 20 g",
          "Sucre : 25 g",
          "Eau bouillante : 300 ml",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "16 DH",
        "cost": 3.67,
        "sellPrice": 16,
        "foodCost": 22.9,
        "margin": 77.1,
        "grossMarginDH": 12.33
      },
      {
        "name": "THÉ NOIR",
        "image": "images/boisson-thenoir.webp",
        "prepTime": 3,
        "tech": [
          "Thé noir : 8 g",
          "Eau bouillante : 250 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "15 DH",
        "cost": 3.77,
        "sellPrice": 15,
        "foodCost": 25.1,
        "margin": 74.9,
        "grossMarginDH": 11.23
      },
      {
        "name": "THÉ NOIR AU LAIT",
        "image": "images/boisson-thenoir-lait.webp",
        "prepTime": 3,
        "tech": [
          "Thé noir : 8 g",
          "Lait chaud : 120 ml",
          "Eau : 130 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "18 DH",
        "cost": 4.87,
        "sellPrice": 18,
        "foodCost": 27.1,
        "margin": 72.9,
        "grossMarginDH": 13.13
      },
      {
        "name": "VERVEINE NATURE",
        "image": "images/boisson-verveine.webp",
        "prepTime": 4,
        "tech": [
          "Verveine séchée : 10 g",
          "Eau chaude : 250 ml",
          "Miel / Sucre : 20 g",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "15 DH",
        "cost": 3.1,
        "sellPrice": 15,
        "foodCost": 20.7,
        "margin": 79.3,
        "grossMarginDH": 11.9
      },
      {
        "name": "VERVEINE AROMATISÉE",
        "image": "images/boisson-verveine-arom.webp",
        "prepTime": 4,
        "tech": [
          "Verveine séchée : 10 g",
          "Fleur d'oranger : 5 ml",
          "Zeste de citron : 5 g",
          "Eau chaude : 250 ml",
          "Miel : 20 g",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "18 DH",
        "cost": 3.38,
        "sellPrice": 18,
        "foodCost": 18.8,
        "margin": 81.2,
        "grossMarginDH": 14.62
      },
      {
        "name": "INFUSION BIEN-ÊTRE",
        "image": "images/boisson-infusion.webp",
        "prepTime": 4,
        "tech": [
          "Mélange plantes infusion : 10 g",
          "Eau chaude : 250 ml",
          "Miel : 20 g",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "18 DH",
        "cost": 7.62,
        "sellPrice": 18,
        "foodCost": 42.3,
        "margin": 57.7,
        "grossMarginDH": 10.38
      },
      {
        "name": "VERRE DE LAIT",
        "image": "images/boisson-lait.webp",
        "prepTime": 2,
        "tech": [
          "Lait entier frais : 250 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "12 DH",
        "cost": 4.38,
        "sellPrice": 12,
        "foodCost": 36.5,
        "margin": 63.5,
        "grossMarginDH": 7.62
      },
      {
        "name": "LAIT CASSÉ",
        "image": "images/boisson-cafelait.webp",
        "prepTime": 2,
        "tech": [
          "Café : 6 g",
          "Lait chaud : 150 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "19 DH",
        "cost": 4.16,
        "sellPrice": 19,
        "foodCost": 21.9,
        "margin": 78.1,
        "grossMarginDH": 14.84
      },
      {
        "name": "CAFÉ SÉPARÉ",
        "image": "images/boisson-cafelait.webp",
        "prepTime": 3,
        "tech": [
          "Café : 10 g",
          "Lait chaud : 100 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "24 DH",
        "cost": 4.16,
        "sellPrice": 24,
        "foodCost": 17.3,
        "margin": 82.7,
        "grossMarginDH": 19.84
      },
      {
        "name": "CAFÉ MOITIÉ",
        "image": "images/boisson-cafelait.webp",
        "prepTime": 2,
        "tech": [
          "Café : 10 g",
          "Lait chaud : 80 ml",
          "Sucre : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "19 DH",
        "cost": 3.97,
        "sellPrice": 19,
        "foodCost": 20.9,
        "margin": 79.1,
        "grossMarginDH": 15.03
      }
    ]
  },
  {
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "key": "fg",
    "color": "#854d0e",
    "items": [
      {
        "name": "ICE COFFEE CLASSIQUE",
        "image": "images/icecoffee-class.webp",
        "prepTime": 3,
        "tech": [
          "Café espresso : 10 g",
          "Lait froid : 100 ml",
          "Sirop de canne : 20 ml",
          "Glaçons : 120 g",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "20 DH",
        "cost": 4.57,
        "sellPrice": 20,
        "foodCost": 22.9,
        "margin": 77.2,
        "grossMarginDH": 15.43
      },
      {
        "name": "ICE COFFEE AROMATISÉ",
        "image": "images/icecoffee-arom.webp",
        "prepTime": 3,
        "tech": [
          "Café espresso : 10 g",
          "Sirop Caramel / Vanille : 25 ml",
          "Lait froid : 120 ml",
          "Glaçons : 120 g",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "23 DH",
        "cost": 4.93,
        "sellPrice": 23,
        "foodCost": 21.4,
        "margin": 78.6,
        "grossMarginDH": 18.07
      },
      {
        "name": "FRAPPUCCINO CLASSIQUE",
        "image": "images/frappu-class.webp",
        "prepTime": 4,
        "tech": [
          "Café espresso : 10 g",
          "Lait : 120 ml",
          "Base frappé vanille : 25 g",
          "Glace pilée : 150 g",
          "Crème chantilly : 30 g"
        ],
        "price": "25 DH",
        "cost": 4.28,
        "sellPrice": 25,
        "foodCost": 17.1,
        "margin": 82.9,
        "grossMarginDH": 20.72
      },
      {
        "name": "FRAPPUCCINO AROMATISÉ",
        "image": "images/frappu-arom.webp",
        "prepTime": 4,
        "tech": [
          "Café espresso : 10 g",
          "Lait : 120 ml",
          "Sirop Noisette / Caramel : 30 ml",
          "Glace pilée : 150 g",
          "Chantilly & Nappage : 35 g"
        ],
        "price": "28 DH",
        "cost": 4.35,
        "sellPrice": 28,
        "foodCost": 15.5,
        "margin": 84.5,
        "grossMarginDH": 23.65
      }
    ]
  },
  {
    "category": "ICE TEA MAISON",
    "key": "it",
    "color": "#ea580c",
    "items": [
      {
        "name": "ICE TEA PÊCHE MAISON",
        "image": "images/icetea-peche.webp",
        "prepTime": 3,
        "tech": [
          "Infusion thé noir : 200 ml",
          "Sirop de pêche : 30 ml",
          "Jus de citron : 15 ml",
          "Pêche fraîche : 30 g",
          "Glaçons : 100 g"
        ],
        "price": "28 DH",
        "cost": 2.52,
        "sellPrice": 28,
        "foodCost": 9,
        "margin": 91,
        "grossMarginDH": 25.48
      },
      {
        "name": "ICE TEA CITRON MAISON",
        "image": "images/icetea-citron.webp",
        "prepTime": 3,
        "tech": [
          "Infusion thé vert : 200 ml",
          "Jus de citron pressé : 30 ml",
          "Sirop de canne : 25 ml",
          "Rondelles de citron : 2 tr",
          "Glaçons : 100 g"
        ],
        "price": "28 DH",
        "cost": 2.6,
        "sellPrice": 28,
        "foodCost": 9.3,
        "margin": 90.7,
        "grossMarginDH": 25.4
      },
      {
        "name": "ICE TEA FRAMBOISE MAISON",
        "image": "images/icetea-framboise.webp",
        "prepTime": 3,
        "tech": [
          "Infusion thé fruits rouges : 200 ml",
          "Purée de framboise : 35 g",
          "Jus de citron : 15 ml",
          "Framboises fraîches : 20 g",
          "Glaçons : 100 g"
        ],
        "price": "28 DH",
        "cost": 2.58,
        "sellPrice": 28,
        "foodCost": 9.2,
        "margin": 90.8,
        "grossMarginDH": 25.42
      }
    ]
  },
  {
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "key": "jf",
    "color": "#f59e0b",
    "items": [
      {
        "name": "JUS D'ORANGE PRESSÉ",
        "image": "images/jus-orange.webp",
        "prepTime": 3,
        "tech": [
          "Oranges fraîches à jus : 380 g"
        ],
        "price": "22 DH",
        "cost": 1.9,
        "sellPrice": 22,
        "foodCost": 8.6,
        "margin": 91.4,
        "grossMarginDH": 20.1
      },
      {
        "name": "JUS DE CITRON / CITRONNADE",
        "image": "images/jus-citron.webp",
        "prepTime": 3,
        "tech": [
          "Citron pressé : 120 g",
          "Sirop de canne : 30 ml",
          "Eau filtrée & Glaçons : 150 ml",
          "Menthe fraîche : 5 g"
        ],
        "price": "25 DH",
        "cost": 2.45,
        "sellPrice": 25,
        "foodCost": 9.8,
        "margin": 90.2,
        "grossMarginDH": 22.55
      },
      {
        "name": "JUS DE FRAISE",
        "image": "images/jus-fraise.webp",
        "prepTime": 3,
        "tech": [
          "Fraises fraîches : 220 g",
          "Jus d'orange frais : 80 ml",
          "Sirop de sucre : 15 ml"
        ],
        "price": "30 DH",
        "cost": 4.67,
        "sellPrice": 30,
        "foodCost": 15.6,
        "margin": 84.4,
        "grossMarginDH": 25.33
      },
      {
        "name": "JUS DE FRAMBOISE",
        "image": "images/jus-framboise.webp",
        "prepTime": 3,
        "tech": [
          "Framboises fraîches : 200 g",
          "Jus d'orange : 80 ml",
          "Sirop de sucre : 20 ml"
        ],
        "price": "35 DH",
        "cost": 8.1,
        "sellPrice": 35,
        "foodCost": 23.1,
        "margin": 76.9,
        "grossMarginDH": 26.9
      },
      {
        "name": "JUS DE MANGUE",
        "image": "images/jus-mangue.webp",
        "prepTime": 3,
        "tech": [
          "Mangue fraîche : 220 g",
          "Jus d'orange frais : 80 ml",
          "Glaçons : 50 g"
        ],
        "price": "30 DH",
        "cost": 7.22,
        "sellPrice": 30,
        "foodCost": 24.1,
        "margin": 75.9,
        "grossMarginDH": 22.78
      },
      {
        "name": "JUS D'ANANAS",
        "image": "images/jus-ananas.webp",
        "prepTime": 3,
        "tech": [
          "Ananas frais : 250 g",
          "Glaçons : 50 g"
        ],
        "price": "32 DH",
        "cost": 4.5,
        "sellPrice": 32,
        "foodCost": 14.1,
        "margin": 85.9,
        "grossMarginDH": 27.5
      },
      {
        "name": "JUS DE PÊCHE",
        "image": "images/jus-peche.webp",
        "prepTime": 3,
        "tech": [
          "Pêche fraîche : 220 g",
          "Jus d'orange frais : 80 ml",
          "Glaçons : 50 g"
        ],
        "price": "30 DH",
        "cost": 7,
        "sellPrice": 30,
        "foodCost": 23.3,
        "margin": 76.7,
        "grossMarginDH": 23
      },
      {
        "name": "JUS DE CAROTTE",
        "image": "images/jus-carotte.webp",
        "prepTime": 4,
        "tech": [
          "Carottes fraîches : 350 g",
          "Jus d'orange frais : 50 ml"
        ],
        "price": "25 DH",
        "cost": 2.35,
        "sellPrice": 25,
        "foodCost": 9.4,
        "margin": 90.6,
        "grossMarginDH": 22.65
      },
      {
        "name": "JUS POMME & BANANE",
        "image": "images/jus-pomme-banane.webp",
        "prepTime": 3,
        "tech": [
          "Pomme fraîche : 150 g",
          "Banane : 120 g",
          "Lait ou Jus d'orange : 100 ml"
        ],
        "price": "28 DH",
        "cost": 4.7,
        "sellPrice": 28,
        "foodCost": 16.8,
        "margin": 83.2,
        "grossMarginDH": 23.3
      },
      {
        "name": "JUS D'AVOCAT AU LAIT",
        "image": "images/jus-avocat.webp",
        "prepTime": 3,
        "tech": [
          "Avocat Hass : 160 g",
          "Lait entier frais : 200 ml",
          "Sucre : 20 g"
        ],
        "price": "32 DH",
        "cost": 5.79,
        "sellPrice": 32,
        "foodCost": 18.1,
        "margin": 81.9,
        "grossMarginDH": 26.21
      },
      {
        "name": "JUS D'AVOCAT ROYAL FRUITS SECS",
        "image": "images/jus-avocatsec.webp",
        "prepTime": 4,
        "tech": [
          "Avocat Hass : 160 g",
          "Lait entier : 200 ml",
          "Miel pur : 25 g",
          "Amandes, Noix, Raisins secs : 40 g"
        ],
        "price": "38 DH",
        "cost": 7.87,
        "sellPrice": 38,
        "foodCost": 20.7,
        "margin": 79.3,
        "grossMarginDH": 30.13
      },
      {
        "name": "JUS PANACHÉ FRUITS FRAIS",
        "image": "images/jus-panache.webp",
        "prepTime": 4,
        "tech": [
          "Jus d'orange : 100 ml",
          "Banane : 80 g",
          "Fraise : 60 g",
          "Pomme : 60 g",
          "Avocat : 40 g"
        ],
        "price": "38 DH",
        "cost": 4.44,
        "sellPrice": 38,
        "foodCost": 11.7,
        "margin": 88.3,
        "grossMarginDH": 33.56
      },
      {
        "name": "COCKTAIL À BASE D'ORANGE",
        "image": "images/jus-cocktailorange.webp",
        "prepTime": 3,
        "tech": [
          "Jus d'orange frais : 180 ml",
          "Sirop de grenadine : 20 ml",
          "Fraise fraîche : 50 g",
          "Ananas frais : 50 g"
        ],
        "price": "42 DH",
        "cost": 3.11,
        "sellPrice": 42,
        "foodCost": 7.4,
        "margin": 92.6,
        "grossMarginDH": 38.89
      },
      {
        "name": "ZA3ZA3 ROYAL GREY CORNER",
        "image": "images/jus-za3za3.webp",
        "prepTime": 5,
        "tech": [
          "Avocat : 150 g",
          "Lait : 180 ml",
          "Chocolat KitKat / Snickers : 1 p",
          "Fruits secs variés : 50 g",
          "Biscuits Oreo : 2 p",
          "Crème chantilly : 35 g",
          "Coulis caramel : 15 ml"
        ],
        "price": "46 DH",
        "cost": 16.28,
        "sellPrice": 46,
        "foodCost": 35.4,
        "margin": 64.6,
        "grossMarginDH": 29.72
      }
    ]
  },
  {
    "category": "COCKTAILS & MOCKTAILS",
    "key": "ck",
    "color": "#ec4899",
    "items": [
      {
        "name": "SIGNATURE GREY CORNER",
        "image": "images/cocktail-gc.webp",
        "prepTime": 4,
        "tech": [
          "Jus d'ananas : 100 ml",
          "Jus de mangue : 80 ml",
          "Purée de fraise : 40 ml",
          "Jus de citron vert : 20 ml",
          "Sirop de passion : 20 ml",
          "Fruits frais décor : 30 g"
        ],
        "price": "48 DH",
        "cost": 5.67,
        "sellPrice": 48,
        "foodCost": 11.8,
        "margin": 88.2,
        "grossMarginDH": 42.33
      },
      {
        "name": "VIRGIN PIÑA COLADA",
        "image": "images/cocktail-pinacolada.webp",
        "prepTime": 4,
        "tech": [
          "Jus d'ananas frais : 180 ml",
          "Crème de coco : 60 ml",
          "Lait de coco : 40 ml",
          "Glaçons : 100 g",
          "Tranche d'ananas : 1 tr"
        ],
        "price": "42 DH",
        "cost": 7.14,
        "sellPrice": 42,
        "foodCost": 17,
        "margin": 83,
        "grossMarginDH": 34.86
      },
      {
        "name": "COCKTAIL TROPICAL",
        "image": "images/cocktail-tropical.webp",
        "prepTime": 3,
        "tech": [
          "Jus de mangue : 80 ml",
          "Jus d'ananas : 80 ml",
          "Jus d'orange : 60 ml",
          "Sirop de grenadine : 15 ml",
          "Glaçons : 80 g"
        ],
        "price": "42 DH",
        "cost": 3.52,
        "sellPrice": 42,
        "foodCost": 8.4,
        "margin": 91.6,
        "grossMarginDH": 38.48
      },
      {
        "name": "MOJITO VIRGIN / FRAÎCHEUR",
        "image": "images/cocktail-fraicheur.webp",
        "prepTime": 4,
        "tech": [
          "Citron vert frais : 1 p (40 g)",
          "Menthe fraîche : 15 g",
          "Sucre de canne : 20 g",
          "Eau gazeuse Oulmès : 150 ml",
          "Glace pilée : 120 g"
        ],
        "price": "42 DH",
        "cost": 3.1,
        "sellPrice": 42,
        "foodCost": 7.4,
        "margin": 92.6,
        "grossMarginDH": 38.9
      },
      {
        "name": "DÉTOX GINGEMBRE CITRON",
        "image": "images/cocktail-gingembre.webp",
        "prepTime": 4,
        "tech": [
          "Gingembre frais râpé : 15 g",
          "Jus de citron pressé : 60 ml",
          "Miel pur d'abeille : 25 g",
          "Pomme verte : 100 g",
          "Eau minérale : 100 ml"
        ],
        "price": "32 DH",
        "cost": 3.15,
        "sellPrice": 32,
        "foodCost": 9.8,
        "margin": 90.2,
        "grossMarginDH": 28.85
      },
      {
        "name": "COCKTAIL SANS ALCOOL SPÉCIAL",
        "image": "images/cocktail-sf.webp",
        "prepTime": 3,
        "tech": [
          "Jus d'orange : 100 ml",
          "Jus de pêche : 80 ml",
          "Purée de framboise : 30 ml",
          "Sprite : 60 ml",
          "Glaçons : 80 g"
        ],
        "price": "34 DH",
        "cost": 11.5,
        "sellPrice": 34,
        "foodCost": 33.8,
        "margin": 66.2,
        "grossMarginDH": 22.5
      },
      {
        "name": "MOJITO TROPICAL",
        "image": "images/cocktail-tropical.webp",
        "prepTime": 3,
        "tech": [
          "Citron vert : 30 g",
          "Menthe fraîche : 15 g",
          "Mangue / Passion : 60 ml",
          "Eau gazeuse Oulmès : 150 ml",
          "Glace pilée : 120 g"
        ],
        "price": "38 DH",
        "cost": 4.11,
        "sellPrice": 38,
        "foodCost": 10.8,
        "margin": 89.2,
        "grossMarginDH": 33.89
      },
      {
        "name": "MOJITO RED BULL",
        "image": "images/cocktail-fraicheur.webp",
        "prepTime": 3,
        "tech": [
          "Citron vert : 30 g",
          "Menthe fraîche : 15 g",
          "Red Bull (Canette 250ml) : 1 p",
          "Glace pilée : 120 g"
        ],
        "price": "44 DH",
        "cost": 15.01,
        "sellPrice": 44,
        "foodCost": 34.1,
        "margin": 65.9,
        "grossMarginDH": 28.99
      },
      {
        "name": "MOJITO CITRON",
        "image": "images/cocktail-fraicheur.webp",
        "prepTime": 3,
        "tech": [
          "Citron vert : 40 g",
          "Menthe fraîche : 15 g",
          "Sucre de canne : 20 g",
          "Eau gazeuse Oulmès : 150 ml",
          "Glace pilée : 120 g"
        ],
        "price": "34 DH",
        "cost": 3.1,
        "sellPrice": 34,
        "foodCost": 9.1,
        "margin": 90.9,
        "grossMarginDH": 30.9
      }
    ]
  },
  {
    "category": "SMOOTHIES & BOWLS",
    "key": "sm",
    "color": "#a855f7",
    "items": [
      {
        "name": "SMOOTHIE PINK BERRY",
        "image": "images/smoothie-pink.webp",
        "prepTime": 4,
        "tech": [
          "Fraises fraîches : 100 g",
          "Framboises : 60 g",
          "Yaourt grec nature : 100 g",
          "Jus de pomme : 80 ml",
          "Glaçons : 50 g"
        ],
        "price": "48 DH",
        "cost": 7.76,
        "sellPrice": 48,
        "foodCost": 16.2,
        "margin": 83.8,
        "grossMarginDH": 40.24
      },
      {
        "name": "SMOOTHIE ÉNERGÉTIQUE",
        "image": "images/smoothie-energetic.webp",
        "prepTime": 4,
        "tech": [
          "Banane : 120 g",
          "Dattes Medjool : 40 g",
          "Flocons d'avoine : 30 g",
          "Lait d'amande : 180 ml",
          "Beurre de cacahuète : 20 g"
        ],
        "price": "42 DH",
        "cost": 7.13,
        "sellPrice": 42,
        "foodCost": 17,
        "margin": 83,
        "grossMarginDH": 34.87
      },
      {
        "name": "SMOOTHIE HAWAÏ",
        "image": "images/smoothie-hawai.webp",
        "prepTime": 4,
        "tech": [
          "Mangue fraîche : 100 g",
          "Ananas frais : 100 g",
          "Fruit de la passion : 30 g",
          "Jus d'orange : 80 ml",
          "Glaçons : 50 g"
        ],
        "price": "42 DH",
        "cost": 6.65,
        "sellPrice": 42,
        "foodCost": 15.8,
        "margin": 84.2,
        "grossMarginDH": 35.35
      },
      {
        "name": "SMOOTHIE MULTIVITAMINÉ",
        "image": "images/smoothie-multiv.webp",
        "prepTime": 4,
        "tech": [
          "Jus d'orange frais : 100 ml",
          "Carotte : 80 g",
          "Pomme : 80 g",
          "Gingembre frais : 5 g",
          "Glaçons : 50 g"
        ],
        "price": "42 DH",
        "cost": 2.25,
        "sellPrice": 42,
        "foodCost": 5.4,
        "margin": 94.6,
        "grossMarginDH": 39.75
      },
      {
        "name": "SMOOTHIE JELLY FRUIT",
        "image": "images/smoothie-jelly.webp",
        "prepTime": 4,
        "tech": [
          "Fruits rouges : 120 g",
          "Banane : 80 g",
          "Jus de cranberry : 80 ml",
          "Perles de fruits Popping Boba : 30 g"
        ],
        "price": "48 DH",
        "cost": 9.52,
        "sellPrice": 48,
        "foodCost": 19.8,
        "margin": 80.2,
        "grossMarginDH": 38.48
      },
      {
        "name": "SMOOTHIE TRIPLE FRUITS",
        "image": "images/smoothie-triple.webp",
        "prepTime": 4,
        "tech": [
          "Fraise : 70 g",
          "Mangue : 70 g",
          "Kiwi frais : 70 g",
          "Jus d'orange : 80 ml",
          "Glaçons : 50 g"
        ],
        "price": "48 DH",
        "cost": 5.02,
        "sellPrice": 48,
        "foodCost": 10.5,
        "margin": 89.5,
        "grossMarginDH": 42.98
      },
      {
        "name": "SMOOTHIE BOWL EXOTIQUE",
        "image": "images/smoothiebowl-exotic.webp",
        "prepTime": 5,
        "tech": [
          "Base mixée Mangue/Banane/Passion : 250 g",
          "Granola croustillant : 40 g",
          "Kiwi frais : 30 g",
          "Graines de chia : 10 g",
          "Noix de coco râpée : 10 g"
        ],
        "price": "48 DH",
        "cost": 6.69,
        "sellPrice": 48,
        "foodCost": 13.9,
        "margin": 86.1,
        "grossMarginDH": 41.31
      },
      {
        "name": "SMOOTHIE BOWL ULTRA BOOST",
        "image": "images/smoothiebowl-ultra.webp",
        "prepTime": 5,
        "tech": [
          "Base mixée Açaï/Fruits rouges : 250 g",
          "Banane : 50 g",
          "Granola croustillant : 40 g",
          "Myrtilles & Framboises : 30 g",
          "Graines de chia : 10 g",
          "Amandes effilées : 15 g"
        ],
        "price": "48 DH",
        "cost": 15.6,
        "sellPrice": 48,
        "foodCost": 32.5,
        "margin": 67.5,
        "grossMarginDH": 32.4
      }
    ]
  },
  {
    "category": "SODAS & BOISSONS FRAÎCHES",
    "key": "sd",
    "color": "#3b82f6",
    "items": [
      {
        "name": "COCA-COLA 33CL",
        "image": "images/soda-coca.webp",
        "prepTime": 1,
        "tech": [
          "Coca-Cola (Canette 33cl) : 1 p",
          "Tranche de citron : 1 tr",
          "Glaçons"
        ],
        "price": "17 DH",
        "cost": 1.5,
        "sellPrice": 17,
        "foodCost": 8.8,
        "margin": 91.2,
        "grossMarginDH": 15.5
      },
      {
        "name": "COCA-COLA ZÉRO 33CL",
        "image": "images/soda-cocazero.webp",
        "prepTime": 1,
        "tech": [
          "Coca-Cola Zéro (Canette 33cl) : 1 p",
          "Tranche de citron : 1 tr",
          "Glaçons"
        ],
        "price": "17 DH",
        "cost": 1.5,
        "sellPrice": 17,
        "foodCost": 8.8,
        "margin": 91.2,
        "grossMarginDH": 15.5
      },
      {
        "name": "SPRITE 33CL",
        "image": "images/soda-sprite.webp",
        "prepTime": 1,
        "tech": [
          "Sprite (Canette 33cl) : 1 p",
          "Tranche de citron : 1 tr",
          "Glaçons"
        ],
        "price": "17 DH",
        "cost": 1.5,
        "sellPrice": 17,
        "foodCost": 8.8,
        "margin": 91.2,
        "grossMarginDH": 15.5
      },
      {
        "name": "HAWAÏ 33CL",
        "image": "images/soda-hawai.webp",
        "prepTime": 1,
        "tech": [
          "Hawaï Canette : 33 cl",
          "Glaçons"
        ],
        "price": "17 DH",
        "cost": 7.55,
        "sellPrice": 17,
        "foodCost": 44.4,
        "margin": 55.6,
        "grossMarginDH": 9.45
      },
      {
        "name": "POMS 33CL",
        "image": "images/soda-poms.webp",
        "prepTime": 1,
        "tech": [
          "Poms (Canette 33cl) : 1 p",
          "Glaçons"
        ],
        "price": "17 DH",
        "cost": 7.55,
        "sellPrice": 17,
        "foodCost": 44.4,
        "margin": 55.6,
        "grossMarginDH": 9.45
      },
      {
        "name": "SCHWEPPES CITRON / TONIC 33CL",
        "image": "images/soda-schweppes.webp",
        "prepTime": 1,
        "tech": [
          "Schweppes (Canette 33cl) : 1 p",
          "Tranche de citron : 1 tr",
          "Glaçons"
        ],
        "price": "17 DH",
        "cost": 8.05,
        "sellPrice": 17,
        "foodCost": 47.4,
        "margin": 52.6,
        "grossMarginDH": 8.95
      },
      {
        "name": "ORANGINA 33CL",
        "image": "images/soda-orangina.webp",
        "prepTime": 1,
        "tech": [
          "Orangina (Canette 33cl) : 1 p",
          "Tranche d'orange : 1 tr",
          "Glaçons"
        ],
        "price": "17 DH",
        "cost": 6.6,
        "sellPrice": 17,
        "foodCost": 38.8,
        "margin": 61.2,
        "grossMarginDH": 10.4
      },
      {
        "name": "RED BULL 250ML",
        "image": "images/soda-redbull.webp",
        "prepTime": 1,
        "tech": [
          "Red Bull (Canette 250ml) : 1 p",
          "Glaçons"
        ],
        "price": "28 DH",
        "cost": 13.96,
        "sellPrice": 28,
        "foodCost": 49.9,
        "margin": 50.1,
        "grossMarginDH": 14.04
      }
    ]
  },
  {
    "category": "EAUX MINÉRALES & GAZEUSES",
    "key": "ea",
    "color": "#06b6d4",
    "items": [
      {
        "name": "EAU MINÉRALE 33CL",
        "image": "images/eau-33.webp",
        "prepTime": 1,
        "tech": [
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "10 DH",
        "cost": 1.8,
        "sellPrice": 10,
        "foodCost": 18,
        "margin": 82,
        "grossMarginDH": 8.2
      },
      {
        "name": "EAU MINÉRALE 50CL",
        "image": "images/eau-50.webp",
        "prepTime": 1,
        "tech": [
          "Bouteille Eau Minérale 50cl : 1 p"
        ],
        "price": "12 DH",
        "cost": 2.73,
        "sellPrice": 12,
        "foodCost": 22.8,
        "margin": 77.3,
        "grossMarginDH": 9.27
      },
      {
        "name": "EAU MINÉRALE 75CL",
        "image": "images/eau-75.webp",
        "prepTime": 1,
        "tech": [
          "Bouteille Eau Minérale 75cl : 1 p"
        ],
        "price": "22 DH",
        "cost": 10.4,
        "sellPrice": 22,
        "foodCost": 47.3,
        "margin": 52.7,
        "grossMarginDH": 11.6
      },
      {
        "name": "OULMÈS EAU GAZEUSE 33CL / 50CL",
        "image": "images/eau-oulmes.webp",
        "prepTime": 1,
        "tech": [
          "Bouteille Oulmès 33/50cl : 1 p",
          "Tranche de citron : 1 tr"
        ],
        "price": "16 DH",
        "cost": 1.5,
        "sellPrice": 16,
        "foodCost": 9.4,
        "margin": 90.6,
        "grossMarginDH": 14.5
      },
      {
        "name": "OULMÈS EAU GAZEUSE 75CL",
        "image": "images/eau-oulmes75cl.webp",
        "prepTime": 1,
        "tech": [
          "Bouteille Oulmès 75cl : 1 p",
          "Tranches de citron : 2 tr"
        ],
        "price": "26 DH",
        "cost": 13.3,
        "sellPrice": 26,
        "foodCost": 51.2,
        "margin": 48.8,
        "grossMarginDH": 12.7
      }
    ]
  },
  {
    "category": "PETIT DÉJEUNER",
    "key": "pdj",
    "color": "#ef476f",
    "items": [
      {
        "name": "COMPAGNARD",
        "image": "images/petit-dej_compagnard.jpeg",
        "prepTime": 15,
        "tech": [
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
        ],
        "price": "52 DH",
        "cost": 20.17,
        "sellPrice": 52,
        "foodCost": 38.8,
        "margin": 61.2,
        "grossMarginDH": 31.83
      },
      {
        "name": "PETIT DÉJEUNER AMÉRICAIN",
        "image": "images/petit-dej_americain.jpeg",
        "prepTime": 15,
        "tech": [
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
        ],
        "price": "68 DH",
        "cost": 21.49,
        "sellPrice": 68,
        "foodCost": 31.6,
        "margin": 68.4,
        "grossMarginDH": 46.51
      },
      {
        "name": "BRUNCH GREYCORNER",
        "image": "images/petit-dej-gc.jpg",
        "prepTime": 15,
        "tech": [
          "Saucisses : 2 p",
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
        ],
        "price": "85 DH",
        "cost": 39.92,
        "sellPrice": 85,
        "foodCost": 47,
        "margin": 53,
        "grossMarginDH": 45.08
      },
      {
        "name": "BRUNCH DUO",
        "image": "images/petit-dej-duo.jpg",
        "prepTime": 20,
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
        ],
        "price": "144 DH",
        "cost": 48.33,
        "sellPrice": 144,
        "foodCost": 33.6,
        "margin": 66.4,
        "grossMarginDH": 95.67
      },
      {
        "name": "BELDI",
        "image": "images/petit-dej-beldi.jpg",
        "prepTime": 10,
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
        ],
        "price": "45 DH",
        "cost": 14.43,
        "sellPrice": 45,
        "foodCost": 32.1,
        "margin": 67.9,
        "grossMarginDH": 30.57
      },
      {
        "name": "HOLLANDAIS",
        "image": "images/petit-dej-hollandais.jpg",
        "prepTime": 10,
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
        ],
        "price": "52 DH",
        "cost": 16.42,
        "sellPrice": 52,
        "foodCost": 31.6,
        "margin": 68.4,
        "grossMarginDH": 35.58
      },
      {
        "name": "OMELETTE VÉGÉTARIENNE",
        "image": "images/petit-dej-veg.jpg",
        "prepTime": 12,
        "tech": [
          "Œufs : 3 p",
          "Légumes : 120 g",
          "Mesclun : 40 g",
          "Jus d'orange : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "52 DH",
        "cost": 10.29,
        "sellPrice": 52,
        "foodCost": 19.8,
        "margin": 80.2,
        "grossMarginDH": 41.71
      },
      {
        "name": "BERBÈRE",
        "image": "images/petit-dej-berbere.jpg",
        "prepTime": 10,
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
        ],
        "price": "54 DH",
        "cost": 13.42,
        "sellPrice": 54,
        "foodCost": 24.9,
        "margin": 75.1,
        "grossMarginDH": 40.58
      },
      {
        "name": "CROQUE",
        "image": "images/petit-dej-croque.jpg",
        "prepTime": 12,
        "tech": [
          "Croque maison : 1 p",
          "Mesclun : 40 g",
          "Jus d'orange : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "50 DH",
        "cost": 11.78,
        "sellPrice": 50,
        "foodCost": 23.6,
        "margin": 76.4,
        "grossMarginDH": 38.22
      },
      {
        "name": "FASSI",
        "image": "images/petit-dej-fassi.jpg",
        "prepTime": 12,
        "tech": [
          "Khli3 : 100 g",
          "Œufs au plat : 3 p",
          "Jus d'orange : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "55 DH",
        "cost": 19.61,
        "sellPrice": 55,
        "foodCost": 35.7,
        "margin": 64.3,
        "grossMarginDH": 35.39
      },
      {
        "name": "OMELETTE CONTINENTAL",
        "image": "images/petit-dej-cont.jpg",
        "prepTime": 12,
        "tech": [
          "Œufs : 3 p",
          "Charcuterie : 60 g",
          "Fromage : 40 g",
          "Mesclun : 40 g",
          "Jus d'orange : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "52 DH",
        "cost": 17.99,
        "sellPrice": 52,
        "foodCost": 34.6,
        "margin": 65.4,
        "grossMarginDH": 34.01
      },
      {
        "name": "OMELETTE FROMAGE",
        "image": "images/omelette-fromage.jpg",
        "prepTime": 10,
        "tech": [
          "Œufs : 3 p",
          "Fromage : 40 g",
          "Mesclun : 40 g",
          "Jus d'orange : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "52 DH",
        "cost": 12.89,
        "sellPrice": 52,
        "foodCost": 24.8,
        "margin": 75.2,
        "grossMarginDH": 39.11
      },
      {
        "name": "OMELETTE NATURE",
        "image": "images/omelette-nature.jpg",
        "prepTime": 10,
        "tech": [
          "Œufs : 3 p",
          "Mesclun : 40 g",
          "Jus d'orange : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "42 DH",
        "cost": 9.09,
        "sellPrice": 42,
        "foodCost": 21.6,
        "margin": 78.4,
        "grossMarginDH": 32.91
      },
      {
        "name": "OMELETTE DU CHEF",
        "image": "images/petit-dej-chef.jpg",
        "prepTime": 12,
        "tech": [
          "Œufs : 3 p",
          "Champignons : 40 g",
          "Épinards : 30 g",
          "Fromage : 30 g",
          "Mesclun : 40 g",
          "Jus d'orange : 200 ml",
          "Boisson chaude : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "58 DH",
        "cost": 12.79,
        "sellPrice": 58,
        "foodCost": 22.1,
        "margin": 77.9,
        "grossMarginDH": 45.21
      },
      {
        "name": "ESPAGNOL",
        "image": "images/petit-dej-espagnol.jpg",
        "prepTime": 15,
        "tech": [
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
        ],
        "price": "64 DH",
        "cost": 22.85,
        "sellPrice": 64,
        "foodCost": 35.7,
        "margin": 64.3,
        "grossMarginDH": 41.15
      },
      {
        "name": "MQUILA-MERGUEZ",
        "image": "images/petit-dej-mquila.jpg",
        "prepTime": 12,
        "tech": [
          "Merguez : 120 g",
          "Poivrons/oignons : 120 g",
          "Œufs : 2 p",
          "Jus : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "64 DH",
        "cost": 20.94,
        "sellPrice": 64,
        "foodCost": 32.7,
        "margin": 67.3,
        "grossMarginDH": 43.06
      },
      {
        "name": "MQUILA-FRUITS DE MER",
        "image": "images/petit-dej_mquilafruitdemer.jpeg",
        "prepTime": 12,
        "tech": [
          "crevettes : 100 g",
          "calamars : 100 g",
          "moules : 100 g",
          "Œufs : 2 p",
          "Jus : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "78 DH",
        "cost": 36.34,
        "sellPrice": 78,
        "foodCost": 46.6,
        "margin": 53.4,
        "grossMarginDH": 41.66
      },
      {
        "name": "NORVÉGIEN",
        "image": "images/petit-dej-norvegien.jpg",
        "prepTime": 10,
        "tech": [
          "Saumon : 60 g",
          "Avocat : 50 g",
          "Fromage : 30 g",
          "Pain céréales : 2 tr",
          "Jus : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "68 DH",
        "cost": 18.93,
        "sellPrice": 68,
        "foodCost": 27.8,
        "margin": 72.2,
        "grossMarginDH": 49.07
      },
      {
        "name": "LIGHT",
        "image": "images/petit-dej-light.jpg",
        "prepTime": 7,
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
        ],
        "price": "42 DH",
        "cost": 11.57,
        "sellPrice": 42,
        "foodCost": 27.5,
        "margin": 72.5,
        "grossMarginDH": 30.43
      },
      {
        "name": "EXPRESS",
        "image": "images/petit-dej-express.jpg",
        "prepTime": 5,
        "tech": [
          "Viennoiseries : 4 p",
          "Jus : 200 ml",
          "Boisson chaude : 1 p",
          "Dessert : 1 p",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "44 DH",
        "cost": 13.8,
        "sellPrice": 44,
        "foodCost": 31.4,
        "margin": 68.6,
        "grossMarginDH": 30.2
      },
      {
        "name": "MENU ENFANT (PDJ)",
        "image": "images/menu-enfant-pdj.jpg",
        "prepTime": 8,
        "tech": [
          "Crêpe/Gaufre/Pancake : 1 p",
          "Corn flakes : 1 bol",
          "Lait chocolat : 200 ml"
        ],
        "price": "40 DH",
        "cost": 4.85,
        "sellPrice": 40,
        "foodCost": 12.1,
        "margin": 87.9,
        "grossMarginDH": 35.15
      }
    ]
  },
  {
    "category": "ENTRÉES FROIDES",
    "key": "ef",
    "color": "#22a699",
    "items": [
      {
        "name": "Salade Veggie",
        "images": "images/entree-veggi.jpg",
        "prepTime": 8,
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
          "Thon : 50 g",
          "Sauce Vinaigrette : 200 g",
          "Maïs : 30 g",
          "Poivron : 50 g"
        ],
        "price": "48 DH",
        "cost": 16.49,
        "sellPrice": 48,
        "foodCost": 34.4,
        "margin": 65.6,
        "grossMarginDH": 31.51
      },
      {
        "name": "Salade Russe",
        "images": "images/entree-russe.jpg",
        "prepTime": 6,
        "tech": [
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
        ],
        "price": "54 DH",
        "cost": 10.33,
        "sellPrice": 54,
        "foodCost": 19.1,
        "margin": 80.9,
        "grossMarginDH": 43.67
      },
      {
        "name": "Salade César",
        "images": "images/entree-caesar.jpg,images/entree-caesar3.jpg",
        "prepTime": 8,
        "tech": [
          "Salade Romaine : 180 g",
          "Laitue : 100 g",
          "Poulet : 130 g",
          "Croûtons : 30 g",
          "Tomate Cerise : 60 g",
          "Sauce César : 70 g",
          "Parmesan : 30 g"
        ],
        "price": "65 DH",
        "cost": 18.65,
        "sellPrice": 65,
        "foodCost": 28.7,
        "margin": 71.3,
        "grossMarginDH": 46.35
      },
      {
        "name": "Salade Quinoa",
        "images": "images/entree-quinoa.jpg",
        "prepTime": 7,
        "tech": [
          "Quinoa : 140 g",
          "Gambas Pané : 60 g",
          "Gambas Poché : 80 g",
          "Fruits : 70 g",
          "Feta : 20 g",
          "Kiwi : 120 g",
          "Vinaigrette : 20 g",
          "Miel : 30 g",
          "Framboise : 17 g"
        ],
        "price": "68 DH",
        "cost": 39.61,
        "sellPrice": 68,
        "foodCost": 58.3,
        "margin": 41.8,
        "grossMarginDH": 28.39
      },
      {
        "name": "Salade Terre & Mer",
        "images": "images/entree-terremer.jpg",
        "prepTime": 8,
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
        ],
        "price": "78 DH",
        "cost": 31.68,
        "sellPrice": 78,
        "foodCost": 40.6,
        "margin": 59.4,
        "grossMarginDH": 46.32
      },
      {
        "name": "TARTARE SAUMON",
        "images": "images/entree-tartare.jpeg",
        "prepTime": 7,
        "tech": [
          "saumon frais : 90 g",
          "SAUMON FUMEE : 25 g",
          "Avocat : 300 g",
          "SAUCE TARTARE : 24 g"
        ],
        "price": "88 DH",
        "cost": 21.67,
        "sellPrice": 88,
        "foodCost": 24.6,
        "margin": 75.4,
        "grossMarginDH": 66.33
      }
    ]
  },
  {
    "category": "ENTRÉES CHAUDES",
    "key": "ec",
    "color": "#ffb703",
    "items": [
      {
        "name": "BOULETTE DE POULET AU FROMAGE",
        "image": "images/entree-boulette-poulet.webp",
        "prepTime": 10,
        "tech": [
          "Poulet : 200 g",
          "Farine : 100 g",
          "Chapelure : 50 g",
          "Edam : 25 g"
        ],
        "price": "52 DH",
        "cost": 18.25,
        "sellPrice": 52,
        "foodCost": 35.1,
        "margin": 64.9,
        "grossMarginDH": 33.75
      },
      {
        "name": "CROUSTILLON GAMBAS",
        "images": "images/entree-croustillon.jpg,images/entree-croustillon2.jpg,images/entree-croustillon3.jpg",
        "prepTime": 12,
        "tech": [
          "Gambas chair pure : 100 g",
          "Chapelure : 30 g",
          "Purée : 200 g",
          "Radis : 15 g",
          "Parmesan : 14 g",
          "Crème fraîche : 50 g",
          "Bouteille Eau Minérale 33cl : 1 p"
        ],
        "price": "68 DH",
        "cost": 30.65,
        "sellPrice": 68,
        "foodCost": 45.1,
        "margin": 54.9,
        "grossMarginDH": 37.35
      },
      {
        "name": "PIL PIL ESPAGNOL",
        "images": "images/entree-pilpil.jpg,images/entree-pilpil2.jpg",
        "prepTime": 14,
        "tech": [
          "Gambas chair pure : 100 g",
          "Tomate cerise : 60 g",
          "Pesto : 22 g",
          "Huile d’olive : 30 g",
          "Oignon : 60 g",
          "Ail : 10 g",
          "Sauce tomate : 120 g"
        ],
        "price": "68 DH",
        "cost": 25.02,
        "sellPrice": 68,
        "foodCost": 36.8,
        "margin": 63.2,
        "grossMarginDH": 42.98
      }
    ]
  },
  {
    "category": "PLATS",
    "key": "pl",
    "color": "#64b5f6",
    "items": [
      {
        "name": "BROCHETTES DE POULET",
        "images": "images/plat-brochette.jpg,images/plat-brochette2.jpg,images/plat-brochette3.jpg",
        "prepTime": 18,
        "tech": [
          "Blanc de poulet : 200 g",
          "Sauce barbecue : 30 g",
          "Salade rouge : 50 g",
          "Accompagnements — 2 au choix",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "84 DH",
        "cost": 20.84,
        "sellPrice": 84,
        "foodCost": 24.8,
        "margin": 75.2,
        "grossMarginDH": 63.16
      },
      {
        "name": "EMINCE DE POULET",
        "images": "images/plat-emincepoulet.jpg,images/plat-emincepoulet2.jpg,images/plat-emincepoulet3.jpg",
        "prepTime": 15,
        "tech": [
          "Poulet : 160 g",
          "Champignons : 90 g",
          "Crème fraîche : 100 ml",
          "Demi-glace : 100 ml",
          "Légumes variés : 220 g",
          "Fokacha : 150 g",
          "Frites : 200 g",
          "Huile : 50 ml"
        ],
        "price": "88 DH",
        "cost": 30.53,
        "sellPrice": 88,
        "foodCost": 34.7,
        "margin": 65.3,
        "grossMarginDH": 57.47
      },
      {
        "name": "BALLOTINE DE POULET",
        "images": "images/plat-ballotine.jpg,images/plat-ballotine2.jpg,images/plat-ballotine3.jpg",
        "prepTime": 20,
        "tech": [
          "Poulet : 250 g",
          "Épinard : 40 g",
          "Crème fraîche : 70 ml",
          "Parmesan : 20 g",
          "Cheddar : 60 g",
          "Beurre : 30 g",
          "Légumes : 220 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "94 DH",
        "cost": 37.15,
        "sellPrice": 94,
        "foodCost": 39.5,
        "margin": 60.5,
        "grossMarginDH": 56.85
      },
      {
        "name": "SUPRÊME DE POULET",
        "images": "images/plat-supreme.webp",
        "prepTime": 18,
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
        ],
        "price": "98 DH",
        "cost": 36.01,
        "sellPrice": 98,
        "foodCost": 36.7,
        "margin": 63.3,
        "grossMarginDH": 61.99
      },
      {
        "name": "ESCALOPE A LA MILANAISE",
        "images": "images/plat-milanaise.jpg,images/plat-milanaise2.jpg,images/plat-milanaise3.jpg",
        "prepTime": 18,
        "tech": [
          "Poulet : 120 g",
          "Chapelure : 50 g",
          "Crème fraîche : 70 ml",
          "Moutarde : 10 g",
          "Parmesan : 30 g",
          "Légumes : 220 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "85 DH",
        "cost": 23.32,
        "sellPrice": 85,
        "foodCost": 27.4,
        "margin": 72.6,
        "grossMarginDH": 61.68
      },
      {
        "name": "EMINCE DE BŒUF",
        "images": "images/plat-eminceboeuf.jpg,images/plat-eminceboeuf2.jpg,images/plat-eminceboeuf3.jpg",
        "prepTime": 16,
        "tech": [
          "FILET DE Bœuf : 150 g",
          "Champignons : 80 g",
          "Crème fraîche : 70 ml",
          "Demi-glace : 60 ml",
          "Légumes : 220 g",
          "Fokacha : 150 g",
          "Frites : 200 g",
          "Huile : 60 ml"
        ],
        "price": "103 DH",
        "cost": 39.74,
        "sellPrice": 103,
        "foodCost": 38.6,
        "margin": 61.4,
        "grossMarginDH": 63.26
      },
      {
        "name": "FILET DE BŒUF",
        "images": "images/plat-filet.jpg,images/plat-filet2.jpg,images/plat-filet3.jpg",
        "prepTime": 15,
        "tech": [
          "Filet : 180 g",
          "Beurre : 40 g",
          "Poivre vert : 20 g",
          "Demi-glace : 70 ml",
          "Légumes : 220 g",
          "Fokacha : 150 g",
          "Frites : 200 g"
        ],
        "price": "135 DH",
        "cost": 43.85,
        "sellPrice": 135,
        "foodCost": 32.5,
        "margin": 67.5,
        "grossMarginDH": 91.15
      },
      {
        "name": "PAVÉ DE SAUMON",
        "images": "images/plat-saumon.jpg,images/plat-saumon2.jpg,images/plat-saumon3.jpg",
        "prepTime": 18,
        "tech": [
          "Saumon : 180 g",
          "Crevette : 80 g",
          "Crème fraîche : 70 ml",
          "Parmesan : 20 g",
          "Beurre : 40 g",
          "Légumes : 220 g",
          "Fokacha : 150 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "145 DH",
        "cost": 51,
        "sellPrice": 145,
        "foodCost": 35.2,
        "margin": 64.8,
        "grossMarginDH": 94
      },
      {
        "name": "MENU ENFANT (PLAT)",
        "images": "images/menu-enfant-plat.jpg,images/menu-enfant-plat2.jpg,images/menu-enfant-plat3.jpg",
        "prepTime": 10,
        "tech": [
          "Pasta nature ou Mini pizza + boisson",
          "OU Burger / nuggets + frites + boisson"
        ],
        "price": "58 DH",
        "cost": 3.65,
        "sellPrice": 58,
        "foodCost": 6.3,
        "margin": 93.7,
        "grossMarginDH": 54.35
      },
      {
        "name": "ROULADE DE BŒUF VH",
        "image": "images/plat-rouladeboeuf.webp",
        "prepTime": 16,
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
        ],
        "price": "120 DH",
        "cost": 40.88,
        "sellPrice": 120,
        "foodCost": 34.1,
        "margin": 65.9,
        "grossMarginDH": 79.12
      }
    ]
  },
  {
    "category": "BURGERS",
    "key": "bg",
    "color": "#b088f9",
    "items": [
      {
        "name": "CHICKEN BURGER",
        "image": "images/burger-cheese.jpg",
        "prepTime": 18,
        "tech": [
          "poulet : 150 g",
          "Sauce blanche : 40 g",
          "Sauce pesto : 20 g",
          "Cheddar : 20 g",
          "Tomate/Laitue : 30 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "50 DH",
        "cost": 19.33,
        "sellPrice": 50,
        "foodCost": 38.7,
        "margin": 61.3,
        "grossMarginDH": 30.67
      },
      {
        "name": "CHEESE BURGER",
        "image": "images/burger-cheese.jpg",
        "prepTime": 15,
        "tech": [
          "Viande Hachée : 100 g",
          "Cheddar : 20 g",
          "Tomate : 30 g",
          "Laitue : 20 g",
          "Oignon+Cornichon : 45 ml",
          "Sauce Bigy : 30 g",
          "Frites + Sauce : 200 g",
          "Pain : 1 p"
        ],
        "price": "54 DH",
        "cost": 20.75,
        "sellPrice": 54,
        "foodCost": 38.4,
        "margin": 61.6,
        "grossMarginDH": 33.25
      },
      {
        "name": "AVOCADO FORESTIER",
        "image": "images/burger-avocado.jpg",
        "prepTime": 15,
        "tech": [
          "Poulet : 120 g",
          "Avocat : 50 g",
          "Tomate/Laitue : 30 g",
          "Œuf : 1 p",
          "Chapelure : 50 g",
          "Cheddar : 20 g",
          "Sauce Bigy : 30 g",
          "Frites+Sauce : 200 g",
          "Pain : 1 p"
        ],
        "price": "54 DH",
        "cost": 25.42,
        "sellPrice": 54,
        "foodCost": 47.1,
        "margin": 52.9,
        "grossMarginDH": 28.58
      },
      {
        "name": "EGG ET CHEESEBURGER",
        "image": "images/burger-eggcheese.jpg",
        "prepTime": 16,
        "tech": [
          "Viande : 100 g",
          "Œuf : 1 p",
          "Champignon : 30 g",
          "Cheddar : 20 g",
          "Tomate/Laitue : 30 g",
          "Sauce Bigy : 30 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "56 DH",
        "cost": 24.37,
        "sellPrice": 56,
        "foodCost": 43.5,
        "margin": 56.5,
        "grossMarginDH": 31.63
      },
      {
        "name": "BIG BURGER",
        "image": "images/burger-big.jpg",
        "prepTime": 18,
        "tech": [
          "Viande : 2×100 g",
          "Cheddar : 20 g",
          "Tomate/Laitue : 30 g",
          "Sauce du chef : 30 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "68 DH",
        "cost": 18.32,
        "sellPrice": 68,
        "foodCost": 26.9,
        "margin": 73.1,
        "grossMarginDH": 49.68
      },
      {
        "name": "BURGER ROYAL",
        "image": "images/burger-royal.jpg",
        "prepTime": 20,
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
        ],
        "price": "70 DH",
        "cost": 31.63,
        "sellPrice": 70,
        "foodCost": 45.2,
        "margin": 54.8,
        "grossMarginDH": 38.37
      }
    ]
  },
  {
    "category": "WRAPS",
    "key": "wr",
    "color": "#06b6d4",
    "items": [
      {
        "name": "WRAP POULET",
        "image": "images/Wrap-poulet.jpg",
        "prepTime": 12,
        "tech": [
          "Poulet : 120 g",
          "Œuf : 1 p",
          "Frites + sauce : 200 g",
          "Chapelure : 50 g",
          "Cheddar : 25 g",
          "Pain : 1 p",
          "Tomate fraîche : 30 g",
          "Sauce burger : 60 ml"
        ],
        "price": "58 DH",
        "cost": 25.39,
        "sellPrice": 58,
        "foodCost": 43.8,
        "margin": 56.2,
        "grossMarginDH": 32.61
      },
      {
        "name": "WRAP VIANDE HACHÉE",
        "image": "images/Wrap-viande-hachee.jpg",
        "prepTime": 12,
        "tech": [
          "Viande hachée : 100 g",
          "Œuf : 1 p",
          "Frites + sauce : 200 g",
          "Cheddar : 25 g",
          "Pain : 1 p",
          "Tomate fraîche : 30 g",
          "Sauce burger : 60 ml"
        ],
        "price": "62 DH",
        "cost": 26.59,
        "sellPrice": 62,
        "foodCost": 42.9,
        "margin": 57.1,
        "grossMarginDH": 35.41
      },
      {
        "name": "WRAP GOURMAND",
        "image": "images/Wrap-gourmand.jpg",
        "prepTime": 15,
        "tech": [
          "Poulet : 120 g",
          "Charcuterie : 40 g",
          "Œuf : 1 p",
          "Chapelure : 50 g",
          "Cheddar : 25 g",
          "Frites + sauce : 200 g",
          "Pain : 1 p",
          "Tomate fraîche : 30 g",
          "Sauce burger : 60 ml"
        ],
        "price": "64 DH",
        "cost": 28.79,
        "sellPrice": 64,
        "foodCost": 45,
        "margin": 55,
        "grossMarginDH": 35.21
      }
    ]
  },
  {
    "category": "PANINIS",
    "key": "pa",
    "color": "#f97316",
    "items": [
      {
        "name": "CHARCUTERIE",
        "image": "images/panini-charcuterie.jpg",
        "prepTime": 8,
        "tech": [
          "Charcuterie : 120 g",
          "Mozzarella : 60 g",
          "Frites + sauce : 200 g",
          "Pain : 1 p",
          "Sauce biggy : 30 g"
        ],
        "price": "40 DH",
        "cost": 21.94,
        "sellPrice": 40,
        "foodCost": 54.9,
        "margin": 45.1,
        "grossMarginDH": 18.06
      },
      {
        "name": "POULET",
        "image": "images/panini-poulet.jpg",
        "prepTime": 8,
        "tech": [
          "Poulet : 70 g",
          "Mozzarella : 60 g",
          "Frites + sauce : 200 g",
          "Pain : 1 p",
          "Sauce biggy : 30 g"
        ],
        "price": "44 DH",
        "cost": 16.29,
        "sellPrice": 44,
        "foodCost": 37,
        "margin": 63,
        "grossMarginDH": 27.71
      },
      {
        "name": "VIANDE HACHÉE",
        "image": "images/panini-hache.jpg",
        "prepTime": 8,
        "tech": [
          "Viande : 100 g",
          "Mozzarella : 60 g",
          "Frites + sauce : 200 g",
          "Pain : 1 p",
          "Sauce biggy : 30 g"
        ],
        "price": "54 DH",
        "cost": 21.74,
        "sellPrice": 54,
        "foodCost": 40.3,
        "margin": 59.7,
        "grossMarginDH": 32.26
      },
      {
        "name": "GOURMAND",
        "image": "images/panini-mixte.jpg",
        "prepTime": 10,
        "tech": [
          "Viande : 50 g",
          "Poulet : 50 g",
          "Charcuterie : 50 g",
          "Mozzarella : 60 g",
          "Frites + sauce : 200 g",
          "Pain : 1 p",
          "Sauce biggy : 30 g"
        ],
        "price": "64 DH",
        "cost": 24.24,
        "sellPrice": 64,
        "foodCost": 37.9,
        "margin": 62.1,
        "grossMarginDH": 39.76
      },
      {
        "name": "FRUITS DE MER",
        "image": "images/panini-fruitsmer.jpg",
        "prepTime": 10,
        "tech": [
          "Crevettes : 100 g",
          "Calamar : 50 g",
          "Pesto : 20 g",
          "Mozzarella : 60 g",
          "Frites + sauce : 200 g",
          "Pain : 1 p",
          "Sauce biggy : 30 g"
        ],
        "price": "64 DH",
        "cost": 30.39,
        "sellPrice": 64,
        "foodCost": 47.5,
        "margin": 52.5,
        "grossMarginDH": 33.61
      },
      {
        "name": "SAUMON",
        "image": "images/panini-saumon.jpg",
        "prepTime": 10,
        "tech": [
          "Saumon : 90 g",
          "Pesto : 20 g",
          "Mozzarella : 60 g",
          "Frites + sauce : 200 g",
          "Pain : 1 p",
          "Sauce biggy : 30 g"
        ],
        "price": "64 DH",
        "cost": 23.44,
        "sellPrice": 64,
        "foodCost": 36.6,
        "margin": 63.4,
        "grossMarginDH": 40.56
      }
    ]
  },
  {
    "category": "SANDWICHS",
    "key": "sw",
    "color": "#10b981",
    "items": [
      {
        "name": "FRUITS DE MER",
        "image": "images/sand-fruitsmer.jpg",
        "prepTime": 14,
        "tech": [
          "Crevette : 125 g",
          "Calamar : 70 g",
          "Sauce Biggy : 40 g",
          "Cheddar : 20 g",
          "Crème fraîche : 60 ml",
          "Sauce fromagère : 20 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "65 DH",
        "cost": 33.58,
        "sellPrice": 65,
        "foodCost": 51.7,
        "margin": 48.3,
        "grossMarginDH": 31.42
      },
      {
        "name": "THON",
        "image": "images/sand-thon.jpg",
        "prepTime": 8,
        "tech": [
          "Thon : 120 g",
          "Tomate : 30 g",
          "Sauce burger : 40 ml",
          "Cheddar : 20 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "48 DH",
        "cost": 15.49,
        "sellPrice": 48,
        "foodCost": 32.3,
        "margin": 67.7,
        "grossMarginDH": 32.51
      },
      {
        "name": "POULET",
        "image": "images/sand-poulet.jpg",
        "prepTime": 10,
        "tech": [
          "Poulet : 120 g",
          "Tomate : 30 g",
          "Sauce burger : 40 ml",
          "Cheddar : 20 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "48 DH",
        "cost": 16.3,
        "sellPrice": 48,
        "foodCost": 34,
        "margin": 66,
        "grossMarginDH": 31.7
      },
      {
        "name": "POULET CRUNCHY",
        "image": "images/sand-crunchy.jpg",
        "prepTime": 12,
        "tech": [
          "Poulet : 120 g",
          "Œuf : 1 p",
          "Chapelure : 50 g",
          "Tomate : 30 g",
          "Cheddar : 20 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "58 DH",
        "cost": 21.18,
        "sellPrice": 58,
        "foodCost": 36.5,
        "margin": 63.5,
        "grossMarginDH": 36.82
      },
      {
        "name": "CHEESE STEAK",
        "image": "images/sand-cheesesteak.jpg",
        "prepTime": 12,
        "tech": [
          "Filet : 70 g",
          "Demi-glace : 40 ml",
          "Champignon : 50 g",
          "Cheddar : 20 g",
          "Crème fraîche : 40 ml",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "65 DH",
        "cost": 22.45,
        "sellPrice": 65,
        "foodCost": 34.5,
        "margin": 65.5,
        "grossMarginDH": 42.55
      },
      {
        "name": "VIANDE HACHÉE",
        "image": "images/sand-hache.jpg",
        "prepTime": 10,
        "tech": [
          "Viande : 100 g",
          "Tomate : 30 g",
          "Sauce spéciale : 30 g",
          "Cheddar : 20 g",
          "Frites : 200 g",
          "Pain : 1 p"
        ],
        "price": "54 DH",
        "cost": 18.22,
        "sellPrice": 54,
        "foodCost": 33.7,
        "margin": 66.3,
        "grossMarginDH": 35.78
      }
    ]
  },
  {
    "category": "PIZZA",
    "key": "pz",
    "color": "#eab308",
    "items": [
      {
        "name": "MARGARITA",
        "image": "images/pizza-margherita.jpg",
        "prepTime": 14,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Sauce tomate : 100 g",
          "Olives noires : 13 g"
        ],
        "price": "52 DH",
        "cost": 12.65,
        "sellPrice": 52,
        "foodCost": 24.3,
        "margin": 75.7,
        "grossMarginDH": 39.35
      },
      {
        "name": "THON",
        "image": "images/pizza-thon.jpg",
        "prepTime": 15,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Sauce tomate : 100 g",
          "Thon : 100 g",
          "Oignons : 40 g",
          "Olives"
        ],
        "price": "65 DH",
        "cost": 20.19,
        "sellPrice": 65,
        "foodCost": 31.1,
        "margin": 68.9,
        "grossMarginDH": 44.81
      },
      {
        "name": "VÉGÉTARIENNE",
        "image": "images/pizza-veggie.jpg",
        "prepTime": 15,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Sauce tomate : 100 g",
          "Champignons : 60 g",
          "Légumes : 220 g"
        ],
        "price": "62 DH",
        "cost": 16.43,
        "sellPrice": 62,
        "foodCost": 26.5,
        "margin": 73.5,
        "grossMarginDH": 45.57
      },
      {
        "name": "REGINA",
        "image": "images/pizza-regina.jpg",
        "prepTime": 16,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Dinde fumée : 100 g",
          "Champignons : 60 g",
          "Sauce blanche : 100 g"
        ],
        "price": "68 DH",
        "cost": 18.35,
        "sellPrice": 68,
        "foodCost": 27,
        "margin": 73,
        "grossMarginDH": 49.65
      },
      {
        "name": "5 FROMAGES",
        "image": "images/pizza-5fromages.jpg",
        "prepTime": 16,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 50 g",
          "Brie : 50 g",
          "Bleu : 40 g",
          "Sauce blanche : 100 g",
          "Parmesan : 20 g",
          "Fromage rouge : 40 g"
        ],
        "price": "78 DH",
        "cost": 25.85,
        "sellPrice": 78,
        "foodCost": 33.1,
        "margin": 66.9,
        "grossMarginDH": 52.15
      },
      {
        "name": "VIANDE HACHÉE",
        "image": "images/pizza-hache.jpg",
        "prepTime": 16,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Sauce tomate : 100 g",
          "Viande : 100 g",
          "Tomate cerise : 40 g"
        ],
        "price": "78 DH",
        "cost": 22.73,
        "sellPrice": 78,
        "foodCost": 29.1,
        "margin": 70.9,
        "grossMarginDH": 55.27
      },
      {
        "name": "PEPPERONI",
        "image": "images/pizza-pepperoni.jpg",
        "prepTime": 15,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Sauce tomate : 100 g",
          "Pepperoni : 40 g"
        ],
        "price": "74 DH",
        "cost": 16.93,
        "sellPrice": 74,
        "foodCost": 22.9,
        "margin": 77.1,
        "grossMarginDH": 57.07
      },
      {
        "name": "POULET SAUCE BLANCHE",
        "image": "images/pizza-pouletblanche.jpg",
        "prepTime": 16,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Poulet : 150 g",
          "Champignon : 60 g",
          "Sauce blanche : 100 g"
        ],
        "price": "78 DH",
        "cost": 26.1,
        "sellPrice": 78,
        "foodCost": 33.5,
        "margin": 66.5,
        "grossMarginDH": 51.9
      },
      {
        "name": "4 SAISONS",
        "image": "images/pizza-4saisons.jpg",
        "prepTime": 18,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Calamar : 40 g",
          "Crevette : 40 g",
          "Viande : 40 g",
          "Poulet : 40 g",
          "Légumes : 60 g",
          "Champignon : 60 g"
        ],
        "price": "88 DH",
        "cost": 29.55,
        "sellPrice": 88,
        "foodCost": 33.6,
        "margin": 66.4,
        "grossMarginDH": 58.45
      },
      {
        "name": "MOITIÉ MOITIÉ",
        "image": "images/pizza-moitiemoitie.jpg",
        "prepTime": 18,
        "tech": [
          "Pâte : 330 g",
          "Garnitures 2 moitiés (hors fruits de mer/saumon)"
        ],
        "price": "88 DH",
        "cost": 9,
        "sellPrice": 88,
        "foodCost": 10.2,
        "margin": 89.8,
        "grossMarginDH": 79
      },
      {
        "name": "BURRATA",
        "image": "images/pizza-burrata.jpg",
        "prepTime": 15,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Sauce tomate : 100 g",
          "Burrata : 1 P",
          "Noix : 30 g",
          "Tomate cerise : 20 g"
        ],
        "price": "110 DH",
        "cost": 22.28,
        "sellPrice": 110,
        "foodCost": 20.3,
        "margin": 79.7,
        "grossMarginDH": 87.72
      },
      {
        "name": "FRUITS DE MER",
        "image": "images/pizza-fruitsmer.jpg",
        "prepTime": 18,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Crevette : 110 g",
          "Calamar : 70 g",
          "Moules : 40 g",
          "Champignon : 60 g",
          "Sauce blanche : 100 g"
        ],
        "price": "88 DH",
        "cost": 39.5,
        "sellPrice": 88,
        "foodCost": 44.9,
        "margin": 55.1,
        "grossMarginDH": 48.5
      },
      {
        "name": "SAUMON",
        "image": "images/pizza-saumon.jpg",
        "prepTime": 18,
        "tech": [
          "Pâte : 330 g",
          "Mozzarella : 150 g",
          "Saumon : 90 g",
          "Sauce blanche : 100 g",
          "Câpres : 15 g"
        ],
        "price": "94 DH",
        "cost": 25.5,
        "sellPrice": 94,
        "foodCost": 27.1,
        "margin": 72.9,
        "grossMarginDH": 68.5
      }
    ]
  },
  {
    "category": "PÂTES",
    "key": "pae",
    "color": "#fb7185",
    "items": [
      {
        "name": "LASAGNE POULET",
        "image": "images/lasagne-poulet.jpeg",
        "prepTime": 15,
        "tech": [
          "Pâtes : 60 g",
          "poulet : 80 g",
          "Parmesan : 15 g",
          "Huile : 60 g",
          "champignon : 50 g",
          "Pesto : 70 g",
          "Sauce blanche : 100 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "60 DH",
        "cost": 17.79,
        "sellPrice": 60,
        "foodCost": 29.7,
        "margin": 70.4,
        "grossMarginDH": 42.21
      },
      {
        "name": "LASAGNE BOLOGNAISE",
        "image": "images/lasagne_bolognaise.jpeg",
        "prepTime": 15,
        "tech": [
          "Pâtes : 60 g",
          "Viande : 100 g",
          "Parmesan : 15 g",
          "Huile : 60 g",
          "Tomate cerise : 50 g",
          "Pesto : 70 g",
          "Sauce tomate : 80 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "72 DH",
        "cost": 19.29,
        "sellPrice": 72,
        "foodCost": 26.8,
        "margin": 73.2,
        "grossMarginDH": 52.71
      },
      {
        "name": "LASAGNE FRUITS DE MER",
        "image": "images/lasagne-fruitdemer.jpeg",
        "prepTime": 15,
        "tech": [
          "Pâtes : 60 g",
          "crevette : 140 g",
          "Parmesan : 15 g",
          "Huile : 60 g",
          "CALAMAR : 100 g",
          "Pesto : 70 g",
          "Sauce blanche : 100 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "78 DH",
        "cost": 38.54,
        "sellPrice": 78,
        "foodCost": 49.4,
        "margin": 50.6,
        "grossMarginDH": 39.46
      },
      {
        "name": "VÉGÉTARIEN",
        "image": "images/pasta-veg.jpg",
        "prepTime": 12,
        "tech": [
          "Pâtes : 150 g",
          "Sauce pesto : 70 g",
          "Parmesan : 60 g",
          "Huile d'olive : 60 g",
          "Crème : 100 g",
          "Oignon : 60 g",
          "Tomate cerise : 50 g",
          "Légumes : 150 g"
        ],
        "price": "60 DH",
        "cost": 21.4,
        "sellPrice": 60,
        "foodCost": 35.7,
        "margin": 64.3,
        "grossMarginDH": 38.6
      },
      {
        "name": "CARBONARA",
        "image": "images/pasta-carbonara.jpg",
        "prepTime": 14,
        "tech": [
          "Pâtes : 150 g",
          "Jambon de dinde : 80 g",
          "Parmesan : 60 g",
          "Huile : 60 g",
          "Crème : 100 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "65 DH",
        "cost": 22.86,
        "sellPrice": 65,
        "foodCost": 35.2,
        "margin": 64.8,
        "grossMarginDH": 42.14
      },
      {
        "name": "5 FROMAGES",
        "image": "images/pasta-5fromages.jpg",
        "prepTime": 14,
        "tech": [
          "Pâtes : 150 g",
          "Brie : 25 g",
          "Parmesan : 25 g",
          "Bleu : 20 g",
          "Mozzarella : 30 g",
          "Edam : 20 g",
          "Huile : 60 g",
          "Crème : 100 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "70 DH",
        "cost": 19.41,
        "sellPrice": 70,
        "foodCost": 27.7,
        "margin": 72.3,
        "grossMarginDH": 50.59
      },
      {
        "name": "RIGATONI RICOTTA",
        "image": "images/pasta-ricotta.jpg",
        "prepTime": 15,
        "tech": [
          "Pâtes : 150 g",
          "Ricotta : 40 g",
          "Parmesan : 60 g",
          "Huile : 60 g",
          "Crème : 100 g",
          "Pesto : 70 g",
          "Courgette : 100 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "68 DH",
        "cost": 21.61,
        "sellPrice": 68,
        "foodCost": 31.8,
        "margin": 68.2,
        "grossMarginDH": 46.39
      },
      {
        "name": "BOLOGNAISE",
        "image": "images/pasta-bolognaise.jpg",
        "prepTime": 15,
        "tech": [
          "Pâtes : 150 g",
          "Viande : 100 g",
          "Parmesan : 60 g",
          "Huile : 60 g",
          "Tomate cerise : 50 g",
          "Pesto : 70 g",
          "Sauce tomate : 80 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "75 DH",
        "cost": 27.66,
        "sellPrice": 75,
        "foodCost": 36.9,
        "margin": 63.1,
        "grossMarginDH": 47.34
      },
      {
        "name": "POULET CHAMPIGNON / ÉPINARD",
        "image": "images/pasta-poulet.jpg",
        "prepTime": 16,
        "tech": [
          "Pâtes : 150 g",
          "Poulet : 80 g",
          "Parmesan : 60 g",
          "Huile : 60 g",
          "Crème : 100 g",
          "Pesto : 70 g",
          "Épinard : 30 g",
          "Champignon : 70 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "75 DH",
        "cost": 27.31,
        "sellPrice": 75,
        "foodCost": 36.4,
        "margin": 63.6,
        "grossMarginDH": 47.69
      },
      {
        "name": "FRUITS DE MER",
        "image": "images/pasta-fruitsmer.jpg",
        "prepTime": 18,
        "tech": [
          "Pâtes : 150 g",
          "Crevettes : 105 g",
          "Calamar : 60 g",
          "Moules : 15 g",
          "Parmesan : 60 g",
          "Huile : 60 g",
          "Crème : 100 g",
          "Pesto : 70 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "88 DH",
        "cost": 39.38,
        "sellPrice": 88,
        "foodCost": 44.8,
        "margin": 55.3,
        "grossMarginDH": 48.62
      },
      {
        "name": "SAUMON",
        "image": "images/pasta-saumon.jpg",
        "prepTime": 18,
        "tech": [
          "Pâtes : 150 g",
          "Saumon : 90 g",
          "Parmesan : 60 g",
          "Huile : 60 g",
          "Crème : 100 g",
          "Pesto : 70 g",
          "Oignon/Ail : 70 g"
        ],
        "price": "98 DH",
        "cost": 30.01,
        "sellPrice": 98,
        "foodCost": 30.6,
        "margin": 69.4,
        "grossMarginDH": 67.99
      },
      {
        "name": "SPAGHETTIS NOIRS (suppl.)",
        "image": "images/pasta-saumon.jpg",
        "prepTime": 0,
        "tech": [
          "Supplément pâtes noires à l'encre de seiche"
        ],
        "price": "5 DH",
        "cost": 0.45,
        "sellPrice": 5,
        "foodCost": 9,
        "margin": 91,
        "grossMarginDH": 4.55
      }
    ]
  },
  {
    "category": "DESSERTS & PÂTISSERIES",
    "key": "dp",
    "color": "#ec4899",
    "items": [
      {
        "name": "SAN SEBASTIEN CHEESECAKE",
        "prepTime": 3,
        "tech": [
          "Cheesecake San Sebastian : 1 part (160 g)",
          "Coulis chocolat chaud : 30 g"
        ],
        "price": "45 DH",
        "cost": 15.02,
        "sellPrice": 45,
        "foodCost": 33.4,
        "margin": 66.6,
        "grossMarginDH": 29.98
      },
      {
        "name": "FONDANT AU CHOCOLAT",
        "prepTime": 8,
        "tech": [
          "Fondant chocolat cœur coulant : 1 p (120 g)",
          "Glace vanille artisanale : 1 boule (50 g)",
          "Sucre glace : 5 g"
        ],
        "price": "40 DH",
        "cost": 11.05,
        "sellPrice": 40,
        "foodCost": 27.6,
        "margin": 72.4,
        "grossMarginDH": 28.95
      },
      {
        "name": "CHEESECAKE CHOCOLAT",
        "prepTime": 3,
        "tech": [
          "Cheesecake chocolat : 1 part (150 g)",
          "Chantilly : 20 g"
        ],
        "price": "45 DH",
        "cost": 14.6,
        "sellPrice": 45,
        "foodCost": 32.4,
        "margin": 67.6,
        "grossMarginDH": 30.4
      },
      {
        "name": "BOULE DE GLACE",
        "prepTime": 2,
        "tech": [
          "Glace artisanale au choix : 1 boule (50 g)"
        ],
        "price": "16 DH",
        "cost": 3.2,
        "sellPrice": 16,
        "foodCost": 20,
        "margin": 80,
        "grossMarginDH": 12.8
      },
      {
        "name": "2 BOULES DE GLACE",
        "prepTime": 2,
        "tech": [
          "Glace artisanale au choix : 2 boules (100 g)",
          "Coulis & Chantilly : 20 g"
        ],
        "price": "30 DH",
        "cost": 7,
        "sellPrice": 30,
        "foodCost": 23.3,
        "margin": 76.7,
        "grossMarginDH": 23
      },
      {
        "name": "3 BOULES DE GLACE",
        "prepTime": 3,
        "tech": [
          "Glace artisanale au choix : 3 boules (150 g)",
          "Coulis, Chantilly & Gaufrette : 30 g"
        ],
        "price": "35 DH",
        "cost": 10.5,
        "sellPrice": 35,
        "foodCost": 30,
        "margin": 70,
        "grossMarginDH": 24.5
      }
    ]
  },
  {
    "category": "CRÊPES",
    "key": "cr",
    "color": "#f59e0b",
    "items": [
      {
        "name": "CRÊPE NUTELLA",
        "prepTime": 8,
        "tech": [
          "Pâte à crêpe : 1 p",
          "Nutella : 60 g",
          "Banane ou Amandes : 20 g"
        ],
        "price": "38 DH",
        "cost": 6.82,
        "sellPrice": 38,
        "foodCost": 17.9,
        "margin": 82.1,
        "grossMarginDH": 31.18
      },
      {
        "name": "CRÊPE KUNAFA PISTACHE",
        "prepTime": 10,
        "tech": [
          "Pâte à crêpe : 1 p",
          "Pâte de pistache : 40 g",
          "Kunafa croustillante : 30 g",
          "Pistaches concassées : 15 g"
        ],
        "price": "48 DH",
        "cost": 12.35,
        "sellPrice": 48,
        "foodCost": 25.7,
        "margin": 74.3,
        "grossMarginDH": 35.65
      },
      {
        "name": "CRÊPE FROMAGE",
        "prepTime": 8,
        "tech": [
          "Pâte à crêpe : 1 p",
          "Mozzarella : 50 g",
          "Fromage rouge : 30 g",
          "Fromage blanc : 20 g"
        ],
        "price": "45 DH",
        "cost": 8.1,
        "sellPrice": 45,
        "foodCost": 18,
        "margin": 82,
        "grossMarginDH": 36.9
      },
      {
        "name": "CRÊPE POULET CHAMPIGNON",
        "prepTime": 10,
        "tech": [
          "Pâte à crêpe : 1 p",
          "Blanc de poulet : 70 g",
          "Champignons : 40 g",
          "Mozzarella : 40 g",
          "Crème fraîche : 40 ml"
        ],
        "price": "48 DH",
        "cost": 11.15,
        "sellPrice": 48,
        "foodCost": 23.2,
        "margin": 76.8,
        "grossMarginDH": 36.85
      },
      {
        "name": "CRÊPE CHARCUTERIE",
        "prepTime": 8,
        "tech": [
          "Pâte à crêpe : 1 p",
          "Charcuterie de dinde : 60 g",
          "Mozzarella : 40 g",
          "Fromage : 20 g"
        ],
        "price": "45 DH",
        "cost": 11,
        "sellPrice": 45,
        "foodCost": 24.4,
        "margin": 75.6,
        "grossMarginDH": 34
      },
      {
        "name": "CRÊPE NORVÉGIENNE",
        "prepTime": 10,
        "tech": [
          "Pâte à crêpe : 1 p",
          "Saumon fumé : 60 g",
          "Crème fraîche : 40 ml",
          "Fromage : 30 g"
        ],
        "price": "58 DH",
        "cost": 22.65,
        "sellPrice": 58,
        "foodCost": 39.1,
        "margin": 60.9,
        "grossMarginDH": 35.35
      }
    ]
  },
  {
    "category": "SUPPLÉMENTS & EXTRAS",
    "key": "sup",
    "color": "#64748b",
    "items": [
      {
        "name": "SUPPLÉMENT FRITES",
        "prepTime": 5,
        "tech": [
          "Frites : 200 g",
          "Sauce : 30 g"
        ],
        "price": "15 DH",
        "cost": 4.34,
        "sellPrice": 15,
        "foodCost": 28.9,
        "margin": 71.1,
        "grossMarginDH": 10.66
      },
      {
        "name": "SUPPLÉMENT PURÉE",
        "prepTime": 3,
        "tech": [
          "Pomme de terre purée : 250 g",
          "Beurre : 15 g"
        ],
        "price": "18 DH",
        "cost": 5.58,
        "sellPrice": 18,
        "foodCost": 31,
        "margin": 69,
        "grossMarginDH": 12.42
      },
      {
        "name": "SUPPLÉMENT POTATOS",
        "prepTime": 5,
        "tech": [
          "Pomme de terre potatos : 200 g",
          "Sauce : 30 g"
        ],
        "price": "18 DH",
        "cost": 6.24,
        "sellPrice": 18,
        "foodCost": 34.7,
        "margin": 65.3,
        "grossMarginDH": 11.76
      },
      {
        "name": "SUPPLÉMENT MIEL",
        "prepTime": 1,
        "tech": [
          "Miel pur : 30 g"
        ],
        "price": "8 DH",
        "cost": 0.48,
        "sellPrice": 8,
        "foodCost": 6,
        "margin": 94,
        "grossMarginDH": 7.52
      },
      {
        "name": "SUPPLÉMENT JBEN",
        "prepTime": 1,
        "tech": [
          "Jben frais : 50 g"
        ],
        "price": "10 DH",
        "cost": 2,
        "sellPrice": 10,
        "foodCost": 20,
        "margin": 80,
        "grossMarginDH": 8
      },
      {
        "name": "SUPPLÉMENT ŒUFS",
        "prepTime": 4,
        "tech": [
          "Œufs frais : 2 p"
        ],
        "price": "10 DH",
        "cost": 2.54,
        "sellPrice": 10,
        "foodCost": 25.4,
        "margin": 74.6,
        "grossMarginDH": 7.46
      },
      {
        "name": "SUPPLÉMENT FROMAGE",
        "prepTime": 1,
        "tech": [
          "Fromage variété : 50 g"
        ],
        "price": "12 DH",
        "cost": 4.5,
        "sellPrice": 12,
        "foodCost": 37.5,
        "margin": 62.5,
        "grossMarginDH": 7.5
      },
      {
        "name": "PIZZA COMPOSÉE AU CHOIX",
        "prepTime": 15,
        "tech": [
          "Pâte à pizza : 330 g",
          "Mozzarella : 200 g",
          "Sauce tomate : 100 g",
          "Garniture composée : 150 g"
        ],
        "price": "85 DH",
        "cost": 17.13,
        "sellPrice": 85,
        "foodCost": 20.2,
        "margin": 79.8,
        "grossMarginDH": 67.87
      },
      {
        "name": "DIVERS CUISINE / FOOD",
        "prepTime": 5,
        "tech": [
          "Ingrédients cuisine divers : 1 portion"
        ],
        "price": "10 DH",
        "cost": 1,
        "sellPrice": 10,
        "foodCost": 10,
        "margin": 90,
        "grossMarginDH": 9
      },
      {
        "name": "DIVERS BAR / BOISSONS",
        "prepTime": 2,
        "tech": [
          "Ingrédients bar divers : 1 portion"
        ],
        "price": "10 DH",
        "cost": 1,
        "sellPrice": 10,
        "foodCost": 10,
        "margin": 90,
        "grossMarginDH": 9
      }
    ]
  },
  {
    "category": "A LA CARTE & BOULANGERIE",
    "key": "alc",
    "color": "#d97706",
    "items": [
      {
        "name": "PETIT BAGHRIR",
        "sellPrice": 5,
        "cost": 1.2,
        "margin": 76,
        "tech": [
          "Baghrir : 1 p"
        ],
        "foodCost": 24,
        "grossMarginDH": 3.8
      },
      {
        "name": "MSEMEN NATURE",
        "sellPrice": 6,
        "cost": 1.5,
        "margin": 75,
        "tech": [
          "Msemen : 1 p"
        ],
        "foodCost": 25,
        "grossMarginDH": 4.5
      },
      {
        "name": "VIENNOISERIE",
        "sellPrice": 6,
        "cost": 2,
        "margin": 66.7,
        "tech": [
          "Viennoiserie : 1 p"
        ],
        "foodCost": 33.3,
        "grossMarginDH": 4
      },
      {
        "name": "HARCHA NATURE",
        "sellPrice": 6,
        "cost": 1.2,
        "margin": 80,
        "tech": [
          "Harcha : 1 p"
        ],
        "foodCost": 20,
        "grossMarginDH": 4.8
      },
      {
        "name": "OMLETTE FROMAGE (A LA CARTE)",
        "sellPrice": 38,
        "cost": 7.97,
        "margin": 79,
        "tech": [
          "Œufs : 3 p",
          "Fromage : 40 g",
          "Mesclun : 30 g"
        ],
        "foodCost": 21,
        "grossMarginDH": 30.03
      },
      {
        "name": "OMLETTE NATURE (A LA CARTE)",
        "sellPrice": 32,
        "cost": 4.17,
        "margin": 87,
        "tech": [
          "Œufs : 3 p",
          "Mesclun : 30 g"
        ],
        "foodCost": 13,
        "grossMarginDH": 27.83
      }
    ]
  }
];

const BASE_RECIPES = [
  {
    "id": "plat_brochette_poulet",
    "name": "BROCHETTE DE POULET",
    "category": "PLATS",
    "ingredients": [
      "Poulet : 200 g",
      "Frites : 200 g",
      "Sauce : 30 g",
      "legumes : 500 g"
    ]
  },
  {
    "id": "plat_couscous_poulet",
    "name": "COUSCOUS POULET AVEC PETIT LAIT",
    "category": "AUTRE",
    "ingredients": [
      "Semoule couscous : 200 g",
      "Poulet : 200 g",
      "Légumes couscous : 250 g",
      "Petit lait (Lben) : 200 ml"
    ]
  },
  {
    "id": "sup_supplement_charcuterie",
    "name": "SUPPLÉMENT CHARCUTERIE",
    "category": "SUPPLÉMENTS",
    "ingredients": [
      "Charcuterie : 50 g"
    ]
  },
  {
    "id": "sal_composee_au_choix",
    "name": "SALADE COMPOSÉE AU CHOIX",
    "category": "SALADES",
    "ingredients": [
      "Salade mesclun : 100 g",
      "Garnitures composées : 150 g",
      "Sauce vinaigrette : 30 ml"
    ]
  },
  {
    "id": "ec_boulettes_poulet",
    "name": "BOULETTES DE POULET FR",
    "category": "ENTRÉES CHAUDES",
    "ingredients": [
      "Poulet haché : 200 g",
      "Sauce : 30 g",
      "FR EDAM: 40 g",
      "CHAPLURE: 50 g"
    ]
  },
  {
    "id": "alc_oeufs_beldi",
    "name": "OEUFS BELDI",
    "category": "A LA CARTE & BOULANGERIE",
    "ingredients": [
      "Œufs Beldi : 2 p",
      "Huile d’olive : 10 ml",
      "Sel & Poivre : 1 g"
    ]
  },
  {
    "id": "ec_croquettes_fromage",
    "name": "6 CROQUETTES FROMAGE",
    "category": "ENTRÉES CHAUDES",
    "ingredients": [
      "Croquettes de fromage : 6 p",
      "Sauce : 30 g",
      "Mesclun : 30 g"
    ]
  },
  {
    "id": "bc_cafe_noir_espresso",
    "name": "CAFÉ NOIR / ESPRESSO",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 10 g",
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
      "Café : 10 g",
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
      "Café : 10 g",
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
      "Café : 10 g",
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
      "Café : 10 g",
      "Lait chaud : 100 ml",
      "Mousse de lait : 50 ml",
      "Cacao en poudre : 3 g",
      "Sucre : 1 p",
      "Bouteille Eau Minérale 33cl : 1 p"
    ]
  },
  {
    "id": "bc_cappuccino_chantilly",
    "name": "Cappuccino Avec Chantilly",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 10 g",
      "Lait : 100 ml",
      "Chantilly : 30 g"
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
      "Café : 10 g",
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
      "Café : 10 g",
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
      "Café : 10 g",
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
      "Café espresso : 10 g",
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
      "Café espresso : 10 g",
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
      "Café espresso : 10 g",
      "Lait : 120 ml",
      "Base frappé vanille : 25 g",
      "Glace pilée : 150 g",
      "Crème chantilly : 30 g"
    ]
  },
  {
    "id": "fg_frappuccino_aromatise",
    "name": "FRAPPUCCINO AROMATISÉ",
    "category": "CAFÉS GLACÉS & FRAPPÉS",
    "ingredients": [
      "Café espresso : 10 g",
      "Lait : 120 ml",
      "Sirop Noisette / Caramel : 30 ml",
      "Glace pilée : 150 g",
      "Chantilly & Nappage : 35 g"
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
    "category": "AUTRE",
    "ingredients": [
      "Oranges fraîches à jus : 500 g"
    ]
  },
  {
    "id": "jf_jus_de_citron_citronnade",
    "name": "JUS DE CITRON / CITRONNADE",
    "category": "AUTRE",
    "ingredients": [
      "Citron pressé : 200 g",
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
    "category": "AUTRE",
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
  {
    "id": "pdj_brunch_duo",
    "name": "BRUNCH DUO",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
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
      "Khli3 : 100 g",
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
      "Pomme de Terre : 400 g",
      "Carotte : 200 g",
      "Poulet : 50 g",
      "Petit Pois : 150 g",
      "Olive Verte : 15 g",
      "Cornichon : 24 g",
      "Œufs de Caille : 1 p",
      "Mayonnaise : 30 g",
      "Thon : 100 g",
      "Maïs : 50 g",
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
    "id": "ec_boulettes_de_poulet_au_fromage",
    "name": "BOULETTE DE POULET AU FROMAGE",
    "category": "ENTRÉES CHAUDES",
    "ingredients": [
      "Poulet : 200 g",
      "Farine : 100 g",
      "Chapelure : 50 g",
      "Edam : 25 g"
    ]
  },
  {
    "id": "ec_croustillon_gambas",
    "name": "CROUSTILLON GAMBAS",
    "category": "ENTRÉES CHAUDES",
    "ingredients": [
      "Gambas chair pure : 100 g",
      "Chapelure : 30 g",
      "Purée : 200 g",
      "Radis : 15 g",
      "Parmesan : 14 g",
      "Crème fraîche : 50 g"
    ]
  },
  {
    "id": "ec_pil_pil_espagnol",
    "name": "PIL PIL ESPAGNOL",
    "category": "ENTRÉES CHAUDES",
    "ingredients": [
      "Gambas chair pure : 100 g",
      "Tomate cerise : 60 g",
      "Pesto : 22 g",
      "Huile d’olive : 30 g",
      "Oignon : 60 g",
      "Ail : 10 g",
      "Sauce tomate : 120 g"
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
    "id": "pl_supreme_de_poulet",
    "name": "SUPRÊME DE POULET",
    "category": "PLATS",
    "ingredients": [
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
      "FILET DE Bœuf : 150 g",
      "Champignons : 80 g",
      "Crème fraîche : 70 ml",
      "Demi-glace : 60 ml",
      "Légumes : 220 g",
      "Fokacha : 150 g",
      "Frites : 200 g",
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
      "Frites : 200 g"
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
      "Frites : 200 g"
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
    "name": "PANINI CHARCUTERIE",
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
    "name": "PANINI POULET",
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
    "name": "PANINI VIANDE HACHÉE",
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
    "name": "PANINI GOURMAND",
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
    "name": "PANINI FRUITS DE MER",
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
    "name": "PANINI SAUMON",
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
      "Mozzarella : 150 g",
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
      "Mozzarella : 150 g",
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
      "Mozzarella : 150 g",
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
      "Mozzarella : 150 g",
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
      "Mozzarella : 150 g",
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
      "Mozzarella : 150 g",
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
      "Mozzarella : 150 g",
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
      "Mozzarella : 150 g",
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
      "Mozzarella : 150 g",
      "Sauce tomate : 100 g",
      "Burrata : 1 P",
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
      "Mozzarella : 150 g",
      "Crevette : 165 g",
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
      "Mozzarella : 150 g",
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
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Nutella : 60 g"
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
    "id": "sup_supplement_poulet",
    "name": "SUPPLÉMENT POULET",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Poulet émincé : 80 g"
    ]
  },
  {
    "id": "sup_supplement_viande",
    "name": "SUPPLÉMENT VIANDE HACHÉE",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Viande hachée : 80 g"
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
  },
  {
    "id": "rec_1788198223698",
    "name": "PIZZA VEGETARIENNE",
    "category": "PIZZA",
    "ingredients": [
      "Pâte à pizza : 330 g",
      "Mozzarella : 150 g",
      "Sauce tomate : 100 g",
      "Olives noires : 15 g",
      "Légumes grillés : 150 g"
    ]
  },
  {
    "id": "rec_1788198656162",
    "name": "EGG BURGER",
    "category": "BURGERS",
    "ingredients": [
      "Viande Hachée : 100 g",
      "Cheddar : 20 g",
      "oeufs  : 1P",
      "Tomate : 30 g",
      "Laitue : 20 g",
      "Oignon+Cornichon : 45 ml",
      "Sauce Bigy : 30 g",
      "Frites + Sauce : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "rec_1788198827952",
    "name": "CREPE PECHEUR",
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "crevette : 150 g",
      "calamar : 40 g",
      "Mozzarella : 60 g",
      "creme fraiche : 50 g"
    ]
  },
  {
    "id": "rec_1788199150306",
    "name": "CREPE BOLONAISE",
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "VIANDE HACHEE :100 g",
      "Mozzarella : 60 g",
      "SAUCE TOMATE : 50 g"
    ]
  },
  {
    "id": "rec_1788199269031",
    "name": "CREPE GREY CORNER SALEE",
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "VIANDE HACHEE : 50 g",
      "CHARCUTERIE : 50 g",
      "poulet : 50 g",
      "Mozzarella : 60 g",
      "Fromage : 20 g"
    ]
  },
  {
    "id": "rec_1788199499882",
    "name": "CREPE BANANE NUTELLA",
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Nutella : 60 g",
      "BANANE : 100 g"
    ]
  },
  {
    "id": "rec_1788199584604",
    "name": "CREPE NATURE",
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 2 p"
    ]
  },
  {
    "id": "rec_1788199636915",
    "name": "CREPE CHOCO-NOISETTE",
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Nutella : 60 g",
      "Noisette : 30 g"
    ]
  },
  {
    "id": "rec_1788199691970",
    "name": "CREPE EXOTIQUE",
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Nutella : 60 g",
      "Fruits de saison : 80 g"
    ]
  },
  {
    "id": "rec_1788199770175",
    "name": "CREPE GREY CORNER SUCREE",
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Nutella : 60 g",
      "Chocolat varié : 50 g"
    ]
  },
  {
    "id": "rec_1788199916543",
    "name": "CREPE PM-CARAMELISEE",
    "category": "CREPES",
    "ingredients": [
      "Pâte à crêpe : 1 p",
      "Caramel : 40 g"
    ]
  },
  {
    "id": "rec_1788200045078",
    "name": "NUTELLA",
    "category": "AUTRE",
    "ingredients": [
      "NUTELLA : 20 g"
    ]
  },
  {
    "id": "rec_1788200166784",
    "name": "MQILA MERGUEZ",
    "category": "PETIT DÉJEUNER",
    "ingredients": [
      "Merguez : 120 g",
      "Poivrons/oignons : 120 g",
      "Œufs : 2 p"
    ]
  },
  {
    "id": "rec_1788200259401",
    "name": "POULARD",
    "category": "SANDWICHS",
    "ingredients": [
      "POULET : 70 g",
      "Demi-glace : 40 ml",
      "Champignon : 50 g",
      "Cheddar : 20 g",
      "Crème fraîche : 40 ml",
      "Frites : 200 g",
      "Pain : 1 p"
    ]
  },
  {
    "id": "rec_1788200443790",
    "name": "PASTA 5 FROMAGE",
    "category": "PÂTES",
    "ingredients": [
      "PATES :150 g",
      "Brie : 50 g",
      "Bleu : 40 g",
      "Sauce blanche : 100 g",
      "Parmesan : 20 g",
      "Fromage rouge : 40 g"
    ]
  },
  {
    "id": "rec_1788200577957",
    "name": "PASTA NATURE",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "Parmesan : 60 g",
      "Huile : 60 g",
      "Tomate cerise : 50 g",
      "Pesto : 70 g",
      "Sauce tomate : 80 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "rec_1788200694469",
    "name": "PASTA REGATONI RICOTTA",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 150 g",
      "FR RICOTTA : 100 g",
      "Parmesan : 60 g",
      "Huile : 60 g",
      "Tomate cerise : 50 g",
      "Pesto : 70 g",
      "Oignon/Ail : 70 g"
    ]
  },
  {
    "id": "rec_1788200961049",
    "name": "MENU ENFANT PIZZA",
    "category": "PIZZA",
    "ingredients": [
      "Pâte : 220 g",
      "Mozzarella : 100 g",
      "Sauce tomate : 100 g",
      "Olives noires : 13 g",
      "COCA : 1 p"
    ]
  },
  {
    "id": "rec_1788201140701",
    "name": "MENU ENFANT BURGER",
    "category": "AUTRE",
    "ingredients": [
      "Viande Hachée : 70 g",
      "Cheddar : 20 g",
      "Sauce Bigy : 30 g",
      "Frites + Sauce : 200 g",
      "Pain : 1 p",
      "coca : 1 p"
    ]
  },
  {
    "id": "rec_1788201291652",
    "name": "SALADE CERCLE VEGGL",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "Chou rouge : 100 g",
      "Concombre : 80 g",
      "Tomate cerise : 70 g",
      "Œufs de caille : 1 p",
      "Haricot vert : 60 g",
      "Betterave : 120 g",
      "Carotte : 40 g",
      "Brocoli : 50 g",
      "Radis : 60 g",
      "Thon : 50 g",
      "Vinaigrette : 40 ml",
      "Maïs : 30 g",
      "Poivron : 50 g"
    ]
  },
  {
    "id": "rec_1788201601213",
    "name": "SALADE BURRATTA",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "BURRATA : 1 p",
      "NOIX : 30 G",
      "tomate:30 G",
      "roquette :25 G",
      "vinaigre balsamique :10 G"
    ]
  },
  {
    "id": "rec_1788201893575",
    "name": "RUSSE",
    "category": "ENTRÉES FROIDES",
    "ingredients": [
      "Pomme de terre : 150 g",
      "Carotte : 80 g",
      "Petit Pois : 50 g",
      "Œufs de caille : 1 p",
      "Poulet : 50 g",
      "Mayonnaise : 30 g"
    ]
  },
  {
    "id": "sod_schweppes_citron",
    "name": "SCHWEPPES CITRON",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Canette Schweppes Citron : 1 p"
    ]
  },
  {
    "id": "sod_oulmes_mojito",
    "name": "OULMES MOJITO",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Canette Oulmès Mojito : 1 p"
    ]
  },
  {
    "id": "sod_oulmes_tropical",
    "name": "OULMES TROPICAL",
    "category": "SODAS & BOISSONS FRAÎCHES",
    "ingredients": [
      "Canette Oulmès Tropical : 1 p"
    ]
  },
  {
    "id": "ck_gingembre",
    "name": "GINGEMBRE",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Jus de gingembre : 150 ml",
      "Citron : 30 ml",
      "Miel : 20 g"
    ]
  },
  {
    "id": "ck_fraicheur",
    "name": "Cocktail Fraîcheur",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Jus de pomme : 150 ml",
      "Menthe : 10 g",
      "Citron : 30 ml",
      "Glaçons : 1 p"
    ]
  },
  {
    "id": "ck_san_francisco",
    "name": "San Francisco",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Jus d'orange : 100 ml",
      "Jus d'ananas : 100 ml",
      "Sirop grenadine : 20 ml"
    ]
  },
  {
    "id": "ck_cocktail_gc",
    "name": "Cocktail GREY CORNER",
    "category": "COCKTAILS & MOCKTAILS",
    "ingredients": [
      "Fruits variés : 150 g",
      "Jus d'orange : 100 ml",
      "Sirop : 20 ml"
    ]
  },
  {
    "id": "sm_triple_berry",
    "name": "Triple Berry",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Fruits rouges : 120 g",
      "Lait : 100 ml",
      "Yaourt : 50 g"
    ]
  },
  {
    "id": "sm_energetique",
    "name": "Énergétique",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Banane : 100 g",
      "Dattes : 40 g",
      "Lait : 150 ml",
      "Miel : 15 g"
    ]
  },
  {
    "id": "sm_pink_smoothie",
    "name": "Pink Smoothie",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Fraise : 100 g",
      "Framboise : 50 g",
      "Yaourt : 80 g",
      "Lait : 100 ml"
    ]
  },
  {
    "id": "sm_multi_vitamine",
    "name": "Multi-Vitamine",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Jus d'orange : 100 ml",
      "Carotte : 60 g",
      "Pomme : 80 g"
    ]
  },
  {
    "id": "sm_hawaien",
    "name": "Hawaïen",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Ananas : 100 g",
      "Mangue : 80 g",
      "Jus d'orange : 100 ml"
    ]
  },
  {
    "id": "smb_exotique_bowl",
    "name": "Exotique BOWL",
    "category": "SMOOTHIES & BOWLS",
    "ingredients": [
      "Fruits exotiques : 150 g",
      "Açaï : 50 g",
      "Muesli : 40 g",
      "Graines de chia : 10 g"
    ]
  },
  {
    "id": "jf_fruits_secs",
    "name": "FRUITS SECS",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Fruits secs / Amandes : 50 g",
      "Lait : 150 ml",
      "Miel : 15 g"
    ]
  },
  {
    "id": "jf_avocat_orange",
    "name": "JUS D'AVOCAT ORANGE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Avocat : 100 g",
      "Jus d'orange : 150 ml"
    ]
  },
  {
    "id": "jf_pomme",
    "name": "Jus De Pomme",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Pomme : 250 g"
    ]
  },
  {
    "id": "jf_banane_orange",
    "name": "BANANE ORANGE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Banane : 100 g",
      "Jus d'orange : 150 ml"
    ]
  },
  {
    "id": "jf_panache_lait",
    "name": "Panaché AU LAIT",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Fruits de saison : 120 g",
      "Lait : 150 ml"
    ]
  },
  {
    "id": "jf_mini_orange",
    "name": "MINI ORANGE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Orange : 150 g"
    ]
  },
  {
    "id": "jf_bettrave",
    "name": "JUS DE BETTRAVE",
    "category": "JUS FRAIS PRESSÉS & ROYAUX",
    "ingredients": [
      "Betterave : 150 g",
      "Jus d'orange : 100 ml"
    ]
  },
  {
    "id": "cr_gaufre_nutella",
    "name": "Gauffre Nutella",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à gaufre : 1 p",
      "Nutella : 60 g"
    ]
  },
  {
    "id": "cr_gaufre_nutela_banane",
    "name": "Gauffre Nutela Banane",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à gaufre : 1 p",
      "Nutella : 60 g",
      "Banane : 80 g"
    ]
  },
  {
    "id": "cr_gaufre_kunafa_pistache",
    "name": "GAUFFRE KUNAFA PISTACHE",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à gaufre : 1 p",
      "Kunafa : 40 g",
      "Pistache : 30 g",
      "Sirop : 20 ml"
    ]
  },
  {
    "id": "cr_gaufre_exotique",
    "name": "Gauffre Exotique",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à gaufre : 1 p",
      "Fruits de saison : 80 g",
      "Nutella : 40 g"
    ]
  },
  {
    "id": "cr_gaufre_choco_noisette",
    "name": "Gauffre Choco-Noisette",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à gaufre : 1 p",
      "Nutella : 60 g",
      "Noisette : 30 g"
    ]
  },
  {
    "id": "cr_gaufre_pm_caramelisee",
    "name": "Gauffre PM-Caramelisee",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à gaufre : 1 p",
      "Pomme : 60 g",
      "Caramel : 40 g"
    ]
  },
  {
    "id": "cr_gaufre_nature",
    "name": "GAUFFRE NATURE",
    "category": "CRÊPES",
    "ingredients": [
      "Pâte à gaufre : 1 p",
      "Sucre : 15 g"
    ]
  },
  {
    "id": "des_coupe_grey_corner",
    "name": "Coupe Grey Corner",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Boules de glace : 3 p",
      "Chantilly : 40 g",
      "Coulis : 20 ml",
      "Amandes : 15 g"
    ]
  },
  {
    "id": "des_banana_split",
    "name": "Banana Split",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Banane : 1 p",
      "Boules de glace : 3 p",
      "Chantilly : 40 g",
      "Chocolat : 20 ml"
    ]
  },
  {
    "id": "des_coupe_enfant",
    "name": "Coupe Enfant",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Boules de glace : 2 p",
      "Chantilly : 20 g",
      "Smarties : 15 g"
    ]
  },
  {
    "id": "des_coupe_amor",
    "name": "Coupe Amor",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Boules de glace : 3 p",
      "Fruits rouges : 40 g",
      "Chantilly : 30 g"
    ]
  },
  {
    "id": "des_milkshake_nutella",
    "name": "Milkshake Nutella",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Nutella : 50 g",
      "Chantilly : 20 g"
    ]
  },
  {
    "id": "des_milkshake_vanille",
    "name": "Milkshake Vanille",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Lait : 180 ml",
      "Boules de glace : 3 p",
      "Chantilly : 20 g"
    ]
  },
  {
    "id": "des_milkshake_cookies",
    "name": "Milkshake Cookies",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Cookies : 40 g",
      "Chantilly : 20 g"
    ]
  },
  {
    "id": "des_milkshake_fraise",
    "name": "Milkshake Fraise",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Fraise : 50 g",
      "Chantilly : 20 g"
    ]
  },
  {
    "id": "des_milkshake_chocolat",
    "name": "Milkshake Chocolat",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Chocolat : 30 ml",
      "Chantilly : 20 g"
    ]
  },
  {
    "id": "des_milkshake_kitkat",
    "name": "Milkshake Kitkat",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "KitKat : 1 p",
      "Chantilly : 20 g"
    ]
  },
  {
    "id": "des_milkshake_caramel",
    "name": "Milkshake Caramel",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Lait : 180 ml",
      "Boules de glace : 2 p",
      "Caramel : 40 g",
      "Chantilly : 20 g"
    ]
  },
  {
    "id": "des_orangeshake",
    "name": "ORANGESHAKE AU CHOIX",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Jus d'orange : 180 ml",
      "Boules de glace : 2 p"
    ]
  },
  {
    "id": "des_pain_cake_nutella",
    "name": "Pain Cake Nutella",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Pancakes : 3 p",
      "Nutella : 60 g"
    ]
  },
  {
    "id": "des_pain_cake_fruits",
    "name": "Pain Cake Fruits De Saison",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Pancakes : 3 p",
      "Fruits de saison : 80 g",
      "Miel : 30 g"
    ]
  },
  {
    "id": "des_pain_cake_enfant",
    "name": "Pain Cake Enfant",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Pancakes : 2 p",
      "Nutella : 30 g",
      "Smarties : 10 g"
    ]
  },
  {
    "id": "des_pain_cake_gc",
    "name": "Pain Cake Grey Corner",
    "category": "DESSERTS & PÂTISSERIES",
    "ingredients": [
      "Pancakes : 3 p",
      "Nutella : 50 g",
      "Fruits de saison : 60 g",
      "Boules de glace : 1 p"
    ]
  },
  {
    "id": "bc_lait_chaud",
    "name": "LAIT CHAUD",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Lait : 200 ml",
      "Sucre : 1 p"
    ]
  },
  {
    "id": "bc_lait_froid",
    "name": "Lait FROID",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Lait : 200 ml",
      "Sucre : 1 p"
    ]
  },
  {
    "id": "bc_cafe_aromatise",
    "name": "CAFE AROMATISE",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 10 g",
      "Eau chaude : 60 ml",
      "Sirop : 15 ml"
    ]
  },
  {
    "id": "bc_cafe_double",
    "name": "CAFE DOUBLE",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Café : 18 g",
      "Eau chaude : 100 ml",
      "Sucre : 2 p"
    ]
  },
  {
    "id": "bc_the_m3achab",
    "name": "THE M3ACHAB",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Thé vert : 8 g",
      "Menthe : 15 g",
      "Sucre : 2 p"
    ]
  },
  {
    "id": "bc_the_americain",
    "name": "The Americain",
    "category": "CAFÉS & BOISSONS CHAUDES",
    "ingredients": [
      "Sachet thé : 1 p",
      "Eau chaude : 200 ml"
    ]
  },
  {
    "id": "sup_amlou",
    "name": "AMLOU",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Amlou : 40 g"
    ]
  },
  {
    "id": "sup_beurre",
    "name": "BEURRE",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Beurre : 30 g"
    ]
  },
  {
    "id": "sup_cornflex",
    "name": "CORNFLEX",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Corn flakes : 40 g",
      "Lait : 100 ml"
    ]
  },
  {
    "id": "sup_huile_olive",
    "name": "HUILE OLIVE",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Huile d'olive : 40 ml"
    ]
  },
  {
    "id": "sup_la_vache_qui_rit",
    "name": "LA VACHE QUI RIT",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Fromage portion : 2 p"
    ]
  },
  {
    "id": "sup_3_merguez",
    "name": "3 MERGUEZ",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Merguez : 100 g"
    ]
  },
  {
    "id": "sup_champignon",
    "name": "CHAMPIGNON",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Champignon : 60 g"
    ]
  },
  {
    "id": "sup_fromage_rouge_taj",
    "name": "FROMAGE ROUGE TAJ",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Fromage : 40 g"
    ]
  },
  {
    "id": "sup_parmesan_fromage",
    "name": "PARMESAN FROMAGE",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Parmesan : 30 g"
    ]
  },
  {
    "id": "sup_amuse_bouche",
    "name": "AMUSE BOUCHE",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Ingrédients cuisine divers : 50 g"
    ]
  },
  {
    "id": "sup_riz",
    "name": "RIZ",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Riz : 150 g"
    ]
  },
  {
    "id": "sup_legumes_sautees",
    "name": "LEGUMES SAUTEES",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Légumes variés : 150 g",
      "Huile : 10 ml"
    ]
  },
  {
    "id": "alc_mssemen_agrich",
    "name": "MSSEMEN AGRICH",
    "category": "A LA CARTE & BOULANGERIE",
    "ingredients": [
      "Msemen : 1 p",
      "Griche : 40 g"
    ]
  },
  {
    "id": "alc_pain_cereal",
    "name": "PAIN CEREAL",
    "category": "A LA CARTE & BOULANGERIE",
    "ingredients": [
      "Pain céréales : 1 p"
    ]
  },
  {
    "id": "alc_pain_grille",
    "name": "PAIN GRILLE",
    "category": "A LA CARTE & BOULANGERIE",
    "ingredients": [
      "Pain toast : 2 p"
    ]
  },
  {
    "id": "alc_berber",
    "name": "BERBER",
    "category": "A LA CARTE & BOULANGERIE",
    "ingredients": [
      "Œufs : 2 p",
      "Khlii : 50 g",
      "Tomate : 40 g"
    ]
  },
  {
    "id": "alc_toast_nutella",
    "name": "TOAST NUTELLA",
    "category": "A LA CARTE & BOULANGERIE",
    "ingredients": [
      "Pain toast : 2 p",
      "Nutella : 40 g"
    ]
  },
  {
    "id": "alc_confiture",
    "name": "CONFITURE",
    "category": "A LA CARTE & BOULANGERIE",
    "ingredients": [
      "Confiture : 40 g"
    ]
  },
  {
    "id": "sup_lben",
    "name": "LBEN",
    "category": "SUPPLÉMENTS & EXTRAS",
    "ingredients": [
      "Lben : 250 ml"
    ]
  },
  {
    "id": "pz_regina_dinde",
    "name": "REGINA DINDE FUMEE",
    "category": "PIZZA",
    "ingredients": [
      "Pâte à pizza : 330 g",
      "Mozzarella : 150 g",
      "Sauce tomate : 100 g",
      "Dinde fumée : 80 g",
      "Champignon : 50 g"
    ]
  },
  {
    "id": "me_pasta_nature",
    "name": "MENU ENFANT PASTA NATURE",
    "category": "PÂTES",
    "ingredients": [
      "Pâtes : 100 g",
      "Sauce tomate : 60 g",
      "Parmesan : 15 g",
      "Canette Soda : 1 p"
    ]
  }
];

const ALIAS_MAP = {
  "brochette de poulet": "plat_brochette_poulet",
  "plat brochette poulet": "plat_brochette_poulet",
  "brochettes de poulet": "pl_brochettes_de_poulet",
  "brochette poulet": "plat_brochette_poulet",
  "couscous poulet avec petit lait": "plat_couscous_poulet",
  "couscous poulet": "plat_couscous_poulet",
  "sup charcuterie": "sup_supplement_charcuterie",
  "supplement charcuterie": "sup_supplement_charcuterie",
  "compose au choix": "sup_pizza_composee_au_choix",
  "salade composee": "sal_composee_au_choix",
  "salade compose au choix": "sal_composee_au_choix",
  "boulettes de poulet fr": "ec_boulettes_poulet",
  "boulette de poulet fr": "ec_boulettes_poulet",
  "boulettes de poulet": "ec_boulettes_de_poulet_au_fromage",
  "panini poulet": "pa_poulet",
  "panini charcuterie": "pa_charcuterie",
  "panini viande hachee": "pa_viande_hachee",
  "panini mix": "pa_gourmand",
  "panini gourmand": "pa_gourmand",
  "panini saumon": "pa_saumon",
  "panini fruits de mer": "pa_fruits_de_mer",
  "oeufs beldi": "alc_oeufs_beldi",
  "oeuf beldi": "alc_oeufs_beldi",
  "2 oeufs beldi": "alc_oeufs_beldi",
  "3 oeufs beldi": "alc_oeufs_beldi",
  "2 oeufs": "sup_supplement_oeufs",
  "3 oeufs": "sup_supplement_oeufs",
  "oeuf": "sup_supplement_oeufs",
  "oeufs": "sup_supplement_oeufs",
  "6 croquettes fromage": "ec_croquettes_fromage",
  "6 croquettes de fromage": "ec_croquettes_fromage",
  "croquettes fromage": "ec_boulettes_de_poulet_au_fromage",
  "croquette fromage": "ec_boulettes_de_poulet_au_fromage",
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
  "virgin pina colada": "ck_virgin_pi_a_colada",
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
  "croquettes 5 fromages": "ec_boulettes_de_poulet_au_fromage",
  "croquette 5 fromages": "ec_boulettes_de_poulet_au_fromage",
  "croquettes au fromage": "ec_boulettes_de_poulet_au_fromage",
  "croquette au fromage": "ec_boulettes_de_poulet_au_fromage",
  "croquettes": "ec_boulettes_de_poulet_au_fromage",
  "boulettes de poulet au fromage": "ec_boulettes_de_poulet_au_fromage",
  "boulette de poulet au fromage": "ec_boulettes_de_poulet_au_fromage",
  "boulette de poulet": "ec_boulettes_de_poulet_au_fromage",
  "boulette poulet fromage": "ec_boulettes_de_poulet_au_fromage",
  "boulettes poulet fromage": "ec_boulettes_de_poulet_au_fromage",
  "croustillon gambas": "ec_croustillon_gambas",
  "pil pil espagnol": "ec_pil_pil_espagnol",
  "emince de poulet": "pl_emince_de_poulet",
  "ballotine de poulet": "pl_ballotine_de_poulet",
  "supreme de poulet": "pl_supreme_de_poulet",
  "suprême de poulet": "pl_supreme_de_poulet",
  "supreme poulet": "pl_supreme_de_poulet",
  "escalope a la parmigiana": "pl_supreme_de_poulet",
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
  "roulade de boeuf": "pl_roulade_de_boeuf_vh",
  "roulade de viande hachee": "pl_roulade_de_boeuf_vh",
  "roulade de viande hachée": "pl_roulade_de_boeuf_vh",
  "roulade viande hachee": "pl_roulade_de_boeuf_vh",
  "roulade v hache": "pl_roulade_de_boeuf_vh",
  "roulade de boeuf de viande hachee": "pl_roulade_de_boeuf_vh",
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
  "pina colada": "ck_virgin_pi_a_colada",
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
  "schweppes citron": "sod_schweppes_citron",
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
  "plat escalope a la parmigiana": "pl_supreme_de_poulet",
  "plat supreme de poulet": "pl_supreme_de_poulet",
  "plat suprême de poulet": "pl_supreme_de_poulet",
  "plat supreme poulet": "pl_supreme_de_poulet",
  "plat suprême poulet": "pl_supreme_de_poulet",
  "plat filet de boeuf": "pl_filet_de_boeuf",
  "plat pave de saumon": "pl_pave_de_saumon",
  "menu enfant nugette": "pl_menu_enfant_plat",
  "plat roulade de boeuf": "pl_roulade_de_boeuf_vh",
  "plat roulade de bœuf": "pl_roulade_de_boeuf_vh",
  "plat roulade de viande hachee": "pl_roulade_de_boeuf_vh",
  "plat roulade de viande hachée": "pl_roulade_de_boeuf_vh",
  "panini mixte": "pa_gourmand",
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
  "pizza vegetarienne": "rec_1788198223698",
  "pizza saumon": "pz_saumon",
  "pizza regina": "pz_regina",
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
  "harcha": "alc_harcha",
  "schwepps citron": "sod_schweppes_citron",
  "gingembre": "ck_gingembre",
  "gauffre nutella": "cr_gaufre_nutella",
  "gaufre nutella": "cr_gaufre_nutella",
  "regina dinde fumee": "pz_regina_dinde",
  "lait chaud": "bc_lait_chaud",
  "lait froid": "bc_lait_froid",
  "fraicheur": "ck_fraicheur",
  "triple berry": "sm_triple_berry",
  "fruits sec": "jf_fruits_secs",
  "fruits secs": "jf_fruits_secs",
  "oulmess mojito": "sod_oulmes_mojito",
  "oulmes mojito": "sod_oulmes_mojito",
  "jus d avocat orange": "jf_avocat_orange",
  "avocat orange": "jf_avocat_orange",
  "energetique": "sm_energetique",
  "coupe grey corner": "des_coupe_grey_corner",
  "exotique bowl": "smb_exotique_bowl",
  "pink smoothie": "sm_pink_smoothie",
  "san francisco": "ck_san_francisco",
  "cafe aromatise": "bc_cafe_aromatise",
  "pain cake nutella": "des_pain_cake_nutella",
  "pancake nutella": "des_pain_cake_nutella",
  "amlou": "sup_amlou",
  "jus de pomme": "jf_pomme",
  "banana split": "des_banana_split",
  "gauffre nutela banane": "cr_gaufre_nutela_banane",
  "gaufre nutella banane": "cr_gaufre_nutela_banane",
  "the m3achab": "bc_the_m3achab",
  "oulmes tropical": "sod_oulmes_tropical",
  "huile olive": "sup_huile_olive",
  "banane orange": "jf_banane_orange",
  "la vache qui rit": "sup_la_vache_qui_rit",
  "cocktail grey corner": "ck_cocktail_gc",
  "coupe enfant": "des_coupe_enfant",
  "milkshake nutella": "des_milkshake_nutella",
  "multi vitamine": "sm_multi_vitamine",
  "multi-vitamine": "sm_multi_vitamine",
  "3 merguez": "sup_3_merguez",
  "beurre": "sup_beurre",
  "cornflex": "sup_cornflex",
  "corn flakes": "sup_cornflex",
  "menu enfant pasta nature": "me_pasta_nature",
  "coupe amor": "des_coupe_amor",
  "hawaien": "sm_hawaien",
  "milkshake vanille": "des_milkshake_vanille",
  "milkshake cookies": "des_milkshake_cookies",
  "parmesan fromage": "sup_parmesan_fromage",
  "orangeshake au choix": "des_orangeshake",
  "milkshake fraise": "des_milkshake_fraise",
  "pain cake fruits de saison": "des_pain_cake_fruits",
  "milkshake chocolat": "des_milkshake_chocolat",
  "gauffre kunafa pistache": "cr_gaufre_kunafa_pistache",
  "mini orange": "jf_mini_orange",
  "gauffre exotique": "cr_gaufre_exotique",
  "amuse bouche": "sup_amuse_bouche",
  "riz": "sup_riz",
  "legumes sautees": "sup_legumes_sautes",
  "mssemen agrich": "alc_mssemen_agrich",
  "panache au lait": "jf_panache_lait",
  "champignon": "sup_champignon",
  "pain cereal": "alc_pain_cereal",
  "milkshake kitkat": "des_milkshake_kitkat",
  "gauffre choco-noisette": "cr_gaufre_choco_noisette",
  "fromage rouge taj": "sup_fromage_rouge_taj",
  "pain grille": "alc_pain_grille",
  "berber": "alc_berber",
  "gauffre pm-caramelisee": "cr_gaufre_pm_caramelisee",
  "milkshake caramel": "des_milkshake_caramel",
  "gauffre nature": "cr_gaufre_nature",
  "pain cake enfant": "des_pain_cake_enfant",
  "confiture": "alc_confiture",
  "the americain": "bc_the_americain",
  "cafe double": "bc_cafe_double",
  "lben": "sup_lben",
  "cappuccino avec chantilly": "bc_cappuccino_chantilly",
  "jus de bettrave": "jf_bettrave",
  "toast nutella": "alc_toast_nutella",
  "pain cake grey corner": "des_pain_cake_gc",
  "pizza veget arienne": "rec_1788198223698"
};

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
    "unit": "ml",
    "label": "Sauce Vinaigrette"
  },
  "vinaigrette": {
    "cost": 0.025,
    "unit": "ml",
    "label": "Sauce Vinaigrette"
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
    "cost": 0.03,
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
    "cost": 0.03,
    "unit": "ml"
  },
  "creme fraiche": {
    "cost": 0.03,
    "unit": "ml"
  },
  "creme chantilly": {
    "cost": 0.03,
    "unit": "g"
  },
  "chantilly": {
    "cost": 0.045,
    "unit": "g",
    "label": "Chantilly"
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
    "unit": "ml",
    "label": "Sirop"
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
    "cost": 0.065,
    "unit": "g"
  },
  "poulet": {
    "cost": 0.065,
    "unit": "g"
  },
  "poulet hache": {
    "cost": 0.065,
    "unit": "g"
  },
  "poulet pane": {
    "cost": 0.068,
    "unit": "g"
  },
  "poulet emince": {
    "cost": 0.065,
    "unit": "g"
  },
  "poulet grille": {
    "cost": 0.065,
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
    "cost": 0.18,
    "unit": "g"
  },
  "filet": {
    "cost": 0.18,
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
    "cost": 0.085,
    "unit": "g"
  },
  "charcuteries": {
    "cost": 0.085,
    "unit": "g"
  },
  "charcuterie de dinde": {
    "cost": 0.085,
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
  "saumon": {
    "cost": 0.135,
    "unit": "g"
  },
  "saumon frais": {
    "cost": 0.135,
    "unit": "g"
  },
  "saumon fume": {
    "cost": 0.28,
    "unit": "g"
  },
  "crevette": {
    "cost": 0.055,
    "unit": "g"
  },
  "crevettes": {
    "cost": 0.055,
    "unit": "g"
  },
  "gambas": {
    "cost": 0.055,
    "unit": "g"
  },
  "gambas avec coquille": {
    "cost": 0.055,
    "unit": "g"
  },
  "gambas chair pure": {
    "cost": 0.210,
    "unit": "g"
  },
  "gambas chair pur": {
    "cost": 0.210,
    "unit": "g"
  },
  "gambas chair": {
    "cost": 0.210,
    "unit": "g"
  },
  "crevette chair pure": {
    "cost": 0.210,
    "unit": "g"
  },
  "crevette chair pur": {
    "cost": 0.210,
    "unit": "g"
  },
  "gambas panees": {
    "cost": 0.180,
    "unit": "g"
  },
  "gambas pane": {
    "cost": 0.180,
    "unit": "g"
  },
  "gambas poche": {
    "cost": 0.210,
    "unit": "g"
  },
  "gambas pochee": {
    "cost": 0.210,
    "unit": "g"
  },
  "gambas decortiquees": {
    "cost": 0.210,
    "unit": "g"
  },
  "calamar": {
    "cost": 0.165,
    "unit": "g"
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
    "cost": 0.025,
    "unit": "g",
    "label": "Yaourt"
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
    "cost": 3.5,
    "unit": "piece",
    "label": "Pain Céréales"
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
    "cost": 0.009089999999999999,
    "unit": "g"
  },
  "pate": {
    "cost": 0.009089999999999999,
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
    "cost": 0.018,
    "unit": "g"
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
    "cost": 0.015,
    "unit": "g",
    "label": "Riz Cuit"
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
    "cost": 0.015,
    "unit": "g",
    "label": "Haricot Vert"
  },
  "betterave": {
    "cost": 0.007,
    "unit": "g",
    "label": "Betterave"
  },
  "brocoli": {
    "cost": 0.022,
    "unit": "g",
    "label": "Brocoli"
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
    "cost": 0.025,
    "unit": "ml",
    "label": "Gingembre"
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
    "cost": 0.015,
    "unit": "g",
    "label": "Légumes Variés"
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
    "cost": 0.09,
    "unit": "g",
    "label": "Framboise"
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
    "cost": 0.02,
    "unit": "g",
    "label": "Ananas"
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
    "cost": 0.03,
    "unit": "g",
    "label": "Mangue"
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
    "cost": 0.045,
    "unit": "g",
    "label": "Dattes"
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
    "cost": 0.01,
    "unit": "g",
    "label": "Menthe"
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
    "cost": 3,
    "unit": "piece",
    "label": "Boule Glace"
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
    "cost": 0.12,
    "unit": "g",
    "label": "Amlou"
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
    "cost": 0.06,
    "unit": "g",
    "label": "Kunafa"
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
    "cost": 0.22,
    "unit": "g",
    "label": "Pistache"
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
    "cost": 0.08,
    "unit": "g",
    "label": "Graines de Chia"
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
    "cost": 35.0,
    "unit": "piece",
    "label": "Fromage Burrata"
  },
  "quinoa noir": {
    "cost": 0.055,
    "unit": "g",
    "label": "Quinoa Noir"
  }
};

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
      for (const [k, v] of Object.entries(costMap)) {
        if (normIng === k || normIng.includes(k) || k.includes(normIng)) {
          ingDef = v;
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

global.CATEGORIES_DATA = DATA;
global.DATA = DATA;
global.BASE_RECIPES = BASE_RECIPES;
global.ALIAS_MAP = ALIAS_MAP;
global.INGREDIENT_CATEGORIES = INGREDIENT_CATEGORIES;
global.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;
global.calculateRecipeFoodCost = calculateRecipeFoodCost;
if (typeof window !== 'undefined') {
  window.calculateRecipeFoodCost = calculateRecipeFoodCost;
  window.INGREDIENT_UNIT_COSTS = INGREDIENT_UNIT_COSTS;
}
})(typeof window !== 'undefined' ? window : globalThis);
