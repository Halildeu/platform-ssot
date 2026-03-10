import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TextArea",
  indexItem: {
  "name": "TextArea",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "forms",
  "subgroup": "inputs",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Text Input / TextArea",
  "demoMode": "live",
  "description": "TextArea primitivei; long-form text entry, auto-resize, inline guidance ve validation davranisini ortak field shell ile sunar.",
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
    "multiline-entry"
  ],
  "uxPrimaryThemeId": "data_entry_validation_recovery",
  "uxPrimarySubthemeId": "dependency_aware_form_guidance",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1",
  "importStatement": "import { TextArea } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "TextArea",
  "variantAxes": [
    "size: sm | md | lg",
    "resize: vertical | none | auto",
    "tone: default | invalid | readonly | disabled"
  ],
  "stateModel": [
    "controlled vs uncontrolled",
    "auto-resize",
    "inline validation",
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
      "name": "resize",
      "type": "'vertical' | 'none' | 'auto'",
      "default": "vertical",
      "required": false,
      "description": "Metin alanı boyutlandırma davranışını belirler."
    },
    {
      "name": "rows",
      "type": "number",
      "default": "4",
      "required": false,
      "description": "Başlangıç görünür satır sayısı."
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
    "auto resize + helper",
    "validation state matrix",
    "multiline readability"
  ],
  "regressionFocus": [
    "auto-resize height sync",
    "readonly/disabled guard",
    "count feedback consistency"
  ]
},
};

export default entry;
