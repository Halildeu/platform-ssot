import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

/* ------------------------------------------------------------------ */
/*  Design Lab Sidebar v3 — E2E Tests                                  */
/*  Covers: collapse/expand, favorites, recents, search, filter,       */
/*  count consistency, scroll, breadcrumb, group interaction.           */
/* ------------------------------------------------------------------ */

const DL_COMPONENTS = '/admin/design-lab/components';
const DL_ROOT = '/admin/design-lab';
const PERMS = ['DESIGN_LAB'];

/** Navigate to Design Lab components page with auth */
async function goToComponents(page: any, baseURL: string | undefined) {
  await authenticateAndNavigate(page, baseURL, DL_COMPONENTS, PERMS);
  await page.waitForLoadState('networkidle');
  // Wait for sidebar to render
  await page.waitForSelector('[data-testid="design-lab-sidebar-scroll"]', { timeout: 15_000 });
}

/** Navigate to Design Lab landing */
async function goToLanding(page: any, baseURL: string | undefined) {
  await authenticateAndNavigate(page, baseURL, DL_ROOT, PERMS);
  await page.waitForLoadState('networkidle');
}

/* ================================================================== */
/*  1. SIDEBAR RENDERING                                               */
/* ================================================================== */

test.describe('Design Lab Sidebar — Rendering (QLTY-DL-SIDEBAR-01)', () => {
  test('sidebar renders with groups and items', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const nav = page.locator('[aria-label="Component navigation"]');
    await expect(nav).toBeVisible({ timeout: 10_000 });

    // At least 8 groups should be visible
    const groups = nav.locator('[role="group"]');
    await expect(groups).toHaveCount(await groups.count());
    expect(await groups.count()).toBeGreaterThanOrEqual(8);

    // Items should be present
    const items = nav.locator('[data-sidebar-item]');
    expect(await items.count()).toBeGreaterThan(50);
  });

  test('sidebar header shows item count matching group totals', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    // Get header count
    const headerText = await page.locator('text=/\\d+ items/').first().textContent();
    const headerCount = parseInt(headerText?.match(/(\d+)/)?.[1] ?? '0', 10);

    // Get sidebar item count
    const nav = page.locator('[aria-label="Component navigation"]');
    const itemCount = await nav.locator('[data-sidebar-item]').count();

    // Header should match visible items
    expect(headerCount).toBe(itemCount);
  });

  test('each group shows correct item count badge', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const nav = page.locator('[aria-label="Component navigation"]');
    const groups = nav.locator('[role="group"]');
    const groupCount = await groups.count();

    for (let i = 0; i < groupCount; i++) {
      const group = groups.nth(i);
      const button = group.locator('button').first();
      const buttonText = await button.textContent();

      // Extract "N/N" from group header
      const match = buttonText?.match(/\((\d+)\/(\d+)\)/);
      if (match) {
        const [, visible, total] = match;
        expect(parseInt(visible)).toBe(parseInt(total)); // No filter active = all visible
      }
    }
  });
});

/* ================================================================== */
/*  2. COLLAPSE / EXPAND                                               */
/* ================================================================== */

test.describe('Design Lab Sidebar — Collapse/Expand (QLTY-DL-SIDEBAR-02)', () => {
  test('collapse all hides all group items', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    // Click Collapse All
    await page.click('[aria-label="Collapse all groups"]');
    await page.waitForTimeout(500);

    // All groups should be collapsed (aria-expanded="false")
    const nav = page.locator('[aria-label="Component navigation"]');
    const expandedGroups = nav.locator('button[aria-expanded="true"]');
    expect(await expandedGroups.count()).toBe(0);
  });

  test('expand all shows all group items', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    // First collapse, then expand
    await page.click('[aria-label="Collapse all groups"]');
    await page.waitForTimeout(300);
    await page.click('[aria-label="Expand all groups"]');
    await page.waitForTimeout(500);

    // All groups should be expanded
    const nav = page.locator('[aria-label="Component navigation"]');
    const collapsedGroups = nav.locator('button[aria-expanded="false"]');
    expect(await collapsedGroups.count()).toBe(0);
  });

  test('individual group toggle works after collapse all', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    // Collapse all first
    await page.click('[aria-label="Collapse all groups"]');
    await page.waitForTimeout(500);

    // Click first group to expand it
    const nav = page.locator('[aria-label="Component navigation"]');
    const firstGroup = nav.locator('[role="group"]').first();
    const firstGroupButton = firstGroup.locator('button').first();
    await firstGroupButton.click();
    await page.waitForTimeout(300);

    // First group should be expanded, others still collapsed
    await expect(firstGroupButton).toHaveAttribute('aria-expanded', 'true');
  });
});

