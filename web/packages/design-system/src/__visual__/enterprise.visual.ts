import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — Enterprise Components                          */
/*                                                                     */
/*  Captures baseline screenshots of enterprise components via         */
/*  Storybook.                                                         */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

async function openStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(500);
}

/* ---- ActivityFeed ---- */

test.describe('ActivityFeed', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-activity-feed--default');
    await expect(page).toHaveScreenshot('activity-feed-default.png');
  });
});

/* ---- BoxPlot ---- */

test.describe('BoxPlot', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-box-plot--default');
    await expect(page).toHaveScreenshot('box-plot-default.png');
  });
});

/* ---- CommentThread ---- */

test.describe('CommentThread', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-comment-thread--default');
    await expect(page).toHaveScreenshot('comment-thread-default.png');
  });
});

/* ---- ControlChart ---- */

test.describe('ControlChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-control-chart--default');
    await expect(page).toHaveScreenshot('control-chart-default.png');
  });
});

/* ---- DecisionMatrix ---- */

test.describe('DecisionMatrix', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-decision-matrix--default');
    await expect(page).toHaveScreenshot('decision-matrix-default.png');
  });
});

/* ---- FileUploadZone ---- */

test.describe('FileUploadZone', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-file-upload-zone--default');
    await expect(page).toHaveScreenshot('file-upload-zone-default.png');
  });
});

/* ---- FlowBuilder ---- */

test.describe('FlowBuilder', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-flow-builder--default');
    await expect(page).toHaveScreenshot('flow-builder-default.png');
  });
});

/* ---- GaugeChart ---- */

test.describe('GaugeChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-gauge-chart--default');
    await expect(page).toHaveScreenshot('gauge-chart-default.png');
  });
});

/* ---- HistogramChart ---- */

test.describe('HistogramChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-histogram-chart--default');
    await expect(page).toHaveScreenshot('histogram-chart-default.png');
  });
});

/* ---- MetricComparisonCard ---- */

test.describe('MetricComparisonCard', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-metric-comparison-card--default');
    await expect(page).toHaveScreenshot('metric-comparison-card-default.png');
  });
});

/* ---- OrgChart ---- */

test.describe('OrgChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-org-chart--default');
    await expect(page).toHaveScreenshot('org-chart-default.png');
  });
});

/* ---- PivotTable ---- */

test.describe('PivotTable', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-pivot-table--default');
    await expect(page).toHaveScreenshot('pivot-table-default.png');
  });
});

/* ---- SWOTMatrix ---- */

test.describe('SWOTMatrix', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-s-w-o-t-matrix--default');
    await expect(page).toHaveScreenshot('s-w-o-t-matrix-default.png');
  });
});
