import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Button",
  indexItem: {
  "name": "Button",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "actions",
  "subgroup": "buttons",
  "taxonomyGroupId": "general",
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
  "importStatement": "import { Button } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/detail-tabs/DesignLabComponentDetailSections.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/page-shell/DesignLabSidebar.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
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
    "disabled",
    "loading"
  ],
    "previewStates": [
      "full",
      "readonly",
      "disabled",
      "loading",
      "fullWidth",
      "dark-theme"
    ],
    "behaviorModel": ["variant-based styling", "loading state interaction block", "slot-based icon layout", "keyboard activation", "theme-aware token resolution"],
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
      "name": "leadingVisual",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Slot bazli on icon/visual alani; loading halinde layout jump uretmez."
    },
    {
      "name": "trailingVisual",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Slot bazli arka icon/visual alani; loading halinde layout jump uretmez."
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
      "description": "Policy temelli görünürlük ve interaction kontrolu."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisim kisitlamasi nedenini tooltip/title olarak gosterir."
    },
    {
      "name": "asChild",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Slot uzerinden child element'e Button propslarini aktarir."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    },
    {
      "name": "aria-label",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisilebilirlik icin aciklayici etiket."
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
