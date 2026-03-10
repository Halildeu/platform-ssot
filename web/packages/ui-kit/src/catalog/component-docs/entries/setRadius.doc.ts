import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setRadius",
  indexItem: {
  "name": "setRadius",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Theme editor (axes)",
  "demoMode": "inspector",
  "description": "setRadius için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { setRadius } from 'mfe-ui-kit';",
  "whereUsed": []
},
  apiItem: {
  "name": "setRadius",
  "variantAxes": [
    "radius: rounded | sharp",
    "consumer: theme editor",
    "update: single-axis patch"
  ],
  "stateModel": [
    "radius patch",
    "DOM attr update",
    "subscriber notification"
  ],
  "props": [
    {
      "name": "radius",
      "type": "'rounded' | 'sharp'",
      "default": "-",
      "required": true,
      "description": "Radius eksenini runtime axes state uzerinden gunceller."
    }
  ],
  "previewFocus": [
    "radius switch"
  ],
  "regressionFocus": [
    "radius patch parity",
    "DOM attr update",
    "notify cascade"
  ]
},
};

export default entry;
