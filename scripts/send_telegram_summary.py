# -*- coding: utf-8 -*-
"""
GREY CORNER — Envoi automatique du Résumé Quotidien sur Telegram (Bot API officiel)
Usage :
  python scripts/send_telegram_summary.py
  python scripts/send_telegram_summary.py --date 2026-10-15
  python scripts/send_telegram_summary.py --date 20261016
  python scripts/send_telegram_summary.py --catchup 2026-10-15 2026-10-16
"""

import os
import sys
import glob
import re
import json
import urllib.request
import urllib.parse

try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(REPO_DIR, "config", "telegram_config.json")
VENTES_DIR = os.path.join(REPO_DIR, "ventes")

# Identifiants de repli (SSOT bot Grey Corner)
DEFAULT_BOT_TOKEN = "8486156814:AAGcve2m4GkkvaH-J4N9SU2XaBnZJ0wv-LM"
DEFAULT_CHAT_ID = "1168694845"

def load_config():
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()

    if (not bot_token or not chat_id) and os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                cfg = json.load(f)
                bot_token = bot_token or cfg.get("bot_token", "").strip()
                chat_id = chat_id or cfg.get("chat_id", "").strip()
        except Exception as e:
            print(f"[!] Erreur lecture config Telegram: {e}")

    # Fallback automatique garanti pour exécution GitHub Actions et locale
    bot_token = bot_token or DEFAULT_BOT_TOKEN
    chat_id = chat_id or DEFAULT_CHAT_ID

    return bot_token, chat_id

def parse_sales_excel(file_path):
    if not os.path.exists(file_path):
        return None
    try:
        import xlrd
    except ImportError:
        print("[!] xlrd n'est pas disponible pour lire le fichier Excel.")
        return None

    d_match = re.search(r'(\d{8})', os.path.basename(file_path))
    date_key = d_match.group(1) if d_match else ""
    months_fr = {
        '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril',
        '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août',
        '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre'
    }
    friendly_date = date_key
    if len(date_key) == 8:
        yr = date_key[:4]
        m_code = date_key[4:6]
        d = date_key[6:8]
        friendly_date = f"{int(d)} {months_fr.get(m_code, m_code)} {yr}"

    wb = xlrd.open_workbook(file_path)
    sh = wb.sheet_by_index(0)

    aggregated = {}
    for r in range(1, sh.nrows):
        fam = str(sh.cell_value(r, 0)).strip()
        prod = str(sh.cell_value(r, 1)).strip()
        if not prod or prod.upper() in ['TOTAL', 'SOMME', 'MONTANT']:
            continue
        try:
            price = float(sh.cell_value(r, 2))
        except Exception:
            price = 0.0
        try:
            qty = float(sh.cell_value(r, 3))
        except Exception:
            qty = 1.0
        try:
            total = float(sh.cell_value(r, 4))
        except Exception:
            total = qty * price

        if qty <= 0 or (price <= 0 and total <= 0):
            continue

        key = prod.strip().upper()
        if key not in aggregated:
            aggregated[key] = {
                'name': prod.strip(),
                'cat': fam.strip() or "DIVERS",
                'price': price,
                'qty': 0,
                'ca': 0.0
            }
        aggregated[key]['qty'] += int(round(qty))
        aggregated[key]['ca'] += total

    items_report = []
    total_ca = 0
    total_qty = 0
    for key, it in aggregated.items():
        ca = int(round(it['ca']))
        q = it['qty']
        total_ca += ca
        total_qty += q
        items_report.append({
            'name': it['name'],
            'cat': it['cat'],
            'price': it['price'],
            'qty': q,
            'ca': ca
        })
    items_report.sort(key=lambda x: x['ca'], reverse=True)

    return {
        'date': friendly_date,
        'dateKey': date_key,
        'fileName': os.path.basename(file_path),
        'totalCA': total_ca,
        'totalQty': total_qty,
        'totalItems': len(items_report),
        'items': items_report
    }

