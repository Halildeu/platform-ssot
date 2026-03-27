import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TimePicker",
  indexItem: {
  "name": "TimePicker",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "forms",
  "subgroup": "inputs",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Date / Time pickers",
  "demoMode": "live",
  "description": "TimePicker primitivei; rollout, cutover ve maintenance pencere saatlerini access-aware time entry yuzeyi ile sunar.",
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
    "time-entry"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "cross_step_context_persistence",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1",
  "importStatement": "import { TimePicker } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ],
    "dependsOn": ["Text"]
},
  apiItem: {
  "name": "TimePicker",
  "variantAxes": [
    "size: sm | md | lg",
    "range: min | max | step",
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
      "time window entry",
      "inline validation",
      "access-aware interaction"
    ],
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Saat seciminin basligi ve baglami."
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
      "type": "string (HH:MM)",
      "default": "-",
      "required": false,
      "description": "Controlled secili saat."
    },
    {
      "name": "defaultValue",
      "type": "string (HH:MM)",
      "default": "-",
      "required": false,
      "description": "Uncontrolled secili saat."
    },
    {
      "name": "min",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Secilebilir saat alt siniri."
    },
    {
      "name": "max",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Secilebilir saat ust siniri."
    },
    {
      "name": "step",
      "type": "number",
      "default": "-",
      "required": false,
      "description": "Saat adim araligi."
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
      "description": "Policy tabanli gorunurluk ve etkilesim duzeyi."
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
    "controlled cutover time",
    "readonly state",
    "invalid release window state"
  ],
  "regressionFocus": [
    "controlled/uncontrolled parity",
    "readonly interaction guard",
    "selected time badge sync"
  ]
},
};

export default entry;
