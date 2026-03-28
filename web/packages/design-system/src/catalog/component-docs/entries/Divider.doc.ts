import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Divider",
  indexItem: {
  "name": "Divider",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "content",
  "subgroup": "divider",
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
  "tags": [
    "wave-1",
    "foundation-primitives",
    "beta",
    "divider"
  ],
  "uxPrimaryThemeId": "consistency_and_pattern_governance",
  "uxPrimarySubthemeId": "behavior_contracts_across_modules",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1",
  "importStatement": "import { Divider } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
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
    "previewStates": [
      "compact",
      "dark-theme"
    ],
    "behaviorModel": [
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
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Anlamlı ayrım metni veya bağlamsal başlık."
    },
    {
      "name": "spacing",
      "type": "'none' | 'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Ayirici margin araligini belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Ayirici kalinlik ve spacing varyanti."
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
