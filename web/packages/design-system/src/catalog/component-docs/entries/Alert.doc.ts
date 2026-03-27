import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Alert",
  indexItem: {
  "name": "Alert",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "feedback",
  "subgroup": "alerts",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Alert / Banner",
  "demoMode": "live",
  "description": "Inline ve kalici feedback akislari icin severity, action, closable ve banner yuzeyi sunan primitive.",
  "sectionIds": [
    "state_feedback",
    "component_library_management",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "loading_empty_error_success_patterns",
  "tags": [
    "feedback",
    "alert",
    "banner",
    "stable"
  ],
  "importStatement": "import { Alert } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
    "web/stories/Alert.stories.tsx"
  ],
    "dependsOn": ["Slot"]
},
  apiItem: {
  "name": "Alert",
  "variantAxes": [
    "variant: info | success | warning | error",
    "content: title | description | action",
    "dismiss: persistent | closable",
    "icon: default | custom"
  ],
  "stateModel": [
    "controlled or uncontrolled open state",
    "severity-based role semantics",
    "access-aware close guard",
    "action slot composition",
    "hidden access visibility block"
  ],
    "previewStates": [
      "disabled",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled or uncontrolled open state",
      "severity-based role semantics",
      "access-aware close guard",
      "action slot composition",
      "hidden access visibility block"
    ],
  "props": [
    {
      "name": "variant",
      "type": "'info' | 'success' | 'warning' | 'error'",
      "default": "'info'",
      "required": false,
      "description": "Alert tonunu, renk sistemini ve varsayilan aria role davranisini belirler."
    },
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Alert basligi."
    },
    {
      "name": "children",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Alert icerik alani."
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "default": "variant'a gore varsayilan ikon",
      "required": false,
      "description": "Custom icon slotu; varsayilan severity ikonunu override eder."
    },
    {
      "name": "action",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Runbook, retry veya detail inspect gibi ikincil aksiyonlari sag tarafa baglar."
    },
    {
      "name": "closable",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Dismiss butonunu gosterir."
    },
    {
      "name": "onClose",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Dismiss callback'i."
    },
    {
      "name": "asChild",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Slot uzerinden child element'e Alert root stilini aktarir."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Alert boyut varyanti."
    }
  ],
  "previewFocus": [
    "severity stack parity",
    "banner + action workflow",
    "closable controlled dismiss",
    "readonly governance note"
  ],
  "regressionFocus": [
    "status vs alert role parity",
    "onOpenChange and onClose ordering",
    "readonly or disabled close guard",
    "icon hidden branch",
    "hidden access render suppression"
  ]
},
};

export default entry;
