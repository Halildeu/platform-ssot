import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'HeaderBar',
  indexItem: {
    name: 'HeaderBar',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'stable',
    group: 'layout',
    subgroup: 'header',
    taxonomyGroupId: 'general',
    taxonomySubgroup: 'Layout Containers',
    demoMode: 'live',
    description:
      'Fixed-position app header container with optional backdrop blur, inner card layout, and CSS variable height sync for layout coordination.',
    sectionIds: ['component_library_management'],
    qualityGates: ['design_tokens', 'preview_visibility'],
    tags: ['wave-2', 'layout', 'header', 'stable'],
    importStatement: "import { HeaderBar } from '@mfe/design-system';",
    whereUsed: [
      'web/packages/design-system/src/patterns/shell-header/ShellHeader.tsx',
    ],
    dependsOn: [],
  },
  apiItem: {
    name: 'HeaderBar',
    variantAxes: ['blur: true | false', 'card: true | false'],
    previewStates: ['default', 'no-blur', 'no-card', 'dark-theme'],
    behaviorModel: [
      'fixed positioning at top of viewport with z-50',
      'optional backdrop blur via CSS backdrop-filter',
      'inner card container with rounded border and shadow',
      'CSS variable height sync via ref callback + resize listener',
    ],
    props: [
      { name: 'cssHeightVar', type: 'string', default: '-', required: false, description: 'CSS variable set on documentElement for height sync.' },
      { name: 'blur', type: 'boolean', default: 'true', required: false, description: 'Enable backdrop blur.' },
      { name: 'card', type: 'boolean', default: 'true', required: false, description: 'Render children inside rounded bordered card.' },
      { name: 'cardClassName', type: 'string', default: '-', required: false, description: 'Additional class for inner card container.' },
    ],
    previewFocus: ['blur vs no-blur', 'card vs raw children', 'height sync'],
    regressionFocus: ['CSS variable updates on resize', 'backdrop-filter cross-browser', 'z-index stacking'],
  },
};

export default entry;
