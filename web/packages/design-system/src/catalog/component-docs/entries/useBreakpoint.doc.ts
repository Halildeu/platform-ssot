import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'useBreakpoint',
  indexItem: {
    name: 'useBreakpoint',
    kind: 'hook',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'stable',
    group: 'layout',
    subgroup: 'responsive',
    taxonomyGroupId: 'general',
    taxonomySubgroup: 'Responsive Hooks',
    demoMode: 'live',
    description: 'Reactive responsive breakpoint hook. Returns current breakpoint name and comparison helpers (isAbove, isBelow, isExact). Uses window.matchMedia for efficient event-driven updates.',
    sectionIds: ['component_library_management'],
    qualityGates: ['preview_visibility'],
    tags: ['wave-3', 'layout', 'responsive', 'hook', 'stable'],
    importStatement: "import { useBreakpoint } from '@mfe/design-system';",
    whereUsed: [],
    dependsOn: [],
  },
  apiItem: {
    name: 'useBreakpoint',
    variantAxes: [],
    previewStates: ['default'],
    behaviorModel: ['SSR-safe with 1024px default', 'matchMedia event-driven (no polling)', 'Tailwind-aligned breakpoints: xs/sm/md/lg/xl/2xl'],
    props: [
      { name: 'return.current', type: 'BreakpointKey', default: '-', required: false, description: 'Current active breakpoint name.' },
      { name: 'return.isAbove', type: '(bp) => boolean', default: '-', required: false, description: 'True if viewport is at or above the given breakpoint.' },
      { name: 'return.isBelow', type: '(bp) => boolean', default: '-', required: false, description: 'True if viewport is below the given breakpoint.' },
      { name: 'return.width', type: 'number', default: '-', required: false, description: 'Current viewport width in pixels.' },
    ],
    previewFocus: ['breakpoint transitions', 'comparison helpers'],
    regressionFocus: ['SSR safety', 'matchMedia cleanup', 'initial width sync'],
  },
};
export default entry;
