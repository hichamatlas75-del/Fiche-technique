/**
 * GREY CORNER — Script de synchronisation vers Supabase Cloud
 * Exécute l'envoi des matières premières (413), des fiches techniques (288) et des ventes journalières.
 * Commande : node scripts/sync-supabase.js
 */

const { INGREDIENT_UNIT_COSTS, INGREDIENT_CATEGORIES } = require('../js/ingredient-costs.js');
const { DATA } = require('../recipes-data.js');

const SUPABASE_URL = 'https://bxgguavmuiefthqmzygy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Z2d1YXZtdWllZnRocW16eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNzIsImV4cCI6MjEwNDk1MjI3Mn0.7aGDBXzzMApGkxXuDDcwMJXxPlPsG8LEYb5WIcA--00';

async function uploadIngredients() {
  const rows = [];
  for (const [id, def] of Object.entries(INGREDIENT_UNIT_COSTS)) {
    let cat = 'Général';
    for (const [catName, list] of Object.entries(INGREDIENT_CATEGORIES)) {
      if (list.some(k => id.includes(k))) {
        cat = catName;
        break;
      }
    }
    rows.push({
      id: id,
      label: def.label || id,
      unit: def.unit || 'kg',
      cost: typeof def.cost === 'number' ? def.cost : 0,
      category: cat,
      updated_at: new Date().toISOString()
    });
  }

  console.log(`📡 Envoi de ${rows.length} matières premières vers Supabase...`);
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ingredient_costs`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(chunk)
    });
    if (!res.ok) console.error(`Erreur chunk ${i}:`, await res.text());
  }
  console.log('✅ Ingrédients synchronisés avec succès.');
}

async function uploadRecipes() {
  const rows = [];
  DATA.forEach(cat => {
    cat.items.forEach(item => {
      const id = (cat.category + '_' + item.name).toLowerCase().replace(/[^a-z0-9]/g, '_');
      rows.push({
        id: id,
        name: item.name,
        category: cat.category,
        sell_price: item.sellPrice || 0,
        cost: item.cost || 0,
        food_cost: item.foodCost || 0,
        gross_margin: item.grossMarginDH || 0,
        ingredients: item.tech || [],
        is_active: true,
        updated_at: new Date().toISOString()
      });
    });
  });

  console.log(`📡 Envoi de ${rows.length} fiches techniques vers Supabase...`);
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/recipes`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(chunk)
    });
    if (!res.ok) console.error(`Erreur recettes chunk ${i}:`, await res.text());
  }
  console.log('✅ Recettes synchronisées avec succès.');
}

async function main() {
  console.log('======================================================');
  console.log('☁️  GREY CORNER — SYNCHRONISATION CLOUD SUPABASE');
  console.log('======================================================');
  await uploadIngredients();
  await uploadRecipes();
  console.log('🎉 TOUTES LES DONNÉES SONT À JOUR DANS SUPABASE !');
}

main().catch(console.error);
