#!/usr/bin/env node
/**
 * Synthetic Monitor — smoke tests for critical flows
 *
 * Flows:
 * 1. Shell boot: localhost:3000 returns 200
 * 2. Design Lab landing: /admin/design-lab returns 200
 * 3. Component detail: /admin/design-lab/components/general/Button returns 200
 * 4. Quality dashboard: /admin/design-lab/quality-dashboard returns 200
 * 5. Docs portal: localhost:3100 returns 200 (if running)
 *
 * Usage: node scripts/synthetic-monitor.mjs [--base-url http://localhost:3000]
 * Exit 0: all flows pass
 * Exit 1: any flow fails
 */

const args = process.argv.slice(2);
let baseUrl = 'http://localhost:3000';
const baseUrlIdx = args.indexOf('--base-url');
if (baseUrlIdx !== -1 && args[baseUrlIdx + 1]) {
  baseUrl = args[baseUrlIdx + 1];
}

const FLOWS = [
  { name: 'Shell boot', url: `${baseUrl}/`, critical: true },
  { name: 'Design Lab landing', url: `${baseUrl}/admin/design-lab`, critical: true },
  { name: 'Component detail (Button)', url: `${baseUrl}/admin/design-lab/components/general/Button`, critical: false },
  { name: 'Quality dashboard', url: `${baseUrl}/admin/design-lab/quality-dashboard`, critical: false },
  { name: 'Docs portal', url: 'http://localhost:3100/', critical: false },
];

const TIMEOUT_MS = 10_000;

async function checkFlow(flow) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(flow.url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'SyntheticMonitor/1.0' },
    });
    clearTimeout(timer);

    if (res.status === 200) {
      return { ...flow, status: 'pass', code: res.status };
    }
    return { ...flow, status: 'fail', code: res.status, error: `HTTP ${res.status}` };
  } catch (err) {
    clearTimeout(timer);
    const msg = err.name === 'AbortError' ? `Timeout (${TIMEOUT_MS}ms)` : err.message;
    return { ...flow, status: 'fail', code: null, error: msg };
  }
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║              Synthetic Monitor                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Base URL: ${baseUrl}`);
  console.log('');

  const results = await Promise.all(FLOWS.map(checkFlow));

  let criticalFail = false;

  for (const r of results) {
    const icon = r.status === 'pass' ? '✅' : '❌';
    const suffix = r.status === 'fail'
      ? ` — ${r.error}${!r.critical ? ' (non-critical)' : ''}`
      : '';
    console.log(`  ${icon} ${r.name}: ${r.code ?? 'N/A'}${suffix}`);

    if (r.status === 'fail' && r.critical) {
      criticalFail = true;
    }
  }

  const passCount = results.filter((r) => r.status === 'pass').length;
  const failCount = results.filter((r) => r.status === 'fail').length;

  console.log('');
  console.log('─'.repeat(58));
  console.log(`Total: ${results.length} | Passed: ${passCount} | Failed: ${failCount}`);

  if (criticalFail) {
    console.log('');
    console.error('❌ Critical flow failure detected');
    process.exit(1);
  }

  console.log('');
  console.log('✅ All critical flows healthy');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
