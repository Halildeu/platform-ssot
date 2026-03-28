import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DetailDrawer",
  indexItem: {
  "name": "DetailDrawer",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "overlays",
  "subgroup": "drawers",
  "taxonomyGroupId": "overlays_portals",
  "taxonomySubgroup": "Drawer / Side panel",
  "demoMode": "live",
  "description": "Detay, audit ve summary akislari icin sekmeli side panel primitivei.",
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
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "confirmation_receipts_and_traceability",
  "roadmapWaveId": "wave_5_overlay",
  "acceptanceContractId": "ui-library-wave-5-overlay-v1",
  "tags": [
    "wave-5",
    "overlay",
    "stable",
    "drawer",
    "detail"
  ],
  "importStatement": "import { DetailDrawer } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-access/src/widgets/access-management/ui/AccessRoleDrawer.ui.tsx",
    "web/apps/mfe-audit/src/app/components/AuditDetailDrawer.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
    "web/apps/mfe-users/src/widgets/user-management/ui/UserDetailDrawer.ui.tsx"
  ]
},
  apiItem: {
  "name": "DetailDrawer",
  "variantAxes": [
    "tabs: summary | audit | details",
    "surface: review | evidence | readonly",
    "width: lg | xl"
  ],
  "stateModel": [
    "open / closed",
    "active tab",
    "escape dismiss",
    "readonly access hint"
  ],
    "previewStates": [
      "open",
      "closed",
      "dark-theme"
    ],
    "behaviorModel": [
      "open / closed",
      "active tab",
      "escape dismiss",
      "readonly access hint",
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
      "description": "Header title ve aria label kaynagi."
    },
    {
      "name": "tabs",
      "type": "DetailDrawerTab[]",
      "default": "-",
      "required": true,
      "description": "Sekmeli icerik yapisini tanimlar."
    },
    {
      "name": "access / accessReason",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden' / string",
      "default": "full / -",
      "required": false,
      "description": "Policy tabanli gorunurluk ve readonly nedeni."
    },
    {
      "name": "description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Overlay aciklama icerigi."
    },
    {
      "name": "onClose",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Dismiss callbacki."
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
      "default": "lg",
      "required": false,
      "description": "Drawer panel boyut varyantini belirler."
    }
  ],
  "previewFocus": [
    "tabbed review drawer",
    "readonly evidence drawer",
    "audit/status tab switch"
  ],
  "regressionFocus": [
    "tab aria wiring",
    "escape close parity",
    "readonly badge visibility"
  ]
},
};

export default entry;
