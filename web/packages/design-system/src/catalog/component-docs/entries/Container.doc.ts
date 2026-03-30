import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'Container',
  indexItem: {
    name: 'Container',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'stable',
    group: 'layout',
    subgroup: 'container',
    taxonomyGroupId: 'general',
    taxonomySubgroup: 'Layout Containers',
    demoMode: 'live',
    description: 'Responsive max-width container with optional centering and padding. Constrains content to comfortable reading width with responsive horizontal padding.',
    sectionIds: ['component_library_management'],
    qualityGates: ['design_tokens', 'preview_visibility'],
    tags: ['wave-3', 'layout', 'container', 'responsive', 'stable'],
    importStatement: "import { Container } from '@mfe/design-system';",
    whereUsed: [],
    dependsOn: [],
  },
  apiItem: {
    name: 'Container',
    variantAxes: ["maxWidth: sm | md | lg | xl | 2xl | full"],
    previewStates: ['default', 'fluid', 'no-padding', 'all-sizes'],
    behaviorModel: ['max-width constraint with Tailwind screen breakpoints', 'auto-centered with mx-auto', 'responsive padding: px-4 sm:px-6 lg:px-8'],
    props: [
      { name: 'maxWidth', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | false", default: "'xl'", required: false, description: 'Maximum width constraint.' },
      { name: 'centered', type: 'boolean', default: 'true', required: false, description: 'Center with auto margins.' },
      { name: 'padding', type: 'boolean', default: 'true', required: false, description: 'Responsive horizontal padding.' },
      { name: 'fluid', type: 'boolean', default: 'false', required: false, description: 'Full width, no max constraint.' },
    ],
    previewFocus: ['all maxWidth sizes', 'fluid mode', 'padding toggle'],
    regressionFocus: ['max-width Tailwind class accuracy', 'responsive padding breakpoints'],
  },
};
export default entry;
