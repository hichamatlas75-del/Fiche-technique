/**
 * GREY CORNER — Matrice Kasavana & Smith & Radar Holographique 3D Canvas
 * Module: conso-menu-engineering.js
 */

/* ========================================================
   11. MATRICE DE MENU ENGINEERING (KASAVANA & SMITH)
======================================================== */
var menuEngQuadrantFilter = 'all'; // 'all', 'star', 'plowhorse', 'puzzle', 'dog'
var menuEngFamilyFilter = 'all';
var menuEngSortMetric = 'profit'; // 'profit', 'margin', 'qty', 'ca', 'foodcost'
var menuEngData = [];

function setMenuEngQuadrantFilter(quad) {
  menuEngQuadrantFilter = quad;
  
  // Mettre à jour les boutons de filtre
  const btnAll = document.getElementById('btn-me-filter-all');
  const btnStar = document.getElementById('btn-me-filter-star');
  const btnPlowhorse = document.getElementById('btn-me-filter-plowhorse');
  const btnPuzzle = document.getElementById('btn-me-filter-puzzle');
  const btnDog = document.getElementById('btn-me-filter-dog');
  
  if (btnAll) btnAll.classList.toggle('active', quad === 'all');
  if (btnStar) btnStar.classList.toggle('active', quad === 'star');
  if (btnPlowhorse) btnPlowhorse.classList.toggle('active', quad === 'plowhorse');
  if (btnPuzzle) btnPuzzle.classList.toggle('active', quad === 'puzzle');
  if (btnDog) btnDog.classList.toggle('active', quad === 'dog');

  // Mettre en surbrillance la carte de quadrant correspondante
  document.querySelectorAll('.quad-card').forEach(c => c.classList.remove('active-filter'));
  if (quad !== 'all') {
    const activeCard = document.querySelector('.quad-' + quad);
    if (activeCard) activeCard.classList.add('active-filter');
  }

  renderMenuEngineeringTable();
  renderMenuEngineeringScatterPlot();
}

function onMenuEngFamilyFilterChange(val) {
  menuEngFamilyFilter = val;
  renderMenuEngineeringTable();
  renderMenuEngineeringScatterPlot();
}

function onMenuEngSortChange(val) {
  menuEngSortMetric = val;
  renderMenuEngineeringTable();
  renderMenuEngineeringScatterPlot();
}

function populateMenuEngFamilyDropdown(families) {
  const select = document.getElementById('filter-me-family');
  if (!select) return;
  const current = select.value || 'all';
  select.innerHTML = '<option value="all">📁 Toutes les Familles</option>';
  (families || []).forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    if (f === current) opt.selected = true;
    select.appendChild(opt);
  });
}

