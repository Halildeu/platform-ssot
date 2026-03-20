import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TextInput",
  indexItem: {
  "name": "TextInput",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
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
  "importStatement": "import { TextInput } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
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
    "disabled",
    "readOnly",
    "error",
    "loading"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "error",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
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
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Density ve hit-area kararını belirler."
    },
    {
      "name": "leadingVisual",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Slot tabanli on ikon veya yardimci gorsel alani."
    },
    {
      "name": "trailingVisual",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Slot tabanli arka ikon veya yardimci gorsel alani."
    },
    {
      "name": "showCount",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Karakter sayacını aktif eder."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Trailing slot'ta yukleme gostergesi render eder ve input'u readonly yapar."
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
