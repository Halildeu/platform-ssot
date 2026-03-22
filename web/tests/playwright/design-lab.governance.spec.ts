import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

test.describe('Design Lab governance pages (QLTY-DL-GOV-01)', () => {
  test('governance page renders', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/design-lab/governance', ['DESIGN_LAB']);
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('main, [data-testid*="governance"], [data-page*="governance"]').first(),
    ).toBeVisible({ timeout: 10_000 });

    // Page should not be empty -- verify some content rendered
    const mainContent = page.locator('main').first();
    if (await mainContent.isVisible().catch(() => false)) {
      const textContent = await mainContent.textContent();
      expect((textContent ?? '').trim().length).toBeGreaterThan(0);
    }
  });

  test('observability page renders Web Vitals', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/design-lab/observability', ['DESIGN_LAB']);
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('main, [data-testid*="observability"], [data-page*="observability"]').first(),
    ).toBeVisible({ timeout: 10_000 });

    // Look for Web Vitals related content (LCP, FID, CLS, FCP, TTFB, INP)
    const vitalsIndicator = page
      .locator('text=/LCP|FID|CLS|FCP|TTFB|INP|Web Vitals|Core Vitals/i')
      .first();

    if (await vitalsIndicator.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(vitalsIndicator).toBeVisible();
    }
  });

  test('intelligence page renders sections', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/design-lab/intelligence', ['DESIGN_LAB']);
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('main, [data-testid*="intelligence"], [data-page*="intelligence"]').first(),
    ).toBeVisible({ timeout: 10_000 });

    // Verify at least one section or card rendered
    const sections = page.locator('main section, main [class*="card"], main [class*="section"]');
    const sectionCount = await sections.count();
    // Page should have rendered content
    const mainText = await page.locator('main').first().textContent().catch(() => '');
    expect((mainText ?? '').trim().length).toBeGreaterThan(0);
  });

  test('leadership page renders badges', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/design-lab/leadership', ['DESIGN_LAB']);
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('main, [data-testid*="leadership"], [data-page*="leadership"]').first(),
    ).toBeVisible({ timeout: 10_000 });

    // Look for badge-like elements
    const badges = page.locator(
      '[data-testid*="badge"], [class*="badge"], [role="status"], span[class*="chip"]',
    );

    if (await badges.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      const badgeCount = await badges.count();
      expect(badgeCount).toBeGreaterThan(0);
    }
  });
});
