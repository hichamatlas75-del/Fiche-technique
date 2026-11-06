import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
assets_dir = os.path.join(workspace_dir, 'assets_presentation')
pptx_path = os.path.join(workspace_dir, 'Guide_Pratique_FoodCost_MenuEngineering.pptx')

# Initialize presentation with 16:9 Widescreen
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Professional Color Palette
C_BG_DARK = RGBColor(15, 23, 42)      # Slate 900
C_CARD_DARK = RGBColor(30, 41, 59)    # Slate 800
C_CARD_BORDER = RGBColor(51, 65, 85)  # Slate 700
C_GOLD = RGBColor(245, 158, 11)       # Amber 500
C_GOLD_LIGHT = RGBColor(251, 191, 36) # Amber 400
C_WHITE = RGBColor(248, 250, 252)     # Slate 50
C_MUTED = RGBColor(148, 163, 184)     # Slate 400
C_GREEN = RGBColor(16, 185, 129)      # Emerald 500
C_BLUE = RGBColor(59, 130, 246)       # Blue 500
C_RED = RGBColor(239, 68, 68)         # Red 500
C_CYAN = RGBColor(56, 189, 248)       # Sky 400

def set_slide_background(slide, color=C_BG_DARK):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    return bg

def add_header(slide, title, category="MANAGEMENT HUB • GUIDE OPÉRATIONNEL"):
    # Category tag
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
    tf_c = cat_box.text_frame
    tf_c.word_wrap = True
    p_c = tf_c.paragraphs[0]
    p_c.text = category.upper()
    p_c.font.size = Pt(10)
    p_c.font.bold = True
    p_c.font.color.rgb = C_GOLD

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.6))
    tf_t = title_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title
    p_t.font.size = Pt(22)
    p_t.font.bold = True
    p_t.font.color.rgb = C_WHITE

    # Divider bar
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.04))
    line.fill.solid()
    line.fill.fore_color.rgb = C_GOLD
    line.line.fill.background()

def create_card(slide, left, top, width, height, bg_color=C_CARD_DARK, border_color=C_CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
    else:
        card.line.fill.background()
    return card

# -----------------------------------------------------------------------------
# SLIDE 1 : COUVERTURE
# -----------------------------------------------------------------------------
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1, C_BG_DARK)

# Background subtle decorative card
create_card(s1, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9), RGBColor(24, 33, 50), C_CARD_BORDER)

# Top Gold Pill
pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.3), Inches(3.8), Inches(0.45))
pill.fill.solid()
pill.fill.fore_color.rgb = RGBColor(120, 53, 15) # Dark amber
pill.line.color.rgb = C_GOLD
tf_p = pill.text_frame
p_p = tf_p.paragraphs[0]
p_p.alignment = PP_ALIGN.CENTER
p_p.text = "⚡ GREY CORNER • MANAGEMENT HUB"
p_p.font.size = Pt(11)
p_p.font.bold = True
p_p.font.color.rgb = C_GOLD_LIGHT

# Main Title
t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(10.9), Inches(1.8))
tf = t_box.text_frame
tf.word_wrap = True
p1 = tf.paragraphs[0]
p1.text = "MAÎTRISE DU FOOD COST &\nMENU ENGINEERING"
p1.font.size = Pt(36)
p1.font.bold = True
p1.font.color.rgb = C_WHITE

p2 = tf.add_paragraph()
p2.text = "Guide Pratique d'Utilisation : Piloter la rentabilité, optimiser les prix et maximiser les marges de votre restaurant"
p2.font.size = Pt(15)
p2.font.color.rgb = C_MUTED
p2.space_before = Pt(12)

# 3 Highlights Cards
hl_data = [
    ("1. MERCURIALE & COÛTS", "Paramétrage au gramme et millilitre avec rendements et pertes de parage réels.", C_GOLD),
    ("2. FICHES TECHNIQUES", "Calcul automatique du Food Cost portion et simulation de marge brute unitaire.", C_BLUE),
    ("3. MENU ENGINEERING", "Matrice 4 quadrants (Étoiles, Vaches, Puzzles, Chiens) pour arbitrer la carte.", C_GREEN)
]