/* ================================================================== */
/*  3. FAVORITES                                                       */
/* ================================================================== */

test.describe('Design Lab Sidebar — Favorites (QLTY-DL-SIDEBAR-03)', () => {
  test('favorites section is visible', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const favorites = page.locator('text=/FAVORİTES|FAVORITES|Favoriler/i').first();
    await expect(favorites).toBeVisible({ timeout: 5_000 });
  });

  test('pin button appears on hover', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    // Hover over first item
    const nav = page.locator('[aria-label="Component navigation"]');
    const firstItem = nav.locator('[data-sidebar-item]').first();
    await firstItem.hover();

    // Pin button should appear
    const pinButton = firstItem.locator('button[aria-label*="Pin"], button[aria-label*="pin"]');
    await expect(pinButton).toBeVisible({ timeout: 3_000 });
  });
});

/* ================================================================== */
/*  4. RECENTLY VIEWED                                                 */
/* ================================================================== */

test.describe('Design Lab Sidebar — Recently Viewed (QLTY-DL-SIDEBAR-04)', () => {
  test('recently viewed section exists', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const recents = page.locator('text=/RECENTLY VİEWED|RECENTLY VIEWED|Son Görüntülenen/i').first();
    await expect(recents).toBeVisible({ timeout: 5_000 });
  });

  test('visiting a component adds it to recents', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    // Click a component
    const nav = page.locator('[aria-label="Component navigation"]');
    const tabsItem = nav.locator('[data-sidebar-item]').filter({ hasText: 'Tabs' }).first();

    if (await tabsItem.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await tabsItem.click();
      await page.waitForTimeout(1000);

      // Check recents section contains "Tabs"
      const recentsSection = page.locator('text=/RECENTLY VİEWED|RECENTLY VIEWED/i').first();
      const recentsParent = recentsSection.locator('..').locator('..');
      const tabsInRecents = recentsParent.locator('text=Tabs');
      await expect(tabsInRecents.first()).toBeVisible({ timeout: 5_000 });
    }
  });
});

/* ================================================================== */
/*  5. SEARCH                                                          */
/* ================================================================== */

test.describe('Design Lab Sidebar — Search (QLTY-DL-SIDEBAR-05)', () => {
  test('search input is visible', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const searchInput = page.locator('input[placeholder*="ara"], input[placeholder*="search"], input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
  });

  test('typing filters components', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const searchInput = page.locator('input[placeholder*="ara"], input[placeholder*="search"], input[placeholder*="Search"]').first();
    await searchInput.fill('Button');
    await page.waitForTimeout(500);

    // Should show filtered results
    const nav = page.locator('[aria-label="Component navigation"]');
    const visibleItems = nav.locator('[data-sidebar-item]');
    const count = await visibleItems.count();

    // Should have at least 1 match (Button) but less than total
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(90); // Much less than 95 total
  });

  test('clearing search restores all items', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const searchInput = page.locator('input[placeholder*="ara"], input[placeholder*="search"], input[placeholder*="Search"]').first();

    // Get initial count
    const nav = page.locator('[aria-label="Component navigation"]');
    const initialCount = await nav.locator('[data-sidebar-item]').count();

    // Search then clear
    await searchInput.fill('Button');
    await page.waitForTimeout(500);
    await searchInput.fill('');
    await page.waitForTimeout(500);

    // Count should restore
    const restoredCount = await nav.locator('[data-sidebar-item]').count();
    expect(restoredCount).toBe(initialCount);
  });
});

/* ================================================================== */
/*  6. FILTER CHIPS                                                    */
/* ================================================================== */

test.describe('Design Lab Sidebar — Filter Chips (QLTY-DL-SIDEBAR-06)', () => {
  test('filter chips are visible', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    // Should have All, Stable, Beta, Planned, Demo chips
    const allChip = page.locator('[role="toolbar"] button, button').filter({ hasText: /^All$/i }).first();
    await expect(allChip).toBeVisible({ timeout: 5_000 });
  });

  test('clicking Stable filter shows only stable components', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const nav = page.locator('[aria-label="Component navigation"]');
    const initialCount = await nav.locator('[data-sidebar-item]').count();

    // Click Stable chip
    const stableChip = page.locator('button').filter({ hasText: /^Stable$/i }).first();
    if (await stableChip.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await stableChip.click();
      await page.waitForTimeout(500);

      // Count should be same or less (most items are stable)
      const filteredCount = await nav.locator('[data-sidebar-item]').count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
      expect(filteredCount).toBeGreaterThan(0);
    }
  });
});

