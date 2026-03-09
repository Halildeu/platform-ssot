import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Popover",
  indexItem: {
  "name": "Popover",
  "kind": "component",
  "importStatement": "import { Popover } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "overlays",
  "subgroup": "popover",
  "tags": [
    "beta",
    "guidance",
    "overlay",
    "popover",
    "wave-5"
  ],
  "availability": "exported",
  "lifecycle": "beta",
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
  "acceptanceContractId": "ui-library-wave-5-overlay-v1"
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
  "props": [
    {
      "name": "trigger",
      "type": "ReactElement",
      "default": "-",
      "required": false,
      "description": "Popover panelini acan referans element."
    },
    {
      "name": "title / content",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Panel basligi ve icerigi."
    },
    {
      "name": "open / defaultOpen",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Controlled veya uncontrolled aciklik durumu."
    },
    {
      "name": "side / align",
      "type": "'top' | 'right' | 'bottom' | 'left' / 'start' | 'center' | 'end'",
      "default": "bottom / center",
      "required": false,
      "description": "Panel konumunu belirler."
    },
    {
      "name": "access / accessReason",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden' / string",
      "default": "full / -",
      "required": false,
      "description": "Policy tabanli gorunurluk ve engel nedeni."
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
