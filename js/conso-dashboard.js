/**
 * GREY CORNER — Calendrier, Tableaux de Ventes & Dashboard Consommation
 * Module: conso-dashboard.js
 */

/* ========================================================
   7. CALENDRIER & GESTION MULTI-JOURS
======================================================== */
function renderCalendar() {
  const container = document.getElementById('cal-grid-container');
  if (!container) return;

  const [yearStr, monthStr] = selectedYearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-11

  // Entêtes des jours (Lun..Dim)
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  let html = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');

  // Premier jour du mois & nombre de jours
  const firstDay = new Date(year, month, 1);
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // En JS, getDay(): 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi. On convertit pour Lun=0 .. Dim=6
  let startingCol = (firstDay.getDay() + 6) % 7;

  // Cases vides avant le premier jour
  for (let i = 0; i < startingCol; i++) {
    html += `<div class="cal-day-cell empty"></div>`;
  }

  let monthTotalCA = 0;
  let monthTotalQty = 0;
  let recordedDaysCount = 0;

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${selectedYearMonth}-${dayStr}`;
    const dayData = monthlySalesDB[dateKey];
    const hasData = dayData && dayData.length > 0;
    const isSelected = (currentViewMode === 'day' && selectedDate === dateKey);

    let dayCA = 0;
    let dayQty = 0;
    if (hasData) {
      recordedDaysCount++;
      dayData.forEach(r => {
        const q = parseFloat(r.qty) || 0;
        const p = parseFloat(r.price) || 0;
        const t = parseFloat(r.total) || (q * p);
        dayCA += t;
        dayQty += q;
      });
      monthTotalCA += dayCA;
      monthTotalQty += dayQty;
    }

    const caFormatted = dayCA >= 1000 ? (dayCA / 1000).toFixed(1) + 'k DH' : Math.round(dayCA) + ' DH';

    html += `
      <div class="cal-day-cell ${hasData ? 'has-data' : ''} ${isSelected ? 'active' : ''}" onclick="selectDate('${dateKey}')">
        <div class="cal-day-top">
          <span class="cal-day-num">${day}</span>
          ${hasData ? `<span class="cal-day-badge">✓ ${dayData.length}</span>` : ''}
        </div>
        ${hasData ? `<div class="cal-day-ca" title="${dayCA.toLocaleString('fr-FR')} DH (${dayQty} articles)">${caFormatted}</div>` : `<div class="cal-day-empty-text">—</div>`}
      </div>
    `;
  }

  container.innerHTML = html;

  // Calcul des totaux et rendu de la barre annuelle des 12 mois
  const selectedYear = selectedYearMonth.slice(0, 4);
  const yearMonthsBar = document.getElementById('cal-year-months-bar');

  const monthTotalCAFormatted = Math.round(monthTotalCA).toLocaleString('fr-FR');
  const monthTotalQtyFormatted = Math.round(monthTotalQty).toLocaleString('fr-FR');

  let yearTotalCA = 0;
  let yearTotalQty = 0;
  let yearDaysCount = 0;
  const monthNamesLong = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  let yMonthsHtml = '';

  for (let m = 1; m <= 12; m++) {
    const mStr = String(m).padStart(2, '0');
    const ymKey = `${selectedYear}-${mStr}`;
    let mCA = 0;
    let mQty = 0;
    let mDays = 0;

    Object.keys(monthlySalesDB).forEach(dKey => {
      if (dKey.startsWith(ymKey) && monthlySalesDB[dKey] && monthlySalesDB[dKey].length > 0) {
        mDays++;
        monthlySalesDB[dKey].forEach(r => {
          const q = parseFloat(r.qty) || 0;
          const p = parseFloat(r.price) || 0;
          const t = parseFloat(r.total) || (q * p);
          mCA += t;
          mQty += q;
        });
      }
    });

    yearTotalCA += mCA;
    yearTotalQty += mQty;
    yearDaysCount += mDays;

    const hasMData = mDays > 0;
    const isCurrentMonth = (selectedYearMonth === ymKey);
    const caDisplay = mCA >= 1000 ? (mCA / 1000).toFixed(1) + 'k DH' : Math.round(mCA) + ' DH';

    yMonthsHtml += `
      <div class="cal-year-month-card ${hasMData ? 'has-data' : ''} ${isCurrentMonth ? 'is-current' : ''}" onclick="window.onSelectMonthFromYearBar('${ymKey}')" title="${monthNamesLong[m-1]} ${selectedYear} : ${Math.round(mCA).toLocaleString('fr-FR')} DH (${mDays} jours)">
        <div class="cal-year-month-name">
          <span>${monthNamesLong[m-1]}</span>
          ${hasMData ? `<span class="cal-year-month-badge">✓ ${mDays}j</span>` : ''}
        </div>
        <div class="cal-year-month-ca">${hasMData ? caDisplay : '—'}</div>
        <div class="cal-year-month-sub">${hasMData ? `${Math.round(mQty).toLocaleString('fr-FR')} art.` : 'Aucune vente'}</div>
      </div>
    `;
  }

  if (yearMonthsBar) {
    yearMonthsBar.innerHTML = yMonthsHtml;
    yearMonthsBar.style.display = (currentViewMode === 'year') ? 'grid' : 'none';
  }

  // Mettre à jour les statistiques globales du calendrier selon le mode
  const labelDays = document.getElementById('label-stat-cal-days');
  const labelCA = document.getElementById('label-stat-cal-ca');
  const labelQty = document.getElementById('label-stat-cal-qty');
  const elDays = document.getElementById('stat-cal-days-count');
  const elCA = document.getElementById('stat-cal-total-ca');
  const elQty = document.getElementById('stat-cal-total-qty');

  if (currentViewMode === 'year') {
    if (labelDays) labelDays.textContent = `Jours enregistrés (${selectedYear}) :`;
    if (labelCA) labelCA.textContent = `CA Total Année ${selectedYear} :`;
    if (labelQty) labelQty.textContent = `Articles Vendus (${selectedYear}) :`;
    if (elDays) elDays.textContent = `${yearDaysCount} jours actifs`;
    if (elCA) elCA.textContent = `${Math.round(yearTotalCA).toLocaleString('fr-FR')} DH`;
    if (elQty) elQty.textContent = `${Math.round(yearTotalQty).toLocaleString('fr-FR')}`;
  } else {
    if (labelDays) labelDays.textContent = `Jours enregistrés :`;
    if (labelCA) labelCA.textContent = `CA Total du Mois :`;
    if (labelQty) labelQty.textContent = `Articles Vendus :`;
    if (elDays) elDays.textContent = `${recordedDaysCount} / ${totalDaysInMonth} j.`;
    if (elCA) elCA.textContent = `${monthTotalCAFormatted} DH`;
    if (elQty) elQty.textContent = `${monthTotalQtyFormatted}`;
  }

  const mInput = document.getElementById('cal-month-input');
  if (mInput) mInput.value = selectedYearMonth;

  // Libellés UI
  const dFormatted = formatDateFR(selectedDate);
  const targetLabel = document.getElementById('label-upload-target-date');
  if (targetLabel) {
    if (currentViewMode === 'year') {
      targetLabel.textContent = `Année ${selectedYear}`;
    } else if (currentViewMode === 'month') {
      targetLabel.textContent = formatMonthFR(selectedYearMonth);
    } else {
      targetLabel.textContent = dFormatted;
    }
  }

  const dayShortLabel = document.getElementById('label-selected-day-short');
  if (dayShortLabel) dayShortLabel.textContent = selectedDate.slice(8, 10) + '/' + selectedDate.slice(5, 7);

  const monthShortLabel = document.getElementById('label-selected-month-short');
  if (monthShortLabel) monthShortLabel.textContent = formatMonthFR(selectedYearMonth);

  const yearShortLabel = document.getElementById('label-selected-year-short');
  if (yearShortLabel) yearShortLabel.textContent = selectedYear;

  const calTitle = document.getElementById('label-cal-title');
  if (calTitle) {
    if (currentViewMode === 'year') {
      calTitle.innerHTML = `📈 Déstockage &amp; Ventes — <strong>Cumul Année ${selectedYear}</strong>`;
    } else if (currentViewMode === 'month') {
      calTitle.innerHTML = `📊 Déstockage &amp; Ventes — <strong>Cumul ${formatMonthFR(selectedYearMonth)}</strong>`;
    } else {
      calTitle.innerHTML = `📅 Calendrier &amp; Déstockage — <strong>${dFormatted}</strong>`;
    }
  }
}

window.onSelectMonthFromYearBar = function(ymKey) {
  selectedYearMonth = ymKey;
  selectedDate = `${ymKey}-01`;
  setViewMode('month');
};



function selectDate(dateKey) {
  selectedDate = dateKey;
  selectedYearMonth = dateKey.slice(0, 7);
  setViewMode('day');
}

function setViewMode(mode) {
  currentViewMode = mode;
  const btnDay = document.getElementById('btn-mode-day');
  const btnMonth = document.getElementById('btn-mode-month');
  const btnYear = document.getElementById('btn-mode-year');

  if (btnDay) btnDay.classList.toggle('active', mode === 'day');
  if (btnMonth) btnMonth.classList.toggle('active', mode === 'month');
  if (btnYear) btnYear.classList.toggle('active', mode === 'year');

  renderCalendar();
  recalculateCurrentView();
}

function prevMonth() {
  const [y, m] = selectedYearMonth.split('-').map(Number);
  if (currentViewMode === 'year') {
    selectedYearMonth = `${y - 1}-${String(m).padStart(2, '0')}`;
    selectedDate = `${selectedYearMonth}-01`;
    renderCalendar();
    recalculateCurrentView();
    return;
  }
  let newY = y;
  let newM = m - 1;
  if (newM < 1) { newM = 12; newY--; }
  selectedYearMonth = `${newY}-${String(newM).padStart(2, '0')}`;
  selectedDate = `${selectedYearMonth}-01`;
  renderCalendar();
  recalculateCurrentView();
}

function nextMonth() {
  const [y, m] = selectedYearMonth.split('-').map(Number);
  if (currentViewMode === 'year') {
    selectedYearMonth = `${y + 1}-${String(m).padStart(2, '0')}`;
    selectedDate = `${selectedYearMonth}-01`;
    renderCalendar();
    recalculateCurrentView();
    return;
  }
  let newY = y;
  let newM = m + 1;
  if (newM > 12) { newM = 1; newY++; }
  selectedYearMonth = `${newY}-${String(newM).padStart(2, '0')}`;
  selectedDate = `${selectedYearMonth}-01`;
  renderCalendar();
  recalculateCurrentView();
}

function onMonthInputChange(val) {
  if (!val) return;
  selectedYearMonth = val;
  selectedDate = `${selectedYearMonth}-01`;
  renderCalendar();
  recalculateCurrentView();
}

function recalculateCurrentView() {
  const selectedYear = selectedYearMonth.slice(0, 4);

  if (currentViewMode === 'day') {
    let rows = monthlySalesDB[selectedDate] || [];
    
    // Si la date actuelle n'a pas de données mais que d'autres dates en ont dans le mois
    if (rows.length === 0) {
      const monthDates = Object.keys(monthlySalesDB).filter(d => d.startsWith(selectedYearMonth) && monthlySalesDB[d] && monthlySalesDB[d].length > 0).sort();
      if (monthDates.length > 0) {
        selectedDate = monthDates[monthDates.length - 1];
        rows = monthlySalesDB[selectedDate] || [];
      }
    }

    processSalesAndCalculateStock(rows, `Ventes du ${formatDateFR(selectedDate)}`, false, [selectedDate]);
  } else if (currentViewMode === 'year') {
    // Mode Cumul Annuel : fusion de tous les jours de l'année sélectionnée
    const allRows = [];
    const activeDays = [];

    Object.keys(monthlySalesDB).sort().forEach(dKey => {
      if (dKey.startsWith(selectedYear)) {
        const dRows = monthlySalesDB[dKey] || [];
        if (dRows.length > 0) {
          activeDays.push(dKey);
          dRows.forEach(r => allRows.push(r));
        }
      }
    });

    processSalesAndCalculateStock(allRows, `Cumul Annuel — Année ${selectedYear}`, true, activeDays);
  } else {
    // Mode Cumul Mensuel : fusion de tous les jours du mois
    const allRows = [];
    const activeDays = [];

    Object.keys(monthlySalesDB).sort().forEach(dKey => {
      if (dKey.startsWith(selectedYearMonth)) {
        const dRows = monthlySalesDB[dKey] || [];
        if (dRows.length > 0) {
          activeDays.push(dKey);
          dRows.forEach(r => allRows.push(r));
        }
      }
    });

    processSalesAndCalculateStock(allRows, `Cumul Mensuel — ${formatMonthFR(selectedYearMonth)}`, true, activeDays);
  }
}

function clearCurrentDayData() {
  if (!monthlySalesDB[selectedDate] || monthlySalesDB[selectedDate].length === 0) {
    alert("Aucune vente enregistrée pour le " + formatDateFR(selectedDate));
    return;
  }
  if (confirm(`Voulez-vous supprimer les données de vente du ${formatDateFR(selectedDate)} ?`)) {
    delete monthlySalesDB[selectedDate];
    saveMonthlySalesDB();
    renderCalendar();
    recalculateCurrentView();
  }
}

function exportFullMonthlyBackupJSON() {
  const payload = {
    exportDate: new Date().toISOString(),
    monthlySalesDB: monthlySalesDB,
    recipes: activeRecipes
  };
  const str = JSON.stringify(payload, null, 2);
  const blob = new Blob([str], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GreyCorner_Sauvegarde_Mensuelle_${selectedYearMonth}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFullMonthlyBackupJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.monthlySalesDB) {
        monthlySalesDB = data.monthlySalesDB;
        saveMonthlySalesDB();
      }
      if (data.recipes) {
        activeRecipes = data.recipes;
        saveRecipes();
        renderRecipeList();
      }
      alert("Sauvegarde restaurée avec succès !");
      renderCalendar();
      recalculateCurrentView();
    } catch (err) {
      alert("Erreur lors de la lecture du fichier JSON : " + err.message);
    }
  };
  reader.onerror = () => alert("Erreur de lecture du fichier. Veuillez réessayer.");
  reader.readAsText(file);
}

/* ========================================================
   8. RENDU DES STATS DU DASHBOARD & TABLEAUX
======================================================== */
function renderDashboard({ totalCA, totalQty, salesLines, distinctProducts, matchedCount, ingredientsCount, periodTitle, isMonthly, activeDaysCount }) {
  document.getElementById('stats-section').style.display = 'grid';
  document.getElementById('stat-ca').textContent = `${totalCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`;
  document.getElementById('stat-qty').textContent = totalQty.toLocaleString('fr-FR');
  
  const subCA = document.getElementById('stat-lines-count');
  if (subCA) {
    if (currentViewMode === 'year') {
      subCA.textContent = `${activeDaysCount} jours actifs (${salesLines.toLocaleString('fr-FR')} lignes sur ${selectedYearMonth.slice(0, 4)})`;
    } else if (isMonthly) {
      subCA.textContent = `${activeDaysCount} jours actifs (${salesLines.toLocaleString('fr-FR')} lignes sur ${formatMonthFR(selectedYearMonth)})`;
    } else {
      subCA.textContent = `${salesLines} lignes de vente (${periodTitle})`;
    }
  }

  document.getElementById('stat-products-count').textContent = `${distinctProducts} articles différents`;

  const rate = distinctProducts > 0 ? (matchedCount / distinctProducts * 100).toFixed(1) : 0;
  document.getElementById('stat-match-rate').textContent = `${rate}%`;
  document.getElementById('stat-matched-count').textContent = `${matchedCount} / ${distinctProducts} articles avec FT`;

  document.getElementById('stat-ing-count').textContent = ingredientsCount;
  document.getElementById('count-ingredients').textContent = ingredientsCount;
  document.getElementById('count-sales').textContent = distinctProducts;

  // Mise à jour des compteurs du Menu Burger Drawer
  const drawerCountIng = document.getElementById('drawer-count-ing');
  if (drawerCountIng) drawerCountIng.textContent = ingredientsCount;
  const drawerCountSales = document.getElementById('drawer-count-sales');
  if (drawerCountSales) drawerCountSales.textContent = distinctProducts;

  // Mise à jour de la barre de contrôle compacte en haut
  updateCompactTopBar({ totalCA, totalQty, salesLines, distinctProducts, periodTitle, isMonthly, activeDaysCount });
}

function formatIngQuantity(qty, unit, name = '') {
  if (unit === 'g') {
    if (qty >= 1000) {
      const kg = (qty / 1000).toFixed(2).replace(/\.?0+$/, '');
      return `<span class="qty-highlight">${kg}</span> <span class="qty-unit">Kg</span> <span style="font-size:11px;color:var(--muted)">(${qty.toLocaleString('fr-FR')} g)</span>`;
    }
    return `<span class="qty-highlight">${qty.toLocaleString('fr-FR')}</span> <span class="qty-unit">g</span>`;
  }
  if (unit === 'ml') {
    if (qty >= 1000) {
      const l = (qty / 1000).toFixed(2).replace(/\.?0+$/, '');
      return `<span class="qty-highlight">${l}</span> <span class="qty-unit">Litres</span> <span style="font-size:11px;color:var(--muted)">(${qty.toLocaleString('fr-FR')} ml)</span>`;
    }
    return `<span class="qty-highlight">${qty.toLocaleString('fr-FR')}</span> <span class="qty-unit">ml</span>`;
  }
  if (unit === 'œufs' || (name && (name.toLowerCase().includes('œuf') || name.toLowerCase().includes('oeuf')))) {
    return `<span class="qty-highlight">${Math.round(qty)}</span> <span class="qty-unit">œufs</span>`;
  }
  if (unit === 'tr') {
    return `<span class="qty-highlight">${Math.round(qty)}</span> <span class="qty-unit">tranches</span>`;
  }
  return `<span class="qty-highlight">${Math.round(qty * 10) / 10}</span> <span class="qty-unit">pièces</span>`;
}

function getCategoryBadge(cat) {
  const map = {
    boissons: '<span class="badge-tag" style="background:rgba(180,83,9,0.12);color:#b45309;border:1px solid rgba(180,83,9,0.25);">☕ Bar & Boissons</span>',
    viandes: '<span class="badge-tag badge-danger">🍗 Viande / Volaille</span>',
    poissons: '<span class="badge-tag badge-info">🦐 Poisson / Mer</span>',
    fromages: '<span class="badge-tag badge-warn">🧀 Fromage / Laitage</span>',
    legumes: '<span class="badge-tag badge-ok">🥗 Légume / Fruit</span>',
    epicerie: '<span class="badge-tag" style="background:#1e293b;color:#cbd5e1;border:1px solid #334155;">🍞 Épicerie / Autre</span>'
  };
  return map[cat] || map.epicerie;
}

let isIngredientsCompactView = false;
window.toggleIngredientsViewMode = function() {
  isIngredientsCompactView = !isIngredientsCompactView;
  const btn = document.getElementById('btn-toggle-ing-view');
  if (btn) {
    btn.innerHTML = isIngredientsCompactView ? '👁️ Vue : Synthétique (Active)' : '👁️ Vue : Détaillée (Active)';
  }
  renderSummaryTable();
};

function renderSummaryTable() {
  renderSummaryTopIngredientsPodium();
  const tbody = document.getElementById('tbody-ingredients');
  const search = cleanText(document.getElementById('search-ing').value);
  const activeCat = document.querySelector('.filter-btn.active') ? document.querySelector('.filter-btn.active').dataset.cat : 'all';

  const filtered = aggregatedIngredients.filter(ing => {
    if (activeCat && activeCat !== 'all' && ing.category !== activeCat) return false;
    if (search && !cleanText(ing.name).includes(search) && !cleanText(ing.category).includes(search)) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding: 36px; color: var(--muted);">
          ${currentSalesData.length === 0 ? 'Aucune vente enregistrée pour cette période.' : 'Aucun ingrédient ne correspond à vos filtres de recherche.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(ing => {
    let dishesHtml = '';
    if (isIngredientsCompactView) {
      const topDishes = ing.dishes.slice(0, 3).map(d => `${escapeHtml(d.dish)} (${d.lineTotal} ${d.unit})`).join(', ');
      const more = ing.dishes.length > 3 ? ` <span style="color:var(--muted); font-size:11px; font-weight:700;">+${ing.dishes.length - 3} autres</span>` : '';
      dishesHtml = `<span style="font-size:12px; color:var(--text);">${topDishes}${more}</span>`;
    } else {
      dishesHtml = ing.dishes.map(d => {
        let unitStr = d.unit;
        return `<span class="dish-pill" title="${d.portions} portions × ${d.unitQty} ${unitStr}">
          ${escapeHtml(d.dish)} : <span>${d.lineTotal} ${unitStr}</span>
        </span>`;
      }).join(' ');
    }

    return `
      <tr>
        <td><strong>${escapeHtml(ing.name)}</strong></td>
        <td>${getCategoryBadge(ing.category)}</td>
        <td>${formatIngQuantity(ing.totalQty, ing.unit, ing.name)}</td>
        <td><div class="dishes-pill-list">${dishesHtml}</div></td>
      </tr>
    `;
  }).join('');
}



let salesSortColumn = 'qty';
let salesSortDirection = -1; // -1 = desc, 1 = asc
let salesFamilyFilter = 'all';
let salesCategoryFilter = 'all'; // Filtre normalisé par catégorie
let chartMetric = 'qty'; // 'qty' ou 'ca'

// Liste universelle des catégories normalisées du restaurant
const GC_CATEGORIES = [
  { id: 'all', label: 'Toutes les Catégories', icon: '📁' },
  { id: 'petit-dej', label: 'Petit Déjeuner & Brunch', icon: '🥐' },
  { id: 'plat', label: 'Plats (Viandes & Poissons)', icon: '🥩' },
  { id: 'pizza', label: 'Pizzas', icon: '🍕' },
  { id: 'pasta', label: 'Pasta & Pâtes', icon: '🍝' },
  { id: 'burger', label: 'Burgers & Sandwiches', icon: '🍔' },
  { id: 'salade', label: 'Salades Composées', icon: '🥗' },
  { id: 'boisson', label: 'Bar, Cafés & Boissons', icon: '☕' },
  { id: 'dessert', label: 'Desserts & Douceurs', icon: '🍰' }
];

// Détection intelligente de la catégorie d'un plat ou d'une vente
function detectProductCategory(product, family, matchedRecipe) {
  const p = (product || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const f = (family || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const rCat = (matchedRecipe && matchedRecipe.category ? matchedRecipe.category : '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 1. PETIT DÉJEUNER / BRUNCH
  if (rCat.includes('PETIT') || rCat.includes('DEJEUNER') || f.includes('PETIT') || f.includes('DEJEUNER') || f.includes('BRUNCH') ||
      p.includes('BRUNCH') || p.includes('PETIT DEJ') || p.includes('OMELETTE') || p.includes('CROQUE') || p.includes('MLAOU') ||
      p.includes('HARCHA') || p.includes('BELDI') || p.includes('FORMULE MATIN')) {
    return 'petit-dej';
  }

  // 2. PIZZA
  if (rCat.includes('PIZZA') || f.includes('PIZZA') || p.includes('PIZZA') || p.includes('CALZONE')) {
    return 'pizza';
  }

  // 3. PASTA / PÂTES
  if (rCat.includes('PASTA') || rCat.includes('PATE') || f.includes('PASTA') || f.includes('PATE') ||
      p.includes('PASTA') || p.includes('TAGLIATELLE') || p.includes('SPAGHETTI') || p.includes('PENNE') ||
      p.includes('LASAGNE') || p.includes('TORTELLINI') || p.includes('RAVIOLI') || p.includes('MACARONI') || p.includes('FETTUCCINE')) {
    return 'pasta';
  }

  // 4. BURGERS & SANDWICHES
  if (rCat.includes('BURGER') || f.includes('BURGER') || p.includes('BURGER') || p.includes('SANDWICH') || p.includes('PANINI') || p.includes('TACOS') || p.includes('SMASH')) {
    return 'burger';
  }

  // 5. SALADES
  if (rCat.includes('SALADE') || f.includes('SALADE') || p.includes('SALADE') || p.includes('CESAR') || p.includes('CAESAR') || p.includes('BURRATA') || p.includes('BOWL')) {
    return 'salade';
  }

  // 6. DESSERTS / CRÊPES / DOUCEURS
  if (rCat.includes('DESSERT') || rCat.includes('CREPE') || rCat.includes('GAUFRE') || f.includes('DESSERT') || f.includes('CREPE') || f.includes('GAUFRE') ||
      p.includes('DESSERT') || p.includes('FONDANT') || p.includes('TIRAMISU') || p.includes('CHEESECAKE') || p.includes('CREPE') ||
      p.includes('GAUFRE') || p.includes('PANCAKE') || p.includes('GLACE') || p.includes('MUFFIN') || p.includes('TARTE') || p.includes('BROWNIE')) {
    return 'dessert';
  }

  // 7. BAR, BOISSONS, CAFÉS
  if (rCat.includes('BOISSON') || rCat.includes('CAFE') || rCat.includes('BAR') || rCat.includes('JUS') ||
      f.includes('BOISSON') || f.includes('CAFE') || f.includes('BAR') || f.includes('JUS') || f.includes('SODA') || f.includes('EAU') ||
      p.includes('CAFE') || p.includes('ESPRESSO') || p.includes('THE') || p.includes('JUS') || p.includes('MOJITO') || p.includes('COCKTAIL') ||
      p.includes('MOCKTAIL') || p.includes('SMOOTHIE') || p.includes('MILKSHAKE') || p.includes('SIDI') || p.includes('COCA') || p.includes('SPRITE') ||
      p.includes('EAU') || p.includes('RED BULL') || p.includes('CAPPUCCINO')) {
    return 'boisson';
  }

  // 8. PLATS PRINCIPAUX (Viandes, Volailles, Poissons)
  if (rCat.includes('PLAT') || rCat.includes('VIANDE') || rCat.includes('POISSON') ||
      f.includes('PLAT') || f.includes('VIANDE') || f.includes('POISSON') ||
      p.includes('FILET') || p.includes('STEAK') || p.includes('BOEUF') || p.includes('POULET') ||
      p.includes('SAUMON') || p.includes('CALAMAR') || p.includes('GAMBAS') || p.includes('CREVETTE') ||
      p.includes('ESCALOPE') || p.includes('TAJINE') || p.includes('EMINCE') || p.includes('PAVE')) {
    return 'plat';
  }

  return 'plat';
}

function renderSalesCategoryPillBar() {
  const container = document.getElementById('sales-category-pill-bar');
  if (!container) return;

  const sales = currentSalesData || [];
  const totalVolumeAll = sales.reduce((acc, s) => acc + (s.qty || 0), 0);

  // Calcul du volume vendu par catégorie
  const volumeByCat = {};
  GC_CATEGORIES.forEach(c => { volumeByCat[c.id] = 0; });
  volumeByCat['all'] = totalVolumeAll;

  sales.forEach(s => {
    const catId = detectProductCategory(s.product, s.family, s.matchedRecipe);
    volumeByCat[catId] = (volumeByCat[catId] || 0) + (s.qty || 0);
  });

  container.innerHTML = GC_CATEGORIES.map(cat => {
    const vol = volumeByCat[cat.id] || 0;
    const isActive = salesCategoryFilter === cat.id;
    // Si la catégorie n'a pas de vente et n'est pas 'all', on l'affiche quand même si elle fait partie des catégories phares
    return `
      <button type="button" class="cat-pill-btn ${isActive ? 'active' : ''}" onclick="onSalesCategoryPillClick('${cat.id}')">
        <span>${cat.icon}</span>
        <span>${cat.label}</span>
        <span class="cat-pill-count">${vol.toLocaleString('fr-FR')}</span>
      </button>
    `;
  }).join('');

  const activeLabel = document.getElementById('sales-cat-active-label');
  if (activeLabel) {
    if (salesCategoryFilter === 'all') {
      activeLabel.textContent = `Toutes les catégories (${totalVolumeAll.toLocaleString('fr-FR')} unités vendues)`;
    } else {
      const activeObj = GC_CATEGORIES.find(c => c.id === salesCategoryFilter);
      const activeVol = volumeByCat[salesCategoryFilter] || 0;
      activeLabel.textContent = `Filtre actif : ${activeObj ? activeObj.icon + ' ' + activeObj.label : salesCategoryFilter} (${activeVol.toLocaleString('fr-FR')} unités vendues)`;
    }
  }
}

function onSalesCategoryPillClick(catId) {
  salesCategoryFilter = catId;
  renderSalesCategoryPillBar();
  renderSalesTable();
}

function populateSalesFamilyDropdown() {
  const select = document.getElementById('filter-sales-family');
  if (!select) return;
  const currentVal = select.value || 'all';

  const families = new Set();
  (currentSalesData || []).forEach(s => {
    if (s.family && s.family.trim()) families.add(s.family.trim());
  });

  const sortedFamilies = Array.from(families).sort((a, b) => a.localeCompare(b, 'fr'));
  
  let optionsHtml = '<option value="all">📁 Toutes les Catégories</option>';
  sortedFamilies.forEach(f => {
    const isSelected = f === currentVal ? 'selected' : '';
    optionsHtml += `<option value="${escapeHtml(f)}" ${isSelected}>${escapeHtml(f)}</option>`;
  });

  select.innerHTML = optionsHtml;
}

function onSalesFamilyFilterChange(val) {
  salesFamilyFilter = val;
  renderSalesTable();
}

function onSalesSortDropdownChange(val) {
  if (val === 'qty-desc') { salesSortColumn = 'qty'; salesSortDirection = -1; }
  else if (val === 'qty-asc') { salesSortColumn = 'qty'; salesSortDirection = 1; }
  else if (val === 'total-desc') { salesSortColumn = 'total'; salesSortDirection = -1; }
  else if (val === 'family-asc') { salesSortColumn = 'family'; salesSortDirection = 1; }
  else if (val === 'product-asc') { salesSortColumn = 'product'; salesSortDirection = 1; }
  
  updateSalesSortHeaderIcons();
  renderSalesTable();
}

function toggleSalesSort(col) {
  if (salesSortColumn === col) {
    salesSortDirection *= -1;
  } else {
    salesSortColumn = col;
    salesSortDirection = (col === 'qty' || col === 'total') ? -1 : 1;
  }

  const sel = document.getElementById('sort-sales-select');
  if (sel) {
    if (col === 'qty') sel.value = salesSortDirection === -1 ? 'qty-desc' : 'qty-asc';
    else if (col === 'total') sel.value = 'total-desc';
    else if (col === 'family') sel.value = 'family-asc';
    else if (col === 'product') sel.value = 'product-asc';
  }

  updateSalesSortHeaderIcons();
  renderSalesTable();
}

function updateSalesSortHeaderIcons() {
  const iconMap = { family: 'sort-icon-family', product: 'sort-icon-product', qty: 'sort-icon-qty', total: 'sort-icon-total' };
  Object.entries(iconMap).forEach(([k, id]) => {
    const el = document.getElementById(id);
    if (el) {
      if (salesSortColumn === k) {
        el.textContent = salesSortDirection === -1 ? ' ▼' : ' ▲';
        el.style.color = 'var(--accent)';
      } else {
        el.textContent = '';
      }
    }
  });
}

function setSalesFilter(filterVal) {
  currentSalesFilter = filterVal;
  document.querySelectorAll('#tab-sales .filter-btn[data-filter]').forEach(btn => {
    if (btn.dataset.filter === filterVal) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  renderSalesTable();
}

function setChartMetric(metric) {
  chartMetric = metric;
  const btnQty = document.getElementById('btn-chart-mode-qty');
  const btnCA = document.getElementById('btn-chart-mode-ca');
  if (btnQty && btnCA) {
    if (metric === 'qty') {
      btnQty.classList.add('active');
      btnCA.classList.remove('active');
    } else {
      btnCA.classList.add('active');
      btnQty.classList.remove('active');
    }
  }
  renderSalesBarChart();
}

function renderSalesTable() {
  const tbody = document.getElementById('tbody-sales');
  const search = cleanText(document.getElementById('search-sales').value);

  populateSalesFamilyDropdown();
  renderSalesCategoryPillBar();

  let filtered = currentSalesData.filter(s => {
    if (currentSalesFilter === 'matched' && !s.matchedRecipe) return false;
    if (currentSalesFilter === 'unmatched' && s.matchedRecipe) return false;
    if (salesCategoryFilter !== 'all') {
      const cat = detectProductCategory(s.product, s.family, s.matchedRecipe);
      if (cat !== salesCategoryFilter) return false;
    }
    if (salesFamilyFilter !== 'all' && s.family !== salesFamilyFilter) return false;
    if (search && !cleanText(s.product).includes(search) && !cleanText(s.family).includes(search)) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (salesSortColumn === 'qty') return salesSortDirection * (a.qty - b.qty);
    if (salesSortColumn === 'total') return salesSortDirection * (a.total - b.total);
    if (salesSortColumn === 'family') return salesSortDirection * (a.family || '').localeCompare(b.family || '', 'fr');
    if (salesSortColumn === 'product') return salesSortDirection * (a.product || '').localeCompare(b.product || '', 'fr');
    return 0;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 36px; color: var(--muted);">
          ${currentSalesData.length === 0 ? 'Aucune donnée de vente chargée.' : 'Aucune vente ne correspond à vos critères de recherche et filtres.'}
        </td>
      </tr>
    `;
    renderSalesBarChart();
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const hasRecipe = !!s.matchedRecipe;
    const statusBadge = hasRecipe
      ? `<span class="badge-tag badge-ok">✅ ${escapeHtml(s.matchedRecipe.name)}</span>`
      : `<span class="badge-tag badge-warn">⚠️ Non configuré / Boisson</span>`;

    const ingsList = hasRecipe
      ? s.matchedRecipe.ingredients.map(i => `<span class="dish-pill">${escapeHtml(i)}</span>`).join(' ')
      : '<span style="color:var(--muted); font-size:12px;">Article sans fiche technique</span>';

    return `
      <tr>
        <td><span class="chip-pill" style="font-size:11px;">${escapeHtml(s.family)}</span></td>
        <td><strong style="color:var(--text); font-size:13.5px;">${escapeHtml(s.product)}</strong></td>
        <td style="text-align:right;"><span class="qty-highlight" style="font-size:14px; font-weight:900;">${s.qty.toLocaleString('fr-FR')}</span></td>
        <td style="text-align:right;"><strong style="color:var(--accent); font-size:13.5px;">${s.total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</strong></td>
        <td>${statusBadge}</td>
        <td><div class="dishes-pill-list">${ingsList}</div></td>
        <td>
          <button class="btn" style="padding: 4px 8px; font-size:11.5px;" onclick="openRecipeEditor('${escapeHtml(s.product).replace(/'/g, "\\'")}')">
            ${hasRecipe ? '✏️ Éditer' : '➕ Créer Recette'}
          </button>
        </td>
      </tr>
    `;
  }).join('');

  renderSalesBarChart();
  renderLowSalesTable();
}

