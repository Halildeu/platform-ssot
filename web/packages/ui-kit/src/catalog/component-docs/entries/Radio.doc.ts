import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Radio",
  indexItem: {
  "name": "Radio",
  "kind": "component",
  "importStatement": "import { Radio } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "forms",
  "subgroup": "inputs",
  "tags": [
    "forms",
    "single-choice",
    "stable",
    "wave-3"
  ],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Checkbox / Radio",
  "demoMode": "live",
  "description": "Radio primitivei; tek secimli tercih, helper, validation ve access-aware interaction davranisini ortak boolean-control shell ile sunar.",
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
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "smart_defaults_and_prefill",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1"
},
  apiItem: {
  "name": "Radio",
  "variantAxes": [
    "size: sm | md | lg",
    "state: unchecked | checked | invalid | readonly | disabled",
    "grouping: single | list"
  ],
  "stateModel": [
    "controlled vs uncontrolled",
    "single-choice group",
    "inline validation",
    "access-aware interaction"
  ],
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Tekil tercih etiketini tanımlar."
    },
    {
      "name": "description / hint / error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Açıklama, yardım ve doğrulama geri bildirimi."
    },
    {
      "name": "name / value",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Tek secimli grup davranisi ve form payload baglami."
    },
    {
      "name": "checked / defaultChecked",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Controlled veya uncontrolled secili durum."
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
    "controlled radio group",
    "state matrix",
    "helper + invalid messaging"
  ],
  "regressionFocus": [
    "group selection parity",
    "readonly interaction guard",
    "label/description association"
  ]
},
};

export default entry;