function renderMenuEngineeringMatrix() {
  const tbody = document.getElementById('tbody-menu-engineering');
  const countTabBadge = document.getElementById('count-menu-eng');
  if (!tbody) return;

  if (!currentSalesData || currentSalesData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--muted);">Aucune donnée de vente pour générer la matrice.</td></tr>';
    if (countTabBadge) countTabBadge.textContent = '0';
    return;
  }

  // 1. Calculer les métriques individuelles pour chaque article vendu
  let totalVolume = 0;
  let totalGrossProfit = 0;
  let totalRevenue = 0;
  const distinctFamilies = new Set();
  const classifiedItems = [];

  currentSalesData.forEach(sale => {
    const qty = sale.qty || 0;
    if (qty <= 0) return;

    const family = sale.family || 'DIVERS';
    const famClean = cleanText(family);
    const prodClean = cleanText(sale.product || '');

    // Exclusion explicite des catégories "A LA CARTE", "PERSONNEL" et consommations internes
    if (
      famClean === 'a la carte' ||
      famClean === 'a la carte boulangerie' ||
      famClean.includes('a la carte') ||
      famClean === 'personnel' ||
      famClean.includes('personnel') ||
      prodClean.includes('personnel')
    ) {
      return;
    }

    let recipe = sale.matchedRecipe;
    if (!recipe && typeof findRecipeForProduct === 'function') {
      recipe = findRecipeForProduct(sale.product, sale.family);
    }

    const recCatClean = recipe && recipe.category ? cleanText(recipe.category) : '';
    if (
      recCatClean === 'a la carte' ||
      recCatClean === 'a la carte boulangerie' ||
      recCatClean.includes('a la carte') ||
      recCatClean === 'personnel' ||
      recCatClean.includes('personnel')
    ) {
      return;
    }

    // Exclusion métier stricte : Sodas, Eaux minérales & Suppléments/Extras cuisine
    const checkExcludedME = typeof isExcludedFromMenuEngineering === 'function'
      ? isExcludedFromMenuEngineering
      : (typeof window !== 'undefined' && typeof window.isExcludedFromMenuEngineering === 'function' ? window.isExcludedFromMenuEngineering : null);

    if (checkExcludedME) {
      if (checkExcludedME(sale.product, recipe ? recipe.category : '', sale.family, recipe ? (recipe.__key || recipe.key) : '')) {
        return;
      }
    } else {
      if (famClean.includes('soda') || famClean.includes('eau') || famClean.includes('extra') || famClean.includes('supp')) return;
      if (prodClean.includes('coca') || prodClean.includes('sidi ali') || prodClean.startsWith('supp') || prodClean.startsWith('extra')) return;
    }

    distinctFamilies.add(family);

    const totalCA = sale.total || 0;
    const price = sale.price > 0 ? sale.price : (qty > 0 ? (totalCA / qty) : 0);

    let cost = 0;

    if (recipe && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
      const fc = typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost(recipe.ingredients, price) : { cost: 0 };
      cost = fc.cost || 0;
    } else {
      // Estimation standard food cost 28% si non relié
      cost = Math.round(price * 0.28 * 100) / 100;
    }

    const gmDH = Math.max(0, Math.round((price - cost) * 100) / 100);
    const totalItemProfit = Math.round((qty * gmDH) * 100) / 100;
    const fcPct = price > 0 ? Math.round((cost / price) * 1000) / 10 : 0;

    totalVolume += qty;
    totalGrossProfit += totalItemProfit;
    totalRevenue += totalCA;

    classifiedItems.push({
      product: sale.product,
      family: family,
      recipeName: recipe ? recipe.name : '',
      hasRecipe: !!recipe,
      price: price,
      cost: cost,
      foodCostPct: fcPct,
      grossMarginDH: gmDH,
      qty: qty,
      totalCA: totalCA,
      totalProfitDH: totalItemProfit
    });
  });

  const N = classifiedItems.length;
  if (countTabBadge) countTabBadge.textContent = String(N);

  // 2. Calcul des seuils Kasavana & Smith
  // Seuil de profitabilité = Marge brute unitaire moyenne pondérée
  const avgGrossMargin = totalVolume > 0 ? (totalGrossProfit / totalVolume) : 0;
  // Seuil de popularité = 70% de la moyenne des ventes par article
  const popThreshold = N > 0 ? (totalVolume / N) * 0.70 : 0;

  // 3. Catégorisation des articles
  let countStars = 0, caStars = 0, profitStars = 0;
  let countPlowhorses = 0, caPlowhorses = 0, profitPlowhorses = 0;
  let countPuzzles = 0, caPuzzles = 0, profitPuzzles = 0;
  let countDogs = 0, caDogs = 0, profitDogs = 0;
  let plowhorseVolume = 0;

  classifiedItems.forEach(item => {
    const isHighPop = item.qty >= popThreshold;
    const isHighProfit = item.grossMarginDH >= avgGrossMargin;

    if (isHighPop && isHighProfit) {
      item.quadrant = 'star';
      item.quadrantLabel = '⭐ Étoile';
      item.actionAdvice = '🏆 Pilier clé : Maintenir la qualité et le grammage stricts. Positionner au centre de la carte.';
      countStars++;
      caStars += item.totalCA;
      profitStars += item.totalProfitDH;
    } else if (isHighPop && !isHighProfit) {
      item.quadrant = 'plowhorse';
      item.quadrantLabel = '🐎 Cheval de trait';
      item.actionAdvice = '⚠️ Optimiser la marge : Tester une hausse de +1 à +3 DH ou optimiser le coût portion (potentiel élevé).';
      countPlowhorses++;
      caPlowhorses += item.totalCA;
      profitPlowhorses += item.totalProfitDH;
      plowhorseVolume += item.qty;
    } else if (!isHighPop && isHighProfit) {
      item.quadrant = 'puzzle';
      item.quadrantLabel = '🧩 Dilemme';
      item.actionAdvice = '🎯 Booster la popularité : Inciter les serveurs à le recommander, ajouter une photo ou proposer en formule.';
      countPuzzles++;
      caPuzzles += item.totalCA;
      profitPuzzles += item.totalProfitDH;
    } else {
      item.quadrant = 'dog';
      item.quadrantLabel = '🐕 Poids mort';
      item.actionAdvice = '🛑 Faible rentabilité : Retravailler la recette, augmenter le prix ou envisager le retrait de la carte.';
      countDogs++;
      caDogs += item.totalCA;
      profitDogs += item.totalProfitDH;
    }
  });

  menuEngData = classifiedItems;

  // 4. Mettre à jour les KPIs d'en-tête
  const kpiMargin = document.getElementById('me-kpi-avg-margin');
  const kpiPop = document.getElementById('me-kpi-pop-thresh');
  const kpiProfit = document.getElementById('me-kpi-total-profit');
  
  if (kpiMargin) kpiMargin.textContent = avgGrossMargin.toFixed(2) + ' DH';
  if (kpiPop) kpiPop.textContent = Math.round(popThreshold) + ' unités';
  if (kpiProfit) kpiProfit.textContent = totalGrossProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH';

  // 5. Mettre à jour les compteurs des 4 quadrants
  const elStars = document.getElementById('badge-count-stars');
  const elPlowhorses = document.getElementById('badge-count-plowhorses');
  const elPuzzles = document.getElementById('badge-count-puzzles');
  const elDogs = document.getElementById('badge-count-dogs');

  if (elStars) elStars.textContent = String(countStars);
  if (elPlowhorses) elPlowhorses.textContent = String(countPlowhorses);
  if (elPuzzles) elPuzzles.textContent = String(countPuzzles);
  if (elDogs) elDogs.textContent = String(countDogs);

  // Parts du CA
  const pctStars = totalRevenue > 0 ? ((caStars / totalRevenue) * 100).toFixed(1) : 0;
  const pctPlowhorses = totalRevenue > 0 ? ((caPlowhorses / totalRevenue) * 100).toFixed(1) : 0;
  const pctPuzzles = totalRevenue > 0 ? ((caPuzzles / totalRevenue) * 100).toFixed(1) : 0;
  const pctDogs = totalRevenue > 0 ? ((caDogs / totalRevenue) * 100).toFixed(1) : 0;

  const elPctStars = document.getElementById('pct-ca-stars');
  const elPctPlowhorses = document.getElementById('pct-ca-plowhorses');
  const elPctPuzzles = document.getElementById('pct-ca-puzzles');
  const elPctDogs = document.getElementById('pct-ca-dogs');

  if (elPctStars) elPctStars.textContent = `${pctStars}% (${Math.round(caStars).toLocaleString('fr-FR')} DH)`;
  if (elPctPlowhorses) elPctPlowhorses.textContent = `${pctPlowhorses}% (${Math.round(caPlowhorses).toLocaleString('fr-FR')} DH)`;
  if (elPctPuzzles) elPctPuzzles.textContent = `${pctPuzzles}% (${Math.round(caPuzzles).toLocaleString('fr-FR')} DH)`;
  if (elPctDogs) elPctDogs.textContent = `${pctDogs}% (${Math.round(caDogs).toLocaleString('fr-FR')} DH)`;

  // Mettre à jour les boutons de filtre
  const bAll = document.getElementById('me-btn-count-all');
  const bStar = document.getElementById('me-btn-count-star');
  const bPlow = document.getElementById('me-btn-count-plowhorse');
  const bPuz = document.getElementById('me-btn-count-puzzle');
  const bDog = document.getElementById('me-btn-count-dog');

  if (bAll) bAll.textContent = String(N);
  if (bStar) bStar.textContent = String(countStars);
  if (bPlow) bPlow.textContent = String(countPlowhorses);
  if (bPuz) bPuz.textContent = String(countPuzzles);
  if (bDog) bDog.textContent = String(countDogs);

  const elCountME = document.getElementById('count-menu-eng');
  if (elCountME) elCountME.textContent = String(N);
  const drawerCountME = document.getElementById('drawer-count-me');
  if (drawerCountME) drawerCountME.textContent = String(N);

  // 6. Bannière d'opportunité d'optimisation
  const banner = document.getElementById('me-opportunity-banner');
  if (banner) {
    const extraGain2DH = plowhorseVolume * 2;
    if (countPlowhorses > 0 && extraGain2DH > 0) {
      banner.innerHTML = `
        <span style="font-size:22px;">💡</span>
        <div>
          <strong>Opportunité de Gain Majeur :</strong> En augmentant le prix des <strong>${countPlowhorses} Chevaux de trait</strong> de seulement <strong>+2,00 DH</strong>, vous dégageriez <strong>+${extraGain2DH.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</strong> de bénéfice brut supplémentaire sur cette période, sans impacter la fidélité client !
        </div>
      `;
      banner.style.display = 'flex';
    } else {
      banner.innerHTML = `
        <span style="font-size:22px;">✅</span>
        <div>
          <strong>Structure Tarifaire Équilibrée :</strong> La majorité de votre chiffre d'affaires est portée par vos articles Étoiles et rentables.
        </div>
      `;
      banner.style.display = 'flex';
    }
  }

  // 7. Remplir le menu déroulant des familles
  populateMenuEngFamilyDropdown(Array.from(distinctFamilies).sort());

  // 8. Rendu du tableau
  renderMenuEngineeringTable();
  renderMenuEngineeringScatterPlot();
}

