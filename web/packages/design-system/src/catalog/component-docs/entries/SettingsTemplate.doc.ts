import type { DesignLabComponentDocEntry } from '../types';
import pageLayoutEntry from './PageLayout.doc';

const baseIndexItem = pageLayoutEntry.indexItem;
const baseApiItem = pageLayoutEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'Settings Template',
  indexItem: {
    name: 'Settings Template',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'beta',
    group: 'page_blocks',
    subgroup: 'page_templates',
    taxonomyGroupId: 'page_blocks',
    taxonomySubgroup: 'Page Templates',
    demoMode: 'live',
    description: 'Section tabs, configuration summaries ve policy-aware aside ile ayarlar ekranlari icin canonical settings template recipe sunar.',
    sectionIds: ['component_library_management', 'responsive_layout', 'navigation_patterns'],
    qualityGates: baseIndexItem.qualityGates,
    tags: ['page-template', 'settings', 'stable', 'page-blocks'],
    uxPrimaryThemeId: baseIndexItem.uxPrimaryThemeId,
    uxPrimarySubthemeId: baseIndexItem.uxPrimarySubthemeId,
    roadmapWaveId: baseIndexItem.roadmapWaveId,
    acceptanceContractId: baseIndexItem.acceptanceContractId,
    importStatement:
      "import { PageLayout, Tabs, Descriptions, SummaryStrip } from '@mfe/design-system';",
    whereUsed: [
      'web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/showcase-families/buildLayoutShowcaseSections.tsx',
    ],
  },
  apiItem: baseApiItem
    ? {
        ...baseApiItem,
        name: 'Settings Template',
        variantAxes: [
          'pageWidth: default | wide | full',
          'stickyHeader: true | false',
          'surface: content-only | detail-sidebar',
          'header: title-only | actions | filters',
          'footer: none | sticky-summary',
        ],
        behaviorModel: [
          'section tab navigation with scroll-to-section anchoring',
          'configuration form dirty state tracking and save guard',
          'policy-aware aside panel with contextual guardrails',
          'responsive settings stack collapsing aside at narrow viewports',
          'unsaved changes confirmation dialog on navigation away',
          'theme-aware token resolution',
        ],
        previewStates: [
          'default',
          'loading',
          'dirty-form',
          'error',
          'dark-theme',
        ],
        props: [
          {
            name: 'pageWidth',
            type: "'default' | 'wide' | 'full'",
            default: "'default'",
            required: false,
            description: 'Settings sayfa genisligi — section tab navigation icin "default" yeterlidir.',
          },
          {
            name: 'stickyHeader',
            type: 'boolean',
            default: 'true',
            required: false,
            description: 'Ayarlar header ve section tabs scroll sirasinda sabit kalir.',
          },
          {
            name: 'responsiveDetailCollapse',
            type: 'boolean',
            default: 'false',
            required: false,
            description: 'Guardrail aside paneli kucuk ekranda otomatik kapanir.',
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
          'settings hierarchy',
          'section navigation clarity',
          'configuration summary readability',
          'guardrail visibility',
        ],
        regressionFocus: [
          'section tab spacing',
          'settings summary grouping',
          'aside context durability',
          'responsive settings stack',
          'sticky header with tabs',
        ],
      }
    : null,
};

export default entry;
