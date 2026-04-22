#!/usr/bin/env node
/**
 * Proactive console/network error crawler for staging.
 *
 * 2026-04-19 QLTY-PROACTIVE-05: reworked to support multiple token
 * strategies. The v1 implementation minted tokens via `canary-load` which
 * does NOT carry the audience claims required by variant-service /
 * user-service / permission-service → every secured API returned 401 and
 * the crawler reported thousands of false positives.
 *
 * New flags (or env vars):
 *   TOKEN_STRATEGY    canary-load (legacy) | password-grant | env-token | anonymous
 *   KC_CLIENT_ID      defaults per strategy
 *   KC_CLIENT_SECRET  required for confidential clients
 *   KC_TOKEN          pre-minted bearer (strategy=env-token)
 *   KC_SCOPE          default "openid profile email"
 *
 * For variant-/user-/permission-/report-service audience coverage, use a
 * KC client with appropriate audience mappers. See:
 *   backend/scripts/ops/kc-provision-staging-sweeper.sh
 *
 * Usage examples:
 *   node web/scripts/ops/staging-console-crawler.mjs                    # canary-load (legacy default)
 *   TOKEN_STRATEGY=anonymous node web/scripts/ops/staging-console-crawler.mjs
 *   TOKEN_STRATEGY=password-grant KC_CLIENT_ID=staging-sweeper \
 *     KC_CLIENT_SECRET=xxx node web/scripts/ops/staging-console-crawler.mjs
 *   TOKEN_STRATEGY=env-token KC_TOKEN=eyJhbG... node web/scripts/ops/staging-console-crawler.mjs
 *
 * Writes report: .cache/reports/staging-console-crawler-<timestamp>.json
 */

import { chromium } from '@playwright/test';
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_URL = process.env.BASE_URL || 'https://ai.acik.com';
const KC_URL   = process.env.KC_URL   || 'https://ai.acik.com/realms/serban';
const ADMIN_USER = process.env.ADMIN_USER || 'admin@example.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'AdminPass2026';

const TOKEN_STRATEGY = (process.env.TOKEN_STRATEGY || 'canary-load').toLowerCase();
const KC_SCOPE = process.env.KC_SCOPE || 'openid profile email';
const KC_CLIENT_ID = process.env.KC_CLIENT_ID || '';
const KC_CLIENT_SECRET = process.env.KC_CLIENT_SECRET || '';
const KC_TOKEN = process.env.KC_TOKEN || '';

const ROUTES = [
  '/home',
  '/admin/reports',
  '/access',
  '/access/roles',
  '/reports',
  '/runtime/theme-matrix',
];

const CONSOLE_ALLOW = [
  /DevTools failed to load source map/i,
  /React DevTools/i,
  /webpage_content_reporter\.js/i,   // known browser-extension noise
];
const NETWORK_ALLOW = [/\/assets\/.*\.js$/];
const allowed = (txt, patterns) => patterns.some((p) => p.test(txt));

// ---------------------------------------------------------------------------
// Token strategies. Each returns { token, expiresIn } or throws.
// ---------------------------------------------------------------------------

async function mintCanaryLoadToken() {
  console.log('[crawler] strategy=canary-load (legacy; may miss service auds → false 401s)');
  const secret = execSync(
    `ssh staging-sw 'ADMIN_PASS=$(docker inspect platform-keycloak-1 --format "{{range .Config.Env}}{{println .}}{{end}}" | grep -E "^KEYCLOAK_ADMIN_PASSWORD=" | cut -d= -f2); MASTER=$(curl -s -X POST "http://localhost:8081/realms/master/protocol/openid-connect/token" -d "grant_type=password" -d "client_id=admin-cli" -d "username=admin" -d "password=$ADMIN_PASS" | python3 -c "import json,sys; print(json.load(sys.stdin).get(\\"access_token\\",\\"\\"))"); curl -s -H "Authorization: Bearer $MASTER" "http://localhost:8081/admin/realms/serban/clients/6ace51a1-7d07-4200-b192-8a5191f245e7/client-secret" | python3 -c "import json,sys; print(json.load(sys.stdin).get(\\"value\\",\\"\\"))"'`,
    { encoding: 'utf8' }
  ).trim();

  const tokenResp = execSync(
    `curl -s -X POST "${KC_URL}/protocol/openid-connect/token" -d grant_type=password -d client_id=canary-load -d client_secret='${secret}' -d username='${ADMIN_USER}' -d password='${ADMIN_PASS}'`,
    { encoding: 'utf8' }
  );
  const parsed = JSON.parse(tokenResp);
  if (!parsed.access_token) {
    throw new Error(`Token mint failed: ${tokenResp.slice(0, 200)}`);
  }
  return { token: parsed.access_token, expiresIn: parsed.expires_in || 3600 };
}

