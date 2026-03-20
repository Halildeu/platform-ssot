import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "THEME_MOTION_OPTIONS",
  indexItem: {
  "name": "THEME_MOTION_OPTIONS",
  "kind": "const",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "options",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Density / radius / motion presets",
  "demoMode": "inspector",
  "description": "THEME_MOTION_OPTIONS için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { THEME_MOTION_OPTIONS } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "THEME_MOTION_OPTIONS",
  "variantAxes": [
    "motion: standard | reduced",
    "source: static-array",
    "consumer: accessibility-aware theme editor"
  ],
  "stateModel": [
    "static motion option exposure"
  ],
    "previewStates": [],
    "behaviorModel": [
      "static motion option exposure"
    ],
  "props": [
    {
      "name": "signature",
      "type": "ThemeMotion[]",
      "default": "-",
      "required": false,
      "description": "Motion preference seceneklerini docs ve runtime secicileri icin listeler."
    }
  ],
  "previewFocus": [
    "motion preference selector"
  ],
  "regressionFocus": [
    "array contents parity",
    "selector binding stability"
  ]
},
};

export default entry;
