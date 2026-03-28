import type { DesignLabComponentDocEntry } from '../types';
import menuBarEntry from './MenuBar.doc';

const baseIndexItem = menuBarEntry.indexItem;
const baseApiItem = menuBarEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'Navigation Menu',
  indexItem: {
    name: 'Navigation Menu',
    kind: 'component',
    availability: 'exported',
    lifecycle: baseIndexItem.lifecycle,
    maturity: 'beta',
    group: 'navigation',
    subgroup: 'navigation_menu',
    taxonomyGroupId: 'navigation',
    taxonomySubgroup: 'Navigation menu / side nav',
    demoMode: 'live',
    description: 'MenuBar primitive ustunde buyuk bilgi mimarisi, overflow kontrolu ve top-level link akisi icin navigation menu recipe vitrini sunar.',
    sectionIds: baseIndexItem.sectionIds,
    qualityGates: baseIndexItem.qualityGates,
    tags: [...(baseIndexItem.tags ?? []), 'recipe', 'navigation-menu'],
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
        name: 'Navigation Menu',
        variantAxes: [
          'orientation: horizontal | vertical',
          'overflowStrategy: scroll | collapse-to-more | wrap',
          'activeIndicator: underline | background | pill',
          'density: comfortable | compact',
        ],
        behaviorModel: [
          'route-aware active root resolution from currentPath',
          'priority-based overflow bucket management',
          'pinned destination retention across viewport changes',
          'keyboard roving focus across navigation roots',
          'responsive fallback from horizontal to hamburger menu',
        ],
        previewStates: [
          'default',
          'with-overflow',
          'mobile-collapsed',
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
        ],
        previewFocus: [
          'information scent for top-level routes',
          'priority-managed overflow',
          'pinned destinations',
          'subdomain navigation shell',
          'route-aware active root emphasis',
        ],
        regressionFocus: [
          'active route parity',
          'overflow ordering',
          'pinned destination retention',
          'subdomain header grouping',
          'submenu link routing',
        ],
      }
    : null,
};

export default entry;
