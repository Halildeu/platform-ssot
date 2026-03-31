import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: 'AppSidebarFooterAction',
  indexItem: {
    name: 'AppSidebarFooterAction',
    kind: 'component',
    availability: 'exported',
    lifecycle: 'stable',
    maturity: 'stable',
    group: 'navigation',
    subgroup: 'sidebar',
    taxonomyGroupId: 'navigation',
    taxonomySubgroup: 'Navigation menu / side nav',
    demoMode: 'live',
    description:
      'Generic action button for AppSidebar footer. Adapts to collapsed mode (icon-only with tooltip) and expanded mode (icon + label). Renders as anchor when href is provided.',
    sectionIds: ['component_library_management', 'navigation_patterns'],
    qualityGates: ['design_tokens', 'preview_visibility', 'a11y_keyboard_support'],
    tags: ['wave-2', 'navigation', 'sidebar', 'stable'],
    uxPrimaryThemeId: 'navigation_information_scent',
    roadmapWaveId: 'wave_2_navigation',
    importStatement: "import { AppSidebar } from '@mfe/design-system'; // Use as AppSidebar.FooterAction",
    whereUsed: [
      'web/packages/design-system/src/patterns/shell-sidebar/ShellSidebar.tsx',
    ],
    dependsOn: ['AppSidebar'],
  },
  apiItem: {
    name: 'AppSidebarFooterAction',
    variantAxes: ['mode: expanded | collapsed (from sidebar context)'],
    previewStates: ['default', 'active', 'disabled', 'collapsed', 'as-link'],
    behaviorModel: [
      'reads isCollapsed from useSidebar() context',
      'expanded: icon + label + optional badge',
      'collapsed: icon-only + hover tooltip',
      'renders <a> when href provided, <button> otherwise',
    ],
    props: [
      { name: 'icon', type: 'ReactNode', default: '-', required: true, description: 'Icon element.' },
      { name: 'label', type: 'string', default: '-', required: true, description: 'Text label (always required for a11y).' },
      { name: 'onClick', type: '() => void', default: '-', required: false, description: 'Click handler.' },
      { name: 'href', type: 'string', default: '-', required: false, description: 'Renders as anchor when provided.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the action.' },
      { name: 'badge', type: 'ReactNode', default: '-', required: false, description: 'Badge after label.' },
      { name: 'active', type: 'boolean', default: 'false', required: false, description: 'Active highlight state.' },
    ],
    previewFocus: ['expanded vs collapsed adaptation', 'active state styling', 'badge rendering', 'link vs button rendering'],
    regressionFocus: ['tooltip visibility in collapsed mode', 'disabled pointer-events', 'aria-label parity'],
  },
};

export default entry;
