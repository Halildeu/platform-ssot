import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';

import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const root = path.resolve(process.cwd());
const distRoot = path.join(root, 'apps', 'mfe-audit', 'dist-quality');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function fail(message) {
  console.error(`[check-audit-quality-a11y] FAIL: ${message}`);
  process.exit(1);
}

function resolveFile(urlPath) {
  const normalized = urlPath === '/' ? '/index.html' : urlPath;
  const candidate = path.normalize(path.join(distRoot, normalized));
  if (!candidate.startsWith(distRoot)) {
    return null;
  }
  return candidate;
}

if (!fs.existsSync(path.join(distRoot, 'index.html'))) {
  fail(`dist-quality index.html bulunamadi: ${distRoot}`);
}

const server = createServer((req, res) => {
  const filePath = resolveFile(req.url || '/');
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath);
  res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
  res.end(fs.readFileSync(filePath));
});

server.listen(0, '127.0.0.1', async () => {
  const address = server.address();
  if (!address || typeof address === 'string') {
    fail('statik sunucu portu alinamadi');
  }

  const baseUrl = `http://127.0.0.1:${address.port}/index.html`;
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    if (results.violations.length > 0) {
      const summary = results.violations.map((item) => `${item.id}:${item.nodes.length}`).join(', ');
      fail(summary);
    }

    console.log('[check-audit-quality-a11y] OK');
    console.log(JSON.stringify({
      status: 'OK',
      url: baseUrl,
      violations: 0,
    }));
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
    server.close();
  }
});
