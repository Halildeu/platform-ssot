import { chromium, test } from '@playwright/test';

// Basit a11y smoke: login, users, access sayfaları için critical/serious ihlal yoksa PASS.
const pages = ['/login', '/admin/users', '/admin/access'];

test.describe('A11y smoke (axe)', () => {
  test('login, users, access sayfalarında kritik axe ihlali olmamalı', async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    for (const path of pages) {
      await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' });
      await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/axe-core@4.7.0/axe.min.js' });
      const result = await page.evaluate(async () => {
        // @ts-expect-error axe global'ı script tag ile geliyor
        return await window.axe.run({
          runOnly: ['wcag2a', 'wcag2aa'],
        });
      });
      const ignored = new Set(['document-title', 'frame-title']);
      const seriousOrCritical = result.violations.filter(
        (v) => ['serious', 'critical'].includes(v.impact || '') && !ignored.has(v.id),
      );
      if (seriousOrCritical.length > 0) {
        throw new Error(
          `A11y violation on ${path}: ${seriousOrCritical
            .map((v) => `${v.id}:${v.impact}`)
            .join(', ')}`,
        );
      }
    }

    await browser.close();
  });
});