for idx, (title, desc, color) in enumerate(hl_data):
    cx = Inches(1.2 + idx * 3.7)
    c_card = create_card(s1, cx, Inches(4.3), Inches(3.5), Inches(1.8), C_CARD_DARK, color)
    tb = s1.shapes.add_textbox(cx + Inches(0.15), Inches(4.45), Inches(3.2), Inches(1.5))
    ctf = tb.text_frame
    ctf.word_wrap = True
    cp1 = ctf.paragraphs[0]
    cp1.text = title
    cp1.font.size = Pt(13)
    cp1.font.bold = True
    cp1.font.color.rgb = color
    cp2 = ctf.add_paragraph()
    cp2.text = desc
    cp2.font.size = Pt(10.5)
    cp2.font.color.rgb = C_WHITE
    cp2.space_before = Pt(6)

# Footer
f_box = s1.shapes.add_textbox(Inches(1.2), Inches(6.25), Inches(10.9), Inches(0.4))
tf_f = f_box.text_frame
pf = tf_f.paragraphs[0]
pf.text = "Manuel Opérationnel pour Chefs de Cuisine, Directeurs d'Exploitation & Gestionnaires F&B"
pf.font.size = Pt(10)
pf.font.color.rgb = C_MUTED

# -----------------------------------------------------------------------------
# SLIDE 2 : LES ENJEUX & LES PRÉREQUIS
# -----------------------------------------------------------------------------
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, "1. Enjeux Stratégiques & Documents Prérequis")

# Left Column : 3 Objectifs
create_card(s2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(4.4), C_CARD_DARK, C_CARD_BORDER)
tb_obj = s2.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(5.2), Inches(4.1))
tf_o = tb_obj.text_frame
tf_o.word_wrap = True

po_title = tf_o.paragraphs[0]
po_title.text = "🎯 Les 3 Objectifs Majeurs de l'Outil"
po_title.font.size = Pt(16)
po_title.font.bold = True
po_title.font.color.rgb = C_GOLD

objs = [
    ("1. Éradiquer le gaspillage invisible", "Détecter avec précision l'écart entre le coût théorique des recettes et vos achats réels de matières premières."),
    ("2. Protéger votre marge brute unitaire", "Répercuter immédiatement les hausses fournisseurs sur les marges sans perdre de clients."),
    ("3. Arbitrer scientifiquement la carte", "Remplacer l'intuition par des décisions chiffrées (Volumes vendus × Marge unitaire en DH).")
]
for t, d in objs:
    pt = tf_o.add_paragraph()
    pt.text = t
    pt.font.size = Pt(12)
    pt.font.bold = True
    pt.font.color.rgb = C_WHITE
    pt.space_before = Pt(10)
    pd = tf_o.add_paragraph()
    pd.text = d
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_MUTED

# Right Column : Prérequis
create_card(s2, Inches(6.8), Inches(1.6), Inches(5.733), Inches(4.4), C_CARD_DARK, C_CARD_BORDER)
tb_pre = s2.shapes.add_textbox(Inches(7.0), Inches(1.75), Inches(5.3), Inches(4.1))
tf_p = tb_pre.text_frame
tf_p.word_wrap = True

pp_title = tf_p.paragraphs[0]
pp_title.text = "📂 Les 4 Prérequis Indispensables"
pp_title.font.size = Pt(16)
pp_title.font.bold = True
pp_title.font.color.rgb = C_CYAN

prereqs = [
    ("Factures Fournisseurs Récentes", "Conditionnements d'achat et prix unitaires nets HT pour paramétrer la Mercuriale."),
    ("Fiches de Pesées de Cuisine", "Grammages exacts par portion (viandes, sauces, garnitures, assaisonnements)."),
    ("Carte Actuelle des Prix (TTC)", "Tarifs affichés aux clients et taux de TVA pour le calcul des prix HT."),
    ("Historique des Ventes (Caisse POS)", "Volumes vendus par article sur une période représentative (semaine / mois).")
]
for t, d in prereqs:
    pt = tf_p.add_paragraph()
    pt.text = "✔ " + t
    pt.font.size = Pt(11.5)
    pt.font.bold = True
    pt.font.color.rgb = C_WHITE
    pt.space_before = Pt(8)
    pd = tf_p.add_paragraph()
    pd.text = d
    pd.font.size = Pt(9.5)
    pd.font.color.rgb = C_MUTED

# Bottom Banner
create_card(s2, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.85), RGBColor(24, 33, 50), C_GOLD)
tb_b = s2.shapes.add_textbox(Inches(1.0), Inches(6.2), Inches(11.3), Inches(0.75))
tf_b = tb_b.text_frame
tf_b.word_wrap = True
pb = tf_b.paragraphs[0]
pb.text = "💡 RÈGLE D'OR DE DÉMARRAGE : Sans mercuriale précise et pesées exactes à l'entrée, aucun pilotage de marge n'est possible à la sortie."
pb.font.size = Pt(11)
pb.font.bold = True
pb.font.color.rgb = C_GOLD_LIGHT

