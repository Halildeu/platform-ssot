import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — Extended Component Coverage                    */
/*                                                                     */
/*  Captures baseline screenshots for additional components,           */
/*  providers, form controls, motion, advanced, and internal modules   */
/*  via Storybook.                                                     */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

async function openStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(500);
}

/* ================================================================== */
/*  Primitives                                                         */
/* ================================================================== */

test.describe('FieldControlPrimitives', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-field-control-primitives--default');
    await expect(page).toHaveScreenshot('field-control-primitives-default.png');
  });
});

test.describe('Slot', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-slot--default');
    await expect(page).toHaveScreenshot('slot-default.png');
  });
});

test.describe('IconButton', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-icon-button--default');
    await expect(page).toHaveScreenshot('icon-button-default.png');
  });
});

test.describe('LinkInline', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-link-inline--default');
    await expect(page).toHaveScreenshot('link-inline-default.png');
  });
});

/* ================================================================== */
/*  Form Controls                                                      */
/* ================================================================== */

test.describe('FormContext', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'form-form-context--default');
    await expect(page).toHaveScreenshot('form-context-default.png');
  });
});

test.describe('ConnectedFormField', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'form-connected-form-field--default');
    await expect(page).toHaveScreenshot('connected-form-field-default.png');
  });
});

test.describe('ConnectedCheckbox', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'form-connected-checkbox--default');
    await expect(page).toHaveScreenshot('connected-checkbox-default.png');
  });
});

test.describe('ConnectedInput', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'form-connected-input--default');
    await expect(page).toHaveScreenshot('connected-input-default.png');
  });
});

test.describe('ConnectedRadio', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'form-connected-radio--default');
    await expect(page).toHaveScreenshot('connected-radio-default.png');
  });
});

test.describe('ConnectedSelect', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'form-connected-select--default');
    await expect(page).toHaveScreenshot('connected-select-default.png');
  });
});

test.describe('ConnectedTextarea', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'form-connected-textarea--default');
    await expect(page).toHaveScreenshot('connected-textarea-default.png');
  });
});

/* ================================================================== */
/*  Motion                                                             */
/* ================================================================== */

test.describe('AnimatePresence', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'motion-animate-presence--default');
    await expect(page).toHaveScreenshot('animate-presence-default.png');
  });
});

test.describe('StaggerGroup', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'motion-stagger-group--default');
    await expect(page).toHaveScreenshot('stagger-group-default.png');
  });
});

test.describe('Transition', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'motion-transition--default');
    await expect(page).toHaveScreenshot('transition-default.png');
  });
});

/* ================================================================== */
/*  Advanced                                                           */
/* ================================================================== */

test.describe('AgGridServer', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'advanced-ag-grid-server--default');
    await expect(page).toHaveScreenshot('ag-grid-server-default.png');
  });
});

test.describe('EntityGridTemplate', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'advanced-entity-grid-template--default');
    await expect(page).toHaveScreenshot('entity-grid-template-default.png');
  });
});

test.describe('GridShell', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'advanced-grid-shell--default');
    await expect(page).toHaveScreenshot('grid-shell-default.png');
  });
});

test.describe('GridToolbar', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'advanced-grid-toolbar--default');
    await expect(page).toHaveScreenshot('grid-toolbar-default.png');
  });
});

test.describe('TablePagination', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'advanced-table-pagination--default');
    await expect(page).toHaveScreenshot('table-pagination-default.png');
  });
});

test.describe('VariantIntegration', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'advanced-variant-integration--default');
    await expect(page).toHaveScreenshot('variant-integration-default.png');
  });
});

/* ================================================================== */
/*  Components (extended)                                              */
/* ================================================================== */

test.describe('ErrorBoundary', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-error-boundary--default');
    await expect(page).toHaveScreenshot('error-boundary-default.png');
  });
});

test.describe('AdaptiveForm', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-adaptive-form--default');
    await expect(page).toHaveScreenshot('adaptive-form-default.png');
  });
});

