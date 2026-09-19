# Archive de Sécurité des Données Locales & Snapshot Cloud Supabase

Date d'archivage : 2026-09-19T17:48:03.224Z
Auteur : Agent Antigravity / Direction Grey Corner

## Pourquoi cette archive ?
L'application Grey Corner a été migrée vers une **architecture 100% Supabase Cloud (Single Source of Truth)**.
Tous les appareils (PC et Mobile) s'alimentent et écrivent désormais directement sur Supabase Cloud sans dépendance envers les fichiers JavaScript ou Excel locaux.

Cette archive a été constituée à la demande de l'utilisateur ("au cas où") pour préserver l'état exact des fichiers locaux et un snapshot complet de la base Supabase avant le basculement complet.

## Contenu de l'archive :
1. **recipes-data.js** : Copie intégrale du fichier local historique des fiches techniques.
2. **js/ingredient-costs.js** : Copie intégrale de la mercuriale locale des coûts d'achat.
3. **ventes/** : Tous les fichiers Excel historiques (.xlsx) et `manifest.json`.
4. **food_cost_summary.json** & **caisse_products_summary.json** : Synthèses analytiques pré-calculées.
5. **supabase_recipes_snapshot.json** : Export JSON complet de la table `recipes` (289 fiches).
6. **supabase_ingredient_costs_snapshot.json** : Export JSON complet de la table `ingredient_costs` (415 matières).
7. **supabase_daily_sales_snapshot.json** : Export JSON complet de la table `daily_sales` (171 journées de ventes).

## Restauration d'urgence (si nécessaire) :
- Pour restaurer la base locale : copier les fichiers de cette archive vers la racine du projet.
- Pour réinjecter les données dans Supabase Cloud : utiliser le script `scripts/sync-supabase.js` avec les snapshots JSON ci-dessus.