# -----------------------------------------------------------------------------
# SLIDE 3 : ÉTAPE 1 - PARAMÉTRAGE DE LA MERCURIALE
# -----------------------------------------------------------------------------
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, "2. Étape 1 : Paramétrage de la Mercuriale (Matières Premières)")

# Left Card: Les 3 Unités & Rendement
create_card(s3, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)
tb_u = s3.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(5.2), Inches(5.0))
tf_u = tb_u.text_frame
tf_u.word_wrap = True

pu_title = tf_u.paragraphs[0]
pu_title.text = "⚖️ Les 3 Unités de Référence Standardisées"
pu_title.font.size = Pt(15)
pu_title.font.bold = True
pu_title.font.color.rgb = C_GOLD

units = [
    ("Le Gramme (g)", "Pour tous les solides : viandes, poissons, légumes, fromages, épicerie. Finis les kg dans les recettes."),
    ("Le Millilitre (ml)", "Pour tous les liquides : huiles, crèmes, sauces fluides, sirops, laits."),
    ("La Pièce (p) ou Tranche (tr)", "Réservée aux produits indivisibles et calibrés : œufs, pains burger, canettes.")
]
for t, d in units:
    pt = tf_u.add_paragraph()
    pt.text = "• " + t
    pt.font.size = Pt(11.5)
    pt.font.bold = True
    pt.font.color.rgb = C_WHITE
    pt.space_before = Pt(8)
    pd = tf_u.add_paragraph()
    pd.text = d
    pd.font.size = Pt(9.5)
    pd.font.color.rgb = C_MUTED

pr_title = tf_u.add_paragraph()
pr_title.text = "🔪 Poids Brut vs Poids Net (Rendement)"
pr_title.font.size = Pt(14)
pr_title.font.bold = True
pr_title.font.color.rgb = C_CYAN
pr_title.space_before = Pt(16)

pr_desc = tf_u.add_paragraph()
pr_desc.text = "Formule de conversion indispensable :\nCoût Net au Gramme = Prix Achat Brut / Poids Net Consommable"
pr_desc.font.size = Pt(10)
pr_desc.font.bold = True
pr_desc.font.color.rgb = C_GOLD_LIGHT
pr_desc.space_before = Pt(4)

# Right: Tableau des Rendements
create_card(s3, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)
tb_tbl = s3.shapes.add_textbox(Inches(7.0), Inches(1.75), Inches(5.3), Inches(0.5))
tf_tbl = tb_tbl.text_frame
ptbl = tf_tbl.paragraphs[0]
ptbl.text = "📊 Tableau Comparatif : Brut vs Réel Net"
ptbl.font.size = Pt(15)
ptbl.font.bold = True
ptbl.font.color.rgb = C_WHITE

# Table shape
rows = 5
cols = 4
left = Inches(7.0)
top = Inches(2.4)
width = Inches(5.333)
height = Inches(2.8)
table_shape = s3.shapes.add_table(rows, cols, left, top, width, height)
table = table_shape.table

headers = ["Famille", "Rendement", "Achat Brut", "Coût Net Réel"]
for c_idx, h in enumerate(headers):
    cell = table.cell(0, c_idx)
    cell.text = h
    cell.fill.solid()
    cell.fill.fore_color.rgb = RGBColor(51, 65, 85)
    p = cell.text_frame.paragraphs[0]
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_GOLD

data_t = [
    ["Filet de bœuf", "75 - 80%", "140 DH/kg", "175 DH/kg (0.175)"],
    ["Légumes frais", "80 - 85%", "8.00 DH/kg", "9.70 DH/kg (0.010)"],
    ["Crevettes entières", "45 - 50%", "90 DH/kg", "180 DH/kg (0.180)"],
    ["Épicerie / Pâtes", "100%", "22 DH/kg", "22 DH/kg (0.022)"]
]

for r_idx, row_data in enumerate(data_t):
    for c_idx, val in enumerate(row_data):
        cell = table.cell(r_idx + 1, c_idx)
        cell.text = val
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(30, 41, 59)
        p = cell.text_frame.paragraphs[0]
        p.font.size = Pt(9)
        p.font.color.rgb = C_WHITE if c_idx != 3 else C_GOLD_LIGHT
        if c_idx == 3: p.font.bold = True