test.describe('AIActionAuditTimeline', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-a-i-action-audit-timeline--default');
    await expect(page).toHaveScreenshot('a-i-action-audit-timeline-default.png');
  });
});

test.describe('AIGuidedAuthoring', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-a-i-guided-authoring--default');
    await expect(page).toHaveScreenshot('a-i-guided-authoring-default.png');
  });
});

test.describe('AILayoutBuilder', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-a-i-layout-builder--default');
    await expect(page).toHaveScreenshot('a-i-layout-builder-default.png');
  });
});

test.describe('AnchorToc', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-anchor-toc--default');
    await expect(page).toHaveScreenshot('anchor-toc-default.png');
  });
});

test.describe('ApprovalCheckpoint', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-approval-checkpoint--default');
    await expect(page).toHaveScreenshot('approval-checkpoint-default.png');
  });
});

test.describe('ApprovalReview', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-approval-review--default');
    await expect(page).toHaveScreenshot('approval-review-default.png');
  });
});

test.describe('AreaChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-area-chart--default');
    await expect(page).toHaveScreenshot('area-chart-default.png');
  });
});

test.describe('AvatarGroup', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-avatar-group--default');
    await expect(page).toHaveScreenshot('avatar-group-default.png');
  });
});

test.describe('BarChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-bar-chart--default');
    await expect(page).toHaveScreenshot('bar-chart-default.png');
  });
});

test.describe('CitationPanel', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-citation-panel--default');
    await expect(page).toHaveScreenshot('citation-panel-default.png');
  });
});

test.describe('ColorPicker extended', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-color-picker--default');
    await expect(page).toHaveScreenshot('color-picker-default.png');
  });
});

test.describe('CommandPalette extended', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-command-palette--default');
    await expect(page).toHaveScreenshot('command-palette-default.png');
  });
});

test.describe('ConfidenceBadge', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-confidence-badge--default');
    await expect(page).toHaveScreenshot('confidence-badge-default.png');
  });
});

test.describe('ContextMenu', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-context-menu--default');
    await expect(page).toHaveScreenshot('context-menu-default.png');
  });
});

test.describe('DatePicker extended', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-date-picker--default');
    await expect(page).toHaveScreenshot('date-picker-default.png');
  });
});

test.describe('DetailSectionTabs', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-detail-section-tabs--default');
    await expect(page).toHaveScreenshot('detail-section-tabs-default.png');
  });
});

test.describe('EmptyErrorLoading', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-empty-error-loading--default');
    await expect(page).toHaveScreenshot('empty-error-loading-default.png');
  });
});

test.describe('EmptyState', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-empty-state--default');
    await expect(page).toHaveScreenshot('empty-state-default.png');
  });
});

test.describe('FloatButton', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-float-button--default');
    await expect(page).toHaveScreenshot('float-button-default.png');
  });
});

test.describe('FormField', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-form-field--default');
    await expect(page).toHaveScreenshot('form-field-default.png');
  });
});

test.describe('InputNumber', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-input-number--default');
    await expect(page).toHaveScreenshot('input-number-default.png');
  });
});

test.describe('JsonViewer', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-json-viewer--default');
    await expect(page).toHaveScreenshot('json-viewer-default.png');
  });
});

test.describe('LineChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-line-chart--default');
    await expect(page).toHaveScreenshot('line-chart-default.png');
  });
});

test.describe('MenuBar', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-menu-bar--default');
    await expect(page).toHaveScreenshot('menu-bar-default.png');
  });
});

test.describe('NavigationRail', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-navigation-rail--default');
    await expect(page).toHaveScreenshot('navigation-rail-default.png');
  });
});

test.describe('NotificationDrawer', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-notification-drawer--default');
    await expect(page).toHaveScreenshot('notification-drawer-default.png');
  });
});

test.describe('NotificationItemCard', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-notification-item-card--default');
    await expect(page).toHaveScreenshot('notification-item-card-default.png');
  });
});

test.describe('NotificationPanel', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-notification-panel--default');
    await expect(page).toHaveScreenshot('notification-panel-default.png');
  });
});