function renderMenuEngineeringTable() {
  const tbody = document.getElementById('tbody-menu-engineering');
  const searchInput = document.getElementById('search-menu-eng');
  if (!tbody) return;

  const search = cleanText(searchInput ? searchInput.value : '');

  let list = menuEngData.filter(item => {
    if (menuEngQuadrantFilter !== 'all' && item.quadrant !== menuEngQuadrantFilter) return false;
    if (menuEngFamilyFilter !== 'all' && item.family !== menuEngFamilyFilter) return false;
    if (search) {
      const pClean = cleanText(item.product);
      const fClean = cleanText(item.family);
      if (!pClean.includes(search) && !fClean.includes(search)) return false;
    }
    return true;
  });

  // Tri
  list.sort((a, b) => {
    if (menuEngSortMetric === 'profit') return b.totalProfitDH - a.totalProfitDH;
    if (menuEngSortMetric === 'margin') return b.grossMarginDH - a.grossMarginDH;
    if (menuEngSortMetric === 'qty') return b.qty - a.qty;
    if (menuEngSortMetric === 'ca') return b.totalCA - a.totalCA;
    if (menuEngSortMetric === 'foodcost') return a.foodCostPct - b.foodCostPct;
    return b.totalProfitDH - a.totalProfitDH;
  });

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--muted);">Aucun article ne correspond aux critères de filtre sélectionnés.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(item => {
    let badgeClass = 'badge-me ' + item.quadrant;
    let fcColor = item.foodCostPct <= 28 ? '#10b981' : (item.foodCostPct <= 35 ? '#f59e0b' : '#ef4444');

    return `
      <tr style="border-bottom:1px solid var(--border); transition:background 0.15s ease;">
        <td style="padding:10px;">
          <strong style="color:var(--text); font-size:13.5px;">${escapeHtml(item.product)}</strong>
          <span style="display:block; font-size:11px; color:var(--muted);">${escapeHtml(item.family)}</span>
        </td>
        <td style="padding:10px; text-align:right; font-weight:800; color:var(--text); font-variant-numeric:tabular-nums;">
          ${item.price.toFixed(2)} DH
        </td>
        <td style="padding:10px; text-align:right; font-variant-numeric:tabular-nums;">
          <span style="font-weight:700; color:var(--text); font-size:12.5px;">${item.cost.toFixed(2)} DH</span>
          <div class="fc-gauge-wrap">
            <span style="font-weight:800; font-size:11px; color:${fcColor};">${item.foodCostPct}%</span>
            <div class="fc-gauge-bar">
              <div class="fc-gauge-fill ${item.foodCostPct <= 28 ? 'ok' : (item.foodCostPct <= 35 ? 'warn' : 'danger')}" style="width:${Math.min(100, Math.max(8, item.foodCostPct * 2))}%;"></div>
            </div>
          </div>
        </td>
        <td style="padding:10px; text-align:right; font-weight:900; color:var(--accent); font-variant-numeric:tabular-nums; font-size:13.5px;">
          ${item.grossMarginDH.toFixed(2)} DH
        </td>
        <td style="padding:10px; text-align:center; font-weight:800; color:var(--text);">
          ${item.qty.toLocaleString('fr-FR')}
        </td>
        <td style="padding:10px; text-align:right; font-weight:900; color:#10b981; font-variant-numeric:tabular-nums; font-size:13.5px;">
          ${item.totalProfitDH.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
        </td>
        <td style="padding:10px; text-align:center;">
          <span class="${badgeClass}">${item.quadrantLabel}</span>
        </td>
        <td style="padding:10px; font-size:12px; line-height:1.4; color:var(--text);">
          ${item.actionAdvice}
        </td>
      </tr>
    `;
  }).join('');
}


/* ========================================================
   11.B CYLINDRE HOLOGRAPHIQUE 3D DES PLATS (MENU ENGINEERING)
======================================================== */
var holoPoints = [];
var hoveredHoloPoint = null;
var holoCanvasBound = false;
var holoAnimFrameId = null;
var holoIsVisible = true;

// État et contrôle du Cylindre Holographique
var cylinderAngle = 0;              // Angle de rotation actuel (radians)
var cylinderTargetAngle = 0;        // Angle cible pour amortissement fluide
var cylinderVelocity = 0;           // Vélocité inertielle
var cylinderZoom = 1.0;             // Zoom actuel (0.6 - 2.0)
var cylinderTargetZoom = 1.0;       // Zoom cible
var cylinderAutoRotate = true;       // Rotation continue 360°
var cylinderShowLabels = true;      // Affichage des noms des plats
var cylinderFilter = 'all';         // 'all' | 'star' | 'plowhorse' | 'puzzle' | 'dog'
var isCylinderDragging = false;
var cylinderDragStartX = 0;
var cylinderStartAngle = 0;
var cylinderLastDragX = 0;
var cylinderLastDragTime = 0;
var cylinderPulseTime = 0;

