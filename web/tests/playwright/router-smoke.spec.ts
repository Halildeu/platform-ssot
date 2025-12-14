import { test, expect } from '@playwright/test';

test.describe('MF Router smoke (QLTY-MF-ROUTER-01)', () => {

  test('shell → users → access → reporting rotalarında router context korunuyor', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        consoleErrors.push(msg.text());
      }
    });

    // Rotalara sırayla git; auth redirect olsa bile konsolda router hatası olmamalı
    await page.goto('/admin/users');
    const urlUsers = page.url();

    await page.goto('/access/roles');
    const urlRoles = page.url();

    await page.goto('/reports/users');
    const urlReports = page.url();

    const routerIssues = consoleErrors.filter((t) =>
      t.toLowerCase().includes('react router') || (t.toLowerCase().includes('route') && t.toLowerCase().includes('warning'))
    );
    expect(routerIssues, `React Router uyarıları/hataları: ${routerIssues.join(' | ')}`).toHaveLength(0);

    // Yönlendirme olsa bile son URL'ler boş/hatalı olmamalı
    expect(urlUsers.length).toBeGreaterThan(0);
    expect(urlRoles.length).toBeGreaterThan(0);
    expect(urlReports.length).toBeGreaterThan(0);
  });
});
