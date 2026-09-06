/**
 * GREY CORNER — Point d Entrée, Onglets & Initialisation DOM
 * Module: conso-main.js
 */

function switchToTab(tabId) {
  document.querySelectorAll('.v-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
  const btn = document.querySelector(`[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
  const tab = document.getElementById(tabId);
  if (tab) {
    tab.style.display = 'block';
    if (typeof tab.getBoundingClientRect === 'function') {
      const rect = tab.getBoundingClientRect();
      if ((rect.top < 0 || rect.top > (window.innerHeight || 1000)) && typeof tab.scrollIntoView === 'function') {
        tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
  if (tabId === 'tab-comparator') {
    renderComparatorTab();
  }
  if (window.GC_BurgerMenu) {
    window.GC_BurgerMenu.setActiveItem(tabId);
  }
  if (window.location.hash !== '#' + tabId) {
    history.pushState(null, '', '#' + tabId);
  }
}

function switchToTabAndCloseDrawer(tabId) {
  switchToTab(tabId);
  if (window.GC_BurgerMenu) {
    window.GC_BurgerMenu.setActiveItem(tabId);
    window.GC_BurgerMenu.close();
  }
}

function navigateToHologramAndCloseDrawer() {
  switchToTab('tab-menu-engineering');
  if (window.GC_BurgerMenu) {
    window.GC_BurgerMenu.setActiveItem('nav-hologram');
    window.GC_BurgerMenu.close();
  }
  setTimeout(() => {
    const holo = document.querySelector('.hologram-card');
    if (holo) {
      holo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 150);
}

function toggleCalendarCard(forceOpen = false) {
  const cal = document.getElementById('calendar-card-panel');
  const btn = document.getElementById('btn-toggle-calendar');
  if (!cal) return;
  const isHidden = cal.style.display === 'none';
  if (forceOpen || isHidden) {
    cal.style.display = 'block';
    if (btn) {
      btn.classList.add('is-active');
      btn.textContent = '📅 Calendrier ▲';
    }
  } else {
    cal.style.display = 'none';
    if (btn) {
      btn.classList.remove('is-active');
      btn.textContent = '📅 Calendrier ▾';
    }
  }
}

function toggleDropZone(forceOpen = false) {
  const dz = document.getElementById('drop-zone');
  const btn = document.getElementById('btn-toggle-dropzone');
  if (!dz) return;
  const isHidden = dz.style.display === 'none';
  if (forceOpen || isHidden) {
    dz.style.display = 'block';
    if (btn) {
      btn.classList.add('is-active');
      btn.textContent = '📁 Importer Ventes ▲';
    }
  } else {
    dz.style.display = 'none';
    if (btn) {
      btn.classList.remove('is-active');
      btn.textContent = '📁 Importer Ventes ▾';
    }
  }
}

function toggleStatsSection(forceOpen = false) {
  const sec = document.getElementById('stats-section');
  const btn = document.getElementById('btn-toggle-stats');
  if (!sec) return;
  const isHidden = sec.style.display === 'none';
  if (forceOpen || isHidden) {
    sec.style.display = 'grid';
    if (btn) {
      btn.classList.add('is-active');
      btn.textContent = '📊 KPIs ▲';
    }
  } else {
    sec.style.display = 'none';
    if (btn) {
      btn.classList.remove('is-active');
      btn.textContent = '📊 KPIs ▾';
    }
  }
}

function updateCompactTopBar({ totalCA, totalQty, salesLines, distinctProducts, periodTitle, isMonthly, activeDaysCount }) {
  const pLabel = document.getElementById('destock-compact-period-label');
  const caEl = document.getElementById('destock-compact-ca');
  const qtyEl = document.getElementById('destock-compact-qty');
  const daysEl = document.getElementById('destock-compact-days');

  if (pLabel) {
    if (currentViewMode === 'year') {
      pLabel.textContent = `Cumul Année ${selectedYearMonth.slice(0, 4)}`;
    } else if (isMonthly) {
      pLabel.textContent = `Mois ${formatMonthFR(selectedYearMonth)}`;
    } else {
      pLabel.textContent = periodTitle || `Jour ${selectedDate}`;
    }
  }
  if (caEl) caEl.textContent = (totalCA || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' DH';
  if (qtyEl) qtyEl.textContent = (totalQty || 0).toLocaleString('fr-FR');
  if (daysEl) daysEl.textContent = `${activeDaysCount || 1} j. actif${(activeDaysCount || 1) > 1 ? 's' : ''}`;
}

function switchToAuditTab() {
  switchToTab('tab-audit');
}

window.switchToTab = switchToTab;
window.switchToAuditTab = switchToAuditTab;
window.switchToTabAndCloseDrawer = switchToTabAndCloseDrawer;
window.navigateToHologramAndCloseDrawer = navigateToHologramAndCloseDrawer;
window.toggleCalendarCard = toggleCalendarCard;
window.toggleDropZone = toggleDropZone;
window.toggleStatsSection = toggleStatsSection;
window.updateCompactTopBar = updateCompactTopBar;

window.setComparatorMode = setComparatorMode;
window.setComparatorCategoryFilter = setComparatorCategoryFilter;
window.renderComparatorTab = renderComparatorTab;
window.exportComparatorToExcel = exportComparatorToExcel;
window.onSalesCategoryPillClick = onSalesCategoryPillClick;
window.renderSalesCategoryPillBar = renderSalesCategoryPillBar;
window.detectProductCategory = detectProductCategory;

window.setMenuEngQuadrantFilter = setMenuEngQuadrantFilter;
window.onMenuEngFamilyFilterChange = onMenuEngFamilyFilterChange;
window.onMenuEngSortChange = onMenuEngSortChange;
window.renderMenuEngineeringMatrix = renderMenuEngineeringMatrix;
window.renderMenuEngineeringTable = renderMenuEngineeringTable;
window.renderMenuEngineeringScatterPlot = renderMenuEngineeringScatterPlot;
window.renderSummaryTopIngredientsPodium = renderSummaryTopIngredientsPodium;

/* ========================================================
   12. INITIALISATION & GESTIONNAIRES D'ÉVÉNEMENTS
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'tab-audit' || hash === 'audit') switchToTab('tab-audit');
    else if (hash === 'tab-menu-engineering' || hash === 'menu-engineering') switchToTab('tab-menu-engineering');
    else if (hash === 'tab-sales' || hash === 'sales') switchToTab('tab-sales');
    else if (hash === 'tab-recipes' || hash === 'recipes') switchToTab('tab-recipes');
    else if (hash === 'tab-summary' || hash === 'summary') switchToTab('tab-summary');
    else if (hash === 'tab-comparator' || hash === 'comparator') switchToTab('tab-comparator');
  });
  if (window.location.hash === '#tab-audit' || window.location.hash === '#audit') {
    setTimeout(() => {
      switchToTab('tab-audit');
    }, 100);
  } else if (window.location.hash === '#tab-comparator' || window.location.hash === '#comparator') {
    setTimeout(() => {
      switchToTab('tab-comparator');
    }, 100);
  }
  document.getElementById('print-date-val').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  loadRecipes();
  loadMonthlySalesDB();
  renderRecipeList();
  renderCalendar();
  recalculateCurrentView();
  autoScanVentesFolder(false);

  // Drag & Drop
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadedFiles(e.dataTransfer.files);
    }
  });
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadedFiles(e.target.files);
    }
  });



  // Bouton Export Excel
  const expBtn = document.getElementById('btn-export-excel');
  if (expBtn) expBtn.addEventListener('click', exportToExcel);

  // Tabs de vue
  document.querySelectorAll('.v-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      switchToTab(targetId);
    });
  });

  // Recherche Ingrédients
  document.getElementById('search-ing').addEventListener('input', renderSummaryTable);
  document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSummaryTable();
    });
  });

  // Recherche Ventes
  document.getElementById('search-sales').addEventListener('input', renderSalesTable);
  
  // Wire up sales filter buttons (restreint à l'onglet Ventes)
  document.querySelectorAll('#tab-sales .filter-group .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tab-sales .filter-group .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSalesFilter = btn.dataset.filter;
      renderSalesTable();
    });
  });

  // Recherche Recettes
  document.getElementById('search-recipe-list').addEventListener('input', renderRecipeList);

  // Ajouter / Reset Recettes
  document.getElementById('btn-add-recipe').addEventListener('click', () => {
    document.getElementById('edit-recipe-id').value = 'rec_' + Date.now();
    document.getElementById('edit-recipe-name').value = '';
    document.getElementById('edit-recipe-cat').value = 'PLATS';
    document.getElementById('edit-recipe-ingredients').value = '';
    document.getElementById('modal-recipe-title').textContent = 'Nouvelle Fiche Technique';
    document.getElementById('recipe-modal').classList.add('visible');
  });

  document.getElementById('btn-reset-recipes').addEventListener('click', () => {
    if (confirm('Voulez-vous réinitialiser toutes les fiches techniques aux valeurs d\'origine ?')) {
      localStorage.removeItem('gc_recipes_db_v4');
      localStorage.removeItem(GC_STORAGE_KEYS.RECIPES);
      localStorage.removeItem('gc_recipes_db_version');
      loadRecipes();
      renderRecipeList();
      recalculateCurrentView();
    }
  });

  // Gestion du Thème Clair / Sombre
  initThemeManager();

  // Tri de tableau
  let sortDirection = 1;
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const type = th.dataset.sort;
      sortDirection *= -1;
      if (type === 'name') {
        aggregatedIngredients.sort((a, b) => sortDirection * a.name.localeCompare(b.name));
      } else if (type === 'cat') {
        aggregatedIngredients.sort((a, b) => sortDirection * a.category.localeCompare(b.category));
      } else if (type === 'qty') {
        aggregatedIngredients.sort((a, b) => sortDirection * (a.totalQty - b.totalQty));
      }
      renderSummaryTable();
    });
  });
});
