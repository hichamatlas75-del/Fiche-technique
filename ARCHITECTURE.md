# 📐 Architecture Modulaire v8.0 — Grey Corner « Fiche Technique »

Ce document décrit l architecture logicielle de l application **Grey Corner (Fiche Technique)** après le refactoring en architecture modulaire propre (v8.0).

---

## 1. Principes Directeurs

1. **Client-Side & Sans Bundler** : L application s exécute directement dans le navigateur (hébergement statique / GitHub Pages / local offline) sans étape de build complexe.
2. **Modularité Forte & Responsabilité Unique** : Les monolithes historiques (`consommation.js` de 7 100 lignes et `comparateur.js` de 2 900 lignes) ont été scindés en modules ciblés de 200 à 1 500 lignes.
3. **Single Source of Truth (SSOT)** :
   - Recettes & Fiches : `recipes-data.js`
   - Coûts unitaires & Food Cost : `js/ingredient-costs.js`
   - Utilitaires transversaux : `js/core-utils.js`
4. **Zéro Duplication** : Les fonctions d assainissement (`cleanText`), d échappement (`escapeHtml`), de formatage (`formatMoney`), et les listes d exclusion/obsolescence sont strictement centralisées dans `core-utils.js`.
5. **Interopérabilité Node.js** : Tous les fichiers de données supportent nativement le format UMD / `module.exports` pour permettre aux scripts d automatisation (`scripts/*.js`) de faire un simple `require()` sans hack ni `eval()`.

---

## 2. Arborescence du Dossier `js/`

```
js/
├── core-utils.js              # Socle utilitaire commun (formatage, toast, wake lock, cleanText, escapeHtml)
├── ingredient-costs.js        # Coûts unitaires des matières premières & moteur calculateRecipeFoodCost
├── prices-modal.js            # Modale universelle de consultation/édition de la mercuriale des prix d achat
├── burger-menu.js             # Gestionnaire universel de tiroir latéral (drawer) et navigation mobile
├── proposed-standards.js      # Base des standards internationaux F&B & algorithme d ajustement des portions
│
├── kitchen.js                 # Écran Cuisine (KDS) : minuteurs audio, lightbox, mode tablette
├── audit-flash-page.js        # Module d audit d inventaire physique inopiné (audit.html)
│
├── conso-state.js             # Déstockage : État global (activeRecipes, monthlySalesDB), chargement/sauvegarde
├── conso-processing.js        # Déstockage : Matching ventes POS, déstockage théorique des ingrédients
├── conso-dashboard.js         # Déstockage : Calendrier mensuel, tableaux des ventes & récapitulatif
├── conso-recipes.js           # Déstockage : Modale d édition des fiches techniques & simulation de Food Cost
├── conso-audit.js             # Déstockage : Import de ventes (Excel/PDF) & inventaire de fin de mois
├── conso-menu-engineering.js  # Déstockage : Matrice Kasavana & Smith et Radar Holographique 3D Canvas
├── conso-temporal.js          # Déstockage : Comparateur multi-périodes (jours, semaines, mois) & aide à la décision
├── conso-main.js              # Déstockage : Point d entrée DOM, routage des onglets & drag-and-drop
│
├── comp-core.js               # Comparateur : État global (allRecipes, editedRecipes), initialisation & KPIs
├── comp-ai.js                 # Comparateur : Agent IA optimiseur de rentabilité & analyse des marges
├── comp-ui.js                 # Comparateur : Rendu des cartes comparatives et tableau synthétique
├── comp-editor.js             # Comparateur : Éditeur dynamique des grammages de portions
└── comp-export.js             # Comparateur : Export Excel comparatif, mercuriale & commit direct GitHub
```

---

## 3. Découpage & Responsabilités des Pages

### A. Écran Cuisine (`index.html`)
- **Rôle** : Consultation opérationnelle pour chefs de poste et cuisiniers.
- **Scripts chargés** :
  1. `recipes-data.js`
  2. `js/ingredient-costs.js`
  3. `js/core-utils.js`
  4. `js/prices-modal.js`
  5. `js/kitchen.js` (avec `defer`)

