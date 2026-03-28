import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Switch",
  indexItem: {
  "name": "Switch",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "forms",
  "subgroup": "inputs",
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
  "tags": [
    "wave-3",
    "forms",
    "stable",
    "toggle"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "deterministic_state_model",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1",
  "importStatement": "import { Switch } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Switch",
  "variantAxes": [
    "size: sm | md | lg",
    "state: unchecked | checked | readonly | disabled",
    "mode: immediate-toggle | policy-gated-toggle"
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
      "name": "checked",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Controlled acik/kapali durumu."
    },
    {
      "name": "defaultChecked",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Uncontrolled acik/kapali durumu."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Track ve hit-area boyutunu belirler."
    },
    {
      "name": "variant",
      "type": "'default' | 'destructive'",
      "default": "default",
      "required": false,
      "description": "Switch gorsel varyanti; destructive modda checked durumda error rengi kullanir."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Thumb icinde yukleme gostergesi; switch'i etkileşimsiz yapar."
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
