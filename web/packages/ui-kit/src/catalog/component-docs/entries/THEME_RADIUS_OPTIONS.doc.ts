import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "THEME_RADIUS_OPTIONS",
  indexItem: {
  "name": "THEME_RADIUS_OPTIONS",
  "kind": "const",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "options",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Density / radius / motion presets",
  "demoMode": "inspector",
  "description": "THEME_RADIUS_OPTIONS için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { THEME_RADIUS_OPTIONS } from 'mfe-ui-kit';",
  "whereUsed": []
},
  apiItem: {
  "name": "THEME_RADIUS_OPTIONS",
  "variantAxes": [
    "radius: rounded | sharp",
    "source: static-array",
    "consumer: theme editor"
  ],
  "stateModel": [
    "static radius option exposure"
  ],
  "props": [
    {
      "name": "signature",
      "type": "ThemeRadius[]",
      "default": "-",
      "required": false,
      "description": "Theme editor icin resmi radius seceneklerini sabit liste olarak sunar."
    }
  ],
  "previewFocus": [
    "radius option picker"
  ],
  "regressionFocus": [
    "array contents parity",
    "selector binding stability"
  ]
},
};

export default entry;
