import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setMotion",
  indexItem: {
  "name": "setMotion",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_setters",
  "taxonomySubgroup": "Theme editor (axes)",
  "demoMode": "inspector",
  "description": "setMotion için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { setMotion } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "setMotion",
  "variantAxes": [
    "motion: standard | reduced",
    "consumer: accessibility-aware theme editor",
    "update: single-axis patch"
  ],
  "stateModel": [
    "motion patch",
    "DOM attr update",
    "subscriber notification"
  ],
    "previewStates": [],
    "behaviorModel": [
      "motion patch",
      "DOM attr update",
      "subscriber notification"
    ],
  "props": [
    {
      "name": "motion",
      "type": "'standard' | 'reduced'",
      "default": "-",
      "required": true,
      "description": "Motion eksenini runtime axes state uzerinden gunceller."
    }
  ],
  "previewFocus": [
    "motion preference switch"
  ],
  "regressionFocus": [
    "motion patch parity",
    "DOM attr update",
    "notify cascade"
  ]
},
};

export default entry;
