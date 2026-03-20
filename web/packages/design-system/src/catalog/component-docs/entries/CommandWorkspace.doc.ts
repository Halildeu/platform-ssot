import type { DesignLabComponentDocEntry } from '../types';
import pageLayoutEntry from './PageLayout.doc';

const baseIndexItem = pageLayoutEntry.indexItem;
const baseApiItem = pageLayoutEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'Command Workspace',
  indexItem: {
    name: 'Command Workspace',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'beta',
    group: 'page_blocks',
    subgroup: 'page_templates',
    taxonomyGroupId: 'page_blocks',
    taxonomySubgroup: 'Page Templates',
    demoMode: 'live',
    description: 'Search-first command surface, recent work queue ve action-ready result panelini ayni sayfa shell icinde gosteren command workspace template recipe sunar.',
    sectionIds: ['component_library_management', 'responsive_layout', 'navigation_patterns'],
    qualityGates: baseIndexItem.qualityGates,
    tags: ['page-template', 'command', 'stable', 'page-blocks'],
    uxPrimaryThemeId: baseIndexItem.uxPrimaryThemeId,
    uxPrimarySubthemeId: baseIndexItem.uxPrimarySubthemeId,
    roadmapWaveId: baseIndexItem.roadmapWaveId,
    acceptanceContractId: baseIndexItem.acceptanceContractId,
    importStatement:
      "import { PageLayout, FilterBar, SummaryStrip, TableSimple, Tabs } from '@mfe/design-system';",
    whereUsed: [
      'web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/showcase-families/buildLayoutShowcaseSections.tsx',
    ],
  },
  apiItem: baseApiItem
    ? {
        ...baseApiItem,
        name: 'Command Workspace',
        variantAxes: [
          'pageWidth: default | wide | full',
          'stickyHeader: true | false',
          'surface: content-only | detail-sidebar',
          'header: title-only | actions | filters',
          'density: comfortable | compact',
        ],
        behaviorModel: [
          'search-first focus management on workspace mount',
          'command result keyboard navigation and selection',
          'recent work queue auto-population from navigation history',
          'responsive detail panel collapse at narrow viewports',
          'sticky search bar persistence during content scroll',
          'theme-aware token resolution',
        ],
        previewStates: [
          'default',
          'search-active',
          'empty-results',
          'loading',
          'dark-theme',
        ],
        props: [
          {
            name: 'pageWidth',
            type: "'default' | 'wide' | 'full'",
            default: "'wide'",
            required: false,
            description: 'Command workspace genisligi — genis arama ve sonuc paneli icin "wide" onerilir.',
          },
          {
            name: 'stickyHeader',
            type: 'boolean',
            default: 'true',
            required: false,
            description: 'Search header scroll sirasinda sabit kalir.',
          },
          {
            name: 'responsiveDetailCollapse',
            type: 'boolean',
            default: 'true',
            required: false,
            description: 'Command context paneli kucuk ekranda otomatik collapse olur.',
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
          'search-first workflow',
          'recent queue visibility',
          'fast command handoff',
          'action-ready result panel',
        ],
        regressionFocus: [
          'search field prominence',
          'recent queue readability',
          'command result density',
          'secondary nav continuity',
          'sticky search bar behavior',
        ],
      }
    : null,
};

export default entry;