function renderSalesBarChart() {
  const container = document.getElementById('sales-barchart-container');
  const kpiGrid = document.getElementById('chart-kpis-grid');
  if (!container || !kpiGrid) return;

  if (!currentSalesData || currentSalesData.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--muted);">Aucune donnée de vente pour générer le diagramme.</div>`;
    kpiGrid.innerHTML = '';
    return;
  }

  let items = currentSalesData.filter(s => {
    if (salesCategoryFilter !== 'all') {
      const cat = detectProductCategory(s.product, s.family, s.matchedRecipe);
      if (cat !== salesCategoryFilter) return false;
    }
    if (salesFamilyFilter !== 'all' && s.family !== salesFamilyFilter) return false;
    return true;
  });

  if (items.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--muted);">Aucun produit pour la catégorie sélectionnée.</div>`;
    kpiGrid.innerHTML = '';
    return;
  }

  const totalVolume = items.reduce((acc, x) => acc + (x.qty || 0), 0);
  const totalRevenue = items.reduce((acc, x) => acc + (x.total || 0), 0);

  const sorted = [...items].sort((a, b) => {
    if (chartMetric === 'ca') return b.total - a.total;
    return b.qty - a.qty;
  });

  const limitVal = document.getElementById('chart-limit-select') ? document.getElementById('chart-limit-select').value : '15';
  const limitCount = limitVal === 'all' ? sorted.length : parseInt(limitVal, 10);
  const topList = sorted.slice(0, limitCount);

  const topByQty = [...items].sort((a, b) => b.qty - a.qty)[0];
  const topByCA = [...items].sort((a, b) => b.total - a.total)[0];
  const top5Items = sorted.slice(0, 5);
  const top5Volume = top5Items.reduce((acc, x) => acc + x.qty, 0);
  const top5VolumePct = totalVolume > 0 ? Math.round((top5Volume / totalVolume) * 100) : 0;
  const top5Revenue = top5Items.reduce((acc, x) => acc + x.total, 0);
  const top5RevenuePct = totalRevenue > 0 ? Math.round((top5Revenue / totalRevenue) * 100) : 0;

  kpiGrid.innerHTML = `
    <div style="background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:12px; border-left:4px solid #10b981;">
      <div style="font-size:11px; font-weight:800; color:var(--muted); text-transform:uppercase;">🥇 #1 en Volume Vendu</div>
      <div style="font-size:14.5px; font-weight:800; color:var(--text); margin:3px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(topByQty.product)}">
        ${escapeHtml(topByQty.product)}
      </div>
      <div style="font-size:12px; font-weight:800; color:#10b981;">
        ${topByQty.qty.toLocaleString('fr-FR')} unités <span style="font-weight:normal; color:var(--muted);">(${totalVolume > 0 ? ((topByQty.qty / totalVolume) * 100).toFixed(1) : 0}% du volume)</span>
      </div>
    </div>

    <div style="background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:12px; border-left:4px solid var(--accent);">
      <div style="font-size:11px; font-weight:800; color:var(--muted); text-transform:uppercase;">💰 #1 en Chiffre d'Affaires</div>
      <div style="font-size:14.5px; font-weight:800; color:var(--text); margin:3px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(topByCA.product)}">
        ${escapeHtml(topByCA.product)}
      </div>
      <div style="font-size:12px; font-weight:800; color:var(--accent);">
        ${topByCA.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH <span style="font-weight:normal; color:var(--muted);">(${totalRevenue > 0 ? ((topByCA.total / totalRevenue) * 100).toFixed(1) : 0}% du CA)</span>
      </div>
    </div>

    <div style="background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:12px; border-left:4px solid #a78bfa;">
      <div style="font-size:11px; font-weight:800; color:var(--muted); text-transform:uppercase;">⭐ Concentration Top 5</div>
      <div style="font-size:15px; font-weight:900; color:#a78bfa; margin:3px 0;">
        ${chartMetric === 'ca' ? `${top5RevenuePct}% du Chiffre d'Affaires` : `${top5VolumePct}% du Volume Total`}
      </div>
      <div style="font-size:11.5px; color:var(--muted);">
        Les 5 articles leaders de la carte
      </div>
    </div>
  `;

  const maxValue = chartMetric === 'ca' ? (sorted[0].total || 1) : (sorted[0].qty || 1);

  container.innerHTML = topList.map((item, idx) => {
    const rank = idx + 1;
    const valNumber = chartMetric === 'ca' ? item.total : item.qty;
    const barWidthPct = maxValue > 0 ? Math.max(4, Math.round((valNumber / maxValue) * 100)) : 0;

    const sharePct = chartMetric === 'ca'
      ? (totalRevenue > 0 ? ((item.total / totalRevenue) * 100).toFixed(1) : 0)
      : (totalVolume > 0 ? ((item.qty / totalVolume) * 100).toFixed(1) : 0);

    const valDisplay = chartMetric === 'ca'
      ? `${item.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH`
      : `${item.qty.toLocaleString('fr-FR')} vendus`;

    let barGradient = 'linear-gradient(90deg, #0284c7, #38bdf8)';
    let rankBadge = `<span style="font-size:12px; font-weight:800; color:var(--muted);">#${rank}</span>`;
    
    if (rank === 1) {
      barGradient = 'linear-gradient(90deg, #eab308, #fef08a)';
      rankBadge = `<span style="font-size:15px;" title="1ère place">🥇</span>`;
    } else if (rank === 2) {
      barGradient = 'linear-gradient(90deg, #94a3b8, #e2e8f0)';
      rankBadge = `<span style="font-size:15px;" title="2ème place">🥈</span>`;
    } else if (rank === 3) {
      barGradient = 'linear-gradient(90deg, #b45309, #fed7aa)';
      rankBadge = `<span style="font-size:15px;" title="3ème place">🥉</span>`;
    } else if (rank <= 5) {
      barGradient = 'linear-gradient(90deg, #10b981, #6ee7b7)';
    }

    return `
      <div style="display:grid; grid-template-columns: 36px minmax(170px, 240px) 1fr 140px; align-items:center; gap:12px; padding:7px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--border); transition:all 0.15s ease;">
        <div style="text-align:center;">${rankBadge}</div>
        
        <div style="min-width:0;">
          <div style="font-weight:800; font-size:13px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(item.product)}">
            ${escapeHtml(item.product)}
          </div>
          <div style="font-size:11px; color:var(--muted);">${escapeHtml(item.family || 'AUTRE')}</div>
        </div>

        <div style="position:relative; width:100%; height:20px; background:rgba(0,0,0,0.12); border-radius:6px; overflow:hidden; border:1px solid var(--border);">
          <div style="height:100%; width:${barWidthPct}%; background:${barGradient}; border-radius:5px; transition:width 0.4s ease;"></div>
        </div>

        <div style="text-align:right; font-variant-numeric:tabular-nums;">
          <strong style="font-size:13px; color:var(--text);">${valDisplay}</strong>
          <span style="font-size:10.5px; color:var(--muted); display:block;">${sharePct}% du total</span>
        </div>
      </div>
    `;
  }).join('');
}

