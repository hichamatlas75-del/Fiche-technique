/**
 * GREY CORNER — Comparateur Temporel (Jours, Semaines, Mois & Tendances)
 * Module: conso-temporal.js
 */

/* ========================================================
   11.C COMPARATEUR TEMPOREL (JOUR DE SEMAINE, SEMAINE, MOIS)
/* ========================================================
   COMPARATEUR TEMPOREL MULTI-PÉRIODES & AIDE À LA DÉCISION MÉTIER
======================================================== */
var comparatorMode = 'dayofweek'; // 'dayofweek', 'week', 'month'
var comparatorCategoryFilter = 'all';
var comparatorDatePreset = 'all'; // 'all', 'thismonth', 'prevmonth', 'last30', 'quarter', 'custom'
var comparatorCustomStartDate = '';
var comparatorCustomEndDate = '';

// Helper Métier : Exclut les boissons (cafés, sodas, jus, eaux), extras, suppléments, à la carte et divers pour concentrer l'analyse 100% sur la Cuisine
function isExcludedFromLeastSold(productName, familyName) {
  if (!productName) return true;
  const raw = `${productName} ${familyName || ''}`.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const normFamily = (familyName || '').toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Détection via catégorie standard (boisson)
  if (typeof detectProductCategory === 'function') {
    const cat = detectProductCategory(productName, familyName, null);
    if (cat === 'boisson') return true;
  }

  // 2. Famille / Rayon Boissons & Bar
  if (normFamily.includes('boisson') || normFamily.includes('bar') || 
      normFamily.includes('cafe') || normFamily.includes('jus') || 
      normFamily.includes('soda') || normFamily.includes('eau') || 
      normFamily.includes('drink') || normFamily.includes('cocktail') || 
      normFamily.includes('chaude')) {
    return true;
  }

  // 3. Cafés, Thés et Boissons Chaudes (Café le plus vendu en restauration, à exclure de la cuisine)
  if (/\bcafe\b/.test(raw) || /\bcafes\b/.test(raw) ||
      raw.includes('espresso') || raw.includes('expresso') || 
      raw.includes('cappuccino') || raw.includes('latte') || 
      raw.includes('macchiato') || raw.includes('americano') || 
      raw.includes('nespresso') || raw.includes('nescafe') ||
      raw.includes('allonge') || raw.includes('ristretto') ||
      raw.includes('moka') || raw.includes('chocolat chaud') || 
      raw.includes('chocolat viennois') || raw.includes('matcha') ||
      raw.includes('infusion') || raw.includes('tisane') ||
      /\bthe\b/.test(raw) || /\bthes\b/.test(raw) || 
      raw.includes('the a la menthe') || raw.includes('the vert') || raw.includes('the noir')) {
    return true;
  }

  // 4. Eaux, Sodas industriels de négoce et Énergisants
  if (raw.includes('coca') || /\bcola\b/.test(raw) || raw.includes('pepsi') ||
      raw.includes('fanta') || raw.includes('sprite') || raw.includes('hawai') || 
      raw.includes('poms') || raw.includes('schweppes') || raw.includes('orangina') || 
      raw.includes('seven up') || raw.includes('7up') || raw.includes('canette') || 
      raw.includes('soda') || raw.includes('red bull') || raw.includes('monster') ||
      raw.includes('sidi ali') || raw.includes('ain saiss') || raw.includes('oulmes') || 
      raw.includes('eau minerale') || raw.includes('eau gazeuse') || raw.includes('san pellegrino') ||
      raw.includes('perrier') || raw.includes('aquafina') || /\beau\b/.test(raw) || /\beaux\b/.test(raw)) {
    return true;
  }

  // 5. Jus, Smoothies, Milkshakes, Cocktails & Boissons Bar
  if (/\bjus\b/.test(raw) || raw.includes('jus d') || raw.includes('jus de') || 
      raw.includes('jus frais') || raw.includes('smoothie') || raw.includes('milkshake') || 
      raw.includes('milk shake') || raw.includes('cocktail') || raw.includes('mocktail') || 
      raw.includes('mojito') || raw.includes('frappe') || raw.includes('citronnade') || 
      raw.includes('orange pressee') || raw.includes('citron presse') || raw.includes('sirop') ||
      raw.includes('ice tea') || raw.includes('iced tea') || raw.includes('the glace')) {
    return true;
  }

  // 6. Divers Food / Divers Caisse
  if (/\bdivers\b/.test(raw) || raw.includes('divers food') || raw.includes('divers cuisine') || 
      raw.includes('article divers') || raw.includes('autre divers') || raw.includes('divers bar')) {
    return true;
  }

  // 7. Suppléments Cuisine, Extras & Add-ons
  if (raw.includes('suppliment') || raw.includes('supplement') || 
      /\bsupp\b/.test(raw) || /\bextra\b/.test(raw) ||
      raw.includes('supp ') || raw.includes('extra ') || raw.includes('extra-') ||
      raw.includes('suppliment cuisine') || raw.includes('supplement cuisine') || 
      raw.includes('supp cuisine') || raw.includes('extra cuisine') ||
      raw.includes('supplement frites') || raw.includes('extra steak') || 
      raw.includes('extra cheddar') || raw.includes('supplement sauce') || 
      raw.includes('extra pain') || raw.includes('extra fromage') || raw.includes('extra poulet')) {
    return true;
  }

  // 8. À la carte / Consommations Internes / Repas Personnel / Offerts
  if (raw.includes('a la carte') || raw.includes('consommation interne') || 
      raw.includes('personnel') || raw.includes('repas staff') || 
      raw.includes('staff') || raw.includes('offert') || raw.includes('gratuit')) {
    return true;
  }

  // 9. Menus Enfants & Formules Dédiées
  if (raw.includes('menu enfant') || raw.includes('formule enfant') || 
      raw.includes('kids menu') || /\bkids\b/.test(raw) || raw.includes('enfant')) {
    return true;
  }

  // 10. Suppléments Petit Déjeuner
  if (raw.includes('suppliment petit') || raw.includes('supplement petit') || 
      raw.includes('supp petit') || raw.includes('suppliment dej') || 
      raw.includes('supplement dej') || raw.includes('extra oeuf') || raw.includes('supplement miel')) {
    return true;
  }

  return false;
}

function setComparatorDatePreset(preset) {
  comparatorDatePreset = preset;
  renderComparatorTab();
}

function onComparatorDateInputChange() {
  const startInput = document.getElementById('comp-date-start');
  const endInput = document.getElementById('comp-date-end');
  if (startInput && endInput) {
    comparatorCustomStartDate = startInput.value;
    comparatorCustomEndDate = endInput.value;
    comparatorDatePreset = 'custom';
    renderComparatorTab();
  }
}

function applyComparatorCustomDateRange() {
  const startInput = document.getElementById('comp-date-start');
  const endInput = document.getElementById('comp-date-end');
  if (startInput && endInput) {
    comparatorCustomStartDate = startInput.value;
    comparatorCustomEndDate = endInput.value;
    comparatorDatePreset = 'custom';
    renderComparatorTab();
  }
}

