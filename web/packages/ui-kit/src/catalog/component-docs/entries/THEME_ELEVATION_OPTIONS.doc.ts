import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "THEME_ELEVATION_OPTIONS",
  indexItem: {
  "name": "THEME_ELEVATION_OPTIONS",
  "kind": "const",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "options",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Density / radius / motion presets",
  "demoMode": "inspector",
  "description": "THEME_ELEVATION_OPTIONS için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { THEME_ELEVATION_OPTIONS } from 'mfe-ui-kit';",
  "whereUsed": []
},
  apiItem: {
  "name": "THEME_ELEVATION_OPTIONS",
  "variantAxes": [
    "elevation: raised | flat",
    "source: static-array",
    "consumer: theme editor"
  ],
  "stateModel": [
    "static elevation option exposure"
  ],
  "props": [
    {
      "name": "signature",
      "type": "ThemeElevation[]",
      "default": "-",
      "required": false,
      "description": "Theme editor icin resmi elevation seceneklerini listeler."
    }
  ],
  "previewFocus": [
    "elevation option picker"
  ],
  "regressionFocus": [
    "array contents parity",
    "selector binding stability"
  ]
},
};

export default entry;
