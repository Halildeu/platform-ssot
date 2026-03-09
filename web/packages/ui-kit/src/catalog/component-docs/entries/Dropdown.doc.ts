import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Dropdown",
  indexItem: {
  "name": "Dropdown",
  "kind": "component",
  "importStatement": "import { Dropdown } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "forms",
  "subgroup": "dropdown",
  "tags": [
    "menu",
    "overlay",
    "stable",
    "wave-5"
  ],
  "availability": "exported",
  "lifecycle": "stable",
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
  "acceptanceContractId": "ui-library-wave-5-overlay-v1"
},
  apiItem: {
  "name": "Dropdown",
  "variantAxes": [
    "align: left | right",
    "menu: action | filter",
    "state: default | readonly | disabled-item"
  ],
  "stateModel": [
    "closed / open",
    "outside click dismiss",
    "escape dismiss",
    "selection callback"
  ],
  "props": [
    {
      "name": "trigger",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Dropdown tetikleyici buton icerigi."
    },
    {
      "name": "items",
      "type": "DropdownItem[]",
      "default": "-",
      "required": true,
      "description": "Menu item listesi; disabled item destegi vardir."
    },
    {
      "name": "onSelect",
      "type": "(key: string) => void",
      "default": "-",
      "required": false,
      "description": "Secili item anahtari ile callback uretir."
    },
    {
      "name": "align",
      "type": "'left' | 'right'",
      "default": "left",
      "required": false,
      "description": "Menu panelinin triggera gore hizalanmasi."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim seviyesi."
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
