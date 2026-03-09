import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "IconButton",
  indexItem: {
  "name": "IconButton",
  "kind": "component",
  "importStatement": "import { IconButton } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "actions",
  "subgroup": "buttons",
  "tags": [
    "beta",
    "foundation-primitives",
    "icon-button",
    "wave-1"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "actions",
  "taxonomySubgroup": "Icon button",
  "demoMode": "live",
  "description": "Icon-only aksiyon primitivei; accessible name, selected state ve size kontratini Button ile hizali verir.",
  "sectionIds": [
    "component_library_management",
    "state_feedback",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1"
},
  apiItem: {
  "name": "IconButton",
  "variantAxes": [
    "variant: ghost | secondary | destructive",
    "size: sm | md | lg",
    "state: selected | disabled | loading"
  ],
  "stateModel": [
    "selected",
    "aria-pressed",
    "loading spinner-only",
    "square hit-area"
  ],
  "props": [
    {
      "name": "icon",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Tek zorunlu gorsel slot."
    },
    {
      "name": "label",
      "type": "string",
      "default": "-",
      "required": true,
      "description": "Accessible name kaynagi; aria-label ve title fallback icin kullanilir."
    },
    {
      "name": "selected",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Secondary gorunum ve aria-pressed davranisini açar."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Square hit-area ve density kararini belirler."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Spinner-only loading gorunumu ve interaction block."
    }
  ],
  "previewFocus": [
    "size ve intent matrix",
    "selected + loading + disabled",
    "secondary action button"
  ],
  "regressionFocus": [
    "accessible name zorunlulugu",
    "loading halinde kare hit-area korunumu",
    "selected state semantics"
  ]
},
};

export default entry;
