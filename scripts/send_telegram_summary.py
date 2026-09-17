# -*- coding: utf-8 -*-
"""
GREY CORNER — Envoi automatique du Résumé Quotidien sur Telegram (Bot API officiel)
Usage :
  python scripts/send_telegram_summary.py
  python scripts/send_telegram_summary.py --date 2026-09-15
"""

import os
import sys
import glob
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

    return bot_token, chat_id

def get_latest_day_data(target_date=None):
    latest_json_path = os.path.join(VENTES_DIR, "dernier_jour_ventes.json")
    if not target_date and os.path.exists(latest_json_path):
        try:
            with open(latest_json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if data and "totalCA" in data:
                    return data
        except Exception:
            pass
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
        print("[!] Token ou Chat ID manquant. Configurez config/telegram_config.json.")
        return False

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }).encode("utf-8")

    try:
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            if res_data.get("ok"):
                print("✅ Message Telegram envoyé avec succès !")
                return True
            else:
                print(f"[!] Réponse Telegram: {res_data}")
                return False
    except Exception as e:
        print(f"[!] Erreur envoi Telegram: {e}")
        return False

def main():
    bot_token, chat_id = load_config()
    if not bot_token or not chat_id:
        print("⚠️ Module Telegram en attente de configuration.")
        print("Veuillez renseigner votre bot_token et chat_id dans config/telegram_config.json.")
        return

    data = get_latest_day_data()
    if not data:
        print("Aucune donnée de vente disponible pour l'envoi.")
        return

    message = format_telegram_message(data)
    print("Message à envoyer sur Telegram :")
    print(message)
    print("\nEnvoi en cours vers Telegram...")
    send_telegram_message(bot_token, chat_id, message)

if __name__ == "__main__":
    main()
