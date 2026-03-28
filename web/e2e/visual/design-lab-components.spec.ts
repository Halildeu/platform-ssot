import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for every component page in the Design Lab.
 *
 * On first run these will FAIL because no baseline screenshots exist yet.
 * Generate baselines with:
 *   npx playwright test e2e/visual/design-lab-components.spec.ts --update-snapshots
 */

// ---------------------------------------------------------------------------
// Component catalogue — every route that lives under /admin/design-lab
// ---------------------------------------------------------------------------
const COMPONENT_ROUTES = [
  // Form inputs
  { name: 'Button', path: '/admin/design-lab/components/form_inputs/Button' },
  { name: 'Input', path: '/admin/design-lab/components/form_inputs/Input' },
  { name: 'TextArea', path: '/admin/design-lab/components/form_inputs/TextArea' },
  { name: 'Select', path: '/admin/design-lab/components/form_inputs/Select' },
  { name: 'Checkbox', path: '/admin/design-lab/components/form_inputs/Checkbox' },
  { name: 'Radio', path: '/admin/design-lab/components/form_inputs/Radio' },
  { name: 'Switch', path: '/admin/design-lab/components/form_inputs/Switch' },
  { name: 'Slider', path: '/admin/design-lab/components/form_inputs/Slider' },
  { name: 'DatePicker', path: '/admin/design-lab/components/form_inputs/DatePicker' },
  { name: 'TimePicker', path: '/admin/design-lab/components/form_inputs/TimePicker' },
  { name: 'Upload', path: '/admin/design-lab/components/form_inputs/Upload' },
  { name: 'Combobox', path: '/admin/design-lab/components/form_inputs/Combobox' },

  // Data display
  { name: 'TableSimple', path: '/admin/design-lab/components/data_display/TableSimple' },
  { name: 'List', path: '/admin/design-lab/components/data_display/List' },
  { name: 'TreeTable', path: '/admin/design-lab/components/data_display/TreeTable' },
  { name: 'Descriptions', path: '/admin/design-lab/components/data_display/Descriptions' },
  { name: 'Accordion', path: '/admin/design-lab/components/data_display/Accordion' },
  { name: 'Tabs', path: '/admin/design-lab/components/data_display/Tabs' },

  // AI native helpers
  { name: 'ApprovalReview', path: '/admin/design-lab/components/ai_native_helpers/ApprovalReview' },
  { name: 'ApprovalCheckpoint', path: '/admin/design-lab/components/ai_native_helpers/ApprovalCheckpoint' },
  { name: 'CitationPanel', path: '/admin/design-lab/components/ai_native_helpers/CitationPanel' },
  { name: 'CommandPalette', path: '/admin/design-lab/components/ai_native_helpers/CommandPalette' },

  // Navigation
  { name: 'MenuBar', path: '/admin/design-lab/components/navigation/MenuBar' },
  { name: 'Breadcrumb', path: '/admin/design-lab/components/navigation/Breadcrumb' },
  { name: 'Steps', path: '/admin/design-lab/components/navigation/Steps' },
  { name: 'Pagination', path: '/admin/design-lab/components/navigation/Pagination' },

  // Search & filtering
  { name: 'SearchFilterListing', path: '/admin/design-lab/components/search_filtering/SearchFilterListing' },

  // General identity / feedback
  { name: 'Badge', path: '/admin/design-lab/components/general_identity/Badge' },
  { name: 'Tag', path: '/admin/design-lab/components/general_identity/Tag' },
  { name: 'Avatar', path: '/admin/design-lab/components/general_identity/Avatar' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Selector alternatives for the live-preview section heading. */
const PREVIEW_HEADING_SELECTOR = [
  'h3:has-text("LIVE PREVIEW")',
  'h3:has-text("Live Preview")',
  'text=LIVE PREVIEW',
  'text=LİVE PREVİEW',
].join(', ');

/**
 * Try to locate the live-preview container. Falls back to <main> or the first
 * content wrapper if the heading is not present.
 */
async function getPreviewLocator(page: import('@playwright/test').Page) {
  // Wait a bit for the page to settle (fonts, lazy images, animations)
  await page.waitForTimeout(1500);

  // Attempt 1 — section / div wrapping the heading
  const previewByHeading = page
    .locator('section, div')
    .filter({ hasText: /LIVE PREVIEW|LİVE PREVİEW|Live Preview/ })
    .first();

  if (await previewByHeading.isVisible().catch(() => false)) {
    return previewByHeading;
  }

  // Attempt 2 — a container with a data attribute or class hint
  const previewByAttr = page.locator(
    '[data-testid="live-preview"], [class*="live-preview"], [class*="livePreview"], [class*="preview-area"]',
  ).first();

  if (await previewByAttr.isVisible().catch(() => false)) {
    return previewByAttr;
  }

  // Fallback — main content area
  return page.locator('main, [class*="content"]').first();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Design Lab - Component Visual Snapshots', () => {
  for (const component of COMPONENT_ROUTES) {
    test(`${component.name} - live preview renders correctly`, async ({ page }) => {
      await page.goto(component.path, { waitUntil: 'networkidle' });

      // Give the live preview section time to mount
      await page.waitForSelector(PREVIEW_HEADING_SELECTOR, { timeout: 10_000 }).catch(() => {
        // Not every page necessarily has the exact heading — we still screenshot.
      });

      const previewLocator = await getPreviewLocator(page);
      await expect(previewLocator).toHaveScreenshot(`${component.name}-preview.png`, {
        animations: 'disabled',
      });
    });
  }
});
