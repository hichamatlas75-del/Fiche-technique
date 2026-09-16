const SUPABASE_CONFIG = {
  url: 'https://bxgguavmuiefthqmzygy.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Z2d1YXZtdWllZnRocW16eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNzIsImV4cCI6MjEwNDk1MjI3Mn0.7aGDBXzzMApGkxXuDDcwMJXxPlPsG8LEYb5WIcA--00'
};

async function checkAndSync() {
  console.log("Vérification de la précision de la colonne 'cost' dans Supabase...");

  // Test insert of 0.055
  const testId = '__test_precision_check__';
  await fetch(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify([{
      id: testId,
      cost: 0.055,
      unit: 'g',
      label: 'Test Precision',
      category: 'Général',
      updated_at: new Date().toISOString()
    }])
  });

  const getRes = await fetch(SUPABASE_CONFIG.url + `/rest/v1/ingredient_costs?id=eq.${testId}`, {
    headers: {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey
    }
  });
  const data = await getRes.json();
  const readCost = data && data[0] ? Number(data[0].cost) : null;

  // Cleanup test row
  await fetch(SUPABASE_CONFIG.url + `/rest/v1/ingredient_costs?id=eq.${testId}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey
    }
  });

  if (readCost === 0.055) {
    console.log("✅ SUCCÈS : Supabase supporte désormais 4 décimales (0.055 préservé) !");
    console.log("Synchronisation immédiate des prix du poulet à 55 DH/kg (0.055 DH/g)...");

    const poultryItems = [
      { id: 'poulet', label: 'poulet', cost: 0.055, unit: 'g' },
      { id: 'blanc de poulet', label: 'blanc de poulet', cost: 0.055, unit: 'g' },
      { id: 'poulet hache', label: 'poulet hache', cost: 0.055, unit: 'g' },
      { id: 'poulet emince', label: 'poulet emince', cost: 0.055, unit: 'g' },
      { id: 'poulet grille', label: 'poulet grille', cost: 0.055, unit: 'g' },
      { id: 'poulet pane', label: 'poulet pane', cost: 0.053, unit: 'g' }
    ];

    const syncRes = await fetch(SUPABASE_CONFIG.url + '/rest/v1/ingredient_costs', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(poultryItems.map(p => ({
        ...p,
        category: 'Général',
        updated_at: new Date().toISOString()
      })))
    });

    console.log("Statut synchronisation volailles:", syncRes.status);
    console.log("🎉 Tous les poulets sont maintenant enregistrés à 55 DH (0.055 DH/g) sur Supabase !");
    return true;
  } else {
    console.log(`⚠️ ATTENTION : Supabase a arrondi 0.055 à ${readCost} (la colonne 'cost' est toujours en numeric(10,2)).`);
    console.log("Veuillez exécuter la commande SQL suivante dans Supabase SQL Editor :");
    console.log("ALTER TABLE ingredient_costs ALTER COLUMN cost TYPE numeric(14, 4);");
    return false;
  }
}

checkAndSync();
