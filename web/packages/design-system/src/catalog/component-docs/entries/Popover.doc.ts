import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Popover",
  indexItem: {
  "name": "Popover",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "overlays",
  "subgroup": "popover",
  "taxonomyGroupId": "overlays_portals",
  "taxonomySubgroup": "Popover",
  "demoMode": "live",
  "description": "Kisa ama rich guidance ve inline action cluster akislari icin overlay panel.",
  "sectionIds": [
    "overlay_components",
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
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "actionable_error_messages",
  "roadmapWaveId": "wave_5_overlay",
  "acceptanceContractId": "ui-library-wave-5-overlay-v1",
  "tags": [
    "wave-5",
    "overlay",
    "beta",
    "popover",
    "guidance"
  ],
  "importStatement": "import { Popover } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Popover",
  "variantAxes": [
    "side: top | right | bottom | left",
    "align: start | center | end",
    "surface: guidance | policy | action-cluster"
  ],
  "stateModel": [
    "controlled vs uncontrolled open",
    "outside click dismiss",
    "escape dismiss",
    "readonly access guard"
  ],
    "previewStates": [
      "open",
      "closed",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled vs uncontrolled open",
      "outside click dismiss",
      "escape dismiss",
      "readonly access guard",
      "theme-aware token resolution"
    ],
  "props": [
    {
      "name": "trigger",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Popover panelini acan referans element."
    },
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Panel basligi."
    },
    {
      "name": "content",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Panel icerigi."
    },
    {
      "name": "side",
      "type": "'top' | 'right' | 'bottom' | 'left'",
      "default": "bottom",
      "required": false,
      "description": "Panel acilma yonunu belirler."
    },
    {
      "name": "align",
      "type": "'start' | 'center' | 'end'",
      "default": "center",
      "required": false,
      "description": "Panel hizalanmasini belirler."
    },
    {
      "name": "triggerMode",
      "type": "'click' | 'hover' | 'focus' | 'hover-focus'",
      "default": "click",
      "required": false,
      "description": "Popover acma tetikleme modunu belirler."
    },
    {
      "name": "open",
      "type": "boolean",
      "default": "-",
      "required": false,
      "description": "Controlled aciklik durumu."
    },
    {
      "name": "defaultOpen",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Uncontrolled aciklik durumu."
    },
    {
      "name": "onOpenChange",
      "type": "(open: boolean) => void",
      "default": "-",
      "required": false,
      "description": "Aciklik durumu degisim callback'i."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim duzeyi."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisim kisitlamasi nedenini tooltip olarak gosterir."
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
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Popover panel boyut varyantini belirler."
    }
  ],
  "previewFocus": [
    "rich guidance popover",
    "readonly blocked popover",
    "action cluster panel"
  ],
  "regressionFocus": [
    "outside click dismiss",
    "controlled/uncontrolled parity",
    "readonly interaction guard"
  ]
},
};

export default entry;