// État et contrôle du Radar Holographique Simple (Planar Hologram)
var hologramPulseTime = 0;          // Pulsation des ondes radar et halos néon
var hologramScanActive = true;       // Faisceau de balayage scanner laser actif
var hologramScanX = 0;              // Position X du faisceau laser
var hologramFilter = 'all';         // 'all' | 'star' | 'plowhorse' | 'puzzle' | 'dog'
var hologramZoom = 1.0;             // Facteur de zoom (0.75 - 1.6)
var hologramShowLabels = true;      // Affichage direct des noms des plats
var selectedHoloDish = null;        // Plat ciblé ou verrouillé au clic

// Objet caméra conservé pour rétrocompatibilité totale avec tests et scripts
var holoCamera = {
  yaw: 0,
  pitch: 0.25,
  zoom: 1.0,
  targetYaw: 0,
  targetPitch: 0.25,
  targetZoom: 1.0,
  autoRotate: true,
  showBeams: true,
  showLabels: true,
  currentView: 'free'
};

// Particules lumineuses d'ambiance du cylindre
var holoParticles = [];
function initHoloParticles() {
  holoParticles = [];
  for (let i = 0; i < 24; i++) {
    holoParticles.push({
      angle: Math.random() * Math.PI * 2,
      heightNorm: (Math.random() - 0.5) * 2,
      radiusOffset: (Math.random() - 0.5) * 30,
      speedY: 0.003 + Math.random() * 0.007,
      size: 1 + Math.random() * 1.6,
      alpha: 0.15 + Math.random() * 0.4
    });
  }
}
initHoloParticles();

// Projection cylindrique 3D vers écran 2D
// angle : angle sur la circonférence du cylindre (radians)
// yLocal : hauteur relative dans le cylindre [-H/2, +H/2]
// radius : rayon du cylindre (px)
// tilt : inclinaison fixe du cylindre pour vision 3D naturelle (rad)
function projectCylinder(angle, yLocal, radius, width, height, zoom, tilt = 0.25) {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);

  // Coordonnées 3D locales
  const x = radius * sinA;
  const z = radius * cosA;
  const y = yLocal;

  // Inclinaison de vue fixe autour de l'axe X
  const yRot = y * cosT - z * sinT;
  const zRot = y * sinT + z * cosT;
  const xRot = x;

  // Perspective conique douce
  const focal = 540;
  const depth = focal - zRot;
  const scale = depth > 30 ? (focal * zoom) / depth : 0.01;

  const cx = width / 2;
  const cy = height * 0.52;

  return {
    sx: cx + xRot * scale,
    sy: cy - yRot * scale,
    scale: scale,
    depth: zRot,
    isFront: cosA >= 0,
    cosA: cosA,
    sinA: sinA
  };
}

// Fonction de rétrocompatibilité project3D pour tests existants
function project3D(x, y, z, width, height, cam) {
  const camPitch = (cam && typeof cam.pitch === 'number') ? cam.pitch : 0.25;
  const camYaw = (cam && typeof cam.yaw === 'number') ? cam.yaw : cylinderAngle;
  const camZoom = (cam && typeof cam.zoom === 'number') ? cam.zoom : cylinderZoom;

  const cosY = Math.cos(camYaw);
  const sinY = Math.sin(camYaw);
  const cosP = Math.cos(camPitch);
  const sinP = Math.sin(camPitch);

  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const y1 = y;

  const y2 = y1 * cosP - z1 * sinP;
  const z2 = y1 * sinP + z1 * cosP;
  const x2 = x1;

  const focalLength = 540;
  const cameraDistance = 600;
  const depth = cameraDistance + z2;
  const scale = depth > 20 ? (focalLength * camZoom) / depth : 0.01;

  const centerX = width / 2;
  const centerY = height * 0.52;

  return {
    sx: centerX + x2 * scale,
    sy: centerY - y2 * scale,
    scale: scale,
    depth: z2,
    rawX: x,
    rawY: y,
    rawZ: z
  };
}