# Right Bottom Tip Card
c_tip = create_card(s3, Inches(7.0), Inches(5.4), Inches(5.333), Inches(1.3), RGBColor(120, 53, 15), C_GOLD)
tb_tip = s3.shapes.add_textbox(Inches(7.1), Inches(5.45), Inches(5.1), Inches(1.1))
tft = tb_tip.text_frame
tft.word_wrap = True
pt1 = tft.paragraphs[0]
pt1.text = "⚠️ ATTENTION AUX PERTES DE CUISINE"
pt1.font.size = Pt(10.5)
pt1.font.bold = True
pt1.font.color.rgb = C_GOLD_LIGHT
pt2 = tft.add_paragraph()
pt2.text = "Saisir le prix brut sans tenir compte des parages fausse totalement le Food Cost en sous-estimant le coût de chaque portion."
pt2.font.size = Pt(9)
pt2.font.color.rgb = C_WHITE
pt2.space_before = Pt(3)

# -----------------------------------------------------------------------------
# SLIDE 4 : ÉTAPE 2 - FICHES TECHNIQUES & SOUS-RECETTES
# -----------------------------------------------------------------------------
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, "3. Étape 2 : Création des Fiches Techniques & Sous-Recettes")

# Left Column : Méthodologie & Convention
create_card(s4, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)
tb_ft = s4.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(5.2), Inches(5.0))
tf_ft = tb_ft.text_frame
tf_ft.word_wrap = True

pft_title = tf_ft.paragraphs[0]
pft_title.text = "📝 Méthodologie de Construction"
pft_title.font.size = Pt(15)
pft_title.font.bold = True
pft_title.font.color.rgb = C_GOLD

steps = [
    ("1. Pesées réelles en service", "Effectuer 3 pesées lors d'un service réel pour fixer le grammage moyen servi (ex: 180g viande, 200g frites)."),
    ("2. Format de saisie universel", "Saisir chaque ligne selon la syntaxe stricte :\n[Nom de l'ingrédient] : [Quantité] [Unité]\nExemple : Poulet : 160 g  |  Crème fraîche : 80 ml"),
    ("3. Gestion des Sous-Recettes (Batch)", "Créer les fiches de vos lots de base (ex: Sauce Champignon 2L), puis injecter la portion exacte dans vos plats (ex: Sauce : 70 ml).")
]
for t, d in steps:
    pt = tf_ft.add_paragraph()
    pt.text = t
    pt.font.size = Pt(11)
    pt.font.bold = True
    pt.font.color.rgb = C_WHITE
    pt.space_before = Pt(8)
    pd = tf_ft.add_paragraph()
    pd.text = d
    pd.font.size = Pt(9.5)
    pd.font.color.rgb = C_MUTED

# Right Column : Exemple Fiche Plat & Invisibles
create_card(s4, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)
tb_ex = s4.shapes.add_textbox(Inches(7.0), Inches(1.75), Inches(5.3), Inches(5.0))
tf_ex = tb_ex.text_frame
tf_ex.word_wrap = True

pex_title = tf_ex.paragraphs[0]
pex_title.text = "🍲 Anatomie d'une Fiche Complète"
pex_title.font.size = Pt(15)
pex_title.font.bold = True
pex_title.font.color.rgb = C_CYAN

p_rec = tf_ex.add_paragraph()
p_rec.text = "Exemple : ÉMINCÉ DE POULET AUX CHAMPIGNONS"
p_rec.font.size = Pt(11)
p_rec.font.bold = True
p_rec.font.color.rgb = C_GOLD_LIGHT
p_rec.space_before = Pt(6)

lines_ex = [
    "• Poulet filet : 160 g (coût : 11.20 DH)",
    "• Champignons frais : 60 g (coût : 1.80 DH)",
    "• Crème fraîche : 100 ml (coût : 3.50 DH)",
    "• Demi-glace : 50 ml (coût : 2.00 DH)",
    "• Légumes sautés : 150 g (coût : 3.00 DH)",
    "• Frites maison : 200 g (coût : 2.40 DH)",
    "• Forfait Huile & Assaisonnements : 1 p (coût : 1.50 DH)"
]
for l in lines_ex:
    pl = tf_ex.add_paragraph()
    pl.text = l
    pl.font.size = Pt(9.5)
    pl.font.color.rgb = C_WHITE
    pl.space_before = Pt(2)

