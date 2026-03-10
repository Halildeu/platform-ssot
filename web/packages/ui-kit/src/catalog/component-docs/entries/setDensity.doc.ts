import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setDensity",
  indexItem: {
  "name": "setDensity",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Theme editor (axes)",
  "demoMode": "inspector",
  "description": "setDensity için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { setDensity } from 'mfe-ui-kit';",
  "whereUsed": []
},
  apiItem: {
  "name": "setDensity",
  "variantAxes": [
    "density: comfortable | compact",
    "consumer: theme editor",
    "update: single-axis patch"
  ],
  "stateModel": [
    "density patch",
    "DOM attr update",
    "subscriber notification"
  ],
  "props": [
    {
      "name": "density",
      "type": "'comfortable' | 'compact'",
      "default": "-",
      "required": true,
      "description": "Density eksenini runtime axes state uzerinden gunceller."
    }
  ],
  "previewFocus": [
    "density switch"
  ],
  "regressionFocus": [
    "density patch parity",
    "DOM attr update",
    "notify cascade"
  ]
},
};

export default entry;
