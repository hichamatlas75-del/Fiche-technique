/* ===============================
   DONNÉES CENTRALISÉES (recipes-data.js)
================================= */
const DATA = window.CATEGORIES_DATA || [];

/* ===============================
   UTILITAIRES & RENDU
================================= */
const tabs = document.getElementById('tabs');
const sectionsContainer = document.getElementById('sections-container');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const searchInfo = document.getElementById('search-info');

// SVG Fallback image contextuel avec icône et nom du plat
function makePlaceholderSvg(name = 'Plat Grey Corner', color = '#0284c7') {
  const safeName = (name && name.length > 28) ? name.slice(0, 26) + '…' : (name || 'Grey Corner');
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240' fill='%230f172a'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231e293b'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='240' fill='url(%23g)'/%3E%3Ccircle cx='200' cy='95' r='44' fill='${encodeURIComponent(color)}' opacity='0.18'/%3E%3Ctext x='200' y='108' font-size='38' text-anchor='middle'%3E🍽️%3C/text%3E%3Ctext x='200' y='160' fill='%23f1f5f9' font-size='15' font-family='sans-serif' font-weight='800' text-anchor='middle'%3E${encodeURIComponent(safeName)}%3C/text%3E%3Ctext x='200' y='185' fill='%2364748b' font-size='11' font-family='sans-serif' font-weight='700' letter-spacing='1' text-anchor='middle'%3EGREY CORNER CUISINE%3C/text%3E%3C/svg%3E`;
}

const PLACEHOLDER_SVG = makePlaceholderSvg('Fiche Cuisine', '#0284c7');

function getCategoryEmoji(catName, catKey) {
  const n = (catName || '').toLowerCase();
  if (n.includes('grill') || n.includes('viande') || n.includes('plat')) return '🥩';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('pasta') || n.includes('pâte')) return '🍝';
  if (n.includes('salad') || n.includes('frais')) return '🥗';
  if (n.includes('wrap')) return '🌯';
  if (n.includes('burger') || n.includes('sandwich') || n.includes('panini')) return '🍔';
  if (n.includes('poisson') || n.includes('mer')) return '🐟';
  if (n.includes('dessert') || n.includes('sucre')) return '🍨';
  if (n.includes('boisson')) return '🥤';
  if (n.includes('sauce') || n.includes('base') || n.includes('sup')) return '🥣';
  return '🍽️';
}

function normalizeImagesField(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}:${rs < 10 ? '0' : ''}${rs}`;
}

