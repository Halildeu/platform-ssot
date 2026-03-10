import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Button",
  indexItem: {
  "name": "Button",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "actions",
  "subgroup": "buttons",
  "taxonomyGroupId": "actions",
  "taxonomySubgroup": "Button",
  "demoMode": "live",
  "description": "Temel aksiyon primitivei; varyant, boyut, loading ve icon slot davranisini tek token zincirinde toplar.",
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
    "stable"
  ],
  "uxPrimaryThemeId": "consistency_and_pattern_governance",
  "uxPrimarySubthemeId": "single_component_source_of_truth",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1",
  "importStatement": "import { Button } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/login/LoginPage.ui.tsx",
    "web/apps/mfe-shell/src/pages/register/RegisterPage.ui.tsx",
    "web/apps/mfe-shell/src/pages/unauthorized/UnauthorizedPage.ui.tsx",
    "web/apps/mfe-shell/src/widgets/app-shell/ui/LoginPopover.ui.tsx",
    "web/apps/mfe-suggestions/src/App.tsx"
  ]
},
  apiItem: {
  "name": "Button",
  "variantAxes": [
    "variant: primary | secondary | ghost | destructive",
    "size: sm | md | lg",
    "loadingDisplay: label | spinner-only"
  ],
  "stateModel": [
    "full",
    "readonly",
    "disabled",
    "loading",
    "fullWidth"
  ],
  "props": [
    {
      "name": "variant",
      "type": "'primary' | 'secondary' | 'ghost' | 'destructive'",
      "default": "primary",
      "required": false,
      "description": "Aksiyon intent katmanini belirler."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Density ve hit-area kararini belirler."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Interaction'i bloke eder ve loading katmanini açar."
    },
    {
      "name": "loadingDisplay",
      "type": "'label' | 'spinner-only'",
      "default": "label",
      "required": false,
      "description": "Loading halinde label korunur mu yoksa sadece spinner mi gosterilir kararini verir."
    },
    {
      "name": "leadingVisual / trailingVisual",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Slot bazli icon/visual alanlari; loading halinde layout jump uretmez."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy temelli görünürlük ve interaction kontrolu."
    }
  ],
  "previewFocus": [
    "variant matrix",
    "size ve icon slot",
    "loading + full width CTA"
  ],
  "regressionFocus": [
    "loading sirasinda slot stabilitesi",
    "keyboard activation ve focus-visible",
    "readonly/disabled click guard"
  ]
},
};

export default entry;