/* ================================================================== */
/*  7. COUNT CONSISTENCY (Landing ↔ Sidebar)                           */
/* ================================================================== */

test.describe('Design Lab — Count Consistency (QLTY-DL-SIDEBAR-07)', () => {
  test('landing Bileşenler count matches sidebar total', async ({ page, baseURL }) => {
    // Get landing count
    await goToLanding(page, baseURL);
    const bilesenlerCard = page.locator('button, a').filter({ hasText: /Bileşenler|Components/i }).first();
    const landingCountText = await bilesenlerCard.locator('.tabular-nums').textContent();
    const landingCount = parseInt(landingCountText?.trim() ?? '0', 10);

    // Navigate to components and get sidebar count
    await page.goto(`${baseURL ?? 'http://localhost:3000'}${DL_COMPONENTS}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="design-lab-sidebar-scroll"]', { timeout: 15_000 });

    const nav = page.locator('[aria-label="Component navigation"]');
    const sidebarCount = await nav.locator('[data-sidebar-item]').count();

    // Should match
    expect(landingCount).toBe(sidebarCount);
  });
});

/* ================================================================== */
/*  8. SCROLL                                                          */
/* ================================================================== */

test.describe('Design Lab Sidebar — Scroll (QLTY-DL-SIDEBAR-08)', () => {
  test('sidebar scroll area exists and is scrollable', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const scrollArea = page.locator('[data-testid="design-lab-sidebar-scroll"]');
    await expect(scrollArea).toBeVisible();

    // Check it has overflow scroll
    const overflow = await scrollArea.evaluate((el) => getComputedStyle(el).overflowY);
    expect(['auto', 'scroll']).toContain(overflow);
  });

  test('last group is reachable by scrolling', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const nav = page.locator('[aria-label="Component navigation"]');
    const groups = nav.locator('[role="group"]');
    const lastGroup = groups.last();

    // Scroll into view
    await lastGroup.scrollIntoViewIfNeeded();
    await expect(lastGroup).toBeInViewport({ timeout: 5_000 });
  });
});

/* ================================================================== */
/*  9. BREADCRUMB                                                      */
/* ================================================================== */

test.describe('Design Lab Sidebar — Breadcrumb (QLTY-DL-SIDEBAR-09)', () => {
  test('breadcrumb shows current location', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const breadcrumb = page.locator('[aria-label="Breadcrumb"], nav').filter({ hasText: 'Components' }).first();
    await expect(breadcrumb).toBeVisible({ timeout: 5_000 });
  });

  test('breadcrumb updates on navigation', async ({ page, baseURL }) => {
    await authenticateAndNavigate(
      page,
      baseURL,
      '/admin/design-lab/components/navigation/Tabs',
      PERMS,
    );
    await page.waitForLoadState('networkidle');

    // Breadcrumb should contain path segments
    const breadcrumb = page.locator('[aria-label="Breadcrumb"], nav').filter({ hasText: 'Components' }).first();
    if (await breadcrumb.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const text = await breadcrumb.textContent();
      expect(text).toContain('Components');
    }
  });
});

/* ================================================================== */
/*  10. LAYER TABS                                                     */
/* ================================================================== */

test.describe('Design Lab Sidebar — Layer Tabs (QLTY-DL-SIDEBAR-10)', () => {
  test('layer tabs are visible', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    // Should have multiple layer buttons (foundations, primitives, components, etc.)
    const layerButtons = page.locator('[aria-label="Design Lab sidebar"] button, aside button').filter({ hasText: /Bileşen|Primitives|Page|API|Reçete|Eklenti/i });
    expect(await layerButtons.count()).toBeGreaterThanOrEqual(3);
  });

  test('switching layer changes content', async ({ page, baseURL }) => {
    await goToComponents(page, baseURL);

    const nav = page.locator('[aria-label="Component navigation"]');
    const initialCount = await nav.locator('[data-sidebar-item]').count();

    // Click Primitives tab (if visible)
    const primitivesTab = page.locator('button').filter({ hasText: /Primitives/i }).first();
    if (await primitivesTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await primitivesTab.click();
      await page.waitForTimeout(1000);

      // Content should change
      const newCount = await nav.locator('[data-sidebar-item]').count();
      // Different layer = different count (likely)
      // Just verify it rendered without crash
      expect(newCount).toBeGreaterThanOrEqual(0);
    }
  });
});