// Nettoyage clé UID safe
function makeItemKey(catKey, itemName) {
  return 'item_' + catKey + '_' + itemName.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

// Protection contre les failles XSS et échappement complet (attributs inclus)
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


function createCard(item, catKey, categoryColor, categoryName = '') {
  const itemKey = makeItemKey(catKey, item.name);
  const dishPlaceholder = makePlaceholderSvg(item.name, categoryColor);
  const gallery = item.__images && item.__images.length > 0 ? item.__images : [item.image || dishPlaceholder];
  const firstImg = gallery[0] || dishPlaceholder;
  const hasTimer = typeof item.prepTime === 'number' && item.prepTime > 0;
  const prepSeconds = hasTimer ? item.prepTime * 60 : 0;
  const timerInit = formatTime(prepSeconds);
  const priceDisplay = item.price || (item.sellPrice ? item.sellPrice + ' DH' : '');

  // Formatage soigné des ingrédients avec différenciation nombre / unité (AM-UI-11)
  const techHtml = (item.tech || []).map(line => {
    const parts = line.split(':');
    if (parts.length > 1) {
      const ingName = parts[0].trim();
      const rawQty = parts.slice(1).join(':').trim();
      const qtyMatch = rawQty.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
      let qtyFormatted = escapeHtml(rawQty);
      if (qtyMatch) {
        qtyFormatted = `${qtyMatch[1]}<span class="item-qty-unit">${escapeHtml(qtyMatch[2])}</span>`;
      }
      return `<li><span>${escapeHtml(ingName)}</span> <span class="item-qty">${qtyFormatted}</span></li>`;
    }
    return `<li><span>${escapeHtml(line)}</span></li>`;
  }).join('');

  const multiBadge = gallery.length > 1 ? `<span class="gallery-badge">📸 ${gallery.length} photos</span>` : '';
  const escapedName = escapeHtml(item.name);
  const escapedPrice = escapeHtml(priceDisplay);

  // Pastille de catégorie sur la carte (DISP-03)
  const catBadgeHtml = categoryName ? `
    <div class="card-cat-badge">
      <span class="card-cat-dot" style="background:${categoryColor}"></span>
      ${escapeHtml(categoryName)}
    </div>` : '';

  // Timer avec classes sémantiques de durée (AM-UI-10)
  const timeSpeedClass = (item.prepTime <= 10) ? 'fast' : (item.prepTime <= 20 ? 'medium' : 'long');
  const timerRowHtml = hasTimer ? `
        <div class="timer-row">
          <div class="timer" id="${itemKey}-timer" data-state="idle">
            <span class="dot"></span>
            <span class="time" data-seconds="${prepSeconds}">${timerInit}</span>
          </div>
          <div class="meta">
            <span class="chip-time ${timeSpeedClass}">⏱️ ${item.prepTime} min</span>
          </div>
        </div>` : '';

  const techCount = (item.tech || []).length;

  return `
    <div class="card" data-key="${itemKey}" data-search="${(item.name + ' ' + (item.tech||[]).join(' ')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}">
      <div class="hero-wrap">
        ${catBadgeHtml}
        <img class="hero" src="${firstImg}" alt="${escapedName}" data-gallery="${gallery.join('|')}" style="border-bottom-color:${categoryColor}" onerror="this.onerror=null;this.src='${dishPlaceholder}';">
        ${multiBadge}
      </div>
      <div class="body">
        <div class="row-top">
          <div class="name">${escapedName}</div>
          <div class="price">${escapedPrice}</div>
        </div>

        <div class="financial-row">
          <div class="fin-item cost" title="Coût matière première estimé">
            <span class="fin-label">Coût Portion</span>
            <span class="fin-val">${item.cost !== undefined ? item.cost.toFixed(2) + ' DH' : '-'}</span>
          </div>
          <div class="fin-item ${item.foodCost <= 32 ? 'fc-low' : item.foodCost <= 42 ? 'fc-med' : 'fc-high'}" title="Ratio Food Cost (Coût / Prix Vente)">
            <span class="fin-label">Food Cost</span>
            <span class="fin-val">${item.foodCost !== undefined ? item.foodCost + '%' : '-'}</span>
          </div>
          <div class="fin-item margin" title="Marge Brute">
            <span class="fin-label">Marge</span>
            <span class="fin-val">${item.margin !== undefined ? item.margin + '%' : '-'}</span>
          </div>
        </div>

        ${timerRowHtml}

        <ul class="tech">${techHtml}</ul>
      </div>
      <div class="card-footer">
        <div class="footer-info">
          <span>📋 ${techCount} ingr.</span>
          ${hasTimer ? `<span>• ⏱️ ${item.prepTime}m</span>` : ''}
        </div>
        <button type="button" class="card-status-badge to-do" id="${itemKey}-badge" data-key="${itemKey}" data-status="to-do">⚪ À PRÉPARER</button>
      </div>
    </div>
  `;
}


function renderAll() {
  tabs.innerHTML = '';
  sectionsContainer.innerHTML = '';

  // Synchronisation dynamique avec la mercuriale des prix et fiches personnalisées (localStorage)
  // BUG-02 FIX : on travaille sur des COPIES locales — jamais de mutation de DATA (objet partagé)
  const renderData = [];

  try {
    const savedCustomPrices = localStorage.getItem('gc_ingredient_prices_v1');
    if (savedCustomPrices && window.INGREDIENT_UNIT_COSTS) {
      const parsed = JSON.parse(savedCustomPrices);
      const obsoleteKeys = window.OBSOLETE_INGREDIENT_KEYS || new Set([
        'calamar', 'calamars', 'calamar congele', 'calamars congeles', 'calamars brut', 'calamars net', 'calamar egoutte', 'calamars egouttes', 'calamar chair', 'calamars chair',
        'crevette', 'crevettes', 'crevette avec coquille', 'crevettes avec coquille', 'crevette brut', 'crevette chair', 'crevettes chair', 'crevette chair pure', 'crevettes chair pure', 'crevette chair pur', 'crevettes chair pur',
        'gambas', 'gambas avec coquille', 'gambas chair', 'gambas chair pure', 'gambas chair pur', 'gambas panees', 'gambas poche', 'gambas pochee', 'gambas decortiquees',
        'saumon', 'saumon frais', 'saumon sans carcasse', 'saumon avec carcasse', 'saumon fumee'
      ]);
      obsoleteKeys.forEach(k => { delete parsed[k]; delete window.INGREDIENT_UNIT_COSTS[k]; });
      Object.assign(window.INGREDIENT_UNIT_COSTS, parsed);
    }

    const savedCustomRecipes = localStorage.getItem('gc_recipes_db_v5') || localStorage.getItem('gc_recipes_db_v4');
    const customMap = new Map();
    if (savedCustomRecipes) {
      const customList = JSON.parse(savedCustomRecipes);
      customList.forEach(r => {
        if (r && r.name) {
          const norm = r.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
          customMap.set(norm, r);
        }
      });
    }

    // Synchronisation avec les modifications du comparateur
    const savedCompRecipes = localStorage.getItem('grey_corner_custom_recipes_v5');
    if (savedCompRecipes) {
      const compEdits = JSON.parse(savedCompRecipes);
      Object.keys(compEdits).forEach(name => {
        const norm = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
        if (compEdits[name] && compEdits[name].tech) {
          const prev = customMap.get(norm) || {};
          customMap.set(norm, Object.assign(prev, { ingredients: compEdits[name].tech, tech: compEdits[name].tech }));
        }
      });
    }

    const deletedList = JSON.parse(localStorage.getItem('gc_deleted_recipes_v1') || '[]');
    const deletedSet = new Set(deletedList.map(x => String(x).toLowerCase().trim()));

    // BUG-02 FIX : construire renderData comme copies sans toucher DATA original
    DATA.forEach(cat => {
      // Filtre sur une copie sans modifier cat.items
      const visibleItems = (cat.items || []).filter(it => {
        const norm = (it.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
        return !deletedSet.has(norm) && !deletedSet.has(it.id);
      });

      // Enrichissement des items (copie superficielle pour ne pas muter les originaux)
      const enrichedItems = visibleItems.map(it => {
        const clone = Object.assign({}, it); // copie sans mutation
        const norm = (clone.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
        const match = customMap.get(norm);
        if (match && ((Array.isArray(match.ingredients) && match.ingredients.length > 0) || (Array.isArray(match.tech) && match.tech.length > 0))) {
          clone.tech = match.ingredients || match.tech;
        }
        if (typeof calculateRecipeFoodCost === 'function' && clone.tech) {
          const sellP = (match && match.sellPrice) || parseFloat(String(clone.price || clone.sellPrice || 0).replace(/[^0-9.]/g, '')) || 0;
          const calc = calculateRecipeFoodCost(clone.tech, sellP);
          clone.cost = calc.cost;
          clone.foodCost = calc.foodCost;
          clone.margin = calc.margin;
          clone.grossMarginDH = calc.grossMarginDH;
        }
        return clone;
      });

      renderData.push({ cat, items: enrichedItems });
    });

    // Insérer dynamiquement les nouvelles fiches créées (non présentes dans DATA)
    const existingNorms = new Set();
    renderData.forEach(({ items }) => {
      items.forEach(it => {
        const norm = (it.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
        existingNorms.add(norm);
      });
    });

    customMap.forEach((r, norm) => {
      if (!existingNorms.has(norm) && !deletedSet.has(norm) && !deletedSet.has(r.id)) {
        const rCatNorm = (r.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        let targetEntry = renderData.find(e => {
          const cNorm = (e.cat.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          return cNorm.includes(rCatNorm) || rCatNorm.includes(cNorm);
        });
        if (!targetEntry) {
          targetEntry = renderData.find(e => e.cat.key === 'sup') || renderData[renderData.length - 1];
        }
        const sellP = parseFloat(r.sellPrice) || 0;
        const calc = typeof calculateRecipeFoodCost === 'function' ? calculateRecipeFoodCost(r.ingredients || [], sellP) : { cost: 0, foodCost: 0, margin: 0, grossMarginDH: 0 };
        targetEntry.items.push({
          id: r.id,
          name: r.name,
          image: r.image || 'images/placeholder.svg',
          prepTime: r.prepTime || 5,
          tech: r.ingredients || [],
          price: sellP > 0 ? `${sellP} DH` : '',
          sellPrice: sellP,
          cost: calc.cost,
          foodCost: calc.foodCost,
          margin: calc.margin,
          grossMarginDH: calc.grossMarginDH
        });
        existingNorms.add(norm);
      }
    });
  } catch (e) {
    console.warn('[LocalStorage] Erreur overlay prix et recettes personnalisées:', e);
    // Fallback : utiliser DATA tel quel
    DATA.forEach(cat => renderData.push({ cat, items: [...(cat.items || [])] }));
  }

  renderData.forEach(({ cat, items }, index) => {
    // Enrichissement des images (sur copie locale)
    items.forEach(it => {
      it.__key = cat.key;
      it.__images = normalizeImagesField(it.images || (it.image ? [it.image] : []));
    });

    // Tab link
    const t = document.createElement('a');
    t.href = `#${cat.key}`;
    t.className = 'tab';
    t.dataset.color = cat.color;
    t.dataset.cat = cat.key;
    t.textContent = `${cat.category} (${items.length})`;
    tabs.appendChild(t);
    if (index === 0) t.classList.add('active');

    // Section container
    const sec = document.createElement('section');
    sec.id = cat.key;
    sec.className = 'section-wrap';
    sec.dataset.cat = cat.key;
    const catEmoji = getCategoryEmoji(cat.category, cat.key);
    sec.innerHTML = `
      <h2 class="section-title" style="border-left-color:${cat.color};">
        <span>${catEmoji}</span>
        <span>${escapeHtml(cat.category)}</span>
        <span class="section-count">${items.length} fiches</span>
      </h2>
      <div class="grid">
        ${items.map(it => {
          try {
            return createCard(it, cat.key, cat.color, cat.category);
          } catch(err) {
            console.error('[Cuisine] Erreur rendu fiche:', it && it.name, err);
            return '';
          }
        }).join('')}
      </div>
    `;
    sectionsContainer.appendChild(sec);
  });


  initTabBehavior();
  initCardsBehavior();
  initSearch();
  initQuickFilters();
  restoreSavedTimers();
}


/* ===============================
   GESTION DES ONGLETS
================================= */
function initTabBehavior() {
  const allTabs = [...document.querySelectorAll('.tab')];
  allTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const id = tab.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      allTabs.forEach(x => x.classList.remove('active'));
      tab.classList.add('active');
      const y = target.getBoundingClientRect().top + window.scrollY - 115;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ===============================
   MOTEUR DE RECHERCHE RAPIDE
================================= */
function normalizeText(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

let cachedCards = null;
let cachedSections = null;
let searchDebounceTimer = null;
let isSearchInitialized = false;

function initSearch() {
  // Cache DOM references after render
  cachedCards = document.querySelectorAll('.card');
  cachedSections = document.querySelectorAll('.section-wrap');

  if (isSearchInitialized) return;
  isSearchInitialized = true;

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {

    const raw = e.target.value.trim();
    const q = normalizeText(raw);
    searchClear.classList.toggle('visible', raw.length > 0);

    // Debounce: wait 150ms after last keystroke
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      const cards = cachedCards || document.querySelectorAll('.card');
      const sections = cachedSections || document.querySelectorAll('.section-wrap');
      let matchesCount = 0;

      if (!q) {
        cards.forEach(c => c.style.display = '');
        sections.forEach(s => s.style.display = '');
        searchInfo.classList.remove('visible');
        return;
      }

      sections.forEach(sec => {
        let secMatches = 0;
        const secCards = sec.querySelectorAll('.card');
        secCards.forEach(card => {
          const text = normalizeText(card.dataset.search || '');
          const match = text.includes(q);
          card.style.display = match ? '' : 'none';
          if (match) {
            secMatches++;
            matchesCount++;
          }
        });
        sec.style.display = secMatches > 0 ? '' : 'none';
      });

      searchInfo.innerHTML = `Résultat pour "<strong>${escapeHtml(raw)}</strong>" : <strong>${matchesCount}</strong> fiche(s) trouvée(s).`;
      searchInfo.classList.add('visible');
    }, 150);
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });
}

/* ===============================
   SONS & SYNTHÉTISEUR AUDIO WEB
================================= */
const sndStart = document.getElementById('snd-start');
const sndDone  = document.getElementById('snd-done');
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Bip synthétisé si fichier audio absent ou bloqué
function playSynthBeep(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'start') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else { // done
      [0, 0.18, 0.36].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        const freq = 660 + (i * 220);
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0.4, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.25);
        osc.start(now + delay);
        osc.stop(now + delay + 0.25);
      });
    }
  } catch (err) {
    console.log("Synth audio indisponible", err);
  }
}

