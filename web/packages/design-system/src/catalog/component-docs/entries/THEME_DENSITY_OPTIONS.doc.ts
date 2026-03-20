import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "THEME_DENSITY_OPTIONS",
  indexItem: {
  "name": "THEME_DENSITY_OPTIONS",
  "kind": "const",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "options",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Density / radius / motion presets",
  "demoMode": "inspector",
  "description": "THEME_DENSITY_OPTIONS için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { THEME_DENSITY_OPTIONS } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "THEME_DENSITY_OPTIONS",
  "variantAxes": [
    "density: comfortable | compact",
    "source: static-array",
    "consumer: density selector | docs"
  ],
  "stateModel": [
    "static density option exposure"
  ],
    "previewStates": [],
    "behaviorModel": [
      "static density option exposure"
    ],
  "props": [
    {
      "name": "signature",
      "type": "ThemeDensity[]",
      "default": "-",
      "required": false,
      "description": "Resmi density seceneklerini runtime ve docs katmanina sabit liste olarak sunar."
    }
  ],
  "previewFocus": [
    "density toggle options"
  ],
  "regressionFocus": [
    "array contents parity",
    "selector binding stability"
  ]
},
};

export default entry;
