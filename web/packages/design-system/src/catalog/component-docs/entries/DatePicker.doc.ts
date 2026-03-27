import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DatePicker",
  indexItem: {
  "name": "DatePicker",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "forms",
  "subgroup": "inputs",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Date / Time pickers",
  "demoMode": "live",
  "description": "DatePicker primitivei; milestone, release ve tarih secim akislari icin access-aware date entry yuzeyi sunar.",
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
    "beta",
    "date-entry"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "cross_step_context_persistence",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1",
  "importStatement": "import { DatePicker } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ],
    "dependsOn": ["Text"]
},
  apiItem: {
  "name": "DatePicker",
  "variantAxes": [
    "size: sm | md | lg",
    "range: min | max",
    "state: default | invalid | readonly | disabled"
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
      "calendar date entry",
      "inline validation",
      "access-aware interaction"
    ],
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Tarih seciminin basligi ve baglami."
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
      "description": "Validation geri bildirimi."
    },
    {
      "name": "value",
      "type": "string (YYYY-MM-DD)",
      "default": "-",
      "required": false,
      "description": "Controlled secili tarih."
    },
    {
      "name": "defaultValue",
      "type": "string (YYYY-MM-DD)",
      "default": "-",
      "required": false,
      "description": "Uncontrolled secili tarih."
    },
    {
      "name": "min",
      "type": "string (YYYY-MM-DD)",
      "default": "-",
      "required": false,
      "description": "Secilebilir tarih alt siniri."
    },
    {
      "name": "max",
      "type": "string (YYYY-MM-DD)",
      "default": "-",
      "required": false,
      "description": "Secilebilir tarih ust siniri."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Density ve hit-area kararini belirler."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native disabled davranisini aktif eder."
    },
    {
      "name": "fullWidth",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Parent genisligine yayilmayi kontrol eder."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkileşim duzeyi."
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
    "controlled milestone date",
    "readonly state",
    "invalid release window state"
  ],
  "regressionFocus": [
    "controlled/uncontrolled parity",
    "readonly interaction guard",
    "selected date badge sync"
  ]
},
};

export default entry;