function playSound(audioEl, type) {
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
    const p = audioEl.play();
    if (p !== undefined) {
      p.catch(() => playSynthBeep(type));
      return;
    }
  }
  playSynthBeep(type);
}

document.body.addEventListener('click', () => {
  getAudioContext();
  if (sndStart) sndStart.load();
  if (sndDone) sndDone.load();
}, { once: true });

/* ===============================
   TIMERS & LOCALSTORAGE
================================= */
const runningTimers = new Map();

function saveTimerState(key, status, endsAt, totalSec) {
  try {
    const raw = localStorage.getItem('gc_kitchen_state') || '{}';
    const state = JSON.parse(raw);
    if (status === 'to-do') {
      delete state[key];
    } else {
      state[key] = { status, endsAt, totalSec };
    }
    localStorage.setItem('gc_kitchen_state', JSON.stringify(state));
  } catch (e) {}
}

function restoreSavedTimers() {
  try {
    const raw = localStorage.getItem('gc_kitchen_state');
    if (!raw) return;
    const state = JSON.parse(raw);
    const now = Date.now();

    Object.keys(state).forEach(key => {
      const item = state[key];
      const badge = document.getElementById(key + '-badge');
      const tEl = document.getElementById(key + '-timer');
      if (!badge || !tEl) return;

      if (item.status === 'prog') {
        const remainSec = Math.round((item.endsAt - now) / 1000);
        if (remainSec > 0) {
          setBadge(badge, 'prog');
          startTimer(key, remainSec, item.endsAt);
        } else {
          setBadge(badge, 'ready');
          tEl.dataset.state = 'done';
          const timeEl = tEl.querySelector('.time');
          timeEl.textContent = "0:00";
        }
      } else if (item.status === 'ready') {
        setBadge(badge, 'ready');
        tEl.dataset.state = 'done';
        const timeEl = tEl.querySelector('.time');
        timeEl.textContent = "0:00";
      }
    });
  } catch (e) {}
}