function getComparatorSalesDataset() {
  const allDates = Object.keys(monthlySalesDB || {}).sort();
  if (allDates.length === 0) {
    return { dates: [], salesByDate: {}, scopeLabel: 'Aucune donnée', startDate: '', endDate: '' };
  }

  const minDate = allDates[0];
  const maxDate = allDates[allDates.length - 1];

  let startDate = minDate;
  let endDate = maxDate;

  if (comparatorDatePreset === 'all') {
    startDate = minDate;
    endDate = maxDate;
  } else if (comparatorDatePreset === 'thismonth') {
    const latestYM = maxDate.slice(0, 7);
    startDate = `${latestYM}-01`;
    endDate = `${latestYM}-31`;
  } else if (comparatorDatePreset === 'prevmonth') {
    const latestYM = maxDate.slice(0, 7);
    const [yStr, mStr] = latestYM.split('-');
    let y = parseInt(yStr, 10);
    let m = parseInt(mStr, 10) - 1;
    if (m === 0) {
      m = 12;
      y -= 1;
    }
    const prevYM = `${y}-${String(m).padStart(2, '0')}`;
    startDate = `${prevYM}-01`;
    endDate = `${prevYM}-31`;
  } else if (comparatorDatePreset === 'last30') {
    const dMax = new Date(maxDate + 'T00:00:00');
    dMax.setDate(dMax.getDate() - 29);
    startDate = dMax.toISOString().slice(0, 10);
    endDate = maxDate;
  } else if (comparatorDatePreset === 'quarter') {
    const dMax = new Date(maxDate + 'T00:00:00');
    dMax.setDate(dMax.getDate() - 89);
    startDate = dMax.toISOString().slice(0, 10);
    endDate = maxDate;
  } else if (comparatorDatePreset === 'custom') {
    startDate = comparatorCustomStartDate || minDate;
    endDate = comparatorCustomEndDate || maxDate;
  }

  // Filtrage strict des dates comprises dans l'intervalle
  let activeDates = allDates.filter(d => {
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  });

  const salesByDate = {};
  activeDates.forEach(d => {
    salesByDate[d] = monthlySalesDB[d] || [];
  });

  let scopeLabel = '';
  if (activeDates.length === 0) {
    scopeLabel = `Aucune vente entre le ${formatDateFR(startDate)} et le ${formatDateFR(endDate)}`;
  } else if (comparatorDatePreset === 'all') {
    scopeLabel = `Toute la Période (${formatDateFR(activeDates[0])} — ${formatDateFR(activeDates[activeDates.length - 1])})`;
  } else if (comparatorDatePreset === 'thismonth') {
    scopeLabel = `Mois en cours (${formatMonthFR(startDate.slice(0, 7))})`;
  } else if (comparatorDatePreset === 'prevmonth') {
    scopeLabel = `Mois Précédent (${formatMonthFR(startDate.slice(0, 7))})`;
  } else if (comparatorDatePreset === 'last30') {
    scopeLabel = `30 Derniers Jours (${formatDateFR(startDate)} — ${formatDateFR(endDate)})`;
  } else if (comparatorDatePreset === 'quarter') {
    scopeLabel = `Dernier Trimestre (${formatDateFR(startDate)} — ${formatDateFR(endDate)})`;
  } else {
    scopeLabel = `Période Libre (${formatDateFR(startDate)} — ${formatDateFR(endDate)})`;
  }

  return { dates: activeDates, salesByDate, scopeLabel, startDate, endDate };
}

// 1. Calcul Statistiques par Jour de la Semaine (Lun - Dim)
function computeDayOfWeekStats(dataset, categoryFilter) {
  const days = [
    { dow: 1, name: 'Lundi', short: 'Lun', icon: '☕' },
    { dow: 2, name: 'Mardi', short: 'Mar', icon: '🍽️' },
    { dow: 3, name: 'Mercredi', short: 'Mer', icon: '🥗' },
    { dow: 4, name: 'Jeudi', short: 'Jeu', icon: '🥘' },
    { dow: 5, name: 'Vendredi', short: 'Ven', icon: '🎉' },
    { dow: 6, name: 'Samedi', short: 'Sam', icon: '🌟' },
    { dow: 0, name: 'Dimanche', short: 'Dim', icon: '🥞' }
  ];

  const map = {};
  days.forEach(d => {
    map[d.dow] = {
      ...d,
      occurrences: new Set(),
      totalCA: 0,
      totalQty: 0,
      products: {}
    };
  });

  dataset.dates.forEach(dStr => {
    const dObj = new Date(dStr + 'T00:00:00');
    const dow = dObj.getDay();
    const target = map[dow];
    if (!target) return;

    const sales = dataset.salesByDate[dStr] || [];
    let hasMatchingSale = false;

    sales.forEach(s => {
      if (categoryFilter !== 'all') {
        const cat = detectProductCategory(s.product, s.family, s.matchedRecipe);
        if (cat !== categoryFilter) return;
      }
      hasMatchingSale = true;
      const q = parseFloat(s.qty) || 0;
      const p = parseFloat(s.price) || 0;
      const t = parseFloat(s.total) || (q * p);
      target.totalCA += t;
      target.totalQty += q;

      if (!target.products[s.product]) {
        target.products[s.product] = { product: s.product, family: s.family || '', qty: 0, total: 0 };
      }
      target.products[s.product].qty += q;
      target.products[s.product].total += t;
    });

    if (hasMatchingSale || categoryFilter === 'all') {
      target.occurrences.add(dStr);
    }
  });

  let grandTotalCA = 0;
  let grandTotalQty = 0;
  let totalActiveDays = 0;

  const resultList = days.map(d => {
    const data = map[d.dow];
    const occCount = data.occurrences.size;
    const avgCA = occCount > 0 ? data.totalCA / occCount : 0;
    const avgQty = occCount > 0 ? data.totalQty / occCount : 0;

    let topProduct = null;
    let leastProduct = null;
    const prods = Object.values(data.products).filter(p => p.qty > 0);
    if (prods.length > 0) {
      // Exclusion stricte des boissons (cafés, sodas, etc.), extras, suppléments et à la carte pour isoler la Cuisine
      const eligibleDishes = prods.filter(p => !isExcludedFromLeastSold(p.product, p.family));
      const candidateList = eligibleDishes.length > 0 ? eligibleDishes : prods;

      const prodsByRevenueDesc = [...candidateList].sort((a, b) => b.total - a.total || b.qty - a.qty);
      topProduct = prodsByRevenueDesc[0] || null;

      const prodsByQtyAsc = [...candidateList].sort((a, b) => a.qty - b.qty || a.total - b.total);
      leastProduct = prodsByQtyAsc[0] || null;
    }

    grandTotalCA += data.totalCA;
    grandTotalQty += data.totalQty;
    totalActiveDays += occCount;

    return {
      dow: d.dow,
      name: d.name,
      short: d.short,
      icon: d.icon,
      occCount,
      totalCA: data.totalCA,
      totalQty: data.totalQty,
      avgCA,
      avgQty,
      topProduct,
      leastProduct,
      worstProduct: leastProduct
    };
  });

  const avgDailyCAAcrossWeek = totalActiveDays > 0 ? (grandTotalCA / totalActiveDays) : 0;

  resultList.forEach(r => {
    r.sharePct = grandTotalCA > 0 ? (r.totalCA / grandTotalCA * 100) : 0;
    r.deltaVsAvgPct = avgDailyCAAcrossWeek > 0 ? ((r.avgCA - avgDailyCAAcrossWeek) / avgDailyCAAcrossWeek * 100) : 0;
  });

  const activeDaysSorted = [...resultList].filter(r => r.occCount > 0).sort((a, b) => b.avgCA - a.avgCA);
  const leaderDay = activeDaysSorted[0] || null;
  const quietDay = activeDaysSorted.length > 1 ? activeDaysSorted[activeDaysSorted.length - 1] : null;

  return {
    items: resultList,
    grandTotalCA,
    grandTotalQty,
    totalActiveDays,
    avgDailyCAAcrossWeek,
    leaderDay,
    quietDay
  };
}

