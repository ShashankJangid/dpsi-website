#!/usr/bin/env node
/**
 * Doppler Sync Helper
 * Pulls latest secrets from Doppler API and updates local .env
 *
 * Usage:
 *   DOPPLER_TOKEN=dp.pt.xxx node scripts/doppler-sync.mjs [pull|push] [dev|prd|stg]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

const token = process.env.DOPPLER_TOKEN;
const action = process.argv[2] || 'pull';
const config = process.argv[3] || 'prd';
const project = 'dpsi-website';

if (!token) {
  console.error('❌ Error: DOPPLER_TOKEN environment variable is required.');
  console.error('Usage: DOPPLER_TOKEN="dp.pt.xxx" npm run doppler:pull');
  process.exit(1);
}

async function pullSecrets() {
  console.log(`🔄 Fetching secrets from Doppler [project: ${project}, config: ${config}]...`);
  const res = await fetch(`https://api.doppler.com/v3/configs/config/secrets?project=${project}&config=${config}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) {
    console.error('❌ Doppler API Error:', data.messages || data);
    process.exit(1);
  }

  const lines = [
    '# ============================================================',
    `# Synced from Doppler [${project} / ${config}] at ${new Date().toISOString()}`,
    '# ============================================================',
    ''
  ];

  for (const [key, item] of Object.entries(data.secrets)) {
    const val = item.computed !== undefined ? item.computed : item.raw;
    if (val.includes('\n') || val.includes(' ') || val.includes('"') || val.includes('$')) {
      lines.push(`${key}="${val.replace(/"/g, '\\"')}"`);
    } else {
      lines.push(`${key}="${val}"`);
    }
  }

  fs.writeFileSync(envPath, lines.join('\n') + '\n', 'utf-8');
  console.log(`✅ Successfully pulled ${Object.keys(data.secrets).length} secrets from Doppler into .env`);
}

async function pushSecrets() {
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found.');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  const secrets = {};
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.includes('=')) {
      const idx = line.indexOf('=');
      const k = line.substring(0, idx).trim();
      let v = line.substring(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      secrets[k] = v;
    }
  }

  console.log(`🚀 Pushing ${Object.keys(secrets).length} secrets to Doppler [${project} / ${config}]...`);
  const res = await fetch(`https://api.doppler.com/v3/configs/config/secrets?project=${project}&config=${config}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ secrets })
  });
  const data = await res.json();
  if (!data.success) {
    console.error('❌ Doppler API Error:', data.messages || data);
    process.exit(1);
  }
  console.log(`✅ Successfully uploaded secrets to Doppler [${config}]!`);
}

if (action === 'push') {
  pushSecrets();
} else {
  pullSecrets();
}