test.describe('PieChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-pie-chart--default');
    await expect(page).toHaveScreenshot('pie-chart-default.png');
  });
});

test.describe('PromptComposer', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-prompt-composer--default');
    await expect(page).toHaveScreenshot('prompt-composer-default.png');
  });
});

test.describe('QRCode', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-q-r-code--default');
    await expect(page).toHaveScreenshot('q-r-code-default.png');
  });
});

test.describe('RecommendationCard', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-recommendation-card--default');
    await expect(page).toHaveScreenshot('recommendation-card-default.png');
  });
});

test.describe('SearchFilterListing', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-search-filter-listing--default');
    await expect(page).toHaveScreenshot('search-filter-listing-default.png');
  });
});

test.describe('SearchInput', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-search-input--default');
    await expect(page).toHaveScreenshot('search-input-default.png');
  });
});

test.describe('SectionTabs', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-section-tabs--default');
    await expect(page).toHaveScreenshot('section-tabs-default.png');
  });
});

test.describe('SmartDashboard', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-smart-dashboard--default');
    await expect(page).toHaveScreenshot('smart-dashboard-default.png');
  });
});

test.describe('TableSimple', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-table-simple--default');
    await expect(page).toHaveScreenshot('table-simple-default.png');
  });
});

test.describe('ThemePresetCompare', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-theme-preset-compare--default');
    await expect(page).toHaveScreenshot('theme-preset-compare-default.png');
  });
});

test.describe('ThemePresetGallery', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-theme-preset-gallery--default');
    await expect(page).toHaveScreenshot('theme-preset-gallery-default.png');
  });
});

test.describe('ThemePreviewCard', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-theme-preview-card--default');
    await expect(page).toHaveScreenshot('theme-preview-card-default.png');
  });
});

test.describe('TimePicker', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-time-picker--default');
    await expect(page).toHaveScreenshot('time-picker-default.png');
  });
});

test.describe('TourCoachmarks', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-tour-coachmarks--default');
    await expect(page).toHaveScreenshot('tour-coachmarks-default.png');
  });
});

test.describe('TreeTable', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-tree-table--default');
    await expect(page).toHaveScreenshot('tree-table-default.png');
  });
});

/* ================================================================== */
/*  Enterprise (extended)                                              */
/* ================================================================== */

test.describe('AgingBuckets', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-aging-buckets--default');
    await expect(page).toHaveScreenshot('aging-buckets-default.png');
  });
});

test.describe('ApprovalWorkflow', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-approval-workflow--default');
    await expect(page).toHaveScreenshot('approval-workflow-default.png');
  });
});

test.describe('BulletChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-bullet-chart--default');
    await expect(page).toHaveScreenshot('bullet-chart-default.png');
  });
});

test.describe('ComparisonTable', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-comparison-table--default');
    await expect(page).toHaveScreenshot('comparison-table-default.png');
  });
});

test.describe('DataExportDialog', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-data-export-dialog--default');
    await expect(page).toHaveScreenshot('data-export-dialog-default.png');
  });
});

test.describe('DateRangePicker', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-date-range-picker--default');
    await expect(page).toHaveScreenshot('date-range-picker-default.png');
  });
});

test.describe('EmptyStateBuilder', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-empty-state-builder--default');
    await expect(page).toHaveScreenshot('empty-state-builder-default.png');
  });
});

test.describe('ExecutiveKPIStrip', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-executive-k-p-i-strip--default');
    await expect(page).toHaveScreenshot('executive-k-p-i-strip-default.png');
  });
});

test.describe('FilterPresets', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-filter-presets--default');
    await expect(page).toHaveScreenshot('filter-presets-default.png');
  });
});

test.describe('FineKinney', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-fine-kinney--default');
    await expect(page).toHaveScreenshot('fine-kinney-default.png');
  });
});

test.describe('FunnelChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-funnel-chart--default');
    await expect(page).toHaveScreenshot('funnel-chart-default.png');
  });
});

