import time
from db import init_db, log_action, get_recent_logs
from auditor import WebAuditor
from report_generator import ReportGenerator
from cold_outreach import ColdOutreachEngine
from social_engine import SocialEngine
from notifier import Notifier

class AutonomousBusinessAgent:
    """Master AI Orchestrator running 24/7 autonomous business operations."""

    def __init__(self):
        init_db()
        log_action("AgentCore", "INITIALIZE", "System Core", "SUCCESS")
        Notifier.send_telegram_alert("🚀 *ORANGE FUTURE TECH AUTONOMOUS AI ENGINE STARTED*")

    def run_lead_audit_pipeline(self, company_name: str, target_url: str, contact_email: str = None):
        """Runs lead audit, generates PDF report, sends cold outreach, and notifies owner."""
        print(f"\n==> [STEP 1] Running Web Health Audit for {company_name} ({target_url})...")
        audit_result = WebAuditor.audit_website(target_url, company_name)

        print(f"==> [STEP 2] Generating Technical Audit Report...")
        report_path = ReportGenerator.generate_audit_html_report(audit_result)

        print(f"==> [STEP 3] Sending Cold Email Outreach...")
        email = contact_email if contact_email else f"contact@{target_url.replace('https://', '').replace('http://', '').split('/')[0]}"
        ColdOutreachEngine.send_outreach_email(company_name, email, audit_result, report_path)

        Notifier.alert_lead_discovered(company_name, target_url, audit_result['bugs_found'], audit_result['score'])
        print(f"==> [COMPLETE] Pipeline execution finished for {company_name}.\n")

    def run_social_marketing_pipeline(self):
        """Generates and publishes daily marketing posts across platforms."""
        print("\n==> [SOCIAL PIPELINE] Running daily social media publisher...")
        for platform in ["linkedin", "twitter", "instagram"]:
            SocialEngine.publish_post(platform)

    def run_autonomous_cycle(self):
        """Master cycle combining marketing, auditing, email outreach, and logging."""
        print("==========================================================")
        print("  ORANGE FUTURE TECH - AUTONOMOUS BUSINESS ENGINE RUNNING  ")
        print("==========================================================")

        # 1. Run Lead Generation & Audit Pipeline on sample targets
        sample_targets = [
            {"company": "Shipmate Logistics", "url": "shipmatelogistics.in", "email": "info@shipmatelogistics.in"},
            {"company": "Apex Global Freight", "url": "apexglobalfreight.com", "email": "contact@apexglobalfreight.com"}
        ]

        for target in sample_targets:
            self.run_lead_audit_pipeline(target["company"], target["url"], target["email"])

        # 2. Run Social Marketing Pipeline
        self.run_social_marketing_pipeline()

        # 3. Print Recent Audit History
        print("\n==> [MASTER AUDIT LOG HISTORY]")
        logs = get_recent_logs(5)
        for log in logs:
            print(f"  [{log['timestamp']}] {log['agent_name']} -> {log['action_type']} ({log['status']})")

if __name__ == "__main__":
    agent = AutonomousBusinessAgent()
    agent.run_autonomous_cycle()
