#!/usr/bin/env node
// Scaffold a new metro site from this template using a metro.config.json
// (the keystone produced in frame-restoration-texas-v2/data/route-factory/).
// Substitutes the ~22 tokens derivable from config and REPORTS the remaining
// human-input tokens (brand/legal/owner/marketing) as a checklist — it does not
// invent brand copy. Dry-run by default; --apply writes.
//
// Usage:
//   node scaffold.mjs --config <metro.config.json> --out <dir> [--trade roofing] [--apply]

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const apply = args.includes('--apply');
const configPath = opt('--config');
const outDir = opt('--out');
const trade = opt('--trade', '');
if (!configPath || !outDir) {
  console.error('Usage: node scaffold.mjs --config <metro.config.json> --out <dir> [--trade roofing] [--apply]');
  process.exit(2);
}

const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const nap = cfg.nap || {}; const brand = cfg.brand || {}; const geo = cfg.geo || {};
const metro = cfg.metro || {}; const backend = cfg.backend || {};
const domainShort = (brand.domain || '').replace(/^www\./, '');
const ref = backend.supabaseProjectRef || '';
const cities = (cfg.cities || []).map(c => c.name);

// Tokens derivable from config (the deterministic substitutions).
const MAP = {
  BRAND_NAME: brand.name, DOMAIN: brand.domain, DOMAIN_SHORT: domainShort,
  EMAIL: brand.emailSender, OWNER_EMAIL: brand.emailSender,
  PHONE_DISPLAY: nap.phoneDisplay, PHONE: nap.phoneDisplay, OWNER_PHONE: nap.phoneDisplay,
  PHONE_E164: nap.phoneE164, PHONE_DIGITS: (nap.phoneE164 || '').replace(/\D/g, ''),
  ADDRESS: nap.streetAddress ? `${nap.streetAddress}, ${nap.addressLocality}, ${nap.addressRegion} ${nap.postalCode}` : undefined,
  CITY: nap.addressLocality, PRIMARY_CITY: nap.addressLocality,
  STATE: metro.stateCode, ZIP: nap.postalCode,
  LAT: geo.hqLat, LNG: geo.hqLng,
  SUPABASE_PROJECT_ID: ref, SUPABASE_ID: ref,
  SUPABASE_FUNCTION_URL: ref ? `https://${ref}.supabase.co/functions/v1` : undefined,
  SERVICE_AREA_LIST: cities.length ? cities.join(', ') : undefined,
  YEAR: String(new Date().getFullYear()),
  TRADE: trade || undefined,
};
const resolved = Object.fromEntries(Object.entries(MAP).filter(([, v]) => v !== undefined && v !== ''));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.vercel'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(html|js|json|xml|txt|md|css)$/.test(e.name) && e.name !== 'scaffold.mjs') out.push(p);
  }
  return out;
}

const srcRoot = path.dirname(new URL(import.meta.url).pathname);
const files = walk(srcRoot);
let subCount = 0;
const remaining = new Set();

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, tok) => {
    if (tok in resolved) { subCount++; return resolved[tok]; }
    remaining.add(tok); return m;
  });
  if (apply) {
    const rel = path.relative(srcRoot, file);
    const dest = path.join(outDir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, text);
  }
}

console.log(`${apply ? 'Wrote' : 'Dry-run'} scaffold for "${brand.name || metro.key}" → ${apply ? outDir : '(no write)'}`);
console.log(`Resolved from config: ${Object.keys(resolved).length} tokens, ${subCount} substitutions across ${files.length} files.`);
console.log(`  ${Object.keys(resolved).sort().join(', ')}`);
console.log(`\nNEEDS HUMAN INPUT (${remaining.size} tokens — brand/legal/owner/marketing, not in config):`);
console.log(`  ${[...remaining].sort().join(', ') || '(none)'}`);
if (!apply) console.log('\nRe-run with --apply to write the scaffolded site.');