p_tot = tf_ex.add_paragraph()
p_tot.text = "➔ COÛT TOTAL MATIÈRE (Food Cost) = 25.40 DH"
p_tot.font.size = Pt(11)
p_tot.font.bold = True
p_tot.font.color.rgb = C_GREEN
p_tot.space_before = Pt(8)

p_inv_title = tf_ex.add_paragraph()
p_inv_title.text = "🔍 Ne négligez jamais les « Coûts Invisibles »"
p_inv_title.font.size = Pt(12)
p_inv_title.font.bold = True
p_inv_title.font.color.rgb = C_GOLD
p_inv_title.space_before = Pt(12)

p_inv_desc = tf_ex.add_paragraph()
p_inv_desc.text = "L'huile de friture, le sel, le poivre, le pain d'accueil ou les sauces de table représentent 5 à 8% de dérive s'ils ne sont pas forfaitisés."
p_inv_desc.font.size = Pt(9.5)
p_inv_desc.font.color.rgb = C_MUTED

# -----------------------------------------------------------------------------
# SLIDE 5 : ÉTAPE 3 - FIXATION DES PRIX & CALCUL DE MARGE
# -----------------------------------------------------------------------------
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, "4. Étape 3 : Fixation des Prix de Vente & Analyse de Marge")

# Left Column : Formules & Ratios Cibles
create_card(s5, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)
tb_form = s5.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(5.2), Inches(2.2))
tf_form = tb_form.text_frame
tf_form.word_wrap = True

pf_title = tf_form.paragraphs[0]
pf_title.text = "📐 Formules Fondamentales"
pf_title.font.size = Pt(15)
pf_title.font.bold = True
pf_title.font.color.rgb = C_GOLD

formulas = [
    ("1. Ratio Food Cost (%)", "Food Cost % = (Coût Matière HT / Prix de Vente HT) × 100"),
    ("2. Marge Brute en Valeur (DH)", "Marge Brute = Prix de Vente HT - Coût Matière HT")
]
for f_t, f_d in formulas:
    p = tf_form.add_paragraph()
    p.text = f_t
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.space_before = Pt(6)
    p2 = tf_form.add_paragraph()
    p2.text = f_d
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = C_WHITE

# Add Category Target Chart image inside left card bottom
chart_targets_path = os.path.join(assets_dir, 'category_targets.png')
if os.path.exists(chart_targets_path):
    s5.shapes.add_picture(chart_targets_path, Inches(1.0), Inches(3.9), width=Inches(5.2))

# Right Column : Waterfall & Piège du pourcentage
create_card(s5, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)

# Add Waterfall Chart image on top right
chart_waterfall_path = os.path.join(assets_dir, 'waterfall_foodcost.png')
if os.path.exists(chart_waterfall_path):
    s5.shapes.add_picture(chart_waterfall_path, Inches(7.0), Inches(1.75), width=Inches(5.333))

# Right Bottom Card : Le Piège du Pourcentage
c_trap = create_card(s5, Inches(7.0), Inches(4.7), Inches(5.333), Inches(2.0), RGBColor(24, 33, 50), C_GOLD)
tb_trap = s5.shapes.add_textbox(Inches(7.15), Inches(4.75), Inches(5.0), Inches(1.9))
tf_trap = tb_trap.text_frame
tf_trap.word_wrap = True

pt_title = tf_trap.paragraphs[0]
pt_title.text = "⚠️ LE PIÈGE : POURCENTAGE VS MARGE EN VALEUR"
pt_title.font.size = Pt(11)
pt_title.font.bold = True
pt_title.font.color.rgb = C_GOLD_LIGHT

pt_body = tf_trap.add_paragraph()
pt_body.text = "• Plat de Pâtes à 60 DH (FC 15%) ➔ Marge Brute = 51.00 DH\n• Filet de Bœuf à 140 DH (FC 32%) ➔ Marge Brute = 95.20 DH\nBien que le % du bœuf semble moins bon, il apporte presque LE DOUBLE de dirhams en caisse pour payer vos charges fixes (loyer, salaires, énergie) !"
pt_body.font.size = Pt(9)
pt_body.font.color.rgb = C_WHITE
pt_body.space_before = Pt(4)

# -----------------------------------------------------------------------------
# SLIDE 6 : ÉTAPE 4 - LA MATRICE MENU ENGINEERING
# -----------------------------------------------------------------------------
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6)
add_header(s6, "5. Étape 4 : Menu Engineering (Audit & Matrice de Rentabilité)")