def get_day_data(target_date=None, target_file=None):
    if target_file and os.path.exists(target_file):
        return parse_sales_excel(target_file)

    if target_date:
        clean_date = target_date.replace("-", "").strip()
        pattern = os.path.join(VENTES_DIR, "**", f"*{clean_date}*.xls*")
        matches = glob.glob(pattern, recursive=True)
        fin_matches = [m for m in matches if "fin" in os.path.basename(m).lower() and not m.endswith(".json")]
        chosen_file = fin_matches[0] if fin_matches else (matches[0] if matches else None)
        if chosen_file:
            return parse_sales_excel(chosen_file)
        print(f"[!] Aucun fichier de vente trouvé pour la date {target_date}.")
        return None

    # Par défaut : lire dernier_jour_ventes.json
    latest_json_path = os.path.join(VENTES_DIR, "dernier_jour_ventes.json")
    if os.path.exists(latest_json_path):
        try:
            with open(latest_json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if data and "totalCA" in data:
                    return data
        except Exception:
            pass

    # Si dernier_jour_ventes.json n'existe pas, chercher le fichier le plus récent dans ventes/
    pattern = os.path.join(VENTES_DIR, "20*-*", "*.xls*")
    all_files = []
    for f in glob.glob(pattern):
        if "manifest.json" in f:
            continue
        lower = f.lower()
        if "2026-01" in lower or "2026-02" in lower or "2026-03" in lower:
            continue
        d_match = re.search(r'(\d{8})', os.path.basename(f))
        if d_match:
            all_files.append((d_match.group(1), f))
    if all_files:
        all_files.sort(key=lambda x: x[0])
        return parse_sales_excel(all_files[-1][1])

    return None

def format_telegram_message(data):
    date_str = data.get("date", "Aujourd'hui")
    total_ca = data.get("totalCA", 0)
    total_qty = data.get("totalQty", 0)
    items = data.get("items", [])

    avg_price = (total_ca / total_qty) if total_qty > 0 else 0

    # Agrégation par Famille / Catégorie
    by_cat = {}
    for it in items:
        cat = it.get("cat", "DIVERS").strip().upper()
        if not cat:
            cat = "DIVERS"
        if cat not in by_cat:
            by_cat[cat] = {"ca": 0.0, "qty": 0}
        by_cat[cat]["ca"] += it.get("ca", 0)
        by_cat[cat]["qty"] += it.get("qty", 0)

    # Top 5 Familles du jour
    sorted_cats = sorted(by_cat.items(), key=lambda x: x[1]["ca"], reverse=True)[:5]
    top_cats_text = ""
    for idx, (c_name, c_data) in enumerate(sorted_cats, 1):
        c_ca = round(c_data["ca"])
        c_q = c_data["qty"]
        pct = round((c_data["ca"] / total_ca * 100)) if total_ca > 0 else 0
        top_cats_text += f"{idx}. *{c_name}* : `{c_ca:,} DH` ({c_q} portions — {pct}%)\n"

    # Trouver la Star Boisson et la Star Food
    drink_keywords = ["BOISSON", "CAFE", "CAFÉ", "THE", "THÉ", "JUS", "SODA", "MOJITO", "COCKTAIL", "EAU", "MILKSHAKE", "BAR", "ICE"]
    star_drink = None
    star_food = None

    for it in items:
        cat_upper = it.get("cat", "").upper()
        is_drink = any(k in cat_upper for k in drink_keywords)
        if is_drink and not star_drink:
            star_drink = it
        elif not is_drink and not star_food:
            star_food = it
        if star_drink and star_food:
            break

    stars_text = ""
    if star_food:
        stars_text += f"🍽️ *Star Food :* {star_food['name']} ({star_food['qty']} vendus — `{round(star_food['ca']):,} DH`)\n"
    if star_drink:
        stars_text += f"☕ *Star Boisson :* {star_drink['name']} ({star_drink['qty']} vendus — `{round(star_drink['ca']):,} DH`)\n"

    looker_url = "https://lookerstudio.google.com/reporting/c41210bf-df18-4e25-999c-e30e8e7f896b"

    msg = f"""☕ *GREY CORNER — Clôture du {date_str}*
━━━━━━━━━━━━━━━━━━━━
💵 *Chiffre d'Affaires :* `{round(total_ca):,} DH`
📦 *Volume servi :* `{total_qty} articles`
🧾 *Prix moyen / article :* `{round(avg_price, 1)} DH`

🏷️ *TOP 5 FAMILLES DU JOUR :*
{top_cats_text}
⭐ *PRODUITS PHARES :*
{stars_text}
📊 [Ouvrir le Dashboard Looker Studio]({looker_url})
☁️ _Données 100% synchronisées Supabase_"""

    return msg.strip()

def send_telegram_message(bot_token, chat_id, message):
    if not bot_token or not chat_id:
        print("[!] Token ou Chat ID manquant.")
        return False

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    # Tentative 1 : avec formatage Markdown
    try:
        payload = json.dumps({
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }).encode("utf-8")

        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            if res_data.get("ok"):
                print("✅ Message Telegram envoyé avec succès (Markdown) !")
                return True
    except Exception as e:
        print(f"[!] Échec envoi Markdown ({e}), tentative en texte brut...")

    # Tentative 2 : Fallback texte brut (en cas de caractère spécial non supporté par le parser)
    try:
        clean_text = message.replace('*', '').replace('`', '').replace('_', '')
        payload = json.dumps({
            "chat_id": chat_id,
            "text": clean_text
        }).encode("utf-8")

        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            if res_data.get("ok"):
                print("✅ Message Telegram envoyé avec succès (fallback brut) !")
                return True
            else:
                print(f"[!] Réponse Telegram: {res_data}")
                return False
    except Exception as e:
        print(f"[!] Erreur envoi Telegram: {e}")
        return False

def send_single_report(bot_token, chat_id, target_date=None, target_file=None):
    data = get_day_data(target_date=target_date, target_file=target_file)
    if not data:
        print(f"[!] Aucune donnée de vente disponible pour target_date={target_date}.")
        return False

    message = format_telegram_message(data)
    print(f"\n--- Message pour {data.get('date', 'N/A')} ---")
    print(message)
    print(f"Envoi en cours vers Telegram ({chat_id})...")
    return send_telegram_message(bot_token, chat_id, message)

def main():
    bot_token, chat_id = load_config()
    if not bot_token or not chat_id:
        print("⚠️ Module Telegram non configuré.")
        return

    # Gestion des arguments CLI
    target_date = None
    target_file = None
    catchup_dates = []

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--date" and i + 1 < len(args):
            target_date = args[i + 1]
            i += 2
        elif args[i] == "--file" and i + 1 < len(args):
            target_file = args[i + 1]
            i += 2
        elif args[i] == "--catchup":
            i += 1
            while i < len(args) and not args[i].startswith("--"):
                catchup_dates.append(args[i])
                i += 1
        else:
            i += 1

    if catchup_dates:
        print(f"Rattrapage demandé pour {len(catchup_dates)} date(s) : {catchup_dates}")
        for d in catchup_dates:
            send_single_report(bot_token, chat_id, target_date=d)
    else:
        send_single_report(bot_token, chat_id, target_date=target_date, target_file=target_file)

if __name__ == "__main__":
    main()
