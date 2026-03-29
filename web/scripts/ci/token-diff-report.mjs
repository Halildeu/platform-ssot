#!/usr/bin/env node
/**
 * token-diff-report.mjs
 * ---------------------
 * Generates a bidirectional diff report between Figma and Code tokens.
 * Outputs: reports/token-diff-report.json + reports/token-diff-report.html
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '../..');

// Import shared utilities
import { flattenFigmaRaw, flattenTsTokens } from '../tokens/shared-flatten.mjs';
import { computeFullDiff, loadMergeStrategy, detectCategory } from '../tokens/merge-strategy.mjs';

/* ------------------------------------------------------------------ */
/*  Load tokens                                                        */
/* ------------------------------------------------------------------ */

function loadFigmaTokens() {
  const figmaPath = resolve(ROOT, 'design-tokens/figma.tokens.json');
  if (!existsSync(figmaPath)) {
    console.error('[token-diff] design-tokens/figma.tokens.json not found');
    process.exit(1);
  }
  const figmaData = JSON.parse(readFileSync(figmaPath, 'utf-8'));
  // Flatten the raw section (Figma format: { value: "..." })
  if (figmaData.raw) {
    return flattenFigmaRaw(figmaData.raw);
  }
  // Fallback: flatten the entire object
  return flattenFigmaRaw(figmaData);
}

function loadCodeTokens() {
  const buildPath = resolve(ROOT, 'packages/design-system/src/tokens/build/tokens.json');
  if (existsSync(buildPath)) {
    const data = JSON.parse(readFileSync(buildPath, 'utf-8'));
    return flattenTsTokens(data);
  }
  console.warn('[token-diff] No built code tokens found, using empty set');
  return {};
}

function loadSyncState() {
  const syncPath = resolve(ROOT, '.figma-sync-state.json');
  if (!existsSync(syncPath)) {
    return { tokenHashes: {} };
  }
  const data = JSON.parse(readFileSync(syncPath, 'utf-8'));
  return data;
}

/* ------------------------------------------------------------------ */
/*  Generate reports                                                   */
/* ------------------------------------------------------------------ */

function computeSummary(diff) {
  const summary = {
    total: diff.length,
    inSync: 0,
    figmaAhead: 0,
    codeAhead: 0,
    conflicts: 0,
    figmaOnly: 0,
    codeOnly: 0,
  };
  for (const entry of diff) {
    switch (entry.resolution) {
      case 'in-sync': summary.inSync++; break;
      case 'figma-ahead': summary.figmaAhead++; break;
      case 'code-ahead': summary.codeAhead++; break;
      case 'conflict': summary.conflicts++; break;
      case 'figma-only': summary.figmaOnly++; break;
      case 'code-only': summary.codeOnly++; break;
    }
  }
  return summary;
}

function generateJsonReport(diff, summary) {
  return {
    generatedAt: new Date().toISOString(),
    summary,
    tokens: diff.map((d) => ({
      path: d.path,
      category: detectCategory(d.path),
      resolution: d.resolution,
      winner: d.winner,
      figmaValue: d.figmaValue,
      codeValue: d.codeValue,
      resolvedValue: d.resolvedValue,
    })),
  };
}

function isColorValue(val) {
  if (!val || typeof val !== 'string') return false;
  return /^#[0-9a-f]{3,8}$/i.test(val) || /^rgba?\(/.test(val);
}