test.describe('GanttTimeline', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-gantt-timeline--default');
    await expect(page).toHaveScreenshot('gantt-timeline-default.png');
  });
});

test.describe('GovernanceBoard', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-governance-board--default');
    await expect(page).toHaveScreenshot('governance-board-default.png');
  });
});

test.describe('HeatmapCalendar', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-heatmap-calendar--default');
    await expect(page).toHaveScreenshot('heatmap-calendar-default.png');
  });
});

test.describe('InlineEdit', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-inline-edit--default');
    await expect(page).toHaveScreenshot('inline-edit-default.png');
  });
});

test.describe('MicroChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-micro-chart--default');
    await expect(page).toHaveScreenshot('micro-chart-default.png');
  });
});

test.describe('NotificationCenter', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-notification-center--default');
    await expect(page).toHaveScreenshot('notification-center-default.png');
  });
});

test.describe('ParetoChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-pareto-chart--default');
    await expect(page).toHaveScreenshot('pareto-chart-default.png');
  });
});

test.describe('ProcessFlow', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-process-flow--default');
    await expect(page).toHaveScreenshot('process-flow-default.png');
  });
});

test.describe('RadarChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-radar-chart--default');
    await expect(page).toHaveScreenshot('radar-chart-default.png');
  });
});

test.describe('RiskMatrix', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-risk-matrix--default');
    await expect(page).toHaveScreenshot('risk-matrix-default.png');
  });
});

test.describe('SankeyDiagram', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-sankey-diagram--default');
    await expect(page).toHaveScreenshot('sankey-diagram-default.png');
  });
});

test.describe('StatusTimeline', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-status-timeline--default');
    await expect(page).toHaveScreenshot('status-timeline-default.png');
  });
});

test.describe('ThemeLayout', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-theme-layout--default');
    await expect(page).toHaveScreenshot('theme-layout-default.png');
  });
});

test.describe('TrainingTracker', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-training-tracker--default');
    await expect(page).toHaveScreenshot('training-tracker-default.png');
  });
});

test.describe('TreemapChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-treemap-chart--default');
    await expect(page).toHaveScreenshot('treemap-chart-default.png');
  });
});

test.describe('ValueStream', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-value-stream--default');
    await expect(page).toHaveScreenshot('value-stream-default.png');
  });
});

test.describe('WaterfallChart', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'enterprise-waterfall-chart--default');
    await expect(page).toHaveScreenshot('waterfall-chart-default.png');
  });
});

/* ================================================================== */
/*  Patterns                                                           */
/* ================================================================== */

test.describe('DetailDrawer', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-detail-drawer--default');
    await expect(page).toHaveScreenshot('detail-drawer-default.png');
  });
});

test.describe('DetailSummary', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-detail-summary--default');
    await expect(page).toHaveScreenshot('detail-summary-default.png');
  });
});

test.describe('EntitySummaryBlock', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-entity-summary-block--default');
    await expect(page).toHaveScreenshot('entity-summary-block-default.png');
  });
});

test.describe('FilterBar', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-filter-bar--default');
    await expect(page).toHaveScreenshot('filter-bar-default.png');
  });
});

test.describe('FormDrawer', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-form-drawer--default');
    await expect(page).toHaveScreenshot('form-drawer-default.png');
  });
});

test.describe('MasterDetail', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-master-detail--default');
    await expect(page).toHaveScreenshot('master-detail-default.png');
  });
});

test.describe('PageHeader', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-page-header--default');
    await expect(page).toHaveScreenshot('page-header-default.png');
  });
});

test.describe('PageLayout', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-page-layout--default');
    await expect(page).toHaveScreenshot('page-layout-default.png');
  });
});

test.describe('ReportFilterPanel', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-report-filter-panel--default');
    await expect(page).toHaveScreenshot('report-filter-panel-default.png');
  });
});

test.describe('SummaryStrip', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-summary-strip--default');
    await expect(page).toHaveScreenshot('summary-strip-default.png');
  });
});
