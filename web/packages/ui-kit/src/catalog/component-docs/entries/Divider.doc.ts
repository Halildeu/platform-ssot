import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Divider",
  indexItem: {
  "name": "Divider",
  "kind": "component",
  "importStatement": "import { Divider } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "content",
  "subgroup": "divider",
  "tags": [
    "beta",
    "divider",
    "foundation-primitives",
    "wave-1"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "general",
  "taxonomySubgroup": "Divider",
  "demoMode": "live",
  "description": "Separation primitivei; horizontal, vertical ve labelled divider davranisini tek API ile sunar.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "responsive_layout"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "uxPrimaryThemeId": "consistency_and_pattern_governance",
  "uxPrimarySubthemeId": "behavior_contracts_across_modules",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1"
},
  apiItem: {
  "name": "Divider",
  "variantAxes": [
    "orientation: horizontal | vertical",
    "label: none | text",
    "decorative: true | false"
  ],
  "stateModel": [
    "semantic-separator",
    "decorative-only",
    "spacing-preservation"
  ],
  "props": [
    {
      "name": "orientation",
      "type": "'horizontal' | 'vertical'",
      "default": "horizontal",
      "required": false,
      "description": "Ayırıcı eksenini belirler."
    },
    {
      "name": "label",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Anlamlı ayrım metni veya bağlamsal başlık."
    },
    {
      "name": "decorative",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Ayrıcı yalnız görsel amaçlı ise semantik role kapatılır."
    }
  ],
  "previewFocus": [
    "horizontal ve vertical varyantlar",
    "labelled divider",
    "decorative vs semantic ayrımı"
  ],
  "regressionFocus": [
    "separator role davranışı",
    "decorative metadata",
    "vertical divider spacing kararlılığı"
  ]
},
};

export default entry;
