import type { DesignLabComponentDocEntry } from '../types';
import menuBarEntry from './MenuBar.doc';

const baseIndexItem = menuBarEntry.indexItem;
const baseApiItem = menuBarEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'Action Bar',
  indexItem: {
    name: 'Action Bar',
    kind: 'component',
    availability: 'exported',
    lifecycle: baseIndexItem.lifecycle,
    maturity: 'beta',
    group: 'navigation',
    subgroup: 'action_bar',
    taxonomyGroupId: 'navigation',
    taxonomySubgroup: 'Action Bar',
    demoMode: 'live',
    description: 'MenuBar primitive ustunde selection-driven bulk actions, dense ops header ve readonly governance akisini ayri bir action bar galerisi olarak sunar.',
    sectionIds: baseIndexItem.sectionIds,
    qualityGates: baseIndexItem.qualityGates,
    tags: [...(baseIndexItem.tags ?? []), 'recipe', 'action-bar'],
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
        name: 'Action Bar',
        variantAxes: [
          'position: top | bottom | sticky',
          'density: comfortable | compact',
          'selectionMode: single | multi | none',
          'surface: default | outline | ghost',
        ],
        behaviorModel: [
          'selection-driven action visibility toggling',
          'keyboard navigation across action groups',
          'bulk action confirmation guard',
          'responsive action overflow into dropdown',
          'readonly mode disabling all destructive actions',
        ],
        previewStates: [
          'default',
          'with-selection',
          'readonly',
          'empty-selection',
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
        ],
        previewFocus: [
          'selection-driven bulk actions',
          'dense operations toolbar feel',
          'governance-safe readonly state',
          'task-oriented action grouping',
          'high-signal operational header',
        ],
        regressionFocus: [
          'selection badge visibility',
          'bulk action grouping',
          'readonly interaction guard',
          'dense header readability',
          'task action routing',
        ],
      }
    : null,
};

export default entry;
