import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'Flex',
  indexItem: {
    name: 'Flex',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'stable',
    group: 'layout',
    subgroup: 'flex',
    taxonomyGroupId: 'general',
    taxonomySubgroup: 'Layout Flex',
    demoMode: 'live',
    description: 'General-purpose flex container. Superset of Stack — direction is optional, supports inline flex, and exposes all flex properties without direction constraint.',
    sectionIds: ['component_library_management'],
    qualityGates: ['design_tokens', 'preview_visibility'],
    tags: ['wave-3', 'layout', 'flex', 'stable'],
    importStatement: "import { Flex } from '@mfe/design-system';",
    whereUsed: [],
    dependsOn: [],
  },
  apiItem: {
    name: 'Flex',
    variantAxes: ['direction: row | column | row-reverse | column-reverse', 'inline: true | false'],
    previewStates: ['default', 'column', 'wrap', 'inline', 'all-gaps'],
    behaviorModel: ['direction optional (defaults to row)', 'inline-flex support', 'polymorphic as prop', 'fractional gap values (0.5, 1.5, 2.5)'],
    props: [
      { name: 'direction', type: "'row' | 'column' | 'row-reverse' | 'column-reverse'", default: "'row'", required: false, description: 'Flex direction.' },
      { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: '-', required: false, description: 'Cross-axis alignment.' },
      { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: '-', required: false, description: 'Main-axis distribution.' },
      { name: 'gap', type: '0-12 (token scale)', default: '0', required: false, description: 'Gap between children.' },
      { name: 'wrap', type: "boolean | 'wrap' | 'nowrap' | 'wrap-reverse'", default: 'false', required: false, description: 'Wrapping behavior.' },
      { name: 'inline', type: 'boolean', default: 'false', required: false, description: 'Use inline-flex instead of flex.' },
    ],
    previewFocus: ['all directions', 'align and justify combinations', 'gap sizes', 'wrap behavior', 'inline vs block'],
    regressionFocus: ['Tailwind class conflict resolution via cn()', 'polymorphic as prop element rendering'],
  },
};
export default entry;