# Left side : Image of Matrix
chart_matrix_path = os.path.join(assets_dir, 'menu_engineering_matrix.png')
if os.path.exists(chart_matrix_path):
    create_card(s6, Inches(0.8), Inches(1.6), Inches(6.4), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)
    s6.shapes.add_picture(chart_matrix_path, Inches(0.95), Inches(1.75), width=Inches(6.1))

# Right side : Concept Explanation
create_card(s6, Inches(7.5), Inches(1.6), Inches(5.033), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)
tb_me = s6.shapes.add_textbox(Inches(7.7), Inches(1.75), Inches(4.6), Inches(5.0))
tf_me = tb_me.text_frame
tf_me.word_wrap = True

pme_title = tf_me.paragraphs[0]
pme_title.text = "📊 La Méthode Kasavana & Smith"
pme_title.font.size = Pt(15)
pme_title.font.bold = True
pme_title.font.color.rgb = C_GOLD

pme_desc = tf_me.add_paragraph()
pme_desc.text = "Elle croise deux indicateurs fondamentaux par rapport à la moyenne de la catégorie :"
pme_desc.font.size = Pt(9.5)
pme_desc.font.color.rgb = C_MUTED
pme_desc.space_before = Pt(4)

axes = [
    ("1. Axe Horizontal : Popularité (Volume)", "Quantité totale d'articles vendus sur la période (données POS / Caisse)."),
    ("2. Axe Vertical : Rentabilité (Marge)", "Marge brute en valeur générée par portion (Prix HT - Coût Matière).")
]
for at, ad in axes:
    pa = tf_me.add_paragraph()
    pa.text = at
    pa.font.size = Pt(10.5)
    pa.font.bold = True
    pa.font.color.rgb = C_CYAN
    pa.space_before = Pt(8)
    pad = tf_me.add_paragraph()
    pad.text = ad
    pad.font.size = Pt(9)
    pad.font.color.rgb = C_WHITE

p_rule_t = tf_me.add_paragraph()
p_rule_t.text = "🎯 Les 4 Quadrants Stratégiques :"
p_rule_t.font.size = Pt(11)
p_rule_t.font.bold = True
p_rule_t.font.color.rgb = C_GOLD_LIGHT
p_rule_t.space_before = Pt(12)

quads = [
    ("⭐ ÉTOILES", "Forte Marge + Fort Volume (À sanctifier)", C_GREEN),
    ("🐄 VACHES À LAIT", "Faible Marge + Fort Volume (À réingénier)", C_BLUE),
    ("🧩 PUZZLES", "Forte Marge + Faible Volume (À promouvoir)", C_GOLD),
    ("🐕 CHIENS", "Faible Marge + Faible Volume (À éliminer)", C_RED)
]
for q_name, q_desc, q_col in quads:
    pq = tf_me.add_paragraph()
    pq.text = f"• {q_name} : {q_desc}"
    pq.font.size = Pt(9.5)
    pq.font.color.rgb = q_col
    pq.font.bold = True
    pq.space_before = Pt(3)

# -----------------------------------------------------------------------------
# SLIDE 7 : PLAN D'ACTION PAR QUADRANT
# -----------------------------------------------------------------------------
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7)
add_header(s7, "6. Plan d'Action Opérationnel par Quadrant")