/// Moteur de rendu principal du Radar Holographique Simple (Menu Engineering)
function renderMenuEngineeringHologram() {
  const canvas = document.getElementById('canvas-menu-eng-hologram');
  const container = document.getElementById('hologram-viewport');
  const tooltip = document.getElementById('hologram-tooltip');
  if (!canvas || !canvas.getContext || !container) return;

  const ctx = canvas.getContext('2d');
  const rect = container.getBoundingClientRect ? container.getBoundingClientRect() : { width: 800, height: 480 };
  const width = rect.width || 800;
  const height = 480;

  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }
  if (ctx.resetTransform) ctx.resetTransform();
  else if (ctx.setTransform) ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  hologramPulseTime += 0.035;
  if (hologramScanActive) {
    hologramScanX = (hologramScanX + 3) % (width + 80);
  }

  // Synchronisation des indicateurs du HUD
  const hudNodes = document.getElementById('holo-hud-nodes');
  if (hudNodes) {
    hudNodes.textContent = `PLATS: ${menuEngData ? menuEngData.length : 0}`;
  }
  const hudFilter = document.getElementById('holo-hud-filter');
  if (hudFilter) {
    const qLabels = { all: 'TOUS', star: 'ÉTOILES', plowhorse: 'CHEVAUX', puzzle: 'DILEMMES', dog: 'POIDS MORTS' };
    hudFilter.textContent = `FILTRE: ${qLabels[hologramFilter] || 'TOUS'}`;
  }

  // Nettoyage fond
  ctx.clearRect(0, 0, width, height);

  // 1. Fond holographique Sci-Fi (carroyage cyan + ondes radar circulaires)
  drawSimpleHoloBackground(ctx, width, height);

  if (!menuEngData || menuEngData.length === 0) {
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ PROJECTION HOLOGRAPHIQUE EN ATTENTE DE DONNÉES ⚡', width / 2, height / 2);
    return;
  }

  // Marges intérieures pour le radar
  const padLeft = 75;
  const padRight = 55;
  const padTop = 45;
  const padBottom = 55;
  const plotW = (width - padLeft - padRight) * hologramZoom;
  const plotH = (height - padTop - padBottom) * hologramZoom;

  const maxQty = Math.max(5, Math.max(...menuEngData.map(i => i.qty)) * 1.12);
  const minGM = Math.min(0, Math.min(...menuEngData.map(i => i.grossMarginDH)));
  const maxGM = Math.max(15, Math.max(...menuEngData.map(i => i.grossMarginDH)) * 1.15);
  const maxCA = Math.max(1, Math.max(...menuEngData.map(i => i.totalCA)));

  const totalVolume = menuEngData.reduce((acc, i) => acc + i.qty, 0);
  const totalProfit = menuEngData.reduce((acc, i) => acc + i.totalProfitDH, 0);
  const avgGrossMargin = totalVolume > 0 ? (totalProfit / totalVolume) : 0;
  const avgQty = menuEngData.length > 0 ? (totalVolume / menuEngData.length) : 0;

  const gmRange = Math.max(1, maxGM - minGM);
  const threshX = padLeft + Math.min(plotW, (avgQty / maxQty) * plotW);
  const threshY = padTop + plotH - Math.max(0, Math.min(plotH, ((avgGrossMargin - minGM) / gmRange) * plotH));

  // 2. Lignes laser des seuils et étiquettes des 4 quadrants
  drawSimpleHoloThresholds(ctx, padLeft, padTop, plotW, plotH, threshX, threshY, avgGrossMargin, avgQty);

  // 3. Faisceau laser de balayage scanner
  if (hologramScanActive) {
    drawSimpleHoloScanline(ctx, width, height, hologramScanX);
  }

  // 4. Axes gradués holographiques
  drawSimpleHoloAxes(ctx, padLeft, padTop, plotW, plotH, maxQty, minGM, maxGM);

  // 5. Calcul et tracé des orbes holographiques
  holoPoints = [];
  const orbs = [];

  menuEngData.forEach(item => {
    const qRatio = Math.max(0, Math.min(1, item.qty / maxQty));
    const mRatio = Math.max(0, Math.min(1, (item.grossMarginDH - minGM) / gmRange));

    const sx = padLeft + qRatio * plotW;
    const sy = padTop + plotH - mRatio * plotH;

    const baseRadius = 6.5 + Math.sqrt(item.totalCA / maxCA) * 12;
    const isMatch = (hologramFilter === 'all' || item.quadrant === hologramFilter);

    const orbObj = {
      item,
      sx,
      sy,
      radius: baseRadius,
      isMatch
    };
    orbs.push(orbObj);

    holoPoints.push({
      x: sx,
      y: sy,
      r: baseRadius + 5,
      item,
      node: orbObj
    });
  });

  // Rendu des orbes : d'abord ceux hors filtre (faible opacité), puis ceux filtrés
  orbs.filter(o => !o.isMatch).forEach(orb => {
    drawHoloOrb(ctx, orb, false, false);
  });

  orbs.filter(o => o.isMatch).forEach(orb => {
    const isHovered = (hoveredHoloPoint && hoveredHoloPoint.item.product === orb.item.product) || (selectedHoloDish && selectedHoloDish.product === orb.item.product);
    drawHoloOrb(ctx, orb, true, isHovered);
  });

  // 6. Réticule de ciblage et faisceaux vers les axes si survolé
  const activeHover = hoveredHoloPoint || (selectedHoloDish ? holoPoints.find(p => p.item.product === selectedHoloDish.product) : null);
  if (activeHover && activeHover.node) {
    drawHoloTargetCrosshair(ctx, activeHover.node.sx, activeHover.node.sy, activeHover.node.radius, padLeft, padTop + plotH, activeHover.item);
  }

  // Liaison des écouteurs
  if (!holoCanvasBound) {
    bindSimpleHoloEventListeners(canvas, container, tooltip);
  }
}

