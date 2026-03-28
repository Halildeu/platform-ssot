import type { DesignLabComponentDocEntry } from '../types';
import menuBarEntry from './MenuBar.doc';

const baseIndexItem = menuBarEntry.indexItem;
const baseApiItem = menuBarEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'App Header',
  indexItem: {
    name: 'App Header',
    kind: 'component',
    availability: 'exported',
    lifecycle: baseIndexItem.lifecycle,
    maturity: 'beta',
    group: 'navigation',
    subgroup: 'app_header',
    taxonomyGroupId: 'navigation',
    taxonomySubgroup: 'App Header',
    demoMode: 'live',
    description: 'MenuBar primitive ustunde branding, utility cluster, responsive shell ve subdomain hissi veren ust uygulama header recipe galerisi sunar.',
    sectionIds: baseIndexItem.sectionIds,
    qualityGates: baseIndexItem.qualityGates,
    tags: [...(baseIndexItem.tags ?? []), 'recipe', 'header'],
    uxPrimaryThemeId: baseIndexItem.uxPrimaryThemeId,
    uxPrimarySubthemeId: baseIndexItem.uxPrimarySubthemeId,
    roadmapWaveId: baseIndexItem.roadmapWaveId,
    acceptanceContractId: baseIndexItem.acceptanceContractId,
    importStatement: "import { MenuBar } from '@mfe/design-system';",
    whereUsed: [
      'web/stories/MenuBar.stories.tsx',
      'web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/menu-bar/menuBarShared.tsx',
    ],
  },
  apiItem: baseApiItem
    ? {
        ...baseApiItem,
        name: 'App Header',
        variantAxes: [
          'brandPosition: start | center',
          'utilityCluster: full | minimal | hidden',
          'responsiveMode: full | icon-only | hamburger',
          'surface: default | transparent | elevated',
        ],
        behaviorModel: [
          'responsive collapse from full labels to icon-only to hamburger menu',
          'utility cluster slot composition for notifications and account',
          'brand logo routing on click',
          'subdomain indicator switching',
          'keyboard navigation across header utility actions',
        ],
        previewStates: [
          'default',
          'compact',
          'mobile-collapsed',
          'with-notifications',
          'dark-theme',
        ],
        props: [
          ...(baseApiItem?.props ?? []),
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
            description: 'App header boyut varyanti.',
          },
        ],
        previewFocus: [
          'brand-first app shell',
          'utility cluster balance',
          'responsive icon-only fallback',
          'subdomain and release rhythm',
          'account and notification utility strip',
        ],
        regressionFocus: [
          'responsive header collapse',
          'utility slot persistence',
          'brand and route balance',
          'account cluster readability',
          'menu fallback handoff',
        ],
      }
    : null,
};

export default entry;
