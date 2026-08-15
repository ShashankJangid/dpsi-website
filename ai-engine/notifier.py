import json
import urllib.request
import urllib.parse
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
from db import log_action

class Notifier:
    """Dispatches real-time owner notifications via Telegram Bot API & Webhooks."""

    @staticmethod
    def send_telegram_alert(message: str) -> bool:
        if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
            print(f"--> [NOTIFIER LOG ONLY] {message}")
            log_action("Notifier", "LOG_ALERT", "Owner Phone", "SUCCESS", {"message": message})
            return True

        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = urllib.parse.urlencode({
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "Markdown"
        }).encode("utf-8")

        try:
            req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
            response = urllib.request.urlopen(req, timeout=8)
            log_action("Notifier", "TELEGRAM_ALERT_SENT", TELEGRAM_CHAT_ID, "SUCCESS")
            return True
        except Exception as e:
            log_action("Notifier", "TELEGRAM_ALERT_FAILED", TELEGRAM_CHAT_ID, "ERROR", {"error": str(e)})
            return False

    @staticmethod
    def alert_lead_discovered(company: str, website: str, bugs_count: int, score: int):
        msg = (
            f"🎯 *NEW LEAD DISCOVERED & AUDITED*\n\n"
            f"• *Company*: {company}\n"
            f"• *Website*: {website}\n"
            f"• *Health Score*: {score}/100\n"
            f"• *Issues Detected*: {bugs_count}\n\n"
            f"⚡ *Action*: Generating audit report & cold outreach email."
        )
        Notifier.send_telegram_alert(msg)

    @staticmethod
    def alert_email_sent(company: str, email: str, report_link: str = None):
        msg = (
            f"📩 *COLD OUTREACH DISPATCHED*\n\n"
            f"• *Recipient*: {company} ({email})\n"
            f"• *Status*: Delivered successfully\n"
            f"• *Audit Attached*: {report_link if report_link else 'HTML Report'}"
        )
        Notifier.send_telegram_alert(msg)

    @staticmethod
    def alert_prospect_reply(client_name: str, channel: str, content: str):
        msg = (
            f"🔥 *INCOMING LEAD RESPONSE ({channel.upper()})*\n\n"
            f"• *From*: {client_name}\n"
            f"• *Message*: \"{content}\"\n\n"
            f"👉 *AI Action*: Automated reply sent & calendar booking link dispatched."
        )
        Notifier.send_telegram_alert(msg)

if __name__ == "__main__":
    Notifier.alert_lead_discovered("Shipmate Logistics", "https://shipmatelogistics.in", 3, 68)
