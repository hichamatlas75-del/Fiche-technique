/**
 * GREY CORNER — Agent IA : Assistant F&B Conversationnel (NLP)
 * Module: comp-ai-assistant.js
 * Contient : aiChatHistory, NLP_ING_DICT, NLP_STOP_WORDS, normalizeNLP,
 *            findDishesByIngredient, levenshtein, fuzzyFindRecipe, askAIFBAssistant,
 *            clearAIChatHistory, renderAIChatMessages.
 * Dépendances : comp-ai-engine.js (analyzeMenuEngineering, analyzeDatasetForOptimizations,
 *               getDailySalesContext, allRecipes)
 */
  /* ========================================================
     1. ASSISTANT F&B CONVERSATIONNEL INTELLIGENT (CHAT IA F&B)
  ======================================================== */
  var aiChatHistory = [
    {
      sender: 'ai',
      time: 'Maintenant',
      text: `👋 <strong>Bonjour Chef / Direction Grey Corner !</strong> Je suis votre Copilote IA F&B dédié.<br>
J'ai analysé en direct vos <strong>${(window.allRecipes || []).length || 288} fiches techniques</strong>, vos coûts matières et les données de vente.<br>
Cliquez sur une suggestion ci-dessous ou posez-moi n'importe quelle question sur vos marges, vos ingrédients ou vos prix !`
    }
  ];
  window.aiChatHistory = aiChatHistory;

  window.clearAIChatHistory = function() {
    aiChatHistory = [
      {
        sender: 'ai',
        time: 'Maintenant',
        text: `🔄 <strong>Discussion réinitialisée.</strong> Comment puis-je vous aider à optimiser votre rentabilité ?`
      }
    ];
    window.aiChatHistory = aiChatHistory;
    if (typeof window.renderAIChatMessages === 'function') window.renderAIChatMessages();
  };

  window.renderAIChatMessages = function() {
    const chatWindow = document.getElementById('ai-chat-window');
    if (!chatWindow) return;
    chatWindow.innerHTML = aiChatHistory.map(msg => `
      <div class="ai-chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}">
        <div class="ai-bubble-meta">
          <strong>${msg.sender === 'user' ? '👤 Vous' : '🤖 Copilote IA'}</strong>
          <span>${msg.time}</span>
        </div>
        <div class="ai-bubble-content">${msg.text}</div>
      </div>
    `).join('');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  /* ========================================================
     1. ASSISTANT CONVERSATIONNEL F&B : MOTEUR NLP AVANCÉ
     Gère toutes les questions libres en langage naturel :
     - Recherche par ingrédient / matière première (ex: "Quel plat qui contient viande hachée")
     - Recherche par catégorie / famille culinaire (ex: "Combien de pizzas ?", "Liste des burgers")
     - Diagnostic précis & composition complète par plat (recherche floue, ex: "Margherita")
     - Comparaison côte-à-côte de deux plats (ex: "Compare Margherita et 4 Saisons")
     - Filtrage tarifaire et classements (ex: "Le plus cher", "Plats à moins de 50 DH")
     - Mercuriale et coût unitaire matière (ex: "Combien coûte le kilo de viande hachée ?")
     - Alertes et Food Cost critique / global
     - Menu Engineering (Stars, Puzzles, Chevaux de trait, Chiens)
     - Simulation de dosage What-If en langage naturel
     - Définitions et pédagogie F&B (Food Cost, marge brute, etc.)
     - Salutations, aide et recherche plein texte tolérante
  ======================================================== */

  // Helper normalisation avancée NLP (minuscules, sans accents, sans tirets ni ponctuation)
  function normalizeNLP(s) {
    return String(s || '')
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’\-]/g, " ")
      .replace(/[?!.,;:()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Dictionnaire sémantique des ingrédients et synonymes courants
  const NLP_ING_DICT = [
    { key: 'viande hachee', aliases: ['viande hachee', 'viande hache', 'steak hache', 'hache de boeuf', 'kefta', 'viande boeuf', 'hache'], label: 'Viande Hachée / Bœuf' },
    { key: 'mozzarella', aliases: ['mozzarella', 'mozza', 'fromage pizza', 'fromage rape'], label: 'Mozzarella' },
    { key: 'poulet', aliases: ['poulet', 'blanc de poulet', 'emince de poulet', 'escalope', 'dinde', 'volaille'], label: 'Poulet' },
    { key: 'saumon', aliases: ['saumon', 'saumon fume', 'saumon frais', 'pave de saumon'], label: 'Saumon' },
    { key: 'crevette', aliases: ['crevette', 'crevettes', 'gambas'], label: 'Crevettes / Gambas' },
    { key: 'calamar', aliases: ['calamar', 'calamars', 'seiche', 'poulpe', 'fruits de mer'], label: 'Calamar / Fruits de Mer' },
    { key: 'thon', aliases: ['thon', 'thon blanc', 'thon naturel'], label: 'Thon' },
    { key: 'fromage', aliases: ['fromage rouge', 'fromage', 'gouda', 'edam', 'cheddar'], label: 'Fromage Rouge / Gouda' },
    { key: 'parmesan', aliases: ['parmesan', 'grana padano', 'pecorino'], label: 'Parmesan' },
    { key: 'chevre', aliases: ['chevre', 'fromage de chevre', 'buche de chevre'], label: 'Fromage de Chèvre' },
    { key: 'gorgonzola', aliases: ['gorgonzola', 'bleu', 'roquefort'], label: 'Gorgonzola / Bleu' },
    { key: 'creme', aliases: ['creme fraiche', 'creme', 'creme liquide', 'creme epaisse'], label: 'Crème Fraîche' },
    { key: 'champignon', aliases: ['champignon de paris', 'champignon', 'champignons'], label: 'Champignons' },
    { key: 'truffe', aliases: ['creme de truffe', 'truffe', 'huile de truffe', 'tartufo'], label: 'Truffe' },
    { key: 'avocat', aliases: ['avocat', 'guacamole'], label: 'Avocat' },
    { key: 'oeuf', aliases: ['oeuf', 'oeufs', 'jaune d oeuf'], label: 'Œufs' },
    { key: 'bacon', aliases: ['bacon', 'lardons', 'pancetta'], label: 'Bacon' },
    { key: 'charcuterie', aliases: ['charcuterie', 'jambon', 'salami', 'pepperoni'], label: 'Charcuterie' },
    { key: 'pain', aliases: ['pain burger', 'pain', 'brioche', 'ciabatta', 'panini'], label: 'Pain' },
    { key: 'pomme de terre', aliases: ['frite', 'frites', 'pomme de terre', 'patate'], label: 'Pommes de Terre / Frites' },
    { key: 'tomate', aliases: ['sauce tomate', 'tomate', 'coulis', 'tomates cerises'], label: 'Sauce Tomate' },
    { key: 'huile', aliases: ['huile d olive', 'huile', 'huile vegetale', 'friture'], label: 'Huile' },
    { key: 'cafe', aliases: ['cafe', 'grain', 'espresso'], label: 'Café' },
    { key: 'chocolat', aliases: ['chocolat', 'nutella', 'cacao'], label: 'Chocolat / Nutella' },
    { key: 'fraise', aliases: ['fraise', 'fruits rouges'], label: 'Fraise' }
  ];

  // Stop words français
  const NLP_STOP_WORDS = new Set([
    'le', 'la', 'les', 'l', 'un', 'une', 'des', 'de', 'du', 'd',
    'et', 'ou', 'a', 'au', 'aux', 'en', 'dans', 'sur', 'pour', 'par',
    'avec', 'sans', 'sous', 'qui', 'que', 'quoi', 'dont',
    'est', 'sont', 'a', 'ont', 'fait', 'font', 'etre', 'avoir',
    'quel', 'quels', 'quelle', 'quelles', 'combien', 'comment',
    'plat', 'plats', 'recette', 'recettes', 'fiche', 'fiches',
    'technique', 'techniques', 'menu', 'carte', 'donne', 'moi',
    'montre', 'affiche', 'liste', 'trouve', 'chercher', 'voir',
    'svp', 'plait'
  ]);

  // Recherche de fiches contenant un ingrédient
  function findDishesByIngredient(ingTerm, recipes) {
    const norm = normalizeNLP(ingTerm);
    const matches = [];
    recipes.forEach(r => {
      const matchBd = (r.greyCorner.breakdown || []).find(b => {
        const bNorm = normalizeNLP(b.ingredient);
        return bNorm.includes(norm) || norm.includes(bNorm);
      });
      const matchTech = (r.greyCorner.tech || []).find(t => {
        const tNorm = normalizeNLP(t);
        return tNorm.includes(norm);
      });
      const matchName = normalizeNLP(r.name).includes(norm);

      if (matchBd || matchTech || matchName) {
        let portion = 'Standard';
        let costDH = 0;
        let ingLabel = ingTerm;
        if (matchBd) {
          portion = `${matchBd.qtyNumber || matchBd.quantity} ${matchBd.unit || 'g'}`;
          costDH = matchBd.cost || 0;
          ingLabel = matchBd.ingredient;
        } else if (matchTech) {
          const parts = matchTech.split(':');
          ingLabel = parts[0].trim();
          portion = parts[1] ? parts[1].trim() : '1 portion';
        }
        matches.push({
          recipe: r,
          ingName: ingLabel,
          portion: portion,
          costDH: costDH
        });
      }
    });
    return matches;
  }

  // Distance de Levenshtein pour tolérance aux fautes d'orthographe (ex: Margherita vs Margarita)
  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // Recherche floue de plat dans les fiches
  function fuzzyFindRecipe(dishQuery, recipes) {
    const norm = normalizeNLP(dishQuery);
    if (!norm || norm.length < 2) return null;
    let found = recipes.find(r => normalizeNLP(r.name) === norm);
    if (found) return found;
    found = recipes.find(r => normalizeNLP(r.name).includes(norm));
    if (found) return found;
    found = recipes.find(r => norm.includes(normalizeNLP(r.name)));
    if (found) return found;

    const qTokens = norm.split(' ').filter(w => w.length >= 3 && !NLP_STOP_WORDS.has(w));
    if (qTokens.length > 0) {
      let bestScore = 0;
      let bestDish = null;
      recipes.forEach(r => {
        const rNorm = normalizeNLP(r.name);
        const rWords = rNorm.split(' ');
        let score = 0;
        qTokens.forEach(t => {
          if (rNorm.includes(t)) {
            score += t.length * 2;
          } else {
            // Tolérance aux fautes d'orthographe (ex: margherita vs margarita)
            rWords.forEach(rw => {
              if (Math.abs(rw.length - t.length) <= 2) {
                const d = levenshtein(rw, t);
                const maxAllowed = rw.length > 5 ? 2 : 1;
                if (d <= maxAllowed) {
                  score += (t.length - d);
                }
              }
            });
          }
        });
        if (score > bestScore) {
          bestScore = score;
          bestDish = r;
        }
      });
      if (bestScore >= 4) return bestDish;
    }
    return null;
  }

  window.askAIFBAssistant = function(query) {
    if (!query || !query.trim()) return;
    const cleanFn = window.cleanText || (s => String(s || '').toLowerCase().trim());
    const rawQ = query.trim();
    const cleanQ = cleanFn(rawQ);
    const normQ = normalizeNLP(rawQ);
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    aiChatHistory.push({ sender: 'user', time: now, text: (window.escapeHtml || (s => s))(query) });

    let responseText = '';
    const recipes = window.allRecipes || [];
    const salesCtx = getDailySalesContext();
    const menuEng = analyzeMenuEngineering(salesCtx.salesRows);
    const analysis = analyzeDatasetForOptimizations();

    // ========================================================
    // 1. SALUTATIONS, AIDE & GUIDE DE DÉCOUVERTE
    // ========================================================
    if (normQ === 'bonjour' || normQ === 'salut' || normQ === 'salam' || normQ === 'hello' || normQ === 'bonsoir' || normQ.includes('aide') || normQ.includes('help') || normQ.includes('que peux tu faire') || normQ.includes('qui es tu') || normQ.includes('comment tu marches')) {
      responseText = `👋 <strong>Bonjour Chef / Direction Grey Corner !</strong> Je suis votre Copilote Intelligent F&B dédié.<br><br>
Voici quelques exemples de questions auxquelles je réponds instantanément :<br><br>
• 🥩 <strong>Recherche par ingrédient :</strong> <em>« Quel plat qui contient viande hachée ? »</em>, <em>« Plats avec saumon »</em><br>
• 🍕 <strong>Exploration par catégorie :</strong> <em>« Combien de pizzas avons-nous ? »</em>, <em>« Liste des burgers »</em><br>
• 🍽️ <strong>Analyse d'une fiche :</strong> <em>« Margherita »</em>, <em>« Salade César »</em>, <em>« Coût du burger classic »</em><br>
• ⚖️ <strong>Comparatif de 2 plats :</strong> <em>« Compare Margherita et 4 Saisons »</em><br>
• 💰 <strong>Prix & Marges :</strong> <em>« Plat le plus cher »</em>, <em>« Plats à moins de 50 DH »</em>, <em>« Top 5 rentables »</em><br>
• 🚨 <strong>Alertes & Surdosage :</strong> <em>« Food Cost critique > 35% »</em>, <em>« Quels plats sont surdosés ? »</em><br>
• 🎛️ <strong>Simulation What-If :</strong> <em>« Si je réduis la mozzarella de 15g ? »</em>, <em>« Si la viande augmente de 10% »</em><br>
• 🗣️ <strong>Service :</strong> <em>« Briefing serveurs de ce soir »</em>, <em>« Plan -2% Food Cost »</em>`;
    }

    // ========================================================
    // 2. DÉFINITIONS & PÉDAGOGIE MÉTIER F&B
    // ========================================================
    else if ((normQ.includes('c est quoi') || normQ.includes('qu est ce que') || normQ.includes('definition') || normQ.includes('comment calculer') || normQ.includes('formule')) && (normQ.includes('food cost') || normQ.includes('marge') || normQ.includes('kasavana') || normQ.includes('quick win') || normQ.includes('standard'))) {
      if (normQ.includes('food cost')) {
        responseText = `📚 <strong>Qu'est-ce que le Food Cost (Ratio Matière) ?</strong><br><br>
Le <strong>Food Cost</strong> mesure le pourcentage du chiffre d'affaires absorbé par le coût d'achat des ingrédients :<br>
<div style="background:var(--bg); border:1px solid var(--border); padding:8px 12px; border-radius:6px; margin:6px 0; font-family:monospace; font-size:12px;">
  Food Cost (%) = (Coût de Revient Matière / Prix de Vente HT) &times; 100
</div>
• <strong>Benchmark Restauration au Maroc :</strong> La zone d'excellence se situe entre <strong>28% et 32%</strong>.<br>
• <strong>Zone Verte (&lt; 28%) :</strong> Excellente marge (ex: Pizzas, Pâtes, Boissons).<br>
• <strong>Zone Critique (&gt; 35%) :</strong> Danger d'érosion de rentabilité (surdosage de protéines ou sous-tarification).`;
      } else if (normQ.includes('marge')) {
        responseText = `💵 <strong>Comment se calcule la Marge Brute en Restauration ?</strong><br><br>
• <strong>Marge Brute en Dirhams (Cash direct) :</strong><br>
<div style="background:var(--bg); border:1px solid var(--border); padding:6px 10px; border-radius:6px; margin:4px 0; font-family:monospace; font-size:12px;">
  Marge Brute (DH) = Prix de Vente - Coût Matière de l'Assiette
</div>
• <strong>Taux de Marge Brute (%) :</strong><br>
<div style="background:var(--bg); border:1px solid var(--border); padding:6px 10px; border-radius:6px; margin:4px 0; font-family:monospace; font-size:12px;">
  Taux de Marge (%) = (Marge Brute DH / Prix de Vente) &times; 100
</div>
💡 <em>Règle d'or F&B : On paie les factures avec les Dirhams de marge en caisse, pas avec des pourcentages !</em>`;
      } else if (normQ.includes('kasavana')) {
        responseText = `🎯 <strong>La Matrice de Menu Engineering (Kasavana &amp; Smith) :</strong><br><br>
Elle classe chaque plat en croisant sa <strong>popularité (volume vendu)</strong> et sa <strong>rentabilité (marge cash en DH)</strong> :<br><br>
• 🌟 <strong>Stars (Étoiles) :</strong> Forte marge + Fortes ventes (Vos trésors à maintenir).<br>
• 🐴 <strong>Plowhorses (Chevaux de trait) :</strong> Forte popularité + Faible marge (Hausse de prix douce de +2 à +3 DH recommandée).<br>
• 🧩 <strong>Puzzles (Dilemmes) :</strong> Forte marge + Faibles ventes (À pousser activement au briefing serveur).<br>
• 🐕 <strong>Dogs (Chiens / Poids morts) :</strong> Faible marge + Faibles ventes (À reformuler ou supprimer de la carte).`;
      } else {
        responseText = `⚡ <strong>Qu'est-ce qu'un Quick Win F&B ?</strong><br><br>
Un <strong>Quick Win</strong> est une correction immédiate de surdosage en cuisine qui génère un gain supérieur ou égal à <strong>+3.00 DH par assiette</strong> en alignant les grammages sur les normes internationales, sans impacter la satisfaction client.`;
      }
    }

    // ========================================================
    // 3. COMPARAISON CÔTE-À-CÔTE DE DEUX PLATS
    // ========================================================
    else if ((normQ.includes('compare') || normQ.includes('comparer') || normQ.includes(' vs ') || normQ.includes('difference entre')) && (normQ.includes(' et ') || normQ.includes(' vs ') || normQ.includes(' avec '))) {
      const cleanCompare = normQ.replace(/compare|comparer|comparatif|difference entre/g, '').trim();
      const parts = cleanCompare.split(/\s+et\s+|\s+vs\s+|\s+avec\s+/);
      if (parts.length >= 2) {
        const d1 = fuzzyFindRecipe(parts[0], recipes);
        const d2 = fuzzyFindRecipe(parts[1], recipes);
        if (d1 && d2 && d1.name !== d2.name) {
          const cashDiff = d1.greyCorner.grossMarginDH - d2.greyCorner.grossMarginDH;
          const bestCash = cashDiff >= 0 ? d1 : d2;
          const bestFC = d1.greyCorner.foodCost <= d2.greyCorner.foodCost ? d1 : d2;

          responseText = `⚖️ <strong>Comparatif Face-à-Face : « ${d1.name} » vs « ${d2.name} »</strong><br><br>
<div class="ai-sim-table-wrap">
  <table class="ai-sim-table" style="font-size:11.5px;">
    <thead>
      <tr>
        <th>Indicateur</th>
        <th>${d1.name}</th>
        <th>${d2.name}</th>
        <th>Écart</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Prix Vente</strong></td>
        <td>${d1.sellPrice} DH</td>
        <td>${d2.sellPrice} DH</td>
        <td><strong>${(d1.sellPrice - d2.sellPrice > 0 ? '+' : '')}${(d1.sellPrice - d2.sellPrice).toFixed(2)} DH</strong></td>
      </tr>
      <tr>
        <td><strong>Coût Matière</strong></td>
        <td>${d1.greyCorner.cost.toFixed(2)} DH</td>
        <td>${d2.greyCorner.cost.toFixed(2)} DH</td>
        <td><strong>${(d1.greyCorner.cost - d2.greyCorner.cost > 0 ? '+' : '')}${(d1.greyCorner.cost - d2.greyCorner.cost).toFixed(2)} DH</strong></td>
      </tr>
      <tr>
        <td><strong>Food Cost</strong></td>
        <td style="color:${d1.greyCorner.foodCost > 35 ? '#dc2626' : '#16a34a'}; font-weight:800;">${d1.greyCorner.foodCost.toFixed(1)}%</td>
        <td style="color:${d2.greyCorner.foodCost > 35 ? '#dc2626' : '#16a34a'}; font-weight:800;">${d2.greyCorner.foodCost.toFixed(1)}%</td>
        <td>${Math.abs(d1.greyCorner.foodCost - d2.greyCorner.foodCost).toFixed(1)} pts (${bestFC.name} meilleur)</td>
      </tr>
      <tr>
        <td><strong>Marge Brute</strong></td>
        <td style="color:#0284c7; font-weight:900;">+${d1.greyCorner.grossMarginDH.toFixed(2)} DH</td>
        <td style="color:#0284c7; font-weight:900;">+${d2.greyCorner.grossMarginDH.toFixed(2)} DH</td>
        <td><strong style="color:#16a34a;">+${Math.abs(cashDiff).toFixed(2)} DH (${bestCash.name})</strong></td>
      </tr>
    </tbody>
  </table>
</div>
<div style="margin-top:10px; font-size:12px; background:rgba(2, 132, 199, 0.08); border-left:3px solid #0284c7; padding:8px 12px; border-radius:6px;">
  💡 <strong>Verdict Copilote :</strong> <strong>« ${bestCash.name} »</strong> dépose <strong>+${Math.abs(cashDiff).toFixed(2)} DH de marge nette supplémentaire</strong> en caisse par assiette servie. Poussez-le en priorité lors du service !
</div>`;
        }
      }
    }

    // ========================================================
    // 4. MERCURIALE & COÛT UNITAIRE D'UN INGRÉDIENT (AU KILO / LITRE)
    // ========================================================
    if (!responseText && (normQ.includes('combien coute le kilo') || normQ.includes('prix au kilo') || normQ.includes('cout au kilo') || normQ.includes('prix du kilo') || normQ.includes('prix du kg') || (normQ.includes('prix') && (normQ.includes('kilo') || normQ.includes('kg') || normQ.includes('litre') || normQ.includes('mercuriale'))))) {
      let targetIng = null;
      for (const item of NLP_ING_DICT) {
        if (item.aliases.some(a => normQ.includes(a))) {
          targetIng = item;
          break;
        }
      }
      if (targetIng) {
        const matchingDishes = findDishesByIngredient(targetIng.aliases[0], recipes);
        const firstMatch = matchingDishes[0];
        let unitCostDH = 0;
        let unitLabel = 'kg';
        if (firstMatch && firstMatch.recipe.greyCorner.breakdown) {
          const line = firstMatch.recipe.greyCorner.breakdown.find(b => normalizeNLP(b.ingredient).includes(normalizeNLP(targetIng.aliases[0])));
          if (line) {
            unitCostDH = line.unit === 'g' ? (line.unitPrice * 1000) : (line.unit === 'ml' ? (line.unitPrice * 1000) : line.unitPrice);
            unitLabel = line.unit === 'g' ? 'kg' : (line.unit === 'ml' ? 'litre' : line.unit);
          }
        }
        responseText = `🏷️ <strong>Mercuriale Ingrédient : « ${targetIng.label} »</strong><br><br>
• <strong>Prix d'Achat Standard :</strong> <strong>${unitCostDH > 0 ? unitCostDH.toFixed(2) + ' DH / ' + unitLabel : 'Donnée mercuriale active'}</strong>.<br>
• <strong>Présence dans la carte :</strong> Utilisé dans <strong>${matchingDishes.length} fiches techniques</strong>.<br>
• <strong>Levier de Négociation :</strong> Une baisse négociée de 10% sur cette matière première économise immédiatement de la marge sur ${matchingDishes.length} plats.<br><br>
<button class="btn btn-primary" style="font-size:11.5px; padding:5px 12px;" onclick="window.simSelectedIngredient='${encodeURIComponent(targetIng.label)}'; window.setAITab('simulator');">
  🎛️ Simuler l'impact prix dans What-If
</button>`;
      }
    }

    // ========================================================
    // 5. TOP RENTABLES / CASH MARGIN / STARS
    // ========================================================
    if (!responseText && (normQ.includes('rentab') || normQ.includes('marge cash') || normQ.includes('plus rentable') || normQ.includes('plus rentables') || normQ.includes('meilleure marge') || normQ.includes('meilleures marges') || normQ.includes('top 5') || normQ.includes('meilleur plat') || normQ.includes('meilleurs plats'))) {
      const sortedByMargin = [...recipes].sort((a, b) => b.greyCorner.grossMarginDH - a.greyCorner.grossMarginDH).slice(0, 5);
      responseText = `🏆 <strong>Top 5 des Plats les plus Rentables (Marge Cash Nette en DH) :</strong><br>
Ces plats déposent le plus de liquidités directes en caisse par assiette servie :<br><br>
<div class="ai-chat-cards-list">
  ${sortedByMargin.map((r, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Prix : ${r.sellPrice} DH | Coût portion : ${r.greyCorner.cost.toFixed(2)} DH (FC ${r.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900; font-size:13.5px;">+${r.greyCorner.grossMarginDH.toFixed(2)} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>
💡 <strong>Conseil F&B :</strong> Ce sont vos piliers de marge. Encouragez vos serveurs à les recommander en priorité en salle.`;
    }

    // ========================================================
    // 6. PIRE FOOD COST / ALERTES / CRITIQUES
    // ========================================================
    if (!responseText && (normQ.includes('pire') || normQ.includes('critique') || normQ.includes('danger') || normQ.includes('alerte') || normQ.includes('corriger') || normQ.includes('eleve') || normQ.includes('mauvais food cost'))) {
      const critical = [...recipes].filter(r => r.sellPrice > 0).sort((a, b) => b.greyCorner.foodCost - a.greyCorner.foodCost).slice(0, 5);
      responseText = `🚨 <strong>Top 5 des Plats à Food Cost Critique (Urgence F&B) :</strong><br>
Ces plats consomment une proportion anormale de matière première :<br><br>
<div class="ai-chat-cards-list">
  ${critical.map((r, idx) => `
    <div class="ai-chat-mini-card" style="border-left: 3px solid #dc2626;">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Prix actuel : ${r.sellPrice} DH | Coût : ${r.greyCorner.cost.toFixed(2)} DH</small>
      </div>
      <div style="text-align:right;">
        <span class="text-danger" style="font-weight:900; font-size:13px;">FC ${r.greyCorner.foodCost.toFixed(1)}%</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Corriger</button>
      </div>
    </div>
  `).join('')}
</div>
🛠️ <strong>Plan d'action immédiat :</strong> Deux leviers : soit réaligner sur le grammage standard métier, soit appliquer un ajustement doux du tarif (+3 à +5 DH).`;
    }

    // ========================================================
    // 7. SURDOSAGE & ÉCARTS STANDARDS MÉTIER
    // ========================================================
    if (!responseText && (normQ.includes('surdose') || normQ.includes('surdosage') || normQ.includes('ecart standard') || normQ.includes('gaspillage') || normQ.includes('perte en cuisine') || normQ.includes('perte de marge'))) {
      const overDosed = [...recipes].filter(r => r.standard && r.standard.diffDH > 1.00).sort((a, b) => b.standard.diffDH - a.standard.diffDH).slice(0, 6);
      responseText = `⚖️ <strong>Top Plats avec Surdosage en Cuisine (Pertes évitables par assiette) :</strong><br>
Ces plats s'écartent des ratios de pesées standards internationaux :<br><br>
<div class="ai-chat-cards-list">
  ${overDosed.map((r, idx) => `
    <div class="ai-chat-mini-card" style="border-left: 3px solid #ef4444;">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Coût Grey Corner : ${r.greyCorner.cost.toFixed(2)} DH | Standard : ${r.standard.cost.toFixed(2)} DH</small>
      </div>
      <div style="text-align:right;">
        <span class="text-danger" style="font-weight:900;">+${r.standard.diffDH.toFixed(2)} DH/assiette</span><br>
        <button class="ai-btn-action btn-apply-std" style="font-size:10px; padding:2px 6px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'apply_standard')">🟢 Standard</button>
      </div>
    </div>
  `).join('')}
</div>
💡 <em>Conseil Cuisine : Contrôlez les pesées à la balance sur ces 6 fiches pour récupérer immédiatement cette marge en caisse.</em>`;
    }

    // ========================================================
    // 8. INGRÉDIENTS LES PLUS CHERS / BUDGET GLOBAL
    // ========================================================
    if (!responseText && (
      normQ.includes('matiere') ||
      normQ.includes('poids matiere') ||
      normQ.includes('depense matiere') ||
      (normQ.includes('ingredient') && (normQ.includes('couteu') || normQ.includes('cher') || normQ.includes('prix') || normQ.includes('cout'))) ||
      normQ.includes('ingredients les plus') ||
      normQ.includes('matieres premieres')
    )) {
      const ingUsage = {};
      recipes.forEach(r => {
        (r.greyCorner.breakdown || []).forEach(b => {
          const ingKey = cleanFn(b.ingredient);
          if (!ingUsage[ingKey]) ingUsage[ingKey] = { name: b.ingredient, totalCostInMenu: 0, count: 0 };
          ingUsage[ingKey].totalCostInMenu += (b.cost || 0);
          ingUsage[ingKey].count += 1;
        });
      });
      const topIngredients = Object.values(ingUsage).sort((a, b) => b.totalCostInMenu - a.totalCostInMenu).slice(0, 5);
      responseText = `🥩 <strong>Top 5 des Matières Premières &amp; Ingrédients les plus Coûteux :</strong><br>
Ces ingrédients représentent le plus gros volume financier immobilisé dans vos recettes :<br><br>
<div class="ai-chat-cards-list">
  ${topIngredients.map((ing, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${ing.name}</strong><br>
        <small style="color:var(--text-muted);">Présent dans <strong>${ing.count} fiches techniques</strong></small>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:800; color:#0284c7;">${ing.totalCostInMenu.toFixed(2)} DH cumulés</span>
      </div>
    </div>
  `).join('')}
</div>
💡 <strong>Conseil Négociation :</strong> 10% de remise négociée avec vos fournisseurs sur ces 5 produits génère une baisse directe de ~1.8 point sur votre Food Cost global !`;
    }

    // ========================================================
    // 9. BRIEFING SERVEURS / SALLE CE SOIR
    // ========================================================
    if (!responseText && (normQ.includes('serveur') || normQ.includes('salle') || normQ.includes('brief') || normQ.includes('ce soir') || normQ.includes('pousser') || normQ.includes('sugg'))) {
      const puzzles = menuEng.puzzles.slice(0, 3);
      const suggestions = puzzles.length >= 3 ? puzzles : [...menuEng.puzzles, ...menuEng.stars].slice(0, 3);
      responseText = `🗣️ <strong>Briefing d'Avant-Service pour l'Équipe en Salle (Ce Soir) :</strong><br>
Chaque assiette vendue sur ces 3 spécialités dépose un maximum de cash en caisse :<br><br>
<div class="ai-chat-cards-list">
  ${suggestions.map((p, idx) => `
    <div class="ai-chat-mini-card" style="border-left: 3px solid #8b5cf6;">
      <div>
        <strong>Plat #${idx + 1} : ${p.recipeName}</strong> (${p.category})<br>
        <span style="font-size:11.5px; color:var(--text);">Arg : « Spécialité gourmande de la maison, préparée minute par le chef. »</span>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900;">+${p.cashMargin.toFixed(2)} DH</span> cash/v<br>
        <small style="color:var(--text-muted);">${p.sellPrice} DH</small>
      </div>
    </div>
  `).join('')}
</div>
🎯 <strong>Objectif Service :</strong> Si chaque serveur vend 4 de ces plats ce soir, vous encaissez <strong>+600 DH à +800 DH de marge nette supplémentaire</strong> sur un seul service !`;
    }

    // ========================================================
    // 10. STRATÉGIE -2% FOOD COST
    // ========================================================
    if (!responseText && (normQ.includes('-2%') || normQ.includes('reduire') || normQ.includes('baisser') || normQ.includes('strateg') || normQ.includes('plan'))) {
      const quickWinsCount = (analysis.quickWins || []).length;
      const totalSavings = Math.round((analysis.stats || {}).totalMonthlySavings || 12500);
      responseText = `📉 <strong>Plan Stratégique en 4 Étapes pour Gagner -2 Points de Food Cost :</strong><br><br>
1️⃣ <strong>Standardiser les 5 protéines pivots</strong> : Calibrer strictement le poulet (140g), le steak haché (110-120g) et la mozzarella râpée (90-100g).<br>
2️⃣ <strong>Appliquer les ${quickWinsCount} Quick Wins identifiés</strong> : Gisement direct de <strong>+${totalSavings.toLocaleString('fr-FR')} DH / mois</strong> sans altérer la carte.<br>
3️⃣ <strong>Hausse douce de +2 à +3 DH sur les Chevaux de Trait</strong> : Vos plats à fort volume absorbent cette hausse sans perte de fréquentation.<br>
4️⃣ <strong>Péréquation par les Boissons & Cocktails</strong> : Les boissons affichent un Food Cost moyen de 15-20% et compensent naturellement les plats nobles.<br><br>
<button class="btn btn-primary" style="font-size:12px; padding:6px 14px; font-weight:800;" onclick="window.applyAllQuickWinsBatch()">⚡ Appliquer Tous les Quick Wins Automatiquement</button>`;
    }

    // ========================================================
    // 11. SIMULATION DE DOSAGE / PORTION WHAT-IF (LANGAGE NATUREL)
    // ========================================================
    if (!responseText && (normQ.includes('gramme') || normQ.includes('dosage') || (normQ.includes('si je') && (normQ.includes('reduis') || normQ.includes('baisse') || normQ.includes('diminue') || normQ.includes('augmente'))))) {
      let targetIng = 'Mozzarella';
      if (normQ.includes('viande') || normQ.includes('boeuf') || normQ.includes('steak') || normQ.includes('kefta')) targetIng = 'Viande';
      else if (normQ.includes('poulet')) targetIng = 'Poulet';
      else if (normQ.includes('saumon')) targetIng = 'Saumon';
      else if (normQ.includes('fromage') || normQ.includes('gouda')) targetIng = 'Fromage';
      else if (normQ.includes('creme')) targetIng = 'Crème';
      else if (normQ.includes('cafe')) targetIng = 'Café';

      let numDelta = 0;
      const numMatch = normQ.match(/(\d+)\s*(?:g|grammes?|%)?/);
      if (numMatch) numDelta = parseInt(numMatch[1], 10);
      if (normQ.includes('redui') || normQ.includes('baisse') || normQ.includes('diminue') || normQ.includes('moin')) {
        numDelta = -Math.abs(numDelta || 15);
      } else {
        numDelta = Math.abs(numDelta || 20);
      }

      const simRes = window.runMacroInflationSimulation(targetIng, 0, numDelta, 'grams');
      const isSaving = simRes.totalMonthlySurcost < 0;
      responseText = `⚖️ <strong>Simulation "What-If" Dosage : ${numDelta > 0 ? '+' : ''}${numDelta}g de ${simRes.ingredient} par portion :</strong><br><br>
• <strong>Fiches concernées :</strong> <strong>${simRes.count} recettes</strong> utilisent cette matière première.<br>
• <strong>Impact moyen par assiette :</strong> <strong style="color:${isSaving ? '#10b981' : '#ef4444'};">${(simRes.affectedDishes[0] || {}).costDiff > 0 ? '+' : ''}${(simRes.affectedDishes[0] || {}).costDiff || 0} DH / portion</strong>.<br>
• <strong>Impact Trésorerie Mensuelle :</strong> <strong style="font-size:14px; color:${isSaving ? '#10b981' : '#ef4444'};">${isSaving ? '+' + Math.abs(simRes.totalMonthlySurcost).toLocaleString('fr-FR') + ' DH (Économie nette)' : '-' + simRes.totalMonthlySurcost.toLocaleString('fr-FR') + ' DH (Surcoût)'}</strong>.<br><br>
<div style="display:flex; gap:8px; flex-wrap:wrap;">
  <button class="btn btn-primary" style="font-size:11.5px; padding:5px 12px;" onclick="window.simSelectedIngredient='${simRes.ingredient}'; window.simGrammageDelta=${numDelta}; window.setAITab('simulator');">
    🎛️ Voir le détail dans le Simulateur What-If
  </button>
  ${isSaving && simRes.count > 0 ? `
    <button class="ai-btn-action" style="background:#10b981; color:#fff; font-size:11.5px; padding:5px 12px;" onclick="window.simSelectedIngredient='${simRes.ingredient}'; window.simGrammageDelta=${numDelta}; window.applyBatchSimulatedGrammage();">
      ⚡ Appliquer ce réglage (${numDelta}g) sur les ${simRes.count} fiches
    </button>
  ` : ''}
</div>`;
    }

    // ========================================================
    // 12. RECHERCHE PAR INGRÉDIENT / COMPOSITION (ex: "Quel plat qui contient viande hachée")
    // ========================================================
    if (!responseText) {
      let isIngQuery = normQ.includes('contient') || normQ.includes('contiennent') || normQ.includes('compose') || normQ.includes('a base de') || normQ.includes('recette avec') || normQ.includes('recettes avec') || normQ.includes('plat avec') || normQ.includes('plats avec') || normQ.includes('qui a du') || normQ.includes('qui a de la') || normQ.includes('qui utilise') || normQ.includes('ou y a t il') || normQ.includes('ingredient');

      let targetIngTerm = '';
      let targetIngLabel = '';

      // Chercher d'abord dans le dictionnaire
      for (const item of NLP_ING_DICT) {
        if (item.aliases.some(a => normQ.includes(a))) {
          targetIngTerm = item.aliases[0];
          targetIngLabel = item.label;
          isIngQuery = true;
          break;
        }
      }

      // Si motif "contient X" ou "avec X" sans match dictionnaire direct
      if (isIngQuery && !targetIngTerm) {
        const regexPat = /(?:contient|contiennent|compose\s+de|a\s+base\s+de|avec\s+du|avec\s+de\s+la|avec\s+des|avec|utilise)\s+(.+)/;
        const m = normQ.match(regexPat);
        if (m && m[1]) {
          targetIngTerm = m[1].replace(/dans\s+la\s+carte|dans\s+le\s+menu|chez\s+nous|svp|s\s+il\s+vous\s+plait/g, '').trim();
          targetIngLabel = targetIngTerm.toUpperCase();
        }
      }

      if (isIngQuery && targetIngTerm) {
        const matchedDishes = findDishesByIngredient(targetIngTerm, recipes);
        if (matchedDishes.length > 0) {
          const totalCost = matchedDishes.reduce((sum, m) => sum + m.costDH, 0);
          const avgCost = totalCost / matchedDishes.length;

          responseText = `🥩 <strong>${matchedDishes.length} Fiches Techniques contenant « ${targetIngLabel} » :</strong><br>
<span style="font-size:12px; color:var(--text-muted);">Coût moyen de cet ingrédient par assiette : <strong>${avgCost.toFixed(2)} DH</strong></span><br><br>
<div class="ai-chat-cards-list">
  ${matchedDishes.slice(0, 8).map((m, idx) => `
    <div class="ai-chat-mini-card" style="border-left: 3px solid #0284c7;">
      <div>
        <strong>#${idx + 1} ${m.recipe.name}</strong> (${m.recipe.category})<br>
        <span style="font-size:11.5px; color:var(--text);">
          Dosage : <strong style="color:#0284c7;">${m.portion}</strong>
          ${m.costDH > 0 ? ` &bull; Coût ingrédient : <strong>${m.costDH.toFixed(2)} DH</strong>` : ''}
        </span><br>
        <small style="color:var(--text-muted);">Prix : ${m.recipe.sellPrice} DH | Coût total : ${m.recipe.greyCorner.cost.toFixed(2)} DH (FC ${m.recipe.greyCorner.foodCost.toFixed(1)}%) &bull; Marge : +${m.recipe.greyCorner.grossMarginDH.toFixed(2)} DH</small>
      </div>
      <div style="text-align:right; display:flex; flex-direction:column; gap:4px; align-items:flex-end;">
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px;" onclick="window.applyAIOptimization('${encodeURIComponent(m.recipe.name)}', 'inspect')">🔍 Examiner</button>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; background:#0284c7; color:#fff;" onclick="window.simSelectedIngredient='${encodeURIComponent(targetIngLabel)}'; window.setAITab('simulator');">🎛️ What-If</button>
      </div>
    </div>
  `).join('')}
</div>
${matchedDishes.length > 8 ? `<div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">... et <strong>${matchedDishes.length - 8} autres fiches techniques</strong> actives dans le catalogue.</div>` : ''}
<div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
  <button class="btn btn-primary" style="font-size:11.5px; padding:5px 12px;" onclick="window.simSelectedIngredient='${encodeURIComponent(targetIngLabel)}'; window.setAITab('simulator');">
    🎛️ Simuler l'impact prix/dosage sur « ${targetIngLabel} »
  </button>
</div>`;
        } else {
          responseText = `🔍 Aucune fiche technique active ne semble utiliser l'ingrédient « <strong>${targetIngLabel}</strong> » dans ses pesées actuelles.<br><br>
<em>💡 Essayez avec des matières clés : « viande hachée », « poulet », « mozzarella », « saumon », « crème », « crevettes »...</em>`;
        }
      }
    }

    // ========================================================
    // 13. EXPLORATION PAR CATÉGORIE (ex: "Combien de pizzas ?", "Liste des burgers")
    // ========================================================
    if (!responseText) {
      const isCatQuery = normQ.includes('combien de') || normQ.includes('liste des') || normQ.includes('liste de') || normQ.includes('donne moi les') || normQ.includes('montre moi les') || normQ.includes('toutes les') || normQ.includes('tous les') || normQ.includes('quelles sont les') || normQ.includes('quels sont les') || normQ.includes('carte des') || normQ.includes('carte de') || normQ.includes('nos pizzas') || normQ.includes('nos burgers') || normQ.includes('nos salades') || normQ.includes('nos pates');

      const catKeywords = {
        'pizza': 'PIZZA', 'pizzas': 'PIZZA',
        'burger': 'BURGER', 'burgers': 'BURGER',
        'pasta': 'PASTA', 'pates': 'PASTA', 'spaghetti': 'PASTA', 'tagliatelle': 'PASTA', 'penne': 'PASTA',
        'salade': 'SALADES', 'salades': 'SALADES',
        'sandwich': 'SANDWICH', 'sandwichs': 'SANDWICH',
        'panini': 'PANINI', 'paninis': 'PANINI',
        'wrap': 'WRAP', 'wraps': 'WRAP',
        'dessert': 'DESSERTS', 'desserts': 'DESSERTS',
        'boisson': 'BOISSONS', 'boissons': 'BOISSONS',
        'jus': 'JUS',
        'cafe': 'CAFES', 'cafes': 'CAFES',
        'petit dej': 'PETIT DEJEUNER', 'petit dejeuner': 'PETIT DEJEUNER',
        'plats chauds': 'PLATS', 'plats principaux': 'PLATS', 'plat principal': 'PLATS'
      };

      for (const [kw, catTarget] of Object.entries(catKeywords)) {
        if (normQ.includes(kw) && (isCatQuery || normQ === kw || normQ === 'les ' + kw || normQ === 'des ' + kw)) {
          const catDishes = recipes.filter(r => normalizeNLP(r.category) === normalizeNLP(catTarget) || normalizeNLP(r.category).includes(normalizeNLP(catTarget)));
          if (catDishes.length > 0) {
            const avgPrice = catDishes.reduce((sum, r) => sum + r.sellPrice, 0) / catDishes.length;
            const avgFC = catDishes.reduce((sum, r) => sum + r.greyCorner.foodCost, 0) / catDishes.length;
            const avgMargin = catDishes.reduce((sum, r) => sum + r.greyCorner.grossMarginDH, 0) / catDishes.length;

            responseText = `🍽️ <strong>Famille Culinaire : « ${catTarget} » (${catDishes.length} fiches techniques actives) :</strong><br><br>
• <strong>Prix de vente moyen :</strong> <strong>${avgPrice.toFixed(2)} DH</strong><br>
• <strong>Food Cost moyen :</strong> <strong style="color:${avgFC > 32 ? '#d97706' : '#16a34a'};">${avgFC.toFixed(1)}%</strong><br>
• <strong>Marge brute moyenne :</strong> <strong style="color:#0284c7;">+${avgMargin.toFixed(2)} DH / assiette</strong><br><br>
<div class="ai-chat-cards-list">
  ${catDishes.slice(0, 6).map((r, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${r.name}</strong><br>
        <small style="color:var(--text-muted);">Prix : ${r.sellPrice} DH | Coût : ${r.greyCorner.cost.toFixed(2)} DH | FC : ${r.greyCorner.foodCost.toFixed(1)}%</small>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900;">+${r.greyCorner.grossMarginDH.toFixed(2)} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>
${catDishes.length > 6 ? `<div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">... et ${catDishes.length - 6} autres plats de cette famille.</div>` : ''}`;
            break;
          }
        }
      }
    }

    // ========================================================
    // 14. FILTRAGE PAR SEUILS DE PRIX & CLASSEMENTS
    // ========================================================
    if (!responseText) {
      if (normQ.includes('le plus cher') || normQ.includes('les plus chers') || normQ.includes('prix maximum') || normQ.includes('record de prix')) {
        const sortedDesc = [...recipes].sort((a, b) => b.sellPrice - a.sellPrice).slice(0, 5);
        responseText = `💎 <strong>Top 5 des Plats les plus Chers de la Carte :</strong><br><br>
<div class="ai-chat-cards-list">
  ${sortedDesc.map((r, idx) => `
    <div class="ai-chat-mini-card" style="border-left:3px solid #d97706;">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Coût : ${r.greyCorner.cost.toFixed(2)} DH (FC ${r.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:900; font-size:13.5px; color:#d97706;">${r.sellPrice} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>`;
      } else if (normQ.includes('le moins cher') || normQ.includes('les moins chers') || normQ.includes('prix minimum') || normQ.includes('plus accessible') || normQ.includes('plus economique')) {
        const sortedAsc = [...recipes].filter(r => r.sellPrice > 0).sort((a, b) => a.sellPrice - b.sellPrice).slice(0, 5);
        responseText = `🏷️ <strong>Top 5 des Plats les plus Accessibles (Entrée de Gamme) :</strong><br><br>
<div class="ai-chat-cards-list">
  ${sortedAsc.map((r, idx) => `
    <div class="ai-chat-mini-card" style="border-left:3px solid #16a34a;">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Coût : ${r.greyCorner.cost.toFixed(2)} DH (FC ${r.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:900; font-size:13.5px; color:#16a34a;">${r.sellPrice} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>`;
      } else {
        const underMatch = normQ.match(/(?:moins\s+de|inferieur\s+a|<)\s*(\d+)/);
        const overMatch = normQ.match(/(?:plus\s+de|superieur\s+a|>)\s*(\d+)/);
        if (underMatch) {
          const limit = parseInt(underMatch[1], 10);
          const underDishes = recipes.filter(r => r.sellPrice > 0 && r.sellPrice <= limit).sort((a, b) => b.greyCorner.grossMarginDH - a.greyCorner.grossMarginDH);
          responseText = `💰 <strong>${underDishes.length} Plats à moins de ${limit} DH (Triés par rentabilité cash) :</strong><br><br>
<div class="ai-chat-cards-list">
  ${underDishes.slice(0, 6).map((r, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Prix : ${r.sellPrice} DH | Coût : ${r.greyCorner.cost.toFixed(2)} DH</small>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900;">+${r.greyCorner.grossMarginDH.toFixed(2)} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>`;
        } else if (overMatch) {
          const limit = parseInt(overMatch[1], 10);
          const overDishes = recipes.filter(r => r.sellPrice >= limit).sort((a, b) => b.sellPrice - a.sellPrice);
          responseText = `💎 <strong>${overDishes.length} Plats à ${limit} DH et plus :</strong><br><br>
<div class="ai-chat-cards-list">
  ${overDishes.slice(0, 6).map((r, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${r.name}</strong> (${r.category})<br>
        <small style="color:var(--text-muted);">Coût : ${r.greyCorner.cost.toFixed(2)} DH (FC ${r.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:900; color:#d97706;">${r.sellPrice} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(r.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>`;
        }
      }
    }

    // ========================================================
    // 15. QUESTION CIBLÉE SUR UN PLAT SPÉCIFIQUE (FUZZY MATCH & COMPOSITION DÉTAILLÉE)
    // ========================================================
    if (!responseText) {
      let matchedDish = fuzzyFindRecipe(rawQ, recipes);
      if (matchedDish) {
        const diff = matchedDish.standard ? matchedDish.standard.diffDH : 0;
        const bdList = matchedDish.greyCorner.breakdown || [];
        responseText = `🍽️ <strong>Analyse Détaillée : « ${matchedDish.name} »</strong> (${matchedDish.category}) :<br><br>
• <strong>Prix de vente :</strong> <strong>${matchedDish.sellPrice} DH</strong><br>
• <strong>Coût de revient matière :</strong> <strong>${matchedDish.greyCorner.cost.toFixed(2)} DH</strong> (Food Cost : <strong style="color:${matchedDish.greyCorner.foodCost > 35 ? '#dc2626' : '#16a34a'};">${matchedDish.greyCorner.foodCost.toFixed(1)}%</strong>)<br>
• <strong>Marge Brute Cash :</strong> <strong style="color:#0284c7;">+${matchedDish.greyCorner.grossMarginDH.toFixed(2)} DH</strong> (${matchedDish.greyCorner.margin.toFixed(1)}%)<br>
• <strong>Standard International :</strong> Coût ${matchedDish.standard ? matchedDish.standard.cost.toFixed(2) : 'N/A'} DH (Food Cost : ${matchedDish.standard ? matchedDish.standard.foodCost.toFixed(1) : 'N/A'}%)<br>
${diff > 0.5 ? `⚠️ <strong>Écart de surdosage :</strong> +${diff.toFixed(2)} DH par portion par rapport à la référence métier.` : `✅ <strong>Portion conforme :</strong> Grammages alignés sur les standards de rentabilité.`}<br><br>

${bdList.length > 0 ? `
<div style="margin-bottom:12px;">
  <strong style="font-size:12px;">📋 Composition &amp; Grammages exacts de la Fiche Technique :</strong>
  <div class="ai-sim-table-wrap" style="max-height:180px; margin-top:6px;">
    <table class="ai-sim-table" style="font-size:11px;">
      <thead>
        <tr>
          <th>Ingrédient</th>
          <th>Dosage</th>
          <th>Coût / Port.</th>
        </tr>
      </thead>
      <tbody>
        ${bdList.map(b => `
          <tr>
            <td><strong>${b.ingredient}</strong></td>
            <td>${b.quantity || (b.qtyNumber + ' ' + (b.unit || 'g'))}</td>
            <td><strong style="color:#0284c7;">${(b.cost || 0).toFixed(2)} DH</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</div>
` : ''}

<div style="display:flex; gap:8px; flex-wrap:wrap;">
  ${diff > 0.5 ? `<button class="ai-btn-action btn-apply-std" onclick="window.applyAIOptimization('${encodeURIComponent(matchedDish.name)}', 'apply_standard')">🟢 Aligner Standard</button>` : ''}
  <button class="ai-btn-action btn-inspect" onclick="window.applyAIOptimization('${encodeURIComponent(matchedDish.name)}', 'inspect')">🔍 Examiner dans le Comparateur</button>
</div>`;
      }
    }

    // ========================================================
    // 16. FALLBACK INTELLIGENT : RECHERCHE PLEIN TEXTE TOLÉRANTE
    // ========================================================
    if (!responseText) {
      const qTokens = normQ.split(' ').filter(w => w.length >= 3 && !NLP_STOP_WORDS.has(w));
      const fallbackMatches = [];

      if (qTokens.length > 0) {
        recipes.forEach(r => {
          const rName = normalizeNLP(r.name);
          const rCat = normalizeNLP(r.category);
          const rIngs = (r.greyCorner.tech || []).map(t => normalizeNLP(t)).join(' ');
          const allContent = `${rName} ${rCat} ${rIngs}`;

          let score = 0;
          qTokens.forEach(t => {
            if (allContent.includes(t)) score += t.length;
          });
          if (score > 0) {
            fallbackMatches.push({ recipe: r, score });
          }
        });
      }

      fallbackMatches.sort((a, b) => b.score - a.score);

      if (fallbackMatches.length > 0) {
        const topMatches = fallbackMatches.slice(0, 6);
        responseText = `🔍 <strong>Résultats pertinents pour votre recherche « ${rawQ} » (${fallbackMatches.length} fiches trouvées) :</strong><br><br>
<div class="ai-chat-cards-list">
  ${topMatches.map((m, idx) => `
    <div class="ai-chat-mini-card">
      <div>
        <strong>#${idx + 1} ${m.recipe.name}</strong> (${m.recipe.category})<br>
        <small style="color:var(--text-muted);">Prix : ${m.recipe.sellPrice} DH | Coût : ${m.recipe.greyCorner.cost.toFixed(2)} DH (FC ${m.recipe.greyCorner.foodCost.toFixed(1)}%)</small>
      </div>
      <div style="text-align:right;">
        <span class="text-success" style="font-weight:900;">+${m.recipe.greyCorner.grossMarginDH.toFixed(2)} DH</span><br>
        <button class="ai-btn-action" style="font-size:10.5px; padding:2px 8px; margin-top:3px;" onclick="window.applyAIOptimization('${encodeURIComponent(m.recipe.name)}', 'inspect')">Examiner</button>
      </div>
    </div>
  `).join('')}
</div>
${fallbackMatches.length > 6 ? `<div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">... et ${fallbackMatches.length - 6} autres plats correspondants.</div>` : ''}`;
      } else {
        responseText = `🤖 Je n'ai trouvé aucune fiche technique ni ingrédient correspondant exactement à « <strong>${rawQ}</strong> » dans le catalogue.<br><br>
Voici quelques suggestions que vous pouvez me poser :<br>
• 🥩 <em>« Quel plat qui contient viande hachée ? »</em><br>
• 🍕 <em>« Combien avons-nous de pizzas ? »</em><br>
• 🏆 <em>« Quels sont les 5 plats les plus rentables ? »</em><br>
• 💎 <em>« Quel est le plat le plus cher de la carte ? »</em><br>
• ⚖️ <em>« Compare Pizza Margherita et Pizza 4 Saisons »</em>`;
      }
    }

    aiChatHistory.push({ sender: 'ai', time: now, text: responseText });
    if (typeof window.renderAIChatMessages === 'function') window.renderAIChatMessages();
  };

  /* ========================================================
     2. SIMULATEUR MACRO "WHAT-IF" : DUAL LEVIER PRIX & GRAMMAGE
     Permet de simuler conjointement :
     - Levier A (Fournisseur) : variation du prix d'achat (+% / -%)
     - Levier B (Cuisine/Portion) : surdosage ou réduction de grammage (±g ou ±%)
     - Mesure l'impact direct sur la trésorerie mensuelle et le Food Cost
     - Permet d'appliquer le nouveau grammage sur une recette ou en masse (SSOT)
  ======================================================== */
  window.simSelectedIngredient = window.simSelectedIngredient || 'Mozzarella';
  window.simVariationPct = typeof window.simVariationPct === 'number' ? window.simVariationPct : 15;
  window.simGrammageDelta = typeof window.simGrammageDelta === 'number' ? window.simGrammageDelta : 0;
  window.simGrammageMode = window.simGrammageMode || 'grams'; // 'grams' ou 'pct'

  window.setSimVariation = function(pct) {

