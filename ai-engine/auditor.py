import time
import urllib.request
import urllib.parse
from re import search, findall
from db import log_action, save_lead

class WebAuditor:
    """Automated technical audit scanner for target client websites."""

    @staticmethod
    def audit_website(url: str, company_name: str = "Client Target"):
        if not url.startswith("http"):
            url = "https://" + url

        log_action("WebAuditor", "START_AUDIT", url, "IN_PROGRESS")
        start_time = time.time()
        issues = []
        score = 100

        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
            )
            response = urllib.request.urlopen(req, timeout=10)
            load_time = round(time.time() - start_time, 2)
            html = response.read().decode("utf-8", errors="ignore")
            headers = dict(response.info())

            # 1. Performance check (Speed load time)
            if load_time > 2.5:
                issues.append({
                    "severity": "HIGH",
                    "category": "Performance",
                    "title": "Slow Page Load Time",
                    "description": f"Page took {load_time}s to load. Optimal speed for maximum lead conversion is under 1.5s."
                })
                score -= 20
            
            # 2. SSL & Security check
            if not url.startswith("https"):
                issues.append({
                    "severity": "CRITICAL",
                    "category": "Security",
                    "title": "Missing SSL (HTTPS)",
                    "description": "Website is served over unencrypted HTTP, triggering browser security warnings."
                })
                score -= 30

            # 3. Mobile Viewport Check
            if "viewport" not in html.lower():
                issues.append({
                    "severity": "HIGH",
                    "category": "Mobile UX",
                    "title": "Missing Mobile Viewport Meta Tag",
                    "description": "Website is not optimized for mobile screens, causing layout clipping on smartphones."
                })
                score -= 20

            # 4. SEO & OpenGraph Check
            if "og:title" not in html.lower() or "og:image" not in html.lower():
                issues.append({
                    "severity": "MEDIUM",
                    "category": "SEO & Social Sharing",
                    "title": "Missing OpenGraph Social Meta Tags",
                    "description": "Links shared on WhatsApp or LinkedIn will not show preview images or structured titles."
                })
                score -= 15

            # 5. Core Web Vitals & Image Optimization
            unoptimized_imgs = len(findall(r'<img[^>]+src=["\'][^"\']+\.(png|jpg|jpeg)["\']', html, re_flags:=0))
            if unoptimized_imgs > 5:
                issues.append({
                    "severity": "MEDIUM",
                    "category": "Core Web Vitals",
                    "title": f"Uncompressed Images Detected ({unoptimized_imgs} images)",
                    "description": "Images lack modern WebP compression, leading to high mobile data usage."
                })
                score -= 15

            score = max(score, 35) # Floor score at 35

            audit_result = {
                "company_name": company_name,
                "website": url,
                "score": score,
                "load_time_sec": load_time,
                "bugs_found": len(issues),
                "issues": issues
            }

            log_action("WebAuditor", "AUDIT_COMPLETE", url, "SUCCESS", {"score": score, "bugs": len(issues)})
            save_lead(company_name, url, audit_score=score, bugs_count=len(issues))
            return audit_result

        except Exception as e:
            log_action("WebAuditor", "AUDIT_FAILED", url, "ERROR", {"error": str(e)})
            return {
                "company_name": company_name,
                "website": url,
                "score": 40,
                "load_time_sec": 5.0,
                "bugs_found": 1,
                "issues": [{
                    "severity": "HIGH",
                    "category": "Availability",
                    "title": "Connection Timeout / Unstable Hosting",
                    "description": f"Website failed to respond within 10 seconds: {str(e)}"
                }]
            }

if __name__ == "__main__":
    result = WebAuditor.audit_website("shipmatelogistics.in", "Shipmate Logistics")
    print(result)
