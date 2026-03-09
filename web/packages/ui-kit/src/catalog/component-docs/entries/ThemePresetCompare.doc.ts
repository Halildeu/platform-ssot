import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ThemePresetCompare",
  indexItem: {
  "name": "ThemePresetCompare",
  "kind": "component",
  "importStatement": "import { ThemePresetCompare } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "theme",
  "subgroup": "preset_compare",
  "tags": [
    "compare",
    "stable",
    "theme-presets",
    "wave-10"
  ],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Theme preset comparison",
  "demoMode": "live",
  "description": "Iki resmi preset arasindaki appearance, density, contrast ve intent farklarini ayni compare matrisiyle gosterir.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "uxPrimaryThemeId": "accessibility_and_inclusive_design",
  "uxPrimarySubthemeId": "contrast_typography_readability",
  "roadmapWaveId": "wave_10_theme_presets",
  "acceptanceContractId": "ui-library-wave-10-theme-presets-v1"
},
  apiItem: {
  "name": "ThemePresetCompare",
  "variantAxes": [
    "pair: default-vs-accessibility | default-vs-compact",
    "axes: core-only | extended",
    "surface: gallery-linked | standalone"
  ],
  "stateModel": [
    "left/right preset binding",
    "axis row rendering",
    "contrast mapping"
  ],
  "props": [
    {
      "name": "leftPreset / rightPreset",
      "type": "ThemePresetGalleryItem",
      "default": "-",
      "required": true,
      "description": "Karsilastirilacak iki resmi preset nesnesini tasir."
    },
    {
      "name": "axes",
      "type": "string[]",
      "default": "['appearance','density','intent','contrast']",
      "required": false,
      "description": "Compare matrisinde gosterilecek eksenleri belirler."
    }
  ],
  "previewFocus": [
    "preset pair comparison",
    "contrast and density review"
  ],
  "regressionFocus": [
    "missing preset fallback",
    "axis mapping parity",
    "preview card pairing"
  ]
},
};

export default entry;
