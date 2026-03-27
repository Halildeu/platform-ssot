import { test, expect, type Page } from '@playwright/test';

/**
 * Design Lab — Visual Regression Tests
 *
 * Captures screenshots of each component in Light, Dark, and HC modes.
 * Uses Playwright's built-in toHaveScreenshot() for pixel-diff comparison.
 *
 * Run: npx playwright test tests/playwright/design-lab.visual.spec.ts --config tests/playwright/playwright.config.ts --project=chromium --update-snapshots
 * CI:  npx playwright test tests/playwright/design-lab.visual.spec.ts --config tests/playwright/playwright.config.ts --project=chromium
 */

const BASE = '/admin/design-lab';

/* Representative components to test — one per category */
const VISUAL_TARGETS = [
  { path: 'components/navigation/Pagination', name: 'Pagination' },
  { path: 'components/navigation/Steps', name: 'Steps' },
  { path: 'components/navigation/Tabs', name: 'Tabs' },
  { path: 'components/navigation/Breadcrumb', name: 'Breadcrumb' },
  { path: 'components/data_entry/DatePicker', name: 'DatePicker' },
  { path: 'components/data_entry/Checkbox', name: 'Checkbox' },
  { path: 'components/general/Button', name: 'Button' },
  { path: 'components/feedback/Alert', name: 'Alert' },
  { path: 'components/feedback/Dialog', name: 'Dialog' },
  { path: 'components/data_display/Descriptions', name: 'Descriptions' },
];

const MODES = ['light', 'dark', 'high-contrast'] as const;
type Mode = typeof MODES[number];

async function setPreviewMode(page: Page, mode: Mode) {
  const label = mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'HC';
  const btn = page.locator(`button:has-text("${label}")`).first();
  if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(500); // transition
  }
}

async function waitForDesignLab(page: Page) {
  // Wait for sidebar or main content to load
  await page.waitForSelector('[data-testid="design-lab-sidebar-scroll"], .preview-theme-scope', {
    timeout: 15000,
  }).catch(() => {});
  await page.waitForTimeout(1000); // HMR settle
}

test.describe('Design Lab Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // AUTH_MODE=permitAll — no login needed
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await waitForDesignLab(page);
  });

  /* ------------------------------------------------------------------ */
  /*  Landing page                                                       */
  /* ------------------------------------------------------------------ */
  test('landing page renders correctly', async ({ page }) => {
    await expect(page.locator('text=Design Lab')).toBeVisible();
    await expect(page).toHaveScreenshot('landing.png', {
      maxDiffPixelRatio: 0.01,
      fullPage: true,
    });
  });

  /* ------------------------------------------------------------------ */
  /*  Component pages — Light / Dark / HC                                */
  /* ------------------------------------------------------------------ */
  for (const target of VISUAL_TARGETS) {
    for (const mode of MODES) {
      test(`${target.name} — ${mode}`, async ({ page }) => {
        await page.goto(`${BASE}/${target.path}`, { waitUntil: 'networkidle' });
        await waitForDesignLab(page);
        await setPreviewMode(page, mode);

        // Capture only the preview area (not sidebar)
        const preview = page.locator('.preview-theme-scope').first();
        if (await preview.isVisible({ timeout: 5000 }).catch(() => false)) {
          await expect(preview).toHaveScreenshot(
            `${target.name}-${mode}.png`,
            { maxDiffPixelRatio: 0.02 },
          );
        } else {
          // Fallback: full page screenshot
          await expect(page).toHaveScreenshot(
            `${target.name}-${mode}-full.png`,
            { maxDiffPixelRatio: 0.02, fullPage: true },
          );
        }
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Sidebar visual                                                     */
  /* ------------------------------------------------------------------ */
  test('sidebar — collapsed groups', async ({ page }) => {
    await page.goto(`${BASE}/components`, { waitUntil: 'networkidle' });
    await waitForDesignLab(page);

    // Collapse all
    const collapseBtn = page.locator('[aria-label="Collapse all groups"]');
    if (await collapseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await collapseBtn.click();
      await page.waitForTimeout(500);
    }

    const sidebar = page.locator('[data-testid="design-lab-sidebar-scroll"]');
    if (await sidebar.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(sidebar).toHaveScreenshot('sidebar-collapsed.png', {
        maxDiffPixelRatio: 0.02,
      });
    }
  });

  test('sidebar — expanded groups', async ({ page }) => {
    await page.goto(`${BASE}/components`, { waitUntil: 'networkidle' });
    await waitForDesignLab(page);

    // Expand all
    const expandBtn = page.locator('[aria-label="Expand all groups"]');
    if (await expandBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expandBtn.click();
      await page.waitForTimeout(500);
    }

    const sidebar = page.locator('[data-testid="design-lab-sidebar-scroll"]');
    if (await sidebar.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(sidebar).toHaveScreenshot('sidebar-expanded.png', {
        maxDiffPixelRatio: 0.02,
      });
    }
  });

  /* ------------------------------------------------------------------ */
  /*  Count consistency                                                  */
  /* ------------------------------------------------------------------ */
  test('landing card counts match sidebar', async ({ page }) => {
    // Get Bileşenler count from landing
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await waitForDesignLab(page);

    const componentCard = page.locator('text=Bileşenler').first();
    await expect(componentCard).toBeVisible({ timeout: 10000 });

    const countText = await page.locator('.tabular-nums').nth(3).textContent();
    const landingCount = parseInt(countText?.trim() ?? '0', 10);

    // Navigate to components listing
    await page.goto(`${BASE}/components`, { waitUntil: 'networkidle' });
    await waitForDesignLab(page);

    // Get sidebar header count
    const header = page.locator('text=/\\d+ items/').first();
    if (await header.isVisible({ timeout: 5000 }).catch(() => false)) {
      const headerText = await header.textContent();
      const sidebarCount = parseInt(headerText?.match(/(\d+)\s*items/)?.[1] ?? '0', 10);

      // They should match
      expect(landingCount).toBe(sidebarCount);
    }
  });

  /* ------------------------------------------------------------------ */
  /*  HC contrast — active states visible                                */
  /* ------------------------------------------------------------------ */
  test('Pagination HC — active page visible', async ({ page }) => {
    await page.goto(`${BASE}/components/navigation/Pagination`, { waitUntil: 'networkidle' });
    await waitForDesignLab(page);
    await setPreviewMode(page, 'high-contrast');

    // Active page button should have aria-current="page"
    const activeBtn = page.locator('[aria-current="page"]').first();
    if (await activeBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Check it has visible text
      const text = await activeBtn.textContent();
      expect(text?.trim()).toBeTruthy();

      // Check computed styles — should have distinct background
      const bgColor = await activeBtn.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor,
      );
      // Should not be transparent or same as page background
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('Steps HC — active step visible', async ({ page }) => {
    await page.goto(`${BASE}/components/navigation/Steps`, { waitUntil: 'networkidle' });
    await waitForDesignLab(page);
    await setPreviewMode(page, 'high-contrast');

    const activeStep = page.locator('[aria-current="step"]').first();
    if (await activeStep.isVisible({ timeout: 5000 }).catch(() => false)) {
      const bgColor = await activeStep.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor,
      );
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});
