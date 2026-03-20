import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Skeleton",
  indexItem: {
  "name": "Skeleton",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "feedback",
  "subgroup": "loading",
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
  "tags": [
    "wave-1",
    "foundation-primitives",
    "beta",
    "loading"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "loading_empty_error_success_patterns",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1",
  "importStatement": "import { Skeleton } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationDisabledShowcase.tsx"
  ]
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
    "previewStates": [
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "loading-placeholder",
      "reduced-motion",
      "layout-preservation"
    ],
  "props": [
    {
      "name": "width",
      "type": "string | number",
      "default": "100%",
      "required": false,
      "description": "Placeholder genisligini belirler; CSS degeri veya piksel."
    },
    {
      "name": "height",
      "type": "string | number",
      "default": "16px",
      "required": false,
      "description": "Placeholder yuksekligini belirler."
    },
    {
      "name": "circle",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Daire seklinde placeholder uretir."
    },
    {
      "name": "lines",
      "type": "number",
      "default": "1",
      "required": false,
      "description": "Birden fazla satir placeholder uretir; son satir %75 genislikte render edilir."
    },
    {
      "name": "animated",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Pulse animasyonu aktif mi, reduced-motion tercihinde nasıl davranacağını belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Visual override sinifi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Skeleton yogunluk ve boyut varyanti."
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
