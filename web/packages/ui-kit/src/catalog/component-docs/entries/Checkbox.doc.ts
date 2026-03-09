import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Checkbox",
  indexItem: {
  "name": "Checkbox",
  "kind": "component",
  "importStatement": "import { Checkbox } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "forms",
  "subgroup": "inputs",
  "tags": [
    "boolean-entry",
    "forms",
    "stable",
    "wave-3"
  ],
  "availability": "exported",
  "lifecycle": "stable",
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
  "uxPrimaryThemeId": "data_entry_validation_recovery",
  "uxPrimarySubthemeId": "input_error_prevention_patterns",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1"
},
  apiItem: {
  "name": "Checkbox",
  "variantAxes": [
    "size: sm | md | lg",
    "state: unchecked | checked | indeterminate",
    "tone: default | invalid | readonly | disabled"
  ],
  "stateModel": [
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
      "name": "description / hint / error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Açıklama, yardım ve doğrulama geri bildirimi."
    },
    {
      "name": "checked / defaultChecked",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Controlled veya uncontrolled seçili durum."
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
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanlı görünürlük ve etkileşim düzeyi."
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