function startTimer(key, remainingSeconds = null, targetEndTime = null) {
  const tEl = document.getElementById(key + '-timer');
  if (!tEl) return;
  const timeEl = tEl.querySelector('.time');
  const baseSeconds = parseInt(timeEl.dataset.seconds, 10) || 600;
  let sec = remainingSeconds !== null ? remainingSeconds : baseSeconds;
  const endsAt = targetEndTime || (Date.now() + sec * 1000);

  tEl.dataset.state = 'run';
  playSound(sndStart, 'start');
  saveTimerState(key, 'prog', endsAt, baseSeconds);

  if (runningTimers.has(key)) clearInterval(runningTimers.get(key));

  const itv = setInterval(() => {
    const currentRemain = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
    timeEl.textContent = formatTime(currentRemain);

    if (currentRemain <= 0) {
      clearInterval(itv);
      runningTimers.delete(key);
      tEl.dataset.state = 'done';
      playSound(sndDone, 'done');
      const badge = document.getElementById(key + '-badge');
      if (badge) setBadge(badge, 'ready');
      saveTimerState(key, 'ready', endsAt, baseSeconds);
    }
  }, 1000);

  runningTimers.set(key, itv);
}

function stopTimer(key) {
  if (runningTimers.has(key)) {
    clearInterval(runningTimers.get(key));
    runningTimers.delete(key);
  }
  const tEl = document.getElementById(key + '-timer');
  if (tEl) tEl.dataset.state = 'idle';
}

