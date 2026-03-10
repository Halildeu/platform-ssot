import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Tabs",
  indexItem: {
  "name": "Tabs",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "navigation",
  "subgroup": "tabs",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Tabs",
  "demoMode": "live",
  "description": "Tabs navigation primitivei; controlled/uncontrolled state, keyboard navigation ve token-first tablist davranisini tek API ile sunar.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-2",
    "navigation",
    "stable"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1",
  "importStatement": "import { Tabs } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "Tabs",
  "variantAxes": [
    "appearance: underline | pill",
    "orientation: horizontal | vertical",
    "activationMode: automatic | manual"
  ],
  "stateModel": [
    "controlled",
    "uncontrolled",
    "disabled tab",
    "badge/icon metadata"
  ],
  "props": [
    {
      "name": "items",
      "type": "TabItem[]",
      "default": "-",
      "required": true,
      "description": "Label, content, badge, icon ve disabled kararlarini tasiyan sekme listesi."
    },
    {
      "name": "value / defaultValue",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Controlled veya uncontrolled state secimini belirler."
    },
    {
      "name": "appearance",
      "type": "'underline' | 'pill'",
      "default": "underline",
      "required": false,
      "description": "Sekmenin navigation tonu ve vurgu katmanini belirler."
    },
    {
      "name": "orientation",
      "type": "'horizontal' | 'vertical'",
      "default": "horizontal",
      "required": false,
      "description": "Wayfinding yonunu ve layout dagilimini belirler."
    },
    {
      "name": "activationMode",
      "type": "'automatic' | 'manual'",
      "default": "automatic",
      "required": false,
      "description": "Keyboard navigation sirasinda panel aktivasyon davranisini belirler."
    }
  ],
  "previewFocus": [
    "controlled underline",
    "vertical manual activation",
    "badge/icon metadata"
  ],
  "regressionFocus": [
    "APG keyboard navigation",
    "disabled tab drift",
    "panel activation semantics"
  ]
},
};

export default entry;
