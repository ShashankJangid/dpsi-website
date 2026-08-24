# ============================================================
# DPSI School SaaS — Doppler Secret Management Setup
# ============================================================
# GitHub Student Pack: FREE Team Plan
# Replaces raw .env files with encrypted, synced secret vault
#
# WHY DOPPLER:
# • No more emailing passwords or .env files during handover
# • Secrets auto-sync to Vercel / Azure / Render in 1 click
# • Full audit log of who changed what secret and when
# • Add school IT team members without sharing raw credentials
#
# ─────────────────────────────────────────────────────────
# STEP 1: Install Doppler CLI
# ─────────────────────────────────────────────────────────
#   macOS:   brew install dopplerhq/cli/doppler
#   Windows: winget install Doppler.Doppler
#   Linux:   curl -Ls --tlsv1.2 --proto '=https' --retry 3 \
#              https://cli.doppler.com/install.sh | sh
#
# STEP 2: Create Doppler Account (Free with Student Pack)
# ─────────────────────────────────────────────────────────
#   1. Go to: https://doppler.com/partners/github
#   2. Sign up with your GitHub Student account
#   3. Create a new project: "dpsi-website"
#   4. Create environments: dev, staging, production
#
# STEP 3: Add Your Secrets to Doppler
# ─────────────────────────────────────────────────────────
#   Run this once to push your existing .env to Doppler:
#
#     doppler login
#     doppler setup --project dpsi-website --config production
#     doppler secrets upload .env
#
#   Or add them manually in the Doppler web dashboard.
#
# STEP 4: Run Locally with Doppler (replaces .env)
# ─────────────────────────────────────────────────────────
#   Instead of: npm run dev
#   Use:        doppler run -- npm run dev
#
#   No .env file needed on your machine anymore!
#
# STEP 5: Connect Doppler to Vercel (Auto-Sync)
# ─────────────────────────────────────────────────────────
#   In Doppler Dashboard:
#   1. Go to Integrations → Vercel
#   2. Connect your Vercel account
#   3. Select project: dpsi-website
#   4. Map Doppler "production" → Vercel "Production"
#   5. Click "Sync" — secrets auto-push on every Doppler change
#
#   For Azure App Service:
#   1. Doppler Dashboard → Integrations → Azure App Service
#   2. Connect Azure subscription
#   3. Secrets sync automatically as App Settings
#
# STEP 6: Handover a Client's Secrets
# ─────────────────────────────────────────────────────────
#   When handing over to a school's IT team:
#   1. Doppler Dashboard → Project → Access → Add Member
#   2. Enter school IT email
#   3. Set role: "Admin" (can see & change secrets)
#   4. Done — no passwords emailed, full audit trail maintained
#
# ─────────────────────────────────────────────────────────
# DOPPLER SECRETS CHECKLIST (add all of these):
# ─────────────────────────────────────────────────────────
#   MONGODB_URI             ← MongoDB Atlas connection string
#   JWT_SECRET              ← 32+ character random hex string
#   ADMIN_USERNAME          ← CMS admin username
#   ADMIN_PASSWORD          ← CMS admin password
#   GROQ_API_KEY            ← Groq AI API key
#   ELEVENLABS_API_KEY      ← ElevenLabs voice API key
#   CLOUDINARY_CLOUD_NAME   ← Cloudinary cloud name
#   CLOUDINARY_API_KEY      ← Cloudinary API key
#   CLOUDINARY_API_SECRET   ← Cloudinary secret
#   SENTRY_DSN              ← Sentry backend DSN
#   VITE_SENTRY_DSN         ← Sentry frontend DSN
#   VITE_CONFIGCAT_SDK_KEY  ← ConfigCat SDK key (feature flags)
#
# COST: ₹0 / year (Student Pack Team Plan)
# ─────────────────────────────────────────────────────────
