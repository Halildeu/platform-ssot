import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ThemePresetGallery",
  indexItem: {
  "name": "ThemePresetGallery",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "theme",
  "subgroup": "preset_gallery",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Theme preset gallery",
  "demoMode": "live",
  "description": "Resmi preset ailesini secilebilir theme preview galerisi olarak sunar ve preset kimligini docs/runtime ile ayni tutar.",
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
  "tags": [
    "wave-10",
    "theme-presets",
    "stable",
    "gallery"
  ],
  "uxPrimaryThemeId": "theming_customization",
  "uxPrimarySubthemeId": "mode_density_personalization",
  "roadmapWaveId": "wave_10_theme_presets",
  "acceptanceContractId": "ui-library-wave-10-theme-presets-v1",
  "importStatement": "import { ThemePresetGallery } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "ThemePresetGallery",
  "variantAxes": [
    "selection: controlled | uncontrolled",
    "preset-count: compact | expanded",
    "contrast: mixed | standard-only"
  ],
  "stateModel": [
    "selected preset",
    "default preset emphasis",
    "compare axis chip rendering"
  ],
  "props": [
    {
      "name": "presets",
      "type": "ThemePresetGalleryItem[]",
      "default": "[]",
      "required": true,
      "description": "Resmi preset ailesinin label, mode, appearance ve density alanlarini tasir."
    },
    {
      "name": "selectedPresetId / defaultSelectedPresetId",
      "type": "string | null",
      "default": "null",
      "required": false,
      "description": "Gallery secimini controlled veya uncontrolled modda yonetir."
    },
    {
      "name": "compareAxes / onSelectPreset",
      "type": "ReactNode[] / (id, item) => void",
      "default": "[] / -",
      "required": false,
      "description": "Gallery uzerindeki compare eksenlerini ve preset secim olayini disari acar."
    }
  ],
  "previewFocus": [
    "preset catalog gallery",
    "default/high-contrast emphasis"
  ],
  "regressionFocus": [
    "selection state parity",
    "empty fallback",
    "default/high contrast badge mapping"
  ]
},
};

export default entry;
