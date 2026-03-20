import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FormDrawer",
  indexItem: {
  "name": "FormDrawer",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "overlays",
  "subgroup": "drawers",
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
  "acceptanceContractId": "ui-library-wave-5-overlay-v1",
  "tags": [
    "wave-5",
    "overlay",
    "stable",
    "drawer",
    "form"
  ],
  "importStatement": "import { FormDrawer } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
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
    "previewStates": [
      "open",
      "closed",
      "dark-theme"
    ],
    "behaviorModel": [
      "open / closed",
      "escape dismiss",
      "readonly access guard",
      "form submit / cancel flow",
      "theme-aware token resolution"
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
      "name": "description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Overlay aciklama icerigi."
    },
    {
      "name": "onClose / onSubmit",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Dismiss ve form aksiyon callbackleri."
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
      "type": "'md' | 'lg' | 'xl'",
      "default": "md",
      "required": false,
      "description": "Drawer panel boyut varyantini belirler."
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
