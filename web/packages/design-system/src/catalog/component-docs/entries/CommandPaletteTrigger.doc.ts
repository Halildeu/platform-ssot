import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'CommandPaletteTrigger',
  indexItem: {
    name: 'CommandPaletteTrigger',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'stable',
    group: 'navigation',
    subgroup: 'search',
    taxonomyGroupId: 'navigation',
    taxonomySubgroup: 'Search & Command',
    demoMode: 'live',
    description:
      'Search-style button that opens a command palette or search modal. Shows placeholder text, keyboard shortcut badge, and collapses to icon-only in compact mode.',
    sectionIds: ['component_library_management', 'navigation_patterns'],
    qualityGates: ['design_tokens', 'preview_visibility', 'a11y_keyboard_support'],
    tags: ['wave-2', 'navigation', 'search', 'stable'],
    uxPrimaryThemeId: 'navigation_information_scent',
    uxPrimarySubthemeId: 'search_and_discovery',
    roadmapWaveId: 'wave_2_navigation',
    importStatement: "import { CommandPaletteTrigger } from '@mfe/design-system';",
    whereUsed: [
      'web/packages/design-system/src/patterns/shell-sidebar/ShellSidebar.tsx',
    ],
    dependsOn: [],
  },
  apiItem: {
    name: 'CommandPaletteTrigger',
    variantAxes: ['mode: full | compact'],
    previewStates: ['default', 'compact', 'with-shortcut', 'custom-icon'],
    behaviorModel: [
      'full mode: search icon + placeholder + shortcut kbd badge',
      'compact mode: icon-only with title tooltip',
      'keyboard shortcut displayed as kbd element',
    ],
    props: [
      { name: 'placeholder', type: 'string', default: "'Search…'", required: false, description: 'Placeholder text in expanded mode.' },
      { name: 'shortcut', type: 'string', default: '-', required: false, description: 'Keyboard shortcut hint (e.g. "Ctrl+K").' },
      { name: 'compact', type: 'boolean', default: 'false', required: false, description: 'Icon-only compact mode.' },
      { name: 'icon', type: 'ReactNode', default: '-', required: false, description: 'Override default search icon.' },
    ],
    previewFocus: ['full vs compact mode', 'shortcut badge rendering', 'custom icon slot'],
    regressionFocus: ['aria-label always present', 'title tooltip in compact mode', 'shortcut kbd semantic element'],
  },
};

export default entry;
