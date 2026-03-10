import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Modal",
  indexItem: {
  "name": "Modal",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "overlays",
  "subgroup": "modal",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Modal / Dialog / Confirm",
  "demoMode": "live",
  "description": "Dialog, confirm ve audit overlay akislari icin token zincirine bagli primitive.",
  "sectionIds": [
    "component_library_management",
    "state_feedback",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "trust_privacy_security_ux",
  "uxPrimarySubthemeId": "high_risk_action_confirmation",
  "roadmapWaveId": "wave_5_overlay",
  "acceptanceContractId": "ui-library-wave-5-overlay-v1",
  "tags": [
    "wave-5",
    "overlay",
    "stable",
    "dialog"
  ],
  "importStatement": "import { Modal } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "Modal",
  "variantAxes": [
    "size: sm | md | lg",
    "dismiss: overlay | escape | close-button",
    "surface: confirm | destructive | audit"
  ],
  "stateModel": [
    "open / closed",
    "escape dismiss",
    "overlay dismiss",
    "access-aware close affordance"
  ],
  "props": [
    {
      "name": "open",
      "type": "boolean",
      "default": "false",
      "required": true,
      "description": "Dialogun acik olup olmadigini belirler."
    },
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Header title ve aria label kaynagi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Dialog genisligini belirler."
    },
    {
      "name": "closeOnOverlayClick / closeOnEscape",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Dismiss davranisini kontrol eder."
    },
    {
      "name": "footer",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Primary/secondary aksiyon alani."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim seviyesi."
    }
  ],
  "previewFocus": [
    "confirm + destructive dialogs",
    "audit readonly dialog",
    "dismiss behavior matrix"
  ],
  "regressionFocus": [
    "escape/overlay close parity",
    "access-aware close button",
    "dialog labelling"
  ]
},
};

export default entry;