function setBadge(el, status) {
  const cssClass = status === 'prog' ? 'in-progress' : (status === 'ready' ? 'done' : 'to-do');
  el.className = 'card-status-badge ' + cssClass;
  el.dataset.status = status;
  el.textContent = status === 'to-do' ? '⚪ À PRÉPARER' : status === 'prog' ? '⏳ EN COURS' : '✅ PRÊT';
}

function initCardsBehavior() {
  document.querySelectorAll('.card-status-badge, .badge').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const status = btn.dataset.status;
      const tEl = document.getElementById(key + '-timer');
      const timeEl = tEl ? tEl.querySelector('.time') : null;
      const baseSec = timeEl ? parseInt(timeEl.dataset.seconds, 10) : 0;

      if (status === 'to-do') {
        setBadge(btn, 'prog');
        if (tEl) startTimer(key);
      } else if (status === 'prog') {
        setBadge(btn, 'ready');
        if (tEl) {
          stopTimer(key);
          tEl.dataset.state = 'done';
          saveTimerState(key, 'ready', Date.now(), baseSec);
        }
      } else {
        setBadge(btn, 'to-do');
        if (tEl) {
          stopTimer(key);
          tEl.dataset.state = 'idle';
          if (timeEl) timeEl.textContent = formatTime(baseSec);
          saveTimerState(key, 'to-do', null, baseSec);
        }
      }
    });
  });

  // Lightbox click
  document.querySelectorAll('.hero').forEach(img => {
    img.addEventListener('click', () => {
      const galleryAttr = img.dataset.gallery;
      currentGallery = galleryAttr ? galleryAttr.split('|').filter(Boolean) : [img.src];
      const card = img.closest('.card');
      currentGalleryName = card ? card.querySelector('.name').textContent : '';
      currentIndex = 0;
      showLightbox();
    });
  });
}

