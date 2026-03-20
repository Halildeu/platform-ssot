import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TextArea",
  indexItem: {
  "name": "TextArea",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
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
  "importStatement": "import { TextArea } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
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
    "disabled",
    "readOnly",
    "error",
    "loading"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "error",
      "dark-theme"
    ],
    "behaviorModel": [
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
      "name": "description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Inline aciklama metni."
    },
    {
      "name": "hint",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Inline yardim metni."
    },
    {
      "name": "error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Dogrulama geri bildirimi."
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
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Density ve hit-area kararini belirler."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Yukleme gostergesi render eder ve textarea'yi devre disi birakir."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native disabled davranisini aktif eder."
    },
    {
      "name": "readOnly",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native readonly davranisini aktif eder."
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