// 2. Calcul Statistiques par Semaine (Week-over-Week)
function computeWeeklyStats(dataset, categoryFilter) {
  function getISOWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return {
      year: date.getUTCFullYear(),
      week: Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
    };
  }

  const weeksMap = {};

  dataset.dates.forEach(dStr => {
    const dObj = new Date(dStr + 'T00:00:00');
    const { year, week } = getISOWeekNumber(dObj);
    const weekKey = `${year}-W${String(week).padStart(2, '0')}`;

    if (!weeksMap[weekKey]) {
      weeksMap[weekKey] = {
        weekKey,
        year,
        week,
        dates: new Set(),
        totalCA: 0,
        totalQty: 0,
        products: {},
        categories: {}
      };
    }

    const wObj = weeksMap[weekKey];
    const sales = dataset.salesByDate[dStr] || [];
    let hasMatching = false;

    sales.forEach(s => {
      const cat = detectProductCategory(s.product, s.family, s.matchedRecipe);
      if (categoryFilter !== 'all' && cat !== categoryFilter) return;

      hasMatching = true;
      const q = parseFloat(s.qty) || 0;
      const p = parseFloat(s.price) || 0;
      const t = parseFloat(s.total) || (q * p);
      wObj.totalCA += t;
      wObj.totalQty += q;

      if (!wObj.products[s.product]) wObj.products[s.product] = { product: s.product, family: s.family || '', qty: 0, total: 0 };
      wObj.products[s.product].qty += q;
      wObj.products[s.product].total += t;

      wObj.categories[cat] = (wObj.categories[cat] || 0) + t;
    });

    if (hasMatching || categoryFilter === 'all') {
      wObj.dates.add(dStr);
    }
  });

  const sortedKeys = Object.keys(weeksMap).sort();
  let prevCA = 0;

  const weekList = sortedKeys.map(wk => {
    const w = weeksMap[wk];
    const datesArr = Array.from(w.dates).sort();
    const daysCount = datesArr.length;
    const startDate = datesArr[0] || '';
    const endDate = datesArr[datesArr.length - 1] || '';
    const avgDailyCA = daysCount > 0 ? (w.totalCA / daysCount) : 0;

    let deltaWoWPct = null;
    if (prevCA > 0) {
      deltaWoWPct = ((w.totalCA - prevCA) / prevCA) * 100;
    }
    prevCA = w.totalCA;

    const prods = Object.values(w.products).filter(p => p.qty > 0);
    let topProduct = null;
    let leastProduct = null;
    if (prods.length > 0) {
      // Exclusion stricte des boissons (cafés, sodas, etc.), extras, suppléments et à la carte pour isoler la Cuisine
      const eligibleDishes = prods.filter(p => !isExcludedFromLeastSold(p.product, p.family));
      const candidateList = eligibleDishes.length > 0 ? eligibleDishes : prods;

      const prodsByRevenueDesc = [...candidateList].sort((a, b) => b.total - a.total || b.qty - a.qty);
      topProduct = prodsByRevenueDesc[0] || null;

      const prodsByQtyAsc = [...candidateList].sort((a, b) => a.qty - b.qty || a.total - b.total);
      leastProduct = prodsByQtyAsc[0] || null;
    }

    let topCatStr = '-';
    const catEntries = Object.entries(w.categories).sort((a, b) => b[1] - a[1]);
    if (catEntries.length > 0) {
      const cObj = GC_CATEGORIES.find(c => c.id === catEntries[0][0]);
      topCatStr = cObj ? `${cObj.icon} ${cObj.label}` : catEntries[0][0];
    }

    return {
      weekKey: wk,
      weekNum: w.week,
      year: w.year,
      startDate,
      endDate,
      daysCount,
      totalCA: w.totalCA,
      totalQty: w.totalQty,
      avgDailyCA,
      deltaWoWPct,
      topProduct,
      leastProduct,
      worstProduct: leastProduct,
      topCategory: topCatStr
    };
  });

  const grandTotalCA = weekList.reduce((acc, x) => acc + x.totalCA, 0);
  const grandTotalQty = weekList.reduce((acc, x) => acc + x.totalQty, 0);
  const avgWeekCA = weekList.length > 0 ? (grandTotalCA / weekList.length) : 0;
  const bestWeek = [...weekList].sort((a, b) => b.totalCA - a.totalCA)[0] || null;

  return {
    items: weekList,
    grandTotalCA,
    grandTotalQty,
    avgWeekCA,
    bestWeek
  };
}

// 3. Calcul Statistiques par Mois (Month-over-Month)
function computeMonthlyStats(dataset, categoryFilter) {
  const monthNamesFR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const monthsMap = {};

  dataset.dates.forEach(dStr => {
    const ym = dStr.substring(0, 7); // "YYYY-MM"
    if (!monthsMap[ym]) {
      monthsMap[ym] = {
        ym,
        dates: new Set(),
        totalCA: 0,
        totalQty: 0,
        products: {},
        categories: {}
      };
    }

    const mObj = monthsMap[ym];
    const sales = dataset.salesByDate[dStr] || [];
    let hasMatching = false;

    sales.forEach(s => {
      const cat = detectProductCategory(s.product, s.family, s.matchedRecipe);
      if (categoryFilter !== 'all' && cat !== categoryFilter) return;

      hasMatching = true;
      const q = parseFloat(s.qty) || 0;
      const p = parseFloat(s.price) || 0;
      const t = parseFloat(s.total) || (q * p);
      mObj.totalCA += t;
      mObj.totalQty += q;

      if (!mObj.products[s.product]) mObj.products[s.product] = { product: s.product, family: s.family || '', qty: 0, total: 0 };
      mObj.products[s.product].qty += q;
      mObj.products[s.product].total += t;

      mObj.categories[cat] = (mObj.categories[cat] || 0) + t;
    });

    if (hasMatching || categoryFilter === 'all') {
      mObj.dates.add(dStr);
    }
  });

  const sortedYM = Object.keys(monthsMap).sort();
  let prevCA = 0;

  const monthList = sortedYM.map(ym => {
    const m = monthsMap[ym];
    const [yStr, mStr] = ym.split('-');
    const mIdx = parseInt(mStr, 10) - 1;
    const monthName = `${monthNamesFR[mIdx]} ${yStr}`;
    const daysCount = m.dates.size;
    const avgDailyCA = daysCount > 0 ? (m.totalCA / daysCount) : 0;

    let deltaMoMPct = null;
    if (prevCA > 0) {
      deltaMoMPct = ((m.totalCA - prevCA) / prevCA) * 100;
    }
    prevCA = m.totalCA;

    const prods = Object.values(m.products).filter(p => p.qty > 0);
    let topProduct = null;
    let leastProduct = null;
    if (prods.length > 0) {
      // Exclusion stricte des boissons (cafés, sodas, etc.), extras, suppléments et à la carte pour isoler la Cuisine
      const eligibleDishes = prods.filter(p => !isExcludedFromLeastSold(p.product, p.family));
      const candidateList = eligibleDishes.length > 0 ? eligibleDishes : prods;

      const prodsByRevenueDesc = [...candidateList].sort((a, b) => b.total - a.total || b.qty - a.qty);
      topProduct = prodsByRevenueDesc[0] || null;

      const prodsByQtyAsc = [...candidateList].sort((a, b) => a.qty - b.qty || a.total - b.total);
      leastProduct = prodsByQtyAsc[0] || null;
    }

    return {
      ym,
      monthName,
      daysCount,
      totalCA: m.totalCA,
      totalQty: m.totalQty,
      avgDailyCA,
      deltaMoMPct,
      topProduct,
      leastProduct,
      worstProduct: leastProduct
    };
  });

  const grandTotalCA = monthList.reduce((acc, x) => acc + x.totalCA, 0);
  const grandTotalQty = monthList.reduce((acc, x) => acc + x.totalQty, 0);
  const avgMonthCA = monthList.length > 0 ? (grandTotalCA / monthList.length) : 0;
  const bestMonth = [...monthList].sort((a, b) => b.totalCA - a.totalCA)[0] || null;
  const quietMonth = monthList.length > 1 ? [...monthList].sort((a, b) => a.totalCA - b.totalCA)[0] : null;

  return {
    items: monthList,
    grandTotalCA,
    grandTotalQty,
    avgMonthCA,
bestMonth,
    quietMonth
  };
}

