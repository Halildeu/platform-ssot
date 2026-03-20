import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setAppearance",
  indexItem: {
  "name": "setAppearance",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Theme editor (axes)",
  "demoMode": "inspector",
  "description": "setAppearance için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { setAppearance } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "setAppearance",
  "variantAxes": [
    "appearance: light | dark | high-contrast",
    "consumer: theme editor | shell runtime",
    "update: single-axis patch"
  ],
  "stateModel": [
    "appearance patch",
    "data-theme update",
    "subscriber notification"
  ],
    "previewStates": [],
    "behaviorModel": [
      "appearance patch",
      "data-theme update",
      "subscriber notification"
    ],
  "props": [
    {
      "name": "appearance",
      "type": "'light' | 'dark' | 'high-contrast'",
      "default": "-",
      "required": true,
      "description": "Theme appearance eksenini runtime axes state uzerinden gunceller."
    }
  ],
  "previewFocus": [
    "appearance switch",
    "shell theme patch"
  ],
  "regressionFocus": [
    "appearance patch parity",
    "data-theme update",
    "notify cascade"
  ]
},
};

export default entry;