// 1. Fond holographique Sci-Fi avec carroyage et ondes concentriques
function drawSimpleHoloBackground(ctx, width, height) {
  ctx.save();

  // Dégradé radial sombre
  const rad = ctx.createRadialGradient(width / 2, height / 2, 30, width / 2, height / 2, width * 0.65);
  rad.addColorStop(0, '#0c1a3b');
  rad.addColorStop(0.55, '#071026');
  rad.addColorStop(1, '#02050e');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, width, height);

  // Carroyage holographique cyan discret
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.055)';
  ctx.lineWidth = 1;
  const gridStep = 40;
  for (let x = 0; x < width; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Ondes radar circulaires concentriques
  const cx = width / 2;
  const cy = height / 2;
  const ringRadii = [60, 130, 210, 300, 390];
  ctx.lineWidth = 1;
  ringRadii.forEach((r, idx) => {
    const pulseAlpha = 0.04 + Math.sin(hologramPulseTime + idx) * 0.02;
    ctx.strokeStyle = `rgba(6, 182, 212, ${pulseAlpha})`;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
}

// 2. Lignes laser de seuil et filigranes des 4 quadrants
function drawSimpleHoloThresholds(ctx, padLeft, padTop, plotW, plotH, threshX, threshY, avgGM, avgQty) {
  ctx.save();

  // Filigranes néon des 4 quadrants dans les angles
  ctx.font = 'bold 13px ui-monospace, SFMono-Regular, monospace';

  // ⭐ Étoiles (Haut-Droit)
  ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
  ctx.textAlign = 'right';
  ctx.fillText('⭐ ÉTOILES (Stars)', padLeft + plotW - 10, padTop + 24);
  ctx.font = '10px system-ui';
  ctx.fillText('Fort Volume & Forte Marge', padLeft + plotW - 10, padTop + 38);

  // 🐎 Chevaux (Bas-Droit)
  ctx.font = 'bold 13px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = 'rgba(2, 132, 199, 0.28)';
  ctx.textAlign = 'right';
  ctx.fillText('🐎 CHEVAUX (Plowhorses)', padLeft + plotW - 10, padTop + plotH - 30);
  ctx.font = '10px system-ui';
  ctx.fillText('Fort Volume & Marge Modérée', padLeft + plotW - 10, padTop + plotH - 16);

  // 🧩 Dilemmes (Haut-Gauche)
  ctx.font = 'bold 13px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = 'rgba(139, 92, 246, 0.28)';
  ctx.textAlign = 'left';
  ctx.fillText('🧩 DILEMMES (Puzzles)', padLeft + 12, padTop + 24);
  ctx.font = '10px system-ui';
  ctx.fillText('Faible Volume & Forte Marge', padLeft + 12, padTop + 38);

  // 🐕 Poids morts (Bas-Gauche)
  ctx.font = 'bold 13px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = 'rgba(239, 68, 68, 0.28)';
  ctx.textAlign = 'left';
  ctx.fillText('🐕 POIDS MORTS (Dogs)', padLeft + 12, padTop + plotH - 30);
  ctx.font = '10px system-ui';
  ctx.fillText('Faible Volume & Faible Marge', padLeft + 12, padTop + plotH - 16);

  // Ligne laser verticale Seuil Volume
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(threshX, padTop);
  ctx.lineTo(threshX, padTop + plotH);
  ctx.stroke();

  // Ligne laser horizontale Seuil Marge Moyenne
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
  ctx.beginPath();
  ctx.moveTo(padLeft, threshY);
  ctx.lineTo(padLeft + plotW, threshY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Badges des seuils
  ctx.font = 'bold 9.5px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.fillText(`⚡ VOL. MOYEN: ${avgQty.toFixed(0)} u.`, threshX, padTop - 8);

  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'right';
  ctx.fillText(`⚡ MARGE MOY.: ${avgGM.toFixed(1)} DH`, padLeft + plotW, threshY - 6);

  // Réticule d'intersection
  const pulse = Math.sin(hologramPulseTime * 3) * 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(threshX, threshY, 4 + pulse, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// 3. Faisceau laser de balayage scanner
function drawSimpleHoloScanline(ctx, width, height, scanX) {
  ctx.save();
  const grad = ctx.createLinearGradient(scanX - 45, 0, scanX + 45, 0);
  grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
  grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
  grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.65)');
  grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(scanX - 45, 0, 90, height);
  ctx.restore();
}

// 4. Axes gradués holographiques
function drawSimpleHoloAxes(ctx, padLeft, padTop, plotW, plotH, maxQty, minGM, maxGM) {
  ctx.save();

  // Axe Horizontal (Volume)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(padLeft, padTop + plotH);
  ctx.lineTo(padLeft + plotW, padTop + plotH);
  ctx.stroke();

  // Flèche Axe X
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(padLeft + plotW, padTop + plotH - 4);
  ctx.lineTo(padLeft + plotW + 7, padTop + plotH);
  ctx.lineTo(padLeft + plotW, padTop + plotH + 4);
  ctx.fill();

  ctx.font = 'bold 10px ui-monospace, SFMono-Regular, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('POPULARITÉ / VOLUME VENDU (UNITÉS) ➔', padLeft + plotW - 10, padTop + plotH + 28);

  // Graduations X
  const xSteps = 4;
  for (let i = 1; i <= xSteps; i++) {
    const val = Math.round((maxQty / xSteps) * i);
    const gx = padLeft + (i / xSteps) * plotW;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gx, padTop + plotH);
    ctx.lineTo(gx, padTop + plotH + 5);
    ctx.stroke();

    ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
    ctx.font = '9px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${val} u.`, gx, padTop + plotH + 16);
  }

  // Axe Vertical (Marge Cash)
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(padLeft, padTop + plotH);
  ctx.lineTo(padLeft, padTop);
  ctx.stroke();

  // Flèche Axe Y
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.moveTo(padLeft - 4, padTop);
  ctx.lineTo(padLeft, padTop - 7);
  ctx.lineTo(padLeft + 4, padTop);
  ctx.fill();

  ctx.font = 'bold 10px ui-monospace, SFMono-Regular, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('▲ MARGE BRUTE CASH (DIRHAMS)', padLeft + 10, padTop - 12);

  // Graduations Y
  const ySteps = 4;
  const gmRange = maxGM - minGM;
  for (let i = 0; i <= ySteps; i++) {
    const val = Math.round(minGM + (gmRange / ySteps) * i);
    const gy = padTop + plotH - (i / ySteps) * plotH;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft - 5, gy);
    ctx.lineTo(padLeft, gy);
    ctx.stroke();

    ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
    ctx.font = '9px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${val} DH`, padLeft - 8, gy + 3);
  }

  ctx.restore();
}

// 5. Orbe holographique lumineux pour chaque plat
function drawHoloOrb(ctx, orb, isMatch, isHovered) {
  const { item, sx, sy, radius } = orb;
  ctx.save();

  // Couleurs de quadrants
  const colors = {
    star: { core: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', hot: '#a7f3d0' },
    plowhorse: { core: '#0284c7', glow: 'rgba(2, 132, 199, 0.45)', hot: '#bae6fd' },
    puzzle: { core: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.45)', hot: '#ddd6fe' },
    dog: { core: '#ef4444', glow: 'rgba(239, 68, 68, 0.45)', hot: '#fecaca' }
  };
  const theme = colors[item.quadrant] || colors.star;

  if (!isMatch) {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = theme.core;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(3, radius * 0.7), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const pulse = Math.sin(hologramPulseTime * 2.5 + sx * 0.05) * 2;
  const currentR = radius + (isHovered ? 4 : pulse);

  // Halo radiant extérieur
  const haloR = currentR * (isHovered ? 2.8 : 2.1);
  const grad = ctx.createRadialGradient(sx, sy, currentR * 0.3, sx, sy, haloR);
  grad.addColorStop(0, theme.glow);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sx, sy, haloR, 0, Math.PI * 2);
  ctx.fill();

  // Orbe principal
  const orbGrad = ctx.createRadialGradient(sx - currentR * 0.3, sy - currentR * 0.3, 1, sx, sy, currentR);
  orbGrad.addColorStop(0, theme.hot);
  orbGrad.addColorStop(0.65, theme.core);
  orbGrad.addColorStop(1, '#051025');

  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(sx, sy, currentR, 0, Math.PI * 2);
  ctx.fill();

  // Liseré néon lumineux
  ctx.strokeStyle = isHovered ? '#ffffff' : theme.hot;
  ctx.lineWidth = isHovered ? 2.2 : 1.2;
  ctx.stroke();

  // Point central lumineux
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(sx, sy, Math.max(1.5, currentR * 0.25), 0, Math.PI * 2);
  ctx.fill();

  // Étiquette du plat
  if (hologramShowLabels) {
    ctx.font = isHovered ? 'bold 11px system-ui, -apple-system, sans-serif' : '600 10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';

    // Ombre portée pour lisibilité parfaite
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;

    ctx.fillStyle = isHovered ? '#fef08a' : '#f8fafc';
    ctx.fillText(item.product, sx, sy + currentR + 13);

    ctx.font = 'bold 9px ui-monospace, SFMono-Regular, monospace';
    ctx.fillStyle = theme.core;
    ctx.fillText(`+${item.grossMarginDH.toFixed(1)} DH`, sx, sy + currentR + 24);
  }

  ctx.restore();
}

// 6. Réticule de ciblage et lignes de projection vers les axes
function drawHoloTargetCrosshair(ctx, sx, sy, r, padLeft, plotBottom, item) {
  ctx.save();

  // Faisceaux laser pointillés vers l'axe X et Y
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 3]);

  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx, plotBottom);
  ctx.moveTo(sx, sy);
  ctx.lineTo(padLeft, sy);
  ctx.stroke();
  ctx.setLineDash([]);

  // Badge valeur sur l'axe X
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(sx - 24, plotBottom + 4, 48, 16);
  ctx.font = 'bold 9px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(`${item.qty} u.`, sx, plotBottom + 15);

  // Badge valeur sur l'axe Y
  ctx.fillStyle = '#10b981';
  ctx.fillRect(padLeft - 52, sy - 8, 48, 16);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(`${item.grossMarginDH.toFixed(1)} DH`, padLeft - 28, sy + 3);

  // Réticule circulaire de visée rotatif
  const targetR = r + 9;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(sx, sy, targetR, 0, Math.PI * 2);
  ctx.stroke();

  // Crochets de cadrage aux 4 coins du réticule
  const bracketLen = 4;
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx - targetR - bracketLen, sy); ctx.lineTo(sx - targetR + bracketLen, sy);
  ctx.moveTo(sx + targetR - bracketLen, sy); ctx.lineTo(sx + targetR + bracketLen, sy);
  ctx.moveTo(sx, sy - targetR - bracketLen); ctx.lineTo(sx, sy - targetR + bracketLen);
  ctx.moveTo(sx, sy + targetR - bracketLen); ctx.lineTo(sx, sy + targetR + bracketLen);
  ctx.stroke();

  ctx.restore();
}

