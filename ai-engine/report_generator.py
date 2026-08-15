import os
import json
from pathlib import Path
from db import log_action

class ReportGenerator:
    """Generates executive technical audit reports and sales growth brochures."""

    @staticmethod
    def generate_audit_html_report(audit_result: dict, output_dir: Path = None):
        if not output_dir:
            output_dir = Path(__file__).parent / "reports"
        output_dir.mkdir(parents=True, exist_ok=True)

        company = audit_result.get("company_name", "Target Business")
        url = audit_result.get("website", "")
        score = audit_result.get("score", 70)
        issues = audit_result.get("issues", [])
        
        safe_name = "".join(c for c in company if c.isalnum() or c in (" ", "_")).rstrip().replace(" ", "_").lower()
        file_path = output_dir / f"audit_report_{safe_name}.html"

        # Color rating based on score
        score_color = "#16a34a" if score >= 80 else ("#d97706" if score >= 60 else "#dc2626")

        issues_html = ""
        for idx, item in enumerate(issues, 1):
            severity_bg = "#fee2e2" if item["severity"] == "CRITICAL" or item["severity"] == "HIGH" else "#fef3c7"
            severity_color = "#dc2626" if item["severity"] == "CRITICAL" or item["severity"] == "HIGH" else "#b45309"
            
            issues_html += f'''
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-weight: 700; font-size: 15px; color: #0f172a;">{idx}. {item['title']}</div>
                    <span style="background: {severity_bg}; color: {severity_color}; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">
                        {item['severity']} • {item['category']}
                    </span>
                </div>
                <div style="font-size: 13px; color: #475569; line-height: 1.5;">{item['description']}</div>
            </div>
            '''

        html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Technical Audit & Growth Strategy - {company}</title>
    <style>
        body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #f4f6f9; color: #1e293b; margin: 0; padding: 40px 20px; }}
        .card {{ max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }}
        .header {{ background: #0b0f17; padding: 32px 40px; border-bottom: 4px solid #ff6b00; }}
        .brand {{ font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1px; }}
        .brand span {{ color: #ff6b00; }}
        .sub {{ font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; }}
        .content {{ padding: 40px; }}
        .score-box {{ background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 28px; }}
        .score-num {{ font-size: 42px; font-weight: 800; color: {score_color}; }}
        .footer {{ background: #0b0f17; padding: 24px 40px; text-align: center; font-size: 12px; color: #94a3b8; }}
        .btn {{ display: inline-block; background: #ff6b00; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 20px; }}
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <div class="brand">ORANGE <span>FUTURE</span> TECH</div>
            <div class="sub">Software Engineering &amp; Electronics Solutions</div>
        </div>
        <div class="content">
            <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
                Technical Audit &amp; Optimization Blueprint
            </h1>
            <div style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
                Prepared for: <strong>{company}</strong> ({url})
            </div>

            <div class="score-box">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Overall Technical Health Score</div>
                <div class="score-num">{score} / 100</div>
                <div style="font-size: 12px; color: #475569; margin-top: 4px;">Detected {len(issues)} critical area(s) affecting performance &amp; user conversion</div>
            </div>

            <h2 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Detailed Technical Diagnostics</h2>
            {issues_html}

            <div style="background: #fff7ed; border-left: 4px solid #ff6b00; padding: 16px 20px; border-radius: 4px; margin-top: 28px;">
                <div style="font-size: 12px; font-weight: 700; color: #c2410c; text-transform: uppercase; margin-bottom: 4px;">Recommended Next Steps</div>
                <div style="font-size: 13px; color: #9a3412; line-height: 1.5;">
                    Orange Future Tech offers a complimentary 20-minute technical roadmap session to resolve these issues and optimize your digital infrastructure.
                </div>
                <a href="https://orangefuturetech.com/portal" class="btn">Schedule Free Strategy Call &rarr;</a>
            </div>
        </div>
        <div class="footer">
            Official Web: orangefuturetech.com | Email: teams@orangefuturetech.com<br>
            &copy; Orange Future Tech. All rights reserved.
        </div>
    </div>
</body>
</html>'''

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        log_action("ReportGenerator", "CREATE_REPORT", company, "SUCCESS", {"file_path": str(file_path)})
        return str(file_path)

if __name__ == "__main__":
    test_data = {
        "company_name": "Shipmate Logistics",
        "website": "https://shipmatelogistics.in",
        "score": 68,
        "issues": [
            {"severity": "HIGH", "category": "Performance", "title": "Slow Page Load Speed", "description": "Page takes 3.4 seconds to render on mobile devices."},
            {"severity": "MEDIUM", "category": "SEO", "title": "Missing Social Meta Tags", "description": "WhatsApp link previews lack custom image banners."}
        ]
    }
    path = ReportGenerator.generate_audit_html_report(test_data)
    print(f"Report generated at: {path}")
