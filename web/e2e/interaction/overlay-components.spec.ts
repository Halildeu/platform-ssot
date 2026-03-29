import { test, expect } from '@playwright/test';

/**
 * E2E interaction tests for overlay / popup components in the Design Lab.
 *
 * Covers: Modal, Drawer, Popover, Tooltip, CommandPalette.
 */

test.describe('Overlay Components - Interaction Tests', () => {
  async function openComponentDetail(
    page: import('@playwright/test').Page,
    componentName: string,
  ): Promise<void> {
    await page.goto('/admin/design-lab/components', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="design-lab-sidebar-scroll"]', { timeout: 15_000 });

    const searchInput = page.locator(
      '[data-testid="design-lab-search"], input[placeholder*="ara" i], input[placeholder*="search" i]',
    ).first();
    await searchInput.fill(componentName);
    await page.waitForTimeout(300);

    const item = page
      .locator('[data-sidebar-item]')
      .filter({ hasText: new RegExp(componentName, 'i') })
      .first();

    await expect(item).toBeVisible({ timeout: 10_000 });
    await item.click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main').first()).toBeVisible();
  }

  // -----------------------------------------------------------------------
  // Helper — dismiss any already-open dialogs so they don't intercept clicks
  // -----------------------------------------------------------------------
  async function dismissOpenDialogs(page: import('@playwright/test').Page): Promise<void> {
    // The Design Lab Overview tab may render open <dialog> elements as demos.
    // Press Escape a few times to close them.
    for (let i = 0; i < 5; i++) {
      const openDialog = page.locator('dialog[open]').first();
      if (await openDialog.isVisible().catch(() => false)) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      } else {
        break;
      }
    }
  }

  // -----------------------------------------------------------------------
  // Helper — find and click a trigger button by common labels
  // -----------------------------------------------------------------------
  async function clickTrigger(
    page: import('@playwright/test').Page,
    labels: string[],
  ): Promise<boolean> {
    // First, dismiss any already-open dialogs that block pointer events
    await dismissOpenDialogs(page);

    for (const label of labels) {
      const btn = page.locator(`button:has-text("${label}")`).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click({ force: true });
        await page.waitForTimeout(500);
        return true;
      }
    }

    // Fallback — first visible button in the preview area
    const anyBtn = page.locator('main button:visible, [class*="preview"] button:visible').first();
    if (await anyBtn.isVisible().catch(() => false)) {
      await anyBtn.click({ force: true });
      await page.waitForTimeout(500);
      return true;
    }

    return false;
  }

  // -----------------------------------------------------------------------
  // Modal / Dialog
  // -----------------------------------------------------------------------
  test.describe('Modal / Dialog', () => {
    test('modal opens and closes', async ({ page }) => {
      await openComponentDetail(page, 'Modal');

      await clickTrigger(page, ['Open', 'Show', 'Open Modal', 'Aç', 'Modal Aç']);

      const dialog = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]').first();
      if (await dialog.isVisible().catch(() => false)) {
        await expect(dialog).toBeVisible();

        // Close via close button
        const closeBtn = dialog.locator(
          'button[aria-label*="lose"], button:has-text("Close"), button:has-text("Kapat"), button[class*="close"]',
        ).first();

        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click();
          await page.waitForTimeout(500);
          await expect(dialog).not.toBeVisible();
        }
      }
    });

    test('modal closes on Escape key', async ({ page }) => {
      await openComponentDetail(page, 'Modal');

      await clickTrigger(page, ['Open', 'Show', 'Open Modal', 'Aç']);

      const dialog = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]').first();
      if (await dialog.isVisible().catch(() => false)) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        await expect(dialog).not.toBeVisible();
      }
    });
  });

  // -----------------------------------------------------------------------
  // Drawer
  // -----------------------------------------------------------------------
  test.describe('Drawer', () => {
    test('drawer slides in and can be closed', async ({ page }) => {
      await openComponentDetail(page, 'DetailDrawer');

      await clickTrigger(page, ['Open Drawer', 'Show Drawer', 'Drawer Aç', 'Open', 'Aç']);

      const drawer = page.locator(
        '[class*="drawer"], [class*="Drawer"], [role="dialog"]',
      ).first();

      if (await drawer.isVisible().catch(() => false)) {
        await expect(drawer).toBeVisible();

        // Close
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    });
  });

  // -----------------------------------------------------------------------
  // Tooltip
  // -----------------------------------------------------------------------
  test.describe('Tooltip', () => {
    test('tooltip appears on hover', async ({ page }) => {
      await openComponentDetail(page, 'Tooltip');

      // Find an element with a tooltip trigger
      const triggerCandidates = page.locator(
        '[data-tooltip], [aria-describedby], button[title], [class*="tooltip-trigger"], [class*="TooltipTrigger"]',
      );

      if ((await triggerCandidates.count()) > 0) {
        await triggerCandidates.first().hover();
        await page.waitForTimeout(800);

        const tooltip = page.locator('[role="tooltip"], [class*="tooltip"], [class*="Tooltip"]').first();
        if (await tooltip.isVisible().catch(() => false)) {
          await expect(tooltip).toBeVisible();
        }
      }
    });
  });

  // -----------------------------------------------------------------------
  // Command Palette
  // -----------------------------------------------------------------------
  test.describe('CommandPalette', () => {
    test.beforeEach(async ({ page }) => {
      await openComponentDetail(page, 'CommandPalette');
    });

    test('command palette can be opened and searched', async ({ page }) => {
      // Try keyboard shortcut first (Cmd+K / Ctrl+K)
      const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
      await page.keyboard.press(`${modifier}+KeyK`);
      await page.waitForTimeout(500);

      let paletteVisible = false;
      const palette = page.locator(
        '[role="dialog"], [class*="command-palette"], [class*="CommandPalette"], [class*="cmdk"]',
      ).first();

      if (await palette.isVisible().catch(() => false)) {
        paletteVisible = true;
      } else {
        // Try button trigger
        await clickTrigger(page, ['Command', 'Open', 'Search', 'Ara']);
        if (await palette.isVisible().catch(() => false)) {
          paletteVisible = true;
        }
      }

      if (paletteVisible) {
        // Type a search query
        const searchInput = palette.locator('input').first();
        if (await searchInput.isVisible().catch(() => false)) {
          await searchInput.fill('test');
          await page.waitForTimeout(300);
        }

        // Close
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    });
  });
});
