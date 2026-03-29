import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'FullscreenToggle',
  indexItem: {
    name: 'FullscreenToggle',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'stable',
    group: 'actions',
    subgroup: 'toggle',
    taxonomyGroupId: 'general',
    taxonomySubgroup: 'Toggle Actions',
    demoMode: 'live',
    description:
      'Button that toggles browser fullscreen mode using the Fullscreen API. Manages own state, renders inline SVG icons, and supports label/icon-only modes.',
    sectionIds: ['component_library_management'],
    qualityGates: ['design_tokens', 'preview_visibility', 'a11y_keyboard_support'],
    tags: ['wave-2', 'actions', 'browser', 'stable'],
    importStatement: "import { FullscreenToggle } from '@mfe/design-system';",
    whereUsed: [
      'web/packages/design-system/src/patterns/shell-sidebar/ShellSidebar.tsx',
    ],
    dependsOn: [],
  },
  apiItem: {
    name: 'FullscreenToggle',
    variantAxes: [
      'size: sm | md | lg',
      'variant: ghost | outline',
    ],
    previewStates: ['default', 'fullscreen-active', 'icon-only'],
    behaviorModel: [
      'manages fullscreen state via document.fullscreenElement listener',
      'toggles fullscreen on click via Fullscreen API',
      'onToggle callback after state change',
      'SSR-safe with typeof document guard',
    ],
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Button size.' },
      { name: 'variant', type: "'ghost' | 'outline'", default: "'ghost'", required: false, description: 'Visual variant.' },
      { name: 'showLabel', type: 'boolean', default: 'true', required: false, description: 'Show text label beside icon.' },
      { name: 'expandLabel', type: 'string', default: "'Fullscreen'", required: false, description: 'Label when not fullscreen.' },
      { name: 'collapseLabel', type: 'string', default: "'Exit Fullscreen'", required: false, description: 'Label when fullscreen.' },
      { name: 'onToggle', type: '(isFullscreen: boolean) => void', default: '-', required: false, description: 'Callback after fullscreen state changes.' },
    ],
    previewFocus: ['ghost vs outline variant', 'label vs icon-only', 'size matrix'],
    regressionFocus: ['fullscreenchange event listener cleanup', 'SSR guard', 'aria-label parity with visual label'],
  },
};

export default entry;