// 7. Écouteurs d'interaction sur le canvas holographique
function bindSimpleHoloEventListeners(canvas, container, tooltip) {
  if (holoCanvasBound) return;
  holoCanvasBound = true;

  if (!canvas || !canvas.addEventListener) return;

  canvas.addEventListener('mousemove', (e) => {
    const cRect = canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: canvas.width || 800 };
    const mx = e.clientX - cRect.left;
    const my = e.clientY - cRect.top;

    let found = null;
    let closestDist = Infinity;

    for (let i = holoPoints.length - 1; i >= 0; i--) {
      const pt = holoPoints[i];
      const dist = Math.hypot(mx - pt.x, my - pt.y);
      if (dist <= pt.r + 6 && dist < closestDist) {
        found = pt;
        closestDist = dist;
      }
    }

    if (found) {
      hoveredHoloPoint = found;
      const it = found.item;
      if (tooltip) {
        tooltip.innerHTML = `
          <div class="tt-title">🔮 ${escapeHtml(it.product)}</div>
          <div style="font-size:10.5px; color:#94a3b8; margin-bottom:7px; letter-spacing:0.03em;">
            ${escapeHtml(it.family || '')} • <span style="color:#38bdf8; font-weight:700;">${it.quadrantLabel || ''}</span>
          </div>
          <div class="tt-row"><span>Prix de vente :</span><strong class="tt-val">${(it.price || 0).toFixed(2)} DH</strong></div>
          <div class="tt-row"><span>Coût Portion (FC%) :</span><strong class="tt-val">${(it.cost || 0).toFixed(2)} DH (${it.foodCostPct || 0}%)</strong></div>
          <div class="tt-row"><span>Marge Brute Cash :</span><strong class="tt-val" style="color:#38bdf8;">${(it.grossMarginDH || 0).toFixed(2)} DH</strong></div>
          <div class="tt-row"><span>Quantité vendue :</span><strong class="tt-val">${(it.qty || 0).toLocaleString('fr-FR')} u.</strong></div>
          <div class="tt-row"><span>CA Total :</span><strong class="tt-val" style="color:#10b981;">${(it.totalCA || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</strong></div>
          <div style="margin-top:7px; padding-top:7px; border-top:1px solid rgba(6, 182, 212, 0.25); font-size:11px; color:#fde047;">
            💡 ${escapeHtml(it.actionAdvice || '')}
          </div>
        `;
        tooltip.style.left = Math.min((cRect.width || 800) - 155, Math.max(155, mx)) + 'px';
        tooltip.style.top = Math.max(70, my - 15) + 'px';
        tooltip.style.display = 'block';
      }
    } else {
      if (hoveredHoloPoint) {
        hoveredHoloPoint = null;
        if (tooltip) tooltip.style.display = 'none';
      }
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredHoloPoint = null;
    if (tooltip) tooltip.style.display = 'none';
  });

  canvas.addEventListener('click', () => {
    if (hoveredHoloPoint && hoveredHoloPoint.item) {
      selectedHoloDish = hoveredHoloPoint.item;
    } else {
      selectedHoloDish = null;
    }
  });

  // Zoom doux à la molette
  canvas.addEventListener('wheel', (e) => {
    if (e.preventDefault) e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    hologramZoom = Math.max(0.75, Math.min(1.6, hologramZoom + delta));
  }, { passive: false });

  // Support tactile
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length === 1) {
      const touch = e.touches[0];
      const cRect = canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: canvas.width || 800 };
      const mx = touch.clientX - cRect.left;
      const my = touch.clientY - cRect.top;

      let found = null;
      let closestDist = Infinity;
      for (let i = holoPoints.length - 1; i >= 0; i--) {
        const pt = holoPoints[i];
        const dist = Math.hypot(mx - pt.x, my - pt.y);
        if (dist <= pt.r + 10 && dist < closestDist) {
          found = pt;
          closestDist = dist;
        }
      }
      if (found) {
        hoveredHoloPoint = found;
        if (tooltip) {
          const it = found.item;
          tooltip.innerHTML = `
            <div class="tt-title">🔮 ${escapeHtml(it.product)}</div>
            <div class="tt-row"><span>Marge Cash :</span><strong class="tt-val" style="color:#38bdf8;">${(it.grossMarginDH || 0).toFixed(2)} DH</strong></div>
            <div class="tt-row"><span>Quantité :</span><strong class="tt-val">${(it.qty || 0).toLocaleString('fr-FR')} u.</strong></div>
          `;
          tooltip.style.left = Math.min((cRect.width || 800) - 155, Math.max(155, mx)) + 'px';
          tooltip.style.top = Math.max(70, my - 15) + 'px';
          tooltip.style.display = 'block';
        }
      }
    }
  }, { passive: true });

  // Boucle d'animation fluide
  function startHoloAnimationLoop() {
    if (holoAnimFrameId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(holoAnimFrameId);
    }
    function frame() {
      if (holoIsVisible) {
        renderMenuEngineeringHologram();
      }
      if (typeof requestAnimationFrame === 'function') {
        holoAnimFrameId = requestAnimationFrame(frame);
      }
    }
    if (typeof requestAnimationFrame === 'function') {
      holoAnimFrameId = requestAnimationFrame(frame);
    }
  }
  startHoloAnimationLoop();

  if (typeof IntersectionObserver !== 'undefined' && container) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        holoIsVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(container);
  }
}

