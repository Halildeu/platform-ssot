import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TextInput",
  indexItem: {
  "name": "TextInput",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "forms",
  "subgroup": "inputs",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Text Input / TextArea",
  "demoMode": "live",
  "description": "TextInput primitivei; label, helper, error, count ve access-aware text entry davranisini ortak field shell ile sunar.",
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
    "text-entry"
  ],
  "uxPrimaryThemeId": "data_entry_validation_recovery",
  "uxPrimarySubthemeId": "inline_validation_before_submit",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1",
  "importStatement": "import { TextInput } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "TextInput",
  "variantAxes": [
    "size: sm | md | lg",
    "tone: default | invalid | readonly | disabled",
    "slots: none | leading | trailing | both"
  ],
  "stateModel": [
    "controlled vs uncontrolled",
    "inline validation",
    "count feedback",
    "access-aware interaction"
  ],
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Alan başlığı ve form bağlamı."
    },
    {
      "name": "description / hint / error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Inline yardım, açıklama ve doğrulama geri bildirimi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Density ve hit-area kararını belirler."
    },
    {
      "name": "leadingVisual / trailingVisual",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Slot tabanlı ikon veya yardımcı görsel alanları."
    },
    {
      "name": "showCount",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Karakter sayacını aktif eder."
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
    "helper + count",
    "validation state matrix",
    "access-aware behavior"
  ],
  "regressionFocus": [
    "readonly/disabled guard",
    "controlled/uncontrolled parity",
    "count feedback consistency"
  ]
},
};

export default entry;