# 4 Cards in 2x2 Layout
quad_cards = [
    # Top-Left: Stars
    (Inches(0.8), Inches(1.6), Inches(5.7), Inches(2.55),
     "⭐ LES ÉTOILES (STARS)",
     "Forte Marge & Forte Popularité — Vos Piliers Économiques",
     [
         "• Ne JAMAIS toucher à la recette ni baisser la qualité des ingrédients.",
         "• Placer en 'zone chaude' sur la carte (haut à droite, encadré distinctif).",
         "• Former la salle à en faire la suggestion prioritaire.",
         "• Tester de légères extensions de gamme (ex: format gourmand)."
     ],
     C_GREEN),

    # Top-Right: Puzzles
    (Inches(6.833), Inches(1.6), Inches(5.7), Inches(2.55),
     "🧩 LES PUZZLES",
     "Forte Marge mais Faibles Ventes — Vos Trésors Cachés",
     [
         "• Réécrire l'intitulé et la description (storytelling plus appétissant).",
         "• Améliorer le dressage visuel et la mise en valeur sur les réseaux.",
         "• Lancer un challenge d'équipe auprès des serveurs.",
         "• Tester une baisse tactique de prix si le tarif constitue un frein."
     ],
     C_GOLD),

    # Bottom-Left: Plowhorses
    (Inches(0.8), Inches(4.35), Inches(5.7), Inches(2.55),
     "🐄 LES VACHES À LAIT (PLOWHORSES)",
     "Très Populaires mais Marge Insuffisante — Mangeurs de Marge",
     [
         "• Réingénierie discrète de portion : optimiser la protéine de 10 à 15g.",
         "• Hausse modérée de prix (+2 à +5 DH) : la demande forte l'absorbera.",
         "• Renégocier les volumes d'achat auprès des fournisseurs.",
         "• Associer à une boisson ou entrée à forte marge (formule combinée)."
     ],
     C_BLUE),

    # Bottom-Right: Dogs
    (Inches(6.833), Inches(4.35), Inches(5.7), Inches(2.55),
     "🐕 LES CHIENS (DOGS)",
     "Faible Marge & Faible Vente — Fardeaux Opérationnels",
     [
         "• Supprimer sans regret s'ils mobilisent des ingrédients uniques.",
         "• Libérer de la place en chambre froide et éliminer le stock mort.",
         "• Si indispensable (ex: menu enfant) : reformuler sur des bases communes déjà présentes sur les postes chauds.",
         "• Remplacer par un nouveau plat test à fort potentiel de marge."
     ],
     C_RED)
]

for left, top, width, height, title, subtitle, bullets, color in quad_cards:
    create_card(s7, left, top, width, height, C_CARD_DARK, color)
    tb = s7.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), height - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True

    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = color

    p2 = tf.add_paragraph()
    p2.text = subtitle
    p2.font.size = Pt(9)
    p2.font.bold = True
    p2.font.color.rgb = C_MUTED
    p2.space_before = Pt(2)

    for b in bullets:
        pb = tf.add_paragraph()
        pb.text = b
        pb.font.size = Pt(8.5)
        pb.font.color.rgb = C_WHITE
        pb.space_before = Pt(3)

# -----------------------------------------------------------------------------
# SLIDE 8 : DIAGNOSTIC DES ÉCARTS & RITUELS DE GESTION
# -----------------------------------------------------------------------------
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8)
add_header(s8, "7. Diagnostic des Écarts & Rituels de Pilotage")

# Left Column : 5 Causes d'écarts
create_card(s8, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)
tb_ec = s8.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(5.2), Inches(5.0))
tf_ec = tb_ec.text_frame
tf_ec.word_wrap = True

pec_title = tf_ec.paragraphs[0]
pec_title.text = "🔍 Les 5 Causes d'Écart Stock Réel vs Théorique"
pec_title.font.size = Pt(14)
pec_title.font.bold = True
pec_title.font.color.rgb = C_RED

causes = [
    ("1. Non-respect des grammages", "Absence de balance de contrôle au passe ou cuillères doseuses non calibrées."),
    ("2. Coulages & Pertes non déclarées", "Plats brûlés, périmés ou cassés non consignés sur la feuille de casse."),
    ("3. Repas du personnel & Offerts", "Non saisis sur la caisse en compte interne, ils créent un trou inexpliqué."),
    ("4. Variation de la qualité brute", "Livraisons de viande ou légumes avec un taux de gras/parage supérieur à la norme."),
    ("5. Erreurs de saisie en caisse", "Mauvaise touche plat sélectionnée par les serveurs lors de la commande.")
]
for t, d in causes:
    pt = tf_ec.add_paragraph()
    pt.text = t
    pt.font.size = Pt(10.5)
    pt.font.bold = True
    pt.font.color.rgb = C_WHITE
    pt.space_before = Pt(6)
    pd = tf_ec.add_paragraph()
    pd.text = d
    pd.font.size = Pt(9)
    pd.font.color.rgb = C_MUTED

# Right Column : Rituels de Gestion
create_card(s8, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.3), C_CARD_DARK, C_CARD_BORDER)
tb_rit = s8.shapes.add_textbox(Inches(7.0), Inches(1.75), Inches(5.3), Inches(5.0))
tf_rit = tb_rit.text_frame
tf_rit.word_wrap = True

prit_title = tf_rit.paragraphs[0]
prit_title.text = "⏱️ Fréquence des Rituels de Pilotage"
prit_title.font.size = Pt(14)
prit_title.font.bold = True
prit_title.font.color.rgb = C_CYAN