/// Fonction maîtresse de rendu du Comparateur
function renderComparatorTab() {
  const container = document.getElementById('tab-comparator');
  if (!container) return;

  const dataset = getComparatorSalesDataset();

  // Mise à jour du badge de période
  const periodBadge = document.getElementById('comp-period-badge');
  if (periodBadge) {
    const catObj = GC_CATEGORIES.find(c => c.id === comparatorCategoryFilter);
    const catLabel = catObj ? `${catObj.icon} ${catObj.label}` : 'Toutes les Catégories';
    periodBadge.textContent = `Période active : ${dataset.scopeLabel} • Filtre : ${catLabel} • ${dataset.dates.length} jours d'activité analysés`;
  }

  // Synchronisation des boutons de raccourcis presets
  const presetPills = document.querySelectorAll('.comp-preset-pill');
  presetPills.forEach(p => {
    p.classList.toggle('active', p.getAttribute('data-preset') === comparatorDatePreset);
  });

  // Synchronisation des champs date libres
  const dateStartInput = document.getElementById('comp-date-start');
  const dateEndInput = document.getElementById('comp-date-end');
  if (dateStartInput && dataset.startDate) dateStartInput.value = dataset.startDate;
  if (dateEndInput && dataset.endDate) dateEndInput.value = dataset.endDate;

  const activeDatesBadge = document.getElementById('comp-active-dates-badge');
  if (activeDatesBadge) {
    activeDatesBadge.innerHTML = `📅 <strong>${dataset.dates.length} jours d'activité</strong> (${dataset.startDate || '-'} ➔ ${dataset.endDate || '-'})`;
  }

  // Mise à jour des boutons de mode
  const btnDay = document.getElementById('btn-comp-dayofweek');
  const btnWeek = document.getElementById('btn-comp-week');
  const btnMonth = document.getElementById('btn-comp-month');
  if (btnDay) btnDay.classList.toggle('active', comparatorMode === 'dayofweek');
  if (btnWeek) btnWeek.classList.toggle('active', comparatorMode === 'week');
  if (btnMonth) btnMonth.classList.toggle('active', comparatorMode === 'month');

  // Synchronisation du select catégorie
  const catSelect = document.getElementById('comp-cat-select');
  if (catSelect && catSelect.value !== comparatorCategoryFilter) {
    catSelect.value = comparatorCategoryFilter;
  }

  // Si aucune donnée de vente
  if (!dataset.dates || dataset.dates.length === 0) {
    const kpisCont = document.getElementById('comp-kpis-container');
    if (kpisCont) kpisCont.innerHTML = '';
    const chartBars = document.getElementById('comp-chart-bars-container');
    if (chartBars) {
      chartBars.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--muted);">
          Aucune donnée de vente disponible pour cette période (${dataset.startDate || ''} ➔ ${dataset.endDate || ''}). Modifiez la sélection ou cliquez sur « Toute la Période ».
        </div>
      `;
    }
    const decCard = document.getElementById('comp-decision-card');
    if (decCard) decCard.innerHTML = '';
    const th = document.getElementById('comp-table-thead');
    if (th) th.innerHTML = '';
    const tb = document.getElementById('comp-table-tbody');
    if (tb) tb.innerHTML = '';
    return;
  }

  if (comparatorMode === 'dayofweek') {
    renderDayOfWeekComparison(dataset);
  } else if (comparatorMode === 'week') {
    renderWeeklyComparison(dataset);
  } else if (comparatorMode === 'month') {
    renderMonthlyComparison(dataset);
  }

  // Rendu du Radar Décisionnel IA (Menu Prochain & Prix Futurs)
  renderComparatorDecisionPanel(dataset);
}

// Radar Décisionnel Opérationnel (Aide à la Décision Menu & Prix)
function renderComparatorDecisionPanel(dataset) {
  const panel = document.getElementById('comp-decision-card');
  if (!panel) return;

  const productsMap = {};
  let totalPeriodCA = 0;
  let totalPeriodQty = 0;

  dataset.dates.forEach(dStr => {
    const sales = dataset.salesByDate[dStr] || [];
    sales.forEach(s => {
      const cat = detectProductCategory(s.product, s.family, s.matchedRecipe);
      if (comparatorCategoryFilter !== 'all' && cat !== comparatorCategoryFilter) return;

      const q = parseFloat(s.qty) || 0;
      const p = parseFloat(s.price) || 0;
      const t = parseFloat(s.total) || (q * p);

      if (!productsMap[s.product]) {
        productsMap[s.product] = {
          product: s.product,
          family: s.family || '',
          category: cat,
          qty: 0,
          total: 0,
          price: p
        };
      }
      productsMap[s.product].qty += q;
      productsMap[s.product].total += t;
      totalPeriodCA += t;
      totalPeriodQty += q;
    });
  });

  const allDishes = Object.values(productsMap);
  if (allDishes.length === 0) {
    panel.innerHTML = '';
    return;
  }

  // Filtrer les vrais plats culinaires (exclusion stricte des suppléments, divers, internes, sodas)
  const eligibleDishes = allDishes.filter(d => !isExcludedFromLeastSold(d.product, d.family));
  const candidateList = eligibleDishes.length >= 3 ? eligibleDishes : allDishes;

  // 1. FLOP DISHES (Moins vendus réels pour arbitrage)
  const flops = [...candidateList].sort((a, b) => a.qty - b.qty || a.total - b.total).slice(0, 3);

  // 2. STARS & CHEVAUX DE BATAILLE (Top volumes)
  const locomotives = [...candidateList].sort((a, b) => b.qty - a.qty || b.total - a.total).slice(0, 3);

  // 3. STATISTIQUES D'AFFLUENCE JOURS
  const dowStats = computeDayOfWeekStats(dataset, comparatorCategoryFilter);
  const leaderDay = dowStats.leaderDay;
  const quietDay = dowStats.quietDay;

  // Simulation Trésorerie : Hausse +2 à +5 DH sur les 3 Locomotives
  const activeDays = Math.max(1, dataset.dates.length);
  const annualFactor = 365 / activeDays;
  const topVolumePeriod = locomotives.reduce((acc, x) => acc + x.qty, 0);
  const annualTopVolume = Math.round(topVolumePeriod * annualFactor);
  const gain2DH = Math.round(annualTopVolume * 2);
  const gain3DH = Math.round(annualTopVolume * 3);
  const gain5DH = Math.round(annualTopVolume * 5);

  panel.innerHTML = `
    <div class="comp-decision-header">
      <div>
        <h3 class="comp-decision-title">
          🧭 Radar Décisionnel : Arbitrage Prochaine Carte &amp; Stratégie de Prix
        </h3>
        <p class="comp-decision-sub">
          Analyse décisionnelle basée sur <strong>${dataset.dates.length} jours d'historique de ventes réelles</strong>. Utilisez ces leviers pour composer la prochaine carte et optimiser vos prix sans perdre de clients.
        </p>
      </div>
      <span class="comp-active-dates-badge" style="background:rgba(139, 92, 246, 0.1); color:#8b5cf6; border-color:rgba(139, 92, 246, 0.3);">
        🎯 Aide au Choix Métier
      </span>
    </div>

    <div class="comp-decision-grid">
      <!-- 1. SOUS-PERFORMANTS / FLOPS -->
      <div class="comp-decision-box box-danger">
        <div class="comp-box-header">
          <h4 class="comp-box-title">🚨 Plats Sous-Performants (Arbitrage Carte)</h4>
          <span class="comp-box-badge danger">À Décider</span>
        </div>
        <div class="comp-box-content">
          <p style="margin:0; font-size:12px; color:var(--muted);">
            Vrais plats culinaires ayant enregistré les plus faibles volumes de commande sur la période :
          </p>
          ${flops.map(f => {
            const isVeryLow = f.qty <= 3;
            const actionTag = isVeryLow 
              ? '<span class="comp-action-badge eliminate">❌ Supprimer</span>' 
              : '<span class="comp-action-badge boost">🔄 Repenser / Saison</span>';
            const advice = isVeryLow 
              ? 'Rotation quasi-nulle. Supprimez pour réduire le gaspillage et libérer la mise en place.' 
              : 'Faible rotation. À proposer en suggestion du chef le midi ou à reformuler.';
            return `
              <div class="comp-dish-row">
                <div>
                  <div class="comp-dish-name">${escapeHtml(f.product)}</div>
                  <div class="comp-dish-meta">${f.qty.toLocaleString('fr-FR')} vendus • ${f.total.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH de CA</div>
                  <div style="font-size:11px; color:var(--muted); margin-top:2px;">${advice}</div>
                </div>
                <div>${actionTag}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 2. LEVIERS DE PRIX (+2 à +5 DH) -->
      <div class="comp-decision-box box-success">
        <div class="comp-box-header">
          <h4 class="comp-box-title">💎 Leviers de Prix (Hausse Douce +2 à +5 DH)</h4>
          <span class="comp-box-badge success">Marge Immédiate</span>
        </div>
        <div class="comp-box-content">
          <p style="margin:0; font-size:12px; color:var(--muted);">
            Plats locomotives à très fort volume où un ajustement de prix génère un gain cash direct sans frottement client :
          </p>
          ${locomotives.map(s => `
            <div class="comp-dish-row">
              <div>
                <div class="comp-dish-name">⭐ ${escapeHtml(s.product)}</div>
                <div class="comp-dish-meta">${s.qty.toLocaleString('fr-FR')} vendus (${totalPeriodQty > 0 ? Math.round((s.qty / totalPeriodQty) * 100) : 0}% du volume total) • Prix : ${s.price ? s.price + ' DH' : '-'}</div>
              </div>
              <span class="comp-action-badge price-up">+2 à +3 DH</span>
            </div>
          `).join('')}

          <div class="comp-simul-box">
            <div class="comp-simul-title">💰 Simulateur de Trésorerie Nette Annuelle</div>
            <div class="comp-simul-text">
              En augmentant de <strong>+2 DH</strong> vos 3 meilleures locomotives (${locomotives.map(s => escapeHtml(s.product)).join(', ')}) :
              <span class="comp-simul-gain">+${gain2DH.toLocaleString('fr-FR')} DH / an</span>
              de trésorerie nette additionnelle pure, avec un risque de perte client quasi-nul.
              <div style="font-size:11px; color:#065f46; margin-top:4px;">
                💡 À +3 DH : <strong>+${gain3DH.toLocaleString('fr-FR')} DH</strong> • À +5 DH : <strong>+${gain5DH.toLocaleString('fr-FR')} DH</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. STRATÉGIE D'AFFLUENCE HEBDOMADAIRE -->
      <div class="comp-decision-box box-warning">
        <div class="comp-box-header">
          <h4 class="comp-box-title">⏰ Stratégie d'Affluence &amp; Rotation</h4>
          <span class="comp-box-badge warning">Organisation Cuisine</span>
        </div>
        <div class="comp-box-content">
          ${leaderDay ? `
            <div class="comp-dish-row">
              <div>
                <div class="comp-dish-name">🔥 Jour Leader : ${leaderDay.icon} ${leaderDay.name}</div>
                <div class="comp-dish-meta">${leaderDay.avgCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH/j moyen (${leaderDay.sharePct.toFixed(1)}% du CA hebdo)</div>
                <div style="font-size:11.5px; color:#b45309; margin-top:3px;">
                  👉 <strong>Action :</strong> Sécuriser les approvisionnements des viandes et poissons nobles le veille. Privilégier les préparations rapides pour accélérer le turnover des tables.
                </div>
              </div>
            </div>
          ` : ''}

          ${quietDay ? `
            <div class="comp-dish-row">
              <div>
                <div class="comp-dish-name">📉 Jour Calme : ${quietDay.icon} ${quietDay.name}</div>
                <div class="comp-dish-meta">${quietDay.avgCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH/j moyen</div>
                <div style="font-size:11.5px; color:#b45309; margin-top:3px;">
                  👉 <strong>Action :</strong> Lancer une formule midi attractive (Plat du Jour + Café offert) ou un tarif spécial pour dynamiser la fréquentation sans dégrader l'image.
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// 1. Rendu Comparateur par Jour de Semaine
function renderDayOfWeekComparison(dataset) {
  const stats = computeDayOfWeekStats(dataset, comparatorCategoryFilter);

  // KPIs
  const kpisContainer = document.getElementById('comp-kpis-container');
  kpisContainer.innerHTML = `
    <div class="comp-kpi-card star">
      <div class="comp-kpi-label">🥇 Jour d'Affluence Leader</div>
      <div class="comp-kpi-value" style="color:#10b981;">
        ${stats.leaderDay ? `${stats.leaderDay.icon} ${stats.leaderDay.name}` : '-'}
      </div>
      <div class="comp-kpi-sub">
        ${stats.leaderDay ? `<strong>${stats.leaderDay.avgCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH/j</strong> (${stats.leaderDay.sharePct.toFixed(1)}% du CA)` : ''}
      </div>
    </div>

    <div class="comp-kpi-card calm">
      <div class="comp-kpi-label">📉 Jour le Plus Calme</div>
      <div class="comp-kpi-value" style="color:#f59e0b;">
        ${stats.quietDay ? `${stats.quietDay.icon} ${stats.quietDay.name}` : '-'}
      </div>
      <div class="comp-kpi-sub">
        ${stats.quietDay ? `<strong>${stats.quietDay.avgCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH/j</strong> (Opportunité promo)` : ''}
      </div>
    </div>

    <div class="comp-kpi-card">
      <div class="comp-kpi-label">📊 Moyenne Journalière</div>
      <div class="comp-kpi-value">
        ${stats.avgDailyCAAcrossWeek.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
      </div>
      <div class="comp-kpi-sub">
        sur ${stats.totalActiveDays} jours d'activité enregistrés
      </div>
    </div>

    <div class="comp-kpi-card purple">
      <div class="comp-kpi-label">💰 Total Période Analysée</div>
      <div class="comp-kpi-value" style="color:#8b5cf6;">
        ${stats.grandTotalCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
      </div>
      <div class="comp-kpi-sub">
        ${stats.grandTotalQty.toLocaleString('fr-FR')} articles vendus
      </div>
    </div>
  `;

  // Graphique en barres
  document.getElementById('comp-chart-title').textContent = "📊 Chiffre d'Affaires Moyen par Jour de Semaine (Lundi à Dimanche)";
  document.getElementById('comp-chart-sub').textContent = "Moyenne en Dirhams par occurrence du jour (hors fermetures). Visualisez immédiatement vos journées locomotives.";
  document.getElementById('comp-chart-legend').innerHTML = `
    <span style="color:#10b981;">● Jour Leader</span>
    <span style="color:#f59e0b;">● Jour Calme</span>
    <span style="color:#0284c7;">● Jours Standards</span>
  `;

  const maxAvgCA = Math.max(1, ...stats.items.map(i => i.avgCA));
  const chartWrapper = document.getElementById('comp-chart-bars-container');

  chartWrapper.innerHTML = stats.items.map(item => {
    const isLeader = stats.leaderDay && stats.leaderDay.dow === item.dow;
    const isQuiet = stats.quietDay && stats.quietDay.dow === item.dow;
    let barClass = '';
    if (isLeader) barClass = 'leader';
    else if (isQuiet) barClass = 'quiet';

    const barWidthPct = maxAvgCA > 0 ? Math.max(4, Math.round((item.avgCA / maxAvgCA) * 100)) : 0;
    const isPos = item.deltaVsAvgPct >= 0;
    const deltaTag = `<span class="comp-delta-tag ${isPos ? 'pos' : 'neg'}">${isPos ? '▲ +' : '▼ '}${item.deltaVsAvgPct.toFixed(1)}%</span>`;

    return `
      <div class="comp-bar-row">
        <div class="comp-bar-label">
          <span>${item.icon} ${item.name}</span>
          ${isLeader ? '<span>🥇</span>' : ''}
          ${isQuiet ? '<span>📉</span>' : ''}
        </div>
        <div class="comp-bar-track">
          <div class="comp-bar-fill ${barClass}" style="width: ${barWidthPct}%;"></div>
        </div>
        <div class="comp-bar-ca">
          ${item.avgCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH/j
        </div>
        <div class="comp-bar-share">
          ${item.sharePct.toFixed(1)}% ${deltaTag}
        </div>
      </div>
    `;
  }).join('');

  // Tableau détaillé
  document.getElementById('comp-table-thead').innerHTML = `
    <tr>
      <th style="width:50px; text-align:center;">#</th>
      <th>Jour de la Semaine</th>
      <th style="text-align:center;">Jours Actifs</th>
      <th style="text-align:right;">CA Total (DH)</th>
      <th style="text-align:right;">CA Moyen / Jour</th>
      <th style="text-align:right;">Articles Vendus</th>
      <th style="text-align:center;">Part du CA</th>
      <th style="text-align:center;">Écart vs Moyenne</th>
      <th>⭐ Plat Vedette (Cuisine)</th>
      <th>🔻 Moins Vendu (Cuisine)</th>
      <th>💡 Conseil Métier</th>
    </tr>
  `;

  const sortedForTable = [...stats.items].sort((a, b) => b.avgCA - a.avgCA);
  const medals = ['🥇', '🥈', '🥉'];

  document.getElementById('comp-table-tbody').innerHTML = sortedForTable.map((item, idx) => {
    const rankBadge = idx < 3 ? medals[idx] : `<span class="comp-badge-rank">${idx + 1}</span>`;
    const isPos = item.deltaVsAvgPct >= 0;
    const deltaTag = `<span class="comp-delta-tag ${isPos ? 'pos' : 'neg'}">${isPos ? '+' : ''}${item.deltaVsAvgPct.toFixed(1)}%</span>`;
    const topProdStr = item.topProduct ? `<strong>${escapeHtml(item.topProduct.product)}</strong> <span style="font-size:11px; color:var(--muted);">(${item.topProduct.qty.toLocaleString('fr-FR')} u.)</span>` : '<span style="color:var(--muted);">-</span>';
    const leastProdStr = item.leastProduct ? `<strong style="color:#ef4444;">${escapeHtml(item.leastProduct.product)}</strong> <span style="font-size:11px; color:var(--muted);">(${item.leastProduct.qty.toLocaleString('fr-FR')} u.)</span>` : '<span style="color:var(--muted);">-</span>';

    let conseilTag = '<span class="comp-badge-conseil" style="background:var(--bg); color:var(--muted);">Rythme Régulier</span>';
    if (stats.leaderDay && stats.leaderDay.dow === item.dow) {
      conseilTag = '<span class="comp-badge-conseil loco">⭐ Jour Leader (Sécuriser stocks)</span>';
    } else if (stats.quietDay && stats.quietDay.dow === item.dow) {
      conseilTag = '<span class="comp-badge-conseil promo">🎯 Jour Calme (Action Promo / Formule)</span>';
    }

    return `
      <tr>
        <td style="text-align:center;">${rankBadge}</td>
        <td><strong>${item.icon} ${item.name}</strong></td>
        <td style="text-align:center;"><span class="chip-pill">${item.occCount} j.</span></td>
        <td style="text-align:right; font-weight:800;">${item.totalCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</td>
        <td style="text-align:right; font-weight:900; color:var(--accent);">${item.avgCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</td>
        <td style="text-align:right;">${item.totalQty.toLocaleString('fr-FR')} u.</td>
        <td style="text-align:center; font-weight:800;">${item.sharePct.toFixed(1)}%</td>
        <td style="text-align:center;">${deltaTag}</td>
        <td>${topProdStr}</td>
        <td>${leastProdStr}</td>
        <td>${conseilTag}</td>
      </tr>
    `;
  }).join('');
}

// 2. Rendu Comparateur par Semaine
function renderWeeklyComparison(dataset) {
  const stats = computeWeeklyStats(dataset, comparatorCategoryFilter);

  // KPIs
  const kpisContainer = document.getElementById('comp-kpis-container');
  kpisContainer.innerHTML = `
    <div class="comp-kpi-card star">
      <div class="comp-kpi-label">🏆 Meilleure Semaine</div>
      <div class="comp-kpi-value" style="color:#10b981;">
        ${stats.bestWeek ? `Semaine ${stats.bestWeek.weekNum}` : '-'}
      </div>
      <div class="comp-kpi-sub">
        ${stats.bestWeek ? `<strong>${stats.bestWeek.totalCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH</strong> (${stats.bestWeek.totalQty.toLocaleString('fr-FR')} articles)` : ''}
      </div>
    </div>

    <div class="comp-kpi-card">
      <div class="comp-kpi-label">📊 CA Hebdomadaire Moyen</div>
      <div class="comp-kpi-value">
        ${stats.avgWeekCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
      </div>
      <div class="comp-kpi-sub">
        sur ${stats.items.length} semaine(s) d'activité
      </div>
    </div>

    <div class="comp-kpi-card purple">
      <div class="comp-kpi-label">💰 Total Période Analysée</div>
      <div class="comp-kpi-value" style="color:#8b5cf6;">
        ${stats.grandTotalCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
      </div>
      <div class="comp-kpi-sub">
        ${stats.grandTotalQty.toLocaleString('fr-FR')} articles vendus
      </div>
    </div>
  `;

  // Graphique
  document.getElementById('comp-chart-title').textContent = "📆 Évolution Hebdomadaire du Chiffre d'Affaires (Week-over-Week)";
  document.getElementById('comp-chart-sub').textContent = "Comparaison de la dynamique des ventes semaine par semaine avec taux de croissance.";
  document.getElementById('comp-chart-legend').innerHTML = `
    <span style="color:#10b981;">● Semaine Record</span>
    <span style="color:#0284c7;">● CA Hebdo Réalisé</span>
  `;

  const maxWeekCA = Math.max(1, ...stats.items.map(w => w.totalCA));
  const chartWrapper = document.getElementById('comp-chart-bars-container');

  chartWrapper.innerHTML = stats.items.map(item => {
    const isBest = stats.bestWeek && stats.bestWeek.weekKey === item.weekKey;
    const barWidthPct = maxWeekCA > 0 ? Math.max(4, Math.round((item.totalCA / maxWeekCA) * 100)) : 0;

    return `
      <div class="comp-bar-row">
        <div class="comp-bar-label">
          <span>Semaine ${item.weekNum}</span>
          ${isBest ? '<span>🏆</span>' : ''}
        </div>
        <div class="comp-bar-track">
          <div class="comp-bar-fill ${isBest ? 'leader' : ''}" style="width: ${barWidthPct}%;"></div>
        </div>
        <div class="comp-bar-ca">
          ${item.totalCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
        </div>
        <div class="comp-bar-share">
          ${item.deltaWoWPct !== null ? `<span class="comp-delta-tag ${item.deltaWoWPct >= 0 ? 'pos' : 'neg'}">${item.deltaWoWPct >= 0 ? '▲ +' : '▼ '}${item.deltaWoWPct.toFixed(1)}%</span>` : '<span style="color:var(--muted); font-size:11px;">Base</span>'}
        </div>
      </div>
    `;
  }).join('');

  // Tableau détaillé
  document.getElementById('comp-table-thead').innerHTML = `
    <tr>
      <th>Semaine</th>
      <th>Période (Dates)</th>
      <th style="text-align:center;">Jours Actifs</th>
      <th style="text-align:right;">Chiffre d'Affaires</th>
      <th style="text-align:center;">Évolution W-o-W</th>
      <th style="text-align:right;">CA Moyen / Jour</th>
      <th style="text-align:right;">Articles Vendus</th>
      <th>📁 Catégorie Forte</th>
      <th>⭐ Plat Leader (Cuisine)</th>
      <th>🔻 Moins Vendu (Cuisine)</th>
      <th>💡 Conseil Métier</th>
    </tr>
  `;

  document.getElementById('comp-table-tbody').innerHTML = stats.items.map(item => {
    let deltaHtml = '<span style="color:var(--muted); font-size:11px;">-</span>';
    if (item.deltaWoWPct !== null) {
      const isPos = item.deltaWoWPct >= 0;
      deltaHtml = `<span class="comp-delta-tag ${isPos ? 'pos' : 'neg'}">${isPos ? '▲ +' : '▼ '}${item.deltaWoWPct.toFixed(1)}%</span>`;
    }

    const topProdStr = item.topProduct ? `<strong>${escapeHtml(item.topProduct.product)}</strong> <span style="font-size:11px; color:var(--muted);">(${item.topProduct.qty.toLocaleString('fr-FR')} u.)</span>` : '-';
    const leastProdStr = item.leastProduct ? `<strong style="color:#ef4444;">${escapeHtml(item.leastProduct.product)}</strong> <span style="font-size:11px; color:var(--muted);">(${item.leastProduct.qty.toLocaleString('fr-FR')} u.)</span>` : '-';

    let conseilTag = '<span class="comp-badge-conseil" style="background:var(--bg); color:var(--muted);">Tendance Stable</span>';
    if (item.deltaWoWPct !== null && item.deltaWoWPct >= 10) {
      conseilTag = '<span class="comp-badge-conseil loco">📈 Forte Croissance (+10%)</span>';
    } else if (item.deltaWoWPct !== null && item.deltaWoWPct <= -10) {
      conseilTag = '<span class="comp-badge-conseil flop">📉 Creux d\'Activité (-10%)</span>';
    }

    return `
      <tr>
        <td><strong>Semaine ${item.weekNum} (${item.year})</strong></td>
        <td><span style="font-size:12px; color:var(--muted);">${item.startDate} ➔ ${item.endDate}</span></td>
        <td style="text-align:center;"><span class="chip-pill">${item.daysCount} jours</span></td>
        <td style="text-align:right; font-weight:900; color:var(--accent);">${item.totalCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</td>
        <td style="text-align:center;">${deltaHtml}</td>
        <td style="text-align:right; font-weight:800;">${item.avgDailyCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</td>
        <td style="text-align:right;">${item.totalQty.toLocaleString('fr-FR')} u.</td>
        <td><span class="chip-pill" style="font-size:11px;">${escapeHtml(item.topCategory)}</span></td>
        <td>${topProdStr}</td>
        <td>${leastProdStr}</td>
        <td>${conseilTag}</td>
      </tr>
    `;
  }).join('');
}

// 3. Rendu Comparateur par Mois
function renderMonthlyComparison(dataset) {
  const stats = computeMonthlyStats(dataset, comparatorCategoryFilter);

  // KPIs
  const kpisContainer = document.getElementById('comp-kpis-container');
  kpisContainer.innerHTML = `
    <div class="comp-kpi-card star">
      <div class="comp-kpi-label">🏆 Meilleur Mois</div>
      <div class="comp-kpi-value" style="color:#10b981;">
        ${stats.bestMonth ? stats.bestMonth.monthName : '-'}
      </div>
      <div class="comp-kpi-sub">
        ${stats.bestMonth ? `<strong>${stats.bestMonth.totalCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH</strong> (${stats.bestMonth.daysCount} j.)` : ''}
      </div>
    </div>

    <div class="comp-kpi-card calm">
      <div class="comp-kpi-label">📉 Mois le Plus Calme</div>
      <div class="comp-kpi-value" style="color:#f59e0b;">
        ${stats.quietMonth ? stats.quietMonth.monthName : '-'}
      </div>
      <div class="comp-kpi-sub">
        ${stats.quietMonth ? `<strong>${stats.quietMonth.totalCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH</strong>` : ''}
      </div>
    </div>

    <div class="comp-kpi-card">
      <div class="comp-kpi-label">📊 Moyenne Mensuelle</div>
      <div class="comp-kpi-value">
        ${stats.avgMonthCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
      </div>
      <div class="comp-kpi-sub">
        sur ${stats.items.length} mois enregistrés
      </div>
    </div>

    <div class="comp-kpi-card purple">
      <div class="comp-kpi-label">💰 Chiffre d'Affaires Global</div>
      <div class="comp-kpi-value" style="color:#8b5cf6;">
        ${stats.grandTotalCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
      </div>
      <div class="comp-kpi-sub">
        ${stats.grandTotalQty.toLocaleString('fr-FR')} articles au total
      </div>
    </div>
  `;

  // Graphique
  document.getElementById('comp-chart-title').textContent = "🗓️ Évolution Mensuelle du Chiffre d'Affaires (Month-over-Month)";
  document.getElementById('comp-chart-sub').textContent = "Comparaison de la saisonnalité et des volumes mois par mois sur l'année.";
  document.getElementById('comp-chart-legend').innerHTML = `
    <span style="color:#10b981;">● Meilleur Mois</span>
    <span style="color:#0284c7;">● CA Réalisé</span>
  `;

  const maxMonthCA = Math.max(1, ...stats.items.map(m => m.totalCA));
  const chartWrapper = document.getElementById('comp-chart-bars-container');

  chartWrapper.innerHTML = stats.items.map(item => {
    const isBest = stats.bestMonth && stats.bestMonth.ym === item.ym;
    const barWidthPct = maxMonthCA > 0 ? Math.max(4, Math.round((item.totalCA / maxMonthCA) * 100)) : 0;

    return `
      <div class="comp-bar-row">
        <div class="comp-bar-label">
          <span>🗓️ ${item.monthName}</span>
          ${isBest ? '<span>🏆</span>' : ''}
        </div>
        <div class="comp-bar-track">
          <div class="comp-bar-fill ${isBest ? 'leader' : ''}" style="width: ${barWidthPct}%;"></div>
        </div>
        <div class="comp-bar-ca">
          ${item.totalCA.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
        </div>
        <div class="comp-bar-share">
          ${item.deltaMoMPct !== null ? `<span class="comp-delta-tag ${item.deltaMoMPct >= 0 ? 'pos' : 'neg'}">${item.deltaMoMPct >= 0 ? '▲ +' : '▼ '}${item.deltaMoMPct.toFixed(1)}%</span>` : '<span style="color:var(--muted); font-size:11px;">Base</span>'}
        </div>
      </div>
    `;
  }).join('');

  // Tableau détaillé
  document.getElementById('comp-table-thead').innerHTML = `
    <tr>
      <th>Mois</th>
      <th style="text-align:center;">Jours Actifs</th>
      <th style="text-align:right;">Chiffre d'Affaires</th>
      <th style="text-align:center;">Évolution M-o-M</th>
      <th style="text-align:right;">CA Journalier Moyen</th>
      <th style="text-align:right;">Articles Vendus</th>
      <th>⭐ Plat Star (Cuisine)</th>
      <th>🔻 Moins Vendu (Cuisine)</th>
      <th>💡 Conseil Métier</th>
    </tr>
  `;

  document.getElementById('comp-table-tbody').innerHTML = stats.items.map(item => {
    let deltaHtml = '<span style="color:var(--muted); font-size:11px;">-</span>';
    if (item.deltaMoMPct !== null) {
      const isPos = item.deltaMoMPct >= 0;
      deltaHtml = `<span class="comp-delta-tag ${isPos ? 'pos' : 'neg'}">${isPos ? '▲ +' : '▼ '}${item.deltaMoMPct.toFixed(1)}%</span>`;
    }

    const topProdStr = item.topProduct ? `<strong>${escapeHtml(item.topProduct.product)}</strong> <span style="font-size:11px; color:var(--muted);">(${item.topProduct.qty.toLocaleString('fr-FR')} u.)</span>` : '-';
    const leastProdStr = item.leastProduct ? `<strong style="color:#ef4444;">${escapeHtml(item.leastProduct.product)}</strong> <span style="font-size:11px; color:var(--muted);">(${item.leastProduct.qty.toLocaleString('fr-FR')} u.)</span>` : '-';

    let conseilTag = '<span class="comp-badge-conseil" style="background:var(--bg); color:var(--muted);">Niveau Nominal</span>';
    if (stats.bestMonth && stats.bestMonth.ym === item.ym) {
      conseilTag = '<span class="comp-badge-conseil loco">🏆 Mois Record</span>';
    } else if (stats.quietMonth && stats.quietMonth.ym === item.ym) {
      conseilTag = '<span class="comp-badge-conseil promo">📉 Mois d\'Hivernage / Calme</span>';
    } else if (item.deltaMoMPct !== null && item.deltaMoMPct >= 10) {
      conseilTag = '<span class="comp-badge-conseil loco">🚀 Forte Progression</span>';
    }

    return `
      <tr>
        <td><strong>🗓️ ${item.monthName}</strong></td>
        <td style="text-align:center;"><span class="chip-pill">${item.daysCount} j.</span></td>
        <td style="text-align:right; font-weight:900; color:var(--accent);">${item.totalCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</td>
        <td style="text-align:center;">${deltaHtml}</td>
        <td style="text-align:right; font-weight:800;">${item.avgDailyCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</td>
        <td style="text-align:right;">${item.totalQty.toLocaleString('fr-FR')} u.</td>
        <td>${topProdStr}</td>
        <td>${leastProdStr}</td>
        <td>${conseilTag}</td>
      </tr>
    `;
  }).join('');
}

function setComparatorMode(mode) {
  comparatorMode = mode;
  renderComparatorTab();
}

function setComparatorCategoryFilter(catId) {
  comparatorCategoryFilter = catId;
  renderComparatorTab();
}

function exportComparatorToExcel() {
  if (typeof XLSX === 'undefined') {
    alert("La librairie Excel (SheetJS) n'est pas chargée.");
    return;
  }

  const dataset = getComparatorSalesDataset();
  const wb = XLSX.utils.book_new();

  // 1. Feuille Jour de Semaine
  const dowStats = computeDayOfWeekStats(dataset, comparatorCategoryFilter);
  const dowRows = [
    ['COMPARATEUR DES VENTES PAR JOUR DE LA SEMAINE — GREY CORNER'],
    [`Période analysée : ${dataset.scopeLabel}`, `Filtre catégorie : ${comparatorCategoryFilter}`, `Généré le : ${new Date().toLocaleDateString('fr-FR')}`],
    [],
    ['Jour de la semaine', 'Nombre d\'occurrences', 'CA Total (DH)', 'CA Moyen / Jour (DH)', 'Articles Vendus Total', 'Volume Moyen / Jour', 'Part dans le CA (%)', 'Écart vs Moyenne Hebdo (%)', 'Plat Vedette (Cuisine)', 'Moins Vendu (Cuisine)', 'Conseil Métier']
  ];
  dowStats.items.forEach(d => {
    let advice = 'Rythme Régulier';
    if (dowStats.leaderDay && dowStats.leaderDay.dow === d.dow) advice = 'Jour Leader (Sécuriser approvisionnements)';
    else if (dowStats.quietDay && dowStats.quietDay.dow === d.dow) advice = 'Jour Calme (Formule Déjeuner Promo)';

    dowRows.push([
      d.name,
      d.occCount,
      d.totalCA,
      d.avgCA,
      d.totalQty,
      d.avgQty,
      d.sharePct.toFixed(2),
      d.deltaVsAvgPct.toFixed(2),
      d.topProduct ? `${d.topProduct.product} (${d.topProduct.qty} u.)` : '',
      d.leastProduct ? `${d.leastProduct.product} (${d.leastProduct.qty} u.)` : '',
      advice
    ]);
  });
  const wsDow = XLSX.utils.aoa_to_sheet(dowRows);
  XLSX.utils.book_append_sheet(wb, wsDow, "Jours de Semaine");

  // 2. Feuille Semaines
  const weekStats = computeWeeklyStats(dataset, comparatorCategoryFilter);
  const weekRows = [
    ['COMPARATEUR HEBDOMADAIRE (WEEK-OVER-WEEK) — GREY CORNER'],
    [`Période analysée : ${dataset.scopeLabel}`, `Filtre catégorie : ${comparatorCategoryFilter}`],
    [],
    ['Semaine', 'Date Début', 'Date Fin', 'Jours Actifs', 'Chiffre d\'Affaires (DH)', 'Évolution W-o-W (%)', 'CA Moyen / Jour (DH)', 'Articles Vendus', 'Catégorie Leader', 'Plat Leader (Cuisine)', 'Moins Vendu (Cuisine)', 'Conseil Métier']
  ];
  weekStats.items.forEach(w => {
    let advice = 'Tendance Stable';
    if (w.deltaWoWPct !== null && w.deltaWoWPct >= 10) advice = 'Forte Croissance (+10%)';
    else if (w.deltaWoWPct !== null && w.deltaWoWPct <= -10) advice = 'Creux d\'Activité (-10%)';

    weekRows.push([
      `S${w.weekNum} (${w.year})`,
      w.startDate,
      w.endDate,
      w.daysCount,
      w.totalCA,
      w.deltaWoWPct !== null ? w.deltaWoWPct.toFixed(2) : 'Base',
      w.avgDailyCA,
      w.totalQty,
      w.topCategory,
      w.topProduct ? `${w.topProduct.product} (${w.topProduct.qty} u.)` : '',
      w.leastProduct ? `${w.leastProduct.product} (${w.leastProduct.qty} u.)` : '',
      advice
    ]);
  });
  const wsWeek = XLSX.utils.aoa_to_sheet(weekRows);
  XLSX.utils.book_append_sheet(wb, wsWeek, "Semaines (WoW)");

  // 3. Feuille Mois
  const monthStats = computeMonthlyStats(dataset, comparatorCategoryFilter);
  const monthRows = [
    ['COMPARATEUR MENSUEL (MONTH-OVER-MONTH) — GREY CORNER'],
    [`Période analysée : ${dataset.scopeLabel}`, `Filtre catégorie : ${comparatorCategoryFilter}`],
    [],
    ['Mois', 'Code YM', 'Jours Actifs', 'Chiffre d\'Affaires (DH)', 'Évolution M-o-M (%)', 'CA Journalier Moyen (DH)', 'Articles Vendus Total', 'Plat Star (Cuisine)', 'Moins Vendu (Cuisine)', 'Conseil Métier']
  ];
  monthStats.items.forEach(m => {
    let advice = 'Niveau Nominal';
    if (monthStats.bestMonth && monthStats.bestMonth.ym === m.ym) advice = 'Mois Record';
    else if (monthStats.quietMonth && monthStats.quietMonth.ym === m.ym) advice = 'Mois d\'Hivernage / Calme';
    else if (m.deltaMoMPct !== null && m.deltaMoMPct >= 10) advice = 'Forte Progression';

    monthRows.push([
      m.monthName,
      m.ym,
      m.daysCount,
      m.totalCA,
      m.deltaMoMPct !== null ? m.deltaMoMPct.toFixed(2) : 'Base',
      m.avgDailyCA,
      m.totalQty,
      m.topProduct ? `${m.topProduct.product} (${m.topProduct.qty} u.)` : '',
      m.leastProduct ? `${m.leastProduct.product} (${m.leastProduct.qty} u.)` : '',
      advice
    ]);
  });
  const wsMonth = XLSX.utils.aoa_to_sheet(monthRows);
  XLSX.utils.book_append_sheet(wb, wsMonth, "Mois (MoM)");

  const fileName = `GreyCorner_Comparateur_Ventes_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// Exports globaux pour la page et les tests
if (typeof window !== 'undefined') {
  window.isExcludedFromLeastSold = isExcludedFromLeastSold;
  window.isExcludedFromComparatorDishes = isExcludedFromLeastSold;
  window.setComparatorDatePreset = setComparatorDatePreset;
  window.onComparatorDateInputChange = onComparatorDateInputChange;
  window.applyComparatorCustomDateRange = applyComparatorCustomDateRange;
  window.setComparatorMode = setComparatorMode;
  window.setComparatorCategoryFilter = setComparatorCategoryFilter;
  window.renderComparatorTab = renderComparatorTab;
  window.renderComparatorDecisionPanel = renderComparatorDecisionPanel;
  window.exportComparatorToExcel = exportComparatorToExcel;
}

