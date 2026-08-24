# ============================================================
# DPSI School SaaS — Cloudflare DNS Setup Guide
# ============================================================
# Free with GitHub Student Pack via Namecheap domain
# Cloudflare gives: Free SSL, DDoS, WebP CDN, Edge Caching
#
# STEP 1: Register Domain (One-time, Free with Student Pack)
# ─────────────────────────────────────────────────────────
# • Namecheap (namecheap.com/students): 1-year FREE .me domain
# • Name.com  (name.com/partner/github-students): FREE .live domain
#
# STEP 2: Add Domain to Cloudflare (Free)
# ─────────────────────────────────────────────────────────
# 1. Go to cloudflare.com → Sign Up Free
# 2. "Add a Site" → Enter your domain name (e.g. dpsindirapuram.me)
# 3. Select FREE plan
# 4. Cloudflare will scan your DNS — Click "Continue"
# 5. Copy Cloudflare Nameservers (e.g. ns1.cloudflare.com)
# 6. Go to Namecheap dashboard → Domain → Change Nameservers
#    → Custom → Paste both Cloudflare nameservers
#
# STEP 3: Add DNS Records in Cloudflare
# ─────────────────────────────────────────────────────────
# After Cloudflare is active, add these DNS records:
#
# TYPE    NAME     VALUE                              PROXY
# ─────────────────────────────────────────────────────────
# CNAME   @        dpsi-website.vercel.app            ✅ Proxied
# CNAME   www      dpsi-website.vercel.app            ✅ Proxied
# CNAME   api      dpsi-website.vercel.app            ✅ Proxied
#
# (Replace dpsi-website.vercel.app with your Azure/Render URL if using those)
#
# STEP 4: Enable Cloudflare Free Features
# ─────────────────────────────────────────────────────────
# In Cloudflare Dashboard → Your Domain:
#
# SSL/TLS:
#   • SSL Mode → "Full (strict)"
#   • Always Use HTTPS → ON
#   • Minimum TLS Version → 1.2
#
# Speed (Auto-Optimization):
#   • Auto Minify → JS ✅, CSS ✅, HTML ✅
#   • Brotli Compression → ON
#   • Polish (Image Optimization) → Lossless
#
# Security:
#   • Security Level → Medium
#   • Bot Fight Mode → ON
#   • Browser Integrity Check → ON
#
# Caching:
#   • Caching Level → Standard
#   • Browser Cache TTL → 4 hours
#   • Cache Rules → Cache everything for /assets/* (1 year)
#
# STEP 5: Multi-Client Subdomain Routing
# ─────────────────────────────────────────────────────────
# For each new school client, add a subdomain DNS record:
#
# CNAME   dpsi        dpsi-website.vercel.app    ✅ Proxied  (DPS Indirapuram)
# CNAME   goenka      dpsi-website.vercel.app    ✅ Proxied  (GD Goenka)
# CNAME   ryan        dpsi-website.vercel.app    ✅ Proxied  (Ryan International)
#
# The React frontend reads the hostname and sends x-tenant-id automatically.
#
# ─────────────────────────────────────────────────────────
# COST: ₹0 / year (Cloudflare Free Plan)
# ─────────────────────────────────────────────────────────
