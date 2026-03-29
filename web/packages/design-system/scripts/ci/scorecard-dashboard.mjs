#!/usr/bin/env node
/**
 * scorecard-dashboard.mjs — HTML Scorecard Dashboard
 *
 * Generates a self-contained HTML report from scorecard.json
 * with grade distribution, metric charts, and per-component details.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCORECARD_PATH = path.resolve(__dirname, '../../reports/scorecard.json');
const OUTPUT_PATH = path.resolve(__dirname, '../../reports/scorecard-dashboard.html');

if (!fs.existsSync(SCORECARD_PATH)) {
  console.error('❌ reports/scorecard.json not found. Run `npm run scorecard` first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(SCORECARD_PATH, 'utf-8'));
const components = Array.isArray(data) ? data : data.components || [];

// Calculate metrics
const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };
const metricSums = {};
const metricKeys = ['testDepth', 'api', 'a11y', 'testCoverage', 'accessControl', 'storyCompleteness', 'i18n', 'documentation'];

for (const c of components) {
  grades[c.grade] = (grades[c.grade] || 0) + 1;
  for (const k of metricKeys) {
    metricSums[k] = (metricSums[k] || 0) + (c.scores?.[k] || 0);
  }
}

const avg = (components.reduce((s, c) => s + c.totalScore, 0) / components.length).toFixed(1);
const metricAvgs = {};
for (const k of metricKeys) {
  metricAvgs[k] = (metricSums[k] / components.length).toFixed(1);
}

// Group by directory
const byDir = {};
for (const c of components) {
  byDir[c.dir] = byDir[c.dir] || [];
  byDir[c.dir].push(c);
}

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design System Scorecard Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--surface-default); color: var(--text-primary); padding: 2rem; }
    .header { text-align: center; margin-bottom: 2rem; }
    .header h1 { font-size: 1.75rem; font-weight: 700; }
    .header .subtitle { color: var(--text-secondary); margin-top: 0.25rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: white; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card .label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .card .value { font-size: 2rem; font-weight: 700; margin-top: 0.25rem; }
    .card .bar { height: 6px; background: var(--border-subtle); border-radius: 3px; margin-top: 0.5rem; overflow: hidden; }
    .card .bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
    .grade-a { color: var(--state-success-text); } .grade-b { color: var(--action-primary); } .grade-c { color: var(--state-warning-text); } .grade-d { color: var(--state-danger-text); }
    .bar-a { background: var(--state-success-text); } .bar-b { background: var(--action-primary); } .bar-c { background: var(--state-warning-text); } .bar-d { background: var(--state-danger-text); }
    .section { margin-bottom: 2rem; }
    .section h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid var(--border-subtle); }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th { background: var(--surface-muted); text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); }
    td { padding: 0.5rem 1rem; border-top: 1px solid var(--surface-muted); font-size: 0.875rem; }
    tr:hover td { background: var(--surface-default); }
    .metric-bar { display: inline-block; height: 8px; border-radius: 4px; min-width: 4px; }
    .grade-badge { display: inline-block; width: 28px; height: 28px; border-radius: 6px; text-align: center; line-height: 28px; font-weight: 700; font-size: 0.75rem; color: white; }
    .badge-a { background: var(--state-success-text); } .badge-b { background: var(--action-primary); } .badge-c { background: var(--state-warning-text); } .badge-d { background: var(--state-danger-text); }
    .footer { text-align: center; color: var(--text-subtle); font-size: 0.75rem; margin-top: 2rem; }
  </style>
</head>
<body>
  <div class="header">
    <h1>@mfe/design-system Scorecard</h1>
    <div class="subtitle">Generated ${new Date().toISOString().split('T')[0]} &middot; ${components.length} components &middot; Average ${avg}/100</div>
  </div>

  <div class="grid">
    ${metricKeys.map(k => {
      const v = metricAvgs[k];
      const color = v >= 80 ? 'var(--state-success-text)' : v >= 60 ? 'var(--action-primary)' : v >= 40 ? 'var(--state-warning-text)' : 'var(--state-danger-text)';
      const label = k.replace(/([A-Z])/g, ' $1').trim();
      return `<div class="card">
        <div class="label">${label}</div>
        <div class="value" style="color:${color}">${v}</div>
        <div class="bar"><div class="bar-fill" style="width:${v}%;background:${color}"></div></div>
      </div>`;
    }).join('\n    ')}
  </div>

  <div class="grid" style="grid-template-columns: repeat(4, 1fr);">
    ${Object.entries(grades).filter(([,_v]) => true).map(([g, cnt]) => {
      const cls = g.toLowerCase();
      return `<div class="card" style="text-align:center">
        <div class="label">Grade ${g}</div>
        <div class="value grade-${cls}">${cnt}</div>
      </div>`;
    }).join('\n    ')}
  </div>

  ${Object.entries(byDir).sort((a,b) => b[1].length - a[1].length).map(([dir, comps]) => `
  <div class="section">
    <h2>${dir} (${comps.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Grade</th>
          <th>Score</th>
          ${metricKeys.map(k => `<th>${k.slice(0,4)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${comps.sort((a,b) => b.totalScore - a.totalScore).map(c => `
        <tr>
          <td>${c.name}</td>
          <td><span class="grade-badge badge-${c.grade.toLowerCase()}">${c.grade}</span></td>
          <td><strong>${c.totalScore}</strong></td>
          ${metricKeys.map(k => {
            const v = c.scores?.[k] || 0;
            const color = v >= 80 ? 'var(--state-success-text)' : v >= 60 ? 'var(--action-primary)' : v >= 40 ? 'var(--state-warning-text)' : 'var(--state-danger-text)';
            return `<td><span class="metric-bar" style="width:${v*0.4}px;background:${color}"></span> ${v}</td>`;
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`).join('\n')}

  <div class="footer">
    Generated by @mfe/design-system scorecard-dashboard.mjs
  </div>
</body>
</html>`;

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, html, 'utf-8');
console.log(`✅ Dashboard generated: ${OUTPUT_PATH}`);
console.log(`   ${components.length} components, avg ${avg}/100`);
