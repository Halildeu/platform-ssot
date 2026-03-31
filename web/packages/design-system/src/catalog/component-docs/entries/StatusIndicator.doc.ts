import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'StatusIndicator',
  indexItem: {
    name: 'StatusIndicator',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'stable',
    group: 'feedback',
    subgroup: 'status',
    taxonomyGroupId: 'feedback',
    taxonomySubgroup: 'Status Indicators',
    demoMode: 'live',
    description:
      'Colored dot with optional label indicating connection or availability status (online, offline, busy, away). Supports pulse animation and multiple sizes.',
    sectionIds: ['component_library_management'],
    qualityGates: ['design_tokens', 'preview_visibility', 'a11y_keyboard_support'],
    tags: ['wave-2', 'status', 'feedback', 'stable'],
    uxPrimaryThemeId: 'feedback_and_status',
    roadmapWaveId: 'wave_2_navigation',
    importStatement: "import { StatusIndicator } from '@mfe/design-system';",
    whereUsed: [
      'web/packages/design-system/src/components/app-sidebar/AppSidebarFooterStatus.tsx',
    ],
    dependsOn: [],
  },
  apiItem: {
    name: 'StatusIndicator',
    variantAxes: [
      'status: online | offline | busy | away | unknown',
      'size: sm | md | lg',
    ],
    previewStates: ['default', 'offline', 'busy', 'away', 'pulse', 'dot-only'],
    behaviorModel: [
      'semantic color mapping via design tokens per status value',
      'optional pulse animation on online status',
      'showLabel toggle for dot-only vs labeled rendering',
      'sr-only label for accessibility when dot-only',
    ],
    props: [
      { name: 'status', type: "'online' | 'offline' | 'busy' | 'away' | 'unknown'", default: "'online'", required: false, description: 'Status controlling dot color.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Dot size.' },
      { name: 'label', type: 'string', default: '-', required: false, description: 'Optional text label beside the dot.' },
      { name: 'showLabel', type: 'boolean', default: 'true', required: false, description: 'Show label text. False renders dot-only with sr-only label.' },
      { name: 'pulse', type: 'boolean', default: 'false', required: false, description: 'Animate a pulse ring on the online status.' },
    ],
    previewFocus: ['all status variants', 'dot-only vs labeled', 'pulse animation', 'size matrix'],
    regressionFocus: ['sr-only label present in dot-only mode', 'design token color per status', 'pulse does not trigger on non-online'],
  },
};

export default entry;
