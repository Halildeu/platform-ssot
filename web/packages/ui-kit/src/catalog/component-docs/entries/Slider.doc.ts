import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Slider",
  indexItem: {
  "name": "Slider",
  "kind": "component",
  "importStatement": "import { Slider } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "forms",
  "subgroup": "inputs",
  "tags": [
    "beta",
    "forms",
    "range-entry",
    "wave-3"
  ],
  "availability": "exported",
  "lifecycle": "beta",
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
  "uxPrimaryThemeId": "personalization_and_adaptive_productivity",
  "uxPrimarySubthemeId": "adaptive_density_layout_preferences",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1"
},
  apiItem: {
  "name": "Slider",
  "variantAxes": [
    "size: sm | md | lg",
    "range: min | max | step",
    "state: default | invalid | readonly | disabled"
  ],
  "stateModel": [
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
      "name": "description / hint / error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Aciklama, yardim ve validation geri bildirimi."
    },
    {
      "name": "min / max / step",
      "type": "number",
      "default": "0 / 100 / 1",
      "required": false,
      "description": "Range davranisini belirleyen numeric eksen."
    },
    {
      "name": "valueFormatter",
      "type": "(value:number)=>ReactNode",
      "default": "-",
      "required": false,
      "description": "Gorunen deger chipinin bicimini belirler."
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
