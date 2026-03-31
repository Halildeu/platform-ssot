import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'Grid',
  indexItem: {
    name: 'Grid',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'stable',
    group: 'layout',
    subgroup: 'grid',
    taxonomyGroupId: 'general',
    taxonomySubgroup: 'Layout Grid',
    demoMode: 'live',
    description: 'Responsive CSS Grid layout with 12 or 24 column support. Compound component (Grid + Grid.Col) with responsive span, offset, order via breakpoint props or object notation.',
    sectionIds: ['component_library_management'],
    qualityGates: ['design_tokens', 'preview_visibility', 'a11y_keyboard_support'],
    tags: ['wave-3', 'layout', 'grid', 'responsive', 'stable'],
    importStatement: "import { Grid } from '@mfe/design-system';",
    whereUsed: [],
    dependsOn: [],
  },
  apiItem: {
    name: 'Grid',
    variantAxes: ['columns: 12 | 24', 'gutter: 0-12'],
    previewStates: ['default', 'responsive', 'offset', 'nested'],
    behaviorModel: ['CSS Grid (not flexbox) for true column alignment', 'responsive breakpoint props: xs/sm/md/lg/xl/2xl', 'object notation: span={{ xs: 12, md: 6 }}', 'compound pattern: Grid + Grid.Col'],
    props: [
      { name: 'columns', type: '12 | 24', default: '12', required: false, description: 'Number of grid columns.' },
      { name: 'gutter', type: '0-12', default: '4', required: false, description: 'Gap between cells (token scale).' },
      { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", default: "'stretch'", required: false, description: 'Vertical alignment of cells.' },
      { name: 'Col.span', type: 'number | ResponsiveValue', default: '-', required: true, description: 'Column span (1-12/24). Supports responsive object.' },
      { name: 'Col.offset', type: 'number | ResponsiveValue', default: '-', required: false, description: 'Column offset.' },
      { name: 'Col.md/lg/xl', type: 'number', default: '-', required: false, description: 'Responsive shorthand props.' },
    ],
    previewFocus: ['12-column responsive grid', 'offset and order', 'gutter sizes', 'nested grids', '24-column mode'],
    regressionFocus: ['responsive class generation', 'col-span Tailwind class parity', 'context propagation for columns'],
  },
};
export default entry;
