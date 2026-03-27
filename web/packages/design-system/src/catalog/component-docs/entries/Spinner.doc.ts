import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Spinner",
  indexItem: {
  "name": "Spinner",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "feedback",
  "subgroup": "loading",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Progress / Spinner",
  "demoMode": "live",
  "description": "Loading indicator primitivei; inline, block ve overlay modlarini ortak semantikle verir.",
  "sectionIds": [
    "component_library_management",
    "state_feedback",
    "responsive_layout"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-1",
    "foundation-primitives",
    "beta",
    "loading"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "response_time_budget_feedback",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1",
  "importStatement": "import { Spinner } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Spinner",
  "variantAxes": [
    "mode: inline | block",
    "size: xs | sm | md | lg | xl"
  ],
  "stateModel": [
    "status",
    "aria-busy",
    "overlay-blocking-scope"
  ],
    "previewStates": [
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "status",
      "aria-busy",
      "overlay-blocking-scope"
    ],
  "props": [
    {
      "name": "mode",
      "type": "'inline' | 'block'",
      "default": "inline",
      "required": false,
      "description": "Spinner'ın hangi yerleşim katmanında görüneceğini belirler."
    },
    {
      "name": "size",
      "type": "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      "default": "md",
      "required": false,
      "description": "Görsel yoğunluk ve hit-area ölçeği."
    },
    {
      "name": "label",
      "type": "string",
      "default": "Loading",
      "required": false,
      "description": "Erişilebilir loading açıklaması."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Visual override sinifi."
    }
  ],
  "previewFocus": [
    "inline ve block loading",
    "overlay spinner",
    "tone ve size farkları"
  ],
  "regressionFocus": [
    "role=status ve aria-busy kontratı",
    "mode/tone/size metadata",
    "overlay ile inline spinner ayrışması"
  ]
},
};

export default entry;
