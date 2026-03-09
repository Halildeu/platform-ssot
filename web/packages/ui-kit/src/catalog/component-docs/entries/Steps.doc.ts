import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Steps",
  indexItem: {
  "name": "Steps",
  "kind": "component",
  "importStatement": "import { Steps } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "navigation",
  "subgroup": "steps",
  "tags": [
    "beta",
    "navigation",
    "progress",
    "wave-2"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Steps",
  "demoMode": "live",
  "description": "Steps primitivei; cok adimli wizard ve release progress akislari icin status-rich navigation katmani sunar.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "data_entry_validation_recovery",
  "uxPrimarySubthemeId": "multi_step_wizard_progress",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1"
},
  apiItem: {
  "name": "Steps",
  "variantAxes": [
    "orientation: horizontal | vertical",
    "size: sm | md",
    "mode: static | interactive"
  ],
  "stateModel": [
    "complete",
    "current",
    "upcoming",
    "error",
    "optional"
  ],
  "props": [
    {
      "name": "items",
      "type": "StepItem[]",
      "default": "-",
      "required": true,
      "description": "Her adimin title, description, status ve optional bilgisini tasir."
    },
    {
      "name": "value / defaultValue",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Controlled veya uncontrolled aktif adim secimi."
    },
    {
      "name": "interactive",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Wizard veya review akislari icin tiklanabilir adim davranisini acar."
    },
    {
      "name": "orientation",
      "type": "'horizontal' | 'vertical'",
      "default": "horizontal",
      "required": false,
      "description": "Progress kalibinin sayfa icindeki akisini belirler."
    }
  ],
  "previewFocus": [
    "interactive progress",
    "vertical status-rich flow",
    "current step emphasis"
  ],
  "regressionFocus": [
    "aria-current step",
    "interactive change handling",
    "status fallback ordering"
  ]
},
};

export default entry;
