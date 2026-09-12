# GREY CORNER — Guide Watcher Ventes

## 📋 Comment ça marche

Le système est composé de 2 éléments qui fonctionnent ensemble :

### 1. `watcher_ventes.ps1` — Script PowerShell (tourne en arrière-plan)
Lance-le **une seule fois** sur le PC du bureau :
```powershell
powershell -ExecutionPolicy Bypass -File watcher_ventes.ps1
```
Il surveille ce dossier 24h/24. Quand votre logiciel de caisse dépose un export à la fermeture, il le convertit **automatiquement** en `ventes_du_jour.json`.

### 2. `SYNTHESE_DECISIONNELLE_MENU.html` — Le tableau de bord
Ouvrez-le dans le navigateur, cliquez sur **"⬇️ Charger Ventes du Jour"** pour importer le fichier JSON généré.

---

## 🚫 EXCLUSION STRICTE : Ancien Menu (Janvier, Février, Mars 2026)

Le menu actuel de **193 références** est entré en vigueur le **01 Avril 2026** (période post-mars de 162 jours).  
Pour protéger la fiabilité des ratios, de la marge et des seuils décisionnels :

- **Rejet automatique des fichiers anciens** : Tout fichier dont le nom ou le dossier indique **Janvier (2026-01)**, **Février (2026-02)** ou **Mars (2026-03)** est automatiquement bloqué et ignoré.
- **Filtrage par ligne** : Si un fichier contient une colonne Date avec des ventes antérieures au `01/04/2026`, ces lignes sont éliminées.
- **Liste noire des articles de l'ancien menu** : Les anciens plats disparus (ex: *Miel, 2 Oeufs, Omlette FR Charcuterie, Café Personnel, Café Séparé, Boules de glace...*) sont écartés et ne polluent pas la carte actuelle.
- **Protection côté application** : L'interface `SYNTHESE_DECISIONNELLE_MENU.html` bloque également toute tentative de chargement de ventes antérieures au 01 Avril 2026.

---

## 📁 Structure du Dossier

```
ventes/
├── watcher_ventes.ps1          ← Script à lancer 1 fois (avec filtrage ancien menu)
├── FORMAT_ATTENDU_EXEMPLE.json ← Exemple du format attendu
├── LISEZ_MOI.md                ← Ce fichier
├── ventes_du_jour.json         ← Généré automatiquement (écrasé chaque soir)
└── logs/
    ├── watcher_2026-09.log     ← Journal mensuel des événements
    └── archives/
        ├── ventes_2026-09-11.json  ← Archives historiques
        └── ventes_2026-09-12.json
```

---

## 📊 Format de votre Export Caisse (XLSX)

Votre fichier Excel doit avoir **au minimum** deux colonnes :

| Colonne "Article" | Colonne "Quantite" |
|---|---|
| CAFE NOIR | 187 |
| FASSI | 42 |
| PIZZA FRUITS DE MER | 16 |

> **Noms de colonnes acceptés :** Article, Plat, Designation, Libelle, Item, Nom, Produit  
> **Colonnes quantité acceptées :** Quantite, Qty, Qte, Vente, Vendu, Count, Nb

---

## ✅ Format JSON Attendu (si export direct JSON)

```json
[
  { "id": "bc60875d", "qty_journee": 42 },
  { "id": "2870e2fd", "qty_journee": 187 }
]
```

Les `id` correspondent aux identifiants internes des 193 plats. Le watcher fait le mapping automatiquement depuis les noms.

---

## ⚠️ En cas de plat non reconnu

Le watcher logge les plats non trouvés :
```
[2026-09-12 22:05:11] ⚠ Article non reconnu (ignoré) : 'COUSCOUS ROYAL'
```

Si un plat nouveau est créé, ajoutez son nom dans le dictionnaire `$MENU_NAME_TO_ID` du script watcher.
