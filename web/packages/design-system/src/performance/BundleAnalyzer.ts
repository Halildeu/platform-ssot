/* ------------------------------------------------------------------ */
/*  Bundle Analyzer — Component size tracking & recommendations        */
/* ------------------------------------------------------------------ */

export type ComponentSizeCategory = 'lightweight' | 'medium' | 'heavy';

export type ComponentSizeInfo = {
  /** Component or module name */
  name: string;
  /** Estimated gzipped kilobytes */
  estimatedKB: number;
  /** Size classification */
  category: ComponentSizeCategory;
  /** Whether we recommend lazy-loading this component */
  lazyRecommended: boolean;
  /** Notable third-party dependencies */
  dependencies: string[];
};

export type BundleReport = {
  totalComponents: number;
  lightweightCount: number;
  mediumCount: number;
  heavyCount: number;
  lazyRecommendedCount: number;
  estimatedTotalKB: number;
};

/* ------------------------------------------------------------------ */
/*  Registry — static size estimates per component group               */
/* ------------------------------------------------------------------ */

const COMPONENT_REGISTRY: ComponentSizeInfo[] = [
  // Primitives — lightweight
  { name: 'Button', estimatedKB: 2, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Text', estimatedKB: 1, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Input', estimatedKB: 2, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Badge', estimatedKB: 1, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Checkbox', estimatedKB: 1.5, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Radio', estimatedKB: 1.5, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Switch', estimatedKB: 1.5, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Avatar', estimatedKB: 1.5, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Tooltip', estimatedKB: 3, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Spinner', estimatedKB: 0.5, category: 'lightweight', lazyRecommended: false, dependencies: [] },

  // Components — medium
  { name: 'Tabs', estimatedKB: 5, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'Accordion', estimatedKB: 5, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'Pagination', estimatedKB: 4, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'FormField', estimatedKB: 3, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'Breadcrumb', estimatedKB: 2, category: 'lightweight', lazyRecommended: false, dependencies: [] },
  { name: 'Combobox', estimatedKB: 12, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'DatePicker', estimatedKB: 15, category: 'medium', lazyRecommended: true, dependencies: [] },
  { name: 'TimePicker', estimatedKB: 10, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'Upload', estimatedKB: 8, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'Slider', estimatedKB: 6, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'List', estimatedKB: 4, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'Tree', estimatedKB: 10, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'Cascader', estimatedKB: 12, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'Mentions', estimatedKB: 8, category: 'medium', lazyRecommended: false, dependencies: [] },
  { name: 'CommandPalette', estimatedKB: 10, category: 'medium', lazyRecommended: false, dependencies: [] },

  // Heavy — lazy recommended
  { name: 'EntityGrid (AG Grid)', estimatedKB: 180, category: 'heavy', lazyRecommended: true, dependencies: ['ag-grid-community', 'ag-grid-enterprise', 'ag-grid-react'] },
  { name: 'Calendar', estimatedKB: 35, category: 'heavy', lazyRecommended: true, dependencies: [] },
  { name: 'Charts (Bar/Line/Pie/Area)', estimatedKB: 45, category: 'heavy', lazyRecommended: true, dependencies: [] },
  { name: 'ColorPicker', estimatedKB: 25, category: 'heavy', lazyRecommended: true, dependencies: [] },
  { name: 'Transfer', estimatedKB: 20, category: 'heavy', lazyRecommended: true, dependencies: [] },
  { name: 'JsonViewer', estimatedKB: 18, category: 'heavy', lazyRecommended: true, dependencies: [] },
  { name: 'TreeTable', estimatedKB: 22, category: 'heavy', lazyRecommended: true, dependencies: [] },
  { name: 'SmartDashboard', estimatedKB: 30, category: 'heavy', lazyRecommended: true, dependencies: [] },
  { name: 'AILayoutBuilder', estimatedKB: 28, category: 'heavy', lazyRecommended: true, dependencies: [] },
  { name: 'AdaptiveForm', estimatedKB: 25, category: 'heavy', lazyRecommended: true, dependencies: [] },
];

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Returns size estimates and lazy-loading recommendations for all
 * registered design system components.
 */
export function getComponentSizes(): ComponentSizeInfo[] {
  return [...COMPONENT_REGISTRY];
}

/**
 * Returns an aggregate bundle report summarising component size
 * distribution and lazy-loading opportunities.
 */
export function getBundleReport(): BundleReport {
  const sizes = getComponentSizes();

  return {
    totalComponents: sizes.length,
    lightweightCount: sizes.filter((c) => c.category === 'lightweight').length,
    mediumCount: sizes.filter((c) => c.category === 'medium').length,
    heavyCount: sizes.filter((c) => c.category === 'heavy').length,
    lazyRecommendedCount: sizes.filter((c) => c.lazyRecommended).length,
    estimatedTotalKB: sizes.reduce((sum, c) => sum + c.estimatedKB, 0),
  };
}
