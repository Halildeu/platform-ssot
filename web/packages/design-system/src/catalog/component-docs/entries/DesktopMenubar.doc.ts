import type { DesignLabComponentDocEntry } from '../types';
import menuBarEntry from './MenuBar.doc';

const baseIndexItem = menuBarEntry.indexItem;
const baseApiItem = menuBarEntry.apiItem;

const entry: DesignLabComponentDocEntry = {
  name: 'Desktop Menubar',
  indexItem: {
    name: 'Desktop Menubar',
    kind: 'component',
    availability: 'exported',
    lifecycle: baseIndexItem.lifecycle,
    maturity: 'beta',
    group: 'navigation',
    subgroup: 'desktop_menubar',
    taxonomyGroupId: 'navigation',
    taxonomySubgroup: 'Desktop Menubar',
    demoMode: 'live',
    description:
      'MenuBar primitive ustunde file/view/tools odakli, typed submenu ve hover trigger ile masaüstü menubar ritmine yakin modern bir ust menu deneyimi sunar.',
    sectionIds: baseIndexItem.sectionIds,
    qualityGates: baseIndexItem.qualityGates,
    tags: [...(baseIndexItem.tags ?? []), 'recipe', 'desktop', 'menubar'],
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
        name: 'Desktop Menubar',
        variantAxes: [
          'triggerMode: click | hover | hybrid',
          'submenuDepth: single | nested',
          'density: comfortable | compact',
          'surface: default | outline',
        ],
        behaviorModel: [
          'hover-triggered submenu opening with configurable dwell delay',
          'keyboard arrow-key traversal across roots and into submenus',
          'typed submenu content composition with headings and separators',
          'escape key closes deepest open submenu level',
          'focus trap within open submenu popup',
        ],
        previewStates: [
          'default',
          'submenu-open',
          'keyboard-focused',
          'disabled',
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
          'desktop-first information architecture',
          'file/view/tools root model',
          'hover submenu trigger parity',
          'typed submenu action patterns',
          'classic menubar keyboard continuity',
        ],
        regressionFocus: [
          'hover trigger timing and dwell',
          'typed submenu state sync',
          'desktop menu rhythm',
          'keyboard traversal parity',
          'menu item intent clarity',
          'submenu positioning near viewport edges',
        ],
      }
    : null,
};

export default entry;