// Filtrage direct des quadrants holographiques
function filterHologramQuadrant(quad) {
  hologramFilter = quad;
  cylinderFilter = quad;

  ['all', 'star', 'plowhorse', 'puzzle', 'dog'].forEach(q => {
    const btn = document.getElementById(`btn-holo-filter-${q}`);
    if (btn) btn.classList.toggle('active', q === quad);
  });
}

function filterCylinderQuadrant(quad) {
  filterHologramQuadrant(quad);
}

function toggleHologramScan() {
  hologramScanActive = !hologramScanActive;
  const btn = document.getElementById('btn-holo-sweep');
  if (btn) {
    btn.classList.toggle('active', hologramScanActive);
    const led = btn.querySelector('.holo-led');
    if (led) led.classList.toggle('on', hologramScanActive);
  }
}

function toggleHologramLabels() {
  hologramShowLabels = !hologramShowLabels;
  cylinderShowLabels = hologramShowLabels;
  const btn = document.getElementById('btn-holo-labels');
  if (btn) btn.classList.toggle('active', hologramShowLabels);
}

function resetHologramView() {
  hologramFilter = 'all';
  cylinderFilter = 'all';
  hologramZoom = 1.0;
  cylinderZoom = 1.0;
  cylinderTargetZoom = 1.0;
  cylinderAutoRotate = true;
  hologramScanActive = true;
  selectedHoloDish = null;
  hoveredHoloPoint = null;
  filterHologramQuadrant('all');
  const btnSweep = document.getElementById('btn-holo-sweep');
  if (btnSweep) {
    if (btnSweep.classList) btnSweep.classList.toggle('active', true);
    const led = btnSweep.querySelector('.holo-led');
    if (led && led.classList && led.classList.toggle) led.classList.toggle('on', true);
  }
}

function zoomHologram(delta) {
  hologramZoom = Math.max(0.75, Math.min(1.6, hologramZoom + delta));
  cylinderZoom = hologramZoom;
  cylinderTargetZoom = hologramZoom;
}

function rotateCylinderToNode(node) {
  if (node && node.item) {
    selectedHoloDish = node.item;
    cylinderTargetAngle = 0;
    const pt = holoPoints.find(p => p.item.product === node.item.product);
    if (pt) hoveredHoloPoint = pt;
  }
}

// Rétrocompatibilité avec les anciens contrôles
function toggleHologramAutoRotate() {
  cylinderAutoRotate = !cylinderAutoRotate;
  toggleHologramScan();
}

function toggleHologramBeams() {}

function setHologramView(viewMode) {
  resetHologramView();
}

function renderMenuEngineeringScatterPlot() {
  renderMenuEngineeringHologram();
}

function renderMenuEngineeringCylinder() {
  renderMenuEngineeringHologram();
}

window.renderMenuEngineeringHologram = renderMenuEngineeringHologram;
window.renderMenuEngineeringCylinder = renderMenuEngineeringHologram;
window.filterHologramQuadrant = filterHologramQuadrant;
window.filterCylinderQuadrant = filterCylinderQuadrant;
window.toggleHologramScan = toggleHologramScan;
window.toggleHologramLabels = toggleHologramLabels;
window.resetHologramView = resetHologramView;
window.zoomHologram = zoomHologram;
window.rotateCylinderToNode = rotateCylinderToNode;
window.projectCylinder = projectCylinder;
window.project3D = project3D;
window.setHologramView = setHologramView;
window.toggleHologramAutoRotate = toggleHologramAutoRotate;
window.toggleHologramBeams = toggleHologramBeams;

function renderSummaryTopIngredientsPodium() {
  const container = document.getElementById('summary-top-ingredients-podium');
  if (!aggregatedIngredients || aggregatedIngredients.length === 0) {
    container.style.display = 'none';
    return;
  }

  const top4 = [...aggregatedIngredients]
    .filter(ing => ing.qty > 0)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4);

  if (top4.length === 0) {
    container.style.display = 'none';
    return;
  }

  const medals = ['🥇', '🥈', '🥉', '🏅'];
  const totalWeight = top4.reduce((acc, x) => acc + x.qty, 0);

  container.innerHTML = top4.map((ing, idx) => {
    return `
      <div class="podium-ing-card">
        <span class="pod-rank">${medals[idx]}</span>
        <div>
          <div class="pod-name">${escapeHtml(ing.name)}</div>
          <div class="pod-cat">${escapeHtml(ing.category || 'Épicerie')}</div>
        </div>
        <div>
          <div class="pod-qty">${ing.qty.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} <span style="font-size:13px; font-weight:700;">${ing.unit}</span></div>
          <div style="font-size:11px; color:var(--muted); margin-top:2px;">Consommé sur la période</div>
        </div>
      </div>
    `;
  }).join('');

  container.style.display = 'grid';
}


