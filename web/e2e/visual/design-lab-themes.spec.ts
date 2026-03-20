import { test, expect, Page } from '@playwright/test';

/**
 * Theme-switching visual regression tests.
 *
 * For five representative components we capture screenshots in Light, Dark and
 * High-Contrast modes by toggling the theme switcher that lives inside the
 * Design Lab shell.
 *
 * Generate baselines:
 *   npx playwright test e2e/visual/design-lab-themes.spec.ts --update-snapshots
 */

// ---------------------------------------------------------------------------
// Components to test across themes
// ---------------------------------------------------------------------------

const THEME_TEST_COMPONENTS = [
  { name: 'Button', path: '/admin/design-lab/components/form_inputs/Button' },
  { name: 'Input', path: '/admin/design-lab/components/form_inputs/Input' },
  { name: 'TableSimple', path: '/admin/design-lab/components/data_display/TableSimple' },
  { name: 'Badge', path: '/admin/design-lab/components/general_identity/Badge' },
  { name: 'Steps', path: '/admin/design-lab/components/navigation/Steps' },
];

// Theme modes to cycle through
const THEMES = ['light', 'dark', 'high-contrast'] as const;
type ThemeMode = (typeof THEMES)[number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Attempt to switch the Design Lab to the requested theme by clicking the
 * appropriate toggle / button. The exact selector may vary; we try several
 * common patterns.
 */
async function switchTheme(page: Page, theme: ThemeMode): Promise<void> {
  // Strategy 1 — a button or radio whose accessible name / label contains the theme name
  const labelVariants: Record<ThemeMode, string[]> = {
    light: ['Light', 'light', 'Aydınlık'],
    dark: ['Dark', 'dark', 'Karanlık'],
    'high-contrast': ['High Contrast', 'high-contrast', 'HC', 'Yüksek Kontrast'],
  };

  for (const label of labelVariants[theme]) {
    // Try button with exact text
    const btn = page.locator(
      `button:has-text("${label}"), [role="radio"]:has-text("${label}"), [role="tab"]:has-text("${label}"), label:has-text("${label}")`,
    ).first();

    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      // Wait for the theme transition to settle
      await page.waitForTimeout(800);
      return;
    }
  }

  // Strategy 2 — a data-theme or data-color-scheme attribute driven select/dropdown
  const themeSelect = page.locator(
    'select[data-testid*="theme"], select[class*="theme"], [data-testid="theme-selector"]',
  ).first();

  if (await themeSelect.isVisible().catch(() => false)) {
    await themeSelect.selectOption({ label: theme });
    await page.waitForTimeout(800);
    return;
  }

  // Strategy 3 — set the data attribute directly (last resort)
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-color-scheme', t);
    document.documentElement.className = document.documentElement.className
      .replace(/\b(light|dark|high-contrast)\b/g, '')
      .trim() + ` ${t}`;
  }, theme);
  await page.waitForTimeout(800);
}

/**
 * Locate the live-preview container (mirrors the logic in design-lab-components).
 */
async function getPreviewLocator(page: Page) {
  await page.waitForTimeout(1000);

  const previewByHeading = page
    .locator('section, div')
    .filter({ hasText: /LIVE PREVIEW|LİVE PREVİEW|Live Preview/ })
    .first();

  if (await previewByHeading.isVisible().catch(() => false)) {
    return previewByHeading;
  }

  const previewByAttr = page
    .locator('[data-testid="live-preview"], [class*="live-preview"], [class*="livePreview"]')
    .first();

  if (await previewByAttr.isVisible().catch(() => false)) {
    return previewByAttr;
  }

  return page.locator('main, [class*="content"]').first();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Design Lab - Theme Switching Visual Regression', () => {
  for (const component of THEME_TEST_COMPONENTS) {
    for (const theme of THEMES) {
      test(`${component.name} - ${theme} theme`, async ({ page }) => {
        await page.goto(component.path, { waitUntil: 'networkidle' });

        // Switch theme
        await switchTheme(page, theme);

        const preview = await getPreviewLocator(page);
        await expect(preview).toHaveScreenshot(
          `${component.name}-${theme}.png`,
          { animations: 'disabled' },
        );
      });
    }
  }
});
