import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Select",
  indexItem: {
  "name": "Select",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "forms",
  "subgroup": "select",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Select / Dropdown / Combobox",
  "demoMode": "live",
  "description": "Temel secim ve dropdown alanlarini ortak stil ve access guard ile sunar.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync"
  ],
  "importStatement": "import { Select } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "Select",
  "variantAxes": [
    "mode: controlled",
    "placeholder: on | off",
    "access: full | readonly | disabled | hidden"
  ],
  "stateModel": [
    "selected value",
    "placeholder option visibility",
    "readonly/disabled interaction guard",
    "option disabled state"
  ],
  "props": [
    {
      "name": "value / onChange",
      "type": "string / (value: string) => void",
      "default": "-",
      "required": true,
      "description": "Controlled secim state'ini ve degisim callback'ini tanimlar."
    },
    {
      "name": "options",
      "type": "Array<{ label: string; value: string; disabled?: boolean }>",
      "default": "[]",
      "required": true,
      "description": "Label, value ve opsiyonel disabled bilgisi tasiyan secenek listesi."
    },
    {
      "name": "placeholder",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Deger secilmeden once gizli/disabled placeholder option gosterir."
    },
    {
      "name": "disabled / access / accessReason",
      "type": "boolean / 'full' | 'readonly' | 'disabled' | 'hidden' / string",
      "default": "false / full / -",
      "required": false,
      "description": "Native disabled, policy guard ve tooltip/title nedeni ayni API uzerinden yonetilir."
    }
  ],
  "previewFocus": [
    "controlled selection",
    "placeholder-first flow",
    "readonly and disabled states"
  ],
  "regressionFocus": [
    "onChange access guard",
    "placeholder option parity",
    "option disabled semantics"
  ]
},
};

export default entry;
