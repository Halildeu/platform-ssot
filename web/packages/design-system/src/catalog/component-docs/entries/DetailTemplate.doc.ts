import type { DesignLabComponentDocEntry } from '../types';
import pageLayoutEntry from './PageLayout.doc';

const baseIndexItem = pageLayoutEntry.indexItem;
const baseApiItem = pageLayoutEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'Detail Template',
  indexItem: {
    name: 'Detail Template',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'beta',
    group: 'page_blocks',
    subgroup: 'page_templates',
    taxonomyGroupId: 'page_blocks',
    taxonomySubgroup: 'Page Templates',
    demoMode: 'live',
    description: 'Entity summary, inspector rail ve detail blocks ile karar veya kayit inceleme ekranlari icin canonical detail template recipe sunar.',
    sectionIds: ['component_library_management', 'responsive_layout', 'navigation_patterns'],
    qualityGates: baseIndexItem.qualityGates,
    tags: ['page-template', 'detail', 'stable', 'page-blocks'],
    uxPrimaryThemeId: baseIndexItem.uxPrimaryThemeId,
    uxPrimarySubthemeId: baseIndexItem.uxPrimarySubthemeId,
    roadmapWaveId: baseIndexItem.roadmapWaveId,
    acceptanceContractId: baseIndexItem.acceptanceContractId,
    importStatement:
      "import { PageLayout, EntitySummaryBlock, Descriptions, SummaryStrip } from '@mfe/design-system';",
    whereUsed: [
      'web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/showcase-families/buildLayoutShowcaseSections.tsx',
    ],
  },
  apiItem: baseApiItem
    ? {
        ...baseApiItem,
        name: 'Detail Template',
        variantAxes: [
          'pageWidth: default | wide | full',
          'stickyHeader: true | false',
          'surface: content-only | detail-sidebar',
          'footer: none | sticky-summary',
          'responsiveDetailCollapse: true | false',
        ],
        behaviorModel: [
          'entity summary header with contextual action rendering',
          'inspector rail toggle and responsive collapse',
          'detail block scroll-to-section anchor navigation',
          'sticky entity header with summary persistence on scroll',
          'metadata field grouping with expandable sections',
          'theme-aware token resolution',
        ],
        previewStates: [
          'default',
          'loading',
          'not-found',
          'with-inspector-rail',
          'dark-theme',
        ],
        props: [
          {
            name: 'pageWidth',
            type: "'default' | 'wide' | 'full'",
            default: "'default'",
            required: false,
            description: 'Detail sayfa genisligi.',
          },
          {
            name: 'stickyHeader',
            type: 'boolean',
            default: 'false',
            required: false,
            description: 'Entity header scroll sirasinda sabit kalir.',
          },
          {
            name: 'responsiveDetailCollapse',
            type: 'boolean',
            default: 'true',
            required: false,
            description: 'Inspector rail kucuk ekranda otomatik collapse olur.',
          },
          {
            name: 'responsiveDetailBreakpoint',
            type: "'sm' | 'md' | 'lg' | 'xl'",
            default: "'md'",
            required: false,
            description: 'Detail rail collapse breakpoint noktasi.',
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
          'detail shell hierarchy',
          'inspector rail balance',
          'summary-to-detail progression',
          'decision review clarity',
        ],
        regressionFocus: [
          'detail rail sizing',
          'entity summary spacing',
          'metadata readability',
          'detail footer placement',
          'responsive collapse breakpoint',
        ],
      }
    : null,
};

export default entry;
