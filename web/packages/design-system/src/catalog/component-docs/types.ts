export type DesignLabLifecycle = 'stable' | 'beta' | 'planned';
export type DesignLabAvailability = 'exported' | 'planned';
export type DesignLabDemoMode = 'live' | 'inspector' | 'planned';

/**
 * Component maturity level — measures quality depth beyond basic lifecycle.
 *
 * 🧪 experimental — Renders, basic props work. No guarantees.
 * 🔶 beta — Variant/size matrix, dark mode, tests exist.
 * ✅ stable — + keyboard, a11y baseline, token override, CSS fallback audit.
 * 🏢 enterprise — + full a11y audit, visual regression, density, controlled/uncontrolled,
 *                  ref forwarding, perf benchmark. Production-hardened.
 */
export type DesignLabMaturity = 'experimental' | 'beta' | 'stable' | 'enterprise';

export type DesignLabIndexItemDocument = {
  name: string;
  kind: 'component' | 'hook' | 'function' | 'const';
  importStatement: string;
  whereUsed: string[];
  group: string;
  subgroup: string;
  availability: DesignLabAvailability;
  lifecycle: DesignLabLifecycle;
  /** Quality depth level — independent of lifecycle */
  maturity?: DesignLabMaturity;
  taxonomyGroupId: string;
  taxonomySubgroup: string;
  demoMode: DesignLabDemoMode;
  description: string;
  sectionIds: string[];
  qualityGates: string[];
  tags?: string[];
  uxPrimaryThemeId?: string;
  uxPrimarySubthemeId?: string;
  roadmapWaveId?: string;
  acceptanceContractId?: string;
};

export type DesignLabApiPropDocument = {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
};

export type DesignLabApiItemDocument = {
  name: string;
  variantAxes: string[];
  /** Legacy state model — superseded by `previewStates` + `behaviorModel`. */
  stateModel?: string[];
  /** Deterministic, enum-like state keys that map to STATE_PROP_MAP for live preview. */
  previewStates?: string[];
  /** Free-text interaction/behavior descriptions shown in docs (not rendered as previews). */
  behaviorModel?: string[];
  props: DesignLabApiPropDocument[];
  previewFocus: string[];
  regressionFocus: string[];
};

export type DesignLabApiCatalogMeta = {
  version: string;
  subject_id: string;
  wave_id: string;
};

export type DesignLabComponentDocEntry = {
  name: string;
  indexItem: DesignLabIndexItemDocument;
  apiItem: DesignLabApiItemDocument | null;
};
