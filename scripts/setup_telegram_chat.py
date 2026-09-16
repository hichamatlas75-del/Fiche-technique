# -*- coding: utf-8 -*-
import os
import json
import urllib.request

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(REPO_DIR, "config", "telegram_config.json")

def check_and_save():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    tok = cfg.get("bot_token")
    if not tok:
        print("Token manquant")
        return None

    url = f"https://api.telegram.org/bot{tok}/getUpdates"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    results = data.get("result", [])
    if not results:
        print("En attente du clic 'Démarrer' sur le bot...")
        return None

    latest_msg = results[-1]
    chat = latest_msg.get("message", {}).get("chat", {})
    chat_id = chat.get("id")
    user_name = chat.get("first_name", "")

    if chat_id:
        cfg["chat_id"] = str(chat_id)
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2)
        print(f"✅ Chat ID {chat_id} ({user_name}) détecté et enregistré avec succès !")
        return str(chat_id)
    return None

if __name__ == "__main__":
    check_and_save()