### B. Déstockage & Consommation (`consommation.html`)
- **Rôle** : Suivi des ventes réelles, calcul du déstockage théorique, analyse Menu Engineering et rentabilité F&B.
- **Scripts chargés** :
  1. `recipes-data.js`
  2. `js/ingredient-costs.js`
  3. `js/core-utils.js`
  4. `js/prices-modal.js`
  5. `js/burger-menu.js`
  6. `js/conso-state.js`
  7. `js/conso-processing.js`
  8. `js/conso-dashboard.js`
  9. `js/conso-recipes.js`
  10. `js/conso-audit.js`
  11. `js/conso-menu-engineering.js`
  12. `js/conso-temporal.js`
  13. `js/conso-main.js`

### C. Normes & Benchmark International (`comparateur.html`)
- **Rôle** : Comparaison côte-à-côte fiches GC vs standards internationaux, détection de surdosages, Agent IA et synchronisation GitHub.
- **Scripts chargés** :
  1. `recipes-data.js`
  2. `js/ingredient-costs.js`
  3. `js/core-utils.js`
  4. `js/prices-modal.js`
  5. `js/proposed-standards.js`
  6. `js/burger-menu.js`
  7. `js/comp-core.js`
  8. `js/comp-ai.js`
  9. `js/comp-ui.js`
  10. `js/comp-editor.js`
  11. `js/comp-export.js` (avec `defer`)

### D. Audit Flash Manuel (`audit.html`)
- **Rôle** : Contrôle physique inopiné des stocks, écarts réels vs théoriques et consolidation multi-sessions.
- **Scripts chargés** :
  1. `recipes-data.js`
  2. `js/ingredient-costs.js`
  3. `js/core-utils.js`
  4. `js/prices-modal.js`
  5. `js/audit-flash-page.js`

---

## 4. Guide Pratique pour les Modifications Futures

### Comment ajouter une nouvelle recette ?
1. Ouvrez `recipes-data.js`.
2. Repérez la catégorie cible dans le tableau `DATA`.
3. Ajoutez l objet recette au format standard :
   ```json
   {
     "name": "NOUVELLE RECETTE",
     "image": "images/nouvelle-recette.jpg",
     "prepTime": 10,
     "tech": [
       "Ingrédient 1 : 150 g",
       "Ingrédient 2 : 50 ml"
     ],
     "price": "55 DH"
   }
   ```
4. Exécutez `node scripts/build-food-cost.js` pour recalculer automatiquement `cost`, `foodCost`, `margin` et `grossMarginDH`.

### Comment mettre à jour le prix d achat d un ingrédient ?
- **Depuis l interface web** : Cliquez sur le bouton *"💲 Prix Matières"* dans l en-tête de n importe quelle page.
- **Dans le code source** : Modifiez `INGREDIENT_UNIT_COSTS` dans `js/ingredient-costs.js`.

### Comment ajouter un nouvel alias de caisse (POS) ?
- Modifiez `ALIAS_MAP` dans `recipes-data.js` pour lier le libellé brut du ticket de caisse à l identifiant de la fiche technique.

---

## 5. Scripts d Automatisation (`scripts/`)

| Script | Rôle | Commande |
|---|---|---|
| `build-food-cost.js` | Recalcule tous les coûts matières et food costs dans `recipes-data.js` | `node scripts/build-food-cost.js` |
| `sync-all-prices.js` | Aligne les prix entre la carte publique (`menu-data.js`) et les fiches | `node scripts/sync-all-prices.js` |
| `apply-json-prices.js` | Applique une matrice tarifaire JSON directement | `node scripts/apply-json-prices.js` |
| `check_seafood.js` | Diagnostic des fiches contenant des fruits de mer | `node scripts/check_seafood.js` |
| `analyze_recipes.js` | Analyse statistique complète du catalogue | `node scripts/analyze_recipes.js` |
