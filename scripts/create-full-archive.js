const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bxgguavmuiefthqmzygy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Z2d1YXZtdWllZnRocW16eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNzIsImV4cCI6MjEwNDk1MjI3Mn0.7aGDBXzzMApGkxXuDDcwMJXxPlPsG8LEYb5WIcA--00';

const ROOT_DIR = path.resolve(__dirname, '..');
const ARCHIVE_DIR = path.join(ROOT_DIR, 'archives_locales_backup');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function runArchive() {
  console.log('📦 Démarrage de l\'archivage complet de sécurité...');
  const startTime = new Date();

  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }

  // 1. Copie des fichiers de code et de données locaux
  console.log('1️⃣ Copie des fichiers de référence locaux...');
  
  // recipes-data.js
  const recipesSrc = path.join(ROOT_DIR, 'recipes-data.js');
  if (fs.existsSync(recipesSrc)) {
    fs.copyFileSync(recipesSrc, path.join(ARCHIVE_DIR, 'recipes-data.js'));
    console.log('  ✅ recipes-data.js copié');
  }

  // js/ingredient-costs.js
  const ingDir = path.join(ARCHIVE_DIR, 'js');
  if (!fs.existsSync(ingDir)) fs.mkdirSync(ingDir, { recursive: true });
  const ingSrc = path.join(ROOT_DIR, 'js', 'ingredient-costs.js');
  if (fs.existsSync(ingSrc)) {
    fs.copyFileSync(ingSrc, path.join(ingDir, 'ingredient-costs.js'));
    console.log('  ✅ js/ingredient-costs.js copié');
  }

  // scripts/food_cost_summary.json
  const fcSrc = path.join(ROOT_DIR, 'scripts', 'food_cost_summary.json');
  if (fs.existsSync(fcSrc)) {
    fs.copyFileSync(fcSrc, path.join(ARCHIVE_DIR, 'food_cost_summary.json'));
    console.log('  ✅ food_cost_summary.json copié');
  }

  // scripts/caisse_products_summary.json
  const caisseSrc = path.join(ROOT_DIR, 'scripts', 'caisse_products_summary.json');
  if (fs.existsSync(caisseSrc)) {
    fs.copyFileSync(caisseSrc, path.join(ARCHIVE_DIR, 'caisse_products_summary.json'));
    console.log('  ✅ caisse_products_summary.json copié');
  }

  // Dossier ventes/
  const ventesSrc = path.join(ROOT_DIR, 'ventes');
  const ventesDest = path.join(ARCHIVE_DIR, 'ventes');
  if (fs.existsSync(ventesSrc)) {
    copyDirRecursive(ventesSrc, ventesDest);
    const ventesCount = fs.readdirSync(ventesDest).length;
    console.log(`  ✅ ventes/ copié (${ventesCount} fichiers/dossiers archivés)`);
  }

  // 2. Extraction complète depuis Supabase Cloud
  console.log('2️⃣ Extraction directe des données Supabase Cloud...');
  const headers = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };

  const [resRec, resIng, resSales] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/recipes?select=*&order=name.asc`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/ingredient_costs?select=*&order=id.asc`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/daily_sales?select=*&order=sale_date.asc`, { headers })
  ]);

  if (!resRec.ok) throw new Error('Échec extraction recipes: ' + resRec.status);
  if (!resIng.ok) throw new Error('Échec extraction ingredient_costs: ' + resIng.status);
  if (!resSales.ok) throw new Error('Échec extraction daily_sales: ' + resSales.status);

  const recipes = await resRec.json();
  const ingredients = await resIng.json();
  const sales = await resSales.json();

  fs.writeFileSync(path.join(ARCHIVE_DIR, 'supabase_recipes_snapshot.json'), JSON.stringify(recipes, null, 2), 'utf-8');
  fs.writeFileSync(path.join(ARCHIVE_DIR, 'supabase_ingredient_costs_snapshot.json'), JSON.stringify(ingredients, null, 2), 'utf-8');
  fs.writeFileSync(path.join(ARCHIVE_DIR, 'supabase_daily_sales_snapshot.json'), JSON.stringify(sales, null, 2), 'utf-8');

  console.log(`  ✅ Supabase Recipes archivées : ${recipes.length} fiches`);
  console.log(`  ✅ Supabase Ingredient Costs archivés : ${ingredients.length} matières`);
  console.log(`  ✅ Supabase Daily Sales archivées : ${sales.length} journées`);

  // 3. Écriture du README d'archive
  const readmeContent = `# Archive de Sécurité des Données Locales & Snapshot Cloud Supabase

Date d'archivage : ${startTime.toISOString()}
Auteur : Agent Antigravity / Direction Grey Corner

## Pourquoi cette archive ?
L'application Grey Corner a été migrée vers une **architecture 100% Supabase Cloud (Single Source of Truth)**.
Tous les appareils (PC et Mobile) s'alimentent et écrivent désormais directement sur Supabase Cloud sans dépendance envers les fichiers JavaScript ou Excel locaux.

Cette archive a été constituée à la demande de l'utilisateur ("au cas où") pour préserver l'état exact des fichiers locaux et un snapshot complet de la base Supabase avant le basculement complet.

## Contenu de l'archive :
1. **recipes-data.js** : Copie intégrale du fichier local historique des fiches techniques.
2. **js/ingredient-costs.js** : Copie intégrale de la mercuriale locale des coûts d'achat.
3. **ventes/** : Tous les fichiers Excel historiques (.xlsx) et \`manifest.json\`.
4. **food_cost_summary.json** & **caisse_products_summary.json** : Synthèses analytiques pré-calculées.
5. **supabase_recipes_snapshot.json** : Export JSON complet de la table \`recipes\` (${recipes.length} fiches).
6. **supabase_ingredient_costs_snapshot.json** : Export JSON complet de la table \`ingredient_costs\` (${ingredients.length} matières).
7. **supabase_daily_sales_snapshot.json** : Export JSON complet de la table \`daily_sales\` (${sales.length} journées de ventes).

## Restauration d'urgence (si nécessaire) :
- Pour restaurer la base locale : copier les fichiers de cette archive vers la racine du projet.
- Pour réinjecter les données dans Supabase Cloud : utiliser le script \`scripts/sync-supabase.js\` avec les snapshots JSON ci-dessus.
`;

  fs.writeFileSync(path.join(ARCHIVE_DIR, 'README.md'), readmeContent, 'utf-8');
  console.log('  ✅ README.md créé');

  console.log('\n🎉 Archivage de sécurité terminé avec succès à 100% !');
}

runArchive().catch(err => {
  console.error('❌ Erreur lors de l\'archivage:', err);
  process.exit(1);
});
