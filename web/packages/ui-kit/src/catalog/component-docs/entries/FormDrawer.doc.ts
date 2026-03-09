import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FormDrawer",
  indexItem: {
  "name": "FormDrawer",
  "kind": "component",
  "importStatement": "import { FormDrawer } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "overlays",
  "subgroup": "drawers",
  "tags": [
    "drawer",
    "form",
    "overlay",
    "stable",
    "wave-5"
  ],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "overlays_portals",
  "taxonomySubgroup": "Drawer / Side panel",
  "demoMode": "live",
  "description": "Form akislari icin step-aware ve access-aware side panel primitivei.",
  "sectionIds": [
    "component_library_management",
    "overlay_components",
    "accessibility_compliance"
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
  "roadmapWaveId": "wave_5_overlay",
  "acceptanceContractId": "ui-library-wave-5-overlay-v1"
},
  apiItem: {
  "name": "FormDrawer",
  "variantAxes": [
    "size: md | lg | xl",
    "footer: action-bar | readonly",
    "surface: create | edit | guided-form"
  ],
  "stateModel": [
    "open / closed",
    "escape dismiss",
    "readonly access guard",
    "form submit / cancel flow"
  ],
  "props": [
    {
      "name": "open",
      "type": "boolean",
      "default": "false",
      "required": true,
      "description": "Drawer acikligini controlled olarak yonetir."
    },
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Drawer title ve aria-labelledby kaynagi."
    },
    {
      "name": "footer",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Primary/secondary action alani."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkileşim duzeyi."
    },
    {
      "name": "onClose / onSubmit",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Dismiss ve form aksiyon callbackleri."
    }
  ],
  "previewFocus": [
    "create flow drawer",
    "readonly policy drawer",
    "submit/cancel footer states"
  ],
  "regressionFocus": [
    "escape close parity",
    "readonly submit guard",
    "dialog labelling"
  ]
},
};

export default entry;
