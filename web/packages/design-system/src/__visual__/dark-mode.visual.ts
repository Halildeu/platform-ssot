import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — Dark Mode                                      */
/*                                                                     */
/*  Verifies dark mode rendering for ALL design system components.     */
/*  Uses Storybook globals to switch theme.                            */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

async function openStoryDark(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(
    `${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story&globals=theme:dark`,
    { waitUntil: 'networkidle' },
  );
  await page.waitForTimeout(500);
}

test.describe('Dark Mode', () => {
  /* ---------------------------------------------------------------- */
  /*  Primitives                                                       */
  /* ---------------------------------------------------------------- */

  test('Alert', async ({ page }) => {
    await openStoryDark(page, 'primitives-alert--default');
    await expect(page).toHaveScreenshot('alert-dark.png');
  });

  test('Avatar', async ({ page }) => {
    await openStoryDark(page, 'primitives-avatar--default');
    await expect(page).toHaveScreenshot('avatar-dark.png');
  });

  test('Badge', async ({ page }) => {
    await openStoryDark(page, 'primitives-badge--default');
    await expect(page).toHaveScreenshot('badge-dark.png');
  });

  test('Button', async ({ page }) => {
    await openStoryDark(page, 'primitives-button--default');
    await expect(page).toHaveScreenshot('button-dark.png');
  });

  test('Card', async ({ page }) => {
    await openStoryDark(page, 'primitives-card--default');
    await expect(page).toHaveScreenshot('card-dark.png');
  });

  test('Checkbox', async ({ page }) => {
    await openStoryDark(page, 'primitives-checkbox--default');
    await expect(page).toHaveScreenshot('checkbox-dark.png');
  });

  test('Dialog', async ({ page }) => {
    await openStoryDark(page, 'primitives-dialog--default');
    await expect(page).toHaveScreenshot('dialog-dark.png');
  });

  test('Divider', async ({ page }) => {
    await openStoryDark(page, 'primitives-divider--default');
    await expect(page).toHaveScreenshot('divider-dark.png');
  });

  test('Dropdown', async ({ page }) => {
    await openStoryDark(page, 'primitives-dropdown--default');
    await expect(page).toHaveScreenshot('dropdown-dark.png');
  });

  test('IconButton', async ({ page }) => {
    await openStoryDark(page, 'primitives-iconbutton--default');
    await expect(page).toHaveScreenshot('iconbutton-dark.png');
  });

  test('Input', async ({ page }) => {
    await openStoryDark(page, 'primitives-input--default');
    await expect(page).toHaveScreenshot('input-dark.png');
  });

  test('LinkInline', async ({ page }) => {
    await openStoryDark(page, 'primitives-linkinline--default');
    await expect(page).toHaveScreenshot('linkinline-dark.png');
  });

  test('Modal', async ({ page }) => {
    await openStoryDark(page, 'primitives-modal--default');
    await expect(page).toHaveScreenshot('modal-dark.png');
  });

  test('Popover', async ({ page }) => {
    await openStoryDark(page, 'primitives-popover--default');
    await expect(page).toHaveScreenshot('popover-dark.png');
  });

  test('Radio', async ({ page }) => {
    await openStoryDark(page, 'primitives-radio--default');
    await expect(page).toHaveScreenshot('radio-dark.png');
  });

  test('Select', async ({ page }) => {
    await openStoryDark(page, 'primitives-select--default');
    await expect(page).toHaveScreenshot('select-dark.png');
  });

  test('Skeleton', async ({ page }) => {
    await openStoryDark(page, 'primitives-skeleton--default');
    await expect(page).toHaveScreenshot('skeleton-dark.png');
  });

  test('Spinner', async ({ page }) => {
    await openStoryDark(page, 'primitives-spinner--default');
    await expect(page).toHaveScreenshot('spinner-dark.png');
  });

  test('Stack', async ({ page }) => {
    await openStoryDark(page, 'primitives-stack--default');
    await expect(page).toHaveScreenshot('stack-dark.png');
  });

  test('Switch', async ({ page }) => {
    await openStoryDark(page, 'primitives-switch--default');
    await expect(page).toHaveScreenshot('switch-dark.png');
  });

  test('Tag', async ({ page }) => {
    await openStoryDark(page, 'primitives-tag--default');
    await expect(page).toHaveScreenshot('tag-dark.png');
  });

  test('Textarea', async ({ page }) => {
    await openStoryDark(page, 'primitives-textarea--default');
    await expect(page).toHaveScreenshot('textarea-dark.png');
  });

  test('Text', async ({ page }) => {
    await openStoryDark(page, 'primitives-text--default');
    await expect(page).toHaveScreenshot('text-dark.png');
  });

  test('Tooltip', async ({ page }) => {
    await openStoryDark(page, 'primitives-tooltip--default');
    await expect(page).toHaveScreenshot('tooltip-dark.png');
  });

  /* ---------------------------------------------------------------- */
  /*  Components                                                       */
  /* ---------------------------------------------------------------- */

  test('Accordion', async ({ page }) => {
    await openStoryDark(page, 'components-accordion--default');
    await expect(page).toHaveScreenshot('accordion-dark.png');
  });

  test('AdaptiveForm', async ({ page }) => {
    await openStoryDark(page, 'components-adaptiveform--default');
    await expect(page).toHaveScreenshot('adaptiveform-dark.png');
  });

  test('AIActionAuditTimeline', async ({ page }) => {
    await openStoryDark(page, 'components-aiactionaudittimeline--default');
    await expect(page).toHaveScreenshot('aiactionaudittimeline-dark.png');
  });

  test('AIGuidedAuthoring', async ({ page }) => {
    await openStoryDark(page, 'components-aiguidedauthoring--default');
    await expect(page).toHaveScreenshot('aiguidedauthoring-dark.png');
  });

  test('AILayoutBuilder', async ({ page }) => {
    await openStoryDark(page, 'components-ailayoutbuilder--default');
    await expect(page).toHaveScreenshot('ailayoutbuilder-dark.png');
  });

  test('AnchorToc', async ({ page }) => {
    await openStoryDark(page, 'components-anchortoc--default');
    await expect(page).toHaveScreenshot('anchortoc-dark.png');
  });

  test('ApprovalCheckpoint', async ({ page }) => {
    await openStoryDark(page, 'components-approvalcheckpoint--default');
    await expect(page).toHaveScreenshot('approvalcheckpoint-dark.png');
  });

  test('ApprovalReview', async ({ page }) => {
    await openStoryDark(page, 'components-approvalreview--default');
    await expect(page).toHaveScreenshot('approvalreview-dark.png');
  });

  test('Autocomplete', async ({ page }) => {
    await openStoryDark(page, 'components-autocomplete--default');
    await expect(page).toHaveScreenshot('autocomplete-dark.png');
  });

  test('AvatarGroup', async ({ page }) => {
    await openStoryDark(page, 'components-avatargroup--default');
    await expect(page).toHaveScreenshot('avatargroup-dark.png');
  });

  test('Breadcrumb', async ({ page }) => {
    await openStoryDark(page, 'components-breadcrumb--default');
    await expect(page).toHaveScreenshot('breadcrumb-dark.png');
  });

  test('Calendar', async ({ page }) => {
    await openStoryDark(page, 'components-calendar--default');
    await expect(page).toHaveScreenshot('calendar-dark.png');
  });

  test('Carousel', async ({ page }) => {
    await openStoryDark(page, 'components-carousel--default');
    await expect(page).toHaveScreenshot('carousel-dark.png');
  });

  test('Cascader', async ({ page }) => {
    await openStoryDark(page, 'components-cascader--default');
    await expect(page).toHaveScreenshot('cascader-dark.png');
  });

  test('Charts', async ({ page }) => {
    await openStoryDark(page, 'components-charts--default');
    await expect(page).toHaveScreenshot('charts-dark.png');
  });

  test('CitationPanel', async ({ page }) => {
    await openStoryDark(page, 'components-citationpanel--default');
    await expect(page).toHaveScreenshot('citationpanel-dark.png');
  });

  test('ColorPicker', async ({ page }) => {
    await openStoryDark(page, 'components-colorpicker--default');
    await expect(page).toHaveScreenshot('colorpicker-dark.png');
  });

  test('Combobox', async ({ page }) => {
    await openStoryDark(page, 'components-combobox--default');
    await expect(page).toHaveScreenshot('combobox-dark.png');
  });

  test('CommandPalette', async ({ page }) => {
    await openStoryDark(page, 'components-commandpalette--default');
    await expect(page).toHaveScreenshot('commandpalette-dark.png');
  });

  test('ConfidenceBadge', async ({ page }) => {
    await openStoryDark(page, 'components-confidencebadge--default');
    await expect(page).toHaveScreenshot('confidencebadge-dark.png');
  });

  test('ContextMenu', async ({ page }) => {
    await openStoryDark(page, 'components-contextmenu--default');
    await expect(page).toHaveScreenshot('contextmenu-dark.png');
  });

  test('DatePicker', async ({ page }) => {
    await openStoryDark(page, 'components-datepicker--default');
    await expect(page).toHaveScreenshot('datepicker-dark.png');
  });

  test('Descriptions', async ({ page }) => {
    await openStoryDark(page, 'components-descriptions--default');
    await expect(page).toHaveScreenshot('descriptions-dark.png');
  });

  test('DetailSectionTabs', async ({ page }) => {
    await openStoryDark(page, 'components-detailsectiontabs--default');
    await expect(page).toHaveScreenshot('detailsectiontabs-dark.png');
  });

  test('EmptyErrorLoading', async ({ page }) => {
    await openStoryDark(page, 'components-emptyerrorloading--default');
    await expect(page).toHaveScreenshot('emptyerrorloading-dark.png');
  });

  test('EmptyState', async ({ page }) => {
    await openStoryDark(page, 'components-emptystate--default');
    await expect(page).toHaveScreenshot('emptystate-dark.png');
  });

  test('FloatButton', async ({ page }) => {
    await openStoryDark(page, 'components-floatbutton--default');
    await expect(page).toHaveScreenshot('floatbutton-dark.png');
  });

  test('FormField', async ({ page }) => {
    await openStoryDark(page, 'components-formfield--default');
    await expect(page).toHaveScreenshot('formfield-dark.png');
  });

  test('InputNumber', async ({ page }) => {
    await openStoryDark(page, 'components-inputnumber--default');
    await expect(page).toHaveScreenshot('inputnumber-dark.png');
  });

  test('JsonViewer', async ({ page }) => {
    await openStoryDark(page, 'components-jsonviewer--default');
    await expect(page).toHaveScreenshot('jsonviewer-dark.png');
  });

  test('List', async ({ page }) => {
    await openStoryDark(page, 'components-list--default');
    await expect(page).toHaveScreenshot('list-dark.png');
  });

  test('Mentions', async ({ page }) => {
    await openStoryDark(page, 'components-mentions--default');
    await expect(page).toHaveScreenshot('mentions-dark.png');
  });

  test('MenuBar', async ({ page }) => {
    await openStoryDark(page, 'components-menubar--default');
    await expect(page).toHaveScreenshot('menubar-dark.png');
  });

  test('NavigationRail', async ({ page }) => {
    await openStoryDark(page, 'components-navigationrail--default');
    await expect(page).toHaveScreenshot('navigationrail-dark.png');
  });

  test('NotificationDrawer', async ({ page }) => {
    await openStoryDark(page, 'components-notificationdrawer--default');
    await expect(page).toHaveScreenshot('notificationdrawer-dark.png');
  });

  test('Pagination', async ({ page }) => {
    await openStoryDark(page, 'components-pagination--default');
    await expect(page).toHaveScreenshot('pagination-dark.png');
  });

  test('PromptComposer', async ({ page }) => {
    await openStoryDark(page, 'components-promptcomposer--default');
    await expect(page).toHaveScreenshot('promptcomposer-dark.png');
  });

  test('QRCode', async ({ page }) => {
    await openStoryDark(page, 'components-qrcode--default');
    await expect(page).toHaveScreenshot('qrcode-dark.png');
  });

  test('Rating', async ({ page }) => {
    await openStoryDark(page, 'components-rating--default');
    await expect(page).toHaveScreenshot('rating-dark.png');
  });

  test('RecommendationCard', async ({ page }) => {
    await openStoryDark(page, 'components-recommendationcard--default');
    await expect(page).toHaveScreenshot('recommendationcard-dark.png');
  });

  test('SearchFilterListing', async ({ page }) => {
    await openStoryDark(page, 'components-searchfilterlisting--default');
    await expect(page).toHaveScreenshot('searchfilterlisting-dark.png');
  });

  test('SearchInput', async ({ page }) => {
    await openStoryDark(page, 'components-searchinput--default');
    await expect(page).toHaveScreenshot('searchinput-dark.png');
  });

  test('Segmented', async ({ page }) => {
    await openStoryDark(page, 'components-segmented--default');
    await expect(page).toHaveScreenshot('segmented-dark.png');
  });

  test('Slider', async ({ page }) => {
    await openStoryDark(page, 'components-slider--default');
    await expect(page).toHaveScreenshot('slider-dark.png');
  });

  test('SmartDashboard', async ({ page }) => {
    await openStoryDark(page, 'components-smartdashboard--default');
    await expect(page).toHaveScreenshot('smartdashboard-dark.png');
  });

  test('Steps', async ({ page }) => {
    await openStoryDark(page, 'components-steps--default');
    await expect(page).toHaveScreenshot('steps-dark.png');
  });

  test('TableSimple', async ({ page }) => {
    await openStoryDark(page, 'components-tablesimple--default');
    await expect(page).toHaveScreenshot('tablesimple-dark.png');
  });

  test('Tabs', async ({ page }) => {
    await openStoryDark(page, 'components-tabs--default');
    await expect(page).toHaveScreenshot('tabs-dark.png');
  });

  test('ThemePresetGallery', async ({ page }) => {
    await openStoryDark(page, 'components-themepresetgallery--default');
    await expect(page).toHaveScreenshot('themepresetgallery-dark.png');
  });

  test('ThemePreviewCard', async ({ page }) => {
    await openStoryDark(page, 'components-themepreviewcard--default');
    await expect(page).toHaveScreenshot('themepreviewcard-dark.png');
  });

  test('TimePicker', async ({ page }) => {
    await openStoryDark(page, 'components-timepicker--default');
    await expect(page).toHaveScreenshot('timepicker-dark.png');
  });

  test('Timeline', async ({ page }) => {
    await openStoryDark(page, 'components-timeline--default');
    await expect(page).toHaveScreenshot('timeline-dark.png');
  });

  test('Toast', async ({ page }) => {
    await openStoryDark(page, 'components-toast--default');
    await expect(page).toHaveScreenshot('toast-dark.png');
  });

  test('TourCoachmarks', async ({ page }) => {
    await openStoryDark(page, 'components-tourcoachmarks--default');
    await expect(page).toHaveScreenshot('tourcoachmarks-dark.png');
  });

  test('Transfer', async ({ page }) => {
    await openStoryDark(page, 'components-transfer--default');
    await expect(page).toHaveScreenshot('transfer-dark.png');
  });

  test('Tree', async ({ page }) => {
    await openStoryDark(page, 'components-tree--default');
    await expect(page).toHaveScreenshot('tree-dark.png');
  });

  test('TreeTable', async ({ page }) => {
    await openStoryDark(page, 'components-treetable--default');
    await expect(page).toHaveScreenshot('treetable-dark.png');
  });

  test('Upload', async ({ page }) => {
    await openStoryDark(page, 'components-upload--default');
    await expect(page).toHaveScreenshot('upload-dark.png');
  });

  test('Watermark', async ({ page }) => {
    await openStoryDark(page, 'components-watermark--default');
    await expect(page).toHaveScreenshot('watermark-dark.png');
  });

  /* ---------------------------------------------------------------- */
  /*  Patterns                                                         */
  /* ---------------------------------------------------------------- */

  test('DetailDrawer', async ({ page }) => {
    await openStoryDark(page, 'patterns-detaildrawer--default');
    await expect(page).toHaveScreenshot('detaildrawer-dark.png');
  });

  test('DetailSummary', async ({ page }) => {
    await openStoryDark(page, 'patterns-detailsummary--default');
    await expect(page).toHaveScreenshot('detailsummary-dark.png');
  });

  test('EntitySummaryBlock', async ({ page }) => {
    await openStoryDark(page, 'patterns-entitysummaryblock--default');
    await expect(page).toHaveScreenshot('entitysummaryblock-dark.png');
  });

  test('FilterBar', async ({ page }) => {
    await openStoryDark(page, 'patterns-filterbar--default');
    await expect(page).toHaveScreenshot('filterbar-dark.png');
  });

  test('FormDrawer', async ({ page }) => {
    await openStoryDark(page, 'patterns-formdrawer--default');
    await expect(page).toHaveScreenshot('formdrawer-dark.png');
  });

  test('MasterDetail', async ({ page }) => {
    await openStoryDark(page, 'patterns-masterdetail--default');
    await expect(page).toHaveScreenshot('masterdetail-dark.png');
  });

  test('PageHeader', async ({ page }) => {
    await openStoryDark(page, 'patterns-pageheader--default');
    await expect(page).toHaveScreenshot('pageheader-dark.png');
  });

  test('PageLayout', async ({ page }) => {
    await openStoryDark(page, 'patterns-pagelayout--default');
    await expect(page).toHaveScreenshot('pagelayout-dark.png');
  });

  test('ReportFilterPanel', async ({ page }) => {
    await openStoryDark(page, 'patterns-reportfilterpanel--default');
    await expect(page).toHaveScreenshot('reportfilterpanel-dark.png');
  });

  test('SummaryStrip', async ({ page }) => {
    await openStoryDark(page, 'patterns-summarystrip--default');
    await expect(page).toHaveScreenshot('summarystrip-dark.png');
  });
});
