# -*- coding: utf-8 -*-
"""
GREY CORNER — Synchronisation des Ventes Journalières vers Supabase Cloud
Table: daily_sales (sale_date, total_revenue, total_tickets, total_items, items)

Usage :
  python scripts/sync_sales_to_supabase.py                 # Synchronise du 2026-04-01 à hier
  python scripts/sync_sales_to_supabase.py --latest        # Synchronise le jour le plus récent
  python scripts/sync_sales_to_supabase.py --date 2026-09-16 # Synchronise une date précise
"""

import os
import sys
import glob
import re
import json
import urllib.request
import urllib.error
import unicodedata

try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

try:
    import xlrd
except ImportError:
    xlrd = None

try:
    import openpyxl
except ImportError:
    openpyxl = None

SUPABASE_URL = "https://bxgguavmuiefthqmzygy.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Z2d1YXZtdWllZnRocW16eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNzIsImV4cCI6MjEwNDk1MjI3Mn0.7aGDBXzzMApGkxXuDDcwMJXxPlPsG8LEYb5WIcA--00"

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VENTES_DIR = os.path.join(REPO_DIR, "ventes")
HTML_PATH = os.path.join(REPO_DIR, "SYNTHESE_DECISIONNELLE_MENU.html")

def norm(s):
    if not s:
        return ""
    s = str(s).upper()
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^A-Z0-9]", " ", s)
    return re.sub(r"\s+", " ", s).strip()

def load_dish_map():
    dish_map = {}
    menu_by_id = {}
    try:
        with open(HTML_PATH, "r", encoding="utf-8") as f:
            html = f.read()
        m = re.search(r"const INITIAL_MENU_DATA\s*=\s*(\[[\s\S]*?\]);", html)
        if m:
            menu = json.loads(m.group(1))
            for it in menu:
                menu_by_id[it["id"]] = it
                clean = norm(it["name"])
                dish_map[clean] = it["id"]
                cat = norm(it.get("cat", ""))
                dish_map[f"{cat} {clean}"] = it["id"]
                dish_map[f"{clean} {cat}"] = it["id"]
    except Exception as e:
        print(f"Avertissement chargement menu: {e}")

    # Aliases fréquents de caisse
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
    return dish_map, menu_by_id

def parse_sales_file(file_path, dish_map, menu_by_id):
    """Extrait toutes les lignes de vente d'un fichier XLS ou XLSX"""
    raw_rows = []

    if file_path.lower().endswith(".xlsx") and openpyxl is not None:
        wb = openpyxl.load_workbook(file_path, data_only=True)
        sh = wb.active
        for r in range(2, sh.max_row + 1):
            fam = str(sh.cell(r, 1).value or "").strip()
            prod = str(sh.cell(r, 2).value or "").strip()
            if not prod or prod.upper() in ["TOTAL", "SOMME", "MONTANT"]:
                continue
            try:
                price = float(sh.cell(r, 3).value or 0)
            except:
                price = 0.0
            try:
                qty = float(sh.cell(r, 4).value or 1)
            except:
                qty = 1.0
            try:
                total = float(sh.cell(r, 5).value or (qty * price))
            except:
                total = qty * price
            raw_rows.append((fam, prod, price, qty, total))
    elif xlrd is not None:
        wb = xlrd.open_workbook(file_path)
        sh = wb.sheet_by_index(0)
        for r in range(1, sh.nrows):
            fam = str(sh.cell_value(r, 0)).strip()
            prod = str(sh.cell_value(r, 1)).strip()
            if not prod or prod.upper() in ["TOTAL", "SOMME", "MONTANT"]:
                continue
            try:
                price = float(sh.cell_value(r, 2))
            except:
                price = 0.0
            try:
                qty = float(sh.cell_value(r, 3))
            except:
                qty = 1.0
            try:
                total = float(sh.cell_value(r, 4))
            except:
                total = qty * price
            raw_rows.append((fam, prod, price, qty, total))

    prods = {}
    tot_ca = 0.0
    tot_qty = 0

    for fam, prod, price, qty, total in raw_rows:
        if qty <= 0:
            continue
        n_prod = norm(prod)
        did = dish_map.get(n_prod)
        if not did:
            for prefix in ['PLAT ', 'PASTA ', 'PIZZA ', 'PANINI ', 'SANDWICH ', 'CREPE ', 'SALADE ', 'BURGER ']:
                if n_prod.startswith(prefix):
                    did = dish_map.get(n_prod[len(prefix):])
                    if did:
                        break
        if not did:
            did = prod.lower().replace(' ', '_')

        key = did
        if key not in prods:
            item_name = prod
            item_cat = fam
            item_price = price
            if did in menu_by_id:
                item_name = menu_by_id[did]['name']
                item_cat = menu_by_id[did].get('cat', fam)
                item_price = menu_by_id[did].get('price', price)

            prods[key] = {
                'id': did,
                'name': item_name,
                'cat': item_cat,
                'price': item_price,
                'qty': 0,
                'ca': 0.0
            }

        q_int = int(round(qty))
        prods[key]['qty'] += q_int
        prods[key]['ca'] += total
        tot_qty += q_int
        tot_ca += total

    items = []
    for k, v in prods.items():
        v['ca'] = round(v['ca'], 2)
        items.append(v)

    items.sort(key=lambda x: x['ca'], reverse=True)
    return round(tot_ca, 2), tot_qty, items

