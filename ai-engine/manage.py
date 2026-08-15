import sys
import json
import sqlite3
from db import get_db, log_action
from config import RESEND_API_KEY, SENDER_EMAIL, DB_PATH
from auditor import WebAuditor
from report_generator import ReportGenerator
from cold_outreach import ColdOutreachEngine

def show_mode():
    print("\n==========================================================")
    print("           ORANGE FUTURE TECH - DISPATCH MODE             ")
    print("==========================================================")
    if RESEND_API_KEY and RESEND_API_KEY != "your_resend_api_key_here":
        print("🟢 CURRENT MODE: LIVE DISPATCH MODE (Real emails will be sent to target clients)")
        print(f"   Sender Address: {SENDER_EMAIL}")
    else:
        print("🟡 CURRENT MODE: SIMULATION / SANDBOX MODE (Emails are logged & tested, not sent to real inboxes)")
        print("   To switch to LIVE MODE: Add your free RESEND_API_KEY in ai-engine/.env")
    print("==========================================================\n")

def list_leads():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM leads ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    print("\n📊 ALL DISCOVERED & AUDITED LEADS:")
    print("-" * 80)
    print(f"{'ID':<4} | {'Company':<22} | {'Score':<6} | {'Status':<12} | {'Email':<25}")
    print("-" * 80)
    for r in rows:
        email_str = r['email'] if r['email'] else "N/A"
        print(f"{r['id']:<4} | {r['company_name']:<22} | {r['audit_score']}/100 | {r['status']:<12} | {email_str:<25}")
    print("-" * 80 + "\n")

def list_audit_logs(limit=15):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()

    print(f"\n📜 RECENT MASTER AUDIT LOGS (Last {limit} Actions):")
    print("-" * 85)
    print(f"{'Time':<20} | {'Agent':<15} | {'Action':<22} | {'Status':<10}")
    print("-" * 85)
    for r in rows:
        t_str = r['timestamp'].split('.')[0].replace("T", " ")
        print(f"{t_str:<20} | {r['agent_name']:<15} | {r['action_type']:<22} | {r['status']:<10}")
    print("-" * 85 + "\n")

def add_lead(company_name, website, email=None):
    if not email:
        email = f"contact@{website.replace('https://', '').replace('http://', '').split('/')[0]}"
    
    print(f"--> Auditing new lead: {company_name} ({website})...")
    audit_result = WebAuditor.audit_website(website, company_name)
    report_path = ReportGenerator.generate_audit_html_report(audit_result)
    
    print(f"--> Dispatching outreach to {email}...")
    ColdOutreachEngine.send_outreach_email(company_name, email, audit_result, report_path)
    print(f"✅ Lead {company_name} processed and logged successfully!\n")

def main():
    if len(sys.argv) < 2:
        show_mode()
        print("Available Commands:")
        print("  python3 manage.py mode                     - Check current Live vs Sandbox mode")
        print("  python3 manage.py leads                    - List all target leads & email status")
        print("  python3 manage.py logs                     - View live audit action logs")
        print("  python3 manage.py add <Company> <Url> [Email] - Audit & dispatch outreach to a new client")
        sys.exit(0)

    cmd = sys.argv[1].lower()
    if cmd == "mode":
        show_mode()
    elif cmd == "leads":
        list_leads()
    elif cmd == "logs":
        list_audit_logs()
    elif cmd == "add":
        if len(sys.argv) < 4:
            print("Usage: python3 manage.py add <Company Name> <Website URL> [Contact Email]")
        else:
            comp = sys.argv[2]
            url = sys.argv[3]
            email = sys.argv[4] if len(sys.argv) > 4 else None
            add_lead(comp, url, email)
    else:
        print(f"Unknown command '{cmd}'. Run 'python3 manage.py' for help.")

if __name__ == "__main__":
    main()
