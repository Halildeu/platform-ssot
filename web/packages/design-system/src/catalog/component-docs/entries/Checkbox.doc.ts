import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Checkbox",
  indexItem: {
  "name": "Checkbox",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "forms",
  "subgroup": "inputs",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Checkbox / Radio",
  "demoMode": "live",
  "description": "Checkbox primitivei; helper, validation, readonly/disabled ve indeterminate davranisini ortak boolean-control shell ile sunar.",
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
  "tags": [
    "wave-3",
    "forms",
    "stable",
    "boolean-entry"
  ],
  "uxPrimaryThemeId": "data_entry_validation_recovery",
  "uxPrimarySubthemeId": "input_error_prevention_patterns",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1",
  "importStatement": "import { Checkbox } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Checkbox",
  "variantAxes": [
    "size: sm | md | lg",
    "state: unchecked | checked | indeterminate",
    "tone: default | invalid | readonly | disabled"
  ],
  "stateModel": [
    "disabled",
    "readOnly",
    "error",
    "loading"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "checked",
      "indeterminate",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled vs uncontrolled",
      "indeterminate mixed state",
      "inline validation",
      "access-aware interaction"
    ],
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Boolean aksiyon veya onay alanı başlığı."
    },
    {
      "name": "description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Aciklama metni."
    },
    {
      "name": "hint",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Yardim metni."
    },
    {
      "name": "error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Dogrulama geri bildirimi."
    },
    {
      "name": "checked",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Controlled secili durum."
    },
    {
      "name": "defaultChecked",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Uncontrolled secili durum."
    },
    {
      "name": "indeterminate",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Kısmi seçim veya üst-seviye aggregate state davranışı."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Hit-area ve label yoğunluğu."
    },
    {
      "name": "variant",
      "type": "'default' | 'card'",
      "default": "default",
      "required": false,
      "description": "Card varyanti checkbox'i kenarlikli kart konteynerine sarar."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Yukleme gostergesi; checkbox'i etkileşimsiz yapar."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native disabled davranisini aktif eder."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanlı görünürlük ve etkileşim düzeyi."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisim kisitlamasi nedenini tooltip olarak gosterir."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    }
  ],
  "previewFocus": [
    "controlled checkbox",
    "indeterminate mixed state",
    "validation + readonly matrix"
  ],
  "regressionFocus": [
    "indeterminate native sync",
    "readonly interaction guard",
    "controlled/uncontrolled parity"
  ]
},
};

export default entry;