rituels = [
    ("HEBDOMADAIRE (30 min)", "• Vérifier les prix des factures reçues et mettre à jour la Mercuriale.\n• Contrôler les volumes vendus et le top 5 des consommations matières."),
    ("MENSUEL (1h30)", "• Réaliser l'inventaire physique complet de fin de mois.\n• Comparer consommation théorique du logiciel vs stock physique réel.\n• Actualiser la matrice Menu Engineering."),
    ("SAISONNIER (1/2 Journée)", "• Arbitrer la carte : supprimer les Chiens persistants.\n• Réajuster les prix de vente en fonction de l'inflation fournisseur.\n• Lancer les nouveaux plats tests.")
]
for t, d in rituels:
    pt = tf_rit.add_paragraph()
    pt.text = "📅 " + t
    pt.font.size = Pt(11)
    pt.font.bold = True
    pt.font.color.rgb = C_GOLD_LIGHT
    pt.space_before = Pt(8)
    pd = tf_rit.add_paragraph()
    pd.text = d
    pd.font.size = Pt(9)
    pd.font.color.rgb = C_WHITE

# -----------------------------------------------------------------------------
# SLIDE 9 : FEUILLE DE ROUTE DE DÉPLOIEMENT
# -----------------------------------------------------------------------------
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9)
add_header(s9, "8. Synthèse & Feuille de Route de Déploiement")

# 4 Phase Steps Timeline Cards
steps_plan = [
    ("SEMAINE 1", "MERCURIALE & ACHATS", "• Rassembler toutes les factures.\n• Saisir les prix unitaires nets.\n• Calibrer les rendements de parage.", C_GOLD),
    ("SEMAINE 2", "PESÉES & RECETTES", "• Peser 3 portions réelles au passe.\n• Construire les fiches techniques.\n• Forfaitiser les coûts invisibles.", C_CYAN),
    ("SEMAINE 3", "CONNEXION CAISSE", "• Importer les volumes de vente.\n• Calculer le Food Cost réel global.\n• Générer la matrice Menu Eng.", C_BLUE),
    ("SEMAINE 4", "ARBITRAGE DE CARTE", "• Réingénier les Vaches à lait.\n• Promouvoir les Puzzles en salle.\n• Supprimer les Chiens du menu.", C_GREEN)
]

for idx, (sem, title, desc, col) in enumerate(steps_plan):
    cx = Inches(0.8 + idx * 2.98)
    create_card(s9, cx, Inches(1.8), Inches(2.8), Inches(3.6), C_CARD_DARK, col)
    tb = s9.shapes.add_textbox(cx + Inches(0.15), Inches(1.95), Inches(2.5), Inches(3.3))
    tf = tb.text_frame
    tf.word_wrap = True

    p1 = tf.paragraphs[0]
    p1.text = sem
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = col

    p2 = tf.add_paragraph()
    p2.text = title
    p2.font.size = Pt(10)
    p2.font.bold = True
    p2.font.color.rgb = C_WHITE
    p2.space_before = Pt(3)

    p3 = tf.add_paragraph()
    p3.text = desc
    p3.font.size = Pt(8.5)
    p3.font.color.rgb = C_MUTED
    p3.space_before = Pt(8)

# Bottom Final Call to Action
create_card(s9, Inches(0.8), Inches(5.6), Inches(11.733), Inches(1.3), RGBColor(24, 33, 50), C_GOLD)
tb_cta = s9.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(11.3), Inches(1.1))
tf_cta = tb_cta.text_frame
tf_cta.word_wrap = True

p_cta1 = tf_cta.paragraphs[0]
p_cta1.text = "🚀 CONCLUSION : LA RENTABILITÉ EST UNE DISCIPLINE QUOTIDIENNE"
p_cta1.font.size = Pt(13)
p_cta1.font.bold = True
p_cta1.font.color.rgb = C_GOLD_LIGHT

p_cta2 = tf_cta.add_paragraph()
p_cta2.text = "Un restaurant bien géré ne cherche pas à réduire la qualité de ses assiettes, mais à éliminer méthodiquement les gaspillages invisibles et à valoriser les plats qui rémunèrent véritablement le travail de l'équipe."
p_cta2.font.size = Pt(10)
p_cta2.font.color.rgb = C_WHITE
p_cta2.space_before = Pt(4)

# Save presentation
prs.save(pptx_path)
print(f"PowerPoint Presentation generated successfully at: {pptx_path}")
