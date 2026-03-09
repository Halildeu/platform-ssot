import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TimePicker",
  indexItem: {
  "name": "TimePicker",
  "kind": "component",
  "importStatement": "import { TimePicker } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "forms",
  "subgroup": "inputs",
  "tags": [
    "beta",
    "forms",
    "time-entry",
    "wave-3"
  ],
  "availability": "exported",
  "lifecycle": "beta",
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
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "cross_step_context_persistence",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1"
},
  apiItem: {
  "name": "TimePicker",
  "variantAxes": [
    "size: sm | md | lg",
    "range: min | max | step",
    "state: default | invalid | readonly | disabled"
  ],
  "stateModel": [
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
      "name": "description / hint / error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Aciklama, yardim ve validation geri bildirimi."
    },
    {
      "name": "value / defaultValue",
      "type": "string (HH:MM)",
      "default": "-",
      "required": false,
      "description": "Controlled veya uncontrolled secili saat."
    },
    {
      "name": "min / max / step",
      "type": "string / string / number",
      "default": "-",
      "required": false,
      "description": "Secilebilir saat araligi ve adim araligi."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim duzeyi."
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