let lowSalesFilter = 'all'; // 'all', 'zero', 'low'

function setLowSalesFilter(val) {
  lowSalesFilter = val;
  const btnAll = document.getElementById('btn-low-filter-all');
  const btnZero = document.getElementById('btn-low-filter-zero');
  const btnLow = document.getElementById('btn-low-filter-low');
  if (btnAll) btnAll.classList.toggle('active', val === 'all');
  if (btnZero) btnZero.classList.toggle('active', val === 'zero');
  if (btnLow) btnLow.classList.toggle('active', val === 'low');
  renderLowSalesTable();
}

function renderLowSalesTable() {
  const tbody = document.getElementById('tbody-low-sales');
  const searchInput = document.getElementById('search-low-sales');
  if (!tbody) return;

  const search = cleanText(searchInput ? searchInput.value : '');

  // 1. Construire une map des ventes par produit (nom normalisé)
  const salesMap = new Map();
  (currentSalesData || []).forEach(s => {
    const key = cleanText(s.product);
    salesMap.set(key, (salesMap.get(key) || 0) + (s.qty || 0));
    if (s.matchedRecipe && s.matchedRecipe.name) {
      const rKey = cleanText(s.matchedRecipe.name);
      if (rKey && rKey !== key) {
        salesMap.set(rKey, (salesMap.get(rKey) || 0) + (s.qty || 0));
      }
    }
  });

  // 2. Récupérer toutes les fiches de la carte (activeRecipes)
  const allMenuItems = [];
  const seenNames = new Set();

  if (Array.isArray(activeRecipes)) {
    activeRecipes.forEach(r => {
      const norm = cleanText(r.name);
      if (!seenNames.has(norm)) {
        seenNames.add(norm);
        const qtySold = salesMap.get(norm) || 0;
        const sellPrice = r.sellPrice || findSellingPriceForRecipe(r.name) || 0;
        const fc = typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost(r.ingredients, sellPrice) : { cost: 0 };
        allMenuItems.push({
          id: r.id,
          name: r.name,
          category: r.category || 'AUTRE',
          sellPrice: sellPrice,
          cost: fc.cost || 0,
          qtySold: qtySold,
          totalCA: qtySold * sellPrice,
          isRecipe: true
        });
      }
    });
  }

  // Ajouter aussi les articles de vente qui ont <= 2 ventes
  (currentSalesData || []).forEach(s => {
    const norm = cleanText(s.product);
    if (!seenNames.has(norm)) {
      seenNames.add(norm);
      if ((s.qty || 0) <= 2) {
        allMenuItems.push({
          id: s.product,
          name: s.product,
          category: s.family || 'AUTRE',
          sellPrice: s.price || (s.qty > 0 ? (s.total / s.qty) : 0),
          cost: 0,
          qtySold: s.qty || 0,
          totalCA: s.total || 0,
          isRecipe: false
        });
      }
    }
  });

  // 3. Filtrer uniquement les articles à 0 vente ou faible rendement (<= 2 ventes)
  const zeroSalesList = allMenuItems.filter(item => item.qtySold === 0);
  const lowSalesList = allMenuItems.filter(item => item.qtySold > 0 && item.qtySold <= 2);
  const allProblemItems = allMenuItems.filter(item => item.qtySold <= 2);

  // Mettre à jour les compteurs
  const elCountBadge = document.getElementById('low-sales-count-badge');
  const elCountAll = document.getElementById('count-low-all');
  const elCountZero = document.getElementById('count-low-zero');
  const elCountLow = document.getElementById('count-low-low');

  if (elCountBadge) elCountBadge.textContent = `${allProblemItems.length} articles`;
  if (elCountAll) elCountAll.textContent = allProblemItems.length;
  if (elCountZero) elCountZero.textContent = zeroSalesList.length;
  if (elCountLow) elCountLow.textContent = lowSalesList.length;

  // Filtrer selon l'onglet actif
  let displayed = allProblemItems;
  if (lowSalesFilter === 'zero') displayed = zeroSalesList;
  else if (lowSalesFilter === 'low') displayed = lowSalesList;

  // Filtrer par recherche
  if (search) {
    displayed = displayed.filter(item => cleanText(item.name).includes(search) || cleanText(item.category).includes(search));
  }

  // Trier par quantité vendue croissant (0 en premier, puis 1, puis 2)
  displayed.sort((a, b) => {
    if (a.qtySold !== b.qtySold) return a.qtySold - b.qtySold;
    return a.name.localeCompare(b.name, 'fr');
  });

  if (displayed.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:30px; color:var(--muted);">
          ${allProblemItems.length === 0 ? '🎉 Excellent ! Tous les articles de la carte ont un bon niveau de vente.' : 'Aucun article ne correspond à votre filtre.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = displayed.map(item => {
    let statusBadge = '';
    let recoText = '';

    if (item.qtySold === 0) {
      statusBadge = '<span class="status-badge danger" style="padding:3px 8px; font-size:11px;">💤 0 Vente (Produit Dormant)</span>';
      recoText = '<span style="color:#ef4444; font-size:11.5px; font-weight:700;">Risque de perte / À promouvoir ou réviser</span>';
    } else if (item.qtySold === 1) {
      statusBadge = '<span class="status-badge warn" style="padding:3px 8px; font-size:11px;">⚠️ 1 seule vente</span>';
      recoText = '<span style="color:#f59e0b; font-size:11.5px; font-weight:700;">Faible rotation / Évaluer popularité</span>';
    } else {
      statusBadge = '<span class="status-badge warn" style="padding:3px 8px; font-size:11px; background:rgba(234,179,8,0.15); color:#ca8a04;">📉 2 ventes</span>';
      recoText = '<span style="color:var(--muted); font-size:11.5px;">Volume modeste</span>';
    }

    return `
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:10px 12px;">
          <strong style="color:var(--text); font-size:13px;">${escapeHtml(item.name)}</strong>
          <div style="font-size:11px; color:var(--muted); margin-top:2px;">${recoText}</div>
        </td>
        <td style="padding:10px;"><span class="chip-pill" style="font-size:10.5px;">${escapeHtml(item.category)}</span></td>
        <td style="padding:10px; text-align:right; font-weight:800; color:var(--text);">${item.sellPrice > 0 ? `${item.sellPrice.toFixed(2)} DH` : '-'}</td>
        <td style="padding:10px; text-align:right; font-weight:700; color:#38bdf8;">${item.cost > 0 ? `${item.cost.toFixed(2)} DH` : '-'}</td>
        <td style="padding:10px; text-align:center;">
          <span class="qty-highlight" style="font-size:13px; font-weight:900; background:${item.qtySold === 0 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}; color:${item.qtySold === 0 ? '#ef4444' : '#d97706'}; padding:2px 8px; border-radius:6px;">
            ${item.qtySold}
          </span>
        </td>
        <td style="padding:10px; text-align:right; font-weight:800; color:var(--muted);">${item.totalCA.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</td>
        <td style="padding:10px; text-align:center;">${statusBadge}</td>
        <td style="padding:10px; text-align:center;">
          <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="openRecipeEditor('${escapeHtml(item.name).replace(/'/g, "\\'")}')">
            ✏️ Fiche Tech.
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