async function mintPasswordGrantToken() {
  if (!KC_CLIENT_ID) {
    throw new Error('TOKEN_STRATEGY=password-grant requires KC_CLIENT_ID');
  }
  console.log(`[crawler] strategy=password-grant client_id=${KC_CLIENT_ID} scope="${KC_SCOPE}"`);

  const form = [
    `grant_type=password`,
    `client_id=${encodeURIComponent(KC_CLIENT_ID)}`,
    `username=${encodeURIComponent(ADMIN_USER)}`,
    `password=${encodeURIComponent(ADMIN_PASS)}`,
    `scope=${encodeURIComponent(KC_SCOPE)}`,
  ];
  if (KC_CLIENT_SECRET) {
    form.push(`client_secret=${encodeURIComponent(KC_CLIENT_SECRET)}`);
  }
  const tokenResp = execSync(
    `curl -sS -X POST "${KC_URL}/protocol/openid-connect/token" -d "${form.join('&')}"`,
    { encoding: 'utf8' },
  );
  const parsed = JSON.parse(tokenResp);
  if (!parsed.access_token) {
    throw new Error(`password-grant token mint failed: ${tokenResp.slice(0, 200)}`);
  }
  // Decode aud for diagnostic.
  const [, body] = parsed.access_token.split('.');
  try {
    const claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud].filter(Boolean);
    console.log(`[crawler] token sub=${claims.sub} email=${claims.email} aud=[${aud.join(',')}]`);
  } catch {
    console.log('[crawler] could not decode token claims for diagnostic');
  }
  return { token: parsed.access_token, expiresIn: parsed.expires_in || 3600 };
}

function useEnvToken() {
  if (!KC_TOKEN) {
    throw new Error('TOKEN_STRATEGY=env-token requires KC_TOKEN');
  }
  console.log('[crawler] strategy=env-token (using pre-minted KC_TOKEN; skipping KC round-trip)');
  return { token: KC_TOKEN, expiresIn: 3600 };
}

async function resolveToken() {
  switch (TOKEN_STRATEGY) {
    case 'anonymous':
      console.log('[crawler] strategy=anonymous (no Authorization header will be set)');
      return { token: null, expiresIn: 0 };
    case 'env-token':
      return useEnvToken();
    case 'password-grant':
      return mintPasswordGrantToken();
    case 'canary-load':
    default:
      return mintCanaryLoadToken();
  }
}

// ---------------------------------------------------------------------------
// Crawl helpers (unchanged from v1).
// ---------------------------------------------------------------------------

async function crawlRoute(page, baseUrl, path) {
  const consoleErrors = [];
  const consoleWarns = [];
  const netFails = [];
  let runtimeErrors = [];
  let navStatus = null;

  const onConsole = (msg) => {
    const t = msg.type();
    if (t !== 'error' && t !== 'warning') return;
    const text = msg.text();
    if (allowed(text, CONSOLE_ALLOW)) return;
    const rec = { text, location: msg.location()?.url };
    if (t === 'error') consoleErrors.push(rec);
    else consoleWarns.push(rec);
  };
  const onResponse = (res) => {
    const status = res.status();
    if (status < 400) return;
    const url = res.url();
    if (allowed(url, NETWORK_ALLOW)) return;
    netFails.push({ method: res.request().method(), url, status });
  };

  page.on('console', onConsole);
  page.on('response', onResponse);

  const started = Date.now();
  try {
    await page.evaluate(() => {
      if (Array.isArray(window.__shellRuntimeErrors)) {
        window.__shellRuntimeErrors = [];
      }
    }).catch(() => {});
    const resp = await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle', timeout: 20_000 });
    navStatus = resp?.status() ?? null;
    await page.waitForTimeout(2_000);
    runtimeErrors = await page.evaluate(() => {
      const buffer = Array.isArray(window.__shellRuntimeErrors) ? window.__shellRuntimeErrors : [];
      return JSON.parse(JSON.stringify(buffer));
    }).catch(() => []);
  } catch (err) {
    consoleErrors.push({ text: `navigation_failed: ${err.message}` });
  } finally {
    page.off('console', onConsole);
    page.off('response', onResponse);
  }

  return {
    path,
    navStatus,
    consoleErrors,
    consoleWarns,
    netFails,
    runtimeErrors,
    durationMs: Date.now() - started,
  };
}

