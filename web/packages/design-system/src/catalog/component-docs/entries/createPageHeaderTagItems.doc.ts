import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createPageHeaderTagItems",
  indexItem: {
  "name": "createPageHeaderTagItems",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "page_blocks",
  "subgroup": "page_shell",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "String veya typed tag girdilerini PageHeaderTagItem dizisine normalize eder.",
  "sectionIds": [
    "utility_components",
    "page_structure_blocks",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createPageHeaderTagItems } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "createPageHeaderTagItems",
  "variantAxes": [
    "input: string | typed-tag",
    "tone: explicit | default"
  ],
  "stateModel": [
    "string to tag normalization",
    "default tone fallback",
    "key fallback"
  ],
    "previewStates": [],
    "behaviorModel": [
      "string to tag normalization",
      "default tone fallback",
      "key fallback"
    ],
  "props": [
    {
      "name": "inputs",
      "type": "PageHeaderTagInput[]",
      "default": "-",
      "required": true,
      "description": "String veya typed tag girdilerini PageHeader badge helper dizisine cevirir."
    }
  ],
  "previewFocus": [
    "string tag normalization",
    "typed tone override",
    "default tone fallback"
  ],
  "regressionFocus": [
    "label mapping",
    "key fallback",
    "tone normalization"
  ]
},
};

export default entry;
