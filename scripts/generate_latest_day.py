# -*- coding: utf-8 -*-
"""
Script de génération automatique du dernier jour de vente.
Extrait les données du fichier de caisse le plus récent dans ventes/ (post-mars)
et produit ventes/dernier_jour_ventes.json.
"""
import glob, os, re, json, xlrd, unicodedata

repo_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html_path = os.path.join(repo_dir, 'SYNTHESE_DECISIONNELLE_MENU.html')
ventes_dir = os.path.join(repo_dir, 'ventes')

# 1. Charger les références de menu
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'const INITIAL_MENU_DATA\s*=\s*(\[[\s\S]*?\]);', html)
if not m:
    print("INITIAL_MENU_DATA non trouvé dans le HTML!")
    exit(1)

menu = json.loads(m.group(1))

def norm(s):
    if not s: return ""
    s = str(s).upper()
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^A-Z0-9]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

menu_by_id = {it['id']: it for it in menu}
dish_map = {}
for it in menu:
    clean = norm(it['name'])
    dish_map[clean] = it['id']
    cat = norm(it['cat'])
    dish_map[f"{cat} {clean}"] = it['id']
    dish_map[f"{clean} {cat}"] = it['id']

aliases = {
    'BRUNCH GREY CORNER': '52e4ef86',
    'OMLETTE DU CHEF': '3c1696d2',
    'OMLETTE VEGETARIENNE': '630fad4f',
    'PET DEJ CONTINENTAL': '23a0f3a2',
    'OMLETTE FROMAGE': '8947e8bb',
    'OMLETTE NATURE': '7636c161',
    'MENU ENFANT': 'pet_menuenfant_20',
    'SALADE CERCLE VEGGL': 'd3ae6551',
    'PLAT PAVE DE SAUMON': '1d205276',
    'ROULADE DE BOEUF VH': '51d94c5a',
    'PLAT EMINCEDE BOEUF': 'e336c172',
    'BROCHETTE DE POULET': '59d7c3ba',
    'PLAT EMINCE DE POULET': '15ab9bd7',
    'COUSCOUS VAINDE AVEC PETIT LAIT': 'f5568705',
    'COUSCOUS POULET AVEC PETIT LAIT': '2d4954ac',
    'SANDWICH VIANDE HACHE': 'san_viandehach_48',
    'SANDWICH POULET': 'san_poulet_49',
    'SANDWICH THON': 'san_thon_50',
    'EGG BURGER': '7833bd8a',
    'PANINI SAUMON': 'pan_saumon_58',
    'PANINI MIX': 'a2351075',
    'PANINI VIANDE HACHEE': 'pan_viandehach_60',
    'PANINI CHARCUTERIE': '667b376b',
    'PIZZA SAUMON': 'piz_saumon_66',
    'PIZZA FRUITS DE MER': 'piz_fruitsdeme_67',
    'PIZZA POULET': '9fb4f4ef',
    'PASTA POULET CHAMPIGNON': 'a4197610',
    'PASTA BOLOGNAISE': '5c8a7b01',
    'PASTA SPAGUETTIS NOIRS': '16edc28a',
    'LASAGNE POULET': 'f1fa7f97',
    'LASAGNE FRUITS DE MER': '4f2ec5bc',
    'CREPE GREY CORNER SUCREE': '36fc4525',
    'CREPE GREY CORNER SALEE': '9829f0a2',
    'SAN SEBASTIEN': '184bcbd7',
    'CHEESE CAKE CITRON': '584328d9',
    'VERVEINE AU LAIT': 'b09952c5',
    'RED BULL': '652c18e1',
    'EAU GAZEUSE 75 CL': 'bf39e64c',
    'EAU MINERAL 75 CL': 'fde15742',
    'EAU MINERALE 0 5L': 'c6e82ded',
    'ZAAZAA': '7882e9fe',
    'ICE COFFEE AROMATISE': 'a4dbd839',
    'ICE COFFEE CLASSIQUE': '972b68fa',
    'MOJITO RED BULL': '6dc0a0c4',
    'SUPP CHANTILLY': 'fe25cf72',
    '2 BOULE DE GLACE': 'd6da872d',
    'BOULE DE GLACE': '46818b0a',
    'CAFE NOIR': '2870e2fd',
    'THE A LA MENTHE': '218eeccc',
    'THE MENTHE': '218eeccc',
    'CAFE AU LAIT': 'c8cb62c4',
    'CAFE LATTE': 'c8cb62c4',
    'CAPPUCCINO ITALIEN': '319b9d3e',
    'PET DEJ BELDI': 'c4189160',
    'BELDI': 'c4189160',
    'PET DEJ FASSI': 'bc60875d',
    'FASSI': 'bc60875d',
    'PET DEJ HOLLANDAIS': '67861d9d',
    'HOLLANDAIS': '67861d9d',
    'PET DEJ COMPAGNARD': 'pet_compagnard_12',
    'COMPAGNARD': 'pet_compagnard_12',
    'PET DEJ BERBERE': 'd838bed8',
    'BERBERE': 'd838bed8',
    'PET DEJ NORVEGIEN': '16cebd6f',
    'NORVEGIEN': '16cebd6f',
    'PET DEJ ESPAGNOL': 'bfe13ada',
    'ESPAGNOL': 'bfe13ada'
}
dish_map.update(aliases)

