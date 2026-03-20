import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Dropdown",
  indexItem: {
  "name": "Dropdown",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "forms",
  "subgroup": "dropdown",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Select / Dropdown / Combobox",
  "demoMode": "live",
  "description": "Aksiyon ve filtre menu akislari icin keyboard/dismiss davranisi olan dropdown primitivei.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "contextual_quick_actions",
  "roadmapWaveId": "wave_5_overlay",
  "acceptanceContractId": "ui-library-wave-5-overlay-v1",
  "tags": [
    "wave-5",
    "overlay",
    "stable",
    "menu"
  ],
  "importStatement": "import { Dropdown } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Dropdown",
  "variantAxes": [
    "align: left | right",
    "menu: action | filter",
    "state: default | readonly | disabled-item"
  ],
  "stateModel": [
    "disabled",
    "open"
  ],
    "previewStates": [
      "disabled",
      "open",
      "closed",
      "dark-theme"
    ],
    "behaviorModel": [
      "closed / open",
      "outside click dismiss",
      "escape dismiss",
      "selection callback"
    ],
  "props": [
    {
      "name": "children",
      "type": "ReactElement",
      "default": "-",
      "required": true,
      "description": "Dropdown tetikleyici buton elementi; cloneElement ile menu davranisi eklenir."
    },
    {
      "name": "items",
      "type": "DropdownEntry[]",
      "default": "-",
      "required": true,
      "description": "Menu item, separator ve label listesi; disabled item destegi vardir."
    },
    {
      "name": "placement",
      "type": "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'",
      "default": "bottom-start",
      "required": false,
      "description": "Menu panelinin trigger'a gore konumlanmasini belirler."
    },
    {
      "name": "minWidth",
      "type": "number",
      "default": "180",
      "required": false,
      "description": "Menu panelinin minimum genisligini piksel olarak belirler."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Dropdown acilmasini engeller."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Menu panel elementi icin ek CSS sinifi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Bilesen boyut varyantini belirler."
    }
  ],
  "previewFocus": [
    "action menu",
    "filter menu",
    "readonly + disabled items"
  ],
  "regressionFocus": [
    "menu semantics",
    "outside click + escape close",
    "access guard parity"
  ]
},
};

export default entry;
