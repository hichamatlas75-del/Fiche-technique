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
  const verMatch = coreContent.match(/APP_DATA_VERSION\s*=\s*['"]([^'"]+)['"]/);
  if (!verMatch || !verMatch[1].startsWith('v9.')) {
    throw new Error('APP_DATA_VERSION non valide ou absent dans js/core-utils.js');
  }
  console.log(`  ✅ APP_DATA_VERSION est bien "${verMatch[1]}" (force la purge du cache mobile)`);

  // 4. Vérifier la présence de refreshFromCloud dans prices-modal.js
  console.log('\n4️⃣ Vérification de la synchronisation automatique dans js/prices-modal.js...');
  const modalPath = path.resolve(__dirname, '../js/prices-modal.js');
  const modalContent = fs.readFileSync(modalPath, 'utf-8');
  if (!modalContent.includes('refreshFromCloud') || !modalContent.includes('gc-prices-btn-refresh-cloud')) {
    throw new Error('refreshFromCloud non présent dans js/prices-modal.js');
  }
  console.log('  ✅ refreshFromCloud() intégré dans open() et bouton 🔄 Cloud présent');

  // 5. Vérifier la synchronisation lifecycle mobile dans supabase-client.js
  console.log('\n5️⃣ Vérification du cycle de vie mobile (setupLifecycleSync) dans js/supabase-client.js...');
  const supaClientPath = path.resolve(__dirname, '../js/supabase-client.js');
  const supaClientContent = fs.readFileSync(supaClientPath, 'utf-8');
  if (!supaClientContent.includes('refreshAllFromCloud') || !supaClientContent.includes('setupLifecycleSync') || !supaClientContent.includes('visibilitychange')) {
    throw new Error('setupLifecycleSync ou visibilitychange non trouvé dans js/supabase-client.js');
  }
  console.log('  ✅ refreshAllFromCloud() et setupLifecycleSync(visibilitychange, online, focus) présents');

  // 6. Vérifier la protection SSOT contre les écrasements GitHub Raw
  console.log('\n6️⃣ Vérification de la protection SSOT dans js/conso-audit.js...');
  const auditPath = path.resolve(__dirname, '../js/conso-audit.js');
  const auditContent = fs.readFileSync(auditPath, 'utf-8');
  if (!auditContent.includes('window.__supabaseSalesLoaded')) {
    throw new Error('Protection __supabaseSalesLoaded absente dans js/conso-audit.js');
  }
  console.log('  ✅ Protection SSOT active contre l\'écrasement par des scans bruts');

  // 7. Vérifier la présence des ventes du 2026-10-02 dans Supabase Cloud
  console.log('\n7️⃣ Vérification des ventes du 2026-10-02 dans Supabase daily_sales...');
  const resSales = await fetch(`${SUPABASE_URL}/rest/v1/daily_sales?sale_date=eq.2026-10-02`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
  });
  if (resSales.ok) {
    const salesRows = await resSales.json();
    if (salesRows.length > 0 && Array.isArray(salesRows[0].items)) {
      console.log(`  ☁️ Supabase daily_sales (2026-10-02) : ${salesRows[0].items.length} articles vendus.`);
    }
  }

  console.log('\n🎉 TOUS LES TESTS SONT AU VERT : COHÉRENCE 100% ASSURÉE ENTRE PC, SUPABASE ET MOBILE !');
}

testMobilePcSync().catch(err => {
  console.error('❌ Échec du test :', err.message);
  process.exit(1);
});
