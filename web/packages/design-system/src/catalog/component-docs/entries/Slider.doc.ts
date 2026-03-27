import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Slider",
  indexItem: {
  "name": "Slider",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "forms",
  "subgroup": "inputs",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Slider",
  "demoMode": "live",
  "description": "Slider primitivei; density, threshold ve progress tuning icin access-aware range secimi sunar.",
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
    "range-entry"
  ],
  "uxPrimaryThemeId": "personalization_and_adaptive_productivity",
  "uxPrimarySubthemeId": "adaptive_density_layout_preferences",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1",
  "importStatement": "import { Slider } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ],
    "dependsOn": ["Text"]
},
  apiItem: {
  "name": "Slider",
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
      "numeric range selection",
      "inline validation",
      "access-aware interaction"
    ],
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Range seciminin basligi ve form baglami."
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
      "name": "min",
      "type": "number",
      "default": "0",
      "required": false,
      "description": "Range alt siniri."
    },
    {
      "name": "max",
      "type": "number",
      "default": "100",
      "required": false,
      "description": "Range ust siniri."
    },
    {
      "name": "step",
      "type": "number",
      "default": "1",
      "required": false,
      "description": "Range adim araligi."
    },
    {
      "name": "valueFormatter",
      "type": "(value:number)=>ReactNode",
      "default": "-",
      "required": false,
      "description": "Gorunen deger chipinin bicimini belirler."
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
    "controlled density slider",
    "readonly matrix",
    "policy-blocked invalid state"
  ],
  "regressionFocus": [
    "controlled/uncontrolled parity",
    "readonly interaction guard",
    "value formatting consistency"
  ]
},
};

export default entry;