# 2. Trouver le fichier de caisse le plus récent (excluant ancien menu janv/fév/mars)
all_sales_files = []
pattern = os.path.join(ventes_dir, '2026-*', '*.xls*')
for f in glob.glob(pattern):
    if 'manifest.json' in f: continue
    lower = f.lower()
    if '2026-01' in lower or '2026-02' in lower or '2026-03' in lower:
        continue
    d_match = re.search(r'2026\d{4}', os.path.basename(f))
    date_str = d_match.group(0) if d_match else os.path.basename(f)
    all_sales_files.append((date_str, f))

all_sales_files.sort(key=lambda x: x[0])
if not all_sales_files:
    print("Aucun fichier de vente trouvé post-mars!")
    exit(1)

latest_date_str, latest_file = all_sales_files[-1]
base_name = os.path.basename(latest_file)
rel_path = os.path.relpath(latest_file, repo_dir).replace('\\', '/')
print(f"Fichier le plus récent : {base_name} ({latest_date_str})")

# 3. Extraire et agréger
wb = xlrd.open_workbook(latest_file)
sh = wb.sheet_by_index(0)

aggregated = {}
for r in range(1, sh.nrows):
    fam = str(sh.cell_value(r, 0)).strip()
    prod = str(sh.cell_value(r, 1)).strip()
    if not prod or prod.upper() in ['TOTAL', 'SOMME', 'MONTANT']:
        continue
    try:
        qty = float(sh.cell_value(r, 3))
    except:
        qty = 1.0
    if qty <= 0: qty = 1.0
    
    try:
        total = float(sh.cell_value(r, 4))
    except:
        total = 0.0
    
    n_prod = norm(prod)
    matched_id = dish_map.get(n_prod)
    if not matched_id:
        for prefix in ['PLAT ', 'PASTA ', 'PIZZA ', 'PANINI ', 'SANDWICH ', 'CREPE ', 'SALADE ', 'BURGER ']:
            if n_prod.startswith(prefix):
                matched_id = dish_map.get(n_prod[len(prefix):])
                if matched_id: break
    
    if not matched_id:
        matched_id = n_prod.lower().replace(' ', '_')
    
    if matched_id not in aggregated:
        item_name = prod
        item_cat = fam or "DIVERS"
        item_price = round(total / qty, 2) if qty > 0 else 0.0
        if matched_id in menu_by_id:
            item_name = menu_by_id[matched_id]['name']
            item_cat = menu_by_id[matched_id].get('cat', fam or 'DIVERS')
            item_price = menu_by_id[matched_id].get('price', item_price)
        aggregated[matched_id] = {
            'id': matched_id,
            'name': item_name,
            'cat': item_cat,
            'price': item_price,
            'qty': 0,
            'ca': 0.0
        }
    
    aggregated[matched_id]['qty'] += int(round(qty))
    aggregated[matched_id]['ca'] += total

items_report = []
total_ca = 0
total_qty = 0

for did, data in aggregated.items():
    ca = int(round(data['ca']))
    q = data['qty']
    total_ca += ca
    total_qty += q
    items_report.append({
        'id': data['id'],
        'name': data['name'],
        'cat': data['cat'],
        'price': data['price'],
        'qty': q,
        'ca': ca
    })

items_report.sort(key=lambda x: x['ca'], reverse=True)

months_fr = {
    '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril',
    '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août',
    '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre'
}
friendly_date = latest_date_str
if len(latest_date_str) == 8 and latest_date_str.startswith('2026'):
    d = latest_date_str[6:8]
    m_code = latest_date_str[4:6]
    friendly_date = f"{int(d)} {months_fr.get(m_code, m_code)} 2026"

result = {
    'date': friendly_date,
    'dateKey': latest_date_str,
    'fileName': base_name,
    'filePath': rel_path,
    'totalCA': total_ca,
    'totalQty': total_qty,
    'totalItems': len(items_report),
    'items': items_report
}

out_path = os.path.join(ventes_dir, 'dernier_jour_ventes.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Généré {out_path} : {len(items_report)} plats, {total_qty} articles, {total_ca:,} DH.")

# Inscription directe dans SYNTHESE_DECISIONNELLE_MENU.html pour supporter le mode local file://
minified_json = json.dumps(result, ensure_ascii=False)
html_updated = re.sub(
    r'const LATEST_DAILY_SALES\s*=\s*\{.*?\};',
    f'const LATEST_DAILY_SALES = {minified_json};',
    html
)
# Mise à jour du header affiché par défaut
formatted_ca = f"{total_ca:,}".replace(',', ' ')
html_updated = re.sub(
    r'Dernier jour synchronis&eacute;\s*:\s*<strong id="watcher-latest-date"[^>]*>.*?</strong>\s*&bull;\s*<span id="watcher-latest-meta">.*?</span>',
    f'Dernier jour synchronis&eacute; : <strong id="watcher-latest-date" style="color:var(--gold-light);">{friendly_date}</strong> &bull; <span id="watcher-latest-meta">{base_name} ({formatted_ca} DH &bull; {total_qty} articles)</span>',
    html_updated
)
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_updated)
print(f"SYNTHESE_DECISIONNELLE_MENU.html synchronisé avec succès ({friendly_date}).")

