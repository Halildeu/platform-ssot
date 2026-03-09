import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Spinner",
  indexItem: {
  "name": "Spinner",
  "kind": "component",
  "importStatement": "import { Spinner } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "feedback",
  "subgroup": "loading",
  "tags": [
    "beta",
    "foundation-primitives",
    "loading",
    "wave-1"
  ],
  "availability": "exported",
  "lifecycle": "beta",
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
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "response_time_budget_feedback",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1"
},
  apiItem: {
  "name": "Spinner",
  "variantAxes": [
    "mode: inline | block | overlay",
    "size: sm | md | lg",
    "tone: primary | neutral | inverse"
  ],
  "stateModel": [
    "status",
    "aria-busy",
    "overlay-blocking-scope"
  ],
  "props": [
    {
      "name": "mode",
      "type": "'inline' | 'block' | 'overlay'",
      "default": "inline",
      "required": false,
      "description": "Spinner'ın hangi yerleşim katmanında görüneceğini belirler."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Görsel yoğunluk ve hit-area ölçeği."
    },
    {
      "name": "tone",
      "type": "'primary' | 'neutral' | 'inverse'",
      "default": "primary",
      "required": false,
      "description": "Semantic tone katmanı."
    },
    {
      "name": "label",
      "type": "string",
      "default": "Yükleniyor",
      "required": false,
      "description": "Erişilebilir loading açıklaması."
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