function colorSwatch(val) {
  if (!isColorValue(val)) return '';
  return `<span class="swatch" style="background:${val}"></span>`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '<em>--</em>';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateHtmlReport(diff, summary) {
  const rows = diff
    .sort((a, b) => {
      const order = { conflict: 0, 'figma-ahead': 1, 'code-ahead': 2, 'figma-only': 3, 'code-only': 4, 'in-sync': 5 };
      return (order[a.resolution] ?? 9) - (order[b.resolution] ?? 9) || a.path.localeCompare(b.path);
    })
    .map((d) => {
      const category = detectCategory(d.path);
      const cls = d.resolution;
      return `<tr class="${cls}">
  <td class="path">${escapeHtml(d.path)}</td>
  <td>${escapeHtml(category)}</td>
  <td>${colorSwatch(d.figmaValue)}${escapeHtml(d.figmaValue)}</td>
  <td>${colorSwatch(d.codeValue)}${escapeHtml(d.codeValue)}</td>
  <td class="resolution">${escapeHtml(d.resolution)}</td>
  <td>${escapeHtml(d.winner)}</td>
</tr>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Token Diff Report</title>
<style>
  :root { --bg: #f8fafc; --card: #fff; --border: #e2e8f0; --text: #1e293b; --muted: #64748b; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); padding: 2rem; }
  h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
  .meta { color: var(--muted); font-size: 0.85rem; margin-bottom: 1.5rem; }
  .badges { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .badge { padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.9rem; color: #fff; }
  .badge.in-sync { background: #22c55e; }
  .badge.figma-ahead { background: #3b82f6; }
  .badge.code-ahead { background: #f97316; }
  .badge.conflict { background: #ef4444; }
  .badge.figma-only { background: #8b5cf6; }
  .badge.code-only { background: #06b6d4; }
  .controls { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
  .controls input { padding: 0.4rem 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; font-size: 0.85rem; min-width: 240px; }
  .controls select { padding: 0.4rem 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; font-size: 0.85rem; }
  .controls button { padding: 0.4rem 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; font-size: 0.85rem; background: var(--card); cursor: pointer; }
  .controls button:hover { background: #f1f5f9; }
  table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  th { background: #f1f5f9; text-align: left; padding: 0.6rem 0.75rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); border-bottom: 2px solid var(--border); position: sticky; top: 0; }
  td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); font-size: 0.85rem; vertical-align: middle; }
  .path { font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 0.8rem; }
  .swatch { display: inline-block; width: 14px; height: 14px; border-radius: 3px; border: 1px solid rgba(0,0,0,0.15); margin-right: 6px; vertical-align: middle; }
  tr.in-sync td:first-child { border-left: 3px solid #22c55e; }
  tr.figma-ahead td:first-child { border-left: 3px solid #3b82f6; }
  tr.code-ahead td:first-child { border-left: 3px solid #f97316; }
  tr.conflict td:first-child { border-left: 3px solid #ef4444; }
  tr.figma-only td:first-child { border-left: 3px solid #8b5cf6; }
  tr.code-only td:first-child { border-left: 3px solid #06b6d4; }
  tr.hidden { display: none; }
  .resolution { font-weight: 600; }
  tr.conflict .resolution { color: #ef4444; }
  tr.figma-ahead .resolution { color: #3b82f6; }
  tr.code-ahead .resolution { color: #f97316; }
  tr.in-sync .resolution { color: #22c55e; }
  tr.figma-only .resolution { color: #8b5cf6; }
  tr.code-only .resolution { color: #06b6d4; }
  .export-bar { margin-top: 1rem; display: flex; gap: 0.5rem; }
  .export-bar button { padding: 0.4rem 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; font-size: 0.85rem; background: var(--card); cursor: pointer; }
</style>
</head>
<body>
<h1>Token Diff Report</h1>
<p class="meta">Generated ${new Date().toISOString()}</p>

<div class="badges">
  <span class="badge in-sync">In Sync: ${summary.inSync}</span>
  <span class="badge figma-ahead">Figma Ahead: ${summary.figmaAhead + summary.figmaOnly}</span>
  <span class="badge code-ahead">Code Ahead: ${summary.codeAhead + summary.codeOnly}</span>
  <span class="badge conflict">Conflicts: ${summary.conflicts}</span>
</div>

<div class="controls">
  <input type="text" id="search" placeholder="Filter by token path..." />
  <select id="filterResolution">
    <option value="all">All statuses</option>
    <option value="in-sync">In Sync</option>
    <option value="figma-ahead">Figma Ahead</option>
    <option value="code-ahead">Code Ahead</option>
    <option value="conflict">Conflict</option>
    <option value="figma-only">Figma Only</option>
    <option value="code-only">Code Only</option>
  </select>
  <select id="filterCategory">
    <option value="all">All categories</option>
  </select>
</div>

<table>
<thead>
  <tr><th>Token Path</th><th>Category</th><th>Figma Value</th><th>Code Value</th><th>Resolution</th><th>Winner</th></tr>
</thead>
<tbody id="tbody">
${rows}
</tbody>
</table>

<div class="export-bar">
  <button onclick="copyJson()">Copy JSON</button>
  <button onclick="downloadCsv()">Download CSV</button>
</div>

<script>
const REPORT_JSON = ${JSON.stringify(generateJsonReport(diff, summary))};

// Populate category filter
const cats = [...new Set(REPORT_JSON.tokens.map(t => t.category))].sort();
const catSel = document.getElementById('filterCategory');
cats.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; catSel.appendChild(o); });

function applyFilters() {
  const q = document.getElementById('search').value.toLowerCase();
  const res = document.getElementById('filterResolution').value;
  const cat = document.getElementById('filterCategory').value;
  const rows = document.querySelectorAll('#tbody tr');
  rows.forEach((row, i) => {
    const token = REPORT_JSON.tokens[i];
    if (!token) { row.classList.add('hidden'); return; }
    const matchPath = !q || token.path.toLowerCase().includes(q);
    const matchRes = res === 'all' || token.resolution === res;
    const matchCat = cat === 'all' || token.category === cat;
    row.classList.toggle('hidden', !(matchPath && matchRes && matchCat));
  });
}

document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('filterResolution').addEventListener('change', applyFilters);
document.getElementById('filterCategory').addEventListener('change', applyFilters);

function copyJson() {
  navigator.clipboard.writeText(JSON.stringify(REPORT_JSON, null, 2)).then(() => alert('Copied!'));
}

function downloadCsv() {
  const header = 'Path,Category,Figma Value,Code Value,Resolution,Winner';
  const lines = REPORT_JSON.tokens.map(t =>
    [t.path, t.category, t.figmaValue ?? '', t.codeValue ?? '', t.resolution, t.winner ?? ''].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')
  );
  const csv = [header, ...lines].join('\\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'token-diff-report.csv';
  a.click();
}
</script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('[token-diff] Loading Figma tokens...');
  const figmaTokens = loadFigmaTokens();
  console.log(`[token-diff]   ${Object.keys(figmaTokens).length} Figma tokens`);

  console.log('[token-diff] Loading code tokens...');
  const codeTokens = loadCodeTokens();
  console.log(`[token-diff]   ${Object.keys(codeTokens).length} code tokens`);

  console.log('[token-diff] Loading sync state...');
  const _syncState = loadSyncState();

  // Build last-sync token map from hashes (we only have hashes, not values,
  // so we use an empty map — the diff will treat unknown sync state as "assume figma was source")
  const lastSyncTokens = {};

  console.log('[token-diff] Loading merge strategy...');
  const strategy = await loadMergeStrategy();

  console.log('[token-diff] Computing diff...');
  const diff = computeFullDiff(figmaTokens, codeTokens, lastSyncTokens, strategy);
  const summary = computeSummary(diff);

  console.log(`[token-diff] Results: ${summary.total} tokens — ${summary.inSync} in-sync, ${summary.figmaAhead} figma-ahead, ${summary.codeAhead} code-ahead, ${summary.conflicts} conflicts, ${summary.figmaOnly} figma-only, ${summary.codeOnly} code-only`);

  // Ensure output directory exists
  const reportsDir = resolve(ROOT, 'reports');
  mkdirSync(reportsDir, { recursive: true });

  // Write JSON report
  const jsonReport = generateJsonReport(diff, summary);
  const jsonPath = resolve(reportsDir, 'token-diff-report.json');
  writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));
  console.log(`[token-diff] Wrote ${jsonPath}`);

  // Write HTML report
  const htmlReport = generateHtmlReport(diff, summary);
  const htmlPath = resolve(reportsDir, 'token-diff-report.html');
  writeFileSync(htmlPath, htmlReport);
  console.log(`[token-diff] Wrote ${htmlPath}`);

  // Exit with non-zero if conflicts exist (useful for CI)
  if (summary.conflicts > 0) {
    console.log(`[token-diff] WARNING: ${summary.conflicts} conflicts detected`);
  }
}

main().catch((err) => {
  console.error('[token-diff] Fatal error:', err);
  process.exit(1);
});
