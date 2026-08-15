import json
import random
from datetime import datetime
from db import log_action
from notifier import Notifier

class SocialEngine:
    """Autonomous Social Media Content Generator & Publishing Engine."""

    TOPICS = [
        "Why Sub-Millisecond Database Indexing Matters for Modern E-Commerce Platforms",
        "How We Built Hardware Access Control Systems for Institutional Research Centers",
        "Custom Multi-Layer PCB Design: From Schematic to High-Volume Production",
        "Optimizing Core Web Vitals: Reducing LCP from 4.2s to 0.8s for High Concurrency Web Apps",
        "Smart Industrial IoT Automation: ESP32 + LoRaWAN Telemetry Architecture"
    ]

    @staticmethod
    def generate_daily_content(platform: str = "linkedin") -> dict:
        topic = random.choice(SocialEngine.TOPICS)
        timestamp = datetime.now().strftime("%B %d, %Y")

        if platform == "linkedin":
            caption = (
                f"🚀 Engineering Deep-Dive ({timestamp})\n\n"
                f"{topic}.\n\n"
                f"At Orange Future Tech, we engineer scalable enterprise software, AI models, and custom PCB hardware solutions.\n\n"
                f"💡 Key Takeaway: Performance optimization isn't just about clean code—it's about hardware-software synergy.\n\n"
                f"Explore our case studies and live tech apps: https://orangefuturetech.com\n\n"
                f"#SoftwareEngineering #Electronics #IoT #WebDev #OrangeFutureTech"
            )
        elif platform == "twitter":
            caption = (
                f"⚡ {topic}.\n\n"
                f"Here's how Orange Future Tech scales enterprise software & PCB hardware platforms with sub-ms response times 👇\n"
                f"https://orangefuturetech.com #Tech #Engineering"
            )
        else: # instagram
            caption = (
                f"💡 {topic} | Orange Future Tech\n\n"
                f"Building high-performance digital platforms & electronics systems.\n\n"
                f"🌐 Visit orangefuturetech.com to view live deployments.\n"
                f"#Engineering #Software #Electronics #IoT"
            )

        log_action("SocialEngine", f"GENERATE_POST_{platform.upper()}", platform, "SUCCESS", {"topic": topic})
        return {"platform": platform, "topic": topic, "caption": caption, "created_at": timestamp}

    @staticmethod
    def publish_post(platform: str = "linkedin"):
        content = SocialEngine.generate_daily_content(platform)
        log_action("SocialEngine", f"PUBLISH_{platform.upper()}", platform, "SUCCESS", {"caption": content["caption"]})
        
        # Notify Owner
        Notifier.send_telegram_alert(
            f"📱 *AUTOMATED SOCIAL POST PUBLISHED ({platform.upper()})*\n\n"
            f"• *Topic*: {content['topic']}\n"
            f"• *Platform*: {platform.capitalize()}\n"
            f"• *Status*: Published to feed"
        )
        return content

if __name__ == "__main__":
    post = SocialEngine.publish_post("linkedin")
    print(post)
