/**
 * GREY CORNER — Agent IA : Master Renderer (renderAIOptimizerAgent)
 * Module: comp-ai-render.js
 * Contient : renderAIOptimizerAgent — rendu HTML principal de l'agent IA,
 *            tous les sous-templates des 9 onglets.
 * Dépendances : comp-ai-engine.js, comp-ai-assistant.js, comp-ai-simulator.js,
 *               comp-ai-generator.js
 */
  function renderAIOptimizerAgent() {
    const container = document.getElementById('ai-agent-wrapper');
    if (!container) return;

    const analysis = analyzeDatasetForOptimizations();
    const stats = analysis.stats;

    // Contexte des ventes journalières et Menu Engineering
    const salesCtx = getDailySalesContext();
    const dailySales = analyzeDailySales(salesCtx.salesRows);
    const menuEng = analyzeMenuEngineering(salesCtx.salesRows);
var activeList = [];
    if (currentAITab === 'menu_engineering') {
      if (currentMenuEngFilter === 'star') activeList = menuEng.stars;
      else if (currentMenuEngFilter === 'plowhorse') activeList = menuEng.plowhorses;
      else if (currentMenuEngFilter === 'puzzle') activeList = menuEng.puzzles;
      else if (currentMenuEngFilter === 'dog') activeList = menuEng.dogs;
      else activeList = menuEng.items;
    }
    else if (currentAITab === 'daily_sales') activeList = dailySales.matchedSales;
    else if (currentAITab === 'quick_wins') activeList = analysis.quickWins;
    else if (currentAITab === 'pricing') activeList = analysis.pricingOpportunities;
    else if (currentAITab === 'standards') activeList = analysis.standardOpportunities;
    else if (currentAITab === 'critical') activeList = analysis.criticalAlerts;

    const displayedItems = activeList.slice(0, 16);
    const collapseIcon = isAIAgentCollapsed ? '▸ Déplier l\'analyse' : '▾ Réduire';

    // Options du sélecteur de dates journalières & cumul annuel
    const dateOptionsHTML = `
      <option value="__auto__" ${salesCtx.effectiveDate === '__auto__' ? 'selected' : ''}>📅 Dernier Jour Disponible</option>
      ${(salesCtx.availableYears || []).map(y => `<option value="__year_${y}" ${salesCtx.effectiveDate === '__year_' + y ? 'selected' : ''}>📈 Cumul Année ${y} (YTD)</option>`).join('')}
      ${salesCtx.availableDates.map(d => `<option value="${d}" ${salesCtx.effectiveDate === d ? 'selected' : ''}>📅 ${d}</option>`).join('')}
      <option value="__benchmark__" ${salesCtx.effectiveDate === '__benchmark__' ? 'selected' : ''}>⭐ Journée Type (Benchmark 125 couverts)</option>
    `;

    container.innerHTML = `
      <div class="ai-agent-header">
        <div class="ai-title-wrap">
          <div class="ai-pulse-indicator">
            <span class="ai-pulse-dot"></span>
          </div>
          <div>
            <h3 class="ai-agent-title">
              🤖 Agent Intelligent — Menu Engineering &amp; Cash Margin (Fès)
            </h3>
            <p class="ai-agent-subtitle">
              Audit permanent &bull; Matrice Kasavana &amp; Smith (Hors sodas, eaux &amp; suppléments) &bull; Cible Food Cost Café-Resto : <strong>32%</strong> &bull; Cash Net en Caisse : <span style="color:#059669; font-weight:900;">+${menuEng.stats.totalCashMargin.toLocaleString('fr-FR')} DH</span> (${menuEng.stats.totalQty} plats)
            </p>
          </div>
        </div>
        <div class="ai-agent-actions">
          <div class="ai-date-picker-wrap" title="Choisir la date des ventes journalières à analyser">
            <span style="font-size:12px;">📅 Jour :</span>
            <select class="ai-date-select" onchange="window.setAIDailySalesDate(this.value)">
              ${dateOptionsHTML}
            </select>
          </div>
          <button class="btn btn-secondary" style="font-size:12px; padding:5px 10px; font-weight:700;" onclick="window.renderAIOptimizerAgent ? window.renderAIOptimizerAgent() : null" title="Relancer l'analyse complète">
            🔄 Re-calculer
          </button>
          <button class="btn btn-secondary" style="font-size:12px; padding:5px 12px; font-weight:700;" onclick="window.toggleAIAgentCollapse()">
            ${collapseIcon}
          </button>
        </div>
      </div>

      <div class="ai-agent-body ${isAIAgentCollapsed ? 'collapsed' : ''}">
        
        <!-- ONGLETS PRINCIPAUX DE L'AGENT IA -->
        <div class="ai-nav-pills">
          <button class="ai-pill ${currentAITab === 'assistant' ? 'active' : ''}" onclick="window.setAITab('assistant')">
            💬 Assistant F&amp;B <span class="ai-pill-count">Copilote</span>
          </button>
          <button class="ai-pill ${currentAITab === 'simulator' ? 'active' : ''}" onclick="window.setAITab('simulator')">
            🎛️ Simulateur What-If <span class="ai-pill-count">Prix &amp; Dosage</span>
          </button>
          <button class="ai-pill ${currentAITab === 'generator' ? 'active' : ''}" onclick="window.setAITab('generator')">
            ✨ Concepteur Fiche IA <span class="ai-pill-count">Nouveau</span>
          </button>
          <button class="ai-pill ${currentAITab === 'menu_engineering' ? 'active' : ''}" onclick="window.setAITab('menu_engineering')">
            🎯 Menu Engineering <span class="ai-pill-count">${menuEng.items.length}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'daily_sales' ? 'active' : ''}" onclick="window.setAITab('daily_sales')">
            📅 Ventes du Jour <span class="ai-pill-count">${dailySales.matchedSales.length}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'quick_wins' ? 'active' : ''}" onclick="window.setAITab('quick_wins')">
            🔥 Quick Wins <span class="ai-pill-count">${stats.quickWinsCount}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'pricing' ? 'active' : ''}" onclick="window.setAITab('pricing')">
            💡 Optimisation Prix (Fès) <span class="ai-pill-count">${stats.pricingCount}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'standards' ? 'active' : ''}" onclick="window.setAITab('standards')">
            ⚖️ Réalignement Standards <span class="ai-pill-count">${stats.standardsCount}</span>
          </button>
          <button class="ai-pill ${currentAITab === 'critical' ? 'active' : ''}" onclick="window.setAITab('critical')">
            🚨 Alertes Rentabilité <span class="ai-pill-count">${stats.criticalCount}</span>
          </button>
        </div>

        ${currentAITab === 'assistant' ? `
          <!-- ONGLET 1: ASSISTANT CONVERSATIONNEL EXPERT F&B -->
          <div class="ai-assistant-container">
            <div class="ai-assistant-header-bar">
              <div>
                <div style="font-weight:800; font-size:14px; color:var(--text); display:flex; align-items:center; gap:8px;">
                  <span>💬 Copilote &amp; Conseiller Trésorerie F&amp;B</span>
                  <span class="ai-pill-count" style="background:rgba(99,102,241,0.15); color:#6366f1;">100% Hors-Ligne &bull; Données Réelles</span>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:3px;">
                  Audit instantané de vos recettes, simulations financières et briefings d'équipe basés sur vos ventes réelles.
                </div>
              </div>
              <button class="btn btn-secondary" style="font-size:11px; padding:4px 9px;" onclick="window.clearAIChatHistory ? window.clearAIChatHistory() : null">
                🗑️ Réinitialiser
              </button>
            </div>

            <div class="ai-prompt-chips">
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Quels sont les 3 plats les plus rentables ?') : null">
                🏆 Top 3 plats rentables
              </div>
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Quels plats ont un Food Cost critique > 35% ?') : null">
                🚨 Alertes Food Cost (>35%)
              </div>
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Quels sont les ingrédients les plus coûteux ?') : null">
                🥩 Ingrédients les plus coûteux
              </div>
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Donne-moi le briefing pour les serveurs aujourd\\\'hui') : null">
                📋 Briefing serveurs de ce soir
              </div>
              <div class="ai-prompt-chip" onclick="window.askAIFBAssistant ? window.askAIFBAssistant('Comment baisser mon food cost de 2% ?') : null">
                📉 Plan -2% Food Cost
              </div>
            </div>

            <div class="ai-chat-window" id="ai-chat-window">
              <!-- Rendu par renderAIChatMessages() -->
            </div>

            <form class="ai-chat-input-bar" onsubmit="event.preventDefault(); const inp = document.getElementById('ai-chat-user-input'); if(inp && inp.value.trim()){ window.askAIFBAssistant(inp.value.trim()); inp.value = ''; }">
              <input type="text" id="ai-chat-user-input" class="ai-chat-input" placeholder="Posez une question (ex: Quel plat dégage le plus de cash ? Comment optimiser la Mozzarella ?)..." autocomplete="off" />
              <button type="submit" class="ai-chat-send-btn">
                <span>Envoyer</span> 🚀
              </button>
            </form>
          </div>
        ` : currentAITab === 'simulator' ? `
          <!-- ONGLET 2: SIMULATEUR MACRO WHAT-IF (DOUBLE LEVIER PRIX & GRAMMAGE) -->
          <div class="ai-simulator-container">
            <div class="ai-sim-box">
              <div class="ai-sim-controls" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:16px;">
                <!-- 1. SÉLECTEUR MATIÈRE PREMIÈRE -->
                <div class="ai-sim-control-col">
                  <label class="ai-sim-label">1. Matière première clé à tester :</label>
                  <select id="sim-ingredient-select" class="ai-sim-select" onchange="window.simSelectedIngredient = this.value; window.updateSimulationView();">
                    <option value="Mozzarella" ${window.simSelectedIngredient === 'Mozzarella' ? 'selected' : ''}>🧀 Mozzarella râpée</option>
                    <option value="Viande" ${window.simSelectedIngredient === 'Viande' ? 'selected' : ''}>🥩 Viande de bœuf / Steak</option>
                    <option value="Poulet" ${window.simSelectedIngredient === 'Poulet' ? 'selected' : ''}>🍗 Poulet (Émincé / Blanc)</option>
                    <option value="Saumon" ${window.simSelectedIngredient === 'Saumon' ? 'selected' : ''}>🐟 Saumon (Frais / Fumé)</option>
                    <option value="Fromage" ${window.simSelectedIngredient === 'Fromage' ? 'selected' : ''}>🧀 Fromage Rouge / Gouda</option>
                    <option value="Crème" ${window.simSelectedIngredient === 'Crème' ? 'selected' : ''}>🥛 Crème fraîche épaisse</option>
                    <option value="Pain" ${window.simSelectedIngredient === 'Pain' ? 'selected' : ''}>🍞 Pain Burger / Panini</option>
                    <option value="Huile" ${window.simSelectedIngredient === 'Huile' ? 'selected' : ''}>🫒 Huile végétale / Friture</option>
                    <option value="Café" ${window.simSelectedIngredient === 'Café' ? 'selected' : ''}>☕ Café en grains</option>
                    <option value="Sauce Tomate" ${window.simSelectedIngredient === 'Sauce Tomate' ? 'selected' : ''}>🥫 Sauce Tomate Pizza</option>
                  </select>
                  <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                    💡 Sélectionnez l'ingrédient pour simuler l'impact combiné coût fournisseur et portion en cuisine.
                  </div>
                </div>

                <!-- 2. LEVIER FOURNISSEUR : PRIX D'ACHAT -->
                <div class="ai-sim-control-col">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <label class="ai-sim-label" style="margin-bottom:0;">2. Levier Fournisseur (Prix) :</label>
                    <span id="sim-variation-display" style="font-size:15px; font-weight:900; color:${window.simVariationPct > 0 ? '#ef4444' : (window.simVariationPct < 0 ? '#10b981' : 'var(--text-muted)')};">
                      ${window.simVariationPct > 0 ? '+' : ''}${window.simVariationPct}%
                    </span>
                  </div>
                  <div class="ai-sim-slider-wrap" style="margin-top:4px;">
                    <input type="range" id="sim-price-slider" min="-30" max="50" step="5" value="${window.simVariationPct}" class="ai-sim-slider" oninput="window.setSimVariation(parseInt(this.value, 10))" />
                    <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--text-muted); margin-top:2px;">
                      <span>-30%</span>
                      <span>0%</span>
                      <span>+50%</span>
                    </div>
                  </div>
                  <div class="ai-sim-chips">
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(-10)">-10%</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(0)">0%</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(10)">+10%</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(15)">+15%</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimVariation(25)">+25%</button>
                  </div>
                </div>

                <!-- 3. LEVIER CUISINE : GRAMMAGE / PORTIONNEMENT -->
                <div class="ai-sim-control-col">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <label class="ai-sim-label" style="margin-bottom:0;">3. Levier Portion (Grammage) :</label>
                    <span id="sim-grammage-display" style="font-size:15px; font-weight:900; color:${(window.simGrammageDelta || 0) < 0 ? '#10b981' : ((window.simGrammageDelta || 0) > 0 ? '#ef4444' : 'var(--text-muted)')};">
                      ${(window.simGrammageDelta || 0) > 0 ? '+' : ''}${window.simGrammageDelta || 0}${window.simGrammageMode === 'pct' ? '%' : 'g'}
                    </span>
                  </div>
                  <div style="display:flex; gap:6px; margin:4px 0;">
                    <button type="button" id="sim-mode-btn-grams" class="ai-tab-btn ${window.simGrammageMode !== 'pct' ? 'active' : ''}" style="padding:2px 8px; font-size:10.5px;" onclick="window.setSimGrammageMode('grams')">Grammes (±g)</button>
                    <button type="button" id="sim-mode-btn-pct" class="ai-tab-btn ${window.simGrammageMode === 'pct' ? 'active' : ''}" style="padding:2px 8px; font-size:10.5px;" onclick="window.setSimGrammageMode('pct')">Pourcentage (±%)</button>
                  </div>
                  <div class="ai-sim-slider-wrap">
                    <input type="range" id="sim-grammage-slider" min="${window.simGrammageMode === 'pct' ? -50 : -60}" max="${window.simGrammageMode === 'pct' ? 50 : 60}" step="5" value="${window.simGrammageDelta || 0}" class="ai-sim-slider" oninput="window.setSimGrammageDelta(parseFloat(this.value))" />
                    <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--text-muted); margin-top:2px;">
                      <span>${window.simGrammageMode === 'pct' ? '-50%' : '-60g'} (Réduction)</span>
                      <span>0</span>
                      <span>${window.simGrammageMode === 'pct' ? '+50%' : '+60g'} (Surdosage)</span>
                    </div>
                  </div>
                  <div class="ai-sim-chips">
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(-25)">-25g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(-15)">-15g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(-10)">-10g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(0)">0g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(10)">+10g</button>
                    <button type="button" class="ai-sim-chip" onclick="window.setSimGrammageDelta(20)">+20g</button>
                  </div>
                </div>
              </div>

              <div id="sim-results-panel">
                <!-- Rendu dynamiquement par updateSimulationView() -->
              </div>
            </div>
          </div>
        ` : currentAITab === 'generator' ? `
          <!-- ONGLET 3: CONCEPTEUR DE FICHE TECHNIQUE IA -->
          <div class="ai-generator-container">
            <div class="ai-gen-card">
              <div style="margin-bottom:14px;">
                <h4 style="margin:0 0 4px 0; font-size:16px; font-weight:900; color:var(--text);">
                  ✨ Concepteur Intelligent de Fiche Technique (Normes Fès)
                </h4>
                <p style="margin:0; font-size:12px; color:var(--text-muted);">
                  Indiquez le nom de votre plat. L'IA calibre automatiquement les grammages standards, calcule le coût matière exact, vérifie les plafonds tarifaires à Fès et prépare la fiche prête à enregistrer.
                </p>
              </div>

              <div class="ai-gen-form-grid">
                <div class="ai-gen-input-group">
                  <label>Nom du Plat ou Création :</label>
                  <input type="text" id="ai-gen-dish-name" value="${(window.escapeHtml || (s => s))(window.aiFormulatorState.dishName || 'Pizza Saumon & Burrata')}" placeholder="ex: Pizza Tartufo, Burger Double Smash..." onchange="window.aiFormulatorState.dishName = this.value;" />
                </div>

                <div class="ai-gen-input-group">
                  <label>Catégorie :</label>
                  <select id="ai-gen-cat" onchange="window.aiFormulatorState.category = this.value;">
                    <option value="PIZZA" ${window.aiFormulatorState.category === 'PIZZA' ? 'selected' : ''}>🍕 PIZZA</option>
                    <option value="BURGER" ${window.aiFormulatorState.category === 'BURGER' ? 'selected' : ''}>🍔 BURGER</option>
                    <option value="PASTA" ${window.aiFormulatorState.category === 'PASTA' ? 'selected' : ''}>🍝 PÂTES</option>
                    <option value="SALADES" ${window.aiFormulatorState.category === 'SALADES' ? 'selected' : ''}>🥗 SALADES</option>
                    <option value="PLATS" ${window.aiFormulatorState.category === 'PLATS' ? 'selected' : ''}>🥩 PLATS &amp; VIANDES</option>
                  </select>
                </div>

                <div class="ai-gen-input-group">
                  <label>Prix de Vente Cible (DH) [Optionnel] :</label>
                  <input type="number" id="ai-gen-price" value="${window.aiFormulatorState.targetPrice || ''}" placeholder="ex: 85 (Laisser vide pour auto-calibrage)" onchange="window.aiFormulatorState.targetPrice = parseFloat(this.value) || 0;" />
                </div>
              </div>

              <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div style="font-size:12px; color:var(--text-muted);">
                  💡 Cible ratio Food Cost : <strong>28% - 32%</strong> &bull; Référentiel mercuriale Fès intégré.
                </div>
                <button type="button" class="btn btn-primary" style="padding:8px 18px; font-weight:800; font-size:13px;" onclick="const name = document.getElementById('ai-gen-dish-name').value; const cat = document.getElementById('ai-gen-cat').value; const price = document.getElementById('ai-gen-price').value; window.triggerAIRecipeGeneration(name, cat, price);">
                  ⚡ Générer &amp; Équilibrer la Fiche
                </button>
              </div>
            </div>

            <div id="ai-gen-preview-container" style="margin-top:14px;">
              <!-- Rendu dynamiquement par renderAIGeneratedPreview() -->
            </div>
          </div>
        ` : `
          <!-- BANDEAU DES 4 KPIS EN FONCTION DU CONTEXTE -->
          ${currentAITab === 'menu_engineering' ? `
            <div class="ai-stats-row">
              <div class="ai-stat-card" style="border-left: 4px solid #10b981;">
                <div class="ai-stat-label">💵 Cash Net Réel en Caisse</div>
                <div class="ai-stat-value text-success">+${menuEng.stats.totalCashMargin.toLocaleString('fr-FR')} DH</div>
                <div class="ai-stat-sub">CA Réalisé : <strong>${menuEng.stats.totalRevenue.toLocaleString('fr-FR')} DH</strong> (${menuEng.stats.totalQty} ventes)</div>
              </div>
              <div class="ai-stat-card" style="border-left: 4px solid #0284c7;">
                <div class="ai-stat-label">⚖️ Marge Cash Moyenne / Plat</div>
                <div class="ai-stat-value" style="color:#0284c7;">+${menuEng.stats.avgCashMarginPerPortion.toFixed(2)} DH</div>
                <div class="ai-stat-sub">Food Cost Réel Pondéré : <strong>${menuEng.stats.weightedFoodCost}%</strong></div>
              </div>
              <div class="ai-stat-card" style="border-left: 4px solid #8b5cf6;">
                <div class="ai-stat-label">⭐ Matrice Kasavana &amp; Smith</div>
                <div class="ai-stat-value" style="color:#8b5cf6;">${menuEng.stars.length} ⭐ | ${menuEng.puzzles.length} 🧩</div>
                <div class="ai-stat-sub">${menuEng.plowhorses.length} Chevaux (🐎) | ${menuEng.dogs.length} Chiens (🐕)</div>
              </div>
              <div class="ai-stat-card" style="border-left: 4px solid #f59e0b;">
                <div class="ai-stat-label">🚀 Potentiel Cash Additionnel</div>
                <div class="ai-stat-value" style="color:#f59e0b;">+${Math.round(menuEng.stats.totalCashMargin * 0.14).toLocaleString('fr-FR')} DH</div>
                <div class="ai-stat-sub">Gain net via 3 actions prioritaires</div>
              </div>
            </div>
          ` : (currentAITab === 'daily_sales' ? `
            <div class="ai-stats-row">
              <div class="ai-stat-card" style="border-left: 4px solid #0284c7;">
                <div class="ai-stat-label">📊 Ventes Réalisées ce Jour</div>
                <div class="ai-stat-value text-accent">${dailySales.totalItemsSold} plats</div>
                <div class="ai-stat-sub">CA Réalisé : <strong>${dailySales.totalDailyRevenue.toLocaleString('fr-FR')} DH</strong></div>
              </div>
              <div class="ai-stat-card" style="border-left: 4px solid #d97706;">
                <div class="ai-stat-label">🥩 Food Cost Réel Pondéré</div>
                <div class="ai-stat-value" style="color:#d97706;">${dailySales.weightedGcFC} %</div>
                <div class="ai-stat-sub">Cible Standard : <strong class="text-success">${dailySales.weightedStdFC} %</strong></div>
              </div>
              <div class="ai-stat-card" style="border-left: 4px solid #dc2626;">
                <div class="ai-stat-label">💸 Pertes Surdosage Aujourd'hui</div>
                <div class="ai-stat-value text-danger">-${dailySales.totalDailyLostMargin.toFixed(2)} DH</div>
                <div class="ai-stat-sub">Manque à gagner évitable sur le service</div>
              </div>
              <div class="ai-stat-card" style="border-left: 4px solid #16a34a;">
                <div class="ai-stat-label">🎯 Marge Récupérable Mensuelle</div>
                <div class="ai-stat-value text-success">+${Math.round(dailySales.totalDailyLostMargin * 30).toLocaleString('fr-FR')} DH</div>
                <div class="ai-stat-sub">Bénéfice net additionnel / mois</div>
              </div>
            </div>
          ` : `
            <div class="ai-stats-row">
              <div class="ai-stat-card">
                <div class="ai-stat-label">💰 Gisement Total Identifié</div>
                <div class="ai-stat-value text-success">+${stats.totalMonthlySavings.toLocaleString('fr-FR')} DH</div>
                <div class="ai-stat-sub">Économie mensuelle estimée / mois</div>
              </div>
              <div class="ai-stat-card">
                <div class="ai-stat-label">⚡ Top Quick Wins</div>
                <div class="ai-stat-value text-accent">${stats.quickWinsCount} plats</div>
                <div class="ai-stat-sub">Gains immédiats &ge; 3.00 DH / assiette</div>
              </div>
              <div class="ai-stat-card">
                <div class="ai-stat-label">💡 Leviers de Prix Souples (Fès)</div>
                <div class="ai-stat-value" style="color:#0284c7;">${stats.pricingCount} plats</div>
                <div class="ai-stat-sub">+${stats.totalPotentialPricingRev.toLocaleString('fr-FR')} DH de marge additionnelle</div>
              </div>
              <div class="ai-stat-card">
                <div class="ai-stat-label">🚨 Alertes Food Cost</div>
                <div class="ai-stat-value ${stats.criticalCount > 0 ? 'text-danger' : 'text-success'}">${stats.criticalCount} plats</div>
                <div class="ai-stat-sub">Food Cost critique &ge; 38%</div>
              </div>
            </div>
          `)}

          ${currentAITab === 'menu_engineering' ? `
            <!-- BANDEAU DES 3 ACTIONS PRIORITAIRES DE TRÉSORERIE -->
            <div class="ai-priority-banner">
              <div class="ai-priority-header">
                <span style="font-size:17px;">🚀</span>
                <span>3 Actions Prioritaires Menu Engineering (Maximiser le Cash en Caisse) :</span>
              </div>
              <div class="ai-priority-grid">
                ${menuEng.priorityActions.map((action, i) => `
                  <div class="ai-priority-col">
                    <div class="ai-priority-badge">Action ${i + 1}</div>
                    <div class="ai-priority-title">${escapeHtml(action.title)}</div>
                    <div class="ai-priority-text">${action.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- BARRE DE SOUS-FILTRES DE LA MATRICE -->
            <div class="ai-quadrant-filter-bar">
              <span style="font-size:12px; font-weight:800; color:var(--text-muted); margin-right:4px;">
                📊 Filtrer la Matrice :
              </span>
              <button class="ai-sub-pill ${currentMenuEngFilter === 'all' ? 'active' : ''}" onclick="window.setMenuEngFilter('all')">
                Tous (${menuEng.items.length})
              </button>
              <button class="ai-sub-pill ${currentMenuEngFilter === 'star' ? 'active' : ''}" onclick="window.setMenuEngFilter('star')">
                ⭐ Étoiles (${menuEng.stars.length})
              </button>
              <button class="ai-sub-pill ${currentMenuEngFilter === 'plowhorse' ? 'active' : ''}" onclick="window.setMenuEngFilter('plowhorse')">
                🐎 Chevaux de Trait (${menuEng.plowhorses.length})
              </button>
              <button class="ai-sub-pill ${currentMenuEngFilter === 'puzzle' ? 'active' : ''}" onclick="window.setMenuEngFilter('puzzle')">
                🧩 Puzzles (${menuEng.puzzles.length})
              </button>
              <button class="ai-sub-pill ${currentMenuEngFilter === 'dog' ? 'active' : ''}" onclick="window.setMenuEngFilter('dog')">
                🐕 Chiens (${menuEng.dogs.length})
              </button>
              <div style="margin-left:auto; display:inline-flex; align-items:center; gap:5px; font-size:11.5px; color:var(--text-muted); background:var(--bg); padding:3px 9px; border-radius:7px; border:1px solid var(--border);" title="Les sodas, eaux minérales et suppléments/extras cuisine sont exclus de la matrice pour concentrer l'analyse sur vos véritables recettes et créations culinaires.">
                <span>🛡️</span>
                <span><strong>Sodas, Eaux &amp; Extras exclus</strong></span>
              </div>
            </div>
          ` : ''}

          ${currentAITab === 'quick_wins' && stats.quickWinsCount > 0 ? `
            <!-- BANDEAU D'APPLICATION GROUPÉE DES QUICK WINS -->
            <div style="margin-bottom:14px; padding:12px 16px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); border-radius:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <strong style="color:#059669; font-size:13px;">⚡ ${stats.quickWinsCount} Quick Wins Immédiats Détectés</strong>
                <div style="font-size:12px; color:var(--text-muted);">Gain direct estimé : <strong>+${stats.totalMonthlySavings.toLocaleString('fr-FR')} DH / mois</strong> en calibrant les portions sur les standards.</div>
              </div>
              <button class="btn btn-primary" style="background:#059669; border-color:#047857; font-weight:800; font-size:12px; padding:7px 16px;" onclick="window.applyAllQuickWinsBatch()">
                ⚡ Appliquer Tous les Quick Wins en 1 Clic
              </button>
            </div>
          ` : ''}

          ${salesCtx.isBenchmark && (currentAITab === 'daily_sales' || currentAITab === 'menu_engineering') ? `
            <div style="margin-bottom:14px; padding:10px 14px; background:rgba(2,132,199,0.08); border:1px solid rgba(2,132,199,0.25); border-radius:10px; font-size:12px; color:var(--text); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <span>💡 <strong>Service de Référence Actif :</strong> Analyse basée sur un service type étalonné. Pour analyser vos ventes réelles du jour, importez votre ticket caisse dans <a href="consommation.html" style="color:#0284c7; font-weight:800; text-decoration:none;">📊 Déstockage</a>.</span>
              <a href="consommation.html" class="btn btn-primary" style="font-size:11.5px; padding:4px 10px; text-decoration:none;">📥 Importer Ventes du Jour</a>
            </div>
          ` : ''}

          <!-- GRILLE DES IDÉES & ACTIONS QUOTIDIENNES -->
          <div class="ai-ideas-grid">
            ${displayedItems.length === 0 ? `
              <div style="grid-column: 1 / -1; padding:30px; text-align:center; color:var(--text-muted); background:var(--bg); border-radius:12px; border:1px dashed var(--border);">
                ✨ Aucun article ne correspond à ce filtre pour la période sélectionnée.
              </div>
            ` : displayedItems.map(item => {
              // Mode Menu Engineering & Cash Margin
              if (currentAITab === 'menu_engineering') {
                const qBadgeClass = item.quadrant === 'star' ? 'badge-star' : (item.quadrant === 'plowhorse' ? 'badge-plowhorse' : (item.quadrant === 'puzzle' ? 'badge-puzzle' : 'badge-dog'));
                const priorityBorderClass = item.quadrant === 'star' ? 'priority-star' : (item.quadrant === 'puzzle' ? 'priority-puzzle' : (item.quadrant === 'plowhorse' ? 'priority-medium' : 'priority-dog'));

                return `
                  <div class="ai-idea-card ${priorityBorderClass}">
                    <div class="ai-idea-top">
                      <div>
                        <span class="ai-dish-cat">${escapeHtml(item.category)}</span>
                        <h4 class="ai-dish-name">${escapeHtml(item.recipeName)}</h4>
                      </div>
                      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                        <span class="quadrant-badge ${qBadgeClass}">${item.quadrantLabel}</span>
                        ${item.isBankFeeder ? `<span class="badge-bank-feeder">💰 Nourricier Trésorerie</span>` : ''}
                        ${item.isCompensator ? `<span class="badge-compensator">🍹 Compensateur Marge</span>` : ''}
                      </div>
                    </div>

                    <div class="ai-metrics-compare">
                      <div class="ai-metric-col">
                        <span class="ai-metric-title">Vente &amp; Coût Matière</span>
                        <span class="ai-metric-val">
                          ${item.sellPrice} DH | Coût : ${item.cost.toFixed(2)} DH (FC ${item.foodCost.toFixed(1)}%)
                        </span>
                      </div>
                      <div class="ai-metric-col">
                        <span class="ai-metric-title">Marge Cash Unitaire &bull; Volume</span>
                        <span class="ai-cash-huge">
                          +${item.cashMargin.toFixed(2)} DH <span style="font-size:11.5px; font-weight:700; color:var(--text-muted);">(&times; ${item.qtySold} vendus)</span>
                        </span>
                      </div>
                    </div>

                    <div style="margin: 8px 0 6px 0; padding: 6px 10px; background: rgba(16, 185, 129, 0.08); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); display:flex; justify-content:space-between; align-items:center; font-size:12px;">
                      <span style="font-weight:700; color:var(--text);">💵 Liquidités nettes versées en caisse :</span>
                      <strong style="font-size:13.5px; color:#059669;">+${Math.round(item.totalCashMargin).toLocaleString('fr-FR')} DH</strong>
                    </div>

                    <div class="ai-idea-desc">
                      ${item.quadrantDesc}
                    </div>

                    <div class="ai-idea-actions">
                      ${item.actionType === 'apply_standard' ? `
                        <button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_standard')">
                          ${item.actionLabel}
                        </button>
                      ` : ''}
                      ${item.actionType === 'apply_price' ? `
                        <button class="ai-btn-action btn-apply-price" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_price', ${item.actionParam})">
                          ${item.actionLabel}
                        </button>
                      ` : ''}
                      <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'inspect')">
                        🔍 Examiner la Fiche
                      </button>
                    </div>
                  </div>
                `;
              }
              // Mode Ventes Journalières
              if (currentAITab === 'daily_sales') {
                const lossClass = item.dailyLostDH >= 100 ? 'priority-high' : (item.dailyLostDH >= 30 ? 'priority-medium' : 'priority-standard');
                return `
                  <div class="ai-idea-card ${lossClass}">
                    <div class="ai-idea-top">
                      <div>
                        <span class="ai-dish-cat">${escapeHtml(item.category)}</span>
                        <h4 class="ai-dish-name">${escapeHtml(item.recipeName)}</h4>
                      </div>
                      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:3px;">
                        <span class="ai-daily-qty-chip">📦 ${item.qtySold} vendus</span>
                        ${item.dailyLostDH > 0 
                          ? `<span class="ai-daily-loss-chip">Perte ce jour : -${item.dailyLostDH.toFixed(2)} DH</span>` 
                          : `<span class="ai-gain-chip" style="font-size:11px;">Marge Conforme ✅</span>`}
                      </div>
                    </div>

                    <div class="ai-metrics-compare">
                      <div class="ai-metric-col">
                        <span class="ai-metric-title">Vente &amp; Coût Grey Corner</span>
                        <span class="ai-metric-val" style="color:${item.gcFC > 35 ? '#dc2626' : 'var(--text)'};">
                          ${item.sellPrice} DH | Coût : ${item.gcCostUnit.toFixed(2)} DH (FC ${item.gcFC}%)
                        </span>
                      </div>
                      <div class="ai-metric-col">
                        <span class="ai-metric-title">Standard Métier Conseillé</span>
                        <span class="ai-metric-val text-success">
                          Coût : ${item.stdCostUnit.toFixed(2)} DH (FC ${item.stdFC}%)
                        </span>
                      </div>
                    </div>

                    <div class="ai-idea-desc">
                      ${item.unitDiffDH > 0 
                        ? `Surdosage unitaire de <strong>+${item.unitDiffDH.toFixed(2)} DH</strong> par assiette. Sur les <strong>${item.qtySold} ventes d'aujourd'hui</strong>, vous avez perdu <strong>${item.dailyLostDH.toFixed(2)} DH de marge nette</strong>.` 
                        : `Portion parfaitement alignée sur la norme internationale. Marge brute réalisée aujourd'hui : <strong>${((item.sellPrice - item.gcCostUnit) * item.qtySold).toFixed(2)} DH</strong>.`}
                    </div>

                    <div class="ai-idea-actions">
                      ${item.unitDiffDH > 0 ? `
                        <button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_standard')">
                          🟢 Appliquer Standard (+${item.unitDiffDH.toFixed(2)} DH/v)
                        </button>
                      ` : ''}
                      <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'inspect')">
                        🔍 Voir la Fiche
                      </button>
                    </div>
                  </div>
                `;
              }

              // Mode Recommandations Globales (Quick Wins, Pricing, Standards, Alertes)
              const priorityClass = item.priority === 'high' ? 'priority-high' : (item.priority === 'standard' ? 'priority-standard' : 'priority-medium');
              return `
                <div class="ai-idea-card ${priorityClass}">
                  <div class="ai-idea-top">
                    <div>
                      <span class="ai-dish-cat">${escapeHtml(item.category)}</span>
                      <h4 class="ai-dish-name">${escapeHtml(item.recipeName)}</h4>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                      ${item.monthlyGain ? `<span class="ai-gain-chip">💰 +${item.monthlyGain.toLocaleString('fr-FR')} DH/m</span>` : ''}
                      ${item.marketInfo ? `<span class="ai-market-badge">📍 Fès : ${item.marketInfo.marketRange}</span>` : ''}
                      ${item.cashMarginDH ? `<span class="ai-cash-margin-chip">💵 Marge : +${item.cashMarginDH.toFixed(2)} DH</span>` : ''}
                    </div>
                  </div>

                  ${item.currentFC ? `
                    <div class="ai-metrics-compare">
                      <div class="ai-metric-col">
                        <span class="ai-metric-title">Situation Actuelle</span>
                        <span class="ai-metric-val" style="color:${item.currentFC > 35 ? '#dc2626' : 'var(--text)'};">
                          FC ${item.currentFC}% ${item.currentCost ? `(${item.currentCost.toFixed(2)} DH)` : ''}
                        </span>
                      </div>
                      <div class="ai-metric-col">
                        <span class="ai-metric-title">Objectif Café-Resto Fès</span>
                        <span class="ai-metric-val text-success">
                          ${item.stdFC ? `FC ${item.stdFC}% (${item.stdCost.toFixed(2)} DH)` : (item.targetPrice ? `${item.targetPrice} DH (FC ${item.newFC}%)` : `Marge saine`)}
                        </span>
                      </div>
                    </div>
                  ` : ''}

                  <div class="ai-idea-desc">
                    ${item.desc}
                  </div>

                  <div class="ai-idea-actions">
                    ${item.actionType === 'apply_standard' ? `
                      <button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_standard')">
                        ${item.actionLabel}
                      </button>
                    ` : ''}
                    ${item.actionType === 'apply_price' ? `
                      <button class="ai-btn-action btn-apply-price" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'apply_price', ${item.actionParam})">
                        ${item.actionLabel}
                      </button>
                    ` : ''}
                    <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${encodeURIComponent(item.recipeName)}', 'inspect')">
                      🔍 Voir la Fiche
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          ${activeList.length > 14 ? `
            <div style="margin-top:16px; text-align:center; font-size:12px; color:var(--text-muted);">
              Affichage des 14 éléments prioritaires sur un total de <strong>${activeList.length}</strong> identifiés dans cette vue.
            </div>
          ` : ''}
        `}

      </div>
    `;

    // Post-render hooks pour les onglets interactifs
    if (currentAITab === 'assistant') {
      setTimeout(() => {
        if (typeof window.renderAIChatMessages === 'function') window.renderAIChatMessages();
      }, 30);
    } else if (currentAITab === 'simulator') {
      setTimeout(() => {
        if (typeof window.updateSimulationView === 'function') window.updateSimulationView();
      }, 30);
    } else if (currentAITab === 'generator') {
      setTimeout(() => {
        if (typeof window.triggerAIRecipeGeneration === 'function') {
          window.triggerAIRecipeGeneration(window.aiFormulatorState.dishName, window.aiFormulatorState.category, window.aiFormulatorState.targetPrice);
        }
      }, 30);
    }
  }
  window.renderAIOptimizerAgent = renderAIOptimizerAgent;


