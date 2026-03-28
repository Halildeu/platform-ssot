import type { DesignLabComponentDocEntry } from '../types';
import menuBarEntry from './MenuBar.doc';

const baseIndexItem = menuBarEntry.indexItem;
const baseApiItem = menuBarEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'Search / Command Header',
  indexItem: {
    name: 'Search / Command Header',
    kind: 'component',
    availability: 'exported',
    lifecycle: baseIndexItem.lifecycle,
    maturity: 'beta',
    group: 'navigation',
    subgroup: 'command_header',
    taxonomyGroupId: 'navigation',
    taxonomySubgroup: 'Search / Command Header',
    demoMode: 'live',
    description:
      'MenuBar primitive ustunde search handoff, recent roots ve favorites davranisini one cikan search/command recipe galerisi sunar.',
    sectionIds: baseIndexItem.sectionIds,
    qualityGates: baseIndexItem.qualityGates,
    tags: [...(baseIndexItem.tags ?? []), 'recipe', 'command'],
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
        name: 'Search / Command Header',
        variantAxes: [
          'searchPlacement: inline | overlay | full-width',
          'resultLayout: list | grouped | panel',
          'recentsVisibility: always | on-focus | hidden',
          'surface: default | elevated',
        ],
        behaviorModel: [
          'search handoff routing to root navigation or submenu action',
          'recent roots queue auto-update on navigation',
          'favorite toggle with controlled and uncontrolled state',
          'keyboard-driven command result selection',
          'search result grouping by route and action category',
        ],
        previewStates: [
          'default',
          'search-focused',
          'with-results',
          'empty-results',
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
            description: 'Component size variant.',
          },
        ],
        previewFocus: [
          'search-first command surface',
          'command handoff to roots and submenu actions',
          'favorites and recents memory',
          'ops-centric discovery',
          'rich submenu metadata',
        ],
        regressionFocus: [
          'search handoff routing',
          'recent roots update',
          'favorite toggle state',
          'command result grouping',
          'submenu action activation',
        ],
      }
    : null,
};

export default entry;
