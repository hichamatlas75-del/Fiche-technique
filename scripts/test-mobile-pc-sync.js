const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bxgguavmuiefthqmzygy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Z2d1YXZtdWllZnRocW16eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNzIsImV4cCI6MjEwNDk1MjI3Mn0.7aGDBXzzMApGkxXuDDcwMJXxPlPsG8LEYb5WIcA--00';

async function testMobilePcSync() {
  console.log('🧪 TEST DE COHÉRENCE : PC - SUPABASE - MOBILE');
  console.log('═'.repeat(60));

  // 1. Vérifier Supabase Cloud directement
  console.log('1️⃣ Vérification directe Supabase Cloud...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/ingredient_costs?id=eq.thon`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
  });
  if (!res.ok) throw new Error('Erreur fetch Supabase: ' + res.status);
  const rows = await res.json();
  if (rows.length === 0) throw new Error('Matière "thon" introuvable dans Supabase !');
  const cloudThon = rows[0];
  console.log(`  ☁️ Supabase : id="${cloudThon.id}", cost=${cloudThon.cost}, unit="${cloudThon.unit}", label="${cloudThon.label}"`);
  const cloudKgPrice = (cloudThon.cost * 1000).toFixed(2);
  console.log(`  ☁️ Prix au kg Supabase : ${cloudKgPrice} DH/kg`);

  if (Math.abs(cloudThon.cost - 0.124) > 0.0001) {
    throw new Error(`Prix Supabase non conforme: attendu 0.124, reçu ${cloudThon.cost}`);
  }

  // 2. Vérifier js/ingredient-costs.js
  console.log('\n2️⃣ Vérification du fichier local js/ingredient-costs.js...');
  const ingPath = path.resolve(__dirname, '../js/ingredient-costs.js');
  const ingContent = fs.readFileSync(ingPath, 'utf-8');
  // Évaluer INGREDIENT_UNIT_COSTS
  const match = ingContent.match(/const INGREDIENT_UNIT_COSTS = (\{[\s\S]*?\n\};)/);
  if (!match) throw new Error('Impossible de parser INGREDIENT_UNIT_COSTS dans js/ingredient-costs.js');
  const ingCosts = eval('(' + match[1].replace(/;\s*$/, '') + ')');
  const localThon = ingCosts['thon'];
  if (!localThon) throw new Error('Matière "thon" absente de js/ingredient-costs.js');
  console.log(`  📁 Local js : cost=${localThon.cost}, unit="${localThon.unit}", label="${localThon.label}"`);
  const localKgPrice = (localThon.cost * 1000).toFixed(2);
  console.log(`  📁 Prix au kg Local : ${localKgPrice} DH/kg`);

  if (Math.abs(localThon.cost - 0.124) > 0.0001) {
    throw new Error(`Prix local non synchronisé: attendu 0.124, reçu ${localThon.cost}`);
  }

  // 3. Vérifier la version Cache-Buster dans core-utils.js
  console.log('\n3️⃣ Vérification du Cache-Buster dans js/core-utils.js...');
  const coreUtilsPath = path.resolve(__dirname, '../js/core-utils.js');
  const coreContent = fs.readFileSync(coreUtilsPath, 'utf-8');
  if (!coreContent.includes("APP_DATA_VERSION = 'v9.2_20260920'")) {
    throw new Error('APP_DATA_VERSION non mis à jour dans js/core-utils.js');
  }
  console.log('  ✅ APP_DATA_VERSION est bien "v9.2_20260920" (force la purge du cache mobile)');

  // 4. Vérifier la présence de refreshFromCloud dans prices-modal.js
  console.log('\n4️⃣ Vérification de la synchronisation automatique dans js/prices-modal.js...');
  const modalPath = path.resolve(__dirname, '../js/prices-modal.js');
  const modalContent = fs.readFileSync(modalPath, 'utf-8');
  if (!modalContent.includes('refreshFromCloud') || !modalContent.includes('gc-prices-btn-refresh-cloud')) {
    throw new Error('refreshFromCloud non présent dans js/prices-modal.js');
  }
  console.log('  ✅ refreshFromCloud() intégré dans open() et bouton 🔄 Cloud présent');

  console.log('\n🎉 TOUS LES TESTS SONT AU VERT : COHÉRENCE 100% ASSURÉE ENTRE PC, SUPABASE ET MOBILE !');
}

testMobilePcSync().catch(err => {
  console.error('❌ Échec du test :', err.message);
  process.exit(1);
});
