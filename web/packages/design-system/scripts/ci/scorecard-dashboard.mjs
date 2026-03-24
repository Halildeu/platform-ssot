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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem; }
    .header { text-align: center; margin-bottom: 2rem; }
    .header h1 { font-size: 1.75rem; font-weight: 700; }
    .header .subtitle { color: #64748b; margin-top: 0.25rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: white; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card .label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    .card .value { font-size: 2rem; font-weight: 700; margin-top: 0.25rem; }
    .card .bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 0.5rem; overflow: hidden; }
    .card .bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
    .grade-a { color: #16a34a; } .grade-b { color: #2563eb; } .grade-c { color: #d97706; } .grade-d { color: #dc2626; }
    .bar-a { background: #16a34a; } .bar-b { background: #2563eb; } .bar-c { background: #d97706; } .bar-d { background: #dc2626; }
    .section { margin-bottom: 2rem; }
    .section h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th { background: #f1f5f9; text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; text-transform: uppercase; color: #64748b; }
    td { padding: 0.5rem 1rem; border-top: 1px solid #f1f5f9; font-size: 0.875rem; }
    tr:hover td { background: #f8fafc; }
    .metric-bar { display: inline-block; height: 8px; border-radius: 4px; min-width: 4px; }
    .grade-badge { display: inline-block; width: 28px; height: 28px; border-radius: 6px; text-align: center; line-height: 28px; font-weight: 700; font-size: 0.75rem; color: white; }
    .badge-a { background: #16a34a; } .badge-b { background: #2563eb; } .badge-c { background: #d97706; } .badge-d { background: #dc2626; }
    .footer { text-align: center; color: #94a3b8; font-size: 0.75rem; margin-top: 2rem; }
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
      const color = v >= 80 ? '#16a34a' : v >= 60 ? '#2563eb' : v >= 40 ? '#d97706' : '#dc2626';
      const label = k.replace(/([A-Z])/g, ' $1').trim();
      return `<div class="card">
        <div class="label">${label}</div>
        <div class="value" style="color:${color}">${v}</div>
        <div class="bar"><div class="bar-fill" style="width:${v}%;background:${color}"></div></div>
      </div>`;
    }).join('\n    ')}
  </div>

  <div class="grid" style="grid-template-columns: repeat(4, 1fr);">
    ${Object.entries(grades).filter(([,v]) => true).map(([g, cnt]) => {
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
            const color = v >= 80 ? '#16a34a' : v >= 60 ? '#2563eb' : v >= 40 ? '#d97706' : '#dc2626';
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
