import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Switch",
  indexItem: {
  "name": "Switch",
  "kind": "component",
  "importStatement": "import { Switch } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "forms",
  "subgroup": "inputs",
  "tags": [
    "forms",
    "stable",
    "toggle",
    "wave-3"
  ],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Switch / Toggle",
  "demoMode": "live",
  "description": "Switch primitivei; release, visibility ve policy toggles icin access-aware, validation-ready boolean gecis davranisi sunar.",
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
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "deterministic_state_model",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1"
},
  apiItem: {
  "name": "Switch",
  "variantAxes": [
    "size: sm | md | lg",
    "state: unchecked | checked | invalid | readonly | disabled",
    "mode: immediate-toggle | policy-gated-toggle"
  ],
  "stateModel": [
    "controlled vs uncontrolled",
    "instant toggle intent",
    "inline validation",
    "access-aware interaction"
  ],
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Toggle davranisinin basligini ve baglamini tanimlar."
    },
    {
      "name": "description / hint / error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Aciklama, yardim ve validation geri bildirimi."
    },
    {
      "name": "checked / defaultChecked",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Controlled veya uncontrolled acik/kapali durumu."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Track ve hit-area boyutunu belirler."
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
    "controlled release toggle",
    "readonly and disabled matrix",
    "policy-blocked validation state"
  ],
  "regressionFocus": [
    "readonly interaction guard",
    "controlled/uncontrolled parity",
    "switch role semantics"
  ]
},
};

export default entry;
