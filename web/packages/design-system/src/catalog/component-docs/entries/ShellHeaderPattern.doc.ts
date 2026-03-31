import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'ShellHeader',
  indexItem: {
    name: 'ShellHeader',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'beta',
    group: 'navigation',
    subgroup: 'header',
    taxonomyGroupId: 'navigation',
    taxonomySubgroup: 'App Header / Top Nav',
    demoMode: 'live',
    description:
      'Ready-made app header pattern composing HeaderBar with MenuBar featuring built-in collapse-to-more overflow, priority-based item ranking, active item preservation, and configurable start/end/utility slots.',
    sectionIds: [
      'component_library_management',
      'navigation_patterns',
      'accessibility_compliance',
    ],
    qualityGates: [
      'design_tokens',
      'preview_visibility',
      'registry_export_sync',
      'ux_catalog_alignment',
      'a11y_keyboard_support',
    ],
    tags: ['wave-2', 'navigation', 'header', 'pattern', 'beta', 'shell'],
    uxPrimaryThemeId: 'navigation_information_scent',
    uxPrimarySubthemeId: 'orientation_and_wayfinding',
    roadmapWaveId: 'wave_2_navigation',
    importStatement: "import { ShellHeader } from '@mfe/design-system';",
    whereUsed: [],
    dependsOn: ['HeaderBar', 'MenuBar'],
  },
  apiItem: {
    name: 'ShellHeader',
    variantAxes: ['overflow: collapse-to-more (built-in)'],
    previewStates: ['default', 'overflow-active', 'many-items', 'few-items', 'dark-theme'],
    behaviorModel: [
      'MenuBar with collapse-to-more overflow — real width measurement, not averages',
      'priority-based overflow ranking: pinned > favorited > custom priority > order',
      'active item always preserved in visible set',
      'start slot for brand/launcher, end slot for utilities',
      'menu utility slot passed to MenuBar endSlot',
      'CSS variable height sync via HeaderBar',
    ],
    props: [
      { name: 'navItems', type: 'ShellHeaderNavItem[]', default: '-', required: true, description: 'Navigation items.' },
      { name: 'currentPath', type: 'string', default: '-', required: true, description: 'Current route path for active state.' },
      { name: 'onNavigate', type: '(path, item) => void', default: '-', required: false, description: 'Navigation callback.' },
      { name: 'startSlot', type: 'ReactNode', default: '-', required: false, description: 'Content before navigation (e.g. launcher).' },
      { name: 'endSlot', type: 'ReactNode', default: '-', required: false, description: 'Content after navigation (e.g. user menu).' },
      { name: 'menuUtility', type: 'ReactNode', default: '-', required: false, description: 'Utility slot inside MenuBar.' },
      { name: 'overflowLabel', type: 'string', default: "'More'", required: false, description: 'Label for overflow trigger.' },
      { name: 'cssHeightVar', type: 'string', default: '-', required: false, description: 'CSS variable for height sync.' },
    ],
    previewFocus: [
      'responsive overflow — items collapse correctly as width decreases',
      'active item stays visible even when others overflow',
      'slot composition: start, end, menuUtility',
      'dark theme rendering',
    ],
    regressionFocus: [
      'overflow calculation uses real measured widths, not averages',
      'active item never hidden in overflow',
      'MenuBar overflow trigger accessible (aria-haspopup, aria-expanded)',
      'height CSS variable updates on resize',
    ],
  },
};

export default entry;
