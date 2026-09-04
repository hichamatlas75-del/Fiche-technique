/* ========================================================
   GREY CORNER — AUDIT FLASH MANUEL & HISTORIQUE DES SESSIONS
   Contrôle Physique des Stocks & Archivage Daté
======================================================== */

(function() {
  'use strict';

  // État local de la page
  let allIngredientsCatalog = [];
  let currentSessionItems = [];
  let allPastSessions = [];
  let activeSessionId = 'current';

  const SESSIONS_STORAGE_KEY = 'gc_audit_sessions_v1';
  const ACTIVE_ITEMS_KEY = 'greyAuditFlashHistory';

  const INGREDIENT_CATEGORIES_LOCAL = {
    viandes: ['poulet', 'boeuf', 'bœuf', 'steak', 'kefta', 'viande', 'dinde', 'canard', 'veau', 'viande hachee', 'viande hachée', 'merguez', 'saucisse', 'charcuterie', 'bacon', 'jambon', 'khlii', 'nuggets', 'cordon bleu', 'salami', 'pepperoni', 'viande'],
    poissons: ['saumon', 'crevette', 'crevettes', 'calamar', 'calamars', 'poisson', 'fruits de mer', 'gambas', 'thon', 'moules', 'palourde', 'dorade', 'loup', 'anchois', 'surimi'],
    fromages: ['fromage', 'mozzarella', 'cheddar', 'parmesan', 'gouda', 'edam', 'burrata', 'feta', 'bleu', 'gorgonzola', 'brie', 'camembert', 'ricotta', 'mascarpone', 'cream cheese', 'jeban', 'vache qui rit', 'kiri', 'lait', 'creme', 'crème', 'beurre', 'yaourt', 'leben', 'lait concentre', 'creme liquide'],
    boissons: ['eau', 'oulmes', 'oulmès', 'coca', 'sprite', 'hawai', 'poms', 'schweppes', 'orangina', 'red bull', 'nespresso', 'pastille', 'cafe', 'café', 'the', 'thé', 'verveine', 'infusion', 'chocolat', 'sirop', 'glacon', 'glaçon', 'glace', 'boba', 'boisson', 'jus', 'smoothie', 'sidi ali'],
    legumes: ['tomate', 'oignon', 'champignon', 'pomme de terre', 'frite', 'frites', 'puree', 'potatos', 'avocat', 'salade', 'mesclun', 'laitue', 'roquette', 'epinard', 'épinard', 'poivron', 'radis', 'carotte', 'concombre', 'betterave', 'olive', 'olives', 'orange', 'citron', 'fraise', 'framboise', 'mangue', 'banane', 'pomme', 'ananas', 'peche', 'pêche', 'kiwi', 'fruits', 'fruit', 'menthe', 'agrumes', 'acai', 'haricot', 'courgette', 'brocoli', 'persil', 'coriandre', 'ail']
  };

  function cleanTextLocal(str) {
    if (!str) return '';
    return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function categorizeIngredientLocal(name) {
    const n = cleanTextLocal(name);
    for (const [category, keywords] of Object.entries(INGREDIENT_CATEGORIES_LOCAL)) {
      if (keywords.some(kw => n.includes(kw))) return category;
    }
    return 'epicerie';
  }

  function toggleAppTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('gc_theme', next);
  }

  // Chargement du catalogue d'ingrédients
  function loadIngredientsCatalog() {
    const setMap = new Map();
    const cats = window.CATEGORIES_DATA || window.DATA || [];

    if (Array.isArray(cats)) {
      cats.forEach(cat => {
        if (Array.isArray(cat.items)) {
          cat.items.forEach(recipe => {
            const techList = recipe.tech || recipe.ingredients || [];
            techList.forEach(line => {
              if (!line || typeof line !== 'string') return;
              const parts = line.split(':');
              const ingName = parts[0].trim();
              const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';
              if (ingName && ingName.length >= 2) {
                const key = cleanTextLocal(ingName);
                if (!setMap.has(key)) {
                  let unit = 'g';
                  if (qtyStr.includes('ml') || qtyStr.includes('cl') || qtyStr.includes('l') || qtyStr.includes('L')) unit = 'ml';
                  else if (qtyStr.includes('p') || qtyStr.includes('pcs') || qtyStr.includes('tr') || qtyStr.includes('canette') || qtyStr.includes('btl')) unit = 'p';

                  setMap.set(key, {
                    name: ingName,
                    unit: unit,
                    category: categorizeIngredientLocal(ingName),
                    theorique: 0
                  });
                }
              }
            });
          });
        }
      });
    }

    const costMap = window.INGREDIENT_UNIT_COSTS || {};
    Object.keys(costMap).forEach(k => {
      const key = cleanTextLocal(k);
      const def = costMap[k];
      if (!setMap.has(key)) {
        let u = def.unit || 'g';
        if (u === 'piece') u = 'p';
        setMap.set(key, {
          name: k.charAt(0).toUpperCase() + k.slice(1),
          unit: u,
          category: categorizeIngredientLocal(k),
          theorique: 0
        });
      }
    });

    allIngredientsCatalog = Array.from(setMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }

  function populateIngredientSelect() {
    const select = document.getElementById('flash-ing-select');
    if (!select) return;

    select.innerHTML = '<option value="">-- Choisir une matière première --</option>';

    const catGroups = {
      'viandes': '🥩 Viandes & Volailles',
      'poissons': '🐟 Poissons & Fruits de Mer',
      'fromages': '🧀 Fromages & Produits Laitiers',
      'boissons': '☕ Café & Boissons',
      'legumes': '🥗 Légumes & Fruits',
      'epicerie': '🥫 Épicerie & Sauces'
    };

    Object.keys(catGroups).forEach(catKey => {
      const filtered = allIngredientsCatalog.filter(i => i.category === catKey);
      if (filtered.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = catGroups[catKey];
        filtered.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.name;
          opt.textContent = `${item.name} (${item.unit})`;
          optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
      }
    });
  }

  // Changement d'ingrédient dans le formulaire
  function onAuditIngredientChange(selectedName) {
    if (!selectedName) {
      resetFlashInputs();
      return;
    }

    const found = allIngredientsCatalog.find(i => cleanTextLocal(i.name) === cleanTextLocal(selectedName));
    let unit = found ? found.unit : 'g';
    if (unit === 'piece') unit = 'p';

    document.querySelectorAll('.flash-unit-lbl').forEach(el => el.textContent = unit);

    let priceUnit = 'DH / kg';
    if (unit === 'ml') priceUnit = 'DH / L';
    else if (unit === 'p' || unit === 'piece') priceUnit = 'DH / pièce';
    const priceLbl = document.getElementById('flash-price-unit-lbl');
    if (priceLbl) priceLbl.textContent = priceUnit;

    // Déterminer le prix indicatif (converti en DH/kg ou DH/L pour g/ml)
    let defaultPrice = (unit === 'p' || unit === 'piece') ? 5 : 50;
    const costMap = window.INGREDIENT_UNIT_COSTS || {};
    const key = cleanTextLocal(selectedName);
    for (const [k, v] of Object.entries(costMap)) {
      if (key.includes(cleanTextLocal(k)) || cleanTextLocal(k).includes(key)) {
        if (unit === 'g' || unit === 'ml') {
          defaultPrice = Math.round((v.cost * 1000) * 100) / 100;
        } else {
          defaultPrice = Math.round((v.cost) * 100) / 100;
        }
        break;
      }
    }

    const existingInActive = currentSessionItems.find(i => cleanTextLocal(i.name) === cleanTextLocal(selectedName));
    if (existingInActive) {
      document.getElementById('flash-sinit').value = existingInActive.sInit || 0;
      document.getElementById('flash-achats').value = existingInActive.achats || 0;
      document.getElementById('flash-sfinal').value = existingInActive.sFinal || 0;
      document.getElementById('flash-theorique').value = existingInActive.theo || 0;
      document.getElementById('flash-casse').value = existingInActive.casse || 0;
      document.getElementById('flash-prix').value = existingInActive.prix || defaultPrice;
    } else {
      document.getElementById('flash-prix').value = defaultPrice;
    }

    calculateLiveAuditFlash();
  }

  // Synchronisation des ventes théoriques depuis consommation.html
  function syncTheoriqueFromSales() {
    const sel = document.getElementById('flash-ing-select');
    if (!sel || !sel.value) {
      // Validation : garder alert() car requiert une action utilisateur explicite
      alert("Veuillez d'abord sélectionner une matière première.");
      return;
    }

    const ingName = sel.value;
    const cleanIng = cleanTextLocal(ingName);
    const found = allIngredientsCatalog.find(i => cleanTextLocal(i.name) === cleanIng);
    const unit = found ? found.unit : (document.querySelector('.flash-unit-lbl')?.textContent || 'g');
    let totalTheo = 0;

    // Essayer de lire depuis la base de ventes mensuelle (gc_monthly_sales_db_v3) ou legacy
    try {
      const monthlyRaw = localStorage.getItem('gc_monthly_sales_db_v3');
      const salesRaw = localStorage.getItem('gc_pos_sales_v4') || localStorage.getItem('gc_pos_sales');
      const data = window.CATEGORIES_DATA || window.DATA || [];

      if (monthlyRaw) {
        const db = JSON.parse(monthlyRaw);
        const sessionDate = document.getElementById('session-date')?.value || '';
        let salesRows = [];
        if (sessionDate && db[sessionDate]) {
          salesRows = db[sessionDate];
        } else {
          const ym = sessionDate ? sessionDate.slice(0, 7) : '';
          Object.keys(db).forEach(d => {
            if (!ym || d.startsWith(ym)) {
              salesRows = salesRows.concat(db[d] || []);
            }
          });
        }

        const salesMap = {};
        const aliasMap = window.ALIAS_MAP || {};
        salesRows.forEach(r => {
          if (r && r.product) {
            const aliasTarget = aliasMap[r.product] || r.product;
            const p = cleanTextLocal(aliasTarget);
            salesMap[p] = (salesMap[p] || 0) + (parseFloat(r.qty) || 0);
            const directClean = cleanTextLocal(r.product);
            if (directClean !== p) {
              salesMap[directClean] = (salesMap[directClean] || 0) + (parseFloat(r.qty) || 0);
            }
          }
        });

        data.forEach(cat => {
          (cat.items || []).forEach(item => {
            const itemClean = cleanTextLocal(item.name);
            const count = salesMap[itemClean] || 0;
            if (count > 0 && Array.isArray(item.tech)) {
              item.tech.forEach(line => {
                const parts = line.split(':');
                const techIng = cleanTextLocal(parts[0]);
                if (techIng.includes(cleanIng) || cleanIng.includes(techIng)) {
                  const qtyStr = parts.length > 1 ? parts.slice(1).join(':').trim() : '1 p';
                  let q = 1;
                  const gMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
                  const kgMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i);
                  const mlMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);
                  const clMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*cl\b/i);
                  const lMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*l\b/i);
                  const pMatch = qtyStr.match(/(\d+(?:[.,]\d+)?)\s*(?:p|piece|tranche|part|boule|sachet|portion|tr)\b/i);

                  if (unit === 'g') {
                    if (gMatch) q = parseFloat(gMatch[1].replace(',', '.'));
                    else if (kgMatch) q = parseFloat(kgMatch[1].replace(',', '.')) * 1000;
                    else if (pMatch) q = parseFloat(pMatch[1].replace(',', '.')) * 50;
                    else q = parseFloat(qtyStr.replace(',', '.')) || 1;
                  } else if (unit === 'ml') {
                    if (mlMatch) q = parseFloat(mlMatch[1].replace(',', '.'));
                    else if (clMatch) q = parseFloat(clMatch[1].replace(',', '.')) * 10;
                    else if (lMatch) q = parseFloat(lMatch[1].replace(',', '.')) * 1000;
                    else q = parseFloat(qtyStr.replace(',', '.')) || 100;
                  } else {
                    if (pMatch) q = parseFloat(pMatch[1].replace(',', '.'));
                    else q = parseFloat(qtyStr.replace(',', '.')) || 1;
                  }
                  totalTheo += q * count;
                }
              });
            }
          });
        });
      } else if (salesRaw) {
        const sales = JSON.parse(salesRaw);
        data.forEach(cat => {
          (cat.items || []).forEach(item => {
            const count = sales[item.name] || 0;
            if (count > 0 && Array.isArray(item.tech)) {
              item.tech.forEach(line => {
                if (cleanTextLocal(line.split(':')[0]).includes(cleanIng)) {
                  const num = parseFloat(line.split(':')[1]?.replace(/[^0-9.]/g, '')) || 0;
                  totalTheo += num * count;
                }
              });
            }
          });
        });
      }
    } catch (e) {
      console.warn("Impossible de récupérer les ventes théoriques", e);
    }

    if (totalTheo > 0) {
      document.getElementById('flash-theorique').value = totalTheo.toFixed(2);
      calculateLiveAuditFlash();
      // AM-02 FIX : Toast non bloquant au lieu d'alert()
      showToast(`⚡ ${totalTheo.toFixed(2)} ${unit} chargés depuis les ventes enregistrées !`);
    } else {
      showToast("Aucune vente enregistrée trouvée pour cet ingrédient. Saisissez la quantité manuellement.");
    }
  }


  // Calcul en direct du diagnostic d'audit
  function calculateLiveAuditFlash() {
    const s = document.getElementById('flash-ing-select');
    const name = s ? s.value : '';
    const unitEl = document.querySelector('.flash-unit-lbl');
    const unit = unitEl ? unitEl.textContent : 'g';

    const sInit = parseFloat(document.getElementById('flash-sinit')?.value) || 0;
    const achats = parseFloat(document.getElementById('flash-achats')?.value) || 0;
    const sFinal = parseFloat(document.getElementById('flash-sfinal')?.value) || 0;
    const theo = parseFloat(document.getElementById('flash-theorique')?.value) || 0;
    const casse = parseFloat(document.getElementById('flash-casse')?.value) || 0;
    const prix = parseFloat(document.getElementById('flash-prix')?.value) || 0;

    // Consommation réelle = Stock Initial + Achats - Stock Final
    const consReelle = Math.max(0, sInit + achats - sFinal);
    // Consommation attendue = Ventes Théoriques + Casse déclarée
    const consAttendue = theo + casse;
    // Écart net = Consommation Réelle - Consommation Attendue
    const ecart = consReelle - consAttendue;

    // Écart %
    let ecartPct = 0;
    if (consAttendue > 0) {
      ecartPct = (ecart / consAttendue) * 100;
    } else if (consReelle > 0) {
      ecartPct = 100;
    }

    // Impact financier en DH
    let unitMultiplier = 1;
    if (unit === 'g' || unit === 'ml') unitMultiplier = 0.001; // DH/kg ou DH/L
    const impactDH = ecart * unitMultiplier * prix;

    // Mise à jour de l'affichage
    const reelEl = document.getElementById('flash-kpi-reel');
    if (reelEl) reelEl.textContent = `${consReelle.toFixed(2)} ${unit}`;
    const attenduEl = document.getElementById('flash-kpi-attendu');
    if (attenduEl) attenduEl.textContent = `${consAttendue.toFixed(2)} ${unit}`;

    const ecartEl = document.getElementById('flash-kpi-ecart');
    const sign = ecart > 0 ? '+' : '';
    if (ecartEl) {
      ecartEl.textContent = `${sign}${ecart.toFixed(2)} ${unit}`;
      ecartEl.className = 'audit-kpi-val ' + (ecart > 0 ? 'danger' : 'ok');
    }

    const ecartPctEl = document.getElementById('flash-kpi-ecart-pct');
    if (ecartPctEl) ecartPctEl.textContent = `${sign}${ecartPct.toFixed(1)}% vs Attendu`;

    const impactEl = document.getElementById('flash-kpi-impact');
    if (impactEl) {
      impactEl.textContent = `${sign}${impactDH.toFixed(2)} DH`;
      impactEl.className = 'audit-kpi-val ' + (impactDH > 0 ? 'danger' : 'ok');
    }

    const badge = document.getElementById('flash-status-badge');
    const diagBox = document.getElementById('flash-diagnostic-box');

    if (!name) {
      if (diagBox) diagBox.innerHTML = "Sélectionnez une matière première pour afficher le diagnostic d'audit en direct.";
      if (badge) {
        badge.className = 'status-badge ok';
        badge.textContent = 'EN ATTENTE';
      }
      return null;
    }

    let statusBadgeText = '✅ CONFORME';
    let statusClass = 'ok';

    if (Math.abs(ecartPct) <= 3 || (consAttendue === 0 && consReelle === 0)) {
      statusBadgeText = '✅ CONFORME';
      statusClass = 'ok';
      if (diagBox) diagBox.innerHTML = `<strong>✅ Gestion Optimale (Écart de ${ecartPct.toFixed(1)}%) :</strong> La consommation réelle de <strong>${name}</strong> correspond parfaitement aux fiches techniques. Aucun coulage ni perte détecté.`;
    } else if (ecartPct > 3 && ecartPct <= 8) {
      statusBadgeText = '⚠️ SURDOSAGE MODÉRÉ';
      statusClass = 'warn';
      if (diagBox) diagBox.innerHTML = `<strong>⚠️ Surconsommation Modérée (+${ecartPct.toFixed(1)}%) :</strong> Dérive financière estimée à <strong>${impactDH.toFixed(2)} DH</strong>. Vérifier le respect des grammages en cuisine.`;
    } else if (ecartPct > 8) {
      statusBadgeText = '🚨 SURCONSOMMATION CRITIQUE';
      statusClass = 'danger';
      if (diagBox) diagBox.innerHTML = `<strong>🚨 Surconsommation Critique (+${ecartPct.toFixed(1)}%) :</strong> Perte financière de <strong>${impactDH.toFixed(2)} DH</strong>. Causes : surdosage systématique, casse non déclarée ou perte au déstockage. Contrôle physique requis.`;
    } else {
      statusBadgeText = '📉 SOUS-DOSAGE';
      statusClass = 'under';
      if (diagBox) diagBox.innerHTML = `<strong>📉 Consommation Inférieure aux Recettes (${ecartPct.toFixed(1)}%) :</strong> Moins de matière consommée que prévu. Vérifier si les portions servies aux clients ne sont pas sous-dosées.`;
    }

    if (badge) {
      badge.className = 'status-badge ' + statusClass;
      badge.textContent = statusBadgeText;
    }

    return { 
      name, unit, sInit, achats, sFinal, consReelle, theo, casse, 
      consAttendue, ecart, ecartPct, prix, impactDH, 
      statusBadge: statusBadgeText, statusClass 
    };
  }

  // Enregistrer l'ingrédient actuel dans la session active
  function saveCurrentAuditToHistory() {
    const current = calculateLiveAuditFlash();
    if (!current || !current.name || current.name === '-- Choisir une matière première --') {
      alert("Veuillez d'abord sélectionner une matière première dans la liste.");
      return;
    }

    const existingIdx = currentSessionItems.findIndex(x => cleanTextLocal(x.name) === cleanTextLocal(current.name));
    if (existingIdx >= 0) {
      currentSessionItems[existingIdx] = current;
    } else {
      currentSessionItems.unshift(current);
    }

    saveCurrentItemsToStorage();
    renderCurrentSessionTable();
    showToast(`✅ "${current.name}" enregistré dans la session active !`);
  }

  function removeAuditFromHistory(idx) {
    if (confirm("Supprimer cet ingrédient de la session d'audit ?")) {
      currentSessionItems.splice(idx, 1);
      saveCurrentItemsToStorage();
      renderCurrentSessionTable();
    }
  }

  function resetFlashInputs() {
    const s = document.getElementById('flash-ing-select');
    if (s) s.value = '';
    const fields = ['flash-sinit', 'flash-achats', 'flash-sfinal', 'flash-theorique', 'flash-casse'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '0';
    });
    calculateLiveAuditFlash();
  }

  // Clôturer et archiver la session d'audit actuelle
  function closeAndSaveCurrentSession() {
    if (currentSessionItems.length === 0) {
      // Validation : garder alert() car exige une action corrective de l'utilisateur
      alert("La session active ne contient aucun ingrédient. Auditez et ajoutez au moins un ingrédient avant de clôturer.");
      return;
    }


    const dateVal = document.getElementById('session-date')?.value || new Date().toISOString().slice(0, 10);
    const serviceVal = document.getElementById('session-service')?.value || 'Service Soir';
    const auditorVal = document.getElementById('session-auditor')?.value || 'Manager';

    let totalImpact = 0;
    let conformingCount = 0;

    currentSessionItems.forEach(item => {
      totalImpact += item.impactDH || 0;
      if (Math.abs(item.ecartPct || 0) <= 5) conformingCount++;
    });

    const conformityRate = Math.round((conformingCount / currentSessionItems.length) * 100);

    let globalStatus = '✅ Conforme';
    if (totalImpact > 100) globalStatus = '🚨 Perte Critique';
    else if (totalImpact > 30) globalStatus = '⚠️ Surconsommation Modérée';
    else if (totalImpact < -20) globalStatus = '📉 Sous-dosage';

    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const newSession = {
      id: 'AUDIT-' + Date.now(),
      date: dateVal,
      time: timeStr,
      service: serviceVal,
      auditor: auditorVal,
      itemsCount: currentSessionItems.length,
      totalImpactDH: Math.round(totalImpact * 100) / 100,
      conformityRate: conformityRate,
      status: globalStatus,
      items: JSON.parse(JSON.stringify(currentSessionItems))
    };

    allPastSessions.unshift(newSession);
    savePastSessionsToStorage();

    // Réinitialiser la session active
    currentSessionItems = [];
    saveCurrentItemsToStorage();
    resetFlashInputs();

    renderSessionSelector();
    renderCurrentSessionTable();
    renderPastSessionsTable();

    showToast("💾 Session d'audit clôturée et archivée avec succès dans l'historique !");
  }

  // Démarrer une nouvelle session
  function startNewAuditSession() {
    activeSessionId = 'current';
    const sel = document.getElementById('session-selector');
    if (sel) sel.value = 'current';

    const tag = document.getElementById('session-status-tag');
    if (tag) {
      tag.textContent = '🔵 SESSION ACTIVE';
      tag.style.cssText = 'padding:6px 12px; border-radius:8px; font-size:12px; font-weight:800; background:rgba(2, 132, 199, 0.1); color:#0284c7; border:1px solid rgba(2, 132, 199, 0.3);';
    }

    currentSessionItems = [];
    saveCurrentItemsToStorage();
    resetFlashInputs();
    renderCurrentSessionTable();
    showToast("➕ Nouvelle session d'audit démarrée !");
  }

  // Sélection d'une session dans la liste déroulante
  function onSessionSelectChange(val) {
    if (val === 'current') {
      activeSessionId = 'current';
      loadCurrentItemsFromStorage();
      renderCurrentSessionTable();
      const tag = document.getElementById('session-status-tag');
      if (tag) {
        tag.textContent = '🔵 SESSION ACTIVE';
        tag.style.cssText = 'padding:6px 12px; border-radius:8px; font-size:12px; font-weight:800; background:rgba(2, 132, 199, 0.1); color:#0284c7; border:1px solid rgba(2, 132, 199, 0.3);';
      }
    } else {
      activeSessionId = val;
      const session = allPastSessions.find(s => s.id === val);
      if (session) {
        document.getElementById('session-date').value = session.date;
        document.getElementById('session-service').value = session.service;
        document.getElementById('session-auditor').value = session.auditor;
        currentSessionItems = JSON.parse(JSON.stringify(session.items || []));
        renderCurrentSessionTable();

        const tag = document.getElementById('session-status-tag');
        if (tag) {
          tag.textContent = `📜 ARCHIVE (${session.status})`;
          tag.style.cssText = 'padding:6px 12px; border-radius:8px; font-size:12px; font-weight:800; background:rgba(100, 116, 139, 0.15); color:var(--text); border:1px solid var(--border);';
        }
      }
    }
  }

  // Suppression d'une session passée
  function deletePastSession(idx) {
    if (confirm("Supprimer définitivement cette session d'audit de l'historique ?")) {
      allPastSessions.splice(idx, 1);
      savePastSessionsToStorage();
      renderSessionSelector();
      renderPastSessionsTable();
      showToast("🗑️ Session supprimée de l'historique.");
    }
  }

  function clearAllPastSessions() {
    if (confirm("Voulez-vous supprimer TOUTES les sessions passées de l'historique ?")) {
      allPastSessions = [];
      savePastSessionsToStorage();
      renderSessionSelector();
      renderPastSessionsTable();
      showToast("🗑️ Historique complet réinitialisé.");
    }
  }

  // Stockage
  function saveCurrentItemsToStorage() {
    localStorage.setItem(ACTIVE_ITEMS_KEY, JSON.stringify(currentSessionItems));
  }

  function loadCurrentItemsFromStorage() {
    const raw = localStorage.getItem(ACTIVE_ITEMS_KEY);
    if (raw) {
      try {
        currentSessionItems = JSON.parse(raw);
      } catch (e) {
        currentSessionItems = [];
      }
    }
  }

  function savePastSessionsToStorage() {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(allPastSessions));
  }

  function loadPastSessionsFromStorage() {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (raw) {
      try {
        allPastSessions = JSON.parse(raw);
      } catch (e) {
        allPastSessions = [];
      }
    } else {
      // Charger une session d'exemple par défaut pour illustrer
      allPastSessions = [
        {
          id: 'AUDIT-DEMO-01',
          date: new Date().toISOString().slice(0, 10),
          time: '22:00',
          service: 'Service Soir',
          auditor: 'Hicham (Manager)',
          itemsCount: 4,
          totalImpactDH: 34.50,
          conformityRate: 75,
          status: '⚠️ Surconsommation Modérée',
          items: [
            { name: 'Mozzarella', unit: 'g', sInit: 10000, achats: 5000, sFinal: 6800, consReelle: 8200, theo: 8000, casse: 0, consAttendue: 8000, ecart: 200, ecartPct: 2.5, prix: 55, impactDH: 11.00, statusBadge: '✅ CONFORME', statusClass: 'ok' },
            { name: 'Crevettes avec coquille', unit: 'g', sInit: 6000, achats: 4000, sFinal: 3200, consReelle: 6800, theo: 6400, casse: 100, consAttendue: 6500, ecart: 300, ecartPct: 4.6, prix: 58, impactDH: 17.40, statusBadge: '⚠️ SURDOSAGE MODÉRÉ', statusClass: 'warn' },
            { name: 'Viande hachée', unit: 'g', sInit: 8000, achats: 5000, sFinal: 5400, consReelle: 7600, theo: 7500, casse: 0, consAttendue: 7500, ecart: 100, ecartPct: 1.3, prix: 90, impactDH: 9.00, statusBadge: '✅ CONFORME', statusClass: 'ok' },
            { name: 'Calamar congelé', unit: 'g', sInit: 5000, achats: 3000, sFinal: 4100, consReelle: 3900, theo: 3950, casse: 0, consAttendue: 3950, ecart: -50, ecartPct: -1.3, prix: 58, impactDH: -2.90, statusBadge: '📉 SOUS-DOSAGE', statusClass: 'under' }
          ]
        }
      ];
      savePastSessionsToStorage();
    }
  }

  // Rendu de la liste déroulante des sessions
  function renderSessionSelector() {
    const sel = document.getElementById('session-selector');
    if (!sel) return;

    let html = `<option value="current">➕ Session Active (En cours - ${currentSessionItems.length} art.)</option>`;
    if (allPastSessions.length > 0) {
      html += `<optgroup label="📜 Historique des Sessions Clôturées">`;
      allPastSessions.forEach(s => {
        const sign = s.totalImpactDH > 0 ? '+' : '';
        html += `<option value="${s.id}">📅 ${s.date} ${s.time} (${s.service} — ${s.itemsCount} art. — ${sign}${s.totalImpactDH} DH)</option>`;
      });
      html += `</optgroup>`;
    }
    sel.innerHTML = html;
    sel.value = activeSessionId;
  }

  // Rendu du tableau des ingrédients de la session courante
  function renderCurrentSessionTable() {
    const tbody = document.getElementById('audit-history-tbody');
    const countEl = document.getElementById('audit-history-count');
    const totalDhEl = document.getElementById('audit-history-total-dh');
    if (!tbody) return;

    if (countEl) countEl.textContent = currentSessionItems.length;

    let totalEcartDH = 0;

    if (currentSessionItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="14" style="text-align:center; padding:30px; color:var(--text-muted);">
        Aucun ingrédient audité dans cette session pour le moment. Utilisez le formulaire ci-dessus pour ajouter vos matières premières.
      </td></tr>`;
      if (totalDhEl) totalDhEl.textContent = 'Écart Total : 0.00 DH';
      return;
    }

    tbody.innerHTML = currentSessionItems.map((item, idx) => {
      totalEcartDH += item.impactDH || 0;
      const sign = item.ecart > 0 ? '+' : '';
      const cat = categorizeIngredientLocal(item.name);

      let badgeHtml = '';
      if (Math.abs(item.ecartPct) <= 3) badgeHtml = '<span class="status-badge ok">✅ CONFORME</span>';
      else if (item.ecartPct > 3 && item.ecartPct <= 8) badgeHtml = '<span class="status-badge warn">⚠️ SURDOSAGE</span>';
      else if (item.ecartPct > 8) badgeHtml = '<span class="status-badge danger">🚨 CRITIQUE</span>';
      else badgeHtml = '<span class="status-badge under">📉 SOUS-DOSAGE</span>';

      let pUnit = 'DH/kg';
      if (item.unit === 'ml' || item.unit === 'l' || item.unit === 'L') pUnit = 'DH/L';
      else if (item.unit === 'p' || item.unit === 'pcs' || item.unit === 'piece') pUnit = 'DH/u';

      return `<tr>
        <td style="font-weight:800; min-width:180px;">${item.name}</td>
        <td style="text-align:center;"><span class="cat-chip ${cat}">${cat.toUpperCase()}</span></td>
        <td style="text-align:center;"><span class="unit-chip">${item.unit}</span></td>
        <td style="text-align:right;">${item.sInit.toFixed(2)}</td>
        <td style="text-align:right;">${item.achats.toFixed(2)}</td>
        <td style="text-align:right;">${item.sFinal.toFixed(2)}</td>
        <td style="text-align:right; font-weight:800;">${item.consReelle.toFixed(2)}</td>
        <td style="text-align:right; color:var(--text-muted);">${item.theo.toFixed(2)}</td>
        <td style="text-align:right;">${item.casse.toFixed(2)}</td>
        <td style="text-align:right; font-weight:900; color:${item.ecart > 0 ? 'var(--danger)' : 'var(--ok)'};">${sign}${item.ecart.toFixed(2)}</td>
        <td style="text-align:center;">${badgeHtml}</td>
        <td style="text-align:right; font-weight:700;">${item.prix.toFixed(2)} <span style="font-size:11px; color:var(--text-muted);">${pUnit}</span></td>
        <td style="text-align:right; font-weight:900; color:${item.impactDH > 0 ? 'var(--danger)' : 'var(--ok)'};">${sign}${item.impactDH.toFixed(2)} DH</td>
        <td style="text-align:center;">
          <button class="btn-del-row" onclick="removeAuditFromHistory(${idx})" title="Supprimer de la session">✕</button>
        </td>
      </tr>`;
    }).join('');

    if (totalDhEl) {
      const s = totalEcartDH > 0 ? '+' : '';
      totalDhEl.textContent = `Écart Total : ${s}${totalEcartDH.toFixed(2)} DH`;
      totalDhEl.style.color = totalEcartDH > 0 ? 'var(--danger)' : 'var(--ok)';
    }
  }

  // Rendu du tableau des sessions passées (Section 4)
  function renderPastSessionsTable() {
    const tbody = document.getElementById('past-sessions-tbody');
    const countEl = document.getElementById('past-sessions-count');
    if (!tbody) return;

    if (countEl) countEl.textContent = allPastSessions.length;

    if (allPastSessions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">
        Aucune session clôturée pour l'instant. Clôturez votre première session avec le bouton bleu en haut.
      </td></tr>`;
      return;
    }

    tbody.innerHTML = allPastSessions.map((s, idx) => {
      const sign = s.totalImpactDH > 0 ? '+' : '';
      let statusBadge = `<span class="status-badge ok">✅ Conforme</span>`;
      if (s.totalImpactDH > 100) statusBadge = `<span class="status-badge danger">🚨 Perte Critique</span>`;
      else if (s.totalImpactDH > 30) statusBadge = `<span class="status-badge warn">⚠️ Modéré</span>`;
      else if (s.totalImpactDH < -20) statusBadge = `<span class="status-badge under">📉 Sous-dosage</span>`;

      return `<tr>
        <td style="font-weight:800; color:var(--text);">${s.date} <span style="font-size:11px; color:var(--text-muted); font-weight:normal;">(${s.time})</span></td>
        <td style="font-weight:700;">${s.service}</td>
        <td>${s.auditor || 'Manager'}</td>
        <td style="text-align:center;"><span class="unit-chip" style="font-weight:800;">${s.itemsCount || (s.items ? s.items.length : 0)} art.</span></td>
        <td style="text-align:right; font-weight:900; color:${s.totalImpactDH > 0 ? 'var(--danger)' : 'var(--ok)'};">${sign}${s.totalImpactDH.toFixed(2)} DH</td>
        <td style="text-align:center; font-weight:800;">${s.conformityRate || 100}%</td>
        <td style="text-align:center;">${statusBadge}</td>
        <td style="text-align:center;">
          <button class="btn" style="padding:4px 8px; font-size:11px; font-weight:700; margin-right:4px;" onclick="loadSessionById('${s.id}')" title="Consulter cette session">👁️ Voir</button>
          <button class="btn btn-success" style="padding:4px 8px; font-size:11px; font-weight:700; margin-right:4px;" onclick="exportSingleSessionToExcel('${s.id}')" title="Exporter en Excel">📥 Excel</button>
          <button class="btn" style="padding:4px 8px; font-size:11px; font-weight:700; color:var(--danger); border-color:var(--danger);" onclick="deletePastSession(${idx})" title="Supprimer">🗑️</button>
        </td>
      </tr>`;
    }).join('');
  }

  // Charger une session par ID
  window.loadSessionById = function(id) {
    onSessionSelectChange(id);
    const sel = document.getElementById('session-selector');
    if (sel) sel.value = id;
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Export Excel de la session active ou passée
  function exportAuditHistoryToExcel() {
    if (currentSessionItems.length === 0) {
      alert("Aucun ingrédient dans cette session à exporter.");
      return;
    }

    const dateStr = document.getElementById('session-date')?.value || new Date().toISOString().slice(0, 10);
    const serviceStr = document.getElementById('session-service')?.value || 'Service';
    const auditorStr = document.getElementById('session-auditor')?.value || 'Manager';

    const summaryRows = [
      ["GREY CORNER — RAPPORT OFFICIEL D'AUDIT FLASH DE STOCK"],
      ["Date du Contrôle :", dateStr],
      ["Période / Service :", serviceStr],
      ["Auditeur Responsable :", auditorStr],
      ["Date d'export :", new Date().toLocaleString('fr-FR')],
      [],
      ["SYNTHÈSE DES ÉCARTS PAR MATIÈRE PREMIÈRE"]
    ];

    const detailHeaders = [
      "Matière Première", "Catégorie", "Unité", "Stock Initial", "Achats & Livraisons", 
      "Stock Final Compté", "Consommation Réelle", "Théorie Ventes (Recettes)", "Casse Déclarée", 
      "Consommation Attendue", "Écart Quantité", "Écart %", "Prix Unitaire", "Impact Financier (DH)", "Diagnostic"
    ];

    const detailRows = [detailHeaders];

    currentSessionItems.forEach(item => {
      let pUnit = 'DH/kg';
      if (item.unit === 'ml' || item.unit === 'l') pUnit = 'DH/L';
      else if (item.unit === 'p') pUnit = 'DH/u';

      detailRows.push([
        item.name,
        categorizeIngredientLocal(item.name).toUpperCase(),
        item.unit,
        item.sInit,
        item.achats,
        item.sFinal,
        item.consReelle,
        item.theo,
        item.casse,
        item.consAttendue,
        item.ecart,
        item.ecartPct ? item.ecartPct.toFixed(1) + '%' : '0%',
        `${item.prix.toFixed(2)} ${pUnit}`,
        item.impactDH,
        item.statusBadge || 'CONFORME'
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.aoa_to_sheet([...summaryRows, ...detailRows]);
    XLSX.utils.book_append_sheet(wb, ws1, "Rapport d'Audit");

    XLSX.writeFile(wb, `GreyCorner_Audit_${dateStr}_${serviceStr.replace(/\s+/g, '_')}.xlsx`);
    showToast("📥 Fichier Excel généré avec succès !");
  }

  // Export d'une session spécifique
  window.exportSingleSessionToExcel = function(id) {
    const s = allPastSessions.find(x => x.id === id);
    if (!s) return;

    const exportData = (s.items || []).map(item => ({
      'Matière Première': item.name,
      'Catégorie': categorizeIngredientLocal(item.name).toUpperCase(),
      'Unité': item.unit,
      'Stock Initial': item.sInit,
      'Achats': item.achats,
      'Stock Final': item.sFinal,
      'Consommation Réelle': item.consReelle,
      'Théorie Ventes': item.theo,
      'Casse': item.casse,
      'Écart Qté': item.ecart,
      'Écart %': (item.ecartPct || 0).toFixed(1) + '%',
      'Impact DH': item.impactDH,
      'Diagnostic': item.statusBadge || 'CONFORME'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Audit ${s.date}`);
    XLSX.writeFile(wb, `GreyCorner_Audit_${s.date}_${s.id}.xlsx`);
    showToast("📥 Session exportée en Excel !");
  };

  // Sauvegarde globale au format JSON
  function exportFullHistoryJSON() {
    const backupObj = {
      exportedAt: new Date().toISOString(),
      restaurant: "Grey Corner",
      totalSessions: allPastSessions.length,
      sessions: allPastSessions
    };

    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grey-corner-audit-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📁 Fichier de sauvegarde JSON téléchargé !");
  }

  // Notification Toast
  function showToast(msg) {
    let toast = document.getElementById('audit-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'audit-toast';
      toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:#0f172a; color:#fff; padding:14px 22px; border-radius:12px; font-weight:700; font-size:14px; box-shadow:0 8px 24px rgba(0,0,0,0.3); z-index:9999; display:flex; align-items:center; gap:10px; transition:all 0.3s ease; border:1px solid #334155;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 3200);
  }

  // Initialisation automatique au chargement
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('gc_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const dateInput = document.getElementById('session-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }

    loadIngredientsCatalog();
    populateIngredientSelect();
    loadCurrentItemsFromStorage();
    loadPastSessionsFromStorage();

    renderSessionSelector();
    renderCurrentSessionTable();
    renderPastSessionsTable();
  });

  // Exports globaux
  window.toggleAppTheme = toggleAppTheme;
  window.onAuditIngredientChange = onAuditIngredientChange;
  window.syncTheoriqueFromSales = syncTheoriqueFromSales;
  window.calculateLiveAuditFlash = calculateLiveAuditFlash;
  window.saveCurrentAuditToHistory = saveCurrentAuditToHistory;
  window.removeAuditFromHistory = removeAuditFromHistory;
  window.resetFlashInputs = resetFlashInputs;
  window.closeAndSaveCurrentSession = closeAndSaveCurrentSession;
  window.startNewAuditSession = startNewAuditSession;
  window.onSessionSelectChange = onSessionSelectChange;
  window.deletePastSession = deletePastSession;
  window.clearAllPastSessions = clearAllPastSessions;
  window.exportAuditHistoryToExcel = exportAuditHistoryToExcel;
  window.exportFullHistoryJSON = exportFullHistoryJSON;
  window.loadIngredientsCatalog = loadIngredientsCatalog;
  window.populateIngredientSelect = populateIngredientSelect;

})();
