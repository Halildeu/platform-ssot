import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Radio",
  indexItem: {
  "name": "Radio",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "forms",
  "subgroup": "inputs",
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
  "tags": [
    "wave-3",
    "forms",
    "stable",
    "single-choice"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "smart_defaults_and_prefill",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1",
  "importStatement": "import { Radio } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Radio",
  "variantAxes": [
    "size: sm | md | lg",
    "state: unchecked | checked | invalid | readonly | disabled",
    "grouping: single | list"
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
      "dark-theme"
    ],
    "behaviorModel": [
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
      "name": "name",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Tek secimli grup davranisi icin grup adi."
    },
    {
      "name": "value",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Form payload baglami icin deger."
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
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Hit-area ve label yoğunluğu."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Yukleme gostergesi; radio'yu etkileşimsiz yapar."
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
