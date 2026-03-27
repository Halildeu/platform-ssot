import type { DesignLabComponentDocEntry } from '../types';
import pageLayoutEntry from './PageLayout.doc';

const baseIndexItem = pageLayoutEntry.indexItem;
const baseApiItem = pageLayoutEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'Dashboard Template',
  indexItem: {
    name: 'Dashboard Template',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'beta',
    group: 'page_blocks',
    subgroup: 'page_templates',
    taxonomyGroupId: 'page_blocks',
    taxonomySubgroup: 'Page Templates',
    demoMode: 'live',
    description: 'KPI strip, summary cards ve dashboard overview bloklarini tek sayfa shell icinde toplayan executive dashboard template recipe sunar.',
    sectionIds: ['component_library_management', 'responsive_layout', 'navigation_patterns'],
    qualityGates: baseIndexItem.qualityGates,
    tags: ['page-template', 'dashboard', 'stable', 'page-blocks'],
    uxPrimaryThemeId: baseIndexItem.uxPrimaryThemeId,
    uxPrimarySubthemeId: baseIndexItem.uxPrimarySubthemeId,
    roadmapWaveId: baseIndexItem.roadmapWaveId,
    acceptanceContractId: baseIndexItem.acceptanceContractId,
    importStatement:
      "import { PageLayout, SummaryStrip, Descriptions, Tabs } from '@mfe/design-system';",
    whereUsed: [
      'web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/showcase-families/buildLayoutShowcaseSections.tsx',
    ],
  },
  apiItem: baseApiItem
    ? {
        ...baseApiItem,
        name: 'Dashboard Template',
        variantAxes: [
          'pageWidth: default | wide | full',
          'stickyHeader: true | false',
          'surface: content-only | detail-sidebar',
          'header: title-only | actions | filters',
          'density: comfortable | compact',
        ],
        behaviorModel: [
          'KPI strip auto-refresh with configurable polling interval',
          'dashboard card grid responsive reflow across breakpoints',
          'tab-backed secondary navigation for dashboard sections',
          'summary card drill-down navigation to detail views',
          'date range filter coordination across all dashboard widgets',
          'theme-aware token resolution',
        ],
        previewStates: [
          'default',
          'loading',
          'empty',
          'error',
          'dark-theme',
        ],
        props: [
          {
            name: 'pageWidth',
            type: "'default' | 'wide' | 'full'",
            default: "'wide'",
            required: false,
            description: 'Dashboard genisligi — KPI ve ozet kartlari icin "wide" onerilir.',
          },
          {
            name: 'stickyHeader',
            type: 'boolean',
            default: 'false',
            required: false,
            description: 'Dashboard header scroll sirasinda sabit kalir.',
          },
          {
            name: 'responsiveDetailCollapse',
            type: 'boolean',
            default: 'false',
            required: false,
            description: 'Kucuk ekranda sidebar otomatik kapanir.',
          },
          {
            name: 'className',
            type: 'string',
            default: "''",
            required: false,
            description: 'Additional CSS class for custom styling.',
          },
          {
            name: 'size',
            type: "'sm' | 'md' | 'lg'",
            default: "'md'",
            required: false,
            description: 'Bilesen boyut varyantini belirler.',
          },
        ],
        previewFocus: [
          'dashboard hero shell',
          'metrics-first overview',
          'executive summary rhythm',
          'tab-backed secondary navigation',
        ],
        regressionFocus: [
          'header action wrap',
          'summary strip density',
          'overview card balance',
          'responsive dashboard stacking',
          'wide layout KPI alignment',
        ],
      }
    : null,
};

export default entry;
