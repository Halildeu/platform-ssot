import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Skeleton",
  indexItem: {
  "name": "Skeleton",
  "kind": "component",
  "importStatement": "import { Skeleton } from 'mfe-ui-kit';",
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
  "taxonomySubgroup": "Skeleton / Placeholder",
  "demoMode": "live",
  "description": "Loading placeholder primitivei; text, avatar ve card skeleton varyantlarini token-first sunar.",
  "sectionIds": [
    "component_library_management",
    "state_feedback",
    "responsive_layout"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "loading_empty_error_success_patterns",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1"
},
  apiItem: {
  "name": "Skeleton",
  "variantAxes": [
    "variant: text | rect | avatar | pill | table-row",
    "animated: true | false"
  ],
  "stateModel": [
    "loading-placeholder",
    "reduced-motion",
    "layout-preservation"
  ],
  "props": [
    {
      "name": "variant",
      "type": "'text' | 'rect' | 'avatar' | 'pill' | 'table-row'",
      "default": "text",
      "required": false,
      "description": "Placeholder geometrisini ve bilgi yoğunluğunu belirler."
    },
    {
      "name": "lines",
      "type": "number",
      "default": "1",
      "required": false,
      "description": "Text varyantında üretilecek placeholder satır sayısı."
    },
    {
      "name": "animated",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Pulse animasyonu aktif mi, reduced-motion tercihinde nasıl davranacağını belirler."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy temelli görünürlük kontrolü."
    }
  ],
  "previewFocus": [
    "text ve card placeholder",
    "avatar + list skeleton",
    "table-row ve reduced motion"
  ],
  "regressionFocus": [
    "table-row placeholder sayısı",
    "animated metadata ve motion-reduce",
    "content reflow yerine yer tutucu kararlılığı"
  ]
},
};

export default entry;
