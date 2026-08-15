import json
import urllib.request
from pathlib import Path
from config import RESEND_API_KEY, SENDER_EMAIL
from db import log_action
from notifier import Notifier

class ColdOutreachEngine:
    """Populates branded email templates and dispatches cold audit outreach."""

    @staticmethod
    def send_outreach_email(company_name: str, target_email: str, audit_data: dict, report_path: str = None):
        log_action("ColdOutreach", "DISPATCH_START", target_email, "IN_PROGRESS")
        
        score = audit_data.get("score", 70)
        bugs = audit_data.get("issues", [])
        top_bug = bugs[0]["title"] if bugs else "Page speed bottlenecks"

        # Subject line optimized for high open rates
        subject = f"Technical Audit Summary for {company_name} - Quick Feedback"

        # Populate custom HTML email body using Orange Future Tech branding
        html_body = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Technical Proposal - Orange Future Tech</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f9; padding: 30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; max-width: 600px; width: 100%;">
          <tr>
            <td style="background-color: #0b0f17; padding: 24px 40px; border-bottom: 4px solid #ff6b00;">
              <span style="font-size: 22px; font-weight: 800; color: #ffffff;">ORANGE <span style="color: #ff6b00;">FUTURE</span> TECH</span>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-top: 4px;">Software Engineering &amp; Electronics Solutions</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Technical Health Audit: {company_name}</h1>
              <p style="font-size: 14px; color: #334155; line-height: 1.6;">Dear <strong>{company_name} Engineering Team</strong>,</p>
              <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                Our automated engineering scanner completed a performance &amp; technical check for your web infrastructure. Overall technical health score: <strong>{score}/100</strong>.
              </p>
              
              <div style="background-color: #fff7ed; border-left: 4px solid #ff6b00; padding: 16px 20px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 700; color: #c2410c; text-transform: uppercase;">KEY DIAGNOSTIC FINDING</div>
                <div style="font-size: 13px; color: #9a3412; margin-top: 4px;">Detected: <strong>{top_bug}</strong>. Addressing this can improve user retention by up to 35%.</div>
              </div>

              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #ff6b00;">
                    <a href="https://orangefuturetech.com/portal" target="_blank" style="font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; display: inline-block;">View Complete Audit &amp; Schedule Call &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #334155;">Best regards,</p>
              <div style="font-size: 15px; font-weight: 700; color: #0f172a;">Engineering &amp; Solutions Team</div>
              <div style="font-size: 13px; color: #ff6b00; font-weight: 600;">Orange Future Tech</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>'''

        # Dispatch via Resend API if API key provided
        if RESEND_API_KEY:
            try:
                payload = json.dumps({
                    "from": SENDER_EMAIL,
                    "to": [target_email],
                    "subject": subject,
                    "html": html_body
                }).encode("utf-8")

                req = urllib.request.Request(
                    "https://api.resend.com/emails",
                    data=payload,
                    headers={
                        "Authorization": f"Bearer {RESEND_API_KEY}",
                        "Content-Type": "application/json"
                    }
                )
                urllib.request.urlopen(req, timeout=10)
                log_action("ColdOutreach", "DISPATCH_SUCCESS", target_email, "SUCCESS")
                Notifier.alert_email_sent(company_name, target_email, report_path)
                return True
            except Exception as e:
                log_action("ColdOutreach", "DISPATCH_FAILED", target_email, "ERROR", {"error": str(e)})
                Notifier.alert_email_sent(company_name, target_email, "Logged Local Sandbox Dispatch")
                return False
        else:
            log_action("ColdOutreach", "SIMULATED_DISPATCH", target_email, "SUCCESS", {"note": "Resend API key pending"})
            Notifier.alert_email_sent(company_name, target_email, "Simulated Dispatch Logged")
            return True

if __name__ == "__main__":
    ColdOutreachEngine.send_outreach_email("Shipmate Logistics", "info@shipmatelogistics.in", {"score": 68, "issues": [{"title": "Slow mobile page load speed"}]})
