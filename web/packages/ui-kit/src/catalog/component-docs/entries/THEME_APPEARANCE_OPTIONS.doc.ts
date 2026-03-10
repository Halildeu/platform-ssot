import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "THEME_APPEARANCE_OPTIONS",
  indexItem: {
  "name": "THEME_APPEARANCE_OPTIONS",
  "kind": "const",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "options",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Density / radius / motion presets",
  "demoMode": "inspector",
  "description": "THEME_APPEARANCE_OPTIONS için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { THEME_APPEARANCE_OPTIONS } from 'mfe-ui-kit';",
  "whereUsed": []
},
  apiItem: {
  "name": "THEME_APPEARANCE_OPTIONS",
  "variantAxes": [
    "appearance: light | dark | high-contrast",
    "source: contract-filtered",
    "consumer: theme selector | docs"
  ],
  "stateModel": [
    "allowed appearance filtering",
    "contract alias awareness",
    "static array exposure"
  ],
  "props": [
    {
      "name": "signature",
      "type": "ThemeAppearance[]",
      "default": "-",
      "required": false,
      "description": "Theme contract tarafindan izin verilen appearance seceneklerini runtime icin disari acar."
    }
  ],
  "previewFocus": [
    "theme mode selector options",
    "contract-filtered appearance set"
  ],
  "regressionFocus": [
    "allowed mode filtering",
    "high-contrast availability parity",
    "array ordering stability"
  ]
},
};

export default entry;
