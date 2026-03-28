import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Modal",
  indexItem: {
  "name": "Modal",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
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
  "importStatement": "import { Modal } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
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
    "previewStates": [
      "open",
      "closed",
      "dark-theme"
    ],
    "behaviorModel": [
      "open / closed",
      "escape dismiss",
      "overlay dismiss",
      "access-aware close affordance",
      "theme-aware token resolution"
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
      "name": "variant",
      "type": "'base' | 'confirm' | 'destructive' | 'audit'",
      "default": "base",
      "required": false,
      "description": "Dialog surface tipini belirler."
    },
    {
      "name": "onClose",
      "type": "(reason?: OverlayCloseReason) => void",
      "default": "-",
      "required": false,
      "description": "Dialog kapatma callback'i; close-button, overlay veya escape nedenini raporlar."
    },
    {
      "name": "slotProps",
      "type": "SlotProps<ModalSlot>",
      "default": "-",
      "required": false,
      "description": "Internal slot elementlerinde className, style vb. override imkani saglar."
    },
    {
      "name": "description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Overlay aciklama icerigi."
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
