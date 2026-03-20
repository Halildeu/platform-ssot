import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setElevation",
  indexItem: {
  "name": "setElevation",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Theme editor (axes)",
  "demoMode": "inspector",
  "description": "setElevation için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { setElevation } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "setElevation",
  "variantAxes": [
    "elevation: raised | flat",
    "consumer: theme editor",
    "update: single-axis patch"
  ],
  "stateModel": [
    "elevation patch",
    "DOM attr update",
    "subscriber notification"
  ],
    "previewStates": [],
    "behaviorModel": [
      "elevation patch",
      "DOM attr update",
      "subscriber notification"
    ],
  "props": [
    {
      "name": "elevation",
      "type": "'raised' | 'flat'",
      "default": "-",
      "required": true,
      "description": "Elevation eksenini runtime axes state uzerinden gunceller."
    }
  ],
  "previewFocus": [
    "elevation switch"
  ],
  "regressionFocus": [
    "elevation patch parity",
    "DOM attr update",
    "notify cascade"
  ]
},
};

export default entry;
