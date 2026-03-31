import type { DesignLabComponentDocEntry } from '../types';
const entry: DesignLabComponentDocEntry = {
  name: 'Progress',
  indexItem: {
    name: 'Progress', kind: 'component', availability: 'exported', lifecycle: 'stable', maturity: 'stable',
    group: 'feedback', subgroup: 'progress', taxonomyGroupId: 'feedback', taxonomySubgroup: 'Progress Indicators',
    demoMode: 'live',
    description: 'Progress indicator with line, circle, dashboard, and stepped variants. Supports status-based coloring via design tokens, custom formatting, and animated fill transitions.',
    sectionIds: ['component_library_management'], qualityGates: ['design_tokens', 'preview_visibility', 'a11y_keyboard_support'],
    tags: ['wave-3', 'feedback', 'progress', 'stable'],
    importStatement: "import { Progress } from '@mfe/design-system';", whereUsed: [], dependsOn: [],
  },
  apiItem: {
    name: 'Progress',
    variantAxes: ['type: line | circle | dashboard', 'status: normal | active | success | exception', 'size: sm | md | lg'],
    previewStates: ['default', 'circle', 'dashboard', 'steps', 'success', 'exception'],
    behaviorModel: ['SVG stroke-dasharray for circular variants', 'CSS transition for animated fill', 'auto-success at 100%', 'ARIA progressbar role'],
    props: [
      { name: 'type', type: "'line' | 'circle' | 'dashboard'", default: "'line'", required: false, description: 'Progress type.' },
      { name: 'percent', type: '0-100', default: '0', required: false, description: 'Completion percentage.' },
      { name: 'status', type: "'normal' | 'active' | 'success' | 'exception'", default: "'normal'", required: false, description: 'Status variant.' },
      { name: 'steps', type: 'number', default: '-', required: false, description: 'Segment count (line only).' },
      { name: 'showInfo', type: 'boolean', default: 'true', required: false, description: 'Show percentage text.' },
      { name: 'format', type: '(percent) => ReactNode', default: '-', required: false, description: 'Custom format.' },
    ],
    previewFocus: ['all 4 types', 'status colors', 'animated transitions', 'stepped mode'],
    regressionFocus: ['SVG arc calculation', 'auto-success at 100%', 'aria-valuenow accuracy'],
  },
};
export default entry;
