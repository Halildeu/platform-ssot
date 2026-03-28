import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createPageHeaderStatItems",
  indexItem: {
  "name": "createPageHeaderStatItems",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "page_blocks",
  "subgroup": "page_shell",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "createPageLayoutPreset",
  "demoMode": "inspector",
  "description": "Tuple veya typed stat girdilerini PageHeaderStatItem dizisine normalize eder.",
  "sectionIds": [
    "utility_components",
    "page_structure_blocks",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createPageHeaderStatItems } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "createPageHeaderStatItems",
  "variantAxes": [
    "input: tuple | typed-stat",
    "helper: none | text"
  ],
  "stateModel": [
    "tuple to stat normalization",
    "typed stat passthrough",
    "helper fallback"
  ],
    "previewStates": [],
    "behaviorModel": [
      "tuple to stat normalization",
      "typed stat passthrough",
      "helper fallback"
    ],
  "props": [
    {
      "name": "inputs",
      "type": "PageHeaderStatInput[]",
      "default": "-",
      "required": true,
      "description": "Tuple veya typed stat girdilerini PageHeader metric helper dizisine cevirir."
    }
  ],
  "previewFocus": [
    "tuple stat normalization",
    "typed stat passthrough",
    "helper text mapping"
  ],
  "regressionFocus": [
    "label mapping",
    "value mapping",
    "helper carry-over"
  ]
},
};

export default entry;