/* ===============================
   LIGHTBOX
================================= */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbTitle = document.getElementById('lb-title');
const lbCounter = document.getElementById('lb-counter');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
let currentGallery = [];
let currentIndex = 0;
let currentGalleryName = '';

function showLightbox() {
  if (!currentGallery.length) return;
  lbImg.src = currentGallery[currentIndex];
  lbImg.alt = currentGalleryName || 'Photo du plat';
  lbImg.onerror = () => { lbImg.src = PLACEHOLDER_SVG; };
  if (lbTitle) {
    lbTitle.textContent = currentGalleryName || '';
  }
  lb.classList.add('visible');
  const isMulti = currentGallery.length > 1;
  lbPrev.style.display = isMulti ? 'block' : 'none';
  lbNext.style.display = isMulti ? 'block' : 'none';
  lbCounter.style.display = isMulti ? 'block' : 'none';
  if (isMulti) {
    lbCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
  }
}


lbClose.onclick = () => lb.classList.remove('visible');
lbPrev.onclick = (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  showLightbox();
};
lbNext.onclick = (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentGallery.length;
  showLightbox();
};
lb.onclick = (e) => {
  if (e.target === lb) lb.classList.remove('visible');
};

// Support tactile Swipe pour le carrousel photo (tablettes cuisine)
let touchStartX = 0;
let touchEndX = 0;
lb.addEventListener('touchstart', (e) => {
  if (e.changedTouches && e.changedTouches[0]) {
    touchStartX = e.changedTouches[0].screenX;
  }
}, { passive: true });
lb.addEventListener('touchend', (e) => {
  if (e.changedTouches && e.changedTouches[0]) {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) lbNext.click();
    else if (touchEndX > touchStartX + 50) lbPrev.click();
  }
}, { passive: true });

