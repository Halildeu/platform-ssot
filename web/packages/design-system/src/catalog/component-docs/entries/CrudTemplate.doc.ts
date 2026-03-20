import type { DesignLabComponentDocEntry } from '../types';
import pageLayoutEntry from './PageLayout.doc';

const baseIndexItem = pageLayoutEntry.indexItem;
const baseApiItem = pageLayoutEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'CRUD Template',
  indexItem: {
    name: 'CRUD Template',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'beta',
    group: 'page_blocks',
    subgroup: 'page_templates',
    taxonomyGroupId: 'page_blocks',
    taxonomySubgroup: 'Page Templates',
    demoMode: 'live',
    description: 'Filter bar, summary metrics ve data table akisini tek CRUD shell icinde birlestiren liste + yonetim template recipe sunar.',
    sectionIds: ['component_library_management', 'responsive_layout', 'navigation_patterns'],
    qualityGates: baseIndexItem.qualityGates,
    tags: ['page-template', 'crud', 'stable', 'page-blocks'],
    uxPrimaryThemeId: baseIndexItem.uxPrimaryThemeId,
    uxPrimarySubthemeId: baseIndexItem.uxPrimarySubthemeId,
    roadmapWaveId: baseIndexItem.roadmapWaveId,
    acceptanceContractId: baseIndexItem.acceptanceContractId,
    importStatement:
      "import { PageLayout, FilterBar, SummaryStrip, TableSimple } from '@mfe/design-system';",
    whereUsed: [
      'web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/showcase-families/buildLayoutShowcaseSections.tsx',
    ],
  },
  apiItem: baseApiItem
    ? {
        ...baseApiItem,
        name: 'CRUD Template',
        variantAxes: [
          'pageWidth: default | wide | full',
          'stickyHeader: true | false',
          'surface: content-only | detail-sidebar',
          'filters: search-bar | search-select | full-filter-bar',
          'density: comfortable | compact',
        ],
        behaviorModel: [
          'create/read/update/delete lifecycle state management',
          'filter bar and search coordination with table data',
          'bulk selection with action bar integration',
          'inline row editing with validation feedback',
          'responsive table-to-card layout adaptation',
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
            default: "'default'",
            required: false,
            description: 'CRUD liste genisligi — tam ekran admin tablolari icin "wide" veya "full" kullanilir.',
          },
          {
            name: 'stickyHeader',
            type: 'boolean',
            default: 'false',
            required: false,
            description: 'Header + filter bar scroll sirasinda sabit kalir.',
          },
          {
            name: 'responsiveDetailCollapse',
            type: 'boolean',
            default: 'false',
            required: false,
            description: 'Kucuk ekranda detail rail otomatik collapse olur.',
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
          'search and filter shell',
          'bulk-manage table rhythm',
          'summary-first list overview',
          'dense admin workflow',
        ],
        regressionFocus: [
          'filter bar placement',
          'table readability',
          'summary-to-table hierarchy',
          'detail rail width parity',
          'sticky header scroll behavior',
        ],
      }
    : null,
};

export default entry;
