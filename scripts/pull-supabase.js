const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bxgguavmuiefthqmzygy.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Z2d1YXZtdWllZnRocW16eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNzIsImV4cCI6MjEwNDk1MjI3Mn0.7aGDBXzzMApGkxXuDDcwMJXxPlPsG8LEYb5WIcA--00';

function cleanText(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function pullData() {
  console.log('📡 Récupération des données depuis Supabase Cloud...');

  const [resIng, resRec] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/ingredient_costs?select=*&order=updated_at.asc`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
    }),
    fetch(`${SUPABASE_URL}/rest/v1/recipes?is_active=eq.true&select=*&order=updated_at.asc`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
    })
  ]);

  if (!resIng.ok) throw new Error('Erreur fetch ingredient_costs: ' + resIng.status);
  if (!resRec.ok) throw new Error('Erreur fetch recipes: ' + resRec.status);

  const cloudIngredients = await resIng.json();
  const cloudRecipes = await resRec.json();

  console.log(`✅ Supabase : ${cloudIngredients.length} matières premières et ${cloudRecipes.length} fiches techniques récupérées.`);

  // 1. Mettre à jour js/ingredient-costs.js
  const ingCostsPath = path.resolve(__dirname, '../js/ingredient-costs.js');
  let ingCode = fs.readFileSync(ingCostsPath, 'utf-8');

  const ingCostsMap = {};
  cloudIngredients.forEach(item => {
    if (!item.id) return;
    ingCostsMap[item.id] = {
      cost: Number(item.cost) || 0,
      unit: item.unit || 'kg',
      label: item.label || item.id
    };
  });

  const markerIng = "const INGREDIENT_UNIT_COSTS = ";
  const startIdxIng = ingCode.indexOf(markerIng);
  const endIdxIng = ingCode.indexOf("function calculateRecipeFoodCost");

  if (startIdxIng !== -1 && endIdxIng !== -1) {
    const formattedIngs = JSON.stringify(ingCostsMap, null, 2);
    const newIngCode = ingCode.slice(0, startIdxIng + markerIng.length) + formattedIngs + ";\n\n" + ingCode.slice(endIdxIng);
    fs.writeFileSync(ingCostsPath, newIngCode, 'utf-8');
    console.log('✅ js/ingredient-costs.js mis à jour avec la mercuriale Supabase Cloud !');
  }

  // 2. Mettre à jour recipes-data.js
  const recipesDataPath = path.resolve(__dirname, '../recipes-data.js');
  const recipesModule = require(recipesDataPath);
  const localDATA = recipesModule.DATA || [];
  const localBASE = recipesModule.BASE_RECIPES || [];

  const latestCloudRecipes = new Map();
  cloudRecipes.forEach(r => {
    if (!r.name) return;
    latestCloudRecipes.set(cleanText(r.name), r);
  });

  console.log(`📊 ${latestCloudRecipes.size} fiches techniques uniques validées.`);

  latestCloudRecipes.forEach(cloudR => {
    const cName = cleanText(cloudR.name);
    let foundInDATA = false;
    for (const cat of localDATA) {
      const item = (cat.items || []).find(it => cleanText(it.name) === cName);
      if (item) {
        item.tech = Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : item.tech;
        item.ingredients = item.tech.slice();
        item.sellPrice = Number(cloudR.sell_price) || item.sellPrice || 0;
        item.price = item.sellPrice + ' DH';
        item.cost = Number(cloudR.cost) || item.cost || 0;
        item.foodCost = Number(cloudR.food_cost) || item.foodCost || 0;
        item.grossMarginDH = Number(cloudR.gross_margin) || item.grossMarginDH || 0;
        foundInDATA = true;
        break;
      }
    }
    if (!foundInDATA) {
      let targetCat = localDATA.find(c => c.category === cloudR.category);
      if (!targetCat) {
        targetCat = localDATA.find(c => c.category === 'AUTRE' || c.category === 'DIVERS');
      }
      if (!targetCat) {
        targetCat = { category: cloudR.category || 'AUTRE', key: 'autre', color: '#64748b', items: [] };
        localDATA.push(targetCat);
      }
      targetCat.items.push({
        name: cloudR.name,
        image: 'images/placeholder.svg',
        prepTime: 5,
        tech: Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : [],
        ingredients: Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : [],
        price: (cloudR.sell_price || 0) + ' DH',
        sellPrice: Number(cloudR.sell_price) || 0,
        cost: Number(cloudR.cost) || 0,
        foodCost: Number(cloudR.food_cost) || 0,
        grossMarginDH: Number(cloudR.gross_margin) || 0,
        margin: cloudR.sell_price > 0 ? Math.round(((cloudR.sell_price - cloudR.cost) / cloudR.sell_price) * 1000) / 10 : 0
      });
    }
  });

  latestCloudRecipes.forEach(cloudR => {
    const cName = cleanText(cloudR.name);
    let baseItem = localBASE.find(b => b && (b.id === cloudR.id || cleanText(b.name) === cName));
    if (baseItem) {
      baseItem.ingredients = Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : baseItem.ingredients;
      baseItem.tech = baseItem.ingredients.slice();
      baseItem.category = cloudR.category || baseItem.category;
    } else {
      localBASE.push({
        id: cloudR.id || ('rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)),
        name: cloudR.name,
        category: cloudR.category || 'AUTRE',
        ingredients: Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : [],
        tech: Array.isArray(cloudR.ingredients) ? cloudR.ingredients.slice() : []
      });
    }
  });

  let recipesCode = fs.readFileSync(recipesDataPath, 'utf-8');
  const section1Marker = "const DATA = ";
  const section2Marker = "const BASE_RECIPES = ";
  const section3Marker = "const ALIAS_MAP = ";

  const dataStart = recipesCode.indexOf(section1Marker);
  const baseStart = recipesCode.indexOf(section2Marker);
  const aliasStart = recipesCode.indexOf(section3Marker);

  if (dataStart !== -1 && baseStart !== -1 && aliasStart !== -1) {
    const part1 = recipesCode.slice(0, dataStart + section1Marker.length);
    const formattedDATA = JSON.stringify(localDATA, null, 2);
    const part2 = "\n\n" + section2Marker;
    const formattedBASE = JSON.stringify(localBASE, null, 2);
    const part3 = ";\n\n" + recipesCode.slice(aliasStart);

    const newRecipesCode = part1 + formattedDATA + ";" + part2 + formattedBASE + part3;
    fs.writeFileSync(recipesDataPath, newRecipesCode, 'utf-8');
    console.log('✅ recipes-data.js synchronisé avec succès depuis Supabase Cloud !');
  }

  console.log('🎉 Synchronisation Cloud -> Fichiers locaux terminée avec succès !');
}

pullData().catch(console.error);
