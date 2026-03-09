export type DesignLabLifecycle = 'stable' | 'beta' | 'planned';
export type DesignLabAvailability = 'exported' | 'planned';
export type DesignLabDemoMode = 'live' | 'inspector' | 'planned';

export type DesignLabIndexItemDocument = {
  name: string;
  kind: 'component' | 'hook' | 'function' | 'const';
  importStatement: string;
  whereUsed: string[];
  group: string;
  subgroup: string;
  availability: DesignLabAvailability;
  lifecycle: DesignLabLifecycle;
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
  stateModel: string[];
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
