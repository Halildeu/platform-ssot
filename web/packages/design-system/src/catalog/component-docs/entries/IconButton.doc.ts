import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "IconButton",
  indexItem: {
  "name": "IconButton",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "actions",
  "subgroup": "buttons",
  "taxonomyGroupId": "general",
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
  "tags": [
    "wave-1",
    "foundation-primitives",
    "beta",
    "icon-button"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1",
  "importStatement": "import { IconButton } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/page-shell/DesignLabSidebar.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationServerDenseShowcase.tsx"
  ]
},
  apiItem: {
  "name": "IconButton",
  "variantAxes": [
    "variant: ghost | secondary | destructive",
    "size: sm | md | lg",
    "state: selected | disabled | loading"
  ],
  "stateModel": [
    "disabled",
    "loading"
  ],
    "previewStates": [
      "selected",
      "disabled",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "aria-pressed",
      "loading spinner-only",
      "square hit-area",
      "theme-aware token resolution"
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
      "name": "variant",
      "type": "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
      "default": "ghost",
      "required": false,
      "description": "Gorsel stil varyantini belirler."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Spinner-only loading gorunumu ve interaction block."
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
      "type": "AccessLevel",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve interaction kontrolu."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisim kisitlamasi nedenini tooltip olarak gosterir."
    },
    {
      "name": "asChild",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Slot uzerinden child element'e IconButton propslarini aktarir."
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
