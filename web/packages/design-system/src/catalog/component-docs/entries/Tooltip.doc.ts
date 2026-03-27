import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Tooltip",
  indexItem: {
  "name": "Tooltip",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "feedback",
  "subgroup": "tooltips",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Tooltip",
  "demoMode": "live",
  "description": "Hover ve focus ile acilan gorunur tooltip bubble primitivei.",
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
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "actionable_error_messages",
  "roadmapWaveId": "wave_5_overlay",
  "acceptanceContractId": "ui-library-wave-5-overlay-v1",
  "tags": [
    "wave-5",
    "overlay",
    "beta",
    "tooltip"
  ],
  "importStatement": "import { Tooltip } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/page-shell/DesignLabSidebar.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Tooltip",
  "variantAxes": [
    "placement: top | bottom",
    "intent: short hint | guidance",
    "state: hover | focus"
  ],
  "stateModel": [
    "hidden / visible",
    "hover entry",
    "focus entry",
    "hidden access"
  ],
    "previewStates": [
      "open",
      "closed",
      "dark-theme"
    ],
    "behaviorModel": [
      "hidden / visible",
      "hover entry",
      "focus entry",
      "hidden access",
      "theme-aware token resolution"
    ],
  "props": [
    {
      "name": "content",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Tooltip icerigini belirler."
    },
    {
      "name": "placement",
      "type": "'top' | 'bottom' | 'left' | 'right'",
      "default": "top",
      "required": false,
      "description": "Tooltip bubble yonunu belirler."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Tooltip gosterimini devre disi birakir."
    },
    {
      "name": "asChild",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Slot uzerinden child element'e tooltip event handler'larini aktarir; wrapper span'i kaldirir."
    },
    {
      "name": "children",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Tooltip tetikleyicisi."
    },
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Overlay baslik icerigi."
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
      "description": "Wrapper element icin ek CSS sinifi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Tooltip bubble boyut varyantini belirler."
    }
  ],
  "previewFocus": [
    "inline hint",
    "readonly guidance",
    "hover + focus behavior"
  ],
  "regressionFocus": [
    "tooltip visibility toggle",
    "aria-describedby sync",
    "hidden access guard"
  ]
},
};

export default entry;
