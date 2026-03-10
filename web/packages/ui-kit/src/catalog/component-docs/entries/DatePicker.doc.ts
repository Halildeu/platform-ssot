import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DatePicker",
  indexItem: {
  "name": "DatePicker",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
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
  "importStatement": "import { DatePicker } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "DatePicker",
  "variantAxes": [
    "size: sm | md | lg",
    "range: min | max",
    "state: default | invalid | readonly | disabled"
  ],
  "stateModel": [
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
      "name": "description / hint / error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Aciklama, yardim ve validation geri bildirimi."
    },
    {
      "name": "value / defaultValue",
      "type": "string (YYYY-MM-DD)",
      "default": "-",
      "required": false,
      "description": "Controlled veya uncontrolled secili tarih."
    },
    {
      "name": "min / max",
      "type": "string (YYYY-MM-DD)",
      "default": "-",
      "required": false,
      "description": "Secilebilir tarih araligini belirler."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkileşim duzeyi."
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