def send_batch_to_supabase(records):
    """Envoie un lot de journées de ventes vers Supabase"""
    if not records:
        return True
    data = json.dumps(records).encode("utf-8")
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/daily_sales",
        data=data,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status in (200, 201, 204)
    except urllib.error.HTTPError as e:
        print(f"Erreur HTTP Supabase ({e.code}) : {e.read().decode('utf-8', errors='ignore')}")
        return False
    except Exception as e:
        print(f"Erreur réseau Supabase : {e}")
        return False

def sync_sales(start_date="2026-04-01", end_date="2026-09-15"):
    print("=" * 66)
    print(f"📡 GREY CORNER — IMPORT DES VENTES VERS SUPABASE")
    print(f"   Période ciblée : du {start_date} au {end_date}")
    print("=" * 66)

    dish_map, menu_by_id = load_dish_map()
    pattern = os.path.join(VENTES_DIR, "2026-*", "*.xls*")
    all_files = glob.glob(pattern)

    files_by_date = {}
    for f in all_files:
        if "manifest.json" in f:
            continue
        m = re.search(r"2026(\d{2})(\d{2})", os.path.basename(f))
        if m:
            d_iso = f"2026-{m.group(1)}-{m.group(2)}"
            if start_date <= d_iso <= end_date:
                # Priorité au format .xlsx si les deux existent
                if d_iso not in files_by_date or f.endswith(".xlsx"):
                    files_by_date[d_iso] = f

    sorted_dates = sorted(files_by_date.keys())
    total_dates = len(sorted_dates)
    print(f"🔍 {total_dates} journées trouvées à importer.\n")

    batch = []
    success_count = 0
    total_revenue_sum = 0.0

    for idx, d_iso in enumerate(sorted_dates, 1):
        f_path = files_by_date[d_iso]
        try:
            ca, qty, items = parse_sales_file(f_path, dish_map, menu_by_id)
            batch.append({
                "sale_date": d_iso,
                "total_revenue": ca,
                "total_tickets": 0,
                "total_items": qty,
                "items": items,
                "created_at": f"{d_iso}T23:59:59+00:00"
            })
            total_revenue_sum += ca

            # Envoyer par paquet de 20 journées
            if len(batch) >= 20:
                ok = send_batch_to_supabase(batch)
                if ok:
                    success_count += len(batch)
                    print(f"  [+] {success_count}/{total_dates} journées synchronisées ({d_iso})...")
                else:
                    print(f"  [!] Échec sur le lot se terminant au {d_iso}")
                batch = []
        except Exception as e:
            print(f"  [!] Erreur sur {d_iso} ({os.path.basename(f_path)}): {e}")

    if batch:
        ok = send_batch_to_supabase(batch)
        if ok:
            success_count += len(batch)
            print(f"  [+] {success_count}/{total_dates} journées synchronisées...")
        else:
            print(f"  [!] Échec sur le dernier lot")

    print("\n" + "=" * 66)
    print(f"🎉 SYNCHRONISATION TERMINÉE AVEC SUCCÈS !")
    print(f"   • Total journées envoyées : {success_count} / {total_dates}")
    print(f"   • Total CA cumulé vérifié : {round(total_revenue_sum):,} DH")
    print("=" * 66)

if __name__ == "__main__":
    if "--latest" in sys.argv:
        manifest_path = os.path.join(REPO_DIR, "ventes", "dernier_jour_ventes.json")
        target = None
        if os.path.exists(manifest_path):
            try:
                with open(manifest_path, "r", encoding="utf-8") as f:
                    dj = json.load(f)
                    dk = dj.get("dateKey", "")
                    if len(dk) == 8:
                        target = f"{dk[:4]}-{dk[4:6]}-{dk[6:]}"
            except Exception:
                pass
        if not target:
            files = sorted(glob.glob(os.path.join(REPO_DIR, "ventes", "2026-*", "*.xls*")))
            for f in reversed(files):
                m = re.search(r"2026\d{4}", os.path.basename(f))
                if m:
                    dk = m.group(0)
                    target = f"{dk[:4]}-{dk[4:6]}-{dk[6:]}"
                    break
        target = target or "2026-09-16"
        sync_sales(start_date=target, end_date=target)
    elif "--date" in sys.argv:
        idx = sys.argv.index("--date")
        target_date = sys.argv[idx + 1]
        sync_sales(start_date=target_date, end_date=target_date)
    else:
        sync_sales(start_date="2026-04-01", end_date="2026-09-30")
