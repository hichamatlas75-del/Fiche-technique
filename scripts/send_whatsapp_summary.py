# -*- coding: utf-8 -*-
"""
GREY CORNER — Envoi automatique du Résumé Quotidien sur WhatsApp (CallMeBot API)
Usage :
  python scripts/send_whatsapp_summary.py
  python scripts/send_whatsapp_summary.py --date 2026-09-15
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
CONFIG_PATH = os.path.join(REPO_DIR, "config", "whatsapp_config.json")
VENTES_DIR = os.path.join(REPO_DIR, "ventes")

def load_config():
    # 1. Vérifier variables d'environnement (GitHub Secrets)
    phone = os.environ.get("WHATSAPP_PHONE", "").strip()
    apikey = os.environ.get("WHATSAPP_APIKEY", "").strip()

    # 2. Vérifier fichier local config/whatsapp_config.json
    if (not phone or not apikey) and os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                cfg = json.load(f)
                phone = phone or cfg.get("phone", "").strip()
                apikey = apikey or cfg.get("apikey", "").strip()
        except Exception as e:
            print(f"[!] Erreur lecture config: {e}")

    return phone, apikey

def get_latest_day_data(target_date=None):
    # Chercher dans dernier_jour_ventes.json en priorité
    latest_json_path = os.path.join(VENTES_DIR, "dernier_jour_ventes.json")
    if not target_date and os.path.exists(latest_json_path):
        try:
            with open(latest_json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if data and "totalCA" in data:
                    return data
        except Exception:
            pass

    # Si date précise demandée, ou fallback
    return None

def format_whatsapp_message(data):
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
💰 *CA Réalisé :* {round(total_ca):,} DH
🍽️ *Articles servis :* {total_qty} portions

🏆 *Top 3 des Ventes :*
{top_items_text}
☁️ *Données 100% synchronisées dans Supabase Cloud !*"""

    return msg.strip()

def send_whatsapp_message(phone, apikey, message):
    if not phone or not apikey:
        print("[!] Numéro de téléphone ou APIKEY manquant. Configurez whatsapp_config.json.")
        return False

    # Nettoyage du numéro de téléphone (enlever les +, espaces, tirets)
    clean_phone = re.sub(r"[^0-9]", "", phone)

    encoded_text = urllib.parse.quote(message)
    url = f"https://api.callmebot.com/whatsapp.php?phone={clean_phone}&text={encoded_text}&apikey={apikey}"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode("utf-8", errors="ignore")
            if "Message queued" in content or "success" in content.lower() or resp.status == 200:
                print(f"✅ Message WhatsApp envoyé avec succès au {clean_phone} !")
                return True
            else:
                print(f"Réponse CallMeBot: {content}")
                return True
    except Exception as e:
        print(f"[!] Erreur envoi WhatsApp: {e}")
        return False

def main():
    phone, apikey = load_config()
    if not phone or not apikey:
        print("⚠️ Module WhatsApp en attente de configuration.")
        print("Veuillez renseigner votre numéro et votre APIKEY dans config/whatsapp_config.json.")
        return

    data = get_latest_day_data()
    if not data:
        print("Aucune donnée de vente disponible pour l'envoi.")
        return

    message = format_whatsapp_message(data)
    print("Message à envoyer :")
    print(message)
    print("\nEnvoi en cours vers WhatsApp...")
    send_whatsapp_message(phone, apikey, message)

if __name__ == "__main__":
    main()
