import type { DesignLabComponentDocEntry } from '../types';
import menuBarEntry from './MenuBar.doc';

const baseIndexItem = menuBarEntry.indexItem;
const baseApiItem = menuBarEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'Action Header',
  indexItem: {
    name: 'Action Header',
    kind: 'component',
    availability: 'exported',
    lifecycle: baseIndexItem.lifecycle,
    maturity: 'beta',
    group: 'navigation',
    subgroup: 'action_header',
    taxonomyGroupId: 'navigation',
    taxonomySubgroup: 'Action Header',
    demoMode: 'live',
    description:
      'MenuBar primitive ustunde selection-driven bulk actions, dense ops header ve governance akisini ayri bir action header galerisi olarak sunar.',
    sectionIds: baseIndexItem.sectionIds,
    qualityGates: baseIndexItem.qualityGates,
    tags: [...(baseIndexItem.tags ?? []), 'recipe', 'action', 'header'],
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
        name: 'Action Header',
        variantAxes: [
          'layout: horizontal | vertical',
          'density: comfortable | compact',
          'actionPlacement: inline | dropdown | split',
          'surface: default | outline | ghost',
        ],
        behaviorModel: [
          'contextual action rendering based on entity state',
          'keyboard focus management across header actions',
          'responsive action collapse into overflow menu',
          'governance-safe readonly interaction guard',
          'action group priority ordering',
        ],
        previewStates: [
          'default',
          'with-actions',
          'readonly',
          'loading',
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
            description: 'Action header boyut varyanti.',
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
