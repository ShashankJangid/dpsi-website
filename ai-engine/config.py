import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent / ".env"
    load_dotenv(dotenv_path=env_path)
except ImportError:
    pass

# Company & Business Info
COMPANY_NAME = "Orange Future Tech"
COMPANY_TAGLINE = "Software Engineering & Electronics Solutions"
COMPANY_WEBSITE = "https://orangefuturetech.com"
COMPANY_EMAIL = "teams@orangefuturetech.com"

# API Keys & Services
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

# Email Settings (Resend / SMTP)
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "teams@orangefuturetech.com")

# Social Media Credentials
LINKEDIN_ACCESS_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN", "")
INSTAGRAM_ACCESS_TOKEN = os.getenv("INSTAGRAM_ACCESS_TOKEN", "")
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN", "")

# Database & Storage
DB_PATH = Path(__file__).parent / "audit_engine.db"
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Automation Cycle Interval (Seconds)
CHECK_INTERVAL_SECONDS = 3600  # Run hourly check
