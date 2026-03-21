import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setDensity",
  indexItem: {
  "name": "setDensity",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_setters",
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
  "importStatement": "import { setDensity } from '@mfe/design-system';",
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
    "previewStates": [],
    "behaviorModel": [
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
