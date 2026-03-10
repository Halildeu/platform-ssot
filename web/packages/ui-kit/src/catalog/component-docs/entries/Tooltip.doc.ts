import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Tooltip",
  indexItem: {
  "name": "Tooltip",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
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
  "importStatement": "import { Tooltip } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
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
  "props": [
    {
      "name": "text",
      "type": "string",
      "default": "-",
      "required": true,
      "description": "Tooltip icerigini belirler."
    },
    {
      "name": "placement",
      "type": "'top' | 'bottom'",
      "default": "top",
      "required": false,
      "description": "Tooltip bubble yonunu belirler."
    },
    {
      "name": "children",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Tooltip tetikleyicisi."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk seviyesi."
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
