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

    top_items_text = ""
    for idx, it in enumerate(items[:3], 1):
        medal = ["1️⃣", "2️⃣", "3️⃣"][idx - 1]
        top_items_text += f"{medal} {it.get('name', 'Article')} ({it.get('qty', 0)} vendus — {round(it.get('ca', 0)):,} DH)\n"

    msg = f"""☕ *GREY CORNER — Clôture du {date_str}*
━━━━━━━━━━━━━━━━━━━━
💰 *CA Réalisé :* `{round(total_ca):,} DH`
🍽️ *Articles servis :* `{total_qty} portions`

🏆 *Top 3 des Ventes :*
{top_items_text}
☁️ _Données 100% synchronisées dans Supabase & Google Looker Studio !_"""

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