async function main() {
  const { token, expiresIn } = await resolveToken();
  const expiresAt = token ? Date.now() + expiresIn * 1000 : 0;
  console.log(`[crawler] token acquired (len=${token ? token.length : 0}, expiresIn=${expiresIn}s)`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Prime origin so we can seed localStorage.
  await page.goto(`${BASE_URL}/home`, { waitUntil: 'domcontentloaded', timeout: 20_000 }).catch(() => {});

  if (token) {
    await page.addInitScript(({ token, expiresAt }) => {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiresAt', String(expiresAt));
      } catch {}
    }, { token, expiresAt });
    // Explicit set in case initScript didn't run yet.
    await page.evaluate(
      ({ token, expiresAt }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiresAt', String(expiresAt));
      },
      { token, expiresAt }
    );
  } else {
    // Anonymous: ensure any prior token is cleared.
    await page.evaluate(() => {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiresAt');
      } catch {}
    });
  }

  const reports = [];
  for (const p of ROUTES) {
    console.log(`[crawler] → ${p}`);
    const r = await crawlRoute(page, BASE_URL, p);
    reports.push(r);
    console.log(`            status=${r.navStatus} consoleErrors=${r.consoleErrors.length} netFails=${r.netFails.length} (${r.durationMs}ms)`);
  }

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    baseURL: BASE_URL,
    admin: token ? ADMIN_USER : null,
    tokenStrategy: TOKEN_STRATEGY,
    kcClientId: KC_CLIENT_ID || null,
    totals: {
      routes: reports.length,
      withErrors: reports.filter((r) => r.consoleErrors.length > 0 || r.netFails.some((f) => f.status >= 500)).length,
      consoleErrors: reports.reduce((s, r) => s + r.consoleErrors.length, 0),
      consoleWarnings: reports.reduce((s, r) => s + r.consoleWarns.length, 0),
      netFailures: reports.reduce((s, r) => s + r.netFails.length, 0),
      runtimeErrors: reports.reduce((s, r) => s + r.runtimeErrors.length, 0),
    },
    reports,
  };

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = resolve(process.cwd(), '..', '.cache', 'reports');
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, `staging-console-crawler-${ts}.json`);
  writeFileSync(outPath, JSON.stringify(summary, null, 2));

  console.log('\n=== CRAWLER SUMMARY ===');
  console.log(`strategy:           ${TOKEN_STRATEGY}`);
  console.log(`total routes:       ${summary.totals.routes}`);
  console.log(`routes with errors: ${summary.totals.withErrors}`);
  console.log(`console errors:     ${summary.totals.consoleErrors}`);
  console.log(`console warnings:   ${summary.totals.consoleWarnings}`);
  console.log(`network failures:   ${summary.totals.netFailures}`);
  console.log(`runtime errors:     ${summary.totals.runtimeErrors}`);
  console.log(`report:             ${outPath}`);

  if (summary.totals.withErrors > 0) {
    console.log('\n--- Routes with errors ---');
    for (const r of reports) {
      if (r.consoleErrors.length === 0 && r.runtimeErrors.length === 0 && r.netFails.every((f) => f.status < 500)) continue;
      console.log(`\n[${r.path}]`);
      r.consoleErrors.forEach((e) => console.log(`  console.error: ${e.text.slice(0, 200)}`));
      r.runtimeErrors.forEach((e) => console.log(`  runtime.error: ${e.source} ${String(e.message).slice(0, 200)}`));
      r.netFails.filter((f) => f.status >= 400).forEach((f) => console.log(`  ${f.status} ${f.method} ${f.url}`));
    }
    process.exitCode = 1;
  } else {
    console.log('\nNo errors on any crawled route.');
  }
}

main().catch((err) => {
  console.error('[crawler] fatal:', err);
  process.exit(2);
});