document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('visible')) return;
  if (e.key === 'Escape') lb.classList.remove('visible');
  if (e.key === 'ArrowLeft') lbPrev.click();
  if (e.key === 'ArrowRight') lbNext.click();
});

// WakeLock : Maintien de l'écran allumé en cuisine
window.toggleKitchenWakeLock = async function() {
  const btn = document.getElementById('btn-wakelock');
  if (!window.GC_WakeLock || !window.GC_WakeLock.isSupported()) {
    alert("Votre navigateur ou appareil ne supporte pas l'API Screen Wake Lock.");
    return;
  }
  await window.GC_WakeLock.toggle((isActive) => {
    if (btn) {
      btn.classList.toggle('btn-wakelock-active', isActive);
      btn.innerHTML = isActive ? '💡 Écran Actif (ON)' : '💡 Écran Allumé';
    }
  });
};

// Filtres Rapides Cuisine
let activeQuickFilter = 'all';
function initQuickFilters() {
  const filterBtns = document.querySelectorAll('.quick-filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeQuickFilter = btn.dataset.filter || 'all';
      applyQuickFilter();
    };
  });
}

function applyQuickFilter() {
  const sections = document.querySelectorAll('.section-wrap');
  sections.forEach(sec => {
    let visibleInSec = 0;
    const cards = sec.querySelectorAll('.card');
    cards.forEach(c => {
      let match = true;
      if (activeQuickFilter === 'express') {
        const timeChip = c.querySelector('.chip-time') || c.querySelector('.chip.mins');
        const minutes = timeChip ? parseInt(timeChip.textContent.replace(/[^0-9]/g, ''), 10) : 99;
        match = minutes <= 10;
      } else if (activeQuickFilter === 'photos') {
        const hero = c.querySelector('img.hero');
        match = hero && !hero.src.startsWith('data:image/svg+xml');
      } else if (activeQuickFilter === 'vege') {
        // AM-04 FIX : mots-clés enrichis pour le filtre Frais & Salades
        const txt = (c.dataset.search || '').toLowerCase();
        match = txt.includes('salade') || txt.includes('burrata') || txt.includes('avocat')
             || txt.includes('fromage') || txt.includes('vegetarien') || txt.includes('vegeta')
             || txt.includes('roquette') || txt.includes('mesclun') || txt.includes('caprese')
             || txt.includes('bruschetta') || txt.includes('mozzarella') || txt.includes('tomate');
      }
      c.style.display = match ? '' : 'none';
      if (match) visibleInSec++;
    });
    sec.style.display = visibleInSec > 0 ? '' : 'none';
  });
}

// BUG-07 FIX : Gestion du thème déléguée à window.initThemeManager() (core-utils.js)
// Plus de duplication — initThemeManager gère l'init, le bouton et le localStorage
if (typeof window.initThemeManager === 'function') {
  window.initThemeManager('theme-toggle');
} else {
  // Fallback de sécurité si core-utils non chargé
  const _btn = document.getElementById('theme-toggle');
  const _saved = localStorage.getItem('gc_theme') || 'light';
  if (_saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (_btn) { _btn.textContent = '☀️ Mode Clair'; _btn.title = 'Passer au mode clair'; }
  }
  if (_btn) {
    _btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nxt = cur === 'dark' ? 'light' : 'dark';
      if (nxt === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        _btn.textContent = '☀️ Mode Clair';
      } else {
        document.documentElement.removeAttribute('data-theme');
        _btn.textContent = '🌙 Mode Sombre';
      }
      localStorage.setItem('gc_theme', nxt);
    });
  }
}

// Bouton Scroll to Top (AM-UI-08)
const btnScrollTop = document.getElementById('btn-scroll-top');
if (btnScrollTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 280) {
      btnScrollTop.classList.add('visible');
    } else {
      btnScrollTop.classList.remove('visible');
    }
  }, { passive: true });
  btnScrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Mise à jour dynamique lorsque les prix matières sont modifiés
if (window.GC_PricesModal) {
  window.GC_PricesModal.onUpdate(() => {
    renderAll();
  });
}

// Lancement initial
renderAll();